"use client";

import { useState } from "react";
import Link from "next/link";
import type {
  Dispute,
  DisputeEvent,
  ParticipantRole,
} from "@/lib/disputes/types";
import {
  DISPUTE_REASON_LABELS,
  DISPUTE_STATUS_LABELS,
  DISPUTE_OUTCOME_LABELS,
} from "@/lib/disputes/types";
import {
  formatDate,
  formatAmount,
  statusBadgeClass,
  initialsFrom,
  outcomeLabel,
} from "@/lib/disputes/utils";
import { DisputeTimeline } from "./DisputeTimeline";
import { EvidenceUploader } from "./EvidenceUploader";

interface DisputeDetailProps {
  dispute: Dispute;
  viewerRole: ParticipantRole;
  viewerName: string;
  basePath: string; // "/creator/disputes" | "/merchant/disputes"
}

export function DisputeDetail({
  dispute,
  viewerRole,
  viewerName,
  basePath,
}: DisputeDetailProps) {
  const [events, setEvents] = useState<DisputeEvent[]>(dispute.events);
  const [responseText, setResponseText] = useState("");
  const [evidence, setEvidence] = useState<
    Omit<import("@/lib/disputes/types").DisputeEvidence, "id" | "uploadedAt">[]
  >([]);
  const [submitting, setSubmitting] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  const isResolved =
    dispute.status === "resolved" || dispute.status === "closed";
  const canRespond = !isResolved;

  async function handleSubmitResponse(e: React.FormEvent) {
    e.preventDefault();
    if (!responseText.trim() || submitting) return;
    setSubmitting(true);

    const eventType =
      viewerRole === "creator" ? "creator_response" : "merchant_response";

    try {
      const res = await fetch(`/api/disputes/${dispute.id}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: eventType,
          authorRole: viewerRole,
          authorName: viewerName,
          message: responseText,
          evidence,
        }),
      });
      const data = await res.json();
      setEvents((prev) => [...prev, data.event]);
    } catch {
      // Optimistic update on failure
      const optimistic: DisputeEvent = {
        id: `evt-local-${Date.now()}`,
        disputeId: dispute.id,
        type: eventType,
        authorRole: viewerRole,
        authorName: viewerName,
        message: responseText,
        evidence: [],
        createdAt: new Date().toISOString(),
      };
      setEvents((prev) => [...prev, optimistic]);
    } finally {
      setResponseText("");
      setEvidence([]);
      setShowUploader(false);
      setSubmitting(false);
    }
  }

  const outcomeCls = dispute.outcome
    ? `dispute-outcome-banner dispute-outcome-banner--${dispute.outcome}`
    : "dispute-outcome-banner";

  return (
    <div className="dispute-detail-page">
      {/* Back link */}
      <Link href={basePath} className="dispute-detail-back">
        ← Back to disputes
      </Link>

      {/* Editorial header */}
      <div className="dispute-detail-header">
        <div className="dispute-detail-header__eyebrow">
          <span className="dispute-detail-header__id-label">Dispute</span>
          <span className={statusBadgeClass(dispute.status)}>
            {DISPUTE_STATUS_LABELS[dispute.status]}
          </span>
        </div>
        <h1 className="dispute-detail-header__title">{dispute.id}</h1>
        <div className="dispute-detail-header__meta">
          <div className="dispute-detail-header__meta-item">
            <span className="dispute-detail-header__meta-label">Campaign</span>
            <span className="dispute-detail-header__meta-value">
              {dispute.campaignTitle}
            </span>
          </div>
          <div className="dispute-detail-header__meta-item">
            <span className="dispute-detail-header__meta-label">Reason</span>
            <span className="dispute-detail-header__meta-value">
              {DISPUTE_REASON_LABELS[dispute.reason]}
            </span>
          </div>
          <div className="dispute-detail-header__meta-item">
            <span className="dispute-detail-header__meta-label">
              Amount Disputed
            </span>
            <span
              className="dispute-detail-header__meta-value"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "20px",
                letterSpacing: "-0.02em",
              }}
            >
              {formatAmount(dispute.amount)}
            </span>
          </div>
          <div className="dispute-detail-header__meta-item">
            <span className="dispute-detail-header__meta-label">Filed</span>
            <span className="dispute-detail-header__meta-value">
              {formatDate(dispute.createdAt)}
            </span>
          </div>
          {dispute.resolvedAt && (
            <div className="dispute-detail-header__meta-item">
              <span className="dispute-detail-header__meta-label">
                Resolved
              </span>
              <span className="dispute-detail-header__meta-value">
                {formatDate(dispute.resolvedAt)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Outcome banner (resolved / closed only) */}
      {isResolved && dispute.outcome && (
        <div className={outcomeCls}>
          <div>
            <p className="dispute-outcome-banner__label">Outcome</p>
            <p className="dispute-outcome-banner__title">
              {DISPUTE_OUTCOME_LABELS[dispute.outcome]}
            </p>
            {dispute.outcomeNote && (
              <p className="dispute-outcome-banner__note">
                {dispute.outcomeNote}
              </p>
            )}
          </div>
          {dispute.status === "resolved" && (
            <button className="dispute-outcome-banner__reopen" type="button">
              Reopen dispute
            </button>
          )}
        </div>
      )}

      {/* Two-column layout */}
      <div className="dispute-detail-layout">
        {/* ── Sidebar ── */}
        <aside className="dispute-sidebar">
          {/* Summary */}
          <div className="dispute-sidebar-card">
            <p className="dispute-sidebar-card__label">Summary</p>
            <div className="dispute-sidebar-card__row">
              <span className="dispute-sidebar-card__key">Amount</span>
              <span
                className="dispute-sidebar-card__value"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "20px",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                {formatAmount(dispute.amount)}
              </span>
            </div>
            <div className="dispute-sidebar-card__row">
              <span className="dispute-sidebar-card__key">Status</span>
              <span className={statusBadgeClass(dispute.status)}>
                {DISPUTE_STATUS_LABELS[dispute.status]}
              </span>
            </div>
            <div className="dispute-sidebar-card__row">
              <span className="dispute-sidebar-card__key">Reason</span>
              <span className="dispute-sidebar-card__value">
                {DISPUTE_REASON_LABELS[dispute.reason]}
              </span>
            </div>
            <div
              className="dispute-sidebar-card__row"
              style={{ alignItems: "flex-start", gap: "8px" }}
            >
              <span className="dispute-sidebar-card__key">Expected</span>
              <span
                className="dispute-sidebar-card__value"
                style={{ maxWidth: "160px" }}
              >
                {dispute.expectedOutcome || "—"}
              </span>
            </div>
          </div>

          {/* Campaign card */}
          <div className="dispute-sidebar-card">
            <p className="dispute-sidebar-card__label">Related Campaign</p>
            <div className="dispute-campaign-mini">
              <p className="dispute-campaign-mini__title">
                {dispute.campaignTitle}
              </p>
              <p className="dispute-campaign-mini__merchant">
                {dispute.merchantName}
              </p>
            </div>
            {dispute.relatedPaymentId && (
              <a
                href={`${
                  viewerRole === "creator"
                    ? "/creator/earnings"
                    : "/merchant/payments"
                }#${dispute.relatedPaymentId}`}
                className="dispute-sidebar-card__link"
              >
                View payment →
              </a>
            )}
            {dispute.relatedScanId && (
              <a
                href={`/creator/campaigns/${dispute.campaignId}#${dispute.relatedScanId}`}
                className="dispute-sidebar-card__link"
              >
                View scan record →
              </a>
            )}
          </div>

          {/* Participants */}
          <div className="dispute-sidebar-card">
            <p className="dispute-sidebar-card__label">Participants</p>
            <div className="dispute-participants">
              <div className="dispute-participant">
                <div className="dispute-participant__avatar">
                  {initialsFrom(dispute.filedBy)}
                </div>
                <div className="dispute-participant__info">
                  <p className="dispute-participant__name">{dispute.filedBy}</p>
                  <p className="dispute-participant__role">
                    {dispute.filedByRole} · filed
                  </p>
                </div>
                <div
                  className="dispute-participant__filer-dot"
                  title="Filed this dispute"
                />
              </div>
              <div className="dispute-participant">
                <div className="dispute-participant__avatar">
                  {initialsFrom(dispute.otherPartyName)}
                </div>
                <div className="dispute-participant__info">
                  <p className="dispute-participant__name">
                    {dispute.otherPartyName}
                  </p>
                  <p className="dispute-participant__role">
                    {dispute.otherPartyRole} · respondent
                  </p>
                </div>
              </div>
              <div className="dispute-participant">
                <div
                  className="dispute-participant__avatar"
                  style={{
                    background: "rgba(201, 169, 110, 0.15)",
                    borderColor: "rgba(201, 169, 110, 0.4)",
                    color:
                      "color-mix(in srgb, var(--champagne) 70%, var(--dark))",
                    fontSize: "12px",
                  }}
                >
                  PA
                </div>
                <div className="dispute-participant__info">
                  <p className="dispute-participant__name">Push Arbitration</p>
                  <p className="dispute-participant__role">admin · mediator</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main: timeline + composer ── */}
        <main>
          <DisputeTimeline events={events} />

          {/* Composer — hidden when resolved/closed */}
          {canRespond && (
            <div className="dispute-composer">
              <p className="dispute-composer__label">Add a response</p>
              <form onSubmit={handleSubmitResponse}>
                <textarea
                  className="dispute-composer__textarea"
                  placeholder="Write your response or provide additional information…"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                />

                {showUploader && (
                  <div style={{ marginTop: "12px" }}>
                    <EvidenceUploader
                      disputeId={dispute.id}
                      uploadedBy={viewerRole}
                      onChange={setEvidence}
                    />
                  </div>
                )}

                <div className="dispute-composer__actions">
                  <button
                    className="dispute-composer__attach"
                    type="button"
                    onClick={() => setShowUploader((v) => !v)}
                  >
                    📎 {showUploader ? "Hide uploader" : "Attach evidence"}
                  </button>
                  <button
                    className="dispute-composer__submit"
                    type="submit"
                    disabled={!responseText.trim() || submitting}
                  >
                    {submitting ? "Sending…" : "Send Response"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
