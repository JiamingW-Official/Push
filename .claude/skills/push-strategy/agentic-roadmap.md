# Agentic Roadmap — Push 2026–2027

## Why Agentic

**SaaS Winter Context:**
The commoditization of features by general AI (ChatGPT, Claude, Gemini) kills software differentiation. Pure "software company" positioning dies.

**Push's Survival:**
Push survives because it sells **outcomes** (verified customers acquired), not software seats. AI amplifies Push's outcome engine rather than replacing it. Competitors copying features get undermined by AI; Push compounds through data and autonomous execution.

**Position:** Push is not "a SaaS tool with AI sprinkled on." Push is "AI infrastructure for local creator commerce," where AI is the execution layer, not the product wrapper.

---

## Phase 0: Manual Loop + AI Assist (NOW — MVP validation)

### What We Do
- Run the entire loop manually with 1 merchant + 5 creators
- Use AI internally for briefs, analysis, reporting, merchant comms
- Validate: Does the core loop (campaign → execution → attribution → payout) work?
- Do NOT claim "AI-powered" until the loop is proven

### Why This Phase Exists
Features without outcome proof are expensive theater. Merchants care about results, not "AI." Validate manually first so when we automate, we automate something real.

### Exit Criteria
- 50+ completed campaigns
- Unprompted merchant repeat + documented ROI
- Operations cost baseline established
- Fraud patterns mapped
- Creator scoring model defined

---

## Phase 1: AI-Verified Attribution (After 50+ campaigns, PMF signal)

### What Changes
Multimodal AI auto-verifies:
- **Content quality check:** Does the post exist? Does it mention the offer?
- **Proof of visit:** QR scan → multimodal AI confirms merchant visit (photo, receipt match, geolocation consistency)
- **Fraud detection:** Automated flagging of suspicious patterns (repeat accounts, impossible geolocation)

### Why This Phase Matters
Attribution verification is the largest ops cost (manual review, disputes, chargebacks). AI reduces this cost by 60–80% while improving accuracy.

### AI Capabilities in Phase 1
| Task | Verification | Approach |
|------|--------------|----------|
| Content Verification | Creator posted offer-compliant content | Image recognition + OCR on post |
| Visit Proof | Consumer visited merchant | QR photo → location + receipt pattern matching |
| Fraud Detection | Repeat abuse, bot farms, manipulation | Geolocation clustering, account velocity, device fingerprinting |
| Dispute Resolution | Quick triage of customer complaints | Automated rejection of low-confidence claims, escalate high-value |

### Framing
"Push uses AI verification to protect merchants from fraud and creators from false disputes."

### Exit Criteria
- Auto-verification confidence >85%
- Ops cost reduced by 40%+
- Zero increase in false negatives

---

## Phase 2: Agent-Powered Matching (After 500+ campaigns, scoring model trained)

### What Changes
- Matching agent trained on **real performance data**
- Agent learns: Which creator types convert best for which merchant categories, offers, times of day
- Merchant submits goal → agent proposes matching slate automatically

### Why This Phase Matters
Merchants currently choose creators by guessing. A trained matching agent compounds with every campaign, improving conversion rates and merchant retention.

### AI Capabilities in Phase 2
| Task | ML Model | Training Data |
|------|----------|---------------|
| Creator Selection | Multi-armed bandit + performance ranking | Historical conversion, category fit, time-of-day patterns |
| Offer Design | Campaign template recommendation | Successful offer structures by category/season |
| Pricing Suggestion | Dynamic pricing agent | Commission rate that balances merchant spend and creator acceptance |
| Timing Prediction | Campaign schedule optimization | Historical merchant patterns, local seasonality |

### Data Moat Deepens
After 500 campaigns, competitors starting from zero cannot replicate this data. Each merchant onboard feeds proprietary learning.

### Framing
"Push tells you which creators will bring the best results for your offer."

### Exit Criteria
- Matching accuracy >70% (conversion target within 10% of predicted)
- Merchant satisfaction same or higher than manual matching
- Recommendation adoption rate >60%

---

## Phase 3: Autonomous Campaign Engine (Ultimate form — Year 2+)

### What Changes
- Merchant sets goal: "I want 100 new customers for [offer] this week"
- Agent auto-orchestrates: **matching → brief → execution → verification → payout → reporting**
- Creator workflow: Agent plans earning schedule, notifications, brief, payout timing
- Real-time dashboard replaces email comms

### Why This Phase Matters
This is the **"Tell us how many customers. Push handles the rest."** positioning—infrastructure, not a tool.

### AI Responsibilities in Phase 3
| Stage | Agent Task | Autonomy |
|-------|-----------|----------|
| **Design** | Auto-create merchant brief, offer structure, positioning | >90% unsupervised |
| **Matching** | Select creator slate, predict acceptance, manage standby pool | >95% unsupervised (exception: unusual merchant) |
| **Execution** | Real-time creator briefs, deadline reminders, format feedback | >80% unsupervised |
| **Verification** | Multi-layer fraud check, payout release, dispute triage | >90% unsupervised (human review for edge cases) |
| **Optimization** | Post-campaign analysis, pricing adjustment, next-campaign recommendation | >95% unsupervised |

### Human Fallback
- Unexpected merchant requests (custom category, unusual geography)
- High-value disputes (>$10K impact)
- Systemic fraud patterns (new attack vector)
- Creator grievances (appeal process)

### Framing
"Push is the autonomous performance loop for local creator commerce."

### Exit Criteria
- End-to-end campaign execution <4 hours human time per campaign
- Autonomous decision rate >90%
- No degradation in conversion rates vs Phase 2

---

## Transition Triggers (Clear Gates)

| Gate | Condition | Evidence |
|------|-----------|----------|
| **Phase 0 → 1** | 50+ campaigns completed + unprompted merchant repeat + operational cost baseline | Repeat merchant NPS >40, 2+ merchants run 3+ campaigns |
| **Phase 1 → 2** | 500+ campaigns + scoring model convergence + ops cost stable | Model test accuracy >75% on hold-out set, ops margin stable |
| **Phase 2 → 3** | Matching accuracy >70% + merchant satisfaction maintained + 2000+ campaigns | Agent recommendations adopted >60%, conversion variance <15% |

---

## 5-Person Team AI Leverage

### Current Roles (Phase 0)
- **Jiaming (Strategy/Operations):** Brief creation, campaign design, merchant comms
- **Z (Engineering):** QR system, verification platform, data pipeline
- **Lucy (Creator Relations):** Creator outreach, performance feedback, dispute resolution
- **Prum (Merchant Ops):** Onboarding, ROI tracking, repeat workflows
- **Milly (Analytics/Brand):** Performance reporting, positioning, brand

### Phase 1 AI Leverage (Verification)
- Z: Maintains verification agents (image recognition, fraud detection)
- Lucy: Focuses on high-touch creator support instead of manual verification
- Prum: Focuses on merchant success instead of dispute triage

**Time freed:** ~10–15 hours/week per team (verification work → relationship work)

### Phase 2 AI Leverage (Matching)
- Jiaming: Focuses on merchant strategy, rare exceptions, positioning
- Z: Maintains matching agent, retrains monthly
- Lucy: Focuses on creator tier advancement, retention
- Prum: Focuses on repeat campaign workflow, expansion
- Milly: Analyzes emerging patterns, competitive moves, storytelling

**Time freed:** ~20–25 hours/week per team (manual matching → relationship building)

### Phase 3 AI Leverage (Autonomous)
- Jiaming: Merchant strategy, new market expansion, competitive response
- Z: Maintains autonomous engine, edge cases, new data sources
- Lucy: Creator development, tier progression, support escalations
- Prum: Merchant expansion, account health, churn prevention
- Milly: Insights mining, narrative building, board communication

**Time freed:** ~30–40 hours/week per team (campaign execution → strategic work)

**Key Principle:** AI doesn't replace people. It replaces *drudgery*. Team grows into relationship, strategy, and expansion work.

---

## Risk Mitigation per Phase

### Phase 0 Risks
- Loop doesn't work manually → too many friction points
- **Mitigation:** Run 5 end-to-end campaigns before investing in Phase 1

### Phase 1 Risks
- AI verification creates new fraud vectors (gamed AI, synthetic content)
- **Mitigation:** Layer verification (AI + human spot-check 10%), maintain fraud playbook

### Phase 2 Risks
- Agent recommends bad matches → merchant blames Push
- **Mitigation:** Confidence thresholds (only recommend >70% models), maintain human override

### Phase 3 Risks
- Autonomous execution scales before quality degrades
- **Mitigation:** Pause scaling at first satisfaction drop >5%, revert to Phase 2
