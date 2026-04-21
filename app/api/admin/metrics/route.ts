import { NextResponse } from "next/server";
import { MOCK_METRICS, MOCK_EVENTS, MOCK_ALERTS } from "@/lib/admin/mock-admin";

// TODO: wire to Supabase aggregation
// SELECT COUNT(*), SUM(amount) FROM scan_events WHERE created_at > NOW() - INTERVAL '24h'
// SELECT COUNT(*) FROM campaigns WHERE status = 'active'
// SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURRENT_DATE
// SELECT COUNT(*) FROM fraud_flags WHERE resolved = false UNION dispute_tickets WHERE status = 'open'

export async function GET() {
  return NextResponse.json({
    metrics: MOCK_METRICS,
    events: MOCK_EVENTS,
    alerts: MOCK_ALERTS,
    generated_at: new Date().toISOString(),
  });
}
