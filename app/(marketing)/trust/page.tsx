/* ============================================================
   /trust — 5-layer verification + integrity report. v3 (2026-05-08)
   Brand-red accent · 4 sections: hero / 5-layer stack visualization /
   integrity stats / FAQ / CTA.
   ============================================================ */

import type { Metadata } from "next";
import Link from "next/link";
import {
  ScanLine,
  MapPin,
  Clock,
  ShieldAlert,
  Eye,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import "../_styles/mkt.css";
import "./trust.css";

export const metadata: Metadata = {
  title: "Trust · Push",
  description: "How Push verifies every visit — 5-layer integrity pipeline.",
};

const LAYERS = [
  {
    icon: ScanLine,
    name: "Layer 1 · Raw scan",
    desc: "QR poster scanned. Device fingerprint + timestamp logged.",
    color: "ink-5",
  },
  {
    icon: MapPin,
    name: "Layer 2 · Geo verify",
    desc: "Geofence: scan must be ≤30m of merchant address. Spoofs filtered.",
    color: "blue",
  },
  {
    icon: Clock,
    name: "Layer 3 · Time-of-day",
    desc: "Scans must align with merchant business hours + creator post timing.",
    color: "champagne",
  },
  {
    icon: ShieldAlert,
    name: "Layer 4 · Fraud signals",
    desc: "Repeat-from-same-device throttle + bot patterns + velocity anomaly checks.",
    color: "orange",
  },
  {
    icon: Eye,
    name: "Layer 5 · AI Vision",
    desc: "OCR + image-match against poster registry. Final pass before payout.",
    color: "red",
  },
];

export default function TrustPage() {
  return (
    <main
      className="mkt-page mkt-page--red trust-page"
      aria-label="Trust report"
    >
      <header className="mkt-hero">
        <p className="mkt-hero__eyebrow">Trust · integrity report</p>
        <h1 className="mkt-hero__title">How we verify every visit.</h1>
        <p className="mkt-hero__sub">
          Push pays merchants only for verified physical visits. Every scan
          passes through a 5-layer verification pipeline before a creator earns
          commission. Here&apos;s the full breakdown.
        </p>
      </header>

      {/* ── 5-layer stack visualization ────────────────────── */}
      <section className="mkt-section">
        <div className="mkt-section__head">
          <p className="mkt-section__eyebrow">5 layers · 1 verified visit</p>
          <h2 className="mkt-section__title">Stack the fence high.</h2>
          <p className="mkt-section__sub">
            One QR scan must clear every layer. Failures route to manual review.
            Last-mile false-positive rate: 0.18% (Q1 2026).
          </p>
        </div>
        <ol className="trust-stack">
          {LAYERS.map((l, i) => {
            const Icon = l.icon;
            return (
              <li
                key={l.name}
                className={`mkt-panel trust-layer trust-layer--${l.color}`}
                style={{ ["--idx" as string]: i }}
              >
                <span className="trust-layer__num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="trust-layer__icon">
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                <div className="trust-layer__copy">
                  <h3 className="mkt-panel__title">{l.name}</h3>
                  <p className="mkt-panel__body">{l.desc}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ── Integrity stats · 4-up + 1 hero ── */}
      <section className="mkt-section">
        <div className="mkt-section__head">
          <p className="mkt-section__eyebrow">Q1 2026 · transparency</p>
          <h2 className="mkt-section__title">Real numbers.</h2>
        </div>
        <div className="mkt-grid-4">
          <article className="mkt-panel mkt-panel--red">
            <ShieldCheck size={20} strokeWidth={1.75} />
            <p className="mkt-panel__num">98.4%</p>
            <p className="mkt-panel__eyebrow">VERIFICATION RATE</p>
          </article>
          <article className="mkt-panel">
            <AlertTriangle size={20} strokeWidth={1.75} />
            <p className="mkt-panel__num">0.18%</p>
            <p className="mkt-panel__eyebrow">FALSE-POSITIVE RATE</p>
          </article>
          <article className="mkt-panel">
            <CheckCircle2 size={20} strokeWidth={1.75} />
            <p className="mkt-panel__num">412k</p>
            <p className="mkt-panel__eyebrow">VISITS VERIFIED</p>
          </article>
          <article className="mkt-panel">
            <ScanLine size={20} strokeWidth={1.75} />
            <p className="mkt-panel__num">4h</p>
            <p className="mkt-panel__eyebrow">AVG REVIEW TIME</p>
          </article>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="mkt-section">
        <div className="mkt-section__head">
          <p className="mkt-section__eyebrow">FAQ</p>
          <h2 className="mkt-section__title">Common questions.</h2>
        </div>
        <div className="mkt-grid-2 trust-faq">
          {[
            {
              q: "What if a scan fails verification?",
              a: "It routes to manual review. Creator + merchant both see the dispute. Avg resolution: 4 hours.",
            },
            {
              q: "Can creators self-scan to inflate?",
              a: "Geofence + device-fingerprint + repeat-throttle + AI Vision OCR catches this. We've never paid out a self-scan.",
            },
            {
              q: "What signals does Layer 4 use?",
              a: "Velocity (>5 scans/hour same device), known-bot UA strings, suspicious geo hops, off-hours bursts.",
            },
            {
              q: "Where do I dispute?",
              a: "Every visit has a 30-day dispute window. Merchants can flag and we re-verify within 24h.",
            },
          ].map((f) => (
            <article key={f.q} className="mkt-panel">
              <p className="mkt-panel__eyebrow">Q</p>
              <h3 className="mkt-panel__title">{f.q}</h3>
              <p className="mkt-panel__body">{f.a}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="mkt-section">
        <div className="mkt-panel mkt-panel--ink">
          <p className="mkt-panel__eyebrow">Have a question we missed?</p>
          <h2 className="mkt-panel__title">Talk to our integrity team.</h2>
          <div className="mkt-hero__cta-row" style={{ marginTop: 16 }}>
            <Link href="/contact" className="mkt-btn mkt-btn--accent">
              Contact us →
            </Link>
            <Link href="/security" className="mkt-btn mkt-btn--ghost">
              See security policy
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
