# Creator Recruitment & Retention Strategy

## Creator Recruitment

### Target Profile
- **Follower range:** 1K–15K followers (micro-creators)
- **Location:** Active in target neighborhood (within 2km radius of merchants)
- **Activity:** Regular content posted (at least 2x/week)
- **Content type:** Food, lifestyle, local activity, or day-in-the-life content
- **Signal:** Already tags prospect merchants or location in content

### Search Methods
1. **Instagram/TikTok location tags:** Search neighborhood names, popular food spots
2. **Hashtag mining:** Local food hashtags, neighborhood names (e.g., #Sheung Wan eats)
3. **Merchant cross-reference:** Who already tags the merchants you're courting?
4. **Community groups:** Local Facebook groups, Telegram, WhatsApp communities

### DM Script (Template)

**Version A (Direct):**
> "Love your content at [specific place from their post]. Building Push — connects local food creators with restaurants for paid campaigns. [X] spots in first batch. Interested? [Link to signup]"

**Version B (Value-first):**
> "Your [specific post description] was 🔥. We're connecting creators like you with [specific merchant name] for paid partnerships. Visit → create → post → get paid. 1K-15K followers ideal. First batch closes [date]. [Link]"

**Key elements:**
- Specific reference to their recent post (not generic)
- One-sentence value prop (paid, local, simple workflow)
- Urgency (batch closing, limited spots)
- Direct call-to-action with link

### Recruitment Funnel (v5.0 update)
1. **Outreach:** 100 DMs → expect 10-15% response
2. **Signup:** Interested creators fill profile (1 min) — profile includes IG/TikTok handle so the agent can seed an initial `category_affinity` estimate from public content
3. **Seed onboarding:** Welcome kit ("Your First Campaign" checklist + 3 example posts). Initial `category_affinity` is estimated from scraped handle content; the agent uses this provisional affinity for first-campaign routing.
4. **First campaign (bootstrapped routing):** Because new Seed ops have no Push-internal history, their first invite is a **founder-curated agent pick** — the founder/ops manually approves the agent's top suggestion before it DMs out. Free product + $25-35 cash (Push-funded for Phase 1).
5. **Second campaign (full agent routing):** After campaign 1 completes, the agent now has real `verified_conversions_90d` data + in-platform content rating. Invite for campaign 2 comes through the same DM flow all tiers use. Free product + $25-35 cash + **$5 upgrade bonus** upon completion.
6. **Conversion to Explorer:** Complete 2 campaigns + provisional score ≥ 40 = auto-upgrade. `category_affinity` now anchored in real Push data, not scraped content.

### Phase 1 Recruitment Economics
- **Founder outreach budget:** $25-35/creator × 15 creators/batch + $5 upgrade bonus = $380-530/batch
- **2-3 batches in first 90 days** = ~30-45 Seed creators
- **Expected progression:** ~60% complete 2 campaigns → ~18-27 move to Explorer (higher conversion due to lower threshold)
- **Success metric:** 1+ Operator-tier creator by month 3

---

## Retention Architecture

The retention engine has two layers: **behavioral design** (what keeps creators coming back) and **progression design** (what keeps them advancing).

### Behavioral Design (Creator Psychology)

| Mechanism | Psychological Trigger | Implementation (v5.0) |
|---|---|---|
| **Agent-issued invites** | Scarcity + validation | "You were selected by the matching agent out of N operators" — the invite itself signals you were picked |
| **Time-boxed invite response** | Loss aversion | 2-hour default window to accept/decline; if you let it lapse, the agent routes to the next candidate. Visible countdown in the DM. |
| **Rising-rank visibility** | Progress feedback | Dashboard shows "agent routed you 7 invites in the last 30 days, up from 3 last month" — operators can feel the ranking improve |
| **Tier progression ladder** | Achievement/status | Visible tier badges, score dashboard, public leaderboard |
| **Fast payouts** | Instant gratification | T+3 for Explorer, same-day for Closer/Partner |
| **Non-portable score** | Lock-in/switching cost | Push Score, `category_affinity`, and `verified_conversions_90d` all live ONLY on Push — invariant, cannot transfer to competitors |
| **Public rebook history** | Reputation/social proof | Show "worked with [merchant]" on operator profile |
| **Verified conversion badge** | Prestige signaling | "47 verified customers last 90d" beats "12 campaigns completed" as a bragging line |
| **Referral milestone tracker** | Goal proximity (Operator+) | Dashboard shows "23/30 referrals this month — $15 bonus at 30!" |

### What Each Tier Unlocks (Narrative) — Updated v4.1

The core design principle: **Each tier is designed so its rewards match what creators at the previous tier start craving.**

---

#### Seed → Explorer: "From Tester to Official"
**What Seed creators crave after 1-2 campaigns:**
- "Am I actually good at this?" (validation)
- "Can I make real money?" (cash motivation)
- "Official status" (identity)
- "How am I actually doing?" (data curiosity)

**What Explorer unlocks:**
- **Official badge** ("Explorer" tier, visible on profile)
- **First cash payment** ($12/campaign Standard; no longer free items only)
- **Referral analytics dashboard (NEW)** — see how many people clicked your link, how many visited, conversion rate. Zero-cost benefit with high perceived value.
- **Content Creation Guide + Best Practices Library (NEW)** — curated examples of high-performing campaign content
- **Profile visibility** (ranked in explorer list; merchants can search by name)
- **Increased campaign slots** (2 concurrent vs. 1)

**Retention mechanic:** The jump from free coffee to $15 cash is psychologically significant. But the real hook is **data transparency** — seeing "your referral link got 47 clicks and 12 store visits" makes the creator feel like a professional, not a hobbyist. This data visibility costs Push nothing but transforms the creator's self-perception.

---

#### Explorer → Operator: "From Gig Worker to Commission Earner"
**What Explorer creators crave after reaching 40-55 score:**
- "I want passive income" (commission aspiration)
- "I want control" (campaign choice)
- "I want to scale" (more campaigns)
- "I want to understand my data better" (optimization)

**What Operator unlocks:**
- **Commission (3% first unlock) + Referral Milestone Bonus ($15 at 30 txns/mo)** — This is the behavioral inflection point. The milestone bonus makes commission tangible in local F&B context.
- **Data Literacy Tutorial (NEW)** — how to read referral data, optimize posting times, understand which content drives most visits
- **Higher agent-routing priority** — the matching agent weights Operator-tier ops above Explorer/Seed within the same affinity + geo band; more invites reach their DM
- **Full campaign pre-briefing** in the invite DM — see draft concept, payout breakdown, timeline before deciding (Seed/Explorer see condensed briefs; Operator+ sees the full merchant context)
- **Decline-without-penalty** — Operator+ can decline an agent-routed invite with a structured reason (wrong fit, schedule, audience mismatch); the reason feeds back into the ranking model and does not hurt their Push Score
- **3 concurrent campaigns** (vs. 2; pipeline capacity)
- **Slightly higher base pay** ($20 Standard vs. $12, determined by Campaign Difficulty Multiplier)

**Retention mechanic:** Commission alone on $5-8 transactions is not enough ($0.15-0.24/txn). The milestone bonus transforms it: an Operator with 40 referral transactions × $7 avg gets $8.40 commission + $15 milestone bonus = **$23.40/month in passive referral income**, on top of $15-25/campaign base pay. That's the real inflection point.

**Concrete monthly earnings example — Active Operator:**
- 3 campaigns × $20 avg base = $60
- 40 referral transactions × $7 × 3% = $8.40
- Milestone bonus (30+ txns): $15
- **Total: ~$83/month** (vs. Explorer at ~$36/month = 2.3x jump)

---

#### Operator → Proven: "From Solo Shooter to Trusted Partner"
**What Operator creators crave after reaching 55-65 score:**
- "Work with better brands" (prestige)
- "Higher compensation" (financial)
- "Predictability" (contract-like relationships)
- "Expert feedback on my content" (growth)

**What Proven unlocks:**
- **Premium merchant queue** (priority matching with Growth+ plan merchants)
- **Merchant tier preference setting (NEW)** — can set preference to prioritize Growth/Pro merchants. This is bidirectional: gives Proven creators access to bigger budgets AND gives merchants a reason to upgrade.
- **Structured Campaign Feedback Form (NEW)** — when accepting a campaign, Proven creators can submit suggestions (preferred time slot, product focus, content angle). Merchant sees but is not obligated. Replaces vague "co-design rights" with an actionable mechanism.
- **Monthly 1-on-1 content review (NEW)** — Push team reviews creator's recent campaign content and gives specific improvement suggestions
- **5% commission + $30 milestone bonus (at 40 txns/mo)**
- **Fast payout: T+1** (vs. T+2; money in 1 day)
- **Retainer eligibility** (some merchants may offer monthly contracts)
- **4 concurrent campaigns** (pipeline more opportunities)

**Retention mechanic:** Proven creators feel "trusted." The merchant preference setting means they're working with better brands by choice, not by luck. The content review is high-touch and high-perceived-value at low cost (15 min/creator/month). The structured feedback form replaces ambiguous "co-design rights" with something concrete and non-conflictual.

---

#### Proven → Closer: "From Creator to Strategist"
**What Proven creators crave after reaching 65-78 score:**
- "Guidance and strategy" (become an expert)
- "Visibility within the platform" (become influential in the creator community)
- "Autonomy" (less hand-holding, more control)

**What Closer unlocks:**
- **Dedicated account manager** (Push assigns manager for strategy/growth coaching)
- **Exclusive merchant partnerships** (direct relationships; campaigns designed for them)
- **Can filter to only accept Pro merchant campaigns (NEW)** — full control over merchant quality
- **7% commission + $50 milestone bonus (at 60 txns/mo)**
- **Same-day payout** (instant gratification; money same business day)
- **6 concurrent campaigns** (can build sophisticated pipeline)
- **Strategy coaching sessions (NEW)** — manager advises on content strategy, audience growth, merchant fit
- **Leaderboard prominence** (featured as "top creator" in app)

**Retention mechanic:** Closer creators shift mindset from "I do campaigns" to "I'm building a media business." The dedicated manager is the key unlock — it's personalized, high-touch, and makes the creator feel valued. Filtering to Pro-only merchants means every campaign is premium. This tier is where creators start thinking about 6-12 month partnerships with specific merchants.

---

#### Closer → Partner: "From Creator to Co-Brand"
**What Closer creators crave after reaching 78-88 score:**
- "Influence over the platform" (stake, co-ownership feeling)
- "Industry recognition" (be known beyond Push)
- "Legendary status" (be the face of Push)

**What Partner unlocks:**
- **Co-branding rights** (creator brand + merchant brand + Push brand on campaigns)
- **Advisory access to platform roadmap (NEW)** — monthly product feedback sessions with founding team, priority beta access to new features. Replaces "platform governance/voting" (which is impractical at early stage with 1-2 Partners). Voting mechanism activates when Partner count reaches 10+.
- **Exclusive merchant partnerships (1-3 merchants) (NEW)** — can lock in exclusive relationships
- **10% commission + $80 milestone bonus (at 80 txns/mo)** (maximum earning potential)
- **Instant payout** (money to account within hours)
- **8 concurrent campaigns** (effectively unlimited; manage own portfolio)
- **Campaign veto with feedback** — can decline campaigns with structured reason (feeds back into platform matching algorithm)
- **Quarterly business review (NEW)** — Push team presents Partner's performance data, growth trajectory, and strategic recommendations
- **Media features** (Push highlights Partner creators in press, podcast, case studies)
- **Annual Partner dinner/offsite** (exclusive community event; activates when 5+ Partners exist)

**Retention mechanic:** Partner creators are co-founders in spirit. Advisory access (not governance votes) gives them real influence without slowing product iteration. Exclusive merchant partnerships create long-term lock-in. They're earning 3-4x what they made as Operators. Retention here is about community, legacy, and co-growth.

---

## Education & Growth Benefits Summary (NEW Section)

| Tier | Education/Growth Benefit | Cost to Push | Perceived Value |
|---|---|---|---|
| Seed | Welcome kit: "Your First Campaign" checklist + 3 example posts | Near zero (one-time content) | Medium |
| Explorer | Content Creation Guide + Best Practices Library + Referral Analytics Dashboard | Near zero (automated) | **High** |
| Operator | Data Literacy Tutorial (optimize posting, understand referral data) | Low (one-time content) | Medium-High |
| Proven | Monthly 1-on-1 content review (~15 min/creator) | Medium (time) | **Very High** |
| Closer | Dedicated manager + strategy coaching sessions | High (headcount) | **Very High** |
| Partner | Quarterly business review + media features | Medium (time) | **Very High** |

**Strategic rationale:** Education benefits directly improve content quality → merchant satisfaction → creator score → tier progression → more campaigns → more merchant value. They create a virtuous cycle at near-zero marginal cost (especially Seed-Operator). And they differentiate Push from every other creator platform that only offers money.

---

## Retention Metrics (How to Measure)

| Metric | Target | Why It Matters |
|---|---|---|
| **Week 1 retention (Seed→1st campaign completion)** | 80%+ | Are first campaigns engaging? |
| **Month 1 retention (≥2 campaigns)** | 60%+ | Are creators seeing value? (Updated: threshold lowered from 3 to 2 campaigns) |
| **Explorer→Operator promotion rate** | 40%+ | Are creators earning commission? |
| **Milestone bonus hit rate (Operator+)** | 30%+ | Are referral milestones achievable? |
| **Avg campaigns/creator/month** | 2+ | Are creators active and engaged? |
| **Rebook rate (merchants rehire same creator)** | 40%+ | Are creator-merchant relationships working? |
| **Tier progression velocity (months to Operator)** | <2 months | How fast do creators see growth? |
| **Churn rate (inactive 90+ days)** | <15% | Are we keeping engaged creators? |

---

## Retention Levers (What to Pull If Metrics Slip)

| Problem | Solution |
|---|---|
| **Low Seed→Explorer conversion** | Increase upgrade bonus from $5 to $10; send "1 campaign away!" reminder after 1st completion |
| **Low Explorer→Operator promotion** | Make milestone bonus terms visible on dashboard; add "commission simulator" showing projected earnings |
| **High churn at Operator** | Adjust milestone threshold downward (30 → 20 txns); add campaign filtering tutorial |
| **Low milestone bonus hit rate** | Lower thresholds by tier; add "halfway there" notification at 50% of milestone |
| **Low rebook rates** | Improve creator feedback to merchants; add "creator notes" to campaigns |
| **Tier progression stalling** | Run "score boost" events; make scoring formula more transparent |
| **Low engagement on leaderboard** | Gamify tiers; add weekly/monthly bonus for top performers |

---

## Recruitment-to-Retention Funnel (Full Lifecycle) — Updated v4.1

```
Week 0-2: Outreach (100 DMs)
  ↓ 10-15% conversion
Week 2-3: Seed campaign 1 (15-20 creators)
  ↓ 80% complete first campaign
Week 3-5: Seed campaign 2 + $5 upgrade bonus (12-16 creators)
  ↓ 60% score ≥ 40 (auto-promote to Explorer)
Month 2: Explorer campaigns (10-14 creators) — analytics dashboard unlocked
  ↓ Campaign 3-4; commission path visible
Month 2-3: First Operator tier creators — milestone bonus trackable
  ↓ Commission + milestone unlocked; engagement spikes
Month 3+: Sustained engagement + tier progression cycle
```

**Success definition:** 1 Operator-tier creator by month 3; 3-5 by month 6; 10+ by month 12.
