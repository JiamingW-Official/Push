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

  const urgentCount =
    now == null
      ? 0
      : pending.filter((i) => i.expiresAt - now < 6 * 60 * 60 * 1000).length;

  const invPop = usePopOnChange(pendingCount);

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
      count: 0,
      pop: false,
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

  return (
    <div className="cw-page ib-page ib-page--fullbleed">
      <header className="cw-header ib-hero-header ib-hero-header--slim">
        <Link
          href="/creator/gigs/invites"
          className="ib-slim-home"
          aria-label="Back to Gigs"
        >
          <span className="ib-slim-home-mark">Gigs.</span>
          <span className="ib-slim-home-sep" aria-hidden>
            ›
          </span>
          <span className="ib-slim-home-where">
            {breadcrumbLabel(pathname)}
          </span>
        </Link>

        <nav
          className="ib-segmented-nav"
          aria-label="Gigs channels"
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
                className={`ib-segmented-tab${active ? " is-active" : ""}`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={[
                      "ib-segmented-badge",
                      tab.pop ? "cw-num-pop" : "",
                      tab.urgent ? "ib-segmented-badge--urgent" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-label={`${tab.count} pending`}
                  >
                    {tab.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </header>

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
