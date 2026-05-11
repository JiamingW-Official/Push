import type { PlaytestCampaign } from "@/lib/playtest/store";

export interface DemoCampaign {
  id: string;
  merchantName: string;
  merchantType: string;
  offer: string;
  reward: string;
  token: string;
  creatorName: string;
  creatorHandle: string;
  accent: string;
}

export const DEMO_CAMPAIGNS: DemoCampaign[] = [
  {
    id: "camp-001",
    merchantName: "Roberta's Pizza",
    merchantType: "Restaurant",
    offer: "Free slice with any order",
    reward: "$40",
    token: "roberta-nyc-001",
    creatorName: "Alex Chen",
    creatorHandle: "@alexeats",
    accent: "#c1121f",
  },
  {
    id: "camp-002",
    merchantName: "Blank Street Coffee",
    merchantType: "Café",
    offer: "Buy one get one espresso",
    reward: "$32",
    token: "blankst-nyc-002",
    creatorName: "Maya Park",
    creatorHandle: "@mayabrews",
    accent: "#bfa170",
  },
  {
    id: "camp-003",
    merchantName: "Violette_FR",
    merchantType: "Beauty",
    offer: "20% off first purchase",
    reward: "$67",
    token: "violette-nyc-003",
    creatorName: "Sarah Kim",
    creatorHandle: "@sarahbeauty",
    accent: "#e8447d",
  },
];

export function getCampaignByToken(token: string): DemoCampaign | undefined {
  const d = DEMO_CAMPAIGNS.find((c) => c.token === token);
  if (d) return d;

  // Check playtest store (campaigns created live during demo sessions)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { playtestCampaigns } = require("@/lib/playtest/store") as {
    playtestCampaigns: Map<string, PlaytestCampaign>;
  };
  const p = playtestCampaigns.get(token);
  if (!p) return undefined;
  return {
    id: p.id,
    merchantName: p.merchantName,
    merchantType: p.merchantType,
    offer: p.offer,
    reward: p.reward,
    token: p.token,
    creatorName: "Creator",
    creatorHandle: "@creator",
    accent: p.accent,
  };
}
