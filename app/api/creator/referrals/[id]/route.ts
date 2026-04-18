import { NextResponse } from "next/server";
import { MOCK_INVITES } from "@/lib/referrals/mock-invites";

// GET /api/creator/referrals/[id]
// Returns a single referral invite by ID
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const invite = MOCK_INVITES.find((inv) => inv.id === id);

  if (!invite) {
    return NextResponse.json({ error: "Referral not found" }, { status: 404 });
  }

  return NextResponse.json({ invite });
}
