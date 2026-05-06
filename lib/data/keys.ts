/**
 * Typed cache keys for SWR. Each function returns the URL string SWR uses
 * as both the cache key AND the input to /lib/data/fetcher.ts. Centralizing
 * here means:
 *   - One file shows every API surface the creator workspace consumes
 *   - Renaming a query param doesn't scatter `useSWR("/api/...")` calls
 *   - mutate() callers can re-derive the same key without typo risk
 *
 * Convention: each key fn is pure — no side effects, deterministic given
 * its args. Returns null when args are not yet ready (SWR skips fetch).
 */

/** Today briefing — invites + threads + notifications + attribution roll-up. */
export function todayKey(): string {
  return "/api/creator/today";
}

/**
 * Invites list. Defaults to pending, sorted by matchScore desc.
 * Pass `null` to skip fetch (not used today, reserved for conditional loads).
 */
export function invitesKey(opts?: {
  status?: "pending" | "accepted" | "declined" | "all";
  sort?: "match" | "newest" | "expiring";
}): string {
  const params = new URLSearchParams();
  if (opts?.status && opts.status !== "all") params.set("status", opts.status);
  if (opts?.sort) params.set("sort", opts.sort);
  const qs = params.toString();
  return qs ? `/api/creator/invites?${qs}` : "/api/creator/invites";
}

/** Earnings — summary + balances + active milestones + recent transactions. */
export function earningsKey(): string {
  return "/api/creator/earnings";
}

/** Active gigs (accepted invites with shoot/post/verify/paid phases). */
export function activeGigsKey(): string {
  return "/api/creator/gigs/active";
}

/** History (completed + paid + declined gigs). */
export function historyGigsKey(opts?: { year?: number }): string {
  if (opts?.year) return `/api/creator/gigs/history?year=${opts.year}`;
  return "/api/creator/gigs/history";
}

/** Per-campaign live scan counts (extended in prompt 3 with Realtime). */
export function campaignScansKey(campaignId: string | null): string | null {
  if (!campaignId) return null;
  return `/api/creator/campaigns/${campaignId}/scans`;
}

/** Notification feed (extended in prompt 4). */
export function notificationsKey(): string {
  return "/api/creator/notifications";
}
