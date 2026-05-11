"use client";

/* ============================================================
   <Stage8VerifiedPanel> — content verified, payout in flight
   v3 · 2026-05-10 — two-column premium layout
   ============================================================ */

import { useState, useEffect } from "react";
import { Sparkles, Zap } from "lucide-react";
import type { StagePanelProps } from "../StageRouter";

function useCountdown(targetMs: number): string {
  const [str, setStr] = useState(() => {
    const diff = targetMs - Date.now();
    if (diff <= 0) return "00:00:00";
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1_000);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  });

  useEffect(() => {
    const t = setInterval(() => {
      const diff = targetMs - Date.now();
      if (diff <= 0) {
        setStr("00:00:00");
        return;
      }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setStr(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
      );
    }, 1_000);
    return () => clearInterval(t);
  }, [targetMs]);

  return str;
}

export function Stage8VerifiedPanel({
  application,
  campaign,
}: StagePanelProps) {
  const [instantMode, setInstantMode] = useState(false);

  const verifiedMs = application.verifiedAt
    ? new Date(application.verifiedAt).getTime()
    : Date.now() - 3_600_000; // demo: 1h ago

  const standardPayoutMs = verifiedMs + 72 * 3_600_000;
  const instantPayoutMs = verifiedMs + 2 * 3_600_000;

  const countdown = useCountdown(
    instantMode ? instantPayoutMs : standardPayoutMs,
  );

  const dollars = application.cashPay;
  const fee = instantMode ? Math.round(dollars * 0.015 * 100) / 100 : 0;
  const net = (dollars - fee).toFixed(2);
  const attributedScans = application.attributedScansCount ?? 7;
  const merchantFirst =
    campaign.merchantName.split(" ")[0] ?? campaign.merchantName;

  return (
    <div className="ad-panel-v3" aria-label="Payout processing">
      <div className="ad-layout">
        {/* ── LEFT COLUMN ──────────────────────────────────── */}
        <div className="ad-col-main">
          {/* Hero v3 */}
          <div className="ad-hero-v3">
            <div className="ad-hero-v3__eyebrow">
              <span className="ad-pill ad-pill--green">
                <span className="ad-pill__dot" />
                VERIFIED · TRANSFER INITIATED
              </span>
            </div>
            <div className="ad-hero-v3__stat ad-hero-v3__stat--green">
              ${dollars}
            </div>
            <h1 className="ad-hero-v3__title">Cleared to your account.</h1>
            <p className="ad-hero-v3__sub">
              Content approved by {merchantFirst}. Stripe Connect transfer
              initiated. Clears in ~{instantMode ? "2h" : "72h"}.
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
                Transfer in flight. Brand rebook rate is 79% — {merchantFirst}{" "}
                will likely re-invite you for their summer series. Your
                attributed scan count ({attributedScans} scans) is above average
                for a first collaboration.
              </p>
            </div>
          </div>

          {/* Transfer status card */}
          <div className="ad-card">
            <div className="ad-card__body">
              <span className="ad-card__label">TRANSFER STATUS</span>
              <div className="ad-payout-v3" style={{ marginTop: 16 }}>
                <div className="ad-payout-v3__amount">
                  <span className="ad-payout-v3__dollars">${net}</span>
                  <span className="ad-payout-v3__currency">USD</span>
                </div>
                <div className="ad-payout-v3__track">
                  <div className="ad-payout-v3__dot ad-payout-v3__dot--done" />
                  <div className="ad-payout-v3__line is-done" />
                  <div className="ad-payout-v3__dot ad-payout-v3__dot--active" />
                  <div className="ad-payout-v3__line" />
                  <div className="ad-payout-v3__dot ad-payout-v3__dot--pending" />
                </div>
                <div className="ad-payout-v3__labels">
                  <span className="ad-payout-v3__label-text">Verified</span>
                  <span className="ad-payout-v3__label-text">Transfer</span>
                  <span className="ad-payout-v3__label-text">Cleared</span>
                </div>
              </div>
              <div className="ad-card__divider" />
              <button
                type="button"
                className={`ad-instant-v3${instantMode ? " is-on" : ""}`}
                onClick={() => setInstantMode((v) => !v)}
                role="switch"
                aria-checked={instantMode}
                aria-label="Toggle instant transfer"
              >
                <span className="ad-instant-v3__icon" aria-hidden>
                  <Zap size={14} strokeWidth={2} />
                </span>
                <div className="ad-instant-v3__body">
                  <span className="ad-instant-v3__title">Instant transfer</span>
                  <span className="ad-instant-v3__sub">
                    1.5% fee · saves ~70h
                  </span>
                </div>
                <div className="ad-instant-v3__toggle">
                  <div className="ad-instant-v3__knob" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────── */}
        <div className="ad-col-side">
          {/* Arrival countdown card */}
          <div className="ad-card">
            <div className="ad-card__body">
              <span className="ad-card__label">ARRIVAL</span>
              <div className="ad-countdown-v3" style={{ marginTop: 16 }}>
                <span className="ad-countdown-v3__time">{countdown}</span>
                <span className="ad-countdown-v3__label">
                  ~{instantMode ? "2h · 1.5% fee" : "72h · free"}
                </span>
              </div>
              <div style={{ height: 16 }} />
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: "var(--ink-4)",
                  lineHeight: 1.5,
                }}
              >
                Or enable instant transfer above (1.5% fee)
              </p>
            </div>
          </div>

          {/* Stats card */}
          <div className="ad-card">
            <div className="ad-card__body">
              <div className="ad-stat-grid">
                <div className="ad-stat-grid__cell">
                  <span className="ad-stat-grid__value">${net}</span>
                  <span className="ad-stat-grid__label">Earned</span>
                </div>
                <div className="ad-stat-grid__cell">
                  <span className="ad-stat-grid__value">{attributedScans}</span>
                  <span className="ad-stat-grid__label">Attributed scans</span>
                </div>
                <div className="ad-stat-grid__cell">
                  <span className="ad-stat-grid__value">5.0</span>
                  <span className="ad-stat-grid__label">Merchant score</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
