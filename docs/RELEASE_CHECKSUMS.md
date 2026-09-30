# Vencord zh-CN Release Candidate — 校验和

> **当前有效版本：zh.4**（zh.1/zh.2/zh.3 为历史候选：zh.1 四页漏译→zh.2；zh.2 Desktop 实机发现
> Cloud/NotificationLog/BackgroundMaterial/ServerInfo 漏译→zh.3；zh.3 Desktop 实机发现 ServerInfo
> Owner 永久 Loading，由 Phase 5.2.1 功能修复→zh.4。勿分发旧版）
>
> 构建时间：2026-09-29（本地时间）
> 构建 commit：`4c73c063`（zh-CN 分支 Stable 定稿态；产物构建于该提交。
> 注：bundle 内嵌构建时 git hash，本文件的哈希记录随之定稿于其后的文档提交，属正常现象）
> 基于 upstream：`90aea0ddbbfbee16ce052b2c7ab610ffe957b4ca`（Vendicated/Vencord main，package.json version 1.15.7）
> 构建环境：Node v22.22.1 / pnpm 11.22.0 / Windows
> 状态：**Stable Release v1.15.7-zh.4**
> zh.4 RC 更新说明：在 Owner 修复基础上先后加入 **Owner ID 兜底**（用户拉取失败/超时时显示
> 确定的 ownerId + 复制 ID + 重试）、**有限自动重试**（仅对瞬时 reject 重试 1 次）与
> **Open Profile 入口**（fallback 下可一键打开 Discord 自带用户资料弹窗，成功打开会自动
> 升级为完整 Owner 显示），详见 I18N_AUDIT §22/§23/§24。本表 SHA256 为最终产物。

## Desktop（注入用构建产物）

| 文件 | 大小 | SHA256 |
| --- | --- | --- |
| renderer.js | 894.0 KB | `03a36ebf1d461c6ad7ea8720e11337dd2178bd0ffe58ec9f7d27aeb7673feb7c` |
| renderer.css | 41.8 KB | `b65982ec769e8de2a0bd06c92a7d398d1cafaa840723ba56cbebd6733613c6fd` |
| patcher.js | 38.3 KB | `2f2e15e07b6af292bc45cb28379e76f7f1327c542569dfe7742c69f822119d03` |
| preload.js | 2.3 KB | `db9a63ca766a53537562735d7bbeccdd7be122aecf0c13cc7dada1b1f9ad7cb2` |
| vencordDesktopMain.js | 34.7 KB | `299a0a0f2a6117ec717a12c773f89d4b0fc4926d73c7cddaf7245d5a336d6a1b` |
| vencordDesktopPreload.js | 2.3 KB | `32d5028f5a11296eded5e8ceec8b893bbe3c3bf6d3bcfcda0a8557b44e253c47` |
| vencordDesktopRenderer.js | 901.3 KB | `1de297b0474be25e34e5d061a90e3bd1ec112c07507a266bf9f412be2dd6b1f5` |
| vencordDesktopRenderer.css | 41.8 KB | `b65982ec769e8de2a0bd06c92a7d398d1cafaa840723ba56cbebd6733613c6fd` |

## Browser

| 文件 | 大小 | SHA256 |
| --- | --- | --- |
| extension-chrome.zip | 1792.1 KB | `c18d59771d66674e05fade5fb17cb74755c0238429e6bb560de28975cefe4472` |
| extension-firefox.zip | 1790.8 KB | `adb83073125410c88189d0cf85b6c01d59216bf3d83da6aa2a333a267cd9fb8f` |
| Vencord.user.js（用户脚本） | 928.5 KB | `919047412adcaa83b841aa97660617a777754669fb7aacf273643d608acb1112` |

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
