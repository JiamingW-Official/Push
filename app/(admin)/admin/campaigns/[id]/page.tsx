"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import "../campaigns.css";
import "./campaign-detail.css";
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
  // v11 token colors — maps to cd-status-badge--{status} CSS class
  return (
    <span className={`cd-status-badge cd-status-badge--${status}`}>
      {ADMIN_CAMPAIGN_STATUS_LABELS[status]}
    </span>
  );
}

function TierBadge({ tier }: { tier: CreatorTier }) {
  return <span className="cd-tier-badge">{TIER_LABELS[tier]}</span>;
}

function CheckIcon({ passed }: { passed: boolean }) {
  if (passed) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="none"
        stroke="var(--accent-blue)"
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
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      stroke="var(--brand-red)"
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
      <div className="cd-page">
        <div className="cd-skeleton" style={{ height: 200, marginTop: 80 }} />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="cd-page">
        <Link href="/admin/campaigns" className="cd-back">
          ← All Campaigns
        </Link>
        <div
          style={{ marginTop: 40, textAlign: "center", padding: "48px 20px" }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 700,
              color: "var(--ink)",
            }}
          >
            Campaign not found
          </div>
          <div className="cd-empty" style={{ marginTop: 4 }}>
            No campaign matches ID: {id}
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

  // Budget remaining % — triggers danger color below 20%
  const budgetRemaining = campaign.budget_cap - campaign.spend_total;
  const budgetRemainingPct =
    campaign.budget_cap > 0
      ? Math.round((budgetRemaining / campaign.budget_cap) * 100)
      : 100;

  return (
    <div className="cd-page">
      {/* Back link */}
      <Link href="/admin/campaigns" className="cd-back">
        ← All Campaigns
      </Link>

      {/* ── Campaign Header ─────────────────────────────────────── */}
      <header className="cd-header">
        {/* v11 product eyebrow: parenthetical mono */}
        <p className="cd-eyebrow">(CAMPAIGN·REVIEW)</p>

        {/* Badge row */}
        <div className="cd-header__meta">
          <StatusBadge status={campaign.admin_status} />
          <TierBadge tier={campaign.tier_required} />
          {campaign.flags.length > 0 && (
            <span className="cd-flag-chip">
              {campaign.flags.length} flag
              {campaign.flags.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* H1 — clamp(40px,5vw,72px) Darky 800 */}
        <h1 className="cd-title">{campaign.title}</h1>
        <p className="cd-merchant">
          {campaign.business_name} — {campaign.business_address}
        </p>
      </header>

      {/* ── KPI Strip — 4 tiles ─────────────────────────────────── */}
      <div className="cd-kpi-strip">
        <div className="cd-kpi-tile">
          <div className="cd-kpi-tile__label">Budget Cap</div>
          <div className="cd-kpi-tile__num">${campaign.budget_cap}</div>
        </div>
        <div className="cd-kpi-tile">
          <div className="cd-kpi-tile__label">Spent</div>
          <div className="cd-kpi-tile__num">${campaign.spend_total}</div>
          <div className="cd-kpi-tile__sub">{spendPct}% of cap</div>
        </div>
        <div className="cd-kpi-tile">
          <div className="cd-kpi-tile__label">Creators</div>
          <div className="cd-kpi-tile__num">{campaign.applicants.length}</div>
          <div className="cd-kpi-tile__sub">
            {campaign.spots_remaining} spots left
          </div>
        </div>
        <div className="cd-kpi-tile">
          <div className="cd-kpi-tile__label">Redemptions</div>
          <div className="cd-kpi-tile__num">
            {campaign.verified_visits.length}
          </div>
          <div
            className={`cd-kpi-tile__num${budgetRemainingPct < 20 ? " cd-kpi-tile__num--danger" : ""}`}
            style={{
              fontSize: 14,
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              marginTop: 4,
            }}
          >
            ${budgetRemaining} remaining
          </div>
        </div>
      </div>

      {/* ── Two-column grid: 4+8 ────────────────────────────────── */}
      <div className="cd-grid">
        {/* ── LEFT: campaign meta + review summary ── */}
        <div className="cd-col-left">
          {/* Campaign Spec */}
          <div className="cd-card">
            <h2 className="cd-card__title">Campaign Spec</h2>
            <div className="cd-spec-grid">
              <div className="cd-spec-item cd-spec-item--full">
                <div className="cd-spec-label">Description</div>
                <div className="cd-spec-value cd-spec-value--muted">
                  {campaign.description}
                </div>
              </div>
              {[
                { label: "Category", val: campaign.category },
                {
                  label: "Payout",
                  val:
                    campaign.payout === 0
                      ? "Product / Trade"
                      : `$${campaign.payout}`,
                },
                {
                  label: "Spots",
                  val: `${campaign.spots_remaining} / ${campaign.spots_total}`,
                },
                { label: "Deadline", val: formatDate(campaign.deadline) },
                {
                  label: "Difficulty",
                  val: `${campaign.difficulty} (${campaign.difficulty_multiplier}x)`,
                },
                {
                  label: "Commission",
                  val: campaign.commission_enabled ? "Enabled" : "Disabled",
                },
                { label: "Created", val: formatDate(campaign.created_at) },
              ].map(({ label, val }) => (
                <div className="cd-spec-item" key={label}>
                  <div className="cd-spec-label">{label}</div>
                  <div className="cd-spec-value">{val}</div>
                </div>
              ))}
              {campaign.requirements.length > 0 && (
                <div className="cd-spec-item cd-spec-item--full">
                  <div className="cd-spec-label">Requirements</div>
                  <ul className="cd-req-list">
                    {campaign.requirements.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Review Summary */}
          <div className="cd-card">
            <h2 className="cd-card__title">Review Summary</h2>
            <div className="cd-summary-list">
              <div>
                <div className="cd-spec-label">Current Status</div>
                <StatusBadge status={campaign.admin_status} />
              </div>
              {campaign.review_submitted_at && (
                <div>
                  <div className="cd-spec-label">Submitted</div>
                  <div className="cd-spec-value" style={{ fontSize: 13 }}>
                    {formatDateTime(campaign.review_submitted_at)}
                  </div>
                </div>
              )}
              {campaign.reviewed_at && (
                <div>
                  <div className="cd-spec-label">Last Reviewed</div>
                  <div className="cd-spec-value" style={{ fontSize: 13 }}>
                    {formatDateTime(campaign.reviewed_at)}
                  </div>
                </div>
              )}
              {campaign.reviewed_by && (
                <div>
                  <div className="cd-spec-label">Reviewed By</div>
                  <div className="cd-spec-value" style={{ fontSize: 13 }}>
                    {campaign.reviewed_by}
                  </div>
                </div>
              )}
              <div>
                <div className="cd-spec-label">Checklist</div>
                <span
                  className={`cd-pass-count ${allChecksPass ? "cd-pass-count--ok" : "cd-pass-count--fail"}`}
                >
                  {allChecksPass
                    ? "All checks passed"
                    : `${checksTotal - checksPass} check${checksTotal - checksPass !== 1 ? "s" : ""} failed`}
                </span>
              </div>
              <div>
                <div className="cd-spec-label">Active Flags</div>
                <span
                  className={`cd-pass-count ${campaign.flags.length > 0 ? "cd-pass-count--fail" : ""}`}
                  style={
                    campaign.flags.length === 0
                      ? { color: "var(--ink-4)" }
                      : undefined
                  }
                >
                  {campaign.flags.length === 0
                    ? "None"
                    : `${campaign.flags.length} flag${campaign.flags.length !== 1 ? "s" : ""}`}
                </span>
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="cd-card">
            <h2 className="cd-card__title">Admin Actions</h2>
            <div className="cd-actions">
              {(campaign.admin_status === "pending" ||
                campaign.admin_status === "flagged") && (
                <button
                  className="cd-btn-approve"
                  onClick={() => sendDecision("approve", "Approved by admin.")}
                  disabled={actionLoading}
                >
                  Approve Campaign
                </button>
              )}
              {campaign.admin_status === "active" && (
                <button
                  className="cd-btn-ghost"
                  onClick={() =>
                    sendDecision("suspend", "Campaign suspended by admin.")
                  }
                  disabled={actionLoading}
                >
                  Pause Campaign
                </button>
              )}
              {campaign.admin_status !== "flagged" && (
                <button
                  className="cd-btn-reject"
                  onClick={() =>
                    sendDecision(
                      "flag",
                      "Flagged by admin for review.",
                      "Manual flag raised during admin review.",
                    )
                  }
                  disabled={actionLoading}
                >
                  Reject / Flag
                </button>
              )}
              {campaign.admin_status === "pending" && (
                <button
                  className="cd-btn-secondary"
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
              {campaign.spend_total > 0 && (
                <button
                  className="cd-btn-danger"
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
          </div>
        </div>

        {/* ── RIGHT: content list + stats ── */}
        <div className="cd-col-right">
          {/* Liquid Glass "Performance" summary tile — ≤1 per page */}
          <div className="cd-perf-tile">
            <div className="cd-perf-tile__eyebrow">(PERFORMANCE)</div>
            <div className="cd-perf-tile__grid">
              <div className="cd-perf-metric">
                <div className="cd-perf-metric__num">{spendPct}%</div>
                <div className="cd-perf-metric__label">Budget Used</div>
              </div>
              <div className="cd-perf-metric">
                <div className="cd-perf-metric__num">
                  {campaign.verified_visits.length}
                </div>
                <div className="cd-perf-metric__label">Verified Visits</div>
              </div>
              <div className="cd-perf-metric">
                <div className="cd-perf-metric__num">
                  {campaign.applicants.length}
                </div>
                <div className="cd-perf-metric__label">Applicants</div>
              </div>
              <div className="cd-perf-metric">
                <div className="cd-perf-metric__num">
                  {campaign.dispute_ids.length}
                </div>
                <div className="cd-perf-metric__label">Disputes</div>
              </div>
            </div>
          </div>

          {/* Approval Checklist */}
          <div className="cd-card">
            <div className="cd-card__title-row">
              <h2 className="cd-card__title">Approval Checklist</h2>
              <span
                className={`cd-pass-count ${allChecksPass ? "cd-pass-count--ok" : "cd-pass-count--fail"}`}
              >
                {checksPass}/{checksTotal} passed
              </span>
            </div>
            <div className="cd-checklist">
              {campaign.approval_checklist.map((item) => (
                <div className="cd-check" key={item.id}>
                  <div className="cd-check__icon">
                    <CheckIcon passed={item.passed} />
                  </div>
                  <div>
                    <div className="cd-check__label">{item.label}</div>
                    {!item.passed && item.note && (
                      <div className="cd-check__note">{item.note}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Applicants — chip rows */}
          <div className="cd-card">
            <h2 className="cd-card__title">
              Applicants ({campaign.applicants.length})
            </h2>
            {campaign.applicants.length === 0 ? (
              <p className="cd-empty">No applicants yet.</p>
            ) : (
              <div className="cd-applicant-list">
                {campaign.applicants.map((app) => {
                  const isDone = DONE_MILESTONES.includes(app.milestone);
                  const isAction = ACTION_MILESTONES.includes(app.milestone);
                  const msClass = isDone
                    ? "cd-milestone-tag cd-milestone-tag--done"
                    : isAction
                      ? "cd-milestone-tag cd-milestone-tag--action"
                      : "cd-milestone-tag";
                  // Initials for avatar
                  const initials = app.creator_name
                    .split(" ")
                    .map((w: string) => w[0])
                    .join("")
                    .slice(0, 2);
                  return (
                    <div className="cd-applicant-row" key={app.id}>
                      {/* Chip: avatar + name */}
                      <div className="cd-applicant-chip">
                        <div className="cd-avatar">{initials}</div>
                        <div>
                          <div className="cd-applicant-name">
                            {app.creator_name}
                          </div>
                          <div className="cd-applicant-handle">
                            {app.creator_handle}
                          </div>
                          <div className="cd-applicant-meta">
                            {app.creator_followers.toLocaleString()} followers ·
                            Score {app.creator_score}
                          </div>
                        </div>
                      </div>
                      <TierBadge tier={app.creator_tier} />
                      <span className={msClass}>
                        {MILESTONE_LABELS[app.milestone] ?? app.milestone}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Verified Visit Log */}
          <div className="cd-card">
            <h2 className="cd-card__title">
              Verified Visit Log ({campaign.verified_visits.length})
            </h2>
            {campaign.verified_visits.length === 0 ? (
              <p className="cd-empty">No verified visits recorded.</p>
            ) : (
              <div className="cd-row-list">
                {campaign.verified_visits.map((v) => (
                  <div className="cd-row" key={v.id}>
                    <div>
                      <div className="cd-row__primary">{v.creator_name}</div>
                      <div className="cd-row__secondary">{v.qr_code}</div>
                    </div>
                    <div className="cd-row__right">
                      <div className="cd-row__time">
                        {formatDateTime(v.scanned_at)}
                      </div>
                      {v.verified && (
                        <span className="cd-verified-tag">Verified</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Spend vs Budget */}
          <div className="cd-card">
            <h2 className="cd-card__title">Spend vs Budget</h2>
            <div className="cd-spend-numerals">
              <div>
                <div className="cd-spec-label">Spent to Date</div>
                <div className="cd-spend-num">${campaign.spend_total}</div>
              </div>
              <div>
                <div className="cd-spec-label">Budget Cap</div>
                <div className="cd-spend-num">${campaign.budget_cap}</div>
              </div>
            </div>
            <div className="cd-spend-bar-wrap">
              <div className="cd-spend-bar">
                <div
                  className={`cd-spend-bar__fill${spendPct >= 100 ? " cd-spend-bar__fill--over" : ""}`}
                  style={{ width: `${spendPct}%` }}
                />
              </div>
            </div>
            <div className="cd-spend-labels">
              <span>{spendPct}% used</span>
              <span
                style={
                  budgetRemainingPct < 20
                    ? { color: "var(--brand-red)", fontWeight: 700 }
                    : undefined
                }
              >
                ${budgetRemaining} remaining
              </span>
            </div>
          </div>

          {/* Flags */}
          {campaign.flags.length > 0 && (
            <div className="cd-card">
              <h2 className="cd-card__title">
                Active Flags ({campaign.flags.length})
              </h2>
              <div className="cd-flag-list">
                {campaign.flags.map((flag) => (
                  <div
                    className={`cd-flag${flag.severity === "medium" ? " cd-flag--medium" : flag.severity === "low" ? " cd-flag--low" : ""}`}
                    key={flag.id}
                  >
                    <div className="cd-flag__header">
                      <span className="cd-flag__type">{flag.type}</span>
                      <span className="cd-flag__severity">{flag.severity}</span>
                    </div>
                    <div className="cd-flag__desc">{flag.description}</div>
                    <div className="cd-flag__meta">
                      Raised by {flag.raised_by} ·{" "}
                      {formatDateTime(flag.raised_at)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Linked Disputes */}
          {campaign.dispute_ids.length > 0 && (
            <div className="cd-card">
              <h2 className="cd-card__title">Linked Disputes</h2>
              <div className="cd-dispute-list">
                {campaign.dispute_ids.map((d) => (
                  <div className="cd-dispute-item" key={d}>
                    #{d}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Internal Notes */}
          <div className="cd-card">
            <h2 className="cd-card__title">Internal Notes</h2>
            {campaign.internal_notes.length > 0 ? (
              <div className="cd-notes-list">
                {campaign.internal_notes.map((note) => (
                  <div className="cd-note" key={note.id}>
                    <div className="cd-note__author">{note.author}</div>
                    <div className="cd-note__body">{note.body}</div>
                    <div className="cd-note__time">
                      {formatDateTime(note.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="cd-empty">No notes yet.</p>
            )}
            <div className="cd-note-form">
              <textarea
                className="cd-note-textarea"
                placeholder="Add internal note…"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                aria-label="Internal note"
              />
              <button
                className="cd-btn-ghost"
                onClick={addNote}
                disabled={!noteInput.trim() || actionLoading}
                style={{
                  alignSelf: "flex-start",
                  width: "auto",
                  padding: "10px 20px",
                }}
              >
                {actionLoading ? "Saving…" : "Save Note"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`cd-toast${toast.type === "err" ? " cd-toast--err" : ""}`}
          role="status"
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
