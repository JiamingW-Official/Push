// Push — /status  (Server Component, statically generated at build, ISR 60s)
// Design authority: Design.md
// Status colors: Operational = Champagne Gold | Degraded = Steel Blue | Outage = Flag Red

import type { Metadata } from "next";
import {
  SERVICES,
  PERFORMANCE_METRICS,
  getOverallStatus,
  getActiveIncidents,
  getRecentIncidents,
  type Service,
  type Incident,
  type ServiceStatus,
  type DayStatus,
  type PerformanceMetric,
} from "@/lib/status/mock-services";
import SubscribeForm from "./SubscribeForm";
import "./status.css";

export const metadata: Metadata = {
  title: "System Status — Push",
  description:
    "Real-time status of all Push services including API, payments, QR scanning, and attribution.",
};

// ISR: regenerate every 60 seconds
export const revalidate = 60;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
    hour12: false,
    timeZone: "UTC",
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function heroLabel(status: ServiceStatus): string {
  if (status === "operational") return "All systems operational.";
  if (status === "degraded") return "Partial outage.";
  return "Major outage.";
}

function heroClass(status: ServiceStatus): string {
  return `status-hero-headline is-${status}`;
}

function statusLabel(status: ServiceStatus): string {
  if (status === "operational") return "Operational";
  if (status === "degraded") return "Degraded";
  return "Outage";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeatmapBar({ days }: { days: DayStatus[] }) {
  return (
    <div>
      <div className="heatmap-bar" aria-label="90-day uptime heatmap">
        {days.map((d, i) => (
          <div
            key={i}
            className={`heatmap-cell ${d}`}
            title={`Day ${90 - (89 - i)}: ${d}`}
          />
        ))}
      </div>
      <div className="heatmap-meta">
        <span>90 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="service-card reveal-up">
      <div className="service-card-header">
        <span className="service-name">{service.name}</span>
        <div className={`service-status-indicator ${service.status}`}>
          <span className={`status-dot ${service.status}`} />
          {statusLabel(service.status)}
        </div>
      </div>
      <div className="service-uptime-value">
        {service.uptimePercent.toFixed(2)}
        <span
          style={{
            fontSize: "18px",
            fontWeight: 300,
            letterSpacing: 0,
            color: "rgba(0,48,73,0.4)",
          }}
        >
          %
        </span>
      </div>
      <div className="service-uptime-label">90-day uptime</div>
      <HeatmapBar days={service.uptime90} />
    </div>
  );
}

function IncidentCard({ incident }: { incident: Incident }) {
  return (
    <article
      className={`incident-card severity-${incident.severity} reveal-up`}
      aria-label={`Incident: ${incident.title}`}
    >
      <div className="incident-card-header">
        <div className="incident-title-group">
          <h3 className="incident-title">{incident.title}</h3>
          <div className="incident-meta">
            <span className="incident-meta-item">
              {formatDate(incident.startedAt)}
            </span>
            <div className="incident-services">
              {incident.affectedServices.map((sid) => {
                const svc = SERVICES.find((s) => s.id === sid);
                return (
                  <span key={sid} className="incident-service-tag">
                    {svc?.name ?? sid}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <span className={`incident-severity-badge ${incident.severity}`}>
          {incident.severity}
        </span>
      </div>

      {/* Timeline */}
      <div className="incident-timeline">
        {incident.updates.map((update, i) => (
          <div key={i} className="timeline-item">
            <div className="timeline-time">
              {formatTimestamp(update.timestamp)
                .split(",")
                .slice(0, 2)
                .join(",")}
            </div>
            <div className={`timeline-node ${update.phase}`} />
            {i < incident.updates.length - 1 && (
              <div className="timeline-line" />
            )}
            <div className="timeline-content">
              <div className={`timeline-phase ${update.phase}`}>
                {update.phase}
              </div>
              <p className="timeline-message">{update.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {(incident.durationMinutes || incident.postmortemUrl) && (
        <div className="incident-footer">
          {incident.durationMinutes && (
            <span className="incident-duration">
              Duration: {incident.durationMinutes} min
            </span>
          )}
          {incident.postmortemUrl && (
            <a
              href={incident.postmortemUrl}
              className="incident-postmortem-link"
            >
              Post-mortem ↗
            </a>
          )}
        </div>
      )}
    </article>
  );
}

function PerfMetricCard({ metric }: { metric: PerformanceMetric }) {
  const trendIcon =
    metric.id === "api-p95" && metric.trend === "down"
      ? "↓"
      : metric.trend === "up"
        ? "↑"
        : metric.trend === "down"
          ? "↓"
          : "→";

  return (
    <div className="perf-metric-card reveal-up">
      <div className="perf-metric-label">{metric.label}</div>
      <div className="perf-metric-value-row">
        <span className="perf-metric-value">{metric.value}</span>
        <span className="perf-metric-unit">{metric.unit}</span>
      </div>
      <div className={`perf-metric-trend ${metric.trend}`}>
        {trendIcon} {metric.trendValue}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function StatusPage() {
  const overall = getOverallStatus();
  const activeIncidents = getActiveIncidents();
  const recentIncidents = getRecentIncidents(7);

  return (
    <main className="status-page">
      {/* ── 1. Hero banner ─────────────────────────────────────── */}
      <section className="status-hero" aria-label="Overall system status">
        <div className="status-hero-inner">
          <div className="status-eyebrow">Push Platform Status</div>
          <h1 className={heroClass(overall)}>{heroLabel(overall)}</h1>
          <p className="status-hero-meta">
            <span
              className={`status-hero-meta-dot is-${overall}`}
              aria-hidden="true"
            />
            Last updated {formatTimestamp(new Date().toISOString())}
            &nbsp;&nbsp;·&nbsp;&nbsp;
            <a
              href="/api/status"
              style={{
                color: "rgba(255,255,255,0.45)",
                textDecoration: "none",
                fontFamily: "inherit",
                fontSize: "inherit",
                transition: "color 300ms",
              }}
            >
              JSON API
            </a>
          </p>
        </div>
      </section>

      <div className="status-container">
        {/* ── 2. Service grid ──────────────────────────────────── */}
        <section className="status-section" aria-labelledby="services-heading">
          <div className="status-section-header">
            <span className="status-section-num">01 /</span>
            <h2 className="status-section-title" id="services-heading">
              Services
            </h2>
          </div>
          <div className="service-grid">
            {SERVICES.map((svc) => (
              <ServiceCard key={svc.id} service={svc} />
            ))}
          </div>
        </section>

        {/* ── 3. Active incidents ──────────────────────────────── */}
        <section
          className="status-section"
          aria-labelledby="active-incidents-heading"
        >
          <div className="status-section-header">
            <span className="status-section-num">02 /</span>
            <h2 className="status-section-title" id="active-incidents-heading">
              Active Incidents
            </h2>
          </div>

          {activeIncidents.length === 0 ? (
            <div className="incident-empty" role="status">
              <span className="incident-empty-check" aria-hidden="true">
                ✓
              </span>
              No active incidents. All services are operating normally.
            </div>
          ) : (
            <div>
              {activeIncidents.map((inc) => (
                <IncidentCard key={inc.id} incident={inc} />
              ))}
            </div>
          )}
        </section>

        {/* ── 4. Recent incident history (7 days) ─────────────── */}
        <section
          className="status-section"
          aria-labelledby="recent-incidents-heading"
        >
          <div className="status-section-header">
            <span className="status-section-num">03 /</span>
            <h2 className="status-section-title" id="recent-incidents-heading">
              Recent Incidents
              <span
                style={{
                  fontFamily: "'CSGenioMono', monospace",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "rgba(0,48,73,0.4)",
                  letterSpacing: "0.04em",
                  marginLeft: "12px",
                  verticalAlign: "middle",
                }}
              >
                Last 7 days
              </span>
            </h2>
          </div>

          {recentIncidents.length === 0 ? (
            <div className="incident-empty" role="status">
              <span className="incident-empty-check" aria-hidden="true">
                ✓
              </span>
              No incidents in the past 7 days.
            </div>
          ) : (
            <div className="recent-incidents-list">
              {recentIncidents.map((inc) => (
                <IncidentCard key={inc.id} incident={inc} />
              ))}
            </div>
          )}
        </section>

        {/* ── 5. Performance metrics ───────────────────────────── */}
        <section
          className="status-section"
          aria-labelledby="perf-metrics-heading"
        >
          <div className="status-section-header">
            <span className="status-section-num">04 /</span>
            <h2 className="status-section-title" id="perf-metrics-heading">
              Performance
            </h2>
          </div>
          <div className="perf-metrics-grid">
            {PERFORMANCE_METRICS.map((m) => (
              <PerfMetricCard key={m.id} metric={m} />
            ))}
          </div>
        </section>
      </div>

      {/* ── 6. Subscribe ─────────────────────────────────────────── */}
      <section className="status-subscribe" aria-labelledby="subscribe-heading">
        <div className="status-subscribe-inner">
          <div>
            <h2 className="subscribe-headline" id="subscribe-heading">
              Get status updates.
            </h2>
            <p className="subscribe-sub">
              Subscribe for email notifications on incidents and maintenance.
            </p>
          </div>
          <SubscribeForm />
        </div>
      </section>

      {/* ── Scroll reveal script ──────────────────────────────────── */}
      <ScrollRevealScript />
    </main>
  );
}

// Inline script for scroll-reveal — avoids FOUC without adding a client component
function ScrollRevealScript() {
  const script = `
    (function() {
      var els = document.querySelectorAll('.reveal-up');
      if (!els.length) return;
      var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.08 });
      els.forEach(function(el) { io.observe(el); });
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} defer />;
}
