"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./creators.css";

/* ── Earnings Calculator data ─────────────────────────────── */
const TIER_CONVERSION_RATE: Record<string, { min: number; max: number }> = {
  seed: { min: 4, max: 6 },
  explorer: { min: 6, max: 10 },
  operator: { min: 9, max: 15 },
  proven: { min: 14, max: 22 },
  closer: { min: 20, max: 30 },
  partner: { min: 28, max: 42 },
};

const TIERS = [
  { id: "seed", label: "Seed" },
  { id: "explorer", label: "Explorer" },
  { id: "operator", label: "Operator" },
  { id: "proven", label: "Proven" },
  { id: "closer", label: "Closer" },
  { id: "partner", label: "Partner" },
];

/* ── Tier node data ───────────────────────────────────────── */
const TIER_NODES = [
  {
    id: "seed",
    name: "Seed",
    range: "1K–5K",
    earn: "$50–200/mo",
    detail:
      "No follower minimum. We measure engagement consistency over 90 days, not vanity numbers. Your first verified scans build the permanent record that drives every future rate.",
    unlock: "10 verified scans → Explorer review",
  },
  {
    id: "explorer",
    name: "Explorer",
    range: "5K–20K",
    earn: "$200–600/mo",
    detail:
      "Your audience converts. Brands start requesting you for specific neighborhoods. Scan rate and trust score both climb as your record proves itself.",
    unlock: "25 scans + 8% conversion rate → Operator",
  },
  {
    id: "operator",
    name: "Operator",
    range: "20K–50K",
    earn: "$600–1.5K/mo",
    detail:
      "You run campaigns like a business. Multiple concurrent deals, high weekly scan volume. Push's algorithm weights your reliability score heavily at this tier.",
    unlock: "50 scans/mo for 60 consecutive days → Proven",
  },
  {
    id: "proven",
    name: "Proven",
    range: "50K–150K",
    earn: "$1.5K–4K/mo",
    detail:
      "Your verified conversion history speaks louder than any follower count. Brands reference your record directly when selecting creators. You skip the generic brief.",
    unlock: "100 scans/mo + 60% merchant re-request rate → Closer",
  },
  {
    id: "closer",
    name: "Closer",
    range: "150K–500K",
    earn: "$4K–10K/mo",
    detail:
      "You bypass the apply queue. Merchants reach out directly. You co-create briefs, choose categories, and negotiate terms — campaign ownership shifts your way.",
    unlock: "200 scans/mo + 3 long-term merchant partnerships → Partner",
  },
  {
    id: "partner",
    name: "Partner",
    range: "500K+",
    earn: "$10K+/mo",
    detail:
      "Invitation only. You sit inside the campaign strategy layer, not just the execution layer. Equity-style revenue splits on flagship campaigns. First access to every new market.",
    unlock: "Invitation only · reviewed quarterly",
    isPartner: true,
  },
];

/* Tier background shades — progressively darker for sky panel */
const TIER_BG = [
  "rgba(255,255,255,0.55)",
  "rgba(255,255,255,0.46)",
  "rgba(255,255,255,0.37)",
  "rgba(255,255,255,0.26)",
  "rgba(255,255,255,0.14)",
  "rgba(10,10,10,0.08)",
];

/* ── Earnings Calculator component ───────────────────────── */
function EarningsCalculator() {
  const [tier, setTier] = useState("operator");
  const [campaigns, setCampaigns] = useState(2);
  const [visitsPerWeek, setVisitsPerWeek] = useState(8);

  const rate = TIER_CONVERSION_RATE[tier];
  const weeks = 4.33;
  const estMin = Math.round(campaigns * visitsPerWeek * rate.min * weeks);
  const estMax = Math.round(campaigns * visitsPerWeek * rate.max * weeks);

  return (
    <div className="calc-editorial">
      {/* Output number — visual hero of this panel */}
      <div className="calc-result" aria-live="polite">
        <span className="calc-result-prefix">$</span>
        <span className="calc-result-num">{estMin.toLocaleString()}</span>
        <span className="calc-result-dash">–</span>
        <span className="calc-result-prefix">$</span>
        <span className="calc-result-num">{estMax.toLocaleString()}</span>
        <span className="calc-result-unit">/ mo</span>
      </div>

      {/* Tier selector — btn-pill row */}
      <div
        role="group"
        aria-label="Creator tier"
        style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
      >
        {TIERS.map((t) => (
          <button
            key={t.id}
            type="button"
            className="btn-pill"
            aria-pressed={tier === t.id}
            onClick={() => setTier(t.id)}
            style={
              tier === t.id
                ? {
                    background: "var(--ink)",
                    color: "var(--snow)",
                    borderColor: "var(--ink)",
                  }
                : undefined
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div className="calc-sliders">
        <div className="calc-slider-row">
          <div className="calc-slider-label">
            <span>Campaigns / mo</span>
            <span className="calc-slider-val">{campaigns}</span>
          </div>
          <input
            type="range"
            min={1}
            max={12}
            value={campaigns}
            onChange={(e) => setCampaigns(Number(e.target.value))}
            className="calc-slider"
            aria-label="Active campaigns per month"
          />
          <div className="calc-slider-ticks">
            <span>1</span>
            <span>12</span>
          </div>
        </div>
        <div className="calc-slider-row">
          <div className="calc-slider-label">
            <span>Visits / wk</span>
            <span className="calc-slider-val">{visitsPerWeek}</span>
          </div>
          <input
            type="range"
            min={1}
            max={25}
            value={visitsPerWeek}
            onChange={(e) => setVisitsPerWeek(Number(e.target.value))}
            className="calc-slider"
            aria-label="Verified visits per week"
          />
          <div className="calc-slider-ticks">
            <span>1</span>
            <span>25</span>
          </div>
        </div>
      </div>

      <p className="calc-fine">
        ${rate.min}–${rate.max} per verified visit · paid Fridays via Stripe
        Connect
      </p>

      <Link
        href="/creator/signup"
        className="btn-primary click-shift"
        style={{ alignSelf: "flex-start" }}
      >
        Apply for the cohort →
      </Link>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function ForCreatorsPage() {
  return (
    <>
      <Header />

      {/* ════════════════════════════════════════════════════
          HERO — Full-Bleed Pattern A, border-radius: 0 (allowed)
          ════════════════════════════════════════════════════ */}
      <section
        aria-label="Hero"
        style={{
          position: "relative",
          overflow: "hidden",
          height: "clamp(560px,80vh,880px)",
          borderRadius: 0,
          background: `
            linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.60) 100%),
            radial-gradient(ellipse 100% 80% at 60% 20%, rgba(193,18,31,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 80% 100% at 10% 90%, rgba(30,95,173,0.20) 0%, transparent 50%),
            linear-gradient(160deg, #1c1a18 0%, #2e2b27 50%, #1a1816 100%)
          `,
        }}
      >
        {/* Right-top peek tile — hidden on mobile */}
        <div
          className="lg-surface--dark"
          style={{
            position: "absolute",
            top: 96,
            right: 64,
            padding: 32,
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            minWidth: 180,
          }}
          // Hide below 768px via inline media — CSS class handles it
          aria-hidden="true"
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px,5vw,72px)",
              fontWeight: 700,
              lineHeight: 1,
              color: "var(--snow)",
            }}
          >
            87%
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "rgba(255,255,255,0.75)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontWeight: 600,
            }}
          >
            Creator retention
          </div>
        </div>

        {/* Bottom-left copy block — v11 corner-anchored */}
        <div
          style={{
            position: "absolute",
            bottom: "clamp(56px,8vw,96px)",
            left: "clamp(24px,5vw,64px)",
            maxWidth: 700,
          }}
        >
          <span
            className="eyebrow"
            style={{
              color: "rgba(255,255,255,0.75)",
              display: "block",
              marginBottom: 16,
            }}
          >
            (FOR CREATORS)
          </span>

          <h1
            style={{
              fontFamily: "var(--font-hero)",
              fontStyle: "italic",
              fontSize: "clamp(64px,9vw,160px)",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              lineHeight: 0.88,
              color: "var(--snow)",
              margin: 0,
            }}
          >
            Perform.
            <br />
            Get paid.
          </h1>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 18,
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.72)",
              marginTop: 32,
              maxWidth: "60ch",
            }}
          >
            Turn your neighborhood presence into verified income.
          </p>

          {/* CTA cluster */}
          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 48,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Link href="/creator/signup" className="btn-primary click-shift">
              Apply Now
            </Link>
            <Link
              href="/how-it-works"
              className="btn-ghost click-shift"
              style={{
                background: "transparent",
                color: "var(--snow)",
                border: "1px solid rgba(255,255,255,0.6)",
              }}
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SIGNATURE DIVIDER
          ════════════════════════════════════════════════════ */}
      <div style={{ textAlign: "center" }}>
        <span className="sig-divider">Merchant · Creator · Customer ·</span>
      </div>

      {/* ════════════════════════════════════════════════════
          EARNINGS PANEL — Candy Butter
          ════════════════════════════════════════════════════ */}
      <section
        className="candy-panel"
        aria-label="Earnings calculator"
        id="calculator"
        style={{
          background: "var(--panel-butter)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Floating glass tile — top right */}
        <div
          className="lg-surface"
          style={{
            position: "absolute",
            top: 32,
            right: 32,
            padding: 32,
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            minWidth: 200,
          }}
          aria-hidden="true"
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px,3vw,40px)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "var(--ink)",
              lineHeight: 1,
            }}
          >
            Up to $4,200/mo
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--ink-3)",
            }}
          >
            Partner tier
          </div>
        </div>

        {/* Panel content */}
        <div style={{ maxWidth: "var(--content-width)", margin: "0 auto" }}>
          <span
            className="eyebrow"
            style={{ display: "block", marginBottom: 16 }}
          >
            (THE MATH)
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              color: "var(--ink)",
              margin: "0 0 48px",
            }}
          >
            What you actually earn.
          </h2>

          <EarningsCalculator />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          TIERS PANEL — Candy Sky + 6 tier cards
          ════════════════════════════════════════════════════ */}
      <section
        className="candy-panel"
        aria-label="Creator tiers"
        style={{ background: "var(--panel-sky)" }}
      >
        <div style={{ maxWidth: "var(--content-width)", margin: "0 auto" }}>
          <span
            className="eyebrow"
            style={{ display: "block", marginBottom: 16 }}
          >
            (6 TIERS)
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              color: "var(--ink)",
              margin: "0 0 48px",
            }}
          >
            Progress that
            <br />
            compounds.
          </h2>

          {/* 6-column grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 16,
            }}
            className="tiers-grid"
          >
            {TIER_NODES.map((t, i) => (
              <div
                key={t.id}
                className="click-shift"
                style={{
                  background: TIER_BG[i],
                  borderRadius: "var(--r-xl)",
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  cursor: "default",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 20,
                    fontWeight: 700,
                    color: t.isPartner ? "var(--champagne)" : "var(--ink)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink-3)",
                    lineHeight: 1.6,
                  }}
                >
                  {t.range} followers
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--ink)",
                    letterSpacing: "-0.02em",
                    marginTop: "auto",
                  }}
                >
                  {t.earn}
                </div>
              </div>
            ))}
          </div>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--ink-4)",
              letterSpacing: "0.04em",
              marginTop: 32,
            }}
          >
            Rate rises with verified-visit record. No cap. Paid every Friday.
          </p>
        </div>

        {/* Responsive override — inline style cannot do media queries;
            CSS class tiers-grid is defined in creators.css responsive section */}
      </section>

      {/* ════════════════════════════════════════════════════
          SIGNATURE DIVIDER
          ════════════════════════════════════════════════════ */}
      <div style={{ textAlign: "center" }}>
        <span className="sig-divider">Story · Scan · Pay ·</span>
      </div>

      {/* ════════════════════════════════════════════════════
          PHOTO GRID PANEL — 3-up Photo Cards
          ════════════════════════════════════════════════════ */}
      <section
        aria-label="Real campaigns"
        style={{
          background: "var(--surface)",
          padding: "96px clamp(24px,4vw,64px)",
        }}
      >
        <div style={{ maxWidth: "var(--content-width)", margin: "0 auto" }}>
          <span
            className="eyebrow"
            style={{ display: "block", marginBottom: 16 }}
          >
            (WHAT IT LOOKS LIKE)
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              color: "var(--ink)",
              margin: "0 0 48px",
            }}
          >
            Real campaigns.
            <br />
            Real neighborhoods.
          </h2>

          {/* 3-up Photo Card grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 24,
            }}
            className="photo-grid"
          >
            {/* Card 1 */}
            <div
              className="click-shift"
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "var(--r-md)",
                aspectRatio: "4/5",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(160deg, #2c2a26 0%, #4a2020 60%, #1a1816 100%)",
                }}
              />
              <div
                className="lg-surface--badge"
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  padding: "8px 14px",
                  fontSize: 12,
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Active
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: "auto 0 0 0",
                  height: "35%",
                  background:
                    "linear-gradient(to bottom, transparent, rgba(0,0,0,0.78))",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 24,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "var(--snow)",
                  }}
                >
                  Williamsburg Market
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "rgba(255,255,255,0.85)",
                    marginTop: 8,
                  }}
                >
                  Food &amp; Bev · 24 scans
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div
              className="click-shift"
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "var(--r-md)",
                aspectRatio: "4/5",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(160deg, #1a2c26 0%, #0d2840 60%, #1a1816 100%)",
                }}
              />
              <div
                className="lg-surface--badge"
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  padding: "8px 14px",
                  fontSize: 12,
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Verified
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: "auto 0 0 0",
                  height: "35%",
                  background:
                    "linear-gradient(to bottom, transparent, rgba(0,0,0,0.78))",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 24,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "var(--snow)",
                  }}
                >
                  Brooklyn Coffee
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "rgba(255,255,255,0.85)",
                    marginTop: 8,
                  }}
                >
                  Beauty · 18 scans
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div
              className="click-shift"
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "var(--r-md)",
                aspectRatio: "4/5",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(160deg, #2a1c10 0%, #3a2a0a 60%, #1a1816 100%)",
                }}
              />
              <div
                className="lg-surface--badge"
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  padding: "8px 14px",
                  fontSize: 12,
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Trending
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: "auto 0 0 0",
                  height: "35%",
                  background:
                    "linear-gradient(to bottom, transparent, rgba(0,0,0,0.78))",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 24,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "var(--snow)",
                  }}
                >
                  Park Slope Kitchen
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: "rgba(255,255,255,0.85)",
                    marginTop: 8,
                  }}
                >
                  Dining · 31 scans
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          TICKET PANEL — GA Orange CTA
          ════════════════════════════════════════════════════ */}
      <section
        className="ticket-panel"
        aria-label="Apply CTA"
        style={{
          margin: "0 clamp(24px,4vw,64px)",
          position: "relative",
        }}
      >
        {/* Four grommet circles — corner anchored */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "var(--ink)",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "var(--ink)",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "var(--ink)",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 24,
            right: 24,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "var(--ink)",
          }}
        />

        {/* Centered content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 24,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-hero)",
              fontStyle: "italic",
              fontSize: "clamp(40px,5vw,56px)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            Ready to
            <br />
            start scanning?
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 16,
              lineHeight: 1.65,
              color: "var(--ink)",
              maxWidth: 480,
              margin: 0,
            }}
          >
            Applications reviewed weekly. NYC creators only.
          </p>

          <Link href="/creator/signup" className="btn-ink click-shift">
            Apply Now
          </Link>
        </div>
      </section>

      {/* Spacer below ticket panel */}
      <div style={{ height: 64 }} aria-hidden="true" />

      <Footer />

      {/* Responsive overrides — tiers grid + photo grid + peek tile */}
      <style>{`
        @media (max-width: 1024px) {
          .tiers-grid  { grid-template-columns: repeat(3, 1fr) !important; }
          .photo-grid  { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 767px) {
          .tiers-grid  { grid-template-columns: repeat(2, 1fr) !important; }
          .photo-grid  { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
