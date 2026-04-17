import { NextRequest, NextResponse } from "next/server";

// POST /api/attribution/scan
// Records a QR code scan event when a customer lands on the scan page.
// Currently returns mock success — wire to Supabase when ready.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { qrId, campaignId, creatorId, merchantId, timestamp, sessionId } =
      body;

    if (!qrId || !campaignId || !creatorId || !merchantId) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: qrId, campaignId, creatorId, merchantId",
        },
        { status: 400 },
      );
    }

    // TODO: wire to Supabase
    // const { error } = await supabase.from("attribution_scans").insert({
    //   qr_id: qrId,
    //   campaign_id: campaignId,
    //   creator_id: creatorId,
    //   merchant_id: merchantId,
    //   scanned_at: timestamp ?? new Date().toISOString(),
    //   session_id: sessionId,
    //   user_agent: request.headers.get("user-agent") ?? "",
    //   referrer: request.headers.get("referer") ?? "",
    // });

    // Demo: echo back the event with a server timestamp
    return NextResponse.json({
      ok: true,
      scanId: `scan-${Date.now()}`,
      qrId,
      campaignId,
      creatorId,
      merchantId,
      recordedAt: new Date().toISOString(),
      sessionId: sessionId ?? null,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to record scan event" },
      { status: 500 },
    );
  }
}
