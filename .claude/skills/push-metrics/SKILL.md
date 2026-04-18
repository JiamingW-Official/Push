---
name: push-metrics
description: "Push KPIs (v4 + v5.0 AI-layer), dashboard framework, data model, cohort analysis, decision rules, and experiment design. Covers AI verification latency/accuracy, matching agent quality, v5.0 unit economics ($40/customer, ≤$28 CAC), and Williamsburg coffee beachhead metrics. Use for any metrics, analytics, or data question."
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

---

# v5.0 Additions — AI-Powered Acquisition Agency KPIs

All sections below are additive to the v4 metrics above. v4 KPIs remain valid.
Data sources: new tables `ai_verifications` (Vision/OCR/geo verdicts per receipt) + `agent_runs` (matching agent runs, proposed creators, predicted vs. actual outcomes) — see §18 data-model note.

## 13. AI Verification KPIs (v5.0)

Source: `ai_verifications` table. Latency measured scan-submit → final verdict emitted.

| Metric | Definition | Target | Owner | Cadence |
|---|---|---|---|---|
| `verification_latency_p50_ms` | Median scan-submit → verdict time | ≤ 6000 ms | Eng | daily |
| `verification_latency_p99_ms` | 99th-percentile latency | ≤ 12000 ms | Eng | daily |
| `auto_verified_rate` | % of receipts passing all 3 layers automatically | ≥ 75% | Ops | weekly |
| `auto_rejected_rate` | % of receipts auto-rejected (wrong merchant) | ≤ 3% (floor — too low = fraud slipping) | Ops | weekly |
| `manual_review_rate` | % of receipts routed to human review | 15–25% acceptable | Ops | weekly |
| `human_approve_rate` | % of manual-review resolved → human_approved | 60–80% (calibration signal) | Ops | weekly |
| `vision_cost_per_scan_usd` | Anthropic API cost per verified scan | ≤ $0.008 | Finance | monthly |

## 14. Matching Agent KPIs (v5.0)

Source: `agent_runs` table. One row per `/api/agent/match-creators` call.

| Metric | Definition | Target | Owner | Cadence |
|---|---|---|---|---|
| `match_latency_p50_ms` | Median agent response time | ≤ 30000 ms (30s) | Eng | daily |
| `match_latency_p99_ms` | 99th-percentile agent response time | ≤ 60000 ms (60s promise) | Eng | daily |
| `match_approval_rate` | % of proposed matches merchant approves without regenerate | ≥ 70% | Product | weekly |
| `regeneration_count_per_goal` | Regenerations before merchant approves | mean ≤ 1.3 | Product | weekly |
| `predicted_vs_actual_customers` | Delta: agent-predicted vs. realized `verified_customers` | mean abs % error ≤ 25% | Data | weekly |
| `matching_cost_per_campaign_usd` | Anthropic cost per match-creators call | ≤ $0.02 | Finance | monthly |

## 15. Unit Economics KPIs (v5.0)

Replaces v4 LTV/CAC framing for the v5.0 outcome-priced model ($0 Pilot + $500/mo min + $40/customer).

| Metric | Definition | Target | Owner | Cadence |
|---|---|---|---|---|
| `customer_acquisition_cost_usd` | Push's cost to deliver one AI-verified customer (creator payout + infra + ops) | ≤ $28 | Finance | monthly |
| `contribution_margin_per_customer_usd` | $40 revenue − CAC | ≥ $10 | Finance | monthly |
| `pilot_to_performance_conversion_rate` | % of Pilot merchants who cross customer 10 and flip to Performance | ≥ 80% | Growth | weekly |
| `performance_monthly_customer_volume` | Avg AI-verified customers per Performance merchant per month | ≥ 15 (avg; tuning signal) | Growth | weekly |
| `pilot_saturation_weeks` | Weeks for a Pilot merchant to reach customer 10 | ≤ 4 | Growth | weekly |

## 16. Beachhead KPIs — Williamsburg Coffee × 60 Days (v5.0)

Geography + category scoped. Retire once beachhead expands beyond Williamsburg coffee.

| Metric | Definition | Target | Owner | Cadence |
|---|---|---|---|---|
| `wburg_coffee_merchant_coverage` | Signed merchants / total Williamsburg coffee shops | ≥ 60% by week 12 | GTM | bi-weekly |
| `wburg_coffee_creator_coverage` | Active operators / 20-creator target | = 20 by week 4 | GTM | weekly |
| `wburg_weekly_verified_customers` | Total verified customers delivered per week in beachhead | wk1 = 50; wk8 = 200 | GTM | weekly |

## 17. Decision Rules — v5.0 Thresholds

Supplements §7's four v4 rules. Each row is a tripwire: if threshold hits, execute the action.

| Metric | Trip Threshold | Action |
|---|---|---|
| `auto_verified_rate` | < 70% for 2 consecutive weeks | Escalate to Eng + pause auto-verify; route 100% to human until Vision prompt retuned |
| `auto_rejected_rate` | < 1% for 1 week (floor breach) | Audit for fraud slipping through; tighten merchant-match threshold |
| `auto_rejected_rate` | > 8% for 1 week | Loosen merchant-match threshold OR check merchant onboarding photos |
| `manual_review_rate` | > 30% for 1 week | Vision thresholds too strict → Ops + Eng tune confidence bands |
| `manual_review_rate` | < 10% for 2 weeks | Likely false confidence → sample 50 auto_verified scans, audit accuracy |
| `human_approve_rate` | < 50% | Vision is *wrong* not under-confident → retrain/reprompt, not retune |
| `verification_latency_p99_ms` | > 12000 ms | Eng page on-call; check Anthropic API status + rate limits |
| `vision_cost_per_scan_usd` | > $0.012 | Finance alert; switch to cheaper tier or batch |
| `match_latency_p99_ms` | > 60000 ms | Breaks 60s promise → Eng + Product incident; show cached suggestions fallback |
| `match_approval_rate` | < 50% | Product halt; matching agent prompt needs rework before more campaigns launch |
| `regeneration_count_per_goal` | mean > 2.0 | Agent proposing bad matches; audit `agent_runs` with regenerate_count ≥ 3 |
| `predicted_vs_actual_customers` | MAPE > 40% | Data freeze agent predictions in quote UI; recalibrate prediction model |
| `customer_acquisition_cost_usd` | > $32 | Finance alert; pause new Pilot signups until CAC audit complete |
| `contribution_margin_per_customer_usd` | < $5 | CEO-level decision; pricing or creator payout needs adjustment |
| `pilot_to_performance_conversion_rate` | < 60% | Growth + Product review: either Pilot bar too high or Performance pricing friction |
| `pilot_saturation_weeks` | mean > 6 | Creator supply under-delivering; GTM pulls in recruit pipeline |
| `wburg_coffee_merchant_coverage` | < 30% at week 8 | GTM pivots outreach channel; consider co-marketing with anchor merchant |
| `wburg_coffee_creator_coverage` | < 15 at week 4 | GTM escalates creator recruiting; review payout rates |
| `wburg_weekly_verified_customers` | Misses weekly target 2 weeks running | Campaign redesign; audit attribution loss |

## 18. Data Model Note — v5.0

Two new tables back all AI-layer and outcome KPIs above:

- **`ai_verifications`** — one row per receipt scan attempt. Columns include `campaign_id`, `creator_id`, `submitted_at`, `vision_verdict`, `ocr_verdict`, `geo_verdict`, `final_verdict` (auto_verified / auto_rejected / manual_review / human_approved / human_rejected), `latency_ms`, `vision_cost_usd`, `reviewer_id` (nullable), `resolved_at`. Source for §13 + most of §17.
- **`agent_runs`** — one row per matching-agent invocation. Columns include `merchant_id`, `campaign_id` (nullable until confirmed), `goal_text`, `proposed_creator_ids` (array), `predicted_verified_customers`, `regenerate_count`, `approved_at` (nullable), `latency_ms`, `agent_cost_usd`, plus post-hoc `actual_verified_customers` backfilled when campaign settles. Source for §14 + `predicted_vs_actual_customers` in §17.

Both tables feed the v5.0 AI Performance dashboard (daily latency + cost; weekly approval/error rates; monthly unit economics). v4 tables (§12) remain unchanged.
