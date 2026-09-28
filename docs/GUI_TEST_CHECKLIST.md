# Vencord zh-CN RC 实机 GUI 验证检查单

> 使用者：在真实 Discord 环境执行本检查单的人。
> 产物：`docs/RELEASE_CHECKSUMS.md` 所列 RC 产物（先核对 SHA256）。
> 环境：建议使用测试账号与独立 Discord 安装，**不要在主力账号上做高风险测试**。
> 原则：本检查单未全部通过前，不得创建正式 GitHub Release。
> 全部通过后，按 `docs/RELEASE_NOTES_ZH.md` 与下文"发布命令"执行发布。

## 0. 安装

- [ ] Desktop：备份现有 Vencord 安装；将本 RC 产物注入测试环境（不覆盖主力安装）
- [ ] Chrome：`chrome://extensions` → 开发者模式 → 加载已解压的扩展程序（chromium-unpacked）
- [ ] Firefox：about:debugging → 临时载入附加组件（firefox-unpacked/manifest.json）

## 1. 语言切换（每次切换后逐项复查）

- [ ] English → 中文（Discord 设置 → 语言 → 简体中文）
- [ ] 中文 → English
- [ ] English → 中文 → English → 中文（连续两轮）
- [ ] 每轮检查：Vencord 设置分区标题、插件列表、插件卡片、插件弹窗、插件设置、
      右键菜单、Toast、Tooltip、动态 UI 均跟随当前语言
- [ ] 无旧语言残留、无部分组件不刷新、无 key 名/undefined/空白

## 2. Vencord 设置页

- [ ] 分区标题（插件/主题/更新器/云同步/备份与恢复）为中文
- [ ] 插件列表卡片：名称/描述/标签中文
- [ ] 搜索框 placeholder、筛选器、无结果提示为中文
- [ ] 快捷操作按钮、捐赠卡片、提示文本为中文
- [ ] 布局无溢出/截断/换行异常

## 3. 插件卡片（抽 12+ 个，覆盖各类）

- [ ] 普通插件 ×3：名称/描述/标签
- [ ] 多设置插件 ×3（如 FakeNitro、MessageLogger、ImageZoom）：设置入口
- [ ] 无设置插件 ×2（如 PlainFolderIcon、oneko）：信息弹窗
- [ ] Select 插件 ×2、Modal 插件 ×2、动态 UI 插件 ×2
- [ ] 启用/停用开关动作正常

## 4. 插件设置（抽 30+ 项）

- [ ] Boolean ×8 / String ×4 / Number ×4 / Select ×5 / Slider ×4 /
      自定义组件 ×3 / 隐藏项不显示 ×2
- [ ] 标题、描述、placeholder 为中文
- [ ] 修改设置 → 保存 → 重开：值保持（存储的是 value，不是中文 label）
- [ ] 恢复默认动作正常

## 5. Select / Radio 防呆（重点）

- [ ] 任选 5 个 Select：切换选项 → 保存 → 重新打开，value 正确
- [ ] 确认配置文件（settings.json）中存储的是英文 value 而非中文
- [ ] BetterFolders/NewGuildSettings 等数字/枚举 value 插件行为正常

## 6. 右键菜单（抽 8 个）

- [ ] BetterRoleContext（身份组操作）、PinDMs（置顶/分组）、Translate（翻译）、
      ViewRaw（查看原始内容）、ViewIcons（查看图标）、ReviewDB（查看评价）、
      PermissionsViewer（查看权限）、CopyStickerLinks
- [ ] 菜单文案中文，点击后功能正常

## 7. Modal / Toast / Tooltip（抽 5+5+10）

- [ ] Modal：Decor 弹窗、MessageLogger 历史、ReviewDB 屏蔽列表、Translate 自动翻译确认、
      UIElements 管理；无溢出、按钮不截断
- [ ] Toast：复制类/失败类提示中文且位置正常
- [ ] Tooltip：MessageLatency 旧客户端提示、ShowHiddenChannels 隐藏频道、
      VoiceMessages 录音按钮等；长度/换行正常

## 8. 搜索与标签

- [ ] 中文搜索：`语音`、`翻译`、`置顶`、`摸头` 均能命中对应插件
- [ ] 英文搜索：`Voice`、`Translate`、`Pin` 仍命中
- [ ] 大小写不敏感；缩写（BF）有效
- [ ] 标签筛选：label 显示中文（如"实用"），筛选结果与英文标签一致

## 9. fallback 验证

- [ ] 找一个未翻译项（如 _api 插件描述）→ 显示英文原文
- [ ] 无空白 / undefined / null / key 名泄露

## 10. Browser 专项（Chrome + Firefox 各跑一遍 1/2/4/8 精简版）

- [ ] discord.com 网页版加载扩展后 Vencord 设置可打开
- [ ] 中文显示、搜索、语言切换正常
- [ ] Chrome 与 Firefox 行为差异分别记录

## 11. 结果记录

- [ ] 全部通过 → 按下述命令发布正式 Release
- [ ] 发现问题 → 按影响分级（P0 崩溃/P1 错译/P2 措辞/P3 优化），
      修复后**重新构建**并重跑受影响项；不得热修已发布产物

## 发布命令（检查单全过后执行）

```bash
# 1. 确认 remote 指向 Fork（不得推到 upstream）
git remote -v

# 2. 打 tag 并推送
git tag -a v1.15.7-zh.3 -m "Vencord zh-CN v1.15.7-zh.3"
git push origin zh-CN
git push origin v1.15.7-zh.3

# 3. 创建 GitHub Release（gh CLI）
gh release create v1.15.7-zh.3 \
  --repo yepyepos/Vencord \
  --title "Vencord 1.15.7 — 简体中文本地化版" \
  --notes-file docs/RELEASE_NOTES_ZH.md \
  extension-chrome.zip extension-firefox.zip Vencord.user.js
```

> Desktop 产物通过 Vencord 安装器/注入方式分发，Release 说明中给出构建 commit 与校验和即可。
