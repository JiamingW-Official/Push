# Cold Start 12-Week Plan

Complete detailed roadmap for launching Push in one neighborhood zone over 12 weeks, with budget and MVP tech stack.

---

## Phase 1: Foundation (Week 1–4)

### Week 1: Zone Selection & Merchant Scouting

**Monday–Tuesday: Pick ONE neighborhood**
- Decide between NYC (Williamsburg, LES, Astoria), LA, or SF zone
- Lock in by EOD Tuesday

**Wednesday–Friday: Walk and scout 30 merchant prospects**

For each prospect, capture:
- Name, address, Instagram handle
- Category (café, dessert, beauty, etc.)
- Visual score (1–5): is it Instagram-friendly?
- Dead hours: when is it slowest? (best time to pitch)
- Owner-operated? (Y/N — if yes, you can talk to decision-maker immediately)
- Current creator activity: any partnerships, tags, posted content?

**Saturday–Sunday: Research 50 creator prospects**

Search tactics:
- Instagram location tags for the neighborhood
- Hashtags: #[neighborhood]eats, #[neighborhood]food, local food/lifestyle hashtags
- TikTok: same hashtags and location tags
- TikTok trends: see who's trending in the category

For each creator, capture:
- Handle, platform (IG/TikTok)
- Follower count
- Engagement rate (likes + comments / followers)
- Content quality (1–5): production value, consistency, authenticity
- Location relevance: do they feature local spots? Are they local?

**End of Week 1 Output:**
- 30 merchant prospects with contact info and dead hours
- 50 creator prospects with handles and engagement metrics

---

### Week 2: First Merchant Conversations (15 conversations → 8 soft commits)

**Approach: Walk-in pitch during slow periods**

Timing: Tuesday–Thursday, 2–4pm (dead hours)

**Script:**
1. Walk in, order something small
2. Wait for order to be ready
3. Ask to speak to owner/manager
4. Once you have them:
   - "Hey, [name]. Love what you're building here. We help local shops like you get new customers through local food creators. We match you with creators in the neighborhood, manage everything, track results, and you only pay if it works."
   - "Want to try it? First campaign is free. You literally just tell us what you'd offer creators, and we handle the rest."

**Remove ALL friction:**
- Free first campaign (no credit card)
- You handle everything (matching, logistics, tracking)
- Zero time burden on merchant

**For each conversation, capture:**
- Owner/manager name and preferred contact (phone/email)
- Current challenges: new customers? Off-peak traffic? Launch event?
- What they'd offer creators (discount, free product, bundle, etc.)
- What success means to them (foot traffic? Instagram mentions? sales lift?)
- Dead hours (confirm)
- Willingness to try (yes/soft yes/no)

**Soft commits:** Goal is 8 merchants who say "yeah, sure, let's try it" or "I'm interested, tell me more"

**End of Week 2 Output:**
- 8 soft-commit merchants with contact info and offer preferences
- Documented pain points and success metrics for each

---

### Week 3: Creator Outreach + Website MVP

**Creator Outreach: Goal 20 signed-up creators**

**DM Script (customize per creator):**
- "Love your [specific post about local spot] 🔥 Launching Push — it connects local creators like you with shops for paid campaigns. We just matched [X] creators with [shop name]. Interested?"
- Link to landing page / creator signup form
- If they engage: "Here's how it works: [brief 1-min explainer]. Sound good?"

**Creator Signup Form should ask for:**
- Name, email, phone
- Instagram/TikTok handles + follower count
- Location (neighborhood focus)
- Category preference (food, beauty, etc.)
- Availability (how often can they post?)
- Payment method preference (Venmo, Zelle, direct deposit)

**Website MVP: Minimal but functional**

Core pages:
1. **Landing page** — 1 min explainer (hero, problem, solution, CTA)
2. **Merchant signup form** — name, email, address, category, initial offer
3. **Creator signup form** — (see above)
4. **Campaign listings** — show available campaigns with details (shop, offer, slots, deadline)
5. **Admin dashboard** (private) — list all merchants, creators, campaigns, and basic status tracking

**Tech Stack (MVP):**
- Frontend: Next.js (React) + Vercel (free tier)
- Database: Supabase free tier (PostgreSQL) or Airtable
- Auth: Supabase Auth or email magic links
- Hosting: Vercel (auto-deploys from GitHub)

**Timeline:**
- Days 1–2: Set up Next.js project, GitHub, Vercel
- Days 3–4: Build landing page + forms
- Days 5–7: Set up database, admin dashboard, campaign listings page
- Go live by EOW

**End of Week 3 Output:**
- 20+ creators signed up
- Website live (all forms working, admin dashboard functional)

---

### Week 4: Campaign Setup + Dry Run

**Set up 5 campaigns manually**

For each campaign, define:
- **Merchant:** name, offer (what creators get)
- **Deliverables:** 1 Instagram post + 1 Story? 1 TikTok video? 2 posts? (be specific)
- **Proof requirements:** screenshot of post, video proof, link to post
- **Number of slots:** 2–3 creators per merchant
- **Deadline:** when must creator complete by?
- **Creator instructions:** "Tag the shop in your post. Use hashtag #pushcampaign"

**Creator matching:** For each slot, match by:
- Proximity (do they feature the neighborhood?)
- Style fit (their content tone matches the brand)
- Category (if dessert shop, feature food creators)
- Availability

**Do 1–2 campaigns yourself as dry run**
- Pick 1 merchant + 2 creators
- Go through entire flow: send brief, collect proof, verify, pay
- Document every step
- Ask merchant for feedback (did creators deliver? Quality of content?)

**End of Week 4 Output:**
- 5 campaigns set up and assigned to creators
- 1–2 test campaigns complete
- Full documented flow from brief → completion → payment

---

## Phase 2: First Campaigns (Week 5–8)

### Week 5–6: Execute First Batch

**Run 5 merchants × 2–3 creators = 10–15 slots**

**Daily ops rhythm:**
- **AM:** Review overdue proofs (DM creators if late)
- **Midday:** Review and approve submissions (tag and share with merchant)
- **PM:** Track publications (see if posts are up, engagement starting)
- **Evening:** Log everything in a spreadsheet (creator, merchant, campaign, completion status, payout amount)

**After each campaign:**
- Pay creator within 24h (Venmo/Zelle)
- Email merchant: "Your campaign is live. Here's the link to [creator's post]. We'll track performance through [date]."
- Send quick survey to merchant: How was the quality? Would you run again?
- Send quick survey to creator: Any issues? Want to run again?

**Tracking spreadsheet columns:**
- Campaign ID
- Merchant name
- Creator handle
- Offer (what creator received)
- Deliverable (posts/videos)
- Due date
- Completion date
- Quality (1–5)
- Merchant feedback
- Creator feedback
- Payout amount
- Status (completed / late / rejected)

**End of Week 5–6 Output:**
- 10–15 campaigns completed
- 100% of creators paid within 24h
- Feedback collected from merchants and creators
- Clear view of which merchants/creators performed best

---

### Week 7–8: Second Batch + First Improvements

**Launch 5–8 more campaigns**

Include at least 2+ repeat merchants from batch 1 (this is KEY — repeat is signal of success)

**Track these metrics obsessively:**
- **Merchant repeat rate:** What % of merchants from batch 1 are running a 2nd campaign?
- **Creator repeat rate:** What % of creators from batch 1 want to do another campaign?
- **Time-to-fill:** How long does it take to fill all slots for a campaign?
- **Completion rate:** What % of creators finish on time?
- **Content quality:** Are submissions getting better or worse?

**Iterate website based on learnings:**
- Add simple **creator profile page** (follower count, engagement rate, past campaigns, merchant feedback score)
- Add **merchant dashboard** with basic reporting (# campaigns run, total creators, avg quality score)
- Add **campaign status tracker** (pending, in progress, completed)
- Add simple **creator scoring** (e.g., 1–5 stars based on merchant feedback)

**End of Week 7–8 Output:**
- 20+ total campaigns (batches 1 + 2)
- Merchant repeat rate visible (ideally 30%+)
- Creator repeat rate visible (ideally 60%+)
- Metrics dashboard showing:
  - 8+ merchants ran 1+ campaign
  - 15+ creators completed 1+ campaign
  - 3+ merchants ran SECOND campaign (repeat!)
  - Completion rate > 80%
  - Creator satisfaction > 4/5
  - Merchant satisfaction > 3.5/5

---

## Phase 3: Validate Repeat & Launch (Week 9–12)

### Week 9–10: Scale to 15 Merchants

**Acquire 5–7 more merchants**

Tactics:
- Referral: Email existing merchants: "Know any other shops that would want this? We'll take good care of them."
- Walk-in: Keep scouting new neighborhoods (same process as Week 1)
- Leverage case studies: "Look, [Merchant A] ran 5 campaigns and got [X] new customers. Interested?"

**Introduce basic creator scoring** (visible on creator profiles in admin)

Scoring rubric:
- Completion rate (did they finish on time?)
- Quality score (merchant feedback)
- Engagement rate (their posts got comments/likes)
- Reliability (did they show up when promised?)

**Introduce standby mechanism**

Standby queue: 5–10 creators on standby for each campaign. If a slot opens up (creator drops out), ping standby creators immediately. First to respond gets the gig. This will reveal:
- Response time (are they engaged?)
- Conversion (do standby creators take the gig?)
- Whether standby changes engagement levels

**End of Week 9–10 Output:**
- 15+ merchants total in pipeline
- Creator scoring system live
- Standby mechanism tested on 3–5 campaigns
- Data showing repeat rate, completion rate, conversion

---

### Week 11–12: Transition to Paid

**Pricing tiers (from push-pricing):**
- **Starter:** $19.99/mo
- **Growth:** $69/mo
- **Pro:** $199/mo

**Transition conversation (Week 11):**

Email to merchants who've run 2+ campaigns:
- "Great work, [name]. You've run [X] campaigns with [Y] creators, and we've tracked [results]. Up until now, the first campaign was free. Going forward, we're introducing paid plans so we can keep supporting you with better creator matching and performance tracking."
- "Starter plan is $19.99/mo and includes [X]. Want to give it a try?"

**Payment: Stripe subscription**
- Set up Stripe account
- Add subscription payment page
- Auto-generate monthly invoice
- Ensure payouts to creators happen regardless (never stiff a creator)

**First paid campaigns (Week 11–12)**

Goal: Get 2–3 merchants to convert to paid. This proves willingness to pay.

**End of Week 11–12 Output:**
- All metrics updated
- First 2–3 merchants on paid plans
- Verified that merchants will pay for better matching / dashboard / support
- Revenue flowing in (even if small)

---

## Week 12 Go/No-Go Decision

**Review all metrics against targets:**

| Metric | Target | Status |
|--------|--------|--------|
| Merchant repeat rate | 40%+ run 2+ campaigns | Go/No-go? |
| Creator completion rate | 85%+ | Go/No-go? |
| Time-to-fill | < 48 hours | Go/No-go? |
| Willingness to pay | 30%+ convert to paid | Go/No-go? |
| NPS | > 7/10 both sides | Go/No-go? |
| Total campaigns | 25+ | Go/No-go? |
| Revenue | Any (proves WTP) | Go/No-go? |

**Decision:**
- ✅ **GO:** repeat > 30%, completion > 80%, some WTP → Expand to next ZIP code
- ⚠️ **ITERATE:** one metric weak, others strong → Stay in zone, fix weak point (e.g., if completion is 70%, improve creator onboarding)
- ❌ **PIVOT:** no repeat, unreliable creators, zero WTP → Revisit value prop, pricing, or entire approach

If GO: Replicate exact playbook in next ZIP code (repeat Week 1–12 in new zone).

---

## Budget (12 Weeks)

| Item | Cost | Notes |
|------|------|-------|
| Creator payments (Phase 1, Week 1–4) | $750–1,200 | 20 creators × avg $40–60 per campaign |
| Creator payments (Phase 2, Week 5–8) | $600–1,000 | Increasing slots, potentially more creators |
| Creator payments (Phase 3, Week 9–12) | $400–800 | Reduced phase (focus on paid merchants) |
| Domain name | $10–12/yr | push.com, push.co, or pushapp.co equivalent |
| Vercel / Supabase hosting | Free–50 | Mostly free tier; maybe $10 for Vercel Pro if needed |
| Stripe account + processing | Free–50 | Stripe takes 2.9% + $0.30 per transaction |
| Scouting expenses | $200 | Transport, coffee meetings, meals |
| Miscellaneous | $200 | Supplies, unexpected costs |
| **Total** | **~$2,400–3,500** | Conservative estimate with buffer |

---

## MVP Tech Stack

### Frontend
- **Framework:** Next.js (React)
- **Styling:** Vanilla CSS (Follow Design.md sharp corners requirement)
- **Hosting:** Vercel (free tier, auto-deploys from GitHub)
- **Cost:** Free

### Backend / Database
- **Database:** Supabase (PostgreSQL, free tier) OR Airtable (if faster to launch)
- **Auth:** Supabase Auth (email magic links) or simple email verification
- **API:** Next.js API routes (serverless functions)
- **Cost:** Free tier sufficient

### Payments & Comms
- **Creator payouts (early):** Venmo, Zelle, direct deposit
- **Merchant billing (later):** Stripe subscription
- **Email:** SendGrid free tier (100/day)
- **SMS (optional):** Twilio free trial
- **Cost:** Free until scale

### Analytics & Logging
- **Metrics:** Google Analytics (free, on website)
- **Campaign tracking:** Manual spreadsheet + database queries
- **Logging:** Console logs, Vercel logs
- **Cost:** Free

### Essential Pages & Functions

**Merchant-facing:**
1. Landing page (problem, solution, CTA to signup)
2. Signup form (shop details)
3. Dashboard (past campaigns, results, available campaigns)
4. Campaign detail (creators assigned, proofs, status)

**Creator-facing:**
1. Landing page (opportunity, how it works)
2. Signup form (handles, follower count, availability)
3. Campaign feed (available opportunities, slots, deadlines)
4. Campaign detail (merchant, offer, deliverables, submit proof)
5. Profile page (past campaigns, score, earnings)

**Admin (you):**
1. Merchant management (list, status, campaigns)
2. Creator management (list, status, score)
3. Campaign management (create, assign, track)
4. Manual payout tracker
5. Metrics dashboard

**Defer to later:**
- Automated matching algorithm (do manually first)
- Automated payouts (use Stripe + Plaid API)
- Social login (use email first)
- Advanced analytics (export to Looker Studio later)
- Mobile app (web-only for MVP)

---

## Execution Tips

### Week 1–2: Move Fast
- Scouting is legs-on-ground work. Don't overthink. Get addresses, IG handles, talk to owners.
- First 10 merchant conversations are clunky. By conversation 15, you'll have tight talking points.

### Week 3–4: One Feature Per Day
- Website MVP can be rough. Forms can use Airtable embeds if you want to move faster.
- Don't over-build the admin dashboard. Spreadsheet + basic web form is enough.

### Week 5–12: Ops Discipline
- Log everything in a spreadsheet **same day.** Don't wait a week.
- Pay creators within 24h, every time. This builds trust.
- Ask merchants and creators for feedback on every single campaign. This is your gold.

### Expansion Readiness (Week 13+)
- Only expand when metrics hit targets. Premature expansion kills early zones.
- Replicate the exact same process in the next ZIP code.
- Hire a local ops person for zone 2 if you've proven the model works.
