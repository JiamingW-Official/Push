"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import "../disputes.css";
import { MOCK_DISPUTES, AdminNote } from "@/lib/disputes/mock-disputes";
import { DisputeTimeline } from "@/components/disputes/DisputeTimeline";
import { AdminDecisionPanel } from "@/components/disputes/AdminDecisionPanel";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function isSlaBreached(deadline: string): boolean {
  return new Date(deadline) < new Date();
}

const STATUS_LABEL: Record<string, string> = {
  open: "Open",
  under_review: "Under Review",
  awaiting_evidence: "Awaiting Evidence",
  escalated: "Escalated",
  resolved: "Resolved",
  dismissed: "Dismissed",
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function DisputeDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const dispute = MOCK_DISPUTES.find((d) => d.id === id);
  if (!dispute) return notFound();

  return <DisputeDetail disputeId={id} />;
}

function DisputeDetail({ disputeId }: { disputeId: string }) {
  const dispute = MOCK_DISPUTES.find((d) => d.id === disputeId)!;

  const [notes, setNotes] = useState<AdminNote[]>(dispute.admin_notes);
  const [noteText, setNoteText] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [threadLocked, setThreadLocked] = useState(dispute.thread_locked);
  const [escalated, setEscalated] = useState(dispute.escalated_to_legal);

  const isActive = !["resolved", "dismissed"].includes(dispute.status);
  const breached = isSlaBreached(dispute.sla_deadline);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function handleSaveNote() {
    if (!noteText.trim()) return;
    setNoteLoading(true);
    setTimeout(() => {
      const newNote: AdminNote = {
        id: `anote_${Date.now()}`,
        dispute_id: dispute.id,
        author: "Admin",
        content: noteText.trim(),
        timestamp: new Date().toISOString(),
      };
      setNotes((prev) => [...prev, newNote]);
      setNoteText("");
      setNoteLoading(false);
      showToast("Note saved.");
    }, 400);
  }

  function handleRequestEvidence(from: "creator" | "merchant") {
    showToast(`Evidence request sent to ${from}.`);
  }

  function handleEscalate() {
    setEscalated(true);
    showToast("Dispute escalated to legal team.");
  }

  function handleLockThread() {
    setThreadLocked((prev) => !prev);
    showToast(threadLocked ? "Thread unlocked." : "Thread locked.");
  }

  return (
    <div className="adm-shell adm-detail">
      {/* Nav */}
      <nav className="adm-nav">
        <Link href="/" className="adm-nav__logo">
          Push<span>.</span>
        </Link>
        <div className="adm-nav__sep" />
        <span className="adm-nav__section">Admin / Disputes</span>
        <div className="adm-nav__spacer" />
        {escalated && <span className="adm-nav__badge">Legal</span>}
      </nav>

      {/* Detail header */}
      <div className="adm-detail__header">
        <div className="adm-detail__header-inner">
          <Link href="/admin/disputes" className="adm-detail__back">
            ← Back to queue
          </Link>

          <h1 className="adm-detail__title">{dispute.reason}</h1>

          <div className="adm-detail__meta">
            <span className={`badge badge--status-${dispute.status}`}>
              {STATUS_LABEL[dispute.status]}
            </span>
            <span className={`badge badge--sev-${dispute.severity}`}>
              {dispute.severity}
            </span>
            {isActive && breached && (
              <span className="badge badge--sla">SLA breached</span>
            )}
            {threadLocked && (
              <span className="badge badge--locked">Thread locked</span>
            )}
            {escalated && (
              <span className="badge badge--legal">Escalated to legal</span>
            )}
            <span className="adm-detail__amount-tag">
              ${dispute.amount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="adm-detail__body">
        {/* Main column */}
        <div className="adm-detail__main">
          {/* Parties */}
          <div className="adm-panel">
            <p className="adm-panel__label">Parties</p>
            <div className="adm-parties">
              {/* Creator */}
              <div className="adm-party">
                <span className="adm-party__role">Creator</span>
                <div className="adm-party__avatar-row">
                  <div className="adm-party__avatar">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={dispute.creator_avatar}
                      alt={dispute.creator_name}
                    />
                  </div>
                  <div>
                    <div className="adm-party__name">
                      {dispute.creator_name}
                    </div>
                    <div className="adm-party__handle">
                      {dispute.creator_handle}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                  <span
                    className={`badge badge--sev-${dispute.creator_tier === "partner" ? "medium" : "low"}`}
                  >
                    {dispute.creator_tier}
                  </span>
                </div>
              </div>

              <div className="adm-parties__divider" />

              {/* Merchant */}
              <div className="adm-party">
                <span className="adm-party__role">Merchant</span>
                <div className="adm-party__name">{dispute.merchant_name}</div>
                <div className="adm-party__business">
                  {dispute.merchant_business}
                </div>
              </div>
            </div>
          </div>

          {/* Campaign & dates */}
          <div className="adm-panel">
            <p className="adm-panel__label">Campaign details</p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "var(--space-3)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: "4px",
                  }}
                >
                  Campaign
                </div>
                <div style={{ fontSize: "var(--text-small)", fontWeight: 600 }}>
                  {dispute.campaign_title}
                </div>
                <div
                  style={{
                    fontSize: "var(--text-caption)",
                    color: "var(--text-muted)",
                    marginTop: "2px",
                  }}
                >
                  {dispute.campaign_category}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: "4px",
                  }}
                >
                  Timeline
                </div>
                <div
                  style={{ fontSize: "var(--text-caption)", lineHeight: 1.6 }}
                >
                  <div>
                    Opened: <strong>{formatDate(dispute.opened_at)}</strong>
                  </div>
                  <div
                    style={{
                      color:
                        breached && isActive ? "var(--primary)" : undefined,
                      fontWeight: breached && isActive ? 700 : undefined,
                    }}
                  >
                    SLA deadline:{" "}
                    <strong>{formatDate(dispute.sla_deadline)}</strong>
                  </div>
                  {dispute.resolved_at && (
                    <div>
                      Resolved:{" "}
                      <strong>{formatDate(dispute.resolved_at)}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="adm-panel">
            <p className="adm-panel__label">Description</p>
            <p className="adm-description">{dispute.description}</p>
          </div>

          {/* Timeline */}
          <div className="adm-panel">
            <p className="adm-panel__label">Event timeline</p>
            <DisputeTimeline events={dispute.timeline} showInternal={true} />
          </div>

          {/* Internal notes */}
          <div className="adm-panel">
            <p className="adm-panel__label">Internal notes (admin only)</p>
            <div className="adm-notes">
              {notes.length === 0 && (
                <p
                  style={{
                    fontSize: "var(--text-small)",
                    color: "var(--text-muted)",
                    margin: 0,
                  }}
                >
                  No internal notes yet.
                </p>
              )}
              {notes.map((note) => (
                <div key={note.id} className="adm-note">
                  <div className="adm-note__author-row">
                    <span className="adm-note__author">{note.author}</span>
                    <span className="adm-note__time">
                      {formatDate(note.timestamp)}
                    </span>
                  </div>
                  <p className="adm-note__content">{note.content}</p>
                </div>
              ))}

              {/* Add note */}
              <div className="adm-notes__add">
                <textarea
                  className="adm-notes__textarea"
                  placeholder="Add internal note (only visible to admins)…"
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <button
                  className="adm-notes__save"
                  onClick={handleSaveNote}
                  disabled={noteLoading || !noteText.trim()}
                >
                  {noteLoading ? "Saving…" : "Save note"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="adm-detail__sidebar">
          {/* Admin Decision Panel */}
          <AdminDecisionPanel
            dispute={dispute}
            onDecisionPosted={({ outcome }) => {
              showToast(
                `Decision posted: ${outcome.replace("_", " ")}. Dispute moving to resolved.`,
              );
            }}
          />

          {/* Action buttons */}
          <div className="adm-panel">
            <p className="adm-panel__label">Actions</p>
            <div className="adm-actions">
              <button
                className="adm-action-btn"
                onClick={() => handleRequestEvidence("creator")}
                disabled={!isActive || threadLocked}
              >
                Request evidence from creator
                <span className="adm-action-btn__icon">→</span>
              </button>
              <button
                className="adm-action-btn"
                onClick={() => handleRequestEvidence("merchant")}
                disabled={!isActive || threadLocked}
              >
                Request evidence from merchant
                <span className="adm-action-btn__icon">→</span>
              </button>
              <button
                className="adm-action-btn adm-action-btn--danger"
                onClick={handleEscalate}
                disabled={!isActive || escalated}
              >
                {escalated ? "Escalated to legal" : "Escalate to legal"}
                <span className="adm-action-btn__icon">⚠</span>
              </button>
              <button
                className={`adm-action-btn${threadLocked ? "" : " adm-action-btn--danger"}`}
                onClick={handleLockThread}
                disabled={!isActive}
              >
                {threadLocked ? "Unlock thread" : "Lock thread"}
                <span className="adm-action-btn__icon">
                  {threadLocked ? "🔓" : "🔒"}
                </span>
              </button>
            </div>
          </div>

          {/* Summary card */}
          <div className="adm-panel">
            <p className="adm-panel__label">Quick facts</p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-1)",
              }}
            >
              {[
                ["Dispute ID", dispute.id],
                ["Amount", `$${dispute.amount.toFixed(2)}`],
                ["Campaign ID", dispute.campaign_id],
                ["Events", String(dispute.timeline.length)],
                ["Internal notes", String(notes.length)],
              ].map(([label, val]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "var(--text-caption)",
                    padding: "4px 0",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  <span style={{ color: "var(--text-muted)" }}>{label}</span>
                  <strong style={{ color: "var(--dark)" }}>{val}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <div className="adm-toast">{toast}</div>}
    </div>
  );
}
