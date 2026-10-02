import { readFileSync } from "node:fs";
const src = readFileSync("src/i18n/locales/zh-CN.ts", "utf8");
const table = new Map();
for (const m of src.matchAll(/"([a-zA-Z0-9_.\-]+)":\s*"((?:[^"\\]|\\.)*)"/g)) table.set(m[1], m[2]);
console.log("table size:", table.size);
const picks = [
    "ui.plugins.searchPlaceholder",
    "plugin.ServerInfo.fields.serverOwner",
    "plugin.ServerInfo.owner.retry",
    "plugin.ServerInfo.owner.unavailable",
    "plugin.Translate.description",
    "plugin.CustomRPC.description",
    "ui.common.loading",
    "plugin.reviewDB.description",
];
for (const k of picks) {
    const v = table.get(k);
    console.log(`${k} = ${v === undefined ? "(ABSENT)" : v}`);
}
// count a few canonical terms across all zh values
const counts = { 设置: 0, 插件: 0, 主题: 0, 通知: 0, 备份: 0, 恢复: 0, 重启: 0, 服务器所有者: 0 };
for (const v of table.values()) for (const t of Object.keys(counts)) if (v.includes(t)) counts[t]++;
console.log("term counts:", JSON.stringify(counts));
