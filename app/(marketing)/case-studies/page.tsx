import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { CASES } from "@/lib/cases/mock-cases";
import "./case-studies.css";

export const metadata: Metadata = {
  title: "Case Studies — Push",
  description:
    "Real results from real NYC merchants. Verified walk-ins, attributed revenue, and measurable ROI — powered by Push creator campaigns.",
};

export default function CaseStudiesPage() {
  return (
    <>
      {/* ── Header ─────────────────────────────────────────────── */}
      <section className="cs-header">
        <div className="cs-header-inner">
          <p className="cs-eyebrow">Case Studies</p>
          <h1 className="cs-headline">
            Real merchants.
            <br />
            <em>Real results.</em>
          </h1>
          <p className="cs-header-sub">
            Every number is verified. Every walk-in is tracked. These are the
            outcomes Push delivered for five NYC businesses — no ad spend
            required.
          </p>
        </div>
      </section>

      {/* ── Grid ───────────────────────────────────────────────── */}
      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-grid">
            {CASES.map((c, i) => (
              <Link
                key={c.slug}
                href={`/case-studies/${c.slug}`}
                className="cs-card cs-card-reveal"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Hero image */}
                <div className="cs-card-image-wrap">
                  <Image
                    src={c.heroImage}
                    alt={c.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="cs-card-image"
                    priority={i < 2}
                  />
                  <span className="cs-card-cat">{c.category}</span>
                </div>

                {/* Body */}
                <div className="cs-card-body">
                  <p className="cs-card-location">{c.neighborhood}</p>

                  <h2 className="cs-card-name">{c.name}</h2>

                  {/* Primary outcome — big number */}
                  <div className="cs-card-outcome">
                    <span className="cs-card-outcome-value">
                      {c.primaryOutcome.value}
                    </span>
                    <span className="cs-card-outcome-label">
                      {c.primaryOutcome.label}
                    </span>
                  </div>

                  <p className="cs-card-tagline">{c.tagline}</p>

                  <div className="cs-card-cta">
                    Read case study
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
    </>
  );
}
