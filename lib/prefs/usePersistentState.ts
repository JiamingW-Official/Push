"use client";

import { useEffect, useState } from "react";

/**
 * `useState` that survives reloads via localStorage. Defensive:
 *   - SSR-safe (returns initial during hydration, upgrades on mount)
 *   - JSON parse failure clears the bad entry and falls back to initial
 *   - localStorage failure (private mode) is caught and ignored
 *
 * Pass a `key` namespaced under "push_*" to avoid collisions with the
 * dozens of other localStorage entries the app uses.
 */
export function usePersistentState<T>(
  key: string,
  initial: T,
): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(initial);

  /* Hydrate on mount. Effect fires after first render so SSR HTML and
     first client paint match. */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return;
      try {
        const parsed = JSON.parse(raw) as T;
        setValue(parsed);
      } catch {
        // Bad shape — clear it so we don't keep tripping on the same value.
        localStorage.removeItem(key);
      }
    } catch {
      // localStorage unavailable (private mode etc.) — keep `initial`.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (next: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const v = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      try {
        localStorage.setItem(key, JSON.stringify(v));
      } catch {
        // ignore; in-memory still updates
      }
      return v;
    });
  };

  return [value, set];
}
