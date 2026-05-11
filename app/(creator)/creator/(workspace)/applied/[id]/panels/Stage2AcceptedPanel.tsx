"use client";

/* ============================================================
   <Stage2AcceptedPanel> — merchant accepted, pre-shoot prep
   v3 · 2026-05-10 — two-column premium layout
   ============================================================ */

import { useEffect, useState } from "react";
import {
  Navigation,
  MapPin,
  CalendarDays,
  Clock,
  MessageCircle,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";
import type { StagePanelProps } from "../StageRouter";

/* Hardcoded brief for demo — production pulls from campaign.deliverables */
const SHOTS = [
  {
    num: "01",
    label: "Wide establishing shot",
    tag: "Exterior",
    note: "Natural light · storefront + neighbourhood in frame",
  },
  {
    num: "02",
    label: "Product hero close-up",
    tag: "Product",
    note: "Fill-flash ok · avoid shadows on product surface",
  },
  {
    num: "03",
    label: "Candid lifestyle moment",
    tag: "Lifestyle",
    note: "You or staff — feels real, not staged",
  },
] as const;

function formatSlot(slotIso: string): { date: string; time: string } {
  const d = new Date(`${slotIso}:00`);
  return {
    date: d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

function useCountdownLabel(slotIso?: string): string {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!slotIso) return;
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, [slotIso]);

  if (!slotIso) return "";
  const ms = Date.parse(`${slotIso}:00`);
  if (!Number.isFinite(ms)) return "";
  const diff = Math.max(0, ms - now);
  if (diff === 0) return "now";
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  if (days > 0) return `${days}d ${hours}h away`;
  if (hours > 0) return `${hours}h away`;
  const m = Math.floor((diff % 3_600_000) / 60_000);
  return `${m}m away`;
}

export function Stage2AcceptedPanel({
  application,
  campaign,
}: StagePanelProps) {
  const merchantFirst =
    campaign.merchantName.split(" ")[0] ?? campaign.merchantName;
  const countdown = useCountdownLabel(application.slotIso);
  const slot = application.slotIso ? formatSlot(application.slotIso) : null;
  const mapsUrl = `https://maps.apple.com/?q=${encodeURIComponent(campaign.neighborhood)}`;

  const thumb = campaign.images?.[0];

  return (
    <section className="ad-panel-v3" aria-label="Application accepted">
      <div className="ad-layout">
        {/* ── LEFT COLUMN ─────────────────────────────────────── */}
        <div className="ad-col-main">
          {/* Hero v3 */}
          <div className="ad-hero-v3">
            <div className="ad-hero-v3__eyebrow">
              <span className="ad-pill ad-pill--green">
                <span className="ad-pill__dot" aria-hidden />
                ACCEPTED · {merchantFirst}
              </span>
            </div>
            <div className="ad-hero-v3__stat ad-hero-v3__stat--green">
              ${campaign.cashPay}
            </div>
            <h1 className="ad-hero-v3__title">You&apos;re in.</h1>
            <p className="ad-hero-v3__sub">
              {slot
                ? `${slot.date} at ${slot.time}${countdown ? ` · ${countdown}` : ""}`
                : `Slot to be confirmed by ${merchantFirst}`}
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
                Forma has a 97% rebook rate — they value reliability. Charge
                your phone in transit. Get there 10 min early to scout the wide
                shot angle from across the street before going inside. QR
                check-in unlocks your slot.
              </p>
            </div>
          </div>

          {/* Shot brief card */}
          <div className="ad-card">
            <div className="ad-card__body">
              <span className="ad-card__label">SHOT BRIEF</span>
              <div className="ad-card__divider" aria-hidden />
              <ol className="ad-shots-v3" role="list">
                {SHOTS.map((shot) => (
                  <li key={shot.num} className="ad-shots-v3__item">
                    <span className="ad-shots-v3__num">{shot.num}</span>
                    <div className="ad-shots-v3__body">
                      <span className="ad-shots-v3__label">{shot.label}</span>
                      <span className="ad-shots-v3__note">{shot.note}</span>
                    </div>
                    <span className="ad-shots-v3__tag">{shot.tag}</span>
                  </li>
                ))}
              </ol>
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
              <span className="ad-card__label">ACTIONS</span>
              <div className="ad-card__divider" aria-hidden />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ad-btn ad-btn--primary"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    textDecoration: "none",
                  }}
                >
                  <Navigation size={16} strokeWidth={2} />
                  Get directions · {campaign.neighborhood}
                </a>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--ink-4, #9a9792)",
                    margin: 0,
                  }}
                >
                  Opens Apple Maps
                </p>
                <button
                  type="button"
                  className="ad-btn ad-btn--ghost"
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                  onClick={() => {
                    /* production: open in-app thread */
                  }}
                >
                  <MessageCircle size={16} strokeWidth={2} />
                  Message {merchantFirst}
                </button>
              </div>
            </div>
          </div>

          {/* Booking details card */}
          <div className="ad-card">
            <div className="ad-card__body">
              <span className="ad-card__label">BOOKING DETAILS</span>
              <div className="ad-card__divider" aria-hidden />
              <div className="ad-tile-grid ad-tile-grid--2col">
                <div className="ad-tile">
                  <span className="ad-tile__icon-wrap" aria-hidden>
                    <CalendarDays size={18} strokeWidth={1.75} />
                  </span>
                  <span className="ad-tile__label">SHOOT DATE</span>
                  <span className="ad-tile__value">
                    {slot ? slot.date : "TBD"}
                  </span>
                </div>
                <div className="ad-tile">
                  <span className="ad-tile__icon-wrap" aria-hidden>
                    <Clock size={18} strokeWidth={1.75} />
                  </span>
                  <span className="ad-tile__label">TIME</span>
                  <span className="ad-tile__value">
                    {slot ? slot.time : "—"}
                  </span>
                </div>
                <div className="ad-tile">
                  <span className="ad-tile__icon-wrap" aria-hidden>
                    <MapPin size={18} strokeWidth={1.75} />
                  </span>
                  <span className="ad-tile__label">LOCATION</span>
                  <span className="ad-tile__value">
                    {campaign.neighborhood}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
