"use client";

/* ============================================================
   /creator/me — IDENTITY hub. v2 (2026-05-08, Work-template parity)

   Champagne accent — identity is ceremonial, warm. ONE champagne
   solid hero (Profile anchor) + 1 ink solid (Public link). Each panel
   surfaces a different identity sub-surface (profile / tier / rank /
   portfolio / settings / public link).
   ============================================================ */

import {
  BentoModule,
  KpiBlock,
  StatusPill,
} from "@/components/shared/primitives";
import {
  User,
  TrendingUp,
  Trophy,
  ImageIcon,
  Settings,
  Share2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import "@/components/shared/hub-shell.css";
import "./me.css";

const ICON_PROPS = { size: 18, strokeWidth: 1.75 } as const;

export default function IdentityHub() {
  // Mock identity data — replace with real session/profile fetch when wired.
  const me = {
    name: "Alex Chen",
    handle: "@alexc.nyc",
    tier: "Operator",
    tierIdx: 3,
    score: 60,
    nextTier: "Proven",
    nextScore: 65,
    rank: 14,
    rankCity: "Williamsburg",
    rankCityTotal: 142,
    portfolioCount: 18,
    publicLink: "push.nyc/c/alex-chen",
  };
  const pct = Math.round((me.score / me.nextScore) * 100);

  return (
    <main className="me-hub" aria-label="Identity">
      <header className="me-hero">
        <div className="me-hero__left">
          <h1 className="me-hero__title">Me</h1>
          <p className="me-hero__sub">
            Profile · tier · rank · portfolio · settings · public link — six
            surfaces, one identity.
          </p>
        </div>
      </header>

      <section className="me-bento" aria-label="Identity modules">
        {/* ── Row 1 ── */}

        {/* PROFILE — champagne solid hero */}
        <BentoModule
          href="/creator/profile"
          eyebrow="Profile · who you are"
          icon={<User {...ICON_PROPS} />}
          span={5}
          tone="champagne"
        >
          <div className="me-profile">
            <span className="me-avatar" aria-hidden>
              {me.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
            <div className="me-profile__copy">
              <h2 className="me-profile__name">{me.name}</h2>
              <p className="me-profile__handle">{me.handle}</p>
              <p className="me-profile__meta">
                {me.tier} · score {me.score} · {me.rankCity}
              </p>
            </div>
          </div>
          <div className="me-badges">
            <span className="me-badge me-badge--gold">Operator</span>
            <span className="me-badge">Verified</span>
            <span className="me-badge">Brooklyn local</span>
          </div>
        </BentoModule>

        {/* TIER — 6-tier ladder visualization w/ score progression */}
        <BentoModule
          href="/creator/analytics/tier"
          eyebrow={`Tier · ${me.tier}`}
          icon={<TrendingUp {...ICON_PROPS} />}
          span={4}
        >
          <p className="me-tier__score">{me.score}</p>
          <p className="me-tier__score-lbl">Push score</p>
          <ol className="me-tier-ladder" aria-label="6-tier ladder">
            {[
              { name: "Seed", floor: 0 },
              { name: "Explorer", floor: 10 },
              { name: "Operator", floor: 30 },
              { name: "Proven", floor: 65 },
              { name: "Closer", floor: 85 },
              { name: "Obsidian", floor: 95 },
            ].map((t, i) => {
              const reached = me.score >= t.floor;
              const current = me.tierIdx === i;
              return (
                <li
                  key={t.name}
                  className={
                    "me-tier-ladder__step" +
                    (reached ? " is-reached" : "") +
                    (current ? " is-current" : "")
                  }
                >
                  <span className="me-tier-ladder__bar" />
                  <span className="me-tier-ladder__lbl">{t.name}</span>
                </li>
              );
            })}
          </ol>
          <div className="me-tier__track" aria-label="Tier progress">
            <div className="me-tier__fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="me-tier__meta">
            <strong>{me.nextScore - me.score} pts</strong> to {me.nextTier}
          </p>
        </BentoModule>

        {/* RANK — leaderboard */}
        <BentoModule
          href="/creator/leaderboard"
          eyebrow="Rank · neighborhood"
          icon={<Trophy {...ICON_PROPS} />}
          span={3}
        >
          <KpiBlock
            eyebrow={me.rankCity.toUpperCase()}
            value={`#${me.rank}`}
            tone="ink"
          />
          <span className="me-row-status">
            <StatusPill
              variant="green"
              label={`Top ${Math.round((me.rank / me.rankCityTotal) * 100)}%`}
              dot
            />
          </span>
        </BentoModule>

        {/* ── Row 2 ── */}

        {/* PORTFOLIO — 3-image strip */}
        <BentoModule
          href="/creator/portfolio"
          eyebrow={`Portfolio · ${me.portfolioCount} works`}
          icon={<ImageIcon {...ICON_PROPS} />}
          span={5}
        >
          <div className="me-portfolio" aria-label="Portfolio preview">
            <span className="me-portfolio__tile me-portfolio__tile--1" />
            <span className="me-portfolio__tile me-portfolio__tile--2" />
            <span className="me-portfolio__tile me-portfolio__tile--3" />
            <span className="me-portfolio__more">+15</span>
          </div>
          <p className="me-portfolio__meta">
            <Sparkles size={12} strokeWidth={2.25} /> 3 most-engaged this month
          </p>
        </BentoModule>

        {/* SETTINGS — link tile */}
        <BentoModule
          href="/creator/settings"
          eyebrow="Settings"
          icon={<Settings {...ICON_PROPS} />}
          span={4}
        >
          <ul className="me-list">
            <li className="me-list__row">
              <span className="me-list__name">Notifications</span>
              <span className="me-list__count">3</span>
            </li>
            <li className="me-list__row">
              <span className="me-list__name">Payouts &amp; tax</span>
              <span className="me-list__count">W-9</span>
            </li>
            <li className="me-list__row">
              <span className="me-list__name">Privacy &amp; data</span>
              <ArrowRight size={14} strokeWidth={2.25} />
            </li>
          </ul>
        </BentoModule>

        {/* PUBLIC LINK — ink solid */}
        <BentoModule
          href={`/creator/public/alex-chen`}
          eyebrow="Public link · share"
          icon={<Share2 {...ICON_PROPS} />}
          span={3}
          tone="ink"
        >
          <p className="me-link__url">{me.publicLink}</p>
          <p className="me-link__meta">142 views · last 30d</p>
          <span className="me-link__btn">Copy link →</span>
        </BentoModule>
      </section>
    </main>
  );
}
