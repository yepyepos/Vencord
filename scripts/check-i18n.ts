/**
 * zh-CN translation data integrity check, run with: pnpm checkI18n
 *
 * Validates src/i18n/locales/zh-CN.ts against the actual repository state:
 *  - duplicate keys in the locale file
 *  - plugin.* keys referencing real plugins (scanned from src/plugins)
 *  - plugin.*.settings.* keys referencing real settings definitions
 *  - tag.* keys referencing real entries of PluginTags (@utils/types)
 *  - empty translation values
 *
 * Exits non-zero when problems are found, so it can run in CI.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(__dirname, "..");
const LOCALE_FILE = join(ROOT, "src", "i18n", "locales", "zh-CN.ts");
const PLUGINS_DIR = join(ROOT, "src", "plugins");

let errors = 0;
function error(message: string) {
    errors++;
    console.error(`ERROR  ${message}`);
}

// ---- load the locale file twice: as module (values) and as text (duplicates) ----
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { default: table } = require(LOCALE_FILE) as { default: Record<string, string>; };

const sourceText = readFileSync(LOCALE_FILE, "utf8");
const keyOccurrences = [...sourceText.matchAll(/^\s{4}"([^"]+)"\s*:/gm)].map(m => m[1]);
const seen = new Set<string>();
for (const key of keyOccurrences) {
    if (seen.has(key)) error(`duplicate key: ${key}`);
    seen.add(key);
}

// ---- collect real plugin names from src/plugins/*/ ----
// primary: index/main/def.{ts,tsx}; fallback: any other top-level .ts/.tsx
// (covers _core plugins defined in settings.tsx/noTrack.ts/...)
const pluginNames = new Map<string, string>(); // name -> folder
for (const entry of readdirSync(PLUGINS_DIR)) {
    const dir = join(PLUGINS_DIR, entry);
    if (!statSync(dir).isDirectory()) continue;

    const allTs = readdirSync(dir).filter(f => /\.(ts|tsx)$/.test(f) && statSync(join(dir, f)).isFile());
    const files = [
        ...allTs.filter(f => /^(index|main|def)\.(ts|tsx)$/.test(f)),
        ...allTs.filter(f => !/^(index|main|def)\.(ts|tsx)$/.test(f)),
    ];
    for (const file of files) {
        const code = readFileSync(join(dir, file), "utf8");
        // all name: matches — a plugin file may also contain slash command
        // names etc.; the real plugin name is among them
        for (const m of code.matchAll(/\bname:\s*"([^"]+)"/g)) {
            if (!pluginNames.has(m[1])) pluginNames.set(m[1], entry);
        }
    }
}

// helper: does the given plugin folder define the given settings key?
function pluginDefinesSetting(folder: string, settingKey: string): boolean {
    const dir = join(PLUGINS_DIR, folder);
    for (const file of readdirSync(dir)) {
        const p = join(dir, file);
        if (!statSync(p).isFile() || !/\.(ts|tsx)$/.test(file)) continue;
        const code = readFileSync(p, "utf8");
        // setting keys appear at the start of a line, or after { or ,
        if (new RegExp(`(^|[,{\\r\\n])\\s*${settingKey}\\s*:\\s*\\{`).test(code))
            return true;
    }
    return false;
}

// helper: does the given plugin folder contain the option value literal?
// enums/constants (`value: FolderIconDisplay.Never`) cannot be resolved
// statically, so callers downgrade failures to a warning
function pluginContainsOptionValue(folder: string, settingKey: string, value: string): boolean {
    const dir = join(PLUGINS_DIR, folder);
    for (const file of readdirSync(dir)) {
        const p = join(dir, file);
        if (!statSync(p).isFile() || !/\.(ts|tsx)$/.test(file)) continue;
        const code = readFileSync(p, "utf8");
        if (code.includes(`value: ${value}`) || code.includes(`value: "${value}"`))
            return true;
    }
    return false;
}

// helper: extract the {placeholder} variables used in a source string
function extractTemplateVars(s: string): Set<string> {
    return new Set([...s.matchAll(/\{(\w+)\}/g)].map(m => m[1]));
}

// helper: find the source `description` string of a settings key inside its
// plugin folder and compare {placeholder} variables with the translation
function settingDescriptionVarsMatch(folder: string, settingKey: string, translation: string, key: string): boolean | "unknown" {
    const dir = join(PLUGINS_DIR, folder);
    for (const file of readdirSync(dir)) {
        const p = join(dir, file);
        if (!statSync(p).isFile() || !/\.(ts|tsx)$/.test(file)) continue;
        const code = readFileSync(p, "utf8");
        const entryRe = new RegExp(`(^|[,{\\r\\n])\\s*${settingKey}\\s*:\\s*\\{`, "g");
        let m: RegExpExecArray | null;
        while ((m = entryRe.exec(code))) {
            const entry = code.slice(m.index, m.index + 4000);
            const descM = entry.match(/\bdescription\s*:\s*("((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)')/);
            if (!descM) continue;
            const source = descM[2] ?? descM[3] ?? "";
            const sourceVars = extractTemplateVars(source);
            const translatedVars = extractTemplateVars(translation);
            for (const v of sourceVars)
                if (!translatedVars.has(v)) { error(`template variable {${v}} missing in translation: ${key}`); return false; }
            for (const v of translatedVars)
                if (!sourceVars.has(v)) { error(`template variable {${v}} not present in source: ${key}`); return false; }
            return true;
        }
    }
    return "unknown";
}

// ---- collect real tag list from @utils/types ----
const typesSource = readFileSync(join(ROOT, "src", "utils", "types.ts"), "utf8");
const pluginTagsBlock = typesSource.match(/export const PluginTags = \[([^\]]*)\]/)?.[1] ?? "";
const realTags = new Set([...pluginTagsBlock.matchAll(/"([^"]+)"/g)].map(m => m[1]));

// ---- validate every key ----
const PLUGIN_KEY_RE = /^plugin\.([^.]+)\.(name|description)$/;
const SETTING_KEY_RE = /^plugin\.([^.]+)\.settings\.([^.]+)(?:\.(displayName|placeholder|description))?$/;
const OPTION_KEY_RE = /^plugin\.([^.]+)\.settings\.([^.]+)\.option\.(.+)$/;
const TAG_KEY_RE = /^tag\.(.+)$/;
const KNOWN_NAMESPACES = /^(ui|tag|plugin)\./;

for (const [key, value] of Object.entries(table)) {
    if (typeof value !== "string" || value.trim().length === 0)
        error(`empty translation: ${key}`);

    if (!KNOWN_NAMESPACES.test(key)) {
        error(`unknown namespace (expected ui.*/tag.*/plugin.*): ${key}`);
        continue;
    }

    // option value segments may contain dashes (e.g. option.deepl-pro);
    // plugin names may contain spaces/parens (e.g. "WebRichPresence (arRPC)")
    // so strict identifier segments are only enforced for ui.*/tag.* keys —
    // plugin.* keys are validated against real plugins/settings below instead
    if (!key.startsWith("plugin.") && !/^(?:ui|tag)\.[\w-]+(?:\.[\w-]+)*$/.test(key)) {
        error(`malformed key (expected dotted identifiers): ${key}`);
        continue;
    }

    let match: RegExpMatchArray | null;

    if ((match = key.match(PLUGIN_KEY_RE))) {
        const [, pluginName] = match;
        if (!pluginNames.has(pluginName)) {
            error(`plugin not found for ${key} (scanned ${pluginNames.size} plugins)`);
        } else if (key.endsWith(".name") && value === pluginName) {
            console.warn(`WARN   ${key} is identical to the plugin name`);
        }
        continue;
    }

    if ((match = key.match(SETTING_KEY_RE))) {
        const [, pluginName, settingKey, field] = match;
        const folder = pluginNames.get(pluginName);
        if (!folder) {
            error(`plugin not found for ${key}`);
        } else if (!pluginDefinesSetting(folder, settingKey)) {
            error(`settings key "${settingKey}" not found in plugin ${pluginName} (${key})`);
        } else if (field === "description") {
            // template variable consistency: translation must use exactly the
            // {placeholders} the source description uses
            settingDescriptionVarsMatch(folder, settingKey, value, key);
        }
        continue;
    }

    if ((match = key.match(OPTION_KEY_RE))) {
        const [, pluginName, settingKey, value] = match;
        const folder = pluginNames.get(pluginName);
        if (!folder) {
            error(`plugin not found for ${key}`);
        } else if (!pluginDefinesSetting(folder, settingKey)) {
            error(`settings key "${settingKey}" not found in plugin ${pluginName} (${key})`);
        } else if (!pluginContainsOptionValue(folder, settingKey, value)) {
            // may be a constant/enum option value which cannot be verified statically
            console.warn(`WARN   option value "${value}" not found verbatim for ${pluginName}.${settingKey} (${key})`);
        }
        continue;
    }

    if ((match = key.match(/^plugin\.([^.]+)\.(?:menu|popover|ui|modal|tooltip|button|heading|player|notification|toast|badge|badges|section|page|preview|lockScreen|details|fields|verification|owner|icon)\./))) {
        const [, pluginName] = match;
        if (!pluginNames.has(pluginName)) error(`plugin not found for ${key}`);
        continue;
    }

    if (key.startsWith("plugin.")) {
        const pluginName = key.split(".")[1];
        if (!pluginNames.has(pluginName)) error(`plugin not found for ${key}`);
        else console.warn(`WARN   unrecognized plugin.* key structure (only plugin existence checked): ${key}`);
        continue;
    }

    if ((match = key.match(TAG_KEY_RE))) {
        if (!realTags.has(match[1])) error(`unknown plugin tag: ${key}`);
        continue;
    }
}

// ---- summary / reconciliation ----
const keys = Object.keys(table);
const byNamespace: Record<string, number> = {};
for (const key of keys) {
    const ns = key.split(".")[0];
    byNamespace[ns] = (byNamespace[ns] ?? 0) + 1;
}
const parts = Object.entries(byNamespace).map(([ns, n]) => `${ns}=${n}`).join(" + ");
console.log(`\nchecked ${keys.length} keys (${parts}) against ${pluginNames.size} plugins and ${realTags.size} tags`);

// static cross-check: the sum of namespace counts must equal the total
const sum = Object.values(byNamespace).reduce((a, b) => a + b, 0);
if (sum !== keys.length) {
    error(`namespace counts (${parts}) do not add up to total ${keys.length}`);
}

// ---- unused ui.* key detection (literal occurrence in src) ----
// keys referenced dynamically (template literals) cannot be found and will
// be reported as unused: check the report before acting on a warning
let unusedUiKeys = 0;
if (byNamespace.ui) {
    const srcDir = join(ROOT, "src");
    const srcFiles: string[] = [];
    (function walk(dir: string) {
        for (const name of readdirSync(dir)) {
            const p = join(dir, name);
            if (statSync(p).isDirectory()) walk(p);
            else if (/\.(ts|tsx)$/.test(name)) srcFiles.push(p);
        }
    })(srcDir);

    const srcCode = srcFiles.map(f => readFileSync(f, "utf8")).join("\n");
    for (const key of keys.filter(k => k.startsWith("ui."))) {
        if (!srcCode.includes(key)) {
            console.warn(`WARN   unused ui.* key (not referenced in src): ${key}`);
            unusedUiKeys++;
        }
    }
}

if (errors > 0) {
    console.error(`${errors} error(s)`);
    process.exit(1);
}
console.log(`zh-CN locale data is consistent${unusedUiKeys ? ` (${unusedUiKeys} unused ui.* key warning(s))` : ""}`);
