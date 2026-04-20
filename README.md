# Push v5.2: Vertical AI for Local Commerce

**Status:** Week 3 Complete (May 2026) | Ready for YC Demo Day (May 9)

**What is Push?** A vertical AI platform that turns local creators into measurable customer acquisition channels for coffee shops and neighborhood merchants. We use outcome-based pricing: merchants only pay when customers make purchases (commission + milestone bonuses).

---

## Quick Start

```bash
# Clone and install
git clone <repo-url>
cd Push
npm install

# Set up environment
cp .env.local.example .env.local
# Add your Supabase keys, API endpoints

# Start development server
npm run dev
# Open http://localhost:3000

# Run tests and checks
npm run test
npm run lint
npm run type-check
npm run build
```

---

## Demo Accounts & URLs

### Main Navigation
- **URL:** http://localhost:3000
- **Purpose:** Entry point; navigate to all four dashboards
- **Shows:** 5 merchants, 10 creators, 15 loyalty cards, 10 weekly reports

### Admin Dashboard
- **URL:** http://localhost:3000/admin/dashboard
- **Role:** Push team (internal)
- **Features:**
  - Merchant KPIs (GMV, retention, creator count)
  - Creator recruitment pipeline (prospect → early_operator → active → churn)
  - AI verification audit log (photo + receipt + geo verification)
  - Weekly P&L by merchant
- **Data:** Real-time from Supabase, 30-second auto-refresh

### Creator Dashboard
- **URL:** http://localhost:3000/creator/dashboard
- **Role:** TikTok/Instagram creators (6-tier recruitment system)
- **Features:**
  - Weekly earnings (commission + milestone bonuses)
  - Active campaigns
  - Leaderboard (by tier: Prospect, Early Operator, Active, Emerging, Established, Legend)
  - Recruitment status (Prospect → Early Operator path)
  - Message inbox from merchants
- **Data:** Real-time, aggregated from campaign table

### Customer Loyalty Card
- **URL:** http://localhost:3000/customer/loyalty-card/demo-card-001
- **Role:** End customer (punch card holder)
- **Features:**
  - 9-punch card interface
  - Merchant branding
  - QR code for redemption
  - Creator attribution (who referred you)
  - Current punch count + tier progress
- **Flow:** Customer scans QR → Creator's dashboard captures → Card state updates

### Merchant Dashboard
- **URL:** http://localhost:3000/merchant/dashboard
- **Role:** Coffee shop owner / neighborhood merchant
- **Features:**
  - Campaign management (create, pause, edit)
  - Creator leaderboard (earnings + referrals)
  - Weekly analytics (revenue by creator, punch-through rate)
  - Settlement status (payment due)
- **Data:** Aggregated creator performance, commission calculations

---

## Feature Breakdown

### Week 1: Database & Backend (Completed)
- ✅ Supabase PostgreSQL schema
  - `merchants` — with AOV, max_payout, tier_discounts
  - `creators` — with tier, score, commission_rate
  - `campaigns` — hero (high-margin) + sustained (low-friction)
  - `loyalty_cards` — customer punch state, redemption log
  - `weekly_reports` — merchant P&L by week
  - `ai_verification_log` — photo/receipt/geo analysis results
- ✅ Next.js API routes (/api/...)
  - POST `/internal/recruitment-sync` — recruit, move_to_active, update_score, churn
  - GET `/merchant/dashboard` — KPI cards
  - POST `/internal/ai-verify` — mock Vision + OCR + Geo
  - GET/POST `/merchant/reports/weekly`
- ✅ Mock data seeding (5 merchants, 10 creators, 15 loyalty cards)

### Week 2: AI & Reporting (Completed)
- ✅ AI verification (mock Vision API + OCR + Geo checks)
  - Photo validation (dark, blurry, no face detection)
  - Receipt OCR (amount, store, date)
  - Geo fence (distance from merchant)
  - Audit log with status (approved, rejected, manual_review)
- ✅ Weekly merchant reports
  - P&L breakdown (revenue, creator commission, net)
  - Creator leaderboard (earnings, commission_rate, referral_count)
  - Punch-through rate (% loyalty cards completed)
  - Churn analysis (creators by stage)

### Week 3: Dashboards & UI (Completed)
- ✅ Main navigation page (entry point)
- ✅ Admin dashboard
  - Real-time KPI cards (refresh every 30 seconds)
  - Creator recruitment pipeline
  - AI verification audit
  - Weekly P&L by merchant
- ✅ Creator dashboard
  - Earnings (commission + milestone)
  - Active campaigns
  - Leaderboard by tier
  - Recruitment status
- ✅ Customer loyalty card
  - Punch card UI
  - QR code
  - Creator attribution
- ✅ Merchant dashboard
  - Campaign management (CRUD)
  - Creator leaderboard
  - Weekly analytics
  - Settlement status
- ✅ Navigation + routing
- ✅ Design system compliance

---

## Unit Economics (Locked)

### Customer Lifetime Value (LTV)
- **Avg order value:** $12 (coffee + pastry)
- **Repeat visits per customer:** 24/year
- **Gross profit margin:** 65%
- **Customer lifespan:** 18 months
- **LTV = $12 × 24 × 0.65 × 1.5 = $280/customer**

### Customer Acquisition Cost (CAC)
- **Merchant pays Push:** $0.50/punch (loyalty card incentive)
- **Avg punches/customer:** 9
- **Creator recruiting cost:** $45 (signing bonus)
- **Creator recruits:** ~1 customer per $15 effort
- **CAC = $0.50 × 9 + $45/15 = $7.50/customer**

### Unit Economics
- **LTV/CAC ratio:** 37x (excellent)
- **Payback period:** 2.5 weeks
- **Gross margin:** 58%

### Merchant Economics (Example)
- **Campaign spend:** $3,000/month (100 punch cards × $0.50 × 60 punches)
- **Revenue from punches:** $2,880 (100 customers × 9 punches × $12 × 0.65 margin / 2.5)
- **Creator commission:** $360 (10% of revenue)
- **Net P&L:** +$2,520/month

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Next.js | 14.0+ |
| **React** | React | 18.0+ |
| **Styling** | Tailwind CSS | 3.0+ |
| **Database** | Supabase (PostgreSQL) | Latest |
| **Deployment** | Vercel | — |
| **Auth** | Supabase Auth (stub) | — |
| **Real-time** | Supabase Realtime | — |
| **Fonts** | Darky + CS Genio Mono | Custom |

---

## Project Structure

```
Push/
├── app/
│   ├── page.tsx                 # Main navigation
│   ├── layout.tsx               # Root layout
│   ├── admin/
│   │   └── dashboard/
│   │       └── page.tsx         # Admin KPI dashboard
│   ├── creator/
│   │   └── dashboard/
│   │       └── page.tsx         # Creator earnings + campaigns
│   ├── customer/
│   │   └── loyalty-card/
│   │       └── [cardId]/
│   │           └── page.tsx     # Punch card UI
│   ├── merchant/
│   │   └── dashboard/
│   │       └── page.tsx         # Merchant campaign + analytics
│   └── api/
│       ├── health.ts            # Health check
│       ├── internal/
│       │   ├── recruitment-sync.ts
│       │   └── ai-verify.ts
│       └── merchant/
│           ├── dashboard.ts
│           └── reports/
│               └── weekly.ts
├── lib/
│   ├── supabase.ts              # Supabase client
│   ├── types.ts                 # TypeScript types
│   ├── mockData.ts              # Demo data
│   └── utils.ts                 # Helper functions
├── components/
│   ├── DashboardCard.tsx
│   ├── CreatorTierBadge.tsx
│   ├── LoyaltyCard.tsx
│   └── ...
├── styles/
│   ├── globals.css              # Design system
│   └── variables.css             # Color + font tokens
├── docs/
│   ├── API.md                   # API documentation
│   ├── DATABASE.md              # Schema + queries
│   └── DEPLOYMENT.md            # Vercel setup
├── .env.local.example           # Environment template
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md                    # This file

```

---

## Testing & Quality Assurance

```bash
# Lint (ESLint)
npm run lint

# Type check (TypeScript)
npm run type-check

# Unit tests (Jest)
npm run test

# Build
npm run build

# Dev with hot reload
npm run dev
```

---

## Database Schema Overview

### Core Tables

**merchants**
- `id` (uuid, pk)
- `name`, `city`, `aov_cents` (avg order value)
- `max_payout_cents` (weekly cap)
- `tier_discounts` (json: bronze_discount, silver_discount, ...)
- `created_at`, `updated_at`

**creators**
- `id` (uuid, pk)
- `name`, `handle` (TikTok/Instagram)
- `tier` (prospect, early_operator, active, emerging, established, legend)
- `score` (0-100)
- `commission_rate` (%)
- `status` (prospect, active, paused, churned)
- `created_at`

**campaigns**
- `id` (uuid, pk)
- `merchant_id` (fk)
- `creator_id` (fk)
- `type` (hero, sustained)
- `duration_days`, `budget_cents`
- `status` (active, paused, completed)
- `created_at`, `expires_at`

**loyalty_cards**
- `id` (uuid, pk)
- `merchant_id` (fk)
- `customer_id` (uuid)
- `creator_id` (fk, who referred)
- `punch_count` (0-9)
- `status` (active, completed, expired)
- `created_at`, `last_punch_at`

**weekly_reports**
- `id` (uuid, pk)
- `merchant_id` (fk)
- `week_start_date`
- `revenue_cents`, `commission_cents`, `net_cents`
- `punch_through_rate` (%)
- `creator_count` (active)
- `created_at`

**ai_verification_log**
- `id` (uuid, pk)
- `creator_id` (fk)
- `photo_hash`, `receipt_text`, `location`
- `status` (approved, rejected, manual_review)
- `reason` (if rejected)
- `created_at`

---

## API Endpoints Summary

### Health Check
```
GET /health
Response: { status: "ok" }
```

### Admin Dashboard
```
GET /admin/dashboard
Response: {
  total_merchants: 5,
  total_creators: 10,
  total_loyalty_cards: 15,
  gmv_this_week: "$45,000",
  avg_punch_through: "82%",
  creator_by_stage: { prospect: 3, early_operator: 4, active: 3 },
  top_merchants: [...]
}
```

### Creator Recruitment
```
POST /internal/recruitment-sync
Body: {
  action: "recruit" | "move_to_active" | "update_score" | "churn",
  creator_id: "...",
  score?: 75,
  reason?: "..."
}
Response: { success: true, creator: {...} }
```

### AI Verification
```
POST /internal/ai-verify
Body: {
  creator_id: "...",
  photo_base64: "...",
  receipt_text: "...",
  location: { lat: 40.7128, lng: -74.0060 }
}
Response: {
  status: "approved" | "rejected" | "manual_review",
  reason?: "...",
  confidence: 0.95
}
```

### Weekly Reports
```
GET /merchant/reports/weekly?merchant_id=...&week_start=2026-04-14
Response: {
  week_start: "2026-04-14",
  revenue_cents: 45000,
  commission_cents: 4500,
  net_cents: 40500,
  punch_through_rate: 0.82,
  creators: [...]
}

POST /merchant/reports/weekly
Body: { merchant_id, week_start, data: {...} }
```

### Merchant Dashboard
```
GET /merchant/dashboard?merchant_id=...
Response: {
  merchant: {...},
  active_campaigns: [...],
  creator_leaderboard: [...],
  weekly_metrics: {...}
}
```

See [docs/API.md](./docs/API.md) for complete API reference.

---

## Deployment to Vercel

```bash
# 1. Connect your GitHub repo
#    Dashboard: vercel.com → Import Project → select Push repo

# 2. Set environment variables
#    In Vercel dashboard: Settings → Environment Variables
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY
#    - SUPABASE_SERVICE_ROLE_KEY
#    - VISION_API_KEY (optional, for real AI)

# 3. Deploy
#    Vercel auto-deploys on push to main

# 4. Test production
#    https://push-demo.vercel.app
```

---

## YC Demo Day Checklist (May 9)

- [ ] All dashboards responsive (mobile + desktop)
- [ ] Admin KPI cards auto-refresh (30s)
- [ ] Creator tier colors visible + correct
- [ ] Loyalty card punch animation works
- [ ] QR code scans + redirects
- [ ] Merchant campaign CRUD functional
- [ ] Weekly report exports work (CSV)
- [ ] Design system: colors, fonts, spacing correct
- [ ] API latency < 500ms (use Vercel Analytics)
- [ ] Supabase backup configured
- [ ] Demo data seeded
- [ ] Error handling (500s, timeouts) graceful
- [ ] No console errors
- [ ] Lighthouse score > 90
- [ ] Load time < 2s (first contentful paint)

---

## Next Steps (Post-Week 3)

1. **May 4:** Code quality audit (lint, type-check, test, build)
2. **May 5:** Integrate Z's merchant dashboard polish
3. **May 6-8:** Production deployment to Vercel
4. **May 9:** YC Demo Day presentation
5. **Post-Demo:** Beta launch with 5-10 Williamsburg coffee shops

---

## Questions?

See [docs/API.md](./docs/API.md) for API details, or ask Jiaming (@wangjiamingaas).

---

**Last Updated:** May 2026 | v5.2 Release Candidate