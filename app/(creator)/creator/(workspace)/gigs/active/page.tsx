"use client";

import { useWorkspaceState } from "@/lib/workspace/state";
import { PaneHeader, EmptyState } from "@/lib/inbox/components";

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

export default function ActiveGigsPage() {
  const { invites } = useWorkspaceState();
  const activeGigs = invites.filter((i) => i.status === "accepted");

  return (
    <section className="ib-content">
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
        <ul className="gigs-active-list">
          {activeGigs.map((gig) => (
            <li key={gig.id} className="gigs-active-row">
              <span className="gigs-active-brand">{gig.brand}</span>
              <span className="gigs-active-campaign">{gig.campaign}</span>
              <span className="gigs-active-window">{gig.shootWindow}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
