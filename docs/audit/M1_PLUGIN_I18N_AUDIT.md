# M1 插件汉化覆盖审计（M1_PLUGIN_I18N_AUDIT）

> 生成：2026-10-02 · 工具：`pnpm tsx scripts/audit-i18n-coverage.ts`（可重复运行）·
> 方法：静态 AST 级正则扫描 `src/plugins/**` 与 `src/**`（非插件）的全部 `t()` 调用，
> 对照 `src/i18n/locales/zh-CN.ts`（1494 键）。

## 总体结果

| 指标 | 值 |
|---|---|
| 扫描插件数 | **168**（src/plugins 全量，含 .browser/.web/.desktop 变体） |
| t() 调用点 | 插件层 220+ / ui.* 层 209 |
| 插件层 key 覆盖率 | **220/220 = 100%** |
| ui.* key 覆盖率（设置页/组件） | **209/209 = 100%** |
| 插件元数据（name+description） | **166/166 = 100%**（含 arRPC 特殊键名核验） |
| 占位符完整性（{xxx} 双向比对） | **0 问题**（插件层 + ui.* 层） |
| 疑似硬编码 UI 英文（启发式） | **0 命中**（去除 t() 后扫描 label/title/description/>Text< 模式） |
| 死键（zh 有而无使用） | 需人工复核项：0（settings.* 667 条由 translateSettingDef 约定消费，不在 t() 统计内） |

## 无 t() 使用的插件（111 个）处置

全部为**行为型插件**（无自有 UI 字符串，例如 alwaysAnimate、noF1、volumeBooster、
usrbg 等）或其用户可见文本由 Discord 自带 zh-CN 提供（i18n.Messages 体系，按设计
不进本翻译表）。抽样核验 memberCount / showHiddenChannels / betterFolders 等：
其 Settings 定义经 `translateSettingDef` 约定（plugin.<Name>.settings.*，667 条已
在表中），无硬编码英文。分类：**KEEP（无需翻译）/ FALSE_POSITIVE**。

## 占位符完整性（任务书第十五）

`{name}`/`{count}`/`{id}` 等：英文 fallback 与 zh 值双向比对 **0 缺失 0 多余**。
未知占位符按 core.ts 设计降级为英文原文，不会产生 `undefined`/`[object Object]`。

## 覆盖方法学说明（防误判）

- t(key, fallback) 体系：英文 fallback 内联于调用点为唯一英文源；zh 表缺键自动
  降级英文——因此"覆盖率 100%"意味着每个调用点都有显式中文条目。
- Discord 自带文本（i18n.Messages）按设计使用 Discord 官方 zh-CN，不属于本表
  审计范围（HEAD 注释明示该边界）。
- settings.* 667 条经 translateSettingDef 约定消费（name/description/displayName/
  placeholder 子键），t() 扫描天然不计数，已单独通过 definePluginSettings 扫描
  与 testI18n 验证。

## 结论

插件与 ui 层汉化覆盖完整，无占位符破坏，无可疑遗漏。
修复建议：无（INFO：scripts/audit-i18n-coverage.ts 建议保留为回归工具，
可在 CI 中在 key 新增时提示补翻）。
