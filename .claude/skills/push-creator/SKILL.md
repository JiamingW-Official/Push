---
name: push-creator
description: "Push operator network: AI-managed creator routing, 6-tier progression, scoring model (with category_affinity + verified_conversions_90d), recruitment, retention, commission structure. Use for any creator/operator-related question."
---

# Push Creator System

> **Terminology note:** In Push v5.0, the creator network is the **Operator Network** — an AI-managed roster, not a marketplace. "Operator" is also the name of tier 3 in the 6-tier ladder (Steel). When the doc says "operator" lowercase / "operator network" it means a network participant at any tier; "Operator" capitalized means the specific tier 3. Both uses are intentional.

## Philosophy
"Anyone can start. Performance determines how far the agent routes you."
Creators are valued by verified conversions delivered, completion rate, reliability, merchant satisfaction, and commercial results — not follower count. Campaigns are **routed by the matching agent**, not browsed by creators.

---

## Operator Network (v5.0) — Agent-Routed Model

In v4.x, creators browsed an open campaign board and applied to campaigns they liked. **In v5.0 that flow is inverted.**

### How it works now
1. **Merchant inputs a goal** via the Pilot/Subscription portal (e.g., "100 first-time customers at 11211 coffee shop, 30 days").
2. **Matching agent (Claude Sonnet 4.6)** reads the goal, the merchant's category + geo + tier entitlements, and runs a ranked query across the operator network.
3. **Top 5 operators** per merchant goal are selected. They receive a DM invitation containing a **draft brief** (campaign concept, payout breakdown, timeline). No open board. No application queue.
4. **Operator accepts or declines** in-DM. A declined slot triggers the agent to surface the next candidate within minutes — target end-to-end turnaround from merchant input to operator invite: **under 60 seconds**.

### What the agent reads when ranking
The ranking signal is a weighted composite. Tier is still the coarsest filter (merchant plan entitles access to specific tier bands — see "Merchant Tier Linkage" below), but within the entitled band the agent reads:

| Signal | Source | Why it matters in v5.0 |
|--------|--------|------------------------|
| **Tier** | Push Score → tier band | Determines routing priority + commission rate |
| **Push Score** | Composite formula (see `scoring-model.md`) | Overall quality proxy |
| **`category_affinity`** (0.0-1.0 per vertical) | Content history classification (coffee, restaurant, fitness, retail, etc.) | NEW — drives category fit; a 0.92 coffee-affinity operator beats a 0.50 one for a coffee goal even at same tier |
| **`verified_conversions_90d`** | Rolling 90-day count of AI-verified customers delivered | NEW — replaces raw "campaigns completed" as the north-star output metric. A creator can run many campaigns and convert few; this signal separates them. |
| **Distance to merchant** | Creator home geo → merchant geo (miles) | For hyperlocal verticals, < 2 mi beats > 5 mi |
| **Last-30d availability** | Current concurrent campaigns vs. tier cap | Prevents inviting already-saturated operators |
| **Anti-fraud flags** | Device/IP/self-referral history | Hard exclusion |

### Williamsburg coffee priority (current beachhead)
Until we graduate beachhead, the agent applies a priority lane:
- `coffee_affinity > 0.7` AND
- `distance_miles < 1.2` from zip 11211

Operators meeting both conditions get **first-pass routing** for any Williamsburg coffee merchant goal, regardless of tier. A Seed-tier operator with 0.91 coffee affinity living 4 blocks from the merchant often outperforms a higher-tier operator living 3 miles away — and the agent knows it.

### What did NOT change
The tier ladder, material colors, Push Score formula, commission percentages, milestone bonuses, demotion grace window, and anti-gaming rules are **unchanged**. v5.0 is a routing change, not a scoring change. The agent reads the existing score; it does not rewrite it.

---

## Philosophy (continued)
"Anyone can start. Performance determines how far you go" is still the core line, just re-pointed: performance now determines **how high you rank in agent routing**, not how many campaigns you can click "apply" on.

## 6-Tier System v4.1

| Tier | Material | Push Score | Base Pay (Standard) | Commission | Referral Milestone Bonus | Payout Speed | Concurrent |
|------|----------|-----------|---------|------------|--------------------------|-------------|------------|
| Seed | Clay | None (provisional 50) | Free product only | 0% | — | Instant redemption | 1 |
| Explorer | Bronze | 40+ | $12/campaign | 0% | — | T+3 | 2 |
| Operator | Steel | 55+ | $20/campaign | 3% | $15 @ 30 txns/mo | T+2 | 3 |
| Proven | Gold | 65+ | $32/campaign | 5% | $30 @ 40 txns/mo | T+1 | 4 |
| Closer | Ruby | 78+ | $55/campaign | 7% | $50 @ 60 txns/mo | Same-day | 5 |
| Partner | Obsidian | 88+ | $100/campaign | 10% | $80 @ 80 txns/mo | Instant | 6 |

**Material Identity System:** Each tier has a material name and unique identity color used in badges, UI, and communications. Progression: Clay `#b8a99a` → Bronze `#8c6239` → Steel `#4a5568` → Gold `#c9a96e` → Ruby `#9b111e` → Obsidian `#1a1a2e`. Each tier occupies a distinct hue family: taupe → copper → graphite → gold → red → near-black. Visual spec in Design.md → Tier Identity System v4.1.

### Base Pay Determination — Campaign Difficulty Multiplier
Base pay is NOT arbitrary. Each campaign is assigned a difficulty tier that multiplies the tier's base rate:

| Difficulty | Multiplier | Examples |
|-----------|-----------|---------|
| Standard | 1.0x | Single-post story, simple check-in |
| Premium | 1.3x | Reel/TikTok, multi-location, weekend |
| Complex | 1.6x | Video series, event coverage, multi-day |

**Example:** Operator base rate = $20. Standard campaign = $20, Premium = $26, Complex = $32.
Difficulty is set by the platform based on campaign requirements; merchant cannot override downward.

### Commission Structure — Redesigned for Local F&B
**Problem solved:** Pure percentage commission on $5-8 F&B transactions yields negligible absolute value (3% of $6 = $0.18). Commission alone cannot serve as the "behavioral inflection point."

**Solution: Percentage + Referral Milestone Bonus (hybrid model)**
- **Percentage commission** still applies per transaction (3%-10% by tier) — builds the "passive income" narrative
- **Referral Milestone Bonus** unlocks when creator's referral transactions hit a monthly threshold — this is where the real money is

| Tier | Commission % | Milestone Threshold | Milestone Bonus |
|------|-------------|--------------------|-----------------| 
| Operator | 3% | 30 transactions/month | +$15 |
| Proven | 5% | 40 transactions/month | +$30 |
| Closer | 7% | 60 transactions/month | +$50 |
| Partner | 10% | 80 transactions/month | +$80 |

**Concrete example — Operator:**
- 40 referral transactions × $7 avg = $280 total referral value
- Commission: $280 × 3% = $8.40
- Milestone bonus (hit 30+): $15
- **Total referral income: $23.40/month** (vs. $8.40 without milestone)

This makes "unlock commission at Operator" feel like a real inflection point, not a rounding error.

### 30-Day Attribution Window
- All transactions through a creator's referral link within 30 days count toward commission + milestone
- Window resets if consumer uses a different creator's referral link (last-click attribution)
- Creator dashboard shows real-time referral count + distance to milestone

### Seed Tier — Key Differentiator
- **Zero barrier:** No follower count requirement. Just register + fill profile.
- **15-20 slots per campaign** (high volume, low cost) — transforms Push from "influencer platform" to "local community acquisition platform"
- **Upgrade path:** Complete 2 campaigns + provisional score ≥ 40 → auto-promote to Explorer
- **Upgrade nudge:** After completing 1st campaign, creator receives "$5 cash bonus" on 2nd campaign completion as acceleration incentive

### Progression Philosophy
Each tier unlocks exactly what the previous tier's creators start craving:
- Seed → Explorer: Official identity + cash payment + **referral data transparency**
- Explorer → Operator: Commission + milestone bonus = real passive income (behavioral inflection point)
- Operator → Proven: Premium brand partnerships + **merchant tier preference setting**
- Proven → Closer: Dedicated manager + structured campaign feedback
- Closer → Partner: Co-branding + advisory access to platform roadmap

### Merchant Tier Linkage (Bidirectional) — v5.0 mapping

Agent routing respects tier entitlements defined by the merchant's current plan:

**Merchant plan → operator tier band accessible to agent routing:**
- **Pilot ($0, 30-day trial):** Seed + Explorer + Operator; agent routes up to 3 invites per goal
- **Subscription ($500/mo min):** All tiers eligible; agent routes up to 5 invites per goal, with Proven+ priority
- **Scale tier (higher retainers):** All tiers + founder can request specific Closer/Partner operator by name; up to 8 invites per goal

**Operator → Merchant preference (unchanged):**
- **Proven+:** Can set preference to prioritize Subscription-tier merchants; the agent reads this preference and weights routing accordingly
- **Closer+:** Can filter to only accept Scale-tier merchant goals; the agent skips them for lower-tier invites
- **Partner:** Can lock in exclusive merchant partnerships (1-3 merchants); agent routes matching goals to them first

This bidirectional linkage still gives merchants a concrete reason to upgrade — higher plans unlock the deeper, higher-conversion operator pool.

## Education & Growth Benefits by Tier (NEW)

| Tier | Education Benefit |
|------|------------------|
| Seed | Welcome kit: "Your First Campaign" checklist + 3 example posts |
| Explorer | Content Creation Guide + Best Practices Library + **referral analytics dashboard** |
| Operator | Data Literacy Tutorial (how to read your referral data and optimize) |
| Proven | Monthly 1-on-1 content review with Push team |
| Closer | Dedicated account manager + strategy coaching sessions |
| Partner | Quarterly business review + media feature opportunities |

These are high-perceived-value, low-cost benefits that directly improve content quality → merchant satisfaction → creator score → tier progression. Virtuous cycle.

## Sub-files Reference

**All scoring details, dimensions, decay, disputes, tier transitions, and anti-gaming measures:** 詳見 `scoring-model.md`

**Creator recruitment strategy, DM scripts, retention architecture, and what-each-tier-unlocks narrative:** 詳見 `recruitment-retention.md`
