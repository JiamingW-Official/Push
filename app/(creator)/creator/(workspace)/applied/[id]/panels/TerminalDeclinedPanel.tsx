"use client";

/* ============================================================
   <TerminalDeclinedPanel> — declined or withdrawn (terminal)
   v3 · 2026-05-10 — two-column premium layout
   ============================================================ */

import Link from "next/link";
import {
  Sparkles,
  Compass,
  TrendingUp,
  Clock,
  MapPin,
  Image,
} from "lucide-react";
import type { StagePanelProps } from "../StageRouter";

export function TerminalDeclinedPanel({
  application,
  campaign,
}: StagePanelProps) {
  const merchantFirst =
    campaign.merchantName.split(" ")[0] ?? campaign.merchantName;
  const isWithdrawn = application.status === "withdrawn";
  const neighborhood =
    campaign.neighborhood.split(",")[0] ?? campaign.neighborhood;

  return (
    <div className="ad-panel-v3" aria-label="Application closed">
      <div className="ad-layout">
        {/* ── LEFT COLUMN ──────────────────────────────────── */}
        <div className="ad-col-main">
          {/* Hero v3 */}
          <div className="ad-hero-v3">
            <div className="ad-hero-v3__eyebrow">
              <span className="ad-pill ad-pill--gray">
                <span className="ad-pill__dot" />
                {isWithdrawn ? "WITHDRAWN" : "DECLINED"}
              </span>
            </div>
            <div className="ad-hero-v3__stat ad-hero-v3__stat--muted">
              {isWithdrawn ? "Done" : "Pass"}
            </div>
            <h1 className="ad-hero-v3__title">
              {isWithdrawn
                ? "You released this slot"
                : `${merchantFirst} went another way`}
            </h1>
            <p className="ad-hero-v3__sub">
              {isWithdrawn
                ? "Slot is back in the pool and open to others."
                : "Common — pace and fit don't always click. Doesn't touch your tier."}
            </p>
          </div>

          {/* Agent v3 */}
          <div className="ad-agent-v3">
            <div className="ad-agent-v3__head">
              <span className="ad-agent-v3__icon" aria-hidden>
                <Sparkles size={13} strokeWidth={2.25} />
              </span>
              <span className="ad-agent-v3__label">Agent</span>
            </div>
            <div className="ad-agent-v3__body">
              <p className="ad-agent-v3__prose">
                {isWithdrawn
                  ? `Slot released cleanly. I'll surface similar campaigns in ${neighborhood} as soon as they open. Your application score stays intact.`
                  : `Doesn't dent your standing — merchants often go with whoever applied first. I already found 4 open gigs in ${neighborhood} this week. Keep the velocity.`}
              </p>
            </div>
          </div>

          {/* What's next card */}
          <div className="ad-card">
            <div className="ad-card__body">
              <span className="ad-card__label">WHAT&apos;S NEXT</span>
              <div className="ad-tile-grid" style={{ marginTop: 12 }}>
                <div className="ad-tile">
                  <span className="ad-tile__icon-wrap" aria-hidden>
                    <TrendingUp size={18} strokeWidth={1.75} />
                  </span>
                  <span className="ad-tile__label">YOUR TIER</span>
                  <span className="ad-tile__value">Unchanged</span>
                </div>
                <div className="ad-tile">
                  <span className="ad-tile__icon-wrap" aria-hidden>
                    <MapPin size={18} strokeWidth={1.75} />
                  </span>
                  <span className="ad-tile__label">AREA</span>
                  <span className="ad-tile__value">{neighborhood}</span>
                  <span className="ad-tile__sub">4 open gigs nearby</span>
                </div>
                <div className="ad-tile">
                  <span className="ad-tile__icon-wrap" aria-hidden>
                    <Clock size={18} strokeWidth={1.75} />
                  </span>
                  <span className="ad-tile__label">STATUS</span>
                  <span className="ad-tile__value">Closed just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────── */}
        <div className="ad-col-side">
          {/* Campaign card */}
          <div className="ad-campaign-card">
            {campaign.images[0] ? (
              <img
                src={campaign.images[0]}
                className="ad-campaign-card__thumb"
                alt=""
              />
            ) : (
              <div className="ad-campaign-card__thumb-empty">
                <Image size={32} strokeWidth={1.5} />
              </div>
            )}
            <div className="ad-campaign-card__body">
              <p className="ad-campaign-card__name">{campaign.title}</p>
              <p className="ad-campaign-card__merchant">
                {campaign.merchantName}
              </p>
              <div className="ad-campaign-card__stats">
                <div className="ad-campaign-card__stat">
                  <span className="ad-campaign-card__stat-value">
                    ${campaign.cashPay}
                  </span>
                  <span className="ad-campaign-card__stat-label">
                    {campaign.payUnit}
                  </span>
                </div>
                <div className="ad-campaign-card__stat">
                  <span className="ad-campaign-card__stat-value">
                    {isWithdrawn ? "Withdrawn" : "Declined"}
                  </span>
                  <span className="ad-campaign-card__stat-label">status</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions card */}
          <div className="ad-card">
            <div className="ad-card__body">
              <span className="ad-card__label">ACTIONS</span>
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <Link
                  href="/creator/discover"
                  className="ad-btn ad-btn--blue"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 2,
                    padding: "12px 14px",
                    textDecoration: "none",
                    borderRadius: 8,
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: "var(--font-display)",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    <Compass size={14} strokeWidth={2} />
                    Find your next gig
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.72)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    Push AI found 4 matches in {neighborhood}
                  </span>
                </Link>
                <div style={{ height: 8 }} />
                <Link
                  href="/creator/work/applied"
                  className="ad-btn ad-btn--ghost"
                  style={{ textDecoration: "none", textAlign: "center" }}
                >
                  View all applications
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
