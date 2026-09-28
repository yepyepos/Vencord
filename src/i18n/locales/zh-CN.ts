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

    // ====================================================================
    // Phase 3 full localization. Batches are alphabetical by plugin name.
    // Keys: plugin.<Name>.name/.description/.settings.<key>.displayName/
    //       .description/.placeholder/.option.<value>
    // Option values are NEVER translated; enums resolve to their runtime
    // value (see docs/zh-CN-TRANSLATION-GUIDE.md).
    // ====================================================================

    // ---- batch 01: A-C ----
    "plugin.AccountPanelServerProfile.name": "账户面板服务器资料",
    "plugin.AccountPanelServerProfile.description": "右键点击左下角的账户面板，即可查看你在当前服务器中的个人资料",
    "plugin.AccountPanelServerProfile.settings.prioritizeServerProfile.displayName": "优先服务器资料",
    "plugin.AccountPanelServerProfile.settings.prioritizeServerProfile.description": "左键点击账户面板时优先打开服务器个人资料",

    "plugin.AddAttachments.name": "编辑时添加附件",
    "plugin.AddAttachments.description": "允许你在编辑消息时添加新附件",

    "plugin.AlwaysAnimate.name": "始终动画",
    "plugin.AlwaysAnimate.description": "让所有可以动起来的内容都动起来",

    "plugin.AlwaysExpandRoles.name": "始终展开身份组",
    "plugin.AlwaysExpandRoles.description": "在个人资料弹出框中始终展开身份组列表",

    "plugin.AnonymiseFileNames.name": "匿名化文件名",
    "plugin.AnonymiseFileNames.description": "匿名化上传文件的文件名",
    "plugin.AnonymiseFileNames.settings.anonymiseByDefault.displayName": "默认匿名化",
    "plugin.AnonymiseFileNames.settings.anonymiseByDefault.description": "是否默认匿名化文件名",
    "plugin.AnonymiseFileNames.settings.method.displayName": "匿名化方式",
    "plugin.AnonymiseFileNames.settings.method.description": "文件名的匿名化方式",
    "plugin.AnonymiseFileNames.settings.method.option.0": "随机字符",
    "plugin.AnonymiseFileNames.settings.method.option.1": "固定名称",
    "plugin.AnonymiseFileNames.settings.method.option.2": "时间戳",
    "plugin.AnonymiseFileNames.settings.randomisedLength.displayName": "随机字符长度",
    "plugin.AnonymiseFileNames.settings.randomisedLength.description": "随机字符的长度",
    "plugin.AnonymiseFileNames.settings.consistent.displayName": "固定文件名",
    "plugin.AnonymiseFileNames.settings.consistent.description": "匿名化时使用的固定文件名",

    "plugin.AutoDNDWhilePlaying.name": "游戏时自动请勿打扰",
    "plugin.AutoDNDWhilePlaying.description": "启动游戏时自动更新你的在线状态（在线、离开、请勿打扰）",
    "plugin.AutoDNDWhilePlaying.settings.statusToSet.displayName": "游戏时的状态",
    "plugin.AutoDNDWhilePlaying.settings.statusToSet.description": "玩游戏时设置的状态",
    "plugin.AutoDNDWhilePlaying.settings.statusToSet.option.online": "在线",
    "plugin.AutoDNDWhilePlaying.settings.statusToSet.option.idle": "离开",
    "plugin.AutoDNDWhilePlaying.settings.statusToSet.option.dnd": "请勿打扰",
    "plugin.AutoDNDWhilePlaying.settings.statusToSet.option.invisible": "隐身",

    "plugin.BetterGifAltText.name": "更好的 GIF 替代文本",
    "plugin.BetterGifAltText.description": "将 GIF 的替代文本从单纯的“GIF”改为包含 GIF 标签 / 文件名",

    "plugin.BetterGifPicker.name": "更好的 GIF 选择器",
    "plugin.BetterGifPicker.description": "让 GIF 选择器默认打开收藏分类",

    "plugin.BetterRoleContext.name": "更好的身份组右键菜单",
    "plugin.BetterRoleContext.description": "在用户资料或成员列表中右键点击身份组时，添加复制身份组颜色 / 编辑身份组 / 查看身份组图标选项",
    "plugin.BetterRoleContext.settings.roleIconFileFormat.displayName": "身份组图标文件格式",
    "plugin.BetterRoleContext.settings.roleIconFileFormat.description": "查看身份组图标时使用的文件格式",

    "plugin.BetterRoleDot.name": "更好的身份组圆点",
    "plugin.BetterRoleDot.description": "点击身份组圆点（无障碍设置）时复制身份组颜色，并允许同时使用身份组圆点和彩色昵称",
    "plugin.BetterRoleDot.settings.bothStyles.displayName": "同时显示两种样式",
    "plugin.BetterRoleDot.settings.bothStyles.description": "同时显示身份组圆点和彩色昵称",
    "plugin.BetterRoleDot.settings.copyRoleColorInProfilePopout.displayName": "资料弹窗中复制颜色",
    "plugin.BetterRoleDot.settings.copyRoleColorInProfilePopout.description": "允许在个人资料弹出框中点击身份组圆点以复制身份组颜色",

    "plugin.BetterSessions.name": "更好的会话管理",
    "plugin.BetterSessions.description": "增强会话（设备）菜单：查看精确时间、为每个会话自定义名称，并在新会话出现时接收通知",
    "plugin.BetterSessions.settings.backgroundCheck.displayName": "后台检查新会话",
    "plugin.BetterSessions.settings.backgroundCheck.description": "在后台检查新会话，检测到时显示通知",
    "plugin.BetterSessions.settings.checkInterval.displayName": "检查间隔",
    "plugin.BetterSessions.settings.checkInterval.description": "后台检查新会话的频率（启用后台检查时生效），单位为分钟",

    "plugin.BetterSettings.name": "更好的设置",
    "plugin.BetterSettings.description": "增强设置菜单的打开体验",
    "plugin.BetterSettings.settings.disableFade.displayName": "禁用淡入淡出",
    "plugin.BetterSettings.settings.disableFade.description": "禁用交叉淡入淡出动画",
    "plugin.BetterSettings.settings.organizeMenu.displayName": "整理设置菜单",
    "plugin.BetterSettings.settings.organizeMenu.description": "将设置齿轮右键菜单按类别整理",
    "plugin.BetterSettings.settings.eagerLoad.displayName": "消除首次加载延迟",
    "plugin.BetterSettings.settings.eagerLoad.description": "消除首次打开菜单时的加载延迟",

    "plugin.BetterUploadButton.name": "更好的上传按钮",
    "plugin.BetterUploadButton.description": "单击直接上传，右键打开菜单",

    "plugin.BiggerStreamPreview.name": "更大的直播预览",
    "plugin.BiggerStreamPreview.description": "允许你放大直播预览画面",

    "plugin.BlurNSFW.name": "模糊 NSFW 内容",
    "plugin.BlurNSFW.description": "模糊 NSFW 频道中的附件，悬停时显示",
    "plugin.BlurNSFW.settings.blurAmount.displayName": "模糊程度",
    "plugin.BlurNSFW.settings.blurAmount.description": "模糊程度（像素）",

    "plugin.CallTimer.name": "通话计时器",
    "plugin.CallTimer.description": "在语音通话中添加计时器",
    "plugin.CallTimer.settings.format.displayName": "计时格式",
    "plugin.CallTimer.settings.format.description": "计时器格式，可以是任何有效的 moment.js 格式",

    "plugin.CharacterCounter.name": "字数统计",
    "plugin.CharacterCounter.description": "在聊天输入框中添加字数统计",
    "plugin.CharacterCounter.settings.colorEffects.displayName": "颜色警示",
    "plugin.CharacterCounter.settings.colorEffects.description": "接近字数上限时以黄色 / 红色着色",

    "plugin.ClearURLs.name": "链接清洗",
    "plugin.ClearURLs.description": "自动移除你所发送链接中的跟踪参数",

    "plugin.ClientTheme.name": "客户端主题",
    "plugin.ClientTheme.description": "重现旧版客户端主题实验：为你的 Discord 客户端主题添加颜色",

    "plugin.ColorSighted.name": "色觉正常化",
    "plugin.ColorSighted.description": "像 2015-2017 年的 Discord 一样，移除状态上的色盲友好图标",

    "plugin.ConsoleJanitor.name": "控制台清理器",
    "plugin.ConsoleJanitor.description": "禁用烦人的控制台消息 / 错误",
    "plugin.ConsoleJanitor.settings.disableLoggers.displayName": "禁用 Discord 日志器",
    "plugin.ConsoleJanitor.settings.disableLoggers.description": "禁用 Discord 的日志器",
    "plugin.ConsoleJanitor.settings.disableSpotifyLogger.displayName": "禁用 Spotify 日志器",
    "plugin.ConsoleJanitor.settings.disableSpotifyLogger.description": "禁用会泄露账户信息和访问令牌的 Spotify 日志器",
    "plugin.ConsoleJanitor.settings.whitelistedLoggers.displayName": "日志器白名单",
    "plugin.ConsoleJanitor.settings.whitelistedLoggers.description": "以分号（;）分隔的日志器列表，即使其他日志器被隐藏也允许显示",

    "plugin.ConsoleShortcuts.name": "控制台快捷方式",
    "plugin.ConsoleShortcuts.description": "为 window 上的许多对象添加更短的别名。运行 `shortcutList` 查看列表。",

    "plugin.CopyEmojiMarkdown.name": "复制表情 Markdown",
    "plugin.CopyEmojiMarkdown.description": "允许以格式化字符串复制表情（<:blobcatcozy:1026533070955872337>）",
    "plugin.CopyEmojiMarkdown.settings.copyUnicode.displayName": "复制 Unicode 字符",
    "plugin.CopyEmojiMarkdown.settings.copyUnicode.description": "对默认表情复制原始 Unicode 字符（👽）而非 :name: 格式",

    "plugin.CopyFileContents.name": "复制文件内容",
    "plugin.CopyFileContents.description": "为文本文件附件添加复制其内容的按钮",

    "plugin.CopyStickerLinks.name": "复制贴纸链接",
    "plugin.CopyStickerLinks.description": "添加复制和打开贴纸链接的功能",

    "plugin.CopyUserURLs.name": "复制用户链接",
    "plugin.CopyUserURLs.description": "在用户右键菜单中添加“复制用户链接”选项",

    "plugin.CrashHandler.name": "崩溃处理器",
    "plugin.CrashHandler.description": "用于处理并尽可能在不重启的情况下从崩溃中恢复的实用插件",
    "plugin.CrashHandler.settings.attemptToPreventCrashes.displayName": "尝试阻止崩溃",
    "plugin.CrashHandler.settings.attemptToPreventCrashes.description": "是否尝试阻止 Discord 崩溃。",
    "plugin.CrashHandler.settings.attemptToNavigateToHome.displayName": "尝试返回主页",
    "plugin.CrashHandler.settings.attemptToNavigateToHome.description": "在阻止 Discord 崩溃时是否尝试导航到主页。",

    "plugin.CustomCommands.name": "自定义命令",
    "plugin.CustomCommands.description": "允许你创建自定义斜杠命令 / 标签",

    "plugin.CustomIdle.name": "自定义离开状态",
    "plugin.CustomIdle.description": "允许你设置 Discord 进入离开状态的时间（或禁用自动离开）",
    "plugin.CustomIdle.settings.idleTimeout.displayName": "离开超时时间",
    "plugin.CustomIdle.settings.idleTimeout.description": "Discord 进入离开状态前的分钟数（0 为禁用自动离开）",
    "plugin.CustomIdle.settings.remainInIdle.displayName": "保持离开状态",
    "plugin.CustomIdle.settings.remainInIdle.description": "回到 Discord 时保持离开状态，直到你确认要上线",

    "plugin.CustomRPC.name": "自定义 Rich Presence",
    "plugin.CustomRPC.description": "为你的 Discord 资料添加完全可自定义的 Rich Presence（游戏状态）",
} satisfies Record<string, string>;

export default translations;
