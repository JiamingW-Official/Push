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

  const cardStyle: React.CSSProperties = {
    background: "var(--surface-2)",
    border: "1px solid var(--hairline)",
    borderRadius: 10,
    padding: "24px 28px",
  };

  return (
    <div className="adm-content" style={{ minHeight: "100vh" }}>
      {/* Page header */}
      <div className="adm-page-header">
        <div className="adm-page-eyebrow">
          ADMIN · PUSH INTERNAL · CONVERSION ORACLE
        </div>
        <h1 className="adm-page-title">Manual Trigger</h1>
        <p
          style={{
            fontSize: 14,
            fontFamily: "var(--font-body)",
            color: "var(--ink-5)",
            lineHeight: 1.6,
            maxWidth: 560,
            marginTop: 12,
            marginBottom: 0,
          }}
        >
          Re-run the 5-signal ConversionOracle against a specific transaction.
          Every run writes a fresh row to{" "}
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
            oracle_audit
          </code>
          .
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: 760,
        }}
      >
        {/* ── Trigger form ── */}
        <form onSubmit={run} style={cardStyle}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              fontWeight: 700,
              color: "var(--ink)",
              marginBottom: 16,
            }}
          >
            Transaction lookup
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                fontFamily: "var(--font-body)",
                color: "var(--ink-5)",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Transaction ID (UUID)
            </label>
            <input
              value={txId}
              onChange={(e) => setTxId(e.target.value)}
              placeholder="00000000-0000-0000-0000-000000000000"
              minLength={36}
              maxLength={36}
              required
              style={{
                width: "100%",
                height: 48,
                padding: "0 16px",
                border: "1px solid var(--hairline)",
                borderRadius: 8,
                background: "var(--surface)",
                color: "var(--ink)",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
                letterSpacing: "0.02em",
              }}
            />
          </div>

          <button
            type="submit"
            className="adm-row-btn adm-row-btn--view click-shift"
            disabled={state.kind === "running"}
            style={{ minWidth: 160, height: 40 }}
          >
            {state.kind === "running" ? "Running..." : "RUN ORACLE →"}
          </button>
        </form>

        {/* ── Result panel ── */}
        {state.kind === "ok" && (
          <div
            style={{
              ...cardStyle,
              border: "1px solid rgba(0,133,255,0.2)",
              background: "var(--accent-blue-tint)",
            }}
          >
            {/* Decision header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 24,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "var(--ink)",
                }}
              >
                DECISION:{" "}
                <span style={{ color: "var(--accent-blue)" }}>
                  {state.decision.toUpperCase()}
                </span>
              </div>
              <span
                style={{
                  display: "inline-block",
                  padding: "3px 10px",
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "var(--font-body)",
                  background: "rgba(0,133,255,0.12)",
                  color: "var(--accent-blue)",
                }}
              >
                {(state.confidence_score * 100).toFixed(1)}% confidence
              </span>
            </div>

            {/* Signal scores section */}
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                fontFamily: "var(--font-body)",
                color: "var(--ink-5)",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Signal Scores
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
                marginBottom: 20,
              }}
            >
              {Object.entries(state.signal_scores).map(([name, value]) => (
                <div
                  key={name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "8px 0",
                    borderBottom: "1px dashed var(--hairline)",
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      fontSize: 13,
                      fontFamily: "var(--font-body)",
                      color: "var(--ink)",
                      fontWeight: 500,
                    }}
                  >
                    {name}
                  </span>
                  {/* Score bar — token colors only */}
                  <div
                    style={{
                      width: 120,
                      height: 6,
                      background: "var(--surface-3)",
                      borderRadius: 3,
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: `${value * 100}%`,
                        height: "100%",
                        background: scoreBarColor(value),
                        borderRadius: 3,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: "var(--font-body)",
                      color: "var(--ink)",
                      width: 40,
                      textAlign: "right",
                      flexShrink: 0,
                    }}
                  >
                    {(value * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>

            {/* Reasoning block */}
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                fontFamily: "var(--font-body)",
                color: "var(--ink-5)",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Reasoning
            </div>
            <div
              style={{
                padding: "12px 16px",
                background: "var(--surface-3)",
                borderRadius: 6,
                border: "1px solid var(--hairline)",
                fontSize: 13,
                fontFamily: "var(--font-body)",
                color: "var(--ink-3)",
                lineHeight: 1.6,
              }}
            >
              {state.reasoning}
            </div>

            {/* Audit log link */}
            <div
              style={{
                marginTop: 16,
                paddingTop: 16,
                borderTop: "1px solid var(--hairline)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                fontFamily: "var(--font-body)",
                color: "var(--ink-5)",
              }}
            >
              <span>Result written to</span>
              <code
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  background: "var(--surface-3)",
                  padding: "2px 8px",
                  borderRadius: 4,
                  border: "1px solid var(--hairline)",
                  color: "var(--ink-3)",
                }}
              >
                oracle_audit
              </code>
              <span>·</span>
              <a
                href="/admin/audit-log"
                style={{
                  color: "var(--accent-blue)",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                View audit log →
              </a>
            </div>
          </div>
        )}

        {/* ── Error panel ── */}
        {state.kind === "err" && (
          <div
            style={{
              ...cardStyle,
              border: "1px solid rgba(193,18,31,0.2)",
              background: "var(--brand-red-tint)",
            }}
            role="alert"
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontWeight: 800,
                color: "var(--brand-red)",
                marginBottom: 8,
              }}
            >
              ERROR
            </div>
            <p
              style={{
                fontSize: 13,
                fontFamily: "var(--font-body)",
                color: "var(--ink)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {state.message}
            </p>
          </div>
        )}

        {/* ── Info card ── */}
        <div
          style={{
            ...cardStyle,
            background: "var(--surface-3)",
            border: "1px solid var(--hairline)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              fontFamily: "var(--font-body)",
              color: "var(--ink-5)",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Use Cases
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {[
              "Transaction landed in manual_review_required — rerun after a fraud ticket closes.",
              "Spot-check a specific row after a model change.",
              "Reproduce a disputed decision for a creator appeal.",
            ].map((text, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                  color: "var(--ink-3)",
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: "var(--ink-5)", flexShrink: 0 }}>
                  {i + 1}.
                </span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
