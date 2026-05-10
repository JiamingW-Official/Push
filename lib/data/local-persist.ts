"use client";

/* ============================================================
   local-persist.ts — localStorage hydration for demo stores
   v1 · 2026-05-10

   Bridges the in-memory live-* stores to localStorage so demo
   data survives page refreshes. Used by:
     - lib/data/live-campaigns.ts   → push-demo:campaigns
     - lib/data/live-applications.ts → push-demo:applications

   SSR-safe (typeof window check). Falls back to in-memory if
   localStorage is unavailable (private browsing, quota exceeded,
   storage disabled by user).

   Demo reset:
     - Visit /?reset=1 once → all push-demo:* keys cleared
     - Or call clearAll() from the browser console

   Schema versioning: every persisted blob is wrapped in a
   { v, data } envelope. If we change the underlying type shape
   we bump the version + ignore stale blobs gracefully.
   ============================================================ */

const KEY_PREFIX = "push-demo:";
const SCHEMA_VERSION = 1;

interface Envelope<T> {
  v: number;
  data: T;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/** Read the persisted value for a key, or return the fallback if
 *  nothing's stored yet (or the schema version doesn't match). */
export function hydrate<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(KEY_PREFIX + key);
    if (raw === null) return fallback;
    const env = JSON.parse(raw) as Envelope<T>;
    if (!env || typeof env !== "object" || env.v !== SCHEMA_VERSION) {
      // Schema bump — drop the stale blob.
      return fallback;
    }
    return env.data;
  } catch {
    return fallback;
  }
}

/** Write the value back to localStorage. Silent no-op if storage
 *  is full / blocked — production never relies on this layer for
 *  durability. */
export function persist<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    const env: Envelope<T> = { v: SCHEMA_VERSION, data: value };
    window.localStorage.setItem(KEY_PREFIX + key, JSON.stringify(env));
  } catch {
    // Quota exceeded or storage disabled. The in-memory store
    // continues to work for the current session.
  }
}

/** Remove all demo data — used by the ?reset=1 URL handler and
 *  the dev console. */
export function clearAll(): void {
  if (!isBrowser()) return;
  const keys: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(KEY_PREFIX)) keys.push(k);
  }
  for (const k of keys) window.localStorage.removeItem(k);
}

/** Auto-handle the `?reset=1` query param. Call from a top-level
 *  client effect (e.g. workspace layout). Strips the param after
 *  clearing so subsequent navigation doesn't re-trigger. */
export function handleResetParam(): boolean {
  if (!isBrowser()) return false;
  const url = new URL(window.location.href);
  if (url.searchParams.get("reset") !== "1") return false;
  clearAll();
  url.searchParams.delete("reset");
  window.history.replaceState(null, "", url.toString());
  return true;
}
