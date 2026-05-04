"use client";

import { useState } from "react";
import "./oracle-trigger.css";

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

// Signal score bar fill color — token-only, no hardcoded hex
function scoreBarColor(value: number): string {
  if (value >= 0.7) return "var(--brand-red)";
  if (value >= 0.5) return "var(--champagne-deep)";
  return "var(--accent-blue)";
}

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
    <div className="adm-content oracle-page">
      {/* Page header */}
      <div className="adm-page-header">
        {/* (ORACLE·TRIGGER) eyebrow — product register: no parentheses, canonical mono */}
        <span className="oracle-eyebrow">ORACLE · TRIGGER</span>
        <h1 className="adm-page-title">Manual Trigger</h1>
        <p className="oracle-subtitle">
          Re-run the 5-signal ConversionOracle against a specific transaction.
          Every run writes a fresh row to{" "}
          <code className="oracle-code-chip">oracle_audit</code>.
        </p>
      </div>

      <div className="oracle-stack">
        {/* ── Trigger form ── */}
        <form onSubmit={run} className="oracle-form-card">
          <div className="oracle-card-heading">Transaction lookup</div>

          <div className="oracle-field">
            <label className="oracle-field-label">Transaction ID (UUID)</label>
            <input
              className="oracle-input"
              value={txId}
              onChange={(e) => setTxId(e.target.value)}
              placeholder="00000000-0000-0000-0000-000000000000"
              minLength={36}
              maxLength={36}
              required
            />
          </div>

          {/* Unified btn-primary: Brand Red fill — no per-page custom button */}
          <button
            type="submit"
            className="btn-primary oracle-run-btn"
            disabled={state.kind === "running"}
          >
            {state.kind === "running" ? "RUNNING..." : "RUN ORACLE →"}
          </button>
        </form>

        {/* ── Result panel ── */}
        {state.kind === "ok" && (
          <div className="oracle-result-card">
            {/* Decision header */}
            <div className="oracle-decision-row">
              <div className="oracle-decision-label">
                DECISION:{" "}
                <span className="oracle-decision-value">
                  {state.decision.toUpperCase()}
                </span>
              </div>
              {/* Confidence badge — static, no hover shift */}
              <span className="oracle-confidence-badge">
                {(state.confidence_score * 100).toFixed(1)}% confidence
              </span>
            </div>

            {/* Signal scores section */}
            <div className="oracle-section-eyebrow">Signal Scores</div>
            <div className="oracle-signals">
              {Object.entries(state.signal_scores).map(([name, value]) => (
                <div key={name} className="oracle-signal-row">
                  <span className="oracle-signal-name">{name}</span>
                  {/* Score bar track — v11: 8px height, 4px radius */}
                  <div className="oracle-bar-track">
                    <div
                      className="oracle-bar-fill"
                      style={{
                        width: `${value * 100}%`,
                        background: scoreBarColor(value),
                      }}
                    />
                  </div>
                  <span className="oracle-signal-pct">
                    {(value * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>

            {/* Reasoning block */}
            <div className="oracle-reasoning-eyebrow">Reasoning</div>
            <div className="oracle-reasoning-body">{state.reasoning}</div>

            {/* Audit log link */}
            <div className="oracle-audit-footer">
              <span>Result written to</span>
              <code className="oracle-code-chip">oracle_audit</code>
              <span>·</span>
              <a href="/admin/audit-log" className="oracle-audit-link">
                View audit log →
              </a>
            </div>
          </div>
        )}

        {/* ── Error panel ── */}
        {state.kind === "err" && (
          <div className="oracle-error-card" role="alert">
            <div className="oracle-error-title">ERROR</div>
            <p className="oracle-error-message">{state.message}</p>
          </div>
        )}

        {/* ── Info card ── */}
        <div className="oracle-info-card">
          <div className="oracle-section-eyebrow">Use Cases</div>
          <div className="oracle-use-cases">
            {[
              "Transaction landed in manual_review_required — rerun after a fraud ticket closes.",
              "Spot-check a specific row after a model change.",
              "Reproduce a disputed decision for a creator appeal.",
            ].map((text, i) => (
              <div key={i} className="oracle-use-case-item">
                <span className="oracle-use-case-num">{i + 1}.</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
