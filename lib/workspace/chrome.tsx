"use client";

/* ============================================================
   Workspace chrome — shared UI primitives for any creator
   workspace page (Inbox, Discover, Campaigns, Wallet, etc.).

   Lives at workspace level — not inbox — so other pages share
   the same visual rhythm without each one re-writing the same
   "title + sub + actions" header / "icon + body" empty state /
   "pill capsule" filter row.

   These are pure UI — no data fetching, no context dependency.
   They render `.cw-*` classes defined in the workspace shell
   CSS (components/creator/workspace/lumin-cards.css).
   ============================================================ */

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";

/* ── PaneHeader ──────────────────────────────────────────────
   Sticky title strip at the top of every working pane.
   Title (Darky 22px 800) + Sub (Mono 11px 700 0.10em uppercase)
   on the left, optional action cluster on the right.
   ────────────────────────────────────────────────────────── */

export type PaneHeaderProps = {
  title: string;
  /** Sub-line. String renders with the unified mono caption style;
   *  ReactNode lets you inject bold/colored counts inline. */
  sub?: ReactNode;
  /** Right-side cluster — buttons, batch CTA, etc. */
  actions?: ReactNode;
  /** When true, render with no margin offset — useful when the
   *  parent already provides flush padding (e.g. msg-list-pane). */
  flush?: boolean;
};

export function PaneHeader({ title, sub, actions, flush }: PaneHeaderProps) {
  /* Self-managed scroll detection — when the parent's scroll
     position passes the natural-flow position of the header, this
     toggles `data-scrolled="true"` so the matching CSS rule (in
     lumin-cards.css) layers on a soft ambient drop shadow. */
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* 1px sentinel before the sticky header. When sentinel exits
          viewport upward (parent scrolled past), header is "stuck". */}
      <div
        ref={sentinelRef}
        aria-hidden
        style={{ height: 1, marginBottom: -1 }}
      />
      <header
        className={`cw-pane-header${flush ? " cw-pane-header--flush" : ""}`}
        data-scrolled={scrolled || undefined}
      >
        <div className="cw-pane-header-left">
          <h2 className="cw-pane-title">{title}</h2>
          {sub != null && (
            <p className="cw-pane-sub" aria-live="polite">
              {sub}
            </p>
          )}
        </div>
        {actions != null && <div className="cw-pane-actions">{actions}</div>}
      </header>
    </>
  );
}

/** Helper: small numeric badge used in PaneHeader sub-lines.
 *  Renders the count in brand-red Darky, with a label after it. */
export function PaneSubCount({
  count,
  label,
}: {
  count: number;
  label: string;
}) {
  return (
    <>
      <span className="cw-pane-sub-num">{count}</span>{" "}
      <strong>{label}</strong>
    </>
  );
}

/* ── EmptyState ──────────────────────────────────────────────
   Centered icon + Darky title + mono body + optional Filled
   Ink CTA. Used by every "nothing here" surface.
   ────────────────────────────────────────────────────────── */

export type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  body?: string;
  cta?: { label: string; href: string };
};

export function EmptyState({ icon, title, body, cta }: EmptyStateProps) {
  return (
    <div className="cw-state">
      {icon && (
        <span className="cw-state-icon" aria-hidden>
          {icon}
        </span>
      )}
      <p className="cw-state-title">{title}</p>
      {body && <p className="cw-state-body">{body}</p>}
      {cta && (
        <Link href={cta.href} className="cw-state-cta">
          {cta.label} →
        </Link>
      )}
    </div>
  );
}

/* ── FilterChips ─────────────────────────────────────────────
   iOS-26 liquid-glass pill capsule with 2-5 chip segments.
   Generic over the chip value type so callers get strong
   typing on `active` / `onChange`.
   ────────────────────────────────────────────────────────── */

export type FilterOption<T extends string> = {
  value: T;
  label: string;
  /** Optional count badge — only shown for non-default options
   *  when count > 0. Caller decides which option is "default". */
  count?: number;
  /** When true, the count badge is hidden even if count > 0
   *  (e.g. "All" doesn't show its count by convention). */
  hideCount?: boolean;
};

export type FilterChipsProps<T extends string> = {
  options: FilterOption<T>[];
  active: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
  /** Extra style for one-off margin tweaks without proliferating CSS classes. */
  style?: React.CSSProperties;
};

export function FilterChips<T extends string>({
  options,
  active,
  onChange,
  ariaLabel,
  style,
}: FilterChipsProps<T>) {
  return (
    <div
      className="cw-filter-row"
      role="group"
      aria-label={ariaLabel}
      style={style}
    >
      {options.map((opt) => {
        const isActive = opt.value === active;
        const showCount =
          !opt.hideCount && typeof opt.count === "number" && opt.count > 0;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={isActive}
            className={`cw-chip${isActive ? " cw-chip--active" : ""}`}
          >
            {opt.label}
            {showCount && <span className="cw-chip-count"> · {opt.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ── IconButton ──────────────────────────────────────────────
   36×36 round surface-2 ground with hover-shift signature.
   Used wherever a header has an action icon (new convo, more,
   filter, settings, etc.).
   ────────────────────────────────────────────────────────── */

export type IconButtonProps = {
  ariaLabel: string;
  title?: string;
  onClick?: () => void;
  children: ReactNode;
};

export function IconButton({
  ariaLabel,
  title,
  onClick,
  children,
}: IconButtonProps) {
  return (
    <button
      type="button"
      className="cw-icon-btn"
      aria-label={ariaLabel}
      title={title ?? ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
