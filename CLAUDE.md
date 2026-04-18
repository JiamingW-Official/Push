# Push — Workspace Rules

---

## ⚡ v5.1 Strategic Hardening 已落地（2026-04-18）

**当前状态：** v5.1 = v5.0 的硬化层，修复 YC/VC 尽调 10 个结构性漏洞。矛盾处以 v5.1 为准。

**新 session 开工必读顺序（硬规则）：**
1. 本文件（CLAUDE.md）
2. [`.claude/UPDATE_INSTRUCTIONS_v5.md`](./.claude/UPDATE_INSTRUCTIONS_v5.md) — v5.0 base (597 行)
3. **[`.claude/UPDATE_INSTRUCTIONS_v5_1.md`](./.claude/UPDATE_INSTRUCTIONS_v5_1.md) — v5.1 hardening (权威)**
4. **[`.claude/CLAUDE_CODE_V5_1_INSTRUCTIONS.md`](./.claude/CLAUDE_CODE_V5_1_INSTRUCTIONS.md) — 工程层执行入口 (P0-P3 缺口表 + grep 自验收)**
5. [`Design.md`](./Design.md)
6. `/mnt/.auto-memory/push_v5_1_execution_plan.md` — 90 天行动计划 + Week 0 阻塞项

**v5.1 三条核心变化（vs v5.0）：**
- 对外语言 "agency" 全删 → **"Vertical AI for Local Commerce"** + Software Leverage Ratio (SLR) Month-12 ≥ 25
- Beachhead pure coffee → **Coffee+ (AOV $8-20)**；flat $40 → 按品类分级 $15-85 + Retention Add-on $8-24
- Moat AI 验证 → **ConversionOracle™**（walk-in ground truth 独占训练数据）+ **Creator Productivity Lock**

**v5.1 新增组件：** DisclosureBot (FTC 合规) / Two-Segment Creator (T1-T3 per-customer vs T4-T6 retainer+equity) / Pilot Economics Framework ($4,200/neighborhood cap) / Neighborhood Playbook 产品化

**修正后单位经济（锁定）：** Per-customer GM $6.97 (27.9%) / Per-merchant LTV $6,579 / CAC $420 / **LTV/CAC 15.7x**

**Funding roadmap (v5.1 锁定)：** Pre-Seed F&F $100-200K @ $5-8M cap → YC Std $500K @ $1.7M → Demo Day $2-4M @ $15-25M → Seed Ext $5-8M @ $30-50M → Series A $15-25M @ $80-140M

**当前执行阶段：** Week 0（2026-04-18 起），三件硬启动未完成前不推进其他任务：① v5.1 alignment 全员会议 ② Founder equity agreement 签字 ③ Prum 启动 10 家 Williamsburg Coffee+ 对话。详见 `/mnt/.auto-memory/push_v5_1_execution_plan.md`。

**禁止项（violating = 战略偏航）：** Williamsburg 60 天做透前不碰其他 neighborhood / Pre-Seed 关闭前不雇全职员工 / Z 只做 60-day Pilot 必需 feature 不做 v2 / 所有对外材料 grep "agency|marketplace|\$19\.99" 必须 0 命中。

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
