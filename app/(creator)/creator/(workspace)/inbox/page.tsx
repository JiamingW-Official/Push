"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNotifications } from "@/lib/notifications/useNotifications";
import "./inbox.css";

/* ── Mock thread data ─────────────────────────────────────────── */

type Thread = {
  id: string;
  sender: string;
  senderInitial: string;
  preview: string;
  fullPreview: string;
  time: string;
  unread: boolean;
  isNew?: boolean;
};

const INITIAL_THREADS: Thread[] = [
  {
    id: "t-001",
    sender: "Push Team",
    senderInitial: "P",
    preview: "Your application to Roberta's was accepted — next steps inside.",
    fullPreview:
      "Congrats! Your application to Roberta's Spring campaign was accepted. Head to your dashboard to schedule your visit and review campaign requirements.",
    time: "2m ago",
    unread: true,
  },
  {
    id: "t-002",
    sender: "Flamingo Estate",
    senderInitial: "F",
    preview: "Shoot deadline reminder — 3 days left to complete your content.",
    fullPreview:
      "Hi! This is a reminder that your Flamingo Estate campaign content deadline is in 3 days. Please ensure you complete your visit and submit proof by Friday 5pm.",
    time: "1h ago",
    unread: true,
  },
  {
    id: "t-003",
    sender: "Push Payments",
    senderInitial: "$",
    preview: "$120 has been added to your wallet — campaign verified.",
    fullPreview:
      "$120.00 payout from Brow Theory campaign has been processed and added to your wallet. Funds are available for withdrawal.",
    time: "3h ago",
    unread: false,
  },
  {
    id: "t-004",
    sender: "Fort Greene Coffee",
    senderInitial: "F",
    preview: "We loved your content — can you do a follow-up post?",
    fullPreview:
      "Hey! We saw the content you published for our spring campaign and we absolutely loved it. Would you be interested in a follow-up collaboration?",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "t-005",
    sender: "Campaign Updates",
    senderInitial: "C",
    preview: "Score updated: +3 points after Brow Theory verification.",
    fullPreview:
      "Your Push Score has increased by 3 points following the successful verification of your Brow Theory campaign visit. New score: 87.",
    time: "2d ago",
    unread: false,
  },
];

/* ── Toast type ───────────────────────────────────────────────── */

type Toast = {
  id: string;
  text: string;
  fading: boolean;
};

/* ── Main Inbox page ──────────────────────────────────────────── */

export default function InboxPage() {
  const pathname = usePathname();
  const { unreadCount } = useNotifications("creator");

  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const toastTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  // Simulate a new message arriving after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      const newThread: Thread = {
        id: `t-new-${Date.now()}`,
        sender: "Bed-Stuy Eats",
        senderInitial: "B",
        preview: "Invite: Summer menu shoot — $65 base, $85 bonus available.",
        fullPreview:
          "We'd love to have you for our summer menu launch campaign. Base payout is $65 with a $85 bonus available for top-performing content. Spots are limited!",
        time: "just now",
        unread: true,
        isNew: true,
      };
      setThreads((prev) => [newThread, ...prev]);
      addToast(`New message from Bed-Stuy Eats`);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const addToast = useCallback((text: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, text, fading: false }]);
    // auto-dismiss after 4s
    const timer = setTimeout(() => {
      dismissToast(id);
    }, 4000);
    toastTimers.current.set(id, timer);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, fading: true } : t)),
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
    const timer = toastTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      toastTimers.current.delete(id);
    }
  }, []);

  const markRead = useCallback((id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setReadIds((prev) => new Set([...prev, id]));
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, unread: false } : t)),
    );
  }, []);

  const isUnread = (thread: Thread) => thread.unread && !readIds.has(thread.id);

  const unreadThreads = threads.filter(isUnread).length;
  const totalInvites = 3;
  const systemUnread = unreadCount;

  return (
    <div className="inbox-page">
      {/* Top nav */}
      <header className="inbox-nav">
        <Link href="/creator/dashboard" className="inbox-nav-back">
          ← Dashboard
        </Link>
        <span className="inbox-nav-title">Inbox.</span>
        {/* Live indicator */}
        <div className="inbox-live-indicator">
          <span className="inbox-live-dot" />
          <span className="inbox-live-label">Live</span>
        </div>
      </header>

      {/* Section tabs */}
      <nav className="inbox-tabs">
        <Link
          href="/creator/inbox"
          className={`inbox-tab${pathname === "/creator/inbox" || pathname?.endsWith("/inbox") ? " inbox-tab--active" : ""}`}
        >
          Messages
          {unreadThreads > 0 && (
            <span className="inbox-tab-badge">{unreadThreads}</span>
          )}
        </Link>
        <Link
          href="/creator/inbox/invites"
          className={`inbox-tab${pathname?.endsWith("/invites") ? " inbox-tab--active" : ""}`}
        >
          Invites
          {totalInvites > 0 && (
            <span className="inbox-tab-badge">{totalInvites}</span>
          )}
        </Link>
        <Link
          href="/creator/inbox/system"
          className={`inbox-tab${pathname?.endsWith("/system") ? " inbox-tab--active" : ""}`}
        >
          System
          {systemUnread > 0 && (
            <span className="inbox-tab-badge">{systemUnread}</span>
          )}
        </Link>
      </nav>

      {/* Thread list */}
      <div className="inbox-list">
        {threads.length === 0 ? (
          <div className="inbox-empty">
            <p className="inbox-empty-title">No messages yet.</p>
            <p className="inbox-empty-body">
              When brands reach out or Push sends updates, they appear here.
            </p>
          </div>
        ) : (
          threads.map((thread, idx) => {
            const unread = isUnread(thread);
            const isHovered = hoveredId === thread.id;
            return (
              <div
                key={thread.id}
                className="inbox-row-tooltip-wrap"
                onMouseEnter={() => setHoveredId(thread.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <div
                  className={`inbox-row${unread ? " inbox-row--unread" : ""}${thread.isNew ? " inbox-row--new" : ""}`}
                  style={{
                    animationDelay: thread.isNew ? "0ms" : `${idx * 30}ms`,
                  }}
                >
                  {/* Avatar */}
                  <div className="inbox-row-avatar">{thread.senderInitial}</div>

                  {/* Content */}
                  <div className="inbox-row-content">
                    <span className="inbox-row-sender">{thread.sender}</span>
                    <span className="inbox-row-separator">—</span>
                    <span className="inbox-row-preview">{thread.preview}</span>
                  </div>

                  {/* Right side */}
                  <div className="inbox-row-right">
                    <span className="inbox-row-time">{thread.time}</span>
                    {unread && (
                      <button
                        className="inbox-row-mark-read"
                        onClick={(e) => markRead(thread.id, e)}
                      >
                        Mark read
                      </button>
                    )}
                    {unread && <span className="inbox-row-unread-dot" />}
                  </div>
                </div>

                {/* Hover tooltip preview (desktop only) */}
                {isHovered && (
                  <div className="inbox-row-tooltip">
                    <div className="inbox-row-tooltip-sender">
                      {thread.sender}
                    </div>
                    <div className="inbox-row-tooltip-text">
                      {thread.fullPreview}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Toast container */}
      <div className="inbox-toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`inbox-toast${toast.fading ? " inbox-toast--out" : ""}`}
          >
            <span className="inbox-toast-dot" />
            <div className="inbox-toast-body">
              <div className="inbox-toast-label">New message</div>
              <div className="inbox-toast-text">{toast.text}</div>
            </div>
            <button
              className="inbox-toast-dismiss"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
