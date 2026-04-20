# Team Story — Investor Prep

**Audit reference:** `docs/v5_2_status/audits/05-investor-dry-run.md` Q5 (D+ grade).
**Owner:** Jiaming.
**Last updated:** 2026-04-20.

---

## §The uncomfortable question

> *"You're the only founder. There's no technical/ML co-founder. ConversionOracle is your moat, but you have no one in the building who's shipped CV/OCR at scale. Why should we fund the team you have today rather than wait until you've filled the seat?"*

This is the single hardest investor question for Push at this stage. An evasive answer ("we're hiring") loses the room. An over-promising answer ("we have an ML Advisor signed" when we don't) loses credibility. The honest answer below is rehearsed and bounded.

---

## §Present state (honest)

- **Founder:** Jiaming. Full-time. [TODO: insert one-sentence prior-experience proof — what shipped, what scale, which company.]
- **Operating partners (full-time, equity-only at present):**
  - Prum — ops lead. [TODO: insert prior ops experience — at which company, what scope.]
  - Milly — creator ops. [TODO: insert creator-economy or community ops prior experience.]
- **ML Advisor:** **Not signed.** Outreach in progress per `docs/hiring/ml_advisor_outreach_tracker.md`. Day-7 batch send target 2026-04-27; Day-14 ship criterion (1+ conversation in progress) 2026-05-04.
- **No engineering FTE.** All product work is founder-led with contractor augmentation.
- **No designer FTE.** Founder + Lovable / shadcn / contractor.

What we are NOT today: a complete pre-seed team. We are explicitly under-staffed for the AI promise we're making, and the investor question is fair.

---

## §Our thesis on team shape (the substantive answer)

Push's wedge is **local commerce ops + vertical AI**, not pure-research ML. The work breakdown:

| Function | % of v5.2 effort | Talent profile |
|---|---|---|
| Merchant ops (sales, onboarding, retention) | 40% | Operator, not researcher (Prum, Milly, Jiaming) |
| Creator ops (recruitment, retention, dispute) | 25% | Community + ops (Milly + Jiaming) |
| Verification model (ConversionOracle) | 20% | Senior CV/OCR engineer + occasional research touch |
| Product / engineering | 10% | Full-stack generalist |
| Strategy + fundraise | 5% | Founder |

The ML work is 20% of v5.2 effort, not 80%. Pure-research ML is *not* on the critical path until Year 2 (multi-modal verification, low-resource categories like beauty/nails). For Year 1 the ML need is engineering-grade (well-understood CV+OCR primitives wired into a verification pipeline) — exactly the level a part-time senior advisor can architect and a contracted senior engineer can implement.

This is why the **advisor structure is appropriate for seed stage**, and why a full-time Chief AI Officer (or technical co-founder with ML focus) is a Series A function — by which point we have pilot data + first-revenue + a recruiting story.

The risk we accept: if ConversionOracle precision misses the 92% Month-12 target by a wide margin, we have to recruit faster. We have a trigger for that (see §De-risking).

---

## §Concrete plan over next 90 days

| Week | Milestone | Owner | Status |
|---|---|---|---|
| Wk 0–1 (now) | Build advisor target list (15 names) | Jiaming | In progress |
| Wk 1 | Send 5 personalized InMails (`docs/hiring/inmail_drafts.md`) | Jiaming | 2026-04-27 target |
| Wk 2 | First advisor call(s) | Jiaming | Day 10 mid-check |
| Wk 2–4 | Negotiate + sign first ML Advisor | Jiaming | Day 14 ship criterion: 1+ conversation in progress |
| Wk 4 | ConversionOracle architecture brief from advisor | Jiaming + Advisor | |
| Wk 6–8 | Prototype ConversionOracle v0 (single-receipt OCR + geo) | Founder + contracted senior eng | |
| Wk 8–12 | ConversionOracle v1 ready for Pilot week (precision target ≥85% in pilot domain) | Founder + Advisor + senior eng | |
| End Wk 12 | First Pilot merchant onboarded; v1 verification live | Prum + Founder | |

**Hire pipeline beyond advisor:**
- Contracted senior CV/OCR engineer (1099 starting Wk 6, target $150–200/hr; convert to FT post-seed if we close).
- Full-time senior ML engineer hire planned for **Seed close + 30 days** (target: Q4 2026).
- First product-eng hire same window.

---

## §De-risking: how we fail if we don't fix this, and what would force acceleration

**Failure modes:**

1. **No advisor signs by Day 21.** → Lower the bar: take a part-time-but-only-2-hr/week senior engineer at higher equity (0.5%); reframe role as "fractional CTO" not "ML Advisor." Open Upwork posting for a contracted senior CV/OCR engineer to backfill the architectural gap.
2. **Advisor signs but ConversionOracle Month-3 precision <80%.** → Recruiting acceleration: stop Beachhead expansion at 25 merchants (not 50), use the recruiting time to accelerate full-time ML hire.
3. **Advisor signs and architecture is sound, but contracted engineer can't ship to spec by Wk 12.** → Pilot launches on a manual-verification fallback (ops reviews every campaign for first 4 weeks) while we recruit a senior FT engineer. Cost: SLR drops to 5–8 in Pilot phase; investors are warned in any subsequent pitch.

**Triggers to accelerate hire:**
- ConversionOracle precision <80% by end of Pilot Week 8 → escalate.
- Two consecutive Beachhead merchants churn citing "verification accuracy" → escalate.
- An incoming Series Seed term sheet that conditions on an FT ML hire → close-of-funding triggers hire.

---

## §What we ask the investor for

If the investor is interested but the team gap is the primary blocker, the founder asks for:

1. **Two warm intros** to ML Advisor candidates: 2nd-year PhD students at NYU CDS / Columbia DSI / CMU MLD CV/OCR labs, OR a senior IC at Meta Reality Labs / Apple Vision / Waymo perception who has published or shipped multi-modal CV+OCR.
2. **One reverse reference** on the Push thesis — a founder of a vertical-AI company in a different sector (e.g., Hebbia, Harvey, Cresta) who can pressure-test our SLR target.
3. **A check that converts a contracted senior engineer to FT.** Push's first FT ML hire is the natural use of the first $250K of seed capital.

---

## §The 4-sentence narrative the founder must memorize

> "We're not running an AI research org — we're running an outcome-priced local-commerce platform that uses AI as a cost lever. Our wedge is the merchant ops + creator network we're building right now in Williamsburg, and the ML work is engineering-grade primitives (CV + OCR + geo) that any senior engineer can ship with a strong advisor. Our advisor outreach is in flight, and our first FT ML hire is sized to close with seed funding. If you fund this round, I'll have a full-time senior ML engineer building ConversionOracle within 30 days of close."

---

## §Lessons from investor conversations

*(append after each meaningful investor conversation: who, when, what landed, what didn't, what to change next time.)*

| Date | Investor | Round + Stage | What landed | What didn't | Change |
|---|---|---|---|---|---|
| | | | | | |

---

*Owner asks: by 2026-05-04, replace [TODO] founder/Prum/Milly prior-experience placeholders with one-sentence proofs that an associate could verify on LinkedIn in 30 seconds.*
