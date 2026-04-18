# Push Score Scoring Model

## Composite Formula

**Push Score = (Completion × 0.30) + (Reliability × 0.20) + (Quality × 0.25) + (Merchant Satisfaction × 0.15) + (Engagement × 0.10)**

Range: 0-100

**The formula, the 5 dimensions, and their weights are UNCHANGED from v4.1.** What v5.0 adds is how the score is consumed: the matching agent reads Push Score + two new auxiliary signals (below) to rank operators per merchant goal.

---

## v5.0 Agent-Input Signals (Auxiliary — Not Part of Push Score)

These are **not** added into the 100-point Push Score. They live alongside it as separate fields the matching agent reads when ranking operators for a merchant goal.

### `category_affinity` — per-vertical fit (0.0 – 1.0)
**Source:** Automated classification of the creator's last 90 days of content + campaign history, bucketed by vertical (coffee, restaurant, bar, fitness, retail-apparel, retail-beauty, services).

**Example record for one operator:**
```
{ coffee: 0.92, restaurant: 0.74, bar: 0.41, fitness: 0.08, retail_apparel: 0.22 }
```

**Agent usage:** When routing a "100 customers at coffee shop" goal, the agent multiplies the operator's `coffee` affinity into the ranking weight. A Seed-tier operator at 0.91 coffee affinity often out-ranks an Operator-tier operator at 0.45 coffee affinity.

**Recomputed:** Nightly, rolling 90-day window.

### `verified_conversions_90d` — proven output (integer)
**Source:** Rolling 90-day count of AI-verified customers this operator delivered across all campaigns. Sourced from `push-attribution`'s verified-scan pipeline (AI-verified only — flagged/failed scans excluded).

**Why it matters:** "Completed 12 campaigns" says nothing about outcome — a creator can run many campaigns and convert few. `verified_conversions_90d` is the north-star output metric. A creator with 47 verified conversions in 90 days is a meaningfully different asset than one with 6.

**Agent usage:** Tiebreaker within a tier + affinity band. Also used in operator profile badges ("47 verified customers last 90d").

**Not retroactive into Push Score:** The 5-dimension Push Score formula stays intact. `verified_conversions_90d` is a parallel signal the agent reads, not an input to the 0-100 score.

### Williamsburg coffee priority flag (beachhead-only)
The agent applies a hard priority for Williamsburg coffee goals:
- `coffee_affinity > 0.7` AND `distance_miles < 1.2` from zip 11211 → **first-pass routing regardless of tier**.
This flag is beachhead-specific and retires once we leave Williamsburg-only mode.

---

---

## 5 Scoring Dimensions

### 1. Completion Rate (30% weight)
**Formula:** `(Completed / Accepted) × 100`

| Completion % | Points |
|---|---|
| 95-100% | 30 |
| 85-94% | 24 |
| 70-84% | 18 |
| 50-69% | 10 |
| <50% | 0 |

**Rationale:** First and foremost — did you finish what you promised?

---

### 2. Reliability (20% weight)
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

### 3. Content Quality (25% weight)
**Formula:** `(Avg merchant content rating / 5) × 100`

| Merchant Rating | Points |
|---|---|
| 4.5-5.0 ⭐ | 25 |
| 3.5-4.4 | 19 |
| 2.5-3.4 | 12 |
| <2.5 | 5 |

**Rationale:** Does the content actually drive the merchant's business?

---

### 4. Merchant Satisfaction (15% weight)
**Formula:** `(Avg rebook score / 5) × 100`

| Rebook Score | Points |
|---|---|
| 4.5-5.0 ⭐ | 15 |
| 3.5-4.4 | 11 |
| 2.5-3.4 | 7 |
| <2.5 | 0 |

**Rationale:** Would the merchant hire you again? This is the ultimate quality signal.

---

### 5. Engagement Proxy (10% weight)
**Formula:** `min((Avg engagement rate / 3%) × 100, 100)`

| Engagement Rate | Points |
|---|---|
| >3% | 10 |
| 2-3% | 7 |
| 1-2% | 4 |
| <1% | 2 |

**Rationale:** Audience resonance matters, but is capped at 10% to prevent follower-only creators from gaming the system.

---

## Cold Start Scoring

**New Creators:**
- Display "New" badge; no visible score
- Internal provisional score starts at **50** (eligible for Seed tier)
- After **2 completed campaigns** → real score calculated, tier assigned based on performance
- Fast track: If first 2 campaigns complete AND avg merchant rating ≥ 4.0 AND score ≥ 55 → jump to Operator

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

When a campaign completion is disputed:

| Outcome | Score Impact |
|---|---|
| Creator at fault (no-show, fake proof, low quality) | -15 |
| Partially at fault (communication breakdown) | -8 |
| Not at fault (merchant issue) | 0 |
| Resolved in creator's favor (merchant false claim) | +2 |

**Rationale:** Disputes are rare; when they happen, significant penalty ensures bad actors exit. Creators wrongly accused get a modest bonus to restore trust.

---

## Tier Transition Rules

### Promotion
- **Condition:** Score at or above tier threshold for **2 consecutive campaigns**
- **Timing:** Auto-applied end-of-campaign
- **From Seed:** Complete 2 campaigns + provisional score ≥ 40 → auto-promote to Explorer
- **Upgrade nudge:** Seed creators receive $5 cash bonus upon completing 2nd campaign (acceleration incentive)

### Fast Track (Updated v4.1)
- **Condition:** Score ≥ 55 achieved within first 2 campaigns + avg merchant rating ≥ 4.0
- **Effect:** Skip Explorer, jump directly to Operator
- **Rationale:** Threshold aligned with Operator entry (55+), not Proven (65+). Exceptional newcomers earn Operator access; they still need to prove sustained performance for further promotion.

### Demotion (Updated v4.1)
- **Grace period:** Score falls below tier threshold → **30-day grace window** (time-based, not campaign-count-based)
- **During grace period:** Commission rate drops to next-lower-tier rate; payout speed and concurrent campaign limit remain unchanged
- **After grace period:** If score still below threshold at end of 30 days, full demotion applied
- **Exception:** Demotion never happens during active campaign; evaluated between campaigns
- **Notification:** Creator receives warning immediately when score drops below threshold; reminder at day 15; demotion applied at day 30 if unrecovered

**Why time-based instead of campaign-based:** Campaign-based (old: 3 campaigns) allowed creators to stall — do nothing for months and retain tier. Time-based ensures consistent accountability. The commission-rate drop during grace period prevents exploiting high-tier benefits with low-tier performance.

---

## Anti-Gaming Measures

| Attack Type | Detection Mechanism | Defense |
|---|---|---|
| Cherry-picking easy campaigns | Track campaign difficulty/riskiness distribution | Require balanced mix (at least 1 each of food type, time slot, location) for promotion |
| Fake engagement (buying likes) | Spike analysis; follower/engagement ratio test | Engagement = only 10% of score; easy to game but capped |
| Merchant collusion | Repeated same-merchant pairing | Flag any creator-merchant pair with >3 consecutive campaigns; audit ratings |
| Low-quality rushing | Merchant content rating | Quality = 25% of score; high quality required for tier progression |
| Multi-accounting | Device fingerprint + IP tracking | Link accounts sharing same device; one account per creator |
| Milestone bonus gaming | Abnormal referral spike patterns | Cross-reference referral IPs/devices; flag self-referral patterns |

---

## Phase 1 Spreadsheet Formula

**Columns:** Creator name | Campaigns accepted | Completed | Completion rate | On-time submissions | Reliability | Avg content rating | Avg rebook score | Avg engagement rate | Push Score | Tier

**Excel formula:**
```
=((D×0.30)+(F×0.20)+((G/5)×0.25)+((H/5)×0.15)+(MIN(I/0.03,1)×0.10))×100
```

**Explanation:**
- `D` = Completion rate (already %)
- `F` = Reliability (already %)
- `G` = Avg content rating (1-5 scale)
- `H` = Avg rebook score (1-5 scale)
- `I` = Avg engagement rate (as decimal, e.g., 0.025 for 2.5%)
- `MIN(I/0.03,1)` = Caps engagement contribution at 100%
