// Push — /status  (Server Component, ISR 60s)
// Design authority: Design.md
// v5.1: Vertical AI for Local Commerce — Customer Acquisition Engine

import type { Metadata } from "next";
import {
  SERVICES,
  INCIDENTS,
  getOverallStatus,
  getRecentIncidents,
  type Service,
  type Incident,
  type ServiceStatus,
  type DayStatus,
} from "@/lib/status/mock-services";
import SubscribeForm from "./SubscribeForm";
import "./status.css";

export const metadata: Metadata = {
  title: "Status — Push",
  description:
    "Real-time status of the Push Customer Acquisition Engine — API, Dashboard, ConversionOracle™, Payments, and Webhooks.",
};

export const revalidate = 60;

/* ── v5.1 display services ──────────────────────────────────
   The data layer defines 8 services. The v5.1 status surface shows
   exactly 5: API / Dashboard / ConversionOracle™ / Payments / Webhooks.
   We remap without touching the data layer.
   ────────────────────────────────────────────────────────── */
interface DisplayService {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  uptimePercent: number;
  uptime90: DayStatus[];
  latencyMs?: number;
}

function pickService(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

function buildDisplayServices(): DisplayService[] {
  const api = pickService("api")!;
  const dashboard = pickService("dashboard")!;
  const attribution = pickService("attribution")!;
  const payments = pickService("payments")!;
  const qr = pickService("qr-scan")!;

  return [
    {
      id: "api",
      name: "API",
      description:
        "Core REST API — campaigns, creators, ConversionOracle predictions.",
      status: api.status,
      uptimePercent: api.uptimePercent,
      uptime90: api.uptime90,
      latencyMs: api.latencyMs,
    },
    {
      id: "dashboard",
      name: "Dashboard",
      description:
        "Merchant and creator dashboards — SLR widget, campaign workspace.",
      status: dashboard.status,
      uptimePercent: dashboard.uptimePercent,
      uptime90: dashboard.uptime90,
    },
    {
      // ConversionOracle™ is backed by the Attribution engine in the data layer.
      id: "conversion-oracle",
      name: "ConversionOracle™",
      description:
        "Walk-in prediction model — per-creator, per-neighborhood, per-hour.",
      status: attribution.status,
      uptimePercent: attribution.uptimePercent,
      uptime90: attribution.uptime90,
      latencyMs: attribution.latencyMs,
    },
    {
      id: "payments",
      name: "Payments",
      description:
        "Stripe Connect payouts — Two-Segment creator disbursements and equity-pool accruals.",
      status: payments.status,
      uptimePercent: payments.uptimePercent,
      uptime90: payments.uptime90,
    },
    {
      // Webhooks piggyback on the QR-scan service in the data layer.
      id: "webhooks",
      name: "Webhooks",
      description:
        "QR scan events and verification-result delivery to merchant POS integrations.",
      status: qr.status,
      uptimePercent: qr.uptimePercent,
      uptime90: qr.uptime90,
      latencyMs: qr.latencyMs,
    },
  ];
}

/* ── Helpers ────────────────────────────────────────────── */
function heroLabel(status: ServiceStatus): string {
  if (status === "operational") return "All systems operational.";
  if (status === "degraded") return "Partial degradation.";
  return "Active outage.";
}

function statusLabel(status: ServiceStatus): string {
  if (status === "operational") return "Operational";
  if (status === "degraded") return "Degraded";
  return "Outage";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/* ── 90-day uptime chart (inline SVG bars) ──────────────── */
function UptimeChart({ days }: { days: DayStatus[] }) {
  // Build SVG 360x36. 90 bars × (3px + 1px gap) = 360 wide.
  const barWidth = 3;
  const gap = 1;
  const chartHeight = 32;
  const totalWidth = days.length * (barWidth + gap);

  function colorFor(d: DayStatus): string {
    switch (d) {
      case "operational":
        return "#10b981"; // green
      case "degraded":
        return "var(--champagne)";
      case "outage":
        return "var(--primary)";
      default:
        return "rgba(0, 48, 73, 0.12)";
    }
  }

  return (
    <svg
      className="status-uptime-svg"
      viewBox={`0 0 ${totalWidth} ${chartHeight + 4}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="90-day uptime history"
    >
      {days.map((d, i) => {
        const x = i * (barWidth + gap);
        const height =
          d === "outage"
            ? chartHeight
            : d === "degraded"
              ? chartHeight * 0.7
              : chartHeight * 0.55;
        const y = chartHeight - height + 2;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={height}
            fill={colorFor(d)}
          />
        );
      })}
    </svg>
  );
}

/* ── Service row (current status) ────────────────────────── */
function ServiceRow({ service }: { service: DisplayService }) {
  return (
    <article className="status-service">
      <div className="status-service__header">
        <div className="status-service__title-block">
          <h3 className="status-service__name">{service.name}</h3>
          <p className="status-service__desc">{service.description}</p>
        </div>
        <div className={`status-pill status-pill--${service.status}`}>
          <span className={`status-dot status-dot--${service.status}`} />
          {statusLabel(service.status)}
        </div>
      </div>

      <div className="status-service__chart-wrap">
        <UptimeChart days={service.uptime90} />
        <div className="status-service__chart-meta">
          <span>90 days ago</span>
          <span>Today</span>
        </div>
      </div>

      <dl className="status-service__stats">
        <div className="status-service__stat">
          <dt>Uptime</dt>
          <dd>
            <span className="status-service__stat-value">
              {service.uptimePercent.toFixed(2)}
            </span>
            <span className="status-service__stat-unit">%</span>
          </dd>
        </div>
        <div className="status-service__stat">
          <dt>P95 latency</dt>
          <dd>
            <span className="status-service__stat-value">
              {service.latencyMs ?? "—"}
            </span>
            <span className="status-service__stat-unit">
              {service.latencyMs ? "ms" : ""}
            </span>
          </dd>
        </div>
        <div className="status-service__stat">
          <dt>Status</dt>
          <dd>
            <span
              className={`status-service__stat-value status-service__stat-value--${service.status}`}
            >
              {statusLabel(service.status).toUpperCase()}
            </span>
          </dd>
        </div>
      </dl>
    </article>
  );
}

/* ── Recent incident card ────────────────────────────────── */
function IncidentCard({
  incident,
  serviceMap,
}: {
  incident: Incident;
  serviceMap: Map<string, string>;
}) {
  const lastUpdate = incident.updates[incident.updates.length - 1];
  const firstUpdate = incident.updates[0];

  // Root cause = first "identified" message if available
  const rootCause = incident.updates.find(
    (u) => u.phase === "identified",
  )?.message;

  // Prevention note — synthesized from the last update for demo purposes
  const prevention =
    lastUpdate.phase === "resolved"
      ? `Post-mortem scheduled. ${lastUpdate.message.split(". ")[1] ?? "Runbook updated."}`
      : "Monitoring in progress.";

  const services = incident.affectedServices
    .map((id) => serviceMap.get(id) ?? id)
    .join(", ");

  return (
    <article
      className={`status-incident status-incident--${incident.severity}`}
    >
      <div className="status-incident__header">
        <div className="status-incident__header-left">
          <time className="status-incident__date" dateTime={incident.startedAt}>
            {formatDate(incident.startedAt)}
          </time>
          <span className="status-incident__service">{services}</span>
        </div>
        <div className="status-incident__header-right">
          <span
            className={`status-incident__severity status-incident__severity--${incident.severity}`}
          >
            {incident.severity}
          </span>
          {incident.durationMinutes && (
            <span className="status-incident__duration">
              {incident.durationMinutes} min
            </span>
          )}
        </div>
      </div>

      <h3 className="status-incident__title">{incident.title}</h3>

      <dl className="status-incident__details">
        <div className="status-incident__detail">
          <dt>Summary</dt>
          <dd>{firstUpdate.message}</dd>
        </div>
        {rootCause && (
          <div className="status-incident__detail">
            <dt>Root cause</dt>
            <dd>{rootCause}</dd>
          </div>
        )}
        <div className="status-incident__detail">
          <dt>Prevention</dt>
          <dd>{prevention}</dd>
        </div>
      </dl>

      {incident.postmortemUrl && (
        <a className="status-incident__link" href={incident.postmortemUrl}>
          Read post-mortem →
        </a>
      )}
    </article>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function StatusPage() {
  const displayServices = buildDisplayServices();

  // Compute overall from the display set to keep the hero truthful.
  const displayStatuses = displayServices.map((s) => s.status);
  const overall: ServiceStatus = displayStatuses.includes("outage")
    ? "outage"
    : displayStatuses.includes("degraded")
      ? "degraded"
      : "operational";

  // Rough aggregate from the data layer's function for consistency.
  void getOverallStatus();

  // Service id → display name (for incident rendering)
  const serviceMap = new Map<string, string>();
  serviceMap.set("api", "API");
  serviceMap.set("dashboard", "Dashboard");
  serviceMap.set("attribution", "ConversionOracle™");
  serviceMap.set("payments", "Payments");
  serviceMap.set("qr-scan", "Webhooks");
  serviceMap.set("webapp", "Dashboard");
  serviceMap.set("auth", "API");
  serviceMap.set("cdn", "API");

  // Include both resolved and active incidents (past ~2 weeks) for a 4-5 list.
  const resolved = getRecentIncidents(14);
  const open = INCIDENTS.filter((i) => i.status === "open");
  const recentIncidents = [...open, ...resolved].slice(0, 5);

  const overallLabelForHero =
    overall === "operational" ? "All systems operational." : heroLabel(overall);

  return (
    <main className="status-page">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="status-hero" aria-label="Overall system status">
        <div className="container status-hero__inner">
          <p className="status-hero__eyebrow">Status</p>
          <h1 className={`status-hero__title status-hero__title--${overall}`}>
            {overallLabelForHero}
          </h1>
          <p className="status-hero__sub">
            Live health of the Push Customer Acquisition Engine — Vertical AI
            for Local Commerce. 60-second refresh.
          </p>
          <div className="status-hero__meta">
            <span className={`status-hero__dot status-hero__dot--${overall}`} />
            <span className="status-hero__meta-text">
              {overall === "operational"
                ? "All 5 services operating normally"
                : overall === "degraded"
                  ? "Performance degradation detected"
                  : "Outage in progress"}
            </span>
            <span className="status-hero__sep" aria-hidden="true">
              ·
            </span>
            <a href="/api/status" className="status-hero__api">
              JSON API ↗
            </a>
          </div>
        </div>
      </section>

      <div className="container status-body">
        {/* ── Services grid ───────────────────────────── */}
        <section className="status-section" aria-labelledby="services-heading">
          <div className="status-section__header">
            <span className="status-section__num">01 /</span>
            <h2 className="status-section__title" id="services-heading">
              Current status
            </h2>
            <span className="status-section__meta">5 services</span>
          </div>
          <div className="status-services-grid">
            {displayServices.map((svc) => (
              <ServiceRow key={svc.id} service={svc} />
            ))}
          </div>
        </section>

        {/* ── Recent incidents ────────────────────────── */}
        <section className="status-section" aria-labelledby="incidents-heading">
          <div className="status-section__header">
            <span className="status-section__num">02 /</span>
            <h2 className="status-section__title" id="incidents-heading">
              Recent incidents
            </h2>
            <span className="status-section__meta">last 14 days</span>
          </div>

          {recentIncidents.length === 0 ? (
            <div className="status-empty">
              <span className="status-empty__check" aria-hidden="true">
                ✓
              </span>
              <span>
                No incidents in the past 14 days. All services nominal.
              </span>
            </div>
          ) : (
            <div className="status-incidents">
              {recentIncidents.map((inc) => (
                <IncidentCard
                  key={inc.id}
                  incident={inc}
                  serviceMap={serviceMap}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Subscribe ─────────────────────────────────── */}
      <section className="status-subscribe" aria-labelledby="subscribe-heading">
        <div className="container status-subscribe__inner">
          <div className="status-subscribe__text">
            <p className="status-subscribe__eyebrow">Stay informed</p>
            <h2 className="status-subscribe__headline" id="subscribe-heading">
              <span className="wt-900">Know when something breaks.</span>
              <br />
              <span className="wt-300">Before a campaign does.</span>
            </h2>
            <p className="status-subscribe__sub">
              Pick your channel. We&apos;ll push incident updates, scheduled
              maintenance windows, and post-mortem links.
            </p>
          </div>
          <SubscribeForm />
        </div>
      </section>
    </main>
  );
}
