"use client";

/**
 * Topnav notifications bell — fixed-position trigger that opens the
 * NotificationsDrawer. Renders next to the avatar in the lumin shell
 * upper-right corner. The unread dot pulses when count > 0.
 *
 * Wired from /creator/(workspace)/layout.tsx so every workspace page
 * gets the bell + drawer for free.
 */

import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useNotifications } from "@/lib/data/hooks/useNotifications";
import { NotificationsDrawer } from "./NotificationsDrawer";
import "./NotificationsBell.css";

type Props = {
  /** Pass-through to enable realtime subscription. */
  creatorId?: string;
};

export function NotificationsBell({ creatorId }: Props) {
  const [open, setOpen] = useState(false);
  const { unreadCount } = useNotifications(creatorId);
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();

  /* Auto-open when redirected from the legacy /creator/notifications route.
     Strip the param after open so the URL stays clean. */
  useEffect(() => {
    if (params?.get("notifications") === "open") {
      setOpen(true);
      const next = new URLSearchParams(params.toString());
      next.delete("notifications");
      const qs = next.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    }
  }, [params, pathname, router]);

  return (
    <>
      <button
        type="button"
        className="notif-bell"
        data-drawer-trigger
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M14 21a2 2 0 0 1-4 0"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {unreadCount > 0 ? (
          <span className="notif-bell__dot" aria-hidden>
            {unreadCount > 9 ? "9+" : String(unreadCount)}
          </span>
        ) : null}
      </button>

      <NotificationsDrawer
        open={open}
        onClose={() => setOpen(false)}
        creatorId={creatorId}
      />
    </>
  );
}
