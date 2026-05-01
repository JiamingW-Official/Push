// Extended QR code mock data for merchant QR code manager
// TODO: wire to Supabase; generate signed QR payload

export type PosterType =
  | "a4"
  | "table-tent"
  | "window-sticker"
  | "cash-register";

export type QRCodeRecord = {
  id: string;
  campaign_id: string;
  campaign_name: string;
  creator_id: string;
  creator_name: string;
  creator_handle: string;
  poster_type: PosterType;
  hero_message: string;
  sub_message: string;
  scan_url: string;
  scan_count: number;
  conversion_count: number;
  verified_customers: number;
  attributed_revenue: number;
  created_at: string;
  last_active_at: string;
  disabled: boolean;
};

export const POSTER_TYPE_LABELS: Record<PosterType, string> = {
  a4: "A4 Poster",
  "table-tent": 'Table Tent 4×6"',
  "window-sticker": 'Window Sticker 8×8"',
  "cash-register": 'Cash Register 3×3"',
};

export const MOCK_QR_CODES: QRCodeRecord[] = [
  {
    id: "qr-blank-street-001",
    campaign_id: "demo-campaign-001",
    campaign_name: "Free Latte for a 30-Second Reel",
    creator_id: "creator-maya-johnson",
    creator_name: "Maya Johnson",
    creator_handle: "@mayajohnson.nyc",
    poster_type: "a4",
    hero_message: "Earn rewards with your content",
    sub_message: "Scan to join the Blank Street creator campaign",
    scan_url: "/scan/qr-blank-street-001",
    scan_count: 48,
    conversion_count: 31,
    verified_customers: 31,
    attributed_revenue: 52700,
    created_at: "2026-04-01T10:00:00Z",
    last_active_at: "2026-04-16T18:42:00Z",
    disabled: false,
  },
  {
    id: "qr-blank-street-002",
    campaign_id: "demo-campaign-001",
    campaign_name: "Free Latte for a 30-Second Reel",
    creator_id: "creator-jasper-lee",
    creator_name: "Jasper Lee",
    creator_handle: "@jasperlee.eats",
    poster_type: "table-tent",
    hero_message: "Free latte. Just film it.",
    sub_message: "Creators scan here to claim your reward",
    scan_url: "/scan/qr-blank-street-002",
    scan_count: 22,
    conversion_count: 17,
    verified_customers: 17,
    attributed_revenue: 28900,
    created_at: "2026-04-02T09:00:00Z",
    last_active_at: "2026-04-17T08:11:00Z",
    disabled: false,
  },
  {
    id: "qr-morning-rush-001",
    campaign_id: "demo-campaign-mc-002",
    campaign_name: "Morning Rush Special Reel",
    creator_id: "creator-sofia-martinez",
    creator_name: "Sofia Martinez",
    creator_handle: "@sofia.weekdays",
    poster_type: "window-sticker",
    hero_message: "Capture the morning rush",
    sub_message: "Scan to join our creator campaign",
    scan_url: "/scan/qr-morning-rush-001",
    scan_count: 19,
    conversion_count: 12,
    verified_customers: 12,
    attributed_revenue: 21400,
    created_at: "2026-04-05T08:00:00Z",
    last_active_at: "2026-04-15T09:30:00Z",
    disabled: false,
  },
  {
    id: "qr-morning-rush-002",
    campaign_id: "demo-campaign-mc-002",
    campaign_name: "Morning Rush Special Reel",
    creator_id: "creator-rina-liu",
    creator_name: "Rina Liu",
    creator_handle: "@rina.afterhours",
    poster_type: "cash-register",
    hero_message: "Scan to earn",
    sub_message: "Creator campaign — join now",
    scan_url: "/scan/qr-morning-rush-002",
    scan_count: 9,
    conversion_count: 7,
    verified_customers: 7,
    attributed_revenue: 11800,
    created_at: "2026-04-06T07:30:00Z",
    last_active_at: "2026-04-14T07:55:00Z",
    disabled: false,
  },
  {
    id: "qr-holiday-001",
    campaign_id: "demo-campaign-mc-003",
    campaign_name: "Holiday Blend Launch",
    creator_id: "creator-drew-carter",
    creator_name: "Drew Carter",
    creator_handle: "@drew.carter.city",
    poster_type: "a4",
    hero_message: "The holiday blend is here",
    sub_message: "Document the launch, earn rewards",
    scan_url: "/scan/qr-holiday-001",
    scan_count: 34,
    conversion_count: 21,
    verified_customers: 21,
    attributed_revenue: 39900,
    created_at: "2026-03-01T10:00:00Z",
    last_active_at: "2026-03-14T16:20:00Z",
    disabled: true,
  },
  {
    id: "qr-holiday-002",
    campaign_id: "demo-campaign-mc-003",
    campaign_name: "Holiday Blend Launch",
    creator_id: "creator-elena-brooks",
    creator_name: "Elena Brooks",
    creator_handle: "@elenabrooks.home",
    poster_type: "table-tent",
    hero_message: "Season's finest pour",
    sub_message: "Creators: scan to participate",
    scan_url: "/scan/qr-holiday-002",
    scan_count: 11,
    conversion_count: 8,
    verified_customers: 8,
    attributed_revenue: 14600,
    created_at: "2026-03-02T11:00:00Z",
    last_active_at: "2026-03-13T14:00:00Z",
    disabled: true,
  },
];

// Aggregate stats for hero section
export const QR_STATS = {
  total_generated: MOCK_QR_CODES.length,
  scans_this_month: MOCK_QR_CODES.filter((q) => !q.disabled).reduce(
    (s, q) => s + q.scan_count,
    0,
  ),
  verified_conversions_month: MOCK_QR_CODES.filter((q) => !q.disabled).reduce(
    (s, q) => s + q.conversion_count,
    0,
  ),
};

// Active campaigns available for QR generation
export const ACTIVE_CAMPAIGNS_FOR_QR = [
  { id: "demo-campaign-001", name: "Free Latte for a 30-Second Reel" },
  { id: "demo-campaign-mc-002", name: "Morning Rush Special Reel" },
];
