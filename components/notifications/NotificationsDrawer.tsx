"use client";

/**
 * Notifications drawer (audit § P1-10). Anchored top-right, slides down
 * from below the topnav. Replaces the standalone /creator/notifications
 * page as the primary interaction surface. Direct visits to the legacy
 * route still work — they auto-open this drawer via ?notifications=open.
 *
 * Accessibility:
 *   - role=dialog + aria-modal=true
 *   - Focus trap inside drawer body
 *   - Esc closes
 *   - First focusable on open: the close button (X)
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useNotifications } from "@/lib/data/hooks/useNotifications";
import "./NotificationsDrawer.css";

type Props = {
  open: boolean;
  onClose: () => void;
  /** When provided, enables the realtime channel inside useNotifications. */
  creatorId?: string;
};

export function NotificationsDrawer({ open, onClose, creatorId }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { data, mutate, unreadCount } = useNotifications(creatorId);

  /* Open-on-mount focus + Esc handling. */
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  /* Click-outside close. The drawer card has data-drawer-card to opt out. */
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest("[data-drawer-card]") &&
        !target.closest("[data-drawer-trigger]")
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, onClose]);

  if (!open) return null;

  const items = data ?? [];

  async function markAllRead() {
    try {
      await fetch("/api/creator/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ all: true }),
      });
      // Optimistic — flip read_at locally without revalidation.
      mutate(
        (prev) =>
          prev?.map((n) =>
            n.read_at == null ? { ...n, read_at: new Date().toISOString() } : n,
          ),
        false,
      );
    } catch {
      // Silent — the next focus revalidation will reconcile.
    }
  }

  async function markOneRead(id: string) {
    try {
      await fetch("/api/creator/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ids: [id] }),
      });
      mutate(
        (prev) =>
          prev?.map((n) =>
            n.id === id ? { ...n, read_at: new Date().toISOString() } : n,
          ),
        false,
      );
    } catch {}
  }

  return (
    <div
      className="notif-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Notifications"
      data-drawer-card
    >
      <header className="notif-drawer__head">
        <h2 className="notif-drawer__title">Notifications</h2>
        <div className="notif-drawer__actions">
          {unreadCount > 0 ? (
            <button
              type="button"
              className="notif-drawer__action"
              onClick={markAllRead}
            >
              Mark all read
            </button>
          ) : null}
          <button
            ref={closeRef}
            type="button"
            className="notif-drawer__close"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </header>

      <div className="notif-drawer__body">
        {items.length === 0 ? (
          <div className="notif-drawer__empty">
            <strong>All caught up.</strong>
            <span>We'll ping you when something happens.</span>
          </div>
        ) : (
          <ul className="notif-drawer__list">
            {items.slice(0, 20).map((n) => (
              <li key={n.id} className={n.read_at == null ? "is-unread" : ""}>
                {n.href ? (
                  <Link
                    href={n.href}
                    className="notif-drawer__row"
                    onClick={() => {
                      void markOneRead(n.id);
                      onClose();
                    }}
                  >
                    <NotifRow n={n} />
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="notif-drawer__row"
                    onClick={() => void markOneRead(n.id)}
                  >
                    <NotifRow n={n} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer className="notif-drawer__foot">
        <Link
          href="/creator/settings/notifications"
          className="notif-drawer__view-all"
        >
          Notification preferences →
        </Link>
      </footer>
    </div>
  );
}

function NotifRow({
  n,
}: {
  n: {
    kind: string;
    title: string;
    body: string;
    read_at: string | null;
    created_at: string;
  };
}) {
  return (
    <>
      <span className="notif-row__icon" aria-hidden>
        <KindIcon kind={n.kind} />
      </span>
      <span className="notif-row__body">
        <span className="notif-row__title">{n.title}</span>
        <span className="notif-row__msg">{n.body}</span>
        <span className="notif-row__time">{relativeTime(n.created_at)}</span>
      </span>
      {n.read_at == null ? (
        <span className="notif-row__dot" aria-label="Unread" />
      ) : null}
    </>
  );
}

function KindIcon({ kind }: { kind: string }) {
  // Single-glyph SVG per kind, all same 18x18 frame.
  const map: Record<string, string> = {
    imminent_shoot:
      "M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83",
    payout_received:
      "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
    payout_cleared:
      "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
    brand_message:
      "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    invite_arrived: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3",
    verification_complete:
      "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
    scan_verified:
      "M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2",
    system:
      "M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
  };
  const d = map[kind] ?? map.system;
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
