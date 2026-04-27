import type { Metadata } from "next";
import "./press.css";

export const metadata: Metadata = {
  title: "Press — Push",
  description:
    "Push in the press. Coverage from TechCrunch, Forbes, NYT, and more on the walk-in economy.",
};

/* ─── Press Coverage Data ──────────────────────────────────── */
type PressArticle = {
  id: string;
  publication: string;
  pubShort: string;
  headline: string;
  date: string;
  month: string;
  year: string;
  href: string;
};

const ARTICLES: PressArticle[] = [
  {
    id: "techcrunch-2026-01",
    publication: "TechCrunch",
    pubShort: "TC",
    headline: "Push Brings Performance Marketing to NYC's Restaurant Row",
    date: "JAN 2026",
    month: "JAN",
    year: "2026",
    href: "#",
  },
  {
    id: "forbes-2026-02",
    publication: "Forbes",
    pubShort: "F",
    headline: "The Creator Economy's Foot Traffic Play",
    date: "FEB 2026",
    month: "FEB",
    year: "2026",
    href: "#",
  },
  {
    id: "business-insider-2026-03",
    publication: "Business Insider",
    pubShort: "BI",
    headline: "How NYC Creators Are Earning $10K/Month Without a Manager",
    date: "MAR 2026",
    month: "MAR",
    year: "2026",
    href: "#",
  },
  {
    id: "nyt-2026-03",
    publication: "New York Times",
    pubShort: "NYT",
    headline: "A New Kind of Influencer Deal: Pay When They Walk In",
    date: "MAR 2026",
    month: "MAR",
    year: "2026",
    href: "#",
  },
  {
    id: "eater-2026-04",
    publication: "Eater NY",
    pubShort: "EN",
    headline: "The QR Code That Pays for Your Reservation",
    date: "APR 2026",
    month: "APR",
    year: "2026",
    href: "#",
  },
  {
    id: "fast-company-2026-04",
    publication: "Fast Company",
    pubShort: "FC",
    headline: "Push's Anti-Impressions Model Is Working",
    date: "APR 2026",
    month: "APR",
    year: "2026",
    href: "#",
  },
];

const STATS = [
  { num: "12+", label: "Outlets covered" },
  { num: "NYC", label: "Primary market" },
  { num: "1.4M", label: "Verified visits covered" },
  { num: "2026", label: "Coverage year" },
];

/* ─── Page ──────────────────────────────────────────────────── */
export default function PressPage() {
  return (
    <main className="press-page">
      {/* ═══ 01 — HERO ═══ */}
      <section className="press-hero" aria-labelledby="press-hero-h1">
        {/* Ghost decoration — Darky 100 thin */}
        <span className="press-hero-ghost" aria-hidden="true">
          PRESS
        </span>

        <div className="press-hero-inner">
          {/* Bottom-left anchor: eyebrow + Darky 900 display title */}
          <div className="press-hero-content">
            <span className="eyebrow press-hero-eyebrow">(IN THE NEWS)</span>
            <h1 id="press-hero-h1" className="press-hero-title">
              Push in
              <br />
              the press.
            </h1>
            <div className="press-hero-stats" aria-hidden="true">
              <span className="press-hero-stat">12+ outlets</span>
              <span className="press-hero-stat-dot">·</span>
              <span className="press-hero-stat">NYC coverage</span>
              <span className="press-hero-stat-dot">·</span>
              <span className="press-hero-stat">2026</span>
            </div>
          </div>

          {/* Right: liquid-glass stat badge */}
          <div
            className="press-hero-badge lg-surface--badge"
            aria-label="6 articles in 2026"
          >
            <span className="press-badge-num">{ARTICLES.length}</span>
            <span className="press-badge-label">articles · 2026</span>
          </div>
        </div>
      </section>

      {/* ═══ SIG DIVIDER ═══ */}
      <div className="sig-divider press-sig" aria-hidden="true">
        Covered · Verified · Published ·
      </div>

      {/* ═══ 02 — FEATURED COVERAGE ═══ */}
      <section
        className="press-featured-section"
        aria-labelledby="press-featured-h2"
      >
        <div className="press-featured-card">
          <div className="press-featured-left">
            <span className="eyebrow press-featured-eyebrow">
              (FEATURED COVERAGE)
            </span>
            <blockquote className="press-featured-quote" id="press-featured-h2">
              "A new kind of influencer deal: pay when they walk in."
            </blockquote>
            <div className="press-featured-source">
              <span className="press-featured-outlet">New York Times</span>
              <span className="press-featured-date">March 2026</span>
            </div>
            <a
              href="#"
              className="btn-ghost press-featured-link"
              aria-label="Read New York Times feature"
            >
              Read full story →
            </a>
          </div>

          {/* Outlet badge */}
          <div className="press-featured-badge" aria-hidden="true">
            <span className="press-featured-badge-text">NYT</span>
            <span className="press-featured-badge-sub">New York</span>
          </div>
        </div>
      </section>

      {/* ═══ 03 — PRESS COVERAGE GRID (Candy Panel) ═══ */}
      <section
        className="candy-panel press-grid-section"
        aria-labelledby="press-grid-h2"
      >
        <div className="press-grid-header">
          <span className="eyebrow">(PRESS COVERAGE)</span>
          <h2 id="press-grid-h2" className="press-grid-title">
            Six publications.
            <br />
            <span className="press-grid-title-ghost">
              One story told six ways.
            </span>
          </h2>
        </div>

        <div className="press-grid">
          {ARTICLES.map((article) => (
            <a
              key={article.id}
              href={article.href}
              className="press-card click-shift"
              aria-label={`${article.publication}: ${article.headline}`}
            >
              {/* Publication abbr + name */}
              <div className="press-card-pub-row">
                <span className="press-card-pub-abbr" aria-hidden="true">
                  {article.pubShort}
                </span>
                <span className="press-card-pub-name">
                  {article.publication}
                </span>
              </div>

              {/* Headline — Darky 20px 700 snow */}
              <p className="press-card-headline">{article.headline}</p>

              {/* Footer: date + arrow */}
              <div className="press-card-footer">
                <span className="press-card-date">{article.date}</span>
                <span className="press-card-arrow" aria-hidden="true">
                  →
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ═══ STATS STRIP ═══ */}
      <div className="press-stats-strip" aria-label="Press coverage statistics">
        <div className="press-stats-strip-inner">
          {STATS.map((stat, i) => (
            <div key={i} className="press-stat-item">
              <span className="press-stat-num">{stat.num}</span>
              <span className="press-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ SIG DIVIDER ═══ */}
      <div className="sig-divider press-sig" aria-hidden="true">
        On the record · In print · In pixels ·
      </div>

      {/* ═══ 04 — MEDIA CONTACT (dark char section) ═══ */}
      <section
        className="press-contact-section"
        aria-labelledby="press-contact-h2"
      >
        <div className="press-container">
          <div className="press-contact-inner">
            <div className="press-contact-left">
              <span className="eyebrow press-contact-eyebrow">
                (MEDIA INQUIRIES)
              </span>
              <h2 id="press-contact-h2" className="press-contact-title">
                Media inquiries.
              </h2>
              <p className="press-contact-body">
                Interview requests, embargoed briefings, and asset permissions
                go to one inbox. Jiaming reads every press email himself.
                Average reply under 24 hours on business days.
              </p>
              <div className="press-contact-links">
                <a href="mailto:press@push.nyc" className="press-contact-email">
                  press@push.nyc
                </a>
                <a
                  href="mailto:jiaming@push.nyc?subject=Press%20Kit%20Request"
                  className="btn-ghost press-kit-link click-shift"
                >
                  Download press kit →
                </a>
              </div>
              <p className="press-contact-fine">
                every email read by hand · 24-hour reply on business days
              </p>
            </div>

            {/* Founder card — lg-surface--dark on char bg */}
            <div className="lg-surface--dark press-founder-card">
              <div className="press-founder-avatar" aria-hidden="true">
                JW
              </div>
              <div className="press-founder-info">
                <p className="press-founder-name">Jiaming Wang</p>
                <p className="press-founder-role">Founder</p>
                <p className="press-founder-bio">
                  Mott Street-native. Started Push at the door, not in a deck —
                  the first version was a taped-up QR on Doyers Street. Reads
                  every press email himself.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 05 — TICKET CTA ═══ */}
      <section className="press-ticket-section">
        <div className="press-container">
          <div className="ticket-panel press-ticket">
            {/* Grommet circles — Ticket Panel spec */}
            <span
              className="ticket-grommet ticket-grommet--tl"
              aria-hidden="true"
            />
            <span
              className="ticket-grommet ticket-grommet--tr"
              aria-hidden="true"
            />
            <span
              className="ticket-grommet ticket-grommet--bl"
              aria-hidden="true"
            />
            <span
              className="ticket-grommet ticket-grommet--br"
              aria-hidden="true"
            />

            <div className="press-ticket-inner">
              <span className="eyebrow press-ticket-eyebrow">
                (GET IN TOUCH)
              </span>
              <h2 className="press-ticket-title">Request a press briefing.</h2>
              <a
                href="mailto:press@push.nyc"
                className="btn-ink press-ticket-btn"
              >
                Email press@push.nyc
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
