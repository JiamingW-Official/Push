"use client";

import { useEffect, useState } from "react";
import {
  MOCK_METRICS,
  MOCK_EVENTS,
  MOCK_ALERTS,
  type AdminMetrics,
  type LiveEvent,
  type AlertItem,
} from "@/lib/admin/mock-admin";

/* ── Helpers ─────────────────────────────────────────────────── */
function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/* ── Mini sparkline SVG ──────────────────────────────────────── */
function Sparkline({
  data,
  color,
  height = 40,
}: {
  data: number[];
  color: string;
  height?: number;
}) {
  const W = 280;
  const H = height;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = W / (data.length - 1);

  const points = data
    .map((v, i) => {
      const x = i * step;
      const y = H - ((v - min) / range) * (H - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const areaPoints = [
    `0,${H}`,
    ...data.map((v, i) => {
      const x = i * step;
      const y = H - ((v - min) / range) * (H - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }),
    `${W},${H}`,
  ].join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ height, width: "100%", display: "block" }}
    >
      <defs>
        <linearGradient
          id={`grad-${color.replace(/[^a-z0-9]/gi, "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints}
        fill={`url(#grad-${color.replace(/[^a-z0-9]/gi, "")})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {(() => {
        const last = data[data.length - 1];
        const x = (data.length - 1) * step;
        const y = H - ((last - min) / range) * (H - 6) - 3;
        return <circle cx={x} cy={y} r="3" fill={color} />;
      })()}
    </svg>
  );
}

/* ── Event type pill label ───────────────────────────────────── */
const EVENT_LABELS: Record<string, string> = {
  scan: "Scan",
  verify: "Verify",
  apply: "Apply",
  payment: "Payment",
  dispute: "Dispute",
  fraud_flag: "FRAUD",
  kyc_submit: "KYC",
};

function eventPillClass(type: string): string {
  const map: Record<string, string> = {
    scan: "adm-event-pill adm-event-pill--scan",
    verify: "adm-event-pill adm-event-pill--verify",
    apply: "adm-event-pill adm-event-pill--apply",
    payment: "adm-event-pill adm-event-pill--payment",
    dispute: "adm-event-pill adm-event-pill--dispute",
    fraud_flag: "adm-event-pill adm-event-pill--fraud_flag",
    kyc_submit: "adm-event-pill adm-event-pill--kyc_submit",
  };
  return map[type] ?? "adm-event-pill adm-event-pill--apply";
}

/* ── KPI Card ────────────────────────────────────────────────── */
function KpiCard({
  label,
  value,
  sub,
  alert = false,
}: {
  label: string;
  value: string;
  sub: string;
  alert?: boolean;
}) {
  return (
    <div className={`adm-kpi-card${alert ? " adm-kpi-card--alert" : ""}`}>
      <div className="adm-kpi-card__eyebrow">{label}</div>
      <div className="adm-kpi-card__value">{value}</div>
      <div className="adm-kpi-card__sub">{sub}</div>
    </div>
  );
}

/* ── Alert strip ─────────────────────────────────────────────── */
function AlertStrip({ alerts }: { alerts: AlertItem[] }) {
  const severityColor: Record<string, string> = {
    critical: "var(--brand-red)",
    high: "var(--brand-red)",
    medium: "var(--champagne)",
    low: "var(--ink-5)",
  };

  const severityBg: Record<string, string> = {
    critical: "rgba(193,18,31,0.06)",
    high: "rgba(193,18,31,0.06)",
    medium: "var(--panel-butter)",
    low: "var(--surface-2)",
  };

  const catColors: Record<string, { bg: string; color: string }> = {
    fraud: { bg: "var(--brand-red-tint)", color: "var(--brand-red)" },
    kyc: { bg: "var(--panel-butter)", color: "var(--ink-3)" },
    dispute: { bg: "var(--accent-blue-tint)", color: "var(--accent-blue)" },
  };

  return (
    <div
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--hairline)",
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid var(--hairline)",
        }}
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
          Action Required
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 700,
            background: "var(--brand-red)",
            color: "var(--snow)",
            borderRadius: 99,
            padding: "2px 8px",
          }}
        >
          {alerts.length}
        </span>
      </div>
      {alerts.map((a) => (
        <div
          key={a.id}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            padding: "12px 16px",
            borderBottom: "1px solid var(--hairline)",
            background: severityBg[a.severity] ?? "var(--surface-2)",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: severityColor[a.severity] ?? "var(--ink-5)",
              marginTop: 6,
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--ink)",
                marginBottom: 2,
              }}
            >
              {a.title}
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-5)",
              }}
            >
              {a.actor} · {timeAgo(a.created_at)}
            </div>
          </div>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              borderRadius: 4,
              padding: "2px 6px",
              flexShrink: 0,
              background: catColors[a.category]?.bg ?? "var(--surface-3)",
              color: catColors[a.category]?.color ?? "var(--ink-5)",
            }}
          >
            {a.category}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Mini charts panel ───────────────────────────────────────── */
function MiniCharts({ trend }: { trend: AdminMetrics["trend_7d"] }) {
  const charts = [
    {
      label: "7-Day Scans",
      data: trend.scans,
      color: "var(--accent-blue)",
    },
    {
      label: "7-Day Verifies",
      data: trend.verifies,
      color: "var(--ink-3)",
    },
    {
      label: "7-Day Conversions",
      data: trend.conversions,
      color: "var(--brand-red)",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {charts.map(({ label, data, color }) => (
        <div key={label} className="adm-chart-card">
          <div className="adm-chart-eyebrow">
            <span>{label}</span>
            <span>{data[data.length - 1]}</span>
          </div>
          <Sparkline data={data} color={color} />
        </div>
      ))}
    </div>
  );
}

/* ── Activity feed ───────────────────────────────────────────── */
function ActivityFeed({ events }: { events: LiveEvent[] }) {
  const cols = ["Time", "Type", "Actor", "Target", "Location", "Amount"];

  return (
    <div className="adm-feed-wrap">
      {/* Header */}
      <div className="adm-feed-header">
        <span className="adm-feed-title">Live Activity</span>
        <span className="adm-feed-meta">Last {events.length} events</span>
      </div>

      {/* Table head */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "64px 80px minmax(100px,1fr) minmax(100px,1fr) minmax(100px,1fr) 80px",
          padding: "8px 20px",
          borderBottom: "1px solid var(--hairline)",
          background: "var(--surface-3)",
        }}
      >
        {cols.map((c) => (
          <span
            key={c}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--ink-5)",
            }}
          >
            {c}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div style={{ maxHeight: 480, overflowY: "auto" }}>
        {events.map((evt) => (
          <div
            key={evt.id}
            style={{
              display: "grid",
              gridTemplateColumns:
                "64px 80px minmax(100px,1fr) minmax(100px,1fr) minmax(100px,1fr) 80px",
              padding: "10px 20px",
              borderBottom: "1px solid var(--hairline)",
              alignItems: "center",
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--surface-3)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-5)",
              }}
            >
              {formatTime(evt.timestamp)}
            </span>
            <span className={eventPillClass(evt.type)}>
              {EVENT_LABELS[evt.type] ?? evt.type}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--ink)",
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {evt.actor}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--ink-3)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {evt.target}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-5)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {evt.location}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 700,
                color:
                  evt.amount != null ? "var(--accent-blue)" : "var(--ink-5)",
                textAlign: "right",
              }}
            >
              {evt.amount != null ? `$${evt.amount}` : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Overview page ──────────────────────────────────────── */
export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState<AdminMetrics>(MOCK_METRICS);
  const [events, setEvents] = useState<LiveEvent[]>(MOCK_EVENTS);
  const [alerts, setAlerts] = useState<AlertItem[]>(MOCK_ALERTS);
  const [lastFetch, setLastFetch] = useState<Date>(new Date());

  useEffect(() => {
    async function refresh() {
      try {
        const res = await fetch("/api/admin/metrics");
        if (!res.ok) return;
        const data = await res.json();
        setMetrics(data.metrics);
        setEvents(data.events);
        setAlerts(data.alerts);
        setLastFetch(new Date());
      } catch {
        // Silently keep mock data if fetch fails
      }
    }
    refresh();
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, []);

  const totalAlerts =
    metrics.alerts.fraud_suspected +
    metrics.alerts.kyc_pending +
    metrics.alerts.disputes_open;

  return (
    <div style={{ fontFamily: "var(--font-body)", color: "var(--ink)" }}>
      {/* Critical alert bar */}
      {totalAlerts > 0 && (
        <div className="adm-alert-bar">
          <span className="adm-alert-bar__label">Attention</span>
          {metrics.alerts.fraud_suspected > 0 && (
            <span>
              {metrics.alerts.fraud_suspected} fraud events pending review
            </span>
          )}
          {metrics.alerts.kyc_pending > 0 && (
            <span>{metrics.alerts.kyc_pending} KYC submissions awaiting</span>
          )}
          {metrics.alerts.disputes_open > 0 && (
            <span>{metrics.alerts.disputes_open} open disputes</span>
          )}
        </div>
      )}

      {/* Page header */}
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">PUSH INTERNAL</div>
          <h1 className="adm-page-title">Ops Console</h1>
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--ink-5)",
            marginTop: 4,
            whiteSpace: "nowrap",
            alignSelf: "center",
          }}
        >
          Refreshed{" "}
          {lastFetch.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {/* 24h quick stats row */}
      <div className="adm-stats-bar" style={{ marginBottom: 32 }}>
        {[
          {
            label: "Scans · 24h",
            val: metrics.last24h.scans.toLocaleString(),
            accent: false,
          },
          {
            label: "Verifications · 24h",
            val: String(metrics.last24h.verifications),
            accent: false,
          },
          {
            label: "Applications · 24h",
            val: String(metrics.last24h.applications),
            accent: false,
          },
          {
            label: "GMV · 24h",
            val: formatCurrency(metrics.last24h.gmv),
            accent: true,
          },
        ].map(({ label, val, accent }) => (
          <div key={label} className="adm-stat-item">
            <div className="adm-stat-item__eyebrow">{label}</div>
            <div
              className="adm-stat-item__value"
              style={{ color: accent ? "var(--accent-blue)" : "var(--ink)" }}
            >
              {val}
            </div>
          </div>
        ))}
      </div>

      {/* KPI row */}
      <div className="adm-kpi-grid">
        <KpiCard
          label="Total GMV — This Month"
          value={formatCurrency(metrics.kpi.gmv_month)}
          sub="All settled payouts + attributed revenue"
        />
        <KpiCard
          label="Active Campaigns"
          value={String(metrics.kpi.active_campaigns)}
          sub="Across all merchants, live now"
        />
        <KpiCard
          label="New Users Today"
          value={String(metrics.kpi.new_users_today)}
          sub="Creators + merchants registered"
        />
        <KpiCard
          label="Pending Actions"
          value={String(totalAlerts)}
          sub={`${metrics.alerts.fraud_suspected} fraud · ${metrics.alerts.kyc_pending} KYC · ${metrics.alerts.disputes_open} disputes`}
          alert
        />
      </div>

      {/* Two-column: feed left, alerts+charts right */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 24,
          alignItems: "start",
        }}
      >
        <ActivityFeed events={events} />

        <div>
          <AlertStrip alerts={alerts} />
          <div className="adm-section-head" style={{ marginTop: 16 }}>
            7-Day Trends
          </div>
          <MiniCharts trend={metrics.trend_7d} />
        </div>
      </div>
    </div>
  );
}
