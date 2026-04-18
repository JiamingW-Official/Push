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

function SeverityBadge({ sev }: { sev: AuditSeverity }) {
  return <span className={`al-sev al-sev--${sev}`}>{sev}</span>;
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

function Row({
  entry,
  onOpen,
}: {
  entry: AuditEntry;
  onOpen: (e: AuditEntry) => void;
}) {
  return (
    <div
      className={`al-row ${entry.pinned ? "pinned" : ""}`}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(entry)}
      onKeyDown={(k) => k.key === "Enter" && onOpen(entry)}
      aria-label={`Open audit entry ${entry.id}`}
    >
      <div>
        <div className="al-row__time">{formatTime(entry.timestamp)}</div>
        <div className="al-row__ago">{timeAgo(entry.timestamp)} ago</div>
      </div>
      <SeverityBadge sev={entry.severity} />
      <div className="al-row__actor">
        <span className="al-row__initials">{entry.actor.initials}</span>
        <span className="al-row__actor-name">{entry.actor.name}</span>
      </div>
      <div className="al-row__desc">
        <span className="al-row__action">{entry.actionLabel}</span>{" "}
        <span className="al-row__target-type">{entry.target.type}</span>
        <span className="al-row__target">{entry.target.label}</span>
      </div>
      <div className="al-row__ip">{entry.ip}</div>
      <div className="al-row__pin">{entry.pinned ? "●" : ""}</div>
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

        <div className="al-drawer__body">
          {/* Meta */}
          <div className="al-section">
            <div className="al-section__head">Event</div>
            <div className="al-meta">
              <div className="al-meta__key">Event ID</div>
              <div className="al-meta__val al-meta__val--mono">{entry.id}</div>
              <div className="al-meta__key">Timestamp</div>
              <div className="al-meta__val">
                {new Date(entry.timestamp).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "long",
                })}
              </div>
              <div className="al-meta__key">Action</div>
              <div className="al-meta__val al-meta__val--mono">
                {entry.action}
              </div>
              <div className="al-meta__key">Target</div>
              <div className="al-meta__val">
                {entry.target.label}{" "}
                <span style={{ color: "var(--text-muted)", fontSize: 10 }}>
                  ({entry.target.type} · {entry.target.id})
                </span>
              </div>
            </div>
          </div>

          {/* Actor */}
          <div className="al-section">
            <div className="al-section__head">Actor</div>
            <div className="al-meta">
              <div className="al-meta__key">Name</div>
              <div className="al-meta__val">{entry.actor.name}</div>
              <div className="al-meta__key">Email</div>
              <div className="al-meta__val al-meta__val--mono">
                {entry.actor.email}
              </div>
              <div className="al-meta__key">Admin ID</div>
              <div className="al-meta__val al-meta__val--mono">
                {entry.actor.id}
              </div>
            </div>
          </div>

          {/* Diff */}
          {hasDiff && (
            <div className="al-section">
              <div className="al-section__head">State Change</div>
              <div className="al-diff">
                <div className="al-diff__col al-diff__col--before">
                  <div className="al-diff__label">Before</div>
                  {beforeKeys.length === 0 ? (
                    <div className="al-diff__kv">
                      <span className="al-diff__v" style={{ opacity: 0.5 }}>
                        —
                      </span>
                    </div>
                  ) : (
                    beforeKeys.map((k) => (
                      <div key={k} className="al-diff__kv">
                        <span className="al-diff__k">{k}</span>
                        <span className="al-diff__v">
                          {String(entry.before?.[k])}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <div className="al-diff__col al-diff__col--after">
                  <div className="al-diff__label">After</div>
                  {afterKeys.length === 0 ? (
                    <div className="al-diff__kv">
                      <span className="al-diff__v" style={{ opacity: 0.5 }}>
                        —
                      </span>
                    </div>
                  ) : (
                    afterKeys.map((k) => (
                      <div key={k} className="al-diff__kv">
                        <span className="al-diff__k">{k}</span>
                        <span className="al-diff__v">
                          {String(entry.after?.[k])}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Note */}
          {entry.notes && (
            <div className="al-section">
              <div className="al-section__head">Internal Note</div>
              <div className="al-note">{entry.notes}</div>
            </div>
          )}

          {/* Request */}
          <div className="al-section">
            <div className="al-section__head">Request</div>
            <div className="al-meta">
              <div className="al-meta__key">IP Address</div>
              <div className="al-meta__val al-meta__val--mono">{entry.ip}</div>
              <div className="al-meta__key">User Agent</div>
              <div className="al-meta__val">
                <span className="al-ua">{entry.userAgent}</span>
              </div>
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

  return (
    <>
      {/* Hero */}
      <div className="adm-hero">
        <div className="adm-hero__eyebrow">Compliance · Audit Trail</div>
        <div className="adm-hero__title">Admin audit log.</div>

        <div className="adm-hero__metrics">
          <div className="adm-hero__metric">
            <div className="adm-hero__metric-label">Total events</div>
            <div className="adm-hero__metric-val">
              {global?.total?.toLocaleString() ?? "—"}
            </div>
            <div className="adm-hero__metric-sub">Last 30 days</div>
          </div>
          <div className="adm-hero__metric">
            <div className="adm-hero__metric-label">Critical</div>
            <div className="adm-hero__metric-val adm-hero__metric-val--accent">
              {global?.critical ?? "—"}
            </div>
            <div className="adm-hero__metric-sub">Policy, payouts, roles</div>
          </div>
          <div className="adm-hero__metric">
            <div className="adm-hero__metric-label">Warning</div>
            <div className="adm-hero__metric-val">{global?.warning ?? "—"}</div>
            <div className="adm-hero__metric-sub">PII, rejections, flags</div>
          </div>
          <div className="adm-hero__metric">
            <div className="adm-hero__metric-label">Pinned</div>
            <div className="adm-hero__metric-val">{global?.pinned ?? "—"}</div>
            <div className="adm-hero__metric-sub">High-impact events</div>
          </div>
        </div>
      </div>

      {/* Pinned strip */}
      {data?.pinnedAlerts && (
        <PinnedStrip items={data.pinnedAlerts} onOpen={setSelected} />
      )}

      {/* Filters */}
      <div className="al-filters">
        <div className="al-filter-group">
          <span className="al-filter-label">Time</span>
          {PRESET_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`al-chip ${preset === opt.value ? "active" : ""}`}
              onClick={() => handlePreset(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="al-filter-sep" />

        <div className="al-filter-group">
          <span className="al-filter-label">Severity</span>
          {SEVERITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`al-chip ${
                severity === opt.value
                  ? `active${opt.value === "critical" ? " sev-critical" : opt.value === "warning" ? " sev-warning" : ""}`
                  : ""
              }`}
              onClick={() => handleSeverity(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="al-filter-sep" />

        <div className="al-filter-group">
          <span className="al-filter-label">Target</span>
          {TARGET_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`al-chip ${targetType === opt.value ? "active" : ""}`}
              onClick={() => handleTarget(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <input
          className="al-search"
          type="text"
          placeholder="Search action, target, actor, note…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <span className="al-count">
          {filtered?.total?.toLocaleString() ?? 0} match
          {filtered?.total === 1 ? "" : "es"}
        </span>
      </div>

      {/* Table */}
      <div className="al-table">
        <div className="al-table__head">
          <span>Time</span>
          <span>Severity</span>
          <span>Actor</span>
          <span>Event</span>
          <span>IP</span>
          <span></span>
        </div>

        {loading && !data ? (
          <>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="al-skeleton" />
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

      {/* Pagination */}
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

      {/* Detail drawer */}
      {selected && (
        <Drawer entry={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
