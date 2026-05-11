/* ============================================================
   /about — mission + team + timeline. v3 (2026-05-08)
   Champagne accent · 4 sections: hero / mission panel /
   timeline (5 milestones) / team grid (4 founders) / CTA.
   ============================================================ */

import Link from "next/link";
import { Heart, Star, Users, Sparkles } from "lucide-react";
import "../_styles/mkt.css";
import "./about.css";

const TIMELINE = [
  {
    year: "2024",
    label: "Founded",
    desc: "Started in Williamsburg with 3 NYC merchants and a hunch.",
  },
  {
    year: "2025",
    label: "First $10K",
    desc: "10 merchants · 100 creators · $10K verified visits attributed.",
  },
  {
    year: "2026 Q1",
    label: "v5 Launch",
    desc: "Physical-attribution-as-payment goes live. Auto-verify pipeline ships.",
  },
  {
    year: "2026 Q2",
    label: "1,240 creators",
    desc: "All 5 boroughs covered. NYC market locked.",
  },
  {
    year: "2026 Q3",
    label: "Bay Area",
    desc: "Expansion to SF + Oakland. Same model, different blocks.",
  },
];

const TEAM = [
  {
    name: "Jiaming Wang",
    role: "Founder · CEO",
    bio: "Ex-Pinterest. Believes the next Visa is verified physical attribution.",
  },
  {
    name: "Alex C.",
    role: "Head of Creator",
    bio: "Brooklyn-based. Ran the Roberta's pilot. Knows every NYC neighborhood by name.",
  },
  {
    name: "Carlos T.",
    role: "Head of Engineering",
    bio: "Built the AI verification pipeline. Cares more about false positives than scale.",
  },
  {
    name: "Sasha K.",
    role: "Head of Merchant",
    bio: "ex-Square SMB. Onboarded the first 80 NYC shops one block at a time.",
  },
];

export default function AboutPage() {
  return (
    <main
      className="mkt-page mkt-page--champ about-page"
      aria-label="About Push"
    >
      <header className="mkt-hero">
        <p className="mkt-hero__eyebrow">About · NYC, est. 2024</p>
        <h1 className="mkt-hero__title">
          We pay creators for the place they love.
        </h1>
        <p className="mkt-hero__sub">
          Push is the first platform that ties creator content to physical foot
          traffic with a QR scan + AI verification. We&apos;re building the
          rails for hyperlocal creator economy — block by block, merchant by
          merchant.
        </p>
      </header>

      {/* ── Mission · 1 large champagne panel ── */}
      <section className="mkt-section">
        <article className="mkt-panel mkt-panel--champagne about-mission">
          <Heart size={24} strokeWidth={1.75} />
          <p className="mkt-panel__eyebrow">Why we exist</p>
          <h2 className="about-mission__title">
            Reach metrics inflated. Visits don&apos;t.
          </h2>
          <p className="mkt-panel__body">
            Every other influencer platform pays on impressions, engagement, or
            estimated reach — numbers that no merchant ever sees in their
            P&amp;L. Push only pays for verified physical visits. That&apos;s a
            smaller, harder, more honest market — and we like it that way.
          </p>
        </article>
      </section>

      {/* ── Timeline · 5 milestones ── */}
      <section className="mkt-section">
        <div className="mkt-section__head">
          <p className="mkt-section__eyebrow">Timeline · 2024 → today</p>
          <h2 className="mkt-section__title">2 years, 5 milestones.</h2>
        </div>
        <ol className="about-timeline">
          {TIMELINE.map((m, i) => (
            <li key={m.year} className="about-timeline__item">
              <span className="about-timeline__year">{m.year}</span>
              <span className="about-timeline__dot" aria-hidden />
              <div className="about-timeline__copy">
                <h3 className="about-timeline__label">{m.label}</h3>
                <p className="about-timeline__desc">{m.desc}</p>
              </div>
              {i < TIMELINE.length - 1 && (
                <span className="about-timeline__line" aria-hidden />
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* ── Team · 4-up grid ── */}
      <section className="mkt-section">
        <div className="mkt-section__head">
          <p className="mkt-section__eyebrow">Team · 4 founders</p>
          <h2 className="mkt-section__title">Built by NYC operators.</h2>
        </div>
        <div className="mkt-grid-4">
          {TEAM.map((t) => (
            <article key={t.name} className="mkt-panel about-team">
              <span className="about-team__avatar" aria-hidden>
                {t.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <p className="mkt-panel__eyebrow">{t.role}</p>
              <h3 className="mkt-panel__title">{t.name}</h3>
              <p className="mkt-panel__body">{t.bio}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── 3-up stats · ink solid ── */}
      <section className="mkt-section">
        <div className="mkt-grid-3">
          <article className="mkt-panel mkt-panel--ink about-stat">
            <Users size={20} strokeWidth={1.75} />
            <p className="mkt-panel__num">1,240</p>
            <p className="mkt-panel__eyebrow">NYC creators</p>
          </article>
          <article className="mkt-panel about-stat">
            <Star size={20} strokeWidth={1.75} />
            <p className="mkt-panel__num">86</p>
            <p className="mkt-panel__eyebrow">Active merchants</p>
          </article>
          <article className="mkt-panel about-stat">
            <Sparkles size={20} strokeWidth={1.75} />
            <p className="mkt-panel__num">$1.2M</p>
            <p className="mkt-panel__eyebrow">Attributed YTD</p>
          </article>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mkt-section">
        <div className="mkt-panel mkt-panel--champagne">
          <h2 className="mkt-panel__title">Want to work with us?</h2>
          <p className="mkt-panel__body">
            We&apos;re hiring engineers, ops, and creator-relations folk in NYC.
          </p>
          <div className="mkt-hero__cta-row" style={{ marginTop: 16 }}>
            <Link href="/careers" className="mkt-btn mkt-btn--primary">
              See open roles →
            </Link>
            <Link href="/contact" className="mkt-btn mkt-btn--ghost">
              Say hello
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
