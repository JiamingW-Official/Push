// Push — Merchant Integrations Mock Data
// All integrations for the marketplace. Status is per-merchant in real DB.

export type IntegrationCategory =
  | "pos"
  | "email_sms"
  | "analytics"
  | "crm"
  | "accounting"
  | "ecommerce"
  | "automation";

export type IntegrationStatus = "available" | "connected" | "coming_soon";

export interface IntegrationReview {
  author: string;
  role: string;
  rating: number; // 1-5
  body: string;
  date: string;
}

export interface IntegrationSetupStep {
  number: number;
  title: string;
  description: string;
}

export interface Integration {
  slug: string;
  name: string;
  category: IntegrationCategory;
  tagline: string;
  description: string;
  longDescription: string;
  logoColor: string; // brand color from Push palette
  logoTextColor: string;
  status: IntegrationStatus;
  featured: boolean;
  benefits: string[];
  features: string[];
  setupSteps: IntegrationSetupStep[];
  dataFlowAscii: string;
  securityNotes: string[];
  pricing: string | null;
  reviews: IntegrationReview[];
  website: string;
  authType: "oauth" | "api_key" | "webhook" | "none";
}

export const CATEGORY_LABELS: Record<IntegrationCategory, string> = {
  pos: "Point of Sale",
  email_sms: "Email / SMS",
  analytics: "Analytics",
  crm: "CRM",
  accounting: "Accounting",
  ecommerce: "Ecommerce",
  automation: "Automation",
};

export const INTEGRATIONS: Integration[] = [
  // ── POS ──────────────────────────────────────────────────────────────
  {
    slug: "square",
    name: "Square",
    category: "pos",
    tagline: "Sync transactions and attribute revenue automatically.",
    description:
      "Connect Square to Push and let every creator-driven sale flow into your campaign analytics without manual work.",
    longDescription:
      "Square is the most widely adopted POS platform among independent merchants. By connecting your Square account, Push can pull real-time transaction data to attribute foot traffic and purchases directly to creator campaigns. Every time a creator-referred customer completes a purchase, Push captures the sale and credits it to the appropriate campaign — giving you a clean, closed-loop view of marketing ROI.",
    logoColor: "#003049",
    logoTextColor: "#f5f2ec",
    status: "available",
    featured: true,
    benefits: [
      "Automatic revenue attribution to creator campaigns",
      "Real-time transaction sync — no manual exports",
    ],
    features: [
      "OAuth 2.0 secure connection",
      "Transaction-level attribution",
      "Refund handling and adjustment syncing",
      "Multi-location support",
      "Webhook-based real-time updates",
    ],
    setupSteps: [
      {
        number: 1,
        title: "Authorize Square",
        description:
          'Click "Connect" to open the Square OAuth flow. Log in with your Square account and grant Push read access to transactions.',
      },
      {
        number: 2,
        title: "Select your location",
        description:
          "If you have multiple Square locations, choose which ones you want Push to track. You can update this later.",
      },
      {
        number: 3,
        title: "Map to campaigns",
        description:
          "Push will auto-detect your active campaigns. Confirm the date range for historical import (up to 90 days).",
      },
      {
        number: 4,
        title: "Verify attribution",
        description:
          "Place a test order in-store. The transaction should appear in your Push dashboard within 60 seconds.",
      },
    ],
    dataFlowAscii: `
  Creator visits  →  QR scan logged   →  Push attribution DB
  your store            in Push

  Customer pays   →  Square webhook   →  Push matches sale
  at POS               fires                to creator visit

  Push dashboard  ←  Revenue credited ←  Campaign ROI updated
  shows revenue        to campaign
`,
    securityNotes: [
      "Read-only access — Push cannot charge your Square account or modify orders.",
      "OAuth tokens are encrypted at rest using AES-256.",
      "You can revoke access from Push or directly from Square Developer Dashboard at any time.",
      "Push never stores raw card or customer PII from Square.",
    ],
    pricing: null,
    reviews: [
      {
        author: "Maria T.",
        role: "Owner, Café Marbella",
        rating: 5,
        body: "Finally I can see which creators actually bring in customers that spend money. The Square sync is seamless — data shows up almost instantly.",
        date: "2026-03-10",
      },
      {
        author: "Derek L.",
        role: "Manager, LuxeWear Brooklyn",
        rating: 5,
        body: "Set up in under 5 minutes. Now every creator campaign has real revenue numbers next to it.",
        date: "2026-02-18",
      },
      {
        author: "Priya S.",
        role: "Founder, Spice Route Eats",
        rating: 4,
        body: "Works great for our single location. Would love multi-location rollup views in the future.",
        date: "2026-01-29",
      },
    ],
    website: "https://squareup.com",
    authType: "oauth",
  },
  {
    slug: "toast",
    name: "Toast",
    category: "pos",
    tagline: "Built for restaurants. Connected to Push campaigns.",
    description:
      "Push integrates with Toast POS to link every creator visit to real covers and check totals.",
    longDescription:
      "Toast is the leading restaurant-first POS platform. The Push-Toast integration captures check-level data and links it to creator-originated visits — letting restaurateurs see exactly which influencer content drove tables, not just impressions. Cover count, average check size, and visit frequency all flow into your Push campaign analytics.",
    logoColor: "#c1121f",
    logoTextColor: "#ffffff",
    status: "available",
    featured: true,
    benefits: [
      "Cover-level attribution for restaurant campaigns",
      "Average check size tracked per creator",
    ],
    features: [
      "Check-level data sync",
      "Cover count attribution",
      "Multi-location restaurant support",
      "Menu item tracking (optional)",
      "Nightly batch + real-time webhooks",
    ],
    setupSteps: [
      {
        number: 1,
        title: "Generate Toast API credentials",
        description:
          "In Toast Web, go to Settings → Integrations → API Access and create a new Push integration key.",
      },
      {
        number: 2,
        title: "Enter credentials in Push",
        description:
          "Paste your Toast Client ID and Client Secret into the fields below and click Save.",
      },
      {
        number: 3,
        title: "Configure data scope",
        description:
          "Select which restaurants to sync. Choose whether to include detailed menu-item data.",
      },
      {
        number: 4,
        title: "Run a test sync",
        description:
          "Push will fetch the last 24 hours of check data. Review the sample in your dashboard to confirm accuracy.",
      },
    ],
    dataFlowAscii: `
  Creator content →  QR visit logged  →  Push DB records
  drives diner          in Push              creator visit

  Diner checks in →  Toast check data →  Push matches cover
  at restaurant        via webhook           to visit record

  Dashboard shows ←  Revenue / covers ←  Campaign ROI
  ROI per creator      attributed            calculated
`,
    securityNotes: [
      "API keys grant read-only access to transaction data only.",
      "No customer PII or payment card data is transmitted to Push.",
      "Credentials are stored encrypted; rotate them anytime in Toast Web.",
    ],
    pricing: null,
    reviews: [
      {
        author: "James R.",
        role: "Owner, Ramen & Co.",
        rating: 5,
        body: "The cover attribution is a game-changer. I can tell exactly which food blogger brought in 40 covers last weekend.",
        date: "2026-03-22",
      },
      {
        author: "Sofia M.",
        role: "Operations, The Vine Group",
        rating: 4,
        body: "Solid integration. Setup took about 10 minutes. Would like a Slack notification when the daily sync runs.",
        date: "2026-02-05",
      },
    ],
    website: "https://pos.toasttab.com",
    authType: "api_key",
  },
  {
    slug: "clover",
    name: "Clover",
    category: "pos",
    tagline: "All your Clover transactions, flowing into Push.",
    description:
      "Connect Clover and track how creator campaigns convert foot traffic into real purchases.",
    longDescription:
      "Clover powers thousands of retail and restaurant merchants across the US. The Push-Clover integration reads order data via the Clover REST API and maps each transaction to creator-originated visits, giving you a single source of truth for campaign ROI across all your Clover devices.",
    logoColor: "#669bbc",
    logoTextColor: "#003049",
    status: "available",
    featured: false,
    benefits: [
      "Order-level sync across all Clover devices",
      "Real-time attribution without manual reconciliation",
    ],
    features: [
      "Clover OAuth integration",
      "Order and line-item sync",
      "Multi-device, single-location support",
      "Void and refund tracking",
    ],
    setupSteps: [
      {
        number: 1,
        title: "Connect via Clover OAuth",
        description:
          'Click "Connect Clover" and sign in with your Clover merchant account.',
      },
      {
        number: 2,
        title: "Grant permissions",
        description:
          "Approve read access to Orders and Payments. Push does not request write permissions.",
      },
      {
        number: 3,
        title: "Verify connection",
        description:
          "Push will display your merchant name and location. Confirm these are correct before proceeding.",
      },
      {
        number: 4,
        title: "Go live",
        description:
          "Your campaigns will now receive real-time transaction data. Check your dashboard after your next sale.",
      },
    ],
    dataFlowAscii: `
  QR scan         →  Push logs visit  →  Attribution DB
  by creator fan       with timestamp

  Purchase made   →  Clover API sync  →  Push matches order
  at register          (real-time)         to creator visit

  Dashboard       ←  ROI calculated   ←  Revenue attributed
`,
    securityNotes: [
      "Read-only Clover API scope — no write or refund capabilities.",
      "OAuth tokens refreshed automatically and stored encrypted.",
    ],
    pricing: null,
    reviews: [
      {
        author: "Anita K.",
        role: "Owner, Urban Bloom Florist",
        rating: 4,
        body: "Works smoothly. I needed to re-auth once after a Clover update but otherwise it just runs.",
        date: "2026-01-15",
      },
    ],
    website: "https://clover.com",
    authType: "oauth",
  },
  {
    slug: "lightspeed",
    name: "Lightspeed",
    category: "pos",
    tagline: "Retail and restaurant POS — fully attributed in Push.",
    description:
      "Lightspeed merchants can sync sales data to Push and close the loop between creator content and customer spend.",
    longDescription:
      "Lightspeed serves both high-volume retail and multi-location restaurants. Push connects via the Lightspeed Retail (R-Series) and Restaurant (L-Series) APIs to pull order totals, item breakdowns, and customer visit frequency — enabling precise campaign ROI reporting across complex, multi-location business structures.",
    logoColor: "#c9a96e",
    logoTextColor: "#003049",
    status: "coming_soon",
    featured: false,
    benefits: [
      "Multi-location retail and restaurant support",
      "Item-level sales breakdowns per campaign",
    ],
    features: [
      "R-Series and L-Series API support",
      "Multi-outlet sync",
      "Customer visit frequency tracking",
      "Advanced reporting webhooks",
    ],
    setupSteps: [],
    dataFlowAscii: "",
    securityNotes: [],
    pricing: null,
    reviews: [],
    website: "https://lightspeedhq.com",
    authType: "oauth",
  },

  // ── EMAIL / SMS ───────────────────────────────────────────────────────
  {
    slug: "klaviyo",
    name: "Klaviyo",
    category: "email_sms",
    tagline: "Turn creator visits into email sequences automatically.",
    description:
      "Sync Push campaign events to Klaviyo and trigger personalized email/SMS flows for creator-referred customers.",
    longDescription:
      "Klaviyo is the leading ecommerce email and SMS platform. When a creator-referred customer scans a Push QR code, Push can fire a custom event to Klaviyo — immediately enrolling that customer in targeted welcome flows, re-engagement sequences, or exclusive offers. Close the loop between offline creator discovery and online retention.",
    logoColor: "#003049",
    logoTextColor: "#f5f2ec",
    status: "available",
    featured: true,
    benefits: [
      "Trigger Klaviyo flows from creator scan events",
      "Segment customers by which creator referred them",
    ],
    features: [
      "Custom event push to Klaviyo profiles",
      "Creator tag syncing to customer profiles",
      "Flow trigger on QR scan, visit, and purchase",
      "Suppression list sync",
      "Real-time API events (no batch delay)",
    ],
    setupSteps: [
      {
        number: 1,
        title: "Get your Klaviyo Private API Key",
        description:
          "In Klaviyo, go to Account → Settings → API Keys and create a new Private Key with Full Access.",
      },
      {
        number: 2,
        title: "Enter the key in Push",
        description:
          "Paste the Private API Key here. Push will verify the connection and display your account name.",
      },
      {
        number: 3,
        title: "Map events to Klaviyo metrics",
        description:
          "Choose which Push events (scan, visit, purchase) map to Klaviyo custom metrics. Push will create the metrics if they don't exist.",
      },
      {
        number: 4,
        title: "Build your first flow",
        description:
          "In Klaviyo, create a new Flow triggered by the Push Scan metric. Use creator properties to personalize messaging.",
      },
    ],
    dataFlowAscii: `
  Creator posts   →  Customer scans   →  Push event fired
  content             QR code              to Klaviyo API

  Klaviyo receives→  Flow triggered   →  Email/SMS sent
  custom event         automatically       to customer

  Push tracks     ←  Conversion logged←  Full loop closed
  email open rate      in both platforms
`,
    securityNotes: [
      "Only the Klaviyo Private API Key is stored — no customer PII is stored by Push beyond what you configure.",
      "Push never sends SMS on your behalf — it only triggers your configured Klaviyo flows.",
      "Revoke access anytime by deleting the API key in Klaviyo.",
    ],
    pricing: null,
    reviews: [
      {
        author: "Chen W.",
        role: "Ecommerce Lead, Botanica Skincare",
        rating: 5,
        body: "The Klaviyo integration is exactly what we needed. Creator scan → welcome email in under 2 minutes. Our repeat visit rate is up 22%.",
        date: "2026-03-08",
      },
      {
        author: "Tariq B.",
        role: "Founder, The Scent Studio",
        rating: 5,
        body: "Set it up in one afternoon. Now every creator-referred customer gets a personalized SMS with a discount. ROI is obvious.",
        date: "2026-02-14",
      },
    ],
    website: "https://klaviyo.com",
    authType: "api_key",
  },
  {
    slug: "mailchimp",
    name: "Mailchimp",
    category: "email_sms",
    tagline: "Add creator-referred customers to your Mailchimp lists.",
    description:
      "Automatically tag and subscribe creator-referred visitors to the right Mailchimp audiences.",
    longDescription:
      "Mailchimp remains one of the most accessible email marketing platforms for small businesses. The Push-Mailchimp integration adds creator-referred contacts to your chosen audience with campaign-specific tags — so you can segment and re-market to exactly the customers each creator brought in.",
    logoColor: "#c9a96e",
    logoTextColor: "#003049",
    status: "available",
    featured: false,
    benefits: [
      "Auto-tag contacts by creator campaign",
      "Segment audiences by referral source",
    ],
    features: [
      "Contact auto-subscribe on QR scan",
      "Campaign-level tagging",
      "Audience selection per campaign",
      "Double opt-in support",
      "Merge field mapping",
    ],
    setupSteps: [
      {
        number: 1,
        title: "Connect via Mailchimp OAuth",
        description:
          "Click Connect and authorize Push in the Mailchimp OAuth screen.",
      },
      {
        number: 2,
        title: "Choose your audience",
        description: "Select which Mailchimp audience receives Push contacts.",
      },
      {
        number: 3,
        title: "Configure tagging",
        description:
          "Set up automatic tags (e.g., push-campaign, creator name) applied to each new contact.",
      },
      {
        number: 4,
        title: "Enable for campaigns",
        description:
          "In each Push campaign, toggle Mailchimp sync on. Contacts will start flowing in at first scan.",
      },
    ],
    dataFlowAscii: `
  QR scan event   →  Push captures    →  Contact data
  from creator fan     customer email       extracted

  Push API call   →  Mailchimp adds   →  Tag applied:
  to Mailchimp        to audience          push-[campaign]

  Campaign email  ←  Audience         ←  Segmented and
  sent by you         segmented            ready to send
`,
    securityNotes: [
      "OAuth scope is limited to audience management — no billing or account access.",
      "Mailchimp's double opt-in is respected if enabled on your account.",
    ],
    pricing: null,
    reviews: [
      {
        author: "Laura F.",
        role: "Owner, The Paper Co.",
        rating: 4,
        body: "Easy to set up. The tagging by creator is super useful for seeing which creators drive the best email subscribers.",
        date: "2026-02-20",
      },
    ],
    website: "https://mailchimp.com",
    authType: "oauth",
  },
  {
    slug: "twilio",
    name: "Twilio",
    category: "email_sms",
    tagline: "Send SMS confirmations and offers to creator-referred customers.",
    description:
      "Use Twilio to send real-time SMS when creators scan QR codes or customers claim offers.",
    longDescription:
      "Twilio's programmable messaging lets Push send instant SMS confirmations when a creator-referred customer scans your QR code, claims an offer, or hits a campaign milestone. Build custom notification flows that feel personal — using your own Twilio phone number, your own copy.",
    logoColor: "#c1121f",
    logoTextColor: "#ffffff",
    status: "available",
    featured: false,
    benefits: [
      "Instant SMS on creator scan events",
      "Use your own Twilio number and message copy",
    ],
    features: [
      "Webhook-triggered SMS sends",
      "Campaign event subscriptions",
      "Custom message templates with variables",
      "Delivery status callback",
      "Opt-out management",
    ],
    setupSteps: [
      {
        number: 1,
        title: "Get your Twilio credentials",
        description:
          "In Twilio Console, find your Account SID, Auth Token, and a verified phone number.",
      },
      {
        number: 2,
        title: "Enter credentials in Push",
        description:
          "Paste Account SID, Auth Token, and From Number. Push will send a test message to your number.",
      },
      {
        number: 3,
        title: "Create message templates",
        description:
          "Write SMS templates using Push variables like {{creator_name}}, {{offer_title}}, {{business_name}}.",
      },
      {
        number: 4,
        title: "Subscribe to events",
        description:
          "Choose which events trigger SMS: scan, offer claimed, purchase confirmed. Activate per campaign.",
      },
    ],
    dataFlowAscii: `
  Campaign event  →  Push webhook     →  Twilio API
  (scan/purchase)     fires event          receives request

  Twilio sends    →  Customer's phone →  SMS delivered
  SMS message          receives it         < 5 seconds

  Delivery status →  Push logs result →  Analytics updated
  callback fires       in dashboard
`,
    securityNotes: [
      "Auth Token is encrypted at rest. Push never logs raw SMS content.",
      "Opt-out replies (STOP) are honored automatically via Twilio's compliance layer.",
    ],
    pricing:
      "Twilio charges per message sent. Push does not add any markup. Typical cost: $0.0075/SMS in the US.",
    reviews: [
      {
        author: "Marcus D.",
        role: "Owner, Midtown Barber Co.",
        rating: 5,
        body: "Customers love getting an instant text when they scan. Feels premium. Setup was surprisingly easy.",
        date: "2026-03-01",
      },
      {
        author: "Yuki N.",
        role: "Manager, Noodle House NYC",
        rating: 4,
        body: "The template variables are powerful. We personalize every message with the creator's name and the offer — feels like a real interaction.",
        date: "2026-01-20",
      },
    ],
    website: "https://twilio.com",
    authType: "api_key",
  },

  // ── ANALYTICS ────────────────────────────────────────────────────────
  {
    slug: "google-analytics",
    name: "Google Analytics",
    category: "analytics",
    tagline: "Send Push campaign events to GA4 for full-funnel visibility.",
    description:
      "Push fires custom GA4 events on scan, visit, and conversion — connecting creator campaigns to your existing analytics.",
    longDescription:
      "Google Analytics 4 is the universal analytics platform. By sending Push campaign events to your GA4 property, you can analyze creator-driven traffic alongside your web and app data — building audiences, running attribution reports, and setting up conversions that include offline creator touchpoints.",
    logoColor: "#669bbc",
    logoTextColor: "#003049",
    status: "available",
    featured: false,
    benefits: [
      "Creator campaign events in GA4 alongside web data",
      "Build audiences and conversions from Push events",
    ],
    features: [
      "GA4 Measurement Protocol integration",
      "Custom event schema (push_scan, push_visit, push_purchase)",
      "Campaign UTM parameter auto-injection",
      "Audience export for Google Ads",
      "Real-time event validation",
    ],
    setupSteps: [
      {
        number: 1,
        title: "Get GA4 Measurement ID and API Secret",
        description:
          "In GA4 Admin → Data Streams → your stream, find the Measurement ID and create an API Secret.",
      },
      {
        number: 2,
        title: "Enter credentials in Push",
        description:
          "Paste Measurement ID (G-XXXXXXXX) and API Secret. Push will fire a validation event.",
      },
      {
        number: 3,
        title: "Verify in GA4 DebugView",
        description:
          "Open GA4 → Configure → DebugView. Within 30 seconds you should see a push_connect event.",
      },
      {
        number: 4,
        title: "Create GA4 conversions",
        description:
          "Mark push_purchase as a Key Event in GA4. Use push_scan in audience definitions for retargeting.",
      },
    ],
    dataFlowAscii: `
  Creator scan    →  Push event       →  GA4 Measurement
  event occurs         generated            Protocol API

  GA4 receives    →  Event appears    →  Reports updated
  push_scan event      in real-time         in Analytics

  Audiences built ←  Segment creator  ←  Use in Google Ads
  from Push events     traffic              retargeting
`,
    securityNotes: [
      "Only anonymized event data is sent — no PII is included in GA4 payloads.",
      "API Secret is scoped to write-only Measurement Protocol access.",
    ],
    pricing: null,
    reviews: [
      {
        author: "Elena V.",
        role: "Growth, ModernMade Studio",
        rating: 5,
        body: "Being able to see Push events in GA4 next to our web traffic completes the funnel. Attribution across channels finally makes sense.",
        date: "2026-02-28",
      },
    ],
    website: "https://analytics.google.com",
    authType: "api_key",
  },
  {
    slug: "posthog",
    name: "PostHog",
    category: "analytics",
    tagline: "Product analytics with creator event data from Push.",
    description:
      "Send Push QR scan and conversion events into PostHog for product-quality creator analytics.",
    longDescription:
      "PostHog is the open-source product analytics platform. The Push-PostHog integration sends creator campaign events as PostHog actions, enabling funnel analysis, cohort building, and session replay correlation — all in the same place you track your digital product.",
    logoColor: "#c9a96e",
    logoTextColor: "#003049",
    status: "available",
    featured: false,
    benefits: [
      "Creator events in PostHog funnels and cohorts",
      "Correlate offline visits with digital product sessions",
    ],
    features: [
      "PostHog REST API event ingestion",
      "Person property sync (creator, campaign)",
      "Funnel step mapping",
      "Session replay event correlation (optional)",
      "Feature flag targeting from Push segments",
    ],
    setupSteps: [
      {
        number: 1,
        title: "Get PostHog Project API Key",
        description:
          "In PostHog, go to Settings → Project → API Key and copy your write-access Project API Key.",
      },
      {
        number: 2,
        title: "Configure host (if self-hosted)",
        description:
          "If using PostHog Cloud enter app.posthog.com. For self-hosted, enter your PostHog URL.",
      },
      {
        number: 3,
        title: "Map Push events",
        description:
          "Select which Push events to forward. Each event becomes a PostHog Action with campaign metadata.",
      },
      {
        number: 4,
        title: "Build funnels",
        description:
          "In PostHog, create a funnel starting from push_qr_scan through to your desired conversion event.",
      },
    ],
    dataFlowAscii: `
  Push campaign   →  Event captured   →  PostHog API
  event fires          in Push              ingests event

  Person record   →  Push properties  →  Campaign, creator,
  updated             attached             offer all tagged

  PostHog shows   ←  Funnel analysis  ←  Creator segments
  full funnel          available            in cohorts
`,
    securityNotes: [
      "Project API Key is write-only — no read access to your PostHog data.",
      "All events are anonymized unless you explicitly pass user_id.",
    ],
    pricing: null,
    reviews: [
      {
        author: "Rohan A.",
        role: "Head of Product, Sip & Savor",
        rating: 5,
        body: "As a product-minded operator, having Push events in PostHog is exactly what I wanted. Can finally build funnels that include the offline creator touchpoint.",
        date: "2026-03-15",
      },
    ],
    website: "https://posthog.com",
    authType: "api_key",
  },
  {
    slug: "mixpanel",
    name: "Mixpanel",
    category: "analytics",
    tagline: "User-level creator attribution in Mixpanel.",
    description:
      "Push streams creator campaign events into Mixpanel so you can build user journeys that include offline touchpoints.",
    longDescription:
      "Mixpanel specializes in user-level behavioral analytics. Push integrates via Mixpanel's Ingestion API to send creator-originated events — enriching your existing user profiles with offline campaign touchpoints, enabling precise cohort analysis, and powering Mixpanel Reports with the full customer journey.",
    logoColor: "#c1121f",
    logoTextColor: "#ffffff",
    status: "coming_soon",
    featured: false,
    benefits: [
      "User-level creator attribution in Mixpanel",
      "Offline touchpoints in Mixpanel Reports",
    ],
    features: [
      "Mixpanel Ingestion API integration",
      "User profile enrichment",
      "Event deduplication",
      "Retroactive data backfill",
    ],
    setupSteps: [],
    dataFlowAscii: "",
    securityNotes: [],
    pricing: null,
    reviews: [],
    website: "https://mixpanel.com",
    authType: "api_key",
  },

  // ── CRM ──────────────────────────────────────────────────────────────
  {
    slug: "hubspot",
    name: "HubSpot",
    category: "crm",
    tagline: "Creator campaign contacts flow directly into HubSpot CRM.",
    description:
      "Sync Push campaign leads and contacts into HubSpot for seamless sales follow-up.",
    longDescription:
      "HubSpot CRM is the backbone of sales pipelines for thousands of businesses. Push sends creator-referred contacts, scan events, and deal stages into HubSpot — so your sales team always knows which creator brought in a contact and how that person engaged with your campaigns offline.",
    logoColor: "#c1121f",
    logoTextColor: "#ffffff",
    status: "available",
    featured: true,
    benefits: [
      "Creator-referred contacts auto-created in HubSpot",
      "Deal stage updates from Push campaign milestones",
    ],
    features: [
      "Contact creation and update via HubSpot API",
      "Custom Push properties on contact record",
      "Deal stage sync from campaign milestones",
      "Timeline events for creator campaign activity",
      "Deduplication by email",
    ],
    setupSteps: [
      {
        number: 1,
        title: "Create a HubSpot Private App",
        description:
          "In HubSpot, go to Settings → Integrations → Private Apps and create a new app with CRM read/write scopes.",
      },
      {
        number: 2,
        title: "Enter Access Token",
        description:
          "Copy the Private App Access Token and paste it in Push. We'll verify the connection.",
      },
      {
        number: 3,
        title: "Map Push fields to HubSpot properties",
        description:
          "Match Push contact fields (creator, campaign, offer) to your HubSpot contact properties.",
      },
      {
        number: 4,
        title: "Enable pipeline sync",
        description:
          "Choose a HubSpot pipeline and stages that correspond to Push campaign milestones (scan, visit, purchase).",
      },
    ],
    dataFlowAscii: `
  Creator-referred →  Push creates    →  HubSpot contact
  customer scans       contact record       created/updated

  Campaign        →  Push fires       →  HubSpot timeline
  milestone hit        timeline event       event logged

  Deal stage      →  HubSpot deal     →  Sales team
  advances             updated              notified
`,
    securityNotes: [
      "Private App access token has only the scopes you grant — Push requests minimum necessary.",
      "Deduplication prevents duplicate contacts using email as the unique key.",
    ],
    pricing: null,
    reviews: [
      {
        author: "Sandra P.",
        role: "Sales Manager, The Knot Bridal",
        rating: 5,
        body: "Our sales team can now see which creator brought in each lead. Follow-up response time dropped because context is already in HubSpot.",
        date: "2026-03-20",
      },
      {
        author: "David K.",
        role: "Founder, Cornerstone Legal",
        rating: 4,
        body: "The deal stage sync from Push milestones is clever. We use it to know when a creator-referred lead becomes a real opportunity.",
        date: "2026-02-10",
      },
    ],
    website: "https://hubspot.com",
    authType: "api_key",
  },
  {
    slug: "salesforce",
    name: "Salesforce",
    category: "crm",
    tagline: "Enterprise-grade creator attribution in Salesforce.",
    description:
      "Push syncs campaign leads and opportunities into Salesforce for enterprise sales teams.",
    longDescription:
      "Salesforce is the enterprise CRM of record. Push integrates via the Salesforce REST API to create Leads, update Contact records, and log Campaign Member activities — giving enterprise teams a complete view of how creator content feeds the sales pipeline.",
    logoColor: "#669bbc",
    logoTextColor: "#003049",
    status: "available",
    featured: false,
    benefits: [
      "Creator leads auto-synced as Salesforce Leads",
      "Campaign member activity logged in Salesforce",
    ],
    features: [
      "Connected App OAuth integration",
      "Lead and Contact create/upsert",
      "Campaign Member status sync",
      "Opportunity stage mapping",
      "Custom field mapping",
    ],
    setupSteps: [
      {
        number: 1,
        title: "Create a Salesforce Connected App",
        description:
          "In Salesforce Setup, go to App Manager → New Connected App. Enable OAuth with api and refresh_token scopes.",
      },
      {
        number: 2,
        title: "Authorize Push",
        description:
          "Click Connect Salesforce and complete the OAuth flow. Push will appear as an authorized app in your Salesforce account.",
      },
      {
        number: 3,
        title: "Map objects and fields",
        description:
          "Choose whether Push creates Leads or Contacts, and map Push campaign fields to Salesforce fields.",
      },
      {
        number: 4,
        title: "Configure Campaign Members",
        description:
          "Select a Salesforce Campaign to receive Push campaign member activity. Status values will map to Push milestones.",
      },
    ],
    dataFlowAscii: `
  Push campaign   →  Lead/Contact     →  Salesforce REST
  event fires          record built         API upserted

  Campaign member →  Status updated   →  Salesforce Campaign
  activity logged      to milestone         Member updated

  Opportunity     →  Stage advances   →  Sales pipeline
  identified           automatically        updated
`,
    securityNotes: [
      "Connected App scopes are limited to api and refresh_token — no admin access.",
      "OAuth tokens rotated per Salesforce policy. Push handles token refresh transparently.",
    ],
    pricing: null,
    reviews: [
      {
        author: "Michael O.",
        role: "CRM Lead, Atlas Health Systems",
        rating: 4,
        body: "For our enterprise deals, having creator touchpoints in Salesforce alongside other marketing attribution data is valuable. Setup was more complex but the documentation helped.",
        date: "2026-01-25",
      },
    ],
    website: "https://salesforce.com",
    authType: "oauth",
  },
  {
    slug: "zoho",
    name: "Zoho CRM",
    category: "crm",
    tagline: "Push campaign contacts and activities in Zoho CRM.",
    description:
      "Sync Push leads and campaign events into Zoho CRM for affordable, full-featured CRM attribution.",
    longDescription:
      "Zoho CRM is a cost-effective alternative for growing businesses. Push integrates via Zoho's REST API to create Leads, log Notes, and trigger workflows — ensuring every creator-referred contact is tracked through your Zoho sales process.",
    logoColor: "#c9a96e",
    logoTextColor: "#003049",
    status: "coming_soon",
    featured: false,
    benefits: [
      "Creator leads in Zoho without manual entry",
      "Campaign notes auto-logged per contact",
    ],
    features: [
      "Zoho OAuth integration",
      "Lead creation and update",
      "Campaign note logging",
      "Workflow trigger support",
    ],
    setupSteps: [],
    dataFlowAscii: "",
    securityNotes: [],
    pricing: null,
    reviews: [],
    website: "https://zoho.com/crm",
    authType: "oauth",
  },

  // ── ACCOUNTING ────────────────────────────────────────────────────────
  {
    slug: "quickbooks",
    name: "QuickBooks",
    category: "accounting",
    tagline: "Campaign spend and revenue automatically in QuickBooks.",
    description:
      "Push syncs campaign payouts and attributed revenue into QuickBooks Online for clean accounting.",
    longDescription:
      "QuickBooks Online is the accounting standard for small businesses. The Push-QuickBooks integration creates Journal Entries for campaign payouts and attributed revenue — so your accountant always has a clean, categorized record of creator marketing spend and returns without manual reconciliation.",
    logoColor: "#003049",
    logoTextColor: "#f5f2ec",
    status: "available",
    featured: true,
    benefits: [
      "Campaign payouts auto-recorded as expenses",
      "Attributed revenue entries linked to campaigns",
    ],
    features: [
      "QuickBooks OAuth 2.0",
      "Journal Entry creation for payouts",
      "Revenue category mapping",
      "Monthly reconciliation export",
      "Multi-currency support",
    ],
    setupSteps: [
      {
        number: 1,
        title: "Connect QuickBooks",
        description:
          "Click Connect and complete the Intuit OAuth 2.0 flow. Log in with your QuickBooks Online admin account.",
      },
      {
        number: 2,
        title: "Map accounts",
        description:
          "Map Push campaign spend to your marketing expense account, and attributed revenue to your chosen income account.",
      },
      {
        number: 3,
        title: "Set sync frequency",
        description:
          "Choose daily or weekly journal entry creation. Push batches entries to minimize QuickBooks transaction volume.",
      },
      {
        number: 4,
        title: "Review first entries",
        description:
          "After the first sync, review the journal entries in QuickBooks. Share the Accountant Access link with your bookkeeper.",
      },
    ],
    dataFlowAscii: `
  Campaign payout →  Push records     →  QBO Journal Entry
  to creator           expense data         created (debit)

  Attributed      →  Push records     →  QBO Journal Entry
  revenue logged       revenue data         created (credit)

  Monthly close   ←  Reconciliation   ←  Clean P&L with
  simplified           export ready         campaign categories
`,
    securityNotes: [
      "OAuth scope: com.intuit.quickbooks.accounting (read + limited write for Journal Entries only).",
      "Push cannot create invoices, pay bills, or access payroll.",
      "Access can be revoked in Intuit Account Manager at any time.",
    ],
    pricing: null,
    reviews: [
      {
        author: "Patricia M.",
        role: "CFO, Grove & Grain",
        rating: 5,
        body: "Month-end close for marketing used to take hours of spreadsheet work. Now Push and QuickBooks handle it automatically. My accountant loves it.",
        date: "2026-03-05",
      },
      {
        author: "Tony H.",
        role: "Owner, Hardware Heaven",
        rating: 5,
        body: "The account mapping setup was smart — I could tell Push exactly which expense line to use. Very clean.",
        date: "2026-01-30",
      },
    ],
    website: "https://quickbooks.intuit.com",
    authType: "oauth",
  },
  {
    slug: "xero",
    name: "Xero",
    category: "accounting",
    tagline: "Xero-native accounting for your Push campaign spend.",
    description:
      "Connect Xero and let Push create Bills and Revenue entries for every campaign automatically.",
    longDescription:
      "Xero is the preferred accounting platform for small businesses across the UK, Australia, and North America. Push integrates via Xero's API to log creator payouts as Bills and attributed revenue as invoices — keeping your Xero books accurate without any manual data entry.",
    logoColor: "#669bbc",
    logoTextColor: "#003049",
    status: "available",
    featured: false,
    benefits: [
      "Creator payouts logged as Xero Bills automatically",
      "Revenue entries categorized by campaign",
    ],
    features: [
      "Xero OAuth 2.0 integration",
      "Bill creation for campaign payouts",
      "Revenue journal posting",
      "Account code mapping",
      "Bank reconciliation support",
    ],
    setupSteps: [
      {
        number: 1,
        title: "Connect Xero",
        description:
          "Click Connect Xero and complete the OAuth 2.0 flow with your Xero admin account.",
      },
      {
        number: 2,
        title: "Select organization",
        description:
          "If you have multiple Xero organizations, select the one linked to your Push merchant account.",
      },
      {
        number: 3,
        title: "Map account codes",
        description:
          "Map Push campaign spend to your Marketing Expenses account code, and revenue to your Sales account.",
      },
      {
        number: 4,
        title: "Enable automatic posting",
        description:
          "Toggle on automatic bill creation. Push will create a Bill for each creator payout within 24 hours of settlement.",
      },
    ],
    dataFlowAscii: `
  Campaign payout →  Push settlement  →  Xero Bill created
  approved             recorded             (Accounts Payable)

  Revenue         →  Push revenue     →  Xero journal posted
  attributed           logged               (Sales account)

  Bank feed       ←  Transactions     ←  Ready for Xero
  reconciliation       match entries        auto-reconcile
`,
    securityNotes: [
      "OAuth scope: accounting.transactions — Bills and Invoices only, no payroll or bank feeds.",
      "Read-only access to your Chart of Accounts for mapping purposes.",
    ],
    pricing: null,
    reviews: [
      {
        author: "Kate B.",
        role: "Finance Manager, Studio North",
        rating: 4,
        body: "The Xero integration made our bookkeeper very happy. Campaign payouts just appear as bills, perfectly categorized.",
        date: "2026-02-25",
      },
    ],
    website: "https://xero.com",
    authType: "oauth",
  },

  // ── ECOMMERCE ────────────────────────────────────────────────────────
  {
    slug: "shopify",
    name: "Shopify",
    category: "ecommerce",
    tagline: "Connect your Shopify store for online-to-offline attribution.",
    description:
      "Push links creator campaigns to Shopify orders — closing the loop between offline discovery and online purchase.",
    longDescription:
      "Shopify powers millions of online stores. Push integrates via the Shopify Admin API to listen for orders tagged with Push campaign UTMs or discount codes — attributing online purchases to specific creators who drove awareness offline. Build a complete picture of creator ROI that spans both your physical location and your online store.",
    logoColor: "#003049",
    logoTextColor: "#f5f2ec",
    status: "available",
    featured: true,
    benefits: [
      "Online Shopify orders attributed to offline creator visits",
      "UTM and discount code-based creator tracking",
    ],
    features: [
      "Shopify Admin API integration",
      "Order webhook for real-time attribution",
      "Discount code-to-campaign mapping",
      "UTM parameter tracking",
      "Product-level attribution (optional)",
    ],
    setupSteps: [
      {
        number: 1,
        title: "Install Push on Shopify",
        description:
          "Click Connect Shopify and enter your store URL (yourstore.myshopify.com). Push will redirect to Shopify for app installation.",
      },
      {
        number: 2,
        title: "Set up campaign discount codes",
        description:
          "In Push, generate unique discount codes per campaign. These are automatically created in your Shopify store.",
      },
      {
        number: 3,
        title: "Configure UTM tracking",
        description:
          "Enable UTM auto-tagging on QR codes in Push. All QR links will include utm_source=push and utm_campaign=[campaign_id].",
      },
      {
        number: 4,
        title: "Verify order attribution",
        description:
          "Place a test order using a Push discount code. The order should appear in your Push dashboard as an attributed conversion.",
      },
    ],
    dataFlowAscii: `
  Creator content →  Customer visits  →  QR scan logged
  drives awareness     your store           by Push

  Customer shops  →  Push discount    →  Shopify order
  online later         code used            created

  Shopify webhook →  Push matches     →  Creator credited
  fires               order to visit        for conversion
`,
    securityNotes: [
      "Push requests read_orders and write_discounts scopes only.",
      "No customer payment data is transmitted to Push — order total and SKU only.",
      "Uninstalling the Push Shopify app immediately revokes all access.",
    ],
    pricing: null,
    reviews: [
      {
        author: "Nina R.",
        role: "Ecommerce Lead, Velvet & Thread",
        rating: 5,
        body: "This is the integration I didn't know I needed. Creators drive people to our pop-ups and then they shop online later — now we can actually measure that.",
        date: "2026-03-18",
      },
      {
        author: "Brett M.",
        role: "Founder, Pacific Supply Co.",
        rating: 5,
        body: "Discount code mapping is brilliant. Each creator has their own code and it all traces back automatically. Our attribution model is now actually accurate.",
        date: "2026-02-22",
      },
    ],
    website: "https://shopify.com",
    authType: "oauth",
  },
  {
    slug: "woocommerce",
    name: "WooCommerce",
    category: "ecommerce",
    tagline: "Push attribution for your WooCommerce store.",
    description:
      "Track how creator campaigns drive purchases on your WooCommerce-powered online store.",
    longDescription:
      "WooCommerce powers a huge share of independent online stores. Push connects via WooCommerce REST API keys to monitor orders tagged with Push campaign parameters — providing creator-level attribution for every online order that originated from an offline campaign interaction.",
    logoColor: "#669bbc",
    logoTextColor: "#003049",
    status: "coming_soon",
    featured: false,
    benefits: [
      "WooCommerce orders attributed to creator campaigns",
      "Campaign coupon code tracking built in",
    ],
    features: [
      "WooCommerce REST API key auth",
      "Order attribution via UTM and coupons",
      "Webhook-based real-time sync",
      "Product category attribution",
    ],
    setupSteps: [],
    dataFlowAscii: "",
    securityNotes: [],
    pricing: null,
    reviews: [],
    website: "https://woocommerce.com",
    authType: "api_key",
  },

  // ── AUTOMATION ────────────────────────────────────────────────────────
  {
    slug: "zapier",
    name: "Zapier",
    category: "automation",
    tagline: "Connect Push to 6,000+ apps — without code.",
    description:
      "Use Zapier to send Push campaign events to any app in your stack. No code required.",
    longDescription:
      "Push's Zapier integration gives you access to thousands of apps without writing a single line of code. Trigger Zaps from Push events like QR scans, campaign milestones, creator applications, and payment settlements. Send data to Slack, Airtable, Google Sheets, Notion, Calendly, and thousands more. If Push doesn't have a native integration for a tool you use, Zapier fills the gap instantly.",
    logoColor: "#c1121f",
    logoTextColor: "#ffffff",
    status: "available",
    featured: true,
    benefits: [
      "Connect Push to 6,000+ apps with no code",
      "Trigger Zaps from any Push campaign event",
    ],
    features: [
      "Push Zapier Trigger: QR Scan",
      "Push Zapier Trigger: Campaign Milestone",
      "Push Zapier Trigger: Creator Application",
      "Push Zapier Trigger: Payment Settlement",
      "Zapier Actions: Update Push Campaign Status",
      "Multi-step Zap support",
    ],
    setupSteps: [
      {
        number: 1,
        title: "Get your Push Zapier API Key",
        description:
          "Click Generate Key below. Copy the Push Zapier API Key — you'll need it in the Zapier dashboard.",
      },
      {
        number: 2,
        title: "Find Push on Zapier",
        description:
          "Go to zapier.com and search for Push in the app directory. Click on Push — NYC Creator Platform.",
      },
      {
        number: 3,
        title: "Authenticate with your API Key",
        description:
          "When Zapier prompts for authentication, paste your Push Zapier API Key and click Continue.",
      },
      {
        number: 4,
        title: "Build your first Zap",
        description:
          "Choose a Push trigger (e.g., QR Scan) and connect it to any action in 6,000+ apps. Activate your Zap.",
      },
    ],
    dataFlowAscii: `
  Push event      →  Zapier receives  →  Your chosen
  fires trigger        event data           app triggered

  Example:
  QR Scan         →  Zapier Zap       →  Google Sheets row
  fired                runs                 added

  Milestone hit   →  Zapier Zap       →  Slack message
  in campaign          runs                 sent to #sales
`,
    securityNotes: [
      "Zapier API Key is unique per merchant. Rotate it anytime without affecting other integrations.",
      "Push only sends event data you explicitly select in the Zap configuration.",
      "Zapier's data handling is governed by Zapier's own privacy policy.",
    ],
    pricing: null,
    reviews: [
      {
        author: "Tasha L.",
        role: "Operations, Bloom Collective",
        rating: 5,
        body: "The Zapier integration is the glue that holds everything together. Push → Airtable for tracking, Push → Slack for alerts. Zero code. Highly recommend.",
        date: "2026-03-12",
      },
      {
        author: "Greg F.",
        role: "Owner, The Frame Workshop",
        rating: 5,
        body: "I connected Push to my Google Sheet for campaign tracking in about 10 minutes. Now my whole team can see real-time scan counts without logging into Push.",
        date: "2026-02-08",
      },
      {
        author: "Mei L.",
        role: "Director of Ops, Lume Candles",
        rating: 4,
        body: "Works well. Would love more native Push actions (not just triggers) in Zapier, but it's already very useful.",
        date: "2026-01-18",
      },
    ],
    website: "https://zapier.com",
    authType: "api_key",
  },
  {
    slug: "make",
    name: "Make",
    category: "automation",
    tagline: "Visual automation for Push — built for power users.",
    description:
      "Connect Push to Make (formerly Integromat) for visual, no-code automation workflows.",
    longDescription:
      "Make is the visual automation platform favored by advanced users who need complex, branching workflows. Push integrates with Make via webhook triggers and HTTP modules — letting you build sophisticated multi-step automations that react to any Push campaign event with precision and control.",
    logoColor: "#669bbc",
    logoTextColor: "#003049",
    status: "coming_soon",
    featured: false,
    benefits: [
      "Visual workflow builder for Push events",
      "Complex multi-branch automations without code",
    ],
    features: [
      "Webhook trigger for all Push events",
      "HTTP module for Push API actions",
      "Data transformer support",
      "Error handling and retry logic",
    ],
    setupSteps: [],
    dataFlowAscii: "",
    securityNotes: [],
    pricing: null,
    reviews: [],
    website: "https://make.com",
    authType: "webhook",
  },
];

// Helper to get integrations by category
export function getIntegrationsByCategory(
  category: IntegrationCategory,
): Integration[] {
  return INTEGRATIONS.filter((i) => i.category === category);
}

// Helper to get a single integration by slug
export function getIntegrationBySlug(slug: string): Integration | undefined {
  return INTEGRATIONS.find((i) => i.slug === slug);
}

// Featured integrations for carousel
export function getFeaturedIntegrations(): Integration[] {
  return INTEGRATIONS.filter((i) => i.featured);
}
