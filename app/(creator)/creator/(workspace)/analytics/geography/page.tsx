/* Geography detail — neighborhoods + per-tier peer benchmark + opportunity */

"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import "../analytics.css";
import { NEIGHBORHOODS, fmtUsd, fmtNum } from "../_data/mock";

export default function GeographyDetailPage() {
  const max = Math.max(...NEIGHBORHOODS.map((n) => n.visits));
  const totalVisits = NEIGHBORHOODS.reduce((s, n) => s + n.visits, 0);
  const home = NEIGHBORHOODS.find((n) => n.isHome)!;
  // Best-paying neighborhood I'm not in much
  const opp = [...NEIGHBORHOODS]
    .filter((n) => !n.isHome)
    .sort((a, b) => b.peerMedianPerScan - a.peerMedianPerScan)[0];

  return (
    <div className="an2 an2-detail">
      <div style={{ paddingTop: 32 }}>
        <Link href="/creator/analytics" className="hub-back">
          <ArrowLeft size={14} strokeWidth={2.25} />
          Analytics
        </Link>

        <header className="an2-detail__head">
          <div>
            <p className="an2-eyebrow">Geography · 30-day window</p>
            <h1 className="an2-detail__title">Neighborhoods</h1>
            <p className="an2-detail__sub">
              Where your fans live, and where they pay best. The Williamsburg
              pilot is your home — expansion to neighboring NYC zones is the
              canonical Phase 0 → Phase 1 transition per v6-streamlined.
              Opportunity surfaces compare your $/scan to peer Operators in each
              neighborhood.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 64,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
                margin: 0,
                color: "var(--ink)",
              }}
            >
              {NEIGHBORHOODS.length}
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-4)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontWeight: 700,
                marginTop: 6,
              }}
            >
              active neighborhoods
            </p>
          </div>
        </header>

        {/* Hero opportunity callout */}
        <section
          style={{
            marginBottom: 32,
            padding: 32,
            borderRadius: 14,
            background:
              "linear-gradient(135deg, var(--snow), var(--surface-2))",
            boxShadow: "var(--shadow-1)",
          }}
        >
          <p className="an2-card__eyebrow">Top opportunity</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 32,
              alignItems: "end",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 40,
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  color: "var(--ink)",
                  margin: 0,
                }}
              >
                {opp.name}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  color: "var(--ink-3)",
                  lineHeight: 1.6,
                  marginTop: 12,
                  maxWidth: "60ch",
                }}
              >
                Peer Operators here earn{" "}
                <strong
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--ink)",
                    fontWeight: 700,
                  }}
                >
                  {fmtUsd(opp.peerMedianPerScan, { cents: true })}/scan
                </strong>{" "}
                — that&apos;s{" "}
                <strong
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--brand-red)",
                    fontWeight: 800,
                  }}
                >
                  {Math.round((opp.peerMedianPerScan / home.perScan) * 10) / 10}
                  ×
                </strong>{" "}
                your home rate of {fmtUsd(home.perScan, { cents: true })}.{" "}
                {opp.openCampaigns} open campaigns this week.
              </p>
            </div>
            <Link
              href="/creator/discover"
              style={{
                display: "inline-flex",
                padding: "14px 24px",
                background: "var(--brand-red)",
                color: "var(--snow)",
                borderRadius: 10,
                textDecoration: "none",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                transition: "transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              Browse {opp.name} →
            </Link>
          </div>
        </section>

        <div className="an2-grid-2">
          {/* Volume bars */}
          <section className="an2-card">
            <p className="an2-card__eyebrow">By visit volume</p>
            <h2 className="an2-card__title">Where your fans scan</h2>
            <div>
              {NEIGHBORHOODS.map((n) => {
                const pct = (n.visits / max) * 100;
                return (
                  <div
                    key={n.name}
                    style={{
                      padding: "14px 0",
                      borderBottom: "1px dotted var(--mist)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: 6,
                      }}
                    >
                      <span
                        className={"an2-geo__name" + (n.isHome ? " home" : "")}
                        style={{ fontSize: 15 }}
                      >
                        {n.name}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: 14,
                          color: "var(--ink)",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {fmtNum(n.visits)}
                      </span>
                    </div>
                    <div className="an2-geo__track">
                      <div
                        className="an2-geo__fill"
                        style={{
                          width: `${pct}%`,
                          background: n.isHome ? "var(--ink)" : "var(--ink-4)",
                        }}
                      />
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color: "var(--ink-4)",
                        margin: "6px 0 0",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {Math.round((n.visits / totalVisits) * 100)}% of your
                      visits
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Peer benchmark */}
          <section className="an2-card">
            <p className="an2-card__eyebrow">Peer benchmark</p>
            <h2 className="an2-card__title">$/scan vs other Operators</h2>
            <div>
              {NEIGHBORHOODS.map((n) => {
                const ratio = n.perScan / n.peerMedianPerScan;
                const youAhead = ratio >= 1;
                return (
                  <div
                    key={n.name}
                    style={{
                      padding: "16px 0",
                      borderBottom: "1px dotted var(--mist)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        className={"an2-geo__name" + (n.isHome ? " home" : "")}
                        style={{ fontSize: 14 }}
                      >
                        {n.name}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          fontWeight: 700,
                          color: youAhead
                            ? "var(--accent-blue)"
                            : "var(--brand-red)",
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                        }}
                      >
                        {youAhead
                          ? `+${Math.round((ratio - 1) * 100)}%`
                          : `−${Math.round((1 - ratio) * 100)}%`}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 11,
                            color: "var(--ink-4)",
                            margin: 0,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            fontWeight: 700,
                          }}
                        >
                          You
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 18,
                            fontWeight: 800,
                            color: "var(--ink)",
                            margin: 0,
                            letterSpacing: "-0.015em",
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {fmtUsd(n.perScan, { cents: true })}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 11,
                            color: "var(--ink-4)",
                            margin: 0,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            fontWeight: 700,
                          }}
                        >
                          Peer median
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 18,
                            fontWeight: 800,
                            color: "var(--ink-3)",
                            margin: 0,
                            letterSpacing: "-0.015em",
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {fmtUsd(n.peerMedianPerScan, { cents: true })}
                        </p>
                      </div>
                    </div>
                    {n.openCampaigns > 0 && (
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          color: "var(--ink-4)",
                          margin: "8px 0 0",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {n.openCampaigns} open campaign
                        {n.openCampaigns > 1 ? "s" : ""} this week
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <p className="an2-div">
          <span>here · then there · then everywhere.</span>
        </p>
      </div>
    </div>
  );
}
