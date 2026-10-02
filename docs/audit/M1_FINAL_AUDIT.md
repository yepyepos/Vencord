# M1 最终审计报告（M1_FINAL_AUDIT）

> 审计时间：2026-10-02 · 性质：AUDIT FIRST（全面审计 + 必要最小修复 + 本地验收构建）

## 1. Baseline

- Vencord commit = `2dc20dd9`（zh-CN，clean）
- Installer commit = `dfc77ea`（main，clean；Stable tag v1.4.2-zh.6 = `be81596`）
- Stable = v1.4.2-zh.6（GitHub latest，发布后验证保留）；Vencord Stable dist = v1.15.7-zh.4

## 2. Upstream

- Vencord upstream = `7f0c10cc`（package version **1.15.9**；zh 基线 1.15.7/90aea0dd）
- upstream 领先 10 commits：v1.15.8/v1.15.9、CSS lag 修复、FakeProfileThemes crash 修复、
  closeAllModals 修复、popover patch 修复、浏览器扩展 manifest 变更、discord-types 类型
  补充、贡献文档。**未触及** scripts/build、i18n、serverInfo、pnpm-lock → 同步冲突面小。
- Installer upstream = `fe6e041` = 当前 Stable 基线，**0 个新 commit**，零同步压力。
- 建议（INFO）：可择期做一次常规 upstream sync（Vencord→1.15.9），单独任务执行。

## 3. Localization

- plugins scanned = **168**；t() key = 220/220 覆盖（100%）；ui.* key = 209/209（100%）
- 插件元数据 name+description = **166/166**（含 arRPC 特殊键名核验）
- suspected missing = **0**；false positives = 111 个无 t() 插件全部为行为型/约定型（KEEP）
- 占位符破坏 = 0；硬编码 UI 英文（启发式）= 0；死键 = 0

## 4. Dynamic UI

- audited = React 动态态经 t()+useEffect/useState 体系与 i18n 键扫描覆盖
- pass = 100%（含 ServerInfo 四 tab、插件设置 667 条 settings.* 约定键）
- fail = 0
- 未知占位符按 core.ts 降级英文（不会 undefined / [object Object]）

## 5. Installer

- build = PASS（GUI x64 + CLI x86 本地复现，版本注入 v1.4.2-zh.6 / dfc77ea）
- GUI = PASS（启动/中文/列表/按钮/tooltip/patched 标记/无更新弹窗，实拍截图）
- CLI = PASS（-version / --help 中英双语 / -update-self"已是最新"）

## 6. Install（本次 M1 构建 exe 实测）

- Fresh = PASS（redirector + _app.asar 备份）
- Repair = PASS（幂等）
- Uninstall = PASS（原始 asar SHA256 字节级一致）
- Reinstall = PASS（卸载后再安装成功）

## 7. Update

- Self Update = PASS（升级路径 I7 已验证 zh.4→zh.6 走正式 Release asset）
- Already Latest = PASS（"无法自更新：已是最新版本"，无死循环）
- Network failure = PASS（断网 install/self-update 明确失败、旧 exe 与 Discord 安装完好）
- Hash failure = PASS（Vencord-Desktop-Hash marker mismatch → WARN 契约校验失败 + 判定过期，不误判最新）
- Missing asset = PASS（删 renderer.js → 明确失败，0 部分安装残留；资产已恢复）

## 8. Discord

- Stable = PASS（app-1.0.9259 识别/patch/恢复；中文 Vencord 加载）
- PTB / Canary / Development = NA（机器未安装；空壳与多目录检测由单测+构造回归覆盖）

## 9. Security

- Defender = PASS（M1 构建两 EXE 自定义扫描 0 威胁）
- SmartScreen = expected（未签名；实机 MotW 拦截行为已文档化，未绕过）

## 10. Hash

- SHA256SUMS.txt = LF；`sha256sum -c` **100% MATCH**
  - VencordInstaller.exe = aa695778009e62168b75105e839c108d29cf51b315e14f37e24db17535a0ad9d
  - VencordInstallerCli.exe = 7614365c393f9200d32c7e414ffdb580442805d8c1d970e184166af7301cfcab
- Vencord dist（zh.4，release contract 资产）：4 文件 SHA256 与 docs/RELEASE_CHECKSUMS.md 完全一致

## 11. Tests

- Vencord = PASS：testTsc 0 错、lint 0 错、lint-styles 通过、testI18n 32/32、
  testServerOwner 17/17、pnpm build 成功且 bundle 含修复代码
- Installer = PASS：go test -tags cli 全过（含 TestRejectOfficialRepository 等 22 项）、
  go vet 0 warnings、CI workflow（Windows-only）与 Stable 时一致

## 12. Issues

- P0 = 0
- P1 = 0
- P2 = 0
- P3 = 2
  1. Vencord dist 目录曾混入本地构建全量残留（非发布文件）——M1 中已清理为 4 文件精确
     状态；建议保持 dist 目录只含发布资产（已记录）。
  2. Windows FileVersionInfo 读取版本资源为空——go-winres v0.3.3 既有行为，官方
     v1.4.2 对照一致（已记录于 checksums 文档），非本 fork 缺陷。
- INFO = 3
  1. upstream Vencord 已到 1.15.9（10 commits，冲突面小），建议择期常规 sync。
  2. `scripts/audit-i18n-coverage.ts` 建议纳入 CI，防新增 key 漏翻（本阶段已提交）。
  3. Project package.json version 仍为 1.15.7（保持与 dist 内嵌版本一致，属有意行为；
     upstream 升 1.15.9 时应同步跟进）。

## 13. Fixes

生产代码 **0 修改**（审计结论：无 P0/P1，无需修复）。本阶段产出：
- Vencord：docs/audit/ 四份审计文档 + 3 个可重复运行审计脚本（audit-i18n-coverage /
  m1-quality-scan / m1-terminology-check）
- dist 清理（恢复 zh.4 精确 4 文件状态）
- Installer：artifacts/m1-audit/ 验收包（不进 Git）

## 14. Manual Acceptance Package

- path = `D:\dc插件汉化2\Installer\artifacts\m1-audit\`
- GUI = VencordInstaller.exe（12,279,808 B，x64，LOCAL AUDIT BUILD）
- CLI = VencordInstallerCli.exe（9,408,000 B，x86）
- SHA256SUMS = LF，sha256sum -c 直接通过
- BUILD_INFO = commit/branch/version/时间/Vencord 源与 dist SHA256/构建环境
- 人工验收步骤 = 同目录 TEST_REPORT.md（12 步清单 + 结果表）

## 门禁

P0=0，P1=0，Vencord build=PASS，Installer build=PASS，SHA256=PASS，GUI=PASS，
CLI=PASS，Install=PASS，Repair=PASS，Uninstall=PASS，汉化核心=PASS
→ **AUDIT_BUILD_READY**

## 15. 环境受限项（如实标注）

- DPI 125% / 150% = **NOT TESTED**（切换需系统级注销，无法安全自动化；当前 100% 下
  GUI 布局实拍正常。高 DPI 行为依赖系统 DPI 感知 manifest + giu 运行时缩放，留待
  人工验收/后续任务）
- Administrator 提升 = **NOT TESTED**（UAC 交互无法自动化；Installer 全部功能均为
  用户级目录操作且无提升相关代码分支，Standard User 已完整回归）
- ServerInfo Owner 大服务器人工确认 = 待用户在真实 Discord 中执行（修复已通过
  17 项确定性测试证明三类失败均不永久 Loading；详见 ServerInfo 任务报告）
