import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Docs — Push",
  description:
    "Build on Push. Programmatic access to attribution, campaigns, and creator stats via the Push v2 REST API.",
};

const ENDPOINTS = [
  {
    method: "POST",
    path: "/api/attribution/verify",
    desc: "Verify a QR scan and run oracle validation. Returns attribution decision with confidence score.",
  },
  {
    method: "GET",
    path: "/api/campaigns",
    desc: "List all campaigns for the authenticated merchant. Supports status and date filters.",
  },
  {
    method: "POST",
    path: "/api/campaigns",
    desc: "Create a new campaign in draft status. Must be explicitly activated before creators can apply.",
  },
  {
    method: "GET",
    path: "/api/creators/{id}/stats",
    desc: "Retrieve verified visit stats, earnings history, and tier information for a creator.",
  },
  {
    method: "GET",
    path: "/api/merchant/visits",
    desc: "Merchant visit log — paginated, filterable by campaign, creator, and date range.",
  },
  {
    method: "PATCH",
    path: "/api/campaigns/{id}",
    desc: "Update an existing campaign budget, dates, or creator allowlist. Draft and active campaigns only.",
  },
] as const;

const CODE_EXAMPLE = `// Verify a QR scan
const res = await fetch("https://api.pushnyc.app/api/attribution/verify", {
  method: "POST",
  headers: {
    "Authorization": "Bearer sk_live_YOUR_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    qr_token: "qr_01HX...",
    merchant_id: "mer_01HX...",
    receipt_id: "rcpt_9823",
  }),
});

const { verified, confidence, visit_id } = await res.json();
// verified: true
// confidence: 0.98
// visit_id: "vis_01HX..."`;

/* Method badge colors — only allowed color tokens, no hardcoded hex */
const METHOD_STYLE: Record<string, { bg: string; text: string }> = {
  GET: { bg: "var(--accent-blue-tint)", text: "var(--accent-blue)" },
  POST: { bg: "var(--brand-red-tint)", text: "var(--brand-red)" },
  PATCH: { bg: "var(--champagne-tint)", text: "var(--champagne-deep)" },
  DELETE: { bg: "var(--brand-red-tint)", text: "var(--brand-red)" },
};

export default function ApiDocsPage() {
  return (
    <>
      {/* ══ 01 — HERO (dark ink, code watermark, Darky display bottom-left) ══ */}
      <section
        style={{
          background: "var(--ink)",
          color: "var(--snow)",
          padding: "96px clamp(24px,6vw,64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* decorative code watermark — aria-hidden */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "clamp(24px,6vw,96px)",
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(11px,1vw,13px)",
            color: "rgba(255,255,255,0.04)",
            lineHeight: 1.75,
            whiteSpace: "pre",
            pointerEvents: "none",
            userSelect: "none",
            maxWidth: 480,
          }}
        >
          {CODE_EXAMPLE}
        </div>

        <div style={{ maxWidth: 1140, margin: "0 auto", position: "relative" }}>
          {/* Eyebrow + v2 badge */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap" as const,
              gap: 24,
              marginBottom: 32,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: "rgba(255,255,255,0.45)",
                margin: 0,
              }}
            >
              (DEVELOPERS)
            </p>
            {/* v2 API badge */}
            <div
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                padding: "8px 20px",
                display: "flex",
                alignItems: "center",
                gap: 8,
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
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                v2 API
              </span>
            </div>
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
            Build
            <br />
            on Push.
          </h1>

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 18,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.55,
              maxWidth: 560,
              margin: 0,
            }}
          >
            Programmatic access to QR attribution, campaign management, and
            creator stats. Build on the same infrastructure powering local
            commerce campaigns across NYC.
          </p>
        </div>
      </section>

      {/* ══ SIG DIVIDER ══ */}
      <div className="sig-divider">
        Request&nbsp;·&nbsp;Verify&nbsp;·&nbsp;Attribute&nbsp;·
      </div>

      {/* ══ 02 — ENDPOINTS EDITORIAL TABLE ══ */}
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
            (ENDPOINTS)
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
            API reference.
          </h2>

          {/* Editorial Table — Cinema-Selects style */}
          <div
            style={{
              border: "1px solid var(--hairline)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            {/* Table header — mono 12px 700 uppercase parenthetical */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "100px 280px 1fr",
                padding: "12px 32px",
                background: "var(--surface-3)",
                borderBottom: "1px solid var(--hairline)",
              }}
            >
              {["(METHOD)", "(ENDPOINT)", "(DESCRIPTION)"].map((h) => (
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

            {ENDPOINTS.map((ep, i) => {
              const mc = METHOD_STYLE[ep.method] ?? {
                bg: "var(--surface-3)",
                text: "var(--ink-3)",
              };
              return (
                <div
                  key={ep.path}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px 280px 1fr",
                    padding: "20px 32px",
                    alignItems: "center",
                    gap: 16,
                    borderBottom:
                      i < ENDPOINTS.length - 1
                        ? "1px dotted var(--hairline)"
                        : "none",
                    background: "var(--surface)",
                  }}
                >
                  {/* Method badge — 8px radius btn style */}
                  <span
                    style={{
                      display: "inline-block",
                      background: mc.bg,
                      color: mc.text,
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      padding: "4px 10px",
                      borderRadius: 8,
                      width: "fit-content",
                    }}
                  >
                    {ep.method}
                  </span>
                  {/* Endpoint path — Darky first column (20px) */}
                  <code
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--ink)",
                      background: "none",
                      wordBreak: "break-all" as const,
                    }}
                  >
                    {ep.path}
                  </code>
                  {/* Description — mono 16px */}
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 16,
                      color: "var(--ink-3)",
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {ep.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ 03 — AUTHENTICATION (candy panel) ══ */}
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
              margin: "0 0 32px",
            }}
          >
            (AUTHENTICATION)
          </p>

          {/* Candy Panel — 28px radius, 96px padding, butter bg */}
          <div
            style={{
              background: "var(--panel-butter)",
              borderRadius: 28,
              padding: 96,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "clamp(32px,5vw,64px)",
                alignItems: "start",
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 40,
                    fontWeight: 800,
                    color: "var(--ink)",
                    lineHeight: 1.05,
                    margin: "0 0 24px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Bearer token.
                  <br />
                  That&apos;s it.
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 18,
                    color: "var(--ink-3)",
                    lineHeight: 1.55,
                    margin: "0 0 24px",
                  }}
                >
                  All requests use HTTP Bearer token authentication. Get your
                  API key from{" "}
                  <Link
                    href="/merchant/settings"
                    style={{
                      color: "var(--brand-red)",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    Merchant Settings &rarr; API Keys
                  </Link>
                  . Keys are prefixed{" "}
                  <code
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 14,
                      background: "var(--surface-3)",
                      padding: "2px 6px",
                      borderRadius: 4,
                    }}
                  >
                    sk_live_
                  </code>{" "}
                  for production.
                </p>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {/* Token format — char bg code block */}
                <div
                  style={{
                    background: "var(--char)",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "12px 24px",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {[
                      "var(--brand-red)",
                      "rgba(255,255,255,0.2)",
                      "rgba(255,255,255,0.2)",
                    ].map((c, i) => (
                      <span
                        key={i}
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: c,
                          flexShrink: 0,
                        }}
                        aria-hidden="true"
                      />
                    ))}
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "rgba(255,255,255,0.3)",
                        marginLeft: 8,
                        letterSpacing: "0.06em",
                      }}
                    >
                      (TOKEN FORMAT)
                    </span>
                  </div>
                  <div style={{ padding: "20px 24px" }}>
                    <code
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 14,
                        color: "rgba(255,255,255,0.8)",
                        display: "block",
                        lineHeight: 1.6,
                      }}
                    >
                      Authorization: Bearer sk_live_xxxxxxxxxxxx
                    </code>
                  </div>
                </div>

                {/* Rate limits */}
                <div
                  style={{
                    background: "var(--surface)",
                    borderRadius: 10,
                    border: "1px solid var(--hairline)",
                    padding: "20px 24px",
                  }}
                >
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
                    (RATE LIMITS)
                  </p>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {[
                      { plan: "Essentials", limit: "120 req/min" },
                      { plan: "Pro", limit: "600 req/min" },
                      { plan: "Advanced", limit: "1,200 req/min" },
                    ].map((r, ri, arr) => (
                      <div
                        key={r.plan}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingBottom: ri < arr.length - 1 ? 8 : 0,
                          borderBottom:
                            ri < arr.length - 1
                              ? "1px solid var(--hairline)"
                              : "none",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 14,
                            color: "var(--ink-4)",
                          }}
                        >
                          {r.plan}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 14,
                            fontWeight: 700,
                            color: "var(--ink)",
                          }}
                        >
                          {r.limit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 04 — CODE EXAMPLE (dark char section) ══ */}
      <section
        style={{
          background: "var(--graphite)",
          padding: "96px clamp(24px,6vw,64px)",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "clamp(40px,6vw,80px)",
              alignItems: "center",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  color: "rgba(255,255,255,0.4)",
                  margin: "0 0 24px",
                }}
              >
                (QUICK START)
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 40,
                  fontWeight: 800,
                  color: "var(--snow)",
                  lineHeight: 1.05,
                  margin: "0 0 16px",
                  letterSpacing: "-0.02em",
                }}
              >
                Your first API call.
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 18,
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                Get your key from Merchant Settings, paste it in, and you have a
                live attribution verification response in seconds.
              </p>
            </div>

            {/* Code block — char bg, mono 14px, 10px radius, copy btn */}
            <div
              style={{
                background: "var(--char)",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.06)",
                overflow: "hidden",
              }}
            >
              {/* Code header bar */}
              <div
                style={{
                  padding: "12px 24px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {[
                    "var(--brand-red)",
                    "rgba(255,255,255,0.15)",
                    "rgba(255,255,255,0.15)",
                  ].map((c, i) => (
                    <span
                      key={i}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: c,
                        flexShrink: 0,
                      }}
                      aria-hidden="true"
                    />
                  ))}
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.3)",
                      marginLeft: 8,
                      letterSpacing: "0.06em",
                    }}
                  >
                    javascript
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase" as const,
                    color: "rgba(255,255,255,0.3)",
                    cursor: "pointer",
                  }}
                >
                  Copy
                </span>
              </div>

              {/* Code content */}
              <pre
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(12px,1.1vw,14px)",
                  color: "rgba(255,255,255,0.75)",
                  lineHeight: 1.75,
                  margin: 0,
                  padding: "clamp(24px,3vw,32px)",
                  overflowX: "auto",
                  whiteSpace: "pre",
                }}
              >
                {CODE_EXAMPLE}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SIG DIVIDER ══ */}
      <div className="sig-divider">
        Integrate&nbsp;·&nbsp;Attribute&nbsp;·&nbsp;Grow&nbsp;·
      </div>

      {/* ══ 05 — TICKET CTA ══ */}
      <section
        style={{
          background: "var(--surface)",
          padding: "96px clamp(24px,6vw,64px)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "var(--ga-orange)",
            borderRadius: 10,
            padding: "64px 96px",
            maxWidth: 640,
            width: "100%",
            textAlign: "center" as const,
            position: "relative",
            overflow: "hidden",
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

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.55)",
              margin: "0 0 24px",
            }}
          >
            (API ACCESS)
          </p>
          <h2
            style={{
              fontFamily: "var(--font-hero)",
              fontStyle: "italic",
              fontSize: "clamp(40px,5vw,56px)",
              fontWeight: 400,
              color: "var(--snow)",
              lineHeight: 1.0,
              margin: "0 0 32px",
              letterSpacing: "-0.02em",
            }}
          >
            Get API access.
          </h2>
          <Link href="/merchant/settings" className="btn-ink click-shift">
            Generate my API key
          </Link>
        </div>
      </section>
    </>
  );
}
