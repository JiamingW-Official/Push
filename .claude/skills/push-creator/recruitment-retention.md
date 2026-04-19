# Creator Recruitment & Retention Strategy — v5.1

## Creator Recruitment

### Target Profile (v5.1 — segment-specific)

**T1-T3 seed recruitment profile (pay-per-verified-customer segment):**
- **Follower range:** 5K – 50K (Seed 5-15K, Explorer 15-30K, Operator 30-50K)
- **Location:** Active in target neighborhood (within 2km radius of merchants)
- **Activity:** Regular content posted (at least 2x/week)
- **Content type:** Food, lifestyle, local activity, or day-in-the-life content
- **Signal:** Already tags prospect merchants or location in content

**T4-T6 proven-closer-partner recruitment profile (retainer + performance + rev-share + equity segment):**
- **Follower range:** 30K+ (Proven 30-80K, Closer 80-250K, Partner 250K+)
- **Location:** Active creators with proven local commerce conversion history (Push-internal or verifiable external)
- **Signal:** Documented commercial campaign history; willing to sign rev-share + equity agreements
- **Sourcing channel:** Primarily referrals from existing Proven+ creators + Push ops direct outreach (not cold DM)

### Search Methods
1. **Instagram/TikTok location tags:** Search neighborhood names, popular food spots
2. **Hashtag mining:** Local food hashtags, neighborhood names (e.g., #Williamsburg eats)
3. **Merchant cross-reference:** Who already tags the merchants you're courting?
4. **Community groups:** Local Facebook groups, Telegram, WhatsApp communities
5. **T4-T6 pipeline:** Proven-creator referrals (2x $200 referral bounty on successful Proven-tier sign-up + retention to 30d)

### DM Script (Template — T1-T3)

**Version A (Direct):**
> "Love your content at [specific place from their post]. Building Push — connects local food creators with cafes, dessert, fitness, beauty merchants for paid campaigns. [X] spots in first batch. Per-customer pay, coffee $12-20, fitness $48, beauty $68. Interested? [Link to signup]"

**Version B (Value-first):**
> "Your [specific post description] was fire. Push connects creators like you with [specific merchant name] for paid partnerships. You visit → create → post → get paid per verified customer. 5K-50K followers ideal. First batch closes [date]. [Link]"

**Key elements:**
- Specific reference to their recent post (not generic)
- Per-vertical rate stated upfront (transparency beats pitching)
- Urgency (batch closing, limited spots)
- Direct call-to-action with link

### Outreach Template (T4-T6 — referral or direct ops)

> "You're on our shortlist for Push Proven/Closer tier. Here's what that actually means: $800/mo (Proven) to $3,500/mo (Partner) base retainer from our merchant-pooled fund, plus $25-$60 per verified customer you deliver, plus 15-20% rev-share on merchants you refer (12-mo window), plus equity pool participation at Closer+. No cold pitching — you get your first curated merchant match within 48h of onboarding. Keeps the per-customer logistics on our side; you focus on content. Open to a 20-min walkthrough?"

### Recruitment Funnel (v5.1 — T1-T3 track)
1. **Outreach:** 100 DMs → expect 10-15% response
2. **Signup:** Interested creators fill profile (1 min) — profile includes IG/TikTok handle so the matching agent + ConversionOracle can seed an initial `category_affinity` estimate from public content
3. **Seed onboarding:** Welcome kit ("Your First Campaign" checklist + 3 example posts). Initial `category_affinity` is estimated from scraped handle content; the agent uses this provisional affinity for first-campaign routing.
4. **First campaign (bootstrapped routing):** Because new Seed creators have no Push-internal history, their first invite is a **founder-curated agent pick** — the founder/ops manually approves the agent's top suggestion before it DMs out. Free product + $12-35 cash (Push-funded for Phase 1; vertical-rate-aligned).
5. **Second campaign (full agent routing):** After campaign 1 completes, the agent now has real `verified_conversions_90d` data + in-platform content rating + early DisclosureBot compliance signal. Invite for campaign 2 comes through the same DM flow all tiers use. Free product + per-vertical rate + **$5 upgrade bonus** upon completion.
6. **Conversion to Explorer:** Complete 2 campaigns + provisional score ≥ 40 = auto-upgrade. `category_affinity` now anchored in real Push data, not scraped content. CreatorGPT brief assist unlocks.

### Recruitment Funnel (v5.1 — T4-T6 track)
1. **Sourcing:** Proven-creator referrals or direct ops outreach (never cold DM at scale)
2. **Vetting call (30 min):** Ops reviews external campaign history + validates follower quality + explains retainer/rev-share/equity mechanics + answers questions
3. **Contract execution:** Creator signs retainer agreement + rev-share schedule + (Closer/Partner only) equity grant documentation with vest schedule
4. **Retainer onboarding session (60 min):** Dedicated account manager walks creator through:
   - Dashboard: retainer ledger, per-customer perf bonus ledger, rev-share attribution ledger, equity vest tracker (Closer+)
   - DisclosureBot compliance: gate for equity vesting, standards, dispute flow
   - First curated merchant match (delivered within 48h)
5. **First performance review (Day 30):** Compliance rate check, verified-conversions output review, rev-share sign-up count review
6. **Quarterly business review:** Performance → retainer band confirmation → equity vest activation

### Phase 1 Recruitment Economics (T1-T3 focus for 60-day beachhead)
- **Founder outreach budget (Williamsburg coffee beachhead):** $12-20/creator × 15 creators/batch (coffee per-customer rate) + $5 upgrade bonus = $185-305/batch
- **2-3 batches in first 90 days** = ~30-45 Seed creators
- **Expected progression:** ~60% complete 2 campaigns → ~18-27 move to Explorer
- **Success metric:** 1+ Operator-tier creator by month 3; first Proven recruit by month 6

---

## Retention Architecture

The retention engine has two layers: **behavioral design** (what keeps creators coming back) and **progression design** (what keeps them advancing). In v5.1, the **Creator Productivity Lock (SCOR framework in SKILL.md)** is the strategic frame these mechanics serve.

### Behavioral Design (Creator Psychology)

| Mechanism | Psychological Trigger | Implementation (v5.1) |
|---|---|---|
| **Agent-issued invites** | Scarcity + validation | "You were selected by the matching agent out of N eligible creators" — the invite itself signals you were picked by ConversionOracle, not self-applied |
| **2-hour invite response window** | Loss aversion + urgency | Default 2-hour window to accept/decline; if you let it lapse, the agent routes to the next candidate. Visible countdown in the DM. This is the single strongest FOMO lever — the invite is not sitting in a board for you to come back to later; it's gone in 2 hours. |
| **CreatorGPT brief drop** | Competence boost | Explorer+ invites arrive pre-drafted by CreatorGPT — creator reviews and ships in 10 minutes vs. 40 minutes of raw drafting |
| **Rising-rank visibility** | Progress feedback | Dashboard shows "agent routed you 7 invites in the last 30 days, up from 3 last month" — creators feel the ranking improve |
| **Tier progression ladder** | Achievement/status | Visible tier badges, score dashboard, public leaderboard |
| **48h payouts** | Instant gratification | Industry norm 30-60d; Push's 48h payout is a visible delta |
| **Non-portable context** | Lock-in/switching cost | Tier label is portable (external bio), but ConversionOracle context, `category_affinity`, `verified_conversions_90d`, and DisclosureBot compliance rate all live ONLY on Push — cannot transfer to competitors |
| **Public rebook history** | Reputation/social proof | Show "worked with [merchant]" on creator profile |
| **Verified conversion badge** | Prestige signaling | "47 verified customers last 90d" beats "12 campaigns completed" as a bragging line |
| **Referral milestone tracker (T1-T3)** | Goal proximity | Dashboard shows "23/30 referrals this month — $15 bonus at 30!" |
| **Retainer + equity ledger (T4-T6)** | Predictability + wealth compound | Monthly retainer statement, per-customer perf bonus ledger, rev-share sign-up attribution, equity vest tracker |

### T4-T6 Retainer + Equity Onboarding Flow (NEW v5.1)

The segment-crossing moment (Operator → Proven) is the single biggest progression event in the ladder. Because the earning model itself changes, the onboarding is correspondingly heavier:

**Day 0 — Tier promotion to Proven:**
- Push Score ≥ 65 sustained for 2 consecutive campaigns + DisclosureBot compliance rate ≥ 95%
- Creator receives "You've been promoted to Proven tier" DM with scheduling link for retainer onboarding

**Day 1-3 — Retainer onboarding session (60 min with dedicated account manager):**
- Walk through $800/mo retainer mechanics: merchant-pooled fund, pay date (1st of month), performance-gated floor (must deliver ≥ 10 verified customers/mo to retain full retainer; falls to $500/mo if output drops, full $800 restored the month verified customer output recovers)
- Walk through $25/customer performance bonus on top of retainer
- Walk through DisclosureBot compliance as **ongoing gate**: must maintain ≥ 95% for tier, ≥ 98% for equity (at Closer+)
- First curated merchant match delivered within 48h

**Day 4-30 — First retainer month:**
- Weekly check-ins with account manager
- End of month: first retainer payment + performance bonus settlement

**If promoted to Closer (Proven → Closer):**
- Rev-share agreement signed: 15% of referred merchant's Push revenue, 12-mo window, $500/mo cap per merchant
- Equity grant documentation: 0.02% equity pool per top-100 Closer, 4-yr vest + 1-yr cliff, perf-gated after year 2, DisclosureBot ≥ 98% gate
- Rev-share attribution dashboard activated
- Equity vest tracker activated

**If promoted to Partner (Closer → Partner):**
- Rev-share step-up to 20% (same window + cap)
- Equity pool 0.05-0.2% with lock-up provisions
- Exclusive enterprise campaign channel access
- Quarterly business review cadence established

### DisclosureBot Compliance Gate for Equity Eligibility (NEW v5.1)

Equity is the capstone reward for Closer/Partner tier. To protect Push against FTC risk and align the creator's incentive with long-run platform integrity, equity vesting is gated on DisclosureBot compliance:

| Trailing 90d Compliance Rate | Equity Status |
|---|---|
| ≥ 98% | **Fully eligible** — vesting accrues normally |
| 95-97.9% | Warning state — no new vesting this quarter, prior vested equity intact |
| 90-94.9% | Pause state — no new vesting + tier review triggered |
| < 90% | Forfeit trigger — unvested equity forfeited, tier demotion, full compliance retraining required to restore equity track |

**Dashboard visibility:** "Your DisclosureBot compliance rate: 99.2% — equity eligible" (green) / "Your compliance rate: 96.1% — warning state, equity paused this quarter" (yellow) / "Your compliance rate: 93.4% — tier review triggered" (red).

**Rationale:** FTC enforcement is an existential platform risk. Equity aligns the Closer/Partner's incentive with Push's compliance posture, not just their own per-campaign payout. The 98% bar is achievable (DisclosureBot does most of the work — the creator just has to not bypass it).

---

## What Each Tier Unlocks (Narrative) — v5.1

The core design principle: **Each tier is designed so its rewards match what creators at the previous tier start craving.** The v5.1 shift: at the T3→T4 boundary, the earning model itself flips from pay-per-customer to retainer+performance+rev-share+equity — this is the biggest progression moment in the entire ladder.

---

### Seed → Explorer: "From Tester to Official"
**What Seed creators crave after 1-2 campaigns:**
- "Am I actually good at this?" (validation)
- "Can I make real money?" (cash motivation)
- "Official status" (identity)
- "How am I actually doing?" (data curiosity)

**What Explorer unlocks:**
- **Official badge** ("Explorer" tier, visible on profile)
- **Cash payment per verified customer by vertical** (coffee $15 / coffee+ $25 / dessert $22 / fitness $55 / beauty $75)
- **CreatorGPT brief assist (NEW in v5.1 frame)** — AI drafts content angles, CTAs, and disclosure language in the invite DM; creator edits rather than writing from scratch
- **Referral analytics dashboard** — see how many people clicked your link, how many visited, conversion rate
- **Content Creation Guide + Best Practices Library** — curated examples of high-performing campaign content
- **Profile visibility** (ranked in Explorer pool; agent reads the profile)
- **2 concurrent campaigns** (vs. 1)

**Retention mechanic:** The shift from free product to per-vertical cash rate + CreatorGPT-drafted briefs collapses onboarding friction. Data visibility ("your referral link got 47 clicks and 12 store visits") makes the creator feel like a professional, not a hobbyist. All this costs Push near-zero but transforms creator self-perception.

---

### Explorer → Operator: "From Gig Worker to Commission Earner"
**What Explorer creators crave after reaching 40-55 score:**
- "I want passive income" (commission aspiration)
- "I want more campaign flow" (volume)
- "I want to understand my data better" (optimization)

**What Operator unlocks:**
- **Commission (3% first unlock) + Referral Milestone Bonus ($15 at 30 txns/mo)** — T1-T3 behavioral inflection point
- **Per-vertical rate step-up:** coffee $20 / coffee+ $35 / dessert $30 / fitness $60 / beauty $80
- **Cross-vertical access** — Operators can be routed to verticals beyond their primary `category_affinity` as secondary matches
- **Data Literacy Tutorial** — how to read ConversionOracle signals, optimize posting times, understand which content drives most verified customers
- **Priority routing inside tier** — the matching agent weights Operator-tier creators above Explorer/Seed within the same affinity + geo band
- **Full campaign pre-briefing** in the invite DM — see draft concept, payout breakdown, timeline before deciding
- **Decline-without-penalty** — structured reason (wrong fit, schedule, audience mismatch); feeds back into ranking model
- **3 concurrent campaigns**

**Retention mechanic:** Commission + milestone bonus + cross-vertical access makes Operator feel like a real monthly income track. Concrete example below shows $600-1,500/mo as the realistic band.

**Concrete monthly earnings example — Active Operator (coffee + coffee+ mix):**
- 15 verified coffee customers × $20 = $300
- 5 verified coffee+ customers × $35 = $175
- Commission on transactions: ~$10
- Milestone bonus (30+ txns): $15
- **Total: ~$500/month; stretch target $1,500/month at 50+ verified customers**

---

### Operator → Proven: "From Gig Worker to Retainer Creator" (v5.1 — segment-crossing inflection)

**What Operator creators crave after reaching 55-65 score:**
- "Predictable income" (retainer aspiration)
- "Work with bigger merchants" (quality)
- "Feedback from experts" (growth)

**What Proven unlocks (v5.1 — earning model itself changes):**
- **$800/mo base retainer** — the single biggest progression moment; creator now has a monthly income floor, not just per-customer pay
- **$25/customer performance bonus** — stacks on top of retainer; 20 customers = $500 additional on top of $800 retainer = $1,300/mo
- **Typical blended $1,500-2,000/mo**
- **Retainer onboarding session** (60 min with dedicated account manager)
- **Merchant tier preference setting** — prioritize Subscription-tier merchants
- **Structured Campaign Feedback Form** — suggestions (preferred time slot, product focus, content angle) that merchant sees
- **Monthly 1-on-1 content review** (15 min/month with Push team)
- **Fast payout: 48h**
- **4 concurrent campaigns**

**Retention mechanic:** The retainer is the inflection. Creators stop thinking "can I book enough campaigns this month?" and start thinking "I'm a professional creator on Push." This is the moment Push becomes their job, not a side hustle. The DisclosureBot ≥ 95% gate is introduced here.

---

### Proven → Closer: "From Retainer Creator to Equity Participant"
**What Proven creators crave after reaching 65-78 score:**
- "Wealth compound" (equity)
- "Influence" (exclusive partnerships)
- "Higher retainer" (financial step-up)

**What Closer unlocks:**
- **$1,800/mo retainer** (jump from $800)
- **$40/customer performance bonus** (jump from $25)
- **15% rev-share** on merchants you refer to Push, 12-mo window, $500/mo cap per merchant — you become a growth channel and get paid for it
- **0.02% equity pool** per top-100 Closer, 4-yr vest + 1-yr cliff, perf-gated after year 2
- **Typical $3,000/mo blended** (retainer + performance + rev-share partial realization)
- **DisclosureBot compliance gate at 98%** for equity eligibility
- **Dedicated account manager + strategy coaching sessions**
- **Can filter to only accept Scale-tier merchant goals**
- **Leaderboard prominence** (featured as "top creator" in app)
- **5 concurrent campaigns**

**Retention mechanic:** Equity is the lock. A Closer who leaves Push forfeits unvested equity — this is the strongest retention mechanic in the ladder. The DisclosureBot 98% gate makes compliance not just a rule but a wealth mechanic.

---

### Closer → Partner: "From Equity Participant to Co-Brand"
**What Closer creators crave after reaching 78-88 score:**
- "Industry recognition" (be known beyond Push)
- "Exclusive deals" (the best merchants, locked)
- "Larger equity" (the real wealth moment)

**What Partner unlocks:**
- **$3,500/mo base retainer** (largest in platform)
- **$60/customer performance bonus**
- **20% rev-share** on referred merchants (same 12-mo window + $500/mo cap)
- **0.05-0.2% equity pool** with lock-up provisions — the largest equity grants on Push
- **Typical $5,000+/mo blended**
- **Exclusive enterprise campaign access** — the largest-budget merchant engagements are Partner-only
- **Advisory access to platform roadmap** — monthly product feedback sessions with founding team, priority beta access
- **Exclusive merchant partnerships (1-3 merchants)** — can lock in exclusive relationships
- **Campaign veto with feedback** — can decline campaigns with structured reason
- **Quarterly business review** — Push team presents Partner's performance data, growth trajectory, strategic recommendations
- **Media features** (Push highlights Partner creators in press, podcast, case studies)
- **Annual Partner dinner/offsite** (exclusive community event; activates when 5+ Partners exist)
- **6 concurrent campaigns**

**Retention mechanic:** Partner creators are co-founders in spirit. Advisory access + exclusive enterprise channel + 20% rev-share + 0.05-0.2% equity pool + lock-up create deep alignment. They are now in Push's long-term compounding curve, not just its monthly GMV.

---

## Education & Growth Benefits Summary — v5.1

| Tier | Education/Growth Benefit | Cost to Push | Perceived Value |
|---|---|---|---|
| Seed | Welcome kit: "Your First Campaign" checklist + 3 example posts | Near zero (one-time content) | Medium |
| Explorer | CreatorGPT brief assist + Content Creation Guide + Best Practices Library + Referral Analytics Dashboard | Near zero (automated) | **High** |
| Operator | Data Literacy Tutorial (ConversionOracle signals, optimization) + cross-vertical onboarding | Low (one-time content) | Medium-High |
| Proven | Retainer onboarding session + monthly 1-on-1 content review + DisclosureBot compliance training | Medium (time) | **Very High** |
| Closer | Dedicated account manager + strategy coaching + equity vest onboarding + rev-share attribution dashboard | High (headcount) | **Very High** |
| Partner | Quarterly business review + media features + enterprise channel + advisory access | Medium (time) | **Very High** |

**Strategic rationale:** Education benefits directly improve content quality → merchant satisfaction → creator score → tier progression → more campaigns → more merchant value. At T4-T6 they also serve as compliance + retention infrastructure (DisclosureBot training, equity vest tracker). Virtuous cycle at near-zero marginal cost for T1-T3; higher marginal cost at T4-T6 but fully justified by retainer + rev-share + equity capture.

---

## Retention Metrics (How to Measure)

| Metric | Target | Why It Matters |
|---|---|---|
| **Week 1 retention (Seed→1st campaign completion)** | 80%+ | Are first campaigns engaging? |
| **Month 1 retention (≥2 campaigns)** | 60%+ | Are creators seeing value? |
| **Explorer→Operator promotion rate** | 40%+ | Are creators earning commission? |
| **Milestone bonus hit rate (Operator+)** | 30%+ | Are referral milestones achievable? |
| **Operator→Proven promotion rate** | 15%+ | Is the segment-crossing path working? |
| **Proven retainer retention (full $800 maintained)** | 70%+ | Is the retainer floor working as designed? |
| **Closer+ DisclosureBot compliance ≥ 98%** | 90%+ of active Closer+ | Is the equity gate maintainable? |
| **Rev-share attribution rate (Closer+)** | 1 referred merchant / Closer / quarter | Is the rev-share mechanic activating? |
| **Avg campaigns/creator/month** | 5.2+ (platform average) | SCOR supply density target |
| **Rebook rate (merchants rehire same creator)** | 40%+ | Are creator-merchant relationships working? |
| **Churn rate (inactive 90+ days)** | <15% | Are we keeping engaged creators? |

---

## Retention Levers (What to Pull If Metrics Slip)

| Problem | Solution |
|---|---|
| **Low Seed→Explorer conversion** | Increase upgrade bonus from $5 to $10; send "1 campaign away!" reminder after 1st completion |
| **Low Explorer→Operator promotion** | Make milestone bonus terms visible on dashboard; add "commission simulator" showing projected earnings |
| **High churn at Operator** | Adjust milestone threshold downward (30 → 20 txns); expand cross-vertical access eligibility |
| **Low Operator→Proven promotion** | Review retainer onboarding clarity; ensure first curated match delivered within 48h; verify retainer narrative is legible |
| **Proven losing retainer floor** | Audit whether performance-gated floor mechanic is too aggressive; consider 2-month lookback vs 1-month |
| **DisclosureBot compliance dropping** | Run compliance retraining webinar; push notification at 96% compliance (pre-warning state) |
| **Low rev-share activation** | Make the rev-share attribution flow visible and simple; provide Closer/Partner with sharable signup links |
| **Tier progression stalling** | Run "score boost" events; make scoring formula more transparent |
| **Low engagement on leaderboard** | Gamify tiers; add weekly/monthly bonus for top performers |

---

## Recruitment-to-Retention Funnel (Full Lifecycle) — v5.1

```
Week 0-2: Outreach (100 DMs, T1-T3 target)
  ↓ 10-15% conversion
Week 2-3: Seed campaign 1 (15-20 creators)
  ↓ 80% complete first campaign
Week 3-5: Seed campaign 2 + $5 upgrade bonus (12-16 creators)
  ↓ 60% score ≥ 40 (auto-promote to Explorer)
Month 2: Explorer campaigns (10-14 creators) — CreatorGPT + analytics dashboard unlocked
  ↓ Campaign 3-4; commission path visible
Month 2-3: First Operator tier creators — milestone bonus trackable + cross-vertical access
  ↓ Commission + milestone unlocked; engagement spikes
Month 3-6: Best Operators approach Proven threshold (score 65+)
  ↓ Retainer onboarding session; segment-crossing
Month 6+: First Proven creators on $800/mo retainer
  ↓ 15%+ promote to Closer → $1,800/mo retainer + rev-share + equity
Month 9-12: First Closer creators vest first equity quarter (DisclosureBot compliance ≥ 98%)
  ↓ Partner nomination for top performer
Month 12+: Sustained T1-T3 scale (50+ active) + T4-T6 flywheel (3-5 active Proven+)
```

**Success definition:**
- Month 3: 1+ Operator-tier creator
- Month 6: 3-5 Operator + first Proven recruit
- Month 12: 10+ Operator + 3 Proven + 1 Closer
- Month 18: First Partner-tier creator
