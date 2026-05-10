"use client";

/* ============================================================
   application-stage.ts — effective-stage computation
   v1 · 2026-05-10

   The stored ApplicationStatus is one source of truth, but the
   creator UX needs a SECOND source: time-window auto-transitions.
   E.g. a merchant accepted yesterday — status='accepted' is stored,
   but if `now >= slotIso - 24h` we should show Stage 3 (pre-shoot)
   not Stage 2 (just-accepted).

   Resolution priority (highest first):
     1. Terminal states — declined / withdrawn / paid / verified /
        submitted / revision_requested / pending_upload — never
        time-shift away from these.
     2. Stored 'reviewing' — never time-shift; merchant decides.
     3. Time-window from slotIso, computed against `nowMs`:
          shoot live window  : slotIso ≤ now ≤ slot + 90min
          post-shoot window  : slot + 90min < now < slot + 48h
          pre-shoot window   : slot - 24h ≤ now < slot
        These promote 'accepted' → pre_shoot / shoot_live, and
        'shoot_live' → pending_upload, etc.
     4. Stored status as-is (the fallback).

   The 60s tick lets time-window transitions fire without a page
   refresh. The hook returns the effective stage; panels render
   based on it, but writes (e.g. setApplicationStage from dev
   switcher) still go to the stored field — and subsequent reads
   prefer the stored value when it's downstream of the time gate.
   ============================================================ */

import { useEffect, useState } from "react";
import type {
  ApplicationStatus,
  CreatorApplication,
} from "@/lib/data/hooks/useCreatorApplications";

/** Stages that cannot be auto-shifted (creator or merchant action,
 *  not time, drives the next move). */
const STICKY_STAGES: ReadonlySet<ApplicationStatus> = new Set([
  "reviewing",
  "declined",
  "withdrawn",
  "pending_upload",
  "submitted",
  "revision_requested",
  "verified",
  "paid",
]);

const SHOOT_LIVE_DURATION_MS = 90 * 60 * 1000;
const POST_SHOOT_GRACE_MS = 48 * 60 * 60 * 1000;
const PRE_SHOOT_LEAD_MS = 24 * 60 * 60 * 1000;

export function computeEffectiveStage(
  app: CreatorApplication,
  nowMs: number = Date.now(),
): ApplicationStatus {
  if (STICKY_STAGES.has(app.status)) return app.status;

  const slotIso = app.slotIso;
  if (!slotIso) return app.status;

  const slotMs = parseSlotMs(slotIso);
  if (!Number.isFinite(slotMs)) return app.status;

  const isShootLive =
    nowMs >= slotMs && nowMs <= slotMs + SHOOT_LIVE_DURATION_MS;
  const isPostShoot =
    nowMs > slotMs + SHOOT_LIVE_DURATION_MS &&
    nowMs < slotMs + POST_SHOOT_GRACE_MS;
  const isPreShoot = nowMs >= slotMs - PRE_SHOOT_LEAD_MS && nowMs < slotMs;

  // 'accepted' promotes upward through the funnel but never backward.
  if (app.status === "accepted") {
    if (isShootLive) return "shoot_live";
    if (isPostShoot) return "pending_upload";
    if (isPreShoot) return "pre_shoot";
    return "accepted";
  }

  // 'pre_shoot' promotes into shoot/post-shoot when time arrives.
  if (app.status === "pre_shoot") {
    if (isShootLive) return "shoot_live";
    if (isPostShoot) return "pending_upload";
    return "pre_shoot";
  }

  // 'shoot_live' promotes into pending_upload after the window.
  if (app.status === "shoot_live") {
    if (isPostShoot) return "pending_upload";
    return "shoot_live";
  }

  return app.status;
}

/** React hook — returns the effective stage and re-renders every
 *  60s so time-window transitions fire while the page is open. */
export function useApplicationStage(
  app: CreatorApplication | undefined,
): ApplicationStatus | undefined {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!app) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 60_000);
    return () => window.clearInterval(id);
  }, [app]);

  if (!app) return undefined;
  // Reference `tick` so re-renders are tied to the interval.
  void tick;
  return computeEffectiveStage(app);
}

/** Parse `YYYY-MM-DDTHH:MM` (or full ISO) into ms. Returns NaN if
 *  the slot string is malformed. */
function parseSlotMs(slotIso: string): number {
  // Already a full ISO with seconds → Date.parse handles it.
  if (slotIso.includes("Z") || /T\d{2}:\d{2}:\d{2}/.test(slotIso)) {
    return Date.parse(slotIso);
  }
  // Demo store stores `YYYY-MM-DDTHH:MM` — append :00 so Date.parse
  // treats it as local time consistently.
  return Date.parse(`${slotIso}:00`);
}

/** Stable label per stage — used by dev switcher pill + work/applied
 *  status badges. */
export const STAGE_LABEL: Record<ApplicationStatus, string> = {
  reviewing: "Reviewing",
  declined: "Declined",
  withdrawn: "Withdrawn",
  accepted: "Accepted",
  pre_shoot: "Pre-shoot",
  shoot_live: "Shoot live",
  pending_upload: "Pending upload",
  submitted: "Submitted",
  revision_requested: "Revision",
  verified: "Verified",
  paid: "Paid",
};

/** Stage tone — drives badge color in lists and the hero accent. */
export const STAGE_TONE: Record<
  ApplicationStatus,
  "info" | "ok" | "warn" | "danger" | "neutral"
> = {
  reviewing: "info",
  declined: "danger",
  withdrawn: "neutral",
  accepted: "ok",
  pre_shoot: "info",
  shoot_live: "ok",
  pending_upload: "warn",
  submitted: "info",
  revision_requested: "warn",
  verified: "ok",
  paid: "ok",
};
