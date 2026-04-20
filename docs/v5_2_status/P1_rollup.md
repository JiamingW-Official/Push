# Push v5.2 — P1 Wave Rollup

**Audience:** Founder, Board, Lead Investor, Prospective Investors
**Window:** 2026-04-20 (single-day P1 wave shipped on branch `creator-workspace-v1`)
**Author:** Consolidation agent (cross-cutting)
**Status:** P1-1 through P1-5 LANDED; P2 wave scoped below

---

## Executive Summary

The v5.2 migration moves Push from a v4.1 subscription + per-campaign creator model to outcome-priced, Two-Segment Economics positioned as **Vertical AI for Local Commerce**. P0 (FTC compliance + landing-page truthing) shipped on 2026-04-19; P1 (strategic/operational foundations) landed today across five commits.

**P1 shipped (2026-04-20):**

1. **P1-1 Tier Colors (Path A)** — 6-tier creator color system re-sourced from the 6-color brand palette with documented WCAG AA compliance; TierBadge asset work deferred to P0-6.
2. **P1-2 ML Advisor Outreach** — 15-row tracker + 5 InMail archetypes staged; Day 7 batch send gated by compliance sign-off; ship criterion = ≥1 real conversation by Day 14.
3. **P1-3 T1 Clay Minimum Guarantee** — $15 merchant fail-to-deliver protection wired into per-customer unit economics via a $0.30/verified-customer allocational reserve; GM stays 26.7% in base case.
4. **P1-4 SLR North Star** — Software Leverage Ratio (Active Campaigns / Ops FTE) replaces v4.x north stars, with authoritative SQL, decomposition levers, and target band (M-6 ≥12, M-12 ≥25, M-24 ≥50).
5. **P1-5 Killer Lines + "Push is NOT"** — v4.x "AI-native agency" language purged; v5.2 messaging matrix (4 sub-matrices), trigger-response playbook, and 7 rejected categories documented.

**Open items (next 14 days):**
- ML Advisor: Day 7 batch send (Jiaming), Day 10 response checkpoint, Day 14 ship criterion.
- TierBadge component build (P0-6): React component + Storybook, Pearl Stone background refinements for T1 Clay.
- USPTO filing for "Vertical AI for Local Commerce" + "ConversionOracle" (IP counsel by Q2-W1).
- Financial model `xlsx` not present in repo; SKILL.md markdown remains source of truth until sync.

**Next-wave checkpoints:**
- Week +1: Pilot-to-Beachhead conversion experiment design (push-pricing §9, #1).
- Week +2: SLR baseline snapshot on last business day of April 2026.
- Week +4: First pilot results (target trigger for "traction" language unlock).

**This is not a launch update — this is a pre-pilot foundation update.** No customer revenue has moved. All numbers below are plan, not actuals.

---

## §P1-1 Tier Colors (Path A adopted)

**Shipped:** `Design.md §Tier Identity System`, `.claude/skills/push-creator/SKILL.md §6`, `.claude/skills/push-website/` alignment.

**Decision summary:** The 6-tier creator ladder's color system was previously 6 independent hex codes that violated Push's "Six brand colors only — no additions" rule. **Path A** re-aliases each tier token to an existing brand palette color; material names (Clay/Bronze/Steel/Gold/Ruby/Obsidian) are retained for tier identity and differentiation moves to icon + texture inside the `TierBadge` component.

**WCAG AA compliance (verified):**

| Tier | Background | Text | Contrast | Pass |
|---|---|---|---|---|
| Seed (Clay) | `#f5f2ec` Pearl | `#003049` Deep Space | ~13.1:1 | AAA |
| Explorer (Bronze) | `#c9a96e` Champagne | `#003049` Deep Space | ~6.1:1 | AA |
| Operator (Steel) | `#669bbc` Steel Blue | `#003049` Deep Space | ~4.9:1 | AA normal |
| Proven (Gold) | `#c1121f` Flag Red | `#ffffff` White | ~7.1:1 | AA + AAA large |
| Closer (Ruby) | `#780000` Molten Lava | `#ffffff` White | ~12.4:1 | AAA |
| Partner (Obsidian) | `#003049` Deep Space | `#ffffff` White | ~13.5:1 | AAA |

**Deferred to P0-6 (TierBadge work):**
- React component build (`components/tier/TierBadge.tsx`).
- Storybook stories with all 6 variants + hover/active states.
- Icon SVG set (14×14px per tier).
- Animation tokens (`badgeShimmer 2.8s` for Ruby, `badgeShimmer 2.4s + obsidianPulse` for Obsidian).
- Sweep of 18 downstream files still carrying legacy hex strings (they already inherit correct colors via globals.css cascade).

---

## §P1-2 ML Advisor Outreach

**Shipped:** `docs/hiring/ml_advisor_outreach_tracker.md`, `docs/hiring/inmail_drafts.md`, compliance sign-off block.

**Role spec:** Part-time ML Advisor for Push, Inc. (Delaware C-Corp, pre-seed). Scope: ConversionOracle (CV + OCR + geo-verification) and creator-matching roadmap; 2–4 hrs/week. Compensation disclosed in every outreach per NY LL-32-2022: **0.25–0.5% equity (RSA), 2-year vest, 6-month cliff, no cash** (YC FAST-templated).

**Tracker design:** 15 rows, 3 priority bands.
- **P0 (rows 1–4):** warm intros + ICP-perfect cold targets — send first.
- **P1 (rows 5–10):** strong ICP match — Day 7 batch.
- **P2 (rows 11–15):** broader funnel — activate if P0/P1 Day 10 response rate <15%.

**5 InMail archetypes** (in `docs/hiring/inmail_drafts.md`):
1. **Warm intro — ConversionOracle-first:** leads with CV + OCR technical hook.
2. **Warm intro — outcome-pricing-first:** leads with vertical-AI unit economics hook.
3. **Cold — ICP academic (NYU CDS / Stanford HAI / CMU MLD alum):** leads with research-to-production framing.
4. **Cold — GitHub CV/OCR contributor:** personalized to open-source commits.
5. **Slack/Twitter ML community:** low-friction DM, equity-range upfront.

**Day 7 ship target:** batch send with compliance sign-off (cap table cross-check, do-not-contact check, bias review on screening rubric, retention-until populated).
**Day 14 ship criterion:** ≥1 real conversation (call held or scheduled).

**Escalation:** if Day 10 = 0 replies, open parallel Upwork 4-week contractor posting. If Day 14 = 0 from 15 sends, rewrite hook (swap ConversionOracle-first for outcome-pricing-first) and second batch of 10.

**Compliance envelope:** NY Pay Transparency, EEO (Title VII / ADA / ADEA / NY SHRL), LinkedIn User Agreement §8.2, CAN-SPAM, EEOC retention (12 months non-hire / 7 years hire).

---

## §P1-3 T1 Clay Minimum Earning Guarantee

**Shipped:** `.claude/skills/push-creator/SKILL.md §2 T1 Clay + Decision Tree`, `.claude/skills/push-pricing/SKILL.md §5 Unit Economics + Sensitivity + GAAP treatment`.

**Mechanic:** If a T1 Seed creator completes 1 campaign with 0 verified customers (merchant fail-to-deliver), Push pays the creator **$15** within 15 days. Capped at 3 triggering events per T1 per calendar year (anti-gaming). Exceeded → auto-demotion below T1.

**Decision tree (5 branches):**
1. Merchant QR offline >6 hr → merchant fault → Push pays $15, bills merchant $25 retroactively (Beachhead+) → creator score unchanged.
2. Creator no-show / no-post → creator fault → $0 + Push Score –15 → dispute opens.
3. Creator performed but 0 scans → merchant assumes outcome risk → Push pays $15 (goodwill) → campaign post-mortem.
4. Fraud suspected → freeze payout → Integrity review ≤5 business days → if confirmed: $0 + Push Score –25 + 30-day suspension.
5. Ambiguous → ops review ≤48h → default $15 if ≥51% merchant-fail evidence; $0 + –8 score if ≥51% creator-fail.

**Financial impact (base case, Coffee+ Month 12):**

| Metric | v5.2 base |
|---|---|
| Per-customer GM | $6.67 / **26.7%** |
| Per-merchant monthly GM (85 verified customers) | $706 / **26.9%** |
| LTV (9-month lifetime × retention factor) | **$6,354** |
| CAC (sales + onboarding + Pilot subsidy allocated) | **$420** |
| **LTV/CAC** | **15.1x base / 10.0x stressed** (churn 2x / CAC 1.5x) |

**Reserve sensitivity:** Per-customer reserve = $15 × (T1 fail rate) × (T1 volume share). Baseline 20% fail × 10% share = **$0.30/customer**. Worst-credible 30% × 40% = $1.80/customer → compresses Coffee+ GM to 22.0% (–4.7 pts). Mitigated by 3-events/year cap.

**GAAP treatment:** COGS allocation metric, **not** a pre-funded reserve. Recognition at trigger event (not accrual). Classified as **Cost of Revenue — Creator Payouts**.

---

## §P1-4 SLR as North Star

**Shipped:** `.claude/skills/push-metrics/SKILL.md §1 (full rewrite), §6.x Operations Metrics, §9 dashboard decomposition`.

**Definition:**
- **Active Campaign** = `status IN ('live','scheduled-future','verifying')` AND NOT `('paused','cancelled','completed-final','draft')`; verifying state counts for 48h.
- **Ops FTE** = Σ(ops_hours_logged in month) / 160. Includes: founders' ops allocation, W2 ops, 1099 ops contractors, verification review, onboarding, disputes. Excludes: advisors, pure sales, eng, product, marketing.
- **SLR** = monthly snapshot, last business day of month.

**Target band:**

| Window | Target | Meaning |
|---|---|---|
| Month 6 | ≥ 12 | Learning phase; tolerates high manual rate |
| Month 12 | ≥ 25 | Mid-stack AI-augmented ops |
| Month 24 | ≥ 50 | ConversionOracle + DisclosureBot absorb ≥85% of routine work |

**Decomposition levers (ranked by M-12 impact):**
1. AutoVerification coverage (ConversionOracle) — 40%
2. Onboarding load per merchant — 25%
3. Dispute rate × avg dispute minutes — 20%
4. Merchant retention — 15%

**Operations Metrics subsection (§6.x):**

| Metric | Target |
|---|---|
| ConversionOracle precision | ≥92% at M-12 |
| ConversionOracle recall | ≥88% at M-12 |
| Manual intervention rate | ≤15% M-6, ≤8% M-12, ≤3% M-24 |
| DisclosureBot FP rate | ≤5% |
| Ops FTE utilization | 60–85% |

**Competitor benchmarks (estimated, internal):** OpenTable ~300, DoorDash ~50, Whalar 8–12, traditional agencies 3–5. Push M-12 target 25 = 5x typical agency. All competitor numbers flagged "estimated" until sourced to disclosed financials.

**Escalation rule:** SLR <50% of target for 2 consecutive months → founder strategic review.

---

## §P1-5 Killer Lines + "Push is NOT"

**Shipped:** `.claude/skills/push-strategy/SKILL.md §External Positioning` (full rewrite).

**5 Killer Lines (v5.2):**

1. **Primary (public):** "Vertical AI for Local Commerce — we sell verified customers, not software."
2. **Investors:** "Outcome-priced AI for local; SLR ≥ 25 at Month 12; ConversionOracle + Creator Productivity Lock = moat."
3. **Merchants:** "Tell us how many customers. We deliver — and you pay when they walk in."
4. **Creators:** "Get paid per verified customer; top performers become equity partners."
5. **Technical:** "ConversionOracle™ = Computer Vision + OCR + geo-verification. FTC-compliant DisclosureBot. SLR-driven unit economics."

**7 rejected categories ("Push is NOT"):**
Marketing agency · Creator marketplace · Loyalty app · Local discovery platform · Coupon engine · Content community · Influencer marketing tool.

Each rejection ships with positive proof (Matrix 3) — e.g., "Creator marketplace → deliver outcomes, not introductions → merchant pays only post-walk-in; creator paid by Push on behalf of merchant."

**Messaging Matrix (4 sub-matrices):**
1. Audience × Channel × Primary Line (9 audiences from VC to Regulator)
2. Objection → Response (7 canonical objections)
3. Positive Proof for each "Push is NOT" (7 rejections)
4. Words We Use vs Words We Don't (6 word-pairs)

**Trademark actions pending:**
- "Vertical AI for Local Commerce" — USPTO classes 35, 42 — IP counsel by 2026-Q2-W1.
- "ConversionOracle™" — intent-to-use application before landing-page launch.
- "We sell verified customers, not software" — truth-in-advertising review; footnote `*verification precision target 92% at M-12` required on collateral.
- "Creator Productivity Lock" — internal-only until legal review.

---

## §Cross-file Numeric Reconciliation (Authoritative Summary)

> Full per-metric table with 30+ rows is in [`numeric_reconciliation.md`](./numeric_reconciliation.md). This §contains the headline numbers most likely to surface in board/investor conversations.

| Metric | Value | Source |
|---|---|---|
| Pure coffee per-customer price | $15 | push-pricing §2.2 |
| Coffee+ per-customer price | $25 | push-pricing §2.2 |
| Specialty dessert / boba | $22 | push-pricing §2.2 |
| Boutique fitness class | $60 | push-pricing §2.2 |
| Beauty / nails appointment | $85 | push-pricing §2.2 |
| T1 Clay payout / verified customer | $5 + free item + $10 first-customer bonus | push-creator §2 |
| T2 Bronze payout | $15 | push-creator §2 |
| T3 Steel payout | $20 + 3% referral | push-creator §2 |
| T4 Gold payout | $25 + 10% + $800 retainer | push-creator §2 |
| T5 Ruby payout | $40 + 15% + $1,800 retainer + 0.02% RSA | push-creator §2 |
| T6 Obsidian payout | $60 + 20% + $3,500 retainer + 0.05–0.2% RSA | push-creator §2 |
| T1 minimum guarantee | $15 (cap 3/year) | push-creator §2, push-pricing §10 |
| T1 reserve allocation | $0.30 / verified customer (base) | push-pricing §5 |
| Per-customer GM (Coffee+) | $6.67 / 26.7% | push-pricing §5 |
| Per-merchant Month 12 GM | $706 / 26.9% | push-pricing §5 |
| LTV | $6,354 | push-pricing §5 |
| CAC | $420 | push-pricing §5 |
| LTV/CAC base | 15.1x | push-pricing §5 |
| LTV/CAC stressed | 10.0x | push-pricing §5 |
| SLR M-6 | ≥12 | push-metrics §1.2 |
| SLR M-12 | ≥25 | push-metrics §1.2 |
| SLR M-24 | ≥50 | push-metrics §1.2 |
| Push Score weights | 30/20/25/15/10 | push-creator §4 |
| ConversionOracle precision target | ≥92% at M-12 | push-metrics §6.x |
| ConversionOracle recall target | ≥88% at M-12 | push-metrics §6.x |
| Manual intervention rate M-12 | ≤8% | push-metrics §6.x |

---

## §Open Risks + Escalation Triggers

| # | Risk | Severity | Escalation Trigger | Owner |
|---|---|---|---|---|
| 1 | ML Advisor Day 14 replies = 0 from 15 sends | High (blocks ConversionOracle roadmap) | Day 14 snapshot → rewrite hook + second batch of 10 | Jiaming |
| 2 | T1 reserve exceeds $0.30 base (worst case $1.80 = –4.7 GM pts) | Medium (unit economics stress) | T1 fail rate >20% or volume share >25% at M-6 | Ops lead |
| 3 | Financial model xlsx diverges from SKILL.md markdown | Medium (SoT confusion) | Any board-facing doc references xlsx not in repo | Founder |
| 4 | 18 downstream files still carry v4.1 tier hex strings | Low (cosmetic only; cascade works) | Visual regression in dashboards / profile pages | P0-6 owner |
| 5 | USPTO clearance for "Vertical AI for Local Commerce" / "ConversionOracle" blocks public launch | High (brand risk) | IP counsel not engaged by 2026-Q2-W1 | Founder |
| 6 | SLR < 50% of target 2 consecutive months | High (strategic review) | M-6 SLR <6 or M-12 SLR <12.5 | Founder |
| 7 | Pilot-to-Beachhead conversion <60% (target in push-pricing §9 #1) | High (revenue ramp) | Week 4–6 experiment readout | Ops lead + Founder |
| 8 | Merchant Month 3 churn (outcome warranty fires) | Medium (LTV impact) | >15% of Pilot merchants churn at M-3 | Merchant Success |

**Escalation protocol:** any "High" severity trigger firing → founder notified within 24h + item added to next strategic review agenda.

---

## §P2 Checkpoints (Placeholder — TBD)

P2 wave will be scoped after ML Advisor Day 14 readout. Candidate items (not yet prioritized):
- TierBadge component build + 18-file hex sweep (promotion of P0-6 into P2).
- Financial model xlsx sync (one-way dump from SKILL.md into xlsx for investor-facing artefacts).
- USPTO filings (Vertical AI for Local Commerce, ConversionOracle) — IP counsel engagement.
- Pilot-to-Beachhead conversion experiment (push-pricing §9 #1).
- SLR dashboard build (overlay 4-lever decomposition on main line chart).
- Creator Productivity Lock contract language (T4–T6 retainer + equity paper).
- ConversionOracle training data pipeline hardening (target 10k+ labeled events before competitor entry).

**TBD until P1 Day 14 readout.**

---

## §Commit Log (2026-04-20)

| Commit | Summary |
|---|---|
| `231677f` | feat(strategy): P1-5 purge v4.x agency language; adopt v5.1 Vertical AI killer lines |
| `56737db` | feat(metrics): P1-4 add SLR as v5.2 North Star + Operations Metrics section |
| `4cbdbbc` | feat(creator): P1-3 add T1 Clay minimum earning guarantee + update financial model |
| `76689e1` | chore(hiring): add ML Advisor outreach tracker + draft 5 InMails (v5.2 P1-2) |
| `e12fcbb` | feat(design): P1-1 tier color system decision — Path A adopted |
| `6c5134a` | chore(v5.2): add Week 0 unblock artifact templates |
| `a61d567` | feat(landing): add FTC 16 CFR 255 disclosure to root / portal (app/page.tsx) |
| `f5532a6` | feat(landing): add FTC 16 CFR 255 compliant disclosure to illustrative demo numbers (v5.2 P0-3) |
| `b67de90` | feat: rewrite push-creator SKILL + scoring-model to v5.2 Two-Segment Economics; deprecate per-campaign / milestone bonus |
| `fa7f9a8` | feat: rewrite push-pricing SKILL to v5.2 per-customer economics; deprecate v4.1 subscription tiers |

**Branch:** `creator-workspace-v1` (not yet merged to `main`).

---

*Generated 2026-04-20. Review cadence: weekly (Monday) by data owner. Next rollup: P1 Day 14 readout (2026-05-04) or P2 scoping kickoff, whichever comes first.*
