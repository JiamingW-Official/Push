"use client";

/* ============================================================
   <PriorityStrip> — sticky top bar of 4 colored KPI pills.

   Each pill = a clickable filter that scrolls/highlights the
   matching urgency group in the main list.

     🔴 Overdue   🟠 Today    🔵 Invites   🟡 Stuck

   Counts come from countPriorities() in lib/creator/gigs/stage.ts.
   ============================================================ */

import type { PriorityCounts } from "@/lib/creator/gigs/stage";

interface Props {
  counts: PriorityCounts;
  active: ActiveFilter;
  onSelect: (kind: ActiveFilter) => void;
}

export type ActiveFilter = "all" | "overdue" | "today" | "invites" | "stuck";

const VARIANTS: { key: ActiveFilter; label: string; sub: string }[] = [
  { key: "overdue", label: "Overdue", sub: "blocking" },
  { key: "today", label: "Today", sub: "due now" },
  { key: "invites", label: "Invites", sub: "to respond" },
  { key: "stuck", label: "Stuck", sub: "need nudge" },
];

export function PriorityStrip({ counts, active, onSelect }: Props) {
  return (
    <div className="gigs-strip" role="toolbar" aria-label="Priority filters">
      {VARIANTS.map((v) => {
        const value =
          v.key === "overdue"
            ? counts.overdue
            : v.key === "today"
              ? counts.today
              : v.key === "invites"
                ? counts.invites
                : counts.stuck;
        const isActive = active === v.key;
        return (
          <button
            key={v.key}
            type="button"
            className={`gigs-strip__pill gigs-strip__pill--${v.key}${isActive ? " is-active" : ""}`}
            aria-pressed={isActive}
            onClick={() => onSelect(isActive ? "all" : v.key)}
          >
            <span className="gigs-strip__num">{value}</span>
            <span className="gigs-strip__lbl">
              {v.label}
              <span className="gigs-strip__sub">{v.sub}</span>
            </span>
          </button>
        );
      })}
      <div className="gigs-strip__total">
        <span className="gigs-strip__total-num">{counts.total}</span>
        <span className="gigs-strip__total-lbl">in flight</span>
      </div>
    </div>
  );
}
