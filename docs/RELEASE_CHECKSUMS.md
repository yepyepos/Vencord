# Vencord zh-CN Release Candidate — 校验和

> **当前有效版本：zh.2**（zh.1 为首次 RC，实机 Chrome 测试发现 4 个设置页漏译后已由 zh.2 取代，勿混用）
>
> 构建时间：2026-09-28（本地时间）
> 构建 commit：`9f009d2d`（zh-CN 分支，Phase 5.1 修复后）
> 基于 upstream：`90aea0ddbbfbee16ce052b2c7ab610ffe957b4ca`（Vendicated/Vencord main，package.json version 1.15.7）
> 构建环境：Node v22.22.1 / pnpm 11.22.0 / Windows
> 状态：**Release Candidate zh.2**（实机 GUI 复验完成并确认后方可作为正式 Release 发布）

## Desktop（注入用构建产物）

| 文件 | 大小 | SHA256 |
| --- | --- | --- |
| renderer.js | 846.8 KB | `562f6c3242fad6e5aa8816c3a49d21c996cac87a13fe653d29bfc1551609499e` |
| renderer.css | 41.7 KB | `861f40ea0556d6fb31f992f97173485441d57dbc8a90ed7be7c4ae797c8d7ed1` |
| patcher.js | 38.8 KB | `cebe1a64f6aacf65bbb7c1514cef7ac205638654a71fd48509d972646e6c0f89` |
| preload.js | 2.3 KB | `8fa7f31d38a957f3c273b190c5cc2133e55b6cd6ec8c263432fcd7e075620ed1` |
| vencordDesktopMain.js | 34.9 KB | `a70016758de47f3db3d2fd3f6281b5e8bd96186dc0c0069418a0ae6cfefba7f8` |
| vencordDesktopPreload.js | 2.3 KB | `0d11235b4ca83db1d366e9f0498ca18691d4f457177708717a89bf4669094abd` |
| vencordDesktopRenderer.js | 854.1 KB | `000ab45dc82f45feb3a6d1c8aed6ad3a5cad4e11ac3d6d66c2f2224104f220ad` |
| vencordDesktopRenderer.css | 41.7 KB | `861f40ea0556d6fb31f992f97173485441d57dbc8a90ed7be7c4ae797c8d7ed1` |

## Browser

| 文件 | 大小 | SHA256 |
| --- | --- | --- |
| extension-chrome.zip | 1789.5 KB | `01cec39f5a96e0bcf57176b1343584bfd87e4aadb35e8416b80a664eeb62a025` |
| extension-firefox.zip | 1788.2 KB | `fa5f7ffbc151896e5fb16c60fee346adc9dbe81a76b37310638ca91951983d8e` |
| Vencord.user.js（用户脚本） | 917.7 KB | `8e16624e4daa896f1bc6258efc362a27235f87ac14e2856a88b9e9c41658a58c` |

## zh.1（历史，已被 zh.2 取代）

zh.1 构建 commit `e1adb6da`，Chrome 实机测试发现 Themes / Cloud / Backup & Restore / Patch Helper
四页漏译，由 Phase 5.1（commit `9f009d2d`）修复。zh.1 校验和已从本表移除，不要分发。

## 产物内容验证

以下产物已验证包含完整 zh-CN 翻译数据（抽查 `plugin.VoiceMessages.name` 与
zh.2 新增 key `ui.themes.localTab` / `ui.patchHelper.fullPatch` / `ui.backup.exportSettings` / `ui.cloud.reauthorise`）：

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
