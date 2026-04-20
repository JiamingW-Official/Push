"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MOCK_CREATORS,
  MOCK_METRICS,
  MOCK_REPORTS,
} from "./useAdminMetrics.mocks";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AdminMetrics {
  merchants_count: number;
  creators_count: number;
  weekly_transactions: number;
  average_roi: number;
}

export interface Creator {
  id: string;
  tier: 1 | 2 | 3;
  status: "prospect" | "early_operator" | "active" | "churn";
  performance_score: number;
  recruitment_source: string;
  signed_date: string;
}

export interface Report {
  week_start: string;
  merchant_id: string;
  merchant_name: string;
  verified_customers: number;
  revenue: number;
  roi: number;
}

/** Per-domain error map. Each key holds the most recent failure (or null
 *  on success). The shape is intentionally flat so consumers can render
 *  section-level alerts without string parsing. */
export interface AdminErrors {
  metrics: string | null;
  creators: string | null;
  reports: string | null;
}

export interface UseAdminMetricsReturn {
  metrics: AdminMetrics | null;
  creators: Creator[];
  reports: Report[];
  /** True while any of the three endpoints is in flight — whether it's
   *  the first mount fetch or a later refresh. Equivalent to
   *  `isInitialLoading || isRefreshing`. */
  isLoading: boolean;
  /** True only before the first fetch has resolved (success OR fallback).
   *  Use this for full-page skeletons; use `isRefreshing` for quieter
   *  spinners during subsequent polls. The two flags are mutually
   *  exclusive (both false in steady state; never true at the same time). */
  isInitialLoading: boolean;
  /** True on refetches after the first load. Stays false on initial load. */
  isRefreshing: boolean;
  /** Flat summary for backward-compat callers — comma-separated list of
   *  failed domain names (e.g. `"metrics, creators"`), or `null` when all
   *  endpoints returned cleanly. Intentionally contains NO raw server
   *  error text so the DOM stays free of injected strings. */
  error: string | null;
  /** Per-domain failure messages keyed by section, or `null` per-domain on
   *  success. Callers can read this to render section-scoped banners
   *  ("Creator API offline — showing mock data"); the default consumer
   *  only needs `error`. */
  errors: AdminErrors;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const REFRESH_INTERVAL_MS = 30_000;

/**
 * Admin-scoped endpoints. Batch D moved this hook off
 * `/api/merchant/dashboard?merchant_id=admin` (IDOR-shaped, fixed in
 * Batch A) and off `/api/internal/recruitment-sync` (locked behind a
 * server-to-server secret in Batch A). All three endpoints now require
 * an admin session via `requireAdminSession()` on the server, and
 * unwrap `{ data, ... }` via the shared `success()` envelope.
 */
const METRICS_ENDPOINT = "/api/admin/dashboard";
const CREATORS_ENDPOINT = "/api/admin/creators?limit=20";
const REPORTS_ENDPOINT = "/api/admin/reports/weekly?limit=5";

const NO_ERRORS: AdminErrors = { metrics: null, creators: null, reports: null };

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Fetches admin-dashboard data every 30s with graceful per-endpoint fallback
 * to the Session 3-3 mock payload (see `./useAdminMetrics.mocks.ts`).
 * Each of the three endpoints is fetched in parallel via
 * `Promise.allSettled` — one failure cannot starve the other two.
 *
 * Safety features:
 *   - `inFlightRef` prevents overlapping fetches when the refresh button is
 *     spammed or the interval fires mid-flight (state-based guards have
 *     commit-lag; a ref is synchronous).
 *   - Polling pauses when `document.visibilityState !== "visible"` so a
 *     backgrounded tab doesn't burn bandwidth.
 *   - A manual `refetch()` resets the 30s timer so the next scheduled fetch
 *     is a full interval away, not possibly ~1s later.
 *   - `mountedRef` guards every setState after the await boundary.
 *
 * Returned `refetch()` triggers an immediate manual refresh; the user can
 * wire it to a button without dealing with the interval.
 */
export function useAdminMetrics(): UseAdminMetricsReturn {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errors, setErrors] = useState<AdminErrors>(NO_ERRORS);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Refs tracked outside React state so they're read synchronously.
  const mountedRef = useRef(true);
  const inFlightRef = useRef(false);
  const hasLoadedRef = useRef(false);
  const intervalRef = useRef<number | null>(null);

  const fetchMetrics = useCallback(async (): Promise<void> => {
    if (!mountedRef.current || inFlightRef.current) return;
    inFlightRef.current = true;

    if (hasLoadedRef.current) {
      setIsRefreshing(true);
    }

    try {
      // All three endpoints now wrap their payloads in the shared
      // `success()` envelope `{ data, timestamp, ... }`, so we read
      // `.data` on the metrics path too (previously it returned the
      // metrics object directly).
      const [metricsResult, creatorsResult, reportsResult] =
        await Promise.allSettled([
          fetchJson<{ data: AdminMetrics }>(METRICS_ENDPOINT),
          fetchJson<{ data: Creator[] }>(CREATORS_ENDPOINT),
          fetchJson<{ data: Report[] }>(REPORTS_ENDPOINT),
        ]);

      if (!mountedRef.current) return;

      const nextErrors: AdminErrors = {
        metrics: null,
        creators: null,
        reports: null,
      };

      if (metricsResult.status === "fulfilled") {
        setMetrics(metricsResult.value.data);
      } else {
        setMetrics(MOCK_METRICS);
        nextErrors.metrics = toErrorMessage(metricsResult.reason);
      }

      if (creatorsResult.status === "fulfilled") {
        const rows = creatorsResult.value.data;
        setCreators(
          Array.isArray(rows) && rows.length > 0 ? rows : MOCK_CREATORS,
        );
      } else {
        setCreators(MOCK_CREATORS);
        nextErrors.creators = toErrorMessage(creatorsResult.reason);
      }

      if (reportsResult.status === "fulfilled") {
        const rows = reportsResult.value.data;
        setReports(
          Array.isArray(rows) && rows.length > 0 ? rows : MOCK_REPORTS,
        );
      } else {
        setReports(MOCK_REPORTS);
        nextErrors.reports = toErrorMessage(reportsResult.reason);
      }

      // Reuse the NO_ERRORS sentinel when nothing failed — keeps the
      // object identity stable across successful polls so consumers
      // reading `errors` don't re-render every 30 s for no reason.
      const anyFailure =
        nextErrors.metrics !== null ||
        nextErrors.creators !== null ||
        nextErrors.reports !== null;
      setErrors(anyFailure ? nextErrors : NO_ERRORS);
      setLastUpdated(new Date());
    } finally {
      hasLoadedRef.current = true;
      if (mountedRef.current) {
        setIsInitialLoading(false);
        setIsRefreshing(false);
      }
      inFlightRef.current = false;
    }
  }, []);

  // Reschedule the polling interval. Called on mount and after each manual
  // refetch so the next auto-fetch is always a full window away.
  const schedule = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void fetchMetrics();
      }
    }, REFRESH_INTERVAL_MS);
  }, [fetchMetrics]);

  // Stable wrapper so the consumer's refetch reference never changes and
  // clicking it resets the timer.
  const refetch = useCallback(async (): Promise<void> => {
    await fetchMetrics();
    schedule();
  }, [fetchMetrics, schedule]);

  useEffect(() => {
    mountedRef.current = true;
    // Reset the "already-loaded" ref so React 18 StrictMode's
    // mount→unmount→mount double-invoke doesn't skip the initial-loading
    // state on the second mount. Refs persist across unmounts otherwise.
    hasLoadedRef.current = false;

    // Immediate fetch on mount, then start the interval.
    void fetchMetrics();
    schedule();

    // Refresh the moment the tab becomes visible again — gives the user
    // fresh data without waiting up to 30 s. We also re-`schedule()` so
    // the next auto-fetch is a full window away, avoiding a tight
    // "visibility-fetch + 1 s later scheduled-fetch" double hit.
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void fetchMetrics();
        schedule();
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      mountedRef.current = false;
      document.removeEventListener("visibilitychange", onVisible);
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchMetrics, schedule]);

  // Flat error summary — lists only the failed domain names, never raw
  // error messages, so the DOM stays free of server-derived strings.
  const failedDomains = (
    Object.keys(errors) as Array<keyof AdminErrors>
  ).filter((k) => errors[k] !== null);
  const error = failedDomains.length > 0 ? failedDomains.join(", ") : null;
  const isLoading = isInitialLoading || isRefreshing;

  return {
    metrics,
    creators,
    reports,
    isLoading,
    isInitialLoading,
    isRefreshing,
    error,
    errors,
    lastUpdated,
    refetch,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** GET + parse JSON; throws on network error or non-2xx so the caller can
 *  decide whether to fall back to a mock. `no-store` opts out of Next's
 *  route-level dedupe — the admin dashboard wants fresh data on every tick. */
async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

/** Coerce a Promise.allSettled rejection reason into a short, non-sensitive
 *  message for logs. The UI never reads this directly — `useAdminMetrics`
 *  surfaces only domain names. Kept for debug and telemetry hooks. */
function toErrorMessage(reason: unknown): string {
  if (reason instanceof Error) return reason.message;
  if (typeof reason === "string") return reason;
  return String(reason);
}
