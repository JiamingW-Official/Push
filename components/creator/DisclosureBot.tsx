"use client";

import { useState } from "react";
import type { DisclosureCheckResult } from "@/app/api/creator/disclosure/check/route";
import "./disclosure-bot.css";

interface DisclosureBotProps {
  platform?: string;
  brandName?: string;
  /** Called after a verified result, if caller wants to gate submission */
  onVerified?: (result: DisclosureCheckResult) => void;
}

type ScanState = "idle" | "scanning" | "verified" | "flagged" | "error";

export function DisclosureBot({
  platform = "instagram",
  brandName = "the brand",
  onVerified,
}: DisclosureBotProps) {
  const [caption, setCaption] = useState("");
  const [state, setState] = useState<ScanState>("idle");
  const [result, setResult] = useState<DisclosureCheckResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [charCount, setCharCount] = useState(0);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setCaption(e.target.value);
    setCharCount(e.target.value.length);
    if (state !== "idle") setState("idle");
  }

  async function handleScan() {
    if (!caption.trim()) return;
    setState("scanning");
    setResult(null);
    setErrorMsg("");

    try {
      const res = await fetch("/api/creator/disclosure/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption, platform, brand_name: brandName }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }

      const data: DisclosureCheckResult = await res.json();
      setResult(data);
      setState(data.verified ? "verified" : "flagged");
      if (data.verified) onVerified?.(data);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Scan failed");
      setState("error");
    }
  }

  const platformLabel =
    platform === "instagram"
      ? "Instagram"
      : platform === "tiktok"
        ? "TikTok"
        : platform === "xhs"
          ? "Xiaohongshu"
          : platform;

  return (
    <div className={`dbot dbot--${state}`} aria-live="polite">
      {/* Header */}
      <div className="dbot-header">
        <span className="dbot-logo">DisclosureBot™</span>
        <span className="dbot-badge">
          {state === "scanning" ? (
            <span className="dbot-badge-scanning">SCANNING</span>
          ) : state === "verified" ? (
            <span className="dbot-badge-ok">COMPLIANT</span>
          ) : state === "flagged" ? (
            <span className="dbot-badge-fail">FLAGGED</span>
          ) : (
            <span className="dbot-badge-idle">FTC CHECKER</span>
          )}
        </span>
      </div>

      {/* Caption input */}
      <div className="dbot-input-section">
        <label className="dbot-label" htmlFor="dbot-caption">
          PASTE YOUR {platformLabel.toUpperCase()} CAPTION
        </label>
        <div className="dbot-textarea-wrap">
          <textarea
            id="dbot-caption"
            className="dbot-textarea"
            value={caption}
            onChange={handleChange}
            placeholder={`Write your ${platformLabel} caption here. DisclosureBot will check for FTC-compliant disclosure language before you submit.`}
            rows={5}
            maxLength={2200}
            aria-describedby="dbot-char-count"
          />
          <span
            className="dbot-char-count"
            id="dbot-char-count"
            aria-label={`${charCount} of 2200 characters`}
          >
            {charCount}
            <span aria-hidden="true">/2200</span>
          </span>
        </div>
      </div>

      {/* Scan button */}
      <button
        className="dbot-scan-btn"
        onClick={handleScan}
        disabled={state === "scanning" || !caption.trim()}
        aria-busy={state === "scanning"}
      >
        {state === "scanning" ? (
          <span className="dbot-scan-progress">
            <span className="dbot-scan-bar" aria-hidden="true" />
            ANALYZING…
          </span>
        ) : (
          "SCAN FOR DISCLOSURE →"
        )}
      </button>

      {/* Result panel */}
      {(state === "verified" || state === "flagged" || state === "error") &&
        (result || errorMsg) && (
          <div className={`dbot-result dbot-result--${state}`} role="status">
            {state === "verified" && result && (
              <>
                <div className="dbot-result-header">
                  <span className="dbot-status-icon" aria-hidden="true">
                    ✓
                  </span>
                  <span className="dbot-status-text">
                    FTC Disclosure Detected
                  </span>
                </div>
                <p className="dbot-result-reason">{result.reason}</p>
                {result.disclosure_found && (
                  <code className="dbot-disclosure-found">
                    {result.disclosure_found}
                  </code>
                )}
              </>
            )}

            {state === "flagged" && result && (
              <>
                <div className="dbot-result-header">
                  <span className="dbot-status-icon" aria-hidden="true">
                    ✕
                  </span>
                  <span className="dbot-status-text">Disclosure Missing</span>
                </div>
                <p className="dbot-result-reason">{result.reason}</p>
                {result.suggestions.length > 0 && (
                  <div className="dbot-suggestions">
                    <p className="dbot-suggestions-label">
                      HOW TO FIX ({result.suggestions.length} SUGGESTION
                      {result.suggestions.length > 1 ? "S" : ""})
                    </p>
                    <ul className="dbot-suggestions-list">
                      {result.suggestions.map((s, i) => (
                        <li key={i} className="dbot-suggestion">
                          <span className="dbot-suggestion-num">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {state === "error" && (
              <>
                <div className="dbot-result-header">
                  <span className="dbot-status-icon" aria-hidden="true">
                    !
                  </span>
                  <span className="dbot-status-text">Scan Error</span>
                </div>
                <p className="dbot-result-reason">{errorMsg}</p>
              </>
            )}
          </div>
        )}

      {/* FTC info footer */}
      <p className="dbot-footer">
        FTC Endorsement Guides require clear disclosure of material
        relationships.{" "}
        <a
          href="https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers"
          target="_blank"
          rel="noopener noreferrer"
          className="dbot-footer-link"
        >
          Learn more ↗
        </a>
      </p>
    </div>
  );
}
