---
name: push-strategy
description: "Push strategic foundation, positioning, competitive analysis, and agentic roadmap. Use for any 'what is Push', positioning, strategic decision, or competitive question."
---

# Push Strategy — v5.3

**Positioning version**: v5.3 (authoritative)
**Last updated**: 2026-04-20
**Unit economics (LOCKED, inherited from v5.1)**: LTV = $6,579 / CAC = $420 / LTV:CAC = 15.7x
**Changed in v5.3**: positioning narrative, revenue stack, moat language, competitive benchmark set, agentic roadmap overlay. Unit economics untouched.

---

## Section 1: 定位 (v5.3 authoritative)

Push is the **Physical-World Ground Truth Layer** for commerce AI — the verified "ad → physical conversion" signal that Meta, Google, TikTok all lost in iOS 14.

**一句话**: Push 是 post-iOS14 时代 commerce AI 的 ground-truth attribution 层，长期演化为 **Local Commerce World Model** —— 在 neighborhood 尺度预测 creator 介入下的消费者流动。

### 核心洞察

- LLM 缺的不是参数，是"这个广告到底有没有让人真的走进店"的 label
- TikTok 只有 engagement，没有 physical conversion
- Placer.ai 有 foot traffic 但没有 creator attribution
- Push 两者都有，而且有 device-level first-party ID（绕开 IDFA）

### Pitch deck 严格措辞

✅ 能说:
- Physical-world ground truth for commerce AI
- Local commerce world model (Wayve / DeepMind Genie 窄场景意义)
- First-party mobile attribution post-iOS14
- Multimodal creative-to-conversion dataset (creator 内容 ↔ 实到)
- RLHF-grade verified conversion signal
- Vertical commerce AI infra

❌ 禁用表达（narrative red lines）:
- 基础模型厂商 / foundation-model firm 定位
- 在模型层与 OpenAI、Google 或其他 LLM 对抗的叙事
- 声称比 LLM 更高密度 / 更高级
- 商业通用智能（commerce-AGI）宣称
- 通用 AI 平台（general-AI）宣称

### 对标 (投资人认识的)

| Benchmark | Valuation / Scale | Push 从中学到什么 |
|---|---|---|
| **Branch.io** | $4B | first-party mobile attribution — post-IDFA 替代方案的可行估值 |
| **Placer.ai** | $1B, $100M ARR | location intelligence — foot traffic 数据独立可估值 $1B |
| **Foursquare** | $150M rev | consumer app → location intel pivot — 战略路径 proof |
| **Instacart Ads** | $3.5B/yr | first-party ad network — 交易数据驱动内部广告位 |
| **Wayve GAIA-1 / DeepMind Genie** | narrow-domain world model | 窄场景 world model 可融资 — Push = commerce 版本 |

### 五层收入栈 (v5.3 叠加)

1. **Per-customer commission** (v5.1 锁定) — creator 驱动单笔 verified 消费者，按次付费产生的 **收入**
2. **Retention Add-on subscription** (v5.1 锁定) — $8 / $6 / $4 merchant tier 订阅产生的经常性 **收入**
3. **Data licensing** (v5.3 新增) — agency / enterprise / media 三层数据授权 **收入**
4. **First-party ad network** (v5.3 埋线) — 内部广告位拍卖（基于 verified-conversion 排序）产生的 **收入**
5. **Vertical foundation model API** (v5.4+ 预留) — fine-tune 开源模型并按商家 API 调用收取的 **收入**

锁层级（1, 2）定 LTV = $6,579；增层级（3, 4, 5）属 v5.3 optionality，暂不计入 LTV:CAC 15.7x 模型。

### Moat (v5.3 更新)

- **Primary**: **Physical-world ground truth label production** — 全球唯一规模化生产此类 label 的数据源。每条 "creator content → consumer → 实到 → 复购" 链条即一条 label，属 rate-limited data production，不能仅靠写软件复制
- **Secondary**: ConversionOracle™ (CV + OCR + geo triple-check, 与 v5.1 一致)
- **Tertiary**: Creator Productivity Lock (6-tier system, 与 v5.1 一致)
- AI 验证 = feature 不是 moat

### Push IS / Push is NOT (v5.3)

**Push IS**: Physical-World Ground Truth Layer for commerce AI; verified "ad → physical conversion" label source; local commerce world model (Wayve / GAIA-1 narrow-domain 类比); first-party mobile attribution infrastructure; transaction system, trust system, creator credit system, local demand orchestration system.

**Push is NOT**: 基础模型厂商; LLM 层竞品; 商业通用智能平台; generic influencer marketplace; local discovery app; content community; reward / loyalty app; marketing agency.

---

## Section 2: 竞争

Push 不与基础模型（LLM）层厂商竞争。Push 与 **post-iOS14 attribution infra** 与 **location intelligence** 两类公司竞合，并与本地创作者营销传统玩家在下游直接竞争。

### v5.3 竞争地图

| 类别 | 代表公司 | 估值 / 规模 | Push 的差异化 |
|---|---|---|---|
| Mobile attribution (post-iOS14) | **Branch.io**, AppsFlyer, Adjust | Branch.io $4B | Push 有 **physical conversion** label；他们只有 install + in-app event |
| Location intelligence | **Placer.ai**, **Foursquare** | Placer.ai $1B / $100M ARR; Foursquare $150M rev | Push 有 **creator attribution**；他们只看 foot traffic aggregate |
| Retail media / First-party ad | **Instacart Ads**, Amazon DSP | Instacart Ads $3.5B/yr | Push 是 **线下实店版本**；他们是电商 / 配送 |
| Narrow-domain world model | **Wayve GAIA-1**, DeepMind Genie | Wayve 近 30 亿估值级 | Push = **commercial narrow world model**；他们做 autonomous driving |
| 本地创作者营销 (传统) | 地方代理公司, BrandBoost 类, Influence.co | 分散 | Push 是 **verified outcome-priced**；他们 pay-per-post |

### 不竞争的领域

- Push **不**定位在基础模型层
- Push **不**做 general-purpose LLM 或通用智能
- Push **不**正面对抗 Meta / Google 广告平台 —— 相反，Push 是他们可以购买或接入的 **ground truth 数据源**；Meta / Google 的 post-iOS14 归因缺口正是 Push 的 TAM 驱动

### 为什么这条路是对的 (v5.3 thesis)

1. iOS 14 ATT 之后 80%+ 用户拒绝 tracking，attribution 行业估值重挫 — Branch.io $4B 证明市场愿意为 first-party 替代方案付费
2. Placer.ai $1B 估值证明 foot traffic 数据独立即可构成 $1B 公司 — Push 有 creator attribution 做 **乘数**
3. Instacart Ads $3.5B/yr 证明 first-party ad network 能从交易数据反向生长 — Push 的 verified conversion 是更强的广告排序信号
4. Wayve GAIA-1 证明 narrow-domain world model 可融资 — Push 是 commerce 版本的同类资产
5. Foursquare 从 consumer app 转到 location intel 拿到 $150M rev — Push 无需重走 pivot 路径，Day 1 即是 intel 层

### 反驳"复制威胁"

| 复制者 | 为什么做不到 |
|---|---|
| Meta / Google | 他们失去了 deterministic attribution（iOS 14 之后），需要重建 first-party ID — 政治/隐私阻力大 |
| TikTok | 有 engagement 没 physical conversion；没有 creator ↔ 实体店 dispatch pipeline |
| Yelp / OpenTable | 匹配 **existing** demand；Push **创造** demand 并验证物理到店 |
| Placer.ai | 有 foot traffic 没有 creator attribution；加 creator 层需重建 supply 侧 |
| Branch.io | 是 identity infra，不做 creator dispatch / physical verification |

核心 moat: 每条真实的 "creator content → consumer → 实到 → 复购" 链条生成一条 label，该 label 不能从别处采集。这是 **rate-limited data production**，不是软件特性。

---

## Section 3: Agentic 路线图

Push 的 AI 战略分三层：**AI 验证**（已做）→ **AI 运营**（v5.2）→ **AI 数据产品**（v5.3 叠加）。详细阶段计划见 `.claude/skills/push-strategy/agentic-roadmap.md`。

### v5.3 叠加：agency bridge (双轨) + data infrastructure (schema 埋点)

v5.3 相对 v5.2 的新增动作：

1. **Agency bridge (双轨 GTM)** — 在直签商家之外，与本地代理公司建立 revenue-share 管道，用代理的销售力量跑量；Push 平台保留 ground-truth label 所有权。短期加速 label 生产，长期代理公司自然转化为 data licensing 的客户（他们自己也需要归因数据）
2. **Data infrastructure schema 埋点** — 所有 verified conversion event 从 Day 1 以 multi-modal schema 入库（creator content asset + merchant context + device-level first-party ID + geo + timestamp + 后续复购链），为 v5.3 data licensing、v5.4+ vertical model API 预留数据结构。不是后期 retrofit，是 ground-up 设计

这两项均不改动 v5.1 锁定的单位经济（LTV $6,579 / CAC $420 / LTV:CAC 15.7x），只为数据资产增加 **长期 optionality**。

### Six Strategic Pillars (v5.3: 原 5 + 新 1)

1. **Offer OS** — merchants 定义增长目标 → 系统转为结构化 campaign (launch item, drive off-peak, fill event, increase first-visits, test menu)
2. **Creator Credit** — 按 completion rate, reliability, satisfaction, repeat likelihood, dispute history, geography, category fit 评分 —— **不**只看 followers
3. **Attribution** — QR-code transaction-level verification + ConversionOracle (CV+OCR+geo)，30 天窗口
4. **Demand Surface** — 实时 opportunities / closing times / qualifications / payments / scarcity 面板
5. **Liquidity Layer** — standby mechanism 提高 slot fill、engagement、urgency、merchant confidence
6. **Ground Truth Label Pipeline** (v5.3 新增) — 每条 verified conversion 以 multi-modal schema 入湖，供 data licensing、first-party ad ranking、vertical model training 使用

---

## External Positioning (Operational)

### Killer Lines (v5.3)

- **Primary (public):** "Physical-World Ground Truth Layer for Commerce AI — the verified 'ad → physical conversion' signal every post-iOS14 platform is missing."
- **Investors:** "Post-iOS14 ground-truth attribution evolving into Local Commerce World Model; LTV:CAC 15.7x at $6,579 LTV; moat is rate-limited physical-world label production."
- **Merchants:** "Tell us how many customers. We deliver — and you pay when they walk in."
- **Creators:** "Get paid per verified customer; top performers become equity partners."
- **Technical:** "ConversionOracle™ = CV + OCR + geo triple-check. Multi-modal creative-to-conversion dataset. RLHF-grade verified conversion signal."

### Messaging Architecture

Source-of-truth matrices for sales, CS, press, legal. Use Matrix 1 for audience × channel; Matrix 2 for objections; Matrix 3 for every "Push is NOT"; Matrix 4 for word-level policing.

#### Matrix 1 — Audience × Channel × Primary Line

| Audience | Primary Channel | Primary Line | Supporting Line | Disallowed Claim |
|---|---|---|---|---|
| VC (seed/Series A) | Deck, intro call | Investors | Merchants | Model-layer positioning; LLM-layer comparison; "traction" before verified pilot (2026-Q2 W4) |
| Angel | Warm intro | Investors (softened) | Primary public | Same as above |
| Strategic partner | BD intro | Primary public | Technical | Any equity/M&A hint |
| Enterprise (multi-location) | Sales deck | Merchants | Primary public | Per-location ROI unverified |
| Local merchant (pilot) | In-person / phone | Merchants | Primary public | Same ROI caveat |
| Creator T1–T3 | Signup, portal | Creators | Primary public | Equity hints for T1–T3 |
| Creator T4–T6 | 1:1 invite | Creators + equity | Investors | "Guaranteed" equity without board consent |
| Press | Media kit | Primary public | Technical | Competitive attack on named competitors |
| Regulator (FTC, DOL, NYC DCWP) | Written disclosure | Primary public | Technical | Traction claims before 2026-Q2 W4 |
| Data buyer (agency / enterprise) | Data-partnership intro | Investors (data-framed) | Technical | Model-layer language |

#### Matrix 2 — Objection → Response (v5.3)

| Objection | Response Line | Full Talking Point |
|---|---|---|
| "Isn't this a marketplace?" | Merchants | "We deliver outcomes, not introductions. Marketplaces list creators and charge for access. Push only gets paid when a customer walks in and ConversionOracle verifies it." |
| "Isn't this a marketing agency?" | Technical | "Agencies bill hours and sell reach. We bill per verified walk-in and bear platform risk. SLR target 25 is 5x a typical agency." |
| "How is ConversionOracle different from QR?" | Technical | "QR = click. Oracle = CV + OCR on receipts + geo cross-check. QR alone 60–70% confidence; Oracle target >92%." |
| "Why pay $500/mo if Pilot was free?" | Merchants | "Pilot is time-boxed to 10 merchants for AI training. The $500/mo floor funds Oracle — plus $15–85 per verified customer only when they walk in." |
| "How is this different from OpenTable / Resy?" | Primary public | "They match EXISTING demand. We CREATE new demand via creator content and verify at walk-in + loyalty bootstrap." |
| "Why join if I have 50K followers?" | Creators | "We pay per verified walk-in. A 500-follower local creator driving 30 walk-ins beats a 50K creator driving 3." |
| "Can't Meta / Yelp copy this?" | Investors | "Possible in 24 months. Moat: ConversionOracle training-data lock (10k+ labeled events pre-competitor), Creator Productivity Lock (T4–T6 retainer+equity), and rate-limited physical-world ground-truth label production — not copyable by writing software, only by standing up a parallel pipeline." |
| "Are you an AI foundation player?" | Investors | "No. We produce the verified physical-conversion labels that AI models cannot generate themselves. Our benchmark set is Branch.io + Placer.ai + Foursquare + Instacart Ads + Wayve — not model-layer players." |
| "Are you going after the LLM market?" | Investors | "No. We license into AI companies; LLMs need our label to close the ad-to-purchase loop. We sell ground truth, not intelligence." |

#### Matrix 3 — Positive Proof for each "Push is NOT"

| Rejected Category | Why Push is NOT this | Positive Evidence |
|---|---|---|
| Marketing agency | Charge per outcome, not hours | $15–85 per verified customer; $500/mo floor is AI/ops cost, not retainer |
| Creator marketplace | Deliver outcomes, not introductions | Merchant pays only post-walk-in; creator is paid by Push on behalf of merchant |
| Loyalty app | Acquire customers, not retain | Retention add-on caps at $18/customer (push-pricing §2.3); primary **收入** is new-customer acquisition |
| Local discovery platform | Push CREATES demand via content | Creator content is the deliverable; OpenTable-style discovery is not Push's job |
| Coupon engine | Outcome-tied, not discount-tied | No coupon codes; no % off |
| Content community | No UGC feed, no social graph | Creator portal + merchant dashboard only |
| Influencer marketing tool | Per verified customer, not per post | Zero guaranteed payment for posting alone; ConversionOracle required |
| Basis-model / LLM-layer player | We don't train general LLMs | We produce labels that AI models consume; no model-training **收入** in v5.3 plan |

#### Matrix 4 — Words We Use vs Words We Don't (v5.3)

| ✓ Use | ✗ Avoid | Why |
|---|---|---|
| "Physical-World Ground Truth Layer" | "AI-native agency" (v4.1); "Vertical AI for Local Commerce" (v5.1, public) | v5.3 narrative repositioning; legacy terms retained in Changelog only |
| "local commerce world model" | "商业通用智能" / "general-AI for local" | Narrow-domain framing per Wayve precedent |
| "verified conversion label" | "lead" / "visit" | "Lead" is unverified; "visit" is v4.1 |
| "outcome-priced" | "pay-per-post" | v4.1 framing |
| "first-party attribution" | "tracking" / "surveillance" | Regulatory + brand |
| "merchant" / "creator" | "customer" (for merchant) / "influencer" | Precision; FTC risk |
| "ConversionOracle" (™) | "our verification" / "our AI" | Brand term |
| "Two-Segment Economics" | "creator tiers" (alone) | Captures per-customer vs retainer+equity |
| "rate-limited label production" | "data moat" (alone) | More specific; resists the generic "AI moat" cliché |

### Legal & Trademark Review Notes

- **"Physical-World Ground Truth Layer"** — descriptive trade dress; low TM risk. Suggest IP counsel check before paid-media push (USPTO classes 35 advertising/business, 42 SaaS).
- **"Local Commerce World Model"** — descriptive; usage must align with Wayve narrow-domain framing; no general-intelligence framing.
- **"ConversionOracle"** — intent-to-use TM application recommended before landing page push.
- **"We sell verified customers, not software"** — truth-in-advertising review required; keep footnote "*verification precision target 92% at M-12" on marketing collateral.
- **"Creator Productivity Lock"** — internal strategic term; do not use publicly; express retention via contract.
- **Competitor comparisons** — when referencing Branch.io, Placer.ai, Foursquare, Instacart Ads, Wayve in marketing, ensure factual accuracy; cite "according to public filings" where possible; internal matrices must not leak.
- **"Vertical AI for Local Commerce"** — **historical (v5.1) framing**; retained in Changelog and this note for audit purposes; do not use in new collateral.

### Trigger-Response Playbook

| Trigger | Response |
|---|---|
| "Traction?" | "Pre-pilot. First verified pilot results Week 4 of 2026-Q2. Assets: 10-merchant pilot cohort under contract, AI training data pipeline live, FTC-compliant disclosure on landing." |
| "Team?" | Founder (Jiaming), Ops lead (Prum), Creator Ops (Milly). ML Advisor hire in progress. |
| "Funding?" | Pre-seed / friends-and-family currently; Series Seed aligned with pilot results (Q3 2026). |
| "Defensibility?" | "Physical-world ground-truth label production + ConversionOracle training-data lock + Creator Productivity Lock + SLR-driven unit economics. All four deepen with each campaign." |
| "Are you a model-layer AI play?" | "No. We produce labels AI models cannot self-generate. Closer to Branch.io + Placer.ai + Instacart Ads + Wayve than to any model-layer player." |
| "Risks?" | "Regulatory — FTC endorsement rules (addressed). Supply side — creator churn (T4–T6 equity). Demand side — merchant churn at Month 3 (outcome warranty)." |

---

## Company-Building Thesis

**End state**: a new market layer standardizing creator-driven local commerce AND producing the ground-truth attribution data the entire post-iOS14 commerce AI stack needs. OS positioning — Push is not a platform (replaceable) but an **OS** (irreplaceable due to accumulated intelligence: creator scores, merchant playbooks, matched data, verified-conversion label corpus). Category: **Physical-World Ground Truth Layer for Commerce AI**, long-horizon → **Local Commerce World Model**.

Benchmark set: Branch.io (attribution, $4B), Placer.ai (location intel, $1B), Foursquare (consumer→intel pivot, $150M rev), Instacart Ads (first-party retail media, $3.5B/yr), Wayve GAIA-1 (narrow-domain world model). Unit economics reference: LTV $6,579 / CAC $420 / 15.7x.

## Core Invariant

Push only rewards **verified, repeatable value creation**. Three tests: Can it be verified? Can it be repeated? Does it create real value?

## Prioritization Framework

| Priority | Examples |
|----------|----------|
| **Highest** | Verifiable campaign outcomes, creator scoring, repeat merchant workflow, creator retention via progression, anti-disintermediation, standby mechanics, ground-truth label schema integrity |
| **Medium** | Premium membership, advanced analytics, vertical templates, QoL automation, data-licensing tooling, first-party ad-ranking |
| **Low** | Social/community features, broad creator expression, ornamental loyalty |

## Decision Standard

Every major decision must answer YES to at least one:

1. Improves merchant ROI clarity?
2. Improves creator earning power or quality sorting?
3. Deepens platform defensibility?
4. Reduces fraud, friction, or repeat campaign cost?
5. Makes future transactions more likely to stay on-platform?
6. (v5.3) Improves ground-truth label quality, density, or schema richness?

## Strategic Red Flags

Push is drifting if it behaves like: sample-giveaway app, creator coupon engine, posting board, local discovery map with weak economics, content engagement platform with shallow verification, **model-layer AI wannabe**, **general-AI platform**.

---

## Sub-Files

- **`agentic-roadmap.md`** — SaaS winter context, Phase 0–3 roadmap, transition triggers, AI verification capabilities, 5-person team AI leverage. **v5.3 叠加**: agency bridge (双轨 GTM) + data infrastructure schema 埋点 (见 Section 3).
- **`competitive-positioning.md`** — Timing thesis (5 signals), core problems, pain point root causes (5 structural), risk register (top 5 with defenses), data moat, anti-cliché framing rules. **v5.3 叠加**: Branch.io / Placer.ai / Foursquare / Instacart Ads / Wayve benchmark set replacing prior OpenAI/Shopify-style comparisons.

---

## Appendix: v5.3 Changelog

### Positioning evolution timeline

| Version | Date | Primary Positioning | Trigger |
|---|---|---|---|
| v4.1 | 2025-Q3 | "AI-native marketing agency for local commerce" | Initial framing |
| v5.1 | 2026-Q1 | **"Vertical AI for Local Commerce — we sell verified customers, not software"** | Post-agency cleanup; outcome-priced model; locked LTV $6,579 / CAC $420 / 15.7x |
| v5.2 | 2026-Q1 late | Same as v5.1; added messaging architecture matrices | Operational rigor pass |
| **v5.3** | **2026-04-20** | **"Physical-World Ground Truth Layer for Commerce AI; evolving into Local Commerce World Model"** | Narrative repositioning for investor memo + data-licensing opportunity; Branch.io / Placer.ai / Wayve benchmark set replaces Shopify-for-commerce analogy |

### What changed v5.1 → v5.3 (detailed)

1. **Primary positioning line**: "Vertical AI for Local Commerce" (v5.1, historical) → "Physical-World Ground Truth Layer for Commerce AI" (v5.3 authoritative public line). v5.1 phrase survives only in this appendix and in the Legal & TM note as historical reference for audit.
2. **Investor benchmark set**: previously Shopify-for-e-commerce analogy; now Branch.io ($4B) + Placer.ai ($1B / $100M ARR) + Foursquare ($150M rev) + Instacart Ads ($3.5B/yr) + Wayve GAIA-1 (narrow-domain world model). Model-layer / LLM-foundation comparisons explicitly rejected.
3. **Revenue stack**: expanded from 2-layer (per-customer commission + retention subscription) to 5-layer (adds data licensing, first-party ad network, vertical model API). Layers 1–2 locked into LTV model; layers 3–5 are v5.3 optionality and are NOT in the 15.7x ratio.
4. **Moat language**: primary moat is now "physical-world ground truth label production" (rate-limited data moat). ConversionOracle moves to secondary; Creator Productivity Lock to tertiary.
5. **Agentic roadmap**: added "agency bridge (双轨 GTM)" and "data infrastructure schema 埋点" as v5.3 overlays on top of v5.2 execution plan.
6. **Sixth pillar**: "Ground Truth Label Pipeline" added to the Strategic Pillars (now six, not five).
7. **Sixth decision-standard criterion**: "Improves ground-truth label quality, density, or schema richness?" added to the decision framework.
8. **Unit economics**: **UNCHANGED**. LTV $6,579 / CAC $420 / LTV:CAC 15.7x remain the v5.1-locked reference. v5.3 narrative repositioning does not touch the financial model.

### What is explicitly out of scope (v5.3)

- Push is **not** a basis-model / LLM-foundation player.
- Push is **not** positioning against model-layer AI providers.
- Push is **not** pursuing general-purpose commerce intelligence or general-AI platform goals.
- Push is **not** attempting to replace Meta / Google ad platforms — Push sells **into** them as a ground-truth data source.

### Audit trail

- Next positioning review: 2026-Q3 W1, after pilot results land.
- Owner: Jiaming (founder).
- Source-of-truth files: this `SKILL.md` (main), `agentic-roadmap.md` (execution), `competitive-positioning.md` (detail). Any deviation between files must be reconciled here before external use.
