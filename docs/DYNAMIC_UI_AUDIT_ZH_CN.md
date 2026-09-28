# Vencord zh-CN Dynamic UI 审计清单（Phase 4 完成版）

> 更新日期：2026-09-28 · 基线：zh-CN（Phase 4 完成）
> 扫描方式：对 `src/plugins/**/*.{ts,tsx}` 全量扫描用户可见字符串
> （JSX 文本节点、`label/text/tooltip/title/placeholder/message` 字符串字面量），
> 已排除 `definePluginSettings` 块内条目（归 CENTRAL，由中央覆盖层处理）。

## 总览（Phase 4 完成状态）

| 分类 | 数量 | 说明 |
| --- | --- | --- |
| 扫描命中 | 407 | 用户可见候选（含少量噪声） |
| **DONE（已 t() 包装，中文生效）** | **210** | Phase 2/3/3.5/4 累计 |
| CENTRAL（中央覆盖层覆盖） | 81 | 设置定义内 option label 等 |
| KEEP-ENGLISH（保留英文） | 116 | 其中 0 条为 Phase 4 记录的有据保留（见下） |
| **Remaining（真正未翻译）** | **0** | **无** |

> REVIEW 22 条已全部判定：20 条翻译（品牌词保留+功能词翻译）、2 条并入 KEEP-ENGLISH。

## KEEP-ENGLISH 有据保留明细（Phase 4 新增 6 条）

| 插件 | 位置 | 原文 | 保留原因 |
| --- | --- | --- | --- |
| Experiments | `index.tsx:64` | Search experiments | patch `find:` 匹配器字符串（技术文本，非 UI） |
| WebPWA | `index.tsx:71` | Hop In | PWA manifest 元数据，来自 Discord 官方资源 |
| ConcatenatedComponentExtractor (NoTrack) | `noTrack.ts:163` | Analytics tracking is disabled by NoTrack | 返回给 Discord 跟踪端点的 mock HTTP 响应体（技术文本） |
| ConcatenatedComponentExtractor (NoTrack) | `noTrack.ts:168` | Analytics tracking is disabled by NoTrack | 同上（第二处端点） |
| ConcatenatedComponentExtractor (Settings) | `settings.tsx:225` | Backup & Restore | deprecated customSections 的动态第三方标题，无法静态包装 |
| ConcatenatedComponentExtractor (Settings) | `settings.tsx:232` | Patch Helper | deprecated customSections 的动态第三方标题，无法静态包装 |

## DONE 明细（210 条，按优先级）

### P0（91 条）

| 插件 | 位置 | 类型 | 英文原文 |
| --- | --- | --- | --- |
| BetterRoleContext | `index.tsx:88` | t() | Edit Role |
| BetterRoleContext | `index.tsx:101` | t() | Copy Role Color |
| BetterRoleContext | `index.tsx:114` | t() | View Role Icon |
| BetterRoleContext | `index.tsx:130` | t() | View Role Members |
| BetterRoleContext | `index.tsx:153` | t() | View Role Members |
| BetterRoleContext | `index.tsx:184` | t() | Role Actions |
| ClientTheme | `components/Settings.tsx:71` | t() | Theme Color |
| ClientTheme | `components/Settings.tsx:72` | t() | Add a color to your Discord client theme |
| ClientTheme | `components/Settings.tsx:83` | t() | Your theme won't look good! |
| ClientTheme | `components/Settings.tsx:101` | t() | Reset Theme Color |
| Decor | `ui/components/DecorationContextMenu.tsx:21` | t() | Decoration Options |
| Decor | `ui/components/DecorationContextMenu.tsx:25` | t() | Copy Decoration Hash |
| Decor | `ui/components/DecorationContextMenu.tsx:33` | t() | Delete Decoration |
| Decor | `ui/components/DecorationContextMenu.tsx:40` | t() | Delete Decoration |
| Decor | `ui/modals/ChangeDecorationModal.tsx:124` | t() | Your Decorations |
| Decor | `ui/modals/ChangeDecorationModal.tsx:125` | t() | You can delete your own decorations by right clicking on them. |
| Decor | `ui/modals/ChangeDecorationModal.tsx:140` | t() | Change Decoration |
| Decor | `ui/modals/ChangeDecorationModal.tsx:184` | t() | Log Out |
| Decor | `ui/modals/ChangeDecorationModal.tsx:213` | t() | You already have a decoration pending review |
| Decor | `ui/modals/CreateDecorationModal.tsx:64` | t() | Create Decoration |
| Decor | `ui/modals/CreateDecorationModal.tsx:72` | t() | Submit for Review |
| Decor | `ui/modals/CreateDecorationModal.tsx:99` | t() | Choose a file |
| Decor | `ui/modals/CreateDecorationModal.tsx:111` | t() | Companion Cube |
| Decor | `ui/modals/GuidelinesModal.tsx:20` | t() | Hold on |
| Experiments | `index.tsx:138` | t() | Hold on!! |
| FakeNitro | `index.tsx:176` | t() | Hold on! |
| FakeNitro | `index.tsx:804` | t() | Hold on! |
| GreetStickerPicker | `index.tsx:79` | t() | Greet Sticker Picker |
| GreetStickerPicker | `index.tsx:82` | t() | Greet Mode |
| GreetStickerPicker | `index.tsx:99` | t() | Greet Stickers |
| GreetStickerPicker | `index.tsx:116` | t() | Unholy Multi-Greet |
| GreetStickerPicker | `index.tsx:141` | t() | Send Greets |
| IgnoreActivities | `index.tsx:139` | t() | Filter List |
| IgnoreActivities | `index.tsx:195` | t() | Enable Activity |
| MessageLogger | `HistoryModal.tsx:44` | t() | Message Edit History |
| MessageLogger | `HistoryModal.tsx:54` | t() | This edit state was not logged so it can't be displayed. |
| MessageLogger | `index.tsx:186` | t() | Toggle Deleted Highlight |
| MessageLogger | `index.tsx:197` | t() | Remove Message History |
| MessageLogger | `index.tsx:215` | t() | Clear Message Log |
| MusicRichPresence | `index.tsx:254` | t() | How to create an API key |
| MusicRichPresence | `index.tsx:256` | t() | Create API Key |
| PermissionsViewer | `components/icons.tsx:59` | t() | Not overwritten |
| PermissionsViewer | `components/RolesAndUsersPermissions.tsx:85` | t() | No permissions to display! |
| PermissionsViewer | `components/RolesAndUsersPermissions.tsx:226` | t() | Role Options |
| PermissionsViewer | `components/RolesAndUsersPermissions.tsx:270` | t() | User Options |
| PermissionsViewer | `components/UserPermissions.tsx:79` | t() | Granted By |
| PermissionsViewer | `components/UserPermissions.tsx:163` | t() | Role Details |
| PermissionsViewer | `index.tsx:69` | t() | View Permissions |
| PermissionsViewer | `index.tsx:198` | t() | View Permissions |
| PinDMs | `components/contextMenu.tsx:23` | t() | Pin DMs |
| PinDMs | `components/contextMenu.tsx:30` | t() | Add Category |
| PinDMs | `components/contextMenu.tsx:53` | t() | Unpin DM |
| PinDMs | `components/contextMenu.tsx:62` | t() | Move Up |
| PinDMs | `components/contextMenu.tsx:72` | t() | Move Down |
| PinDMs | `index.tsx:274` | t() | Pin DMs Category Menu |
| PinDMs | `index.tsx:278` | t() | Edit Category |
| PinDMs | `index.tsx:288` | t() | Move Up |
| PinDMs | `index.tsx:295` | t() | Move Down |
| PinDMs | `index.tsx:308` | t() | Delete Category |
| ReviewDB | `components/BlockedUserModal.tsx:18` | t() | Unblock user |
| ReviewDB | `components/BlockedUserModal.tsx:70` | t() | No blocked users. |
| ReviewDB | `components/BlockedUserModal.tsx:90` | t() | Blocked Users |
| ReviewDB | `components/BlockedUserModal.tsx:93` | t() | You are not logged into ReviewDB! |
| ReviewDB | `components/MessageButton.tsx:29` | t() | Delete Review |
| ReviewDB | `components/MessageButton.tsx:46` | t() | Report Review |
| ReviewDB | `components/ReviewComponent.tsx:61` | t() | Are you sure? |
| ReviewDB | `components/ReviewComponent.tsx:80` | t() | Are you sure? |
| ReviewDB | `components/ReviewComponent.tsx:103` | t() | Are you sure? |
| ReviewDB | `index.tsx:51` | t() | View Reviews |
| ReviewDB | `index.tsx:64` | t() | View Reviews |
| ReviewDB | `index.tsx:184` | t() | User Reviews |
| ShowHiddenChannels | `components/HiddenChannelLockScreen.tsx:252` | t() | Posts on this forum require a tag to be set. |
| ShowHiddenChannels | `components/HiddenChannelLockScreen.tsx:265` | t() | Permission Details |
| ShowHiddenChannels | `index.tsx:575` | t() | Hidden Channel |
| SpotifyControls | `index.tsx:107` | t() | Check the console for errors |
| SpotifyControls | `PlayerComponent.tsx:208` | t() | Total Duration |
| SpotifyControls | `PlayerComponent.tsx:224` | t() | Spotify Album Menu |
| SpotifyControls | `PlayerComponent.tsx:229` | t() | Open Album |
| SpotifyControls | `PlayerComponent.tsx:237` | t() | View Album Cover |
| Translate | `index.tsx:43` | t() | Translate |
| Translate | `index.tsx:92` | t() | Translate |
| Translate | `TranslateIcon.tsx:52` | t() | Vencord Auto-Translate Enabled |
| Translate | `TranslateIcon.tsx:53` | t() | You just enabled Auto Translate! Any message will automatically be translated before being sent. |
| Translate | `TranslateIcon.tsx:54` | t() | Disable Auto-Translate |
| Translate | `TranslateIcon.tsx:86` | t() | Open Translate Modal |
| Translate | `TranslateIcon.tsx:102` | t() | Auto Translate Enabled |
| Translate | `TranslateModal.tsx:53` | t() | Select a language |
| Translate | `TranslateModal.tsx:67` | t() | Auto Translate |
| VencordToolbox | `menu.tsx:216` | t() | Edit QuickCSS |
| VencordToolbox | `menu.tsx:221` | t() | Manage Themes |
| VencordToolbox | `menu.tsx:308` | t() | Open Notification Log |

### P1（70 条）

| 插件 | 位置 | 类型 | 英文原文 |
| --- | --- | --- | --- |
| BetterSessions | `components/RenameModal.tsx:61` | t() | New device name |
| CustomCommands | `CreateTagModal.tsx:47` | t() | Edit Tag |
| CustomCommands | `CreateTagModal.tsx:85` | t() | Detected Arguments |
| CustomCommands | `SettingsTagList.tsx:24` | t() | Registered Tags |
| CustomCommands | `SettingsTagList.tsx:31` | t() | Edit Tag |
| CustomCommands | `SettingsTagList.tsx:34` | t() | Delete Tag |
| CustomRPC | `index.tsx:265` | t() | Discord Developer Portal |
| CustomRPC | `RpcSettings.tsx:162` | t() | Activity Type |
| CustomRPC | `RpcSettings.tsx:189` | t() | Application ID |
| CustomRPC | `RpcSettings.tsx:190` | t() | Application Name |
| CustomRPC | `RpcSettings.tsx:194` | t() | Detail (line 1) |
| CustomRPC | `RpcSettings.tsx:195` | t() | Detail URL |
| CustomRPC | `RpcSettings.tsx:199` | t() | State (line 2) |
| CustomRPC | `RpcSettings.tsx:200` | t() | State URL |
| CustomRPC | `RpcSettings.tsx:205` | t() | Stream Link (Twitch or YouTube, only if activity type is Streaming) |
| CustomRPC | `RpcSettings.tsx:213` | t() | Party Size |
| CustomRPC | `RpcSettings.tsx:220` | t() | Maximum Party Size |
| CustomRPC | `RpcSettings.tsx:230` | t() | Large Image URL/Key |
| CustomRPC | `RpcSettings.tsx:231` | t() | Large Image Text |
| CustomRPC | `RpcSettings.tsx:233` | t() | Large Image clickable URL |
| CustomRPC | `RpcSettings.tsx:236` | t() | Small Image URL/Key |
| CustomRPC | `RpcSettings.tsx:237` | t() | Small Image Text |
| CustomRPC | `RpcSettings.tsx:239` | t() | Small Image clickable URL |
| CustomRPC | `RpcSettings.tsx:244` | t() | Button1 Text |
| CustomRPC | `RpcSettings.tsx:245` | t() | Button1 URL |
| CustomRPC | `RpcSettings.tsx:248` | t() | Button2 Text |
| CustomRPC | `RpcSettings.tsx:249` | t() | Button2 URL |
| CustomRPC | `RpcSettings.tsx:256` | t() | Timestamp Mode |
| CustomRPC | `RpcSettings.tsx:264` | t() | Since discord open |
| CustomRPC | `RpcSettings.tsx:268` | t() | Same as your current time (not reset after 24h) |
| CustomRPC | `RpcSettings.tsx:281` | t() | Start Timestamp (in milliseconds) |
| CustomRPC | `RpcSettings.tsx:288` | t() | End Timestamp (in milliseconds) |
| DevCompanion | `index.tsx:102` | t() | Dev Companion Connected |
| DevCompanion | `index.tsx:116` | t() | Dev Companion Error |
| DevCompanion | `index.tsx:129` | t() | Dev Companion Disconnected |
| ExpressionCloner | `index.tsx:206` | t() | Something went wrong (check console!) |
| ExpressionCloner | `index.tsx:213` | t() | Failed to clone:  |
| ExpressionCloner | `index.tsx:238` | t() | Custom Name |
| FakeProfileThemes | `index.tsx:135` | t() | Color pickers |
| MessageLatency | `index.tsx:155` | t() | User is suspected to be on an old Discord Android client |
| MessageLatency | `index.tsx:159` | t() | User is suspected to be on an old Discord Android client. |
| SendTimestamps | `index.tsx:72` | t() | Timestamp Picker |
| SendTimestamps | `index.tsx:92` | t() | Timestamp Format |
| SendTimestamps | `index.tsx:145` | t() | Insert Timestamp |
| StartupTimings | `index.tsx:36` | t() | Startup Timings |
| StartupTimings | `StartupTimingPage.tsx:123` | t() | Server Trace |
| StartupTimings | `StartupTimingPage.tsx:143` | t() | Startup Timings |
| TextReplace | `index.tsx:244` | t() | Search for a rule... |
| TextReplace | `index.tsx:252` | t() | No rules match your search criteria. |
| TextReplace | `index.tsx:290` | t() | Only if includes |
| TextReplace | `index.tsx:350` | t() | Rule Tester |
| TextReplace | `index.tsx:352` | t() | Type a message to test rules on |
| TextReplace | `index.tsx:353` | t() | Message with rules applied |
| ViewIcons | `index.tsx:118` | t() | View Avatar |
| ViewIcons | `index.tsx:126` | t() | View Server Avatar |
| ViewIcons | `index.tsx:140` | t() | View Avatar Decoration |
| ViewIcons | `index.tsx:165` | t() | View Icon |
| ViewIcons | `index.tsx:180` | t() | View Banner |
| ViewIcons | `index.tsx:199` | t() | View Icon |
| ViewRaw | `index.tsx:90` | t() | Copy Raw Content |
| ViewRaw | `index.tsx:98` | t() | Message Content |
| ViewRaw | `index.tsx:100` | t() | Message Data |
| ViewRaw | `index.tsx:152` | t() | View Raw |
| ViewRaw | `index.tsx:171` | t() | View Raw |
| WebScreenShare | `index.tsx:156` | t() | Stream Muted |
| WebScreenShare | `index.tsx:182` | t() | Frame Rate |
| WebScreenShare | `index.tsx:192` | t() | Stream Mode |
| WebScreenShare | `index.tsx:211` | t() | Mute Stream Audio |
| WebScreenShare | `index.tsx:212` | t() | Prevents system audio from being included in your stream. |
| WebScreenShare | `index.tsx:223` | t() | Show Stream Previews |

### P2（36 条）

| 插件 | 位置 | 类型 | 英文原文 |
| --- | --- | --- | --- |
| AccountPanelServerProfile | `index.tsx:47` | t() | Prioritize Server Profile |
| AddAttachments | `index.tsx:136` | t() | Add Attachments |
| AddAttachments | `index.tsx:155` | t() | Add Attachments |
| BiggerStreamPreview | `index.tsx:71` | t() | View Stream Preview |
| CopyEmojiMarkdown | `index.tsx:67` | t() | Copy Emoji Markdown |
| CopyStickerLinks | `index.tsx:48` | t() | Copy Sticker Link |
| CopyStickerLinks | `index.tsx:56` | t() | Open Sticker Link |
| CopyUserURLs | `index.tsx:40` | t() | Copy User URL |
| Dearrow | `index.tsx:123` | t() | Toggle Dearrow |
| GameActivityToggle | `index.tsx:137` | t() | Share Spotify Activity |
| GameActivityToggle | `index.tsx:187` | t() | Enable Game Activity |
| ImageZoom | `index.tsx:96` | t() | Square Lens |
| ImageZoom | `index.tsx:104` | t() | Nearest Neighbour |
| ImageZoom | `index.tsx:112` | t() | Zoom |
| ImageZoom | `index.tsx:126` | t() | Lens Size |
| ImageZoom | `index.tsx:140` | t() | Zoom Speed |
| MutualGroupDMs | `index.tsx:198` | t() | You don't have any group chats in common |
| NewGuildSettings | `index.tsx:90` | t() | Apply NewGuildSettings |
| PauseInvitesForever | `index.tsx:76` | t() | Pause Indefinitely. |
| PictureInPicture | `index.tsx:43` | t() | Toggle Picture in Picture |
| PreviewMessage | `index.tsx:101` | t() | Preview Message |
| QuickMention | `index.tsx:54` | t() | Quick Mention |
| RelationshipNotifier | `utils.ts:119` | t() | Relationship Notifier |
| ReplaceGoogleSearch | `index.tsx:90` | t() | Search Text |
| ReverseImageSearch | `index.tsx:43` | t() | Search Image |
| ServerInfo | `index.tsx:23` | t() | Server Info |
| ShikiCodeblocks | `previewExample.tsx:18` | t() | Click Me |
| SilentTyping | `index.tsx:104` | t() | Enable Silent Typing |
| UserVoiceShow | `components.tsx:102` | t() | In Voice Chat |
| VcNarrator | `index.tsx:260` | t() | Play Example Sounds |
| VcNarrator | `VoiceSetting.tsx:37` | t() | Select a voice |
| VcNarrator | `VoiceSetting.tsx:89` | t() | Select a language |
| VcNarrator | `VoiceSetting.tsx:111` | t() | No voices found. |
| VoiceDownload | `index.tsx:34` | t() | Download voice message |
| VoiceMessages | `index.tsx:71` | t() | Send Voice Message |
| VoiceMessages | `index.tsx:213` | t() | Record Voice Message |

### P3（13 条）

| 插件 | 位置 | 类型 | 英文原文 |
| --- | --- | --- | --- |
| WebRichPresence (arRPC) | `index.tsx:51` | t() | How to use arRPC |
| WebRichPresence (arRPC) | `index.tsx:53` | t() | Follow the instructions in the GitHub repo |
| WebRichPresence (arRPC) | `index.tsx:94` | t() | Connected to arRPC |
| CrashHandler | `index.ts:103` | t() | Discord has crashed! |
| CrashHandler | `index.ts:138` | t() | Discord has crashed! |
| ChatInputButtonAPI | `badges/index.tsx:66` | t() | Badge Options |
| ChatInputButtonAPI | `badges/index.tsx:71` | t() | Copy Badge Name |
| ChatInputButtonAPI | `badges/index.tsx:79` | t() | Copy Badge Image Link |
| ChatInputButtonAPI | `badges/index.tsx:137` | t() | Successfully refetched badges! |
| ConcatenatedComponentExtractor | `supportHelper.tsx:146` | t() | Hold on! |
| ConcatenatedComponentExtractor | `supportHelper.tsx:147` | t() | Understood |
| ConcatenatedComponentExtractor | `supportHelper.tsx:216` | t() | Hold on! |
| ConcatenatedComponentExtractor | `supportHelper.tsx:244` | t() | Hold on! |

> 已包装插件的中文 key 位于 `src/i18n/locales/zh-CN.ts`
> （`plugin.<Name>.menu/.modal/.tooltip/.button/.heading/.popover/.ui/.player/.settings` 等语义命名空间）。
> 所有 key 均为稳定标识符命名；模板变量经 checkI18n 双向校验。
