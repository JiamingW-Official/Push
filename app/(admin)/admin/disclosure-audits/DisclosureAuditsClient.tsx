"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  MOCK_DISCLOSURE_AUDITS,
  WEEKLY_SAMPLE_RATE,
  type DisclosureAudit,
  type DisclosureVerdict,
} from "@/lib/admin/mock-disclosure-audits";
import "./disclosure-audits.css";

type VerdictFilter = DisclosureVerdict | "all";
type PlatformFilter = DisclosureAudit["platform"] | "all";
type DateFilter = "24h" | "7d" | "30d" | "all";

const VERDICT_LABEL: Record<DisclosureVerdict, string> = {
  auto_pass: "Auto-pass",
  auto_block: "Auto-block",
  manual_review: "Manual review",
  human_approved: "Approved",
  human_rejected: "Rejected",
};

const VERDICT_CLASS: Record<DisclosureVerdict, string> = {
  auto_pass: "da-badge--pass",
  auto_block: "da-badge--block",
  manual_review: "da-badge--review",
  human_approved: "da-badge--approved",
  human_rejected: "da-badge--rejected",
};

function formatRelative(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function formatAbsolute(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function withinDateRange(iso: string, range: DateFilter): boolean {
  if (range === "all") return true;
  const d = new Date(iso).getTime();
  const now = Date.now();
  const windows: Record<Exclude<DateFilter, "all">, number> = {
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
  };
  return now - d <= windows[range];
}

export default function DisclosureAuditsClient() {
  const [rows, setRows] = useState<DisclosureAudit[]>(MOCK_DISCLOSURE_AUDITS);
  const [verdictFilter, setVerdictFilter] = useState<VerdictFilter>("all");
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [creatorFilter, setCreatorFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<string>("");

  const filtered = useMemo(() => {
    const q = creatorFilter.trim().toLowerCase();
    return rows.filter((r) => {
      if (verdictFilter !== "all" && r.verdict !== verdictFilter) return false;
      if (platformFilter !== "all" && r.platform !== platformFilter)
        return false;
      if (q && !r.creatorHandle.toLowerCase().includes(q)) return false;
      if (!withinDateRange(r.postedAt, dateFilter)) return false;
      return true;
    });
  }, [rows, verdictFilter, platformFilter, creatorFilter, dateFilter]);

  const selected = useMemo(
    () => rows.find((r) => r.id === selectedId) ?? null,
    [rows, selectedId],
  );

  const counts = useMemo(
    () => ({
      auto_pass: rows.filter((r) => r.verdict === "auto_pass").length,
      auto_block: rows.filter((r) => r.verdict === "auto_block").length,
      manual_review: rows.filter((r) => r.verdict === "manual_review").length,
      human_approved: rows.filter((r) => r.verdict === "human_approved").length,
      human_rejected: rows.filter((r) => r.verdict === "human_rejected").length,
    }),
    [rows],
  );

  // Weekly sample — 10% of auto_pass rows re-checked
  const weeklySample = useMemo(() => {
    const autoPassCount = counts.auto_pass;
    const sampled = Math.max(1, Math.round(autoPassCount * WEEKLY_SAMPLE_RATE));
    // Pretend all sampled rows matched the AI verdict (mock)
    const reCheckMatchRate = 1.0;
    return {
      autoPassCount,
      sampled,
      reCheckMatchRate,
    };
  }, [counts.auto_pass]);

  function resolve(verdict: "human_approved" | "human_rejected") {
    if (!selected) return;
    setRows((prev) =>
      prev.map((r) =>
        r.id === selected.id
          ? {
              ...r,
              verdict,
              reviewerNotes: noteDraft.trim() || null,
              publishedAfterFix: verdict === "human_approved",
            }
          : r,
      ),
    );
    setSelectedId(null);
    setNoteDraft("");
  }

  return (
    <div className="da-page">
      {/* Header */}
      <header className="da-header">
        <div>
          <p className="da-eyebrow">Admin · DisclosureBot Audit Trail</p>
          <h1 className="da-h1">
            DisclosureBot <span className="da-h1-light">audit trail</span>
          </h1>
          <p className="da-sub">
            Every creator post logged with an AI disclosure-compliance verdict.
            Part of the Vertical AI for Local Commerce stack: auto-pass clean
            posts, auto-block missing tags, escalate ambiguous language to human
            review before publish.
          </p>
        </div>
        <div className="da-stats">
          <div className="da-stat">
            <span className="da-stat-num">{counts.auto_pass}</span>
            <span className="da-stat-l">auto-pass</span>
          </div>
          <div className="da-stat">
            <span className="da-stat-num">{counts.auto_block}</span>
            <span className="da-stat-l">auto-block</span>
          </div>
          <div className="da-stat">
            <span className="da-stat-num">{counts.manual_review}</span>
            <span className="da-stat-l">in review</span>
          </div>
          <div className="da-stat">
            <span className="da-stat-num">{counts.human_approved}</span>
            <span className="da-stat-l">approved</span>
          </div>
          <div className="da-stat">
            <span className="da-stat-num">{counts.human_rejected}</span>
            <span className="da-stat-l">rejected</span>
          </div>
        </div>
      </header>

      {/* Filter bar */}
      <div className="da-filter-bar">
        <div className="da-filter-group">
          <label className="da-filter-label" htmlFor="da-f-verdict">
            Verdict
          </label>
          <select
            id="da-f-verdict"
            className="da-filter-select"
            value={verdictFilter}
            onChange={(e) => setVerdictFilter(e.target.value as VerdictFilter)}
          >
            <option value="all">All verdicts</option>
            <option value="auto_pass">Auto-pass</option>
            <option value="auto_block">Auto-block</option>
            <option value="manual_review">Manual review</option>
            <option value="human_approved">Approved</option>
            <option value="human_rejected">Rejected</option>
          </select>
        </div>

        <div className="da-filter-group">
          <label className="da-filter-label" htmlFor="da-f-platform">
            Platform
          </label>
          <select
            id="da-f-platform"
            className="da-filter-select"
            value={platformFilter}
            onChange={(e) =>
              setPlatformFilter(e.target.value as PlatformFilter)
            }
          >
            <option value="all">All platforms</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>

        <div className="da-filter-group">
          <label className="da-filter-label" htmlFor="da-f-creator">
            Creator
          </label>
          <input
            id="da-f-creator"
            className="da-filter-input"
            type="text"
            placeholder="@handle"
            value={creatorFilter}
            onChange={(e) => setCreatorFilter(e.target.value)}
          />
        </div>

        <div className="da-filter-group">
          <label className="da-filter-label" htmlFor="da-f-date">
            Date range
          </label>
          <select
            id="da-f-date"
            className="da-filter-select"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilter)}
          >
            <option value="all">All time</option>
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>

      {/* Table + detail sidebar */}
      <div className="da-layout">
        <div className="da-table-wrap">
          <table className="da-table">
            <thead>
              <tr>
                <th>Posted</th>
                <th>Creator</th>
                <th>Campaign</th>
                <th>Merchant</th>
                <th>Platform</th>
                <th>Verdict</th>
                <th aria-label="details" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="da-empty">
                    No posts match these filters.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr
                    key={r.id}
                    className={`da-row${selectedId === r.id ? " da-row--active" : ""}`}
                    onClick={() => {
                      setSelectedId(r.id);
                      setNoteDraft(r.reviewerNotes ?? "");
                    }}
                  >
                    <td className="da-mono">{formatRelative(r.postedAt)}</td>
                    <td className="da-mono">{r.creatorHandle}</td>
                    <td className="da-td-wrap">{r.campaignTitle}</td>
                    <td>{r.merchantName}</td>
                    <td className="da-platform">{r.platform}</td>
                    <td>
                      <span className={`da-badge ${VERDICT_CLASS[r.verdict]}`}>
                        {VERDICT_LABEL[r.verdict]}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="da-row-link"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(r.id);
                          setNoteDraft(r.reviewerNotes ?? "");
                        }}
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <aside className="da-detail">
          {!selected ? (
            <div className="da-detail-empty">
              <p className="da-detail-empty-h">Select a post</p>
              <p className="da-detail-empty-body">
                Click any row to see the caption preview, DisclosureBot verdict
                reason, missing tags, and the approve / reject controls for
                flagged posts.
              </p>
            </div>
          ) : (
            <div className="da-detail-card">
              <p className="da-detail-eyebrow">
                Post {selected.id} · {formatAbsolute(selected.postedAt)}
              </p>
              <h2 className="da-detail-h">
                {selected.creatorHandle}{" "}
                <span className="da-detail-h-light">
                  × {selected.merchantName}
                </span>
              </h2>
              <p className="da-detail-campaign">
                <Link href="#" className="da-detail-link">
                  {selected.campaignTitle}
                </Link>
              </p>

              <div>
                <p className="da-detail-preview-l">Post preview</p>
                <p className="da-detail-preview">{selected.postPreview}</p>
              </div>

              <dl className="da-detail-grid">
                <div>
                  <dt>Verdict</dt>
                  <dd>
                    <span
                      className={`da-badge ${VERDICT_CLASS[selected.verdict]}`}
                    >
                      {VERDICT_LABEL[selected.verdict]}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Platform</dt>
                  <dd style={{ textTransform: "capitalize" }}>
                    {selected.platform}
                  </dd>
                </div>
                <div>
                  <dt>Disclosure position</dt>
                  <dd style={{ textTransform: "capitalize" }}>
                    {selected.disclosurePosition}
                  </dd>
                </div>
                <div>
                  <dt>Missing tags</dt>
                  <dd>
                    {selected.missingTags.length === 0 ? (
                      <span className="da-tag-list">
                        <span className="da-tag-chip da-tag-chip--ok">
                          none — all present
                        </span>
                      </span>
                    ) : (
                      <span className="da-tag-list">
                        {selected.missingTags.map((tag) => (
                          <span key={tag} className="da-tag-chip">
                            {tag}
                          </span>
                        ))}
                      </span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Model</dt>
                  <dd>{selected.modelUsed}</dd>
                </div>
                <div>
                  <dt>Latency</dt>
                  <dd>{selected.latencyMs}ms</dd>
                </div>
              </dl>

              <div className="da-detail-reason-block">
                <p className="da-detail-reason-label">DisclosureBot reason</p>
                <p className="da-detail-reason-body">
                  {selected.verdictReason}
                </p>
              </div>

              {selected.verdict === "auto_block" && (
                <p className="da-detail-blocked-banner">
                  <strong>Blocked — awaiting creator revision</strong>
                  Post was held before publish. Creator has been auto-notified
                  with the exact compliant wording template. Campaign payout
                  pending refile.
                </p>
              )}

              {selected.verdict === "manual_review" ? (
                <>
                  <label className="da-detail-note-label" htmlFor="da-note">
                    Reviewer notes (optional)
                  </label>
                  <textarea
                    id="da-note"
                    className="da-detail-note"
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    rows={3}
                    placeholder="Why approved / rejected — visible to ops only."
                  />

                  <div className="da-detail-actions">
                    <button
                      type="button"
                      className="da-btn da-btn--approve"
                      onClick={() => resolve("human_approved")}
                    >
                      Approve post
                    </button>
                    <button
                      type="button"
                      className="da-btn da-btn--reject"
                      onClick={() => resolve("human_rejected")}
                    >
                      Reject & hold
                    </button>
                  </div>
                </>
              ) : selected.reviewerNotes ? (
                <p className="da-detail-final">
                  Resolved &mdash;{" "}
                  <strong>{VERDICT_LABEL[selected.verdict]}</strong>. &ldquo;
                  {selected.reviewerNotes}&rdquo;
                  {selected.publishedAfterFix
                    ? " Published after creator fix."
                    : ""}
                </p>
              ) : null}
            </div>
          )}
        </aside>
      </div>

      {/* Weekly sample summary */}
      <section className="da-summary">
        <div>
          <h2 className="da-summary-h">Weekly audit sample</h2>
          <p className="da-summary-body">
            Every week we re-check a {Math.round(WEEKLY_SAMPLE_RATE * 100)}%
            random sample of auto-pass rows against DisclosureBot to catch
            drift. Mismatches flag the model for retraining.
          </p>
        </div>
        <div className="da-summary-stat">
          <span className="da-summary-num">{weeklySample.autoPassCount}</span>
          <span className="da-summary-l">auto-pass this week</span>
        </div>
        <div className="da-summary-stat">
          <span className="da-summary-num">{weeklySample.sampled}</span>
          <span className="da-summary-l">re-checked (10% sample)</span>
        </div>
        <div className="da-summary-stat">
          <span className="da-summary-num">
            {Math.round(weeklySample.reCheckMatchRate * 100)}%
          </span>
          <span className="da-summary-l">verdicts matched</span>
        </div>
      </section>
    </div>
  );
}
