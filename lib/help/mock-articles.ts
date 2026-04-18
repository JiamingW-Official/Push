// Push Help Center — Mock Articles
// 30+ articles across 6 categories

export type HelpCategory =
  | "getting-started"
  | "qr-attribution"
  | "payments"
  | "creators"
  | "merchants"
  | "account";

export interface HelpArticle {
  slug: string;
  category: HelpCategory;
  title: string;
  excerpt: string;
  lastUpdated: string;
  viewCount: number;
  helpful: number;
  body: string;
}

export const CATEGORIES: Record<
  HelpCategory,
  { label: string; description: string }
> = {
  "getting-started": {
    label: "Getting Started",
    description: "Set up your account and run your first campaign",
  },
  "qr-attribution": {
    label: "QR & Attribution",
    description: "Understand how Push tracks creator impact",
  },
  payments: {
    label: "Payments",
    description: "Payouts, billing, and financial settings",
  },
  creators: {
    label: "Creators",
    description: "Tiers, scoring, and campaign participation",
  },
  merchants: {
    label: "Merchants",
    description: "Campaign creation, verification, and analytics",
  },
  account: {
    label: "Account",
    description: "Profile, security, and notification settings",
  },
};

export const ARTICLES: HelpArticle[] = [
  // ─── Getting Started ──────────────────────────────────────────────────────
  {
    slug: "what-is-push",
    category: "getting-started",
    title: "What is Push and how does it work?",
    excerpt:
      "Push is Vertical AI for Local Commerce — you tell us how many customers you need and we deliver them through creator campaigns with 3-layer AI verification.",
    lastUpdated: "2026-04-18",
    viewCount: 12480,
    helpful: 934,
    body: `## Overview

Push is **Vertical AI for Local Commerce**. Merchants tell us how many new customers they need; we run creator campaigns, verify every walk-in with a 3-layer AI stack (QR + Claude Vision OCR + geo-match), and only charge for the customers our ConversionOracle™ model confirms.

## The Core Loop

1. **Merchant states a customer goal** — e.g. "I need 40 new customers this month." ConversionOracle™ forecasts creators, content, and budget needed to hit that goal.
2. **Creators browse and join** — any creator meeting the campaign's tier requirement can opt in and receive a personal QR code. DisclosureBot auto-checks each post for FTC compliance before it goes live.
3. **Audience scans the QR** — the visit enters our 3-layer verification pipeline: QR timestamp + Claude Vision receipt OCR + geo-match within 2 miles of the venue.
4. **Merchant pays per verified customer** — pricing scales by vertical ($15–$85 per AI-verified customer). Creators earn from a two-segment economics model tied to the same verified outcome.

## Who Push is for

- **Creators** — food bloggers, lifestyle influencers, neighborhood micro-influencers with 500–500 000 followers.
- **Merchants** — coffee shops, restaurants, retail, wellness — starting with Williamsburg, Brooklyn's Coffee+ beachhead.

> **Note:** Push v5.1 launches in Williamsburg, Brooklyn. Expansion to Bushwick, Greenpoint, and Lower East Side is scheduled for Q3 2026.

## Key difference from traditional influencer marketing

Traditional influencer deals pay a flat rate for posting. Push pays only for **AI-verified customers** — no flat fees for impressions, no flat fees for followers, and no payout until all three verification layers agree.`,
  },
  {
    slug: "create-your-account",
    category: "getting-started",
    title: "Creating your Push account",
    excerpt:
      "Step-by-step guide to signing up as a creator or merchant on Push.",
    lastUpdated: "2026-03-20",
    viewCount: 9820,
    helpful: 814,
    body: `## Choosing your account type

Push has two distinct account types: **Creator** and **Merchant**. You must choose one at signup — you cannot switch later, but you can create a second account with a different email.

### Creator account

1. Visit **push.nyc/signup** and select "I'm a Creator."
2. Connect your Instagram or TikTok account (required for tier assessment).
3. Add your payout method — Stripe Express or direct bank transfer.
4. Complete identity verification (government-issued ID required for payouts over $600/year).

### Merchant account

1. Visit **push.nyc/signup** and select "I'm a Merchant."
2. Enter your business name, address, and category.
3. Upload your business license or EIN confirmation.
4. Add a payment method for campaign funding.

## Verification timeline

| Account type | Verification time |
|---|---|
| Creator | Instant (social connect) |
| Merchant | 1–3 business days |

> **Tip:** Merchants on the **Neighborhood plan** get priority verification — typically under 4 hours during business hours. Pilot and Operator merchants follow the standard 1–3 day timeline.

## After account creation

Once approved, creators can browse active campaigns in the **Explore** tab. Merchants will land in the **Campaign Dashboard** to create their first campaign.`,
  },
  {
    slug: "explore-campaigns",
    category: "getting-started",
    title: "Browsing and joining campaigns as a creator",
    excerpt:
      "How to find campaigns that match your audience and content style.",
    lastUpdated: "2026-04-01",
    viewCount: 7340,
    helpful: 621,
    body: `## The Explore Feed

When you log in as a creator, the **Explore** tab shows active campaigns sorted by relevance to your neighborhood and content category. You can filter by:

- **Category** — food & drink, retail, events, wellness, beauty
- **Payout** — minimum per-visit payout
- **Distance** — within 1 mi, 5 mi, or 25 mi from your location
- **Tier requirement** — campaigns you're already eligible for

## Joining a campaign

1. Tap any campaign card to see full details: payout rate, campaign window, merchant profile, and creator instructions.
2. If you meet the tier requirement (your tier badge will show green), tap **Join Campaign**.
3. Your unique QR code generates within seconds.
4. Download or screenshot the QR, then share it in your content.

## Campaign slots

Some campaigns have a **creator cap** — for example, "max 20 creators." Once all slots fill, the Join button deactivates. Popular campaigns can fill within hours of going live.

## Campaign status indicators

| Status | Meaning |
|---|---|
| Active | Open and accepting creators |
| Full | Creator cap reached |
| Ending Soon | Closes within 24 hours |
| Ended | Campaign window closed, payouts pending |

## Reading the campaign card

Each card shows the merchant's **Match Score** for your profile — a 0–100 rating based on your audience overlap with the merchant's typical customer demographic. A score above 70 is considered a strong match.`,
  },
  {
    slug: "first-campaign-checklist",
    category: "getting-started",
    title: "Your first campaign checklist",
    excerpt:
      "Everything you need to do before, during, and after your first Push campaign.",
    lastUpdated: "2026-02-28",
    viewCount: 6150,
    helpful: 589,
    body: `## Before you post

- [ ] Download your unique QR code from the campaign page
- [ ] Read the merchant's posting guidelines (content requirements vary)
- [ ] Note the campaign window — posts before or after the window dates don't count
- [ ] Check minimum post requirements (some campaigns require a minimum of 2 posts)

## Creating your content

### What works best

Push attribution data shows the highest scan rates come from:

- **Stories with a direct tap-to-scan overlay** — 3.2× more scans than feed posts
- **Video content showing the QR in context** — not just an overlay at the end
- **Personal endorsement** — creators who say "I genuinely recommend" convert 40% better than scripted reads

### Required disclosures

All Push campaigns require FTC-compliant disclosure. Use **#ad** or **#sponsored** in your caption. Push automatically checks for this during campaign review.

## During the campaign

- Monitor scan counts in your **Creator Dashboard** under "Active Campaigns"
- Each scan is logged in real time — you'll see a notification for each verified visit
- If your QR is damaged or lost, you can regenerate it from the campaign page (up to 2 times per campaign)

## After the campaign ends

- Payouts are processed within **48–72 hours** of campaign close
- You'll receive an email summary with total visits, earnings, and your updated tier score
- Your campaign performance affects your **Push Score**, which determines future tier eligibility`,
  },
  {
    slug: "mobile-app-overview",
    category: "getting-started",
    title: "Using the Push mobile app",
    excerpt:
      "Download the app, enable QR scanning, and manage campaigns on the go.",
    lastUpdated: "2026-03-28",
    viewCount: 5890,
    helpful: 502,
    body: `## Downloading the app

Push is available on iOS (14.0+) and Android (10.0+).

- **iOS**: [App Store — Push Creator](https://apps.apple.com/push)
- **Android**: [Google Play — Push Creator](https://play.google.com/push)

The merchant-facing dashboard is web-only at push.nyc/dashboard. A dedicated merchant mobile app is planned for Q4 2026.

## Key app features

### For creators

- **Scan & Go** — the in-app camera is pre-optimized for QR scanning speed. Use it to test your own QR codes before posting.
- **Payout notifications** — real-time push notifications for each verified visit.
- **Campaign feed** — browse and join campaigns without opening a browser.
- **Wallet** — view your pending and available balance, request payouts.

### Permissions required

| Permission | Why it's needed |
|---|---|
| Camera | Scan and test QR codes |
| Notifications | Real-time payout alerts |
| Location (optional) | Improve campaign recommendations |

## Troubleshooting app issues

### App won't load campaign feed
1. Force-quit and reopen the app.
2. Check your internet connection.
3. Log out and log back in — this refreshes your auth token.

### QR code not showing
Your campaign QR appears only after you've officially joined the campaign and the merchant has approved your application (if the campaign uses manual approval mode).`,
  },

  // ─── QR & Attribution ─────────────────────────────────────────────────────
  {
    slug: "how-qr-attribution-works",
    category: "qr-attribution",
    title: "How Push QR attribution works end-to-end",
    excerpt:
      "A technical overview of the QR generation, scan, and verification pipeline.",
    lastUpdated: "2026-04-05",
    viewCount: 11200,
    helpful: 892,
    body: `## The attribution pipeline

Push QR attribution is built to be unforgeable and real-time. Here's the full flow:

### 1. QR generation

When a creator joins a campaign, the Push backend generates a unique QR code that encodes:

\`\`\`
push.nyc/s?c={campaignId}&cr={creatorId}&t={timestamp-salt}
\`\`\`

The timestamp salt rotates every 24 hours — this prevents code sharing or reuse after the campaign window.

### 2. Scan & landing

When a customer scans the QR at the venue, they're redirected to a lightweight landing page that:
- Records the scan event (IP, device type, timestamp)
- Checks the campaign is still active
- Redirects the customer to the merchant's menu or offer page

### 3. Point-of-sale verification

The merchant's POS system receives the QR scan signal. For Push-integrated POS systems (Square, Toast, Clover), this happens automatically. For non-integrated merchants, the staff member manually enters the QR code at checkout.

### 4. Verification criteria

A visit is marked **Verified** only when:
- The QR scan happens within the campaign window
- A corresponding transaction is logged at the POS within 90 minutes of the scan
- The transaction value meets the campaign's minimum spend threshold (if set)

### 5. Payout trigger

Verified visits automatically queue a payout to the creator's wallet. Payouts batch and process nightly.

## Anti-fraud measures

- **Velocity check**: more than 6 scans from the same device in 24 hours triggers a fraud flag
- **Geographic check**: scan IP must geolocate within 2 miles of the merchant location
- **Transaction reconciliation**: Push cross-checks POS transaction logs against scan events`,
  },
  {
    slug: "qr-code-best-practices",
    category: "qr-attribution",
    title: "QR code best practices for creators",
    excerpt:
      "How to display your QR code for maximum scan rates and attribution accuracy.",
    lastUpdated: "2026-03-10",
    viewCount: 8630,
    helpful: 738,
    body: `## Display guidelines

Your QR code's physical appearance has a significant impact on scan rates. Follow these guidelines:

### Minimum size

- **Stories/Reels overlay**: minimum 200×200px on a 1080×1920 canvas
- **Feed posts**: minimum 300×300px
- **Printed materials** (flyers, table tents): minimum 1.5 inches printed

### Contrast requirements

The QR code must appear on a **light background**. Do not place it on dark, busy, or textured backgrounds — cameras struggle to decode low-contrast codes.

| Good | Bad |
|---|---|
| White or cream background | Dark panel behind the QR |
| High contrast (black on white) | Translucent/semi-transparent overlay |
| Clear quiet zone (white border) | QR cropped at edges |

### The quiet zone

Every QR code requires a "quiet zone" — an empty white margin of at least 4 modules (the smallest unit of the QR pattern) on all sides. Push-generated QR codes include this automatically. Do not crop or resize the QR in a way that removes the quiet zone.

## Story overlay technique

The highest-performing creator format is an Instagram Story with the QR overlaid in the center-bottom quarter of the frame. The recommended template:

1. Record or select your story content (showing the venue, food, or product)
2. Add the QR as a sticker/image overlay in the bottom-center
3. Add a text prompt: "Scan to get the deal" or "Book with my link"
4. Keep the QR visible for at least 3 seconds in video content

## Testing before posting

Use the Push app's built-in **Scan & Test** feature to verify your QR works correctly before your story goes live. This does not create a live scan event — it's purely a pre-flight check.`,
  },
  {
    slug: "understanding-verified-vs-pending",
    category: "qr-attribution",
    title: "Verified vs. Pending vs. Flagged visits explained",
    excerpt: "What each attribution status means and how to resolve flags.",
    lastUpdated: "2026-03-22",
    viewCount: 6740,
    helpful: 614,
    body: `## Visit status definitions

Every scan that enters the Push system gets assigned a status. Here's what each one means:

### Verified

The visit has been confirmed by the merchant's POS system and passed all fraud checks. This visit is counted toward your campaign total and queued for payout.

### Pending

The scan has been received but the corresponding POS transaction hasn't been logged yet. Pending visits have a **90-minute window** to convert to Verified. After 90 minutes without a matching transaction, the visit status moves to Unverified.

Most Pending visits resolve within 15–30 minutes. If you see a large number of Pending visits for an extended period, contact the merchant — their POS integration may need attention.

### Flagged

The system has detected a potential anomaly. Common flag triggers:

| Trigger | What it means |
|---|---|
| Multiple scans from same IP | Possible code sharing or booth scanning |
| Geographic mismatch | Scan location doesn't match venue |
| Velocity exceeded | Too many scans in a short window |
| Transaction amount below threshold | Customer spent less than the minimum |

Flagged visits are reviewed manually by Push's fraud team within 24 hours. Legitimate visits are upgraded to Verified; invalid ones are marked Rejected.

### Unverified

No matching POS transaction was found within the 90-minute window. These visits are not paid out. If you believe a visit was incorrectly marked Unverified, you can submit a dispute within 7 days of the campaign ending.

## Dispute process

1. Go to your Campaign History and find the affected campaign
2. Click **Dispute Visits**
3. Provide any evidence (receipt photos, merchant confirmation emails)
4. Push reviews within 5 business days and emails a decision`,
  },
  {
    slug: "attribution-window-explained",
    category: "qr-attribution",
    title: "Understanding the attribution window",
    excerpt:
      "Why timing matters for QR scans, POS transactions, and payout eligibility.",
    lastUpdated: "2026-02-14",
    viewCount: 4920,
    helpful: 441,
    body: `## What is the attribution window?

The attribution window is the time period during which a QR scan can be matched to a POS transaction to count as a verified visit. Push uses a **90-minute attribution window**.

## Why 90 minutes?

The 90-minute window was chosen based on average dine-in and retail visit durations in NYC. Data from our first 18 months shows:

- **Food & drink**: average visit duration 52 minutes
- **Retail**: average visit duration 28 minutes
- **Events**: average duration 2.5 hours (extended window available — see below)

90 minutes covers the vast majority of food and retail visits while keeping fraud risk manageable.

## Extended windows for events

For campaigns categorized as **Events**, merchants can request an extended attribution window of up to **6 hours**. This is configured at the campaign level and shown on the campaign card before you join.

## Campaign window vs. attribution window

These are two different things:

- **Campaign window**: the date range during which your QR code is active (e.g., March 1–31)
- **Attribution window**: the 90-minute window after each individual scan

A scan on March 31 at 11:30 PM (within the campaign window) with a matching transaction at 1:00 AM on April 1 (within the 90-minute attribution window) **will still count as verified**, even though the transaction technically falls outside the campaign date.`,
  },
  {
    slug: "pos-integration-guide",
    category: "qr-attribution",
    title: "Supported POS integrations and setup",
    excerpt:
      "Which point-of-sale systems Push integrates with and how to connect them.",
    lastUpdated: "2026-04-08",
    viewCount: 3810,
    helpful: 328,
    body: `## Natively integrated POS systems

Push has direct integrations with the following POS platforms. When you connect your POS, scan-to-transaction matching is fully automatic.

| POS | Status | Setup time |
|---|---|---|
| Square | Live | ~5 minutes |
| Toast | Live | ~10 minutes |
| Clover | Live | ~10 minutes |
| Lightspeed | Beta | ~15 minutes |
| Shopify POS | Coming Q3 2026 | — |
| Revel | Roadmap | — |

## Connecting Square

1. In your merchant dashboard, go to **Settings → Integrations**
2. Click **Connect Square**
3. Authorize Push in the Square OAuth popup
4. Select the location(s) to link
5. Test the connection by processing a test transaction

## Connecting Toast

Toast integration requires a Push API key to be entered in your Toast back-office.

1. Generate your API key: **Settings → Integrations → Toast → Generate Key**
2. Log in to your Toast back-office at toasttab.com
3. Navigate to **Integrations → Third-Party** and add a new integration
4. Paste your Push API key and save

## Non-integrated POS: manual entry

If your POS isn't yet integrated, your staff can manually enter customer QR codes at checkout. The merchant dashboard provides a simple **Manual Entry** interface — paste or type the QR code string and submit. Manual entries are reviewed by Push within 2 hours to prevent abuse.`,
  },

  // ─── Payments ─────────────────────────────────────────────────────────────
  {
    slug: "creator-payout-schedule",
    category: "payments",
    title: "Creator payout schedule and methods",
    excerpt:
      "When you get paid, how you get paid, and how to set up your payout method.",
    lastUpdated: "2026-03-30",
    viewCount: 14320,
    helpful: 1140,
    body: `## Payout schedule

Push processes creator payouts on a rolling 48–72 hour cycle after a campaign closes. Here's the timeline:

| Event | Timing |
|---|---|
| Campaign window closes | Day 0 |
| Final visit verification | Day 0–1 |
| Payout calculation | Day 1 |
| Funds sent to wallet | Day 1–2 |
| Bank transfer (after wallet request) | 2–5 business days |

## Minimum payout threshold

The minimum payout to your bank account is **$25**. Earnings below $25 accumulate in your wallet until the threshold is reached. There is no minimum for payouts to Stripe Express instant accounts.

## Payout methods

### Stripe Express (Recommended)

Connect your bank via Stripe's secure onboarding. Once connected:
- **Standard transfer**: 2 business days to your bank
- **Instant transfer**: immediate (1.5% fee, min $0.50)

### Direct ACH

Available for US bank accounts only. Processing time: 3–5 business days. No fees.

### International transfers (coming Q3 2026)

Push currently supports payouts to US bank accounts and Stripe Express accounts in US, UK, CA, and AU.

## Tax information

If you earn more than **$600** in a calendar year on Push, you're required to complete a W-9 (US) or W-8BEN (international). Push will send you a 1099-NEC in January for the prior year's earnings. Keep this for your tax records.

> **Important**: Push does not withhold taxes. You're responsible for reporting your Push income to the IRS or your local tax authority.`,
  },
  {
    slug: "merchant-billing-explained",
    category: "payments",
    title: "How merchant billing works",
    excerpt:
      "Subscription plans, campaign budget top-ups, and invoice management.",
    lastUpdated: "2026-04-02",
    viewCount: 7230,
    helpful: 598,
    body: `## Merchant pricing plans (v5.1)

Push offers three plans under the Vertical AI for Local Commerce model:

| Plan | Price | Campaigns | Creator tier access |
|---|---|---|---|
| Pilot | $0 (first 10 Coffee+ merchants) | 1 active campaign | Operator+ |
| Operator | $500/mo min + $15–85 per AI-verified customer by vertical | Unlimited | Proven+ priority |
| Neighborhood | $8–12K launch + $20–35K MRR target | Unlimited | Top-100 Closer+ exclusive |

All plans include access to the merchant dashboard, ConversionOracle™ ROI prediction, 3-layer AI verification (QR + Claude Vision + geo), and Square/Toast/Clover integration. Legacy founding-cohort subscription tiers remain grandfathered through renewal; new signups land on the v5.1 plans above.

## Campaign budget

Separate from your subscription, each campaign requires a **campaign budget** — the maximum amount you're willing to pay in creator payouts for that campaign. The budget is held in escrow when the campaign goes live and released to creators as visits are verified.

### Setting your budget

\`\`\`
Campaign budget = payout per visit × expected max visits
\`\`\`

Example: $8 per visit × 200 max visits = $1,600 campaign budget.

Unused budget is **fully refunded** to your payment method within 5 business days of campaign close.

## Invoices and billing

- Monthly subscription invoices are emailed on your billing anniversary date
- Campaign budget charges are immediate (when you launch the campaign)
- All invoices are available in **Settings → Billing → Invoice History**
- Push accepts Visa, Mastercard, Amex, and ACH (Neighborhood plan only)

## Failed payments

If a subscription payment fails, your account enters a 7-day grace period. During this period, active campaigns continue to run but you cannot launch new ones. If payment isn't resolved within 7 days, active campaigns pause and creators are notified.`,
  },
  {
    slug: "push-score-and-payouts",
    category: "payments",
    title: "How your Push Score affects your earnings",
    excerpt:
      "Understand the Push Score system and how to earn higher payout rates.",
    lastUpdated: "2026-03-18",
    viewCount: 8910,
    helpful: 762,
    body: `## What is a Push Score?

Your **Push Score** is a 0–1000 rating that summarizes your performance across all campaigns on the platform. It factors in:

- **Scan rate**: number of verified scans per post
- **Conversion rate**: ratio of scans that become verified visits
- **Consistency**: posting within the campaign window
- **Fraud rate**: percentage of your scans that get flagged (lower is better)
- **Recency**: more recent activity weighted higher

## How score affects earnings

Merchants can set **score-based payout tiers** within a campaign. For example:

| Push Score | Payout per visit |
|---|---|
| 0–399 | $6.00 |
| 400–699 | $8.00 |
| 700–899 | $10.00 |
| 900–1000 | $12.00 |

Not all campaigns use tiered payouts — many use a uniform per-verified-customer rate regardless of score. The campaign card always shows whether tiered payouts are in effect.

## Improving your score

The fastest ways to improve your Push Score:

1. **Maintain posting discipline** — post within 48 hours of joining a campaign
2. **Use proper QR placement** — clear, scannable codes increase your scan rate
3. **Match audience to merchant** — join campaigns where your audience is the target demographic
4. **Avoid sharing codes** — code sharing triggers fraud flags that significantly lower your score

## Score decay

Push Score decays slightly if you're inactive. A 90-day period with no campaign participation reduces your score by up to 15%. Reactivate by joining any campaign.`,
  },
  {
    slug: "requesting-a-payout",
    category: "payments",
    title: "How to request a payout from your wallet",
    excerpt: "Step-by-step guide to withdrawing your Push earnings.",
    lastUpdated: "2026-04-10",
    viewCount: 9540,
    helpful: 821,
    body: `## Accessing your wallet

Your Push wallet shows:
- **Available balance**: funds ready to withdraw (campaigns fully verified)
- **Pending balance**: funds from campaigns still in verification
- **Lifetime earnings**: total amount ever paid out

Navigate to **Wallet → Request Payout** from the creator app or web dashboard.

## Payout steps

1. Tap **Request Payout** on the Wallet screen
2. Enter the amount (minimum $25 for bank transfers)
3. Confirm your connected bank account or select **Add New Account**
4. Choose transfer speed:
   - **Standard** (2–3 business days) — free
   - **Instant** (within 30 minutes) — 1.5% fee, min $0.50
5. Review the summary and tap **Confirm Payout**

## Payout confirmation

You'll receive an email and push notification when the transfer is initiated. Standard transfers typically arrive within 2 business days, though some banks may take up to 5 business days.

## Payout holds

Push may place a hold on your wallet in the following situations:
- Account under fraud review
- Tax form not completed (if earnings exceed $600)
- Pending ID verification
- Disputed campaign under review

Holds are communicated by email. Contact **support@push.nyc** if you believe a hold was applied in error.`,
  },

  // ─── Creators ─────────────────────────────────────────────────────────────
  {
    slug: "creator-tier-system",
    category: "creators",
    title: "Creator tier system explained (v4.0)",
    excerpt:
      "How Push's 6-tier creator system works, what each tier unlocks, and how to advance.",
    lastUpdated: "2026-04-12",
    viewCount: 18640,
    helpful: 1520,
    body: `## Overview of the 6-tier system

Push Creator Tiers (v4.0) classify creators based on follower count, engagement rate, and platform diversity. Your tier determines which campaigns you're eligible for and what payout rates you can access.

| Tier | Name | Follower range | Min engagement |
|---|---|---|---|
| T1 | Nano | 500–4,999 | 5% |
| T2 | Micro | 5,000–24,999 | 4% |
| T3 | Mid | 25,000–99,999 | 3% |
| T4 | Macro | 100,000–499,999 | 2.5% |
| T5 | Mega | 500,000–999,999 | 2% |
| T6 | Elite | 1,000,000+ | 1.5% |

## How your tier is calculated

Push calculates your tier during initial onboarding and recalculates every **30 days**. The calculation pulls live data from your connected social accounts.

The tier formula weights:

- **Follower count** (40%)
- **30-day average engagement rate** (35%)
- **Platform diversity** (15%) — bonus for being active on 2+ platforms
- **Push Score** (10%) — see Push Score article

## What your tier unlocks

Higher tiers unlock:
- Access to larger budget campaigns (T3+ only)
- Priority campaign matching
- Dedicated account management (T5–T6)
- Negotiated flat-fee campaigns (T5–T6, contact partnerships@push.nyc)

## Tier advancement

You advance automatically when a recalculation puts you in a higher bracket. There's no manual application process. Push notifies you by email and in-app notification when your tier changes.

### Tier demotion

If your engagement rate drops below the minimum for your current tier during two consecutive monthly recalculations, your tier decreases. You'll receive a warning email before the first demotion.

## Multi-platform creators

If you have audiences on both Instagram and TikTok, Push aggregates your combined reach. A creator with 15,000 Instagram followers and 12,000 TikTok followers may qualify for T2 or T3 status depending on combined engagement.`,
  },
  {
    slug: "creator-content-guidelines",
    category: "creators",
    title: "Content guidelines for Push campaigns",
    excerpt:
      "Required disclosures, prohibited content types, and quality standards.",
    lastUpdated: "2026-03-25",
    viewCount: 7820,
    helpful: 684,
    body: `## Required disclosures

All Push campaign posts must include an FTC-compliant paid partnership disclosure. The following formats are acceptable:

- **Instagram**: Use the native "Paid Partnership" tag AND include #ad or #sponsored in the caption
- **TikTok**: Use the "Branded Content" toggle AND include #ad in the first 3 seconds of video or in the caption
- **YouTube**: State "This video is sponsored by [merchant]" in the first 30 seconds AND in the description

### Non-compliance consequences

Posts found to be missing required disclosures are removed from campaign tracking. The associated scans and visits are not paid. Repeat violations (3+ in a 90-day period) result in account suspension pending review.

## Prohibited content

The following content types are never permitted in Push campaigns, regardless of merchant instructions:

- Misleading health or medical claims
- Alcohol content targeting audiences under 21
- Comparison marketing that disparages competitors by name
- Content that depicts unsafe food handling practices
- AI-generated faces presenting the QR as organic content

## Content quality standards

Merchants can reject creator content that doesn't meet their brand standards. If a merchant rejects your content:

1. You'll receive a notification explaining the rejection reason
2. You have 24 hours to resubmit compliant content
3. If a second submission is rejected, your campaign participation ends and any verified visits to that point are still paid

## Authenticity requirement

Push requires that promotional content reflect a **genuine visit or experience**. You must actually visit the venue (for food/retail campaigns) or use the product before posting. Fabricated reviews or posts made without visiting are a violation of Push's Terms of Service and may result in permanent account removal.`,
  },
  {
    slug: "connecting-social-accounts",
    category: "creators",
    title: "Connecting and managing your social accounts",
    excerpt:
      "How to link Instagram, TikTok, and YouTube to your Push creator profile.",
    lastUpdated: "2026-03-12",
    viewCount: 6340,
    helpful: 548,
    body: `## Supported platforms

Push currently supports the following platforms for creator account connection:

| Platform | Used for | Required? |
|---|---|---|
| Instagram | Tier calculation, campaign matching | At least one required |
| TikTok | Tier calculation, campaign matching | At least one required |
| YouTube | Supplementary reach (T4+ only) | Optional |

## Connecting Instagram

1. Navigate to **Profile → Social Accounts → Connect Instagram**
2. You'll be redirected to Meta's OAuth authorization page
3. Authorize Push to access your **business or creator account** (personal accounts are not supported)
4. Select the Instagram account to link and confirm

> **Note**: Push requires a **Creator or Business account** on Instagram. Personal accounts do not provide the engagement data needed for tier calculation. You can switch your account type in Instagram's Settings → Account.

## Connecting TikTok

1. Navigate to **Profile → Social Accounts → Connect TikTok**
2. Authorize Push in the TikTok OAuth flow
3. Push will pull your last 30 days of public video performance data

TikTok connection requires your account to be a **TikTok Creator account** with at least 500 followers.

## Reconnecting accounts

Meta and TikTok tokens expire periodically. If your social connection shows as "Disconnected," simply reconnect using the same steps. Your historical tier data is preserved through reconnections.

## Disconnecting accounts

You can disconnect a social account at any time from **Profile → Social Accounts**. Disconnecting an account removes it from your tier calculation. If disconnecting would leave you with no connected accounts, you'll be prompted to connect a replacement first.`,
  },
  {
    slug: "campaign-performance-analytics",
    category: "creators",
    title: "Reading your campaign performance analytics",
    excerpt:
      "How to interpret your creator dashboard metrics and improve campaign ROI.",
    lastUpdated: "2026-04-03",
    viewCount: 5610,
    helpful: 478,
    body: `## Creator dashboard overview

Your campaign performance dashboard is available at **Dashboard → Analytics**. It shows data for all campaigns you've participated in over a selected date range.

## Key metrics explained

### Scan rate

\`\`\`
Scan rate = total QR scans / estimated story/post views
\`\`\`

A good scan rate for Stories is **0.8–2%**. Feed posts typically see 0.2–0.5%. If your scan rate is below 0.3% on Stories, review your QR placement and contrast.

### Conversion rate

\`\`\`
Conversion rate = verified visits / QR scans
\`\`\`

Industry average is 35–50%. If your conversion rate is below 30%, the audience who scans may not be near enough to the venue to follow through on visiting.

### Revenue per post

Your total campaign earnings divided by the number of posts you made. This helps you compare campaign efficiency.

## Campaign comparison

The analytics dashboard lets you overlay multiple campaigns to identify which merchant categories perform best for your audience. Most Nano and Micro creators discover they over-index in one or two specific categories (e.g., ramen, cocktail bars, indie bookstores).

## Exporting your data

You can export a CSV of all your campaign analytics from **Analytics → Export → CSV**. The export includes per-scan timestamps, verification status, and payout amounts — useful for your own tracking or tax records.`,
  },

  // ─── Merchants ────────────────────────────────────────────────────────────
  {
    slug: "creating-your-first-campaign",
    category: "merchants",
    title: "Creating your first Push campaign",
    excerpt:
      "A step-by-step guide to launching a creator campaign on Push as a merchant.",
    lastUpdated: "2026-04-06",
    viewCount: 10420,
    helpful: 876,
    body: `## Before you start

Ensure your account is verified and you have a payment method on file. First-time campaigns require email verification of your business address.

## Step 1: Campaign basics

Navigate to **Dashboard → Campaigns → New Campaign**.

Fill in:
- **Campaign name** — visible to creators. Be specific: "Sakura Ramen Grand Opening" beats "Promotion 1"
- **Campaign type**: Choose from Standard, Event, or Product Launch
- **Campaign window**: start and end dates (minimum 7 days, maximum 90 days)
- **Merchant category**: the system suggests based on your business profile, but you can adjust

## Step 2: Creator settings

- **Minimum tier**: set the minimum creator tier. T2+ is recommended for most campaigns — T1 (Nano) creators are high-volume but lower-reach.
- **Creator cap**: maximum number of creators who can join. For first campaigns, start with 5–10.
- **Approval mode**:
  - **Auto-approve**: any eligible creator can join immediately
  - **Manual review**: you review each creator's profile before granting access (adds 24–48 hour delay)

## Step 3: Payout structure

Set your **payout per verified visit**. Push average is $7–$12 per visit depending on category and creator tier.

Optionally enable **tiered payouts** based on Push Score (see Push Score article).

## Step 4: Campaign budget

Enter your total budget. This amount is held in escrow and automatically disbursed as visits verify. Unused budget returns to your payment method.

## Step 5: Content guidelines

Provide your brand guidelines for creators:
- Required hashtags
- Prohibited topics or competitor names
- Image/video style notes
- Any minimum post requirements

## Step 6: Review and launch

Review all settings in the summary screen. Click **Launch Campaign** — your campaign goes live immediately or at the scheduled start date.

> **Tip**: Campaigns launched between Tuesday–Thursday at 9 AM get 40% more creator joins in the first 24 hours, per Push platform data.`,
  },
  {
    slug: "merchant-verification",
    category: "merchants",
    title: "Merchant account verification requirements",
    excerpt:
      "What documents you need to verify your merchant account and how long it takes.",
    lastUpdated: "2026-03-08",
    viewCount: 5190,
    helpful: 443,
    body: `## Why verification is required

Push verifies merchants to protect creators from fraudulent campaigns. Unverified accounts can browse the dashboard but cannot launch campaigns or receive creator applications.

## Required documents

### All merchants

- **Business license** or equivalent government registration document
- **Physical address** confirmation (utility bill or lease agreement, dated within 6 months)
- **Owner/operator ID** — government-issued photo ID matching the account holder name

### Additional for food & beverage

- NYC Health Department permit (or equivalent for your city)
- Certificate of occupancy

### Additional for events merchants

- Event permit or venue contract for each event campaign (uploaded per campaign, not at account level)

## Submission process

1. Navigate to **Settings → Verification**
2. Upload documents (PDF or high-quality JPEG, max 10MB per file)
3. Enter your business EIN or SSN (for sole proprietors)
4. Submit for review

## Verification timeline

| Plan | Typical timeline |
|---|---|
| Pilot | 2–4 business days |
| Operator | 1–2 business days |
| Neighborhood | Same day (during business hours) |

## Expedited verification

Neighborhood plan merchants can contact **onboarding@push.nyc** for dedicated onboarding support. Expedited verification is typically completed within 4 hours.

## Re-verification

Push may request document re-verification annually or if your account shows unusual activity patterns. You'll receive 14 days' notice before any campaign capabilities are suspended.`,
  },
  {
    slug: "merchant-analytics-dashboard",
    category: "merchants",
    title: "Understanding your merchant analytics dashboard",
    excerpt:
      "Key metrics, campaign ROI calculation, and how to export your data.",
    lastUpdated: "2026-04-09",
    viewCount: 6870,
    helpful: 594,
    body: `## Dashboard sections

The merchant analytics dashboard has four main sections:

### Overview

Shows your aggregate performance across all campaigns: total visits, total spend, cost per visit, and trending metrics vs. the prior period.

### Campaign Performance

Drill down into individual campaigns. Key columns:

| Metric | Description |
|---|---|
| Total creators | Number of creators who joined |
| QR scans | Total scans across all creators |
| Verified visits | Scans that converted to POS-confirmed visits |
| Conversion rate | Verified visits / QR scans |
| Cost per visit | Total payout / verified visits |
| ROI estimate | (Avg ticket × verified visits) / total spend |

### Creator Leaderboard

Ranks your campaign's creators by verified visits. Useful for identifying your top performers to invite to future campaigns directly.

### Attribution Breakdown

Shows which content types (Stories, Reels, Feed, TikTok Video) drove the most scans and conversions. Helps you set content guidelines for future campaigns.

## ROI calculation

Push's built-in ROI estimate uses:

\`\`\`
Estimated ROI = (average ticket value × verified visits) / campaign spend
\`\`\`

Enter your average ticket value in **Settings → Business Profile → Avg Ticket** to enable this calculation. Default is $35 if not set.

## Exporting data

CSV exports are available for all metrics. For custom reporting or Looker/Tableau integration, Neighborhood plan merchants can access the Push Merchant API — contact **api@push.nyc** for API key provisioning.`,
  },
  {
    slug: "inviting-specific-creators",
    category: "merchants",
    title: "Inviting specific creators to your campaign",
    excerpt:
      "How to search for and directly invite creators who match your brand.",
    lastUpdated: "2026-03-28",
    viewCount: 4320,
    helpful: 381,
    body: `## Creator search

Merchants on **Operator and Neighborhood plans** can search the Push creator directory to find specific creators before launching a campaign.

Navigate to **Creators → Search** and filter by:

- **Tier** — T1 through T6
- **Category** — content categories the creator posts in
- **Location** — borough, neighborhood, or radius from your venue
- **Audience size** — follower range
- **Push Score** — minimum score filter

## Sending invitations

From the creator's profile, click **Invite to Campaign**. If you have multiple active campaigns, you'll select which one to invite them to.

Invited creators receive an in-app notification and email. They have 48 hours to accept or decline before the invitation expires.

## Private campaigns

Neighborhood plan merchants can launch **Private campaigns** that are only visible to explicitly invited creators — they don't appear in the public Explore feed. This is useful for:

- Exclusive preview events
- High-spend campaigns where you want full creator control
- NDA-required product launches

To create a private campaign, toggle **Invite-Only** during campaign setup. You'll need to invite at least 2 creators before publishing.

## Creator favorites

Save creators you've worked with well by clicking the **Bookmark** icon on their profile. Favorited creators appear at the top of your Creator Leaderboard and can be bulk-invited to future campaigns.`,
  },
  {
    slug: "campaign-moderation",
    category: "merchants",
    title: "Moderating creator content and handling violations",
    excerpt:
      "How to review creator content, request changes, and report violations.",
    lastUpdated: "2026-03-15",
    viewCount: 3640,
    helpful: 312,
    body: `## Content review workflow

When using **Manual Approval** mode, you review creator content before their QR code is activated. Here's the workflow:

1. Creator submits content for review (link to post or video)
2. You receive a notification and have **24 hours** to approve or reject
3. If you don't respond within 24 hours, the content is auto-approved (to prevent blocking creators unfairly)

## Rejection reasons

When rejecting content, you must select a reason:

- Branding doesn't match guidelines
- Missing required disclosure
- Content quality below standard
- Incorrect product/menu item featured
- Other (with required text explanation)

## Requesting revisions

Instead of rejecting outright, you can request specific revisions. The creator has **24 hours** to resubmit. After one revision cycle, you must either approve or reject — no further revision rounds.

## Reporting violations

If a creator posts content that violates Push's Terms of Service (not just your brand guidelines), report it via **Campaign → Creator List → [Creator] → Report Violation**.

Violations are reviewed by Push Trust & Safety within 4 business hours. If a violation is upheld:
- The creator's posts are removed from attribution tracking
- Any visits generated from the violating post are refunded to your campaign budget
- The creator's Push Score is penalized

## Terminating a creator mid-campaign

You can remove a creator from your campaign at any time by clicking **Remove Creator** in the Creator List. Removing a creator:
- Deactivates their QR code immediately
- Locks their payout at the current verified visit count
- Does not affect other creators' QR codes`,
  },

  // ─── Account ──────────────────────────────────────────────────────────────
  {
    slug: "changing-your-email",
    category: "account",
    title: "Changing your email address",
    excerpt:
      "How to update your login email and what to expect during the verification process.",
    lastUpdated: "2026-03-05",
    viewCount: 4870,
    helpful: 412,
    body: `## Steps to change your email

1. Navigate to **Settings → Account → Email Address**
2. Enter your new email address
3. Enter your current password to confirm the change
4. Push sends a verification link to your **new** email address
5. Click the link within 24 hours to complete the change

Until you click the verification link, your old email remains active for login.

## If you don't receive the verification email

1. Check your spam or promotions folder
2. Wait 5 minutes — email delivery can be delayed
3. From the Settings page, click **Resend Verification Email**
4. If the issue persists, contact support@push.nyc from your original email address

## Restrictions

- You cannot change your email to one already registered with another Push account
- Merchant accounts and creator accounts cannot share an email address
- Email changes are limited to **2 per calendar year** to prevent abuse

## Impact on account access

Changing your email does not:
- Affect your connected social accounts
- Change your payout method or wallet balance
- Reset your Push Score or tier
- Affect active campaigns`,
  },
  {
    slug: "two-factor-authentication",
    category: "account",
    title: "Setting up two-factor authentication",
    excerpt:
      "Protect your Push account with 2FA using an authenticator app or SMS.",
    lastUpdated: "2026-04-01",
    viewCount: 5640,
    helpful: 489,
    body: `## Why enable 2FA?

Creator accounts with payout methods and merchant accounts with campaign budgets are high-value targets. Push strongly recommends enabling 2FA to prevent unauthorized access.

## Supported 2FA methods

| Method | Security level | Recommended? |
|---|---|---|
| Authenticator app (TOTP) | High | Yes |
| SMS text message | Medium | Acceptable |
| Hardware key (FIDO2) | Very high | For Neighborhood merchants |

## Setting up TOTP (authenticator app)

1. Download an authenticator app: **Google Authenticator**, **Authy**, or **1Password**
2. Go to **Settings → Security → Two-Factor Authentication**
3. Click **Set Up Authenticator App**
4. Scan the QR code with your authenticator app
5. Enter the 6-digit code shown in the app to confirm
6. Save your backup codes in a secure location (you'll need these if you lose your device)

## Setting up SMS 2FA

1. Go to **Settings → Security → Two-Factor Authentication**
2. Click **Set Up SMS**
3. Enter and verify your phone number
4. Enter the 6-digit code sent to your phone

> **Note**: SMS 2FA is less secure than TOTP because SMS messages can be intercepted via SIM-swapping attacks. Use TOTP where possible.

## Backup codes

Push generates 10 one-time backup codes when you enable 2FA. Store these securely — they're the only way to access your account if you lose your 2FA device. Each code can only be used once.

If you lose your backup codes, contact support@push.nyc from your registered email address to initiate account recovery.`,
  },
  {
    slug: "notification-settings",
    category: "account",
    title: "Managing your notification preferences",
    excerpt:
      "Customize which alerts you receive by email, push notification, or SMS.",
    lastUpdated: "2026-02-20",
    viewCount: 3920,
    helpful: 334,
    body: `## Notification types

Push sends three categories of notifications:

### Transactional (cannot be disabled)

These are required for account security and financial activity:
- Login from a new device
- Password change
- Email address change
- Payout confirmed
- Payout failed
- Campaign budget exhausted

### Campaign notifications (customizable)

| Notification | Email | Push | SMS |
|---|---|---|---|
| New campaign available in your area | On | On | Off |
| Campaign application approved | On | On | Off |
| QR scan received | Off | On | Off |
| Verified visit logged | Off | On | Off |
| Campaign ending in 24 hours | On | On | Off |
| Campaign performance summary | On | Off | Off |

### Marketing communications (opt-out anytime)

- Weekly platform digest
- New feature announcements
- Tips and creator spotlights

## Changing notification settings

Navigate to **Settings → Notifications**. Toggle each category on/off per channel.

For SMS notifications, you must first add and verify a phone number in **Settings → Account → Phone Number**.

## Notification frequency caps

To prevent notification fatigue, Push caps some high-frequency events:
- QR scan notifications: max 1 per minute (batched if more frequent)
- Verified visit notifications: max 1 per minute
- Daily summary replaces per-event notifications during high-volume periods (>50 events/day)`,
  },
  {
    slug: "deleting-your-account",
    category: "account",
    title: "Deleting your Push account",
    excerpt:
      "What happens to your data, earnings, and campaigns when you delete your account.",
    lastUpdated: "2026-03-01",
    viewCount: 2840,
    helpful: 238,
    body: `## Before you delete

Consider these alternatives to full account deletion:
- **Pause your account** — no new campaigns, but your history and wallet are preserved
- **Uninstall the app** — removes the app without affecting your account
- **Contact support** — if you're experiencing a specific issue, we may be able to resolve it

## What happens when you delete

### Immediate

- You're logged out of all devices
- Your profile is no longer visible to merchants or other creators
- Your QR codes are immediately deactivated

### Within 30 days

- Your data is anonymized in our analytics systems
- Your social account connections are revoked

### What is retained

- Transaction records are retained for 7 years per US financial regulations
- Anonymized performance data may be retained in aggregate analytics
- Active campaign data (for merchants' records) is retained for the campaign's natural lifecycle

## Pending earnings at deletion

If you have a **pending wallet balance at time of deletion**, Push will:
1. Process any in-progress campaigns to completion
2. Attempt a final payout to your last connected bank account
3. If the payout fails, funds are held for 90 days awaiting a payout method update

To claim funds after deletion, email **billing@push.nyc** with your original registered email and the last 4 digits of your connected bank account.

## How to delete

1. Navigate to **Settings → Account → Delete Account**
2. Read the summary of consequences
3. Type **DELETE** to confirm
4. Enter your password
5. Your account deletion is scheduled (takes effect at the next billing cycle if you have an active subscription)`,
  },
  {
    slug: "account-suspension-appeal",
    category: "account",
    title: "Understanding account suspensions and how to appeal",
    excerpt:
      "Why accounts get suspended, the appeal process, and how to prevent suspensions.",
    lastUpdated: "2026-04-11",
    viewCount: 6320,
    helpful: 542,
    body: `## Common suspension reasons

### Creator suspensions

- **Fraud flags**: multiple visits flagged as fraudulent within a single campaign
- **Content violations**: 3+ disclosure compliance failures in 90 days
- **Code sharing**: sharing your QR code with others (detectable via attribution analysis)
- **Fabricated visits**: posting without actually visiting the merchant

### Merchant suspensions

- **Payment failures**: 3+ consecutive failed subscription payments
- **Creator non-payment disputes**: multiple valid payout disputes upheld against your campaigns
- **Fraudulent campaign**: campaign created with intent to collect creator work without paying

## Types of suspensions

| Type | Access | Campaigns | Duration |
|---|---|---|---|
| Warning | Full | Full | Permanent warning on record |
| Soft suspension | Limited | Paused | 7–30 days |
| Hard suspension | None | Terminated | 30–90 days |
| Permanent ban | None | None | Indefinite |

## The appeal process

1. You receive an email explaining the suspension reason
2. Within **7 days**, reply to the suspension email or visit **push.nyc/appeal**
3. Provide a written explanation and any supporting evidence
4. Push's Trust & Safety team reviews within **5 business days**
5. You receive a final decision by email

## Appeal outcome options

- **Overturned**: suspension lifted, account restored
- **Reduced**: suspension shortened or downgraded
- **Upheld**: suspension stands; further appeals are not accepted for the same incident

## Preventing suspensions

- Never share your QR code with anyone else
- Always include required disclosures
- Respond to merchant content review requests promptly
- Keep your payment methods up to date (merchants)
- Complete W-9/W-8BEN before reaching the $600 earnings threshold`,
  },
  {
    slug: "profile-setup-guide",
    category: "account",
    title: "Setting up your creator profile for success",
    excerpt:
      "Profile photo, bio, content categories, and neighborhood tags that help you get more campaign invites.",
    lastUpdated: "2026-03-22",
    viewCount: 7140,
    helpful: 618,
    body: `## Why your profile matters

Merchants browse creator profiles before sending invitations. A complete, professional profile gets **3.4× more direct invites** than an incomplete one (Push platform data, Q1 2026).

## Required profile elements

- **Profile photo**: clear headshot or recognizable brand image, minimum 400×400px
- **Display name**: your creator handle or real name as it appears on your social accounts
- **Bio**: 150–300 characters describing your content niche and audience
- **Content categories**: select up to 5 from the Push category list
- **Neighborhood**: your primary content area (borough/neighborhood level)

## Content categories

Push currently supports these creator content categories:

- Food & Drink
- Cocktails & Nightlife
- Coffee & Cafe Culture
- Fitness & Wellness
- Beauty & Style
- Retail & Shopping
- Events & Entertainment
- Arts & Culture
- Family & Kids
- Travel & Neighborhoods

You can change your categories at any time. Changes apply to the next campaign matching cycle (daily at midnight ET).

## Adding a portfolio

Upload 3–6 examples of your previous work in **Profile → Portfolio**. Supported formats: JPG, PNG, MP4 (max 50MB per file). Portfolios are visible to merchants browsing the creator directory.

## Neighborhood tags

Adding specific neighborhoods helps you get matched with hyper-local campaigns. For example, a creator tagged in "Williamsburg, BK" will appear in campaigns from Williamsburg merchants before general NYC creators.

You can add up to 5 neighborhood tags. Be accurate — campaigns can detect mismatches between your stated neighborhood and your QR scan locations.`,
  },
  // ─── Additional articles ──────────────────────────────────────────────────
  {
    slug: "push-score-faq",
    category: "creators",
    title: "Push Score FAQ",
    excerpt:
      "Common questions about Push Score calculation, decay, and improvement strategies.",
    lastUpdated: "2026-04-05",
    viewCount: 5840,
    helpful: 496,
    body: `## How often is my Push Score updated?

Your Push Score updates **every 24 hours**, incorporating the previous 90 days of activity. Large changes (from a particularly successful or problematic campaign) may take 2–3 days to fully reflect.

## Does my score reset if I take a break?

No, your score does not reset. It decays gradually during periods of inactivity. After 30 days of no campaign activity, your score decreases by 0.5% per day, capped at a 15% total reduction.

## Why did my score drop after a successful campaign?

A few possibilities:
- A batch of visits from that campaign was retroactively flagged during fraud review
- A different concurrent campaign had a high fraud rate that averaged into your score
- Your engagement rate dropped on your connected social accounts

## Can I appeal a Push Score drop?

You can request a score review if you believe fraud flags were applied in error. Navigate to **Profile → Push Score → Request Review**. Reviews take 5–7 business days.

## Does the score look at historical data or recent data?

Both. The scoring model uses a 90-day rolling window, with **more recent activity weighted 2× higher** than activity from 60–90 days ago. Your last 30 days of campaign performance is the most impactful.`,
  },
  {
    slug: "merchant-campaign-types",
    category: "merchants",
    title: "Campaign types: Standard, Event, and Product Launch",
    excerpt:
      "When to use each campaign type and how configuration differs between them.",
    lastUpdated: "2026-03-20",
    viewCount: 4120,
    helpful: 352,
    body: `## Standard campaign

**Best for**: ongoing foot traffic, general awareness, regular menu promotions.

Standard campaigns run for 7–90 days. The QR code remains active throughout the window. Creators are free to post any time during the campaign period.

Key settings:
- Attribution window: 90 minutes
- Creator posting: any time during campaign window
- Post minimum: merchant-configured (default: none)

## Event campaign

**Best for**: specific events, pop-ups, limited-time openings, grand openings.

Event campaigns are tightly windowed — typically 1–7 days. The attribution window extends to 6 hours for event campaigns. Creators are expected to post within 48 hours before or during the event.

Key settings:
- Attribution window: up to 6 hours
- Creator posting: within 48 hours pre-event and during event
- Ticket scanning: optional integration with Eventbrite/DICE (in beta)

## Product Launch campaign

**Best for**: new menu items, product drops, limited-edition releases.

Product Launch campaigns focus on a specific item. The merchant must upload product imagery and description. Creators receive detailed brief materials and product context.

Key settings:
- Attribution window: 90 minutes
- QR links to specific product page (not general menu)
- Content must visually feature the specific product
- Stricter content review (all content manually reviewed, even on auto-approve accounts)

## Switching campaign types after launch

You cannot switch campaign type after launching. Cancel the campaign and create a new one with the correct type. Budget from cancelled campaigns is refunded within 5 business days.`,
  },
  {
    slug: "understanding-match-score",
    category: "merchants",
    title: "Understanding creator Match Score",
    excerpt:
      "How Push calculates creator-to-campaign match and what affects the score.",
    lastUpdated: "2026-03-14",
    viewCount: 3980,
    helpful: 340,
    body: `## What is Match Score?

Match Score (0–100) estimates how well a specific creator's audience aligns with your campaign's target demographic. It appears on creator profiles when browsing from an active campaign context.

## Match Score factors

| Factor | Weight |
|---|---|
| Geographic overlap | 35% |
| Content category alignment | 25% |
| Audience age demographic | 20% |
| Historical conversion in your category | 15% |
| Creator's neighborhood tags | 5% |

## Geographic overlap

The most important factor. Push analyzes where a creator's historical QR scans have geolocated. A creator whose past scans cluster in the East Village will score high for East Village campaigns.

## Content category alignment

A food blogger assigned to a fitness studio campaign will have low category alignment. Category mismatch doesn't disqualify a creator but reduces their Match Score.

## Interpreting Match Score

| Score | Interpretation |
|---|---|
| 80–100 | Excellent match — strong audience-venue alignment |
| 60–79 | Good match — likely to drive relevant traffic |
| 40–59 | Moderate match — may work for awareness campaigns |
| Below 40 | Low match — consider filtering out |

## Match Score limitations

Match Score is predictive, not guaranteed. Creators with lower scores may outperform high-score creators if they have particularly engaged audiences or unique content styles. Use Match Score as a filter, not a hard cutoff.`,
  },
  {
    slug: "referral-program",
    category: "account",
    title: "Push referral program for creators",
    excerpt:
      "Earn bonus credits by referring other creators to the Push platform.",
    lastUpdated: "2026-02-15",
    viewCount: 6240,
    helpful: 528,
    body: `## How the referral program works

Every Push creator has a unique referral link available at **Profile → Refer & Earn**. When someone signs up using your link and completes their first campaign, you both receive a bonus.

## Referral bonuses

| Action | Your bonus | Referred creator bonus |
|---|---|---|
| Referred creator signs up | $0 | $0 |
| Referred creator completes first campaign | $15 wallet credit | $10 wallet credit |
| Referred creator reaches T2 tier | Additional $25 | — |

## Referral link usage

Share your referral link in:
- Your social bio link (Linktree, etc.)
- Direct messages to creator friends
- Content about your Push experience

Note: referral links cannot be promoted in campaigns run on Push itself — this is a conflict of interest and violates campaign guidelines.

## Tracking your referrals

View your active referrals and earned credits at **Profile → Refer & Earn → Referral History**. You can see the status of each referred creator (signed up, first campaign completed, tier reached).

## Credit redemption

Referral credits are added to your Push wallet and can be withdrawn like regular earnings. Credits expire after **12 months** if not withdrawn.

## Referral limits

There is no cap on the number of creators you can refer. However, Push monitors for referral abuse (fake accounts, self-referral via alternate accounts). Fraudulent referral activity results in immediate credit forfeiture and a warning on your account.`,
  },
  {
    slug: "dispute-resolution",
    category: "payments",
    title: "Dispute resolution for creators and merchants",
    excerpt:
      "How to open a dispute, what Push investigates, and expected timelines.",
    lastUpdated: "2026-04-07",
    viewCount: 7890,
    helpful: 668,
    body: `## When to open a dispute

**Creator disputes:**
- Verified visits not showing in your dashboard after 72 hours post-campaign
- Payout amount appears incorrect
- Visits flagged as fraudulent that you believe are legitimate

**Merchant disputes:**
- Creator content doesn't meet guidelines but wasn't rejected within the review window
- Payout issued for visits you believe are fraudulent
- Campaign budget not returned within 10 business days of campaign close

## How to open a dispute

1. Navigate to **Dashboard → Campaign History**
2. Select the campaign in question
3. Click **Open Dispute**
4. Select the dispute type from the dropdown
5. Provide a detailed description and attach any supporting evidence
6. Submit — you'll receive a case number immediately

## Evidence to include

| Issue | Recommended evidence |
|---|---|
| Incorrect visit count | Screenshots of your analytics, posting timestamps |
| Fraudulent flag dispute | Receipts, geo photos, any proof of actual visit |
| Creator content violation | Screenshots of the post with timestamp |
| Budget not returned | Bank statement showing charge, campaign close date |

## Timeline

| Phase | Timeline |
|---|---|
| Initial review | 24 hours |
| Evidence request (if needed) | 48 hours to respond |
| Final decision | 5 business days from submission |

## Escalation

If you disagree with the dispute outcome, you can escalate to **senior review** once per dispute. Email **disputes@push.nyc** with your case number and escalation reason. Senior review takes an additional 7 business days.`,
  },

  // ─── v5.1 platform articles ───────────────────────────────────────────────
  {
    slug: "what-is-vertical-ai-for-local-commerce",
    category: "getting-started",
    title: "What is Vertical AI for Local Commerce?",
    excerpt:
      "Push's v5.1 core positioning — goal-first campaigns, ConversionOracle forecasting, DisclosureBot compliance, and 3-layer AI verification purpose-built for local foot traffic.",
    lastUpdated: "2026-04-18",
    viewCount: 4820,
    helpful: 402,
    body: `## What Vertical AI means

Horizontal AI (ChatGPT, generic LLMs) answers any prompt. **Vertical AI for Local Commerce** is the opposite: a narrow stack of models fine-tuned for one job — **delivering verified, in-person customers to local businesses**. Every layer is purpose-built for the Coffee+ local-commerce workflow, not borrowed from a general-purpose playbook.

## The four pillars

### 1. ConversionOracle™ — goal-first forecasting

You don't set a budget and hope for results. You tell ConversionOracle how many new customers you need; it forecasts the creator mix, content strategy, and spend required to hit that goal, with a confidence band. See "How does ConversionOracle predict customers?" for the model details.

### 2. DisclosureBot — pre-publish compliance gate

Every creator post is auto-scanned for FTC-compliant disclosure language (#ad, #sponsored, Paid Partnership tag) before the QR goes live. Non-compliant posts are blocked with a specific fix request. See "What's DisclosureBot and why does it block some posts?" for the workflow.

### 3. 3-layer AI verification — every walk-in triple-checked

Every verified customer clears three independent layers:
- **Layer 1 — QR timestamp**: scan event within the campaign window
- **Layer 2 — Claude Vision OCR**: receipt image matched to merchant + amount
- **Layer 3 — Geo-match**: scan IP geolocates within 2 miles of the venue

Only a 3-of-3 match becomes a billable customer. See the attribution article for the technical pipeline.

### 4. Two-Segment Creator Economics — aligned incentives

T1–T3 creators earn per-verified-customer payouts (seed/explorer/operator tracks). T4–T6 creators operate on retainer + performance + rev-share + equity. This keeps the long-tail nano/micro segment activated while rewarding Closer-tier creators with real upside. See "What's the Two-Segment Creator Economics model?"

## Why vertical beats horizontal here

Local commerce has ground truth — the customer either walked in or didn't. Horizontal AI guesses at intent; Vertical AI measures the outcome. That's why Push only charges when all three verification layers agree, and why our ConversionOracle forecasts are auditable against real POS data.

## Where Push is headed

Williamsburg Coffee+ is the 60-day beachhead. Next verticals: wellness, boutique retail, restaurants. Same stack, tuned for each vertical's conversion patterns and compliance needs.`,
  },
  {
    slug: "how-conversionoracle-predicts-customers",
    category: "merchants",
    title: "How does ConversionOracle predict customers?",
    excerpt:
      "Inside Push's walk-in forecasting model — what ConversionOracle sees, how it translates a customer goal into a campaign plan, and how accuracy is measured against POS ground truth.",
    lastUpdated: "2026-04-18",
    viewCount: 3640,
    helpful: 308,
    body: `## The customer-goal-first loop

Traditional campaign tools ask: "What's your budget?" Push flips the question: **"How many new customers do you need?"** ConversionOracle™ takes the customer target and returns a campaign plan — creators, content, spend, and a confidence band — that's expected to hit it.

## What ConversionOracle sees

The model draws on four data families:

### 1. Creator signals
- Historical conversion rate per vertical (coffee, wellness, retail)
- Audience geo-density within 2 miles of the merchant
- Content format mix (Stories vs Reels vs feed) and which formats have previously converted for this merchant's vertical
- Recent fraud-flag rate (lower = higher weight)

### 2. Merchant signals
- Vertical + venue location + day-of-week foot traffic patterns
- Historical verified-customer yield from past Push campaigns (if any)
- Average ticket value, which feeds the ROI forecast

### 3. Temporal signals
- Campaign window length, seasonality, local events calendar
- Time-to-walk-in distribution from prior Williamsburg cohorts

### 4. Verification-loop feedback
- Every 3-layer-verified customer becomes labeled training data
- The model retrains weekly; forecast drift is monitored per vertical

## What you get back

When you submit "I need 40 new customers in 30 days at my Williamsburg espresso bar," ConversionOracle returns:

- **Creator mix**: e.g. 8 Micro creators + 2 Mid creators matched to your vertical and geo
- **Spend forecast**: expected AI-verified customer cost × target customers, with a confidence band (e.g. $1,400 ± $180 at 80% confidence)
- **Content strategy**: recommended formats and posting windows based on what has converted before
- **Expected timeline**: customer-arrival curve across the campaign window

## How accuracy is measured

Every campaign closes with an accuracy scorecard:
- Predicted verified customers vs. actual
- Confidence-band hit rate (actual inside the 80% band?)
- Per-creator contribution vs. prediction

Published accuracy (Williamsburg Coffee+ pilot, rolling 30 days): **81% of campaigns land inside the predicted confidence band**, with mean absolute error of 4.2 customers.

## What ConversionOracle does not do

- It does not guarantee customers. No model guarantees in-person foot traffic.
- It does not replace creator judgment on content style or tone.
- It does not factor in merchant operations (staffing, hours, menu). A great campaign to a closed store still won't convert.

## Improving your forecast

The model gets sharper with every campaign you run. First-time merchants get a wider confidence band; by campaign 3, the band typically narrows by 30–40% as the model learns your specific vertical, venue, and audience fit.`,
  },
  {
    slug: "what-is-disclosurebot",
    category: "creators",
    title: "What's DisclosureBot and why does it block some posts?",
    excerpt:
      "DisclosureBot pre-scans every Push campaign post for FTC-compliant disclosure before your QR goes live. Here's what it checks, how to pass the first time, and how to appeal a false block.",
    lastUpdated: "2026-04-18",
    viewCount: 2980,
    helpful: 256,
    body: `## What DisclosureBot does

DisclosureBot is Push's automated FTC-compliance gate. **Before your QR code activates on a campaign post, DisclosureBot inspects your caption, in-video overlay, and platform-native disclosure tag** and verifies that each meets FTC-compliant sponsored-content rules. If anything is missing, the QR stays inactive until you fix the post.

## Why we block, not warn

FTC violations carry real liability for both creators and merchants. A warning-only system has a 22% miss rate in industry data. DisclosureBot blocks at source — if the post isn't compliant, nobody scans, nobody verifies, nobody loses money. A compliant post with an active QR converts normally.

## What DisclosureBot checks

### Required elements (all must be present)

| Platform | Required disclosure |
|---|---|
| Instagram Story / Reel / Feed | Native "Paid Partnership" tag **AND** \`#ad\` or \`#sponsored\` in caption |
| TikTok | "Branded Content" toggle **AND** \`#ad\` in first 3 seconds or in caption |
| YouTube | Spoken sponsorship mention in first 30 seconds **AND** in description |

### Automatic pass conditions

- Paid Partnership / Branded Content toggle is active
- Hashtag is present in a non-hidden caption section (not buried below the "more" fold on platforms where that matters)
- Disclosure appears before the QR image (so viewers see the sponsorship framing before scanning)

### Common reasons DisclosureBot blocks

1. **Missing hashtag** — "#ad" or "#sponsored" wasn't found in the caption
2. **Disclosure below the fold** — hashtag present but buried 30+ words deep on platforms that truncate captions
3. **Native tag off** — you forgot the Paid Partnership / Branded Content toggle
4. **Disclosure after QR** — QR appears before the disclosure text in a Story/Reel sequence

## What happens when DisclosureBot blocks

1. You get a push notification and email within 60 seconds of posting
2. The notification tells you **exactly what's missing** (e.g. "Add #ad to your Instagram caption")
3. Edit the post on-platform to fix the issue
4. DisclosureBot rescans every 5 minutes — your QR activates as soon as the fix is detected
5. You have 6 hours to remediate before the campaign moves on without you

## Appealing a false block

If you believe DisclosureBot blocked a compliant post in error:

1. Navigate to **Campaigns → [Active campaign] → My Post → Appeal Block**
2. Attach a screenshot of your post showing the compliant disclosure
3. Push Trust & Safety reviews within 2 hours during business hours

False-block reversal rate (Q1 2026): 14% of appeals are upheld as genuine false positives and the QR is manually activated.

## Tips to pass on the first try

- Add the disclosure **before you add the QR overlay** so the sequence is disclosure → context → QR
- Use the native platform tag **in addition to** the hashtag, not instead of
- Don't use camouflaged spellings (\`#a d\`, \`#spo ns ored\`) — these don't count
- If you're unsure, run DisclosureBot's pre-check from the Push app: **Create → Pre-check Disclosure** before posting`,
  },
  {
    slug: "two-segment-creator-economics",
    category: "creators",
    title: "What's the Two-Segment Creator Economics model?",
    excerpt:
      "Push v5.1 pays T1–T3 creators per verified customer and puts T4–T6 creators on retainer + performance + rev-share + equity. Here's how each track works and how you move between them.",
    lastUpdated: "2026-04-18",
    viewCount: 2340,
    helpful: 198,
    body: `## Two segments, one outcome

Push v5.1 creator payouts split into two tracks — **T1–T3 (per-verified-customer)** and **T4–T6 (retainer + performance + rev-share + equity)**. Both tracks are tied to the same ground truth: AI-verified customers that clear all three verification layers.

## Segment 1 — T1 to T3: per-verified-customer

Best for nano/micro creators with high frequency and neighborhood audiences.

### How it works

You join a campaign; you post; every 3-layer-verified customer triggers a payout into your wallet. No retainer, no commitment, no minimum posts — pure outcome pay.

### Sub-tracks

| Tier | Sub-track | Typical range |
|---|---|---|
| T1 Nano | Seed | 500–4,999 followers, 5%+ engagement |
| T2 Micro | Explorer | 5,000–24,999 followers, 4%+ engagement |
| T3 Mid | Operator | 25,000–99,999 followers, 3%+ engagement |

### Payout logic

Per-verified-customer rate scales by vertical and creator tier. Coffee+ starting ranges:

- T1 Seed: $15–$25 per verified customer
- T2 Explorer: $30–$55 per verified customer
- T3 Operator: $60–$85 per verified customer

Higher-ticket verticals (restaurants, wellness) pay at the upper end of each range.

## Segment 2 — T4 to T6: retainer + performance + rev-share + equity

Best for Macro/Mega/Elite creators with established followings and longer-term commercial relationships.

### How it works

You sign a creator agreement with Push (not per campaign) that combines four revenue streams:

1. **Monthly retainer** — base pay for availability and a minimum post cadence
2. **Performance bonus** — per-verified-customer rate on top of retainer
3. **Rev-share** — percentage of merchant spend routed through your campaigns
4. **Equity** — vesting participation in Push platform growth (Closer tier only)

### The Closer tier (top 100)

The top 100 T4–T6 creators by rolling verified-customer volume enter the **Closer tier**, which unlocks:

- Highest rev-share percentage
- Equity grant with multi-year vesting
- Direct access to Neighborhood-plan merchant campaigns (invite-only, private)
- Dedicated partnerships manager

## Moving between segments

- **Up-tier**: your tier recalculates every 30 days. Crossing a follower/engagement threshold moves you to the next tier at the next recalculation.
- **Segment transition**: reaching T4 (100K+ followers) automatically offers a segment transition. You choose to stay on per-verified-customer economics or sign the retainer agreement.
- **Down-tier**: engagement drops below the floor for two consecutive monthly recalculations trigger a demotion with a 14-day warning email.

## Why two segments

Nano/micro creators thrive on frequency and freedom — they don't want contracts, they want to post when their audience is ready. Macro/mega creators need commercial commitment that reflects the cost of exclusivity and brand alignment. One payout structure can't serve both well; two segments keep incentives aligned at both ends of the creator spectrum.

## FAQ

### Can I be on both segments?

No. Your segment is determined by your highest-tier connected platform. Multi-platform creators roll up into a single tier assessment.

### Does retainer disqualify me from other brand deals?

No. Your Push retainer covers Push campaign availability and cadence. Non-Push brand work is unrestricted unless you're on a vertical-exclusive Closer agreement (rare, and always explicit in the contract).

### How is rev-share calculated?

Merchant spend routed through creators you recruited or mentored (T5–T6 only) pays a percentage into your account. The calculation is transparent in your Push dashboard — every dollar traceable to source.`,
  },
];

// Utility functions
export function getArticleBySlug(slug: string): HelpArticle | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: HelpCategory): HelpArticle[] {
  return ARTICLES.filter((a) => a.category === category);
}

export function getPopularArticles(count: number = 8): HelpArticle[] {
  return [...ARTICLES]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, count);
}

export function getRelatedArticles(
  article: HelpArticle,
  count: number = 3,
): HelpArticle[] {
  return ARTICLES.filter(
    (a) => a.category === article.category && a.slug !== article.slug,
  )
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, count);
}

export function searchArticles(query: string): HelpArticle[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.body.toLowerCase().includes(q),
  ).sort((a, b) => b.viewCount - a.viewCount);
}

export function getArticleCountByCategory(): Record<HelpCategory, number> {
  const counts = {} as Record<HelpCategory, number>;
  for (const cat of Object.keys(CATEGORIES) as HelpCategory[]) {
    counts[cat] = ARTICLES.filter((a) => a.category === cat).length;
  }
  return counts;
}
