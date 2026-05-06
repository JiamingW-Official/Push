"use client";

import { SWRConfig } from "swr";
import type { ReactNode } from "react";
import { fetcher } from "./fetcher";

/**
 * Workspace-scoped SWR provider. Goes inside /creator/(workspace)/layout.tsx
 * so all pages under it share one cache + fetch policy.
 *
 * Defaults chosen for the creator surface:
 *   - revalidateOnFocus: true — coming back to the tab should show fresh data
 *   - revalidateIfStale: true — first visit always re-checks against server
 *   - keepPreviousData: true — when SWR refetches, keep the old payload
 *     visible until the new one arrives (no flash to skeleton on revalidate)
 *   - errorRetryCount: 2 — fail fast; the per-page error.tsx (prompt 2) takes over
 *   - shouldRetryOnError: only on 5xx and network — don't hammer the API on 4xx
 */
export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: true,
        revalidateIfStale: true,
        keepPreviousData: true,
        errorRetryCount: 2,
        shouldRetryOnError: (err) => {
          // FetchError carries `.status`; non-FetchError (network) → retry.
          const status = (err as { status?: number } | null)?.status;
          if (status == null) return true;
          return status >= 500;
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
