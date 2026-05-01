"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MOCK_AUDIT_LOG,
  getAuditSummary,
  type AuditEntry,
  type AuditSeverity,
  type TargetType,
} from "@/lib/admin/mock-audit";
import "./audit-log.css";

// ---------------------------------------------------------------------------
// Types & helpers
// ---------------------------------------------------------------------------

type Preset = "1h" | "24h" | "7d" | "30d" | "all";
type SeverityFilter = AuditSeverity | "all";
type TargetFilter = TargetType | "all";

interface AuditResponse {
  items: AuditEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    total: number;
    critical: number;
    warning: number;
    info: number;
  };
  globalSummary: ReturnType<typeof getAuditSummary>;
  pinnedAlerts: AuditEntry[];
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// Kept for potential future use; currently color logic lives in CSS classes.
function sevColor(sev: AuditSeverity): { bg: string; color: string } {
  switch (sev) {
    case "critical":
      return { bg: "rgba(193,18,31,0.1)", color: "var(--brand-red)" };
    case "warning":
      return { bg: "rgba(191,161,112,0.14)", color: "#8a6a2a" };
    case "info":
      return { bg: "rgba(0,133,255,0.08)", color: "var(--accent-blue)" };
  }
}

const PRESET_OPTIONS: Array<{ value: Preset; label: string }> = [
  { value: "1h", label: "1h" },
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "all", label: "All" },
];

const SEVERITY_OPTIONS: Array<{ value: SeverityFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "warning", label: "Warning" },
  { value: "info", label: "Info" },
];

const TARGET_OPTIONS: Array<{ value: TargetFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "creator", label: "Creator" },
  { value: "merchant", label: "Merchant" },
  { value: "campaign", label: "Campaign" },
  { value: "payout", label: "Payout" },
  { value: "policy", label: "Policy" },
  { value: "role", label: "Role" },
  { value: "report", label: "Report" },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** v11 severity badge — color coded via CSS: INFO/WARN/ERROR. */
function SeverityBadge({ sev }: { sev: AuditSeverity }) {
  const modClass =
    sev === "critical"
      ? "al-sev--critical"
      : sev === "warning"
        ? "al-sev--warning"
        : "al-sev--info";
  return <span className={`al-sev ${modClass}`}>{sev}</span>;
}

function PinnedStrip({
  items,
  onOpen,
}: {
  items: AuditEntry[];
  onOpen: (e: AuditEntry) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="al-pinned">
      <div className="al-pinned__header">
        <div className="al-pinned__label">Pinned Alerts</div>
        <div className="al-pinned__count">
          {items.length} high-impact event{items.length !== 1 ? "s" : ""}
        </div>
      </div>
      <div className="al-pinned__list">
        {items.slice(0, 6).map((e) => (
          <div
            key={e.id}
            className="al-pinned__item"
            role="button"
            tabIndex={0}
            onClick={() => onOpen(e)}
            onKeyDown={(k) => k.key === "Enter" && onOpen(e)}
          >
            <SeverityBadge sev={e.severity} />
            <div className="al-pinned__text">
              <strong>{e.actor.name}</strong> {e.actionLabel}{" "}
              <strong>{e.target.label}</strong>
              {e.notes ? ` — ${e.notes}` : ""}
            </div>
            <div className="al-pinned__time">{timeAgo(e.timestamp)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Log entry row — mono 12px, alternating surface via CSS nth-child. */
function Row({
  entry,
  onOpen,
}: {
  entry: AuditEntry;
  onOpen: (e: AuditEntry) => void;
}) {
  return (
    <div
      className={`al-row${entry.pinned ? " al-row--pinned" : ""}`}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(entry)}
      onKeyDown={(k) => k.key === "Enter" && onOpen(entry)}
      aria-label={`Open audit entry ${entry.id}`}
    >
      {/* Timestamp column — mono, ink-3, nowrap */}
      <div>
        <div className="al-row__time-main">{formatTime(entry.timestamp)}</div>
        <div className="al-row__time-ago">{timeAgo(entry.timestamp)} ago</div>
      </div>

      {/* Severity badge */}
      <SeverityBadge sev={entry.severity} />

      {/* Actor column — 600 weight ink per v11 spec */}
      <div className="al-row__actor">
        <span className="al-row__initials">{entry.actor.initials}</span>
        <span className="al-row__actor-name">{entry.actor.name}</span>
      </div>

      {/* Event description */}
      <div>
        <span className="al-row__action">{entry.actionLabel}</span>{" "}
        <span className="al-row__target-type">{entry.target.type}</span>{" "}
        <span className="al-row__target-label">{entry.target.label}</span>
      </div>

      {/* IP column — mono */}
      <div className="al-row__ip">{entry.ip}</div>

      {/* Pin indicator */}
      <div
        className="al-row__pin"
        style={{ color: entry.pinned ? "var(--brand-red)" : "transparent" }}
      >
        ●
      </div>
    </div>
  );
}

function Drawer({
  entry,
  onClose,
}: {
  entry: AuditEntry;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const beforeKeys = entry.before ? Object.keys(entry.before) : [];
  const afterKeys = entry.after ? Object.keys(entry.after) : [];
  const hasDiff = beforeKeys.length > 0 || afterKeys.length > 0;

  return (
    <>
      <div className="al-overlay" onClick={onClose} />
      <aside
        className="al-drawer"
        role="dialog"
        aria-label="Audit entry detail"
      >
        {/* Header */}
        <div className="al-drawer__header">
          <div className="al-drawer__title">
            {entry.actor.name} {entry.actionLabel} {entry.target.label}
          </div>
          <SeverityBadge sev={entry.severity} />
          <button
            className="al-drawer__close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="al-drawer__body">
          {/* Event meta */}
          <div>
            <div className="al-section__head">Event</div>
            <div>
              {[
                { key: "Event ID", val: entry.id, mono: true },
                {
                  key: "Timestamp",
                  val: new Date(entry.timestamp).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "long",
                  }),
                  mono: false,
                },
                { key: "Action", val: entry.action, mono: true },
                {
                  key: "Target",
                  val: `${entry.target.label} (${entry.target.type} · ${entry.target.id})`,
                  mono: false,
                },
              ].map(({ key, val, mono }) => (
                <div key={key} className="al-meta-row">
                  <span className="al-meta-row__key">{key}</span>
                  <span
                    className={`al-meta-row__val${mono ? " al-meta-row__val--mono" : ""}`}
                  >
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actor */}
          <div>
            <div className="al-section__head">Actor</div>
            <div>
              {[
                { key: "Name", val: entry.actor.name, mono: false },
                { key: "Email", val: entry.actor.email, mono: true },
                { key: "Admin ID", val: entry.actor.id, mono: true },
              ].map(({ key, val, mono }) => (
                <div key={key} className="al-meta-row">
                  <span className="al-meta-row__key">{key}</span>
                  <span
                    className={`al-meta-row__val${mono ? " al-meta-row__val--mono" : ""}`}
                  >
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* State diff */}
          {hasDiff && (
            <div>
              <div className="al-section__head">State Change</div>
              <div className="al-diff">
                {(
                  [
                    { label: "Before", keys: beforeKeys, data: entry.before },
                    { label: "After", keys: afterKeys, data: entry.after },
                  ] as const
                ).map(({ label, keys, data }) => (
                  <div
                    key={label}
                    className={`al-diff__col al-diff__col--${label.toLowerCase()}`}
                  >
                    <div className="al-diff__label">{label}</div>
                    {keys.length === 0 ? (
                      <span style={{ fontSize: 12, color: "var(--ink-4)" }}>
                        —
                      </span>
                    ) : (
                      keys.map((k) => (
                        <div key={k} className="al-diff__kv">
                          <span className="al-diff__k">{k}</span>
                          <span className="al-diff__v">
                            {String((data as Record<string, unknown>)?.[k])}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Note */}
          {entry.notes && (
            <div>
              <div className="al-section__head">Internal Note</div>
              <div className="al-note-box">{entry.notes}</div>
            </div>
          )}

          {/* Request */}
          <div>
            <div className="al-section__head">Request</div>
            <div>
              {[
                { key: "IP Address", val: entry.ip, mono: true },
                { key: "User Agent", val: entry.userAgent, mono: false },
              ].map(({ key, val, mono }) => (
                <div key={key} className="al-meta-row">
                  <span className="al-meta-row__key">{key}</span>
                  <span
                    className={`al-meta-row__val${mono ? " al-meta-row__val--mono" : ""}`}
                    style={{ wordBreak: "break-word" }}
                  >
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AuditLogPage() {
  const [data, setData] = useState<AuditResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [preset, setPreset] = useState<Preset>("24h");
  const [severity, setSeverity] = useState<SeverityFilter>("all");
  const [targetType, setTargetType] = useState<TargetFilter>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AuditEntry | null>(null);

  // Load via API, fall back to local mock filter
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (preset !== "all") params.set("preset", preset);
        if (severity !== "all") params.set("severity", severity);
        if (targetType !== "all") params.set("targetType", targetType);
        if (search.trim()) params.set("search", search.trim());
        params.set("page", String(page));
        params.set("limit", "50");

        const res = await fetch(`/api/admin/audit-log?${params}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as AuditResponse;
        if (!cancelled) setData(json);
      } catch {
        // Fallback: filter in memory
        if (cancelled) return;
        const now = Date.now();
        const windows: Record<Preset, number | null> = {
          "1h": 1 * 60 * 60 * 1000,
          "24h": 24 * 60 * 60 * 1000,
          "7d": 7 * 24 * 60 * 60 * 1000,
          "30d": 30 * 24 * 60 * 60 * 1000,
          all: null,
        };
        const win = windows[preset];
        const q = search.trim().toLowerCase();
        const filtered = MOCK_AUDIT_LOG.filter((e) => {
          if (win !== null && now - new Date(e.timestamp).getTime() > win)
            return false;
          if (severity !== "all" && e.severity !== severity) return false;
          if (targetType !== "all" && e.target.type !== targetType)
            return false;
          if (q) {
            const hay =
              `${e.actionLabel} ${e.target.label} ${e.actor.name} ${e.notes ?? ""}`.toLowerCase();
            if (!hay.includes(q)) return false;
          }
          return true;
        });
        const limit = 50;
        const total = filtered.length;
        const items = filtered.slice((page - 1) * limit, page * limit);
        setData({
          items,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.max(1, Math.ceil(total / limit)),
          },
          summary: {
            total,
            critical: filtered.filter((e) => e.severity === "critical").length,
            warning: filtered.filter((e) => e.severity === "warning").length,
            info: filtered.filter((e) => e.severity === "info").length,
          },
          globalSummary: getAuditSummary(),
          pinnedAlerts: MOCK_AUDIT_LOG.filter((e) => e.pinned).slice(0, 10),
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [preset, severity, targetType, search, page]);

  const resetToPage1 = useCallback(() => setPage(1), []);

  function handlePreset(p: Preset) {
    setPreset(p);
    resetToPage1();
  }

  function handleSeverity(s: SeverityFilter) {
    setSeverity(s);
    resetToPage1();
  }

  function handleTarget(t: TargetFilter) {
    setTargetType(t);
    resetToPage1();
  }

  function handleSearch(v: string) {
    setSearch(v);
    resetToPage1();
  }

  const global = data?.globalSummary;
  const filtered = data?.summary;
  const pagination = data?.pagination;

  /** Builds className string for filter chip buttons. */
  function chipClass(
    active: boolean,
    variant?: "critical" | "warning",
  ): string {
    let cls = "al-chip";
    if (active) {
      cls += " active";
      if (variant === "critical") cls += " sev-critical";
      if (variant === "warning") cls += " sev-warning";
    }
    return cls;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface)",
        paddingBottom: 64,
      }}
    >
      {/* ── Page header ── */}
      <div className="al-header">
        {/* v11 product eyebrow: parenthetical mono */}
        <div className="al-eyebrow">(AUDIT·LOG)</div>
        <h1 className="al-title">Admin audit log</h1>

        {/* KPI stat chips — 3 small chips at top of page */}
        <div className="al-kpi-strip">
          {[
            {
              label: "Total events",
              value: global?.total?.toLocaleString() ?? "—",
              sub: "Last 30 days",
              mod: "",
            },
            {
              label: "Critical",
              value: global?.critical ?? "—",
              sub: "Policy, payouts, roles",
              mod: "al-kpi-chip__value--error",
            },
            {
              label: "Warning",
              value: global?.warning ?? "—",
              sub: "PII, rejections, flags",
              mod: "al-kpi-chip__value--warn",
            },
            {
              label: "Pinned",
              value: global?.pinned ?? "—",
              sub: "High-impact events",
              mod: "",
            },
          ].map(({ label, value, sub, mod }) => (
            <div key={label} className="al-kpi-chip">
              <div className="al-kpi-chip__label">{label}</div>
              <div className={`al-kpi-chip__value${mod ? ` ${mod}` : ""}`}>
                {value}
              </div>
              <div className="al-kpi-chip__sub">{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pinned strip ── */}
      {data?.pinnedAlerts && (
        <PinnedStrip items={data.pinnedAlerts} onOpen={setSelected} />
      )}

      {/* ── Filter / export bar ── */}
      <div className="al-filters">
        <span className="al-filter-label">Time</span>
        {PRESET_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={chipClass(preset === opt.value)}
            onClick={() => handlePreset(opt.value)}
          >
            {opt.label}
          </button>
        ))}

        <div className="al-filter-sep" />

        <span className="al-filter-label">Severity</span>
        {SEVERITY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={chipClass(
              severity === opt.value,
              opt.value === "critical"
                ? "critical"
                : opt.value === "warning"
                  ? "warning"
                  : undefined,
            )}
            onClick={() => handleSeverity(opt.value)}
          >
            {opt.label}
          </button>
        ))}

        <div className="al-filter-sep" />

        <span className="al-filter-label">Target</span>
        {TARGET_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={chipClass(targetType === opt.value)}
            onClick={() => handleTarget(opt.value)}
          >
            {opt.label}
          </button>
        ))}

        {/* Search — 8px radius per v11 spec */}
        <input
          className="al-search"
          type="text"
          placeholder="Search action, target, actor, note…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* Export button — btn-secondary (N2W blue) */}
        <button
          className="al-export-btn"
          onClick={() => {
            // Export stub — wire to real endpoint when available
            alert("Export triggered");
          }}
        >
          Export CSV
        </button>

        <span className="al-count">
          {filtered?.total?.toLocaleString() ?? 0} match
          {filtered?.total === 1 ? "" : "es"}
        </span>
      </div>

      {/* ── Log table ── */}
      <div className="al-table">
        {/* Column headers */}
        <div className="al-table-head">
          {["Time", "Severity", "Actor", "Event", "IP", ""].map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>

        {loading && !data ? (
          /* Skeleton loader */
          <>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="al-skeleton"
                style={{ opacity: 1 - i * 0.08 }}
              />
            ))}
          </>
        ) : !data || data.items.length === 0 ? (
          <div className="al-empty">
            <div className="al-empty__title">No events match.</div>
            <div className="al-empty__body">
              Try widening the time range or clearing filters.
            </div>
          </div>
        ) : (
          data.items.map((entry) => (
            <Row key={entry.id} entry={entry} onOpen={setSelected} />
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {pagination && pagination.totalPages > 1 && (
        <div className="al-pagination">
          <div className="al-pagination__info">
            Page {pagination.page} of {pagination.totalPages} ·{" "}
            {pagination.total.toLocaleString()} total
          </div>
          <div className="al-pagination__controls">
            <button
              className="al-page-btn"
              disabled={pagination.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <button
              className="al-page-btn"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ── Detail drawer ── */}
      {selected && (
        <Drawer entry={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
