import { NextResponse } from "next/server";
import {
  MOCK_INVITES,
  computeReferralStats,
} from "@/lib/referrals/mock-invites";

// GET /api/creator/referrals
// Returns all referral invites + aggregated stats for the current creator
export async function GET() {
  const stats = computeReferralStats(MOCK_INVITES);

  return NextResponse.json({
    invites: MOCK_INVITES,
    stats,
    referralCode: "maya-x7k2",
    referralUrl: "push.nyc/invite/maya-x7k2",
  });
}

// POST /api/creator/referrals
// Generate a new invite link (stub — returns existing code)
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const type = body.type ?? "creator";

  return NextResponse.json({
    success: true,
    type,
    referralCode: "maya-x7k2",
    referralUrl: "push.nyc/invite/maya-x7k2",
    message: "Invite link ready to share.",
  });
}
