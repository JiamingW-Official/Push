"use client";

/* ============================================================
   /creator/work/applied — Stage 03 status list
   v3 · 2026-05-08 — adds 2-col shell with sticky right rail
   (status breakdown ink + quick filter + tip + find next CTA)
   so the page stops feeling like a one-card list and pulls
   weight equal to the stage detail pages.

   Hook: useCreatorApplications (SWR, mock fallback).
   Wired in v2; this round only restructures layout.
   ============================================================ */

import { useState } from "react";
import Link from "next/link";
import {
  StageShell,
  StageHeader,
  StageCard,
  StageTwoCol,
  StageMain,
  StageRail,
  StageRailCard,
  StagePayRow,
  StageButton,
  StageButtonStack,
  StageStat,
} from "@/components/shared/stage";
import {
  useCreatorApplications,
  type ApplicationStatus,
} from "@/lib/data/hooks/useCreatorApplications";
import { STAGE_LABEL } from "@/lib/services/application-stage";

/* v16 — list collapses 11 lifecycle states into 3 visible buckets:
 *  reviewing / in-flight / complete. Filter still allows drilling
 *  to the original three for legacy parity. */
const STAGE_PILL_TONE: Record<ApplicationStatus, "info" | "ok" | "warn"> = {
  reviewing: "info",
  declined: "warn",
  withdrawn: "warn",
  accepted: "ok",
  pre_shoot: "info",
  shoot_live: "ok",
  pending_upload: "warn",
  submitted: "info",
  revision_requested: "warn",
  verified: "ok",
  paid: "ok",
};

type FilterKey = "all" | "reviewing" | "in_flight" | "complete" | "declined";

const FILTER_LABEL: Record<FilterKey, string> = {
  all: "All",
  reviewing: "Reviewing",
  in_flight: "In flight",
  complete: "Complete",
  declined: "Declined",
};

const IN_FLIGHT: ReadonlySet<ApplicationStatus> = new Set([
  "accepted",
  "pre_shoot",
  "shoot_live",
  "pending_upload",
  "submitted",
  "revision_requested",
  "verified",
]);

function matchesFilter(status: ApplicationStatus, filter: FilterKey): boolean {
  if (filter === "all") return true;
  if (filter === "reviewing") return status === "reviewing";
  if (filter === "complete") return status === "paid";
  if (filter === "declined")
    return status === "declined" || status === "withdrawn";
  if (filter === "in_flight") return IN_FLIGHT.has(status);
  return false;
}

/** v16 — every non-terminal application drills into the new
 *  stage-aware /creator/applied/[id] surface. */
function nextHref(applicationId: string): string {
  return `/creator/applied/${applicationId}`;
}

export default function AppliedListPage() {
  const { data: applications, error, isLoading } = useCreatorApplications();
  const [filter, setFilter] = useState<FilterKey>("all");

  const reviewing = applications.filter((a) => a.status === "reviewing").length;
  const inFlight = applications.filter((a) => IN_FLIGHT.has(a.status)).length;
  const complete = applications.filter((a) => a.status === "paid").length;
  const declined = applications.filter(
    (a) => a.status === "declined" || a.status === "withdrawn",
  ).length;

  const filtered = applications.filter((a) => matchesFilter(a.status, filter));

  return (
    <StageShell
      backHref="/creator/work"
      backLabel="← Back to work"
      ariaLabel="Applied applications list"
    >
      <StageHeader
        eyebrow="Applied · awaiting reply"
        title={
          isLoading
            ? "Loading applications…"
            : `${applications.length} applications in flight`
        }
        sub={
          isLoading
            ? "Pulling your application status from the server."
            : `${reviewing} reviewing · ${inFlight} in flight · ${complete} complete${declined > 0 ? ` · ${declined} declined` : ""}. Tap any row to drill into the stage-aware command surface.`
        }
      />

      <StageTwoCol>
        <StageMain className="stg__main--single">
          <StageCard
            eyebrow={`${FILTER_LABEL[filter]} · ${filtered.length} of ${applications.length}`}
            title="Most recent first"
          >
            {error ? (
              <p className="stg__empty">
                Couldn&apos;t load applications. Pull-to-refresh or check back
                in a moment.
              </p>
            ) : isLoading ? (
              <p className="stg__empty">Loading…</p>
            ) : filtered.length === 0 ? (
              <p className="stg__empty">
                {filter === "all" ? (
                  <>
                    No open applications. Browse{" "}
                    <Link
                      href="/creator/discover"
                      style={{ color: "var(--accent-blue)", fontWeight: 600 }}
                    >
                      Discover
                    </Link>{" "}
                    to send your first.
                  </>
                ) : (
                  <>No applications in this status yet.</>
                )}
              </p>
            ) : (
              <ul className="stg__list">
                {filtered.map((a) => (
                  <li key={a.id} className="stg__row">
                    <Link href={nextHref(a.id)} className="stg__row-link">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="stg__row-img"
                        src={a.thumbnailUrl}
                        alt=""
                      />
                      <div className="stg__row-body">
                        <span className="stg__row-title">
                          {a.campaignTitle}
                        </span>
                        <span className="stg__row-meta">
                          {a.merchantName} · {a.neighborhood} · ${a.cashPay}/
                          {a.payUnit}
                        </span>
                      </div>
                      <div className="stg__row-right">
                        <span
                          className={`stg__row-pill stg__row-pill--${STAGE_PILL_TONE[a.status]}`}
                        >
                          {STAGE_LABEL[a.status]}
                        </span>
                        <span className="stg__row-time">
                          {a.status === "reviewing"
                            ? a.responseEta
                            : a.appliedAgo}
                        </span>
                      </div>
                      <span className="stg__row-arrow" aria-hidden>
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </StageCard>
        </StageMain>

        <StageRail ariaLabel="Applications summary">
          {/* Status breakdown — primary ink card */}
          <StageRailCard
            variant="primary"
            label="Status breakdown"
            heading={`${applications.length} in flight`}
          >
            <ul className="stg__pay-list">
              <StagePayRow
                label={
                  <>
                    <span
                      style={{
                        display: "inline-block",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--accent-blue)",
                        marginRight: 8,
                      }}
                    />
                    Reviewing
                  </>
                }
                value={String(reviewing)}
              />
              <StagePayRow
                label={
                  <>
                    <span
                      style={{
                        display: "inline-block",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--success)",
                        marginRight: 8,
                      }}
                    />
                    In flight
                  </>
                }
                value={String(inFlight)}
              />
              <StagePayRow
                label={
                  <>
                    <span
                      style={{
                        display: "inline-block",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--success)",
                        marginRight: 8,
                      }}
                    />
                    Complete
                  </>
                }
                value={String(complete)}
              />
              <StagePayRow
                label={
                  <>
                    <span
                      style={{
                        display: "inline-block",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--warning)",
                        marginRight: 8,
                      }}
                    />
                    Declined
                  </>
                }
                value={String(declined)}
              />
            </ul>
          </StageRailCard>

          {/* Quick filter */}
          <StageRailCard label="Filter" heading="Status">
            <div className="stg__filters" style={{ paddingBottom: 0 }}>
              {(
                [
                  "all",
                  "reviewing",
                  "in_flight",
                  "complete",
                  "declined",
                ] as const
              ).map((k) => (
                <button
                  key={k}
                  type="button"
                  className={`stg__filter${filter === k ? " is-on" : ""}`}
                  onClick={() => setFilter(k)}
                  aria-pressed={filter === k}
                >
                  {FILTER_LABEL[k]}
                </button>
              ))}
            </div>
          </StageRailCard>

          {/* Quick stats */}
          <StageRailCard label="Velocity">
            <StageStat
              size="lg"
              num={`${
                applications.length > 0
                  ? Math.round(
                      ((inFlight + complete) / applications.length) * 100,
                    )
                  : 0
              }%`}
              label="Move-forward rate"
              helper={`${inFlight + complete} of ${applications.length} accepted`}
            />
          </StageRailCard>

          {/* Tip */}
          <StageRailCard
            label="Tip"
            help="Avg merchant reply time is 18h. If no response in 48h, follow up via the brief page — most merchants appreciate the nudge."
          />

          {/* CTAs */}
          <StageRailCard label="Next">
            <StageButtonStack>
              <StageButton variant="primary" href="/creator/discover">
                Find next gig
              </StageButton>
              <StageButton variant="ghost" href="/creator/work">
                Back to work
              </StageButton>
            </StageButtonStack>
          </StageRailCard>
        </StageRail>
      </StageTwoCol>
    </StageShell>
  );
}
