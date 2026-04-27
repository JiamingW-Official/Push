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
  const styles: Record<AdminCampaignStatus, { bg: string; color: string }> = {
    active: { bg: "rgba(0,133,255,0.10)", color: "var(--accent-blue)" },
    pending: { bg: "var(--panel-butter)", color: "var(--ink-3)" },
    flagged: { bg: "rgba(193,18,31,0.10)", color: "var(--brand-red)" },
    paused: { bg: "var(--surface-3)", color: "var(--ink-4)" },
    completed: { bg: "var(--surface-3)", color: "var(--ink-4)" },
    draft: { bg: "var(--surface-3)", color: "var(--ink-4)" },
  };
  const s = styles[status] ?? { bg: "var(--surface-3)", color: "var(--ink-4)" };
  return (
    <span
      style={{
        fontFamily: "var(--font-body)",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        borderRadius: 4,
        padding: "2px 7px",
        background: s.bg,
        color: s.color,
        display: "inline-block",
      }}
    >
      {ADMIN_CAMPAIGN_STATUS_LABELS[status]}
    </span>
  );
}

function TierBadge({ tier }: { tier: CreatorTier }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-body)",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        borderRadius: 4,
        padding: "2px 6px",
        background: "var(--surface-3)",
        color: "var(--ink-4)",
        display: "inline-block",
      }}
    >
      {TIER_LABELS[tier]}
    </span>
  );
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

// Shared card style
const cardStyle: React.CSSProperties = {
  background: "var(--surface-2)",
  border: "1px solid var(--hairline)",
  borderRadius: 10,
  padding: "20px 24px",
  marginBottom: 16,
};

const cardTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: "var(--ink-4)",
  marginBottom: 16,
};

const specLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: "var(--ink-4)",
  marginBottom: 3,
};

const specValueStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 14,
  color: "var(--ink)",
  fontWeight: 500,
};

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
      <div style={{ fontFamily: "var(--font-body)", color: "var(--ink)" }}>
        <div
          style={{
            height: 200,
            marginTop: 80,
            background: "var(--surface-3)",
            borderRadius: 10,
          }}
        />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div style={{ fontFamily: "var(--font-body)", color: "var(--ink)" }}>
        <Link
          href="/admin/campaigns"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--ink-4)",
            textDecoration: "none",
          }}
        >
          ← All Campaigns
        </Link>
        <div
          style={{
            marginTop: 40,
            textAlign: "center",
            padding: "48px 20px",
          }}
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
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--ink-4)",
              marginTop: 4,
            }}
          >
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

  return (
    <div style={{ fontFamily: "var(--font-body)", color: "var(--ink)" }}>
      {/* Back link + page header */}
      <Link
        href="/admin/campaigns"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "var(--ink-4)",
          textDecoration: "none",
          display: "inline-block",
          marginBottom: 16,
        }}
      >
        ← All Campaigns
      </Link>

      {/* Detail Hero */}
      <div style={{ marginBottom: 24 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          ADMIN · PUSH INTERNAL
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
            flexWrap: "wrap",
          }}
        >
          <StatusBadge status={campaign.admin_status} />
          <TierBadge tier={campaign.tier_required} />
          {campaign.flags.length > 0 && (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "var(--brand-red)",
                background: "rgba(193,18,31,0.10)",
                borderRadius: 4,
                padding: "2px 7px",
              }}
            >
              {campaign.flags.length} flag
              {campaign.flags.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px,3vw,36px)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: "var(--ink)",
            margin: "0 0 6px",
          }}
        >
          {campaign.title}
        </h1>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--ink-4)",
          }}
        >
          {campaign.business_name} — {campaign.business_address}
        </div>
      </div>

      {/* Main grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* LEFT: main content */}
        <div>
          {/* Campaign spec */}
          <div style={cardStyle}>
            <div style={cardTitleStyle}>Campaign Spec</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px 24px",
              }}
            >
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={specLabelStyle}>Description</div>
                <div
                  style={{
                    ...specValueStyle,
                    color: "var(--ink-3)",
                    lineHeight: 1.6,
                  }}
                >
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
                  val: `${campaign.spots_remaining} / ${campaign.spots_total} remaining`,
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
                <div key={label}>
                  <div style={specLabelStyle}>{label}</div>
                  <div style={specValueStyle}>{val}</div>
                </div>
              ))}

              {campaign.requirements.length > 0 && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={specLabelStyle}>Requirements</div>
                  <ul
                    style={{
                      margin: "6px 0 0",
                      paddingLeft: 18,
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--ink-3)",
                      lineHeight: 1.7,
                    }}
                  >
                    {campaign.requirements.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Approval checklist */}
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div style={{ ...cardTitleStyle, marginBottom: 0 }}>
                Approval Checklist
              </div>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  fontWeight: 700,
                  color: allChecksPass
                    ? "var(--accent-blue)"
                    : "var(--brand-red)",
                }}
              >
                {checksPass}/{checksTotal} passed
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {campaign.approval_checklist.map((item) => (
                <div
                  key={item.id}
                  style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                >
                  <CheckIcon passed={item.passed} />
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        color: "var(--ink)",
                        fontWeight: 500,
                      }}
                    >
                      {item.label}
                    </div>
                    {!item.passed && item.note && (
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 12,
                          color: "var(--brand-red)",
                          marginTop: 2,
                        }}
                      >
                        {item.note}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flags */}
          {campaign.flags.length > 0 && (
            <div style={cardStyle}>
              <div style={cardTitleStyle}>
                Active Flags ({campaign.flags.length})
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {campaign.flags.map((flag) => {
                  const sevBg: Record<string, string> = {
                    high: "rgba(193,18,31,0.08)",
                    medium: "var(--panel-butter)",
                    low: "var(--surface-3)",
                  };
                  return (
                    <div
                      key={flag.id}
                      style={{
                        background: sevBg[flag.severity] ?? "var(--surface-3)",
                        border: "1px solid var(--hairline)",
                        borderRadius: 8,
                        padding: "12px 16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "var(--brand-red)",
                          }}
                        >
                          {flag.type}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 10,
                            fontWeight: 700,
                            color: "var(--ink-4)",
                          }}
                        >
                          {flag.severity}
                        </span>
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 13,
                          color: "var(--ink)",
                          marginBottom: 6,
                        }}
                      >
                        {flag.description}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          color: "var(--ink-4)",
                        }}
                      >
                        Raised by {flag.raised_by} ·{" "}
                        {formatDateTime(flag.raised_at)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Applicants */}
          <div style={cardStyle}>
            <div style={cardTitleStyle}>
              Applicants ({campaign.applicants.length})
            </div>
            {campaign.applicants.length === 0 ? (
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--ink-4)",
                  padding: "8px 0",
                }}
              >
                No applicants yet.
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {campaign.applicants.map((app) => {
                  const isDone = DONE_MILESTONES.includes(app.milestone);
                  const isAction = ACTION_MILESTONES.includes(app.milestone);
                  const msBg = isDone
                    ? "rgba(0,133,255,0.10)"
                    : isAction
                      ? "var(--panel-butter)"
                      : "var(--surface-3)";
                  const msColor = isDone
                    ? "var(--accent-blue)"
                    : isAction
                      ? "var(--ink-3)"
                      : "var(--ink-4)";
                  return (
                    <div
                      key={app.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 0",
                        borderBottom: "1px solid var(--hairline)",
                        gap: 12,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--ink)",
                          }}
                        >
                          {app.creator_name}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 12,
                            color: "var(--ink-4)",
                          }}
                        >
                          {app.creator_handle}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 11,
                            color: "var(--ink-4)",
                            marginTop: 2,
                          }}
                        >
                          {app.creator_followers.toLocaleString()} followers ·
                          Score {app.creator_score}
                        </div>
                      </div>
                      <TierBadge tier={app.creator_tier} />
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          background: msBg,
                          color: msColor,
                          borderRadius: 4,
                          padding: "2px 7px",
                        }}
                      >
                        {MILESTONE_LABELS[app.milestone] ?? app.milestone}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Verified visit log */}
          <div style={cardStyle}>
            <div style={cardTitleStyle}>
              Verified Visit Log ({campaign.verified_visits.length})
            </div>
            {campaign.verified_visits.length === 0 ? (
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--ink-4)",
                  padding: "8px 0",
                }}
              >
                No verified visits recorded.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {campaign.verified_visits.map((v) => (
                  <div
                    key={v.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: "1px solid var(--hairline)",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--ink)",
                        }}
                      >
                        {v.creator_name}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 11,
                          color: "var(--ink-4)",
                        }}
                      >
                        {v.qr_code}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 12,
                          color: "var(--ink-4)",
                        }}
                      >
                        {formatDateTime(v.scanned_at)}
                      </div>
                      {v.verified && (
                        <span
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            color: "var(--accent-blue)",
                          }}
                        >
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Spend tracking */}
          <div style={cardStyle}>
            <div style={cardTitleStyle}>Spend vs Budget</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <div>
                <div style={specLabelStyle}>Spent to Date</div>
                <div
                  style={{
                    ...specValueStyle,
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    fontWeight: 900,
                  }}
                >
                  ${campaign.spend_total}
                </div>
              </div>
              <div>
                <div style={specLabelStyle}>Budget Cap</div>
                <div
                  style={{
                    ...specValueStyle,
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    fontWeight: 900,
                  }}
                >
                  ${campaign.budget_cap}
                </div>
              </div>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 4,
                background: "var(--surface-3)",
                overflow: "hidden",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${spendPct}%`,
                  background:
                    spendPct >= 100 ? "var(--brand-red)" : "var(--accent-blue)",
                  borderRadius: 4,
                  transition: "width 0.3s",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-4)",
              }}
            >
              <span>{spendPct}% used</span>
              <span>
                ${campaign.budget_cap - campaign.spend_total} remaining
              </span>
            </div>
          </div>

          {/* Linked disputes */}
          {campaign.dispute_ids.length > 0 && (
            <div style={cardStyle}>
              <div style={cardTitleStyle}>Linked Disputes</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {campaign.dispute_ids.map((d) => (
                  <div
                    key={d}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--accent-blue)",
                      fontWeight: 600,
                      padding: "8px 0",
                      borderBottom: "1px solid var(--hairline)",
                    }}
                  >
                    #{d}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Internal notes */}
          <div style={cardStyle}>
            <div style={cardTitleStyle}>Internal Notes</div>
            {campaign.internal_notes.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                {campaign.internal_notes.map((note) => (
                  <div
                    key={note.id}
                    style={{
                      background: "var(--surface-3)",
                      borderRadius: 8,
                      padding: "10px 14px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--ink-4)",
                        marginBottom: 4,
                      }}
                    >
                      {note.author}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        color: "var(--ink)",
                        lineHeight: 1.6,
                      }}
                    >
                      {note.body}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color: "var(--ink-4)",
                        marginTop: 4,
                      }}
                    >
                      {formatDateTime(note.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--ink-4)",
                  marginBottom: 16,
                }}
              >
                No notes yet.
              </div>
            )}

            {/* Add note */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <textarea
                placeholder="Add internal note…"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                aria-label="Internal note"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--ink)",
                  background: "var(--surface-3)",
                  border: "1px solid var(--hairline)",
                  borderRadius: 8,
                  padding: "10px 12px",
                  resize: "vertical",
                  minHeight: 72,
                  outline: "none",
                }}
              />
              <button
                className="btn-ghost click-shift"
                onClick={addNote}
                disabled={!noteInput.trim() || actionLoading}
                style={{ alignSelf: "flex-start" }}
              >
                {actionLoading ? "Saving…" : "Save Note"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: sidebar */}
        <div>
          {/* Admin actions */}
          <div style={cardStyle}>
            <div style={cardTitleStyle}>Admin Actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(campaign.admin_status === "pending" ||
                campaign.admin_status === "flagged") && (
                <button
                  className="btn-primary click-shift"
                  onClick={() => sendDecision("approve", "Approved by admin.")}
                  disabled={actionLoading}
                >
                  Approve Campaign
                </button>
              )}

              {campaign.admin_status === "pending" && (
                <button
                  className="btn-ghost click-shift"
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
                  className="click-shift"
                  onClick={() =>
                    sendDecision(
                      "flag",
                      "Flagged by admin for review.",
                      "Manual flag raised during admin review.",
                    )
                  }
                  disabled={actionLoading}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    background: "rgba(193,18,31,0.10)",
                    color: "var(--brand-red)",
                    border: "1px solid rgba(193,18,31,0.25)",
                    borderRadius: 8,
                    padding: "10px 16px",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  Flag Campaign
                </button>
              )}

              {campaign.admin_status === "active" && (
                <button
                  className="btn-ghost click-shift"
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
                  className="click-shift"
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
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    background: "var(--brand-red)",
                    color: "var(--snow)",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 16px",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  Force Refund
                </button>
              )}
            </div>
          </div>

          {/* Review summary */}
          <div style={cardStyle}>
            <div style={cardTitleStyle}>Review Summary</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <div style={specLabelStyle}>Current Status</div>
                <StatusBadge status={campaign.admin_status} />
              </div>

              {campaign.review_submitted_at && (
                <div>
                  <div style={specLabelStyle}>Submitted</div>
                  <div style={{ ...specValueStyle, fontSize: 13 }}>
                    {formatDateTime(campaign.review_submitted_at)}
                  </div>
                </div>
              )}

              {campaign.reviewed_at && (
                <div>
                  <div style={specLabelStyle}>Last Reviewed</div>
                  <div style={{ ...specValueStyle, fontSize: 13 }}>
                    {formatDateTime(campaign.reviewed_at)}
                  </div>
                </div>
              )}

              {campaign.reviewed_by && (
                <div>
                  <div style={specLabelStyle}>Reviewed By</div>
                  <div style={{ ...specValueStyle, fontSize: 13 }}>
                    {campaign.reviewed_by}
                  </div>
                </div>
              )}

              <div>
                <div style={specLabelStyle}>Checklist</div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: allChecksPass
                      ? "var(--accent-blue)"
                      : "var(--brand-red)",
                  }}
                >
                  {allChecksPass
                    ? "All checks passed"
                    : `${checksTotal - checksPass} check${checksTotal - checksPass !== 1 ? "s" : ""} failed`}
                </div>
              </div>

              <div>
                <div style={specLabelStyle}>Active Flags</div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: 600,
                    color:
                      campaign.flags.length > 0
                        ? "var(--brand-red)"
                        : "var(--ink-4)",
                  }}
                >
                  {campaign.flags.length === 0
                    ? "None"
                    : `${campaign.flags.length} flag${campaign.flags.length !== 1 ? "s" : ""}`}
                </div>
              </div>
            </div>
          </div>

          {/* Campaign stats */}
          <div style={cardStyle}>
            <div style={cardTitleStyle}>Campaign Stats</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { label: "Applicants", value: campaign.applicants.length },
                {
                  label: "Verified Visits",
                  value: campaign.verified_visits.length,
                },
                { label: "Spend", value: `$${campaign.spend_total}` },
                { label: "Budget Cap", value: `$${campaign.budget_cap}` },
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
                    padding: "10px 0",
                    borderBottom: "1px solid var(--hairline)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      color: "var(--ink-4)",
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--ink)",
                    }}
                  >
                    {value}
                  </span>
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
            background:
              toast.type === "err" ? "var(--brand-red)" : "var(--ink)",
            color: "var(--snow)",
            fontFamily: "var(--font-body)",
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 8,
            padding: "10px 20px",
            zIndex: 9999,
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          }}
          role="status"
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
