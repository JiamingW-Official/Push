"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import "./empty-state.css";

export interface EmptyStateProps {
  /** Optional Lucide icon (or any ReactNode); rendered in a 40×40 surface tile per § 13. */
  icon?: ReactNode;
  /** Optional mono uppercase eyebrow above the title. */
  eyebrow?: string;
  /** H4 display title. */
  title: string;
  /** Mono body description, max-width capped for readability. */
  description?: string;
  /** Custom action node (button / link cluster). Takes precedence over `ctaLabel`. */
  action?: ReactNode;
  /** Convenience CTA — renders a `btn-ghost`-style anchor or button. */
  ctaLabel?: string;
  ctaHref?: string;
  ctaOnClick?: () => void;
}

export function EmptyState({
  icon,
  eyebrow,
  title,
  description,
  action,
  ctaLabel,
  ctaHref,
  ctaOnClick,
}: EmptyStateProps) {
  const renderConvenienceCta = !action && Boolean(ctaLabel);

  return (
    <div className="ms-empty-state" role="status">
      {icon ? (
        <div className="ms-empty-state-icon" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      {eyebrow ? <p className="ms-empty-state-eyebrow">{eyebrow}</p> : null}
      <h2 className="ms-empty-state-title">{title}</h2>
      {description ? (
        <p className="ms-empty-state-description">{description}</p>
      ) : null}
      {action ? <div className="ms-empty-state-action">{action}</div> : null}
      {renderConvenienceCta && ctaHref ? (
        <Link className="ms-empty-state-cta" href={ctaHref}>
          {ctaLabel}
        </Link>
      ) : null}
      {renderConvenienceCta && !ctaHref ? (
        <button
          className="ms-empty-state-cta"
          onClick={ctaOnClick}
          type="button"
        >
          {ctaLabel}
        </button>
      ) : null}
    </div>
  );
}
