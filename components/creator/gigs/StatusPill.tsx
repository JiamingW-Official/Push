"use client";

/* ============================================================
   <StatusPill> — colored status chip for a gig.

   6 variants mapped to UrgencyKind from lib/creator/gigs/stage.ts:
     overdue (red)   today (orange)  invite (blue)
     stuck   (yellow) live  (graphite) done   (gray)

   Used by GigCard headers + standalone in Action Strip details.
   ============================================================ */

import type { UrgencyKind } from "@/lib/creator/gigs/stage";
import {
  AlertCircle,
  Clock,
  Mail,
  Hourglass,
  Activity,
  CheckCircle2,
} from "lucide-react";

interface Props {
  urgency: UrgencyKind;
  label?: string;
  countdown?: string;
  size?: "sm" | "md";
}

const ICON_MAP: Record<
  UrgencyKind,
  React.ComponentType<{ size: number; strokeWidth: number }>
> = {
  overdue: AlertCircle,
  today: Clock,
  soon: Clock,
  invite: Mail,
  stuck: Hourglass,
  live: Activity,
  done: CheckCircle2,
};

const DEFAULT_LABEL: Record<UrgencyKind, string> = {
  overdue: "Overdue",
  today: "Today",
  soon: "Soon",
  invite: "Invite",
  stuck: "Stuck",
  live: "Live",
  done: "Done",
};

export function StatusPill({ urgency, label, countdown, size = "md" }: Props) {
  const Icon = ICON_MAP[urgency];
  const text = label ?? DEFAULT_LABEL[urgency];
  return (
    <span
      className={`gigs-pill gigs-pill--${urgency} gigs-pill--${size}`}
      aria-label={`Status: ${text}${countdown ? ` · ${countdown}` : ""}`}
    >
      <Icon size={size === "sm" ? 11 : 12} strokeWidth={2.5} />
      <span className="gigs-pill__text">{text}</span>
      {countdown && <span className="gigs-pill__countdown">{countdown}</span>}
    </span>
  );
}
