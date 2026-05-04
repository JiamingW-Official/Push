import Link from "next/link";
import type { Metadata } from "next";
import "./job.css";

export const metadata: Metadata = {
  title: "Senior Full-Stack Engineer — Push Careers",
  description:
    "Build the QR-and-receipt rail that pays NYC creators per verified walk-in. Full-stack, NYC/Remote, pre-pilot.",
};

/* ─── Static role data ──────────────────────────────────────── */
type Benefit = { icon: string; title: string; desc: string };

const ROLE = {
  title: "Senior Full-Stack Engineer",
  team: "Engineering",
  location: "NYC · Remote OK",
  type: "Full-time",
  compensation: "$140–175K + equity",
  aboutRole:
    "You will own the QR-scan-to-payout rail end to end — the webhook that catches the scan, the attribution logic that ties it to a creator, and the Stripe Connect transfer that moves money the same night. No platform team above you, no SRE below you.",
  requirements: [
    "Ship production Next.js and TypeScript across the full stack — no handoffs between front and back",
    "Design and own Postgres schemas; write migrations you could explain to a non-engineer",
    "Integrate third-party APIs (Stripe Connect, Supabase auth, QR generation) without inventing abstractions you don't need",
    "Debug live attribution failures with merchant and creator context in hand",
    "Review your own code before it ships — no rubber-stamp PRs",
    "Operate at a startup pace: one-week cycles, no sprint theater",
  ],
  niceToHave: [
    "Experience with location-aware or event-driven attribution systems",
    "Prior work at a marketplace or payments company",
    "Familiarity with the SoHo / Tribeca restaurant scene (seriously useful)",
  ],
  stats: [
    { num: "$140K", label: "Base salary floor", sub: "NYC market rate" },
    { num: "0.5–1%", label: "Equity range", sub: "4-year vest / 1-year cliff" },
    { num: "Jun 22", label: "Pilot launch", sub: "First QR scanned live" },
  ],
  benefits: [
    {
      icon: "◈",
      title: "Full cap table visibility",
      desc: "You see the equity stack before you sign. No verbal estimates.",
    },
    {
      icon: "◎",
      title: "Health · Dental · Vision",
      desc: "Covered from day one. No waiting period.",
    },
    {
      icon: "⌘",
      title: "Remote-friendly",
      desc: "NYC preferred but not required. Core hours overlap 10am–4pm ET.",
    },
    {
      icon: "▣",
      title: "Equipment budget",
      desc: "$2,500 setup budget. Pick your own machine.",
    },
    {
      icon: "◉",
      title: "Paid work sample",
      desc: "The take-home is scoped, paid at $200/hr, capped at 3 hours.",
    },
    {
      icon: "⬡",
      title: "No on-call roulette",
      desc: "Small team means shared context. Incidents are a team problem, not a pager rotation.",
    },
  ] satisfies Benefit[],
};

/* ─── Page ──────────────────────────────────────────────────── */
export default function JobDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Static render — params.slug available for future dynamic expansion
  void params;

  return (
    <main className="job-page">
      {/* ═══ 01 — HERO ═══ */}
      <section className="job-hero" aria-labelledby="job-hero-h1">
        {/* Ghost team name — Darky 100 thin */}
        <span className="job-hero-ghost" aria-hidden="true">
          ENG
        </span>

        <div className="job-hero-inner">
          {/* Back link — top of inner */}
          <Link href="/careers" className="job-back-link">
            ← All open roles
          </Link>

          {/* Bottom-left content group */}
          <div className="job-hero-content">
            {/* Chip row above title */}
            <div className="job-hero-badges">
              <span className="btn-ghost job-hero-badge">{ROLE.team}</span>
              <span className="btn-ghost job-hero-badge">{ROLE.location}</span>
              <span className="btn-ghost job-hero-badge">{ROLE.type}</span>
            </div>

            <h1 id="job-hero-h1" className="job-hero-title">
              {ROLE.title}
              <span className="job-hero-dot" aria-hidden="true">
                .
              </span>
            </h1>

            <p className="job-hero-about">{ROLE.aboutRole}</p>

            <div className="job-hero-actions">
              <a href="#apply" className="btn-primary job-apply-btn">
                Apply now
              </a>
              <Link href="/careers" className="btn-ghost job-all-btn">
                See all roles →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SIG DIVIDER ═══ */}
      <div className="sig-divider job-sig" aria-hidden="true">
        Build · Ship · Own it end-to-end ·
      </div>

      {/* ═══ 02 — JOB DETAILS ═══ */}
      <section className="job-details-section" aria-labelledby="job-details-h2">
        <div className="job-container">
          <div className="job-details-grid">
            {/* LEFT — Requirements list */}
            <div className="job-requirements">
              <span className="eyebrow">(WHAT YOU&apos;LL DO)</span>
              <h2 id="job-details-h2" className="job-details-title">
                Six things.
                <br />
                <span className="job-details-title-ghost">
                  All real. Day one.
                </span>
              </h2>

              <ol className="job-req-list">
                {ROLE.requirements.map((req, i) => (
                  <li key={i} className="job-req-item">
                    <span className="job-req-num" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="job-req-text">{req}</p>
                  </li>
                ))}
              </ol>

              {ROLE.niceToHave.length > 0 && (
                <div className="job-nice-to-have">
                  <span className="eyebrow">(HELPFUL, NOT REQUIRED)</span>
                  <ul className="job-nth-list">
                    {ROLE.niceToHave.map((item, i) => (
                      <li key={i} className="job-nth-item">
                        ° {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* RIGHT — About Push + KPIs (sticky sidebar) */}
            <aside className="job-about-push">
              <span className="eyebrow">(ABOUT PUSH)</span>
              <p className="job-about-body">
                Push is a NYC creator-commerce platform where local creators get
                paid per verified physical visit they drive to merchant
                locations. QR scan is the conversion event. Stripe Connect moves
                money. Pre-pilot — first scan June 22, 2026.
              </p>

              <div className="job-kpi-grid">
                {ROLE.stats.map((stat) => (
                  <div key={stat.num} className="job-kpi-card">
                    <span className="job-kpi-num">{stat.num}</span>
                    <span className="job-kpi-label">{stat.label}</span>
                    <span className="job-kpi-sub">{stat.sub}</span>
                  </div>
                ))}
              </div>

              {/* Meta rows */}
              <div className="job-sidebar-meta">
                {[
                  { label: "Compensation", value: ROLE.compensation },
                  { label: "Location", value: ROLE.location },
                  { label: "Type", value: ROLE.type },
                  { label: "Pilot launch", value: "June 22, 2026" },
                ].map((row) => (
                  <div key={row.label} className="job-meta-row">
                    <span className="job-meta-label">{row.label}</span>
                    <span className="job-meta-value">{row.value}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ═══ 03 — BENEFITS (Candy Panel butter) ═══ */}
      <section
        className="candy-panel job-benefits-section"
        aria-labelledby="job-benefits-h2"
      >
        <span className="eyebrow">(WHAT YOU GET)</span>
        <h2 id="job-benefits-h2" className="job-benefits-title">
          Plain comp. No theater.
        </h2>
        <div className="job-benefits-grid">
          {ROLE.benefits.map((b) => (
            <div key={b.title} className="job-benefit-card click-shift">
              {/* Icon tile — 40×40 with --r-lg per spec */}
              <div className="job-benefit-icon" aria-hidden="true">
                {b.icon}
              </div>
              <h3 className="job-benefit-title">{b.title}</h3>
              <p className="job-benefit-desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SIG DIVIDER ═══ */}
      <div className="sig-divider job-sig" aria-hidden="true">
        Application · Intro call · Work sample · Offer ·
      </div>

      {/* ═══ 04 — APPLY ═══ */}
      <section
        className="job-apply-section"
        id="apply"
        aria-labelledby="job-apply-h2"
      >
        <div className="job-container">
          <div className="job-apply-inner">
            <div className="job-apply-header">
              <span className="eyebrow">(APPLY)</span>
              <h2 id="job-apply-h2" className="job-apply-title">
                No cover-letter theater.
                <br />
                <span className="job-apply-title-ghost">Just send it.</span>
              </h2>
              <p className="job-apply-sub">
                Send what you&apos;ve shipped. Jiaming reads every application
                by hand. Reply within five business days.
              </p>
            </div>

            {/* Static form — mailto action, no JS submit */}
            <form
              className="job-form"
              action="mailto:careers@push.nyc"
              method="GET"
            >
              <div className="job-form-grid">
                <div className="job-form-field">
                  <label className="job-form-label" htmlFor="apply-name">
                    Full name *
                  </label>
                  <input
                    id="apply-name"
                    name="name"
                    type="text"
                    className="job-form-input"
                    placeholder="Jane Smith"
                    required
                  />
                </div>

                <div className="job-form-field">
                  <label className="job-form-label" htmlFor="apply-email">
                    Email *
                  </label>
                  <input
                    id="apply-email"
                    name="email"
                    type="email"
                    className="job-form-input"
                    placeholder="jane@example.com"
                    required
                  />
                </div>

                <div className="job-form-field job-form-field--full">
                  <label className="job-form-label" htmlFor="apply-linkedin">
                    LinkedIn or portfolio URL
                  </label>
                  <input
                    id="apply-linkedin"
                    name="linkedin"
                    type="url"
                    className="job-form-input"
                    placeholder="https://linkedin.com/in/janesmith"
                  />
                </div>

                <div className="job-form-field job-form-field--full">
                  <label className="job-form-label" htmlFor="apply-message">
                    Why Push? *
                  </label>
                  <textarea
                    id="apply-message"
                    name="message"
                    className="job-form-textarea"
                    rows={6}
                    placeholder="Tell us what you've shipped and what made you read this. Skip the boilerplate."
                    required
                  />
                </div>
              </div>

              <div className="job-form-footer">
                <button type="submit" className="btn-primary job-form-submit">
                  Submit application
                </button>
                <p className="job-form-note">
                  Reply within five business days. Read by hand.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ═══ 05 — TICKET CTA ═══ */}
      <section className="job-ticket-section">
        <div className="job-container">
          <div className="ticket-panel job-ticket">
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

            <div className="job-ticket-inner">
              <span className="eyebrow job-ticket-eyebrow">
                (FIRST SCAN: JUN 22)
              </span>
              <h2 className="job-ticket-title">Ready to build?</h2>
              <a href="#apply" className="btn-ink job-ticket-btn">
                Apply for this seat
              </a>
              <Link href="/careers" className="job-ticket-back">
                View all open roles →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
