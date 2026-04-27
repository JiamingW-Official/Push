import Link from "next/link";
import type { Metadata } from "next";
import "../case-studies.css";

export const metadata: Metadata = {
  title: "The Smith Williamsburg — Case Study | Push",
  description:
    "How The Smith Williamsburg drove 347% more foot traffic with a 6-creator Push campaign. Every visit QR-verified at point of sale.",
};

export function generateStaticParams() {
  return [{ slug: "the-smith-williamsburg" }];
}

export default function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  void params;
  return (
    <>
      {/* ══════════════ 01 — HERO (dark) ══════════════ */}
      <section
        style={{
          background: "var(--ink)",
          color: "var(--snow)",
          padding:
            "clamp(80px,12vw,160px) clamp(24px,6vw,64px) clamp(64px,8vw,112px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto", position: "relative" }}>
          {/* Eyebrow + category + badge row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 24,
              marginBottom: 32,
            }}
          >
            <p className="eyebrow" style={{ color: "rgba(255,255,255,0.45)" }}>
              (DINING · WILLIAMSBURG)
            </p>
            {/* Result KPI badge — right */}
            <div className="lg-surface--badge" style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(48px,7vw,96px)",
                  fontWeight: 900,
                  color: "var(--snow)",
                  lineHeight: 0.88,
                }}
              >
                347%
              </div>
              <div
                className="eyebrow"
                style={{ color: "rgba(255,255,255,0.4)", marginTop: 8 }}
              >
                MORE FOOT TRAFFIC
              </div>
            </div>
          </div>

          {/* Merchant name — Darky H1, bottom-left anchored */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(48px,7vw,120px)",
              fontWeight: 900,
              color: "var(--snow)",
              lineHeight: 0.92,
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            The Smith
            <br />
            Williamsburg
          </h1>
        </div>
      </section>

      {/* ══════════════ SIG DIVIDER ══════════════ */}
      <div className="sig-divider">
        Challenge&nbsp;·&nbsp;Campaign&nbsp;·&nbsp;Result&nbsp;·
      </div>

      {/* ══════════════ 02 — CHALLENGE (candy-panel) ══════════════ */}
      <section
        style={{
          background: "var(--surface)",
          padding: "clamp(64px,8vw,112px) clamp(24px,6vw,64px)",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div
            className="candy-panel"
            style={{ padding: "clamp(40px,5vw,72px)" }}
          >
            <p
              className="eyebrow"
              style={{ color: "var(--ink-4)", marginBottom: 24 }}
            >
              (THE CHALLENGE)
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px,5.5vw,72px)",
                fontWeight: 900,
                color: "var(--ink)",
                lineHeight: 1.0,
                margin: "0 0 24px",
              }}
            >
              Williamsburg diners don&apos;t respond
              <br />
              to banner ads.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 18,
                color: "var(--ink-3)",
                lineHeight: 1.7,
                maxWidth: 680,
                margin: 0,
              }}
            >
              The Smith had strong word-of-mouth but no way to measure which
              channels drove real walk-ins. Paid social drove impressions, not
              receipts. The team needed a measurable, creator-native approach
              that tied directly to in-store conversions — not clicks, not
              reach, not story views.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════ 03 — SOLUTION (panel-sky) ══════════════ */}
      <section
        style={{
          background: "var(--panel-sky)",
          padding: "clamp(64px,8vw,112px) clamp(24px,6vw,64px)",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <p
            className="eyebrow"
            style={{ color: "var(--ink-4)", marginBottom: 32 }}
          >
            (HOW PUSH SOLVED IT)
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(40px,6vw,80px)",
              alignItems: "start",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(36px,5vw,64px)",
                  fontWeight: 900,
                  color: "var(--ink)",
                  lineHeight: 1.05,
                  margin: "0 0 24px",
                }}
              >
                Six creators.
                <br />
                One QR per creator.
                <br />
                Zero guesswork.
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 18,
                  color: "var(--ink-3)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Push matched The Smith with 6 micro-creators whose audiences
                skewed local Williamsburg and DUMBO. Each creator received a
                unique QR code. When a follower walked in and scanned, the visit
                was logged at the register with a receipt ID and passed through
                the Push oracle — timestamped, fraud-checked, and attributed to
                the exact creator who drove it.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {[
                {
                  num: "01",
                  title: "Creator matching",
                  body: "6 creators selected from the Push roster based on neighborhood affinity score and prior dining content performance.",
                },
                {
                  num: "02",
                  title: "Unique QR per creator",
                  body: "Each creator posted their unique QR link in stories and captions. Scans were cryptographically tied to that creator.",
                },
                {
                  num: "03",
                  title: "Oracle verification",
                  body: "Every scan passed a 3-second oracle window: receipt ID match, device fingerprint, replay-attack check.",
                },
                {
                  num: "04",
                  title: "Friday payouts",
                  body: "Creators received per-visit payouts every Friday. The Smith paid only for verified walk-ins.",
                },
              ].map((step) => (
                <div
                  key={step.num}
                  style={{
                    background: "var(--surface)",
                    borderRadius: 10,
                    padding: "24px 24px",
                    border: "1px solid var(--hairline)",
                    display: "flex",
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 11,
                      color: "var(--ink-4)",
                      letterSpacing: "0.1em",
                      flexShrink: 0,
                      paddingTop: 3,
                    }}
                  >
                    {step.num}
                  </span>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 16,
                        fontWeight: 700,
                        color: "var(--ink)",
                        marginBottom: 6,
                      }}
                    >
                      {step.title}
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        color: "var(--ink-3)",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ 04 — RESULTS (dark ink) ══════════════ */}
      <section
        style={{
          background: "var(--ink)",
          color: "var(--snow)",
          padding: "clamp(64px,8vw,112px) clamp(24px,6vw,64px)",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <p
            className="eyebrow"
            style={{ color: "rgba(255,255,255,0.4)", marginBottom: 32 }}
          >
            (THE RESULTS)
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px,4.5vw,56px)",
              fontWeight: 900,
              color: "var(--snow)",
              lineHeight: 1.05,
              margin: "0 0 clamp(48px,6vw,80px)",
            }}
          >
            Numbers that close campaigns.
          </h2>

          {/* 3 big KPIs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 1,
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {[
              {
                kpi: "1,847",
                unit: "verified visits",
                sub: "Over 8-week campaign window",
              },
              {
                kpi: "$7.20",
                unit: "avg cost per visit",
                sub: "Paid only on confirmed conversions",
              },
              {
                kpi: "347%",
                unit: "vs pre-campaign baseline",
                sub: "Month-over-month foot traffic lift",
              },
            ].map((k) => (
              <div
                key={k.kpi}
                style={{
                  padding: "clamp(32px,4vw,56px) 0",
                  paddingRight: 24,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(56px,8vw,112px)",
                    fontWeight: 900,
                    color: "var(--snow)",
                    lineHeight: 0.85,
                  }}
                >
                  {k.kpi}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.45)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginTop: 12,
                  }}
                >
                  {k.unit}
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.3)",
                    lineHeight: 1.5,
                    marginTop: 8,
                  }}
                >
                  {k.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ 05 — QUOTE (brand-red full-width) ══════════════ */}
      <section
        style={{
          background: "var(--brand-red)",
          padding: "clamp(64px,8vw,112px) clamp(24px,6vw,64px)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <blockquote
            style={{
              fontFamily: "var(--font-hero)",
              fontStyle: "italic",
              fontSize: "clamp(32px,4vw,56px)",
              fontWeight: 400,
              color: "var(--snow)",
              lineHeight: 1.15,
              margin: "0 0 32px",
              letterSpacing: "-0.02em",
            }}
          >
            &ldquo;Push didn&apos;t give us impressions. It gave us people
            standing in our dining room.&rdquo;
          </blockquote>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "rgba(255,255,255,0.65)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            General Manager, The Smith Williamsburg
          </p>
        </div>
      </section>

      {/* ══════════════ SIG DIVIDER ══════════════ */}
      <div className="sig-divider">
        Posted&nbsp;·&nbsp;Scanned&nbsp;·&nbsp;Verified&nbsp;·
      </div>

      {/* ══════════════ 06 — METHODOLOGY ══════════════ */}
      <section
        style={{
          background: "var(--surface-2)",
          padding: "clamp(64px,8vw,112px) clamp(24px,6vw,64px)",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <p
            className="eyebrow"
            style={{ color: "var(--ink-4)", marginBottom: 32 }}
          >
            (METHODOLOGY)
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "clamp(40px,6vw,80px)",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(32px,4vw,48px)",
                  fontWeight: 900,
                  color: "var(--ink)",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                How the campaign was structured.
              </h2>
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 18,
                color: "var(--ink-3)",
                lineHeight: 1.7,
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              <p style={{ margin: 0 }}>
                <strong
                  style={{
                    color: "var(--ink)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Campaign length:
                </strong>{" "}
                8 weeks, March–April 2026. 6 creators briefed simultaneously
                with the same CTA: &ldquo;show your followers where to eat in
                Williamsburg.&rdquo;
              </p>
              <p style={{ margin: 0 }}>
                <strong
                  style={{
                    color: "var(--ink)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Creator tiers:
                </strong>{" "}
                4 micro (10k–50k followers), 2 mid-tier (50k–150k). All creators
                had a neighborhood-affinity score above 0.7 for
                Williamsburg/DUMBO.
              </p>
              <p style={{ margin: 0 }}>
                <strong
                  style={{
                    color: "var(--ink)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Attribution:
                </strong>{" "}
                Each creator&apos;s unique QR was printed on a small table card
                and referenced in their posts. When a customer scanned at the
                host stand, Push logged a timestamped, receipt-matched visit
                event.
              </p>
              <p style={{ margin: 0 }}>
                <strong
                  style={{
                    color: "var(--ink)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Payout cadence:
                </strong>{" "}
                Creators received weekly payouts via Stripe Connect every
                Friday. Payouts were held for 72 hours post-scan pending oracle
                validation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ 07 — TICKET CTA ══════════════ */}
      <section
        style={{
          background: "var(--surface)",
          padding: "clamp(64px,8vw,112px) clamp(24px,6vw,64px)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          className="ticket-panel"
          style={{ maxWidth: 640, width: "100%", textAlign: "center" }}
        >
          <p
            className="eyebrow"
            style={{ color: "rgba(255,255,255,0.55)", marginBottom: 24 }}
          >
            (YOUR CAMPAIGN)
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
            }}
          >
            Start your Push campaign.
          </h2>
          <Link href="/for-merchants" className="btn-ink click-shift">
            Get started
          </Link>
        </div>
      </section>

      {/* Back link */}
      <div
        style={{
          background: "var(--surface)",
          padding: "0 clamp(24px,6vw,64px) clamp(40px,5vw,64px)",
          maxWidth: 1140,
          margin: "0 auto",
        }}
      >
        <Link
          href="/case-studies"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--ink-4)",
            textDecoration: "none",
            letterSpacing: "0.06em",
          }}
        >
          &larr; All case studies
        </Link>
      </div>
    </>
  );
}
