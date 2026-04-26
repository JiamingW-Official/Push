"use client";

/* Repo target: components/creator/dashboard/widgets/TodaysWork.tsx
   8×3 — milestone pipeline rows for active campaigns. Empty state:
   substitutes the OnboardingHero (rendered by parent). */

import Link from "next/link";
import {
  catColor,
  daysUntil,
  formatCurrencyExact,
  MILESTONE_LABELS,
  PIPELINE,
  TIER_COLORS,
} from "@/lib/creator/widget-helpers";
import type { Application, CreatorTier } from "../types";
import { ArrowUpRight } from "../CircleArrow";

export interface TodaysWorkProps {
  applications: Application[];
  creatorTier: CreatorTier;
  className?: string;
}

export function TodaysWork({
  applications,
  creatorTier,
  className = "",
}: TodaysWorkProps) {
  const active = applications
    .filter((a) => a.status === "accepted")
    .slice(0, 3);

  return (
    <div className={`dh-card ${className}`.trim()}>
      <div className="dh-card__header">
        <span className="dh-card__eyebrow">
          TODAY&rsquo;S WORK · {active.length} ACTIVE
        </span>
        <Link
          href="/creator/work/today"
          className="dh-circle-arrow"
          aria-label="View all work"
        >
          <ArrowUpRight />
        </Link>
      </div>

      <div className="dh-work-list">
        {active.map((app) => {
          const days = daysUntil(app.deadline);
          const stepIdx = PIPELINE.indexOf(app.milestone);
          const cat = catColor(app.category) ?? TIER_COLORS[creatorTier];

          return (
            <Link
              key={app.id}
              href={`/creator/work/campaign/${app.campaign_id}`}
              className="dh-work-row"
              style={{ ["--cat" as string]: cat }}
            >
              <div className="dh-work-row__main">
                <div className="dh-work-row__head">
                  <div className="dh-work-row__title">{app.campaign_title}</div>
                  <div className="dh-work-row__merchant">
                    {app.merchant_name}
                    {app.category ? ` · ${app.category}` : ""}
                  </div>
                </div>

                <div className="dh-pipeline">
                  {PIPELINE.map((step, i) => (
                    <PipelineSegment
                      key={step}
                      last={i === PIPELINE.length - 1}
                      state={
                        i < stepIdx ? "done" : i === stepIdx ? "active" : "todo"
                      }
                    />
                  ))}
                  <span className="dh-pipeline__label">
                    {MILESTONE_LABELS[app.milestone]}
                  </span>
                </div>
              </div>

              <div className="dh-work-row__side">
                <div className="dh-work-row__pay">
                  {formatCurrencyExact(app.payout)}
                </div>
                {days !== null && (
                  <div
                    className={
                      "dh-work-row__deadline" +
                      (days <= 1 ? " dh-work-row__deadline--urgent" : "")
                    }
                  >
                    {days <= 0 ? "TODAY" : `${days}D LEFT`}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function PipelineSegment({
  state,
  last,
}: {
  state: "done" | "active" | "todo";
  last: boolean;
}) {
  return (
    <>
      <span className={`dh-pipeline__dot dh-pipeline__dot--${state}`} />
      {!last && <span className="dh-pipeline__line" />}
    </>
  );
}
