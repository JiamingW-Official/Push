import { NextResponse } from "next/server";
import { verifyCode } from "@/lib/code/totp";
import { getCampaignByToken, DEMO_CAMPAIGNS } from "@/lib/code/demo-data";

// In-memory redemption log for demo
const redemptions: Array<{
  token: string;
  code: string;
  merchantName: string;
  creatorHandle: string;
  redeemedAt: string;
}> = [];

// Try all tokens if no specific token given
function findMatchingToken(code: string): string | null {
  for (const c of DEMO_CAMPAIGNS) {
    if (verifyCode(c.token, code)) return c.token;
  }
  return null;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { code, token: explicitToken } = body as {
    code?: string;
    token?: string;
  };

  if (!code) {
    return NextResponse.json({ error: "code required" }, { status: 400 });
  }

  const matchedToken = explicitToken
    ? verifyCode(explicitToken, code)
      ? explicitToken
      : null
    : findMatchingToken(code);

  if (!matchedToken) {
    return NextResponse.json(
      { success: false, error: "Invalid or expired code" },
      { status: 200 },
    );
  }

  const campaign = getCampaignByToken(matchedToken)!;
  const entry = {
    token: matchedToken,
    code,
    merchantName: campaign.merchantName,
    creatorHandle: campaign.creatorHandle,
    redeemedAt: new Date().toISOString(),
  };
  redemptions.push(entry);

  return NextResponse.json({
    success: true,
    merchantName: campaign.merchantName,
    offer: campaign.offer,
    creatorHandle: campaign.creatorHandle,
    reward: campaign.reward,
    redeemedAt: entry.redeemedAt,
  });
}

export async function GET() {
  return NextResponse.json({ redemptions });
}
