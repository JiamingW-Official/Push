"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import "../campaigns.css";
import {
  getAdminCampaignById,
  ADMIN_CAMPAIGN_STATUS_LABELS,
  type AdminCampaign,
  type AdminCampaignStatus,
  type AdminNote,
} from "@/lib/admin/mock-campaigns";
import { TIER_LABELS, type CreatorTier } from "@/lib/demo-data";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: AdminCampaignStatus }) {
  return (
    <span className={`adm-badge adm-badge--${status}`}>
      {ADMIN_CAMPAIGN_STATUS_LABELS[status]}
    </span>
  );
}

function TierBadge({ tier }: { tier: CreatorTier }) {
  return (
    <span className={`adm-tier adm-tier--${tier}`}>{TIER_LABELS[tier]}</span>
  );
}

function CheckIcon({ passed }: { passed: boolean }) {
  if (passed) {
    return (
      <svg
        className="adm-check__icon adm-check__icon--pass"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="10" cy="10" r="8" />
        <path d="M6.5 10l2.5 2.5 4.5-4.5" />
      </svg>
    );
  }
  return (
    <svg
      className="adm-check__icon adm-check__icon--fail"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="10" cy="10" r="8" />
      <path d="M7 7l6 6M13 7l-6 6" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main detail page
// ---------------------------------------------------------------------------

export default function AdminCampaignDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [campaign, setCampaign] = useState<AdminCampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [toast, setToast] = useState<{
    msg: string;
    type: "ok" | "err";
  } | null>(null);

  // Load from mock directly
  useEffect(() => {
    if (!id) return;
    const c = getAdminCampaignById(id);
    setCampaign(c ?? null);
    setLoading(false);
  }, [id]);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ---------------------------------------------------------------------------
  // Admin actions
  // ---------------------------------------------------------------------------

  async function sendDecision(
    action: "approve" | "request_changes" | "flag" | "suspend" | "force_refund",
    note?: string,
    flagDesc?: string,
  ) {
    if (!campaign) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/campaigns/${campaign.id}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          note,
          flag_type: "compliance",
          flag_description: flagDesc,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();

      // Apply optimistic update to local state
      setCampaign((prev) => {
        if (!prev) return prev;
        const updated: AdminCampaign = {
          ...prev,
          admin_status: data.new_status as AdminCampaignStatus,
          status: data.new_status as AdminCampaignStatus,
        };
        if (note) {
          updated.internal_notes = [
            ...prev.internal_notes,
            {
              id: `note-local-${Date.now()}`,
              author: "admin@push.nyc",
              body: note,
              created_at: new Date().toISOString(),
            } satisfies AdminNote,
          ];
        }
        return updated;
      });

      const labels: Record<typeof action, string> = {
        approve: "Campaign approved and set to Active",
        request_changes: "Change request sent to merchant",
        flag: "Campaign flagged",
        suspend: "Campaign suspended",
        force_refund: "Force refund initiated",
      };
      showToast(labels[action]);
    } catch {
      showToast("Action failed — try again", "err");
    } finally {
      setActionLoading(false);
    }
  }

  async function addNote() {
    const body = noteInput.trim();
    if (!body || !campaign) return;
    setActionLoading(true);
    try {
      await fetch(`/api/admin/campaigns/${campaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internal_notes: [
            ...campaign.internal_notes,
            {
              id: `note-local-${Date.now()}`,
              author: "admin@push.nyc",
              body,
              created_at: new Date().toISOString(),
            },
          ],
        }),
      });
      setCampaign((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          internal_notes: [
            ...prev.internal_notes,
            {
              id: `note-local-${Date.now()}`,
              author: "admin@push.nyc",
              body,
              created_at: new Date().toISOString(),
            },
          ],
        };
      });
      setNoteInput("");
      showToast("Note saved");
    } catch {
      showToast("Failed to save note", "err");
    } finally {
      setActionLoading(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatDateTime(iso: string) {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const MILESTONE_LABELS: Record<string, string> = {
    accepted: "Accepted",
    scheduled: "Scheduled",
    visited: "Visited",
    proof_submitted: "Proof Submitted",
    content_published: "Published",
    verified: "Verified",
    settled: "Settled",
  };

  const DONE_MILESTONES = ["verified", "settled"];
  const ACTION_MILESTONES = ["proof_submitted"];

  // ---------------------------------------------------------------------------
  // Loading / not found
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="adm-shell">
        <nav className="adm-nav">
          <Link href="/" className="adm-nav__logo">
            Push<span>.</span>
          </Link>
          <span className="adm-nav__badge">Admin</span>
        </nav>
        <div className="adm-detail-body">
          <div className="skeleton" style={{ height: 200, marginTop: 80 }} />
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="adm-shell">
        <nav className="adm-nav">
          <Link href="/" className="adm-nav__logo">
            Push<span>.</span>
          </Link>
          <span className="adm-nav__badge">Admin</span>
        </nav>
        <div className="adm-detail-body">
          <Link href="/admin/campaigns" className="adm-back">
            ← All Campaigns
          </Link>
          <div className="adm-empty" style={{ marginTop: 40 }}>
            <div className="adm-empty__title">Campaign not found</div>
            <div className="adm-empty__sub">No campaign matches ID: {id}</div>
          </div>
        </div>
      </div>
    );
  }

  const spendPct = Math.min(
    100,
    campaign.budget_cap > 0
      ? Math.round((campaign.spend_total / campaign.budget_cap) * 100)
      : 0,
  );
  const checksPass = campaign.approval_checklist.filter((c) => c.passed).length;
  const checksTotal = campaign.approval_checklist.length;
  const allChecksPass = checksPass === checksTotal;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="adm-shell">
      {/* Nav */}
      <nav className="adm-nav">
        <Link href="/" className="adm-nav__logo">
          Push<span>.</span>
        </Link>
        <span className="adm-nav__badge">Admin</span>
        <div className="adm-nav__spacer" />
        <Link href="/admin/campaigns" className="adm-nav__link">
          Campaigns
        </Link>
      </nav>

      <div className="adm-detail-body">
        {/* Back link */}
        <Link href="/admin/campaigns" className="adm-back">
          ← All Campaigns
        </Link>

        {/* Detail Hero */}
        <div className="adm-detail-hero">
          <div className="adm-detail-hero__meta">
            <StatusBadge status={campaign.admin_status} />
            <TierBadge tier={campaign.tier_required} />
            {campaign.flags.length > 0 && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "var(--primary)",
                }}
              >
                {campaign.flags.length} flag
                {campaign.flags.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <h1 className="adm-detail-hero__title">{campaign.title}</h1>
          <div className="adm-detail-hero__merchant">
            {campaign.business_name} — {campaign.business_address}
          </div>
        </div>

        {/* Main grid */}
        <div className="adm-detail-grid">
          {/* LEFT: main content */}
          <div className="adm-detail-main">
            {/* Campaign spec */}
            <section className="adm-card">
              <div className="adm-card__title">Campaign Spec</div>
              <div className="adm-spec-grid">
                <div className="adm-spec-item adm-spec-item--full">
                  <div className="adm-spec-label">Description</div>
                  <div className="adm-spec-value adm-spec-value--muted">
                    {campaign.description}
                  </div>
                </div>

                <div className="adm-spec-item">
                  <div className="adm-spec-label">Category</div>
                  <div className="adm-spec-value">{campaign.category}</div>
                </div>

                <div className="adm-spec-item">
                  <div className="adm-spec-label">Payout</div>
                  <div className="adm-spec-value">
                    {campaign.payout === 0
                      ? "Product / Trade"
                      : `$${campaign.payout}`}
                  </div>
                </div>

                <div className="adm-spec-item">
                  <div className="adm-spec-label">Spots</div>
                  <div className="adm-spec-value">
                    {campaign.spots_remaining} / {campaign.spots_total}{" "}
                    remaining
                  </div>
                </div>

                <div className="adm-spec-item">
                  <div className="adm-spec-label">Deadline</div>
                  <div className="adm-spec-value">
                    {formatDate(campaign.deadline)}
                  </div>
                </div>

                <div className="adm-spec-item">
                  <div className="adm-spec-label">Difficulty</div>
                  <div
                    className="adm-spec-value"
                    style={{ textTransform: "capitalize" }}
                  >
                    {campaign.difficulty} ({campaign.difficulty_multiplier}x)
                  </div>
                </div>

                <div className="adm-spec-item">
                  <div className="adm-spec-label">Commission</div>
                  <div className="adm-spec-value">
                    {campaign.commission_enabled ? "Enabled" : "Disabled"}
                  </div>
                </div>

                <div className="adm-spec-item">
                  <div className="adm-spec-label">Created</div>
                  <div className="adm-spec-value">
                    {formatDate(campaign.created_at)}
                  </div>
                </div>

                {campaign.requirements.length > 0 && (
                  <div className="adm-spec-item adm-spec-item--full">
                    <div className="adm-spec-label">Requirements</div>
                    <ul className="adm-req-list" style={{ marginTop: 8 }}>
                      {campaign.requirements.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            {/* Approval checklist */}
            <section className="adm-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div className="adm-card__title" style={{ marginBottom: 0 }}>
                  Approval Checklist
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: allChecksPass ? "var(--tertiary)" : "var(--primary)",
                  }}
                >
                  {checksPass}/{checksTotal} passed
                </span>
              </div>
              <div className="adm-checklist">
                {campaign.approval_checklist.map((item) => (
                  <div key={item.id} className="adm-check">
                    <CheckIcon passed={item.passed} />
                    <div className="adm-check__body">
                      <div className="adm-check__label">{item.label}</div>
                      {!item.passed && item.note && (
                        <div className="adm-check__note">{item.note}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Flags */}
            {campaign.flags.length > 0 && (
              <section className="adm-card">
                <div className="adm-card__title">
                  Active Flags ({campaign.flags.length})
                </div>
                <div className="adm-flag-list">
                  {campaign.flags.map((flag) => (
                    <div
                      key={flag.id}
                      className={`adm-flag adm-flag--${flag.severity}`}
                    >
                      <div className="adm-flag__header">
                        <span className="adm-flag__type">{flag.type}</span>
                        <span className="adm-flag__severity">
                          {flag.severity}
                        </span>
                      </div>
                      <div className="adm-flag__desc">{flag.description}</div>
                      <div className="adm-flag__meta">
                        Raised by {flag.raised_by} ·{" "}
                        {formatDateTime(flag.raised_at)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Applicants */}
            <section className="adm-card">
              <div className="adm-card__title">
                Applicants ({campaign.applicants.length})
              </div>
              {campaign.applicants.length === 0 ? (
                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(0,48,73,0.4)",
                    padding: "16px 0",
                  }}
                >
                  No applicants yet.
                </div>
              ) : (
                <div className="adm-applicant-list">
                  {campaign.applicants.map((app) => {
                    const isDone = DONE_MILESTONES.includes(app.milestone);
                    const isAction = ACTION_MILESTONES.includes(app.milestone);
                    return (
                      <div key={app.id} className="adm-applicant">
                        <div>
                          <div className="adm-applicant__name">
                            {app.creator_name}
                          </div>
                          <div className="adm-applicant__handle">
                            {app.creator_handle}
                          </div>
                          <div className="adm-applicant__meta">
                            {app.creator_followers.toLocaleString()} followers ·
                            Score {app.creator_score}
                          </div>
                        </div>
                        <TierBadge tier={app.creator_tier} />
                        <span
                          className={[
                            "adm-milestone-tag",
                            isDone ? "adm-milestone-tag--done" : "",
                            isAction ? "adm-milestone-tag--action" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {MILESTONE_LABELS[app.milestone] ?? app.milestone}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Verified visit log */}
            <section className="adm-card">
              <div className="adm-card__title">
                Verified Visit Log ({campaign.verified_visits.length})
              </div>
              {campaign.verified_visits.length === 0 ? (
                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(0,48,73,0.4)",
                    padding: "16px 0",
                  }}
                >
                  No verified visits recorded.
                </div>
              ) : (
                <div className="adm-visit-list">
                  {campaign.verified_visits.map((v) => (
                    <div key={v.id} className="adm-visit">
                      <div>
                        <div className="adm-visit__creator">
                          {v.creator_name}
                        </div>
                        <div className="adm-visit__code">{v.qr_code}</div>
                      </div>
                      <div>
                        <div className="adm-visit__time">
                          {formatDateTime(v.scanned_at)}
                        </div>
                        {v.verified && (
                          <div className="adm-visit__verified">Verified</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Spend tracking */}
            <section className="adm-card">
              <div className="adm-card__title">Spend vs Budget</div>
              <div className="adm-spec-grid" style={{ marginBottom: 16 }}>
                <div className="adm-spec-item">
                  <div className="adm-spec-label">Spent to Date</div>
                  <div className="adm-spec-value">${campaign.spend_total}</div>
                </div>
                <div className="adm-spec-item">
                  <div className="adm-spec-label">Budget Cap</div>
                  <div className="adm-spec-value">${campaign.budget_cap}</div>
                </div>
              </div>
              <div className="adm-spend-bar-wrap">
                <div className="adm-spend-bar">
                  <div
                    className={`adm-spend-bar__fill${spendPct >= 100 ? " adm-spend-bar__fill--over" : ""}`}
                    style={{ width: `${spendPct}%` }}
                  />
                </div>
                <div className="adm-spend-labels">
                  <span>{spendPct}% used</span>
                  <span>
                    ${campaign.budget_cap - campaign.spend_total} remaining
                  </span>
                </div>
              </div>
            </section>

            {/* Linked disputes */}
            {campaign.dispute_ids.length > 0 && (
              <section className="adm-card">
                <div className="adm-card__title">Linked Disputes</div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {campaign.dispute_ids.map((d) => (
                    <div
                      key={d}
                      style={{
                        fontFamily: "CS Genio Mono, monospace",
                        fontSize: 13,
                        color: "var(--primary)",
                        fontWeight: 600,
                        padding: "8px 0",
                        borderBottom: "1px solid rgba(0,48,73,0.07)",
                      }}
                    >
                      #{d}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Internal notes */}
            <section className="adm-card">
              <div className="adm-card__title">Internal Notes</div>
              {campaign.internal_notes.length > 0 ? (
                <div className="adm-notes-list">
                  {campaign.internal_notes.map((note) => (
                    <div key={note.id} className="adm-note">
                      <div className="adm-note__author">{note.author}</div>
                      <div className="adm-note__body">{note.body}</div>
                      <div className="adm-note__time">
                        {formatDateTime(note.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    fontSize: 13,
                    color: "rgba(0,48,73,0.4)",
                    padding: "8px 0 12px",
                  }}
                >
                  No notes yet.
                </div>
              )}

              {/* Add note */}
              <div className="adm-note-form">
                <textarea
                  placeholder="Add internal note…"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  aria-label="Internal note"
                />
                <button
                  className="adm-btn adm-btn--ghost"
                  onClick={addNote}
                  disabled={!noteInput.trim() || actionLoading}
                  style={{ width: "auto", alignSelf: "flex-start" }}
                >
                  {actionLoading ? "Saving…" : "Save Note"}
                </button>
              </div>
            </section>
          </div>

          {/* RIGHT: sidebar — admin actions + review summary */}
          <div className="adm-detail-sidebar">
            {/* Admin actions */}
            <section className="adm-card">
              <div className="adm-card__title">Admin Actions</div>
              <div className="adm-actions-stack">
                {(campaign.admin_status === "pending" ||
                  campaign.admin_status === "flagged") && (
                  <button
                    className="adm-btn adm-btn--approve"
                    onClick={() =>
                      sendDecision("approve", "Approved by admin.")
                    }
                    disabled={actionLoading}
                  >
                    Approve Campaign
                  </button>
                )}

                {campaign.admin_status === "pending" && (
                  <button
                    className="adm-btn adm-btn--ghost"
                    onClick={() =>
                      sendDecision(
                        "request_changes",
                        "Admin requested changes before approval.",
                      )
                    }
                    disabled={actionLoading}
                  >
                    Request Changes
                  </button>
                )}

                {campaign.admin_status !== "flagged" && (
                  <button
                    className="adm-btn adm-btn--flag"
                    onClick={() =>
                      sendDecision(
                        "flag",
                        "Flagged by admin for review.",
                        "Manual flag raised during admin review.",
                      )
                    }
                    disabled={actionLoading}
                  >
                    Flag Campaign
                  </button>
                )}

                {campaign.admin_status === "active" && (
                  <button
                    className="adm-btn adm-btn--ghost"
                    onClick={() =>
                      sendDecision("suspend", "Campaign suspended by admin.")
                    }
                    disabled={actionLoading}
                  >
                    Suspend Campaign
                  </button>
                )}

                {campaign.spend_total > 0 && (
                  <button
                    className="adm-btn adm-btn--danger"
                    onClick={() => {
                      if (
                        confirm(
                          "Force refund will zero out spend and initiate merchant refund. Continue?",
                        )
                      ) {
                        sendDecision(
                          "force_refund",
                          "Force refund initiated by admin.",
                        );
                      }
                    }}
                    disabled={actionLoading}
                  >
                    Force Refund
                  </button>
                )}
              </div>
            </section>

            {/* Review summary */}
            <section className="adm-card">
              <div className="adm-card__title">Review Summary</div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div className="adm-spec-item">
                  <div className="adm-spec-label">Current Status</div>
                  <StatusBadge status={campaign.admin_status} />
                </div>

                {campaign.review_submitted_at && (
                  <div className="adm-spec-item">
                    <div className="adm-spec-label">Submitted</div>
                    <div className="adm-spec-value" style={{ fontSize: 13 }}>
                      {formatDateTime(campaign.review_submitted_at)}
                    </div>
                  </div>
                )}

                {campaign.reviewed_at && (
                  <div className="adm-spec-item">
                    <div className="adm-spec-label">Last Reviewed</div>
                    <div className="adm-spec-value" style={{ fontSize: 13 }}>
                      {formatDateTime(campaign.reviewed_at)}
                    </div>
                  </div>
                )}

                {campaign.reviewed_by && (
                  <div className="adm-spec-item">
                    <div className="adm-spec-label">Reviewed By</div>
                    <div className="adm-spec-value" style={{ fontSize: 13 }}>
                      {campaign.reviewed_by}
                    </div>
                  </div>
                )}

                <div className="adm-spec-item">
                  <div className="adm-spec-label">Checklist</div>
                  <div
                    className="adm-spec-value"
                    style={{
                      fontSize: 13,
                      color: allChecksPass
                        ? "var(--tertiary)"
                        : "var(--primary)",
                    }}
                  >
                    {allChecksPass
                      ? "All checks passed"
                      : `${checksTotal - checksPass} check${checksTotal - checksPass !== 1 ? "s" : ""} failed`}
                  </div>
                </div>

                <div className="adm-spec-item">
                  <div className="adm-spec-label">Active Flags</div>
                  <div
                    className="adm-spec-value"
                    style={{
                      fontSize: 13,
                      color:
                        campaign.flags.length > 0
                          ? "var(--primary)"
                          : "var(--graphite)",
                    }}
                  >
                    {campaign.flags.length === 0
                      ? "None"
                      : `${campaign.flags.length} flag${campaign.flags.length !== 1 ? "s" : ""}`}
                  </div>
                </div>
              </div>
            </section>

            {/* Quick stats */}
            <section className="adm-card">
              <div className="adm-card__title">Campaign Stats</div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {[
                  {
                    label: "Applicants",
                    value: campaign.applicants.length,
                  },
                  {
                    label: "Verified Visits",
                    value: campaign.verified_visits.length,
                  },
                  {
                    label: "Spend",
                    value: `$${campaign.spend_total}`,
                  },
                  {
                    label: "Budget Cap",
                    value: `$${campaign.budget_cap}`,
                  },
                  {
                    label: "Disputes",
                    value: campaign.dispute_ids.length || "None",
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 13,
                      paddingBottom: 10,
                      borderBottom: "1px solid rgba(0,48,73,0.07)",
                    }}
                  >
                    <span
                      style={{ color: "rgba(0,48,73,0.5)", fontWeight: 600 }}
                    >
                      {label}
                    </span>
                    <span style={{ fontWeight: 700, color: "var(--dark)" }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`adm-toast${toast.type === "err" ? " adm-toast--error" : ""}`}
          role="status"
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
