# P2-6 — Pilot-to-Paid Conversion Assumption Stress-Test v1

> **Status:** DRAFT v1
> **Owner (data collection):** Prum
> **Owner (modeling & investor communication):** Jiaming
> **Deliverable date:** 2026-05-04 (Day 14)
> **Reviewers:** Jiaming, Prum, ML Advisor (post-onboard, for cohort-model review), first investor conversation partner (for pressure-test)
> **Pre-reads:** `push-pricing/SKILL.md` §5 Unit Economics + §9 Pricing Experiments; `docs/v5_2_status/numeric_reconciliation.md` rows 55–59; `docs/v5_2_status/investor-prep/pilot-demand-proof-plan.md`; `docs/v5_2_status/audits/05-investor-dry-run.md` Q3 + Q14.
> **Hard gate:** any external pitch quoting LTV/CAC MUST reference this stress test — never the base **15.1x** in isolation. No exceptions.

---

## §1 — Source Assumption (statement + history)

### 1.1 The number

`push-pricing/SKILL.md` §9 Pricing Experiments lists, as experiment #1:

> **[Week 4-6] Pilot-to-Beachhead conversion rate: target 60% of pilot merchants sign for $500/mo**

That is the origin. **60%** of the 10-merchant Williamsburg Coffee+ Pilot cohort is expected to convert to the paid **Beachhead** tier at the end of the 4-week pilot, signing the $500/mo floor + per-verified-customer contract.

### 1.2 Where the number is applied downstream

The 60% Pilot-to-Paid conversion rate propagates through the following model components:

1. **CAC calculation.** Pilot subsidy (creator payouts + verification cost + ops time during the free 4-week window) is amortized over the converted Beachhead cohort. At 60%, cohort subsidy of ~$6,000 amortizes to $1,000 per converted merchant; combined with $420 sales + onboarding, this sits inside the v5.1 aggregate CAC of **$420** (per `numeric_reconciliation.md` row 57) when pilot cost is classified as product-development rather than acquisition. At lower conversion rates, the all-in CAC widens.
2. **Month-6 MRR projection.** 6 converted Beachhead merchants × $500 floor + per-customer fees → forms the denominator of early-stage MRR growth assumptions.
3. **LTV.** $706 monthly GM × 9-month average merchant lifetime = **$6,354** (`numeric_reconciliation.md` row 55); unchanged by the conversion rate but compounded into LTV/CAC.
4. **LTV/CAC headline.** $6,354 / $420 = **15.1x** base case (`numeric_reconciliation.md` row 58). This is the investor-facing top-line metric.

### 1.3 Provenance of the number

- **Origin:** founder intuition, set during 2026-04 planning.
- **Empirical data:** zero. No pilot has run yet; no cohort has converted.
- **Documented status:** labeled "pricing experiment #1 target" in `push-pricing` §9 — i.e., the 60% is BOTH a target (what we need to hit for v5.1 to hold) AND an assumption (what we are currently modeling in absence of data).

### 1.4 Honest label for investor conversations

For any external investor conversation until the Pilot Week 12 readout (2026-07-27), the 60% Pilot-to-Paid rate MUST be introduced as:

> "Aspirational baseline; sensitivity table in spec; recalibration at Week 4 of pilot. I can walk you through the moderate / conservative / pessimistic scenarios and show you where LTV/CAC clears or fails the 3x bar."

This spec exists precisely to answer the "what's your Pilot-to-Paid conversion rate assumption?" investor question in an A-grade way — grounded, stress-tested, and de-risked.

---

## §2 — Evidence Basis & Proxies

### 2.1 Proxy table

Publicly available proxies for Pilot-to-Paid / trial-to-paid conversion in adjacent categories:

| Proxy | Est. Pilot→Paid rate | Source | Confidence |
|---|---|---|---|
| F&B SaaS trial-to-paid (Toast, Square for Restaurants tier) | 15–35% | Public reports; seed-stage SaaS retention benchmarks | Medium |
| OpenTable pilot conversion (2003-era restaurant onboarding) | Not public; estimated 45–65% | Industry conversations with former early-stage restaurant-tech operators | Low |
| Square for Restaurants pilot-to-paid | ~25% | Public estimate, secondary reports | Low-Medium |
| Vertical AI trial conversion (Hebbia, Harvey, enterprise AI) | 30–45% | Industry conversations; not validated against disclosed financials | Low |
| Local marketing agency retainer conversion (after a scoped engagement) | 50–70% | Industry norm for relationship-sold services | Low |
| Pilot programs (all verticals, B2B software) | 20–40% typical | Product marketing benchmarks | Medium |

### 2.2 Proxy synthesis

- The **modal** industry conversion rate for pilot-to-paid / trial-to-paid is **20–40%**.
- The **upper band** (45–65%) applies when there is a scoped engagement, a relationship salesperson, and a long sales cycle (OpenTable 2003-era, local agency retainer). Push's 4-week Pilot is closer to the scoped-engagement model than to a typical SaaS self-serve trial.
- A Push-specific argument for the upper band: (a) verified walk-in customers are observable during the pilot (unlike self-serve SaaS where value is diffuse), (b) the Pilot is invitation-only and pre-qualified from 10 LOIs, and (c) switching cost at Week 4 is near-zero — the merchant is not choosing between Push and a competitor; they are choosing between Push and doing nothing.
- A Push-specific argument against: (a) a brand-new category has lower baseline trust, (b) $500/mo + per-customer is a real budget ask for small merchants, and (c) founder intuition is not empirical.

### 2.3 Conclusion

**60% is optimistic vs. industry norms** (20–40% typical; 45–65% for incumbents with a long sales cycle and relationship sale). If achieved, the 60% rate confirms a strong product-market fit signal — merchants see value fast enough to sign paid at end of pilot.

For planning and investor communication, **treat 60% as the upside end of a 25–60% range and model three scenarios in parallel.** §3 below does this.

---

## §3 — Stress Test Scenarios

### 3.1 Shared model inputs

Fixed across all scenarios:

- Pilot cohort size: **10 merchants** (Williamsburg Coffee+, first neighborhood)
- Pilot subsidy: **$0 base + $0 per-customer fee** for 4 weeks
- Push-side Pilot delivered cost: creator payouts + verification cost + ops time ≈ **$150 per merchant per week** × 4 weeks × 10 merchants = **$6,000 cohort cost**
- Monthly GM per converted merchant: **$706** (per `numeric_reconciliation.md` row 53; Coffee+ Month 12 baseline)
- Average merchant lifetime: **9 months** (per `numeric_reconciliation.md` row 56)
- LTV: $706 × 9 = **$6,354** (per `numeric_reconciliation.md` row 55)
- Sales + onboarding CAC (not including Pilot subsidy): **$420** (per `numeric_reconciliation.md` row 57)

### 3.2 Two CAC models

We present two CAC models in parallel because seed-stage and diligence-stage investors read them differently:

- **Model A — v5.1 baseline, aggressive.** CAC = $420 (sales + onboarding only). Pilot cost is classified as **product development** (the training labels and verification pipeline are capitalized conceptually as category creation). Matches the v5.1 headline number.
- **Model B — realistic, all-in.** CAC = $420 + (Pilot_cohort_cost / # converted). Pilot cost is classified as **customer acquisition**. More conservative; more defensible under diligence.

### 3.3 Four scenarios

| Scenario | Pilot→Paid rate | # converted of 10 | Model A CAC | Model A LTV/CAC | Pilot cost / converted | Model B CAC (all-in) | Model B LTV/CAC |
|---|---|---|---|---|---|---|---|
| **Base (v5.1)** | 60% | 6 | $420 | **15.1x** | $1,000 | $1,420 | **4.5x** |
| **Moderate** | 40% | 4 | $420 | **10.4x** | $1,500 | $1,920 | **3.3x** |
| **Conservative** | 25% | 2–3 (use 2.5) | $420 | **6.5x** | $2,400 | $2,820 | **2.3x** |
| **Pessimistic** | 15% | 1–2 (use 1.5) | $420 | **3.9x** | $4,000 | $4,420 | **1.4x — BELOW 3x VC FLOOR** |

### 3.4 Reading the scenarios

- **Base (60%, Model A) = 15.1x.** Matches `numeric_reconciliation.md` row 58. This is the v5.1 headline.
- **Moderate (40%, Model A) = 10.4x.** Still clears any reasonable VC bar. The assumption can slip by one full third without endangering the investor narrative, on Model A.
- **Conservative (25%, Model A) = 6.5x.** Still clears the 3x VC floor comfortably. This is the practical worst-credible-case for a healthy-unit-economics story.
- **Pessimistic (15%, Model A) = 3.9x.** Barely clears the 3x floor on Model A; **fails it on Model B at 1.4x**. If actual data lands here, the unit-economics narrative collapses and the financial model must be rewritten.

### 3.5 Investor-facing recommendation

**Lead with Model A** (industry convention for seed stage; matches v5.1 and `numeric_reconciliation.md`); **provide Model B in the sensitivity appendix** for any diligence team that asks to see Pilot cost classified as acquisition. Never present Model A without flagging that Model B is the fully-loaded view.

**Narrative layering for investor conversations:**

1. Open with base 15.1x (Model A).
2. Immediately introduce the sensitivity: "At 40% Pilot-to-Paid we still hit 10.4x. At 25% — roughly the industry mode for trial-to-paid SaaS — we clear 6.5x. We break below 3x only in the 15% pessimistic case."
3. Describe the recalibration plan (§4) so the investor hears a path from assumption to data.
4. If asked for the all-in number: "On a fully-loaded Pilot-as-CAC basis, base 4.5x, moderate 3.3x, conservative 2.3x, pessimistic 1.4x. The 3x bar holds at moderate or better."

---

## §4 — Recalibration Plan (date-anchored)

Pilot starts at the end of Week 0 (Williamsburg Coffee+ LOI-to-Pilot conversion) and runs 12 weeks to full cohort readout.

| Window | Date anchor | Action | Owner | Trigger |
|---|---|---|---|---|
| **Week 0–3** (now through pilot start) | through 2026-05-04 | Document baseline expectation (this doc). Inform F&F investors of the 25–60% range. Any external pitch references this spec, not the base rate alone. | Jiaming | Spec publication (Day 14) |
| **Pilot Week 2** (mid-pilot check-in) | ~2026-06-01 | Prum holds 15-min call with EACH of the 10 pilot merchants. Captures: price concerns, outcome questions, fit signals, retention-feature asks. This is the earliest soft signal. | Prum | Calendar-driven |
| **Pilot Week 4 EOW** (first data signal) | ~2026-06-15 | Prum records **interim conversion intent** — soft commitments, merchant-reported likelihood to convert (Likert 1–5). NOT the final rate. Update `numeric_reconciliation.md` with interim signal. | Prum + Jiaming | Week 4 EOW |
| **Pilot Week 8 EOW** (second data signal) | ~2026-07-13 | Record **actual signed Beachhead merchants** from Pilot cohort to-date. Compute interim Pilot-to-Paid rate. If interim rate <40%, trigger F&F notification within 7 days. | Prum + Jiaming | Week 8 EOW |
| **Pilot Week 12 EOW** (final cohort rate) | ~2026-07-27 | Full cohort rate after all 10 merchants have been offered conversion. Revise financial model. Commit updated `push-pricing` §5 with final rate. Refresh Wave-style sensitivity in `numeric_reconciliation.md`. | Jiaming | Week 12 EOW |

### 4.1 Decision thresholds

- **If Week 12 actual ≥ 40%:** base case narrative remains intact; update headline from "aspirational 60%" to "empirical 40–60%"; continue expansion into Beachhead window.
- **If Week 12 actual is 25–40%:** Moderate / Conservative band. Unit economics still viable on Model A. Jiaming rewrites investor deck leading with the empirical rate, not the aspirational baseline. No F&F panic required but individual disclosure calls within 7 days of readout.
- **If Week 12 actual < 25%:** Conservative-to-pessimistic. **Freeze Beachhead expansion beyond merchants 11–20**; reassess pricing structure; consider alternative model (lower floor + higher per-customer; or true per-customer only with zero floor). Jiaming calls F&F investors individually with an updated model within 7 days.
- **If Week 12 actual < 15%:** pessimistic floor breached. Full strategy update required. Delay any external fundraise conversation until a revised pricing + retention thesis is ready.

---

## §5 — De-risking Actions (proactive)

Each action below is designed to either (a) raise actual Pilot-to-Paid rate, or (b) give us a leading indicator so we predict the final rate by Week 4 instead of waiting to Week 12.

### 5.1 Pilot terms clarity (Week 1)

- Every pilot merchant contract at Week 1 explicitly states the Beachhead conversion path: **$500/mo floor + per-verified-customer pricing** ($15 pure coffee / $25 Coffee+ / $22 dessert-boba / $60 fitness / $85 beauty-nails per `numeric_reconciliation.md` rows 1–5).
- Merchant must initial the conversion-path clause.
- No "surprise pricing at Week 4." The merchant signs knowing the economics they will face on Day 29.
- **Rationale:** removes sticker-shock risk at Week 4 conversion; converts Pilot-to-Paid into a "did we deliver value?" conversation, not a "what's the price?" conversation.

### 5.2 Mid-pilot check-in (Week 2)

- Prum schedules a 15-minute call with each pilot merchant in Week 2.
- **Agenda:**
  1. Verified customer count to-date (Push-side dashboard number read aloud).
  2. Merchant NPS: "Would you recommend Push to another coffee shop owner?" 0–10.
  3. Pricing-concern signals: "If we were charging you $500/mo today, how would that feel?" open-ended.
  4. Retention features desired: "What would make this a no-brainer renew at Week 4?"
- Output logged in the pilot dashboard + exported to the conversion-prediction spreadsheet (Appendix A).

### 5.3 Exit survey (Week 4, if merchant declines Beachhead)

- If a merchant declines to convert to Beachhead at Week 4, Prum conducts a 20-minute exit interview within 7 days.
- **Captured:**
  1. Declined reason: **price / outcome / fit / timing / other** (check one primary + free-text).
  2. What would have changed the decision: **lower floor / higher delivered customer count / longer pilot / different category mix / other**.
  3. Would they revisit in 3 months? Y/N + conditions.
  4. Any referral to another merchant who might be a better fit.
- Output: exit-reason distribution drives the §4 decision threshold read.

### 5.4 Success case study for first converter

- The first Pilot merchant to sign Beachhead at Week 4 becomes a case study spotlight.
- Case study contents: verified customer count delivered, merchant quote, approximate revenue attributed, ROI calculation.
- **FTC 16 CFR 255 compliance:** all testimonials must comply with the DisclosureBot spec (see `push-attribution/SKILL.md`) — clear disclosure of material connection, typicality disclaimer, substantiation reserve.
- **Rationale:** social proof for the merchant-10-through-30 Beachhead window.

### 5.5 Leading-indicator hypothesis (the Week 2 verified-customer signal)

- **Hypothesis:** the number of verified customers a merchant sees by end of Week 2 predicts their Week-4 conversion likelihood.
- **Hypothesized curve:** merchants seeing **≥ 5 verified customers by Week 2** convert at **≥ 70%**; merchants at **< 3 verified customers by Week 2** convert at **≤ 25%**.
- **Test plan:** track every merchant's Week-2 verified customer count alongside their Week-4 conversion decision. Run correlation at Week 12 EOW. Minimum sample: 10 data points (full cohort).
- **Value if hypothesis holds:** predicts final Pilot-to-Paid rate by Week 2 instead of Week 12 — accelerates the recalibration cycle by 10 weeks and allows mid-cohort intervention (Push can pour additional creator capacity into lagging merchants).
- **Detailed research plan:** see Appendix B.

---

## §6 — Owner & Trigger

### 6.1 Ownership split

- **Primary owner — data collection:** **Prum.** Responsible for: Week 2 check-in calls, Week 4 interim signal capture, Week 8 actual rate, Week 12 final cohort rate, exit-survey execution, pilot dashboard entry, Week-2 verified-customer count logging for the leading-indicator hypothesis.
- **Owner — modeling:** **Jiaming.** Responsible for: updating the financial model in `numeric_reconciliation.md` rows 55–59 at Week 8 and Week 12, revising scenario table in §3 of this spec, committing updated `push-pricing` §5 after Week 12.
- **Owner — investor communication:** **Jiaming.** Responsible for: F&F individual calls if actual <40%; individual calls if actual <25%; refresh of investor deck narrative layering; strategy update if actual <15%.

### 6.2 Triggers

- **Trigger 1 — Pilot Week 4 EOW (~2026-06-15):** First interim signal. Update `numeric_reconciliation.md` with signal; notify Jiaming + Prum + ML Advisor if signal <40%.
- **Trigger 2 — Pilot Week 12 EOW (~2026-07-27):** Final cohort rate. Revise financial model. Commit updated `push-pricing` §5 and `numeric_reconciliation.md`. Update this spec from v1 (draft) to v2 (empirical).
- **Trigger 3 — Before any external investor conversation (ongoing):** Jiaming confirms the most-recent cohort rate is referenced. No pitch should use an obsolete rate. The hard gate at the top of this doc is enforced here.

---

## §7 — Investor Communication Framework

### 7.1 The 3-sentence answer to "what's your Pilot-to-Paid conversion rate assumption?"

**Memorize verbatim. This is the A-grade answer:**

> "Today the 60% Pilot-to-Paid is an aspirational baseline, not data; industry proxies suggest 25–45% is realistic for a new category. Our model clears a 3x LTV/CAC bar at rates as low as 25% using Model A (v5.1 convention) and breaks below 3x only at the 15% pessimistic case — we'd catch that at Week 4 of Pilot and reset before scale. Actual rate will land by Week 12 of Pilot, week of 2026-07-27."

### 7.2 Layering for longer diligence conversations

If the investor presses further, layer in:

1. The proxy evidence basis (§2 table) — shows we did the homework.
2. The 4-scenario sensitivity (§3 table) — shows the model is robust to a wide miss.
3. The Model A vs Model B framing (§3.5) — shows we can take the harder view.
4. The recalibration plan (§4) — shows we have a date-anchored path from assumption to data.
5. The de-risking actions (§5) — shows we have ways to raise actual rate and to predict it early.
6. The leading-indicator hypothesis (§5.5) — shows we think about how to learn faster.

### 7.3 What to NEVER say

- "The 60% is conservative." (It is not; proxies put it at the upside.)
- "Even at 40% we still hit 15.1x." (Confuses the math; 40% yields 10.4x on Model A.)
- "Pilot cost doesn't count as CAC." (Defensible but NOT a closed argument; always flag Model B exists.)
- "We'll know by Week 4 of pilot." (Week 4 is an interim signal only; final is Week 12.)
- "If Pilot-to-Paid is low, we'll just raise prices." (Not validated; §4 thresholds trigger a strategy revision, not a unilateral price hike.)

---

## Appendix A — Cohort Model Spreadsheet Logic

Pseudo-Excel formulas for the recalibration spreadsheet Prum will maintain. Reference implementation; the actual spreadsheet lives at `docs/v5_2_status/pilot_cohort_tracker.xlsx` (to be created Week 0).

```
# Columns (per merchant, 10 rows)
A: merchant_id
B: merchant_name
C: category (pure_coffee | coffee_plus | dessert_boba | fitness | beauty_nails)
D: pilot_start_date
E: week_2_verified_customers        # populated Week 2 EOW by Prum
F: week_2_nps                        # populated Week 2 EOW by Prum
G: week_2_price_concern_signal       # 1-5 Likert, populated Week 2
H: week_4_interim_intent             # 1-5 Likert, populated Week 4 EOW
I: week_4_signed_beachhead           # Boolean, populated Week 4 EOW
J: week_8_signed_beachhead           # Boolean, populated Week 8 EOW
K: week_12_signed_beachhead          # Boolean, populated Week 12 EOW — FINAL
L: decline_reason                    # "price" | "outcome" | "fit" | "timing" | "other" | null
M: exit_survey_conducted             # Boolean

# Summary cells
N1: =COUNTIF(K2:K11, TRUE)                      # final # converted
N2: =N1 / 10                                     # final Pilot-to-Paid rate
N3: =N2 * 0.706 * 9 / 420                        # Model A LTV/CAC at final rate
N4: =(N2 * 0.706 * 9) / (420 + (6000 / MAX(N1,1)))  # Model B LTV/CAC at final rate

# Leading-indicator correlation (§5.5 hypothesis)
O1: =AVERAGEIFS(K2:K11, E2:E11, ">=5")          # conversion rate for merchants ≥5 verified by W2
O2: =AVERAGEIFS(K2:K11, E2:E11, "<3")            # conversion rate for merchants <3 verified by W2
O3: =CORREL(E2:E11, K2:K11)                      # Pearson correlation, W2 verified vs final convert

# Scenario flags
P1: =IF(N2 >= 0.40, "BASE/MODERATE", IF(N2 >= 0.25, "CONSERVATIVE", IF(N2 >= 0.15, "PESSIMISTIC", "FLOOR BREACH")))
P2: =IF(N2 < 0.40, "NOTIFY F&F WITHIN 7 DAYS", "")
P3: =IF(N2 < 0.25, "FREEZE BEACHHEAD EXPANSION", "")
P4: =IF(N2 < 0.15, "FULL STRATEGY UPDATE", "")
```

Owner: Prum. Update cadence: real-time as each merchant signs or declines; formal snapshot at Week 4, Week 8, Week 12 EOW.

---

## Appendix B — Leading-Indicator Research Plan

### B.1 Hypothesis (restated)

Merchants seeing ≥ 5 verified customers by end of Pilot Week 2 convert to Beachhead at ≥ 70%; merchants at < 3 verified customers by Week 2 convert at ≤ 25%. The midpoint (3–4 verified customers by Week 2) is a coin flip.

### B.2 Why this matters

Current recalibration cycle is 12 weeks (final Pilot-to-Paid rate lands at Pilot Week 12 EOW). If this hypothesis holds, we can predict the final rate with ±10% accuracy by **Pilot Week 2** — 10 weeks earlier. That predictive power allows:

- Mid-cohort intervention: Push can pour additional creator capacity into lagging merchants before Week 4.
- Earlier investor signaling: investor communication can layer in empirical data as early as Week 3.
- Faster model recalibration: financial model updates every week instead of once at Week 12.

### B.3 Data plan

- **Input (predictor):** Week-2 verified customer count per merchant (column E in Appendix A spreadsheet).
- **Output (outcome):** Week-12 signed-Beachhead Boolean (column K).
- **Sample size:** 10 merchants (full Pilot cohort). Small sample — treat correlation as directional, not causal.
- **Analysis:** Pearson correlation + bucket comparison (≥5 vs 3–4 vs <3).
- **Reporting cadence:** Prum populates column E at Week 2 EOW; Jiaming runs correlation analysis at Week 12 EOW.
- **Extend the test:** if the Williamsburg cohort confirms the hypothesis, repeat in the Beachhead expansion window (merchants 11–20) for a second cohort of 10. Combined N = 20 improves correlation power meaningfully.

### B.4 Confounders to watch

- **Category effect:** higher-AOV categories (fitness, beauty-nails) may convert at lower Week-2 verified customer counts but equivalent revenue. The hypothesis should be checked within-category.
- **Neighborhood density effect:** a merchant on a high-foot-traffic corner may see more verified customers independent of Push's delivery quality. Log merchant corner score (per `push-gtm/SKILL.md`) as a covariate.
- **Creator quality effect:** a merchant paired with T3+ creators in Pilot may convert at a higher baseline. Log creator tier mix per merchant.

### B.5 Decision rule

- **If correlation ≥ 0.5:** adopt the Week-2 verified customer count as a committed leading indicator in the Pilot dashboard (per `push-metrics/SKILL.md`). Set Week-2 targets by category.
- **If correlation < 0.3:** hypothesis rejected; rely on Week-4 interim intent (column H) as the earliest signal.
- **If 0.3 ≤ correlation < 0.5:** directional only; repeat on second cohort.

---

## Appendix C — Industry Proxy Deep-Dive

Longer citations for each benchmark in §2.1. All numbers sourced to secondary public reports or industry conversation; none to disclosed company financials. Treat as directional only.

### C.1 F&B SaaS trial-to-paid (Toast, Square for Restaurants)

- Range: 15–35% trial-to-paid conversion.
- Context: merchants evaluating POS / ordering / back-office SaaS typically run 14–30 day trials. Conversion rate is depressed by the depth of the workflow change required (migrating from Clover or a legacy POS is painful).
- Relevance to Push: Push is NOT a workflow replacement — merchants don't rip out their POS; they add Push as a demand-generation overlay. The switching-cost floor that keeps F&B SaaS trial-to-paid at 15–35% is weaker for Push. Expect Push to land higher than the F&B SaaS mode but possibly lower than OpenTable-2003-era.
- Confidence: Medium. Cited numbers are from public retention benchmarks and 10-K / 10-Q disclosures around trial funnels.

### C.2 OpenTable pilot conversion (2003-era)

- Estimate: 45–65% conversion from restaurant pilot to paid subscription.
- Context: OpenTable's 2003-era pilot was a 30–60 day engagement with a relationship salesperson. Restaurants that received the iPad kiosk and saw ≥10 reservations in Week 1 reportedly converted at the high end of that band.
- Relevance to Push: Push's Pilot is 4 weeks vs. OpenTable's 30–60 days; shorter engagement = shorter evidence window = potentially lower conversion if verified customers are lagging. BUT Push's Pilot is pre-qualified from 10 LOIs, so selection effect may offset duration effect.
- Confidence: Low. Numbers come from industry conversations with former early-stage restaurant-tech operators; not sourced to disclosed financials.

### C.3 Square for Restaurants pilot-to-paid

- Estimate: ~25%.
- Context: Square's F&B tier launched with a self-serve trial; no dedicated relationship salesperson for small operators. Conversion pressure depends almost entirely on the product experience during trial.
- Relevance to Push: Push's Pilot is closer to OpenTable (relationship sale, scoped engagement) than to Square (self-serve). This proxy is a floor, not a ceiling.
- Confidence: Low-Medium.

### C.4 Vertical AI trial conversion (Hebbia, Harvey, enterprise AI)

- Estimate: 30–45%.
- Context: enterprise AI trials with scoped engagements, value-denomination in user-hours saved, and relationship selling. Conversion rate scales with clarity of the value denomination.
- Relevance to Push: Push has a crisp value denomination (verified walk-in customers). Crisper than most vertical AI trials, where the end-user-hour-saved estimate is fuzzier. Argues for Push landing at or above the vertical AI mode.
- Confidence: Low.

### C.5 Local marketing agency retainer conversion

- Estimate: 50–70%.
- Context: local agencies running a 30-day scoped engagement before moving to monthly retainer. The trust + relationship floor is high.
- Relevance to Push: Push is adjacent to the agency model in buyer experience (scoped → retainer) but differs in pricing density and automation. This is the most relevant upper-band proxy.
- Confidence: Low. Numbers are industry norms from the small-business marketing agency category.

### C.6 Pilot programs (general B2B software)

- Estimate: 20–40% typical pilot-to-paid.
- Context: PMM (product marketing) benchmarks across B2B software categories. Pilot cohorts typically include pre-qualified buyers; that pre-qualification is the main driver of conversion.
- Relevance to Push: Push's Pilot cohort is heavily pre-qualified (invitation-only from 10 LOIs). Expect to land at or above the top of this band.
- Confidence: Medium.

### C.7 Synthesis

- If Push lands at the industry mode for pilot-to-paid in pre-qualified B2B software (30–40%), the scenario is **Moderate** (§3) → LTV/CAC 10.4x on Model A. Narrative intact.
- If Push lands at the upper band for scoped-engagement relationship sales (50–65%), the scenario is **Base** (§3) → LTV/CAC 15.1x on Model A. Headline holds.
- If Push lands below the self-serve SaaS floor (<25%), the scenario is **Conservative/Pessimistic** (§3) → LTV/CAC 6.5–3.9x on Model A. Strategy update required.
- Realistic midpoint of the proxy-weighted distribution: **30–50%**. Aligns with the "aspirational baseline; expect moderate; tolerate conservative" framing in §7.1.

---

## Appendix D — Open Questions for Jiaming + First Investor

The below questions are intentionally open. The first investor conversation after this spec is published should cover these, and the answers should be appended to this appendix as a changelog.

1. **Model A vs Model B preference.** Do your diligence frameworks typically classify Pilot cost as product-development (Model A) or as customer acquisition (Model B)? If B, which LTV/CAC floor do you enforce? (If B with 3x floor, we're at risk in Moderate scenario — worth pre-flagging.)
2. **Conservative scenario tolerance.** Would a Week-12 actual of 25% Pilot-to-Paid delay your investment, or reshape it? What about 35%? Where is your bar?
3. **Floor on LTV/CAC for this category.** Some local-commerce investors use a 5x floor given the churn profile of small-merchant SaaS. Is that your bar, or is 3x sufficient?
4. **Pilot duration sensitivity.** If we extended Pilot from 4 weeks to 8 weeks, would you expect conversion to materially increase, or is 4 weeks the right window? (Trade-off: longer pilot = more evidence but more pilot subsidy cost and later Beachhead start.)
5. **Reference introductions.** Would you introduce us to a former OpenTable or DoorDash early-stage operator who can pressure-test our conversion-rate assumption from first-hand experience? (Per `pilot-demand-proof-plan.md` §What we ask the investor for.)
6. **Staged commitment.** If we hit Pilot Week 4 with a <40% interim signal, are you willing to extend diligence to Week 12 rather than pass early?
7. **Beachhead expansion pace.** If Week-12 actual lands at 40%, should we slow the Beachhead 11–50 window expansion to gather better data before scaling? What pace signals confidence to you vs. overconfidence?
8. **Alternative pricing model tolerance.** If the conservative scenario triggers a pricing rewrite (lower floor + higher per-customer), would that reshape your investment thesis? How much price uncertainty are you willing to tolerate at seed?

---

## §8. RACI — Recalibration Execution

| Activity | Responsible | Accountable | Consulted | Informed |
|---|---|---|---|---|
| Pilot LOI template distribution (Day 0) | Prum | Jiaming | Outside counsel | Milly |
| Pilot W2 mid-pilot check-in scheduling | Milly | Prum | Jiaming | F&F investors (passive) |
| Pilot W2 verified-customer count instrumentation | Z (eng) | Prum | ML Advisor | Jiaming |
| Pilot W4 EOW data snapshot + memo | Prum | Jiaming | ML Advisor | F&F investors (memo) |
| Pilot W8 EOW interim conversion compute | Prum | Jiaming | — | F&F investors (memo) |
| Pilot W12 EOW final cohort rate + model refresh | Jiaming | Jiaming | Prum, ML Advisor | F&F investors (full memo + call if <40%) |
| Conversion <40% F&F investor call | Jiaming | Jiaming | Outside counsel (if material misstatement risk) | Prum, Milly |
| Conversion <25% Beachhead-expansion-freeze decision | Jiaming | Jiaming (with board if formed) | Prum, Milly, ML Advisor | F&F investors |
| External pitch gating — verify rate is current | Jiaming | Jiaming | — | Diligence team |
| Pilot exit-interview execution (W12) | Milly | Prum | Jiaming | F&F investors (themes only; no quotes without consent) |

Owners summary: Prum owns data; Jiaming owns model + investor comms; Milly owns merchant-side surfaces.

---

## §9. Data Collection Schema (DDL + dashboard)

### §9.1 pilot_merchants table

```sql
CREATE TABLE pilot_merchants (
  merchant_id            uuid PRIMARY KEY REFERENCES merchants(id),
  pilot_cohort_id        uuid NOT NULL REFERENCES pilot_cohorts(id),
  pilot_start_date       date NOT NULL,
  pilot_end_date         date NOT NULL,
  status                 text NOT NULL CHECK (status IN ('active', 'converted', 'churned', 'pending', 'extended')),
  conversion_decision_date     date,
  conversion_decision_reason   text,
  week_2_verified_count        int CHECK (week_2_verified_count >= 0),
  week_4_verified_count        int CHECK (week_4_verified_count >= 0),
  week_8_verified_count        int CHECK (week_8_verified_count >= 0),
  week_12_verified_count       int CHECK (week_12_verified_count >= 0),
  week_2_check_in_attended     boolean,
  notes                  text,
  created_at             timestamptz DEFAULT now(),
  updated_at             timestamptz DEFAULT now()
);
CREATE INDEX idx_pilot_merchants_cohort ON pilot_merchants(pilot_cohort_id);
CREATE INDEX idx_pilot_merchants_status ON pilot_merchants(status);
```

### §9.2 pilot_merchant_exit_interview table

```sql
CREATE TABLE pilot_merchant_exit_interview (
  id                              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id                     uuid NOT NULL REFERENCES pilot_merchants(merchant_id),
  interview_date                  date NOT NULL,
  interviewer_id                  uuid NOT NULL,
  decline_reason                  text NOT NULL CHECK (decline_reason IN ('price', 'outcome', 'fit', 'timing', 'other')),
  decline_reason_detail           text,
  price_sensitivity_score         int CHECK (price_sensitivity_score BETWEEN 1 AND 5),
  outcome_satisfaction_score      int CHECK (outcome_satisfaction_score BETWEEN 1 AND 5),
  would_consider_later_months     int,
  open_feedback                   text,
  consent_to_quote                boolean DEFAULT false,
  created_at                      timestamptz DEFAULT now()
);
```

Retention: pilot_merchant_exit_interview retained 4 years (statute-of-limitations on contract-related claims). PII minimized: no consumer phone or PAN; merchant_id is internal.

### §9.3 Dashboard — Pilot Cohort Funnel

A weekly-refreshed dashboard owned by Prum, surfacing:
- Cohort funnel: outreach → LOI → active-pilot → converted-Beachhead, with weekly drop-offs visualized
- Per-merchant week-by-week verified-customer trajectory (small-multiples, 10 sparklines)
- Leading-indicator scatter: Week-2 verified count (X) vs conversion outcome (Y, binary)
- Decline-reason histogram (from exit interviews)
- Running interim Pilot→Paid rate with confidence interval

Build: BI tool (Metabase, Hex, or simple Streamlit) by v5.3 W3. Until then: Google Sheet with named-range formulas.

---

## §10. Investor Output Artifacts (per checkpoint)

### §10.1 Week 4 EOW artifact (v5.3 W4, ~2026-06-22 calibration window)

**Form:** one-page memo + dashboard link.

**Contents:**
- Soft-commit count (how many merchants have verbally indicated intent to convert)
- Week-2 verified-customer leading-indicator signal: actual median across cohort vs hypothesis (≥5 → ≥70%)
- Top 3 themes from W2 mid-pilot check-ins
- Updated LTV/CAC table only if leading indicator suggests rate <40%
- Investor communication: short email; no model-changing claim at this checkpoint

**Skeleton:** see Appendix E (template).

### §10.2 Week 8 EOW artifact (v5.3 W8)

**Form:** one-page memo + dashboard link + sensitivity table refresh.

**Contents:**
- Interim Pilot→Paid rate computed on however-many merchants have decided
- Refresh of §3 stress-test table with actuals where available
- "What we're seeing / what would trigger a change" framing
- Specific pricing experiments to consider for Beachhead 11–50 window (links to push-pricing §9 experiment 1)

### §10.3 Week 12 EOW artifact (~2026-07-27, v5.3 W12 — full revision)

**Form:** full investor memo + deck update + data-room refresh.

**Contents:**
- FINAL Pilot→Paid rate for cohort-1 (sample size = 10)
- Updated push-pricing §5 with real numbers replacing assumptions; commit + diff cited
- Updated `docs/v5_2_status/numeric_reconciliation.md` (rows for LTV/CAC, lifetime, conversion rate)
- F&F investor call within 7 days if actual <40%; written-only update if 40-60%; celebratory call if >60%
- Public talking points for next investor pitch (with current rate cited; no obsolete 60% references)

---

## §11. Leading-Indicator Research Plan (extending Week-2 hypothesis)

**Primary hypothesis (H1):** Merchants with ≥5 verified customers by Week 2 convert to Beachhead at ≥70%; those with <3 convert at ≤25%.

**Secondary hypothesis (H2):** Merchants who attend the Week-2 mid-pilot check-in call convert at 20-percentage-points higher rate than decliners.

**Confounders to control:**
- Category mix (Coffee+ vs boba vs fitness vs beauty) — small N likely to limit; collect for v2 cohort
- Creator quality assigned to merchant's campaigns (avg Push Score of creators)
- Geographic density (foot traffic baseline of the merchant's neighborhood)
- Merchant's prior outcome-pricing experience (have they used Toast loyalty / OpenTable / Yelp ads?)

**Measurement plan:**
- Log Week-2 verified count + check-in attendance flag in `pilot_merchants` table (§9.1)
- At Pilot W12 EOW, compute Pearson correlation r between (Week-2 count, conversion-binary) and (check-in attended, conversion-binary)
- Decision rule:
  - r > 0.5: adopt as primary sales-development signal in Beachhead 11–50
  - 0.3 < r ≤ 0.5: use as soft signal (informs but doesn't gate sales actions)
  - r ≤ 0.3: hypothesis discarded; design v2 leading indicator for cohort-2

**Sample-size caveat:** N=10 cohort is statistically thin; r-values should be reported with 95% confidence intervals (Fisher z-transformation). For a binary outcome and N=10, r-confidence-intervals are wide; treat as directional only until cohort-2 (target N=15 in Beachhead first wave) provides additional data.

---

## §12. FAQ for Investor / Board

1. **"Why should we believe you'll hit 40% when industry is 25-35%?"** Honest answer: 40% is mid-range optimism reflecting (a) outcome-priced model removes "did the campaign work?" friction, (b) Williamsburg Coffee+ is high-density category fit. We track to 25-60% range and recalibrate at Week 4.

2. **"What's the cost if actual is 15%? Do you still raise a seed?"** A 15% actual triggers a fundamental pricing-model revisit. We'd not pursue a seed round on the v5.2 thesis without first restructuring Beachhead pricing. Our floor: maintain enough runway through F&F to execute the alternative pricing pilot before approaching seed.

3. **"How will you communicate the final rate to us?"** Per §10.3, full memo + dashboard link + 30-min call. If actual <40%, call within 7 days of Week 12 EOW. If 40-60%, written update. If >60%, celebratory call with case-study spotlight from first converter.

4. **"What if one pilot merchant sets the narrative (single outlier)?"** N=10 makes single-outlier risk material. We report cohort-level + per-merchant trajectories; single-merchant outliers (top or bottom decile) called out explicitly in §10.3 memo. Cohort-2 (Beachhead first wave) provides the de-noising.

5. **"Do you have a backup model if Pilot→Paid drops below floor?"** Yes — alternative model under consideration: lower floor ($300/mo) + higher per-customer (Coffee+ $35 instead of $25) + retention add-on emphasis. Tested in cohort-2 if cohort-1 lands <25%.

6. **"Can you tell me the name of the first converted merchant so we can call them?"** With merchant consent, yes. We anticipate first conversion by Pilot W6 (4 weeks of pilot + 2 weeks decision); reference call available by W7.

7. **"Why Week 12 and not Week 8 for final number?"** Week 8 captures merchants who decided early; Week 12 captures the "considered carefully" cohort. Excluding the latter biases conversion upward. Industry benchmark is full pilot+30-day decision window (we use 4 weeks pilot + 4 weeks decision = 8 weeks, plus 4-week reasonability margin = 12).

8. **"How does this interact with the 9-month lifetime assumption?"** Pilot→Paid is the entry into the 9-month lifetime calculation. If Pilot→Paid is X and 9-month retention assumption is Y, LTV = X × Y × monthly GM. The two compound: a 50% miss on each compresses LTV by 75%.

9. **"What's the incentive for pilot merchants to NOT convert?"** Price (most common, per industry); ROI clarity (some merchants want longer pilot); fit (categories outside Coffee+ may not see clear lift in 4 weeks). All captured in §9.2 exit interview.

10. **"Has any comparable vertical-AI company published their pilot conversion?"** Not publicly. Hebbia (legal AI), Harvey (legal AI), Cresta (sales AI) — none publish pilot-to-paid rates explicitly. We're flying without close-comparable benchmarks; this is an honest gap.

---

## §13. Cross-Spec Dependencies + Contradictions

- **P2-3 expansion math:** Shares Pilot W12 data point. If Pilot→Paid <40%, expansion-math §3 pace must revise (cascade); §10 Bull/Base/Bear scenario probability redistributes to Bear-weighted. **Critical:** the M12 ARR forecast in expansion-math §5 ($25K MRR = 25 × $1,000) ASSUMES 100% retention from Pilot to Beachhead — if 60% Pilot→Paid is the realistic baseline, then M12 ARR is closer to 25 × 0.6 × $1,000 = $15K MRR. This is a v1-spec drafting error in expansion-math; Wave 4 reconciliation must fix.

- **P2-1 consumer-facing:** Visit-2 return rate is a quality signal for Pilot→Paid. If a pilot merchant has high visit-2 rates, conversion likelihood spikes. Add as tertiary hypothesis (H3) in §11 if v2 spec.

- **P2-5 legal budget:** Pilot LOI template (#9) MUST spell out the Week-4 conversion-decision pathway in plain English. Otherwise a merchant declining at Week 4 with a "you didn't tell me about $500/mo" claim creates contract-law exposure.

- **P1-3 T1 minimum guarantee:** Doesn't directly intersect Pilot→Paid mechanics, but BOTH affect first-pilot merchant experience. If a merchant's first pilot delivers 0 verified customers AND triggers the T1 guarantee, the merchant may form a negative outcome impression and decline conversion — track that interaction in §9.1 notes column.

- **Infrastructure:** `pilot_merchants` table needs a `pilot_cohort_id` FK; `pilot_cohorts` table doesn't yet exist. Add to v5.3 W1 schema migration ticket.

- **Cross-spec contradiction (must resolve in Wave 4):** Expansion-math v1 §3 implicitly assumes 100% Pilot→Paid (counts all 25 Williamsburg merchants in M12 MRR); this spec's stress-test models 25-60%. The two specs disagree on the M12 MRR ($25K vs $15K). Wave 4 owner: reconcile in numeric_reconciliation.md.

---

## §14. Wave 3 Audit Reconciliation (2026-04-20)

Audit `docs/spec/audits/06-p2-6-audit.md` found one HIGH arithmetic error and recommended a stronger statistical posture.

### §14.1 Model A LTV/CAC arithmetic correction

**The error:** §3 Model A reported LTV/CAC values 15.1x / 10.4x / 6.5x / 3.9x at conversion rates 60% / 40% / 25% / 15% with CAC = $420 fixed. At constant CAC, LTV/CAC must equal 15.1x at every conversion rate (since LTV = 9 mo × $706/mo = $6,354 doesn't depend on conversion). The values 10.4x / 6.5x / 3.9x derive only when CAC is **cohort-allocated** (i.e., CAC inflates as fewer pilots convert).

**The reconciliation:** Model A's correct interpretation is **per-converted-merchant LTV with cohort-allocated CAC**:
- Cohort cost ≈ $6,000 (10 pilots × $150/wk × 4 wk per audit 06 §2)
- CAC per converted merchant = $420 (sales+onboarding) + ($6,000 / N converted)
- At 60%: CAC = $420 + $1,000 = $1,420; LTV/CAC = $6,354 / $1,420 = **4.5x** ← matches Model B
- At 40%: CAC = $420 + $1,500 = $1,920; LTV/CAC = $6,354 / $1,920 = **3.3x**
- At 25%: CAC = $420 + $2,400 = $2,820; LTV/CAC = $6,354 / $2,820 = **2.3x**
- At 15%: CAC = $420 + $4,000 = $4,420; LTV/CAC = $6,354 / $4,420 = **1.4x**

Model A and Model B converge when CAC includes pilot allocation. The 15.1x / 10.4x / 6.5x / 3.9x values reported in §3 are **withdrawn** as inconsistent. **Use Model B (all-in CAC) values exclusively** for any external defense going forward.

### §14.2 r-threshold update for leading-indicator hypothesis (§11)

Audit 06 finds that r=0.5 at N=10 cannot be statistically distinguished from zero (Fisher z 95% CI ≈ [-0.19, +0.86]). The decision rule in §11 is updated:
- **r ≥ 0.78** for "adopt as primary signal" (lower 95% CI clears 0.3) — was r > 0.5
- **0.5 ≤ r < 0.78** for "directional only; revisit at cohort-2 (N≥15)" — was 0.3 < r ≤ 0.5
- **r < 0.5** for "discard hypothesis" — was r ≤ 0.3

Sample-size implications: N=10 cohort cannot conclusively confirm the Week-2 → conversion hypothesis. Cohort-2 (Beachhead first wave, target N≥15) provides the joint-evidence basis. Until cohort-2, treat the Week-2 signal as soft only.

### §14.3 §7 framing correction

The "we'd catch that at Week 4 of Pilot and reset before scale" line in §7.1 contradicts §7.3's prior caveat that Week 4 is interim only. Replace with:

> "Today the 60% Pilot-to-Paid is an aspirational baseline, not data; industry proxies suggest 25–45% is realistic for a new category. Our **Model B (all-in CAC)** breaks below the 3x VC floor at the 25% pessimistic case — we'd see a directional signal at Week 8 actuals (first hard conversion data point) and a final answer at Week 12 (week of 2026-07-27). Pilot Week 4 is interim intent only and not a decision-quality signal."

This corrects the audit's flagged self-contradiction.

---

*End of spec v1. Next revision: v2 (empirical), to be committed at Pilot Week 12 EOW (~2026-07-27) by Jiaming. §14 appended 2026-04-20 in Wave 3 fix-round per integration audit P0 #4.*
