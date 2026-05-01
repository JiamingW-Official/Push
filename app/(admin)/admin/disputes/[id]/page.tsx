"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import "../disputes.css";
import "./dispute-detail.css";
import { MOCK_DISPUTES, AdminNote } from "@/lib/disputes/mock-admin-disputes";
import { DisputeTimeline } from "@/components/disputes/AdminDisputeTimeline";
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

function statusChip(status: string): { bg: string; color: string } {
  switch (status) {
    case "escalated":
      return { bg: "rgba(193,18,31,0.1)", color: "var(--brand-red)" };
    case "open":
      return { bg: "var(--panel-butter)", color: "var(--ink-3)" };
    case "under_review":
      return { bg: "rgba(0,133,255,0.08)", color: "var(--accent-blue)" };
    case "awaiting_evidence":
      return { bg: "rgba(191,161,112,0.14)", color: "#8a6a2a" };
    default:
      return { bg: "var(--surface-3)", color: "var(--ink-4)" };
  }
}

function severityChip(sev: string): { bg: string; color: string } {
  switch (sev) {
    case "critical":
      return { bg: "rgba(193,18,31,0.12)", color: "var(--brand-red)" };
    case "high":
      return { bg: "rgba(193,18,31,0.07)", color: "var(--brand-red)" };
    case "medium":
      return { bg: "var(--panel-butter)", color: "var(--ink-3)" };
    default:
      return { bg: "var(--surface-3)", color: "var(--ink-4)" };
  }
}

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
  const sc = statusChip(dispute.status);
  const sev = severityChip(dispute.severity);

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

  const cardStyle: React.CSSProperties = {
    background: "var(--surface-2)",
    border: "1px solid var(--hairline)",
    borderRadius: 10,
    padding: "20px 24px",
    marginBottom: 16,
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.07em",
    fontFamily: "var(--font-body)",
    color: "var(--ink-4)",
    textTransform: "uppercase",
    marginBottom: 14,
  };

  const fieldLabel: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    fontFamily: "var(--font-body)",
    color: "var(--ink-4)",
    textTransform: "uppercase",
    marginBottom: 4,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface)",
        paddingBottom: 64,
      }}
    >
      {/* Page header */}
      <div style={{ padding: "40px 40px 24px" }}>
        <Link
          href="/admin/disputes"
          style={{
            fontSize: 13,
            fontFamily: "var(--font-body)",
            color: "var(--ink-4)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 20,
          }}
        >
          ← Back to disputes
        </Link>

        <div className="eyebrow" style={{ marginBottom: 8 }}>
          ADMIN · PUSH INTERNAL · DISPUTES
          {escalated && (
            <span
              style={{
                marginLeft: 12,
                padding: "2px 8px",
                borderRadius: 4,
                background: "rgba(193,18,31,0.1)",
                color: "var(--brand-red)",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              Legal
            </span>
          )}
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px,3vw,40px)",
            fontWeight: 800,
            color: "var(--ink)",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          {dispute.reason}
        </h1>

        {/* Status badges + amount */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              padding: "3px 10px",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              background: sc.bg,
              color: sc.color,
            }}
          >
            {STATUS_LABEL[dispute.status]}
          </span>
          <span
            style={{
              padding: "3px 10px",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              background: sev.bg,
              color: sev.color,
              textTransform: "capitalize",
            }}
          >
            {dispute.severity}
          </span>
          {isActive && breached && (
            <span
              style={{
                padding: "3px 10px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "var(--font-body)",
                background: "rgba(193,18,31,0.1)",
                color: "var(--brand-red)",
              }}
            >
              SLA breached
            </span>
          )}
          {threadLocked && (
            <span
              style={{
                padding: "3px 10px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "var(--font-body)",
                background: "var(--surface-3)",
                color: "var(--ink-4)",
              }}
            >
              Thread locked
            </span>
          )}
          {escalated && (
            <span
              style={{
                padding: "3px 10px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "var(--font-body)",
                background: "rgba(193,18,31,0.1)",
                color: "var(--brand-red)",
              }}
            >
              Escalated to legal
            </span>
          )}
          <span
            style={{
              marginLeft: 8,
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 800,
              color: "var(--ink)",
            }}
          >
            ${dispute.amount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Two-column body */}
      <div
        style={{
          padding: "0 40px",
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* Main column */}
        <div>
          {/* Parties */}
          <div style={cardStyle}>
            <div style={sectionTitle}>Parties</div>
            <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
              {/* Creator */}
              <div style={{ flex: 1 }}>
                <div style={{ ...fieldLabel, marginBottom: 10 }}>Creator</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dispute.creator_avatar}
                    alt={dispute.creator_name}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        fontFamily: "var(--font-body)",
                        color: "var(--ink)",
                      }}
                    >
                      {dispute.creator_name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontFamily: "var(--font-body)",
                        color: "var(--ink-4)",
                      }}
                    >
                      {dispute.creator_handle}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "var(--font-body)",
                    background: "rgba(0,133,255,0.08)",
                    color: "var(--accent-blue)",
                    textTransform: "capitalize",
                  }}
                >
                  {dispute.creator_tier}
                </span>
              </div>

              <div
                style={{
                  width: 1,
                  background: "var(--hairline)",
                  alignSelf: "stretch",
                }}
              />

              {/* Merchant */}
              <div style={{ flex: 1 }}>
                <div style={{ ...fieldLabel, marginBottom: 10 }}>Merchant</div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    fontFamily: "var(--font-body)",
                    color: "var(--ink)",
                    marginBottom: 4,
                  }}
                >
                  {dispute.merchant_name}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontFamily: "var(--font-body)",
                    color: "var(--ink-4)",
                  }}
                >
                  {dispute.merchant_business}
                </div>
              </div>
            </div>
          </div>

          {/* Campaign & dates */}
          <div style={cardStyle}>
            <div style={sectionTitle}>Campaign details</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
              }}
            >
              <div>
                <div style={fieldLabel}>Campaign</div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    fontFamily: "var(--font-body)",
                    color: "var(--ink)",
                    marginBottom: 4,
                  }}
                >
                  {dispute.campaign_title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontFamily: "var(--font-body)",
                    color: "var(--ink-4)",
                  }}
                >
                  {dispute.campaign_category}
                </div>
              </div>
              <div>
                <div style={fieldLabel}>Timeline</div>
                <div
                  style={{
                    fontSize: 13,
                    fontFamily: "var(--font-body)",
                    lineHeight: 1.8,
                    color: "var(--ink)",
                  }}
                >
                  <div>
                    Opened: <strong>{formatDate(dispute.opened_at)}</strong>
                  </div>
                  <div
                    style={{
                      color:
                        breached && isActive ? "var(--brand-red)" : undefined,
                      fontWeight: breached && isActive ? 700 : undefined,
                    }}
                  >
                    SLA: <strong>{formatDate(dispute.sla_deadline)}</strong>
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
          <div style={cardStyle}>
            <div style={sectionTitle}>Description</div>
            <p
              style={{
                fontSize: 14,
                fontFamily: "var(--font-body)",
                color: "var(--ink)",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {dispute.description}
            </p>
          </div>

          {/* Timeline */}
          <div style={cardStyle}>
            <div style={sectionTitle}>Event timeline</div>
            <DisputeTimeline events={dispute.timeline} showInternal={true} />
          </div>

          {/* Internal notes */}
          <div style={cardStyle}>
            <div style={sectionTitle}>Internal notes (admin only)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {notes.length === 0 && (
                <p
                  style={{
                    fontSize: 13,
                    fontFamily: "var(--font-body)",
                    color: "var(--ink-4)",
                    margin: 0,
                  }}
                >
                  No internal notes yet.
                </p>
              )}
              {notes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    padding: "12px 16px",
                    background: "var(--surface-3)",
                    borderRadius: 8,
                    border: "1px solid var(--hairline)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        fontFamily: "var(--font-body)",
                        color: "var(--ink)",
                      }}
                    >
                      {note.author}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: "var(--font-body)",
                        color: "var(--ink-4)",
                      }}
                    >
                      {formatDate(note.timestamp)}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      fontFamily: "var(--font-body)",
                      color: "var(--ink)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {note.content}
                  </p>
                </div>
              ))}

              {/* Add note */}
              <div style={{ marginTop: 8 }}>
                <textarea
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid var(--hairline)",
                    borderRadius: 8,
                    background: "var(--surface)",
                    color: "var(--ink)",
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                  placeholder="Add internal note (only visible to admins)…"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <button
                  className="btn-primary click-shift"
                  style={{ marginTop: 8 }}
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
        <div style={{ position: "sticky", top: 24 }}>
          {/* Admin Decision Panel */}
          <div style={{ marginBottom: 16 }}>
            <AdminDecisionPanel
              dispute={dispute}
              onDecisionPosted={({ outcome }) => {
                showToast(
                  `Decision posted: ${outcome.replace("_", " ")}. Dispute moving to resolved.`,
                );
              }}
            />
          </div>

          {/* Action buttons */}
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <div style={sectionTitle}>Actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  border: "1px solid var(--hairline)",
                  borderRadius: 8,
                  background: "var(--surface-3)",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: 600,
                  color:
                    !isActive || threadLocked ? "var(--ink-4)" : "var(--ink)",
                  cursor: !isActive || threadLocked ? "not-allowed" : "pointer",
                  textAlign: "left",
                }}
                onClick={() => handleRequestEvidence("creator")}
                disabled={!isActive || threadLocked}
                className="click-shift"
              >
                Request evidence from creator
                <span>→</span>
              </button>
              <button
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  border: "1px solid var(--hairline)",
                  borderRadius: 8,
                  background: "var(--surface-3)",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: 600,
                  color:
                    !isActive || threadLocked ? "var(--ink-4)" : "var(--ink)",
                  cursor: !isActive || threadLocked ? "not-allowed" : "pointer",
                  textAlign: "left",
                }}
                onClick={() => handleRequestEvidence("merchant")}
                disabled={!isActive || threadLocked}
                className="click-shift"
              >
                Request evidence from merchant
                <span>→</span>
              </button>
              <button
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  border: "1px solid rgba(193,18,31,0.25)",
                  borderRadius: 8,
                  background: "rgba(193,18,31,0.04)",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: 600,
                  color:
                    !isActive || escalated
                      ? "var(--ink-4)"
                      : "var(--brand-red)",
                  cursor: !isActive || escalated ? "not-allowed" : "pointer",
                  textAlign: "left",
                }}
                onClick={handleEscalate}
                disabled={!isActive || escalated}
                className="click-shift"
              >
                {escalated ? "Escalated to legal" : "Escalate to legal"}
                <span>⚠</span>
              </button>
              <button
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 14px",
                  border: `1px solid ${threadLocked ? "var(--hairline)" : "rgba(193,18,31,0.25)"}`,
                  borderRadius: 8,
                  background: threadLocked
                    ? "var(--surface-3)"
                    : "rgba(193,18,31,0.04)",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: !isActive
                    ? "var(--ink-4)"
                    : threadLocked
                      ? "var(--ink)"
                      : "var(--brand-red)",
                  cursor: !isActive ? "not-allowed" : "pointer",
                  textAlign: "left",
                }}
                onClick={handleLockThread}
                disabled={!isActive}
                className="click-shift"
              >
                {threadLocked ? "Unlock thread" : "Lock thread"}
                <span>{threadLocked ? "🔓" : "🔒"}</span>
              </button>
            </div>
          </div>

          {/* Quick facts */}
          <div style={cardStyle}>
            <div style={sectionTitle}>Quick facts</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
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
                    alignItems: "center",
                    fontSize: 13,
                    fontFamily: "var(--font-body)",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--hairline)",
                  }}
                >
                  <span style={{ color: "var(--ink-4)" }}>{label}</span>
                  <strong style={{ color: "var(--ink)", fontSize: 13 }}>
                    {val}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            padding: "12px 20px",
            background: "var(--ink)",
            color: "var(--snow)",
            borderRadius: 8,
            fontSize: 13,
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            zIndex: 300,
            boxShadow: "var(--shadow-2)",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
