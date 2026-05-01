"use client";

import { useCallback, useEffect, useState } from "react";
import { mockStore } from "./mock-store";

/**
 * useMockData<T>(key, defaultValue)
 *
 * Reads/writes a namespaced localStorage entry via `mockStore`.
 * Returns [value, setValue] — safe for SSR (returns defaultValue on server
 * until after mount hydration).
 */
export function useMockData<T>(
  storeKey: string,
  defaultValue: T,
): [T, (next: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    setValue(mockStore.read<T>(storeKey, defaultValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeKey]);

  const set = useCallback(
    (next: T) => {
      mockStore.write(storeKey, next);
      setValue(next);
    },
    [storeKey],
  );

  return [value, set];
}
