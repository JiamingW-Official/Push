# Claude Code — v5.1 Implementation Instructions（开工必读）

> **目的：** 这是 Push v5.1 战略落地到代码库的唯一执行入口。任何 Claude Code session 接手 Push 仓库时按本文件顺序读取、按 P0→P1→P2 顺序执行、按"完成判定"自验收。
> **创建：** 2026-04-18 · **作者：** Strategic hardening pass after YC partner mock review
> **关系：** 本文件 = 工程层执行清单；战略层权威以 `UPDATE_INSTRUCTIONS_v5_1.md` 为准。

---

## 0. 读取顺序（硬规则，不能跳）

新 session 必须按顺序读完以下 5 份文件后才能动代码：

1. `/mnt/Push/CLAUDE.md` — 项目根规则 + v5.1 摘要 + 禁止项
2. `/mnt/Push/.claude/UPDATE_INSTRUCTIONS_v5.md` — v5.0 base（597 行，理解 v5.1 修了什么）
3. `/mnt/Push/.claude/UPDATE_INSTRUCTIONS_v5_1.md` — v5.1 hardening 权威（11 章节，所有数字、Q&A、风险）
4. `/mnt/Push/Design.md` — 设计系统 single source of truth
5. `/mnt/.auto-memory/push_v5_1_execution_plan.md` — 90 天行动计划 + Week 0 阻塞项

**读完后用一句话回答："v5.1 vs v5.0 三条核心变化是什么？"** 答不上来不能动代码。

---

## 1. v5.1 战略锁（每次写代码前自查）

| 维度 | v4.x 旧 | v5.0 中间态 | **v5.1 锁定（权威）** |
|------|---------|-------------|----------------------|
| 对外定位 | "creator marketplace + SaaS" | "AI-Powered Customer Acquisition Agency" | **"Vertical AI for Local Commerce"** |
| Beachhead | NYC 全品类 | Williamsburg pure coffee | **Williamsburg Coffee+（AOV $8-20）** |
| 定价 | $19.99 / $69 / $199 SaaS | flat $40/customer | **按品类分级 $15-85 + Retention Add-on $8-24** |
| Moat 叙事 | 网络效应 + tier system | Day-1 AI verification | **ConversionOracle™ + Creator Productivity Lock** |
| Creator 模型 | 单一 commission | 6-tier commission+milestone | **Two-Segment：T1-T3 per-customer / T4-T6 retainer+equity** |
| 单位经济 | 模糊 | LTV/CAC ~10x | **LTV $6,579 / CAC $420 / 15.7x（基线）** |
| 北极星指标 | GMV | MRR | **SLR (Software Leverage Ratio) Month-12 ≥ 25** |

**禁止词（grep 必须 0 命中）：** `agency`、`marketplace`、`$19.99`、`Performance-Based`、`flat $40`

**新关键词（应出现在对外材料）：** `Vertical AI for Local Commerce`、`ConversionOracle`、`DisclosureBot`、`Coffee+`、`Software Leverage Ratio (SLR)`、`Neighborhood Playbook`

---

## 2. 当前代码库快照（2026-04-18 audit）

### 2.1 已建成（不要重做）

**总计 94 个 page.tsx，60+ API routes，11 个 component 子目录。**

#### Marketing route group `(marketing)` — 29 页
`/`（landing）· `/pricing` · `/how-it-works` · `/for-creators` · `/for-merchants` · `/about` · `/faq` · `/contact` · `/help` + `/help/[slug]` · `/blog` + `/blog/[slug]` · `/case-studies` + `/case-studies/[slug]` · `/careers` + `/careers/[slug]` · `/changelog` · `/press` · `/trust` · `/security` · `/status` · `/api-docs` · `/referrals` · `/merchant/pilot` · `/neighborhoods` + `/neighborhoods/[slug]` · `/legal/{terms,privacy,cookies,acceptable-use}`

#### Merchant `(merchant)` — 20 页
`/merchant/{signup,login,onboarding,dashboard,analytics,billing,payments,qr-codes,locations,locations/[id],campaigns/new,campaigns/[id],applicants,disputes,disputes/[id],integrations,integrations/[slug],messages,notifications,settings}`

#### Creator `(creator)` — 22 页
`/creator/{signup,login,reset-password,onboarding,verify,dashboard,analytics,calendar,campaigns/[id],campaigns/[id]/post,disputes,disputes/[id],earnings,explore,leaderboard,messages,notifications,portfolio,post-campaign,profile,public/[id],settings,wallet}` + `/dashboard`

#### Admin `(admin)` — 13 页
完整 ops 面板（users/campaigns/cohorts/disputes/finance/fraud/audit-log/verifications）

#### Public + demo — 10 页
`/c/[handle]` · `/m/[slug]` · `/invite/[code]` · `/explore` · `/scan/[qrId]` + `/scan/[qrId]/verify` · `/demo` + `/demo/{admin,creator,merchant}`

#### API（关键路由已就位）
- v5 关键 AI/归因路由已存在：`/api/agent/match-creators`、`/api/attribution/scan`、`/api/attribution/verify`
- merchant/creator/admin/disputes/threads 完整 CRUD

#### Components（11 子目录）
`creator/` `disputes/` `landing/` `layout/` `merchant/` `messaging/` `neighborhoods/` `onboarding/` `search/` `settings/` `ui/`

#### Lib（35 模块）
`ai/`（含 prompts.ts）· `attribution/` · `verify/` · `tier-config.ts` · `supabase.ts` + `supabase-server.ts` · `demo-data.ts` 等

### 2.2 已知 v5.1 偏差（必须修，详见 §3）

`grep -i "marketplace|\$19\.99|Performance-Based" app/` 返回 **12 处 / 7 文件**：

| 文件 | 命中数 | 修复策略 |
|------|--------|---------|
| `app/(marketing)/legal/terms/page.tsx` | 1 | 改"Vertical AI for Local Commerce platform" |
| `app/(marketing)/legal/privacy/page.tsx` | 2 | 同上 |
| `app/(marketing)/press/page.tsx` | 4 | 全文重写，去 marketplace 叙事 |
| `app/(merchant)/merchant/integrations/page.tsx` | 1 | 标题/描述去 marketplace |
| `app/(merchant)/merchant/integrations/integrations.css` | 1 | class 名（如 `.marketplace-grid`）改 `.integrations-grid` |
| `app/(merchant)/merchant/dashboard/page.tsx` | 2 | 内部叙事去 marketplace |
| `app/(merchant)/merchant/signup/page.tsx` | 1 | onboarding 文案 |

**Pricing 页虽未命中关键词，但仍是 v5.0 flat $40 / "Performance" 命名 → P0 必改（详见 §3.2）。**

---

## 3. 缺口清单（按 P0 / P1 / P2 排序）

### 3.1 P0 — 阻塞 YC 申请 / 投资人 demo（Week 1-2 必须完成）

| # | 任务 | 路径 | 完成判定 |
|---|------|------|---------|
| P0-1 | **清除 12 处 v4.x 词汇** | 上表 7 文件 | `grep -ri "marketplace\|\$19\.99\|Performance-Based" app/ lib/ components/` 返回 0 |
| P0-2 | **重写 `/pricing`** 为 v5.1 模型 | `app/(marketing)/pricing/page.tsx` | 显示三档 plan：Pilot（First 10 free）/ Operator（按品类 $15-85 + Retention Add-on $8-24）/ Neighborhood（playbook $8-12K launch + $20-35K MRR）。无 "$40 flat"、无 "Performance" 命名 |
| P0-3 | **新建 `/neighborhoods/williamsburg-coffee`** Template 0 proof page | `app/(marketing)/neighborhoods/williamsburg-coffee/page.tsx`（新文件夹） | 页面包含：5 家 LOI 商家头像/Logo（占位也行）、Coffee+ AOV $8-20 解释、Pilot Economics（per-neighborhood cap $4,200）、CTA "Apply for the next 5 slots" |
| P0-4 | **新建 ConversionOracle™ explainer** | `app/(marketing)/conversion-oracle/page.tsx` | 解释：walk-in ground truth = independent training data；vs Google/Meta 的 cold API；accuracy lift 假设 ≥15%；含动效 "三轮训练飞轮" 示意 |
| P0-5 | **新建 DisclosureBot compliance page** | `app/(marketing)/trust/disclosure/page.tsx`（trust 子页） | FTC 16 CFR Part 255 引用、platform-level 强制、AI pre-screen 流程图、$1M E&O insurance 标注 |
| P0-6 | **更新 `/merchant/pilot`** 为 v5.1 硬条款 | `app/(marketing)/merchant/pilot/page.tsx` | 含：First 10 customers free（Williamsburg Coffee+ 限定）、60-day Pre-Pilot LOI ($1)、Pilot-to-Paid conversion 锁定条款、$4,200 cap 注脚 |
| P0-7 | **landing 首页（`/`）h1 + above-fold rewrite** | `app/(marketing)/page.tsx` | h1 = "Vertical AI for Local Commerce"；副标 = SLR 数字证明；CTA 双轨：商家 → /merchant/pilot；creator → /creator/signup |

### 3.2 P1 — Week 3-4 内必须完成（pitch deck / 投资人材料同步引用）

| # | 任务 | 路径 | 完成判定 |
|---|------|------|---------|
| P1-1 | Two-Segment Creator 解释 | `app/(marketing)/for-creators/page.tsx` 重构 | 两段并列：T1-T3 per-customer 计费 / T4-T6 retainer + perf + revenue-share + equity pool |
| P1-2 | Pricing tier 详情子页 | `app/(marketing)/pricing/[category]/page.tsx`（新动态路由） | 至少 4 品类：coffee-plus / restaurant / wellness / retail，各自展示 $15-85 区间 + Retention Add-on |
| P1-3 | SLR 仪表板（merchant dashboard 顶部 widget） | `app/(merchant)/merchant/dashboard/page.tsx` + `components/merchant/SLRWidget.tsx` | 显示当月 SLR、目标线 25、差距、手动操作时长 |
| P1-4 | AI 验证 demo video embed | `components/landing/AgentOutputDemo.tsx` 增强 | 5 分钟 Loom embed slot；vision+OCR+geo 三重验证 UI 复现 |
| P1-5 | Neighborhood Playbook 产品页 | `app/(marketing)/neighborhood-playbook/page.tsx` | $8-12K launch / $20-35K MRR / 4-6 月 payback；3 案例占位 |
| P1-6 | Pilot Economics 透明计算器 | `app/(marketing)/merchant/pilot/economics/page.tsx` | 交互式：输入 neighborhood size → 输出 cap $4,200 / CAC payback 3.85mo / 12-mo merchant LTV $6,579 |
| P1-7 | YC application materials hub（私有） | `app/(admin)/admin/yc-application/page.tsx` | 内部页：链接到 v5.1 doc 的所有 Q&A + 90 天进度面板 |

### 3.3 P2 — Week 5-8 收尾（Pilot 跑起来后做）

| # | 任务 | 路径 | 完成判定 |
|---|------|------|---------|
| P2-1 | ConversionOracle accuracy 公开 dashboard | `app/(marketing)/trust/oracle-stats/page.tsx` | weekly accuracy lift / sample count / merchant cohort |
| P2-2 | Creator T4-T6 equity pool 报名页 | `app/(creator)/creator/equity-program/page.tsx` | 资格门槛、vesting、池子大小（v5.1 §6 数字） |
| P2-3 | Risk Register 公开页（投资人友好） | `app/(marketing)/trust/risk-register/page.tsx` | top 10 风险 + 缓解措施（v5.1 §10） |
| P2-4 | Merchant 案例研究模板（Williamsburg 首批 5 家） | `app/(marketing)/case-studies/williamsburg-coffee-{1..5}/page.tsx` | 每页：before/after MRR、verified visits、ROI |
| P2-5 | DisclosureBot 后台审计 view（admin） | `app/(admin)/admin/disclosure-audit/page.tsx` | 显示 AI pre-screen pass/fail rate、人工 escalation queue |
| P2-6 | Press kit v5.1 重写 | `app/(marketing)/press/page.tsx` 已在 P0 清词；此处补完整 fact sheet + boilerplate v5.1 | boilerplate 全用新关键词；含 founder bio 标准版 |
| P2-7 | API docs 同步 v5.1 endpoint | `app/(marketing)/api-docs/page.tsx` | 标注 ConversionOracle / DisclosureBot 内部 endpoint（labeled "internal preview"） |

### 3.4 P3 — 长尾（Pre-Seed close 后再说）

- Mobile native hand-off page (`/mobile`)
- 多语言（西语 → Williamsburg 拉美裔 creator 池）
- Creator referral leaderboard public 版
- Public API（external developers，v5.1 §11 提到的 "ecosystem play"）

---

## 4. 严格执行规则

### 4.1 写代码前必做
1. 读 `Design.md` 确认任何 UI 改动符合 6 色 / Darky+CS Genio Mono / 直角 / 8px 网格
2. 检查 `CLAUDE.md` 禁止项：v5.1 措辞、Williamsburg-only 限制、不雇全职、不做 v2 feature
3. 用 `grep` 自查不会重新引入 `marketplace|\$19\.99|Performance-Based|agency`

### 4.2 写代码中
- 每个 commit 走 `feat:|fix:|style:|refactor:` 前缀
- 优先 vanilla CSS；新组件先看 `components/ui/` 有没有可复用
- 任何对外文案先 grep "v5.1 关键词" 至少出现 1 个（语义检查）
- 新建页面套 `(marketing)|(merchant)|(creator)|(admin)|(public)` 5 大 route group 之一，不裸建顶级路由

### 4.3 写完后自验收
```bash
# 1. 关键词清洁
grep -ri "marketplace\|\$19\.99\|Performance-Based\|agency" app/ lib/ components/ \
  | grep -v ".test." | grep -v "node_modules"
# 期望：0 命中（除 docs/archive/* 历史文件）

# 2. 构建
npm run build
# 期望：0 error

# 3. v5.1 关键词覆盖
grep -ri "Vertical AI for Local Commerce" app/(marketing)/
# 期望：≥ 5 文件

grep -ri "ConversionOracle" app/(marketing)/ components/
# 期望：≥ 3 文件

grep -ri "Coffee\+\|AOV \$8" app/(marketing)/
# 期望：≥ 2 文件
```

### 4.4 完工后必做
- 更新本文件的 §3 任务表，已完成项打 ✅
- 更新 `/mnt/.auto-memory/push_v5_1_execution_plan.md` Week 进度
- 检查 `Design.md` 是否需要新增组件 spec（如 SLRWidget）

---

## 5. 数字 cheat sheet（写文案时直接抄）

| 数字 | 用途 |
|------|------|
| **$6,579** | 12-mo merchant LTV (50% retention) |
| **$420** | Blended CAC |
| **15.7x** | LTV/CAC base case |
| **10.4x** | LTV/CAC stress case (30% retention) |
| **$6.97** | Per-customer gross margin（27.9%） |
| **$1,051** | Per-merchant monthly revenue（GM $731 = 70%） |
| **$15-85** | Per-customer pricing band（按品类） |
| **$8-24** | Retention Add-on band |
| **$4,200** | Per-neighborhood Pilot cap（硬上限） |
| **3.85 月** | Per-merchant CAC payback |
| **$8-12K** | Per-neighborhood launch cost |
| **$20-35K** | Per-neighborhood MRR target（month 12） |
| **≥ 25** | SLR Month-12 北极星 |
| **≥ 88%** | AI verification accuracy 90 天目标 |
| **≤ 20%** | Manual review rate 90 天目标 |
| **12 / 150 / $8K** | 90 天 paying merchants / verified customers / MRR 硬指标 |

---

## 6. 资金路径（资料里所有融资数字以此为准）

| 轮次 | 金额 | Post-money | 工具 |
|------|------|-----------|------|
| Pre-Seed F&F | $100-200K | $5-8M cap | SAFE (Clerky 模板) |
| YC Standard | $500K | $1.7M + MFN | YC SAFE |
| Demo Day Round | $2-4M | $15-25M cap | post-money SAFE |
| Seed Ext / Pre-A | $5-8M | $30-50M | priced |
| Series A | $15-25M | $80-140M | priced |

---

## 7. Week 0 阻塞项（写代码前先问 founder）

如未完成，**任何代码工作暂停**：

- [ ] v5.1 alignment 全员会议（Jiaming/Z/Lucy/Prum/Milly）
- [ ] Founder equity agreement 签字（4yr vest + 1yr cliff + reverse vesting）
- [ ] Prum 启动 10 家 Williamsburg Coffee+ 老板对话（目标 5 LOI）

---

## 8. 与其他文件的关系

```
CLAUDE.md
  └─ 摘要 + 禁止项（短）
       │
       ├─ UPDATE_INSTRUCTIONS_v5.md（v5.0 base, 597 行）
       │
       ├─ UPDATE_INSTRUCTIONS_v5_1.md（v5.1 hardening, 权威, 11 章）
       │     └─ 数字 / Q&A / Risk Register
       │
       ├─ CLAUDE_CODE_V5_1_INSTRUCTIONS.md（本文件 — 工程层执行入口）
       │     └─ 缺口表 / P0-P3 / grep 自查命令
       │
       ├─ Design.md（UI 权威）
       │
       └─ /mnt/.auto-memory/push_v5_1_execution_plan.md（90 天 Pilot 时序）
```

矛盾时：本文件 < UPDATE_INSTRUCTIONS_v5_1 < CLAUDE.md（最近更新者优先）

---

## 9. 给 Claude Code 的最后嘱咐

1. **别动 v5.0 之前的 P0/P1 已完成项**（94 页 / 60 API 已建成的不要重做）
2. **每次只做一个 P0**，做完跑 §4.3 自验收，过了再做下一个
3. **v5.1 措辞**比 UI polish 重要 10x；先把 12 处词汇清干净，再做新页面
4. **不引入新依赖**，除非 P1-3 SLR widget 需要 charts.js（如果已有 recharts，用 recharts）
5. **每完成一个 P0/P1 task，更新本文件 §3 表 + execution plan 进度**
6. **新页面强制接入 `Header` + `Footer`（位于 `components/layout/`），不裸 div**
7. **任何对外文案改动**，跑一次 `grep -ri "agency\|marketplace\|\$19\.99\|Performance-Based"` 自查；命中 = 回滚

---

**写完一个 P0 后停下来，把 §3 那一行打上 ✅，然后等 founder 验收，再做下一个。不要一次性把 P0-1 ~ P0-7 全推完——每一项都需要 founder review 文案是否到位。**
