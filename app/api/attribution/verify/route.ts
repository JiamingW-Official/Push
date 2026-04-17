import { NextRequest, NextResponse } from "next/server";

// POST /api/attribution/verify
// Records a verification submission (customer uploads proof at merchant location).
// Also handles conversion events when offer tier + amount are known.
// Currently returns mock success — wire to Supabase when ready.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { type, qrId, campaignId, creatorId, merchantId, sessionId } = body;

    if (!qrId || !campaignId || !creatorId || !merchantId) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: qrId, campaignId, creatorId, merchantId",
        },
        { status: 400 },
      );
    }

    if (type === "verify") {
      const { evidenceType } = body;

      // TODO: wire to Supabase
      // const { error } = await supabase.from("attribution_verifications").insert({
      //   qr_id: qrId,
      //   campaign_id: campaignId,
      //   creator_id: creatorId,
      //   merchant_id: merchantId,
      //   session_id: sessionId,
      //   evidence_type: evidenceType,
      //   verified_at: new Date().toISOString(),
      //   status: "pending_review",
      // });

      // TODO: trigger creator earnings webhook
      // await triggerCreatorEarningsWebhook({ creatorId, campaignId, qrId });

      return NextResponse.json({
        ok: true,
        verificationId: `verify-${Date.now()}`,
        qrId,
        campaignId,
        creatorId,
        evidenceType: evidenceType ?? "photo",
        status: "pending_review",
        recordedAt: new Date().toISOString(),
        sessionId: sessionId ?? null,
      });
    }

    if (type === "conversion") {
      const { amount, offerTier } = body;

      // TODO: wire to Supabase
      // await supabase.from("attribution_conversions").insert({
      //   qr_id: qrId,
      //   campaign_id: campaignId,
      //   creator_id: creatorId,
      //   merchant_id: merchantId,
      //   amount,
      //   offer_tier: offerTier,
      //   converted_at: new Date().toISOString(),
      // });

      return NextResponse.json({
        ok: true,
        conversionId: `conv-${Date.now()}`,
        qrId,
        campaignId,
        creatorId,
        amount: amount ?? 0,
        offerTier: offerTier ?? 2,
        recordedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { error: "Unknown event type. Expected: verify | conversion" },
      { status: 400 },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to record verification event" },
      { status: 500 },
    );
  }
}
