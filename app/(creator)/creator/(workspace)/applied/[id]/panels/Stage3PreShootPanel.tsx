"use client";

/* ============================================================
   <Stage3PreShootPanel> — shoot day, slot coming up
   v3 · 2026-05-10 — two-column premium layout
   ============================================================ */

import { useState, useEffect } from "react";
import {
  Clock,
  MapPin,
  QrCode,
  Navigation,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";
import type { StagePanelProps } from "../StageRouter";

function formatSlotTime(slotIso?: string): string {
  if (!slotIso) return "your slot";
  const d = new Date(slotIso);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatCountdown(slotIso?: string): string {
  if (!slotIso) return "Soon";
  const diff = new Date(slotIso).getTime() - Date.now();
  if (diff <= 0) return "Now";
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h >= 24) return `${Math.floor(h / 24)}d ${h % 24}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const SHOTS = [
  {
    num: "01",
    label: "Wide establishing shot",
    tag: "Exterior",
    note: "Storefront + neighbourhood context, natural light preferred",
  },
  {
    num: "02",
    label: "Product hero close-up",
    tag: "Product",
    note: "Fill-flash ok, avoid harsh shadows on product surface",
  },
  {
    num: "03",
    label: "Candid lifestyle moment",
    tag: "Lifestyle",
    note: "You or staff — feels real, not staged",
  },
] as const;

export function Stage3PreShootPanel({
  application,
  campaign,
}: StagePanelProps) {
  const [countdown, setCountdown] = useState(() =>
    formatCountdown(application.slotIso),
  );
  const merchantFirst =
    campaign.merchantName.split(" ")[0] ?? campaign.merchantName;

  useEffect(() => {
    const t = setInterval(
      () => setCountdown(formatCountdown(application.slotIso)),
      30_000,
    );
    return () => clearInterval(t);
  }, [application.slotIso]);

  const mapsUrl = `https://maps.apple.com/?q=${encodeURIComponent(campaign.neighborhood)}`;
  const googleUrl = `https://maps.google.com/?q=${encodeURIComponent(campaign.neighborhood)}`;
  const slotTime = formatSlotTime(application.slotIso);

  const thumb = campaign.images?.[0];

  return (
    <section className="ad-panel-v3" aria-label="Pre-shoot prep">
      <div className="ad-layout">
        {/* ── LEFT COLUMN ─────────────────────────────────────── */}
        <div className="ad-col-main">
          {/* Hero v3 */}
          <div className="ad-hero-v3">
            <div className="ad-hero-v3__eyebrow">
              <span className="ad-pill ad-pill--amber">
                <span className="ad-pill__dot" aria-hidden />
                TODAY · {campaign.neighborhood}
              </span>
            </div>
            <div className="ad-hero-v3__stat ad-hero-v3__stat--amber ad-hero-v3__stat--timer">
              {countdown}
            </div>
            <h1 className="ad-hero-v3__title">Your slot is coming up</h1>
            <p className="ad-hero-v3__sub">
              {merchantFirst} is expecting you at <strong>{slotTime}</strong>.
              Show your QR at the register to check in.
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
                Charge in transit. QR ready below. Brief wants the wide shot
                first — get it from across the street before you step inside.
                Take the L train (9 min). Allow 15 min to set up before your
                slot.
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
          {/* QR ready reminder card — dark styled */}
          <div
            className="ad-card"
            style={{ background: "var(--ink, #1a1916)", color: "#fff" }}
          >
            <div className="ad-card__body">
              <span
                className="ad-card__label"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                QR READY
              </span>
              <div
                className="ad-card__divider"
                aria-hidden
                style={{ borderColor: "rgba(255,255,255,0.1)" }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  padding: "16px 0",
                }}
              >
                <QrCode
                  size={48}
                  strokeWidth={1.5}
                  style={{ color: "rgba(255,255,255,0.9)" }}
                  aria-hidden
                />
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#fff",
                    fontFamily: "var(--font-darky, sans-serif)",
                    textAlign: "center",
                  }}
                >
                  Show this at register
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.55)",
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                >
                  Have your QR ready for check-in
                </span>
              </div>
            </div>
          </div>

          {/* Getting there card */}
          <div className="ad-card">
            <div className="ad-card__body">
              <span className="ad-card__label">GETTING THERE</span>
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
                <a
                  href={googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ad-btn ad-btn--ghost"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    textDecoration: "none",
                  }}
                >
                  Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Slot details card */}
          <div className="ad-card">
            <div className="ad-card__body">
              <span className="ad-card__label">SLOT DETAILS</span>
              <div className="ad-card__divider" aria-hidden />
              <div className="ad-tile-grid">
                <div className="ad-tile">
                  <span className="ad-tile__icon-wrap" aria-hidden>
                    <Clock size={18} strokeWidth={1.75} />
                  </span>
                  <span className="ad-tile__label">SLOT TIME</span>
                  <span className="ad-tile__value">{slotTime}</span>
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
                <div className="ad-tile">
                  <span className="ad-tile__icon-wrap" aria-hidden>
                    <QrCode size={18} strokeWidth={1.75} />
                  </span>
                  <span className="ad-tile__label">CHECK-IN</span>
                  <span className="ad-tile__value">Show QR</span>
                  <span className="ad-tile__chip ad-tile__chip--amber">
                    REQUIRED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign thumbnail */}
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
