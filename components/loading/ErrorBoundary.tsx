"use client";

/**
 * Recoverable error UI for Next.js per-route error boundaries. Each
 * /app/.../error.tsx imports this and passes route-specific copy.
 *
 * The visual treatment follows Design.md:
 *   - Magvix Italic headline ("Something off") matches the editorial
 *     register used for Pulse Strip / Outcome Ladder titles
 *   - Body in Open Sans, ink-3 (var(--graphite))
 *   - Filled Primary "Try again" calls reset() — Next will remount the route
 *   - Ghost "Contact support" links to /settings/help (replaces the older
 *     mailto: pattern; falls back to /creator/help if settings hub is gone)
 *
 * No new colors or radii — purely v12.2 tokens.
 */

import { useEffect } from "react";
import Link from "next/link";
import "./ErrorBoundary.css";

export type ErrorBoundaryProps = {
  /** Next.js boundary props — pass through verbatim. */
  error: Error & { digest?: string };
  reset: () => void;
  /** Magvix Italic headline copy. Default "Something off". */
  title?: string;
  /** Body line under the title. Should be ≤2 sentences. */
  body: string;
  /** Tag string for console.error so logs are greppable per page. */
  scope: string;
};

export function ErrorBoundary({
  error,
  reset,
  title = "Something off",
  body,
  scope,
}: ErrorBoundaryProps) {
  useEffect(() => {
    console.error(`[${scope}]`, error);
  }, [error, scope]);

  return (
    <div className="errb" role="alert" aria-live="assertive">
      <div className="errb__icon" aria-hidden>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            stroke="var(--brand-red, #c1121f)"
            strokeWidth="2"
            strokeLinecap="square"
          />
        </svg>
      </div>

      <h1 className="errb__title">{title}</h1>
      <p className="errb__body">{body}</p>

      {error.digest ? (
        <p className="errb__trace">
          Reference: <code>{error.digest}</code>
        </p>
      ) : null}

      <div className="errb__actions">
        <button
          type="button"
          className="errb__btn errb__btn--primary"
          onClick={reset}
        >
          Try again
        </button>
        <Link href="/settings/help" className="errb__btn errb__btn--ghost">
          Contact support
        </Link>
      </div>
    </div>
  );
}
