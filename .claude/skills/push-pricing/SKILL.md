---
name: push-pricing
description: "Push pricing model, unit economics, revenue layers, payment flows, and financial projections. Use for any pricing, economics, or financial question."
---

# Push Pricing & Economics — Complete Reference

## 1. Pricing Philosophy
Price for learning, not revenue. Remove friction → prove willingness to pay → establish value perception → don't destroy margins at scale.

## 2. Merchant Pricing (Updated 2026-04-12)

### Current Tier Structure
| Plan | Price | Campaigns/mo | Creator Tiers Available | Slots/Campaign |
|------|-------|-------------|------------------------|---------------|
| Starter | $19.99/mo | 2 | Seed + Explorer + Operator | 3 |
| Growth | $69/mo | 4 | All tiers (Proven priority) | 5 |
| Pro | $199/mo | Unlimited | All + invite Closer/Partner | 8 |

### Phased Rollout
**Phase 1 (Week 1-8): FREE**
- Everything free. Goal = data + repeat behavior, not revenue
- Merchant provides: offer to creators (free food/drink, $8-15 retail, $3-8 COGS)
- Push provides: matching, management, verification, summary

**Phase 2 (Week 9-12): Introductory Paid**
- After proving value via free campaigns, introduce pricing
- First campaign: FREE (already done)
- Pricing conversation: "You've run [X] campaigns with [results]. Going forward..."

**Phase 3+: Full Pricing + Performance Tiers**
- Subscription + campaign fees + performance-based take rate
- Pay-to-feature: merchants pay to promote campaigns to community top

### Additional Revenue: Merchant Preload
- Merchants preload funds to cover promotional costs + creator commissions + milestone bonuses
- Funds drawn down per verified transaction through referral system
- Preload amount recommendation by plan:
  - Starter: $100-150/month (covers ~2 campaigns of promotional offers)
  - Growth: $300-500/month (covers offers + creator commission/milestone)
  - Pro: $500-1000/month (covers all + premium creator invitations)

## 3. Creator Compensation (Updated v4.1)

### Campaign Difficulty Multiplier (NEW)
Base pay is determined by tier base rate × campaign difficulty:

| Difficulty | Multiplier | Examples |
|-----------|-----------|---------|
| Standard | 1.0x | Single-post story, simple check-in |
| Premium | 1.3x | Reel/TikTok, multi-location, weekend |
| Complex | 1.6x | Video series, event coverage, multi-day |

Difficulty is set by the platform based on campaign requirements. Merchant cannot override downward.

### By Tier (v4.1)
| Tier | Base Rate (Standard) | Commission | Referral Milestone Bonus | Total Earning Potential/mo |
|------|---------------------|------------|--------------------------|---------------------------|
| Seed | Free product only | 0% | — | Free items only |
| Explorer | $12/campaign | 0% | — | ~$36/mo (3 campaigns) |
| Operator | $20/campaign | 3% | $15 @ 30 txns | ~$83/mo |
| Proven | $32/campaign | 5% | $30 @ 40 txns | ~$175/mo |
| Closer | $55/campaign | 7% | $50 @ 60 txns | ~$400/mo |
| Partner | $100/campaign | 10% | $80 @ 80 txns | ~$980/mo |

*Base rates shown are Standard (1.0x) difficulty. Premium = 1.3x, Complex = 1.6x.*

### Seed Upgrade Bonus
- $5 cash bonus upon completing 2nd campaign (upgrade acceleration incentive)
- Push-funded in Phase 1; absorbed into platform ops cost at scale

### Phase 1 Creator Compensation (Push-funded)
| Type | Creator Gets |
|------|-------------|
| Standard F&B visit + 1 post | Free item + $25-35 cash |
| Premium content (Reel/TikTok) | Free item + $40-50 cash |
| Story-only (lower effort) | Free item + $15-20 cash |

Payment timing: Within 24 hours via Venmo/Zelle. **Non-negotiable trust-builder.**

### Commission + Milestone Bonus Structure (v4.1)
- 30-day attribution window (last-click attribution)
- Commission on every transaction through creator's referral QR/link
- **Milestone bonus:** flat cash bonus when referral transaction count hits monthly threshold

| Tier | Commission % | Milestone Threshold | Milestone Bonus |
|------|-------------|--------------------|-----------------| 
| Operator | 3% | 30 txns/month | +$15 |
| Proven | 5% | 40 txns/month | +$30 |
| Closer | 7% | 60 txns/month | +$50 |
| Partner | 10% | 80 txns/month | +$80 |

**Why milestone bonus:** Pure percentage commission on $5-8 F&B transactions yields negligible absolute value (3% × $6 = $0.18). Milestone bonus makes "commission unlock at Operator" a real behavioral inflection point. Source: merchant preloaded funds.

## 4. Five Revenue Layers

### Layer 1: Merchant Subscription (Stability)
$19.99 / $69 / $199 monthly recurring

### Layer 2: Campaign Service Fees (Operational)
Per-campaign fees for add-ons, extra slots, premium matching

### Layer 3: Performance-Based Take Rate (Strongest Long-Term)
- 15% take rate on creator payouts processed through Push
- Activated when attribution is strong enough to justify
- Tied to verified completion — strongest moat

### Layer 4: Creator Premium (Optional Acceleration)
Creators pay for premium features (advanced analytics, priority matching, profile boost)
Only activate when creator side sees enough value

### Layer 5: Future Financial Products
Payout acceleration, cash advance for high-performing creators, merchant credit line

## 5. Unit Economics (Updated v4.1)

### Per-Campaign Target (Standard difficulty, Operator-tier creator)
| Item | Amount |
|------|--------|
| Merchant payment (subscription portion) | ~$35 (prorated) |
| Campaign fee | ~$30 |
| Creator base pay | ~$20 |
| Creator milestone bonus (prorated) | ~$5 |
| Take rate (15% of payout) | ~$4 |
| Ops cost | ~$8 |
| **Platform net** | **~$36 (45% margin)** |

### Cost Structure
- Creator payments: largest cost, funded by merchant fees at scale
- Milestone bonuses: funded by merchant preload; predictable cost per tier
- Ops: verification, support, dispute handling → drops with AI automation
- Tech: hosting, tools (Vercel free → scales with revenue)

### Break-Even
At $19.99-$199/month per merchant, need ~15 paying merchants to cover ongoing costs when creators paid from campaign fees. Achievable by Month 4-5.

## 6. Pricing Comparison vs Alternatives
| Method | Cost | Measurability | Effort |
|--------|------|--------------|--------|
| DM a creator | $50-200/post + product | None | High |
| Local agency | $500-2000/mo | Low-Medium | Low |
| Instagram/FB Ads | $200-1000/mo | Medium | Medium |
| **Push Starter** | **$19.99/mo + ~$100 preload** | **High** | **Very Low** |

This is the core sales weapon.

## 7. Payment Flow

### Phase 1-2 (Manual)
Merchant pays Push → Venmo/Zelle or Stripe invoice
Push pays Creator → Venmo/Zelle within 24h of verification

### Phase 3+ (Automated)
Merchant subscribes → Stripe monthly billing
Merchant preloads → Stripe balance (covers offers + commission + milestone)
Campaign completes → Auto-verification
Creator payout → Stripe Connect (payout speed per tier)
Milestone bonus → Auto-calculated monthly, paid on 1st of following month
Platform fee → Auto-deducted

## 8. Economic Traps to Avoid
1. High activity / low value (vanity metrics)
2. Premium tiers without real utility
3. Weak attribution + aggressive pricing (merchants won't pay)
4. Subsidy dependence (can't wean off free)
5. **Milestone bonus inflation** — don't lower thresholds too aggressively; maintain aspiration value

## 9. Pricing Experiments to Run
1. $19.99 vs $49 vs $99 per month: conversion rate comparison
2. Per-campaign vs subscription: which gets higher adoption?
3. Creator payout sensitivity: $25 vs $35 effect on completion
4. Standby premium: would merchants pay $20 extra for guaranteed fill?
5. **Milestone threshold sensitivity:** 30 vs 20 txns — does lower threshold improve retention without inflating cost?
6. **Campaign difficulty premium:** do merchants accept 1.3x/1.6x multiplier?

## 10. Rules & Guardrails
- NEVER charge before merchant completes 1 free campaign
- ALWAYS pay creators within 24 hours (trust non-negotiable)
- Creator minimum payout: $10 (Seed gets product only)
- No annual contracts in Phase 1-2 (monthly, cancel anytime)
- Full refund if campaign gets zero completions
- Milestone bonus is guaranteed if threshold met — never retroactively adjusted
- Campaign difficulty multiplier is platform-set, transparent to both sides
