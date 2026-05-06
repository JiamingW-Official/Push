"use client";

/* ============================================================
   Gigs Layout — segmented nav shell for Invites · Active · History.
   Mirrors the slim-chrome pattern from inbox/layout.tsx; reuses
   the same viewport-locked fullbleed discipline.

   WorkspaceStateProvider lives upstream in (workspace)/layout.tsx;
   this layout just consumes the shared context for badge counts
   and the a11y live-region message.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useWorkspaceState } from "@/lib/workspace/state";
import { useNow } from "@/lib/workspace/hooks";
import "./gigs.css";

function usePopOnChange<T>(value: T): boolean {
  const prev = useRef(value);
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    if (prev.current === value) return;
    prev.current = value;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 400);
    return () => clearTimeout(t);
  }, [value]);
  return pulse;
}

export default function GigsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GigsShell>{children}</GigsShell>;
}

function breadcrumbLabel(pathname: string | null | undefined): string {
  if (!pathname) return "Invites";
  if (pathname.startsWith("/creator/gigs/active")) return "Active";
  if (pathname.startsWith("/creator/gigs/history")) return "History";
  return "Invites";
}

function GigsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { invites, liveMessage } = useWorkspaceState();
  const now = useNow();

  const pending = invites.filter((i) => i.status === "pending");
  const pendingCount = pending.length;
  const activeCount = invites.filter((i) => i.status === "accepted").length;

  const urgentCount =
    now == null
      ? 0
      : pending.filter((i) => i.expiresAt - now < 6 * 60 * 60 * 1000).length;

  /* Pop animation kept on count changes — softens "new invite arrived" beat
     without the heavy black pill that made the old bar feel stiff. */
  const invPop = usePopOnChange(pendingCount);
  const activePop = usePopOnChange(activeCount);

  /* The 3 modes (Invites / Active / History) are kept as separate routes
     because they represent distinct creator mental modes: triage vs. in-flight
     work vs. retrospective. The OLD execution wrapped them in a thick black
     pill floating in a beige rectangle (visual island, disconnected from
     content). v12.2 swaps that for editorial text-tabs with a subtle bottom
     underline — same navigation, much less visual noise.
     Authority: Design.md § 20.1 (Tier ☆ Tertiary chrome). */
  const tabs = [
    {
      href: "/creator/gigs/invites",
      label: "Invites",
      count: pendingCount,
      pop: invPop,
      urgent: urgentCount > 0,
      match: (p: string) => p?.startsWith("/creator/gigs/invites") ?? false,
    },
    {
      href: "/creator/gigs/active",
      label: "Active",
      count: activeCount,
      pop: activePop,
      urgent: false,
      match: (p: string) => p?.startsWith("/creator/gigs/active") ?? false,
    },
    {
      href: "/creator/gigs/history",
      label: "History",
      count: 0,
      pop: false,
      urgent: false,
      match: (p: string) => p?.startsWith("/creator/gigs/history") ?? false,
    },
  ];

  /* breadcrumbLabel result is no longer rendered (workspace shell already
     shows the route in the topnav crumb); kept for screen-reader fallback
     only inside aria-label. */
  const currentLabel = breadcrumbLabel(pathname);

  return (
    <div className="cw-page ib-page ib-page--fullbleed">
      {/* ☆ Tier ☆ Tertiary chrome — slim editorial mode switcher.
          Replaces the old segmented pill bar (.ib-segmented-nav). */}
      <nav
        className="giv-modes"
        aria-label={`Gigs view · current ${currentLabel}`}
        role="tablist"
      >
        {tabs.map((tab) => {
          const active = tab.match(pathname ?? "");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              role="tab"
              aria-selected={active}
              className={[
                "giv-modes__link",
                active ? "giv-modes__link--active" : "",
                tab.urgent ? "giv-modes__link--urgent" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="giv-modes__label">{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={
                    "giv-modes__count" + (tab.pop ? " cw-num-pop" : "")
                  }
                  aria-label={`${tab.count} ${tab.label.toLowerCase()}`}
                >
                  {tab.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {children}

      <div
        className="cw-a11y-live"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {liveMessage}
      </div>
    </div>
  );
}
