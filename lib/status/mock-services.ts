// Push — Service Status Mock Data
// Authority: Design.md color tokens

export type ServiceStatus = "operational" | "degraded" | "outage";

export type DayStatus = "operational" | "degraded" | "outage" | "no-data";

export interface ServiceUptime {
  day: number; // 0 = 90 days ago, 89 = today
  status: DayStatus;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  uptimePercent: number; // 90-day rolling
  uptime90: DayStatus[]; // 90 entries, index 0 = oldest
  latencyMs?: number;
}

export interface IncidentUpdate {
  timestamp: string;
  phase: "investigating" | "identified" | "monitoring" | "resolved";
  message: string;
}

export interface Incident {
  id: string;
  title: string;
  status: "open" | "resolved";
  severity: "minor" | "major" | "critical";
  affectedServices: string[]; // service ids
  startedAt: string;
  resolvedAt?: string;
  durationMinutes?: number;
  updates: IncidentUpdate[];
  postmortemUrl?: string;
}

export interface PerformanceMetric {
  id: string;
  label: string;
  value: string;
  unit: string;
  trend: "up" | "down" | "stable";
  trendValue: string;
}

// ─── Helper to generate 90-day heatmap ─────────────────────────────────────

function generateHeatmap(
  uptimePct: number,
  downdaysPattern?: number[],
): DayStatus[] {
  const days: DayStatus[] = [];
  const degradedDays = new Set(downdaysPattern ?? []);
  for (let i = 0; i < 90; i++) {
    if (degradedDays.has(i)) {
      days.push(i % 2 === 0 ? "degraded" : "outage");
    } else {
      // Small random degraded sprinkles to reflect realistic uptime < 100%
      const rand = Math.random();
      if (uptimePct >= 99.9 && rand < 0.005) {
        days.push("degraded");
      } else if (uptimePct >= 99.5 && rand < 0.01) {
        days.push("degraded");
      } else if (rand < 0.002) {
        days.push("degraded");
      } else {
        days.push("operational");
      }
    }
  }
  return days;
}

// ─── Services ───────────────────────────────────────────────────────────────

export const SERVICES: Service[] = [
  {
    id: "api",
    name: "API",
    description: "Core REST API — campaign CRUD, creator endpoints",
    status: "operational",
    uptimePercent: 99.97,
    uptime90: generateHeatmap(99.97, [23, 45]),
    latencyMs: 42,
  },
  {
    id: "webapp",
    name: "Web App",
    description: "Push.com main application and all authenticated routes",
    status: "operational",
    uptimePercent: 99.94,
    uptime90: generateHeatmap(99.94, [45]),
  },
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Merchant and creator analytics dashboards",
    status: "operational",
    uptimePercent: 99.91,
    uptime90: generateHeatmap(99.91, [23, 44, 45]),
  },
  {
    id: "qr-scan",
    name: "QR Scan",
    description: "Real-time QR code scanning and validation pipeline",
    status: "operational",
    uptimePercent: 99.99,
    uptime90: generateHeatmap(99.99),
    latencyMs: 180,
  },
  {
    id: "payments",
    name: "Payments",
    description: "Stripe-backed payment processing and payout disbursements",
    status: "operational",
    uptimePercent: 99.95,
    uptime90: generateHeatmap(99.95, [67]),
  },
  {
    id: "attribution",
    name: "Attribution",
    description: "Footfall and conversion attribution engine",
    status: "degraded",
    uptimePercent: 98.72,
    uptime90: generateHeatmap(98.72, [2, 3, 4, 67, 68, 87, 88, 89]),
    latencyMs: 390,
  },
  {
    id: "auth",
    name: "Auth",
    description: "Authentication, session management and OAuth providers",
    status: "operational",
    uptimePercent: 99.98,
    uptime90: generateHeatmap(99.98),
  },
  {
    id: "cdn",
    name: "CDN",
    description: "Global content delivery — images, assets, media",
    status: "operational",
    uptimePercent: 100.0,
    uptime90: generateHeatmap(100.0),
  },
];

// ─── Incidents ───────────────────────────────────────────────────────────────

export const INCIDENTS: Incident[] = [
  // Active incident
  {
    id: "inc-2026-041701",
    title: "Attribution engine elevated latency",
    status: "open",
    severity: "minor",
    affectedServices: ["attribution"],
    startedAt: "2026-04-17T08:14:00Z",
    updates: [
      {
        timestamp: "2026-04-17T08:14:00Z",
        phase: "investigating",
        message:
          "We are investigating reports of elevated response times from the attribution service. QR scanning and payments are unaffected.",
      },
      {
        timestamp: "2026-04-17T09:02:00Z",
        phase: "identified",
        message:
          "Root cause identified: a background reindexing job triggered by a schema migration is saturating database read IOPS. We are throttling the job.",
      },
      {
        timestamp: "2026-04-17T09:45:00Z",
        phase: "monitoring",
        message:
          "Throttling applied. Latency trending down from p95 650ms → 390ms. Continuing to monitor for full recovery.",
      },
    ],
  },

  // Recent resolved incidents (last 7 days)
  {
    id: "inc-2026-041501",
    title: "Payment webhook delivery delays",
    status: "resolved",
    severity: "minor",
    affectedServices: ["payments"],
    startedAt: "2026-04-15T14:22:00Z",
    resolvedAt: "2026-04-15T15:51:00Z",
    durationMinutes: 89,
    updates: [
      {
        timestamp: "2026-04-15T14:22:00Z",
        phase: "investigating",
        message:
          "Investigating reports of delayed webhook delivery for payment events. Payouts themselves are not affected.",
      },
      {
        timestamp: "2026-04-15T14:48:00Z",
        phase: "identified",
        message:
          "Queue backlog identified in our webhook worker pool. Scaling up workers.",
      },
      {
        timestamp: "2026-04-15T15:15:00Z",
        phase: "monitoring",
        message:
          "Worker pool scaled. Queue depth decreasing. Monitoring delivery rates.",
      },
      {
        timestamp: "2026-04-15T15:51:00Z",
        phase: "resolved",
        message:
          "Queue fully drained. All webhook deliveries are current. Normal operations resumed.",
      },
    ],
    postmortemUrl: "#postmortem-inc-2026-041501",
  },
  {
    id: "inc-2026-041301",
    title: "API elevated error rate — 502 gateway errors",
    status: "resolved",
    severity: "major",
    affectedServices: ["api", "dashboard"],
    startedAt: "2026-04-13T02:11:00Z",
    resolvedAt: "2026-04-13T02:58:00Z",
    durationMinutes: 47,
    updates: [
      {
        timestamp: "2026-04-13T02:11:00Z",
        phase: "investigating",
        message:
          "Elevated 502 error rate detected from the API load balancer. Some dashboard requests are failing.",
      },
      {
        timestamp: "2026-04-13T02:24:00Z",
        phase: "identified",
        message:
          "One of three API server instances entered an unhealthy state following an automated certificate rotation. Traffic rerouted to remaining healthy instances.",
      },
      {
        timestamp: "2026-04-13T02:40:00Z",
        phase: "monitoring",
        message:
          "Unhealthy instance replaced and verified. Error rate back to baseline.",
      },
      {
        timestamp: "2026-04-13T02:58:00Z",
        phase: "resolved",
        message:
          "Full capacity restored. All three instances healthy. Automated cert rotation process will be reviewed.",
      },
    ],
    postmortemUrl: "#postmortem-inc-2026-041301",
  },
  {
    id: "inc-2026-041101",
    title: "QR scan intermittent failures — NYC East region",
    status: "resolved",
    severity: "minor",
    affectedServices: ["qr-scan"],
    startedAt: "2026-04-11T19:33:00Z",
    resolvedAt: "2026-04-11T20:04:00Z",
    durationMinutes: 31,
    updates: [
      {
        timestamp: "2026-04-11T19:33:00Z",
        phase: "investigating",
        message:
          "Intermittent scan failures reported from creators in the NYC East region. Other regions unaffected.",
      },
      {
        timestamp: "2026-04-11T19:50:00Z",
        phase: "identified",
        message:
          "Edge node in NYC-East experiencing connectivity issues. Traffic failing over to NYC-Central.",
      },
      {
        timestamp: "2026-04-11T20:04:00Z",
        phase: "resolved",
        message:
          "NYC-East edge node recovered. All scan traffic restored to normal routing. No data loss.",
      },
    ],
  },
  {
    id: "inc-2026-041001",
    title: "Auth service degraded — slow token validation",
    status: "resolved",
    severity: "minor",
    affectedServices: ["auth"],
    startedAt: "2026-04-10T11:05:00Z",
    resolvedAt: "2026-04-10T11:42:00Z",
    durationMinutes: 37,
    updates: [
      {
        timestamp: "2026-04-10T11:05:00Z",
        phase: "investigating",
        message:
          "Slow login and token validation times reported. We are investigating.",
      },
      {
        timestamp: "2026-04-10T11:20:00Z",
        phase: "identified",
        message:
          "Redis cache warming after scheduled maintenance window caused cache-miss storm on token lookups.",
      },
      {
        timestamp: "2026-04-10T11:42:00Z",
        phase: "resolved",
        message:
          "Cache fully warmed. Token validation times back to normal (<12ms).",
      },
    ],
  },
];

// ─── Performance Metrics ─────────────────────────────────────────────────────

export const PERFORMANCE_METRICS: PerformanceMetric[] = [
  {
    id: "api-p95",
    label: "API p95 Latency",
    value: "42",
    unit: "ms",
    trend: "down",
    trendValue: "−8ms vs 30d avg",
  },
  {
    id: "qr-resolve",
    label: "QR Scan Avg Resolve",
    value: "180",
    unit: "ms",
    trend: "stable",
    trendValue: "±2ms vs 30d avg",
  },
  {
    id: "webhook-delivery",
    label: "Webhook Delivery Rate",
    value: "99.94",
    unit: "%",
    trend: "up",
    trendValue: "+0.03% vs 30d avg",
  },
];

// ─── Aggregate status ────────────────────────────────────────────────────────

export function getOverallStatus(): ServiceStatus {
  if (SERVICES.some((s) => s.status === "outage")) return "outage";
  if (SERVICES.some((s) => s.status === "degraded")) return "degraded";
  return "operational";
}

export function getActiveIncidents(): Incident[] {
  return INCIDENTS.filter((i) => i.status === "open");
}

export function getRecentIncidents(days = 7): Incident[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return INCIDENTS.filter(
    (i) => i.status === "resolved" && new Date(i.startedAt) >= cutoff,
  );
}
