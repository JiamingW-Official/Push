"use client";

import Link from "next/link";
import { useApplications } from "@/lib/creator/hooks/useApplications";
import { useCreatorProfile } from "@/lib/creator/hooks/useCreatorProfile";
import "./archive.css";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

export default function PortfolioArchivePage() {
  const { isDemo, loading: profileLoading } = useCreatorProfile();
  const { applications, loading: appsLoading } = useApplications(isDemo);

  const loading = profileLoading || appsLoading;
  const settled = applications.filter((a) => a.milestone === "settled");

  return (
    <div className="archive-page">
      <div className="archive-header">
        <h1 className="archive-title">Archive</h1>
        {!loading && settled.length > 0 && (
          <span className="archive-count">{settled.length} completed</span>
        )}
      </div>

      {loading && <div className="archive-skeleton" />}

      {!loading && settled.length === 0 && (
        <div className="archive-empty">
          <p className="archive-empty__title">Archive is empty.</p>
          <p className="archive-empty__body">
            Your first completed campaign lands here.
          </p>
        </div>
      )}

      {!loading && settled.length > 0 && (
        <ul className="archive-list" role="list">
          {settled.map((a) => (
            <li key={a.id} className="archive-row">
              <div className="archive-row__content">
                <span className="archive-row__merchant">{a.merchant_name}</span>
                <span className="archive-row__campaign">
                  {a.campaign_title}
                </span>
                {a.created_at && (
                  <span className="archive-row__time">
                    {timeAgo(a.created_at)}
                  </span>
                )}
              </div>
              <div className="archive-row__right">
                <span className="archive-row__payout">${a.payout}</span>
                <Link
                  href={`/creator/work/campaign/${a.campaign_id}`}
                  className="archive-row__link"
                >
                  View
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
