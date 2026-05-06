"use client";

/**
 * Reusable skeleton placeholders for the creator workspace. Three shapes
 * matching the v12.2 component grid:
 *   - <SkeletonRow>   — full-width row (avatar + 2-line text + meta)
 *                       matches .inv-row in /gigs/invites
 *   - <SkeletonCard>  — card with image-tile + 4 text rows
 *                       matches .gav-card in /gigs/active and /gigs/history
 *   - <SkeletonPanel> — sticky detail panel, 6 sections vertical
 *                       matches .giv-detail
 *
 * All shapes render the shimmer via the shared `.skel-shimmer` class so
 * the animation timeline runs once across the page (prevents 50 separate
 * keyframes when many skeletons mount). prefers-reduced-motion skips the
 * shimmer entirely; the surface stays a flat tone.
 */

import "./Skeleton.css";

type Props = {
  /** How many copies to render. Default 1. Used by list skeletons. */
  count?: number;
  /** Optional className for layout overrides (grid-area, margin, etc.) */
  className?: string;
};

export function SkeletonRow({ count = 1, className }: Props) {
  return (
    <div
      className={["skel-row-stack", className].filter(Boolean).join(" ")}
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skel-row" role="presentation">
          <div className="skel-row__avatar skel-shimmer" />
          <div className="skel-row__body">
            <div className="skel-row__title skel-shimmer" />
            <div className="skel-row__meta skel-shimmer" />
          </div>
          <div className="skel-row__action skel-shimmer" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard({ count = 1, className }: Props) {
  return (
    <div
      className={["skel-card-stack", className].filter(Boolean).join(" ")}
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skel-card" role="presentation">
          <div className="skel-card__strip skel-shimmer" />
          <div className="skel-card__head">
            <div className="skel-card__monogram skel-shimmer" />
            <div className="skel-card__head-text">
              <div className="skel-card__brand skel-shimmer" />
              <div className="skel-card__campaign skel-shimmer" />
            </div>
          </div>
          <div className="skel-card__row skel-shimmer" />
          <div className="skel-card__row skel-shimmer" />
          <div className="skel-card__phase skel-shimmer" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonPanel({ className }: Props) {
  return (
    <div
      className={["skel-panel", className].filter(Boolean).join(" ")}
      aria-busy="true"
      aria-live="polite"
      role="presentation"
    >
      <div className="skel-panel__accent skel-shimmer" />
      <div className="skel-panel__eyebrow skel-shimmer" />
      <div className="skel-panel__title skel-shimmer" />
      <div className="skel-panel__sub skel-shimmer" />

      <div className="skel-panel__quick">
        <div className="skel-panel__stat skel-shimmer" />
        <div className="skel-panel__stat skel-shimmer" />
        <div className="skel-panel__stat skel-shimmer" />
      </div>

      <div className="skel-panel__section">
        <div className="skel-panel__row skel-shimmer" />
        <div className="skel-panel__row skel-shimmer" />
        <div className="skel-panel__row skel-shimmer" />
      </div>

      <div className="skel-panel__section">
        <div className="skel-panel__row skel-shimmer" />
        <div className="skel-panel__row skel-shimmer" />
      </div>

      <div className="skel-panel__cta skel-shimmer" />
    </div>
  );
}
