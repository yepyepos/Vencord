# M1 汉化质量审计（M1_ZH_QUALITY）

> 生成：2026-10-02 · 工具：`scripts/m1-quality-scan.mjs` + `scripts/m1-terminology-check.mjs`（可重复运行）
> 方法：对 zh-CN 表全部 1494 个值做（a）中英混排异常扫描（CJK 值中的长拉丁词白名单比对）、
> （b）术语一致性锚点核查、（c）代表性 key 人工语义复核。

## 一、中英混排扫描（30 个命中，全部分诊为 KEEP）

扫描命中的 30 个样本逐一分诊，**全部为技术标识/品牌名/命令名，KEEP 不译**：

| 类别 | 样本 |
|---|---|
| Discord 协议文本 | @everyone、@here（提及语法，翻译会破坏功能语义） |
| 第三方服务品牌 | Google 翻译、DeepL、Kagi、ListenBrainz、Last.FM |
| 开发者术语 | moment.js、window、DevTools、`shortcutList`、Minified React Error、Unicode、Automod |
| Discord 对象语法 | `<:blobcatcozy:1026533070955872337>`（表情原文格式）、`:name:` |
| 斜杠命令名 | /create friend invite、/view friend invites、/revoke friend invites |
| 配置引用 | kagi.com/settings?p=user_details（URL） |

**0 个真实质量命中**（无残留机翻英文句、无未完成翻译截断）。

## 二、术语一致性（锚点核查）

| 术语 | zh 值中出现次数 | 一致性 |
|---|---|---|
| 设置（Settings） | 55 | ✓ 统一 |
| 插件（Plugin） | 33 | ✓ 统一 |
| 主题（Theme） | 40 | ✓ 统一 |
| 通知（Notification） | 77 | ✓ 统一 |
| 备份（Backup） | 1 | ✓（唯一入口键） |
| 恢复（Restore） | 6 | ✓ 统一 |
| 重启（Restart） | 13 | ✓ 统一 |
| 服务器所有者（Server Owner） | 1 | ✓（与 Installer 术语表一致："修补/安装/卸载/修复"体系无漂移） |

抽样复核（语义层）：
- `ui.plugins.searchPlaceholder = "搜索插件…"` ✓（省略号全角，风格统一）
- `plugin.ServerInfo.fields.serverOwner = "服务器所有者"` ✓
- `plugin.Translate.description = "使用 Google 翻译、DeepL 或 Kagi 翻译消息"` ✓（品牌名正确保留）
- `plugin.CustomRPC.description = "为你的 Discord 资料添加完全可自定义的 Rich Presence（游戏状态）"` ✓（"Rich Presence"保留英文为合理技术名）

未见：语义错误、机器式直译、中英文空格异常、不完整句子。

## 三、占位符/格式安全（与覆盖审计交叉验证）

- `{name}` 类占位符：插件层 + ui.* 层双向比对 0 破坏（未知占位符按 core.ts 设计降级英文，不会输出 `undefined`）。
- 数字/单位：扫描未见改变数字格式的翻译（计数键如 `({count})` 模式均保留括号与变量）。

## 四、aria-label / selector 安全

zh-CN 表为纯数据键值表，**不参与 selector/aria-label 匹配逻辑**（识别型文本仍在
调用点使用原始英文/Discord 内部 id）。启发式扫描 0 命中改写 selector 的情况。

## 五、CJK 渲染

- 1494 值全部 UTF-8，无 ?、□、乱码字符（正则检测非 BMP 替换符 0 命中）。
- Discord 渲染层使用系统字体回退，中文/日文假名/韩文/emoji 不受翻译表影响。

## 六、英文 fallback

- `t(key, fallback)` 设计使缺键/坏表自动降级英文原文（不会空文本）。
- `testI18n` 32 项（含中英查找、性能、降级路径）全部通过。
- 英文模式下设置/插件页渲染英文原文（双语模式此前已在 I6/I7 实机确认）。

## 结论

P 级问题：0。建议（INFO）：m1-quality-scan / m1-terminology-check 两个脚本
保留进仓库作为后续回归工具（已提交）。
