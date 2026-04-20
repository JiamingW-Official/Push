# ML Advisor InMail Drafts (v5.2 P1-2)

Companion to [`ml_advisor_outreach_tracker.md`](./ml_advisor_outreach_tracker.md) and [`advisor-sourcing-playbook.md`](./advisor-sourcing-playbook.md). Advisor terms reference [`docs/week-0/legal/equity/RSA_TEMPLATE.md`](../week-0/legal/equity/RSA_TEMPLATE.md).

## Template Skeleton (per Appendix A-5)
- **Subject line:** specific / curious / ≤65 chars.
- **Opening:** 1 sentence showing you read their work.
- **Why now:** 1 sentence on Push's v5.2 context (vertical AI, pre-pilot, ConversionOracle + creator productivity lock as moat).
- **The ask:** 25-minute call, 2 slots next week.
- **Compensation (mandatory):** 0.25–0.5% equity, 2-year vest, 6-month cliff, no cash. Advisor agreement based on Y Combinator FAST template; full terms in [`RSA_TEMPLATE.md`](../week-0/legal/equity/RSA_TEMPLATE.md).
- **Opt-out:** "If this isn't a fit, reply 'remove' and I won't follow up." (CAN-SPAM + LinkedIn UA).
- **Signature:** Jiaming, founder, Push, Inc.

## Send Day 7 Checklist
- [ ] Verified no conflict with existing advisors / cap table (cross-reference `docs/week-0/legal/equity/granted/`).
- [ ] Compensation range explicitly disclosed (NY LL-32 Pay Transparency compliance; exact phrase: "0.25–0.5% equity over 2-year vest, 6-month cliff; no cash").
- [ ] Recipient not on any do-not-contact list (`docs/hiring/do-not-contact.md`).
- [ ] Opt-out sentence present ("If this isn't a fit, reply 'remove'…").
- [ ] Saved copy to outreach log immediately after send (paste body into tracker row + `docs/hiring/archive/`).
- [ ] Verify recipient name + company before send.
- [ ] Remove all `{{placeholder}}` brackets.
- [ ] Add calendar link (Cal.com / Calendly).
- [ ] Confirm sourcing channel + priority on tracker.
- [ ] Candidate screened against ICP in [`advisor-sourcing-playbook.md`](./advisor-sourcing-playbook.md) §1.

---

## Archetype 1 — Applied CV/OCR Research Scientist

### Variant A — Paper-reference hook (technical tone)

**Subject:** Your receipt-OCR work → our ConversionOracle pipeline
**Subject rationale:** Names their specific research area in the first 3 words, ties directly to our product; signals this is not a mass send.

Hi {{first_name}},

I read your 2024 paper on robust receipt field extraction under occlusion — the multi-crop consensus trick for total-line detection is exactly the failure mode we keep hitting. {{mutual: ____}} mentioned you occasionally take advisor calls.

I'm building Push — vertical AI for local commerce, pre-pilot shipping Week 4, Q2 2026. Our ConversionOracle verifies real customer walk-ins from QR scans using a CV + OCR + geo-verification stack. Your work on document-understanding robustness maps directly to our biggest open risk: adversarial receipt images.

Open to a 25-min call next Tue or Thu? Compensation: 0.25–0.5% equity over a 2-year vest with a 6-month cliff; no cash. Advisor agreement based on the Y Combinator FAST template; full terms in our [RSA_TEMPLATE](../week-0/legal/equity/RSA_TEMPLATE.md).

If this isn't a fit, reply 'remove' and I won't follow up.

— Jiaming, founder, Push, Inc.

**Personalization Checklist**
- [ ] Previous relevant project reference (paper, repo, or talk with year + specific technique).
- [ ] Mutual connection (first + last name, not just "a mutual friend").
- [ ] Specific Push aspect matching their focus (ConversionOracle OCR / receipt parsing).

### Variant B — Problem-first hook (founder-to-researcher tone)

**Subject:** 3% of our receipts fail OCR — would value your eye
**Subject rationale:** Concrete failure metric creates curiosity and positions the ask as a real problem, not a recruiter template.

Hi {{first_name}},

Roughly 3% of the receipts we process for our attribution verifier fail at the total-line extraction step — adversarial crops, glare, bilingual menus. Your name came up twice this week (once from your 2024 paper, once from {{mutual: ____}}) as the person who'd actually know what to do about it.

Push is vertical AI for local commerce, pre-pilot Week 4 (Q2 2026). Our ConversionOracle stitches CV + OCR + geo-verification to confirm in-store visits from QR scans. I'd like 25 minutes to walk the failure set and hear what you'd try differently.

Tue or Thu next week? Compensation: 0.25–0.5% equity over 2-year vest with 6-month cliff; no cash. Advisor agreement on Y Combinator FAST template; see [RSA_TEMPLATE](../week-0/legal/equity/RSA_TEMPLATE.md) and our [advisor-sourcing-playbook](./advisor-sourcing-playbook.md) for the full shape of the role.

If this isn't a fit, reply 'remove' and I won't follow up.

— Jiaming, founder, Push, Inc.

**Personalization Checklist**
- [ ] Previous relevant project reference (paper, repo, or talk).
- [ ] Mutual connection (first + last name).
- [ ] Specific Push aspect matching their focus (ConversionOracle adversarial OCR).

---

## Archetype 2 — Meta Reality Labs / Apple Vision ML Platform Engineer

### Variant A — Conference-talk hook (engineering tone)

**Subject:** Edge inference for real-time verification — quick question
**Subject rationale:** Mirrors their domain (edge / real-time) and frames the message as a question, not a pitch.

Hi {{first_name}},

Your talk at the 2024 on-device ML workshop on sub-100ms vision inference on Quest hardware stuck with me — the quantization trade-off slide is still open in my notes. {{mutual: ____}} said you sometimes take advisor calls with pre-seed founders.

I'm building Push — vertical AI for local commerce, pre-pilot Week 4 (Q2 2026). Our ConversionOracle pipeline needs sub-second verification on a customer's phone at point-of-visit: edge CV inference + geo cross-check. Your exact problem domain, three tiers down the stack.

25-min call next Wed or Fri? Compensation: 0.25–0.5% equity over 2-year vest with 6-month cliff; no cash. Advisor agreement based on Y Combinator FAST; full terms in [RSA_TEMPLATE](../week-0/legal/equity/RSA_TEMPLATE.md).

If this isn't a fit, reply 'remove' and I won't follow up.

— Jiaming, founder, Push, Inc.

**Personalization Checklist**
- [ ] Previous relevant project reference (talk, paper, or shipped feature).
- [ ] Mutual connection.
- [ ] Specific Push aspect matching their focus (ConversionOracle edge inference).

### Variant B — Shipped-product hook (builder tone)

**Subject:** You shipped on-device object detection — our latency spec
**Subject rationale:** Calls out a shipped product they worked on (not just a paper); peer-level respect.

Hi {{first_name}},

The on-device object detection you shipped in {{product_name}} is the closest reference I have to the latency spec we need. {{mutual: ____}} suggested you as the one person who'd actually stress-test my architecture choices.

Push is vertical AI for local commerce, pre-pilot Week 4 (Q2 2026). ConversionOracle has to run a CV + OCR + geo pass on a customer phone in <1 second at the merchant counter. The failure mode that kills us isn't accuracy, it's tail latency under weak signal — you've lived that.

25 minutes next Wed or Fri? Compensation: 0.25–0.5% equity over 2-year vest with 6-month cliff; no cash. Advisor agreement on Y Combinator FAST template; see [RSA_TEMPLATE](../week-0/legal/equity/RSA_TEMPLATE.md) and the full role shape in [advisor-sourcing-playbook](./advisor-sourcing-playbook.md).

If this isn't a fit, reply 'remove' and I won't follow up.

— Jiaming, founder, Push, Inc.

**Personalization Checklist**
- [ ] Previous relevant project reference (shipped product + their role).
- [ ] Mutual connection.
- [ ] Specific Push aspect matching their focus (edge inference tail latency).

---

## Archetype 3 — Waymo / Cruise Perception Lead

### Variant A — Blog-post hook (technical tone)

**Subject:** Geo-verification (GPS + cell triangulation) — advisor ask
**Subject rationale:** Names the sub-system they're best-in-class at, and flags the intent (advisor, not hire, not sales) in the first read.

Hi {{first_name}},

Your 2023 blog on sensor-fusion confidence scoring for urban perception — specifically the GPS-drop fallback policy — is the cleanest write-up I've found on the problem. {{mutual: ____}} suggested you'd be the right person to ask.

Push is vertical AI for local commerce, pre-pilot Week 4 (Q2 2026). Our ConversionOracle has to answer "did this customer actually walk into the merchant?" by cross-checking GPS, cell triangulation, and on-device sensor signals — and reject replay / spoof attacks. Perception-stack thinking, applied to a much smaller box.

25-min call next Tue or Thu? Compensation: 0.25–0.5% equity over 2-year vest with 6-month cliff; no cash. Advisor agreement on Y Combinator FAST; full terms in [RSA_TEMPLATE](../week-0/legal/equity/RSA_TEMPLATE.md).

If this isn't a fit, reply 'remove' and I won't follow up.

— Jiaming, founder, Push, Inc.

**Personalization Checklist**
- [ ] Previous relevant project reference (blog post or talk).
- [ ] Mutual connection.
- [ ] Specific Push aspect matching their focus (geo-verification fusion).

### Variant B — Adversarial-problem hook (security framing)

**Subject:** Spoof detection without driving a car — 25 min?
**Subject rationale:** Surprising reframe of their domain; makes an AV engineer curious what non-AV company needs their skill.

Hi {{first_name}},

AV perception teams are the only people I've found who've seriously thought through "how do I know this sensor reading isn't adversarial." {{mutual: ____}} named you first when I asked.

Push is vertical AI for local commerce, pre-pilot Week 4 (Q2 2026). Core verification problem: a customer scans a QR at a merchant; we need to decide — in under a second, with no merchant hardware — whether they actually walked in. Replay attacks, location spoofing, and sybil creators are the adversaries. It's your threat model, one tier smaller.

25 minutes next Tue or Thu? Compensation: 0.25–0.5% equity over 2-year vest with 6-month cliff; no cash. Advisor agreement on Y Combinator FAST template; see [RSA_TEMPLATE](../week-0/legal/equity/RSA_TEMPLATE.md) and [advisor-sourcing-playbook](./advisor-sourcing-playbook.md) for the full advisor shape.

If this isn't a fit, reply 'remove' and I won't follow up.

— Jiaming, founder, Push, Inc.

**Personalization Checklist**
- [ ] Previous relevant project reference (paper, talk, or shipped module).
- [ ] Mutual connection.
- [ ] Specific Push aspect matching their focus (adversarial geo / replay attack).

---

## Archetype 4 — Ex-DoorDash / Uber Vertical-AI Engineer (Matching / Marketplace)

### Variant A — Case-study hook (operator tone)

**Subject:** Creator ↔ merchant matching — would value your take
**Subject rationale:** Frames the message as a peer-level conversation about a matching problem they've seen ten times.

Hi {{first_name}},

Your work on the Dasher-to-merchant assignment model — especially the switch from greedy to batch-optimal during the 2022 rewrite — is a case study I've come back to three times this quarter. {{mutual: ____}} thought you'd be open to a short conversation.

I'm building Push — vertical AI for local commerce, pre-pilot Week 4 (Q2 2026). Core matching problem: route the right local creator to the right local merchant campaign under tight geographic, category, and tier constraints. Two-sided marketplace, thin data in cold-start, exactly the regime you've lived in.

25-min call next Wed or Fri? Compensation: 0.25–0.5% equity over 2-year vest with 6-month cliff; no cash. Advisor agreement on Y Combinator FAST template; full terms in [RSA_TEMPLATE](../week-0/legal/equity/RSA_TEMPLATE.md).

If this isn't a fit, reply 'remove' and I won't follow up.

— Jiaming, founder, Push, Inc.

**Personalization Checklist**
- [ ] Previous relevant project reference (matching-algorithm work with year + company).
- [ ] Mutual connection.
- [ ] Specific Push aspect matching their focus (creator ↔ merchant assignment).

### Variant B — Cold-start hook (founder-to-founder tone)

**Subject:** Cold-start matching with 20 merchants — wisdom ask
**Subject rationale:** Names our constraint (20 merchants) openly; signals we don't have data and want their judgment, not their code.

Hi {{first_name}},

We'll launch our pilot with roughly 20 merchants and 60 creators in a single neighborhood. The matching model you'd normally train on a million trips doesn't exist yet. {{mutual: ____}} mentioned you'd taken two pre-seed companies through exactly this phase.

Push is vertical AI for local commerce, pre-pilot Week 4 (Q2 2026). I'd like 25 minutes to walk through how we're planning rules-first then learned-ranker, and pressure-test it against what actually worked for you in the zero-data regime.

Wed or Fri next week? Compensation: 0.25–0.5% equity over 2-year vest with 6-month cliff; no cash. Advisor agreement based on Y Combinator FAST template; see [RSA_TEMPLATE](../week-0/legal/equity/RSA_TEMPLATE.md) and [advisor-sourcing-playbook](./advisor-sourcing-playbook.md) for the full advisor shape.

If this isn't a fit, reply 'remove' and I won't follow up.

— Jiaming, founder, Push, Inc.

**Personalization Checklist**
- [ ] Previous relevant project reference (cold-start phase with year + company).
- [ ] Mutual connection.
- [ ] Specific Push aspect matching their focus (zero-data matching rollout).

---

## Archetype 5 — Small-ML-Consulting Founder (2–3 Seed-Stage Advisor Engagements)

### Variant A — Case-study hook (fit-first tone)

**Subject:** Advisor fit — vertical AI for local commerce, pre-pilot
**Subject rationale:** Says exactly what this message is about in under 65 chars; respects their time since they screen inbound daily.

Hi {{first_name}},

Saw your case study on the seed-stage fraud-detection rollout you advised last year — the decision to ship rules before a model for the first 90 days was a call I want to pressure-test against my own roadmap. {{mutual: ____}} mentioned you occasionally take on a new advisor slot.

Push is pre-pilot (Week 4, Q2 2026) — positioning is "Vertical AI for Local Commerce," with ConversionOracle and a creator productivity lock as the two moats. I'm looking for exactly the advisor shape you already run.

25-min call next Tue or Thu to see if the fit is there? Compensation: 0.25–0.5% equity over 2-year vest with 6-month cliff; no cash. Advisor agreement based on Y Combinator FAST; full terms in [RSA_TEMPLATE](../week-0/legal/equity/RSA_TEMPLATE.md).

If this isn't a fit, reply 'remove' and I won't follow up.

— Jiaming, founder, Push, Inc.

**Personalization Checklist**
- [ ] Previous relevant project reference (advisor case study with year + stage).
- [ ] Mutual connection.
- [ ] Specific Push aspect matching their focus (rules-before-model + vertical AI positioning).

### Variant B — Portfolio-fit hook (peer tone)

**Subject:** One more company for your advisor portfolio?
**Subject rationale:** Frames the ask in their language (portfolio); acknowledges they're operating at capacity and gives them an easy no.

Hi {{first_name}},

You run a 3-company advisor portfolio and shipped public case studies on two of them — one on zero-data fraud, one on marketplace cold-start. Both read like cleaner versions of what we're about to hit. {{mutual: ____}} passed your name.

Push is vertical AI for local commerce, pre-pilot Week 4 (Q2 2026). Two moats: ConversionOracle (CV + OCR + geo) and a creator productivity lock. I'd like 25 minutes to see if it's worth a fourth slot in your portfolio.

Tue or Thu next week? Compensation: 0.25–0.5% equity over 2-year vest with 6-month cliff; no cash. Advisor agreement based on the Y Combinator FAST template; see [RSA_TEMPLATE](../week-0/legal/equity/RSA_TEMPLATE.md) and [advisor-sourcing-playbook](./advisor-sourcing-playbook.md) for the full role shape.

If this isn't a fit, reply 'remove' and I won't follow up.

— Jiaming, founder, Push, Inc.

**Personalization Checklist**
- [ ] Previous relevant project reference (2 public case studies + domains).
- [ ] Mutual connection.
- [ ] Specific Push aspect matching their focus (vertical AI + marketplace cold-start).

---

## Follow-up Cadence Drafts

### Day 4 Nudge (≤60 words)

**Subject:** Re: {{original subject}}
Hi {{first_name}} — bumping this in case my first note got buried. Happy to cut the call to 15 minutes if helpful. Compensation and terms unchanged: 0.25–0.5% equity, 2-year vest, 6-month cliff, no cash; agreement on Y Combinator FAST template. If it's a hard no, reply 'remove' and I'll close the loop.

— Jiaming

### Day 10 Last-chance (≤50 words)

Hi {{first_name}} — closing my search window this week. If you're not in a position to advise, totally understood — would love a 1-line referral to anyone you'd trust with the CV/OCR + geo-verification roadmap. Comp remains 0.25–0.5% equity on Y Combinator FAST terms.

— Jiaming

### Day 21 Closed-lost (archival)

No reply → mark Outcome = `nonresponse`, set retention-until = send_date + 12 months, move row to archive. Do not re-engage before 6 months.

---

*Drafts version: v5.2-p1-2 — 2026-04-20.*
*Every outbound message must satisfy the Send Day 7 Checklist above. Non-compliance is a logged incident.*
