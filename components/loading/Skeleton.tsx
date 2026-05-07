"use client";

/**
 * Skeleton primitives for loading boundaries (loading.tsx) and inline
 * client-side loading states. Single-source for shimmer + atom shapes.
 *
 * Atoms (Wave-7B addition):
 *   - <SkeletonLine width height radius />     single line of text
 *   - <SkeletonHeading lines />                 2-3 lines, larger
 *   - <SkeletonCircle size />                   round (avatar / badge)
 *   - <SkeletonCard padding heightHint />       full card placeholder
 *   - <SkeletonTable rows cols />               table N rows × M cols
 *   - <SkeletonKPIGrid count />                 KPI tile grid (3 or 4)
 *
 * Legacy shapes kept for /creator workspace skeletons:
 *   - <SkeletonRow>      list-style row
 *   - <SkeletonCardLegacy> gigs card (renamed; old <SkeletonCard> name now
 *                          maps to the new generic atom — see below)
 *   - <SkeletonPanel>    sticky detail panel
 *
 * Backwards compatibility:
 *   The old `<SkeletonCard count={N} />` was a gigs-specific 4-row card.
 *   To avoid breaking the creator workspace, the legacy export is kept as
 *   `SkeletonCardLegacy` AND aliased on the old name when no `padding`
 *   prop is provided (count-based call). New callers use the generic
 *   atom signature with `padding` / `heightHint` / `children`.
 *
 * All atoms render shimmer via the shared `.skel-shimmer` class so the
 * keyframes timeline is shared across the page.  prefers-reduced-motion
 * skips shimmer entirely (CSS).  Each top-level group can carry an
 * `aria-label` so screen readers hear "Loading dashboard" etc.
 */

import "./Skeleton.css";

/* ───────── Atoms ───────── */

type LineProps = {
  width?: number | string;
  height?: number;
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
};

export function SkeletonLine({
  width = "100%",
  height = 16,
  radius = 4,
  className,
  style,
}: LineProps) {
  return (
    <div
      className={["skel-shimmer", "skel-line", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: `${height}px`,
        borderRadius: `${radius}px`,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

type HeadingProps = {
  lines?: 2 | 3;
  className?: string;
};

export function SkeletonHeading({ lines = 2, className }: HeadingProps) {
  const widths = lines === 3 ? ["68%", "92%", "44%"] : ["72%", "52%"];
  return (
    <div
      className={["skel-heading", className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      {widths.map((w, i) => (
        <div
          key={i}
          className="skel-shimmer skel-heading__line"
          style={{ width: w, animationDelay: `${i * 60}ms` }}
        />
      ))}
    </div>
  );
}

type CircleProps = {
  size?: number;
  className?: string;
};

export function SkeletonCircle({ size = 40, className }: CircleProps) {
  return (
    <div
      className={["skel-shimmer", "skel-circle", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      aria-hidden="true"
    />
  );
}

type CardProps = {
  /** Legacy: render N gigs-style cards (creator workspace). When set,
   *  all generic-atom props are ignored and the legacy shape renders. */
  count?: number;
  /** Padding inside the card. Default 24. */
  padding?: number;
  /** Approximate min-height. Default 160. */
  heightHint?: number;
  /** Border radius. Default 24 to match liquid-glass cards. */
  radius?: number;
  className?: string;
  /** Custom shimmer stack. Falls back to a default 3-line composition. */
  children?: React.ReactNode;
  /** Reveal stagger index — 60ms per step (matches anim.css). */
  delayIndex?: number;
};

export function SkeletonCard({
  count,
  padding = 24,
  heightHint = 160,
  radius = 24,
  className,
  children,
  delayIndex = 0,
}: CardProps) {
  // Legacy gigs-card stack — preserved for /creator workspace pages.
  if (typeof count === "number") {
    return <SkeletonCardLegacy count={count} className={className} />;
  }
  return (
    <div
      className={["skel-card-shell", className].filter(Boolean).join(" ")}
      style={{
        padding: `${padding}px`,
        minHeight: `${heightHint}px`,
        borderRadius: `${radius}px`,
        animationDelay: `${delayIndex * 60}ms`,
      }}
      aria-hidden="true"
    >
      {children ?? (
        <>
          <SkeletonLine width="60%" height={18} />
          <SkeletonLine width="92%" height={14} />
          <SkeletonLine width="74%" height={14} />
        </>
      )}
    </div>
  );
}

type TableProps = {
  rows?: number;
  cols?: number;
  className?: string;
  /** Header? Defaults true. */
  header?: boolean;
};

export function SkeletonTable({
  rows = 6,
  cols = 4,
  className,
  header = true,
}: TableProps) {
  return (
    <div
      className={["skel-table", className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      {header && (
        <div
          className="skel-table__row skel-table__row--head"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className="skel-shimmer skel-table__cell"
              style={{ height: 12, width: c === 0 ? "60%" : "40%" }}
            />
          ))}
        </div>
      )}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="skel-table__row"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            animationDelay: `${r * 60}ms`,
          }}
        >
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className="skel-shimmer skel-table__cell"
              style={{
                height: 14,
                width: c === 0 ? "78%" : c === cols - 1 ? "44%" : "62%",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

type KPIGridProps = {
  count?: 3 | 4;
  className?: string;
};

export function SkeletonKPIGrid({ count = 4, className }: KPIGridProps) {
  return (
    <div
      className={[
        "skel-kpi-grid",
        count === 3 ? "skel-kpi-grid--3" : "skel-kpi-grid--4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skel-kpi-tile"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="skel-shimmer skel-kpi-tile__label" />
          <div className="skel-shimmer skel-kpi-tile__value" />
          <div className="skel-shimmer skel-kpi-tile__delta" />
        </div>
      ))}
    </div>
  );
}

/* ───────── Group wrapper (announces to SR) ───────── */

type GroupProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

export function SkeletonGroup({ label, children, className }: GroupProps) {
  return (
    <div
      className={["skel-group", className].filter(Boolean).join(" ")}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={`Loading ${label}`}
    >
      {children}
    </div>
  );
}

/* ───────── Legacy shapes (creator workspace) ───────── */

type LegacyProps = {
  count?: number;
  className?: string;
};

export function SkeletonRow({ count = 1, className }: LegacyProps) {
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

export function SkeletonCardLegacy({ count = 1, className }: LegacyProps) {
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

export function SkeletonPanel({ className }: LegacyProps) {
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
