"use client";

import { useRef, useState } from "react";
import type {
  Dispute,
  DisputeReason,
  ParticipantRole,
} from "@/lib/disputes/types";
import { DISPUTE_REASON_LABELS } from "@/lib/disputes/types";
import { useToast } from "@/components/toast/Toaster";
import { EvidenceUploader } from "./EvidenceUploader";

const DEMO_CAMPAIGNS = [
  {
    id: "demo-campaign-001",
    title: "Croissant Review — Weekend Special",
    merchant: "Le Bec Fin Bakery",
  },
  {
    id: "demo-campaign-002",
    title: "Matcha Review + Ambiance Video",
    merchant: "Cha Cha Matcha",
  },
  {
    id: "demo-campaign-003",
    title: "Instagram Stories — Grand Opening",
    merchant: "Flamingo Estate NYC",
  },
  {
    id: "demo-campaign-004",
    title: "Before & After — Brow Lamination",
    merchant: "Brow Theory",
  },
  {
    id: "demo-campaign-005",
    title: "Rooftop Bar Review — Sunset Series",
    merchant: "230 Fifth Rooftop",
  },
];

interface NewDisputeModalProps {
  open: boolean;
  onClose: () => void;
  filedByRole: ParticipantRole;
  filedBy: string;
  onCreated: (dispute: Dispute) => void;
}

const REASONS: DisputeReason[] = [
  "missing_payment",
  "incorrect_amount",
  "no_show_scan",
  "content_violation",
  "other",
];

export function NewDisputeModal({
  open,
  onClose,
  filedByRole,
  filedBy,
  onCreated,
}: NewDisputeModalProps) {
  const { toast } = useToast();
  const [campaignId, setCampaignId] = useState("");
  const [reason, setReason] = useState<DisputeReason>("missing_payment");
  const [description, setDescription] = useState("");
  const [expectedOutcome, setExpectedOutcome] = useState("");
  const [amount, setAmount] = useState("");
  const [evidence, setEvidence] = useState<
    Omit<import("@/lib/disputes/types").DisputeEvidence, "id" | "uploadedAt">[]
  >([]);
  const [submitting, setSubmitting] = useState(false);
  const campaignRef = useRef<HTMLSelectElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const amountRef = useRef<HTMLInputElement | null>(null);

  if (!open) return null;

  const selectedCampaign = DEMO_CAMPAIGNS.find((c) => c.id === campaignId);
  const canSubmit = !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    if (!campaignId) {
      toast.error("Pick a campaign to file against");
      campaignRef.current?.focus();
      return;
    }
    if (description.trim().length < 10) {
      toast.error("Add a description (10 chars minimum)");
      descriptionRef.current?.focus();
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error("Enter a disputed amount in USD");
      amountRef.current?.focus();
      return;
    }

    setSubmitting(true);

    // Frontend-only mock: build the Dispute row that matches mock-disputes
    // shape, push to localStorage so the disputes page picks it up on next
    // mount (it already merges localStorage entries with the static fixtures).
    const now = new Date().toISOString();
    const newId = `D-2026-${String(Date.now()).slice(-6)}`;
    const localDispute: Dispute = {
      id: newId,
      campaignId,
      campaignTitle: selectedCampaign?.title ?? "",
      merchantName: selectedCampaign?.merchant ?? "",
      creatorName: filedByRole === "creator" ? filedBy : "",
      filedBy,
      filedByRole,
      otherPartyName:
        filedByRole === "creator"
          ? (selectedCampaign?.merchant ?? "")
          : filedBy,
      otherPartyRole: filedByRole === "creator" ? "merchant" : "creator",
      reason,
      description,
      amount: parsedAmount,
      expectedOutcome,
      status: "open",
      events: [
        {
          id: `evt-${newId}-1`,
          disputeId: newId,
          type: "filed",
          authorRole: filedByRole,
          authorName: filedBy,
          message: description,
          createdAt: now,
        },
      ],
      evidence: [],
      createdAt: now,
      updatedAt: now,
    };

    try {
      const stored = JSON.parse(
        localStorage.getItem("push-disputes") ?? "[]",
      ) as Dispute[];
      stored.unshift(localDispute);
      localStorage.setItem("push-disputes", JSON.stringify(stored));
    } catch {
      // localStorage unavailable — still emit to parent so the in-memory list updates.
    }

    onCreated(localDispute);
    toast.success(`Dispute opened · ${newId}`);
    onClose();
    resetForm();
    setSubmitting(false);
  }

  function resetForm() {
    setCampaignId("");
    setReason("missing_payment");
    setDescription("");
    setExpectedOutcome("");
    setAmount("");
    setEvidence([]);
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="dispute-modal-overlay" onClick={handleOverlayClick}>
      <div
        className="dispute-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="dispute-modal__header">
          <h2 className="dispute-modal__title" id="modal-title">
            File a Dispute
          </h2>
          <button
            className="dispute-modal__close"
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="dispute-modal__body">
            {/* Campaign */}
            <div className="dispute-modal__field">
              <label htmlFor="dm-campaign">Campaign</label>
              <select
                id="dm-campaign"
                ref={campaignRef}
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
                required
              >
                <option value="">Select a campaign…</option>
                {DEMO_CAMPAIGNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} — {c.merchant}
                  </option>
                ))}
              </select>
            </div>

            {/* Reason */}
            <div className="dispute-modal__field">
              <label htmlFor="dm-reason">Reason</label>
              <select
                id="dm-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value as DisputeReason)}
              >
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {DISPUTE_REASON_LABELS[r]}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div className="dispute-modal__field">
              <label htmlFor="dm-amount">Amount in dispute (USD)</label>
              <input
                id="dm-amount"
                ref={amountRef}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="dispute-modal__field">
              <label htmlFor="dm-description">
                Description <span style={{ color: "var(--brand-red)" }}>*</span>
              </label>
              <textarea
                id="dm-description"
                ref={descriptionRef}
                placeholder="Describe the issue in detail…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
              />
            </div>

            {/* Evidence */}
            <div className="dispute-modal__field">
              <label>Evidence (optional)</label>
              <EvidenceUploader
                disputeId="new"
                uploadedBy={filedByRole}
                onChange={setEvidence}
              />
            </div>

            {/* Expected outcome */}
            <div className="dispute-modal__field">
              <label htmlFor="dm-outcome">Expected outcome</label>
              <select
                id="dm-outcome"
                value={expectedOutcome}
                onChange={(e) => setExpectedOutcome(e.target.value)}
              >
                <option value="">Select…</option>
                <option value="Refund full amount">Refund full amount</option>
                <option value="Partial refund">Partial refund</option>
                <option value="Re-verify visit">Re-verify visit</option>
                <option value="Content revision">Content revision</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="dispute-modal__footer">
            <button
              className="dispute-modal__cancel"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="dispute-modal__submit"
              type="submit"
              disabled={!canSubmit}
            >
              {submitting ? "Filing…" : "File Dispute"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
