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
type ActionKind = "approve" | "flag" | "suspend";

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

/* ── Confirm Dialog ──────────────────────────────────────────── */
function ConfirmDialog({
  eyebrow,
  title,
  body,
  confirmLabel,
  variant,
  destructive,
  onCancel,
  onConfirm,
}: {
  eyebrow: string;
  title: string;
  body: React.ReactNode;
  confirmLabel: string;
  variant: "danger" | "primary";
  destructive: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="adm-confirm-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="adm-confirm-title"
      onClick={onCancel}
    >
      <div className="adm-confirm" onClick={(e) => e.stopPropagation()}>
        <div className="adm-confirm__header">
          <div
            className={`adm-confirm__eyebrow${destructive ? "" : " adm-confirm__eyebrow--ink"}`}
          >
            {eyebrow}
          </div>
          <h2 id="adm-confirm-title" className="adm-confirm__title">
            {title}
          </h2>
        </div>
        <div className="adm-confirm__body">{body}</div>
        <div className="adm-confirm__footer">
          <button
            type="button"
            className="adm-confirm__btn adm-confirm__btn--cancel"
            onClick={onCancel}
            autoFocus
          >
            Cancel
          </button>
          <button
            type="button"
            className={`adm-confirm__btn adm-confirm__btn--${variant}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");

  const [pendingAction, setPendingAction] = useState<{
    campaign: AdminCampaign;
    action: ActionKind;
  } | null>(null);

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
    categoryFilter,
    tierFilter,
    budgetMin,
    budgetMax,
  ]);

  /* ── Actions ───────────────────────────────────────────────── */
  async function executeAction(campaignId: string, action: ActionKind) {
    const actionLabels: Record<ActionKind, string> = {
      approve: "Approved",
      flag: "Flagged for review",
      suspend: "Paused",
    };
    try {
      const res = await fetch(`/api/admin/campaigns/${campaignId}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error("Request failed");
      const statusMap: Record<ActionKind, AdminCampaignStatus> = {
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

  function requestAction(campaign: AdminCampaign, action: ActionKind) {
    // Approve is intentional but non-destructive: confirm anyway for audit clarity.
    setPendingAction({ campaign, action });
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

  const HEADERS = [
    "Campaign / Merchant",
    "Status",
    "Tier",
    "Budget",
    "Applicants",
    "Visits",
    "Created",
    "Actions",
  ];

  return (
    <div style={{ fontFamily: "var(--font-body)", color: "var(--ink)" }}>
      {/* Page header */}
      <div className="adm-page-header">
        <div>
          <div className="adm-page-eyebrow">PUSH INTERNAL</div>
          <h1 className="adm-page-title">Campaigns</h1>
        </div>

        <div
          className="adm-kpi-strip"
          role="group"
          aria-label="Campaign totals"
        >
          {[
            {
              label: "Active",
              val: stats.active,
              cls: "adm-kpi-strip__num--blue",
            },
            {
              label: "Pending",
              val: stats.pending,
              cls: "adm-kpi-strip__num--ink",
            },
            {
              label: "Flagged",
              val: stats.flagged,
              cls: "adm-kpi-strip__num--red",
            },
            { label: "Total", val: stats.total, cls: "" },
          ].map(({ label, val, cls }) => (
            <div key={label} className="adm-kpi-strip__item">
              <div className={`adm-kpi-strip__num ${cls}`.trim()}>{val}</div>
              <div className="adm-kpi-strip__label">{label}</div>
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
            aria-hidden="true"
          >
            <circle cx="6.5" cy="6.5" r="4.5" />
            <line x1="10.5" y1="10.5" x2="14" y2="14" />
          </svg>
          <input
            type="search"
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
          aria-live="polite"
        >
          {filtered.length} campaigns
        </span>
      </div>

      {/* Status tabs */}
      <div className="adm-tabs" role="tablist" aria-label="Campaign status">
        {STATUS_TABS.map(({ key, label }) => {
          const isActive = activeTab === key;
          const isFlagged = key === "flagged";
          return (
            <button
              key={key}
              type="button"
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
      <div
        className="adm-table-wrap"
        role="table"
        aria-label="Campaigns"
        style={{ overflowX: "auto" }}
      >
        <div className="adm-cgrid adm-cgrid--head" role="row">
          {HEADERS.map((h) => (
            <span key={h} className="adm-cgrid__head" role="columnheader">
              {h}
            </span>
          ))}
        </div>

        {loading ? (
          <div className="adm-empty">
            <p className="adm-empty__sub">Loading…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="adm-empty">
            <h2 className="adm-empty__title">No campaigns found</h2>
            <p className="adm-empty__sub">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          filtered.map((c) => {
            const isFlagged = c.admin_status === "flagged";
            return (
              <Link
                key={c.id}
                href={`/admin/campaigns/${c.id}`}
                className={`adm-cgrid adm-cgrid--row${isFlagged ? " is-flagged" : ""}`}
                role="row"
                aria-label={`Open campaign ${c.title}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {/* Campaign + merchant */}
                <div>
                  <div className="adm-cgrid__title" title={c.title}>
                    {c.title}
                  </div>
                  <div className="adm-cgrid__merchant">{c.business_name}</div>
                </div>

                <div>
                  <StatusBadge status={c.admin_status} />
                </div>

                <div>
                  <TierBadge tier={c.tier_required} />
                </div>

                <div
                  className={
                    c.payout === 0
                      ? "adm-cgrid__num adm-cgrid__num--muted"
                      : "adm-cgrid__num"
                  }
                >
                  {c.payout === 0 ? "Product" : `$${c.payout}`}
                </div>

                <div
                  className={
                    c.applicants.length > 0
                      ? "adm-cgrid__num"
                      : "adm-cgrid__num adm-cgrid__num--muted"
                  }
                >
                  {c.applicants.length > 0 ? c.applicants.length : "—"}
                </div>

                <div
                  className={
                    c.verified_visits.length > 0
                      ? "adm-cgrid__num"
                      : "adm-cgrid__num adm-cgrid__num--muted"
                  }
                >
                  {c.verified_visits.length > 0
                    ? c.verified_visits.length
                    : "—"}
                </div>

                <div className="adm-cgrid__date">
                  {formatDate(c.created_at)}
                </div>

                {/* Actions */}
                <div
                  className="adm-cgrid__actions"
                  onClick={(e) => e.preventDefault()}
                >
                  {(c.admin_status === "pending" ||
                    c.admin_status === "flagged") && (
                    <button
                      type="button"
                      className="adm-row-btn adm-row-btn--approve"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        requestAction(c, "approve");
                      }}
                      aria-label={`Approve ${c.title}`}
                    >
                      Approve
                    </button>
                  )}

                  {c.admin_status !== "flagged" && (
                    <button
                      type="button"
                      className="adm-row-btn adm-row-btn--danger"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        requestAction(c, "flag");
                      }}
                      aria-label={`Flag ${c.title} for review`}
                    >
                      Flag
                    </button>
                  )}

                  {c.admin_status === "active" && (
                    <button
                      type="button"
                      className="adm-row-btn adm-row-btn--ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        requestAction(c, "suspend");
                      }}
                      aria-label={`Pause ${c.title}`}
                    >
                      Pause
                    </button>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`adm-toast adm-toast--${toast.type === "err" ? "err" : "ok"}`}
          role="status"
          aria-live="polite"
        >
          {toast.msg}
        </div>
      )}

      {/* Confirmation modal */}
      {pendingAction && (
        <ConfirmDialog
          eyebrow={
            pendingAction.action === "approve"
              ? "APPROVE CAMPAIGN"
              : pendingAction.action === "flag"
                ? "FLAG FOR REVIEW"
                : "PAUSE CAMPAIGN"
          }
          title={
            pendingAction.action === "approve"
              ? `Approve ${pendingAction.campaign.title}?`
              : pendingAction.action === "flag"
                ? `Flag ${pendingAction.campaign.title}?`
                : `Pause ${pendingAction.campaign.title}?`
          }
          body={
            pendingAction.action === "approve" ? (
              <>
                <span className="adm-confirm__target">
                  {pendingAction.campaign.business_name}
                </span>{" "}
                will go live and become visible to creators in the eligible
                tier. You can pause it later if needed.
              </>
            ) : pendingAction.action === "flag" ? (
              <>
                Flagging hides the campaign from creators and pauses applicant
                review on{" "}
                <span className="adm-confirm__target">
                  {pendingAction.campaign.business_name}
                </span>
                . The merchant is notified. Active applicants are not paid.
              </>
            ) : (
              <>
                Pausing stops new applications on{" "}
                <span className="adm-confirm__target">
                  {pendingAction.campaign.title}
                </span>
                . Existing accepted creators keep their slots. Reversible at any
                time.
              </>
            )
          }
          confirmLabel={
            pendingAction.action === "approve"
              ? "Approve"
              : pendingAction.action === "flag"
                ? "Flag campaign"
                : "Pause campaign"
          }
          variant={pendingAction.action === "flag" ? "danger" : "primary"}
          destructive={pendingAction.action !== "approve"}
          onCancel={() => setPendingAction(null)}
          onConfirm={() => {
            const a = pendingAction;
            setPendingAction(null);
            executeAction(a.campaign.id, a.action);
          }}
        />
      )}
    </div>
  );
}
