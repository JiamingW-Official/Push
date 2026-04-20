import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_FRAUD_EVENTS,
  type FraudStatus,
  type DetectionRule,
} from "@/lib/admin/mock-fraud";
import { requireAdminSession } from "@/lib/api/admin-auth";

export const dynamic = "force-dynamic";

// GET /api/admin/fraud
// Query params: status, minRisk, maxRisk, rule, window (hours), page, pageSize
export async function GET(request: NextRequest) {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  const { searchParams } = request.nextUrl;

  const status = searchParams.get("status") as FraudStatus | null;
  const minRisk = parseInt(searchParams.get("minRisk") ?? "0", 10);
  const maxRisk = parseInt(searchParams.get("maxRisk") ?? "100", 10);
  const rule = searchParams.get("rule") as DetectionRule | null;
  const windowHours = parseInt(searchParams.get("window") ?? "0", 10);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(
    50,
    Math.max(10, parseInt(searchParams.get("pageSize") ?? "20", 10)),
  );

  let events = [...MOCK_FRAUD_EVENTS];

  if (status) events = events.filter((e) => e.status === status);
  if (minRisk > 0) events = events.filter((e) => e.riskScore >= minRisk);
  if (maxRisk < 100) events = events.filter((e) => e.riskScore <= maxRisk);
  if (rule) events = events.filter((e) => e.rules.includes(rule));
  if (windowHours > 0) {
    const cutoff = new Date(Date.now() - windowHours * 60 * 60 * 1000);
    events = events.filter((e) => new Date(e.detectedAt) >= cutoff);
  }

  const total = events.length;
  const totalPages = Math.ceil(total / pageSize);
  const slice = events.slice((page - 1) * pageSize, page * pageSize);

  return NextResponse.json({
    events: slice,
    pagination: { page, pageSize, total, totalPages },
    summary: {
      pending: MOCK_FRAUD_EVENTS.filter((e) => e.status === "pending").length,
      flagged: MOCK_FRAUD_EVENTS.filter((e) => e.status === "flagged").length,
      blocked: MOCK_FRAUD_EVENTS.filter((e) => e.status === "blocked").length,
    },
  });
}
