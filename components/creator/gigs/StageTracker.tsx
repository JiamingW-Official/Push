"use client";

/* ============================================================
   <StageTracker> — 7-dot horizontal progress bar.

   Each dot represents a gig lifecycle stage:
     1 Invited · 2 Accepted · 3 Shoot · 4 Posted ·
     5 Live · 6 Verified · 7 Paid

   States per dot:
     done    (filled ink)
     current (filled accent + ring)
     stuck   (orange, replaces current ring color)
     locked  (hollow, light)

   Variants:
     "lg"    — 7 visible dots + connecting line + stage label below
     "sm"    — compact 7 dots, no labels (for compact GigCard)
   ============================================================ */

import type { GigStage } from "@/lib/creator/gigs/stage";
import { STAGE_META } from "@/lib/creator/gigs/stage";

interface Props {
  stage: GigStage;
  stuck?: boolean;
  size?: "lg" | "sm";
}

const ALL_STAGES: GigStage[] = [1, 2, 3, 4, 5, 6, 7];

export function StageTracker({ stage, stuck = false, size = "lg" }: Props) {
  return (
    <div
      className={`gigs-stage gigs-stage--${size}${stuck ? " gigs-stage--stuck" : ""}`}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={7}
      aria-valuenow={stage}
      aria-label={`Stage ${stage} of 7: ${STAGE_META[stage].label}`}
    >
      <div className="gigs-stage__track">
        {ALL_STAGES.map((s) => {
          const cls =
            s < stage
              ? "gigs-stage__dot gigs-stage__dot--done"
              : s === stage
                ? "gigs-stage__dot gigs-stage__dot--current"
                : "gigs-stage__dot gigs-stage__dot--locked";
          return (
            <span key={s} className={cls}>
              <span className="gigs-stage__dot-inner" />
            </span>
          );
        })}
        <span
          className="gigs-stage__line"
          style={{ width: `${((stage - 1) / 6) * 100}%` }}
          aria-hidden
        />
      </div>
      {size === "lg" && (
        <div className="gigs-stage__label-row">
          <span className="gigs-stage__current-num">
            Stage {stage}
            <span className="gigs-stage__of"> / 7</span>
          </span>
          <span className="gigs-stage__current-name">
            {STAGE_META[stage].label}
          </span>
        </div>
      )}
    </div>
  );
}
