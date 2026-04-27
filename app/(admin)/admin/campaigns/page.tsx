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

type StatusFilter = AdminCampaignStatus | "all";

/* ── Badges ──────────────────────────────────────────────────── */
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

function StatusBadge({ status }: { status: AdminCampaignStatus }) {
  const styles: Record<AdminCampaignStatus, { bg: string; color: string }> = {
    active: { bg: "var(--accent-blue-tint)", color: "var(--accent-blue)" },
    pending: { bg: "var(--panel-butter)", color: "var(--ink-3)" },
    flagged: { bg: "rgba(193,18,31,0.10)", color: "var(--brand-red)" },
    paused: { bg: "var(--surface-3)", color: "var(--ink-4)" },
    completed: { bg: "var(--surface-3)", color: "var(--ink-4)" },
    draft: { bg: "var(--surface-3)", color: "var(--ink-4)" },
  };
  const s = styles[status] ?? { bg: "var(--surface-3)", color: "var(--ink-4)" };
  return (
    <span style={{ ...badgeBase, background: s.bg, color: s.color }}>
      {ADMIN_CAMPAIGN_STATUS_LABELS[status]}
    </span>
  );
}

function TierBadge({ tier }: { tier: CreatorTier }) {
  return (
    <span
      style={{
        ...badgeBase,
        background: "var(--surface-3)",
        color: "var(--ink-4)",
      }}
    >
      {TIER_LABELS[tier]}
    </span>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [merchantFilter, setMerchantFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");

  const [toast, setToast] = useState<{
    msg: string;
    type: "ok" | "err";
  } | null>(null);

  useEffect(() => {
    setCampaigns(ADMIN_CAMPAIGNS);
    setLoading(false);
  }, []);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  /* ── Stats ─────────────────────────────────────────────────── */
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

  /* ── Filtered list ─────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let list = campaigns;
    if (activeTab !== "all")
      list = list.filter((c) => c.admin_status === activeTab);
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
    if (categoryFilter)
      list = list.filter(
        (c) => c.category.toLowerCase() === categoryFilter.toLowerCase(),
      );
    if (tierFilter) list = list.filter((c) => c.tier_required === tierFilter);
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

  /* ── Actions ───────────────────────────────────────────────── */
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

  /* ── Tab config ────────────────────────────────────────────── */
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

  const inputStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: 13,
    color: "var(--ink)",
    background: "var(--surface-2)",
    border: "1px solid var(--hairline)",
    borderRadius: 8,
    padding: "8px 12px",
    outline: "none",
    height: 40,
  };

  return (
    <div style={{ fontFamily: "var(--font-body)", color: "var(--ink)" }}>
      {/* Page header */}
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">PUSH INTERNAL</div>
          <h1 className="adm-page-title">Campaigns</h1>
        </div>

        {/* KPI inline summary */}
        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "center",
            background: "var(--surface-2)",
            border: "1px solid var(--hairline)",
            borderRadius: 10,
            padding: "12px 24px",
          }}
        >
          {[
            { label: "Active", val: stats.active, color: "var(--accent-blue)" },
            { label: "Pending", val: stats.pending, color: "var(--ink-3)" },
            { label: "Flagged", val: stats.flagged, color: "var(--brand-red)" },
            { label: "Total", val: stats.total, color: "var(--ink)" },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 24,
                  fontWeight: 900,
                  color,
                  lineHeight: 1,
                }}
              >
                {val}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--ink-5)",
                  marginTop: 2,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
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
            placeholder="Search title, merchant, description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search campaigns"
          />
        </div>
        <select
          style={inputStyle}
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
          style={inputStyle}
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
          style={{ ...inputStyle, width: 112 }}
          type="number"
          min={0}
          placeholder="Budget min ($)"
          value={budgetMin}
          onChange={(e) => setBudgetMin(e.target.value)}
          aria-label="Budget minimum"
        />
        <input
          style={{ ...inputStyle, width: 112 }}
          type="number"
          min={0}
          placeholder="Budget max ($)"
          value={budgetMax}
          onChange={(e) => setBudgetMax(e.target.value)}
          aria-label="Budget maximum"
        />
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--ink-5)",
            marginLeft: "auto",
          }}
        >
          {filtered.length} campaigns
        </span>
      </div>

      {/* Status tabs */}
      <div className="adm-tabs" role="tablist">
        {STATUS_TABS.map(({ key, label }) => {
          const isActive = activeTab === key;
          const isFlagged = key === "flagged";
          return (
            <button
              key={key}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(key)}
              className={`adm-tab${isActive ? (isFlagged ? " active--danger" : " active") : ""}`}
            >
              {label}
              <span className="adm-tab__count">{TAB_COUNTS[key]}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="adm-table-wrap" style={{ overflowX: "auto" }}>
        {/* Header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(180px,2fr) 96px 80px 80px 80px 80px 72px 152px",
            padding: "10px 20px",
            borderBottom: "1px solid var(--hairline)",
            background: "var(--surface-3)",
          }}
          role="row"
        >
          {[
            "Campaign / Merchant",
            "Status",
            "Tier",
            "Budget",
            "Applicants",
            "Visits",
            "Created",
            "Actions",
          ].map((h) => (
            <span
              key={h}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--ink-5)",
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
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
        ) : filtered.length === 0 ? (
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
              No campaigns found
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--ink-5)",
              }}
            >
              Try adjusting your filters or search query.
            </div>
          </div>
        ) : (
          filtered.map((c) => (
            <div
              key={c.id}
              role="row"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(180px,2fr) 96px 80px 80px 80px 80px 72px 152px",
                padding: "12px 20px",
                borderBottom: "1px solid var(--hairline)",
                alignItems: "center",
                background:
                  c.admin_status === "flagged"
                    ? "rgba(193,18,31,0.04)"
                    : "transparent",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => {
                if (c.admin_status !== "flagged")
                  e.currentTarget.style.background = "var(--surface-3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  c.admin_status === "flagged"
                    ? "rgba(193,18,31,0.04)"
                    : "transparent";
              }}
            >
              {/* Campaign + merchant */}
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--ink)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={c.title}
                >
                  {c.title}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: "var(--ink-5)",
                    marginTop: 2,
                  }}
                >
                  {c.business_name}
                </div>
              </div>

              <div>
                <StatusBadge status={c.admin_status} />
              </div>

              <div>
                <TierBadge tier={c.tier_required} />
              </div>

              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: c.payout === 0 ? "var(--ink-5)" : "var(--ink)",
                  fontWeight: c.payout === 0 ? 400 : 600,
                }}
              >
                {c.payout === 0 ? "Product" : `$${c.payout}`}
              </div>

              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color:
                    c.applicants.length > 0 ? "var(--ink)" : "var(--ink-5)",
                  fontWeight: c.applicants.length > 0 ? 600 : 400,
                }}
              >
                {c.applicants.length > 0 ? c.applicants.length : "—"}
              </div>

              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color:
                    c.verified_visits.length > 0
                      ? "var(--ink)"
                      : "var(--ink-5)",
                  fontWeight: c.verified_visits.length > 0 ? 600 : 400,
                }}
              >
                {c.verified_visits.length > 0 ? c.verified_visits.length : "—"}
              </div>

              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  color: "var(--ink-5)",
                }}
              >
                {formatDate(c.created_at)}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Link
                  href={`/admin/campaigns/${c.id}`}
                  className="adm-row-btn adm-row-btn--view"
                >
                  View
                </Link>

                {(c.admin_status === "pending" ||
                  c.admin_status === "flagged") && (
                  <button
                    className="adm-row-btn"
                    style={{
                      background: "var(--accent-blue-tint)",
                      color: "var(--accent-blue)",
                      border: "1px solid rgba(0,133,255,0.2)",
                    }}
                    onClick={() => handleAction(c.id, "approve")}
                  >
                    Approve
                  </button>
                )}

                {c.admin_status !== "flagged" && (
                  <button
                    className="adm-row-btn adm-row-btn--danger"
                    onClick={() => handleAction(c.id, "flag")}
                  >
                    Flag
                  </button>
                )}

                {c.admin_status === "active" && (
                  <button
                    className="adm-row-btn adm-row-btn--ghost"
                    onClick={() => handleAction(c.id, "suspend")}
                  >
                    Pause
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`adm-toast adm-toast--${toast.type === "err" ? "err" : "ok"}`}
          role="status"
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
