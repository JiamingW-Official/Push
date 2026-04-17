"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  useNotifications,
  timeAgo,
  type NotificationRole,
} from "@/lib/notifications/useNotifications";
import "./notification-bell.css";

type Props = {
  role: NotificationRole;
};

export function NotificationBell({ role }: Props) {
  const { notifications, unreadCount, markAsRead, markAllRead, hydrated } =
    useNotifications(role);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Show only the 8 most recent in the dropdown
  const recent = [...notifications]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 8);

  const inboxHref =
    role === "creator" ? "/creator/notifications" : "/merchant/notifications";

  if (!hydrated) return null;

  return (
    <div className="nb-wrap" ref={ref}>
      {/* Bell button */}
      <button
        className="nb-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            d="M10 2a6 6 0 0 0-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 0 0-6-6z"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          <path d="M8 16a2 2 0 0 0 4 0" strokeLinecap="square" />
        </svg>
        {unreadCount > 0 && (
          <span className="nb-badge" aria-hidden="true">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="nb-panel" role="dialog" aria-label="Notifications">
          {/* Panel header */}
          <div className="nb-panel-header">
            <span className="nb-panel-title">Notifications</span>
            {unreadCount > 0 && (
              <button className="nb-mark-all" onClick={() => markAllRead()}>
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="nb-list">
            {recent.length === 0 ? (
              <div className="nb-empty">Nothing yet.</div>
            ) : (
              recent.map((n) => (
                <Link
                  key={n.id}
                  href={n.href}
                  className={`nb-item${n.read ? " nb-item--read" : ""}`}
                  onClick={() => {
                    markAsRead(n.id);
                    setOpen(false);
                  }}
                >
                  {/* Avatar */}
                  <div className="nb-avatar" aria-hidden="true">
                    {n.title.charAt(0).toUpperCase()}
                  </div>
                  <div className="nb-item-body">
                    <span className="nb-item-title">{n.title}</span>
                    <span className="nb-item-text">{n.body}</span>
                    <span className="nb-item-time">{timeAgo(n.createdAt)}</span>
                  </div>
                  {!n.read && <span className="nb-unread-dot" />}
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="nb-panel-footer">
            <Link
              href={inboxHref}
              className="nb-view-all"
              onClick={() => setOpen(false)}
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
