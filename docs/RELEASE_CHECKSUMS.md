# Vencord zh-CN Release Candidate — 校验和

> **当前有效版本：zh.4**（zh.1/zh.2/zh.3 为历史候选：zh.1 四页漏译→zh.2；zh.2 Desktop 实机发现
> Cloud/NotificationLog/BackgroundMaterial/ServerInfo 漏译→zh.3；zh.3 Desktop 实机发现 ServerInfo
> Owner 永久 Loading，由 Phase 5.2.1 功能修复→zh.4。勿分发旧版）
>
> 构建时间：2026-09-29（本地时间）
> 构建 commit：`09ab9714`（zh-CN 分支，Stable Release 最终 commit）
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
| renderer.js | 894.0 KB | `cb0e68c8bfaed944532ef47e265ab197fc5ada7d81f9abfd08d4bede6c1cff2d` |
| renderer.css | 41.8 KB | `b65982ec769e8de2a0bd06c92a7d398d1cafaa840723ba56cbebd6733613c6fd` |
| patcher.js | 38.3 KB | `5c26fb88bfeb238e17774afbe17ddf8a4d340db807fc25b5aec47332af8ee02c` |
| preload.js | 2.3 KB | `619eb94e7b78e249c070f01bc83b63be309e183f8afb3ba2a20a4908069e73ef` |
| vencordDesktopMain.js | 34.7 KB | `07d93e877f8b8e6ea71e03e578d6260e9366374752fa81ebdd5a7702442744db` |
| vencordDesktopPreload.js | 2.3 KB | `61aa67a99a010fec6b3fb06667ad198c9563679cc952300d0dce1e91807e2a01` |
| vencordDesktopRenderer.js | 901.3 KB | `f20c36f5964bc417320793e74eef1616fa704bdf7512bfd15b97f485a4f7011f` |
| vencordDesktopRenderer.css | 41.8 KB | `b65982ec769e8de2a0bd06c92a7d398d1cafaa840723ba56cbebd6733613c6fd` |

## Browser

| 文件 | 大小 | SHA256 |
| --- | --- | --- |
| extension-chrome.zip | 1792.1 KB | `6c340fbd6decbc33c8094253b06044071ec46fa6af9647f32cddfb88969a8a59` |
| extension-firefox.zip | 1790.8 KB | `6c1db67285e2ccfc74394c2a1ab58bde50a1ecc1934d6f9bd2532a9a9eb8da04` |
| Vencord.user.js（用户脚本） | 928.5 KB | `8bd01528f889a152c0e22aa83f847889a218700ed826c427ccb0fb6045f4c4fa` |

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
