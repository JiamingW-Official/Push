/* ============================================================
   /careers — values + open roles + apply CTA. v3 (2026-05-08)
   GA-orange accent · 4 sections: hero / 4 values grid / open roles
   list with role chips / apply CTA.
   ============================================================ */

import Link from "next/link";
import type { Metadata } from "next";
import { Compass, Hammer, Heart, Sparkles, ArrowRight } from "lucide-react";
import "../_styles/mkt.css";
import "./careers.css";

export const metadata: Metadata = {
  title: "Careers · Push",
  description:
    "Join the Push team — NYC-based, remote-friendly, building the rails for verified physical attribution.",
};

const VALUES = [
  {
    icon: Compass,
    title: "NYC-first",
    desc: "We work in our own neighborhoods. The product gets better because we're customers.",
  },
  {
    icon: Hammer,
    title: "Ship sober",
    desc: "We over-index on integrity, audit trails, and getting payouts right. Move fast, don't break trust.",
  },
  {
    icon: Heart,
    title: "Pay creators",
    desc: "Every product decision starts with: does this make creators more money or less?",
  },
  {
    icon: Sparkles,
    title: "Long horizon",
    desc: "We're building rails for the next 20 years, not next quarter's growth dashboard.",
  },
];

const ROLES = [
  {
    team: "Engineering",
    title: "Senior full-stack engineer",
    location: "NYC / Remote",
    type: "Full-time",
  },
  {
    team: "Engineering",
    title: "ML / vision engineer",
    location: "NYC / Remote",
    type: "Full-time",
  },
  {
    team: "Operations",
    title: "Trust & integrity ops lead",
    location: "NYC",
    type: "Full-time",
  },
  {
    team: "Creator",
    title: "Creator success manager",
    location: "NYC",
    type: "Full-time",
  },
  {
    team: "Merchant",
    title: "Merchant success — Brooklyn",
    location: "Brooklyn, NYC",
    type: "Full-time",
  },
  {
    team: "Design",
    title: "Senior product designer",
    location: "NYC / Remote",
    type: "Contract → FT",
  },
];

export default function CareersPage() {
  return (
    <main
      className="mkt-page mkt-page--orange careers-page"
      aria-label="Careers"
    >
      <header className="mkt-hero">
        <p className="mkt-hero__eyebrow">Careers · NYC, remote-friendly</p>
        <h1 className="mkt-hero__title">Build the rails for hyperlocal.</h1>
        <p className="mkt-hero__sub">
          Push is a small team based in NYC. We build the verification pipeline,
          the creator app, and the merchant tooling that makes
          physical-attribution-as-payment work. {ROLES.length} open roles.
        </p>
        <div className="mkt-hero__cta-row">
          <a href="#open-roles" className="mkt-btn mkt-btn--primary">
            See open roles ↓
          </a>
          <Link href="/about" className="mkt-btn mkt-btn--ghost">
            Meet the team
          </Link>
        </div>
      </header>

      {/* ── 4 values · 4-up grid ── */}
      <section className="mkt-section">
        <div className="mkt-section__head">
          <p className="mkt-section__eyebrow">How we work · 4 values</p>
          <h2 className="mkt-section__title">What you sign up for.</h2>
        </div>
        <div className="mkt-grid-4">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            const isHero = i === 0;
            return (
              <article
                key={v.title}
                className={"mkt-panel" + (isHero ? " mkt-panel--orange" : "")}
              >
                <span className="careers-val__icon">
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                <h3 className="mkt-panel__title">{v.title}</h3>
                <p className="mkt-panel__body">{v.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Open roles list ── */}
      <section className="mkt-section" id="open-roles">
        <div className="mkt-section__head">
          <p className="mkt-section__eyebrow">
            {ROLES.length} open roles · Q2 2026
          </p>
          <h2 className="mkt-section__title">Pick yours.</h2>
        </div>
        <ul className="careers-roles">
          {ROLES.map((r) => (
            <li key={r.title} className="careers-role">
              <div className="careers-role__head">
                <span className="careers-role__team">{r.team}</span>
                <span className="careers-role__type">{r.type}</span>
              </div>
              <h3 className="careers-role__title">{r.title}</h3>
              <div className="careers-role__foot">
                <span className="careers-role__loc">{r.location}</span>
                <span className="careers-role__cta">
                  Apply <ArrowRight size={14} strokeWidth={2.25} />
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Apply CTA ── */}
      <section className="mkt-section">
        <div className="mkt-panel mkt-panel--ink">
          <p className="mkt-panel__eyebrow">Don&apos;t see your role?</p>
          <h2 className="mkt-panel__title">Tell us what you&apos;d build.</h2>
          <p className="mkt-panel__body">
            We hire generalists. If you have an idea for what Push should be
            doing and the skills to ship it — say so.
          </p>
          <div className="mkt-hero__cta-row" style={{ marginTop: 16 }}>
            <a
              href="mailto:careers@push.nyc"
              className="mkt-btn mkt-btn--accent"
            >
              careers@push.nyc →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
