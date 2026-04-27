import Link from "next/link";
import type { Metadata } from "next";
import "./careers.css";

export const metadata: Metadata = {
  title: "Careers — Push",
  description:
    "Build the walk-in economy. Five open roles in NYC. Pre-pilot, pre-scale — join before the first scan.",
};

/* ─── Values ───────────────────────────────────────────────── */
type Value = {
  num: string;
  title: string;
  desc: string;
};

const VALUES: Value[] = [
  {
    num: "01",
    title: "Ship the whole thing.",
    desc: "No half-features. If you build it, you own it end-to-end — the QR, the payout, the dispute resolution, the creator complaint at 11pm.",
  },
  {
    num: "02",
    title: "Walk the block.",
    desc: "The product lives on Mott Street and Doyers. You should too — at least once. The restaurant owner is the user. Act like it.",
  },
  {
    num: "03",
    title: "Equity over theater.",
    desc: "Salaries are honest, not lavish. The cap table is clean and you'll see it before you sign. Ownership in something real beats a free lunch.",
  },
];

/* ─── Culture KPIs ─────────────────────────────────────────── */
const CULTURE_KPIS = [
  { num: "5", label: "Team members" },
  { num: "100%", label: "Remote-friendly" },
  { num: "NYC", label: "Based in lower Manhattan" },
];

/* ─── Open Roles ───────────────────────────────────────────── */
type Role = {
  num: string;
  title: string;
  team: string;
  location: string;
  slug: string;
};

const ROLES: Role[] = [
  {
    num: "01",
    title: "Senior Full-Stack Engineer",
    team: "Engineering",
    location: "NYC · Remote OK",
    slug: "senior-fullstack-engineer",
  },
  {
    num: "02",
    title: "Product Designer — Creator Experience",
    team: "Design",
    location: "NYC",
    slug: "product-designer-creator",
  },
  {
    num: "03",
    title: "Creator Network Lead",
    team: "Operations",
    location: "NYC",
    slug: "creator-network-lead",
  },
  {
    num: "04",
    title: "Merchant Success Manager",
    team: "Growth",
    location: "NYC",
    slug: "merchant-success-manager",
  },
  {
    num: "05",
    title: "Data Engineer — Attribution",
    team: "Data",
    location: "NYC · Remote OK",
    slug: "attribution-data-engineer",
  },
];

/* ─── Page ──────────────────────────────────────────────────── */
export default function CareersPage() {
  return (
    <main className="careers-page">
      {/* ═══ 01 — HERO ═══ */}
      <section className="careers-hero" aria-labelledby="careers-hero-h1">
        {/* Ghost "JOIN" decoration */}
        <span className="careers-hero-ghost" aria-hidden="true">
          JOIN
        </span>

        <div className="careers-hero-inner">
          {/* Bottom-left anchor: eyebrow + Darky 900 display */}
          <div className="careers-hero-content">
            <span className="eyebrow careers-hero-eyebrow">(JOIN US)</span>
            <h1 id="careers-hero-h1" className="careers-hero-title">
              Build the walk-in
              <br />
              economy.
            </h1>
          </div>

          {/* Right: liquid-glass stat badge */}
          <div
            className="careers-hero-badge lg-surface--badge"
            aria-label="NYC team, 5 people"
          >
            <span className="careers-badge-size">5</span>
            <span className="careers-badge-stat">NYC team</span>
          </div>
        </div>
      </section>

      {/* ═══ SIG DIVIDER ═══ */}
      <div className="sig-divider careers-sig" aria-hidden="true">
        Build · Ship · Walk the block ·
      </div>

      {/* ═══ 02 — VALUES (Candy Panel butter) ═══ */}
      <section
        className="candy-panel careers-values-section"
        aria-labelledby="careers-values-h2"
      >
        <div className="careers-values-header">
          <span className="eyebrow">(HOW WE WORK)</span>
          <h2 id="careers-values-h2" className="careers-values-title">
            Three things we mean.
          </h2>
        </div>

        {/* Numbered editorial rows — large num | H3 title | body */}
        <div className="careers-values-grid">
          {VALUES.map((v) => (
            <div key={v.num} className="careers-value-row">
              <span className="careers-value-num" aria-hidden="true">
                {v.num}
              </span>
              <h3 className="careers-value-title">{v.title}</h3>
              <p className="careers-value-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 03 — CULTURE (Candy Panel sky) ═══ */}
      <section
        className="candy-panel careers-culture-section"
        aria-labelledby="careers-culture-h2"
      >
        <div className="careers-culture-inner">
          <div className="careers-culture-header">
            <span className="eyebrow">(THE TEAM)</span>
            <h2 id="careers-culture-h2" className="careers-culture-title">
              Small team.
              <br />
              Full ownership.
            </h2>
          </div>

          <div className="careers-culture-kpis">
            {CULTURE_KPIS.map((kpi) => (
              <div key={kpi.label} className="careers-kpi-card">
                <span className="careers-kpi-num">{kpi.num}</span>
                <span className="careers-kpi-label">{kpi.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SIG DIVIDER ═══ */}
      <div className="sig-divider careers-sig" aria-hidden="true">
        Five roles · Lower Manhattan · June 22 ·
      </div>

      {/* ═══ 04 — OPEN ROLES (dark char section) ═══ */}
      <section
        className="careers-roles-section"
        id="open-roles"
        aria-labelledby="careers-roles-h2"
      >
        <div className="careers-container">
          <div className="careers-roles-header">
            <span className="eyebrow careers-roles-eyebrow">(OPEN ROLES)</span>
            <h2 id="careers-roles-h2" className="careers-roles-title">
              Five seats.
              <br />
              <span className="careers-roles-title-ghost">
                Pre-pilot. Pre-scale.
              </span>
            </h2>
            <p className="careers-roles-sub">
              Each role below is for someone who wants to be in the room when
              the first QR scans on June 22. No management layer above you. No
              platform team below you. Just the work.
            </p>
          </div>

          <ol className="careers-roles-list" aria-label="Open positions">
            {ROLES.map((role) => (
              <li key={role.slug} className="careers-role-item">
                <Link
                  href={`/careers/${role.slug}`}
                  className="careers-role-link"
                  aria-label={`${role.title} — ${role.team}, ${role.location}`}
                >
                  <span className="careers-role-num" aria-hidden="true">
                    {role.num}
                  </span>
                  <div className="careers-role-text">
                    <span className="careers-role-title">{role.title}</span>
                    <span className="careers-role-meta">
                      {role.team} · {role.location}
                    </span>
                  </div>
                  {/* Chips — team + location */}
                  <div className="careers-role-tags" aria-hidden="true">
                    <span className="careers-role-tag">{role.team}</span>
                    <span className="careers-role-tag">{role.location}</span>
                  </div>
                  <span className="careers-role-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══ 05 — TICKET CTA ═══ */}
      <section className="careers-ticket-section">
        <div className="careers-container">
          <div className="ticket-panel careers-ticket">
            {/* Grommet circles */}
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

            <div className="careers-ticket-inner">
              <span className="eyebrow careers-ticket-eyebrow">
                (NO OPEN SEAT?)
              </span>
              <h2 className="careers-ticket-title">
                Join the walk-in economy.
              </h2>
              <p className="careers-ticket-body">
                Don&apos;t see the role? Write anyway — your work, the blocks
                you walk, what you want to build. We read every note by hand.
              </p>
              <a
                href="mailto:careers@push.nyc"
                className="btn-ink careers-ticket-btn"
              >
                Email careers@push.nyc
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
