// Push — Dispute utility helpers

import type { DisputeStatus, DisputeOutcome, DisputeEventType } from "./types";

export function formatAge(dateStr: string): string {
  const ms = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor(ms / 3600000);
  if (days > 0) return `opened ${days}d ago`;
  if (hours > 0) return `opened ${hours}h ago`;
  return "opened just now";
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatAmount(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function statusBadgeClass(status: DisputeStatus): string {
  return `dispute-badge dispute-badge--${status}`;
}

export function eventBorderClass(role: string, type: DisputeEventType): string {
  if (type === "admin_decision") return "dispute-timeline-event--decision";
  if (role === "creator") return "dispute-timeline-event--creator";
  if (role === "merchant") return "dispute-timeline-event--merchant";
  return "dispute-timeline-event--admin";
}

export function eventTypeLabel(type: DisputeEventType): string {
  const map: Record<DisputeEventType, string> = {
    filed: "Filed dispute",
    creator_response: "Creator responded",
    merchant_response: "Merchant responded",
    admin_message: "Admin requested info",
    admin_decision: "Admin decision",
    evidence_added: "Evidence uploaded",
    status_change: "Status updated",
    reopened: "Dispute reopened",
  };
  return map[type] ?? type;
}

export function outcomeLabel(outcome?: DisputeOutcome): string {
  if (!outcome) return "";
  const map: Record<DisputeOutcome, string> = {
    refund_creator: "Decided in Creator's Favor",
    refund_merchant: "Decided in Merchant's Favor",
    split: "Split Resolution",
    dismissed: "Dismissed",
  };
  return map[outcome];
}

export function initialsFrom(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
