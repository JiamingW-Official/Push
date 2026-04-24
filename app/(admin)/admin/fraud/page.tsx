"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./fraud.css";
import {
  MOCK_FRAUD_EVENTS,
  ACTIVE_RULES,
  type FraudEvent,
  type FraudStatus,
  type DetectionRule,
  type ActiveRule,
} from "@/lib/admin/mock-fraud";

// ─── helpers ────────────────────────────────────────────────────────────────

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
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.***.***`;
  }
  return ip;
}

function chipClass(rule: DetectionRule): string {
  if (rule === "Impossible velocity" || rule === "High frequency scan")
    return "fraud-chip--velocity";
  if (
    rule === "Duplicate device" ||
    rule === "New device spike" ||
    rule === "Blacklisted device" ||
    rule === "Self-scan pattern"
  )
    return "fraud-chip--device";
  if (rule === "Geo mismatch" || rule === "Spoofed GPS")
    return "fraud-chip--geo";
  if (rule === "VPN detected") return "fraud-chip--vpn";
  return "fraud-chip--default";
}

function scoreClass(score: number) {
  if (score >= 70) return "fraud-score fraud-score--high";
  if (score >= 55) return "fraud-score fraud-score--medium";
  return "fraud-score";
}

function relatedScoreClass(score: number) {
  return score >= 70
    ? "fraud-related__score fraud-related__score--high"
    : "fraud-related__score";
}

// Deterministic mock log entries for an event
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

// Mock creator/merchant history rows
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

// Get related events (same creator or same IP, excluding self)
function getRelated(event: FraudEvent, all: FraudEvent[]) {
  return all
    .filter(
      (e) =>
        e.id !== event.id &&
        (e.creatorId === event.creatorId || e.ip === event.ip),
    )
    .slice(0, 4);
}

// ─── sub-components ─────────────────────────────────────────────────────────

function RuleChips({ rules }: { rules: DetectionRule[] }) {
  return (
    <div className="fraud-rules">
      {rules.map((r) => (
        <span key={r} className={`fraud-chip ${chipClass(r)}`}>
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

  // Simple map: place pins proportionally inside box based on lat/lng offset
  const scanPinX = 38;
  const scanPinY = 55;
  const expectedPinX = 62;
  const expectedPinY = 40;

  return (
    <div className="fraud-detail">
      <div className="fraud-detail__grid">
        {/* Event log */}
        <div>
          <p className="fraud-detail__section-title">Event log</p>
          <ul className="fraud-log">
            {log.map((entry, i) => (
              <li key={i} className="fraud-log__entry">
                <span className="fraud-log__time">{formatDate(entry.t)}</span>
                <span className="fraud-log__msg">{entry.msg}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Creator / merchant history */}
        <div>
          <p className="fraud-detail__section-title">
            Creator history — {event.creatorHandle}
          </p>
          <div className="fraud-history">
            {history.map((row, i) => (
              <div key={i} className="fraud-history__row">
                <span className="fraud-history__date">{row.date}</span>
                <span className="fraud-history__label">{row.label}</span>
                <span
                  className={`fraud-history__score ${row.score >= 70 ? "fraud-score--high" : ""}`}
                >
                  {row.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div>
          <p className="fraud-detail__section-title">
            Scan vs. merchant location
          </p>
          <div className="fraud-map">
            <div
              className="fraud-map__pin fraud-map__pin--scan"
              style={{ left: `${scanPinX}%`, top: `${scanPinY}%` }}
            />
            <div
              className="fraud-map__pin fraud-map__pin--expected"
              style={{ left: `${expectedPinX}%`, top: `${expectedPinY}%` }}
            />
            <div className="fraud-map__legend">
              <span className="fraud-map__legend-item">
                <span
                  className="fraud-map__legend-dot"
                  style={{ background: "var(--primary)" }}
                />
                Scan: {event.loc.label}
              </span>
              <span className="fraud-map__legend-item">
                <span
                  className="fraud-map__legend-dot"
                  style={{ background: "var(--tertiary)" }}
                />
                Merchant: {event.expectedLoc.label}
              </span>
            </div>
          </div>
        </div>

        {/* Related flagged events */}
        <div>
          <p className="fraud-detail__section-title">Related flagged events</p>
          {related.length === 0 ? (
            <p style={{ fontSize: 12, color: "var(--graphite)" }}>
              No related events found.
            </p>
          ) : (
            <div className="fraud-related">
              {related.map((rel) => (
                <div key={rel.id} className="fraud-related__item">
                  <span className={relatedScoreClass(rel.riskScore)}>
                    {rel.riskScore}
                  </span>
                  <div className="fraud-related__meta">
                    <div className="fraud-related__id">{rel.id}</div>
                    <div className="fraud-related__rule">{rel.rules[0]}</div>
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
    <div className="fraud-rules-panel">
      <div
        className="fraud-rules-panel__header"
        onClick={() => setOpen((o) => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="fraud-rules-panel__title">Rules engine</span>
        <span className="fraud-rules-panel__count">{rules.length} active</span>
        <span
          className={`fraud-rules-panel__toggle ${open ? "fraud-rules-panel__toggle--open" : ""}`}
        >
          ▾
        </span>
      </div>
      {open && (
        <div className="fraud-rules-panel__body">
          {rules.map((rule) => (
            <div key={rule.id} className="fraud-rule-row">
              <div className="fraud-rule-indicator" title="Active" />
              <div className="fraud-rule-content">
                <div className="fraud-rule-name">{rule.name}</div>
                <div className="fraud-rule-desc">{rule.description}</div>
                <div className="fraud-rule-meta">
                  <span className="fraud-rule-threshold">{rule.threshold}</span>
                </div>
              </div>
              <div
                style={{
                  textAlign: "right",
                  flexShrink: 0,
                  marginLeft: "var(--space-2)",
                }}
              >
                <span className="fraud-rule-triggered">
                  {rule.triggeredCount.toLocaleString()}
                </span>
                <span className="fraud-rule-triggered__label">triggers</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

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
  // Filters
  const [minRisk, setMinRisk] = useState(0);
  const [maxRisk, setMaxRisk] = useState(100);
  const [filterStatus, setFilterStatus] = useState<FraudStatus | "all">("all");
  const [filterRule, setFilterRule] = useState<DetectionRule | "">("");
  const [filterWindow, setFilterWindow] = useState<number>(0);

  // Pagination
  const [page, setPage] = useState(1);

  // Selection
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Expanded detail row
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Local events (mutated by decisions)
  const [events, setEvents] = useState<FraudEvent[]>(() =>
    JSON.parse(JSON.stringify(MOCK_FRAUD_EVENTS)),
  );

  // Decision loading state
  const [deciding, setDeciding] = useState<string | null>(null);

  // Filtered + paginated
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

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filterStatus, minRisk, maxRisk, filterRule, filterWindow]);

  // Decision handler
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
        // In mock context, update locally even if fetch fails
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

  return (
    <div className="fraud-page">
      {/* ── Hero ── */}
      <section className="fraud-hero">
        <p className="fraud-hero__eyebrow">Admin / Anti-fraud</p>
        <h1 className="fraud-hero__title">
          Fraud <em>queue.</em>
        </h1>
        <div className="fraud-hero__stats">
          <div className="fraud-hero__stat">
            <span className="fraud-hero__stat-value fraud-hero__stat-value--red">
              {pendingCount}
            </span>
            <span className="fraud-hero__stat-label">Pending review</span>
          </div>
          <div className="fraud-hero__stat">
            <span className="fraud-hero__stat-value fraud-hero__stat-value--amber">
              {flaggedCount}
            </span>
            <span className="fraud-hero__stat-label">Flagged</span>
          </div>
          <div className="fraud-hero__stat">
            <span className="fraud-hero__stat-value">{blockedCount}</span>
            <span className="fraud-hero__stat-label">Blocked</span>
          </div>
          <div className="fraud-hero__stat">
            <span className="fraud-hero__stat-value">{events.length}</span>
            <span className="fraud-hero__stat-label">Total events</span>
          </div>
        </div>
      </section>

      {/* ── Filter rail ── */}
      <div
        className="fraud-filters"
        role="search"
        aria-label="Filter fraud events"
      >
        <span className="fraud-filters__label">Risk</span>
        <div className="fraud-filters__group">
          <input
            type="number"
            className="fraud-filters__input"
            style={{ width: 56 }}
            min={0}
            max={100}
            value={minRisk}
            onChange={(e) => setMinRisk(Number(e.target.value))}
            aria-label="Minimum risk score"
          />
          <span className="fraud-filters__range-sep">–</span>
          <input
            type="number"
            className="fraud-filters__input"
            style={{ width: 56 }}
            min={0}
            max={100}
            value={maxRisk}
            onChange={(e) => setMaxRisk(Number(e.target.value))}
            aria-label="Maximum risk score"
          />
        </div>

        <span className="fraud-filters__label">Status</span>
        <select
          className="fraud-filters__select"
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as FraudStatus | "all")
          }
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="flagged">Flagged</option>
          <option value="blocked">Blocked</option>
          <option value="approved">Approved</option>
          <option value="escalated">Escalated</option>
        </select>

        <span className="fraud-filters__label">Rule</span>
        <select
          className="fraud-filters__select fraud-filters__select--wide"
          value={filterRule}
          onChange={(e) => setFilterRule(e.target.value as DetectionRule | "")}
          aria-label="Filter by detection rule"
        >
          <option value="">All rules</option>
          {ALL_RULES_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <span className="fraud-filters__label">Window</span>
        <select
          className="fraud-filters__select"
          value={filterWindow}
          onChange={(e) => setFilterWindow(Number(e.target.value))}
          aria-label="Time window"
        >
          <option value={0}>All time</option>
          <option value={1}>Last 1h</option>
          <option value={6}>Last 6h</option>
          <option value={24}>Last 24h</option>
          <option value={72}>Last 3 days</option>
          <option value={168}>Last 7 days</option>
        </select>

        <button className="fraud-filters__clear" onClick={clearFilters}>
          Clear
        </button>
      </div>

      {/* ── Bulk action bar ── */}
      {selected.size > 0 && (
        <div
          className="fraud-bulk-bar"
          role="toolbar"
          aria-label="Bulk actions"
        >
          <span className="fraud-bulk-bar__count">{selected.size}</span>
          <span>events selected</span>
          <div className="fraud-bulk-bar__actions">
            <button
              className="fraud-bulk-btn fraud-bulk-btn--approve"
              onClick={() => handleBulkDecision("approved")}
              disabled={deciding === "bulk"}
            >
              Approve all
            </button>
            <button
              className="fraud-bulk-btn"
              onClick={() => handleBulkDecision("flagged")}
              disabled={deciding === "bulk"}
            >
              Flag all
            </button>
            <button
              className="fraud-bulk-btn fraud-bulk-btn--block"
              onClick={() => handleBulkDecision("blocked")}
              disabled={deciding === "bulk"}
            >
              Block all
            </button>
            <button
              className="fraud-bulk-btn"
              onClick={() => handleBulkDecision("escalated")}
              disabled={deciding === "bulk"}
            >
              Escalate all
            </button>
          </div>
        </div>
      )}

      {/* ── Queue list ── */}
      <section className="fraud-queue">
        {/* Column headers */}
        <div className="fraud-queue__header" aria-hidden="true">
          <div>
            <input
              type="checkbox"
              style={{ width: 16, height: 16, borderRadius: "var(--r-sm)" }}
              checked={
                selected.size === pageEvents.length && pageEvents.length > 0
              }
              onChange={toggleSelectAll}
              aria-label="Select all visible events"
            />
          </div>
          <div>Event</div>
          <div>Risk</div>
          <div className="fraud-col--creator">Creator / Merchant</div>
          <div>Rules triggered</div>
          <div className="fraud-col--device">IP / Device</div>
          <div>Actions</div>
        </div>

        {filtered.length === 0 ? (
          <div className="fraud-empty">
            <p className="fraud-empty__title">No events match your filters.</p>
            <p className="fraud-empty__sub">
              Try adjusting the risk range or status filter.
            </p>
          </div>
        ) : (
          <ul className="fraud-queue__list" role="list">
            {pageEvents.map((event) => {
              const isExpanded = expandedId === event.id;
              const isSelected = selected.has(event.id);

              return (
                <li key={event.id}>
                  <div
                    className={`fraud-row ${isSelected ? "fraud-row--selected" : ""} ${isExpanded ? "fraud-row--expanded" : ""}`}
                    role="row"
                    aria-expanded={isExpanded}
                  >
                    {/* Checkbox */}
                    <div
                      className="fraud-row__checkbox"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(event.id)}
                        aria-label={`Select event ${event.id}`}
                      />
                    </div>

                    {/* Event ID — click to expand */}
                    <div
                      className="fraud-row__cell"
                      onClick={() => toggleExpand(event.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" && toggleExpand(event.id)
                      }
                    >
                      <div className="fraud-row__id">{event.id}</div>
                      <div className="fraud-row__qr">{event.qrId}</div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--graphite)",
                          marginTop: 2,
                        }}
                      >
                        {formatDate(event.detectedAt)}
                      </div>
                      <div style={{ marginTop: 4 }}>
                        <StatusBadge status={event.status} />
                      </div>
                    </div>

                    {/* Risk score */}
                    <div
                      className="fraud-row__cell"
                      onClick={() => toggleExpand(event.id)}
                    >
                      <span className={scoreClass(event.riskScore)}>
                        {event.riskScore}
                      </span>
                    </div>

                    {/* Creator / Merchant */}
                    <div
                      className="fraud-row__cell fraud-col--creator"
                      onClick={() => toggleExpand(event.id)}
                    >
                      <div className="fraud-row__creator">
                        {event.creatorHandle}
                      </div>
                      <div className="fraud-row__merchant">
                        {event.merchantName}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "var(--tertiary)",
                          marginTop: 2,
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
                      className="fraud-row__cell"
                      onClick={() => toggleExpand(event.id)}
                    >
                      <RuleChips rules={event.rules} />
                    </div>

                    {/* IP / Device */}
                    <div
                      className="fraud-row__cell fraud-col--device"
                      onClick={() => toggleExpand(event.id)}
                    >
                      <div className="fraud-row__ip">{maskIp(event.ip)}</div>
                      <div className="fraud-row__device">{event.device}</div>
                    </div>

                    {/* Actions */}
                    <div
                      className="fraud-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="fraud-action-btn fraud-action-btn--approve"
                        onClick={() => handleDecision(event.id, "approved")}
                        disabled={
                          deciding === event.id || event.status === "approved"
                        }
                        title="Approve this scan event"
                      >
                        Approve
                      </button>
                      <button
                        className="fraud-action-btn fraud-action-btn--flag"
                        onClick={() => handleDecision(event.id, "flagged")}
                        disabled={
                          deciding === event.id || event.status === "flagged"
                        }
                        title="Flag for further review"
                      >
                        Flag
                      </button>
                      <button
                        className="fraud-action-btn fraud-action-btn--block"
                        onClick={() => handleDecision(event.id, "blocked")}
                        disabled={
                          deciding === event.id || event.status === "blocked"
                        }
                        title="Block this event permanently"
                      >
                        Block
                      </button>
                      <button
                        className="fraud-action-btn fraud-action-btn--escalate"
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

                  {/* Detail slide-out */}
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
          <nav className="fraud-pagination" aria-label="Queue pagination">
            <button
              className="fraud-page-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Prev
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  className={`fraud-page-btn ${page === pageNum ? "fraud-page-btn--active" : ""}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && (
              <span className="fraud-page-info">… {totalPages} pages</span>
            )}
            <button
              className="fraud-page-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next →
            </button>
            <span className="fraud-page-info">{filtered.length} events</span>
          </nav>
        )}
      </section>

      {/* ── Rules engine panel ── */}
      <RulesEnginePanel rules={ACTIVE_RULES} />
    </div>
  );
}
