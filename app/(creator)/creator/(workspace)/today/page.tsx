"use client";

import { useMemo } from "react";
import { useWorkspaceState } from "@/lib/workspace/state";
import { useNow } from "@/lib/workspace/hooks";
import { useToday } from "@/lib/data/hooks";
import { SkeletonCard, SkeletonPanel } from "@/components/loading/Skeleton";
import {
  selectHeroLine,
  buildActionQueue,
  aggregateYesterday,
  greetingFor,
  dateLineFor,
  type BriefingInput,
} from "@/lib/today/briefing";
import HeroBrief from "./components/HeroBrief";
import ActionQueue from "./components/ActionQueue";
import AttributionPulse from "./components/AttributionPulse";
import YesterdayRecap from "./components/YesterdayRecap";
import NextOpportunities from "./components/NextOpportunities";
import "./today.css";

export default function TodayPage() {
  /* Data: invites/threads/notifications/attribution come from the SWR cache
     via /api/creator/today. Mutations (dismiss/snooze) and UI state arrays
     (dismissedActionIds/snoozedActionIds) still live in WorkspaceStateProvider —
     prompt 5 will replace those with optimistic mutations. */
  const ws = useWorkspaceState();
  const { data: today, error, isLoading } = useToday();
  const now = useNow(30_000);

  /* Errors throw to the per-route error.tsx boundary — Next mounts it
     with the reset() callback. Loading state shows the skeleton trio
     below the hero placeholder. */
  if (error) throw error;

  /* Briefing waits for both `now` (clock hydrated) and `today` (SWR initial
     fetch). Until both are present we render in the same null-input shape
     the page already used pre-SWR — no flash, no skeleton needed for now
     (prompt 2 will add proper skeleton states). */
  const briefingInput: BriefingInput | null = useMemo(() => {
    if (now == null || !today) return null;
    return {
      now,
      threads: today.threads,
      invites: today.invites,
      notifications: today.notifications,
      attributionEvents: today.attributionEvents,
      dismissedActionIds: ws.dismissedActionIds,
      snoozedActionIds: ws.snoozedActionIds,
      weeklyBonusThreshold: 50,
      weeklyScansSoFar: today.attributionEvents.filter(
        (e) =>
          e.status === "verified" &&
          new Date(e.occurredAt).getTime() > now - 7 * 24 * 60 * 60 * 1000,
      ).length,
      creatorFirstName: "Maya",
    };
  }, [now, today, ws.dismissedActionIds, ws.snoozedActionIds]);

  const hero = useMemo(
    () => (briefingInput ? selectHeroLine(briefingInput) : null),
    [briefingInput],
  );
  const actions = useMemo(
    () => (briefingInput ? buildActionQueue(briefingInput) : []),
    [briefingInput],
  );
  const yesterday = useMemo(
    () => (briefingInput ? aggregateYesterday(briefingInput) : null),
    [briefingInput],
  );
  const opportunities = useMemo(() => {
    if (!briefingInput) return [];
    return briefingInput.invites
      .filter((i) => i.status === "pending")
      .filter((i) => i.expiresAt - briefingInput.now > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  }, [briefingInput]);

  /* v12.2 Pulse Strip metrics — derived from the SWR-fetched today payload.
     Stats are SSR-safe: counts that depend on `now` or `today` resolve to
     0 until the live clock fires + the SWR cache hydrates post-mount. */
  const pulse = useMemo(() => {
    const invites = today?.invites ?? [];
    const attribution = today?.attributionEvents ?? [];
    const openInvites = invites.filter((i) => i.status === "pending").length;
    const activeCampaigns = invites.filter(
      (i) => i.status === "accepted",
    ).length;
    const weekScans =
      now == null
        ? 0
        : attribution.filter(
            (e) =>
              e.status === "verified" &&
              new Date(e.occurredAt).getTime() > now - 7 * 24 * 60 * 60 * 1000,
          ).length;
    const urgentInvites =
      now == null
        ? 0
        : invites.filter(
            (i) =>
              i.status === "pending" &&
              i.expiresAt - now < 6 * 60 * 60 * 1000 &&
              i.expiresAt - now > 0,
          ).length;
    return { openInvites, activeCampaigns, weekScans, urgentInvites };
  }, [today, now]);

  /* Initial cache miss → render skeleton trio matching the post-data layout
     (hero placeholder + action queue cards + attribution pulse). Once SWR
     hydrates, the real components mount in place. */
  if (isLoading || !today) {
    return (
      <main className="today-page" aria-label="Today (loading)">
        <div className="today-skel-hero">
          <SkeletonPanel />
        </div>
        <div className="today-grid">
          <SkeletonCard count={3} />
          <SkeletonPanel />
          <SkeletonCard count={2} />
          <SkeletonPanel />
        </div>
      </main>
    );
  }

  return (
    <main className="today-page" aria-label="Today">
      <HeroBrief
        greeting={now == null ? "" : greetingFor(now, "Maya")}
        dateLine={now == null ? "" : dateLineFor(now)}
        hero={hero}
      />

      {/* ── ☆ Pulse Strip · ambient day metrics (Design.md § 20.6) ── */}
      <div className="today-pulse-wrap">
        <div
          className="today-pulse-strip"
          role="group"
          aria-label="Today's pulse"
        >
          <div className="today-pulse-strip__title">
            <span className="today-pulse-strip__title__dot" aria-hidden />
            Today
          </div>
          <div className="today-pulse-stat today-pulse-stat--actions">
            <span className="today-pulse-stat__dot" aria-hidden />
            <span className="today-pulse-stat__label">Action queue</span>
            <span className="today-pulse-stat__value" suppressHydrationWarning>
              {actions.length}
            </span>
            <span className="today-pulse-stat__delta">
              {actions.length === 0 ? "all clear" : "to triage"}
            </span>
          </div>
          <div className="today-pulse-stat today-pulse-stat--invites">
            <span className="today-pulse-stat__dot" aria-hidden />
            <span className="today-pulse-stat__label">Open invites</span>
            <span className="today-pulse-stat__value" suppressHydrationWarning>
              {pulse.openInvites}
            </span>
            <span
              className={
                "today-pulse-stat__delta" +
                (pulse.urgentInvites > 0
                  ? " today-pulse-stat__delta--alert"
                  : "")
              }
              suppressHydrationWarning
            >
              {pulse.urgentInvites > 0
                ? `${pulse.urgentInvites} urgent`
                : "none urgent"}
            </span>
          </div>
          <div className="today-pulse-stat today-pulse-stat--active">
            <span className="today-pulse-stat__dot" aria-hidden />
            <span className="today-pulse-stat__label">Active</span>
            <span className="today-pulse-stat__value" suppressHydrationWarning>
              {pulse.activeCampaigns}
            </span>
            <span className="today-pulse-stat__delta">in flight</span>
          </div>
          <div className="today-pulse-stat today-pulse-stat--scans">
            <span className="today-pulse-stat__dot" aria-hidden />
            <span className="today-pulse-stat__label">Scans this week</span>
            <span className="today-pulse-stat__value" suppressHydrationWarning>
              {pulse.weekScans}
            </span>
            <span
              className={
                "today-pulse-stat__delta" +
                (pulse.weekScans >= 50 ? " today-pulse-stat__delta--up" : "")
              }
              suppressHydrationWarning
            >
              {pulse.weekScans >= 50
                ? "weekly bonus unlocked"
                : `${50 - pulse.weekScans} to bonus`}
            </span>
          </div>
        </div>
      </div>

      <div className="today-grid">
        <ActionQueue
          actions={actions}
          onDismiss={ws.dismissAction}
          onSnooze={ws.snoozeAction}
        />
        <AttributionPulse events={today?.attributionEvents ?? []} now={now} />
        <NextOpportunities invites={opportunities} now={now} />
        <div className="today-recap-wrap">
          <YesterdayRecap stats={yesterday} />
        </div>
      </div>
    </main>
  );
}
