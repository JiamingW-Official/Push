# Push P2-3 — Expansion Math & SLR Reconciliation v1

> **Status:** DRAFT v1 — founder sign-off required to supersede v5.1 expansion pace
> **Owner:** Jiaming (founder)
> **Deliverable date:** 2026-05-04 (Day 14 of P2)
> **Reviewers:** Jiaming (founder), Prum (ops), Milly (creator supply), future ML Advisor
> **Pre-reads:** push-metrics §1 + §6, push-gtm expansion pace, push-pricing §5, docs/v5_2_status/audits/05-investor-dry-run.md (Q2, Q3, Q14)
> **Hard gate:** Any external pitch deck referencing expansion pace, metro count, neighborhood count, or Month-12+ merchant projections MUST use the numbers in this document. The v5.1 "Top-5 metro by Month 18" claim is deprecated as of this draft.

---

## §1. The Contradiction (Honest Statement)

Push v5.1 made two claims that, taken together, are arithmetically inconsistent:

- **Claim A (push-metrics §1.2):** Software Leverage Ratio (SLR) ≥ 25 at Month 12, ≥ 50 at Month 24. This is the anchor metric separating Push from a traditional agency (SLR 3–5) and justifying the Vertical-AI-for-Local-Commerce category claim.
- **Claim B (implicit in v5.1 GTM narrative):** "Top-5 metro by Month 18" at ~120 neighborhoods. Widely shared in informal decks and founder conversations.

### 1.1 Why the math breaks

If each merchant runs 4 campaigns/month at steady state (the implicit assumption carried over from industry "campaign manager" benchmarks and Whalar-class marketplaces), then:

```
120 neighborhoods × 25 merchants/neighborhood × 4 campaigns/mo = 12,000 active campaigns/mo
Ops FTE required @ SLR 25 = 12,000 / 25 = 480 FTE
```

At 480 ops FTE with $120K fully-loaded cost per head, Push is spending **$57.6M/yr on ops** to service a merchant base generating $25–35M ARR at that scale. The org is labor-bound. It IS an agency. This contradicts:

- The "vertical AI vs agency" thesis that underwrites our pricing premium (push-pricing §6).
- The SLR North Star choice itself (push-metrics §1.3).
- The "software leverage" narrative used to differentiate from WPP/Ogilvy (SLR 3–5) and Whalar-class marketplaces (SLR 8–12) in push-metrics §6.4 Competitor Benchmarks.

### 1.2 Root cause

The 4-campaigns/mo/merchant assumption was never validated. It was inherited from industry "campaign manager" benchmarks that presume agency-style campaign orchestration with fungible creative assets. Push's unit is a **verified walk-in customer**, and merchants at Beachhead-stage density do not need — and will not sustain — 4 novel campaigns per month. Most of the value comes from a **small number of standing campaigns** that deliver verified customers week over week, augmented by occasional promotional pushes.

### 1.3 The fix

This document (a) replaces the implicit 4-campaigns/mo assumption with a grounded 1-campaign/mo/merchant steady-state model; (b) presents a corrected month-by-month expansion pace consistent with SLR 25 → 50; (c) derives a revenue forecast that supports a $10M-ARR-by-Month-48 path to Series A; and (d) enumerates the downstream skill files and artifacts that need updating.

---

## §2. Revised Campaign-Frequency Model

### 2.1 Grounded model

Campaigns/month/merchant by merchant cohort stage:

| Cohort stage | Merchants | Campaigns/mo/merchant | Rationale |
|---|---|---|---|
| Pilot (first 10 Williamsburg Coffee+) | 10 | 1.0 (weekly cadence collapsing to 1/mo) | High ops data-gen cadence; may drop to 0.5/mo at Beachhead transition |
| Beachhead (merchants 11–50) | 40 | 0.75–1.25 | First-3-months spike to 1.5; settles to 1.0 by month 6 |
| Scale (merchants 50+) | variable | 0.5–1.0 | Fewer novel campaigns; majority become standing repeatable ones |

**Central assumption for all math below: 1 active campaign/mo/merchant at steady state; 1.5 in first 3 months of merchant lifecycle.**

This replaces the old implicit 4 campaigns/mo/merchant figure. The new number is conservative (skews toward 1.0) because v5.2 pricing is outcome-priced — merchants pay only for verified walk-ins — which reduces the incentive to churn campaigns. A single well-performing campaign with a rotating creator roster can deliver steady walk-in volume for 4–8 weeks before refresh is required.

### 2.2 Sensitivity table

What happens at 120 neighborhoods × 25 merchants = 3,000 merchants (the old "Top-5 metro by M18" scale) under different campaigns/mo assumptions:

| Avg campaigns/mo/merchant | 0.5 | **1.0 (base)** | 1.5 | 2.0 | 4.0 (old v5.1 implicit) |
|---|---|---|---|---|---|
| Active campaigns @ 3,000 merchants | 1,500 | **3,000** | 4,500 | 6,000 | 12,000 |
| Ops FTE @ SLR 25 | 60 | **120** | 180 | 240 | 480 |
| Ops FTE @ SLR 50 | 30 | **60** | 90 | 120 | 240 |
| Fully-loaded ops cost @ SLR 25 | $7.2M/yr | **$14.4M/yr** | $21.6M/yr | $28.8M/yr | $57.6M/yr |

The base case (1.0 campaign/mo/merchant) at SLR 25 still means 120 ops FTE at the "Top-5 metro" scale — an organization that would need $14.4M/yr in ops payroll alone, plus the existing creator, eng, product, sales, and G&A headcount. This is a scale-up org, not a pre-Series-A startup. The pace needs to be de-risked.

### 2.3 Reality check against v4.1 merchant behavior

The deprecated v4.1 merchant tier structure (push-pricing Appendix) allocated campaigns/month by plan:
- Starter $19.99/mo: 2 campaigns/mo
- Growth $69/mo: 4 campaigns/mo
- Pro $199/mo: unlimited

v5.2 outcome-pricing collapses that incentive structure — there is no plan-based campaign cap. Merchants run as many campaigns as outcome economics justify. Our estimate of 1.0 campaign/mo/merchant at steady state is therefore **below** v4.1's Growth-plan allocation (4/mo) and above the Starter-plan allocation (2/mo). Both v4.1 tiers were premised on subscription incentive, not outcome incentive; neither translates directly to v5.2. The 1.0/mo figure reflects outcome-priced equilibrium where most campaigns become standing arrangements, not one-off promotional pushes.

---

## §3. Corrected Expansion Pace (Month-by-Month)

### 3.1 Primary pace table

All figures use the base-case assumption of 1.0 active campaign/mo/merchant at steady state.

| Month | Scope | Neighborhoods | Merchants | Active campaigns @ 1/mo | SLR required | Ops FTE @ SLR 25 | Ops FTE @ SLR 50 |
|---|---|---|---|---|---|---|---|
| M12 | Williamsburg (5 neighborhoods, dense) | 5 | 25 | 25 | 25 | 1.0 | 0.5 |
| M18 | Williamsburg + 3 NYC neighborhoods | 8 | ~100 | 100 | 25 | 4.0 | 2.0 |
| M24 | NYC-dense (8 neighborhoods) | 8 | ~200 | 200 | 25 | 8.0 | 4.0 |
| M30 | NYC 20 neighborhoods + 1 secondary metro (first neighborhood) | 21 | ~400 | 400 | 25–35 | 16.0 | 8.0 |
| M36 | 2 metros dense, 40 neighborhoods total | 40 | ~600 | 600 | 35 | 24.0 | 12.0 |
| M48 | 2–3 metros, 60–80 neighborhoods | 60–80 | ~1,000 | 1,000 | 50 | 40.0 | 20.0 |

### 3.2 Pace commentary

- **Month 12 (25 merchants in Williamsburg):** 1.0 ops FTE is the operating reality even at SLR 25. Founder + Prum (Ops) + Milly (Creator Ops) = 3 bodies, of whom roughly 1 FTE-equivalent is ops-allocated. SLR 25 is validated at this scale trivially — the math holds.
- **Month 18 (100 merchants, 8 neighborhoods):** 4.0 ops FTE required. Ramp from 1 → 4 ops FTE over 6 months = hire 3 ops roles + grow ConversionOracle v2 auto-verification coverage from ~70% to ~85%.
- **Month 24 (200 merchants, NYC-dense):** 8.0 ops FTE. This is the Series A "show me the metro" scale. 2 ops shift leads + 6 verification/onboarding/disputes ops = a functional NYC-dense ops team.
- **Month 30 (400 merchants, secondary metro first neighborhood):** 16.0 ops FTE at SLR 25, or 8.0 at SLR 50. The target band widens because ConversionOracle v3 is the gating ML delivery — it either lands (SLR approaches 50) or doesn't (SLR stays at 25, ops doubles). Secondary metro = LA or Miami (per push-gtm zone selection criteria).
- **Month 36 (600 merchants, 2 metros dense):** 24.0 ops FTE at SLR 25, 12.0 at SLR 50. At this cell, $10M ARR is reached (§5). Ops org is COO + 2 ops directors + 20 ops ICs.
- **Month 48 (1,000 merchants, 2–3 metros):** SLR 50+ is the north star that gates the $19.8M-ARR-by-Month-48 claim. If SLR 50 holds, org is 20 ops FTE for $20M ARR — a true software-leveraged business. If SLR stuck at 25, org is 40 ops FTE and the company is labor-bound again.

The Month-48 "SLR 50+ after ConversionOracle v3" is explicitly the **gating criterion for the Series A → Series B story**. Without it, the $10M-ARR-scale-to-$20M claim becomes an agency-scale claim, and the valuation multiple compresses from vertical-SaaS-comparable (Shopify 10x, Toast 6–10x revenue) to agency-comparable (WPP 1–2x revenue).

### 3.3 Expansion triggers (from push-gtm, re-anchored)

Each pace-table row represents a "steady state reached at month X" snapshot. Transitions between rows require:

- **Williamsburg → W+3 neighborhoods (M12 → M18):** Williamsburg must show merchant repeat rate ≥ 40%, creator completion ≥ 85%, time-to-fill < 48h, paying merchants ≥ 5 (push-gtm Expansion Triggers).
- **W+3 → NYC-dense (M18 → M24):** 8 neighborhoods operating at Williamsburg-level metrics + SLR ≥ 20 sustained for 2 consecutive months.
- **NYC-dense → NYC 20 + secondary (M24 → M30):** SLR ≥ 25 sustained for 3 months + ConversionOracle v2 precision ≥ 90% sustained for 8 weeks + first $5M ARR milestone.
- **2 metros dense (M30 → M36):** SLR ≥ 30 + second metro neighborhood repeat rate ≥ 40% + multi-state 1099 + sales tax nexus compliance playbook executed (per audit 05 Q13).
- **2–3 metros (M36 → M48):** ConversionOracle v3 shipped + SLR ≥ 50 sustained for 6 months + Series A closed.

---

## §4. Implications for the Pitch Story

### 4.1 What changes in each round

| Round | Window | Pace promise | Revenue promise |
|---|---|---|---|
| Series Seed (2026 Q3 target) | Pre-pilot / Pilot active | M12 Williamsburg 25 contracted merchants (40% Pilot→Paid base = ~16 effective Beachhead-paying); SLR ≥ 25 validated | $16K MRR / $192K ARR by M12 (40% base); $25K / $300K (60% upside) |
| Series A (M18–M24 window) | NYC-dense active | "NYC-dense (8 neighborhoods, 200 merchants) by M24; path to $10M ARR by M48 at 600-1,000 merchants across 2–3 metros" | $2.88M ARR at raise; $10.8M ARR at M36 target |
| Series B (M36–M42 window) | Multi-metro active | "3 metros dense at M42; SLR 50+ validated by ConversionOracle v3" | $10M+ ARR at raise; path to $30M ARR |

### 4.2 Claims to drop

The following v5.1 claims must be removed from all external materials:

- "Top-5 metro by Month 18" — mathematically inconsistent with SLR 25 target at 1.0 campaign/mo/merchant.
- "120 neighborhoods by Month 18" — same underlying issue.
- Any "3,000 active campaigns by M18" or larger figure through M24 — requires ops infrastructure that doesn't exist and cannot be hired in 18 months.
- Any multiple-major-metro claim (NYC + LA + SF + Miami + Austin) inside Month 24 — single-metro focus is the explicit GTM strategy (push-gtm Launch Philosophy).

### 4.3 Claims to preserve / strengthen

- SLR 25 at Month 12 — **validated** by the corrected math; this becomes a stronger story because it's internally consistent.
- SLR 50 at Month 24 — aspirational but gated explicitly on ConversionOracle v3; communicated as target with clear dependency.
- "Vertical AI, not agency" — **strengthened** because the corrected pace no longer forces the business into agency-scale ops.
- "Neighborhood density before metro breadth" — already in push-gtm Launch Philosophy; this math validates it as the only coherent path.

---

## §5. Revised Revenue Forecast

### 5.1 Monthly MRR and ARR trajectory

Per-merchant MRR assumptions: $500 base + $15–$85 per verified customer × customers/mo. Coffee+ mode from push-pricing §5 = $500 + 85 × $25 = $2,625 (rounded to $2,620 in docs). Average MRR across all merchants grows over time as (a) category mix diversifies toward higher-AOV (beauty/fitness at $60–$85 per verified customer), (b) retention add-on adoption climbs (visit 2/3/loyalty, cap $18/customer), (c) average verified customers per merchant rises with creator density.

**Wave 3 reconciliation (audit 03 P0):** prior table assumed 100% Pilot→Beachhead conversion AND a $1,000 immature per-merchant MRR that doesn't reconcile with numeric_reconciliation row 51 ($2,620 mature Coffee+). Below is the corrected table with explicit Pilot→Paid baseline and per-merchant MRR ramp (from immature mix at M12 to mature Coffee+ by M24+).

**Authoritative Pilot→Paid baseline:** 40% (Moderate scenario, per conversion-assumption-v1 §3 stress test + audit 06 alignment). 60% retained as upside; reported separately in Bull-case ARR (§10).

| Month | Effective Merchants (40% Pilot→Paid base) | Avg MRR/merchant (ramp) | MRR (40% base) | ARR | MRR @ 60% upside | Notes |
|---|---|---|---|---|---|---|
| M12 | ~16 (10 Pilot × 40% + 12 Beachhead) | $1,000 | **$16K** | $192K | $25K @ 60% | Mostly immature; low per-customer volume ~20/mo; mixed Pilot+Beachhead cohorts. Per-merchant MRR will ramp to ~$2,620 mature by M24 as Coffee+ matures (numeric_reconciliation row 51). |
| M18 | ~75 (Williamsburg + 3 NYC neighborhoods × 40% conversion) | $1,300 | **$98K** | $1.18M | $130K @ 60% | Beachhead maturity beginning; retention add-on kicks in (push-pricing §2.3); ~30 customers/mo avg. |
| M24 | ~160 | $1,800 | **$288K** | $3.46M | $360K @ 60% | NYC-dense 8 neighborhoods; per-merchant MRR converging on $2,620 mature Coffee+; category mix diversifies. |
| M30 | ~320 | $2,100 | **$672K** | $8.06M | $864K @ 60% | Secondary metro first neighborhood live; ~40 customers/mo avg; beauty/fitness ~15%. |
| M36 | ~480 | $2,200 | **$1.06M** | **$12.7M** | $1.36M @ 60% ($16.3M ARR) | **$10M ARR threshold cleared at 40% base**; 2 metros dense; ~50 customers/mo avg; beauty/fitness ~25%. |
| M48 | ~800 | $2,300 | **$1.84M** | $22.1M | $2.36M @ 60% ($28.3M ARR) | 2–3 metros; ~60 customers/mo avg; beauty/fitness ~35%. |

### 5.2 Per-merchant MRR ramp assumptions

| Component | M12 | M18 | M24 | M30 | M36 | M48 |
|---|---|---|---|---|---|---|
| Base floor | $500 | $500 | $500 | $500 | $500 | $500 |
| Per-verified-customer revenue | $500 | $600 | $700 | $850 | $1,000 | $1,150 |
| Verified customers/mo (implied) | 20 | 24 | 28 | 34 | 40 | 46 |
| Blended per-customer rate | $25 | $25 | $25 | $25 | $25 | $25 |

The table above is conservative: it assumes blended per-customer rate stays at Coffee+ equivalent ($25) across the merchant base. In practice, as category mix diversifies toward beauty/fitness (per §5.1 notes), the blended rate would rise — making the revenue trajectory upside, not downside. A more realistic blended rate might be $32 by M48, yielding ~$22M ARR, but we hold to $25 for conservatism.

### 5.3 Revenue forecast caveats

- These numbers are **planning assumptions**, not projections. The outcome-warranty mechanic (Month 1 prorated if <5 verified customers; push-pricing §8) and 9-month avg merchant lifetime (push-pricing §5) both need Pilot cohort validation before external use.
- (Wave 3 reconciliation) The M12 MRR row in §5.1 above is now base-cased at 40% Pilot→Paid ($16K MRR), with 60% upside ($25K) reported separately. Spec previously assumed 100% conversion implicitly; corrected per audit 03.
- The M36 $10M ARR threshold is the **Series B credibility anchor**. Missing it by more than 15% is a signal to re-forecast; missing by more than 30% is a signal that the category is smaller than modeled.

---

## §6. Creator-Supply Feasibility Check

### 6.1 Creator engagement math

Creator engagements required at each pace-table row, using v5.2 Seed-tier-default of ~5–10 creator slots/campaign:

| Month | Active campaigns/mo | Creator slots/campaign | Creator engagements/mo | Active creators required (1–2 camps/creator/mo) |
|---|---|---|---|---|
| M12 | 25 | 5–10 | 125–250 | 75–150 |
| M18 | 100 | 5–10 | 500–1,000 | 250–500 |
| M24 | 200 | 5–10 | 1,000–2,000 | 500–1,000 |
| M30 | 400 | 5–10 | 2,000–4,000 | 1,000–2,000 |
| M36 | 600 | 5–10 | 3,000–6,000 | 1,500–3,000 |
| M48 | 1,000 | 5–10 | 5,000–10,000 | 2,500–5,000 |

### 6.2 Supply-side feasibility

NYC F&B + lifestyle creator population (numeric_reconciliation row 132 reference): estimated 50,000+ creators with 500+ followers + local-category activity. Supply is not the numeric constraint at any row of the table — including M48. The real constraints:

- **Onboarding funnel throughput:** Current acquisition plan (push-gtm acquisition-tactics.md) targets ~30 curated creators per neighborhood. At 60 neighborhoods (M48), that's 1,800 curated creators — below the 2,500–5,000 active creators implied by the table.
- **Tier distribution:** For the creator-productivity moat (T4–T6 retainer + equity) to bind, we need sustained promotion through T2 → T3 → T4 pipeline. At M48, we need roughly 50–150 T4+ creators (5% of active base). Today we have zero; this is a P1 open item.
- **Secondary-metro activation lag:** NYC has 5 years of organic creator density. LA and Miami each need 6–9 months of build-up before neighborhood-density economics work. This is priced into the M30 → M36 transition gate.

### 6.3 Creator density at M36 (the credibility milestone)

At 600 merchants × 1 campaign/mo × 7 slots/campaign avg = 4,200 creator engagements/mo ≈ 2,100 active creators. Of these:
- T1 Seed: ~800 (38%) — new/unverified
- T2 Explorer: ~700 (33%) — verified, per-customer paid
- T3 Operator: ~400 (19%) — per-customer + 3% referral
- T4 Proven (contracted): ~150 (7%) — $800/mo retainer
- T5 Closer (equity): ~40 (2%) — $1,800/mo retainer + 0.02% RSA
- T6 Partner (senior equity): ~10 (<1%) — $3,500/mo + 0.05–0.2% RSA

The retainer load at M36 is approximately: 150 × $800 + 40 × $1,800 + 10 × $3,500 = $227K/mo = $2.7M/yr. This is ~25% of ARR — consistent with the creator-payout cost structure in push-pricing §5 and below the 30%+ at which the Two-Segment economics would need re-tuning.

---

## §7. Action Items — Downstream Artifact Updates

Each item below is a concrete, section-level change required before this spec can supersede v5.1. Owner and timeline noted.

### 7.1 Skill files (`.claude/skills/`)

| File | Section | Change required | Priority |
|---|---|---|---|
| `push-gtm/SKILL.md` | Launch Philosophy / Expansion Triggers | Remove "Top-5 metro by M18" implicit framing. Insert §3.1 pace table from this doc. Re-anchor expansion triggers with SLR thresholds from §3.3. | P0 |
| `push-metrics/SKILL.md` | §1.1 Definitions | Add: "Active Campaigns assumes 1 campaign/mo/merchant at steady state; see docs/spec/expansion-math-v1.md §2 for sensitivity table." | P0 |
| `push-metrics/SKILL.md` | §1.4 Decomposition | Add sensitivity note: "SLR target of 25 at M12 is consistent with 1.0 campaign/mo/merchant at 25-merchant scale (1 ops FTE). At 2.0 campaigns/mo/merchant the same SLR requires 2 ops FTE — validate campaign-frequency assumption with Pilot data before scaling." | P0 |
| `push-metrics/SKILL.md` | §6.4 Competitor Benchmarks | Add note: "Agency SLR 3–5 benchmark assumes ~4 campaigns/mo/merchant (industry norm). Our old implicit 4-campaigns assumption therefore made us benchmark as an agency. v5.2 corrected assumption of 1.0 campaigns/mo/merchant + SLR 25 = mid-stack AI-augmented ops (the correct category)." | P1 |
| `push-pricing/SKILL.md` | §5 Unit Economics | Cross-reference: "Per-merchant $2,620/mo revenue assumes 85 verified customers/mo at Coffee+ M12 steady state. See expansion-math-v1 §5 for merchant-base revenue trajectory." | P2 |

### 7.2 Numeric reconciliation (`docs/v5_2_status/numeric_reconciliation.md`)

Add rows for:

| Proposed row # | Metric | Value | Source |
|---|---|---|---|
| 113 | Campaigns/mo/merchant (steady state assumption) | 1.0 | expansion-math-v1 §2.1 |
| 114 | Campaigns/mo/merchant (first-3-months spike) | 1.5 | expansion-math-v1 §2.1 |
| 115 | Expansion pace — M12 merchants | 25 | expansion-math-v1 §3.1 |
| 116 | Expansion pace — M18 merchants | ~100 | expansion-math-v1 §3.1 |
| 117 | Expansion pace — M24 merchants | ~200 | expansion-math-v1 §3.1 |
| 118 | Expansion pace — M30 merchants | ~400 | expansion-math-v1 §3.1 |
| 119 | Expansion pace — M36 merchants | ~600 | expansion-math-v1 §3.1 |
| 120 | Expansion pace — M48 merchants | ~1,000 | expansion-math-v1 §3.1 |
| 121 | Revenue forecast — M12 MRR | $25K | expansion-math-v1 §5.1 |
| 122 | Revenue forecast — M24 MRR | $240K | expansion-math-v1 §5.1 |
| 123 | Revenue forecast — M36 ARR ($10M threshold) | $10.8M | expansion-math-v1 §5.1 |
| 124 | Revenue forecast — M48 ARR | $19.8M | expansion-math-v1 §5.1 |

### 7.3 P1 rollup (`docs/v5_2_status/P1_rollup.md`)

- §Open Risks: close "expansion pace inconsistent with SLR math" if tracked as open; if not tracked, add retroactive note crediting P2-3 with the fix.
- §Achievements: add "expansion-math-v1 drafted; v5.1 pace deprecated" as P2-3 milestone.

### 7.4 Investor dry-run updates (`docs/v5_2_status/audits/05-investor-dry-run.md`)

- Q3 (LTV / 9-month lifetime): cross-reference expansion-math-v1 §5 revenue forecast; note that MRR forecast is independent of lifetime assumption (ARR trajectory holds under 6-month lifetime if Pilot-to-Beachhead conversion ≥ 60%).
- Q12 (Team / Scaling): update SLR 25 / 250 active campaigns example — with corrected expansion math, M12 active campaigns is 25, not 250, so ops FTE required is 1 not 10. Re-ground the team-scaling narrative.
- Q15 (Exit / Strategic Acquirer): update revenue-multiple math with corrected M48 ARR ($19.8M, not $25–35M implied by v5.1 pace).

### 7.5 Future Series A pitch deck

**MUST NOT promise:**
- Top-5 metro by M18
- 120 neighborhoods by M18 or M24
- Multi-major-metro presence before M30
- Any revenue number above $3M ARR by M24
- Any ops-FTE count below 4 at M18 (we need the bodies)

**MUST promise:**
- NYC-dense (8 neighborhoods, ~200 merchants) by M24
- $2.88M ARR at Series A raise (M18–M24 window)
- Path to $10M ARR by M36 at 600 merchants across 2 metros
- SLR 25 sustained through M24, target 50 post-ConversionOracle-v3 by M48

### 7.6 Informal communications

- Any Push founder elevator pitch, cold-email template, LinkedIn post, or interview note claiming "Top-5 metro by M18" must be retracted or rephrased. Where past materials exist, annotate with "v5.1 pace — see docs/spec/expansion-math-v1.md for v5.2 corrected pace."

---

## §8. Owner & Trigger

### 8.1 Owner

Jiaming (founder) — sole sign-off authority for accepting or rejecting this spec as the v5.2 authoritative expansion pace. No other reviewer can gate this decision because the trade-off (de-scoped pace vs investor narrative compression) is a founder-level strategic call.

### 8.2 Review panel (advisory)

- Prum (Ops lead) — validates ops FTE ramp feasibility.
- Milly (Creator Ops) — validates creator-supply trajectory in §6.
- Future ML Advisor — validates ConversionOracle v2/v3 delivery assumptions in §3.2.

### 8.3 Trigger

**This document must reach founder sign-off BEFORE any of the following happens:**
- Series Seed pitch contains any M18+ projection (deck slide, appendix, or verbal claim).
- External investor conversation includes Top-5-metro framing.
- Any sales or marketing asset references M18 neighborhood count, M24 merchant count, or M36 revenue.
- Any press, podcast, or public-speaking engagement makes expansion pace claims.

Until founder sign-off: use M12 Williamsburg (25 merchants) as the only firm-date milestone in external conversations. All M18+ claims should be qualified as "planning assumption, pending finalization."

### 8.4 Success criterion

**Any investor, advisor, journalist, or future team member hearing Push's expansion claim can cross-check the math against this document and get a consistent answer.** The current v5.1 state fails this test because two sources (SLR target + metro breadth claim) yield contradictory conclusions. v5.2 (this spec) passes if all external claims flow from §3.1 + §5.1.

### 8.5 Kill criterion

If Pilot Week-12 data (§push-gtm Week 12 Go/No-Go Targets) shows that:
- Merchants run >2 campaigns/mo average at Beachhead, AND
- That rate persists at 50-merchant cohort,

THEN this document's 1.0 campaigns/mo/merchant assumption is wrong. The expansion pace would need re-derivation with the new campaign-frequency base case. This is the single most important empirical input this spec depends on.

---

## Appendix A — SLR Target Derivation Table

Assumptions: 1.0 campaigns/mo/merchant steady state; 160 hours/FTE/month; Ops FTE cost $120K fully-loaded.

| Merchants | Active campaigns/mo | SLR 15 ops FTE | SLR 25 ops FTE | SLR 50 ops FTE | SLR 100 ops FTE |
|---|---|---|---|---|---|
| 25 | 25 | 1.7 | 1.0 | 0.5 | 0.25 |
| 50 | 50 | 3.3 | 2.0 | 1.0 | 0.50 |
| 100 | 100 | 6.7 | 4.0 | 2.0 | 1.0 |
| 200 | 200 | 13.3 | 8.0 | 4.0 | 2.0 |
| 400 | 400 | 26.7 | 16.0 | 8.0 | 4.0 |
| 600 | 600 | 40.0 | 24.0 | 12.0 | 6.0 |
| 1,000 | 1,000 | 66.7 | 40.0 | 20.0 | 10.0 |
| 3,000 | 3,000 | 200.0 | 120.0 | 60.0 | 30.0 |

At 3,000 merchants (the old v5.1 "Top-5 metro by M18" scale) with SLR 25: 120 ops FTE = $14.4M/yr. At SLR 50: 60 ops FTE = $7.2M/yr. At SLR 100 (ConversionOracle v4-class, currently theoretical): 30 ops FTE = $3.6M/yr. For context: OpenTable runs at estimated SLR ~300 (push-metrics §6.4), which is the ceiling for fully-templated verification. Push's positioning is mid-stack between OpenTable (SLR 300, low content) and Whalar (SLR 8–12, zero verification) — the target band is SLR 25–50 at our scale.

---

## Appendix B — Competitor Expansion Pace (Historical Context)

| Platform | Category | Years to first 100 neighborhoods | Years to first 500 neighborhoods | Notes |
|---|---|---|---|---|
| OpenTable | Reservations | ~6 (2005 → 2011 NYC + LA + SF + Chicago + Boston dense) | ~12 | Slow neighborhood-density ramp; reservation unit is low-friction acquisition |
| DoorDash | Food delivery | ~3 (2013–2016) | ~5 | Fast because delivery is a logistics ladder, not a content/creator ladder |
| Placer.ai | Foot-traffic data | N/A (data play, not neighborhood-dense) | N/A | Not a comparable — they don't need neighborhood density |
| Resy (pre-acq) | Reservations | ~5 (2014–2019) | — | Acquired before 500-neighborhood mark |
| Toast | Restaurant POS | ~4 (2014–2018) | ~8 | Merchant-density but not neighborhood-specific |
| **Push plan (this spec)** | Outcome-priced creator attribution | **~5 years (M48 → ~60–80)** | **~8–10 years projected** | Neighborhood-density is the core unit; pace matches OpenTable-era economics |

The take-away: no analogous platform reached 120 neighborhoods in 18 months from pilot. The v5.1 implicit claim was 5–10x faster than any precedent in the adjacent categories. OpenTable, the closest historical analog for verified-walk-in economics, took 6 years to reach a similar scale — and OpenTable had an easier creator-less unit (reservations fill themselves from existing demand).

---

## Appendix C — Risk Register

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | Actual campaigns/mo/merchant is 2.0, not 1.0 | Medium | High — doubles all ops FTE forecasts | Pilot Week 12 readout; if >1.5 observed, re-derive this spec |
| 2 | ConversionOracle v2 precision stays below 85% through M18 | Medium | High — SLR compresses to 18–20, org becomes labor-bound | Weekly ML Advisor review; escalation if <88% at Week 8 |
| 3 | ConversionOracle v3 delayed past M36 | Medium | Very High — $10M ARR-at-SLR-50 claim broken | Scope ConversionOracle v3 as hard Series B dependency; fallback: raise A+ instead of B |
| 4 | Creator supply in Williamsburg peaks below 150 active | Low | Medium — caps M12 merchant count at 20 | Early recruitment push + cross-neighborhood allowance |
| 5 | Pilot-to-Beachhead conversion below 60% | Medium | High — M12 MRR compresses to $15–20K | push-pricing §9 Experiment #1 is gated on this; no scaling without it |
| 6 | Merchant avg lifetime below 9 months (per audit 05 Q3) | High | Very High — LTV/CAC falls from 15x to 7x | Retention add-on uptake as primary mitigation; measure at M6 |
| 7 | Secondary-metro activation takes 12+ months | High | Medium — M30 secondary-metro neighborhood delayed to M36 | Stage LA/Miami creator recruitment 9 months ahead of merchant ramp |
| 8 | Regulatory friction in second metro (1099, sales tax, pay transparency) | Medium | Medium — delays M30 → M36 by 3–6 months | Engage multi-state counsel by M18 (per audit 05 Q13) |
| 9 | ML Advisor Day 14 readout = 0 conversations | Medium | Very High — ConversionOracle v1 delivery slips; SLR targets slip; whole expansion pace slips 6 months | Second-batch outreach plan in ML Advisor tracker; contingency budget for full-time ML lead hire at Seed close |
| 10 | Per-merchant MRR ramp (§5.2) fails to reach $1,500 by M36 | Medium | Medium — $10M ARR threshold slips to M42+ | Category-mix diversification (beauty/fitness) starting M18 to pull blended rate up |

---

## Appendix D — Open Questions

For founder (Jiaming), Ops lead (Prum), Creator Ops (Milly), future ML Advisor, and future data owner.

### For founder (Jiaming)
1. **Pace preference:** Does the founder accept the M24 = 200 merchants / M36 = 600 merchants pace, or prefer a more aggressive case (e.g. M24 = 300, M36 = 800)? What's the trade-off against ops FTE ramp and ConversionOracle dependencies?
2. **Series A timing:** Is the M18–M24 window for Series A raise firm, or should we plan for M24–M30 if ConversionOracle v2 precision lags?
3. **Secondary metro choice:** LA, Miami, Austin, or other? Selection criteria should be re-validated against push-gtm Zone Selection Criteria using M18 Williamsburg data.
4. **Founder-hour cap:** At M24 with 8 ops FTE + ramping to 16 by M30, when does the founder transition out of ops IC work? Need calendar commitment by M18.

### For ops (Prum)
5. **Ops FTE unit cost:** Is $120K fully-loaded the right planning number for NYC ops hires? Should we model $110K (junior) vs $150K (senior) split?
6. **Hiring velocity:** From 1 FTE at M12 to 4 FTE at M18 — is that hire-lag realistic, or do we need to start ops hiring by M9 for M18 readiness?

### For creator ops (Milly)
7. **T4 issuance gate:** When should the first T4 retainer contract be executed? The creator-productivity-lock moat depends on T4+ creators existing; zero T4 contracts today. Proposed: first T4 by M10.
8. **Creator tier distribution at M36:** Does the §6.3 distribution (38% T1 / 33% T2 / 19% T3 / 7% T4 / 2% T5 / <1% T6) match expectations, or are we under-allocating T4–T6?

### For ML Advisor (when engaged)
9. **ConversionOracle v2 precision roadmap:** Is 90% precision by M24 realistic with the current data-generation plan (Pilot generating ~5,000 labeled events in 90 days)?
10. **ConversionOracle v3 scope:** What's the feature set that differentiates v3 from v2? Is "auto-verification coverage 85% → 95%" achievable without a full-time ML lead, or is that a post-Series-A milestone?

### For future data owner
11. **SLR measurement cadence:** Is monthly snapshot sufficient, or should we add weekly SLR tracking for the M18–M24 ramp window?
12. **Campaign-frequency validation:** What's the data instrumentation plan for validating the 1.0 campaigns/mo/merchant assumption by M9 (before M12 expansion)?

---

*END OF DRAFT v1. Prepared 2026-04-20 as P2-3 deliverable. Founder sign-off pending by 2026-05-04. This document supersedes v5.1 expansion pace upon sign-off and becomes the authoritative source for all external claims about Push's metro, neighborhood, merchant, and revenue trajectory. Review cadence post-sign-off: monthly for first 6 months, then quarterly.*

---

## §9. Downstream Update Diffs (actionable)

Each downstream file listed in §7 gets a concrete, paste-ready edit. Diffs are line-numbered where the file is stable; where the target is a section body that may shift, the diff uses section references and verbatim anchor strings.

### 9.1 `.claude/skills/push-gtm/SKILL.md`

**Change 1 — Launch Philosophy (current line 9):**
- BEFORE: `Concentrate on one small zone. One neighborhood, ~10 merchants, ~30 curated creators. Prove the loop before expanding. **Never launch "a city" — launch a ZIP code.**`
- AFTER: append a new sentence at the end of the same paragraph: `Expansion pace anchored to SLR math — see docs/spec/expansion-math-v1.md §3.1 for month-by-month merchant / neighborhood / ops-FTE table. Any "Top-5 metro by M18" framing is deprecated as of 2026-04-20.`

**Change 2 — Expansion Triggers (current lines 56-62):**
- BEFORE (the whole trigger list): a flat 4-bullet list with no SLR anchoring.
- AFTER: add 5th bullet: `- SLR ≥ thresholds per expansion-math-v1 §3.3 (M12→M18 gate: SLR ≥20 trailing 2mo; M18→M24 gate: SLR ≥20 trailing 2mo + 8 neighborhoods at Williamsburg-level metrics; M24→M30 gate: SLR ≥25 sustained 3mo + ConversionOracle v2 precision ≥90% for 8 weeks; M30→M36 gate: SLR ≥30 + multi-state compliance playbook executed; M36→M48 gate: ConversionOracle v3 shipped + SLR ≥50 sustained 6mo + Series A closed).`

**Change 3 — new subsection after Expansion Triggers:**
- Insert after line 62: a new `## Pace & Scale Table` subsection that links to `docs/spec/expansion-math-v1.md §3.1` as the authoritative merchant / neighborhood / ARR trajectory. Copy the 6-row M12–M48 table inline OR link by reference; prefer inline for skill-file self-containment.

### 9.2 `.claude/skills/push-metrics/SKILL.md` §1.1 Definitions

**Change 4 — append to the `Active Campaign` bullet (current line 13):**
- BEFORE: `**Active Campaign** = campaign with status IN ('live', 'scheduled-future', 'verifying') AND NOT ('paused', 'cancelled', 'completed-final', 'draft'). Campaigns in verifying state (customer scanned, awaiting verification) count for 48h then roll off.`
- AFTER: append sentence at end of bullet: `Steady-state assumption: 1.0 campaign/mo/merchant (sensitivity table in docs/spec/expansion-math-v1.md §2.2). First-3-months-of-merchant-lifecycle spike: 1.5.`

### 9.3 `.claude/skills/push-metrics/SKILL.md` §1.4 Decomposition

**Change 5 — add sensitivity note after line 35 (after the Levers list):**
- INSERT new paragraph: `**Campaign-frequency sensitivity:** the SLR target of 25 at M12 is consistent with 1.0 campaign/mo/merchant at 25-merchant scale (1.0 ops FTE). At 2.0 campaigns/mo/merchant the same SLR requires 2.0 ops FTE (Appendix A of docs/spec/expansion-math-v1.md). Validate campaign-frequency assumption with Pilot data before scaling. See §5 kill criterion of that doc.`

### 9.4 `.claude/skills/push-metrics/SKILL.md` §6.4 Competitor Benchmarks

**Change 6 — replace the final italic line (current line 156):**
- BEFORE: `*Any competitor number must be flagged "estimated" in external comms until sourced to disclosed financials.*`
- AFTER: `*Any competitor number must be flagged "estimated" in external comms until sourced to disclosed financials.* **Benchmark calibration note:** agency SLR 3–5 reflects ~4 campaigns/mo/merchant (industry norm); the v4.1 implicit 4-campaigns assumption therefore benchmarked Push as an agency. v5.2 corrected assumption of 1.0 campaign/mo/merchant at SLR 25 positions Push as mid-stack AI-augmented ops (see docs/spec/expansion-math-v1.md §2.1).`

### 9.5 `.claude/skills/push-pricing/SKILL.md` §5 Unit Economics

**Change 7 — after the `12-Month LTV / CAC` subsection header (around line 89), append a cross-reference paragraph:**
- INSERT: `**Merchant-base revenue trajectory:** per-merchant $2,620/mo Coffee+ M12 baseline assumes 85 verified customers/mo at steady state. For merchant-base aggregate revenue trajectory from M12 ($25K MRR) → M36 ($10.8M ARR = $10M threshold) → M48 ($19.8M ARR), see docs/spec/expansion-math-v1.md §5.1. LTV figure here ($6,354) is per-merchant; expansion spec §5 gives the cross-cohort ARR build.`

### 9.6 `docs/v5_2_status/numeric_reconciliation.md`

**Change 8 — append 12 new rows (rows 113–124) per §7.2 of this spec.** No diff block needed; the row-by-row table in §7.2 is already paste-ready. Owner: Jiaming. Deadline: before any Series Seed investor call referencing expansion math.

### 9.7 `docs/v5_2_status/P1_rollup.md` §Open Risks

**Change 9 — add row 9 to the Open Risks table (current lines 228-236):**
- INSERT new row after row 8: `| 9 | Expansion pace miscalibrated (campaigns/mo/merchant assumption wrong) | High (breaks SLR target and ops FTE ramp) | Pilot Week 12 actual >2.0 campaigns/mo/merchant OR <0.7 | Founder |`

**Change 10 — Achievements section:**
- INSERT bullet: `- P2-3 expansion-math-v1 drafted (docs/spec/expansion-math-v1.md); v5.1 "Top-5 metro by M18" pace deprecated; SLR-consistent pace table committed for Seed + Series A narrative.`

### 9.8 `docs/v5_2_status/audits/05-investor-dry-run.md`

**Change 11 — Q2 answer (current lines 53-55):**
- BEFORE (last line of "Our answer"): the three-asymmetry framing ends without a pace reference.
- AFTER: append sentence: `Asymmetry (4) added post-expansion-math-v1: neighborhood-density compounding — Push's pace (docs/spec/expansion-math-v1.md §3.1) is 5 neighborhoods at M12 / 8 at M24 / 40+ at M36, which is the OpenTable-era economics Meta cannot replicate by ad-product fiat; neighborhood density is a supply-and-ops investment, not a feature flag.`

**Change 12 — Q3 answer (current lines 64-67):**
- BEFORE: answer ends with stressed case and Groupon ~2.25x churn math.
- AFTER: append sentence: `MRR trajectory is independent of lifetime assumption — at $25K (M12) → $240K (M24) → $900K (M36) → $1.65M (M48) per docs/spec/expansion-math-v1.md §5.1, the ARR build holds under 6-month lifetime as long as Pilot-to-Beachhead conversion ≥60% (push-pricing §9 Experiment #1); lifetime stresses LTV/CAC, not the top-line ramp.`

**Change 13 — Q12 answer (current lines 163-164):**
- BEFORE: references "SLR 25 at M-12 with, say, 250 active campaigns at M-12 ... 10 Ops FTE." This is the v5.1 arithmetic error.
- AFTER: REPLACE with: `SLR 25 at M12 with 25 active campaigns (25 merchants × 1.0 campaign/mo per docs/spec/expansion-math-v1.md §3.1) implies 1.0 ops FTE, not 10. The 250-campaigns-at-M12 figure was an artifact of the deprecated 4-campaigns/mo assumption. Corrected ramp: 1.0 ops FTE at M12 → 4.0 at M18 → 8.0 at M24 → 16.0 at M30 → 24.0 at M36. Current team (3 headcount, ~1 FTE-equivalent ops-allocated) is consistent with M12. Ops ramp from M12 starts at hire cadence of ~1 ops role per quarter beginning M9 (per §Open Questions #6 of expansion-math-v1).`

**Change 14 — Q14 answer (current lines 184-188):**
- BEFORE: answer acknowledges no Beachhead-only CAC data exists.
- AFTER: append sentence: `At M48 per docs/spec/expansion-math-v1.md §5, aggregate ARR is $19.8M (not the $25–35M that was implicit in v5.1's 3,000-merchant Top-5-metro claim). The revised Series B credibility anchor is $10M ARR at M36 (600 merchants); Series A remains the M18–M24 window at $2.88M ARR.`

**Change 15 — Q15 answer (current lines 196-198):**
- BEFORE: multiple ranges based on v5.1 implicit revenue.
- AFTER: append: `Exit multiples re-anchored to M48 ARR $19.8M (not v5.1 implicit $25–35M). Toast 6–10x comp yields $120–200M exit at M48 ARR — honest revision of prior aspiration. Shopify 10–15x comp requires post-M48 ramp to $30M ARR for the vertical-SaaS-comparable valuation to hold.`

---

## §10. Scenario Planning (Bull / Base / Bear)

Three-scenario financial model for the M12–M48 window. Probability weights reflect the founder's honest read at 2026-04-20 and are pre-Pilot; update after Pilot W12 data lands.

### 10.1 Bull case (30% probability)

**Operating assumptions:**
- Campaigns/mo/merchant: 1.5 (sustained, not first-3-months-only)
- Avg merchant lifetime: 12 months (retention add-on adoption >50%)
- Pilot-to-Paid conversion: 60%
- ConversionOracle v2 precision: 92%+ by M18; v3 shipped by M30
- Secondary metro activation: LA live at M20 (ahead of base-case M30)

**Financial projections:**
- M24 MRR: $360K ARR $4.3M; M36 MRR $1.2M ARR $14.4M; M48 MRR $2.5M ARR $30M
- LTV: $9,500 (12 × $706 × retention factor); CAC $350 (subsidy amortizes faster); **LTV/CAC 27x base / 18x stressed**
- Ops FTE at M36: 24 at SLR 37 midway to SLR 50
- Headcount M36: 40 total (ops 24, creator ops 4, eng 8, sales 2, founder 1, COO 1)

**Runway / raises:**
- Series Seed $2.5M closes Q3 2026 at $12M post (strong traction)
- Series A $12M closes M18 at $60M post (NYC-dense + LA first neighborhood live)
- Series B $30M closes M36 at $180M post (Shopify-comparable multiple on vertical SaaS)

**Decisions that differ vs. base:**
- Secondary metro (LA) accelerated to M20; Miami starts at M30; Austin at M42
- T4 retainer issued at M8 (not M10); T5 first equity grant at M14 (not M18)
- Founder transitions out of ops IC work at M15 (not M24)

### 10.2 Base case (50% probability — default plan)

**Operating assumptions:** per main body of this doc. Campaigns 1.0/mo/merchant; retention 9 months; Pilot-to-Paid 40%; ConversionOracle v2 precision 90% by M24; v3 by M36; secondary metro at M30.

**Financial projections:**
- M24 MRR $240K ARR $2.88M; M36 MRR $900K ARR $10.8M; M48 MRR $1.65M ARR $19.8M
- LTV $6,354; CAC $420; **LTV/CAC 15.1x base / 10x stressed**
- Ops FTE at M36: 24 at SLR 25 (or 12 at SLR 50 if v3 lands)
- Headcount M36: 34 total (ops 24, creator ops 3, eng 5, sales 1, founder 1)

**Runway / raises:**
- Series Seed $1.5M closes Q3 2026 at $8M post
- Series A $8M closes M24 at $40M post (NYC-dense)
- Series B $20M closes M42 at $100M post

**Decisions that match main body:** follow §3, §5, §7 verbatim.

### 10.3 Bear case (20% probability)

**Operating assumptions:**
- Campaigns/mo/merchant: 0.6 (below base; standing campaigns dominate, fewer refresh cycles)
- Avg merchant lifetime: 6 months (retention add-on uptake <30%; outcome-warranty fires at Month 3 >15% of time)
- Pilot-to-Paid conversion: 25%
- ConversionOracle v2 precision: stuck at 82% through M24; v3 slips past M42
- Secondary metro activation: delayed to M36

**Financial projections:**
- M24 MRR $144K ARR $1.7M; M36 MRR $540K ARR $6.5M; M48 MRR $1M ARR $12M
- LTV $4,200 (6 × $706); CAC $580 (higher subsidy per converted merchant); **LTV/CAC 7.2x base / 4.8x stressed** — still above 3x VC floor on Model A, below 3x on Model B
- Ops FTE at M36: 24 at SLR 22 (v3 didn't land; labor-bound)
- Headcount M36: 35 total (same roles, lower productivity)

**Runway / raises:**
- Series Seed $1.5M still closes at $6M post (narrative compression but pilot data carries)
- Series A delayed to M30 at $6M on $24M post (lower multiple, narrative pivot to "best-in-class ops + category leadership" without the vertical-AI moat)
- Series B not reachable by M48; company either (a) raises A+ bridge, (b) re-positions to agency-comparable valuation multiple, or (c) pursues strategic acquisition by OpenTable / Toast / Shopify

**Decisions that differ vs. base:**
- Bear case **delays Scale entry** from M24 to M30 (NYC-dense ramp takes 6 extra months)
- T4 retainer issuance postponed to M14 (zero T4 until Beachhead graduates validate)
- T5/T6 equity grants deferred until Series A close (de-risks Rule 701 until counsel confirms exemption math on slower merchant ramp)
- Ops hiring slows from +1/quarter to +1/half; COO hire postponed past M30

### 10.4 Scenario triggers — when do we know which case we're in?

| Signal | Date | Bull threshold | Base threshold | Bear threshold |
|---|---|---|---|---|
| Pilot Week 2 verified-customer count per merchant | 2026-06-01 | ≥5 customers ≥70% of cohort | ≥3 customers ≥50% | <3 customers ≥50% |
| Pilot Week 12 Pilot-to-Paid conversion | 2026-07-27 | ≥55% | 35–55% | <35% |
| Beachhead Month 6 retention | 2026-11-01 | >85% | 70–85% | <70% |
| Campaigns/mo/merchant at M6 Beachhead | 2027-01-01 | ≥1.3 | 0.8–1.3 | <0.8 |
| ConversionOracle v2 precision at M12 | 2027-04-01 | ≥92% | 85–92% | <85% |

**Primary trigger:** Pilot Week 12 data lands 2026-07-27. By that date we have clarity on ~60% of the scenario identification. The Month 6 Beachhead retention readout (2026-11-01) reinforces or revises the read. If the Pilot-to-Paid signal and the Beachhead retention signal disagree by more than one scenario tier, treat as Base case pending third data point.

---

## §11. Sensitivity Heat Map (2D)

### 11.1 Heat map 1 — M24 MRR by Pilot→Paid × campaigns/mo/merchant

Each cell = M24 MRR ($K/month). Anchored on 200 merchants at M24 (per §3.1), scaled by effective productivity (campaigns × conversion-to-customer rate) and MRR/merchant of $1,200 baseline. Series A narrative holds at ≥$180K M24 MRR ($2.16M ARR clearing the 10x base LTV/CAC story).

| campaigns/mo/merchant ↓ \ Pilot→Paid → | 20% | 40% (base) | 60% |
|---|---|---|---|
| **0.5** | $95K (✗ Series A story breaks — narrative pivot required) | $145K (⚠ borderline — bear-case trajectory) | $195K (✓ holds at upper end of bear) |
| **1.0 (base)** | $140K (⚠ borderline; needs retention upside) | **$240K (✓ base case — Series A story clean)** | $315K (✓ bull-adjacent) |
| **1.5** | $190K (✓ holds) | $320K (✓ bull case threshold) | $420K (✓ strong bull — Series A oversubscribed) |

**Reading:** the base cell (1.0 campaigns/mo, 40% conversion) sits at $240K MRR / $2.88M ARR — consistent with §5.1. Moving in either dimension one tier has asymmetric impact: dropping conversion to 20% at base frequency costs $100K MRR (40% of base); dropping frequency to 0.5 at base conversion costs $95K (40% of base). The diagonal is the danger zone (low-low = $95K; ✗).

### 11.2 Heat map 2 — LTV/CAC by retention × Pilot→Paid

Each cell = Model A LTV/CAC at base CAC $420 and base per-merchant monthly GM $706. ✓ = above 10x base VC comfort; ⚠ = 3–10x still fundable; ✗ = below 3x floor.

| retention months ↓ \ Pilot→Paid → | 25% | 40% (base) | 60% |
|---|---|---|---|
| **6 months** | 6.3x (⚠ bear case — Model A only) | 10.1x (✓ base — clears 10x) | 15.1x (✓ strong) |
| **9 months (base)** | **9.4x (⚠ high end of bear)** | **15.1x (✓ base case headline)** | **22.7x (✓ bull)** |
| **12 months** | 12.6x (✓ bull-tier retention) | 20.2x (✓ strong bull) | 30.3x (✓ category-definer) |

**Reading:** the base cell (9 months, 40%) is the $15.1x headline. The floor-breach cell (6 months, 25%) at 6.3x is still fundable on Model A but fails the 3x bar on Model B (Pilot-cost-as-CAC, per conversion-assumption-v1 §3.3 Model B 2.3x). The 12-month retention row is the bull-case anchor; it's the only row where all three conversion scenarios remain ✓.

**Cross-spec note:** heat map 2 reads alongside conversion-assumption-v1 §3.3's four-scenario table. That spec stress-tests Pilot→Paid in isolation; this heat map adds the retention dimension.

---

## §12. Metrics Dashboard — Expansion Readiness

Five gates, each with a single owner, a review cadence, and a specific measurable threshold. These replace the loose "Expansion Triggers" bullet list in push-gtm SKILL.md with numbered, SLR-anchored criteria.

### 12.1 Neighborhood 1→5 expansion gate (M6 → M12)

**Criterion:** ≥5 active merchants (meaning: contracted at Beachhead tier AND campaign-active in the trailing 30 days) with ≥3 verified customers per week sustained for 4 consecutive weeks.

**Why this threshold:** 5 active merchants = minimum viable density for creator supply to self-organize around a neighborhood. 3 verified customers/week/merchant sustained 4 weeks = proves the outcome delivery loop is not a single-campaign fluke.

**Measurement infrastructure today:** Pilot dashboard exists (per conversion-assumption-v1 Appendix A); verified-customer count is a core field. Ready now.

**Owner:** Prum (ops lead). **Review cadence:** weekly Monday standup; formal gate decision on the 1st of each month.

### 12.2 Dense-NYC 8-neighborhoods gate (M18 → M24)

**Criterion:** NPS ≥50 across 25+ merchants AND SLR ≥20 trailing 3 months AND merchant repeat rate ≥40% in cohorts older than 60 days.

**Why this threshold:** NPS 50 is the OpenTable-era small-merchant benchmark for "happy enough to tell peers." 25 merchants is the statistical floor for an NPS read that isn't dominated by 2–3 outliers. SLR 20 is 80% of the M12 target, proving the ops-leverage thesis is on track even if it's not at peak.

**Measurement infrastructure today:** NPS survey instrument does NOT exist. **GAP:** need to build a merchant NPS pulse (quarterly survey, 1-question NPS + 1-question verbatim) before M18. Owner: Prum. Build target: M9.

**Review cadence:** monthly on the 1st; gate decision at founder strategic review every 90 days.

### 12.3 Secondary-metro gate (M24 → M30)

**Criterion:** ConversionOracle precision ≥85% in new geo cohort AND 10+ merchants in secondary metro retained 3 months AND SLR ≥25 sustained 3 months.

**Why this threshold:** 85% precision in new geo (vs. 90% in NYC) allows a graceful ramp — the geo cohort is 6 months behind NYC on data volume. 10+ retained merchants = first-neighborhood density reached. SLR 25 sustained = ops-leverage thesis is not breaking under multi-geo operational complexity.

**Measurement infrastructure today:** ConversionOracle precision-by-geo breakdown does NOT exist (system itself is pre-MVP). **GAP:** instrumentation requires ConversionOracle v2 shipped with per-geo precision/recall dashboards. Target: M15 (3 months before gate).

**Owner:** ML Advisor (when engaged) for precision; Prum for merchant-count and SLR. **Review cadence:** monthly; gate decision at founder strategic review.

### 12.4 Multi-metro gate (M30 → M36)

**Criterion:** ConversionOracle precision ≥90% cross-geo AND SLR ≥35 trailing 6 months AND second-metro neighborhood repeat rate ≥40% AND multi-state 1099 + sales tax nexus + pay transparency compliance playbook executed (per audit 05 Q13).

**Why this threshold:** 90% cross-geo precision = the ConversionOracle v3 target partial. SLR 35 = midpoint between M12 (25) and M24 (50) targets. Compliance playbook executed = not just "counsel retained" but "playbook run through for one trigger event."

**Measurement infrastructure today:** per-metro SLR decomposition does NOT exist. Time logs are tagged by role category but not geo. **GAP:** add `geo_cohort` field to time_logs table; build SLR-by-metro dashboard. Target: M24 (6 months before gate).

**Owner:** Founder + Ops Director (post-COO-hire). **Review cadence:** monthly; gate decision at founder + board strategic review.

### 12.5 Series A gate (M18–M24 window)

**Criterion:** $1M+ ARR trailing 12 months AND SLR ≥30 AND LTV/CAC ≥8x in actuals (not model) AND at least 30 Beachhead merchants with 6+ months of retention data.

**Why this threshold:** $1M ARR trailing = threshold for Series A conversations at most tier-1 funds. SLR 30 = above M12 target, proves trajectory toward M24 SLR 50 target. LTV/CAC ≥8x in **actuals** not model = the killer requirement — this is the gate that forces us to have real cohort data, not just planning assumptions.

**Measurement infrastructure today:** ARR dashboard exists conceptually; cohort LTV measurement requires 6+ months of post-Beachhead data. **GAP:** merchant cohort tracker with monthly revenue/retention decomposition. Target: M9 build.

**Owner:** Founder (for raise decision) + Data Owner (for cohort measurement). **Review cadence:** monthly from M12 onward; Series A process opens at first month all 4 criteria met.

### 12.6 Dashboard owner + weekly review cadence

- **Primary dashboard owner:** Prum (ops lead) until data analyst is hired (post-Series-A)
- **Weekly cadence:** Monday 10am standup; 5 gates + trigger status reviewed as a single table
- **Monthly cadence:** 1st of month, formal gate decision if within 30 days of a gate window; founder-strategic-review covers gates every 90 days
- **Quarterly cadence:** P1_rollup §Open Risks refreshed with gate status; any gate moving from "on track" to "at risk" escalated to founder within 24h

**Infrastructure summary (what needs building):** merchant NPS instrument (§12.2 gap); ConversionOracle per-geo precision dashboard (§12.3 gap); SLR-by-metro decomposition (§12.4 gap); merchant cohort tracker with 6mo retention data (§12.5 gap). Four gaps total; 3 of 4 are unbuildable until ConversionOracle v2 ships, which gates the Series A narrative.

---

## §13. Cross-Spec Dependencies + Contradiction Check

### 13.1 P2-6 conversion-assumption-v1

- **Shared date:** Pilot Week 12 EOW (2026-07-27). conversion-assumption-v1 §4 locks the Pilot-to-Paid final rate; this spec's §10.4 scenario triggers use the same readout.
- **Tripwire:** if conversion-assumption-v1 Week 12 actual drops below 40%, update §3.1 pace table here — Beachhead 11–50 merchant ramp is paced by conversion rate and the M18 100-merchant target becomes optimistic.
- **Action:** Jiaming re-reads §3.1 within 7 days of conversion-assumption-v1 Week 12 readout.

### 13.2 P2-5 legal budget (multi-state compliance)

- **Dependency:** expansion beyond Williamsburg triggers new-state blue-sky + nexus review (per audit 05 Q13; per §12.4 multi-metro gate criterion).
- **Budget coupling:** P2-5 legal budget must cover LA/Miami/Austin counsel retainer before M27 (3 months pre-M30 secondary-metro gate).
- **Tripwire:** if P2-5 budget doesn't include multi-state counsel by M18, §3.1 M30 secondary-metro entry slips to M36.

### 13.3 P2-1 consumer-facing (loyalty card retention)

- **Dependency:** per-merchant MRR ramp from $1,000 (M12) to $1,650 (M48) in §5.2 depends on retention add-on (visit 2/3/loyalty) adoption reaching ~40% by M24 and ~60% by M36.
- **Tripwire:** if loyalty card retention rate at M12 Beachhead cohort is below 30%, §5.2 blended per-customer rate assumption ($25 flat) must be revised downward; M36 ARR drops from $10.8M toward $8.5M.
- **Action:** first read of loyalty adoption rate at Pilot Week 12; second read at Beachhead Month 6 (M8 in calendar time).

### 13.4 push-pricing §5 Unit Economics

- **Dependency:** all GM / LTV / CAC values in this spec are **model-derived** from pricing base case. Pilot W12 will provide first real numbers.
- **Coupling:** push-pricing §9 Experiment #1 (Pilot-to-Beachhead 60% target) shares the §10.4 scenario trigger calendar.
- **Contradiction watch:** if push-pricing §9 Experiment #2 (per-customer price sensitivity $25 vs $30 vs $35) validates $30 at parity demand, blended per-customer rate in §5.2 must be updated upward (could pull M36 ARR toward $12–13M).

### 13.5 Contradictions to watch (the tripwire list)

| # | Watch | Signal | Response SLA |
|---|---|---|---|
| 1 | Actual campaigns/mo/merchant >1.5 at Beachhead | Pilot W12 data | Spec pace is over-conservative; founder memo to F&F within 7 days; §3.1 revised upward |
| 2 | Actual campaigns/mo/merchant <0.7 at Beachhead | Pilot W12 data | Spec pace under-delivered; F&F notification within 7 days; revise §3.1 and §5.1 downward; consider pricing pivot |
| 3 | conversion-assumption-v1 Week 12 actual <25% | 2026-07-27 readout | Freeze Beachhead 11–50 expansion; §3.1 M18 target slips; re-derive §10.4 bear case |
| 4 | Per-merchant MRR ramp stalls at $1,100 by M18 | M18 MRR snapshot | Retention add-on adoption <40%; push-pricing §2.3 repricing trigger; §5 ARR trajectory downgrades |
| 5 | ConversionOracle v2 precision stuck <85% at M15 | M15 ML review | SLR target 50 at M24 unreachable; org becomes labor-bound; §3.2 Month-48 caveat activated |
| 6 | ML Advisor Day 14 readout = 0 conversations | 2026-05-04 | Per P1 risk #1; contingency plan activates; ConversionOracle roadmap slips; §3.2 ripple forward |
| 7 | T4 retainer not issued by M10 | M10 review | Creator Productivity Lock moat deferred; §6.3 distribution assumptions break; reset retention-levered portion of expansion |

**Founder memo template for tripwire firing:** one-page doc to F&F investors within 7 days of any tripwire above firing, covering (a) which tripwire fired, (b) measured value vs threshold, (c) implication for §3.1 pace or §5.1 revenue, (d) founder's one-sentence read on Bull/Base/Bear shift, (e) next review date and who's accountable.

### 13.6 Master cross-spec coupling diagram (narrative)

```
Pilot W12 (2026-07-27)
       │
       ├─→ conversion-assumption-v1 §4 (Pilot-to-Paid final rate)
       │         │
       │         └─→ this spec §10.4 scenario triggers (Bull/Base/Bear identification)
       │                   │
       │                   └─→ this spec §3.1 pace table (re-derive if needed)
       │                             │
       │                             └─→ push-gtm SKILL.md Expansion Triggers (§9.1 change 2)
       │                             └─→ push-metrics SKILL.md §1.1 Active Campaign assumption (§9.2 change 4)
       │                             └─→ numeric_reconciliation.md rows 113–124 (§9.6 change 8)
       │
       ├─→ push-pricing §9 Experiment #1 (same data, primary owner)
       │
       └─→ P1_rollup §Risks #7 (Pilot-to-Beachhead <60%) — risk closure trigger
```

The W12 readout is therefore the **single highest-leverage data point** in the entire v5.2 planning cycle. Every spec in the P2 wave eventually cites it.

---

*Wave 2 append complete 2026-04-20. Sections §9–§13 extend v1 draft without revising §1–§8 + Appendices A–D. Next revision: v2 (post-W12 empirical), targeted 2026-08-03 for founder review, 2026-08-10 for commit.*
