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

/* ── Sub-components ──────────────────────────────────── */
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
    verified: "KYC ✓",
    pending: "KYC Pending",
    rejected: "KYC Fail",
    not_submitted: "No KYC",
  };
  return <span className={`badge badge-kyc-${status}`}>{labels[status]}</span>;
}

function UserAvatar({ user }: { user: AdminUser }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="user-avatar">
      {user.avatar && !imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.avatar}
          alt={user.name}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="user-avatar-fallback">{initials(user.name)}</div>
      )}
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

  // Reset page on filter change
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
  }

  const stats = data?.stats;

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "all", label: "All", count: stats?.total },
    { key: "creator", label: "Creators", count: stats?.creators },
    { key: "merchant", label: "Merchants", count: stats?.merchants },
    { key: "admin", label: "Admins", count: stats?.admins },
    { key: "suspended", label: "Suspended", count: stats?.suspended },
  ];

  return (
    <div className="admin-shell">
      <AdminSidebar active="/admin/users" />

      <main className="admin-main">
        {/* Topbar */}
        <div className="admin-topbar">
          <div className="admin-topbar-breadcrumb">
            Admin <span>/</span> <span>Users</span>
          </div>
          <div className="admin-topbar-actions">
            <button
              className="btn-admin btn-admin-ghost"
              onClick={handleExportCSV}
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Hero */}
        <div className="users-hero">
          <div className="users-hero-eyebrow">Push Admin — User Management</div>
          <h1 className="users-hero-title">Users.</h1>
          <div className="users-hero-stats">
            <div className="users-hero-stat">
              <div className="users-hero-stat-num">{stats?.total ?? "—"}</div>
              <div className="users-hero-stat-label">Total Users</div>
            </div>
            <div className="users-hero-stat-divider" />
            <div className="users-hero-stat">
              <div className="users-hero-stat-num">
                +{stats?.todayJoined ?? 0}
              </div>
              <div className="users-hero-stat-label">Joined Today</div>
            </div>
            <div className="users-hero-stat-divider" />
            <div className="users-hero-stat">
              <div className="users-hero-stat-num">
                {stats?.creators ?? "—"}
              </div>
              <div className="users-hero-stat-label">Creators</div>
            </div>
            <div className="users-hero-stat-divider" />
            <div className="users-hero-stat">
              <div className="users-hero-stat-num">
                {stats?.merchants ?? "—"}
              </div>
              <div className="users-hero-stat-label">Merchants</div>
            </div>
            <div className="users-hero-stat-divider" />
            <div className="users-hero-stat">
              <div
                className="users-hero-stat-num"
                style={{ color: "var(--primary)" }}
              >
                {stats?.suspended ?? 0}
              </div>
              <div className="users-hero-stat-label">Suspended</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="users-controls">
          <div className="users-tabs">
            {tabs.map((t) => (
              <button
                key={t.key}
                className={`users-tab ${tab === t.key ? "active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
                {t.count !== undefined && (
                  <span className="users-tab-count">{t.count}</span>
                )}
              </button>
            ))}
          </div>

          <div className="users-filters">
            <div className="users-search">
              <span className="users-search-icon">⌕</span>
              <input
                type="text"
                placeholder="Search name, email, handle…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
            >
              <option value="all">All KYC</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="not_submitted">Not Submitted</option>
            </select>

            <div className="users-filters-right">
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                {data?.total ?? 0} users
              </span>
            </div>
          </div>

          {/* Bulk bar */}
          <div className={`bulk-bar ${selected.size > 0 ? "visible" : ""}`}>
            <span className="bulk-bar-count">{selected.size} selected</span>
            <div className="bulk-bar-actions">
              <button
                className="btn-admin btn-admin-ghost"
                onClick={handleExportCSV}
              >
                Export CSV
              </button>
              <button className="btn-admin btn-admin-ghost">Send Email</button>
              <button className="btn-admin btn-admin-danger">
                Suspend All
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="users-table-wrap">
          {!data ? (
            <div className="users-empty">
              <div className="users-empty-icon">◌</div>
              <div className="users-empty-title">Loading…</div>
            </div>
          ) : data.users.length === 0 ? (
            <div className="users-empty">
              <div className="users-empty-icon">◯</div>
              <div className="users-empty-title">No users found</div>
              <div className="users-empty-sub">Try adjusting your filters.</div>
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th className="col-check">
                    <input
                      type="checkbox"
                      className="table-checkbox"
                      checked={
                        selected.size === data.users.length &&
                        data.users.length > 0
                      }
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="sortable">User</th>
                  <th className="sortable">Role / Tier</th>
                  <th className="sortable">Joined</th>
                  <th className="sortable">Last Active</th>
                  <th className="sortable">Status</th>
                  <th className="sortable">KYC</th>
                  <th className="sortable">Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user) => (
                  <tr
                    key={user.id}
                    className={selected.has(user.id) ? "selected" : ""}
                    onClick={() =>
                      (window.location.href = `/admin/users/${user.id}`)
                    }
                  >
                    <td
                      className="col-check"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(user.id);
                      }}
                    >
                      <input
                        type="checkbox"
                        className="table-checkbox"
                        checked={selected.has(user.id)}
                        onChange={() => toggleSelect(user.id)}
                      />
                    </td>
                    <td>
                      <div className="user-cell">
                        <UserAvatar user={user} />
                        <div>
                          <div className="user-name">{user.name}</div>
                          <div className="user-handle">{user.handle}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div
                        style={{ display: "flex", gap: 4, flexWrap: "wrap" }}
                      >
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
                            fontWeight: 700,
                            color:
                              user.push_score >= 80
                                ? "var(--success-dark)"
                                : user.push_score >= 50
                                  ? "var(--dark)"
                                  : "var(--graphite)",
                          }}
                        >
                          {user.push_score}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)" }}>—</span>
                      )}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="table-actions">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="action-btn"
                        >
                          View
                        </Link>
                        <button
                          className="action-btn"
                          onClick={(e) => handleImpersonate(user, e)}
                        >
                          Impersonate
                        </button>
                        <button
                          className={`action-btn ${user.status !== "suspended" ? "danger" : ""}`}
                          onClick={(e) => handleSuspend(user, e)}
                        >
                          {user.status === "suspended"
                            ? "Unsuspend"
                            : "Suspend"}
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
          <div className="users-pagination">
            <div className="pagination-info">
              Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, data.total)} of{" "}
              {data.total}
            </div>
            <div className="pagination-controls">
              <button
                className="pagination-btn"
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
                  className={`pagination-btn ${p === page ? "active" : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="pagination-btn"
                disabled={page === data.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Impersonate banner */}
      {impersonating && (
        <div className="impersonate-banner">
          <div className="impersonate-banner-dot" />
          Impersonating{" "}
          <strong style={{ margin: "0 4px" }}>{impersonating.name}</strong> —
          session active
          <button
            className="btn-admin btn-admin-outline"
            style={{
              marginLeft: "auto",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
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
