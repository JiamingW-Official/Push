import type { Metadata } from "next";
import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "./playbook.css";

export const metadata: Metadata = {
  title:
    "The Neighborhood Playbook — Push Expansion Unit | Vertical AI for Local Commerce",
  description:
    "Push's unit of expansion. A Neighborhood Playbook is $8-12K in, $20-35K MRR out by Month 6, 5.1-month payback. 1 ops FTE runs 5 concurrent steady-state neighborhoods at Software Leverage Ratio 25. Williamsburg Coffee+ is Template 0.",
  alternates: {
    canonical: "/neighborhood-playbook",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* ─── Data ────────────────────────────────────────────────── */
const UNIT_ECON = [
  {
    k: "Launch cost",
    v: "$8-12K",
    d: "Ops + Pilot subsidy + creator recruitment, fully loaded.",
  },
  {
    k: "Month 6 MRR",
    v: "$20-35K",
    d: "Steady-state recurring revenue per neighborhood.",
  },
  {
    k: "Payback",
    v: "5.1 mo",
    d: "Blended across 10 Pilot merchants converting to paid.",
  },
  {
    k: "Ops capacity (M12)",
    v: "1 FTE · 5 hoods",
    d: "Software Leverage Ratio 25 — one operator, five concurrent steady-state neighborhoods.",
  },
  {
    k: "Pilot merchants",
    v: "10 per hood",
    d: "10-customer free cap each · $4,200 Pilot cost cap per merchant.",
  },
];

const ROADMAP = [
  {
    window: "M0 — M6",
    phase: "Template 0",
    geo: "1 neighborhood · Williamsburg Coffee+",
    arr: "$360K ARR",
    team: "2 founders run ops",
    proves:
      "The unit works. Verification pipeline lands. ConversionOracle v1 ships.",
  },
  {
    window: "M6 — M12",
    phase: "NYC Dense",
    geo: "5 neighborhoods · + Brooklyn Heights, LES, Nolita, Astoria",
    arr: "$1.8M ARR",
    team: "4 ops",
    proves:
      "The Playbook transfers inside one metro. First cross-neighborhood model lift.",
  },
  {
    window: "M12 — M24",
    phase: "Top-5 Metro",
    geo: "30 neighborhoods · NYC×10 · LA×8 · SF×6 · Austin×3 · Chicago×3",
    arr: "$10.8M ARR",
    team: "12 ops",
    proves:
      "The Playbook transfers across metros. Software Leverage Ratio compounds past 20.",
  },
  {
    window: "M24 — M36",
    phase: "Top-20 Metro",
    geo: "120 neighborhoods",
    arr: "$43M ARR",
    team: "35 ops",
    proves:
      "Ops cost curve decouples from revenue. Defensive structure locks in per vertical.",
  },
];

const SOPS = [
  {
    n: "01",
    title: "Merchant acquisition script",
    body: "End-to-end outbound playbook: target list build, vertical-specific talk-track, $0 Pilot framing, 10-customer free cap sell. Cold-call to signed Pilot in ≤ 14 days.",
  },
  {
    n: "02",
    title: "Creator recruitment checklist",
    body: "6-Tier routing, category affinity gates, neighborhood density targets. Seeds a working operator network inside 21 days of launch.",
  },
  {
    n: "03",
    title: "ConversionOracle pipeline deployment",
    body: "Verification stack — QR scan, Claude Vision receipt OCR, geo-match — drops in per neighborhood. Same schema, same training loop, same ground truth.",
  },
  {
    n: "04",
    title: "Campaign template library",
    body: "Pre-built briefs per vertical (specialty coffee, boutique fitness, independent beauty, specialty bakery). Ops copy-paste, edit the merchant name, ship.",
  },
];

const VERTICALS = [
  { label: "Specialty coffee", n: "~52K" },
  { label: "Boutique fitness", n: "~35K" },
  { label: "Independent beauty", n: "~60K" },
  { label: "Specialty bakery", n: "~40K" },
];

/* ─── Page ────────────────────────────────────────────────── */
export default function NeighborhoodPlaybookPage() {
  return (
    <main className="pb">
      <ScrollRevealInit />

      {/* ───────── HERO ───────── */}
      <section className="pb-hero">
        <div className="container">
          <div className="pb-hero-inner">
            <div className="pb-eyebrow reveal">
              <span className="pb-rule" />
              <span>Expansion · The Neighborhood Playbook</span>
            </div>

            <h1 className="pb-hero-h reveal">
              <span className="pb-hero-l1">The unit we replicate.</span>
              <span className="pb-hero-l2">Not the TAM.</span>
              <span className="pb-hero-l3">Not a vibe.</span>
            </h1>

            <p className="pb-hero-sub reveal">
              A Neighborhood Playbook is Push&apos;s unit of expansion. One
              neighborhood is a launch, not a city — $8-12K in, $20-35K MRR out
              by Month 6, 5.1-month payback, 1 ops FTE runs 5 concurrent
              steady-state neighborhoods at Software Leverage Ratio 25.
            </p>

            <div className="pb-hero-cta reveal">
              <Link href="/merchant/pilot" className="pb-btn pb-btn--primary">
                Apply for Pilot
                <span aria-hidden="true" className="pb-btn-arrow">
                  →
                </span>
              </Link>
              <Link
                href="/neighborhoods/williamsburg-coffee"
                className="pb-btn pb-btn--ghost"
              >
                See Williamsburg Coffee+ Template 0
              </Link>
            </div>

            <div className="pb-hero-meta reveal">
              <span className="pb-chip">Vertical AI for Local Commerce</span>
              <span className="pb-chip">ConversionOracle&trade; inside</span>
              <span className="pb-chip">SLR 25 at Month 12</span>
            </div>
          </div>
        </div>

        <div className="pb-hero-grid" aria-hidden="true" />
      </section>

      {/* ───────── §1 Unit economics ───────── */}
      <section className="pb-sec pb-sec--unit">
        <div className="container">
          <div className="pb-sec-head reveal">
            <span className="pb-s-label">
              <span className="pb-rule" />
              §1 · The unit
            </span>
            <h2 className="pb-sec-h">
              Five numbers that define a neighborhood.
            </h2>
            <p className="pb-sec-sub pb-sec-sub--dark">
              A Neighborhood Playbook is a unit, not a market. Every one lands
              with the same economics. If the numbers stop holding, the unit
              stops replicating.
            </p>
          </div>

          <div className="pb-unit-grid">
            {UNIT_ECON.map((u) => (
              <article key={u.k} className="pb-unit-card reveal">
                <div className="pb-unit-k">{u.k}</div>
                <div className="pb-unit-v">{u.v}</div>
                <p className="pb-unit-d">{u.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── §2 Expansion roadmap ───────── */}
      <section className="pb-sec pb-sec--roadmap">
        <div className="container">
          <div className="pb-sec-head pb-sec-head--w reveal">
            <span className="pb-s-label pb-s-label--w">
              <span className="pb-rule pb-rule--w" />
              §2 · Expansion roadmap
            </span>
            <h2 className="pb-sec-h pb-sec-h--w">
              Four phases. One repeating unit.
            </h2>
            <p className="pb-sec-sub">
              The Playbook compounds. Template 0 in Williamsburg Coffee+ proves
              the unit. Each subsequent phase replicates the same Playbook into
              the next density tier — not a rebuild, a redeployment.
            </p>
          </div>

          <ol className="pb-roadmap">
            {ROADMAP.map((s, i) => (
              <li key={s.phase} className="pb-roadmap-item reveal">
                <div className="pb-roadmap-n">
                  <span className="pb-roadmap-idx">0{i + 1}</span>
                  <span className="pb-roadmap-dot" aria-hidden="true" />
                </div>
                <div className="pb-roadmap-body">
                  <div className="pb-roadmap-window">{s.window}</div>
                  <h3 className="pb-roadmap-phase">{s.phase}</h3>
                  <div className="pb-roadmap-geo">{s.geo}</div>
                  <div className="pb-roadmap-arr">{s.arr}</div>
                  <div className="pb-roadmap-team">{s.team}</div>
                  <p className="pb-roadmap-proves">{s.proves}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── §3 Playbook components ───────── */}
      <section className="pb-sec pb-sec--sops">
        <div className="container">
          <div className="pb-sec-head reveal">
            <span className="pb-s-label">
              <span className="pb-rule" />
              §3 · The Playbook
            </span>
            <h2 className="pb-sec-h">
              Four transferable SOPs. Nothing bespoke.
            </h2>
            <p className="pb-sec-sub pb-sec-sub--dark">
              The Neighborhood Playbook is operational IP, not a pitch deck.
              Every line ops person running a neighborhood runs the same four
              SOPs. That is what makes the unit replicable.
            </p>
          </div>

          <div className="pb-sops-grid">
            {SOPS.map((m) => (
              <article key={m.n} className="pb-sops-card reveal">
                <div className="pb-sops-n">{m.n}</div>
                <h3 className="pb-sops-title">{m.title}</h3>
                <p className="pb-sops-body">{m.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── §4 TAM reframed ───────── */}
      <section className="pb-sec pb-sec--tam">
        <div className="container">
          <article className="pb-tam reveal">
            <div className="pb-tam-mark" aria-hidden="true" />
            <div className="pb-tam-inner">
              <span className="pb-s-label pb-s-label--gold">
                <span className="pb-rule pb-rule--gold" />
                §4 · TAM reframed
              </span>
              <h2 className="pb-tam-h">
                Williamsburg is a Template, not a market size.
              </h2>

              <div className="pb-tam-verticals">
                {VERTICALS.map((v) => (
                  <div key={v.label} className="pb-tam-v">
                    <div className="pb-tam-v-n">{v.n}</div>
                    <div className="pb-tam-v-l">{v.label}</div>
                  </div>
                ))}
              </div>

              <div className="pb-tam-math">
                <div className="pb-tam-math-row">
                  <span className="pb-tam-math-k">Target merchants</span>
                  <span className="pb-tam-math-v">
                    <strong>187K</strong> across 4 verticals (US)
                  </span>
                </div>
                <div className="pb-tam-math-row">
                  <span className="pb-tam-math-k">Penetration target</span>
                  <span className="pb-tam-math-v">
                    <strong>15%</strong> × <strong>$24K</strong> ARPU
                  </span>
                </div>
                <div className="pb-tam-math-row pb-tam-math-row--total">
                  <span className="pb-tam-math-k">Addressable ARR</span>
                  <span className="pb-tam-math-v">
                    <strong>$672M</strong>
                  </span>
                </div>
              </div>

              <p className="pb-tam-note">
                US only. Four verticals only. Before adjacent vertical expansion
                (restaurants, wellness, personal services) and before
                international. This is the floor, not the ceiling — and every
                dollar inside it is reached by replicating one Neighborhood
                Playbook at a time.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* ───────── §5 CTA ───────── */}
      <section className="pb-cta">
        <div className="container">
          <div className="pb-cta-inner reveal">
            <span className="pb-s-label pb-s-label--w">
              <span className="pb-rule pb-rule--w" />
              §5 · Run the Playbook
            </span>
            <h2 className="pb-cta-h">
              Pick the door you want to walk through.
            </h2>
            <p className="pb-cta-sub">
              One unit. One Playbook. Three paths in — depending on whether
              you&apos;re a merchant ready to convert customers, an operator
              studying Template 0, or a Vertical AI for Local Commerce watcher
              tracking the ConversionOracle&trade; flywheel.
            </p>

            <div className="pb-cta-row">
              <Link
                href="/merchant/pilot"
                className="pb-btn pb-btn--primary pb-btn--lg"
              >
                Apply for $0 Pilot
                <span aria-hidden="true" className="pb-btn-arrow">
                  →
                </span>
              </Link>
              <Link
                href="/neighborhoods/williamsburg-coffee"
                className="pb-btn pb-btn--ghost pb-btn--lg"
              >
                See Template 0 in action
              </Link>
              <Link
                href="/conversion-oracle"
                className="pb-btn pb-btn--ghost pb-btn--lg"
              >
                How ConversionOracle&trade; scales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
