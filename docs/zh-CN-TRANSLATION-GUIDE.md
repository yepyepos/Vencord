# Vencord zh-CN 翻译指南（Translation Guide）

> 本文件是 Phase 3 全量本地化的翻译规范。所有提交到 `src/i18n/locales/zh-CN.ts`
> 的译文必须遵守本指南。术语以 `docs/zh-CN-GLOSSARY.md` 为准。

## 1. 总体原则

```text
准确 > 数量        不为了覆盖数牺牲正确性
统一 > 个人习惯    同一概念全文同一译法
可维护 > 一次性    翻译只进 locale 数据文件
官方术语 > 自创    Discord 已有概念优先用 Discord 官方简体中文名词
数据分离 > 改源码  元数据/设置走中央覆盖层，插件源码零改动
稳定 key > 文案    key 永远是稳定标识符，不是英文文案
英文 fallback > 空白  缺译文时必须回退英文而不是留空
```

## 2. 基础 UI 术语（术语表摘要，完整见 GLOSSARY）

| 英文 | 中文 | 备注 |
| --- | --- | --- |
| Settings | 设置 | |
| Plugin | 插件 | |
| Enable / Enabled | 启用 / 已启用 | 动作 vs 状态，严格区分 |
| Disable / Disabled | 禁用 / 已禁用 | |
| Reset / Reset to Default | 重置 / 恢复默认 | |
| Default | 默认 | |
| Appearance | 外观 | |
| Behavior | 行为 | |
| General | 常规 | |
| Advanced | 高级 | |
| Server | 服务器 | Discord 官方译法，不用"服务端" |
| Channel | 频道 | 不用"频道室" |
| Message | 消息 | |
| Notification | 通知 | |
| Permission | 权限 | |
| Role | 身份组 | Discord 官方译法，不用"角色" |
| Thread | 线程 | |
| DM / Direct Message | 私信 | |
| Friend | 好友 | |
| Emoji / Sticker | 表情 / 贴纸 | |
| Guild | 服务器 | Discord 内部词，面向用户译"服务器" |
| Theme | 主题 | |
| Webhook | Webhook | 技术名词保留 |
| Overlay | 游戏内覆盖层 | Discord 官方译法 |
| Context Menu | 右键菜单 | |
| Tooltip | 提示 | |
| Toast | 通知条 | |

## 3. 翻译风格

- 简体中文；书面但不过度正式；简洁、直接、中性。
- 设置描述以"……"陈述句为主，动作句式如"点击……以……"。
- 禁止营销腔（"超级方便！""来试试看吧！"）、网络流行语、颜文字、emoji。
- 按中文语序重组句子，不逐词直译。
- 句末描述用句号，短语/按钮不带句号；全角标点。

## 4. 动词与按钮

- 按钮/动作：单词动词（启用、禁用、保存、重置、删除、添加、编辑、搜索）。
- 状态：过去分词译为"已……"（已启用、已禁用、已保存）。
- "Enable X" 在复选框语境译"启用 X"或"启用此 X"；不要译成"开启"。

## 5. 专有名词与品牌

- 品牌/产品名保留原文：Discord、Vencord、Spotify、YouTube、GitHub、Google、DeepL、Kagi、
  Twitch、Monaco、Shiki、Vesktop、ArRPC 等（完整列表见 GLOSSARY）。
- 技术标准/协议保留原文：WebSocket、OAuth、CSS、HTML、Markdown、regex（正则）、API、URL、ID。
- 无公认中文译名的工具名保留原文。
- 插件名称：功能描述型译为自然中文（BetterFolders → 更好的文件夹）；
  品牌+功能型译品牌+功能（SpotifyControls → Spotify 控制）；
  纯技术标识（API 插件、协议名如 arRPC）保留英文。

## 6. 插件描述

- 自然、简洁、准确；不逐字直译。
- ❌ 不增加原文没有的功能承诺；❌ 不删除重要限制；
- ❌ optional ≠ 必须；may ≠ 一定；experimental 必须译出"实验性"。

## 7. 必须保持原样的内容

```text
URL、快捷键（Ctrl + Shift + P、Alt + Click）、代码、正则、文件路径、
CSS/JS/TS、命令名（/petpet）、插件 ID、配置 value、枚举值、API 名、
函数/变量/文件名、Markdown 链接结构 [text](url)
```

## 8. 模板变量

`{name}`、`{count}`、`${name}` 等占位符名称不得修改、不得增删。
译文变量集合必须与原文一致（checkI18n 强制校验）。

## 9. 大小写与数字

- 中文句子内不混用英文大小写规则；英文专名保持原大小写。
- 数字用半角。

## 10. 术语漂移禁止

同一概念全文只允许一种译法（见 GLOSSARY）。`scripts/check-i18n-terminology.ts`
会检查常见漂移对：设置/设定、插件/扩展、服务器/服务端、频道/频道室、
启用/开启、禁用/关闭、重置/复原、身份组/角色。

## 11. 翻译质量分级（内部管理）

| 级别 | 含义 |
| --- | --- |
| A | 可直接发布 |
| B | 正确，建议后续润色 |
| C | 技术完成，待人工确认 |
| D | 未翻译（保留英文 fallback） |

Release 前：A 必须全通过；B 尽量润色；C 不得作为最终发布；D 仅限明确允许 fallback 的内容。

## 12. 批次流程

每批 20–40 个插件：翻译 → `pnpm checkI18n` → `pnpm testTsc` → `pnpm lint` → `pnpm build`
→ 独立 commit（`feat(i18n): localize plugin metadata batch NN`）。
最终门禁：`pnpm test` + `pnpm buildWeb`。
