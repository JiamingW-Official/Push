"use client";

/* ============================================================
   / — homepage. v4 (2026-05-08, mkt.css unified)

   Same visual register as marketing landings (for-creators / about /
   trust / etc.) — clean ink-themed hero, varied bento sections, no
   blue editorial floating panels. SaaS-mature, sober, designed.

   Layout (top to bottom):
     1. Hero (Darky 96 + dual CTA + sub)
     2. Split (creator + merchant 2-up panels)
     3. 4-up "what makes Push" stat ribbon
     4. Funnel viz (impressions → verified)
     5. Final CTA dual button
     6. Footer (shared, ink-solid)
   ============================================================ */

import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import {
  ArrowRight,
  Camera,
  MapPin,
  Tag,
  TrendingUp,
  ShieldCheck,
  Zap,
  DollarSign,
} from "lucide-react";
import "./(marketing)/_styles/mkt.css";
import "./home.css";

export default function HomePage() {
  return (
    <div className="mkt-shell">
      <Header />
      <main
        className="mkt-page mkt-page--ink home-page"
        aria-label="Push homepage"
      >
        {/* ── Hero ── */}
        <header className="mkt-hero home-hero">
          <p className="mkt-hero__eyebrow">Push · NYC, est. 2024</p>
          <h1 className="mkt-hero__title">
            Get paid for the place
            <br />
            you actually walk through.
          </h1>
          <p className="mkt-hero__sub">
            Push pays NYC creators for verified physical foot traffic — not
            impressions, not clicks, not estimated reach. Merchants pay only for
            visits we&apos;ve verified through QR scan + AI vision.
          </p>
          <div className="mkt-hero__cta-row">
            <Link href="/creator/signup" className="mkt-btn mkt-btn--primary">
              Sign up as a creator <ArrowRight size={14} strokeWidth={2.25} />
            </Link>
            <Link href="/merchant/signup" className="mkt-btn mkt-btn--ghost">
              I&apos;m a merchant
            </Link>
          </div>
        </header>

        {/* ── 2-up split: creator + merchant ── */}
        <section className="mkt-section" data-label="Who it's for">
          <div className="mkt-grid-2 home-split">
            <article className="mkt-panel mkt-panel--orange home-split__card">
              <span className="home-split__icon">
                <Camera size={22} strokeWidth={1.75} />
              </span>
              <p className="mkt-panel__eyebrow">For creators</p>
              <h2 className="mkt-panel__title">Make content for your block.</h2>
              <p className="mkt-panel__body">
                NYC creators get paid base + commission for verified physical
                visits to merchants in their neighborhood. Six tiers, T+1
                payouts, no algorithm chase.
              </p>
              <Link href="/for-creators" className="home-split__link">
                Learn more <ArrowRight size={14} strokeWidth={2.25} />
              </Link>
            </article>
            <article className="mkt-panel mkt-panel--blue home-split__card">
              <span className="home-split__icon">
                <TrendingUp size={22} strokeWidth={1.75} />
              </span>
              <p className="mkt-panel__eyebrow">For merchants</p>
              <h2 className="mkt-panel__title">Pay only for foot traffic.</h2>
              <p className="mkt-panel__body">
                Skip the influencer pitches. Push runs hyperlocal campaigns with
                tier-matched creators and prices on QR-verified visits. 86 NYC
                merchants on board.
              </p>
              <Link href="/for-merchants" className="home-split__link">
                Learn more <ArrowRight size={14} strokeWidth={2.25} />
              </Link>
            </article>
          </div>
        </section>

        {/* Magvix italic editorial divider */}
        <p className="mkt-divider">By the numbers ·</p>

        {/* ── 4-up stats ribbon ── */}
        <section className="mkt-section" data-label="Numbers">
          <div className="mkt-section__head">
            <p className="mkt-section__eyebrow">Q1 2026 · numbers</p>
            <h2 className="mkt-section__title">Real, verified, NYC.</h2>
          </div>
          <div className="mkt-grid-4">
            <article className="mkt-panel home-stat">
              <p className="mkt-panel__num">1,240</p>
              <p className="mkt-panel__eyebrow">NYC creators</p>
            </article>
            <article className="mkt-panel home-stat">
              <p className="mkt-panel__num">86</p>
              <p className="mkt-panel__eyebrow">Active merchants</p>
            </article>
            <article className="mkt-panel home-stat">
              <p className="mkt-panel__num">412k</p>
              <p className="mkt-panel__eyebrow">Verified visits</p>
            </article>
            <article className="mkt-panel mkt-panel--champagne home-stat">
              <p className="mkt-panel__num">$1.2M</p>
              <p className="mkt-panel__eyebrow">Attributed YTD</p>
            </article>
          </div>
        </section>

        {/* Magvix italic editorial divider */}
        <p className="mkt-divider">From poster to paid ·</p>

        {/* ── How it works (4 steps inline) ── */}
        <section className="mkt-section" data-label="How it works">
          <div className="mkt-section__head">
            <p className="mkt-section__eyebrow">How it works · 4 steps</p>
            <h2 className="mkt-section__title">Loop, end-to-end.</h2>
          </div>
          <ol className="home-steps">
            <li className="home-step">
              <span className="home-step__num">01</span>
              <Tag size={20} strokeWidth={1.75} />
              <h3 className="home-step__title">Brief</h3>
              <p className="home-step__body">
                Merchant briefs a campaign, sets tier, pay, deliverables.
              </p>
            </li>
            <li className="home-step">
              <span className="home-step__num">02</span>
              <Camera size={20} strokeWidth={1.75} />
              <h3 className="home-step__title">Match &amp; shoot</h3>
              <p className="home-step__body">
                Tier-eligible creators apply. Merchant picks 2-3.
              </p>
            </li>
            <li className="home-step">
              <span className="home-step__num">03</span>
              <MapPin size={20} strokeWidth={1.75} />
              <h3 className="home-step__title">QR scan</h3>
              <p className="home-step__body">
                Fans scan poster IN STORE. Geo + time + AI verify.
              </p>
            </li>
            <li className="home-step">
              <span className="home-step__num">04</span>
              <DollarSign size={20} strokeWidth={1.75} />
              <h3 className="home-step__title">T+1 paid</h3>
              <p className="home-step__body">
                Creator paid next business day. Merchant pays per visit.
              </p>
            </li>
          </ol>
        </section>

        {/* ── 3-up trust callouts ── */}
        <section className="mkt-section" data-label="Why it works">
          <div className="mkt-grid-3">
            <article className="mkt-panel">
              <ShieldCheck size={22} strokeWidth={1.75} />
              <p className="mkt-panel__eyebrow">5-layer verification</p>
              <h3 className="mkt-panel__title">98.4% verification rate.</h3>
              <p className="mkt-panel__body">
                Every scan passes geo + time + fraud + AI Vision OCR before
                creator earns commission.
              </p>
              <Link href="/trust" className="home-split__link">
                Trust report <ArrowRight size={14} strokeWidth={2.25} />
              </Link>
            </article>
            <article className="mkt-panel">
              <Zap size={22} strokeWidth={1.75} />
              <p className="mkt-panel__eyebrow">Fast payouts</p>
              <h3 className="mkt-panel__title">T+1 payout cycle.</h3>
              <p className="mkt-panel__body">
                Creators earn the next business day. No retention, no minimum.
              </p>
              <Link href="/for-creators" className="home-split__link">
                Creator economics <ArrowRight size={14} strokeWidth={2.25} />
              </Link>
            </article>
            <article className="mkt-panel">
              <DollarSign size={22} strokeWidth={1.75} />
              <p className="mkt-panel__eyebrow">Pay per result</p>
              <h3 className="mkt-panel__title">Base + verified-visit fee.</h3>
              <p className="mkt-panel__body">
                Merchants set their own spend cap. We only bill for visits that
                cleared verification.
              </p>
              <Link href="/for-merchants" className="home-split__link">
                Merchant pricing <ArrowRight size={14} strokeWidth={2.25} />
              </Link>
            </article>
          </div>
        </section>

        {/* Magvix italic editorial divider — final flourish */}
        <p className="mkt-divider">Posted · scanned · verified ·</p>

        {/* ── Final CTA · ink solid ── */}
        <section className="mkt-section" data-label="Get started">
          <div className="mkt-panel mkt-panel--ink home-cta">
            <p className="mkt-panel__eyebrow">Ready when you are</p>
            <h2 className="home-cta__title">Pick your role.</h2>
            <p className="mkt-panel__body">
              Set up takes ~2 min. Quick verify · pick your block · start
              earning at Seed tier.
            </p>
            <div className="mkt-hero__cta-row" style={{ marginTop: 24 }}>
              <Link href="/creator/signup" className="mkt-btn mkt-btn--accent">
                I&apos;m a creator <ArrowRight size={14} strokeWidth={2.25} />
              </Link>
              <Link href="/merchant/signup" className="mkt-btn mkt-btn--ghost">
                I&apos;m a merchant
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
