/* ============================================================
   /security — security commitments + compliance + report. v3 (2026-05-08)
   Ink accent · 4 sections: hero / 6 commitments grid / compliance badges /
   responsible disclosure CTA.
   ============================================================ */

import type { Metadata } from "next";
import Link from "next/link";
import {
  Lock,
  KeyRound,
  Server,
  FileLock2,
  ShieldCheck,
  AlertCircle,
  Award,
} from "lucide-react";
import "../_styles/mkt.css";
import "./security.css";

export const metadata: Metadata = {
  title: "Security · Push",
  description:
    "Push security commitments, compliance, and responsible disclosure.",
};

const COMMITMENTS = [
  {
    icon: Lock,
    title: "Encryption everywhere",
    desc: "TLS 1.3 in transit · AES-256 at rest · Zero plaintext PII in logs.",
  },
  {
    icon: KeyRound,
    title: "Least-privilege access",
    desc: "Service-role keys scoped per route. No shared admin tokens.",
  },
  {
    icon: Server,
    title: "Hardened infra",
    desc: "Next.js 15 on Vercel · Supabase row-level security · 99.95% SLA.",
  },
  {
    icon: FileLock2,
    title: "PII minimization",
    desc: "We collect only what's needed for verification + payouts. Auto-purge after retention window.",
  },
  {
    icon: ShieldCheck,
    title: "Audit trail",
    desc: "Every admin action logged with operator + timestamp · 7-year retention.",
  },
  {
    icon: AlertCircle,
    title: "Incident response",
    desc: "On-call 24/7 · Sub-1h acknowledgement · Public postmortem within 14d.",
  },
];

const COMPLIANCE = [
  { name: "SOC 2 Type II", status: "in-progress", date: "Q3 2026" },
  { name: "GDPR", status: "active", date: "Compliant" },
  { name: "CCPA", status: "active", date: "Compliant" },
  { name: "FTC § 255", status: "active", date: "Disclosure-aware" },
];

export default function SecurityPage() {
  return (
    <main
      className="mkt-page mkt-page--ink security-page"
      aria-label="Security"
    >
      <header className="mkt-hero">
        <p className="mkt-hero__eyebrow">Security · trust by design</p>
        <h1 className="mkt-hero__title">Built for the long term.</h1>
        <p className="mkt-hero__sub">
          Push handles real money, real PII, and real merchant data. Here&apos;s
          how we secure it — every commitment, every compliance, every
          responsible-disclosure path.
        </p>
      </header>

      {/* ── 6 commitments · 3x2 grid ── */}
      <section className="mkt-section">
        <div className="mkt-section__head">
          <p className="mkt-section__eyebrow">6 commitments</p>
          <h2 className="mkt-section__title">What we promise.</h2>
        </div>
        <div className="mkt-grid-3 sec-commitments">
          {COMMITMENTS.map((c) => {
            const Icon = c.icon;
            return (
              <article key={c.title} className="mkt-panel">
                <span className="sec-commitment__icon">
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                <h3 className="mkt-panel__title">{c.title}</h3>
                <p className="mkt-panel__body">{c.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Compliance badges · 4 horizontal ── */}
      <section className="mkt-section">
        <div className="mkt-section__head">
          <p className="mkt-section__eyebrow">Compliance</p>
          <h2 className="mkt-section__title">Where we stand.</h2>
        </div>
        <div className="sec-compliance">
          {COMPLIANCE.map((c) => (
            <article
              key={c.name}
              className={`mkt-panel sec-compliance__item sec-compliance__item--${c.status}`}
            >
              <Award size={20} strokeWidth={1.75} />
              <p className="mkt-panel__eyebrow">{c.date}</p>
              <h3 className="mkt-panel__title">{c.name}</h3>
              <span
                className={`sec-compliance__badge sec-compliance__badge--${c.status}`}
              >
                {c.status === "active" ? "Active" : "In progress"}
              </span>
            </article>
          ))}
        </div>
      </section>

      {/* ── Responsible disclosure ── */}
      <section className="mkt-section">
        <div className="mkt-grid-2">
          <article className="mkt-panel mkt-panel--ink">
            <ShieldCheck size={22} strokeWidth={1.75} />
            <p className="mkt-panel__eyebrow">Responsible disclosure</p>
            <h3 className="mkt-panel__title">Found a vulnerability?</h3>
            <p className="mkt-panel__body">
              Email security@push.nyc with details. We acknowledge in &lt;24h
              and triage within 72h. Bug bounty program launches Q3 2026.
            </p>
            <div className="mkt-hero__cta-row" style={{ marginTop: 16 }}>
              <a
                href="mailto:security@push.nyc"
                className="mkt-btn mkt-btn--accent"
              >
                security@push.nyc →
              </a>
            </div>
          </article>
          <article className="mkt-panel mkt-panel--champagne">
            <p className="mkt-panel__eyebrow">PGP key</p>
            <h3 className="mkt-panel__title">Encrypted reports</h3>
            <p className="mkt-panel__body">
              Sensitive reports? Use our PGP key. Fingerprint:{" "}
              <code className="sec-pgp">A1B2 C3D4 E5F6 ...</code>
            </p>
            <Link href="/pgp.asc" className="sec-pgp-link">
              Download key →
            </Link>
          </article>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mkt-section">
        <div className="mkt-panel">
          <p className="mkt-panel__eyebrow">Need something else?</p>
          <h2 className="mkt-panel__title">Read the full trust report.</h2>
          <p className="mkt-panel__body">
            5-layer verification, integrity stats, dispute process — all in one
            place.
          </p>
          <div className="mkt-hero__cta-row" style={{ marginTop: 16 }}>
            <Link href="/trust" className="mkt-btn mkt-btn--primary">
              Trust report →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
