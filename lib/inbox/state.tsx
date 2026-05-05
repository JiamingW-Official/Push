"use client";

/* ============================================================
   Inbox shared state — single React context owning the three
   data streams (invites · threads · notifications) and every
   mutation that touches them.

   Why this exists: before this provider, each tab held its own
   useState fork of the same seed. Accept an invite in /invites
   → /messages and /system didn't see it. Mark a thread read in
   /messages → the unread badge on the segmented pill stayed
   stale. The Hub view derived from seed but never reflected
   user actions. Audit §五 root cause — solved here.

   When real APIs land: this provider is what gets replaced.
   Pages keep importing useInboxState() and the action names
   stay identical, so the UI surface doesn't move.
   ============================================================ */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  SEED_INVITES,
  SEED_THREADS,
  SEED_NOTIFICATIONS,
  buildAcceptSteps,
  type Invite,
  type AcceptStep,
  type Thread,
  type Message,
  type SystemNotif,
} from "./seed";

/* ── Toast model — surface ephemeral undo for Decline ─────── */
type DeclineToast = {
  id: string;
  brand: string;
  expiresAt: number;
} | null;

/* ── Context shape ────────────────────────────────────────── */

type InboxState = {
  invites: Invite[];
  threads: Thread[];
  notifications: SystemNotif[];
  declineToast: DeclineToast;
  /** Most recent screen-reader announcement (transient). Render
   *  inside an aria-live="polite" region. Empty string = silent. */
  liveMessage: string;

  /* Computed live values used by the segmented nav badges +
     the Hub Now view. Memoised inside the provider. */
  unreadInvites: number;
  unreadThreads: number;
  unreadNotifications: number;

  /* — Invite mutations — */
  acceptInvite: (id: string) => void;
  declineInvite: (id: string) => void;
  undoLastDecline: () => void;
  toggleAcceptStep: (inviteId: string, stepId: AcceptStep["id"]) => void;
  acceptTopMatches: () => void;

  /* — Thread mutations — */
  markThreadRead: (id: string) => void;
  toggleStar: (id: string) => void;
  sendMessage: (id: string, text: string) => void;

  /* — Notification mutations — */
  markNotifRead: (id: string) => void;
  markAllNotifsRead: () => void;
  snoozeNotif: (id: string, hours: number) => void;
};

const InboxStateContext = createContext<InboxState | null>(null);

/* ── Provider ─────────────────────────────────────────────── */

export function InboxStateProvider({ children }: { children: ReactNode }) {
  const [invites, setInvites] = useState<Invite[]>(SEED_INVITES);
  const [threads, setThreads] = useState<Thread[]>(SEED_THREADS);
  const [notifications, setNotifications] =
    useState<SystemNotif[]>(SEED_NOTIFICATIONS);
  const [declineToast, setDeclineToast] = useState<DeclineToast>(null);

  /* A11y live-region: announce mutations to screen readers.
     Updates here trigger an aria-live="polite" announcement via
     <InboxLiveRegion /> rendered at the bottom of the layout. */
  const [liveMessage, setLiveMessage] = useState<string>("");
  const announce = useCallback((msg: string) => {
    setLiveMessage("");
    // Force re-render with empty so identical-text repeats also fire.
    requestAnimationFrame(() => setLiveMessage(msg));
  }, []);

  /* Auto-dismiss decline toast after 5s. The Undo button calls
     undoLastDecline() before this fires. */
  useEffect(() => {
    if (!declineToast) return;
    const ms = declineToast.expiresAt - Date.now();
    const t = setTimeout(() => setDeclineToast(null), Math.max(0, ms));
    return () => clearTimeout(t);
  }, [declineToast]);

  /* Phase 0: auto-decline invites that have been expired for >24h.
     Runs on mount and every 60s. No toast — silent system action. */
  useEffect(() => {
    const run = () => {
      const cutoff = Date.now() - 24 * 60 * 60 * 1000;
      setInvites((prev) =>
        prev.map((i) =>
          i.status === "pending" && i.expiresAt < cutoff
            ? { ...i, status: "declined" }
            : i,
        ),
      );
    };
    run();
    const id = setInterval(run, 60_000);
    return () => clearInterval(id);
  }, []);

  /* ── Invite mutations ─────────────────────────────────── */

  const acceptInvite = useCallback((id: string) => {
    const target = SEED_INVITES.find((i) => i.id === id);
    setInvites((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: "accepted", acceptSteps: buildAcceptSteps(i) }
          : i,
      ),
    );
    if (target) announce(`Accepted ${target.brand}. Sign FTC disclosure next.`);

    /* Side effect: accepting an invite fires a real FTC
       compliance notification — required by v5.4. This is
       the kind of cross-stream consequence that used to
       silently disappear when state was page-local. */
    setNotifications((prev) => {
      const target = SEED_INVITES.find((i) => i.id === id);
      if (!target) return prev;
      // Don't duplicate if a disclosure prompt already exists
      const already = prev.some(
        (n) =>
          n.category === "compliance" &&
          n.title.includes(target.brand) &&
          !n.read,
      );
      if (already) return prev;
      const newNotif: SystemNotif = {
        id: `sys-disc-${id}-${Date.now()}`,
        type: "system",
        title: `FTC disclosure pending · ${target.brand}`,
        body: "v5.4 requires #ad disclosure on every accepted campaign. Sign before posting.",
        href: `/creator/compliance/disclosure/${id}`,
        createdAt: new Date().toISOString(),
        read: false,
        category: "compliance",
        priority: true,
        nextAction: {
          label: "Sign disclosure",
          href: `/creator/compliance/disclosure/${id}`,
        },
      };
      return [newNotif, ...prev];
    });
  }, []);

  const declineInvite = useCallback(
    (id: string) => {
      const target = invites.find((i) => i.id === id);
      setInvites((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: "declined" } : i)),
      );
      setDeclineToast({
        id,
        brand: target?.brand ?? "Invite",
        expiresAt: Date.now() + 5000,
      });
      if (target)
        announce(`Declined ${target.brand}. Undo available for 5 seconds.`);
    },
    [invites, announce],
  );

  const undoLastDecline = useCallback(() => {
    if (!declineToast) return;
    const id = declineToast.id;
    setInvites((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "pending" } : i)),
    );
    setDeclineToast(null);
    announce(`Decline undone for ${declineToast.brand}.`);
  }, [declineToast, announce]);

  const toggleAcceptStep = useCallback(
    (inviteId: string, stepId: AcceptStep["id"]) => {
      setInvites((prev) =>
        prev.map((i) =>
          i.id === inviteId && i.acceptSteps
            ? {
                ...i,
                acceptSteps: i.acceptSteps.map((s) =>
                  s.id === stepId ? { ...s, done: !s.done } : s,
                ),
              }
            : i,
        ),
      );
    },
    [],
  );

  const acceptTopMatches = useCallback(() => {
    /* Use the unified acceptInvite per id so the FTC side
       effect fires once per match — not once for the batch. */
    const ids = invites
      .filter((i) => i.matchScore >= 90 && i.status === "pending")
      .map((i) => i.id);
    for (const id of ids) acceptInvite(id);
  }, [invites, acceptInvite]);

  /* ── Thread mutations ─────────────────────────────────── */

  const markThreadRead = useCallback((id: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, unread: false } : t)),
    );
  }, []);

  const toggleStar = useCallback((id: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, starred: !t.starred } : t)),
    );
  }, []);

  const sendMessage = useCallback((id: string, text: string) => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              messages: [
                ...t.messages,
                {
                  id: `m-${Date.now()}`,
                  from: "self",
                  text,
                  at: new Date().toISOString(),
                } as Message,
              ],
              preview: text,
              createdAt: new Date().toISOString(),
            }
          : t,
      ),
    );
  }, []);

  /* ── Notification mutations ───────────────────────────── */

  const markNotifRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllNotifsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    announce("All notifications marked read.");
  }, [announce]);

  const snoozeNotif = useCallback(
    (id: string, hours: number) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, snoozedUntil: Date.now() + hours * 60 * 60 * 1000 }
            : n,
        ),
      );
      const label =
        hours === 1
          ? "1 hour"
          : hours === 3
            ? "3 hours"
            : hours <= 24
              ? "tomorrow"
              : "next week";
      announce(`Snoozed for ${label}.`);
    },
    [announce],
  );

  /* ── Derived counts (drive segmented nav badges) ────── */

  const counts = useMemo(() => {
    const now = Date.now();
    return {
      unreadInvites: invites.filter(
        (i) => i.status === "pending" && i.expiresAt > now,
      ).length,
      unreadThreads: threads.filter((t) => t.unread).length,
      unreadNotifications: notifications.filter(
        (n) => !n.read && (!n.snoozedUntil || n.snoozedUntil <= now),
      ).length,
    };
  }, [invites, threads, notifications]);

  const value: InboxState = {
    invites,
    threads,
    notifications,
    declineToast,
    liveMessage,
    ...counts,
    acceptInvite,
    declineInvite,
    undoLastDecline,
    toggleAcceptStep,
    acceptTopMatches,
    markThreadRead,
    toggleStar,
    sendMessage,
    markNotifRead,
    markAllNotifsRead,
    snoozeNotif,
  };

  return (
    <InboxStateContext.Provider value={value}>
      {children}
    </InboxStateContext.Provider>
  );
}

/* ── Hook ────────────────────────────────────────────────── */

export function useInboxState(): InboxState {
  const ctx = useContext(InboxStateContext);
  if (!ctx) {
    throw new Error(
      "useInboxState must be called inside <InboxStateProvider>. " +
        "Make sure your page is rendered under app/(creator)/creator/(workspace)/inbox/layout.tsx.",
    );
  }
  return ctx;
}
