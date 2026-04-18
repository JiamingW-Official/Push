"use client";

/* ============================================================
   Push — Merchant Dashboard · v5.1
   Vertical AI for Local Commerce — Customer Acquisition Engine
   First-run onboarding + daily operator cockpit.
   ============================================================ */

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SLRWidget from "@/components/merchant/SLRWidget";
import EmptyStateHero from "@/components/merchant/dashboard/EmptyStateHero";
import VerifiedFeed, {
  type VerifiedCustomer,
} from "@/components/merchant/dashboard/VerifiedFeed";
import FirstRunBanner from "@/components/merchant/dashboard/FirstRunBanner";
import "./dashboard.css";

/* ── Types ──────────────────────────────────────────────── */
type SidebarTab = "cockpit" | "campaigns" | "applications" | "analytics";

type CockpitCampaign = {
  id: string;
  title: string;
  goal: string;
  progressCurrent: number;
  progressTotal: number;
  roiProjection: string;
  status: "active" | "paused";
};

type QRSnap = {
  id: string;
  code: string;
  label: string;
  lastScan: string;
  scans7d: number;
};

/* ── Demo data — v5.1 Williamsburg Coffee+ beachhead ───── */
const MOCK_MERCHANT = {
  business_name: "Devoción — Williamsburg",
  email: "ops@devocion.coffee",
};

const MOCK_VERIFIED: VerifiedCustomer[] = [
  {
    id: "v-001",
    handle: "@mayajohns",
    qrId: "QR-WB-COUNTER",
    timestamp: new Date(Date.now() - 2 * 60_000).toISOString(),
    amount: 14.5,
    verdict: "auto_verified",
    latencyMs: 6200,
  },
  {
    id: "v-002",
    handle: "@sofiainyc",
    qrId: "QR-WB-REGISTER",
    timestamp: new Date(Date.now() - 11 * 60_000).toISOString(),
    amount: 9.25,
    verdict: "auto_verified",
    latencyMs: 5400,
  },
  {
    id: "v-003",
    handle: "@jamesliu.eats",
    qrId: "QR-WB-COUNTER",
    timestamp: new Date(Date.now() - 34 * 60_000).toISOString(),
    amount: 18.75,
    verdict: "manual_review",
    latencyMs: 7800,
  },
  {
    id: "v-004",
    handle: "@rachelkimnyc",
    qrId: "QR-WB-COUNTER",
    timestamp: new Date(Date.now() - 55 * 60_000).toISOString(),
    amount: 12.0,
    verdict: "auto_verified",
    latencyMs: 5900,
  },
  {
    id: "v-005",
    handle: "@brooklyncoffeegal",
    qrId: "QR-WB-REGISTER",
    timestamp: new Date(Date.now() - 92 * 60_000).toISOString(),
    amount: 8.5,
    verdict: "auto_verified",
    latencyMs: 6100,
  },
  {
    id: "v-006",
    handle: "@ghostaccount22",
    qrId: "QR-WB-COUNTER",
    timestamp: new Date(Date.now() - 140 * 60_000).toISOString(),
    amount: 0,
    verdict: "auto_rejected",
  },
  {
    id: "v-007",
    handle: "@tompark.nyc",
    qrId: "QR-WB-REGISTER",
    timestamp: new Date(Date.now() - 190 * 60_000).toISOString(),
    amount: 11.25,
    verdict: "auto_verified",
    latencyMs: 5700,
  },
  {
    id: "v-008",
    handle: "@alexchen.nyc",
    qrId: "QR-WB-COUNTER",
    timestamp: new Date(Date.now() - 260 * 60_000).toISOString(),
    amount: 15.0,
    verdict: "auto_verified",
    latencyMs: 6400,
  },
];

const MOCK_CAMPAIGNS: CockpitCampaign[] = [
  {
    id: "c-001",
    title: "Morning Rush — 30-Second Reel",
    goal: "Goal: 12 verified walk-ins / week",
    progressCurrent: 8,
    progressTotal: 12,
    roiProjection: "Est. SLR +1.2 · GM +$284",
    status: "active",
  },
  {
    id: "c-002",
    title: "Holiday Blend Launch",
    goal: "Goal: 20 verified walk-ins by Apr 30",
    progressCurrent: 5,
    progressTotal: 20,
    roiProjection: "Est. SLR +2.1 · GM +$472",
    status: "active",
  },
  {
    id: "c-003",
    title: "Afternoon Regulars",
    goal: "Goal: 6 verified return visits / week",
    progressCurrent: 3,
    progressTotal: 6,
    roiProjection: "Retention add-on · GM +$142",
    status: "paused",
  },
];

const MOCK_QR_SNAPS: QRSnap[] = [
  {
    id: "qr-counter",
    code: "WB-C",
    label: "Counter — front of house",
    lastScan: "2 min ago",
    scans7d: 47,
  },
  {
    id: "qr-register",
    code: "WB-R",
    label: "Register — point of sale",
    lastScan: "11 min ago",
    scans7d: 38,
  },
  {
    id: "qr-takeout",
    code: "WB-T",
    label: "Takeout bag sticker",
    lastScan: "1h ago",
    scans7d: 19,
  },
];

/* ── Sidebar icons (lightweight inline SVGs) ───────────── */
function Icon({ path }: { path: string }) {
  return (
    <svg
      className="db-nav-item__icon"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d={path} />
    </svg>
  );
}

/* ── Page ──────────────────────────────────────────────── */
export default function MerchantDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const seeded = searchParams?.get("seeded") === "1";
  // v5.1: Detect whether the merchant has any campaigns yet.
  // Pretend via hook — only seeded if ?seeded=1 query is present.
  const hasCampaigns = seeded;

  const [activeTab, setActiveTab] = useState<SidebarTab>("cockpit");

  const verifiedCount = useMemo(
    () => MOCK_VERIFIED.filter((v) => v.verdict === "auto_verified").length,
    [],
  );
  const pendingCount = useMemo(
    () => MOCK_VERIFIED.filter((v) => v.verdict === "manual_review").length,
    [],
  );
  const autoVerifyRate = useMemo(() => {
    const scored = MOCK_VERIFIED.filter((v) => v.verdict !== "manual_review");
    if (scored.length === 0) return 0;
    return Math.round(
      (scored.filter((v) => v.verdict === "auto_verified").length /
        scored.length) *
        100,
    );
  }, []);
  const owedPayout = useMemo(
    () =>
      MOCK_VERIFIED.filter((v) => v.verdict === "auto_verified").length * 15,
    [],
  );

  const showFirstRunBanner = hasCampaigns && MOCK_CAMPAIGNS.length < 2;

  const handleSignOut = () => {
    document.cookie = "push-demo-role=; path=/; max-age=0";
    router.push("/demo");
  };

  return (
    <div className="db-shell">
      {/* Top Nav */}
      <nav className="db-nav">
        <a href="/" className="db-nav__logo">
          Push<span>.</span>
        </a>
        <div className="db-nav__center">
          <span className="db-nav__title">
            Merchant · Customer Acquisition Engine
          </span>
        </div>
        <div className="db-nav__right">
          <span className="db-nav__email">{MOCK_MERCHANT.business_name}</span>
          <div className="db-nav__avatar" aria-label={MOCK_MERCHANT.email}>
            DV
          </div>
          <button className="db-nav__signout" onClick={handleSignOut}>
            Exit demo
          </button>
        </div>
      </nav>

      {/* Body */}
      <div className="db-body">
        {/* Sidebar */}
        <aside className="db-sidebar">
          <nav className="db-sidebar__nav">
            <div className="db-nav-section">
              <div className="db-nav-section__label">Menu</div>
              <button
                className={`db-nav-item${activeTab === "cockpit" ? " active" : ""}`}
                onClick={() => setActiveTab("cockpit")}
              >
                <Icon path="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" />
                Cockpit
              </button>
              <a
                href="/merchant/campaigns"
                className="db-nav-item"
                style={{ textDecoration: "none" }}
              >
                <Icon path="M1 2h14v12H1zM1 6h14M5 10h6" />
                Campaigns
              </a>
              <a
                href="/merchant/applications"
                className="db-nav-item"
                style={{ textDecoration: "none" }}
              >
                <Icon path="M6 5a3 3 0 100 6 3 3 0 000-6zM1 14c0-3 2.5-5 5-5s5 2 5 5M11 7h4M11 10h4" />
                Creators
              </a>
              <a
                href="/merchant/qr-codes"
                className="db-nav-item"
                style={{ textDecoration: "none" }}
              >
                <Icon path="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM10 10h2v2h-2zM13 13h1v1h-1z" />
                QR codes
              </a>
              <a
                href="/merchant/analytics"
                className="db-nav-item"
                style={{ textDecoration: "none" }}
              >
                <Icon path="M1 13l4-5 3 3 3-6 4 4M1 13h14" />
                ConversionOracle
              </a>
              <a
                href="/neighborhood-playbook"
                className="db-nav-item"
                style={{ textDecoration: "none" }}
              >
                <Icon path="M3 1h10v14H3zM6 1v14M9 5h3M9 8h3" />
                Playbook
              </a>
            </div>
          </nav>

          <div className="db-sidebar__footer">
            <div className="db-plan-badge">
              <div className="db-plan-badge__label">Current Plan</div>
              <div className="db-plan-badge__name">Coffee+ Operator</div>
              <div className="db-plan-badge__price">
                $500/mo min + $15-22/customer
              </div>
              <a href="/merchant/upgrade" className="db-plan-badge__upgrade">
                Manage plan →
              </a>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="db-main">
          {activeTab === "cockpit" && !hasCampaigns && <EmptyStateHero />}

          {activeTab === "cockpit" && hasCampaigns && (
            <>
              {/* Greeting */}
              <div className="cockpit-greeting">
                <div className="cockpit-greeting__eyebrow">
                  Wednesday · Apr 18 · Williamsburg Coffee+ beachhead · Day 47
                </div>
                <h1 className="cockpit-greeting__title">
                  You&rsquo;re running at SLR 8.
                </h1>
                <p className="cockpit-greeting__sub">
                  Vertical AI for Local Commerce &middot; Month-6 SLR target 12
                  &middot; industry baseline 3&ndash;5.
                </p>
              </div>

              {/* First-run guide */}
              {showFirstRunBanner && <FirstRunBanner />}

              {/* Cockpit 2-col layout */}
              <div className="cockpit-grid">
                {/* LEFT col: SLR widget + stats row */}
                <div className="cockpit-col">
                  <SLRWidget
                    currentSLR={8}
                    actualByMonth={[
                      { month: 1, actual: 3 },
                      { month: 2, actual: 6 },
                      { month: 3, actual: 8 },
                    ]}
                  />

                  <div className="cockpit-section">
                    <div className="cockpit-section__head">
                      <h3 className="cockpit-section__title">This week</h3>
                      <a
                        href="/merchant/analytics"
                        className="cockpit-section__link"
                      >
                        Full ConversionOracle →
                      </a>
                    </div>
                    <div className="cockpit-stats-row">
                      <div className="cockpit-stat">
                        <div className="cockpit-stat__label">
                          Verified customers
                        </div>
                        <div className="cockpit-stat__value">
                          {verifiedCount}
                        </div>
                        <div className="cockpit-stat__sub cockpit-stat__sub--pos">
                          +3 vs last week
                        </div>
                      </div>
                      <div className="cockpit-stat">
                        <div className="cockpit-stat__label">
                          Pending verification
                        </div>
                        <div className="cockpit-stat__value">
                          {pendingCount}
                        </div>
                        <div className="cockpit-stat__sub cockpit-stat__sub--warn">
                          Review needed
                        </div>
                      </div>
                      <div className="cockpit-stat">
                        <div className="cockpit-stat__label">Owed payout</div>
                        <div className="cockpit-stat__value">${owedPayout}</div>
                        <div className="cockpit-stat__sub">
                          Settles Mon 10:00
                        </div>
                      </div>
                      <div className="cockpit-stat">
                        <div className="cockpit-stat__label">
                          Auto-verify rate
                        </div>
                        <div className="cockpit-stat__value">
                          {autoVerifyRate}%
                        </div>
                        <div className="cockpit-stat__sub cockpit-stat__sub--pos">
                          Target &ge; 85%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="cockpit-section">
                    <div className="cockpit-section__head">
                      <h3 className="cockpit-section__title">Your QR codes</h3>
                      <a
                        href="/merchant/qr-codes"
                        className="cockpit-section__link"
                      >
                        Manage QRs →
                      </a>
                    </div>
                    <div className="qr-snap">
                      {MOCK_QR_SNAPS.map((q) => (
                        <div key={q.id} className="qr-snap__row">
                          <div className="qr-snap__chip">{q.code}</div>
                          <div className="qr-snap__info">
                            <div className="qr-snap__name">{q.label}</div>
                            <div className="qr-snap__meta">
                              Last scan {q.lastScan}
                            </div>
                          </div>
                          <div className="qr-snap__count">
                            {q.scans7d}
                            <small>7d scans</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT col: active campaigns + verified feed */}
                <div className="cockpit-col">
                  <div className="cockpit-section">
                    <div className="cockpit-section__head">
                      <h3 className="cockpit-section__title">
                        Active campaigns
                      </h3>
                      <a
                        href="/merchant/campaigns/new"
                        className="cockpit-section__link"
                      >
                        + New campaign
                      </a>
                    </div>

                    {MOCK_CAMPAIGNS.slice(0, 3).map((c) => (
                      <article key={c.id} className="mini-campaign">
                        <div className="mini-campaign__head">
                          <h4 className="mini-campaign__title">{c.title}</h4>
                          <span className="mini-campaign__goal">{c.goal}</span>
                        </div>
                        <span
                          className={`db-badge db-badge--${c.status}`}
                          style={{ alignSelf: "center" }}
                        >
                          {c.status === "active" ? "Live" : "Paused"}
                        </span>
                        <div className="mini-campaign__body">
                          <div className="mini-campaign__progress">
                            <span>Progress</span>
                            <strong>
                              {c.progressCurrent}/{c.progressTotal}
                            </strong>
                          </div>
                          <div className="mini-campaign__bar">
                            <div
                              className="mini-campaign__bar-fill"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (c.progressCurrent / c.progressTotal) * 100,
                                )}%`,
                              }}
                            />
                          </div>
                          <div className="mini-campaign__roi">
                            {c.roiProjection}
                          </div>
                        </div>
                        <div className="mini-campaign__actions">
                          <button className="mini-action" type="button">
                            Edit
                          </button>
                          <button
                            className="mini-action mini-action--danger"
                            type="button"
                          >
                            {c.status === "active" ? "Pause" : "Resume"}
                          </button>
                          <button className="mini-action" type="button">
                            Duplicate
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>

                  <VerifiedFeed rows={MOCK_VERIFIED} />
                </div>
              </div>
            </>
          )}

          {activeTab !== "cockpit" && (
            <div className="db-placeholder">
              <div
                className="db-placeholder__label"
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--primary,#c1121f)",
                }}
              >
                Coming soon
              </div>
              <div className="db-placeholder__oversize">
                {activeTab === "campaigns" && "Campaigns workspace"}
                {activeTab === "applications" && "Creator applications"}
                {activeTab === "analytics" && "ConversionOracle reports"}
              </div>
              <div className="db-placeholder__body">
                Keep using the cockpit for now — full drilldown lands in the
                next Push v5.1 wave.
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
