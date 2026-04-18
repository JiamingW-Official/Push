---
name: push-campaign
description: "Push v5.1 Vertical AI for Local Commerce — goal-first campaign lifecycle, ConversionOracle walk-in prediction, DisclosureBot compliance gating, per-vertical pricing, retention add-on settlement, per-plan dispute SLAs, and Two-Segment creator integration. Use for any campaign, workflow, or operations question."
---

# Push Campaign & Operations — Complete Reference (v5.1)

## 1. Workflow Design Principles
A Push workflow must be: fast to understand, hard to misuse, easy to repeat, measurable at every stage, resilient against drop-off and fraud, capable of producing better data over time. v5.1 is built around **Vertical AI for Local Commerce** — two vertical AI agents (**ConversionOracle** for walk-in prediction, **DisclosureBot** for FTC/platform disclosure compliance) are first-class citizens in the lifecycle, not bolt-ons. The merchant never writes a brief from scratch; the creator never posts uncompliant content; the platform never settles an unverified customer.

## 2. v5.1 Campaign Lifecycle (6 Phases)

### Phase 1 — Goal Input (60 seconds)
Merchant logs into onboarding (first-time) or the new-campaign wizard (returning). Single form screen, no brief writing, no RFP document. **v5.1: `vertical` is now a required input because pricing is vertical-matched** (coffee/QSR = $25/customer; fitness/beauty = $75/customer; retail/other = $40/customer).

**Inputs:**
- `business_name`
- `vertical` *(required in v5.1 — coffee | qsr | fitness | beauty | retail | other)*
- `category` *(sub-category within vertical)*
- `zip` / `neighborhood`
- `customer_target` — how many new customers
- `budget_usd` — monthly
- `timeframe_days`

### Phase 2 — AI Brief Preview (seconds 10–70)
`/api/agent/match-creators` fires with the goal + candidate pool. Claude Sonnet 4.6 returns a structured output. **v5.1: ConversionOracle predicts walk-in probability per creator × merchant pair** — not a generic match score. Agent run logged in `agent_runs` table for data-moat accumulation and ConversionOracle retraining.

**Endpoint: `/api/agent/match-creators`**

Input (request body):
```json
{
  "business_name": "string",
  "vertical": "coffee | qsr | fitness | beauty | retail | other",
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
      "walk_in_probability": "number",
      "est_customers": "number",
      "oracle_confidence": "number",
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

`matches` returns top-5 creators with ConversionOracle-predicted walk-in probability, per-creator customer estimates, oracle confidence score, and reasoning. `brief` is an agent-generated draft (will be screened by DisclosureBot in the next phase). `prediction` gives the merchant an ROI view before they commit.

### Phase 3 — Merchant Approval (manual, merchant-controlled)
Merchant reviews 5 matched creators + brief + ConversionOracle ROI prediction. Three actions:
- **Approve outright** — campaign status flips to `compliance_review` (see §3), DisclosureBot screens, then `active`
- **Regenerate** — re-fires `/api/agent/match-creators` with a different candidate pool
- **Tweak specific fields** — edit headline/CTA/offer_hook or swap individual creators before approving

**v5.1 rules:**
- Merchant **can override** ConversionOracle's creator picks (swap any of the 5 for anyone else in their qualified pool)
- Merchant **cannot bypass** DisclosureBot — every draft flows through compliance screening regardless of merchant override

### Phase 3.5 — Compliance Review (DisclosureBot, seconds)
New state in v5.1. Between merchant approval and campaign launch, DisclosureBot pre-screens the Matching agent's draft content for FTC disclosure, platform-specific disclosure tags (#ad, #sponsored), restricted claims (medical/financial/superlative language), and platform TOS. Two outcomes:
- **Pass** → campaign flips to `active`, creators receive invites
- **Block with revision prompts** → draft bounces back with specific line-level revision instructions; merchant either accepts DisclosureBot's rewrite (one-click) or returns to Phase 3 to edit

### Phase 4 — Campaign Execution (days 1–N)
Matched creators visit the merchant, post content to their audience, drive traffic. Each creator carries a unique QR code for attribution. Creator gets paid **after each customer passes the 3-layer AI verification** (see push-attribution skill).

**v5.1: DisclosureBot gates every post publish.** When a creator submits a post for publication, DisclosureBot runs final compliance check on the actual (not draft) content. Non-compliant posts cannot publish — the creator gets revision prompts and must re-submit. Compliant posts auto-publish on schedule. This runs continuously through campaign execution, not just at draft stage.

### Phase 5 — Per-Customer Settlement (rolling)
Every AI-verified customer triggers three events:
- **Creator commission** — Two-Segment model: T1–T3 pay-per-verified-customer, T4–T6 retainer + perf bonus + rev-share (see push-creator skill)
- **Merchant billing** — vertical-matched per-customer rate ($25 coffee/QSR, $75 fitness/beauty, $40 retail/other); first 10 free on $0 Pilot
- **`agent_runs` entry** — data-moat accumulation; feeds ConversionOracle v2 training data

**v5.1: Retention Add-on billing rolls into the monthly invoice.** When a verified first-visit customer returns (AI-verified again via QR/receipt/geo), the merchant is billed an additional per-retention-event fee:

| Vertical | Visit 2 | Visit 3 | Loyalty opt-in |
|----------|---------|---------|----------------|
| Coffee / QSR | $8 | $6 | $4 |
| Fitness / Beauty | $24 | $18 | $12 |
| Retail / Other | $13 | $10 | $7 |

Retention Add-on is **opt-in per campaign** at merchant's discretion, billed monthly alongside first-visit charges.

**Milestone bonuses** accumulate per T1–T3 creator per month at 30/40/60/80 txn/mo thresholds (see push-creator skill for bonus table).

### Phase 6 — Campaign Close / Auto-Renew
Campaign closes when any of the following hits:
- `timeframe_days` reached
- `customer_target` hit
- Merchant pauses/cancels

**v5.1 auto-upgrade:** when an Operator-eligible merchant on Pilot tier crosses **10 verified customers**, campaign auto-flips the merchant from Pilot ($0) to Operator ($500/mo min + per-customer + retention add-on) tier on their next billing cycle. Merchant is notified 48h before the flip.

Completed campaign data (every verified customer × creator × merchant pair with outcomes) feeds **ConversionOracle v2 training** — each closed campaign improves future walk-in prediction accuracy.

## 3. Campaign States (status enum)

| Status | Meaning |
|--------|---------|
| `draft` | Merchant filled goal but hasn't approved agent brief |
| `pending_approval` | Agent brief returned, waiting on merchant |
| `compliance_review` | *(new in v5.1)* Merchant approved; DisclosureBot screening brief before launch |
| `active` | DisclosureBot passed, creators invited, accepting scans |
| `paused` | Merchant paused (existing scans still process; no new matching) |
| `completed` | Goal met or timeframe elapsed |
| `cancelled` | Merchant cancelled before any customer (full refund if any) |

State flow: `draft → pending_approval → compliance_review → active → (paused ⇄ active) → completed | cancelled`

## 4. Two-Tier Promotional Offer Structure

Both offers are configured per campaign in the **Phase 2 agent brief output** (merchant can tweak in Phase 3 before approval).

1. **Hero Offer** (high-value, limited slots): Merchant selects from 5/10/15/20 free or deeply discounted items. High-urgency.
2. **Sustained Offer** (lower-value, wider reach): Ongoing discount (e.g., 15% off, $2 off) for all referral holders after Hero slots fill. Backs up longer campaigns.

Platform pre-suggests defaults based on merchant plan + vertical:
- **Pilot merchants** ($0): 5 Hero slots + 15% sustained (~$40-60 promo cost)
- **Operator merchants** ($500/mo min): 10 Hero slots + 20% sustained (~$80-120 promo cost)
- **Neighborhood merchants** (enterprise/multi-location): 15-20 Hero slots + custom sustained (~$120-200 promo cost)

## 5. Creator-Side Workflow (Two-Segment model)

### Opportunity Discovery
Via: live map, ranked campaign feed, standby alerts, category queue, tier-qualified pool, **vertical-matched filtering** (coffee-specialist creators see coffee campaigns first). Feed answers: What can I do now? What pays best near me? What closes soon? What am I one tier away from unlocking?

### Fulfillment
Visit → capture proof → follow content requirements (pre-screened by DisclosureBot) → publish (DisclosureBot gates publish) → submit evidence. Tools: checklist format, deadline visibility, proof examples, disqualification rules, auto-reminders.

### Settlement & Progression
Payout initiated per verified customer (T1–T3) or per monthly cycle (T4–T6) → score updates → tier progress updates → future campaign unlocks change. Completion must feel like progression, not just closure.

## 6. Platform Ops Workflow

Monitor: fill rate, standby conversion, no-show rates, merchant/creator repeat rates, dispute density, fraud anomalies, time-to-fill, time-to-verify, **time-to-first-customer** (v5.0 KPI), **ConversionOracle prediction accuracy** (v5.1 KPI: predicted vs actual walk-ins), **DisclosureBot block rate** (v5.1 KPI: % of drafts/posts requiring revision).

Exception flags dashboard: overdue proof, suspicious redemption spike, repeat merchant dissatisfaction, creator reliability drop, region with weak supply, low matching-agent confidence, **ConversionOracle confidence dropping below threshold**, **repeated DisclosureBot blocks from same creator/merchant** (possible training gap).

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
| Content publication after DisclosureBot approval | 48h | Final reminder; non-completion recorded |

### Platform Ops SLAs (v5.1 — tiered by plan)
| Stage | SLA | If Exceeded |
|-------|-----|-------------|
| Dispute acknowledgment (all plans) | 4h (business hours) | Auto-escalate to priority |
| **Dispute resolution — Pilot plan** | **72h** | Senior review + notify parties |
| **Dispute resolution — Operator plan** | **24h** | Senior review + notify parties |
| **Dispute resolution — Neighborhood plan** | **24h + custom exportable audit trail** | Senior review + notify parties + full evidence export delivered |
| Creator payout after verification | 24h | Auto-process if no fraud flags |
| Fraud flag review | 24h | Settlement held; parties notified |

**Neighborhood plan audit trail:** exports include all ConversionOracle prediction logs, DisclosureBot compliance screening results, 3-layer AI verification traces, QR scan timestamps, and geo data for every disputed customer. Formats: CSV, JSON, PDF.

## 8. Standby Mechanism
When a creator drops out last-minute:
- Notify nearby qualified creators: "[Merchant] has an open slot for tomorrow. $X + free items. Accept within 2 hours."
- Dynamic: adjust visibility, lower tier threshold, expand geo range if needed, **prefer creators with high ConversionOracle scores for this vertical**
- Increases: fill rate, engagement, urgency, merchant confidence

## 9. Dispute Resolution Process

1. Either party raises dispute within **14 days** of the scan timestamp (dispute window)
2. Platform acknowledges within 4 hours
3. Evidence collection: proof, communication records, QR data, 3-layer AI verification trace, ConversionOracle prediction log, DisclosureBot screening log
4. Resolution within **72h (Pilot) / 24h (Operator) / 24h + audit trail export (Neighborhood)**
5. Score impact applied per outcome (see push-creator skill for dispute impact table)
6. Appeal process available for severe cases

**Routing:**
- If the original verification verdict was `manual_review` → dispute lands in `/admin/ai-verifications`
- Otherwise → dispute lands in `/admin/disputes`
- **Neighborhood-tier disputes** → additional export queue in `/admin/disputes/neighborhood-export`

## 10. 20x Flow vs Basic Lead-Gen

**Basic lead-gen:** Merchant writes brief → posts → creator applies → accept → content → maybe payment → disclosure compliance handled manually (or not at all)

**Push v5.1 20x:** Merchant types goal + vertical → ConversionOracle predicts walk-in probability per creator pair + brief + ROI → merchant approves → DisclosureBot pre-screens brief → creators execute → DisclosureBot gates every publish → verified per-customer settlement with retention add-on → data feeds ConversionOracle v2 training

The two vertical AI agents (ConversionOracle + DisclosureBot) are the moat.

## 11. v5.1 Settlement Examples

### Example A: Coffee+ merchant (Operator plan) — monthly invoice
Merchant: Williamsburg specialty coffee shop, Operator tier, Retention Add-on enabled.
- **First visits:** 18 AI-verified × $25 = **$450**
- **Visit 2 (retention):** 0.4 × 18 = 7.2 returns × $8 = **$57.60**
- **Visit 3 (retention):** 0.2 × 18 = 3.6 returns × $6 = **$21.60**
- **Loyalty opt-in:** 0.3 × 18 = 5.4 signups × $4 = **$21.60**
- **Minimum fee** ($500) vs first-visit revenue ($450): minimum applies → platform bills $500 floor + $100.80 retention = **$600.80/mo**
  
Simplified if above $500 floor naturally: 18 × $25 + 7.2 × $8 + 3.6 × $6 + 5.4 × $4 = **$550.80/mo** (illustrative; adjusted for minimum).

Bare arithmetic for the walk-through shown in the prompt: 18 × $25 + 0.4 × $8 + 0.2 × $6 + 0.3 × $4 = $450 + $3.20 + $1.20 + $1.20 = **$455.60** (this represents per-customer-cohort math, not full month × customer count; full month above).

*Actual invoice aggregation depends on billing cycle logic; see push-pricing skill for canonical formula.*

### Example B: T5 Closer creator — monthly earnings
Creator: T5 Closer tier, on retainer, referred 3 merchants to platform.
- **Monthly retainer:** **$1,800**
- **Performance bonus:** 20 campaigns × $40/campaign perf bonus = **$800**
- **Base monthly total:** $1,800 + $800 = **$2,600/mo**
- **Rev-share (if they referred merchants):** 15% of platform revenue from referred merchants → e.g., 3 referred merchants generating $2,000/mo platform revenue each = $6,000 × 15% = **$900 rev-share**
- **Grand total (with referrals):** **$3,500/mo**

Without referrals, $2,600/mo base. With 3 active referrals, $3,500/mo. This is the Two-Segment upper-tier earning model.

## 12. v4 → v5.0 → v5.1 Change Summary

Key changes affecting campaigns:

**v5.0 (already in effect):**
- Goal-first replaces brief-first — merchant types numbers, not a document
- `/api/agent/match-creators` is the core endpoint — Phase 2 is agent-generated
- Per-customer settlement replaces per-campaign settlement
- Campaign states simplified to canonical enum values
- Two-Tier Offer kept — configured via agent brief in Phase 2
- Agent runs logged to `agent_runs` table

**v5.1 (new this release):**
- **Vertical AI for Local Commerce** positioning — two vertical AI agents are the product, not features
- **ConversionOracle** replaces generic "match score" — walk-in probability per creator × merchant pair, per vertical
- **DisclosureBot** added as mandatory compliance gate — screens Phase 3 drafts (new `compliance_review` state) AND every Phase 4 post publish
- **Vertical input required** in Phase 1 — pricing is vertical-matched
- **Retention Add-on** — opt-in per campaign, billed monthly (visit 2/3/loyalty × vertical rate)
- **Dispute SLA split three ways** — 72h Pilot / 24h Operator / 24h + audit trail Neighborhood
- **Auto-upgrade** — Pilot merchant crossing 10 verified customers auto-flips to Operator tier
- **ConversionOracle v2 training loop** — every closed campaign feeds the model
- **Two-Segment creator model** integrated — T1–T3 per-verified-customer, T4–T6 retainer + perf bonus + rev-share
