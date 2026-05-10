"use client";

/* ============================================================
   <Stage7aRevisionPanel> — merchant requested revisions
   v3 · 2026-05-10 — two-column premium layout
   ============================================================ */

import { useState } from "react";
import { Upload, Sparkles, Image } from "lucide-react";
import type { StagePanelProps } from "../StageRouter";
import { patchApplication } from "@/lib/data/live-applications";

const REVIEW_ITEMS = [
  {
    id: 0,
    label: "Wide establishing shot",
    status: "approved" as const,
    feedback: null as string | null,
  },
  {
    id: 1,
    label: "Product hero close-up",
    status: "flagged" as const,
    feedback:
      "Too dark — could you reshoot in natural light? The front window works perfectly.",
  },
  {
    id: 2,
    label: "Candid lifestyle moment",
    status: "flagged" as const,
    feedback:
      "Loved the energy, but the brand logo is missing from frame. A quick reshoot should do it.",
  },
];

const REVISION_COUNT = REVIEW_ITEMS.filter(
  (i) => i.status === "flagged",
).length;

export function Stage7aRevisionPanel({
  application,
  campaign,
}: StagePanelProps) {
  const [reUploaded, setReUploaded] = useState<Set<number>>(new Set());
  const merchantFirst =
    campaign.merchantName.split(" ")[0] ?? campaign.merchantName;
  const allReuploaded = reUploaded.size === REVISION_COUNT;

  function handleResubmit() {
    patchApplication(application.id, {
      status: "submitted",
      submittedAt: new Date().toISOString(),
    });
  }

  return (
    <div className="ad-panel-v3" aria-label="Revision requested">
      <div className="ad-layout">
        {/* ── LEFT COLUMN ──────────────────────────────────── */}
        <div className="ad-col-main">
          {/* Hero v3 */}
          <div className="ad-hero-v3">
            <div className="ad-hero-v3__eyebrow">
              <span className="ad-pill ad-pill--amber">
                <span className="ad-pill__dot" />
                REVISION NEEDED · {REVISION_COUNT} items
              </span>
            </div>
            <div className="ad-hero-v3__stat ad-hero-v3__stat--amber">
              {REVISION_COUNT}
            </div>
            <h1 className="ad-hero-v3__title">Quick fix needed.</h1>
            <p className="ad-hero-v3__sub">
              Only the flagged rows need re-upload. The wide shot is already
              approved — don&apos;t reshoot that one. Deadline extended by 48h.
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
                Focus on the product hero: {merchantFirst} wants fill-flash to
                eliminate the backlighting issue. The lifestyle shot needs the
                brand logo in frame — a quick 20 min reshoot should cover both.
                Use the front window for natural fill.
              </p>
            </div>
          </div>

          {/* Submission review card */}
          <div className="ad-card">
            <div className="ad-card__body">
              <span className="ad-card__label">SUBMISSION REVIEW</span>
              <p
                style={{
                  margin: "8px 0 12px",
                  fontFamily: "var(--font-display)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--ink-4)",
                  letterSpacing: "0.04em",
                }}
              >
                {reUploaded.size}/{REVISION_COUNT} REVISED
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {REVIEW_ITEMS.map((item) => {
                  const isRevised = reUploaded.has(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`ad-revision-item${item.status === "approved" ? " ad-revision-item--approved" : " ad-revision-item--flagged"}`}
                    >
                      <div className="ad-revision-item__head">
                        <span className="ad-revision-item__num">
                          {String(item.id + 1).padStart(2, "0")}
                        </span>
                        <span className="ad-revision-item__label">
                          {item.label}
                        </span>
                        <span
                          className={`ad-revision-item__status${item.status === "approved" ? " ad-revision-item__status--approved" : " ad-revision-item__status--flagged"}`}
                        >
                          {isRevised
                            ? "Revised"
                            : item.status === "approved"
                              ? "Approved"
                              : "Flagged"}
                        </span>
                      </div>
                      {item.status === "flagged" && item.feedback && (
                        <div className="ad-revision-item__feedback">
                          <p className="ad-revision-item__feedback-text">
                            {item.feedback}
                          </p>
                        </div>
                      )}
                      {item.status === "flagged" && !isRevised && (
                        <div className="ad-revision-item__upload">
                          <button
                            type="button"
                            className="ad-btn ad-btn--ghost ad-btn--sm"
                            onClick={() =>
                              setReUploaded(
                                (prev) => new Set([...prev, item.id]),
                              )
                            }
                          >
                            <Upload size={12} strokeWidth={2} />
                            Upload revision (demo)
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────── */}
        <div className="ad-col-side">
          {/* Resubmit card */}
          <div className="ad-card">
            <div className="ad-card__body">
              <span className="ad-card__label">RESUBMIT</span>
              <p
                style={{
                  margin: "12px 0 16px",
                  fontSize: 13,
                  color: "var(--ink-3)",
                  lineHeight: 1.55,
                }}
              >
                {allReuploaded
                  ? "All flagged files revised. Ready to resubmit."
                  : `${REVISION_COUNT - reUploaded.size} flagged file${REVISION_COUNT - reUploaded.size !== 1 ? "s" : ""} still need re-upload.`}
              </p>
              <button
                type="button"
                className="ad-btn ad-btn--ink"
                style={{
                  width: "100%",
                  opacity: allReuploaded ? 1 : 0.45,
                  cursor: allReuploaded ? "pointer" : "not-allowed",
                }}
                disabled={!allReuploaded}
                onClick={handleResubmit}
              >
                {allReuploaded
                  ? "Resubmit for review"
                  : `Upload ${REVISION_COUNT - reUploaded.size} more revision${REVISION_COUNT - reUploaded.size !== 1 ? "s" : ""}`}
              </button>
              {!allReuploaded && (
                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: 12,
                    color: "var(--ink-4)",
                    textAlign: "center",
                  }}
                >
                  Upload all flagged revisions to unlock resubmit
                </p>
              )}
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
                  <span className="ad-campaign-card__stat-value">
                    {REVISION_COUNT}
                  </span>
                  <span className="ad-campaign-card__stat-label">flagged</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
