---
name: push-campaign
description: "Push campaign design, workflow architecture, operations, SLAs, dispute resolution, and settlement. Use for any campaign, workflow, or operations question."
---

# Push Campaign & Operations — Complete Reference

## 1. Workflow Design Principles
A Push workflow must be: fast to understand, hard to misuse, easy to repeat, measurable at every stage, resilient against drop-off and fraud, capable of producing better data over time.

## 2. Merchant Workflow (6 Stages)

### Stage 1: Onboarding
Capture: business name, location, category, hours, fulfillment capacity, payment setup
**Intelligence capture:** preferred demand windows, average order value, high-margin products, capacity constraints, repeat customer goal, preferred creator categories

### Stage 2: Goal Selection
Merchant chooses business objective:
- Drive new visits / Increase weekday traffic / Launch new item / Fill event attendance / Fill underperforming slots / Generate local awareness with redemption

**Templates convert goals into structured campaigns:**
- Trial Offer Campaign
- Off-Peak Fill Campaign
- Soft Launch Campaign
- New Product Sampling Campaign
- Event Attendance Boost Campaign

### Stage 3: Campaign Structuring
Define: offer, payout type, slots, date range, creator requirements, verification method, approval rules, standby enabled (Y/N), **campaign difficulty tier** (Standard/Premium/Complex)

**Two-Tier Promotional Offer Setup (v4.1):**
1. **Hero Offer** (high-value, limited slots): Merchant selects from 5/10/15/20 free or deeply discounted items
2. **Sustained Offer** (lower-value, wider reach): Merchant sets ongoing discount (e.g., 15% off, $2 off) for all referral holders after Hero slots fill

Platform pre-suggests defaults based on merchant plan + category:
- Starter merchants: 5 Hero slots + 15% Tier 2 (~$40-60 promo cost)
- Growth merchants: 10 Hero slots + 20% Tier 2 (~$80-120 promo cost)
- Pro merchants: 15-20 Hero slots + custom Tier 2 (~$120-200 promo cost)

**Campaign Difficulty Multiplier** (determines creator base pay):
| Difficulty | Multiplier | Criteria |
|-----------|-----------|---------|
| Standard (1.0x) | Default | Single-post story, simple check-in |
| Premium (1.3x) | +30% base | Reel/TikTok, multi-location, weekend |
| Complex (1.6x) | +60% base | Video series, event coverage, multi-day |

Difficulty is platform-assigned based on campaign requirements. Merchant cannot override downward.

### Stage 4: Candidate Routing
Surface creators through: application, algorithmic matching, standby pool, category fit, geographic proximity, credit score compatibility

**Bidirectional tier matching (v4.1):**
- Merchant plan determines which creator tiers are available (Starter: Seed-Operator, Growth: all, Pro: all + invite)
- Creator tier preference determines which merchant plans they accept (Proven+: can prefer Growth+, Closer+: can filter to Pro-only)
- Platform respects both sides when presenting ranked candidates

**Proven+ Structured Feedback (v4.1):**
- Proven and above creators can submit a Campaign Feedback Form when accepting: preferred time slot, product focus, content angle suggestions
- Merchant sees suggestions in dashboard but is not obligated to adopt
- Replaces vague "co-design rights" with actionable, non-conflictual mechanism

Present ranked candidates with rationale (fulfillment history, local fit, category match, reliability)

### Stage 5: Execution
Milestone states (the core tracking system):
1. **Accepted** — Creator confirmed
2. **Scheduled** — Date/time locked
3. **Visited** — QR scan confirms arrival
4. **Proof Submitted** — Content/evidence uploaded
5. **Content Published** — Live on platform
6. **Verified** — Meets all requirements
7. **Settled** — Payout completed

### Stage 6: Review & Repeat
Merchant receives: creator-level results, campaign summary, repeat recommendation, next campaign suggestion, standby fill insights, underused time-slot suggestions
**Always turn completion into the seed of next campaign.**

## 3. Creator Workflow (5 Stages)

### Stage 1: Onboarding
Capture: platform handles, content categories, geography, availability, transport radius, preferred campaign types, schedule constraints

### Stage 2: Opportunity Discovery
Via: live map, ranked campaign feed, standby alerts, category queue, tier-qualified pool
Feed answers: What can I do now? What pays best near me? What closes soon? What am I one tier away from unlocking?

### Stage 3: Application or Standby
Apply normally, enter standby, bookmark, compare eligibility gaps
Standby must feel strategic, not random.

### Stage 4: Fulfillment
Visit → capture proof → follow content requirements → publish → submit evidence
Tools: checklist format, deadline visibility, proof examples, disqualification rules, auto-reminders

### Stage 5: Settlement & Progression
Payout initiated → score updates → tier progress updates → future campaign unlocks change
Completion must feel like progression, not just closure.

## 4. Platform Ops Workflow

Monitor: fill rate, standby conversion, no-show rates, merchant/creator repeat rates, dispute density, fraud anomalies, time-to-fill, time-to-verify

Exception flags dashboard: overdue proof, suspicious redemption spike, repeat merchant dissatisfaction, creator reliability drop, region with weak supply

## 5. SLA Framework

### Merchant SLAs
| Stage | SLA | If Exceeded |
|-------|-----|-------------|
| Campaign setup (draft → published) | 48h | Reminder + setup assistance |
| Creator application review | 24h | Auto-approve top-scored applicants |
| Proof/completion confirmation | 24h | Auto-approve if meets standard criteria |
| Post-campaign feedback | 48h | Defaults to "satisfactory" |

### Creator SLAs
| Stage | SLA | If Exceeded |
|-------|-----|-------------|
| Campaign acceptance after match | 12h | Slot opens to next/standby |
| Visit completion | Per deadline (3-5 days) | Warning at 50%; auto-cancel at deadline +24h |
| Proof submission after visit | 24h | Reminder + score warning |
| Content publication after approval | 48h | Final reminder; non-completion recorded |

### Platform Ops SLAs
| Stage | SLA | If Exceeded |
|-------|-----|-------------|
| Dispute acknowledgment | 4h (business hours) | Auto-escalate to priority |
| Dispute resolution | 48h | Senior review + notify parties |
| Creator payout after verification | 24h | Auto-process if no fraud flags |
| Fraud flag review | 24h | Settlement held; parties notified |

## 6. Standby Mechanism
When a creator drops out last-minute:
- Notify nearby qualified creators: "🚨 [Merchant] has an open slot for tomorrow. $30 + free items. Accept within 2 hours."
- Dynamic: adjust visibility, lower tier threshold, expand geo range if needed
- Increases: fill rate, engagement, urgency, merchant confidence

## 7. Campaign Types & Templates

### Standard Templates
| Template | Goal | Typical Offer | Slots |
|----------|------|--------------|-------|
| Trial Offer | New customer acquisition | Free item + discount | 3-5 creators |
| Off-Peak Fill | Fill slow hours | Time-limited discount | 2-3 creators |
| Soft Launch | Test new product/location | Exclusive early access | 5-8 creators |
| Event Boost | Drive event attendance | VIP access + product | 3-5 creators |
| Awareness | Local brand awareness | Product sampling | 5-10 creators |

## 8. Dispute Resolution Process
1. Either party raises dispute
2. Platform acknowledges within 4 hours
3. Evidence collection (proof, communication records, QR data)
4. Resolution within 48 hours
5. Score impact applied per outcome (see push-creator skill for dispute impact table)
6. Appeal process available for severe cases

## 9. 20x Flow vs Basic Marketplace
**Basic:** Merchant posts → Creator applies → Accept → Content → Maybe payment
**Push 20x:** Merchant goal → Structured campaign → Ranked routing → Verified milestones → Settlement → Data feedback → Repeat optimization

The workflow itself is the moat.

## 10. v4.1 Change Summary
Key changes from v3.0 → v4.1 affecting campaigns:
- **Two-Tier Offer System** replaces flat "first X free" model; merchants configure Hero + Sustained offers
- **Campaign Difficulty Multiplier** (Standard/Premium/Complex) determines creator base pay
- **Bidirectional tier matching** — creators (Proven+) can set merchant plan preferences
- **Structured Campaign Feedback Form** for Proven+ creators replaces "co-design rights"
- **Milestone bonus tracking** integrated into campaign settlement flow
- **Seed upgrade reduced** from 3 campaigns to 2 campaigns + $5 bonus on 2nd completion
