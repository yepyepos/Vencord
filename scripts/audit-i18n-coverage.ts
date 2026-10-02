/*
 * Vencord zh-CN — M1 i18n coverage audit.
 * Run with: pnpm tsx scripts/audit-i18n-coverage.ts
 *
 * Produces the data behind docs/audit/M1_PLUGIN_I18N_AUDIT.md:
 *  - plugin inventory with t() usage and zh-CN key coverage
 *  - placeholder integrity between English fallback and zh-CN values
 *  - heuristic scan for user-visible hardcoded English outside t()
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "src");
const PLUGINS = join(SRC, "plugins");
const ZH = join(SRC, "i18n", "locales", "zh-CN.ts");

function* walk(dir: string): Generator<string> {
    for (const e of readdirSync(dir)) {
        const p = join(dir, e);
        if (statSync(p).isDirectory()) {
            if (e === "node_modules") continue;
            yield* walk(p);
        } else if (/\.(tsx?|jsx?)$/.test(e)) {
            yield p;
        }
    }
}

// zh-CN.ts is pure "key": "value" data — regex-extract it.
const zhSource = readFileSync(ZH, "utf8");
const zhTable = new Map<string, string>();
for (const m of zhSource.matchAll(/"([a-zA-Z0-9_.\-]+)":\s*"((?:[^"\\]|\\.)*)"/g)) {
    zhTable.set(m[1], m[2].replace(/\\"/g, '"'));
}

const plugins = readdirSync(PLUGINS).filter(e => {
    const p = join(PLUGINS, e);
    return statSync(p).isDirectory() || e.endsWith(".tsx");
});

interface Row {
    plugin: string;
    tCalls: number;
    keys: number;
    covered: number;
    placeholdersBroken: string[];
    hardcoded: string[];
}

const rows: Row[] = [];

for (const plugin of plugins) {
    const dir = join(PLUGINS, plugin);
    const files = statSync(dir).isDirectory() ? [...walk(dir)] : [dir];
    let tCalls = 0;
    const keys = new Set<string>();
    const placeholdersBroken = new Set<string>();
    const hardcoded = new Set<string>();

    for (const f of files) {
        const src = readFileSync(f, "utf8");
        const rel = relative(PLUGINS, f).replace(/\\/g, "/");

        // t("key", "fallback") — concat literals folded crudely by joining adjacent strings
        for (const m of src.matchAll(/\bt\(\s*"([a-zA-Z0-9_.\-]+)"\s*(?:,\s*((?:"(?:[^"\\]|\\.)*"\s*)+))?/g)) {
            tCalls++;
            keys.add(m[1]);
            const fallbackRaw = (m[2] ?? "").replace(/"\s*"\s*/g, "").replace(/"/g, "");
            const enPh = new Set(fallbackRaw.match(/\{[a-zA-Z0-9_.]+\}/g) ?? []);
            const zh = zhTable.get(m[1]);
            if (zh !== undefined) {
                const zhPh = new Set(zh.match(/\{[a-zA-Z0-9_.]+\}/g) ?? []);
                for (const ph of enPh) if (!zhPh.has(ph)) placeholdersBroken.add(`${m[1]}: missing ${ph}`);
                for (const ph of zhPh) if (!enPh.has(ph)) placeholdersBroken.add(`${m[1]}: extra ${ph}`);
            }
        }

        // heuristic hardcoded UI strings outside t(): JSX text nodes and common props
        const withoutT = src.replace(/\bt\((?:[^()]|\([^()]*\))*\)/gs, '""');
        for (const m of withoutT.matchAll(/(?:label|title|description|placeholder|text|message|tooltip|name)\s*:\s*"([A-Z][^"]{3,60})"/g)) {
            hardcoded.add(`${rel}: ${m[1]}`);
        }
        for (const m of withoutT.matchAll(/>\s*([A-Z][a-zA-Z ,'’]{4,60})\s*</g)) {
            hardcoded.add(`${rel}: >${m[1]}<`);
        }
    }

    const covered = [...keys].filter(k => zhTable.has(k)).length;
    rows.push({ plugin, tCalls, keys: keys.size, covered, placeholdersBroken: [...placeholdersBroken], hardcoded });
}

rows.sort((a, b) => b.keys - a.keys);

console.log(`plugins scanned: ${rows.length}`);
const totalKeys = rows.reduce((s, r) => s + r.keys, 0);
const totalCovered = rows.reduce((s, r) => s + r.covered, 0);
console.log(`t() keys total: ${totalKeys}, zh-CN covered: ${totalCovered} (${totalKeys ? Math.round(totalCovered / totalKeys * 100) : 100}%)`);

const withBreaks = rows.filter(r => r.placeholdersBroken.length);
console.log(`\n## placeholder problems (${withBreaks.length} plugins)`);
for (const r of withBreaks) console.log(`  ${r.plugin}: ${r.placeholdersBroken.join("; ")}`);

const withHard = rows.filter(r => r.hardcoded.length);
console.log(`\n## suspected hardcoded UI strings (${withHard.length} plugins, heuristic — needs manual KEEP/TRANSLATE/FALSE_POSITIVE triage)`);
for (const r of withHard) for (const h of r.hardcoded.slice(0, 8)) console.log(`  ${r.plugin} :: ${h}`);

console.log(`\n## per-plugin table (keys/covered/tCalls)`);
for (const r of rows) {
    if (r.keys > 0 || r.tCalls > 0) console.log(`  ${r.plugin}: keys=${r.keys} covered=${r.covered} tCalls=${r.tCalls}`);
}
const noI18n = rows.filter(r => r.keys === 0 && r.tCalls === 0);
console.log(`\n## plugins without t() usage (${noI18n.length}) — verify they truly expose no user-visible strings:`);
console.log("  " + noI18n.map(r => r.plugin).join(", "));

// ---- ui.* keys used outside src/plugins (settings pages, components) ----
function* walkSrc(dir: string): Generator<string> {
    for (const e of readdirSync(dir)) {
        const p = join(dir, e);
        if (statSync(p).isDirectory()) {
            if (e === "node_modules" || e === "plugins" || e === "i18n") continue;
            yield* walkSrc(p);
        } else if (/\.(tsx?)$/.test(e)) {
            yield p;
        }
    }
}

const uiUsed = new Map<string, string>();
for (const f of walkSrc(SRC)) {
    const src = readFileSync(f, "utf8");
    for (const m of src.matchAll(/\bt\(\s*"([a-zA-Z0-9_.\-]+)"\s*,\s*((?:"(?:[^"\\]|\\.)*"\s*)+)/g)) {
        if (!uiUsed.has(m[1])) uiUsed.set(m[1], m[2].replace(/"\s*"\s*/g, "").replace(/"/g, ""));
    }
}
const uiUncovered = [...uiUsed.keys()].filter(k => !zhTable.has(k));
console.log(`\n## ui.* keys outside plugins: ${uiUsed.size}, zh-CN covered: ${uiUsed.size - uiUncovered.length}`);
for (const k of uiUncovered) console.log(`  MISSING: ${k} = ${JSON.stringify(uiUsed.get(k))}`);

let uiPhBroken = 0;
for (const [k, fb] of uiUsed) {
    const zhV = zhTable.get(k);
    if (zhV !== undefined) {
        const en = new Set(fb.match(/\{[a-zA-Z0-9_.]+\}/g) ?? []);
        const zhPh = new Set(zhV.match(/\{[a-zA-Z0-9_.]+\}/g) ?? []);
        for (const p of en) if (!zhPh.has(p)) { console.log(`  PH-BROKEN: ${k} missing ${p}`); uiPhBroken++; }
        for (const p of zhPh) if (!en.has(p)) { console.log(`  PH-EXTRA: ${k} extra ${p}`); uiPhBroken++; }
    }
}
console.log(`placeholder problems (ui.*): ${uiPhBroken}`);

const settingsKeys = [...zhTable.keys()].filter(k => k.includes(".settings."));
console.log(`\nzh-CN table: ${zhTable.size} keys total (plugin settings.* entries: ${settingsKeys.length})`);
