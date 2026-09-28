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
} satisfies Record<string, string>;

export default translations;
