"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import "./campaign-detail.css";

// ── Types ─────────────────────────────────────────────────────
type Status = "active" | "paused" | "completed" | "draft";
type CreatorStatus = "applied" | "accepted" | "posted" | "verified";
type Tier = "bronze" | "steel" | "gold";

type Creator = {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  tier: Tier;
  status: CreatorStatus;
  earnings: number;
};

type WeekBar = {
  week: string;
  verified: number;
  pending: number;
};

type ActivityEvent = {
  id: string;
  type: "verified" | "posted" | "applied" | "system";
  body: string;
  time: string;
};

type CampaignRecord = {
  id: string;
  name: string;
  goal?: string;
  status: Status;
  createdAt: string;
  target: number;
  days: number;
  budget: number;
  creatorBrief?: string;
  heroOffer?: string;
  sustainedOffer?: string;
  pitch?: string;
  // Stats (live or seeded)
  verified: number;
  pending: number;
  reach: number;
  spend: number;
  timeline: WeekBar[];
  creators: Creator[];
  activity: ActivityEvent[];
};

// ── Static demo data for any id not in localStorage ──────────
const DEMO_CAMPAIGN: CampaignRecord = {
  id: "demo",
  name: "Coffee+ — 20 in Williamsburg (Fill Seats)",
  goal: "fill-seats",
  status: "active",
  createdAt: "2026-04-10T14:22:00.000Z",
  target: 20,
  days: 14,
  budget: 660,
  pitch:
    "Drive walk-ins for a Coffee+ shop in Williamsburg. Target: 20 verified customers via 3-layer verification (QR + Claude Vision OCR + geo-match). ConversionOracle™ predicts walk-in conversion before creators post.",
  creatorBrief:
    "You're posting for a Williamsburg coffee shop building this week's seat-fill.\n\nShoot the actual product — steam curling off a pour, latte art close-up, pastry cross-section. Caption should feel like a friend sharing a find, not an ad. DisclosureBot auto-applies #ad for FTC compliance.\n\nTag @thebrand and drop the unique QR-linked promo. Hero Offer is for first 20 customers; sustained offer runs the rest of the window.",
  heroOffer:
    "Free 12oz drip for first 20 creators' audiences (redeem once per person)",
  sustainedOffer:
    "$3 off any drink + pastry combo for everyone scanning the QR during campaign window",
  verified: 14,
  pending: 3,
  reach: 48700,
  spend: 462,
  timeline: [
    { week: "W1", verified: 6, pending: 2 },
    { week: "W2", verified: 8, pending: 1 },
  ],
  creators: [
    {
      id: "c1",
      handle: "@maya.eats.nyc",
      name: "Maya Chen",
      avatar: "MC",
      tier: "steel",
      status: "verified",
      earnings: 125,
    },
    {
      id: "c2",
      handle: "@brooklyn_bites",
      name: "Bk Bites",
      avatar: "BB",
      tier: "steel",
      status: "verified",
      earnings: 100,
    },
    {
      id: "c3",
      handle: "@nyc.specialty",
      name: "Noa Park",
      avatar: "NP",
      tier: "gold",
      status: "posted",
      earnings: 75,
    },
    {
      id: "c4",
      handle: "@williamsburg.e",
      name: "Eli W.",
      avatar: "EW",
      tier: "bronze",
      status: "posted",
      earnings: 50,
    },
    {
      id: "c5",
      handle: "@coffee.nyc",
      name: "Jules A.",
      avatar: "JA",
      tier: "steel",
      status: "accepted",
      earnings: 0,
    },
    {
      id: "c6",
      handle: "@bushwick.daily",
      name: "Tomo K.",
      avatar: "TK",
      tier: "bronze",
      status: "applied",
      earnings: 0,
    },
  ],
  activity: [
    {
      id: "a1",
      type: "verified",
      body: "<strong>@maya.eats.nyc</strong> delivered customer #14 — verified by QR + Vision OCR + geo-match.",
      time: "2h ago",
    },
    {
      id: "a2",
      type: "posted",
      body: "<strong>@williamsburg.e</strong> published an Instagram Reel. DisclosureBot flagged #ad automatically.",
      time: "6h ago",
    },
    {
      id: "a3",
      type: "verified",
      body: "ConversionOracle™ verified 3 new walk-ins in the last hour. Auto-verify rate this campaign: 91%.",
      time: "Yesterday",
    },
    {
      id: "a4",
      type: "applied",
      body: "<strong>@coffee.nyc</strong> applied — Steel tier, 82% Neighborhood fit.",
      time: "Yesterday",
    },
    {
      id: "a5",
      type: "system",
      body: "Campaign launched. Two-Tier Offer active. QR codes deployed at counter.",
      time: "5d ago",
    },
  ],
};

// ── Helpers ───────────────────────────────────────────────────
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function tierLabel(t: Tier): string {
  if (t === "bronze") return "Explorer · Bronze";
  if (t === "steel") return "Operator · Steel";
  return "Proven · Gold";
}

// ── Timeline bar chart (inline SVG) ──────────────────────────
function TimelineChart({ data }: { data: WeekBar[] }) {
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartW = Math.max(560, data.length * 120);
  const chartH = 200;
  const innerW = chartW - padding.left - padding.right;
  const innerH = chartH - padding.top - padding.bottom;
  const max = Math.max(...data.map((d) => d.verified + d.pending), 10);
  const barW = Math.min(60, (innerW / data.length) * 0.55);
  const groupW = innerW / data.length;

  // y-axis gridlines (4 steps)
  const steps = 4;
  const stepVal = Math.ceil(max / steps);
  const yTicks = Array.from({ length: steps + 1 }, (_, i) => i * stepVal);

  return (
    <div className="cd-chart-wrap">
      <svg
        viewBox={`0 0 ${chartW} ${chartH}`}
        className="cd-chart"
        role="img"
        aria-label="Week-by-week campaign results"
      >
        {/* Grid lines */}
        {yTicks.map((t, i) => {
          const y = padding.top + innerH - (t / (stepVal * steps)) * innerH;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                x2={padding.left + innerW}
                y1={y}
                y2={y}
                stroke="rgba(0,48,73,0.08)"
                strokeWidth={1}
              />
              <text
                x={padding.left - 8}
                y={y + 3}
                textAnchor="end"
                fontSize="9"
                fontFamily="CS Genio Mono, monospace"
                fill="#669bbc"
                letterSpacing="0.05em"
              >
                {t}
              </text>
            </g>
          );
        })}
        {/* Axis line */}
        <line
          x1={padding.left}
          x2={padding.left + innerW}
          y1={padding.top + innerH}
          y2={padding.top + innerH}
          stroke="#003049"
          strokeWidth={1.5}
        />
        {/* Bars */}
        {data.map((d, i) => {
          const cx = padding.left + groupW * i + groupW / 2;
          const x = cx - barW / 2;
          const totalH =
            ((d.verified + d.pending) / (stepVal * steps)) * innerH;
          const verifiedH = (d.verified / (stepVal * steps)) * innerH;
          const pendingH = (d.pending / (stepVal * steps)) * innerH;
          const baseY = padding.top + innerH;
          return (
            <g key={d.week}>
              {/* Pending (stacked top) */}
              <rect
                x={x}
                y={baseY - totalH}
                width={barW}
                height={pendingH}
                fill="#c9a96e"
              />
              {/* Verified */}
              <rect
                x={x}
                y={baseY - verifiedH}
                width={barW}
                height={verifiedH}
                fill="#c1121f"
              />
              {/* Label above */}
              <text
                x={cx}
                y={baseY - totalH - 8}
                textAnchor="middle"
                fontSize="11"
                fontFamily="Darky, serif"
                fontStyle="italic"
                fontWeight="900"
                fill="#003049"
              >
                {d.verified + d.pending}
              </text>
              {/* X label */}
              <text
                x={cx}
                y={baseY + 18}
                textAnchor="middle"
                fontSize="10"
                fontFamily="CS Genio Mono, monospace"
                fill="#669bbc"
                letterSpacing="0.08em"
              >
                {d.week}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<CampaignRecord | null>(null);
  const [filter, setFilter] = useState<CreatorStatus | "all">("all");
  const [actionState, setActionState] = useState<
    "idle" | "paused" | "resumed" | "duplicated" | "archived"
  >("idle");

  useEffect(() => {
    // Attempt to read from the v5.1 key; fall back to legacy; else demo.
    try {
      const raw =
        localStorage.getItem("push-demo-campaigns-v51") ||
        localStorage.getItem("push-demo-campaigns");
      if (raw) {
        const list: Array<Partial<CampaignRecord> & { id: string }> =
          JSON.parse(raw);
        const found = list.find((c) => c.id === id);
        if (found) {
          // Hydrate with seeded stats when live data absent.
          const merged: CampaignRecord = {
            ...DEMO_CAMPAIGN,
            ...found,
            // Keep status from storage when present
            status: (found.status as Status) || DEMO_CAMPAIGN.status,
            // Use campaign name (from wizard) if present
            name: (found as CampaignRecord).name || DEMO_CAMPAIGN.name,
            id: found.id,
          };
          setCampaign(merged);
          return;
        }
      }
    } catch {
      // Fall through to demo.
    }
    setCampaign({ ...DEMO_CAMPAIGN, id: id || DEMO_CAMPAIGN.id });
  }, [id]);

  const filteredCreators = useMemo(() => {
    if (!campaign) return [];
    if (filter === "all") return campaign.creators;
    return campaign.creators.filter((c) => c.status === filter);
  }, [campaign, filter]);

  if (!campaign) {
    return (
      <div className="cd-page">
        <div className="cd-inner">
          <p className="cd-loading">Loading campaign…</p>
        </div>
      </div>
    );
  }

  const currentStatus: Status =
    actionState === "paused"
      ? "paused"
      : actionState === "resumed"
        ? "active"
        : actionState === "archived"
          ? "completed"
          : campaign.status;

  function handleAction(a: "pause" | "resume" | "duplicate" | "archive") {
    if (a === "pause") setActionState("paused");
    if (a === "resume") setActionState("resumed");
    if (a === "duplicate") setActionState("duplicated");
    if (a === "archive") setActionState("archived");
    // Clear visual state after a tick so it doesn't stick
    setTimeout(() => {
      if (a === "duplicate") setActionState("idle");
    }, 1800);
  }

  const filterOptions: Array<{
    id: CreatorStatus | "all";
    label: string;
    count: number;
  }> = [
    { id: "all", label: "All", count: campaign.creators.length },
    {
      id: "applied",
      label: "Applied",
      count: campaign.creators.filter((c) => c.status === "applied").length,
    },
    {
      id: "accepted",
      label: "Accepted",
      count: campaign.creators.filter((c) => c.status === "accepted").length,
    },
    {
      id: "posted",
      label: "Posted",
      count: campaign.creators.filter((c) => c.status === "posted").length,
    },
    {
      id: "verified",
      label: "Verified",
      count: campaign.creators.filter((c) => c.status === "verified").length,
    },
  ];

  return (
    <div className="cd-page">
      <div className="cd-inner">
        <Link href="/merchant/dashboard" className="cd-back">
          ← Back to dashboard
        </Link>

        {/* ── Header ──────────────────────────────── */}
        <header className="cd-header">
          <div className="cd-header-left">
            <div className="cd-header-meta-row">
              <span
                className={`cd-pill cd-pill--${currentStatus}`}
                aria-label={`Status: ${currentStatus}`}
              >
                <span className="cd-pill-dot" aria-hidden="true" />
                {capitalize(currentStatus)}
              </span>
              <span className="cd-id-chip" aria-label="Campaign ID">
                ID · {campaign.id}
              </span>
              <span className="cd-created">
                Created {formatDate(campaign.createdAt)}
              </span>
            </div>
            <h1 className="cd-title">{campaign.name}</h1>
            <p className="cd-subtitle">
              Customer Acquisition Engine · Vertical AI for Local Commerce ·
              ConversionOracle™ active
            </p>
          </div>

          <div className="cd-actions" aria-label="Campaign actions">
            <button type="button" className="cd-action-btn">
              Edit
            </button>
            {currentStatus === "active" ? (
              <button
                type="button"
                className="cd-action-btn"
                onClick={() => handleAction("pause")}
              >
                Pause
              </button>
            ) : currentStatus === "paused" ? (
              <button
                type="button"
                className="cd-action-btn cd-action-btn--primary"
                onClick={() => handleAction("resume")}
              >
                Resume
              </button>
            ) : null}
            <button
              type="button"
              className="cd-action-btn"
              onClick={() => handleAction("duplicate")}
            >
              {actionState === "duplicated" ? "Duplicated ✓" : "Duplicate"}
            </button>
            <button
              type="button"
              className="cd-action-btn cd-action-btn--danger"
              onClick={() => handleAction("archive")}
            >
              Archive
            </button>
          </div>
        </header>

        {/* ── 4-column stats ──────────────────────── */}
        <div className="cd-stats" aria-label="Campaign performance">
          <div className="cd-stat">
            <span className="cd-stat-label">Verified</span>
            <span className="cd-stat-num cd-stat-num--verified">
              {campaign.verified}
              <span className="cd-stat-unit">/ {campaign.target}</span>
            </span>
            <span className="cd-stat-sub">
              3-layer verified (QR + OCR + geo)
            </span>
          </div>
          <div className="cd-stat">
            <span className="cd-stat-label">Pending</span>
            <span className="cd-stat-num">{campaign.pending}</span>
            <span className="cd-stat-sub">Awaiting verification stack</span>
          </div>
          <div className="cd-stat">
            <span className="cd-stat-label">Reach</span>
            <span className="cd-stat-num">
              {campaign.reach >= 1000
                ? `${(campaign.reach / 1000).toFixed(1)}k`
                : campaign.reach}
            </span>
            <span className="cd-stat-sub">Impressions across creators</span>
          </div>
          <div className="cd-stat">
            <span className="cd-stat-label">Spend</span>
            <span className="cd-stat-num">
              ${campaign.spend.toLocaleString()}
              <span className="cd-stat-unit">
                / ${campaign.budget.toLocaleString()}
              </span>
            </span>
            <span className="cd-stat-sub">Pay-per-verified + retention</span>
          </div>
        </div>

        {/* ── Timeline chart ─────────────────────── */}
        <section className="cd-panel" aria-labelledby="cd-timeline-h">
          <div className="cd-panel-head">
            <div>
              <h2 id="cd-timeline-h" className="cd-panel-heading">
                Weekly results
              </h2>
              <p className="cd-panel-sub">
                Verified customers delivered per week, tracked by
                ConversionOracle™.
              </p>
            </div>
            <div className="cd-chart-legend">
              <span className="cd-legend-item">
                <span className="cd-legend-swatch cd-legend-swatch--verified" />
                Verified
              </span>
              <span className="cd-legend-item">
                <span className="cd-legend-swatch cd-legend-swatch--pending" />
                Pending
              </span>
            </div>
          </div>
          <TimelineChart data={campaign.timeline} />
        </section>

        {/* ── Creator table ──────────────────────── */}
        <section className="cd-panel" aria-labelledby="cd-creators-h">
          <div className="cd-panel-head">
            <div>
              <h2 id="cd-creators-h" className="cd-panel-heading">
                Creators
              </h2>
              <p className="cd-panel-sub">
                Two-Segment Creator Economics. Tiers assigned by Neighborhood
                Playbook fit.
              </p>
            </div>
            <div
              className="cd-filter-bar"
              role="tablist"
              aria-label="Filter creators"
            >
              {filterOptions.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === f.id}
                  className={[
                    "cd-filter-btn",
                    filter === f.id ? "cd-filter-btn--active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label} · {f.count}
                </button>
              ))}
            </div>
          </div>

          <div className="cd-table-wrap">
            <table className="cd-table">
              <thead>
                <tr>
                  <th>Creator</th>
                  <th>Tier</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Earnings</th>
                </tr>
              </thead>
              <tbody>
                {filteredCreators.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="cd-empty">
                      No creators match this filter.
                    </td>
                  </tr>
                ) : (
                  filteredCreators.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div className="cd-creator-cell">
                          <span className="cd-avatar" aria-hidden="true">
                            {c.avatar}
                          </span>
                          <div>
                            <div className="cd-handle">{c.handle}</div>
                            <div
                              style={{
                                fontSize: "0.6875rem",
                                color: "#669bbc",
                                letterSpacing: "0.02em",
                              }}
                            >
                              {c.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`cd-tier-badge cd-tier-${c.tier}`}>
                          {tierLabel(c.tier)}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`cd-status-cell cd-status--${c.status}`}
                        >
                          {capitalize(c.status)}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span className="cd-earnings">
                          ${c.earnings.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Brief & offers ─────────────────────── */}
        <section className="cd-panel" aria-labelledby="cd-brief-h">
          <div className="cd-panel-head">
            <div>
              <h2 id="cd-brief-h" className="cd-panel-heading">
                Brief & Two-Tier Offer
              </h2>
              <p className="cd-panel-sub">
                Drafted by ConversionOracle™ · DisclosureBot ensures FTC
                compliance.
              </p>
            </div>
          </div>
          {campaign.creatorBrief && (
            <p className="cd-brief">{campaign.creatorBrief}</p>
          )}
          {(campaign.heroOffer || campaign.sustainedOffer) && (
            <div className="cd-offer-row">
              {campaign.heroOffer && (
                <div className="cd-offer-box">
                  <div className="cd-offer-box-tag">
                    <span className="cd-offer-box-dot" />
                    Hero Offer · Limited
                  </div>
                  <div className="cd-offer-box-body">{campaign.heroOffer}</div>
                </div>
              )}
              {campaign.sustainedOffer && (
                <div className="cd-offer-box cd-offer-box--sustained">
                  <div className="cd-offer-box-tag">
                    <span className="cd-offer-box-dot" />
                    Sustained Offer · Ongoing
                  </div>
                  <div className="cd-offer-box-body">
                    {campaign.sustainedOffer}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── Activity feed ──────────────────────── */}
        <section className="cd-panel" aria-labelledby="cd-activity-h">
          <div className="cd-panel-head">
            <div>
              <h2 id="cd-activity-h" className="cd-panel-heading">
                Recent activity
              </h2>
              <p className="cd-panel-sub">
                Latest verifications, posts, and system events.
              </p>
            </div>
          </div>
          <div className="cd-feed">
            {campaign.activity.map((ev) => (
              <div key={ev.id} className="cd-feed-item">
                <span
                  className={[
                    "cd-feed-dot",
                    ev.type === "applied" || ev.type === "posted"
                      ? "cd-feed-dot--secondary"
                      : ev.type === "system"
                        ? "cd-feed-dot--muted"
                        : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-hidden="true"
                />
                <div className="cd-feed-body">
                  <span dangerouslySetInnerHTML={{ __html: ev.body }} />
                  <span className="cd-feed-time">{ev.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
