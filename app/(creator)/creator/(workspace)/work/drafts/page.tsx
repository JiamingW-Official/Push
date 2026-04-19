"use client";

import "./drafts.css";

interface Draft {
  id: string;
  merchantName: string;
  campaignTitle: string;
  lastEditedAt: string;
  type: "submit" | "message" | "decline";
}

const MOCK_DRAFTS: Draft[] = [];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function WorkDraftsPage() {
  return (
    <div className="drafts-page">
      <div className="drafts-header">
        <h1 className="drafts-title">Drafts</h1>
      </div>

      {MOCK_DRAFTS.length === 0 ? (
        <div className="drafts-empty">
          <p className="drafts-empty__title">No drafts saved.</p>
          <p className="drafts-empty__body">
            Unfinished submissions and saved messages appear here.
          </p>
        </div>
      ) : (
        <ul className="drafts-list" role="list">
          {MOCK_DRAFTS.map((draft) => (
            <li key={draft.id} className="drafts-row">
              <div className="drafts-row__content">
                <span className="drafts-row__merchant">
                  {draft.merchantName}
                </span>
                <span className="drafts-row__campaign">
                  {draft.campaignTitle}
                </span>
              </div>
              <div className="drafts-row__meta">
                <span className="drafts-row__time">
                  {timeAgo(draft.lastEditedAt)}
                </span>
                <span className="drafts-row__type">{draft.type}</span>
              </div>
              <button className="drafts-row__resume">Resume</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
