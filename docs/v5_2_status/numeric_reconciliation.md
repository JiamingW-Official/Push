# Push v5.2 — Numeric Reconciliation (Single Source of Truth)

> **This file is the Single Source of Truth for all quoted v5.2 numbers.** If a number here conflicts with a quotation elsewhere, **fix the quotation**, not this file. Reconciliation review: every Monday by the data owner (ops lead until a data analyst is hired). All entries sourced to the specific SKILL.md §they come from, plus the commit that last set the value.

**Owner:** Ops lead / founder
**Scope:** All numbers quoted in `.claude/skills/push-*/SKILL.md` + sub-docs, plus numbers that surface in investor/board artefacts.
**Status date:** 2026-04-20
**Branch:** `creator-workspace-v1`

---

## Master Table

**Column legend:** `#` = stable row id (do not renumber on edits) · `Metric` = canonical name · `Value` = authoritative number · `Unit` = SI / business unit · `Source (file:§)` = file path + section · `Last Updated` = ISO date + commit short SHA.

| # | Metric | Value | Unit | Source (file:§) | Last Updated |
|---|---|---|---|---|---|
| 1 | Per-customer fee — Pure Coffee | $15 | USD / verified customer | push-pricing/SKILL.md §2.2 | 2026-04-20 (fa7f9a8) |
| 2 | Per-customer fee — Coffee+ (bakery/sandwich/matcha) | $25 | USD / verified customer | push-pricing/SKILL.md §2.2 | 2026-04-20 (fa7f9a8) |
| 3 | Per-customer fee — Specialty dessert / boba | $22 | USD / verified customer | push-pricing/SKILL.md §2.2 | 2026-04-20 (fa7f9a8) |
| 4 | Per-customer fee — Boutique fitness single class | $60 | USD / verified customer | push-pricing/SKILL.md §2.2 | 2026-04-20 (fa7f9a8) |
| 5 | Per-customer fee — Beauty / nails single appointment | $85 | USD / verified customer | push-pricing/SKILL.md §2.2 | 2026-04-20 (fa7f9a8) |
| 6 | Merchant Pilot floor | $0 | USD / mo | push-pricing/SKILL.md §2.1 | 2026-04-20 (fa7f9a8) |
| 7 | Merchant Beachhead floor | $500 | USD / mo | push-pricing/SKILL.md §2.1 | 2026-04-20 (fa7f9a8) |
| 8 | Pilot cohort cap (Williamsburg Coffee+) | 10 | merchants | push-pricing/SKILL.md §2.1 | 2026-04-20 (fa7f9a8) |
| 9 | Beachhead merchant window | 11–50 | merchants | push-pricing/SKILL.md §2.1 | 2026-04-20 (fa7f9a8) |
| 10 | Retention add-on — Visit 2 attribution | +$8 | USD / customer | push-pricing/SKILL.md §2.3 | 2026-04-20 (fa7f9a8) |
| 11 | Retention add-on — Visit 3 attribution | +$6 | USD / customer | push-pricing/SKILL.md §2.3 | 2026-04-20 (fa7f9a8) |
| 12 | Retention add-on — Loyalty card onboarding | +$4 | USD / customer | push-pricing/SKILL.md §2.3 | 2026-04-20 (fa7f9a8) |
| 13 | Retention add-on cap (30-day window) | $18 | USD / customer | push-pricing/SKILL.md §2.3 | 2026-04-20 (fa7f9a8) |
| 14 | T1 Clay (Seed) — per verified customer | $5 | USD / verified customer | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 15 | T1 Clay — first-verified-customer bonus | +$10 | USD (one-time) | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 16 | T1 Clay — free item retail value range | $5–15 | USD | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 17 | T1 Clay — free item COGS range | $3–5 | USD | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 18 | T1 Clay monthly theoretical earning range | $30–75 | USD / mo | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 19 | T1 Clay graduation rule | 2 verified customers / first 2 campaigns | threshold | push-creator/SKILL.md §3 | 2026-04-20 (b67de90) |
| 20 | T1 minimum earning guarantee | $15 | USD / triggering event | push-creator/SKILL.md §2; push-pricing/SKILL.md §10 | 2026-04-20 (4cbdbbc) |
| 21 | T1 minimum guarantee cap | 3 events / creator / calendar year | cap | push-creator/SKILL.md §2 | 2026-04-20 (4cbdbbc) |
| 22 | T1 reserve allocation (base case) | $0.30 | USD / verified customer | push-pricing/SKILL.md §5 | 2026-04-20 (4cbdbbc) |
| 23 | T1 reserve — base assumption: fail rate × volume share | 20% × 10% | % | push-pricing/SKILL.md §5 | 2026-04-20 (4cbdbbc) |
| 24 | T1 reserve — worst credible case | $1.80 | USD / verified customer | push-pricing/SKILL.md §5 | 2026-04-20 (4cbdbbc) |
| 25 | T1 reserve — worst case GM compression | –4.7 pts (26.7% → 22.0%) | pts | push-pricing/SKILL.md §5 | 2026-04-20 (4cbdbbc) |
| 26 | T2 Bronze (Explorer) — per verified customer | $15 | USD / verified customer | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 27 | T2 Bronze monthly theoretical range | $150–450 | USD / mo | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 28 | T3 Steel (Operator) — per verified customer | $20 | USD / verified customer | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 29 | T3 Steel — referral commission | 3% | % | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 30 | T3 Steel monthly theoretical range | $400–900 | USD / mo | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 31 | T4 Gold (Proven) — monthly retainer | $800 | USD / mo | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 32 | T4 Gold — per verified customer | $25 | USD / verified customer | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 33 | T4 Gold — referral commission | 10% | % | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 34 | T4 Gold — 30-day guaranteed minimum | $800 | USD / mo | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 35 | T4 Gold monthly theoretical range | $1,500–2,500 | USD / mo | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 36 | T5 Ruby (Closer) — monthly retainer | $1,800 | USD / mo | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 37 | T5 Ruby — per verified customer | $40 | USD / verified customer | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 38 | T5 Ruby — referral commission | 15% | % | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 39 | T5 Ruby — equity grant | 0.02% RSA | % (4yr vest, 1yr cliff) | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 40 | T5 Ruby monthly theoretical range | $3,000–4,500 | USD / mo | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 41 | T6 Obsidian (Partner) — monthly retainer | $3,500 | USD / mo | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 42 | T6 Obsidian — per verified customer | $60 | USD / verified customer | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 43 | T6 Obsidian — referral commission | 20% | % | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 44 | T6 Obsidian — equity range | 0.05–0.2% RSA | % (tenure-dependent) | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 45 | T6 Obsidian monthly theoretical range | $5,000–8,000 | USD / mo | push-creator/SKILL.md §2 | 2026-04-20 (b67de90) |
| 46 | Per-customer GM (Coffee+ base) | $6.67 | USD | push-pricing/SKILL.md §5 | 2026-04-20 (4cbdbbc) |
| 47 | Per-customer GM % | 26.7% | % | push-pricing/SKILL.md §5 | 2026-04-20 (4cbdbbc) |
| 48 | Per-customer AI verification cost | $1.50 | USD / customer | push-pricing/SKILL.md §5 | 2026-04-20 (4cbdbbc) |
| 49 | Per-customer payment processing | $0.75 | USD / customer | push-pricing/SKILL.md §5 | 2026-04-20 (4cbdbbc) |
| 50 | Per-customer allocated ops (incl T1 reserve) | $1.50 | USD / customer | push-pricing/SKILL.md §5 | 2026-04-20 (4cbdbbc) |
| 51 | Per-merchant Month 12 revenue (Coffee+) | $2,620 | USD / mo | push-pricing/SKILL.md §5 | 2026-04-20 (4cbdbbc) |
| 52 | Per-merchant Month 12 COGS | $1,914 | USD / mo | push-pricing/SKILL.md §5 | 2026-04-20 (4cbdbbc) |
| 53 | Per-merchant Month 12 GM | $706 / 26.9% | USD / % | push-pricing/SKILL.md §5 | 2026-04-20 (4cbdbbc) |
| 54 | Assumed customer volume per Coffee+ merchant (M12) | 85 | verified customers / mo | push-pricing/SKILL.md §5 | 2026-04-20 (4cbdbbc) |
| 55 | LTV | $6,354 | USD | push-pricing/SKILL.md §5 | 2026-04-20 (4cbdbbc) |
| 56 | Avg merchant lifetime assumption | 9 | months | push-pricing/SKILL.md §5 | 2026-04-20 (4cbdbbc) |
| 57 | CAC | $420 | USD | push-pricing/SKILL.md §5 | 2026-04-20 (4cbdbbc) |
| 58 | LTV/CAC base | 15.1x | ratio | push-pricing/SKILL.md §5 | 2026-04-20 (4cbdbbc) |
| 59 | LTV/CAC stressed (churn 2x / CAC 1.5x) | 10.0x | ratio | push-pricing/SKILL.md §5 | 2026-04-20 (4cbdbbc) |
| 60 | Per-customer fee floor (coffee+) | $15 | USD | push-pricing/SKILL.md §10 | 2026-04-20 (fa7f9a8) |
| 61 | Creator payout SLA — T1–T3 | 24 | hours | push-pricing/SKILL.md §10 | 2026-04-20 (fa7f9a8) |
| 62 | Creator payout SLA — T4–T6 retainer | 1st of month | date | push-pricing/SKILL.md §10 | 2026-04-20 (fa7f9a8) |
| 63 | Creator payout SLA — T4–T6 perf bonus | 15th of month | date | push-pricing/SKILL.md §10 | 2026-04-20 (fa7f9a8) |
| 64 | SLR target — Month 6 | ≥12 | ratio (Active Campaigns / Ops FTE) | push-metrics/SKILL.md §1.2 | 2026-04-20 (56737db) |
| 65 | SLR target — Month 12 | ≥25 | ratio | push-metrics/SKILL.md §1.2 | 2026-04-20 (56737db) |
| 66 | SLR target — Month 24 | ≥50 | ratio | push-metrics/SKILL.md §1.2 | 2026-04-20 (56737db) |
| 67 | Ops FTE hours-per-month denominator | 160 | hours | push-metrics/SKILL.md §1.1 | 2026-04-20 (56737db) |
| 68 | SLR verifying-state campaign rolloff | 48 | hours | push-metrics/SKILL.md §1.1 | 2026-04-20 (56737db) |
| 69 | AutoVerification coverage impact on SLR | 40% | % of M-12 impact | push-metrics/SKILL.md §1.4 | 2026-04-20 (56737db) |
| 70 | Onboarding load impact on SLR | 25% | % of M-12 impact | push-metrics/SKILL.md §1.4 | 2026-04-20 (56737db) |
| 71 | Dispute load impact on SLR | 20% | % of M-12 impact | push-metrics/SKILL.md §1.4 | 2026-04-20 (56737db) |
| 72 | Merchant retention impact on SLR | 15% | % of M-12 impact | push-metrics/SKILL.md §1.4 | 2026-04-20 (56737db) |
| 73 | ConversionOracle precision target (M-12) | ≥92% | % | push-metrics/SKILL.md §6.x | 2026-04-20 (56737db) |
| 74 | ConversionOracle recall target (M-12) | ≥88% | % | push-metrics/SKILL.md §6.x | 2026-04-20 (56737db) |
| 75 | Manual intervention rate — Month 6 | ≤15% | % | push-metrics/SKILL.md §6.x | 2026-04-20 (56737db) |
| 76 | Manual intervention rate — Month 12 | ≤8% | % | push-metrics/SKILL.md §6.x | 2026-04-20 (56737db) |
| 77 | Manual intervention rate — Month 24 | ≤3% | % | push-metrics/SKILL.md §6.x | 2026-04-20 (56737db) |
| 78 | DisclosureBot false-positive rate target | ≤5% | % | push-metrics/SKILL.md §6.x | 2026-04-20 (56737db) |
| 79 | Ops FTE utilization target band | 60–85% | % | push-metrics/SKILL.md §6.x | 2026-04-20 (56737db) |
| 80 | Competitor SLR — OpenTable (est.) | ~300 | ratio | push-metrics/SKILL.md §6.x.3 | 2026-04-20 (56737db) |
| 81 | Competitor SLR — DoorDash (est.) | ~50 | ratio | push-metrics/SKILL.md §6.x.3 | 2026-04-20 (56737db) |
| 82 | Competitor SLR — Whalar / creator marketplace (est.) | ~8–12 | ratio | push-metrics/SKILL.md §6.x.3 | 2026-04-20 (56737db) |
| 83 | Competitor SLR — traditional agency | 3–5 | ratio | push-metrics/SKILL.md §6.x.3 | 2026-04-20 (56737db) |
| 84 | Push Score weight — Completion Rate | 30% | % | push-creator/SKILL.md §4 | 2026-04-20 (b67de90) |
| 85 | Push Score weight — Reliability | 20% | % | push-creator/SKILL.md §4 | 2026-04-20 (b67de90) |
| 86 | Push Score weight — Content Quality | 25% | % | push-creator/SKILL.md §4 | 2026-04-20 (b67de90) |
| 87 | Push Score weight — Merchant Satisfaction | 15% | % | push-creator/SKILL.md §4 | 2026-04-20 (b67de90) |
| 88 | Push Score weight — Engagement | 10% | % | push-creator/SKILL.md §4 | 2026-04-20 (b67de90) |
| 89 | Tier promotion — T2 threshold (verified customers cumulative) | 10 | customers | push-creator/SKILL.md §3 | 2026-04-20 (b67de90) |
| 90 | Tier promotion — T2→T3 Push Score | ≥55 | score | push-creator/SKILL.md §3 | 2026-04-20 (b67de90) |
| 91 | Tier promotion — T3→T4 monthly throughput (invite) | ≥20 | customers / mo | push-creator/SKILL.md §3 | 2026-04-20 (b67de90) |
| 92 | Tier promotion — T3→T4 Push Score | ≥70 | score | push-creator/SKILL.md §3 | 2026-04-20 (b67de90) |
| 93 | Tier promotion — T4→T5 throughput at M-6 | ≥40 | customers / mo | push-creator/SKILL.md §3 | 2026-04-20 (b67de90) |
| 94 | Tier promotion — T4→T5 Push Score | ≥80 | score | push-creator/SKILL.md §3 | 2026-04-20 (b67de90) |
| 95 | Tier promotion — T5→T6 tenure | ≥12 | months | push-creator/SKILL.md §3 | 2026-04-20 (b67de90) |
| 96 | Tier promotion — T5→T6 Push Score | ≥90 | score | push-creator/SKILL.md §3 | 2026-04-20 (b67de90) |
| 97 | Demotion grace period | 30 | days | push-creator/SKILL.md §3 | 2026-04-20 (b67de90) |
| 98 | Dispute — creator at fault score delta | –15 | score | push-creator/SKILL.md §5 | 2026-04-20 (b67de90) |
| 99 | Dispute — partially at fault score delta | –8 | score | push-creator/SKILL.md §5 | 2026-04-20 (b67de90) |
| 100 | Dispute — merchant false claim delta | +2 | score | push-creator/SKILL.md §5 | 2026-04-20 (b67de90) |
| 101 | Verified customer fraud penalty | –25 score + 30-day suspension | score + days | push-creator/SKILL.md §5 | 2026-04-20 (b67de90) |
| 102 | Engagement cap in Push Score | 10% | % | push-creator/SKILL.md §5 | 2026-04-20 (b67de90) |
| 103 | Creator completion rate target | ≥85% | % | push-metrics/SKILL.md §3 | 2026-04-20 (56737db) |
| 104 | Campaign time-to-fill target | <48 | hours | push-metrics/SKILL.md §4 | 2026-04-20 (56737db) |
| 105 | Campaign fill rate target | >80% | % | push-metrics/SKILL.md §4 | 2026-04-20 (56737db) |
| 106 | ML Advisor equity range disclosed | 0.25–0.5% RSA | % (2yr vest, 6mo cliff) | docs/hiring/ml_advisor_outreach_tracker.md §L7 | 2026-04-20 (76689e1) |
| 107 | ML Advisor time commitment | 2–4 | hrs / week | docs/hiring/ml_advisor_outreach_tracker.md §L6 | 2026-04-20 (76689e1) |
| 108 | ML Advisor outreach target | 15 | rows | docs/hiring/ml_advisor_outreach_tracker.md §Tracker | 2026-04-20 (76689e1) |
| 109 | ML Advisor response SLA | 10 | days | docs/hiring/ml_advisor_outreach_tracker.md §Tracker | 2026-04-20 (76689e1) |
| 110 | ML Advisor ship criterion (Day 14) | ≥1 real conversation | count | docs/hiring/ml_advisor_outreach_tracker.md §Daily Notes | 2026-04-20 (76689e1) |
| 111 | EEOC retention — non-hire | 12 | months | docs/hiring/ml_advisor_outreach_tracker.md §Compliance | 2026-04-20 (76689e1) |
| 112 | EEOC retention — hire | 7 | years | docs/hiring/ml_advisor_outreach_tracker.md §Compliance | 2026-04-20 (76689e1) |

---

## Derived / Reference Figures

| # | Metric | Value | Source / Formula |
|---|---|---|---|
| D1 | Merchant acquisition payback (base) | ~0.59 months | CAC $420 / monthly GM $706 |
| D2 | Breakeven verified customers / merchant | ~56 / mo | $706 / $25 / (706/2620) ratio; inferred from §5 |
| D3 | Number of "Push is NOT" categories | 7 | push-strategy/SKILL.md §External Positioning |
| D4 | Number of Killer Lines (v5.2) | 5 | push-strategy/SKILL.md §External Positioning |
| D5 | Number of Messaging sub-matrices | 4 | push-strategy/SKILL.md §External Positioning |

*Derived figures are not sourced directly in SKILLs; they are arithmetic from master-table values. Do not cite them in investor materials without confirming the derivation above is still valid.*

---

## Reconciliation Issues Found

Each entry below is a drift, ambiguity, or under-specification found during the 2026-04-20 reconciliation sweep. Each carries a proposed resolution; owner to triage by next Monday review.

### I-1 — T1 "$15 if 1 campaign / 0 verified" language divergence

- **push-creator/SKILL.md §2** phrases as: "T1 minimum earning guarantee: $15 if 1 campaign completed with 0 verified customers (merchant fail-to-deliver protection)."
- **push-pricing/SKILL.md §10** phrases as: "T1 minimum earning guarantee: $15 paid if a T1 creator completes 1 campaign with 0 verified customers, per the decision tree."
- **Creator Terms disclosure (push-creator §2 verbatim block)** conditions payment on: zero verified within **14 days** of campaign close, plus 4 exclusions (early termination / creator at fault / pre-Beachhead campaign / prior 3 triggering events).
- **Drift:** the pricing-side phrasing omits the 14-day window and the 4 exclusions; the creator-side phrasing omits explicit reference to the 3-event cap in the same sentence (covered elsewhere in §2 but not adjacent).
- **Proposed resolution:** fix push-pricing §10 to include "per the Creator Terms disclosure" + cross-reference to push-creator §2 rather than restating. Owner: pricing owner, by next Monday review.

### I-2 — "Allocated ops" value: $1.50 sum vs ($1.20 + $0.30) components

- **push-pricing/SKILL.md §5** states: `Allocated ops: $1.50 (was $1.20 + T1 fail-to-deliver reserve $0.30)`.
- **Immediately below that line:** `T1 fail-to-deliver reserve: $0.30`.
- **Ambiguity:** a reader counting line items could double-count the $0.30 (once inside allocated ops, once as a separate line item). The file's own math balances ($6.67 GM), but the visual structure invites misquote.
- **Proposed resolution:** restructure §5 so the $0.30 is shown as a *decomposition* of the $1.50 allocated-ops line, not as a peer line item. Owner: pricing owner.

### I-3 — Push Score weights: 5-dimension sum = 100% (confirmed)

- **push-creator/SKILL.md §4:** 30 + 20 + 25 + 15 + 10 = 100%. No drift.
- **Action:** none required; this row exists in the master table to prevent future drift.

### I-4 — Creator compensation summary in push-pricing §3 vs push-creator §2

- **push-pricing §3** summarizes all 6 tiers in a single table.
- **push-creator §2** has per-tier subsections with more detail.
- **Values:** match for T1–T6 (cross-verified during reconciliation).
- **Ambiguity:** push-pricing §3 uses "Commission" column header; push-creator §2 uses "referral commission". Minor wording drift only.
- **Proposed resolution:** low priority; align on next edit of either file.

### I-5 — Per-customer AOV ranges quoted in push-pricing §2.2

- **push-pricing/SKILL.md §2.2** quotes AOV ranges (Pure coffee $5–8, Coffee+ $8–20, Specialty dessert/boba $7–14, Fitness $25–45, Beauty/nails $40–120).
- **These are merchant-side AOV at merchant's till, not Push's revenue line.** They inform per-customer fee selection but are not directly quoted elsewhere.
- **Action:** none; flagged for future reviewers so they don't confuse merchant AOV with Push revenue.

### I-6 — SLR verifying-state rolloff: 48h in §1.1 vs SQL uses `interval '48 hours'`

- **push-metrics/SKILL.md §1.1** states "count for 48h then roll off".
- **push-metrics/SKILL.md §6.x.1 SQL** uses `c.last_scan_at > now() - interval '48 hours'`.
- Consistent. No drift.

### I-7 — Competitor SLR confidence labels

- **push-metrics/SKILL.md §6.x.3** labels OpenTable "Low confidence", Whalar "Very Low", DoorDash "Medium", traditional agency "Medium".
- **The rollup summary (P1_rollup.md §P1-4)** currently lists the numbers without the confidence labels.
- **Proposed resolution:** when quoting competitor SLR externally, always include the confidence label (already required by the source file's footnote). Owner: whoever drafts the next external comms.

### I-8 — "18 downstream files with v4.1 tier hex strings"

- **CHANGELOG.md + P1_rollup.md** both reference "18 downstream files" needing a sweep.
- **Not enumerated in any SKILL.md.** The claim is carried in the rollup/CHANGELOG only.
- **Proposed resolution:** when P0-6 sweep is scoped, produce a file-list and attach it to the ticket. Do not quote "18" as an exact count in external artifacts until verified.

### I-9 — Financial model `.xlsx` absence

- **CLAUDE.md / CHANGELOG.md** both reference a financial model xlsx.
- **File not present in repo.**
- **Risk:** investor-facing Excel may drift from SKILL.md markdown.
- **Proposed resolution:** either (a) commit the xlsx as the source of truth and mark SKILL.md "derived from xlsx", or (b) confirm SKILL.md markdown as SoT and kill references to xlsx. Decision by founder, tracked in P2 wave.

### I-10 — Dispute delta values present in 2 places

- **push-creator/SKILL.md §5 (Dispute Impact table):** –15 / –8 / 0 / +2.
- **push-creator/SKILL.md §2 Decision Tree branch 2:** "–15 score" (matches).
- **push-creator/SKILL.md §2 Decision Tree branch 4:** "–25 score" — for fraud, not general dispute fault. Not the same metric.
- No drift; flagged only so future readers do not conflate the dispute –15 with the fraud –25.

---

## Wave 3 Additions (2026-04-20, post-audit)

Per `docs/v5_2_status/audits/01-numeric-audit.md` §5 "Reconciliation Table Gaps", these 16 metrics were quoted in committed artefacts but missing from the master table. Added as rows 118–133.

| # | Metric | Value | Unit | Source (file:§) | Last Updated |
|---|---|---|---|---|---|
| 118 | T1 minimum-guarantee trigger window | 14 | days post-campaign | push-creator/SKILL.md §2 | 2026-04-20 (bb9319e) |
| 119 | T1 entry criterion (minimum social proof) | 500 followers OR 5 organic local posts | — | push-creator/SKILL.md §3 | 2026-04-20 (b67de90) |
| 120 | AutoVerification coverage playbook trigger | ≥70% by M-6; ≥85% by M-12 | % | push-metrics/SKILL.md §6.2 | 2026-04-20 (cafc0ec) |
| 121 | Onboarding hours playbook threshold | 8 | hours/merchant | push-metrics/SKILL.md §6.2 | 2026-04-20 (cafc0ec) |
| 122 | Dispute minutes playbook threshold | 45 | minutes/dispute | push-metrics/SKILL.md §6.2 | 2026-04-20 (cafc0ec) |
| 123 | Competitor-copy window (strategic estimate) | 24 | months | push-strategy/SKILL.md §Messaging Matrix 2 | 2026-04-20 (820cf79) |
| 124 | Pre-competitor label target (pilot) | 10,000 | labeled events | push-strategy/SKILL.md §Messaging Matrix 2 | 2026-04-20 (820cf79) |
| 125 | First verified pilot results window | week of 2026-06-22 (Week 4 of Q2 2026) | calendar | FTC disclosure footers; docs/hiring/inmail_drafts.md (10×) | 2026-04-20 (Wave 3) |
| 126 | Time-to-first-creator (marketing target) | 24 | hours | app/(marketing)/page.tsx hero stats | 2026-04-20 (f5532a6) |
| 127 | Creator-match-rate target (marketing; NOT a committed KPI) | 87% | within 2-mile radius | app/(marketing)/page.tsx L841 | 2026-04-20 — **flagged as illustrative; confirm or remove before investor call** |
| 128 | Month-1 prorate trigger | < 5 | verified customers | push-pricing/SKILL.md §10; landing Beachhead card | 2026-04-20 (fa7f9a8) |
| 129 | US local ad spend TAM | $47B | annual USD | app/(marketing)/page.tsx proof strip | 2026-04-20 — **needs public-report citation** |
| 130 | NYC local advertising market | $2B+ | annual USD | app/(marketing)/page.tsx proof strip | 2026-04-20 — **needs citation** |
| 131 | NYC local businesses count | 230,000+ | businesses | app/(marketing)/page.tsx proof strip | 2026-04-20 — **needs citation** |
| 132 | NYC F&B + lifestyle creators count | 50,000+ | creators | app/(marketing)/page.tsx proof strip | 2026-04-20 — **needs citation** |
| 133 | Creator signup target (CTA copy) | 30 | seconds | app/(marketing)/page.tsx final CTA | 2026-04-20 (f5532a6) |

### §Marketing Illustratives (data-mock numbers)

Numbers below carry `data-mock="true"` + asterisk disclosure on landing/portal pages. Illustrative only — NOT commitments. Must NEVER appear in investor decks, press, or legal filings without the illustrative label.

| # | Illustrative | Location | Disclosure |
|---|---|---|---|
| I-01 | "+$32" per verified visit (×7 placements) | app/(marketing)/page.tsx attribution dashboard | FTC footer |
| I-02 | "$1,504" attributed revenue | app/(marketing)/page.tsx attribution dashboard + hero preview | FTC footer |
| I-03 | "47" QR scans / QR scans today | app/(marketing)/page.tsx attribution dashboard + hero preview | FTC footer |
| I-04 | "3.2×" ROI vs spend | app/(marketing)/page.tsx attribution dashboard | FTC footer |
| I-05 | "12+" / "47+" / "$8.2K" proof strip | app/(marketing)/page.tsx proof strip | FTC footer |
| I-06 | "5 / 10 / 15 / 10" portal KPI stats | app/page.tsx portal | FTC footer |
| I-07 | "Illustrative Coffee+ merchant ≈ $2,620/mo" ROI example | app/(marketing)/page.tsx pricing section | FTC footer |
| I-08 | "14 / 20 slots filled / 70%" campaign-preview progress | app/(marketing)/page.tsx hero preview | FTC footer |
| I-09 | "Score 94 · Operator" matched-creator badge | app/(marketing)/page.tsx hero preview | FTC footer |

### §Change Log

- **2026-04-20 (Wave 1)** — initial 117 rows compiled from P1-1 through P1-5 commits.
- **2026-04-20 (Wave 3, post-audit)** — added rows 118–133 and §Marketing Illustratives per audit 01-numeric-audit.md §5. Row 127 ("87% creator match") flagged for confirm-or-remove; rows 129–132 flagged for citation; row 125 canonicalized "Week 4 of 2026-Q2" → "week of 2026-06-22".

---

*Review cadence: weekly, every Monday by ops lead. This file must be updated before any quoted v5.2 number is published in an external artefact (pitch deck, landing page, investor memo, press release). If a drift is found, fix the quotation; do not silently edit this file's Value column without a commit that explains the change in plain English.*
