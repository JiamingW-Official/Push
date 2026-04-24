"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DemoStats {
  merchants: number;
  creators: number;
  loyaltyCards: number;
  weeklyReports: number;
}

export default function HomePage() {
  const [stats, setStats] = useState<DemoStats>({
    merchants: 0,
    creators: 0,
    loyaltyCards: 0,
    weeklyReports: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        merchants: 5,
        creators: 10,
        loyaltyCards: 15,
        weeklyReports: 10,
      });
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  type CardVariant = "ink" | "champagne" | "premium" | "glass";
  const navigationCards: Array<{
    href: string;
    title: string;
    num: string;
    eyebrow: string;
    kicker: string;
    description: string;
    variant: CardVariant;
    span: string;
  }> = [
    {
      href: "/creator/dashboard",
      title: "Creator",
      num: "01",
      eyebrow: "For the people posting",
      kicker: "Daily driver",
      description:
        "Where a scan pays out by Friday. Campaigns, tier ladder, the room where the money comes from.",
      variant: "ink",
      span: "bento-8x2",
    },
    {
      href: "/customer/loyalty-card/demo-card-001",
      title: "Pass",
      num: "02",
      eyebrow: "For the people walking in",
      kicker: "Mobile wallet",
      description:
        "A punch card that remembers which coffee shops you actually like.",
      variant: "champagne",
      span: "bento-4x1",
    },
    {
      href: "/admin/dashboard",
      title: "Ops",
      num: "03",
      eyebrow: "Internal",
      kicker: "Founder chair",
      description:
        "The board. KPIs. Who's slipping, who's compounding. Oracle calls.",
      variant: "premium",
      span: "bento-4x1",
    },
    {
      href: "/merchant/dashboard",
      title: "Merchant",
      num: "04",
      eyebrow: "For the people opening the door",
      kicker: "Venue console",
      description:
        "Who walked in this week, where they came from, what it cost you. Poster generator, applicants, analytics.",
      variant: "premium",
      span: "bento-8x1",
    },
    {
      href: "/explore",
      title: "Map",
      num: "05",
      eyebrow: "Public",
      kicker: "Discovery",
      description: "The neighborhood.",
      variant: "glass",
      span: "bento-4x1",
    },
  ];

  const statBlocks = [
    {
      label: "Anchors signed",
      value: stats.merchants,
      tint: "var(--brand-red)",
      note: "lower manhattan",
    },
    {
      label: "Creators on roster",
      value: stats.creators,
      tint: "var(--champagne)",
      note: "community + studio",
    },
    {
      label: "Passes issued",
      value: stats.loyaltyCards,
      tint: "var(--cat-travel)",
      note: "week of apr 21",
    },
    {
      label: "Reports shipped",
      value: stats.weeklyReports,
      tint: "var(--cat-fitness)",
      note: "to merchants",
    },
  ];

  return (
    <main style={{ minHeight: "100vh" }}>
      {/* ═══════════════ 01 — HERO ═══════════════ */}
      <section
        className="bg-hero-ink grain-overlay bg-vignette"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "clamp(24px, 4vw, 64px)",
          overflow: "hidden",
        }}
      >
        {/* Top row: lux pill + eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            position: "relative",
            zIndex: 3,
          }}
        >
          <span className="pill-lux" style={{ color: "#fff" }}>
            Pilot 01 · SoHo / Tribeca / Chinatown
          </span>
          <span className="eyebrow-lux" style={{ color: "var(--champagne)" }}>
            Thu, Apr 24
          </span>
        </div>

        {/* Hero center: ghost/display weight contrast */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            zIndex: 3,
            maxWidth: "1180px",
            margin: "0 auto",
            width: "100%",
            paddingTop: "clamp(48px, 10vh, 120px)",
            paddingBottom: "clamp(48px, 10vh, 120px)",
          }}
        >
          <div
            className="section-marker"
            data-num="01"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Right now
          </div>

          {/* Massive Darky 900 headline + Darky 200 ghost */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(88px, 18vw, 280px)",
              fontWeight: 900,
              letterSpacing: "-0.08em",
              lineHeight: 0.85,
              color: "#fff",
              margin: 0,
            }}
          >
            Push
            <span
              aria-hidden="true"
              style={{
                color: "var(--brand-red)",
                marginLeft: "-0.05em",
              }}
            >
              .
            </span>
          </h1>
          <div
            className="display-ghost"
            style={{
              fontSize: "clamp(56px, 11vw, 172px)",
              color: "rgba(255,255,255,0.22)",
              marginTop: "-0.08em",
            }}
          >
            v5.2
          </div>

          <p
            style={{
              marginTop: "clamp(32px, 5vw, 64px)",
              maxWidth: 620,
              fontFamily: "var(--font-body)",
              fontSize: "clamp(15px, 1.15vw, 18px)",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.72)",
            }}
          >
            A creator posts about a spot they like. Someone who saw it walks in.
            The spot pays only when that visit is real. We do the verification.
          </p>
          <p
            style={{
              marginTop: "clamp(16px, 2vw, 24px)",
              maxWidth: 620,
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1vw, 15px)",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.44)",
            }}
          >
            Lower Manhattan pilot opens June&nbsp;22. Seven blocks.
            <br />
            Five anchored venues, ten creators on the roster, one operator
            (Jiaming) walking the doors.
          </p>

          {/* Stats row (weight-contrast numerals) */}
          <div
            style={{
              marginTop: "clamp(40px, 6vw, 80px)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "clamp(16px, 3vw, 48px)",
              borderTop: "1px solid rgba(255,255,255,0.12)",
              paddingTop: "clamp(24px, 3vw, 40px)",
              maxWidth: 960,
            }}
          >
            {statBlocks.map((s) => (
              <div
                key={s.label}
                style={{
                  paddingLeft: 18,
                  borderLeft: `2px solid ${s.tint}`,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(44px, 4.4vw, 64px)",
                    fontWeight: 200,
                    letterSpacing: "-0.05em",
                    lineHeight: 0.9,
                    color: "#fff",
                  }}
                >
                  {isLoading ? "—" : s.value}
                  <sup
                    style={{
                      color: s.tint,
                      fontWeight: 700,
                      fontSize: "0.22em",
                      verticalAlign: "super",
                      marginLeft: 4,
                    }}
                    aria-describedby="ftc-disclosure-text"
                  >
                    *
                  </sup>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.78)",
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontFamily: "var(--font-body)",
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    color: "rgba(255,255,255,0.38)",
                  }}
                >
                  {s.note}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: scroll indicator + category strip */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 32,
          }}
        >
          <div
            className="scroll-indicator"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Scroll
          </div>
          <div style={{ flex: 1, minWidth: 240, maxWidth: 480 }}>
            <div
              className="category-strip"
              aria-hidden="true"
              style={{ marginBottom: 12 }}
            >
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Food</span>
              <span>Stay</span>
              <span>Care</span>
              <span>Wear</span>
              <span>Sweat</span>
              <span>After-hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 02 — BENTO ═══════════════ */}
      <section
        style={{
          padding: "clamp(64px, 10vw, 128px) clamp(24px, 4vw, 64px)",
          maxWidth: "var(--content-width-wide)",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 24,
            marginBottom: "clamp(32px, 5vw, 64px)",
          }}
        >
          <div>
            <div className="section-marker" data-num="02">
              The four rooms
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5vw, 72px)",
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 0.95,
                color: "var(--ink)",
                margin: 0,
                maxWidth: 720,
              }}
            >
              Different people
              <br />
              <span className="display-ghost">open different doors.</span>
            </h2>
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--ink-4)",
              maxWidth: 320,
              lineHeight: 1.55,
            }}
          >
            Everyone is looking at the same
            <br />
            ledger. They just see the piece
            <br />
            that lets them do their job.
          </div>
        </div>

        <div className="bento-grid">
          {navigationCards.map((card) => {
            const isInk = card.variant === "ink";
            const isChampagne = card.variant === "champagne";
            const isGlass = card.variant === "glass";
            const cardClass =
              card.variant === "ink"
                ? "card-ink"
                : card.variant === "champagne"
                  ? "card-champagne"
                  : card.variant === "glass"
                    ? "card-glass"
                    : "card-premium";

            return (
              <Link
                key={card.href}
                href={card.href}
                className={`${cardClass} ${card.span}`}
                style={{
                  position: "relative",
                  textDecoration: "none",
                  padding: "clamp(20px, 2vw, 36px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: 220,
                  overflow: "hidden",
                  color: isInk ? "#fff" : "var(--ink)",
                }}
              >
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      marginBottom: 28,
                      gap: 16,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(28px, 2.4vw, 36px)",
                        fontWeight: 200,
                        letterSpacing: "-0.04em",
                        lineHeight: 1,
                        color: isInk
                          ? "rgba(255,255,255,0.28)"
                          : "var(--ink-5)",
                      }}
                    >
                      {card.num}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: isInk
                          ? "var(--champagne)"
                          : isChampagne
                            ? "var(--champagne-deep)"
                            : "var(--brand-red)",
                        textAlign: "right",
                      }}
                    >
                      {card.kicker}
                    </span>
                  </div>

                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 11,
                      lineHeight: 1.4,
                      color: isInk ? "rgba(255,255,255,0.52)" : "var(--ink-5)",
                      marginBottom: 14,
                      fontStyle: "italic",
                    }}
                  >
                    {card.eyebrow}
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(32px, 3.6vw, 56px)",
                      fontWeight: 800,
                      letterSpacing: "-0.05em",
                      lineHeight: 0.95,
                      margin: "0 0 18px",
                      color: isInk ? "#fff" : "var(--ink)",
                    }}
                  >
                    {card.title}
                    <span
                      aria-hidden="true"
                      style={{
                        color: isInk
                          ? "var(--brand-red)"
                          : isChampagne
                            ? "var(--champagne-deep)"
                            : "var(--brand-red)",
                      }}
                    >
                      .
                    </span>
                  </h3>

                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 14,
                      lineHeight: 1.55,
                      color: isInk ? "rgba(255,255,255,0.68)" : "var(--ink-4)",
                      maxWidth: 440,
                      margin: 0,
                    }}
                  >
                    {card.description}
                  </p>
                </div>

                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    marginTop: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    color: isInk ? "rgba(255,255,255,0.7)" : "var(--ink-4)",
                  }}
                >
                  <span>open&nbsp;→</span>
                  {isGlass && (
                    <span
                      className="pill-lux"
                      style={{ fontSize: 9, padding: "2px 8px" }}
                    >
                      public
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══════════════ 03 — DIVIDER + FTC ═══════════════ */}
      <section
        style={{
          padding: "0 clamp(24px, 4vw, 64px) clamp(48px, 8vw, 96px)",
          maxWidth: "var(--content-width-wide)",
          margin: "0 auto",
        }}
      >
        <div className="divider-lux">FTC 16 CFR § 255</div>

        <section
          className="compliance-disclosure"
          data-section="ftc-disclosure"
          role="note"
          aria-labelledby="ftc-disclosure-heading"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            lineHeight: 1.6,
            color: "var(--ink-4)",
            maxWidth: 880,
          }}
        >
          <h2
            id="ftc-disclosure-heading"
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              padding: 0,
              margin: "-1px",
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          >
            Illustrative numbers disclosure
          </h2>
          <p id="ftc-disclosure-text" style={{ margin: 0 }}>
            <span
              style={{
                color: "var(--brand-red)",
                fontWeight: 700,
                marginRight: 6,
              }}
              aria-hidden="true"
            >
              *
            </span>
            Illustrative example from pilot target. Actual outcomes vary by
            merchant category, local market density, creator tier, and
            seasonality. Push is a pre-pilot product; first verified pilot
            results available week of 2026-06-22 (Week 4 of Q2 2026). Creator
            compensation disclosed in full via{" "}
            <Link
              href="/legal/terms"
              style={{
                color: "var(--ink)",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              Creator Terms
            </Link>
            . FTC-compliant disclosure per 16 CFR § 255.
          </p>
        </section>
      </section>

      {/* ═══════════════ 04 — FOOTER ═══════════════ */}
      <footer
        style={{
          borderTop: "1px solid var(--hairline-2)",
          padding: "clamp(32px, 5vw, 56px) clamp(24px, 4vw, 64px)",
          maxWidth: "var(--content-width-wide)",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: "var(--ink)",
          }}
        >
          Push
          <span style={{ color: "var(--brand-red)" }}>.</span>
          <span
            className="display-ghost"
            style={{ marginLeft: 8, fontSize: 16 }}
          >
            v5.2
          </span>
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--ink-5)",
          }}
        >
          © 2026 Push Inc. · NYC
        </div>
      </footer>
    </main>
  );
}
