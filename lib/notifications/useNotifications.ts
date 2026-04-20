"use client";

import { useState, useEffect } from "react";

export type NotificationRole = "creator" | "merchant";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  href: string;
  read: boolean;
  createdAt: string;
  type: "invite" | "payment" | "update" | "system";
};

const DEMO_NOTIFICATIONS: Record<NotificationRole, AppNotification[]> = {
  creator: [
    {
      id: "n1",
      title: "New campaign invite",
      body: "Superiority Burger wants you for their summer campaign.",
      href: "/creator/discover",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      type: "invite",
    },
    {
      id: "n2",
      title: "Payment received",
      body: "You earned $45 from Best Burger in NYC Feature.",
      href: "/creator/earnings",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      type: "payment",
    },
    {
      id: "n3",
      title: "Submission approved",
      body: "Your content for Flamingo Estate has been approved.",
      href: "/creator/work/pipeline",
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      type: "update",
    },
  ],
  merchant: [
    {
      id: "m1",
      title: "New application",
      body: "Alex Chen applied to your summer campaign.",
      href: "/merchant/applicants",
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      type: "invite",
    },
    {
      id: "m2",
      title: "Content submitted",
      body: "Maya Rodriguez submitted content for review.",
      href: "/merchant/campaigns",
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      type: "update",
    },
  ],
};

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export type NotificationGroup = {
  label: string;
  items: AppNotification[];
};

// Groups notifications into Today / Yesterday / This week / Earlier buckets.
// Input is expected to be pre-sorted (newest first); output preserves that order.
export function groupNotifications(
  notifications: AppNotification[],
): NotificationGroup[] {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  const startOfYesterday = startOfToday - dayMs;
  const startOfWeek = startOfToday - 6 * dayMs;

  const buckets: Record<string, AppNotification[]> = {
    Today: [],
    Yesterday: [],
    "This week": [],
    Earlier: [],
  };

  for (const n of notifications) {
    const t = new Date(n.createdAt).getTime();
    if (t >= startOfToday) buckets.Today.push(n);
    else if (t >= startOfYesterday) buckets.Yesterday.push(n);
    else if (t >= startOfWeek) buckets["This week"].push(n);
    else buckets.Earlier.push(n);
  }

  return (["Today", "Yesterday", "This week", "Earlier"] as const)
    .filter((label) => buckets[label].length > 0)
    .map((label) => ({ label, items: buckets[label] }));
}

export function useNotifications(role: NotificationRole) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setNotifications(DEMO_NOTIFICATIONS[role] ?? []);
    setHydrated(true);
  }, [role]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return { notifications, unreadCount, markAsRead, markAllRead, hydrated };
}
