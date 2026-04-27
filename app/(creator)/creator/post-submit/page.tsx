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
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100svh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-body)",
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-4)",
            background: "var(--surface)",
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
    <div
      style={{
        background: "var(--surface-2)",
        minHeight: "100svh",
        paddingBottom: 96,
      }}
    >
      {/* Dark editorial hero */}
      <header
        style={{
          background: "var(--char)",
          borderBottom: "2px solid var(--ink)",
          padding: "64px 40px 56px",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            {/* Checkmark circle */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "var(--brand-red)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
                boxShadow: "0 8px 24px rgba(193,18,31,0.32)",
              }}
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: 28, height: 28 }}
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
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.38)",
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                SUBMISSION RECEIVED
              </span>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(48px,6vw,72px)",
                  fontWeight: 900,
                  color: "var(--snow)",
                  margin: 0,
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                }}
              >
                Submitted!
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 40px 0" }}>
        <div
          style={{
            paddingBottom: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 16,
          }}
        >
          <div style={{ display: "none" }}></div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--ink-4)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--ink-4)",
              }}
            >
              Under review · Usually 24–48 hours · We&apos;ll notify you
            </span>
          </div>
        </div>

        {/* ── 1. Submission preview ────────────────────────── */}
        <div
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--hairline)",
            borderRadius: 10,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              color: "var(--ink-4)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 16,
            }}
          >
            YOUR SUBMISSION
          </span>

          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            {/* Thumbnail placeholder */}
            <div
              style={{
                width: 64,
                height: 64,
                background: "var(--surface-3)",
                border: "1px solid var(--hairline)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                color: "var(--ink-4)",
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              ▶
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--ink)",
                  margin: 0,
                }}
              >
                {data.campaign_name}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink-3)",
                  }}
                >
                  {data.merchant}
                </span>
                <span style={{ color: "var(--hairline)" }}>·</span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--ink-4)",
                  }}
                >
                  {data.platform} · {data.content_type}
                </span>
              </div>
              {data.content_url && (
                <a
                  href={data.content_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    color: "var(--accent-blue)",
                    textDecoration: "none",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {data.content_url}
                </a>
              )}
            </div>
          </div>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              color: "var(--ink-4)",
              margin: "16px 0 0",
              letterSpacing: "0.02em",
            }}
          >
            Submitted {data.submitted_at}
          </p>
        </div>

        {/* ── 2. What happens next ─────────────────────────── */}
        <div
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--hairline)",
            borderRadius: 10,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              color: "var(--ink-4)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 24,
            }}
          >
            WHAT HAPPENS NEXT
          </span>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {NEXT_STEPS.map((step, i) => (
              <div
                key={step.num}
                style={{
                  display: "grid",
                  gridTemplateColumns: "40px 1fr",
                  gap: 16,
                  paddingBottom: i < NEXT_STEPS.length - 1 ? 24 : 0,
                  position: "relative",
                }}
              >
                {/* Connector line */}
                {i < NEXT_STEPS.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      left: 19,
                      top: 36,
                      width: 2,
                      height: "calc(100% - 12px)",
                      background: "var(--hairline)",
                    }}
                  />
                )}
                {/* Step number badge */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background:
                      i === 0 ? "var(--brand-red)" : "var(--surface-3)",
                    border: "1px solid var(--hairline)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    zIndex: 1,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 11,
                      fontWeight: 700,
                      color: i === 0 ? "var(--snow)" : "var(--ink-4)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {step.num}
                  </span>
                </div>
                {/* Content */}
                <div style={{ paddingTop: 8 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--ink)",
                      margin: "0 0 4px",
                    }}
                  >
                    {step.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--ink-4)",
                      lineHeight: 1.5,
                      margin: "0 0 6px",
                    }}
                  >
                    {step.desc}
                  </p>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 11,
                      color: "var(--ink-4)",
                      background: "var(--surface-3)",
                      border: "1px solid var(--hairline)",
                      borderRadius: 4,
                      padding: "2px 8px",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {step.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tip ──────────────────────────────────────────── */}
        <div
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--hairline)",
            borderRadius: 10,
            padding: 20,
            marginBottom: 24,
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 700,
              color: "var(--ink-4)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              paddingTop: 2,
            }}
          >
            PRO TIP
          </span>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--ink-3)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Share your content on your stories and tag {data.merchant} to
            increase walk-in conversions. Every verified visit in the 30-day
            window adds to your payout.
          </p>
        </div>

        {/* ── 3. CTAs ──────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link
            href="/creator/dashboard?tab=discover"
            className="btn-primary click-shift"
          >
            View My Work
          </Link>
          <Link
            href={`/creator/campaigns/${data.campaign_id}`}
            className="btn-ghost click-shift"
          >
            Back to Campaign
          </Link>
        </div>
      </div>
    </div>
  );
}
