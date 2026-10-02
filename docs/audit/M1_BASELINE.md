# M1 审计基线（M1_BASELINE）

> 生成时间：2026-10-02 · 审计阶段：M1（AUDIT FIRST）

## 仓库基线

| 项目 | 值 |
|---|---|
| Vencord HEAD | `2dc20dd9`（zh-CN 分支，工作树 clean） |
| Vencord Stable dist | v1.15.7-zh.4（tag `v1.15.7-zh.4` = `685c1914`；构建 commit `4c73c063`） |
| Installer HEAD | `dfc77ea`（main，工作树 clean；= Stable `be81596` + 2 个 docs commit） |
| Installer Stable | v1.4.2-zh.6（tag `be81596`，GitHub latest release，实测确认） |

## Upstream 距离

| 仓库 | upstream HEAD | upstream 领先 | zh 领先 | 风险 |
|---|---|---|---|---|
| Vendicated/Vencord | `7f0c10cc`（v1.15.9） | **10 commits** | 54 commits | 低（见下） |
| Vencord/Installer | `fe6e041`（v1.4.2） | **0 commits** | 16 commits | 零 |

**Vencord upstream 10 个新 commit 分类**：v1.15.8/v1.15.9 版本号（package.json 1.15.7→1.15.9）、
Discord CSS lag 修复、FakeProfileThemes crash 修复、closeAllModals 修复、message popover
patch 修复、ExpressionCloner 改进、浏览器扩展 declarativeNetRequest 变更、大量 discord-types
.d.ts 类型补充、贡献文档/AGENTS.md。
**未触及**：scripts/build、i18n 体系、serverInfo、pnpm-lock.yaml → 与 zh-CN 54 commits
（汉化/i18n/serverInfo/构建定制）冲突面极小，同步成本低。

## 环境版本

| 工具 | 版本 |
|---|---|
| Node | v22.22.1 |
| pnpm | 11.22.0（项目声明 11.9.0，兼容告警仅 WARN） |
| Go | go1.27.1 windows/amd64 |
| GCC | MinGW-Builds 16.2.0（x86_64-posix-seh） |
| Windows | 10.0.22621（22H2） |

## dist / build / release 状态（审计时点）

- `Vencord/dist`：曾混入本地 `pnpm build` 全量输出残留（Installer/、Vencord.user.js、
  browser/、extension zip 等——M1 前一任务的构建验证副产物，**INFO 级发现**）。
  已清理为与 zh.4 发布资产完全一致的 4 文件状态：
  `patcher.js 2f2e15e0… / preload.js db9a63ca… / renderer.js 03a36ebf… / renderer.css b65982ec…`
- Installer：Stable v1.4.2-zh.6 为 GitHub latest，SHA256SUMS.txt 为 LF
- 汉化构建链：`pnpm build/testTsc/lint/lint-styles/testI18n/testServerOwner` 全部可用
- Installer 构建链：`make GUI=1` / `make` + go-winres，CI（Windows-only release.yml）在 Stable 时验证全绿
