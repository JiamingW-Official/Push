// Push Platform — Demo Mock Store
// Namespaced localStorage R/W for demo data.
// All keys are prefixed with `push-demo-` to avoid collisions.
// SSR-safe: functions guard on `typeof window`. The React hook moved to
// `./mock-store-hook.ts` (client-only) to keep this file importable from
// Server Components.

const NS = "push-demo-";

function key(k: string): string {
  return `${NS}${k}`;
}

function read<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key(k));
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(k: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key(k), JSON.stringify(value));
  } catch {
    // localStorage may be unavailable in private browsing
  }
}

function remove(k: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key(k));
}

function clear(): void {
  if (typeof window === "undefined") return;
  const keysToDelete: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k?.startsWith(NS)) keysToDelete.push(k);
  }
  keysToDelete.forEach((k) => window.localStorage.removeItem(k));
}

export const mockStore = { read, write, remove, clear };
