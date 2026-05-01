"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useNotifications } from "@/lib/notifications/useNotifications";
import "./inbox.css";

export default function InboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { unreadCount } = useNotifications("creator");

  const inviteCount = 3;
  const msgUnread = 2;

  const tabs = [
    {
      href: "/creator/inbox/messages",
      label: "Messages",
      count: msgUnread,
      match: (p: string) =>
        p === "/creator/inbox" ||
        p === "/creator/inbox/messages" ||
        p?.startsWith("/creator/inbox/messages"),
    },
    {
      href: "/creator/inbox/invites",
      label: "Invites",
      count: inviteCount,
      match: (p: string) => p?.startsWith("/creator/inbox/invites"),
    },
    {
      href: "/creator/inbox/system",
      label: "System",
      count: unreadCount,
      match: (p: string) => p?.startsWith("/creator/inbox/system"),
    },
  ];

  return (
    <div className="cw-page ib-page">
      {/* ── Shared header ──────────────────────────────────── */}
      <header className="cw-header ib-header">
        <div className="cw-header__left">
          <p className="cw-eyebrow cw-eyebrow--live">INBOX · LIVE</p>
          <h1 className="cw-title">Inbox.</h1>
        </div>
        <div className="cw-header__right">
          <div className="cw-chip-row ib-tab-bar">
            {tabs.map((tab) => {
              const active = tab.match(pathname ?? "");
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`cw-chip${active ? " is-active" : ""}`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ib-tab-count"> · {tab.count}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Page content ───────────────────────────────────── */}
      {children}
    </div>
  );
}
