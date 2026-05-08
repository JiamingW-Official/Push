/* ============================================================
   /for-merchants — pitch merchants on running campaigns. v3 (2026-05-08)
   Blue accent · 4 sections: hero / 3-up value / ROI panel + funnel /
   how-it-works 4-step / final CTA.
   ============================================================ */

import Link from "next/link";
import {
  TrendingUp,
  Users,
  ShieldCheck,
  QrCode,
  Megaphone,
  Eye,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import "../_styles/mkt.css";
import "./merchants.css";

export default function ForMerchantsPage() {
  return (
    <main
      className="mkt-page mkt-page--blue merchants-page"
      aria-label="For merchants"
    >
      <header className="mkt-hero">
        <p className="mkt-hero__eyebrow">For merchants · NYC</p>
        <h1 className="mkt-hero__title">
          Pay only for the foot traffic you measure.
        </h1>
        <p className="mkt-hero__sub">
          Push runs hyper-local creator campaigns for NYC merchants — and prices
          them on verified physical visits, not impressions. No guessing, no
          inflated reach, no &ldquo;estimated ROAS.&rdquo; Just QR-attributed
          visits that walked through your door.
        </p>
        <div className="mkt-hero__cta-row">
          <Link href="/merchant/signup" className="mkt-btn mkt-btn--primary">
            Start a campaign →
          </Link>
          <Link href="/how-it-works" className="mkt-btn mkt-btn--ghost">
            See how it works
          </Link>
        </div>
      </header>

      {/* ── 3-up value props ── */}
      <section className="mkt-section">
        <div className="mkt-section__head">
          <p className="mkt-section__eyebrow">What you get · 3 promises</p>
          <h2 className="mkt-section__title">
            Verified, local, and accountable.
          </h2>
        </div>
        <div className="mkt-grid-3">
          <article className="mkt-panel">
            <span className="merchants-tile__icon">
              <MapPin size={20} strokeWidth={1.75} />
            </span>
            <p className="mkt-panel__eyebrow">Hyper-local</p>
            <h3 className="mkt-panel__title">Creators on your block</h3>
            <p className="mkt-panel__body">
              Tier-matched creators who live within 20 minutes of your
              storefront. No random influencer pitches.
            </p>
          </article>
          <article className="mkt-panel mkt-panel--blue">
            <span className="merchants-tile__icon">
              <QrCode size={20} strokeWidth={1.75} />
            </span>
            <p className="mkt-panel__eyebrow">Physical attribution</p>
            <h3 className="mkt-panel__title">QR scan + verify</h3>
            <p className="mkt-panel__body">
              Every visit comes from a fan who scanned a creator&apos;s poster
              and walked into your shop — verified by AI + ops.
            </p>
          </article>
          <article className="mkt-panel">
            <span className="merchants-tile__icon">
              <ShieldCheck size={20} strokeWidth={1.75} />
            </span>
            <p className="mkt-panel__eyebrow">Transparent</p>
            <h3 className="mkt-panel__title">Pay per result</h3>
            <p className="mkt-panel__body">
              Base fee + commission on verified visits. Cancel anytime, no
              minimum spend.
            </p>
          </article>
        </div>
      </section>

      {/* ── ROI / funnel side-by-side ── */}
      <section className="mkt-section">
        <div className="mkt-section__head">
          <p className="mkt-section__eyebrow">
            Real numbers · Roberta&apos;s Pizza
          </p>
          <h2 className="mkt-section__title">$4,280 attributed in month 1.</h2>
          <p className="mkt-section__sub">
            One Brooklyn pizzeria. 3 creators · 18 deliverables · 412 verified
            visits · 142 repeat customers locked in for the long haul.
          </p>
        </div>
        <div className="merchants-roi">
          <article className="mkt-panel mkt-panel--ink merchants-roi__hero">
            <p className="mkt-panel__eyebrow">Attributed revenue</p>
            <p className="mkt-panel__num">$4,280</p>
            <p className="mkt-panel__body">↑ 22.5% vs prior 30 days</p>
            <div className="merchants-roi__split">
              <div className="merchants-roi__row">
                <span>Verified visits</span>
                <span>412</span>
              </div>
              <div className="merchants-roi__row">
                <span>Repeat customers</span>
                <span>142</span>
              </div>
              <div className="merchants-roi__row">
                <span>Avg ticket</span>
                <span>$30.16</span>
              </div>
              <div className="merchants-roi__row">
                <span>Spend on Push</span>
                <span>$320</span>
              </div>
            </div>
          </article>
          <div className="merchants-funnel">
            <p className="mkt-panel__eyebrow">Conversion funnel</p>
            {[
              { label: "Impressions", value: 12480, pct: 100, accent: "ink-5" },
              { label: "QR scans", value: 1640, pct: 70, accent: "champ" },
              { label: "Verified visits", value: 412, pct: 45, accent: "blue" },
              { label: "Repeat", value: 142, pct: 25, accent: "ink" },
            ].map((s) => (
              <div key={s.label} className="merchants-funnel__row">
                <span className="merchants-funnel__label">{s.label}</span>
                <div className="merchants-funnel__track">
                  <div
                    className={`merchants-funnel__bar merchants-funnel__bar--${s.accent}`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
                <span className="merchants-funnel__value">
                  {s.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works · 4-step horizontal ── */}
      <section className="mkt-section">
        <div className="mkt-section__head">
          <p className="mkt-section__eyebrow">From signup to verified visit</p>
          <h2 className="mkt-section__title">4 steps. ~8 minutes.</h2>
        </div>
        <div className="mkt-grid-4 merchants-steps">
          <article className="mkt-panel merchants-step">
            <span className="merchants-step__num">01</span>
            <Megaphone size={20} strokeWidth={1.75} />
            <h3 className="mkt-panel__title">Brief a campaign</h3>
            <p className="mkt-panel__body">
              Set your spend, deliverables, and tier requirements.
            </p>
          </article>
          <article className="mkt-panel merchants-step">
            <span className="merchants-step__num">02</span>
            <Users size={20} strokeWidth={1.75} />
            <h3 className="mkt-panel__title">Pick creators</h3>
            <p className="mkt-panel__body">
              Match-scored creators apply. Accept the ones you trust.
            </p>
          </article>
          <article className="mkt-panel merchants-step">
            <span className="merchants-step__num">03</span>
            <Eye size={20} strokeWidth={1.75} />
            <h3 className="mkt-panel__title">Approve content</h3>
            <p className="mkt-panel__body">
              Review drafts, give brand feedback, post when ready.
            </p>
          </article>
          <article className="mkt-panel merchants-step">
            <span className="merchants-step__num">04</span>
            <CheckCircle2 size={20} strokeWidth={1.75} />
            <h3 className="mkt-panel__title">Verify visits</h3>
            <p className="mkt-panel__body">
              QR scans + AI verify. You only pay for real foot traffic.
            </p>
          </article>
        </div>
      </section>

      {/* ── Final CTA · blue solid ── */}
      <section className="mkt-section">
        <div className="mkt-panel mkt-panel--blue">
          <p className="mkt-panel__eyebrow">No minimum · cancel anytime</p>
          <h2 className="mkt-panel__title">
            Run your first campaign in 10 minutes.
          </h2>
          <p className="mkt-panel__body">
            Join 86 NYC merchants paying only for verified visits.
          </p>
          <div className="mkt-hero__cta-row" style={{ marginTop: 16 }}>
            <Link href="/merchant/signup" className="mkt-btn mkt-btn--accent">
              Start a campaign →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
