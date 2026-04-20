# P2-3 Expansion Math v1 — Wave-3 Fresh-Eyes Audit

> **Target:** `docs/spec/expansion-math-v1.md` (725 lines, DRAFT v1, committed 2026-04-20)
> **Auditor role:** Series-A diligence analyst / numeric-methodology auditor
> **Scope:** Every number, every formula, every forecast — checked against `docs/v5_2_status/numeric_reconciliation.md` (SoT) and against internal logical consistency
> **Companion audit:** `docs/spec/audits/01-p2-1-audit.md` (consumer-facing); shared data point with P2-6 conversion-assumption-v1 flagged by Wave 2
> **Audit date:** 2026-04-20
> **Read-only:** no spec modifications

---

## §1. Executive Summary

### 1.1 Numeric coherence rating: **C+**

The spec is *directionally* honest about killing the v5.1 "Top-5 metro by M18" narrative — that is a meaningful upgrade over the prior state. But the replacement math carries five distinct arithmetic / logical errors that, taken together, undermine the "consistent across all external claims" success criterion stated in §8.4. The spec cannot be shipped to external investors in its current form without reconciliation.

Grade rationale:

| Dimension | Grade | Notes |
|---|---|---|
| Honesty about prior-state contradiction | A | §1 correctly names the SLR × 4-campaigns arithmetic error and owns it |
| Internal arithmetic (§3 pace, §5 revenue) | A– | Most per-row math ties; per-merchant MRR ramp is internally consistent |
| Consistency with SoT (`numeric_reconciliation.md`) | D | M12 per-merchant revenue $1,000 ≠ SoT $2,620 — 62% drift, unexplained |
| Consistency with P2-6 conversion-assumption-v1 | F | §3 implicit assumption (100% conversion of what?) never disambiguated; both specs model the same data point with different arithmetic framing |
| Bull/Base/Bear internal consistency | C | Bull uses 1.5 campaigns/mo — contradicts §3 "central assumption 1.0"; probability weights 30/50/20 appear unjustified |
| SLR gate thresholds (§3.3 vs §12 vs §9.1) | C– | Three different gate tables quote three different thresholds for the same transition |
| Series A narrative ($10M ARR at M48) | B | Arithmetic works if assumptions hold; heavily front-loaded risk on unverified Pilot + ML deliveries |

### 1.2 Top 3 arithmetic / forecasting errors

1. **E-1 (SoT drift, high-severity):** §5.1 row M12 states per-merchant avg MRR = **$1,000**. `numeric_reconciliation.md` row 51 (authoritative SoT) states per-merchant M12 revenue (Coffee+) = **$2,620**. The spec reconciles this implicitly by assuming 20 verified customers/mo at M12 (vs SoT's 85), but the SoT assumption row (54) = 85 customers/mo is never cited or overridden. Drift = 62%.

2. **E-2 (Pilot→Paid logical error, high-severity):** The spec §3.1 assumes 25 merchants at M12 without showing how Pilot conversion composes into that number. The Pilot cohort is capped at 10 merchants (SoT row 8). The 25 at M12 therefore decomposes into (≤10 pilot converts) + (15+ directly-acquired Beachhead). The spec does not show this decomposition. conversion-assumption-v1 §13 "fixes" this with `25 × 0.6 × $1,000 = $15K` — which is ALSO wrong because it treats all 25 as pilot merchants. Both specs have the same logical blind spot from opposite sides.

3. **E-3 (Bull-case contradiction):** §10.1 Bull case assumes 1.5 campaigns/mo/merchant sustained. §2.1 states "Central assumption for all math below: 1 active campaign/mo/merchant at steady state; 1.5 in first 3 months of merchant lifecycle." The Bull scenario therefore silently revises the "central assumption" — which means the §3 pace table (and its SLR-derivation) is NOT the Bull-case pace. The Bull case would need a recomputed pace table with 1.5× ops FTE per row (e.g., M36 ops FTE = 36 at SLR 25, not 24). §10.1 does not present that recomputed table.

---

## §2. Numeric Cross-Check Table

Categories: **MATCH** (ties to SoT), **DRIFT** (inconsistent with SoT but not clearly wrong), **ERROR** (arithmetic fails), **MISSING** (spec claim has no SoT backing).

| # | Claim in spec | Source (spec §) | Reconciliation (SoT / math) | Category |
|---|---|---|---|---|
| 1 | Merchant Pilot floor $0 | §3.1 implicit | SoT row 6 | MATCH |
| 2 | Beachhead floor $500/mo | §5.1 narrative | SoT row 7 | MATCH |
| 3 | Pilot cohort = 10 merchants | §2.1 (table row 1) | SoT row 8 | MATCH |
| 4 | Beachhead window 11–50 | §2.1 (table row 2) | SoT row 9 | MATCH |
| 5 | Per-merchant M12 MRR = **$1,000** | §5.1, §5.2 | SoT row 51: $2,620 (85 customers × $25 + $500) | **DRIFT** (spec assumes 20 customers/mo; SoT assumes 85) |
| 6 | Per-merchant M12 verified customers = 20 | §5.2 (row "verified customers/mo implied") | SoT row 54: 85 customers/mo at M12 | **DRIFT** (factor of 4.25) |
| 7 | Blended per-customer rate = $25 | §5.2 (row "blended per-customer rate") | SoT row 2 (Coffee+ $25) | MATCH (conservative choice; caveat in §5.2 acknowledged) |
| 8 | M12 MRR = $25K | §5.1 | 25 merchants × $1,000 = $25K | MATCH (self-consistent within spec); DRIFT vs SoT-implied $65.5K |
| 9 | M18 MRR = $110K | §5.1 | 100 × $1,100 = $110K | MATCH (internal) |
| 10 | M24 MRR = $240K | §5.1 | 200 × $1,200 = $240K | MATCH (internal) |
| 11 | M30 MRR = $540K | §5.1 | 400 × $1,350 = $540K | MATCH (internal) |
| 12 | M36 ARR = $10.8M | §5.1 | 600 × $1,500 × 12 = $10.8M | MATCH (internal) |
| 13 | M48 ARR = $19.8M | §5.1 | 1,000 × $1,650 × 12 = $19.8M | MATCH (internal) |
| 14 | SLR target M12 ≥ 25 | §3.1 | SoT row 65 | MATCH |
| 15 | SLR target M24 ≥ 50 | §3.1 | SoT row 66 | MATCH |
| 16 | Ops FTE denominator 160 hr/mo | §1.1, Appendix A | SoT row 67 | MATCH |
| 17 | SLR verifying-state rolloff 48h | §1.1 implicit | SoT row 68 | MATCH |
| 18 | Ops FTE cost = $120K fully-loaded | §1.1, Appendix A | Not in SoT | **MISSING** |
| 19 | M12 pace: 25 merchants / 1 ops FTE at SLR 25 | §3.1 | 25/25 = 1.0 ✓ | MATCH |
| 20 | M18 pace: 100 merchants / 4 ops FTE | §3.1 | 100/25 = 4.0 ✓ | MATCH |
| 21 | M24 pace: 200 merchants / 8 ops FTE | §3.1 | 200/25 = 8.0 ✓ | MATCH |
| 22 | M36 pace: 600 merchants / 24 ops FTE at SLR 25 | §3.1 | 600/25 = 24.0 ✓ | MATCH |
| 23 | M48 pace: 1,000 merchants / 40 ops FTE at SLR 25 | §3.1 | 1,000/25 = 40 ✓ | MATCH |
| 24 | 3,000 merchants × 4 camp/mo / SLR 25 = 480 FTE | §1.1 | 12,000/25 = 480 ✓ | MATCH |
| 25 | 480 FTE × $120K = $57.6M/yr | §1.1, §2.2 | ✓ | MATCH |
| 26 | LTV = $6,354 | §4.1 table (Series A row) implied | SoT row 55 | MATCH |
| 27 | CAC = $420 | Implicit in §4.1 | SoT row 57 | MATCH |
| 28 | LTV/CAC = 15.1x base / 10.0x stressed | §10.2 Base case | SoT rows 58–59 | MATCH |
| 29 | $2.88M ARR at Series A raise | §4.1 | 200 merchants × $1,200 × 12 = $2.88M ✓ | MATCH (internal) |
| 30 | 9-month avg merchant lifetime | §5.3, §10 | SoT row 56 | MATCH |
| 31 | Creator slots/campaign 5–10 (Seed tier default) | §6.1 | push-creator §2 (implicit) | MATCH |
| 32 | Retainer load at M36 = $227K/mo = $2.7M/yr | §6.3 | 150×$800 + 40×$1,800 + 10×$3,500 = $120K+$72K+$35K = **$227K ✓** | MATCH |
| 33 | Retainer load as % of ARR at M36 = 25% | §6.3 | $2.7M / $10.8M = **25.0% ✓** | MATCH |
| 34 | Bull M48 MRR = $2.5M, ARR $30M | §10.1 | 1,000 × $2,500 × 12 = $30M — but §10.1 never says 1,000 merchants; it says "$2.5M MRR" with no merchant count | **MISSING** (derivation not shown) |
| 35 | Bear M48 MRR = $1M, ARR $12M | §10.3 | 1,000 × $1,000 × 12 = $12M; again no merchant count shown | **MISSING** (derivation not shown) |
| 36 | Heat map §11.1: base cell $240K | §11.1 | = §5.1 M24 row ✓ | MATCH |
| 37 | Heat map §11.2: base LTV/CAC 15.1x | §11.2 | = SoT row 58 ✓ | MATCH |
| 38 | Williamsburg = 5 neighborhoods at M12 | §3.1 | push-gtm: "one neighborhood, ~10 merchants" | **DRIFT** (gtm says one neighborhood; spec says 5; unreconciled) |
| 39 | 25 merchants in M12 Williamsburg (100% conversion assumption from Pilot) | §3.1 implicit | Pilot cap = 10; 25 merchants implies 15 direct Beachhead acquisitions (never disclosed) | **ERROR** (assumption untraceable) |
| 40 | Bull case at 1.5 camp/mo/merchant | §10.1 | Contradicts §2.1 "central assumption 1.0" for math in §3 | **ERROR** (pace table not recomputed for Bull) |
| 41 | Bear case at 0.6 camp/mo/merchant | §10.3 | Would recomputed ops FTE to 14.4 at M36 (not 24 as in §3.1); Bear case never recomputes pace | **ERROR** (same defect as E-3) |
| 42 | Gate M12→M18: SLR ≥ 20 trailing 2mo | §3.3 | §9.1 change 2 says same; §12.1 doesn't specify threshold | MATCH (finally) |
| 43 | Gate M18→M24: SLR ≥ 20 sustained 2mo | §3.3 | §12.2 says ≥20 trailing 3mo — **different cadence** | **DRIFT** (2 consecutive ≠ trailing 3mo) |
| 44 | Gate M24→M30: SLR ≥ 25 + 8wk ConvOracle precision ≥ 90% + first $5M ARR | §3.3 | §12.3 says ≥25 + 10 merchants retained 3mo + ConvOracle precision ≥ 85% (not 90) | **ERROR** (two different thresholds — 85% vs 90%) |
| 45 | Gate M30→M36: SLR ≥ 30 | §3.3 | §12.4 says SLR ≥ 35 trailing 6mo + ConvOracle ≥ 90% cross-geo | **ERROR** (30 ≠ 35) |
| 46 | Gate M36→M48: SLR ≥ 50 sustained 6mo | §3.3 | Consistent | MATCH |
| 47 | Series A gate: $1M+ ARR trailing 12 | §12.5 | §4.1 says Series A at $2.88M ARR (= M24 ARR) — trailing 12 ≠ run-rate | **DRIFT** (trailing $1M ARR ≈ run-rate $2M+; not obviously the same bar as §4.1's $2.88M) |

---

## §3. The Pilot→Paid Contradiction

### 3.1 The contradiction as Wave-2 flagged it

conversion-assumption-v1 §13 (last bullet) states:

> "Expansion-math v1 §3 implicitly assumes 100% Pilot→Paid (counts all 25 Williamsburg merchants in M12 MRR); this spec's stress-test models 25-60%. The two specs disagree on the M12 MRR ($25K vs $15K). Wave 4 owner: reconcile in numeric_reconciliation.md."

Wave 2's summary is directionally correct but arithmetically imprecise. A careful read of both specs reveals a **shared** logical blind spot, not a Pilot-vs-Beachhead composition error.

### 3.2 Careful decomposition

- Pilot cohort cap = 10 merchants (SoT row 8).
- Beachhead window = merchants 11–50 (SoT row 9).
- At M12 with 25 total merchants, the composition is:
  - Converted pilot merchants (≤10 × conversion rate)
  - PLUS direct Beachhead acquisitions (who skip Pilot entirely and sign $500/mo from Week 1 of their relationship)

### 3.3 M12 MRR recomputation under each conversion scenario

Using per-merchant MRR assumption from spec §5.2 table (M12 = $1,000/merchant blended). **This uses the spec's own MRR assumption — if the spec's $1,000 is already wrong vs SoT's $2,620, that is a separate finding.**

| Scenario | Pilot converts (of 10) | Direct Beachhead needed to reach 25 | M12 MRR (spec's $1,000 avg) | M12 MRR (SoT's $2,620 avg) |
|---|---|---|---|---|
| Base (spec §5.1 implicit) | 10 (100%) | 15 | $25K | $65.5K |
| **Base (60%, per push-pricing §9 Exp #1 + conversion-assumption-v1 §3.3 Base)** | 6 | 19 | $25K (25 × $1,000) | $65.5K |
| **Moderate (40%, conversion-assumption §3.3)** | 4 | 21 | $25K (25 × $1,000) | $65.5K |
| **Conservative (25%, conversion-assumption §3.3)** | 2–3 | 22–23 | $25K (25 × $1,000) | $65.5K |

### 3.4 The counter-intuitive finding

If the model can hit **25 merchants** at M12 regardless of Pilot→Paid rate (by back-filling Beachhead acquisitions), **M12 MRR is invariant to Pilot→Paid**. The conversion-assumption-v1 §13 claim of "$25K vs $15K disagreement" is itself based on the incorrect assumption that all 25 M12 merchants are pilot converts.

**But** this only holds if direct Beachhead acquisition is achievable at pace:
- 60% Pilot→Paid: need 19 Beachhead in ~6 months (M7–M12) → 3.2/mo — plausible
- 40% Pilot→Paid: need 21 Beachhead → 3.5/mo — plausible
- 25% Pilot→Paid: need 22–23 Beachhead → 3.8/mo — strained; signal from Pilot is weak → lower trust → slower Beachhead sign rate → probably <2/mo actual; M12 lands at ~15–20 merchants, not 25

**The indirect coupling between Pilot→Paid and Beachhead acquisition rate is the real risk — not a direct multiplicative error.**

### 3.5 Corrected M12 MRR under three scenarios (with realistic Beachhead throughput)

Modeling: Base = 3.2 Beachhead/mo possible; Moderate = 2.5/mo (some signal compression); Conservative = 1.5/mo (weak social proof).

| Scenario | Pilot converts | Beachhead pace | Realistic M12 merchant count | Using spec's $1,000 avg | Using SoT's $2,620 avg |
|---|---|---|---|---|---|
| **60% base (spec-aligned)** | 6 | 3.2/mo × 6 = 19 | 25 | **$25K** (matches §5.1) | $65.5K |
| **40% moderate** | 4 | 2.5/mo × 6 = 15 | 19 | **$19K** | $49.8K |
| **25% conservative** | 2.5 | 1.5/mo × 6 = 9 | 11–12 | **$11.5K** | $30.2K |

### 3.6 Which should the spec adopt?

The spec should adopt **the 40% Moderate scenario as its base case** for three reasons:

1. **conversion-assumption-v1 §2.3 (evidence-backed):** industry proxies put trial-to-paid at 20–40% typical. 60% is explicitly flagged in that spec as "upside end of a 25–60% range" and "optimistic vs. industry norms."
2. **conversion-assumption-v1 §4.1 decision threshold:** the 40% threshold is the "base case narrative remains intact" line — below 40%, investor communication requires individual F&F calls.
3. **Narrative consistency:** §10.2 of expansion-math-v1 already labels Base case as "Pilot-to-Paid 40%" — but §5.1 presents M12 MRR at an implicit 60%+ assumption. The Base case cannot be 40% in one section and 60%+ in another.

**Required spec revision:** §5.1 row M12 should read "$19K MRR / $228K ARR" (not $25K / $300K) under the stated Base case of 40% Pilot→Paid. The §4.1 Series Seed round deliverable should read "$19K MRR / $228K ARR by M12" with upside notation.

---

## §4. SLR Sensitivity Check — Are §3 Assumptions + §10 Probabilities Consistent?

### 4.1 The assumption stack

| Section | Campaigns/mo/merchant | Implied ops FTE at M36 (SLR 25) | Implied ops FTE at M48 (SLR 25) |
|---|---|---|---|
| §2.1 (central) | 1.0 | 24 | 40 |
| §3.1 pace | 1.0 (derived from §2.1) | 24 | 40 |
| §10.1 Bull | **1.5** | 36 | 60 |
| §10.2 Base | 1.0 | 24 | 40 |
| §10.3 Bear | **0.6** | 14.4 | 24 |

### 4.2 The inconsistency

§2.1 declares 1.0 the "central assumption for all math below." §3.1 derives the pace table from that. But §10.1 Bull and §10.3 Bear silently re-rate campaigns/mo/merchant without recomputing the pace table.

**Bull case** (1.5 camp/mo/merchant) at SLR 25 requires 36 ops FTE at M36. The spec's §10.1 declares "Ops FTE at M36: 24 at SLR 37 midway to SLR 50" — this implicitly assumes **SLR 37** (between 25 and 50) to keep the FTE count at 24. That is a **double assumption** (higher SLR + higher campaign frequency) that should be called out explicitly and whose joint probability is harder to justify than 30%.

**Bear case** (0.6 camp/mo/merchant) at SLR 22 (§10.3) gives 600 merchants × 0.6 / 22 = 16.4 ops FTE at M36, not 24. §10.3 declares "Ops FTE at M36: 24 at SLR 22" — which requires **600 × 0.6 / 22 = 16.4 FTE at SLR 22**, not 24. The spec's 24 figure is carried over from §3.1 unchanged. This is arithmetically wrong in the Bear case.

### 4.3 Probability weights 30% / 50% / 20% (§10)

- **No method shown for probability assignment.** Reasonable priors on Pilot-to-Paid alone (conversion-assumption-v1 §2.2 proxy band): mode is 20–40%, which aligns with Base case Moderate. The mode should get ~60% weight. Bull (60% Pilot→Paid) corresponds to upper-band proxy (50–65%) with ~20% weight. Bear (25% Pilot→Paid) corresponds to floor (<25%) with ~20% weight.
- **More defensible weights:** 20% / 60% / 20% — but spec uses 30% / 50% / 20%. The +10% Bull weight is unjustified. Under the more-defensible weights, probability-weighted M36 ARR = 0.2 × $14.4M + 0.6 × $10.8M + 0.2 × $6.5M = **$11.56M** (vs spec's implicit 0.3 × $14.4M + 0.5 × $10.8M + 0.2 × $6.5M = **$11M**). Small delta but the weighting methodology gap is a finding.

### 4.4 Verdict

The Bull/Base/Bear scenarios are NOT internally consistent with §3's pace table. Required revisions:

1. **§10.1 Bull case must provide a recomputed pace table** with 1.5× campaign load; ops FTE should rise proportionally UNLESS SLR target also rises (which requires separate justification tied to ConversionOracle v3 delivery).
2. **§10.3 Bear case must provide a recomputed pace table** with 0.6× campaign load; the 24-FTE claim at M36 is arithmetically wrong if campaign frequency actually drops.
3. **§10 scenario probabilities must be justified** with reference to conversion-assumption-v1 proxy evidence basis; defending 30% Bull weight requires a separate argument.

---

## §5. Revenue Forecast Stress Test — $25K → $900K → $1.65M MRR Path

### 5.1 Arithmetic validation per row

| Month | Merchants | Avg MRR/merchant | Spec's MRR | Arithmetic check | Per-merchant math (from §5.2) |
|---|---|---|---|---|---|
| M12 | 25 | $1,000 | $25K | 25 × $1,000 = $25K ✓ | $500 floor + $500 per-cust (20 × $25) = $1,000 ✓ |
| M18 | 100 | $1,100 | $110K | 100 × $1,100 = $110K ✓ | $500 + $600 (24 × $25) = $1,100 ✓ |
| M24 | 200 | $1,200 | $240K | 200 × $1,200 = $240K ✓ | $500 + $700 (28 × $25) = $1,200 ✓ |
| M30 | 400 | $1,350 | $540K | 400 × $1,350 = $540K ✓ | $500 + $850 (34 × $25) = $1,350 ✓ |
| M36 | 600 | $1,500 | $900K | 600 × $1,500 = $900K ✓ | $500 + $1,000 (40 × $25) = $1,500 ✓ |
| M48 | 1,000 | $1,650 | $1.65M | 1,000 × $1,650 = $1.65M ✓ | $500 + $1,150 (46 × $25) = $1,650 ✓ |

**Internal arithmetic is clean.** Every MRR row ties to (merchant count × per-merchant MRR), and each per-merchant MRR ties to the §5.2 decomposition.

### 5.2 The SoT drift stress test

SoT row 51: Per-merchant M12 Coffee+ revenue = **$2,620** ($500 + 85 × $25).
Spec §5.1 row M12: Per-merchant M12 blended = **$1,000** ($500 + 20 × $25).

If SoT is authoritative (it claims to be per its own header), then the spec's M12 MRR under the SoT assumption would be:

- 25 merchants × $2,620 = **$65.5K MRR / $786K ARR**

Applying the 85-customer assumption through the full trajectory (holding merchant count constant):

| Month | Merchants | SoT per-merchant | MRR (SoT basis) | ARR (SoT basis) | Spec's number | Delta |
|---|---|---|---|---|---|---|
| M12 | 25 | $2,620 | $65.5K | $786K | $25K / $300K | **+162%** |
| M36 | 600 | $2,620 base + ramp | ~$1.57M (if 85 cust flat) | ~$18.9M | $900K / $10.8M | **+75%** |
| M48 | 1,000 | — | — | — | $1.65M / $19.8M | — |

**The spec's revenue trajectory is CONSERVATIVE relative to SoT** — the M12 MRR could be 2.6× higher if SoT's 85 customers/mo assumption holds. But the spec does not disclose or justify the customer-volume de-rating from 85 (SoT) to 20 (spec).

### 5.3 What's really going on (interpretation)

The spec implicitly treats SoT row 54 (85 customers/mo) as a **mature Month-12 Coffee+ Beachhead merchant** steady state, not an **M12 of company-life** steady state. A merchant that joins at M6 is only 6 months into its relationship at M12 — still ramping. The spec's 20 customers/mo blended is defensible as "average across cohort at M12-of-company-life."

**The right fix is disclosure, not recomputation.** §5.2 should add a row clarifying: "SoT row 54 (85 customers/mo) is the Coffee+ M12-of-merchant-lifecycle target; this spec's 20 customers/mo at M12-of-company-life is the cohort-weighted average during the ramp window. The two numbers describe different cohorts."

Without that disclosure, any investor cross-checking SoT will catch the 62% drift and conclude the spec is inflated or that SoT is wrong.

### 5.4 Per-merchant MRR ramp — is the glide path plausible?

From $1,000 (M12) to $1,650 (M48) over 36 months = 65% total growth = 1.4%/month compound. Driven entirely by customers/mo (20 → 46 = 130% growth) at flat $25 blended rate.

- At M48, 46 customers/mo per merchant × $25 = $1,150 per-customer revenue.
- SoT-implied ceiling: 85 customers/mo × $25 = $2,125 per-customer revenue.
- The spec's M48 per-merchant revenue is STILL 46/85 = 54% of the SoT-implied steady state — deeply conservative.
- If the category-mix shift to beauty/fitness (spec §5.2 caveat) pushes blended rate to $32 by M48, the M48 per-merchant revenue rises to $1,472 + $500 = **$1,972/mo** — 19% upside on the conservative base.

**Verdict:** the per-merchant ramp is plausible and CONSERVATIVELY stated. The company is more likely to beat this forecast than miss it, assuming merchant retention holds.

---

## §6. Creator-Supply Math — Does v5.2 Tier Design Support This Density?

### 6.1 The spec's claim (§6.1, §6.3)

- At M36: 600 merchants × 1 campaign/mo × 7 slots/campaign avg = 4,200 creator engagements/mo → 2,100 active creators needed.
- Tier distribution at M36: T1 38% / T2 33% / T3 19% / T4 7% / T5 2% / T6 <1%.

### 6.2 Arithmetic check

| Tier | Share | Creators at M36 | Spec's explicit count |
|---|---|---|---|
| T1 | 38% | 798 | 800 |
| T2 | 33% | 693 | 700 |
| T3 | 19% | 399 | 400 |
| T4 | 7% | 147 | 150 |
| T5 | 2% | 42 | 40 |
| T6 | <1% | ≤21 | 10 |
| **Total** | 100% | 2,100 | 2,100 ✓ |

Rounding matches; internal arithmetic is consistent.

### 6.3 Does v5.2 tier design support this density?

Checked against push-creator tier progression thresholds (SoT rows 89–96):

- **T2 threshold:** 10 verified customers cumulative (SoT row 89). 800 T1 creators converting to 700 T2 by M36 requires 700 T2 promotions over 36 months ≈ 19/month on average — achievable given Pilot + Beachhead cohort.
- **T3 promotion:** Push Score ≥ 55 + cumulative verified (SoT row 90). T3 count of 400 at M36 requires 400 promotions from T2 over 36 months ≈ 11/month. Plausible.
- **T4 invite:** monthly throughput ≥ 20 customers/mo + Push Score ≥ 70 (SoT rows 91–92). T4 count of 150 at M36 requires 150 invitations in 36 months ≈ 4.2/month. Spec's §7.7 note in conversion-assumption "zero T4 today" is a real gap.
- **T5 invite:** throughput ≥ 40/mo + Push Score ≥ 80 (SoT rows 93–94). 40 creators at M36 ≈ 1.1/month — extremely plausible supply-side but gated on T4 maturity.
- **T6 invite:** tenure ≥ 12 months + Push Score ≥ 90 (SoT rows 95–96). Only 10 creators at M36. Can't reach 12-month tenure until M12+; 10 creators is already tight. **DRIFT:** §6.3 shows 10 T6 creators; SoT implies T6 tenure requirement gates most of these from existing until M24+. The spec should show T6 = 0 through M24 and 10 only achievable if first T5 appointments happen by M12.

### 6.4 Retainer load check (§6.3)

- 150 × $800 (T4) = $120,000/mo
- 40 × $1,800 (T5) = $72,000/mo
- 10 × $3,500 (T6) = $35,000/mo
- **Total: $227,000/mo = $2.724M/yr** ✓ (spec says $227K/mo = $2.7M/yr) ✓
- Retainer load as % of ARR: $2.724M / $10.8M = **25.2%** ✓ (spec says 25%)

### 6.5 Hidden cost omission

§6.4 retainer load does not include per-verified-customer creator payouts on top of retainers. For T4–T6 creators, per-customer fees apply (SoT rows 32, 37, 42). If T4–T6 deliver even 10 customers each on top of retainer, the incremental cost = 200 × 10 × $25 (avg) = $50K/mo = $600K/yr. This is another 5.5% of ARR. Neither the spec nor SoT aggregates this.

**Recommended fix:** §6.3 should state "retainer load only; per-customer fees separate — see §5.2 blended per-customer rate." Or aggregate total creator cost as a % of revenue.

---

## §7. Series A Narrative Check — $10M ARR at M48 via 600 Merchants × $1,500 MRR

### 7.1 The arithmetic

$10.8M ARR at M36 = 600 merchants × $1,500 MRR × 12. Internally consistent ✓.

But the CLAIM in §4.1 is **"Path to $10M ARR by M48 at 600-1,000 merchants across 2–3 metros"** — the word "M48" appears but the $10M threshold is crossed at **M36** in §5.1. The spec sometimes says M36, sometimes M48. §1.3 says "$10M-ARR-by-Month-48"; §5.1 table says M36 crosses $10M; §4.1 Series A row says "$10.8M ARR at M36 target"; §7.5 MUST promise says "$10M ARR by M36 at 600 merchants across 2 metros".

**DRIFT:** the M36 vs M48 threshold for $10M ARR is inconsistent across four places in the spec. The arithmetic says M36 at 600 merchants. The spec should say M36 everywhere.

### 7.2 Is the path believable given churn + ramp?

Key inputs:
- Avg merchant lifetime = 9 months (SoT row 56)
- 600 merchants at M36 net-present (after churn)

Churn implications: if monthly churn = 1/9 = 11.1%, then to have 600 net at M36, the gross acquisition rate has been much higher. Let g(t) = monthly gross acquisitions, c = 0.111 churn. Steady state: net = g / c. To maintain net 600: g = 600 × 0.111 = **66.7 gross acquisitions per month** at M36.

- At M12 (25 merchants), gross/mo ≈ 25 × 0.111 = 2.8/mo in steady state — but M12 is in ramp mode, so gross >> 2.8 to reach 25 merchants.
- At M24 (200 merchants), gross/mo ≈ 200 × 0.111 = 22.2/mo in steady state.
- At M36 (600 merchants), gross/mo = 66.7/mo.
- Ramp from 22/mo (M24) to 67/mo (M36) over 12 months = 3× acquisition velocity. **This is aggressive** but not unreasonable for a multi-neighborhood / multi-metro expansion.

### 7.3 The lifetime assumption stress

§5.3 acknowledges: "9-month avg merchant lifetime needs Pilot cohort validation before external use." Audit 05 Q3 flags this as high-risk.

**If actual lifetime = 6 months** (Risk #6 in Appendix C, labeled High likelihood):
- Steady-state churn = 1/6 = 16.7%
- To hold 600 at M36: gross = 100/mo
- Required ramp from M24's 33/mo (at 6-month lifetime) to 100/mo = 3× — still achievable, but the revenue forecast compresses:
  - LTV = 6 × $706 = $4,236 (vs $6,354 at 9 months)
  - LTV/CAC = $4,236 / $420 = 10.1x (vs 15.1x) — still clears 3x floor
- **MRR math unchanged** — steady-state MRR depends on net merchant count × MRR/merchant, which is the spec's §5.1 number. Only LTV compresses.

### 7.4 Two-metro acquisition stress

At M36, 600 merchants across 2 metros = 300/metro (assuming even split). NYC-dense at M24 = 200 merchants across 8 neighborhoods = 25/neighborhood. Second metro adding 300 merchants in 12 months (M24 → M36) requires first-metro-like density in the second metro by M36 — the spec's §12.3 secondary-metro gate (M24→M30) and §12.4 multi-metro gate (M30→M36) provide some control, but the 12-month ramp from "0 merchants" (M24) to "300 merchants" in a brand-new metro with zero creator density is NOT internally supported by the spec's own secondary-metro activation lag commentary (§6.2: "LA and Miami each need 6–9 months of build-up before neighborhood-density economics work").

**Verdict:** the M36 600-merchant figure is achievable IF the company actually starts secondary-metro build at M24. But §3.1 shows the secondary metro first neighborhood at M30 — leaving only 6 months (M30 → M36) to ramp 300 merchants in the second metro. That is **implausibly fast** given the spec's own 6–9 month build-up acknowledgment.

**Corrected realistic pace:** at M36, expect ~400 merchants (NYC 200 + 2nd metro 150 + LOI pipeline 50), not 600. Under the spec's §5.2 per-merchant MRR of $1,500, M36 MRR = $600K / ARR = $7.2M. The $10M ARR threshold slips to **M42**.

---

## §8. Missing Scenarios — ≥3 Combinations Not Covered

### 8.1 Low SLR × High Campaigns/mo

What if AutoVerification coverage stalls (ConversionOracle v2 precision stuck at 82%; SLR crushes to 18), AND merchants run higher campaigns/mo than base (say 1.5/mo)? Both §10.3 Bear (low campaigns) and §10.1 Bull (high campaigns) are modeled, but not the diagonal: low-SLR × high-campaigns. This is the worst realistic case for ops burnout.

At 600 merchants × 1.5 camp/mo / SLR 18 = 50 ops FTE at M36 = $6M/yr ops alone. The company is labor-bound AND over-demanded simultaneously.

### 8.2 High retention × Low Pilot→Paid

Retention > 12 months but Pilot→Paid = 25%. If merchants who DO sign stay 12+ months but only 25% of pilots convert, the economic story is: LTV is high (12 × $706 = $8,472) and LTV/CAC is 20x+ even in Conservative, but the acquisition funnel is narrow — 10 pilots/neighborhood yields only 2.5 converts, capping growth rate. The spec's §11.2 heat map shows the LTV/CAC cell but doesn't comment on growth-rate implications.

### 8.3 Pricing-reopen scenario

conversion-assumption-v1 §4 decision threshold for <25% Pilot→Paid triggers "consider alternative model (lower floor + higher per-customer; or true per-customer only with zero floor)." If pricing restructures to $300 floor + $35 Coffee+ per-customer, per-merchant M12 MRR = $300 + 20 × $35 = $1,000 (identical blended). M36 at 40 customers/mo = $300 + $1,400 = $1,700 — 13% HIGHER than the spec's $1,500. Merchant churn may drop (lower floor = less monthly pain). **The spec does not model this pricing-pivot contingency at all.** It's a live option per push-pricing §9 Exp #2.

### 8.4 Creator supply shortfall — T4+ promotion bottleneck

Spec §6.3 assumes 150 T4 + 40 T5 + 10 T6 at M36 (200 retainer-earning creators). If T3→T4 promotion rate is lower than modeled (e.g., only 50 T4 at M36 because Push Score ≥ 70 is a higher bar than anticipated), then retainer load drops to 50 × $800 + 10 × $1,800 + 0 × $3,500 = $58K/mo = $696K/yr = **6.4% of ARR**. That's GOOD for margin but BAD for merchant outcome — fewer retainer-guaranteed creators means less reliable campaign delivery. Spec doesn't model the trade-off.

### 8.5 ConversionOracle v3 partial delivery

Bull (v3 at M30), Base (v3 at M36), Bear (v3 past M42) are modeled. But what if v3 ships at M36 but at only 88% precision instead of 92%? SLR lands at 35 (between 25 and 50), not 50. M48 ops FTE = 1,000/35 = 28 — the $10M ARR narrative holds but margin compresses. This intermediate case isn't modeled.

### 8.6 Seasonal surge in campaigns/mo

If campaigns/mo spikes 1.8× in Nov/Dec (holiday season) across 600 merchants at M36, active campaigns = 1,080. At SLR 25, ops FTE = 43 (a 19-FTE surge). Either hire temp ops or let SLR crash to ~14. Neither option is modeled.

---

## §9. Findings Table (≥15 rows)

| # | Finding | Severity | Location | Fix effort | Priority |
|---|---|---|---|---|---|
| F-1 | Per-merchant M12 MRR = $1,000 drifts 62% from SoT row 51's $2,620; no disclosure of customer-volume de-rating (20 vs 85) | High | §5.1, §5.2 | 30 min (add clarification para to §5.2) | **P0** |
| F-2 | §3.1 M12 = 25 merchants composition (pilot+Beachhead) not disclosed; conversion-assumption-v1 §13 "fix" is ALSO wrong | High | §3.1 | 1 hr (add §3.1 composition table + reconcile with conversion spec) | **P0** |
| F-3 | Bull case 1.5 camp/mo does not recompute pace table; §10.1 ops FTE at M36 is arithmetically inconsistent with its own assumptions | High | §10.1 | 2 hrs (recompute Bull pace + FTE) | **P0** |
| F-4 | Bear case 0.6 camp/mo does not recompute pace table; §10.3 ops FTE at M36 claims 24 but arithmetic yields 16.4 | High | §10.3 | 1 hr (recompute Bear pace) | **P0** |
| F-5 | §3.3 gate thresholds conflict with §12 gate thresholds (SLR: ≥25 vs ≥35 for M30→M36; precision: 90% vs 85% for M24→M30) | High | §3.3 vs §12 | 1 hr (pick one set, update both) | **P0** |
| F-6 | M36 vs M48 for $10M ARR threshold is inconsistent across §1.3, §4.1, §5.1, §7.5 | Medium | Multiple §§ | 15 min (search/replace to M36) | P1 |
| F-7 | §5.1 M36 forecast of 300 merchants in 2nd metro (M24→M36 window) contradicts §6.2 "LA/Miami 6–9 mo build-up" constraint; pace too aggressive | High | §5.1, §6.2 | 2 hrs (revise §5.1 downward or push $10M to M42) | **P0** |
| F-8 | §10 Bull/Base/Bear probability weights (30/50/20) not justified; proxy evidence in conversion-assumption-v1 §2.2 implies 20/60/20 | Medium | §10 | 30 min (add rationale + note methodology gap) | P1 |
| F-9 | §6.3 T6 count 10 at M36 likely infeasible given tenure req ≥ 12 months; first T5 grants not yet happening | Medium | §6.3 | 30 min (add T6 ramp caveat) | P2 |
| F-10 | §6.3 retainer load does not include per-verified-customer creator payouts for T4–T6; excludes ~$600K/yr | Medium | §6.3 | 15 min (clarify retainer-only scope) | P2 |
| F-11 | Ops FTE cost $120K fully-loaded not in SoT; spec cites it 3× without reconciliation | Low | §1.1, §2.2, Appendix A | 15 min (add to SoT) | P2 |
| F-12 | §12.5 Series A gate "$1M+ ARR trailing 12" ≠ §4.1 "$2.88M ARR at Series A raise"; threshold ambiguity | Medium | §12.5 vs §4.1 | 15 min (reconcile: trailing ARR vs run-rate ARR) | P1 |
| F-13 | §3.1 "5 neighborhoods at M12" — push-gtm Launch Philosophy says "one ZIP code"; spec's 5-neighborhood Williamsburg expansion not grounded in gtm pace | Medium | §3.1, push-gtm | 30 min (revise §3.1 to "1 neighborhood dense expansion" and update gtm) | P1 |
| F-14 | §5.2 "blended per-customer rate stays at $25 across merchant base" — §5.2 note acknowledges category-mix shift would raise it; no scenario modeled | Low | §5.2 | 30 min (add upside scenario table) | P2 |
| F-15 | §8.5 kill criterion triggers only at ">2 campaigns/mo" — §10.3 Bear at 0.6 is already a significant departure; lower-bound kill criterion missing | Medium | §8.5 | 15 min (add symmetric lower-bound trigger) | P1 |
| F-16 | No scenario modeled for pricing-pivot contingency per conversion-assumption-v1 §4 threshold trigger | Medium | §10 | 2 hrs (add 4th scenario: pricing pivot) | P1 |
| F-17 | No scenario modeled for seasonal surge in campaigns/mo (holiday Nov/Dec) | Low | §10, §12 | 1 hr (add seasonal note) | P2 |
| F-18 | §10.1 Bull LTV $9,500 calculation shown but "retention factor" undefined | Low | §10.1 | 15 min (show retention factor explicitly) | P2 |
| F-19 | Risk register Appendix C #10 ("MRR ramp fails to reach $1,500 by M36") has no trigger or specific remediation plan | Low | Appendix C | 15 min (add trigger date + action) | P2 |
| F-20 | §12.6 "Four gaps total; 3 of 4 are unbuildable until ConversionOracle v2 ships" — circular dependency on ML delivery not flagged as top risk | Medium | §12.6 | 30 min (promote to Appendix C top-3 risks) | P1 |

---

## §10. Recommendations — Downstream Skill File Updates

### 10.1 Highest priority (must gate before founder sign-off)

1. **`docs/spec/expansion-math-v1.md` §5.1 itself** — fix F-1 (SoT drift disclosure) and F-2 (pilot+Beachhead composition) before any downstream file is updated. These are spec-internal gaps; fixing them first prevents cascading errors.

2. **`docs/v5_2_status/numeric_reconciliation.md`** — add proposed rows 113–124 per §7.2, BUT with the caveat that M12 MRR should reflect the spec's §5.2 customer-volume de-rating (e.g., row for "Blended per-merchant M12 MRR (cohort-weighted average during ramp)" separately from existing row 51 "Per-merchant Month 12 revenue (Coffee+) = $2,620"). Without this separation, the new rows will drift from the existing row 51 and create another I-series reconciliation issue.

3. **`docs/spec/conversion-assumption-v1.md` §13** — amend the "cross-spec contradiction" bullet. The claim "M12 MRR $25K vs $15K disagreement" is arithmetically imprecise. Replace with: "Expansion-math v1 §3.1 assumes 25 M12 merchants composed of (Pilot converts) + (direct Beachhead) — this composition is indirect but not arithmetically contradicted by conversion-assumption §3. The real coupling is on Beachhead acquisition velocity as a function of Pilot→Paid signal strength; see expansion-math §10.3 Bear case."

### 10.2 High priority (before any external investor conversation)

4. **`.claude/skills/push-gtm/SKILL.md`** Expansion Triggers — update to add SLR-anchored gate thresholds per expansion-math §3.3, BUT FIRST resolve F-5 (§3.3 vs §12 threshold conflict). Don't propagate inconsistency downstream.

5. **`.claude/skills/push-metrics/SKILL.md`** §1.1 Definitions — append "1.0 campaign/mo/merchant steady state" assumption per §9.2 change 4. Low risk; straightforward append.

6. **`.claude/skills/push-metrics/SKILL.md`** §6.4 Competitor Benchmarks — add the §9.4 benchmark calibration note. Low risk.

### 10.3 Medium priority

7. **`.claude/skills/push-pricing/SKILL.md`** §5 — cross-reference the expansion trajectory per §9.5. Blocked on resolving F-1 (M12 per-merchant MRR drift); should not be executed until §5.2 of expansion spec clarifies customer-volume cohort framing.

8. **`docs/v5_2_status/P1_rollup.md`** — add risk row per §9.7 change 9 and achievement per change 10. Low priority but valuable for traceability.

9. **`docs/v5_2_status/audits/05-investor-dry-run.md`** — all four changes (Q2, Q3, Q12, Q14, Q15) per §9.8 — BLOCKED on resolving F-3 and F-4 (Bull/Bear arithmetic). The Q12 claim "1 ops FTE at M12" is correct; the Q15 claim "Exit multiples re-anchored to $19.8M M48 ARR" should reference the corrected M42 if F-7 triggers a schedule slip.

### 10.4 Recommended founder decision gates

Before founder sign-off per §8:

- [ ] Resolve F-1 (SoT drift) — 30 min
- [ ] Resolve F-2 (pilot+Beachhead composition) — 1 hr
- [ ] Resolve F-3 + F-4 (Bull/Bear pace recomputation) — 3 hrs
- [ ] Resolve F-5 (§3.3 vs §12 threshold conflict) — 1 hr
- [ ] Resolve F-7 (secondary-metro pace vs §6.2 build-up constraint) — 2 hrs

Total blocking effort: **~7.5 hours of spec revision**. Acceptable pre-sign-off burden. After these fixes, the spec upgrades from **C+** to a defensible **B+** and can supersede v5.1 externally.

### 10.5 Single highest-priority action

Before anything downstream: **resolve F-1 (M12 per-merchant MRR drift from SoT).** A 62% delta between the spec's M12 number and the SoT's M12 number is the single most-likely artifact an external investor would catch when cross-referencing. Every downstream file update inherits this drift if not fixed first. Estimated time: 30 minutes of disclosure-para drafting in §5.2.

---

*End of audit. Auditor: numeric-methodology reviewer, Wave 3. Date: 2026-04-20. No spec modifications made.*
