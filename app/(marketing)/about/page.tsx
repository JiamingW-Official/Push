// v11 About Page — Mission Hero · Team · Sig Divider · Press/Stats
// Design.md v11: bottom-left anchor, closed color list, 8px grid, 5 unified button variants
// Panel register: surface → surface-2 → sig divider → surface (KPI+Press) → surface-2 (CTA)

import type { Metadata } from "next";
import Link from "next/link";
import "./about.css";

export const metadata: Metadata = {
  title: "About Push — Built in Brooklyn",
  description:
    "Push started on Mott Street because that's where we live, eat, and know by name. Performance marketing on the street — pay per verified visit.",
};

/* ── Team data ─────────────────────────────────────────────── */
const TEAM = [
  {
    initial: "J",
    name: "Jiaming Wang",
    role: "FOUNDER · CEO",
    origin: "Mott Street native · Built Push from a restaurant booth",
  },
  {
    initial: "?",
    name: "—",
    role: "ENGINEERING · ATTRIBUTION",
    origin: "QR → scan → payout rail · Previously Square",
  },
  {
    initial: "?",
    name: "—",
    role: "OPERATIONS · CREATOR SIDE",
    origin: "Reads every application · Walks Tribeca on weekends",
  },
  {
    initial: "?",
    name: "—",
    role: "DESIGN · BRAND SURFACE",
    origin: "Sets the type, the color, the weight",
  },
  {
    initial: "?",
    name: "—",
    role: "GROWTH · MERCHANT SIDE",
    origin: "Cold-opens new neighborhoods · Brooklyn-born",
  },
];

/* ── Values data ─────────────────────────────────────────────── */
const VALUES = [
  {
    icon: "◎",
    title: "Verified only.",
    desc: "QR scan + GPS dwell + timestamp. If all three don't match, it doesn't count.",
  },
  {
    icon: "⬡",
    title: "Real blocks.",
    desc: "Our network lives in the neighborhoods they promote. We expand only when we can verify the same ground-level density.",
  },
  {
    icon: "▲",
    title: "Presence counts.",
    desc: "Creator payouts flow directly from foot traffic — no intermediary margin, no impression math.",
  },
];

/* ── KPI Stats ───────────────────────────────────────────────── */
const STATS = [
  { num: "12", label: "Cities" },
  { num: "4K+", label: "Creators" },
  { num: "100+", label: "Merchants" },
  { num: "1.4M+", label: "Scans" },
];

export default function AboutPage() {
  return (
    <main className="about-page">
      {/* ═══════════════════════════════════════════════════════
          PANEL 1 — Mission Hero · background: var(--surface)
          Bottom-left anchored title · eyebrow · mission body
          ═══════════════════════════════════════════════════════ */}
      <section className="about-hero">
        {/* Decorative ghost — SVG visual effect, exempt per § 2.7 */}
        <span aria-hidden="true" className="about-hero-ghost">
          NYC
        </span>

        {/* Bottom-left anchored title block (§ 7.1) */}
        <div className="about-hero-inner">
          <p className="about-eyebrow">(ABOUT·PUSH)</p>

          {/* H1 — Darky Display, bottom-left anchor, clamp(40,5vw,72) per § 3.1 */}
          <h1 className="about-hero-h1">
            Built in
            <br />
            Brooklyn.
          </h1>

          {/* Mission statement — 18px CS Genio Mono per brief */}
          <p className="about-hero-mission">
            Push started in Williamsburg because that&rsquo;s where we live,
            eat, and know by name. Performance marketing on the street — pay per
            verified visit.
          </p>

          <Link href="/creator/signup" className="btn-primary click-shift">
            Join Push
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PANEL 2 — Team / Values · background: var(--surface-2)
          H2 top-left "The team" in Darky 40px
          Team cards: r-md 10px, hover shift
          Values cards: r-md 10px, surface bg, 40×40 icon tile
          ═══════════════════════════════════════════════════════ */}
      <section className="about-team-section">
        <div className="about-section-inner">
          {/* Team sub-panel */}
          <div className="about-team-block">
            <p className="about-eyebrow about-eyebrow--ink">(THE TEAM)</p>
            {/* H2 exactly 40px per § 3.1, top-left */}
            <h2 className="about-team-h2">The team</h2>

            {/* 5-col team grid, gap 24px per § 6.6 */}
            <div className="about-team-grid">
              {TEAM.map((member) => (
                <div
                  key={member.name + member.role}
                  className="about-team-card click-shift"
                >
                  {/* Avatar — 1:1 photo card style with gradient overlay */}
                  <div className="about-team-avatar">
                    <span className="about-team-initial">{member.initial}</span>
                    {/* Gradient overlay per photo card spec */}
                    <div className="about-team-avatar-overlay" aria-hidden />
                    <div className="about-team-avatar-meta">
                      {/* Name: Darky 20px */}
                      <p className="about-team-name">{member.name}</p>
                      {/* Role: mono 12px */}
                      <p className="about-team-role">{member.role}</p>
                    </div>
                  </div>
                  {/* Bio below card */}
                  <p className="about-team-origin">{member.origin}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Values sub-panel — 3 cards in surface bg */}
          <div className="about-values-block">
            <p className="about-eyebrow about-eyebrow--ink">
              (WHAT WE BELIEVE)
            </p>
            <h2 className="about-team-h2">
              Three rules
              <br />
              we don&rsquo;t break.
            </h2>

            <div className="about-values-grid">
              {VALUES.map((v) => (
                <div key={v.title} className="about-value-card click-shift">
                  {/* Icon 40×40 tile per § 4.3 */}
                  <div className="about-value-icon">
                    <span className="about-value-icon-glyph" aria-hidden>
                      {v.icon}
                    </span>
                  </div>
                  {/* Value title: Darky 20px */}
                  <p className="about-value-title">{v.title}</p>
                  {/* Description: 14px mono */}
                  <p className="about-value-desc">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PANEL 3 — Magvix Italic Signature Divider (§ 3.1)
          28-40px italic var(--ink-3), middle-dot separators
          ≤2 per page · no hover · background: var(--surface)
          ═══════════════════════════════════════════════════════ */}
      <div className="about-sig-divider-wrap">
        <span className="sig-divider">
          Built in NYC · For local commerce · By creators ·
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════
          PANEL 4 — Press / Stats · background: var(--surface)
          KPI: Darky 800 clamp(40,5vw,72) per § 3.1
          Press logos: grayscale(1) opacity 0.5, hover remove filter
          ═══════════════════════════════════════════════════════ */}
      <section className="about-stats-section">
        <div className="about-section-inner">
          <p className="about-eyebrow about-eyebrow--ink">(BY THE NUMBERS)</p>
          <h2 className="about-stats-h2">
            Measured in people,
            <br />
            not impressions.
          </h2>

          {/* KPI grid — 4 stats */}
          <div className="about-kpi-grid">
            {STATS.map((stat) => (
              <div key={stat.label} className="about-kpi-item">
                {/* KPI numeral: Darky 800 clamp(40,5vw,72) per § 3.1 */}
                <p className="about-kpi-num">{stat.num}</p>
                <p className="about-kpi-label">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Press logo row — grayscale, hover removes filter */}
          <div className="about-press-block">
            <p
              className="about-eyebrow about-eyebrow--ink"
              style={{ marginBottom: 24 }}
            >
              (AS SEEN IN)
            </p>
            <div className="about-press-row">
              {[
                "TechCrunch",
                "Eater NY",
                "Hypebeast",
                "Brooklyn Magazine",
                "Fast Company",
              ].map((pub) => (
                <div key={pub} className="about-press-logo">
                  <span className="about-press-name">{pub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TICKET CTA Panel (§ 8.2)
          GA Orange fill · 10px radius · grommets · perf lines
          Magvix Italic centered headline · btn-ink CTA · flat
          ≤1 per page · Marketing-only
          ═══════════════════════════════════════════════════════ */}
      <section className="about-cta-section">
        <div className="about-section-inner">
          <div className="ticket-panel" style={{ position: "relative" }}>
            {/* Grommet corners — 16px circles, 24px inset (§ 8.2) */}
            {[
              { top: 24, left: 24 },
              { top: 24, right: 24 },
              { bottom: 24, left: 24 },
              { bottom: 24, right: 24 },
            ].map((pos, i) => (
              <div
                key={i}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  width: 16,
                  height: 16,
                  borderRadius: "var(--r-full)",
                  background: "var(--ink)",
                  ...pos,
                }}
              />
            ))}

            <p
              className="eyebrow"
              style={{ color: "rgba(10,10,10,0.55)", marginBottom: 24 }}
            >
              (JOIN US)
            </p>

            {/* Magvix Italic clamp(40,5vw,56) centered (§ 8.2) */}
            <h2
              style={{
                fontFamily: "var(--font-hero)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(40px, 5vw, 56px)",
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                color: "var(--ink)",
                margin: "0 0 16px",
                textAlign: "center",
              }}
            >
              Join the walk-in economy.
            </h2>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 16,
                color: "var(--ink)",
                opacity: 0.72,
                maxWidth: "40ch",
                lineHeight: 1.55,
                margin: "0 auto 32px",
                textAlign: "center",
              }}
            >
              We&rsquo;re building in NYC right now. Merchants get early access.
              Creators get first-mover territory.
            </p>

            <div
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Link href="/merchant/signup" className="btn-ink click-shift">
                For Merchants
              </Link>
              <Link href="/creator/signup" className="btn-ghost click-shift">
                For Creators
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
