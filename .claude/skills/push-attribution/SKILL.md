---
name: push-attribution
description: "Push v5.1 attribution, verification, and compliance system: 3-layer verification (QR + Claude Vision OCR + geo-match) produces labels that feed ConversionOracle — the proprietary walk-in prediction model and core Vertical AI for Local Commerce moat. Plus DisclosureBot FTC pre-screen, fraud detection, and integrity ops. Use for any attribution, verification, ConversionOracle data-moat, DisclosureBot compliance, or fraud question."
---

# Push Attribution, ConversionOracle & DisclosureBot — Complete Reference (v5.1)

> **v5.1 core change (2026-04-18):** attribution is no longer QR-only and no longer just a measurement layer. A scan is verified by **3 layers — QR + Claude Vision receipt OCR + geo-match — all three must pass in < 8 seconds** for an auto-verified payout. The v4 QR-only path still records reach (every scan writes `qr_scans`), but payout release now depends on the verification verdict. **Most importantly for v5.1:** every verified label is training data for **ConversionOracle**, the proprietary walk-in prediction model that is the core Vertical AI for Local Commerce data moat. A separate compliance layer — **DisclosureBot** — gates creator publishing under FTC 16 CFR Part 255 and is distinct from verification.

---

## 1. The 3-Layer Verification Pipeline (AUTHORITATIVE — v5.1, mechanics unchanged since v5.0)

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
| `auto_verified` | All three layers pass | Creator payout released automatically; merchant billed the v5.1 per-vertical per-customer rate (see push-pricing for the vertical-rate table) |
| `auto_rejected` | `merchant_match_confidence < 0.35` (fundamentally different business) | **No charge, no payout**. Terminal. |
| `manual_review` | At least one threshold missed but not hard-rejected (e.g., confidence `0.35–0.85`, geo > 200 m, or vision API error) | Queued in `/admin/ai-verifications` for ops |
| `human_approved` | Ops resolved a `manual_review` to approve | Same effect as `auto_verified` |
| `human_rejected` | Ops resolved a `manual_review` to reject | Same effect as `auto_rejected` |

**v5.1 plan-gated manual-review priority.** Verification thresholds (0.85 / 0.35 / 200 m) are unchanged, but the manual-review queue is now plan-aware: **Operator+ merchants get priority placement in `/admin/ai-verifications`** (24 h SLA, front-of-queue), while Pilot cohort and direct-signup merchants below Operator tier sit in the standard FIFO queue (24–48 h). Plan tier is read from the merchant record at insert time and written to a `queue_priority` field on the row so ops can sort/filter. Thresholds and verdict enum remain global — only the queue order changes.

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
- `conversion_oracle_predicted` (NUMERIC(4,3), **nullable**) — **v5.1 new.** The walk-in probability ConversionOracle predicted for this (creator × campaign × merchant × context) pair *before* this verification event landed. Null when the prediction service is unavailable or the feature flag is off. Used post-hoc to measure Oracle accuracy: `|conversion_oracle_predicted − actual_walk_in_indicator|`, where `actual_walk_in_indicator = 1` iff `verdict ∈ {auto_verified, human_approved}`. See §11 for model-training flywheel.
- `queue_priority` (SMALLINT) — **v5.1 new.** `0` = standard, `1` = Operator+. Drives sort order in `/admin/ai-verifications` manual-review queue (§1).
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

## 10. Roadmap (post-v5.1)

- **Prompt versioning** — add `prompt_version` / `model_snapshot` columns to `ai_verifications` so we can A/B prompts without data loss.
- **Receipt line-item extraction** — push beyond merchant/total into SKU-level data for category-share insights.
- **Fraud pattern auto-flagging** — feed the `agent_runs` log into an anomaly model that pre-flags suspicious verifications before they hit the human queue.
- **Milestone anomaly detection** — flag unusual referral patterns near bonus thresholds, trained on accumulated `agent_runs` data.

These extend the v5.1 schema; no breaking changes anticipated.

---

## 11. ConversionOracle Data Moat (v5.1 — AUTHORITATIVE)

> **What ConversionOracle is — and what it is NOT.** ConversionOracle is the proprietary **walk-in prediction model** and the core Vertical AI for Local Commerce data moat. It is **not** the verification layer. Verification (§1) is what produces the *labels*. ConversionOracle is the *model that learns from those labels* to predict, before a campaign is ever run, how many customers a given (creator × merchant × offer × context) combination will actually walk in. This distinction is load-bearing: if you blur the two, the moat thesis collapses.

### 11.1 The inversion: verification is the training-data pipeline

Every `ai_verifications` row with a verdict in `{auto_verified, human_approved, auto_rejected, human_rejected}` is a labelled training example. Verification is expensive (Claude Vision + geo + ops review) — but *because* we already paid that cost to settle creator payouts, we get the labels for free on the ML side. Competitors who bolt on "AI-powered matching" without a verification spine cannot get these labels and cannot train this model. That is the cold-start barrier.

### 11.2 Training features (input vector)

The ConversionOracle feature vector for any (proposed creator × proposed campaign × merchant × moment) is assembled at prediction time from:

1. `creator_profile` — tier, vertical history, audience geo/age/gender skew, prior `ai_verifications` walk-in rate, Push Score history
2. `content_style` — content format (reel / photo / carousel / Story), length, captioning style embedding, past winning-post embedding
3. `content_timestamp` — proposed publish time in creator's audience timezone
4. `merchant_category` — vertical (coffee, pizza, nails, gym, etc.) and sub-segment
5. `merchant_location` — neighborhood polygon + specific (lat, lng)
6. `offer_type` — Hero vs Sustained, item category, discount depth, slot count
7. `neighborhood` — neighborhood-level priors aggregated across all Push campaigns there
8. `weather` — forecasted weather at campaign window (temp, precipitation, wind)
9. `time_of_day` — hour bucket for scan window
10. `day_of_week` — 0–6 plus holiday flags

### 11.3 Training label (output)

- **Primary label:** `walk_in = 1` if at least one `ai_verifications` row with verdict `auto_verified` or `human_approved` is attributed to this (creator, campaign, merchant) triple within the 30-day last-click attribution window (§6); else `0`.
- **Secondary label (v2+):** `customer_LTV = $X` — sum of OCR-extracted `amount_usd` across the verified customer's attributable visits plus any repeat visits inside the attribution window.

### 11.4 Training flywheel — four stages by event volume

The model lifecycle is calibrated to the Williamsburg Coffee+ beachhead (push-gtm). Each stage defines what's in production and what accuracy target is honest to claim:

| Stage | Window | Cumulative events | Production model | Accuracy target | Notes |
|---|---|---|---|---|---|
| **Stage 1 — Cold start** | Day 1–60 | 500–1,000 verified events | Claude API zero-shot + rule-based heuristics (neighborhood category priors, simple creator-tier lookup) | Not measured — too few labels for honest cross-val | Predictions shadow-logged to `conversion_oracle_predicted` to start the accuracy-over-time curve |
| **Stage 2 — v1 fine-tune** | Month 3–6 | 1,000–5,000 verified events | v1 supervised model fine-tuned on the first coffee × Williamsburg cohort | **±25%** absolute walk-in count error at the campaign level | First honest "our model" — still single-vertical, single-neighborhood |
| **Stage 3 — v2 + LTV** | Month 6–12 | 10,000–25,000 verified events | v2 multi-vertical + multi-neighborhood; adds customer-LTV prediction head | **±15%** walk-in count; LTV MAPE target set separately | Unlocks "per-vertical outcome pricing" defensibility — we can quote outcome pricing because we can forecast it |
| **Stage 4 — v3 cohort-specific** | Month 12–24 | 50,000–200,000 verified events | v3 cohort-specific (creator archetype × merchant archetype × neighborhood) + **30-second first-campaign ROI prediction** | **±10%** walk-in count; 30s P95 inference for new-merchant onboarding | Real-time ROI estimate during the merchant signup flow — the product demo that converts cold merchants on the spot |

### 11.5 The four-layer moat

ConversionOracle's defensibility decomposes into four distinct layers. Any competitor has to break all four to catch up:

1. **Data exclusivity** — verified walk-in labels only exist because we run the 3-layer verification. No public dataset contains `(creator_profile, content_timestamp, neighborhood, weather, offer_type) → walk_in`. Competitors either don't have a verification spine (so no labels) or have one but haven't been running it long enough.
2. **Cold-start barrier** — Stage 1 requires burning $4,200 × N neighborhoods of Pilot spend to generate the first 500–1,000 events. A competitor attempting to clone the model cold has to eat the same burn before they can even start fine-tuning.
3. **Long-tail advantage** — cohort-specific cells (e.g., "micro-creator × family-owned pizzeria × Williamsburg × Saturday morning × 45°F rain") only become statistically meaningful above ~10,000 events. Below that, the model is frequentist-noisy. We reach those cells first, per-vertical, per-neighborhood, and each additional verified event strictly increases our long-tail lead over any late entrant.
4. **Compound effect** — better predictions → better matching → higher verified-walk-in rate → more labels per unit Pilot spend → faster retraining cadence → better predictions. The flywheel accelerates as volume grows; a late entrant faces a model that is improving faster than theirs can start.

### 11.6 Relationship to verification thresholds

ConversionOracle never overrides the 3-layer verification verdict. Verification thresholds (0.85 / 0.35 / 200 m) are policy, not predictions. The prediction is strictly *ex-ante* — written to `conversion_oracle_predicted` on the `ai_verifications` row before the event is classified. Post-hoc, accuracy is measured as the delta between predicted walk-in probability and realized `verdict ∈ {auto_verified, human_approved}`. This is why the column is **nullable**: if the Oracle service was down or disabled for a given event, we simply don't have a prediction to grade, and we do not retroactively fill one in.

---

## 12. DisclosureBot — FTC 16 CFR Part 255 Pre-Screen (v5.1)

> **What DisclosureBot is — and what it is NOT.** DisclosureBot is the automated **FTC 16 CFR Part 255** compliance layer that pre-screens creator posts *before they go live*. It is not part of verification. It does not see customer receipts. It does not affect creator payout. It **gates publishing**, not verifying. Verification asks "did a customer actually walk in?" — DisclosureBot asks "is this creator post legally compliant before it reaches an audience?" Conflating the two produces wrong downstream decisions in every direction.

### 12.1 Where DisclosureBot sits in the lifecycle

DisclosureBot runs at **post-publish time** — specifically, during **Phase 4 — Campaign Execution** as defined in push-campaign. The sequence for any creator post is:

1. Phase 3 matching completes → creator accepts campaign.
2. Creator drafts content using the v5.0 AI brief (push-campaign).
3. **DisclosureBot pre-screen runs at post-publish time.** The creator submits the post via the Push creator portal; DisclosureBot inspects the media (image / video / caption) and classifies FTC disclosure adequacy **before** the post is allowed to actually publish to the creator's distribution.
4. If DisclosureBot passes → Push publishes (or confirms the creator may publish) and the campaign goes live. Attribution (QR + verification, §1) then runs on customer arrivals.
5. If DisclosureBot fails → the creator receives structured remediation guidance (what to add, where, in what form); publishing is blocked until the creator resubmits and re-passes.

### 12.2 What it checks

Claude-based classifier inspects the proposed post for the 16 CFR Part 255 disclosure requirements:

- **Presence** — is there a material-connection disclosure at all?
- **Clarity** — is the disclosure in language the average viewer of that platform would understand?
- **Prominence** — is it placed such that a reasonable viewer sees it without hunting (above the fold / at the start of caption / in-video overlay where applicable)?
- **Format-specific rules** — platform-specific adequacy (e.g., #ad alone may be insufficient on certain surfaces; spoken disclosures required for some video formats).

Output is a structured verdict: `{pass, fail, reason_codes[], remediation_guidance}`. The `agent_runs` table (§4) logs every DisclosureBot invocation for cost tracking and future compliance audit.

### 12.3 Why it's separate from verification

| Concern | DisclosureBot | 3-Layer Verification |
|---|---|---|
| What it gates | Creator post publishing | Creator payout + merchant billing |
| When it runs | Post-publish, before content goes live | Customer scan, after purchase |
| Input | Creator-submitted content (image/video/caption) | Customer QR scan + receipt photo + geo |
| Label semantics | Compliance adequacy | Walk-in authenticity |
| Failure consequence | Post blocked; creator remediates | Payout withheld; merchant unbilled |
| Data moat role | None (compliance layer, not a prediction training input) | Generates ConversionOracle training labels |

DisclosureBot is a compliance brain; ConversionOracle is a conversion brain. They do not share model weights, training data, or latency budgets. Keeping them architecturally separate is what lets each ship and scale independently — and is why push-brand-voice lists them as distinct architectural primitives.

### 12.4 Integration point with push-campaign

DisclosureBot bridges push-attribution and push-campaign: push-attribution owns the **implementation and data contract**, push-campaign owns the **workflow placement** (Phase 4 — Campaign Execution). If the DisclosureBot verdict is `fail`, the campaign workflow blocks transition out of Phase 4 until remediation passes. See push-campaign §Phase 4 for the workflow-side view.
