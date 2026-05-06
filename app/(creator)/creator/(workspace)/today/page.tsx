"use client";

import { useMemo } from "react";
import { useWorkspaceState } from "@/lib/workspace/state";
import { useNow } from "@/lib/workspace/hooks";
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
  const ws = useWorkspaceState();
  const now = useNow(30_000);

  const briefingInput: BriefingInput | null = useMemo(() => {
    if (now == null) return null;
    return {
      now,
      threads: ws.threads,
      invites: ws.invites,
      notifications: ws.notifications,
      attributionEvents: ws.attributionEvents,
      dismissedActionIds: ws.dismissedActionIds,
      snoozedActionIds: ws.snoozedActionIds,
      weeklyBonusThreshold: 50,
      weeklyScansSoFar: ws.attributionEvents.filter(
        (e) =>
          e.status === "verified" &&
          new Date(e.occurredAt).getTime() > now - 7 * 24 * 60 * 60 * 1000,
      ).length,
      creatorFirstName: "Maya",
    };
  }, [now, ws]);

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

  /* v12.2 Pulse Strip metrics — derived from workspace state.
     Stats are SSR-safe: counts that depend on `now` resolve to 0 until
     the live clock fires post-hydration, matching the rest of the page. */
  const pulse = useMemo(() => {
    const openInvites = ws.invites.filter((i) => i.status === "pending").length;
    const activeCampaigns = ws.invites.filter(
      (i) => i.status === "accepted",
    ).length;
    const weekScans =
      now == null
        ? 0
        : ws.attributionEvents.filter(
            (e) =>
              e.status === "verified" &&
              new Date(e.occurredAt).getTime() >
                now - 7 * 24 * 60 * 60 * 1000,
          ).length;
    const urgentInvites =
      now == null
        ? 0
        : ws.invites.filter(
            (i) =>
              i.status === "pending" &&
              i.expiresAt - now < 6 * 60 * 60 * 1000 &&
              i.expiresAt - now > 0,
          ).length;
    return { openInvites, activeCampaigns, weekScans, urgentInvites };
  }, [ws.invites, ws.attributionEvents, now]);

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
            <span
              className="today-pulse-stat__value"
              suppressHydrationWarning
            >
              {actions.length}
            </span>
            <span className="today-pulse-stat__delta">
              {actions.length === 0 ? "all clear" : "to triage"}
            </span>
          </div>
          <div className="today-pulse-stat today-pulse-stat--invites">
            <span className="today-pulse-stat__dot" aria-hidden />
            <span className="today-pulse-stat__label">Open invites</span>
            <span
              className="today-pulse-stat__value"
              suppressHydrationWarning
            >
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
            <span
              className="today-pulse-stat__value"
              suppressHydrationWarning
            >
              {pulse.activeCampaigns}
            </span>
            <span className="today-pulse-stat__delta">in flight</span>
          </div>
          <div className="today-pulse-stat today-pulse-stat--scans">
            <span className="today-pulse-stat__dot" aria-hidden />
            <span className="today-pulse-stat__label">Scans this week</span>
            <span
              className="today-pulse-stat__value"
              suppressHydrationWarning
            >
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
        <AttributionPulse events={ws.attributionEvents} now={now} />
        <NextOpportunities invites={opportunities} now={now} />
        <div className="today-recap-wrap">
          <YesterdayRecap stats={yesterday} />
        </div>
      </div>
    </main>
  );
}
