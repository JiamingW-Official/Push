---
name: push-attribution
description: "Push attribution & verification system: QR scan + Claude Vision receipt OCR + geo-match, 3-layer verdict pipeline, fraud detection, and integrity operations. Use for any attribution, verification, or fraud question."
---

# Push Attribution & Integrity — Complete Reference (v5.0)

> **v5.0 core change (2026-04-18):** attribution is no longer QR-only. A scan is verified by **3 layers — QR + Claude Vision receipt OCR + geo-match — all three must pass in < 8 seconds** for an auto-verified payout. The v4 QR-only path still records reach (every scan writes `qr_scans`), but payout release now depends on the verification verdict.

---

## 1. The 3-Layer Verification Pipeline (AUTHORITATIVE — v5.0)

All three layers execute on a single `/api/attribution/scan` request. End-to-end target latency **< 8 seconds** (Claude Vision is the dominant cost).

### Layer 1 — QR scan (always runs)
- Unique QR code per (creator × campaign) pairing. Unchanged from v4.
- Writes a `qr_scans` row **first, always**, with: `timestamp`, `creator_id`, `campaign_id`, `scan_source`, `ip_hash`.
- Records the scan **regardless of verification outcome** — useful for reach tracking, funnel analytics, and creator dashboards even when no receipt is submitted.
- This layer is also where fraud dedup runs (see §5).

### Layer 2 — Claude Vision receipt OCR (new in v5.0)
- Customer uploads a photo of their receipt via the creator-delivered form or in-app flow.
- **Claude Sonnet 4.6** extracts: `merchant_name`, `amount_usd`, `timestamp_iso`, `confidence`.
- A fuzzy string match runs between the OCR-extracted `merchant_name` and the registered `merchant.business_name`, producing `merchant_match_confidence ∈ [0, 1]`.

**Thresholds (exact):**

| `merchant_match_confidence` | Outcome |
|-----------------------------|---------|
| `>= 0.85` | Layer 2 **pass** |
| `>= 0.35` and `< 0.85` | Layer 2 **manual_review** (ambiguous) |
| `< 0.35` | Layer 2 **hard reject** — receipt is from a fundamentally different business. Verdict immediately becomes `auto_rejected`, no charge, no payout |

### Layer 3 — Geo-match (new in v5.0)
- Compare customer scan `(lat, lng)` against the merchant's registered `(lat, lng)`.
- Distance computed via the **haversine** formula.

**Threshold (exact):**

| `haversine_distance_meters` | Outcome |
|-----------------------------|---------|
| `<= 200` | Layer 3 **pass** |
| `> 200` | Layer 3 **fail** → `manual_review` (not auto-rejected — geo can drift indoors, customer may scan just outside the door) |

### Verdict matrix

The verdict is written once to `ai_verifications.verdict`. Exactly five values are allowed — **no others may be introduced**:

| Verdict | When it fires | Billing / payout effect |
|---------|---------------|-------------------------|
| `auto_verified` | All three layers pass | Creator payout released automatically; merchant billed **$40 / customer** |
| `auto_rejected` | `merchant_match_confidence < 0.35` (fundamentally different business) | **No charge, no payout**. Terminal. |
| `manual_review` | At least one threshold missed but not hard-rejected (e.g., confidence `0.35–0.85`, geo > 200 m, or vision API error) | Queued in `/admin/ai-verifications` for ops |
| `human_approved` | Ops resolved a `manual_review` to approve | Same effect as `auto_verified` |
| `human_rejected` | Ops resolved a `manual_review` to reject | Same effect as `auto_rejected` |

---

## 2. Mock vs Live Mode

`lib/ai/vision.ts` is environment-driven so dev/CI can run without a paid API.

| `ANTHROPIC_API_KEY` state | Behavior |
|---------------------------|----------|
| **Unset** | `vision.ts` returns a **deterministic**, **CI-safe** mock. The mock passes verification when the expected merchant name is provided, fails otherwise. No network call, no cost, reproducible across runs. |
| **Set** | Real Claude Vision call via the Anthropic Messages API with image input (base64, multipart). Latency, cost, and response JSON captured on the `ai_verifications` row (`vision_latency_ms`, `vision_cost_usd`, `vision_response`). |

The `mock: true | false` flag is echoed on the API response so callers can assert which mode ran.

---

## 3. Data Flow — `/api/attribution/scan`

**Request body:**
```
{
  qrId, campaignId, creatorId, merchantId, sessionId,
  receiptImageBase64?, mediaType?, geoLat?, geoLng?
}
```

**Server-side sequence:**
1. Insert `qr_scans` row (Layer 1 — always happens, even if the receipt fields are absent).
2. If a receipt is provided → run 3-layer verification via `lib/ai/vision.ts` → insert `ai_verifications` row with the computed verdict, all score fields, and raw Vision response JSON.
3. If no receipt → no `ai_verifications` row; the scan is tracked for reach but cannot auto-release a payout.

**Response shape:**
```
{ ok, scanId, verdict, merchantMatchConfidence, geoDistanceMeters, amountUsd, model, mock }
```

---

## 4. Supabase Schema

**Migration:** `supabase/migrations/20260418000001_add_ai_verifications_and_agent_runs.sql`

**Table: `ai_verifications`**
- `id` (uuid, PK)
- `scan_id` → `qr_scans(id)` FK
- `merchant_id` → `merchants(id)` FK
- `receipt_image_url`, `receipt_image_hash` — raw inputs, never shown to end users
- `scan_lat`, `scan_lng`
- `vision_response` (JSONB) — raw Claude output
- `vision_model`, `vision_latency_ms`, `vision_cost_usd` — runtime metadata
- `merchant_match_confidence` (NUMERIC(3,2), 0–1)
- `amount_extracted` (NUMERIC(10,2))
- `geo_distance_meters` (INTEGER)
- `verdict` — CHECK-constrained to the exact 5-value enum
- `reviewed_by_human` (BOOLEAN)
- `reviewed_by_user_id` → `users(id)` FK
- `review_notes`
- `created_at`, `resolved_at`

**RLS:** Merchants see only their own rows, scoped via `merchants.user_id = auth.uid()`. Service-role inserts from the scan route bypass RLS.

**Indexes:** `scan_id`, `merchant_id`, `(verdict, created_at DESC)` — the last one backs the `/admin/ai-verifications` queue view.

A sibling `agent_runs` table in the same migration logs every Claude invocation (match_creators, draft_brief, predict_roi, verify_receipt) for cost tracking and future fine-tuning data.

---

## 5. Fraud Detection (unchanged from v4 — still the primary pre-verdict filter)

### QR scan deduplication
- **15-minute cooldown per `(device_fingerprint × qr_id)` pair.**
- Duplicate scans within the cooldown window are flagged and withheld pending review (not silently dropped — they still write a `qr_scans` row with a flag for audit).

### Fraud types & signals

| Type | Description | Detection |
|------|-------------|-----------|
| 1. Fake Fulfillment | Creator claims visit without genuine engagement | QR scan timestamp mismatch, content shows no real visit, photo metadata |
| 2. Fake Merchant Validation | Merchant confirms false completion (friend's business) | Repeated same-merchant/creator pairing (>3 consecutive), unusually high confirmation rate |
| 3. Fake Redemption | Self-redemption, friend loops, repeat abuse of a referral | Same-device scans within cooldown, same IP clustering, unusual timing, repeat QR scans from same user |
| 4. Engagement Inflation | Buying likes/views | Engagement spike analysis, follower ratio anomaly; kept at 10% weight so not worth gaming |
| 5. Collusion | Merchant-creator coordination to extract platform value | Repeated pairing patterns, unusual completion/satisfaction scores, geographic anomalies |
| 6. Milestone Bonus Gaming | Creator generates fake referrals to hit bonus threshold | Cross-reference referral device IDs/IPs, self-referral patterns, unusual clustering (e.g., 20 txns in 1 hour) |

### Integrity risk signals
- Sudden performance spikes
- Unnatural proof timing patterns
- Same-device/location across multiple "different" users
- Suspicious redemption clustering
- High completion rate + weak merchant satisfaction (gaming indicator)
- Referral transaction spikes near milestone threshold

---

## 6. 30-Day Last-Click Attribution Window (unchanged from v4)

- All transactions through a creator's referral link within **30 days** count toward their commission + milestone bonus.
- Supports tracking of repeat purchases driven by initial creator content.
- **Last-click attribution** — the most recently used referral link gets full attribution:
  - Consumer clicks Creator A on Monday, Creator B on Wednesday → visits store Thursday → **Creator B attributed**.
  - Repeat visit within 30 days without a new click → attribution stays with the last clicked creator.
  - New creator link click → 30-day window resets to the new creator.
- Creator dashboard shows: link clicks, store visits (QR scans), conversion rate, active referrals in 30-day window, days remaining, milestone progress.
- Creators do **not** see which other creators are promoting the same merchant (prevents competitive friction).

---

## 7. Review Tiers & Enforcement

### Three-tier review system

| Tier | Who | Action | SLA |
|------|-----|--------|-----|
| **Tier 1 — Passive** | Trusted users, clean history, `auto_verified` verdict | Auto-approve; 10% random spot-check | n/a |
| **Tier 2 — Triggered** | `manual_review` verdict, specific risk flag | Manual review in `/admin/ai-verifications` | 24 h |
| **Tier 3 — Investigation** | Disputes, repeated patterns, suspected collusion | Full investigation; settlement held | 48 h |

### Enforcement ladder
Warning → score reduction → tier downgrade → payout delay → campaign ineligibility → suspension → permanent removal.

Principles: **explainable, consistent, proportional**. Every enforcement action must be justifiable and communicated clearly.

---

## 8. Promotional Offer Structure (unchanged — context for merchants)

> **Key insight:** Unlike TGTG (which sells surplus at near-zero marginal cost), Push asks merchants to provide NEW promotional items. Cost is real, so merchants need control over budget.

**Two-Tier Offer System (merchant-configurable):**

| Offer Tier | What Consumer Gets | Slots | Who Sets It |
|-----------|--------------------|-------|-------------|
| **Tier 1 (Hero Offer)** | Free product or deep discount | Merchant chooses: 5 / 10 / 15 / 20 | Merchant selects from templates |
| **Tier 2 (Sustained Offer)** | Smaller discount (e.g., 15% off, $2 off) | Unlimited or merchant-set cap | Merchant defines amount |

Both tiers count toward the creator's referral transaction count (commission + milestone bonus).

---

## 9. Data Captured Per Verified Scan

- Which creator brought how many customers
- Spend amount per referred customer (from OCR-extracted `amount_usd`)
- Customer spending level and preferences
- Most popular items (long-tail, from receipt line items when Vision surfaces them)
- Repeat visit behavior
- Hero vs Tier 2 redemption ratio (optimization signal)
- Referral transaction count per creator per month (milestone bonus tracking)
- Vision cost + latency per verification (infra cost KPIs)

---

## 10. Roadmap (post-v5.0)

- **Prompt versioning** — add `prompt_version` / `model_snapshot` columns to `ai_verifications` so we can A/B prompts without data loss.
- **Receipt line-item extraction** — push beyond merchant/total into SKU-level data for category-share insights.
- **Fraud pattern auto-flagging** — feed the `agent_runs` log into an anomaly model that pre-flags suspicious verifications before they hit the human queue.
- **Milestone anomaly detection** — flag unusual referral patterns near bonus thresholds, trained on accumulated `agent_runs` data.

These extend the v5.0 schema; no breaking changes anticipated.
