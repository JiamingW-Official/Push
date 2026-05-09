"use client";

/**
 * Stage primitives — shared component layer for the 7-stage creator
 * funnel pages (Discover · Qualify · Apply · Confirmed · Shoot ·
 * Submit · Paid). Audit § 3 found that the Phase 01 pages duplicated
 * the same 14 patterns in 3 separate .css files (qual / apl / cnf,
 * ~600 lines combined, ~85% identical). This module is the single
 * source.
 *
 *   import {
 *     StageShell, StageBanner, StageHeader, StageChip,
 *     StageTwoCol, StageMain, StageRail,
 *     StageCard, StageRailCard,
 *     StageButton, StageButtonStack,
 *     StageStep, StageEligRow, StagePayRow, StageRiskFlag,
 *     StageMerchAvatar, StageThreadMsg, StageProgressStrip,
 *   } from "@/components/shared/stage";
 *
 * All components render Product-register surfaces per Design.md v12:
 * Snow page bg, Snow cards with shadow-only borders, canonical (no
 * parenthetical) eyebrows, 8px grid, iOS 26 radii, 5-button system,
 * bottom-right hover shift on every clickable.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode, MouseEventHandler } from "react";
import "./Stage.css";

/* ── Stage funnel journey ──────────────────────────────────
   9-stage breadcrumb strip rendered at the top of every
   stage detail page. Auto-detects the current stage from
   pathname so pages don't need to pass props. Each pip is a
   Link to that stage's entry — keeps the user oriented in
   the funnel and able to jump laterally. */

type FunnelStage = {
  n: number;
  key: string;
  label: string;
  href: string;
  /** Pathname patterns that should highlight this stage. */
  match: (RegExp | string)[];
};

const FUNNEL: FunnelStage[] = [
  { n: 1, key: "discover",  label: "Discover",  href: "/creator/discover",         match: [/^\/creator\/discover$/] },
  { n: 2, key: "qualify",   label: "Qualify",   href: "/creator/discover",         match: [/^\/creator\/discover\/[^/]+$/] },
  { n: 3, key: "apply",     label: "Apply",     href: "/creator/work/applied",     match: [/^\/creator\/discover\/[^/]+\/apply$/, "/creator/work/applied"] },
  { n: 4, key: "confirmed", label: "Confirmed", href: "/creator/work/active",      match: [/^\/creator\/work\/confirmed/] },
  { n: 5, key: "shoot",     label: "Shoot",     href: "/creator/work/active",      match: [/^\/creator\/work\/active/] },
  { n: 6, key: "submit",    label: "Submit",    href: "/creator/work/active",      match: [/^\/creator\/work\/submit/] },
  { n: 7, key: "paid",      label: "Paid",      href: "/creator/work/wrap",        match: [/^\/creator\/work\/wrap/] },
  { n: 8, key: "dispute",   label: "Disputed",  href: "/creator/work",             match: [/^\/creator\/work\/dispute/] },
  { n: 9, key: "promoted",  label: "Promoted",  href: "/creator/portfolio",        match: [/^\/creator\/portfolio\/[^/]+$/] },
];

function detectCurrentStage(pathname: string | null): string | null {
  if (!pathname) return null;
  for (const s of FUNNEL) {
    for (const m of s.match) {
      if (typeof m === "string" ? pathname === m : m.test(pathname)) return s.key;
    }
  }
  return null;
}

export function StageJourney({ currentKey }: { currentKey?: string }) {
  const pathname = usePathname();
  const active = currentKey ?? detectCurrentStage(pathname);
  const activeIdx = FUNNEL.findIndex((s) => s.key === active);

  return (
    <nav className="stg__journey" aria-label="Funnel position">
      {FUNNEL.map((s, i) => {
        const isActive = s.key === active;
        const isPast = activeIdx > -1 && i < activeIdx;
        const isFuture = activeIdx > -1 && i > activeIdx;
        return (
          <span key={s.key} className="stg__journey-wrap">
            <Link
              href={s.href}
              prefetch={false}
              className={`stg__journey-pip${
                isActive ? " is-active" : ""
              }${isPast ? " is-past" : ""}${isFuture ? " is-future" : ""}`}
              aria-current={isActive ? "step" : undefined}
            >
              <span className="stg__journey-num">{s.n}</span>
              <span className="stg__journey-label">{s.label}</span>
            </Link>
            {i < FUNNEL.length - 1 && (
              <span className="stg__journey-arrow" aria-hidden>→</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

/* ── Shell ──────────────────────────────────────────────── */

export function StageShell({
  backHref,
  backLabel = "← Back to work",
  className,
  children,
  ariaLabel,
  showJourney = true,
}: {
  backHref: string;
  backLabel?: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
  /** Render the 9-stage funnel journey strip at top. Default true. */
  showJourney?: boolean;
}) {
  return (
    <article
      className={`stg${className ? ` ${className}` : ""}`}
      aria-label={ariaLabel}
    >
      <Link href={backHref} prefetch={false} className="stg__back">
        {backLabel}
      </Link>
      {showJourney && <StageJourney />}
      {children}
    </article>
  );
}

/* ── Banner (status ribbon) ─────────────────────────────── */

export function StageBanner({
  tone = "champagne",
  text,
  meta,
}: {
  tone?: "champagne" | "blue" | "amber";
  text: string;
  meta?: ReactNode;
}) {
  return (
    <div className={`stg__banner stg__banner--${tone}`} role="status">
      <span className="stg__banner-dot" aria-hidden />
      <span className="stg__banner-text">{text}</span>
      {meta && <span className="stg__banner-meta">{meta}</span>}
    </div>
  );
}

/* ── Header ─────────────────────────────────────────────── */

export function StageHeader({
  eyebrow,
  title,
  sub,
  chips,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  chips?: ReactNode;
}) {
  return (
    <header className="stg__header">
      <p className="stg__eyebrow">{eyebrow}</p>
      <h1 className="stg__title">{title}</h1>
      {sub && <p className="stg__sub">{sub}</p>}
      {chips && <div className="stg__chips">{chips}</div>}
    </header>
  );
}

/* ── Chip ───────────────────────────────────────────────── */

export function StageChip({
  tone,
  children,
}: {
  tone?: "default" | "success" | "accent" | "champagne" | "blue";
  children: ReactNode;
}) {
  return (
    <span
      className={`stg__chip${tone && tone !== "default" ? ` stg__chip--${tone}` : ""}`}
    >
      {children}
    </span>
  );
}

/* ── 2-col layout primitives ────────────────────────────── */

export function StageTwoCol({ children }: { children: ReactNode }) {
  return <div className="stg__shell">{children}</div>;
}
export function StageMain({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`stg__main${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}
export function StageRail({
  children,
  ariaLabel = "Summary",
}: {
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <aside className="stg__rail" aria-label={ariaLabel}>
      {children}
    </aside>
  );
}

/* ── Cards ──────────────────────────────────────────────── */

type CardTone = "default" | "ink" | "champagne" | "blue" | "red" | "green";

export function StageCard({
  eyebrow,
  title,
  children,
  full,
  span2,
  tone = "default",
  icon,
  accent,
  kpi,
}: {
  eyebrow?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
  /** When inside a 2-col / 3-col `.stg__main` grid, span full width. */
  full?: boolean;
  /** When inside a 3-col `.stg__main` grid (≥1700px), span 2 columns
   *  (gracefully degrades to 1-col on 2-col grid). */
  span2?: boolean;
  /** Card surface tone — mirrors BentoModule's variants for visual
   *  parity between hub bento and stage detail pages. */
  tone?: CardTone;
  /** Optional eyebrow leading icon (lucide-react element, 14-16px). */
  icon?: ReactNode;
  /** Optional left vertical accent color matching a stage. */
  accent?: "ink" | "blue" | "champagne" | "red" | "green" | "orange";
  /** Optional KPI block rendered prominently above title.
   *  Provide { value, label } — e.g. { value: "$312", label: "Earned" }. */
  kpi?: { value: ReactNode; label: ReactNode; helper?: ReactNode };
}) {
  const cls = [
    "stg__card",
    full ? "stg__card--full" : "",
    span2 ? "stg__card--span-2" : "",
    tone !== "default" ? `stg__card--${tone}` : "",
    accent ? `stg__card--accent-${accent}` : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <section className={cls}>
      {eyebrow && (
        <p className="stg__card-eyebrow">
          {icon && <span className="stg__card-eyebrow-icon" aria-hidden>{icon}</span>}
          {eyebrow}
        </p>
      )}
      {kpi && (
        <div className="stg__card-kpi">
          <span className="stg__card-kpi-value">{kpi.value}</span>
          <span className="stg__card-kpi-label">{kpi.label}</span>
          {kpi.helper && <span className="stg__card-kpi-helper">{kpi.helper}</span>}
        </div>
      )}
      {title && <h2 className="stg__card-h">{title}</h2>}
      {children}
    </section>
  );
}

export function StageRailCard({
  variant = "default",
  label,
  heading,
  help,
  children,
  footer,
}: {
  variant?: "default" | "primary";
  label?: ReactNode;
  heading?: ReactNode;
  help?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className={`stg__rail-card stg__rail-card--${variant}`}>
      {label && <p className="stg__rail-label">{label}</p>}
      {heading && <h3 className="stg__rail-h">{heading}</h3>}
      {children}
      {help && <p className="stg__rail-help">{help}</p>}
      {footer}
    </section>
  );
}

/* ── Buttons ────────────────────────────────────────────── */

type BtnVariant = "primary" | "secondary" | "ink" | "ghost" | "pink";

export function StageButton({
  variant = "primary",
  href,
  type = "button",
  disabled,
  full = true,
  onClick,
  ariaLabel,
  children,
}: {
  variant?: BtnVariant;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  full?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const cls = `stg__btn stg__btn--${variant}${full ? " stg__btn--full" : ""}`;
  if (href && !disabled) {
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type}
      className={cls}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export function StageButtonStack({
  children,
  direction = "column",
}: {
  children: ReactNode;
  direction?: "column" | "row";
}) {
  return <div className={`stg__btn-stack stg__btn-stack--${direction}`}>{children}</div>;
}

/* ── Step (numbered, used by Apply) ─────────────────────── */

export function StageStep({
  n,
  label,
  title,
  help,
  children,
}: {
  n: number;
  label: ReactNode;
  title: ReactNode;
  help?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="stg__step">
      <span className="stg__step-num" data-step={n}>
        {label}
      </span>
      <h2 className="stg__step-h">{title}</h2>
      {help && <p className="stg__step-help">{help}</p>}
      {children}
    </section>
  );
}

/* ── Eligibility row ────────────────────────────────────── */

export function StageEligRow({
  status,
  label,
  meta,
}: {
  status: "ok" | "warn" | "block" | "info";
  label: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <li className="stg__elig">
      <span className={`stg__elig-dot stg__elig-dot--${status}`} aria-hidden />
      {label}
      {meta != null && <span className="stg__elig-meta">{meta}</span>}
    </li>
  );
}

/* ── Pay-anatomy row ────────────────────────────────────── */

export function StagePayRow({
  label,
  value,
}: {
  label: ReactNode;
  value: ReactNode;
}) {
  return (
    <li className="stg__pay-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </li>
  );
}

/* ── Risk flag ──────────────────────────────────────────── */

export function StageRiskFlag({
  kind = "info",
  children,
}: {
  kind?: "warn" | "ok" | "info";
  children: ReactNode;
}) {
  return (
    <li className={`stg__risk stg__risk--${kind}`}>
      <span className="stg__risk-dot" aria-hidden />
      <span>{children}</span>
    </li>
  );
}

/* ── Merchant avatar (initial) ──────────────────────────── */

export function StageMerchAvatar({
  initial,
  size = 64,
}: {
  initial: string;
  size?: number;
}) {
  return (
    <span
      className="stg__merch-avatar"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
    >
      {initial}
    </span>
  );
}

/* ── Thread message preview ─────────────────────────────── */

export function StageThreadMsg({
  side = "merchant",
  name,
  initial,
  text,
  time,
}: {
  side?: "merchant" | "mine";
  name: ReactNode;
  initial: string;
  text: ReactNode;
  time: ReactNode;
}) {
  return (
    <li className={`stg__msg stg__msg--${side}`}>
      <span className="stg__msg-who" aria-hidden>
        {initial}
      </span>
      <span className="stg__msg-body">
        <span className="stg__msg-name">{name}</span>
        <span className="stg__msg-text">{text}</span>
      </span>
      <span className="stg__msg-time">{time}</span>
    </li>
  );
}

/* ── Progress strip (Shoot / Submit) ────────────────────── */

export function StageProgressStrip({
  label,
  current,
  total,
  meta,
  tone = "ink",
}: {
  label: ReactNode;
  current: number;
  total: number;
  meta?: ReactNode;
  tone?: "ink" | "champagne" | "success";
}) {
  const pct = Math.min(100, Math.max(0, (current / total) * 100));
  return (
    <div className="stg__prog">
      <div className="stg__prog-head">
        <span className="stg__prog-label">{label}</span>
        <span className="stg__prog-num">
          {current} / {total}
        </span>
      </div>
      <div className="stg__prog-track">
        <div
          className={`stg__prog-fill stg__prog-fill--${tone}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
        />
      </div>
      {meta && <p className="stg__prog-meta">{meta}</p>}
    </div>
  );
}

/* ── Stat block (used in Wrap earnings) ─────────────────── */

export function StageStat({
  num,
  label,
  helper,
  size = "lg",
}: {
  num: ReactNode;
  label: ReactNode;
  helper?: ReactNode;
  size?: "lg" | "xl";
}) {
  return (
    <div className={`stg__stat stg__stat--${size}`}>
      <span className="stg__stat-num">{num}</span>
      <span className="stg__stat-label">{label}</span>
      {helper && <span className="stg__stat-helper">{helper}</span>}
    </div>
  );
}
