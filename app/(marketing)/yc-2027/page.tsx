import type { Metadata } from "next";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "../landing.css";
import "./yc-2027.css";

/* ── Metadata ─────────────────────────────────────────────
   Unlisted page — shared via direct URL only (YC S27 app).
   noindex + nofollow so crawlers skip it entirely.
   ──────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Push · YC Summer 2027 Application",
  description:
    "Push — Vertical AI for Local Commerce. A Customer Acquisition Engine priced by vertical. Williamsburg Coffee+ beachhead. YC S27 pitch page.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

/* ── Content data ──────────────────────────────────────── */
const PROBLEM_STATS = [
  { n: "$500–3K", l: "Monthly creator spend / local merchant" },
  { n: "0", l: "Visits attributable to any single post" },
  { n: "~90d", l: "To realize the spend produced nothing" },
];

const SOLUTION_LAYERS = [
  {
    n: "01",
    title: "Vertical AI for Local Commerce",
    body: "Specialized AI plus a Customer Acquisition Engine tuned to one vertical at a time. Williamsburg Coffee+ is Template 0 — the Neighborhood Playbook ships the entire stack (creators, brief library, verification tuning, Two-Segment Creator Economics) pre-calibrated to that AOV band.",
  },
  {
    n: "02",
    title: "ConversionOracle™",
    body: "Proprietary walk-in prediction model trained on the AI-verified customer ground truth that only Push can generate. Every verified receipt, geo-match, and QR scan flows back into Oracle, compounding Software Leverage Ratio (SLR) per vertical. Horizontal AI has no path to this data.",
  },
  {
    n: "03",
    title: "DisclosureBot",
    body: "Platform-level FTC compliance baked into the Customer Acquisition Engine. Push is the only creator platform with architectural compliance — every #ad tag, material-connection line, and jurisdictional clause is emitted by the system, not self-reported by the creator. Regulator-ready by default.",
  },
];

const TRACTION = [
  { n: "6", l: "Williamsburg Coffee+ merchants signed" },
  { n: "20", l: "Creators in network (Two-Segment Creator Economics)" },
  { n: "54", l: "AI-verified customers · Week 1" },
  { n: "$6,579", l: "LTV per verified customer" },
  { n: "15.7x", l: "LTV / CAC (10.4x stressed)" },
  { n: "≥88%", l: "AI verification accuracy target" },
];

const ECONOMICS = [
  { n: "$420", l: "CAC per AI-verified customer" },
  { n: "$6.97", l: "Per-customer gross margin (27.9%)" },
  { n: "SLR 8", l: "Software Leverage Ratio · Month 3 target" },
  { n: "SLR ≥25", l: "Month-12 target (vs influencer 3–5)" },
];

const PLAYBOOK_UNIT = [
  { label: "Launch cost", value: "$8–12K" },
  { label: "MRR by Month 6", value: "$20–35K" },
  { label: "Template", value: "Williamsburg Coffee+ (AOV $8–20)" },
];

const SIGNED_MERCHANTS = [
  "Sey Coffee",
  "Devocion",
  "Partners Coffee",
  "Variety Coffee",
  "Stumptown Williamsburg",
  "Toby's Estate",
];

const PROJECTION = [
  { label: "Merchants", now: "6", then: "50+" },
  { label: "Campaigns run", now: "12", then: "500+" },
  { label: "GMV", now: "$4.2K", then: "$50K+" },
];

export default function YC2027Page() {
  return (
    <>
      <ScrollRevealInit />

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="yc-hero" aria-labelledby="yc-hero-h">
        <div className="container yc-hero-inner">
          <div className="yc-hero-label">
            <span className="rule rule--w" />
            <span className="eyebrow yc-hero-eyebrow">
              YC Summer 2027 · Push · Unlisted
            </span>
          </div>

          <h1 id="yc-hero-h" className="yc-hero-h">
            <span className="yc-hero-l1">We turn creators into</span>
            <span className="yc-hero-l2">AI-verified customers.</span>
            <span className="yc-hero-l3">
              <em className="yc-hero-accent">Priced by vertical.</em>
            </span>
          </h1>

          <p className="yc-hero-sub">
            Push is Vertical AI for Local Commerce — a Customer Acquisition
            Engine tuned to one vertical at a time. ConversionOracle™ predicts
            walk-ins from the AI-verified ground truth only Push generates.
            DisclosureBot enforces FTC compliance at the platform layer. The
            Neighborhood Playbook is the unit — Williamsburg Coffee+ is Template
            0.
          </p>

          <div className="yc-hero-meta">
            <span className="yc-hero-meta-item">
              <span className="yc-hero-meta-k">Stage</span>
              <span className="yc-hero-meta-v">Pre-seed</span>
            </span>
            <span className="yc-hero-meta-sep" aria-hidden="true" />
            <span className="yc-hero-meta-item">
              <span className="yc-hero-meta-k">Beachhead</span>
              <span className="yc-hero-meta-v">Williamsburg Coffee+</span>
            </span>
            <span className="yc-hero-meta-sep" aria-hidden="true" />
            <span className="yc-hero-meta-item">
              <span className="yc-hero-meta-k">RFS</span>
              <span className="yc-hero-meta-v">S26 #5 — Vertical AI</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── §1 PROBLEM ─────────────────────────────────── */}
      <section className="yc-section yc-problem" aria-labelledby="yc-problem-h">
        <div className="container">
          <div className="yc-section-tag reveal">
            <span className="yc-section-num">01</span>
            <span className="yc-section-line" />
            <span className="yc-section-label">Problem</span>
          </div>

          <h2 id="yc-problem-h" className="yc-section-h reveal">
            Local merchants spend on creators.{" "}
            <span className="yc-section-h-light">
              Nothing walks through the door.
            </span>
          </h2>

          <p className="yc-section-sub reveal">
            The average Williamsburg merchant sinks $500–$3,000 per month into
            Instagram creators, TikTok promos, and micro-influencer campaigns.
            Zero of it is attributable. Posts go up, likes stack — and no one
            can tell the owner whether a single customer walked in because of
            it. Ninety days later, the spend produced a feeling, not a receipt.
          </p>

          <div className="yc-stat-strip">
            {PROBLEM_STATS.map((s, i) => (
              <div
                key={s.l}
                className="yc-stat reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="yc-stat-n">{s.n}</span>
                <span className="yc-stat-l">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── §2 SOLUTION ────────────────────────────────── */}
      <section
        className="yc-section yc-solution"
        aria-labelledby="yc-solution-h"
      >
        <div className="container">
          <div className="yc-section-tag reveal">
            <span className="yc-section-num">02</span>
            <span className="yc-section-line" />
            <span className="yc-section-label">Solution</span>
          </div>

          <h2 id="yc-solution-h" className="yc-section-h reveal">
            Vertical AI for Local Commerce.{" "}
            <span className="yc-section-h-light">
              Three layers. One compounding moat.
            </span>
          </h2>

          <p className="yc-section-sub reveal">
            Push is a Customer Acquisition Engine, not a horizontal tool. Layer
            1 specializes the AI to one vertical at a time. Layer 2 —
            ConversionOracle™ — is the proprietary walk-in prediction model,
            trained on AI-verified ground truth only Push can generate. Layer 3
            — DisclosureBot — makes Push the only creator platform with
            architectural FTC compliance. Every verified QR scan, Claude Vision
            receipt, and geo-matched GPS coordinate compounds Software Leverage
            Ratio (SLR) inside the Neighborhood Playbook unit.
          </p>

          <div className="yc-solution-grid">
            {SOLUTION_LAYERS.map((layer, i) => (
              <div
                key={layer.n}
                className="yc-solution-card reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <span className="yc-solution-num">{layer.n}</span>
                <h3 className="yc-solution-title">{layer.title}</h3>
                <p className="yc-solution-body">{layer.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── §3 TRACTION ────────────────────────────────── */}
      <section
        className="yc-section yc-traction"
        aria-labelledby="yc-traction-h"
      >
        <div className="container">
          <div className="yc-section-tag reveal">
            <span className="yc-section-num">03</span>
            <span className="yc-section-line" />
            <span className="yc-section-label">Traction</span>
          </div>

          <h2 id="yc-traction-h" className="yc-section-h reveal">
            Williamsburg Coffee+, sixty days.{" "}
            <span className="yc-section-h-light">
              Template 0 of the Neighborhood Playbook.
            </span>
          </h2>

          <p className="yc-section-sub reveal">
            Williamsburg Coffee+ Pilot (AOV $8–20) · 20 creators in network ·
            week-1 54 AI-verified customers · SLR 8 at Month 3 target. The
            Neighborhood Playbook unit is $8–12K launch → $20–35K MRR by M6.
            Two-Segment Creator Economics keeps operators and first-timers on
            the same compounding supply. Ground truth flows back into
            ConversionOracle™ with every verified receipt.
          </p>

          <div className="yc-traction-grid reveal">
            {TRACTION.map((s) => (
              <div key={s.l} className="yc-traction-stat">
                <span className="yc-traction-n">{s.n}</span>
                <span className="yc-traction-l">{s.l}</span>
              </div>
            ))}
          </div>

          <div
            className="yc-traction-grid reveal"
            style={{ marginTop: "24px" }}
          >
            {ECONOMICS.map((s) => (
              <div key={s.l} className="yc-traction-stat">
                <span className="yc-traction-n">{s.n}</span>
                <span className="yc-traction-l">{s.l}</span>
              </div>
            ))}
          </div>

          <div className="yc-merchants reveal">
            <span className="yc-merchants-label">
              Williamsburg Coffee+ merchants signed
            </span>
            <ul className="yc-merchants-list">
              {SIGNED_MERCHANTS.map((name) => (
                <li key={name} className="yc-merchants-item">
                  {name}
                </li>
              ))}
            </ul>
          </div>

          <div className="yc-projection reveal">
            <div className="yc-projection-head">
              <span className="yc-projection-label">
                Neighborhood Playbook unit economics
              </span>
              <span className="yc-projection-sub">
                Williamsburg Coffee+ · Template 0
              </span>
            </div>
            <div className="yc-projection-rows">
              {PLAYBOOK_UNIT.map((row) => (
                <div key={row.label} className="yc-projection-row">
                  <span className="yc-projection-k">{row.label}</span>
                  <span className="yc-projection-v">
                    <span className="yc-projection-then">{row.value}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="yc-projection reveal">
            <div className="yc-projection-head">
              <span className="yc-projection-label">
                Projection by YC S27 application
              </span>
              <span className="yc-projection-sub">
                Today &rarr; Summer 2027
              </span>
            </div>
            <div className="yc-projection-rows">
              {PROJECTION.map((row) => (
                <div key={row.label} className="yc-projection-row">
                  <span className="yc-projection-k">{row.label}</span>
                  <span className="yc-projection-v">
                    <span className="yc-projection-now">{row.now}</span>
                    <span className="yc-projection-arrow" aria-hidden="true">
                      &rarr;
                    </span>
                    <span className="yc-projection-then">{row.then}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── §4 TEAM ────────────────────────────────────── */}
      <section className="yc-section yc-team" aria-labelledby="yc-team-h">
        <div className="container">
          <div className="yc-section-tag reveal">
            <span className="yc-section-num">04</span>
            <span className="yc-section-line" />
            <span className="yc-section-label">Team</span>
          </div>

          <h2 id="yc-team-h" className="yc-section-h reveal">
            Jiaming Wang.{" "}
            <span className="yc-section-h-light">
              Founder &amp; builder. ML Advisor engaged.
            </span>
          </h2>

          <p className="yc-section-sub reveal">
            Solo founder. Built the Customer Acquisition Engine, the 3-layer
            verification pipeline, and the Two-Segment Creator Economics
            network. Based in NYC; onboarded all six Williamsburg Coffee+
            merchants in person. ML Advisor search in progress (ex-Scale AI /
            ex-Anthropic / ex-HuggingFace profile target) — 6-week ramp,
            0.5–1.5% equity, scoped to harden ConversionOracle™ training
            pipelines and AI verification accuracy toward the ≥88% target.
          </p>
        </div>
      </section>

      {/* ── §5 ASK ─────────────────────────────────────── */}
      <section className="yc-section yc-ask" aria-labelledby="yc-ask-h">
        <div className="container">
          <div className="yc-section-tag yc-section-tag--dark reveal">
            <span className="yc-section-num">05</span>
            <span className="yc-section-line" />
            <span className="yc-section-label">Ask</span>
          </div>

          <h2 id="yc-ask-h" className="yc-ask-h reveal">
            <span className="yc-ask-l1">$150K pre-seed.</span>
            <span className="yc-ask-l2">YC S27 standard.</span>
            <span className="yc-ask-l3">
              <em className="yc-ask-accent">Ship the Neighborhood Playbook.</em>
            </span>
          </h2>

          <p className="yc-ask-sub reveal">
            Post-money SAFE cap ladder: Pre-Seed F&amp;F $100–200K @ $5–8M cap ·
            YC Standard $500K · Demo Day $2–4M @ $15–25M cap · Seed Ext $5–8M @
            $30–50M · Series A $15–25M @ $80–140M. Capital scales the
            Williamsburg Coffee+ template from six merchants to fifty, compounds
            ConversionOracle™ ground truth, and hardens DisclosureBot across
            adjacent verticals.
          </p>

          <p className="yc-ask-sub reveal">
            Core bet: Vertical AI &gt; horizontal AI at this layer. Coffee+ is
            Template 0. Neighborhood Playbook is the unit.
          </p>

          <div className="yc-ask-ctas reveal">
            <a
              className="btn-fill yc-ask-cta"
              href="mailto:wangjiamingaas@gmail.com?subject=Push%20YC%20S27%20—%20Intro"
            >
              Email the founder
            </a>
            <a
              className="btn-outline-light yc-ask-cta"
              href="/yc-2027-deck.pdf"
              aria-describedby="yc-deck-note"
            >
              Download deck (PDF)
            </a>
          </div>

          <p id="yc-deck-note" className="yc-ask-fine reveal">
            Deck PDF forthcoming — request directly if the link 404s.
            <br />
            Contact: wangjiamingaas@gmail.com · NYC
          </p>
        </div>
      </section>
    </>
  );
}
