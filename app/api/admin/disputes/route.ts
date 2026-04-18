import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_DISPUTES,
  DisputeStatus,
  DisputeSeverity,
} from "@/lib/disputes/mock-admin-disputes";

// GET /api/admin/disputes
// Query params: status, severity, min_amount, max_amount, category, search
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const status = searchParams.get("status") as DisputeStatus | null;
  const severity = searchParams.get("severity") as DisputeSeverity | null;
  const minAmount = searchParams.get("min_amount");
  const maxAmount = searchParams.get("max_amount");
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  let disputes = [...MOCK_DISPUTES];

  if (status) {
    disputes = disputes.filter((d) => d.status === status);
  }

  if (severity) {
    disputes = disputes.filter((d) => d.severity === severity);
  }

  if (minAmount) {
    disputes = disputes.filter((d) => d.amount >= parseFloat(minAmount));
  }

  if (maxAmount) {
    disputes = disputes.filter((d) => d.amount <= parseFloat(maxAmount));
  }

  if (category) {
    disputes = disputes.filter((d) => d.campaign_category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    disputes = disputes.filter(
      (d) =>
        d.creator_name.toLowerCase().includes(q) ||
        d.merchant_business.toLowerCase().includes(q) ||
        d.campaign_title.toLowerCase().includes(q) ||
        d.reason.toLowerCase().includes(q),
    );
  }

  // Sort: open/escalated first, then by severity, then by opened_at desc
  const SEVERITY_ORDER: Record<string, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };
  const STATUS_ORDER: Record<string, number> = {
    escalated: 0,
    open: 1,
    under_review: 2,
    awaiting_evidence: 3,
    resolved: 4,
    dismissed: 5,
  };

  disputes.sort((a, b) => {
    const statusDiff =
      (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9);
    if (statusDiff !== 0) return statusDiff;
    const severityDiff =
      (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9);
    if (severityDiff !== 0) return severityDiff;
    return new Date(b.opened_at).getTime() - new Date(a.opened_at).getTime();
  });

  return NextResponse.json({ disputes, total: disputes.length });
}
