"use client";

/* Repo target: components/creator/workspace/useDashboardCounts.ts
   Live-data badges for the rail. Pulls from demo data when the demo
   cookie is set; falls back to undefined badges otherwise (rail items
   render without a badge — same shape, no AI-generated mock noise). */

import { useEffect, useState } from "react";
import {
  daysUntil,
  formatCurrency,
  getRecommended,
} from "@/lib/creator/widget-helpers";
import type {
  Application,
  Campaign,
  Creator,
  InboxThread,
} from "@/components/creator/dashboard/types";

export type RailBadge = {
  label: string;
  tone?: "urgent" | "success" | "ceremony" | "neutral";
};

export type RailCounts = {
  today?: RailBadge;
  active?: RailBadge;
  matches?: RailBadge;
  earnings?: RailBadge;
  scans?: RailBadge;
  unread?: RailBadge;
  rank?: RailBadge;
};

function isDemo(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=creator");
}

export function useDashboardCounts(): RailCounts {
  const [data, setData] = useState<RailCounts>({});

  useEffect(() => {
    if (!isDemo()) return;
    let cancelled = false;

    (async () => {
      const demo = await import("@/lib/creator/demo-data");
      if (cancelled) return;

      const creator = demo.DEMO_CREATOR as Creator;
      const apps = demo.DEMO_APPLICATIONS as Application[];
      const campaigns = demo.DEMO_CAMPAIGNS as Campaign[];
      const threads = (demo.DEMO_INBOX_THREADS ?? []) as InboxThread[];

      const todayCount = apps.filter(
        (a) => a.status === "accepted" && daysUntil(a.deadline) === 0,
      ).length;
      const activeCount = apps.filter((a) => a.status === "accepted").length;
      const matches = getRecommended(campaigns, apps, creator.tier, 12).length;
      const unread = threads.filter((t) => t.unread).length;

      setData({
        today:
          todayCount > 0
            ? { label: String(todayCount), tone: "urgent" }
            : undefined,
        active:
          activeCount > 0
            ? { label: String(activeCount), tone: "neutral" }
            : undefined,
        matches:
          matches > 0 ? { label: String(matches), tone: "success" } : undefined,
        earnings:
          creator.earnings_pending > 0
            ? {
                label: formatCurrency(creator.earnings_pending),
                tone: "neutral",
              }
            : undefined,
        scans: { label: "+12%", tone: "success" },
        unread:
          unread > 0 ? { label: String(unread), tone: "urgent" } : undefined,
        rank: { label: "#11", tone: "ceremony" },
      });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}
