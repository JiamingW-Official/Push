"use client";
import { useEffect, useState } from "react";

/**
 * SSR-safe live clock. Returns null on first paint so server and
 * client hydration markup match, then refreshes on the given
 * interval after mount.
 *
 * Use anywhere a render decision depends on Date.now() — countdowns,
 * urgent filters, deadline labels. Pair with suppressHydrationWarning
 * on cosmetic time strings; pair with `now == null ? fallback : real`
 * guards on layout-affecting decisions.
 */
export function useNow(intervalMs = 60_000): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
