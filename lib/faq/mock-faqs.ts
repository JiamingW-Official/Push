/* ============================================================
   Push — FAQ content
   Voice rules: specific over generic. Real numbers.
   No clichés ("frequently asked", "we're here to help",
   "in a timely manner"). Scene over promise.
   ============================================================ */

export type FaqCategory =
  | "for-merchants"
  | "for-creators"
  | "pricing-payments"
  | "attribution-qr"
  | "trust-safety";

export interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
  helpful: number;
  related: string[];
}

export const CATEGORY_LABELS: Record<FaqCategory, string> = {
  "for-merchants": "For merchants",
  "for-creators": "For creators",
  "pricing-payments": "Payment",
  "attribution-qr": "Verification",
  "trust-safety": "Legal",
};

export const FAQ_ITEMS: FaqItem[] = [
  /* ── For Merchants ────────────────────────────────────────── */
  {
    id: "m-001",
    category: "for-merchants",
    question: "What does Push actually do for my venue?",
    answer:
      "You set a per-visit rate. A creator posts about you. Their followers walk in and scan a QR at the register. The receipt match closes the loop and you pay only for those verified visits — never for impressions, reach, or screenshots. Pilot is 5 anchor venues in SoHo, Tribeca, and Chinatown, opening June 22.",
    helpful: 142,
    related: ["m-002", "m-004", "a-001"],
  },
  {
    id: "m-002",
    category: "for-merchants",
    question: "Who is the pilot for?",
    answer:
      "Brick-and-mortar with a register or POS — restaurants, bars, cafés, fitness studios, retail. The June pilot only takes venues in SoHo, Tribeca, and Chinatown. We'll expand once we've debugged the verification stack on real foot traffic. If you're outside that zip strip, we'll keep your application warm and reach out when we open your block.",
    helpful: 98,
    related: ["m-001", "m-003", "g-001"],
  },
  {
    id: "m-003",
    category: "for-merchants",
    question: "How do I launch a campaign?",
    answer:
      "Sign in, hit Create Campaign, pick a per-visit rate (we recommend $8–$22 depending on ticket size), set a budget cap, and publish. Creators in your tier filter see it within a few minutes. Most pilot merchants spend 15 minutes on setup the first time and under 5 minutes after that.",
    helpful: 187,
    related: ["m-001", "p-001", "a-001"],
  },
  {
    id: "m-004",
    category: "for-merchants",
    question: "Can I pick which creators show up?",
    answer:
      "Yes. Filter by tier (Seed through Partner), niche (food, nightlife, fitness, beauty, fashion, entertainment), and walking distance from your door. Pilot merchants typically allow Operator and above within a 1.5-mile radius. You can also invite specific creators by handle.",
    helpful: 76,
    related: ["m-003", "c-001", "t-001"],
  },
  {
    id: "m-005",
    category: "for-merchants",
    question: "What does it actually cost?",
    answer:
      "Two lines on the bill. Subscription: Lite $0, Essentials $99/mo, Pro 5% of attributed revenue (capped $179, floor $49), Advanced $349/mo. Per-visit payouts: whatever rate you set, only on receipts that matched a creator's QR scan inside the 72-hour oracle window. Most pilot venues run a 3-creator campaign for $400–$900 in a week.",
    helpful: 211,
    related: ["p-001", "p-002", "m-003"],
  },
  {
    id: "m-006",
    category: "for-merchants",
    question: "Where do I see what's working?",
    answer:
      "Merchant dashboard updates every few minutes. You see scans, verified visits, the creator behind each visit, and the receipt amount. Filter by date, creator, or campaign. Export CSV any time. Pro and Advanced get the per-creator ROI view side-by-side.",
    helpful: 134,
    related: ["a-001", "a-002", "m-003"],
  },
  {
    id: "m-007",
    category: "for-merchants",
    question: "Can I pause a campaign mid-week?",
    answer:
      "Yes — pause from the dashboard, takes effect immediately. Visits that already happened still pay out (we owe the creator). Paused campaigns reactivate the same way. No fee. The only thing you can't do is claw back a verified visit unless the oracle flagged it.",
    helpful: 89,
    related: ["m-005", "m-003", "p-004"],
  },
  {
    id: "m-008",
    category: "for-merchants",
    question: "What if a scan looks fake?",
    answer:
      "Flag it from the dashboard within 72 hours of the visit. The oracle re-checks the GPS, the device fingerprint, and the receipt match — usually inside 24 hours. If it scores below threshold the payout is withheld and refunded to your budget. False positives are rare so far in testing (under 2% of contested scans), but if you disagree with a ruling Jiaming reviews it personally.",
    helpful: 103,
    related: ["t-001", "t-002", "a-003"],
  },
  {
    id: "m-009",
    category: "for-merchants",
    question: "Do I need to install anything?",
    answer:
      "No. Customers scan the creator's QR with their phone camera — the verification happens on their device. You don't touch your POS. You don't add hardware. We will, however, give you a small printed table tent for the bar so first-time scanners know what they're scanning into.",
    helpful: 156,
    related: ["m-001", "a-001", "m-003"],
  },
  {
    id: "m-010",
    category: "for-merchants",
    question: "Am I locked into anything?",
    answer:
      "No. Lite is free forever, paid plans are month-to-month. Cancel from settings. Unspent campaign budget refunds to your card within 5–10 business days. We earn when you earn — that's the whole point of the per-verified-visit model.",
    helpful: 198,
    related: ["p-001", "p-002", "m-007"],
  },

  /* ── For Creators ─────────────────────────────────────────── */
  {
    id: "c-001",
    category: "for-creators",
    question: "How do I start earning?",
    answer:
      "Apply at /creator/signup. We need your Instagram or TikTok, your zip code, and a short note on why you cover NYC. Approval takes 24–48 hours during the pilot. Once you're in, you'll see local campaigns in the app, pick one, post your content with the unique QR overlay, and earn per verified visit.",
    helpful: 312,
    related: ["c-002", "c-003", "p-003"],
  },
  {
    id: "c-002",
    category: "for-creators",
    question: "What are the six creator tiers?",
    answer:
      "Seed (1K–5K), Explorer (5K–20K), Operator (20K–50K), Proven (50K–150K), Closer (150K–500K), Partner (500K+). Tier sets your per-visit rate band — Seed earns $4–$6, Partner earns $28–$42. We recalculate weekly from your follower count and engagement signals on Instagram and TikTok.",
    helpful: 267,
    related: ["c-001", "c-004", "p-003"],
  },
  {
    id: "c-003",
    category: "for-creators",
    question: "What's a realistic monthly take?",
    answer:
      "Operator tier with 2 active campaigns and 8 verified visits per campaign per week clears around $600–$1,500/mo. Closer tier doing 4 campaigns at 12 visits/week clears $4K–$10K/mo. There's an interactive calculator on /for-creators that uses these exact numbers — pick your tier and slide.",
    helpful: 445,
    related: ["c-002", "p-003", "p-004"],
  },
  {
    id: "c-004",
    category: "for-creators",
    question: "What am I supposed to post?",
    answer:
      "Whatever feels honest. A Reel, a Story, a TikTok — you walked in, you tried the thing, you tell people. The only hard requirements: the unique QR overlay (we generate it, you drop it in), the FTC #ad disclosure, and the venue tagged. No scripts. No talking points. We don't send you a deck.",
    helpful: 234,
    related: ["c-001", "c-005", "t-003"],
  },
  {
    id: "c-005",
    category: "for-creators",
    question: "When do I actually get paid?",
    answer:
      "Friday morning, via Stripe Connect. Visits verified Monday–Sunday clear that Friday after the 72-hour oracle window. $25 minimum balance to release. ACH typically lands same-day; debit-card payouts land within 30 minutes. You see the cleared amount in the app the moment Stripe sends it.",
    helpful: 389,
    related: ["p-003", "p-004", "c-003"],
  },
  {
    id: "c-006",
    category: "for-creators",
    question: "How many campaigns can I run at once?",
    answer:
      "Seed and Explorer: 3 active. Operator and above: 8 active. We cap it so the content stays varied — three burger spots in a week reads as a paid grid and the algorithm punishes it. Different categories every week is the move.",
    helpful: 178,
    related: ["c-001", "c-002", "c-003"],
  },
  {
    id: "c-007",
    category: "for-creators",
    question: "What's the Creator Score and how do I move it?",
    answer:
      "Score 0–100, recalculated weekly. Engagement rate (35%), audience density in NYC (25%), content quality (20%), posting consistency (10%), redemption rate — what % of your scans verify (10%). You move it by posting 3+ times a week, replying to comments, and writing CTAs that get people to scan ('first drink free with my code' beats 'check them out').",
    helpful: 198,
    related: ["c-002", "c-004", "t-003"],
  },
  {
    id: "c-008",
    category: "for-creators",
    question: "What if nobody scans the QR?",
    answer:
      "Happens on first campaigns. We don't penalize hard for the first three — it takes time for your audience to learn the behavior. Place the QR center-screen for the last 3 seconds of a Reel. Tell people what they get for scanning ('show this for 10% off' converts roughly 4x better than 'go check them out'). If scans stay low across multiple campaigns, your tier rate adjusts.",
    helpful: 156,
    related: ["c-007", "c-004", "a-002"],
  },
  {
    id: "c-009",
    category: "for-creators",
    question: "I'm not in NYC — can I still apply?",
    answer:
      "Pilot is NYC only — June 22 launch, SoHo / Tribeca / Chinatown. LA, Chicago, and Miami open in Q3 2026. If your audience is concentrated in NYC even though you're not based here you may qualify for select campaigns; mark it on your application and we'll review case-by-case.",
    helpful: 145,
    related: ["m-002", "c-001"],
  },
  {
    id: "c-010",
    category: "for-creators",
    question: "Will merchants DM me directly?",
    answer:
      "No cold DMs. Merchants can send you a campaign invite through the platform — you accept or decline. All comms run through Push. We do this so your inbox stays your inbox, and so the FTC paper trail is in one place when someone audits.",
    helpful: 112,
    related: ["c-001", "t-003", "t-004"],
  },
  {
    id: "c-011",
    category: "for-creators",
    question: "What's the minimum follower count?",
    answer:
      "1,000 followers, real engagement. We care about audience location and engagement rate more than raw count. A 2K Brooklyn food creator with 8% engagement converts better on Push than a 50K account with 0.5% engagement scattered across the country. We've onboarded creators at exactly 1,047 followers who outperformed Mid-tier on their first campaign.",
    helpful: 267,
    related: ["c-002", "c-007", "t-003"],
  },
  {
    id: "c-012",
    category: "for-creators",
    question: "Which platforms count?",
    answer:
      "Instagram (Reels, Stories, Feed) and TikTok during the pilot. YouTube Shorts and Pinterest in 2026. Public accounts only — we read engagement and reach via the official APIs and private accounts return nothing.",
    helpful: 134,
    related: ["c-001", "c-004"],
  },

  /* ── Pricing & Payments ───────────────────────────────────── */
  {
    id: "p-001",
    category: "pricing-payments",
    question: "What are the merchant plans?",
    answer:
      "Lite $0 — 1 active campaign, weekly summary. Essentials $99/mo — 3 campaigns, QR + receipt attribution. Pro 5% of attributed revenue (capped $179, floor $49) — unlimited campaigns, three-signal attribution, priority support. Advanced $349/mo — multi-unit ops, API access, dedicated CSM. Annual billing saves 20% on Essentials and Advanced.",
    helpful: 289,
    related: ["p-002", "m-005", "m-010"],
  },
  {
    id: "p-002",
    category: "pricing-payments",
    question: "Is the subscription separate from creator payouts?",
    answer:
      "Yes. Subscription buys you the platform. Per-visit payouts come out of a separate budget you pre-fund per campaign. End the campaign, unspent budget refunds. Subscription never moves with campaign volume — you don't get charged more for running ten campaigns than for running one.",
    helpful: 234,
    related: ["p-001", "m-005", "p-004"],
  },
  {
    id: "p-003",
    category: "pricing-payments",
    question: "How do creator payouts actually flow?",
    answer:
      "Customer scans the QR. Receipt matches inside the 72-hour oracle window. Payout reserves from the merchant's budget instantly. Oracle clears it on Friday morning. Stripe Connect releases to the creator's account same-day. Push takes 15% — you'll see your 85% land in your bank.",
    helpful: 312,
    related: ["c-005", "p-004", "a-003"],
  },
  {
    id: "p-004",
    category: "pricing-payments",
    question: "What payment methods work for merchants?",
    answer:
      "Visa, Mastercard, Amex, Discover for subscription. ACH bank transfer for campaign budget top-ups (US accounts). NET-30 invoicing on Advanced only. All processed through Stripe — we don't store your card number, Stripe does.",
    helpful: 167,
    related: ["p-001", "p-002", "m-010"],
  },
  {
    id: "p-005",
    category: "pricing-payments",
    question: "Is there a free trial?",
    answer:
      "Lite is free forever, no card required. Up to 1 active campaign — that's enough to see real verified visits and decide if Push works for you. If you want more campaigns or three-signal attribution, upgrade in settings; downgrades take effect at the start of the next cycle.",
    helpful: 378,
    related: ["p-001", "m-003", "m-010"],
  },
  {
    id: "p-006",
    category: "pricing-payments",
    question: "Can I get a refund if a campaign flops?",
    answer:
      "Subscription is non-refundable. Campaign budget — yes: cancel the campaign, unspent budget refunds in 5–10 business days. Disputed scans go through the 72-hour oracle review; if a payout was issued on a scan that gets reversed, that money returns to your budget within 7 business days.",
    helpful: 143,
    related: ["p-004", "t-001", "m-008"],
  },
  {
    id: "p-007",
    category: "pricing-payments",
    question: "Do creators pay anything?",
    answer:
      "Nothing. No application fee, no subscription, no tier upgrade fee. Push takes 15% from each verified-visit payout — that's the whole stack. The number you see in the campaign brief is what the merchant has committed; your take-home is 85% of that.",
    helpful: 289,
    related: ["c-001", "c-005", "p-003"],
  },
  {
    id: "p-008",
    category: "pricing-payments",
    question: "How do I change my plan?",
    answer:
      "Settings → Billing. Upgrades take effect immediately, prorated. Downgrades take effect next cycle. If a downgrade puts you over the campaign limit (e.g., Essentials only allows 3 active campaigns and you have 5), you'll be prompted to pause the excess.",
    helpful: 112,
    related: ["p-001", "p-002"],
  },

  /* ── Attribution & QR ─────────────────────────────────────── */
  {
    id: "a-001",
    category: "attribution-qr",
    question: "How does QR attribution actually work?",
    answer:
      "Every creator gets a unique QR per campaign, tied to their account and the merchant. When the customer scans, we capture GPS, timestamp, device fingerprint, and session data. The oracle verifies: (1) GPS matches the venue inside the geofence, (2) device hasn't already redeemed today, (3) receipt at the register matches inside the 72-hour window. If all three pass, the visit verifies and the payout reserves. Whole flow takes under 2 seconds on the customer's phone.",
    helpful: 198,
    related: ["a-002", "a-003", "m-006"],
  },
  {
    id: "a-002",
    category: "attribution-qr",
    question: "What does the customer see when they scan?",
    answer:
      "A lightweight web page — no app download. It says hi from the venue, shows whatever incentive the merchant attached ('show this for 10% off the first round'), and quietly logs the scan. Customers can scan up to 30 minutes before walking in and the visit still attributes — accounts for the 'I'll go after the train' moment.",
    helpful: 167,
    related: ["a-001", "a-003", "m-009"],
  },
  {
    id: "a-003",
    category: "attribution-qr",
    question: "How do you stop fake scans?",
    answer:
      "Five layers. (1) GPS — scan must originate inside the venue's geofence (default 150m, adjustable 50m–500m). (2) Device fingerprint — one device, one verified visit per campaign per 24 hours. (3) Velocity caps — bursts of scans from the same network trigger holds. (4) Anomaly model — patterns inconsistent with real foot traffic flag for review. (5) Receipt match — for Pro and above, the scan must tie to a receipt inside the 72-hour oracle window. Flagged scans queue for review before they pay out.",
    helpful: 234,
    related: ["a-001", "t-001", "m-008"],
  },
  {
    id: "a-004",
    category: "attribution-qr",
    question: "Where should creators put the QR in their content?",
    answer:
      "Center of the screen, last 2–3 seconds of the Reel or TikTok. For Stories, full frame for at least 4 seconds. Push templates handle this automatically — drop your clip in, the QR lands in the right spot. Corners and complex backgrounds kill scan rate; we've measured a 3.4x drop in scan rate from edge placement.",
    helpful: 145,
    related: ["c-004", "a-002", "a-001"],
  },
  {
    id: "a-005",
    category: "attribution-qr",
    question: "How long are QR codes valid?",
    answer:
      "Active for the full campaign window plus 48 hours after it ends — covers the latecomer who saw your post on Friday and walked in Sunday. After that, the code shows an 'offer expired' page. Merchants can extend specific creator codes if a campaign is performing and they want to keep it open.",
    helpful: 123,
    related: ["a-001", "m-007", "a-002"],
  },
  {
    id: "a-006",
    category: "attribution-qr",
    question: "Can I see which creator drove which visit?",
    answer:
      "Yes — that's the whole product. Dashboard shows you the creator, the timestamp, the original post if linked, and the receipt amount. Sort by visit volume, revenue, or conversion rate. Most merchants find their top 2 creators inside the first 30 days and re-invite them on every subsequent campaign.",
    helpful: 178,
    related: ["m-006", "a-001", "a-003"],
  },
  {
    id: "a-007",
    category: "attribution-qr",
    question: "What's the geofence radius?",
    answer:
      "Default 150m around your venue's GPS pin. Tighten it to 50m if you're on a dense block (avoids the bar next door eating your scans). Loosen to 500m if you're a market or have a parking lot — Smorgasburg uses 400m. Adjust on an interactive map during campaign setup.",
    helpful: 98,
    related: ["a-001", "a-003", "m-001"],
  },
  {
    id: "a-008",
    category: "attribution-qr",
    question: "Does it work if someone screenshots the QR?",
    answer:
      "Yes — the QR carries the attribution data, the scan context doesn't. Screenshot, AirDrop, repost — it still attributes. But: one device gets one verified visit per campaign per 24 hours, so ten friends sharing one screenshot still only counts as one visit per phone. Cuts most of the 'pass it around' fraud vectors.",
    helpful: 134,
    related: ["a-002", "a-003", "t-001"],
  },

  /* ── Trust & Safety ───────────────────────────────────────── */
  {
    id: "t-001",
    category: "trust-safety",
    question: "How do you verify creators are real people?",
    answer:
      "OAuth via Instagram and TikTok confirms account ownership. We pull engagement data through the official APIs and run it through our authenticity model — looking for follower spikes, comment patterns, and engagement-to-follower ratios that read as bot-driven. Anything that scores under threshold queues for manual review with Jiaming before approval.",
    helpful: 156,
    related: ["t-002", "a-003", "c-007"],
  },
  {
    id: "t-002",
    category: "trust-safety",
    question: "What content is off-limits?",
    answer:
      "No fabricated claims about a venue (made-up health ratings, fake reviews). No targeting minors in alcohol or adult-venue campaigns. No discriminatory or hateful content. No sexually explicit material. No content that violates Instagram's or TikTok's TOS — we lose API access if you do, and your account follows. First violation pulls the campaign and freezes payouts; second violation pulls the account.",
    helpful: 123,
    related: ["t-001", "t-003", "t-004"],
  },
  {
    id: "t-003",
    category: "trust-safety",
    question: "Do I need to disclose this is paid?",
    answer:
      "Yes — FTC 16 CFR § 255 is mandatory and we enforce it hard. Every Push campaign post needs #ad, #sponsored, or Instagram's native Paid Partnership tag. The Creator app reminds you before publishing and refuses to mark a campaign complete without it. Skipping disclosure is the fastest way to lose the account.",
    helpful: 198,
    related: ["t-002", "c-004", "t-004"],
  },
  {
    id: "t-004",
    category: "trust-safety",
    question: "What happens to my personal data?",
    answer:
      "CCPA and GDPR-compliant; SOC 2 Type II practices. Bank details, phone, email — encrypted at rest (AES-256) and in transit (TLS 1.3+). Merchants only see your handle, tier, and campaign performance. Never your bank, never your phone. Request a data export or full deletion any time from settings — DSAR turnaround is 45 days max, usually under 5.",
    helpful: 167,
    related: ["t-003", "t-001", "p-007"],
  },
  {
    id: "t-005",
    category: "trust-safety",
    question: "What if a merchant treats me badly?",
    answer:
      "Rate them after every campaign — 1–5 stars, private feedback. Average drops below 3.5 and merchants lose creator-invite privileges. Anything more serious (harassment, unsafe conditions, terms violation) — report in-app and Jiaming responds inside 24 hours. We've removed merchants from the platform for this and we'll do it again.",
    helpful: 145,
    related: ["t-001", "t-002", "t-004"],
  },
  {
    id: "t-006",
    category: "trust-safety",
    question: "Can a creator get banned?",
    answer:
      "Yes. Repeat FTC disclosure violations, coordinated fake scans, content that violates platform TOS, or abusing the dispute system. Suspensions notify with reason and a 7-day appeal window. Permanent bans are non-reversible — reserved for fraud and platform-TOS violations that put Push's API access at risk.",
    helpful: 112,
    related: ["t-002", "t-001", "a-003"],
  },
  {
    id: "t-007",
    category: "trust-safety",
    question: "Is the payment data secure?",
    answer:
      "We never store full card numbers or bank account numbers. Stripe handles all of it (PCI DSS Level 1). Push stores only tokenized references — meaningless without Stripe's vault. Infra is on AWS with AES-256 at rest, TLS 1.3+ in transit. Penetration test results available under NDA on request.",
    helpful: 189,
    related: ["t-004", "p-004", "p-003"],
  },
  {
    id: "t-008",
    category: "trust-safety",
    question: "How do I report a problem?",
    answer:
      "In-app Report button on any profile, campaign, or post. Or email jiaming@push.nyc directly. Trust reviews everything inside 24 hours; safety-critical inside 2. We don't tolerate harassment, discrimination, or illegal activity, and we move fast on substantiated reports — that's the whole reason a real human runs the queue.",
    helpful: 134,
    related: ["t-005", "t-002", "t-006"],
  },
];
