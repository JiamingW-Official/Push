"use client";

// Creator Dashboard — Push v5.1
// Vertical AI for Local Commerce · Customer Acquisition Engine
// Creator cockpit: earnings, tier progression, active campaigns,
// recent ConversionOracle verifications, Williamsburg Coffee+ leaderboard.

import Link from "next/link";
import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import "./dashboard.css";

/* ── Static demo data (v5.1 Two-Segment Creator Economics) ── */

type TierKey =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

type CreatorProfile = {
  handle: string;
  displayName: string;
  avatar: string;
  tier: TierKey;
  tierLabel: string;
  tierMaterial: string;
  pushScore: number;
  nextTier: TierKey | null;
  nextTierLabel: string;
  nextTierMin: number;
  nextTierPerk: string;
  earningsWeek: number;
  earningsMonth: number;
  earningsAllTime: number;
  neighborhoodRank: number;
  neighborhoodSize: number;
  neighborhoodName: string;
  weeklyRankDelta: number;
};

const CREATOR: CreatorProfile = {
  handle: "@maya.brooklyn",
  displayName: "Maya Rivera",
  avatar: "MR",
  tier: "operator",
  tierLabel: "Operator",
  tierMaterial: "Steel",
  pushScore: 62,
  nextTier: "proven",
  nextTierLabel: "Proven",
  nextTierMin: 65,
  nextTierPerk:
    "Retainer eligibility — $800/mo + $25/customer with Coffee+ merchants.",
  earningsWeek: 184,
  earningsMonth: 742,
  earningsAllTime: 3820,
  neighborhoodRank: 7,
  neighborhoodSize: 42,
  neighborhoodName: "Williamsburg Coffee+",
  weeklyRankDelta: 3,
};

type CampaignStatus =
  | "applied"
  | "accepted"
  | "posted"
  | "verified"
  | "scheduled";

type ActiveCampaign = {
  id: string;
  merchant: string;
  neighborhood: string;
  title: string;
  payout: string;
  perCustomer: number;
  deadline: string;
  status: CampaignStatus;
  quickAction: { label: string; href: string };
};

const ACTIVE_CAMPAIGNS: ActiveCampaign[] = [
  {
    id: "c-001",
    merchant: "Devoción Williamsburg",
    neighborhood: "Williamsburg",
    title: "Single-origin pour-over — 20 verified walk-ins",
    payout: "$20 × 20",
    perCustomer: 20,
    deadline: "3 days left",
    status: "accepted",
    quickAction: { label: "Open brief", href: "/creator/explore/c-001" },
  },
  {
    id: "c-002",
    merchant: "Partners Coffee",
    neighborhood: "Williamsburg",
    title: "Morning rush takeover — Thursday 7–10am",
    payout: "$15 × 25",
    perCustomer: 15,
    deadline: "Posts Thursday",
    status: "scheduled",
    quickAction: { label: "Upload draft", href: "/creator/explore/c-002" },
  },
  {
    id: "c-003",
    merchant: "Sey Coffee",
    neighborhood: "Williamsburg",
    title: "Saturday cortado crawl",
    payout: "$25 × 15",
    perCustomer: 25,
    deadline: "Verifying",
    status: "verified",
    quickAction: { label: "Track payout", href: "/creator/earnings" },
  },
];

type Verification = {
  id: string;
  shop: string;
  qrId: string;
  amount: number;
  verdict: "verified" | "review" | "flagged";
  when: string;
};

const VERIFICATIONS: Verification[] = [
  {
    id: "v-108",
    shop: "Devoción Williamsburg",
    qrId: "QR-WLMB-2341",
    amount: 20,
    verdict: "verified",
    when: "14 min ago",
  },
  {
    id: "v-107",
    shop: "Partners Coffee",
    qrId: "QR-WLMB-2338",
    amount: 15,
    verdict: "verified",
    when: "42 min ago",
  },
  {
    id: "v-106",
    shop: "Partners Coffee",
    qrId: "QR-WLMB-2337",
    amount: 15,
    verdict: "verified",
    when: "1 hr ago",
  },
  {
    id: "v-105",
    shop: "Sey Coffee",
    qrId: "QR-WLMB-2331",
    amount: 25,
    verdict: "verified",
    when: "3 hr ago",
  },
  {
    id: "v-104",
    shop: "Sey Coffee",
    qrId: "QR-WLMB-2329",
    amount: 25,
    verdict: "review",
    when: "Yesterday",
  },
  {
    id: "v-103",
    shop: "Devoción Williamsburg",
    qrId: "QR-WLMB-2322",
    amount: 20,
    verdict: "verified",
    when: "Yesterday",
  },
  {
    id: "v-102",
    shop: "Partners Coffee",
    qrId: "QR-WLMB-2319",
    amount: 15,
    verdict: "verified",
    when: "2 days ago",
  },
  {
    id: "v-101",
    shop: "Sey Coffee",
    qrId: "QR-WLMB-2316",
    amount: 25,
    verdict: "flagged",
    when: "2 days ago",
  },
];

/* ── Suggested campaigns (seed tier, Williamsburg ZIP cluster) ── */

type SuggestedCampaign = {
  id: string;
  merchant: string;
  neighborhood: string;
  title: string;
  payout: string;
  perCustomer: number;
  spotsLeft: number;
};

const SUGGESTED_CAMPAIGNS: SuggestedCampaign[] = [
  {
    id: "s-001",
    merchant: "Devoción Williamsburg",
    neighborhood: "Williamsburg · 11211",
    title: "Single-origin espresso — 15 verified walk-ins",
    payout: "$20 × 15",
    perCustomer: 20,
    spotsLeft: 3,
  },
  {
    id: "s-002",
    merchant: "Fortunato No. 4",
    neighborhood: "Williamsburg · 11211",
    title: "Weekend pastry + coffee post",
    payout: "$15 × 20",
    perCustomer: 15,
    spotsLeft: 5,
  },
  {
    id: "s-003",
    merchant: "Blue Bottle Coffee",
    neighborhood: "Williamsburg · 11249",
    title: "Cold brew season — morning post",
    payout: "$18 × 12",
    perCustomer: 18,
    spotsLeft: 4,
  },
];

/* ── Creator milestones ── */

type CreatorMilestone = {
  id: string;
  label: string;
  bonus: number;
  target: number;
  current: number;
};

const CREATOR_MILESTONES: CreatorMilestone[] = [
  {
    id: "m-01",
    label: "First 20 verified customers",
    bonus: 50,
    target: 20,
    current: 14,
  },
  {
    id: "m-02",
    label: "Reach Explorer tier (score 40+)",
    bonus: 100,
    target: 40,
    current: 28,
  },
];

/* ── Tier Identity helpers (per Design.md v4.1) ── */

const TIER_TO_MATERIAL: Record<TierKey, string> = {
  seed: "Clay",
  explorer: "Bronze",
  operator: "Steel",
  proven: "Gold",
  closer: "Ruby",
  partner: "Obsidian",
};

function tierBadgeClass(tier: TierKey) {
  return `tier-badge badge-${TIER_TO_MATERIAL[tier].toLowerCase()}`;
}

/* ── Page ── */

export default function CreatorDashboardPage() {
  return (
    <Suspense fallback={<div className="dash-loading">Loading cockpit…</div>}>
      <DashboardCockpit />
    </Suspense>
  );
}

function DashboardCockpit() {
  const searchParams = useSearchParams();
  const seeded = searchParams.get("seeded") === "1";

  if (!seeded) {
    return <EmptyState />;
  }

  return <SeededCockpit />;
}

/* ── Empty State (first-run) ── */

function EmptyState() {
  const steps = [
    {
      n: "01",
      label: "Complete onboarding",
      href: "/creator/onboarding",
      done: false,
    },
    {
      n: "02",
      label: "Apply to first campaign",
      href: "/creator/explore",
      done: false,
    },
    {
      n: "03",
      label: "Visit + scan QR",
      href: "/creator/verify",
      done: false,
    },
  ];

  return (
    <main className="cockpit cockpit--empty">
      <header className="empty-hero">
        <p className="empty-eyebrow">
          Push · Customer Acquisition Engine for Local Commerce
        </p>
        <h1 className="empty-title">
          Welcome to Push.
          <br />
          Let&apos;s get you paid.
        </h1>
        <p className="empty-sub">
          Williamsburg Coffee+ merchants are buying verified walk-ins through
          ConversionOracle™. Three steps from here to your first payout.
        </p>

        <ol className="empty-steps" aria-label="Activation steps">
          {steps.map((s) => (
            <li key={s.n} className="empty-step">
              <span className="empty-step__num">{s.n}</span>
              <span className="empty-step__label">{s.label}</span>
              <Link className="empty-step__link" href={s.href}>
                Start
              </Link>
            </li>
          ))}
        </ol>
      </header>

      <section className="empty-actions" aria-label="Quick actions">
        <Link className="empty-action" href="/creator/explore">
          <span className="empty-action__tag">01 · Explore</span>
          <h2 className="empty-action__title">Find campaigns</h2>
          <p className="empty-action__body">
            Browse live briefs from the Williamsburg Coffee+ Neighborhood
            Playbook — per-customer payouts $12 – $25.
          </p>
          <span className="empty-action__arrow" aria-hidden>
            →
          </span>
        </Link>

        <Link className="empty-action" href="/creator/onboarding">
          <span className="empty-action__tag">02 · Profile</span>
          <h2 className="empty-action__title">Complete profile</h2>
          <p className="empty-action__body">
            Verify handles, pick neighborhoods, and sign the DisclosureBot
            agreement so we can route briefs to you.
          </p>
          <span className="empty-action__arrow" aria-hidden>
            →
          </span>
        </Link>

        <Link className="empty-action" href="/demo/creator">
          <span className="empty-action__tag">03 · Preview</span>
          <h2 className="empty-action__title">Try demo mode</h2>
          <p className="empty-action__body">
            See a seeded dashboard with fake earnings, tier progress, and
            ConversionOracle verifications — no commitments.
          </p>
          <span className="empty-action__arrow" aria-hidden>
            →
          </span>
        </Link>
      </section>

      <SuggestedCampaigns />

      <footer className="empty-foot">
        <Link className="empty-foot__skip" href="/creator/dashboard?seeded=1">
          Skip to seeded cockpit (preview)
        </Link>
      </footer>
    </main>
  );
}

/* ── Seeded Cockpit (main) ── */

function SeededCockpit() {
  const [bannerOpen, setBannerOpen] = useState(true);
  const nextTierGap = Math.max(0, CREATOR.nextTierMin - CREATOR.pushScore);
  const progressPct = useMemo(() => {
    // simple progress from current tier floor (55 for Operator) to next (65)
    const floor = 55;
    const ceiling = CREATOR.nextTierMin;
    const pct =
      ((CREATOR.pushScore - floor) / Math.max(1, ceiling - floor)) * 100;
    return Math.max(4, Math.min(100, pct));
  }, []);

  return (
    <main className="cockpit cockpit--seeded">
      {/* Topline greeting */}
      <header className="cockpit-head">
        <div className="cockpit-head__left">
          <p className="cockpit-head__eyebrow">
            Customer Acquisition Engine · Williamsburg Coffee+
          </p>
          <h1 className="cockpit-head__title">
            Back at it, {CREATOR.displayName.split(" ")[0]}.
          </h1>
          <p className="cockpit-head__sub">
            {ACTIVE_CAMPAIGNS.length} active campaigns · {CREATOR.handle}
          </p>
        </div>
        <nav className="cockpit-head__nav" aria-label="Cockpit navigation">
          <Link href="/creator/explore" className="nav-chip">
            Explore
          </Link>
          <Link href="/creator/earnings" className="nav-chip">
            Earnings
          </Link>
          <Link href="/creator/portfolio" className="nav-chip">
            Portfolio
          </Link>
          <Link href="/creator/calendar" className="nav-chip">
            Calendar
          </Link>
          <Link href="/creator/disputes" className="nav-chip">
            Disputes
          </Link>
          <Link href="/creator/settings" className="nav-chip">
            Settings
          </Link>
        </nav>
      </header>

      {bannerOpen && ACTIVE_CAMPAIGNS.length < 1 && (
        <FirstCampaignBanner onDismiss={() => setBannerOpen(false)} />
      )}

      {/* 2-col layout */}
      <div className="cockpit-grid">
        <div className="cockpit-main">
          {/* Earnings + Tier row */}
          <section className="row-top">
            <EarningsWidget />
            <TierProgressCard
              progressPct={progressPct}
              nextTierGap={nextTierGap}
            />
          </section>

          <MilestoneWidget />

          {/* Active campaigns */}
          <section className="section" aria-labelledby="active-h">
            <div className="section-head section-head--sticky">
              <h2 id="active-h" className="section-title">
                Active campaigns
              </h2>
              <Link href="/creator/explore" className="section-link">
                Find more →
              </Link>
            </div>
            <div className="campaigns-row">
              {ACTIVE_CAMPAIGNS.map((c) => (
                <CampaignCard key={c.id} campaign={c} />
              ))}
            </div>
          </section>

          {/* Recent verifications */}
          <section className="section" aria-labelledby="verif-h">
            <div className="section-head">
              <h2 id="verif-h" className="section-title">
                Recent verifications
              </h2>
              <span className="section-hint">
                ConversionOracle™ · last 8 walk-ins
              </span>
            </div>
            <div className="verif-feed">
              {VERIFICATIONS.map((v) => (
                <VerificationRow key={v.id} verification={v} />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="cockpit-side" aria-label="Sidebar">
          <LeaderboardTeaser />
          <QuickActionsRail />
          <SLRNote />
        </aside>
      </div>
    </main>
  );
}

/* ── Earnings Widget ── */

function EarningsWidget() {
  return (
    <article className="card card--earnings">
      <header className="card-head">
        <span className="card-eyebrow">Earnings</span>
        <Link href="/creator/earnings" className="card-link">
          Full ledger →
        </Link>
      </header>
      <div className="earnings-primary">
        <span className="earnings-primary__label">This week</span>
        <strong className="earnings-primary__amount">
          ${CREATOR.earningsWeek.toLocaleString()}
        </strong>
        <span className="earnings-primary__delta">↗ +$64 vs. last week</span>
      </div>
      <dl className="earnings-row">
        <div className="earnings-cell">
          <dt>Month-to-date</dt>
          <dd>${CREATOR.earningsMonth.toLocaleString()}</dd>
        </div>
        <div className="earnings-cell">
          <dt>All-time</dt>
          <dd>${CREATOR.earningsAllTime.toLocaleString()}</dd>
        </div>
        <div className="earnings-cell">
          <dt>Pending</dt>
          <dd>$420</dd>
        </div>
      </dl>
    </article>
  );
}

/* ── Tier Progress Card ── */

function TierProgressCard({
  progressPct,
  nextTierGap,
}: {
  progressPct: number;
  nextTierGap: number;
}) {
  return (
    <article className="card card--tier">
      <header className="card-head">
        <span className="card-eyebrow">Tier</span>
        <span className={tierBadgeClass(CREATOR.tier)}>
          {CREATOR.tierMaterial} · {CREATOR.tierLabel}
        </span>
      </header>
      <div className="tier-score">
        <span className="tier-score__value">{CREATOR.pushScore}</span>
        <span className="tier-score__unit">Push Score</span>
      </div>

      <div className="tier-progress" aria-label="Progress to next tier">
        <div className="tier-progress__meta">
          <span>{CREATOR.tierLabel}</span>
          <span>
            Next: {CREATOR.nextTierLabel}{" "}
            <em className="tier-progress__gap">+{nextTierGap} to unlock</em>
          </span>
        </div>
        <div className="tier-progress__bar">
          <div
            className="tier-progress__fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="tier-unlock">
        <span className="tier-unlock__label">
          Unlocks at {CREATOR.nextTierLabel}
        </span>
        <p className="tier-unlock__body">{CREATOR.nextTierPerk}</p>
      </div>
    </article>
  );
}

/* ── Campaign card ── */

function CampaignCard({ campaign }: { campaign: ActiveCampaign }) {
  return (
    <article className="campaign-card">
      <header className="campaign-card__head">
        <span className={`status status--${campaign.status}`}>
          {campaign.status}
        </span>
        <span className="campaign-card__deadline">{campaign.deadline}</span>
      </header>
      <div className="campaign-card__body">
        <p className="campaign-card__merchant">{campaign.merchant}</p>
        <h3 className="campaign-card__title">{campaign.title}</h3>
        <p className="campaign-card__meta">
          {campaign.neighborhood} · ${campaign.perCustomer}/customer
        </p>
      </div>
      <footer className="campaign-card__foot">
        <span className="campaign-card__payout">{campaign.payout}</span>
        <Link href={campaign.quickAction.href} className="campaign-card__cta">
          {campaign.quickAction.label} →
        </Link>
      </footer>
    </article>
  );
}

/* ── Verification feed row ── */

function VerificationRow({ verification }: { verification: Verification }) {
  return (
    <div className={`verif-row verif-row--${verification.verdict}`}>
      <div className="verif-row__left">
        <span className="verif-row__verdict">
          {verification.verdict === "verified" && "✓ Verified"}
          {verification.verdict === "review" && "⋯ In review"}
          {verification.verdict === "flagged" && "⚠ Flagged"}
        </span>
        <div className="verif-row__meta">
          <strong>{verification.shop}</strong>
          <span>{verification.qrId}</span>
        </div>
      </div>
      <div className="verif-row__right">
        <span className="verif-row__amount">+${verification.amount}</span>
        <span className="verif-row__when">{verification.when}</span>
      </div>
    </div>
  );
}

/* ── Leaderboard teaser ── */

function LeaderboardTeaser() {
  return (
    <article className="side-card">
      <header className="side-card__head">
        <span className="side-card__eyebrow">Leaderboard</span>
        <Link href="/creator/leaderboard" className="side-card__link">
          View →
        </Link>
      </header>
      <div className="leader">
        <span className="leader__rank">#{CREATOR.neighborhoodRank}</span>
        <div className="leader__meta">
          <strong>
            of {CREATOR.neighborhoodSize} in {CREATOR.neighborhoodName}
          </strong>
          <span className="leader__delta">
            ↑ {CREATOR.weeklyRankDelta} spots this week
          </span>
        </div>
      </div>
      <p className="leader__note">
        Top 5 unlocks Proven-tier retainer slots at partner cafes.
      </p>
    </article>
  );
}

/* ── Quick actions rail ── */

function QuickActionsRail() {
  const actions = [
    { label: "Upload receipt", href: "/creator/verify", emoji: "↑" },
    { label: "Find campaign", href: "/creator/explore", emoji: "◎" },
    { label: "Invite friend", href: "/creator/settings#refer", emoji: "+" },
    { label: "Check disputes", href: "/creator/disputes", emoji: "⚠" },
  ];
  return (
    <article className="side-card">
      <header className="side-card__head">
        <span className="side-card__eyebrow">Quick actions</span>
      </header>
      <ul className="qa-list">
        {actions.map((a) => (
          <li key={a.label} className="qa-item">
            <Link href={a.href} className="qa-link">
              <span className="qa-glyph" aria-hidden>
                {a.emoji}
              </span>
              <span className="qa-label">{a.label}</span>
              <span className="qa-arrow" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}

/* ── SLR note (brand moment) ── */

function SLRNote() {
  return (
    <article className="side-card side-card--slr">
      <span className="side-card__eyebrow">Software Leverage Ratio</span>
      <p className="slr-copy">
        Push routes your capacity so one creator supports many merchants. Your
        SLR contribution this week: <strong className="slr-number">4.8</strong>.
      </p>
      <Link href="/creator/portfolio" className="slr-link">
        See how you compound →
      </Link>
    </article>
  );
}

/* ── First campaign banner ── */

function FirstCampaignBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <aside className="guide-banner" role="note">
      <div>
        <p className="guide-banner__eyebrow">First-campaign guide</p>
        <p className="guide-banner__body">
          New here? Our Neighborhood Playbook walks you through applying,
          posting, and getting paid in under 90 minutes.
        </p>
      </div>
      <div className="guide-banner__actions">
        <Link href="/creator/onboarding" className="guide-banner__cta">
          Open guide
        </Link>
        <button
          type="button"
          className="guide-banner__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss first-campaign guide"
        >
          ×
        </button>
      </div>
    </aside>
  );
}

/* ── Suggested campaigns (first-login) ── */

function SuggestedCampaigns() {
  return (
    <section className="suggested-section" aria-labelledby="suggested-h">
      <div className="section-head">
        <div>
          <h2 id="suggested-h" className="section-title">
            Suggested for you
          </h2>
          <p className="suggested-sub">
            Williamsburg Coffee+ · Seed tier · 3 open briefs
          </p>
        </div>
        <Link href="/creator/explore" className="section-link">
          See all →
        </Link>
      </div>
      <div className="campaigns-row">
        {SUGGESTED_CAMPAIGNS.map((c) => (
          <article key={c.id} className="campaign-card">
            <header className="campaign-card__head">
              <span className="status status--applied">Open</span>
              <span className="campaign-card__deadline">
                {c.spotsLeft} spots left
              </span>
            </header>
            <div className="campaign-card__body">
              <p className="campaign-card__merchant">{c.merchant}</p>
              <h3 className="campaign-card__title">{c.title}</h3>
              <p className="campaign-card__meta">
                {c.neighborhood} · ${c.perCustomer}/customer
              </p>
            </div>
            <footer className="campaign-card__foot">
              <span className="campaign-card__payout">{c.payout}</span>
              <Link href="/creator/explore" className="campaign-card__cta">
                Apply →
              </Link>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ── Milestone widget ── */

function MilestoneWidget() {
  const next = CREATOR_MILESTONES.find((m) => m.current < m.target);
  if (!next) return null;
  const pct = Math.max(4, Math.min(100, (next.current / next.target) * 100));
  return (
    <section className="milestone-widget" aria-label="Next milestone">
      <div className="milestone-head">
        <span className="milestone-eyebrow">Next milestone</span>
        <span className="milestone-bonus">+${next.bonus} bonus</span>
      </div>
      <p className="milestone-label">{next.label}</p>
      <div
        className="milestone-track"
        aria-label={`${next.current} of ${next.target} complete`}
      >
        <div className="milestone-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="milestone-meta">
        <span>
          {next.current} / {next.target} verified
        </span>
        <span>{next.target - next.current} to go</span>
      </div>
    </section>
  );
}
