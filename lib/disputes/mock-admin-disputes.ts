// Push Platform — Admin Dispute Mock Data
// 15 open/in-review + 6 resolved disputes across real NYC merchants & creators

export type DisputeStatus =
  | "open"
  | "under_review"
  | "awaiting_evidence"
  | "escalated"
  | "resolved"
  | "dismissed";

export type DisputeSeverity = "low" | "medium" | "high" | "critical";

export type DisputeOutcome =
  | "refund_creator"
  | "refund_merchant"
  | "split"
  | "dismiss";

export type DisputeEventType =
  | "opened"
  | "evidence_submitted"
  | "evidence_requested"
  | "admin_note"
  | "decision_made"
  | "escalated"
  | "thread_locked"
  | "message_creator"
  | "message_merchant"
  | "resolved"
  | "dismissed";

export type DisputeEvent = {
  id: string;
  dispute_id: string;
  type: DisputeEventType;
  actor: "creator" | "merchant" | "admin" | "system";
  actor_name: string;
  content: string;
  attachment_url?: string;
  timestamp: string;
  internal?: boolean; // admin-only notes
};

export type AdminNote = {
  id: string;
  dispute_id: string;
  author: string;
  content: string;
  timestamp: string;
};

export type Dispute = {
  id: string;
  campaign_id: string;
  campaign_title: string;
  campaign_category: string;
  creator_id: string;
  creator_name: string;
  creator_handle: string;
  creator_tier:
    | "seed"
    | "explorer"
    | "operator"
    | "proven"
    | "closer"
    | "partner";
  creator_avatar: string;
  merchant_id: string;
  merchant_name: string;
  merchant_business: string;
  amount: number; // disputed payout in USD
  status: DisputeStatus;
  severity: DisputeSeverity;
  reason: string;
  description: string;
  opened_at: string;
  updated_at: string;
  sla_deadline: string; // 72h SLA from opened_at
  resolved_at?: string;
  outcome?: DisputeOutcome;
  outcome_split_pct?: number; // creator's share in split (0-100)
  outcome_reasoning?: string;
  timeline: DisputeEvent[];
  admin_notes: AdminNote[];
  thread_locked: boolean;
  escalated_to_legal: boolean;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function addHours(base: string, hours: number): string {
  return new Date(new Date(base).getTime() + hours * 3_600_000).toISOString();
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

export const MOCK_DISPUTES: Dispute[] = [
  // ── 1. QR never activated ────────────────────────────────────────────────
  {
    id: "dsp_001",
    campaign_id: "cmp_grnd_brew",
    campaign_title: "Grand Brew Opening Buzz",
    campaign_category: "food_beverage",
    creator_id: "cre_001",
    creator_name: "Maya Chen",
    creator_handle: "@mayaeatsmanhattan",
    creator_tier: "operator",
    creator_avatar: "https://i.pravatar.cc/150?img=47",
    merchant_id: "mrc_001",
    merchant_name: "Alex Rodriguez",
    merchant_business: "Grand Brew Coffee — Williamsburg",
    amount: 120,
    status: "open",
    severity: "medium",
    reason: "QR code never provided by merchant",
    description:
      "I completed the visit and posted content as required, but the merchant never shared the QR code link. The campaign tracking shows 0 scans because I had nothing to share.",
    opened_at: "2026-04-15T09:12:00Z",
    updated_at: "2026-04-15T09:12:00Z",
    sla_deadline: "2026-04-18T09:12:00Z",
    thread_locked: false,
    escalated_to_legal: false,
    timeline: [
      {
        id: "evt_001_1",
        dispute_id: "dsp_001",
        type: "opened",
        actor: "creator",
        actor_name: "Maya Chen",
        content:
          "I completed the visit and posted content as required, but the merchant never shared the QR code link. The campaign tracking shows 0 scans because I had nothing to share.",
        timestamp: "2026-04-15T09:12:00Z",
      },
      {
        id: "evt_001_2",
        dispute_id: "dsp_001",
        type: "message_merchant",
        actor: "system",
        actor_name: "Push System",
        content:
          "Merchant has been notified of the dispute and asked to respond within 24 hours.",
        timestamp: "2026-04-15T09:13:00Z",
      },
    ],
    admin_notes: [],
  },

  // ── 2. Content deleted ───────────────────────────────────────────────────
  {
    id: "dsp_002",
    campaign_id: "cmp_katz_deli",
    campaign_title: "Katz's Deli Heritage Push",
    campaign_category: "food_beverage",
    creator_id: "cre_002",
    creator_name: "Jordan Lee",
    creator_handle: "@jordanbites",
    creator_tier: "proven",
    creator_avatar: "https://i.pravatar.cc/150?img=12",
    merchant_id: "mrc_002",
    merchant_name: "Sam Kessler",
    merchant_business: "Katz's Delicatessen — LES",
    amount: 200,
    status: "under_review",
    severity: "high",
    reason: "Merchant claims content was removed 3 days after posting",
    description:
      "The merchant is refusing to pay because they claim I deleted my Instagram post. I have screenshots proving the post is still live. This is false.",
    opened_at: "2026-04-13T14:30:00Z",
    updated_at: "2026-04-14T11:00:00Z",
    sla_deadline: "2026-04-16T14:30:00Z",
    thread_locked: false,
    escalated_to_legal: false,
    timeline: [
      {
        id: "evt_002_1",
        dispute_id: "dsp_002",
        type: "opened",
        actor: "merchant",
        actor_name: "Sam Kessler",
        content:
          "Creator deleted their Instagram post 3 days after posting. Campaign terms require content to remain live for 30 days.",
        timestamp: "2026-04-13T14:30:00Z",
      },
      {
        id: "evt_002_2",
        dispute_id: "dsp_002",
        type: "evidence_submitted",
        actor: "creator",
        actor_name: "Jordan Lee",
        content:
          "My post is absolutely still live. Attaching screenshot with timestamp from today.",
        attachment_url:
          "https://placehold.co/600x400?text=Instagram+Screenshot",
        timestamp: "2026-04-13T16:00:00Z",
      },
      {
        id: "evt_002_3",
        dispute_id: "dsp_002",
        type: "evidence_submitted",
        actor: "merchant",
        actor_name: "Sam Kessler",
        content:
          "This screenshot could be fabricated. I checked the profile myself and the post was not visible.",
        timestamp: "2026-04-14T09:00:00Z",
      },
      {
        id: "evt_002_4",
        dispute_id: "dsp_002",
        type: "admin_note",
        actor: "admin",
        actor_name: "Admin",
        content:
          "Pulled creator's Instagram profile via internal tool. Post ID confirmed live. Merchant claim appears invalid.",
        timestamp: "2026-04-14T11:00:00Z",
        internal: true,
      },
    ],
    admin_notes: [
      {
        id: "anote_002_1",
        dispute_id: "dsp_002",
        author: "Admin",
        content:
          "Post confirmed live via internal IG audit. Lean toward refund_creator. Need to check campaign terms re: post duration exactly.",
        timestamp: "2026-04-14T11:05:00Z",
      },
    ],
  },

  // ── 3. Visit not counted ─────────────────────────────────────────────────
  {
    id: "dsp_003",
    campaign_id: "cmp_momofuku",
    campaign_title: "Momofuku Noodle Bar Lunch Rush",
    campaign_category: "food_beverage",
    creator_id: "cre_003",
    creator_name: "Priya Sharma",
    creator_handle: "@priyafoodie",
    creator_tier: "explorer",
    creator_avatar: "https://i.pravatar.cc/150?img=25",
    merchant_id: "mrc_003",
    merchant_name: "David Chang",
    merchant_business: "Momofuku Noodle Bar — East Village",
    amount: 85,
    status: "awaiting_evidence",
    severity: "low",
    reason: "QR scan recorded but merchant denies visit",
    description:
      "I scanned the QR code in-store — the confirmation screen appeared. The merchant claims no one matching my description visited that day.",
    opened_at: "2026-04-14T18:00:00Z",
    updated_at: "2026-04-15T10:00:00Z",
    sla_deadline: "2026-04-17T18:00:00Z",
    thread_locked: false,
    escalated_to_legal: false,
    timeline: [
      {
        id: "evt_003_1",
        dispute_id: "dsp_003",
        type: "opened",
        actor: "creator",
        actor_name: "Priya Sharma",
        content:
          "QR scan recorded but merchant is disputing the visit happened.",
        timestamp: "2026-04-14T18:00:00Z",
      },
      {
        id: "evt_003_2",
        dispute_id: "dsp_003",
        type: "evidence_requested",
        actor: "admin",
        actor_name: "Admin",
        content:
          "Please provide: (1) screenshot of QR scan confirmation, (2) any in-store photo/video, (3) receipt if purchased.",
        timestamp: "2026-04-15T10:00:00Z",
      },
    ],
    admin_notes: [],
  },

  // ── 4. Low quality content ───────────────────────────────────────────────
  {
    id: "dsp_004",
    campaign_id: "cmp_blue_bottle",
    campaign_title: "Blue Bottle SoHo Creator Series",
    campaign_category: "food_beverage",
    creator_id: "cre_004",
    creator_name: "Tom Walsh",
    creator_handle: "@tomwalshnyc",
    creator_tier: "seed",
    creator_avatar: "https://i.pravatar.cc/150?img=33",
    merchant_id: "mrc_004",
    merchant_name: "Jessica Park",
    merchant_business: "Blue Bottle Coffee — SoHo",
    amount: 60,
    status: "under_review",
    severity: "medium",
    reason: "Merchant claims content quality didn't meet campaign standards",
    description:
      "The campaign brief said 'high quality photography.' Merchant is refusing payment claiming my content was too dark and didn't feature the product clearly.",
    opened_at: "2026-04-12T11:00:00Z",
    updated_at: "2026-04-14T15:00:00Z",
    sla_deadline: "2026-04-15T11:00:00Z",
    thread_locked: false,
    escalated_to_legal: false,
    timeline: [
      {
        id: "evt_004_1",
        dispute_id: "dsp_004",
        type: "opened",
        actor: "creator",
        actor_name: "Tom Walsh",
        content:
          "Merchant won't pay because they claim my post was too dark. Brief only said 'feature the product' which I did.",
        timestamp: "2026-04-12T11:00:00Z",
      },
      {
        id: "evt_004_2",
        dispute_id: "dsp_004",
        type: "evidence_submitted",
        actor: "creator",
        actor_name: "Tom Walsh",
        content:
          "Attaching the original post. Product is clearly visible, lit with natural light.",
        attachment_url:
          "https://placehold.co/600x400?text=Creator+Post+Screenshot",
        timestamp: "2026-04-12T12:00:00Z",
      },
      {
        id: "evt_004_3",
        dispute_id: "dsp_004",
        type: "message_merchant",
        actor: "merchant",
        actor_name: "Jessica Park",
        content:
          "The image quality is not professional. The cup is barely visible and the background is cluttered. This does not represent our brand.",
        timestamp: "2026-04-13T09:00:00Z",
      },
    ],
    admin_notes: [],
  },

  // ── 5. Fraudulent scan attempt ───────────────────────────────────────────
  {
    id: "dsp_005",
    campaign_id: "cmp_eataly",
    campaign_title: "Eataly Flatiron Taste Tour",
    campaign_category: "food_beverage",
    creator_id: "cre_005",
    creator_name: "Carlos Vega",
    creator_handle: "@carlos_eats_nyc",
    creator_tier: "operator",
    creator_avatar: "https://i.pravatar.cc/150?img=8",
    merchant_id: "mrc_005",
    merchant_name: "Mario Batali",
    merchant_business: "Eataly NYC Flatiron",
    amount: 150,
    status: "escalated",
    severity: "critical",
    reason: "Suspected coordinated scan fraud — 47 scans from single IP",
    description:
      "Our attribution system flagged 47 QR scans attributed to this creator originating from the same IP address within a 2-minute window. Creator claims a friend helped share the QR code.",
    opened_at: "2026-04-10T08:00:00Z",
    updated_at: "2026-04-15T16:00:00Z",
    sla_deadline: "2026-04-13T08:00:00Z",
    thread_locked: true,
    escalated_to_legal: true,
    timeline: [
      {
        id: "evt_005_1",
        dispute_id: "dsp_005",
        type: "opened",
        actor: "system",
        actor_name: "Push Fraud Detection",
        content:
          "ALERT: 47 QR scans from creator dsp_005 detected from IP 192.168.1.45 within 127 seconds. Automatic dispute opened.",
        timestamp: "2026-04-10T08:00:00Z",
      },
      {
        id: "evt_005_2",
        dispute_id: "dsp_005",
        type: "message_creator",
        actor: "admin",
        actor_name: "Admin",
        content:
          "We have flagged unusual scan activity on your account. Can you explain 47 scans from the same IP in 2 minutes?",
        timestamp: "2026-04-10T10:00:00Z",
      },
      {
        id: "evt_005_3",
        dispute_id: "dsp_005",
        type: "evidence_submitted",
        actor: "creator",
        actor_name: "Carlos Vega",
        content:
          "I posted the QR link in my Instagram story and asked followers to scan it to support me. I didn't think that violated any rules.",
        timestamp: "2026-04-10T14:00:00Z",
      },
      {
        id: "evt_005_4",
        dispute_id: "dsp_005",
        type: "escalated",
        actor: "admin",
        actor_name: "Admin",
        content:
          "Escalating to legal. QR sharing outside in-person visit context violates Platform Terms §4.2. Account suspended pending review.",
        timestamp: "2026-04-11T09:00:00Z",
      },
      {
        id: "evt_005_5",
        dispute_id: "dsp_005",
        type: "thread_locked",
        actor: "admin",
        actor_name: "Admin",
        content: "Thread locked pending legal review.",
        timestamp: "2026-04-11T09:01:00Z",
      },
    ],
    admin_notes: [
      {
        id: "anote_005_1",
        dispute_id: "dsp_005",
        author: "Admin",
        content:
          "Legal flagged. Creator account suspended. Merchant to receive refund. Evidence package sent to legal@pushnyc.co.",
        timestamp: "2026-04-11T09:30:00Z",
      },
    ],
  },

  // ── 6. Payment delay ────────────────────────────────────────────────────
  {
    id: "dsp_006",
    campaign_id: "cmp_tacos_morales",
    campaign_title: "Tacos Morales Williamsburg Launch",
    campaign_category: "food_beverage",
    creator_id: "cre_006",
    creator_name: "Aisha Johnson",
    creator_handle: "@aishanyceats",
    creator_tier: "closer",
    creator_avatar: "https://i.pravatar.cc/150?img=44",
    merchant_id: "mrc_006",
    merchant_name: "Roberto Morales",
    merchant_business: "Tacos Morales — Williamsburg",
    amount: 340,
    status: "open",
    severity: "high",
    reason: "Payment not received 14 days after campaign verification",
    description:
      "Campaign was verified on April 1st. Per contract, payment should have processed within 7 business days. It has been 14 days with no payment and merchant is unresponsive.",
    opened_at: "2026-04-15T08:00:00Z",
    updated_at: "2026-04-15T08:00:00Z",
    sla_deadline: "2026-04-18T08:00:00Z",
    thread_locked: false,
    escalated_to_legal: false,
    timeline: [
      {
        id: "evt_006_1",
        dispute_id: "dsp_006",
        type: "opened",
        actor: "creator",
        actor_name: "Aisha Johnson",
        content:
          "Campaign verified April 1st. No payment received after 14 days. Merchant not responding to messages.",
        timestamp: "2026-04-15T08:00:00Z",
      },
    ],
    admin_notes: [],
  },

  // ── 7. Wrong campaign specs ──────────────────────────────────────────────
  {
    id: "dsp_007",
    campaign_id: "cmp_soho_house",
    campaign_title: "Soho House Membership Drive",
    campaign_category: "lifestyle",
    creator_id: "cre_007",
    creator_name: "Emma Davis",
    creator_handle: "@emmadavisnyc",
    creator_tier: "partner",
    creator_avatar: "https://i.pravatar.cc/150?img=5",
    merchant_id: "mrc_007",
    merchant_name: "Claire Thompson",
    merchant_business: "Soho House New York",
    amount: 500,
    status: "under_review",
    severity: "high",
    reason: "Campaign brief changed after creator accepted",
    description:
      "When I accepted this campaign, the requirement was 1 Reel. After I completed the visit, the merchant updated the brief to require 3 posts + 5 stories. I only agreed to the original terms.",
    opened_at: "2026-04-11T16:00:00Z",
    updated_at: "2026-04-14T12:00:00Z",
    sla_deadline: "2026-04-14T16:00:00Z",
    thread_locked: false,
    escalated_to_legal: false,
    timeline: [
      {
        id: "evt_007_1",
        dispute_id: "dsp_007",
        type: "opened",
        actor: "creator",
        actor_name: "Emma Davis",
        content:
          "Campaign requirements were changed unilaterally after I accepted. Original: 1 Reel. New: 3 posts + 5 stories. I fulfilled the original agreement.",
        timestamp: "2026-04-11T16:00:00Z",
      },
      {
        id: "evt_007_2",
        dispute_id: "dsp_007",
        type: "message_merchant",
        actor: "merchant",
        actor_name: "Claire Thompson",
        content:
          "We updated the brief to better align with our brand campaign. We communicated this via email before the visit.",
        timestamp: "2026-04-12T10:00:00Z",
      },
      {
        id: "evt_007_3",
        dispute_id: "dsp_007",
        type: "evidence_requested",
        actor: "admin",
        actor_name: "Admin",
        content:
          "Merchant, please provide: (1) the email showing brief update, (2) timestamp of when it was sent. Creator, please confirm receipt of that email.",
        timestamp: "2026-04-14T12:00:00Z",
      },
    ],
    admin_notes: [],
  },

  // ── 8. No-show creator ───────────────────────────────────────────────────
  {
    id: "dsp_008",
    campaign_id: "cmp_levain",
    campaign_title: "Levain Bakery West Village Debut",
    campaign_category: "food_beverage",
    creator_id: "cre_008",
    creator_name: "Zoe Kim",
    creator_handle: "@zoekim.bites",
    creator_tier: "seed",
    creator_avatar: "https://i.pravatar.cc/150?img=16",
    merchant_id: "mrc_008",
    merchant_name: "Pam Weekes",
    merchant_business: "Levain Bakery — West Village",
    amount: 75,
    status: "open",
    severity: "low",
    reason: "Merchant alleges creator never visited — QR not scanned",
    description:
      "Merchant is disputing a $75 credit claim. Our records show no QR scan for this creator during the campaign period. Creator claims they scanned but the app crashed.",
    opened_at: "2026-04-16T07:00:00Z",
    updated_at: "2026-04-16T07:00:00Z",
    sla_deadline: "2026-04-19T07:00:00Z",
    thread_locked: false,
    escalated_to_legal: false,
    timeline: [
      {
        id: "evt_008_1",
        dispute_id: "dsp_008",
        type: "opened",
        actor: "merchant",
        actor_name: "Pam Weekes",
        content:
          "Creator claims to have visited but we have no QR scan on record. We should not pay for unverified visits.",
        timestamp: "2026-04-16T07:00:00Z",
      },
    ],
    admin_notes: [],
  },

  // ── 9. Duplicate payout claim ────────────────────────────────────────────
  {
    id: "dsp_009",
    campaign_id: "cmp_nytimes_cooking",
    campaign_title: "NYT Cooking Pop-Up Experience",
    campaign_category: "media",
    creator_id: "cre_009",
    creator_name: "Marcus Rivera",
    creator_handle: "@marcus.eats",
    creator_tier: "operator",
    creator_avatar: "https://i.pravatar.cc/150?img=60",
    merchant_id: "mrc_009",
    merchant_name: "Emily Chen",
    merchant_business: "NYT Cooking Studio — Midtown",
    amount: 175,
    status: "under_review",
    severity: "medium",
    reason: "Creator submitted duplicate scan from same QR session",
    description:
      "System shows 2 payout claims submitted for the same QR scan event. Creator says it was a system glitch. One payment appears to have already been processed.",
    opened_at: "2026-04-13T12:00:00Z",
    updated_at: "2026-04-15T09:00:00Z",
    sla_deadline: "2026-04-16T12:00:00Z",
    thread_locked: false,
    escalated_to_legal: false,
    timeline: [
      {
        id: "evt_009_1",
        dispute_id: "dsp_009",
        type: "opened",
        actor: "system",
        actor_name: "Push System",
        content:
          "Duplicate payout claim detected: scan_id QR_8841 claimed twice by creator cre_009. Holding second payment pending review.",
        timestamp: "2026-04-13T12:00:00Z",
      },
      {
        id: "evt_009_2",
        dispute_id: "dsp_009",
        type: "message_creator",
        actor: "admin",
        actor_name: "Admin",
        content:
          "We noticed two payout claims for the same scan. Can you explain this?",
        timestamp: "2026-04-14T09:00:00Z",
      },
      {
        id: "evt_009_3",
        dispute_id: "dsp_009",
        type: "evidence_submitted",
        actor: "creator",
        actor_name: "Marcus Rivera",
        content:
          "The app froze during submission and I hit submit twice. I definitely only visited once. Please only pay once.",
        timestamp: "2026-04-14T14:00:00Z",
      },
    ],
    admin_notes: [],
  },

  // ── 10. Merchant closed before visit ────────────────────────────────────
  {
    id: "dsp_010",
    campaign_id: "cmp_vanessa_dumpling",
    campaign_title: "Vanessa's Dumpling House Special",
    campaign_category: "food_beverage",
    creator_id: "cre_010",
    creator_name: "Lily Chen",
    creator_handle: "@lilychenyum",
    creator_tier: "explorer",
    creator_avatar: "https://i.pravatar.cc/150?img=21",
    merchant_id: "mrc_010",
    merchant_name: "Vanessa Wong",
    merchant_business: "Vanessa's Dumpling House — Chinatown",
    amount: 90,
    status: "open",
    severity: "medium",
    reason: "Creator arrived but location was temporarily closed",
    description:
      "I traveled to the location during campaign hours but the restaurant was closed for a private event. Campaign was still showing as active. I should be compensated for travel and time.",
    opened_at: "2026-04-16T11:00:00Z",
    updated_at: "2026-04-16T11:00:00Z",
    sla_deadline: "2026-04-19T11:00:00Z",
    thread_locked: false,
    escalated_to_legal: false,
    timeline: [
      {
        id: "evt_010_1",
        dispute_id: "dsp_010",
        type: "opened",
        actor: "creator",
        actor_name: "Lily Chen",
        content:
          "Arrived at location during stated hours but store was closed for private event. Campaign was still showing active. Requesting partial compensation.",
        timestamp: "2026-04-16T11:00:00Z",
      },
    ],
    admin_notes: [],
  },

  // ── 11. Brand safety violation ───────────────────────────────────────────
  {
    id: "dsp_011",
    campaign_id: "cmp_lol_cocktails",
    campaign_title: "LOL Cocktail Bar Creator Night",
    campaign_category: "nightlife",
    creator_id: "cre_011",
    creator_name: "Brandon Hayes",
    creator_handle: "@brandonhayesnyc",
    creator_tier: "proven",
    creator_avatar: "https://i.pravatar.cc/150?img=37",
    merchant_id: "mrc_011",
    merchant_name: "Lisa Morgan",
    merchant_business: "LOL Cocktail Bar — Meatpacking",
    amount: 220,
    status: "under_review",
    severity: "high",
    reason: "Merchant claims creator's post included competitor mention",
    description:
      "Merchant refusing payment because my post tagged another bar in the same caption. I mentioned it as a comparison, not endorsement. Campaign brief did not restrict competitor mentions.",
    opened_at: "2026-04-09T19:00:00Z",
    updated_at: "2026-04-14T10:00:00Z",
    sla_deadline: "2026-04-12T19:00:00Z",
    thread_locked: false,
    escalated_to_legal: false,
    timeline: [
      {
        id: "evt_011_1",
        dispute_id: "dsp_011",
        type: "opened",
        actor: "creator",
        actor_name: "Brandon Hayes",
        content:
          "Merchant refusing payment because I mentioned a competitor bar as a comparison. Brief had no exclusivity clause.",
        timestamp: "2026-04-09T19:00:00Z",
      },
      {
        id: "evt_011_2",
        dispute_id: "dsp_011",
        type: "message_merchant",
        actor: "merchant",
        actor_name: "Lisa Morgan",
        content:
          "Our standard brand safety guidelines prohibit competitor mentions. This is industry standard and the creator should have known.",
        timestamp: "2026-04-10T10:00:00Z",
      },
    ],
    admin_notes: [
      {
        id: "anote_011_1",
        dispute_id: "dsp_011",
        author: "Admin",
        content:
          "Brief reviewed: no explicit exclusivity clause. Platform default terms don't include competitor restriction unless stated. Likely creator's favor but considering 50/50 split as compromise.",
        timestamp: "2026-04-14T10:00:00Z",
      },
    ],
  },

  // ── 12. Receipt dispute ──────────────────────────────────────────────────
  {
    id: "dsp_012",
    campaign_id: "cmp_zabar",
    campaign_title: "Zabar's UWS Sunday Experience",
    campaign_category: "food_beverage",
    creator_id: "cre_012",
    creator_name: "Rachel Green",
    creator_handle: "@racheleatsuptown",
    creator_tier: "operator",
    creator_avatar: "https://i.pravatar.cc/150?img=29",
    merchant_id: "mrc_012",
    merchant_name: "Stanley Zabar",
    merchant_business: "Zabar's — Upper West Side",
    amount: 110,
    status: "awaiting_evidence",
    severity: "low",
    reason:
      "Campaign required $20 minimum purchase — creator cannot provide receipt",
    description:
      "I made the required purchase but paid cash and don't have a receipt. The campaign brief required a $20 minimum purchase. I have photos of my food but no receipt.",
    opened_at: "2026-04-15T13:00:00Z",
    updated_at: "2026-04-16T08:00:00Z",
    sla_deadline: "2026-04-18T13:00:00Z",
    thread_locked: false,
    escalated_to_legal: false,
    timeline: [
      {
        id: "evt_012_1",
        dispute_id: "dsp_012",
        type: "opened",
        actor: "creator",
        actor_name: "Rachel Green",
        content:
          "Paid cash — no digital receipt. Have food photos. Merchant requiring digital receipt which I cannot provide.",
        timestamp: "2026-04-15T13:00:00Z",
      },
      {
        id: "evt_012_2",
        dispute_id: "dsp_012",
        type: "evidence_requested",
        actor: "admin",
        actor_name: "Admin",
        content:
          "Please provide: (1) photos of food showing Zabar's branding/packaging, (2) any card statement showing charge (redact other transactions), (3) QR scan timestamp.",
        timestamp: "2026-04-16T08:00:00Z",
      },
    ],
    admin_notes: [],
  },

  // ── 13. Account impersonation ────────────────────────────────────────────
  {
    id: "dsp_013",
    campaign_id: "cmp_magnolia",
    campaign_title: "Magnolia Bakery Bleecker St Push",
    campaign_category: "food_beverage",
    creator_id: "cre_013",
    creator_name: "Sophie Turner",
    creator_handle: "@sophiebakesnyc",
    creator_tier: "seed",
    creator_avatar: "https://i.pravatar.cc/150?img=9",
    merchant_id: "mrc_013",
    merchant_name: "Bobbie Lloyd",
    merchant_business: "Magnolia Bakery — West Village",
    amount: 65,
    status: "under_review",
    severity: "critical",
    reason:
      "Merchant claims different person submitted post under creator's account",
    description:
      "Merchant says the person who came in and scanned didn't match the creator's Instagram profile photo. Possible account sharing or impersonation.",
    opened_at: "2026-04-14T09:00:00Z",
    updated_at: "2026-04-15T14:00:00Z",
    sla_deadline: "2026-04-17T09:00:00Z",
    thread_locked: true,
    escalated_to_legal: false,
    timeline: [
      {
        id: "evt_013_1",
        dispute_id: "dsp_013",
        type: "opened",
        actor: "merchant",
        actor_name: "Bobbie Lloyd",
        content:
          "The person who came in did not match the creator's Instagram profile photo. I believe someone else used this creator's QR code.",
        timestamp: "2026-04-14T09:00:00Z",
      },
      {
        id: "evt_013_2",
        dispute_id: "dsp_013",
        type: "thread_locked",
        actor: "admin",
        actor_name: "Admin",
        content: "Thread locked during identity verification process.",
        timestamp: "2026-04-15T14:00:00Z",
      },
    ],
    admin_notes: [
      {
        id: "anote_013_1",
        dispute_id: "dsp_013",
        author: "Admin",
        content:
          "Requested ID verification from creator via email. Merchant provided surveillance photo. Comparing now.",
        timestamp: "2026-04-15T14:30:00Z",
      },
    ],
  },

  // ── 14. SLA breach by platform ───────────────────────────────────────────
  {
    id: "dsp_014",
    campaign_id: "cmp_highland",
    campaign_title: "The Highland Bar Rooftop Series",
    campaign_category: "nightlife",
    creator_id: "cre_014",
    creator_name: "Jake Morrison",
    creator_handle: "@jakenyc_nights",
    creator_tier: "closer",
    creator_avatar: "https://i.pravatar.cc/150?img=50",
    merchant_id: "mrc_014",
    merchant_name: "Mike Langan",
    merchant_business: "The Highland — Hell's Kitchen",
    amount: 280,
    status: "escalated",
    severity: "high",
    reason:
      "Platform failed to process payment within stated SLA — creator demands penalty",
    description:
      "My campaign was verified 3 weeks ago. Platform SLA states 5 business days for payment. Now 15 business days overdue. Requesting $50 late penalty per platform terms.",
    opened_at: "2026-04-08T12:00:00Z",
    updated_at: "2026-04-14T16:00:00Z",
    sla_deadline: "2026-04-11T12:00:00Z",
    thread_locked: false,
    escalated_to_legal: false,
    timeline: [
      {
        id: "evt_014_1",
        dispute_id: "dsp_014",
        type: "opened",
        actor: "creator",
        actor_name: "Jake Morrison",
        content:
          "Payment 15 business days overdue. Platform SLA breached. Requesting $50 late penalty per terms §6.3.",
        timestamp: "2026-04-08T12:00:00Z",
      },
      {
        id: "evt_014_2",
        dispute_id: "dsp_014",
        type: "escalated",
        actor: "admin",
        actor_name: "Admin",
        content:
          "Confirmed payment processing delay due to Stripe webhook failure on Apr 2nd. Escalating for priority resolution.",
        timestamp: "2026-04-14T16:00:00Z",
      },
    ],
    admin_notes: [
      {
        id: "anote_014_1",
        dispute_id: "dsp_014",
        author: "Admin",
        content:
          "Engineering confirmed Stripe webhook missed this batch. Payment + $50 penalty should be approved. Need finance sign-off.",
        timestamp: "2026-04-14T16:30:00Z",
      },
    ],
  },

  // ── 15. Misrepresented follower count ────────────────────────────────────
  {
    id: "dsp_015",
    campaign_id: "cmp_rowes",
    campaign_title: "Rowe's Seafood Tribeca Promo",
    campaign_category: "food_beverage",
    creator_id: "cre_015",
    creator_name: "Nina Patel",
    creator_handle: "@ninapatel_nyc",
    creator_tier: "explorer",
    creator_avatar: "https://i.pravatar.cc/150?img=41",
    merchant_id: "mrc_015",
    merchant_name: "Chris Rowe",
    merchant_business: "Rowe's Seafood — Tribeca",
    amount: 95,
    status: "under_review",
    severity: "medium",
    reason: "Merchant claims creator's follower count was inflated",
    description:
      "Merchant says I advertised 8,500 followers but the campaign post only reached 200 people. They believe my followers are fake. My profile is real — low reach was due to algorithm changes.",
    opened_at: "2026-04-11T10:00:00Z",
    updated_at: "2026-04-13T11:00:00Z",
    sla_deadline: "2026-04-14T10:00:00Z",
    thread_locked: false,
    escalated_to_legal: false,
    timeline: [
      {
        id: "evt_015_1",
        dispute_id: "dsp_015",
        type: "opened",
        actor: "merchant",
        actor_name: "Chris Rowe",
        content:
          "Creator profile shows 8,500 followers but post only had 200 impressions. Follower count appears inflated. Not paying.",
        timestamp: "2026-04-11T10:00:00Z",
      },
      {
        id: "evt_015_2",
        dispute_id: "dsp_015",
        type: "evidence_submitted",
        actor: "creator",
        actor_name: "Nina Patel",
        content:
          "Attaching Instagram Insights showing real follower demographics and reach data. Algorithm changes caused the low reach, not fake followers.",
        attachment_url: "https://placehold.co/600x400?text=Instagram+Insights",
        timestamp: "2026-04-12T09:00:00Z",
      },
    ],
    admin_notes: [],
  },

  // ── RESOLVED ─────────────────────────────────────────────────────────────

  // ── 16. Resolved: creator favor ─────────────────────────────────────────
  {
    id: "dsp_016",
    campaign_id: "cmp_juliana_pizza",
    campaign_title: "Juliana's Pizza DUMBO Creator Run",
    campaign_category: "food_beverage",
    creator_id: "cre_016",
    creator_name: "Tara Wu",
    creator_handle: "@tarawueats",
    creator_tier: "proven",
    creator_avatar: "https://i.pravatar.cc/150?img=19",
    merchant_id: "mrc_016",
    merchant_name: "Patsy Grimaldi",
    merchant_business: "Juliana's Pizza — DUMBO",
    amount: 130,
    status: "resolved",
    severity: "low",
    reason: "Merchant disputed QR scan timing — visit outside campaign window",
    description:
      "Merchant claimed creator arrived 15 minutes after campaign end time. Creator provided timestamped entry photo proving visit was within window.",
    opened_at: "2026-04-01T10:00:00Z",
    updated_at: "2026-04-03T15:00:00Z",
    resolved_at: "2026-04-03T15:00:00Z",
    sla_deadline: "2026-04-04T10:00:00Z",
    outcome: "refund_creator",
    outcome_reasoning:
      "Creator's timestamped entry photo and QR scan logs both confirm visit at 6:47 PM — campaign window closed at 7:00 PM. Merchant claim is incorrect. Full payout approved.",
    thread_locked: false,
    escalated_to_legal: false,
    timeline: [
      {
        id: "evt_016_1",
        dispute_id: "dsp_016",
        type: "opened",
        actor: "merchant",
        actor_name: "Patsy Grimaldi",
        content:
          "Creator arrived after 7pm. Campaign ended at 7pm. Visit is not eligible.",
        timestamp: "2026-04-01T10:00:00Z",
      },
      {
        id: "evt_016_2",
        dispute_id: "dsp_016",
        type: "evidence_submitted",
        actor: "creator",
        actor_name: "Tara Wu",
        content:
          "Here's my entry photo — timestamp shows 6:47 PM. QR scan also recorded at 6:48 PM.",
        attachment_url: "https://placehold.co/600x400?text=Entry+Photo+6:47PM",
        timestamp: "2026-04-01T14:00:00Z",
      },
      {
        id: "evt_016_3",
        dispute_id: "dsp_016",
        type: "decision_made",
        actor: "admin",
        actor_name: "Admin",
        content:
          "Decision: Full payout to creator. Entry photo timestamp and QR scan logs confirm visit at 6:47 PM, within campaign window.",
        timestamp: "2026-04-03T15:00:00Z",
      },
      {
        id: "evt_016_4",
        dispute_id: "dsp_016",
        type: "resolved",
        actor: "system",
        actor_name: "Push System",
        content: "Dispute resolved. Creator payout of $130 processed.",
        timestamp: "2026-04-03T15:01:00Z",
      },
    ],
    admin_notes: [],
  },

  // ── 17. Resolved: merchant favor ────────────────────────────────────────
  {
    id: "dsp_017",
    campaign_id: "cmp_cafe_grumpy",
    campaign_title: "Cafe Grumpy Chelsea Content Day",
    campaign_category: "food_beverage",
    creator_id: "cre_017",
    creator_name: "Owen Park",
    creator_handle: "@owenparknyc",
    creator_tier: "seed",
    creator_avatar: "https://i.pravatar.cc/150?img=57",
    merchant_id: "mrc_017",
    merchant_name: "Caroline Bell",
    merchant_business: "Cafe Grumpy — Chelsea",
    amount: 55,
    status: "resolved",
    severity: "low",
    reason:
      "Creator submitted AI-generated content that violated campaign terms",
    description:
      "Merchant discovered creator's post was partially AI-generated, violating the authenticity requirement in the brief.",
    opened_at: "2026-03-28T11:00:00Z",
    updated_at: "2026-03-30T14:00:00Z",
    resolved_at: "2026-03-30T14:00:00Z",
    sla_deadline: "2026-03-31T11:00:00Z",
    outcome: "refund_merchant",
    outcome_reasoning:
      "Metadata analysis confirms image was AI-generated using Midjourney. Campaign brief §2.1 explicitly prohibits AI-generated content. No payout. Creator account flagged.",
    thread_locked: false,
    escalated_to_legal: false,
    timeline: [
      {
        id: "evt_017_1",
        dispute_id: "dsp_017",
        type: "opened",
        actor: "merchant",
        actor_name: "Caroline Bell",
        content:
          "The photo submitted has AI artifacts — look at the cup handle and the background blur pattern. This was not taken in our cafe.",
        timestamp: "2026-03-28T11:00:00Z",
      },
      {
        id: "evt_017_2",
        dispute_id: "dsp_017",
        type: "decision_made",
        actor: "admin",
        actor_name: "Admin",
        content:
          "Metadata analysis confirms AI generation. Merchant refund approved. Creator payout denied.",
        timestamp: "2026-03-30T14:00:00Z",
      },
      {
        id: "evt_017_3",
        dispute_id: "dsp_017",
        type: "resolved",
        actor: "system",
        actor_name: "Push System",
        content:
          "Dispute resolved. Merchant received $55 credit. Creator account flagged for review.",
        timestamp: "2026-03-30T14:01:00Z",
      },
    ],
    admin_notes: [],
  },

  // ── 18. Resolved: split ──────────────────────────────────────────────────
  {
    id: "dsp_018",
    campaign_id: "cmp_el_colmado",
    campaign_title: "El Colmado Spanish Tapas Night",
    campaign_category: "food_beverage",
    creator_id: "cre_018",
    creator_name: "Isabella Gomez",
    creator_handle: "@isabellagonzales",
    creator_tier: "operator",
    creator_avatar: "https://i.pravatar.cc/150?img=31",
    merchant_id: "mrc_018",
    merchant_name: "Seamus Mullen",
    merchant_business: "El Colmado — Hell's Kitchen",
    amount: 160,
    status: "resolved",
    severity: "medium",
    reason: "Partial content completion — creator posted 2 of 3 required posts",
    description:
      "Creator fulfilled 2 of 3 required posts due to a family emergency. Both parties willing to accept proportional payment.",
    opened_at: "2026-04-05T09:00:00Z",
    updated_at: "2026-04-07T16:00:00Z",
    resolved_at: "2026-04-07T16:00:00Z",
    sla_deadline: "2026-04-08T09:00:00Z",
    outcome: "split",
    outcome_split_pct: 67,
    outcome_reasoning:
      "Creator completed 2 of 3 required posts (67%) due to documented family emergency. Both parties agreed to 67% payout ($107.20). Fair resolution.",
    thread_locked: false,
    escalated_to_legal: false,
    timeline: [
      {
        id: "evt_018_1",
        dispute_id: "dsp_018",
        type: "opened",
        actor: "creator",
        actor_name: "Isabella Gomez",
        content:
          "Family emergency prevented me from completing the third post. I completed 2 of 3. Requesting proportional payment.",
        timestamp: "2026-04-05T09:00:00Z",
      },
      {
        id: "evt_018_2",
        dispute_id: "dsp_018",
        type: "decision_made",
        actor: "admin",
        actor_name: "Admin",
        content:
          "Split 67/33 agreed. Creator receives $107.20 (2/3 of $160). Merchant agrees to this resolution.",
        timestamp: "2026-04-07T16:00:00Z",
      },
      {
        id: "evt_018_3",
        dispute_id: "dsp_018",
        type: "resolved",
        actor: "system",
        actor_name: "Push System",
        content:
          "Dispute resolved. Creator payout: $107.20. Merchant credited: $52.80.",
        timestamp: "2026-04-07T16:01:00Z",
      },
    ],
    admin_notes: [],
  },

  // ── 19. Resolved: dismissed ──────────────────────────────────────────────
  {
    id: "dsp_019",
    campaign_id: "cmp_fishes_eddy",
    campaign_title: "Fish's Eddy Home Goods Feature",
    campaign_category: "retail",
    creator_id: "cre_019",
    creator_name: "Tyler Brooks",
    creator_handle: "@tylerbrooksnyc",
    creator_tier: "explorer",
    creator_avatar: "https://i.pravatar.cc/150?img=3",
    merchant_id: "mrc_019",
    merchant_name: "Julie Gaines",
    merchant_business: "Fish's Eddy — Chelsea",
    amount: 80,
    status: "dismissed",
    severity: "low",
    reason:
      "Merchant dispute filed after 7-day window — not eligible for review",
    description:
      "Merchant filed a dispute 11 days after campaign completion. Platform policy only accepts disputes within 7 days of verification.",
    opened_at: "2026-03-20T10:00:00Z",
    updated_at: "2026-03-20T16:00:00Z",
    resolved_at: "2026-03-20T16:00:00Z",
    sla_deadline: "2026-03-23T10:00:00Z",
    outcome: "dismiss",
    outcome_reasoning:
      "Dispute filed 11 days after campaign verification. Platform policy §7.1 requires disputes within 7 days. No further action. Creator payout confirmed.",
    thread_locked: false,
    escalated_to_legal: false,
    timeline: [
      {
        id: "evt_019_1",
        dispute_id: "dsp_019",
        type: "opened",
        actor: "merchant",
        actor_name: "Julie Gaines",
        content:
          "I want to dispute the payout — the content wasn't what we expected.",
        timestamp: "2026-03-20T10:00:00Z",
      },
      {
        id: "evt_019_2",
        dispute_id: "dsp_019",
        type: "dismissed",
        actor: "admin",
        actor_name: "Admin",
        content:
          "Dispute filed 11 days after verification. Outside 7-day window. Dismissed per §7.1.",
        timestamp: "2026-03-20T16:00:00Z",
      },
    ],
    admin_notes: [],
  },

  // ── 20. Resolved: dismissed (frivolous) ─────────────────────────────────
  {
    id: "dsp_020",
    campaign_id: "cmp_cafe_gitane",
    campaign_title: "Cafe Gitane Nolita Aesthetic Push",
    campaign_category: "lifestyle",
    creator_id: "cre_020",
    creator_name: "Mia Laurent",
    creator_handle: "@mialaurentnyc",
    creator_tier: "partner",
    creator_avatar: "https://i.pravatar.cc/150?img=26",
    merchant_id: "mrc_020",
    merchant_name: "Marc Bensimhon",
    merchant_business: "Cafe Gitane — Nolita",
    amount: 450,
    status: "dismissed",
    severity: "low",
    reason:
      "Creator dispute: merchant responded 2 hours late to DM — not grounds for dispute",
    description:
      "Creator filed dispute claiming slow merchant communication caused campaign delay. Not a compensable issue under platform terms.",
    opened_at: "2026-03-15T08:00:00Z",
    updated_at: "2026-03-15T12:00:00Z",
    resolved_at: "2026-03-15T12:00:00Z",
    sla_deadline: "2026-03-18T08:00:00Z",
    outcome: "dismiss",
    outcome_reasoning:
      "Communication delays by merchant do not constitute grounds for compensation under Platform Terms. Creator proceeded with campaign successfully. Dismissed.",
    thread_locked: false,
    escalated_to_legal: false,
    timeline: [
      {
        id: "evt_020_1",
        dispute_id: "dsp_020",
        type: "opened",
        actor: "creator",
        actor_name: "Mia Laurent",
        content:
          "Merchant took 2 hours to respond to my DM. I had to wait. This caused delay and stress.",
        timestamp: "2026-03-15T08:00:00Z",
      },
      {
        id: "evt_020_2",
        dispute_id: "dsp_020",
        type: "dismissed",
        actor: "admin",
        actor_name: "Admin",
        content:
          "Communication delay is not grounds for compensation. Campaign completed successfully. Dispute dismissed.",
        timestamp: "2026-03-15T12:00:00Z",
      },
    ],
    admin_notes: [],
  },
  // ── 21. Resolved: split (photography rights) ─────────────────────────────
  {
    id: "dsp_021",
    campaign_id: "cmp_poster_house",
    campaign_title: "Poster House Museum Experience",
    campaign_category: "arts",
    creator_id: "cre_021",
    creator_name: "Leo Nakamura",
    creator_handle: "@leonakamurafilm",
    creator_tier: "proven",
    creator_avatar: "https://i.pravatar.cc/150?img=67",
    merchant_id: "mrc_021",
    merchant_name: "Sara Demetriou",
    merchant_business: "Poster House Museum — Chelsea",
    amount: 200,
    status: "resolved",
    severity: "medium",
    reason: "Museum used creator's photos in paid ads without consent",
    description:
      "Merchant reposted my campaign content to paid Instagram ads without licensing agreement. I only granted organic repost rights.",
    opened_at: "2026-04-02T14:00:00Z",
    updated_at: "2026-04-06T10:00:00Z",
    resolved_at: "2026-04-06T10:00:00Z",
    sla_deadline: "2026-04-05T14:00:00Z",
    outcome: "split",
    outcome_split_pct: 60,
    outcome_reasoning:
      "Merchant used creator content in paid ads (licensing violation). Creator receives standard $200 + $80 licensing fee (60% of estimated ad spend). Merchant agreed to cease unauthorized use.",
    thread_locked: false,
    escalated_to_legal: false,
    timeline: [
      {
        id: "evt_021_1",
        dispute_id: "dsp_021",
        type: "opened",
        actor: "creator",
        actor_name: "Leo Nakamura",
        content:
          "My photos are being used in paid ads without any licensing agreement. I only consented to organic reposting.",
        timestamp: "2026-04-02T14:00:00Z",
      },
      {
        id: "evt_021_2",
        dispute_id: "dsp_021",
        type: "decision_made",
        actor: "admin",
        actor_name: "Admin",
        content:
          "Licensing violation confirmed. Creator receives $280 total ($200 campaign + $80 licensing). Merchant warned.",
        timestamp: "2026-04-06T10:00:00Z",
      },
      {
        id: "evt_021_3",
        dispute_id: "dsp_021",
        type: "resolved",
        actor: "system",
        actor_name: "Push System",
        content:
          "Dispute resolved. Creator payout: $280. Merchant licensing violation documented.",
        timestamp: "2026-04-06T10:01:00Z",
      },
    ],
    admin_notes: [],
  },
];

// ---------------------------------------------------------------------------
// Computed stats
// ---------------------------------------------------------------------------
export function getDisputeStats() {
  const open = MOCK_DISPUTES.filter((d) =>
    ["open", "under_review", "awaiting_evidence", "escalated"].includes(
      d.status,
    ),
  );
  const resolved = MOCK_DISPUTES.filter((d) =>
    ["resolved", "dismissed"].includes(d.status),
  );

  const totalResolutionMs = resolved
    .filter((d) => d.resolved_at)
    .map(
      (d) =>
        new Date(d.resolved_at!).getTime() - new Date(d.opened_at).getTime(),
    )
    .reduce((a, b) => a + b, 0);

  const avgResolutionHours =
    resolved.length > 0
      ? Math.round(totalResolutionMs / resolved.length / 3_600_000)
      : 0;

  const critical = MOCK_DISPUTES.filter(
    (d) =>
      d.severity === "critical" &&
      d.status !== "resolved" &&
      d.status !== "dismissed",
  ).length;

  const slaBreach = open.filter(
    (d) => new Date(d.sla_deadline) < new Date(),
  ).length;

  return {
    openCount: open.length,
    resolvedCount: resolved.length,
    totalCount: MOCK_DISPUTES.length,
    avgResolutionHours,
    criticalCount: critical,
    slaBreachCount: slaBreach,
  };
}
