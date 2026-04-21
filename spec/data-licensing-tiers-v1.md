# Data Licensing Tiers v1 (v5.3)

**Version**: v1 (v5.3 authoritative)
**Owner**: Jiaming
**Status**: Phase 1 opens Month 3 post-pilot; Phase 2 Month 3–6; Phase 3 Month 6+
**Scope**: 3 产品层 + 合规铁律 + 定价锚点推导 + 24 月 revenue projection
**非卖 raw 数据**：2023–2025 监管地雷要求我们永远 aggregate 后授权，不出售 row-level
**Sibling docs**:
- `/spec/data-schema-v1.md` — 底层字段定义（P0-2 产出）
- `/spec/consent-privacy-v1.md` — 用户同意与隐私（P2-1 产出）
- `/spec/nyc-agency-playbook-v1.md` — agency 合同模板（P1-1 产出）

## 0. 为什么需要三层 tier

Push 现在是**数据资产方**。但直接卖 raw 数据给第三方是 2023–2025 监管地雷（CCPA / CPRA / NY SHIELD / EU 类似走向）。三层 licensing 把"卖数据"拆成三个有清晰合规边界的产品：

1. **Agency tier** — 订阅月度 neighborhood intelligence + creator performance report
2. **Enterprise tier** — Brand 按 campaign 购买 aggregated insight
3. **Media tier** — F&B 媒体按文章 / 栏目购买 licensed data

对标（投资人认识的）: Placer.ai (subscription)、Foursquare Data Products、Instacart Data Platform。

## 1. 三层定价

### Tier 1: Agency Subscription（月订阅）

**产品**: NYC F&B Commerce Intelligence Report

- 月更 neighborhood 级 aggregated data
- Creator performance percentile（匿名化）
- Category trend（coffee, pastry, meal 等）
- Merchant saturation map（仅 Push 签约商家）

**价格**:

| Plan | 月费 | 覆盖 | 交付 |
|---|---|---|---|
| Starter | $500 / mo | 1 neighborhood | PDF report only |
| Growth | $2,000 / mo | 3 neighborhoods | PDF + API access + weekly digest |
| Scale | $5,000 / mo | all NYC | + quarterly consultation（90 min） |

**限制**:

- 不含 individual creator ID
- 不含 individual merchant revenue
- Minimum aggregation: 5 creators 或 5 merchants 每 segment

### Tier 2: Enterprise Campaign Licensing

**产品**: Per-campaign verified-conversion report

- Brand 客户按次购买
- 某 campaign 的 creator ROI + demographics + retention
- Aggregated to protect creator & consumer identity

**价格**:

| Plan | 价 | 内容 |
|---|---|---|
| Per-campaign | $1,500 flat | 单次 campaign 完整报告 |
| Bundled（10 campaigns） | $12,000 | 20% 折扣 |
| Custom enterprise annual | $50K+ | 含 Slack 实时数据 feed |

**限制**:

- 仅该 brand 自己 campaign 的数据
- 不能 cross-reference 其他 brand
- 不能用于再营销、名单外的其他 campaign

### Tier 3: Media Data Licensing

**产品**: "Best-performing F&B creator this month in [Neighborhood]"

- 用于编辑内容（Infatuation / Eater / Time Out 等）
- Editorial license，允许署名 "Data via Push"

**价格**:

| Plan | 价 | 用量 |
|---|---|---|
| Per-article | $200 | 单篇 |
| Monthly bundle | $600 | 4 articles |
| Annual exclusive | $10K / year | 一个 content category 独家 |

**限制**:

- 必须署名 "Data via Push"
- 不能转售
- 不能用于广告或直接商业推销
- 必须在发布前 48h 给 Push 看最终稿（事实核对，不审查观点）

## 2. 隐私合规

### 铁律（非谈判项）

- 永远不卖 raw row-level 数据
- 最小 aggregation 单位：**5 creators 或 5 merchants 或 500 transactions**
- 所有 licensed data 经过 **k-anonymity k ≥ 5** 处理
- `demo_ethnicity_bucket` 禁止出现在任何 licensed 产品
- `consent_tier = 1` 行永不参与 licensing（见 data-schema-v1 § Compliance）

### Consumer 权利

- 一键 opt-out（consent 撤销）→ 30 天内该 consumer 所有历史数据从 licensing pool 清除
- 年度透明报告：哪些 aggregation 被哪些客户使用过

### Agency / Brand 合同强制条款

- 不得逆向工程还原 individual identity
- 数据使用范围仅限合同写明的 use case
- 违反 → 立即终止 + **$50K 违约金**
- 审计权：Push 每年一次 random audit 客户端的数据使用日志

## 3. 定价锚点推导

### Why $500 / $2,000 / $5,000 for agency tier

- Placer.ai starter ~$500 / 月，premium $5–10K / 月
- Push 作为新进入者，打 Placer.ai 的 **entry pricing**（同价降风险）
- Growth tier（$2,000 / 月）锚定 agency 年预算 **1–2% 的数据线**

### Why $1,500 per-campaign for enterprise

- Brand 一次 NYC F&B creator campaign 预算通常 $10K–$50K
- $1,500 是其中 **3–15%** —— attribution 产品的合理比例
- 对标：Branch.io per-campaign attribution $500–$2,500

### Why $200 per-article for media

- Infatuation / Eater 编辑稿费 $300–$1,000
- $200 是内容成本 **20–30%** 的数据 licensing 费 —— 编辑部预算能过

## 4. Go-to-market 顺序

| Phase | 时间 | 动作 |
|---|---|---|
| Phase 1 | v5.3 → Month 3 | Agency Subscription Starter tier；给 P1-1 签的 NYC agency **免费试用 3 月** |
| Phase 2 | Month 3–6 | 付费转化 + 开放 Enterprise per-campaign |
| Phase 3 | Month 6+ | 开 Media tier |

先 agency 后 enterprise 后 media 的排序逻辑：agency 有最强 pull（他们缺这份数据最久），enterprise 需要我们自己 pilot 积累足够 case study，media 需要品牌故事打底。

## 5. Revenue projection（保守）

| Month | Agency 订阅 | Enterprise campaigns | Media | MRR from data |
|---|---|---|---|---|
| M3  | 1 Starter                            | 0             | 0          | $500   |
| M6  | 3 Starter + 1 Growth                 | 2 campaigns   | 0          | $5,500 |
| M12 | 5 Growth + 1 Scale                   | 5 campaigns   | 2 articles | $20,400 |
| M24 | 10 Growth + 3 Scale + 2 Enterprise   | 15 campaigns  | 10 articles | $72,500 |

24 月 data licensing MRR **$70K+**，annualized **$870K** —— pre-Series A **第二曲线**成立。

注：上表所有数字是**保守估计**，不是 target。正式 plan-of-record MRR 目标在 push-metrics SKILL 里单独维护。

## 6. 不做的事（硬红线）

- ❌ 不做 one-off raw data dump sales（监管 + 合同风险）
- ❌ 不给任何客户 SQL / Snowflake direct query 权限
- ❌ 不把 consumer PII 放进任何 licensed product
- ❌ 不建 "creator 排行榜" 产品对外（creator 会被 poaching，违背 T4–T6 防挖角策略）
- ❌ 不在 Phase 1 期间给 agency 签独家 licensing 条款（保留 agency 间竞争）
- ❌ 不承诺 "real-time" 数据给任何客户，除 $50K+ Custom enterprise annual 档

## 7. 操作流程（每一层的内部动作）

### Agency Subscription

- **签约**：LOI → Master Data License Agreement → 首月发票
- **交付**：每月 1 号前交当月 report；API access 按 key 发放，速率限制 1 req/sec
- **续约**：60 天前 CS outreach；续约率目标 ≥ 70% MRR

### Enterprise Campaign

- **签约**：每 campaign 独立 SOW 挂在 Master MSA 下
- **交付**：campaign 结束后 14 天内出报告
- **续约**：按 campaign，无自动续约

### Media

- **签约**：简易 editorial license（2 页）
- **交付**：文章 brief 内含所需数据点；48h 前事实核对
- **续约**：按 bundle / annual 自动续约

## 8. 文档 cross-refs

- 底层字段定义见 `/spec/data-schema-v1.md`（P0-2 产出）
- 隐私细节与 consent tier 定义见 `/spec/consent-privacy-v1.md`（P2-1 产出）
- Agency 合同模板、LOI、rev-share 见 `/spec/nyc-agency-playbook-v1.md`（P1-1 产出）附录
- National agency relationship pipeline 见 `/spec/national-agency-pipeline-v1.md`（P1-2 产出）
- Top-tier creator 与 agency 接入路径见 `/spec/top-tier-creator-cultivation-v1.md`（P1-3 产出）

## 9. 未解决 / 待定（Open Questions）

- [ ] k-anonymity k=5 是否对小 neighborhood（<20 creators / merchants）过严？需 pilot 数据再校准
- [ ] Media tier 署名 "Data via Push" 的字号与位置 —— 谈判 Infatuation / Eater 第一单时敲定
- [ ] Custom enterprise annual $50K 起跳 —— 若前 3 位客户砍价到 $35K 是否接受？由 Jiaming 定
- [ ] Phase 1 免费试用 3 月是否过长？可能激励 agency 拖延付费；Month 2 末 review

## Changelog

- **v1 (2026-04-20, v5.3)** — 初版 data licensing 三层 tier；对齐 v5.3 五层收入栈 Layer 3
