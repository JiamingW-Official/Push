"use client";

/* ============================================================
   <Stage1ReviewingPanel> — applied, awaiting merchant decision
   v3 · 2026-05-10 — two-column premium layout
   ============================================================ */

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Wallet,
  Sparkles,
  Compass,
  ShieldAlert,
  Image as ImageIcon,
} from "lucide-react";
import { withdrawApplication } from "@/lib/data/live-applications";
import type { StagePanelProps } from "../StageRouter";

export function Stage1ReviewingPanel({
  application,
  campaign,
}: StagePanelProps) {
  const [confirmingWithdraw, setConfirmingWithdraw] = useState(false);
  const merchantHours = campaign.merchant?.avgResponseHours ?? 24;
  const slot = application.slotIso ? parseSlotIso(application.slotIso) : null;
  const eta = computeReplyEta(merchantHours, application.id);
  const merchantFirst =
    campaign.merchantName.split(" ")[0] ?? campaign.merchantName;

  const thumb = campaign.images?.[0];

  return (
    <section className="ad-panel-v3" aria-label="Application reviewing">
      <div className="ad-layout">
        {/* ── LEFT COLUMN ─────────────────────────────────────── */}
        <div className="ad-col-main">
          {/* Hero v3 */}
          <div className="ad-hero-v3">
            <div className="ad-hero-v3__eyebrow">
              <span className="ad-pill ad-pill--amber">
                <span className="ad-pill__dot" aria-hidden />
                REVIEWING · {campaign.merchantName}
              </span>
            </div>
            <div className="ad-hero-v3__stat ad-hero-v3__stat--amber">
              ~{merchantHours}h
            </div>
            <h1 className="ad-hero-v3__title">Waiting on {merchantFirst}</h1>
            <p className="ad-hero-v3__sub">
              Latest reply by <strong>{eta}</strong>
            </p>
          </div>

          {/* Agent v3 */}
          <div className="ad-agent-v3">
            <div className="ad-agent-v3__head">
              <span className="ad-agent-v3__icon" aria-hidden>
                <Sparkles size={13} strokeWidth={2.25} />
              </span>
              <span className="ad-agent-v3__label">Agent</span>
              <span className="ad-agent-v3__timestamp">just now</span>
            </div>
            <div className="ad-agent-v3__body">
              <p className="ad-agent-v3__prose">
                I&apos;ll ping you the moment {merchantFirst} decides. Your
                angle stood out — most applicants skip the note. While you wait,
                keep applying: 3 similar campaigns opened this week in{" "}
                {campaign.neighborhood}.
              </p>
            </div>
          </div>

          {/* Application details — tile grid */}
          <div className="ad-card">
            <div className="ad-card__body">
              <span className="ad-card__label">APPLICATION DETAILS</span>
              <div className="ad-tile-grid ad-tile-grid--2col">
                <div className="ad-tile">
                  <span className="ad-tile__icon-wrap" aria-hidden>
                    <Clock size={18} strokeWidth={1.75} />
                  </span>
                  <span className="ad-tile__label">Slot</span>
                  <span className="ad-tile__value">
                    {slot ? slot.date : "TBD"}
                  </span>
                </div>
                <div className="ad-tile">
                  <span className="ad-tile__icon-wrap" aria-hidden>
                    <Wallet size={18} strokeWidth={1.75} />
                  </span>
                  <span className="ad-tile__label">Your Pay</span>
                  <span className="ad-tile__value">${campaign.cashPay}</span>
                  <span className="ad-tile__sub">{campaign.payUnit}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────────── */}
        <div className="ad-col-side">
          {/* Campaign card */}
          <div className="ad-campaign-card">
            {thumb ? (
              <img
                src={thumb}
                alt={campaign.title}
                className="ad-campaign-card__thumb"
              />
            ) : (
              <div className="ad-campaign-card__thumb-empty" aria-hidden>
                <ImageIcon size={24} strokeWidth={1.5} />
              </div>
            )}
            <div className="ad-campaign-card__body">
              <span className="ad-campaign-card__name">{campaign.title}</span>
              <span className="ad-campaign-card__merchant">
                {campaign.merchantName}
              </span>
              <div className="ad-campaign-card__stats">
                <div className="ad-campaign-card__stat">
                  <span className="ad-campaign-card__stat-label">Pay</span>
                  <span className="ad-campaign-card__stat-value">
                    ${campaign.cashPay} / {campaign.payUnit}
                  </span>
                </div>
                <div className="ad-campaign-card__stat">
                  <span className="ad-campaign-card__stat-label">Slot</span>
                  <span className="ad-campaign-card__stat-value">
                    {slot ? slot.date : "TBD"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions card */}
          <div className="ad-card">
            <div className="ad-card__body">
              <span className="ad-card__label">QUICK ACTIONS</span>
              <div className="ad-card__divider" aria-hidden />

              <Link
                href="/creator/discover"
                className="ad-btn ad-btn--blue"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  textDecoration: "none",
                  marginBottom: 16,
                }}
              >
                <Compass size={16} strokeWidth={2} />
                Find another gig
              </Link>
              {/* Withdraw confirmation */}
              {!confirmingWithdraw ? (
                <button
                  type="button"
                  className="ad-btn ad-btn--ghost"
                  style={{ width: "100%" }}
                  onClick={() => setConfirmingWithdraw(true)}
                >
                  Withdraw application
                </button>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <button
                    type="button"
                    className="ad-btn ad-btn--danger"
                    style={{ width: "100%" }}
                    onClick={() => withdrawApplication(application.id)}
                    title="Confirm: this will release your slot"
                  >
                    <ShieldAlert size={14} strokeWidth={2.25} />
                    Confirm withdraw
                  </button>
                  <button
                    type="button"
                    className="ad-btn ad-btn--ghost ad-btn--sm"
                    style={{ width: "100%" }}
                    onClick={() => setConfirmingWithdraw(false)}
                  >
                    Keep application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function parseSlotIso(iso: string): { date: string; time: string } | null {
  if (!iso) return null;
  const [datePart, timePart] = iso.split("T");
  if (!datePart) return null;
  const d = new Date(datePart + "T00:00");
  const dateStr = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const time = (timePart ?? "").slice(0, 5) || "—";
  return { date: dateStr, time };
}

function computeReplyEta(avgHours: number, anchorId: string): string {
  const m = anchorId.match(/-(\d+)$/);
  const appliedAt = m && m[1] ? Number(m[1]) : Date.now();
  const upperBound = Math.round(avgHours * 1.5);
  const eta = new Date(appliedAt + upperBound * 60 * 60 * 1000);
  const now = new Date();
  const sameDay = eta.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow = eta.toDateString() === tomorrow.toDateString();
  const time = eta
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: eta.getMinutes() === 0 ? undefined : "2-digit",
    })
    .toLowerCase();
  if (sameDay) return `Today ${time}`;
  if (isTomorrow) return `Tomorrow ${time}`;
  return `${eta.toLocaleDateString("en-US", { weekday: "short" })} ${time}`;
}
