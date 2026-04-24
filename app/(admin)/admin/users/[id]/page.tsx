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

/* ── Badge components ──────────────────────────────── */
function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span className={`badge badge-role-${role}`}>
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
  return <span className={`badge badge-tier-${tier}`}>{tier}</span>;
}

function StatusBadge({ status }: { status: AdminUser["status"] }) {
  return <span className={`badge badge-status-${status}`}>{status}</span>;
}

function KYCBadge({ status }: { status: KYCStatus }) {
  const labels: Record<KYCStatus, string> = {
    verified: "KYC Verified",
    pending: "KYC Pending",
    rejected: "KYC Rejected",
    not_submitted: "No KYC",
  };
  return <span className={`badge badge-kyc-${status}`}>{labels[status]}</span>;
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
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onCancel}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <p
            style={{ fontSize: 14, color: "var(--graphite)", lineHeight: 1.6 }}
          >
            {message}
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn-admin btn-admin-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={`btn-admin ${danger ? "btn-admin-danger" : "btn-admin-primary"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Admin Sidebar ──────────────────────────────────── */
function AdminSidebar({ active }: { active: string }) {
  const navItems = [
    { href: "/admin", icon: "◈", label: "Dashboard" },
    { href: "/admin/users", icon: "◉", label: "Users" },
    { href: "/admin/campaigns", icon: "◆", label: "Campaigns" },
    { href: "/admin/payments", icon: "◐", label: "Payments" },
    { href: "/admin/kyc", icon: "◑", label: "KYC Review" },
    { href: "/admin/flags", icon: "⚑", label: "Flags" },
    { href: "/admin/settings", icon: "◈", label: "Settings" },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <div className="admin-sidebar-logo-text">Push</div>
        <div className="admin-sidebar-logo-sub">Admin Console</div>
      </div>
      <nav className="admin-nav">
        <div className="admin-nav-section">
          <div className="admin-nav-label">Navigation</div>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${active === item.href ? "active" : ""}`}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      <div className="admin-sidebar-footer">
        <div className="admin-sidebar-user">
          <div className="admin-sidebar-avatar">A</div>
          <div>
            <div className="admin-sidebar-user-name">Admin Alex</div>
            <div className="admin-sidebar-user-role">Super Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ── Tab Content Components ──────────────────────────── */
function AccountTab({ user }: { user: AdminUser }) {
  return (
    <div className="detail-content">
      <div className="detail-section">
        <div className="detail-section-header">
          <div className="detail-section-title">Identity</div>
        </div>
        <div className="detail-section-body">
          <div className="detail-field">
            <div className="detail-field-label">Full Name</div>
            <div className="detail-field-value">{user.name}</div>
          </div>
          <div className="detail-field">
            <div className="detail-field-label">Handle</div>
            <div
              className="detail-field-value"
              style={{ color: "var(--tertiary)" }}
            >
              {user.handle}
            </div>
          </div>
          <div className="detail-field">
            <div className="detail-field-label">Email</div>
            <div className="detail-field-value">{user.email}</div>
          </div>
          {user.phone && (
            <div className="detail-field">
              <div className="detail-field-label">Phone</div>
              <div className="detail-field-value">{user.phone}</div>
            </div>
          )}
          {user.address && (
            <div className="detail-field">
              <div className="detail-field-label">Location</div>
              <div className="detail-field-value">{user.address}</div>
            </div>
          )}
          {user.business_name && (
            <div className="detail-field">
              <div className="detail-field-label">Business</div>
              <div className="detail-field-value">{user.business_name}</div>
            </div>
          )}
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-section-header">
          <div className="detail-section-title">Verification</div>
        </div>
        <div className="detail-section-body">
          <div className="detail-field">
            <div className="detail-field-label">KYC Status</div>
            <div className="detail-field-value">
              <KYCBadge status={user.kyc_status} />
            </div>
          </div>
          <div className="detail-field">
            <div className="detail-field-label">Account Status</div>
            <div className="detail-field-value">
              <StatusBadge status={user.status} />
            </div>
          </div>
          <div className="detail-field">
            <div className="detail-field-label">Role</div>
            <div className="detail-field-value">
              <div style={{ display: "flex", gap: 6 }}>
                <RoleBadge role={user.role} />
                <TierBadge tier={user.tier} />
              </div>
            </div>
          </div>
          <div className="detail-field">
            <div className="detail-field-label">Joined</div>
            <div className="detail-field-value">
              {formatDateTime(user.joined_at)}
            </div>
          </div>
          <div className="detail-field">
            <div className="detail-field-label">Last Active</div>
            <div className="detail-field-value">
              {formatDateTime(user.last_active)}
            </div>
          </div>
          <div className="detail-field">
            <div className="detail-field-label">Verification Docs</div>
            <div className="detail-field-value">
              {user.kyc_status === "verified" ? (
                <span style={{ color: "var(--success-dark)", fontSize: 13 }}>
                  ✓ ID verified · Address verified
                </span>
              ) : user.kyc_status === "pending" ? (
                <span style={{ color: "var(--warning)", fontSize: 13 }}>
                  Documents under review
                </span>
              ) : (
                <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
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
    <div className="detail-content">
      <div className="detail-section">
        <div className="detail-section-header">
          <div className="detail-section-title">Recent Activity (last 50)</div>
        </div>
        <div className="detail-section-body" style={{ padding: 0 }}>
          {user.activity.length === 0 ? (
            <div
              style={{
                padding: "var(--space-4)",
                color: "var(--text-muted)",
                fontSize: 13,
                textAlign: "center",
              }}
            >
              No activity recorded.
            </div>
          ) : (
            <div className="timeline" style={{ padding: "0 var(--space-3)" }}>
              {user.activity.map((event) => (
                <div key={event.id} className="timeline-item">
                  <div className={`timeline-dot type-${event.type}`} />
                  <div className="timeline-body">
                    <div className="timeline-desc">
                      <span style={{ marginRight: 6, opacity: 0.5 }}>
                        {typeIcon[event.type] || "·"}
                      </span>
                      {event.description}
                    </div>
                    <div className="timeline-time">
                      {formatDateTime(event.timestamp)}
                    </div>
                    {event.metadata && (
                      <div className="timeline-meta">
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
      </div>
    </div>
  );
}

function CampaignsTab({ user }: { user: AdminUser }) {
  return (
    <div className="detail-content">
      <div className="detail-section">
        <div className="detail-section-header">
          <div className="detail-section-title">
            Campaigns ({user.campaigns_total} total)
          </div>
        </div>
        <div className="detail-section-body" style={{ padding: 0 }}>
          {user.campaigns.length === 0 ? (
            <div
              style={{
                padding: "var(--space-4)",
                color: "var(--text-muted)",
                fontSize: 13,
                textAlign: "center",
              }}
            >
              No campaigns found.
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--line)",
                    background: "var(--surface)",
                  }}
                >
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                    }}
                  >
                    Campaign
                  </th>
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                    }}
                  >
                    Merchant
                  </th>
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "right",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                    }}
                  >
                    Payout
                  </th>
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                    }}
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {user.campaigns.map((c) => (
                  <tr
                    key={c.id}
                    style={{ borderBottom: "1px solid var(--line)" }}
                  >
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                      {c.title}
                    </td>
                    <td
                      style={{ padding: "12px 16px", color: "var(--graphite)" }}
                    >
                      {c.merchant}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span className={`badge badge-status-${c.status}`}>
                        {c.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "right",
                        fontWeight: 700,
                        color: "var(--success-dark)",
                      }}
                    >
                      {formatMoney(c.payout)}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "var(--text-muted)",
                      }}
                    >
                      {formatDate(c.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function PaymentsTab({ user }: { user: AdminUser }) {
  return (
    <div className="detail-content">
      <div className="detail-section">
        <div className="detail-section-header">
          <div className="detail-section-title">Financial Summary</div>
        </div>
        <div className="detail-section-body">
          <div className="detail-field">
            <div className="detail-field-label">Total Earnings</div>
            <div
              className="detail-field-value"
              style={{ fontWeight: 700, color: "var(--success-dark)" }}
            >
              {formatMoney(user.earnings_total)}
            </div>
          </div>
          <div className="detail-field">
            <div className="detail-field-label">Total Campaigns</div>
            <div className="detail-field-value">{user.campaigns_total}</div>
          </div>
          <div className="detail-field">
            <div className="detail-field-label">Avg Per Campaign</div>
            <div className="detail-field-value">
              {user.campaigns_total > 0
                ? formatMoney(
                    Math.round(user.earnings_total / user.campaigns_total),
                  )
                : "—"}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-section-header">
          <div className="detail-section-title">Recent Transactions</div>
        </div>
        <div className="detail-section-body" style={{ padding: 0 }}>
          {user.transactions.length === 0 ? (
            <div
              style={{
                padding: "var(--space-4)",
                color: "var(--text-muted)",
                fontSize: 13,
                textAlign: "center",
              }}
            >
              No transactions.
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--line)",
                    background: "var(--surface)",
                  }}
                >
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                    }}
                  >
                    Description
                  </th>
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                    }}
                  >
                    Type
                  </th>
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "right",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                    }}
                  >
                    Amount
                  </th>
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                    }}
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {user.transactions.map((t) => (
                  <tr
                    key={t.id}
                    style={{ borderBottom: "1px solid var(--line)" }}
                  >
                    <td style={{ padding: "12px 16px" }}>{t.description}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        className={`badge badge-role-${t.type === "payout" ? "creator" : t.type === "deduction" ? "merchant" : "admin"}`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        className={`badge badge-status-${t.status === "completed" ? "active" : t.status === "pending" ? "pending" : "suspended"}`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "right",
                        fontWeight: 700,
                        color:
                          t.amount < 0
                            ? "var(--primary)"
                            : "var(--success-dark)",
                      }}
                    >
                      {t.amount < 0
                        ? `-${formatMoney(Math.abs(t.amount))}`
                        : formatMoney(t.amount)}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "var(--text-muted)",
                      }}
                    >
                      {formatDate(t.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
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
    <div className="detail-content">
      <div className="detail-section">
        <div className="detail-section-header">
          <div className="detail-section-title">Admin Notes</div>
        </div>
        <div className="note-composer">
          <textarea
            className="note-textarea"
            placeholder="Add an internal note about this user…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button
            className="btn-admin btn-admin-primary"
            onClick={handleSubmit}
          >
            Add Note
          </button>
        </div>
        <div>
          {user.notes.length === 0 ? (
            <div
              style={{
                padding: "var(--space-4)",
                color: "var(--text-muted)",
                fontSize: 13,
                textAlign: "center",
              }}
            >
              No notes yet.
            </div>
          ) : (
            user.notes.map((note) => (
              <div key={note.id} className="note-item">
                <div>
                  <span className="note-author">{note.author}</span>
                  <span className="note-date">
                    {formatDateTime(note.created_at)}
                  </span>
                </div>
                <div className="note-content">{note.content}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function FlagsTab({ user }: { user: AdminUser }) {
  const severityLabel: Record<string, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };

  return (
    <div className="detail-content">
      <div className="detail-section">
        <div className="detail-section-header">
          <div className="detail-section-title">
            Disputes / Fraud Flags / Complaints
          </div>
        </div>
        <div style={{ padding: 0 }}>
          {user.flags.length === 0 ? (
            <div
              style={{
                padding: "var(--space-4)",
                color: "var(--text-muted)",
                fontSize: 13,
                textAlign: "center",
              }}
            >
              No flags on this account.
            </div>
          ) : (
            user.flags.map((flag) => (
              <div key={flag.id} className="flag-item">
                <div className={`flag-severity ${flag.severity}`} />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--dark)",
                      }}
                    >
                      {flag.type
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                    <span
                      className={`badge badge-status-${flag.status === "open" ? "suspended" : "active"}`}
                    >
                      {flag.status}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        marginLeft: "auto",
                      }}
                    >
                      {severityLabel[flag.severity]} severity
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--graphite)" }}>
                    {flag.description}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      marginTop: 4,
                    }}
                  >
                    {formatDateTime(flag.created_at)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
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
      <div className="admin-shell">
        <AdminSidebar active="/admin/users" />
        <main className="admin-main">
          <div
            style={{
              padding: "var(--space-12)",
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: 14,
            }}
          >
            Loading user…
          </div>
        </main>
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
    <div className="admin-shell">
      <AdminSidebar active="/admin/users" />

      <main className="admin-main">
        {/* Topbar */}
        <div className="admin-topbar">
          <div className="admin-topbar-breadcrumb">
            Admin <span>/</span>{" "}
            <Link
              href="/admin/users"
              style={{ color: "var(--text-muted)", textDecoration: "none" }}
            >
              Users
            </Link>{" "}
            <span>/</span> <span>{user.name}</span>
          </div>
        </div>

        {/* User Hero */}
        <div className="user-detail-hero">
          <Link href="/admin/users" className="user-detail-back">
            ← Back to Users
          </Link>
          <div className="user-detail-identity">
            <div className="user-detail-avatar">
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar} alt={user.name} />
              ) : (
                <div className="user-detail-avatar-fallback">
                  {initials(user.name)}
                </div>
              )}
            </div>
            <div className="user-detail-info">
              <h1 className="user-detail-name">{user.name}</h1>
              <div className="user-detail-meta">
                <span className="user-detail-handle">{user.handle}</span>
                <span className="user-detail-handle">·</span>
                <span className="user-detail-handle">{user.email}</span>
              </div>
              <div className="user-detail-badges" style={{ marginTop: 10 }}>
                <RoleBadge role={user.role} />
                <TierBadge tier={user.tier} />
                <StatusBadge status={user.status} />
              </div>
            </div>
          </div>

          <div className="user-detail-actions">
            <button
              className="btn-admin btn-admin-outline"
              onClick={handleImpersonate}
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.85)",
                borderColor: "rgba(255,255,255,0.2)",
              }}
            >
              Impersonate
            </button>
            <button
              className="btn-admin"
              style={{
                background: "rgba(224, 123, 0, 0.15)",
                color: "var(--warning)",
                border: "1px solid rgba(224, 123, 0, 0.3)",
              }}
              onClick={() => setModal("suspend")}
            >
              {user.status === "suspended" ? "Unsuspend" : "Suspend"}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="user-quick-stats">
          <div className="quick-stat">
            <div className="quick-stat-num">{accountAge(user.joined_at)}</div>
            <div className="quick-stat-label">Account Age</div>
          </div>
          <div className="quick-stat">
            <div className="quick-stat-num">{user.campaigns_total}</div>
            <div className="quick-stat-label">Total Campaigns</div>
          </div>
          <div className="quick-stat">
            <div className="quick-stat-num">
              {formatMoney(user.earnings_total)}
            </div>
            <div className="quick-stat-label">Total Earnings</div>
          </div>
          <div className="quick-stat">
            <div className="quick-stat-num">
              {user.push_score > 0 ? user.push_score : "—"}
            </div>
            <div className="quick-stat-label">Push Score</div>
          </div>
        </div>

        {/* Detail Tabs */}
        <div className="detail-tabs">
          {detailTabs.map((t) => (
            <button
              key={t.key}
              className={`detail-tab ${activeTab === t.key ? "active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.6 }}>
                  ({t.count})
                </span>
              )}
            </button>
          ))}
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
        <div className="danger-zone">
          <div className="danger-zone-header">
            <div className="danger-zone-title">Danger Zone</div>
          </div>
          <div className="danger-zone-body">
            <div className="danger-action">
              <div className="danger-action-desc">
                <div className="danger-action-title">
                  {user.status === "suspended"
                    ? "Unsuspend Account"
                    : "Suspend Account"}
                </div>
                <div className="danger-action-sub">
                  {user.status === "suspended"
                    ? "Restore this user's access to the platform."
                    : "Temporarily block this user from accessing Push."}
                </div>
              </div>
              <button
                className="btn-admin btn-admin-ghost"
                onClick={() => setModal("suspend")}
              >
                {user.status === "suspended" ? "Unsuspend" : "Suspend"}
              </button>
            </div>

            <div className="danger-action">
              <div className="danger-action-desc">
                <div className="danger-action-title">Ban Account</div>
                <div className="danger-action-sub">
                  Permanently ban this user. They will not be able to create a
                  new account.
                </div>
              </div>
              <button
                className="btn-admin btn-admin-danger"
                onClick={() => setModal("ban")}
              >
                Ban User
              </button>
            </div>

            <div className="danger-action">
              <div className="danger-action-desc">
                <div className="danger-action-title">Delete Account</div>
                <div className="danger-action-sub">
                  Permanently delete all data associated with this account. This
                  cannot be undone.
                </div>
              </div>
              <button
                className="btn-admin btn-admin-danger"
                onClick={() => setModal("delete")}
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Last active footer */}
        <div
          style={{
            padding: "var(--space-3) var(--space-5)",
            color: "var(--text-muted)",
            fontSize: 12,
          }}
        >
          Last active {timeAgo(user.last_active)} · User ID: {user.id}
        </div>
      </main>

      {/* Impersonating banner */}
      {impersonating && (
        <div className="impersonate-banner">
          <div className="impersonate-banner-dot" />
          Impersonating <strong style={{ margin: "0 4px" }}>
            {user.name}
          </strong>{" "}
          — session active
          <button
            className="btn-admin"
            style={{
              marginLeft: "auto",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "var(--r-lg)",
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
