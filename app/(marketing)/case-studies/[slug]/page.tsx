import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CASES, getCaseBySlug } from "@/lib/cases/mock-cases";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import "../case-studies.css";

/* ── Static generation ─────────────────────────────────────── */
export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) return { title: "Case Study — Push" };
  return {
    title: `${c.name} — Case Study | Push`,
    description: c.tagline,
  };
}

/* ── Bar chart helper ──────────────────────────────────────── */
function BarChart({
  points,
  label,
}: {
  points: { label: string; value: number }[];
  label: string;
}) {
  const max = Math.max(...points.map((p) => p.value));
  return (
    <div className="csd-result-layout">
      <p className="csd-chart-label">{label}</p>
      <div className="csd-bar-chart" role="img" aria-label={label}>
        {points.map((p, i) => {
          const heightPct = Math.round((p.value / max) * 100);
          return (
            <div key={i} className="csd-bar-col">
              <span className="csd-bar-val">{p.value}</span>
              <div
                className="csd-bar"
                style={{
                  height: `${heightPct}%`,
                  animationDelay: `${i * 80}ms`,
                }}
                aria-label={`${p.label}: ${p.value}`}
              />
            </div>
          );
        })}
      </div>
      <div className="csd-chart-x">
        {points.map((p, i) => (
          <span key={i} className="csd-chart-x-item">
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────── */
export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) notFound();

  return (
    <>
      <ScrollRevealInit />
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="csd-hero">
        <div className="csd-hero-inner">
          {/* Breadcrumb */}
          <nav className="csd-breadcrumb" aria-label="Breadcrumb">
            <Link href="/case-studies">Case Studies</Link>
            <span aria-hidden="true">/</span>
            <span style={{ color: "rgba(245,242,236,0.7)" }}>{c.name}</span>
          </nav>

          {/* Logo + meta */}
          <div className="csd-hero-meta">
            <div className="csd-logo" aria-hidden="true">
              {c.merchantLogo}
            </div>
            <div className="csd-meta-text">
              <span className="csd-category">{c.category}</span>
              <span className="csd-location">{c.neighborhood}</span>
            </div>
          </div>

          {/* Merchant name */}
          <h1 className="csd-hero-name">{c.name}</h1>

          {/* 3 outcome cards */}
          <div className="csd-outcomes">
            {c.outcomes.map((o, i) => (
              <div key={i} className="csd-outcome-item">
                <div className="csd-outcome-value">{o.value}</div>
                <div className="csd-outcome-label">{o.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="csd-body">
        <div className="csd-body-inner">
          {/* Back link */}
          <Link href="/case-studies" className="csd-back">
            <span aria-hidden="true">←</span> All Case Studies
          </Link>

          {/* 1. Challenge */}
          <section
            className="csd-section reveal"
            aria-labelledby="challenge-title"
          >
            <p className="csd-section-label">The Challenge</p>
            <div className="csd-challenge-layout">
              <h2 className="csd-section-title" id="challenge-title">
                In their
                <br />
                own words
              </h2>
              <p className="csd-challenge-text">{c.challenge}</p>
            </div>
          </section>

          {/* 2. What we did */}
          <section className="csd-section reveal" aria-labelledby="what-title">
            <p className="csd-section-label">What We Did</p>
            <h2 className="csd-section-title" id="what-title">
              The playbook
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

          {/* 3. Results */}
          <section
            className="csd-section reveal"
            aria-labelledby="results-title"
          >
            <p className="csd-section-label">The Result</p>
            <h2 className="csd-section-title" id="results-title">
              By the numbers
            </h2>
            <BarChart points={c.chartPoints} label={c.chartLabel} />
          </section>
        </div>
      </div>

      {/* ── Pull Quote ───────────────────────────────────────── */}
      <blockquote className="csd-quote">
        <div className="csd-quote-inner">
          <p className="csd-quote-text">{c.pullQuote}</p>
          <div className="csd-quote-author">
            <span className="csd-quote-accent" aria-hidden="true" />
            <div>
              <span className="csd-quote-name">{c.pullQuoteAuthor}</span>
              <br />
              <span className="csd-quote-role">{c.pullQuoteRole}</span>
            </div>
          </div>
        </div>
      </blockquote>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="csd-cta">
        <div className="csd-cta-inner">
          <p className="csd-cta-eyebrow">Get Started</p>
          <h2 className="csd-cta-headline">
            Want <em>similar</em>
            <br />
            results?
          </h2>
          <p className="csd-cta-sub">
            Launch your first Push campaign in under 10 minutes. No media
            budget. No guesswork. Just verified walk-ins and attributed revenue.
          </p>
          <div className="csd-cta-actions">
            <Link href="/for-merchants" className="btn btn-primary">
              Start for free
            </Link>
            <Link href="/case-studies" className="btn btn-outline">
              More case studies
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
