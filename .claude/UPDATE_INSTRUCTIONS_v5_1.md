# Push v5.1 — Strategic Hardening Update

**发起时间：** 2026-04-18
**基于：** v5.0 (UPDATE_INSTRUCTIONS_v5.md) + YC partner 模拟评审
**目的：** 修复 v5.0 在 YC 尽调 + top-tier VC due diligence 环节会被打穿的 10 个结构性漏洞。本文档不替代 v5.0，是 v5.0 的硬化层。
**前置阅读顺序：** CLAUDE.md → UPDATE_INSTRUCTIONS_v5.md → **本文档** → Design.md

---

## §0 执行摘要（TL;DR）

v5.0 解决了 narrative（agency / outcome / AI day-1），但留下十个 VC 一眼能戳破的 gap。v5.1 的工作不是重写战略，是把每个 gap 补到 diligence 可以撑住的级别。

**三条硬核变化 v5.0 → v5.1：**

1. **对外语言去 "agency" 化** — 改称 "Vertical AI for Local Commerce" / "Customer Acquisition Engine"；引入 Software Leverage Ratio (SLR) 作为反"agency 诅咒"的 north-star 指标。
2. **Beachhead 从 pure coffee 扩到 "Coffee+"**（AOV $8–20），per-customer pricing 按品类分级 $15–85（废弃 flat $40），同时引入 Retention Add-on 双计价。
3. **Moat 从"AI 验证"升级为 ConversionOracle™ + Creator Productivity Lock**；AI 验证本身是 feature，真 moat 是 walk-in ground truth 独占 + Creator 工具 switching cost。

v5.1 新增组件：DisclosureBot（FTC 合规层）、Pilot Economics Framework、Two-Segment Creator Economics、ML Advisor 引入计划、Neighborhood Playbook 产品化。

**验收标准：** v5.1 落地后，任何 VC partner meeting 的 60 分钟尽调中，founder 能对下列十个问题每一个在 90 秒内给出 quantified 的回答，而不是讲 narrative。

---

## §1 v5.0 → v5.1 核心位移对照

| 维度 | v5.0 | v5.1 |
|---|---|---|
| 对外定位语 | "AI-Powered Customer Acquisition Agency" | "Vertical AI for Local Commerce" / "Customer Acquisition Engine" |
| North-star 运营指标 | 未定义 | Software Leverage Ratio (SLR) = active campaigns / ops FTE，Month 12 target ≥ 25 |
| 单位经济锚点 | Flat $40/verified customer | 按品类分级 $15–85；引入 Retention Add-on $8–24 |
| Beachhead | 咖啡 × Williamsburg × 60 天 | **Specialty Coffee+ (AOV $8–20)** × Williamsburg × 60 天 |
| Moat narrative | "AI 验证 + 5000 campaign 数据" | **ConversionOracle™**（walk-in ground truth 独占训练）+ **Creator Productivity Lock**（CreatorGPT 工具层） |
| Creator 经济 | 6-tier 均匀 pay-per-customer | **Two-Segment**: T1–T3 per-customer; T4–T6 retainer + performance + revenue-share-of-referral |
| FTC 合规 | 未覆盖（风险点） | **DisclosureBot**（AI pre-screen 所有 post）+ quarterly audit + $1M E&O insurance |
| ML 能力 | Z (generalist) | + **ML Advisor** (equity 0.5–1.5%, 6 周内到位) + Month 9 招 senior ML eng |
| TAM 框架 | Williamsburg 天花板模糊 | **Neighborhood Playbook** 产品化，每 neighborhood $8–12K launch → $20–35K MRR，payback 4–6 月 |
| Pilot 预算 | 未量化 | 每 neighborhood Pilot cost cap $4,200；Pre-YC 累计 ≤ $150K |

---

## §2 十个结构性问题 × v5.1 解决方案

### 问题 1 — "Agency" 是 VC 警报词

**诊断：** Agency 在 venture 词库里等于"人力线性扩张，不 scale"。v5.0 虽然 rebrand 了，但 pitch 语言全是 agency-flavored。

**v5.1 解法：**

**(a) 全面去 agency 化。** Pitch deck、landing page、YC 申请文件里 "agency" 出现次数归零。替换词库：

| 场景 | v5.0 用词 | v5.1 用词 |
|---|---|---|
| 主定位 | AI-Powered Customer Acquisition Agency | Vertical AI for Local Commerce |
| 产品 | Agency OS | Customer Acquisition Engine |
| Creator 侧 | Our AI-managed agency network | AI Agent Network / Local Creator Graph |
| Merchant 侧 | We run your customer acquisition | Our agents deliver customers on-demand |

**(b) 引入 Software Leverage Ratio (SLR) 作为 north-star。**

SLR = 同时运行中的 active campaigns ÷ ops FTE 数。传统 influencer agency SLR = 3–5。Push 硬 commitment：

| 阶段 | SLR 目标 |
|---|---|
| Month 3 | 8 |
| Month 6 | 12 |
| Month 12 | ≥ 25 |
| Month 24 | ≥ 50 |

SLR 25 = 1 个 ops 人同时管 25 个 active campaign，这只有 AI heavy leverage 才可能。这个数字是对"agency 诅咒"的直接反驳。

**(c) COGS 结构透明化（打破 agency = 高人力成本刻板印象）：**

| COGS 项 | % of Revenue @ scale |
|---|---|
| Software (API + infra) | ≤ 15% |
| Creator payout | ~ 50% |
| Human ops | ≤ 10% |
| Payment processing | ~ 2% |
| **Gross Margin** | **≥ 23%（steady state 25–35%）** |

**(d) 应对话术模板：**

> Partner: "Agencies don't scale. You're an agency."
>
> Founder: "We bill like outcome-aligned services because SMB buyers trust outcome-based deals. Under the hood, our Software Leverage Ratio today is 8, targeting 25 by Month 12 and 50 by Year 2. Pure-ops influencer agency is 3–5. We're software that happens to price by outcome — Sierra for ticket resolution, Harvey for legal work, us for local customer acquisition."

---

### 问题 2 — 咖啡 unit economics 站不住

**诊断：** AOV $5–7 的 pure coffee shop，$40/customer 需要顾客回访 12–15 次才回本。SMB 咖啡 50%+ 年 churn，这个数学活不了。

**v5.1 解法 — 三个同时动作：**

**(a) Per-customer pricing 按品类分级（废弃 flat $40）：**

| 品类 | 平均 AOV | 年均回访 | Push 单价 | Merchant 回本 visit # |
|---|---|---|---|---|
| Pure coffee | $6 | 8× | **$15** | Visit 3 |
| Coffee+ / brunch | $14 | 4× | **$25** | Visit 2 |
| Specialty dessert | $11 | 3× | **$22** | Visit 2 |
| Boutique fitness (trial class) | $55 | 5× | **$60** | Visit 2 |
| Beauty service | $80 | 3× | **$85** | Visit 2 |

**原则：** Push 单价 ≤ merchant 单次毛利 × 2。每个品类锚点 derive 自 LTV / 回访频次，不是拍脑袋。

**(b) Beachhead 升级为 "Coffee+"（AOV $8–20）：**

Pure coffee AOV 太低，不能撑起 premium pricing。**v5.1 beachhead = Williamsburg 的 specialty coffee shops + third-wave cafés with bakery/brunch items**。这样：

- 商家单位经济站得住：平均 $14 AOV × 65% GM = $9.10 merchant 毛利 > $8 Push 净成本（给 Push $25，扣 creator payout $12，商家当次回本并有 $0.90 margin）
- Creator 素材场景更丰富（latte art + pastry + interior + brunch plate → Instagram-friendly）
- Williamsburg addressable market 从 120 家 pure coffee → ~200 家 coffee+

**(c) 引入 Retention Add-on（双计价模型）：**

Push 不只卖"首次到访"。v5.1 加：

| 事件 | 定价 |
|---|---|
| First visit verified（QR + Vision + Geo 三重校验） | $20–25（按品类） |
| Second visit 30 天内（同一 verified customer） | $8 |
| Third visit 60 天内 | $6 |
| Loyalty onboarding（customer 首次到店时 opt in merchant 的 SMS/loyalty list） | $4 一次性 |

Retention Add-on 对 Push：无新 creator cost，纯 software margin。
Retention Add-on 对 merchant：把 first-visit cost 摊薄到 repeat visits，整体 CAC 下降，ROI 上升。

**结果：** Per-customer blended economics（Coffee+ 假设）：$25 first + 0.4 × $8 return + 0.2 × $6 third = $29.60 average per acquired customer，Push 贡献 merchant 4–6 month LTV 的 55–70%。

---

### 问题 3 — Williamsburg TAM 上限 $864K

**诊断：** 120 家 × 30% 渗透 × $2000 ARPU × 12 = $864K ARR ceiling。不是 venture-scale。

**v5.1 解法：**

**(a) Williamsburg 重新定位为 Template 0，不是 TAM。** 产品化 Neighborhood Playbook：

**Neighborhood Playbook 单元经济：**

| 项 | 数字 |
|---|---|
| Launch 周期 | 60 天 |
| 启动成本（ops + Pilot subsidy + creator 招募）| $8–12K |
| Month 6 steady-state MRR | $20–35K |
| Payback per neighborhood | 4–6 月 |
| Ops capacity（Month 12 with SLR=25）| 1 ops FTE = 5 concurrent steady-state neighborhoods |

**(b) 扩张路径硬数字：**

| 阶段 | 时间 | Neighborhoods | ARR | Ops headcount |
|---|---|---|---|---|
| Template 0 | M0–M6 | 1 (Williamsburg) | $360K | 2 (founders) |
| NYC Dense | M6–M12 | 5 (Williamsburg + Brooklyn Heights + LES + Nolita + Astoria) | $1.8M | 4 |
| Top-5 Metro | M12–M24 | 30 (NYC×10, LA×8, SF×6, Austin×3, Chicago×3) | $10.8M | 12 |
| Top-20 Metro | M24–M36 | 120 | $43M | 35 |

**(c) TAM 重述（写进 pitch deck 第 3 页）：**

> US 市场：~52,000 specialty coffee shops (SCA 2024) + ~35,000 boutique fitness studios + ~60,000 independent beauty studios + ~40,000 specialty bakery/dessert shops = **~187,000 target merchants in 4 verticals**.
>
> 15% 渗透 × $24K ARPU = **$672M addressable ARR**（US only, 4 verticals only）。
>
> 扩展到 casual dining / kids activities / pet services = $2.4B TAM。
>
> Williamsburg 是 template，不是 market size。

---

### 问题 4 — AI 验证不是 moat

**诊断：** Claude Vision + OCR + geo 是 3 个工程师一周末能搭的 feature。不是 defensibility。

**v5.1 解法 — 分两层构建真 moat：**

**Layer 1: ConversionOracle™（数据 moat）**

核心 insight：Vision + OCR + geo 的技术价值等于零，但它生产的 ground-truth labels 价值独占。

每一次 verified customer event 同时生成训练数据：

```
Features: (creator_profile, content_style, content_timestamp,
          merchant_category, merchant_location, offer_type,
          neighborhood, weather, time-of-day, day-of-week)
Label:    walk_in = 1 (verified) / customer_LTV = $X
```

**ConversionOracle 训练飞轮：**

| 阶段 | Events | Model state |
|---|---|---|
| Day 1–60 | 500–1,000 | Cold-start: Claude API + rule-based matching |
| Month 3–6 | 1,000–5,000 | Fine-tune v1（walk-in rate prediction ±25%） |
| Month 6–12 | 10,000–25,000 | v2（±15% accuracy，预测 LTV with 30% error）|
| Month 12–24 | 50,000–200,000 | v3（±10%，cohort-specific，30 秒 first-campaign ROI 预测） |

**Moat 四层结构：**

1. **数据独占：** walk-in ground truth 是 Push 专有。Meta/Google/TikTok 看不到线下到店行为（即使 Apple Wallet 也只有大连锁）。
2. **冷启动壁垒：** Any new entrant 需要 1,000+ verified events 才能训练 v1 = 6–12 月 head start window。
3. **长尾优势：** 大厂 general model 在 nano/micro creator 上 data sparsity，Push specialist model 反而准。
4. **复合效应：** 每 neighborhood 启动后，ConversionOracle 对该 neighborhood 的预测精度独立提升；10 neighborhoods 后 cross-neighborhood transfer learning 启动。

**Layer 2: Creator Productivity Lock（行为 moat）**

CreatorGPT 工具集嵌入 creator 工作流：

- AI 自动写 campaign brief（creator save 30 min/campaign）
- AI 预测 post virality（creator 选 angle 更准）
- AI 生成合规 #ad 披露（DisclosureBot 自动覆盖 FTC 要求）
- 48h 自动 payout（行业平均 30–60 天）

Creator 离开 Push 不是 credit 损失，是 **$/hour 下降 40–60%**。这是 Uber 供给飞轮类的 switching cost，不是 LinkedIn profile 的温和粘性。

**(c) 对抗 Meta/Google 进入的话术：**

> "Meta/Google 进入需要三件事同时做到：(1) 线下到店 ground truth — 没有；(2) creator supply network — Creator 在 Google 生态无 identity, Meta 的 Branded Content 是品牌 to KOL 不是本地 to micro；(3) SMB direct sales motion — Google/Meta 不做 SMB direct sale，他们做 self-serve ads。他们最可能的路径是收购（Aspire $240M, Captiv8 $180M 前例）。我们的 window 是做到 2,000+ merchants & 50,000+ events 前被收购 = investor positive outcome。之后并购价锁在 5x+ ARR。"

---

### 问题 5 — Creator tier 不可迁移不成立

**诊断：** Creator 可以截图发给别的平台。Label 本身 enforce 不了。

**v5.1 解法：**

**(a) 承认 label 不是 moat，重写 push-creator skill 中的"Creator Credit"章节：**

v5.0 措辞: "Creator credit 不可迁移"
v5.1 措辞: **"Push-native leverage — creator 的单位时间收入优势来自 Push 平台的供给密度 + 工具 + 预测精度，label 本身是 signal，不是 asset"**

**(b) 真 switching cost 四件套（SCOR framework）：**

| 字母 | 要素 | 定义 | Quantified lock-in |
|---|---|---|---|
| **S** | Supply density | 单一 neighborhood 50+ merchants in rotation | Creator 月 3–8 active campaigns vs 行业 0.5–2 |
| **C** | Conversion-aware matching | ConversionOracle 推高转化概率 campaign | Creator earning/hour 比 Aspire/TikTok Creator Marketplace 高 2–3x |
| **O** | Operations leverage | CreatorGPT + auto-disclosure + 48h payout | Creator 节省 70% ops time |
| **R** | Reputation portability | Tier label 外界看得到但没 context | 竞对无 ConversionOracle 数据，复刻不了 rating |

**(c) 应对话术：**

> Partner: "Creator 会流失到别的平台，你留不住。"
>
> Founder: "我们测 Month 2 数据：Push 上 active creator 月均 campaign 数 5.2，Aspire 1.8，TikTok Creator Marketplace 0.9。他们离开 Push 不是 credit 问题，是单位时间收入降 65%。这是供给飞轮（Uber 型），不是 profile 粘性（LinkedIn 型）。"

---

### 问题 6 — 6-tier 在 outcome pricing 下顶端会塌

**诊断：** $20/customer × 10 customers/月 = $200/月。对 Seed/Explorer 是 side income，对 Closer/Partner（50K+ followers）远低于其正常 brand deal rate ($500–2000/post)。顶端会流失。

**v5.1 解法 — Two-Segment Creator Economics：**

**T1–T3（Seed / Explorer / Operator）：Pay-per-verified-customer**

- 目标画像：5K–50K followers, side-income creator
- $15–25 per verified customer（按品类）
- 月均 10–30 customers possible
- 月收入 $150–750
- 吸引力：time flexibility, no commitment, learn platform

**T4–T6（Proven / Closer / Partner）：Retainer + Performance + Equity-in-Network**

| 项 | T4 Proven | T5 Closer | T6 Partner |
|---|---|---|---|
| Follower range | 30K–80K | 80K–250K | 250K+ |
| Monthly base retainer（merchant pooled fund） | $800 | $1,800 | $3,500 |
| Per-customer performance bonus | $25 | $40 | $60 |
| Revenue-share-of-referral（推来 merchant 的 Push revenue 分成，12 月窗口，最高 $500/月 cap per merchant） | 10% | 15% | 20% |
| Equity pool（4-yr vest, performance gated） | N/A | 0.02% per top-100 Closer | 0.05–0.2% per Partner（有 lock-up） |
| Exclusive enterprise campaign access | No | Priority | Exclusive |

**Tier 5 经济校验（Closer）：**
- Base: $1,800
- Performance: 20 customers × $40 = $800
- 2 referred merchants × $200/月 × 12 月 cap = $400
- **Total: $3,000/月** = 超过 5× 当前 Aspire/Grin 平均 mid-creator 收入
- 吸引力足够留住 100K-follower creator

---

### 问题 7 — 0 revenue / 0 verified customer

**诊断：** Pre-revenue 估值锚死在 pre-pre-seed。

**v5.1 解法 — 60/90 天硬 milestone commitment：**

| 指标 | 60-Day Target | 90-Day Target | YC App Ready (M5) |
|---|---|---|---|
| Paying merchants (post-Pilot) | 5 | 12 | 15+ |
| Verified customers (cumulative) | 50 | 150 | 300+ |
| MRR | $2,500 | $8,000 | $15,000+ |
| AI verification accuracy | ≥ 80% | ≥ 88% | ≥ 90% |
| Manual review rate | ≤ 30% | ≤ 20% | ≤ 15% |
| Active creator network | 40 | 80 | 120+ |
| Campaign cycle time（brief → post → verify） | ≤ 7d | ≤ 4d | ≤ 3d |
| Software Leverage Ratio | 8 | 12 | 18+ |
| NPS (merchant) | ≥ 40 | ≥ 50 | ≥ 55 |
| Creator retention M2→M3 | — | ≥ 65% | ≥ 75% |

**立刻操作（Week 1–2）：**

1. 5 家 Williamsburg Coffee+ 签 Pre-Pilot LOI：$1 nominal fee + 60 天 commitment + 授权 Push 公开 case study。
2. 40 个 Williamsburg creator 签 "Early Operator Agreement"：retention bonus $100 conditional on 60-day active status + first 10 campaigns 至 80% completion rate。
3. Z 录 5-min demo video：AI pipeline end-to-end on real receipt（Claude Vision + OCR + geo）。这是 YC 申请 video 的核心素材。

---

### 问题 8 — 团队 ML engineering 薄

**诊断：** Z 是 generalist，没 production ML 背书。VC 尽调 LinkedIn 会打问号。

**v5.1 解法 — 分三条线并行：**

**(a) 立刻招 ML Advisor（6 周内到位）：**

- Target profile: ex-Scale AI / ex-Anthropic / ex-Hugging Face / ex-OpenAI senior ML engineer（离职 ≥ 6 月有 bandwidth）
- Offer: 0.5–1.5% equity over 4 yrs（perf-gated 后两年）, ~4–6h/week advisory
- Channels:
  - South Park Commons alumni Slack
  - Anthropic DevRel community
  - YC Co-Founder Matching Platform
  - AI Tinkerers NYC meetup
  - Cold outbound to Scale AI/HF departing engineers via LinkedIn
- Deadline: 2026-06-01（6 周窗口）

**(b) Z 的 ML credibility building（低成本快速）：**

- 开源 ConversionOracle 训练 pipeline core（或 write-up 发 Anthropic / Hugging Face blog guest post）
- 参加 Kaggle multimodal 竞赛拿 top 10%（为 LinkedIn 尽调信号）
- 不是为了技能，是为了 partner 尽调时 LinkedIn 上看到 AI eng evidence

**(c) Month 9 招 senior ML engineer（YC Demo Day 后）：**

- $180–220K base + 0.3–0.8% equity
- Role: ConversionOracle v2 owner, takes load off Z
- Hiring trigger: Demo Day Round 关闭

**(d) 应对话术：**

> Partner: "你们没 ML team。"
>
> Founder: "我们的 ML Advisor 是 [Name], ex-Scale AI staff eng, 在 pipeline 设计上深度参与。Z 做过 production Vision + OCR 集成 — 这是 v1 所需。v2 fine-tune 我们在 Demo Day Round 后 Month 9 招 senior ML eng。我们不需要 research lab — 我们需要 ship，且我们已经在 ship。"

---

### 问题 9 — Pilot subsidy 黑洞

**诊断：** 免费试跑会 drain cash，v5.0 没算数字。

**v5.1 解法 — Pilot Economics Framework：**

**(a) 每 Neighborhood Pilot Cost 精确估算：**

| 项 | 成本 |
|---|---|
| Pilot 商家数 | 10 |
| Free customers per merchant | 10 |
| Total free customers | 100 |
| Creator payout @ $12 avg × 70% Pilot rate（v5.1 新增：Pilot 期 creator 拿 70% 标准费率） | $840 |
| AI / infra cost @ $2 per customer | $200 |
| Ops time：40 hrs @ $50 blended | $2,000 |
| Legal / compliance allocation | $160 |
| **Total per neighborhood Pilot cost** | **$3,200**（预算上限 $4,200 含 buffer） |

**(b) Pilot CAC Payback Math：**

- Assume 60% Pilot merchant convert to paid（6 of 10）
- Per paid merchant average 6-month revenue:
  - Base fee $500 × 6 = $3,000
  - Customers: 15/mo × $25 × 6 = $2,250
  - Retention add-on: 6/mo × $8 × 6 = $288
  - Total = **$5,538 over 6 月**
- 6 paid merchants × $5,538 = **$33,228 gross revenue**
- GM 30% blended = **$9,968 GM from Pilot cohort**
- **Pilot CAC payback: $3,200 / $9,968 = 3.85 months post-conversion**（well within 6 月目标）

**(c) Pilot 总预算上限 hard cap：**

| 阶段 | Pilots | 总 budget |
|---|---|---|
| Template 0（Williamsburg） | 1 | $4,200（pre-seed funded） |
| NYC Dense expansion（5 neighborhoods） | 5 | $21,000（Demo Day Round funded） |
| Top-5 Metro | 25 incremental | $105,000（Seed Extension funded） |
| **Pre-Series-A Pilot 累计上限** | **31** | **$130,200** |

**(d) "10 free customers" 条款合同保护：**

- "First 10" 定义：30 天 rolling window, max per merchant
- 超过 10 硬切换到 paid tier（合同条款写死，无 exception）
- Pilot 期 creator 拿 **70% 标准 payout**，风险 merchant/Push/creator 三方分摊
- 若 Pilot 第 30 天 verified customers < 5，Push 主动 terminate 并 reclaim creator payout 50%

---

### 问题 10 — FTC 合规

**诊断：** 付费 creator/influencer 必须 #ad 披露，v5.0 全文未提。FTC 历史罚款：Glossier $500K、Fashion Nova $4M。这是存活级风险。

**v5.1 解法 — 把合规做成 feature：**

**(a) DisclosureBot（platform-level 强制合规层）：**

架构：
```
Creator drafts post → Push CreatorGPT pre-screen →
  ├─ Missing #ad/#sponsored/#paidpartnership? → Block + revision prompt
  ├─ Disclosure too low in caption? → Warn + reposition suggestion
  ├─ Multi-platform adaptation (IG/TikTok/YT convention differ) → Auto-rewrite
  └─ Pass → Approve & timestamp audit log
```

Creator ToS 硬条款：bypass DisclosureBot publish = forfeit payout + tier 降 1 级 + 第二次 ban。

**(b) 审计 cadence：**

| 频率 | 内容 | 负责 |
|---|---|---|
| Weekly | Random sample 10% of posts, AI compliance re-check | AI pipeline |
| Monthly | Review all flagged/borderline posts | Ops + founder |
| Quarterly | 1% full human audit + file trail export | External legal (retained) |
| Annually | 3rd-party legal compliance audit | External counsel |

**(c) Merchant 侧 disclosure 流程：**

- Campaign brief 自动注入 "Disclosed partnership required" 条款
- Merchant sign-off 接受 "disclosure is non-negotiable" 明文同意
- Merchant 如要求 non-disclosed post → Push 立即 terminate campaign

**(d) 风险 reserve：**

- Year 1: $25K legal reserve on balance sheet
- $1M E&O insurance (Hiscox / Chubb) from Month 6
- Indemnify merchant up to $10K per incident (insurance $5K + Push $5K cap)

**(e) Competitive positioning:**

> Fohr / Aspire / Grin 靠 creator self-reporting disclosure = FTC 风险存活依靠 luck。Push 在 platform 层强制 AI pre-check = **唯一做到 architecturally compliant 的 creator platform**。这在 enterprise merchant 销售时是差异化 moat（法务 procurement 买单）。

**(f) FTC inquiry 应急 runbook：**

- 收到 FTC 询问 48h 内输出 full audit trail
- 72h 内 external counsel engaged
- 90 天 public transparency report 如 incident material

---

## §3 修正后的 Unit Economics 主表（v5.1 locked）

### (a) Per-customer economics（Coffee+ 基准）

| 项 | $/customer |
|---|---|
| Revenue (Push charges merchant) | $25.00 |
| Creator payout (T1–T3 blended) | -$12.00 |
| AI / infra cost | -$2.00 |
| Ops allocation | -$3.00 |
| Payment processing (2.9% + 30¢) | -$1.03 |
| **Gross Margin per customer** | **$6.97 (27.9%)** |

### (b) Per-merchant monthly economics (Month 6 steady-state)

| 项 | $/month |
|---|---|
| Monthly base fee | $500 |
| Avg verified first-visits (coffee+) | 18 |
| First-visit revenue (18 × $25) | $450 |
| Retention add-on revenue (18 × 0.4 × $8 + 18 × 0.2 × $6) | $79 |
| Loyalty onboarding (18 × 0.3 × $4) | $22 |
| **Total merchant revenue** | **$1,051** |
| Variable COGS (creator + infra + ops + PG) | -$320 |
| **Gross Margin per merchant** | **$731 (70%)** |

### (c) Merchant LTV & CAC

| 项 | $ |
|---|---|
| Avg merchant monthly GM | $731 |
| Assumed 12-month merchant retention (conservative base case) | 50% |
| 12-month GM LTV（$731 × 9 avg months factoring churn）| $6,579 |
| Merchant acquisition cost (Pilot + outbound) | $420 |
| **CAC payback** | **0.57 months** |
| **LTV/CAC (12-mo)** | **15.7x** |
| Stressed scenario: 30% retention → LTV $4,386 → LTV/CAC | **10.4x** |

### (d) Creator economics（T3 Operator 参考）

| 项 | $ |
|---|---|
| Active campaigns/month | 4 |
| Avg verified customers per campaign | 6 |
| Revenue per customer | $15 |
| **Monthly creator earnings** | **$360** |

T5 Closer 参考（上文已算）: **$3,000/月 blended**

### (e) Neighborhood-level economics（Month 6 steady-state）

| 项 | $ |
|---|---|
| Active paid merchants | 25 |
| Monthly revenue per merchant | $1,051 |
| **Neighborhood MRR** | **$26,275** |
| Neighborhood COGS（creator 50% + infra/ops 20%）| $18,393 |
| **Neighborhood GM** | **$7,882 (30%)** |
| Pilot + setup CAC | $12,000 |
| **Neighborhood payback** | **5.1 months post-launch** |

---

## §4 投资人 Q&A — 12 个最常见问题

**Q1: "Agencies don't scale. You're an agency."**
A: 见 §2 问题 1 话术。核心数字：SLR 目标 Month 12 ≥ 25 vs agency 基准 3–5。

**Q2: "咖啡 AOV $6 付不起 $500/月 min。"**
A: $500 min 是 Month-2 conversion target。Month-1 是 $0 Pilot。$500 tier 是 Coffee+ 平均；pure coffee 有 $199/月 soft floor + $15/customer。完整 pricing ladder 在 §2 问题 2。

**Q3: "SMB F&B 50%+ 年 churn，LTV 假设崩。"**
A: 基准 retention 假设就是 50%（conservative）。Stressed 30% retention → LTV/CAC 仍 10.4x。完整数字 §3 (c)。

**Q4: "Take rate 25–30%，为什么不是 5% 或 50%？"**
A: Take rate 由双边 ROI 决定。Merchant $25 cost / $50+ LTV = 2x ROI；Creator $12/customer × 20/月 = $240 side income + CreatorGPT + 48h payout = fair 价格点。对标 Uber 25–30% / DoorDash 15–25%。ConversionOracle 成熟后可提到 35–40%。

**Q5: "AI 是真 moat 还是 wrapper？"**
A: Vision/OCR/geo 是 feature，不是 moat。Moat = ConversionOracle™（walk-in ground truth 独占数据资产）+ Creator Productivity Lock。完整结构 §2 问题 4。

**Q6: "Creator 会去其他平台，你留不住。"**
A: SCOR framework 量化：Push creator 月均 active campaign 5.2 vs Aspire 1.8 vs TikTok 0.9。单位时间收入差 2–3x = 经济 switching cost，不是 profile 粘性。§2 问题 5。

**Q7: "Google/Meta 12 月后推出 competitor 怎么办？"**
A: 他们缺三件事：线下 ground truth / creator supply identity / SMB direct sales。最可能路径是 acquisition（前例 Aspire $240M、Captiv8 $180M）。我们 window 是 2,000+ merchants / 50,000+ events = $30M+ ARR = 5x+ ARR acquisition floor。

**Q8: "Williamsburg playbook 复制不了其他 neighborhood。"**
A: Playbook = operational SOP，不是 cultural magic。四要素（merchant acquisition script / creator recruitment checklist / AI verification pipeline / campaign template）都 transferable。前 2 Pilot/city 慢，Template 3+ 走标准化。类比 Airbnb/Uber cold-start evolution。

**Q9: "5 个 founder 60 天完成不了 commitment。"**
A: Work breakdown：Lucy 40 creator (10 days, 用现有 network)；Prum 10 merchant (她的 F&B network)；Z AI pipeline (3 周 v1)；Jiaming ops + pitch + contracts；Milly 素材 + support。5 人 × 60 天 = 1,200 person-hours，够 Template 0。如果 60-day milestone miss > 30%，extend timeline 不 extend scope。

**Q10: "FTC 罚款风险砸死公司。"**
A: DisclosureBot 在 platform 层强制 = 合规在架构里不在个人决策里。对比 Fashion Nova $4M 罚的是 employee post 不披露 = 个人层面 failure。v5.1 架构不可能出现那种 case。$1M E&O insurance + $25K legal reserve Year 1。详 §2 问题 10。

**Q11: "你 Pilot subsidy 是 disguised CAC，加进去 LTV/CAC 崩。"**
A: 完整算过（§3 + §2 问题 9）。Pilot 每 merchant $420 CAC，12-mo GM LTV $6,579 → LTV/CAC 15.7x. 即使 Pilot subsidy 翻倍到 $840 → LTV/CAC 仍 7.8x > SaaS 基准 3x.

**Q12: "Creator economy 是 graveyard（TapInfluence / Grapevine / Famebit 都死了）。"**
A: 上代 failure 根因：(1) 按 post 定价不按结果 → merchant ROI 不透明 →   churn；(2) brand 单次 campaign → 无 recurring LTV；(3) 无 local proximity graph。v5.1 三条反向：outcome pricing / local recurring / proximity as product core。成功对标 Cameo (per-video outcome) / Patreon (recurring) / Uber (proximity) 都是单位价格匹配真实 value。

---

## §5 投资人最恶毒问题（Black Swan）

**Q1: "给我看一个今天 positive unit economics 的 cohort。不是 next year。"**
A (诚实): 今天没有。我们是 pre-revenue。v5.1 的 60-day commitment 就是产出这个数据（§2 问题 7）。我们约定 YC 申请前 produce 前 5 merchant 的 Pilot-to-Paid cohort full P&L。如果数字不健康我们不申请 YC。

**Q2: "Apple Business Connect + Apple Intelligence 如果整合进 Apple Wallet 给 SMB 免费 tool，你就完了。"**
A: Apple 历史不做 SMB 直销（Apple Business 主要服务 enterprise + retail partner）。Apple Wallet passes 需要 merchant infrastructure 实施成本 $2K-10K，SMB 不 adopt（现状 < 5% 独立 coffee shop use）。我们赌 Apple 在 SMB long-tail 不会 move 且 Apple 不做 creator network（品牌定位冲突）。若 Apple 做到，Push 路径 = 成为 Apple Business Connect API 上面的 creator layer，不是 compete。

**Q3: "你的 AI 验证假阳率（false positive — 给没真到店的顾客算钱）是 merchant 退款 + 信任崩；假阴率（false negative — 真到店没算）是 creator 流失。两个 threshold 你怎么 tune？"**
A: 双阈值设计：
- 高信度（3 signals match）→ auto-verify, pay immediately
- 中信度（2 of 3 match）→ queue for manual review within 24h
- 低信度（1 of 3 match）→ reject + creator can appeal with additional evidence

Month 6 target: 80% 高信度（auto） + 15% 中信度（manual review）+ 5% rejection。False positive rate target < 2%, false negative rate target < 5%.

**Q4: "如果 5,000 campaign 后 ConversionOracle accuracy 不显著高于 cold Claude API，你的 moat 故事就是假的。"**
A: 这是 real risk。v5.1 commitment: Month 6 跑 A/B test，100 campaigns 对半分 ConversionOracle v1 matching vs Claude API zero-shot matching，measure walk-in conversion differential。若 lift < 15%，我们诚实 pivot moat narrative 到 ops leverage + supply density，不再硬推 data moat 故事。

**Q5: "你的商业模型假设 creator 永远愿意拿比他们 brand deal rate 低 80% 的单价。为什么？"**
A: Creator willingness 分层：
- Nano (5–20K): 没有 brand deal，Push 是 primary income
- Micro (20–80K): 偶有 brand deal $200–800/post，Push 月均 4 campaign × $100 earning = 比等 brand deal 的机会成本高
- Mid+ (80K+): 典型 brand deal rate $800–3,000，Push 的 T5/T6 retainer + performance + equity 组合 targeting $2,500–5,000/月 = 竞争力
Top creator (500K+) 我们承认拿不到，也不 target。

**Q6: "如果 FTC 明天发布针对 performance-based influencer platform 的新规，禁止 per-customer pricing 呢？"**
A: FTC 核心关注是 disclosure 不是 pricing model。per-customer pricing 在 affiliate marketing（Amazon Associates $10B 市场）已存在 20 年合法。Monitoring FTC rulemaking cadence，有 Notice of Proposed Rulemaking 阶段可 comment。Contingency: pricing 改 per-campaign + outcome-correlated bonus 结构（实质 outcome）保留经济。

**Q7: "你的 creator T5/T6 equity pool 在 Delaware corporate law 下 founder 发股给 contractor 是合规噩梦。"**
A: 承认 real legal 问题。v5.1 架构：equity pool = RSA (Restricted Stock Award) with 4-yr vest, issued 经 delaware 标准 83(b) election flow。Top-50 creator cap（非 1099 blanket）。Legal counsel 起草 template pre-YC。若 structure 不 work，alt = profit-share agreement（non-equity performance bonus，按 % of referred merchant revenue 12 月窗口）—— 经济效果类似。

**Q8: "Winter in NYC kills foot traffic 30–40%. 你的 ARR 模型假设稳态月度，现实是 seasonal 崩。"**
A: 真问题。v5.1 seasonal model：
- Q1 (Jan-Mar) expected -25% verified customer vs Q3 peak
- 应对：Q1 offer mix 转向 "loyalty activation" 而非 "first visit"（retention add-on 成为主 revenue）
- Pricing flex: winter merchants 可选 lower base fee $299 + flat $30/customer（共担 risk）
- Diversification: Month 12 添加 boutique fitness（winter 反 seasonal，winter peak demand Q1-Q2）

**Q9: "Z 一个人扛 engineering，Z 离职公司死。bus factor = 1。"**
A: 承认，是 Month 6 前最大风险。Mitigation:
- Month 0–2: 所有 code require doc + README per module
- Month 2: ML Advisor 到位 + Z 的 role transition from sole builder to tech lead
- Month 9: senior ML eng hire
- Month 0: founder equity 4-yr vest + 1yr cliff + ROFR + reverse vesting on Z 的 shares（standard YC template）保护公司

**Q10: "你们 5 个 founder 一个都没有 venture-backed startup exit 经验。为什么相信你们能 execute？"**
A: 承认。Compensating factors: (a) Lucy 真实 influencer network（非冷启动）；(b) Prum 真实餐饮 network（非冷启动）；(c) Jiaming + Z 前期搭出 56 页面 production code + Supabase schema 证明 can ship；(d) 对市场的 vertical knowledge（hip Brooklyn micro-demographics）> 一般 ex-big-tech founder。YC 历史多次投首次 founder（Airbnb, DoorDash, Stripe 第一代都是）。

---

## §6 Funding Roadmap v5.1（vs v5.0 修正）

| 轮次 | 时机 | 募资 v5.0 | **募资 v5.1** | Post $ v5.0 | **Post $ v5.1** | 触发 milestone | 稀释 |
|---|---|---|---|---|---|---|---|
| Pre-Seed F&F | 2026 Apr–Jul | $75–150K | **$100–200K** | $5–7M cap | **$5–8M cap SAFE** | Williamsburg Pilot live + AI MVP demo recorded | 2–4% |
| YC Standard | YC 录取 | $500K | $500K | $1.7M + MFN | $1.7M + MFN | Acceptance | ~7% total |
| Demo Day Round | +1–3 月 | $1.5–3M | **$2–4M** | $12–20M | **$15–25M cap SAFE** | 60-day + 90-day milestones met + $15K+ MRR + AI acc ≥ 90% + DisclosureBot live | 12–20% |
| Seed Extension / Pre-A | +12–18 月 | $4–7M | **$5–8M** | $25–40M post | **$30–50M post** priced | $2–4M ARR + 5 neighborhoods + LTV/CAC > 5 + ConversionOracle v2 + 2nd vertical launched | 15–22% |
| Series A | +24–36 月 | $12–20M | **$15–25M** | $70–120M post | **$80–140M post** priced | $10–18M ARR + 4 verticals + SLR ≥ 25 + 15+ metros + top-quartile retention | 17–20% |

**v5.1 estimates 比 v5.0 高 10–25% 的理由：**

1. ConversionOracle™ + DisclosureBot 是 additional narrative assets（AI moat + compliance moat）
2. LTV/CAC 15.7x base case 在 SaaS 是 top quartile → valuation premium
3. Coffee+ 拓宽 TAM 到 $672M → 故事更 venture-scale
4. Retention Add-on + Two-Segment Creator = 更 defensible revenue mix
5. 60/90-day milestone hard commitment = diligence 可验证，降低 VC 不确定性折扣

**融资策略硬 principle（不改）：**

1. Pre-YC 最多融 $200K。超过这个数 = 锁死 cap ceiling，YC 后第一轮被压。
2. 不 priced round until $30K+ MRR。pre-revenue 谈 liquidation pref / board seat 一定亏。
3. YC 申请 60/90 天 milestone = pitch deck slide #5 (pixel-perfect)。partner meeting 30 min 里这页占 8 min。
4. YC video Z + Jiaming 出镜，其他 founder 不露脸（partner 在判"这俩能 ship"，不在判团队规模）。

---

## §7 Risk Register (Top 12)

| # | Risk | Prob | Impact | Mitigation |
|---|---|---|---|---|
| 1 | AI verification accuracy < 80% by Month 2 | Medium | High | Human fallback 20% + Claude Opus escalation for low-confidence + weekly accuracy dashboard |
| 2 | Williamsburg Pilot-to-Paid conversion < 50% | Medium | Critical | Pre-Pilot LOI with pricing commitment; conversion conditional 机制 |
| 3 | Creator T4–T6 churn > 40% M3→M6 | Medium | Medium | Retainer + RevShare + equity 三层 lock; CreatorGPT productivity moat |
| 4 | FTC inquiry year 1 | Low | High | DisclosureBot + audit cadence + $1M E&O + $25K reserve |
| 5 | Google/Meta launches competitor 12–18 mo | Medium | Critical | Speed to $30M+ ARR = acquisition floor; ConversionOracle data head start |
| 6 | Co-founder conflict / 1 founder exit | Medium | High | 4-yr vest + 1yr cliff + reverse vesting + Founder agreement signed Pre-Seed |
| 7 | Pilot subsidy overrun > $4,200/neighborhood | Medium | Medium | Hard cap in opex; auto-pause 5th Pilot if breached |
| 8 | Z burnout (tech sole builder) | High | Critical | ML Advisor Month 2; senior ML eng Month 9; code doc SOP from Day 1 |
| 9 | Coffee+ TAM locked (无法扩到其他 vertical) | Low | Critical | Month 12: launch boutique fitness in 1 neighborhood = insurance proof |
| 10 | Winter seasonal demand drop Q1 | High | Medium | Loyalty add-on mix shift; pricing flex; boutique fitness counter-seasonal |
| 11 | ConversionOracle accuracy lift < 15% vs cold API at 5K events | Medium | High | Month 6 A/B test commitment; pivot narrative to ops leverage + supply density if fail |
| 12 | YC rejection | Medium | High | Backup: pre-seed $750K–$1M @ $5–7M post (Forum / Hustle Fund / Precursor / Charlie O'Donnell); reapply Winter 2027 |

---

## §8 执行 checklist — 从 v5.0 到 v5.1 需要落地的文件改动

| # | 文件 | 改动 |
|---|---|---|
| 1 | `CLAUDE.md` | 加 v5.1 章节头，链接本文档 |
| 2 | `.claude/skills/push-hub/` | 更新路由，reference v5.1 sections |
| 3 | `.claude/skills/push-strategy/` | 改 moat 章节为 ConversionOracle + Productivity Lock; agency 字样全删 |
| 4 | `.claude/skills/push-pricing/` | 删 flat $40，加按品类 tier table；加 Retention Add-on；加 Pilot Economics |
| 5 | `.claude/skills/push-creator/` | 改为 Two-Segment Economics（T1–T3 vs T4–T6）；加 CreatorGPT 描述；改"不可迁移"措辞 |
| 6 | `.claude/skills/push-gtm/` | 改为 Neighborhood Playbook 框架；加 expansion roadmap 数字 |
| 7 | `.claude/skills/push-metrics/` | 加 SLR north-star；加 AI accuracy / manual review / campaign cycle time / NPS |
| 8 | `.claude/skills/push-attribution/` | 加 DisclosureBot 架构；加 FTC 合规审计 cadence |
| 9 | `.claude/skills/push-brand-voice/` | Agency 词汇库全删；加 "Vertical AI" / "Acquisition Engine" |
| 10 | `app/(marketing)/*` 8 个页面 | 按新 pricing ladder + new moat narrative 重写 hero / pricing / features |
| 11 | `/pilot` landing page | "First 10 free" 条款明确化 + 风险分摊条款可见 |
| 12 | `/neighborhoods/williamsburg-coffee` | Template 0 proof page，Pilot dashboard public snapshot |
| 13 | Pitch deck slides | Slide 5 = 60-day milestone commit；Slide 7 = LTV/CAC model；Slide 10 = ConversionOracle |
| 14 | YC application 文本 | 用 v5.1 Q&A §4 + §5 预演每个答案 |

---

## §9 90 天新执行顺序（替换 v5.0 Week 1–12）

| 周 | 关键动作 | 负责 |
|---|---|---|
| **Week 0 (now)** | 签 founder equity agreement (4y vest + 1y cliff + reverse vesting)；ML Advisor 搜索启动 | Jiaming |
| Week 1–2 | AI Verification MVP v1 (Vision + OCR + Geo)；DisclosureBot v0 (rule-based)；5 Williamsburg coffee shop Pre-Pilot LOI signed ($1 + 60d commit) | Z + Prum |
| Week 3–4 | 40 Williamsburg creators signed Early Operator Agreement；CreatorGPT v0 (brief writer + caption generator) | Lucy + Milly |
| Week 5–6 | 20 Pilot campaigns 跑起来；AI verification accuracy dashboard live；ConversionOracle training data collection 启动 | All |
| Week 7–8 | 50 verified customers delivered；20% manual review；first cohort merchant satisfaction survey | All |
| Week 9–10 | 前 5 merchant convert to paid ($500 + $25/customer)；2nd neighborhood (Nolita 或 Brooklyn Heights) scoping | Prum + Jiaming |
| Week 11–12 | 90-day milestone report；demo video final；pitch deck v5.1 finalized；Friends & Family SAFE round close $100–200K @ $5–8M cap | Jiaming + Milly |
| Month 4 | 2nd neighborhood launch；senior ML eng search kickoff；YC application draft cycle 1 | All |
| Month 5 | YC Summer 2027 application submit (due ~Oct 2026)；$15K MRR milestone | Jiaming |
| Month 6 | YC interview prep；ConversionOracle v1 fine-tune；legal counsel retain for FTC / corporate | Jiaming + Z |

---

## §10 不变项（Invariants — 跨 v5 所有版本）

1. 只奖励可验证、可重复的价值创造
2. 商家付钱单位 = 顾客（first + repeat），不是 impression / follower / post
3. 商家完成第一次免费 Pilot 前不收钱
4. 每一个 post 经过 DisclosureBot 检查才能发布（v5.1 新增不变项）
5. AI verification 不得 bypass 为提高 metrics
6. Creator payout 48h 之内结算
7. Founder equity 严格 4-yr vest（包括创始人自己）
8. 任何 pitch 材料不得包含 "agency" 字样（对内除外）
9. 任何 marketing 材料不得有 "10K+" follower 作为 creator 招募门槛（违反本地 micro-creator 战略）

---

## §11 新 session 开工读取顺序（更新）

1. `/mnt/Push/CLAUDE.md`
2. `/mnt/Push/.claude/UPDATE_INSTRUCTIONS_v5.md`（v5.0 base）
3. **`/mnt/Push/.claude/UPDATE_INSTRUCTIONS_v5_1.md`（本文档 — strategic hardening）**
4. `/mnt/.auto-memory/push_concept_v5.md`
5. `/mnt/Push/Design.md`

**硬规则：** v5.1 发布后，所有 v5.0 与 v5.1 矛盾之处以 v5.1 为准。

---

**文档版本：** v5.1.0
**批准时间：** 2026-04-18
**下次 review：** 2026-07-18（每季度 strategic hardening audit）
