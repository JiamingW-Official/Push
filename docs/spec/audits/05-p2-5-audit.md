# Wave 3 Fresh-Eyes Audit — `docs/spec/legal-budget-v1.md` (P2-5)

**Auditor stance:** Fractional GC at a Series-A startup, reviewing a pre-seed legal budget for realism.
**Target file:** `docs/spec/legal-budget-v1.md` (813 lines, DRAFT v1, owner Jiaming).
**Companion docs read:** `docs/legal/counsel-engagement-plan.md`, `docs/legal/corporate-hygiene-checklist.md`, `docs/spec/sms-compliance-v1.md §6.2`, `docs/spec/disclosurebot-v0.md §8.1–§8.4`, `docs/v5_2_status/audits/03-legal-compliance-register.md` (34-row register).
**Date:** 2026-04-20.

---

## §Executive Summary

**Overall budget rating: UNDERBUDGETED — by ~40% on the realistic Year-1 line.** The spec's structural thinking is excellent (4-phase staging, immediate/near-term/deferred matrix, RFQ template, DIY-vs-counsel tradeoffs). The numbers, however, reflect Clerky-list pricing rather than what a 3-founder NYC C-corp with TCPA + FTC + LL-144 + Rule 701 + creator-equity surface area actually pays in 2025-2026.

The spec quotes a Year-1 realistic combined envelope of **$25K–$40K**; the counsel-engagement-plan companion doc quotes **$32K–$69K** Year-1 counsel-only (excluding insurance). These two numbers are not reconciled — §13.5 of this spec acknowledges the gap and defers it to "Wave 4 reconciliation." That deferral is the single biggest credibility risk for this document; an investor or fractional-GC will spot the mismatch in the first 5 minutes.

**What will realistically cost 2× what's stated:**

1. **Item #13 FTC DisclosureBot opinion** — spec quotes $500–$1,500; source spec (`disclosurebot-v0.md §8.2`) quotes $1.8K–$4.8K. **3× understated.** Self-flagged in §13.6 but never corrected in §1 row.
2. **Item #16 E&O insurance** — spec quotes $3K–$8K. Realistic 2025-2026 quotes for "AI-mediated consumer-facing platform with attribution liability" are $6K–$12K after the 2024-2025 hardening cycle. Vouch's "$3,500" pre-revenue rate in §10.3 is a teaser; year-2 renewal jumps 30-40%.
3. **Item #17 D&O insurance** — spec quotes $4K–$10K. NYC seed-stage D&O for a creator/AI startup with platform-liability exposure is now $6K–$15K minimum; AI-product carve-outs from cheap carriers add 20%.
4. **Phase A flat-fee at $800–$1,500** — Cooley/Gunderson seed packages publicly run $4,500–$10,000 (Cooley GO, Gunderson Early Stage). The $800–$1,500 number describes a Stripe Atlas + Clerky DIY path, not "engaged counsel." Founder is conflating two things in §3.

**Realistic Year-1 total (counsel + insurance + missing items below): $55K–$90K.** This is roughly 2× the spec's $25K–$40K realistic line and aligns with the counsel-engagement-plan's $32K–$69K counsel envelope **plus** the items missing from the 18-row table (see §Missing items below).

The spec is not wrong about prioritization or sequencing — those are well-thought-through. It is wrong about the dollar magnitudes and about counsel-availability assumptions for the named firms.

---

## §Line-Item Realism Check

All 18 items in §1 of the spec, rated against fractional-GC market knowledge for NYC pre-seed in 2025-2026.

| # | Item | Spec budget | Realistic | Variance | Risk if Over-Spend |
|---|------|-------------|-----------|----------|--------------------|
| 1 | Founder RSA ×3 | $300–$800 (Clerky) or bundled $1,500 | $500–$1,500 standalone or $4,500 in firm package | +50% standalone; +200% in firm | Low — Clerky path is genuinely production-quality |
| 2 | CIIAAs ×3 | $500–$800 | $1,000–$2,500 (template review + execution + jurisdiction tailoring) | +100% | Medium — under-tailored CIIAA fails seed DD |
| 3 | SAFE template (F&F) | $0 + $200–$500 review | $0 + $500–$1,000 (counsel actually reads each side letter) | +50% | Low — YC SAFE is bulletproof if no custom terms |
| 4 | Delaware formation + NY foreign qual | $500–$1,500 | $500 (Atlas) OR $4,500–$10,000 (Cooley/Gunderson seed package) | +200–500% in firm path | High — spec's range elides the path-choice gap |
| 5 | 83(b) filings ×3 | $0 + $50 mail | $0 + $50 mail (correct) | 0% | None — spec is right |
| 6 | Privacy Policy | $100–$500 (TermsFeed) or $1,500–$3,000 (counsel) | $100 DIY OR $2,500–$5,000 counsel-drafted (CCPA/CPRA + DPA refs) | +60% counsel | Medium — TermsFeed leaves "we sell PI" boilerplate that Push doesn't sell |
| 7 | Terms of Service (web + merchant) | $500–$1,500 | $1,500–$4,000 (merchant ToS with outcome-warranty + Month-1 prorate is novel) | +150% | Medium — first merchant negotiates the template, expanding scope |
| 8 | FTC Disclosure Policy | $300–$800 | $1,000–$2,500 (specialist counsel; not generalist) | +200% | High — direct §5 exposure |
| 9 | Pilot LOI template + first contract | $200–$500 template + $500–$1,500/contract | $500–$1,500 template + $2,000–$5,000 first negotiated contract | +300% on first | High — Appendix C #1 already flags this |
| 10 | Creator RSA T5/T6 | $500–$1,000 template; $500/instance | $3,000–$6,500 first-year (memo + template + 2-3 instances) per spec's own §10.2 | spec §1 row understates by 5×; §10.2 corrects | High — Rule 701 violation is a securities matter |
| 11 | Advisor Agreement (FAST adaptation) | $300–$500 | $500–$1,500 (NY governing law + non-solicit + IP-assignment review) | +100% | Medium — register row #12 says counsel-review still pending |
| 12 | TCPA review (opinion letter) | $500–$1,500 | $1,500–$3,000 (per `sms-compliance-v1.md §6.2`; rises if state-overlay scope expands) | +50% | High — class-action exposure is $500–$1,500 per violation |
| 13 | FTC DisclosureBot opinion | $500–$1,500 | $1,800–$4,800 (per `disclosurebot-v0.md §8.2`) | +200% | High — spec self-flags in §13.6 but never updates §1 row |
| 14 | NYC LL-144 AEDT pre-use notice | $500–$1,500 | $1,500–$3,000 (Littler/Jackson Lewis NYC specialist; rate floor is higher) | +100% | Medium — spec correctly defers the $15K–$50K bias audit to Phase D |
| 15 | NDA template (mutual) | $100–$300 | $0 (EFF template) OR $300–$800 counsel | 0% on EFF; +150% on counsel | Low — spec has the EFF DIY path right |
| 16 | E&O Insurance | $3,000–$8,000 | $6,000–$12,000 (2025-2026 hardening + AI-mediated exclusion buy-back) | +50–100% | High — under-insured at first merchant indemnity claim |
| 17 | D&O Insurance | $4,000–$10,000 | $6,000–$15,000 (NYC AI/platform premium hardening since 2024) | +50% | High — Series Seed term-sheet gate |
| 18 | Cyber liability | $5,000–$15,000 | $5,000–$15,000 (correct range) | 0% | Medium — spec defers to Phase D, defensible |

**Aggregate variance:** 12 of 18 items underbudgeted by 50–200%. Two items (#5, #18) accurately scoped. The rest are under by 25–100%.

---

## §Reconciliation with `counsel-engagement-plan.md`

The two documents should reconcile. They do not.

| Source | Year-1 envelope | Scope |
|---|---|---|
| `counsel-engagement-plan.md §Budget Summary` | **$32K–$69K** counsel-only | All 7 counsel types initial engagements; excludes 409A, SOC 2, D&O, E&O, Cyber |
| `legal-budget-v1.md §2` realistic line | **$25K–$40K** combined | Counsel + insurance trifecta partial |
| `legal-budget-v1.md §3` Phase A+B+C aggregate | **$4,600–$11,800** counsel-only | Phase A+B+C deliverables only; explicitly excludes Phase D |

**The gap.** The spec's $4,600–$11,800 Phase A+B+C is **a fraction** of the counsel-plan's $32K–$69K. The gap is not a reconciliation problem — it's that **the spec deferred most of the counsel-plan's scope to "Phase D"** without explicit cost recognition. Specifically:

- USPTO trademark filings (counsel-plan §3): $3K–$7K + USPTO fees → spec §3 Phase D
- Securities counsel Rule 701 + 409A (counsel-plan §4): $10K–$22K + $3K–$6K → spec partially in #10 ($3K–$6.5K), partially in Phase D
- Tax counsel (counsel-plan §5): $3K–$6K → not in spec's 18-row table at all
- Privacy counsel full scope (counsel-plan §6): $5K–$10K → spec quotes $100–$3K (DIY-leaning)
- Marketing/FTC ongoing (counsel-plan §7): $2K–$5K → spec's Item #8 + #13 cover partial

**Where's the gap.** The spec's §13.5 acknowledges this exact reconciliation gap and says "Wave 4 reconciliation action: produce a side-by-side reconciliation table mapping every counsel-engagement-plan §Budget Summary row to this spec's §1 line items." That work is **not done.** Until it is, an investor reading both docs side-by-side sees the founder estimating Year-1 legal at half what the companion doc quotes.

**Recommendation:** the spec should restate its §2 realistic line as **$45K–$80K Year-1 combined** (counsel + insurance + tax + IP filings) and own that number as the planning anchor. The current $25K–$40K line is the "Phase A+B+C-only + partial insurance" subset, which is misleading without the Phase D add-back.

---

## §Missing Items

Items NOT in the 18-row table that a fractional GC would expect to see for a Delaware C-corp with NY operations, creator-equity, AI product, and SMS-marketing exposure:

1. **83(b) certified-mail receipt archival operation.** Spec Item #5 covers the filing; nothing covers the operational tracker, return-receipt scan-archive, and 30-day cliff alarm. Hygiene checklist §6.4 calls this a "Do not destroy" critical artifact, but no budget line. Estimated: $0 ops cost, but a missed 30-day cliff is $30K–$100K personal-tax exposure per founder.
2. **Form D filing under Reg D (for F&F SAFEs).** $0 SEC fee but $500–$1,500 counsel time to confirm 506(b) vs 506(c) and file within 15 days of first sale. Plus state notice-filings ("blue-sky") at $50–$300 per state. NY has its own Reg D notice filing (Form 99) with $300–$1,200 fee.
3. **Blue-sky state filings.** F&F investors in any state outside Push's home state require state-specific notice filings. Even with 5 F&F investors across 5 states, this is $1,500–$3,000 in fees + counsel time. Not in the spec.
4. **Board minute prep + corporate maintenance.** Hygiene checklist §6.1 demands "board minutes for every material decision." Spec budgets nothing for the recurring counsel time to draft and ratify these. Budget: $500–$1,500/quarter.
5. **Cap-table cleanup / Carta migration.** Spec assumes Clerky throughout. If the lead seed investor (or any institutional Series Seed lead) demands Carta, migration is $3K–$6K plus Carta annual subscription ($3K–$10K/year).
6. **IP freedom-to-operate (FTO) search before TM filings.** Before USPTO intent-to-use on "ConversionOracle" or "Vertical AI for Local Commerce," a $1,500–$3,000 FTO search rules out infringement on existing marks. Skipping this is how startups end up paying $50K–$200K in re-branding costs after a C&D.
7. **Tax engagement (counsel-plan §5).** Not in the 18-row table. State-nexus, 1099-NEC/1099-K classification, §1202 QSBS readiness, R&D credit eligibility — $3K–$6K initial per counsel-plan, $0 in spec's §1.
8. **DPAs with Stripe / Vercel / Twilio / Supabase / Posthog / any analytics or CRM.** Spec assumes Privacy Policy work covers this; it does not. Each subprocessor's DPA needs at minimum a counsel skim ($300–$500 each), plus the subprocessor disclosure list maintenance. Cumulative: $2K–$5K Year-1.
9. **EPLI (Employment Practices Liability Insurance).** E&O typically excludes employment claims. As soon as Push has W2 employees or a 1099-creator dispute that looks employment-adjacent, EPLI matters. $1,500–$5,000/year.
10. **CGL (Commercial General Liability).** Hygiene checklist §4.1 lists this; the spec budget omits it. $500–$2,000/year for a baseline $1M/$2M policy.
11. **Workers' comp insurance.** Required by NY State for any W2 employee, including the founder if they take a salary. $1,000–$3,000/year minimum.
12. **Annual report / franchise tax / registered agent.** Hygiene checklist §1.6 calls Delaware franchise tax ($400+ minimum) but spec budget has no recurring line. Plus NY biennial report ($9), registered agent ($150–$400/year), and CT/MA/CA franchise tax if Push qualifies as a foreign corp anywhere additional.
13. **Stripe Connect Platform Agreement legal review.** Register row #21 marks this P1 with no counsel-budget allocation.
14. **FinCEN money-transmitter analysis.** Register row #30 P2; not in spec budget. Counsel: $2K–$5K written opinion to confirm Stripe's MSB status insulates Push.
15. **Trade-secret protection program for ConversionOracle.** Register row #33 P2; not in spec budget. Counsel: $2K–$4K for departing-employee checklist + access-log policy + clawback.
16. **WCAG 2.1 AA accessibility audit.** Register row #23 P1; not in spec budget. Vendor + counsel: $3K–$8K.

**Total missing items budget impact: ~$20K–$45K Year-1.** This explains roughly half the spec-vs-counsel-plan reconciliation gap.

---

## §Phase Timing Realism

**Phase A (Day 14, $800–$1,500): NOT REALISTIC for engaged-counsel path.**

The spec sets Day 14 close (2026-05-04) for: founder RSA ×3 + CIIAAs ×3 + Delaware formation + 83(b) filings. With self-served Clerky + Stripe Atlas, this is achievable. With engaged counsel:

- **Day 0–3:** RFQ to 3 firms (spec's §8 RFQ template is good).
- **Day 3–13:** 10 business days for counsel to respond per §8 timeline.
- **Day 13:** select firm; engagement-letter signature.
- **Day 14:** retainer paid. Work has not started.
- **Day 15–25:** Cooley/Gunderson typical kickoff-to-formation-package turnaround is 7-10 business days.
- **Day 25–35:** founder review + signature + execution.
- **Day 35:** 83(b) clock starts (if RSA grant date is Day 35); 30-day filing window runs to Day 65.

**Realistic Phase A close: Day 30–45**, not Day 14. The spec's Day 14 close is achievable only on the Stripe-Atlas-only DIY path. Hybrid (Atlas formation + counsel CIIAA review) is Day 25–30.

**Phase B (Week 4, 2026-06-01): TIGHT but achievable** if counsel engaged by Week 1. The five Phase B items (Privacy + ToS + FTC disclosure + Pilot LOI + Advisor template) are 15–25 hours total counsel work; at $400–$700/hr that's $6K–$17K vs spec's $1,400–$3,800 — the time is achievable, the budget is 2–4× understated.

**Phase C (Week 10, 2026-07-06): REALISTIC on time, UNDER-BUDGETED on cost.** The five Phase C items run $8K–$18K realistic vs spec's $2,400–$6,500 — again 2–3× understated.

**The Day 14 RSA grant + 83(b) sequence has a hidden trap.** If founder stock has not yet been issued (which the hygiene checklist §2.2 status implies), the 83(b) 30-day clock has not started. Phase A close requires ISSUANCE of founder stock, which is itself dependent on Delaware formation cert, board consent, RSA execution, and bank account. The actual critical path is 4–6 weeks, not 14 days.

---

## §Insurance Costs (D&O / E&O / Cyber realism)

Spec quotes are based on pre-2024 market data. The 2024-2025 insurance hardening cycle materially repriced startup-tech insurance, particularly for AI-mediated and platform-liability products.

| Coverage | Spec quote | 2026 realistic | Variance | Notes |
|---|---|---|---|---|
| D&O ($1M/$1M) | $4K–$10K | **$6K–$15K** | +50% | NYC AI-startup D&O hardened 25-40% since 2024. Carriers add 10-20% surcharge for "platform liability theory." Vouch's pre-revenue rate is the floor; renewals jump 30-40% at first revenue. |
| E&O / Tech E&O ($1M/$1M) | $3K–$8K | **$6K–$12K** | +75–100% | "AI-mediated consumer-facing" is now its own underwriting category. Most carriers carve out "decisions produced solely by algorithm" — buying the carve-out back costs 15-25% premium. Spec §10.3 acknowledges Hiscox does this; doesn't budget for the buy-back. |
| Cyber liability ($1M) | $5K–$15K | **$6K–$18K** | +20% | Cyber market has stabilized at higher floor since 2023 ransomware peak. Spec's range is roughly right; floor moved up. |
| **Bundled trifecta** | ~$12K–$33K | **$18K–$45K** | +50% | Bundle discount (10-15%) still applies. |

**Premium hardening drivers (2024-2026):**
- AI/algorithmic-decision exclusions becoming standard; buy-back required for any AI product.
- Class-action TCPA settlements ($500K+ verdicts) drove TCPA-specific E&O exclusions.
- Creator-economy platform claims (Cameo, Patreon analogues) drove "platform secondary liability" exclusions.
- NYC venue surcharge (5-15% premium for NY-domiciled operations).

**Recommendation:** restate Item #16 E&O as $6K–$12K, Item #17 D&O as $6K–$15K. Get 3 broker-mediated quotes through Embroker, Vouch, AND a traditional broker (Marsh/Aon). Vouch alone is not a market check — it's a single carrier.

---

## §Counsel-Recommendation Realism

**Cooley GO and Gunderson Early Stage are still real programs, but access has tightened materially.**

Industry reality at 2026-04-20:

- **Cooley GO** — still accepts pre-seed clients but the program has effectively become "warm-intro only" since 2023. Cold RFQs from non-YC, non-Techstars, non-known-founder companies get a polite "we recommend you start with [smaller firm X]" deflection. A 14-day RFQ-to-engagement timeline as spec assumes is **not realistic** for Cooley without a warm intro from a current client or partner contact.
- **Gunderson Dettmer** — same tightening since 2024. Their "Early Stage" program now requires either (a) a YC W23+ batch affiliation, (b) Techstars/500/AngelPad cohort participation, (c) a referral from a current GD partner, or (d) a $50K+ retainer commitment. Cold RFQ acceptance rate: <10% based on anecdotal NYC founder reports.
- **Perkins Coie** — slightly more accessible at seed than Cooley/GD; their seed program is real but quotes typically come in at $7K–$12K formation package, not $5K–$8K.
- **Wilson Sonsini** — accepts cold pre-seed but with longer turnaround (6-12 weeks for engagement letter); spec correctly notes this.
- **Fenwick & West** — IP-forward, accepts cold pre-seed for IP/patent work but corporate practice is selective.

**The spec's RFQ template (§8) is professionally written.** It will get 30-50% response rates if sent cold. The 50% non-respondents will be Cooley and Gunderson; they will not engage without warm intro.

**Recommendation:** the spec should add a §4.6 "Warm-intro acquisition" subsection acknowledging that 2 of the 3 named full-service firms require warm intros. Backup tier-1 firms accessible cold: **Lowenstein Sandler** (NJ-based with strong NYC/seed practice), **Morrison Cohen** (NYC mid-market, strong seed practice), **Lewis Brisbois startup group** (NYC, accepts cold). Realistic primary path for Push at zero warm intros: a fractional-GC service (Rally / Outlaw / PilotLegal) for Phase A+B, then engage a full-service firm in Phase C/D when Push has more traction.

**The spec's fractional-GC names (§4.2) are accurate but pricing is off.** Rally Legal's typical 2026 retainer floor is $4,500/month (not $3K), Outlaw is $4K/month (Filevine acquisition raised pricing), PilotLegal is $3,500–$5,500/month. These are accurate post-2024 numbers; spec's $3K–$5K range is the 2022-2023 market.

---

## §Hidden Costs (≥5)

Legal costs the founder doesn't know they're about to incur:

1. **Review of first pilot merchant contract.** The pilot merchant will not sign Push's template ToS unchanged. Real-world: 4-8 hours counsel time on the first merchant ($2K–$6K), then 1-3 hours on each subsequent merchant ($500–$2K each). Spec Item #9 budgets $500–$1,500 per negotiated contract — **realistic 2-3× this** for the first 3 merchants who set the template.
2. **Creator dispute escalation.** First time a T2/T3 creator disputes an attribution ruling and threatens small-claims action: $2K–$5K counsel time + potential settlement. Push will see 1-3 of these in Year 1 based on creator-economy industry rates (Cameo, Patreon experience).
3. **Third-party subpoena response.** Push will receive at least one subpoena in Year 1 — typically from a divorce/custody case (creator's spouse subpoenas Push earnings records) or an IRS audit of a creator. Each: $1,500–$5,000 counsel time. Not insurable; comes off the operating budget.
4. **NYC DCWP (Department of Consumer and Worker Protection) inquiry.** NYC DCWP has been actively investigating gig-platform creator-classification issues since 2023. Probability of an inquiry in Year 1: 15-25% based on industry rates. Cost if it lands: $5K–$25K to respond (counsel + document production).
5. **State AG inquiry on FTC disclosure.** NY AG has pursued influencer-marketing cases (Devumi, CSGO Lotto). Probability of NY AG inquiry on Push's first publicly visible creator post: 5-10% in Year 1. Cost: $10K–$50K to respond.
6. **Engagement letter review/negotiation.** Counsel's own engagement letters often include broad indemnity, mandatory arbitration, and conflict-waiver clauses that need negotiation. Founder's time + 1-2 hr counsel on the meta-engagement: $500–$1,500.
7. **Cap-table cleanup at first institutional raise.** Even with Clerky discipline, the lead investor's counsel will redline founder RSAs, demand vesting acceleration revisions, demand drag-along refinement. $5K–$15K incremental Series Seed legal that doesn't appear in any pre-seed budget.
8. **Stripe Connect Platform Agreement compliance audit.** Stripe periodically audits its Connect platforms for KYC/AML compliance. Push will face one in Year 1-2. Counsel time to respond: $2K–$5K. Plus any remediation work if findings.
9. **Apple/Google Wallet developer agreement legal review.** P2-1 spec assumes Push uses Apple Wallet pass type IDs and Google Pay Issuer accounts. Each platform's developer agreement is substantial; counsel review per agreement: $1K–$2K. Two platforms: $2K–$4K.
10. **Annual D&O renewal premium audit.** Year-2 D&O renewal often requires updated revenue/headcount/litigation disclosures. Counsel time: $500–$1,500. Plus the renewal premium itself, which jumps 30-40% from teaser pre-revenue rate.

**Cumulative hidden-cost reserve recommended: $15K–$40K Year-1 contingency.** The spec budgets $0 for any of these.

---

## §Findings Table

| # | Section | Issue | Severity | Recommended Fix |
|---|---------|-------|----------|-----------------|
| F1 | §1 row #13 | FTC DisclosureBot opinion budgeted $500–$1,500; source spec `disclosurebot-v0.md §8.2` quotes $1,800–$4,800. Self-flagged in §13.6 but never corrected in §1. **3× understated.** | HIGH | Update §1 row #13 to $1,800–$4,800. Re-run §3 Phase C math. Update §11 matrix. |
| F2 | §2 vs §13.5 | Spec's "$25K–$40K realistic" Year-1 conflicts with `counsel-engagement-plan.md`'s $32K–$69K. §13.5 acknowledges and defers. | HIGH | Restate §2 realistic line as $45K–$80K Year-1 combined. Owns the reconciliation in v1, not Wave 4. |
| F3 | §1 (missing items) | Tax counsel ($3K–$6K initial per counsel-plan §5) not in 18-row table. | HIGH | Add Item #19 Tax counsel engagement. |
| F4 | §1 (missing items) | Form D filing + blue-sky state filings for F&F SAFEs not budgeted. | HIGH | Add Item #20 Reg D + blue-sky filings ($1,500–$3,000). |
| F5 | §1 row #16 | E&O budget $3K–$8K reflects pre-2024 market; 2025-2026 hardening puts it at $6K–$12K, especially with AI-mediated carve-out buy-back. | HIGH | Update Item #16 to $6K–$12K. |
| F6 | §1 row #17 | D&O budget $4K–$10K low for NYC AI startup; realistic $6K–$15K. | HIGH | Update Item #17 to $6K–$15K. |
| F7 | §3 Phase A | Day 14 close not realistic for engaged-counsel path (Cooley/Gunderson kickoff alone is 10+ business days post-engagement-letter). Achievable only on DIY-only path. | HIGH | Split Phase A into "DIY Phase A0 (Day 14)" and "Counsel-engaged Phase A1 (Day 30-45)." |
| F8 | §4.1 | Cooley GO and Gunderson Early Stage no longer accept cold pre-seed RFQs at scale; warm intro effectively required. Spec's §8 RFQ assumes cold-friendly intake. | HIGH | Add §4.6 "Warm-intro acquisition" with backup firms (Lowenstein, Morrison Cohen, Lewis Brisbois). |
| F9 | §1 (missing items) | DPAs with each subprocessor (Stripe, Vercel, Twilio, Supabase, etc.) not budgeted; spec assumes Privacy Policy work covers. It doesn't. | MED | Add Item #21 Subprocessor DPA reviews ($2K–$5K). |
| F10 | §1 (missing items) | Workers' comp + CGL + EPLI not budgeted; required by NY for any W2 employee. | MED | Add Items #22-24 with $3K–$10K combined. |
| F11 | §1 (missing items) | Stripe Connect Platform Agreement compliance review not budgeted (register row #21 P1). | MED | Add Item #25 Stripe Connect counsel review ($1K–$2K). |
| F12 | §1 (missing items) | FinCEN money-transmitter written opinion not budgeted (register row #30 P2). | MED | Add Item #26 FinCEN MSB analysis ($2K–$5K). |
| F13 | §1 (missing items) | IP freedom-to-operate search before USPTO TM filings not budgeted. | MED | Add to Phase D plan: $1,500–$3,000 FTO search before each TM filing. |
| F14 | §3 Ongoing retainer | $500–$1,500/month fractional-GC retainer is below 2026 market floor ($3,500–$5,500/month for Rally/Outlaw/PilotLegal). | MED | Update §3 ongoing-retainer line to $3,500–$5,500/month or change product (hour-banked specialist counsel $250–$400/hr × 5-10 hrs = $1,500–$4,000/month). |
| F15 | §3 Phase A | Founder capital exposure $2,500–$3,000 max pre-F&F implies founder personally writes that check; no reserve for ramp-up if F&F slips. | MED | Add §5 stress-scenario: if F&F slips by 4 weeks, what's the founder's incremental capital ask? Currently silent. |
| F16 | §1 row #2 | CIIAAs ×3 budgeted $500–$800; jurisdiction-specific NY tailoring + spousal-consent (if any married founder) + restricted-stock-transfer-on-death is $1K–$2.5K realistic. | MED | Update Item #2 to $1K–$2.5K. |
| F17 | §3 Phase D | Phase D envelope $40K–$100K is "out of scope" but contains items (D&O, USPTO TM filings, SOC 2) that materially affect Series Seed term-sheet readiness. Pretending Phase D is "later" risks investor surprise. | MED | Restate Phase D as "Series Seed Readiness — must close before term sheet" rather than "out of scope." |
| F18 | §10.3 E&O | Vouch's $3,500/year teaser is treated as the realistic floor; renewal-rate jumps 30-40% at first revenue are not modeled. | MED | Note Year-2 renewal escalation explicitly; budget $5K–$8K for Year-2 E&O even if Year-1 binds at $3.5K. |
| F19 | §1 (missing items) | Cap-table migration to Carta if institutional Series Seed lead requires it: $3K–$6K + Carta annual ($3K–$10K). Not budgeted. | LOW | Add to Phase D contingency. |
| F20 | §1 row #1 | Founder RSA "×3 not ×5" assumes no future co-founder additions. If a 4th technical co-founder is added in Year 1 (likely for AI startup), incremental RSA + 83(b) per founder. | LOW | Note co-founder-addition contingency in §1. |
| F21 | §6 Calendar | W7 TCPA opinion letter ($1,000) gates W7 first SMS send. If TCPA counsel returns longer-than-expected opinion (per §10.2 pattern in disclosurebot-v0), SMS launch slips a week. No buffer. | LOW | Add 1-week buffer between TCPA opinion delivery and SMS launch in §6. |
| F22 | §3 Phase D | SOC 2 audit firm $40K–$80K range is correct for Type II, but Type I (typically Push's first step) is $15K–$30K. Spec conflates them. | LOW | Distinguish Type I ($15K–$30K) vs Type II ($40K–$80K). |
| F23 | §11 matrix | Investor-defensible matrix is well-constructed but assumes founder-estimate dollars; if estimates are 50-100% off (per F1, F5, F6), the "Immediate ~40% of spend" allocation is also off. | LOW | Re-run matrix with corrected estimates. |
| F24 | §12.5 Peer benchmarks | Peer benchmarks ($5K–$12K low-end, $18K–$30K median, $40K–$80K high-end) are accurate for 2022-2023; 2026 market floor is +30-50% across all bands. | LOW | Update peer-benchmark band to reflect 2026 market. |
| F25 | §13.6 Self-acknowledgment | Spec self-flags Item #13 underbudget but explicitly defers correction to "Wave 4." This is the document's largest credibility-undermining flaw. | HIGH | Correct in v1; do not defer self-acknowledged errors to a later wave. |

---

## §Recommendations

**Specific line-items to re-budget (UPWARD):**

| # | Current | Recommended | Rationale |
|---|---|---|---|
| 2 | $500–$800 | $1,000–$2,500 | NY tailoring + execution |
| 7 | $500–$1,500 | $1,500–$4,000 | Merchant ToS with novel outcome-warranty |
| 8 | $300–$800 | $1,000–$2,500 | Specialist FTC counsel, not generalist |
| 9 | $500–$1,500/contract | $2,000–$5,000 first contract | First merchant negotiates the template |
| 11 | $300–$500 | $500–$1,500 | NY governing-law + IP-assignment + non-solicit review |
| 12 | $500–$1,500 | $1,500–$3,000 | Per `sms-compliance-v1.md §6.2` floor |
| 13 | $500–$1,500 | $1,800–$4,800 | Per `disclosurebot-v0.md §8.2` (self-flagged in §13.6) |
| 14 | $500–$1,500 | $1,500–$3,000 | NYC LL-144 specialist counsel rate floor |
| 16 | $3K–$8K | $6K–$12K | 2025-2026 E&O hardening + AI carve-out buy-back |
| 17 | $4K–$10K | $6K–$15K | NYC AI startup D&O premium |

**Items to ADD (missing from 18-row table):**

- **Item #19 Tax counsel initial engagement:** $3K–$6K
- **Item #20 Form D + blue-sky state filings:** $1,500–$3,000
- **Item #21 Subprocessor DPA reviews (Stripe, Supabase, Vercel, Twilio, etc.):** $2K–$5K
- **Item #22 EPLI insurance:** $1,500–$5,000 (Year-1)
- **Item #23 CGL insurance:** $500–$2,000 (Year-1)
- **Item #24 Workers' comp insurance:** $1,000–$3,000 (Year-1)
- **Item #25 Stripe Connect Platform Agreement compliance review:** $1K–$2K
- **Item #26 FinCEN MSB written opinion:** $2K–$5K
- **Item #27 IP FTO search (per TM):** $1,500–$3,000 each
- **Item #28 Trade-secret protection program (CIIAA + departing-employee checklist):** $2K–$4K
- **Item #29 Hidden-cost contingency reserve:** $15K–$40K

**Items to ELIMINATE from the 18-row table:**

- **None.** All 18 are real obligations. The problem is undercount, not overcount.

**Restate §2 Year-1 envelope:**

| Scenario | Spec | Recommended | Delta |
|---|---|---|---|
| Low (DIY-heavy survival) | $11K–$20K | **$25K–$40K** | +$14K–$20K |
| Realistic (counsel-engaged) | $25K–$40K | **$55K–$90K** | +$30K–$50K |
| High (Phase D included) | $50K+ | **$95K–$160K** | +$45K–$110K |

**Restructure phasing:**

- **Phase A0 (Day 14, $500–$1,500):** DIY-only path — Stripe Atlas + Clerky + EFF + self-file 83(b). Founder-capital. Realistic for Day 14 close.
- **Phase A1 (Day 30–45, $4,500–$10,000):** Engaged-counsel path — Cooley/Gunderson/Perkins seed package OR Lowenstein/Morrison Cohen if no warm intro. Founder + early F&F.
- **Phase B (Week 6, $6K–$15K):** Privacy + ToS + FTC + Pilot LOI + Advisor (corrected from $1.4K–$3.8K).
- **Phase C (Week 12, $12K–$25K):** Creator RSA + TCPA + DisclosureBot + LL-144 + NDA (corrected from $2.4K–$6.5K).
- **Phase D (Series Seed Readiness, Month 6-12, $40K–$80K):** TM filings + 409A + SOC 2 Type I + Insurance trifecta full bind. Restated as "must close before term sheet."

---

## §Summary for Wave 4 Triage

The legal-budget spec is structurally a strong v1 — phasing, RFQ template, DIY-vs-counsel matrix, FAQ, and cost-control playbook are all professionally constructed. The numbers are wrong by ~2× across most line items, primarily because (a) the spec uses 2022-2023 market data, (b) it self-acknowledges a $1,300–$3,300 underbudget on Item #13 and defers correction, (c) it omits 8+ obligations a fractional GC would expect to see (tax, Form D, blue-sky, DPAs, Stripe Connect review, FinCEN, FTO search, contingency reserve), and (d) it does not reconcile its $25K–$40K realistic line with the companion `counsel-engagement-plan.md`'s $32K–$69K envelope (a discrepancy the spec acknowledges in §13.5 and defers).

**Wave 4 corrections required before this doc goes to investors or counsel:** F1, F2, F3, F4, F5, F6, F7, F8, F25 (all HIGH severity above). The remainder are MED/LOW and can ship in v1.1.

**Net dollar impact of corrections: Year-1 realistic line moves from $25K–$40K to $55K–$90K.** This is still defensible as a seed-stage budget — peer creator-economy startups raise $1M–$3M and budget 5-10% for Year-1 legal ($50K–$300K), so $55K–$90K is on the conservative side of normal. The spec's current $25K–$40K is below the floor of normal and reads as either naive or actively misleading to a sophisticated reader.

---

*Audit complete. Auditor: external fractional-GC posture. No spec modifications made; all findings are recommendations only.*
