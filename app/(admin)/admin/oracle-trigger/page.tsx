"use client";

import { useState } from "react";

/**
 * /admin/oracle-trigger — v5.3-EXEC P1-4 admin control panel.
 *
 * Lets ops re-run the ConversionOracle on any push_transactions row by
 * entering its transaction_id. Calls POST /api/admin/oracle-trigger which
 * requires an admin session, runs the 5-signal oracle, and writes a new
 * oracle_audit row.
 *
 * Use cases:
 *   - Transaction landed in manual_review_required — rerun after a fraud ticket closes.
 *   - Spot-check a specific row after a model change.
 *   - Reproduce a disputed decision for a creator appeal.
 */

interface TriggerOk {
  kind: "ok";
  transaction_id: string;
  decision: string;
  confidence_score: number;
  signal_scores: Record<string, number>;
  reasoning: string;
}

interface TriggerErr {
  kind: "err";
  message: string;
}

interface TriggerIdle {
  kind: "idle";
}

interface TriggerRunning {
  kind: "running";
}

type TriggerState = TriggerIdle | TriggerRunning | TriggerOk | TriggerErr;

export default function AdminOracleTriggerPage() {
  const [txId, setTxId] = useState("");
  const [state, setState] = useState<TriggerState>({ kind: "idle" });

  async function run(e: React.FormEvent) {
    e.preventDefault();
    if (!txId.trim()) return;
    setState({ kind: "running" });
    try {
      const res = await fetch("/api/admin/oracle-trigger", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ transaction_id: txId.trim() }),
      });
      const json = (await res.json()) as {
        data?: Omit<TriggerOk, "kind">;
        error?: string;
      };
      if (!res.ok || !json.data) {
        setState({
          kind: "err",
          message: json.error ?? `HTTP ${res.status}`,
        });
        return;
      }
      setState({ kind: "ok", ...json.data });
    } catch (err) {
      setState({
        kind: "err",
        message: err instanceof Error ? err.message : "Request failed",
      });
    }
  }

  return (
    <div style={S.page}>
      <header style={S.header}>
        <p style={S.eyebrow}>ADMIN / CONVERSION ORACLE</p>
        <h1 style={S.title}>Manual trigger</h1>
        <p style={S.lede}>
          Re-run the 5-signal ConversionOracle against a specific transaction.
          Every run writes a fresh row to <code>oracle_audit</code>.
        </p>
      </header>

      <form onSubmit={run} style={S.form}>
        <label style={S.label}>
          TRANSACTION ID (UUID)
          <input
            value={txId}
            onChange={(e) => setTxId(e.target.value)}
            placeholder="00000000-0000-0000-0000-000000000000"
            minLength={36}
            maxLength={36}
            required
            style={S.input}
          />
        </label>

        <button
          type="submit"
          disabled={state.kind === "running"}
          style={S.submit}
        >
          {state.kind === "running" ? "Running…" : "RUN ORACLE →"}
        </button>
      </form>

      {state.kind === "ok" && (
        <section style={S.result}>
          <p style={S.resultHead}>DECISION: {state.decision.toUpperCase()}</p>
          <p style={S.line}>
            Confidence:{" "}
            <strong>{(state.confidence_score * 100).toFixed(1)}%</strong>
          </p>
          <p style={S.line}>
            <strong>Signals:</strong>
          </p>
          <ul style={S.sigList}>
            {Object.entries(state.signal_scores).map(([name, value]) => (
              <li key={name} style={S.sigItem}>
                {name}: {(value * 100).toFixed(0)}%
              </li>
            ))}
          </ul>
          <p style={S.line}>
            <small>{state.reasoning}</small>
          </p>
        </section>
      )}

      {state.kind === "err" && (
        <section style={S.err} role="alert">
          <p style={S.errHead}>ERROR</p>
          <p style={S.line}>{state.message}</p>
        </section>
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
    padding: "48px 24px",
    maxWidth: "720px",
    margin: "0 auto",
  } as React.CSSProperties,
  header: { marginBottom: "32px" } as React.CSSProperties,
  eyebrow: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--primary)",
    marginBottom: "8px",
  } as React.CSSProperties,
  title: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(28px, 5vw, 40px)",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    marginBottom: "8px",
  } as React.CSSProperties,
  lede: {
    fontSize: "14px",
    color: "var(--graphite)",
    lineHeight: 1.6,
  } as React.CSSProperties,
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "24px",
    border: "1px solid var(--line)",
    background: "var(--surface-elevated)",
  } as React.CSSProperties,
  label: {
    display: "flex",
    flexDirection: "column",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    gap: "8px",
    color: "var(--text-muted)",
  } as React.CSSProperties,
  input: {
    padding: "12px 16px",
    border: "1px solid var(--line)",
    background: "var(--surface)",
    color: "var(--dark)",
    fontFamily: "var(--font-body)",
    fontSize: "15px",
    fontFamilyName: "monospace",
    borderRadius: 0,
  } as React.CSSProperties,
  submit: {
    padding: "16px",
    background: "var(--primary)",
    color: "#ffffff",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    border: "none",
    borderRadius: 0,
    cursor: "pointer",
  } as React.CSSProperties,
  result: {
    marginTop: "24px",
    padding: "20px",
    border: "2px solid var(--dark)",
    background: "var(--surface-elevated)",
  } as React.CSSProperties,
  resultHead: {
    fontFamily: "var(--font-display)",
    fontSize: "18px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    marginBottom: "12px",
  } as React.CSSProperties,
  line: {
    fontSize: "13px",
    color: "var(--dark)",
    marginTop: "8px",
  } as React.CSSProperties,
  sigList: {
    listStyle: "none",
    padding: 0,
    marginTop: "8px",
  } as React.CSSProperties,
  sigItem: {
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    padding: "4px 0",
    borderBottom: "1px dashed var(--line)",
  } as React.CSSProperties,
  err: {
    marginTop: "24px",
    padding: "20px",
    border: "2px solid var(--primary)",
    background: "rgba(193,18,31,0.06)",
  } as React.CSSProperties,
  errHead: {
    fontFamily: "var(--font-display)",
    fontSize: "16px",
    fontWeight: 800,
    color: "var(--primary)",
    marginBottom: "8px",
  } as React.CSSProperties,
};
