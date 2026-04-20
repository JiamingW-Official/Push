# Push v5.2 — Legal & Compliance Action Register (Wave 2 QA)

**Audience:** Founder (Jiaming), outside counsel, board, lead investor pre-read.
**Scope:** All legal / compliance items flagged across P1 domain skills + P1_rollup + advisor hiring + marketing surface + unaddressed risks surfaced by this audit.
**Status:** 2026-04-20 consolidation. Every row has a Priority / Trigger / Owner. Counsel has not yet been engaged.
**Companion docs:** [`docs/v5_2_status/P1_rollup.md`](../P1_rollup.md), [`docs/hiring/advisor-sourcing-playbook.md`](../../hiring/advisor-sourcing-playbook.md), [`docs/hiring/advisor-agreement-checklist.md`](../../hiring/advisor-agreement-checklist.md).

---

## §Executive Summary

**Posture (2026-04-20).** Push is a Delaware C-Corp, pre-pilot, pre-revenue, pre-counsel. A first layer of consumer-facing compliance has shipped: FTC 16 CFR § 255 endorsement-guide disclosure is live on both marketing and portal root pages, the Creator Decision Tree includes a verbatim disclosure block for Creator Terms, and NY LL-32 pay-transparency language is enforced for every ML Advisor outreach. The marketing `/security` page publicly claims SOC 2 Type II, GDPR compliance, and a DPA program — **these claims are aspirational; the underlying controls are not yet audited, which is itself the single largest compliance risk surfaced in this audit.**

**Shipped (verified).** FTC disclosure on landing + portal; creator-facing T1 minimum-guarantee disclosure drafted; advisor outreach compliance envelope (NY LL-32, EEO, CAN-SPAM, LinkedIn UA, EEOC retention) documented; IP assignment + non-solicit boilerplate drafted for advisor FAST.

**Pending counsel (drafted, awaiting review).** USPTO filings for "Vertical AI for Local Commerce" and "ConversionOracle" trademarks; advisor governing-law decision (NY vs DE); NYC LL-144 AEDT applicability to advisor rubric + creator Push Score; board consent template for first advisor grant; advisor pool cap (2.0% placeholder); 409A FMV methodology.

**Unaddressed (nobody has raised these yet — see §Unaddressed Risks).** D&O / E&O / Cyber insurance. Founders IP assignment (CIIAA / PIIA). FinCEN money-transmitter analysis for Stripe Connect creator payouts. State tax nexus as merchant cohort spreads beyond NY. SOC 2 Type I audit engagement to back the marketing claim. ADA/WCAG legal-risk audit on the creator/merchant portals.

**Overall assessment: moderate-elevated risk.** Controls exist on consumer-facing surfaces (FTC, NY LL-32). Corporate hygiene (founders IP, D&O, board paper trail for equity grants) is the weakest link. Public SOC 2 / GDPR claims ahead of audit is a FTC §5 deceptive-practices exposure and is the top P0 item below.

---

## §Register Table

Sorted: **P0 first (external-facing risk or misrepresentation), P1 (pilot blockers), P2 (scale blockers).**

| # | Item | Domain | Source | Priority | Trigger Event | Blocker For | Owner | Target Date | Status |
|---|------|--------|--------|----------|---------------|-------------|-------|-------------|--------|
| 1 | SOC 2 Type II / GDPR claims on `/security` page exceed current audit posture (deceptive-practice risk under FTC §5) | Marketing / Privacy | `app/(marketing)/security/page.tsx:725,725,929,949` | **P0** | Any investor / merchant reads the page and cites the claim | First external sharing of production URL; any merchant contract | Founder + outside counsel (privacy) | 2026-05-04 | **Unresolved — urgent** |
| 2 | ConversionOracle precision claim ("92% at M-12") needs footnote verification on all collateral | Marketing / Truth-in-Ads | `push-strategy §Legal & Trademark Review Notes`; `app/page.tsx` | **P0** | Any deck, landing update, or investor email referencing 92% | Investor pitches; press | Founder | 2026-04-27 | Footnote language drafted, not yet enforced site-wide |
| 3 | FTC 16 CFR § 255 disclosure verified live on prod `/` + `/marketing` | Marketing | `app/page.tsx:337-398`; `app/(marketing)/page.tsx:47,49,439,671,774,1021,1148,1462` | **P0** | Production deploy | Any paid traffic to the landing | Founder | 2026-04-20 | **Shipped** — requires weekly spot-check |
| 4 | "Vertical AI for Local Commerce" USPTO application (classes 35, 42) | IP / Trademark | `push-strategy §Legal & Trademark Review Notes`; `P1_rollup §P2 checkpoints` | **P0** | First external press mention; first investor deck | Press release; public launch | Founder + IP counsel | 2026-05-11 (Q2-W1) | Not filed |
| 5 | "ConversionOracle™" intent-to-use TM application before landing-page launch | IP / Trademark | `push-strategy §Legal & Trademark Review Notes` | **P0** | Landing page scale traffic | Public launch; investor deck | Founder + IP counsel | 2026-05-11 | Not filed |
| 6 | Founders IP assignment (CIIAA / PIIA) for Jiaming, Prum, Milly | Corporate / IP | **(not yet documented anywhere)** | **P0** | Any investor deck, cap-table review, due diligence | Seed-round close; term sheet | Founder + corporate counsel | 2026-05-04 | **Not started — critical gap** |
| 7 | Board resolution template for first advisor RSA grant | Securities / Corporate | `docs/hiring/advisor-agreement-checklist.md §Corporate formality` | **P1** | First advisor signature | Day 14 advisor-hire close | Founder + corporate counsel | 2026-05-04 | Drafted in Clerky; not board-approved |
| 8 | Rule 701 exempt-offering compliance for advisor / creator T4-T6 equity grants | Securities | `push-creator §2 T5/T6`; `advisor-agreement-checklist §Compensation` | **P1** | First advisor grant OR first T5 creator promotion | Any equity issuance above $1M annual pool | Founder + securities counsel | 2026-05-18 | Not analyzed |
| 9 | 409A FMV valuation (required before first RSA grant) | Securities / Tax | `advisor-agreement-checklist §Compensation` | **P1** | First advisor RSA grant | Any RSA at strike >$0.00001 | Founder + valuation firm | 2026-05-18 | Not engaged |
| 10 | T1 minimum earning guarantee disclosure inserted into Creator Terms §X | Contracts / Marketing | `push-creator §2 Decision Tree`; `app/(marketing)/legal/terms/` | **P1** | First T1 creator onboarding under Beachhead | Beachhead-phase creator recruitment | Founder + employment counsel | 2026-05-11 | Verbatim text drafted, not yet in Terms of Service |
| 11 | NYC Local Law 144 (AEDT) applicability analysis — advisor rubric + creator Push Score | Employment / Tech | `advisor-sourcing-playbook §Open items`; `push-creator §4 Push Score` | **P1** | First algorithmic creator ranking goes live for any NYC creator | Creator tier progression feature | Founder + employment counsel | 2026-05-04 | Flagged, unresolved (likely non-applicable for manual rubric; Push Score is the actual risk) |
| 12 | NY SHRL / FTC non-compete posture documented; advisor agreements use non-solicit only | Employment | `advisor-sourcing-playbook §6` | **P1** | Any advisor agreement signature | Advisor pool ramp | Founder + counsel | 2026-05-04 | Policy decided; not counsel-reviewed |
| 13 | EEOC record-retention schedule enforced (12 mo non-hire / 7 yr hire) | Employment | `advisor-sourcing-playbook §8`; `ml_advisor_outreach_tracker §Compliance Notes` | **P1** | Monthly purge cadence first due | Audit/legal defense preparedness | Founder | 2026-05-01 | Policy written; purge not yet run |
| 14 | LinkedIn UA §8.2 + CAN-SPAM compliance for advisor outreach | Marketing / Anti-Spam | `inmail_drafts §Send Day 7 Checklist`; `ml_advisor_outreach_tracker §Compliance Notes` | **P1** | Day 7 batch InMail send | Advisor recruiting pipeline | Founder | 2026-04-27 | Enforced via checklist; needs counsel confirmation |
| 15 | ASC 606 revenue recognition policy (per-verified-customer event-based) | Accounting | `push-pricing §5 GAAP treatment` | **P1** | First Beachhead invoice to merchant | Monthly close; investor financials | Founder + fractional CFO | 2026-06-01 | Direction noted; policy not written |
| 16 | ASC 450 contingency accounting for T1 minimum guarantee | Accounting | `push-pricing §5 GAAP treatment` | **P1** | First T1 guarantee trigger event | Monthly close | Founder + CFO | 2026-06-01 | Classification documented ("Cost of Revenue — Creator Payouts"); no journal-entry playbook |
| 17 | 1099-NEC / 1099-K issuance for creators (threshold + state-by-state) | Tax | **(not yet documented)** | **P1** | First creator payout in any state | Tax year 2026 close | Founder + tax accountant | 2026-10-01 | Not started |
| 18 | Creator Terms of Service — T1 guarantee, dispute process, scoring, payout SLA | Contracts | `push-creator §2,§5`; `app/(marketing)/legal/terms/` | **P1** | First creator signup under v5.2 economics | Beachhead launch | Founder + employment counsel | 2026-05-11 | Drafted; not counsel-reviewed |
| 19 | Merchant Terms of Service — outcome warranty, Month-1 proration, per-customer billing | Contracts | `push-pricing §2.1, §10` | **P1** | First Beachhead merchant contract | Beachhead phase (merchants 11+) | Founder + corporate counsel | 2026-05-11 | Drafted; not counsel-reviewed |
| 20 | Supabase DPA signed; PII minimization policy documented | Privacy / Vendor | `app/(marketing)/security/page.tsx:1511`; **(no DPA on file)** | **P1** | Any EU creator/merchant signs up OR marketing claim is re-shared | Public GDPR claim; EU pilot expansion | Founder + privacy counsel | 2026-05-11 | Claim is public; underlying DPA not executed |
| 21 | Stripe Connect Platform Agreement fully read + compliance acknowledged | Money Movement | **(not yet documented)** | **P1** | First Stripe payout in production | Creator payouts live | Founder | 2026-05-04 | Stripe account exists; platform agreement compliance not audited |
| 22 | Competitor benchmark claims flagged "estimated" in all external comms | Marketing | `push-metrics §6.x.3` | **P1** | Any deck or email cites competitor SLR numbers | Investor pitches; press | Founder | 2026-04-27 | Flagged in SKILL.md; not systematically enforced in external artifacts |
| 23 | WCAG 2.1 AA audit on creator/merchant portal (tier badges, forms, dashboards) | Accessibility / ADA | `Design.md §Tier Identity`; `P1_rollup §P1-1` | **P1** | First public portal access; any ADA demand letter | Pilot launch on portal URL | Founder + a11y consultant | 2026-06-01 | Tier-badge contrast verified AA; rest of portal not audited |
| 24 | Privacy Policy publicly posted; data-subject rights routed (access, delete, correct) | Privacy | `app/(marketing)/security/page.tsx:1420`; **(no privacy page found)** | **P1** | Any California or EU user signs up | CCPA compliance; GDPR Art. 15/17 | Founder + privacy counsel | 2026-05-18 | Marketing page claims support; policy page likely absent |
| 25 | Cookie consent banner (required by CCPA + GDPR) | Privacy | `app/(marketing)/legal/cookies/page.tsx` (static page only) | **P1** | Marketing site serves any cookies to EU / CA user | Any analytics deployment | Founder | 2026-05-18 | Static policy; no runtime banner |
| 26 | D&O (Directors & Officers) liability insurance | Corporate / Risk | **(not yet documented)** | **P2** | Any investor directorship; any officer-level lawsuit | Seed round close; board formation | Founder + broker | 2026-07-01 | Not engaged |
| 27 | E&O (Errors & Omissions) / Professional liability insurance | Corporate / Risk | **(not yet documented)** | **P2** | First merchant contract with indemnity clause | Beachhead-phase contracts | Founder + broker | 2026-07-01 | Not engaged |
| 28 | Cyber-liability insurance (breach notification, ransomware) | Corporate / Risk | **(not yet documented)** | **P2** | First PII breach notification obligation | SOC 2 Type I audit | Founder + broker | 2026-07-01 | Not engaged |
| 29 | SOC 2 Type I engagement (to back existing marketing claim) | Security / Compliance | `app/(marketing)/security/page.tsx:1457` | **P2** | Any merchant contract due-diligence request | Scale-phase enterprise contracts | Founder + audit firm | 2026-09-01 | Marketing claims "March 2026"; audit not started |
| 30 | FinCEN money-transmitter / MSB analysis (Stripe Connect model, Push as platform) | Money Movement | **(not yet documented)** | **P2** | Monthly payout volume crosses $100k OR platform intermediates funds | Series Seed due diligence | Founder + fintech counsel | 2026-07-01 | Not started — high uncertainty risk |
| 31 | State tax nexus analysis (sales tax + income tax as merchants spread beyond NY) | Tax | **(not yet documented)** | **P2** | Merchants in 2nd state; $100k annual revenue per state | Multi-state expansion | Founder + tax accountant | 2026-08-01 | NY only today |
| 32 | Creator Productivity Lock contract language (T4-T6 retainer + equity stickiness) | Contracts | `push-strategy §Legal & Trademark Review Notes` | **P2** | First T4 contract signature | T4+ creator ramp | Founder + employment counsel | 2026-07-01 | Internal-only term; no contract language yet |
| 33 | Trade-secret protection program (ConversionOracle training data, algorithms) | IP | `P1_rollup §Open Risks #5` | **P2** | First competitor-adjacent hire or departure | Any departure of a team member with ConversionOracle access | Founder + IP counsel | 2026-07-01 | Not started |
| 34 | 83(b) election filing support for every RSA grant (30-day federal deadline) | Tax / Securities | `advisor-agreement-checklist §Compensation` | **P2** | First RSA grant to advisor or creator | Every equity issuance | Founder + tax accountant | Per-grant | Guide drafted in checklist; no operational tracker |

**Row count: 34. P0: 6. P1: 19. P2: 9.**

---

## §Domain Breakdown

### Employment / HR
- **NY LL-32-2022 Pay Transparency** (#14): enforced verbatim for advisor outreach; every InMail carries "0.25–0.5% equity over 2-year vest, 6-month cliff, no cash."
- **NYC Local Law 144 (AEDT)** (#11): open question — advisor manual rubric almost certainly non-applicable; Push Score for creator tier progression is the real exposure because it automates decisions affecting earning.
- **EEO (Title VII / ADA / ADEA / NY SHRL)** (#13, #23): selection rubric documented; retention cadence policy written but not yet exercised.
- **Non-compete posture** (#12): FTC 2024 rule (partially enjoined) + NY AB A1278 → advisor agreements are **non-solicit only** (12-month, employees + contractors + customers + creators).
- **Advisor agreement** (#7): FAST template via Clerky; counsel review outstanding.

### Securities
- **Rule 701 / Reg D analysis** (#8): not yet performed. Rule 701 annual aggregate cap ($1M without extra disclosure, or 15% of assets / 15% of outstanding stock) becomes binding when advisor grants + T4-T6 equity pool expand.
- **Advisor pool cap** (#7): 2.0% fully-diluted placeholder in `advisor-agreement-checklist`; needs CFO/board confirmation.
- **Restricted Stock Agreements** (#9, #34): require 409A valuation; 83(b) election tracking; board written consent per grant.

### Accounting / Finance
- **ASC 606 per-event revenue recognition** (#15): documented direction in `push-pricing §5`; policy memo absent.
- **ASC 450 contingency for T1 guarantee** (#16): classified as Cost of Revenue — Creator Payouts; recognition at trigger event, not accrual.
- **1099-NEC / 1099-K** (#17): not yet scoped. 1099-K threshold dropped to $600 (pending IRS phase-in); many creators will receive both forms depending on state.
- **State tax nexus** (#31): P2 — flagged as soon as merchants spread beyond NY.

### Intellectual Property
- **"Vertical AI for Local Commerce"** (#4): USPTO classes 35 + 42; P0 per `push-strategy` notes.
- **"ConversionOracle™"** (#5): intent-to-use filing before any landing-page scale.
- **"Creator Productivity Lock"** (#32): internal-only; do NOT use publicly without legal review.
- **Founders IP assignment** (#6): **critical gap** — no CIIAA / PIIA on file for Jiaming, Prum, Milly. This is standard DD deal-blocker.
- **Trade-secret program** (#33): ConversionOracle training corpus + labeled event data is the moat; no formal trade-secret protection program yet.

### Marketing / Advertising
- **FTC 16 CFR § 255 endorsement** (#3): live on production at `app/page.tsx:337-398` and throughout `app/(marketing)/page.tsx` via `disclosure-marker` superscripts.
- **Truth-in-ads for Oracle precision** (#2): footnote `*verification precision target 92% at M-12` required on any collateral citing the number.
- **Competitor benchmarks** (#22): flagged "estimated" in `push-metrics §6.x.3`; enforcement in external artifacts is ad-hoc.
- **SOC 2 / GDPR marketing claims** (#1): **top P0**. Site claims "SOC 2 Type II" and operational DPA program; neither is audited/executed. FTC §5 deceptive-practices exposure.

### Money Movement
- **Stripe Connect Platform Agreement** (#21): Push operates as the platform; creator payouts flow through Stripe. Platform agreement compliance (KYC, screening, payouts to creators) is delegated to Stripe but Push owns the upstream verification.
- **FinCEN MSB analysis** (#30): open. Push may be a "money transmitter" under FinCEN 31 CFR § 1010.100 if the platform is deemed to "accept currency … from one person and transmit … to another person or location." Stripe's model typically insulates platforms, but a written legal opinion is missing.

### Privacy / Data
- **Supabase DPA** (#20): marketing page claims "Push maintains a DPA"; the DPA with Supabase (our data processor) is not yet executed. Fix ahead of any EU user.
- **Privacy Policy** (#24): `app/(marketing)/security/page.tsx` references Art. 15 / 17 data-subject-right routing to `privacy@push.nyc`; no privacy policy page found under `app/(marketing)/legal/`.
- **Cookie consent** (#25): `legal/cookies/page.tsx` exists as static content; no runtime banner.
- **PII minimization** (#20): Supabase stores creator phone / address / Stripe metadata; DPA + data-retention policy absent.

### Accessibility
- **WCAG 2.1 AA** (#23): tier badges verified AA (Path A tables in `Design.md § Tier Identity` and `P1_rollup §P1-1`). Rest of portal (forms, modals, charts, dashboards) not audited. ADA demand-letter risk is non-trivial for any consumer-facing site with a NY nexus.

---

## §Unaddressed Risks

The following were **not** flagged in P1 docs or existing skills but are material for a professional company at Push's stage:

1. **Founders IP assignment (CIIAA / PIIA).** Jiaming, Prum, and Milly have no signed proprietary-information-and-inventions agreements on file. Standard in every seed-round DD; failure to provide is a term-sheet renegotiation risk. Adds to register as #6, **P0**.
2. **D&O / E&O / Cyber insurance trifecta.** No broker engaged. D&O is required for any post-seed board; E&O / Cyber becomes a contract-term blocker the moment the first Beachhead merchant asks for indemnification. Added as #26-28, **P2** each.
3. **SOC 2 claim exceeds audit reality.** `app/(marketing)/security/page.tsx` advertises "SOC 2 Type II" and "SOC 2 Type I — March 2026" (line 1457). No audit firm engaged. This is **FTC §5 deceptive-practices exposure** — the single most dangerous item in this register, added as #1, **P0**.
4. **Founders IP + Trade-secret program for ConversionOracle.** The ConversionOracle training corpus is the declared moat (`P1_rollup §Commit Log` via `push-strategy`). No trade-secret protection program — no labeled-data access log, no departure checklist, no departing-employee clawback. Added as #33, **P2**.
5. **FinCEN money-transmitter analysis.** Push positions itself as an outcome-based platform routing merchant-paid dollars to creators via Stripe Connect. This smells like it walks on the edge of MSB territory. No legal opinion on file. Added as #30, **P2**.
6. **Supabase DPA not executed while marketing claims compliance.** Public claim + missing underlying contract = deceptive-practice + GDPR exposure stacked. Added as #20, **P1**.
7. **Creator Push Score under NYC LL-144 (AEDT).** An algorithmic score used for tier progression affecting creator earnings — this IS an "automated employment decision tool" under NYC Local Law 144 for any NYC creator. Advisor rubric manual; Push Score automated. Added as #11, **P1**.
8. **Privacy policy page appears absent while DPA+access/deletion claims are public.** No file found under `app/(marketing)/legal/privacy/`. Added as #24, **P1**.

---

## §Counsel Engagement Plan (P0 items)

| # | P0 Item | Counsel Type | Est. Hours | Est. Budget | Rationale |
|---|---------|--------------|------------|-------------|-----------|
| 1 | SOC 2 / GDPR marketing-claim audit | Privacy (+ marketing review) | 6-10 hr | $3k-5k | Immediate letter guidance on claim rectification; suspend claim or qualify |
| 2 | Oracle precision footnote enforcement | Marketing / advertising | 2-3 hr | $1k-2k | Template language + review sweep of marketing collateral |
| 3 | FTC disclosure maintenance | Marketing | 1 hr / qtr | $500/qtr | Ongoing review cadence; already shipped |
| 4 | "Vertical AI for Local Commerce" TM filing (classes 35, 42) | IP / trademark | 8-12 hr | $2k-3k + $350/class USPTO fee | Intent-to-use application + docket response |
| 5 | "ConversionOracle™" TM filing | IP / trademark | 6-8 hr | $1.5k-2k + $350 USPTO | Same as above, separate mark |
| 6 | Founders IP assignment (CIIAA / PIIA) | General corporate | 4-6 hr | $1k-2k | Template adaptation + execution for 3 founders |

**Total P0 counsel budget: ~$9k-15k one-time + $500/qtr ongoing.** Sequence recommendation: engage privacy counsel first (item #1 is actively live), then corporate (items #6-7), then IP (items #4-5).

**Counsel roster to stand up (target 2026-05-04):**
- General corporate: C-Corp hygiene, founders IP, board consent for grants
- Employment / benefits: advisor FAST review, creator Terms, NYC LL-144 opinion
- IP / trademark: USPTO filings, trade-secret program
- Securities: Rule 701 / Reg D analysis ahead of T5 equity ramp
- Tax: 1099 flow, state nexus, 409A coordination, 83(b) tracking
- Privacy: GDPR / CCPA / SOC 2 claim rectification

---

## §Next Monday Actions (2026-04-27)

The first five items to tackle this week, in order:

1. **Remove or qualify SOC 2 / GDPR claims on `/security`** (item #1). Today: temporary draft replaces claims with "working toward SOC 2 Type I, target engagement 2026-Q3" and "data-processing-agreement template available on request." Parallel: engage privacy counsel for written review.
2. **Enforce "* verification precision target 92% at M-12" footnote** wherever the 92% number appears in external artifacts (item #2). Sweep `app/(marketing)/page.tsx`, any investor deck, any draft press outreach.
3. **Engage general-corporate counsel** (items #6, #7) — founders IP + board consent template are interdependent and blocking every subsequent equity motion.
4. **File USPTO intent-to-use for "ConversionOracle™"** (item #5) ahead of any landing-page paid-traffic ramp. Intent-to-use is cheaper and faster than actual-use and preserves the date.
5. **Execute Supabase DPA and draft privacy policy** (items #20, #24) before re-publishing or promoting the `/security` page. Privacy counsel engagement from #1 covers both.

**Deadlines summary:**
- 2026-04-27 — footnotes enforced, SOC 2 claim rectified, privacy counsel engaged
- 2026-05-04 — founders IP signed, LL-144 opinion received, board-consent template drafted, EEOC retention purge cadence run
- 2026-05-11 — USPTO filings + Creator/Merchant Terms counsel-reviewed
- 2026-05-18 — 409A + Rule 701 analyses complete; privacy policy page published
- 2026-06-01 — ASC 606/450 written policy; WCAG 2.1 AA audit started

---

## §Review Cadence

- **Weekly (Mon):** this register is reviewed by founder; any row flipped to new status or new row added logs a note in `docs/v5_2_status/audits/`.
- **Monthly (first business day):** EEOC retention purge + do-not-contact list sweep.
- **Per event:** any High severity trigger (per `P1_rollup §Open Risks`) adds a row; any counsel sign-off flips row Status to `Closed` with counsel name + date.

---

*Register version: v5.2 Wave-2 — 2026-04-20. NOT legal advice; operational control register for counsel to work from.*
