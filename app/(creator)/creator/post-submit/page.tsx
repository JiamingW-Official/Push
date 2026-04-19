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
            stroke="#c1121f"
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
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100svh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "CS Genio Mono, monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(0,48,73,0.4)",
          }}
        >
          Loading…
        </div>
      }
    >
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
      {/* ── Hero: instant positive feedback ─────────────── */}
      <div className="ps-hero">
        <CheckmarkSVG />

        <p className="ps-hero-eyebrow">Submission Received</p>
        <h1 className="ps-hero-title">SUBMISSION RECEIVED</h1>

        <div className="ps-hero-status">
          <span className="ps-hero-status-dot" />
          Under review
        </div>
        <p className="ps-hero-time-estimate">
          Usually 24–48 hours · We'll notify you
        </p>
      </div>

      {/* ── Body ────────────────────────────────────────── */}
      <div className="ps-body">
        {/* ── 1. Submission preview ──────────────────── */}
        <div className="ps-section">
          <p className="ps-section-eyebrow">Your Submission</p>

          <div className="ps-submission-row">
            <div className="ps-submission-thumb" aria-hidden="true">
              <span className="ps-submission-thumb-icon">▶</span>
            </div>
            <div className="ps-submission-info">
              <p className="ps-submission-title">{data.campaign_name}</p>
              <div className="ps-submission-meta">
                <span>{data.merchant}</span>
                <span>
                  {data.platform} · {data.content_type}
                </span>
                {data.content_url && (
                  <a
                    href={data.content_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ps-submission-link"
                  >
                    {data.content_url}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="ps-submission-timestamp">
            Submitted {data.submitted_at}
          </div>
        </div>

        {/* ── 2. What happens next ────────────────────── */}
        <div className="ps-section">
          <p className="ps-section-eyebrow">What Happens Next</p>
          <div className="ps-steps">
            {NEXT_STEPS.map((step) => (
              <div key={step.num} className="ps-step">
                <div className="ps-step-num-wrap">
                  <span className="ps-step-dot" />
                  <span className="ps-step-num">{step.num}</span>
                </div>
                <div className="ps-step-content">
                  <p className="ps-step-title">{step.title}</p>
                  <p className="ps-step-desc">{step.desc}</p>
                  <p className="ps-step-time">{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tip ─────────────────────────────────────── */}
        <div className="ps-tip">
          <p className="ps-tip-label">Pro tip</p>
          <p className="ps-tip-text">
            Share your content on your stories and tag {data.merchant} to
            increase walk-in conversions. Every verified visit in the 30-day
            window adds to your payout.
          </p>
        </div>

        {/* ── 3. CTAs ─────────────────────────────────── */}
        <div className="ps-cta-section">
          <Link
            href={`/creator/campaigns/${data.campaign_id}`}
            className="ps-primary-btn"
          >
            Back to Campaign
            <span className="ps-primary-btn-arrow">→</span>
          </Link>
          <Link
            href="/creator/dashboard?tab=discover"
            className="ps-secondary-btn"
          >
            Find More Campaigns
          </Link>
        </div>
      </div>
    </div>
  );
}
