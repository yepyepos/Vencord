# Vencord zh-CN Release Candidate — 校验和

> **当前有效版本：zh.4**（zh.1/zh.2/zh.3 为历史候选：zh.1 四页漏译→zh.2；zh.2 Desktop 实机发现
> Cloud/NotificationLog/BackgroundMaterial/ServerInfo 漏译→zh.3；zh.3 Desktop 实机发现 ServerInfo
> Owner 永久 Loading，由 Phase 5.2.1 功能修复→zh.4。勿分发旧版）
>
> 构建时间：2026-09-29（本地时间）
> 构建 commit：`ed2da7e5`（zh-CN 分支，ServerInfo Owner ID 兜底增强后）
> 基于 upstream：`90aea0ddbbfbee16ce052b2c7ab610ffe957b4ca`（Vendicated/Vencord main，package.json version 1.15.7）
> 构建环境：Node v22.22.1 / pnpm 11.22.0 / Windows
> 状态：**Release Candidate zh.4**（实机复验通过并确认后方可作为正式 Release 发布）
> zh.4 RC 更新说明：在 Owner 修复基础上加入 **Owner ID 兜底**（用户拉取失败/超时时
> 显示确定的 ownerId + 复制 ID + 重试，详见 I18N_AUDIT §22）。本表 SHA256 为该增强后的最终产物。

## Desktop（注入用构建产物）

| 文件 | 大小 | SHA256 |
| --- | --- | --- |
| renderer.js | 893.3 KB | `9bedacc59a79c0fc953e1382a4cbde63a0fed20c2d8acd843ac90bcc83d420ea` |
| renderer.css | 41.8 KB | `b65982ec769e8de2a0bd06c92a7d398d1cafaa840723ba56cbebd6733613c6fd` |
| patcher.js | 38.3 KB | `9145f6b5048b62a29d69d4522444964411e4974fce7514a40eba5a442d1e1425` |
| preload.js | 2.3 KB | `ec4ea76cb8ae6b0047d404f5d5df82cade69a6c2fdeca1b6665b29daf1d808de` |
| vencordDesktopMain.js | 34.7 KB | `f27d4d4ae17638d1a4cac37ebe7d1c3241e7c69978a2ae84d4416d18cbb46ad4` |
| vencordDesktopPreload.js | 2.3 KB | `6d748d76a09a56beb7261fe7808aa8057da413dd5c5dec2f733d93494cc645e5` |
| vencordDesktopRenderer.js | 900.6 KB | `c3fc4ca787dfb1ecc62d932094b38993e2e591bfab1af3725114fd6df1c3d3ce` |
| vencordDesktopRenderer.css | 41.8 KB | `b65982ec769e8de2a0bd06c92a7d398d1cafaa840723ba56cbebd6733613c6fd` |

## Browser

| 文件 | 大小 | SHA256 |
| --- | --- | --- |
| extension-chrome.zip | 1791.9 KB | `6e128a3cf03c94e1e6447ddf335de16db7a310270d1c13f97a6f2b86c81a4636` |
| extension-firefox.zip | 1790.6 KB | `077456385fe5646ad12c49d64c816943a1529558c2d5eeaaeec196ae71966326` |
| Vencord.user.js（用户脚本） | 927.8 KB | `a634b36929afd98395da1fe66a7f53c215adbfcade320c481019bec61e7abfd3` |

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
