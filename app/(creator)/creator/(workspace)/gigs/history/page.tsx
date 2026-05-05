"use client";

import { useWorkspaceState } from "@/lib/workspace/state";
import { PaneHeader, EmptyState } from "@/lib/inbox/components";

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
  const past = invites.filter((i) => i.status === "declined");

  return (
    <section className="ib-content">
      <PaneHeader
        title="History"
        sub={past.length > 0 ? `${past.length} passed` : "No history yet"}
      />

      {past.length === 0 ? (
        <EmptyState
          icon={<HistoryIcon />}
          title="Nothing here yet."
          body="Completed and declined campaigns will appear here."
          cta={{ label: "View invites", href: "/creator/gigs/invites" }}
        />
      ) : (
        <ul className="gigs-history-list">
          {past.map((gig) => (
            <li key={gig.id} className="gigs-history-row">
              <span className="gigs-history-brand">{gig.brand}</span>
              <span className="gigs-history-campaign">{gig.campaign}</span>
              <span className="gigs-history-status">{gig.status}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
