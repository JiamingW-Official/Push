# Push v6.1.1 — 核心记忆（Canonical Memory）

> ✅ **状态**：**CANONICAL v6.1.1**（2026-04-24 editing freeze）。v5.4 Williamsburg Tier 0 已作为 Phase 0 proving ground 正式并入；v6.0 Manhattan 三角 + v6.1 团队 × Pan-Asian × Agent × Cross-border 已合并为单一 v6.1 框架。**v6.1.1 是结构与引用一致性维护版**（无策略变更）：红线编号归位、Design.md 化为 single source、新 tier 下渗到目标表、版本历史补齐、应急 playbook 扩充、founder 契约补 Agent ethics 条款。
>
> 对外权威：[CANONICAL.md](./CANONICAL.md) + [PITCH.md](./PITCH.md) + [AUDIT-2026-04-23.md](./AUDIT-2026-04-23.md)。**设计系统权威**：[Design.md](./Design.md)（本文件不再重复色值 / 字体 / 栅格 / 动效数值，任何冲突以 Design.md 为准）。定价权威：[PRICING-v1.1.md](./PRICING-v1.1.md)。LLM 路由入口：`.claude/skills/push-hub`。
>
> 这份文件的特殊性：**不可轻易修改**。所有条款是经过 v1→v6.1 七次迭代血泪验证的决策。
> 修改流程：任何**策略**条款变更（R 红线 / D decision / C founder 契约实质）需要 (a) founder 明示决定、(b) 董事会决议或 advisor 书面同意、(c) 主版本号升级到 v7。**patch 级修订**（v6.1.x）限结构 / 引用 / 编号 / 措辞，不触碰策略实质，founder 单人签署即可。
> **版本 freeze**：Phase 0 数据落地（2026-08）前不出 v7。

---

## 1. 身份陈述（Identity Statement）

**Push 是 Manhattan 品味社区的商业基础设施。**

我们**不是**：
- Yelp 的更好版本（我们反对 review-based ranking）
- Groupon 的高端版本（我们反对 discount-driven 心智）
- Toast / Square 的竞争者（他们是支付基础设施，我们是发现 + 归因层）
- Chime / Cash App 的竞争者（他们是 consumer wallet / 资金层，我们永不持资金——见 R11）
- Instagram 的挑战者（他们是 general 内容平台，我们是 hyperlocal 品味层）
- 一家 AI 公司（AI 是我们的 compound，不是我们的产品起点）

我们**是**：
- 一个**地理密度 × 归因证据 × tastemaker 网络**三件套的匹配层
- 一个**以中高端 + 文化辨识度商家**为核心 ICP 的 B2B SaaS
- 一个**以 Brand Partner Pool 为主要盈利引擎**的三边市场
- 一个**以数据 compound 为长期 moat** 的未来数据 / AI 公司
- 从 Year 1 起专注 SoHo / Tribeca / Chinatown 三角区域的本地深度公司

---

## 2. 不可跨越的红线（Red Lines）

**以下每一条如被跨越，触发董事会 emergency session。R 条款编号在 v6.1.1 中全部物理归位到本节。**

**R1 — 地理红线**：Year 1-2 不扩出 SoHo / Tribeca / Chinatown 三角区域。第二 neighborhood 波批（Lower East Side / West Village / NoHo 候选）不早于 Year 2 Q2。

**R2 — 垂直红线**：Year 1 只做 F&B + 独立 retail。Experiences 最早 Year 2，Fitness 最早 Year 2 Q3，Hospitality 最早 Year 3。

**R3 — 定位红线**：不接受 $15 以下人均消费的 mass-market 商家作为 anchor。Push 的 ICP 中位数人均 $35-80。

**R4 — Review 红线**：Push 永远不卖 "paid review boost"。不修改 review 排序。商家付费只能买 placement，不能买评价。

**R5 — Creator 红线**：顶流 creator 不能被绑定 exclusive contract。他们和其他平台 / 品牌的关系自由。Push 不做 Creator agency exclusive lock-in。

**R6 — 数据红线**：用户 individual-level 数据**永远不外售**。只有 k-anonymous aggregate（k ≥ 50）可以进 data services 产品。

**R7 — AI 红线**（v6.1.1 澄清）：Year 1-2 对外 roadmap **没有独立 AI 产品 SKU**。MerchAgent MVP（见 D15）是 $349 Advanced tier 的 workflow automation feature，对外定位为 "merchant automation"，不是 "AI 产品"。数据基建 Day 1 建（10 条数据流，见 D6）。独立 AI 产品 SKU（CreatorAgent / PushConcierge / BrandAgent / Foundation Model）Year 3 Q4 前不 launch。

**R8 — Funding 红线**：Seed 不接受 Tier-3 VC 低估值 term sheet。宁可延迟 6 个月等 Tier-1。

**R9 — Founder Control 红线**：Seed 采用 dual-class structure（10x voting）保证 IPO 前 control。任何 term sheet 放弃 founder control = 拒绝。

> **备选结构**（Delaware 2026 司法环境下如 dual-class 谈判破裂）：(a) supermajority board seat lock 5/7、(b) voting trust、(c) founder-reserved 独立董事 veto。任一备选须等价保证 "IPO 前 control"，否则拒绝。不接受 "信任我的董事会" 口头承诺。

**R10 — 合规红线**：Chinatown minority-owned business 的文化尊重优先于商业。任何 minority 商家的 pitch 必须有文化顾问参与（Year 1 由 founder Jiaming 本人承担，见 D12）。

**R11 — 资金红线**（2026-04-23 从 v5.4 吸收）：Push 永远不 custody 用户 / 商家 / creator 资金。全部走 Stripe Connect 或等价 BaaS（Column, Unit, Mercury）。任何产品设计如使 Push 成为 money transmitter（需 MSB / FinCEN 注册）= 拒绝。这条是 Push 对 Chime / Square / Toast 的核心合规差异化。

**R12 — Attribution 合规红线**（2026-04-23 从 v5.4 吸收，v6.1.1 补时间窗）：所有 attribution model 符合 FTC 16 CFR Part 255。强制 decay curve：
- **D0**：100%（首次物理触达当日）
- **D1-7**：50%
- **D8-30**：30%
- **D31-60**：10%
- **D60+**：0%

每次复购必须新触点验证。last-touch 无限归因 = 拒绝（FTC 会判定为欺骗性广告）。

**R13 — Agent Ethics Review Gate**（2026-04-24 scope 调整）：任何 Agent 产品（MerchAgent MVP 起）在 **launch 前** 必须完成 ethics review，review 范围包括 (a) human-in-the-loop approval points（合同 / 转账 / 公开 content / 商家取消 等"最终决策"项目），(b) transparency requirements（agent 身份声明 + 决策可解释），(c) consent / disclosure flow。

> **Review body**：由 (i) founder Jiaming、(ii) 外部法律顾问（合同法 + 消费者保护法）、(iii) 外部 AI ethics advisor（Partnership on AI / Ada Lovelace / Stanford HAI fellow / YC AI Safety working group 等价机构）三方书面签字。任一方拒签 = 产品不 ship。founder 不得 override 另外两方。

Year 1 MerchAgent MVP 为第一次 review 实例。review 通过前 Agent 产品不 ship。

**R14 — Agent Transparency**：Agent launch 后，永远声明 agent 身份（不伪装 human），决策必须 explainable。Consumer / Creator / Merchant 可以 query "这个 agent 为什么这么推荐"。具体 approval flow 在 R13 ethics review 中 instantiate，不在此 hard-code。

**R15 — Geopolitical Neutrality**：Push 对外永远是 "本地商业 platform，服务所有品牌"，不是 "中国品牌 US expansion 平台"。公开叙事不过度强调中国元素，保持地缘中立。内部 tactically 充分利用 team advantage（见 R16 Two-Deck Discipline）——对内利用 / 对外中立不是矛盾，是纪律。

**R16 — Two-Deck Discipline**：对内可以 ambitious 探索（Agentic OS / Pan-Asian / 国际 expansion）；对外必须 sober 和 falsifiable（具体数字、时间、地点）。禁用词表见 12-phase0-integration.md §3.5 和 AUDIT-2026-04-23.md Part A。

**R17 — Self-Score Abstinence**：对外材料（deck / email / memo）不出现 paper audit 分数（如 "v6.1 audit 9.2"）。VC 读自评反向。paper score 只在内部 scoring-synthesis + memory 出现。

---

## 3. Foundational Decisions（不可轻易重来的决策）

> v6.1.1 将 D1-D21 按主题分组便于检索。**编号不变**，仅物理分区。

### 3.1 战略灵魂（D1-D10 — v6.0 及以前沉淀）

**D1 — 灵魂**：Push 是文化基础设施，不是 SaaS 工具。即使销售话术讲 ROI，品牌 fabric 讲品味。

**D2 — 三社区统一**：SoHo / Tribeca / Chinatown 不是三个 neighborhood，是一个 Manhattan 品味市场的三个侧面。Season-based 活动和 Pass 会员权益在三个社区无缝流动。

**D3 — 中高端定位**：ICP 商家人均 $35-80（餐饮）、$50-300（零售）、$80-200（服务）。不做 $5-15 大众，不做 $300+ 奢侈。

**D4 — Creator 三轨**（v6.1.1 升级，吸收 D21 / PRICING-v1.1 Nano-Tier）：
- **Nano-Tier**（< 10K followers，hyperlocal micro-influencer）：no Floor，per-post 现付 $30-80，3% royalty。纯现金飞轮，不依赖 Brand Pool 融资进度。
- **Community Tier**（Mid tastemaker，10K-100K followers）：Income Floor $500-1,200 / 月 + per-post $75-250 + 3-5% royalty。挂钩 Brand Pool。
- **Studio Tier**（Macro tastemaker，100K+）：纯现金 12% Agency 或 5% Creator-Direct + Push Agency service。

**D5 — Brand Partner 是主引擎**：Year 2+ Brand Partner Pool 占总收入 40-50%。这是 Push 经济飞轮的核心，不是 side revenue。

**D6 — 数据 Day 1**：10 个数据流从 Launch Day 1 开始采集，即使 Year 1-2 完全不用。具体 schema 和采集频率见 `.claude/skills/push-metrics` + `docs/spec/data-schema-v1.md`。

**D7 — "替代不叠加" 销售**：商家 pitch 是"替代你的 Instagram Ads + Yelp Ads + Mailchimp"，不是"再加一个订阅"。

**D8 — Narrative-Execution Split**：对外讲 v6.0 全量故事；对内 Year 1 死守 SoHo F&B + 部分 Tribeca 餐饮。

**D9 — Privacy-First**：SOC2 Type II by Year 2 Q4。所有数据采集 opt-in by default。

**D10 — Lighthouse > Land Grab**：Year 1 不追 merchant 数量，追**三社区内 22 家 anchor 深度 proof**（v6.1.1 Base，见 §4 校准）。

### 3.2 v5.4 Phase 0 融合（D11-D12 — 2026-04-23 Option C）

**D11 — Phase 0 Williamsburg Proving Ground**：Phase 0（5-7 月 Williamsburg Coffee+ pilot，5-8 家）是 Manhattan launch 前的必经 proving ground。不是 backup plan，是 data foundation。详见 12-phase0-integration.md。

**D12 — Founder = Chinatown Cultural Native**（2026-04-23 Audit Q6 新增）：Founder Jiaming 的华人身份是 Chinatown launch 的战略 anchor，不是风险 mitigation 的 tactical tool。Chinatown outreach / community board / 合同审查 Founder 亲自执行，不委托给 bilingual BD。M9 护城河核心。R10 文化顾问由 founder 本人承担的正式依据。

### 3.3 竞争与市场序列（D13, D16, D17）

**D13 — Chime-Aware Positioning**（2026-04-23 新增）：Push 永不和 Chime 比 consumer MAU 或 wallet 战争。核心差异化：Push 是 attribution 层 + 永不持资金（R11）+ 中高端 segment + Physical QR Signage。详见 13-competition-chime.md。

**D16 — Pan-Asian NYC Submarket Sequence**：Chinatown / Flushing / Koreatown / Japan Village / Elmhurst 5 submarket 按 Phase 序列依次进入（Chinatown Q3 2026 / Flushing Q1 2027 / K-town + Japan Village Q3 2027 / Elmhurst 2028+），**不并行**。国际 expansion（HK / 东京 / 新加坡）**对外永远不提**，内部 roadmap 也只在 Series A 后讨论。详见 16-pan-asian-expansion.md。

**D17 — Cross-Border Brand Tier as Optional Upside**：Brand Partner Pool 保留 Asia Market Entry Tier 作为 Year 3+ optional revenue line。Year 1-2 **不 pitch** 给 Seed VC。只在 VC 明确问"upside / 天花板"时作为 P75 optionality 提及。签约 1 家 Pilot 才触发进 base case。详见 17-cross-border-brand.md。

### 3.4 团队文化优势（D14）

**D14 — Team Cultural Advantage as CAC Weapon**：团队 5 人（4 华人 + 1 泰）构成 Chinatown / Flushing / Elmhurst 温热关系网络，把冷启动 CAC 从 ~$700 降到 ~$200-350。这是执行优势，不是 TAM multiplier——对外 pitch 永远这样说。Pan-Asian segment 是 GTM unlock，不是"Asian category"品牌定位。详见 14-team-cultural-advantage.md。

> **Cross-ref**：D14 内部充分利用 × R15 对外地缘中立 = R16 Two-Deck Discipline 的核心实例，不是张力。

### 3.5 Agent Roadmap（D15）

**D15 — Agent Layer as Year 2+ Roadmap**：MerchAgent MVP 在 Phase 1 末（Year 1 Q4）ship，定位是 $349 Advanced tier 的 feature upgrade，不是独立 SKU。CreatorAgent / PushConcierge / BrandAgent 是 Year 2-3 roadmap，内部 R&D，Seed pitch 不讲。对外永不使用 "Agentic Commerce OS" 定位——对外是 "attribution rail for local commerce"。详见 15-agentic-layer.md。launch 前必过 R13 ethics review。

### 3.6 语言与视觉纪律（D18, D19）

**D18 — English-First, Strategic Chinese Parallel**：产品 UI Year 1 英文 only。双语部署仅限：Chinatown / Flushing 商家合同、世界日报 / 星岛日报 PR、Xiaohongshu creator 招募材料、Chinatown ROI card。Japanese / Korean 延到 Year 2。不是 "bilingual by default"——是 "bilingual where it compounds CAC advantage"。

**D19 — Visual System = Design.md Single Source**（2026-04-24 updated）：
- **设计系统数值不在本文件重复**——色板、字体、栅格、直角、Surface 分层、Tier 识别、动效 tokens、组件 spec 全部以 [`Design.md`](./Design.md) 为 single source of truth。任何冲突以 Design.md 为准。
- **策略层约束**（本文件约束，Design.md 不管）：
  - Phase 0 + Phase 1 期间**不做 visual rebrand**。v6.1.1 之前 v6.0 02-soul-and-brand §5 提的衬线 + 无衬线混排方向，已 obsolete；任何 rebrand 工程评估推迟到 **Year 2 Q2**。
  - Year 2 Q2 前所有 UI 按 Design.md 现状执行（Flag Red / Molten Lava / Deep Space Blue / Steel Blue / Champagne Gold / Pearl Stone 品牌 6 色 + Surface 三层 + Graphite；Darky + CS Genio Mono；`border-radius: 0`；8px grid；Light Mode；GSAP + Lenis）。
  - Tier Identity 采用 Path A（2026-04-20 adopted）：6 tier 材料名 × 品牌色映射，见 Design.md §Tier Identity System。
  - 对外 pitch deck 视觉语言 = Design.md 现状。
- **Rebrand 触发条件**（满足之一才启动 Year 2 Q2 评估）：(a) 品牌色在 creator / consumer NPS 两端均出现显著负反馈（NPS drop > 8），或 (b) Brand Partner 合同中出现对视觉系统的 objection ≥ 2 家，或 (c) Series A lead investor 明确要求。

### 3.7 纪律锚（D20, D21）

**D20 — PR Timing Discipline**（2026-04-24 新增）：任何主动 press approach（NYT / Bloomberg / Curbed / Eater / The Cut / Chinese media）必须满足以下 trigger 之一：
- Manhattan anchor ≥ 10 家 signed + 60-day ROI data 可 demo
- Chinatown anchor ≥ 3 家 signed + founder personal story 可 verify
- Brand Partner ≥ 1 Standard signed（非 Pilot）
- Seed 融资 closed（announcement 可 peg press cycle）

不满足 trigger 不主动 approach。Phase 0 为 stealth pilot（12-phase0 §2.2 硬规则），不发 PR。Phase 1 前 6 周不发 PR。

**D21 — Pricing Alignment to PRICING-v1.1**（2026-04-24 新增）：所有 merchant / creator / consumer / brand partner / data services 具体定价数字对齐 [`PRICING-v1.1.md`](./PRICING-v1.1.md)。核心 tier 架构（v1.1 summary）：
- **Merchant**: $0 Attribution Lite / $99 Essentials / **Pro outcome-based Y1**（5% of attributed revenue, cap $179/mo, floor $49/mo）→ $199 flat Y2+ / $349 Advanced / Enterprise Y2+ 评估
- **Creator**: Nano-Tier（no Floor, per-post $30-80, 3% royalty）/ Community Tier（Floor $500-1,200, per-post $75-250, 3-5% royalty）/ Studio Tier（12% Agency or 5% Creator-Direct）
- **Consumer**: Insider Free $0 / Insider+ $28/mo Y2+ / Insider+ Pro $58/mo Y3+
- **Brand Partner**: **Micro-Pilot $25K** / Pilot $50K / Standard $120-180K / Premium $350-450K / Category Lead $1M+（Year 3+ optional, D17）
- **Data Services**: D0 Neighborhood Index（$0 quarterly public）/ D0.5 Benchmarking Reports $499-$1,499 / D1 Basic $5-20K, Pro $50-200K, Enterprise $200K-2M / **D3 Foundation Model Year 4+ optional**

**12 revenue streams** total by Year 5，top stream concentration 38%（降 from v6.0 44%）。**9-scenario stress test** 见 PRICING-v1.1 §7。

如本文件与 PRICING-v1.1 出现数字冲突，**以 PRICING-v1.1 为准**。D21 是 single-source-of-truth 锚点。

---

## 4. Year 1 硬数字目标（North Stars — 2026-04-24 v6.1.1 校准）

截至 2027 Q2 必须达成的硬指标。**原版过于 aggressive，已降档为 "Base / Stretch" 双轨**：Base 是必须达到（否则 Series A 死），Stretch 是 good-to-have。

| 指标 | **Base（硬线）** | Stretch（目标） | 失败阈值 |
|---|---|---|---|
| Anchor + Core Merchants 签约 | **22** | 35-45 | < 18 = 战略 review |
| 90-day merchant retention | **> 80%** | > 88% | < 70% = 定位质疑 |
| Merchant ROAS 改善（vs pre-Push baseline）| **> 25%** | > 40% | < 15% = 产品重设计 |
| Brand Partner 合同 | **2 Pilot ($50K) + 1 Standard ($150K)** = $250K | 3 Pilot + 2 Standard = $450K | 0 Standard = Income Floor 重算 |
| Brand Partner Micro-Pilot（$25K 档）| 可选；≥ 3 家 = Community Tier Floor backfill 加码 | 5-8 | 0 Micro-Pilot 不算失败（是 optional flywheel） |
| Insider Free MAU | **3K** | 8K | < 1.5K = 获客策略重做 |
| Creator 签约 Nano-Tier | **30** | 50 | < 20 = 冷启动漏斗有问题 |
| Creator 签约 Community Tier | **25** | 40 | < 18 = 定位重新审视 |
| Creator 签约 Studio Tier | **3** | 5-7 | < 2 = Studio 产品重做 |
| Attribution events 总量 | **200K** | 500K | < 80K = 产品 funnel 漏斗 |
| Seed 融资 closed | **$5M @ $22-30M cap** | $6-8M @ $25-35M | 无 close = bridge to YC 路径 |
| Team headcount | **8-10** | 12-14 | > 16 = burn 失控 |

**关键校准 rationale**：
- Anchor 30-50 是 founder + 1 BD 用 2-6 周周期在 9 个月内 physically 不可能完成；重新核算 max 22 Base / 45 Stretch。
- Brand Partner "3 × $80K avg" 是 v4.0 数字；v6.0 Pilot $50K + Standard $150K 结构下，Base 改为 "2 Pilot + 1 Standard" = $250K（vs 原 $240K 相当）。v6.1.1 新增 Micro-Pilot $25K 档作为 **optional flywheel**——如 3 家 Micro-Pilot 签约，触发 Community Tier Floor backfill 加码，但不构成 Base 失败条件。
- Creator 三轨分层（v6.1.1，源自 D4 升级）：Nano 30 是冷启动 hyperlocal 基础密度指标；Community 25 是"Floor-commitment" tier 的签约上限（每个 Community creator 月均 Floor $850 × 12 = $10K+ 年承诺，25 人 = $250K+/yr commitment，和 Brand Pool $250K Base 刚好对齐）；Studio 3 是"Macro prestige" 信号。
- Insider Free 5K MAU 没有验证路径（无付费广告预算、cold start）；Base 降到 3K = realistic。
- Seed $5-8M → $5M base 反映 2026 环境 down-round 风险。

---

## 5. Never-Forget Product Principles

**P1**：商家看见 Push 的第一印象是 **ROI dashboard**（可分享的 ROI 卡片），不是功能列表。

**P2**：Insider Free 的第一体验是 **neighborhood curation**（策展），不是 review / rating。

**P3**：Creator 接触 Push 的第一 moment 是 **真金白银**（明示的 Income Floor 保底 or 现金 per-post），不是"加入我们的生态"。

**P4**：Brand Partner 第一次会议拿到的是 **归因 proof + creator network map + 社区 density report**，不是 generic pitch deck。

**P5**：任何产品 feature 如果让 "Groupon 折扣客" 更开心，拒绝。如果让 "有品味的 Manhattan 居民" 更开心，做。

---

## 6. 版本历史决策（不重复犯错）

| 版本 | 最大错误 | 后续吸取 |
|---|---|---|
| v1.2 | 纯 SaaS 定位太窄，天花板 $30-40M ARR | v6 数据 / AI 层打开 $1B+ 天花板 |
| v2.0 | 4 条 revenue line 并行分散焦点 | v6 主线 SaaS + Brand Pool，其他推后 |
| v3.0 | AI / 数据基建完全缺失 | v6 Day 1 布线 |
| v4.0 | 地理选择 Williamsburg 天花板偏低 | v6 pivot 到 Manhattan 品味三角 |
| v5.0 | 数据 / AI compound 理论建成，但 cold-start 地域试探 Williamsburg，Lighthouse 深度不够 | v5.4 / v6 吸取：Williamsburg 降为 Phase 0 proving ground，主市场 Manhattan 三角 |
| v5.4 | Phase 0 决策后，Manhattan 叙事尚未正式融合 canonical | v6 吸取：D11 明文 Phase 0 = data foundation，不是 backup plan |
| v6.0 | Manhattan + 数据 + Creator 三套体系并存；team advantage / Pan-Asian / Agent / Cross-border 四条线未纳入 canonical；视觉方向 §5 与 Design.md 冲突 | v6.1 吸取：四条线通过 D13-D18 并入，R16 Two-Deck Discipline 约束对外话术；v6.1.1 吸取：D19 明文 Design.md single-source，rebrand 冻结到 Year 2 Q2 |
| v6.1 | 红线 R13-R17 编号错位（物理放在 §3）、Design.md 未 single-source、新 tier（Nano / Micro-Pilot）未下渗到 §4 目标表、版本历史表不全、founder 契约缺 Agent ethics 条款 | v6.1.1 吸取：结构 & 引用维护版，无策略变更（patch-level bump） |

---

## 7. Founder 个人契约（自律条款）

Founder（你）对自己和团队承诺：

**C1 — 不分心**：每当 VC / 顾问 / 朋友建议"你应该加 X 垂直"，回答"Year 2+ 考虑，Year 1 只做现在这个"，不争论。

**C2 — 不过度优化 pitch**：Deck 永远保留 TRUTH_LOG（未验证假设）附录。诚实披露不是弱点，是 Tier-1 VC 的筛选器。

**C3 — 不 amend 灵魂**：Push 灵魂（§1）是 north star，不随市场 / VC 偏好变化而漂移。产品可以变，灵魂不动。

**C4 — 不 over-promise creators**（v6.1.1 加例外）：Community / Studio Tier Income Floor 永远挂钩 Brand Pool 实际融资进度。不承诺超过 funding 的保底。**Nano-Tier 无 Floor，纯 per-post 现付，不受 Brand Pool 进度限制**——这是 D4 / D21 的结构性设计，不是破例。

**C5 — 不 over-promise merchants**：ROAS 改善、attribution 覆盖、customer growth 等数字永远基于实测，不基于模型假设。

**C6 — 不放弃 control**：Seed dual-class 结构必须（或 R9 备选结构等价 control）。每一轮 term sheet 审查 voting rights clause。

**C7 — 按月 retro**：每月最后一周 Founder 独立 retro，反思是否偏离核心记忆。偏离 → 当月 fix，不拖。

**C8 — Agent ethics 不委托**（v6.1.1 新增）：任何 Agent 产品 launch 前 founder 本人参与 R13 ethics review，不委托。Founder 对 Agent 伦理的 final accountability 不下放，哪怕 team 扩大到 20 人。R14 Agent Transparency 出现公开质疑时（见 E7），founder 48h 内亲自回应，不通过 PR / comms 代理发声。

---

## 8. 紧急情景 playbook 前置

**E1 — Williamsburg 老朋友说"你该扩到 Brooklyn"**：回答：Year 2 Q3 之后 re-evaluate。现在 Manhattan 三角。Phase 0 Williamsburg 只是 proving ground（D11），不是扩张 anchor。

**E2 — 投资人说"你不做 AI 产品会错过浪潮"**：回答：Push Day 1 采集 10 条数据流（D6），Year 4 专有 LLM。AI 是我们的后台 compound，不是 Year 1 产品（R7）。MerchAgent MVP 在 Year 1 Q4 ship，作为 merchant automation feature，不是独立 AI SKU（D15）。

**E3 — 商家说"能不能让我做折扣"**：回答：Push 平台不做 platform-level discount。你可以自己做 merchant-level campaign，标记为 opt-in promo，但不会出现在 default 发现流里。

**E4 — Creator 说"我要 exclusive deal"**：回答：Push 从不签 exclusive（R5）。你的关系是你的。我们提供的是 infrastructure，不是 agency lock-in。

**E5 — 董事会成员说"我们该 pivot"**：触发 §2 的 R1-R17 红线审查。任何 pivot 必须**显式** supersede 核心记忆，不能静默漂移。

**E6 — Chime / Toast / Square 宣布 local attribution 产品**（v6.1.1 新增）：内部对比 §1 身份陈述 + R11 资金红线做差异化说明——Push 是 attribution 层 + 永不持资金；他们是 payment / wallet 侧。对外不加速 Manhattan 三角之外的 roadmap，保持 Phase 0 / 1 纪律。加强 Physical QR Signage 物理 moat 投入（这是 Chime / Toast 作为 payment 层拿不走的 compound）。触发 competitive brief + Brand Partner outreach 加速（**不是** merchant expansion 加速——不扩 geography，只加深 anchor density）。

**E7 — Agent 决策引发媒体质疑（透明度 / 偏见 / 决策不可解释）**（v6.1.1 新增）：立即启动 R13 Agent Ethics Review 紧急复审；founder + 法律 + ethics advisor 48h 内联合公开回应（C8 founder 亲自发声）；必要时 agent 产品 rollback 到 manual flow。R14 Agent Transparency 是 non-negotiable——不 spin，不 deflect，不归因于"模型错误"脱责。承认问题 + 修复时间表 + 外部审计承诺。

**E8 — VC / advisor 说 "你应该加速 Pan-Asian / Agent OS / 国际 expansion"**（v6.1.1 新增）：回答——Push 核心护城河是 **Chinatown depth × attribution compound**（D12 / D16）。Pan-Asian 5 submarket 按 Phase 序列依次进入，不并行。Agent OS 不对外定位；对外叙事是 "attribution rail for local commerce"（D15）。国际 expansion 对外永远不提（D16）。加速 = 稀释护城河 = 拒绝。如 VC 坚持，见 R8（宁可延迟 6 个月等 Tier-1）。

---

## 9. 如何判断 v6.1 过时（Trigger for v7）

以下任一触发 v7 重构：
- 90 天 Lighthouse 数据显示 ICP 定位需要移动（比如发现 Tribeca 数据远强于 SoHo）
- Brand Partner 签约模式发生根本变化（比如品牌要 exclusive neighborhood）
- 出现重大 new incumbent（比如 Meta 推出 local creator attribution 产品；Chime / Toast 跨界做 attribution 层 — 见 E6）
- Creator Income Floor 数学崩溃（Community / Studio 任一 tier 的 Floor 与 Brand Pool 融资进度脱钩 > 2 个季度）
- 融资环境剧变（比如 2027 美国经济衰退 / Tier-1 VC 普遍撤出 early-stage local commerce）
- R13 Agent Ethics Review 连续 2 次否决 MerchAgent launch（说明 Agent roadmap 本质有问题）
- D19 Rebrand 触发条件 (a)/(b)/(c) 任一满足且评估结果 = 必须大改

不满足以上条件，v6.1（含 v6.1.x patch）至少管到 **Q3 2027**。

---

*最后一句：这份文件是 Push 最重要的文件。不是 pitch deck，不是 financial model，不是 product roadmap。是**当你迷路时回到的地方**。*
