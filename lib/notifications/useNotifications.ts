"use client";

import { useState, useEffect, useCallback } from "react";

/* ── Types ─────────────────────────────────────────────────── */

export type NotificationRole = "creator" | "merchant";

export type Notification = {
  id: string;
  role: NotificationRole;
  title: string;
  body: string;
  href: string;
  createdAt: string; // ISO string
  read: boolean;
};

/* ── Seed data ─────────────────────────────────────────────── */

const SEED_NOTIFICATIONS: Notification[] = [
  // Creator
  {
    id: "notif-c-001",
    role: "creator",
    title: "Application accepted",
    body: "Your application to Roberta's was accepted.",
    href: "/creator/dashboard",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "notif-c-002",
    role: "creator",
    title: "Milestone reached",
    body: "$120 pending. Your payment is being processed.",
    href: "/creator/dashboard",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "notif-c-003",
    role: "creator",
    title: "New campaign match",
    body: "New campaign matches your profile: Fort Greene coffee shop.",
    href: "/creator/dashboard",
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "notif-c-004",
    role: "creator",
    title: "Score updated",
    body: "Your Push Score increased by 3 points after Brow Theory verification.",
    href: "/creator/profile",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "notif-c-005",
    role: "creator",
    title: "Campaign deadline",
    body: "Flamingo Estate shoot deadline is in 3 days.",
    href: "/creator/dashboard",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  // Merchant
  {
    id: "notif-m-001",
    role: "merchant",
    title: "New applicants",
    body: "8 new applicants for your Bed-Stuy campaign.",
    href: "/merchant/campaigns",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "notif-m-002",
    role: "merchant",
    title: "Budget milestone",
    body: "Campaign 'Spring Launch' reached 50% budget.",
    href: "/merchant/campaigns",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "notif-m-003",
    role: "merchant",
    title: "Conversion verified",
    body: "14 new walk-ins verified this week via QR attribution.",
    href: "/merchant/analytics",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "notif-m-004",
    role: "merchant",
    title: "Creator content live",
    body: "Alex Chen published content for Roberta's Spring campaign.",
    href: "/merchant/campaigns",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "notif-m-005",
    role: "merchant",
    title: "Campaign ended",
    body: "Bed-Stuy Retail Push has ended. Final report available.",
    href: "/merchant/analytics",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
];

/* ── Storage key per role ───────────────────────────────────── */

function storageKey(role: NotificationRole) {
  return `push-notifications-${role}`;
}

function loadFromStorage(role: NotificationRole): Notification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(role));
    if (!raw) return [];
    return JSON.parse(raw) as Notification[];
  } catch {
    return [];
  }
}

function saveToStorage(role: NotificationRole, data: Notification[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(role), JSON.stringify(data));
}

/* ── Hook ───────────────────────────────────────────────────── */

export function useNotifications(role: NotificationRole) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage, seed if empty
  useEffect(() => {
    const stored = loadFromStorage(role);
    const seeded = SEED_NOTIFICATIONS.filter((n) => n.role === role);
    if (stored.length === 0) {
      saveToStorage(role, seeded);
      setNotifications(seeded);
    } else {
      setNotifications(stored);
    }
    setHydrated(true);
  }, [role]);

  const persist = useCallback(
    (next: Notification[]) => {
      setNotifications(next);
      saveToStorage(role, next);
    },
    [role],
  );

  const markAsRead = useCallback(
    (id: string) => {
      setNotifications((prev) => {
        const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
        saveToStorage(role, next);
        return next;
      });
    },
    [role],
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      saveToStorage(role, next);
      return next;
    });
  }, [role]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // TODO: wire to Supabase Realtime
  // subscribeToLive(role: NotificationRole, onNew: (n: Notification) => void) {
  //   const channel = supabase
  //     .channel(`notifications:${role}`)
  //     .on('postgres_changes', {
  //       event: 'INSERT',
  //       schema: 'public',
  //       table: 'notifications',
  //       filter: `role=eq.${role}`,
  //     }, (payload) => onNew(payload.new as Notification))
  //     .subscribe();
  //   return () => supabase.removeChannel(channel);
  // }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllRead,
    hydrated,
    persist,
  };
}

/* ── Time formatting ────────────────────────────────────────── */

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/* ── Group by time bucket ───────────────────────────────────── */

export type NotifGroup = {
  label: "Today" | "This Week" | "Earlier";
  items: Notification[];
};

export function groupNotifications(
  notifications: Notification[],
): NotifGroup[] {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const oneWeekMs = 7 * oneDayMs;

  const today: Notification[] = [];
  const thisWeek: Notification[] = [];
  const earlier: Notification[] = [];

  for (const n of notifications) {
    const age = now - new Date(n.createdAt).getTime();
    if (age < oneDayMs) today.push(n);
    else if (age < oneWeekMs) thisWeek.push(n);
    else earlier.push(n);
  }

  const groups: NotifGroup[] = [];
  if (today.length) groups.push({ label: "Today", items: today });
  if (thisWeek.length) groups.push({ label: "This Week", items: thisWeek });
  if (earlier.length) groups.push({ label: "Earlier", items: earlier });
  return groups;
}
