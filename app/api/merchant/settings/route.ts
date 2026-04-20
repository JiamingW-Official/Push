import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(_req: NextRequest) {
  return NextResponse.json({
    legalName: "Procell Coffee LLC",
    dba: "Procell Coffee",
    industry: "food_beverage",
    website: "https://procellcoffee.com",
    logoUrl: null,
    notifications: {
      newApplication: { email: true, push: true, sms: false },
      campaignFilled: { email: true, push: true, sms: false },
      proofSubmitted: { email: true, push: true, sms: false },
      paymentProcessed: { email: true, push: false, sms: false },
      campaignExpiring: { email: true, push: true, sms: false },
      weeklyReport: { email: true, push: false, sms: false },
      newQrScan: { email: false, push: false, sms: false },
      creatorMilestone: { email: true, push: false, sms: false },
      marketingUpdates: { email: false, push: false, sms: false },
    },
    privacy: {
      showOnDirectory: true,
      adPreferences: true,
    },
  });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ ok: true, updated: body });
}
