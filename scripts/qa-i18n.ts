/**
 * zh-CN release QA, run with: pnpm qaI18n
 *
 * Data-level release checks that go beyond checkI18n:
 *  1. settings structure regression: push a sample of real settings defs
 *     through the translation layer and verify the store schema is untouched
 *  2. template variable report (count of verified pairs)
 *  3. URL / markdown integrity between source descriptions and translations
 *  4. length report: flag translations that are far longer than their source
 *     (potential UI truncation candidates for manual review)
 *  5. sampling dump: prints source|translation pairs for manual review
 *
 * Exits non-zero when a hard check fails.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert";

import { translateSettingDef, type TranslationTable } from "../src/i18n/core";

const ROOT = join(__dirname, "..");
const LOCALE_FILE = join(ROOT, "src", "i18n", "locales", "zh-CN.ts");
const PLUGINS_DIR = join(ROOT, "src", "plugins");

const { default: table } = require(LOCALE_FILE) as { default: TranslationTable; };

function walk(dir: string, out: string[] = []): string[] {
    for (const n of readdirSync(dir)) {
        const p = join(dir, n);
        if (statSync(p).isDirectory()) walk(p, out);
        else out.push(p);
    }
    return out;
}

// ---- collect plugin defs (name -> folder, descriptions) ----
const pluginFolders = readdirSync(PLUGINS_DIR).filter(d => statSync(join(PLUGINS_DIR, d)).isDirectory());
const defsByName = new Map<string, { folder: string; description?: string; settings: Map<string, { code: string; entry: string; }> }>();
for (const folder of pluginFolders) {
    const dir = join(PLUGINS_DIR, folder);
    let name: string | undefined;
    let description: string | undefined;
    const settings = new Map<string, { code: string; entry: string; }>();
    for (const f of readdirSync(dir)) {
        const p = join(dir, f);
        if (!statSync(p).isFile() || !/\.(ts|tsx)$/.test(f)) continue;
        const code = readFileSync(p, "utf8");
        // name/description must come from the definePlugin block, not from
        // settings or menu entries that appear earlier in the file
        const dpIdx = code.indexOf("definePlugin(");
        if (dpIdx !== -1) {
            const block = code.slice(dpIdx, dpIdx + 6000);
            name ??= block.match(/\bname:\s*"([^"]+)"/)?.[1];
            description ??= block.match(/\bdescription:\s*"((?:\\.|[^"\\])+)"/)?.[1]
                ?? block.match(/\bdescription:\s*'((?:\\.|[^'\\])+)'/)?.[1];
        }
        if (!/definePluginSettings/.test(code)) continue;
        // every definePluginSettings({...}) CALL (the import statement also
        // contains the identifier, so match the call's opening brace)
        const callRe = /definePluginSettings\s*\(\s*\{/g;
        let callM: RegExpExecArray | null;
        while ((callM = callRe.exec(code))) {
            const blockStart = callM.index + callM[0].length - 1;
            let depth = 0, blockIdx = blockStart, end = -1;
            for (; blockIdx < code.length; blockIdx++) {
                const c = code[blockIdx];
                if (c === "{" || c === "(") depth++;
                else if (c === "}" || c === ")") { depth--; if (depth === 0) { end = blockIdx; break; } }
                else if (c === '"' || c === "'" || c === "`") {
                    const q = c;
                    blockIdx++;
                    while (blockIdx < code.length && !(code[blockIdx] === q && code[blockIdx - 1] !== "\\")) blockIdx++;
                }
            }
            if (end === -1) break;
            const block = code.slice(blockStart, end);
            const entryRe = /(^|[,{\r\n])\s*([A-Za-z_$][\w$]*)\s*:\s*\{/g;
            let m: RegExpExecArray | null;
            while ((m = entryRe.exec(block))) {
                const key = m[2];
                if (settings.has(key)) continue;
                const close = block.indexOf("}", m.index + m[0].length);
                if (close === -1) continue;
                settings.set(key, { code, entry: block.slice(m.index, close + 1) });
            }
            callRe.lastIndex = end;
        }
    }
    if (name) defsByName.set(name, { folder, description, settings });
}

let failures = 0;
const fail = (msg: string) => { failures++; console.error(`FAIL  ${msg}`); };

// ---- 1. settings structure regression on a deterministic sample ----
// seed derived from table size so the sample is stable across runs
let seed = table["ui.plugins.searchPlaceholder"]?.length ?? 10;
const rand = (n: number) => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed % n;
};

const allVisible: Array<{ plugin: string; key: string; folder: string; entry: string; }> = [];
for (const [name, def] of defsByName) {
    for (const [key, s] of def.settings) {
        const entry = s.entry;
        if (/hidden\s*:\s*true/.test(entry)) continue;
        if (/type\s*:\s*OptionType\.(CUSTOM|COMPONENT)/.test(entry)) continue;
        allVisible.push({ plugin: name, key, folder: def.folder, entry });
    }
}

const sampleSize = Math.min(30, allVisible.length);
const sampled = new Set<number>();
console.log(`\n== settings structure regression (${sampleSize} sampled of ${allVisible.length} visible defs) ==`);
let checkedDefs = 0;
for (let i = 0; i < sampleSize; i++) {
    let idx = rand(allVisible.length);
    while (sampled.has(idx)) idx = (idx + 1) % allVisible.length;
    sampled.add(idx);
    const { plugin, key, folder, entry } = allVisible[idx];
    const translatedKey = keys_get(`plugin.${plugin}.settings.${key}.description`) ?? keys_get(`plugin.${plugin}.settings.${key}.displayName`);
    if (!translatedKey) continue; // untranslated def: nothing to regression-test
    checkedDefs++;

    // rebuild a minimal def object from the source entry
    const typeM = entry.match(/type\s*:\s*OptionType\.(\w+)/);
    const type = typeM?.[1] ?? "BOOLEAN";
    const defObj: Record<string, unknown> = {
        type,
        description: entry.match(/\bdescription\s*:\s*"((?:\\.|[^"\\])*)"/)?.[1] ?? entry.match(/\bdescription\s*:\s*'((?:\\.|[^'\\])*)'/)?.[1],
        displayName: entry.match(/\bdisplayName\s*:\s*"((?:\\.|[^"\\])*)"/)?.[1],
        placeholder: entry.match(/\bplaceholder\s*:\s*"((?:\\.|[^"\\])*)"/)?.[1],
        default: 12345 as unknown as boolean, // sentinel: must survive untouched
        onChange: function onChangeSentinel() { },
        isValid: function isValidSentinel() { return true; },
        restartNeeded: true,
    };
    const copy = translateSettingDef(table, plugin, key, defObj as never) as unknown as Record<string, unknown>;

    // schema must be untouched
    if (copy.default !== 12345) fail(`${plugin}.${key}: default changed`);
    if ((copy as { onChange?: unknown; }).onChange !== defObj.onChange) fail(`${plugin}.${key}: onChange reference changed`);
    if ((copy as { isValid?: unknown; }).isValid !== defObj.isValid) fail(`${plugin}.${key}: isValid reference changed`);
    if (copy.restartNeeded !== true) fail(`${plugin}.${key}: restartNeeded changed`);
    // display strings may change, nothing else
    if (copy.type !== type) fail(`${plugin}.${key}: type changed`);
}
console.log(`   checked ${checkedDefs} translated defs: schema preserved (default/onChange/isValid/restartNeeded/type)`);

// ---- 2. template variable report ----
function extractVars(s: string): Set<string> {
    return new Set([...s.matchAll(/\{(\w+)\}/g)].map(m => m[1]));
}
let varPairs = 0, varMismatch = 0;
console.log(`\n== template variable report ==`);
for (const [key, value] of Object.entries(table)) {
    const m = key.match(/^plugin\.([^.]+)\.settings\.([^.]+)\.description$/);
    if (!m) continue;
    const def = defsByName.get(m[1]);
    if (!def) continue;
    const s = def.settings.get(m[2]);
    if (!s) continue;
    const srcM = s.entry.match(/\bdescription\s*:\s*"((?:\\.|[^"\\])*)"/) ?? s.entry.match(/\bdescription\s*:\s*'((?:\\.|[^'\\])*)'/);
    if (!srcM) continue; // dynamic/backtick descriptions cannot be verified
    const srcVars = extractVars(srcM[1]);
    const trVars = extractVars(value);
    const same = srcVars.size === trVars.size && [...srcVars].every(v => trVars.has(v));
    varPairs++;
    if (!same) { varMismatch++; fail(`template vars differ for ${key}: source {${[...srcVars]}} vs translation {${[...trVars]}}`); }
}
console.log(`   ${varPairs} description pairs verified, ${varMismatch} mismatch(es)`);

// ---- 3. URL / markdown integrity ----
let urlPairs = 0;
console.log(`\n== URL / markdown integrity ==`);
for (const [key, value] of Object.entries(table)) {
    const m = key.match(/^plugin\.([^.]+)\.description$/) ?? key.match(/^plugin\.([^.]+)\.settings\.([^.]+)\.description$/);
    if (!m) continue;
    const def = defsByName.get(m[1]);
    if (!def) continue;
    let source: string | undefined;
    if (m.length === 2) source = def.description;
    else {
        const s = def.settings.get(m[2]!);
        source = s?.entry.match(/\bdescription\s*:\s*"((?:\\.|[^"\\])*)"/)?.[1];
    }
    if (!source) continue;
    const srcUrls = new Set(source.match(/https?:\/\/[^\s"'）)]+/g) ?? []);
    const trUrls = new Set(value.match(/https?:\/\/[^\s"'）)]+/g) ?? []);
    if (srcUrls.size) {
        urlPairs++;
        for (const u of srcUrls)
            if (!trUrls.has(u)) fail(`URL lost in ${key}: ${u}`);
        for (const u of trUrls)
            if (!srcUrls.has(u)) fail(`URL invented in ${key}: ${u}`);
    }
    // markdown links [text](url) must keep the same URL count
    const srcMd = (source.match(/\]\(/g) ?? []).length;
    const trMd = (value.match(/\]\(/g) ?? []).length;
    if (srcMd !== trMd) fail(`markdown link count changed in ${key}: ${srcMd} -> ${trMd}`);
}
console.log(`   ${urlPairs} URL-bearing pairs verified`);

// ---- 4. length report (advisory) ----
console.log(`\n== length report (advisory, Chinese > 2.2x English) ==`);
let longCount = 0;
for (const [key, value] of Object.entries(table)) {
    const m = key.match(/^plugin\.([^.]+)\.description$/) ?? key.match(/^plugin\.([^.]+)\.settings\.([^.]+)\.description$/) ?? key.match(/^plugin\.([^.]+)\.settings\.([^.]+)\.displayName$/);
    if (!m) continue;
    const def = defsByName.get(m[1]);
    let source: string | undefined;
    if (!def) continue;
    if (m.length === 2) source = def.description;
    else {
        const s = def.settings.get(m[2]!);
        source = s?.entry.match(/\b(?:description|displayName)\s*:\s*"((?:\\.|[^"\\])*)"/)?.[1];
    }
    if (!source || source.length < 8) continue;
    if (value.length > source.length * 2.2) {
        longCount++;
        console.log(`   LONG ${key}: ${source.length} -> ${value.length} chars`);
    }
}
if (longCount === 0) console.log("   no candidates");

// ---- 5. sampling dump for manual review ----
console.log(`\n== manual review sample (25 settings + 15 descriptions) ==`);
let dumped = 0;
const dumpedIdx = new Set<number>();
while (dumped < 25) {
    const idx = rand(allVisible.length);
    if (dumpedIdx.has(idx)) continue;
    dumpedIdx.add(idx);
    const { plugin, key, folder, entry } = allVisible[idx];
    const tr = keys_get(`plugin.${plugin}.settings.${key}.description`);
    if (!tr) continue;
    const src = entry.match(/\bdescription\s*:\s*"((?:\\.|[^"\\])*)"/)?.[1] ?? entry.match(/\bdescription\s*:\s*'((?:\\.|[^'\\])*)'/)?.[1];
    if (!src) continue;
    console.log(`   [${plugin}] ${key}\n     EN: ${src}\n     ZH: ${tr}`);
    dumped++;
}
let descDumped = 0;
const pluginNames = [...defsByName.entries()].filter(([, d]) => d.description);
while (descDumped < 15) {
    const idx = rand(pluginNames.length);
    const [name, d] = pluginNames[idx];
    const tr = keys_get(`plugin.${name}.description`);
    if (!tr) continue;
    console.log(`   [${name}] description\n     EN: ${d.description}\n     ZH: ${tr}`);
    descDumped++;
}

function keys_get(key: string): string | undefined {
    return (table as Record<string, string>)[key];
}

// ---- 6. core settings tabs: every file with user-visible strings must use t() ----
// Catches "whole page never localized" regressions (Themes/Cloud/Backup/PatchHelper
// were all missed in Phase 3-4 because nothing scanned src/components).
console.log(`\n== core settings coverage ==`);
const coreDir = join(ROOT, "src", "components", "settings", "tabs");
const keepCoverage = new Set([
    "themes/LocalThemesTab.tsx", // remaining visible strings are brand link labels
]);

const coreVisibleRe = [
    />([A-Z][a-z][^<>{}]*?)</,
    /\b(label|title|tooltip|placeholder|text|description)="([A-Z][a-z][^"]*)"/,
    /(title|label|text|placeholder|description):\s*"([A-Z][a-z][^"]*)"/,
];

let coreFilesChecked = 0;
const coreUnwrapped: Array<{ file: string; line: number; text: string; }> = [];
function scanCore(dir: string) {
    for (const n of readdirSync(dir)) {
        const p = join(dir, n);
        if (statSync(p).isDirectory()) { scanCore(p); continue; }
        if (!/\.tsx$/.test(n)) continue;
        const rel = p.slice(coreDir.length + 1).replace(/\\/g, "/");
        const code = readFileSync(p, "utf8");
        if (!coreVisibleRe.some(re => re.test(code))) continue;
        coreFilesChecked++;
        if (!code.includes('t("') && !code.includes("t(`")) {
            coreUnwrapped.push({ file: rel, line: 0, text: "(file has visible strings but no t() usage)" });
            continue;
        }
        const lines = code.split("\n");
        lines.forEach((line, i) => {
            if (line.includes('t("')) return;
            for (const re of coreVisibleRe) {
                const m = line.match(re);
                if (m) { coreUnwrapped.push({ file: rel, line: i + 1, text: m[1] ?? m[2] ?? m[0] }); break; }
            }
        });
    }
}
scanCore(coreDir);
{
    const logCode = readFileSync(join(ROOT, "src", "api", "Notifications", "notificationLog.tsx"), "utf8");
    coreFilesChecked++;
    logCode.split("\n").forEach((line, i) => {
        if (line.includes('t("')) return;
        const m = line.match(/text:\s*"([A-Z][a-z][^"]*)"/) ?? line.match(/title="([A-Z][a-z][^"]*)"/);
        if (m) coreUnwrapped.push({ file: "api/Notifications/notificationLog.tsx", line: i + 1, text: m[1] });
    });
}

const realUnwrapped = coreUnwrapped.filter(u => !keepCoverage.has(u.file));
console.log(`   checked ${coreFilesChecked} core settings files, ${coreUnwrapped.length} unwrapped hit(s)`);
if (coreUnwrapped.length)
    for (const u of coreUnwrapped) console.log(`   unwrapped: ${u.file}:${u.line} ${u.text}`);
if (realUnwrapped.length) {
    fail(`${realUnwrapped.length} unwrapped user-visible string(s) in core settings tabs`);
} else {
    console.log("   all core settings files with visible strings are t()-covered");
}

console.log(`\n${failures} failure(s)`);
if (failures > 0) process.exit(1);
console.log("QA checks passed");
