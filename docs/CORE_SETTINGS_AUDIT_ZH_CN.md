# Vencord zh-CN Core Settings 审计清单（Phase 5.2）

> 生成日期：2026-09-28 · 触发原因：Desktop 实机测试连续发现 Core Settings 页面整页漏译
> （Themes / Cloud / Backup & Restore / Patch Helper / Notification Log / Background Material）。
> 根因：Phase 1–4 的静态扫描聚焦 `src/plugins/**`，`src/components/settings/tabs/**` 未被系统性纳入。
> 本文档建立 Core Settings 的完整覆盖台账，并由 `pnpm qaI18n` 的 core settings coverage 检查自动化守护。

## 覆盖检查机制（防回归）

`pnpm qaI18n` 的 **core settings coverage** 检查：

1. 扫描 `src/components/settings/tabs/**/*.tsx` 与 `src/api/Notifications/notificationLog.tsx`；
2. 任何含用户可见字符串模式（JSX 文本节点 / `label|title|tooltip|placeholder|text|description` 字符串字面量）
   的文件，必须包含 `t("` 用法；
3. 唯一豁免：`themes/LocalThemesTab.tsx`（残余可见文本仅为品牌链接标签 "BetterDiscord theme list" / "GitHub"）；
4. 出现未包装文本 → QA 直接失败，阻止"新页面整页漏译"再次发生。

## 分页面状态（Phase 5.2 完成后）

| 页面 / 分区 | 组件 | 状态 | 备注 |
| --- | --- | --- | --- |
| Vencord 主设置 | `tabs/vencord/index.tsx` | DONE | Phase 3.5 |
| └ 通知设置 | `vencord/NotificationSettings.tsx` | DONE | Phase 3.5 |
| └ 背景材质（Windows） | `vencord/WindowsMaterialSettings.tsx` | DONE | **Phase 5.2**（标题/描述/4 选项 label，value 原样） |
| └ macOS 鲜活度 | `vencord/MacVibrancySettings.tsx` | DONE | **Phase 5.2**（标题/占位符/13 选项 label） |
| 插件页 | `tabs/plugins/**` | DONE | Phase 2/3/3.5/5.2（UIElements 弹窗 5 处 + 必需插件空状态为 5.2 补漏） |
| └ 插件卡/弹窗/设置渲染器 | `plugins/PluginCard.tsx` 等 | DONE | Phase 2（中央覆盖层） |
| 主题页 | `tabs/themes/index.tsx`、`LocalThemesTab.tsx`、`ThemeCard.tsx` | DONE | **Phase 5.1/5.2**；LocalThemesTab 品牌链接标签豁免 |
| └ 在线主题说明 | `themes/OnlineThemesTab.tsx` | DONE | Phase 3.5 |
| └ CSP 错误卡 | `themes/CspErrorCard.tsx` | DONE | **Phase 5.1** |
| 云同步 | `tabs/sync/CloudTab.tsx` | DONE | Phase 3.5 主体 + **Phase 5.1 按钮** + **5.2 长说明/后端 URL/同步规则** |
| 备份与恢复 | `tabs/sync/BackupAndRestoreTab.tsx` | DONE | **Phase 5.1**（整页） |
| 补丁助手 | `tabs/patchHelper/**` | DONE | **Phase 5.1**（标题/按钮/错误）；替换语法提示表保留英文（开发者参考） |
| 更新器 | `tabs/updater/**` | DONE | Phase 3.5 主体 + **5.2 Repo/Updates/Oops/错误消息** |
| 通知日志 | `api/Notifications/notificationLog.tsx` | DONE | **Phase 5.2**（整页：标题/空状态/清空确认） |
| └ 通知组件 | `api/Notifications/NotificationComponent.tsx` | DONE | **Phase 5.2**（关闭通知 svg title） |
| 设置注入 | `plugins/_core/settings.tsx` | DONE | Phase 2（分区标题 getter 化） |
| Updater"检查更新"功能 | — | DISCORD-I18N 之外的运行限制 | Fork 无官方更新源可检查，属已知 Release 限制，非 i18n 问题（§Phase 5.2 记录） |

## KEEP-ENGLISH 台账（Core Settings 范围）

| 位置 | 文本 | 原因 |
| --- | --- | --- |
| `patchHelper/ReplacementInput.tsx` | 正则替换语法提示表（`$$`/`$&`/`$self` 等 7 条） | 开发者参考，键为代码记号 |
| `patchHelper/FullPatchInput.tsx` | 错误消息中的字段名（`'find'`、`'replacement.match'` 等） | 代码标识符（消息本身已译） |
| `themes/LocalThemesTab.tsx` | "BetterDiscord theme list" / "GitHub" 链接标签 | 品牌名 |
| `patchHelper/**` | patch/module identifier、regex、代码块内容 | 技术标识符 |

## 统计

- Core Settings 页面：**9 大页 + 3 子设置区**，全部 DONE
- Phase 5.1 + 5.2 新增包装：**~180 处**（5.1 四页 62 处；5.2 Desktop 实机发现 ~55 处 +
  Core 扫描残余 ~25 处 + Mac 活跃度 13 选项）
- 新增 ui.* key：145 → **259**（总 key 1419 → **1490**，checkI18n 最终对账：ui=259 + tag=21 + plugin=1210）
- 自动化守护：qaI18n core settings coverage（fail 级）+ checkI18n 语义命名空间白名单（menu/modal/
  player/fields/verification 等 19 个段，消除 Phase 4 key 的告警噪音）
