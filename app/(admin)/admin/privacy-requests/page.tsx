"use client";

import { useEffect, useState } from "react";
import "./privacy-requests.css";

/**
 * /admin/privacy-requests — DSAR intake queue for Push ops.
 *
 * Closes P1-DATA-2 from docs/v5.3-optimization-audit-2026-04-21.md.
 *
 * Lists privacy_requests rows ordered by due_at ASC so the soonest-due
 * item is always at the top. Each row shows overdue badge when past SLA.
 * Admins can mark rows resolved / denied with a one-line note.
 */

interface Row {
  ticket_id: string;
  received_at: string;
  request_type: string;
  jurisdiction: string | null;
  status: string;
  due_at: string;
  resolved_at: string | null;
  resolution_note: string | null;
  overdue: boolean;
  sec_until_due: number;
}

/**
 * Returns days remaining as a display string.
 * Kept as pure helper — no side effects.
 */
function formatDueBadge(sec: number, overdue: boolean): string {
  if (overdue) {
    const daysLate = Math.ceil(Math.abs(sec) / 86400);
    return `${daysLate}d OVERDUE`;
  }
  const daysLeft = Math.ceil(sec / 86400);
  if (daysLeft <= 1) return "DUE TODAY";
  if (daysLeft <= 7) return `${daysLeft}d left`;
  return `${daysLeft}d`;
}

/** Returns numeric days remaining (negative = overdue). */
function daysRemaining(sec: number, overdue: boolean): number {
  if (overdue) return -Math.ceil(Math.abs(sec) / 86400);
  return Math.ceil(sec / 86400);
}

/** Maps status string → CSS modifier class on .pr-status-chip. */
function statusChipClass(status: string): string {
  switch (status) {
    case "resolved":
      return "pr-status-chip--resolved";
    case "denied":
      return "pr-status-chip--denied";
    case "verifying":
      return "pr-status-chip--verifying";
    case "in-progress":
    case "in_progress":
      return "pr-status-chip--in-progress";
    case "completed":
      return "pr-status-chip--completed";
    default:
      return "pr-status-chip--open";
  }
}

/** Maps request_type to readable label (uppercase). */
function typeLabel(t: string): string {
  switch (t.toLowerCase()) {
    case "ccpa_deletion":
    case "ccpa-deletion":
      return "CCPA DEL";
    case "ccpa_access":
    case "ccpa-access":
      return "CCPA ACCESS";
    case "gdpr_deletion":
    case "gdpr-deletion":
      return "GDPR DEL";
    case "gdpr_access":
    case "gdpr-access":
      return "GDPR ACCESS";
    case "deletion":
      return "DELETION";
    case "access":
      return "ACCESS";
    case "ccpa":
      return "CCPA";
    case "gdpr":
      return "GDPR";
    default:
      return t.toUpperCase();
  }
}

export default function AdminPrivacyRequestsPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const res = await fetch("/api/admin/privacy-requests");
      const json = (await res.json()) as {
        data?: { rows: Row[] };
        error?: string;
      };
      if (!res.ok) {
        setError(json.error ?? `HTTP ${res.status}`);
        return;
      }
      setRows(json.data?.rows ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function resolve(ticket_id: string, status: "resolved" | "denied") {
    setActing(ticket_id);
    try {
      const note =
        status === "denied"
          ? (window.prompt(
              "Reason for denial (will be mailed to the requester):",
            ) ?? "")
          : (window.prompt("Resolution note (optional):") ?? "");
      const res = await fetch("/api/admin/privacy-requests", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ticket_id, status, resolution_note: note }),
      });
      if (!res.ok) {
        const json = (await res.json()) as { error?: string };
        alert(json.error ?? `HTTP ${res.status}`);
      }
      await load();
    } finally {
      setActing(null);
    }
  }

  return (
    <div className="pr-page">
      {/* ── Page header ── */}
      <div className="pr-header">
        {/* v11 product eyebrow: parenthetical mono */}
        <div className="pr-eyebrow">(PRIVACY·REQUESTS)</div>
        <h1 className="pr-title">DSAR queue</h1>
        <p className="pr-desc">
          CCPA § 1798.130 deadline is 45 calendar days from receipt. Rows below
          are sorted by <code>due_at</code> ascending — the top row is the most
          urgent.
        </p>
      </div>

      <div className="pr-content">
        {/* ── Error banner ── */}
        {error && <div className="pr-error">{error}</div>}

        {/* ── Loading ── */}
        {rows === null ? (
          <div className="pr-loading">Loading…</div>
        ) : rows.length === 0 ? (
          /* ── Empty state ── */
          <div className="pr-card">
            <div className="pr-empty-msg">No open privacy requests.</div>
          </div>
        ) : (
          /* ── Request card with table ── */
          <div className="pr-card">
            {/* Table header */}
            <div className="pr-table-head">
              {["TICKET", "TYPE", "RECEIVED", "SLA", "STATUS", "ACTIONS"].map(
                (h) => (
                  <div key={h} className="pr-table-head__cell">
                    {h}
                  </div>
                ),
              )}
            </div>

            {/* Data rows */}
            {rows.map((r) => {
              const days = daysRemaining(r.sec_until_due, r.overdue);
              const slaMod = r.overdue
                ? "pr-sla-chip--overdue"
                : days < 7
                  ? "pr-sla-chip--critical"
                  : days < 14
                    ? "pr-sla-chip--warn"
                    : "";

              return (
                <div
                  key={r.ticket_id}
                  className={`pr-row${r.overdue ? " pr-row--overdue" : ""}`}
                >
                  {/* Ticket ID */}
                  <div>
                    <code className="pr-ticket-id">
                      {r.ticket_id.slice(0, 8)}
                    </code>
                  </div>

                  {/* Request type badge (CCPA / GDPR / deletion / access) */}
                  <div>
                    <span className="pr-type-badge">
                      {typeLabel(r.request_type)}
                    </span>
                  </div>

                  {/* Received date — mono timestamp */}
                  <div className="pr-date">{r.received_at.slice(0, 10)}</div>

                  {/* SLA countdown — liquid-glass chip + Darky numeral */}
                  <div>
                    <span className={`pr-sla-chip ${slaMod}`}>
                      <span className="pr-sla-chip__days">
                        {formatDueBadge(r.sec_until_due, r.overdue)}
                      </span>
                    </span>
                  </div>

                  {/* Status chip */}
                  <div>
                    <span
                      className={`pr-status-chip ${statusChipClass(r.status)}`}
                    >
                      {r.status}
                    </span>
                  </div>

                  {/* Action buttons — Process → primary, Deny → ghost */}
                  <div className="pr-actions">
                    {r.status === "received" || r.status === "verifying" ? (
                      <>
                        {/* "Process" = resolve → btn-primary (brand-red) */}
                        <button
                          className="pr-btn-primary"
                          disabled={acting === r.ticket_id}
                          onClick={() => resolve(r.ticket_id, "resolved")}
                        >
                          Process
                        </button>
                        {/* "Reject" → btn-ghost */}
                        <button
                          className="pr-btn-ghost"
                          disabled={acting === r.ticket_id}
                          onClick={() => resolve(r.ticket_id, "denied")}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="pr-actions__none">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── SLA reference info card ── */}
        <div className="pr-info-card">
          <div className="pr-info-card__eyebrow">SLA reference</div>
          <div className="pr-info-grid">
            {[
              { label: "CCPA deadline", value: "45 days", sub: "§ 1798.130" },
              { label: "GDPR deadline", value: "30 days", sub: "Art. 12(3)" },
              {
                label: "Extension allowed",
                value: "+45 days",
                sub: "With notice to user",
              },
            ].map(({ label, value, sub }) => (
              <div key={label}>
                <div className="pr-info-stat__label">{label}</div>
                <div className="pr-info-stat__value">{value}</div>
                <div className="pr-info-stat__sub">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
