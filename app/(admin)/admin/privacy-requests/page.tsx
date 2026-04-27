"use client";

import { useEffect, useState } from "react";

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

function statusChip(status: string): { bg: string; color: string } {
  switch (status) {
    case "resolved":
      return { bg: "rgba(0,133,255,0.08)", color: "var(--accent-blue)" };
    case "denied":
      return { bg: "rgba(193,18,31,0.08)", color: "var(--brand-red)" };
    case "verifying":
      return { bg: "var(--panel-butter)", color: "var(--ink-3)" };
    default:
      return { bg: "var(--surface-3)", color: "var(--ink-4)" };
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

  const cardStyle: React.CSSProperties = {
    background: "var(--surface-2)",
    border: "1px solid var(--hairline)",
    borderRadius: 10,
    padding: "20px 24px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface)",
        paddingBottom: 64,
      }}
    >
      {/* Page header */}
      <div style={{ padding: "40px 40px 32px" }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          ADMIN · PUSH INTERNAL · PRIVACY
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px,4vw,56px)",
            fontWeight: 800,
            color: "var(--ink)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            marginBottom: 12,
          }}
        >
          DSAR queue
        </h1>
        <p
          style={{
            fontSize: 14,
            fontFamily: "var(--font-body)",
            color: "var(--ink-4)",
            lineHeight: 1.6,
            maxWidth: 560,
          }}
        >
          CCPA § 1798.130 deadline is 45 calendar days from receipt. Rows below
          are sorted by{" "}
          <code
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              background: "var(--surface-3)",
              padding: "1px 6px",
              borderRadius: 4,
              border: "1px solid var(--hairline)",
            }}
          >
            due_at
          </code>{" "}
          ascending — the top row is the most urgent.
        </p>
      </div>

      <div style={{ padding: "0 40px" }}>
        {/* Error banner */}
        {error && (
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(193,18,31,0.05)",
              border: "1px solid rgba(193,18,31,0.2)",
              borderRadius: 8,
              color: "var(--brand-red)",
              fontSize: 13,
              fontFamily: "var(--font-body)",
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        {rows === null ? (
          <div
            style={{
              padding: "48px 0",
              textAlign: "center",
              fontSize: 14,
              fontFamily: "var(--font-body)",
              color: "var(--ink-4)",
            }}
          >
            Loading…
          </div>
        ) : rows.length === 0 ? (
          <div style={cardStyle}>
            <div
              style={{
                padding: "32px 0",
                textAlign: "center",
                fontSize: 14,
                fontFamily: "var(--font-body)",
                color: "var(--ink-4)",
              }}
            >
              No open privacy requests.
            </div>
          </div>
        ) : (
          <div style={cardStyle}>
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "100px 120px 100px 100px 100px 200px",
                gap: 12,
                padding: "8px 0",
                borderBottom: "2px solid var(--hairline)",
                marginBottom: 0,
              }}
            >
              {["TICKET", "TYPE", "RECEIVED", "DUE", "STATUS", "ACTIONS"].map(
                (h) => (
                  <div
                    key={h}
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.07em",
                      fontFamily: "var(--font-body)",
                      color: "var(--ink-4)",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </div>
                ),
              )}
            </div>

            {/* Rows */}
            {rows.map((r) => {
              const sc = statusChip(r.status);
              return (
                <div
                  key={r.ticket_id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px 120px 100px 100px 100px 200px",
                    gap: 12,
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: "1px solid var(--hairline)",
                    background: r.overdue
                      ? "rgba(193,18,31,0.02)"
                      : "transparent",
                  }}
                >
                  {/* Ticket ID */}
                  <div>
                    <code
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        color: "var(--ink)",
                        background: "var(--surface-3)",
                        padding: "2px 6px",
                        borderRadius: 4,
                        border: "1px solid var(--hairline)",
                      }}
                    >
                      {r.ticket_id.slice(0, 8)}
                    </code>
                  </div>

                  {/* Type */}
                  <div
                    style={{
                      fontSize: 13,
                      fontFamily: "var(--font-body)",
                      color: "var(--ink)",
                      fontWeight: 500,
                    }}
                  >
                    {r.request_type}
                  </div>

                  {/* Received */}
                  <div>
                    <code
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        color: "var(--ink-4)",
                      }}
                    >
                      {r.received_at.slice(0, 10)}
                    </code>
                  </div>

                  {/* Due */}
                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 8px",
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: "var(--font-body)",
                        background: r.overdue
                          ? "var(--brand-red)"
                          : "var(--surface-3)",
                        color: r.overdue ? "var(--snow)" : "var(--ink-3)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {formatDueBadge(r.sec_until_due, r.overdue)}
                    </span>
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 8px",
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: "var(--font-body)",
                        background: sc.bg,
                        color: sc.color,
                        textTransform: "capitalize",
                      }}
                    >
                      {r.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8 }}>
                    {r.status === "received" || r.status === "verifying" ? (
                      <>
                        <button
                          style={{
                            padding: "6px 14px",
                            border: "none",
                            borderRadius: 6,
                            background: "var(--ink)",
                            color: "var(--snow)",
                            fontFamily: "var(--font-body)",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                            cursor:
                              acting === r.ticket_id
                                ? "not-allowed"
                                : "pointer",
                            opacity: acting === r.ticket_id ? 0.5 : 1,
                          }}
                          disabled={acting === r.ticket_id}
                          onClick={() => resolve(r.ticket_id, "resolved")}
                          className="click-shift"
                        >
                          Resolve
                        </button>
                        <button
                          style={{
                            padding: "6px 14px",
                            border: "1px solid rgba(193,18,31,0.25)",
                            borderRadius: 6,
                            background: "rgba(193,18,31,0.05)",
                            color: "var(--brand-red)",
                            fontFamily: "var(--font-body)",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                            cursor:
                              acting === r.ticket_id
                                ? "not-allowed"
                                : "pointer",
                            opacity: acting === r.ticket_id ? 0.5 : 1,
                          }}
                          disabled={acting === r.ticket_id}
                          onClick={() => resolve(r.ticket_id, "denied")}
                          className="click-shift"
                        >
                          Deny
                        </button>
                      </>
                    ) : (
                      <span
                        style={{
                          fontSize: 12,
                          fontFamily: "var(--font-body)",
                          color: "var(--ink-4)",
                        }}
                      >
                        —
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info card */}
        <div
          style={{
            ...cardStyle,
            marginTop: 24,
            background: "var(--surface-3)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.07em",
              fontFamily: "var(--font-body)",
              color: "var(--ink-4)",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            SLA reference
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
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
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-body)",
                    color: "var(--ink-4)",
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontWeight: 700,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 20,
                    fontWeight: 800,
                    color: "var(--ink)",
                    lineHeight: 1,
                    marginBottom: 2,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-body)",
                    color: "var(--ink-4)",
                  }}
                >
                  {sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
