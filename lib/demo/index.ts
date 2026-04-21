"use client";

// Push centralized demo module (v5.3-EXEC architecture refactor).
//
// Before: `checkDemoMode()` inlined in ~20+ pages, each reading cookies
// directly, no admin / consumer support, no uniform action semantics.
// After: one module. One cookie. One hook. One action wrapper. Every
// page respects the same contract.
//
// Contract:
//   - One cookie: `push-demo-role` ∈ {creator, merchant, admin, consumer}
//   - One enter function that accepts all four audiences.
//   - One exit function that clears the cookie.
//   - One hook that returns the typed role.
//   - One useDemoAction hook that wraps CRUD with fake latency + toast.
//   - One localStorage-backed demoStore for per-audience ephemeral edits.

import { useCallback, useEffect, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DemoAudience = "creator" | "merchant" | "admin" | "consumer";

export const COOKIE_NAME = "push-demo-role";
const COOKIE_TTL_SEC = 60 * 60 * 2; // 2 hours

// Re-export existing demo-data types so old callers still compile.
export type {
  CreatorTier,
  DemoCreator,
  DemoCampaign,
  DemoApplication,
  DemoPayout,
} from "../demo-data";

// ---------------------------------------------------------------------------
// Cookie helpers
// ---------------------------------------------------------------------------

function readCookie(): DemoAudience | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    /push-demo-role=(creator|merchant|admin|consumer)/,
  );
  return (match?.[1] as DemoAudience) ?? null;
}

/**
 * @returns true when in demo mode for ANY audience, or for the specific
 *          audience when passed.
 */
export function isDemoMode(audience?: DemoAudience): boolean {
  const role = readCookie();
  if (role === null) return false;
  if (audience) return role === audience;
  return true;
}

/** Read the current role synchronously from the cookie. Client-only. */
export function getDemoRole(): DemoAudience | null {
  return readCookie();
}

/** Server-side helper — parses any cookie header string. */
export function getDemoRoleFromCookieString(
  cookieHeader: string | null,
): DemoAudience | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(
    /push-demo-role=(creator|merchant|admin|consumer)/,
  );
  return (match?.[1] as DemoAudience) ?? null;
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/**
 * React hook — reactive to cookie changes during the current page lifetime.
 *
 *   const role = useDemoMode();               // DemoAudience | null
 *   const isMerchant = useDemoMode("merchant"); // boolean
 */
export function useDemoMode(): DemoAudience | null;
export function useDemoMode(audience: DemoAudience): boolean;
export function useDemoMode(
  audience?: DemoAudience,
): DemoAudience | null | boolean {
  const [role, setRole] = useState<DemoAudience | null>(null);
  useEffect(() => {
    setRole(readCookie());
  }, []);
  if (audience === undefined) return role;
  return role === audience;
}

/** Clear the demo cookie and navigate to /. Client-only. */
export function exitDemoMode(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
  window.location.assign("/");
}

/**
 * Set the demo cookie and optionally redirect. Accepts all four audiences.
 *
 *   enterDemoMode("admin", "/admin");
 */
export function enterDemoMode(
  audience: DemoAudience,
  redirectTo?: string,
): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=${audience}; path=/; max-age=${COOKIE_TTL_SEC}`;
  if (redirectTo) window.location.assign(redirectTo);
}

// ---------------------------------------------------------------------------
// useDemoAction — wrap any async CRUD with demo-aware optimistic UI
// ---------------------------------------------------------------------------

export interface DemoActionOptions<T> {
  /** Called only when NOT in demo mode. Must return the real result. */
  real: () => Promise<T>;
  /** Called only when in demo mode. Defaults to resolving `undefined`. */
  simulated?: () => Promise<T | undefined>;
  /** Optional success toast text shown in demo mode. Defaults to "Saved (demo)". */
  successToast?: string;
  /** Optional failure toast text shown when `real()` throws. */
  errorToast?: string;
  /** Fake latency in ms for the demo path. Defaults to 600ms. */
  fakeLatencyMs?: number;
}

export interface DemoActionState {
  running: boolean;
  lastError: string | null;
  lastSuccessAt: number | null;
}

/**
 * Hook that returns a stable `run` callback + a state object. In demo mode:
 *   - never calls `real()`
 *   - waits `fakeLatencyMs` then resolves with whatever `simulated?()` returns
 *   - emits a single window-level toast event the DemoBanner listens for
 *
 * In real mode:
 *   - calls `real()`
 *   - propagates errors via `lastError`
 *
 * Callers should use this everywhere a write operation happens so the demo
 * user never experiences "silent nothing" when a button does nothing.
 */
export function useDemoAction<T>(opts: DemoActionOptions<T>) {
  const [running, setRunning] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastSuccessAt, setLastSuccessAt] = useState<number | null>(null);

  const run = useCallback(async (): Promise<T | undefined> => {
    setRunning(true);
    setLastError(null);
    try {
      if (isDemoMode()) {
        await sleep(opts.fakeLatencyMs ?? 600);
        const result = opts.simulated ? await opts.simulated() : undefined;
        emitToast(opts.successToast ?? "Saved (demo)", "success");
        setLastSuccessAt(Date.now());
        return result;
      }
      const result = await opts.real();
      setLastSuccessAt(Date.now());
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setLastError(msg);
      emitToast(opts.errorToast ?? msg, "error");
      throw err;
    } finally {
      setRunning(false);
    }
  }, [opts]);

  const state: DemoActionState = { running, lastError, lastSuccessAt };
  return [run, state] as const;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ---------------------------------------------------------------------------
// Toast — lightweight DOM event. The DemoBanner listens and renders.
// ---------------------------------------------------------------------------

export type ToastKind = "success" | "error" | "info";

export interface DemoToastDetail {
  id: string;
  kind: ToastKind;
  text: string;
  ts: number;
}

export const TOAST_EVENT = "push:demo-toast";

export function emitToast(text: string, kind: ToastKind = "info"): void {
  if (typeof window === "undefined") return;
  const detail: DemoToastDetail = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    kind,
    text,
    ts: Date.now(),
  };
  window.dispatchEvent(
    new CustomEvent<DemoToastDetail>(TOAST_EVENT, { detail }),
  );
}

// ---------------------------------------------------------------------------
// demoStore — localStorage-backed ephemeral "save" for CRUD in demo
// ---------------------------------------------------------------------------

const STORE_PREFIX = "push-demo-store:";

export const demoStore = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(STORE_PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORE_PREFIX + key, JSON.stringify(value));
    } catch {
      // quota / private mode — silently ignore; in-memory state still works
    }
  },
  remove(key: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORE_PREFIX + key);
  },
};
