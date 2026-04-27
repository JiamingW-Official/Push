import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal · Push",
  description:
    "Plain-language policies for merchants, creators, and visitors. Push is a Public Benefit Corporation committed to privacy, transparency, and user rights.",
};

const DOCS = [
  {
    href: "/legal/terms",
    eyebrow: "(BINDING AGREEMENT)",
    icon: "§",
    title: "Terms of Service",
    desc: "Rules of the platform for merchants, creators, and visitors.",
    date: "Apr 15, 2026",
    version: "v5.0",
  },
  {
    href: "/legal/privacy",
    eyebrow: "(DATA PROTECTION)",
    icon: "⊙",
    title: "Privacy Policy",
    desc: "What we collect, why we collect it, and how you can opt out.",
    date: "Apr 15, 2026",
    version: "v3.1",
  },
  {
    href: "/legal/cookies",
    eyebrow: "(TRACKING)",
    icon: "◈",
    title: "Cookie Policy",
    desc: "Which cookies we set, their purpose, and your controls.",
    date: "Apr 15, 2026",
    version: "v2.2",
  },
  {
    href: "/legal/acceptable-use",
    eyebrow: "(CONDUCT)",
    icon: "◻",
    title: "Acceptable Use",
    desc: "What is and isn't permitted on the Push platform.",
    date: "Apr 15, 2026",
    version: "v2.0",
  },
  {
    href: "/legal/do-not-sell",
    eyebrow: "(CCPA · CPRA)",
    icon: "⊘",
    title: "Do Not Sell My Data",
    desc: "Exercise your CCPA rights and opt out of data sales.",
    date: "Apr 20, 2026",
    version: null,
  },
];

const PBC_ITEMS = [
  "FTC §255 disclosure on every creator post",
  "CCPA / GDPR DSAR processed within 45 days",
  "Consent tier system — you decide what we track",
  "No cross-site tracking or third-party data brokers",
];

export default function LegalHubPage() {
  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--char)",
          padding: "96px 64px 80px",
        }}
      >
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
              marginBottom: "16px",
              display: "block",
            }}
          >
            (LEGAL)
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 5vw, 72px)",
              fontWeight: 900,
              color: "var(--snow)",
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              margin: "0 0 24px",
            }}
          >
            The fine print,
            <br />
            made clear.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "18px",
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.6)",
              maxWidth: "480px",
              margin: 0,
            }}
          >
            Plain-language policies for merchants, creators, and visitors.
          </p>
        </div>
      </section>

      {/* ── DOCUMENT CARDS ───────────────────────────────────────── */}
      <section
        style={{
          background: "var(--surface)",
          padding: "80px 64px",
        }}
      >
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
              marginBottom: "32px",
              display: "block",
            }}
          >
            (DOCUMENTS)
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {DOCS.map((doc) => (
              <Link
                key={doc.href}
                href={doc.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0",
                  padding: "24px",
                  background: "var(--surface-2)",
                  border: "1px solid var(--mist)",
                  borderRadius: "10px",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "transform 150ms cubic-bezier(0.34,1.56,0.64,1)",
                }}
                className="doc-card-link"
              >
                {/* Icon tile */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: "var(--surface-3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "20px",
                      fontWeight: 900,
                      color: "var(--ink)",
                      lineHeight: 1,
                    }}
                    aria-hidden="true"
                  >
                    {doc.icon}
                  </span>
                </div>

                {/* Eyebrow */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--ink-4)",
                    margin: "0 0 8px",
                  }}
                >
                  {doc.eyebrow}
                </p>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "var(--ink)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    margin: "0 0 12px",
                  }}
                >
                  {doc.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "16px",
                    lineHeight: 1.55,
                    color: "var(--ink-3)",
                    margin: "0 0 24px",
                    flex: 1,
                  }}
                >
                  {doc.desc}
                </p>

                {/* Footer row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: "1px solid var(--hairline)",
                    paddingTop: "16px",
                    marginTop: "auto",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      color: "var(--ink-4)",
                    }}
                  >
                    {doc.date}
                    {doc.version && (
                      <span
                        style={{
                          marginLeft: "8px",
                          background: "var(--surface-3)",
                          borderRadius: "4px",
                          padding: "2px 6px",
                          fontSize: "11px",
                        }}
                      >
                        {doc.version}
                      </span>
                    )}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      color: "var(--brand-red)",
                    }}
                  >
                    Read &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIGNATURE DIVIDER ────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          padding: "0 64px",
          overflow: "hidden",
          background: "var(--surface)",
          borderTop: "1px solid var(--mist)",
          borderBottom: "1px solid var(--mist)",
        }}
      >
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-hero)",
            fontStyle: "italic",
            fontSize: "clamp(28px, 3vw, 40px)",
            color: "var(--ink-3)",
            padding: "24px 0",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Transparent by design &middot; Plain language always &middot; User
          rights protected &middot;
        </span>
      </div>

      {/* ── PBC MANIFESTO ────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--char)",
          padding: "96px 64px",
        }}
      >
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "64px",
              alignItems: "start",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                  marginBottom: "16px",
                  display: "block",
                }}
              >
                (PUBLIC BENEFIT)
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(32px, 4vw, 56px)",
                  fontWeight: 900,
                  color: "var(--snow)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  margin: 0,
                }}
              >
                Push is a Public Benefit Corporation.
              </h2>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "18px",
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: "24px",
                  margin: "0 0 24px",
                }}
              >
                We incorporated as a PBC so that our obligations to users,
                creators, and the communities we operate in are legally binding
                — not just marketing language. We do not sell your data to
                advertisers. We do not build shadow profiles. We do not monetize
                your attention.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "18px",
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.7)",
                  margin: "0 0 32px",
                }}
              >
                Our revenue comes exclusively from merchant subscriptions. Every
                privacy decision is weighed against that structure, not against
                ad revenue targets.
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {PBC_ITEMS.map((item) => (
                  <li
                    key={item}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "16px",
                      color: "rgba(255,255,255,0.8)",
                      display: "flex",
                      alignItems: "baseline",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--brand-red)",
                        fontWeight: 900,
                        flexShrink: 0,
                      }}
                      aria-hidden="true"
                    >
                      —
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--panel-butter)",
          padding: "80px 64px",
        }}
      >
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "48px",
            }}
          >
            {/* Legal questions */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--ink-3)",
                  marginBottom: "16px",
                  display: "block",
                }}
              >
                (LEGAL QUESTIONS)
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "var(--ink)",
                  letterSpacing: "-0.02em",
                  marginBottom: "12px",
                }}
              >
                Get in touch.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "18px",
                  lineHeight: 1.55,
                  color: "var(--ink-3)",
                  margin: 0,
                }}
              >
                For general legal questions, contract inquiries, or policy
                clarifications contact{" "}
                <a
                  href="mailto:legal@pushnyc.com"
                  style={{
                    color: "var(--brand-red)",
                    textDecoration: "none",
                    fontWeight: 600,
                    borderBottom: "1px solid var(--brand-red)",
                  }}
                >
                  legal@pushnyc.com
                </a>
                .
              </p>
            </div>

            {/* Privacy requests */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--ink-3)",
                  marginBottom: "16px",
                  display: "block",
                }}
              >
                (GDPR &middot; CCPA)
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "var(--ink)",
                  letterSpacing: "-0.02em",
                  marginBottom: "12px",
                }}
              >
                Privacy requests.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "18px",
                  lineHeight: 1.55,
                  color: "var(--ink-3)",
                  margin: 0,
                }}
              >
                To submit a Data Subject Access Request (DSAR), correct your
                data, or request deletion, email{" "}
                <a
                  href="mailto:privacy@pushnyc.com"
                  style={{
                    color: "var(--brand-red)",
                    textDecoration: "none",
                    fontWeight: 600,
                    borderBottom: "1px solid var(--brand-red)",
                  }}
                >
                  privacy@pushnyc.com
                </a>
                . We respond within 45 days.
              </p>
            </div>

            {/* Service of process */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--ink-3)",
                  marginBottom: "16px",
                  display: "block",
                }}
              >
                (REGISTERED AGENT)
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "var(--ink)",
                  letterSpacing: "-0.02em",
                  marginBottom: "12px",
                }}
              >
                Service of process.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "18px",
                  lineHeight: 1.55,
                  color: "var(--ink-3)",
                  margin: 0,
                }}
              >
                Push Technologies, Inc.
                <br />
                99 Scott Ave, Brooklyn, NY 11237
                <br />
                Attn: Legal Department
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .doc-card-link:hover {
          transform: translate(1px, 1px);
        }
        .doc-card-link:active {
          transform: translate(2px, 2px) scale(0.98);
        }
        @media (max-width: 960px) {
          section[style*="gridTemplateColumns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          section[style*="gridTemplateColumns: 1fr 1fr 1fr"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 640px) {
          section[style*="padding: 96px 64px"] {
            padding: 56px 24px !important;
          }
          section[style*="padding: 80px 64px"] {
            padding: 56px 24px !important;
          }
        }
      `}</style>
    </main>
  );
}
