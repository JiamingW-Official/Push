import { NextRequest, NextResponse } from "next/server";
import { getEventsForMonth, MOCK_EVENTS } from "@/lib/calendar/mock-events";

// GET /api/creator/calendar?month=YYYY-MM
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");

  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const events = getEventsForMonth(month);
    return NextResponse.json({ events, month });
  }

  // No month param — return all events
  return NextResponse.json({ events: MOCK_EVENTS });
}
