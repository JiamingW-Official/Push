/**
 * /api/internal/recruitment-sync
 *
 * Internal endpoint wrapping the CreatorRecruitmentService for Push's
 * recruitment funnel management (prospect → active → churn lifecycle).
 *
 *   POST   apply one of 4 lifecycle actions. `action` is an RPC-style
 *          discriminator over a single resource; responses are shaped
 *          `{ data, timestamp }` for envelope symmetry with GET.
 *     - recruit          (creator_id, tier, recruitment_source)
 *     - move_to_active   (creator_id)
 *     - update_score     (creator_id, score)
 *     - churn            (creator_id, reason?)  // reason optional; forwarded
 *                                               // to the service (not
 *                                               // persisted — logged by
 *                                               // the service itself)
 *   GET    list funnel rows filtered by any combination of tier / status,
 *          with a bounded limit. Returns `{ data, count, timestamp }`.
 *          Sort: prospect rows (score always 0) use `signed_date DESC`;
 *          every other status uses `performance_score DESC`.
 *
 * Error contract:
 *   400 — malformed JSON, unknown action, missing or wrong-typed fields,
 *         non-UUID creator_id.
 *   500 — service threw / DB error. Response carries a `trace_id` only;
 *         the raw cause is emitted to server logs keyed on the same id.
 *         Never returns Postgres error details to the client.
 */

import { NextRequest } from "next/server";
import { supabase } from "@/lib/db";
import { CreatorRecruitmentService } from "@/lib/services/CreatorRecruitmentService";
import { badRequest, serverError, success } from "@/lib/api/responses";
import type {
  CreatorRecruitmentFunnel,
  CreatorRecruitmentSource,
  CreatorRecruitmentStatus,
  CreatorTier,
} from "@/types/database";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Constants / validators
// ---------------------------------------------------------------------------

const TABLE = "creator_recruitment_funnel";

const DEFAULT_GET_LIMIT = 20;
const MAX_GET_LIMIT = 100;

const ACTIONS = ["recruit", "move_to_active", "update_score", "churn"] as const;
type Action = (typeof ACTIONS)[number];

const TIERS: ReadonlySet<number> = new Set([1, 2, 3]);

const SOURCES: ReadonlySet<string> = new Set<CreatorRecruitmentSource>([
  "direct_network",
  "community",
  "incentive",
]);

const STATUSES: ReadonlySet<string> = new Set<CreatorRecruitmentStatus>([
  "prospect",
  "early_operator",
  "active",
  "churn",
]);

/** Strict UUID v1-v5 regex. Rejects empty strings and non-UUID garbage
 *  before it reaches the DB, short-circuiting a wasted round-trip and a
 *  PostgrestError we'd then have to sanitize. */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Subset of funnel columns the GET endpoint projects — kept in sync with
 *  the `.select(...)` string literal via one named type. */
type FunnelListRow = Pick<
  CreatorRecruitmentFunnel,
  | "id"
  | "tier"
  | "status"
  | "performance_score"
  | "recruitment_source"
  | "signed_date"
>;

/** Names of the projected columns, derived from {@link FunnelListRow} so a
 *  drift between the type and the `.select()` string is a compile error. */
const FUNNEL_LIST_KEYS: readonly (keyof FunnelListRow)[] = [
  "id",
  "tier",
  "status",
  "performance_score",
  "recruitment_source",
  "signed_date",
];
const FUNNEL_LIST_COLUMNS = FUNNEL_LIST_KEYS.join(", ");

// Shared service instance — stateless aside from DB handles.
const recruitmentService = new CreatorRecruitmentService();

// ---------------------------------------------------------------------------
// POST — dispatch a lifecycle action.
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON");
  }

  if (!isAction(body.action)) {
    return badRequest("Invalid or missing `action`", { allowed: ACTIONS });
  }
  const action = body.action;

  const creatorId = body.creator_id;
  if (typeof creatorId !== "string" || !UUID_RE.test(creatorId)) {
    return badRequest("Missing or invalid `creator_id` (expected UUID)");
  }

  try {
    switch (action) {
      case "recruit": {
        const tier = body.tier;
        const source = body.recruitment_source;

        if (typeof tier !== "number" || !TIERS.has(tier)) {
          return badRequest("`tier` must be 1, 2, or 3");
        }
        if (typeof source !== "string" || !SOURCES.has(source)) {
          return badRequest(
            "`recruitment_source` must be one of direct_network, community, incentive",
          );
        }

        const row = await recruitmentService.recruitCreator(
          creatorId,
          tier as CreatorTier,
          source as CreatorRecruitmentSource,
        );
        return success(row);
      }

      case "move_to_active": {
        const row = await recruitmentService.moveCreatorToActive(creatorId);
        return success(row);
      }

      case "update_score": {
        const score = body.score;
        if (typeof score !== "number" || !Number.isFinite(score)) {
          return badRequest(
            "`score` must be a finite number (clamped to [0, 1])",
          );
        }
        const row = await recruitmentService.updatePerformanceScore(
          creatorId,
          score,
        );
        return success(row);
      }

      case "churn": {
        const reason =
          typeof body.reason === "string" ? body.reason : undefined;
        const row = await recruitmentService.churnCreator(creatorId, reason);
        return success(row);
      }

      default:
        // Exhaustiveness guard — if a new Action member is added without a
        // case, the `never` annotation surfaces the gap at compile time.
        return assertNever(action);
    }
  } catch (err) {
    return serverError("recruitment-sync POST", err);
  }
}

// ---------------------------------------------------------------------------
// GET — list funnel rows by any combination of tier / status / limit.
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
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
    // Inline Supabase query: combined filters live at the HTTP-adaptation
    // layer because the service's getCreatorsByTier / getActivators don't
    // cover every combination (e.g. status='prospect' alone). Keeping it
    // here avoids bloating the service with a seventh method.
    //
    // Sort rule: prospect rows have performance_score == 0 by default, so
    // ordering them by score is meaningless — fall back to signed_date.
    const orderCol: "performance_score" | "signed_date" =
      status.value === "prospect" ? "signed_date" : "performance_score";

    let query = supabase
      .from(TABLE)
      .select(FUNNEL_LIST_COLUMNS)
      .order(orderCol, { ascending: false, nullsFirst: false })
      .limit(limit);

    // `tier.value` / `status.value` are `undefined` when the caller omitted
    // the param (ok:true still, just no filter); skip .eq() in that case.
    if (tier.value !== undefined) query = query.eq("tier", tier.value);
    if (status.value !== undefined) query = query.eq("status", status.value);

    const { data, error } = await query;
    if (error) throw error;

    const rows = (data ?? []) as unknown as FunnelListRow[];

    return success(rows, { count: rows.length });
  } catch (err) {
    return serverError("recruitment-sync GET", err);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isAction(v: unknown): v is Action {
  return typeof v === "string" && (ACTIONS as readonly string[]).includes(v);
}

/** Parse + clamp a `limit` query param into [1, MAX_GET_LIMIT]. */
function clampLimit(raw: string | null): number {
  if (raw === null) return DEFAULT_GET_LIMIT;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) return DEFAULT_GET_LIMIT;
  if (parsed < 1) return 1;
  if (parsed > MAX_GET_LIMIT) return MAX_GET_LIMIT;
  return parsed;
}

/**
 * Result type for optional-query-param parsers. `ok: true` with a missing
 * `value` means "not provided" (still a valid request); `ok: false` means
 * the caller sent something but it failed the enum check.
 */
type ParseResult<T> = { ok: true; value?: T } | { ok: false };

/** Parse a `tier` query param. */
function parseTier(raw: string | null): ParseResult<CreatorTier> {
  if (raw === null) return { ok: true };
  const parsed = Number.parseInt(raw, 10);
  if (!TIERS.has(parsed)) return { ok: false };
  return { ok: true, value: parsed as CreatorTier };
}

/** Parse a `status` query param. */
function parseStatus(
  raw: string | null,
): ParseResult<CreatorRecruitmentStatus> {
  if (raw === null) return { ok: true };
  if (!STATUSES.has(raw)) return { ok: false };
  return { ok: true, value: raw as CreatorRecruitmentStatus };
}

/** Compile-time exhaustiveness assertion for `switch(action)`. */
function assertNever(x: never): never {
  throw new Error(`Unreachable action: ${String(x)}`);
}
