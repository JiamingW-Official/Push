"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MOCK_METRICS,
  MOCK_EVENTS,
  MOCK_ALERTS,
  type AdminMetrics,
  type LiveEvent,
  type AlertItem,
} from "@/lib/admin/mock-admin";
import "./admin.css";

/* ── Admin Home quick-access card ─────────────────────────────
   v5.1 console — Vertical AI for Local Commerce operations.
   Cards link to DisclosureBot audits, ConversionOracle AI
   verifications, YC Summer 2027 prep hub, plus core admin.
   ──────────────────────────────────────────────────────────── */
type QuickCard = {
  href: string;
  group: "v5.1" | "core";
  title: string;
  desc: string;
  stat: string;
  statLabel: string;
};

function QuickAccessCard({ card }: { card: QuickCard }) {
  return (
    <Link href={card.href} className="ah-card">
      <div className="ah-card__stat">
        <span className="ah-card__stat-val">{card.stat}</span>
        <span className="ah-card__stat-label">{card.statLabel}</span>
      </div>
      <div className="ah-card__title">{card.title}</div>
      <div className="ah-card__desc">{card.desc}</div>
      <div className="ah-card__cta">Open →</div>
    </Link>
  );
}

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

  // Area fill path
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
      className="adm-chart__svg"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ height }}
    >
      <defs>
        <linearGradient
          id={`grad-${color.replace("#", "")}`}
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
        fill={`url(#grad-${color.replace("#", "")})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Last value dot */}
      {(() => {
        const last = data[data.length - 1];
        const x = (data.length - 1) * step;
        const y = H - ((last - min) / range) * (H - 6) - 3;
        return <circle cx={x} cy={y} r="3" fill={color} />;
      })()}
    </svg>
  );
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
      <div className="adm-kpi-card__label">{label}</div>
      <div className="adm-kpi-card__value">{value}</div>
      <div className="adm-kpi-card__sub">{sub}</div>
    </div>
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

/* ── Alert strip ─────────────────────────────────────────────── */
function AlertStrip({ alerts }: { alerts: AlertItem[] }) {
  return (
    <div className="adm-alerts">
      <div className="adm-alerts__header">
        <div className="adm-alerts__title">Action Required</div>
        <div className="adm-alerts__count">{alerts.length}</div>
      </div>
      {alerts.map((a) => (
        <div key={a.id} className="adm-alert-item">
          <div className={`adm-alert-dot adm-alert-dot--${a.severity}`} />
          <div className="adm-alert-item__body">
            <div className="adm-alert-item__title">{a.title}</div>
            <div className="adm-alert-item__meta">
              {a.actor} · {timeAgo(a.created_at)}
            </div>
          </div>
          <span className={`adm-alert-cat adm-alert-cat--${a.category}`}>
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
    { label: "7-Day Scans", data: trend.scans, color: "#669bbc" },
    { label: "7-Day Verifies", data: trend.verifies, color: "#003049" },
    { label: "7-Day Conversions", data: trend.conversions, color: "#c9a96e" },
  ];

  return (
    <div className="adm-charts">
      {charts.map(({ label, data, color }) => (
        <div key={label} className="adm-chart">
          <div className="adm-chart__header">
            <div className="adm-chart__label">{label}</div>
            <div className="adm-chart__latest">{data[data.length - 1]}</div>
          </div>
          <Sparkline data={data} color={color} />
        </div>
      ))}
    </div>
  );
}

/* ── Activity feed ───────────────────────────────────────────── */
function ActivityFeed({ events }: { events: LiveEvent[] }) {
  return (
    <div className="adm-feed">
      <div className="adm-feed__header">
        <div className="adm-feed__title">Live Activity</div>
        <div className="adm-feed__sub">Last 50 events</div>
      </div>
      <div className="adm-feed__table-head">
        <span>Time</span>
        <span>Type</span>
        <span>Actor</span>
        <span>Target</span>
        <span>Location</span>
        <span>Amount</span>
      </div>
      {events.map((evt) => (
        <div key={evt.id} className="adm-feed__row">
          <div className="adm-feed__time">{formatTime(evt.timestamp)}</div>
          <div>
            <span className={`adm-event-pill adm-event-pill--${evt.type}`}>
              {EVENT_LABELS[evt.type] ?? evt.type}
            </span>
          </div>
          <div className="adm-feed__actor">{evt.actor}</div>
          <div className="adm-feed__target">{evt.target}</div>
          <div className="adm-feed__location">{evt.location}</div>
          <div className="adm-feed__amount">
            {evt.amount != null ? `$${evt.amount}` : "—"}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main Overview page ──────────────────────────────────────── */
export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState<AdminMetrics>(MOCK_METRICS);
  const [events, setEvents] = useState<LiveEvent[]>(MOCK_EVENTS);
  const [alerts, setAlerts] = useState<AlertItem[]>(MOCK_ALERTS);
  const [lastFetch, setLastFetch] = useState<Date>(new Date());

  // Fetch from API route on mount and every 30s
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

  // v5.1 quick-access cards — DisclosureBot compliance + ConversionOracle
  // AI verification are the new Vertical AI for Local Commerce surfaces.
  const v51Cards: QuickCard[] = [
    {
      href: "/admin/disclosure-audits",
      group: "v5.1",
      title: "DisclosureBot Audits",
      desc: "FTC disclosure trail for every creator post — 30-day retention window",
      stat: "24",
      statLabel: "flagged posts · 7d",
    },
    {
      href: "/admin/ai-verifications",
      group: "v5.1",
      title: "AI Verifications",
      desc: "ConversionOracle queue for Vision + OCR + geo verifications needing review",
      stat: "12",
      statLabel: "in manual review",
    },
    {
      href: "/admin/yc-application",
      group: "v5.1",
      title: "YC Application Hub",
      desc: "Summer 2027 prep — Vertical AI for Local Commerce application assets",
      stat: "S27",
      statLabel: "batch target",
    },
  ];

  const coreCards: QuickCard[] = [
    {
      href: "/admin/users",
      group: "core",
      title: "Users",
      desc: "Creators, merchants, staff — KYC status, roles, lifetime activity",
      stat: String(metrics.kpi.new_users_today),
      statLabel: "new · 24h",
    },
    {
      href: "/admin/campaigns",
      group: "core",
      title: "Campaigns",
      desc: "All live and paused campaigns across merchants and creators",
      stat: String(metrics.kpi.active_campaigns),
      statLabel: "active now",
    },
    {
      href: "/admin/cohorts",
      group: "core",
      title: "Cohorts",
      desc: "Pilot cohorts by beachhead vertical — Williamsburg Coffee+ first",
      stat: "3",
      statLabel: "cohorts live",
    },
    {
      href: "/admin/disputes",
      group: "core",
      title: "Disputes",
      desc: "Open merchant-creator disputes awaiting resolution or SLA breach",
      stat: String(metrics.alerts.disputes_open),
      statLabel: "open now",
    },
    {
      href: "/admin/finance",
      group: "core",
      title: "Finance",
      desc: "Payouts, escrow, ledger — reconciliation and merchant settlements",
      stat: formatCurrency(metrics.kpi.gmv_month),
      statLabel: "GMV · month",
    },
    {
      href: "/admin/fraud",
      group: "core",
      title: "Fraud",
      desc: "Suspicious verifications, velocity anomalies, blacklist hits",
      stat: String(metrics.alerts.fraud_suspected),
      statLabel: "flagged",
    },
    {
      href: "/admin/audit-log",
      group: "core",
      title: "Audit Log",
      desc: "Immutable admin action trail — policy, payouts, role changes",
      stat: "30d",
      statLabel: "retention",
    },
    {
      href: "/admin/verifications",
      group: "core",
      title: "Verifications",
      desc: "Manual verification review — QR scan + receipt + location checks",
      stat: String(metrics.alerts.kyc_pending),
      statLabel: "pending",
    },
  ];

  return (
    <>
      {/* Hero */}
      <div className="adm-hero">
        <div className="adm-hero__eyebrow">
          Push Ops ·{" "}
          {lastFetch.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <div className="adm-hero__title">Push Ops Console.</div>

        <div className="adm-hero__metrics">
          <div className="adm-hero__metric">
            <div className="adm-hero__metric-label">Scans · 24h</div>
            <div className="adm-hero__metric-val">
              {metrics.last24h.scans.toLocaleString()}
            </div>
          </div>
          <div className="adm-hero__metric">
            <div className="adm-hero__metric-label">Verifications · 24h</div>
            <div className="adm-hero__metric-val">
              {metrics.last24h.verifications}
            </div>
          </div>
          <div className="adm-hero__metric">
            <div className="adm-hero__metric-label">Applications · 24h</div>
            <div className="adm-hero__metric-val">
              {metrics.last24h.applications}
            </div>
          </div>
          <div className="adm-hero__metric">
            <div className="adm-hero__metric-label">GMV · 24h</div>
            <div className="adm-hero__metric-val adm-hero__metric-val--accent">
              {formatCurrency(metrics.last24h.gmv)}
            </div>
          </div>
        </div>
      </div>

      {/* 4 KPI cards */}
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

      {/* v5.1 quick-access — surfaces for DisclosureBot +
          ConversionOracle, the Vertical AI for Local Commerce layer */}
      <div className="adm-section-head">v5.1 Admin · AI Commerce Layer</div>
      <div className="ah-grid ah-grid--v51">
        {v51Cards.map((card) => (
          <QuickAccessCard key={card.href} card={card} />
        ))}
      </div>

      {/* Core admin surfaces */}
      <div className="adm-section-head">Core Admin</div>
      <div className="ah-grid ah-grid--core">
        {coreCards.map((card) => (
          <QuickAccessCard key={card.href} card={card} />
        ))}
      </div>

      {/* Two-column: feed left, alerts+charts right */}
      <div className="adm-section-head">Live Ops</div>
      <div className="adm-grid">
        {/* Left: activity feed */}
        <ActivityFeed events={events} />

        {/* Right: alert strip + mini charts */}
        <div>
          <AlertStrip alerts={alerts} />
          <div className="adm-section-head">7-Day Trends</div>
          <MiniCharts trend={metrics.trend_7d} />
        </div>
      </div>
    </>
  );
}
