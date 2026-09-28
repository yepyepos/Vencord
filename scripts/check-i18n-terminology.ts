/**
 * zh-CN terminology drift check, run with: pnpm checkI18nTerms
 *
 * Flags inconsistent translations in src/i18n/locales/zh-CN.ts according to
 * docs/zh-CN-GLOSSARY.md. This is a heuristic net for obvious drift, not a
 * grammar linter. Exits non-zero when drift is found.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(__dirname, "..");
const LOCALE_FILE = join(ROOT, "src", "i18n", "locales", "zh-CN.ts");

const { default: table } = require(LOCALE_FILE) as { default: Record<string, string>; };

// forbidden -> preferred (see docs/zh-CN-GLOSSARY.md)
const DRIFT_RULES: Array<{ bad: string; good: string; note?: string; }> = [
    { bad: "设定", good: "设置" },
    { bad: "扩展", good: "插件", note: "browser-extension contexts may legitimately use 扩展 — review hits" },
    { bad: "服务端", good: "服务器" },
    { bad: "频道室", good: "频道" },
    { bad: "开启", good: "启用", note: "启用 is the action verb per glossary" },
    { bad: "复原", good: "重置" },
    { bad: "角色", good: "身份组", note: "Discord official term" },
    { bad: "过滤", good: "筛选" },
    { bad: "表情包", good: "贴纸", note: "Discord official term for Sticker" },
];

// exact strings where a flagged term is legitimate (browser-extension
// context for 扩展, etc.)
const ALLOWED = new Set([
    "ui.themes.userscript.instead.link", // "Stylus 扩展" — Stylus IS a browser extension
]);

let hits = 0;
for (const [key, value] of Object.entries(table)) {
    if (ALLOWED.has(key)) continue;
    for (const rule of DRIFT_RULES) {
        if (value.includes(rule.bad)) {
            hits++;
            console.error(`DRIFT  ${key}: "${rule.bad}" -> should be "${rule.good}"${rule.note ? ` (${rule.note})` : ""}`);
        }
    }
}

console.log(`\nchecked ${Object.keys(table).length} translations against ${DRIFT_RULES.length} terminology rules`);
if (hits > 0) {
    console.error(`${hits} drift hit(s)`);
    process.exit(1);
}
console.log("no terminology drift found");
