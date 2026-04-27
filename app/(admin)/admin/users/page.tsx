"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import "./users.css";
import type { AdminUser, UserRole, KYCStatus } from "@/lib/admin/mock-users";

/* ── Types ─────────────────────────────────────────── */
type Tab = "all" | "creator" | "merchant" | "admin" | "suspended";

interface ApiResponse {
  users: AdminUser[];
  total: number;
  page: number;
  pages: number;
  stats: {
    total: number;
    todayJoined: number;
    creators: number;
    merchants: number;
    admins: number;
    suspended: number;
  };
}

/* ── Helpers ────────────────────────────────────────── */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
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

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* ── Shared badge style ──────────────────────────────── */
const badgeBase: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  borderRadius: 4,
  padding: "2px 8px",
  display: "inline-block",
  whiteSpace: "nowrap",
};

/* ── Sub-components ──────────────────────────────────── */
function RoleBadge({ role }: { role: UserRole }) {
  const styles: Record<UserRole, { bg: string; color: string }> = {
    creator: {
      bg: "var(--accent-blue-tint)",
      color: "var(--accent-blue)",
    },
    merchant: { bg: "var(--panel-butter)", color: "var(--ink-3)" },
    admin: { bg: "var(--surface-3)", color: "var(--ink-4)" },
  };
  const s = styles[role];
  return (
    <span style={{ ...badgeBase, background: s.bg, color: s.color }}>
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
        ...badgeBase,
        background: "var(--surface-3)",
        color: "var(--ink-4)",
      }}
    >
      {tier}
    </span>
  );
}

function StatusBadge({ status }: { status: AdminUser["status"] }) {
  const styles: Record<string, { bg: string; color: string }> = {
    active: { bg: "var(--accent-blue-tint)", color: "var(--accent-blue)" },
    pending: { bg: "var(--panel-butter)", color: "var(--ink-3)" },
    suspended: {
      bg: "rgba(193,18,31,0.10)",
      color: "var(--brand-red)",
    },
    banned: { bg: "rgba(193,18,31,0.15)", color: "var(--brand-red)" },
  };
  const s = styles[status] ?? {
    bg: "var(--surface-3)",
    color: "var(--ink-4)",
  };
  return (
    <span style={{ ...badgeBase, background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

function KYCBadge({ status }: { status: KYCStatus }) {
  const labels: Record<KYCStatus, string> = {
    verified: "KYC Verified",
    pending: "KYC Pending",
    rejected: "KYC Failed",
    not_submitted: "No KYC",
  };
  const styles: Record<KYCStatus, { bg: string; color: string }> = {
    verified: { bg: "var(--accent-blue-tint)", color: "var(--accent-blue)" },
    pending: { bg: "var(--panel-butter)", color: "var(--ink-3)" },
    rejected: { bg: "rgba(193,18,31,0.10)", color: "var(--brand-red)" },
    not_submitted: { bg: "var(--surface-3)", color: "var(--ink-4)" },
  };
  const s = styles[status];
  return (
    <span style={{ ...badgeBase, background: s.bg, color: s.color }}>
      {labels[status]}
    </span>
  );
}

function UserAvatar({ user }: { user: AdminUser }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        background: "var(--surface-3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {user.avatar && !imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.avatar}
          alt={user.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={() => setImgError(true)}
        />
      ) : (
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--ink-4)",
          }}
        >
          {initials(user.name)}
        </span>
      )}
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────── */
export default function AdminUsersPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [tab, setTab] = useState<Tab>("all");
  const [kycFilter, setKycFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [impersonating, setImpersonating] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const fetchUsers = useCallback(async () => {
    const params = new URLSearchParams({
      tab,
      kyc: kycFilter,
      search,
      page: String(page),
      limit: "20",
    });
    const res = await fetch(`/api/admin/users?${params}`);
    const json: ApiResponse = await res.json();
    setData(json);
  }, [tab, kycFilter, search, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
    setSelected(new Set());
  }, [tab, kycFilter, search]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (!data) return;
    if (selected.size === data.users.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(data.users.map((u) => u.id)));
    }
  }

  async function handleImpersonate(user: AdminUser, e: React.MouseEvent) {
    e.stopPropagation();
    const res = await fetch(`/api/admin/users/${user.id}/impersonate`, {
      method: "POST",
    });
    if (res.ok) {
      setImpersonating({ id: user.id, name: user.name });
    }
  }

  async function handleSuspend(user: AdminUser, e: React.MouseEvent) {
    e.stopPropagation();
    await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: user.status === "suspended" ? "active" : "suspended",
      }),
    });
    fetchUsers();
  }

  function handleExportCSV() {
    if (!data) return;
    const users =
      selected.size > 0
        ? data.users.filter((u) => selected.has(u.id))
        : data.users;
    const rows = [
      [
        "ID",
        "Name",
        "Handle",
        "Email",
        "Role",
        "Tier",
        "Status",
        "KYC",
        "Joined",
        "Last Active",
        "Campaigns",
        "Earnings",
        "Score",
      ],
      ...users.map((u) => [
        u.id,
        u.name,
        u.handle,
        u.email,
        u.role,
        u.tier || "",
        u.status,
        u.kyc_status,
        formatDate(u.joined_at),
        formatDate(u.last_active),
        u.campaigns_total,
        u.earnings_total,
        u.push_score,
      ]),
    ];
    const csv = rows.map((r) => r.map(String).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `push-users-${tab}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const stats = data?.stats;

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "all", label: "All", count: stats?.total },
    { key: "creator", label: "Creators", count: stats?.creators },
    { key: "merchant", label: "Merchants", count: stats?.merchants },
    { key: "admin", label: "Admins", count: stats?.admins },
    { key: "suspended", label: "Suspended", count: stats?.suspended },
  ];

  const TABLE_COLS = [
    "User",
    "Role / Tier",
    "Joined",
    "Last Active",
    "Status",
    "KYC",
    "Score",
    "Actions",
  ];

  return (
    <div style={{ fontFamily: "var(--font-body)", color: "var(--ink)" }}>
      {/* Page header */}
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">PUSH INTERNAL</div>
          <h1 className="adm-page-title">Users</h1>
        </div>
        <button className="btn-ghost click-shift" onClick={handleExportCSV}>
          Export CSV
        </button>
      </div>

      {/* KPI row */}
      <div
        className="adm-kpi-grid"
        style={{ gridTemplateColumns: "repeat(5,1fr)" }}
      >
        {[
          {
            label: "Total Users",
            val: String(stats?.total ?? "—"),
            color: "var(--ink)",
          },
          {
            label: "Joined Today",
            val: `+${stats?.todayJoined ?? 0}`,
            color: "var(--accent-blue)",
          },
          {
            label: "Creators",
            val: String(stats?.creators ?? "—"),
            color: "var(--ink)",
          },
          {
            label: "Merchants",
            val: String(stats?.merchants ?? "—"),
            color: "var(--ink)",
          },
          {
            label: "Suspended",
            val: String(stats?.suspended ?? 0),
            color: "var(--brand-red)",
          },
        ].map(({ label, val, color }) => (
          <div key={label} className="adm-kpi-card">
            <div className="adm-kpi-card__value" style={{ color }}>
              {val}
            </div>
            <div className="adm-kpi-card__eyebrow">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="adm-tabs">
        {tabs.map((t) => {
          const isActive = tab === t.key;
          const isSuspended = t.key === "suspended";
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`adm-tab${isActive ? (isSuspended ? " active--danger" : " active") : ""}`}
            >
              {t.label}
              {t.count !== undefined && (
                <span className="adm-tab__count">{t.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="adm-filter-bar">
        <div className="adm-search-wrap">
          <svg
            className="adm-search-icon"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="6.5" cy="6.5" r="4.5" />
            <line x1="10.5" y1="10.5" x2="14" y2="14" />
          </svg>
          <input
            type="text"
            placeholder="Search name, email, handle…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={kycFilter}
          onChange={(e) => setKycFilter(e.target.value)}
        >
          <option value="all">All KYC</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="not_submitted">Not Submitted</option>
        </select>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--ink-5)",
            marginLeft: "auto",
          }}
        >
          {data?.total ?? 0} users
        </span>
      </div>

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div className="adm-bulk-bar">
          <span>{selected.size} selected</span>
          <div style={{ display: "flex", gap: 8, marginLeft: 8 }}>
            <button className="adm-bulk-btn" onClick={handleExportCSV}>
              Export CSV
            </button>
            <button className="adm-bulk-btn">Send Email</button>
            <button className="adm-bulk-btn adm-bulk-btn--danger">
              Suspend All
            </button>
          </div>
          <button
            className="adm-bulk-btn"
            style={{ marginLeft: "auto" }}
            onClick={() => setSelected(new Set())}
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="adm-table-wrap" style={{ overflowX: "auto" }}>
        {!data ? (
          <div
            style={{
              padding: "48px 24px",
              textAlign: "center",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--ink-5)",
            }}
          >
            Loading…
          </div>
        ) : data.users.length === 0 ? (
          <div
            style={{
              padding: "56px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: 8,
              }}
            >
              No users found
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--ink-5)",
              }}
            >
              Try adjusting your filters.
            </div>
          </div>
        ) : (
          <table className="adm-table" style={{ minWidth: 900 }}>
            <thead>
              <tr>
                <th style={{ width: 40, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    style={{ width: 14, height: 14 }}
                    checked={
                      selected.size === data.users.length &&
                      data.users.length > 0
                    }
                    onChange={toggleAll}
                  />
                </th>
                {TABLE_COLS.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr
                  key={user.id}
                  style={{
                    background: selected.has(user.id)
                      ? "rgba(0,133,255,0.04)"
                      : "transparent",
                  }}
                  onClick={() =>
                    (window.location.href = `/admin/users/${user.id}`)
                  }
                >
                  <td
                    style={{ textAlign: "center" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelect(user.id);
                    }}
                  >
                    <input
                      type="checkbox"
                      style={{ width: 14, height: 14 }}
                      checked={selected.has(user.id)}
                      onChange={() => toggleSelect(user.id)}
                    />
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <UserAvatar user={user} />
                      <div>
                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--ink)",
                          }}
                        >
                          {user.name}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 11,
                            color: "var(--ink-5)",
                          }}
                        >
                          {user.handle}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      <RoleBadge role={user.role} />
                      <TierBadge tier={user.tier} />
                    </div>
                  </td>
                  <td>{formatDate(user.joined_at)}</td>
                  <td>{timeAgo(user.last_active)}</td>
                  <td>
                    <StatusBadge status={user.status} />
                  </td>
                  <td>
                    <KYCBadge status={user.kyc_status} />
                  </td>
                  <td>
                    {user.push_score > 0 ? (
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 16,
                          fontWeight: 900,
                          color:
                            user.push_score >= 80
                              ? "var(--accent-blue)"
                              : user.push_score >= 50
                                ? "var(--ink)"
                                : "var(--ink-5)",
                        }}
                      >
                        {user.push_score}
                      </span>
                    ) : (
                      <span style={{ color: "var(--ink-5)" }}>—</span>
                    )}
                  </td>
                  <td
                    style={{ textAlign: "right" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="adm-row-btn adm-row-btn--view"
                      >
                        View
                      </Link>
                      <button
                        className="adm-row-btn adm-row-btn--ghost"
                        onClick={(e) => handleImpersonate(user, e)}
                      >
                        Imp.
                      </button>
                      <button
                        className="adm-row-btn adm-row-btn--danger"
                        onClick={(e) => handleSuspend(user, e)}
                      >
                        {user.status === "suspended" ? "Unsuspend" : "Suspend"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="adm-pagination">
          <div>
            Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, data.total)} of{" "}
            {data.total}
          </div>
          <div className="adm-pagination__controls">
            <button
              className="adm-page-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ‹
            </button>
            {Array.from(
              { length: Math.min(data.pages, 7) },
              (_, i) => i + 1,
            ).map((p) => (
              <button
                key={p}
                className={`adm-page-btn${p === page ? " active" : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="adm-page-btn"
              disabled={page === data.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* Impersonate banner */}
      {impersonating && (
        <div className="adm-impersonate">
          <div className="adm-impersonate__dot" />
          Impersonating{" "}
          <strong style={{ margin: "0 4px" }}>{impersonating.name}</strong> —
          session active
          <button
            className="adm-bulk-btn"
            style={{ marginLeft: "auto" }}
            onClick={() => {
              document.cookie = "push-impersonating=; max-age=0; path=/";
              setImpersonating(null);
            }}
          >
            End Session
          </button>
        </div>
      )}
    </div>
  );
}
