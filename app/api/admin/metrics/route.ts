import { NextResponse } from "next/server";
import { MOCK_METRICS, MOCK_EVENTS, MOCK_ALERTS } from "@/lib/admin/mock-admin";
import { requireAdminSession } from "@/lib/api/admin-auth";

export const dynamic = "force-dynamic";

// TODO: wire to Supabase aggregation
// SELECT COUNT(*), SUM(amount) FROM scan_events WHERE created_at > NOW() - INTERVAL '24h'
// SELECT COUNT(*) FROM campaigns WHERE status = 'active'
// SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURRENT_DATE
// SELECT COUNT(*) FROM fraud_flags WHERE resolved = false UNION dispute_tickets WHERE status = 'open'

export async function GET() {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  return NextResponse.json({
    metrics: MOCK_METRICS,
    events: MOCK_EVENTS,
    alerts: MOCK_ALERTS,
    generated_at: new Date().toISOString(),
  });
}
