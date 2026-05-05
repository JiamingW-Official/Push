"use client";

/* ============================================================
   Inbox Layout — v11.2 unified slim chrome on every route.
   Now / Messages / Invites / System ALL use the slim segmented-nav
   chrome — fixed viewport height, no page scroll, premium 64px
   horizontal margins. The billboard "Inbox." landing has been
   retired in favor of a dense Now feed.

   <InboxStateProvider> wraps everything so accept invite in
   /invites updates the unread badges on the segmented nav AND
   propagates to /system + Hub Now feed in real time.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { InboxStateProvider, useInboxState } from "@/lib/inbox/state";
import "./inbox.css";

/** Returns `true` for ~400ms after `value` changes — used to toggle
 *  `.cw-num-pop` on segmented-nav badges so unread counts visibly
 *  pulse when state mutates. Suppresses the initial render. */
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

export default function InboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InboxStateProvider>
      <InboxShell>{children}</InboxShell>
    </InboxStateProvider>
  );
}

/** Map a pathname segment to the breadcrumb label rendered next
 *  to the back-to-Now Inbox. mark. Falls back to "Now" when on
 *  the hub itself (where there is no sub-segment). */
function breadcrumbLabel(pathname: string | null | undefined): string {
  if (!pathname) return "Now";
  if (pathname.startsWith("/creator/inbox/messages")) return "Messages";
  if (pathname.startsWith("/creator/inbox/invites")) return "Invites";
  if (pathname.startsWith("/creator/inbox/system")) return "System";
  return "Now";
}

function InboxShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    unreadThreads,
    unreadInvites,
    unreadNotifications,
    liveMessage,
  } = useInboxState();

  const msgPop = usePopOnChange(unreadThreads);
  const invPop = usePopOnChange(unreadInvites);
  const sysPop = usePopOnChange(unreadNotifications);

  const tabs = [
    {
      href: "/creator/inbox/messages",
      label: "Messages",
      count: unreadThreads,
      pop: msgPop,
      match: (p: string) => p?.startsWith("/creator/inbox/messages") ?? false,
    },
    {
      href: "/creator/inbox/invites",
      label: "Invites",
      count: unreadInvites,
      pop: invPop,
      match: (p: string) => p?.startsWith("/creator/inbox/invites") ?? false,
    },
    {
      href: "/creator/inbox/system",
      label: "System",
      count: unreadNotifications,
      pop: sysPop,
      match: (p: string) => p?.startsWith("/creator/inbox/system") ?? false,
    },
  ];

  return (
    <div className="cw-page ib-page ib-page--fullbleed">
      <header className="cw-header ib-hero-header ib-hero-header--slim">
        <Link
          href="/creator/inbox"
          className="ib-slim-home"
          aria-label="Back to Now"
        >
          <span className="ib-slim-home-mark">Inbox.</span>
          <span className="ib-slim-home-sep" aria-hidden>
            ›
          </span>
          <span className="ib-slim-home-where">
            {breadcrumbLabel(pathname)}
          </span>
        </Link>

        <nav
          className="ib-segmented-nav"
          aria-label="Inbox channels"
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
                    className={`ib-segmented-badge${tab.pop ? " cw-num-pop" : ""}`}
                    aria-label={`${tab.count} unread`}
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

      {/* A11y live region — broadcasts mutations from any pane to
          screen readers without taking visual space. */}
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
