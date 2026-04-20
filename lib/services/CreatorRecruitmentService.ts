/**
 * Push v5.2 — Creator Recruitment Service
 *
 * Manages the recruitment lifecycle for Push's Two-Segment Creator Economics:
 *   - Tier 1 — direct network (personal referrals, founding cohort)
 *   - Tier 2 — early operators (creators with an existing audience)
 *   - Tier 3 — active high-value creators (cross-platform, compounding)
 *
 * Each creator has exactly one row in `creator_recruitment_funnel` tracking
 * their tier, lifecycle status, source, and a rolling performance score.
 * The service owns transitions between statuses (prospect → active → churn)
 * and exposes read helpers for the GTM dashboard and operator review.
 *
 * Performance score convention: **0..1 decimal** (e.g. 0.72 = 72%). The
 * underlying column supports any numeric range, but this service clamps and
 * reasons about scores on a 0..1 scale. A score below 0.30 on an `active`
 * creator triggers a churn recommendation back to the caller.
 *
 * Server-side only: imports `lib/db` which uses the service-role key.
 */

import { db, supabase } from "@/lib/db";
import type {
  CreatorRecruitmentFunnel,
  CreatorRecruitmentSource,
  CreatorTier,
} from "@/types/database";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Table name for the funnel (migration 004_creator_recruitment_funnel). */
const TABLE = "creator_recruitment_funnel";

/**
 * Active creators scoring below this threshold are flagged for churn review.
 * Exported so dashboards / ops tooling can derive the same signal from a
 * raw row via {@link shouldSuggestChurn}.
 */
export const CHURN_SUGGEST_THRESHOLD = 0.3;

/**
 * Default page size for list methods. Used both as the explicit default
 * for {@link CreatorRecruitmentService.getActivators} and as the safe
 * fallback inside {@link clampListLimit} when the caller supplies a
 * non-finite value.
 */
const DEFAULT_LIST_LIMIT = 10;

/** Pagination options shared by all list methods on the service. */
export interface TierListOptions {
  /** Max rows to return. Clamped into [1, MAX_LIST_LIMIT]. */
  limit?: number;
  /** Rows to skip before `limit` takes effect. Defaults to 0. */
  offset?: number;
}

/**
 * Hard upper bound applied to every list query's `limit`. Prevents an API
 * caller from streaming the entire funnel through Node (service-role
 * bypasses RLS so there is no other ceiling).
 */
const MAX_LIST_LIMIT = 100;

/** PostgREST "row not found" error code returned by `.single()` on zero rows. */
const PGRST_NO_ROWS = "PGRST116";

/** Max length we keep of free-form reason strings before writing to logs. */
const REASON_LOG_MAX_LEN = 500;

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class CreatorRecruitmentService {
  /**
   * Enroll a new creator into the recruitment funnel.
   *
   * Creates one `creator_recruitment_funnel` row in `prospect` status with
   * `signed_date = null` and `performance_score = 0`. The creator can be
   * promoted to `active` via {@link moveCreatorToActive} once they sign on.
   *
   * @param creatorId - UUID of the creator (FK → creators.id).
   * @param tier - Recruitment tier (1, 2, or 3).
   * @param source - How the creator was sourced.
   * @returns The inserted funnel row (with DB-defaulted id/timestamps).
   * @throws `Error` with `cause` set to the original Postgres error —
   *   e.g. a unique-violation (`23505`) if the creator is already enrolled.
   *
   * @example
   *   const row = await service.recruitCreator(creatorId, 1, 'direct_network');
   */
  async recruitCreator(
    creatorId: string,
    tier: CreatorTier,
    source: CreatorRecruitmentSource,
  ): Promise<CreatorRecruitmentFunnel> {
    try {
      return await db.insert<CreatorRecruitmentFunnel>(TABLE, {
        creator_id: creatorId,
        tier,
        status: "prospect",
        recruitment_source: source,
        signed_date: null,
        performance_score: 0,
      });
    } catch (error) {
      throw new Error(
        `recruitCreator failed for creator ${creatorId}: ${formatError(error)}`,
        { cause: error },
      );
    }
  }

  /**
   * Promote a creator to `active` and stamp `signed_date` with the current
   * UTC timestamp.
   *
   * NOT idempotent on `signed_date` — a repeat call overwrites the previous
   * signing timestamp. Callers who need write-once semantics should check
   * the row first. Week 3+ may move this into a Postgres `COALESCE` once an
   * RPC wrapper lands.
   *
   * @param creatorId - UUID of the creator.
   * @returns The updated funnel row.
   * @throws `Error` with `cause` set to the original Postgres error. If no
   *   row exists, the message is "no recruitment_funnel row for creator …".
   */
  async moveCreatorToActive(
    creatorId: string,
  ): Promise<CreatorRecruitmentFunnel> {
    try {
      return await updateByCreatorId(creatorId, {
        status: "active",
        signed_date: new Date().toISOString(),
      });
    } catch (error) {
      throw new Error(
        `moveCreatorToActive failed for creator ${creatorId}: ${formatError(error)}`,
        { cause: error },
      );
    }
  }

  /**
   * Update a creator's rolling performance score (0..1 decimal).
   *
   * Returns the updated row. No side effects on churn status are performed
   * here — to decide whether the creator should be flagged for churn
   * review, pass the returned row to the exported {@link shouldSuggestChurn}
   * helper (single source of truth, shared with dashboards and cron jobs).
   *
   * @param creatorId - UUID of the creator.
   * @param score - New performance score in `[0, 1]`. Values outside the
   *   range (and non-finite inputs) are clamped.
   * @returns The updated funnel row.
   * @throws `Error` with `cause` set to the original Postgres error. If no
   *   row exists, the message is "no recruitment_funnel row for creator …".
   */
  async updatePerformanceScore(
    creatorId: string,
    score: number,
  ): Promise<CreatorRecruitmentFunnel> {
    try {
      return await updateByCreatorId(creatorId, {
        performance_score: clamp01(score),
      });
    } catch (error) {
      throw new Error(
        `updatePerformanceScore failed for creator ${creatorId}: ${formatError(error)}`,
        { cause: error },
      );
    }
  }

  /**
   * List every creator currently in the given tier, ordered newest-first
   * by `created_at`.
   *
   * Always bounded: `limit` is clamped to {@link MAX_LIST_LIMIT} and
   * defaults to 50. `offset` defaults to 0 and is honored independently of
   * whether the caller specifies `limit`.
   *
   * @param tier - Tier to filter on (1, 2, or 3).
   * @param options - Pagination knobs.
   * @returns Up to `limit` funnel rows; empty array if none match.
   * @throws `Error` wrapping the underlying Postgres error (original
   *   available via `err.cause`).
   */
  async getCreatorsByTier(
    tier: CreatorTier,
    options?: TierListOptions,
  ): Promise<CreatorRecruitmentFunnel[]> {
    try {
      const limit = clampListLimit(options?.limit ?? 50);
      const from = Math.max(0, Math.floor(options?.offset ?? 0));
      const to = from + limit - 1;

      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("tier", tier)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      return (data ?? []) as CreatorRecruitmentFunnel[];
    } catch (error) {
      throw new Error(
        `getCreatorsByTier failed for tier ${tier}: ${formatError(error)}`,
        { cause: error },
      );
    }
  }

  /**
   * Return the top-performing `active` creators (the "activator" cohort).
   *
   * Ordered by `performance_score` descending. Defaults to the top 10 so it
   * fits directly into dashboard leaderboards.
   *
   * @param limit - Max rows to return. Defaults to {@link DEFAULT_LIST_LIMIT}.
   */
  async getActivators(
    limit: number = DEFAULT_LIST_LIMIT,
  ): Promise<CreatorRecruitmentFunnel[]> {
    try {
      const capped = clampListLimit(limit);
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("status", "active")
        .order("performance_score", { ascending: false })
        .limit(capped);

      if (error) throw error;
      return (data ?? []) as CreatorRecruitmentFunnel[];
    } catch (error) {
      throw new Error(`getActivators failed: ${formatError(error)}`, {
        cause: error,
      });
    }
  }

  /**
   * Transition a creator to `churn` status.
   *
   * The optional `reason` is logged as structured data for the Week 2
   * pipeline — the schema does not yet have a `churn_reason` column, so
   * the string is not persisted. Reason is sanitized (control chars
   * stripped, length capped) before logging to avoid log-injection.
   *
   * TODO(week-3, migration-005): persist reason to creator_recruitment_audit.
   *
   * @param creatorId - UUID of the creator.
   * @param reason - Optional free-form reason (logged, not persisted).
   * @returns The updated funnel row.
   * @throws `Error` with `cause` set to the original Postgres error. If no
   *   row exists, the message is "no recruitment_funnel row for creator …".
   */
  async churnCreator(
    creatorId: string,
    reason?: string,
  ): Promise<CreatorRecruitmentFunnel> {
    try {
      const cleaned = reason ? sanitizeForLog(reason).trim() : "";
      if (cleaned) {
        // PII note: log only the first 8 chars of creator_id so the
        // ID stays greppable for a single ops session but doesn't
        // end up in centralized log storage / Sentry indefinitely
        // in plain text.
        console.info("[CreatorRecruitmentService] churn", {
          creatorId: `${creatorId.slice(0, 8)}…`,
          reason: cleaned,
        });
      }
      return await updateByCreatorId(creatorId, { status: "churn" });
    } catch (error) {
      throw new Error(
        `churnCreator failed for creator ${creatorId}: ${formatError(error)}`,
        { cause: error },
      );
    }
  }
}

/**
 * Boundary helper so external code (dashboards, cron jobs, API routes)
 * can compute the same churn-review signal without calling the service.
 * Matches the rule used inside {@link CreatorRecruitmentService.updatePerformanceScore}.
 */
export function shouldSuggestChurn(row: CreatorRecruitmentFunnel): boolean {
  if (!Number.isFinite(row.performance_score)) return false;
  return (
    row.status === "active" && row.performance_score < CHURN_SUGGEST_THRESHOLD
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * The subset of {@link CreatorRecruitmentFunnel} fields this service is
 * allowed to mutate. DB-managed columns (id, creator_id, tier,
 * recruitment_source, created_at, updated_at) are off-limits at the type
 * level so a typo or a stray field can't drift into a write.
 */
type FunnelUpdatePayload = Partial<
  Pick<CreatorRecruitmentFunnel, "status" | "signed_date" | "performance_score">
>;

/**
 * Update the funnel row keyed by `creator_id` (not `id`) and return it.
 * Translates PostgREST's "no rows" code into a clear, actionable message
 * (the PostgrestError default is "JSON object requested, multiple (or no)
 * rows returned" which hides the real cause). Other DB errors pass through
 * unchanged so callers can still inspect Postgres error codes via
 * `err.cause`.
 */
async function updateByCreatorId(
  creatorId: string,
  payload: FunnelUpdatePayload,
): Promise<CreatorRecruitmentFunnel> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("creator_id", creatorId)
    .select()
    .single();

  if (error) {
    if (isPostgrestNoRows(error)) {
      throw new Error(`no recruitment_funnel row for creator ${creatorId}`, {
        cause: error,
      });
    }
    throw error;
  }
  return data as CreatorRecruitmentFunnel;
}

/** Type guard for PostgREST "no rows" errors from `.single()`. */
function isPostgrestNoRows(err: unknown): err is { code: string } {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { code?: string }).code === PGRST_NO_ROWS
  );
}

/**
 * Clamp a number to the inclusive range [0, 1]. Non-finite inputs (NaN,
 * ±Infinity) collapse to 0 so they never hit the DB.
 */
function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

/**
 * Clamp a caller-supplied list limit into [1, MAX_LIST_LIMIT]. Non-finite
 * inputs (NaN, ±Infinity) fall back to a safe default — we'd rather return
 * too few than OOM the process, which is the opposite of what "return
 * MAX_LIST_LIMIT" would do.
 */
function clampListLimit(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_LIST_LIMIT;
  const floored = Math.floor(n);
  if (floored < 1) return 1;
  if (floored > MAX_LIST_LIMIT) return MAX_LIST_LIMIT;
  return floored;
}

/**
 * Sanitize free-form user input before logging: strip control characters
 * (defeats log-injection) and cap length so a malicious caller can't blow
 * up log volumes or centralised log storage. Covers:
 *   - ASCII control chars (`\x00-\x1f`, `\x7f`)
 *   - Unicode line / paragraph separators (`\u2028`, `\u2029`)
 *   - Bidi overrides / isolates (`\u202a-\u202e`, `\u2066-\u2069`) and
 *     invisible format chars (`\u061c`, `\u200e`, `\u200f`) — these enable
 *     Trojan-Source style visual reordering in bidi-aware log viewers.
 */
function sanitizeForLog(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s
    .replace(
      /[\r\n\t\x00-\x1f\x7f\u061c\u200e\u200f\u2028\u2029\u202a-\u202e\u2066-\u2069]/g,
      " ",
    )
    .slice(0, REASON_LOG_MAX_LEN);
}

/** Extract a human-readable message from an unknown thrown value. */
function formatError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}
