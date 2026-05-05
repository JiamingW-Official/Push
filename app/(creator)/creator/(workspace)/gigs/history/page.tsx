"use client";

import { useWorkspaceState } from "@/lib/workspace/state";
import { PaneHeader, EmptyState } from "@/lib/inbox/components";
import { getCategoryGradient } from "@/lib/inbox/seed";

function HistoryIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <circle cx="20" cy="20" r="13" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M20 13v7l5 3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function GigsHistoryPage() {
  const { invites } = useWorkspaceState();

  const accepted = invites.filter((i) => i.status === "accepted");
  const declined = invites.filter((i) => i.status === "declined");

  // Accepted first (most valuable), then declined
  const history = [
    ...accepted.map((i) => ({ ...i, outcome: "accepted" as const })),
    ...declined.map((i) => ({ ...i, outcome: "declined" as const })),
  ];

  const totalGuaranteed = accepted.reduce((sum, i) => {
    const g = i.payoutTiers.find((t) => t.label === "Guaranteed");
    return sum + (g?.amount ?? 0);
  }, 0);

  const acceptRate =
    history.length > 0
      ? Math.round((accepted.length / history.length) * 100)
      : 0;

  return (
    <section className="ib-content gigs-pane" data-lenis-prevent>
      <PaneHeader
        title="History"
        sub={
          history.length > 0
            ? `${history.length} campaign${history.length === 1 ? "" : "s"} total`
            : "No history yet"
        }
      />

      {history.length > 0 && (
        <div className="gigs-stats-bar" aria-label="Campaign summary">
          <div className="gigs-stat-tile">
            <span className="gigs-stat-value">{accepted.length}</span>
            <span className="gigs-stat-label">Accepted</span>
          </div>
          <div className="gigs-stat-tile gigs-stat-tile--money">
            <span className="gigs-stat-value">${totalGuaranteed}</span>
            <span className="gigs-stat-label">Guaranteed</span>
          </div>
          <div className="gigs-stat-tile">
            <span className="gigs-stat-value">{declined.length}</span>
            <span className="gigs-stat-label">Passed</span>
          </div>
          <div className="gigs-stat-tile">
            <span className="gigs-stat-value">{acceptRate}%</span>
            <span className="gigs-stat-label">Accept rate</span>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <EmptyState
          icon={<HistoryIcon />}
          title="Nothing here yet."
          body="Completed and declined campaigns will appear here."
          cta={{ label: "View invites", href: "/creator/gigs/invites" }}
        />
      ) : (
        <ul className="gigs-history-list" role="list">
          {history.map((gig) => {
            const gradient = getCategoryGradient(gig.category);
            const guaranteed = gig.payoutTiers.find(
              (t) => t.label === "Guaranteed",
            );
            const isAccepted = gig.outcome === "accepted";
            return (
              <li key={gig.id}>
                <div
                  className={`gigs-history-row gigs-history-row--${gig.outcome}`}
                >
                  <span
                    className="gigs-history-avatar"
                    style={{ background: gradient }}
                    aria-hidden
                  >
                    {gig.brandInitial}
                  </span>

                  <div className="gigs-history-body">
                    <span className="gigs-history-brand">{gig.brand}</span>
                    <span className="gigs-history-campaign">
                      {gig.campaign}
                    </span>
                    <span className="gigs-history-window">
                      {gig.shootWindow}
                    </span>
                  </div>

                  <div className="gigs-history-right">
                    <span
                      className={`gigs-history-badge gigs-history-badge--${gig.outcome}`}
                    >
                      {isAccepted ? "ACCEPTED" : "PASSED"}
                    </span>
                    {isAccepted && guaranteed && (
                      <span className="gigs-history-earned">
                        +${guaranteed.amount} guaranteed
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
