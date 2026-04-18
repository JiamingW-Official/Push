---
name: push-campaign
description: "Push v5.0 goal-first campaign lifecycle, AI brief generation, workflow architecture, operations, SLAs, dispute resolution, and per-customer settlement. Use for any campaign, workflow, or operations question."
---

# Push Campaign & Operations — Complete Reference (v5.0)

## 1. Workflow Design Principles
A Push workflow must be: fast to understand, hard to misuse, easy to repeat, measurable at every stage, resilient against drop-off and fraud, capable of producing better data over time. v5.0 replaces the v4 brief-first flow with a **goal-first** flow — the merchant never writes a brief from scratch.

## 2. v5.0 Campaign Lifecycle (6 Phases)

### Phase 1 — Goal Input (60 seconds)
Merchant logs into onboarding (first-time) or the new-campaign wizard (returning). Single form screen, no brief writing, no RFP document.

**Inputs:**
- `business_name`
- `category`
- `zip` / `neighborhood`
- `customer_target` — how many new customers
- `budget_usd` — monthly
- `timeframe_days`

### Phase 2 — AI Brief Preview (seconds 10–70)
`/api/agent/match-creators` fires with the goal + candidate pool. Claude Sonnet 4.6 returns a structured output. Agent run logged in `agent_runs` table for data-moat accumulation.

**Endpoint: `/api/agent/match-creators`**

Input (request body):
```json
{
  "business_name": "string",
  "category": "string",
  "zip": "string",
  "neighborhood": "string",
  "customer_target": "number",
  "budget_usd": "number",
  "timeframe_days": "number"
}
```

Output (response):
```json
{
  "matches": [
    {
      "creator_id": "string",
      "handle": "string",
      "tier": "string",
      "est_customers": "number",
      "reason": "string"
    }
  ],
  "brief": {
    "headline": "string",
    "cta": "string",
    "tone": "string",
    "offer_hook": "string"
  },
  "prediction": {
    "est_verified_customers": "number",
    "confidence": "number",
    "est_spend_usd": "number",
    "est_revenue_multiplier": "number"
  }
}
```

`matches` returns top-5 creators with per-creator customer estimates and reasoning. `brief` is an agent-generated draft. `prediction` gives the merchant an ROI view before they commit.

### Phase 3 — Merchant Approval (manual, merchant-controlled)
Merchant reviews 5 matched creators + brief + ROI prediction. Three actions:
- **Approve outright** — campaign status flips to `active`, creators receive invites
- **Regenerate** — re-fires `/api/agent/match-creators` with a different candidate pool
- **Tweak specific fields** — edit headline/CTA/offer_hook or swap individual creators before approving

### Phase 4 — Campaign Execution (days 1–N)
Matched creators visit the merchant, post content to their audience, drive traffic. Each creator carries a unique QR code for attribution. Creator gets paid **after each customer passes the 3-layer AI verification** (see push-attribution skill).

### Phase 5 — Per-Customer Settlement (rolling)
Every AI-verified customer triggers three events:
- **Creator commission** — tier-based % + base rate (see push-creator skill)
- **Merchant billing** — $40 per customer on Performance plan; first 10 free on Pilot plan
- **`agent_runs` entry** — data-moat accumulation for future matching

**Milestone bonuses** accumulate per creator per month at 30/40/60/80 txn/mo thresholds (see push-creator skill for bonus table).

### Phase 6 — Campaign Close / Auto-Renew
Campaign closes when any of the following hits:
- `timeframe_days` reached
- `customer_target` hit
- Merchant pauses/cancels

Performance merchants can auto-renew with a fresh goal input. Data from the completed campaign feeds the matching agent's training set, improving future matches.

## 3. Campaign States (status enum)

| Status | Meaning |
|--------|---------|
| `draft` | Merchant filled goal but hasn't approved agent brief |
| `pending_approval` | Agent brief returned, waiting on merchant |
| `active` | Launched, creators invited, accepting scans |
| `paused` | Merchant paused (existing scans still process; no new matching) |
| `completed` | Goal met or timeframe elapsed |
| `cancelled` | Merchant cancelled before any customer (full refund if any) |

## 4. Two-Tier Promotional Offer Structure

Both offers are configured per campaign in the **Phase 2 agent brief output** (merchant can tweak in Phase 3 before approval).

1. **Hero Offer** (high-value, limited slots): Merchant selects from 5/10/15/20 free or deeply discounted items. High-urgency.
2. **Sustained Offer** (lower-value, wider reach): Ongoing discount (e.g., 15% off, $2 off) for all referral holders after Hero slots fill. Backs up longer campaigns.

Platform pre-suggests defaults based on merchant plan + category:
- Pilot merchants: 5 Hero slots + 15% sustained (~$40-60 promo cost)
- Performance merchants (small): 10 Hero slots + 20% sustained (~$80-120 promo cost)
- Performance merchants (large): 15-20 Hero slots + custom sustained (~$120-200 promo cost)

## 5. Creator-Side Workflow (unchanged from v4)

### Opportunity Discovery
Via: live map, ranked campaign feed, standby alerts, category queue, tier-qualified pool. Feed answers: What can I do now? What pays best near me? What closes soon? What am I one tier away from unlocking?

### Fulfillment
Visit → capture proof → follow content requirements → publish → submit evidence. Tools: checklist format, deadline visibility, proof examples, disqualification rules, auto-reminders.

### Settlement & Progression
Payout initiated per verified customer → score updates → tier progress updates → future campaign unlocks change. Completion must feel like progression, not just closure.

## 6. Platform Ops Workflow

Monitor: fill rate, standby conversion, no-show rates, merchant/creator repeat rates, dispute density, fraud anomalies, time-to-fill, time-to-verify, **time-to-first-customer** (v5.0 KPI).

Exception flags dashboard: overdue proof, suspicious redemption spike, repeat merchant dissatisfaction, creator reliability drop, region with weak supply, low matching-agent confidence.

## 7. SLA Framework

### Merchant SLAs
| Stage | SLA | If Exceeded |
|-------|-----|-------------|
| Goal → agent brief approval | 48h | Reminder + setup assistance |
| Creator application review (if invite-back) | 24h | Auto-approve top-scored applicants |
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
| **Dispute resolution — Performance plan** | **24h** | Senior review + notify parties |
| **Dispute resolution — Pilot plan** | **72h** | Senior review + notify parties |
| Creator payout after verification | 24h | Auto-process if no fraud flags |
| Fraud flag review | 24h | Settlement held; parties notified |

## 8. Standby Mechanism
When a creator drops out last-minute:
- Notify nearby qualified creators: "[Merchant] has an open slot for tomorrow. $X + free items. Accept within 2 hours."
- Dynamic: adjust visibility, lower tier threshold, expand geo range if needed
- Increases: fill rate, engagement, urgency, merchant confidence

## 9. Dispute Resolution Process

1. Either party raises dispute within **14 days** of the scan timestamp (dispute window)
2. Platform acknowledges within 4 hours
3. Evidence collection (proof, communication records, QR data, AI verification trace)
4. Resolution within **24h (Performance) / 72h (Pilot)**
5. Score impact applied per outcome (see push-creator skill for dispute impact table)
6. Appeal process available for severe cases

**Routing:**
- If the original verification verdict was `manual_review` → dispute lands in `/admin/ai-verifications`
- Otherwise → dispute lands in `/admin/disputes`

## 10. 20x Flow vs Basic Marketplace
**Basic:** Merchant writes brief → posts → creator applies → accept → content → maybe payment

**Push v5.0 20x:** Merchant types goal → AI returns matched creators + brief + ROI prediction → merchant approves in one click → verified per-customer settlement → data feeds next campaign's match quality

The agent-driven loop itself is the moat.

## 11. v4 → v5.0 Change Summary

Key changes affecting campaigns:
- **Goal-first replaces brief-first** — merchant types numbers, not a document
- **`/api/agent/match-creators` is the core endpoint** — Phase 2 is agent-generated, not manual
- **Per-customer settlement replaces per-campaign settlement** — billing/payout fires on each AI-verified customer, not at campaign close
- **Campaign states simplified** to 6 canonical enum values
- **Dispute SLA split by plan** — 24h Performance, 72h Pilot (was 48h flat)
- **Two-Tier Offer kept** — still correct, now configured via agent brief in Phase 2
- **Agent runs logged to `agent_runs` table** — every brief generation feeds the data moat
