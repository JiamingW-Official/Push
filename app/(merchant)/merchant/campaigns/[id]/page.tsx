"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import "./campaign-detail.css";

type CampaignRecord = {
  id: string;
  title: string;
  category: string;
  description: string;
  budget: number;
  tier: string;
  commissionSplit: number;
  contentType: string;
  platform: string;
  dueDate: string;
  status: string;
  createdAt: string;
  applications: number;
  qrScans: number;
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<CampaignRecord | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("push-demo-campaigns");
    if (!stored) return;
    const list: CampaignRecord[] = JSON.parse(stored);
    const found = list.find((c) => c.id === id);
    if (found) setCampaign(found);
  }, [id]);

  if (!campaign) {
    return (
      <div className="cd-loading">
        <p className="cd-loading__text">Loading campaign…</p>
      </div>
    );
  }

  const status = capitalize(campaign.status);
  const statusMod = status.toLowerCase() as "active" | "ended" | "paused";

  return (
    <div className="cd-shell">
      <div className="cd-inner">
        {/* Back nav */}
        <Link href="/merchant/dashboard" className="cd-back">
          ← Back to dashboard
        </Link>

        {/* Page header */}
        <header className="cd-header">
          <div className="cd-header__left">
            <span className="cd-eyebrow">{capitalize(campaign.category)}</span>
            <h1 className="cd-title">{campaign.title}</h1>
          </div>
          <div className="cd-header__actions">
            <span className={`cd-status-badge cd-status-badge--${statusMod}`}>
              {status.toUpperCase()}
            </span>
            <Link
              href={`/merchant/campaigns/${campaign.id}/edit`}
              className="btn-ghost click-shift"
            >
              Edit
            </Link>
          </div>
        </header>

        {/* KPI Stats — 4 cards */}
        <div className="cd-kpi-row">
          {[
            { label: "Budget", value: `$${campaign.budget.toLocaleString()}` },
            { label: "Creator Share", value: `${campaign.commissionSplit}%` },
            { label: "Applications", value: campaign.applications },
            { label: "QR Scans", value: campaign.qrScans },
          ].map((stat) => (
            <div key={stat.label} className="cd-kpi-card">
              <span className="cd-kpi-card__label">{stat.label}</span>
              <span className="cd-kpi-card__value">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Brief */}
        <div className="cd-card">
          <span className="cd-card__eyebrow">Brief</span>
          <p className="cd-card__body">{campaign.description}</p>
        </div>

        {/* Deliverables */}
        <div className="cd-card">
          <span className="cd-card__eyebrow">Deliverables</span>
          <div className="cd-deliverables-grid">
            {[
              {
                label: "Content Type",
                value: capitalize(campaign.contentType),
              },
              { label: "Platform", value: campaign.platform },
              { label: "Due Date", value: campaign.dueDate },
              { label: "Tier Target", value: capitalize(campaign.tier) },
            ].map(({ label, value }) => (
              <div key={label} className="cd-deliverable">
                <span className="cd-deliverable__label">{label}</span>
                <span className="cd-deliverable__value">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Actions */}
        <div className="cd-actions-card">
          <span className="cd-actions-card__eyebrow">Campaign Actions</span>
          <div className="cd-actions-row">
            <button className="btn-ghost click-shift">Pause Campaign</button>
            <button className="cd-danger-btn">End Campaign</button>
          </div>
        </div>

        {/* CTA */}
        <div className="cd-cta-strip">
          <Link
            href="/merchant/campaigns/new"
            className="btn-primary click-shift"
          >
            + Create Another Campaign
          </Link>
        </div>
      </div>
    </div>
  );
}
