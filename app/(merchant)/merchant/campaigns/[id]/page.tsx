"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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
      <div className="cd-page">
        <div className="cd-inner">
          <p className="cd-loading">Loading campaign…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cd-page">
      <div className="cd-inner">
        <Link href="/merchant/dashboard" className="cd-back">
          ← Back to dashboard
        </Link>

        {/* Live badge */}
        <div className="cd-live-row">
          <span className="cd-live-dot" aria-hidden="true" />
          <span className="cd-live-label">Campaign Live</span>
        </div>

        <h1 className="cd-title">{campaign.title}</h1>
        <p className="cd-category">{capitalize(campaign.category)}</p>

        {/* Stats bar */}
        <div className="cd-stats">
          <div className="cd-stat">
            <span className="cd-stat-val">$</span>
            <span className="cd-stat-num">
              {campaign.budget.toLocaleString()}
            </span>
            <span className="cd-stat-label">Budget</span>
          </div>
          <div className="cd-stat-divider" />
          <div className="cd-stat">
            <span className="cd-stat-num">{campaign.commissionSplit}%</span>
            <span className="cd-stat-label">Creator Share</span>
          </div>
          <div className="cd-stat-divider" />
          <div className="cd-stat">
            <span className="cd-stat-num">{capitalize(campaign.tier)}</span>
            <span className="cd-stat-label">Tier Target</span>
          </div>
          <div className="cd-stat-divider" />
          <div className="cd-stat">
            <span className="cd-stat-num">{campaign.applications}</span>
            <span className="cd-stat-label">Applications</span>
          </div>
        </div>

        {/* Description */}
        <div className="cd-panel">
          <h2 className="cd-panel-heading">Brief</h2>
          <p className="cd-desc">{campaign.description}</p>
        </div>

        {/* Deliverables */}
        <div className="cd-panel">
          <h2 className="cd-panel-heading">Deliverables</h2>
          <div className="cd-detail-grid">
            <div className="cd-detail-item">
              <span className="cd-detail-label">Content Type</span>
              <span className="cd-detail-val">
                {capitalize(campaign.contentType)}
              </span>
            </div>
            <div className="cd-detail-item">
              <span className="cd-detail-label">Platform</span>
              <span className="cd-detail-val">{campaign.platform}</span>
            </div>
            <div className="cd-detail-item">
              <span className="cd-detail-label">Due Date</span>
              <span className="cd-detail-val">{campaign.dueDate}</span>
            </div>
            <div className="cd-detail-item">
              <span className="cd-detail-label">Status</span>
              <span className="cd-detail-val cd-detail-val--live">
                {capitalize(campaign.status)}
              </span>
            </div>
          </div>
        </div>

        <Link href="/merchant/campaigns/new" className="cd-cta">
          + Create Another Campaign
        </Link>
      </div>

      <style>{`
        .cd-page {
          min-height: 100svh;
          background: #f5f2ec;
          font-family: var(--font-mono, "CS Genio Mono", monospace);
          color: #003049;
        }
        .cd-inner {
          max-width: 720px;
          margin: 0 auto;
          padding: 40px 24px 80px;
        }
        .cd-loading {
          font-size: 0.875rem;
          color: #669bbc;
          margin-top: 60px;
        }
        .cd-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #669bbc;
          text-decoration: none;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 32px;
          transition: color 0.15s;
        }
        .cd-back:hover { color: #003049; }
        .cd-live-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        .cd-live-dot {
          width: 8px;
          height: 8px;
          background: #c1121f;
          border-radius: 50%;
          animation: pulse 1.8s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .cd-live-label {
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #c1121f;
        }
        .cd-title {
          font-family: var(--font-display, "Darky", serif);
          font-size: clamp(1.75rem, 5vw, 3rem);
          font-weight: 900;
          font-style: italic;
          letter-spacing: -0.04em;
          color: #003049;
          line-height: 1.05;
          margin: 0 0 8px;
        }
        .cd-category {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #669bbc;
          margin: 0 0 32px;
        }
        .cd-stats {
          display: flex;
          align-items: stretch;
          border: 1.5px solid #003049;
          box-shadow: 4px 4px 0 #003049;
          margin-bottom: 32px;
          overflow-x: auto;
        }
        .cd-stat {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 16px;
          min-width: 100px;
        }
        .cd-stat-val {
          font-size: 0.75rem;
          color: #669bbc;
          font-weight: 600;
        }
        .cd-stat-num {
          font-family: var(--font-display, "Darky", serif);
          font-size: 1.75rem;
          font-weight: 900;
          font-style: italic;
          color: #003049;
          line-height: 1;
        }
        .cd-stat-label {
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #669bbc;
          margin-top: 4px;
        }
        .cd-stat-divider {
          width: 1px;
          background: rgba(0, 48, 73, 0.12);
          align-self: stretch;
        }
        .cd-panel {
          background: #fff;
          border: 1.5px solid #003049;
          box-shadow: 3px 3px 0 rgba(0, 48, 73, 0.15);
          padding: 28px;
          margin-bottom: 16px;
        }
        .cd-panel-heading {
          font-family: var(--font-display, "Darky", serif);
          font-size: 1rem;
          font-weight: 900;
          font-style: italic;
          color: #003049;
          margin: 0 0 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(0, 48, 73, 0.1);
        }
        .cd-desc {
          font-size: 0.9375rem;
          line-height: 1.65;
          color: #003049;
          margin: 0;
        }
        .cd-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px 24px;
        }
        @media (max-width: 480px) {
          .cd-detail-grid { grid-template-columns: 1fr; }
        }
        .cd-detail-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .cd-detail-label {
          font-size: 0.625rem;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #669bbc;
        }
        .cd-detail-val {
          font-size: 0.9375rem;
          color: #003049;
          font-weight: 500;
        }
        .cd-detail-val--live {
          color: #c1121f;
          font-weight: 700;
        }
        .cd-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 32px;
          padding: 12px 24px;
          font-family: var(--font-mono, "CS Genio Mono", monospace);
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: #003049;
          color: #f5f2ec;
          border: 1.5px solid #003049;
          box-shadow: 3px 3px 0 #c1121f;
          text-decoration: none;
          transition: background 0.15s, box-shadow 0.15s;
        }
        .cd-cta:hover {
          background: #c1121f;
          border-color: #c1121f;
          box-shadow: 3px 3px 0 #780000;
        }
      `}</style>
    </div>
  );
}
