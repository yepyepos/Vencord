/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vencord zh-CN contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * Simplified Chinese translations for Vencord's own UI.
 *
 * This file is pure data: no business logic, no imports. Keys are stable
 * dotted identifiers (never the English text itself) so upstream wording
 * changes cannot break lookups. Missing keys simply fall back to the English
 * source text at the call site.
 *
 * Key namespaces:
 *   ui.*       Vencord's own UI strings (settings pages, components)
 *   tag.*      The fixed plugin tag list from @utils/types (PluginTags)
 *   plugin.*   Per-plugin metadata and settings, e.g.
 *              `plugin.<PluginName>.name`,
 *              `plugin.<PluginName>.description`,
 *              `plugin.<PluginName>.settings.<settingKey>[.displayName|.placeholder|.description]`,
 *              `plugin.<PluginName>.settings.<settingKey>.option.<value>`
 */

const translations = {
    // ---- common ----
    "ui.common.close": "关闭",

    // ---- plugins tab ----
    "ui.plugins.searchPlaceholder": "搜索插件…",
    "ui.plugins.noResults": "没有符合搜索条件的插件。",
    "ui.plugins.filtersHeading": "筛选",
    "ui.plugins.pluginsHeading": "插件",
    "ui.plugins.requiredHeading": "必需插件",
    "ui.plugins.showAll": "显示全部",
    "ui.plugins.showFavorites": "显示收藏",
    "ui.plugins.showEnabled": "显示已启用",
    "ui.plugins.showDisabled": "显示已停用",
    "ui.plugins.showNew": "显示新插件",
    "ui.plugins.showUserPlugins": "显示用户插件",
    "ui.plugins.showApiPlugins": "显示 API 插件",
    "ui.plugins.filterByType": "按类型筛选",
    "ui.plugins.filterByTags": "按标签筛选",
    "ui.plugins.restartRequired": "需要重启",
    "ui.plugins.restartRequiredHeading": "需要重启！",
    "ui.plugins.restartNowToApply": "立即重启以应用新插件及其设置",
    "ui.plugins.restart": "重启",
    "ui.plugins.restartNow": "立即重启",
    "ui.plugins.restartLater": "稍后！",
    "ui.plugins.restartRequiredList": "以下插件需要重启：",
    "ui.plugins.pluginManagement": "插件管理",
    "ui.plugins.pressCogWheel": "点击齿轮或信息图标查看插件详情",
    "ui.plugins.cogWheelHasSettings": "带齿轮图标的插件拥有可以修改的设置！",
    "ui.plugins.requiredTooltip": "Vencord 运行必需此插件。",
    "ui.plugins.requiredBy": "此插件被以下插件依赖：",
    "ui.plugins.areYouLookingFor": "你想找的是：",
    "ui.plugins.onlyAvailableOn": "仅在{platform}上可用",
    "ui.plugins.failedToStartDependencies": "启动依赖插件失败：{failures}",

    // ---- plugin modal ----
    "ui.pluginModal.noSettings": "此插件没有设置项。",
    "ui.pluginModal.authors": "作者",
    "ui.pluginModal.settings": "设置",
    "ui.pluginModal.viewMoreInfo": "查看更多信息",
    "ui.pluginModal.viewSourceCode": "查看源代码",
    "ui.pluginModal.customInfoError": "渲染此插件的自定义信息组件时发生错误",

    // ---- vencord settings sections (_core/settings.tsx) ----
    "ui.settings.section.vencord": "Vencord",
    "ui.settings.section.vencordSettings": "Vencord 设置",
    "ui.settings.section.plugins": "插件",
    "ui.settings.section.themes": "主题",
    "ui.settings.section.updater": "更新器",
    "ui.settings.section.vencordUpdater": "Vencord 更新器",
    "ui.settings.section.cloud": "云同步",
    "ui.settings.section.vencordCloud": "Vencord 云同步",
    "ui.settings.section.backupRestore": "备份与恢复",
    "ui.settings.section.patchHelper": "补丁助手",

    // ---- fixed plugin tag list (PluginTags in @utils/types) ----
    "tag.Accessibility": "无障碍",
    "tag.Activity": "活动",
    "tag.Appearance": "外观",
    "tag.Chat": "聊天",
    "tag.Commands": "命令",
    "tag.Console": "控制台",
    "tag.Customisation": "自定义",
    "tag.Developers": "开发者",
    "tag.Emotes": "表情",
    "tag.Friends": "好友",
    "tag.Fun": "娱乐",
    "tag.Media": "媒体",
    "tag.Notifications": "通知",
    "tag.Organisation": "整理",
    "tag.Privacy": "隐私",
    "tag.Reactions": "反应",
    "tag.Roles": "身份组",
    "tag.Servers": "服务器",
    "tag.Shortcuts": "快捷键",
    "tag.Utility": "实用",
    "tag.Voice": "语音",

    // ====================================================================
    // PoC plugin batch (8 plugins, different categories)
    // Plugin names below are stable identifiers; option labels are keyed
    // by option value, so upstream rewording cannot break these lookups.
    // ====================================================================

    // ---- AlwaysTrust (pure definePluginSettings) ----
    "plugin.AlwaysTrust.name": "始终信任",
    "plugin.AlwaysTrust.description": "移除烦人的不受信任域名和可疑文件弹窗",
    "plugin.AlwaysTrust.settings.domain.displayName": "不受信任域名",
    "plugin.AlwaysTrust.settings.domain.description": "打开链接时不再显示不受信任域名弹窗",
    "plugin.AlwaysTrust.settings.file.displayName": "可疑文件",
    "plugin.AlwaysTrust.settings.file.description": "打开链接时不再显示“可能危险的下载”弹窗",

    // ---- VoiceMessages (settings + chatbar button + context menu) ----
    "plugin.VoiceMessages.name": "语音消息",
    "plugin.VoiceMessages.description": "像手机端一样发送语音消息。右键点击上传按钮并选择“发送语音消息”即可使用",
    "plugin.VoiceMessages.settings.noiseSuppression.displayName": "噪声抑制",
    "plugin.VoiceMessages.settings.noiseSuppression.description": "噪声抑制",
    "plugin.VoiceMessages.settings.echoCancellation.displayName": "回声消除",
    "plugin.VoiceMessages.settings.echoCancellation.description": "回声消除",

    // ---- ImageZoom (many settings + context menu + dynamic overlay UI) ----
    "plugin.ImageZoom.name": "图片缩放",
    "plugin.ImageZoom.description": "放大图片和 GIF。使用滚轮缩放，按住 Shift + 滚轮调整放大镜大小",
    "plugin.ImageZoom.settings.saveZoomValues.displayName": "保存缩放值",
    "plugin.ImageZoom.settings.saveZoomValues.description": "是否保存缩放和放大镜大小数值",
    "plugin.ImageZoom.settings.invertScroll.displayName": "反转滚动",
    "plugin.ImageZoom.settings.invertScroll.description": "反转滚轮滚动方向",
    "plugin.ImageZoom.settings.nearestNeighbour.displayName": "最近邻插值",
    "plugin.ImageZoom.settings.nearestNeighbour.description": "缩放图片时使用最近邻插值算法",
    "plugin.ImageZoom.settings.square.displayName": "方形放大镜",
    "plugin.ImageZoom.settings.square.description": "使放大镜呈方形",
    "plugin.ImageZoom.settings.zoom.displayName": "缩放倍数",
    "plugin.ImageZoom.settings.zoom.description": "放大镜的缩放倍数",
    "plugin.ImageZoom.settings.size.displayName": "放大镜大小",
    "plugin.ImageZoom.settings.size.description": "放大镜的半径 / 大小",
    "plugin.ImageZoom.settings.zoomSpeed.displayName": "缩放速度",
    "plugin.ImageZoom.settings.zoomSpeed.description": "缩放 / 放大镜大小变化的速度",
    "plugin.ImageZoom.menu.square": "方形放大镜",
    "plugin.ImageZoom.menu.nearestNeighbour": "最近邻插值",
    "plugin.ImageZoom.menu.zoom": "缩放",
    "plugin.ImageZoom.menu.size": "放大镜大小",
    "plugin.ImageZoom.menu.zoomSpeed": "缩放速度",

    // ---- BetterFolders (settings incl. SELECT + dynamic sidebar UI) ----
    "plugin.BetterFolders.name": "更好的文件夹",
    "plugin.BetterFolders.description": "在独立侧边栏显示服务器文件夹，并带来文件夹相关改进",
    "plugin.BetterFolders.settings.sidebar.displayName": "独立侧边栏",
    "plugin.BetterFolders.settings.sidebar.description": "在独立侧边栏中显示文件夹内的服务器",
    "plugin.BetterFolders.settings.sidebarAnim.displayName": "侧边栏动画",
    "plugin.BetterFolders.settings.sidebarAnim.description": "打开文件夹侧边栏时显示动画",
    "plugin.BetterFolders.settings.closeAllFolders.displayName": "关闭全部文件夹",
    "plugin.BetterFolders.settings.closeAllFolders.description": "选择不在文件夹内的服务器时关闭所有文件夹",
    "plugin.BetterFolders.settings.closeAllHomeButton.displayName": "主页按钮关闭全部",
    "plugin.BetterFolders.settings.closeAllHomeButton.description": "点击主页按钮时关闭所有文件夹",
    "plugin.BetterFolders.settings.closeOthers.displayName": "独占展开",
    "plugin.BetterFolders.settings.closeOthers.description": "打开一个文件夹时关闭其他文件夹",
    "plugin.BetterFolders.settings.closeServerFolder.displayName": "选中后收起",
    "plugin.BetterFolders.settings.closeServerFolder.description": "在文件夹内选择服务器时关闭该文件夹",
    "plugin.BetterFolders.settings.forceOpen.displayName": "强制展开",
    "plugin.BetterFolders.settings.forceOpen.description": "切换到文件夹内的服务器时强制展开该文件夹",
    "plugin.BetterFolders.settings.keepIcons.displayName": "保留图标",
    "plugin.BetterFolders.settings.keepIcons.description": "文件夹在侧边栏展开时，主服务器栏的文件夹中仍显示服务器图标",
    "plugin.BetterFolders.settings.showFolderIcon.displayName": "文件夹图标",
    "plugin.BetterFolders.settings.showFolderIcon.description": "在侧边栏文件夹内的服务器上方显示文件夹图标",
    "plugin.BetterFolders.settings.showFolderIcon.option.0": "从不",
    "plugin.BetterFolders.settings.showFolderIcon.option.1": "总是",
    "plugin.BetterFolders.settings.showFolderIcon.option.2": "展开多个文件夹时",

    // ---- NewGuildSettings (SELECT options + context menu) ----
    "plugin.NewGuildSettings.name": "新服务器设置",
    "plugin.NewGuildSettings.description": "加入新服务器时自动静音，并自动调整其他各种设置",
    "plugin.NewGuildSettings.settings.guild.displayName": "自动静音服务器",
    "plugin.NewGuildSettings.settings.guild.description": "加入时自动将服务器静音",
    "plugin.NewGuildSettings.settings.messages.displayName": "服务器通知设置",
    "plugin.NewGuildSettings.settings.messages.description": "服务器通知设置",
    "plugin.NewGuildSettings.settings.messages.option.0": "所有消息",
    "plugin.NewGuildSettings.settings.messages.option.1": "仅 @提及",
    "plugin.NewGuildSettings.settings.messages.option.2": "无",
    "plugin.NewGuildSettings.settings.messages.option.3": "服务器默认",
    "plugin.NewGuildSettings.settings.everyone.displayName": "屏蔽 @everyone",
    "plugin.NewGuildSettings.settings.everyone.description": "屏蔽 @everyone 和 @here",
    "plugin.NewGuildSettings.settings.role.displayName": "屏蔽身份组 @提及",
    "plugin.NewGuildSettings.settings.role.description": "屏蔽所有身份组 @提及",
    "plugin.NewGuildSettings.settings.highlights.displayName": "屏蔽亮点",
    "plugin.NewGuildSettings.settings.highlights.description": "自动屏蔽亮点通知",
    "plugin.NewGuildSettings.settings.events.displayName": "静音新活动",
    "plugin.NewGuildSettings.settings.events.description": "自动将新活动静音",
    "plugin.NewGuildSettings.settings.showAllChannels.displayName": "显示全部频道",
    "plugin.NewGuildSettings.settings.showAllChannels.description": "自动显示全部频道",
    "plugin.NewGuildSettings.menu.apply": "应用新服务器设置",

    // ---- Translate (custom settings.tsx + hidden defs + context menu) ----
    "plugin.Translate.name": "翻译",
    "plugin.Translate.description": "使用 Google 翻译、DeepL 或 Kagi 翻译消息",
    "plugin.Translate.settings.service.displayName": "翻译服务提供商",
    "plugin.Translate.settings.service.description": "翻译服务提供商",
    "plugin.Translate.settings.service.option.google": "Google 翻译",
    "plugin.Translate.settings.service.option.deepl": "DeepL 免费版 — 需要 API 密钥",
    "plugin.Translate.settings.service.option.deepl-pro": "DeepL 专业版 — 需要 API 密钥",
    "plugin.Translate.settings.service.option.kagi": "Kagi 翻译 — 需要 API 密钥",
    "plugin.Translate.settings.deeplApiKey.displayName": "DeepL API 密钥",
    "plugin.Translate.settings.deeplApiKey.description": "你的 DeepL API 密钥（可在 deepl.com/your-account 获取）",
    "plugin.Translate.settings.kagiSession.displayName": "Kagi 会话令牌",
    "plugin.Translate.settings.kagiSession.description": "你的 Kagi 会话令牌（可在 kagi.com/settings?p=user_details 获取）",
    "plugin.Translate.settings.autoTranslate.displayName": "自动翻译",
    "plugin.Translate.settings.autoTranslate.description": "发送前自动翻译你的消息。也可以按住 Shift 点击或右键点击翻译按钮来切换",
    "plugin.Translate.settings.showAutoTranslateTooltip.displayName": "显示自动翻译提示",
    "plugin.Translate.settings.showAutoTranslateTooltip.description": "消息被自动翻译时，在聊天栏按钮上显示提示",
    "plugin.Translate.menu.translate": "翻译",
    "plugin.Translate.popover.translate": "翻译",

    // ---- PlainFolderIcon (no settings: exercises the English fallback path) ----
    "plugin.PlainFolderIcon.name": "简洁文件夹图标",
    "plugin.PlainFolderIcon.description": "不在文件夹中显示小型服务器图标",

    // ---- petpet (slash command plugin, no settings) ----
    "plugin.petpet.name": "拍拍",
    "plugin.petpet.description": "添加 /petpet 斜杠命令，可将任意图片生成摸头 GIF",
} satisfies Record<string, string>;

export default translations;
