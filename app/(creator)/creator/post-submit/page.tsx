"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { DisclosureBot } from "@/components/creator/DisclosureBot";
import type { DisclosureCheckResult } from "@/app/api/creator/disclosure/check/route";
import "./post-submit.css";

function PostSubmitContent() {
  const params = useSearchParams();
  const campaignId = params.get("campaign_id");
  const brandName = params.get("brand") ?? "the brand";
  const platform = (params.get("platform") ?? "instagram") as
    | "instagram"
    | "tiktok"
    | "xhs";

  const [disclosureVerified, setDisclosureVerified] = useState(false);
  const [postUrl, setPostUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleVerified(_result: DisclosureCheckResult) {
    setDisclosureVerified(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!postUrl.trim() || !disclosureVerified) return;
    setSubmitting(true);
    // TODO: call /api/creator/post-submit with campaign_id + post_url
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="ps-completion">
        <span className="ps-completion-icon" aria-hidden="true">
          ✓
        </span>
        <h2 className="ps-completion-heading">Post submitted.</h2>
        <p className="ps-completion-body">
          Your post has been logged and your earnings will be confirmed within
          24h once the visit is verified.
        </p>
        <Link href="/creator/dashboard" className="ps-completion-cta">
          Back to dashboard →
        </Link>
      </div>
    );
  }

  return (
    <div className="ps-page">
      <div className="ps-header">
        <Link href="/creator/dashboard" className="ps-back">
          ← Dashboard
        </Link>
        <span className="ps-eyebrow">SUBMIT POST</span>
        <h1 className="ps-heading">Your post, verified.</h1>
        <p className="ps-sub">
          DisclosureBot™ checks your caption for FTC compliance before
          submission. Required for all Push campaigns.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="ps-form">
        {/* Step 1 — DisclosureBot */}
        <div className="ps-step">
          <span className="ps-step-num">01</span>
          <div className="ps-step-content">
            <p className="ps-step-label">VERIFY DISCLOSURE</p>
            <DisclosureBot
              platform={platform}
              brandName={brandName}
              onVerified={handleVerified}
            />
          </div>
        </div>

        {/* Step 2 — Post URL */}
        <div
          className={`ps-step${disclosureVerified ? "" : " ps-step--locked"}`}
        >
          <span className="ps-step-num">02</span>
          <div className="ps-step-content">
            <label className="ps-step-label" htmlFor="post-url">
              POST URL
              {!disclosureVerified && (
                <span className="ps-lock-hint">— complete Step 01 first</span>
              )}
            </label>
            <input
              id="post-url"
              type="url"
              className="ps-url-input"
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              placeholder="https://www.instagram.com/p/..."
              disabled={!disclosureVerified}
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="ps-submit-btn"
          disabled={!disclosureVerified || !postUrl.trim() || submitting}
          aria-busy={submitting}
        >
          {submitting ? "Submitting…" : "Submit post →"}
        </button>

        {campaignId && (
          <p className="ps-campaign-ref">Campaign: {campaignId}</p>
        )}
      </form>
    </div>
  );
}

export default function PostSubmitPage() {
  return (
    <Suspense>
      <PostSubmitContent />
    </Suspense>
  );
}
