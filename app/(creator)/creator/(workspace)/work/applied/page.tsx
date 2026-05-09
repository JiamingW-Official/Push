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

const PILL_LABEL: Record<ApplicationStatus, string> = {
  reviewing: "Reviewing",
  accepted: "Accepted",
  declined: "Declined",
};
const PILL_TONE: Record<ApplicationStatus, "info" | "ok" | "warn"> = {
  reviewing: "info",
  accepted: "ok",
  declined: "warn",
};

type FilterKey = "all" | ApplicationStatus;

function nextHref(campaignId: string, status: ApplicationStatus): string {
  if (status === "accepted") return `/creator/work/confirmed/${campaignId}`;
  return `/creator/discover/${campaignId}`;
}

export default function AppliedListPage() {
  const { data: applications, error, isLoading } = useCreatorApplications();
  const [filter, setFilter] = useState<FilterKey>("all");

  const reviewing = applications.filter((a) => a.status === "reviewing").length;
  const accepted = applications.filter((a) => a.status === "accepted").length;
  const declined = applications.filter((a) => a.status === "declined").length;

  const filtered = applications.filter(
    (a) => filter === "all" || a.status === filter,
  );

  return (
    <StageShell
      backHref="/creator/work"
      backLabel="← Back to work"
      ariaLabel="Applied applications list"
    >
      <StageHeader
        eyebrow="Stage 03 · Applied"
        title={
          isLoading
            ? "Loading applications…"
            : `${applications.length} applications in flight`
        }
        sub={
          isLoading
            ? "Pulling your application status from the server."
            : `${reviewing} reviewing · ${accepted} accepted · ${declined} declined. Merchants typically reply within 24 hours. Tap an accepted row to open Confirmed; tap a reviewing row to re-read the brief.`
        }
      />

      <StageTwoCol>
        <StageMain className="stg__main--single">
          <StageCard
            eyebrow={`${filter === "all" ? "All" : PILL_LABEL[filter]} · ${filtered.length} of ${applications.length}`}
            title="Most recent first"
          >
            {error ? (
              <p className="stg__empty">
                Couldn&apos;t load applications. Pull-to-refresh or check back in a moment.
              </p>
            ) : isLoading ? (
              <p className="stg__empty">Loading…</p>
            ) : filtered.length === 0 ? (
              <p className="stg__empty">
                {filter === "all" ? (
                  <>
                    No open applications. Browse{" "}
                    <Link href="/creator/discover" style={{ color: "var(--accent-blue)", fontWeight: 600 }}>
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
                    <Link href={nextHref(a.campaignId, a.status)} className="stg__row-link">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="stg__row-img" src={a.thumbnailUrl} alt="" />
                      <div className="stg__row-body">
                        <span className="stg__row-title">{a.campaignTitle}</span>
                        <span className="stg__row-meta">
                          {a.merchantName} · {a.neighborhood} · ${a.cashPay}/{a.payUnit}
                        </span>
                      </div>
                      <div className="stg__row-right">
                        <span className={`stg__row-pill stg__row-pill--${PILL_TONE[a.status]}`}>
                          {PILL_LABEL[a.status]}
                        </span>
                        <span className="stg__row-time">
                          {a.status === "reviewing" ? a.responseEta : a.appliedAgo}
                        </span>
                      </div>
                      <span className="stg__row-arrow" aria-hidden>→</span>
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
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--accent-blue)", marginRight: 8 }} />
                    Reviewing
                  </>
                }
                value={String(reviewing)}
              />
              <StagePayRow
                label={
                  <>
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--success)", marginRight: 8 }} />
                    Accepted
                  </>
                }
                value={String(accepted)}
              />
              <StagePayRow
                label={
                  <>
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--warning)", marginRight: 8 }} />
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
              {(["all", "reviewing", "accepted", "declined"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  className={`stg__filter${filter === k ? " is-on" : ""}`}
                  onClick={() => setFilter(k)}
                  aria-pressed={filter === k}
                >
                  {k === "all" ? "All" : PILL_LABEL[k as ApplicationStatus]}
                </button>
              ))}
            </div>
          </StageRailCard>

          {/* Quick stats */}
          <StageRailCard label="Acceptance">
            <StageStat
              size="lg"
              num={`${accepted > 0 ? Math.round((accepted / applications.length) * 100) : 0}%`}
              label="Accept rate · all-time"
              helper={`${accepted} of ${applications.length}`}
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
