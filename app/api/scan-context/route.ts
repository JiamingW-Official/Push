// GET /api/scan-context?qrId=<id>
// Public endpoint — no auth required. Returns the QR context needed
// by the /scan/[qrId] landing page. Checks:
//   1. MOCK_QR_CODES (demo/attribution mock data)
//   2. playtestQRCodes (merchant-created playtest campaigns)
//   3. playtestCampaigns fallback (constructs context on the fly)
// Also increments scan_count on playtest QR records.

import { NextRequest, NextResponse } from "next/server";
import { MOCK_QR_CODES } from "@/lib/attribution/mock-qr-codes";
import { playtestQRCodes, playtestCampaigns } from "@/lib/playtest/store";

export async function GET(req: NextRequest) {
  const qrId = req.nextUrl.searchParams.get("qrId");
  if (!qrId) {
    return NextResponse.json({ error: "Missing qrId" }, { status: 400 });
  }

  // 1. Mock QR codes — return as-is
  const mock = MOCK_QR_CODES.find((q) => q.qrId === qrId);
  if (mock) {
    return NextResponse.json({ qr: mock });
  }

  // 2. Playtest QR code — increment scan counter + return
  const pqr = playtestQRCodes.get(qrId);
  if (pqr) {
    playtestQRCodes.set(qrId, { ...pqr, scanCount: pqr.scanCount + 1 });
    return NextResponse.json({
      qr: buildQRFromPlaytest(
        pqr.id,
        pqr.merchantName,
        pqr.campaignTitle,
        pqr.description,
        pqr.offer,
        pqr.reward,
        pqr.deadline,
        pqr.category,
        pqr.createdAt,
        pqr.id,
      ),
    });
  }

  // 3. Fallback: construct from playtestCampaign directly
  const campaign = playtestCampaigns.get(qrId);
  if (campaign) {
    return NextResponse.json({
      qr: buildQRFromPlaytest(
        campaign.id,
        campaign.merchantName,
        campaign.title,
        campaign.description,
        campaign.offer,
        campaign.reward,
        campaign.deadline,
        campaign.category,
        campaign.createdAt,
        campaign.id,
      ),
    });
  }

  return NextResponse.json({ error: "QR not found" }, { status: 404 });
}

function buildQRFromPlaytest(
  qrId: string,
  merchantName: string,
  campaignTitle: string,
  description: string,
  offer: string,
  reward: string,
  deadline: string,
  category: string,
  createdAt: string,
  campaignId: string,
) {
  return {
    qrId,
    campaignId,
    creatorId: "playtest-creator",
    merchantId: "playtest-merchant",
    creatorName: "Creator",
    creatorHandle: "@creator",
    campaignTitle,
    businessName: merchantName,
    businessAddress: "New York, NY",
    category: category.charAt(0).toUpperCase() + category.slice(1),
    description: description || campaignTitle,
    offerTier1: offer || campaignTitle,
    offerTier2: `${reward} reward for verified visit`,
    heroSlotsTotal: 10,
    heroSlotsUsed: 0,
    payout: 0,
    lat: 40.7128,
    lng: -74.006,
    issuedAt: createdAt,
    expiresAt: deadline
      ? `${deadline}T23:59:59Z`
      : new Date(Date.now() + 90 * 86_400_000).toISOString(),
    scannedBy: [],
  };
}

// POST /api/scan-context — increment scan count without returning full data
// (used by /api/attribution/scan to track playtest QR hits)
export async function POST(req: NextRequest) {
  const { qrId } = (await req.json().catch(() => ({}))) as { qrId?: string };
  if (!qrId) {
    return NextResponse.json({ error: "Missing qrId" }, { status: 400 });
  }
  const pqr = playtestQRCodes.get(qrId);
  if (pqr) {
    playtestQRCodes.set(qrId, { ...pqr, scanCount: pqr.scanCount + 1 });
    return NextResponse.json({ ok: true, scanCount: pqr.scanCount + 1 });
  }
  return NextResponse.json({ ok: false });
}
