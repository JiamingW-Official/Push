# Cold-Start Plan — Williamsburg Coffee × 30 Weeks (v5.0)

Complete detailed roadmap for launching Push v5.0 in **Williamsburg (11211 / 11206 / 11249)**, category **coffee**, with 60-day saturation window followed by adjacent-ZIP expansion and YC S27 application prep.

**Week 1 baseline:** 2026-04-14. **YC S27 application target:** 2026-09.

> Filename retained as `cold-start-12week.md` for path stability — content is the v5.0 30-week plan.

---

## Beachhead Lock-in (do not dilute)

| Axis | Value |
|------|-------|
| **Category** | Coffee (only) |
| **Geography** | Williamsburg: ZIPs **11211 / 11206 / 11249** |
| **Saturation window** | 60 days (Week 1 – Week 8) |
| **Next ZIP** | Greenpoint (11222) in Week 13, then Bushwick (11237 / 11206) |
| **New category** | **Frozen** until Williamsburg + Greenpoint + Bushwick all prove unit economics on coffee |

---

## Phase 1 — AI MVP + First Merchant Signup (Week 1–2)

### Week 1 — Ship AI MVP + Anchor Merchant Outreach Begins

**Engineering deliverables (due EOW):**
- [ ] AgentOutputDemo UI live (shows Claude-Vision verification reel to merchant prospects)
- [ ] `/merchant/pilot` landing page with **goal-first onboarding** ("How many customers do you need this month?")
- [ ] Claude Vision verification path, env-gated (enabled in staging + Sey account only)
- [ ] `/neighborhoods/williamsburg-coffee` route scaffolded (will populate Week 5)

**Merchant outreach (anchors):**
- Build outreach list of **3 anchor coffee shops**: **Sey Coffee**, **Devocion**, **Partners Coffee**
- Founder does cold walk-in to each during dead hours (Tue/Wed/Thu 2–4pm) with printed pilot sheet
- Target: 3 warm conversations with owner/manager by EOW

**Creator recruitment:**
- Build Instagram prospect list: search "coffee" + "Williamsburg" + 1K–5K followers
- DM **10 creators** in 11211 / 11249 with specific post reference + pilot invitation

**End of Week 1 output:**
- AI MVP shippable build
- 3 anchor coffee shop conversations logged with owner contact
- 10 DM'd creators; target 5+ interested responses

---

### Week 2 — First Merchant Signs + Creator Cohort Fills

**Merchant:**
- [ ] Sign **Sey Coffee** on $0 Pilot plan (signature by Friday)
- [ ] Close remaining 2 anchor shops (Devocion, Partners) — target: all 3 anchors signed by EOW Week 2
- [ ] Ship anchor pilot briefs into the admin dashboard

**Creator:**
- [ ] Complete **10 creators** signed up (finish Week 1 prospect list)
- [ ] Run 15-minute onboarding call with each Partner-tier candidate

**Product:**
- [ ] Ship basic admin dashboard for manual ops (campaigns table, creator table, merchant table)
- [ ] Ship first weekly ROI email template (will auto-send Week 5)

**End of Week 2 output:**
- 3 anchor merchants live on Pilot
- 10 creators signed, 5+ ready for Week 3 campaign
- All outreach logged in shared spreadsheet (date, channel, response)

---

## Phase 2 — Cohort Fill + First Campaign (Week 3–4)

### Week 3 — Fill Merchant Cohort + Prep First Campaign

**Merchant:**
- [ ] Sign **7 more coffee shops** using anchor-referral + cold walk-in (cumulative **10 merchants live**)
- [ ] Each new shop: goal-first onboarding, Pilot pricing ($0 to deliver first 10 verified customers)

**Creator:**
- [ ] Recruit **10 more creators** (cumulative **20 creators**)
- [ ] Activate Channel 2: ask each signed merchant's manager to recommend 2–3 regulars who create content

**Campaign prep:**
- [ ] AI-matching: Claude Vision + Push Score selects **top 5 creators** for Sey Coffee's first campaign
- [ ] Write campaign brief: deliverable, verification method (QR + Claude Vision + geo), payout trigger

**End of Week 3 output:**
- 10 merchants live
- 20 creators signed
- Sey Coffee × 5 creators campaign ready to launch Monday Week 4

---

### Week 4 — First Campaign Ships + First Verified Customers

**Launch:**
- [ ] Monday: **first AI-matched campaign** goes live (Sey Coffee × 5 creators)
- [ ] Tuesday–Friday: creators post, scan events flow into `scan_events` table, Claude Vision runs
- [ ] Saturday: **10 verified customers** delivered for Sey Coffee (Week 4 target)

**Ops:**
- [ ] Daily ops standup: review `/api/attribution/scan` failures, verify Claude Vision results
- [ ] Payout creators within 24h of verified campaign completion

**Merchant feedback:**
- [ ] Sunday call with Sey Coffee owner: review 10 verified customers, ROI, willingness to flip to Performance

**End of Week 4 output:**
- First campaign shipped end-to-end
- 10 verified customers for Sey Coffee (milestone)
- Sey ready to flip to Performance in Week 5

---

## Phase 3 — Saturation + Case-Study Generation (Week 5–8)

### Week 5–6 — Scale to 20 Active Campaigns

**Weekly target checklist:**
- [ ] **20 active campaigns** running across all 10 Williamsburg coffee merchants
- [ ] Sey Coffee flips to **Performance plan** ($500/mo min + $40/customer) — first paid merchant
- [ ] 2+ more merchants cross 10 verified customers, flip to Performance

**Dashboard:**
- [ ] Ship `/neighborhoods/williamsburg-coffee` public dashboard with live numbers: scans, verified customers, cost-per-customer, ROI
- [ ] Auto-refresh every 24h

**Experiments (Week 5–6):**
- [ ] Experiment 1: **Merchant pricing test** — 5 control / 5 treatment on Performance plan positioning

**End of Week 5–6 output:**
- 20 active campaigns
- 3+ merchants on Performance
- Dashboard live and linked from homepage

---

### Week 7–8 — Saturation + First Case Studies Drafted

**Weekly target checklist:**
- [ ] All 10 merchants have run at least 1 campaign
- [ ] 5+ merchants on Performance
- [ ] Draft 3 case studies: **Sey / Devocion / Partners** (results, verified customer count, creator highlights)

**Experiments (Week 7–8):**
- [ ] Experiment 2: **Creator compensation test** — fixed $20 base vs. variable 3% commission

**End of Week 7–8 output:**
- 10 merchants saturated
- 50%+ on Performance
- 3 case studies drafted, ready for publication

---

## Phase 4 — Retention + Greenpoint Prep (Week 9–12)

### Week 9–10 — Lock In Retention

**Weekly target checklist:**
- [ ] **80% of Pilot merchants on Performance** by end of Week 10
- [ ] First monthly ROI statement emailed to all merchants
- [ ] Publish Case Study #1 (Sey Coffee) on `/neighborhoods/williamsburg-coffee`

**Experiments:**
- [ ] Experiment 3: **Verification threshold test** — 180m vs. 200m vs. 250m geo-match pass window

---

### Week 11–12 — Publish Case Studies + Start Greenpoint Discovery

**Weekly target checklist:**
- [ ] Publish Case Studies #2 (Devocion) and #3 (Partners) with live metrics
- [ ] Begin **Greenpoint (11222) coffee discovery**: identify 8 merchants, 12 creators (not yet signed)
- [ ] Week 12 Go/No-Go review (see table below)

**Week 12 Go/No-Go Decision:**

| Metric | Target | Status |
|--------|--------|--------|
| Williamsburg coffee merchants live | 10+ | Go/No-go? |
| Pilot → Performance conversion | 80%+ | Go/No-go? |
| Verified customers delivered (total) | 200+ | Go/No-go? |
| Creator completion rate | 85%+ | Go/No-go? |
| Case studies published | 3 | Go/No-go? |
| False-positive verification rate | < 2% | Go/No-go? |
| Merchant NPS | > 7/10 | Go/No-go? |

- ✅ **GO** → proceed to Week 13 Greenpoint launch
- ⚠️ **ITERATE** → extend Williamsburg 2 weeks, fix weakest metric
- ❌ **PIVOT** → stop, revisit with user

---

## Phase 5 — Adjacent ZIP Expansion (Week 13–20)

### Week 13–16 — Greenpoint (11222) Launch

**Weekly target checklist:**
- [ ] Week 13: sign 3 Greenpoint anchor coffee shops (same walk-in playbook)
- [ ] Week 14: cumulative 8 Greenpoint merchants live
- [ ] Week 15: 12 Greenpoint creators signed
- [ ] Week 16: first Greenpoint campaigns running, on pace for 80% Performance conversion by Week 20

---

### Week 17–20 — Bushwick (11237 / 11206) Launch + Multi-ZIP Proof

**Weekly target checklist:**
- [ ] Week 17: Bushwick anchor outreach begins (5 shops)
- [ ] Week 18: 8 Bushwick merchants signed
- [ ] Week 19: **25+ total merchants** across Williamsburg + Greenpoint + Bushwick
- [ ] Week 20: multi-ZIP public dashboard live at `/neighborhoods` (index of all three)

---

## Phase 6 — YC S27 Application (Week 20+)

**Target submission:** 2026-09 (YC Summer 2027 batch)

**Application traction bar:**
- [ ] **50+ merchants** live on Performance plan
- [ ] **500+ campaigns** shipped end-to-end
- [ ] **$50K+ GMV** processed through platform
- [ ] 3+ published case studies + multi-ZIP dashboard
- [ ] Founder demo: walk-through of AgentOutputDemo + live `/neighborhoods/williamsburg-coffee` dashboard

**Why this positions for RFS #5:**
- "AI agents for vertical industries" → Push is the verticalized customer acquisition agent for local merchants
- Beachhead density (Williamsburg coffee) proves model; multi-ZIP expansion proves scalability; outcome-based pricing proves unit economics

---

## Budget (30 Weeks)

| Item | Cost | Notes |
|------|------|-------|
| Creator payments (Week 1–4) | $1,500 | 20 creators × ~$75 avg per campaign during ramp |
| Creator payments (Week 5–8) | $2,400 | 20 active campaigns × 2 weeks × ~$60 avg |
| Creator payments (Week 9–12) | $2,000 | Retention phase; higher-tier creators |
| Creator payments (Week 13–20) | $4,000 | Greenpoint + Bushwick ramp |
| Claude API (Vision + matching) | $400–800 | Scales with campaign count |
| Supabase + Vercel | $40–100 | Pro tier Week 9+ |
| Stripe + processing | ~$800 | 2.9% + $0.30 on Performance revenue |
| Domain, design assets | $100 | Minor |
| Amex gift cards (manager referral) | $500 | 5 × $100 bonuses expected to trigger |
| Scouting, walk-ins, meals | $600 | Coffee at each merchant during pitch |
| Miscellaneous | $400 | Buffer |
| **Total** | **~$12,500** | 30-week budget through YC application |

---

## v5.0 MVP Tech Stack

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

### AI Layer (v5.0 core)
- **Verification:** Claude Vision (env-gated, enabled per merchant)
- **Matching:** Claude-driven creator ranking, factoring Push Score + category affinity + verified_conversions_90d
- **OCR + geo:** bundled into Day-1 verification pipeline
- **Cost:** ~$0.05–0.15 per verified customer at steady state

### Payments & Comms
- **Merchant billing:** Stripe subscriptions (Performance plan: $500/mo base + metered $40/verified customer)
- **Creator payouts:** Venmo / Zelle (manual through Week 12), Stripe Connect (Week 13+)
- **Email:** Resend or SendGrid for ROI statements, campaign emails
- **Cost:** ~$800 total over 30 weeks

### Analytics
- **Campaign tracking:** Supabase queries → public dashboard
- **Product analytics:** PostHog (optional, Week 9+)
- **Logging:** Vercel logs + Sentry (Week 9+)
- **Cost:** Free tier through Week 12

---

## Execution Tips (v5.0-specific)

### Week 1–4: Ship AI, Win Anchors
- The AgentOutputDemo is the single strongest sales asset. Ship it first, demo it in every walk-in.
- Sey / Devocion / Partners are non-negotiable. If one passes, re-pitch with case-study-promise language.

### Week 5–8: Metrics Discipline
- The `/neighborhoods/williamsburg-coffee` dashboard must update daily. If it stalls, merchant trust stalls.
- Every campaign must close its loop: creator paid within 24h, merchant ROI emailed monthly.

### Week 9–12: Case Studies > New Merchants
- Week 9–12 is about **depth**, not breadth. Publish the 3 case studies with real numbers even if they're small.
- Greenpoint discovery in parallel is background work, not the focus.

### Week 13–20: Replicate, Don't Improvise
- Greenpoint and Bushwick use the **exact** Williamsburg playbook. Do not rework the pitch, pricing, or verification threshold mid-expansion.
- If a ZIP under-performs, assume the playbook is right and the ZIP is wrong (go to the next ZIP instead of reworking the playbook).

### Expansion Readiness (Week 20+)
- New category (e.g., bakeries, espresso bars adjacent) only unlocks after ALL three Brooklyn ZIPs saturate
- YC application week: founder mode, freeze engineering on new features, only metric improvements
