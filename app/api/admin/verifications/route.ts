import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_VERIFICATIONS,
  type VerificationStage,
  type VerificationStatus,
} from "@/lib/admin/mock-verifications";
import { requireAdminSession } from "@/lib/api/admin-auth";

export const dynamic = "force-dynamic";

// GET /api/admin/verifications
// Query params: stage, status, risk_level
export async function GET(request: NextRequest) {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(request.url);
  const stage = searchParams.get("stage") as VerificationStage | null;
  const status = searchParams.get("status") as VerificationStatus | null;
  const risk = searchParams.get("risk") as "low" | "medium" | "high" | null;

  let results = [...MOCK_VERIFICATIONS];

  if (stage) {
    results = results.filter((v) => v.stage_filter === stage);
  }
  if (status) {
    results = results.filter((v) => v.status === status);
  }
  if (risk) {
    results = results.filter((v) => v.risk_level === risk);
  }

  // Sort: high risk first, then by hours_open descending (oldest first)
  results.sort((a, b) => {
    const riskOrder = { high: 0, medium: 1, low: 2 };
    const riskDiff = riskOrder[a.risk_level] - riskOrder[b.risk_level];
    if (riskDiff !== 0) return riskDiff;
    return b.hours_open - a.hours_open;
  });

  return NextResponse.json({
    verifications: results,
    total: results.length,
  });
}
