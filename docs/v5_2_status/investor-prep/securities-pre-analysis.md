# Securities Pre-Analysis — Investor Prep

**Audit reference:** `docs/v5_2_status/audits/05-investor-dry-run.md` Q7 (D grade).
**Owner:** Jiaming.
**Last updated:** 2026-04-20.

> **⚠ NOT LEGAL ADVICE.** This is founder-prep work product to brief securities counsel and to demonstrate to investors that the equity stack has been thought about. The framework here MUST be confirmed by securities counsel before any non-founder equity grant is made (see `docs/legal/counsel-engagement-plan.md` §4 Securities).

---

## §Purpose

Push's plan to grant restricted stock to (a) the ML Advisor (0.25–0.5% RSA, 2-year vest, 6-month cliff), (b) Tier 5 Closer creators (0.02% RSA per grant, 4-year vest, 1-year cliff), and (c) Tier 6 Obsidian Partner creators (0.05–0.2% RSA tenure-dependent) creates **three securities-law issues** that need to close before the first non-founder grant:

1. Whether each grant qualifies for Rule 701 exemption from federal securities-act registration.
2. Whether the company has a current §409A valuation supporting the grant's purchase price (FMV).
3. Whether the company has a board-approved written compensatory benefit plan covering the grants.

Plus the seed financing itself triggers Reg D Rule 506(b)/(c) and Form D.

This document maps each grant against these issues so counsel can issue a memo quickly.

---

## §Equity grants inventory

| Recipient class | Instrument | % FD per grant | Vest | Cliff | Trigger / cadence | Rule 701 question |
|---|---|---|---|---|---|---|
| Founders (×3) | Restricted stock | varies | 4yr | 1yr (or already past) | Founding | N/A — pre-formation founders |
| ML Advisor (1, target wk 8) | RSA | 0.25–0.5% | 2yr | 6mo | At advisor agreement signing | Rule 701 — consultant |
| Future employees | ISO | TBD | 4yr | 1yr | Post-seed close | Rule 701 — employee |
| T5 Closer creator | RSA | 0.02% | 4yr | 1yr | At T5 invite (post 6mo on T4) | **Rule 701 — possibly consultant; novel** |
| T6 Obsidian creator | RSA | 0.05–0.2% | 4yr | 1yr (assumed) | At T6 invite (post 12mo on T5) | **Rule 701 — possibly consultant; novel** |
| Future strategic / investor | Common (vested) or Preferred (Series Seed) | TBD | N/A | N/A | At financing close | Reg D, not Rule 701 |

Total proposed Year-1 equity dilution (advisor + 3 T5 + 1 T6 + employee pool seeded): approximately **2.5–4% fully-diluted**, well within the typical seed-stage budget but worth tracking against an option pool sized at financing.

---

## §Rule 701 analysis — draft framework

Rule 701 is the SEC exemption from §5 registration for securities issued under written compensatory benefit plans to employees, officers, directors, general partners, trustees, consultants, or advisors of a private company. Key requirements:

### 701(a) — Eligible issuer

Push, Inc. is a non-public company. **Eligible.** ✓

### 701(c)(1) — Eligible recipients

The exemption covers natural persons providing bona fide services to the issuer. For the **ML Advisor and future employees**, eligibility is straightforward.

For **T5/T6 creators**, eligibility is the harder question. Counsel must assess whether each T5/T6 creator is a "consultant" under 17 CFR § 230.701(c)(1). The case for "yes":

- T5/T6 creators perform substantial services (content creation + customer acquisition + dispute participation) for Push.
- They sign a contract; Push pays them; the relationship has duration (12+ months on T5 + invite to T6).
- Their service is integrated into Push's product (Push Score, retainer, performance bonus).

The case against:
- Creators also provide services *to merchants* (the actual viewer/walk-in driver). The bona fide-services-to-issuer requirement could be argued to require the work to benefit the issuer primarily. Counsel must opine.
- "Consultant" is defined narrowly under SEC guidance — it does not include a "person who promotes the issuer's securities" (Push must avoid framing the equity as a recruitment carrot for content marketing).

**Counsel action:** Issue a Rule 701 compliance memo explicitly addressing T5/T6 consultant status before the first T5 grant.

### 701(d) — Volume cap

Aggregate sales under Rule 701 in any 12 consecutive months may not exceed the GREATER of:
- $1 million; or
- 15% of total assets at the end of the issuer's last fiscal year; or
- 15% of outstanding amount of the class of securities being offered.

Year-1 projected grants:
- ML Advisor: ~0.4% × $20M (target Series Seed pre-money proxy) = ~$80K notional
- 3 T5 creators: 3 × 0.02% × $20M = ~$12K
- 1 T6 creator: ~0.1% × $20M = ~$20K
- Employee pool seeded: 5–10% set aside but not all granted in Y1; conservative grant flow ~3% × $20M = ~$600K

**Y1 projected total: ~$700K notional.** Well under $1M ceiling. Buffer is thin once we add a hire wave post-seed close. Recalc at every quarter; counsel handles.

### 701(e) — Disclosure if aggregate >$10M in any 12 months

Push will not approach $10M in Y1. Disclosure not triggered. Re-check at Series A.

---

## §409A valuation

Required to set FMV for any RSA / option grant where the recipient is not a founder receiving founder stock. Without a valid §409A:
- Recipient may face immediate income tax on grant date plus 20% federal penalty plus state penalties (NY).
- Push may face withholding obligations.

**Status today:** No 409A engaged.
**Plan:** Engage Carta / Capshare / Aranca for first 409A **before ML Advisor signs** (target week 8). Cost ~$3–6K. Validity: 12 months OR until material event (financing close, material change in business).

---

## §Reg D for seed fundraise

When Push raises Series Seed, the issuance of preferred (or convertible note / SAFE) is governed by Reg D:

- **Rule 506(b):** No general solicitation. Up to 35 non-accredited investors permitted (with disclosure obligations); accredited unlimited. Friends-and-family rounds typically here.
- **Rule 506(c):** General solicitation permitted; ALL purchasers must be accredited; issuer must take "reasonable steps" to verify accreditation.

Push's preference for seed: **506(b)** unless we want to publicly market the round. Form D filing within 15 days of first sale.

**State blue-sky filings:** Required in the issuer's state (Delaware) and each investor's state. NY filing typically required (NY Form 99 for offerings to NY residents, although a private-placement exemption often applies).

---

## §Open questions for securities counsel

1. Are T5/T6 creators "consultants" under Rule 701(c)(1) for purposes of equity grants tied to performance metrics including Push Score?
2. Does the Push Score-based promotion mechanism (which determines who is invited to T5/T6) constitute "promotion of issuer's securities" in any sense that disqualifies Rule 701?
3. What disclosure obligations attach to T5/T6 grants under Rule 701(e) given that the creators are not employees with full access to financials?
4. Does NY State Pay Transparency Law (LL-32) require disclosure of equity range in creator-tier promotion offers?
5. Is the T5 0.02% / T6 0.05–0.2% range too narrow to qualify under "compensatory" — or does the small absolute amount per grant raise no concern?
6. Must Push file a formal 409A before any T5 grant, or is the founder-stock-FMV defensible for a first grant?
7. Should the advisor agreement reference the YC FAST template, or does counsel prefer a Push-tailored form?
8. What's the right structure for the option pool at seed close — pre-money or post-money?
9. ISO vs NSO mix for first 5 employees — what's optimal given a small option pool?
10. How does §1202 QSBS interact with non-founder grants (does a T5 creator's stock qualify for §1202 if held 5+ years)?
11. Acceleration triggers on advisor + T5/T6: what's market for this stage?
12. Does Push need a "Right of First Refusal" + drag-along across all common-stock holders before seed?
13. Should T5/T6 grants be SARs (stock appreciation rights) rather than RSAs, given the unfunded-employee pool concern?
14. Is the Push Score → tier promotion → equity grant pipeline a material change requiring disclosure to existing stockholders?
15. What's the recommended disclosure if a T5 creator has another seed-stage equity stake elsewhere (conflict)?

---

## §Timeline

| Date | Item | Trigger |
|---|---|---|
| 2026-05-04 | Engage securities counsel (engagement letter) | Before ML Advisor signs |
| 2026-05-11 | First 409A engagement | Before any non-founder grant |
| 2026-05-18 | Counsel issues Rule 701 + 409A + Reg D memo | Before week-8 ML Advisor signing |
| 2026-06-22 | First T5 grant possible (post-pilot) | Pilot readout window; only if first T5-eligible creator emerges |
| 2026-Q3 | Series Seed term sheet expected | Pilot results readout |
| 2026-Q4 | Series Seed close + Form D filing | Within 15 days of first sale |

---

## §What we ask the investor for

If the investor's diligence team probes the equity structure, we ask:
1. **A 30-minute call with their portfolio company GC** who has built a creator-equity stack at scale (Whalar, Patreon, Substack, Cameo).
2. **Confirmation of their preferred securities counsel** so we can engage the same firm if compatible.
3. **A pre-term-sheet review of our Rule 701 memo** by the lead investor's counsel — gates the close timeline.

---

## §The founder narrative on this question

> "We have a clean equity stack but we have not yet engaged securities counsel — that's a known gap, and our P0 plan engages counsel before the ML Advisor signs (target week 8). Rule 701 covers the advisor and a future employee pool. The novel question is T5/T6 creator equity — we believe that fits the consultant definition under Rule 701(c)(1), but we want a counsel memo before the first grant. 409A is engaged with first non-founder grant. Reg D 506(b) for the seed round, Form D within 15 days of first sale. We've drafted the questions for counsel; we're not flying blind. Want to see the question list?"

---

## §Lessons from counsel conversations

*(append after each counsel call: firm, date, key clarifications, what changed in the analysis above.)*

| Date | Counsel firm | Section affected | Update |
|---|---|---|---|
| | | | |
