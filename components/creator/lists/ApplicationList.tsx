"use client";

import type { Application } from "@/lib/creator/types";
import { MILESTONE_LABELS } from "@/lib/creator/constants";
import "./ApplicationList.css";

type StatusFilter = "all" | "active" | "pending" | "completed";

const FILTER_LABELS: Record<StatusFilter, string> = {
  all: "All",
  active: "Active",
  pending: "Pending",
  completed: "Completed",
};

function matchesFilter(app: Application, filter: StatusFilter): boolean {
  if (filter === "all") return true;
  if (filter === "pending") return app.status === "pending";
  if (filter === "completed") return app.milestone === "settled";
  // active = accepted and not yet settled
  return app.status === "accepted" && app.milestone !== "settled";
}

interface ApplicationListProps {
  applications: Application[];
  statusFilter: StatusFilter;
  onFilterChange: (f: StatusFilter) => void;
}

export default function ApplicationList({
  applications,
  statusFilter,
  onFilterChange,
}: ApplicationListProps) {
  const filtered = applications.filter((a) => matchesFilter(a, statusFilter));

  return (
    <div className="al-root">
      {/* Filter chips */}
      <div className="al-filters" role="group" aria-label="Filter applications">
        {(Object.keys(FILTER_LABELS) as StatusFilter[]).map((key) => (
          <button
            key={key}
            className={`al-chip${statusFilter === key ? " al-chip--active" : ""}`}
            onClick={() => onFilterChange(key)}
            aria-pressed={statusFilter === key}
          >
            {FILTER_LABELS[key]}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="al-empty">
          <p className="al-empty__text">No applications match this filter.</p>
        </div>
      ) : (
        <ul className="al-list" role="list">
          {filtered.map((app) => (
            <li key={app.id} className="al-row">
              <div className="al-row__left">
                <span className="al-merchant">{app.merchant_name}</span>
                <span className="al-title">{app.campaign_title}</span>
                {app.category && (
                  <span className="al-category">{app.category}</span>
                )}
              </div>
              <div className="al-row__right">
                <span
                  className={`al-status al-status--${app.status}`}
                  aria-label={`Status: ${app.status}`}
                >
                  {app.status}
                </span>
                <span className="al-milestone">
                  {MILESTONE_LABELS[app.milestone]}
                </span>
                <span className="al-payout">${app.payout}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
