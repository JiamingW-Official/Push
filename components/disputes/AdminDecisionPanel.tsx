"use client";

import { useState } from "react";
import { Dispute, DisputeOutcome } from "@/lib/disputes/mock-admin-disputes";

type Props = {
  dispute: Dispute;
  onDecisionPosted?: (result: {
    outcome: DisputeOutcome;
    reasoning: string;
    split_pct?: number;
  }) => void;
};

const OUTCOME_OPTIONS: {
  value: DisputeOutcome;
  label: string;
  desc: string;
}[] = [
  {
    value: "refund_creator",
    label: "Pay creator",
    desc: "Full payout to creator. Merchant billed as agreed.",
  },
  {
    value: "refund_merchant",
    label: "Credit merchant",
    desc: "No creator payout. Merchant receives campaign credit refund.",
  },
  {
    value: "split",
    label: "Split payment",
    desc: "Proportional payout. Set creator's share with the slider.",
  },
  {
    value: "dismiss",
    label: "Dismiss",
    desc: "Dispute closed without action. Terms not violated.",
  },
];

export function AdminDecisionPanel({ dispute, onDecisionPosted }: Props) {
  const [outcome, setOutcome] = useState<DisputeOutcome | "">("");
  const [reasoning, setReasoning] = useState("");
  const [splitPct, setSplitPct] = useState(50);
  const [loading, setLoading] = useState(false);
  const [posted, setPosted] = useState(false);
  const [error, setError] = useState("");

  const isAlreadyResolved = ["resolved", "dismissed"].includes(dispute.status);

  // Payout preview
  const creatorReceives =
    outcome === "refund_creator"
      ? dispute.amount
      : outcome === "split"
        ? Math.round((splitPct / 100) * dispute.amount * 100) / 100
        : 0;
  const merchantCredited = dispute.amount - creatorReceives;

  async function handlePost() {
    if (!outcome) return setError("Select an outcome.");
    if (!reasoning.trim() || reasoning.trim().length < 20)
      return setError("Reasoning must be at least 20 characters.");
    if (outcome === "split" && (splitPct < 1 || splitPct > 99))
      return setError("Split percentage must be between 1 and 99.");

    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/disputes/${dispute.id}/decide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outcome,
          reasoning: reasoning.trim(),
          split_pct: outcome === "split" ? splitPct : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to post decision");
      setPosted(true);
      onDecisionPosted?.({
        outcome: outcome as DisputeOutcome,
        reasoning: reasoning.trim(),
        split_pct: outcome === "split" ? splitPct : undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  if (isAlreadyResolved) {
    return (
      <div className="adp adp--resolved">
        <div className="adp__resolved-badge">
          Dispute {dispute.status} — no further action required
        </div>
        {dispute.outcome_reasoning && (
          <p className="adp__resolved-reasoning">{dispute.outcome_reasoning}</p>
        )}
      </div>
    );
  }

  if (posted) {
    return (
      <div className="adp adp--posted">
        <div className="adp__posted-msg">Decision posted successfully.</div>
        <p className="adp__posted-sub">
          Status will update to &ldquo;resolved&rdquo; once platform processes
          the payout.
        </p>
      </div>
    );
  }

  return (
    <div className="adp">
      <div className="adp__header">
        <span className="adp__eyebrow">Admin Decision</span>
        <h3 className="adp__title">Post ruling</h3>
      </div>

      {/* Outcome selector */}
      <div className="adp__outcomes">
        {OUTCOME_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`adp__outcome-btn${outcome === opt.value ? " adp__outcome-btn--active" : ""}`}
            onClick={() => setOutcome(opt.value)}
          >
            <span className="adp__outcome-label">{opt.label}</span>
            <span className="adp__outcome-desc">{opt.desc}</span>
          </button>
        ))}
      </div>

      {/* Split slider */}
      {outcome === "split" && (
        <div className="adp__split">
          <div className="adp__split-header">
            <span>Creator share</span>
            <span className="adp__split-pct">{splitPct}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={99}
            value={splitPct}
            onChange={(e) => setSplitPct(Number(e.target.value))}
            className="adp__slider"
          />
          <div className="adp__split-labels">
            <span>0% creator</span>
            <span>100% creator</span>
          </div>
        </div>
      )}

      {/* Payout preview */}
      {outcome && (
        <div className="adp__preview">
          <div className="adp__preview-row">
            <span>Creator receives</span>
            <strong
              style={{
                color:
                  creatorReceives > 0
                    ? "var(--accent-blue)"
                    : "var(--graphite)",
              }}
            >
              ${creatorReceives.toFixed(2)}
            </strong>
          </div>
          <div className="adp__preview-row">
            <span>Merchant credited</span>
            <strong
              style={{
                color:
                  merchantCredited > 0 ? "var(--brand-red)" : "var(--graphite)",
              }}
            >
              ${merchantCredited.toFixed(2)}
            </strong>
          </div>
        </div>
      )}

      {/* What parties will see */}
      {outcome && (
        <div className="adp__party-preview">
          <div className="adp__party-preview-header">
            Preview — what each party sees
          </div>
          <div className="adp__party-preview-row">
            <span className="adp__party-label">
              Creator ({dispute.creator_name})
            </span>
            <p className="adp__party-text">
              {outcome === "refund_creator" &&
                `Your dispute has been reviewed. The ruling is in your favor. A payout of $${dispute.amount.toFixed(2)} has been approved.`}
              {outcome === "refund_merchant" &&
                `Your dispute has been reviewed. After examining the evidence, the ruling is in the merchant's favor. No payout will be issued for this campaign.`}
              {outcome === "split" &&
                `Your dispute has been reviewed. A proportional payout of $${creatorReceives.toFixed(2)} (${splitPct}% of $${dispute.amount.toFixed(2)}) has been approved.`}
              {outcome === "dismiss" &&
                `Your dispute has been reviewed and dismissed. No terms violations were found. Please refer to Platform Terms for eligibility requirements.`}
            </p>
          </div>
          <div className="adp__party-preview-row">
            <span className="adp__party-label">
              Merchant ({dispute.merchant_business})
            </span>
            <p className="adp__party-text">
              {outcome === "refund_creator" &&
                `The dispute raised by ${dispute.creator_name} has been reviewed. The ruling is in the creator's favor. The full campaign payout of $${dispute.amount.toFixed(2)} will proceed.`}
              {outcome === "refund_merchant" &&
                `The dispute has been reviewed. The ruling is in your favor. You will receive a campaign credit of $${dispute.amount.toFixed(2)}.`}
              {outcome === "split" &&
                `The dispute has been reviewed. A proportional settlement was reached: creator receives ${splitPct}%, you are credited $${merchantCredited.toFixed(2)}.`}
              {outcome === "dismiss" &&
                `The dispute has been reviewed and dismissed. The campaign terms were met. No changes to billing.`}
            </p>
          </div>
        </div>
      )}

      {/* Reasoning */}
      <div className="adp__reasoning">
        <label className="adp__reasoning-label" htmlFor="reasoning">
          Required reasoning <span>(min 20 chars — internal record)</span>
        </label>
        <textarea
          id="reasoning"
          className="adp__reasoning-textarea"
          placeholder="Document your reasoning for this decision. This is for internal records and audit trail."
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          rows={4}
        />
        <div className="adp__char-count">
          {reasoning.length} chars{" "}
          {reasoning.length < 20 && `(need ${20 - reasoning.length} more)`}
        </div>
      </div>

      {/* Error */}
      {error && <div className="adp__error">{error}</div>}

      {/* Submit */}
      <button
        type="button"
        className="adp__submit"
        onClick={handlePost}
        disabled={loading || !outcome || reasoning.trim().length < 20}
      >
        {loading ? "Posting…" : "Post decision"}
      </button>
    </div>
  );
}
