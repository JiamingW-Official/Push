"use client";

/* ============================================================
   /creator/work/active — Stages 04-06 list (in-flight gigs)
   v2 · 2026-05-08 — adds sticky right rail (stage breakdown
   primary ink + most-urgent callout + quick filter + help CTA)
   to match the rest of the funnel pages. Each row deep-links
   into its current stage detail page.
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
  StagePayRow,
  StageButton,
  StageButtonStack,
} from "@/components/shared/stage";

type Stage = "confirmed" | "shoot" | "submit";

const ACTIVE = MOCK_CAMPAIGNS.slice(0, 3).map((c, i) => ({
  ...c,
  stage: (["shoot", "confirmed", "submit"] as Stage[])[i],
  nextLabel: ["Submit by 6 PM", "Shoot · tomorrow 2 PM", "Awaiting verification"][i],
  urgency: (["warn", "ok", "info"] as ("ok" | "warn" | "info")[])[i],
}));

/* v10 — engineering "Stage 04/05/06" labels removed in favor of
   user-facing verbs. Internal stage data unchanged. */
const STAGE_PILL: Record<Stage, string> = {
  confirmed: "Confirmed · prep",
  shoot: "Shooting",
  submit: "Submitted",
};
const STAGE_PILL_TONE: Record<Stage, "info" | "warn" | "champagne"> = {
  confirmed: "champagne",
  shoot: "warn",
  submit: "info",
};
const STAGE_HREF: Record<Stage, string> = {
  confirmed: "confirmed",
  shoot: "active",
  submit: "submit",
};

export default function ActiveListPage() {
  const confirmedCount = ACTIVE.filter((g) => g.stage === "confirmed").length;
  const shootCount = ACTIVE.filter((g) => g.stage === "shoot").length;
  const submitCount = ACTIVE.filter((g) => g.stage === "submit").length;
  const mostUrgent = ACTIVE.find((g) => g.urgency === "warn") ?? ACTIVE[0];

  return (
    <StageShell
      backHref="/creator/work"
      backLabel="← Back to work"
      ariaLabel="Active gigs list"
    >
      <StageHeader
        eyebrow="Active · stages 04-06"
        title={`${ACTIVE.length} gigs in flight`}
        sub="Every active gig with its current stage and the next action you owe. Tap a row to open the stage detail page — Confirmed for handshake, Shoot for capture, Submit for handoff."
      />

      <StageTwoCol>
        <StageMain className="stg__main--single">
          <StageCard eyebrow="Sorted by SLA" title="Most urgent first">
            <ul className="stg__list">
              {ACTIVE.map((g) => (
                <li key={g.id} className="stg__row">
                  <Link
                    href={`/creator/work/${STAGE_HREF[g.stage]}/${g.id}`}
                    className="stg__row-link"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="stg__row-img" src={g.images[0]} alt="" />
                    <div className="stg__row-body">
                      <span className="stg__row-title">{g.title}</span>
                      <span className="stg__row-meta">
                        {g.merchantName} · {g.neighborhood}
                      </span>
                    </div>
                    <div className="stg__row-right">
                      <span className={`stg__row-pill stg__row-pill--${STAGE_PILL_TONE[g.stage]}`}>
                        {STAGE_PILL[g.stage]}
                      </span>
                      <span className={`stg__row-pill stg__row-pill--${g.urgency}`}>
                        {g.nextLabel}
                      </span>
                    </div>
                    <span className="stg__row-arrow" aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </StageCard>
        </StageMain>

        <StageRail ariaLabel="Active gigs summary">
          {/* Stage breakdown — primary ink card */}
          <StageRailCard
            variant="primary"
            label="In flight"
            heading={`${ACTIVE.length} gigs across stages 04-06`}
          >
            <ul className="stg__pay-list">
              <StagePayRow
                label={
                  <>
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--champagne)", marginRight: 8 }} />
                    Confirmed · prep
                  </>
                }
                value={String(confirmedCount)}
              />
              <StagePayRow
                label={
                  <>
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--warning)", marginRight: 8 }} />
                    Shooting
                  </>
                }
                value={String(shootCount)}
              />
              <StagePayRow
                label={
                  <>
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--accent-blue)", marginRight: 8 }} />
                    Submitted
                  </>
                }
                value={String(submitCount)}
              />
            </ul>
          </StageRailCard>

          {/* Most urgent */}
          {mostUrgent && (
            <StageRailCard
              label="Most urgent"
              heading={mostUrgent.title}
              help={`${mostUrgent.merchantName} · ${mostUrgent.nextLabel}`}
            >
              <StageButton
                variant="primary"
                href={`/creator/work/${STAGE_HREF[mostUrgent.stage]}/${mostUrgent.id}`}
              >
                {/* v10 — was "Open " + STAGE_PILL split which depended
                    on "Stage 04 · Confirmed" format. Now uses pill
                    label directly (e.g. "Open Shooting"). */}
                Open {STAGE_PILL[mostUrgent.stage].split("·")[0].trim()}
              </StageButton>
            </StageRailCard>
          )}

          {/* Help */}
          <StageRailCard
            label="Need help?"
            help="Stuck on a brief or need to reschedule? Open the merchant thread — they reply within an hour on average."
          >
            {/* v10 — was variant="secondary" (N2W blue filled) which
                competed with the red primary "Open shooting" CTA above.
                Demoted to ghost so the page has a single clear primary. */}
            <StageButton variant="ghost" href="/creator/comms">
              Open inbox
            </StageButton>
          </StageRailCard>

          {/* Next */}
          <StageRailCard label="Next">
            <StageButtonStack>
              <StageButton variant="ghost" href="/creator/discover">
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
