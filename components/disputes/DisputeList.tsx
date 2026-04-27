"use client";

import Link from "next/link";
import type { Dispute } from "@/lib/disputes/types";
import {
  DISPUTE_REASON_LABELS,
  DISPUTE_STATUS_LABELS,
} from "@/lib/disputes/types";
import {
  formatAge,
  formatAmount,
  statusBadgeClass,
} from "@/lib/disputes/utils";

interface DisputeListProps {
  disputes: Dispute[];
  basePath: string; // "/creator/disputes" | "/merchant/disputes"
}

export function DisputeList({ disputes, basePath }: DisputeListProps) {
  if (disputes.length === 0) {
    return (
      <div className="disputes-empty">
        <p className="disputes-empty__title">No disputes found</p>
        <p className="disputes-empty__body">
          Disputes you file or receive will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="disputes-list">
      {/* Header */}
      <div className="disputes-list__header">
        <span className="disputes-list__col-label">ID</span>
        <span className="disputes-list__col-label">Campaign</span>
        <span className="disputes-list__col-label">Amount</span>
        <span className="disputes-list__col-label">Filed by</span>
        <span className="disputes-list__col-label">Status</span>
        <span className="disputes-list__col-label">Age</span>
        <span />
      </div>

      {/* Rows */}
      {disputes.map((d) => (
        <Link
          key={d.id}
          href={`${basePath}/${d.id}`}
          className="disputes-list__row"
        >
          <span className="disputes-row__id">{d.id}</span>

          <span className="disputes-row__campaign">
            <span className="disputes-row__campaign-name">
              {d.campaignTitle}
            </span>
            <span className="disputes-row__party">
              {d.merchantName} · {d.creatorName}
            </span>
          </span>

          <span className="disputes-row__amount">{formatAmount(d.amount)}</span>

          <span className="disputes-row__filed-by">
            <span className="disputes-row__filed-name">{d.filedBy}</span>
            <span className="disputes-row__filed-role">{d.filedByRole}</span>
          </span>

          <span>
            <span className={statusBadgeClass(d.status)}>
              {DISPUTE_STATUS_LABELS[d.status]}
            </span>
            <br />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                color: "var(--ink-4)",
                marginTop: "3px",
                display: "block",
              }}
            >
              {DISPUTE_REASON_LABELS[d.reason]}
            </span>
          </span>

          <span className="disputes-row__age">{formatAge(d.createdAt)}</span>

          <span className="disputes-row__arrow" aria-hidden="true">
            →
          </span>
        </Link>
      ))}
    </div>
  );
}
