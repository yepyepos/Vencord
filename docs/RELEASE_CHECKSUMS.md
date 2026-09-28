# Vencord zh-CN Release Candidate — 校验和

> 构建时间：2026-09-28（本地时间）
> 构建 commit：`e1adb6da6418422ef224590c4c1fa13d11484ec5`（zh-CN 分支）
> 基于 upstream：`90aea0ddbbfbee16ce052b2c7ab610ffe957b4ca`（Vendicated/Vencord main，package.json version 1.15.7）
> 构建环境：Node v22.22.1 / pnpm 11.22.0 / Windows
> 状态：**Release Candidate**（实机 GUI 验证完成并确认后方可作为正式 Release 发布）

## Desktop（注入用构建产物）

| 文件 | 大小 | SHA256 |
| --- | --- | --- |
| renderer.js | 839.8 KB | `3b8270269b023253b61bbc55a2d33499554820ea0fbb8310aefcf0fd99ef6d14` |
| renderer.css | 41.7 KB | `861f40ea0556d6fb31f992f97173485441d57dbc8a90ed7be7c4ae797c8d7ed1` |
| patcher.js | 38.8 KB | `de74512b541dd4ee299533646938ea37d2db4a8baa701769845861d0f066e3bf` |
| preload.js | 2.3 KB | `fb2c346fefc7a820e8d3466e11cc5030d33b2d250171029a27078369effb8f79` |
| vencordDesktopMain.js | 34.9 KB | `ec4ca0410cd12b988e190de1bbfa8c618d9885bf9d557ce2b25a681e5112e9a9` |
| vencordDesktopPreload.js | 2.3 KB | `94be2f0df99e8866fe5982462f61ef9c453b2e7e827a1a601bf29707d3a3eb4b` |
| vencordDesktopRenderer.js | 847.1 KB | `518ab1eb13883a15bcae0ea93ff232ee581be5cedff7ed0f2527eaa0d6c8bf78` |
| vencordDesktopRenderer.css | 41.7 KB | `861f40ea0556d6fb31f992f97173485441d57dbc8a90ed7be7c4ae797c8d7ed1` |

## Browser

| 文件 | 大小 | SHA256 |
| --- | --- | --- |
| extension-chrome.zip | 1787.4 KB | `b8ee1f897e2f024278384f69408276e07b30d7156c83fe228b68eb8194e59d32` |
| extension-firefox.zip | 1787.0 KB | `b5aaf6a23a99f28005bfbe605cd6287d801144f25bd2673cea5ea7d4f2dcd1b2` |
| Vencord.user.js（用户脚本） | 911.0 KB | `515392cf3e2eff1d37e996bc83165b9c5c2d910db0d8bc30869a14b6d170608b` |

## 产物内容验证

以下产物已验证包含完整 zh-CN 翻译数据（以 `plugin.VoiceMessages.name` 等 key 抽查）：

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
