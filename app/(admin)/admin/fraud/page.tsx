"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import "./fraud.css";
import {
  MOCK_FRAUD_EVENTS,
  ACTIVE_RULES,
  type FraudEvent,
  type FraudStatus,
  type DetectionRule,
  type ActiveRule,
} from "@/lib/admin/mock-fraud";

/* ── Helpers ─────────────────────────────────────────────────── */
function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function maskIp(ip: string) {
  const parts = ip.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.***.***`;
  return ip;
}

function scoreColor(score: number): string {
  if (score >= 70) return "var(--brand-red)";
  if (score >= 55) return "var(--champagne-deep)";
  return "var(--ink-5)";
}

/* ── Mock helpers ────────────────────────────────────────────── */
function buildLog(event: FraudEvent) {
  const base = new Date(event.detectedAt).getTime();
  return [
    {
      t: new Date(base - 120000).toISOString(),
      msg: `QR ${event.qrId} scanned at ${event.loc.label}`,
    },
    {
      t: new Date(base - 90000).toISOString(),
      msg: `Device fingerprint captured: ${event.device}`,
    },
    {
      t: new Date(base - 60000).toISOString(),
      msg: `IP resolved: ${event.ip} — geo check initiated`,
    },
    {
      t: new Date(base - 30000).toISOString(),
      msg: `Rules engine triggered: ${event.rules.join(" / ")}`,
    },
    {
      t: new Date(base).toISOString(),
      msg: `Event flagged as suspicious (score ${event.riskScore})`,
    },
  ];
}

function buildHistory(event: FraudEvent) {
  return [
    { date: "Apr 12", label: "Scan — Joe Coffee Soho", score: 22 },
    { date: "Apr 10", label: `Scan — ${event.merchantName}`, score: 41 },
    { date: "Apr 8", label: "Scan — Prince Street Pizza", score: 67 },
    {
      date: "Apr 6",
      label: `Scan — ${event.merchantName}`,
      score: event.riskScore,
    },
  ];
}

function getRelated(event: FraudEvent, all: FraudEvent[]) {
  return all
    .filter(
      (e) =>
        e.id !== event.id &&
        (e.creatorId === event.creatorId || e.ip === event.ip),
    )
    .slice(0, 4);
}

/* ── Sub-components ──────────────────────────────────────────── */
function ruleChipClass(rule: DetectionRule): string {
  if (rule === "Impossible velocity" || rule === "High frequency scan")
    return "fraud-chip fraud-chip--velocity";
  if (
    rule === "Duplicate device" ||
    rule === "New device spike" ||
    rule === "Blacklisted device" ||
    rule === "Self-scan pattern"
  )
    return "fraud-chip fraud-chip--device";
  if (rule === "Geo mismatch" || rule === "Spoofed GPS")
    return "fraud-chip fraud-chip--geo";
  if (rule === "VPN detected") return "fraud-chip fraud-chip--vpn";
  return "fraud-chip fraud-chip--default";
}

function RuleChips({ rules }: { rules: DetectionRule[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
      {rules.map((r) => (
        <span key={r} className={ruleChipClass(r)}>
          {r}
        </span>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: FraudStatus }) {
  const labels: Record<FraudStatus, string> = {
    pending: "Pending",
    approved: "Approved",
    flagged: "Flagged",
    blocked: "Blocked",
    escalated: "Escalated",
  };
  return (
    <span className={`fraud-status fraud-status--${status}`}>
      {labels[status]}
    </span>
  );
}

function DetailPanel({
  event,
  all,
  onClose,
}: {
  event: FraudEvent;
  all: FraudEvent[];
  onClose: () => void;
}) {
  const log = buildLog(event);
  const history = buildHistory(event);
  const related = getRelated(event, all);

  const sectionEyebrow: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--ink-5)",
    marginBottom: 10,
  };

  return (
    <div
      style={{
        padding: "24px",
        background: "var(--surface-3)",
        borderTop: "1px solid var(--hairline)",
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 24,
        }}
      >
        {/* Event log */}
        <div>
          <p style={sectionEyebrow}>Event Log</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {log.map((entry, i) => (
              <div
                key={i}
                style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 10,
                    color: "var(--ink-5)",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {formatDate(entry.t)}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink)",
                    lineHeight: 1.5,
                  }}
                >
                  {entry.msg}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Creator history */}
        <div>
          <p style={sectionEyebrow}>Creator History — {event.creatorHandle}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {history.map((row, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 0",
                  borderBottom: "1px solid var(--hairline)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: "var(--ink-5)",
                    width: 36,
                    flexShrink: 0,
                  }}
                >
                  {row.date}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink)",
                    flex: 1,
                  }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    fontWeight: 700,
                    color: scoreColor(row.score),
                  }}
                >
                  {row.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Map stub */}
        <div>
          <p style={sectionEyebrow}>Scan vs. Merchant Location</p>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 100,
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
              borderRadius: 8,
              overflow: "hidden",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "38%",
                top: "55%",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "var(--accent-blue)",
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 0 3px var(--accent-blue-tint)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "62%",
                top: "40%",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "var(--brand-red)",
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 0 3px var(--brand-red-tint)",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              fontSize: 11,
              fontFamily: "var(--font-body)",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: "var(--ink-3)",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--accent-blue)",
                  display: "inline-block",
                }}
              />
              Scan: {event.loc.label}
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: "var(--ink-3)",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--brand-red)",
                  display: "inline-block",
                }}
              />
              Merchant: {event.expectedLoc.label}
            </span>
          </div>
        </div>

        {/* Related events */}
        <div>
          <p style={sectionEyebrow}>Related Flagged Events</p>
          {related.length === 0 ? (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-5)",
              }}
            >
              No related events found.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {related.map((rel) => (
                <div
                  key={rel.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    background: "var(--surface-2)",
                    border: "1px solid var(--hairline)",
                    borderRadius: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 18,
                      fontWeight: 800,
                      color: scoreColor(rel.riskScore),
                      lineHeight: 1,
                      width: 32,
                      flexShrink: 0,
                    }}
                  >
                    {rel.riskScore}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--ink)",
                      }}
                    >
                      {rel.id}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 10,
                        color: "var(--ink-5)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {rel.rules[0]}
                    </div>
                  </div>
                  <StatusBadge status={rel.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RulesEnginePanel({ rules }: { rules: ActiveRule[] }) {
  const [open, setOpen] = useState(true);

  return (
    <div
      style={{
        margin: "0 40px 40px",
        background: "var(--surface-2)",
        border: "1px solid var(--hairline)",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 24px",
          cursor: "pointer",
          borderBottom: open ? "1px solid var(--hairline)" : "none",
        }}
        onClick={() => setOpen((o) => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--ink-5)",
            flex: 1,
          }}
        >
          Rules Engine
        </span>
        <span
          style={{
            padding: "2px 8px",
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "var(--font-body)",
            background: "var(--accent-blue-tint)",
            color: "var(--accent-blue)",
          }}
        >
          {rules.length} active
        </span>
        <span
          style={{
            fontSize: 14,
            color: "var(--ink-5)",
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 0.2s",
            lineHeight: 1,
          }}
        >
          ▾
        </span>
      </div>
      {open && (
        <div style={{ padding: "0 24px 24px" }}>
          {rules.map((rule) => (
            <div
              key={rule.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "14px 0",
                borderBottom: "1px solid var(--hairline)",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--accent-blue)",
                  marginTop: 5,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: 13,
                    color: "var(--ink)",
                    marginBottom: 2,
                  }}
                >
                  {rule.name}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink-5)",
                    marginBottom: 4,
                  }}
                >
                  {rule.description}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: "var(--ink-3)",
                    fontWeight: 600,
                  }}
                >
                  {rule.threshold}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 20,
                    fontWeight: 800,
                    color: "var(--ink)",
                    lineHeight: 1,
                  }}
                >
                  {rule.triggeredCount.toLocaleString()}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 10,
                    color: "var(--ink-5)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginTop: 2,
                  }}
                >
                  triggers
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
const PAGE_SIZE = 20;
const ALL_RULES_OPTIONS: DetectionRule[] = [
  "Impossible velocity",
  "Duplicate device",
  "Geo mismatch",
  "VPN detected",
  "Repeated IP",
  "Spoofed GPS",
  "New device spike",
  "High frequency scan",
  "Self-scan pattern",
  "Blacklisted device",
];

export default function FraudQueuePage() {
  const [minRisk, setMinRisk] = useState(0);
  const [maxRisk, setMaxRisk] = useState(100);
  const [filterStatus, setFilterStatus] = useState<FraudStatus | "all">("all");
  const [filterRule, setFilterRule] = useState<DetectionRule | "">("");
  const [filterWindow, setFilterWindow] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [events, setEvents] = useState<FraudEvent[]>(() =>
    JSON.parse(JSON.stringify(MOCK_FRAUD_EVENTS)),
  );
  const [deciding, setDeciding] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (filterStatus !== "all" && e.status !== filterStatus) return false;
      if (e.riskScore < minRisk || e.riskScore > maxRisk) return false;
      if (filterRule && !e.rules.includes(filterRule)) return false;
      if (filterWindow > 0) {
        const cutoff = new Date(Date.now() - filterWindow * 60 * 60 * 1000);
        if (new Date(e.detectedAt) < cutoff) return false;
      }
      return true;
    });
  }, [events, filterStatus, minRisk, maxRisk, filterRule, filterWindow]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageEvents = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pendingCount = events.filter((e) => e.status === "pending").length;
  const flaggedCount = events.filter((e) => e.status === "flagged").length;
  const blockedCount = events.filter((e) => e.status === "blocked").length;

  useEffect(() => {
    setPage(1);
  }, [filterStatus, minRisk, maxRisk, filterRule, filterWindow]);

  const handleDecision = useCallback(
    async (id: string, decision: FraudStatus, isBulk = false) => {
      setDeciding(id);
      try {
        const targetIds = isBulk ? Array.from(selected) : [id];
        const res = await fetch(
          isBulk
            ? `/api/admin/fraud/bulk/decision`
            : `/api/admin/fraud/${id}/decision`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
              isBulk ? { decision, bulk: targetIds } : { decision },
            ),
          },
        );
        if (!res.ok) throw new Error("Decision failed");
        setEvents((prev) =>
          prev.map((e) =>
            targetIds.includes(e.id) ? { ...e, status: decision } : e,
          ),
        );
        if (isBulk) setSelected(new Set());
      } catch {
        setEvents((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: decision } : e)),
        );
      } finally {
        setDeciding(null);
      }
    },
    [selected],
  );

  const handleBulkDecision = useCallback(
    async (decision: FraudStatus) => {
      setDeciding("bulk");
      const ids = Array.from(selected);
      setEvents((prev) =>
        prev.map((e) => (ids.includes(e.id) ? { ...e, status: decision } : e)),
      );
      setSelected(new Set());
      setDeciding(null);
    },
    [selected],
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === pageEvents.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(pageEvents.map((e) => e.id)));
    }
  };

  const clearFilters = () => {
    setMinRisk(0);
    setMaxRisk(100);
    setFilterStatus("all");
    setFilterRule("");
    setFilterWindow(0);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const selectStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: 13,
    color: "var(--ink)",
    background: "var(--surface-2)",
    border: "1px solid var(--hairline)",
    borderRadius: 8,
    padding: "8px 12px",
    outline: "none",
    height: 40,
  };

  const numInputStyle: React.CSSProperties = {
    width: 56,
    fontFamily: "var(--font-body)",
    fontSize: 13,
    color: "var(--ink)",
    background: "var(--surface-2)",
    border: "1px solid var(--hairline)",
    borderRadius: 8,
    padding: "8px 10px",
    outline: "none",
    textAlign: "center",
    height: 40,
  };

  // Returns CSS class string for action buttons — v11 5-variant system
  function actionBtnClass(
    variant: "approve" | "flag" | "block" | "escalate",
  ): string {
    return `fraud-action-btn fraud-action-btn--${variant}`;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface)",
        paddingBottom: 64,
      }}
    >
      {/* Page header */}
      <div style={{ padding: "40px 40px 0" }}>
        <div className="adm-page-eyebrow">PUSH INTERNAL</div>
        <h1 className="adm-page-title" style={{ marginBottom: 32 }}>
          Fraud Queue
        </h1>

        {/* KPI row */}
        <div className="adm-kpi-grid" style={{ marginBottom: 0 }}>
          {[
            {
              label: "Pending Review",
              value: pendingCount,
              alert: pendingCount > 0,
            },
            { label: "Flagged", value: flaggedCount, alert: false },
            { label: "Blocked", value: blockedCount, alert: false },
            { label: "Total Events", value: events.length, alert: false },
          ].map(({ label, value, alert }) => (
            <div
              key={label}
              className={`adm-kpi-card${alert ? " adm-kpi-card--alert" : ""}`}
            >
              <div className="adm-kpi-card__eyebrow">{label}</div>
              <div className="adm-kpi-card__value">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter rail */}
      <div
        style={{
          padding: "12px 40px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 12,
          background: "var(--surface-2)",
          borderTop: "1px solid var(--hairline)",
          borderBottom: "1px solid var(--hairline)",
          margin: "32px 0 0",
        }}
        role="search"
        aria-label="Filter fraud events"
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--ink-5)",
          }}
        >
          Risk
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="number"
            style={numInputStyle}
            min={0}
            max={100}
            value={minRisk}
            onChange={(e) => setMinRisk(Number(e.target.value))}
            aria-label="Minimum risk score"
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--ink-5)",
            }}
          >
            –
          </span>
          <input
            type="number"
            style={numInputStyle}
            min={0}
            max={100}
            value={maxRisk}
            onChange={(e) => setMaxRisk(Number(e.target.value))}
            aria-label="Maximum risk score"
          />
        </div>

        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--ink-5)",
          }}
        >
          Status
        </span>
        <select
          style={selectStyle}
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as FraudStatus | "all")
          }
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="flagged">Flagged</option>
          <option value="blocked">Blocked</option>
          <option value="approved">Approved</option>
          <option value="escalated">Escalated</option>
        </select>

        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--ink-5)",
          }}
        >
          Rule
        </span>
        <select
          style={{ ...selectStyle, minWidth: 180 }}
          value={filterRule}
          onChange={(e) => setFilterRule(e.target.value as DetectionRule | "")}
          aria-label="Filter by detection rule"
        >
          <option value="">All Rules</option>
          {ALL_RULES_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--ink-5)",
          }}
        >
          Window
        </span>
        <select
          style={selectStyle}
          value={filterWindow}
          onChange={(e) => setFilterWindow(Number(e.target.value))}
          aria-label="Time window"
        >
          <option value={0}>All Time</option>
          <option value={1}>Last 1h</option>
          <option value={6}>Last 6h</option>
          <option value={24}>Last 24h</option>
          <option value={72}>Last 3 days</option>
          <option value={168}>Last 7 days</option>
        </select>

        <button className="btn-ghost click-shift" onClick={clearFilters}>
          Clear
        </button>

        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--ink-5)",
          }}
        >
          {filtered.length} events
        </span>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div
          className="adm-bulk-bar"
          style={{ margin: "0 40px", borderRadius: 0 }}
          role="toolbar"
          aria-label="Bulk actions"
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            {selected.size}
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            events selected
          </span>
          <div style={{ display: "flex", gap: 8, marginLeft: 8 }}>
            {(
              [
                { label: "Approve all", decision: "approved" as FraudStatus },
                { label: "Flag all", decision: "flagged" as FraudStatus },
                { label: "Block all", decision: "blocked" as FraudStatus },
                { label: "Escalate all", decision: "escalated" as FraudStatus },
              ] as const
            ).map(({ label, decision }) => (
              <button
                key={label}
                className="adm-bulk-btn"
                onClick={() => handleBulkDecision(decision)}
                disabled={deciding === "bulk"}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Queue table */}
      <section style={{ padding: "0 40px 40px" }}>
        {/* Column headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "36px 200px 64px 160px 1fr 140px 220px",
            gap: 12,
            padding: "10px 16px",
            borderBottom: "2px solid var(--hairline)",
            marginTop: 8,
          }}
          aria-hidden="true"
        >
          <div>
            <input
              type="checkbox"
              style={{ width: 16, height: 16 }}
              checked={
                selected.size === pageEvents.length && pageEvents.length > 0
              }
              onChange={toggleSelectAll}
              aria-label="Select all visible events"
            />
          </div>
          {[
            "Event",
            "Risk",
            "Creator / Merchant",
            "Rules Triggered",
            "IP / Device",
            "Actions",
          ].map((h) => (
            <div
              key={h}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--ink-5)",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "56px 0", textAlign: "center" }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: 8,
              }}
            >
              No events match your filters.
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--ink-5)",
              }}
            >
              Try adjusting the risk range or status filter.
            </p>
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }} role="list">
            {pageEvents.map((event) => {
              const isExpanded = expandedId === event.id;
              const isSelected = selected.has(event.id);

              return (
                <li key={event.id}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "36px 200px 64px 160px 1fr 140px 220px",
                      gap: 12,
                      padding: "12px 16px",
                      borderBottom: "1px solid var(--hairline)",
                      background: isSelected
                        ? "var(--accent-blue-tint)"
                        : isExpanded
                          ? "var(--surface-3)"
                          : "transparent",
                      alignItems: "start",
                      transition: "background 0.1s",
                    }}
                    role="row"
                    aria-expanded={isExpanded}
                  >
                    {/* Checkbox */}
                    <div
                      style={{ paddingTop: 2 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(event.id)}
                        aria-label={`Select event ${event.id}`}
                        style={{ width: 16, height: 16 }}
                      />
                    </div>

                    {/* Event ID */}
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleExpand(event.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" && toggleExpand(event.id)
                      }
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "var(--ink)",
                          marginBottom: 2,
                        }}
                      >
                        {event.id}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          color: "var(--ink-5)",
                          marginBottom: 4,
                        }}
                      >
                        {event.qrId}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 10,
                          color: "var(--ink-5)",
                          marginBottom: 4,
                        }}
                      >
                        {formatDate(event.detectedAt)}
                      </div>
                      <StatusBadge status={event.status} />
                    </div>

                    {/* Risk score */}
                    <div
                      style={{ cursor: "pointer", paddingTop: 2 }}
                      onClick={() => toggleExpand(event.id)}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 28,
                          fontWeight: 800,
                          color: scoreColor(event.riskScore),
                          lineHeight: 1,
                        }}
                      >
                        {event.riskScore}
                      </span>
                    </div>

                    {/* Creator / Merchant */}
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleExpand(event.id)}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "var(--ink)",
                          marginBottom: 2,
                        }}
                      >
                        {event.creatorHandle}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 12,
                          color: "var(--ink-5)",
                          marginBottom: 4,
                        }}
                      >
                        {event.merchantName}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 10,
                          color: "var(--accent-blue)",
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                        }}
                      >
                        {event.creatorTier}
                      </div>
                    </div>

                    {/* Rules */}
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleExpand(event.id)}
                    >
                      <RuleChips rules={event.rules} />
                    </div>

                    {/* IP / Device */}
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleExpand(event.id)}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          color: "var(--ink)",
                          marginBottom: 2,
                          fontWeight: 600,
                        }}
                      >
                        {maskIp(event.ip)}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          color: "var(--ink-5)",
                        }}
                      >
                        {event.device}
                      </div>
                    </div>

                    {/* Actions */}
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: 4 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className={actionBtnClass("approve")}
                        onClick={() => handleDecision(event.id, "approved")}
                        disabled={
                          deciding === event.id || event.status === "approved"
                        }
                        title="Approve this scan event"
                      >
                        Approve
                      </button>
                      <button
                        className={actionBtnClass("flag")}
                        onClick={() => handleDecision(event.id, "flagged")}
                        disabled={
                          deciding === event.id || event.status === "flagged"
                        }
                        title="Flag for further review"
                      >
                        Flag
                      </button>
                      <button
                        className={actionBtnClass("block")}
                        onClick={() => handleDecision(event.id, "blocked")}
                        disabled={
                          deciding === event.id || event.status === "blocked"
                        }
                        title="Block this event permanently"
                      >
                        Block
                      </button>
                      <button
                        className={actionBtnClass("escalate")}
                        onClick={() => handleDecision(event.id, "escalated")}
                        disabled={
                          deciding === event.id || event.status === "escalated"
                        }
                        title="Escalate to senior review"
                      >
                        Escalate
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <DetailPanel
                      event={event}
                      all={events}
                      onClose={() => setExpandedId(null)}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="adm-pagination"
            style={{ marginTop: 24 }}
            aria-label="Queue pagination"
          >
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-5)",
              }}
            >
              {filtered.length} events · page {page} of {totalPages}
            </div>
            <div className="adm-pagination__controls">
              <button
                className="adm-page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Prev
              </button>
              {Array.from(
                { length: Math.min(5, totalPages) },
                (_, i) => i + 1,
              ).map((pageNum) => (
                <button
                  key={pageNum}
                  className={`adm-page-btn${page === pageNum ? " active" : ""}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}
              {totalPages > 5 && (
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink-5)",
                    padding: "0 4px",
                  }}
                >
                  … {totalPages}
                </span>
              )}
              <button
                className="adm-page-btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </section>

      <RulesEnginePanel rules={ACTIVE_RULES} />
    </div>
  );
}
