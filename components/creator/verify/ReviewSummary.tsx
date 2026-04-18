"use client";

import type { KycState } from "@/lib/verify/mock-kyc";

interface Props {
  state: KycState;
  onEdit: (step: 1 | 2 | 3) => void;
  onSubmit: () => void;
  submitting: boolean;
}

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  xiaohongshu: "Little Red Book",
  youtube: "YouTube",
  twitter: "X / Twitter",
};

function formatFollowers(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function SectionHeader({
  label,
  onEdit,
}: {
  label: string;
  onEdit: () => void;
}) {
  return (
    <div className="kv-review-section-header">
      <span className="kv-review-section-label">{label}</span>
      <button type="button" className="kv-edit-link" onClick={onEdit}>
        Edit
      </button>
    </div>
  );
}

export default function ReviewSummary({
  state,
  onEdit,
  onSubmit,
  submitting,
}: Props) {
  const { identity, socials, address } = state;
  const connectedSocials = socials.filter((s) => s.connected);

  const docTypeLabel: Record<string, string> = {
    drivers_license: "Driver's License",
    id_card: "ID Card",
    passport: "Passport",
  };

  return (
    <div className="kv-step-body">
      <h2 className="kv-step-heading">Review</h2>
      <p className="kv-step-sub">
        Confirm everything looks right before submitting.
      </p>

      {/* Identity */}
      <div className="kv-review-section">
        <SectionHeader label="Identity" onEdit={() => onEdit(1)} />
        <div className="kv-review-grid">
          <div className="kv-review-item">
            <span className="kv-review-key">Name</span>
            <span className="kv-review-val">
              {identity.firstName || identity.lastName
                ? `${identity.firstName} ${identity.lastName}`.trim()
                : "—"}
            </span>
          </div>
          <div className="kv-review-item">
            <span className="kv-review-key">Date of Birth</span>
            <span className="kv-review-val">{identity.dob || "—"}</span>
          </div>
          <div className="kv-review-item">
            <span className="kv-review-key">Document Type</span>
            <span className="kv-review-val">
              {identity.docType ? docTypeLabel[identity.docType] : "—"}
            </span>
          </div>
          <div className="kv-review-item">
            <span className="kv-review-key">SSN Last 4</span>
            <span className="kv-review-val">
              {identity.ssnLast4 ? `••••${identity.ssnLast4}` : "—"}
            </span>
          </div>
          <div className="kv-review-item kv-review-item--full">
            <span className="kv-review-key">Documents</span>
            <span className="kv-review-val">
              {[
                identity.frontDoc && "Front",
                identity.backDoc && "Back",
                identity.selfieDoc && "Selfie",
              ]
                .filter(Boolean)
                .join(", ") || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="kv-review-section">
        <SectionHeader label="Social Accounts" onEdit={() => onEdit(2)} />
        {connectedSocials.length > 0 ? (
          <div className="kv-review-socials">
            {connectedSocials.map((s) => (
              <div key={s.platform} className="kv-review-social-row">
                <span className="kv-review-key">
                  {PLATFORM_LABELS[s.platform]}
                </span>
                <span className="kv-review-val">
                  {s.handle} · {formatFollowers(s.followers)} followers
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="kv-review-empty">No accounts connected.</p>
        )}
      </div>

      {/* Address */}
      <div className="kv-review-section">
        <SectionHeader label="Address" onEdit={() => onEdit(3)} />
        <div className="kv-review-grid">
          <div className="kv-review-item kv-review-item--full">
            <span className="kv-review-key">Street</span>
            <span className="kv-review-val">
              {[address.street, address.apt].filter(Boolean).join(", ") || "—"}
            </span>
          </div>
          <div className="kv-review-item">
            <span className="kv-review-key">City</span>
            <span className="kv-review-val">{address.city || "—"}</span>
          </div>
          <div className="kv-review-item">
            <span className="kv-review-key">State / ZIP</span>
            <span className="kv-review-val">
              {[address.state, address.zip].filter(Boolean).join(" ") || "—"}
            </span>
          </div>
          <div className="kv-review-item kv-review-item--full">
            <span className="kv-review-key">Proof of Address</span>
            <span className="kv-review-val">
              {address.proofDoc ? address.proofDoc.name : "Not provided"}
            </span>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="kv-review-submit">
        <button
          type="button"
          className="kv-submit-btn"
          onClick={onSubmit}
          disabled={submitting}
          aria-busy={submitting}
        >
          {submitting ? (
            <>
              <span className="kv-dots">
                <span className="kv-dot" />
                <span className="kv-dot" />
                <span className="kv-dot" />
              </span>
              <span>Submitting...</span>
            </>
          ) : (
            "Submit for Verification"
          )}
        </button>
        <p className="kv-submit-note">
          Review typically takes 24–48 hours. You'll be notified by email.
        </p>
      </div>
    </div>
  );
}
