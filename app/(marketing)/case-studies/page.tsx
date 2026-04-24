import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { CASES } from "@/lib/cases/mock-cases";
import "./case-studies.css";

export const metadata: Metadata = {
  title: "Case Studies — Push",
  description:
    "Push is pre-pilot. These pages are illustrative walkthroughs of how the math is supposed to work — what a brief looks like, what a scan-day looks like, what a Friday payout statement looks like. No real revenue numbers yet.",
};

export default function CaseStudiesPage() {
  return (
    <>
      {/* ═══════════════ 01 — HERO (Pre-pilot, illustrative) ═══════════════ */}
      <section
        className="bg-hero-ink grain-overlay bg-vignette cs-hero-v7"
        style={{
          position: "relative",
          minHeight: "78vh",
          display: "flex",
          flexDirection: "column",
          padding: "clamp(24px, 4vw, 64px)",
          overflow: "hidden",
        }}
      >
        {/* Top row: pill + date */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            position: "relative",
            zIndex: 3,
          }}
        >
          <span className="pill-lux" style={{ color: "#fff" }}>
            Pre-pilot · illustrative
          </span>
          <span className="eyebrow-lux" style={{ color: "var(--champagne)" }}>
            Real math, no results yet
          </span>
        </div>

        {/* Hero center */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            zIndex: 3,
            maxWidth: 1180,
            margin: "0 auto",
            width: "100%",
            paddingTop: "clamp(48px, 8vh, 96px)",
            paddingBottom: "clamp(48px, 8vh, 96px)",
          }}
        >
          <div
            className="section-marker"
            data-num="01"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Before the pilot
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(56px, 10vw, 168px)",
              fontWeight: 900,
              letterSpacing: "-0.06em",
              lineHeight: 0.88,
              color: "#fff",
              margin: 0,
            }}
          >
            what the math
            <span aria-hidden="true" style={{ color: "var(--brand-red)" }}>
              .
            </span>
          </h1>
          <div
            className="display-ghost"
            style={{
              fontSize: "clamp(40px, 7vw, 132px)",
              color: "rgba(255,255,255,0.22)",
              marginTop: "-0.04em",
            }}
          >
            looks like.
          </div>

          <p
            style={{
              marginTop: "clamp(28px, 4vw, 48px)",
              maxWidth: 640,
              fontFamily: "var(--font-body)",
              fontSize: "clamp(15px, 1.15vw, 18px)",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            push hasn&apos;t shipped a campaign yet. the lower manhattan pilot
            opens june&nbsp;22 — five anchored venues, ten creators, seven
            blocks. no friday payouts have run. no real walk-in numbers exist
            yet to publish.
          </p>
          <p
            style={{
              marginTop: "clamp(14px, 2vw, 22px)",
              maxWidth: 640,
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1vw, 15px)",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            so the pages below aren&apos;t case studies in the usual sense.
            they&apos;re sample walkthroughs of how the workflow is supposed to
            run — a brief, a roster, a scan day, a friday statement. every
            number is a target, not a result, and it&apos;s marked accordingly.
            <sup
              style={{
                color: "var(--champagne)",
                fontWeight: 700,
                fontSize: "0.7em",
                verticalAlign: "super",
                marginLeft: 4,
              }}
              aria-describedby="ftc-disclosure-text"
            >
              *
            </sup>
          </p>

          <p
            id="ftc-disclosure-text"
            style={{
              marginTop: "clamp(20px, 3vw, 32px)",
              maxWidth: 640,
              fontFamily: "var(--font-body)",
              fontSize: 11,
              letterSpacing: "0.04em",
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.38)",
            }}
          >
            <strong style={{ color: "rgba(255,255,255,0.6)" }}>
              FTC 16 CFR § 255 disclosure.
            </strong>{" "}
            illustrative scenarios only. no merchant on this page has run a push
            campaign yet. names of pilot candidates appear with permission;
            otherwise venues are described by category and block.
          </p>
        </div>
      </section>

      {/* ═══════════════ 02 — SAMPLE WALKTHROUGHS ═══════════════ */}
      <section
        className="cs-section bg-mesh-editorial"
        style={{ padding: "clamp(64px, 9vw, 120px) 0" }}
      >
        <div className="cs-container">
          <div style={{ marginBottom: "clamp(40px, 5vw, 64px)" }}>
            <div className="section-marker" data-num="02">
              Sample walkthroughs
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5vw, 72px)",
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 0.95,
                color: "var(--ink)",
                margin: 0,
                maxWidth: 920,
              }}
            >
              five venues we&apos;re opening with.
              <br />
              <span className="display-ghost">five briefs we&apos;d run.</span>
            </h2>
            <p
              style={{
                marginTop: "clamp(20px, 3vw, 32px)",
                maxWidth: 640,
                fontFamily: "var(--font-body)",
                fontSize: "clamp(14px, 1vw, 16px)",
                lineHeight: 1.65,
                color: "var(--ink-4)",
              }}
            >
              each one walks through a real venue category in lower manhattan
              and what a 4–6 week push campaign would look like for them — the
              brief, the creator roster, the scan-day cadence, what a friday
              statement reads like. numbers shown are targets the math hits if
              the workflow runs as designed.
            </p>
          </div>

          <div className="cs-grid">
            {CASES.map((c, i) => (
              <Link
                key={c.slug}
                href={`/case-studies/${c.slug}`}
                className="cs-card cs-card-reveal card-premium"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Hero image */}
                <div className="cs-card-image-wrap photo-frame">
                  <Image
                    src={c.heroImage}
                    alt={c.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="cs-card-image"
                    priority={i < 2}
                  />
                  <span className="cs-card-cat">{c.category}</span>
                  <span className="cs-card-illus" aria-hidden="true">
                    illustrative
                  </span>
                </div>

                {/* Body */}
                <div className="cs-card-body">
                  <div
                    className="section-marker"
                    data-num={String(i + 1).padStart(2, "0")}
                    style={{ marginBottom: 8 }}
                  >
                    {c.category.toLowerCase()}
                  </div>

                  <p className="cs-card-location">{c.neighborhood}</p>

                  <h3 className="cs-card-name">{c.name}</h3>

                  {/* Sample target — big number, with FTC superscript */}
                  <div className="cs-card-outcome">
                    <span className="cs-card-outcome-value">
                      {c.primaryOutcome.value}
                      <sup
                        style={{
                          color: "var(--brand-red)",
                          fontWeight: 700,
                          fontSize: "0.32em",
                          verticalAlign: "super",
                          marginLeft: 4,
                        }}
                      >
                        *
                      </sup>
                    </span>
                    <span className="cs-card-outcome-label">
                      target · {c.primaryOutcome.label.toLowerCase()}
                    </span>
                  </div>

                  <p className="cs-card-tagline">{c.tagline}</p>

                  <div className="cs-card-cta">
                    Read the walkthrough
                    <span className="cs-card-cta-arrow" aria-hidden="true">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 03 — METHODOLOGY ═══════════════ */}
      <section
        className="cs-method"
        style={{
          background: "var(--ink)",
          color: "#fff",
          padding: "clamp(64px, 9vw, 128px) 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="cs-container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 5fr) minmax(0, 7fr)",
              gap: "clamp(32px, 5vw, 96px)",
              alignItems: "start",
            }}
            className="cs-method-grid"
          >
            <div>
              <div
                className="section-marker"
                data-num="03"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                Methodology
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(32px, 4vw, 56px)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  color: "#fff",
                  margin: 0,
                }}
              >
                how the numbers
                <br />
                <span
                  className="display-ghost"
                  style={{
                    color: "rgba(255,255,255,0.28)",
                    fontSize: "0.86em",
                  }}
                >
                  will get measured.
                </span>
              </h2>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(20px, 3vw, 32px)",
              }}
            >
              <div className="card-ink cs-method-card">
                <div className="cs-method-num">a.</div>
                <h3 className="cs-method-title">
                  walk-ins are time-stamped at the register, not at the click.
                </h3>
                <p className="cs-method-body">
                  every push qr scan is logged at the merchant&apos;s point of
                  sale, with a receipt id and a 3-second oracle window. an
                  ad-tech impression doesn&apos;t count. a story view
                  doesn&apos;t count. only a person, in the door, with a
                  receipt.
                </p>
              </div>

              <div className="card-ink cs-method-card">
                <div className="cs-method-num">b.</div>
                <h3 className="cs-method-title">
                  attribution is per-creator, not pooled.
                </h3>
                <p className="cs-method-body">
                  each creator gets a unique scan link. when a customer scans
                  the in-store qr after seeing that creator&apos;s post, the
                  visit is tied to that creator. friday payout reads:{" "}
                  <em>3 visits this week × $14 per verified visit = $42</em>. no
                  estimates, no modeled lift.
                </p>
              </div>

              <div className="card-ink cs-method-card">
                <div className="cs-method-num">c.</div>
                <h3 className="cs-method-title">
                  why these numbers are targets, not results.
                </h3>
                <p className="cs-method-body">
                  push hasn&apos;t shipped a single campaign yet. every figure
                  on these pages is what the unit economics need to clear for
                  the pilot to graduate to phase 2 — sized off comparable
                  loyalty-program conversion benchmarks and the per-visit
                  ceilings merchants told us they&apos;d pay.{" "}
                  <strong style={{ color: "var(--champagne)" }}>
                    the asterisk is real.
                  </strong>{" "}
                  we&apos;ll publish actuals after the june&nbsp;22 cohort
                  finishes its first six weeks.
                </p>
              </div>
            </div>
          </div>

          <div
            className="divider-lux"
            style={{ marginTop: 64, color: "rgba(255,255,255,0.3)" }}
          >
            ftc 16 cfr § 255 compliant
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "clamp(16px, 3vw, 32px)",
            }}
          >
            {[
              {
                label: "venues anchored",
                value: "5",
                note: "soho · tribeca · chinatown",
              },
              {
                label: "creators on roster",
                value: "10",
                note: "tier 2–4, vetted",
              },
              { label: "pilot opens", value: "06.22", note: "first scan-day" },
              {
                label: "campaigns shipped",
                value: "0",
                note: "to date — by design",
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  paddingLeft: 18,
                  borderLeft: `2px solid var(--brand-red)`,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(36px, 3.6vw, 52px)",
                    fontWeight: 200,
                    letterSpacing: "-0.04em",
                    lineHeight: 0.9,
                    color: "#fff",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.78)",
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontFamily: "var(--font-body)",
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {s.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 04 — CTA ═══════════════ */}
      <section
        className="cs-cta-band bg-mesh-warm"
        style={{
          padding: "clamp(64px, 8vw, 112px) 0",
          textAlign: "center",
        }}
      >
        <div className="cs-container">
          <div
            className="section-marker"
            data-num="04"
            style={{ justifyContent: "center" }}
          >
            What you can do today
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 72px)",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 0.95,
              color: "var(--ink)",
              margin: "0 auto 24px",
              maxWidth: 720,
            }}
          >
            be in the first cohort.
            <br />
            <span className="display-ghost">or watch from the sidewalk.</span>
          </h2>
          <p
            style={{
              maxWidth: 540,
              margin: "0 auto",
              fontFamily: "var(--font-body)",
              fontSize: "clamp(14px, 1vw, 16px)",
              lineHeight: 1.65,
              color: "var(--ink-4)",
            }}
          >
            five venues. ten creators. opens june&nbsp;22 in lower manhattan.
            we&apos;re still seating the second wave — coffee shop on mott,
            fitness studio in tribeca, bakery on lispenard.
          </p>
          <div
            style={{
              marginTop: 32,
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/for-merchants" className="btn btn-primary">
              I run a venue
            </Link>
            <Link href="/for-creators" className="btn btn-outline">
              I&apos;m a creator
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
