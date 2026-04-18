---
name: push-pricing
description: "Push pricing model, unit economics, payment flows, and financial projections. Use for any pricing, economics, or financial question."
---

# Push Pricing & Economics — v5.0 (Outcome-Based)

## 1. Pricing Philosophy

**Pay for verified outcomes, not access.** Push is an AI-powered customer acquisition agency — the merchant's bill tracks AI-verified customers walking through their door. Zero upfront risk, zero subscription if no results. We absorb acquisition cost until the model has proven itself; from there, every dollar a merchant pays maps directly to a customer we delivered.

Removes the single biggest objection from local F&B operators: "I've paid marketers before and got nothing." Under v5.0, if we bring nothing, the merchant pays nothing.

---

## 2. Merchant Pricing Plans

### Pilot — $0

**For:** first 10 merchants in the active beachhead (Williamsburg coffee, as of April 2026).

| Item | Value |
|------|-------|
| Platform fee | $0 |
| Setup / onboarding | $0 |
| Credit card required | No |
| First 10 AI-verified customers | On the house |
| After customer 10 | Auto-flip to Performance tier |

**Eligibility:**
- Brick-and-mortar with a physical entry point
- Willing to display the Push QR code at the door
- Registered business in the NYC metro
- Able to receive a short agent onboarding call

**Intent:** prove the model, remove every friction point, generate the first trust-anchored case studies. Pilot is our acquisition cost, booked as opex until the merchant converts.

### Performance — $500/month minimum + $40 per AI-verified customer

**For:** merchants past their first 10 verified customers, or any merchant outside the Pilot cohort who signs directly onto Performance.

| Item | Detail |
|------|--------|
| Monthly minimum | $500, assessed in arrears at end of calendar month |
| Per-customer fee | $40, accrued as AI verifies each visit (QR + Claude Vision + geo) |
| Active campaigns | Unlimited |
| Creator tier access | Priority access to tiers 2–6 (Proven+ priority) |
| Dispute SLA | 24 hours |
| Billing | Stripe, monthly, USD |

**How the bill works:** `max($500, $40 × verified_customers_this_month)`. If AI verifies 12 customers in a month → $500 (minimum binds). If AI verifies 20 customers → $800. If AI verifies 50 customers → $2,000.

Minimum guarantees Push a floor of operating revenue per merchant; variable component aligns us with merchant outcomes.

### Enterprise Agency — custom

**For:** merchants with 5+ locations, franchise operators, and multi-brand parents.

| Item | Detail |
|------|--------|
| Per-customer rate | Custom, volume-tiered |
| Verification SLA | Custom |
| Reporting | Custom dashboards + attribution export |
| Agent tuning | Dedicated, with regular performance reviews |
| Integrations | SSO + API + webhook channels |

**Intent:** land multi-location operators where a single merchant deal can equal 5–20 single-store Performance accounts. Priced against alternative acquisition channels (franchise marketing spend, regional agencies) rather than the single-store $500/$40 template.

### Legacy tiers — grandfathered, not for sale

The v4 SaaS tiers are retained only for founding-cohort merchants under original contract:

- Starter $19.99/mo
- Growth $69/mo
- Scale $199/mo

**Rules:**
- Existing founding-cohort merchants remain on their original contract until renewal
- Migration to v5.0 pricing is opt-in and mutually agreed in writing
- No new signups can land on legacy tiers under any circumstances
- Sales must never present these as an option — they exist solely as a contractual footnote

---

## 3. When to Recommend Which Plan

| Merchant Profile | Recommend | Why |
|------------------|-----------|-----|
| New Williamsburg coffee shop, no prior Push history | **Pilot** | Beachhead target, first 10 customers free removes friction, we need the case study |
| Established merchant past first 10 AI-verified customers | **Performance** | Pilot graduation is automatic; the $500 min + $40/customer model kicks in |
| Non-Williamsburg NYC merchant that wants in now | **Performance** (direct signup) | Pilot is beachhead-gated; we don't dilute the case-study cohort |
| Merchant with 5+ locations, franchise operator, multi-brand parent | **Enterprise Agency** | Volume economics justify custom rate; requires SSO/API/dedicated tuning |
| Founding-cohort merchant under legacy contract | **Keep on legacy until renewal**, then offer v5.0 migration | Protect trust; migrate only when mutually agreed |

**Hard rules:**
- Pilot is only for active beachhead (Williamsburg coffee as of April 2026). Do not offer Pilot outside the beachhead.
- Performance is the default for everyone outside Pilot.
- Enterprise is pitched only when the merchant has 5+ locations or multi-brand complexity. Don't over-engineer for a single-store operator.

---

## 4. Creator Compensation (Unchanged in v5.0)

Creator-side economics carry over from v4.1 intact. Outcome-based pricing on the merchant side does not change what creators earn or how milestone bonuses work.

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
| Seed | Free product only | 0% | — | Free items only |
| Explorer | $12/campaign | 0% | — | ~$36/mo (3 campaigns) |
| Operator | $20/campaign | 3% | $15 @ 30 txns | ~$83/mo |
| Proven | $32/campaign | 5% | $30 @ 40 txns | ~$175/mo |
| Closer | $55/campaign | 7% | $50 @ 60 txns | ~$400/mo |
| Partner | $100/campaign | 10% | $80 @ 80 txns | ~$980/mo |

*Base rates shown are Standard (1.0x) difficulty. Premium = 1.3x, Complex = 1.6x.*

### Seed Upgrade Bonus

- $5 cash bonus upon completing 2nd campaign (upgrade acceleration incentive)
- Push-funded in Pilot phase; absorbed into platform ops cost at scale

### Commission + Milestone Bonus Structure

- 30-day attribution window (last-click attribution)
- Commission on every transaction through creator's referral QR/link
- **Milestone bonus:** flat cash bonus when referral transaction count hits monthly threshold

| Tier | Commission % | Milestone Threshold | Milestone Bonus |
|------|-------------|--------------------|-----------------|
| Operator | 3% | 30 txns/month | +$15 |
| Proven | 5% | 40 txns/month | +$30 |
| Closer | 7% | 60 txns/month | +$50 |
| Partner | 10% | 80 txns/month | +$80 |

**Why milestone bonus:** Pure percentage commission on $5-8 F&B transactions yields negligible absolute value (3% × $6 = $0.18). Milestone bonus makes "commission unlock at Operator" a real behavioral inflection point. Under v5.0, milestone bonuses are funded from Performance-plan revenue rather than a separate merchant preload.

### Payment Timing

Within 24 hours via Venmo/Zelle (Pilot phase) or Stripe Connect (Performance+ scale). **Non-negotiable trust-builder.**

---

## 5. Unit Economics (Zero-Risk Rule)

### Per-Customer Math

| Stage | Merchant Pays | Push Direct Cost | Push Net |
|-------|---------------|------------------|----------|
| Pilot customer 1–10 | $0 | ~$20–32 (creator base + AI verification) | **−$20 to −$32** (acquisition cost) |
| Performance customer 11+ | $40 | ~$20–32 (creator base + AI verification) | **+$8 to +$20** per customer |

**Zero-risk rule:** the merchant never pays during Pilot. Push absorbs the first 10 customers as acquisition cost. From customer 11 onward, the merchant pays $40 and Push nets a modest per-unit margin. Scale comes from volume — 100 verified customers/month per merchant is the near-term target, not 10.

### Target Contribution Margin

**40% at scale.** Achieved by:
- Claude Vision + OCR reducing manual verification cost per customer
- Geo-fencing reducing dispute rate
- Creator tier progression reducing cost per successful campaign (higher-tier creators close more efficiently)
- Monthly minimum ($500) absorbing fixed ops cost even on low-volume merchants

### Cost Structure

- **Creator payments:** largest variable cost. Funded from Performance revenue once merchant converts from Pilot.
- **AI verification:** Claude Vision + OCR + geo. Marginal cost per verification is small but non-trivial; amortized across volume.
- **Milestone bonuses:** predictable cost per tier, funded by merchant Performance revenue.
- **Ops:** dispute handling, onboarding calls, merchant support. Drops per-customer as AI automation expands.
- **Pilot acquisition:** 10 × ($20–32) = $200–320 CAC per merchant. Recovered within weeks of Performance conversion at healthy verified-volume.

### Break-Even on a Performance Merchant

Merchant verifies 25 customers/month → pays $1,000 → Push direct cost ~$500–800 → $200–500 contribution/month. Break-even on the Pilot CAC ($200–320) in the first Performance month at this volume.

---

## 6. Payment Flow

### Pilot

- No invoicing. No Stripe charge. No credit card on file.
- Push funds creator payouts directly.
- AI verifies each customer; verified count tracked in merchant dashboard.
- At customer 10, merchant receives migration notice + opt-in confirmation for Performance.
- Customer 11 lands → Performance kicks in.

### Performance

- Stripe monthly billing, USD, arrears.
- End of calendar month: invoice = `max($500, $40 × verified_customers_this_month)`.
- Creator commission + milestone bonus calculated from same verified-customer feed.
- Creator payout: Stripe Connect, 24h after verification, cleared against merchant invoice.
- Disputes raised inside 24h SLA; verified count adjusts before invoice generation.

### Enterprise Agency

- Custom contract, typically monthly or quarterly billing.
- Volume-tiered per-customer rate replaces the $40 flat.
- SLA, reporting, and API access per negotiated terms.
- Creator commission structure unchanged (tier-based 3/5/7/10%).

---

## 7. Pricing Comparison vs Alternatives

| Method | Cost | Measurability | Effort |
|--------|------|--------------|--------|
| DM a creator directly | $50-200/post + product | None | High |
| Local marketing agency | $500-2000/mo retainer | Low–Medium | Low |
| Instagram/FB Ads | $200-1000/mo | Medium (platform metrics, not door traffic) | Medium |
| **Push Pilot** | **$0 for first 10 customers** | **High (AI-verified at door)** | **Very Low** |
| **Push Performance** | **$500 min + $40/verified customer** | **High** | **Very Low** |

**The core sales weapon:** "We show up, verify the outcome at your door with AI, and only charge for what we deliver. Your first 10 customers are free."

---

## 8. Economic Traps to Avoid

1. **Diluting Pilot.** Pilot is for Williamsburg coffee. Offering it outside the beachhead dilutes the case-study cohort and bleeds the acquisition budget.
2. **Subsidizing forever.** Pilot must auto-flip at customer 10. A soft flip creates merchants who expect perpetual free service.
3. **Weakening verification.** The whole model depends on AI-verified outcomes being trustworthy. Loosening verification to pump volume destroys the pricing narrative.
4. **Lowering the $500 minimum.** The floor covers fixed ops cost and filters out merchants who won't commit. Dropping it below $500 breaks unit economics.
5. **Milestone bonus inflation.** Don't lower thresholds aggressively; maintain aspiration value. Creator retention comes from earning the next tier, not collecting easy bonuses.
6. **Legacy-tier leakage.** Never offer v4 SaaS tiers to new signups. Legacy exists only as a grandfather clause.

---

## 9. Pricing Experiments to Run

1. **Pilot volume cap sensitivity:** 10 vs 8 vs 12 free customers — where does conversion to Performance peak vs CAC?
2. **$500 minimum vs $750 minimum:** does a higher floor filter signal without killing conversion?
3. **Per-customer rate test:** $40 vs $50 in cohorts outside Williamsburg. Does elasticity differ by neighborhood?
4. **Creator payout sensitivity:** $25 vs $35 effect on completion rate (carried over from v4 backlog).
5. **Milestone threshold sensitivity:** 30 vs 20 txns — does lower threshold improve retention without inflating cost?
6. **Campaign difficulty premium:** do merchants accept 1.3x/1.6x multiplier when the underlying pricing is outcome-based?
7. **Enterprise Agency per-customer rate:** at what volume does $40 become uneconomic for multi-location operators?

---

## 10. Rules & Guardrails

- **NEVER** charge a Pilot merchant. Pilot is $0 end-to-end.
- **NEVER** sell legacy tiers to new merchants. They're grandfathered only.
- **ALWAYS** auto-flip at customer 11. Don't manually extend Pilot.
- **ALWAYS** pay creators within 24 hours (trust non-negotiable).
- **Creator minimum payout:** $10 (Seed gets product only).
- **No annual contracts in Pilot or early Performance.** Monthly, cancel anytime.
- **Full refund / invoice adjustment** if AI verification is successfully disputed.
- **Milestone bonus** is guaranteed if threshold met — never retroactively adjusted.
- **Campaign difficulty multiplier** is platform-set, transparent to both sides.
- **Enterprise** deals require written contract before any onboarding work.
