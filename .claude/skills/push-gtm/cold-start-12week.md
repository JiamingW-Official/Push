# Cold-Start Plan — Williamsburg Coffee+ × 30 Weeks (v5.1)

Complete detailed roadmap for launching Push v5.1 **Vertical AI for Local Commerce** in **Williamsburg (11211 / 11206 / 11249)**, category **Coffee+**, with 60-day saturation window followed by adjacent-ZIP expansion and YC Summer 2027 application prep.

**Week 1 baseline:** 2026-04-14. **YC Summer 2027 application target:** 2026-09.

> Filename retained as `cold-start-12week.md` for path stability — content is the v5.1 30-week Neighborhood Playbook.

---

## Beachhead Lock-in (do not dilute)

| Axis | Value |
|------|-------|
| **Category** | **Williamsburg Coffee+** — specialty coffee shops + those with bakery / brunch items (AOV $8–20) |
| **Why not pure coffee** | Pure coffee AOV ~$6 is too low to hit $40/customer payout economics |
| **Addressable** | ~200 Coffee+ merchants in Williamsburg |
| **Geography** | Williamsburg: ZIPs **11211 / 11206 / 11249** |
| **Saturation window** | 60 days (Week 1 – Week 8) |
| **Next ZIP** | Greenpoint (11222) in Week 13, then Bushwick (11237 / 11206) |
| **New category** | **Frozen** until Williamsburg + Greenpoint + Bushwick all prove unit economics on Coffee+ |
| **Per-neighborhood Pilot cost cap** | **$4,200** — do not exceed in any single ZIP |

---

## Software Leverage Ratio (SLR) Ladder

SLR = campaigns run per week ÷ human-ops hours per week. This is the primary north star for Vertical AI for Local Commerce. Each phase below lists the SLR target the phase must hit by its end.

| Phase | Week | SLR Target | Driver |
|-------|------|-----------|--------|
| 1 — AI MVP + first merchant | W1–2 | **3–5** | Baseline, ConversionOracle staging-only |
| 2 — Cohort fill, first AI-matched campaign | W3–4 | **6** | ConversionOracle live in production |
| 3 — Saturation, first merchant auto-flips to Operator | W5–8 | **8** by Week 8 | DisclosureBot live; 20 active campaigns same ops count |
| 4 — Retention + Greenpoint prep | W9–12 | **10** by Week 12 | Auto ROI statements, standing-order campaigns |
| 5 — Adjacent expansion | W13–20 | **15** by Week 20 | Neighborhood Playbook replicates without per-ZIP engineering |
| 6 — YC S27 prep | W20+ / M5 / M12 | **18 by M5, 25 by M12** | Full ConversionOracle + DisclosureBot at steady state |

**SLR tripwire:** if SLR stalls below target for 2 consecutive weeks, the next week's work is AI/automation, not merchant acquisition. Density without leverage is services, not software.

---

## Pilot Economics Framework (v5.1 — applies every phase)

| Item | Value |
|------|-------|
| **Per-neighborhood Pilot cost cap** | **$4,200** (all Pilot creator payouts + API + ops in one ZIP) |
| **Pre-Pilot LOI** | **$1 nominal + 60-day commitment + case-study authorization** |
| **Pilot-to-Paid conversion target** | **60%+** |
| **Auto-terminate clause** | Day-30 auto-terminate if merchant has **< 5 verified customers** |
| **Creator payout during Pilot** | **70% of standard rate** (shared risk; full rate kicks in once merchant flips to Paid) |

Every Pilot starts with a signed $1 LOI. Every Pilot has a 30-day checkpoint. Every Pilot closes into a Go/No-Go at day 60.

---

## Phase 1 — AI MVP + First Merchant Signup (Week 1–2) · SLR target 3–5

### Week 1 — Ship AI MVP + Anchor Merchant Outreach Begins

**Engineering deliverables (due EOW):**
- [ ] AgentOutputDemo UI live (shows ConversionOracle verification reel to merchant prospects)
- [ ] `/merchant/pilot` landing page with **goal-first onboarding** ("How many customers do you need this month?")
- [ ] ConversionOracle (Claude Vision + OCR + geo) path, env-gated (enabled in staging + Sey account only)
- [ ] `/neighborhoods/williamsburg-coffee` route scaffolded (will populate Week 5)
- [ ] SLR measurement harness shipped (campaigns/week ÷ ops-hours/week)
- [ ] $1 LOI PDF template drafted (legal review queued)

**Merchant outreach (anchors):**
- Build outreach list of **3 anchor Coffee+ shops**: **Sey Coffee**, **Devocion**, **Partners Coffee**
- Founder does cold walk-in to each during dead hours (Tue/Wed/Thu 2–4pm) with printed pilot sheet
- Target: 3 warm conversations with owner/manager by EOW

**Creator recruitment:**
- Build Instagram prospect list: search "coffee" + "Williamsburg" + 1K–5K followers
- DM **10 creators** in 11211 / 11249 with specific post reference + pilot invitation

**End of Week 1 output:**
- AI MVP shippable build
- 3 anchor Coffee+ shop conversations logged with owner contact
- 10 DM'd creators; target 5+ interested responses
- SLR baseline captured

---

### Week 2 — First Merchant Signs + Creator Cohort Fills

**Merchant:**
- [ ] Sign **Sey Coffee** on $0 Pilot plan with **$1 LOI + 60-day commitment + case-study authorization** (signature by Friday)
- [ ] Close remaining 2 anchor shops (Devocion, Partners) — all signed with $1 LOI by EOW Week 2
- [ ] Ship anchor pilot briefs into the admin dashboard

**Creator:**
- [ ] Complete **10 creators** signed up (finish Week 1 prospect list)
- [ ] Run 15-minute onboarding call with each Partner-tier candidate
- [ ] All creators acknowledge Pilot-phase 70%-rate clause

**Product:**
- [ ] Ship basic admin dashboard for manual ops (campaigns table, creator table, merchant table)
- [ ] Ship first weekly ROI email template (will auto-send Week 5)
- [ ] DisclosureBot prototype in staging (auto-generate FTC-compliant disclosure copy)

**End of Week 2 output:**
- 3 anchor merchants live on Pilot with signed $1 LOI
- 10 creators signed (70%-Pilot-rate acknowledged), 5+ ready for Week 3 campaign
- All outreach logged in shared spreadsheet (date, channel, response)

---

## Phase 2 — Cohort Fill + First Campaign (Week 3–4) · SLR target 6

### Week 3 — Fill Merchant Cohort + Prep First Campaign

**Merchant:**
- [ ] Sign **7 more Coffee+ shops** using anchor-referral + cold walk-in (cumulative **10 merchants live**)
- [ ] Each new shop: goal-first onboarding, Pilot pricing ($0 to deliver first 10 verified customers), signed $1 LOI
- [ ] Cumulative Pilot spend stays inside Williamsburg's **$4,200 cap**

**Creator:**
- [ ] Recruit **10 more creators** (cumulative **20 creators**)
- [ ] Activate Channel 2: ask each signed merchant's manager to recommend 2–3 regulars who create content

**Campaign prep:**
- [ ] ConversionOracle matching: Claude Vision + Push Score selects **top 5 creators** for Sey Coffee's first campaign
- [ ] Write campaign brief: deliverable, verification method (QR + ConversionOracle), payout trigger, DisclosureBot-generated disclosure copy

**End of Week 3 output:**
- 10 merchants live (all with $1 LOI)
- 20 creators signed
- Sey Coffee × 5 creators campaign ready to launch Monday Week 4
- SLR = 6 by EOW

---

### Week 4 — First Campaign Ships + First Verified Customers

**Launch:**
- [ ] Monday: **first AI-matched campaign** goes live (Sey Coffee × 5 creators)
- [ ] Tuesday–Friday: creators post, scan events flow into `scan_events` table, ConversionOracle runs verification
- [ ] Saturday: **10 verified customers** delivered for Sey Coffee (Week 4 target)

**Ops:**
- [ ] Daily ops standup: review `/api/attribution/scan` failures, verify ConversionOracle results
- [ ] Payout creators (at 70% Pilot rate) within 24h of verified campaign completion
- [ ] DisclosureBot compliance check on each campaign post

**Merchant feedback:**
- [ ] Sunday call with Sey Coffee owner: review 10 verified customers, ROI, willingness to flip to Paid (Operator plan)

**End of Week 4 output:**
- First campaign shipped end-to-end
- 10 verified customers for Sey Coffee (milestone)
- Sey ready to flip to Paid (Operator) in Week 5 — first Pilot-to-Paid conversion

---

## Phase 3 — Saturation + Case-Study Generation (Week 5–8) · SLR target 8 by Week 8

### Week 5–6 — Scale to 20 Active Campaigns

**Weekly target checklist:**
- [ ] **20 active campaigns** running across all 10 Williamsburg Coffee+ merchants
- [ ] Sey Coffee flips to **Paid (Operator plan)** ($500/mo min + $40/customer) — first Pilot-to-Paid conversion
- [ ] 2+ more merchants cross 10 verified customers, flip to Paid
- [ ] **Day-30 auto-terminate check** runs on every Pilot merchant: if any merchant has < 5 verified customers at day 30, Pilot terminates

**Dashboard:**
- [ ] Ship `/neighborhoods/williamsburg-coffee` public dashboard with live numbers: scans, verified customers, cost-per-customer, ROI, SLR
- [ ] Auto-refresh every 24h

**Experiments (Week 5–6):**
- [ ] Experiment 1: **Merchant pricing test** — 5 control / 5 treatment on Operator plan positioning

**End of Week 5–6 output:**
- 20 active campaigns
- 3+ merchants on Paid (Operator)
- Dashboard live and linked from homepage

---

### Week 7–8 — Saturation + First Case Studies Drafted

**Weekly target checklist:**
- [ ] All 10 merchants have run at least 1 campaign
- [ ] 5+ merchants on Paid (Operator)
- [ ] Draft 3 case studies: **Sey / Devocion / Partners** (results, verified customer count, creator highlights)
- [ ] DisclosureBot promoted from staging to production; 90-day rolling compliance tracker begins

**Experiments (Week 7–8):**
- [ ] Experiment 2: **Creator compensation test** — fixed $20 base vs. variable 3% commission
- [ ] Experiment 4: **DisclosureBot compliance test** starts (target ≥ 98% pass rate at 90-day rolling)

**End of Week 7–8 output:**
- 10 merchants saturated
- 50%+ on Paid (Operator)
- 3 case studies drafted, ready for publication
- SLR = 8 by EOW8

---

## Phase 4 — Retention + Greenpoint Prep (Week 9–12) · SLR target 10 by Week 12

### Week 9–10 — Lock In Retention

**Weekly target checklist:**
- [ ] **60%+ Pilot-to-Paid conversion** (v5.1 target)
- [ ] First monthly ROI statement emailed to all merchants
- [ ] Publish Case Study #1 (Sey Coffee) on `/neighborhoods/williamsburg-coffee`
- [ ] DisclosureBot 30-day rolling pass rate ≥ 98% (trending toward 90-day target)

**Experiments:**
- [ ] Experiment 3: **ConversionOracle geo threshold** test — 180m vs. 200m vs. 250m geo-match pass window

---

### Week 11–12 — Publish Case Studies + Start Greenpoint Discovery

**Weekly target checklist:**
- [ ] Publish Case Studies #2 (Devocion) and #3 (Partners) with live metrics
- [ ] Begin **Greenpoint (11222) Coffee+ discovery**: identify 8 merchants, 12 creators (not yet signed)
- [ ] Greenpoint Pilot budget ring-fenced at **$4,200 cap** before any commitment
- [ ] Week 12 Go/No-Go review (see table below)

**Week 12 Go/No-Go Decision:**

| Metric | Target | Status |
|--------|--------|--------|
| Williamsburg Coffee+ merchants live | 10+ | Go/No-go? |
| Pilot-to-Paid conversion | 60%+ | Go/No-go? |
| Verified customers delivered (total) | 200+ | Go/No-go? |
| Creator completion rate | 85%+ | Go/No-go? |
| Case studies published | 3 | Go/No-go? |
| ConversionOracle false-positive rate | < 2% | Go/No-go? |
| DisclosureBot 90-day rolling pass rate | ≥ 98% | Go/No-go? |
| SLR at Week 12 | ≥ 10 | Go/No-go? |
| Merchant NPS | > 7/10 | Go/No-go? |

- ✅ **GO** → proceed to Week 13 Greenpoint launch (spend from Greenpoint's $4,200 cap)
- ⚠️ **ITERATE** → extend Williamsburg 2 weeks, fix weakest metric (do NOT touch Greenpoint budget yet)
- ❌ **PIVOT** → stop, revisit with user

---

## Phase 5 — Adjacent Expansion (Week 13–20) · SLR target 15 by Week 20

### Week 13–16 — Greenpoint (11222) Launch

**Weekly target checklist:**
- [ ] Week 13: sign 3 Greenpoint anchor Coffee+ shops using identical Neighborhood Playbook
- [ ] Week 14: cumulative 8 Greenpoint merchants live
- [ ] Week 15: 12 Greenpoint creators signed
- [ ] Week 16: first Greenpoint campaigns running, on pace for 60%+ Pilot-to-Paid conversion by Week 20
- [ ] Greenpoint spend contained inside its **$4,200 cap**

---

### Week 17–20 — Bushwick (11237 / 11206) Launch + Multi-ZIP Proof

**Weekly target checklist:**
- [ ] Week 17: Bushwick anchor outreach begins (5 shops) — Bushwick's own **$4,200 cap** applies
- [ ] Week 18: 8 Bushwick merchants signed
- [ ] Week 19: **25+ total merchants** across Williamsburg + Greenpoint + Bushwick
- [ ] Week 20: multi-ZIP public dashboard live at `/neighborhoods` (index of all three)
- [ ] SLR = 15 by EOW20

---

## Phase 6 — YC Summer 2027 Application (Week 20+)

**Target submission:** 2026-09 (YC Summer 2027 batch)

**Application traction bar (v5.1):**
- [ ] **50+ paying merchants** live on Operator plan
- [ ] **500+ campaigns** shipped end-to-end
- [ ] **$50K+ GMV** processed through platform
- [ ] **SLR ≥ 18 by M5, ≥ 25 by M12**
- [ ] **ConversionOracle accuracy ≥ 90% by M5**
- [ ] **DisclosureBot compliance pass rate ≥ 98%** (90-day rolling)
- [ ] 3+ published case studies + multi-ZIP dashboard
- [ ] Founder demo: walk-through of AgentOutputDemo + live `/neighborhoods/williamsburg-coffee` dashboard + SLR time-series chart

**Why this positions for RFS #5:**
- "AI agents for vertical industries" → Push is Vertical AI for Local Commerce
- Beachhead density (Williamsburg Coffee+) proves the model
- Multi-ZIP expansion at 60%+ Pilot-to-Paid proves the Neighborhood Playbook replicates
- Rising SLR across phases proves real software leverage (not repackaged services)
- ConversionOracle + DisclosureBot are named, dated, production AI systems with measurable accuracy / compliance rates

---

## Expansion Budget Caps (Pre-Series A Total: $130,200 across 31 neighborhoods)

| Tier | Scope | Count | Per-ZIP Cap | Total |
|------|-------|-------|-------------|-------|
| **Template 0** | Williamsburg Coffee+ | 1 | $4,200 | **$4,200** |
| **NYC Dense** | +4 adjacent (Greenpoint, Bushwick, LES, Astoria) | 5 | $4,200 | **$21,000** |
| **Top-5 Metro** | +25 incremental (NYC, LA, SF, Chicago, Boston) | 25 | $4,200 | **$105,000** |
| **Pre-Series A Total** | | **31** | | **$130,200** |

A new neighborhood may only open after the prior tier's neighborhoods hit Pilot-to-Paid ≥ 60%, ConversionOracle accuracy ≥ 90%, DisclosureBot pass rate ≥ 98%. Failing any of these = Neighborhood Playbook bug; fix before spending the next cap.

---

## Per-Neighborhood Budget (Williamsburg worked example, ≤ $4,200 cap)

| Item | Cost | Notes |
|------|------|-------|
| Creator payments during Pilot (Week 1–4) | ~$1,050 | 20 creators × ~$53 avg at 70% Pilot rate |
| Creator payments during Pilot (Week 5–8) | ~$1,680 | 20 active campaigns × 2 weeks × ~$42 avg (70% Pilot rate on deliveries flipping to full on Paid conversions) |
| Claude API (ConversionOracle + DisclosureBot + matching) | $280–560 | Scales with campaign count |
| Supabase + Vercel (attributed to this ZIP) | $30–70 | Pro tier Week 9+ allocation |
| Amex gift cards (manager referral) | $300 | 3 × $100 bonuses expected to trigger |
| Scouting, walk-ins, meals | $400 | Coffee at each merchant during pitch |
| Miscellaneous / buffer | $200 | |
| **Williamsburg subtotal** | **≤ $4,200** | Hard cap |

Greenpoint and Bushwick each get their own $4,200 cap using this same breakdown. If a cap starts to be breached, pause new Pilot signups in that ZIP until the Playbook is fixed.

---

## v5.1 MVP Tech Stack

### Frontend
- **Framework:** Next.js (App Router)
- **Styling:** Vanilla CSS, strictly following `Design.md` (sharp corners, 6-color brand palette)
- **Hosting:** Vercel (Pro tier from Week 9)
- **Cost:** $0 → $20/mo

### Backend / Database
- **Database:** Supabase (PostgreSQL) — 6 core tables already shipped (see commit `4e98348`)
- **Auth:** Supabase Auth (email magic links) + service-role for trusted server inserts (commit `ec1f9d6`)
- **API:** Next.js API routes (first route `/api/attribution/scan` live per commit `86a7972`)
- **Cost:** Free → Pro ~$25/mo

### AI Layer (v5.1 — the product)
- **ConversionOracle** — verification + matching (Claude Vision + OCR + geo). Target ≥ 90% accuracy by M5.
- **DisclosureBot** — automated FTC-compliant disclosure copy generator + compliance tracker. Target ≥ 98% pass rate at 90-day rolling.
- **Cost:** ~$0.05–0.15 per verified customer at steady state

### Payments & Comms
- **Merchant billing:** Stripe subscriptions (Operator plan: $500/mo base + metered $40/verified customer)
- **Creator payouts:** Venmo / Zelle (manual through Week 12) — 70% rate during Pilot, 100% once merchant flips to Paid. Stripe Connect from Week 13+
- **Email:** Resend or SendGrid for ROI statements, campaign emails
- **Cost:** ~$800 total over 30 weeks (shared across all neighborhoods)

### Analytics
- **Campaign tracking:** Supabase queries → public dashboard
- **SLR tracking:** custom harness logging campaigns run per week and ops hours per week
- **Product analytics:** PostHog (optional, Week 9+)
- **Logging:** Vercel logs + Sentry (Week 9+)
- **Cost:** Free tier through Week 12

---

## Execution Tips (v5.1-specific)

### Week 1–4: Ship AI, Win Anchors, Signed LOIs
- The AgentOutputDemo is the single strongest sales asset. Ship it first, demo it in every walk-in.
- Sey / Devocion / Partners are non-negotiable. If one passes, re-pitch with case-study-promise language.
- Never start a Pilot without a signed $1 LOI. Verbal commitment is not a Pilot.

### Week 5–8: Metrics Discipline + Auto-Terminate
- The `/neighborhoods/williamsburg-coffee` dashboard must update daily. If it stalls, merchant trust stalls.
- Every campaign must close its loop: creator paid (at 70% Pilot rate) within 24h, merchant ROI emailed monthly.
- Day-30 auto-terminate is non-negotiable. If a merchant has < 5 verified customers at day 30, end the Pilot cleanly — don't prolong it.

### Week 9–12: Case Studies > New Merchants + SLR Hygiene
- Week 9–12 is about **depth**, not breadth. Publish the 3 case studies with real numbers even if they're small.
- Greenpoint discovery in parallel is background work, not the focus.
- If SLR is below 10 by Week 12, pause Greenpoint prep and ship more automation.

### Week 13–20: Replicate the Neighborhood Playbook, Don't Improvise
- Greenpoint and Bushwick use the **exact** Williamsburg Neighborhood Playbook. Do not rework the pitch, pricing, or ConversionOracle threshold mid-expansion.
- If a ZIP under-performs, assume the Playbook is right and the ZIP is wrong (go to the next ZIP instead of reworking the Playbook).
- Each ZIP has its own $4,200 cap; don't cross-subsidize from another ZIP's budget.

### Expansion Readiness (Week 20+)
- New category (e.g., bakeries, espresso bars adjacent) only unlocks after ALL three Brooklyn ZIPs saturate
- YC application week: founder mode, freeze engineering on new features, only metric improvements + SLR polish
