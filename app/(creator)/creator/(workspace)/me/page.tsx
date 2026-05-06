"use client";

/* ============================================================
   /creator/me — IDENTITY domain hub. Audit § 5.6 bento spec.

   Collapses 6 fragmented pages into one anchor:
     - /profile (basics) → IDENTITY: Profile module
     - /analytics/tier (progression) → IDENTITY: Tier module
     - /leaderboard (rank) → IDENTITY: Rank module
     - /portfolio (work) → IDENTITY: Portfolio module
     - /settings (preferences) → IDENTITY: Settings module
     - /public/[id] (shared view) → IDENTITY: Public link module

   Bento (audit § 5.6):
     [─ PROFILE PHOTO + BADGES (7) ─] [─ TIER (5×2) ─]
     [─ LEADERBOARD RANK (7) ──────]
     [─ PORTFOLIO grid (7) ──] [─ SETTINGS link (5) ──]
     [──── PUBLIC LINK preview (12) ───────────────────]
   ============================================================ */

import {
  BentoModule,
  KpiBlock,
  ProgressBar,
  StatusPill,
} from "@/components/shared/primitives";
import "@/components/shared/hub-shell.css";
import "./me.css";

export default function IdentityHub() {
  return (
    <main className="me-hub" aria-label="Identity">
      <header className="me-hero">
        <p className="me-hero__eyebrow">IDENTITY · WHO YOU ARE ON PUSH</p>
        <h1 className="me-hero__title">Me</h1>
        <p className="me-hero__sub">
          Six surfaces for the creator-side identity — profile that brands see,
          tier you've earned, rank in your neighborhood, portfolio of best work,
          settings that govern everything, and the public link that packages it
          all.
        </p>
      </header>

      <section className="me-bento" aria-label="Identity modules">
        {/* ── PROFILE PHOTO + BADGES (span 7) ── */}
        <BentoModule
          href="/creator/profile"
          eyebrow="PROFILE · YOUR ANCHOR"
          span={7}
          live="off"
          sub="Edit name, bio, photo, niches, neighborhoods"
        >
          <div className="me-profile-row">
            <span className="me-avatar" aria-hidden>
              M
            </span>
            <div className="me-profile-text">
              <span className="me-profile-name">Maya</span>
              <span className="me-profile-handle">
                @maya · Williamsburg, BK
              </span>
              <div className="me-profile-badges">
                <StatusPill variant="ink" label="Operator tier" />
                <StatusPill variant="green" label="Verified" dot />
                <StatusPill variant="amber" label="FTC-ready" />
              </div>
            </div>
          </div>
        </BentoModule>

        {/* ── TIER (span 5) ── */}
        <BentoModule
          href="/creator/analytics/tier"
          eyebrow="TIER · OPERATOR · 67% TO PROVEN"
          span={5}
          live="live"
          sub="Score · 67/100 · 33 pts to next tier"
        >
          <KpiBlock
            eyebrow=""
            value="67"
            tone="ink"
            delta={{ direction: "up", label: "+4 this month" }}
            compact
          />
          <ProgressBar
            mode="milestone"
            value={67}
            milestones={[
              { atPct: 0, label: "Seed" },
              { atPct: 25, label: "Explorer" },
              { atPct: 50, label: "Operator" },
              { atPct: 75, label: "Proven" },
              { atPct: 100, label: "Closer" },
            ]}
            tone="champagne"
          />
        </BentoModule>

        {/* ── LEADERBOARD RANK (span 7) ── */}
        <BentoModule
          href="/creator/leaderboard"
          eyebrow="RANK · WILLIAMSBURG · 30D"
          span={7}
          live="off"
          sub="Cohort · 24 creators · 1 of 3 you outranked this week"
        >
          <div className="me-rank-row">
            <KpiBlock eyebrow="" value="#7" tone="ink" />
            <span className="me-rank-context">
              of <strong>24</strong> creators in your neighborhood ·{" "}
              <strong>↑3</strong> spots vs last week
            </span>
          </div>
        </BentoModule>

        {/* ── PORTFOLIO (span 7) ── */}
        <BentoModule
          href="/creator/portfolio"
          eyebrow="PORTFOLIO · BEST-OF WORK"
          span={7}
          live="off"
          sub="14 pieces · 4 featured · what brands see first"
        >
          <div className="me-portfolio-strip">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`me-portfolio-tile me-portfolio-tile--${i % 3}`}
                aria-hidden
              />
            ))}
            <span className="me-portfolio-more">+9</span>
          </div>
        </BentoModule>

        {/* ── SETTINGS (span 5) ── */}
        <BentoModule
          href="/creator/settings"
          eyebrow="SETTINGS · 9 SECTIONS"
          span={5}
          live="off"
          sub="Account · Payments · Verification · Notifications · Privacy · ..."
        >
          <div className="me-settings-list">
            <span className="me-settings-row">
              <StatusPill variant="green" label="ID verified" dot />
            </span>
            <span className="me-settings-row">
              <StatusPill variant="green" label="Bank linked" dot />
            </span>
            <span className="me-settings-row">
              <StatusPill variant="amber" label="2FA off" />
            </span>
          </div>
        </BentoModule>

        {/* ── PUBLIC LINK PREVIEW (span 12) ── */}
        <BentoModule
          href="/creator/public/me"
          eyebrow="PUBLIC LINK · WHAT MERCHANTS SEE"
          span={12}
          live="off"
          sub="push.app/c/maya · share with brands when pitching renewals"
        >
          <div className="me-public-row">
            <KpiBlock eyebrow="REACH" value="14.2K" tone="ink" compact />
            <KpiBlock eyebrow="COMPLETION" value="98%" tone="ink" compact />
            <KpiBlock
              eyebrow="AVG STORY"
              value="$42"
              tone="champagne"
              compact
            />
            <span className="me-public-cta">
              <span className="me-public-handle">push.app/c/maya</span>
              <span className="me-public-action">Copy link →</span>
            </span>
          </div>
        </BentoModule>
      </section>
    </main>
  );
}
