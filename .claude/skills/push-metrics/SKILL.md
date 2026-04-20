---
name: push-metrics
description: "Push KPIs, dashboard framework, data model, cohort analysis, decision rules, and experiment design. Use for any metrics, analytics, or data question."
---

# Push Metrics & Data — Complete Reference

## 1. North Star Metric
**Verified repeat campaign value per active merchant cohort**
Combines: retention + delivery quality + verified outcomes. If this number grows, Push is winning.

## 2. Merchant Metrics

### Activation
- Onboarding completion rate
- First campaign creation rate
- Time-to-first-campaign

### Quality
- Approval turnaround time
- Dispute rate
- Merchant satisfaction score

### Retention (Most Important)
- Second-campaign rate (THE key PMF signal)
- 30-day repeat rate
- 60-day repeat rate
- Campaigns per merchant per month
- Revenue per merchant

## 3. Creator Metrics

### Activation
- Onboarding completion rate
- Time-to-first-approval
- Time-to-first-campaign-completion

### Quality
- Completion rate (target: 85%+)
- Proof rejection rate
- Average merchant content rating
- Reliability score

### Retention
- Second-campaign rate
- 30-day repeat rate
- Tier progression rate
- Score trajectory

## 4. Campaign Metrics
- Time-to-fill (target: <48h)
- Fill rate (target: >80%)
- Standby usage rate
- Standby conversion rate
- Completion rate
- Verification completion rate
- Payout completion rate
- Dispute density per campaign
- Manual intervention rate

## 5. Integrity Metrics
- Fraud flag rate
- False positive rate
- Suspicious redemption rate
- Settlement hold rate
- Review-to-resolution time

## 6. Economic Metrics
- Subscription revenue (MRR)
- Campaign fee revenue
- Take-rate revenue
- Support cost per campaign
- Contribution margin per campaign
- Average revenue per merchant (ARPM)
- LTV / CAC ratio

## 7. Four Decision Rules

### Rule 1: Low Repeat + High Fill
= **Outcome quality problem.** Campaigns fill but merchants don't come back → the results aren't good enough. Fix: improve matching, tighten creator quality gates.

### Rule 2: High Signups + Low Completion
= **Supply quality problem.** Lots of creators join but don't deliver. Fix: better screening, clearer expectations, score incentives.

### Rule 3: High Standby + Quality Drop
= **Screening too weak.** Standby fills slots but with lower quality creators. Fix: tighter standby qualification, maintain minimum score for standby.

### Rule 4: Support Load Rising Faster Than Campaigns
= **Workflow scaling issue.** Ops cost growing non-linearly. Fix: automate verification, improve SLA auto-actions, reduce ambiguity.

## 8. PMF Signal Definition
**Merchants run campaigns repeatedly without being pushed.** This is the ONLY real PMF signal. Not signups, not creator count, not campaign volume — unprompted merchant repeat.

## 9. Dashboard Structure

### Ops Dashboard (Daily)
- Active campaigns status
- Overdue proofs
- Pending verifications
- Payout queue
- Fraud flags
- Fill rate by zone

### Growth Dashboard (Weekly)
- New merchants / creators
- Repeat rates
- NPS scores
- Revenue trends
- Zone density

### Strategic Dashboard (Monthly)
- North Star metric trend
- Cohort retention curves
- Unit economics
- LTV/CAC
- Expansion readiness signals

## 10. Cohort Analysis Framework
- Merchant cohorts by signup month → track repeat rate, revenue per merchant, LTV
- Creator cohorts by signup month → track completion rate, tier progression, score trajectory
- Campaign cohorts → track fill rate, completion, merchant satisfaction over time

## 11. Experiment Design
- Always have a hypothesis: "We believe [change] will cause [metric] to [increase/decrease] by [amount]"
- Minimum sample: 10 campaigns per variant (small scale → qualitative signals)
- Measure: primary metric + guardrail metrics (don't improve one thing while breaking another)
- Decision: pre-commit to what success looks like before running

## 12. Data Model (Core Entities)

### Users
- Merchant: id, name, location, category, tier (Starter/Growth/Pro), subscription_status
- Creator: id, name, handles, location, push_score, tier (Seed→Partner), active_status

### Campaigns
- id, merchant_id, type, goal, offer, slots, date_range, status, standby_enabled

### Applications
- id, campaign_id, creator_id, status (applied/accepted/standby/completed/cancelled)

### Proofs
- id, application_id, type (visit/content/redemption), submitted_at, verified, confidence_level

### Transactions
- id, campaign_id, creator_id, consumer_referral_id, amount, qr_scan_timestamp

### Scores
- creator_id, completion_score, reliability_score, quality_score, satisfaction_score, engagement_score, total_push_score, tier

### Payouts
- id, creator_id, campaign_id, amount, status, initiated_at, completed_at
