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
    <div style={S.page}>
      <header style={S.header}>
        <p style={S.eyebrow}>ADMIN / PRIVACY</p>
        <h1 style={S.title}>DSAR queue</h1>
        <p style={S.lede}>
          CCPA § 1798.130 deadline is 45 calendar days from receipt. Rows below
          are sorted by <code>due_at</code> ascending — the top row is the most
          urgent.
        </p>
      </header>

      {error && <div style={S.err}>{error}</div>}

      {rows === null ? (
        <p style={S.loading}>Loading…</p>
      ) : rows.length === 0 ? (
        <p style={S.empty}>No open privacy requests.</p>
      ) : (
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>TICKET</th>
              <th style={S.th}>TYPE</th>
              <th style={S.th}>RECEIVED</th>
              <th style={S.th}>DUE</th>
              <th style={S.th}>STATUS</th>
              <th style={S.th}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.ticket_id} style={r.overdue ? S.rowOverdue : S.row}>
                <td style={S.td}>
                  <code style={S.mono}>{r.ticket_id.slice(0, 8)}</code>
                </td>
                <td style={S.td}>{r.request_type}</td>
                <td style={S.td}>
                  <code style={S.mono}>{r.received_at.slice(0, 10)}</code>
                </td>
                <td style={S.td}>
                  <span style={r.overdue ? S.dueOverdue : S.dueOK}>
                    {formatDueBadge(r.sec_until_due, r.overdue)}
                  </span>
                </td>
                <td style={S.td}>{r.status}</td>
                <td style={S.td}>
                  {r.status === "received" || r.status === "verifying" ? (
                    <>
                      <button
                        type="button"
                        style={S.btnResolve}
                        disabled={acting === r.ticket_id}
                        onClick={() => resolve(r.ticket_id, "resolved")}
                      >
                        Resolve
                      </button>
                      <button
                        type="button"
                        style={S.btnDeny}
                        disabled={acting === r.ticket_id}
                        onClick={() => resolve(r.ticket_id, "denied")}
                      >
                        Deny
                      </button>
                    </>
                  ) : (
                    <span style={S.muted}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const S = {
  page: {
    minHeight: "100vh",
    background: "var(--surface)",
    color: "var(--dark)",
    fontFamily: "var(--font-body)",
    padding: "40px 24px",
    maxWidth: "1080px",
    margin: "0 auto",
  } as React.CSSProperties,
  header: { marginBottom: "24px" } as React.CSSProperties,
  eyebrow: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--primary)",
    marginBottom: "8px",
  } as React.CSSProperties,
  title: {
    fontFamily: "var(--font-display)",
    fontSize: "32px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    marginBottom: "8px",
  } as React.CSSProperties,
  lede: {
    fontSize: "13px",
    color: "var(--graphite)",
    lineHeight: 1.6,
  } as React.CSSProperties,
  loading: {
    color: "var(--text-muted)",
    fontSize: "13px",
  } as React.CSSProperties,
  empty: {
    color: "var(--text-muted)",
    fontSize: "13px",
  } as React.CSSProperties,
  err: {
    padding: "12px 16px",
    background: "rgba(193,18,31,0.06)",
    border: "1px solid var(--primary)",
    color: "var(--primary)",
    marginBottom: "16px",
    fontSize: "13px",
  } as React.CSSProperties,
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: "13px",
    background: "var(--surface-elevated)",
    border: "1px solid var(--line)",
  } as React.CSSProperties,
  th: {
    textAlign: "left" as const,
    padding: "12px 16px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--text-muted)",
    borderBottom: "2px solid var(--line)",
  } as React.CSSProperties,
  row: {
    borderBottom: "1px solid var(--line)",
  } as React.CSSProperties,
  rowOverdue: {
    borderBottom: "1px solid var(--line)",
    background: "rgba(193,18,31,0.04)",
  } as React.CSSProperties,
  td: { padding: "12px 16px" } as React.CSSProperties,
  mono: {
    fontFamily: "var(--font-mono, monospace)",
    fontSize: "12px",
    color: "var(--dark)",
  } as React.CSSProperties,
  dueOK: {
    display: "inline-block",
    padding: "2px 8px",
    background: "var(--surface)",
    border: "1px solid var(--line)",
    fontSize: "11px",
    fontWeight: 600,
  } as React.CSSProperties,
  dueOverdue: {
    display: "inline-block",
    padding: "2px 8px",
    background: "var(--primary)",
    color: "#ffffff",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.04em",
  } as React.CSSProperties,
  btnResolve: {
    padding: "6px 12px",
    background: "var(--dark)",
    color: "#ffffff",
    border: "none",
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.04em",
    cursor: "pointer",
    marginRight: "8px",
  } as React.CSSProperties,
  btnDeny: {
    padding: "6px 12px",
    background: "var(--surface-elevated)",
    color: "var(--primary)",
    border: "1px solid var(--primary)",
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.04em",
    cursor: "pointer",
  } as React.CSSProperties,
  muted: {
    color: "var(--text-muted)",
    fontSize: "12px",
  } as React.CSSProperties,
};
