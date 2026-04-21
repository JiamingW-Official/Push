import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_AUDIT_LOG,
  getAuditSummary,
  type AuditAction,
  type AuditSeverity,
  type TargetType,
} from "@/lib/admin/mock-audit";

// GET /api/admin/audit-log
// Query params:
//   page        number (default 1)
//   limit       number (default 50, max 100)
//   actor       admin id
//   action      AuditAction
//   targetType  TargetType
//   severity    AuditSeverity
//   search      full-text against action label + target label + notes
//   from        ISO date string
//   to          ISO date string
//   preset      1h | 24h | 7d | 30d (overrides from/to)
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10)),
  );

  const actorFilter = searchParams.get("actor") ?? "";
  const actionFilter = searchParams.get("action") as AuditAction | null;
  const targetTypeFilter = searchParams.get("targetType") as TargetType | null;
  const severityFilter = searchParams.get("severity") as AuditSeverity | null;
  const search = (searchParams.get("search") ?? "").toLowerCase().trim();
  const preset = searchParams.get("preset");

  // Resolve time range
  let fromMs: number | null = null;
  let toMs: number | null = null;
  const now = Date.now();

  if (preset) {
    toMs = now;
    switch (preset) {
      case "1h":
        fromMs = now - 1 * 60 * 60 * 1000;
        break;
      case "24h":
        fromMs = now - 24 * 60 * 60 * 1000;
        break;
      case "7d":
        fromMs = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case "30d":
        fromMs = now - 30 * 24 * 60 * 60 * 1000;
        break;
    }
  } else {
    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");
    if (fromStr) fromMs = new Date(fromStr).getTime();
    if (toStr) toMs = new Date(toStr).getTime();
  }

  // Filter
  let filtered = MOCK_AUDIT_LOG.filter((entry) => {
    if (actorFilter && entry.actor.id !== actorFilter) return false;
    if (actionFilter && entry.action !== actionFilter) return false;
    if (targetTypeFilter && entry.target.type !== targetTypeFilter)
      return false;
    if (severityFilter && entry.severity !== severityFilter) return false;

    if (fromMs !== null) {
      if (new Date(entry.timestamp).getTime() < fromMs) return false;
    }
    if (toMs !== null) {
      if (new Date(entry.timestamp).getTime() > toMs) return false;
    }

    if (search) {
      const hay = [
        entry.actionLabel,
        entry.target.label,
        entry.actor.name,
        entry.notes ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(search)) return false;
    }

    return true;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const items = filtered.slice(offset, offset + limit);

  // Pinned alerts (always returned regardless of pagination, from unfiltered set)
  const pinnedAlerts = MOCK_AUDIT_LOG.filter((e) => e.pinned).slice(0, 10);

  // Summary over the filtered set
  const filteredSummary = {
    total,
    critical: filtered.filter((e) => e.severity === "critical").length,
    warning: filtered.filter((e) => e.severity === "warning").length,
    info: filtered.filter((e) => e.severity === "info").length,
  };

  return NextResponse.json({
    items,
    pagination: { page, limit, total, totalPages },
    summary: filteredSummary,
    globalSummary: getAuditSummary(),
    pinnedAlerts,
  });
}
