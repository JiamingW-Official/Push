"use client";

import Link from "next/link";
import { useWorkspaceState } from "@/lib/workspace/state";
import { useNow } from "@/lib/workspace/hooks";
import { PaneHeader, EmptyState } from "@/lib/inbox/components";
import { getCategoryGradient, type Invite } from "@/lib/inbox/seed";

/* Days remaining in a "Mon 5/5 — Sat 5/10" shoot window string */
function shootDaysLeft(shootWindow: string, now: number): string {
  const m = shootWindow.match(/(\d{1,2})\/(\d{1,2})/g);
  if (!m || m.length < 2) return "";
  const [endM, endD] = m[1].split("/").map(Number);
  const yr = new Date().getFullYear();
  const endTs = new Date(yr, endM - 1, endD, 23, 59).getTime();
  const ms = endTs - now;
  if (ms <= 0) return "Window closed";
  const days = Math.ceil(ms / (24 * 60 * 60 * 1000));
  if (days === 1) return "Last day";
  return `${days}d left`;
}

function BriefcaseIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect
        x="8"
        y="16"
        width="24"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M14 16v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M8 24h24"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StepCheck({ done }: { done: boolean }) {
  if (done) {
    return (
      <svg
        className="gig-step-icon gig-step-icon--done"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
      >
        <circle cx="8" cy="8" r="7.25" fill="var(--ink)" />
        <path
          d="M4.5 8.25l2.25 2.25 4.5-4.5"
          stroke="var(--snow)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg
      className="gig-step-icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <circle
        cx="8"
        cy="8"
        r="7.25"
        stroke="var(--mist, #d8d4c8)"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function GigCard({ gig, now }: { gig: Invite; now: number | null }) {
  const gradient = getCategoryGradient(gig.category);
  const guaranteed = gig.payoutTiers.find((t) => t.label === "Guaranteed");
  const target = gig.payoutTiers.find((t) => t.label === "Target");
  const stretch = gig.payoutTiers.find((t) => t.label === "Stretch");
  const steps = gig.acceptSteps ?? [];
  const doneCount = steps.filter((s) => s.done).length;
  const allDone = steps.length > 0 && doneCount === steps.length;
  const daysLeft = now ? shootDaysLeft(gig.shootWindow, now) : null;
  const isClosed = daysLeft === "Window closed";
  const isUrgent =
    !isClosed &&
    (daysLeft === "Last day" ||
      (daysLeft?.endsWith("d left") ? parseInt(daysLeft) <= 2 : false));

  return (
    <article className={`gig-card${isClosed ? " gig-card--closed" : ""}`}>
      {/* Category gradient accent strip */}
      <div
        className="gig-card-accent"
        style={{ background: gradient }}
        aria-hidden
      />

      <div className="gig-card-inner">
        {/* Header: avatar · brand · campaign · score */}
        <div className="gig-card-header">
          <span
            className="gig-card-avatar"
            style={{ background: gradient }}
            aria-hidden
          >
            {gig.brandInitial}
          </span>
          <div className="gig-card-head-text">
            <span className="gig-card-brand">{gig.brand}</span>
            <span className="gig-card-campaign">{gig.campaign}</span>
          </div>
          <span
            className="gig-card-score"
            aria-label={`${gig.matchScore}% Watch score`}
          >
            {gig.matchScore}%
          </span>
        </div>

        {/* Body: shoot window + payout tiers side by side */}
        <div className="gig-card-body">
          <div className="gig-card-window-col">
            <span className="gig-card-eyebrow">SHOOT WINDOW</span>
            <span className="gig-card-window-range">{gig.shootWindow}</span>
            {daysLeft && (
              <span
                className={[
                  "gig-card-countdown",
                  isClosed ? "gig-card-countdown--closed" : "",
                  isUrgent && !isClosed ? "gig-card-countdown--urgent" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {daysLeft}
              </span>
            )}
          </div>

          <div className="gig-card-tiers-col">
            <span className="gig-card-eyebrow">PAYOUT</span>
            <div className="gig-card-tiers">
              {[guaranteed, target, stretch].filter(Boolean).map((tier) => (
                <div key={tier!.label} className="gig-card-tier">
                  <span className="gig-card-tier-label">{tier!.label}</span>
                  <span className="gig-card-tier-amt">${tier!.amount}</span>
                  <span className="gig-card-tier-trigger">{tier!.trigger}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Checklist — collapsed to banner when all steps done */}
        {steps.length > 0 && (
          <div className="gig-card-checklist">
            {allDone ? (
              <div
                className="gig-card-ready"
                aria-label="All setup steps complete"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden
                >
                  <circle cx="8" cy="8" r="7.25" fill="var(--ink)" />
                  <path
                    d="M4.5 8.25l2.25 2.25 4.5-4.5"
                    stroke="var(--snow)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>All set · ready to shoot</span>
              </div>
            ) : (
              <>
                <div className="gig-card-checklist-head">
                  <span className="gig-card-eyebrow">CHECKLIST</span>
                  <span className="gig-card-checklist-frac">
                    {doneCount}/{steps.length}
                  </span>
                </div>
                <div
                  className="gig-card-progress-track"
                  role="progressbar"
                  aria-valuenow={doneCount}
                  aria-valuemax={steps.length}
                  aria-label={`${doneCount} of ${steps.length} steps complete`}
                >
                  <div
                    className="gig-card-progress-fill"
                    style={{ width: `${(doneCount / steps.length) * 100}%` }}
                  />
                </div>
                <ul className="gig-card-steps" role="list">
                  {steps.map((step) => (
                    <li
                      key={step.id}
                      className={`gig-card-step${step.done ? " is-done" : ""}`}
                    >
                      <StepCheck done={step.done} />
                      {step.done ? (
                        <span>{step.label}</span>
                      ) : (
                        <Link href={step.href}>{step.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        {/* Footer CTAs — simplified when ready to shoot */}
        <div className="gig-card-foot">
          {allDone ? (
            <>
              <Link
                href={`/creator/campaigns/${gig.id}/shoot`}
                className="gig-card-cta gig-card-cta--go"
              >
                Go shoot →
              </Link>
              <Link
                href="/creator/inbox/messages"
                className="gig-card-cta gig-card-cta--ghost"
              >
                Message Brand
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/creator/campaigns/${gig.id}/calendar`}
                className="gig-card-cta"
              >
                Open Calendar
              </Link>
              <Link href={gig.briefHref} className="gig-card-cta">
                View Brief
              </Link>
              <Link
                href="/creator/inbox/messages"
                className="gig-card-cta gig-card-cta--ghost"
              >
                Message Brand
              </Link>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ActiveGigsPage() {
  const { invites } = useWorkspaceState();
  const now = useNow();
  const activeGigs = invites.filter((i) => i.status === "accepted");

  return (
    <section className="ib-content gigs-pane" data-lenis-prevent>
      <PaneHeader
        title="Active"
        sub={
          activeGigs.length > 0
            ? `${activeGigs.length} campaign${activeGigs.length === 1 ? "" : "s"} in progress`
            : "No active campaigns"
        }
      />

      {activeGigs.length === 0 ? (
        <EmptyState
          icon={<BriefcaseIcon />}
          title="Nothing active yet."
          body="Accepted invites will appear here once you start a campaign."
          cta={{ label: "Browse invites", href: "/creator/gigs/invites" }}
        />
      ) : (
        <ul className="gig-card-list" role="list">
          {activeGigs.map((gig) => (
            <li key={gig.id}>
              <GigCard gig={gig} now={now} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
