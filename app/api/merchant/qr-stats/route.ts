// GET /api/merchant/qr-stats?campaignId=<id>
// Returns QR scan stats for a specific campaign without incrementing the counter.
// Used by the merchant campaign detail page to display live scan stats.

import { NextRequest, NextResponse } from "next/server";
import { playtestQRCodes } from "@/lib/playtest/store";

export async function GET(req: NextRequest) {
  const campaignId = req.nextUrl.searchParams.get("campaignId");
  if (!campaignId) {
    return NextResponse.json({ scanCount: 0 });
  }
  const pqr = playtestQRCodes.get(campaignId);
  return NextResponse.json({ scanCount: pqr?.scanCount ?? 0 });
}
