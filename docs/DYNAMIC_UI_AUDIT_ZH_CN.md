# Vencord zh-CN Dynamic UI 审计清单（Phase 3.5）

> 生成日期：2026-09-28 · 基线：zh-CN @ 1377aa57 + Phase 3.5 修正
> 扫描方式：对 `src/plugins/**/*.{ts,tsx}` 全量扫描用户可见字符串
> （JSX 文本节点、`label/text/tooltip/title/placeholder/message` 字符串字面量），
> 已排除 `definePluginSettings` 块内条目（归 CENTRAL，由中央覆盖层处理）。
> 本清单是 Phase 4（Dynamic UI 全量处理）的准确工作清单。

## 总览

| 分类 | 数量 | 说明 |
| --- | --- | --- |
| 扫描命中 | 400 | 用户可见候选（含少量噪声） |
| DONE（已 t() 包装） | 26 | Phase 2/3/3.5 已处理，中文生效 |
| CENTRAL（中央覆盖层已覆盖） | 81 | 设置定义内的 option label 等，走 `option.<value>` 键 |
| KEEP-ENGLISH（保留英文） | 110 | 技术/格式/品牌/URL/代码 |
| REVIEW（待人工判断） | 22 | 多为含品牌词的短句，逐条判定 |
| **PLUGIN-T()（剩余待包装）** | **161** | **Phase 4 的实际工作量** |

## 剩余 PLUGIN-T() 优先级分布

| 优先级 | 数量 | 范围 |
| --- | --- | --- |
| P0（高频/核心 UI） | 72 | PinDMs、PermissionsViewer、Translate、Decor、ReviewDB、ShowHiddenChannels 等 |
| P1（常见功能） | 42 | ViewRaw、ViewIcons、CustomRPC、TextReplace、WebScreenShare 等 |
| P2（低频功能） | 34 | 单按钮/单菜单类小插件 |
| P3（技术/开发者向） | 13 | ChatInputButtonAPI、_core 开发工具、arRPC |

> 优先级仅表示开发顺序，不代表插件功能价值评价。
>
> **churn 风险提示**（来自 Phase 1 审计 churn 数据）：P0 中的 Decor、ReviewDB、PermissionsViewer
> 属于 upstream 高频改动插件，包装时 diff 必须保持最小（仅包显示文本）；
> 若某插件在 Phase 4 实施时正处于上游重构期，可降级后置。

## P0（72 条）

| 插件 | 位置 | 类型 | 英文原文 |
| --- | --- | --- | --- |
| BetterRoleContext | `index.tsx:87` | label | Edit Role |
| BetterRoleContext | `index.tsx:100` | label | Copy Role Color |
| BetterRoleContext | `index.tsx:113` | label | View Role Icon |
| BetterRoleContext | `index.tsx:129` | label | View Role Members |
| BetterRoleContext | `index.tsx:152` | jsx | View Role Members |
| BetterRoleContext | `index.tsx:183` | label | Role Actions |
| ClientTheme | `components/Settings.tsx:70` | jsx | Theme Color |
| ClientTheme | `components/Settings.tsx:71` | jsx | Add a color to your Discord client theme |
| ClientTheme | `components/Settings.tsx:82` | jsx | Your theme won't look good! |
| Decor | `ui/components/DecorationContextMenu.tsx:20` | label | Decoration Options |
| Decor | `ui/components/DecorationContextMenu.tsx:24` | label | Copy Decoration Hash |
| Decor | `ui/components/DecorationContextMenu.tsx:32` | label | Delete Decoration |
| Decor | `ui/components/DecorationContextMenu.tsx:39` | title | Delete Decoration |
| Decor | `ui/modals/ChangeDecorationModal.tsx:123` | title | Your Decorations |
| Decor | `ui/modals/ChangeDecorationModal.tsx:139` | title | Change Decoration |
| Decor | `ui/modals/ChangeDecorationModal.tsx:183` | title | Log Out |
| Decor | `ui/modals/ChangeDecorationModal.tsx:212` | text | You already have a decoration pending review |
| Decor | `ui/modals/CreateDecorationModal.tsx:63` | title | Create Decoration |
| Decor | `ui/modals/CreateDecorationModal.tsx:71` | text | Submit for Review |
| Decor | `ui/modals/CreateDecorationModal.tsx:98` | placeholder | Choose a file |
| Decor | `ui/modals/CreateDecorationModal.tsx:110` | placeholder | Companion Cube |
| Decor | `ui/modals/GuidelinesModal.tsx:19` | title | Hold on |
| GreetStickerPicker | `index.tsx:78` | label | Greet Sticker Picker |
| GreetStickerPicker | `index.tsx:81` | label | Greet Mode |
| GreetStickerPicker | `index.tsx:98` | label | Greet Stickers |
| GreetStickerPicker | `index.tsx:115` | label | Unholy Multi-Greet |
| GreetStickerPicker | `index.tsx:140` | label | Send Greets |
| MessageLogger | `HistoryModal.tsx:43` | title | Message Edit History |
| MessageLogger | `HistoryModal.tsx:53` | text | This edit state was not logged so it can't be displayed. |
| PermissionsViewer | `components/icons.tsx:53` | jsx | Not overwritten |
| PermissionsViewer | `components/RolesAndUsersPermissions.tsx:84` | jsx | No permissions to display! |
| PermissionsViewer | `components/RolesAndUsersPermissions.tsx:225` | label | Role Options |
| PermissionsViewer | `components/RolesAndUsersPermissions.tsx:269` | label | User Options |
| PermissionsViewer | `components/UserPermissions.tsx:78` | jsx | Granted By |
| PermissionsViewer | `components/UserPermissions.tsx:162` | text | Role Details |
| PermissionsViewer | `index.tsx:68` | label | View Permissions |
| PermissionsViewer | `index.tsx:197` | text | View Permissions |
| PinDMs | `components/contextMenu.tsx:22` | label | Pin DMs |
| PinDMs | `components/contextMenu.tsx:29` | label | Add Category |
| PinDMs | `components/contextMenu.tsx:52` | label | Unpin DM |
| PinDMs | `components/contextMenu.tsx:61` | label | Move Up |
| PinDMs | `components/contextMenu.tsx:71` | label | Move Down |
| PinDMs | `index.tsx:273` | label | Pin DMs Category Menu |
| PinDMs | `index.tsx:277` | label | Edit Category |
| PinDMs | `index.tsx:287` | label | Move Up |
| PinDMs | `index.tsx:294` | label | Move Down |
| PinDMs | `index.tsx:307` | label | Delete Category |
| ReviewDB | `components/BlockedUserModal.tsx:17` | text | Unblock user |
| ReviewDB | `components/BlockedUserModal.tsx:69` | jsx | No blocked users. |
| ReviewDB | `components/BlockedUserModal.tsx:89` | title | Blocked Users |
| ReviewDB | `components/BlockedUserModal.tsx:92` | jsx | You are not logged into ReviewDB! |
| ReviewDB | `components/MessageButton.tsx:28` | text | Delete Review |
| ReviewDB | `components/MessageButton.tsx:45` | text | Report Review |
| ReviewDB | `components/ReviewComponent.tsx:60` | title | Are you sure? |
| ReviewDB | `components/ReviewComponent.tsx:79` | title | Are you sure? |
| ReviewDB | `components/ReviewComponent.tsx:102` | title | Are you sure? |
| ReviewDB | `index.tsx:50` | label | View Reviews |
| ReviewDB | `index.tsx:63` | label | View Reviews |
| ReviewDB | `index.tsx:183` | jsx | User Reviews |
| ShowHiddenChannels | `components/HiddenChannelLockScreen.tsx:251` | jsx | Posts on this forum require a tag to be set. |
| ShowHiddenChannels | `components/HiddenChannelLockScreen.tsx:264` | text | Permission Details |
| SpotifyControls | `index.tsx:106` | jsx | Check the console for errors |
| SpotifyControls | `PlayerComponent.tsx:207` | label | Total Duration |
| SpotifyControls | `PlayerComponent.tsx:228` | label | Open Album |
| SpotifyControls | `PlayerComponent.tsx:236` | label | View Album Cover |
| Translate | `TranslateIcon.tsx:51` | title | Vencord Auto-Translate Enabled |
| Translate | `TranslateIcon.tsx:85` | tooltip | Open Translate Modal |
| Translate | `TranslateIcon.tsx:101` | text | Auto Translate Enabled |
| Translate | `TranslateModal.tsx:52` | placeholder | Select a language |
| Translate | `TranslateModal.tsx:66` | title | Auto Translate |
| VencordToolbox | `menu.tsx:220` | label | Manage Themes |
| VencordToolbox | `menu.tsx:307` | label | Open Notification Log |

## P1（42 条）

| 插件 | 位置 | 类型 | 英文原文 |
| --- | --- | --- | --- |
| BetterSessions | `components/RenameModal.tsx:60` | jsx | New device name |
| CustomCommands | `CreateTagModal.tsx:84` | jsx | Detected Arguments |
| CustomCommands | `SettingsTagList.tsx:23` | jsx | Registered Tags |
| CustomCommands | `SettingsTagList.tsx:30` | label | Edit Tag |
| CustomCommands | `SettingsTagList.tsx:33` | label | Delete Tag |
| CustomRPC | `RpcSettings.tsx:161` | label | Activity Type |
| CustomRPC | `RpcSettings.tsx:189` | label | Application Name |
| CustomRPC | `RpcSettings.tsx:193` | label | Detail (line 1) |
| CustomRPC | `RpcSettings.tsx:198` | label | State (line 2) |
| CustomRPC | `RpcSettings.tsx:204` | label | Stream Link (Twitch or YouTube, only if activity type is Streaming) |
| CustomRPC | `RpcSettings.tsx:212` | label | Party Size |
| CustomRPC | `RpcSettings.tsx:219` | label | Maximum Party Size |
| CustomRPC | `RpcSettings.tsx:230` | label | Large Image Text |
| CustomRPC | `RpcSettings.tsx:236` | label | Small Image Text |
| CustomRPC | `RpcSettings.tsx:243` | label | Button1 Text |
| CustomRPC | `RpcSettings.tsx:247` | label | Button2 Text |
| CustomRPC | `RpcSettings.tsx:255` | label | Timestamp Mode |
| CustomRPC | `RpcSettings.tsx:267` | label | Same as your current time (not reset after 24h) |
| CustomRPC | `RpcSettings.tsx:280` | label | Start Timestamp (in milliseconds) |
| CustomRPC | `RpcSettings.tsx:287` | label | End Timestamp (in milliseconds) |
| FakeNitro | `index.tsx:175` | title | Hold on! |
| FakeNitro | `index.tsx:803` | title | Hold on! |
| IgnoreActivities | `index.tsx:138` | jsx | Filter List |
| IgnoreActivities | `index.tsx:194` | label | Enable Activity |
| TextReplace | `index.tsx:243` | placeholder | Search for a rule... |
| TextReplace | `index.tsx:251` | jsx | No rules match your search criteria. |
| TextReplace | `index.tsx:289` | label | Only if includes |
| TextReplace | `index.tsx:349` | jsx | Rule Tester |
| TextReplace | `index.tsx:351` | placeholder | Type a message to test rules on |
| TextReplace | `index.tsx:352` | placeholder | Message with rules applied |
| ViewIcons | `index.tsx:117` | label | View Avatar |
| ViewIcons | `index.tsx:125` | label | View Server Avatar |
| ViewIcons | `index.tsx:139` | label | View Avatar Decoration |
| ViewIcons | `index.tsx:164` | label | View Icon |
| ViewIcons | `index.tsx:179` | label | View Banner |
| ViewIcons | `index.tsx:198` | label | View Icon |
| WebScreenShare | `index.tsx:155` | jsx | Stream Muted |
| WebScreenShare | `index.tsx:181` | jsx | Frame Rate |
| WebScreenShare | `index.tsx:191` | jsx | Stream Mode |
| WebScreenShare | `index.tsx:210` | jsx | Mute Stream Audio |
| WebScreenShare | `index.tsx:211` | jsx | Prevents system audio from being included in your stream. |
| WebScreenShare | `index.tsx:222` | jsx | Show Stream Previews |

## P2（34 条）

| 插件 | 位置 | 类型 | 英文原文 |
| --- | --- | --- | --- |
| AddAttachments | `index.tsx:135` | label | Add Attachments |
| AddAttachments | `index.tsx:154` | tooltip | Add Attachments |
| Dearrow | `index.tsx:122` | label | Toggle Dearrow |
| DevCompanion | `index.tsx:101` | title | Dev Companion Connected |
| DevCompanion | `index.tsx:115` | title | Dev Companion Error |
| DevCompanion | `index.tsx:128` | title | Dev Companion Disconnected |
| Experiments | `index.tsx:63` | placeholder | Search experiments |
| Experiments | `index.tsx:137` | jsx | Hold on!! |
| ExpressionCloner | `index.tsx:205` | message | Something went wrong (check console!) |
| ExpressionCloner | `index.tsx:212` | message | Failed to clone:  |
| ExpressionCloner | `index.tsx:237` | jsx | Custom Name |
| FakeProfileThemes | `index.tsx:134` | jsx | Color pickers |
| GameActivityToggle | `index.tsx:186` | label | Enable Game Activity |
| MessageLatency | `index.tsx:154` | text | User is suspected to be on an old Discord Android client |
| MutualGroupDMs | `index.tsx:197` | jsx | You don't have any group chats in common |
| PauseInvitesForever | `index.tsx:75` | jsx | Pause Indefinitely. |
| PreviewMessage | `index.tsx:100` | tooltip | Preview Message |
| RelationshipNotifier | `utils.ts:118` | title | Relationship Notifier |
| ReplaceGoogleSearch | `index.tsx:89` | label | Search Text |
| SendTimestamps | `index.tsx:71` | title | Timestamp Picker |
| SendTimestamps | `index.tsx:91` | jsx | Timestamp Format |
| SendTimestamps | `index.tsx:144` | tooltip | Insert Timestamp |
| ShikiCodeblocks | `previewExample.tsx:12` | jsx | Click Me |
| SilentTyping | `index.tsx:103` | label | Enable Silent Typing |
| StartupTimings | `index.tsx:35` | title | Startup Timings |
| StartupTimings | `StartupTimingPage.tsx:122` | jsx | Server Trace |
| StartupTimings | `StartupTimingPage.tsx:142` | title | Startup Timings |
| UserVoiceShow | `components.tsx:101` | jsx | In Voice Chat |
| VcNarrator | `index.tsx:259` | jsx | Play Example Sounds |
| VcNarrator | `VoiceSetting.tsx:36` | placeholder | Select a voice |
| VcNarrator | `VoiceSetting.tsx:88` | placeholder | Select a language |
| VcNarrator | `VoiceSetting.tsx:110` | jsx | No voices found. |
| VoiceDownload | `index.tsx:33` | label | Download voice message |
| WebPWA | `index.tsx:71` | label | Hop In |

## P3（13 条）

| 插件 | 位置 | 类型 | 英文原文 |
| --- | --- | --- | --- |
| AccountPanelServerProfile | `index.tsx:46` | label | Prioritize Server Profile |
| WebRichPresence (arRPC) | `index.tsx:52` | jsx | Follow the instructions in the GitHub repo |
| ChatInputButtonAPI | `badges/index.tsx:65` | label | Badge Options |
| ChatInputButtonAPI | `badges/index.tsx:70` | label | Copy Badge Name |
| ChatInputButtonAPI | `badges/index.tsx:78` | label | Copy Badge Image Link |
| ChatInputButtonAPI | `badges/index.tsx:136` | message | Successfully refetched badges! |
| ConcatenatedComponentExtractor | `noTrack.ts:163` | message | Analytics tracking is disabled by NoTrack |
| ConcatenatedComponentExtractor | `noTrack.ts:168` | message | Analytics tracking is disabled by NoTrack |
| ConcatenatedComponentExtractor | `settings.tsx:225` | title | Backup & Restore |
| ConcatenatedComponentExtractor | `settings.tsx:232` | title | Patch Helper |
| ConcatenatedComponentExtractor | `supportHelper.tsx:145` | title | Hold on! |
| ConcatenatedComponentExtractor | `supportHelper.tsx:215` | title | Hold on! |
| ConcatenatedComponentExtractor | `supportHelper.tsx:243` | title | Hold on! |

## REVIEW（待人工判断，22 条）

> 含品牌/技术词的短句。判定原则：品牌词保留、功能词翻译（如 "Copy User URL" → "复制用户 URL"）。

| 插件 | 位置 | 类型 | 英文原文 |
| --- | --- | --- | --- |
| WebRichPresence (arRPC) | `index.tsx:50` | jsx | How to use arRPC |
| WebRichPresence (arRPC) | `index.tsx:93` | message | Connected to arRPC |
| CopyEmojiMarkdown | `index.tsx:66` | label | Copy Emoji Markdown |
| CopyUserURLs | `index.tsx:39` | label | Copy User URL |
| CrashHandler | `index.ts:102` | title | Discord has crashed! |
| CrashHandler | `index.ts:137` | title | Discord has crashed! |
| CustomRPC | `index.tsx:264` | jsx | Discord Developer Portal |
| CustomRPC | `RpcSettings.tsx:188` | label | Application ID |
| CustomRPC | `RpcSettings.tsx:194` | label | Detail URL |
| CustomRPC | `RpcSettings.tsx:199` | label | State URL |
| CustomRPC | `RpcSettings.tsx:229` | label | Large Image URL/Key |
| CustomRPC | `RpcSettings.tsx:232` | label | Large Image clickable URL |
| CustomRPC | `RpcSettings.tsx:235` | label | Small Image URL/Key |
| CustomRPC | `RpcSettings.tsx:238` | label | Small Image clickable URL |
| CustomRPC | `RpcSettings.tsx:244` | label | Button1 URL |
| CustomRPC | `RpcSettings.tsx:248` | label | Button2 URL |
| CustomRPC | `RpcSettings.tsx:263` | label | Since discord open |
| GameActivityToggle | `index.tsx:136` | label | Share Spotify Activity |
| MusicRichPresence | `index.tsx:253` | jsx | How to create an API key |
| MusicRichPresence | `index.tsx:255` | jsx | Create API Key |
| SpotifyControls | `PlayerComponent.tsx:223` | label | Spotify Album Menu |
| VencordToolbox | `menu.tsx:215` | label | Edit QuickCSS |

## KEEP-ENGLISH（保留英文，110 条）

技术标识（png/webp/jpg、键位、代码、日志消息、格式示例）、纯小写标识符、URL、
品牌主导短语（如 "Spotify Album Menu"）。完整明细见仓库工作数据（未入库）。

## DONE（已包装，26 条）

| 插件 | 位置 | 原文 |
| --- | --- | --- |
| BiggerStreamPreview | `index.tsx:70` | View Stream Preview |
| CopyStickerLinks | `index.tsx:47` | Copy Sticker Link |
| CopyStickerLinks | `index.tsx:55` | Open Sticker Link |
| ImageZoom | `index.tsx:96` | Square Lens |
| ImageZoom | `index.tsx:104` | Nearest Neighbour |
| ImageZoom | `index.tsx:112` | Zoom |
| ImageZoom | `index.tsx:126` | Lens Size |
| ImageZoom | `index.tsx:140` | Zoom Speed |
| MessageLogger | `index.tsx:186` | Toggle Deleted Highlight |
| MessageLogger | `index.tsx:197` | Remove Message History |
| MessageLogger | `index.tsx:215` | Clear Message Log |
| NewGuildSettings | `index.tsx:90` | Apply NewGuildSettings |
| PictureInPicture | `index.tsx:42` | Toggle Picture in Picture |
| QuickMention | `index.tsx:53` | Quick Mention |
| ReverseImageSearch | `index.tsx:42` | Search Image |
| ServerInfo | `index.tsx:22` | Server Info |
| ShowHiddenChannels | `index.tsx:575` | Hidden Channel |
| Translate | `index.tsx:43` | Translate |
| Translate | `index.tsx:92` | Translate |
| ViewRaw | `index.tsx:89` | Copy Raw Content |
| ViewRaw | `index.tsx:97` | Message Content |
| ViewRaw | `index.tsx:99` | Message Data |
| ViewRaw | `index.tsx:151` | View Raw |
| ViewRaw | `index.tsx:170` | View Raw |
| VoiceMessages | `index.tsx:71` | Send Voice Message |
| VoiceMessages | `index.tsx:213` | Record Voice Message |

> 已包装插件的中文 key 位于 `src/i18n/locales/zh-CN.ts`
> （`plugin.<Name>.menu/.modal/.tooltip/.button/.heading/.popover` 命名空间）。
