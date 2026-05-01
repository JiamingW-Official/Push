"use client";

import { useState } from "react";
import {
  EmptyState,
  PageHeader,
  ProgressBar,
  StatusBadge,
} from "@/components/merchant/shared";
import type { AttributionSummary } from "@/lib/data/api-client";
import { CampaignStatus, type Campaign } from "@/lib/data/types";
import { CampaignActions } from "./CampaignActions";
import "../campaigns.css";
import "./campaign-detail.css";

export interface CampaignDetailPageData {
  campaign: Campaign | null;
  summary: AttributionSummary;
}

interface CampaignDetailPageClientProps {
  initialData: CampaignDetailPageData;
}

const DETAIL_TABS = [
  { id: "overview", label: "Overview" },
  { id: "creators", label: "Creators" },
  { id: "locations", label: "Locations" },
  { id: "timeline", label: "Timeline" },
] as const;
type DetailTab = (typeof DETAIL_TABS)[number]["id"];

function numberOrZero(value: number | null | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function formatUsd(value: number | null | undefined): string {
  return `$${numberOrZero(value).toLocaleString("en-US")}`;
}

function formatDate(value: string | null | undefined): string {
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

function normalizeActionStatus(
  status: Campaign["status"],
): "active" | "paused" | "draft" | "closed" {
  return getBadgeStatus(status);
}

export default function CampaignDetailPageClient({
  initialData,
}: CampaignDetailPageClientProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");

  if (!initialData.campaign) {
    return (
      <div className="cd-page">
        <PageHeader
          eyebrow="CAMPAIGN"
          title="Campaign detail"
          subtitle="Review campaign status, budget pacing, and creator attribution."
        />
        <EmptyState
          title="Campaign not found"
          description="The requested campaign could not be found for this merchant account."
          ctaLabel="Back to campaigns"
          ctaHref="/merchant/campaigns"
        />
      </div>
    );
  }

  const { campaign, summary } = initialData;
  const budgetTotal = numberOrZero(campaign.budget_total);
  const budgetRemaining = Math.max(numberOrZero(campaign.budget_remaining), 0);
  const budgetUsed = Math.max(budgetTotal - budgetRemaining, 0);
  const budgetUsedPercent =
    budgetTotal > 0 ? (budgetUsed / budgetTotal) * 100 : 0;
  const badgeStatus = getBadgeStatus(campaign.status);
  const topCreators = [...summary.by_creator].sort(
    (left, right) => right.revenue - left.revenue,
  );
  const topLocations = [...summary.by_location].sort(
    (left, right) => right.revenue - left.revenue,
  );
  const timeline = [...summary.by_day].sort((left, right) =>
    left.date.localeCompare(right.date),
  );

  return (
    <div className="cd-page">
      {/* ── Photo Card Hero (Pattern B § 8.7) — campaign cover with bottom gradient ── */}
      <header className="cd-hero" aria-label="Campaign hero">
        <div className="cd-hero__photo" aria-hidden="true" />
        <div className="cd-hero__gradient" aria-hidden="true" />

        {/* Liquid-glass status peek (§ 8.9.4) — single anchored chrome tile */}
        <aside
          className="lg-surface cd-hero__peek"
          aria-label="Campaign budget snapshot"
        >
          <p className="cd-hero__peek-eyebrow">BUDGET REMAINING</p>
          <p className="cd-hero__peek-value">{formatUsd(budgetRemaining)}</p>
          <ProgressBar
            value={budgetUsedPercent}
            max={100}
            color="primary"
            height={4}
          />
          <p className="cd-hero__peek-meta">
            {formatUsd(budgetUsed)} of {formatUsd(budgetTotal)} used
          </p>
        </aside>

        <div className="cd-hero__overlay">
          <p className="cd-hero__eyebrow">CAMPAIGN · {campaign.id}</p>
          <h1 className="cd-hero__title">{campaign.title}</h1>
          <div className="cd-hero__meta">
            <StatusBadge status={badgeStatus}>
              {campaign.status.toUpperCase()}
            </StatusBadge>
            <span className="cd-hero__meta-divider" aria-hidden="true">
              ·
            </span>
            <span className="cd-hero__meta-text">{campaign.location}</span>
            <span className="cd-hero__meta-divider" aria-hidden="true">
              ·
            </span>
            <span className="cd-hero__meta-text">
              Ends {formatDate(campaign.end_date)}
            </span>
          </div>
        </div>
      </header>

      <div className="cd-layout">
        <div className="cd-left">
          {/* ── KPI Grid — Darky stat numerals (§ 8.14, § 3.1) ── */}
          <section
            className="dashboard-kpi-grid cd-kpi-grid"
            aria-label="Campaign attribution KPIs"
          >
            <article className="kpi-card">
              <p className="kpi-card__eyebrow">Scans</p>
              <p className="kpi-card__numeral">
                {numberOrZero(summary.scans).toLocaleString("en-US")}
              </p>
              <p className="kpi-card__delta kpi-card__delta--flat">
                {numberOrZero(summary.fraud_flags)} fraud flags
              </p>
            </article>
            <article className="kpi-card">
              <p className="kpi-card__eyebrow">Verified</p>
              <p className="kpi-card__numeral">
                {numberOrZero(summary.verified_customers).toLocaleString(
                  "en-US",
                )}
              </p>
              <p className="kpi-card__delta kpi-card__delta--flat">
                ROI {numberOrZero(summary.roi).toFixed(2)}x
              </p>
            </article>
            <article className="kpi-card">
              <p className="kpi-card__eyebrow">Revenue</p>
              <p className="kpi-card__numeral kpi-card__numeral--primary">
                {formatUsd(numberOrZero(summary.revenue_attributed) / 100)}
              </p>
              <p className="kpi-card__delta kpi-card__delta--flat">
                Attributed sales
              </p>
            </article>
          </section>

          {/* ── Segmented tabs — pill variant (§ 9.5) ── */}
          <div
            className="cd-tabs"
            role="tablist"
            aria-label="Campaign detail sections"
          >
            {DETAIL_TABS.map((tab) => (
              <button
                aria-pressed={activeTab === tab.id}
                aria-selected={activeTab === tab.id}
                className="btn-pill cd-tab"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <>
              <section className="cd-section">
                <p className="cd-section-eyebrow">BRIEF</p>
                <h2 className="cd-section-title">Overview</h2>
                <div className="cd-section-body">
                  <p>
                    {campaign.description ||
                      "No campaign description provided."}
                  </p>
                </div>

                <dl className="cd-meta-list">
                  <div className="cd-meta-row">
                    <dt>Start date</dt>
                    <dd>{formatDate(campaign.start_date)}</dd>
                  </div>
                  <div className="cd-meta-row">
                    <dt>Deadline</dt>
                    <dd>{formatDate(campaign.end_date)}</dd>
                  </div>
                  <div className="cd-meta-row">
                    <dt>Locations</dt>
                    <dd>{campaign.applicable_location_ids.length}</dd>
                  </div>
                </dl>
              </section>

              <section className="cd-section">
                <p className="cd-section-eyebrow">BUDGET</p>
                <h2 className="cd-section-title">Budget &amp; Performance</h2>
                <dl className="cd-rule-grid">
                  <div className="cd-rule-row">
                    <dt>Total budget</dt>
                    <dd>{formatUsd(budgetTotal)}</dd>
                  </div>
                  <div className="cd-rule-row">
                    <dt>Budget used</dt>
                    <dd>{formatUsd(budgetUsed)}</dd>
                  </div>
                  <div className="cd-rule-row">
                    <dt>Budget remaining</dt>
                    <dd>{formatUsd(budgetRemaining)}</dd>
                  </div>
                  <div className="cd-rule-row">
                    <dt>Payout per visit</dt>
                    <dd>{formatUsd(campaign.reward_per_visit)}</dd>
                  </div>
                  <div className="cd-rule-row">
                    <dt>Accepted creators</dt>
                    <dd>{numberOrZero(campaign.accepted_creators)}</dd>
                  </div>
                  <div className="cd-rule-row">
                    <dt>Max creators</dt>
                    <dd>{numberOrZero(campaign.max_creators)}</dd>
                  </div>
                </dl>
              </section>
            </>
          )}

          {activeTab === "creators" && (
            <section className="cd-section">
              <p className="cd-section-eyebrow">ATTRIBUTION</p>
              <h2 className="cd-section-title">Per-Creator Performance</h2>
              {topCreators.length === 0 ? (
                <EmptyState
                  title="No creator activity yet"
                  description="As accepted creators post and customers redeem, their scans, verified visits, and ROI will appear here."
                />
              ) : (
                <div className="cl-list">
                  {topCreators.map((creator) => (
                    <article className="cl-row" key={creator.creator_id}>
                      <div
                        className="cl-row-image cl-row-image--placeholder"
                        aria-hidden="true"
                      />
                      <div className="cl-row-main">
                        <div className="cl-row-heading">
                          <h3 className="cl-row-title">{creator.creator_id}</h3>
                          <p className="cl-row-eyebrow">CREATOR</p>
                        </div>
                        <div className="cl-row-meta">
                          <p className="cl-row-statline">
                            Scans: {numberOrZero(creator.scans)}
                          </p>
                          <p className="cl-row-statline">
                            Verified: {numberOrZero(creator.verified)}
                          </p>
                          <ProgressBar
                            value={Math.max(
                              0,
                              Math.min(numberOrZero(creator.roi) * 100, 100),
                            )}
                            max={100}
                            color="primary"
                            height={4}
                          />
                        </div>
                      </div>
                      <div className="cl-row-stats">
                        <p className="cl-row-budget">
                          {formatUsd(numberOrZero(creator.revenue) / 100)}
                        </p>
                        <p className="cl-row-statline">
                          ROI {numberOrZero(creator.roi).toFixed(2)}x
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "locations" && (
            <section className="cd-section">
              <p className="cd-section-eyebrow">PLACES</p>
              <h2 className="cd-section-title">Locations</h2>
              {topLocations.length === 0 ? (
                <EmptyState
                  title="No location activity yet"
                  description="Once customers redeem at any of your applicable locations, scan and revenue breakdowns will appear here."
                />
              ) : (
                <dl className="cd-rule-grid">
                  {topLocations.map((location) => (
                    <div className="cd-rule-row" key={location.location_id}>
                      <dt>{location.location_id}</dt>
                      <dd>
                        {numberOrZero(location.scans)} scans ·{" "}
                        {formatUsd(numberOrZero(location.revenue) / 100)}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>
          )}

          {activeTab === "timeline" && (
            <section className="cd-section">
              <p className="cd-section-eyebrow">PACING</p>
              <h2 className="cd-section-title">Timeline</h2>
              {timeline.length === 0 ? (
                <EmptyState
                  title="No activity yet"
                  description="Daily scan and verification rhythm will plot here as soon as the first customer redeems."
                />
              ) : (
                <ol className="cd-timeline">
                  {timeline.map((entry) => (
                    <li className="cd-timeline-item" key={entry.date}>
                      <span className="cd-timeline-head">
                        {formatDate(entry.date)}
                      </span>
                      <p>
                        {numberOrZero(entry.scans)} scans ·{" "}
                        {numberOrZero(entry.verified)} verified customers
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          )}
        </div>

        <aside className="cd-right">
          <div className="cd-sticky-card">
            <p className="cd-sticky-eyebrow">CAMPAIGN ACTIONS</p>
            <CampaignActions
              initialStatus={normalizeActionStatus(campaign.status)}
            />
            <hr className="cd-divider" />
            <dl className="cd-sticky-meta">
              <div className="cd-sticky-meta-row">
                <dt>Status</dt>
                <dd>{campaign.status.toUpperCase()}</dd>
              </div>
              <div className="cd-sticky-meta-row">
                <dt>Budget used</dt>
                <dd>{formatUsd(budgetUsed)}</dd>
              </div>
              <div className="cd-sticky-meta-row">
                <dt>Deadline</dt>
                <dd>{formatDate(campaign.end_date)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      <div className="cd-bottom-bar">
        <ProgressBar
          value={budgetUsedPercent}
          max={100}
          color="primary"
          height={4}
        />
        <CampaignActions
          initialStatus={normalizeActionStatus(campaign.status)}
        />
      </div>
    </div>
  );
}
