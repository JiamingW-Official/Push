"use client";

/* ============================================================
   <NextActionBar> — "what to do next" strip + action buttons.

   Layout:
     ┌─────────────────────────────────────────────────────┐
     │ NEXT  [verb-phrase from STAGE_META.nextHint]         │
     │  [Primary]  [Secondary]  [Tertiary ghost]            │
     └─────────────────────────────────────────────────────┘

   Owner color cue (left bar):
     creator  — N2W blue   "Your move"
     merchant — orange     "Waiting on merchant"
     system   — graphite   "Push processing"
     done     — green      "Closed"
   ============================================================ */

import type { GigOwner } from "@/lib/creator/gigs/stage";
import type { ReactNode } from "react";

export interface ActionButton {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  icon?: ReactNode;
  disabled?: boolean;
}

interface Props {
  owner: GigOwner;
  hint: string;
  actions?: ActionButton[];
}

const OWNER_LABEL: Record<GigOwner, string> = {
  creator: "Your move",
  merchant: "Waiting on merchant",
  system: "Push processing",
  done: "Closed",
};

export function NextActionBar({ owner, hint, actions = [] }: Props) {
  return (
    <div className={`gigs-next gigs-next--${owner}`}>
      <div className="gigs-next__head">
        <span className="gigs-next__owner-tag">{OWNER_LABEL[owner]}</span>
        <p className="gigs-next__hint">
          <span className="gigs-next__hint-eyebrow">Next</span>
          {hint}
        </p>
      </div>
      {actions.length > 0 && (
        <div className="gigs-next__actions">
          {actions.map((a, i) => {
            const cls = `gigs-next__btn gigs-next__btn--${a.variant ?? "primary"}`;
            if (a.href) {
              return (
                <a key={i} href={a.href} className={cls}>
                  {a.icon}
                  {a.label}
                </a>
              );
            }
            return (
              <button
                key={i}
                type="button"
                className={cls}
                onClick={a.onClick}
                disabled={a.disabled}
              >
                {a.icon}
                {a.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
