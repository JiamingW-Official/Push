import type { Metadata } from "next";
import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "./conversion-oracle.css";

export const metadata: Metadata = {
  title: "ConversionOracle\u2122 — Push's Vertical AI Moat",
  description:
    "Walk-in ground truth. Trained on receipts, not ads. The proprietary Push model that predicts which creator will drive which customer.",
};

/* ─── Data ────────────────────────────────────────────────── */
const COMPARISON = [
  {
    label: "Google Ads / Meta Ads",
    kind: "cold",
    bullets: [
      "Sees clicks and conversions only on their own surface.",
      "Blind to offline walk-in events in a physical store.",
      "Reward signal is platform-native — not receipt-native.",
    ],
    verdict: "Cannot learn walk-in causality.",
  },
  {
    label: "Generic LLMs (cold Claude / GPT)",
    kind: "cold",
    bullets: [
      "Zero conditioning on local-commerce walk-in patterns.",
      "Best-guess text prediction from public web priors.",
      "No feedback loop between prediction and verified outcome.",
    ],
    verdict: "Plausible prose, not predictive accuracy.",
  },
  {
    label: "ConversionOracle\u2122",
    kind: "moat",
    bullets: [
      "Trained on Push's AI-verified customer events end-to-end.",
      "Ground truth labels tie to (creator, content, merchant, neighborhood, weather, time) features.",
      "Every new walk-in sharpens the next prediction.",
    ],
    verdict: "Walk-in ground truth. Trained on receipts.",
  },
];

const FLYWHEEL = [
  {
    window: "Day 1 — 60",
    stage: "Cold-start",
    engine: "Claude API + rule-based matching",
    volume: "500 — 1,000 events",
    outcome:
      "Bootstrap labels. Establish feature schema. Ship first campaigns.",
  },
  {
    window: "Month 3 — 6",
    stage: "Fine-tune v1",
    engine: "First in-house model on Push-only corpus",
    volume: "1,000 — 5,000 events",
    outcome: "Walk-in rate prediction within ±25%.",
  },
  {
    window: "Month 6 — 12",
    stage: "v2",
    engine: "Creator × content × context features",
    volume: "10,000 — 25,000 events",
    outcome: "±15% accuracy. LTV prediction with 30% error band.",
  },
  {
    window: "Month 12 — 24",
    stage: "v3",
    engine: "Cohort-specific multi-neighborhood model",
    volume: "50,000 — 200,000 events",
    outcome: "±10% accuracy. 30-second first-campaign ROI prediction.",
  },
];

const MOAT_LAYERS = [
  {
    n: "01",
    title: "Data exclusivity",
    body: "Walk-in ground truth lives inside Push's verification pipeline and nowhere else. The data that trains ConversionOracle does not exist in any publicly scrapable dataset.",
  },
  {
    n: "02",
    title: "Cold-start barrier",
    body: "A new entrant needs 1,000+ verified events to match v1 accuracy — a 6-12 month head-start window per neighborhood. Every month Push runs, that gap grows.",
  },
  {
    n: "03",
    title: "Long-tail advantage",
    body: "General models are sparse on nano/micro creators. A specialist model fits the long tail better than any foundation model's prior over creator-commerce behaviour.",
  },
  {
    n: "04",
    title: "Compound effect",
    body: "Each neighborhood launch improves its own predictions independently. At 10+ neighborhoods, cross-neighborhood transfer learning unlocks — a non-linear lift in Software Leverage Ratio.",
  },
];

/* ─── Page ────────────────────────────────────────────────── */
export default function ConversionOraclePage() {
  return (
    <main className="co">
      <ScrollRevealInit />

      {/* ───────── HERO ───────── */}
      <section className="co-hero">
        <div className="container">
          <div className="co-hero-inner">
            <div className="co-eyebrow co-eyebrow--dark reveal">
              <span className="co-rule" />
              <span>The Moat · ConversionOracle&trade;</span>
            </div>

            <h1 className="co-hero-h reveal">
              <span className="co-hero-l1">Walk-in ground truth.</span>
              <span className="co-hero-l2">Trained on receipts.</span>
              <span className="co-hero-l3">Not ads.</span>
            </h1>

            <p className="co-hero-sub reveal">
              Vertical AI for Local Commerce trains on data Meta and Google
              can&apos;t see: real AI-verified customers walking through real
              doors. ConversionOracle is the compounding proprietary model that
              predicts which creator will drive which customer — before anyone
              posts.
            </p>

            <div className="co-hero-cta reveal">
              <Link href="/merchant/pilot" className="co-btn co-btn--primary">
                Apply for $0 Pilot
                <span aria-hidden="true" className="co-btn-arrow">
                  →
                </span>
              </Link>
              <Link href="/trust/disclosure" className="co-btn co-btn--ghost">
                See how verification works
              </Link>
            </div>

            <div className="co-hero-meta reveal">
              <span className="co-chip">Williamsburg Coffee+ beachhead</span>
              <span className="co-chip">Proprietary training corpus</span>
              <span className="co-chip">Ships Month 3 · v1</span>
            </div>
          </div>
        </div>

        <div className="co-hero-grid" aria-hidden="true" />
      </section>

      {/* ───────── §1 Why cold APIs can't do this ───────── */}
      <section className="co-sec co-sec--why">
        <div className="container">
          <div className="co-sec-head reveal">
            <span className="co-s-label">
              <span className="co-rule" />
              §1 · The problem
            </span>
            <h2 className="co-sec-h">Why cold APIs can&apos;t do this.</h2>
          </div>

          <div className="co-compare">
            {COMPARISON.map((c) => (
              <article
                key={c.label}
                className={`co-compare-card co-compare-card--${c.kind} reveal`}
              >
                <div className="co-compare-label">{c.label}</div>
                <ul className="co-compare-list">
                  {c.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <div className="co-compare-verdict">{c.verdict}</div>
              </article>
            ))}
          </div>

          <p className="co-sec-tag reveal">
            The data that trains ConversionOracle&trade; does not exist in any
            publicly scrapable dataset.
          </p>
        </div>
      </section>

      {/* ───────── §2 Training flywheel ───────── */}
      <section className="co-sec co-sec--flywheel">
        <div className="container">
          <div className="co-sec-head co-sec-head--w reveal">
            <span className="co-s-label co-s-label--w">
              <span className="co-rule co-rule--w" />
              §2 · The flywheel
            </span>
            <h2 className="co-sec-h co-sec-h--w">
              Four stages. Each one gets sharper on the last.
            </h2>
            <p className="co-sec-sub">
              ConversionOracle&trade; is not a single model release — it&apos;s
              a training loop that compounds with every verified walk-in. Here
              is the trajectory across 24 months of Williamsburg Coffee+ and the
              neighborhoods that follow.
            </p>
          </div>

          <ol className="co-timeline">
            {FLYWHEEL.map((s, i) => (
              <li key={s.stage} className="co-timeline-item reveal">
                <div className="co-timeline-n">
                  <span className="co-timeline-idx">0{i + 1}</span>
                  <span className="co-timeline-dot" aria-hidden="true" />
                </div>
                <div className="co-timeline-body">
                  <div className="co-timeline-window">{s.window}</div>
                  <h3 className="co-timeline-stage">{s.stage}</h3>
                  <div className="co-timeline-engine">{s.engine}</div>
                  <div className="co-timeline-volume">{s.volume}</div>
                  <p className="co-timeline-outcome">{s.outcome}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── §3 Four-layer moat structure ───────── */}
      <section className="co-sec co-sec--moat">
        <div className="container">
          <div className="co-sec-head reveal">
            <span className="co-s-label">
              <span className="co-rule" />
              §3 · The moat
            </span>
            <h2 className="co-sec-h">
              Four layers. One compounding defensive structure.
            </h2>
          </div>

          <div className="co-moat-grid">
            {MOAT_LAYERS.map((m) => (
              <article key={m.n} className="co-moat-card reveal">
                <div className="co-moat-n">{m.n}</div>
                <h3 className="co-moat-title">{m.title}</h3>
                <p className="co-moat-body">{m.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── §4 Accuracy lift commitment ───────── */}
      <section className="co-sec co-sec--commit">
        <div className="container">
          <article className="co-commit reveal">
            <div className="co-commit-mark" aria-hidden="true" />
            <div className="co-commit-inner">
              <span className="co-s-label co-s-label--gold">
                <span className="co-rule co-rule--gold" />
                §4 · The commitment
              </span>
              <h2 className="co-commit-h">
                Month-6 A/B test. Public target. Public fallback.
              </h2>

              <div className="co-commit-grid">
                <div className="co-commit-item">
                  <div className="co-commit-k">Design</div>
                  <div className="co-commit-v">
                    100 campaigns split between ConversionOracle&trade; v1
                    matching and zero-shot Claude API matching.
                  </div>
                </div>
                <div className="co-commit-item">
                  <div className="co-commit-k">Target</div>
                  <div className="co-commit-v">
                    <strong>≥ 15% lift</strong> in walk-in conversion rate at{" "}
                    <strong>p &lt; 0.05</strong>.
                  </div>
                </div>
                <div className="co-commit-item co-commit-item--full">
                  <div className="co-commit-k">Transparency</div>
                  <div className="co-commit-v">
                    If lift &lt; 15%, Push commits to publicly pivot the moat
                    narrative from model leverage to operational leverage +
                    supply density — and the Software Leverage Ratio story is
                    rewritten in public, not hidden.
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ───────── §5 CTA ───────── */}
      <section className="co-cta">
        <div className="container">
          <div className="co-cta-inner reveal">
            <span className="co-s-label co-s-label--w">
              <span className="co-rule co-rule--w" />
              §5 · Start the loop
            </span>
            <h2 className="co-cta-h">
              Every verified walk-in trains the next prediction.
            </h2>
            <p className="co-cta-sub">
              Whether you&apos;re running a shop or an audience, you&apos;re one
              end of the feedback loop that makes ConversionOracle&trade;
              sharper every week.
            </p>

            <div className="co-cta-row">
              <Link
                href="/merchant/pilot"
                className="co-btn co-btn--primary co-btn--lg"
              >
                Start training the oracle — apply for $0 Pilot
                <span aria-hidden="true" className="co-btn-arrow">
                  →
                </span>
              </Link>
              <Link
                href="/creator/signup"
                className="co-btn co-btn--ghost co-btn--lg"
              >
                Join the operator network — apply as creator
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
