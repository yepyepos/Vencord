# Vencord zh-CN Release Candidate — 校验和

> **当前有效版本：zh.4**（zh.1/zh.2/zh.3 为历史候选：zh.1 四页漏译→zh.2；zh.2 Desktop 实机发现
> Cloud/NotificationLog/BackgroundMaterial/ServerInfo 漏译→zh.3；zh.3 Desktop 实机发现 ServerInfo
> Owner 永久 Loading，由 Phase 5.2.1 功能修复→zh.4。勿分发旧版）
>
> 构建时间：2026-09-29（本地时间）
> 构建 commit：`a9223010`（zh-CN 分支，ServerInfo Owner 有限自动重试加入后）
> 基于 upstream：`90aea0ddbbfbee16ce052b2c7ab610ffe957b4ca`（Vendicated/Vencord main，package.json version 1.15.7）
> 构建环境：Node v22.22.1 / pnpm 11.22.0 / Windows
> 状态：**Release Candidate zh.4**（实机复验通过并确认后方可作为正式 Release 发布）
> zh.4 RC 更新说明：在 Owner 修复基础上先后加入 **Owner ID 兜底**（用户拉取失败/超时时显示
> 确定的 ownerId + 复制 ID + 重试）与 **有限自动重试**（仅对瞬时 reject 重试 1 次，
> 超时/确定性失败不重试），详见 I18N_AUDIT §22/§23。本表 SHA256 为最终产物。

## Desktop（注入用构建产物）

| 文件 | 大小 | SHA256 |
| --- | --- | --- |
| renderer.js | 893.5 KB | `ddfb9fabdaa44c5da6dbdc9e000d51614299de6d200d9cae5ccae00c859cd21a` |
| renderer.css | 41.8 KB | `b65982ec769e8de2a0bd06c92a7d398d1cafaa840723ba56cbebd6733613c6fd` |
| patcher.js | 38.3 KB | `7e4aee5517019cc27f50f4d53aee85c16377d9cacb0a61228f7c825554c2d2ea` |
| preload.js | 2.3 KB | `03dafb8e18a2b7ce6dc98b546bc4aa94a5b7ec38d3b81edbd75190d0716784eb` |
| vencordDesktopMain.js | 34.7 KB | `7572d58989ad2dd6368c22f3faed7984a87e90f1f68edb691a1de71d279fe6ef` |
| vencordDesktopPreload.js | 2.3 KB | `1a829bd7c5bf611a113edd642d8a587415c9ea421b03ef69da122f06a2f8142c` |
| vencordDesktopRenderer.js | 900.9 KB | `2463a4bda74efadc9d66fbe69d25f58ba7d2dad4157f8337ffe5812b93644791` |
| vencordDesktopRenderer.css | 41.8 KB | `b65982ec769e8de2a0bd06c92a7d398d1cafaa840723ba56cbebd6733613c6fd` |

## Browser

| 文件 | 大小 | SHA256 |
| --- | --- | --- |
| extension-chrome.zip | 1792.0 KB | `ee1f842da5519c5fade716b265d20cb8809d3ba621dd79034954aedf48b2c66d` |
| extension-firefox.zip | 1790.8 KB | `da09a6d63f7c5b3bfd1d12e545023e0af28d76af9358a851624e5fe184cd9733` |
| Vencord.user.js（用户脚本） | 928.1 KB | `78e9bb01c6328f8b56f36c202847e999d5c33384fe70cc38732f6d46d0a0dd32` |

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
