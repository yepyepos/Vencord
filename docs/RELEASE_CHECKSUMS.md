# Vencord zh-CN Release Candidate — 校验和

> **当前有效版本：zh.4**（zh.1/zh.2/zh.3 为历史候选：zh.1 四页漏译→zh.2；zh.2 Desktop 实机发现
> Cloud/NotificationLog/BackgroundMaterial/ServerInfo 漏译→zh.3；zh.3 Desktop 实机发现 ServerInfo
> Owner 永久 Loading，由 Phase 5.2.1 功能修复→zh.4。勿分发旧版）
>
> 构建时间：2026-09-29（本地时间）
> 构建 commit：`5a83afcb`（zh-CN 分支，ServerInfo fallback 增加 Open Profile 入口后）
> 基于 upstream：`90aea0ddbbfbee16ce052b2c7ab610ffe957b4ca`（Vendicated/Vencord main，package.json version 1.15.7）
> 构建环境：Node v22.22.1 / pnpm 11.22.0 / Windows
> 状态：**Release Candidate zh.4**（实机复验通过并确认后方可作为正式 Release 发布）
> zh.4 RC 更新说明：在 Owner 修复基础上先后加入 **Owner ID 兜底**（用户拉取失败/超时时显示
> 确定的 ownerId + 复制 ID + 重试）、**有限自动重试**（仅对瞬时 reject 重试 1 次）与
> **Open Profile 入口**（fallback 下可一键打开 Discord 自带用户资料弹窗，成功打开会自动
> 升级为完整 Owner 显示），详见 I18N_AUDIT §22/§23/§24。本表 SHA256 为最终产物。

## Desktop（注入用构建产物）

| 文件 | 大小 | SHA256 |
| --- | --- | --- |
| renderer.js | 894.0 KB | `6fde3e0744cc0666323a33d2c9f02ff379bf4ba8a300219ffa6d5ed3ed18263f` |
| renderer.css | 41.8 KB | `b65982ec769e8de2a0bd06c92a7d398d1cafaa840723ba56cbebd6733613c6fd` |
| patcher.js | 38.3 KB | `04405f057e493347b799604c4a82731f21228857b9de305cb27995e43de95123` |
| preload.js | 2.3 KB | `1acf86ffdd6cf8b9c093c7e8ffe18a491b0314824488e53c08ddb52e9369af4a` |
| vencordDesktopMain.js | 34.7 KB | `d0ccb47930f2b93020f7d6e5bd3464228a817c5e47957b3581fc429e5b7216b9` |
| vencordDesktopPreload.js | 2.3 KB | `275a6a6af317b150103b25c6e026e7186b8e2ae0305f08a3fc3f149a73bae4ff` |
| vencordDesktopRenderer.js | 901.3 KB | `07441d8ced88fd6ccbdc507bb5b21cc3aaa0162c04d3f92b28ef917f9df696c9` |
| vencordDesktopRenderer.css | 41.8 KB | `b65982ec769e8de2a0bd06c92a7d398d1cafaa840723ba56cbebd6733613c6fd` |

## Browser

| 文件 | 大小 | SHA256 |
| --- | --- | --- |
| extension-chrome.zip | 1792.1 KB | `7caa1f8a13ba321d05f910e6cb9e4fc80a977c48ed269f8f5cab9400d7d41a6c` |
| extension-firefox.zip | 1790.8 KB | `7a7533e4dfc4fb4c179a0559c253c80cd5d9ce507e9428ba78030d08f53c4c37` |
| Vencord.user.js（用户脚本） | 928.5 KB | `46104c8c59cc7d6a9e9cf3a46fa0ce7c4f1491a2e2f5c776efd010265495d540` |

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
