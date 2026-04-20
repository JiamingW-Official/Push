/**
 * GET /api/admin/creators?tier=&status=&limit=
 *
 * Admin-scoped list of recruitment-funnel rows. Replaces the
 * admin UI's previous call to `/api/internal/recruitment-sync?limit=20`
 * — `/api/internal/*` is now locked behind a server-to-server secret
 * (middleware.ts) and unreachable from browser sessions by design.
 *
 * Filtering semantics match the Session 3-2 recruitment-sync endpoint:
 *   - tier    (optional) ∈ {1, 2, 3}
 *   - status  (optional) ∈ {prospect, early_operator, active, churn}
 *   - limit   (optional) [1, MAX_LIMIT], default DEFAULT_LIMIT
 *   - sort:   status=prospect → signed_date DESC, else performance_score DESC
 *
 * Response: `{ data: FunnelListRow[], count, timestamp }`.
 * Auth:     admin session required.
 */

import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/api/admin-auth";
import { supabase } from "@/lib/db";
import { badRequest, serverError, success } from "@/lib/api/responses";
import type {
  CreatorRecruitmentFunnel,
  CreatorRecruitmentStatus,
  CreatorTier,
} from "@/types/database";

export const dynamic = "force-dynamic";

const TABLE = "creator_recruitment_funnel";
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const TIERS: ReadonlySet<number> = new Set([1, 2, 3]);
const STATUSES: ReadonlySet<string> = new Set<CreatorRecruitmentStatus>([
  "prospect",
  "early_operator",
  "active",
  "churn",
]);

type FunnelListRow = Pick<
  CreatorRecruitmentFunnel,
  | "id"
  | "tier"
  | "status"
  | "performance_score"
  | "recruitment_source"
  | "signed_date"
>;

const FUNNEL_LIST_KEYS: readonly (keyof FunnelListRow)[] = [
  "id",
  "tier",
  "status",
  "performance_score",
  "recruitment_source",
  "signed_date",
];
const FUNNEL_LIST_COLUMNS = FUNNEL_LIST_KEYS.join(", ");

type ParseResult<T> = { ok: true; value?: T } | { ok: false };

function parseTier(raw: string | null): ParseResult<CreatorTier> {
  if (raw === null) return { ok: true };
  const parsed = Number.parseInt(raw, 10);
  if (!TIERS.has(parsed)) return { ok: false };
  return { ok: true, value: parsed as CreatorTier };
}

function parseStatus(
  raw: string | null,
): ParseResult<CreatorRecruitmentStatus> {
  if (raw === null) return { ok: true };
  if (!STATUSES.has(raw)) return { ok: false };
  return { ok: true, value: raw as CreatorRecruitmentStatus };
}

function clampLimit(raw: string | null): number {
  if (raw === null) return DEFAULT_LIMIT;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) return DEFAULT_LIMIT;
  if (parsed < 1) return 1;
  if (parsed > MAX_LIMIT) return MAX_LIMIT;
  return parsed;
}

export async function GET(request: NextRequest) {
  const gate = await requireAdminSession();
  if (!gate.ok) return gate.response;

  const params = request.nextUrl.searchParams;

  const tier = parseTier(params.get("tier"));
  if (!tier.ok) return badRequest("`tier` must be 1, 2, or 3");

  const status = parseStatus(params.get("status"));
  if (!status.ok) {
    return badRequest(
      "`status` must be prospect, early_operator, active, or churn",
    );
  }

  const limit = clampLimit(params.get("limit"));

  try {
    // Same sort rule as the internal endpoint: prospect rows have
    // performance_score == 0 by default, so ordering them by score is
    // meaningless — fall back to signed_date (when they were enrolled).
    const orderCol: "performance_score" | "signed_date" =
      status.value === "prospect" ? "signed_date" : "performance_score";

    let query = supabase
      .from(TABLE)
      .select(FUNNEL_LIST_COLUMNS)
      .order(orderCol, { ascending: false, nullsFirst: false })
      .limit(limit);

    if (tier.value !== undefined) query = query.eq("tier", tier.value);
    if (status.value !== undefined) query = query.eq("status", status.value);

    const { data, error } = await query;
    if (error) throw error;

    const rows = (data ?? []) as FunnelListRow[];
    return success(rows, { count: rows.length });
  } catch (err) {
    return serverError("admin-creators", err);
  }
}
