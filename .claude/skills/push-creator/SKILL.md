---
name: push-creator
description: "Push 6-Tier Creator System v5.2 Two-Segment Economics, scoring, tier progression, recruitment. Use for any creator question."
---

# Push Creator System — v5.2 Two-Segment Economics

## 0. Authority Notice
v5.2 (2026-04-20) introduces Two-Segment Economics:
- T1–T3: Per-verified-customer pricing (low barrier, high throughput)
- T4–T6: Retainer + per-customer + equity (retention moat)
v4.1 "per-campaign" pricing is DEPRECATED.

## 1. Six-Tier Ladder

| Tier | Name | Material | Identity | Trust |
|------|------|---------|---------|------|
| T1 | Seed | Clay | Beginner, unverified | New |
| T2 | Explorer | Bronze | Regular, verified | Verified |
| T3 | Operator | Steel | Reliable, scales volume | Trusted |
| T4 | Proven | Gold | Contracted performer | Contract |
| T5 | Closer | Ruby | Equity-granted partner | Partner L1 |
| T6 | Partner | Obsidian | Senior equity partner | Partner L2 |

## 2. Tier Economics (Authoritative)

### T1 Clay (Seed)
- Per-verified-customer: $5
- Free item from merchant (valued $5–15 retail, ~$3–5 COGS)
- First-verified-customer bonus: +$10
- T1 minimum earning guarantee: $15 if 1 campaign completed with 0 verified customers (merchant fail-to-deliver protection)
- Monthly theoretical range: $30–$75
- Graduation to T2: 2 verified customers within first 2 campaigns → auto-promote

### T2 Bronze (Explorer)
- Per-verified-customer: $15
- Free item
- Monthly theoretical: $150–$450 (10–30 customers/mo)

### T3 Steel (Operator)
- Per-verified-customer: $20
- 3% referral commission (on total merchant revenue from referred customer, 30-day window)
- Monthly theoretical: $400–$900

### T4 Gold (Proven)
- Monthly retainer: $800
- Per-verified-customer: $25
- 10% referral commission
- 30-day guaranteed minimum: $800 even if 0 customers delivered (merchant responsibility)
- Monthly theoretical: $1,500–$2,500

### T5 Ruby (Closer)
- Monthly retainer: $1,800
- Per-verified-customer: $40
- 15% referral commission
- Equity: 0.02% RSA (Restricted Stock Agreement), 4-year vesting 1-year cliff
- Monthly theoretical: $3,000–$4,500

### T6 Obsidian (Partner)
- Monthly retainer: $3,500
- Per-verified-customer: $60
- 20% referral commission
- Equity: 0.05%–0.2% RSA depending on tenure
- Monthly theoretical: $5,000–$8,000

## 3. Onboarding & Progression

### T1 Entry (all creators start here)
- Social proof minimum: 500+ followers OR 5+ organic local posts
- Application: single-form submission + 1-hour pilot campaign sample

### Promotion Rules (v5.2)
- T1 → T2: 2 verified customers in first 2 campaigns
- T2 → T3: 10 verified customers cumulative + Push Score ≥ 55
- T3 → T4: Contract offered by Push based on demonstrated monthly throughput ≥ 20 customers + Push Score ≥ 70 (INVITE-ONLY)
- T4 → T5: Performance review at Month 6 on contract; sustained throughput ≥ 40 customers/mo + Score ≥ 80 (INVITE-ONLY with equity offer)
- T5 → T6: Senior-only; 12+ months on T5 + Score ≥ 90 + unique strategic value (INVITE-ONLY)

### Demotion (v5.2 30-day grace)
- If Push Score drops below tier threshold: 30-day grace window
- Grace period: creator earns at next-lower tier rate; retainer suspended (T4–T6)
- End of grace: if score unrecovered, full demotion; retainer and equity vesting suspended per contract

## 4. Push Score — Composite Formula

See `scoring-model.md` in this folder for full detail.

Summary:
- Completion Rate: 30%
- Reliability: 20%
- Content Quality: 25%
- Merchant Satisfaction: 15%
- Engagement: 10%

**v5.2 change:** "Completion" = verified customer delivery rate, NOT campaign completion rate.

## 5. Dispute & Anti-Gaming

### Dispute Impact
- Creator at fault (no-show, fake proof, fraud): -15 score
- Partially at fault: -8
- Not at fault: 0
- Merchant false claim: +2 (trust restoration)

### Anti-Gaming Measures
- Device fingerprint + IP for self-referral detection
- Merchant collusion: flag any >3 consecutive campaign same creator-merchant pair
- Fake engagement: engagement capped at 10% of score
- Verified customer fraud: -25 score + 30-day suspension + merchant refund

## 6. Creator UI Tier Colors

Pending P1-1 decision. Under review: Path A = collapse to 6 brand colors; Path B = 6 independent tier colors. This section defers to Design.md v5.2 design-token update post-P1-1 decision.

## 7. v4.1 Historical Reference (DEPRECATED 2026-04-20)

All content below is DEPRECATED. Retained for archaeology only. Per-campaign pricing, milestone bonuses, and take-rate model are replaced by the v5.2 Two-Segment Economics above.

### v4.1 6-Tier Pay Table — DEPRECATED 2026-04-20
Base pay in v4.1 was paid per campaign (Standard difficulty); v5.2 replaces this with per-verified-customer.

| Tier | Base Pay | Commission | Referral Milestone Bonus |
|------|---------|------------|--------------------------|
| Seed | Free product only | 0% | — |
| Explorer | $12 | 0% | — |
| Operator | $20 | 3% | $15 @ 30 txns/mo |
| Proven | $32 | 5% | $30 @ 40 txns/mo |
| Closer | $55 | 7% | $50 @ 60 txns/mo |
| Partner | $100 | 10% | $80 @ 80 txns/mo |

### v4.1 Campaign Difficulty Multiplier — DEPRECATED 2026-04-20
Standard 1.0x / Premium 1.3x / Complex 1.6x applied to per-campaign base rate. Retired because v5.2 pays on verified customers delivered, not campaign difficulty.

### v4.1 Commission Hybrid Model — DEPRECATED 2026-04-20
Pure percentage + milestone bonus at 30/40/60/80 monthly referral transactions. Retired: pure-percent commission on $5–8 F&B events yielded $0.15–0.50 per event; replaced by direct per-verified-customer payout in v5.2 §2.

### v4.1 Merchant Tier Linkage — DEPRECATED 2026-04-20
Starter/Growth/Pro access tiers and bidirectional creator-merchant preference filters retired alongside v4.1 subscription tiers. See push-pricing appendix for the full deprecated subscription structure.
