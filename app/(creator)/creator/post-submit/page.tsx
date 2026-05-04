"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import "./post-submit.css";

/* ── Types ───────────────────────────────────────────────── */

interface SubmitData {
  campaign_id: string;
  campaign_name: string;
  merchant: string;
  platform: string;
  content_type: string;
  content_url?: string;
  submitted_at: string;
}

/* ── Demo helpers ────────────────────────────────────────── */

function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=creator");
}

const DEMO_DATA: SubmitData = {
  campaign_id: "demo-001",
  campaign_name: "Spring Menu Launch",
  merchant: "Superiority Burger",
  platform: "Instagram",
  content_type: "Reel",
  content_url: "https://instagram.com/p/demo-reel",
  submitted_at: new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }),
};

/* ── Checkmark SVG ───────────────────────────────────────── */

function CheckmarkSVG() {
  return (
    <div className="ps-check-wrap" aria-hidden="true">
      <div className="ps-check-circle">
        <svg
          className="ps-check-svg"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="ps-check-path"
            d="M10 21 L16 27 L30 13"
            stroke="var(--brand-red)"
            strokeWidth="2.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}

/* ── What happens next steps ─────────────────────────────── */

const NEXT_STEPS = [
  {
    num: "01",
    title: "Merchant Review",
    desc: "The merchant will verify your content meets campaign requirements. You'll get a notification once approved.",
    time: "Est. 24–48 hours",
  },
  {
    num: "02",
    title: "Walk-in Attribution Window Opens",
    desc: "Your unique QR link is live. Any verified walk-ins in the next 30 days count toward your payout.",
    time: "Active now · 30-day window",
  },
  {
    num: "03",
    title: "Payout Released",
    desc: "Base payout + 3% on every verified walk-in gets released to your wallet after merchant approval.",
    time: "Speed depends on your tier",
  },
];

/* ── Main page ───────────────────────────────────────────── */

export default function PostSubmitPage() {
  return (
    <Suspense fallback={<div className="ps-loading">Loading…</div>}>
      <PostSubmitContent />
    </Suspense>
  );
}

function PostSubmitContent() {
  const searchParams = useSearchParams();
  const isDemo = checkDemoMode();

  const data: SubmitData = isDemo
    ? DEMO_DATA
    : {
        campaign_id: searchParams.get("campaign_id") ?? "",
        campaign_name: searchParams.get("campaign_name") ?? "Campaign",
        merchant: searchParams.get("merchant") ?? "Merchant",
        platform: searchParams.get("platform") ?? "Instagram",
        content_type: searchParams.get("content_type") ?? "Post",
        content_url: searchParams.get("content_url") ?? undefined,
        submitted_at: new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

  return (
    <div className="ps-page">
      {/* Dark editorial hero */}
      <header className="ps-header">
        <div className="ps-header-inner">
          <div className="ps-header-col">
            {/* Checkmark circle */}
            <div className="ps-hero-check" aria-hidden="true">
              <svg
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 21 L16 27 L30 13"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  fill="none"
                />
              </svg>
            </div>

            <div>
              <span className="ps-eyebrow">SUBMISSION RECEIVED</span>
              <h1 className="ps-hero-title">Submitted!</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="ps-body">
        <div className="ps-status-row">
          <div style={{ display: "none" }}></div>

          <div className="ps-status-pill">
            <span className="ps-status-dot" />
            <span className="ps-status-text">
              Under review · Usually 24–48 hours · We&apos;ll notify you
            </span>
          </div>
        </div>

        {/* ── 1. Submission preview ────────────────────────── */}
        <div className="ps-card">
          <span className="ps-card-eyebrow">YOUR SUBMISSION</span>

          <div className="ps-preview-row">
            {/* Thumbnail placeholder */}
            <div className="ps-thumb" aria-hidden="true">
              ▶
            </div>

            <div className="ps-preview-info">
              <p className="ps-preview-title">{data.campaign_name}</p>
              <div className="ps-preview-tags">
                <span className="ps-preview-merchant">{data.merchant}</span>
                <span className="ps-preview-sep">·</span>
                <span className="ps-preview-meta">
                  {data.platform} · {data.content_type}
                </span>
              </div>
              {data.content_url && (
                <a
                  href={data.content_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ps-preview-link"
                >
                  {data.content_url}
                </a>
              )}
            </div>
          </div>

          <p className="ps-preview-timestamp">Submitted {data.submitted_at}</p>
        </div>

        {/* ── 2. What happens next ─────────────────────────── */}
        <div className="ps-card">
          <span className="ps-card-next-eyebrow">WHAT HAPPENS NEXT</span>

          <div className="ps-steps">
            {NEXT_STEPS.map((step, i) => (
              <div key={step.num} className="ps-step">
                {/* Connector line */}
                {i < NEXT_STEPS.length - 1 && (
                  <div className="ps-step-connector" />
                )}
                {/* Step number badge — 40×40 icon tile */}
                <div className={`ps-step-icon-tile${i === 0 ? " active" : ""}`}>
                  <span className="ps-step-num">{step.num}</span>
                </div>
                {/* Content */}
                <div className="ps-step-content">
                  <p className="ps-step-title">{step.title}</p>
                  <p className="ps-step-desc">{step.desc}</p>
                  <span className="ps-step-time">{step.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tip ──────────────────────────────────────────── */}
        <div className="ps-tip-card">
          <span className="ps-tip-label">PRO TIP</span>
          <p className="ps-tip-text">
            Share your content on your stories and tag {data.merchant} to
            increase walk-in conversions. Every verified visit in the 30-day
            window adds to your payout.
          </p>
        </div>

        {/* ── 3. CTAs ──────────────────────────────────────── */}
        <div className="ps-cta-row">
          <Link
            href="/creator/dashboard?tab=discover"
            className="btn btn-primary"
          >
            View My Dashboard
          </Link>
          <Link href="/creator/campaigns" className="btn btn-secondary">
            Find More Campaigns
          </Link>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              navigator.clipboard?.writeText(data.campaign_id);
            }}
          >
            Copy Confirmation #
          </button>
        </div>
      </div>
    </div>
  );
}
