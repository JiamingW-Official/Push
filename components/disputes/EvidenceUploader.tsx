"use client";

import { useRef, useState } from "react";
import type { DisputeEvidence, ParticipantRole } from "@/lib/disputes/types";

interface EvidenceUploaderProps {
  disputeId: string;
  uploadedBy: ParticipantRole;
  onChange: (evidence: Omit<DisputeEvidence, "id" | "uploadedAt">[]) => void;
}

interface PreviewItem {
  url: string;
  label: string;
  type: "image" | "link";
}

export function EvidenceUploader({
  disputeId,
  uploadedBy,
  onChange,
}: EvidenceUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  function addPreviews(files: FileList | null) {
    if (!files?.length) return;
    const newItems: PreviewItem[] = [];
    Array.from(files).forEach((f) => {
      if (!f.type.startsWith("image/")) return;
      newItems.push({
        url: URL.createObjectURL(f),
        label: f.name,
        type: "image",
      });
    });
    const merged = [...previews, ...newItems];
    setPreviews(merged);
    emitChange(merged);
  }

  function addLink() {
    const trimmed = linkInput.trim();
    if (!trimmed) return;
    const item: PreviewItem = { url: trimmed, label: trimmed, type: "link" };
    const merged = [...previews, item];
    setPreviews(merged);
    setLinkInput("");
    emitChange(merged);
  }

  function remove(idx: number) {
    const updated = previews.filter((_, i) => i !== idx);
    setPreviews(updated);
    emitChange(updated);
  }

  function emitChange(items: PreviewItem[]) {
    onChange(
      items.map((p) => ({
        disputeId,
        uploadedBy,
        type: p.type,
        url: p.url,
        label: p.label,
      })),
    );
  }

  return (
    <div>
      {/* Drop zone */}
      <div
        className={`evidence-uploader${isDragOver ? " evidence-uploader--dragover" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          addPreviews(e.dataTransfer.files);
        }}
      >
        <div className="evidence-uploader__icon">📎</div>
        <p className="evidence-uploader__title">Drop screenshots here</p>
        <p className="evidence-uploader__sub">PNG, JPG up to 10MB</p>

        {previews.length > 0 && (
          <div
            className="evidence-uploader__previews"
            onClick={(e) => e.stopPropagation()}
          >
            {previews.map((p, i) => (
              <div key={i} className="evidence-uploader__preview">
                {p.type === "image" ? (
                  <img src={p.url} alt={p.label} />
                ) : (
                  <span>🔗</span>
                )}
                <button
                  className="evidence-uploader__preview-remove"
                  onClick={() => remove(i)}
                  type="button"
                  aria-label="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => addPreviews(e.target.files)}
      />

      {/* Link input */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "8px",
          alignItems: "center",
        }}
      >
        <input
          className="evidence-uploader__link-input"
          type="url"
          placeholder="Or paste a link (https://...)"
          value={linkInput}
          onChange={(e) => setLinkInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addLink())
          }
        />
        <button
          type="button"
          onClick={addLink}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            background: "var(--surface)",
            border: "1px solid var(--line)",
            padding: "8px 16px",
            cursor: "pointer",
            borderRadius: "var(--r-lg)",
            whiteSpace: "nowrap",
            color: "var(--dark)",
          }}
        >
          Add link
        </button>
      </div>
    </div>
  );
}
