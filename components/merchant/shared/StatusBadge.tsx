import type { ReactNode } from "react";
import "./status-badge.css";

export type StatusBadgeStatus =
  // Campaign / application lifecycle
  | "active"
  | "paused"
  | "draft"
  | "closed"
  | "pending"
  | "resolved"
  // Payment lifecycle
  | "paid"
  | "unpaid"
  | "failed"
  // Connectivity
  | "online"
  | "offline"
  // Generic semantic
  | "success"
  | "warning"
  | "error";

export interface StatusBadgeProps {
  status: StatusBadgeStatus;
  children?: ReactNode;
}

const statusLabel: Record<StatusBadgeStatus, string> = {
  active: "Active",
  paused: "Paused",
  draft: "Draft",
  closed: "Closed",
  pending: "Pending",
  resolved: "Resolved",
  paid: "Paid",
  unpaid: "Unpaid",
  failed: "Failed",
  online: "Online",
  offline: "Offline",
  success: "Success",
  warning: "Warning",
  error: "Error",
};

export function StatusBadge({ status, children }: StatusBadgeProps) {
  return (
    <span
      className={`ms-status-badge ms-status-badge--${status}`}
      role="status"
    >
      {children ?? statusLabel[status]}
    </span>
  );
}
