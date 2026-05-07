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
    return "No deadline";
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
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
                title="No closed campaigns"
                description="Wrapped campaigns archive here for reference — final spend, ROI, and creator roster all stay accessible."
                ctaLabel="View all campaigns"
                ctaOnClick={() => setActiveTab("all")}
              />
            );
          }
          return (
            <EmptyState
              title="Nothing in this view"
              description="No campaigns match the current filter. Reset to see your full roster."
              ctaLabel="Show all campaigns"
              ctaOnClick={() => setActiveTab("all")}
            />
          );
        })()
      ) : (
        <div className="cl-list">
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
                className="cl-row"
                href={`/merchant/campaigns/${campaign.id}`}
                key={campaign.id}
              >
                {campaign.image_url ? (
                  <img
                    alt={campaign.title}
                    className="cl-row-image"
                    src={campaign.image_url}
                  />
                ) : (
                  <div
                    className="cl-row-image cl-row-image--placeholder"
                    aria-hidden="true"
                  />
                )}

                <div className="cl-row-main">
                  <div className="cl-row-heading">
                    <h3 className="cl-row-title">{campaign.title}</h3>
                    <p className="cl-row-eyebrow">{getCategory(campaign)}</p>
                  </div>

                  <div className="cl-row-meta">
                    <StatusBadge status={badgeStatus}>
                      {campaign.status.toUpperCase()}
                    </StatusBadge>
                    <p className="cl-row-statline">
                      Deadline: {formatDeadline(campaign.end_date)}
                    </p>
                    <ProgressBar
                      value={budgetUsedPercent}
                      max={100}
                      color="primary"
                      height={4}
                    />
                  </div>
                </div>

                <div className="cl-row-stats">
                  <p className="cl-row-budget">{formatUsd(budgetRemaining)}</p>
                  <p className="cl-row-statline">
                    Accepted creators {acceptedCreators}
                  </p>
                  <span className="cl-row-cta">View →</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
