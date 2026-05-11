"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  EMPTY_STATE_ART,
  type EmptyStateArtKind,
  type EmptyStateArtVariant,
} from "@/components/feedback/empty-state-illustrations";
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
  /**
   * Optional brand-aligned line-art illustration above the title. Pass an
   * already-rendered ReactNode for full control.
   *
   * Back-compat: if `art` is omitted, no illustration renders (existing
   * call-sites continue to work unchanged).
   */
  art?: ReactNode;
  /**
   * Convenience: pick one of the predefined illustrations by key. Ignored
   * when `art` is provided.
   */
  artKind?: EmptyStateArtKind;
  /** Variant for the predefined illustrations — `"muted"` for filter no-match. */
  artVariant?: EmptyStateArtVariant;
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
  art,
  artKind,
  artVariant,
}: EmptyStateProps) {
  const renderConvenienceCta = !action && Boolean(ctaLabel);

  let resolvedArt: ReactNode = art ?? null;
  if (!resolvedArt && artKind) {
    const ArtComponent = EMPTY_STATE_ART[artKind];
    resolvedArt = <ArtComponent variant={artVariant} />;
  }

  return (
    <div className="ms-empty-state" role="status">
      {resolvedArt ? (
        <div className="ms-empty-state-art" aria-hidden="true">
          {resolvedArt}
        </div>
      ) : null}
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
