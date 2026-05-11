/* ============================================================
   /for-creators — pitch creators on joining Push. v3 (2026-05-08)
   Orange accent · 4 sections: hero / 6-tier ladder / earnings example
   / 4-up proof / final CTA.
   ============================================================ */

import Link from "next/link";
import {
  Sprout,
  Compass,
  Briefcase,
  ShieldCheck,
  Crown,
  Gem,
  Camera,
  MapPin,
  Tag,
  TrendingUp,
  DollarSign,
  Sparkles,
} from "lucide-react";
import "../_styles/mkt.css";
import "./creators.css";

const TIERS = [
  {
    icon: Sprout,
    name: "Seed",
    score: "0–9",
    base: "$10–15",
    desc: "Zero pressure. Ship 1 post, get paid.",
  },
  {
    icon: Compass,
    name: "Explorer",
    score: "10–29",
    base: "$15–25",
    desc: "Learn the craft. Pick gigs that fit.",
  },
  {
    icon: Briefcase,
    name: "Operator",
    score: "30–64",
    base: "$25–40",
    desc: "Steady paid work. T+1 payouts unlocked.",
  },
  {
    icon: ShieldCheck,
    name: "Proven",
    score: "65–84",
    base: "$40–80",
    desc: "Premium gigs. 8% commission.",
  },
  {
    icon: Crown,
    name: "Closer",
    score: "85–94",
    base: "$80–150",
    desc: "Top tier. White-glove account team.",
  },
  {
    icon: Gem,
    name: "Obsidian",
    score: "95–100",
    base: "$150+",
    desc: "Invite only. Co-design custom drops.",
  },
];

export default function ForCreatorsPage() {
  return (
    <main
      className="mkt-page mkt-page--orange creators-page"
      aria-label="For creators"
    >
      <header className="mkt-hero">
        <p className="mkt-hero__eyebrow">For creators · NYC</p>
        <h1 className="mkt-hero__title">Get paid for the place you love.</h1>
        <p className="mkt-hero__sub">
          Push pays NYC creators to make content for the merchants in their
          neighborhood — verified by physical scan, not vanity metrics. Ladder
          up 6 tiers, unlock bigger gigs, get paid T+1.
        </p>
        <div className="mkt-hero__cta-row">
          <Link href="/creator/signup" className="mkt-btn mkt-btn--primary">
            Sign up free →
          </Link>
          <Link href="/explore" className="mkt-btn mkt-btn--ghost">
            Browse open gigs
          </Link>
        </div>
      </header>

      {/* ── Tier ladder · 3x2 grid (Operator gets orange solid panel) ── */}
      <section className="mkt-section">
        <div className="mkt-section__head">
          <p className="mkt-section__eyebrow">The ladder · 6 tiers</p>
          <h2 className="mkt-section__title">A path, not a paywall.</h2>
          <p className="mkt-section__sub">
            Every creator starts at Seed. Score climbs with verified visits and
            on-time delivery. Each tier unlocks bigger base pay, faster payouts,
            and access to white-glove campaigns.
          </p>
        </div>
        <div className="creators-ladder">
          {TIERS.map((t, i) => {
            const Icon = t.icon;
            const isHero = i === 2;
            return (
              <article
                key={t.name}
                className={
                  "mkt-panel creators-tile" +
                  (isHero ? " mkt-panel--orange" : "")
                }
              >
                <span className="creators-tile__icon" aria-hidden>
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                <p className="mkt-panel__eyebrow">
                  Tier {i + 1} · score {t.score}
                </p>
                <h3 className="mkt-panel__title">{t.name}</h3>
                <p className="creators-tile__base">
                  {t.base}
                  <span> / campaign</span>
                </p>
                <p className="mkt-panel__body">{t.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Earnings example · 1 champagne hero + 3 split rows ── */}
      <section className="mkt-section">
        <div className="mkt-section__head">
          <p className="mkt-section__eyebrow">Real math · Operator tier</p>
          <h2 className="mkt-section__title">$87 last month for Alex C.</h2>
          <p className="mkt-section__sub">
            One Williamsburg creator at Operator tier. 5 verified shoots, 142
            repeat customers attributed, 1 weekly bonus hit.
          </p>
        </div>
        <div className="creators-earnings">
          <article className="mkt-panel mkt-panel--champagne creators-earnings__hero">
            <p className="mkt-panel__eyebrow">Total · Apr 2026</p>
            <p className="mkt-panel__num">$87</p>
            <p className="mkt-panel__body">
              5 campaigns · 412 verified visits · 142 repeat customers
            </p>
          </article>
          <div className="creators-earnings__split">
            <div className="creators-earnings__row">
              <span>
                <DollarSign size={14} strokeWidth={2} /> Base pay
              </span>
              <span>$60</span>
            </div>
            <div className="creators-earnings__row">
              <span>
                <TrendingUp size={14} strokeWidth={2} /> Commission · 5%
              </span>
              <span>$12</span>
            </div>
            <div className="creators-earnings__row">
              <span>
                <Sparkles size={14} strokeWidth={2} /> Weekly bonus
              </span>
              <span>$15</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4-up proof points ── */}
      <section className="mkt-section">
        <div className="mkt-section__head">
          <p className="mkt-section__eyebrow">Why creators pick Push</p>
          <h2 className="mkt-section__title">
            Built for the work, not the algorithm.
          </h2>
        </div>
        <div className="mkt-grid-4">
          <article className="mkt-panel">
            <Camera size={20} strokeWidth={1.75} />
            <h3 className="mkt-panel__title">Real shoots</h3>
            <p className="mkt-panel__body">
              No engagement farming. Show up, capture, post.
            </p>
          </article>
          <article className="mkt-panel">
            <MapPin size={20} strokeWidth={1.75} />
            <h3 className="mkt-panel__title">Your block</h3>
            <p className="mkt-panel__body">
              Gigs you can walk to. NYC is your beat.
            </p>
          </article>
          <article className="mkt-panel">
            <Tag size={20} strokeWidth={1.75} />
            <h3 className="mkt-panel__title">QR attribution</h3>
            <p className="mkt-panel__body">
              You earn when fans actually visit. Verified, not estimated.
            </p>
          </article>
          <article className="mkt-panel">
            <DollarSign size={20} strokeWidth={1.75} />
            <h3 className="mkt-panel__title">T+1 payouts</h3>
            <p className="mkt-panel__body">
              Paid the next business day. No hidden retention.
            </p>
          </article>
        </div>
      </section>

      {/* ── Final CTA · ink solid ── */}
      <section className="mkt-section">
        <div className="mkt-panel mkt-panel--ink">
          <p className="mkt-panel__eyebrow">Ready when you are</p>
          <h2 className="mkt-panel__title">Sign up in 2 minutes.</h2>
          <p className="mkt-panel__body">
            Quick verify · pick your neighborhood · start at Seed tier.
          </p>
          <div className="mkt-hero__cta-row" style={{ marginTop: 16 }}>
            <Link href="/creator/signup" className="mkt-btn mkt-btn--accent">
              Create your creator profile →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
