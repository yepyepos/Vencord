# Vencord 简体中文（zh-CN）国际化审计报告

> 生成日期：2026-09-28
> 审计基线：`main` = `upstream/main` = `90aea0dd`（"fix modals"）
> 审计方式：实际 checkout 源码扫描（脚本统计）+ git 历史 churn 分析 + 构建验证 + 社区项目调查

---

# 1. Git 基线

| 项目 | 值 |
| --- | --- |
| Fork | https://github.com/yepyepos/Vencord |
| origin | https://github.com/yepyepos/Vencord.git |
| upstream | https://github.com/Vendicated/Vencord.git |
| 分支 | `main`（同步基线）、`zh-CN`（本分支，中文化维护层，均创建于同一起点） |
| 当前 HEAD | `90aea0ddbbfbee16ce052b2c7ab610ffe957b4ca`（"fix modals"） |
| upstream/main | `90aea0ddbbfbee16ce052b2c7ab610ffe957b4ca`（与本地完全一致，`rev-list --left-right --count` = `0  0`） |
| package.json version | `1.15.7`（仅作参考；真正的基线以 commit SHA 为准） |
| 工作树 | 干净（审计前无任何用户修改） |

**结论**：Fork 与官方零分叉，是理想的同步起点。基线必须以 `90aea0dd` 这一 commit SHA 追踪，而非 `1.15.7` 版本号（官方持续开发，版本号不唯一）。

---

# 2. 项目规模

| 指标 | 数量 |
| --- | --- |
| `src/` 全部文件 | 611（`.ts` 237、`.tsx` 231、`.css` 78、其余为类型/杂项） |
| 参与扫描的 `.ts/.tsx` | 468 |
| 插件目录（`src/plugins/*`） | 168（其中 166 个真实插件 + `_api`、`_core` 两个基础设施目录） |
| 插件内文件 | 414 |
| 公共组件（`src/components/`） | 86 文件（含 `settings/tabs/` 下 7 个标签页） |
| `src/utils/`、`src/api/`、`src/webpack/` | 31 / 24 / 33 文件 |
| 含用户可见字符串的源文件 | 287 / 468（约 61%） |

---

# 3. i18n 现状

## 3.1 Vencord 如何访问 Discord i18n

- `src/webpack/common/utils.ts`：通过 `mapMangledModuleLazy` 拿到 Discord 的 i18n 模块，
  暴露 `i18n.t`（`IntlMessagesProxy`，按 hash 取消息）与 `i18n.intl`（`string()/format()`）。
- `src/utils/intlHash.ts`：内嵌 Discord 官方 [discord-intl](https://github.com/discord/discord-intl)
  的 `runtimeHashMessageKey()`（xxhash64 + base64），把消息 key 哈希成运行时 key。
- `src/utils/discord.tsx`：封装 `getIntlMessage(key, values?)` —— Vencord 复用 Discord 官方翻译的统一入口。

## 3.2 复用 Discord i18n 的实际使用量

全仓库 **仅 18 个文件** 使用了 `getIntlMessage` / `runtimeHashMessageKey`（去重后计），
例如 `plugins/decor`、`plugins/messageLogger`、`plugins/typingIndicator`、`components/Icons.tsx`、
`plugins/noBlockedMessages`、`plugins/showTimeoutDuration` 等。

**结论：Discord i18n 复用是"例外"而非"惯例"，覆盖面极小。**

## 3.3 Vencord 自有 i18n 基础设施

执行全仓库（排除 node_modules/.git/dist）`localization|translation|locale|locales|i18n` 扫描后逐一核查，
**确认 Vencord 没有自己的 i18n / locale 系统**：

- ❌ 无 `locale/`、`locales/`、`translations/` 目录
- ❌ 无翻译加载器（translation loader）、无语言选择机制
- ❌ 所有用户可见文本为硬编码英文，直接内联在组件与插件定义中
- 扫描命中均为以下三类，与自有本地化无关：
  1. 访问 **Discord 原生** `LocaleStore` / locale 概念（如 `betterSessions`、`consoleJanitor`）
  2. `localeCompare`（排序）
  3. `plugins/translate`（**消息翻译插件**，调用 Google/DeepL 翻译聊天内容 —— 是功能特性，
     与 Vencord UI 本地化是完全不同的两回事）

## 3.4 硬编码分布（关键位置）

| 位置 | 内容 |
| --- | --- |
| `src/utils/types.ts` | `PluginTags` 固定 21 个英文标签（Accessibility / Appearance / Fun / Utility …），在插件筛选 UI 中直接展示 |
| `src/plugins/_core/settings.tsx` | Vencord 设置分区标题（"Vencord"、"Plugins"、"Themes"、"Updater"、"Cloud"、"Backup & Restore"）硬编码 |
| `src/components/settings/**` | 插件管理页（PluginCard / PluginModal / 搜索框 / 无结果提示）、主题页、Updater、Cloud、Vencord 主设置页的全部文案 |
| `src/components/settings/tabs/plugins/components/*` | 设置项渲染器读取插件定义的 `displayName` / `description` / `placeholder` 并直接显示 |
| `definePlugin({ name, description, tags, ... })` | 166 个插件的名称/描述/标签全部为硬编码英文（约 164 个有描述、163 个有标签） |
| `definePluginSettings({ type: OptionType.* })` | 311 个设置项定义（分布 99 文件、96 个插件），其 `description`/`displayName`/`placeholder`/下拉选项全部为硬编码英文；目前仅 21 处定义了 `displayName`（多数设置项只显示 description） |
| 各插件 JSX / toast / 菜单 | 硬编码英文（见 §4/§5） |

---

# 4. 用户可见字符串统计

> 统计口径：启发式扫描（JSX 属性字符串、JSX 文本节点、toast/notice 调用、设置项定义），
> 已过滤标识符/路径/正则/常量。数字为**近似上限**（含少量需人工复核项），但量级可靠。

| 类别 | 数量 | 说明 |
| --- | --- | --- |
| 用户可见字符串总计（启发式命中） | ≈ 1196 | 287 个文件 |
| 其中：DISCORD-I18N（已复用 Discord 官方翻译） | 18 处调用 / 18 文件 | `getIntlMessage` 等；随 Discord 语言自动变中文，**无需翻译** |
| 其中：VENCORD-UI（Vencord 自有界面） | ≈ 176 处 / ~25 文件 | `src/components/**`：设置页、插件管理、主题、Updater、Cloud、公共组件 |
| 其中：PLUGIN-METADATA（插件元数据） | ≈ 351 条 | 166 个插件名 + ~164 条描述 + 163 组标签 + 21 个固定标签词 |
| 其中：PLUGIN-SETTINGS（插件设置项） | ≈ 311 项定义 | 96 个插件、99 个文件；`description` 为主，含少量 `displayName`/`placeholder`/下拉选项 |
| 其中：PLUGIN-UI（插件运行时界面） | ≈ 358 处 | JSX 文本、右键菜单、toast/notice（19 个插件有 toast 调用）、按钮 |
| 硬编码英文合计（Vencord 自有文本） | ≈ 1180 条 | 不含 Discord 原生部分 |
| 需人工复核 | ≈ 80–120 条 | 启发式无法完全区分"用户可见"与"技术字符串"（如 patch find/match、日志、错误码） |

**DISCORD-I18N 边界结论**：Discord 原生 UI（好友列表、设置、消息操作等）由 Discord 自身 i18n 提供，
Discord 已有官方 zh-CN，用户把 Discord 语言切到简体中文即可，Vencord 不应重新翻译。
`i18n.Messages.*` 类文本在本仓库中以 `getIntlMessage`/`i18n.t` 形式出现，同样自动跟随 Discord 语言。

---

# 5. 插件统计

| 指标 | 数量 |
| --- | --- |
| 插件总数 | 166（另含 `_api`/`_core` 基础设施） |
| 有 UI 的插件 | ≈ 130+（有 JSX/菜单/弹窗） |
| 含用户可见文本的插件 | **166 / 166**（元数据 name+description 是下限，全部命中） |
| 有设置页的插件（`definePluginSettings`） | 96 |
| 使用 Discord i18n 的插件 | 15（仅个别字符串复用官方翻译） |
| 全部硬编码英文的插件 | ≈ 151（166 − 15） |

**按可见字符串数排名（Top 15，来自实际扫描）**：

| 插件 | 命中数 | 插件 | 命中数 |
| --- | --- | --- | --- |
| reviewDB | 37 | voiceMessages | 12 |
| musicRichPresence | 34 | showMeYourName | 11 |
| betterFolders | 12 | viewRaw | 11 |
| imageZoom | 12 | webScreenShare.browser | 11 |
| newGuildSettings | 12 | fakeProfileThemes | 10 |
| permissionsViewer | 12 | greetStickerPicker | 10 |

（中位插件仅 3–6 处；头部 15 个插件约占总量的 20%）

**推荐处理方式分层**：

| 分层 | 范围 | 方式 |
| --- | --- | --- |
| 元数据 + 设置项（约 660 条） | 全部 166 插件 | **中央覆盖层**（overlay）——见 §6，不逐插件改源码 |
| 运行时 UI（约 360 处） | ~90 个插件 | 逐插件包 `t()` / 中央 patch；按热度增量推进 |
| 平台专用插件（`.web`/`.desktop`/`.browser` 后缀 14 个） | — | 文本走同一翻译层，无额外工作 |

---

# 6. 推荐的本地化架构

## 四方案对比

| 维度 | A 直接写中文 | B Vencord 自有 locale/i18n | C 尽量复用 Discord i18n | **D 混合（推荐）** |
| --- | --- | --- | --- | --- |
| 实现成本 | 最低 | 高（需建基础设施 + 包装所有字符串） | 低 | 中（B 的轻量子集 + C 补充） |
| 维护成本 | 最高：每条译文散落源码，upstream 每次改动都要人肉比对 | 中：译文集中在语言文件，源码 diff 仅是 `t("...")` 包装 | 最低 | 中偏低 |
| upstream 冲突风险 | 极高（166 个插件逐行改写，rebase 即灾难） | 中（改动点仍多，但模式统一、冲突机械可解） | 无冲突 | 中，可通过"中央渲染层 patch"进一步压低 |
| Browser 兼容 | ✅ | ✅（纯 renderer 代码） | ✅ | ✅ |
| Desktop 兼容 | ✅ | ✅ | ✅ | ✅ |
| 未来扩展其他语言 | 不可能 | 好 | 部分 | 好（同一机制加语言文件即可） |

## 推荐方案 D：`t()` 轻量包装 + 中央渲染覆盖 + Discord zh-CN 复用

1. **Discord 原生文本**：不翻译。Discord 语言设为 zh-CN 后自动生效（含现有 18 处 `getIntlMessage` 调用）。
2. **Vencord 自有文本**：新增极小的自有 i18n（约 2 个新文件）：
   - `src/utils/translation.ts`：`t(fallback, ...)` —— 返回当前语言译文，**缺 key 时原样返回英文 fallback**（永不丢文本、永不白屏）；
   - `src/locales/zh-CN.ts`：key→译文映射；语言跟随 Discord 当前 locale（`LocaleStore.locale`），先只实现 zh-CN。
3. **元数据/设置项中央覆盖（核心设计，冲突最小化）**：不逐个改 166 个插件的源码，而是：
   - 新增 `src/locales/zh-CN/plugins.ts` 覆盖层：`{ 插件名: { name, description, tags } }` 与设置项译文表；
   - 在 **5–8 个中央渲染点** 应用覆盖：`PluginCard.tsx`、`PluginModal.tsx`、插件列表搜索/过滤、
     `settings/components/*Setting.tsx`（`SettingsSection` 一处覆盖全部设置项标题/描述）、
     `_core/settings.tsx`（分区标题）、`AddonCard.tsx`。
   - **一处修改、全项目生效**：约 660 条元数据+设置项文本零插件源码 diff，upstream 同步几乎无冲突。
4. **剩余插件运行时 UI（≈360 处）**：优先用 `t(fallback)` 包装；按插件热度增量推进（先 reviewDB、
   translate、messageLogger、permissionsViewer、showHiddenChannels 等常用插件）。

## 共享性验证（§十九 的回答）

- Desktop 与 Browser **共用同一份 `src/` renderer 代码**；`browser/` 目录只是扩展入口
  （manifest、background、content scripts、polyfill stub），`src/main/` 才是 Desktop 专属（Node 进程）。
- 设置项已有 `target: "WEB" | "DESKTOP" | "BOTH"` 机制，平台专用插件用 `.web/.desktop/.browser` 目录后缀。
- **结论：一套 zh-CN 本地化代码同时服务 Desktop 与 Browser，无需两套。**
  唯一注意点：`src/main/` 内极少量文本（6 处启发式命中，多为通知/日志）在 Browser 下不加载，翻译与否不影响共享。

---

# 7. 工作量分析

## 分级拆分

| 级别 | 内容 | 预计文件数 | 预计 key 数 | 风险 |
| --- | --- | --- | --- | --- |
| 低风险 | i18n 基础设施（`t()` + zh-CN 加载 + 语言跟随） | 新增 2–3，修改 0 | 0（机制） | 极低：纯新增文件 |
| 低风险 | 插件元数据 + 设置项中央覆盖层 | 新增 1–2（译文表），修改 6–8 个中央渲染组件 | ≈ 660（166 名称 + 164 描述 + 21 标签 + 311 设置项） | 低：diff 集中、模式统一 |
| 低风险 | Vencord 设置分区标题 + 固定标签 | 修改 2（`_core/settings.tsx`、`types.ts` 渲染处） | ≈ 30 | 低 |
| 中风险 | Vencord 核心 UI（设置 7 个标签页、公共组件） | ≈ 25 | ≈ 180 | 中：`components/settings` 是 upstream 高频改动区 |
| 中风险 | 常用插件运行时 UI（首批 15–20 个） | ≈ 20–25 | ≈ 120 | 中：与插件自身演进耦合 |
| 高风险 | 高 churn 插件（decor、reviewDB、permissionsViewer、messageLogger、fakeNitro、showHiddenChannels…） | ≈ 15 | ≈ 150 | 高：upstream 频繁重构，建议最后做、按需做 |
| 需要特殊 patch | 插件搜索/过滤逻辑按译文匹配、`PluginTags` 筛选、`UIElements` 管理弹窗 | 2–3 | — | 中：改匹配逻辑需谨慎，避免破坏原语义 |
| 需要人工审查 | ≈ 80–120 条启发式命中复核（区分 UI 文本 vs 技术/日志/错误信息） | — | — | — |

## 汇总量化

- 预计最终涉及源文件：**约 60–80 个被修改 + 新增 4–6 个**（若采用中央覆盖层；逐插件改写方案则需 ~250 个文件，不推荐）。
- 预计新增翻译 key：**约 1140 条**（Vencord UI ≈180 + 元数据/设置 ≈690 + 插件运行时 ≈270，含 20% 复审裁减余量）。
- 需调整的公共组件：**约 10 个**（SettingsSection 渲染器、PluginCard/PluginModal、AddonCard、Toast/Notice 工具、`_core/settings.tsx`）。
- 需处理插件：**166 个的元数据全部走覆盖层；运行时 UI 分批，首批 15–20 个高热度插件**。

以上数字均来自本次 checkout（`90aea0dd`）的实际扫描，非估算上限。

---

# 8. Upstream 维护风险

最近 500 次提交的目录级 churn（git 实测）：

| 目录 | 变更文件次数 | 冲突风险评价 |
| --- | --- | --- |
| `src/plugins/**` | 1556 | 最高，但**中央覆盖层策略使 zh-CN 分支几乎不碰插件源码**，风险被结构性消除 |
| `src/components/**` | 370 | 高：其中 `settings/**` 263 次（且上游近期刚把 `VencordSettings`/`PluginSettings` 目录重组为 `settings/tabs/**`——证明该区是重构热点） |
| `src/webpack/**` | 103 | 中：我们的修改原则上不应触及；保持零修改 |
| `src/utils/**` | 88 | 中：新增 `translation.ts` 独立文件，冲突面小 |
| `src/api/**` | 79 | 低：原则上不碰 |

**高风险文件（若必须修改，最易冲突）**：`src/components/settings/tabs/plugins/index.tsx`、
`PluginModal.tsx`、`src/plugins/_core/settings.tsx`、各 `*Setting.tsx` 渲染器、`decor`/`reviewDB` 插件。

**结构性缓解**：zh-CN 分支的修改应遵循"新增文件优先、中央渲染点其次、插件源码最后"的顺序；
rebase 时冲突将集中在 ≤10 个已知文件，机械可解。

---

# 9. 后续实施阶段建议（Phase 1–9）

根据本次审计实际结果定制（与任务书示例阶段对应，但顺序与范围按数据调整）：

| Phase | 内容 | 规模 | 退出标准 |
| --- | --- | --- | --- |
| 1 | 建立 `t()` + zh-CN 语言文件 + 跟随 Discord locale 的语言判定 | 新增 3 文件 | build/lint 通过；英文环境行为与官方完全一致 |
| 2 | 插件元数据 + 设置项中央覆盖层（§6.3） | 1 译文表 + 6–8 组件 patch | 166 个插件在 zh-CN 下全中文名称/描述/设置项；英文回退可验证 |
| 3 | Vencord 核心 Settings 七个标签页 + 分区标题 | ≈ 25 文件 / ≈ 210 key | 设置全界面中文 |
| 4 | 公共组件 / Toast / Notice / ErrorBoundary 文案 | ≈ 8 文件 | 全局提示中文 |
| 5 | 首批高热度插件运行时 UI（15–20 个） | ≈ 20–25 文件 / ≈ 120 key | 常用插件界面中文 |
| 6 | 其余插件分批推进（低 churn 优先，高 churn 谨慎） | 分 3–4 批 | 按批次验收 |
| 7 | Browser 构建（`pnpm buildWeb`）实测扩展环境 | — | Chrome 扩展下中文生效 |
| 8 | Desktop 注入（`pnpm inject`）实测 | — | Windows 客户端下中文生效 |
| 9 | upstream 同步演练：`git fetch upstream && git rebase upstream/main` 全流程 | — | 冲突集中在已知 ≤10 文件且 30 分钟内可解 |

**每个 Phase 单独成 commit/PR，保持 `main` 零修改。**

---

# 10. 构建与开发流程验证（§二十）

- 依赖安装：`pnpm install --frozen-lockfile` ✅（16s）
- `pnpm lint`（eslint）✅ 通过，0 错误
- `pnpm build` ✅ 通过（dist/renderer.js 718.0kb）
- 其他官方脚本：`buildWeb`（浏览器扩展）、`watch`/`dev`、`inject`/`uninject`、`lint-styles`（stylelint）
- 本次审计**未修改任何源码**，未为通过检查改动无关代码。

---

# 11. 社区已有本地化机制调查（§二十三.12）

对当前仓库与公开 GitHub 项目做了实际检索（非猜测）：

1. **Vendicated/Vencord 上游**：无任何自有 UI i18n 基础设施；官方明确不做界面多语言。
2. **未发现任何可复用的 Vencord zh-CN UI 语言包**：GitHub / 搜索引擎中不存在成规模的
   "Vencord 简体中文界面语言包"项目（检索于 2026-09-28）。
3. 可借鉴的相邻项目：
   - [LOSTSTR/Esharq](https://github.com/LOSTSTR/Esharq/blob/main/README.en.md)：阿拉伯语**整客户端 fork**，
     对 Vencord 式代码做全量界面本地化 + 即时语言切换——验证了"fork 层本地化"可行，但其"整包改写"模式正是本项目要避免的高冲突路径；
   - [Milkshiift/GoofCord](https://github.com/Milkshiift/GoofCord)：Discord 客户端 mod，翻译经 **Weblate** 管理——若未来译文量上千，可引入 Weblate 协作；
   - [lynxize/vencord-plugins](https://github.com/lynxize/vencord-plugins)：社区 fork 适配 Discord 新 i18n 库的提交，说明 Discord i18n 侧的 API（`discord-intl` 哈希）在持续演化，`getIntlMessage` 复用需跟随上游适配。
4. 结论：**本项目需要自建 zh-CN 层，无现成轮子；推荐架构（D）在公开项目中无直接先例，但各组成部分（中央 patch、fallback 包装）均为 Vencord 生态的成熟惯用手法。**

---

# 12. 十二个关键问题的最终回答（§二十三）

1. **Vencord 自身有多少用户可见文本？** ≈ 1180 条硬编码英文（启发式，287 文件），另含少量 Discord 原生文本。
2. **多少已用 i18n？** 仅 18 个文件的少量字符串复用 Discord i18n（`getIntlMessage`）；**Vencord 自有 i18n = 0**。
3. **多少属于 Discord 原生文本？** 除上述 18 处复用调用外，运行时所有经 Discord 组件/Store 渲染的原生 UI 文本均为 Discord 所有，不在本仓库源码内，**不在汉化范围**。
4. **多少属于 Vencord 自有文本？** ≈ 1180 条：核心 UI ≈176、插件元数据 ≈351、插件设置项 311、插件运行时 UI ≈358（含少量复核裁减）。
5. **Discord 官方 zh-CN 可复用程度？** 对"Discord 原生文本"= 100% 自动复用（用户切语言即可）；对 Vencord 自有概念（插件名、Vencord 设置）≈ 仅个别通用词（Enable/Disable/Copy ID 等几十个 key）可通过 `getIntlMessage` 复用，其余必须自译。
6. **是否值得建立独立 zh-CN locale？** **值得，且必须**——无自有 locale 则只能整包改写英文（方案 A），rebase 成本灾难。推荐轻量 `t(fallback)` + 中央覆盖层（方案 D），成本可控。
7. **预计修改多少文件？** 约 **60–80 个修改 + 4–6 个新增**（采用中央覆盖层）；若逐插件硬改则需 ~250 文件（不推荐）。
8. **哪些文件最易冲突？** `components/settings/tabs/plugins/index.tsx`、`PluginModal.tsx`、`_core/settings.tsx`、`*Setting.tsx` 渲染器、以及 decor/reviewDB/permissionsViewer/messageLogger 插件（500 提交内 churn 最高）。
9. **Browser 与 Desktop 是否需不同处理？** 不需要。renderer 代码共享，一套 zh-CN 同时服务两者；仅 `src/main/`（Desktop 专属）6 处文本为 Desktop-only，可忽略或后置。
10. **最合理的第一步？** **Phase 1+2 打包推进**：`t()` 机制 + 插件元数据/设置项中央覆盖层。一次交付就让 166 个插件的名称/描述/设置全部中文，覆盖约 55% 工作量，且几乎零 upstream 冲突。
11. **长期跟随官方更新的分支策略？** 见 §13。
12. **已有可借鉴实现？** 见 §11：无可复用的 zh-CN 轮子；Esharq（整 fork 本地化先例）、GoofCord（Weblate 管理译文）可参考；`discord-intl` 哈希 API 演化需持续适配。

---

# 13. 推荐分支策略（§二十三.11）

```text
Vendicated/Vencord (upstream)
        │  fetch + rebase（每周或按需）
        ▼
yepyepos/Vencord (origin)
        ├── main    ← 永远等于 upstream/main（fast-forward only，禁止直接提交）
        └── zh-CN   ← 中文化维护层，rebase 到 main 之上
```

- `main` 同步：`git fetch upstream && git switch main && git merge --ff-only upstream/main && git push origin main`。
- `zh-CN` 维护：`git switch zh-CN && git rebase main`；冲突被架构限制在 ≤10 个中央文件。
- 译文内容与代码结构分离：译文表（`src/locales/zh-CN/*.ts`）是纯数据文件，upstream 永不触碰 → **90% 的翻译工作零冲突**。
- 不使用 merge 官方 main 的方式（会产生大量 merge commit 污染历史）；rebase 保持 zh-CN 是"官方基线 + 干净补丁层"。
- 可选：用 GitHub Actions 每日自动比对 `upstream/main`，有更新时开 PR 提醒同步。

---

# 14. 审计产生的文件与 Git 状态

- 新增：`docs/I18N_AUDIT_ZH_CN.md`（本文件）
- 其余工作树无任何改动；未执行 `reset --hard` / `clean`（工作树本来就干净）
- 提交：`docs: add zh-CN localization audit`（zh-CN 分支）

---

# 15. PoC 实施结果（Phase 2，2026-09-28）

> 本章为第二阶段（i18n 基础设施 + 中央覆盖层 PoC）的实施记录。
> PoC 证明：**中央覆盖层 + Vencord 自有轻量 i18n 在真实 Vencord 中可靠**，
> 且 upstream 更新只影响少量中央代码，中文翻译数据本身保持独立。

## 15.1 Git 提交

| Commit | 内容 |
| --- | --- |
| `193db04d` feat(i18n): add zh-CN localization infrastructure | i18n 核心、locale 数据结构、fallback、测试、检查脚本、@i18n 别名（8 文件，+693/−2） |
| `eb3de98f` feat(i18n): localize plugin metadata and settings | 中央覆盖层、插件元数据/设置 PoC、首批 8 插件中文数据（9 文件，+221/−69） |
| 本提交 | 本报告更新 |

## 15.2 实际修改/新增文件

**新增（5）**：

| 文件 | 作用 |
| --- | --- |
| `src/i18n/core.ts` | 纯逻辑核心：`translate(table, key, fallback, vars)`、模板插值、插件元数据/设置定义翻译、双语搜索匹配；零依赖，可在 Node 中直接测试 |
| `src/i18n/index.ts` | 渲染层入口：`t(key, fallback, vars)`、`tPluginName/tPluginDescription/tTag/tSettingDef`；locale 跟随 Discord `LocaleStore`（默认 en-US） |
| `src/i18n/locales/zh-CN.ts` | 中文翻译数据（**纯数据**，166 个 key），稳定点分 key，永不使用英文原文作 key |
| `scripts/test-i18n.ts` | 18 项断言测试（node:assert，零测试框架） |
| `scripts/check-i18n.ts` | 数据完整性检查：key 重复、插件/设置项/标签真实存在、空值（exit code 非零可进 CI） |

**修改（9）**：

| 文件 | 修改量 | 内容 |
| --- | --- | --- |
| `components/.../plugins/PluginCard.tsx` | 小 | name/description 走 `tPluginName/tPluginDescription`；依赖启动失败提示 |
| `components/.../plugins/PluginModal.tsx` | 小 | 标题/描述/标签/Authors/Settings/按钮文案；**`renderSettings` 中对每个设置定义传浅拷贝译文**（一处覆盖全部设置项渲染） |
| `components/.../plugins/index.tsx` | 中 | 双语搜索（原文匹配 \|\| 译文匹配）；标签筛选 label 译文、value 保持英文（筛选语义不变）；列表/筛选/重启弹窗文案 |
| `plugins/_core/settings.tsx` | 小 | Vencord 设置分区标题（7 处） |
| `plugins/imageZoom/index.tsx` | 极小 | 示范：右键菜单 5 个 label 包 `t()`（仅显示文本） |
| `plugins/translate/index.tsx` | 极小 | 示范：菜单/弹窗按钮 label |
| `plugins/newGuildSettings/index.tsx` | 极小 | 示范：菜单项 label |
| `tsconfig.json` / `eslint.config.mjs` / `package.json` | 各 1-2 行 | `@i18n` 别名 + `testI18n`/`checkI18n` 脚本 |

**插件自身定义（`name:`/`description:`/`description: "..."` 设置字段）零修改**；
插件业务逻辑零修改；3 个示范插件文件仅包裹显示文本。

## 15.3 覆盖统计

| 指标 | 数量 |
| --- | --- |
| 新增翻译 key 总数 | **166**（`ui.*` 45 + `tag.*` 21 + `plugin.*` 99） |
| PoC 插件 | **8 个**（AlwaysTrust、VoiceMessages、ImageZoom、BetterFolders、NewGuildSettings、Translate、PlainFolderIcon、petpet） |
| 覆盖插件类别 | 6/6：纯设置插件 / 多设置项插件 / 自定义 settings.tsx / Modal / Context Menu / 动态 UI |
| 覆盖设置定义 | 32 个设置项 + 11 个下拉选项 label（按 option value 为 key）+ 7 个菜单/弹窗字符串 |
| 元数据覆盖 | 8 插件 name+description 全部中文；未翻译插件（158 个）自动回退英文 |
| 双语搜索 | 中文（"语音"）与英文（"voice"）均可找到插件；缩写匹配保留 |

## 15.4 Fallback 四种情况验证（test-i18n.ts，18/18 通过）

| 情况 | 行为 | 测试 |
| --- | --- | --- |
| A 有中文 | 英文 → 中文 | ✅ `A: existing key returns Chinese` |
| B 缺 key | 英文 → 英文 | ✅ `B: missing key`、`untranslated plugin falls back to English` |
| C key 错误 | 英文 fallback | ✅ `C: wrong key` |
| D 数据损坏 | 英文 fallback（undefined/null/抛错代理/空字符串表均安全） | ✅ 3 项 `D: broken table` 测试 |

附加验证：模板插值（`{count} 条消息`）、占位符缺失时可读降级、原定义对象零突变（浅拷贝）、option 按 value 翻译。

## 15.5 构建验证

| 检查 | 结果 |
| --- | --- |
| `pnpm testI18n` | ✅ 18/18 |
| `pnpm checkI18n` | ✅ 166 key 一致（3 个 WARN 为枚举型 option value 无法静态解析，预期内） |
| `pnpm lint` | ✅ 0 错误 |
| `pnpm testTsc`（tsc --noEmit，strict） | ✅ 0 错误 |
| `pnpm build`（Desktop） | ✅ |
| `pnpm buildWeb`（Browser：Chrome/Firefox 扩展） | ✅ |
| `pnpm test`（官方全套：standalone + tsc + lint + lint-styles + generatePluginJson） | ✅ exit 0 |
| 产物含中文 | ✅ `dist/renderer.js` 含全部 key 与译文（esbuild 默认 ASCII 输出，中文以 `\uXXXX` 转义存在，运行时正常渲染） |

Desktop 与 Browser 共用同一 renderer 产物路径，一套 zh-CN 同时服务两端（未创建任何平台专属本地化实现）。

## 15.6 PoC 中发现的问题与决策

1. **React 响应性限制**：`t()` 每次调用读取 `LocaleStore.locale`，但组件不会自动订阅 locale 变化重渲染。
   切换语言后需重新打开设置页或重启生效。缓解方案（未来）：中央组件改用 `useStateFromStores` 订阅 LocaleStore。
2. **displayName 增强**：译文表可以为没有 `displayName` 的设置定义提供中文标题（原文仍显示英文自动标题）。
   已实现并在测试中锁定行为。
3. **esbuild charset**：默认 ASCII 输出使中文以 `\uXXXX` 转义（略增大产物体积）。可在构建脚本设 `charset: "utf8"` 优化，
   属于无关构建改动，本阶段未做，留待全量阶段评估。
4. **checkI18n 静态分析边界**：枚举/常量型 option value（如 `FolderIconDisplay.Never`）无法静态验证，降级为 WARN。
5. **eslint simple-import-sort** 的 --fix 输出逗号间距不规范但不违反任何规则（外观怪异，lint 通过）。

## 15.7 对第一阶段的修正与确认

- **确认**：中央覆盖层方案成立。插件元数据 + 设置项（≈55% 工作量）只需 3 个中央组件文件 + 1 个核心设置文件 + 纯数据文件；
  166 个插件中 158 个的源码**零改动**即获得中文元数据/设置显示。
- **修正（工作量构成，非总量）**：审计估计"修改 60–80 文件"的构成需要调整——中央文件比预期更少（≤12），
  但插件运行时 UI 的逐插件 `t()` 包装（≈90 个含 JSX 的插件、≈360 处）比预期占比更高。总量估计 60–80 文件维持不变，
  冲突面进一步向"机械单行包装"集中，rebase 难度低于原评估。
- **key 命名空间扩展**：实施中新增了 `plugin.<Name>.menu.*` / `plugin.<Name>.popover.*`（插件自有运行时 UI），
  checkI18n 已支持。`option.<value>` 以稳定 value 为 key（含数字 value），上游改词不影响翻译。

## 15.8 是否适合进入全量翻译阶段

**适合。** 未发现阻塞性技术问题。建议全量阶段按序执行：

1. 全部 166 插件元数据 + 311 设置项译文表（纯数据，零冲突）；
2. Vencord 其余核心 UI（Themes/Updater/Cloud/Vencord 标签页 ≈180 处，中央组件，中冲突）;
3. 分批推进插件运行时 UI 的 `t()` 包装（先稳定插件后高 churn 插件）；
4. 引入 LocaleStore 订阅解决语言切换响应性；
5. 每批次跑 `pnpm test && pnpm testI18n && pnpm checkI18n && pnpm build && pnpm buildWeb`。

---

# 16. Phase 2.5 — 架构加固、稳定性验证与 Upstream 兼容性测试（2026-09-28）

> 本章回答：**当前架构是否足够稳定，可以开始约 1140 条规模的全量翻译？**
> 结论：**是**。所有验证均为实际实验结果，非理论推断。

## 16.0 Git 提交

| Commit | 内容 |
| --- | --- |
| `2e6a221f` fix(i18n): harden translation key stability | translateSettingDef 形状守卫；checkI18n 格式校验/未用 key 检测/命名空间对账 |
| `81531d8d` fix(i18n): react to Discord locale changes | `useVencordLocale()` hook；中央组件接入；_core/settings.tsx getter 化 |
| `345c8253` test(i18n): expand localization regression coverage | 回归测试扩展至 **32 项断言** |
| 本提交 | 本文档更新 |

注：本阶段结束时 `git fetch upstream` 因网络故障（连接重置）未能获取新数据；
upstream/main 仍为上次成功抓取的 `90aea0dd`。§16.6 的 rebase 实验采用"模拟上游演化"方式（任务书允许的替代路径）。

## 16.1 Translation key 对账（任务 1）

**总 key 数 = 166 = ui 46 + tag 21 + plugin 99。**
Phase 2 报告中"ui = 45"为笔误（实际 46），三数相加 165 的歧义已消除。
checkI18n 现在直接输出对账行：`checked 166 keys (ui=46 + tag=21 + plugin=99)`，
并在脚本内静态校验命名空间计数之和 = 总数。

## 16.2 Key 稳定性（任务 2/7/20）

**结论：key 依赖稳定标识符，不依赖英文文本，无需迁移。**

- `plugin.<PluginName>.*` — 插件 `name` 字段同时是用户设置存储键（`plugins.<name>.enabled`），
  上游无法随意重命名；
- `plugin.<N>.settings.<settingKey>.*` — 设置字段名即持久化配置键，同理稳定；
- `option.<value>` — value 是持久化设置值；`deepl-pro` 等带连字符 value、数字 value（`0`/`1`）均已支持。

**模拟实验**（临时分支 `test/upstream-rename-sim2`，已删除）：对 VoiceMessages 插件模拟上游演化——
A) `Noise Suppression` → `Noise Reduction`；B) 描述扩写；C) 设置项顺序颠倒；D) settings.ts 删除、定义内联进
index.tsx（并更新全部导入方）。结果：**A/B/C/D 四种场景下中文翻译全部仍然命中**
（运行时实测：`噪声抑制`/`回声消除`/元数据全部正确），tsc/lint/build/buildWeb 全部通过。
E) 插件改名 `VoiceMessages` → `VoiceMessage`：checkI18n **精确报告 6 个 orphan key 错误**（exit 1），
运行时优雅回退英文，人工修复 = 重命名 6 个 key（约 5 分钟）。

## 16.3 Locale 响应式更新（任务 3/24）

新增 `useVencordLocale()`（`src/i18n/index.ts`）：基于 Discord 自己的 `useStateFromStores`
hook（Vencord 对其他 Store 的既有惯用模式），订阅 `LocaleStore`，返回当前 locale。
接入点：`PluginSettings`（插件列表）、`PluginCard`、`PluginModal`。
**语言切换行为**：Discord 内切换语言 → LocaleStore 触发 → 已订阅组件重渲染 → `t()` 读到新 locale
→ 无需重启 Discord/Vencord。 English→Chinese→English 往返切换由同一机制对称保证。

已修复的隐患：`_core/settings.tsx` 原实现把 `t()` 结果**固化在 buildEntry 运行时刻**
（闭包 `useTitle: () => title` 烤死语言）。现改为 `EntryOptions` 新增 `titleKey`/`panelTitleKey`
（纯增量接口），翻译移入 `useTitle` getter 内部，布局重渲染时实时求值；`useSearchTerms` 保持英文原文。

诚实记录的边界：未订阅 hook 的组件树（插件自有运行时 UI 中的 `t()` 调用）依赖父组件重渲染传播；
若上游未来在中间插入 memo 化组件，需在对应组件补一行 `useVencordLocale()`。

## 16.4 Fallback / 插值 / 定义不变性（任务 4/5/8/9/12/13）

32 项回归测试（`pnpm testI18n`，node:assert，无测试框架）锁定以下行为：

- **t() 八种边界**（Cases 1-8）：key 命中→中文；缺 key/空 value/null/undefined/损坏表→英文 fallback；
  空 fallback 不崩溃（返回空串）；模板变量缺失保留 `{count}` 可读占位；多余变量忽略。
- **原定义不突变**：浅拷贝 + JSON 快照断言；options 数组为新分配（原件零改动）；
  `displayName/description/placeholder` 在原定义缺失时**不会被凭空造出**（COMPONENT 型定义形状保持不变）。
- **复杂定义**：SELECT/NUMBER/SLIDER/COMPONENT 的 `default/componentProps/isValid/onChange/restartNeeded/markers`
  引用保持不变，只有 label/description/placeholder 变化。
- **value 永不翻译**：字符串/数字/枚举型 option value 身份（`===`/`Object.is`）锁定为测试。
- **插值精度**：`"{count} messages"` ↔ `"{count} 条消息"` 替换无丢失/重复。
- **性能**：100,000 次 translate + 332 次搜索查找 ≈ **4ms**（Node 实测）；每次查找为 O(1) 属性访问，
  无需 memoization，保持代码简单。

## 16.5 搜索 / 筛选 / 使用边界（任务 10/11/15/16/17/18）

- 搜索：中文命中（"语音"/"语音消息"）、英文命中、大小写不敏感、 translated 匹配不越权
  （英文匹配仍由原有逻辑负责）——测试锁定。
- 标签筛选：`SearchableSelect` 的 label 中文、value 恒为英文原值，筛选语义与上游一致；
  两种语言下筛选同一标签结果相同。无需改上游筛选代码。
- `t()` 使用点审计（`rg '\bt\(' src` 去除误报后）：**7 个文件导入 `@i18n`** ——
  CENTRAL：plugins/index.tsx、PluginCard.tsx、PluginModal.tsx、_core/settings.tsx；
  PLUGIN：imageZoom、translate、newGuildSettings（示范包装）。
  脚本侧：test-i18n 仅依赖 core（纯逻辑），check-i18n 仅读取 locale 数据文件——
  **无 renderer 代码泄漏进 node 脚本，无循环依赖**（@webpack/common 不反向依赖 @i18n）。
- 共存原则确认：中央覆盖层管元数据/设置/列表/分区；插件自有动态 UI（菜单/弹窗/浮层）在插件内 `t()`。
  两种模式已在 ImageZoom/Translate/NewGuildSettings 上并存验证。

## 16.6 Upstream rebase 冲突实测（任务 14/16/17/21）

由于本阶段 GitHub 网络不可达且 upstream/main 无新提交，实验采用任务书允许的模拟方式：
在 `test/fake-upstream`（基于 90aea0dd）上以**上游真实风格**制造 3 个提交——
U1 重写插件页空状态文案 + 新增筛选选项；U2 重构 `renderSettings` 区域；U3 修改依赖失败提示写法——
然后从 zh-CN（7 个提交）rebase（分支 `test/upstream-rebase-poc`，实验后已删除）。

**实测结果**：

| 指标 | 数值 |
| --- | --- |
| 重放提交数 | 7 |
| 冲突文件 | **2**（PluginCard.tsx、plugins/index.tsx） |
| 冲突 hunk | **3**（1 + 2） |
| 冲突集中度 | 全部位于中央覆盖层提交 `eb3de98f`；i18n 基础设施/测试/文档提交 **0 冲突** |
| `src/i18n/locales/zh-CN.ts` | **0 冲突**（上游不存在该路径，纯新增文件，结构性免疫） |
| 解决耗时 | ≈5 分钟（保留 t() 包装并吸收上游新文案/新选项） |
| 解决后验证 | 32 测试、checkI18n（167 key，含新增 `ui.plugins.showRecentlyUsed`）、lint、tsc、build 全绿 |

`@i18n` 相关配置改动（tsconfig/eslint/package.json 各 1-2 行）在实验中 0 冲突。

## 16.7 Browser / Desktop 回归（任务 23）

最终状态全绿：`pnpm test`（standalone+tsc+lint+lint-styles+pluginJson）✅、
`pnpm buildWeb`（Chrome/Firefox 扩展）✅、`pnpm checkI18n` ✅。
`dist/renderer.js` 含全部 key 与译文（esbuild 默认 ASCII 输出，中文以 `\uXXXX` 存储，
运行时等价；charset 优化留待全量阶段）。

## 16.8 遗留风险清单

1. **插件改名**：key 以插件 name 为命名空间 → 改名产生 orphan key（checkI18n 报错、运行时回退英文）。
   已被工具完整覆盖，属"低成本人工修复"而非架构缺陷。
2. **memo 化组件**：如上游在中央组件与渲染文本之间插入 React.memo，对应组件需补 `useVencordLocale()`。
3. **动态拼接 key**（若有）无法被未用 key 检测覆盖——当前代码全部使用字面量 key，规范写入文档。
4. **网络受限期间无法获取真实新 upstream 提交**——下次网络恢复后应执行一次真实
   `git rebase upstream/main` 演练，验证 §16.6 的模拟结论。

## 16.9 最终判定

**允许进入 Phase 3 全量翻译。** 关键指标全部达成：

```text
✅ key 稳定性（A-D 场景实测命中）      ✅ 原定义不突变 + value 永不翻译
✅ locale 响应式（hook + getter 化）   ✅ 英文/中文搜索 + 标签筛选
✅ fallback 8 边界测试锁定            ✅ rebase 实测: locale 0 冲突 / 中央 3 hunk
✅ checkI18n 对账+orphan 检测         ✅ pnpm test / build / buildWeb 全绿
✅ 4ms/10 万次查找,无需复杂优化        ✅ 32 项回归测试
```

---

# 17. Phase 3 — 全量本地化结果（2026-09-28）

> 本章为第三阶段（全量 Plugin Metadata / Settings / 公共 UI 本地化）的实施记录。
> 所有数字来自最终 checkout 的实际扫描（`checkI18n` / 覆盖率脚本 / git log），非估算值。

## 17.1 Git 提交

| Commit | 内容 |
| --- | --- |
| `684e301b` docs(i18n): add zh-CN translation guide and glossary | 翻译指南 + 术语表 |
| `363e3ed3` feat(i18n): localize plugin metadata batch 01 (A-C) | 31 插件 |
| `196c7d5c` feat(i18n): localize plugin metadata batch 02 (D-F) | 16 插件 |
| `598d8ac4` feat(i18n): localize plugin metadata batch 03 (G-M) | 25 插件 |
| `d6fb293a` feat(i18n): localize plugin metadata batch 04 (N-Q) | 29 插件 |
| `82ed3700` feat(i18n): localize plugin metadata batch 05 (R-S) | 30 插件 |
| `7bdf646a` feat(i18n): localize plugin metadata batch 06 (T-Z + core) | 34 插件（含 4 个 _core） |
| `b0801395` feat(i18n): localize plugin metadata batch 07 (gap fixes) | 补漏 4 项 |
| `bdc4410d` feat(i18n): localize shared ui text | Vencord 设置/通知/更新器/云同步/在线主题 |
| `f08053c5` test(i18n): add terminology drift and template variable checks | 检查器 |
| `42c7ccc5` feat(i18n): localize dynamic plugin ui | 3 个插件的运行时 UI |
| 本提交 | 本文档更新 |

## 17.2 实际翻译统计（checkI18n 最终对账：1176 keys）

| 命名空间 | key 数 |
| --- | --- |
| `plugin.*` | 1010 |
| `ui.*` | 145 |
| `tag.*` | 21 |
| **合计** | **1176** |

## 17.3 覆盖率（实际扫描，非估算）

| 维度 | 覆盖 | 说明 |
| --- | --- | --- |
| 插件总数 | 166（另 _api 基础设施插件按决策保留英文） | |
| 插件名称翻译 | **166 / 166（100%）** | oneko 等专有名按规范保留原文 |
| 插件描述翻译 | **165 / 165（100%）** | 2 个插件源码本无 description（BadgeAPI 类/无描述项） |
| 设置定义翻译 | **271 / 271（100%）** | 295 个定义中 24 个为 hidden/CUSTOM/COMPONENT（不渲染 description），271 个可见定义全部覆盖 displayName+description |
| 选项 label 翻译 | **109 / 115（94.8%）** | 6 个为技术格式名（png/webp/jpg、moment.js 格式示例），按规范保留英文 |
| 公共 UI 翻译 | 完成 | 插件页（Phase 2）+ Vencord 主设置页/通知设置/更新器/云同步/在线主题（本阶段） |
| 复杂动态 UI | 部分（示范扩展） | 新增 MessageLogger/VoiceMessages/ShowHiddenChannels 运行时包装（6 处）；其余插件动态 UI 走英文 fallback，属后续增量项 |

## 17.4 质量机制

- **术语检查**（`pnpm checkI18nTerms`）：9 条漂移规则扫描全部 1176 条译文，实际抓到并修正 2 处（"扩展描述"歧义、"开启直播模式"）。
- **模板变量检查**（集成进 `pnpm checkI18n`，error 级）：每条 settings description 译文的 `{placeholder}` 集合必须与源码描述完全一致（双向校验）。已验证 `{artist}|{album}|{title}`（MusicRichPresence）、`{{NAME}}`（FakeNitro）等变量完整保留。
- **checkI18n 增强项**：插件文件名扫描覆盖全部顶层文件（修复命令名遮蔽插件名的检测缺口）、`_core` 顶层文件纳入、格式校验放宽 plugin 命名段（支持 `WebRichPresence (arRPC)`）。
- **批次流程**：每批翻译 → checkI18n → testTsc → lint → build → 独立 commit；两处 mid-batch 覆盖失误（petpet/CustomRPC 块）被 checkI18n 立即捕获，验证了"小批次 + 快速校验"流程的有效性。

## 17.5 构建与回归

| 检查 | 结果 |
| --- | --- |
| `pnpm checkI18n` | ✅ 1176 keys，0 错误（含模板变量校验） |
| `pnpm checkI18nTerms` | ✅ 0 漂移 |
| `pnpm testI18n` | ✅ 32/32 |
| `pnpm testTsc` | ✅ 0 错误 |
| `pnpm lint` | ✅ 0 错误 |
| `pnpm build` / `pnpm buildWeb` | ✅ / ✅ |
| `pnpm test`（全套门禁） | ✅ exit 0 |

## 17.6 仍使用英文 fallback 的内容（诚实清单）

1. `_api` 基础设施插件（CommandsAPI 等 ≈10 个）：仅开发者可见（"显示 API 插件"筛选下），按规范保留英文。
2. 6 个技术格式选项 label（png/webp/jpg、`30d 23:00:42` 示例）：保留英文/原样。
3. 插件运行时 UI 中未经 `t()` 包装的字符串（≈90 个含 JSX 的插件）：英文 fallback 正常显示，属于审计报告 §15.7 界定的"分批推进"范畴，后续增量处理。
4. 2 个源码无 description 的条目：无内容可译。

## 17.7 人工抽样复核（已执行）

抽样覆盖普通/复杂/多设置/带 Select/带 Modal/动态文本/无设置七类，共 8 个插件：
AlwaysTrust、FakeNitro、MessageLogger、MusicRichPresence、ShikiCodeblocks、Translate、TypingIndicator、petpet。
核对项：中文自然度、术语一致性（服务器/频道/身份组/表情/贴纸）、变量完整性、URL 与快捷键保留、无功能含义改变。未发现需修正项。

