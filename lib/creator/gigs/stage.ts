/* ============================================================
   lib/creator/gigs/stage.ts — Universal 7-stage gig lifecycle.

   Every gig in Push (whether sourced from /invites, /active, or
   /history) maps onto one of 7 lifecycle stages. This module owns:

     1. Stage derivation     — Invite → 1..7
     2. Stage metadata       — labels, owners, next-action copy
     3. Priority scoring     — urgency-aware ranking for hub display
     4. Grouping helpers     — split gigs into action buckets

   Used by /creator/gigs (Mission Control hub), and reusable on
   /today, /work, and any creator surface that needs gig priority.
   ============================================================ */

import type { Invite } from "@/lib/inbox/seed";

/* ── 7 stages of a gig's life ────────────────────────────── */

export type GigStage = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type GigOwner = "creator" | "merchant" | "system" | "done";

export interface StageMeta {
  stage: GigStage;
  label: string;
  /** "Who's blocking the next move?" — drives the "Next" copy + tone. */
  owner: GigOwner;
  /** Short verb-phrase shown as Next: ____ */
  nextHint: string;
}

export const STAGE_META: Record<GigStage, StageMeta> = {
  1: {
    stage: 1,
    label: "Invited",
    owner: "creator",
    nextHint: "Accept or decline",
  },
  2: {
    stage: 2,
    label: "Accepted",
    owner: "creator",
    nextHint: "Schedule the shoot",
  },
  3: {
    stage: 3,
    label: "Shoot",
    owner: "creator",
    nextHint: "Capture & upload",
  },
  4: {
    stage: 4,
    label: "Posted",
    owner: "merchant",
    nextHint: "Awaiting merchant review",
  },
  5: { stage: 5, label: "Live", owner: "system", nextHint: "Tracking scans" },
  6: {
    stage: 6,
    label: "Verified",
    owner: "system",
    nextHint: "Clearing payout",
  },
  7: { stage: 7, label: "Paid", owner: "done", nextHint: "Receipt available" },
};

/* ── Urgency classification — drives status-pill color ───── */

export type UrgencyKind =
  | "overdue" // past deadline, action due
  | "today" // due today
  | "soon" // due in <24h
  | "invite" // pending invite, expires soon
  | "stuck" // waiting on merchant >3d
  | "live" // in flight, no action needed
  | "done"; // paid / closed

export interface Priority {
  score: number;
  urgency: UrgencyKind;
  /** One-line reason shown next to the urgency chip. */
  reason: string;
  /** Optional countdown hint (e.g. "2d overdue", "expires 4h"). */
  countdown?: string;
}

/* ── Derive a stage from raw Invite data ─────────────────── */

const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = 24 * ONE_HOUR;

/**
 * Map Invite → 1..7. Best-effort heuristics over existing fields.
 * Falls back to lower stages when ambiguous (safer for prioritization
 * because lower stages are creator-owned).
 */
export function deriveStage(gig: Invite, now: number = Date.now()): GigStage {
  // Stage 1 — pending invitation
  if (gig.status === "pending") return 1;

  // Declined gigs are effectively closed; treat as Paid bucket so they
  // sort to the bottom and don't block the priority queue.
  if (gig.status === "declined") return 7;

  // Accepted track ─────────────────────────────────
  const steps = gig.acceptSteps ?? [];
  const allStepsDone = steps.length > 0 && steps.every((s) => s.done);

  // shoot window timing
  const wm = gig.shootWindow.match(/(\d{1,2})\/(\d{1,2})/g);
  let shootStartTs: number | null = null;
  let shootEndTs: number | null = null;
  if (wm && wm.length >= 1) {
    const [sM, sD] = wm[0].split("/").map(Number);
    const yr = new Date().getFullYear();
    shootStartTs = new Date(yr, sM - 1, sD, 9).getTime();
    if (wm.length >= 2) {
      const [eM, eD] = wm[1].split("/").map(Number);
      shootEndTs = new Date(yr, eM - 1, eD, 23, 59).getTime();
    } else {
      shootEndTs = shootStartTs + 12 * ONE_HOUR;
    }
  }

  // Stage 2 — Accepted but accept-checklist not done yet
  if (!allStepsDone) return 2;

  // Stage 3 — Shoot day or window open
  if (shootEndTs != null && now <= shootEndTs) return 3;

  // Stage 4 — shoot window closed → posted/awaiting review
  // (we don't have explicit posted/live/verified flags yet, so use
  //  time-since-shoot-end as a heuristic: 0-7d posted, 7-21d live,
  //  21-45d verified, 45d+ paid.)
  if (shootEndTs != null) {
    const sinceEnd = now - shootEndTs;
    if (sinceEnd < 7 * ONE_DAY) return 4;
    if (sinceEnd < 21 * ONE_DAY) return 5;
    if (sinceEnd < 45 * ONE_DAY) return 6;
    return 7;
  }

  // Fallback for accepted-no-window: assume Posted
  return 4;
}

/* ── Priority scoring ────────────────────────────────────── */

/**
 * Compute priority score + urgency classification for a single gig.
 * Higher score = more urgent. Used to sort the Mission Control queue.
 *
 * Two-tier scoring (CLAUDE.md → push-creator: active-first hierarchy):
 *   • Stages 2-7 (ACTIVE WORK)  scores 4-75. Real money on the line,
 *                                always rank above any invite.
 *   • Stage 1   (INVITES)       scores 0-18. Optional opportunities;
 *                                even an "expiring 1h" invite never
 *                                outranks an active in-flight gig — the
 *                                hub shows "what you owe" before
 *                                "what's new for you".
 *
 *   ACTIVE STAGE SCORES:
 *     stage 2 (prep)              22
 *     stage 3 (shoot today)       75   · stuck/soon scaled
 *     stage 3 (shoot <24h)        55
 *     stage 3 (shoot <72h)        40
 *     stage 3 (shoot scheduled)   25
 *     stage 4 (merchant >5d)      65
 *     stage 4 (merchant >3d)      50
 *     stage 4 (posted)            28
 *     stage 5 (live)              24
 *     stage 6 (verified)          20
 *     stage 7 (paid)               4
 *
 *   INVITE SCORES (stage 1, capped at 18):
 *     expired          18  (still notable; flagged in compact list)
 *     <2h to expire    16
 *     <6h to expire    14
 *     <24h to expire   10
 *     <72h to expire    6
 *     default           3
 */
export function computePriority(
  gig: Invite,
  now: number = Date.now(),
): Priority {
  const stage = deriveStage(gig, now);
  const meta = STAGE_META[stage];

  // ── Stage 1 — INVITES (opportunities) ─────────────────────
  // Capped sub-scoring so they never bury active commitments.
  if (stage === 1) {
    const msToExpiry = gig.expiresAt - now;
    if (msToExpiry <= 0) {
      return {
        score: 18,
        urgency: "overdue",
        reason: "Invite expired",
      };
    }
    const hoursLeft = msToExpiry / ONE_HOUR;
    if (hoursLeft < 2) {
      return {
        score: 16,
        urgency: "invite",
        reason: "Invite expiring fast",
        countdown:
          hoursLeft < 1
            ? `${Math.round(hoursLeft * 60)}m left`
            : `${Math.round(hoursLeft)}h left`,
      };
    }
    if (hoursLeft < 6) {
      return {
        score: 14,
        urgency: "invite",
        reason: "Invite expires soon",
        countdown: `${Math.round(hoursLeft)}h left`,
      };
    }
    if (hoursLeft < 24) {
      return {
        score: 10,
        urgency: "invite",
        reason: "Invite open today",
        countdown: `${Math.round(hoursLeft)}h left`,
      };
    }
    if (hoursLeft < 72) {
      return {
        score: 6,
        urgency: "invite",
        reason: "New invite",
        countdown: `${Math.round(hoursLeft / 24)}d left`,
      };
    }
    return {
      score: 3,
      urgency: "invite",
      reason: "New invite",
      countdown: `${Math.round(hoursLeft / 24)}d left`,
    };
  }

  // ── Stages 2-7 — ACTIVE WORK (real commitments) ──────────
  // Base scores guarantee active always > any invite (max 18).

  if (stage === 2) {
    return { score: 22, urgency: "live", reason: "Finish prep checklist" };
  }

  if (stage === 3) {
    const wm = gig.shootWindow.match(/(\d{1,2})\/(\d{1,2})/g);
    if (wm && wm.length >= 1) {
      const [eM, eD] = (wm[1] ?? wm[0]).split("/").map(Number);
      const yr = new Date().getFullYear();
      const endTs = new Date(yr, eM - 1, eD, 23, 59).getTime();
      const msLeft = endTs - now;
      const hoursLeft = msLeft / ONE_HOUR;
      const today = new Date(now).getDate() === eD;
      if (today) {
        return {
          score: 75,
          urgency: "today",
          reason: "Shoot due today",
          countdown: hoursLeft < 24 ? `${Math.round(hoursLeft)}h` : "Today",
        };
      }
      if (hoursLeft < 24) {
        return {
          score: 55,
          urgency: "soon",
          reason: "Shoot window closing",
          countdown: `${Math.round(hoursLeft)}h`,
        };
      }
      if (hoursLeft < 72) {
        return {
          score: 40,
          urgency: "soon",
          reason: "Shoot window open",
          countdown: `${Math.round(hoursLeft / 24)}d left`,
        };
      }
      return {
        score: 25,
        urgency: "live",
        reason: "Shoot scheduled",
        countdown: `${Math.round(hoursLeft / 24)}d`,
      };
    }
    return { score: 25, urgency: "live", reason: "Shoot scheduled" };
  }

  if (stage === 4) {
    const wm = gig.shootWindow.match(/(\d{1,2})\/(\d{1,2})/g);
    let daysSincePost = 0;
    if (wm && wm.length >= 1) {
      const [eM, eD] = (wm[1] ?? wm[0]).split("/").map(Number);
      const yr = new Date().getFullYear();
      const endTs = new Date(yr, eM - 1, eD, 23, 59).getTime();
      daysSincePost = Math.floor((now - endTs) / ONE_DAY);
    }
    if (daysSincePost >= 5) {
      return {
        score: 65,
        urgency: "stuck",
        reason: `Merchant silent ${daysSincePost}d — nudge them`,
        countdown: `${daysSincePost}d`,
      };
    }
    if (daysSincePost >= 3) {
      return {
        score: 50,
        urgency: "stuck",
        reason: `Merchant silent ${daysSincePost}d`,
        countdown: `${daysSincePost}d`,
      };
    }
    return {
      score: 28,
      urgency: "live",
      reason: "Awaiting merchant review",
      countdown: daysSincePost > 0 ? `${daysSincePost}d` : "Just posted",
    };
  }

  if (stage === 5) {
    return { score: 24, urgency: "live", reason: meta.nextHint };
  }

  if (stage === 6) {
    return { score: 20, urgency: "live", reason: meta.nextHint };
  }

  // Stage 7 — Paid / closed
  return { score: 4, urgency: "done", reason: meta.nextHint };
}

/* ── Grouping helpers ────────────────────────────────────── */

export interface GigWithPriority {
  gig: Invite;
  stage: GigStage;
  priority: Priority;
}

export function enrich(
  gigs: Invite[],
  now: number = Date.now(),
): GigWithPriority[] {
  return gigs.map((gig) => ({
    gig,
    stage: deriveStage(gig, now),
    priority: computePriority(gig, now),
  }));
}

export function sortByPriority(items: GigWithPriority[]): GigWithPriority[] {
  return [...items].sort((a, b) => b.priority.score - a.priority.score);
}

/**
 * Counts for the top "Action Strip" — what needs you, by category.
 * Each KPI pill on the strip drives a filter scroll/highlight.
 */
export interface PriorityCounts {
  overdue: number;
  today: number;
  invites: number;
  stuck: number;
  live: number;
  total: number;
}

export function countPriorities(items: GigWithPriority[]): PriorityCounts {
  const counts: PriorityCounts = {
    overdue: 0,
    today: 0,
    invites: 0,
    stuck: 0,
    live: 0,
    total: 0,
  };
  for (const it of items) {
    counts.total++;
    switch (it.priority.urgency) {
      case "overdue":
        counts.overdue++;
        break;
      case "today":
      case "soon":
        counts.today++;
        break;
      case "invite":
        counts.invites++;
        break;
      case "stuck":
        counts.stuck++;
        break;
      case "live":
        counts.live++;
        break;
    }
  }
  return counts;
}

/**
 * Split the priority queue into "needs you now" (top 5 by score, urgency
 * not "live"/"done") and "rest" — for two-tier rendering on the hub.
 */
export function partitionForHub(items: GigWithPriority[]): {
  urgent: GigWithPriority[];
  rest: GigWithPriority[];
} {
  const sorted = sortByPriority(items);
  const urgent = sorted
    .filter(
      (it) => it.priority.urgency !== "live" && it.priority.urgency !== "done",
    )
    .slice(0, 5);
  const urgentIds = new Set(urgent.map((u) => u.gig.id));
  const rest = sorted.filter((it) => !urgentIds.has(it.gig.id));
  return { urgent, rest };
}

/**
 * Split items into 3 buckets that drive the active-first hub layout:
 *   active  — stage 2-6 (committed work in flight; what creator OWES)
 *   invites — stage 1 (opportunities; what's NEW for creator)
 *   closed  — stage 7 (paid / declined / past)
 *
 * Each bucket is pre-sorted by score desc so the caller can just slice
 * the top N for "active first, invites second" hub sections.
 */
export interface PartitionByKind {
  active: GigWithPriority[];
  invites: GigWithPriority[];
  closed: GigWithPriority[];
}

export function partitionByKind(items: GigWithPriority[]): PartitionByKind {
  const out: PartitionByKind = { active: [], invites: [], closed: [] };
  for (const it of items) {
    if (it.stage === 1) out.invites.push(it);
    else if (it.stage === 7) out.closed.push(it);
    else out.active.push(it);
  }
  out.active = sortByPriority(out.active);
  out.invites = sortByPriority(out.invites);
  out.closed = sortByPriority(out.closed);
  return out;
}
