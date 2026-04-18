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
    "Push — AI-Powered Customer Acquisition Agency. Outcome-priced creator marketing for local merchants. Williamsburg coffee beachhead. YC S27 pitch page.",
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
    title: "AI Agent (Claude Sonnet 4.6)",
    body: "Merchant tells the agent a customer goal. Claude matches 3–5 local creators in 60 seconds — profile, geo, historical lift. The agent drafts the brief, predicts ROI, routes the invite.",
  },
  {
    n: "02",
    title: "3-layer verification",
    body: "Every payout requires all three: QR scan at point-of-entry + Claude Vision OCR of the receipt + GPS geo-match within 200m. Sub-8-second verification. One fails, nothing pays.",
  },
  {
    n: "03",
    title: "Outcome pricing",
    body: "$0 Pilot for the first 10 merchants and their first 10 customers. After that, $500/mo minimum plus $40 per AI-verified customer. No SaaS fees, no agency markup, no retainer.",
  },
];

const TRACTION = [
  { n: "6", l: "Signed coffee merchants" },
  { n: "20", l: "Active operator-tier creators" },
  { n: "54", l: "AI-verified customers · Week 1" },
  { n: "60s", l: "AI match latency" },
  { n: "<8s", l: "Receipt verification" },
  { n: "200m", l: "Geo-match radius" },
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
              <em className="yc-hero-accent">Outcome priced.</em>
            </span>
          </h1>

          <p className="yc-hero-sub">
            Push is an AI-powered customer acquisition agency for local
            merchants. Claude Sonnet 4.6 matches creators in 60 seconds. Claude
            Vision verifies every customer with QR + receipt OCR + geo-match.
            Merchants pay only for AI-verified foot traffic — $40 per customer,
            not per post.
          </p>

          <div className="yc-hero-meta">
            <span className="yc-hero-meta-item">
              <span className="yc-hero-meta-k">Stage</span>
              <span className="yc-hero-meta-v">Pre-seed</span>
            </span>
            <span className="yc-hero-meta-sep" aria-hidden="true" />
            <span className="yc-hero-meta-item">
              <span className="yc-hero-meta-k">Beachhead</span>
              <span className="yc-hero-meta-v">Williamsburg coffee</span>
            </span>
            <span className="yc-hero-meta-sep" aria-hidden="true" />
            <span className="yc-hero-meta-item">
              <span className="yc-hero-meta-k">RFS</span>
              <span className="yc-hero-meta-v">S26 #5 — AI Agencies</span>
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
            An AI agent that runs the agency.{" "}
            <span className="yc-section-h-light">
              Three checks. One invoice.
            </span>
          </h2>

          <p className="yc-section-sub reveal">
            Push replaces the agency account manager with an AI agent and the
            attribution guesswork with three hard checks. Every dollar billed
            traces back to a scanned QR, a Vision-read receipt, and a GPS
            coordinate inside the shop&rsquo;s 200-meter geofence.
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
            Williamsburg coffee, sixty days.{" "}
            <span className="yc-section-h-light">
              Network density over breadth.
            </span>
          </h2>

          <p className="yc-section-sub reveal">
            We picked one category, one ZIP, one season. Six coffee shops
            signed. Twenty operator-tier creators vetted and onboarded. Week
            one: 54 AI-verified customers walked through doors that would have
            otherwise been empty.
          </p>

          <div className="yc-traction-grid reveal">
            {TRACTION.map((s) => (
              <div key={s.l} className="yc-traction-stat">
                <span className="yc-traction-n">{s.n}</span>
                <span className="yc-traction-l">{s.l}</span>
              </div>
            ))}
          </div>

          <div className="yc-merchants reveal">
            <span className="yc-merchants-label">Signed merchants</span>
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
                Projection to S27 interview
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
            <span className="yc-section-h-light">Founder &amp; builder.</span>
          </h2>

          <p className="yc-section-sub reveal">
            Solo founder. Built the matching agent, the verification pipeline,
            and the operator network. Based in NYC; onboarded all six
            Williamsburg merchants in person.
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
              <em className="yc-ask-accent">Deploy in Williamsburg.</em>
            </span>
          </h2>

          <p className="yc-ask-sub reveal">
            Standard YC terms: $125K on a post-money SAFE (7% target) plus $375K
            on a MFN SAFE. Capital funds the scale from six Williamsburg
            merchants to fifty across three adjacent ZIPs, expansion of the
            verified creator operator network from 20 to 100, and the Vision-OCR
            throughput infrastructure needed for 500+ concurrent campaigns.
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
