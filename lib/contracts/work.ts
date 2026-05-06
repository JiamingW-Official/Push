/**
 * WORK domain contracts. Audit § 6 type-first spec.
 *
 * Routes:
 *   - GET   /api/creator/gigs?status[]                     → GigsList
 *   - PATCH /api/creator/gigs/{id}/phase                   → PhaseTransition
 *   - POST  /api/creator/gigs/{id}/uploads                 → UploadResult
 *   - GET   /api/creator/timeline?date                     → TimelineDay
 *   - GET   /api/creator/calendar?from&to                  → CalendarRange
 *   - POST  /api/creator/calendar/block                    → BlockResult
 *   - GET   /api/creator/drafts                            → DraftList
 *   - GET   /api/creator/disputes?status[]                 → DisputeList
 *   - POST  /api/creator/disputes                          → DisputeFiling
 */

export type GigPhase =
  | "outreach"
  | "shooting"
  | "submitted"
  | "verified"
  | "paid"
  | "closed"
  | "declined";

export type Gig = {
  id: string;
  campaignId: string;
  brand: string;
  brandInitial: string;
  category: string;
  phase: GigPhase;
  /** Phase entered at — ISO. Used for "X days in this phase" logic. */
  phaseEnteredAtIso: string;
  shootWindowStartIso: string | null;
  shootWindowEndIso: string | null;
  guaranteedCents: number;
  targetCents: number;
  stretchCents: number;
  /** Verified scans so far. */
  scansVerified: number;
  /** Acceptance checklist completion 0..1. */
  acceptStepsProgress: number;
};

export type GigsList = {
  rows: Gig[];
  countsByPhase: Record<GigPhase, number>;
};

export type PhaseTransition = {
  gigId: string;
  fromPhase: GigPhase;
  toPhase: GigPhase;
  transitionedAtIso: string;
};

/* ── Timeline (today's tasks across campaigns) ────────────── */

export type TimelineEvent = {
  id: string;
  /** ISO datetime — local-rendered by client. */
  atIso: string;
  /** Duration in minutes. null = point-in-time. */
  durationMin: number | null;
  kind: "shoot" | "deadline" | "post" | "review" | "block";
  brand: string | null;
  campaignId: string | null;
  title: string;
  detail: string;
};

export type TimelineDay = {
  dateIso: string;
  events: TimelineEvent[];
  conflicts: {
    eventA: string;
    eventB: string;
    reason: "overlap" | "back-to-back" | "travel-time";
  }[];
};

/* ── Calendar range query ─────────────────────────────────── */

export type CalendarRange = {
  fromIso: string;
  toIso: string;
  events: TimelineEvent[];
  blocks: { fromIso: string; toIso: string; reason: string }[];
};

/* ── Drafts ───────────────────────────────────────────────── */

export type Draft = {
  id: string;
  campaignId: string;
  brand: string;
  status: "writing" | "in-review" | "approved" | "needs-changes";
  /** Latest version number. */
  version: number;
  /** Last edit ISO. */
  updatedAtIso: string;
  /** Reviewer if any. */
  reviewer: string | null;
  reviewerNote: string | null;
};

export type DraftList = { rows: Draft[] };

/* ── Disputes ─────────────────────────────────────────────── */

export type DisputeStatus =
  | "open"
  | "under_review"
  | "awaiting_response"
  | "resolved"
  | "closed";

export type Dispute = {
  id: string;
  campaignId: string;
  brand: string;
  filedAtIso: string;
  status: DisputeStatus;
  /** Free-text summary the creator filed. */
  summary: string;
  /** Latest decision note from admin. */
  resolutionNote: string | null;
  resolutionAmountCents: number | null;
};

export type DisputeList = { rows: Dispute[] };

export type DisputeFiling = {
  campaignId: string;
  reason: "payment" | "scope" | "harassment" | "other";
  summary: string;
  /** Signed S3 URLs of attached evidence. */
  attachments: string[];
};
