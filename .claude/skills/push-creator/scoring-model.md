# Push Score Scoring Model — v5.2

## Composite Formula

**Push Score = (VerifiedCustomerRate × 0.30) + (Reliability × 0.20) + (Quality × 0.25) + (MerchantSatisfaction × 0.15) + (Engagement × 0.10)**

Range: 0–100.

---

## 1. Verified Customer Rate (30% weight)

**Formula:** `(Verified customers delivered / Promised customers in campaign contract) × 100`

| Rate | Points |
|------|--------|
| 95–100% | 30 |
| 85–94% | 24 |
| 70–84% | 18 |
| 50–69% | 10 |
| <50% | 0 |

**Rationale:** v5.2 core question — did the creator deliver the verified customers promised in the campaign contract? Replaces v4.1 "campaign completion" which measured posting activity rather than verified customer outcomes.

---

## 2. Reliability (20% weight)
**Formula:** `((On-time / Total) × 0.6 + (1 - No-show rate) × 0.4) × 100`

| Reliability Score | Points |
|---|---|
| 90-100% | 20 |
| 75-89% | 15 |
| 60-74% | 10 |
| <60% | 0 |

**Components:**
- On-time delivery: 60% of reliability score
- No-show rate: 40% of reliability score

**Rationale:** Can we predict when you'll deliver and that you'll show up?

---

## 3. Content Quality (25% weight)
**Formula:** `(Avg merchant content rating / 5) × 100`

| Merchant Rating | Points |
|---|---|
| 4.5-5.0 ⭐ | 25 |
| 3.5-4.4 | 19 |
| 2.5-3.4 | 12 |
| <2.5 | 5 |

**Rationale:** Does the content actually drive the merchant's business?

---

## 4. Merchant Satisfaction (15% weight)
**Formula:** `(Avg rebook score / 5) × 100`

| Rebook Score | Points |
|---|---|
| 4.5-5.0 ⭐ | 15 |
| 3.5-4.4 | 11 |
| 2.5-3.4 | 7 |
| <2.5 | 0 |

**Rationale:** Would the merchant hire you again? This is the ultimate quality signal.

---

## 5. Engagement Proxy (10% weight)
**Formula:** `min((Avg engagement rate / 3%) × 100, 100)`

| Engagement Rate | Points |
|---|---|
| >3% | 10 |
| 2-3% | 7 |
| 1-2% | 4 |
| <1% | 2 |

**Rationale:** Audience resonance matters, but capped at 10% to prevent follower-only creators from gaming the system.

---

## Cold Start Scoring (v5.2)

**New Creators:**
- Display "New" badge; no visible score
- Internal provisional score starts at **50** (eligible for T1 Seed tier)
- After **2 completed campaigns** → real score calculated; tier assigned based on verified customer performance
- Fast track: first 2 campaigns complete + merchant rating ≥ 4.0 + Score ≥ 55 → jump to T3 Operator

---

## Score Decay

**Activity-based decay when creator is inactive:**

| Activity Window | Decay Rate |
|---|---|
| Active (1+ campaign/30 days) | No decay |
| Inactive 30-60 days | -2 points/month |
| Inactive 60-90 days | -5 points/month |
| Inactive 90+ days | Score freezes; profile marked "Inactive" |
| Return from inactive | First campaign back restores active status |

**Rationale:** Inactive creators' historical data becomes less reliable predictors. Returning creators get one campaign to prove they're back in form.

---

## Dispute Impact

When a verified customer delivery is disputed:

| Outcome | Score Impact |
|---|---|
| Creator at fault (no-show, fake proof, low quality) | -15 |
| Partially at fault (communication breakdown) | -8 |
| Not at fault (merchant issue) | 0 |
| Resolved in creator's favor (merchant false claim) | +2 |

**Rationale:** Disputes are rare; when they happen, significant penalty ensures bad actors exit. Creators wrongly accused get a modest bonus to restore trust.

---

## Tier Transition Rules (v5.2)

### Promotion (retained v4.1 base, updated thresholds)
- Score at or above tier threshold for **2 consecutive campaigns**
- T1 → T2 special: 2 verified customers in first 2 campaigns (v5.2 new)
- T3 → T4 and above: INVITE-ONLY per SKILL.md §3

### Fast Track (v5.2 aligned)
- Score ≥ 55 in first 2 campaigns + merchant rating ≥ 4.0 → T3 Operator
- Rationale: threshold aligned with T3 entry, not T4 Proven. Exceptional newcomers earn Operator access; sustained verified customer throughput required for further promotion.

### Demotion (v5.2 30-day time-based)
- Score falls below tier threshold → 30-day grace window (time-based, not campaign-count-based)
- During grace: rate drops to next-lower tier; retainer suspended for T4–T6
- End of grace: full demotion applied if score still below threshold
- Exception: demotion never happens during active campaign; evaluated between campaigns
- Notification: warning at score-drop, reminder at day 15, demotion at day 30

**Why time-based instead of campaign-based:** campaign-based allowed creators to stall — do nothing for months and retain tier. Time-based ensures consistent accountability. The rate drop during grace period prevents exploiting high-tier benefits with low-tier verified customer performance.

---

## Anti-Gaming Measures

| Attack Type | Detection Mechanism | Defense |
|---|---|---|
| Cherry-picking easy campaigns | Track campaign difficulty / verified-customer distribution | Require balanced mix (at least 1 each of food type, time slot, location) for promotion |
| Fake engagement (buying likes) | Spike analysis; follower/engagement ratio test | Engagement = only 10% of score; easy to game but capped |
| Merchant collusion | Repeated same-merchant pairing | Flag any creator-merchant pair with >3 consecutive campaigns; audit ratings |
| Low-quality rushing | Merchant content rating | Quality = 25% of score; high quality required for tier progression |
| Multi-accounting | Device fingerprint + IP tracking | Link accounts sharing same device; one account per creator |
| Verified-customer fraud | Abnormal verified spike patterns | Cross-reference verification IPs/devices; flag self-referral patterns; -25 score + 30-day suspension |

---

## Phase 1 Spreadsheet Formula

**Columns:** Creator name | Campaigns accepted | Completed | Verified Customer Rate | On-time submissions | Reliability | Avg content rating | Avg rebook score | Avg engagement rate | Push Score | Tier

**Excel formula:**
```
=((D×0.30)+(F×0.20)+((G/5)×0.25)+((H/5)×0.15)+(MIN(I/0.03,1)×0.10))×100
```

**Explanation:**
- `D` = Verified Customer Rate (v5.2: verified customers delivered / promised, expressed as decimal-of-1). Replaces v4.1 "Completion rate."
- `F` = Reliability (already %)
- `G` = Avg content rating (1-5 scale)
- `H` = Avg rebook score (1-5 scale)
- `I` = Avg engagement rate (as decimal, e.g., 0.025 for 2.5%)
- `MIN(I/0.03,1)` = Caps engagement contribution at 100%
