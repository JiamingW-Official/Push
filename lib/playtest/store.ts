// Shared in-memory playtest store.
// Same pattern as lib/code/redemption-store.ts — module-level Maps
// survive across API route calls within the same Lambda/Node process.
// Works reliably on local dev; on Vercel it holds for the duration of
// a warm lambda (sufficient for a controlled playtest session).

export interface PlaytestCampaign {
  id: string; // UUID, also used as TOTP token
  token: string; // same as id
  merchantName: string;
  merchantType: string; // e.g. "Café", "Restaurant"
  title: string;
  description: string;
  offer: string; // short text for fan page, e.g. "Free latte for a reel"
  reward: string; // e.g. "$5"
  accent: string; // hex color for fan page
  payout: number;
  spotsTotal: number;
  spotsRemaining: number;
  deadline: string; // ISO date string
  category: string;
  createdAt: string;
}

export interface PlaytestApplication {
  id: string;
  campaignId: string;
  campaignTitle: string;
  merchantName: string;
  creatorHandle: string;
  status: "pending" | "accepted" | "declined" | "shortlisted";
  appliedAt: string;
}

export const playtestCampaigns = new Map<string, PlaytestCampaign>();
export const playtestApplications = new Map<string, PlaytestApplication>();
