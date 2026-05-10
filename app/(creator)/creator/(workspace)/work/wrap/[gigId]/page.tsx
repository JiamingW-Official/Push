"use client";

/* ============================================================
   /creator/work/wrap/[gigId] — Stage 07 · Paid (close-out)
   v1 · 2026-05-08

   The wrap. Reached after Stage 06 (Submit) once ConversionOracle
   verifies. Two-column shell:

     LEFT  — Earnings breakdown · Attribution timeline · Cohort compare
     RIGHT — Big earnings ink card · Withdraw · Rate · Save to portfolio

   This is the creator's "what did I learn" page, plus the payout
   action. v5.4 attribution decay curve referenced inline.
   ============================================================ */

import { use, Suspense } from "react";
import { notFound, useSearchParams } from "next/navigation";
import { MOCK_CAMPAIGNS } from "@/lib/mocks/campaigns";
import { totalNormalizedPay } from "@/lib/services/pricing";
import {
  StageShell,
  StageBanner,
  StageHeader,
  StageTwoCol,
  StageMain,
  StageRail,
  StageCard,
  StageRailCard,
  StageButton,
  StageButtonStack,
  StagePayRow,
  StageStat,
} from "@/components/shared/stage";
import "./wrap.css";

/* Mock attribution timeline — production fetches from oracle_audit. */
const TIMELINE_DAYS = [
  { day: "Mon", scans: 2, dollars: 24 },
  { day: "Tue", scans: 8, dollars: 96 },
  { day: "Wed", scans: 14, dollars: 168 },
  { day: "Thu", scans: 9, dollars: 108 },
  { day: "Fri", scans: 6, dollars: 72 },
  { day: "Sat", scans: 3, dollars: 36 },
  { day: "Sun", scans: 2, dollars: 24 },
];

export default function WrapPage({
  params,
}: {
  params: Promise<{ gigId: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <WrapPageInner params={params} />
    </Suspense>
  );
}

function WrapPageInner({ params }: { params: Promise<{ gigId: string }> }) {
  const { gigId } = use(params);
  const search = useSearchParams();
  const isFreshSubmit = search?.get("fresh") === "1";
  const c = MOCK_CAMPAIGNS.find((x) => x.id === gigId);
  if (!c) notFound();

  /* Mocked verified-scan totals — production reads from oracle_audit. */
  const baseCash = totalNormalizedPay(c.cashPay, c.deliverables);
  const totalScans = TIMELINE_DAYS.reduce((s, d) => s + d.scans, 0);
  const scanEarnings = TIMELINE_DAYS.reduce((s, d) => s + d.dollars, 0);
  const milestoneBonus = totalScans >= 30 ? 50 : 0;
  const grandTotal = baseCash + scanEarnings + milestoneBonus;
  const peakDay = [...TIMELINE_DAYS].sort((a, b) => b.scans - a.scans)[0];
  const maxScans = peakDay.scans;

  return (
    <StageShell backHref="/creator/work" ariaLabel="Gig wrap and payout">
      {/* v63 — banner shows different state when arriving fresh from /submit
          (?fresh=1). The audit flagged that submit → wrap with no intermediate
          state was confusing creators ("did the post go through? where's
          my money?"). The fresh-state copy explains the verification window. */}
      {isFreshSubmit ? (
        <StageBanner
          tone="blue"
          text="Pending verification · ConversionOracle is attributing scans"
          meta="Typical wait 2-6h · payout posts automatically when verified"
        />
      ) : (
        <StageBanner
          tone="champagne"
          text="Verified · payout released"
          meta={`Posted to your account · 2 hr ago`}
        />
      )}

      <StageHeader
        eyebrow={`Stage 07 · ${isFreshSubmit ? "Verifying" : "Paid"} · ${c.merchantName}`}
        title={c.title}
        sub={
          isFreshSubmit
            ? `Your post is live and the QR code is being scanned in-store. Verification typically takes 2-6 hours. Below is the projected earnings split — final amounts settle once ConversionOracle confirms each scan.`
            : `${totalScans} verified scans across 7 days. Below is the earnings split, the attribution timeline, and how this gig compares to your cohort. Withdraw or roll into the next gig.`
        }
      />

      <StageTwoCol>
        <StageMain>
          {/* Earnings breakdown — green tone + KPI block surfaces the
              total earned at glance, anchoring the "you got paid" page */}
          <StageCard
            eyebrow="Earnings breakdown"
            title="Where the money came from"
            tone="green"
            kpi={{
              value: `$${grandTotal.toFixed(0)}`,
              label: "Total earned",
              helper: `${totalScans} verified scans · ${milestoneBonus > 0 ? "milestone bonus included" : "no milestone yet"}`,
            }}
          >
            <ul className="stg__pay-list">
              <StagePayRow
                label="Base cash · contracted"
                value={`$${baseCash.toFixed(0)}`}
              />
              <StagePayRow
                label={`Verified scans · ${totalScans} × avg $${(scanEarnings / Math.max(totalScans, 1)).toFixed(0)}`}
                value={`$${scanEarnings.toFixed(0)}`}
              />
              <StagePayRow
                label="Milestone bonus · 30+ scans"
                value={
                  milestoneBonus > 0 ? `$${milestoneBonus.toFixed(0)}` : "—"
                }
              />
              <StagePayRow
                label="Total"
                value={
                  <span className="wrp__total">${grandTotal.toFixed(0)}</span>
                }
              />
            </ul>
          </StageCard>

          {/* Attribution timeline — full row (7-day mini bar chart
              needs full grid width to read) */}
          <StageCard
            eyebrow="Attribution timeline"
            title={`${totalScans} verified scans · 7 days`}
            full
          >
            <div className="wrp__chart">
              {TIMELINE_DAYS.map((d) => (
                <div key={d.day} className="wrp__bar">
                  <span
                    className="wrp__bar-fill"
                    style={{ height: `${(d.scans / maxScans) * 100}%` }}
                  />
                  <span className="wrp__bar-num">{d.scans}</span>
                  <span className="wrp__bar-day">{d.day}</span>
                </div>
              ))}
            </div>
            <p className="wrp__chart-meta">
              Peak: <strong>{peakDay.day}</strong> · {peakDay.scans} scans · $
              {peakDay.dollars}. Per v5.4 decay curve, scans within 24h of post
              count 100%; later scans tier down (50 / 30 / 10 / 0).
            </p>
          </StageCard>

          {/* Cohort compare */}
          <StageCard eyebrow="Cohort compare" title="vs same-tier creators">
            <div className="wrp__cohort">
              <StageStat
                size="lg"
                num={`+${Math.round((scanEarnings / baseCash) * 100)}%`}
                label="Scan yield"
                helper={`Cohort avg +42%`}
              />
              <StageStat
                size="lg"
                num={`${peakDay.scans}`}
                label="Peak day scans"
                helper={`Cohort avg 9`}
              />
              <StageStat
                size="lg"
                num="4.8"
                label="Merchant rating"
                helper="Cohort avg 4.6"
              />
              <StageStat
                size="lg"
                num="2"
                label="Days to first scan"
                helper="Cohort avg 4"
              />
            </div>
            <p className="wrp__learning">
              <strong>Insight.</strong> Your Wed peak ($168) carried the gig.
              Coffee verticals over-index Wed/Thu in this neighborhood —
              schedule next campaign around that lift.
            </p>
          </StageCard>
        </StageMain>

        <StageRail ariaLabel="Payout and close-out">
          {/* Big earnings ink card */}
          <StageRailCard variant="primary" label="Total earned">
            <span className="wrp__rail-num">${grandTotal.toFixed(0)}</span>
            <p className="stg__rail-help">
              Ready to withdraw to your linked Venmo. Per Push policy (v5.4),
              funds settle directly via Stripe Connect — Push never holds the
              cash.
            </p>
            <StageButtonStack>
              <StageButton variant="primary">
                Withdraw ${grandTotal.toFixed(0)}
              </StageButton>
              <StageButton variant="ghost">View statement</StageButton>
            </StageButtonStack>
          </StageRailCard>

          {/* Rate merchant */}
          <StageRailCard
            label="Rate {c.merchantName}"
            heading="Help future creators"
          >
            <div className="wrp__rate">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  className="wrp__star"
                  aria-label={`Rate ${s} star${s === 1 ? "" : "s"}`}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="stg__rail-help">
              Your rating is private to Push and feeds the merchant trust score.
            </p>
          </StageRailCard>

          {/* Repeat / close-out */}
          <StageRailCard label="What's next">
            <StageButtonStack>
              <StageButton variant="secondary" href="/creator/discover">
                Find next gig
              </StageButton>
              <StageButton variant="pink" href="/creator/portfolio">
                Save to portfolio
              </StageButton>
              <StageButton variant="ghost" href="/creator/comms">
                Thank merchant
              </StageButton>
            </StageButtonStack>
          </StageRailCard>
        </StageRail>
      </StageTwoCol>
    </StageShell>
  );
}
