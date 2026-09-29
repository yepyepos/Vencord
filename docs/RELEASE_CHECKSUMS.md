# Vencord zh-CN Release Candidate — 校验和

> **当前有效版本：zh.4**（zh.1/zh.2/zh.3 为历史候选：zh.1 四页漏译→zh.2；zh.2 Desktop 实机发现
> Cloud/NotificationLog/BackgroundMaterial/ServerInfo 漏译→zh.3；zh.3 Desktop 实机发现 ServerInfo
> Owner 永久 Loading，由 Phase 5.2.1 功能修复→zh.4。勿分发旧版）
>
> 构建时间：2026-09-29（本地时间）
> 构建 commit：`02388cb1`（zh-CN 分支，ServerInfo Owner 修复后）
> 基于 upstream：`90aea0ddbbfbee16ce052b2c7ab610ffe957b4ca`（Vendicated/Vencord main，package.json version 1.15.7）
> 构建环境：Node v22.22.1 / pnpm 11.22.0 / Windows
> 状态：**Release Candidate zh.4**（实机复验通过并确认后方可作为正式 Release 发布）

## Desktop（注入用构建产物）

| 文件 | 大小 | SHA256 |
| --- | --- | --- |
| renderer.js | 892.2 KB | `5a015242cb4a935c78cdaf9e44bc12d61d497451e542add9c7ebd765b09bea3d` |
| renderer.css | 41.7 KB | `7fa7397f54a7111b15bd1318e61d25c87489d1228dd4403f0109eddfd1dd15e4` |
| patcher.js | 38.3 KB | `5acc686015f9d10bc4fbdb59b36519798fedecfc7c7fcaa53891b83ccc4bd106` |
| preload.js | 2.3 KB | `cf51af3229d513564dfb54b2e1a586020a21e50a1f518ebcc71b111efc614db6` |
| vencordDesktopMain.js | 34.7 KB | `b7012710b2592c4876b6718b95e52117b58137187a3c71d3ef026954963eb7df` |
| vencordDesktopPreload.js | 2.3 KB | `8ff882a2b94b245afcdc01c127302181ef4836d2339d1bc82e23cfae4b9a9ef4` |
| vencordDesktopRenderer.js | 899.5 KB | `6bcb1e396c21af907a1dda6cd7a0109481e244556889f4493fdc5e40d6969df0` |
| vencordDesktopRenderer.css | 41.7 KB | `7fa7397f54a7111b15bd1318e61d25c87489d1228dd4403f0109eddfd1dd15e4` |

## Browser

| 文件 | 大小 | SHA256 |
| --- | --- | --- |
| extension-chrome.zip | 1791.6 KB | `64cf5fab48e83fea703a75f3ff2543406d5b603ed6dc4deb1f300c0fb2b2e1f3` |
| extension-firefox.zip | 1790.3 KB | `8c9b928c4292be82faa4727690a92bf6998f9fb84218f94385783891c208fb0f` |
| Vencord.user.js（用户脚本） | 926.6 KB | `5496ed3683d05ce487e5452330c3586366e3cc4ce940ac64cd35b5313c2a9c02` |

## 历史候选（已被取代，勿分发）

| 版本 | 构建 commit | 弃用原因 |
| --- | --- | --- |
| zh.1 | `e1adb6da` | Chrome 实机测试发现 Themes / Cloud / Backup & Restore / Patch Helper 四页漏译（Phase 5.1 修复） |
| zh.2 | `9f009d2d` | Desktop 实机测试发现 Cloud 长说明 / Notification Log / Background Material / Server Info 漏译（Phase 5.2 修复） |
| zh.3 | `9edcf50b` | Desktop 实机测试发现 ServerInfo Owner 永久 Loading（Phase 5.2.1 功能修复） |

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
