# Vencord zh-CN Release Candidate — 校验和

> **当前有效版本：zh.3**（zh.1/zh.2 为历史候选：zh.1 发现 4 页漏译被 zh.2 取代；zh.2 经 Desktop 实机测试
> 发现 Cloud 长说明/通知日志/背景材质/服务器信息漏译，由 Phase 5.2 修复后被 zh.3 取代。勿分发旧版）
>
> 构建时间：2026-09-29（本地时间）
> 构建 commit：`9edcf50b`（zh-CN 分支，Phase 5.2 修复后）
> 基于 upstream：`90aea0ddbbfbee16ce052b2c7ab610ffe957b4ca`（Vendicated/Vencord main，package.json version 1.15.7）
> 构建环境：Node v22.22.1 / pnpm 11.22.0 / Windows
> 状态：**Release Candidate zh.3**（Desktop/Chrome 实机复验通过并确认后方可作为正式 Release 发布）

## Desktop（注入用构建产物）

| 文件 | 大小 | SHA256 |
| --- | --- | --- |
| renderer.js | 891.3 KB | `91abdbc6fefb128bae0ca4f838608d35b6d9b97a33231860829e911856565872` |
| renderer.css | 41.7 KB | `861f40ea0556d6fb31f992f97173485441d57dbc8a90ed7be7c4ae797c8d7ed1` |
| patcher.js | 38.3 KB | `8cf45e3a19f1a8c2c866209e188f29bebf106798e171533d3432a4f04b1a70f1` |
| preload.js | 2.3 KB | `6f95d78c79879699346d6db35d4da8432947a690f2eb215e3fda74a670dfdf3e` |
| vencordDesktopMain.js | 34.7 KB | `f426c1b46b91bbb621d84580cb2983cd0b441c89093909921f5f542bf267a501` |
| vencordDesktopPreload.js | 2.3 KB | `056115d6e33b4cd4e04b68ef32fb14edc7e7ad427412448e25994b0b3eae78ba` |
| vencordDesktopRenderer.js | 898.6 KB | `4eac6fb8aa1fa496a2875ab8ca97a08b796a934dc3895f2f3fde7980e1e07765` |
| vencordDesktopRenderer.css | 41.7 KB | `861f40ea0556d6fb31f992f97173485441d57dbc8a90ed7be7c4ae797c8d7ed1` |

## Browser

| 文件 | 大小 | SHA256 |
| --- | --- | --- |
| extension-chrome.zip | 1791.2 KB | `abe95dd1fe5799eb8a0a4d5204e953b69645c20fa4f2d71d899e902e25a15f0d` |
| extension-firefox.zip | 1789.9 KB | `42f99bc06f1b93d355215fba3ab54f047364bc7d917e7ed187771a7f8b67973a` |
| Vencord.user.js（用户脚本） | 925.7 KB | `aa45bd1c8ffda6ea785b6c4da6484afd1e6aceb917767a935cd6f28ff817849c` |

## 历史候选（已被取代，勿分发）

| 版本 | 构建 commit | 弃用原因 |
| --- | --- | --- |
| zh.1 | `e1adb6da` | Chrome 实机测试发现 Themes / Cloud / Backup & Restore / Patch Helper 四页漏译（Phase 5.1 修复） |
| zh.2 | `9f009d2d` | Desktop 实机测试发现 Cloud 长说明 / Notification Log / Background Material / Server Info 漏译（Phase 5.2 修复） |

## 产物内容验证

以下产物已验证包含完整 zh-CN 翻译数据（抽查 `plugin.VoiceMessages.name` 与
zh.3 新增 key `ui.cloud.syncRules.heading` / `ui.notificationLog.clear` /
`ui.vencord.backgroundMaterial.mica` / `plugin.ServerInfo.fields.joinedAt`）：

- `chromium-unpacked/dist/Vencord.js` ✅
- `firefox-unpacked/dist/Vencord.js` ✅
- `browser.js`（网页版独立脚本）✅
- `extension.js` ✅
- `renderer.js` / `vencordDesktopRenderer.js`（Desktop）✅

## 复验方法

```powershell
Get-FileHash <file> -Algorithm SHA256
```

```bash
sha256sum <file>
```

> 重新构建会产生字节级一致的产物（相同 commit + 相同工具链）；若哈希不一致，
> 请确认 Node/pnpm 版本与上表构建环境一致，并确认工作树 clean。
