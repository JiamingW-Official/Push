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
const ALERT_TARGETS: Record<string, string> = {
  fraud: "/admin/fraud",
  kyc: "/admin/verifications",
  dispute: "/admin/disputes",
};

function AlertStrip({ alerts }: { alerts: AlertItem[] }) {
  const severityClass: Record<string, string> = {
    critical: "adm-od-alert-row--crit",
    high: "adm-od-alert-row--crit",
    medium: "adm-od-alert-row--warn",
    low: "adm-od-alert-row--low",
  };

  const catClass: Record<string, string> = {
    fraud: "adm-od-alert-tag--red",
    kyc: "adm-od-alert-tag--butter",
    dispute: "adm-od-alert-tag--blue",
  };

  return (
    <div className="adm-od-alert">
      <div className="adm-od-alert__head">
        <span className="adm-page-eyebrow" style={{ marginBottom: 0 }}>
          Action Required
        </span>
        <span
          className="adm-od-alert__count"
          aria-label={`${alerts.length} alerts`}
        >
          {alerts.length}
        </span>
      </div>
      {alerts.map((a) => {
        const target = ALERT_TARGETS[a.category];
        const Tag = target ? "a" : "div";
        const sevCls = severityClass[a.severity] ?? "adm-od-alert-row--low";
        const tagCls = catClass[a.category] ?? "adm-od-alert-tag--ink";
        return (
          <Tag
            key={a.id}
            href={target}
            className={`adm-od-alert-row ${sevCls}${target ? " adm-od-alert-row--linked" : ""}`}
            aria-label={
              target ? `${a.title} — open ${a.category} queue` : undefined
            }
          >
            <div
              className={`adm-od-alert-dot adm-od-alert-dot--${a.severity}`}
              aria-hidden="true"
            />
            <div className="adm-od-alert-body">
              <div className="adm-od-alert-title">{a.title}</div>
              <div className="adm-od-alert-meta">
                {a.actor} · {timeAgo(a.created_at)}
              </div>
            </div>
            <span className={`adm-od-alert-tag ${tagCls}`}>{a.category}</span>
          </Tag>
        );
      })}
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
      <div className="adm-od-feed-grid adm-od-feed-grid--head" role="row">
        {cols.map((c) => (
          <span key={c} className="adm-od-feed-head" role="columnheader">
            {c}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div className="adm-od-feed-body">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="adm-od-feed-grid adm-od-feed-row"
            role="row"
          >
            <span className="adm-od-feed-time">
              {formatTime(evt.timestamp)}
            </span>
            <span className={eventPillClass(evt.type)}>
              {EVENT_LABELS[evt.type] ?? evt.type}
            </span>
            <span className="adm-od-feed-actor" title={evt.actor}>
              {evt.actor}
            </span>
            <span className="adm-od-feed-target" title={evt.target}>
              {evt.target}
            </span>
            <span className="adm-od-feed-loc" title={evt.location}>
              {evt.location}
            </span>
            <span
              className={
                evt.amount != null
                  ? "adm-od-feed-amt adm-od-feed-amt--has"
                  : "adm-od-feed-amt"
              }
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
      {/* Page-local polish — additive, scoped via .adm-od- prefix */}
      <style>{`
        /* Two-column layout */
        .adm-od-cols {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 1100px) {
          .adm-od-cols { grid-template-columns: 1fr; }
        }

        /* Refresh meta */
        .adm-od-refresh {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--ink-5);
          letter-spacing: 0.02em;
          align-self: center;
          white-space: nowrap;
        }

        /* Activity feed grid */
        .adm-od-feed-grid {
          display: grid;
          grid-template-columns:
            64px 80px minmax(120px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr) 88px;
          gap: 16px;
          align-items: center;
        }
        .adm-od-feed-grid--head {
          padding: 8px 24px;
          background: var(--surface-3);
          border-bottom: 1px solid var(--hairline);
        }
        .adm-od-feed-head {
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-5);
        }
        .adm-od-feed-body {
          max-height: 480px;
          overflow-y: auto;
        }
        .adm-od-feed-row {
          padding: 12px 24px;
          border-bottom: 1px solid var(--hairline);
          transition: background 0.12s;
        }
        .adm-od-feed-row:last-child { border-bottom: none; }
        .adm-od-feed-row:hover { background: var(--surface-3); }
        .adm-od-feed-time {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--ink-5);
        }
        .adm-od-feed-actor {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--ink);
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .adm-od-feed-target {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--ink-3);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .adm-od-feed-loc {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--ink-5);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .adm-od-feed-amt {
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 700;
          color: var(--ink-5);
          text-align: right;
        }
        .adm-od-feed-amt--has { color: var(--accent-blue); }

        /* Alert strip */
        .adm-od-alert {
          background: var(--snow);
          border: 1px solid var(--hairline);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .adm-od-alert__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 16px 8px;
          border-bottom: 1px solid var(--hairline);
        }
        .adm-od-alert__count {
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 700;
          background: var(--brand-red);
          color: var(--snow);
          border-radius: 99px;
          padding: 2px 8px;
          min-width: 24px;
          text-align: center;
        }
        .adm-od-alert-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--hairline);
          background: var(--surface-2);
          text-decoration: none;
          color: inherit;
          transition: background 0.12s, transform 0.12s;
        }
        .adm-od-alert-row:last-child { border-bottom: none; }
        .adm-od-alert-row--crit { background: rgba(193, 18, 31, 0.06); }
        .adm-od-alert-row--warn { background: var(--panel-butter); }
        .adm-od-alert-row--low { background: var(--surface-2); }
        .adm-od-alert-row--linked { cursor: pointer; }
        .adm-od-alert-row--linked:hover {
          background: var(--surface-3);
          transform: translate(2px, 2px);
        }
        .adm-od-alert-row--crit.adm-od-alert-row--linked:hover {
          background: rgba(193, 18, 31, 0.10);
        }
        .adm-od-alert-row--linked:focus-visible {
          outline: 2px solid var(--accent-blue);
          outline-offset: -2px;
        }
        .adm-od-alert-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }
        .adm-od-alert-dot--critical,
        .adm-od-alert-dot--high { background: var(--brand-red); }
        .adm-od-alert-dot--medium { background: var(--champagne); }
        .adm-od-alert-dot--low { background: var(--ink-5); }
        .adm-od-alert-body { flex: 1; min-width: 0; }
        .adm-od-alert-title {
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 4px;
          line-height: 1.3;
        }
        .adm-od-alert-meta {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--ink-5);
        }
        .adm-od-alert-tag {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-radius: 4px;
          padding: 2px 8px;
          flex-shrink: 0;
          align-self: flex-start;
          margin-top: 2px;
        }
        .adm-od-alert-tag--red { background: var(--brand-red-tint); color: var(--brand-red); }
        .adm-od-alert-tag--butter { background: var(--panel-butter); color: var(--ink-3); }
        .adm-od-alert-tag--blue { background: var(--accent-blue-tint); color: var(--accent-blue); }
        .adm-od-alert-tag--ink { background: var(--surface-3); color: var(--ink-5); }
      `}</style>

      {/* Critical alert bar */}
      {totalAlerts > 0 && (
        <div className="adm-alert-bar" role="alert">
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
        <div className="adm-od-refresh" aria-live="polite">
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
      <div className="adm-od-cols">
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
