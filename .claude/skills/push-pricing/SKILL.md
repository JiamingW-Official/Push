---
name: push-pricing
description: "Push v5.1 pricing, unit economics, payment flows, and financial projections — Vertical AI for Local Commerce with ConversionOracle-powered verification, Williamsburg Coffee+ beachhead, Neighborhood Playbook scaling, and per-vertical outcome pricing. Use for any pricing, economics, or financial question."
---

# Push Pricing & Economics — v5.1 (Per-Vertical Outcome Pricing)

## 1. Pricing Philosophy

**Pay for verified outcomes, not access.** Push is Vertical AI for Local Commerce — the merchant's bill tracks ConversionOracle-verified customers walking through their door, priced by vertical so every line item sits inside the merchant's single-visit gross margin. Zero upfront risk, zero subscription if no results. We absorb acquisition cost until the model has proven itself; from there, every dollar a merchant pays maps directly to a customer we delivered and a margin the merchant actually earned.

v5.1 replaces the v5.0 single-rate customer fee with per-vertical pricing anchored to AOV × merchant GM. That removes the "I've paid marketers before and got nothing" objection *and* the "the math only works for a small subset of F&B" objection — the two blocking objections from the v5.0 sales motion.

---

## 2. Merchant Pricing Plans

### Plan 1 — Pilot ($0)

**For:** merchants in the active Williamsburg Coffee+ beachhead cohort, AOV $8-20.

| Item | Value |
|------|-------|
| Platform fee | $0 |
| Setup / onboarding | $0 |
| Credit card required | No |
| Pre-Pilot deposit | $1 LOI + 60-day commitment |
| First 10 ConversionOracle-verified customers | On the house |
| Cohort cap | 10 merchants in active Pilot at a time |
| Neighborhood cost cap | $4,200 per neighborhood |
| After customer 10 | Auto-flip to Operator |

**Eligibility (v5.1 tightening):**
- Brick-and-mortar Williamsburg Coffee+ shop with a physical entry point
- AOV between $8 and $20
- Willing to display the Push QR code at the door
- Registered business in the NYC metro, Williamsburg-adjacent
- Able to receive a short agent onboarding call
- Signs $1 LOI with 60-day commitment before Pilot starts

**Pilot-to-Paid condition:** if a Pilot merchant fails to reach 5 ConversionOracle-verified customers by Day 30, Push terminates the Pilot and reclaims 50% of the creator payout issued under that Pilot. This protects the $4,200/neighborhood Pilot budget and filters merchants who can't absorb foot traffic even when it's free.

**Intent:** prove the Williamsburg Coffee+ Neighborhood Playbook, remove every friction point, generate the first trust-anchored case studies. Pilot is our acquisition cost, booked as opex until the merchant converts.

### Plan 2 — Operator (monthly base + per-vertical per-customer)

**For:** merchants past their first 10 ConversionOracle-verified customers, or any merchant outside the Pilot cohort who signs directly onto Operator.

| Item | Detail |
|------|--------|
| Monthly minimum | $500, assessed in arrears at end of calendar month |
| Per-customer fee | Per-vertical rate (table below) |
| Active campaigns | Unlimited |
| Creator tier access | Priority access to tiers 2–6 (Proven+ priority) |
| Dispute SLA | 24 hours |
| Billing | Stripe, monthly, USD |
| Renaming note | v5.0 called this tier "Performance" — v5.1 hardens it as "Operator" to signal ongoing ops relationship, not one-shot performance transaction |

**Per-Vertical Customer Rate Table**

| Vertical | Representative AOV | Push Per-Customer Fee |
|----------|-------------------|----------------------|
| Pure coffee | $6 | $15 |
| Coffee+ / brunch | $14 | $25 |
| Specialty dessert | $11 | $22 |
| Boutique fitness trial | $55 | $60 |
| Beauty service | $80 | $85 |

**Per-vertical rationale (the rule we will not break):** Push price ≤ merchant single-visit gross margin × 2. Coffee+ $14 AOV × 65% GM = $9 merchant margin per visit → Push charges $25 against two verified visits per new customer (Push net cost per customer ~$8 at creator $20-32 base), so the merchant earns margin on the second visit while Push still nets positive. Any new vertical must pass this same check before it gets a published rate.

**Retention Add-on Rates**

Retention add-ons invoice only when the verified return visit or loyalty opt-in lands. They stack with per-customer fee inside the same monthly Operator invoice.

| Retention event | Coffee verticals | Fitness / Beauty verticals |
|-----------------|-----------------|---------------------------|
| Visit 2 @ 30 days | $8 | $24 |
| Visit 3 @ 60 days | $6 | $18 |
| Loyalty opt-in | $4 | $12 |

Higher fitness/beauty rates reflect higher vertical margin (boutique fitness trial $55 AOV × ~75% GM; beauty service $80 AOV × ~70% GM). Coffee retention rates stay low because each repeat visit only refreshes $6-14 of top-line.

**How the bill works:** `max($500, Σ(per-customer fee by vertical) + Σ(retention add-on events))`. If ConversionOracle verifies 15 Coffee+ customers + 6 visit-2 returns in a month → `$500 floor vs ($25 × 15 + $8 × 6) = $423` → **$500 minimum binds**. If ConversionOracle verifies 40 Coffee+ customers + 12 visit-2 returns + 5 loyalty opt-ins → `$25 × 40 + $8 × 12 + $4 × 5 = $1,116` → **$1,116 billed**.

Minimum guarantees Push a floor of operating revenue per merchant; variable component aligns us with merchant outcomes.

### Plan 3 — Neighborhood (multi-location ops package)

**For:** merchant operators with 5+ locations, franchise operators, multi-brand parents, and Push-internal neighborhood launches.

| Item | Detail |
|------|--------|
| Launch package | $8-12K one-time (ops setup + Pilot subsidy + creator recruitment) |
| MRR target | $20-35K per neighborhood by Month 12 |
| Payback | 5.1 months per neighborhood |
| Ops analyst | Dedicated |
| ConversionOracle tuning | Custom per neighborhood (local vertical mix, seasonal calibration) |
| Creator access | Priority Proven+ creators per neighborhood |
| Verification SLA | Custom |
| Reporting | Exportable audit trail, custom dashboards |
| Integrations | SSO + API + webhook channels |

**Intent:** Neighborhood is the scaling primitive of v5.1. Every expansion — new zip code, new vertical cluster, new metro — deploys via a Neighborhood Playbook with a fixed launch cost, a tuned ConversionOracle, and a 5.1-month payback target. The plan exists both as a commercial SKU (sold to multi-location operators) and an internal ops framework (how Push itself expands geographically).

### Legacy SaaS tiers — grandfathered, not for sale

The v4 SaaS tiers are retained only for founding-cohort merchants under original contract:

- Starter (legacy)
- Growth (legacy)
- Scale (legacy)

**Rules:**
- Existing founding-cohort merchants remain on their original contract until renewal
- Migration to v5.1 pricing is opt-in and mutually agreed in writing
- New signups cannot land on legacy tiers under any circumstances
- Sales must never present these as an option — they exist solely as a contractual footnote

---

## 3. When to Recommend Which Plan

**Decision tree:**

```
Merchant profile lands on your desk
│
├── New Williamsburg Coffee+ shop, AOV $8-20, no prior Push history
│       → Pilot ($0, first 10 customers free, $1 LOI + 60-day commitment)
│
├── Merchant past customer 10 ConversionOracle verification
│       → Auto-flip to Operator (per-vertical rate from table)
│
├── Non-Williamsburg NYC single-store merchant wants in now
│       → Operator (direct signup, per-vertical rate, no Pilot)
│
├── Merchant with 5+ locations / franchise / multi-brand parent
│       → Neighborhood ($8-12K launch + custom MRR targets)
│
├── Founding-cohort merchant on legacy contract
│       → Keep on legacy until renewal, then offer v5.1 migration
│
└── Vertical not in the table (e.g. tattoo parlor, record store)
        → Pause. Run Push-price ≤ merchant-GM × 2 check before quoting.
          If it passes, file a new-vertical proposal. If it fails, decline.
```

**Hard rules:**
- Pilot is only for Williamsburg Coffee+ ($8-20 AOV). Do not offer Pilot outside the beachhead or to verticals outside Coffee+.
- Operator is the default for everyone outside Pilot. Per-vertical rate comes from the table, never negotiated ad-hoc on the first deal.
- Neighborhood is pitched only when the merchant has 5+ locations, multi-brand complexity, or Push is internally launching a new zip code. Don't over-engineer for a single-store operator.
- Any new vertical must pass Push price ≤ merchant single-visit GM × 2 before it gets a published rate.

---

## 4. Creator Compensation

Creator-side commission and milestone structure is **unchanged from v4.1 → v5.0 → v5.1 for T1-T3**. Per-vertical merchant pricing on the merchant side does not change what T1-T3 creators earn or how milestone bonuses work. **T4-T6 gets a Two-Segment economics model in v5.1** (detail below).

### Campaign Difficulty Multiplier

Base pay is determined by tier base rate × campaign difficulty:

| Difficulty | Multiplier | Examples |
|-----------|-----------|---------|
| Standard | 1.0x | Single-post story, simple check-in |
| Premium | 1.3x | Reel/TikTok, multi-location, weekend |
| Complex | 1.6x | Video series, event coverage, multi-day |

Difficulty is set by the platform based on campaign requirements. Merchant cannot override downward.

### By Tier

| Tier | Base Rate (Standard) | Commission | Referral Milestone Bonus | Total Earning Potential/mo |
|------|---------------------|------------|--------------------------|---------------------------|
| Seed (T1) | Free product only | 0% | — | Free items only |
| Explorer (T2) | $12/campaign | 0% | — | ~$36/mo (3 campaigns) |
| Operator (T3) | $20/campaign | 3% | $15 @ 30 txns | ~$83/mo |
| Proven (T4) | $32/campaign | 5% | $30 @ 40 txns | ~$175/mo + Two-Segment |
| Closer (T5) | $55/campaign | 7% | $50 @ 60 txns | ~$400/mo + Two-Segment |
| Partner (T6) | $100/campaign | 10% | $80 @ 80 txns | ~$980/mo + Two-Segment |

*Base rates shown are Standard (1.0x) difficulty. Premium = 1.3x, Complex = 1.6x. Note: creator tier "Operator" is unrelated to merchant plan "Operator" — same word, different domain.*

### Seed Upgrade Bonus

- $5 cash bonus upon completing 2nd campaign (upgrade acceleration incentive)
- Push-funded in Pilot phase; absorbed into platform ops cost at scale

### Commission + Milestone Bonus Structure (T1-T3, unchanged)

- 30-day attribution window (last-click attribution)
- Commission on every transaction through creator's referral QR/link
- **Milestone bonus:** flat cash bonus when referral transaction count hits monthly threshold

| Tier | Commission % | Milestone Threshold | Milestone Bonus |
|------|-------------|--------------------|-----------------|
| Operator (T3) | 3% | 30 txns/month | +$15 |
| Proven (T4) | 5% | 40 txns/month | +$30 |
| Closer (T5) | 7% | 60 txns/month | +$50 |
| Partner (T6) | 10% | 80 txns/month | +$80 |

**Why milestone bonus:** Pure percentage commission on $5-8 F&B transactions yields negligible absolute value (3% × $6 = $0.18). Milestone bonus makes "commission unlock at Operator (T3)" a real behavioral inflection point. Under v5.1, milestone bonuses are funded from Operator-plan revenue rather than a separate merchant preload.

### Two-Segment Creator Economics (T4-T6 only, v5.1 new)

T4-T6 creators graduate from pure per-campaign economics into a **Two-Segment model**: ongoing retainer + per-verified-customer performance bonus + referral revenue-share + equity pool participation. Segmentation aligns top-tier creators with Push's long-term commercial outcomes the same way the merchant's per-vertical rate aligns Push with theirs.

| Segment | Proven (T4) | Closer (T5) | Partner (T6) |
|---------|-------------|-------------|--------------|
| **Segment A — Retainer** | $200/mo | $500/mo | $1,200/mo |
| **Segment B — Perf bonus** | $3/verified customer | $5/verified customer | $8/verified customer |
| **Referral rev-share** | 15% of Push net on merchants referred | 17.5% | 20% |
| **Equity pool** | 0.02% annual grant | 0.08% annual grant | 0.2% annual grant |

**How it stacks:**
- Retainer (Segment A) replaces the need for per-campaign base rate once the creator is on Two-Segment
- Segment B perf bonus is on top of merchant per-vertical rate (Push absorbs it from merchant revenue, not merchant-facing)
- Referral rev-share applies to merchants the creator sources — indefinite duration for as long as the creator remains active on Push
- Equity pool vests on standard 4y / 1y cliff schedule; resets annually based on tier standing

**Gate to Two-Segment:** a Proven/Closer/Partner creator who sustained tier for 60 days + has ≥1 merchant in Operator tier they referred, OR has completed 15+ campaigns at Premium or Complex difficulty without a dispute. Push retains discretion on equity pool grants (capacity-bounded).

**Why this exists in v5.1:** Top-tier creators in v4/v5.0 were capped at ~$1K/mo on milestone + commission — not enough to keep them off brand-direct deals. Two-Segment gives them retainer income floor + equity upside + recurring rev-share, same structure venture employees get. Aligns Push-Creator incentive over multi-year horizon, not per-campaign.

### Payment Timing

Within 24 hours via Venmo/Zelle (Pilot phase) or Stripe Connect (Operator+ scale). **Non-negotiable trust-builder.** Two-Segment retainer pays monthly on the 1st; perf bonus pays within 24h of verification same as base rate.

---

## 5. Unit Economics (Zero-Risk Rule)

### Per-Customer Math (v5.1)

| Stage | Merchant Pays | Push Direct Cost | Push Net |
|-------|---------------|------------------|----------|
| Pilot customer 1–10 (Williamsburg Coffee+) | $0 | $20-32 (creator base @ 70% standard Pilot rate + ConversionOracle verification) | **−$20 to −$32** (acquisition cost, capped at $4,200/neighborhood) |
| Operator customer 11+ (Coffee+ $14 AOV) | $25 | ~$18 (creator base $12-18 + ConversionOracle verification) | **+$6.97 contribution (27.9%)** |
| Operator customer 11+ (Pure coffee $6 AOV) | $15 | ~$12 (creator base $8-12 + ConversionOracle verification) | **+$3 contribution (20%)** |
| Operator customer 11+ (Boutique fitness trial $55 AOV) | $60 | ~$32 (creator base + ConversionOracle verification) | **+$28 contribution (46.7%)** |
| Operator customer 11+ (Beauty service $80 AOV) | $85 | ~$38 (creator base + ConversionOracle verification) | **+$47 contribution (55.3%)** |

**Zero-risk rule:** the merchant never pays during Pilot. Push absorbs the first 10 customers as acquisition cost. Creator base rate on a Pilot customer is $20-32 (material cost, 70% of standard rate during Pilot to stretch the $4,200/neighborhood budget). From customer 11 onward, the merchant pays the per-vertical rate and Push nets a modest per-unit margin — higher for fitness/beauty, tighter for pure coffee.

### Target Contribution Margin

**40% at scale** (blended across vertical mix). Achieved by:
- ConversionOracle (Claude Vision + OCR + geo) reducing manual verification cost per customer toward zero
- Vertical mix shifting toward Coffee+ / fitness / beauty (higher per-vertical contribution) as beachhead expands beyond pure coffee
- Creator tier progression reducing cost per successful campaign (higher-tier creators close more efficiently)
- Monthly $500 minimum absorbing fixed ops cost even on low-volume merchants
- Retention add-ons monetizing second-visit conversions without proportional incremental cost (no new creator campaign needed for visit 2)

### Neighborhood-Level Economics

Per the Williamsburg Coffee+ Neighborhood Playbook benchmark:

| Metric | Value |
|--------|-------|
| Launch cost (one-time) | $8-12K |
| Pilot subsidy absorbed | $4,200 (10 merchants × $420 avg Pilot cost) |
| Month-12 MRR target | $20-35K |
| Month-12 GM (40% blended) | $8-14K/mo |
| Representative GM | $7,882/mo at midpoint |
| Payback | 5.1 months |

**Interpretation:** a Neighborhood pays back its launch investment inside Q2 post-launch, then compounds into ~$95K annual GM at the $7,882/mo run-rate. This is the Unit-of-Scale Push finances against — not individual merchants, not individual verticals, but the Neighborhood as a product.

### Cost Structure

- **Creator payments:** largest variable cost. Funded from Operator revenue once merchant converts from Pilot. T4-T6 Two-Segment retainers are fixed monthly cost against forecasted Operator volume.
- **ConversionOracle verification:** Claude Vision + OCR + geo. Marginal cost per verification is small but non-trivial; amortized across volume, tuned per neighborhood.
- **Milestone bonuses + T4-T6 equity grants:** predictable cost per tier, funded by merchant Operator revenue.
- **Ops:** dispute handling, onboarding calls, merchant support, dedicated ops analyst for Neighborhood tier. Drops per-customer as AI automation expands.
- **Pilot acquisition:** $4,200/neighborhood cap, 10 merchants × 10 customers × $20-32 creator cost. Recovered within weeks of Operator conversion at healthy verified-volume.

### Break-Even on a Operator Merchant (Coffee+)

Merchant verifies 25 Coffee+ customers/month → pays $625 per-customer + $500 floor binds → total invoice $625 (floor doesn't bind since $625 > $500) → Push direct cost ~$450 → $175 contribution/month. Break-even on the Pilot CAC ($200-320) in the first Operator month at this volume. Add 8 retention events × $8 = $64 → $239 contribution. Break-even faster.

---

## 6. Payment Flow

### Pilot

- No invoicing. No Stripe charge. No credit card on file.
- $1 LOI collected at enrollment + 60-day commitment on file.
- Push funds creator payouts directly (70% standard rate during Pilot).
- ConversionOracle verifies each customer; verified count tracked in merchant dashboard.
- Day 30 checkpoint: if merchant has <5 verified customers, Pilot terminates, Push reclaims 50% of creator payout issued under that Pilot.
- At customer 10, merchant receives migration notice + opt-in confirmation for Operator.
- Customer 11 lands → Operator kicks in (per-vertical rate from table).

### Operator

- Stripe monthly billing, USD, arrears.
- End of calendar month: invoice = `max($500, Σ(per-vertical fee × verified customers) + Σ(retention add-on events))`.
- Per-vertical rate table applied per campaign by merchant's declared vertical; vertical re-classifications require 30-day notice and signed addendum.
- Creator commission + milestone bonus calculated from same ConversionOracle-verified feed.
- Creator payout: Stripe Connect, 24h after verification, cleared against merchant invoice.
- T4-T6 Two-Segment retainer: monthly 1st of month; perf bonus: 24h after verification; rev-share: monthly in arrears; equity pool: annual grant event.
- Disputes raised inside 24h SLA; verified count adjusts before invoice generation.

### Neighborhood

- $8-12K launch package billed at contract signing, covers ops setup + Pilot subsidy + creator recruitment for that neighborhood.
- Ongoing monthly billing per constituent merchant follows Operator mechanics.
- MRR target $20-35K rolled into neighborhood-level P&L, reviewed monthly with the customer operator.
- Custom ConversionOracle tuning fees billed as quarterly true-up against baseline verification cost.
- SLA, reporting, API access per negotiated terms.
- Creator commission structure unchanged (tier-based 3/5/7/10%); T4-T6 Two-Segment applies to any Proven+ creators deployed on the neighborhood.

---

## 7. Pricing Comparison vs Alternatives

| Method | Cost | Measurability | Effort |
|--------|------|--------------|--------|
| DM a creator directly | $50-200/post + product | None | High |
| Local marketing retainer vendor | $500-2000/mo retainer | Low–Medium | Low |
| Instagram/FB Ads | $200-1000/mo | Medium (platform metrics, not door traffic) | Medium |
| **Push Pilot (Coffee+)** | **$0 for first 10 customers** | **High (ConversionOracle at door)** | **Very Low** |
| **Push Operator (Coffee+)** | **$500 min + $25/verified customer** | **High** | **Very Low** |
| **Push Operator (Beauty)** | **$500 min + $85/verified customer** | **High** | **Very Low** |
| **Push Neighborhood** | **$8-12K launch + constituent MRR** | **High + audit trail** | **Very Low** |

**The core sales weapon:** "We show up, ConversionOracle verifies the outcome at your door, and we charge what your own single-visit margin supports. Your first 10 customers are free."

---

## 8. Economic Traps to Avoid

1. **Diluting Pilot.** Pilot is for Williamsburg Coffee+. Offering it outside the beachhead dilutes the case-study cohort and bleeds the $4,200/neighborhood budget.
2. **Subsidizing forever.** Pilot must auto-flip at customer 10 and terminate at Day 30 < 5 verified. A soft flip creates merchants who expect perpetual free service; missing termination drains the Pilot budget on dead accounts.
3. **Weakening ConversionOracle.** The whole model depends on AI-verified outcomes being trustworthy. Loosening verification to pump volume destroys the pricing narrative.
4. **Lowering the $500 minimum.** The floor covers fixed ops cost and filters out merchants who won't commit. Dropping it below $500 breaks unit economics.
5. **Milestone bonus inflation.** Don't lower thresholds aggressively; maintain aspiration value. Creator retention comes from earning the next tier, not collecting easy bonuses.
6. **Legacy-tier leakage.** Never offer v4 SaaS tiers to new signups. Legacy exists only as a grandfather clause.
7. **Publishing a per-vertical rate that fails the GM × 2 rule.** Any new vertical must pass Push price ≤ merchant single-visit GM × 2 before quote. This is non-negotiable — the zero-risk rule depends on merchants earning their margin back inside the first one or two visits.
8. **Quoting off-table rates on first deal.** Per-vertical rate comes from the table. Volume discounts live at Neighborhood plan, not at Operator rate negotiation.
9. **Two-Segment creep.** Two-Segment is T4-T6 only. Don't extend retainer / equity to T1-T3 — it breaks the progression ladder and blows up variable cost.

---

## 9. Pricing Experiments to Run

1. **Pilot volume cap sensitivity:** 10 vs 8 vs 12 free customers — where does conversion to Operator peak vs CAC?
2. **$500 minimum vs $750 minimum:** does a higher floor filter signal without killing conversion?
3. **Per-vertical rate elasticity:** Coffee+ $25 vs $30, Beauty $85 vs $95. Which verticals tolerate a lift?
4. **Retention add-on effect:** does pricing visit-2 at $8 vs $10 change loyalty opt-in rate downstream?
5. **Creator Pilot-rate sensitivity:** 70% (current) vs 60% vs 80% — at what Pilot creator rate does completion rate break?
6. **Milestone threshold sensitivity:** 30 vs 20 txns — does lower threshold improve retention without inflating cost?
7. **Campaign difficulty premium:** do merchants accept 1.3x/1.6x multiplier when the underlying pricing is outcome-based + per-vertical?
8. **Neighborhood launch package:** $8K vs $10K vs $12K against payback curve — where does payback extend past 6 months?
9. **Two-Segment equity grant size:** 0.02%/0.08%/0.2% annual vs 0.04%/0.15%/0.4% — retention effect on T4-T6 creators over 12 months?
10. **Vertical expansion candidates:** bookstore ($22 AOV, ~55% GM), yoga trial ($35 AOV, ~70% GM), specialty cocktail bar ($28 AOV, ~65% GM) — pass the GM × 2 rule before publishing.

---

## 10. Rules & Guardrails

- **NEVER** charge a Pilot merchant. Pilot is $0 end-to-end (except the $1 LOI).
- **NEVER** sell legacy tiers to new merchants. They're grandfathered only.
- **ALWAYS** auto-flip at customer 11. Don't manually extend Pilot.
- **ALWAYS** terminate a Pilot at Day 30 if verified customers < 5 and reclaim 50% of creator payout.
- **ALWAYS** pay creators within 24 hours (trust non-negotiable).
- **Creator minimum payout:** $10 (Seed/T1 gets product only).
- **No annual contracts in Pilot or early Operator.** Monthly, cancel anytime.
- **Full refund / invoice adjustment** if ConversionOracle verification is successfully disputed.
- **Milestone bonus** is guaranteed if threshold met — never retroactively adjusted.
- **Campaign difficulty multiplier** is platform-set, transparent to both sides.
- **Neighborhood** deals require written contract before any onboarding work.
- **Per-vertical rate table** is the single source of truth. New verticals ship through a formal proposal with Push price ≤ merchant GM × 2 proof.
- **Two-Segment Creator economics** are T4-T6 only. Never pitched to T1-T3.
