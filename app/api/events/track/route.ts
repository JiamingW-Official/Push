import { NextRequest, NextResponse } from "next/server";

export interface TrackEventRequest {
  event: string; // e.g. "yc_page_view", "cta_click"
  properties?: Record<string, unknown>; // arbitrary key-value
  sessionId?: string;
  userId?: string;
}

export interface TrackEventResponse {
  ok: boolean;
  eventId: string;
}

// Standard event names:
// "yc_page_view"         — investor page loaded
// "yc_cta_schedule"      — Calendly link clicked
// "yc_cta_onepager"      — one-pager PDF downloaded
// "creator_signup_start" — creator signup funnel entered
// "creator_ml_sent"      — magic link sent
// "merchant_pilot_apply" — pilot application submitted
// "disclosure_screen"    — DisclosureBot caption screened

// POST /api/events/track — unified event tracking
export async function POST(req: NextRequest) {
  let body: Partial<TrackEventRequest>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    !body.event ||
    typeof body.event !== "string" ||
    body.event.trim() === ""
  ) {
    return NextResponse.json(
      { error: "Missing required field: event" },
      { status: 422 },
    );
  }

  const eventId = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // TODO: write to analytics table (Supabase) or forward to PostHog / Segment

  const response: TrackEventResponse = {
    ok: true,
    eventId,
  };

  return NextResponse.json(response, { status: 200 });
}
