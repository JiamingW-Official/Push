"use client";

/* ============================================================
   <Stage6SubmittedPanel> — content submitted, under review
   v3 · 2026-05-10 — two-column premium layout
   ============================================================ */

import { Sparkles, Image } from "lucide-react";
import type { StagePanelProps } from "../StageRouter";

const MOCK_DELIVERABLES = [
  {
    id: 0,
    label: "Wide establishing shot",
    tag: "Image",
    caption: "Found my new neighbourhood gem 🫶 #ad #partner",
  },
  {
    id: 1,
    label: "Product hero close-up",
    tag: "Image",
    caption: "Can't stop thinking about this spot 📸 #sponsored #local",
  },
  {
    id: 2,
    label: "Candid lifestyle moment",
    tag: "Video",
    caption: "Exploring with Push — genuinely love the energy 👀 #ad",
  },
];

export function Stage6SubmittedPanel({
  application,
  campaign,
}: StagePanelProps) {
  const merchantFirst =
    campaign.merchantName.split(" ")[0] ?? campaign.merchantName;
  const submittedDate = application.submittedAt
    ? new Date(application.submittedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "just now";

  return (
    <div className="ad-panel-v3" aria-label="Submission under review">
      <div className="ad-layout">
        {/* ── LEFT COLUMN ──────────────────────────────────── */}
        <div className="ad-col-main">
          {/* Hero v3 */}
          <div className="ad-hero-v3">
            <div className="ad-hero-v3__eyebrow">
              <span className="ad-pill ad-pill--blue">
                <span className="ad-pill__dot" />
                SUBMITTED
              </span>
            </div>
            <div className="ad-hero-v3__stat ad-hero-v3__stat--blue">72h</div>
            <h1 className="ad-hero-v3__title">
              In {merchantFirst}&apos;s hands now.
            </h1>
            <p className="ad-hero-v3__sub">
              Content submitted {submittedDate}. Review window closes in ~72h.
              You&apos;ll get an instant ping on their decision.
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
                I&apos;m watching for {merchantFirst}&apos;s response. Your wide
                shot was technically strong. Merchants in this tier usually
                respond within 48h — often faster. I&apos;ll alert you the
                moment a decision lands.
              </p>
            </div>
          </div>

          {/* Submission card */}
          <div className="ad-card">
            <div className="ad-card__body">
              <span className="ad-card__label">
                YOUR SUBMISSION · {MOCK_DELIVERABLES.length} FILES
              </span>
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {MOCK_DELIVERABLES.map((d) => (
                  <div key={d.id} className="ad-file-card">
                    <span className="ad-file-card__num">
                      {String(d.id + 1).padStart(2, "0")}
                    </span>
                    <div className="ad-file-card__body">
                      <span className="ad-file-card__title">{d.label}</span>
                      <span className="ad-file-card__caption">{d.caption}</span>
                    </div>
                    <span className="ad-file-card__chip ad-file-card__chip--pending">
                      PENDING
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────── */}
        <div className="ad-col-side">
          {/* Review timeline card */}
          <div className="ad-card">
            <div className="ad-card__body">
              <span className="ad-card__label">REVIEW TIMELINE</span>
              <div className="ad-timeline-v3" style={{ marginTop: 16 }}>
                <div className="ad-timeline-v3__step">
                  <div className="ad-timeline-v3__track">
                    <div className="ad-timeline-v3__dot ad-timeline-v3__dot--done" />
                    <div className="ad-timeline-v3__line" />
                  </div>
                  <div className="ad-timeline-v3__content">
                    <span className="ad-timeline-v3__title">
                      Content submitted
                    </span>
                    <span className="ad-timeline-v3__sub">{submittedDate}</span>
                  </div>
                </div>
                <div className="ad-timeline-v3__step">
                  <div className="ad-timeline-v3__track">
                    <div className="ad-timeline-v3__dot ad-timeline-v3__dot--active" />
                    <div className="ad-timeline-v3__line" />
                  </div>
                  <div className="ad-timeline-v3__content">
                    <span className="ad-timeline-v3__title">
                      Merchant review
                    </span>
                    <span className="ad-timeline-v3__sub">~72h</span>
                  </div>
                </div>
                <div className="ad-timeline-v3__step">
                  <div className="ad-timeline-v3__track">
                    <div className="ad-timeline-v3__dot" />
                  </div>
                  <div className="ad-timeline-v3__content">
                    <span className="ad-timeline-v3__title">
                      Verification + payout
                    </span>
                    <span className="ad-timeline-v3__sub">After approval</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                  <span className="ad-campaign-card__stat-value">72h</span>
                  <span className="ad-campaign-card__stat-label">review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
