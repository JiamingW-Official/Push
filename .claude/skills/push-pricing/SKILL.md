---
name: push-pricing
description: "Push pricing model, unit economics, revenue layers, payment flows, and financial projections. Use for any pricing, economics, or financial question."
---

# Push Pricing & Economics — v5.2 Reference

## 1. Pricing Philosophy (v5.2)
- Outcome-based, not subscription-floor.
- Merchants pay only when a verified customer walks in; floor exists only to cover AI / ops overhead.
- v4.1 subscription tiers are DEPRECATED as of 2026-04-20. Do not quote them.
- Historical v4.1 reference block is at the end of this file for archaeology only.

## 2. Merchant Pricing (v5.2 Authoritative)

### 2.1 Phase Structure

| Phase | Window | Price | Purpose |
|------|--------|------|--------|
| Pilot | First 10 Williamsburg Coffee+ merchants | $0 base + $0 per verified customer | Generate AI training labels; prove lift |
| Beachhead | Williamsburg expansion merchants 11–50 | $500/mo min + $15–85 per verified customer | Prove unit economics at neighborhood density |
| Scale | Williamsburg 50+ / NYC-dense / other metros | Same $500/mo floor + per verified customer by category | Expand with playbook |

### 2.2 Per-Customer Pricing by Category

| Category | AOV range | Per-verified-customer price |
|----------|-----------|----------------------------|
| Pure coffee | $5–8 | $15 |
| Coffee+ (adds bakery/sandwich/matcha) | $8–20 | $25 |
| Specialty dessert / boba | $7–14 | $22 |
| Boutique fitness single class | $25–45 | $60 |
| Beauty / nails single appointment | $40–120 | $85 |

### 2.3 Retention Add-on (v5.1 §2-3)
- Visit 2 attribution: +$8
- Visit 3 attribution: +$6
- Loyalty card onboarding: +$4
- Cap: $18 per customer across 30-day window

## 3. Creator Compensation (v5.2 Two-Segment Economics)

See push-creator/SKILL.md for full tier table. Summary:

| Tier | Model | Per-verified-customer | Monthly retainer | Equity |
|------|-------|----------------------|-----------------|--------|
| T1 Clay (Seed) | Per-customer | $5 + free item + $10 first-customer bonus | — | — |
| T2 Bronze (Explorer) | Per-customer | $15 | — | — |
| T3 Steel (Operator) | Per-customer + comm | $20 + 3% referral | — | — |
| T4 Gold (Proven) | Retainer + Perf | $25 + 10% referral | $800 | — |
| T5 Ruby (Closer) | Retainer + Perf + Equity | $40 + 15% referral | $1,800 | 0.02% RSA |
| T6 Obsidian (Partner) | Retainer + Perf + Equity | $60 + 20% referral | $3,500 | 0.05–0.2% RSA |

## 4. Five Revenue Layers (v5.2 updated)

### Layer 1: Merchant Base Fee (Stability)
$500/mo floor. Covers AI inference, ops overhead, platform maintenance. Non-refundable after Month 1.

### Layer 2: Per-Customer Fee (Primary Revenue)
$15–$85 per verified customer by category. This is the PRIMARY revenue line. Targeted for 70%+ of total revenue by Month 12.

### Layer 3: Retention Add-on (Replacement for v4.1 Take Rate)
- $8 visit 2 / $6 visit 3 / $4 loyalty onboarding. Cap $18/customer.
- NOTE: This REPLACES the v4.1 historical take rate on creator payouts. The old take-rate model is deprecated.

### Layer 4: Creator Premium (Optional)
Creators pay for premium features (advanced analytics, priority matching). Activate only when creator LTV justifies.

### Layer 5: Future Financial Products
Payout acceleration, creator cash advance, merchant credit line. Post-Series-A.

## 5. Unit Economics (v5.2 — T1 reserve allocated)

> T1 reserve mechanics + decision tree: see push-creator §2 T1 Clay.

### Per-Customer
- Revenue: $25 (Coffee+ base, mode)
- Creator payout: $15 (T2 Bronze, mode)
- AI verification cost: $1.50
- Payment processing: $0.75
- Allocated ops: $1.50 (was $1.20 + T1 fail-to-deliver reserve $0.30)
- T1 fail-to-deliver reserve: $0.30 (funds $15 minimum earning guarantee for T1 creators on failed campaigns; allocated across all verified customers)
- **Gross Margin: $6.67 / 26.7%**

### Per-Merchant (Coffee+ Month 12)
- Revenue: $2,620 ($500 base + 85 verified customers × $25)
- COGS: $1,914 (creator + AI + ops + overhead; includes 85 × $0.30 = $25.50 T1 reserve)
- **Monthly GM: $706 / 26.9%**

### 12-Month LTV / CAC
- LTV: $6,354 (monthly GM × avg merchant lifetime 9 mo × retention factor)
- CAC: $420 (sales + onboarding + Pilot subsidy allocated)
- **LTV/CAC: 15.1x base / 10.0x stressed (churn 2x / CAC 1.5x)**

### Sensitivity: T1 reserve allocation
T1 reserve per verified customer = $15 × (T1 fail rate) × (T1 volume share of total verified customers).

| T1 fail rate \ T1 volume share | 10% | 25% | 40% |
|---|---|---|---|
| 10% | $0.15 | $0.38 | $0.60 |
| 20% (base) | $0.30 | $0.75 | $1.20 |
| 30% | $0.45 | $1.13 | $1.80 |

Baseline is 20% fail × 10% share = **$0.30/customer** (thin — assumes most volume from T2+). Worst-credible case 30%×40% = $1.80/customer — would compress Coffee+ GM from 26.7% to 22.0% (–4.7 pts). Mitigation: cap T1 guarantees at 3/year/creator to prevent gaming (see push-creator decision tree).

### GAAP treatment
The T1 reserve is a COGS allocation metric, NOT a pre-funded balance-sheet reserve. Accounting policy:
- Recognition: expense recognized when guarantee is triggered (campaign closes with 0 verified + conditions met)
- Measurement: $15 per triggering event (flat rate; not discounted)
- Balance sheet: accrued liability from trigger event → creator payout (within 15 days per Creator Terms)
- No pre-funding required; reserve figure in §5 is allocational only, used to avoid understating per-campaign cost

Classification: **Cost of Revenue — Creator Payouts** (not Marketing; not R&D).

## 6. Pricing vs Alternatives

| Method | Cost | Measurability | Effort | Outcome risk |
|--------|------|--------------|--------|--------------|
| Meta/Instagram Ads | $200–$1,000/mo | CPA known, walk-in UNKNOWN | Medium | Merchant bears 100% |
| Yelp Ads | $200–$800/mo | Clicks only | Low | Merchant bears 100% |
| DM individual creator | $50–$200/post + product | None | High | Merchant bears 100% |
| Local agency | $500–$2,000/mo + retainer | Low | Low | Merchant bears 90%+ |
| OpenTable (restaurants) | $0.50–$2 per seated cover | Walk-in verified | Very Low | OpenTable bears risk |
| **Push Beachhead** | **$500/mo + $25/verified customer** | **Walk-in + content + loyalty verified** | **Very Low** | **Push bears platform risk** |

### Why Push can charge 12x–50x OpenTable per-customer
1. OpenTable matches EXISTING demand ("I want to eat Italian tonight"). Push CREATES new demand via content.
2. OpenTable verifies at reservation; Push verifies at walk-in + loyalty bootstrap (3x value).
3. OpenTable has no content asset delivered to merchant; Push delivers shot footage/posts.

## 7. Payment Flow

### Pilot (Weeks 1–4)
- No money moves. Push records verified events, creator is paid from Push F&F budget.

### Beachhead (Month 2+)
- Merchant: Stripe subscription $500/mo on 1st of month
- Merchant: Stripe per-verified-event bill on verify (real-time, $15–85)
- Creator: Stripe Connect payout within 24h of verification (T1–T3) / monthly (T4–T6 retainer + perf)

### Scale (Month 6+)
- Auto: merchant preload balance + usage draw-down
- Auto: creator payout (T1–T3) on event; retainer (T4–T6) on 1st; perf on 15th
- Auto: platform fee deducted per v5.1 §2-4

## 8. Economic Traps (v5.2 Updated)

1. **Subscription-floor trap:** Charging subscription without outcome guarantee → churn Month 3. Push's $500/mo IS a floor but ties to outcome delivery warranty (Month 1 prorated if <5 verified customers).
2. **Discovery commission trap:** Pricing at OpenTable-like $2/cover yields insufficient margin to fund ConversionOracle. Never compress below $15 per verified customer for coffee+.
3. **Creator payout inflation:** Don't race competitors on creator base pay; win on tier progression + equity.
4. **Subsidy dependence:** Pilot $0 is time-boxed to first 10 merchants. Do not extend beyond.
5. **Take-rate confusion:** The word "take rate" is retired from v5.2 language; use "Per-customer fee" or "Retention Add-on" only.

## 9. Pricing Experiments (v5.2 Priority Order)

1. [Week 4-6] Pilot-to-Beachhead conversion rate: target 60% of pilot merchants sign for $500/mo
2. [Week 6-8] Per-customer price sensitivity: $25 vs $30 vs $35 coffee+ variant
3. [Week 8-12] Retention Add-on uptake: what % of merchants enable visit 2/3 bonus
4. [Month 4] Category difficulty multiplier: introduce complex-campaign premium $10 add
5. [Month 6] Creator tier retention lever: measure T3 → T4 graduation rate at retainer offer

## 10. Rules & Guardrails

- NEVER quote deprecated v4.1 subscription tiers after 2026-04-20; refer callers to the appendix.
- NEVER use "take rate" language; use "per-customer fee" or "retention add-on."
- ALWAYS include visit 2/3 attribution in 30-day LTV calculations.
- ALWAYS disclose to merchants that Month 1 is prorated if <5 verified customers delivered.
- Pilot subsidy cap: 10 merchants total per neighborhood; never extend to 11th.
- Creator payout SLA: 24h for T1–T3; monthly retainer for T4–T6 on 1st; perf bonus on 15th.
- Per verified customer fee cannot be negotiated below $15 (coffee+ floor); category overrides documented in §2.2 only.
- T1 minimum earning guarantee: $15 paid if a T1 creator completes 1 campaign with 0 verified customers, per the decision tree in push-creator §2 (see "Decision Tree — T1 campaign closes with 0 verified customers"). Funded from a reserve equivalent to ~$0.30 per verified customer (sensitivity: $0.15–$1.80 under scenario analysis). Capped at 3 triggering events per creator per year.

---

## Appendix: v4.1 Historical Reference (DEPRECATED 2026-04-20)

All content in this appendix is deprecated. Kept for archaeology only. Use the v5.2 authoritative body above.

### v4.1 Merchant Tiers — DEPRECATED 2026-04-20 — use v5.2 authoritative body above
| Plan | Price | Campaigns/mo | Creator Tiers Available | Slots/Campaign |
|------|-------|-------------|------------------------|---------------|
| Starter | $19.99/mo | 2 | Seed + Explorer + Operator | 3 |
| Growth | $69/mo | 4 | All tiers (Proven priority) | 5 |
| Pro | $199/mo | Unlimited | All + invite Closer/Partner | 8 |

### v4.1 Creator Per-Campaign Rates — DEPRECATED 2026-04-20 — use v5.2 authoritative body above
| Tier | Base Rate (Standard) | Commission | Referral Milestone Bonus |
|------|---------------------|------------|--------------------------|
| Seed | Free product only | 0% | — |
| Explorer | $12/campaign | 0% | — |
| Operator | $20/campaign | 3% | $15 @ 30 txns |
| Proven | $32/campaign | 5% | $30 @ 40 txns |
| Closer | $55/campaign | 7% | $50 @ 60 txns |
| Partner | $100/campaign | 10% | $80 @ 80 txns |

Difficulty multipliers: Standard 1.0x / Premium 1.3x / Complex 1.6x on base per-campaign rate. All DEPRECATED 2026-04-20 — use v5.2 authoritative body above.

### v4.1 Take Rate Model — DEPRECATED 2026-04-20 — use v5.2 authoritative body above
- Historical take rate on creator payouts processed through Push.
- Activated when attribution was strong enough to justify.
- Replaced by Retention Add-on (Layer 3 of v5.2 body above).

### v4.1 Milestone Bonus Structure — DEPRECATED 2026-04-20 — use v5.2 authoritative body above
Flat cash bonus when monthly referral transaction count hit threshold; funded from merchant preloaded balance. Replaced by Retention Add-on visit 2/3 and loyalty onboarding bonuses (§2.3).

### v4.1 Phased Rollout — DEPRECATED 2026-04-20 — use v5.2 authoritative body above
Phase 1 (Weeks 1–8) free; Phase 2 (Weeks 9–12) introductory paid; Phase 3+ full subscription + campaign fees + performance take rate. Superseded by Pilot → Beachhead → Scale structure in §2.1.

### v4.1 Creator Commission Structure — DEPRECATED 2026-04-20 — use v5.2 authoritative body above
- 30-day last-click attribution window.
- Commission paid per transaction through creator's referral link (3%/5%/7%/10% by tier).
- Milestone bonuses at 30/40/60/80 monthly referral transactions (+$15/$30/$50/$80).
- Problem: pure-percent commission on $5–8 F&B transactions yielded negligible absolute value ($0.15–0.50 per event).
- Replaced by direct per-verified-customer payout ($5 → $60 by tier) plus Retention Add-on, which scales linearly with outcome.

### Why v4.1 was deprecated (2026-04-20 decision log)
- Subscription tiers did not tie price to outcome; merchants churned at Month 3 when campaign results lagged invoice cycle.
- Campaign-centric pricing masked the real unit (verified customer walking in); made LTV forecasts unreliable.
- Creator compensation was bimodal — low base + rare milestone — which starved T2/T3 creators of weekly cash flow and stalled tier progression.
- Outcome-based pricing (v5.2) aligns merchant spend with verified walk-in, funds creator payout per event, and lets ConversionOracle price lift directly.
- Full rationale in UPDATE_INSTRUCTIONS_v5_1.md §2 and CLAUDE_CODE_V5_2_MASTER_INSTRUCTIONS.md §1.2.

---

END OF FILE.
