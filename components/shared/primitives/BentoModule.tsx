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
  /** Optional Apple-style leading icon — pass a lucide-react element
   *  (e.g. <Briefcase size={18} strokeWidth={1.75} />). Renders inline
   *  next to the eyebrow at 18px so the panel reads as an iconic widget. */
  icon?: ReactNode;
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
  /** Solid panel variant — flips background to a saturated brand surface
   *  with snow text. ≤2 per page total, most pages should use only 1.
   *  "ink"       = #14130f near-black · default high-end "executive panel"
   *  "red"       = brand-red · use for severity / action-driving callouts
   *  "blue"      = N2W blue · use for affirmative status / system-healthy
   *  "orange"    = GA-orange · use for live / time-of-day execution feel
   *  "champagne" = warm cream tint (NOT solid) · ceremonial accent like
   *                Analytics' milestone-hit panel. Internal text stays
   *                ink for legibility — only the surface gets warmth. */
  tone?: "ink" | "red" | "blue" | "orange" | "champagne";
};

export function BentoModule({
  href,
  eyebrow,
  icon,
  live = "off",
  children,
  sub,
  span = 4,
  state = "ready",
  emptyMessage,
  ariaLabel,
  priority,
  tone,
}: Props) {
  const priorityClass = priority ? ` bento--${priority}` : "";
  const isSolidTone =
    tone === "ink" || tone === "red" || tone === "blue" || tone === "orange";
  const toneClass = tone
    ? isSolidTone
      ? ` bento--solid bento--solid-${tone}`
      : ` bento--accent bento--accent-${tone}`
    : "";
  return (
    <Link
      href={href}
      className={`bento bento--span-${span} bento--state-${state}${priorityClass}${toneClass}`}
      aria-label={ariaLabel ?? eyebrow}
    >
      <div className="bento__head">
        {icon ? (
          <span className="bento__icon" aria-hidden>
            {icon}
          </span>
        ) : null}
        <span className="bento__eyebrow">{eyebrow}</span>
        {live !== "off" ? (
          <span className={`bento__live bento__live--${live}`} aria-hidden />
        ) : null}
        {state === "ready" ? (
          <span className="bento__drill" aria-hidden>
            ↗
          </span>
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
    </Link>
  );
}
