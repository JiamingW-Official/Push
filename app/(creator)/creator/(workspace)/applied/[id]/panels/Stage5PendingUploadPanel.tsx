"use client";

/* ============================================================
   <Stage5PendingUploadPanel> — post-shoot, upload window open
   v3 · 2026-05-10 — two-column premium layout
   ============================================================ */

import { useState } from "react";
import {
  Upload,
  CheckCircle2,
  Circle,
  Sparkles,
  Copy,
  Image,
} from "lucide-react";
import type { StagePanelProps } from "../StageRouter";
import { patchApplication } from "@/lib/data/live-applications";

interface Slot {
  id: number;
  label: string;
  tag: string;
  file?: string;
}

const INIT_SLOTS: Slot[] = [
  { id: 0, label: "Wide establishing shot", tag: "Image" },
  { id: 1, label: "Product hero close-up", tag: "Image" },
  { id: 2, label: "Candid lifestyle moment", tag: "Video" },
];

const CAPTION_TEMPLATES = [
  "Found my new neighbourhood gem 🫶 @{handle} has the best vibe — adding this to my weekly rotation. #ad #partner",
  "Can't stop thinking about this spot 📸 Dropped by @{handle} for content and stayed for the experience. #sponsored #local",
  "Exploring @{handle} with Push — genuinely love the energy here. Full review in stories 👀 #ad",
];

function suggestCaption(merchantName: string, idx: number): string {
  const handle = merchantName.toLowerCase().replace(/\s+/g, "");
  const t =
    CAPTION_TEMPLATES[idx % CAPTION_TEMPLATES.length] ?? CAPTION_TEMPLATES[0]!;
  return t.replace("{handle}", handle);
}

export function Stage5PendingUploadPanel({
  application,
  campaign,
}: StagePanelProps) {
  const [slots, setSlots] = useState<Slot[]>(INIT_SLOTS);
  const [ftcDone, setFtcDone] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const uploadedCount = slots.filter((s) => s.file).length;
  const canSubmit = uploadedCount === slots.length && ftcDone;

  function simulateUpload(id: number) {
    setSlots((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, file: `shot_${id + 1}_final.jpg` } : s,
      ),
    );
  }

  function handleSubmit() {
    patchApplication(application.id, {
      status: "submitted",
      submittedAt: new Date().toISOString(),
    });
  }

  function copyCaption(id: number, text: string) {
    navigator.clipboard.writeText(text).catch(() => undefined);
    setCopied(id);
    setTimeout(() => setCopied(null), 2_000);
  }

  return (
    <div className="ad-panel-v3" aria-label="Upload content">
      <div className="ad-layout">
        {/* ── LEFT COLUMN ──────────────────────────────────── */}
        <div className="ad-col-main">
          {/* Hero v3 */}
          <div className="ad-hero-v3">
            <div className="ad-hero-v3__eyebrow">
              <span className="ad-pill ad-pill--blue">
                <span className="ad-pill__dot" />
                UPLOAD DUE · 47h remaining
              </span>
            </div>
            <div className="ad-hero-v3__stat ad-hero-v3__stat--blue">47h</div>
            <h1 className="ad-hero-v3__title">Submit your content</h1>
            <p className="ad-hero-v3__sub">
              {uploadedCount} of {slots.length} files ready. FTC disclosure
              required before you can submit.
            </p>
          </div>

          {/* Agent v3 */}
          <div className="ad-agent-v3">
            <div className="ad-agent-v3__head">
              <span className="ad-agent-v3__icon" aria-hidden>
                <Sparkles size={13} strokeWidth={2.25} />
              </span>
              <span className="ad-agent-v3__label">Agent</span>
            </div>
            <div className="ad-agent-v3__body">
              <p className="ad-agent-v3__prose">
                Drop your 3 files, confirm the FTC tag, and submit. Caption
                suggestions are preloaded — edit the @handle to match the brand
                account. Approval usually happens within 24h.
              </p>
            </div>
          </div>

          {/* Deliverables card */}
          <div className="ad-card">
            <div className="ad-card__body">
              <span className="ad-card__label">YOUR DELIVERABLES</span>
              <div
                className="ad-progress-v3"
                role="progressbar"
                aria-valuenow={uploadedCount}
                aria-valuemax={slots.length}
                aria-label="Upload progress"
                style={{ marginTop: 12 }}
              >
                <div
                  className="ad-progress-v3__fill"
                  style={{
                    width: `${(uploadedCount / slots.length) * 100}%`,
                  }}
                />
              </div>
              <div style={{ marginBottom: 12 }} />
              <div className="ad-upload-v3">
                {slots.map((slot, i) => (
                  <div
                    key={slot.id}
                    className={`ad-upload-v3__slot${slot.file ? " is-done" : ""}`}
                  >
                    <div className="ad-upload-v3__head">
                      <span className="ad-upload-v3__num">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="ad-upload-v3__name">{slot.label}</span>
                      <span className="ad-upload-v3__tag">{slot.tag}</span>
                    </div>
                    {slot.file ? (
                      <div className="ad-upload-v3__file-row">
                        <CheckCircle2 size={14} strokeWidth={2.5} />
                        <span className="ad-upload-v3__filename">
                          {slot.file}
                        </span>
                        <button
                          type="button"
                          className="ad-upload-v3__replace"
                          onClick={() => simulateUpload(slot.id)}
                        >
                          Replace
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="ad-upload-v3__dropzone"
                        onClick={() => simulateUpload(slot.id)}
                      >
                        <span
                          className="ad-upload-v3__dropzone-icon"
                          aria-hidden
                        >
                          <Upload size={20} strokeWidth={1.75} />
                        </span>
                        <span className="ad-upload-v3__dropzone-label">
                          Tap to upload (demo)
                        </span>
                        <span className="ad-upload-v3__dropzone-hint">
                          JPG, PNG, MP4 · max 50 MB
                        </span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────── */}
        <div className="ad-col-side">
          {/* AI Captions card */}
          <div className="ad-card">
            <div className="ad-card__body">
              <span className="ad-card__label">AI CAPTIONS</span>
              {slots.map((slot, i) => {
                const caption = suggestCaption(campaign.merchantName, i);
                return (
                  <div
                    key={slot.id}
                    style={{
                      marginTop: 12,
                      padding: "10px 12px",
                      background: "var(--surface-2)",
                      borderRadius: 8,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--ink-4)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")} · {slot.label}
                    </span>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        lineHeight: 1.55,
                        color: "var(--ink-3)",
                      }}
                    >
                      {caption}
                    </p>
                    <button
                      type="button"
                      className="ad-btn ad-btn--ghost ad-btn--sm"
                      onClick={() => copyCaption(slot.id, caption)}
                      style={{ alignSelf: "flex-start" }}
                    >
                      <Copy size={11} strokeWidth={2.25} />
                      {copied === slot.id ? "Copied!" : "Copy"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FTC disclosure card */}
          <div className="ad-card">
            <div className="ad-card__body">
              <button
                type="button"
                className={`ad-ftc-v3${ftcDone ? " is-done" : ""}`}
                onClick={() => setFtcDone((v) => !v)}
              >
                <span className="ad-ftc-v3__check" aria-hidden>
                  {ftcDone ? (
                    <CheckCircle2 size={16} strokeWidth={2.5} />
                  ) : (
                    <Circle size={16} strokeWidth={2} />
                  )}
                </span>
                <div>
                  <span className="ad-ftc-v3__title">
                    FTC disclosure confirmed
                  </span>
                  <span className="ad-ftc-v3__sub">
                    I&apos;ll include #ad or #sponsored and tag the brand
                    account in every caption
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="button"
            className="ad-submit-v3"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {canSubmit
              ? "Submit all content →"
              : uploadedCount < slots.length
                ? `Upload ${slots.length - uploadedCount} more file${slots.length - uploadedCount > 1 ? "s" : ""}`
                : "Confirm FTC disclosure above"}
          </button>

          {!canSubmit && (
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "var(--ink-4)",
                textAlign: "center",
              }}
            >
              {uploadedCount < slots.length
                ? `${slots.length - uploadedCount} file${slots.length - uploadedCount > 1 ? "s" : ""} still needed`
                : "Check the FTC box above to unlock submit"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
