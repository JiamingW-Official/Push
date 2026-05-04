import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Security | Push",
  description:
    "Your data. Locked tight. Push security architecture, data minimization policy, infrastructure stack, and responsible disclosure program.",
};

/* ── Data ──────────────────────────────────────────────────── */

const INFRA_CARDS = [
  {
    name: "Supabase (Postgres)",
    role: "Primary database",
    detail:
      "All production data encrypted at rest via AES-256. Row Level Security enforced on every table. Service-role key never exposed client-side.",
    tag: "AES-256 · RLS",
  },
  {
    name: "Vercel Edge",
    role: "Application layer",
    detail:
      "Global CDN, DDoS absorption, WAF and bot mitigation before requests reach the API. TLS 1.3 in transit end-to-end.",
    tag: "DDoS protected · TLS 1.3",
  },
  {
    name: "Stripe",
    role: "Payment processing",
    detail:
      "PCI-DSS Level 1 compliant. Push never stores, processes, or transmits raw card numbers. Stripe Connect holds creator earnings and merchant deposits.",
    tag: "PCI-DSS L1",
  },
];

const COLLECT_YES = [
  "Scan timestamp (Unix ms)",
  "GPS coordinates at scan",
  "Device fingerprint hash (SHA-256, not reversible)",
  "Payout information (routed through Stripe)",
];

const COLLECT_NO = [
  "Phone contacts or address book",
  "Camera roll or media library",
  "SMS or messaging content",
  "Off-platform browsing history",
  "Raw card numbers or banking credentials",
];

const SEVERITY_ROWS = [
  {
    sev: "Critical",
    example: "RCE, full DB access, mass PII exfiltration",
    sla: "4 hours",
    reward: "$2,500 – $10,000",
    color: "var(--brand-red)",
  },
  {
    sev: "High",
    example: "Auth bypass, IDOR on financial records, SSRF",
    sla: "24 hours",
    reward: "$500 – $2,500",
    color: "var(--champagne)",
  },
  {
    sev: "Medium",
    example: "Stored XSS, account takeover via CSRF",
    sla: "3 business days",
    reward: "$100 – $500",
    color: "var(--accent-blue)",
  },
  {
    sev: "Low",
    example: "Rate-limit bypass, non-critical info disclosure",
    sla: "7 business days",
    reward: "Acknowledgment",
    color: "var(--ink-4)",
  },
];

const SECURITY_PILLARS = [
  {
    num: "01",
    title: "Encryption at rest and in transit.",
    body: "AES-256 on all database rows. TLS 1.3 enforced end-to-end. No plaintext secrets anywhere in the stack.",
  },
  {
    num: "02",
    title: "Row Level Security everywhere.",
    body: "Every Supabase table carries RLS policies. Service-role keys never reach the client. Auth guards at every API boundary.",
  },
  {
    num: "03",
    title: "Data minimization by design.",
    body: "We collect scan timestamp, GPS coordinates, and a non-reversible device fingerprint hash. Nothing else. No identity, no contacts, no browsing history.",
  },
];

/* ── Page ──────────────────────────────────────────────────── */

export default function SecurityPage() {
  return (
    <main style={{ background: "var(--surface)", minHeight: "100vh" }}>
      {/* ═══ 01 — HERO (dark ink, bottom-left anchored) ═══ */}
      <section
        style={{
          background: "var(--ink)",
          color: "var(--snow)",
          padding: "96px clamp(24px,6vw,96px)",
        }}
        aria-labelledby="sec-hero-heading"
      >
        <div style={{ maxWidth: 1140, margin: "0 auto", width: "100%" }}>
          {/* eyebrow row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap" as const,
              gap: 16,
              marginBottom: 64,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: "rgba(255,255,255,0.45)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                padding: "6px 16px",
              }}
            >
              (SECURITY)
            </span>
            {/* SOC 2 badge */}
            <div style={{ textAlign: "right" as const }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(40px,5vw,72px)",
                  fontWeight: 700,
                  color: "var(--snow)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.02em",
                }}
              >
                SOC 2
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  color: "rgba(255,255,255,0.45)",
                  marginTop: 8,
                }}
              >
                COMPLIANT
              </div>
            </div>
          </div>

          {/* Darky Display H1 — bottom-left anchored */}
          <h1
            id="sec-hero-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(56px,8vw,128px)",
              fontWeight: 900,
              lineHeight: 0.9,
              color: "var(--snow)",
              margin: "0 0 48px",
              letterSpacing: "-0.035em",
            }}
          >
            Your data,
            <br />
            protected.
          </h1>

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 18,
              color: "rgba(255,255,255,0.5)",
              maxWidth: 560,
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            How we protect verified foot traffic data, creator PII, and merchant
            payment information — architecture, controls, and our obligations to
            every person on the platform.
          </p>
        </div>
      </section>

      {/* ═══ SIG DIVIDER ═══ */}
      <div className="sig-divider" aria-hidden="true">
        Encrypted · Monitored · Protected ·
      </div>

      {/* ═══ 02 — SECURITY PILLARS (surface-2, numbered editorial rows) ═══ */}
      <section
        style={{
          background: "var(--surface-2)",
          padding: "96px clamp(24px,6vw,96px)",
          borderBottom: "1px solid var(--hairline)",
        }}
        aria-labelledby="sec-pillars-heading"
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "var(--ink-4)",
              display: "block",
              marginBottom: 16,
            }}
          >
            (SECURITY PILLARS)
          </span>
          <h2
            id="sec-pillars-heading"
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
            How we protect your data.
          </h2>

          {/* Numbered editorial rows — 01 / 02 / 03 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderTop: "1px solid var(--hairline)",
            }}
          >
            {SECURITY_PILLARS.map((pillar) => (
              <div
                key={pillar.num}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr 2fr",
                  gap: "0 32px",
                  padding: "40px 0",
                  borderBottom: "1px solid var(--hairline)",
                  alignItems: "start",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 64,
                    fontWeight: 900,
                    color: "var(--hairline)",
                    lineHeight: 1.0,
                  }}
                >
                  {pillar.num}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 28,
                    fontWeight: 700,
                    color: "var(--ink)",
                    margin: "8px 0 0",
                    lineHeight: 1.15,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {pillar.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 18,
                    color: "var(--ink-3)",
                    lineHeight: 1.55,
                    margin: "8px 0 0",
                  }}
                >
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 03 — INFRASTRUCTURE (candy-panel butter) ═══ */}
      <section
        style={{
          background: "var(--panel-butter)",
          padding: "96px clamp(24px,6vw,96px)",
          borderBottom: "1px solid var(--hairline)",
        }}
        aria-labelledby="sec-infra-heading"
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "var(--ink-4)",
              display: "block",
              marginBottom: 16,
            }}
          >
            (INFRASTRUCTURE)
          </span>
          <h2
            id="sec-infra-heading"
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
            Built on enterprise-grade rails.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 24,
            }}
          >
            {INFRA_CARDS.map((card) => (
              <div
                key={card.name}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--hairline)",
                  borderRadius: 10,
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {/* tag eyebrow */}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: "var(--brand-red)",
                  }}
                >
                  {card.tag}
                </span>
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 28,
                      fontWeight: 700,
                      color: "var(--ink)",
                      margin: "0 0 4px",
                      lineHeight: 1.15,
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {card.name}
                  </h3>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase" as const,
                      color: "var(--ink-4)",
                    }}
                  >
                    {card.role}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 16,
                    color: "var(--ink-3)",
                    lineHeight: 1.55,
                    margin: 0,
                    flexGrow: 1,
                  }}
                >
                  {card.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 04 — DATA MINIMIZATION (panel-sky) ═══ */}
      <section
        style={{
          background: "var(--panel-sky)",
          padding: "96px clamp(24px,6vw,96px)",
          borderBottom: "1px solid var(--hairline)",
        }}
        aria-labelledby="sec-data-heading"
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "var(--ink-4)",
              display: "block",
              marginBottom: 16,
            }}
          >
            (DATA MINIMIZATION)
          </span>
          <h2
            id="sec-data-heading"
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
            We only collect what we need.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 32,
            }}
          >
            {/* We DO collect */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--hairline)",
                borderRadius: 10,
                padding: 32,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  color: "var(--accent-blue)",
                  display: "block",
                  marginBottom: 24,
                }}
              >
                (WE COLLECT)
              </span>
              <ol
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {COLLECT_YES.map((item, i) => (
                  <li
                    key={item}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "32px 1fr",
                      gap: 16,
                      alignItems: "start",
                      paddingBottom: 16,
                      borderBottom:
                        i < COLLECT_YES.length - 1
                          ? "1px solid var(--hairline)"
                          : "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "var(--accent-blue)",
                        paddingTop: 2,
                        letterSpacing: "0.04em",
                      }}
                    >
                      0{i + 1}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 16,
                        color: "var(--ink-3)",
                        lineHeight: 1.55,
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* We NEVER collect */}
            <div
              style={{
                background: "var(--ink)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10,
                padding: 32,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  color: "rgba(255,255,255,0.35)",
                  display: "block",
                  marginBottom: 24,
                }}
              >
                (NEVER COLLECT)
              </span>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {COLLECT_NO.map((item, i) => (
                  <li
                    key={item}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "24px 1fr",
                      gap: 16,
                      alignItems: "start",
                      paddingBottom: 16,
                      borderBottom:
                        i < COLLECT_NO.length - 1
                          ? "1px solid rgba(255,255,255,0.06)"
                          : "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 16,
                        fontWeight: 700,
                        color: "var(--brand-red)",
                        paddingTop: 1,
                      }}
                    >
                      ✕
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 16,
                        color: "rgba(255,255,255,0.45)",
                        lineHeight: 1.55,
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 05 — RESPONSIBLE DISCLOSURE (dark ink) ═══ */}
      <section
        style={{
          background: "var(--ink)",
          color: "var(--snow)",
          padding: "96px clamp(24px,6vw,96px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
        aria-labelledby="sec-disclosure-heading"
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(48px,6vw,96px)",
              alignItems: "start",
            }}
          >
            {/* Left — copy */}
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  color: "rgba(255,255,255,0.35)",
                  display: "block",
                  marginBottom: 16,
                }}
              >
                (RESPONSIBLE DISCLOSURE)
              </span>
              <h2
                id="sec-disclosure-heading"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 40,
                  fontWeight: 800,
                  color: "var(--snow)",
                  lineHeight: 1.05,
                  margin: "0 0 24px",
                  letterSpacing: "-0.02em",
                }}
              >
                Found a bug?
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 18,
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.55,
                  marginBottom: 32,
                }}
              >
                Email{" "}
                <a
                  href="mailto:security@push.nyc"
                  style={{
                    color: "var(--brand-red)",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  security@push.nyc
                </a>
                . We run responsible disclosure with a 90-day SLA. Confirmed
                high-severity reports get a thank-you credit on a future
                campaign. We do not pursue legal action against good-faith
                researchers.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 16,
                  color: "rgba(255,255,255,0.35)",
                  lineHeight: 1.55,
                }}
              >
                Bug bounty program active. Rewards scale with severity — see the
                severity matrix on the right. Out of scope: social engineering,
                physical attacks, denial of service, third-party service issues.
              </p>
            </div>

            {/* Right — severity editorial table */}
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  color: "rgba(255,255,255,0.35)",
                  display: "block",
                  marginBottom: 24,
                }}
              >
                (SEVERITY MATRIX)
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* header row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "96px 1fr 80px 120px",
                    gap: 16,
                    padding: "12px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {["(SEV)", "(EXAMPLE)", "(SLA)", "(REWARD)"].map((h) => (
                    <span
                      key={h}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase" as const,
                        color: "rgba(255,255,255,0.25)",
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>
                {SEVERITY_ROWS.map((row) => (
                  <div
                    key={row.sev}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "96px 1fr 80px 120px",
                      gap: 16,
                      padding: "20px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      alignItems: "start",
                    }}
                  >
                    {/* Darky first column */}
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 20,
                        fontWeight: 700,
                        color: row.color,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {row.sev}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 14,
                        color: "rgba(255,255,255,0.4)",
                        lineHeight: 1.55,
                      }}
                    >
                      {row.example}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 14,
                        color: "rgba(255,255,255,0.4)",
                        lineHeight: 1.55,
                      }}
                    >
                      {row.sla}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 14,
                        color: "var(--snow)",
                        fontWeight: 600,
                      }}
                    >
                      {row.reward}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 06 — TICKET CTA ═══ */}
      <section
        style={{
          background: "var(--surface-2)",
          padding: "96px clamp(24px,6vw,96px)",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div
            style={{
              background: "var(--ga-orange)",
              borderRadius: 10,
              padding: "64px 96px",
              position: "relative",
              overflow: "hidden",
              textAlign: "center" as const,
            }}
          >
            {/* grommets */}
            {[
              { top: "50%", left: 24, transform: "translateY(-50%)" },
              { top: "50%", right: 24, transform: "translateY(-50%)" },
            ].map((pos, i) => (
              <div
                key={i}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "var(--ink)",
                  ...pos,
                }}
              />
            ))}
            {/* perforation top */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                left: 48,
                right: 48,
                height: 0,
                borderTop: "2px dashed rgba(0,0,0,0.15)",
              }}
            />
            {/* perforation bottom */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: 0,
                left: 48,
                right: 48,
                height: 0,
                borderBottom: "2px dashed rgba(0,0,0,0.15)",
              }}
            />

            <h2
              style={{
                fontFamily: "var(--font-hero)",
                fontStyle: "italic",
                fontSize: "clamp(40px,5vw,56px)",
                color: "var(--snow)",
                margin: "0 0 32px",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Questions about security?
              <br />
              Contact us.
            </h2>
            <Link
              href="mailto:security@push.nyc"
              className="btn-ink click-shift"
            >
              security@push.nyc
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
