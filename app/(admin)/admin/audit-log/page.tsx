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

function SeverityBadge({ sev }: { sev: AuditSeverity }) {
  const c = sevColor(sev);
  return (
    <span
      style={{
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.05em",
        fontFamily: "var(--font-body)",
        background: c.bg,
        color: c.color,
        textTransform: "capitalize",
        whiteSpace: "nowrap",
      }}
    >
      {sev}
    </span>
  );
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
    <div
      style={{
        margin: "0 40px 24px",
        background: "rgba(193,18,31,0.03)",
        border: "1px solid rgba(193,18,31,0.15)",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 20px",
          borderBottom: "1px solid rgba(193,18,31,0.1)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.07em",
            fontFamily: "var(--font-body)",
            color: "var(--brand-red)",
            textTransform: "uppercase",
          }}
        >
          Pinned Alerts
        </div>
        <div
          style={{
            fontSize: 12,
            fontFamily: "var(--font-body)",
            color: "var(--ink-4)",
          }}
        >
          {items.length} high-impact event{items.length !== 1 ? "s" : ""}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.slice(0, 6).map((e) => (
          <div
            key={e.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 20px",
              borderBottom: "1px solid rgba(193,18,31,0.06)",
              cursor: "pointer",
            }}
            role="button"
            tabIndex={0}
            onClick={() => onOpen(e)}
            onKeyDown={(k) => k.key === "Enter" && onOpen(e)}
          >
            <SeverityBadge sev={e.severity} />
            <div
              style={{
                flex: 1,
                fontSize: 13,
                fontFamily: "var(--font-body)",
                color: "var(--ink)",
              }}
            >
              <strong>{e.actor.name}</strong> {e.actionLabel}{" "}
              <strong>{e.target.label}</strong>
              {e.notes ? ` — ${e.notes}` : ""}
            </div>
            <div
              style={{
                fontSize: 11,
                fontFamily: "var(--font-body)",
                color: "var(--ink-4)",
                whiteSpace: "nowrap",
              }}
            >
              {timeAgo(e.timestamp)}
            </div>
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
      style={{
        display: "grid",
        gridTemplateColumns: "120px 80px 160px 1fr 100px 20px",
        gap: 12,
        alignItems: "center",
        padding: "10px 24px",
        borderBottom: "1px solid var(--hairline)",
        background: entry.pinned ? "rgba(193,18,31,0.02)" : "transparent",
        cursor: "pointer",
        transition: "background 0.1s",
      }}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(entry)}
      onKeyDown={(k) => k.key === "Enter" && onOpen(entry)}
      aria-label={`Open audit entry ${entry.id}`}
    >
      <div>
        <div
          style={{
            fontSize: 12,
            fontFamily: "var(--font-body)",
            color: "var(--ink)",
            fontWeight: 500,
          }}
        >
          {formatTime(entry.timestamp)}
        </div>
        <div
          style={{
            fontSize: 10,
            fontFamily: "var(--font-body)",
            color: "var(--ink-4)",
          }}
        >
          {timeAgo(entry.timestamp)} ago
        </div>
      </div>
      <SeverityBadge sev={entry.severity} />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "var(--surface-3)",
            border: "1px solid var(--hairline)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 700,
            fontFamily: "var(--font-body)",
            color: "var(--ink-3)",
            flexShrink: 0,
          }}
        >
          {entry.actor.initials}
        </span>
        <span
          style={{
            fontSize: 12,
            fontFamily: "var(--font-body)",
            color: "var(--ink)",
            fontWeight: 500,
          }}
        >
          {entry.actor.name}
        </span>
      </div>
      <div>
        <span
          style={{
            fontSize: 13,
            fontFamily: "var(--font-body)",
            color: "var(--ink)",
            fontWeight: 600,
          }}
        >
          {entry.actionLabel}
        </span>{" "}
        <span
          style={{
            fontSize: 11,
            fontFamily: "var(--font-body)",
            color: "var(--ink-4)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {entry.target.type}
        </span>{" "}
        <span
          style={{
            fontSize: 13,
            fontFamily: "var(--font-body)",
            color: "var(--ink-3)",
          }}
        >
          {entry.target.label}
        </span>
      </div>
      <div
        style={{
          fontSize: 11,
          fontFamily: "var(--font-body)",
          color: "var(--ink-4)",
        }}
      >
        {entry.ip}
      </div>
      <div
        style={{
          fontSize: 14,
          color: entry.pinned ? "var(--brand-red)" : "transparent",
        }}
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

  const sectionHead: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.07em",
    fontFamily: "var(--font-body)",
    color: "var(--ink-4)",
    textTransform: "uppercase",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: "1px solid var(--hairline)",
  };

  const metaRow: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "100px 1fr",
    gap: 8,
    padding: "6px 0",
    borderBottom: "1px solid var(--hairline)",
    fontSize: 13,
    fontFamily: "var(--font-body)",
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          zIndex: 100,
        }}
        onClick={onClose}
      />
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "min(480px, 95vw)",
          height: "100vh",
          background: "var(--surface-2)",
          borderLeft: "1px solid var(--hairline)",
          boxShadow: "var(--shadow-3)",
          zIndex: 101,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        role="dialog"
        aria-label="Audit entry detail"
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--hairline)",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 15,
                fontWeight: 700,
                color: "var(--ink)",
                lineHeight: 1.4,
              }}
            >
              {entry.actor.name} {entry.actionLabel} {entry.target.label}
            </div>
          </div>
          <SeverityBadge sev={entry.severity} />
          <button
            style={{
              width: 32,
              height: 32,
              border: "1px solid var(--hairline)",
              borderRadius: 6,
              background: "var(--surface-3)",
              cursor: "pointer",
              fontSize: 14,
              color: "var(--ink-4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Event meta */}
          <div>
            <div style={sectionHead}>Event</div>
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
                <div key={key} style={metaRow}>
                  <span style={{ color: "var(--ink-4)", fontSize: 12 }}>
                    {key}
                  </span>
                  <span
                    style={{
                      color: "var(--ink)",
                      fontFamily: mono ? "var(--font-body)" : undefined,
                      fontSize: mono ? 12 : 13,
                      wordBreak: "break-all",
                    }}
                  >
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actor */}
          <div>
            <div style={sectionHead}>Actor</div>
            <div>
              {[
                { key: "Name", val: entry.actor.name, mono: false },
                { key: "Email", val: entry.actor.email, mono: true },
                { key: "Admin ID", val: entry.actor.id, mono: true },
              ].map(({ key, val, mono }) => (
                <div key={key} style={metaRow}>
                  <span style={{ color: "var(--ink-4)", fontSize: 12 }}>
                    {key}
                  </span>
                  <span
                    style={{
                      color: "var(--ink)",
                      fontFamily: mono ? "var(--font-body)" : undefined,
                      fontSize: mono ? 12 : 13,
                    }}
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
              <div style={sectionHead}>State Change</div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {(
                  [
                    { label: "Before", keys: beforeKeys, data: entry.before },
                    { label: "After", keys: afterKeys, data: entry.after },
                  ] as const
                ).map(({ label, keys, data }) => (
                  <div
                    key={label}
                    style={{
                      padding: "12px",
                      background:
                        label === "Before"
                          ? "rgba(193,18,31,0.03)"
                          : "rgba(0,133,255,0.03)",
                      border: `1px solid ${label === "Before" ? "rgba(193,18,31,0.1)" : "rgba(0,133,255,0.1)"}`,
                      borderRadius: 6,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.07em",
                        fontFamily: "var(--font-body)",
                        color:
                          label === "Before"
                            ? "var(--brand-red)"
                            : "var(--accent-blue)",
                        textTransform: "uppercase",
                        marginBottom: 8,
                      }}
                    >
                      {label}
                    </div>
                    {keys.length === 0 ? (
                      <span
                        style={{
                          fontSize: 12,
                          fontFamily: "var(--font-body)",
                          color: "var(--ink-4)",
                        }}
                      >
                        —
                      </span>
                    ) : (
                      keys.map((k) => (
                        <div
                          key={k}
                          style={{
                            display: "flex",
                            gap: 8,
                            marginBottom: 4,
                            fontSize: 12,
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          <span
                            style={{ color: "var(--ink-4)", flexShrink: 0 }}
                          >
                            {k}
                          </span>
                          <span
                            style={{ color: "var(--ink)", fontWeight: 600 }}
                          >
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
              <div style={sectionHead}>Internal Note</div>
              <div
                style={{
                  padding: "12px 14px",
                  background: "var(--surface-3)",
                  borderRadius: 6,
                  border: "1px solid var(--hairline)",
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                  color: "var(--ink)",
                  lineHeight: 1.6,
                }}
              >
                {entry.notes}
              </div>
            </div>
          )}

          {/* Request */}
          <div>
            <div style={sectionHead}>Request</div>
            <div>
              {[
                { key: "IP Address", val: entry.ip, mono: true },
                { key: "User Agent", val: entry.userAgent, mono: false },
              ].map(({ key, val, mono }) => (
                <div key={key} style={metaRow}>
                  <span style={{ color: "var(--ink-4)", fontSize: 12 }}>
                    {key}
                  </span>
                  <span
                    style={{
                      color: "var(--ink)",
                      fontFamily: mono ? "var(--font-body)" : undefined,
                      fontSize: mono ? 12 : 13,
                      wordBreak: "break-word",
                    }}
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

  const chipStyle = (
    active: boolean,
    variant?: "critical" | "warning",
  ): React.CSSProperties => ({
    padding: "5px 12px",
    border: "1px solid var(--hairline)",
    borderRadius: 6,
    background: active
      ? variant === "critical"
        ? "rgba(193,18,31,0.1)"
        : variant === "warning"
          ? "rgba(191,161,112,0.14)"
          : "var(--ink)"
      : "var(--surface-3)",
    color: active
      ? variant === "critical"
        ? "var(--brand-red)"
        : variant === "warning"
          ? "#8a6a2a"
          : "var(--snow)"
      : "var(--ink-3)",
    fontFamily: "var(--font-body)",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
  });

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
          ADMIN · PUSH INTERNAL · COMPLIANCE · AUDIT TRAIL
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px,4vw,56px)",
            fontWeight: 800,
            color: "var(--ink)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            marginBottom: 32,
          }}
        >
          Admin audit log
        </h1>

        {/* KPI strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {[
            {
              label: "Total events",
              value: global?.total?.toLocaleString() ?? "—",
              sub: "Last 30 days",
              accent: false,
            },
            {
              label: "Critical",
              value: global?.critical ?? "—",
              sub: "Policy, payouts, roles",
              accent: true,
            },
            {
              label: "Warning",
              value: global?.warning ?? "—",
              sub: "PII, rejections, flags",
              accent: false,
            },
            {
              label: "Pinned",
              value: global?.pinned ?? "—",
              sub: "High-impact events",
              accent: false,
            },
          ].map(({ label, value, sub, accent }) => (
            <div
              key={label}
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--hairline)",
                borderRadius: 10,
                padding: "20px 24px",
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
                  marginBottom: 8,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(22px,2.5vw,36px)",
                  fontWeight: 800,
                  color: accent ? "var(--brand-red)" : "var(--ink)",
                  lineHeight: 1,
                  marginBottom: 4,
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

      {/* Pinned strip */}
      {data?.pinnedAlerts && (
        <PinnedStrip items={data.pinnedAlerts} onOpen={setSelected} />
      )}

      {/* Filters */}
      <div
        style={{
          padding: "12px 40px",
          background: "var(--surface-2)",
          borderTop: "1px solid var(--hairline)",
          borderBottom: "1px solid var(--hairline)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 8,
          marginBottom: 0,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            fontFamily: "var(--font-body)",
            color: "var(--ink-4)",
            textTransform: "uppercase",
            marginRight: 4,
          }}
        >
          Time
        </span>
        {PRESET_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            style={chipStyle(preset === opt.value)}
            onClick={() => handlePreset(opt.value)}
          >
            {opt.label}
          </button>
        ))}

        <div
          style={{
            width: 1,
            height: 20,
            background: "var(--hairline)",
            margin: "0 8px",
          }}
        />

        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            fontFamily: "var(--font-body)",
            color: "var(--ink-4)",
            textTransform: "uppercase",
            marginRight: 4,
          }}
        >
          Severity
        </span>
        {SEVERITY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            style={chipStyle(
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

        <div
          style={{
            width: 1,
            height: 20,
            background: "var(--hairline)",
            margin: "0 8px",
          }}
        />

        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            fontFamily: "var(--font-body)",
            color: "var(--ink-4)",
            textTransform: "uppercase",
            marginRight: 4,
          }}
        >
          Target
        </span>
        {TARGET_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            style={chipStyle(targetType === opt.value)}
            onClick={() => handleTarget(opt.value)}
          >
            {opt.label}
          </button>
        ))}

        <input
          style={{
            marginLeft: 8,
            padding: "6px 12px",
            border: "1px solid var(--hairline)",
            borderRadius: 6,
            background: "var(--surface)",
            color: "var(--ink)",
            fontFamily: "var(--font-body)",
            fontSize: 13,
            outline: "none",
            minWidth: 220,
          }}
          type="text"
          placeholder="Search action, target, actor, note…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <span
          style={{
            marginLeft: "auto",
            fontSize: 12,
            fontFamily: "var(--font-body)",
            color: "var(--ink-4)",
          }}
        >
          {filtered?.total?.toLocaleString() ?? 0} match
          {filtered?.total === 1 ? "" : "es"}
        </span>
      </div>

      {/* Table */}
      <div style={{ padding: "0 40px" }}>
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "120px 80px 160px 1fr 100px 20px",
            gap: 12,
            padding: "10px 24px",
            borderBottom: "2px solid var(--hairline)",
            marginTop: 8,
          }}
        >
          {["Time", "Severity", "Actor", "Event", "IP", ""].map((h) => (
            <span
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
            </span>
          ))}
        </div>

        {loading && !data ? (
          <>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                style={{
                  height: 52,
                  background: "var(--surface-3)",
                  borderRadius: 4,
                  margin: "4px 0",
                  opacity: 1 - i * 0.08,
                }}
              />
            ))}
          </>
        ) : !data || data.items.length === 0 ? (
          <div
            style={{
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 18,
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: 8,
              }}
            >
              No events match.
            </div>
            <div
              style={{
                fontSize: 13,
                fontFamily: "var(--font-body)",
                color: "var(--ink-4)",
              }}
            >
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
        <div
          style={{
            padding: "16px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid var(--hairline)",
            marginTop: 16,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontFamily: "var(--font-body)",
              color: "var(--ink-4)",
            }}
          >
            Page {pagination.page} of {pagination.totalPages} ·{" "}
            {pagination.total.toLocaleString()} total
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={{
                padding: "6px 16px",
                border: "1px solid var(--hairline)",
                borderRadius: 6,
                background: "var(--surface)",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                cursor: pagination.page <= 1 ? "not-allowed" : "pointer",
                opacity: pagination.page <= 1 ? 0.4 : 1,
              }}
              disabled={pagination.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <button
              style={{
                padding: "6px 16px",
                border: "1px solid var(--hairline)",
                borderRadius: 6,
                background: "var(--surface)",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                cursor:
                  pagination.page >= pagination.totalPages
                    ? "not-allowed"
                    : "pointer",
                opacity: pagination.page >= pagination.totalPages ? 0.4 : 1,
              }}
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
    </div>
  );
}
