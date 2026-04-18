import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// In production this would read/write from Supabase.
// For demo mode, the client uses localStorage directly.
// These endpoints are placeholder stubs ready for real auth wiring.

export async function GET(_req: NextRequest) {
  return NextResponse.json({
    displayName: "Alex Rivera",
    bio: "NYC-based lifestyle creator. I make content that actually converts.",
    location: "New York, NY",
    languages: ["English", "Spanish"],
    avatarUrl: null,
    notifications: {
      newCampaignMatch: { email: true, push: true, sms: false },
      applicationAccepted: { email: true, push: true, sms: false },
      applicationRejected: { email: true, push: false, sms: false },
      paymentReceived: { email: true, push: true, sms: true },
      milestoneReminder: { email: true, push: true, sms: false },
      weeklyDigest: { email: true, push: false, sms: false },
      newFollowerOnPush: { email: false, push: true, sms: false },
      campaignDeadlineWarning: { email: true, push: true, sms: false },
      proofApproved: { email: true, push: true, sms: false },
      proofRejected: { email: true, push: true, sms: false },
      tierUpgrade: { email: true, push: true, sms: false },
      marketingUpdates: { email: false, push: false, sms: false },
    },
    privacy: {
      publicProfile: true,
      showEarnings: false,
      adPreferences: true,
    },
    payouts: {
      method: "bank",
      threshold: 50,
    },
  });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  // In production: validate session, write to DB
  return NextResponse.json({ ok: true, updated: body });
}
