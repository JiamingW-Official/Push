"use client";

/* ============================================================
   <GigCard> — universal gig card. The atomic unit of Mission
   Control. Composes StatusPill + StageTracker + NextActionBar.

   Variants:
     "priority" — large card for "NEEDS YOU NOW" rail
                   (prominent header, full-size stage tracker,
                    next-action with up to 3 buttons)
     "compact"  — small row for "ALL GIGS" list
                   (1-line header, mini stage dots, single CTA)

   Same data shape for both — switching variant just swaps layout.
   ============================================================ */

import Link from "next/link";
import type { GigWithPriority } from "@/lib/creator/gigs/stage";
import { STAGE_META } from "@/lib/creator/gigs/stage";
import { StatusPill } from "./StatusPill";
import { StageTracker } from "./StageTracker";
import { NextActionBar, type ActionButton } from "./NextActionBar";
import { ChevronRight } from "lucide-react";

interface Props {
  item: GigWithPriority;
  variant?: "priority" | "compact";
  /** Optional: override the auto-derived action buttons. */
  actions?: ActionButton[];
}

/* Auto-derive default action buttons based on stage + urgency.
   Each row maps to a real route in the existing creator workspace,
   so the card always has somewhere meaningful to drill into. */
function deriveDefaultActions(item: GigWithPriority): ActionButton[] {
  const { stage, gig, priority } = item;
  const briefHref = gig.briefHref || `/creator/campaigns/${gig.id}`;
  const inboxHref = `/creator/inbox?campaign=${encodeURIComponent(gig.id)}`;

  switch (stage) {
    case 1:
      return [
        {
          label: "Review invite",
          href: "/creator/gigs/invites",
          variant: "primary",
        },
        { label: "Decline", href: "/creator/gigs/invites", variant: "ghost" },
      ];
    case 2:
      return [
        { label: "Finish prep", href: briefHref, variant: "primary" },
        { label: "Open brief", href: briefHref, variant: "ghost" },
      ];
    case 3:
      return [
        { label: "Open shoot brief", href: briefHref, variant: "primary" },
        { label: "Get directions", href: briefHref, variant: "secondary" },
        { label: "Message", href: inboxHref, variant: "ghost" },
      ];
    case 4:
      // STUCK case gets primary nudge
      if (priority.urgency === "stuck") {
        return [
          { label: "Send nudge", href: inboxHref, variant: "primary" },
          { label: "View campaign", href: briefHref, variant: "ghost" },
        ];
      }
      return [
        { label: "View campaign", href: briefHref, variant: "primary" },
        { label: "Message merchant", href: inboxHref, variant: "ghost" },
      ];
    case 5:
      return [
        {
          label: "Track scans",
          href: "/creator/analytics/attribution",
          variant: "primary",
        },
        { label: "View campaign", href: briefHref, variant: "ghost" },
      ];
    case 6:
      return [{ label: "View campaign", href: briefHref, variant: "ghost" }];
    case 7:
      return [{ label: "View receipt", href: briefHref, variant: "ghost" }];
  }
}

function fmtTier(gig: GigWithPriority["gig"]) {
  const target = gig.payoutTiers.find((t) => t.label === "Target");
  return target ? `$${target.amount}` : `$${gig.payoutTiers[0]?.amount ?? 0}`;
}

export function GigCard({ item, variant = "priority", actions }: Props) {
  const { gig, stage, priority } = item;
  const meta = STAGE_META[stage];
  const acts = actions ?? deriveDefaultActions(item);
  const isStuck = priority.urgency === "stuck";

  if (variant === "compact") {
    return (
      <Link
        href={gig.briefHref || `/creator/campaigns/${gig.id}`}
        className={`gigs-card gigs-card--compact gigs-card--${priority.urgency}`}
      >
        <div className="gigs-card__brand">
          <span className="gigs-card__initial">{gig.brandInitial}</span>
        </div>
        <div className="gigs-card__compact-body">
          <div className="gigs-card__compact-row">
            <span className="gigs-card__brand-name">{gig.brand}</span>
            <StatusPill
              urgency={priority.urgency}
              countdown={priority.countdown}
              size="sm"
            />
          </div>
          <p className="gigs-card__compact-meta">
            {gig.campaign}
            <span className="gigs-card__sep">·</span>
            <span className="gigs-card__tier">{fmtTier(gig)}</span>
          </p>
          <StageTracker stage={stage} stuck={isStuck} size="sm" />
        </div>
        <ChevronRight
          size={16}
          strokeWidth={2}
          className="gigs-card__arrow"
          aria-hidden
        />
      </Link>
    );
  }

  return (
    <article
      className={`gigs-card gigs-card--priority gigs-card--${priority.urgency}`}
    >
      <header className="gigs-card__head">
        <div className="gigs-card__head-left">
          <span className="gigs-card__brand">
            <span className="gigs-card__initial">{gig.brandInitial}</span>
          </span>
          <div className="gigs-card__title-block">
            <h3 className="gigs-card__brand-name">{gig.brand}</h3>
            <p className="gigs-card__campaign">{gig.campaign}</p>
          </div>
        </div>
        <div className="gigs-card__head-right">
          <StatusPill
            urgency={priority.urgency}
            countdown={priority.countdown}
            size="md"
          />
          <span className="gigs-card__tier">{fmtTier(gig)}</span>
        </div>
      </header>

      {priority.reason && (
        <p className="gigs-card__reason">{priority.reason}</p>
      )}

      <div className="gigs-card__stage-wrap">
        <StageTracker stage={stage} stuck={isStuck} size="lg" />
      </div>

      <NextActionBar owner={meta.owner} hint={meta.nextHint} actions={acts} />
    </article>
  );
}
