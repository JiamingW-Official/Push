import type { Metadata } from "next";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import StickySubNav from "@/components/layout/StickySubNav";
import "../landing.css";
import "./yc-2027.css";

/* ── Metadata — unlisted investor page (noindex) ────────────── */
export const metadata: Metadata = {
  title: "Push \u00B7 YC W2027 Thesis \u00B7 Unlisted",
  description:
    "Push \u2014 Vertical AI for Local Commerce. Investor thesis page for YC W2027. Shared via direct URL only.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

/* ── Content data (v5.1) ────────────────────────────────────── */
const THESIS_CLAIMS = [
  {
    num: "01",
    title: "Software Leverage Ratio (SLR) is the north-star",
    body: "Active campaigns per ops FTE. Local acquisition services shops cap at 3\u20135. Push targets 25 by Month 12. Every SLR point above 5 is the delta between services-company margins and software-company margins. This is the metric that underwrites the Vertical AI for Local Commerce thesis.",
  },
  {
    num: "02",
    title: "Vertical AI is the moat horizontal platforms can't copy",
    body: "ConversionOracle\u2122 trains on walk-in ground truth that only Push can generate \u2014 QR scans + Claude Vision receipt OCR + geo-match. Meta and Google cannot see who walked through the door. Horizontal creator platforms price flat and verify nothing. The narrow vertical + the receipt-level truth is the compounding data asset.",
  },
  {
    num: "03",
    title: "Williamsburg Coffee+ is proof, not TAM",
    body: "AOV $8\u201320. 60-day Pilot. Ten merchants filling the neighborhood cap at $4,200 launch cost. First merchant auto-flipped to Operator tier at 10 verified customers. The Neighborhood Playbook is the unit Push replicates \u2014 Coffee+ Template 0 ships into Greenpoint, Bushwick, LES, Nolita, and Astoria next.",
  },
];

// 25-point SLR trajectory (M0 -> M24), target line at 25
const SLR_TRAJECTORY: { month: number; actual: number; target: number }[] = [
  { month: 0, actual: 1.2, target: 5 },
  { month: 2, actual: 2.1, target: 5 },
  { month: 4, actual: 3.4, target: 8 },
  { month: 6, actual: 5.2, target: 12 },
  { month: 8, actual: 7.8, target: 15 },
  { month: 10, actual: 10.6, target: 18 },
  { month: 12, actual: 14.1, target: 25 },
  { month: 14, actual: 17.5, target: 25 },
  { month: 16, actual: 20.3, target: 25 },
  { month: 18, actual: 22.7, target: 25 },
  { month: 20, actual: 24.8, target: 25 },
  { month: 22, actual: 26.3, target: 25 },
  { month: 24, actual: 28.0, target: 25 },
];

const BEACHHEAD_MERCHANTS = [
  {
    name: "Sey Coffee",
    zip: "11211",
    signed: "2026-03-02",
    verified: 18,
    tier: "Operator",
  },
  {
    name: "Devoci\u00F3n",
    zip: "11249",
    signed: "2026-03-04",
    verified: 14,
    tier: "Operator",
  },
  {
    name: "Partners Coffee",
    zip: "11211",
    signed: "2026-03-08",
    verified: 11,
    tier: "Operator",
  },
  {
    name: "Variety Coffee",
    zip: "11211",
    signed: "2026-03-12",
    verified: 9,
    tier: "Pilot",
  },
  {
    name: "Toby's Estate",
    zip: "11249",
    signed: "2026-03-18",
    verified: 8,
    tier: "Pilot",
  },
];

const BEACHHEAD_KPIS = [
  { label: "Auto-verify rate", value: "88.4%" },
  { label: "LTV / CAC", value: "15.7x" },
  { label: "Pilot cost per merchant", value: "$0" },
  { label: "Week-4 SLR", value: "3.4" },
];

const TEAM_FIVE = [
  {
    initial: "J",
    name: "Jiaming",
    role: "Founder \u00B7 Strategy",
    note: "Sets the vertical AI thesis + closes Williamsburg Coffee+ merchants in person",
  },
  {
    initial: "Z",
    name: "Z",
    role: "Engineering \u00B7 ConversionOracle\u2122",
    note: "Three-layer verification pipeline + training loop",
  },
  {
    initial: "L",
    name: "Lucy",
    role: "Marketing \u00B7 Creator Relations",
    note: "Two-Segment Creator Economics T1\u2013T6 network",
  },
  {
    initial: "P",
    name: "Prum",
    role: "Operations \u00B7 Neighborhood Playbook",
    note: "Turns each Pilot into a replicable playbook row",
  },
  {
    initial: "M",
    name: "Milly",
    role: "Design \u00B7 Content",
    note: "Protects the editorial language end to end",
  },
];

const UNFAIR_ADVANTAGES = [
  "Jiaming onboarded every Williamsburg Coffee+ merchant in person \u2014 unmatched beachhead trust",
  "ConversionOracle\u2122 ground truth compounds every verified customer \u2014 horizontal AI has no path to the receipt",
  "DisclosureBot makes FTC non-disclosure architecturally impossible \u2014 no other creator platform ships this",
  "Two-Segment Creator Economics keeps T1\u2013T6 supply aligned at both AOV extremes \u2014 neither reach nor retainer platforms cover both",
  "Narrow + dense + vertical strategy \u2014 NYC neighborhoods are the unit; SLR 25 is the north-star",
];

const UNIT_ECON_PLANS = [
  {
    plan: "Pilot",
    monthly: "$0",
    perCustomer: "$15\u201385",
    gmPct: "22%",
    note: "60-day neighborhood beachhead, $4,200 cap",
  },
  {
    plan: "Operator",
    monthly: "$500",
    perCustomer: "$15\u201385",
    gmPct: "48%",
    note: "Auto-flip at 10 verified customers",
  },
  {
    plan: "Neighborhood",
    monthly: "$8\u201312K launch \u00B7 $2K+ MRR",
    perCustomer: "Category-priced + Retention Add-on",
    gmPct: "62%",
    note: "Full Neighborhood Playbook deployment",
  },
];

/* ── Inline SVG: SLR M0\u2013M24 Trajectory Chart ──────────── */
function SLRChart() {
  const width = 860;
  const height = 360;
  const padL = 56;
  const padR = 24;
  const padT = 32;
  const padB = 48;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;

  const maxMonth = 24;
  const maxSLR = 32;

  const x = (m: number) => padL + (m / maxMonth) * innerW;
  const y = (v: number) => padT + innerH - (v / maxSLR) * innerH;

  const actualPath = SLR_TRAJECTORY.map(
    (p, i) => `${i === 0 ? "M" : "L"} ${x(p.month)} ${y(p.actual)}`,
  ).join(" ");

  const targetPath = SLR_TRAJECTORY.map(
    (p, i) => `${i === 0 ? "M" : "L"} ${x(p.month)} ${y(p.target)}`,
  ).join(" ");

  // Grid ticks
  const yTicks = [5, 10, 15, 20, 25, 30];
  const xTicks = [0, 4, 8, 12, 16, 20, 24];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Software Leverage Ratio trajectory from Month 0 through Month 24, projected to exceed the target of 25 at Month 22"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {/* Frame */}
      <rect
        x={padL}
        y={padT}
        width={innerW}
        height={innerH}
        fill="var(--surface-elevated)"
        stroke="var(--line)"
        strokeWidth={1}
      />

      {/* Horizontal grid */}
      {yTicks.map((t) => (
        <g key={`y-${t}`}>
          <line
            x1={padL}
            x2={padL + innerW}
            y1={y(t)}
            y2={y(t)}
            stroke="rgba(0,48,73,0.06)"
            strokeWidth={1}
          />
          <text
            x={padL - 10}
            y={y(t) + 4}
            fontFamily="var(--font-body)"
            fontSize={11}
            fill="var(--graphite)"
            textAnchor="end"
          >
            {t}
          </text>
        </g>
      ))}

      {/* Vertical grid + month labels */}
      {xTicks.map((t) => (
        <g key={`x-${t}`}>
          <line
            x1={x(t)}
            x2={x(t)}
            y1={padT}
            y2={padT + innerH}
            stroke="rgba(0,48,73,0.04)"
            strokeWidth={1}
          />
          <text
            x={x(t)}
            y={padT + innerH + 20}
            fontFamily="var(--font-body)"
            fontSize={11}
            fill="var(--graphite)"
            textAnchor="middle"
          >
            M{t}
          </text>
        </g>
      ))}

      {/* Target line (SLR 25, Steel Blue dashed) */}
      <line
        x1={padL}
        x2={padL + innerW}
        y1={y(25)}
        y2={y(25)}
        stroke="#669bbc"
        strokeWidth={1.5}
        strokeDasharray="6 4"
      />
      <text
        x={padL + innerW - 8}
        y={y(25) - 8}
        fontFamily="var(--font-body)"
        fontSize={11}
        fontWeight={700}
        letterSpacing="0.08em"
        fill="#669bbc"
        textAnchor="end"
      >
        {"TARGET \u00B7 SLR 25"}
      </text>

      {/* Target ladder path (lighter dashed) */}
      <path
        d={targetPath}
        fill="none"
        stroke="#669bbc"
        strokeWidth={1.5}
        strokeDasharray="4 4"
        opacity={0.55}
      />

      {/* Actual SLR trajectory (Champagne Gold solid) */}
      <path
        d={actualPath}
        fill="none"
        stroke="#c9a96e"
        strokeWidth={2.5}
        strokeLinecap="square"
      />

      {/* Data points on actual */}
      {SLR_TRAJECTORY.map((p) => (
        <rect
          key={`pt-${p.month}`}
          x={x(p.month) - 3}
          y={y(p.actual) - 3}
          width={6}
          height={6}
          fill="#c9a96e"
        />
      ))}

      {/* NOW marker at M12 */}
      <line
        x1={x(12)}
        x2={x(12)}
        y1={padT}
        y2={padT + innerH}
        stroke="#c1121f"
        strokeWidth={1.2}
        strokeDasharray="2 3"
      />
      <rect x={x(12) - 4} y={y(14.1) - 4} width={8} height={8} fill="#c1121f" />
      <text
        x={x(12) + 10}
        y={y(14.1) - 8}
        fontFamily="var(--font-body)"
        fontSize={11}
        fontWeight={700}
        letterSpacing="0.08em"
        fill="#c1121f"
      >
        {"NOW \u00B7 SLR 14.1"}
      </text>

      {/* Axis labels */}
      <text
        x={padL - 40}
        y={padT - 10}
        fontFamily="var(--font-body)"
        fontSize={10}
        fontWeight={700}
        letterSpacing="0.08em"
        fill="var(--graphite)"
      >
        SLR
      </text>
      <text
        x={padL + innerW / 2}
        y={height - 6}
        fontFamily="var(--font-body)"
        fontSize={10}
        fontWeight={700}
        letterSpacing="0.08em"
        fill="var(--graphite)"
        textAnchor="middle"
      >
        MONTHS SINCE BEACHHEAD LAUNCH
      </text>
    </svg>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function YC2027Page() {
  return (
    <>
      {/* Belt-and-suspenders noindex (Next metadata already handles it) */}
      <meta name="robots" content="noindex,nofollow" />

      <ScrollRevealInit />

      <StickySubNav
        links={[
          { id: "yc-thesis-h", label: "Thesis" },
          { id: "yc-chart-h", label: "Traction" },
          { id: "yc-beachhead-h", label: "Beachhead" },
          { id: "yc-ask-h", label: "Ask" },
          { id: "yc-why-h", label: "Team" },
          { id: "yc-econ-h", label: "Economics" },
          { id: "yc-faq-h", label: "FAQ" },
          { id: "yc-apply-h", label: "Apply" },
        ]}
        ctaLabel="Schedule call"
        ctaHref="https://calendly.com/placeholder"
      />

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="yc-hero" aria-labelledby="yc-hero-h">
        <div className="container yc-hero-inner">
          <div className="yc-hero-label">
            <span className="rule rule--w" />
            <span className="eyebrow yc-hero-eyebrow">
              INVESTOR DECK &middot; UNLISTED
            </span>
          </div>

          <h1 id="yc-hero-h" className="yc-hero-h">
            <span className="yc-hero-l1">Push &middot;</span>
            <span className="yc-hero-l2">YC W2027 thesis.</span>
            <span className="yc-hero-l3">
              <em className="yc-hero-accent">
                Vertical AI for Local Commerce.
              </em>
            </span>
          </h1>

          <p className="yc-hero-sub">
            One vertical. One neighborhood. One compounding data asset. This
            page is shared via direct URL only &mdash; not indexed, not linked
            from the marketing site. It is the working thesis behind Push&apos;s
            YC W2027 application, anchored on SLR 25 as the north-star and
            Williamsburg Coffee+ as the beachhead proof.
          </p>

          <div className="yc-hero-meta">
            <span className="yc-hero-meta-item">
              <span className="yc-hero-meta-k">Stage</span>
              <span className="yc-hero-meta-v">Seed \u00B7 raising $2M</span>
            </span>
            <span className="yc-hero-meta-sep" aria-hidden="true" />
            <span className="yc-hero-meta-item">
              <span className="yc-hero-meta-k">Beachhead</span>
              <span className="yc-hero-meta-v">Williamsburg Coffee+</span>
            </span>
            <span className="yc-hero-meta-sep" aria-hidden="true" />
            <span className="yc-hero-meta-item">
              <span className="yc-hero-meta-k">North-star</span>
              <span className="yc-hero-meta-v">SLR 25 by M12</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── §1 THESIS ──────────────────────────────────── */}
      <section className="yc-section yc-solution" aria-labelledby="yc-thesis-h">
        <div className="container">
          <div className="yc-section-tag reveal">
            <span className="yc-section-num">01</span>
            <span className="yc-section-line" />
            <span className="yc-section-label">Thesis</span>
          </div>

          <h2 id="yc-thesis-h" className="yc-section-h reveal">
            Three claims.{" "}
            <span className="yc-section-h-light">
              Each independently defensible. Together, a moat.
            </span>
          </h2>

          <div className="yc-solution-grid">
            {THESIS_CLAIMS.map((claim, i) => (
              <div
                key={claim.num}
                className="yc-solution-card reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <span className="yc-solution-num">{claim.num}</span>
                <h3 className="yc-solution-title">{claim.title}</h3>
                <p className="yc-solution-body">{claim.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── §2 SLR TRAJECTORY CHART ────────────────────── */}
      <section className="yc-section yc-traction" aria-labelledby="yc-chart-h">
        <div className="container">
          <div className="yc-section-tag reveal">
            <span className="yc-section-num">02</span>
            <span className="yc-section-line" />
            <span className="yc-section-label">SLR Trajectory</span>
          </div>

          <h2 id="yc-chart-h" className="yc-section-h reveal">
            Software Leverage Ratio.{" "}
            <span className="yc-section-h-light">
              M0 through M24. Target 25 crossed at M22.
            </span>
          </h2>

          <div
            className="reveal"
            style={{
              background: "var(--surface-elevated)",
              border: "1px solid var(--line)",
              padding: "var(--space-6)",
              marginTop: "var(--space-6)",
            }}
          >
            <SLRChart />
          </div>

          <p
            className="reveal"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--graphite)",
              marginTop: "var(--space-4)",
              lineHeight: 1.6,
            }}
          >
            Baseline local acquisition services shops run SLR 3&ndash;5.
            Horizontal creator platforms plateau similarly because every new
            vertical costs a new playbook. Push compounds the Neighborhood
            Playbook + ConversionOracle&trade; ground truth + DisclosureBot into
            one ops FTE running 25 simultaneous campaigns by Month 12.
          </p>
        </div>
      </section>

      {/* ── §3 BEACHHEAD DATA ──────────────────────────── */}
      <section
        className="yc-section yc-problem"
        aria-labelledby="yc-beachhead-h"
      >
        <div className="container">
          <div className="yc-section-tag reveal">
            <span className="yc-section-num">03</span>
            <span className="yc-section-line" />
            <span className="yc-section-label">Beachhead Data</span>
          </div>

          <h2 id="yc-beachhead-h" className="yc-section-h reveal">
            Williamsburg Coffee+, Day 30.{" "}
            <span className="yc-section-h-light">
              Five pilot merchants. LTV/CAC 15.7x.
            </span>
          </h2>

          <div className="yc-traction-grid reveal">
            {BEACHHEAD_KPIS.map((s) => (
              <div key={s.label} className="yc-traction-stat">
                <span className="yc-traction-n">{s.value}</span>
                <span className="yc-traction-l">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Beachhead merchants table */}
          <div
            className="reveal"
            style={{
              marginTop: "var(--space-8)",
              background: "var(--surface-elevated)",
              border: "1px solid var(--line)",
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "var(--font-body)",
                fontSize: 13,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "rgba(0,48,73,0.04)",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  {["Merchant", "ZIP", "Signed", "Verified", "Tier"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "var(--space-3) var(--space-4)",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--graphite)",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {BEACHHEAD_MERCHANTS.map((m) => (
                  <tr
                    key={m.name}
                    style={{ borderBottom: "1px solid var(--line)" }}
                  >
                    <td
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        fontWeight: 700,
                        color: "var(--dark)",
                      }}
                    >
                      {m.name}
                    </td>
                    <td
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        color: "var(--graphite)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {m.zip}
                    </td>
                    <td
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        color: "var(--graphite)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {m.signed}
                    </td>
                    <td
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        color: "var(--dark)",
                        fontWeight: 700,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {m.verified}
                    </td>
                    <td style={{ padding: "var(--space-3) var(--space-4)" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 10px",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          background:
                            m.tier === "Operator"
                              ? "rgba(201,169,110,0.18)"
                              : "rgba(102,155,188,0.18)",
                          color:
                            m.tier === "Operator"
                              ? "var(--champagne)"
                              : "var(--tertiary)",
                        }}
                      >
                        {m.tier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── §4 THE ASK ─────────────────────────────────── */}
      <section className="yc-section yc-ask" aria-labelledby="yc-ask-h">
        <div className="container">
          <div className="yc-section-tag yc-section-tag--dark reveal">
            <span className="yc-section-num">04</span>
            <span className="yc-section-line" />
            <span className="yc-section-label">The ask</span>
          </div>

          <h2 id="yc-ask-h" className="yc-ask-h reveal">
            <span className="yc-ask-l1">$2M seed.</span>
            <span className="yc-ask-l2">18-month runway.</span>
            <span className="yc-ask-l3">
              <em className="yc-ask-accent">SLR 25 by Month 12.</em>
            </span>
          </h2>

          <p className="yc-ask-sub reveal">
            Capital hits five milestones: (1) ten Williamsburg Coffee+ merchants
            through 60-day Pilot; (2) ConversionOracle&trade; walk-in accuracy
            &ge;88% on the Coffee+ training set; (3) Neighborhood Playbook
            replication into Greenpoint + Bushwick; (4) T1&ndash;T6 Two-Segment
            Creator Economics scaled to 200 creators; (5) first DisclosureBot
            vertical expansion outside Coffee+.
          </p>

          <p className="yc-ask-sub reveal">
            Raise structure: $2M post-money SAFE at $12M cap. YC W2027 standard
            on top. Next milestone: Series A at $15&ndash;25M ARR on SLR 25
            proof + 50 merchants across five Neighborhood Playbook units.
          </p>

          <div className="yc-ask-ctas reveal">
            <a
              className="btn-fill yc-ask-cta"
              href="https://cal.com/pushnyc/investor-call"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a call
            </a>
            <a
              className="btn-outline-light yc-ask-cta"
              href="mailto:wangjiamingaas@gmail.com?subject=Push%20YC%20W2027%20%E2%80%94%20Thesis%20review"
            >
              Email the founder
            </a>
          </div>
        </div>
      </section>

      {/* ── §5 WHY US ──────────────────────────────────── */}
      <section className="yc-section yc-team" aria-labelledby="yc-why-h">
        <div className="container">
          <div className="yc-section-tag reveal">
            <span className="yc-section-num">05</span>
            <span className="yc-section-line" />
            <span className="yc-section-label">Why us</span>
          </div>

          <h2 id="yc-why-h" className="yc-section-h reveal">
            Five people.{" "}
            <span className="yc-section-h-light">
              One founder who closed every merchant in person.
            </span>
          </h2>

          {/* Team grid */}
          <div
            className="reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "var(--space-4)",
              marginTop: "var(--space-6)",
            }}
          >
            {TEAM_FIVE.map((m, i) => (
              <div
                key={m.name}
                style={{
                  padding: "var(--space-5)",
                  background: "var(--surface-elevated)",
                  border: "1px solid var(--line)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-2)",
                  transitionDelay: `${i * 60}ms`,
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    width: 48,
                    height: 48,
                    background: "var(--dark)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      fontWeight: 900,
                      color: "#fff",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {m.initial}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    color: "var(--dark)",
                  }}
                >
                  {m.name}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--tertiary)",
                  }}
                >
                  {m.role}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    lineHeight: 1.55,
                    color: "var(--graphite)",
                  }}
                >
                  {m.note}
                </span>
              </div>
            ))}
          </div>

          {/* Unfair advantages */}
          <div
            className="reveal"
            style={{
              marginTop: "var(--space-8)",
              padding: "var(--space-6)",
              background: "var(--surface-elevated)",
              border: "1px solid var(--line)",
              borderLeft: "4px solid var(--primary)",
            }}
          >
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--primary)",
                marginBottom: "var(--space-3)",
              }}
            >
              Unfair advantages
            </span>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {UNFAIR_ADVANTAGES.map((u, i) => (
                <li
                  key={u}
                  style={{
                    display: "flex",
                    gap: "var(--space-3)",
                    paddingTop: i === 0 ? 0 : "var(--space-3)",
                    paddingBottom: "var(--space-3)",
                    borderBottom:
                      i < UNFAIR_ADVANTAGES.length - 1
                        ? "1px solid var(--line)"
                        : "none",
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "var(--dark)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      fontWeight: 700,
                      color: "var(--primary)",
                      minWidth: 24,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {u}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── §6 UNIT ECONOMICS TABLE ────────────────────── */}
      <section className="yc-section yc-solution" aria-labelledby="yc-econ-h">
        <div className="container">
          <div className="yc-section-tag reveal">
            <span className="yc-section-num">06</span>
            <span className="yc-section-line" />
            <span className="yc-section-label">Unit Economics</span>
          </div>

          <h2 id="yc-econ-h" className="yc-section-h reveal">
            Three plans.{" "}
            <span className="yc-section-h-light">
              GM% climbs from 22% at Pilot to 62% at Neighborhood.
            </span>
          </h2>

          <div
            className="reveal"
            style={{
              marginTop: "var(--space-6)",
              background: "var(--surface-elevated)",
              border: "1px solid var(--line)",
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "var(--font-body)",
                fontSize: 13,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "rgba(0,48,73,0.04)",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  {["Plan", "Monthly", "Per customer", "GM%", "Notes"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "var(--space-3) var(--space-4)",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--graphite)",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {UNIT_ECON_PLANS.map((row) => (
                  <tr
                    key={row.plan}
                    style={{ borderBottom: "1px solid var(--line)" }}
                  >
                    <td
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        fontFamily: "var(--font-display)",
                        fontSize: 16,
                        fontWeight: 900,
                        letterSpacing: "-0.02em",
                        color: "var(--dark)",
                      }}
                    >
                      {row.plan}
                    </td>
                    <td
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        color: "var(--dark)",
                        fontWeight: 700,
                      }}
                    >
                      {row.monthly}
                    </td>
                    <td
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        color: "var(--graphite)",
                      }}
                    >
                      {row.perCustomer}
                    </td>
                    <td
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        color: "var(--champagne)",
                        fontFamily: "var(--font-display)",
                        fontWeight: 900,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {row.gmPct}
                    </td>
                    <td
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        color: "var(--graphite)",
                        fontSize: 12,
                      }}
                    >
                      {row.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── §7 EXISTING INVESTORS / ADVISORS ───────────── */}
      <section
        className="yc-section yc-problem"
        aria-labelledby="yc-investors-h"
      >
        <div className="container">
          <div className="yc-section-tag reveal">
            <span className="yc-section-num">07</span>
            <span className="yc-section-line" />
            <span className="yc-section-label">Cap Table</span>
          </div>

          <h2 id="yc-investors-h" className="yc-section-h reveal">
            Existing backers &amp; advisors.{" "}
            <span className="yc-section-h-light">
              Named post-term-sheet. Placeholder until then.
            </span>
          </h2>

          <div
            className="reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "var(--space-3)",
              marginTop: "var(--space-6)",
            }}
          >
            {[
              "Pre-Seed Fund \u2014 TBD",
              "Angel \u00B7 Creator Economy",
              "Angel \u00B7 Local Commerce",
              "Advisor \u00B7 Vertical AI",
              "Advisor \u00B7 FTC / DisclosureBot",
              "Advisor \u00B7 NYC Hospitality",
            ].map((s) => (
              <div
                key={s}
                style={{
                  border: "1px dashed var(--line)",
                  background: "rgba(0,48,73,0.02)",
                  padding: "var(--space-5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--graphite)",
                  textAlign: "center",
                  minHeight: 72,
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── §8 FAQ ───────────────────────────────────────── */}
      <section className="yc-section yc-faq" id="faq">
        <div className="container">
          <div className="yc-section-tag reveal">
            <span className="yc-section-num">08</span>
            <span className="yc-section-line" />
            <span className="yc-section-label">FAQ</span>
          </div>
          <h2 className="yc-section-h reveal" id="yc-faq-h">
            Investor FAQ
          </h2>

          <div className="yc-faq-list reveal">
            {/* 1 */}
            <details className="yc-faq-item">
              <summary className="yc-faq-q">What are you making?</summary>
              <div className="yc-faq-a">
                Push is a Customer Acquisition Engine for local commerce.
                Merchants pay $15–$85 per verified walk-in. Creators earn per
                customer they bring through the door — not per post.
                ConversionOracle™ verifies every transaction with QR scan +
                Claude Vision OCR + geo-match so neither side can game it.
              </div>
            </details>

            {/* 2 */}
            <details className="yc-faq-item">
              <summary className="yc-faq-q">
                What is the problem you&apos;re solving?
              </summary>
              <div className="yc-faq-a">
                Independent local merchants — coffee shops, fitness studios,
                beauty bars — spend $1,200–$4,000/month on social ads that
                generate impressions, not customers. They have no way to buy
                verified foot traffic. Horizontal creator platforms sell reach;
                they can&apos;t prove anyone walked in.
              </div>
            </details>

            {/* 3 */}
            <details className="yc-faq-item">
              <summary className="yc-faq-q">Why now?</summary>
              <div className="yc-faq-a">
                Three things converged: (1) Claude Vision makes receipt OCR
                commercially viable at $0.002/scan. (2) NYC independent retail
                is contracting — merchants are desperate for ROI. (3) Creator
                supply at the micro tier (3K–30K followers) is oversupplied and
                underpriced — two-segment economics let Push lock in the best
                local creators before TikTok / Meta notice.
              </div>
            </details>

            {/* 4 */}
            <details className="yc-faq-item">
              <summary className="yc-faq-q">Who are your customers?</summary>
              <div className="yc-faq-a">
                Primary: independent local merchants in dense NYC neighborhoods,
                AOV $8–$85. Segment 1 is Coffee+ (Williamsburg beachhead).
                Segment 2 is Fitness + Beauty, which have higher AOV and unlocks
                the $85/customer tier. Secondary: local micro-creators (T1–T3,
                side-income segment) and professional creators (T4–T6, retainer
                + equity segment).
              </div>
            </details>

            {/* 5 */}
            <details className="yc-faq-item">
              <summary className="yc-faq-q">
                How does ConversionOracle™ work?
              </summary>
              <div className="yc-faq-a">
                Creator posts → unique QR code in caption → customer scans at
                point of sale → Push captures geo, timestamp, receipt photo →
                Claude Vision extracts line items + total → cross-references
                against merchant POS → three-layer match = verified walk-in.
                Fraud rate: 1.2%. Auto-verify rate: 88.4%. Meta and Google
                cannot replicate this — they have no path to the receipt.
              </div>
            </details>

            {/* 6 */}
            <details className="yc-faq-item">
              <summary className="yc-faq-q">
                What makes Push defensible?
              </summary>
              <div className="yc-faq-a">
                Two moats compound: (1) ConversionOracle™ trains on walk-in
                ground truth only Push generates. Every verified customer
                sharpens the model — competitors can&apos;t buy this data. (2)
                Creator Productivity Lock: DisclosureBot automates FTC
                compliance on every post. Once a creator&apos;s workflow depends
                on it, switching costs are real. Horizontal platforms have
                neither.
              </div>
            </details>

            {/* 7 */}
            <details className="yc-faq-item">
              <summary className="yc-faq-q">
                What are the unit economics?
              </summary>
              <div className="yc-faq-a">
                Per-customer price: $15–$85 (category-dependent). Platform take:
                22–40%. Creator payout: 60–78% of take rate. At Operator tier
                ($500/mo + per-customer), merchant LTV/CAC = 15.7x. Contribution
                margin at Neighborhood scale: 62%. Month-12 SLR target: 25
                active campaigns per ops FTE.
              </div>
            </details>

            {/* 8 */}
            <details className="yc-faq-item">
              <summary className="yc-faq-q">
                Why Williamsburg Coffee+ first?
              </summary>
              <div className="yc-faq-a">
                It is the densest, highest-trust neighborhood for premium coffee
                in Brooklyn. AOV $8–$20. Average merchant Instagram following:
                4,200. Jiaming closed every pilot merchant in person — no cold
                outreach. This is Template 0. Greenpoint, Bushwick, LES, Nolita,
                and Astoria are the next five neighborhood units.
              </div>
            </details>

            {/* 9 */}
            <details className="yc-faq-item">
              <summary className="yc-faq-q">What is the market size?</summary>
              <div className="yc-faq-a">
                NYC alone: 26,000 independent local businesses spending
                $2.1B/year on customer acquisition. Push&apos;s serviceable
                market in year one is dense neighborhoods × vertical (Coffee+,
                Fitness, Beauty) = ~2,400 merchants at $500–$2,000/mo ARR +
                per-customer fees. National Neighborhood Playbook expansion = 12
                US cities × ~1,000 merchants each.
              </div>
            </details>

            {/* 10 */}
            <details className="yc-faq-item">
              <summary className="yc-faq-q">What happens at SLR 25?</summary>
              <div className="yc-faq-a">
                At Software Leverage Ratio 25, one ops FTE manages 25
                simultaneously active campaigns. Horizontal acquisition services
                cap at 3–5 campaigns per FTE — that&apos;s the services-company
                ceiling. SLR 25 is the delta between a services business and a
                software business. Month-12 target is SLR 25. Month-24
                trajectory puts Push at SLR 28.
              </div>
            </details>

            {/* 11 */}
            <details className="yc-faq-item">
              <summary className="yc-faq-q">What is the ask?</summary>
              <div className="yc-faq-a">
                $1.5M seed. 18-month runway. Milestones: 5 neighborhood Playbook
                deployments, SLR ≥ 12 by Month 6, SLR ≥ 25 by Month 12. Pre-seed
                use: 60% product + ConversionOracle™ training, 25% neighborhood
                ops, 15% legal + compliance (DisclosureBot).
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* ── §9 CTA / Apply ───────────────────────────────── */}
      <section className="yc-section yc-apply-cta" id="apply">
        <div className="container">
          <div className="yc-section-tag reveal">
            <span className="yc-section-num">09</span>
            <span className="yc-section-line" />
            <span className="yc-section-label">Apply</span>
          </div>

          <p className="yc-apply-eyebrow reveal">Let&apos;s build it.</p>
          <h2 className="yc-section-h reveal" id="yc-apply-h">
            Ready to talk?
          </h2>
          <p className="yc-apply-sub reveal">
            Direct line to the founder. Share a time or download the one-pager
            first.
          </p>

          <div className="yc-apply-cta-btns reveal">
            <a
              className="yc-apply-cta-btn"
              href="https://calendly.com/placeholder"
              target="_blank"
              rel="noopener noreferrer"
            >
              Schedule 30 min
            </a>
            <a
              className="yc-apply-cta-btn yc-apply-cta-btn--outline"
              href="/api/yc/one-pager"
            >
              Download one-pager (PDF)
            </a>
          </div>

          <p className="yc-apply-note reveal">
            NDA available on request · deck shared post-call ·
            wangjiamingaas@gmail.com
          </p>

          <div className="yc-calendly-placeholder reveal">
            Calendly embed — loads at runtime
          </div>
        </div>
      </section>
    </>
  );
}
