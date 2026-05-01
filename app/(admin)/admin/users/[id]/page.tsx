"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import "../users.css";
import "./user-detail.css";
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
    <span className={`ud-badge ud-badge--${role}`}>
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
  return <span className="ud-badge ud-badge--tier">{tier}</span>;
}

function StatusBadge({ status }: { status: AdminUser["status"] }) {
  return <span className={`ud-badge ud-badge--${status}`}>{status}</span>;
}

function KYCBadge({ status }: { status: KYCStatus }) {
  const labels: Record<KYCStatus, string> = {
    verified: "KYC Verified",
    pending: "KYC Pending",
    rejected: "KYC Rejected",
    not_submitted: "No KYC",
  };
  const cls =
    status === "not_submitted"
      ? "ud-badge--kyc-not-submitted"
      : `ud-badge--kyc-${status}`;
  return <span className={`ud-badge ${cls}`}>{labels[status]}</span>;
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
  const identityFields = [
    { label: "Full Name", val: user.name, accent: false },
    { label: "Handle", val: user.handle, accent: true },
    { label: "Email", val: user.email, accent: false },
    ...(user.phone ? [{ label: "Phone", val: user.phone, accent: false }] : []),
    ...(user.address
      ? [{ label: "Location", val: user.address, accent: false }]
      : []),
    ...(user.business_name
      ? [{ label: "Business", val: user.business_name, accent: false }]
      : []),
  ];

  return (
    <div>
      <div className="ud-card" style={{ marginBottom: 16 }}>
        <div className="ud-card__title">Identity</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px 24px",
          }}
        >
          {identityFields.map(({ label, val, accent }) => (
            <div key={label}>
              <div className="ud-field__label">{label}</div>
              <div
                className="ud-field__value"
                style={accent ? { color: "var(--accent-blue)" } : undefined}
              >
                {val}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ud-card">
        <div className="ud-card__title">Verification</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px 24px",
          }}
        >
          <div>
            <div className="ud-field__label">KYC Status</div>
            <KYCBadge status={user.kyc_status} />
          </div>
          <div>
            <div className="ud-field__label">Account Status</div>
            <StatusBadge status={user.status} />
          </div>
          <div>
            <div className="ud-field__label">Role</div>
            <div style={{ display: "flex", gap: 6 }}>
              <RoleBadge role={user.role} />
              <TierBadge tier={user.tier} />
            </div>
          </div>
          <div>
            <div className="ud-field__label">Joined</div>
            <div className="ud-field__value">
              {formatDateTime(user.joined_at)}
            </div>
          </div>
          <div>
            <div className="ud-field__label">Last Active</div>
            <div className="ud-field__value">
              {formatDateTime(user.last_active)}
            </div>
          </div>
          <div>
            <div className="ud-field__label">Verification Docs</div>
            <div className="ud-field__value">
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
    <div className="ud-panel">
      <div className="ud-panel__header">
        <div className="ud-panel__title">Recent Activity (last 50)</div>
      </div>
      {user.activity.length === 0 ? (
        <div className="ud-empty">No activity recorded.</div>
      ) : (
        user.activity.map((event) => (
          <div key={event.id} className="ud-row">
            <div className="ud-row__icon">{typeIcon[event.type] || "·"}</div>
            <div className="ud-row__body">
              <div className="ud-row__desc">{event.description}</div>
              <div className="ud-row__meta">
                {formatDateTime(event.timestamp)}
              </div>
              {event.metadata && (
                <div className="ud-row__meta">
                  {Object.entries(event.metadata)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(" · ")}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function CampaignsTab({ user }: { user: AdminUser }) {
  return (
    <div className="ud-panel">
      <div className="ud-panel__header">
        <div className="ud-panel__title">
          Campaigns ({user.campaigns_total} total)
        </div>
      </div>
      {user.campaigns.length === 0 ? (
        <div className="ud-empty">No campaigns found.</div>
      ) : (
        <table className="ud-table">
          <thead>
            <tr>
              {["Campaign", "Merchant", "Status", "Payout", "Date"].map((h) => (
                <th key={h} className={h === "Payout" ? "col-right" : ""}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {user.campaigns.map((c) => (
              <tr key={c.id} tabIndex={0}>
                <td style={{ fontWeight: 600 }}>{c.title}</td>
                <td style={{ color: "var(--ink-3)" }}>{c.merchant}</td>
                <td>
                  <span
                    className={`ud-badge ${c.status === "active" ? "ud-badge--active" : "ud-badge--pending"}`}
                  >
                    {c.status}
                  </span>
                </td>
                <td
                  className="col-right"
                  style={{ fontWeight: 700, color: "var(--accent-blue)" }}
                >
                  {formatMoney(c.payout)}
                </td>
                <td style={{ color: "var(--ink-4)" }}>{formatDate(c.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function PaymentsTab({ user }: { user: AdminUser }) {
  const avgPerCampaign =
    user.campaigns_total > 0
      ? formatMoney(Math.round(user.earnings_total / user.campaigns_total))
      : "—";

  return (
    <div>
      {/* Financial summary KPIs */}
      <div className="ud-panel" style={{ marginBottom: 16 }}>
        <div className="ud-panel__header">
          <div className="ud-panel__title">Financial Summary</div>
        </div>
        <div style={{ padding: "16px 24px" }}>
          <div className="ud-fin-grid">
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
              { label: "Avg Per Campaign", val: avgPerCampaign, accent: false },
            ].map(({ label, val, accent }) => (
              <div key={label}>
                <div
                  className={`ud-fin-item__num${accent ? " ud-fin-item__num--accent" : ""}`}
                >
                  {val}
                </div>
                <div className="ud-fin-item__label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions table */}
      <div className="ud-panel">
        <div className="ud-panel__header">
          <div className="ud-panel__title">Recent Transactions</div>
        </div>
        {user.transactions.length === 0 ? (
          <div className="ud-empty">No transactions.</div>
        ) : (
          <table className="ud-table">
            <thead>
              <tr>
                {["Description", "Type", "Status", "Amount", "Date"].map(
                  (h) => (
                    <th key={h} className={h === "Amount" ? "col-right" : ""}>
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {user.transactions.map((t) => (
                <tr key={t.id} tabIndex={0}>
                  <td>{t.description}</td>
                  <td>
                    <span className="ud-badge ud-badge--pending">{t.type}</span>
                  </td>
                  <td>
                    <span
                      className={`ud-badge ${
                        t.status === "completed"
                          ? "ud-badge--completed"
                          : t.status === "pending"
                            ? "ud-badge--pending"
                            : "ud-badge--failed"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td
                    className="col-right"
                    style={{
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
                  <td style={{ color: "var(--ink-4)" }}>
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
    <div className="ud-panel">
      <div className="ud-panel__header">
        <div className="ud-panel__title">Admin Notes</div>
      </div>
      <div className="ud-note-composer">
        <textarea
          className="ud-note-textarea"
          placeholder="Add an internal note about this user…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
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
        <div className="ud-empty">No notes yet.</div>
      ) : (
        user.notes.map((note) => (
          <div key={note.id} className="ud-note-item">
            <div style={{ marginBottom: 6 }}>
              <span className="ud-note-item__author">{note.author}</span>
              <span className="ud-note-item__date">
                {formatDateTime(note.created_at)}
              </span>
            </div>
            <div className="ud-note-item__content">{note.content}</div>
          </div>
        ))
      )}
    </div>
  );
}

function FlagsTab({ user }: { user: AdminUser }) {
  return (
    <div className="ud-panel">
      <div className="ud-panel__header">
        <div className="ud-panel__title">
          Disputes / Fraud Flags / Complaints
        </div>
      </div>
      {user.flags.length === 0 ? (
        <div className="ud-empty">No flags on this account.</div>
      ) : (
        user.flags.map((flag) => (
          <div key={flag.id} className="ud-flag" tabIndex={0}>
            <div className="ud-flag__header">
              <span className="ud-flag__type">
                {flag.type
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>
              <span
                className={`ud-badge ${flag.status === "open" ? "ud-badge--open" : "ud-badge--resolved"}`}
              >
                {flag.status}
              </span>
              <span
                className={`ud-flag__severity-label ud-badge ud-badge--${flag.severity}`}
              >
                {flag.severity} severity
              </span>
            </div>
            <div className="ud-flag__desc">{flag.description}</div>
            <div className="ud-flag__time">
              {formatDateTime(flag.created_at)}
            </div>
          </div>
        ))
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
      <div className="ud-empty" style={{ padding: "48px 0" }}>
        Loading user…
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
    <div>
      {/* Eyebrow + back */}
      <div className="ud-eyebrow">(USER·DETAIL)</div>
      <Link href="/admin/users" className="ud-back">
        ← Back to Users
      </Link>

      {/* User Hero */}
      <div className="ud-hero">
        <div className="ud-avatar">
          {user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt={user.name} />
          ) : (
            <span className="ud-avatar__initials">{initials(user.name)}</span>
          )}
        </div>

        <div className="ud-identity">
          <h1 className="ud-name">{user.name}</h1>
          <div className="ud-meta">
            {user.handle} · {user.email}
          </div>
          <div className="ud-badges">
            <RoleBadge role={user.role} />
            <TierBadge tier={user.tier} />
            <StatusBadge status={user.status} />
          </div>
        </div>

        <div className="ud-hero-actions">
          {/* Impersonate → btn-ink */}
          <button className="btn-ink click-shift" onClick={handleImpersonate}>
            Impersonate
          </button>
          {/* Suspend → btn-ghost with brand-red color */}
          <button
            className="btn-ghost click-shift"
            style={{
              color: "var(--brand-red)",
              borderColor: "var(--brand-red)",
            }}
            onClick={() => setModal("suspend")}
          >
            {user.status === "suspended" ? "Unsuspend" : "Suspend"}
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="ud-stats">
        {[
          { label: "Account Age", val: accountAge(user.joined_at) },
          { label: "Total Campaigns", val: String(user.campaigns_total) },
          { label: "Total Earnings", val: formatMoney(user.earnings_total) },
          {
            label: "Push Score",
            val: user.push_score > 0 ? String(user.push_score) : "—",
          },
        ].map(({ label, val }) => (
          <div key={label} className="ud-stat">
            <div className="ud-stat__num">{val}</div>
            <div className="ud-stat__label">{label}</div>
          </div>
        ))}
      </div>

      {/* Detail Tabs */}
      <div className="ud-tabs">
        {detailTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`ud-tab${activeTab === t.key ? " is-active" : ""}`}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.7 }}>
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
      <div className="ud-danger-zone">
        <div className="ud-danger-zone__eyebrow">Danger Zone</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
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
              btnClass: "btn-ghost click-shift",
              btnStyle: {
                color: "var(--brand-red)",
                borderColor: "var(--brand-red)",
              },
            },
            {
              title: "Ban Account",
              sub: "Permanently ban this user. They will not be able to create a new account.",
              action: () => setModal("ban"),
              label: "Ban User",
              btnClass: "btn-ghost click-shift",
              btnStyle: {
                color: "var(--brand-red)",
                borderColor: "var(--brand-red)",
              },
            },
            {
              title: "Delete Account",
              sub: "Permanently delete all data associated with this account. This cannot be undone.",
              action: () => setModal("delete"),
              label: "Delete",
              btnClass: "btn-ghost click-shift",
              btnStyle: {
                color: "var(--brand-red)",
                borderColor: "var(--brand-red)",
              },
            },
          ].map(({ title, sub, action, label, btnClass, btnStyle }) => (
            <div key={title} className="ud-danger-action">
              <div>
                <div className="ud-danger-action__title">{title}</div>
                <div className="ud-danger-action__sub">{sub}</div>
              </div>
              <button className={btnClass} style={btnStyle} onClick={action}>
                {label}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer metadata */}
      <div className="ud-footer-meta">
        Last active {timeAgo(user.last_active)} · User ID: {user.id}
      </div>

      {/* Impersonating banner */}
      {impersonating && (
        <div className="ud-impersonate-banner">
          <div className="ud-impersonate-banner__dot" />
          Impersonating <strong style={{ margin: "0 4px" }}>
            {user.name}
          </strong>{" "}
          — session active
          <button
            className="btn-ghost click-shift"
            style={{
              marginLeft: "auto",
              background: "rgba(255,255,255,0.1)",
              color: "var(--snow)",
              borderColor: "rgba(255,255,255,0.2)",
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
