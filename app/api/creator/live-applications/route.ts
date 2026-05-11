// GET /api/creator/live-applications
// Returns playtest applications for the demo creator so the creator portal
// can show server-side approval status (e.g. merchant accepted the application).
// ?campaignId=<uuid>  → filter to a single campaign

import { NextRequest, NextResponse } from "next/server";
import { playtestApplications } from "@/lib/playtest/store";

export async function GET(req: NextRequest) {
  const campaignId = req.nextUrl.searchParams.get("campaignId");

  const apps = Array.from(playtestApplications.values()).filter(
    (a) => a.creatorHandle === "@demo-creator",
  );

  const filtered = campaignId
    ? apps.filter((a) => a.campaignId === campaignId)
    : apps;

  return NextResponse.json({
    applications: filtered.map((a) => ({
      id: a.id,
      campaignId: a.campaignId,
      campaignTitle: a.campaignTitle,
      merchantName: a.merchantName,
      status: a.status,
      appliedAt: a.appliedAt,
    })),
  });
}
