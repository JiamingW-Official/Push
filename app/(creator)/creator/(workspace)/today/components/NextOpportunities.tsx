"use client";

import Link from "next/link";
import { Button } from "@/lib/workspace/buttons";
import type { Invite } from "@/lib/inbox/seed";

interface NextOpportunitiesProps {
  invites: Invite[];
  now: number | null;
}

function formatCountdown(expiresAt: number, now: number): string {
  const ms = expiresAt - now;
  if (ms <= 0) return "expired";
  const hours = Math.floor(ms / 3_600_000);
  const mins = Math.floor((ms % 3_600_000) / 60_000);
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days}d left`;
  }
  if (hours >= 1) return `${hours}h ${mins}m left`;
  return `${mins}m left`;
}

export default function NextOpportunities({
  invites,
  now,
}: NextOpportunitiesProps) {
  if (invites.length === 0) return null;

  const count = invites.length;
  const sub = `${count} match${count === 1 ? "" : "es"}`;

  return (
    <section aria-label="Next opportunities">
      <header style={{ marginBottom: 16 }}>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            fontWeight: 800,
            color: "var(--ink)",
            margin: 0,
          }}
        >
          Next up
        </p>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--ink-4)",
            margin: "4px 0 0",
          }}
        >
          {sub}
        </p>
      </header>
      <div className="opps-grid">
        {invites.map((invite) => (
          <div key={invite.id} className="opp-card">
            <span className="opp-watch">Watch% {invite.matchScore}</span>
            <p className="opp-brand">{invite.brand}</p>
            <p className="opp-category">{invite.category}</p>
            <p className="opp-countdown" suppressHydrationWarning>
              {now != null ? formatCountdown(invite.expiresAt, now) : "—"}
            </p>
            <Link href={`/creator/gigs/invites?focus=${invite.id}`}>
              <Button variant="primary" size="sm">
                View invite
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
