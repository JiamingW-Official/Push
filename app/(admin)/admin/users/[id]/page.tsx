"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import "../users.css";
import type {
  AdminUser,
  AdminNote,
  KYCStatus,
  UserRole,
} from "@/lib/admin/mock-users";

/* ── Types ─────────────────────────────────────────── */
type DetailTab =
  | "account"
  | "activity"
  | "campaigns"
  | "payments"
  | "notes"
  | "flags";

/* ── Helpers ─────────────────────────────────────────── */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function accountAge(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days < 30) return `${days} days`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months`;
  const years = Math.floor(months / 12);
  return `${years}y ${months % 12}mo`;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatMoney(n: number): string {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

/* ── Shared styles ──────────────────────────────────── */
const cardStyle: React.CSSProperties = {
  background: "var(--surface-2)",
  border: "1px solid var(--hairline)",
  borderRadius: 10,
  padding: "20px 24px",
  marginBottom: 16,
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: "var(--ink-4)",
  marginBottom: 16,
};

const fieldLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: "var(--ink-4)",
  marginBottom: 3,
};

const fieldValueStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 14,
  color: "var(--ink)",
};

/* ── Badge components ──────────────────────────────── */
function RoleBadge({ role }: { role: UserRole }) {
  const styles: Record<UserRole, { bg: string; color: string }> = {
    creator: { bg: "rgba(0,133,255,0.10)", color: "var(--accent-blue)" },
    merchant: { bg: "var(--panel-butter)", color: "var(--ink-3)" },
    admin: { bg: "var(--surface-3)", color: "var(--ink-4)" },
  };
  const s = styles[role];
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
        background: s.bg,
        color: s.color,
        display: "inline-block",
      }}
    >
      {role === "creator"
        ? "Creator"
        : role === "merchant"
          ? "Merchant"
          : "Admin"}
    </span>
  );
}

function TierBadge({ tier }: { tier?: string }) {
  if (!tier) return null;
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
      {tier}
    </span>
  );
}

function StatusBadge({ status }: { status: AdminUser["status"] }) {
  const styles: Record<string, { bg: string; color: string }> = {
    active: { bg: "rgba(0,133,255,0.10)", color: "var(--accent-blue)" },
    pending: { bg: "var(--panel-butter)", color: "var(--ink-3)" },
    suspended: { bg: "rgba(193,18,31,0.10)", color: "var(--brand-red)" },
    banned: { bg: "rgba(193,18,31,0.15)", color: "var(--brand-red)" },
  };
  const s = styles[status] ?? { bg: "var(--surface-3)", color: "var(--ink-4)" };
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
        background: s.bg,
        color: s.color,
        display: "inline-block",
      }}
    >
      {status}
    </span>
  );
}

function KYCBadge({ status }: { status: KYCStatus }) {
  const labels: Record<KYCStatus, string> = {
    verified: "KYC Verified",
    pending: "KYC Pending",
    rejected: "KYC Rejected",
    not_submitted: "No KYC",
  };
  const styles: Record<KYCStatus, { bg: string; color: string }> = {
    verified: { bg: "rgba(0,133,255,0.10)", color: "var(--accent-blue)" },
    pending: { bg: "var(--panel-butter)", color: "var(--ink-3)" },
    rejected: { bg: "rgba(193,18,31,0.10)", color: "var(--brand-red)" },
    not_submitted: { bg: "var(--surface-3)", color: "var(--ink-4)" },
  };
  const s = styles[status];
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
        background: s.bg,
        color: s.color,
        display: "inline-block",
      }}
    >
      {labels[status]}
    </span>
  );
}

/* ── Confirm Modal ──────────────────────────────────── */
function ConfirmModal({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  danger,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
          borderRadius: 12,
          padding: "24px",
          maxWidth: 420,
          width: "90%",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 700,
              color: "var(--ink)",
            }}
          >
            {title}
          </span>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              color: "var(--ink-4)",
            }}
            onClick={onCancel}
          >
            ×
          </button>
        </div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--ink-3)",
            lineHeight: 1.6,
            marginBottom: 20,
          }}
        >
          {message}
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="btn-ghost click-shift" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="click-shift"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              background: danger ? "var(--brand-red)" : "var(--ink)",
              color: "var(--snow)",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              cursor: "pointer",
            }}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Tab Content Components ──────────────────────────── */
function AccountTab({ user }: { user: AdminUser }) {
  return (
    <div>
      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Identity</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px 24px",
          }}
        >
          {[
            { label: "Full Name", val: user.name },
            { label: "Handle", val: user.handle },
            { label: "Email", val: user.email },
            ...(user.phone ? [{ label: "Phone", val: user.phone }] : []),
            ...(user.address ? [{ label: "Location", val: user.address }] : []),
            ...(user.business_name
              ? [{ label: "Business", val: user.business_name }]
              : []),
          ].map(({ label, val }) => (
            <div key={label}>
              <div style={fieldLabelStyle}>{label}</div>
              <div
                style={{
                  ...fieldValueStyle,
                  color:
                    label === "Handle" ? "var(--accent-blue)" : "var(--ink)",
                }}
              >
                {val}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Verification</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px 24px",
          }}
        >
          <div>
            <div style={fieldLabelStyle}>KYC Status</div>
            <KYCBadge status={user.kyc_status} />
          </div>
          <div>
            <div style={fieldLabelStyle}>Account Status</div>
            <StatusBadge status={user.status} />
          </div>
          <div>
            <div style={fieldLabelStyle}>Role</div>
            <div style={{ display: "flex", gap: 6 }}>
              <RoleBadge role={user.role} />
              <TierBadge tier={user.tier} />
            </div>
          </div>
          <div>
            <div style={fieldLabelStyle}>Joined</div>
            <div style={fieldValueStyle}>{formatDateTime(user.joined_at)}</div>
          </div>
          <div>
            <div style={fieldLabelStyle}>Last Active</div>
            <div style={fieldValueStyle}>
              {formatDateTime(user.last_active)}
            </div>
          </div>
          <div>
            <div style={fieldLabelStyle}>Verification Docs</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13 }}>
              {user.kyc_status === "verified" ? (
                <span style={{ color: "var(--accent-blue)" }}>
                  ✓ ID verified · Address verified
                </span>
              ) : user.kyc_status === "pending" ? (
                <span style={{ color: "var(--ink-3)" }}>
                  Documents under review
                </span>
              ) : (
                <span style={{ color: "var(--ink-4)" }}>
                  No documents submitted
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityTab({ user }: { user: AdminUser }) {
  const typeIcon: Record<string, string> = {
    login: "→",
    campaign_apply: "◆",
    campaign_complete: "✓",
    payment: "$",
    kyc: "◑",
    profile_update: "✎",
    suspension: "⚑",
    signup: "★",
  };

  return (
    <div style={cardStyle}>
      <div style={sectionTitleStyle}>Recent Activity (last 50)</div>
      {user.activity.length === 0 ? (
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--ink-4)",
            textAlign: "center",
            padding: "24px 0",
          }}
        >
          No activity recorded.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {user.activity.map((event) => (
            <div
              key={event.id}
              style={{
                display: "flex",
                gap: 12,
                padding: "10px 0",
                borderBottom: "1px solid var(--hairline)",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: "var(--surface-3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "var(--ink-4)",
                }}
              >
                {typeIcon[event.type] || "·"}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--ink)",
                  }}
                >
                  {event.description}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: "var(--ink-4)",
                    marginTop: 2,
                  }}
                >
                  {formatDateTime(event.timestamp)}
                </div>
                {event.metadata && (
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 11,
                      color: "var(--ink-4)",
                      marginTop: 2,
                    }}
                  >
                    {Object.entries(event.metadata)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(" · ")}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CampaignsTab({ user }: { user: AdminUser }) {
  return (
    <div style={cardStyle}>
      <div style={sectionTitleStyle}>
        Campaigns ({user.campaigns_total} total)
      </div>
      {user.campaigns.length === 0 ? (
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--ink-4)",
            textAlign: "center",
            padding: "24px 0",
          }}
        >
          No campaigns found.
        </div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontFamily: "var(--font-body)",
            fontSize: 13,
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--hairline)",
                background: "var(--surface-3)",
              }}
            >
              {["Campaign", "Merchant", "Status", "Payout", "Date"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "8px 12px",
                    textAlign: "left",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: "var(--ink-4)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {user.campaigns.map((c) => (
              <tr
                key={c.id}
                style={{ borderBottom: "1px solid var(--hairline)" }}
              >
                <td
                  style={{
                    padding: "10px 12px",
                    fontWeight: 600,
                    color: "var(--ink)",
                  }}
                >
                  {c.title}
                </td>
                <td style={{ padding: "10px 12px", color: "var(--ink-3)" }}>
                  {c.merchant}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      borderRadius: 4,
                      padding: "2px 6px",
                      background:
                        c.status === "active"
                          ? "rgba(0,133,255,0.10)"
                          : "var(--surface-3)",
                      color:
                        c.status === "active"
                          ? "var(--accent-blue)"
                          : "var(--ink-4)",
                    }}
                  >
                    {c.status}
                  </span>
                </td>
                <td
                  style={{
                    padding: "10px 12px",
                    textAlign: "right",
                    fontWeight: 700,
                    color: "var(--accent-blue)",
                  }}
                >
                  {formatMoney(c.payout)}
                </td>
                <td style={{ padding: "10px 12px", color: "var(--ink-4)" }}>
                  {formatDate(c.date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function PaymentsTab({ user }: { user: AdminUser }) {
  return (
    <div>
      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Financial Summary</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 16,
          }}
        >
          {[
            {
              label: "Total Earnings",
              val: formatMoney(user.earnings_total),
              accent: true,
            },
            {
              label: "Total Campaigns",
              val: String(user.campaigns_total),
              accent: false,
            },
            {
              label: "Avg Per Campaign",
              val:
                user.campaigns_total > 0
                  ? formatMoney(
                      Math.round(user.earnings_total / user.campaigns_total),
                    )
                  : "—",
              accent: false,
            },
          ].map(({ label, val, accent }) => (
            <div key={label}>
              <div style={fieldLabelStyle}>{label}</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  fontWeight: 900,
                  color: accent ? "var(--accent-blue)" : "var(--ink)",
                }}
              >
                {val}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Recent Transactions</div>
        {user.transactions.length === 0 ? (
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--ink-4)",
              textAlign: "center",
              padding: "24px 0",
            }}
          >
            No transactions.
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "var(--font-body)",
              fontSize: 13,
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--hairline)",
                  background: "var(--surface-3)",
                }}
              >
                {["Description", "Type", "Status", "Amount", "Date"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "8px 12px",
                        textAlign: h === "Amount" ? "right" : "left",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                        color: "var(--ink-4)",
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {user.transactions.map((t) => (
                <tr
                  key={t.id}
                  style={{ borderBottom: "1px solid var(--hairline)" }}
                >
                  <td style={{ padding: "10px 12px", color: "var(--ink)" }}>
                    {t.description}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
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
                      }}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        borderRadius: 4,
                        padding: "2px 6px",
                        background:
                          t.status === "completed"
                            ? "rgba(0,133,255,0.10)"
                            : t.status === "pending"
                              ? "var(--panel-butter)"
                              : "rgba(193,18,31,0.10)",
                        color:
                          t.status === "completed"
                            ? "var(--accent-blue)"
                            : t.status === "pending"
                              ? "var(--ink-3)"
                              : "var(--brand-red)",
                      }}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      textAlign: "right",
                      fontWeight: 700,
                      color:
                        t.amount < 0
                          ? "var(--brand-red)"
                          : "var(--accent-blue)",
                    }}
                  >
                    {t.amount < 0
                      ? `-${formatMoney(Math.abs(t.amount))}`
                      : formatMoney(t.amount)}
                  </td>
                  <td style={{ padding: "10px 12px", color: "var(--ink-4)" }}>
                    {formatDate(t.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function NotesTab({
  user,
  onAddNote,
}: {
  user: AdminUser;
  onAddNote: (content: string) => void;
}) {
  const [draft, setDraft] = useState("");

  function handleSubmit() {
    if (!draft.trim()) return;
    onAddNote(draft.trim());
    setDraft("");
  }

  return (
    <div style={cardStyle}>
      <div style={sectionTitleStyle}>Admin Notes</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 20,
        }}
      >
        <textarea
          placeholder="Add an internal note about this user…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--ink)",
            background: "var(--surface-3)",
            border: "1px solid var(--hairline)",
            borderRadius: 8,
            padding: "10px 12px",
            resize: "vertical",
            minHeight: 80,
            outline: "none",
          }}
        />
        <button
          className="btn-primary click-shift"
          onClick={handleSubmit}
          style={{ alignSelf: "flex-start" }}
        >
          Add Note
        </button>
      </div>
      {user.notes.length === 0 ? (
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--ink-4)",
            textAlign: "center",
            padding: "16px 0",
          }}
        >
          No notes yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {user.notes.map((note) => (
            <div
              key={note.id}
              style={{
                background: "var(--surface-3)",
                borderRadius: 8,
                padding: "12px 14px",
              }}
            >
              <div style={{ display: "flex", gap: 12, marginBottom: 6 }}>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--ink)",
                  }}
                >
                  {note.author}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: "var(--ink-4)",
                  }}
                >
                  {formatDateTime(note.created_at)}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--ink-3)",
                  lineHeight: 1.6,
                }}
              >
                {note.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FlagsTab({ user }: { user: AdminUser }) {
  return (
    <div style={cardStyle}>
      <div style={sectionTitleStyle}>Disputes / Fraud Flags / Complaints</div>
      {user.flags.length === 0 ? (
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--ink-4)",
            textAlign: "center",
            padding: "24px 0",
          }}
        >
          No flags on this account.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {user.flags.map((flag) => {
            const sevColor =
              flag.severity === "high"
                ? "var(--brand-red)"
                : flag.severity === "medium"
                  ? "#d97706"
                  : "var(--ink-4)";
            const sevBg =
              flag.severity === "high"
                ? "rgba(193,18,31,0.08)"
                : flag.severity === "medium"
                  ? "var(--panel-butter)"
                  : "var(--surface-3)";
            return (
              <div
                key={flag.id}
                style={{
                  background: sevBg,
                  border: "1px solid var(--hairline)",
                  borderRadius: 8,
                  padding: "12px 16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--ink)",
                    }}
                  >
                    {flag.type
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      borderRadius: 4,
                      padding: "2px 6px",
                      background:
                        flag.status === "open"
                          ? "rgba(193,18,31,0.10)"
                          : "rgba(0,133,255,0.10)",
                      color:
                        flag.status === "open"
                          ? "var(--brand-red)"
                          : "var(--accent-blue)",
                    }}
                  >
                    {flag.status}
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontFamily: "var(--font-body)",
                      fontSize: 10,
                      fontWeight: 700,
                      color: sevColor,
                    }}
                  >
                    {flag.severity} severity
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--ink-3)",
                  }}
                >
                  {flag.description}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: "var(--ink-4)",
                    marginTop: 4,
                  }}
                >
                  {formatDateTime(flag.created_at)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Main Detail Page ────────────────────────────────── */
export default function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DetailTab>("account");
  const [modal, setModal] = useState<null | "suspend" | "ban" | "delete">(null);
  const [impersonating, setImpersonating] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/users/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      });
  }, [id]);

  async function handleImpersonate() {
    const res = await fetch(`/api/admin/users/${id}/impersonate`, {
      method: "POST",
    });
    if (res.ok) setImpersonating(true);
  }

  async function handleSuspend() {
    if (!user) return;
    const newStatus = user.status === "suspended" ? "active" : "suspended";
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setUser({ ...user, status: newStatus });
    setModal(null);
  }

  async function handleBan() {
    if (!user) return;
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "banned" }),
    });
    setUser({ ...user, status: "banned" });
    setModal(null);
  }

  async function handleDelete() {
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    window.location.href = "/admin/users";
  }

  function handleAddNote(content: string) {
    if (!user) return;
    const note: AdminNote = {
      id: `note_${Date.now()}`,
      author: "Admin Alex",
      content,
      created_at: new Date().toISOString(),
    };
    setUser({ ...user, notes: [note, ...user.notes] });
  }

  if (loading || !user) {
    return (
      <div
        style={{
          fontFamily: "var(--font-body)",
          color: "var(--ink)",
          padding: "48px 0",
          textAlign: "center",
        }}
      >
        <div style={{ color: "var(--ink-4)", fontSize: 14 }}>Loading user…</div>
      </div>
    );
  }

  const detailTabs: { key: DetailTab; label: string; count?: number }[] = [
    { key: "account", label: "Account" },
    { key: "activity", label: "Activity", count: user.activity.length },
    { key: "campaigns", label: "Campaigns", count: user.campaigns_total },
    { key: "payments", label: "Payments", count: user.transactions.length },
    { key: "notes", label: "Notes", count: user.notes.length },
    { key: "flags", label: "Flags", count: user.flags.length },
  ];

  return (
    <div style={{ fontFamily: "var(--font-body)", color: "var(--ink)" }}>
      {/* Back link */}
      <Link
        href="/admin/users"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 13,
          color: "var(--ink-4)",
          textDecoration: "none",
          display: "inline-block",
          marginBottom: 16,
        }}
      >
        ← Back to Users
      </Link>

      {/* User Hero */}
      <div
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--hairline)",
          borderRadius: 10,
          padding: "20px 24px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 12,
            overflow: "hidden",
            flexShrink: 0,
            background: "var(--surface-3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar}
              alt={user.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 900,
                color: "var(--ink-4)",
              }}
            >
              {initials(user.name)}
            </span>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(22px,2.5vw,32px)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              margin: "0 0 4px",
            }}
          >
            {user.name}
          </h1>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--ink-4)",
              marginBottom: 10,
            }}
          >
            {user.handle} · {user.email}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <RoleBadge role={user.role} />
            <TierBadge tier={user.tier} />
            <StatusBadge status={user.status} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button className="btn-ghost click-shift" onClick={handleImpersonate}>
            Impersonate
          </button>
          <button
            className="click-shift"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              background: "rgba(193,18,31,0.10)",
              color: "var(--brand-red)",
              border: "1px solid rgba(193,18,31,0.2)",
              borderRadius: 8,
              padding: "10px 16px",
              cursor: "pointer",
            }}
            onClick={() => setModal("suspend")}
          >
            {user.status === "suspended" ? "Unsuspend" : "Suspend"}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[
          { label: "Account Age", val: accountAge(user.joined_at) },
          { label: "Total Campaigns", val: String(user.campaigns_total) },
          { label: "Total Earnings", val: formatMoney(user.earnings_total) },
          {
            label: "Push Score",
            val: user.push_score > 0 ? String(user.push_score) : "—",
          },
        ].map(({ label, val }) => (
          <div
            key={label}
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--hairline)",
              borderRadius: 10,
              padding: "16px 20px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 900,
                color: "var(--ink)",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              {val}
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--ink-4)",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Tabs */}
      <div
        style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}
      >
        {detailTabs.map((t) => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className="click-shift"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                border: "1px solid",
                borderRadius: 8,
                padding: "5px 12px",
                cursor: "pointer",
                background: isActive ? "var(--ink)" : "var(--surface-2)",
                borderColor: isActive ? "var(--ink)" : "var(--hairline)",
                color: isActive ? "var(--snow)" : "var(--ink-3)",
              }}
            >
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.7 }}>
                  ({t.count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "account" && <AccountTab user={user} />}
      {activeTab === "activity" && <ActivityTab user={user} />}
      {activeTab === "campaigns" && <CampaignsTab user={user} />}
      {activeTab === "payments" && <PaymentsTab user={user} />}
      {activeTab === "notes" && (
        <NotesTab user={user} onAddNote={handleAddNote} />
      )}
      {activeTab === "flags" && <FlagsTab user={user} />}

      {/* Danger Zone */}
      <div
        style={{
          background: "rgba(193,18,31,0.04)",
          border: "1px solid rgba(193,18,31,0.20)",
          borderRadius: 10,
          padding: "20px 24px",
          marginTop: 24,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: "var(--brand-red)",
            marginBottom: 16,
          }}
        >
          Danger Zone
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            {
              title:
                user.status === "suspended"
                  ? "Unsuspend Account"
                  : "Suspend Account",
              sub:
                user.status === "suspended"
                  ? "Restore this user's access to the platform."
                  : "Temporarily block this user from accessing Push.",
              action: () => setModal("suspend"),
              label: user.status === "suspended" ? "Unsuspend" : "Suspend",
              danger: false,
            },
            {
              title: "Ban Account",
              sub: "Permanently ban this user. They will not be able to create a new account.",
              action: () => setModal("ban"),
              label: "Ban User",
              danger: true,
            },
            {
              title: "Delete Account",
              sub: "Permanently delete all data associated with this account. This cannot be undone.",
              action: () => setModal("delete"),
              label: "Delete",
              danger: true,
            },
          ].map(({ title, sub, action, label, danger }) => (
            <div
              key={title}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                paddingBottom: 14,
                borderBottom: "1px solid rgba(193,18,31,0.10)",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--ink)",
                    marginBottom: 2,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink-4)",
                  }}
                >
                  {sub}
                </div>
              </div>
              <button
                className="click-shift"
                onClick={action}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  background: danger ? "var(--brand-red)" : "transparent",
                  color: danger ? "var(--snow)" : "var(--brand-red)",
                  border: danger ? "none" : "1px solid var(--brand-red)",
                  borderRadius: 8,
                  padding: "8px 16px",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                {label}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Last active footer */}
      <div
        style={{
          padding: "12px 0",
          fontFamily: "var(--font-body)",
          color: "var(--ink-4)",
          fontSize: 12,
          marginTop: 8,
        }}
      >
        Last active {timeAgo(user.last_active)} · User ID: {user.id}
      </div>

      {/* Impersonating banner */}
      {impersonating && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "var(--ink)",
            color: "var(--snow)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 24px",
            fontFamily: "var(--font-body)",
            fontSize: 13,
            fontWeight: 600,
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--accent-blue)",
              flexShrink: 0,
            }}
          />
          Impersonating <strong style={{ margin: "0 4px" }}>{user.name}</strong>{" "}
          — session active
          <button
            className="click-shift"
            style={{
              marginLeft: "auto",
              background: "rgba(255,255,255,0.1)",
              color: "var(--snow)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 6,
              padding: "5px 12px",
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
            onClick={() => {
              document.cookie = "push-impersonating=; max-age=0; path=/";
              setImpersonating(false);
            }}
          >
            End Session
          </button>
        </div>
      )}

      {/* Modals */}
      {modal === "suspend" && (
        <ConfirmModal
          title={
            user.status === "suspended"
              ? "Unsuspend Account"
              : "Suspend Account"
          }
          message={
            user.status === "suspended"
              ? `Restore access for ${user.name}? They will be able to log in and use Push again.`
              : `Suspend ${user.name}? They will lose access to Push immediately. You can unsuspend later.`
          }
          confirmLabel={
            user.status === "suspended" ? "Yes, Unsuspend" : "Yes, Suspend"
          }
          onConfirm={handleSuspend}
          onCancel={() => setModal(null)}
          danger={user.status !== "suspended"}
        />
      )}
      {modal === "ban" && (
        <ConfirmModal
          title="Ban Account"
          message={`Permanently ban ${user.name}? This prevents them from ever accessing Push again. This action is severe — are you sure?`}
          confirmLabel="Yes, Ban Permanently"
          onConfirm={handleBan}
          onCancel={() => setModal(null)}
          danger
        />
      )}
      {modal === "delete" && (
        <ConfirmModal
          title="Delete Account"
          message={`Delete all data for ${user.name}? This includes their profile, campaigns, and payment history. This CANNOT be undone.`}
          confirmLabel="Yes, Delete Forever"
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
          danger
        />
      )}
    </div>
  );
}
