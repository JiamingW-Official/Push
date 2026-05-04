"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import "./thread.css";
import "./campaign-detail.css";

// Mock campaign data — real data loads from useApplications + campaign detail API
interface ThreadCampaign {
  id: string;
  merchantName: string;
  campaignTitle: string;
  tier: string;
  status: "active" | "submitted" | "verified" | "completed";
  payout: number;
  deadline?: string;
  brief?: string;
  requirements?: string[];
  hashtags?: string[];
  contentGuidelines?: string[];
  milestone: string;
  // Walk-in attribution data
  walkinCount: number;
  walkinEarned: number;
  qrCode?: string;
  // Key dates
  campaignStart?: string;
  submissionDue?: string;
  paymentDate?: string;
}

const MOCK_CAMPAIGN: ThreadCampaign = {
  id: "demo",
  merchantName: "Onyx Coffee Bar",
  campaignTitle: "Morning Ritual — Summer Edition",
  tier: "Explorer",
  status: "active",
  payout: 65,
  deadline: new Date(Date.now() + 3 * 86400000).toISOString(),
  brief:
    "Visit Onyx Coffee Bar during morning hours (7am–11am) and create authentic content showing your experience with their ceremonial-grade matcha or signature espresso drinks.",
  requirements: [
    "Visit during 7am–11am window",
    "Feature at least one drink prominently",
    "Post to Instagram feed (not just Stories)",
    "Include location tag @onyxcoffeebar",
    "Disclose partnership with #ad or #sponsored",
  ],
  hashtags: ["#onyxcoffee", "#morningritual", "#williamsburgcoffee", "#ad"],
  contentGuidelines: [
    "Natural lighting preferred — avoid flash",
    "Show the drink in context (latte art, steam, etc.)",
    "Authentic caption — your real experience, not marketing copy",
    "Tag @onyxcoffeebar in the post, not just the caption",
  ],
  milestone: "accepted",
  walkinCount: 7,
  walkinEarned: 24,
  qrCode: "PUSH-OC-2024-XK9",
  campaignStart: new Date(Date.now() - 2 * 86400000).toISOString(),
  submissionDue: new Date(Date.now() + 3 * 86400000).toISOString(),
  paymentDate: new Date(Date.now() + 10 * 86400000).toISOString(),
};

const MILESTONES = [
  { id: "accepted", label: "Accepted" },
  { id: "scheduled", label: "Scheduled" },
  { id: "visited", label: "Visited" },
  { id: "proof_submitted", label: "Proof" },
  { id: "content_published", label: "Published" },
  { id: "verified", label: "Verified" },
  { id: "settled", label: "Paid" },
];

const SECTIONS = [
  "brief",
  "submission",
  "attribution",
  "earnings",
  "timeline",
  "chat",
] as const;
type Section = (typeof SECTIONS)[number];

const SECTION_LABELS: Record<Section, string> = {
  brief: "Brief",
  submission: "Submit",
  attribution: "QR",
  earnings: "Earnings",
  timeline: "Timeline",
  chat: "Chat",
};

type SubmissionStatus = "draft" | "submitted" | "approved";

function getMilestoneIndex(id: string) {
  return MILESTONES.findIndex((m) => m.id === id);
}

function formatDeadline(iso?: string): string {
  if (!iso) return "No deadline";
  const d = new Date(iso);
  const diff = Math.ceil((d.getTime() - Date.now()) / 86400000);
  if (diff < 0) return "Expired";
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `${diff} days left`;
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/* ── Shared card style ───────────────────────────────────── */
const cardStyle: React.CSSProperties = {
  background: "var(--surface-2)",
  border: "1px solid var(--hairline)",
  borderRadius: 10,
  padding: "20px 24px",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default function CampaignThreadPage({ params }: Props) {
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [campaign] = useState<ThreadCampaign>(MOCK_CAMPAIGN);
  const [activeSection, setActiveSection] = useState<Section>("brief");
  const [showCelebrate, setShowCelebrate] = useState(false);
  const [submitUrl, setSubmitUrl] = useState("");
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>("draft");
  const searchParams = useSearchParams();

  useEffect(() => {
    params.then(({ id }) => setCampaignId(id));
  }, [params]);

  useEffect(() => {
    if (searchParams.get("celebrate") === "1") {
      setShowCelebrate(true);
    }
    const step = searchParams.get("step");
    if (step && SECTIONS.includes(step as Section)) {
      const el = document.getElementById(`section-${step}`);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [searchParams]);

  function scrollToSection(s: Section) {
    const el = document.getElementById(`section-${s}`);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setActiveSection(s);
  }

  function handleSubmit() {
    if (!submitUrl) return;
    setSubmissionStatus("submitted");
  }

  const currentMilestoneIdx = getMilestoneIndex(campaign.milestone);
  const totalEarned =
    campaign.walkinEarned +
    (submissionStatus === "approved" ? campaign.payout : 0);

  const statusColors: Record<string, { bg: string; color: string }> = {
    active: { bg: "var(--accent-blue)", color: "var(--snow)" },
    submitted: { bg: "#bfa170", color: "var(--snow)" },
    verified: { bg: "#22c55e", color: "var(--snow)" },
    completed: { bg: "var(--ink-3)", color: "var(--snow)" },
  };
  const statusStyle = statusColors[campaign.status] ?? statusColors.active;

  return (
    <div
      style={{
        background: "var(--surface)",
        minHeight: "100%",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* ── Campaign Header ─────────────────────────────────────── */}
      <div
        style={{
          background: "var(--snow)",
          borderBottom: "1px solid var(--hairline)",
          padding: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {/* Left */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: "var(--ink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 20,
                color: "var(--snow)",
                flexShrink: 0,
              }}
            >
              {campaign.merchantName[0]}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  color: "var(--ink-4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 4,
                }}
              >
                {campaign.merchantName}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 22,
                  color: "var(--ink)",
                  lineHeight: 1.2,
                }}
              >
                {campaign.campaignTitle}
              </div>
            </div>
          </div>

          {/* Right */}
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                padding: "4px 12px",
                borderRadius: 6,
                background: "var(--surface-2)",
                border: "1px solid var(--hairline)",
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-3)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {campaign.tier}
            </span>
            <span
              style={{
                padding: "4px 12px",
                borderRadius: 6,
                background: statusStyle.bg,
                color: statusStyle.color,
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {campaign.status}
            </span>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "var(--ink-4)",
                  marginBottom: 2,
                }}
              >
                Earn up to
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: 28,
                  color: "var(--ink)",
                  lineHeight: 1,
                }}
              >
                ${campaign.payout}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Mini Nav ─────────────────────────────────────── */}
      <nav
        className="thread-mininav"
        aria-label="Thread sections"
        style={{
          display: "flex",
          padding: "0 24px",
          borderBottom: "1px solid var(--hairline)",
          background: "var(--snow)",
          overflowX: "auto",
          gap: 0,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => scrollToSection(s)}
            style={{
              padding: "12px 16px",
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: activeSection === s ? 700 : 400,
              color: activeSection === s ? "var(--ink)" : "var(--ink-3)",
              background: "none",
              border: "none",
              borderBottom:
                activeSection === s
                  ? "2px solid var(--brand-red)"
                  : "2px solid transparent",
              marginBottom: -1,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              whiteSpace: "nowrap",
            }}
          >
            {SECTION_LABELS[s]}
          </button>
        ))}
      </nav>

      {/* ── Thread Body ─────────────────────────────────────────── */}
      <div
        style={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: 800,
        }}
      >
        {/* 01 / Brief */}
        <section id="section-brief" style={cardStyle}>
          <span
            className="eyebrow"
            style={{ display: "block", marginBottom: 8 }}
          >
            01 / Brief
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 22,
              color: "var(--ink)",
              margin: "0 0 12px",
            }}
          >
            What to post
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--ink-3)",
              lineHeight: 1.6,
              margin: "0 0 20px",
            }}
          >
            {campaign.brief}
          </p>

          {/* Requirements */}
          {campaign.requirements && campaign.requirements.length > 0 && (
            <>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "var(--ink)",
                  margin: "0 0 10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Requirements
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {campaign.requirements.map((r, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      fontFamily: "var(--font-body)",
                      fontSize: 14,
                      color: "var(--ink)",
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: "1px solid var(--hairline)",
                        background: "var(--surface)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        color: "var(--ink-4)",
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      {i + 1}
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Hashtags */}
          {campaign.hashtags && campaign.hashtags.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "var(--ink-4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 8,
                }}
              >
                Required hashtags
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {campaign.hashtags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: "4px 12px",
                      borderRadius: 20,
                      background: "var(--surface)",
                      border: "1px solid var(--hairline)",
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--ink-3)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Content guidelines */}
          {campaign.contentGuidelines &&
            campaign.contentGuidelines.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: "var(--ink-4)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 8,
                  }}
                >
                  Content guidelines
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {campaign.contentGuidelines.map((g, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        color: "var(--ink-3)",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--ink-4)",
                          marginTop: 1,
                          flexShrink: 0,
                        }}
                      >
                        ·
                      </span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Deadline */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              background: "var(--surface)",
              border: "1px solid var(--hairline)",
              borderRadius: 8,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-4)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Deadline
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--brand-red)",
              }}
            >
              {formatDeadline(campaign.deadline)}
            </span>
          </div>
        </section>

        {/* 02 / My Submission */}
        <section id="section-submission" style={cardStyle}>
          <span
            className="eyebrow"
            style={{ display: "block", marginBottom: 8 }}
          >
            02 / Submit
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 22,
              color: "var(--ink)",
              margin: "0 0 16px",
            }}
          >
            My submission
          </h2>

          {/* Status bar */}
          <div
            style={{
              display: "flex",
              gap: 0,
              marginBottom: 20,
              borderRadius: 8,
              overflow: "hidden",
              border: "1px solid var(--hairline)",
            }}
          >
            {(["draft", "submitted", "approved"] as SubmissionStatus[]).map(
              (s, i) => {
                const isDone =
                  i <
                  ["draft", "submitted", "approved"].indexOf(submissionStatus);
                const isActive = submissionStatus === s;
                return (
                  <div
                    key={s}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      background: isActive
                        ? "var(--accent-blue)"
                        : isDone
                          ? "var(--surface-2)"
                          : "var(--surface)",
                      borderRight: i < 2 ? "1px solid var(--hairline)" : "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: isActive
                          ? "var(--snow)"
                          : isDone
                            ? "#22c55e"
                            : "var(--hairline)",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        fontWeight: isActive ? 700 : 400,
                        color: isActive
                          ? "var(--snow)"
                          : isDone
                            ? "var(--ink-3)"
                            : "var(--ink-4)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </span>
                  </div>
                );
              },
            )}
          </div>

          {submissionStatus === "approved" ? (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                padding: "16px",
                background: "var(--surface)",
                border: "1px solid var(--hairline)",
                borderRadius: 8,
                borderLeft: "3px solid #22c55e",
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#22c55e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--snow)",
                  fontSize: 16,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                ✓
              </span>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "var(--ink)",
                    marginBottom: 4,
                  }}
                >
                  Submission approved
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--ink-3)",
                  }}
                >
                  Your content passed DisclosureBot verification. Payout is
                  processing.
                </div>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor="submit-url"
                style={{
                  display: "block",
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  color: "var(--ink-3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 8,
                }}
              >
                Content URL (Instagram, TikTok, YouTube…)
              </label>
              <input
                id="submit-url"
                type="url"
                placeholder="https://www.instagram.com/p/..."
                value={submitUrl}
                onChange={(e) => setSubmitUrl(e.target.value)}
                disabled={submissionStatus === "submitted"}
                style={{
                  width: "100%",
                  border: "1px solid var(--hairline)",
                  borderRadius: 8,
                  padding: "10px 14px",
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  color: "var(--ink)",
                  background: "var(--snow)",
                  outline: "none",
                  boxSizing: "border-box",
                  marginBottom: 12,
                }}
              />
              <div
                style={{
                  border: "1px dashed var(--hairline)",
                  borderRadius: 8,
                  padding: "20px",
                  textAlign: "center",
                  background: "var(--surface)",
                  marginBottom: 16,
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--ink-4)",
                  }}
                >
                  Drop screenshots here, or click to upload
                </span>
              </div>
              {submissionStatus === "submitted" ? (
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: 8,
                    background: "var(--surface)",
                    border: "1px solid var(--hairline)",
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--ink-3)",
                  }}
                >
                  Submitted — awaiting merchant review
                </div>
              ) : (
                <button
                  className="btn-primary click-shift"
                  disabled={!submitUrl}
                  onClick={handleSubmit}
                  style={{
                    opacity: submitUrl ? 1 : 0.5,
                    cursor: submitUrl ? "pointer" : "not-allowed",
                  }}
                >
                  Submit for verification
                </button>
              )}
            </div>
          )}

          {/* DisclosureBot checklist */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {[
              {
                label: "Content URL submitted",
                done: submissionStatus !== "draft",
              },
              {
                label: "Disclosure check (DisclosureBot™)",
                done: submissionStatus === "approved",
              },
              {
                label: "QR attribution matched",
                done: submissionStatus === "approved",
              },
              { label: "Payout approved", done: false },
            ].map(({ label, done }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: done ? "var(--ink)" : "var(--ink-4)",
                }}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: done ? "none" : "1px solid var(--hairline)",
                    background: done ? "#22c55e" : "var(--surface)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    color: done ? "var(--snow)" : "var(--ink-4)",
                    flexShrink: 0,
                    fontWeight: 700,
                  }}
                >
                  {done ? "✓" : "○"}
                </span>
                {label}
              </div>
            ))}
          </div>
        </section>

        {/* 03 / Attribution */}
        <section id="section-attribution" style={cardStyle}>
          <span
            className="eyebrow"
            style={{ display: "block", marginBottom: 8 }}
          >
            03 / QR Attribution
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 22,
              color: "var(--ink)",
              margin: "0 0 12px",
            }}
          >
            Drive walk-ins
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--ink-3)",
              lineHeight: 1.6,
              margin: "0 0 20px",
            }}
          >
            Every customer who scans your unique QR code and walks into{" "}
            {campaign.merchantName} is counted as your attribution. The more
            walk-ins, the more you earn.
          </p>

          {/* QR block */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: 24,
              alignItems: "start",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                aria-label="QR Code"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 10,
                  border: "1px solid var(--hairline)",
                  background: "var(--snow)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--ink)",
                  marginBottom: 8,
                }}
              >
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  {/* Simulated QR corners */}
                  <rect
                    x="4"
                    y="4"
                    width="28"
                    height="28"
                    rx="0"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                  />
                  <rect
                    x="10"
                    y="10"
                    width="16"
                    height="16"
                    fill="currentColor"
                  />
                  <rect
                    x="48"
                    y="4"
                    width="28"
                    height="28"
                    rx="0"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                  />
                  <rect
                    x="54"
                    y="10"
                    width="16"
                    height="16"
                    fill="currentColor"
                  />
                  <rect
                    x="4"
                    y="48"
                    width="28"
                    height="28"
                    rx="0"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                  />
                  <rect
                    x="10"
                    y="54"
                    width="16"
                    height="16"
                    fill="currentColor"
                  />
                  {/* Dots grid */}
                  <rect
                    x="48"
                    y="48"
                    width="5"
                    height="5"
                    fill="currentColor"
                  />
                  <rect
                    x="56"
                    y="48"
                    width="5"
                    height="5"
                    fill="currentColor"
                  />
                  <rect
                    x="64"
                    y="48"
                    width="5"
                    height="5"
                    fill="currentColor"
                  />
                  <rect
                    x="48"
                    y="56"
                    width="5"
                    height="5"
                    fill="currentColor"
                  />
                  <rect
                    x="64"
                    y="56"
                    width="5"
                    height="5"
                    fill="currentColor"
                  />
                  <rect
                    x="56"
                    y="64"
                    width="5"
                    height="5"
                    fill="currentColor"
                  />
                  <rect
                    x="48"
                    y="64"
                    width="5"
                    height="5"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "var(--ink-4)",
                  letterSpacing: "0.04em",
                }}
              >
                {campaign.qrCode}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: 13,
                  color: "var(--ink)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 10,
                }}
              >
                How it works
              </div>
              <ol
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {[
                  "Share your QR code in your post caption or Stories",
                  `Followers scan → get a discount at ${campaign.merchantName}`,
                  "Each verified walk-in earns you a bonus on top of base pay",
                  "ConversionOracle™ matches scans to real in-store visits",
                ].map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      gap: 10,
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--ink-3)",
                      lineHeight: 1.4,
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "var(--accent-blue)",
                        color: "var(--snow)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
              <button
                className="btn-ghost click-shift"
                style={{ fontSize: 12, padding: "6px 14px" }}
              >
                Download QR PNG
              </button>
            </div>
          </div>
        </section>

        {/* 04 / Earnings */}
        <section id="section-earnings" style={cardStyle}>
          <span
            className="eyebrow"
            style={{ display: "block", marginBottom: 8 }}
          >
            04 / Earnings
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 22,
              color: "var(--ink)",
              margin: "0 0 20px",
            }}
          >
            Your payout
          </h2>

          {/* Big earn number */}
          <div
            style={{
              padding: "20px 24px",
              background: "var(--surface)",
              border: "1px solid var(--hairline)",
              borderRadius: 10,
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--ink-4)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 4,
              }}
            >
              Earned so far
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 48,
                color: "var(--ink)",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              ${totalEarned}
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--ink-3)",
              }}
            >
              from {campaign.walkinCount} walk-ins attributed to you
            </div>
          </div>

          {/* Earnings breakdown */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              border: "1px solid var(--hairline)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            {[
              {
                label: "Walk-in bonus",
                meta: `${campaign.walkinCount} verified walk-ins`,
                amount: `$${campaign.walkinEarned}`,
                total: false,
              },
              {
                label: "Base payout",
                meta: "Unlocks on approval",
                amount:
                  submissionStatus === "approved" ? `$${campaign.payout}` : "—",
                total: false,
              },
              {
                label: "Potential total",
                meta: "",
                amount: `$${campaign.walkinEarned + campaign.payout}`,
                total: true,
              },
            ].map(({ label, meta, amount, total }, i) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  background: total ? "var(--surface-2)" : "var(--snow)",
                  borderTop: i > 0 ? "1px solid var(--hairline)" : "none",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: total ? 700 : 400,
                      fontSize: 14,
                      color: "var(--ink)",
                      marginBottom: meta ? 2 : 0,
                    }}
                  >
                    {label}
                  </div>
                  {meta && (
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        color: "var(--ink-4)",
                      }}
                    >
                      {meta}
                    </div>
                  )}
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: total ? 20 : 16,
                    color: total ? "var(--ink)" : "var(--ink-3)",
                  }}
                >
                  {amount}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 05 / Timeline */}
        <section id="section-timeline" style={cardStyle}>
          <span
            className="eyebrow"
            style={{ display: "block", marginBottom: 8 }}
          >
            05 / Timeline
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 22,
              color: "var(--ink)",
              margin: "0 0 20px",
            }}
          >
            Key dates
          </h2>

          {/* Key dates row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              marginBottom: 24,
            }}
          >
            {[
              {
                label: "Campaign start",
                value: formatDate(campaign.campaignStart),
                accent: false,
              },
              {
                label: "Submission due",
                value: `${formatDate(campaign.submissionDue)} · ${formatDeadline(campaign.submissionDue)}`,
                accent: true,
              },
              {
                label: "Payment date",
                value: formatDate(campaign.paymentDate),
                accent: false,
              },
            ].map(({ label, value, accent }) => (
              <div
                key={label}
                style={{
                  padding: "12px 16px",
                  borderRadius: 8,
                  background: accent ? "var(--surface)" : "var(--surface)",
                  border: accent
                    ? "1px solid var(--brand-red)"
                    : "1px solid var(--hairline)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: "var(--ink-4)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 4,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 14,
                    color: accent ? "var(--brand-red)" : "var(--ink)",
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Milestone rail */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              overflowX: "auto",
            }}
          >
            {MILESTONES.map((m, idx) => {
              const state =
                idx < currentMilestoneIdx
                  ? "done"
                  : idx === currentMilestoneIdx
                    ? "active"
                    : "upcoming";
              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flex: 1,
                    position: "relative",
                    minWidth: 64,
                  }}
                >
                  {/* Connector line */}
                  {idx > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        left: "-50%",
                        top: 10,
                        width: "100%",
                        height: 2,
                        background:
                          state === "upcoming"
                            ? "var(--hairline)"
                            : "var(--accent-blue)",
                        zIndex: 0,
                      }}
                    />
                  )}
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background:
                        state === "done"
                          ? "var(--accent-blue)"
                          : state === "active"
                            ? "var(--brand-red)"
                            : "var(--surface-2)",
                      border:
                        state === "upcoming"
                          ? "1px solid var(--hairline)"
                          : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--snow)",
                      fontSize: 10,
                      fontWeight: 700,
                      zIndex: 1,
                      position: "relative",
                      marginBottom: 6,
                    }}
                  >
                    {state === "done" ? "✓" : ""}
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 10,
                      color:
                        state === "active"
                          ? "var(--brand-red)"
                          : state === "done"
                            ? "var(--ink-3)"
                            : "var(--ink-4)",
                      fontWeight: state === "active" ? 700 : 400,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {m.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 06 / Chat */}
        <section id="section-chat" style={cardStyle}>
          <span
            className="eyebrow"
            style={{ display: "block", marginBottom: 8 }}
          >
            06 / Chat
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 22,
              color: "var(--ink)",
              margin: "0 0 16px",
            }}
          >
            Message {campaign.merchantName}
          </h2>

          {/* Quick CTA to inbox */}
          <Link
            href={`/creator/messages?merchant=${encodeURIComponent(campaign.merchantName)}&campaign=${campaignId ?? campaign.id}`}
            className="click-shift"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              borderRadius: 8,
              border: "1px solid var(--hairline)",
              background: "var(--surface)",
              textDecoration: "none",
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 18 }}>✉</span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--ink)",
                flex: 1,
              }}
            >
              Open inbox thread with {campaign.merchantName}
            </span>
            <span style={{ color: "var(--ink-4)" }}>→</span>
          </Link>

          {/* Inline chat preview */}
          <div
            style={{
              border: "1px solid var(--hairline)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px",
                background: "var(--surface)",
                borderBottom: "1px solid var(--hairline)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "var(--ink)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 13,
                    color: "var(--snow)",
                    flexShrink: 0,
                  }}
                >
                  {campaign.merchantName[0]}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      fontSize: 13,
                      color: "var(--ink)",
                      marginBottom: 4,
                    }}
                  >
                    {campaign.merchantName}
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 14,
                      color: "var(--ink-3)",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    Hey! Looking forward to having you visit. Morning light is
                    best around 8–9am — feel free to grab a window seat.
                  </p>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 11,
                      color: "var(--ink-4)",
                      marginTop: 4,
                      display: "block",
                    }}
                  >
                    2 days ago
                  </span>
                </div>
              </div>
            </div>
            <div
              style={{
                padding: "12px",
                display: "flex",
                gap: 8,
                background: "var(--snow)",
              }}
            >
              <input
                type="text"
                placeholder="Message merchant..."
                style={{
                  flex: 1,
                  border: "1px solid var(--hairline)",
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  color: "var(--ink)",
                  background: "var(--surface-2)",
                  outline: "none",
                }}
              />
              <button
                className="btn-primary click-shift"
                style={{ padding: "8px 16px" }}
              >
                Send
              </button>
            </div>
            <div
              style={{
                padding: "8px 12px",
                borderTop: "1px solid var(--hairline)",
                background: "var(--snow)",
              }}
            >
              <button
                className="btn-ghost click-shift"
                style={{ fontSize: 12, padding: "4px 10px" }}
              >
                Suggest reply
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ── Completion Overlay ──────────────────────────────────── */}
      {showCelebrate && (
        <div
          role="dialog"
          aria-label="Campaign completed"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 24,
          }}
        >
          <div
            style={{
              background: "var(--snow)",
              borderRadius: 10,
              padding: "40px 48px",
              textAlign: "center",
              maxWidth: 400,
              width: "100%",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 28,
                color: "var(--ink)",
                margin: "0 0 12px",
              }}
            >
              Campaign complete.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 16,
                color: "var(--ink-3)",
                margin: "0 0 24px",
              }}
            >
              ${campaign.payout} is on its way to your account.
            </p>
            <button
              className="btn-primary click-shift"
              onClick={() => setShowCelebrate(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
