# Wave 3 Fresh-Eyes Audit — `docs/spec/conversion-assumption-v1.md` (P2-6)

**Auditor stance:** Statistical-methodology auditor; data scientist on a16z diligence team evaluating pre-seed Pilot stress test for arithmetic rigor and investor defensibility.
**Target file:** `docs/spec/conversion-assumption-v1.md` (572 lines, DRAFT v1).
**Cross-specs read:** `docs/spec/expansion-math-v1.md` (P2-3, shares Pilot data), `docs/v5_2_status/investor-prep/pilot-demand-proof-plan.md`, `.claude/skills/push-pricing/SKILL.md` §5 + §9, `docs/v5_2_status/audits/05-investor-dry-run.md` Q3 + Q14.
**Date:** 2026-04-20.

---

## §Executive Summary

**Statistical rigor rating: C+.** The framework (proxy basis, scenario layering, recalibration calendar, RACI, leading-indicator hypothesis) is well-organized and ahead of typical pre-seed unit-economics work. But a **load-bearing arithmetic inconsistency** in the Model A LTV/CAC column undermines the headline numbers, and three statistical-methodology gaps weaken the investor narrative when a sharp diligence partner walks through the math:

**Top 3 methodology gaps:**

1. **Model A LTV/CAC values 10.4x / 6.5x / 3.9x are arithmetically inconsistent with the stated CAC = $420 definition** — at fixed $420 CAC, LTV/CAC should be **15.1x at every conversion rate**. The non-15.1x values are produced by an implicit formula (`15.1 × rate / 0.60`) that scales LTV per-pilot-invited while keeping CAC per-converted — a category error.
2. **Model A vs Model B framing is rhetorically defensible but methodologically weak.** Treating pilot subsidy as "product development" (Model A) when it is unambiguously cash spent to acquire merchants is a convention seed-stage decks rely on, but a Series-A diligence team will call it cosmetic. Model B is the right number.
3. **N=10 cohort with binary outcome cannot support an r ≥ 0.5 Pearson decision rule.** The 95% CI for r at N=10 is approximately ±0.55 — a sample r of 0.5 is not statistically distinguishable from r = 0 at conventional thresholds. The decision rule treats r = 0.5 as adoption-grade evidence; it is not.

The spec is a **B for framing and process discipline; C for arithmetic and statistical rigor.** Net C+. Fixable in one revision before any external use.

---

## §Stress-Test Arithmetic Check

### Model A — claimed values do not derive from the stated formula

Spec §3.1 fixes inputs: LTV = $706 × 9 = $6,354; CAC (Model A) = $420 sales+onboarding only; pilot cohort cost = $6,000.

Spec §3.3 table claims Model A LTV/CAC values at 60% / 40% / 25% / 15% = **15.1x / 10.4x / 6.5x / 3.9x**.

If CAC is fixed at $420 per converted merchant (the stated definition), then:

```
Model A LTV/CAC = $6,354 / $420 = 15.13x   AT EVERY CONVERSION RATE
```

The values 10.4x, 6.5x, 3.9x cannot arise from this formula. Reverse-engineering shows they satisfy:

```
spec_value ≈ 15.1 × (rate / 0.60)
  60% → 15.1 ✓
  40% → 15.1 × 0.667 = 10.07x ≈ 10.4x  (3% off, rounding)
  25% → 15.1 × 0.417 = 6.29x ≈ 6.5x
  15% → 15.1 × 0.250 = 3.78x ≈ 3.9x
```

This formula computes **per-pilot-merchant-invited expected LTV** divided by **per-converted-merchant CAC** — a category error. You cannot mix denominators. Either:
- Both per-converted: LTV/CAC = $6,354 / $420 = 15.1x at every rate (Model A as defined is rate-invariant).
- Both per-invited: LTV-per-invited = rate × $6,354; CAC-per-invited = $420 (since sales effort is spent on all 10 invited regardless of who converts). Then LTV/CAC = rate × 15.13. At 40% = 6.05x; 25% = 3.78x; 15% = 2.27x. Neither matches the spec.

**Appendix A formula confirms the bug:**

```
N3: =N2 * 0.706 * 9 / 420     # Model A LTV/CAC at final rate
   = rate × $6,354 / $420 = rate × 15.13
```

At rate = 60%, this gives 9.08x — not 15.1x. **Appendix A and §3.3 disagree with each other.** §3.3 uses one formula, Appendix A another, and neither produces the stated values cleanly.

### Model B — values check out cleanly

Model B CAC = $420 + (cohort_cost / # converted) = $420 + ($6,000 / converted_count):

| Rate | # converted | Pilot/converted | Model B CAC | LTV/CAC | Spec value | Check |
|---|---|---|---|---|---|---|
| 60% | 6 | $1,000 | $1,420 | $6,354/$1,420 = **4.475x** | 4.5x | ✓ |
| 40% | 4 | $1,500 | $1,920 | $6,354/$1,920 = **3.309x** | 3.3x | ✓ |
| 25% | 2.5 | $2,400 | $2,820 | $6,354/$2,820 = **2.253x** | 2.3x | ✓ |
| 15% | 1.5 | $4,000 | $4,420 | $6,354/$4,420 = **1.437x** | 1.4x | ✓ |

Model B is internally consistent.

### What the spec probably *meant* by Model A

The most charitable reading: §3.3 silently switched from "CAC = $420 fixed" to "Model A is the v5.1 baseline scaled for conversion-rate sensitivity in cohort terms" — but the column header still says "Model A CAC: $420." A diligence partner sees the contradiction in 30 seconds. **Either the column header definition is wrong or the values are wrong; both cannot stand.**

**Recommended fix:** Restate Model A as **constant 15.1x at every conversion rate** (because the CAC denominator is per-converted and conversion rate doesn't enter), then add a row for **"Effective LTV/CAC per pilot invited (10-merchant cohort basis)"** = rate × 15.1 = 15.1 / 9.1 / 6.1 / 3.8 / 2.3 with explicit "this denominator counts pilot effort spread over all invited merchants" annotation. Renaming clarifies the denominator switch.

---

## §Model A vs Model B Honest-Framing Critique

The spec's framing in §3.5: "Lead with Model A; provide Model B in the sensitivity appendix." This is **rhetorically standard for seed decks but not defensible to a sophisticated investor.**

### What's defensible about Model A

- v5.1 convention is documented (`numeric_reconciliation.md` row 57); consistent with how Toast and OpenTable communicated unit economics at seed.
- Pilot cost double-functions as ConversionOracle training-label generation (true product investment) — there is *some* fraction of pilot spend that is genuinely R&D.
- Headline 15.1x has anchored prior conversations; switching narrative mid-fundraise is costly.

### What's not defensible

- The spec's own §1.4 calls 60% an "aspirational baseline." If the conversion target is aspirational, then assuming away the cost-of-acquisition portion of pilot spend is double-aspirational.
- The "training-label generation" justification is asserted, not measured. The spec does not say what fraction of $6,000 is genuinely R&D vs. genuinely customer acquisition. A defensible split (e.g., 30% R&D / 70% CAC) would yield a hybrid CAC of $420 + ($6,000 × 0.7 / 6) = $420 + $700 = $1,120, giving LTV/CAC = 5.7x at 60% — between the two extremes.
- No public local-commerce SaaS treats first-cohort pilot spend as R&D in disclosed financials (Toast S-1 and Square 10-Q both classify acquisition spend as Sales & Marketing). Model A is a category outlier.
- Audit 05 Q14 already flagged this as a **C-grade** answer pre-spec. This spec does not raise the grade — it documents the same evasion in more words.

### Recommended honest framing

**Lead with Model B** (the conservative number). State 4.5x base / 3.3x moderate / 2.3x conservative / 1.4x pessimistic. Note that v5.1 historical convention used Model A and produced 15.1x; explain the shift. **A 4.5x LTV/CAC is still a healthy unit-economics story** — it clears the standard 3x VC bar and is consistent with how Toast and Shopify reported at comparable stage (both 4-7x at Series A). 15.1x is not necessary to win the round; it is *suspicious* to a sophisticated investor.

The §7.3 "What to NEVER say" list correctly forbids "Pilot cost doesn't count as CAC" — but §3.5 then leads with Model A (which does exactly that). **Internal contradiction.**

---

## §Leading-Indicator Hypothesis Critique (Week 2 Verified-Customer Count → Conversion)

### The hypothesis as stated

§5.5 / §11: "Merchants with ≥5 verified customers by Week 2 convert at ≥70%; <3 verified convert at ≤25%." Decision rule: **r ≥ 0.5 → adopt as primary signal.**

### Statistical reality check

For a binary outcome (conversion = 0/1) with N = 10, computing Pearson r between Week-2 count and conversion is mechanically valid (Pearson with one binary variable is equivalent to a point-biserial correlation), but the **statistical power is severely limited**.

**Fisher z-transformation 95% CI for r at N=10:**

```
Fisher z = 0.5 × ln((1+r) / (1-r))
SE(z)   = 1 / sqrt(N - 3) = 1 / sqrt(7) = 0.378
95% CI on z = z ± 1.96 × 0.378 = z ± 0.741
```

For an observed r = 0.5: z = 0.549; 95% CI on z = [-0.191, +1.290]; back-transformed CI on r = **[-0.189, +0.859]**.

**The CI includes zero.** A sample r of 0.5 at N=10 is *not statistically distinguishable from r = 0* at conventional thresholds. The decision rule "r ≥ 0.5 → adopt as primary signal" is asking the data to do work it cannot do.

### What r-thresholds *would* be meaningful at N=10

- r ≥ 0.63 — lower bound of 95% CI is ≥ 0 (statistically significant at α=0.05)
- r ≥ 0.78 — lower bound of 95% CI is ≥ 0.3 (meaningfully positive)
- r ≥ 0.85 — lower bound of 95% CI is ≥ 0.5 (strong signal)

### Recommended decision rule rewrite

```
r ≥ 0.78  → adopt as primary signal (lower 95% CI ≥ 0.3, meaningful)
0.5 ≤ r < 0.78 → use as soft directional signal; require N=20 cohort-2 confirmation
r < 0.5  → hypothesis rejected for cohort-1; design v2 indicator
```

The spec's existing soft-signal band (0.3 ≤ r ≤ 0.5) is roughly the right idea but misplaced — even the 0.5 threshold the spec uses for "adopt" is in fact the *soft* zone. **Promote both thresholds upward by ~0.25 to reflect N=10 reality.**

### The spec partially acknowledges this

§11 final paragraph notes "N=10 cohort is statistically thin; r-values should be reported with 95% confidence intervals (Fisher z-transformation)" — correctly. But the decision rule one paragraph above does not apply that caveat. **Internal contradiction.** Either the rule is stricter or the caveat is non-binding.

### A bucketed test would be more honest

The bucket analysis Appendix A proposes (≥5 vs 3-4 vs <3) is a 2x2 or 3x2 contingency. With N=10, even Fisher's exact test on the cleanest 2x2 (e.g., 5 merchants ≥5 verified all converted; 5 merchants <5 verified all declined) gives p = 0.008 — that *is* meaningful. But anything less clean than perfect separation falls below significance.

**Better hypothesis statement:** "If ≥4 of 5 merchants in the high-bucket convert AND ≤1 of 5 merchants in the low-bucket convert, treat as confirming evidence." This is a binary decision rule, not a Pearson r threshold.

---

## §Sample-Size Adequacy

### N=10 95% CI on the conversion rate itself

For a single proportion with N=10, the Wilson score 95% CI is:

| Observed conversion | 95% CI |
|---|---|
| 6/10 = 60% | [31%, 83%] |
| 4/10 = 40% | [17%, 69%] |
| 3/10 = 30% | [11%, 60%] |
| 2/10 = 20% | [6%, 51%] |

A 60% point estimate has a CI spanning 31% to 83% — **a ±26 percentage-point band.** The spec's recalibration thresholds (40% → moderate / 25% → conservative / 15% → pessimistic) are within one CI's width of each other. With N=10, the cohort cannot reliably distinguish "moderate" from "conservative" — the data is noise-bound.

### How investors should hear this

**Wrong framing (current §7.1):** "Actual rate will land by Week 12."
**Right framing:** "Cohort-1 will give a point estimate with a ±25-point CI. We will combine cohort-1 + cohort-2 (combined N=20) to get a ±18-point CI by Beachhead month 6."

The spec mentions cohort-2 in §B.3 ("repeat in Beachhead expansion window for a second cohort of 10. Combined N = 20") — correctly. But §7 investor-framing language uses singular cohort-1 as the deciding data point. **Promote the cohort-1+2 combined-sample story to §7.**

### Recommended addition to §7

> "Cohort-1 readout at Week 12 yields a point estimate with a ±25-point 95% CI at N=10. Cohort-2 (Beachhead merchants 11-20) combined gives N=20 and a ±18-point CI by Month 6. Anything tighter requires N≥40 (Beachhead full first wave). This is a small-sample observation phase; we will treat single-cohort outliers accordingly."

§12 FAQ #4 actually says "N=10 makes single-outlier risk material" — good. Move that honesty earlier into §7.

---

## §Recalibration Calendar Realism

### W4 / W8 / W12 cadence assessment

- **W4 EOW (~2026-06-15):** "Interim conversion intent" via Likert. Soft signal — appropriate for first signal but cannot bind a model update.
- **W8 EOW (~2026-07-13):** Actual signed Beachhead count *to-date*. Excludes merchants still deliberating.
- **W12 EOW (~2026-07-27):** "Final cohort rate after all 10 merchants have been offered conversion."

### The W12 closure assumption is too tight

The spec assumes all 10 merchants will have decided by W12. In practice:

- 2-3 of 10 merchants will be in **active deliberation** at W12 — small-business owners do not decide on $500/mo subscriptions to a calendar.
- 1-2 may be in **delayed decision** awaiting an internal event (next month's revenue, partner approval, holiday season clarity).
- The "industry benchmark is full pilot+30-day decision window" claim in §12 FAQ #7 is asserted without source.

**A defensible conversion measurement window for SMB SaaS pilots is pilot duration + 8 weeks, not + 4 weeks.** OpenTable's 2003-era pilots that the spec cites in §C.2 ran 30-60 days *plus* a 30-60 day decision window — a 60-120 day total decision arc, not 30 days as the spec implicitly assumes.

### Recommended W16 final point

Add **W16 EOW (~2026-08-24)** as the *true final* checkpoint. W12 becomes the "interim final" — the number used for investor communication, but flagged as still subject to late-decider revision. W16 captures merchants whose decision was deliberately deferred.

This adds 4 weeks to the recalibration calendar but materially reduces single-cohort measurement error from late-decider truncation bias.

### Trigger-2 in §6.2 is brittle

"Pilot Week 12 EOW: Final cohort rate. Revise financial model. Commit updated push-pricing §5." If 3 merchants are still deliberating at W12, committing the financial model is premature — a single late conversion (say, merchant 11 signing in W14) shifts the rate from 4/10 = 40% to 5/10 = 50%, crossing a decision threshold. **The model commit should be conditional on ≥80% of cohort having decided.**

---

## §Proxy-Data Validity

### The §C.7 synthesis claim

Spec concludes: "Realistic midpoint of the proxy-weighted distribution: 30-50%. Aligns with the 'aspirational baseline; expect moderate; tolerate conservative' framing."

§7.1 narrows this to: "industry proxies suggest 25-45% is realistic for a new category."

### Critique of the proxy-weighting

| Proxy | Spec range | Real-world critique |
|---|---|---|
| F&B SaaS 15-35% | Reasonable | Citation of "public reports / 10-K disclosures" is vague; Toast and Square don't break out trial-to-paid by tier in disclosures. Confidence should be Low-Medium, not Medium. |
| OpenTable 45-65% | "Estimated" | Spec marks Low confidence — correct. But §C.2 calls it "the most analogous proxy" and uses it to anchor the upper band. **One Low-confidence number cannot anchor a band.** |
| Square ~25% | "Public estimate" | Single point estimate without source. Cannot validate. |
| Vertical AI 30-45% | Industry conversation | Self-reported by interested parties; selection bias toward successful examples. |
| Local agency 50-70% | Industry norm | Genuinely the most relevant analogy (scoped engagement → retainer), but the conversion rate masks an aggressive selection effect — agency engagements that close to retainer were already pre-selected for fit. |
| B2B pilot 20-40% | PMM benchmarks | Most defensible single number; the modal industry range. |

### Honest synthesis

If you weight by source quality (Medium > Low) and remove the Low-confidence outlier (OpenTable):
- Modal range: **20-40%** (F&B SaaS + B2B pilot, both Medium confidence)
- Upper band (relationship-sale model): **40-55%** (vertical AI + local agency, both Low confidence — but two converging Lows are stronger than one Low)

**A defensible synthesis is: "Industry mode 20-40%; relationship-sale upper band 40-55%; 60% requires Push-specific tailwinds (pre-qualified LOI cohort, outcome-priced removes 'did it work?' friction)."**

The spec's "60% aspirational, 25-45% realistic" gets the realistic band roughly right but overweights the OpenTable upper band. **The realistic band is more defensibly 25-40%, not 25-45%.**

### Why 60% is more aspirational than the spec admits

- Williamsburg Coffee+ is one neighborhood, one category. Single-category pilots in B2B SaaS routinely exceed industry mode by 10-15 percentage points (selection effect). A 60% rate in cohort-1 may not generalize to the Beachhead cohort even if cohort-1 hits.
- The spec correctly notes (§2.3) "60% is optimistic vs industry norms" but then anchors the entire base case on 60%. **Internal tension between honest framing and operational planning.**

---

## §Investor-Framing Critique (§7.1 Take-Away Line)

The 3-sentence verbatim answer:

> "Today the 60% Pilot-to-Paid is an aspirational baseline, not data; industry proxies suggest 25-45% is realistic for a new category. Our model clears a 3x LTV/CAC bar at rates as low as 25% using Model A (v5.1 convention) and breaks below 3x only at the 15% pessimistic case — we'd catch that at Week 4 of Pilot and reset before scale. Actual rate will land by Week 12 of Pilot, week of 2026-07-27."

### What's strong

- Sentence 1: leads with "aspirational, not data" — the right disclosure pattern. Audit 05 Q3 weakness was hiding behind "industry average"; this spec does not repeat that error.
- Sentence 3: commits a specific date. Sophisticated investors track date-anchored commitments.

### What's weak

- **"Clears a 3x LTV/CAC bar at rates as low as 25% using Model A"** — given §3.3's arithmetic problem, this sentence contains a false implicit claim. At the literal "Model A CAC = $420" definition, the 25% rate yields the same 15.1x as the 60% rate (because CAC is fixed). The 6.5x value the sentence implicitly references comes from the broken Appendix-A-style formula. **A diligence quant will catch this.**
- **"We'd catch that at Week 4 of Pilot and reset before scale"** — Week 4 is interim Likert intent, not actual signed rate. §7.3 explicitly warns against this exact phrasing ("'We'll know by Week 4 of pilot.' (Week 4 is an interim signal only; final is Week 12.)"). The take-away line **violates its own §7.3 forbidden phrase list.**
- The Model A reference invites the Model B follow-up. Better to acknowledge Model B inline so the investor doesn't feel they're pulling teeth.

### One-phrase rewrite

Replace: *"Our model clears a 3x LTV/CAC bar at rates as low as 25% using Model A (v5.1 convention) and breaks below 3x only at the 15% pessimistic case — we'd catch that at Week 4 of Pilot and reset before scale."*

With: *"Even at a 25% rate on the all-in CAC view (pilot subsidy classified as acquisition), we land at 2.3x — below the 3x bar, but recoverable with one round of pricing iteration; on the v5.1 convention we hold 15x at every rate above zero. The 15% pessimistic case is the line where the unit-economics narrative fails, not the 25%; Pilot Week 8 actuals are the first hard signal of that risk."*

This (a) acknowledges Model B exists, (b) doesn't claim the broken Model-A-rate-sensitivity, (c) flags the right risk threshold, (d) commits to a real signal date (W8 actuals, not W4 Likert).

---

## §Missing Stress-Test Scenarios

The §3.3 four-scenario table only varies one input (conversion rate). Real diligence asks combinatorial scenarios. Three the spec misses:

### Scenario M1 — "Pilot converts, Beachhead churns Month 2"

Pilot-to-Beachhead = 60% (✓ base case). Beachhead Month-2 churn = 30% (vs. assumed 11% from 9-month lifetime). This is the Groupon failure mode that Audit 05 Q3 specifically flags. At 30% Month-2 churn:

- Effective lifetime = ~3.3 months instead of 9
- Effective LTV = $706 × 3.3 = $2,330 (instead of $6,354)
- Model A LTV/CAC = $2,330 / $420 = **5.5x** (still ok)
- Model B LTV/CAC = $2,330 / $1,420 = **1.6x** (below 3x bar)

**Model B fails the 3x bar even at the 60% conversion baseline if Month-2 churn is Groupon-realistic.** The spec's stress test does not catch this because it varies one variable at a time.

### Scenario M2 — "Pilot underdelivers, conversion subsidized by intervention cost"

§5 de-risking actions describe "pour additional creator capacity into lagging merchants." That intervention has a cost. If 3 of 10 merchants need 2x creator capacity in W3-W4 to convert, cohort cost rises from $6,000 to $7,800. At 60% conversion:

- Pilot/converted = $7,800 / 6 = $1,300 (not $1,000)
- Model B CAC = $420 + $1,300 = $1,720
- Model B LTV/CAC = $6,354 / $1,720 = **3.7x** (vs. spec's 4.5x)

The de-risking actions are unpriced. **Stress test should include intervention-cost-to-rescue-conversion as a variable.**

### Scenario M3 — "60% conversion but per-customer rate compresses to defend"

If the spec hits 60% conversion but only because Beachhead pricing was negotiated down from $25/customer to $18/customer for the first 6 converters, then:

- Per-merchant revenue = $500 + 85 × $18 = $2,030 (not $2,620)
- Per-merchant GM compresses (assuming COGS roughly stable) from $706 to ~$420
- LTV = $420 × 9 = $3,780 (not $6,354)
- Model A LTV/CAC = $3,780 / $420 = **9.0x**
- Model B LTV/CAC = $3,780 / $1,420 = **2.7x** (below 3x bar)

**Pricing-concession-to-hit-conversion-target is a known pre-seed pattern.** §5.1 mandates the conversion-path clause is initialed at Pilot Week 1 — that mitigates this risk but doesn't eliminate it (post-pilot price negotiation is still possible).

### Other combinations worth modeling

- **M4:** 25% conversion + W12 closure incomplete (only 7 of 10 decided) — what does interim rate look like and how do you communicate?
- **M5:** Cohort-1 hits 60% but cohort-2 (Beachhead 11-20) hits 30%. Is cohort-1 the outlier or cohort-2?
- **M6:** Conversion rate good but creator supply throttles cohort-2 launch — does the model still work if creator delivery lags?

---

## §Findings Table

| # | Section | Issue | Severity | Recommended Fix |
|---|---------|-------|----------|-----------------|
| F1 | §3.3 + Appendix A | Model A LTV/CAC values 10.4x / 6.5x / 3.9x are inconsistent with stated CAC = $420 fixed definition. At constant CAC, LTV/CAC = 15.1x at every rate. Implicit formula (`15.1 × rate / 0.60`) mixes per-converted and per-invited denominators. | **HIGH** | Restate Model A as constant 15.1x with conversion-rate-invariant CAC. Add separate "per-pilot-invited cohort LTV/CAC" row with explicit denominator. |
| F2 | §3.3 vs Appendix A | Two formulas for the same metric: §3.3 yields 15.1/10.4/6.5/3.9; Appendix A `=N2*0.706*9/420` yields 9.08/6.05/3.78/2.27. Internal contradiction. | **HIGH** | Pick one canonical formula. Document derivation. Verify against numeric_reconciliation.md. |
| F3 | §3.5 + §7.1 | Lead-with-Model-A framing is a C-grade investor evasion that audit 05 Q14 already flagged. Model B is the right number. | **HIGH** | Lead with Model B (4.5x base) which still beats the 3x bar. Restructure §7.1 take-away. |
| F4 | §5.5 + §11 | r ≥ 0.5 decision threshold is below statistical significance at N=10. Fisher z 95% CI for r=0.5 at N=10 is approximately [-0.19, +0.86] — includes zero. | **HIGH** | Raise threshold to r ≥ 0.78 for "adopt as primary"; r ≥ 0.5 becomes "directional only, requires N=20 confirmation." |
| F5 | §11 final paragraph vs §11 decision rule | Spec acknowledges N=10 statistical thinness in caveat then ignores it in decision rule. | MED | Apply the caveat to the rule. Either the rule is stricter or the caveat is non-binding — current state is incoherent. |
| F6 | §4 Recalibration | W12 EOW assumes all 10 merchants decided. Realistic SMB SaaS decision arc is pilot+8 weeks (W12), not pilot+4 weeks. Late-decider truncation bias. | MED | Add W16 (~2026-08-24) as true final checkpoint. W12 becomes "interim final" subject to revision. |
| F7 | §6.2 Trigger 2 | Financial model commit at W12 is brittle if 3 of 10 merchants still deliberating. Single late conversion shifts rate across decision threshold. | MED | Make commit conditional on ≥80% of cohort having decided. Otherwise wait for W16. |
| F8 | §C.7 + §7.1 | Proxy synthesis "25-45% realistic" overweights OpenTable Low-confidence upper band. Defensible band is 25-40%. | MED | Restate as 25-40% modal; 40-55% relationship-sale upper band; 60% requires Push-specific tailwinds. |
| F9 | §3.3 | Stress test varies only one input (conversion rate). Misses combinatorial scenarios (conversion × Month-2 churn; conversion × intervention cost; conversion × pricing concession). | MED | Add §3.6 with at least 3 combinatorial stress tests (M1-M3 in this audit). |
| F10 | §7.1 take-away line | Phrase "we'd catch that at Week 4 of Pilot" violates §7.3 forbidden-phrase list ("Week 4 is interim only; final is Week 12"). | MED | Rewrite to reference W8 actuals (first hard signal) not W4 Likert. |
| F11 | §7.1 sentence 2 | "Clears a 3x LTV/CAC bar at rates as low as 25% using Model A" — contains an arithmetic claim that derives from the broken §3.3 formula. A diligence quant will catch this. | **HIGH** | Drop the claim or rewrite once Model A arithmetic is fixed. |
| F12 | §1.4 vs §3.5 | §1.4 says label as "aspirational baseline" externally; §3.5 says "lead with base 15.1x" externally. Two inconsistent investor-framing instructions. | MED | Reconcile. Recommend §1.4 wins (lead with sensitivity, not base). |
| F13 | §2.1 Proxy table | Confidence levels assigned without inter-source weighting. Two Low-confidence proxies aggregated as if equal to one Medium-confidence. | LOW | Add explicit weighting in §C.7 synthesis. |
| F14 | §3.1 Shared inputs | "Average merchant lifetime: 9 months" is asserted without sensitivity. The conversion stress test holds lifetime fixed; in reality, conversion and lifetime are correlated (better-fit merchants both convert and stay longer). | MED | Add joint-sensitivity table varying conversion AND lifetime. Cross-ref pilot-demand-proof-plan.md §Stress test of 9-month lifetime. |
| F15 | §3.1 | Pilot subsidy of "$150/merchant/week × 4 weeks × 10" = $6,000 is asserted without breakdown. Creator payouts at $5-15/customer × 5-15 customers/merchant could be $250-$2,250 per merchant alone. | LOW | Provide line-item: creator payouts + verification cost + ops time, with a +/- range. $6,000 may understate. |
| F16 | §B.4 Confounders | Three confounders listed (category, density, creator quality) but no plan to control for them at N=10 (sample insufficient for stratification). | MED | Acknowledge that with N=10, confounder control is impossible. Defer to cohort-2 or pooled cohort-1+2 analysis. |
| F17 | §13 Cross-spec contradiction | Self-acknowledged contradiction with expansion-math-v1 §3 (M12 ARR assumes 100% Pilot→Paid). Wave 4 must reconcile. | MED | Already flagged by spec author (good). Verify Wave 4 owner accepts. |
| F18 | §12 FAQ #4 | Acknowledges "N=10 makes single-outlier risk material" — correct, but moved to FAQ. Investor-facing §7 should surface this prominently. | LOW | Promote to §7. |

---

## §Cross-Spec Inconsistencies

1. **M12 MRR contradiction with expansion-math-v1.** This spec's §13 calls it out — expansion-math-v1 §5 assumes 25 merchants × $1,000 = $25K MRR at 100% Pilot→Paid; this spec's stress test models 60% as base. At 60% conversion, M12 MRR is closer to $15K. Wave 4 must reconcile.

2. **CAC definition contradiction with pilot-demand-proof-plan.md.** That doc treats CAC = $420 in the lifetime sensitivity table without splitting Model A vs Model B. This spec introduces Model B; the proof-plan doc has not been updated. Both will be read by the same investor.

3. **W4 readout language contradiction with audit 05 Q14 + pilot-demand-proof-plan.md.** Pilot-demand-proof-plan §What we will show says "Week 4 readout takes Q3 from C to A." This spec §6.2 + §7.3 says "Week 4 is interim signal only; not the answer." Investor will hear both. Resolve which is canonical.

---

*End of audit. Recommend Wave 4 reconciliation address F1, F2, F3, F4, F11 (all HIGH) before any external pitch quotes a value from §3.3 or §7.1.*
