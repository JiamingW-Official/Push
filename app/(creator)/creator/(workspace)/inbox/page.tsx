"use client";

/* ============================================================
   Inbox Hub — /creator/inbox (overview + dispatcher)
   Authority: Design.md § 0 (3-tier rules) · § 4.3 radii ·
              § 6 spacing · § 8.9 liquid-glass · § 9 buttons
   Role: This page is a HUB — surface unread counts per
         channel + last-message previews, then route the
         creator into Messages / Invites / System.
   ============================================================ */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useNotifications } from "@/lib/notifications/useNotifications";
import "./inbox.css";

/* ── Channel descriptors ─────────────────────────────────────
   Mock counts mirror layout.tsx (kept in sync intentionally —
   when the real API lands, both files swap to the same hook). */

type Channel = {
  key: "messages" | "invites" | "system";
  href: string;
  label: string; // Tab label (邀约 / 消息 / 系统 mapped to EN)
  blurb: string; // 1-line role description
  unread: number;
  preview: { sender: string; line: string; time: string } | null;
};

export default function InboxHubPage() {
  const router = useRouter();
  const { unreadCount: systemUnread } = useNotifications("creator");

  // Mock previews — replace with hook calls once endpoints land.
  // Numbers must mirror layout.tsx (same source of truth).
  const channels: Channel[] = useMemo(
    () => [
      {
        key: "messages",
        href: "/creator/inbox/messages",
        label: "Messages",
        blurb: "Threads with brands and Push.",
        unread: 2,
        preview: {
          sender: "Push Team",
          line: "Your application to Roberta's was accepted.",
          time: "2m",
        },
      },
      {
        key: "invites",
        href: "/creator/inbox/invites",
        label: "Invites",
        blurb: "Brand campaigns waiting on you.",
        unread: 3,
        preview: {
          sender: "Roberta's Pizza",
          line: "Summer Menu Launch · expires in 4h",
          time: "now",
        },
      },
      {
        key: "system",
        href: "/creator/inbox/system",
        label: "System",
        blurb: "Payments, scores, platform notices.",
        unread: systemUnread,
        preview: {
          sender: "Push Payments",
          line: "$120 added to your wallet.",
          time: "3h",
        },
      },
    ],
    [systemUnread],
  );

  /* Keyboard shortcut — 1 / 2 / 3 jumps to the matching channel.
     Skipped while focus is in inputs (avoids conflict with type-to-search
     once messages list ships). */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      )
        return;
      if (e.key === "1") {
        e.preventDefault();
        router.push(channels[0].href);
      } else if (e.key === "2") {
        e.preventDefault();
        router.push(channels[1].href);
      } else if (e.key === "3") {
        e.preventDefault();
        router.push(channels[2].href);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, channels]);

  const totalUnread = channels.reduce((sum, c) => sum + c.unread, 0);

  return (
    <section className="ib-content ib-hub" aria-labelledby="ib-hub-heading">
      {/* ── Eyebrow + summary line ──────────────────────────── */}
      <div className="ib-hub-intro">
        <p className="ib-hub-eyebrow">LINKS · OVERVIEW</p>
        <h2 id="ib-hub-heading" className="ib-hub-summary">
          {totalUnread > 0 ? (
            <>
              <span className="ib-hub-summary-num">{totalUnread}</span>
              <span className="ib-hub-summary-text">
                {totalUnread === 1 ? "thing waiting." : "things waiting."}
              </span>
            </>
          ) : (
            <>
              <span className="ib-hub-summary-text">All clear.</span>
              <span className="ib-hub-summary-faint">
                Nothing needs you right now.
              </span>
            </>
          )}
        </h2>
      </div>

      {/* ── Channel cards — 3-up grid, dispatchers ──────────── */}
      <ul className="ib-hub-grid" role="list">
        {channels.map((ch, idx) => (
          <li key={ch.key}>
            <Link
              href={ch.href}
              className={
                "ib-hub-card" + (ch.unread > 0 ? " ib-hub-card--alert" : "")
              }
              aria-label={`${ch.label} — ${
                ch.unread > 0 ? `${ch.unread} unread` : "no unread"
              }. Press ${idx + 1} to open.`}
            >
              {/* Top row — number + key hint */}
              <div className="ib-hub-card-top">
                <span
                  className="ib-hub-card-num"
                  aria-hidden="true"
                  data-zero={ch.unread === 0}
                >
                  {ch.unread}
                </span>
                <kbd className="ib-hub-card-key" aria-hidden="true">
                  {idx + 1}
                </kbd>
              </div>

              {/* Title block */}
              <div className="ib-hub-card-head">
                <h3 className="ib-hub-card-title">{ch.label}</h3>
                <p className="ib-hub-card-blurb">{ch.blurb}</p>
              </div>

              {/* Preview row — last message in this channel */}
              {ch.preview ? (
                <div className="ib-hub-card-preview">
                  <span className="ib-hub-card-preview-sender">
                    {ch.preview.sender}
                  </span>
                  <span className="ib-hub-card-preview-dot" aria-hidden="true">
                    ·
                  </span>
                  <span className="ib-hub-card-preview-line">
                    {ch.preview.line}
                  </span>
                </div>
              ) : (
                <div className="ib-hub-card-preview ib-hub-card-preview--empty">
                  Nothing yet.
                </div>
              )}

              {/* Footer — view-all affordance */}
              <div className="ib-hub-card-foot">
                <span className="ib-hub-card-foot-label">View all</span>
                <span className="ib-hub-card-foot-arrow" aria-hidden="true">
                  →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* ── Footnote — keyboard hint, Magvix Italic register ── */}
      <p className="ib-hub-foot-hint">
        <span className="ib-hub-foot-italic">Tip ·</span>
        <span className="ib-hub-foot-mono">
          press <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> to jump between channels.
        </span>
      </p>
    </section>
  );
}
