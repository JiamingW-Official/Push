---
name: push-metrics
description: "Push KPIs, dashboard framework, data model, cohort analysis, decision rules, and experiment design. Use for any metrics, analytics, or data question."
---

# Push Metrics & Data — Complete Reference

## 1. North Star Metric (v5.2)

**Primary: Software Leverage Ratio (SLR) = Active Campaigns / Ops FTE**

### 1.1 Definitions (v5.2 authoritative)
- **Active Campaign** = campaign with `status IN ('live', 'scheduled-future', 'verifying')` AND NOT `('paused', 'cancelled', 'completed-final', 'draft')`. Campaigns in `verifying` state (customer scanned, awaiting verification) count for 48h then roll off.
- **Ops FTE** = Σ(ops_hours_logged in the month) / 160. Includes: founders' ops allocation (partial-FTE), W2 ops hires, 1099 contractors paid for ops tasks. Excludes: advisors, pure sales roles, eng, product, marketing (unless marketing is doing ops like verification review).
- **SLR** = monthly snapshot, computed on the last business day of each month.

### 1.2 Targets
| Window | Target | Rationale |
|---|---|---|
| Month 6 | ≥ 12 | Learning phase; tolerates high manual intervention rate |
| Month 12 | ≥ 25 | "Mid-stack AI-augmented ops" zone |
| Month 24 | ≥ 50 | ConversionOracle + DisclosureBot absorb ≥85% of routine work |

### 1.3 Why SLR (vs other North Stars)
SLR indexes the "vertical AI vs agency" differentiation. Agencies are labor-bound (SLR 3–5); pure-software platforms lack the verification depth Push sells (SLR 100+, but they don't guarantee outcomes). Push's target 25 at M-12 positions it as mid-stack: enough automation to avoid agency margin collapse, enough human oversight to enforce verification integrity.

### 1.4 SLR Decomposition
SLR = ActiveCampaigns / OpsFTE
    = ActiveCampaigns / [(CampaignsRequiringManualReview × AvgReviewHours + AutomatedCampaigns × AvgOversightHours + OnboardingLoad + DisputeLoad) / 160]

Levers (ranked by Month-12 impact):
1. **AutoVerification coverage** (ConversionOracle decision-without-human) — 40% impact on SLR
2. **Onboarding load per merchant** — 25% impact (first-month ops is heaviest)
3. **Dispute rate × avg dispute minutes** — 20% impact
4. **Merchant retention** (high retention = less new-merchant onboarding per active campaign) — 15% impact

**Secondary (retained from v4.x as health metric):** Verified repeat customer value per active merchant cohort. Measures whether delivered customers drive merchant LTV growth — prevents gaming SLR by inflating low-quality campaigns.

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

### 6.x Operations Metrics (v5.2)

- **Software Leverage Ratio (SLR):** active campaigns / ops FTE (monthly snapshot). North Star — see §1.
- **Auto-verification accuracy:** ConversionOracle precision + recall. Target: precision ≥ 92%, recall ≥ 88% at Month 12.
- **Manual intervention rate:** % of campaigns requiring human review. Target: ≤ 15% M-6, ≤ 8% M-12, ≤ 3% M-24.
- **DisclosureBot false-positive rate:** posts flagged but FTC-compliant / total flagged. Target: ≤ 5%.
- **Ops FTE utilization:** hours worked / 160 per month. Target: 60–85% (outside → under- or over-staffed).

### 6.x.1 Data Collection (Authoritative)
SQL reference for computing monthly SLR (run on last business day):

```sql
WITH active AS (
  SELECT COUNT(DISTINCT c.id) AS n
  FROM campaigns c
  WHERE c.status IN ('live','scheduled','verifying')
    AND (c.status != 'verifying' OR c.last_scan_at > now() - interval '48 hours')
),
ops AS (
  SELECT SUM(t.hours) / 160.0 AS fte
  FROM time_logs t
  WHERE t.role_category IN ('ops','verification','onboarding','disputes')
    AND t.logged_at >= date_trunc('month', now())
    AND t.logged_at < date_trunc('month', now() + interval '1 month')
)
SELECT active.n::numeric / NULLIF(ops.fte, 0) AS slr
FROM active, ops;
```

Data owner: ops lead (until we hire a data analyst). Review cadence: weekly (Mon); formal monthly snapshot on last business day.

### 6.x.2 Playbook — SLR below target
Diagnose gap first (which lever is under-performing). Then:

| Gap | First Lever | Action |
|---|---|---|
| AutoVerification < 70% at M-6, < 85% at M-12 | ConversionOracle tuning | Weekly precision/recall review; ML Advisor escalation if precision <88% |
| Onboarding hours > 8 hr/merchant | Merchant self-service | Ship onboarding wizard; shift 1 ops role to support-automation |
| Dispute minutes > 45 min/dispute | Dispute templates | Add decision tree to ops runbook; auto-resolve >60% of cases |
| Low merchant retention | Merchant Success | Weekly check-in calls for first 90 days; churn post-mortems |

If SLR < 50% of target for 2 consecutive months: **escalate to founder** for strategic review (is AI maturity insufficient? is hiring plan wrong?).

### 6.x.3 Competitor Benchmarks (estimated, internal use only)
| Company/Category | Est. SLR | Source/Method | Confidence |
|---|---|---|---|
| OpenTable (reservation ops) | ~300 | Reservations/month ÷ ops FTE, inferred from public financials | Low |
| DoorDash (dasher support ops) | ~50 | Annual active dashers ÷ reported ops/CX headcount | Medium |
| Whalar / creator marketplace | ~8-12 | Industry conversations; not validated | Very Low |
| Traditional marketing agency | 3-5 | Ogilvy/WPP industry norms, client:strategist ratio | Medium |
| **Push target M-12** | **25** | Internal plan | Plan (not yet validated) |

*Any competitor number must be flagged "estimated" in external comms until sourced to disclosed financials.*

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

**Note:** The SLR Monthly Trend chart should overlay the 4 decomposition levers (stack or companion chart) — not just a single line — so ops can see WHICH lever drove the change (AutoVerification coverage, Onboarding load, Dispute minutes, Merchant retention).

- North Star metric trend
- Cohort retention curves
- Unit economics
- LTV/CAC
- Expansion readiness signals
- **SLR Monthly Trend:** line chart of SLR across trailing 6 months, with 4-lever decomposition companion chart (stacked-area or small-multiples). Target band overlay on main line: M-6 ≥ 12 (yellow), M-12 ≥ 25 (green). Y-axis 0–60.
- **ConversionOracle Accuracy vs Target:** twin-line chart, precision and recall over trailing 12 weeks. Red floor line at 88%, green aspiration at 92%. Y-axis 80–100%.

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
