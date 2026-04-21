"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useCallback } from "react";
import "./post.css";

/* ── Types ─────────────────────────────────────────────────── */

type SubmitState = "idle" | "uploading" | "submitted" | "verified";

type Platform = "instagram" | "tiktok" | "twitter";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  preview: string | null;
  isVideo: boolean;
}

/* ── Mock campaign data ─────────────────────────────────────── */

interface PostCampaign {
  id: string;
  merchantName: string;
  campaignTitle: string;
  earnEstimate: string;
  deadline: string;
  category: string;
  categoryColor: string;
  logoInitials: string;
  logoColor: string;
  hashtags: string[];
  brief: string;
  attributionCode: string;
}

const MOCK_CAMPAIGN: PostCampaign = {
  id: "pc-001",
  merchantName: "Blank Street Coffee",
  campaignTitle: "Morning Coffee Story",
  earnEstimate: "$18",
  deadline: "Apr 20",
  category: "Coffee",
  categoryColor: "#c9a96e",
  logoInitials: "BS",
  logoColor: "#003049",
  hashtags: [
    "#blankstreetcoffee",
    "#morningritual",
    "#williamsburgcoffee",
    "#ad",
    "#sponsored",
  ],
  brief:
    "Create 3 authentic morning-routine Stories featuring your Blank Street order. Focus on the ritual, not the product. Tag @blankstreetcoffee.",
  attributionCode: "BS-4821",
};

/* ── Platform checkboxes config ─────────────────────────────── */

const PLATFORMS: { id: Platform; label: string; icon: string }[] = [
  { id: "instagram", label: "Instagram", icon: "◉" },
  { id: "tiktok", label: "TikTok", icon: "◈" },
  { id: "twitter", label: "Twitter / X", icon: "✕" },
];

/* ── Helpers ────────────────────────────────────────────────── */

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ── Upload Thumbnail ────────────────────────────────────────── */

function UploadThumbnail({
  file,
  onRemove,
}: {
  file: UploadedFile;
  onRemove: () => void;
}) {
  return (
    <div className="post-thumb">
      {file.preview ? (
        file.isVideo ? (
          <div className="post-thumb-video-placeholder" aria-label="Video file">
            <span className="post-thumb-video-icon" aria-hidden="true">
              ▶
            </span>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={file.preview} alt={file.name} className="post-thumb-img" />
        )
      ) : (
        <div className="post-thumb-fallback" aria-label="File preview">
          <span aria-hidden="true">{file.isVideo ? "▶" : "◼"}</span>
        </div>
      )}
      <div className="post-thumb-info">
        <p className="post-thumb-name">{file.name}</p>
        <p className="post-thumb-size">{formatFileSize(file.size)}</p>
      </div>
      <button
        className="post-thumb-remove"
        onClick={onRemove}
        aria-label={`Remove ${file.name}`}
        title="Remove file"
      >
        ✕
      </button>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────── */

export default function PostWorkspacePage() {
  const params = useParams();
  const campaignId = params?.id as string;

  // Use mock campaign (demo mode — hardcoded regardless of ID)
  const campaign = MOCK_CAMPAIGN;

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [caption, setCaption] = useState("");
  const [platforms, setPlatforms] = useState<Set<Platform>>(
    new Set(["instagram"]),
  );
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [dragError, setDragError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
  const CAPTION_MAX = 280;

  /* ── File handling ─────────────────────────────────────────── */

  function processFile(rawFile: File): void {
    setDragError(null);

    if (rawFile.size > MAX_FILE_SIZE) {
      setDragError(`${rawFile.name} exceeds 50 MB limit.`);
      return;
    }

    const isVideo = rawFile.type.startsWith("video/");
    const isImage = rawFile.type.startsWith("image/");

    if (!isVideo && !isImage) {
      setDragError(`${rawFile.name} is not a supported format.`);
      return;
    }

    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedFiles((prev) => [
          ...prev,
          {
            name: rawFile.name,
            size: rawFile.size,
            type: rawFile.type,
            preview: e.target?.result as string,
            isVideo: false,
          },
        ]);
      };
      reader.readAsDataURL(rawFile);
    } else {
      setUploadedFiles((prev) => [
        ...prev,
        {
          name: rawFile.name,
          size: rawFile.size,
          type: rawFile.type,
          preview: null,
          isVideo: true,
        },
      ]);
    }
  }

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(processFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function removeFile(index: number): void {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  /* ── Drag events ───────────────────────────────────────────── */

  function handleDragOver(e: React.DragEvent): void {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent): void {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent): void {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  /* ── Platform toggle ───────────────────────────────────────── */

  function togglePlatform(p: Platform): void {
    setPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(p)) {
        next.delete(p);
      } else {
        next.add(p);
      }
      return next;
    });
  }

  /* ── Submit handler (mock) ─────────────────────────────────── */

  function handleSubmit(): void {
    if (submitState !== "idle") return;
    if (uploadedFiles.length === 0) {
      setDragError("Please upload at least one piece of content.");
      return;
    }
    if (platforms.size === 0) {
      setDragError("Please select at least one platform.");
      return;
    }

    setDragError(null);
    setSubmitState("uploading");

    // Mock upload delay
    setTimeout(() => {
      setSubmitState("submitted");
      // Mock verification delay
      setTimeout(() => {
        setSubmitState("verified");
      }, 2200);
    }, 1800);
  }

  /* ── Render ─────────────────────────────────────────────────── */

  return (
    <div className="post-page">
      {/* ── Breadcrumb nav ───────────────────────────────────── */}
      <nav className="post-nav" aria-label="Breadcrumb">
        <Link href="/creator/work/today" className="post-nav-crumb">
          WORK
        </Link>
        <span className="post-nav-sep" aria-hidden="true">
          /
        </span>
        <Link href="/creator/work/pipeline" className="post-nav-crumb">
          Pipeline
        </Link>
        <span className="post-nav-sep" aria-hidden="true">
          /
        </span>
        <Link
          href={`/creator/work/campaign/${campaignId}`}
          className="post-nav-crumb"
        >
          {campaign.campaignTitle}
        </Link>
        <span className="post-nav-sep" aria-hidden="true">
          /
        </span>
        <span className="post-nav-current" aria-current="page">
          POST CONTENT
        </span>
      </nav>

      {/* ── Page header ──────────────────────────────────────── */}
      <header className="post-header">
        <div className="post-header-left">
          <p className="post-eyebrow">CONTENT SUBMISSION</p>
          <h1 className="post-headline">POST CONTENT</h1>
          <p className="post-subline">{campaign.campaignTitle}</p>
        </div>

        <div className="post-campaign-summary">
          {/* Merchant logo */}
          <div
            className="post-summary-logo"
            style={{ background: campaign.logoColor }}
            aria-hidden="true"
          >
            {campaign.logoInitials}
          </div>

          <div className="post-summary-info">
            <p className="post-summary-merchant">{campaign.merchantName}</p>
            <div className="post-summary-meta">
              <span
                className="post-summary-category"
                style={{ color: campaign.categoryColor }}
              >
                {campaign.category}
              </span>
              <span className="post-summary-sep" aria-hidden="true">
                ·
              </span>
              <span className="post-summary-earn">{campaign.earnEstimate}</span>
              <span className="post-summary-sep" aria-hidden="true">
                ·
              </span>
              <span className="post-summary-deadline">
                Due {campaign.deadline}
              </span>
            </div>
            <p className="post-summary-brief">{campaign.brief}</p>
          </div>
        </div>
      </header>

      {/* ── Main form ────────────────────────────────────────── */}
      <main className="post-main">
        <div className="post-form-grid">
          {/* ── Left column: upload ──────────────────────────── */}
          <section
            className="post-section post-section-upload"
            aria-label="Upload content"
          >
            <div className="post-section-header">
              <span className="post-section-num" aria-hidden="true">
                01
              </span>
              <h2 className="post-section-title">UPLOAD CONTENT</h2>
            </div>

            {/* Drop zone */}
            <div
              className={[
                "post-dropzone",
                isDragOver ? "post-dropzone-over" : "",
                uploadedFiles.length > 0 ? "post-dropzone-has-files" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload content — click or drag and drop files here"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="post-file-input"
                aria-hidden="true"
                tabIndex={-1}
              />

              {uploadedFiles.length === 0 ? (
                <div className="post-dropzone-empty">
                  <div className="post-dropzone-icon" aria-hidden="true">
                    ↑
                  </div>
                  <p className="post-dropzone-headline">
                    Drag & drop or click to upload
                  </p>
                  <p className="post-dropzone-formats">
                    JPG · PNG · MP4 · MOV · max 50 MB per file
                  </p>
                </div>
              ) : (
                <div className="post-dropzone-add-more">
                  <span className="post-dropzone-add-icon" aria-hidden="true">
                    +
                  </span>
                  <span>Add more files</span>
                </div>
              )}
            </div>

            {/* Error */}
            {dragError && (
              <p className="post-error" role="alert">
                {dragError}
              </p>
            )}

            {/* Thumbnails */}
            {uploadedFiles.length > 0 && (
              <div
                className="post-thumbs"
                role="list"
                aria-label="Uploaded files"
              >
                {uploadedFiles.map((file, i) => (
                  <div key={`${file.name}-${i}`} role="listitem">
                    <UploadThumbnail
                      file={file}
                      onRemove={() => removeFile(i)}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Right column: form ───────────────────────────── */}
          <div className="post-form-right">
            {/* Caption */}
            <section className="post-section" aria-label="Caption">
              <div className="post-section-header">
                <span className="post-section-num" aria-hidden="true">
                  02
                </span>
                <h2 className="post-section-title">CAPTION</h2>
              </div>

              <div className="post-caption-wrap">
                <textarea
                  className="post-caption-input"
                  placeholder="Write your caption here — keep it authentic, not marketing copy."
                  value={caption}
                  onChange={(e) => {
                    if (e.target.value.length <= CAPTION_MAX)
                      setCaption(e.target.value);
                  }}
                  rows={5}
                  aria-label="Post caption"
                  aria-describedby="caption-count"
                />
                <p
                  className={[
                    "post-caption-count",
                    caption.length >= CAPTION_MAX
                      ? "post-caption-count-limit"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  id="caption-count"
                  aria-live="polite"
                >
                  {caption.length} / {CAPTION_MAX}
                </p>
              </div>
            </section>

            {/* Hashtags */}
            <section className="post-section" aria-label="Hashtag suggestions">
              <div className="post-section-header">
                <span className="post-section-num" aria-hidden="true">
                  03
                </span>
                <h2 className="post-section-title">SUGGESTED HASHTAGS</h2>
                <span className="post-section-hint">Copy to caption above</span>
              </div>

              <div
                className="post-hashtags"
                role="list"
                aria-label="Hashtag suggestions"
              >
                {campaign.hashtags.map((tag) => (
                  <button
                    key={tag}
                    className="post-hashtag-chip"
                    role="listitem"
                    onClick={() => {
                      if (!caption.includes(tag)) {
                        const spacer =
                          caption.length > 0 && !caption.endsWith(" ")
                            ? " "
                            : "";
                        const next = caption + spacer + tag;
                        if (next.length <= CAPTION_MAX) setCaption(next);
                      }
                    }}
                    aria-label={`Add ${tag} to caption`}
                    title={`Click to add ${tag} to caption`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <p className="post-attribution-note">
                <span className="post-attribution-icon" aria-hidden="true">
                  ◎
                </span>
                Attribution code:{" "}
                <strong className="post-attribution-code">
                  {campaign.attributionCode}
                </strong>{" "}
                — show at register to log your walk-in
              </p>
            </section>

            {/* Platforms */}
            <section className="post-section" aria-label="Platform selection">
              <div className="post-section-header">
                <span className="post-section-num" aria-hidden="true">
                  04
                </span>
                <h2 className="post-section-title">PLATFORMS</h2>
              </div>

              <div
                className="post-platforms"
                role="group"
                aria-label="Select platforms"
              >
                {PLATFORMS.map((p) => {
                  const checked = platforms.has(p.id);
                  return (
                    <label
                      key={p.id}
                      className={[
                        "post-platform-item",
                        checked ? "post-platform-checked" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePlatform(p.id)}
                        className="post-platform-checkbox"
                        aria-checked={checked}
                      />
                      <span className="post-platform-icon" aria-hidden="true">
                        {p.icon}
                      </span>
                      <span className="post-platform-label">{p.label}</span>
                      {checked && (
                        <span
                          className="post-platform-check"
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        {/* ── Submit section ────────────────────────────────── */}
        <section className="post-submit-section" aria-label="Submit content">
          <div className="post-submit-inner">
            {submitState === "verified" ? (
              /* Verified state */
              <div className="post-verified" role="status" aria-live="polite">
                <div className="post-verified-check" aria-hidden="true">
                  ✓
                </div>
                <div className="post-verified-text">
                  <p className="post-verified-headline">
                    Content submitted. Verification pending.
                  </p>
                  <p className="post-verified-sub">
                    ConversionOracle™ is processing your walk-in verification.
                    You&apos;ll be notified within 8 seconds once confirmed.
                  </p>
                </div>
                <Link
                  href={`/creator/work/campaign/${campaignId}`}
                  className="post-verified-back"
                >
                  Back to Campaign →
                </Link>
              </div>
            ) : (
              /* Submit form CTA */
              <>
                <div className="post-submit-meta">
                  <p className="post-submit-oracle">
                    <span className="post-oracle-dot" aria-hidden="true" />
                    ConversionOracle™ will verify your walk-in within{" "}
                    <strong>8 seconds</strong>
                  </p>
                  <p className="post-submit-earn">
                    Earn{" "}
                    <span className="post-submit-earn-amount">
                      {campaign.earnEstimate}
                    </span>{" "}
                    upon verification
                  </p>
                </div>

                <button
                  className={[
                    "post-submit-btn",
                    submitState === "uploading" ? "post-submit-loading" : "",
                    submitState === "submitted" ? "post-submit-pending" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={handleSubmit}
                  disabled={submitState !== "idle"}
                  aria-label={
                    submitState === "idle"
                      ? "Submit content for verification"
                      : submitState === "uploading"
                        ? "Uploading content, please wait"
                        : "Content submitted, verifying"
                  }
                >
                  {submitState === "idle" && "SUBMIT FOR VERIFICATION →"}
                  {submitState === "uploading" && (
                    <span className="post-submit-dots" aria-hidden="true">
                      UPLOADING
                      <span className="post-dot-1">.</span>
                      <span className="post-dot-2">.</span>
                      <span className="post-dot-3">.</span>
                    </span>
                  )}
                  {submitState === "submitted" && "VERIFYING WALK-IN ◉"}
                </button>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
