"use client";

import type { Application } from "@/lib/creator/types";
import { MILESTONE_LABELS } from "@/lib/creator/constants";
import "./CampaignList.css";

type MilestoneStatus = Application["milestone"];

function milestoneColorClass(milestone: MilestoneStatus): string {
  if (milestone === "settled") return "cl-badge--settled";
  if (milestone === "accepted") return "cl-badge--accepted";
  return "cl-badge--active";
}

interface CampaignListProps {
  applications: Application[];
  onSelectCampaign?: (id: string) => void;
}

export default function CampaignList({
  applications,
  onSelectCampaign,
}: CampaignListProps) {
  if (applications.length === 0) {
    return (
      <div className="cl-empty">
        <h3 className="cl-empty__title">Pipeline is empty.</h3>
        <p className="cl-empty__body">
          Accept an invite or explore Discover to start.
        </p>
      </div>
    );
  }

  return (
    <ul className="cl-list" role="list">
      {applications.map((app) => (
        <li
          key={app.id}
          className="cl-row"
          role={onSelectCampaign ? "button" : undefined}
          tabIndex={onSelectCampaign ? 0 : undefined}
          onClick={() => onSelectCampaign?.(app.campaign_id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelectCampaign?.(app.campaign_id);
            }
          }}
        >
          <div className="cl-row__left">
            <span className="cl-merchant">{app.merchant_name}</span>
            <span className="cl-campaign-title">{app.campaign_title}</span>
          </div>
          <div className="cl-row__right">
            <span className={`cl-badge ${milestoneColorClass(app.milestone)}`}>
              {MILESTONE_LABELS[app.milestone]}
            </span>
            <span className="cl-payout">${app.payout}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
