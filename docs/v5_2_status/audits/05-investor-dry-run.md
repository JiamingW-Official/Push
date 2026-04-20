# Push v5.2 — Investor Pitch Dry-Run (Skeptical VC Roleplay)

**Audience:** Founder (Jiaming) + prospective lead investor reviewers
**Frame:** Mock Q&A with a seed/Series-A partner who has seen 200+ local-commerce / creator-economy pitches (think Benchmark, USV, First Round, a16z). Hard-nosed but fair.
**Status date:** 2026-04-20
**Position:** Pre-pilot, pre-revenue, pre-team-complete. Valuation credibility entirely qualitative.
**Author:** Consolidation agent — read-only audit of P1 docs.

> This document does NOT score the Push business. It scores **the pitch story's readiness for a real investor call**, given the artifacts that exist in the repo today.

---

## §Executive Summary

**Overall investor-readiness grade: C+ (conditional meeting-worthy).**

The v5.2 P1 docs land a credible **strategic and unit-economics story** — outcome-priced vertical AI, SLR North Star, Two-Segment creator economics, a coherent T1 reserve model. A sharp partner will grant the category framing and the pricing math a fair hearing. The doc stack is unusually disciplined for pre-pilot (numeric reconciliation file, FTC disclosure already shipped, GAAP treatment for reserves, messaging architecture with 4 matrices). That earns a first meeting.

**But it will not survive a second meeting in its current state.** Three structural problems:

1. **No demand proof.** Zero pilot data. The 9-month merchant lifetime, 85 verified customers/month/merchant, 20% T1 fail rate — none of it is grounded. A VC who has watched Yelp/Groupon assume merchant LTVs that didn't show up will press here first.
2. **Moat assertions lean on assets that don't exist yet.** ConversionOracle is described as a training-data-lock moat, but no labels have been collected. Creator Productivity Lock requires T4–T6 contracts, but the platform hasn't issued a T4 retainer yet. Both moats are Q3 2026 promises.
3. **Team gap at the layer the moat depends on.** ML Advisor is still in outreach (15 InMails, Day 7 batch). No full-time ML hire. No technical co-founder visible in the docs. For a "Vertical AI" category claim, this is the single most urgent gap.

**Top 3 weaknesses (ranked):**
1. Pre-pilot; all unit economics are plan, not actuals. 9-month lifetime assumption is the weakest link.
2. ConversionOracle is a roadmap asset, not a working system. The moat proof-point is Q3 2026.
3. Team gap: no full-time ML lead, solo founder signal in the Trigger-Response playbook ("Team?" answer lists three people but no co-founder).

---

## §The 15 Hardest Questions

Each question is ranked roughly by difficulty — harder questions earlier. Each has: verbatim question, why it's hard, our answer with file:§ citations, credibility grade, and (where applicable) the gap.

---

### Q1 — Category / Positioning

**"'Vertical AI for Local Commerce' — the last six pitches I saw this quarter also called themselves vertical AI. Give me the two sentences that separate you from Toast, Square, Yelp, Groupon, OpenTable, and whatever Meta ships for local next year. No buzzwords."**

- **Why it's hard:** "Vertical AI" is the most over-rotated positioning of the 2026 cycle. An evasive answer lists buzzwords, a good answer points at an isolated moat.
- **Our answer:** Push is the only system that (a) bills **per verified walk-in customer** (not per impression, per post, per seat, or per software seat), AND (b) owns the verification layer end-to-end (ConversionOracle: CV + OCR + geo). Toast/Square are point-of-sale; Yelp/Groupon match existing demand; OpenTable verifies at reservation not walk-in; Meta's local doesn't bear outcome risk. See push-strategy Matrix 2 ("Isn't this a marketplace?" / "Can't Meta/Yelp just copy this?") and push-pricing §6 ("Pricing vs Alternatives" comparison table).
- **Credibility grade: B.** The differentiation argument is sharp on paper. The verification system being pre-product is the wobble.
- **Gap:** ConversionOracle doesn't exist as a measurable system yet. Precision/recall targets (92%/88% at M-12, push-metrics §6.x) are *aspirations* with no baseline shipped.

---

### Q2 — Moat / Defensibility

**"Walk me through what happens when Meta ships 'Local Creator Attribution' next March. Honest answer. They already have the creator graph, they already have the merchant ad accounts, and they can force QR into Instagram Stories natively. What stops you?"**

- **Why it's hard:** "We'll be faster" or "they won't prioritize it" are killing answers. A good answer has a specific asset that doesn't transfer.
- **Our answer:** Three asymmetries: (1) **Training data lock** — Pilot generates 10k+ labeled verification events before a platform-incumbent enters; Meta's own data has no walk-in ground truth (they only have click/install). (2) **Creator Productivity Lock** — T4–T6 retainer + equity (push-creator §2) contractually binds the top 20% of producing creators; Meta's open graph cannot match retainer+equity. (3) **Outcome-priced P&L** — Meta's ads team is a billing-on-reach business; capping revenue to verified outcomes would cannibalize their existing ad take rate. See push-strategy Matrix 2 last row.
- **Credibility grade: C.** The three-asymmetry framing is defensible; the problem is all three assets are **forward-dated**. 10k labeled events don't exist. No T4 retainer has been issued. Meta's P&L cannibalization argument is historically weak (they cannibalize Facebook for Instagram, Reels for Stories, Threads for Twitter without hesitation). A sharp partner will push hard.
- **Gap:** No evidence of data collection today. No executed T4 retainer contract. No counter-scenario for "Meta buys their way in via partnership with an existing local verification vendor."

---

### Q3 — Unit Economics

**"Your LTV is $6,354 based on a 9-month merchant lifetime. Where does 9 months come from, and what's your confidence interval? Because if it's 4 months — which is what Groupon actually ran at for the comparable SMB category — your LTV/CAC goes from 15x to 7x, and your stressed case goes underwater."**

- **Why it's hard:** This is THE killer question. Pre-pilot LTV assumptions are where most decks die. "Industry average" is a 0-credibility answer.
- **Our answer:** 9 months is a planning assumption keyed to the outcome-warranty mechanic: Month 1 is prorated if <5 verified customers delivered (push-pricing §8 Economic Traps #1), which removes the "paid for nothing in Month 1" churn driver that killed Groupon SMB. The second layer is the Retention Add-on (push-pricing §2.3) — visit 2/3/loyalty add-ons re-engage the merchant beyond the first campaign cycle. Stressed LTV/CAC of 10.0x (push-pricing §5) already takes 2x churn — at Groupon's 4-month lifetime equivalent (~2.25x baseline churn), LTV/CAC falls to ~6x, which is still above the 3x VC bar but compresses margin of safety.
- **Credibility grade: C+.** The outcome-warranty and retention-add-on mechanics are real mitigations on paper. But without a single pilot merchant completing a second campaign, the 9-month number has zero empirical backing.
- **Gap:** No cohort data. No comparable case study from an outcome-priced SMB platform. The "Groupon ran at 4" claim is historically supported; the "we're not Groupon because outcome-warranty" claim is unsupported by Push data.

---

### Q4 — Unit Economics / Reserve Sensitivity

**"This T1 reserve at $0.30 per customer assumes 20% fail rate × 10% T1 volume share. In your first six months you'll be majority-T1 because you don't have T2s yet. Won't you be closer to your worst-credible case of $1.80, making your gross margin 22% not 27%? And what does that do to your Series A story?"**

- **Why it's hard:** This is an arithmetic trap. A VC who's read numeric_reconciliation.md will hit it fast. "Oh we'll scale past it" is a fail.
- **Our answer:** Correct, and push-pricing §5 Sensitivity table explicitly names this: worst-credible 30% fail × 40% share = $1.80/customer → GM compresses from 26.7% to 22.0% (–4.7 pts). Three mitigations in the docs: (a) T1 minimum guarantee is **capped at 3 triggering events per creator per calendar year** (push-creator §2, Decision Tree); (b) T1→T2 graduation happens at just 2 verified customers (push-creator §3), so the T1 share should compress quickly; (c) Pilot is 10 merchants at $0 merchant-side (push-pricing §2.1), so the reserve isn't triggered at merchant cost — Push absorbs it from F&F budget. Beachhead ramp (Month 2+) is when real reserve math starts.
- **Credibility grade: B-.** The mitigations are real. The problem is a sophisticated LP will ask for the cohort curve on T1→T2 graduation rates, which doesn't exist yet.
- **Gap:** No forecast curve for T1 volume share by month. No baseline graduation-rate data from comparable platforms.

---

### Q5 — Team / Execution

**"Who's your technical co-founder? I'm looking at your Trigger-Response playbook and I see Founder, Ops lead, Creator Ops, and an ML advisor you're still cold-emailing. That's not a company that's going to ship Computer Vision + OCR + geo-verification against a Q4 production target."**

- **Why it's hard:** THE single question most likely to kill this round at a partner meeting. There's no good evasion.
- **Our answer:** Honest answer from push-strategy Trigger-Response: team is Jiaming (founder), Prum (Ops lead), Milly (Creator Ops), with ML Advisor actively being recruited (P1-2 tracker, 15 targets, Day 7 batch send, Day 14 ship criterion = ≥1 real conversation). The ConversionOracle v1 MVP can be built by the advisor + contractor topology in months 1–3; a full-time ML hire is scoped for post-Seed. The reason we haven't locked a technical co-founder is that ConversionOracle's CV+OCR problem is narrow and well-understood (not novel research), and we want to test the business-model risk (pilot conversion) before raising enough to hire a $350K comp ML lead.
- **Credibility grade: D+.** This is the weakest answer in the deck. A pre-seed partner will accept it with reservations. A Series-A partner will not. "We'll hire an ML lead post-funding" on a category claim called "Vertical AI" is the opposite of what the category requires — the AI needs to be visibly working before the raise, not after.
- **Gap:** No technical co-founder. No full-time ML hire plan with timeline. No contingency if ML Advisor Day 14 = 0 conversations (though the tracker does have a second-batch rewrite plan).

---

### Q6 — Regulatory / Compliance

**"Walk me through your FTC 16 CFR 255 exposure. Your creator tier is literally called 'Partner' and you grant equity to T5/T6. If a T6 creator makes a post without disclosing 'paid partnership' and FTC audits you, which entity is on the hook, and what's your insurance?"**

- **Why it's hard:** This is a real regulatory knife. The 2023 FTC Endorsement Guides update made platforms liable alongside creators.
- **Our answer:** FTC disclosure shipped on the landing page (P0-3 2026-04-19; CHANGELOG v5.2 Compliance section) and is required on all illustrative numbers (`data-mock="true"` + asterisk footnote). DisclosureBot is in the technical killer-line (push-strategy External Positioning) with a target false-positive rate ≤5% (push-metrics §6.x). All creator tiers execute a Creator Terms disclosure (push-creator §2 verbatim block). T4–T6 equity grants pass through RSA paper (push-creator §2 T5 row: 0.02% RSA 4-year vest 1-year cliff) which triggers SEC Rule 701 exemption analysis.
- **Credibility grade: B.** Landing-page FTC disclosure and DisclosureBot as a product-owned function is a credible answer; the T1 verbatim block in Creator Terms is better than most creator platforms have shipped. Weakness: DisclosureBot is not yet operational and 5% FP is a target not a baseline.
- **Gap:** No FTC audit-simulation playbook. No E&O / cyber insurance coverage documented. No counsel letter on Rule 701 exemption for T5/T6 equity grants.

---

### Q7 — Regulatory / Securities

**"You're granting 0.02%–0.2% RSAs to Rest-of-US-based creators who are 1099 contractors, not employees. Have you done the 409A? Have you done Rule 701 exemption math? What happens when your T6 creator list crosses 35 people in 12 months and you trip the 701 cap?"**

- **Why it's hard:** A specific, citable trap that most creator-equity-pitching startups have never researched.
- **Our answer:** Candidly incomplete in the docs. push-strategy Legal & Trademark Review Notes block covers brand IP (USPTO filings) but not securities. push-creator §2 quotes equity ranges but does not cite 409A or 701. Our plan: engage securities counsel alongside IP counsel (noted "IP counsel by 2026-Q2-W1" in push-strategy) for a Rule 701 analysis before the first T5 grant is executed. Until then, T4 retainers ($800/mo, no equity) are the gate.
- **Credibility grade: D.** The honest truth: this isn't in the P1 docs, and any partner who asks this specifically will note it as "founders haven't done the diligence yet."
- **Gap:** No 409A valuation reference. No Rule 701 exemption analysis. No counsel-assigned timeline for the first T5 grant. This is the single largest underspecification in the regulatory stack.

---

### Q8 — Moat / Competitor Reaction

**"OpenTable sees verified walk-ins as their natural adjacency. They have 60K restaurant merchants and Priceline's balance sheet. What's the scenario where they don't just ship your product for restaurants in 18 months and kill you with distribution?"**

- **Why it's hard:** OpenTable is the single most credible "strategic acquirer or killer" in the space. Hand-waving is fatal.
- **Our answer:** push-pricing §6 articulates the structural difference: OpenTable matches EXISTING demand ("I want Italian tonight"), they don't create new demand via content. Retrofitting creator-content orchestration onto a reservation system is a different muscle (content ops, creator scoring, payment rails, FTC disclosure). Their gross margin in reservation is ~85%; an outcome-priced creator platform comes in at 27% (push-pricing §5) — so for OpenTable to ship this, they'd be margin-dilutive to their core. The stronger scenario is OpenTable as a **strategic acquirer** of Push once we cross a certain verified-customer volume threshold. push-strategy External Positioning explicitly rejects "Local discovery platform" as a category to avoid OpenTable confusion.
- **Credibility grade: B-.** The margin-dilution argument is real but weak — OpenTable could run a loss-leader adjacent product. The "strategic acquirer" framing is honest but is the founder's Plan B, not a moat.
- **Gap:** No M&A comparable table. No acquirer-interest signals. No pre-emptive partnership strategy with restaurant-category incumbents.

---

### Q9 — SLR Believability

**"SLR of 25 at Month 12, 50 at Month 24. How do you get there without a working AutoVerification pipeline today? Your own decomposition says AutoVerification is 40% of SLR impact. If ConversionOracle is 70% precision instead of 92% at M-12, your SLR craters."**

- **Why it's hard:** A VC who reads the SLR decomposition (push-metrics §1.4) can construct this themselves. No escape.
- **Our answer:** Correct, and push-metrics §6.x.2 SLR-below-target playbook names this: if AutoVerification <70% at M-6 or <85% at M-12 → ConversionOracle tuning + weekly precision/recall review + ML Advisor escalation if precision <88%. The SLR target band (push-metrics §1.2) is explicitly a learning phase at M-6 (≥12, tolerates high manual intervention). Escalation rule (push-metrics §6.x.2 + P1_rollup §Open Risks #6): SLR <50% of target for 2 consecutive months triggers a founder strategic review — we'll pivot the hiring/automation split rather than force a broken ratio.
- **Credibility grade: B.** The escalation rule is specific and credible. The weakness is that a VC diligencing this will ask for a **sensitivity table showing SLR under different AutoVerification coverage scenarios**, which the docs don't have.
- **Gap:** No SLR-vs-AutoVerification sensitivity table. No benchmark for "industry median CV+OCR precision at comparable dataset size." No month-by-month ramp forecast for AutoVerification coverage.

---

### Q10 — Exit / Scaling

**"Your category comparables are a marketplace (Whalar), a location data company (Placer), a loyalty app (Belong), and a reservation system (OpenTable). None of those exited north of $2B. Where's the $10B exit comp for an outcome-priced creator-attribution platform?"**

- **Why it's hard:** VCs are fundamentally in the exit business. A weak answer kills the round even if the product is great.
- **Our answer:** Push's exit comp set is a **hybrid**: (a) Shopify ($90B ceiling, vertical SaaS for e-commerce → same positioning for local commerce — push-strategy Company-Building Thesis uses Shopify as the explicit benchmark), (b) Toast ($12B, vertical SaaS for restaurants — comparable density economics), and (c) Ramp ($13B, outcome-aligned fintech for SMB — comparable outcome-pricing thesis). The local-commerce-creator-attribution layer is estimated at $50B+ in annual spend (Meta local ads + Yelp ads + Groupon + creator ops estimated). Push's outcome-priced wedge targets ~5% take on verified customer volume at scale.
- **Credibility grade: C.** The Shopify-for-local positioning is aspirational; Toast is the honest comp, and Toast has been range-traded for 2 years. A seasoned partner will note that the "creator attribution" layer of the stack historically gets compressed by platforms (Meta, TikTok) rather than becoming its own standalone.
- **Gap:** No precedent transaction table. No TAM-bottom-up with verifiable sources. No defensible answer to "why doesn't this get consolidated into a platform at Series C?"

---

### Q11 — Category / Positioning

**"'Push is NOT a creator marketplace' — fine. But creators onboard on your platform, browse opportunities, apply, and get paid. Every test a user can run shows marketplace behavior. Why should we believe the rejected-category list isn't just semantic?"**

- **Why it's hard:** Classic positioning stress-test. A lazy answer says "but our mission is different."
- **Our answer:** push-strategy Matrix 3 has the positive-proof bit by bit: "Creator marketplace → Push delivers outcomes, not introductions → merchant pays only post-walk-in; creator is paid by Push on behalf of merchant." The invariant: a marketplace earns a take-rate on introductions (Whalar, Grin, CreatorIQ); Push earns revenue **only if a customer physically walks in and ConversionOracle verifies**. The creator-marketplace business model is advertising-adjacent (CPM on creator reach). Push's business model is performance-adjacent (CPA on verified outcomes). See also push-strategy Core Insight: "Creators are not media inventory—they are unstructured customer acquisition channels." The UX looks marketplace-shaped on the creator side only because of supply-side liquidity requirements; the revenue model is closer to OpenTable than to Whalar.
- **Credibility grade: B+.** This is the best-defended positioning question in the stack. Matrix 3 specifically exists to answer it.
- **Gap:** None material. The Matrix 3 block is the strongest piece of positioning prose in the docs.

---

### Q12 — Team / Scaling

**"You have one creator ops person (Milly). At SLR 25 with, say, 250 active campaigns at M-12, that's 250 campaigns on 10 ops FTE. But your current team is 3 people. What's your hiring ramp, and how do you avoid the agency trap where every new merchant requires a new body?"**

- **Why it's hard:** Follows directly from SLR math. Forces the founder to commit to a hire plan.
- **Our answer:** SLR 25 at M-12 with 250 active campaigns implies 10 Ops FTE (push-metrics §1 authoritative definition: 160 hours/month/FTE). Current team is 3 (push-strategy Trigger-Response), so the ramp is +7 ops FTE over 12 months. The hiring split is guided by the SLR decomposition (push-metrics §1.4): AutoVerification takes the largest share of hiring pressure off the org (40% of M-12 SLR impact), followed by onboarding automation (25%). The agency-trap avoidance mechanism is ConversionOracle — every new merchant does NOT require a new verification FTE because the Oracle scales per-event, not per-merchant.
- **Credibility grade: C+.** The math checks out. The hiring plan is "hire 7 ops people in 12 months" which is operationally aggressive for a 3-person team without a COO/Head of Ops hire called out.
- **Gap:** No Head of Ops hire in the P1-2 or P2 pipeline. No FTE-cost forecast in the unit economics. No org chart showing the Ops reporting line.

---

### Q13 — Regulatory / Multi-State Nexus

**"When you expand past New York to Los Angeles, Miami, Austin — you'll trigger sales-tax nexus, creator 1099 reporting in 6 states, and state-specific pay-transparency laws. Your ML Advisor InMail has NY LL-32-2022 disclosure baked in. What's your multi-state playbook for the Creator side?"**

- **Why it's hard:** Real operational trap that most pre-seed founders haven't thought about.
- **Our answer:** Current compliance envelope (from P1-2 and CHANGELOG Compliance section) covers NY Pay Transparency, EEO (Title VII / ADA / ADEA / NY SHRL), CAN-SPAM, EEOC retention (12 mo non-hire / 7 yr hire), LinkedIn UA §8.2, FTC 16 CFR 255, SEC Rule 701 (planned). The Trigger-Response playbook response for "Risks?" lists regulatory as addressed via FTC compliance, but does NOT break out multi-state. Honest answer: when we hit a second metro, we engage state-specific counsel and extend the disclosure envelope. The NY-first cold start (push-strategy push-gtm) gives us 12–18 months of single-jurisdiction operation before the LA / Miami questions matter in practice.
- **Credibility grade: C.** The "single-jurisdiction cold start buys us time" framing is honest but a sharp partner will note that the second-metro expansion is in the Series-A story, meaning the answer needs to be ready by Q3 2026 not Q3 2027.
- **Gap:** No multi-state expansion checklist. No counsel relationship outside NY. No 1099 infrastructure readiness for mass payouts across states.

---

### Q14 — Unit Economics / CAC

**"Your CAC is $420, including 'Pilot subsidy allocated.' In the Pilot phase you're paying merchants $0 and bearing the full creator payout from F&F budget. What's your CAC on Beachhead cohorts where you're actually charging? Because if that number is $800 instead of $420, LTV/CAC 15x becomes 8x and your Series A narrative changes."**

- **Why it's hard:** Subsidy-masked CAC is a chronic VC trap. Groupon, Uber, DoorDash all had it.
- **Our answer:** push-pricing §5 specifies CAC as "sales + onboarding + Pilot subsidy allocated" = $420. The allocated-Pilot-subsidy component is defined but not broken out. Beachhead CAC should converge toward sales+onboarding-only once the Pilot 10 are absorbed (push-pricing §2.1: "Pilot cohort cap (Williamsburg Coffee+) = 10 merchants"). Honest answer: we don't have the Beachhead-cohort-only CAC number yet because no Beachhead merchant has onboarded. The experimental priority (push-pricing §9 #1) is Week 4-6 Pilot-to-Beachhead conversion ≥60%; if that holds, the Beachhead CAC is sales+onboarding with the subsidy amortizing away.
- **Credibility grade: C.** The "subsidy amortizes" argument is standard; the problem is it's unverified.
- **Gap:** No Pilot vs Beachhead CAC decomposition. No subsidy-dollars-per-pilot-merchant number in the docs (it exists implicitly but isn't quoted).

---

### Q15 — Exit / Strategic Acquirer

**"Who buys this? Give me three names and what multiple, within 4 years. If the answer includes 'Meta, Google, or TikTok,' explain why they'd pay for it rather than build it for 5% of your valuation."**

- **Why it's hard:** VCs invest to a specific exit thesis. Vague acquirer lists get the pitch filed under "interesting, not actionable."
- **Our answer:** Three acquirer scenarios within 4 years: (1) **Shopify** — vertical-SaaS for local commerce is a natural strategic fit for Shopify's local ambitions; multiple 10–15x revenue (Shopify historically pays ~10x for strategic extensions). (2) **Toast** — restaurant-adjacent customer acquisition is the missing piece of Toast's stack; multiple 6–10x revenue at $15B Toast market cap. (3) **Meta / Instagram** — as acqui-hire or talent+data acquisition if the creator-attribution wedge becomes a credible threat; multiple 3–5x revenue but accelerated timeline. Build-vs-buy argument for Meta: the ConversionOracle training data (push-strategy Trigger-Response "Defensibility?") is the non-fungible asset; Meta's internal data has no walk-in ground truth.
- **Credibility grade: C.** The three-name list is defensible. The multiple ranges are aspirational — Shopify at 10-15x is specific but depends on revenue scale that doesn't exist; Toast at 6-10x is more realistic but still aspirational at <$5M ARR.
- **Gap:** No precedent transaction table. No acquirer-interest signals ("We've had a conversation with X" is Series-A gold; zero such signals in docs). No defensible mid-case exit multiple.

---

## §Follow-up Drill-Downs

After the VC hears our answers, here are the five mini-trap questions they ask.

### D1 — After Q3 (LTV)
**"Okay, 9-month lifetime with outcome warranty. Show me the second-campaign rate from the Pilot cohort. Not projected — actual. What's your plan if the first 3 Pilot merchants don't run a second campaign?"**
*Trap: forces us to commit to a pilot-readback date. Docs commit to Week 4 of 2026-Q2 (push-strategy Trigger-Response); a VC will circle that date.*

### D2 — After Q6 (FTC)
**"Show me a single enforcement case against a creator marketplace in the last 24 months where the platform was a co-respondent. What was the settlement? Who paid?"**
*Trap: tests whether we know the Kardashian/Instagram settlements and the 2023 FTC Endorsement Guide update. If the answer is "I'll get back to you," the partner calibrates our diligence depth.*

### D3 — After Q5 (Team)
**"Who's your technical advisor list? Not 'ML Advisor we're recruiting' — who are the three technologists who have looked at ConversionOracle's design and said it's feasible?"**
*Trap: no such list exists in P1 docs. This is a signed-advisor question, and we have zero signed advisors as of Day 7 of the outreach tracker.*

### D4 — After Q10 (Exit comps)
**"Walk me through the last three acquihires in the creator economy space in 2025. Who paid how much, and did the founders stay for the earn-out?"**
*Trap: tests market awareness. Grin's 2024 funding round, Whalar's IAS integration, Jellysmack's restructuring are all public data. If we don't know, partner calibrates our competitive intel.*

### D5 — After Q7 (Securities)
**"When does the first T5 grant happen, and who signs off before it executes?"**
*Trap: forces a commitment. Docs say T4 retainer is the current gate, T5 happens after Month 6 performance review (push-creator §3 Promotion Rules). Partner wants to see a written gate: "First T5 executes Month 7 after securities counsel sign-off and 409A completion."*

---

## §The "I'd Pass" Test

Scenarios where this partner would say "thanks, not for us."

### Pass Scenario 1 — Team gap (Q5)
**If we say:** "We'll hire the ML lead post-Seed."
**Partner concludes:** "Founder hasn't tested the hire-able-talent side of 'Vertical AI' positioning. At my fund this is a build-before-buy category. Pass."

### Pass Scenario 2 — Subsidy-masked CAC (Q14)
**If we say:** "We haven't separated Pilot vs Beachhead CAC."
**Partner concludes:** "The $420 number is cosmetic. Real CAC is unknown. At my stage I can't underwrite an unknown. Come back with 5 Beachhead merchants and we re-engage."

### Pass Scenario 3 — Securities and insurance (Q6 + Q7)
**If we say:** "We haven't done the Rule 701 analysis yet / we don't have E&O coverage yet."
**Partner concludes:** "Creator equity is your competitive weapon AND your single largest legal exposure. Founder hasn't stress-tested the exposure yet. Fiduciary issue for my LPs. Pass."

---

## §Recommended Pitch Prep

The top 7 items to add to docs before a real investor call. Priority key: P0 = blocker, P1 = required before second meeting, P2 = required before term sheet.

| # | Missing Artifact | Priority | Est. Time | Owner |
|---|---|---|---|---|
| 1 | Signed or verbally-committed Technical/ML Advisor (name + short bio) | P0 | 14–30 days | Founder (Jiaming) |
| 2 | Rule 701 exemption analysis + securities counsel engagement letter for creator equity | P0 | 2–4 weeks | Founder + outside counsel |
| 3 | Pilot-cohort second-campaign rate (actual number, not forecast) from first 3–5 Pilot merchants | P0 | 4–6 weeks (gated by pilot run) | Ops lead (Prum) |
| 4 | SLR-vs-AutoVerification-coverage sensitivity table (what SLR looks like at 60%/70%/80%/90% AV coverage) | P1 | 3–5 days | Founder + data |
| 5 | Beachhead-only CAC decomposition (no Pilot subsidy in the number) + forecast for Month 3 / Month 6 / Month 12 | P1 | 5–7 days | Pricing owner |
| 6 | Acquirer-comp table (3+ precedent transactions in vertical SaaS + creator economy; multiples + timelines) | P1 | 3–4 days | Founder |
| 7 | Multi-state expansion compliance checklist (CA, FL, TX specifically) — 1099 reporting, sales tax nexus, pay transparency | P2 | 1 week | Outside counsel |

**Supplementary (not top-7 but commonly asked):** E&O / cyber insurance quote for creator-facing platform risk. 409A valuation. Financial model xlsx synchronized to push-pricing/push-creator markdown (CHANGELOG Migration notes flags this). FTC-audit-simulation runbook.

---

## §One-Page Founder Narrative

The six sentences Jiaming should memorize. Every sentence is sourced from the P1 docs.

> Push is **Vertical AI for Local Commerce**: merchants pay only when a verified customer walks in, and we own the verification layer end-to-end through ConversionOracle (CV + OCR + geo). The category wedge is outcome-priced per-customer billing ($15–85 by vertical), where our structural advantage over Meta/Yelp/OpenTable is that none of them bear outcome risk and none of them verify at walk-in. Unit economics in our base case are 26.7% gross margin on a $25 per-customer Coffee+ fee, producing an LTV/CAC of 15.1x, with a stressed case of 10.0x under 2x churn and 1.5x CAC. Our defensibility compounds through three loops — ConversionOracle's training data lock, Creator Productivity Lock via T4–T6 retainer+equity, and SLR-driven ops leverage (target 25 at Month 12, 5x a traditional agency). We are pre-pilot today, with first verified pilot results expected Week 4 of Q2 2026, a $0 Pilot cohort capped at 10 Williamsburg Coffee+ merchants, and the Beachhead ramp starting Month 2 at $500/mo + per-customer. What we are raising for: an ML lead who can take ConversionOracle from spec to 92% precision by Month 12, Beachhead expansion across NYC boroughs, and the regulatory envelope (Rule 701 for creator equity, multi-state compliance, E&O coverage) that lets the Creator Productivity Lock actually bind.

**One-sentence take-away (memorize first):**
> "We sell verified customers, not software — and the moat is the walk-in data that nobody else has."

---

## §Scoring Summary

| Category | A/B grades | C/D/F grades | Comment |
|---|---|---|---|
| Category / Positioning (Q1, Q11) | Q11 (B+) | Q1 (B) | Q1 weaker due to ConversionOracle being pre-product |
| Moat / Defensibility (Q2, Q8) | Q8 (B-) | Q2 (C) | Both are forward-dated moat claims |
| Unit Economics (Q3, Q4, Q14) | Q4 (B-) | Q3 (C+), Q14 (C) | LTV depth is the single biggest stress point |
| Team / Execution (Q5, Q12) | Q12 (C+) | Q5 (D+) | Q5 is the highest-risk single answer |
| Regulatory / Compliance (Q6, Q7, Q13) | Q6 (B) | Q7 (D), Q13 (C) | Q7 is the biggest underspecification in docs |
| SLR / Metrics (Q9) | Q9 (B) | — | Best-defended operational answer |
| Exit / Scaling (Q10, Q15) | — | Q10 (C), Q15 (C) | Both need precedent-transaction tables |

**A/B grades: 5 (Q4, Q6, Q8, Q9, Q11, Q12)**
**C grades: 6 (Q1, Q2, Q3, Q10, Q13, Q14, Q15)** — actually 7 counting Q1 as B/borderline
**D grades: 2 (Q5, Q7)**
**F grades: 0**

(Rechecking: Q1 B, Q2 C, Q3 C+, Q4 B-, Q5 D+, Q6 B, Q7 D, Q8 B-, Q9 B, Q10 C, Q11 B+, Q12 C+, Q13 C, Q14 C, Q15 C → **A/B = 6 (Q1, Q4, Q6, Q8, Q9, Q11); C = 7 (Q2, Q3, Q10, Q12, Q13, Q14, Q15); D = 2 (Q5, Q7); F = 0**. Nine of 15 graded below B, satisfying the "≥6 below B" verification criterion.)

---

*Generated 2026-04-20 as the 5th audit in the v5.2 P1 rollup series. Read-only synthesis of existing docs; recommends no edits to source SKILL.md files. Owner: Founder (Jiaming) for response-prep; Ops lead for Pilot-data gaps (#3); outside counsel for #2, #7. Next review: after ML Advisor Day 14 readout (2026-05-04) — update Q5 grade if advisor signs, update Q7 grade if securities counsel engaged.*
