// GET /api/creator/live-campaigns
// Returns playtest campaigns in Campaign shape so the discover page can
// prepend them to MOCK_CAMPAIGNS.
// ?id=<uuid|disc-*>  → single campaign lookup (for detail + apply pages)
//
// Lookup priority:
//   1. playtestCampaigns server Map (user-created in demo session)
//   2. MOCK_CAMPAIGNS (always-present seed data, needed for direct URLs)

import { NextRequest, NextResponse } from "next/server";
import { playtestCampaigns, type PlaytestCampaign } from "@/lib/playtest/store";
import { MOCK_CAMPAIGNS, type Campaign } from "@/lib/mocks/campaigns";

function toCampaign(p: PlaytestCampaign): Campaign {
  const cat = p.category.toUpperCase();
  const validCats = [
    "FOOD & DRINK",
    "RETAIL",
    "WELLNESS",
    "BEAUTY",
    "FITNESS",
    "LIFESTYLE",
  ] as const;
  type CatType = (typeof validCats)[number];

  const category: CatType = validCats.includes(cat as CatType)
    ? (cat as CatType)
    : "FOOD & DRINK";

  return {
    id: p.id,
    title: p.title,
    tagline: p.description.slice(0, 80) || undefined,
    merchantName: p.merchantName,
    neighborhood: "NYC",
    category,
    cashPay: p.payout,
    payUnit: "campaign",
    deliverables: [
      { type: "reel", count: 1, unitPay: p.payout, estHoursEach: 1 },
    ],
    slotsTotal: p.spotsTotal,
    slotsRemaining: p.spotsRemaining,
    distanceMi: 0.3,
    format: "in-person",
    matchScore: 95,
    deadlineIso: p.deadline,
    lat: 40.7218,
    lng: -74.001,
    images: [
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=480&h=600&fit=crop&q=72",
    ],
    minimumTier: 1,
  };
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (id) {
    // 1. Check playtest (user-created in this demo session)
    const p = playtestCampaigns.get(id);
    if (p) return NextResponse.json({ campaign: toCampaign(p) });
    // 2. Check static mock seed (disc-* IDs — always available)
    const mock = MOCK_CAMPAIGNS.find((c) => c.id === id);
    return NextResponse.json({ campaign: mock ?? null });
  }
  const campaigns = Array.from(playtestCampaigns.values()).map(toCampaign);
  return NextResponse.json({ campaigns });
}
