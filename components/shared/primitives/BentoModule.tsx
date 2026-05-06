"use client";

/**
 * <BentoModule> — Liquid Glass tile with eyebrow + content + drill
 * affordance. Audit § 3.3 calls out the agent-surface contract:
 *
 *   ┌─────────────────────────────────────────────┐
 *   │ EYEBROW · domain · subtype · live indicator│
 *   │                                             │
 *   │ Big number / state visual / progress bar   │
 *   │ ...                                         │
 *   │ Sub-context line                            │
 *   │     ─ ─ ─                                   │
 *   │              [drill arrow →]                │
 *   └─────────────────────────────────────────────┘
 *
 * Replaces 5× duplicate bento tiles (today / drafts / earnings /
 * leaderboard-podium / discover). Every domain hub uses this single
 * component with different children.
 *
 * Behavior:
 *   - Wraps in <Link> so the entire surface is clickable
 *   - Bottom-right hover shift + scale 1.006 (Push signature)
 *   - Drill arrow rotates 4° on hover (drill affordance)
 *   - Empty / loading variants via `state` prop
 */

import Link from "next/link";
import type { ReactNode } from "react";
import "./BentoModule.css";

type Props = {
  /** Where the module drills to. */
  href: string;
  /** Eyebrow line — typically "DOMAIN · SUBTYPE". Mono uppercase. */
  eyebrow: string;
  /** Optional live-indicator dot (orange = live, red = urgent). */
  live?: "off" | "live" | "urgent";
  /** Module content — big numeral, state visual, progress, etc. */
  children: ReactNode;
  /** Optional sub-context line, sits below `children`. */
  sub?: ReactNode;
  /** Bento grid span override. Default 4 cols of 12. */
  span?: 3 | 4 | 5 | 6 | 7 | 8 | 12;
  /** Render-as-skeleton when data is loading. */
  state?: "ready" | "loading" | "empty" | "error";
  /** Empty-state message. Used only when state === "empty". */
  emptyMessage?: string;
  /** ARIA label override. */
  ariaLabel?: string;
  /** Visual priority. "hero" = champagne-bordered anchor (one per hub).
   *  "quiet" = de-emphasized supporting tile. Default unranked. */
  priority?: "hero" | "quiet";
};

export function BentoModule({
  href,
  eyebrow,
  live = "off",
  children,
  sub,
  span = 4,
  state = "ready",
  emptyMessage,
  ariaLabel,
  priority,
}: Props) {
  const priorityClass = priority ? ` bento--${priority}` : "";
  return (
    <Link
      href={href}
      className={`bento bento--span-${span} bento--state-${state}${priorityClass}`}
      aria-label={ariaLabel ?? eyebrow}
    >
      <div className="bento__head">
        <span className="bento__eyebrow">{eyebrow}</span>
        {live !== "off" ? (
          <span className={`bento__live bento__live--${live}`} aria-hidden />
        ) : null}
      </div>

      <div className="bento__body">
        {state === "loading" ? (
          <div className="bento__skel" aria-busy="true" aria-live="polite" />
        ) : state === "empty" ? (
          <div className="bento__empty">{emptyMessage ?? "No data yet."}</div>
        ) : (
          children
        )}
      </div>

      {sub && state === "ready" ? (
        <div className="bento__sub">{sub}</div>
      ) : null}

      <span className="bento__drill" aria-hidden>
        →
      </span>
    </Link>
  );
}
