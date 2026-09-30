# Vencord zh-CN

**Vencord 简体中文社区本地化版** —— 基于 [Vendicated/Vencord](https://github.com/Vendicated/Vencord) 的社区维护 Fork。

> ⚠️ 本项目**不是** Discord 官方中文版，也**不是** Vencord 官方发行版本。
> Discord 是 Discord Inc. 的商标，此处提及仅为描述用途，不代表任何 affiliation 或 endorsement。

当前稳定版本：[**v1.15.7-zh.4**](https://github.com/yepyepos/Vencord/releases/tag/v1.15.7-zh.4)（基于 Vencord **1.15.7**）

## 这是什么？

Vencord 是一个流行的 Discord 客户端增强模块（100+ 内置插件、自定义 CSS/主题、隐私友好、支持浏览器端）。
官方 Vencord 的界面是英文的，**本项目在其基础上为 Vencord 自有用户界面提供大范围简体中文本地化**，
让中文用户无需阅读英文即可使用全部功能。

与官方 Vencord 的主要区别：

1. **简体中文本地化**：Vencord 自有 UI 全量中文化（1499 条翻译，详见下文"中文化范围"）；
2. **稳定性改进**：包含针对 ServerInfo 服务器拥有者加载问题的修复；
3. **持续跟随官方**：通过 upstream 同步机制维护与官方版本的兼容。

## 下载

前往 [**Releases 页面**](https://github.com/yepyepos/Vencord/releases) 下载已构建好的版本，
无需安装 Node.js 或 pnpm：

| 平台 | 文件 |
| --- | --- |
| Chrome / Chromium | `extension-chrome.zip` |
| Firefox | `extension-firefox.zip` |
| 用户脚本 | `Vencord.user.js` |
| Desktop（注入用） | 见 Release 说明（Desktop 产物通过 Vencord 安装器使用） |

## 安装方式

### Chrome / Chromium

1. 下载并解压 `extension-chrome.zip`；
2. 打开 `chrome://extensions`，开启右上角"开发者模式"；
3. 点击"加载已解压的扩展程序"，选择解压后的文件夹。

### Firefox

1. 下载 `extension-firefox.zip` 并解压；
2. 打开 `about:debugging` → "此 Firefox" → "临时载入附加组件"，
   选择解压后的 `manifest.json`（开发者通道加载，重启浏览器后需重新加载）。

### UserScript（用户脚本）

1. 安装一个支持 UserScript 的浏览器扩展管理器；
2. 从 Releases 下载 `Vencord.user.js` 并导入安装。

### Desktop（Windows/macOS/Linux 的 Discord 客户端）

Desktop 通过 Vencord 安装器注入使用，有两种方式：

- **普通用户**：参考 [Vencord 官方下载页](https://vencord.dev/download) 了解安装器的工作方式，
  并使用本仓库 Release 说明中列出的构建产物；
- **开发者 / 测试者**：从源码构建后执行 `pnpm build` + `pnpm inject`
  （将本仓库的构建注入选定的 Discord 安装；`pnpm uninject` 还原）。

> Desktop 安装完成后，打开 Discord 设置即可看到 Vencord 分区。

## 中文化范围

| 范围 | 状态 |
| --- | --- |
| 插件名称 / 描述（166 个插件） | ✅ |
| 插件设置（271 个可见设置项 + 选项标签） | ✅ |
| Vencord 设置页面（插件/主题/更新器/云同步/备份恢复/补丁助手等） | ✅ |
| 插件标签（Tags，21 个） | ✅ |
| 插件运行时 UI（右键菜单/弹窗/通知条/提示等） | ✅ |
| Discord 原生界面 | 使用 [Discord 官方简体中文](https://support.discord.com/hc/zh-cn)，不在本项目范围内 |

当前翻译规模：**1499 条**（`pnpm checkI18n` 实测）。
翻译缺失时自动回退英文原文，永不空白或报错。

> 请注意：这不是"100% 中文化 Discord"。品牌名、技术术语、命令、URL、代码等按规则保留英文；
> Discord 原生界面请使用 Discord 自带的语言设置切换为简体中文。

## 功能增强：ServerInfo Owner 稳定性

本 Fork 包含对"服务器信息"插件的稳定性改进，修复大型服务器中查看服务器拥有者时
可能永久停留在"加载中"的问题：

- 缓存优先（Owner 用户已在本地时立即显示）
- 超时保护（8 秒）
- 瞬时失败自动重试 + 手动重试
- 获取失败时显示确定的 Owner ID，并提供 **复制 ID / 打开用户资料 / 重试** 入口

> 准确说明：当 Discord 客户端能够取得对应 User 对象时显示完整用户信息；
> 无法取得时保留确定的 Owner ID。本项目不会调用 Discord 之外的 API。

## 已知限制

1. Discord 原生界面不属于本项目翻译范围（使用 Discord 官方 zh-CN）；
2. 品牌、技术标识、命令（如 `/petpet`）、URL、代码、正则等按规则保留英文；
3. 少量开发者向 / 技术文本保留英文（API 插件、替换语法表等）；
4. 本 Stable 版本基于 **Vencord 1.15.7**；官方 upstream（当前已至 v1.15.9+）将在后续维护周期同步；
5. Fork 构建无法使用官方 Updater 的更新源（更新通过本仓库 Release 进行）；
6. 语言跟随 Discord 语言设置；切换语言后已打开的界面需重新打开才会刷新。

## 使用风险提示（来自官方 Vencord）

<details>
<summary>使用 Vencord（包括任何客户端修改）违反 Discord 服务条款</summary>

Discord 对客户端修改相对宽容，目前没有已知的因使用客户端修改（不限于 Vencord）导致封号的案例。
只要不使用具有滥用行为的插件，通常不会有问题，且所有内置插件都是安全的。

但如果你的账号非常重要，出于安全考虑，建议不要使用任何客户端修改。
另外，请避免在可能因此封禁的服务器中发布带有 Vencord 界面的截图。

</details>

## 与官方 Vencord 的关系

本项目 Fork 自 [Vendicated/Vencord](https://github.com/Vendicated/Vencord)（The cutest Discord client mod）。

本仓库主要维护：

1. Vencord 自有界面的简体中文本地化；
2. 必要的本地稳定性修复（如 ServerInfo Owner）；
3. 与 upstream 的兼容维护（upstream → main → zh-CN 的同步流程）。

**本项目不是 Vendicated/Vencord 的官方发行版本**，Vencord 的官方下载与文档请访问
[vencord.dev](https://vencord.dev)。如需支持官方项目，请前往
[官方仓库](https://github.com/Vendicated/Vencord)。

## 开发 / 维护

源码构建与测试（适用于开发者和测试者）：

```bash
pnpm install      # 安装依赖
pnpm build        # Desktop 构建
pnpm buildWeb     # Browser 扩展构建
pnpm test         # 官方全套检查
pnpm inject       # 将本地构建注入 Discord（测试用）
pnpm uninject     # 还原注入
```

本项目通过 upstream 跟随官方 Vencord 更新，维护流程：
`upstream → 同步 main → rebase zh-CN → i18n QA → 构建 → 实机测试 → 新的 zh Release`。

## 项目文档

| 文档 | 内容 |
| --- | --- |
| [翻译指南](docs/zh-CN-TRANSLATION-GUIDE.md) / [术语表](docs/zh-CN-GLOSSARY.md) | 译文规范与术语统一 |
| [国际化审计](docs/I18N_AUDIT_ZH_CN.md) | 各阶段审计、实施与发布记录 |
| [Dynamic UI 审计](docs/DYNAMIC_UI_AUDIT_ZH_CN.md) | 插件运行时 UI 覆盖台账 |
| [Core Settings 审计](docs/CORE_SETTINGS_AUDIT_ZH_CN.md) | 设置页覆盖台账 |
| [GUI 测试检查单](docs/GUI_TEST_CHECKLIST.md) | 实机验证清单 |
| [发布校验和](docs/RELEASE_CHECKSUMS.md) / [发布说明](docs/RELEASE_NOTES_ZH.md) | SHA256 与版本说明 |
| [Upstream 维护基线](docs/UPSTREAM_MAINTENANCE_2026.md) | 下一同步周期基线 |

## License

本项目遵循 Vencord 的 [GPL-3.0-or-later](LICENSE) 许可证。
上游版权与作者信息完整保留——Vencord 由 [Vendicated 及贡献者](https://github.com/Vendicated/Vencord/graphs/contributors) 开发，
本 Fork 的本地化与修复在其之上进行。

---

### 上游项目

- 官方 Vencord：https://github.com/Vendicated/Vencord （官网：https://vencord.dev）
- 官方社区服务器：https://discord.gg/D9uwnFnqmd
