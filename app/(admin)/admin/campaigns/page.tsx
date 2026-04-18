"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import "./campaigns.css";
import {
  ADMIN_CAMPAIGNS,
  ADMIN_CAMPAIGN_STATUS_LABELS,
  type AdminCampaign,
  type AdminCampaignStatus,
} from "@/lib/admin/mock-campaigns";
import { TIER_LABELS, type CreatorTier } from "@/lib/demo-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type StatusFilter = AdminCampaignStatus | "all";

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

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [merchantFilter, setMerchantFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");

  // Action feedback
  const [toast, setToast] = useState<{
    msg: string;
    type: "ok" | "err";
  } | null>(null);

  // Load from mock (bypasses fetch latency in this all-mock setup)
  useEffect(() => {
    setCampaigns(ADMIN_CAMPAIGNS);
    setLoading(false);
  }, []);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  // ---------------------------------------------------------------------------
  // Computed stats
  // ---------------------------------------------------------------------------

  const stats = useMemo(
    () => ({
      total: campaigns.length,
      active: campaigns.filter((c) => c.admin_status === "active").length,
      pending: campaigns.filter((c) => c.admin_status === "pending").length,
      flagged: campaigns.filter((c) => c.admin_status === "flagged").length,
      paused: campaigns.filter((c) => c.admin_status === "paused").length,
    }),
    [campaigns],
  );

  // ---------------------------------------------------------------------------
  // Filtered list
  // ---------------------------------------------------------------------------

  const filtered = useMemo(() => {
    let list = campaigns;

    if (activeTab !== "all") {
      list = list.filter((c) => c.admin_status === activeTab);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.business_name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      );
    }

    if (merchantFilter.trim()) {
      const q = merchantFilter.toLowerCase();
      list = list.filter((c) => c.business_name.toLowerCase().includes(q));
    }

    if (categoryFilter) {
      list = list.filter(
        (c) => c.category.toLowerCase() === categoryFilter.toLowerCase(),
      );
    }

    if (tierFilter) {
      list = list.filter((c) => c.tier_required === tierFilter);
    }

    if (budgetMin !== "") {
      const min = parseFloat(budgetMin);
      if (!isNaN(min)) list = list.filter((c) => c.payout >= min);
    }

    if (budgetMax !== "") {
      const max = parseFloat(budgetMax);
      if (!isNaN(max)) list = list.filter((c) => c.payout <= max);
    }

    return list;
  }, [
    campaigns,
    activeTab,
    search,
    merchantFilter,
    categoryFilter,
    tierFilter,
    budgetMin,
    budgetMax,
  ]);

  // ---------------------------------------------------------------------------
  // Admin quick actions
  // ---------------------------------------------------------------------------

  async function handleAction(
    campaignId: string,
    action: "approve" | "flag" | "suspend",
  ) {
    const actionLabels = {
      approve: "Approved",
      flag: "Flagged",
      suspend: "Suspended",
    };

    try {
      const res = await fetch(`/api/admin/campaigns/${campaignId}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) throw new Error("Request failed");

      const statusMap: Record<typeof action, AdminCampaignStatus> = {
        approve: "active",
        flag: "flagged",
        suspend: "paused",
      };

      // Optimistic update
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaignId
            ? {
                ...c,
                admin_status: statusMap[action],
                status: statusMap[action],
              }
            : c,
        ),
      );

      showToast(`Campaign ${actionLabels[action]}`);
    } catch {
      showToast("Action failed — try again", "err");
    }
  }

  // ---------------------------------------------------------------------------
  // UI helpers
  // ---------------------------------------------------------------------------

  const STATUS_TABS: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "active", label: "Active" },
    { key: "flagged", label: "Flagged" },
    { key: "paused", label: "Paused" },
    { key: "completed", label: "Completed" },
    { key: "draft", label: "Drafts" },
  ];

  const TAB_COUNTS: Record<StatusFilter, number> = {
    all: stats.total,
    active: stats.active,
    pending: stats.pending,
    flagged: stats.flagged,
    paused: stats.paused,
    completed: campaigns.filter((c) => c.admin_status === "completed").length,
    draft: campaigns.filter((c) => c.admin_status === "draft").length,
  };

  const CATEGORIES = [...new Set(campaigns.map((c) => c.category))].sort();

  const TIERS: CreatorTier[] = [
    "seed",
    "explorer",
    "operator",
    "proven",
    "closer",
    "partner",
  ];

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

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

      <div className="adm-body">
        {/* Hero */}
        <header className="adm-hero">
          <div className="adm-hero__eyebrow">Admin — Moderation</div>
          <h1 className="adm-hero__title">All campaigns.</h1>
          <div className="adm-hero__stats">
            <div className="adm-hero__stat">
              <strong>{stats.active}</strong> active
            </div>
            <div className="adm-hero__stat-divider" />
            <div className="adm-hero__stat">
              <strong>{stats.pending}</strong> pending review
            </div>
            <div className="adm-hero__stat-divider" />
            <div className="adm-hero__stat adm-hero__stat--flagged">
              <strong>{stats.flagged}</strong> flagged
            </div>
            <div className="adm-hero__stat-divider" />
            <div className="adm-hero__stat">
              <strong>{stats.total}</strong> total
            </div>
          </div>
        </header>

        {/* Search + filter bar */}
        <div className="adm-filter-bar">
          <div className="adm-search">
            <svg
              className="adm-search__icon"
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <circle cx="6.5" cy="6.5" r="4.5" />
              <line x1="10.5" y1="10.5" x2="14" y2="14" />
            </svg>
            <input
              className="adm-search__input"
              type="text"
              placeholder="Search title, merchant, description…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search campaigns"
            />
          </div>

          <select
            className="adm-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="adm-select"
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            aria-label="Filter by tier"
          >
            <option value="">All Tiers</option>
            {TIERS.map((t) => (
              <option key={t} value={t}>
                {TIER_LABELS[t]}
              </option>
            ))}
          </select>

          <input
            className="adm-select"
            type="number"
            min={0}
            placeholder="Budget min ($)"
            value={budgetMin}
            onChange={(e) => setBudgetMin(e.target.value)}
            style={{ width: 120 }}
            aria-label="Budget minimum"
          />
          <input
            className="adm-select"
            type="number"
            min={0}
            placeholder="Budget max ($)"
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value)}
            style={{ width: 120 }}
            aria-label="Budget maximum"
          />
        </div>

        {/* Status tabs */}
        <div className="adm-status-tabs" role="tablist">
          {STATUS_TABS.map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              aria-selected={activeTab === key}
              className={[
                "adm-status-tab",
                activeTab === key ? "adm-status-tab--active" : "",
                key === "flagged" ? "adm-status-tab--flagged" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setActiveTab(key)}
            >
              {label}
              <span className="adm-tab-count">{TAB_COUNTS[key]}</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="adm-table-wrap">
          {/* Header */}
          <div className="adm-table-header" role="row">
            <div className="adm-table-header__cell">Campaign / Merchant</div>
            <div className="adm-table-header__cell">Status</div>
            <div className="adm-table-header__cell">Tier</div>
            <div className="adm-table-header__cell">Budget</div>
            <div className="adm-table-header__cell">Applicants</div>
            <div className="adm-table-header__cell">Visits</div>
            <div className="adm-table-header__cell">Created</div>
            <div className="adm-table-header__cell">Actions</div>
          </div>

          {/* Rows */}
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="adm-skeleton-row skeleton" />
            ))
          ) : filtered.length === 0 ? (
            <div className="adm-empty">
              <div className="adm-empty__title">No campaigns found</div>
              <div className="adm-empty__sub">
                Try adjusting your filters or search query.
              </div>
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                role="row"
                className={[
                  "adm-table-row",
                  c.admin_status === "flagged" ? "adm-table-row--flagged" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {/* Campaign + merchant */}
                <div>
                  <div className="adm-row__title" title={c.title}>
                    {c.title}
                  </div>
                  <div className="adm-row__merchant">{c.business_name}</div>
                </div>

                {/* Status */}
                <div className="adm-row__cell">
                  <StatusBadge status={c.admin_status} />
                </div>

                {/* Tier */}
                <div className="adm-row__cell">
                  <TierBadge tier={c.tier_required} />
                </div>

                {/* Budget */}
                <div className="adm-row__cell">
                  {c.payout === 0 ? (
                    <span className="adm-row__cell--muted">Product</span>
                  ) : (
                    `$${c.payout}`
                  )}
                </div>

                {/* Applicants */}
                <div className="adm-row__cell">
                  {c.applicants.length > 0 ? (
                    c.applicants.length
                  ) : (
                    <span className="adm-row__cell--muted">—</span>
                  )}
                </div>

                {/* Verified visits */}
                <div className="adm-row__cell">
                  {c.verified_visits.length > 0 ? (
                    c.verified_visits.length
                  ) : (
                    <span className="adm-row__cell--muted">—</span>
                  )}
                </div>

                {/* Created date */}
                <div className="adm-row__cell adm-row__cell--muted">
                  {formatDate(c.created_at)}
                </div>

                {/* Actions */}
                <div className="adm-row__actions">
                  <Link
                    href={`/admin/campaigns/${c.id}`}
                    className="adm-action-btn adm-action-btn--view"
                  >
                    View
                  </Link>

                  {(c.admin_status === "pending" ||
                    c.admin_status === "flagged") && (
                    <button
                      className="adm-action-btn adm-action-btn--approve"
                      onClick={() => handleAction(c.id, "approve")}
                    >
                      Approve
                    </button>
                  )}

                  {c.admin_status !== "flagged" && (
                    <button
                      className="adm-action-btn adm-action-btn--flag"
                      onClick={() => handleAction(c.id, "flag")}
                    >
                      Flag
                    </button>
                  )}

                  {c.admin_status === "active" && (
                    <button
                      className="adm-action-btn adm-action-btn--suspend"
                      onClick={() => handleAction(c.id, "suspend")}
                    >
                      Suspend
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
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
