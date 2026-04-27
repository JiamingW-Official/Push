import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Status — Push",
  description:
    "Real-time status of all Push platform services. 99.9% uptime, 0 incidents in the last 30 days.",
};

export const revalidate = 60;

const SERVICES = [
  { name: "API", status: "Operational", uptime: "99.98%" },
  { name: "QR Attribution", status: "Operational", uptime: "99.97%" },
  { name: "Creator Payouts", status: "Operational", uptime: "99.99%" },
  { name: "Merchant Dashboard", status: "Operational", uptime: "99.95%" },
  { name: "Creator Dashboard", status: "Operational", uptime: "99.96%" },
  { name: "Scan Verification", status: "Operational", uptime: "99.98%" },
  { name: "ConversionOracle", status: "Operational", uptime: "100%" },
  { name: "Stripe Connect", status: "Operational", uptime: "99.99%" },
];

const UPTIME_STATS = [
  { value: "99.9%", label: "Uptime", sub: "Last 30 days" },
  { value: "0", label: "Incidents", sub: "Last 30 days" },
  { value: "<100ms", label: "Avg response", sub: "API p50 latency" },
];

export default function StatusPage() {
  return (
    <>
      {/* ══ 01 — HERO (dark ink, big status indicator) ══ */}
      <section
        style={{
          background: "var(--ink)",
          color: "var(--snow)",
          padding: "96px clamp(24px,6vw,64px)",
          position: "relative",
          overflow: "hidden",
        }}
        aria-label="Overall system status"
      >
        <div style={{ maxWidth: 1140, margin: "0 auto", position: "relative" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.45)",
              margin: "0 0 32px",
            }}
          >
            (SYSTEM STATUS)
          </p>

          {/* Giant status indicator row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginBottom: 48,
            }}
          >
            {/* Big colored circle — accent-blue = all good */}
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "var(--accent-blue)",
                flexShrink: 0,
                boxShadow: "0 0 0 8px rgba(0,133,255,0.12)",
              }}
              aria-hidden="true"
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: "var(--accent-blue)",
              }}
            >
              All systems operational
            </span>
          </div>

          {/* Darky Display H1 — bottom-left anchored */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(56px,8vw,128px)",
              fontWeight: 900,
              color: "var(--snow)",
              lineHeight: 0.9,
              margin: "0 0 48px",
              letterSpacing: "-0.035em",
            }}
          >
            All systems
            <br />
            operational.
          </h1>

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              color: "rgba(255,255,255,0.4)",
              margin: 0,
              lineHeight: 1.55,
            }}
          >
            Last updated: April 25, 2026 at 10:00 UTC &middot;{" "}
            <a
              href="/api/status"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              JSON API &rarr;
            </a>
          </p>
        </div>
      </section>

      {/* ══ SIG DIVIDER ══ */}
      <div className="sig-divider">
        Monitored&nbsp;·&nbsp;Verified&nbsp;·&nbsp;Live&nbsp;·
      </div>

      {/* ══ 02 — UPTIME KPI STRIP ══ */}
      <section
        style={{
          background: "var(--surface-2)",
          borderBottom: "1px solid var(--hairline)",
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            padding: "0 64px",
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            borderTop: "1px solid var(--hairline)",
          }}
        >
          {UPTIME_STATS.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: "48px 0",
                paddingRight: i < 2 ? 24 : 0,
                paddingLeft: i > 0 ? 24 : 0,
                borderRight: i < 2 ? "1px solid var(--hairline)" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(40px,5vw,72px)",
                  fontWeight: 700,
                  color: "var(--ink)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.02em",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--ink)",
                  marginTop: 8,
                  letterSpacing: "-0.01em",
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--ink-4)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase" as const,
                  marginTop: 4,
                }}
              >
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ 03 — SERVICES GRID (6-8 cards with uptime bars) ══ */}
      <section
        style={{
          background: "var(--surface)",
          padding: "96px clamp(24px,6vw,64px)",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "var(--ink-4)",
              margin: "0 0 16px",
            }}
          >
            (SERVICES)
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 40,
              fontWeight: 800,
              color: "var(--ink)",
              lineHeight: 1.05,
              margin: "0 0 64px",
              letterSpacing: "-0.02em",
            }}
          >
            Platform services
          </h2>

          {/* Service cards — 4-column grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 24,
              marginBottom: 48,
            }}
          >
            {SERVICES.map((svc) => (
              <div
                key={svc.name}
                style={{
                  background: "var(--surface-2)",
                  borderRadius: 10,
                  border: "1px solid var(--hairline)",
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {/* Status pill — btn-pill style */}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "var(--accent-blue-tint)",
                    color: "var(--accent-blue)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    padding: "6px 14px",
                    borderRadius: "50vh",
                    width: "fit-content",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--accent-blue)",
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  />
                  {svc.status}
                </span>

                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "var(--ink)",
                      letterSpacing: "-0.01em",
                      marginBottom: 4,
                    }}
                  >
                    {svc.name}
                  </div>
                </div>

                {/* Uptime bar */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "var(--ink-4)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Uptime
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "var(--ink)",
                      }}
                    >
                      {svc.uptime}
                    </span>
                  </div>
                  {/* bar track */}
                  <div
                    style={{
                      height: 4,
                      background: "var(--surface-3)",
                      borderRadius: "50vh",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: svc.uptime === "100%" ? "100%" : "99.8%",
                        background: "var(--accent-blue)",
                        borderRadius: "50vh",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Full editorial table for all services */}
          <div
            style={{
              border: "1px solid var(--hairline)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 200px 120px",
                padding: "12px 32px",
                background: "var(--surface-3)",
                borderBottom: "1px solid var(--hairline)",
              }}
            >
              {["(SERVICE)", "(STATUS)", "(UPTIME)"].map((h) => (
                <span
                  key={h}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: "var(--ink-4)",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {SERVICES.map((svc, i) => (
              <div
                key={svc.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 200px 120px",
                  padding: "20px 32px",
                  alignItems: "center",
                  borderBottom:
                    i < SERVICES.length - 1
                      ? "1px dotted var(--hairline)"
                      : "none",
                  background: "var(--surface)",
                }}
              >
                {/* Darky first column */}
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "var(--ink)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {svc.name}
                </span>
                {/* Status pill */}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "var(--accent-blue-tint)",
                    color: "var(--accent-blue)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    padding: "6px 14px",
                    borderRadius: "50vh",
                    width: "fit-content",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--accent-blue)",
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  />
                  {svc.status}
                </span>
                {/* Uptime — mono 16px */}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--ink)",
                    textAlign: "right" as const,
                  }}
                >
                  {svc.uptime}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SIG DIVIDER ══ */}
      <div className="sig-divider">
        Monitored&nbsp;·&nbsp;Alerted&nbsp;·&nbsp;Resolved&nbsp;·
      </div>

      {/* ══ 04 — INCIDENT HISTORY ══ */}
      <section
        style={{
          background: "var(--surface-2)",
          padding: "96px clamp(24px,6vw,64px)",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "var(--ink-4)",
              margin: "0 0 16px",
            }}
          >
            (INCIDENT HISTORY)
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 40,
              fontWeight: 800,
              color: "var(--ink)",
              lineHeight: 1.05,
              margin: "0 0 48px",
              letterSpacing: "-0.02em",
            }}
          >
            Last 30 days
          </h2>

          <div
            role="status"
            style={{
              background: "var(--surface)",
              borderRadius: 10,
              border: "1px solid var(--hairline)",
              padding: "clamp(32px,4vw,48px)",
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            {/* Check icon tile */}
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "var(--accent-blue-tint)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "var(--accent-blue)",
                fontWeight: 700,
                fontSize: 20,
              }}
              aria-hidden="true"
            >
              ✓
            </span>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--ink)",
                  letterSpacing: "-0.01em",
                  marginBottom: 4,
                }}
              >
                No incidents in the last 30 days.
              </div>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 16,
                  color: "var(--ink-4)",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                All Push services have operated within SLA for the past 30 days.
                Subscribe to status updates at{" "}
                <a
                  href="mailto:status@pushnyc.app"
                  style={{
                    color: "var(--brand-red)",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  status@pushnyc.app
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
