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
    title: `${c.name} — Sample Walkthrough | Push`,
    description: `Illustrative pre-pilot walkthrough for a ${c.category.toLowerCase()} on a ${c.neighborhood.toLowerCase()} block. Numbers are targets, not results — Push hasn't shipped a campaign yet.`,
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
    <div className="csd-result-layout card-premium">
      <p className="csd-chart-label">
        {label}
        <sup
          style={{
            color: "var(--brand-red)",
            fontWeight: 700,
            fontSize: "0.85em",
            verticalAlign: "super",
            marginLeft: 4,
          }}
        >
          *
        </sup>
        <span
          style={{
            display: "block",
            fontSize: 10,
            fontWeight: 600,
            color: "var(--ink-5)",
            letterSpacing: "0.04em",
            textTransform: "none",
            marginTop: 4,
          }}
        >
          *illustrative target curve. push hasn&apos;t run this campaign yet.
        </span>
      </p>
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
      {/* ═══════════════ 01 — HERO ═══════════════ */}
      <section
        className="bg-hero-ink grain-overlay bg-vignette csd-hero"
        style={{
          padding:
            "clamp(64px, 8vw, 128px) clamp(24px, 4vw, 64px) clamp(48px, 6vw, 96px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="csd-hero-inner"
          style={{ position: "relative", zIndex: 3 }}
        >
          {/* Top row: pill + breadcrumb */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: "clamp(32px, 5vw, 56px)",
            }}
          >
            <span className="pill-lux" style={{ color: "#fff" }}>
              Pre-pilot · illustrative
            </span>
            <nav className="csd-breadcrumb" aria-label="Breadcrumb">
              <Link href="/case-studies">Sample walkthroughs</Link>
              <span aria-hidden="true">/</span>
              <span style={{ color: "rgba(245,242,236,0.7)" }}>{c.name}</span>
            </nav>
          </div>

          <div
            className="section-marker"
            data-num="01"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            {c.category.toLowerCase()} · {c.neighborhood.toLowerCase()}
          </div>

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

          {/* Merchant name + ghost subline */}
          <h1 className="csd-hero-name">
            {c.name.toLowerCase()}
            <span aria-hidden="true" style={{ color: "var(--brand-red)" }}>
              .
            </span>
          </h1>
          <div
            className="display-ghost"
            style={{
              fontSize: "clamp(28px, 4vw, 56px)",
              color: "rgba(255,255,255,0.22)",
              marginTop: "-0.04em",
              marginBottom: "clamp(28px, 4vw, 48px)",
            }}
          >
            a brief we&apos;d run.
          </div>

          {/* Lead acknowledging pre-pilot status */}
          <p
            style={{
              maxWidth: 640,
              fontFamily: "var(--font-body)",
              fontSize: "clamp(15px, 1.1vw, 17px)",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.78)",
              marginBottom: "clamp(28px, 4vw, 40px)",
            }}
          >
            this is a sample walkthrough — what a 4–6 week push campaign would
            look like for a {c.category.toLowerCase()} like this one. no scans
            have run. the numbers below are targets the unit economics need to
            clear. we&apos;ll publish actuals after the june&nbsp;22 cohort.
          </p>

          {/* 3 outcome cards — labeled illustrative */}
          <div className="csd-outcomes">
            {c.outcomes.map((o, i) => (
              <div key={i} className="csd-outcome-item">
                <div className="csd-outcome-value">
                  {o.value}
                  <sup
                    style={{
                      color: "var(--brand-red)",
                      fontWeight: 700,
                      fontSize: "0.32em",
                      verticalAlign: "super",
                      marginLeft: 4,
                    }}
                    aria-describedby="ftc-disclosure-detail"
                  >
                    *
                  </sup>
                </div>
                <div className="csd-outcome-label">
                  target · {o.label.toLowerCase()}
                </div>
              </div>
            ))}
          </div>

          <p
            id="ftc-disclosure-detail"
            style={{
              marginTop: "clamp(20px, 3vw, 28px)",
              maxWidth: 640,
              fontFamily: "var(--font-body)",
              fontSize: 11,
              letterSpacing: "0.04em",
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.4)",
            }}
          >
            <strong style={{ color: "rgba(255,255,255,0.6)" }}>
              FTC 16 CFR § 255.
            </strong>{" "}
            illustrative scenario. push has not run a campaign for this venue or
            any venue. all numbers are pre-pilot targets.
          </p>
        </div>
      </section>

      {/* ═══════════════ Body ═══════════════ */}
      <div className="csd-body bg-mesh-editorial">
        <div className="csd-body-inner">
          {/* Back link */}
          <Link href="/case-studies" className="csd-back">
            <span aria-hidden="true">←</span> All sample walkthroughs
          </Link>

          {/* ── 02 The brief (formerly "Challenge") ─────────── */}
          <section className="csd-section reveal" aria-labelledby="brief-title">
            <div className="section-marker" data-num="02">
              The brief
            </div>
            <div className="csd-challenge-layout">
              <h2
                id="brief-title"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(28px, 3.6vw, 48px)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  color: "var(--ink)",
                  margin: 0,
                }}
              >
                what they&apos;d
                <br />
                <span className="display-ghost">ask us to do.</span>
              </h2>
              <p className="csd-challenge-text">{c.challenge}</p>
            </div>
          </section>

          {/* ── 03 The workflow ─────────── */}
          <section className="csd-section reveal" aria-labelledby="flow-title">
            <div className="section-marker" data-num="03">
              The workflow
            </div>
            <h2
              id="flow-title"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 3.6vw, 48px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                color: "var(--ink)",
                margin: "0 0 16px",
              }}
            >
              what a scan day
              <br />
              <span className="display-ghost">would look like.</span>
            </h2>
            <div className="csd-steps">
              {c.steps.map((s) => (
                <div key={s.number} className="csd-step card-premium">
                  <span className="csd-step-number">{s.number}</span>
                  <h3 className="csd-step-title">{s.title}</h3>
                  <p className="csd-step-desc">{s.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── 04 Target curve ─────────── */}
          <section
            className="csd-section reveal"
            aria-labelledby="targets-title"
          >
            <div className="section-marker" data-num="04">
              Target curve
            </div>
            <h2
              id="targets-title"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 3.6vw, 48px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                color: "var(--ink)",
                margin: "0 0 16px",
              }}
            >
              the numbers
              <br />
              <span className="display-ghost">we&apos;d be aiming at.</span>
            </h2>
            <p
              style={{
                maxWidth: 620,
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--ink-4)",
                lineHeight: 1.65,
                margin: "0 0 8px",
              }}
            >
              the curve below is what the unit economics need to look like for
              this venue category in this neighborhood. it isn&apos;t a result —
              it&apos;s the target the workflow has to hit.
            </p>
            <BarChart points={c.chartPoints} label={c.chartLabel} />
          </section>
        </div>
      </div>

      {/* ═══════════════ 05 — Sample friday statement (replacing fabricated quote) ═══════════════ */}
      <section
        className="csd-quote bg-hero-ink grain-overlay"
        style={{ position: "relative" }}
      >
        <div
          className="csd-quote-inner"
          style={{ position: "relative", zIndex: 3 }}
        >
          <div
            className="section-marker"
            data-num="05"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            What a friday statement reads like
          </div>
          <p
            className="csd-quote-text"
            style={{ fontStyle: "normal", fontWeight: 300 }}
          >
            scan logged 4:42pm tuesday. receipt #{c.merchantLogo.toLowerCase()}-
            {c.slug.split("-")[0]}-1142. attributed to creator @
            {c.slug.split("-")[0]}-roster-03. payout ${"{12–18}"} → friday
            stripe transfer.
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "rgba(245,242,236,0.55)",
              marginTop: 16,
              maxWidth: 720,
              lineHeight: 1.6,
            }}
          >
            sample row from a push merchant ledger. illustrative format only —
            the line items, signatures, and amounts shown here are placeholder
            data for a {c.category.toLowerCase()} brief. real ledgers will go
            live after june&nbsp;22.
          </p>
          <div className="csd-quote-author">
            <span className="csd-quote-accent" aria-hidden="true" />
            <div>
              <span className="csd-quote-name">push ledger format</span>
              <br />
              <span className="csd-quote-role">
                draft v0.4 · {c.neighborhood.toLowerCase()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 06 — CTA ═══════════════ */}
      <section className="csd-cta bg-mesh-warm">
        <div className="csd-cta-inner">
          <div
            className="section-marker"
            data-num="06"
            style={{ justifyContent: "center" }}
          >
            What you can do today
          </div>
          <h2 className="csd-cta-headline">
            run this brief
            <br />
            <em>on your block.</em>
          </h2>
          <p className="csd-cta-sub">
            five anchored venues, ten creators, june&nbsp;22 in lower manhattan.
            we&apos;re still seating the second wave — coffee shop on mott,
            fitness studio in tribeca, bakery on lispenard. no card required to
            apply.
          </p>
          <div className="csd-cta-actions">
            <Link href="/for-merchants" className="btn btn-primary">
              Open my venue
            </Link>
            <Link href="/case-studies" className="btn btn-outline">
              Other walkthroughs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
