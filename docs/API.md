# Push API Documentation

**Status:** v5.2 | Week 3 Complete

This document provides complete API endpoint references for all Push backend routes.

---

## Base URL

- **Development:** `http://localhost:3000/api`
- **Production:** `https://push-demo.vercel.app/api`

All responses are JSON unless otherwise specified.

---

## Health Check

### GET `/health`

Verify API is running.

**Request:**
```bash
curl http://localhost:3000/api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-05-02T10:30:00Z"
}
```

**Status Code:** 200

---

## Admin Dashboard

### GET `/admin/dashboard`

Fetch admin dashboard KPIs.

**Request:**
```bash
curl http://localhost:3000/api/admin/dashboard
```

**Query Parameters:** None

**Response:**
```json
{
  "total_merchants": 5,
  "total_creators": 10,
  "total_loyalty_cards": 15,
  "total_loyalty_cards_completed": 8,
  "gmv_this_week": 4500000,
  "gmv_currency": "USD",
  "avg_punch_through": 82.5,
  "creator_by_stage": {
    "prospect": 3,
    "early_operator": 4,
    "active": 3
  },
  "top_merchants": [
    {
      "id": "uuid",
      "name": "Williamsburg Coffee Co",
      "revenue_this_week": 1200000,
      "creator_count": 2,
      "avg_payout": 4500
    }
  ],
  "ai_verification_status": {
    "approved": 25,
    "rejected": 3,
    "manual_review": 2
  },
  "last_refresh": "2026-05-02T10:30:00Z"
}
```

**Status Code:** 200

**Error Responses:**

| Status | Body | Reason |
|--------|------|--------|
| 503 | `{ "error": "Database connection failed" }` | Supabase offline |

---

## Creator Recruitment

### POST `/internal/recruitment-sync`

Manage creator recruitment pipeline.

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <internal-api-key> (optional for demo)
```

**Request Body:**

#### Action: `recruit`
```json
{
  "action": "recruit",
  "creator_id": "550e8400-e29b-41d4-a716-446655440000",
  "source": "tiktok_dm",
  "score": 65
}
```

#### Action: `move_to_active`
```json
{
  "action": "move_to_active",
  "creator_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### Action: `update_score`
```json
{
  "action": "update_score",
  "creator_id": "550e8400-e29b-41d4-a716-446655440000",
  "score": 78,
  "reason": "completed_campaign"
}
```

#### Action: `churn`
```json
{
  "action": "churn",
  "creator_id": "550e8400-e29b-41d4-a716-446655440000",
  "reason": "inactive_30_days"
}
```

**Response (All Actions):**
```json
{
  "success": true,
  "creator": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Alex Chen",
    "handle": "@alexchen",
    "tier": "active",
    "score": 78,
    "status": "active",
    "commission_rate": 12.5,
    "created_at": "2026-04-14T08:00:00Z"
  },
  "action_timestamp": "2026-05-02T10:30:00Z"
}
```

**Status Code:** 200 (success), 201 (new creator created)

**Error Responses:**

| Status | Body | Reason |
|--------|------|--------|
| 400 | `{ "error": "Invalid action", "valid_actions": ["recruit", "move_to_active", ...] }` | Unknown action |
| 400 | `{ "error": "Missing creator_id" }` | No creator ID provided |
| 404 | `{ "error": "Creator not found" }` | Creator ID doesn't exist |
| 500 | `{ "error": "Database error" }` | Server error |

---

## AI Verification

### POST `/internal/ai-verify`

Verify creator identity with AI (photo + receipt + geo).

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "creator_id": "550e8400-e29b-41d4-a716-446655440000",
  "photo_base64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "receipt_text": "Williamsburg Coffee Co, 2026-05-02, $12.45",
  "location": {
    "lat": 40.7128,
    "lng": -74.0060
  }
}
```

**Query Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `merchant_id` | uuid | No | Merchant to verify against (for geo fence) |

**Response:**
```json
{
  "status": "approved",
  "creator_id": "550e8400-e29b-41d4-a716-446655440000",
  "verification_details": {
    "photo": {
      "status": "approved",
      "confidence": 0.98,
      "face_detected": true,
      "quality": "high"
    },
    "receipt": {
      "status": "approved",
      "confidence": 0.95,
      "amount": 1245,
      "currency": "USD",
      "store_name": "Williamsburg Coffee Co",
      "date": "2026-05-02"
    },
    "geofence": {
      "status": "approved",
      "distance_meters": 45,
      "merchant_location": { "lat": 40.7129, "lng": -74.0061 },
      "creator_location": { "lat": 40.7128, "lng": -74.0060 }
    }
  },
  "reason": "All checks passed",
  "timestamp": "2026-05-02T10:30:00Z"
}
```

**Possible `status` Values:**
- `approved` — All checks passed
- `rejected` — One or more checks failed
- `manual_review` — Ambiguous result, needs human review

**Rejection Example:**
```json
{
  "status": "rejected",
  "reason": "photo_failed_quality_check",
  "details": {
    "photo": {
      "status": "rejected",
      "reason": "image_too_dark",
      "confidence": 0.3
    },
    "receipt": { "status": "approved" },
    "geofence": { "status": "approved" }
  }
}
```

**Status Code:** 200

**Error Responses:**

| Status | Body | Reason |
|--------|------|--------|
| 400 | `{ "error": "Missing photo_base64" }` | No photo provided |
| 400 | `{ "error": "Invalid location coordinates" }` | Lat/lng missing or invalid |
| 404 | `{ "error": "Creator not found" }` | Creator ID doesn't exist |
| 503 | `{ "error": "Vision API unavailable" }` | External service down |

---

## Weekly Reports

### GET `/merchant/reports/weekly`

Fetch weekly performance report for a merchant.

**Request:**
```bash
curl "http://localhost:3000/api/merchant/reports/weekly?merchant_id=550e8400-e29b-41d4-a716-446655440000&week_start=2026-04-28"
```

**Query Parameters:**

| Param | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `merchant_id` | uuid | Yes | Merchant ID | `550e8400-e29b-41d4-a716-446655440000` |
| `week_start` | date | No | Start of week (ISO 8601) | `2026-04-28` |
| `limit` | integer | No | Number of weeks to return (default: 1) | `4` |

**Response:**
```json
{
  "reports": [
    {
      "id": "report-uuid",
      "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
      "merchant_name": "Williamsburg Coffee Co",
      "week_start": "2026-04-28",
      "week_end": "2026-05-04",
      "revenue_cents": 4500000,
      "revenue_currency": "USD",
      "commission_cents": 450000,
      "net_cents": 4050000,
      "punch_through_rate": 82.5,
      "total_punches": 82,
      "unique_customers": 10,
      "active_creators": 2,
      "creator_leaderboard": [
        {
          "creator_id": "uuid",
          "name": "Alex Chen",
          "handle": "@alexchen",
          "tier": "active",
          "earned_cents": 225000,
          "commission_rate": 10,
          "referral_count": 5,
          "avg_order_value_cents": 1200
        },
        {
          "creator_id": "uuid",
          "name": "Jordan Park",
          "handle": "@jordanpark",
          "tier": "early_operator",
          "earned_cents": 112500,
          "commission_rate": 10,
          "referral_count": 3,
          "avg_order_value_cents": 1200
        }
      ],
      "created_at": "2026-05-02T10:30:00Z"
    }
  ]
}
```

**Status Code:** 200

**Error Responses:**

| Status | Body | Reason |
|--------|------|--------|
| 400 | `{ "error": "Missing merchant_id" }` | No merchant ID provided |
| 400 | `{ "error": "Invalid week_start format" }` | Date not ISO 8601 |
| 404 | `{ "error": "Merchant not found" }` | Merchant ID doesn't exist |
| 404 | `{ "error": "No reports found for week" }` | Week has no data |

---

### POST `/merchant/reports/weekly`

Create or update a weekly report (admin only).

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <admin-api-key>
```

**Request Body:**
```json
{
  "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
  "week_start": "2026-04-28",
  "revenue_cents": 4500000,
  "commission_cents": 450000,
  "punch_through_rate": 82.5,
  "active_creators": 2
}
```

**Response:**
```json
{
  "success": true,
  "report": {
    "id": "report-uuid",
    "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
    "week_start": "2026-04-28",
    "revenue_cents": 4500000,
    "net_cents": 4050000,
    "created_at": "2026-05-02T10:30:00Z"
  }
}
```

**Status Code:** 201 (new), 200 (updated)

**Error Responses:**

| Status | Body | Reason |
|--------|------|--------|
| 400 | `{ "error": "Missing required fields" }` | Incomplete payload |
| 404 | `{ "error": "Merchant not found" }` | Merchant ID invalid |
| 401 | `{ "error": "Unauthorized" }` | No valid API key |

---

## Merchant Dashboard

### GET `/merchant/dashboard`

Fetch merchant dashboard (campaigns, creator leaderboard, metrics).

**Request:**
```bash
curl "http://localhost:3000/api/merchant/dashboard?merchant_id=550e8400-e29b-41d4-a716-446655440000"
```

**Query Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `merchant_id` | uuid | Yes | Merchant ID |

**Response:**
```json
{
  "merchant": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Williamsburg Coffee Co",
    "city": "New York",
    "aov_cents": 1200,
    "max_payout_cents": 500000
  },
  "active_campaigns": [
    {
      "id": "campaign-uuid",
      "creator_id": "uuid",
      "creator_name": "Alex Chen",
      "type": "hero",
      "status": "active",
      "duration_days": 7,
      "budget_cents": 150000,
      "spent_cents": 45000,
      "created_at": "2026-04-28T00:00:00Z",
      "expires_at": "2026-05-05T00:00:00Z"
    }
  ],
  "creator_leaderboard": [
    {
      "creator_id": "uuid",
      "name": "Alex Chen",
      "handle": "@alexchen",
      "tier": "active",
      "earnings_cents": 225000,
      "referral_count": 5,
      "punch_through_rate": 85
    }
  ],
  "weekly_metrics": {
    "week_start": "2026-04-28",
    "revenue_cents": 4500000,
    "commission_cents": 450000,
    "punch_through_rate": 82.5,
    "unique_customers": 10
  },
  "settlement_status": {
    "total_owed_cents": 450000,
    "next_payout_date": "2026-05-09",
    "status": "pending"
  }
}
```

**Status Code:** 200

**Error Responses:**

| Status | Body | Reason |
|--------|------|--------|
| 400 | `{ "error": "Missing merchant_id" }` | No merchant ID |
| 404 | `{ "error": "Merchant not found" }` | Invalid merchant ID |

---

## Creator Dashboard (Internal)

### GET `/creator/dashboard`

Fetch creator dashboard (earnings, campaigns, tier info).

**Request:**
```bash
curl "http://localhost:3000/api/creator/dashboard?creator_id=550e8400-e29b-41d4-a716-446655440000"
```

**Query Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `creator_id` | uuid | Yes | Creator ID |

**Response:**
```json
{
  "creator": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Alex Chen",
    "handle": "@alexchen",
    "tier": "active",
    "score": 78,
    "commission_rate": 10
  },
  "earnings_summary": {
    "week": {
      "commission_cents": 112500,
      "milestone_bonus_cents": 10000,
      "total_cents": 122500
    },
    "month": {
      "commission_cents": 450000,
      "milestone_bonus_cents": 40000,
      "total_cents": 490000
    },
    "all_time_cents": 1250000
  },
  "active_campaigns": [
    {
      "id": "campaign-uuid",
      "merchant_name": "Williamsburg Coffee Co",
      "status": "active",
      "budget_cents": 150000,
      "earned_cents": 45000,
      "referral_count": 5,
      "expires_at": "2026-05-05T00:00:00Z"
    }
  ],
  "leaderboard": {
    "tier": "active",
    "rank": 2,
    "total_in_tier": 3,
    "top_creators": [
      {
        "rank": 1,
        "name": "Jordan Park",
        "earnings_month_cents": 550000
      }
    ]
  },
  "recruitment_status": {
    "current_stage": "active",
    "score_progress": { "current": 78, "next_threshold": 85 },
    "next_tier": "emerging"
  }
}
```

**Status Code:** 200

**Error Responses:**

| Status | Body | Reason |
|--------|------|--------|
| 400 | `{ "error": "Missing creator_id" }` | No creator ID |
| 404 | `{ "error": "Creator not found" }` | Invalid creator ID |

---

## Error Handling

All errors follow this format:

```json
{
  "error": "error_code_or_message",
  "details": "Optional additional context",
  "timestamp": "2026-05-02T10:30:00Z"
}
```

**Common Status Codes:**

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request (invalid parameters) |
| 401 | Unauthorized (missing API key) |
| 404 | Not found |
| 500 | Server error |
| 503 | Service unavailable (Supabase down) |

---

## Rate Limiting

Currently not enforced in development. Production will implement:
- **100 requests/minute per IP**
- **1000 requests/minute per API key**

---

## Authentication

Internal endpoints (e.g., `/internal/*`) use optional bearer token:

```bash
curl -H "Authorization: Bearer <api-key>" http://localhost:3000/api/internal/ai-verify
```

In development, this is optional. In production, all internal routes require valid API key.

---

## Webhooks (Future)

Planned for v5.3:
- `recruitment.created` — Creator recruited
- `campaign.completed` — Campaign expires
- `report.generated` — Weekly report ready
- `payment.settled` — Creator payment processed

---

## Testing

```bash
# Health check
curl http://localhost:3000/api/health

# Admin dashboard
curl http://localhost:3000/api/admin/dashboard

# Recruit creator
curl -X POST http://localhost:3000/api/internal/recruitment-sync \
  -H "Content-Type: application/json" \
  -d '{"action":"recruit","creator_id":"...","score":65}'

# Get weekly report
curl "http://localhost:3000/api/merchant/reports/weekly?merchant_id=...&week_start=2026-04-28"
```

---

**Last Updated:** May 2026 | v5.2 RC

For questions, contact: engineering@push.local
