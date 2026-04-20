---
name: push-creator
description: "Push creator system: 6-tier progression, scoring model, recruitment, retention, commission structure. Use for any creator-related question."
---

# Push Creator System

## Philosophy
"Anyone can start. Performance determines how far you go."
Creators are valued by completion rate, reliability, merchant satisfaction, and commercial results — not follower count.

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

### Merchant Tier Linkage (Bidirectional)

**Merchant → Creator access:**
- **Starter ($19.99/mo):** Seed + Explorer + Operator, 3 slots/campaign
- **Growth ($69/mo):** All tiers (Proven priority), 5 slots/campaign
- **Pro ($199/mo):** All tiers + can invite specific Closer/Partner, 8 slots/campaign

**Creator → Merchant preference (NEW):**
- **Proven+:** Can set preference to prioritize Growth/Pro merchants
- **Closer+:** Can filter to only accept Pro merchant campaigns
- **Partner:** Can set exclusive merchant partnerships (1-3 merchants)

This bidirectional linkage gives merchants a concrete reason to upgrade plans.

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
