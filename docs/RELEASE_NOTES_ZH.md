# Vencord 1.15.7 — 简体中文本地化版（Stable Release）

> 这是 [Vencord](https://github.com/Vendicated/Vencord) 的**社区中文化 Fork**，
> 不是 Discord 官方发行物，也与 Vencord 官方无关。请遵守上游 LICENSE（GPL-3.0-or-later）。

## 基线

| 项 | 值 |
| --- | --- |
| 基于 upstream | https://github.com/Vendicated/Vencord |
| Upstream commit | `90aea0dd`（"fix modals"，package.json version **1.15.7**） |
| Release tag | `v1.15.7-zh.4` |
| Release commit | `685c1914`（tag 所指最终提交） |
| 构建 commit | `4c73c063`（产物内嵌此 git 标识；两者相差一个校验和定稿文档提交，源码内容一致——详见 RELEASE_CHECKSUMS 说明） |

## 中文化范围

- **Vencord 自有 UI**：设置界面（插件/主题/更新器/云同步/Vencord 主设置）、全部 166 个插件的
  名称与描述、271 个可见设置项（标题/描述/占位符）、下拉选项 label、分区标题、公共组件文案；
- **插件运行时 UI**：右键菜单、弹窗、通知条、提示、悬浮面板等 210 处（源自动态 UI 审计清单逐项处理）；
- **核心设置页**：主题/云同步/备份与恢复/补丁助手/通知日志/背景材质/macOS 鲜活度等全部设置页；
- **功能修复**：服务器信息插件在大型服务器中"服务器所有者"永久加载的问题——缓存优先 +
  8 秒超时 + 瞬时失败自动重试 1 次 + Owner ID 兜底（复制 ID / 重试）+ 打开用户资料入口；
  当 Discord 客户端无法取得 User 对象时，显示确定的 Owner ID 并保留重试/资料入口；
- **翻译数据**：1499 条（checkI18n 实测），集中于 `src/i18n/locales/zh-CN.ts` 纯数据文件，
  随 Discord 语言自动切换，缺失 key 自动回退英文原文（永不空白/崩溃）。

## Discord 原生 UI

**不在本项目翻译范围内。** Discord 自身的简体中文界面由 Discord 官方 zh-CN 提供——
请把 Discord 的语言设置为"简体中文"，原生界面与 Vencord 调用的官方文案将自动变为中文。

## 支持

- Desktop（Windows/macOS/Linux Discord 客户端，注入用构建产物）
- Chrome / Chromium（Manifest V3 扩展）
- Firefox（扩展）
- 用户脚本（Vencord.user.js）

## 已知限制

- 品牌、技术术语、命令标识符（如 `/petpet`）、URL、代码、正则等按规范保留英文；
- `_api` 基础设施插件（仅开发者可见）保留英文；
- 少量插件运行时 UI 的动态拼接文案仍为英文回退（详见 `docs/DYNAMIC_UI_AUDIT_ZH_CN.md`）；
- 语言跟随 Discord 语言设置；切换语言后部分已打开的界面需重新打开才会刷新。

## 安装

1. Desktop：使用 Vencord 安装器指向本构建产物（或按 Vencord 官方文档注入 `dist/`）；
2. Chrome/Chromium：解压 `extension-chrome.zip`，在 `chrome://extensions` 开启开发者模式后"加载已解压的扩展程序"；
3. Firefox：`extension-firefox.zip`（about:debugging 临时加载或使用开发者通道）；
4. 校验：下载后请核对 `docs/RELEASE_CHECKSUMS.md` 中的 SHA256。

## 源码与许可证

- Fork：https://github.com/yepyepos/Vencord（`zh-CN` 分支）
- 上游：https://github.com/Vendicated/Vencord（GPL-3.0-or-later）
- 本 Fork 的全部修改同样以 GPL-3.0-or-later 发布；上游版权与作者信息完整保留。
