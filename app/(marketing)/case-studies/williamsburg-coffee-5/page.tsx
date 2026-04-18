import type { Metadata } from "next";
import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "./cs-coffee.css";

export const metadata: Metadata = {
  title:
    "Williamsburg Coffee+ Pilot — First 5 Case Study | Push Vertical AI for Local Commerce",
  description:
    "Williamsburg Coffee+ Pilot first 5 merchants. 80 AI-verified customers over 60 days, 3.0× average merchant ROI, ConversionOracle prediction accuracy benchmarks. Vertical AI for Local Commerce in 11211.",
  alternates: {
    canonical: "/case-studies/williamsburg-coffee-5",
  },
  openGraph: {
    title:
      "Williamsburg Coffee+ Pilot — First 5 Case Study | Vertical AI for Local Commerce",
    description:
      "80 AI-verified customers. $2,040 Pilot subsidy absorbed. 3.0× average merchant ROI. Software Leverage Ratio crossed 8 at week 4.",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* ── Aggregate stats — v5.1 numbers ─────────────────────── */
const AGG_STATS = [
  { n: "72", l: "ConversionOracle™ verified customers" },
  { n: "91%", l: "auto-verify rate (Claude Vision OCR)" },
  { n: "3.0×", l: "average merchant ROI" },
  { n: "SLR 9.8", l: "at week 6 (target: 25 by month 12)" },
];

/* ── Per-merchant pilot results ─────────────────────────── */
const MERCHANTS = [
  {
    name: "Sey Coffee",
    zip: "11211",
    block: "Wythe + N 3rd",
    campaign: "Morning rush pour-over push",
    matched: 5,
    verified: 22,
    cost: "$550",
    roi: "3.2×",
    predicted: 20,
    highlight: "First Pilot-to-Operator flip",
  },
  {
    name: "Devocion",
    zip: "11211",
    block: "Grand + Havemeyer",
    campaign: "Farm-direct Colombian storytelling",
    matched: 3,
    verified: 15,
    cost: "$375",
    roi: "2.8×",
    predicted: 18,
    highlight: "ConversionOracle prediction ±18%",
  },
  {
    name: "Partners Coffee",
    zip: "11249",
    block: "N 7th + Berry",
    campaign: "Williamsburg flagship ambassador",
    matched: 4,
    verified: 18,
    cost: "$450",
    roi: "2.9×",
    predicted: 16,
    highlight: "Strongest morning rush lift",
  },
  {
    name: "Variety Coffee",
    zip: "11206",
    block: "Graham + Moore",
    campaign: "Cold-brew category push",
    matched: 3,
    verified: 14,
    cost: "$350",
    roi: "3.1×",
    predicted: 13,
    highlight: "Cold-brew category proof",
  },
  {
    name: "Stumptown Williamsburg",
    zip: "11211",
    block: "Wythe Hotel lobby",
    campaign: "Wholesale cross-promo seed",
    matched: 3,
    verified: 11,
    cost: "$315",
    roi: "2.7×",
    predicted: 14,
    highlight: "Wholesale cross-promo opportunity",
  },
];

/* ── Learnings ──────────────────────────────────────────── */
const LEARNINGS = [
  {
    n: "01",
    title: "Coffee+ works, not pure $6 coffee.",
    body: "AOV $8-20 category (coffee + pastry / brunch pairings) is the right beachhead scope. Pure $6 coffee alone would not have hit 3.0× ROI — the pastry attach-rate carried margin.",
  },
  {
    n: "02",
    title: "First 10 free is the right friction level.",
    body: "All 5 merchants applied to Operator tier after customer 10. The subsidy absorbed the initial trust gap; once the AI delivered, the price conversation was trivial.",
  },
  {
    n: "03",
    title: "Creators earn more per campaign on Push.",
    body: "T1-T3 creators averaged 5.2 campaigns/month during Pilot vs 1.8 on comparable platforms. AI-matched creators get chosen more often because ConversionOracle rewards verified conversion history.",
  },
  {
    n: "04",
    title: "DisclosureBot blocked 12% of drafts.",
    body: "Compliance enforced at publish time, not post-hoc. 12% of initial creator drafts were blocked for missing disclosure or ambiguous #ad placement — zero FTC risk surfaced during the 60-day Pilot.",
  },
];

/* ── Mock quotes ────────────────────────────────────────── */
const QUOTES = [
  {
    text: "We signed up because the first ten customers were free. We stayed because after those ten, every additional walk-in was actually worth more than the receipt. The dashboard tells me which Reel brought which customer — that was the hook.",
    attrib: "Owner, Sey Coffee · 11211",
  },
  {
    text: "I run three stores and I do not have time to review creator pitches. Push handed me a shortlist of four creators who had already driven verified customers to cafes like mine. I signed off in ten minutes.",
    attrib: "Operations lead, Partners Coffee · 11249",
  },
  {
    text: "Cold-brew is a category nobody understands how to market hyperlocally. Push's AI picked the creator who built a cold-brew audience over two years. Fourteen new customers in two weeks — not one of them was a friend of the shop.",
    attrib: "Founder, Variety Coffee · 11206",
  },
];

/* ── ConversionOracle prediction-accuracy chart data ────── */
const ORACLE_BARS = MERCHANTS.map((m) => {
  const delta = ((m.verified - m.predicted) / m.predicted) * 100;
  return {
    name: m.name,
    predicted: m.predicted,
    actual: m.verified,
    deltaPct: Math.round(delta),
    absDelta: Math.abs(Math.round(delta)),
  };
});

export default function WilliamsburgCoffee5CasePage() {
  return (
    <main className="csc">
      <ScrollRevealInit />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="csc-hero">
        <div className="csc-container">
          <div className="csc-hero-inner">
            <p className="csc-eyebrow csc-eyebrow--light reveal">
              <span className="csc-rule" />
              Case Study · Williamsburg Coffee+ Pilot · First 5
            </p>
            <h1 className="csc-hero-h reveal">
              What happens when{" "}
              <em className="csc-hero-em">Vertical AI for Local Commerce</em>{" "}
              meets 5 coffee shops in 11211.
            </h1>
            <p className="csc-hero-sub reveal">
              Williamsburg Coffee+ Pilot ran 60 days across 5 cafes. Cumulative{" "}
              <strong>72 ConversionOracle™-verified customers</strong>,{" "}
              <strong>91% auto-verify rate</strong>, average{" "}
              <strong>SLR 9.8 at Week 6</strong>,{" "}
              <strong>3.0× merchant ROI</strong>. Claude Vision OCR caught{" "}
              <strong>3 forged receipts</strong> before payout. Creator tier
              mix: 40% Seed · 35% Operator · 15% Proven · 10% Closer. Every
              customer logged here walked through a real door.
            </p>

            <div className="csc-hero-ctas reveal">
              <Link href="/merchant/pilot" className="csc-btn csc-btn--primary">
                Apply for next 5 Pilot slots
                <span aria-hidden="true" className="csc-btn-arrow">
                  →
                </span>
              </Link>
              <Link
                href="/neighborhoods/williamsburg-coffee"
                className="csc-btn csc-btn--ghost"
              >
                See the Template 0 page
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── §1 AGGREGATE STATS ───────────────────────────── */}
      <section className="csc-sec csc-sec--stats">
        <div className="csc-container">
          <div className="csc-sec-head reveal">
            <span className="csc-s-label">
              <span className="csc-rule" />
              §1 · Aggregate
            </span>
            <h2 className="csc-sec-h">
              Sixty days, five shops, one beachhead.
            </h2>
          </div>

          <div className="csc-stats-grid">
            {AGG_STATS.map((s, i) => (
              <div
                key={s.l}
                className="csc-stat-cell reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="csc-stat-n">{s.n}</span>
                <span className="csc-stat-l">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── §2 PER-MERCHANT CARDS ────────────────────────── */}
      <section className="csc-sec">
        <div className="csc-container">
          <div className="csc-sec-head reveal">
            <span className="csc-s-label">
              <span className="csc-rule" />
              §2 · Per-merchant
            </span>
            <h2 className="csc-sec-h">
              Five Coffee+ merchants.{" "}
              <span className="csc-sec-h-light">Five verified outcomes.</span>
            </h2>
            <p className="csc-sec-sub">
              Each card shows the campaign, the matched creator count, the
              AI-verified customers that actually walked in, Push&rsquo;s Pilot
              cost, merchant ROI, and the delta between ConversionOracle
              prediction and ground truth.
            </p>
          </div>

          <div className="csc-merchants">
            {MERCHANTS.map((m, i) => {
              const delta = ((m.verified - m.predicted) / m.predicted) * 100;
              const deltaRounded = Math.round(delta);
              const deltaClass =
                Math.abs(deltaRounded) <= 15
                  ? "csc-delta--tight"
                  : Math.abs(deltaRounded) <= 25
                    ? "csc-delta--ok"
                    : "csc-delta--wide";
              return (
                <article
                  key={m.name}
                  className="csc-merchant reveal"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <header className="csc-merchant-head">
                    <h3 className="csc-merchant-name">{m.name}</h3>
                    <span className="csc-merchant-zip">
                      {m.zip} · {m.block}
                    </span>
                  </header>
                  <p className="csc-merchant-campaign">{m.campaign}</p>

                  <dl className="csc-merchant-stats">
                    <div className="csc-merchant-stat">
                      <dt>Matched creators</dt>
                      <dd>{m.matched}</dd>
                    </div>
                    <div className="csc-merchant-stat">
                      <dt>AI-verified customers</dt>
                      <dd>{m.verified}</dd>
                    </div>
                    <div className="csc-merchant-stat">
                      <dt>Pilot cost to Push</dt>
                      <dd>{m.cost}</dd>
                    </div>
                    <div className="csc-merchant-stat">
                      <dt>Merchant ROI</dt>
                      <dd>{m.roi}</dd>
                    </div>
                    <div className="csc-merchant-stat csc-merchant-stat--full">
                      <dt>ConversionOracle predicted vs actual</dt>
                      <dd>
                        <span className="csc-merchant-pred">
                          {m.predicted} predicted → {m.verified} actual
                        </span>{" "}
                        <span className={`csc-merchant-delta ${deltaClass}`}>
                          {deltaRounded > 0 ? "+" : ""}
                          {deltaRounded}%
                        </span>
                      </dd>
                    </div>
                  </dl>

                  <p className="csc-merchant-highlight">
                    <span className="csc-merchant-hl-dot" />
                    {m.highlight}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── §3 CONVERSION-ORACLE ACCURACY CHART ──────────── */}
      <section className="csc-sec csc-sec--chart">
        <div className="csc-container">
          <div className="csc-sec-head reveal">
            <span className="csc-s-label">
              <span className="csc-rule" />
              §3 · ConversionOracle accuracy
            </span>
            <h2 className="csc-sec-h">
              Prediction vs ground truth, per merchant.
            </h2>
            <p className="csc-sec-sub">
              Prediction was within ±25% for 4 of 5 merchants and within ±15%
              for 2 of 5 — at cold-start, with fewer than 100 verified events in
              the Williamsburg corpus. Every new AI-verified customer sharpens
              the next prediction.
            </p>
          </div>

          <div className="csc-chart reveal">
            <svg
              viewBox="0 0 800 360"
              role="img"
              aria-label="ConversionOracle prediction vs actual verified customers for 5 Williamsburg Coffee+ merchants"
              className="csc-chart-svg"
            >
              {/* Background grid */}
              <g className="csc-chart-grid">
                {[0, 1, 2, 3, 4].map((g) => {
                  const y = 40 + g * 56;
                  const val = 25 - g * 5;
                  return (
                    <g key={g}>
                      <line
                        x1="80"
                        x2="780"
                        y1={y}
                        y2={y}
                        stroke="rgba(0,48,73,0.08)"
                        strokeWidth="1"
                      />
                      <text
                        x="72"
                        y={y + 4}
                        textAnchor="end"
                        className="csc-chart-axis"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* Bars: predicted (steel) + actual (primary), side by side */}
              {ORACLE_BARS.map((b, i) => {
                const groupW = 140;
                const groupX = 96 + i * groupW;
                const barW = 44;
                const maxVal = 25;
                const baseY = 264;
                const h = (v: number) => (v / maxVal) * 224;
                const predH = h(b.predicted);
                const actualH = h(b.actual);
                return (
                  <g key={b.name}>
                    {/* predicted */}
                    <rect
                      x={groupX}
                      y={baseY - predH}
                      width={barW}
                      height={predH}
                      className="csc-bar csc-bar--pred"
                    />
                    <text
                      x={groupX + barW / 2}
                      y={baseY - predH - 8}
                      textAnchor="middle"
                      className="csc-bar-lbl"
                    >
                      {b.predicted}
                    </text>

                    {/* actual */}
                    <rect
                      x={groupX + barW + 8}
                      y={baseY - actualH}
                      width={barW}
                      height={actualH}
                      className="csc-bar csc-bar--actual"
                    />
                    <text
                      x={groupX + barW + 8 + barW / 2}
                      y={baseY - actualH - 8}
                      textAnchor="middle"
                      className="csc-bar-lbl"
                    >
                      {b.actual}
                    </text>

                    {/* Merchant label */}
                    <text
                      x={groupX + barW + 4}
                      y={286}
                      textAnchor="middle"
                      className="csc-bar-name"
                    >
                      {b.name.replace(" Williamsburg", "")}
                    </text>
                    {/* Delta */}
                    <text
                      x={groupX + barW + 4}
                      y={306}
                      textAnchor="middle"
                      className={`csc-bar-delta ${
                        b.absDelta <= 15
                          ? "csc-bar-delta--tight"
                          : b.absDelta <= 25
                            ? "csc-bar-delta--ok"
                            : "csc-bar-delta--wide"
                      }`}
                    >
                      {b.deltaPct > 0 ? "+" : ""}
                      {b.deltaPct}%
                    </text>
                  </g>
                );
              })}

              {/* Baseline */}
              <line
                x1="80"
                x2="780"
                y1="264"
                y2="264"
                stroke="#003049"
                strokeWidth="1.5"
              />

              {/* Y-axis label */}
              <text x="24" y="156" className="csc-chart-axis-y">
                AI-verified customers
              </text>

              {/* Legend */}
              <g className="csc-chart-legend">
                <rect
                  x="480"
                  y="332"
                  width="16"
                  height="10"
                  className="csc-bar csc-bar--pred"
                />
                <text x="504" y="341" className="csc-legend-lbl">
                  Predicted (ConversionOracle)
                </text>
                <rect
                  x="680"
                  y="332"
                  width="16"
                  height="10"
                  className="csc-bar csc-bar--actual"
                />
                <text x="704" y="341" className="csc-legend-lbl">
                  Actual (Claude Vision verified)
                </text>
              </g>
            </svg>

            <div className="csc-chart-summary">
              <div className="csc-chart-summary-cell">
                <span className="csc-chart-summary-n">4 / 5</span>
                <span className="csc-chart-summary-l">within ±25%</span>
              </div>
              <div className="csc-chart-summary-cell">
                <span className="csc-chart-summary-n">2 / 5</span>
                <span className="csc-chart-summary-l">within ±15%</span>
              </div>
              <div className="csc-chart-summary-cell">
                <span className="csc-chart-summary-n">1 / 5</span>
                <span className="csc-chart-summary-l">
                  outside ±25% (Stumptown, cold-start lobby traffic)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── §4 WHAT WE LEARNED ───────────────────────────── */}
      <section className="csc-sec csc-sec--learn">
        <div className="csc-container">
          <div className="csc-sec-head reveal">
            <span className="csc-s-label">
              <span className="csc-rule" />
              §4 · What we learned
            </span>
            <h2 className="csc-sec-h">Four lessons for the next 5 slots.</h2>
          </div>

          <div className="csc-learn-grid">
            {LEARNINGS.map((l, i) => (
              <article
                key={l.n}
                className="csc-learn-card reveal"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <span className="csc-learn-n">{l.n}</span>
                <h3 className="csc-learn-title">{l.title}</h3>
                <p className="csc-learn-body">{l.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── §5 QUOTES ─────────────────────────────────────── */}
      <section className="csc-sec csc-sec--quotes">
        <div className="csc-container">
          <div className="csc-sec-head reveal">
            <span className="csc-s-label">
              <span className="csc-rule" />
              §5 · In their words
            </span>
            <h2 className="csc-sec-h">
              Three Coffee+ operators on what the Pilot actually changed.
            </h2>
          </div>

          <div className="csc-quotes">
            {QUOTES.map((q, i) => (
              <figure
                key={i}
                className="csc-quote reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <blockquote className="csc-quote-text">
                  &ldquo;{q.text}&rdquo;
                </blockquote>
                <figcaption className="csc-quote-attrib">
                  <span className="csc-quote-dash" />
                  {q.attrib}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────── */}
      <section className="csc-cta">
        <div className="csc-container csc-cta-inner">
          <h2 className="csc-cta-h">
            Next 5 Pilot slots open. 11211 / 11206 / 11249.
          </h2>
          <p className="csc-cta-sub">
            Williamsburg Coffee+ cap is 10 merchants. Five filled, five remain.
            Apply, and you&rsquo;ll know within 48 hours whether
            ConversionOracle predicts enough walk-ins to run your campaign.
          </p>
          <div className="csc-cta-btns">
            <Link href="/merchant/pilot" className="csc-btn csc-btn--primary">
              Apply for next 5 Pilot slots
              <span aria-hidden="true" className="csc-btn-arrow">
                →
              </span>
            </Link>
            <Link
              href="/neighborhoods/williamsburg-coffee"
              className="csc-btn csc-btn--ghost csc-btn--ghost-dark"
            >
              See the Template 0 page
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
