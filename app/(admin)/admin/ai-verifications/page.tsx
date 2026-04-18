"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  MOCK_AI_VERIFICATIONS,
  type MockAiVerification,
  type AiVerdict,
} from "@/lib/admin/mock-ai-verifications";
import "./ai-verifications.css";

type VerdictFilter =
  | "manual_review"
  | "all"
  | "auto_verified"
  | "auto_rejected";

const VERDICT_LABEL: Record<AiVerdict, string> = {
  auto_verified: "Auto-verified",
  auto_rejected: "Auto-rejected",
  manual_review: "Manual review",
  human_approved: "Approved",
  human_rejected: "Rejected",
};

const VERDICT_CLASS: Record<AiVerdict, string> = {
  auto_verified: "aiv-badge--ok",
  auto_rejected: "aiv-badge--rej",
  manual_review: "aiv-badge--pending",
  human_approved: "aiv-badge--ok",
  human_rejected: "aiv-badge--rej",
};

function formatRelative(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function formatAmount(amount: number | null) {
  return amount === null ? "—" : `$${amount.toFixed(2)}`;
}

function formatConfidence(v: number | null) {
  return v === null ? "—" : `${Math.round(v * 100)}%`;
}

function formatGeo(m: number | null) {
  if (m === null) return "—";
  if (m >= 1000) return `${(m / 1000).toFixed(1)} km`;
  return `${m} m`;
}

export default function AiVerificationsAdminPage() {
  const [rows, setRows] = useState<MockAiVerification[]>(MOCK_AI_VERIFICATIONS);
  const [filter, setFilter] = useState<VerdictFilter>("manual_review");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<string>("");

  const filtered = useMemo(() => {
    if (filter === "all") return rows;
    return rows.filter((r) => r.verdict === filter);
  }, [rows, filter]);

  const selected = useMemo(
    () => rows.find((r) => r.id === selectedId) ?? null,
    [rows, selectedId],
  );

  const counts = useMemo(
    () => ({
      manual_review: rows.filter((r) => r.verdict === "manual_review").length,
      auto_verified: rows.filter((r) => r.verdict === "auto_verified").length,
      auto_rejected: rows.filter((r) => r.verdict === "auto_rejected").length,
      total: rows.length,
    }),
    [rows],
  );

  function resolve(verdict: "human_approved" | "human_rejected") {
    if (!selected) return;
    setRows((prev) =>
      prev.map((r) =>
        r.id === selected.id
          ? {
              ...r,
              verdict,
              reviewedByHuman: true,
              reviewNotes: noteDraft.trim() || null,
            }
          : r,
      ),
    );
    setSelectedId(null);
    setNoteDraft("");
  }

  return (
    <div className="aiv-page">
      <header className="aiv-header">
        <div>
          <p className="aiv-eyebrow">Admin · AI Verification Layer</p>
          <h1 className="aiv-h1">
            Manual review <span className="aiv-h1-light">queue</span>
          </h1>
          <p className="aiv-sub">
            Scans that passed QR + geo but fell below the merchant-name match or
            vision-confidence threshold. Approve to release the creator payout
            and mark the customer billable. Reject to void the scan.
          </p>
        </div>
        <div className="aiv-stats">
          <div className="aiv-stat">
            <span className="aiv-stat-num">{counts.manual_review}</span>
            <span className="aiv-stat-l">in review</span>
          </div>
          <div className="aiv-stat">
            <span className="aiv-stat-num">{counts.auto_verified}</span>
            <span className="aiv-stat-l">auto-verified</span>
          </div>
          <div className="aiv-stat">
            <span className="aiv-stat-num">{counts.auto_rejected}</span>
            <span className="aiv-stat-l">auto-rejected</span>
          </div>
        </div>
      </header>

      <div className="aiv-filter-bar">
        {(
          ["manual_review", "all", "auto_verified", "auto_rejected"] as const
        ).map((f) => (
          <button
            key={f}
            className={`aiv-filter-btn${filter === f ? " aiv-filter-btn--active" : ""}`}
            onClick={() => setFilter(f)}
            type="button"
          >
            {f === "all" ? "All verdicts" : VERDICT_LABEL[f as AiVerdict]}
          </button>
        ))}
      </div>

      <div className="aiv-layout">
        <div className="aiv-table-wrap">
          <table className="aiv-table">
            <thead>
              <tr>
                <th>Scan</th>
                <th>Merchant</th>
                <th>Creator</th>
                <th>Amount</th>
                <th>Name match</th>
                <th>Geo</th>
                <th>Vision</th>
                <th>Verdict</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="aiv-empty">
                    No rows for this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr
                    key={r.id}
                    className={`aiv-row${selectedId === r.id ? " aiv-row--active" : ""}`}
                    onClick={() => {
                      setSelectedId(r.id);
                      setNoteDraft(r.reviewNotes ?? "");
                    }}
                  >
                    <td className="aiv-mono">{r.scanId}</td>
                    <td>{r.merchantName}</td>
                    <td className="aiv-mono">{r.creatorHandle}</td>
                    <td>{formatAmount(r.amountExtracted)}</td>
                    <td>{formatConfidence(r.merchantMatchConfidence)}</td>
                    <td>{formatGeo(r.geoDistanceMeters)}</td>
                    <td>{formatConfidence(r.visionConfidence)}</td>
                    <td>
                      <span className={`aiv-badge ${VERDICT_CLASS[r.verdict]}`}>
                        {VERDICT_LABEL[r.verdict]}
                      </span>
                    </td>
                    <td>{formatRelative(r.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <aside className="aiv-detail">
          {!selected ? (
            <div className="aiv-detail-empty">
              <p className="aiv-detail-empty-h">Select a row</p>
              <p className="aiv-detail-empty-body">
                Click any scan to see the vision output, reasoning, and the
                approve / reject controls.
              </p>
            </div>
          ) : (
            <div className="aiv-detail-card">
              <p className="aiv-detail-eyebrow">
                Verification {selected.id}
                {selected.visionMock && (
                  <span className="aiv-detail-mock-flag">
                    {" "}
                    · mock (no ANTHROPIC_API_KEY)
                  </span>
                )}
              </p>
              <h2 className="aiv-detail-h">
                {selected.merchantName}{" "}
                <span className="aiv-detail-h-light">
                  × {selected.creatorHandle}
                </span>
              </h2>
              <p className="aiv-detail-campaign">
                <Link href="#" className="aiv-detail-link">
                  {selected.campaignTitle}
                </Link>
              </p>

              <dl className="aiv-detail-grid">
                <div>
                  <dt>Verdict</dt>
                  <dd>
                    <span
                      className={`aiv-badge ${VERDICT_CLASS[selected.verdict]}`}
                    >
                      {VERDICT_LABEL[selected.verdict]}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Amount</dt>
                  <dd>{formatAmount(selected.amountExtracted)}</dd>
                </div>
                <div>
                  <dt>Name match</dt>
                  <dd>
                    {formatConfidence(selected.merchantMatchConfidence)}{" "}
                    <span className="aiv-detail-sub">
                      · OCR: &ldquo;{selected.ocrMerchantName ?? "—"}&rdquo;
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Geo distance</dt>
                  <dd>{formatGeo(selected.geoDistanceMeters)}</dd>
                </div>
                <div>
                  <dt>Vision confidence</dt>
                  <dd>{formatConfidence(selected.visionConfidence)}</dd>
                </div>
                <div>
                  <dt>Model / latency</dt>
                  <dd>
                    {selected.visionModel} · {selected.visionLatencyMs}ms
                  </dd>
                </div>
                <div>
                  <dt>Vision cost</dt>
                  <dd>${selected.visionCostUsd.toFixed(4)}</dd>
                </div>
                <div>
                  <dt>Observed</dt>
                  <dd>{formatRelative(selected.createdAt)}</dd>
                </div>
              </dl>

              <div className="aiv-detail-notes-block">
                <p className="aiv-detail-notes-label">Vision notes</p>
                <p className="aiv-detail-notes-body">{selected.ocrNotes}</p>
              </div>

              {selected.verdict === "manual_review" ? (
                <>
                  <label className="aiv-detail-note-label" htmlFor="aiv-note">
                    Your note (optional)
                  </label>
                  <textarea
                    id="aiv-note"
                    className="aiv-detail-note"
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    rows={3}
                    placeholder="Why approved / rejected — visible to ops only."
                  />

                  <div className="aiv-detail-actions">
                    <button
                      type="button"
                      className="aiv-btn aiv-btn--approve"
                      onClick={() => resolve("human_approved")}
                    >
                      Approve payout
                    </button>
                    <button
                      type="button"
                      className="aiv-btn aiv-btn--reject"
                      onClick={() => resolve("human_rejected")}
                    >
                      Reject scan
                    </button>
                  </div>
                </>
              ) : (
                <p className="aiv-detail-final">
                  Resolved &mdash; this row was{" "}
                  <strong>{VERDICT_LABEL[selected.verdict]}</strong>
                  {selected.reviewNotes ? `. "${selected.reviewNotes}"` : "."}
                </p>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
