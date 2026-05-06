"use client";

/**
 * <StatusPill> — state-machine badge. Replaces 4× duplicate
 * implementations (gigs/active phase / pipeline / earnings / drafts).
 * One canonical visual + token mapping for every phase / status /
 * lifecycle stage in the product.
 *
 * Tone is set by `variant`:
 *   - "neutral"  warm gray (default; for "draft", "queued", etc.)
 *   - "blue"     N2W blue ("posted", "in flight", "processing")
 *   - "green"    sage ("paid", "verified", "complete")
 *   - "amber"    champagne ("pending review", "awaiting")
 *   - "red"      brand red ("declined", "expired", "failed")
 *   - "ink"      ink fill ("active", "live", "primary state")
 */

import "./StatusPill.css";

export type StatusVariant =
  | "neutral"
  | "blue"
  | "green"
  | "amber"
  | "red"
  | "ink";

type Props = {
  label: string;
  variant?: StatusVariant;
  /** Optional dot prefix (status indicator dot). */
  dot?: boolean;
  /** Optional aria-label override (defaults to label). */
  ariaLabel?: string;
};

export function StatusPill({
  label,
  variant = "neutral",
  dot = false,
  ariaLabel,
}: Props) {
  return (
    <span
      className={`stp stp--${variant}${dot ? " stp--has-dot" : ""}`}
      role="status"
      aria-label={ariaLabel ?? label}
    >
      {dot ? <span className="stp__dot" aria-hidden /> : null}
      {label}
    </span>
  );
}
