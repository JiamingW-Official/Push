"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { TierBadge } from "@/components/creator/TierBadge";
import {
  MOCK_SUBMISSIONS,
  type MockSubmission,
} from "@/lib/data/mock-submissions";
import { creatorMock } from "@/lib/data/api-client";
import "./post-workspace.css";

/* ── Types ───────────────────────────────────────────────── */

type CreatorTier =
  | "seed"
  | "explorer"
  | "operator"
  | "proven"
  | "closer"
  | "partner";

type ContentType = "post" | "story" | "reel" | "video" | "carousel";
type Platform = "instagram" | "tiktok" | "xiaohongshu" | "youtube";
type SubmissionStatus = "draft" | "pending_review" | "approved" | "rejected";

type Campaign = {
  id: string;
  title: string;
  business_name: string;
  payout: number;
  deadline?: string | null;
  tier_required: CreatorTier;
  description: string;
  requirements: string[];
  category?: string;
};

type LocalAttachment = {
  id: string;
  url: string;
  type: "image" | "video";
  filename: string;
  thumbnailUrl?: string;
};

type ComplianceItem = {
  id: string;
  text: string;
  checked: boolean;
};

/* ── Constants ───────────────────────────────────────────── */

const CONTENT_TYPES: { key: ContentType; label: string }[] = [
  { key: "post", label: "Post" },
  { key: "story", label: "Story" },
  { key: "reel", label: "Reel" },
  { key: "video", label: "Video" },
  { key: "carousel", label: "Carousel" },
];

const PLATFORMS: { key: Platform; label: string }[] = [
  { key: "instagram", label: "IG" },
  { key: "tiktok", label: "TikTok" },
  { key: "xiaohongshu", label: "Red" },
  { key: "youtube", label: "YouTube" },
];

const MILESTONE_STEPS: { key: string; label: string }[] = [
  { key: "scan", label: "Scan" },
  { key: "verify", label: "Verify" },
  { key: "content", label: "Content" },
  { key: "paid", label: "Paid" },
];

const DEFAULT_COMPLIANCE: ComplianceItem[] = [
  { id: "ftc-ad", text: "#ad disclosure included in caption", checked: false },
  { id: "brand-tag", text: "Brand account tagged in post", checked: false },
  { id: "hashtags", text: "All required hashtags included", checked: false },
  { id: "mentions", text: "Required @mentions added", checked: false },
  {
    id: "content-review",
    text: "Content reviewed for brand guidelines",
    checked: false,
  },
];

const DEFAULT_HASHTAGS = ["#ad", "#sponsored", "#pushcreator"];

const DEFAULT_MENTIONS = ["@pushapp"];

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  draft: "Draft",
  pending_review: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
};

/* ── Demo campaign data ──────────────────────────────────── */

const DEMO_CAMPAIGNS: Record<string, Campaign> = {
  "camp-001": {
    id: "camp-001",
    title: "Morning Ritual Campaign",
    business_name: "Blank Street Coffee",
    payout: 0,
    deadline: "2026-04-30",
    tier_required: "seed",
    description:
      "Visit any Blank Street location, enjoy a drink, and share your experience.",
    requirements: [
      "1 Instagram story tagging @blankstreetcoffee",
      "Visit during peak hours (7-10am)",
    ],
    category: "Coffee",
  },
  "camp-002": {
    id: "camp-002",
    title: "Best Burger in NYC Feature",
    business_name: "Superiority Burger",
    payout: 35,
    deadline: "2026-04-25",
    tier_required: "explorer",
    description:
      "Feature our award-winning veggie burgers in an authentic review.",
    requirements: [
      "1 Instagram Reel (min 30s)",
      "Tag @superiorityburger",
      "Must include the Classic Burger",
    ],
    category: "Food",
  },
  "camp-003": {
    id: "camp-003",
    title: "LA Botanica Aesthetic Shoot",
    business_name: "Flamingo Estate",
    payout: 75,
    deadline: "2026-05-05",
    tier_required: "operator",
    description:
      "Capture the Flamingo Estate aesthetic at our NYC pop-up. Moody, editorial, nature-forward content.",
    requirements: [
      "2 feed posts + 3 stories",
      "Aesthetic must match brand guidelines (provided)",
      "Submit content for approval 48h before posting",
    ],
    category: "Lifestyle",
  },
  "camp-004": {
    id: "camp-004",
    title: "Brow Transformation Story",
    business_name: "Brow Theory",
    payout: 50,
    deadline: "2026-04-28",
    tier_required: "explorer",
    description:
      "Document your brow transformation at Brow Theory. Before/after content preferred.",
    requirements: [
      "Before & after Instagram stories",
      "1 feed post or Reel",
      "Tag @browtheorynyc",
    ],
    category: "Beauty",
  },
  "camp-005": {
    id: "camp-005",
    title: "Glossier NYC Store Experience",
    business_name: "Glossier",
    payout: 120,
    deadline: "2026-05-10",
    tier_required: "proven",
    description: "Create editorial beauty content at the Glossier flagship.",
    requirements: [
      "3+ feed posts",
      "Dedicated YouTube or TikTok video (min 3 min)",
      "Engagement rate > 3%",
    ],
    category: "Beauty",
  },
  "camp-006": {
    id: "camp-006",
    title: "Le Bec-Fin Pop-Up Review",
    business_name: "Le Bec Fin",
    payout: 20,
    deadline: "2026-04-22",
    tier_required: "seed",
    description:
      "Try the NYC pop-up of the legendary Philadelphia institution. Share an honest review.",
    requirements: ["1 Instagram story or post", "Tag location"],
    category: "Food",
  },
  "camp-007": {
    id: "camp-007",
    title: "KITH x Creator Collab Series",
    business_name: "KITH",
    payout: 199,
    deadline: "2026-05-15",
    tier_required: "proven",
    description:
      "Exclusive creator collab at KITH SoHo. Style editorial campaign for Spring 2026 collection.",
    requirements: [
      "5+ high-quality feed posts",
      "2 Reels",
      "10k+ Instagram followers required",
    ],
    category: "Retail",
  },
  "camp-008": {
    id: "camp-008",
    title: "Matcha Morning Ritual",
    business_name: "Cha Cha Matcha",
    payout: 25,
    deadline: "2026-04-29",
    tier_required: "seed",
    description: "Share your morning matcha ritual at Cha Cha Matcha.",
    requirements: ["2 Instagram stories", "Tag @chachamatcha"],
    category: "Coffee",
  },
};

/* ── Helpers ─────────────────────────────────────────────── */

function formatDeadlineCountdown(deadline?: string | null): {
  display: string;
  urgent: boolean;
} {
  if (!deadline) return { display: "No deadline", urgent: false };
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return { display: "Expired", urgent: true };
  const totalHours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const urgent = days < 3;
  if (days === 0) return { display: `${hours}h`, urgent: true };
  return { display: `${days}d ${hours}h`, urgent };
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getMilestoneFromSubmissions(subs: MockSubmission[]): number {
  // 0=Scan,1=Verify,2=Content,3=Paid
  if (subs.some((s) => s.status === "approved")) return 3;
  if (subs.some((s) => s.status === "pending_review")) return 2;
  return 1; // accepted = verified
}

function deriveCurrentStatus(subs: MockSubmission[]): SubmissionStatus {
  if (subs.length === 0) return "draft";
  const latest = subs.sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  )[0];
  return latest.status;
}

function getOgPreview(url: string): { title: string; domain: string } | null {
  if (!url || !url.startsWith("http")) return null;
  try {
    const parsed = new URL(url);
    const domain = parsed.hostname.replace("www.", "");
    const path = parsed.pathname.split("/").filter(Boolean).join(" / ");
    return { title: path || domain, domain };
  } catch {
    return null;
  }
}

/* ── Main component ──────────────────────────────────────── */

export default function PostWorkspaceClient() {
  const { id } = useParams<{ id: string }>();

  // Campaign data
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  // Submissions
  const [submissions, setSubmissions] = useState<MockSubmission[]>([]);

  // Form state
  const [contentType, setContentType] = useState<ContentType>("post");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [attachments, setAttachments] = useState<LocalAttachment[]>([]);
  const [caption, setCaption] = useState("");
  const [publicUrl, setPublicUrl] = useState("");
  const [compliance, setCompliance] =
    useState<ComplianceItem[]>(DEFAULT_COMPLIANCE);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  // Drag state
  const [isDragOver, setIsDragOver] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<SubmissionStatus>("draft");

  // Toast
  const [toast, setToast] = useState<{
    msg: string;
    variant: "approved" | "error";
  } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // LocalStorage key
  const checklistKey = `pw-checklist-${id}`;

  /* ── Load campaign & submissions ─────────────────────── */

  useEffect(() => {
    const c = DEMO_CAMPAIGNS[id] ?? null;
    setCampaign(c);

    const subs = MOCK_SUBMISSIONS.filter((s) => s.campaignId === id);
    setSubmissions(subs);
    setCurrentStatus(deriveCurrentStatus(subs));

    // Restore checklist from localStorage
    try {
      const saved = localStorage.getItem(checklistKey);
      if (saved) {
        const parsed: Record<string, boolean> = JSON.parse(saved);
        setCompliance((prev) =>
          prev.map((item) => ({
            ...item,
            checked: parsed[item.id] ?? item.checked,
          })),
        );
      }
    } catch {
      // ignore parse errors
    }
  }, [id, checklistKey]);

  /* ── Persist checklist ───────────────────────────────── */

  useEffect(() => {
    const map: Record<string, boolean> = {};
    compliance.forEach((item) => {
      map[item.id] = item.checked;
    });
    try {
      localStorage.setItem(checklistKey, JSON.stringify(map));
    } catch {
      // ignore quota errors
    }
  }, [compliance, checklistKey]);

  /* ── Helpers ─────────────────────────────────────────── */

  function showToast(msg: string, variant: "approved" | "error") {
    setToast({ msg, variant });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }

  function toggleCompliance(itemId: string) {
    setCompliance((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item,
      ),
    );
  }

  function handleCopyTag(tag: string) {
    navigator.clipboard.writeText(tag).catch(() => {});
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 1500);
  }

  /* ── File upload ─────────────────────────────────────── */

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const arr = Array.from(files).slice(0, 10 - attachments.length);
      arr.forEach((file) => {
        const isVideo = file.type.startsWith("video/");
        const url = URL.createObjectURL(file);
        const att: LocalAttachment = {
          id: `local-${Date.now()}-${Math.random()}`,
          url,
          type: isVideo ? "video" : "image",
          filename: file.name,
          thumbnailUrl: isVideo ? undefined : url,
        };
        setAttachments((prev) => [...prev, att]);
      });
    },
    [attachments.length],
  );

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) processFiles(e.target.files);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  }

  function removeAttachment(attId: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== attId));
  }

  /* ── Submit ──────────────────────────────────────────── */

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);

    try {
      // Optimistic update
      setCurrentStatus("pending_review");

      const newSub = await creatorMock.submitContent(id, {
        contentType,
        platform,
        attachments: attachments.map((a) => ({
          id: a.id,
          url: a.url,
          type: a.type,
          filename: a.filename,
          thumbnailUrl: a.thumbnailUrl,
        })),
        caption,
        publicUrl,
      });

      setSubmissions((prev) => [newSub, ...prev]);

      showToast("Submitted for review", "approved");

      // TODO: poll or subscribe via Supabase Realtime
      // Mock: 2s later simulate approval
      setTimeout(() => {
        setCurrentStatus("approved");
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === newSub.id
              ? {
                  ...s,
                  status: "approved",
                  reviewedAt: new Date().toISOString(),
                }
              : s,
          ),
        );
        const earned = campaign?.payout ?? 0;
        showToast(
          `Approved ${earned > 0 ? `— $${earned} earned` : ""}`,
          "approved",
        );
      }, 2000);
    } catch {
      setCurrentStatus("draft");
      showToast("Submit failed. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Derived ─────────────────────────────────────────── */

  const countdown = formatDeadlineCountdown(campaign?.deadline);
  const milestoneIdx = getMilestoneFromSubmissions(submissions);
  const ogPreview = getOgPreview(publicUrl);
  const captionLimit = 2200;
  const captionNearLimit = caption.length > captionLimit * 0.85;

  // Build hashtags from campaign requirements
  const campaignHashtags = [...DEFAULT_HASHTAGS];
  if (campaign?.business_name) {
    const handle = `@${campaign.business_name.toLowerCase().replace(/\s+/g, "")}`;
    if (!DEFAULT_MENTIONS.includes(handle)) DEFAULT_MENTIONS.push(handle);
  }

  const allMentions = DEFAULT_MENTIONS;

  const rejectedSub = submissions.find((s) => s.status === "rejected");

  if (!campaign) {
    return <div className="pw-loading">Loading workspace...</div>;
  }

  /* ── Render ──────────────────────────────────────────── */

  return (
    <div className="pw">
      {/* ── Top nav ─────────────────────────────────────── */}
      <nav className="pw-topbar">
        <Link href={`/creator/campaigns/${id}`} className="pw-back">
          &larr; Campaign
        </Link>
        <div className="pw-topbar-sep" />
        <span className="pw-topbar-title">{campaign.title}</span>
      </nav>

      {/* ── Editorial hero ──────────────────────────────── */}
      <section className="pw-hero">
        <div className="pw-hero-inner">
          {/* Left: campaign identity */}
          <div className="pw-hero-left">
            <p className="pw-hero-merchant">{campaign.business_name}</p>
            <h1 className="pw-hero-title">{campaign.title}</h1>
            <div className="pw-hero-badges">
              <TierBadge
                tier={campaign.tier_required}
                size="sm"
                variant="outlined"
              />
              {campaign.category && (
                <span
                  style={{
                    padding: "4px 10px",
                    border: "1px solid rgba(102,155,188,0.35)",
                    color: "#669bbc",
                    fontFamily: 'var(--font-body,"CS Genio Mono",monospace)',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {campaign.category}
                </span>
              )}
              {campaign.payout > 0 && (
                <span
                  style={{
                    padding: "4px 10px",
                    border: "1px solid rgba(193,18,31,0.35)",
                    color: "#f5f2ec",
                    background: "rgba(193,18,31,0.18)",
                    fontFamily: 'var(--font-body,"CS Genio Mono",monospace)',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  ${campaign.payout}
                </span>
              )}
            </div>
          </div>

          {/* Right: milestone mini widget */}
          <div className="pw-milestone-widget">
            <p className="pw-milestone-label">Progress</p>
            <div className="pw-milestone-steps">
              {MILESTONE_STEPS.map((step, i) => {
                const done = i < milestoneIdx;
                const active = i === milestoneIdx;
                return (
                  <div
                    key={step.key}
                    className={[
                      "pw-milestone-step",
                      done ? "pw-milestone-step--done" : "",
                      active ? "pw-milestone-step--active" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <div
                      className={[
                        "pw-milestone-dot",
                        done ? "pw-milestone-dot--done" : "",
                        active ? "pw-milestone-dot--active" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {done && (
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path
                            d="M1 3l2 2 4-4"
                            stroke="#fff"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="pw-milestone-step-label">
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Deadline countdown ──────────────────────────── */}
      <div className="pw-deadline-bar">
        <div className="pw-deadline-inner">
          <span className="pw-deadline-eyebrow">Deadline in</span>
          <span
            className={`pw-deadline-value${countdown.urgent ? " pw-deadline-value--urgent" : ""}`}
          >
            {countdown.display}
          </span>
          {campaign.deadline && (
            <span className="pw-deadline-sub">
              Due{" "}
              {new Date(campaign.deadline).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </div>

      {/* ── Three-column workspace ──────────────────────── */}
      <div className="pw-workspace">
        {/* ── LEFT: Deliverable checklist ─────────────── */}
        <aside className="pw-checklist">
          {/* Content type */}
          <div className="pw-checklist-section">
            <p className="pw-checklist-header">Content Type</p>
            <div className="pw-type-grid">
              {CONTENT_TYPES.map((t) => (
                <button
                  key={t.key}
                  className={`pw-type-chip${contentType === t.key ? " pw-type-chip--active" : ""}`}
                  onClick={() => setContentType(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div className="pw-checklist-section">
            <p className="pw-checklist-header">Platform</p>
            <div className="pw-type-grid">
              {PLATFORMS.map((p) => (
                <button
                  key={p.key}
                  className={`pw-type-chip${platform === p.key ? " pw-type-chip--active" : ""}`}
                  onClick={() => setPlatform(p.key)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Required hashtags */}
          <div className="pw-checklist-section">
            <p className="pw-checklist-header">Required Hashtags</p>
            <div className="pw-tag-list">
              {campaignHashtags.map((tag) => (
                <div key={tag} className="pw-tag-row">
                  <span className="pw-tag-text">{tag}</span>
                  <button
                    className={`pw-tag-copy${copiedTag === tag ? " pw-tag-copy--copied" : ""}`}
                    onClick={() => handleCopyTag(tag)}
                  >
                    {copiedTag === tag ? "Copied" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Required @mentions */}
          <div className="pw-checklist-section">
            <p className="pw-checklist-header">Required Mentions</p>
            <div className="pw-tag-list">
              {allMentions.map((m) => (
                <div key={m} className="pw-tag-row">
                  <span className="pw-tag-text">{m}</span>
                  <button
                    className={`pw-tag-copy${copiedTag === m ? " pw-tag-copy--copied" : ""}`}
                    onClick={() => handleCopyTag(m)}
                  >
                    {copiedTag === m ? "Copied" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance checklist */}
          <div className="pw-checklist-section">
            <p className="pw-checklist-header">Compliance</p>
            <div className="pw-compliance-list">
              {compliance.map((item) => (
                <div
                  key={item.id}
                  className="pw-compliance-item"
                  onClick={() => toggleCompliance(item.id)}
                >
                  <div
                    className={`pw-compliance-checkbox${item.checked ? " pw-compliance-checkbox--checked" : ""}`}
                  />
                  <span
                    className={`pw-compliance-text${item.checked ? " pw-compliance-text--checked" : ""}`}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── CENTER: Upload & caption ─────────────────── */}
        <main className="pw-upload-col">
          {/* Attachments preview */}
          {attachments.length > 0 && (
            <div className="pw-preview-grid">
              {attachments.map((att) => (
                <div key={att.id} className="pw-preview-card">
                  {att.type === "image" ? (
                    <img
                      src={att.thumbnailUrl ?? att.url}
                      alt={att.filename}
                      className="pw-preview-img"
                    />
                  ) : (
                    <div
                      className="pw-preview-img"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0,48,73,0.08)",
                        color: "rgba(0,48,73,0.4)",
                        fontFamily:
                          'var(--font-body,"CS Genio Mono",monospace)',
                        fontSize: 11,
                      }}
                    >
                      Video
                    </div>
                  )}
                  <button
                    className="pw-preview-remove"
                    onClick={() => removeAttachment(att.id)}
                    aria-label="Remove"
                  >
                    &times;
                  </button>
                  <span className="pw-preview-type-tag">{att.type}</span>
                </div>
              ))}
            </div>
          )}

          {/* Drop zone */}
          <div
            className={`pw-dropzone${isDragOver ? " pw-dropzone--over" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
          >
            <div className="pw-dropzone-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 3v10M6 7l4-4 4 4M3 15h14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="pw-dropzone-title">
              {attachments.length > 0
                ? "Add more files"
                : "Drop files here or click to upload"}
            </span>
            <span className="pw-dropzone-sub">
              Images and videos supported — up to 10 files
            </span>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              className="pw-dropzone-input"
              onChange={handleFileInput}
              aria-label="Upload media files"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="pw-field-label" htmlFor="pw-caption">
              Caption
            </label>
            <div className="pw-caption-wrap">
              <textarea
                id="pw-caption"
                className="pw-caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your post caption here. Include required hashtags and mentions."
                maxLength={captionLimit}
              />
              <span
                className={`pw-char-count${captionNearLimit ? " pw-char-count--warn" : ""}`}
              >
                {caption.length} / {captionLimit}
              </span>
            </div>
          </div>

          {/* Published URL */}
          <div>
            <label className="pw-field-label" htmlFor="pw-url">
              Published Link
            </label>
            <div className="pw-url-wrap">
              <span className="pw-url-prefix">URL</span>
              <input
                id="pw-url"
                type="url"
                className="pw-url-input"
                value={publicUrl}
                onChange={(e) => setPublicUrl(e.target.value)}
                placeholder="https://www.instagram.com/p/..."
              />
            </div>
            {ogPreview && (
              <div className="pw-og-preview">
                <div className="pw-og-thumb" aria-hidden="true" />
                <div className="pw-og-info">
                  <span className="pw-og-title">{ogPreview.title}</span>
                  <span className="pw-og-domain">{ogPreview.domain}</span>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ── RIGHT: Status panel ──────────────────────── */}
        <aside className="pw-status-col">
          {/* Current status */}
          <div className="pw-status-section">
            <p className="pw-checklist-header">Status</p>
            <span
              className={`pw-status-badge pw-status-badge--${currentStatus}`}
            >
              <span
                className={`pw-status-dot pw-status-dot--${currentStatus}`}
              />
              {STATUS_LABELS[currentStatus]}
            </span>
            <p className="pw-review-eta">Usually reviewed within 24h</p>
          </div>

          {/* Rejected banner */}
          {currentStatus === "rejected" && rejectedSub?.reviewerNotes && (
            <div className="pw-status-section">
              <div className="pw-rejected-banner">
                <span className="pw-rejected-label">Reviewer Notes</span>
                <p className="pw-rejected-note">{rejectedSub.reviewerNotes}</p>
                <button
                  className="pw-resubmit-btn"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  Resubmit
                </button>
              </div>
            </div>
          )}

          {/* Merchant brief */}
          <div className="pw-status-section">
            <p className="pw-brief-title">Merchant Brief</p>
            <p className="pw-brief-text">
              {campaign.description.length > 180
                ? campaign.description.slice(0, 180) + "..."
                : campaign.description}
            </p>
            {campaign.requirements.length > 0 && (
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {campaign.requirements.map((req, i) => (
                  <div
                    key={i}
                    style={{
                      fontFamily: 'var(--font-body,"CS Genio Mono",monospace)',
                      fontSize: 11,
                      color: "rgba(0,48,73,0.55)",
                      paddingLeft: 10,
                      borderLeft: "2px solid rgba(0,48,73,0.12)",
                      lineHeight: 1.5,
                    }}
                  >
                    {req}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submission history */}
          <div className="pw-status-section">
            <p className="pw-brief-title">Submission History</p>
            {submissions.length === 0 ? (
              <p className="pw-empty-timeline">No submissions yet</p>
            ) : (
              <div className="pw-timeline">
                {submissions
                  .sort(
                    (a, b) =>
                      new Date(b.submittedAt).getTime() -
                      new Date(a.submittedAt).getTime(),
                  )
                  .map((sub) => (
                    <div key={sub.id} className="pw-timeline-item">
                      <div
                        className={`pw-timeline-dot pw-timeline-dot--${sub.status}`}
                      />
                      <div className="pw-timeline-body">
                        <div className="pw-timeline-meta">
                          <span>{formatTimestamp(sub.submittedAt)}</span>
                          <span>&middot;</span>
                          <span>{sub.contentType}</span>
                          <span>&middot;</span>
                          <span>{sub.platform}</span>
                        </div>
                        <span className="pw-timeline-status">
                          {STATUS_LABELS[sub.status]}
                          {sub.reviewedAt && (
                            <span
                              style={{
                                fontWeight: 400,
                                color: "rgba(0,48,73,0.4)",
                                marginLeft: 6,
                                fontSize: 10,
                              }}
                            >
                              reviewed {formatTimestamp(sub.reviewedAt)}
                            </span>
                          )}
                        </span>
                        {sub.reviewerNotes && (
                          <p className="pw-timeline-note">
                            {sub.reviewerNotes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ── Sticky submit bar ────────────────────────────── */}
      <div className="pw-submit-bar">
        <span className="pw-submit-hint">
          {attachments.length} file{attachments.length !== 1 ? "s" : ""}{" "}
          attached
          {caption.length > 0 ? ` · ${caption.length} chars` : ""}
        </span>
        <button
          className={`pw-submit-btn${submitting ? " pw-submit-btn--loading" : ""}`}
          onClick={handleSubmit}
          disabled={submitting || currentStatus === "pending_review"}
        >
          {submitting
            ? "Submitting..."
            : currentStatus === "pending_review"
              ? "Under Review"
              : currentStatus === "rejected"
                ? "Resubmit for Review"
                : "Submit for Review"}
        </button>
      </div>

      {/* ── Toast ────────────────────────────────────────── */}
      {toast && (
        <div className={`pw-toast pw-toast--${toast.variant}`}>
          <span className="pw-toast-icon">
            {toast.variant === "approved" ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="7" fill="#2d7a2d" />
                <path
                  d="M4 7l2 2 4-4"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="7" fill="#c1121f" />
                <path
                  d="M5 5l4 4M9 5l-4 4"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
