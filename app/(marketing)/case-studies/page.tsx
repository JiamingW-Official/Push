import Link from "next/link";
import type { Metadata } from "next";
import ScrollRevealInit from "@/components/layout/ScrollRevealInit";
import CaseStudiesGrid from "./CaseStudiesGrid";
import "./case-studies.css";

export const metadata: Metadata = {
  title: "Case Studies — Push | Vertical AI for Local Commerce",
  description:
    "ConversionOracle™-verified walk-ins and attributed revenue for Coffee+, dessert, beauty, and fitness merchants. Real Software Leverage Ratio outcomes — no media spend required.",
  openGraph: {
    title: "Case Studies — Push | Vertical AI for Local Commerce",
    description:
      "Williamsburg Coffee+ beachhead results, Neighborhood Playbook outcomes, ConversionOracle™ prediction accuracy — every metric Claude-Vision verified.",
    type: "website",
  },
};

export default function CaseStudiesPage() {
  return (
    <>
      <ScrollRevealInit />

      {/* ── Header ─────────────────────────────────────────────── */}
      <section className="cs-header">
        <div className="cs-header-inner">
          <p className="cs-eyebrow">
            <span className="cs-eyebrow-rule" aria-hidden="true" />
            Case Studies · Vertical AI for Local Commerce
          </p>
          <h1 className="cs-headline">
            Real merchants.
            <br />
            <em>Verified walk-ins.</em>
          </h1>
          <p className="cs-header-sub">
            Every walk-in below passed through ConversionOracle™ — QR
            attribution plus Claude Vision receipt OCR plus geo-match. These are
            the outcomes our Customer Acquisition Engine delivered, split by
            category. Filter to find your vertical.
          </p>
        </div>
      </section>

      {/* ── Grid + chips ───────────────────────────────────────── */}
      <section className="cs-section">
        <div className="cs-container">
          <CaseStudiesGrid />
        </div>
      </section>

      {/* ── Trailing CTA strip ─────────────────────────────────── */}
      <section className="cs-footer-cta">
        <div className="cs-container cs-footer-cta-inner">
          <div>
            <p className="cs-footer-eyebrow">
              Pilot slots · 11211 / 11206 / 11249
            </p>
            <h2 className="cs-footer-h">
              Williamsburg Coffee+ beachhead is still open.
            </h2>
          </div>
          <div className="cs-footer-ctas">
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
