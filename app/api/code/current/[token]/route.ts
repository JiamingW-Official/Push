import { NextResponse } from "next/server";
import { generateCode, secondsUntilNextCode } from "@/lib/code/totp";
import { getCampaignByToken } from "@/lib/code/demo-data";
import { redeemedTokens } from "@/lib/code/redemption-store";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const campaign = getCampaignByToken(token);
  if (!campaign)
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });

  const redemption = redeemedTokens.get(token) ?? null;

  return NextResponse.json({
    code: generateCode(token),
    secondsLeft: secondsUntilNextCode(),
    windowSize: 15,
    redeemed: redemption !== null,
    redemption,
  });
}
