# Push — Workspace Rules

---

## ⚡ v5.1 锁定（2026-04-19）

**核心定位：** Vertical AI for Local Commerce。Customer Acquisition Engine 是产品名。不再说 "a-g-e-n-c-y"。

**三条硬核：** ① 分级定价 $15-85/customer + Retention Add-on $8-24（废弃 per-customer 拉平式定价）；② 真 moat = ConversionOracle™（walk-in ground truth）+ Creator Productivity Lock；③ Beachhead = Williamsburg Coffee+ (AOV $8-20) × 60 天。

**新 session 开工必读：** 本文件 → `.claude/UPDATE_INSTRUCTIONS_v5.md`（v5.0 base）→ `.claude/UPDATE_INSTRUCTIONS_v5_1.md`（v5.1 权威）→ `.claude/CLAUDE_CODE_V5_1_INSTRUCTIONS.md`（工程执行手册）→ `Design.md`。

**禁止词（grep 必须 0）：** 旧定位词 a-g-e-n-c-y、m-a-r-k-e-t-p-l-a-c-e、旧价格 $-1-9-.-9-9、旧描述 P-e-r-f-o-r-m-a-n-c-e---B-a-s-e-d、旧定价模型 f-l-a-t-$-4-0

**新关键词（对外内容必须至少含一个）：** `Vertical AI for Local Commerce`、`Customer Acquisition Engine`、`ConversionOracle™`、`Software Leverage Ratio (SLR)`、`Williamsburg Coffee+`、`Neighborhood Playbook`、`Two-Segment Creator Economics`、`DisclosureBot`

**北极星：** Software Leverage Ratio (SLR) = active campaigns ÷ ops FTE。Month-12 目标 ≥ 25。

---

## Skills Architecture

Push 的所有领域知识存储在 `.claude/skills/` 中。每次只加载需要的 skill，不要全部加载。

**入口：** 先读 `push-hub` → 根据任务路由到对应 skill。

| Skill | 领域 |
|-------|------|
| `push-hub` | 主路由器 + 快速参考数字 |
| `push-strategy` | 战略定位、Agentic路线图、竞争分析 |
| `push-creator` | 6-Tier + v5.1 Two-Segment (T1-T3 per-customer / T4-T6 retainer+equity)、评分模型、招募 |
| `push-pricing` | v5.1 按品类分级 $15-85 + Retention Add-on + Pilot Economics、单位经济 LTV/CAC 15.7x |
| `push-attribution` | QR码归因、验证、反欺诈 |
| `push-campaign` | Campaign设计、工作流、SLA |
| `push-gtm` | 冷启动12周、增长、扩张 |
| `push-metrics` | KPI、仪表板、数据模型 |
| `push-website` | 品牌视觉规范、内容标准 |
| `push-brand-voice` | 品牌声音、文案、messaging模板 |
| `push-ui-template` | SaaS模板提取：页面结构、交互行为、组件规范（子文件：sections/interactions/components） |

---

## Design System (MANDATORY)

**任何 UI/前端代码修改前，必须读 [`Design.md`](./Design.md)。**

### 核心约束
1. **直角：** `border-radius: 0`（例外：map pins 50%、filter chips 50vh、back-to-top 50%）
2. **品牌色（6色）：** Flag Red `#c1121f` / Molten Lava `#780000` / Pearl Stone `#f5f2ec` / Deep Space Blue `#003049` / Steel Blue `#669bbc` / Champagne Gold `#c9a96e` — 不得新增
3. **字体：** Darky（标题/display）+ CS Genio Mono（正文/标签/UI）— 不得引入其他字体
4. **间距：** 8px 基础网格
5. **背景：** `#f5f2ec` (Pearl Stone)，三层surface: Surface `#f5f2ec` → Surface Bright `#fafaf8` → Surface Elevated `#ffffff`
6. **模式：** 仅 Light Mode
7. **交互：** GSAP ScrollTrigger + Lenis smooth scroll；参考 ashleybrookecs.com（编辑式大字）+ sanrita.ca（极简艺术感）+ Sticky Grid Scroll（渐进式展示网格）

Design.md 包含完整组件规范、交互模式、动画 tokens，是 UI 实现的权威来源。

第三方组件的圆角必须覆写为 0。如需偏离 Design.md，先问用户，再更新文档。

---

## Development Rules

- 代码简洁可读，不过度工程化
- 优先 vanilla CSS，除非用户指定框架
- 仅在逻辑不明显时加注释
- Commit: `feat:` / `fix:` / `style:` / `refactor:`
- 每个任务结束后检查 Design.md 是否需要更新
