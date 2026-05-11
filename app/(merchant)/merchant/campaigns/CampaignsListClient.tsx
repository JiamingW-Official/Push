"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  EmptyState,
  FilterTabs,
  ProgressBar,
  StatusBadge,
} from "@/components/merchant/shared";
import { CampaignStatus, type Campaign } from "@/lib/data/types";

interface CampaignsListClientProps {
  campaigns: Campaign[];
}

const TAB_ORDER = ["all", "active", "paused", "draft", "closed"] as const;
type TabValue = (typeof TAB_ORDER)[number];

function numberOrZero(value: number | null | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function formatUsd(value: number | null | undefined): string {
  return `$${numberOrZero(value).toLocaleString("en-US")}`;
}

function formatDeadline(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getBadgeStatus(
  status: Campaign["status"],
): "active" | "paused" | "draft" | "closed" {
  if (
    status === CampaignStatus.Completed ||
    status === CampaignStatus.Cancelled
  ) {
    return "closed";
  }

  return status;
}

function getCategory(campaign: Campaign): string {
  const tags = campaign.tags ?? [];
  const value = tags.find((tag) => tag.trim());
  return value ?? "—";
}

function matchesTab(campaign: Campaign, tab: TabValue): boolean {
  if (tab === "all") {
    return true;
  }

  return getBadgeStatus(campaign.status) === tab;
}

export function CampaignsListClient({ campaigns }: CampaignsListClientProps) {
  const searchParams = useSearchParams();
  const initialTab = ((): TabValue => {
    const status = searchParams?.get("status");
    return status && (TAB_ORDER as readonly string[]).includes(status)
      ? (status as TabValue)
      : "all";
  })();
  const [activeTab, setActiveTab] = useState<TabValue>(initialTab);

  // If the URL ?status= param changes after a Save-as-draft redirect,
  // sync the active tab. (useSearchParams returns a stable object, but
  // its serialised value changes on navigation.)
  useEffect(() => {
    const status = searchParams?.get("status");
    if (status && (TAB_ORDER as readonly string[]).includes(status)) {
      setActiveTab(status as TabValue);
    }
  }, [searchParams]);

  const tabCounts = useMemo(() => {
    return TAB_ORDER.reduce<Record<TabValue, number>>(
      (acc, tab) => {
        acc[tab] = campaigns.filter((campaign) =>
          matchesTab(campaign, tab),
        ).length;
        return acc;
      },
      { all: 0, active: 0, paused: 0, draft: 0, closed: 0 },
    );
  }, [campaigns]);

  const filtered = useMemo(
    () => campaigns.filter((campaign) => matchesTab(campaign, activeTab)),
    [activeTab, campaigns],
  );

  return (
    <section className="cl-list-section">
      <FilterTabs
        tabs={TAB_ORDER.map((tab) => ({
          value: tab,
          label: tab,
          count: tabCounts[tab],
        }))}
        value={activeTab}
        onChange={(value) => setActiveTab(value as TabValue)}
      />

      {filtered.length === 0 ? (
        (() => {
          if (tabCounts.all === 0) {
            return (
              <EmptyState
                artKind="campaigns"
                title="No campaigns yet"
                description="Launch your first campaign and creators will start applying within hours. You set the brief, budget, and payout — Push handles attribution end-to-end."
                ctaLabel="Launch your first campaign"
                ctaHref="/merchant/campaigns/new"
              />
            );
          }
          if (activeTab === "active") {
            return (
              <EmptyState
                artKind="filter"
                artVariant="muted"
                title="No live campaigns right now"
                description="Nothing is currently accepting creators. Activate a draft to reopen the application queue, or start a new campaign."
                ctaLabel="View all campaigns"
                ctaOnClick={() => setActiveTab("all")}
              />
            );
          }
          if (activeTab === "paused") {
            return (
              <EmptyState
                artKind="filter"
                artVariant="muted"
                title="No paused campaigns"
                description="Pause a live campaign to stop accepting new applicants without losing your existing creator roster."
                ctaLabel="View all campaigns"
                ctaOnClick={() => setActiveTab("all")}
              />
            );
          }
          if (activeTab === "draft") {
            return (
              <EmptyState
                artKind="filter"
                artVariant="muted"
                title="No drafts in progress"
                description="Drafts let you scope a brief and budget before going live. Start one when you want to plan a campaign without publishing it yet."
                ctaLabel="Start a new draft"
                ctaHref="/merchant/campaigns/new"
              />
            );
          }
          if (activeTab === "closed") {
            return (
              <EmptyState
                artKind="filter"
                artVariant="muted"
                title="No closed campaigns"
                description="Wrapped campaigns archive here for reference — final spend, ROI, and creator roster all stay accessible."
                ctaLabel="View all campaigns"
                ctaOnClick={() => setActiveTab("all")}
              />
            );
          }
          return (
            <EmptyState
              artKind="filter"
              artVariant="muted"
              title="Nothing in this view"
              description="No campaigns match the current filter. Reset to see your full roster."
              ctaLabel="Show all campaigns"
              ctaOnClick={() => setActiveTab("all")}
            />
          );
        })()
      ) : (
        <div className="cml-grid">
          {filtered.map((campaign) => {
            const budgetTotal = numberOrZero(campaign.budget_total);
            const budgetRemaining = Math.max(
              numberOrZero(campaign.budget_remaining),
              0,
            );
            const budgetUsed = Math.max(budgetTotal - budgetRemaining, 0);
            const budgetUsedPercent =
              budgetTotal > 0 ? (budgetUsed / budgetTotal) * 100 : 0;
            const acceptedCreators = numberOrZero(campaign.accepted_creators);
            const badgeStatus = getBadgeStatus(campaign.status);

            return (
              <Link
                className="cml-card"
                href={`/merchant/campaigns/${campaign.id}`}
                key={campaign.id}
                data-status={badgeStatus}
              >
                {/* Dark ink top band */}
                <div className="cml-card__band">
                  <span
                    className={`cml-card__status-dot cml-card__status-dot--${badgeStatus}`}
                  />
                  <span className="cml-card__status-text">
                    {badgeStatus.toUpperCase()}
                  </span>
                  <span className="cml-card__category">
                    {getCategory(campaign)}
                  </span>
                </div>

                {/* White body */}
                <div className="cml-card__body">
                  <h3 className="cml-card__title">{campaign.title}</h3>

                  {/* Stats triptych */}
                  <div className="cml-card__stats">
                    <div className="cml-card__stat">
                      <span className="cml-card__stat-num">
                        {formatUsd(budgetRemaining)}
                      </span>
                      <span className="cml-card__stat-label">Budget Left</span>
                    </div>
                    <div
                      className="cml-card__stat-divider"
                      aria-hidden="true"
                    />
                    <div className="cml-card__stat">
                      <span className="cml-card__stat-num">
                        {acceptedCreators}
                      </span>
                      <span className="cml-card__stat-label">Creators</span>
                    </div>
                    <div
                      className="cml-card__stat-divider"
                      aria-hidden="true"
                    />
                    <div className="cml-card__stat">
                      <span className="cml-card__stat-num cml-card__stat-num--sm">
                        {formatDeadline(campaign.end_date)}
                      </span>
                      <span className="cml-card__stat-label">Deadline</span>
                    </div>
                  </div>

                  {/* Slim progress bar */}
                  <div className="cml-card__progress-row">
                    <div className="cml-card__progress-track">
                      <div
                        className="cml-card__progress-fill"
                        style={{ width: `${budgetUsedPercent}%` }}
                      />
                    </div>
                    <span className="cml-card__progress-pct">
                      {Math.round(budgetUsedPercent)}%
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="cml-card__footer">
                  <span className="cml-card__cta">Manage →</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
