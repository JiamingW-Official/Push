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
