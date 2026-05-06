"use client";

/**
 * `withOptimistic` — optimistic SWR mutate helper with rollback + retry toast.
 *
 * Pattern:
 *   1. Caller computes `optimisticData` (the cache shape *as if* the
 *      mutation already succeeded).
 *   2. We call `mutate(key, optimisticData, { revalidate: false })` so the
 *      UI reflects the change immediately.
 *   3. We invoke `mutationFn()` — your wrapper around the API call.
 *   4. On success: re-mutate to revalidate (server is now source of truth).
 *   5. On failure: roll back to `originalData` and surface a toast with
 *      Retry (if retryable) or a static error (if 4xx).
 *
 * Used by /gigs/invites accept/decline, accept-step toggle, /earnings
 * cashout. Each consumer reads its current SWR cache via `currentData`,
 * computes the optimistic projection, and passes both in.
 */

import { mutate as globalMutate } from "swr";
import type { MutationResult } from "./mutations/types";
import type { ToastVariant } from "@/components/toast/Toaster";

export type OptimisticToast = {
  push: (input: {
    variant: ToastVariant;
    title: string;
    body?: string;
    action?: { label: string; onClick: () => void };
    duration?: number | null;
  }) => string;
};

export type OptimisticOpts<T, R> = {
  /** SWR cache key (string OR predicate) — same value SWR's mutate accepts. */
  key: string | ((key: unknown) => boolean);
  /** Current cache contents — used as rollback target if the mutation fails. */
  currentData: T;
  /** Cache contents to display while the mutation is in-flight. */
  optimisticData: T;
  /** Fires the actual API call. */
  mutationFn: () => Promise<MutationResult<R>>;
  /** Toaster handle — pass useToast() return value. */
  toast: OptimisticToast;
  /** Copy for the success/failure UX. */
  copy: {
    /** Surface this on retryable 5xx + network errors. */
    retryFailureTitle: string;
    /** Surface this on 4xx errors (validation, expired, etc.). */
    permanentFailureTitle?: string;
    /** Optional body line under the title. */
    body?: string;
  };
};

export async function withOptimistic<T, R>(
  opts: OptimisticOpts<T, R>,
): Promise<MutationResult<R>> {
  const { key, currentData, optimisticData, mutationFn, toast, copy } = opts;

  // 1. Optimistic paint — UI reflects mutation immediately, no revalidation.
  await globalMutate(key, optimisticData, { revalidate: false });

  // 2. Fire the mutation.
  const result = await mutationFn();

  if (result.ok) {
    // 3. Success — revalidate to align with server canonical state.
    await globalMutate(key);
    return result;
  }

  // 4. Failure — roll back the optimistic paint.
  await globalMutate(key, currentData, { revalidate: false });

  // 5. Toast: retry for retryable, terminal copy for 4xx.
  if (result.error.retryable) {
    toast.push({
      variant: "error",
      title: copy.retryFailureTitle,
      body: copy.body ?? result.error.message,
      action: {
        label: "Retry",
        onClick: () => {
          // Re-fire the optimistic flow. Caller-managed retry — we just
          // re-invoke the original options.
          void withOptimistic(opts);
        },
      },
      duration: 8000,
    });
  } else {
    toast.push({
      variant: "error",
      title: copy.permanentFailureTitle ?? copy.retryFailureTitle,
      body: result.error.message,
      duration: 6000,
    });
  }

  return result;
}
