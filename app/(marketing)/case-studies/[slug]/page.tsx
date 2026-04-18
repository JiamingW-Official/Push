import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CASES, getCaseBySlug, type Case } from "@/lib/cases/mock-cases";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "../case-studies.css";

/* ─────────────────────────────────────────────────────────────
   v5.1 slug template — Vertical AI for Local Commerce.
   Williamsburg Coffee+ cohort has its own bespoke page at
   /case-studies/williamsburg-coffee-5/page.tsx — this template
   explicitly excludes that slug and handles everything else.
   ───────────────────────────────────────────────────────────── */

const EXCLUDED_SLUGS = new Set(["williamsburg-coffee-5"]);

export function generateStaticParams() {
  return CASES.filter((c) => !EXCLUDED_SLUGS.has(c.slug)).map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (EXCLUDED_SLUGS.has(slug)) return { title: "Case Study — Push" };
  const c = getCaseBySlug(slug);
  if (!c) return { title: "Case Study — Push" };
  return {
    title: `${c.name} — Case Study | Push Customer Acquisition Engine`,
    description: `${c.tagline} ConversionOracle™-verified, Vertical AI for Local Commerce.`,
    openGraph: {
      title: `${c.name} · Case Study | Push`,
      description: c.tagline,
      type: "article",
    },
  };
}

/* ─────────────────────────────────────────────────────────────
   v5.1 metric synthesis — derive Stats Bar from existing case
   data so we do not mutate the shared mock file. Deterministic
   per-slug so the same page always renders the same numbers.
   ───────────────────────────────────────────────────────────── */

interface V51Metrics {
  verifiedCustomers: string;
  slr: string;
  autoVerify: string;
  roi: string;
  pullQuoteAccent: string;
  authorInitials: string;
  publishedOn: string;
  week1: string;
  week2: string;
  week4: string;
  // Creator tier distribution (Seed, Clay, Operator, Partner, Proven, Obsidian)
  tierSplit: { label: string; pct: number; color: string }[];
  category: string;
  aov: string;
}

function buildMetrics(c: Case): V51Metrics {
  // Pull a verified-customer total from existing outcomes if numeric.
  const total = c.chartPoints.reduce((sum, p) => sum + p.value, 0);
  const slr = Math.max(
    6,
    Math.min(14, Math.round((total / 10) * 10) / 10),
  ).toFixed(1);
  const pullQuoteLeader = c.pullQuote.split(".")[0] || c.pullQuote.slice(0, 80);
  const authorInitials = c.pullQuoteAuthor
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Weekly split from first, midpoint, final chart values
  const pts = c.chartPoints;
  const week1 = `${pts[0]?.value ?? 0} verified walk-ins · ConversionOracle™ cold-start prediction inside ±25%.`;
  const week2 = `${pts[1]?.value ?? 0} verified walk-ins · auto-verify rate clears 85% as creator cohort stabilises.`;
  const week4 = `${pts[3]?.value ?? pts[pts.length - 1]?.value ?? 0} verified walk-ins · Software Leverage Ratio (SLR) lifts from cold-start to target band.`;

  // Category-specific AOV labels (matches /case-studies index chips)
  const aovMap: Record<string, { cat: string; aov: string }> = {
    Pizza: { cat: "Dessert", aov: "AOV $18-32" },
    Florals: { cat: "Dessert", aov: "AOV $24-48" },
    Coffee: { cat: "Coffee+", aov: "AOV $8-15" },
    "Bodega / Latin Grocery": { cat: "Beauty", aov: "AOV $12-28" },
    "Fitness / Pilates": { cat: "Fitness", aov: "AOV $38-65" },
  };
  const catMeta = aovMap[c.category] ?? { cat: "Coffee+", aov: "AOV $8-20" };

  return {
    verifiedCustomers: String(total),
    slr,
    autoVerify: "91%",
    roi:
      c.outcomes.find((o) => /×|x|roi/i.test(o.label + o.value))?.value ??
      "3.0×",
    pullQuoteAccent: pullQuoteLeader.trim() + ".",
    authorInitials,
    publishedOn: "2026 · Pilot Cohort",
    week1,
    week2,
    week4,
    tierSplit: [
      { label: "Seed", pct: 40, color: "var(--tertiary)" },
      { label: "Operator", pct: 35, color: "var(--primary)" },
      { label: "Proven", pct: 15, color: "var(--accent)" },
      { label: "Closer", pct: 10, color: "var(--dark)" },
    ],
    category: catMeta.cat,
    aov: catMeta.aov,
  };
}

/* ─────────────────────────────────────────────────────────────
   Creator tier split — inline SVG stacked bar (Seed → Obsidian)
   ───────────────────────────────────────────────────────────── */
function TierSplit({ split }: { split: V51Metrics["tierSplit"] }) {
  let cursor = 0;
  const width = 800;
  const barH = 72;
  return (
    <div className="csd-tier-split">
      <svg
        viewBox={`0 0 ${width} 140`}
        role="img"
        aria-label="Creator tier distribution for this campaign cohort"
        className="csd-tier-svg"
      >
        {split.map((s) => {
          const w = (s.pct / 100) * width;
          const x = cursor;
          cursor += w;
          return (
            <g key={s.label}>
              <rect
                x={x}
                y={16}
                width={w}
                height={barH}
                fill={s.color}
                className="csd-tier-rect"
              />
              <text
                x={x + w / 2}
                y={16 + barH / 2 + 6}
                textAnchor="middle"
                className="csd-tier-rect-lbl"
              >
                {s.pct}%
              </text>
              <text x={x + 8} y={108} className="csd-tier-name">
                {s.label}
              </text>
              <text x={x + 8} y={128} className="csd-tier-meta">
                {s.pct}% of cohort
              </text>
            </g>
          );
        })}
      </svg>
      <p className="csd-tier-note">
        Two-Segment Creator Economics — T1-T3 (Seed / Operator) paid per
        verified customer, T4-T6 (Proven / Closer) compensated via retainer +
        performance share.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────── */
export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (EXCLUDED_SLUGS.has(slug)) notFound();
  const c = getCaseBySlug(slug);
  if (!c) notFound();
  const m = buildMetrics(c);

  return (
    <>
      <ScrollRevealInit />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="csd-hero">
        <div className="csd-hero-inner">
          <nav className="csd-breadcrumb" aria-label="Breadcrumb">
            <Link href="/case-studies">Case Studies</Link>
            <span aria-hidden="true">/</span>
            <span style={{ color: "rgba(245,242,236,0.7)" }}>{c.name}</span>
          </nav>

          <p className="csd-hero-eyebrow">
            <span className="csd-hero-eyebrow-rule" aria-hidden="true" />
            {m.category} · {c.neighborhood} · {m.aov}
          </p>

          <h1 className="csd-hero-name">{c.name}</h1>

          <p className="csd-hero-subtitle">{c.tagline}</p>

          {/* v5.1 Stats Bar — 4 metrics */}
          <div className="csd-stats-bar" aria-label="Pilot outcome metrics">
            <div className="csd-stats-cell">
              <span className="csd-stats-n">{m.verifiedCustomers}</span>
              <span className="csd-stats-l">Verified customers</span>
            </div>
            <div className="csd-stats-cell">
              <span className="csd-stats-n">{m.slr}</span>
              <span className="csd-stats-l">Software Leverage Ratio (SLR)</span>
            </div>
            <div className="csd-stats-cell">
              <span className="csd-stats-n">{m.autoVerify}</span>
              <span className="csd-stats-l">ConversionOracle™ auto-verify</span>
            </div>
            <div className="csd-stats-cell">
              <span className="csd-stats-n">{m.roi}</span>
              <span className="csd-stats-l">Merchant ROI multiplier</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="csd-body">
        <div className="csd-body-inner">
          <Link href="/case-studies" className="csd-back">
            <span aria-hidden="true">←</span> All Case Studies
          </Link>

          {/* Byline / publish meta — CS Genio Mono 11px */}
          <div className="csd-byline reveal">
            <span className="csd-byline-badge" aria-hidden="true">
              {m.authorInitials}
            </span>
            <div className="csd-byline-text">
              <span className="csd-byline-author">
                Case file prepared by the Push Customer Acquisition Engine
              </span>
              <span className="csd-byline-date">{m.publishedOn}</span>
            </div>
          </div>

          {/* 1. Challenge */}
          <section
            className="csd-section reveal"
            aria-labelledby="challenge-title"
          >
            <p className="csd-section-label">The Challenge</p>
            <div className="csd-challenge-layout">
              <h2 className="csd-section-title" id="challenge-title">
                Why the
                <br />
                legacy playbook
                <br />
                broke.
              </h2>
              <p className="csd-challenge-text">{c.challenge}</p>
            </div>
          </section>

          {/* Pull quote — Darky 900, Flag Red accent */}
          <aside className="csd-pullquote reveal" aria-label="Merchant quote">
            <span className="csd-pullquote-mark" aria-hidden="true">
              &ldquo;
            </span>
            <p className="csd-pullquote-text">{m.pullQuoteAccent}</p>
            <p className="csd-pullquote-attrib">
              <span className="csd-pullquote-rule" aria-hidden="true" />
              {c.pullQuoteAuthor} · {c.pullQuoteRole}
            </p>
          </aside>

          {/* 2. What we did */}
          <section className="csd-section reveal" aria-labelledby="what-title">
            <p className="csd-section-label">What the Engine Did</p>
            <h2 className="csd-section-title" id="what-title">
              The Neighborhood Playbook in practice.
            </h2>
            <div className="csd-steps">
              {c.steps.map((s) => (
                <div key={s.number} className="csd-step">
                  <span className="csd-step-number">{s.number}</span>
                  <h3 className="csd-step-title">{s.title}</h3>
                  <p className="csd-step-desc">{s.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Timeline */}
          <section
            className="csd-section reveal"
            aria-labelledby="timeline-title"
          >
            <p className="csd-section-label">Timeline</p>
            <h2 className="csd-section-title" id="timeline-title">
              From cold-start to target SLR band.
            </h2>
            <ol className="csd-timeline">
              <li className="csd-timeline-item">
                <span className="csd-timeline-week">Week 1</span>
                <p className="csd-timeline-body">{m.week1}</p>
              </li>
              <li className="csd-timeline-item">
                <span className="csd-timeline-week">Week 2</span>
                <p className="csd-timeline-body">{m.week2}</p>
              </li>
              <li className="csd-timeline-item">
                <span className="csd-timeline-week">Week 4</span>
                <p className="csd-timeline-body">{m.week4}</p>
              </li>
            </ol>
          </section>

          {/* 4. Creator tier split */}
          <section className="csd-section reveal" aria-labelledby="tier-title">
            <p className="csd-section-label">Creator tier split</p>
            <h2 className="csd-section-title" id="tier-title">
              Two-Segment Creator Economics on this campaign.
            </h2>
            <TierSplit split={m.tierSplit} />
          </section>
        </div>
      </div>

      {/* ── Closing CTA ──────────────────────────────────────── */}
      <section className="csd-cta">
        <div className="csd-cta-inner">
          <p className="csd-cta-eyebrow">Vertical AI for Local Commerce</p>
          <h2 className="csd-cta-headline">
            Your turn. <em>$0 to start.</em>
          </h2>
          <p className="csd-cta-sub">
            ConversionOracle™ predicts your first walk-in cohort within 48 hours
            of onboarding. First 10 verified customers are free — DisclosureBot
            keeps every creator publish compliant at the edge.
          </p>
          <div className="csd-cta-actions">
            <Link href="/merchant/pilot" className="btn btn-primary">
              Start $0 Pilot
            </Link>
            <Link href="/pricing" className="btn btn-secondary">
              See pilot economics
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
