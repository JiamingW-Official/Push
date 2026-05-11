"use client";

/* ============================================================
   /creator/work/wrap — Stage 07 list (paid + close-outs)
   v1 · 2026-05-08

   Reached from the Work hub "Paid & wrap" panel. Lists recent
   payouts + close-outs awaiting rating + portfolio promote queue.
   Tap a row → wrap detail page.
   ============================================================ */

import Link from "next/link";
import { MOCK_CAMPAIGNS } from "@/lib/mocks/campaigns";
import {
  StageShell,
  StageHeader,
  StageCard,
  StageTwoCol,
  StageMain,
  StageRail,
  StageRailCard,
  StageStat,
  StageButton,
  StageButtonStack,
} from "@/components/shared/stage";

const WRAPPED = MOCK_CAMPAIGNS.slice(0, 7).map((c, i) => ({
  ...c,
  paidAgo: [
    "today",
    "today",
    "1 d ago",
    "3 d ago",
    "5 d ago",
    "1 wk ago",
    "2 wk ago",
  ][i],
  earnings: [312, 264, 198, 220, 140, 188, 156][i],
  scans: [28, 22, 14, 18, 9, 16, 11][i],
  rated: i >= 2,
}));

export default function WrapListPage() {
  const totalEarned = WRAPPED.reduce((s, w) => s + w.earnings, 0);
  const totalScans = WRAPPED.reduce((s, w) => s + w.scans, 0);
  const toRate = WRAPPED.filter((w) => !w.rated).length;

  return (
    <StageShell
      backHref="/creator/work"
      backLabel="← Back to work"
      ariaLabel="Paid and wrap list"
    >
      <StageHeader
        eyebrow="Paid & wrap"
        title={`$${totalEarned.toLocaleString()} earned · last 7 gigs`}
        sub={`${toRate} merchants still need your rating. Tap any row for the wrap-up page — earnings breakdown, attribution timeline, cohort compare, and a one-tap promote-to-portfolio.`}
      />

      <StageTwoCol>
        <StageMain>
          <StageCard
            eyebrow="Recent payouts"
            title="Most recent first"
            full
          >
            <ul className="stg__list">
              {WRAPPED.map((w) => (
                <li key={w.id} className="stg__row">
                  <Link href={`/creator/work/wrap/${w.id}`} className="stg__row-link">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="stg__row-img" src={w.images[0]} alt="" />
                    <div className="stg__row-body">
                      <span className="stg__row-title">{w.title}</span>
                      <span className="stg__row-meta">
                        {w.merchantName} · {w.scans} verified scans
                      </span>
                    </div>
                    <div className="stg__row-right">
                      <span className="stg__row-pill stg__row-pill--ok">
                        ${w.earnings}
                      </span>
                      <span className="stg__row-time">
                        {w.rated ? `Paid ${w.paidAgo}` : "Tap to rate"}
                      </span>
                    </div>
                    <span className="stg__row-arrow" aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </StageCard>
        </StageMain>

        <StageRail ariaLabel="Wrap totals">
          <StageRailCard variant="primary" label="Last 7 gigs">
            <StageStat
              size="xl"
              num={`$${totalEarned.toLocaleString()}`}
              label="Total earned"
            />
          </StageRailCard>
          <StageRailCard label="Activity">
            <StageStat size="lg" num={String(totalScans)} label="Verified scans" helper="across 7 gigs" />
          </StageRailCard>
          {toRate > 0 && (
            <StageRailCard label="To rate" heading={`${toRate} merchants pending`} help="Ratings stay private. They feed merchant trust scores so future creators can vet brands.">
              <StageButtonStack>
                <StageButton variant="primary" href={`/creator/work/wrap/${WRAPPED.find((w) => !w.rated)?.id ?? ""}`}>
                  Rate first
                </StageButton>
              </StageButtonStack>
            </StageRailCard>
          )}
          <StageRailCard label="Next">
            <StageButtonStack>
              {/* v10 — was variant="secondary" (blue) competing with
                  Rate first primary above. Now ghost so the red primary
                  is the single clear action on the page. */}
              <StageButton variant="ghost" href="/creator/discover">Find next gig</StageButton>
              <StageButton variant="ghost" href="/creator/portfolio">View portfolio</StageButton>
            </StageButtonStack>
          </StageRailCard>
        </StageRail>
      </StageTwoCol>
    </StageShell>
  );
}
