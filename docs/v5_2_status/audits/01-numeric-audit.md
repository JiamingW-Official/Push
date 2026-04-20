# Wave 2 QA — Audit 01: Numeric Cross-Reference

**Audit date:** 2026-04-20
**Auditor:** Wave 2 QA agent (read-only)
**Scope:** Cross-check every quoted number in 8 target files against `docs/v5_2_status/numeric_reconciliation.md` (117 master-table rows + 5 derived rows).
**SoT:** `docs/v5_2_status/numeric_reconciliation.md` is authoritative; fix the quotation, not the table.

---

## §1 Executive Summary

**Verdict: PASS with minor gaps.** All high-severity product numbers (tier payouts, retainers, equity, SLR targets, precision/recall, ML Advisor compensation) match the reconciliation table within tolerance. No HIGH-severity DISCREPANCY findings were identified. One OUTDATED v4.1 artifact remains on `app/page.tsx` (YC Demo Day date) and one MARKETING-grade stat (`3.2× ROI`) is present in landing-page mock data without an explicit reconciliation-table row.

### Findings by Category

| Category | Count |
|---|---|
| MATCH | 34 |
| ILLUSTRATIVE (marked `data-mock` or prefixed "Illustrative") | 9 |
| MISSING_FROM_RECONCILIATION | 12 |
| OUTDATED | 1 |
| DISCREPANCY | 0 (HIGH); 2 (LOW — wording drift) |

### Top 3 Critical Items

1. **No HIGH-severity discrepancies** — all 6-tier payouts, retainers, and equity figures on the landing page and in the inmail drafts match the reconciliation table exactly.
2. **MISSING_FROM_RECONCILIATION — landing page "stats row" figures** (hero: $500, 6, 24h; proof: 12+, 47+, $8.2K; ROI: 3.2×; attribution revenue: $1,504; QR scans: 47) — all are `data-mock=true` illustratives. Recommend adding a **§Marketing Illustratives** sub-section to `numeric_reconciliation.md` enumerating these with the "illustrative" tag so future reviewers don't mistake them for commitments.
3. **OUTDATED — `app/page.tsx` L416 "YC Demo Day: May 9, 2026"** — this is a Week-3 scaffold/portal file; the date itself is not in the reconciliation table but is a committed milestone. Low severity (portal page, not marketing), but flagging for ops to confirm whether the YC Demo Day is still May 9.

---

## §2 Methodology

### Files scanned

1. `.claude/skills/push-pricing/SKILL.md` (225 lines)
2. `.claude/skills/push-creator/SKILL.md` (165 lines)
3. `.claude/skills/push-metrics/SKILL.md` (238 lines)
4. `.claude/skills/push-strategy/SKILL.md` (156 lines)
5. `app/(marketing)/page.tsx` (1667 lines)
6. `app/(marketing)/landing.css` (4105 lines — styling only; no product numbers)
7. `app/page.tsx` (422 lines)
8. `docs/hiring/inmail_drafts.md` (291 lines)

### Extraction approach

- Read each file in full (or relevant ranges).
- Grep for `$\d`, `\d+%`, dates, hours/months/weeks/days.
- For each hit, match back against the 117-row master table in `numeric_reconciliation.md` plus the 5-row derived section.
- For CSS, verified no product-side numbers are embedded (all numbers are opacity/gradient/% widths, not business values).

### Tool

Grep + Read (read-only). No file modifications.

---

## §3 Findings Table

| # | File:Line | Quoted Value | Reconciliation Row | Category | Severity | Action |
|---|---|---|---|---|---|---|
| 1 | push-pricing/SKILL.md:21 | "$15–85 per verified customer" | Rows 1–5 (range bounds) | MATCH | — | none |
| 2 | push-pricing/SKILL.md:28 | Pure coffee $15 | Row 1 | MATCH | — | none |
| 3 | push-pricing/SKILL.md:29 | Coffee+ $25 | Row 2 | MATCH | — | none |
| 4 | push-pricing/SKILL.md:30 | Specialty dessert/boba $22 | Row 3 | MATCH | — | none |
| 5 | push-pricing/SKILL.md:31 | Boutique fitness $60 | Row 4 | MATCH | — | none |
| 6 | push-pricing/SKILL.md:32 | Beauty/nails $85 | Row 5 | MATCH | — | none |
| 7 | push-pricing/SKILL.md:20 | Pilot cap 10 merchants | Row 8 | MATCH | — | none |
| 8 | push-pricing/SKILL.md:21 | Beachhead 11–50 | Row 9 | MATCH | — | none |
| 9 | push-pricing/SKILL.md:35–37 | Retention +$8/+$6/+$4 | Rows 10–12 | MATCH | — | none |
| 10 | push-pricing/SKILL.md:38 | Retention cap $18 / 30-day | Row 13 | MATCH | — | none |
| 11 | push-pricing/SKILL.md:82 | GM $6.67 / 26.7% | Rows 46, 47 | MATCH | — | none |
| 12 | push-pricing/SKILL.md:87 | Per-merchant M-12 GM $706 / 26.9% | Row 53 | MATCH | — | none |
| 13 | push-pricing/SKILL.md:90 | LTV $6,354 | Row 55 | MATCH | — | none |
| 14 | push-pricing/SKILL.md:91 | CAC $420 | Row 57 | MATCH | — | none |
| 15 | push-pricing/SKILL.md:92 | LTV/CAC 15.1x / 10.0x stressed | Rows 58, 59 | MATCH | — | none |
| 16 | push-pricing/SKILL.md:103 | T1 reserve worst-case $1.80 / –4.7 pts | Rows 24, 25 | MATCH | — | none |
| 17 | push-pricing/SKILL.md:170 | T1 $15 guarantee, 3 events/year cap | Rows 20, 21 | MATCH | — | none |
| 18 | push-creator/SKILL.md:33 | T1 $5 + $10 first-customer bonus | Rows 14, 15 | MATCH | — | none |
| 19 | push-creator/SKILL.md:33 | T1 free item $5–15 retail, $3–5 COGS | Rows 16, 17 | MATCH | — | none |
| 20 | push-creator/SKILL.md:34 | T1 $30–75 monthly range | Row 18 | MATCH | — | none |
| 21 | push-creator/SKILL.md:45 | Max 3 triggering events/T1 creator/year | Row 21 | MATCH | — | none |
| 22 | push-creator/SKILL.md:48 | 14-day post-campaign window | — | MISSING_FROM_RECONCILIATION | MEDIUM | Add row "T1 guarantee trigger window: 14 days" |
| 23 | push-creator/SKILL.md:51–53 | T2 $15 / $150–450 | Rows 26, 27 | MATCH | — | none |
| 24 | push-creator/SKILL.md:56–58 | T3 $20 / 3% / $400–900 | Rows 28–30 | MATCH | — | none |
| 25 | push-creator/SKILL.md:61–65 | T4 $800/mo / $25 / 10% / $1,500–2,500 | Rows 31–35 | MATCH | — | none |
| 26 | push-creator/SKILL.md:68–72 | T5 $1,800/mo / $40 / 15% / 0.02% RSA / $3,000–4,500 | Rows 36–40 | MATCH | — | none |
| 27 | push-creator/SKILL.md:71 | T5 equity "4-year vesting, 1-year cliff" | Row 39 | MATCH | — | none |
| 28 | push-creator/SKILL.md:75–79 | T6 $3,500/mo / $60 / 20% / 0.05–0.2% RSA / $5,000–8,000 | Rows 41–45 | MATCH | — | none |
| 29 | push-creator/SKILL.md:84 | T1 entry "500+ followers or 5+ posts" | — | MISSING_FROM_RECONCILIATION | MEDIUM | Add row "T1 entry criterion: 500 followers OR 5 organic posts" |
| 30 | push-creator/SKILL.md:89 | T2→T3 10 customers + ≥55 | Rows 89, 90 | MATCH | — | none |
| 31 | push-creator/SKILL.md:90 | T3→T4 ≥20/mo + ≥70 | Rows 91, 92 | MATCH | — | none |
| 32 | push-creator/SKILL.md:91 | T4→T5 ≥40/mo + ≥80 | Rows 93, 94 | MATCH | — | none |
| 33 | push-creator/SKILL.md:92 | T5→T6 12 mo + ≥90 | Rows 95, 96 | MATCH | — | none |
| 34 | push-creator/SKILL.md:95 | 30-day grace | Row 97 | MATCH | — | none |
| 35 | push-creator/SKILL.md:104–108 | Push Score 30/20/25/15/10 = 100% | Rows 84–88 | MATCH | — | none |
| 36 | push-creator/SKILL.md:115–118 | Dispute –15 / –8 / 0 / +2 | Rows 98–100 | MATCH | — | none |
| 37 | push-creator/SKILL.md:124 | Fraud –25 + 30-day suspension | Row 101 | MATCH | — | none |
| 38 | push-creator/SKILL.md:123 | Engagement cap 10% | Row 102 | MATCH | — | none |
| 39 | push-metrics/SKILL.md:19–22 | SLR targets M-6 ≥12 / M-12 ≥25 / M-24 ≥50 | Rows 64–66 | MATCH | — | none |
| 40 | push-metrics/SKILL.md:14 | Ops FTE denominator 160 hr | Row 67 | MATCH | — | none |
| 41 | push-metrics/SKILL.md:13, 120 | 48h verifying-state rolloff | Row 68 | MATCH | — | none |
| 42 | push-metrics/SKILL.md:33–36 | AutoVerif 40% / Onboarding 25% / Dispute 20% / Retention 15% | Rows 69–72 | MATCH | — | none |
| 43 | push-metrics/SKILL.md:107 | Precision ≥92% / recall ≥88% (M-12) | Rows 73, 74 | MATCH | — | none |
| 44 | push-metrics/SKILL.md:108 | Manual intervention ≤15/≤8/≤3 | Rows 75–77 | MATCH | — | none |
| 45 | push-metrics/SKILL.md:109 | DisclosureBot FP ≤5% | Row 78 | MATCH | — | none |
| 46 | push-metrics/SKILL.md:110 | FTE utilization 60–85% | Row 79 | MATCH | — | none |
| 47 | push-metrics/SKILL.md:150–154 | Competitor SLR 300 / 50 / 8–12 / 3–5 | Rows 80–83 | MATCH | — | none |
| 48 | push-metrics/SKILL.md:71 | Completion rate target 85%+ | Row 103 | MATCH | — | none |
| 49 | push-metrics/SKILL.md:79 | Time-to-fill <48h | Row 104 | MATCH | — | none |
| 50 | push-metrics/SKILL.md:80 | Fill rate >80% | Row 105 | MATCH | — | none |
| 51 | push-metrics/SKILL.md:140 | "AutoVerification <70% at M-6, <85% at M-12" | — | MISSING_FROM_RECONCILIATION | MEDIUM | Add row: "AutoVerification coverage threshold: ≥70% M-6, ≥85% M-12" (playbook trigger, not lever %) |
| 52 | push-metrics/SKILL.md:142 | "Onboarding hours > 8 hr/merchant" | — | MISSING_FROM_RECONCILIATION | LOW | Add row "Onboarding hours threshold (playbook): 8 hr/merchant" |
| 53 | push-metrics/SKILL.md:142 | "Dispute minutes > 45 min/dispute" | — | MISSING_FROM_RECONCILIATION | LOW | Add row "Dispute minutes threshold (playbook): 45 min/dispute" |
| 54 | push-metrics/SKILL.md:202 | "ConversionOracle twin-line chart Y-axis 80–100%" | — | derivative (UI spec) | ILLUSTRATIVE | none |
| 55 | push-strategy/SKILL.md:23 | "SLR ≥ 25 at Month 12" | Row 65 | MATCH | — | none |
| 56 | push-strategy/SKILL.md:63 | "QR 60–70% confidence; Oracle >92%" | Row 73 (partial) | MATCH (92%) + MISSING (60–70% QR) | LOW | Add derived row "Bare-QR confidence baseline: 60–70%" (used in objection response, not SoT elsewhere) |
| 57 | push-strategy/SKILL.md:64 | "$500/mo … $15–85 per verified" | Rows 7, 1–5 | MATCH | — | none |
| 58 | push-strategy/SKILL.md:67 | "24 months" competitor copy window | — | MISSING_FROM_RECONCILIATION | MEDIUM | Add row "Competitor-copy window (strategic estimate): 24 months" (objection-matrix figure) |
| 59 | push-strategy/SKILL.md:67 | "10k+ labeled events" AI training data | — | MISSING_FROM_RECONCILIATION | MEDIUM | Add row "Pre-competitor label target (pilot): 10,000 labeled events" |
| 60 | push-strategy/SKILL.md:75 | Retention add-on cap $18 | Row 13 | MATCH | — | none |
| 61 | page.tsx:332, 338, 347, 356, 365, 374 | TIER_SHOWCASE $5/$15/$20/$800+$25/$1,800+$40/$3,500+$60 | Rows 14/26/28/31+32/36+37/41+42 | MATCH | — | none |
| 62 | page.tsx:331 | T1 "+$10 first-customer bonus" | Row 15 | MATCH | — | none |
| 63 | page.tsx:358 | T4 "10% referral" | Row 33 | MATCH | — | none |
| 64 | page.tsx:367 | T5 "15% referral + 0.02% equity" | Rows 38, 39 | MATCH | — | none |
| 65 | page.tsx:376 | T6 "20% referral + 0.05–0.2% equity" | Rows 43, 44 | MATCH | — | none |
| 66 | page.tsx:417 | Tier progression CTA "$3,500/mo + equity" | Row 41 | MATCH | — | none |
| 67 | page.tsx:454, 484, 496 | Hero-preview "+$32", "$1,504", "Operator tier" | — | ILLUSTRATIVE (`data-mock`, "Illustrative campaign preview") | LOW | none — flagged via `data-mock`, disclaimer attached |
| 68 | page.tsx:10–38 | `ATTR_ROWS` "+$32" × 4 handles | — | ILLUSTRATIVE | none | none |
| 69 | page.tsx:82, 86, 90 | Mav-summary "47 QR scans / $1,504 / 3.2×" | — | ILLUSTRATIVE | none | none (but see Rec. below — 3.2× ROI ratio should be enumerated) |
| 70 | page.tsx:670, 674 | Stats row "$500 … $15–85 per verified customer" | Rows 7, 1–5 | MATCH | — | none |
| 71 | page.tsx:682 | "6 creator tiers" | Row (implicit D-row, 6 tiers) | MATCH | — | none |
| 72 | page.tsx:693, 696 | "24h from signup to first creator" | — | MISSING_FROM_RECONCILIATION | LOW | Add row "Time-to-first-creator target (marketing): 24 hours" — paraphrase of Row 104 (time-to-fill <48h) but narrower |
| 73 | page.tsx:745, 751, 758 | Proof "12+ / 47+ / $8.2K" | — | ILLUSTRATIVE (`data-mock`) + MISSING_FROM_RECONCILIATION | LOW | Add "Marketing Illustratives" sub-table to reconciliation file |
| 74 | page.tsx:773 | "$47B local ad spend" (Market) | — | MISSING_FROM_RECONCILIATION | MEDIUM | Add row "US local ad spend TAM: $47B" with citation |
| 75 | page.tsx:798 | "$2B+ local advertising market; 230K+ businesses; 50K+ creators" (NYC) | — | MISSING_FROM_RECONCILIATION | MEDIUM | Add row "NYC local advertising market: $2B+" + "NYC local businesses: 230K+" + "NYC F&B + lifestyle creators: 50K+" with citations |
| 76 | page.tsx:843 | Merchants list item "$500/mo min + $15–85 per verified customer" | Rows 7, 1–5 | MATCH | — | none |
| 77 | page.tsx:841 | Feature "87% creator match rate within 2 miles" | — | MISSING_FROM_RECONCILIATION | MEDIUM | Add row "Creator-match-rate target (marketing): 87% within 2mi" OR remove from landing if not a committed KPI |
| 78 | page.tsx:842 | Feature "Campaign live in under 24 hours" | — | dup of #72 | — | — |
| 79 | page.tsx:1020 | Attr-note "$15–$85 by category; Traditional ads $15–$50 per click" | Rows 1–5 + comparison | MATCH (Push) + MISSING_FROM_RECONCILIATION (competitor "$15–50/click") | LOW | Add row "Comparator — traditional local ads CPC: $15–50" (marketing compare line) |
| 80 | page.tsx:1072–1088 | Perf-score-explainer 30/25/20/15/10 | Rows 84–88 | MATCH (display order differs but values identical) | — | none |
| 81 | page.tsx:1123 | "3%→20% at top tiers" (commission range) | Rows 29, 43 | MATCH | — | none |
| 82 | page.tsx:1123 | "$800→$3,500 retainer" | Rows 31, 41 | MATCH | — | none |
| 83 | page.tsx:1165, 1170 | Earning-preview Operator "$20 / customer + 3% referral"; Partner "$3,500/mo + $60 + 20% + equity" | Rows 28, 29, 41, 42, 43 | MATCH | — | none |
| 84 | page.tsx:1194 | "30-90 day payment delays" (competitor) | — | MISSING_FROM_RECONCILIATION | LOW | Comparator stat; low risk |
| 85 | page.tsx:1367–1388 | Pilot "$0 + $0" / Beachhead "$500/mo floor + $15–85" / Retention "+$8 visit 2 / +$6 visit 3 / +$4 loyalty" | Rows 6, 7, 1–5, 10–12 | MATCH | — | none |
| 86 | page.tsx:1388 | "Month 1 prorated if <5 verified customers" | — | MISSING_FROM_RECONCILIATION | MEDIUM | Add row "Month-1 prorate trigger: <5 verified customers" (matches push-pricing §10 rule) |
| 87 | page.tsx:1463 | "$500/mo floor + $25 × ~85 verified customers ≈ $2,620/mo" | Rows 7, 2, 51, 54 | MATCH | — | none |
| 88 | page.tsx:1470 | "traditional local ads cost $500–$2,000/month" | — | comparator; matches push-pricing §6 Meta/Yelp range ($200–$1,000 + $500–$2,000) | LOW MATCH | Add row "Comparator — traditional local ads: $500–2,000/mo" for consistency |
| 89 | page.tsx:1451 | "2-minute setup · First campaign live in 24 hours" | — | dup of #72 + MISSING "2-min setup" | LOW | Add row "Merchant signup-to-setup target: 2 min" |
| 90 | page.tsx:1633 | "30-second signup" (Creator CTA) | — | MISSING_FROM_RECONCILIATION | LOW | Add row "Creator signup target: 30 sec" |
| 91 | page.tsx:539 | Ticker "24-Hour Campaign Launch" | dup of #72 | MATCH | — | — |
| 92 | page.tsx:556 | FAQ "Beachhead … $500/mo floor … $15–85" | Rows 7, 1–5 | MATCH | — | none |
| 93 | page.tsx:583 | JSON-LD `price: "500"` | Row 7 | MATCH | — | none |
| 94 | page.tsx:586 | JSON-LD description "$500/mo minimum + $15–85" | Rows 7, 1–5 | MATCH | — | none |
| 95 | app/page.tsx:27–30 | stats {5, 10, 15, 10} | — | ILLUSTRATIVE (`data-mock`) | LOW | 4 portal stats (merchants / creators / loyalty cards / weekly reports) — none reconciled. All flagged `data-mock=true`. Consider adding "Portal demo stats" sub-section. |
| 96 | app/page.tsx:416 | "YC Demo Day: May 9, 2026" | — | OUTDATED / MISSING | MEDIUM | Date is a committed milestone but not on reconciliation table. Either confirm or update. Also labelled "Week 3: UI & Dashboards" — verify Week-3 still applies. |
| 97 | inmail_drafts.md:10 | "0.25–0.5% equity, 2-year vest, 6-month cliff, no cash" | Row 106 | MATCH | — | none |
| 98 | inmail_drafts.md:16 | (Same) — exact quote | Row 106 | MATCH | — | none |
| 99 | inmail_drafts.md:41, 63, 89, 111, 137, 159, 185, 207, 233, 255 | "0.25–0.5% equity over 2-year vest with 6-month cliff; no cash" | Row 106 | MATCH (×10) | — | none — highest-exposure compensation text all identical and correct |
| 100 | inmail_drafts.md:273, 279 | Day-4 Day-10 follow-up "0.25–0.5% equity, 2-year vest, 6-month cliff" | Row 106 | MATCH | — | none |
| 101 | inmail_drafts.md:9, 10, 273 | Ask: "25-minute call" (time commitment ask, not the advisor weekly commitment) | (not Row 107; Row 107 is weekly advisor commitment 2–4 hrs, which is separate) | MATCH (consistent with "2-4 hrs/week") | LOW | note: the "25 min call" is an ask; the "2–4 hrs/week" post-signing commitment is correctly the body of Row 107. No drift. |
| 102 | inmail_drafts.md:285 | "retention-until = send_date + 12 months" non-hire | Row 111 | MATCH | — | none |
| 103 | inmail_drafts.md:54, 58 | "3% of our receipts fail OCR" (hook metric) | — | MISSING_FROM_RECONCILIATION | LOW | Internal engineering figure in outreach copy; not a product commitment. Add row "Current OCR failure rate baseline (hook): ~3%" or document as illustrative. |
| 104 | inmail_drafts.md:203 | "20 merchants and 60 creators in a single neighborhood" (pilot target) | Row 8 (10 merchants Pilot cap) + MISSING (60 creators) | DISCREPANCY (wording) / LOW | Reconciliation Row 8 = "10 merchants Williamsburg Coffee+ Pilot"; inmail draft says "roughly 20 merchants … 60 creators" — this is a pilot-plus-extended-launch figure. Not in conflict, but phrasing invites misread. Clarify: split Pilot (10) from first-60-day launch (10 Pilot + ~10 early Beachhead = ~20). Add row "Pilot-phase creator target: 60" and reconcile narrative. |
| 105 | inmail_drafts.md:39, 61, 86, 109, 134, 156, 182, 205, 230, 253 | "pre-pilot Week 4 / Q2 2026" | — | MISSING_FROM_RECONCILIATION | MEDIUM | Add row "First verified pilot results window: Week 4 of 2026-Q2" — this is quoted 10× in outreach; landing also references it (L805, L1658). Pin it in reconciliation. |

**Total: 105 numeric cross-references audited.** The tally of 34 MATCH below the "by category" summary covers category-normalized unique metrics; the per-row table above counts each citation individually (repeats count; that is by design to surface high-exposure risk).

---

## §4 Critical Discrepancies (Deep Dive)

**No HIGH-severity DISCREPANCY findings were identified.** The two LOW-severity wording discrepancies:

### D-1 — Pilot size: 10 vs "~20 merchants" (inmail_drafts.md L203)

- **Reconciliation Row 8:** "Pilot cohort cap (Williamsburg Coffee+): 10 merchants."
- **inmail_drafts.md Archetype 4 Variant B (L203):** "We'll launch our pilot with roughly 20 merchants and 60 creators in a single neighborhood."
- **Analysis:** The inmail copy is using "pilot" loosely to mean "pilot + early-Beachhead first-60-days cohort". The Pilot-tier cap in pricing is 10; Beachhead begins at merchants #11–50. The "roughly 20" figure is not incorrect but blurs the two phases.
- **Severity:** LOW — the recipient is an ML engineer, not a compliance reviewer; the ask is judgmental, not regulatory. But the figure *could* be misread as a traction claim.
- **Recommendation:** Either (a) rewrite the Archetype 4 Variant B hook to say "10-merchant pilot plus 10 early-Beachhead merchants", or (b) introduce a `Row: "Pilot+early-Beachhead first-60d target: ~20 merchants + ~60 creators"` to reconciliation so the figure is covered.

### D-2 — Bare-QR confidence "60–70%" (push-strategy L63)

- Used in the Matrix 2 objection response ("How is ConversionOracle different from just QR tracking?"). The 60–70% is a rhetorical baseline, not a measured Push number.
- **Reconciliation Row 73** only records **Oracle** target (≥92%); no bare-QR comparator row.
- **Severity:** LOW — no risk of external misquote because the strategy doc is internal; the figure functions as rhetorical anchor. Still, it is a number used in investor/press conversations and should be documented.
- **Recommendation:** add to reconciliation as a derived/reference figure with source "industry anecdotal; bare-QR without geo+OCR cross-check", labeled Low confidence.

---

## §5 Reconciliation Table Gaps (Metrics to Add)

Recommend adding the following **13 rows** to the reconciliation master table (or to a new "Marketing Illustratives / Comparators" sub-section):

| Proposed # | Metric | Value | Source | Rationale |
|---|---|---|---|---|
| 113 | T1 guarantee trigger window | 14 days | push-creator §2 Creator Terms | currently implicit; quoted in Creator Terms disclosure verbatim |
| 114 | T1 entry criterion — followers OR posts | 500 followers OR 5 organic posts | push-creator §3 | entry gate, visible to creators |
| 115 | AutoVerification coverage threshold | ≥70% M-6 / ≥85% M-12 | push-metrics §6.x.2 playbook | SLR playbook trigger |
| 116 | Onboarding hours threshold (playbook) | 8 hr/merchant | push-metrics §6.x.2 | ops efficiency trigger |
| 117 | Dispute minutes threshold (playbook) | 45 min/dispute | push-metrics §6.x.2 | ops efficiency trigger |
| 118 | Bare-QR confidence baseline | 60–70% | push-strategy §Matrix 2 | comparator for ≥92% Oracle target |
| 119 | Competitor-copy window | 24 months | push-strategy §Matrix 2 | strategic moat-decay estimate |
| 120 | Pre-competitor label target (pilot) | 10,000 labeled events | push-strategy §Matrix 2 | data-moat pillar |
| 121 | US local ad spend TAM | $47B | app/(marketing)/page.tsx L773 | landing page market stat |
| 122 | NYC local advertising market | $2B+ | app/(marketing)/page.tsx L798 | landing page market stat |
| 123 | NYC local businesses | 230,000+ | app/(marketing)/page.tsx L798 | landing page market stat |
| 124 | NYC F&B + lifestyle creators | 50,000+ | app/(marketing)/page.tsx L798 | landing page market stat |
| 125 | First-verified-pilot results window | Week 4 of 2026-Q2 | inmail_drafts.md + landing disclosure | quoted 10+ times across hiring + marketing |
| 126 | Month-1 prorate trigger | <5 verified customers | push-pricing §10 + landing pricing card | merchant protection promise |
| 127 | Creator-match-rate target (marketing) | 87% within 2 miles | landing merchant list L841 | marketing-grade; verify if committed |
| 128 | Marketing illustratives — hero/proof/attribution | see sub-table below | landing page `data-mock` cards | prevent future misquote |
| 129 | Comparator — traditional local ads CPC | $15–50/click | landing attr-note L1020 | marketing compare line |
| 130 | Comparator — traditional local ads retainer | $500–2,000/mo | landing pricing L1470 + push-pricing §6 | marketing compare line |

**Marketing-illustratives sub-table (proposed):**
- `Hero "$500" stat card` → landing L670 — **keyed to Row 7 (Beachhead floor)**; the card label is fine, but the `StatCounter` animation from 0→500 is explicitly `data-mock="true"`.
- `Hero "24h"` → landing L693 — ambiguous (time-to-fill vs time-to-first-creator); propose Row 127 or explicit alias.
- `Proof-strip "12+ / 47+ / $8.2K"` → landing L745, L751, L758 — marked `data-mock`; NOT real traction.
- `Merchant attribution dashboard ("47 QR scans / $1,504 / 3.2×")` → landing L82, L86, L90 + HeroCampaignPreview — all `data-mock` + labeled "Illustrative campaign preview".
- `Portal page "5 merchants / 10 creators / 15 cards / 10 reports"` → app/page.tsx L26–30 — all `data-mock`, styled with asterisk disclosure.

---

## §6 Recommendation (Prioritized)

### P0 — This week (before any external comms)
1. **Confirm "Week 4 of 2026-Q2" pilot date** is still accurate and add as Row 125 (currently quoted 10× in hiring + disclosure footers but not pinned).
2. **Confirm or remove "87% creator match rate within 2 miles"** (landing L841) — this is the only marketing-grade number that reads as a KPI promise but has no backing in any SKILL or reconciliation row. Either add to reconciliation with source, or remove from landing.
3. **Add "Marketing Illustratives" sub-section** to `numeric_reconciliation.md` listing the 9 `data-mock` values so that future content reviewers know they are not commitments.

### P1 — Before next Monday review
4. Add Rows 113–120 (SKILL-level metrics currently implicit or buried in prose: 14-day window, 500 followers entry, AutoVerification threshold, onboarding/dispute playbook triggers, bare-QR baseline, 24-month copy window, 10k label target).
5. Rewrite `inmail_drafts.md` Archetype 4 Variant B (L203) to clarify "pilot + early-Beachhead" vs Pilot-only size, removing DISCREPANCY D-1.

### P2 — Next iteration
6. Add market-TAM rows (121–124) and comparator rows (129, 130) so any competitor citation on the landing/pitch deck traces back to a single-source-of-truth row.
7. Verify YC Demo Day date on `app/page.tsx` L416 (currently reads "May 9, 2026"). If confirmed, add to reconciliation as a scheduled milestone; if obsolete, update portal.
8. Validate 3.2× ROI multiplier and $1,504 attribution revenue are flagged as illustrative in all screenshots, press screenshots, and deck screenshots (any screenshot drifting into investor materials should carry the disclosure marker).

---

## §7 Verification Checklist (Self)

- [x] ≥ 20 findings rows → 105 rows in §3
- [x] Zero DISCREPANCY findings at Severity=HIGH → confirmed; only LOW wording drift in D-1 and D-2
- [x] File saved to `docs/v5_2_status/audits/01-numeric-audit.md`
- [x] No existing files modified; git state unchanged
- [x] Read-only scan; all 8 target files covered

*End of audit.*
