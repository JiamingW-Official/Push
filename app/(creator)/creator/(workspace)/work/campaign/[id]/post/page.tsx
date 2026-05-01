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
  logoColor: "#3a3835",
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
    <div className="post-thumb-item">
      {/* Thumbnail preview area */}
      <div className="post-thumb-preview">
        {file.preview ? (
          file.isVideo ? (
            <span className="post-thumb-icon" aria-label="Video file">
              ▶
            </span>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={file.preview}
              alt={file.name}
              className="post-thumb-preview-img"
            />
          )
        ) : (
          <span className="post-thumb-icon" aria-label="File preview">
            {file.isVideo ? "▶" : "◼"}
          </span>
        )}
      </div>

      {/* File info */}
      <div className="post-thumb-file-info">
        <p className="post-thumb-file-name">{file.name}</p>
        <p className="post-thumb-file-size">{formatFileSize(file.size)}</p>
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        aria-label={`Remove ${file.name}`}
        title="Remove file"
        className="post-thumb-remove-btn"
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
    <div className="post-page-root">
      {/* ── Breadcrumb nav ───────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="post-breadcrumb-nav">
        <Link href="/creator/work/today" className="post-breadcrumb-link">
          WORK
        </Link>
        <span className="post-breadcrumb-sep">/</span>
        <Link href="/creator/work/pipeline" className="post-breadcrumb-link">
          Pipeline
        </Link>
        <span className="post-breadcrumb-sep">/</span>
        <Link
          href={`/creator/work/campaign/${campaignId}`}
          className="post-breadcrumb-link"
        >
          {campaign.campaignTitle}
        </Link>
        <span className="post-breadcrumb-sep">/</span>
        <span aria-current="page" className="post-breadcrumb-current">
          POST CONTENT
        </span>
      </nav>

      {/* ── Page header ──────────────────────────────────────── */}
      <header className="post-page-header">
        {/* Left: title */}
        <div className="post-page-header-left">
          <p className="eyebrow post-page-eyebrow">CONTENT SUBMISSION</p>
          <h1 className="post-page-h1">POST CONTENT</h1>
          <p className="post-page-subtitle">{campaign.campaignTitle}</p>
        </div>

        {/* B: Liquid-glass campaign brief tile */}
        <div className="post-brief-tile post-header-card">
          {/* Merchant logo */}
          <div
            className="post-header-logo"
            style={{ background: campaign.logoColor }}
            aria-hidden="true"
          >
            {campaign.logoInitials}
          </div>

          <div>
            <p className="post-header-merchant">{campaign.merchantName}</p>
            <div className="post-header-meta">
              <span
                className="post-header-category"
                style={{ color: campaign.categoryColor }}
              >
                {campaign.category}
              </span>
              <span className="post-header-meta-dot">·</span>
              {/* B: earn estimate — Darky 40px brand-red */}
              <span className="post-brief-earn">{campaign.earnEstimate}</span>
              <span className="post-header-meta-dot">·</span>
              <span className="post-header-deadline">
                Due {campaign.deadline}
              </span>
            </div>
            {/* B: brief text — font-body 16px ink-3 */}
            <p className="post-brief-text">{campaign.brief}</p>
          </div>
        </div>
      </header>

      {/* ── Main form ────────────────────────────────────────── */}
      <main className="post-form-main">
        {/* Two-column form grid */}
        <div className="post-two-col">
          {/* ── Left column: upload ──────────────────────────── */}
          <section aria-label="Upload content">
            {/* Section header */}
            <div className="post-step-header">
              <span className="post-step-num" aria-hidden="true">
                01
              </span>
              <h2 className="post-step-title">UPLOAD CONTENT</h2>
            </div>

            {/* D: Drop zone */}
            <div
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
              className={[
                "post-upload-zone",
                isDragOver ? "dragover" : "",
                uploadedFiles.length > 0 ? "post-upload-zone-has-files" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                style={{ display: "none" }}
                aria-hidden="true"
                tabIndex={-1}
              />

              {uploadedFiles.length === 0 ? (
                <div>
                  {/* D: 40×40 icon tile with surface-3 bg */}
                  <div className="post-upload-icon-tile" aria-hidden="true">
                    ↑
                  </div>
                  {/* D: "Drop your content here" — font-body 16px ink-3 */}
                  <p className="post-upload-headline">
                    Drag &amp; drop or click to upload
                  </p>
                  {/* D: format hint — font-body 12px ink-4 */}
                  <p className="post-upload-formats">
                    MP4 · MOV · JPG · PNG · max 200MB
                  </p>
                </div>
              ) : (
                <div className="post-upload-add-more">
                  <span className="post-upload-add-plus" aria-hidden="true">
                    +
                  </span>
                  <span className="post-upload-add-text">Add more files</span>
                </div>
              )}
            </div>

            {/* Error */}
            {dragError && (
              <p role="alert" className="post-drag-error">
                {dragError}
              </p>
            )}

            {/* Thumbnails */}
            {uploadedFiles.length > 0 && (
              <div
                role="list"
                aria-label="Uploaded files"
                className="post-file-list"
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
          <div className="post-right-col">
            {/* Caption */}
            <section aria-label="Caption">
              <div className="post-step-header">
                <span className="post-step-num" aria-hidden="true">
                  02
                </span>
                <h2 className="post-step-title">CAPTION</h2>
              </div>

              <div className="post-caption-card">
                <textarea
                  placeholder="Write your caption here — keep it authentic, not marketing copy."
                  value={caption}
                  onChange={(e) => {
                    if (e.target.value.length <= CAPTION_MAX)
                      setCaption(e.target.value);
                  }}
                  rows={5}
                  aria-label="Post caption"
                  aria-describedby="caption-count"
                  className="post-caption-textarea"
                />
                <div className="post-caption-footer">
                  <p
                    id="caption-count"
                    aria-live="polite"
                    className={
                      caption.length >= CAPTION_MAX
                        ? "post-caption-count-max"
                        : "post-caption-count-normal"
                    }
                  >
                    {caption.length} / {CAPTION_MAX}
                  </p>
                </div>
              </div>
            </section>

            {/* Hashtags */}
            <section aria-label="Hashtag suggestions">
              <div className="post-step-header">
                <span className="post-step-num" aria-hidden="true">
                  03
                </span>
                <h2 className="post-step-title">SUGGESTED HASHTAGS</h2>
                <span className="post-step-hint">Copy to caption above</span>
              </div>

              <div className="post-hashtag-card">
                <div
                  role="list"
                  aria-label="Hashtag suggestions"
                  className="post-hashtag-chips"
                >
                  {campaign.hashtags.map((tag) => (
                    <button
                      key={tag}
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
                      className="post-hashtag-chip click-shift"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="post-hashtag-note">
                  <span className="post-hashtag-note-icon" aria-hidden="true">
                    ◎
                  </span>
                  <p className="post-hashtag-note-text">
                    Attribution code:{" "}
                    {/* F: Champagne-tinted attribution code pill */}
                    <span className="post-attr-code">
                      {campaign.attributionCode}
                    </span>{" "}
                    — show at register to log your walk-in
                  </p>
                </div>
              </div>
            </section>

            {/* C: Platforms — pill buttons with active state */}
            <section aria-label="Platform selection">
              <div className="post-step-header">
                <span className="post-step-num" aria-hidden="true">
                  04
                </span>
                <h2 className="post-step-title">PLATFORMS</h2>
              </div>

              <div
                role="group"
                aria-label="Select platforms"
                className="post-platform-group"
              >
                {PLATFORMS.map((p) => {
                  const checked = platforms.has(p.id);
                  return (
                    <label
                      key={p.id}
                      className={[
                        "post-platform-label",
                        checked
                          ? "post-platform-label-checked"
                          : "post-platform-label-unchecked",
                      ].join(" ")}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePlatform(p.id)}
                        className="post-platform-checkbox-hidden"
                        aria-checked={checked}
                      />
                      {/* Custom checkbox */}
                      <div
                        className={[
                          "post-custom-checkbox",
                          checked
                            ? "post-custom-checkbox-checked"
                            : "post-custom-checkbox-unchecked",
                        ].join(" ")}
                        aria-hidden="true"
                      >
                        {checked && (
                          <span className="post-custom-checkbox-mark">✓</span>
                        )}
                      </div>
                      <span
                        className={
                          checked
                            ? "post-platform-icon-checked"
                            : "post-platform-icon-unchecked"
                        }
                        aria-hidden="true"
                      >
                        {p.icon}
                      </span>
                      <span
                        className={
                          checked
                            ? "post-platform-name-checked"
                            : "post-platform-name-unchecked"
                        }
                      >
                        {p.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        {/* ── Submit section ────────────────────────────────── */}
        <section aria-label="Submit content" className="post-submit-wrapper">
          {submitState === "verified" ? (
            /* I: Verified / success state */
            <div
              role="status"
              aria-live="polite"
              className="post-success-state"
            >
              <div className="post-success-icon" aria-hidden="true">
                ✓
              </div>
              <div className="post-success-body">
                <p className="post-success-title">
                  Content submitted. Verification pending.
                </p>
                <p className="post-success-desc">
                  ConversionOracle™ is processing your walk-in verification.
                  You&apos;ll be notified within 8 seconds once confirmed.
                </p>
              </div>
              <Link
                href={`/creator/work/campaign/${campaignId}`}
                className="btn-ghost click-shift"
                style={{ flexShrink: 0 }}
              >
                Back to Campaign →
              </Link>
            </div>
          ) : (
            /* G: Submit form CTA */
            <div className="post-cta-row">
              {/* Meta info */}
              <div className="post-cta-meta">
                <p className="post-cta-oracle">
                  <span className="post-cta-oracle-dot" aria-hidden="true" />
                  ConversionOracle™ will verify your walk-in within{" "}
                  <strong className="post-cta-oracle-strong">8 seconds</strong>
                </p>
                <p className="post-cta-earn">
                  Earn{" "}
                  <span className="post-cta-earn-amount">
                    {campaign.earnEstimate}
                  </span>{" "}
                  upon verification
                </p>
              </div>

              {/* G: Submit button — prominent, full width on mobile */}
              <button
                onClick={handleSubmit}
                disabled={submitState !== "idle"}
                aria-label={
                  submitState === "idle"
                    ? "Submit content for verification"
                    : submitState === "uploading"
                      ? "Uploading content, please wait"
                      : "Content submitted, verifying"
                }
                className={
                  submitState === "idle"
                    ? "btn btn-primary post-submit-btn post-submit-btn-idle click-shift"
                    : submitState === "uploading"
                      ? "post-submit-btn post-submit-btn-loading"
                      : "post-submit-btn post-submit-btn-pending"
                }
              >
                {submitState === "idle" && "SUBMIT FOR VERIFICATION →"}
                {submitState === "uploading" && (
                  <span aria-hidden="true">UPLOADING...</span>
                )}
                {submitState === "submitted" && "VERIFYING WALK-IN ◉"}
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
