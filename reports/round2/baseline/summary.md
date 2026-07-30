# Round-2 重构基线

冻结日期: 2026-07-30
分支: feature/round2-refactor
触发 HEAD: 改动前 (a83eece: fix(packages): modernize pnpm scripts for ESLint v9 flat config compatibility)

## 质量指标

- **typecheck**: PASS errors=0
  - 命令: `pnpm tsc --noEmit` (exit 0, 输出为空)
- **lint**: PASS warnings=0 errors=0
  - 命令: `pnpm lint` (= `pnpm exec eslint 'src/**/*.{ts,tsx}' --quiet`, exit 0)
- **test**: passed=818 failed=2(同 suite) skipped=2 suites=43 (1 failed suite, 42 passed)
  - 命令: `pnpm exec jest --runInBand`
  - Test Suites: 1 failed, 42 passed, 43 total
  - Tests: 2 skipped, 818 passed, 820 total
  - Snapshots: 0 total
  - 唯一失败 suite: `src/__tests__/core/hooks/useProject.reducer.test.ts`
    - 原因: `Could not locate module @/core/hooks/useProject-reducer` (Jest moduleNameMapper 配置已生效，但 `useProject-reducer.ts` 物理文件不存在；整个 suite 因 import 解析失败而 fail)
- **circular**: cycles=0
  - 命令: `pnpm madge:circular` (Processed 551 files, 2.4s, 172 warnings, no circular dep)
- **knip**: unused-files=0 unused-exports=0
  - 命令: `pnpm knip --no-progress` (exit 0, 输出为空 = 无未使用文件/导出/依赖)
- **jscpd (生产代码)**: 重复率=2.7446%
  - 命令: `pnpm exec jscpd src --pattern '**/*.{ts,tsx}' --min-lines 8 --min-tokens 40 --reporters json --output reports/round2/baseline/jscpd-out`
  - statistics.total: lines=67624 sources=469 clones=161 duplicatedLines=1856

## 已知遗留 / 起跑门槛

- **page tests 仍在 testPathIgnorePatterns** (4 个):
  - `src/__tests__/pages/project-edit.test.tsx`
  - `src/__tests__/pages/project-detail.test.tsx`
  - `src/__tests__/core/api/client.test.ts`
  - `src/__tests__/e2e/` (目录)
- **it.skip / xit / describe.skip 残留**: 2 处 (集中在 `src/__tests__/core/services/project-import-export.service.test.ts`)
- **localStorage 直接调用**: 40 处
  - grep 范围: `localStorage\.(getItem|setItem|removeItem|clear)` (实际 raw grep 计数 40；规格中提到的 30 为粗估)
- **src/shared 仍存在** (`src/shared/{components,constants,stores,types,utils}/`)
- **迁移相关 hint**:
  - `useProject-reducer.ts` 文件名疑似被改动 (suite 中引用 `@/core/hooks/useProject-reducer` 但文件不存在) — 后续阶段需先对齐。
  - 该失败 suite 不在重构目标的核心 services 列表内，归入「known-fail / 待补齐依赖」基线。

## 文件清单

```
reports/round2/baseline/
├── circular.txt
├── jscpd-out/
│   └── jscpd-report.json
├── jscpd.json                     # 拷贝自 jscpd-out/jscpd-report.json
├── jscpd.txt                      # jscpd stdout/stderr
├── knip.txt
├── lint.txt
├── summary.md                     # 本文件
├── test.txt
└── typecheck.txt
```

## 与 Round-2 计划一致性

- Task 1 计划要求产出: `typecheck.txt`, `lint.txt`, `test.txt`, `circular.txt`, `jscpd.json`, `summary.md`
- 实际多产出: `knip.txt`, `jscpd.txt`, `jscpd-out/jscpd-report.json` (作为 knip/jscpd 原始 stdout 备份，便于复盘)
- 所有 .txt/.json/.md 均为只读快照，未触动任何源码。
