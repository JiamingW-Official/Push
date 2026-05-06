"use client";

/**
 * <KpiBlock> — eyebrow + numeral + delta. Audit § 1 found this
 * pattern repeated 5× (today, earnings, analytics, leaderboard,
 * pulse-strip). One canonical implementation.
 *
 * Composition:
 *   ┌──────────────────────────────────┐
 *   │ EYEBROW · context                │
 *   │ $4,827                           │
 *   │ ↑ $245 vs last month             │
 *   └──────────────────────────────────┘
 */

import "./KpiBlock.css";

type Props = {
  /** Mono uppercase eyebrow. */
  eyebrow: string;
  /** The big numeral. Pre-formatted by caller — we don't intl. */
  value: string;
  /** Optional currency prefix (rendered smaller). */
  currency?: string;
  /** Optional delta line. */
  delta?: {
    direction: "up" | "down" | "flat";
    label: string;
  };
  /** Tonal accent. Default ink. */
  tone?: "ink" | "blue" | "red" | "champagne";
  /** Render compactly (smaller numeral) — used inside Pulse Strips. */
  compact?: boolean;
};

export function KpiBlock({
  eyebrow,
  value,
  currency,
  delta,
  tone = "ink",
  compact = false,
}: Props) {
  return (
    <div className={`kpb kpb--tone-${tone}${compact ? " kpb--compact" : ""}`}>
      <span className="kpb__eyebrow">{eyebrow}</span>
      <div className="kpb__numeral">
        {currency ? <span className="kpb__currency">{currency}</span> : null}
        <span className="kpb__value">{value}</span>
      </div>
      {delta ? (
        <span className={`kpb__delta kpb__delta--${delta.direction}`}>
          {delta.direction === "up"
            ? "↑"
            : delta.direction === "down"
              ? "↓"
              : "→"}{" "}
          {delta.label}
        </span>
      ) : null}
    </div>
  );
}
