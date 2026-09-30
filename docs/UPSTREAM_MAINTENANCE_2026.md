# Upstream 维护基线（2026-09-30）

> 本文档是 Stable Release `v1.15.7-zh.4` 发布后、**下一维护周期（Upstream Sync Cycle 1）开始前**
> 的官方 upstream 基线快照。同步操作本身属于独立任务，本文档只记录基线与计划。

## 1. 当前 Stable 状态

| 项 | 值 |
| --- | --- |
| Stable Release | `v1.15.7-zh.4`（tag = `685c1914`） |
| Stable upstream base | `90aea0dd`（Vendicated/Vencord，package.json version 1.15.7） |
| 翻译规模 | 1499 keys（ui=259 + tag=21 + plugin=1219，checkI18n 实测） |
| Assets | extension-chrome.zip / extension-firefox.zip / Vencord.user.js（SHA256 见 RELEASE_CHECKSUMS） |

## 2. 官方 upstream 当前状态（2026-09-30 快照）

| 项 | 值 |
| --- | --- |
| upstream/main | `7f0c10cc29fd789f2f4828ae3dc947623e837920` |
| 官方当前版本 | **v1.15.9**（`git describe --tags --always upstream/main` = `v1.15.9`） |
| 待同步范围 | `90aea0dd..7f0c10cc`（10 个提交，含 v1.15.8 / v1.15.9 两次版本推进） |

### 待同步提交清单

```text
7393fac7 v1.15.8
17907c80 Type more stores (#4627)
e4c04f6d fix plugins patching the message popover
a665374f extension: use declarativeNetRequestWithHostAccess instead of declarativeNetRequest
46e81fb2 Update contribution guidelines
799eeba8 fix closeAllModals (#4629)
a581197a FakeProfileThemes: fix crashes
4e4cdeda ExpressionCloner: improve FakeNitro emoji handling (#4526)
7352aa86 fix severe lag caused by bad Discord css
7f0c10cc v1.15.9
```

## 3. ServerInfo Owner 修复关系评估

- `git log 90aea0dd..upstream/main -- src/plugins/serverInfo/` = **空**：
  官方 v1.15.8 / v1.15.9 **未触碰 ServerInfo**，未提供 Owner 获取修复。
- 结论：本地修复（`ownerFetcher.ts` + GuildInfoModal Owner 状态机，02388cb1 / a9223010 / 5a83afcb）
  **继续保留**；同步时留意 `GuildInfoModal.tsx` 的潜在冲突（我们改动了 ServerInfoTab 的
  Owner 字段与 OwnerFallback 组件）。
- 同步后对照检查项：Cache / fetch / timeout / error / fallback / retry 六项——
  若官方未来全覆盖，删除本地 fetcher、保留 zh-CN key（详见 I18N_AUDIT §24.3）。

## 4. 同步时需重点复查的本地改动面

| 本地改动区域 | 同步风险点 |
| --- | --- |
| `src/components/settings/tabs/**`（Core Settings 包装） | 上游对 Settings tabs 的重构（历史高频区） |
| `src/plugins/_core/settings.tsx`（分区标题 getter 化 + titleKey 接口） | 上游改动 buildEntry / EntryOptions |
| `src/plugins/_api/badges/index.tsx`、`_core/supportHelper.tsx`（少量 t()） | 上游重写对应组件 |
| `src/plugins/serverInfo/GuildInfoModal.tsx`（Owner 状态机） | 上游改动 ServerInfo |
| `tsconfig.json` / `eslint.config.mjs` / `package.json`（@i18n 别名 + 3 个脚本） | 上游配置变更 |
| `src/i18n/**`（纯数据 + fetcher） | **零上游冲突**（结构性免疫） |

## 5. Upstream Sync Cycle 1 执行清单（未执行，仅记录）

1. `main` 快进：`git fetch upstream && git switch main && git merge --ff-only upstream/main && git push origin main`
2. `zh-CN` rebase：`git switch zh-CN && git rebase main`（冲突集中在已记录的中央文件）
3. 重新审计：`pnpm checkI18n`（重点看 orphan/missing key）→ `pnpm qaI18n`（core settings
   coverage 会自动抓出新页面漏译）→ `pnpm checkI18nTerms`
4. 翻译新增/变更 UI（新增插件、新增设置、新增 Core Settings 页面）
5. 新增插件的 Dynamic UI 按 Phase 4 流程处理
6. 十一门禁：checkI18n / checkI18nTerms / qaI18n / testI18n / testServerOwner / testTsc /
   lint / build / buildWeb / test（+ lint-styles）
7. 实机复验（Desktop inject + Chrome）后发布 `v1.15.9-zh.1`

## 6. 注意事项

- **不要把 upstream 更新直接混入已发布的 v1.15.7-zh.4**；所有同步产出新 tag。
- 同步后 key 数必然变化（新增插件/设置/上游文案变化），以当时 `pnpm checkI18n` 实测为准，
  不要沿用本文档的 1499。
- `pnpm test` 内含 buildStandalone，会改写 Desktop dist——发布产物必须在 test 之后
  重新 `pnpm build && pnpm buildWeb` 生成（见 RELEASE_CHECKSUMS 说明）。
