"use client";

/* ============================================================
   <Stage9PaidPanel> — terminal, paid + apply-next loop
   v3 · 2026-05-10 — two-column premium layout
   ============================================================ */

import { useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles, Star } from "lucide-react";
import type { StagePanelProps } from "../StageRouter";
import { useLiveCampaigns } from "@/lib/data/live-campaigns";

export function Stage9PaidPanel({ application, campaign }: StagePanelProps) {
  const merchantFirst =
    campaign.merchantName.split(" ")[0] ?? campaign.merchantName;
  const allCampaigns = useLiveCampaigns();
  const neighborhood =
    campaign.neighborhood.split(",")[0]?.trim() ?? campaign.neighborhood;

  const similarOpen = useMemo(
    () =>
      allCampaigns.filter(
        (c) => c.id !== campaign.id && c.neighborhood === campaign.neighborhood,
      ).length,
    [allCampaigns, campaign.id, campaign.neighborhood],
  );

  const amountUsd =
    (application.payoutCents ?? application.cashPay * 100) / 100;
  const txnId = application.transactionId ?? `txn_${application.id.slice(-8)}`;
  const formattedDate = application.paidAt
    ? new Date(application.paidAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";
  const scans = application.attributedScansCount ?? 0;

  const [rated, setRated] = useState<number | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  return (
    <div className="ad-panel-v3" aria-label="Paid out">
      <div className="ad-layout">
        {/* ── LEFT COLUMN ──────────────────────────────────── */}
        <div className="ad-col-main">
          {/* Hero v3 */}
          <div className="ad-hero-v3">
            <div className="ad-hero-v3__eyebrow">
              <span className="ad-pill ad-pill--champagne">
                <span className="ad-pill__dot" />
                PAID · {formattedDate}
              </span>
            </div>
            <div className="ad-hero-v3__stat ad-hero-v3__stat--champagne">
              ${amountUsd.toFixed(0)}
            </div>
            <h1 className="ad-hero-v3__title">Gig complete.</h1>
            <p className="ad-hero-v3__sub">
              Cleared to your account on {formattedDate}. Transaction ID:{" "}
              <code
                style={{
                  fontFamily: "ui-monospace, 'SF Mono', monospace",
                  fontSize: 13,
                  background: "var(--surface-3)",
                  padding: "1px 6px",
                  borderRadius: 4,
                }}
              >
                {txnId}
              </code>
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
                Nice work.{" "}
                {similarOpen > 0
                  ? `${similarOpen} similar campaigns are open right now in ${neighborhood}.`
                  : `More campaigns are coming to ${neighborhood} — you'll be first to see them.`}{" "}
                Your attributed scan total ({scans} visits) is strong for this
                tier.
              </p>
            </div>
          </div>

          {/* Receipt card */}
          <div className="ad-card">
            <div className="ad-card__body">
              <span className="ad-card__label">TRANSACTION RECEIPT</span>
              <div className="ad-receipt-v3" style={{ marginTop: 12 }}>
                <div className="ad-receipt-v3__row">
                  <span className="ad-receipt-v3__key">Campaign</span>
                  <span className="ad-receipt-v3__val">{campaign.title}</span>
                </div>
                <div className="ad-receipt-v3__row">
                  <span className="ad-receipt-v3__key">Merchant</span>
                  <span className="ad-receipt-v3__val">{merchantFirst}</span>
                </div>
                <div className="ad-receipt-v3__row">
                  <span className="ad-receipt-v3__key">Amount</span>
                  <span className="ad-receipt-v3__val">
                    ${amountUsd.toFixed(2)} USD
                  </span>
                </div>
                <div className="ad-receipt-v3__row">
                  <span className="ad-receipt-v3__key">Scans</span>
                  <span className="ad-receipt-v3__val">{scans} attributed</span>
                </div>
                <div className="ad-receipt-v3__row">
                  <span className="ad-receipt-v3__key">Status</span>
                  <span className="ad-receipt-v3__val">
                    Paid{" "}
                    <span
                      style={{
                        display: "inline-block",
                        marginLeft: 6,
                        padding: "1px 8px",
                        borderRadius: 4,
                        background: "rgba(52,199,89,0.12)",
                        color: "#1a7a3a",
                        fontFamily: "var(--font-display)",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      Paid
                    </span>
                  </span>
                </div>
                <div className="ad-receipt-v3__row">
                  <span className="ad-receipt-v3__key">TxnID</span>
                  <span className="ad-receipt-v3__val">
                    <span className="ad-receipt-v3__code">{txnId}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────── */}
        <div className="ad-col-side">
          {/* Apply next CTA */}
          <Link
            href="/creator/discover"
            className="ad-btn ad-btn--ink"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 2,
              padding: "14px 16px",
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
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              <Sparkles size={16} strokeWidth={2} />
              Apply to next gig
            </span>
            <span
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.7)",
                fontFamily: "var(--font-body)",
              }}
            >
              {similarOpen > 0
                ? `${similarOpen} similar in ${neighborhood} right now`
                : "Browse open campaigns near you"}
            </span>
          </Link>

          {/* Rating card */}
          <div className="ad-card">
            <div className="ad-card__body">
              <span className="ad-card__label">RATE YOUR EXPERIENCE</span>
              <p
                style={{
                  margin: "10px 0 12px",
                  fontSize: 13,
                  color: "var(--ink-3)",
                  lineHeight: 1.5,
                }}
              >
                How was working with {merchantFirst}?
              </p>
              <div
                className="ad-rating-v3"
                aria-label={`Rate ${campaign.merchantName}`}
              >
                <div className="ad-rating-v3__stars">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`ad-rating-v3__star${rated !== null && n <= rated ? " is-active" : ""}`}
                      onClick={() => setRated(n)}
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    >
                      <Star
                        size={24}
                        strokeWidth={1.5}
                        fill={
                          rated !== null && n <= rated ? "currentColor" : "none"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
              {rated !== null && (
                <p
                  style={{
                    margin: "10px 0 0",
                    fontSize: 12,
                    color: "var(--ink-4)",
                  }}
                >
                  Thanks for the feedback!
                </p>
              )}
            </div>
          </div>

          {/* Stats card */}
          <div className="ad-card">
            <div className="ad-card__body">
              <div className="ad-stat-grid">
                <div className="ad-stat-grid__cell">
                  <span className="ad-stat-grid__value">
                    ${amountUsd.toFixed(0)}
                  </span>
                  <span className="ad-stat-grid__label">Earned</span>
                </div>
                <div className="ad-stat-grid__cell">
                  <span className="ad-stat-grid__value">{scans}</span>
                  <span className="ad-stat-grid__label">Verified visits</span>
                </div>
                <div className="ad-stat-grid__cell">
                  <span className="ad-stat-grid__value">All</span>
                  <span className="ad-stat-grid__label">
                    Deliverables approved
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
