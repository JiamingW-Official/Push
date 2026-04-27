"use client";

import { useState } from "react";
import Link from "next/link";
import "./creators.css";

/* ── Earnings Calculator data ─────────────────────────────── */
const TIER_CONVERSION_RATE: Record<string, { min: number; max: number }> = {
  seed: { min: 4, max: 6 },
  explorer: { min: 6, max: 10 },
  operator: { min: 9, max: 15 },
  proven: { min: 14, max: 22 },
  closer: { min: 20, max: 30 },
  partner: { min: 28, max: 42 },
};

const TIERS = [
  { id: "seed", label: "Seed" },
  { id: "explorer", label: "Explorer" },
  { id: "operator", label: "Operator" },
  { id: "proven", label: "Proven" },
  { id: "closer", label: "Closer" },
  { id: "partner", label: "Partner" },
];

/* ── Tier node data ───────────────────────────────────────── */
const TIER_NODES = [
  {
    id: "seed",
    num: "01",
    name: "Seed",
    range: "1K–5K",
    earn: "$50–200/mo",
    detail:
      "No follower minimum. We measure engagement consistency over 90 days, not vanity numbers. Your first verified scans build the permanent record that drives every future rate.",
    unlock: "10 verified scans → Explorer review",
    isPartner: false,
  },
  {
    id: "explorer",
    num: "02",
    name: "Explorer",
    range: "5K–20K",
    earn: "$200–600/mo",
    detail:
      "Your audience converts. Brands start requesting you for specific neighborhoods. Scan rate and trust score both climb as your record proves itself.",
    unlock: "25 scans + 8% conversion rate → Operator",
    isPartner: false,
  },
  {
    id: "operator",
    num: "03",
    name: "Operator",
    range: "20K–50K",
    earn: "$600–1.5K/mo",
    detail:
      "You run campaigns like a business. Multiple concurrent deals, high weekly scan volume. Push's algorithm weights your reliability score heavily at this tier.",
    unlock: "50 scans/mo for 60 consecutive days → Proven",
    isPartner: false,
  },
  {
    id: "proven",
    num: "04",
    name: "Proven",
    range: "50K–150K",
    earn: "$1.5K–4K/mo",
    detail:
      "Your verified conversion history speaks louder than any follower count. Brands reference your record directly when selecting creators. You skip the generic brief.",
    unlock: "100 scans/mo + 60% merchant re-request rate → Closer",
    isPartner: false,
  },
  {
    id: "closer",
    num: "05",
    name: "Closer",
    range: "150K–500K",
    earn: "$4K–10K/mo",
    detail:
      "You bypass the apply queue. Merchants reach out directly. You co-create briefs, choose categories, and negotiate terms — campaign ownership shifts your way.",
    unlock: "200 scans/mo + 3 long-term merchant partnerships → Partner",
    isPartner: false,
  },
  {
    id: "partner",
    num: "06",
    name: "Partner",
    range: "500K+",
    earn: "$10K+/mo",
    detail:
      "Invitation only. You sit inside the campaign strategy layer, not just the execution layer. Equity-style revenue splits on flagship campaigns. First access to every new market.",
    unlock: "Invitation only · reviewed quarterly",
    isPartner: true,
  },
];

/* ── Earnings Calculator component ───────────────────────── */
function EarningsCalculator() {
  const [tier, setTier] = useState("operator");
  const [campaigns, setCampaigns] = useState(2);
  const [visitsPerWeek, setVisitsPerWeek] = useState(8);

  const rate = TIER_CONVERSION_RATE[tier];
  const weeks = 4.33;
  const estMin = Math.round(campaigns * visitsPerWeek * rate.min * weeks);
  const estMax = Math.round(campaigns * visitsPerWeek * rate.max * weeks);

  return (
    <div className="calc-editorial">
      {/* Output number — visual hero of this panel */}
      <div className="calc-result" aria-live="polite">
        <span className="calc-result-prefix">$</span>
        <span className="calc-result-num">{estMin.toLocaleString()}</span>
        <span className="calc-result-dash">–</span>
        <span className="calc-result-prefix">$</span>
        <span className="calc-result-num">{estMax.toLocaleString()}</span>
        <span className="calc-result-unit">/ mo</span>
      </div>

      {/* Tier selector — btn-pill row */}
      <div
        role="group"
        aria-label="Creator tier"
        style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
      >
        {TIERS.map((t) => (
          <button
            key={t.id}
            type="button"
            className="btn-pill"
            aria-pressed={tier === t.id}
            onClick={() => setTier(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div className="calc-sliders">
        <div className="calc-slider-row">
          <div className="calc-slider-label">
            <span>Campaigns / mo</span>
            <span className="calc-slider-val">{campaigns}</span>
          </div>
          <input
            type="range"
            min={1}
            max={12}
            value={campaigns}
            onChange={(e) => setCampaigns(Number(e.target.value))}
            className="calc-slider"
            aria-label="Active campaigns per month"
          />
          <div className="calc-slider-ticks">
            <span>1</span>
            <span>12</span>
          </div>
        </div>
        <div className="calc-slider-row">
          <div className="calc-slider-label">
            <span>Visits / wk</span>
            <span className="calc-slider-val">{visitsPerWeek}</span>
          </div>
          <input
            type="range"
            min={1}
            max={25}
            value={visitsPerWeek}
            onChange={(e) => setVisitsPerWeek(Number(e.target.value))}
            className="calc-slider"
            aria-label="Verified visits per week"
          />
          <div className="calc-slider-ticks">
            <span>1</span>
            <span>25</span>
          </div>
        </div>
      </div>

      <p className="calc-fine">
        ${rate.min}–${rate.max} per verified visit · paid Fridays via Stripe
        Connect
      </p>

      <Link
        href="/creator/signup"
        className="btn-primary click-shift"
        style={{ alignSelf: "flex-start" }}
      >
        Apply for the cohort →
      </Link>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function ForCreatorsPage() {
  return (
    <>
      {/* ════════════════════════════════════════════════════
          HERO — Full-Bleed Pattern A (border-radius: 0 allowed)
          Dark ink with radial accent glow
          ════════════════════════════════════════════════════ */}
      <section className="fc-hero" aria-label="For Creators Hero">
        {/* Ghost watermark stat — architectural ghost digit */}
        <div className="fc-hero-ghost" aria-hidden="true">
          87%
        </div>

        {/* Floating glass stat tile — top right, hidden on mobile */}
        <div className="lg-surface--dark fc-hero-peek" aria-hidden="true">
          <div className="fc-peek-num">200+</div>
          <div className="fc-peek-label">Creators active</div>
        </div>

        {/* Bottom-left copy block — v11 corner-anchored */}
        <div className="fc-hero-copy">
          <span className="eyebrow fc-hero-eyebrow">(FOR CREATORS)</span>

          <h1 className="fc-hero-h1">
            Perform.
            <br />
            Get paid.
          </h1>

          <p className="fc-hero-sub">
            Your audience walks in. You get paid. No agency, no retainer — just
            verified foot traffic turned into income.
          </p>

          <div className="fc-hero-actions">
            <Link href="/creator/signup" className="btn-primary click-shift">
              Apply Now
            </Link>
            <Link
              href="/how-it-works"
              className="btn-ghost click-shift fc-hero-ghost-btn"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          EDITORIAL STATEMENT — Dark Ink, KPI trio
          Asymmetric 8+4 composition
          ════════════════════════════════════════════════════ */}
      <section className="fc-kpi-section" aria-label="Earnings potential">
        {/* Ghost architectural dollar */}
        <div className="fc-kpi-ghost" aria-hidden="true">
          $
        </div>

        <div className="fc-kpi-inner">
          {/* Left 8-col: headline + KPI trio */}
          <div className="fc-kpi-left">
            <p className="fc-kpi-eyebrow">(PARTNER TIER · MONTHLY POTENTIAL)</p>

            <div className="fc-kpi-row">
              <div className="fc-kpi-block">
                <p className="fc-kpi-num">$10K+</p>
                <p className="fc-kpi-cap">per month</p>
              </div>
              <div className="fc-kpi-divider" aria-hidden="true" />
              <div className="fc-kpi-block">
                <p className="fc-kpi-num">$3.50</p>
                <p className="fc-kpi-cap">avg per visit</p>
              </div>
              <div className="fc-kpi-divider" aria-hidden="true" />
              <div className="fc-kpi-block">
                <p className="fc-kpi-num">87%</p>
                <p className="fc-kpi-cap">creator retention</p>
              </div>
            </div>

            <p className="fc-kpi-fine">
              No agency. No retainer. Paid Fridays via Stripe Connect.
            </p>
          </div>

          {/* Right 4-col: CTA tile */}
          <div className="fc-kpi-right">
            <div className="fc-kpi-tile">
              <p className="fc-kpi-tile-eyebrow">(READY?)</p>
              <p className="fc-kpi-tile-head">Join the next cohort</p>
              <p className="fc-kpi-tile-body">
                NYC creators only. Applications reviewed weekly.
              </p>
              <Link href="/creator/signup" className="btn-ink click-shift">
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SIGNATURE DIVIDER 1
          ════════════════════════════════════════════════════ */}
      <div className="fc-sig-wrap">
        <span className="sig-divider">Posted · Scanned · Verified ·</span>
      </div>

      {/* ════════════════════════════════════════════════════
          HOW IT WORKS — Numbered editorial rows, 3-column grid
          Warm butter candy panel
          ════════════════════════════════════════════════════ */}
      <section
        className="candy-panel fc-how-section"
        aria-label="How it works"
        style={{ background: "var(--panel-butter)" }}
      >
        {/* Floating glass stat tile */}
        <div className="lg-surface fc-how-tile" aria-hidden="true">
          <div className="fc-how-tile-num">3</div>
          <div className="fc-how-tile-cap">steps to first payout</div>
        </div>

        <div className="fc-section-inner">
          <span
            className="eyebrow"
            style={{ display: "block", marginBottom: 16 }}
          >
            (HOW IT WORKS)
          </span>
          <h2 className="fc-h2">
            Walk in.
            <br />
            Scan. Earn.
          </h2>

          {/* Numbered editorial rows — 3-col grid */}
          <div className="fc-how-grid">
            <div className="fc-how-row click-shift">
              <span className="fc-how-num">01</span>
              <div className="fc-how-body">
                <h3 className="fc-h3">Apply once</h3>
                <p className="fc-how-text">
                  No follower floor. We review your engagement consistency over
                  90 days. No agency, no exclusivity clause.
                </p>
              </div>
            </div>
            <div className="fc-how-row click-shift">
              <span className="fc-how-num">02</span>
              <div className="fc-how-body">
                <h3 className="fc-h3">Pick a campaign</h3>
                <p className="fc-how-text">
                  Browse merchant campaigns by neighborhood, category, and rate.
                  Accept what fits your audience and schedule.
                </p>
              </div>
            </div>
            <div className="fc-how-row click-shift">
              <span className="fc-how-num">03</span>
              <div className="fc-how-body">
                <h3 className="fc-h3">Drive foot traffic</h3>
                <p className="fc-how-text">
                  Post your content. Your audience scans the QR. Every verified
                  visit triggers a payout — no chasing invoices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          TIERS PANEL — Dark Ink + numbered editorial rows
          Cool panel (dark ink counts as cool counterweight)
          ════════════════════════════════════════════════════ */}
      <section className="fc-tiers-section" aria-label="Creator tiers">
        {/* Ghost architectural numeral */}
        <div className="fc-tiers-ghost" aria-hidden="true">
          6
        </div>

        <div className="fc-section-inner fc-tiers-inner">
          <span
            className="eyebrow fc-eyebrow-light"
            style={{ display: "block", marginBottom: 16 }}
          >
            (6 TIERS)
          </span>
          <h2 className="fc-h2 fc-h2-light">
            Progress that
            <br />
            compounds.
          </h2>

          {/* Numbered editorial tier rows */}
          <div className="fc-tiers-grid">
            {TIER_NODES.map((t) => (
              <div
                key={t.id}
                className={`fc-tier-row click-shift${t.isPartner ? " fc-tier-row--partner" : ""}`}
              >
                <span className="fc-tier-row-num">{t.num}</span>
                <div className="fc-tier-row-body">
                  <div className="fc-tier-row-head">
                    <span
                      className={`fc-tier-row-name${t.isPartner ? " fc-tier-row-name--partner" : ""}`}
                    >
                      {t.name}
                    </span>
                    <span className="fc-tier-row-range">
                      {t.range} followers
                    </span>
                  </div>
                  <p className="fc-tier-row-detail">{t.detail}</p>
                  <p className="fc-tier-row-unlock">{t.unlock}</p>
                </div>
                <div
                  className={`fc-tier-row-earn${t.isPartner ? " fc-tier-row-earn--partner" : ""}`}
                >
                  {t.earn}
                </div>
              </div>
            ))}
          </div>

          <p className="fc-tiers-note">
            Rate rises with verified-visit record. No cap. Paid every Friday.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SIGNATURE DIVIDER 2
          ════════════════════════════════════════════════════ */}
      <div className="fc-sig-wrap">
        <span className="sig-divider">Story · Scan · Pay ·</span>
      </div>

      {/* ════════════════════════════════════════════════════
          EARNINGS PANEL — Warm butter, calculator + glass tile
          ════════════════════════════════════════════════════ */}
      <section
        className="candy-panel fc-calc-section"
        aria-label="Earnings calculator"
        id="calculator"
        style={{ background: "var(--panel-butter)" }}
      >
        {/* Floating glass stat tile — top right */}
        <div className="lg-surface fc-calc-tile" aria-hidden="true">
          <div className="fc-calc-tile-num">Up to $4,200/mo</div>
          <div className="fc-calc-tile-cap">Operator tier</div>
        </div>

        <div className="fc-section-inner">
          <span
            className="eyebrow"
            style={{ display: "block", marginBottom: 16 }}
          >
            (THE MATH)
          </span>
          <h2 className="fc-h2" style={{ marginBottom: 48 }}>
            What you actually earn.
          </h2>

          <EarningsCalculator />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          PULL QUOTE — Brand Red full-width editorial moment
          ════════════════════════════════════════════════════ */}
      <section className="fc-quote-section" aria-label="Creator testimonial">
        {/* Decorative quote mark ghost */}
        <div className="fc-quote-ghost" aria-hidden="true">
          &ldquo;
        </div>

        <div className="fc-quote-inner">
          <blockquote className="fc-quote-text">
            &ldquo;I made more in my first month than four months of sponsored
            posts combined. The QR doesn&rsquo;t lie.&rdquo;
          </blockquote>
          <div className="fc-quote-attr">
            <span className="fc-quote-name">Maria V.</span>
            <span className="fc-quote-sep">/</span>
            <span className="fc-quote-meta">Operator Tier · Brooklyn</span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          PHOTO GRID PANEL — 3-up Photo Cards
          Cool sky panel (alternates after red quote)
          ════════════════════════════════════════════════════ */}
      <section
        className="fc-photo-section"
        aria-label="Real campaigns"
        style={{ background: "var(--surface)" }}
      >
        <div className="fc-section-inner">
          <span
            className="eyebrow"
            style={{ display: "block", marginBottom: 16 }}
          >
            (WHAT IT LOOKS LIKE)
          </span>
          <h2 className="fc-h2" style={{ marginBottom: 48 }}>
            Real campaigns.
            <br />
            Real neighborhoods.
          </h2>

          {/* 3-up Photo Card grid */}
          <div className="fc-photo-grid">
            {/* Card 1 — warm earth tone */}
            <div
              className="fc-photo-card click-shift"
              style={{
                background:
                  "linear-gradient(160deg, var(--char) 0%, var(--cat-food) 60%, var(--ink) 100%)",
              }}
            >
              <div className="lg-surface--badge fc-photo-badge">Active</div>
              <div className="fc-photo-overlay" />
              <div className="fc-photo-copy">
                <div className="fc-photo-title">Williamsburg Market</div>
                <div className="fc-photo-meta">Food &amp; Bev · 24 scans</div>
              </div>
            </div>

            {/* Card 2 — cool blue tone */}
            <div
              className="fc-photo-card click-shift"
              style={{
                background:
                  "linear-gradient(160deg, var(--graphite) 0%, var(--cat-travel) 60%, var(--ink) 100%)",
              }}
            >
              <div className="lg-surface--badge fc-photo-badge">Verified</div>
              <div className="fc-photo-overlay" />
              <div className="fc-photo-copy">
                <div className="fc-photo-title">Brooklyn Coffee</div>
                <div className="fc-photo-meta">Beauty · 18 scans</div>
              </div>
            </div>

            {/* Card 3 — warm amber tone */}
            <div
              className="fc-photo-card click-shift"
              style={{
                background:
                  "linear-gradient(160deg, var(--char) 0%, var(--cat-food) 60%, var(--ink) 100%)",
              }}
            >
              <div className="lg-surface--badge fc-photo-badge">Trending</div>
              <div className="fc-photo-overlay" />
              <div className="fc-photo-copy">
                <div className="fc-photo-title">Park Slope Kitchen</div>
                <div className="fc-photo-meta">Dining · 31 scans</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          TICKET PANEL — GA Orange final CTA
          ════════════════════════════════════════════════════ */}
      <section className="ticket-panel fc-ticket" aria-label="Apply CTA">
        {/* Four grommet circles — corner anchored */}
        <div className="fc-grommet fc-grommet--tl" aria-hidden="true" />
        <div className="fc-grommet fc-grommet--tr" aria-hidden="true" />
        <div className="fc-grommet fc-grommet--bl" aria-hidden="true" />
        <div className="fc-grommet fc-grommet--br" aria-hidden="true" />

        {/* Centered content */}
        <div className="fc-ticket-content">
          <h2 className="fc-ticket-h2">
            Ready to
            <br />
            start scanning?
          </h2>

          <p className="fc-ticket-body">
            Applications reviewed weekly. NYC creators only.
          </p>

          <Link href="/creator/signup" className="btn-ink click-shift">
            Apply Now
          </Link>
        </div>
      </section>

      {/* Bottom spacer */}
      <div style={{ height: 64 }} aria-hidden="true" />
    </>
  );
}
