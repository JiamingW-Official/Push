import type { Metadata } from "next";
import Link from "next/link";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "./playbook.css";

/* ── Metadata ─────────────────────────────────────────────── */
export const metadata: Metadata = {
  title:
    "The 12-step Neighborhood Playbook — Vertical AI for Local Commerce | Push",
  description:
    "Push's Neighborhood Playbook in 12 numbered steps. ICP lock → seed 10 merchants → campaign templates → tier-0 creators → Claude Vision tuning → QR roll → pilot run → brief review → SLR measure → expansion decision → density unlock → case study. Williamsburg Coffee+ is Template 0.",
  alternates: {
    canonical: "/neighborhood-playbook",
  },
  robots: { index: true, follow: true },
};

/* ── 12 steps ──────────────────────────────────────────────── */

interface Step {
  n: string;
  title: string;
  body: string;
  slr: string;
  duration: string;
  id: string;
}

const STEPS: Step[] = [
  {
    n: "01",
    id: "icp-lock",
    title: "ICP lock",
    body: "Pick the vertical, the ZIP cluster, and the AOV band before you sell a thing. Williamsburg Coffee+ (AOV $8 – $20, ~200 merchants across 11211/11206/11249) is Template 0 for a reason — ICP lock is not negotiation, it's the precondition.",
    slr: "SLR baseline · 0",
    duration: "Day 0 · 1 day",
  },
  {
    n: "02",
    id: "seed-10",
    title: "Seed 10 merchants",
    body: "Outbound the ICP with a vertical-specific script and a $0 Pilot offer. Ten LOIs signed, ten counters getting QR artifacts — no bespoke negotiation. The first five go easiest; the last five prove the script actually transfers.",
    slr: "SLR 0 → 2",
    duration: "Week 1 – 2 · 10 days",
  },
  {
    n: "03",
    id: "campaign-templates",
    title: "Campaign templates",
    body: "Ship category-specific briefs (morning rush, weekend brunch, cold-brew push). Ops copy-paste per merchant, edit the name, publish. DisclosureBot clears every draft. Zero bespoke campaign authoring after this step.",
    slr: "SLR 2 → 5",
    duration: "Week 2 · 3 days",
  },
  {
    n: "04",
    id: "tier-0-creators",
    title: "Tier-0 creators",
    body: "Seed the operator network — T1 Bronze locals, T2 Steel verified operators, T3 Gold category authorities. Two-Segment Creator Economics: T1 – T3 per-customer, T5 Closer on retainer. Claude handles dispatch, not a human.",
    slr: "SLR 5 → 8",
    duration: "Week 2 – 3 · 7 days",
  },
  {
    n: "05",
    id: "claude-vision",
    title: "Claude Vision tuning",
    body: "Auto-verify rate opens at ~74%. By Week 4 it should be ≥ 92%. You are training ConversionOracle™'s walk-in ground truth on your own neighborhood — that corpus is the moat, and it compounds across every subsequent neighborhood.",
    slr: "SLR 8 → 12",
    duration: "Week 2 – 4 · 14 days",
  },
  {
    n: "06",
    id: "qr-roll",
    title: "QR roll",
    body: "Printed QR artifacts deploy on every cohort counter. One artifact per merchant, one-time print, covers the pilot. Creators scan at point-of-sale — QR + receipt OCR + geo-match = three-layer verification inside eight seconds.",
    slr: "SLR 12 → 14",
    duration: "Week 2 – 3 · 5 days",
  },
  {
    n: "07",
    id: "pilot-run",
    title: "Pilot run",
    body: "Live campaigns shipping daily. First 10 AI-verified customers per merchant free — we absorb acquisition cost. If the AI can't deliver, the merchant does not pay. ConversionOracle predicts predicted vs actual inside ±25%.",
    slr: "SLR 14 → 18",
    duration: "Week 3 – 6 · 21 days",
  },
  {
    n: "08",
    id: "brief-review",
    title: "Brief review",
    body: "Weekly cohort review. Every campaign brief reviewed against verified walk-in outcomes. Templates that underperform get patched; templates that over-index get rolled to adjacent merchants. This is the template library getting sharper.",
    slr: "SLR 18 → 20",
    duration: "Week 4 – 6 · ongoing",
  },
  {
    n: "09",
    id: "slr-measure",
    title: "SLR measure",
    body: "Software Leverage Ratio = active campaigns ÷ ops FTE. Target ≥ 20 at Week 6, ≥ 25 at Month 12. If SLR stalls, the unit is not ready to replicate. If it climbs, the Playbook is working.",
    slr: "SLR 20 · gate",
    duration: "Week 6 · 1 day",
  },
  {
    n: "10",
    id: "expansion-decision",
    title: "Expansion decision",
    body: "Gate: does the next neighborhood get triggered? SLR must hold ≥ 20, predicted vs actual within ±15%, and the 5.1-month payback must land in projection. If all three pass, queue the next ZIP cluster. If one fails, iterate.",
    slr: "SLR gate ≥ 20",
    duration: "Week 7 · 2 days",
  },
  {
    n: "11",
    id: "density-unlock",
    title: "Density unlock",
    body: "Next neighborhood inherits the Oracle model, the campaign templates, and the DisclosureBot corpus. Not a rebuild — a redeployment. Greenpoint does not cold-start; it picks up where Williamsburg left off.",
    slr: "SLR 20 → 25",
    duration: "Week 8 – 12 · 30 days",
  },
  {
    n: "12",
    id: "case-study",
    title: "Case study",
    body: "Publish. Every Neighborhood Playbook ends in a shipped case study — SLR ladder, predicted vs actual, Pilot cost vs MRR out. This is how the Playbook becomes operational IP, not a vibe.",
    slr: "SLR ≥ 25 locked",
    duration: "Week 10 · 3 days",
  },
];

/* ── Page ──────────────────────────────────────────────────── */

export default function NeighborhoodPlaybookPage() {
  return (
    <>
      <ScrollRevealInit />

      <main className="pb">
        {/* ── Hero ────────────────────────────────────────── */}
        <section className="pb-hero">
          <div className="container">
            <div className="pb-hero-inner">
              <div className="pb-eyebrow reveal">
                <span className="pb-rule" />
                <span>
                  The Neighborhood Playbook · Vertical AI for Local Commerce
                </span>
              </div>

              <h1 className="pb-hero-h reveal">
                <span className="pb-hero-l1">The 12-step</span>
                <span className="pb-hero-l2">Neighborhood</span>
                <span className="pb-hero-l3">Playbook.</span>
              </h1>

              <p className="pb-hero-sub reveal">
                Twelve steps, same every time. Williamsburg Coffee+ is Template
                0. Every neighborhood after it runs the same twelve — ICP lock,
                seed ten, templates, tier-0 creators, Claude Vision tuning, QR
                roll, pilot, review, SLR, expansion gate, density unlock, case
                study. Five-point-one month payback. One unit of expansion.
              </p>

              <div className="pb-hero-cta reveal">
                <Link href="/contact" className="pb-btn pb-btn--primary">
                  Apply this to your neighborhood
                  <span aria-hidden="true" className="pb-btn-arrow">
                    →
                  </span>
                </Link>
                <Link
                  href="/neighborhoods/williamsburg-coffee"
                  className="pb-btn pb-btn--ghost"
                >
                  See Template 0 in action
                </Link>
              </div>

              <div className="pb-hero-meta reveal">
                <span className="pb-chip">ConversionOracle™ inside</span>
                <span className="pb-chip">Software Leverage Ratio 25</span>
                <span className="pb-chip">Williamsburg Coffee+ beachhead</span>
              </div>
            </div>
          </div>
          <div className="pb-hero-grid" aria-hidden="true" />
        </section>

        {/* ── 12-step editorial + sticky TOC ────────────── */}
        <section className="pb-steps">
          <div className="container pb-steps-inner">
            {/* Sticky TOC */}
            <aside className="pb-toc" aria-label="Playbook steps">
              <div className="pb-toc-head">
                <span className="pb-toc-eyebrow">12 steps</span>
                <span className="pb-toc-sub">
                  Same order, every neighborhood.
                </span>
              </div>
              <ol className="pb-toc-list">
                {STEPS.map((s) => (
                  <li key={s.id} className="pb-toc-item">
                    <a href={`#${s.id}`} className="pb-toc-link">
                      <span className="pb-toc-num">{s.n}</span>
                      <span className="pb-toc-title">{s.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </aside>

            {/* Editorial list */}
            <ol className="pb-steps-list">
              {STEPS.map((s) => (
                <li key={s.id} id={s.id} className="pb-step reveal">
                  <span className="pb-step-n" aria-hidden="true">
                    {s.n}
                  </span>
                  <div className="pb-step-body">
                    <h2 className="pb-step-title">{s.title}</h2>
                    <p className="pb-step-text">{s.body}</p>
                    <div className="pb-step-meta">
                      <div className="pb-step-meta-item">
                        <span className="pb-step-meta-label">
                          SLR milestone
                        </span>
                        <span className="pb-step-meta-value">{s.slr}</span>
                      </div>
                      <div className="pb-step-meta-item">
                        <span className="pb-step-meta-label">
                          Typical duration
                        </span>
                        <span className="pb-step-meta-value">{s.duration}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Final CTA ───────────────────────────────────── */}
        <section className="pb-cta">
          <div className="container">
            <div className="pb-cta-inner reveal">
              <span className="pb-s-label pb-s-label--w">
                <span className="pb-rule pb-rule--w" />
                Apply this to your neighborhood
              </span>
              <h2 className="pb-cta-h">
                Tell us your ZIP cluster. <em>We'll tell you the Playbook.</em>
              </h2>
              <p className="pb-cta-sub">
                The 12 steps are the unit. Williamsburg Coffee+ is the first.
                Greenpoint and Bushwick are queued. If you run a Coffee+ shop in
                11211 / 11206 / 11222 / 11237 / 11249 — or if you're a category
                operator outside coffee watching the Playbook — walk through the
                door.
              </p>
              <div className="pb-cta-row">
                <Link
                  href="/contact"
                  className="pb-btn pb-btn--primary pb-btn--lg"
                >
                  Apply this to your neighborhood
                  <span aria-hidden="true" className="pb-btn-arrow">
                    →
                  </span>
                </Link>
                <Link
                  href="/neighborhoods/williamsburg-coffee"
                  className="pb-btn pb-btn--ghost pb-btn--lg"
                >
                  See Template 0
                </Link>
                <Link
                  href="/neighborhoods"
                  className="pb-btn pb-btn--ghost pb-btn--lg"
                >
                  All neighborhoods
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
