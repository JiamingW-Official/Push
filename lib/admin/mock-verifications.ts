// Push Admin — Mock KYC Verification Data
// 30+ realistic applicants for admin review queue demo

export type VerificationStage = "identity" | "social" | "address";

export type RiskFlag =
  | "duplicate_id"
  | "location_mismatch"
  | "low_engagement"
  | "vpn_detected"
  | "incomplete_profile"
  | "suspicious_followers";

export type VerificationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "more_info";

export type ChecklistItem = {
  stage: VerificationStage;
  status: "complete" | "pending" | "failed" | "not_submitted";
};

export type SocialAccount = {
  platform: "instagram" | "tiktok" | "red";
  handle: string;
  followers: number;
  verified: boolean;
  engagement_rate?: number;
};

export type DecisionEntry = {
  id: string;
  reviewer: string;
  action: VerificationStatus;
  note: string;
  timestamp: string;
};

export type KYCVerification = {
  id: string;
  // Masked applicant info
  applicant_display: string; // "J. W." format
  applicant_initials: string;
  avatar_color: string; // brand color for avatar background
  submitted_at: string; // ISO string
  stage_filter: VerificationStage; // primary stage blocking completion
  // Checklist
  checklist: ChecklistItem[];
  // Risk
  risk_flags: RiskFlag[];
  risk_level: "low" | "medium" | "high";
  // Social accounts
  social_accounts: SocialAccount[];
  // Address
  address_city: string;
  address_state: string;
  address_verified: boolean;
  // Status
  status: VerificationStatus;
  // Decision history
  decision_history: DecisionEntry[];
  // Internal note (admin-added)
  internal_note?: string;
  // SLA: hours since submission
  hours_open: number;
};

// Helper: generate a submission timestamp relative to now
function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600 * 1000).toISOString();
}

export const MOCK_VERIFICATIONS: KYCVerification[] = [
  {
    id: "kyc-001",
    applicant_display: "J. W.",
    applicant_initials: "JW",
    avatar_color: "#003049",
    submitted_at: hoursAgo(2),
    stage_filter: "identity",
    checklist: [
      { stage: "identity", status: "pending" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "complete" },
    ],
    risk_flags: [],
    risk_level: "low",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@jadewave",
        followers: 8400,
        verified: true,
        engagement_rate: 4.2,
      },
      {
        platform: "tiktok",
        handle: "@jade.wave",
        followers: 12300,
        verified: true,
        engagement_rate: 6.8,
      },
    ],
    address_city: "Brooklyn",
    address_state: "NY",
    address_verified: true,
    status: "pending",
    decision_history: [],
    hours_open: 2,
  },
  {
    id: "kyc-002",
    applicant_display: "M. C.",
    applicant_initials: "MC",
    avatar_color: "#780000",
    submitted_at: hoursAgo(5),
    stage_filter: "social",
    checklist: [
      { stage: "identity", status: "complete" },
      { stage: "social", status: "pending" },
      { stage: "address", status: "pending" },
    ],
    risk_flags: ["low_engagement"],
    risk_level: "medium",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@markcollins.nyc",
        followers: 2100,
        verified: false,
        engagement_rate: 0.8,
      },
    ],
    address_city: "Manhattan",
    address_state: "NY",
    address_verified: false,
    status: "pending",
    decision_history: [],
    hours_open: 5,
  },
  {
    id: "kyc-003",
    applicant_display: "A. R.",
    applicant_initials: "AR",
    avatar_color: "#669bbc",
    submitted_at: hoursAgo(28),
    stage_filter: "identity",
    checklist: [
      { stage: "identity", status: "failed" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "complete" },
    ],
    risk_flags: ["duplicate_id"],
    risk_level: "high",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@ara.creates",
        followers: 15600,
        verified: true,
        engagement_rate: 5.1,
      },
      {
        platform: "tiktok",
        handle: "@ara.creates",
        followers: 44200,
        verified: true,
        engagement_rate: 9.3,
      },
    ],
    address_city: "Queens",
    address_state: "NY",
    address_verified: true,
    status: "more_info",
    decision_history: [
      {
        id: "dec-001",
        reviewer: "admin@push.co",
        action: "more_info",
        note: "ID document appears to be a duplicate — matches existing creator kyc-089. Requested re-submission.",
        timestamp: hoursAgo(20),
      },
    ],
    hours_open: 28,
  },
  {
    id: "kyc-004",
    applicant_display: "S. L.",
    applicant_initials: "SL",
    avatar_color: "#c9a96e",
    submitted_at: hoursAgo(1),
    stage_filter: "address",
    checklist: [
      { stage: "identity", status: "complete" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "pending" },
    ],
    risk_flags: [],
    risk_level: "low",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@sofialuna_nyc",
        followers: 31200,
        verified: true,
        engagement_rate: 3.7,
      },
      {
        platform: "red",
        handle: "@sofialuna",
        followers: 8900,
        verified: true,
      },
    ],
    address_city: "Astoria",
    address_state: "NY",
    address_verified: false,
    status: "pending",
    decision_history: [],
    hours_open: 1,
  },
  {
    id: "kyc-005",
    applicant_display: "D. P.",
    applicant_initials: "DP",
    avatar_color: "#003049",
    submitted_at: hoursAgo(48),
    stage_filter: "identity",
    checklist: [
      { stage: "identity", status: "pending" },
      { stage: "social", status: "pending" },
      { stage: "address", status: "not_submitted" },
    ],
    risk_flags: ["vpn_detected", "location_mismatch"],
    risk_level: "high",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@diegopics",
        followers: 900,
        verified: false,
        engagement_rate: 1.1,
      },
    ],
    address_city: "Bronx",
    address_state: "NY",
    address_verified: false,
    status: "pending",
    decision_history: [],
    hours_open: 48,
  },
  {
    id: "kyc-006",
    applicant_display: "L. K.",
    applicant_initials: "LK",
    avatar_color: "#780000",
    submitted_at: hoursAgo(3),
    stage_filter: "social",
    checklist: [
      { stage: "identity", status: "complete" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "complete" },
    ],
    risk_flags: [],
    risk_level: "low",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@lena.kim.nyc",
        followers: 67800,
        verified: true,
        engagement_rate: 4.9,
      },
      {
        platform: "tiktok",
        handle: "@lena.kim",
        followers: 120400,
        verified: true,
        engagement_rate: 8.2,
      },
    ],
    address_city: "Brooklyn",
    address_state: "NY",
    address_verified: true,
    status: "pending",
    decision_history: [],
    hours_open: 3,
  },
  {
    id: "kyc-007",
    applicant_display: "T. N.",
    applicant_initials: "TN",
    avatar_color: "#669bbc",
    submitted_at: hoursAgo(36),
    stage_filter: "identity",
    checklist: [
      { stage: "identity", status: "complete" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "complete" },
    ],
    risk_flags: [],
    risk_level: "low",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@trey.nyc",
        followers: 4200,
        verified: true,
        engagement_rate: 6.1,
      },
    ],
    address_city: "Harlem",
    address_state: "NY",
    address_verified: true,
    status: "approved",
    decision_history: [
      {
        id: "dec-002",
        reviewer: "admin@push.co",
        action: "approved",
        note: "All documents clear. Strong local following. Approved.",
        timestamp: hoursAgo(12),
      },
    ],
    hours_open: 36,
  },
  {
    id: "kyc-008",
    applicant_display: "R. V.",
    applicant_initials: "RV",
    avatar_color: "#c9a96e",
    submitted_at: hoursAgo(10),
    stage_filter: "address",
    checklist: [
      { stage: "identity", status: "complete" },
      { stage: "social", status: "pending" },
      { stage: "address", status: "failed" },
    ],
    risk_flags: ["location_mismatch"],
    risk_level: "medium",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@roxyvega",
        followers: 5600,
        verified: true,
        engagement_rate: 3.3,
      },
      {
        platform: "tiktok",
        handle: "@roxyvega.nyc",
        followers: 9800,
        verified: false,
        engagement_rate: 4.1,
      },
    ],
    address_city: "Staten Island",
    address_state: "NY",
    address_verified: false,
    status: "more_info",
    decision_history: [
      {
        id: "dec-003",
        reviewer: "admin@push.co",
        action: "more_info",
        note: "Address on utility bill does not match ID. Requested current proof of residence.",
        timestamp: hoursAgo(6),
      },
    ],
    hours_open: 10,
  },
  {
    id: "kyc-009",
    applicant_display: "P. H.",
    applicant_initials: "PH",
    avatar_color: "#003049",
    submitted_at: hoursAgo(72),
    stage_filter: "identity",
    checklist: [
      { stage: "identity", status: "pending" },
      { stage: "social", status: "not_submitted" },
      { stage: "address", status: "not_submitted" },
    ],
    risk_flags: ["incomplete_profile"],
    risk_level: "medium",
    social_accounts: [],
    address_city: "Jersey City",
    address_state: "NJ",
    address_verified: false,
    status: "pending",
    decision_history: [],
    hours_open: 72,
  },
  {
    id: "kyc-010",
    applicant_display: "N. O.",
    applicant_initials: "NO",
    avatar_color: "#780000",
    submitted_at: hoursAgo(8),
    stage_filter: "social",
    checklist: [
      { stage: "identity", status: "complete" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "complete" },
    ],
    risk_flags: [],
    risk_level: "low",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@nora.o.art",
        followers: 22100,
        verified: true,
        engagement_rate: 5.5,
      },
      { platform: "red", handle: "@nora.art", followers: 6700, verified: true },
    ],
    address_city: "Lower East Side",
    address_state: "NY",
    address_verified: true,
    status: "pending",
    decision_history: [],
    hours_open: 8,
  },
  {
    id: "kyc-011",
    applicant_display: "B. T.",
    applicant_initials: "BT",
    avatar_color: "#669bbc",
    submitted_at: hoursAgo(14),
    stage_filter: "identity",
    checklist: [
      { stage: "identity", status: "complete" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "pending" },
    ],
    risk_flags: [],
    risk_level: "low",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@ben.t.film",
        followers: 9300,
        verified: true,
        engagement_rate: 4.0,
      },
      {
        platform: "tiktok",
        handle: "@bentfilm",
        followers: 18700,
        verified: true,
        engagement_rate: 7.2,
      },
    ],
    address_city: "Williamsburg",
    address_state: "NY",
    address_verified: false,
    status: "pending",
    decision_history: [],
    hours_open: 14,
  },
  {
    id: "kyc-012",
    applicant_display: "C. M.",
    applicant_initials: "CM",
    avatar_color: "#c9a96e",
    submitted_at: hoursAgo(20),
    stage_filter: "social",
    checklist: [
      { stage: "identity", status: "failed" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "complete" },
    ],
    risk_flags: ["duplicate_id", "suspicious_followers"],
    risk_level: "high",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@camila.m",
        followers: 88000,
        verified: true,
        engagement_rate: 0.4,
      },
    ],
    address_city: "Flushing",
    address_state: "NY",
    address_verified: true,
    status: "rejected",
    decision_history: [
      {
        id: "dec-004",
        reviewer: "admin@push.co",
        action: "rejected",
        note: "Engagement rate of 0.4% on 88k followers is bot-pattern. ID also flagged as duplicate. Application rejected.",
        timestamp: hoursAgo(4),
      },
    ],
    hours_open: 20,
  },
  {
    id: "kyc-013",
    applicant_display: "F. A.",
    applicant_initials: "FA",
    avatar_color: "#003049",
    submitted_at: hoursAgo(4),
    stage_filter: "address",
    checklist: [
      { stage: "identity", status: "complete" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "complete" },
    ],
    risk_flags: [],
    risk_level: "low",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@fabio.atl",
        followers: 11200,
        verified: true,
        engagement_rate: 5.8,
      },
      {
        platform: "tiktok",
        handle: "@fabio.nyc",
        followers: 28400,
        verified: true,
        engagement_rate: 10.2,
      },
    ],
    address_city: "Crown Heights",
    address_state: "NY",
    address_verified: true,
    status: "pending",
    decision_history: [],
    hours_open: 4,
  },
  {
    id: "kyc-014",
    applicant_display: "I. S.",
    applicant_initials: "IS",
    avatar_color: "#780000",
    submitted_at: hoursAgo(55),
    stage_filter: "identity",
    checklist: [
      { stage: "identity", status: "pending" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "pending" },
    ],
    risk_flags: [],
    risk_level: "low",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@ines.style",
        followers: 42000,
        verified: true,
        engagement_rate: 3.9,
      },
    ],
    address_city: "Park Slope",
    address_state: "NY",
    address_verified: false,
    status: "pending",
    decision_history: [],
    hours_open: 55,
  },
  {
    id: "kyc-015",
    applicant_display: "K. B.",
    applicant_initials: "KB",
    avatar_color: "#669bbc",
    submitted_at: hoursAgo(6),
    stage_filter: "social",
    checklist: [
      { stage: "identity", status: "complete" },
      { stage: "social", status: "pending" },
      { stage: "address", status: "complete" },
    ],
    risk_flags: ["low_engagement"],
    risk_level: "medium",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@kay.beats",
        followers: 3400,
        verified: true,
        engagement_rate: 1.2,
      },
      {
        platform: "tiktok",
        handle: "@kaybeats",
        followers: 1800,
        verified: false,
        engagement_rate: 2.1,
      },
    ],
    address_city: "Bushwick",
    address_state: "NY",
    address_verified: true,
    status: "pending",
    decision_history: [],
    hours_open: 6,
  },
  {
    id: "kyc-016",
    applicant_display: "O. G.",
    applicant_initials: "OG",
    avatar_color: "#c9a96e",
    submitted_at: hoursAgo(16),
    stage_filter: "identity",
    checklist: [
      { stage: "identity", status: "complete" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "complete" },
    ],
    risk_flags: [],
    risk_level: "low",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@oscar.geo",
        followers: 19800,
        verified: true,
        engagement_rate: 4.4,
      },
      {
        platform: "red",
        handle: "@oscargeonyc",
        followers: 5500,
        verified: true,
      },
    ],
    address_city: "Astoria",
    address_state: "NY",
    address_verified: true,
    status: "pending",
    decision_history: [],
    hours_open: 16,
  },
  {
    id: "kyc-017",
    applicant_display: "V. M.",
    applicant_initials: "VM",
    avatar_color: "#003049",
    submitted_at: hoursAgo(40),
    stage_filter: "address",
    checklist: [
      { stage: "identity", status: "complete" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "failed" },
    ],
    risk_flags: ["location_mismatch"],
    risk_level: "medium",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@val.makes",
        followers: 7200,
        verified: true,
        engagement_rate: 5.2,
      },
    ],
    address_city: "Long Island City",
    address_state: "NY",
    address_verified: false,
    status: "more_info",
    decision_history: [
      {
        id: "dec-005",
        reviewer: "admin@push.co",
        action: "more_info",
        note: "GPS coordinates from photo metadata do not match submitted address. Please re-submit proof.",
        timestamp: hoursAgo(18),
      },
    ],
    hours_open: 40,
  },
  {
    id: "kyc-018",
    applicant_display: "E. T.",
    applicant_initials: "ET",
    avatar_color: "#780000",
    submitted_at: hoursAgo(9),
    stage_filter: "social",
    checklist: [
      { stage: "identity", status: "complete" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "complete" },
    ],
    risk_flags: [],
    risk_level: "low",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@emma.tastes",
        followers: 54000,
        verified: true,
        engagement_rate: 4.7,
      },
      {
        platform: "tiktok",
        handle: "@emmatastes",
        followers: 89000,
        verified: true,
        engagement_rate: 9.1,
      },
    ],
    address_city: "Chelsea",
    address_state: "NY",
    address_verified: true,
    status: "pending",
    decision_history: [],
    hours_open: 9,
  },
  {
    id: "kyc-019",
    applicant_display: "H. Z.",
    applicant_initials: "HZ",
    avatar_color: "#669bbc",
    submitted_at: hoursAgo(30),
    stage_filter: "identity",
    checklist: [
      { stage: "identity", status: "pending" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "complete" },
    ],
    risk_flags: ["vpn_detected"],
    risk_level: "medium",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@hz.photography",
        followers: 26500,
        verified: true,
        engagement_rate: 3.6,
      },
      {
        platform: "red",
        handle: "@hz.photo",
        followers: 12000,
        verified: true,
      },
    ],
    address_city: "Flushing",
    address_state: "NY",
    address_verified: true,
    status: "pending",
    decision_history: [],
    hours_open: 30,
  },
  {
    id: "kyc-020",
    applicant_display: "G. W.",
    applicant_initials: "GW",
    avatar_color: "#c9a96e",
    submitted_at: hoursAgo(12),
    stage_filter: "address",
    checklist: [
      { stage: "identity", status: "complete" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "complete" },
    ],
    risk_flags: [],
    risk_level: "low",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@grace.w.nyc",
        followers: 14800,
        verified: true,
        engagement_rate: 5.0,
      },
      {
        platform: "tiktok",
        handle: "@gracew",
        followers: 31200,
        verified: true,
        engagement_rate: 7.8,
      },
    ],
    address_city: "Upper West Side",
    address_state: "NY",
    address_verified: true,
    status: "pending",
    decision_history: [],
    hours_open: 12,
  },
  {
    id: "kyc-021",
    applicant_display: "X. L.",
    applicant_initials: "XL",
    avatar_color: "#003049",
    submitted_at: hoursAgo(96),
    stage_filter: "identity",
    checklist: [
      { stage: "identity", status: "not_submitted" },
      { stage: "social", status: "not_submitted" },
      { stage: "address", status: "not_submitted" },
    ],
    risk_flags: ["incomplete_profile"],
    risk_level: "medium",
    social_accounts: [],
    address_city: "Sunset Park",
    address_state: "NY",
    address_verified: false,
    status: "pending",
    decision_history: [],
    hours_open: 96,
  },
  {
    id: "kyc-022",
    applicant_display: "Y. F.",
    applicant_initials: "YF",
    avatar_color: "#780000",
    submitted_at: hoursAgo(7),
    stage_filter: "social",
    checklist: [
      { stage: "identity", status: "complete" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "complete" },
    ],
    risk_flags: [],
    risk_level: "low",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@yuki.food",
        followers: 38700,
        verified: true,
        engagement_rate: 6.2,
      },
      {
        platform: "tiktok",
        handle: "@yukifood",
        followers: 72000,
        verified: true,
        engagement_rate: 11.4,
      },
      {
        platform: "red",
        handle: "@yuki.food",
        followers: 9400,
        verified: true,
      },
    ],
    address_city: "Chinatown",
    address_state: "NY",
    address_verified: true,
    status: "pending",
    decision_history: [],
    hours_open: 7,
  },
  {
    id: "kyc-023",
    applicant_display: "P. D.",
    applicant_initials: "PD",
    avatar_color: "#669bbc",
    submitted_at: hoursAgo(25),
    stage_filter: "address",
    checklist: [
      { stage: "identity", status: "complete" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "pending" },
    ],
    risk_flags: [],
    risk_level: "low",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@pedro.d",
        followers: 5800,
        verified: true,
        engagement_rate: 4.8,
      },
    ],
    address_city: "Jackson Heights",
    address_state: "NY",
    address_verified: false,
    status: "pending",
    decision_history: [],
    hours_open: 25,
  },
  {
    id: "kyc-024",
    applicant_display: "Q. A.",
    applicant_initials: "QA",
    avatar_color: "#c9a96e",
    submitted_at: hoursAgo(11),
    stage_filter: "identity",
    checklist: [
      { stage: "identity", status: "complete" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "complete" },
    ],
    risk_flags: [],
    risk_level: "low",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@quinn.art",
        followers: 29000,
        verified: true,
        engagement_rate: 5.3,
      },
      {
        platform: "tiktok",
        handle: "@quinnart",
        followers: 41000,
        verified: true,
        engagement_rate: 8.9,
      },
    ],
    address_city: "Bedford-Stuyvesant",
    address_state: "NY",
    address_verified: true,
    status: "pending",
    decision_history: [],
    hours_open: 11,
  },
  {
    id: "kyc-025",
    applicant_display: "W. S.",
    applicant_initials: "WS",
    avatar_color: "#003049",
    submitted_at: hoursAgo(52),
    stage_filter: "social",
    checklist: [
      { stage: "identity", status: "complete" },
      { stage: "social", status: "failed" },
      { stage: "address", status: "complete" },
    ],
    risk_flags: ["suspicious_followers"],
    risk_level: "high",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@wendy.s",
        followers: 60000,
        verified: false,
        engagement_rate: 0.3,
      },
    ],
    address_city: "Ridgewood",
    address_state: "NY",
    address_verified: true,
    status: "more_info",
    decision_history: [
      {
        id: "dec-006",
        reviewer: "admin@push.co",
        action: "more_info",
        note: "Instagram account shows bot-pattern follower growth. Requires manual social audit before approval.",
        timestamp: hoursAgo(30),
      },
    ],
    hours_open: 52,
  },
  {
    id: "kyc-026",
    applicant_display: "Z. B.",
    applicant_initials: "ZB",
    avatar_color: "#780000",
    submitted_at: hoursAgo(18),
    stage_filter: "identity",
    checklist: [
      { stage: "identity", status: "complete" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "complete" },
    ],
    risk_flags: [],
    risk_level: "low",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@zara.b.nyc",
        followers: 17400,
        verified: true,
        engagement_rate: 4.1,
      },
      {
        platform: "tiktok",
        handle: "@zarab",
        followers: 33000,
        verified: true,
        engagement_rate: 6.7,
      },
    ],
    address_city: "Midtown",
    address_state: "NY",
    address_verified: true,
    status: "pending",
    decision_history: [],
    hours_open: 18,
  },
  {
    id: "kyc-027",
    applicant_display: "U. N.",
    applicant_initials: "UN",
    avatar_color: "#669bbc",
    submitted_at: hoursAgo(23),
    stage_filter: "social",
    checklist: [
      { stage: "identity", status: "complete" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "complete" },
    ],
    risk_flags: [],
    risk_level: "low",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@uma.nyc",
        followers: 9100,
        verified: true,
        engagement_rate: 5.7,
      },
    ],
    address_city: "Fort Greene",
    address_state: "NY",
    address_verified: true,
    status: "pending",
    decision_history: [],
    hours_open: 23,
  },
  {
    id: "kyc-028",
    applicant_display: "H. J.",
    applicant_initials: "HJ",
    avatar_color: "#c9a96e",
    submitted_at: hoursAgo(61),
    stage_filter: "identity",
    checklist: [
      { stage: "identity", status: "pending" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "complete" },
    ],
    risk_flags: ["incomplete_profile"],
    risk_level: "medium",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@hj.captures",
        followers: 4600,
        verified: true,
        engagement_rate: 3.4,
      },
    ],
    address_city: "Sunnyside",
    address_state: "NY",
    address_verified: true,
    status: "pending",
    decision_history: [],
    hours_open: 61,
  },
  {
    id: "kyc-029",
    applicant_display: "C. S.",
    applicant_initials: "CS",
    avatar_color: "#003049",
    submitted_at: hoursAgo(15),
    stage_filter: "address",
    checklist: [
      { stage: "identity", status: "complete" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "complete" },
    ],
    risk_flags: [],
    risk_level: "low",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@clara.s",
        followers: 43100,
        verified: true,
        engagement_rate: 4.5,
      },
      {
        platform: "tiktok",
        handle: "@claras.nyc",
        followers: 61000,
        verified: true,
        engagement_rate: 8.0,
      },
      { platform: "red", handle: "@claras", followers: 14200, verified: true },
    ],
    address_city: "DUMBO",
    address_state: "NY",
    address_verified: true,
    status: "pending",
    decision_history: [],
    hours_open: 15,
  },
  {
    id: "kyc-030",
    applicant_display: "R. P.",
    applicant_initials: "RP",
    avatar_color: "#780000",
    submitted_at: hoursAgo(43),
    stage_filter: "social",
    checklist: [
      { stage: "identity", status: "complete" },
      { stage: "social", status: "pending" },
      { stage: "address", status: "pending" },
    ],
    risk_flags: [],
    risk_level: "low",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@remi.p.nyc",
        followers: 6700,
        verified: true,
        engagement_rate: 5.5,
      },
      {
        platform: "tiktok",
        handle: "@remip",
        followers: 15200,
        verified: false,
        engagement_rate: 7.3,
      },
    ],
    address_city: "Greenpoint",
    address_state: "NY",
    address_verified: false,
    status: "pending",
    decision_history: [],
    hours_open: 43,
  },
  {
    id: "kyc-031",
    applicant_display: "A. B.",
    applicant_initials: "AB",
    avatar_color: "#669bbc",
    submitted_at: hoursAgo(85),
    stage_filter: "identity",
    checklist: [
      { stage: "identity", status: "failed" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "complete" },
    ],
    risk_flags: ["duplicate_id"],
    risk_level: "high",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@alex.b.shoots",
        followers: 21300,
        verified: true,
        engagement_rate: 4.9,
      },
    ],
    address_city: "Hoboken",
    address_state: "NJ",
    address_verified: true,
    status: "rejected",
    decision_history: [
      {
        id: "dec-007",
        reviewer: "admin@push.co",
        action: "rejected",
        note: "Third submission with failed ID. Pattern matches known fraudulent document ring. Permanently rejected.",
        timestamp: hoursAgo(10),
      },
    ],
    hours_open: 85,
  },
  {
    id: "kyc-032",
    applicant_display: "T. K.",
    applicant_initials: "TK",
    avatar_color: "#c9a96e",
    submitted_at: hoursAgo(19),
    stage_filter: "social",
    checklist: [
      { stage: "identity", status: "complete" },
      { stage: "social", status: "complete" },
      { stage: "address", status: "complete" },
    ],
    risk_flags: [],
    risk_level: "low",
    social_accounts: [
      {
        platform: "instagram",
        handle: "@tomoko.k",
        followers: 32600,
        verified: true,
        engagement_rate: 5.1,
      },
      {
        platform: "red",
        handle: "@tomoko.nyc",
        followers: 18900,
        verified: true,
      },
    ],
    address_city: "Tribeca",
    address_state: "NY",
    address_verified: true,
    status: "pending",
    decision_history: [],
    hours_open: 19,
  },
];

// Computed stats for hero section
export function getVerificationStats(items: KYCVerification[]) {
  const pending = items.filter((v) => v.status === "pending").length;
  const high_risk = items.filter((v) => v.risk_level === "high").length;
  const sla_breach = items.filter((v) => v.hours_open > 24).length;

  // Average decision time for completed items
  const decided = items.filter(
    (v) => v.status === "approved" || v.status === "rejected",
  );
  const avg_hours =
    decided.length > 0
      ? Math.round(
          decided.reduce((sum, v) => sum + v.hours_open, 0) / decided.length,
        )
      : 0;

  return { pending, high_risk, sla_breach, avg_hours };
}
