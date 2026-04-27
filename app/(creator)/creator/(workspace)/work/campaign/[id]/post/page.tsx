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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        background: "var(--surface-2)",
        border: "1px solid var(--hairline)",
        borderRadius: 10,
        position: "relative",
      }}
    >
      {/* Thumbnail preview area */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 8,
          overflow: "hidden",
          flexShrink: 0,
          background: "var(--surface-3, #ece9e0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {file.preview ? (
          file.isVideo ? (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 22,
                color: "var(--ink-4)",
              }}
              aria-label="Video file"
            >
              ▶
            </span>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={file.preview}
              alt={file.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )
        ) : (
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 20,
              color: "var(--ink-4)",
            }}
            aria-label="File preview"
          >
            {file.isVideo ? "▶" : "◼"}
          </span>
        )}
      </div>

      {/* File info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--ink)",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {file.name}
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--ink-4)",
            margin: "2px 0 0",
          }}
        >
          {formatFileSize(file.size)}
        </p>
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        aria-label={`Remove ${file.name}`}
        title="Remove file"
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          border: "1px solid var(--hairline)",
          background: "var(--surface)",
          color: "var(--ink-4)",
          fontFamily: "var(--font-body)",
          fontSize: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
          transition: "background 0.15s, color 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "var(--brand-red)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--snow)";
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "var(--brand-red)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "var(--surface)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--ink-4)";
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "var(--hairline)";
        }}
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

  /* ── Shared card style ─────────────────────────────────────── */

  const cardStyle: React.CSSProperties = {
    background: "var(--surface-2)",
    border: "1px solid var(--hairline)",
    borderRadius: 10,
    padding: "20px 24px",
  };

  /* ── Render ─────────────────────────────────────────────────── */

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* ── Breadcrumb nav ───────────────────────────────────── */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "16px 32px",
          borderBottom: "1px solid var(--hairline)",
          background: "var(--snow)",
        }}
      >
        <Link
          href="/creator/work/today"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--ink-4)",
            textDecoration: "none",
          }}
        >
          WORK
        </Link>
        <span style={{ color: "var(--hairline)", fontSize: 12 }}>/</span>
        <Link
          href="/creator/work/pipeline"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--ink-4)",
            textDecoration: "none",
          }}
        >
          Pipeline
        </Link>
        <span style={{ color: "var(--hairline)", fontSize: 12 }}>/</span>
        <Link
          href={`/creator/work/campaign/${campaignId}`}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--ink-4)",
            textDecoration: "none",
          }}
        >
          {campaign.campaignTitle}
        </Link>
        <span style={{ color: "var(--hairline)", fontSize: 12 }}>/</span>
        <span
          aria-current="page"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--ink)",
          }}
        >
          POST CONTENT
        </span>
      </nav>

      {/* ── Page header ──────────────────────────────────────── */}
      <header
        style={{
          padding: "32px 32px 24px",
          background: "var(--snow)",
          borderBottom: "1px solid var(--hairline)",
          display: "flex",
          alignItems: "flex-start",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        {/* Left: title */}
        <div style={{ flex: "1 1 280px" }}>
          <p
            className="eyebrow"
            style={{ marginBottom: 8, color: "var(--ink-4)" }}
          >
            CONTENT SUBMISSION
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              fontWeight: 700,
              color: "var(--ink)",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            POST CONTENT
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              color: "var(--ink-3)",
              marginTop: 8,
            }}
          >
            {campaign.campaignTitle}
          </p>
        </div>

        {/* Right: campaign summary card */}
        <div
          style={{
            ...cardStyle,
            display: "flex",
            alignItems: "flex-start",
            gap: 16,
            flex: "0 0 auto",
            maxWidth: 440,
          }}
        >
          {/* Merchant logo */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: campaign.logoColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontFamily: "var(--font-body)",
              fontSize: 14,
              fontWeight: 700,
              color: "var(--snow)",
              letterSpacing: "0.04em",
            }}
            aria-hidden="true"
          >
            {campaign.logoInitials}
          </div>

          <div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                fontWeight: 700,
                color: "var(--ink)",
                margin: 0,
              }}
            >
              {campaign.merchantName}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 4,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: campaign.categoryColor,
                }}
              >
                {campaign.category}
              </span>
              <span style={{ color: "var(--hairline)" }}>·</span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--accent-blue)",
                }}
              >
                {campaign.earnEstimate}
              </span>
              <span style={{ color: "var(--hairline)" }}>·</span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  color: "var(--ink-4)",
                }}
              >
                Due {campaign.deadline}
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--ink-3)",
                marginTop: 8,
                lineHeight: 1.5,
              }}
            >
              {campaign.brief}
            </p>
          </div>
        </div>
      </header>

      {/* ── Main form ────────────────────────────────────────── */}
      <main
        style={{ padding: "32px 32px 64px", maxWidth: 1140, margin: "0 auto" }}
      >
        {/* Two-column form grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* ── Left column: upload ──────────────────────────── */}
          <section aria-label="Upload content">
            {/* Section header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--snow)",
                  background: "var(--ink)",
                  borderRadius: 4,
                  padding: "2px 6px",
                  letterSpacing: "0.06em",
                }}
                aria-hidden="true"
              >
                01
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--ink)",
                  margin: 0,
                }}
              >
                UPLOAD CONTENT
              </h2>
            </div>

            {/* Drop zone */}
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
              style={{
                border: `2px dashed ${isDragOver ? "var(--accent-blue)" : "var(--hairline)"}`,
                borderRadius: 10,
                padding: uploadedFiles.length > 0 ? "16px 20px" : "40px 24px",
                background: isDragOver
                  ? "color-mix(in srgb, var(--accent-blue) 6%, var(--surface))"
                  : "var(--surface-2)",
                cursor: "pointer",
                transition: "border-color 0.15s, background 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
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
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 10,
                      background: "var(--surface-3, #ece9e0)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                      fontFamily: "var(--font-body)",
                      fontSize: 22,
                      color: "var(--ink-4)",
                    }}
                    aria-hidden="true"
                  >
                    ↑
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--ink)",
                      margin: "0 0 8px",
                    }}
                  >
                    Drag &amp; drop or click to upload
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      color: "var(--ink-4)",
                      margin: 0,
                      letterSpacing: "0.04em",
                    }}
                  >
                    JPG · PNG · MP4 · MOV · max 50 MB per file
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "var(--ink-4)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 18,
                      fontWeight: 300,
                    }}
                    aria-hidden="true"
                  >
                    +
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Add more files
                  </span>
                </div>
              )}
            </div>

            {/* Error */}
            {dragError && (
              <p
                role="alert"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--brand-red)",
                  marginTop: 8,
                  padding: "8px 12px",
                  background:
                    "color-mix(in srgb, var(--brand-red) 8%, var(--surface))",
                  borderRadius: 8,
                  border:
                    "1px solid color-mix(in srgb, var(--brand-red) 20%, transparent)",
                }}
              >
                {dragError}
              </p>
            )}

            {/* Thumbnails */}
            {uploadedFiles.length > 0 && (
              <div
                role="list"
                aria-label="Uploaded files"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginTop: 16,
                }}
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
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Caption */}
            <section aria-label="Caption">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--snow)",
                    background: "var(--ink)",
                    borderRadius: 4,
                    padding: "2px 6px",
                    letterSpacing: "0.06em",
                  }}
                  aria-hidden="true"
                >
                  02
                </span>
                <h2
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--ink)",
                    margin: 0,
                  }}
                >
                  CAPTION
                </h2>
              </div>

              <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
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
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    color: "var(--ink)",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    resize: "vertical",
                    lineHeight: 1.6,
                    boxSizing: "border-box",
                  }}
                />
                <div
                  style={{
                    padding: "8px 20px 12px",
                    borderTop: "1px solid var(--hairline)",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <p
                    id="caption-count"
                    aria-live="polite"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      color:
                        caption.length >= CAPTION_MAX
                          ? "var(--brand-red)"
                          : "var(--ink-4)",
                      margin: 0,
                      fontWeight: caption.length >= CAPTION_MAX ? 700 : 400,
                    }}
                  >
                    {caption.length} / {CAPTION_MAX}
                  </p>
                </div>
              </div>
            </section>

            {/* Hashtags */}
            <section aria-label="Hashtag suggestions">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--snow)",
                    background: "var(--ink)",
                    borderRadius: 4,
                    padding: "2px 6px",
                    letterSpacing: "0.06em",
                  }}
                  aria-hidden="true"
                >
                  03
                </span>
                <h2
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--ink)",
                    margin: 0,
                  }}
                >
                  SUGGESTED HASHTAGS
                </h2>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: "var(--ink-4)",
                    marginLeft: "auto",
                  }}
                >
                  Copy to caption above
                </span>
              </div>

              <div style={cardStyle}>
                <div
                  role="list"
                  aria-label="Hashtag suggestions"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 16,
                  }}
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
                      className="click-shift"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--accent-blue)",
                        background:
                          "color-mix(in srgb, var(--accent-blue) 10%, var(--surface))",
                        border:
                          "1px solid color-mix(in srgb, var(--accent-blue) 25%, transparent)",
                        borderRadius: 20,
                        padding: "4px 12px",
                        cursor: "pointer",
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    paddingTop: 12,
                    borderTop: "1px solid var(--hairline)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 14,
                      color: "var(--accent-blue)",
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    ◎
                  </span>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--ink-3)",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    Attribution code:{" "}
                    <strong
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 700,
                        color: "var(--ink)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {campaign.attributionCode}
                    </strong>{" "}
                    — show at register to log your walk-in
                  </p>
                </div>
              </div>
            </section>

            {/* Platforms */}
            <section aria-label="Platform selection">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--snow)",
                    background: "var(--ink)",
                    borderRadius: 4,
                    padding: "2px 6px",
                    letterSpacing: "0.06em",
                  }}
                  aria-hidden="true"
                >
                  04
                </span>
                <h2
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--ink)",
                    margin: 0,
                  }}
                >
                  PLATFORMS
                </h2>
              </div>

              <div
                role="group"
                aria-label="Select platforms"
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
              >
                {PLATFORMS.map((p) => {
                  const checked = platforms.has(p.id);
                  return (
                    <label
                      key={p.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "14px 16px",
                        background: checked
                          ? "color-mix(in srgb, var(--accent-blue) 8%, var(--surface))"
                          : "var(--surface-2)",
                        border: `1px solid ${checked ? "var(--accent-blue)" : "var(--hairline)"}`,
                        borderRadius: 10,
                        cursor: "pointer",
                        transition: "border-color 0.15s, background 0.15s",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePlatform(p.id)}
                        style={{ display: "none" }}
                        aria-checked={checked}
                      />
                      {/* Custom checkbox */}
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 4,
                          border: `2px solid ${checked ? "var(--accent-blue)" : "var(--hairline)"}`,
                          background: checked
                            ? "var(--accent-blue)"
                            : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "border-color 0.15s, background 0.15s",
                        }}
                        aria-hidden="true"
                      >
                        {checked && (
                          <span
                            style={{
                              color: "var(--snow)",
                              fontSize: 11,
                              fontWeight: 700,
                              lineHeight: 1,
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 18,
                          color: checked
                            ? "var(--accent-blue)"
                            : "var(--ink-4)",
                        }}
                        aria-hidden="true"
                      >
                        {p.icon}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 14,
                          fontWeight: checked ? 700 : 400,
                          color: checked ? "var(--ink)" : "var(--ink-3)",
                          flex: 1,
                        }}
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
        <section
          aria-label="Submit content"
          style={{
            marginTop: 40,
            paddingTop: 32,
            borderTop: "1px solid var(--hairline)",
          }}
        >
          {submitState === "verified" ? (
            /* Verified state */
            <div
              role="status"
              aria-live="polite"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "24px 32px",
                background: "var(--surface-2)",
                border: "1px solid var(--hairline)",
                borderRadius: 10,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "#22c55e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontFamily: "var(--font-body)",
                  fontSize: 22,
                  color: "var(--snow)",
                  fontWeight: 700,
                }}
                aria-hidden="true"
              >
                ✓
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--ink)",
                    margin: "0 0 4px",
                  }}
                >
                  Content submitted. Verification pending.
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--ink-3)",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
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
            /* Submit form CTA */
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 24,
                flexWrap: "wrap",
              }}
            >
              {/* Meta info */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--ink-3)",
                    margin: 0,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#22c55e",
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  />
                  ConversionOracle™ will verify your walk-in within{" "}
                  <strong
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      color: "var(--ink)",
                    }}
                  >
                    8 seconds
                  </strong>
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--ink-3)",
                    margin: 0,
                  }}
                >
                  Earn{" "}
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--accent-blue)",
                    }}
                  >
                    {campaign.earnEstimate}
                  </span>{" "}
                  upon verification
                </p>
              </div>

              {/* Submit button */}
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
                  submitState === "idle" ? "btn-primary click-shift" : undefined
                }
                style={
                  submitState !== "idle"
                    ? {
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        padding: "14px 28px",
                        borderRadius: 8,
                        border: "none",
                        background:
                          submitState === "uploading"
                            ? "var(--ink-4)"
                            : "var(--accent-blue)",
                        color: "var(--snow)",
                        cursor: "not-allowed",
                        opacity: 0.75,
                        minWidth: 240,
                      }
                    : { minWidth: 240 }
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
