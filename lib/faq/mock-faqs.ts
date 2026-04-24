/* ============================================================
   Push — FAQ Mock Data
   40+ typed FAQ entries across 5 categories
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
  helpful: number; // count of "yes" votes
  related: string[]; // IDs of related FAQ items
}

export const CATEGORY_LABELS: Record<FaqCategory, string> = {
  "for-merchants": "For Merchants",
  "for-creators": "For Creators",
  "pricing-payments": "Pricing & Payments",
  "attribution-qr": "Attribution & QR",
  "trust-safety": "Trust & Safety",
};

export const FAQ_ITEMS: FaqItem[] = [
  /* ── For Merchants ────────────────────────────────────────── */
  {
    id: "m-001",
    category: "for-merchants",
    question: "How does Push work for my restaurant or venue?",
    answer:
      "Push connects your venue directly with local food and lifestyle creators. You set a campaign — the event, the payout per verified visit, and the content requirements. Creators discover your campaign, post about your venue with their unique QR code, and get paid when their followers actually walk in. You only pay for real, attributed foot traffic.",
    helpful: 142,
    related: ["m-002", "m-004", "a-001"],
  },
  {
    id: "m-002",
    category: "for-merchants",
    question: "What types of businesses can run campaigns on Push?",
    answer:
      "Push is built for brick-and-mortar venues: restaurants, bars, cafes, pop-ups, food markets, fitness studios, salons, and retail shops. If your business depends on foot traffic and you want authentic local word-of-mouth, Push was designed for you. We're currently focused on NYC with plans to expand.",
    helpful: 98,
    related: ["m-001", "m-003", "g-001"],
  },
  {
    id: "m-003",
    category: "for-merchants",
    question: "How do I set up my first campaign?",
    answer:
      "After signing up, go to your Merchant Dashboard and click 'Create Campaign.' Fill in your event details, set your per-visit payout (minimum $5), choose your creator tier requirements, and publish. Campaigns go live within minutes. You can run multiple campaigns simultaneously — one per event or promotion.",
    helpful: 187,
    related: ["m-001", "p-001", "a-001"],
  },
  {
    id: "m-004",
    category: "for-merchants",
    question: "Can I set requirements for which creators can join my campaign?",
    answer:
      "Yes. You can filter by creator tier (Nano through Elite), minimum follower count, content niche (food, lifestyle, nightlife, etc.), and geographic proximity. This ensures your campaign reaches creators whose audiences match your target customer — not just anyone with an account.",
    helpful: 76,
    related: ["m-003", "c-001", "t-001"],
  },
  {
    id: "m-005",
    category: "for-merchants",
    question: "What does a typical campaign cost?",
    answer:
      "Your total campaign spend equals your per-visit payout multiplied by verified visits. There's no upfront campaign fee — you only pay when the QR code is scanned by a new customer. Our platform subscription starts at $0/month (Lite tier — 1 active campaign), with paid plans from $99/month for full attribution reporting.",
    helpful: 211,
    related: ["p-001", "p-002", "m-003"],
  },
  {
    id: "m-006",
    category: "for-merchants",
    question: "How do I track campaign performance?",
    answer:
      "Your Merchant Dashboard shows real-time metrics: QR scans, verified visits, creator performance, estimated reach, and total spend. You can drill into individual creator stats, see which posts drove the most foot traffic, and export reports. Attribution data updates within minutes of each scan.",
    helpful: 134,
    related: ["a-001", "a-002", "m-003"],
  },
  {
    id: "m-007",
    category: "for-merchants",
    question: "Can I pause or stop a campaign at any time?",
    answer:
      "Yes. You can pause, edit, or end any campaign from your dashboard instantly. Paused campaigns stop accepting new creator joins but existing active creators can still earn payouts for scans that occurred before the pause. No cancellation fees — you only owe for verified visits already recorded.",
    helpful: 89,
    related: ["m-005", "m-003", "p-004"],
  },
  {
    id: "m-008",
    category: "for-merchants",
    question: "What happens if I suspect fraudulent scans?",
    answer:
      "Push has a multi-layer fraud detection system. Each QR code is single-use per customer device, GPS-verified at scan time, and cross-referenced against visit duration signals. Suspicious scans are flagged automatically and withheld from payouts pending review. You can also dispute individual scans within 72 hours.",
    helpful: 103,
    related: ["t-001", "t-002", "a-003"],
  },
  {
    id: "m-009",
    category: "for-merchants",
    question: "Do I need any hardware or POS integration?",
    answer:
      "No hardware required. Customers scan a creator's QR code with their phone camera — the scan happens on their device, not at your register. There's no POS integration needed. Some merchants optionally display a campaign poster at the entrance, but this is entirely optional.",
    helpful: 156,
    related: ["m-001", "a-001", "m-003"],
  },
  {
    id: "m-010",
    category: "for-merchants",
    question: "Is there a contract or minimum commitment?",
    answer:
      "No contracts, no minimums. Lite is free forever; paid plans (Essentials $99/mo, Pro outcome-based, Advanced $349/mo) are month-to-month and can be cancelled anytime. Campaign budgets are pay-as-you-go. We earn when you earn — our incentives are fully aligned with driving real results for your business.",
    helpful: 198,
    related: ["p-001", "p-002", "m-007"],
  },

  /* ── For Creators ─────────────────────────────────────────── */
  {
    id: "c-001",
    category: "for-creators",
    question: "How do I start earning on Push?",
    answer:
      "Download the Push Creator app, connect your Instagram or TikTok account, and complete your profile. Push will calculate your Creator Score based on engagement rate, audience location, content quality, and consistency. Once approved, you'll see available campaigns from local venues in your area. Join a campaign, post your content with your unique QR code, and earn when your followers scan it.",
    helpful: 312,
    related: ["c-002", "c-003", "p-003"],
  },
  {
    id: "c-002",
    category: "for-creators",
    question: "What is the Creator Tier system?",
    answer:
      "Push uses a 6-tier system: Nano (1K–10K followers), Micro (10K–50K), Mid (50K–250K), Macro (250K–1M), Mega (1M–5M), and Elite (5M+). Your tier affects which campaigns you qualify for and your base payout multiplier. Tiers are recalculated weekly based on your current follower count and engagement data.",
    helpful: 267,
    related: ["c-001", "c-004", "p-003"],
  },
  {
    id: "c-003",
    category: "for-creators",
    question: "How much can I earn per campaign?",
    answer:
      "Payouts vary by campaign and your tier. Merchants set a per-visit rate (typically $5–$50 per verified visit). Nano creators typically earn $5–$15 per visit; Elite creators can earn $30–$100+ per visit with multipliers applied. Top creators on Push earn $500–$3,000+ per month across multiple campaigns.",
    helpful: 445,
    related: ["c-002", "p-003", "p-004"],
  },
  {
    id: "c-004",
    category: "for-creators",
    question: "What content do I need to post?",
    answer:
      "Each campaign specifies content requirements — usually an Instagram Story, Reel, or TikTok video featuring the venue. Requirements include your unique QR code overlay (auto-generated by Push), minimum video length, and mention of the campaign. Push provides an in-app content guide for each campaign. No scripted talking points — just authentic content about your real experience.",
    helpful: 234,
    related: ["c-001", "c-005", "t-003"],
  },
  {
    id: "c-005",
    category: "for-creators",
    question: "When and how do I get paid?",
    answer:
      "Payouts are processed weekly every Thursday. You need a minimum $25 balance to trigger a payout. Funds are sent via direct bank transfer (ACH) or PayPal. You can track your pending and confirmed earnings in real time on the Creator Dashboard. Payout processing takes 1–3 business days after release.",
    helpful: 389,
    related: ["p-003", "p-004", "c-003"],
  },
  {
    id: "c-006",
    category: "for-creators",
    question: "Can I join multiple campaigns at the same time?",
    answer:
      "Yes, with some limits. Nano and Micro creators can join up to 3 active campaigns simultaneously. Mid and above can join up to 8. Each campaign must be from a different venue category to maintain authenticity. Push will notify you of available campaigns near you that match your niche and tier.",
    helpful: 178,
    related: ["c-001", "c-002", "c-003"],
  },
  {
    id: "c-007",
    category: "for-creators",
    question: "What is a Creator Score and how do I improve it?",
    answer:
      "Your Creator Score (0–100) is calculated weekly from five factors: engagement rate (35%), audience geographic concentration in the campaign city (25%), content quality score (20%), posting consistency (10%), and redemption rate — how often your QR codes get scanned (10%). Improve it by posting consistently, engaging authentically with your audience, and completing campaigns you join.",
    helpful: 198,
    related: ["c-002", "c-004", "t-003"],
  },
  {
    id: "c-008",
    category: "for-creators",
    question: "What if my followers don't scan the QR code?",
    answer:
      "Your QR scan rate (redemption rate) is one input in your Creator Score, but you won't be penalized harshly for low scans on your first campaigns — it takes time to build audience behavior. We recommend placing the QR prominently in your content, using a clear CTA ('scan to visit them!'), and posting at peak hours for your audience. Campaigns with clearer incentives for your audience (like 'first drink free') consistently drive higher scan rates.",
    helpful: 156,
    related: ["c-007", "c-004", "a-002"],
  },
  {
    id: "c-009",
    category: "for-creators",
    question: "Is Push available outside of New York City?",
    answer:
      "Currently Push operates in NYC. We're expanding to Los Angeles, Chicago, and Miami in Q3 2026. If you're a creator based outside NYC but have a significant NYC-based audience, you may still qualify for some campaigns. Join our waitlist to be notified when your city launches.",
    helpful: 145,
    related: ["m-002", "c-001"],
  },
  {
    id: "c-010",
    category: "for-creators",
    question: "Can brands message me directly through Push?",
    answer:
      "Merchants can send campaign invitations to creators they want to work with, but direct cold outreach from merchants is not permitted. All communication goes through Push's structured campaign system to protect your inbox. You control which campaigns you join — there are no obligations.",
    helpful: 112,
    related: ["c-001", "t-003", "t-004"],
  },
  {
    id: "c-011",
    category: "for-creators",
    question: "Do I need a certain follower count to join?",
    answer:
      "The minimum is 1,000 followers with an authentic, engaged audience. We're more interested in your engagement rate and audience location than raw follower count. A 2,000-follower food creator in Brooklyn with 8% engagement will outperform a 50,000-follower account with 0.5% engagement and a scattered audience on Push campaigns.",
    helpful: 267,
    related: ["c-002", "c-007", "t-003"],
  },
  {
    id: "c-012",
    category: "for-creators",
    question: "What platforms does Push support for content posting?",
    answer:
      "Push currently supports Instagram (Stories, Reels, Feed posts) and TikTok. We're adding YouTube Shorts and Pinterest in 2026. You must have a public creator account on at least one supported platform. Private accounts are not eligible since Push tracks engagement and reach from your posts.",
    helpful: 134,
    related: ["c-001", "c-004"],
  },

  /* ── Pricing & Payments ───────────────────────────────────── */
  {
    id: "p-001",
    category: "pricing-payments",
    question: "What are Push's subscription plans?",
    answer:
      "Push offers four merchant plans: Lite ($0/month) for 1 active campaign with weekly summary; Essentials ($99/month) for 3 campaigns with QR + receipt attribution; Pro (outcome-based — 5% of attributed revenue, capped $179/month) for unlimited campaigns with three-signal attribution and priority support; and Advanced ($349/month) for multi-unit operators with API access and a dedicated CSM. Annual billing saves 20% on Essentials and Advanced.",
    helpful: 289,
    related: ["p-002", "m-005", "m-010"],
  },
  {
    id: "p-002",
    category: "pricing-payments",
    question: "Are campaign payouts separate from the subscription fee?",
    answer:
      "Yes. Your subscription fee covers platform access and features. Campaign payouts (what you pay creators per verified visit) are separate and billed based on actual performance. You pre-fund a campaign budget when you create a campaign. Unused budget is refunded when a campaign ends. Your subscription never changes based on campaign spend.",
    helpful: 234,
    related: ["p-001", "m-005", "p-004"],
  },
  {
    id: "p-003",
    category: "pricing-payments",
    question: "How do creator payouts work?",
    answer:
      "When a customer scans a creator's QR code and the visit is verified, the payout is immediately reserved from the merchant's campaign budget. Payouts are released to creators weekly every Thursday after a 5-day verification window (to allow for fraud review and disputes). Push takes a 15% platform fee from each payout — creators receive 85% of the merchant-set per-visit rate.",
    helpful: 312,
    related: ["c-005", "p-004", "a-003"],
  },
  {
    id: "p-004",
    category: "pricing-payments",
    question: "What payment methods do you accept for merchant billing?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, Amex, Discover) for subscription billing. Campaign budget top-ups also support ACH bank transfers for US businesses. Invoicing with NET-30 payment terms is available on Scale plan only. All payments are processed securely via Stripe.",
    helpful: 167,
    related: ["p-001", "p-002", "m-010"],
  },
  {
    id: "p-005",
    category: "pricing-payments",
    question: "Is there a free trial?",
    answer:
      "Yes. New merchants get a 14-day free trial of the Growth plan — no credit card required. During the trial, you can create up to 2 campaigns and run them with real creators. Campaign payout costs are still real during the trial, but the subscription fee is waived. After 14 days, you choose a plan or your campaigns pause automatically.",
    helpful: 378,
    related: ["p-001", "m-003", "m-010"],
  },
  {
    id: "p-006",
    category: "pricing-payments",
    question: "Can I get a refund if a campaign underperforms?",
    answer:
      "Subscription fees are non-refundable. Campaign budgets have a different policy: any unspent budget in a cancelled or ended campaign is fully refunded within 5–10 business days. If you believe payouts were issued for fraudulent scans, you can dispute individual charges within 72 hours of the payout being released. Verified fraud refunds are processed within 7 business days.",
    helpful: 143,
    related: ["p-004", "t-001", "m-008"],
  },
  {
    id: "p-007",
    category: "pricing-payments",
    question: "Do creators pay anything to use Push?",
    answer:
      "Creators use Push for free. There are no subscription fees, application fees, or hidden charges for creators. Push earns a 15% platform fee from each payout, which is deducted before the creator receives their earnings. What you see as your payout amount in the campaign details is what the merchant has committed — your take-home is 85% of that.",
    helpful: 289,
    related: ["c-001", "c-005", "p-003"],
  },
  {
    id: "p-008",
    category: "pricing-payments",
    question: "How do I upgrade or downgrade my plan?",
    answer:
      "Log into your Merchant Dashboard, go to Settings → Billing, and select your new plan. Upgrades take effect immediately and are prorated for the remaining billing period. Downgrades take effect at the start of your next billing cycle. If downgrading causes you to exceed campaign limits (e.g., from Growth to Starter with 5 active campaigns), you'll be prompted to pause excess campaigns.",
    helpful: 112,
    related: ["p-001", "p-002"],
  },

  /* ── Attribution & QR ─────────────────────────────────────── */
  {
    id: "a-001",
    category: "attribution-qr",
    question: "How does QR-based attribution work?",
    answer:
      "Each creator enrolled in a campaign receives a unique QR code linked to their account and your campaign. When a customer scans the code, Push captures the scan event with GPS coordinates, timestamp, device fingerprint, and session data. The system verifies the location matches your venue (within a configurable radius), checks the device against known fraud patterns, and attributes the visit to that creator. The entire flow takes under 2 seconds.",
    helpful: 198,
    related: ["a-002", "a-003", "m-006"],
  },
  {
    id: "a-002",
    category: "attribution-qr",
    question: "What happens when a customer scans the QR code?",
    answer:
      "The customer's phone opens a lightweight web page (no app download required) that confirms the visit, shows a welcome message from your venue, and optionally displays a promotion (e.g., 'Show this screen for 10% off'). The scan is recorded instantly. Customers can scan the code before or during their visit — scans up to 30 minutes before entering the venue are considered valid.",
    helpful: 167,
    related: ["a-001", "a-003", "m-009"],
  },
  {
    id: "a-003",
    category: "attribution-qr",
    question: "How does Push prevent fake scans?",
    answer:
      "Push uses five layers of fraud prevention: (1) GPS verification — scans must originate within the venue's geographic boundary; (2) Device fingerprinting — each device can only scan a campaign QR once per 24 hours; (3) Velocity limits — suspicious scan bursts trigger automatic holds; (4) AI anomaly detection — patterns inconsistent with genuine foot traffic are flagged; (5) Visit duration signals — extremely brief 'drive-by' scans can be weighted differently. Flagged scans enter a review queue before payouts are released.",
    helpful: 234,
    related: ["a-001", "t-001", "m-008"],
  },
  {
    id: "a-004",
    category: "attribution-qr",
    question: "Where should creators place the QR code in their content?",
    answer:
      "The QR code should appear prominently in the content — typically as an overlay in the last 2–3 seconds of a video, or as a static element in Story frames. Push's Creator app provides pre-built templates that position the QR correctly for each platform. The code must be scannable at native resolution; avoid placing it in corners or on complex backgrounds. Codes that are unreadable will not generate valid scans.",
    helpful: 145,
    related: ["c-004", "a-002", "a-001"],
  },
  {
    id: "a-005",
    category: "attribution-qr",
    question: "How long are QR codes valid?",
    answer:
      "Each QR code is valid for the duration of the campaign it belongs to, plus 48 hours after the campaign ends. This ensures latecomers who see an old post can still have their visit attributed. After expiry, scanning the code shows an 'offer expired' page. Merchants can optionally extend specific codes if they want to keep attribution running past a campaign end date.",
    helpful: 123,
    related: ["a-001", "m-007", "a-002"],
  },
  {
    id: "a-006",
    category: "attribution-qr",
    question: "Can I see which specific creator drove a visit?",
    answer:
      "Yes. Your Merchant Dashboard shows a creator-level breakdown: for every verified visit, you can see which creator's QR code was scanned, the timestamp, the approximate source content (if the creator has linked their posts), and the payout released. You can sort by scan volume, revenue driven, or engagement rate to identify your top-performing creators and invite them to future campaigns.",
    helpful: 178,
    related: ["m-006", "a-001", "a-003"],
  },
  {
    id: "a-007",
    category: "attribution-qr",
    question: "What is the scan radius / geofence setting?",
    answer:
      "By default, valid scans must occur within 150 meters of your venue's registered address. You can adjust this between 50m (strict — useful for dense urban blocks) and 500m (relaxed — useful for outdoor markets or venues with large parking areas) in your campaign settings. The geofence is a circle centered on your venue's GPS pin, which you can fine-tune on an interactive map during setup.",
    helpful: 98,
    related: ["a-001", "a-003", "m-001"],
  },
  {
    id: "a-008",
    category: "attribution-qr",
    question:
      "Does attribution work if the customer uses a screenshot of the QR?",
    answer:
      "Yes. QR codes can be scanned from screenshots without any loss of attribution data — the code itself is what carries the attribution, not the scanning context. However, each device can only register one verified visit per campaign per 24 hours, regardless of how many times the code is scanned. Screenshots shared between friends therefore only count as a single visit per device.",
    helpful: 134,
    related: ["a-002", "a-003", "t-001"],
  },

  /* ── Trust & Safety ───────────────────────────────────────── */
  {
    id: "t-001",
    category: "trust-safety",
    question: "How does Push verify that creators are real people?",
    answer:
      "All creator accounts undergo identity verification during onboarding: we verify social account ownership via OAuth, cross-reference follower/engagement authenticity using our AI scoring model, and flag accounts with suspicious follower growth patterns (rapid spikes, bot-like engagement ratios). Accounts with suspicious signals enter a manual review queue before being approved for campaigns.",
    helpful: 156,
    related: ["t-002", "a-003", "c-007"],
  },
  {
    id: "t-002",
    category: "trust-safety",
    question: "What content is prohibited on Push campaigns?",
    answer:
      "Creators may not post: misleading claims about a venue (e.g., fabricated health ratings), content that targets minors in campaigns for alcohol or adult venues, discriminatory or hate speech in any campaign content, sexually explicit material, or any content that violates the platform policies of Instagram or TikTok. Violations result in immediate campaign removal and may result in account suspension.",
    helpful: 123,
    related: ["t-001", "t-003", "t-004"],
  },
  {
    id: "t-003",
    category: "trust-safety",
    question: "Are creators required to disclose paid partnerships?",
    answer:
      "Yes — FTC compliance is mandatory. All Push campaign content must include a clear paid partnership disclosure. The Push Creator app automatically suggests compliant disclosure labels (e.g., #ad, #sponsored, or Instagram's native 'Paid partnership' tag) and will remind creators before publishing. Campaigns discovered to violate FTC disclosure rules can be suspended and creators may face account termination.",
    helpful: 198,
    related: ["t-002", "c-004", "t-004"],
  },
  {
    id: "t-004",
    category: "trust-safety",
    question: "How does Push protect creator data and privacy?",
    answer:
      "Push complies with CCPA (California Consumer Privacy Act) and follows SOC 2 Type II security practices. Creator personal data (name, bank details, phone number) is encrypted at rest and in transit. Merchants only see your creator handle, tier, and campaign performance metrics — never your personal contact information or financial details. You can request a full data export or deletion at any time from your account settings.",
    helpful: 167,
    related: ["t-003", "t-001", "p-007"],
  },
  {
    id: "t-005",
    category: "trust-safety",
    question: "What should I do if a merchant treats me poorly?",
    answer:
      "Push maintains a Merchant Rating system. After each campaign, creators can rate their experience (1–5 stars) and leave private feedback. Merchants that fall below 3.5 stars average are reviewed and may have their ability to invite creators restricted. If you experience harassment, unsafe conditions, or terms violations from a merchant, report it immediately through the app — serious reports trigger a 24-hour response SLA from our Trust team.",
    helpful: 145,
    related: ["t-001", "t-002", "t-004"],
  },
  {
    id: "t-006",
    category: "trust-safety",
    question: "Can a creator be banned from Push?",
    answer:
      "Yes. Creators can be suspended (temporary, pending review) or permanently banned for: repeated FTC disclosure violations, coordinated fake scan fraud, posting content that violates our Terms or platform partner policies, or abusing the dispute system. We notify creators of the reason and offer a 7-day appeal window for suspensions. Permanent bans are non-reversible.",
    helpful: 112,
    related: ["t-002", "t-001", "a-003"],
  },
  {
    id: "t-007",
    category: "trust-safety",
    question: "Is my payment information secure?",
    answer:
      "Yes. Push never stores full credit card numbers or bank account details on our servers. All payment data is handled by Stripe (PCI DSS Level 1 compliant) for merchant billing, and Stripe or PayPal for creator payouts. Push stores only tokenized references. Our infrastructure runs on AWS with encryption at rest (AES-256) and in transit (TLS 1.3+).",
    helpful: 189,
    related: ["t-004", "p-004", "p-003"],
  },
  {
    id: "t-008",
    category: "trust-safety",
    question: "How do I report a safety concern or policy violation?",
    answer:
      "Use the in-app 'Report' button on any profile, campaign, or piece of content. Alternatively, email trust@pushapp.co with details. Our Trust & Safety team reviews all reports within 24 hours (critical safety issues within 2 hours). We do not tolerate harassment, discrimination, or illegal activity on the platform and will take swift action on substantiated reports.",
    helpful: 134,
    related: ["t-005", "t-002", "t-006"],
  },
];
