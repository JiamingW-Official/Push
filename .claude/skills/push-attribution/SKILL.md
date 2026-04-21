---
name: push-attribution
description: "Push attribution system (QR code), verification framework, fraud detection, and integrity operations. Use for any attribution, verification, or fraud question."
---

# Push Attribution & Integrity — Complete Reference

## 1. QR Code Attribution System (Updated 2026-04-12)

### How It Works
1. Each campaign, each participating creator gets a **unique referral ID**
2. Creator publishes content with referral link
3. Fans access referral page via creator's link
4. At the store, consumer scans **merchant's QR code** at checkout (NOT merchant scans consumer)
5. Referral page shows "Activated! Referred by [Creator Name]" + countdown verification code
6. Consumer shows confirmation screen to barista → receives offer/discount

### Design Principles
- **Zero merchant ops burden:** Merchant places ONE daily-rotating QR code at register. Done.
- **No consumer registration required:** Just a webpage showing referral confirmation
- **Transaction-level attribution:** Creator → fan → transaction → repeat purchase — complete chain

### Multi-Creator Attribution Rules (NEW — v4.1)
When multiple creators promote the same merchant simultaneously:

**Last-click attribution:** The most recently used referral link gets full attribution.
- Consumer clicks Creator A's link on Monday, Creator B's link on Wednesday → visits store Thursday → **Creator B gets attribution**
- If consumer visits again within 30 days without clicking any new link → attribution stays with Creator B
- If consumer clicks Creator C's link → attribution window resets to Creator C

**Dashboard transparency for creators:**
- Each creator can see: link clicks, store visits (QR scans), conversion rate, active referrals in 30-day window
- Creators do NOT see which other creators are promoting the same merchant (prevents competitive friction)
- Milestone progress tracker: "23/30 referral transactions this month — $15 bonus at 30!"

### Promotional Offer Structure (Updated v4.1 — replaces old TGTG model)

**Key insight:** Unlike TGTG (which sells surplus inventory at near-zero marginal cost), Push asks merchants to provide NEW promotional items. Cost is real, so merchants need control over budget.

**Two-Tier Offer System (merchant-configurable):**

| Offer Tier | What Consumer Gets | Slots | Who Sets It |
|-----------|-------------------|-------|-------------|
| **Tier 1 (Hero Offer)** | Free product or deep discount (e.g., free coffee, BOGO) | Merchant chooses: 5 / 10 / 15 / 20 | Merchant selects from templates |
| **Tier 2 (Sustained Offer)** | Smaller discount (e.g., 15% off, $2 off) | Unlimited or merchant-set cap | Merchant defines amount |

**Default recommendations by merchant plan:**
- Starter: 5 Hero slots + 15% off Tier 2 (keeps total promo cost ~$40-60/campaign)
- Growth: 10 Hero slots + 20% off Tier 2 (total promo cost ~$80-120/campaign)
- Pro: 15-20 Hero slots + custom Tier 2 (total promo cost ~$120-200/campaign)

**Why two tiers:**
1. **Hero Offer** creates FOMO + social sharing ("I got a FREE coffee from [merchant]!")
2. **Sustained Offer** ensures referral links stay valuable after Hero slots fill → no cliff-edge drop in referral traffic
3. Merchant controls total budget by setting Hero slot count + Tier 2 discount level
4. Both tiers count toward creator's referral transaction count (commission + milestone bonus)

**Campaign setup flow:**
1. Merchant selects campaign template
2. Platform suggests Hero slot count + Tier 2 discount based on plan + category
3. Merchant adjusts within allowed range
4. Platform calculates estimated promo cost and shows to merchant
5. Merchant confirms and preloads funds if needed

### Data Captured
- Which creator brought how many customers
- Spend amount per referred customer
- Customer spending level and preferences
- Most popular items
- Repeat visit behavior
- **Hero vs Tier 2 redemption ratio** (optimization signal)
- **Referral transaction count per creator per month** (milestone bonus tracking)

## 2. Five Layers of Verification

### Layer 1: Fulfillment Verification
- Visit proof (QR scan timestamp + location)
- Creator actually visited the location
- Merchant QR code scanned = visit confirmed

### Layer 2: Content Verification
- Live URL of published post
- Screenshot backup
- Posting timestamp
- Content persistence check (still live after X days)
- Content matches campaign requirements

### Layer 3: Engagement Context (Directional Only)
- Views, clicks, saves, map opens
- NOT used for scoring heavily (most gameable)
- 10% weight in Push Score

### Layer 4: Merchant-Side Action
- QR code redemptions tracked (Hero + Tier 2 separately)
- Booking/reservation evidence
- Check-in counts during campaign window
- Event attendance numbers

### Layer 5: Repeat Signal
- Repeat booking by same merchant
- Creator tier progression
- Campaign success pattern data

## 3. Confidence Levels

| Level | Criteria | Action |
|-------|---------|--------|
| Low | Content posted, light engagement, no redemption | Flag for review |
| Medium | Content posted, visit confirmed, limited merchant action | Standard payout |
| High | Content posted, visit confirmed, redemption/QR evidence | Full payout + score boost |

## 4. Attribution by Campaign Type

| Type | Key Verification |
|------|-----------------|
| Sampling | QR scan + content published + product claimed |
| Event Fill | RSVP + check-in + QR code usage |
| Product Launch | Content published + first-wave claims + repeat demand |
| Off-Peak Traffic | Time-window QR scans + visit count |

## 5. Fraud Types & Detection

### Type 1: Fake Fulfillment
Creator claims visit without genuine engagement.
**Detection:** QR scan timestamp mismatch, content analysis shows no real visit, photo metadata check

### Type 2: Fake Merchant Validation
Merchant confirms false completion (e.g., friend's business).
**Detection:** Repeated same-merchant/creator pairing (>3 consecutive), unusually high confirmation rate

### Type 3: Fake Redemption
Self-redemption, friend loops, repeat abuse of single referral.
**Detection:** Same-device scans, same IP, unusual redemption timing, repeat QR scans from same user

### Type 4: Engagement Inflation
Buying likes/views to inflate metrics.
**Detection:** Engagement spike analysis, follower/engagement ratio anomaly, engagement only 10% of score (not worth gaming)

### Type 5: Collusion
Merchant-creator coordination to extract platform value.
**Detection:** Repeated pairing patterns, unusual completion/satisfaction scores, geographic anomalies

### Type 6: Milestone Bonus Gaming (NEW)
Creator generates fake referral transactions to hit milestone threshold.
**Detection:** Cross-reference referral device IDs/IPs, flag self-referral patterns, unusual transaction clustering (e.g., 20 transactions in 1 hour), repeat same-device referrals

## 6. Integrity Risk Signals
- Sudden performance spikes
- Unnatural proof timing patterns
- Same-device/location across multiple "different" users
- Suspicious redemption clustering
- High completion rate + weak merchant satisfaction (gaming indicator)
- **Referral transaction spikes near milestone threshold** (bonus gaming indicator)

## 7. Three-Tier Review System

### Tier 1: Passive (Low Risk)
- Trusted users with clean history
- Auto-approve if proof meets standard criteria
- Spot-check 10% randomly

### Tier 2: Triggered (Medium Risk)
- Specific risk flag detected
- Manual review of flagged items
- 24-hour review SLA

### Tier 3: Investigation (High Risk)
- Disputes, repeated patterns, suspected collusion
- Full manual investigation
- 48-hour resolution SLA
- Settlement held during investigation

## 8. Enforcement Ladder
Warning → Score reduction → Tier downgrade → Payout delay → Campaign ineligibility → Suspension → Permanent removal

Principles: Explainable, consistent, proportional. Every enforcement action must be justifiable and communicated clearly.

## 9. AI Verification Roadmap (Agentic Phase 1)
When Push reaches 50+ campaigns:
- **Content quality auto-scoring:** Multimodal AI analyzes composition, lighting, brand fit
- **Proof-of-visit auto-verification:** Geo-tag + timestamp + visual scene analysis
- **Fraud pattern recognition:** Anomaly detection on redemption, timing, pairing patterns
- **Receipt/QR OCR:** Automatic verification of transaction records
- **Milestone anomaly detection:** Flag unusual referral patterns near bonus thresholds

This is the highest-ROI AI investment — it's the largest ops cost AND it strengthens Push's core trust layer.

## 10. 30-Day Attribution Window
- All transactions through a creator's referral link within 30 days count toward their commission + milestone bonus
- Enables tracking of repeat purchases driven by initial creator content
- Window resets if consumer uses a different creator's link (last-click attribution)
- Creator dashboard shows: active referrals, days remaining in window, milestone progress

## 11. Data Schema v1 (v5.3)

**Authoritative spec**: [`/spec/data-schema-v1.md`](/spec/data-schema-v1.md)
**Migration**: `supabase/migrations/20260506_push_transactions_v5_3.sql`
**Table**: `public.push_transactions`

Each verified attribution event becomes one row in `push_transactions`. This table is the **ground-truth label source** for the Physical-World Ground Truth Layer (v5.3 positioning) and the primary training substrate for any future Local Commerce World Model work. Every QR-scan redemption in production flows through this schema — skipping fields at intake means permanently losing them, because historical rows cannot be back-filled for opt-in data (consent, demographics, environment, location).

### 32 字段 at a glance

| Group | Count | Fields |
|---|---|---|
| Identity (first-party) | 5 | transaction_id, device_id_hash, creator_id, merchant_id, customer_id_hash |
| Timing | 4 | claim_timestamp, redeem_timestamp, time_to_redeem_sec (auto), expiry_timestamp |
| Location (opt-in) | 5 | claim_gps_lat/lng, redeem_gps_lat/lng, merchant_dwell_sec |
| Commerce | 5 | product_category, product_sku_hash, order_total_cents, campaign_id, creative_content_hash |
| Demo (opt-in) | 4 | demo_age_bucket, demo_gender, demo_zip_home (3-prefix), demo_ethnicity_bucket |
| Behavioral | 3 | is_first_visit, cross_merchant_count, referral_chain_depth |
| Environmental | 3 | weather_code, local_event_nearby, hour_of_week (auto) |
| Compliance | 3 | consent_version, ftc_disclosure_shown, consent_tier (1/2/3) |

### QR-scan redemption flow — required writes

The redemption handler **must** populate every `NOT NULL` field. Treat any missing value as a bug, not a warning:

- `device_id_hash` — SHA256 of first-party device identifier (never IDFA / GAID).
- `creator_id`, `merchant_id`, `customer_id_hash` — resolved at scan time from the active referral link + merchant session + consumer webpage cookie.
- `transaction_id` — server-generated UUID (default `gen_random_uuid()`).
- `claim_timestamp`, `expiry_timestamp` — captured at the claim step (before scan).
- `redeem_timestamp` — set at scan; `time_to_redeem_sec` is auto-computed by trigger from (redeem − claim).
- `product_category` — constrained enum; must map to one of the 7 category tokens.
- `order_total_cents`, `campaign_id`, `creative_content_hash` — from the POS / campaign / creator-post registry respectively.
- `is_first_visit`, `cross_merchant_count`, `referral_chain_depth` — computed from the Push-internal history at scan time.
- `consent_version`, `ftc_disclosure_shown`, `consent_tier` — stamped from the consumer webpage consent step.

Opt-in fields (location, demo, environment) are NULL unless consumer granted permission at claim time. **`consent_tier=1` rows are excluded from all external data-licensing aggregations** — this is a hard rule, not a suggestion.

### Index coverage (query hot paths)

- `idx_creator_claim` — creator dashboard ("my claims over time")
- `idx_merchant_redeem` — merchant dashboard ("my redemptions, only non-null")
- `idx_campaign_performance` — campaign ops ("this campaign's redemption timeline")
- `idx_device_cross_visit` — cross-merchant behavior, fraud detection

### RLS posture

RLS is ON. Creator reads only rows where their `creators.user_id = auth.uid()` ties to the row's `creator_id`; merchant reads only their own via `merchants.user_id = auth.uid()`. **Writes never go through anon/authenticated clients** — the redemption handler uses the service-role client (see [CLAUDE.md](../../../CLAUDE.md) § Supabase client usage).

### When to update this section

Any change to `push_transactions` schema (new field, new enum value, dropped field) must:
1. Land a new migration file (do not edit the v1 migration).
2. Append a changelog entry in `/spec/data-schema-v1.md`.
3. Update the field count / grouping in this section if totals change.
