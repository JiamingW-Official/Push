"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getQRCode,
  isQRExpired,
  type MockQRCode,
} from "@/lib/attribution/mock-qr-codes";
import { getScanTimestamp, trackVerify } from "@/lib/attribution/track";

/* ── Constants ─────────────────────────────────────────────── */

const VERIFY_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

/* ── Helpers ───────────────────────────────────────────────── */

function msToHMS(ms: number): { h: number; m: number; s: number } {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  return {
    h: Math.floor(totalSec / 3600),
    m: Math.floor((totalSec % 3600) / 60),
    s: totalSec % 60,
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/* ── Component ─────────────────────────────────────────────── */

type PageState =
  | "loading"
  | "no-scan" // user never scanned — redirect to scan page
  | "expired-window" // 24h window passed
  | "qr-expired" // campaign itself expired
  | "not-found"
  | "ready"
  | "submitting"
  | "success";

export default function VerifyPage() {
  const params = useParams();
  const router = useRouter();
  const qrId = params.qrId as string;

  const [qr, setQr] = useState<MockQRCode | null>(null);
  const [pageState, setPageState] = useState<PageState>("loading");
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [scanTs, setScanTs] = useState<string | null>(null);

  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [evidenceType, setEvidenceType] = useState<
    "photo" | "receipt" | "screenshot"
  >("photo");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Error state
  const [submitError, setSubmitError] = useState<string | null>(null);

  /* ── Init ── */
  useEffect(() => {
    const code = getQRCode(qrId);
    if (!code) {
      setPageState("not-found");
      return;
    }
    if (isQRExpired(code)) {
      setQr(code);
      setPageState("qr-expired");
      return;
    }

    const ts = getScanTimestamp(qrId);
    if (!ts) {
      setQr(code);
      setPageState("no-scan");
      return;
    }

    const scanTime = new Date(ts).getTime();
    const now = Date.now();
    const remaining = VERIFY_WINDOW_MS - (now - scanTime);

    if (remaining <= 0) {
      setQr(code);
      setPageState("expired-window");
      return;
    }

    setQr(code);
    setScanTs(ts);
    setTimeRemaining(remaining);
    setPageState("ready");
  }, [qrId]);

  /* ── Countdown timer ── */
  useEffect(() => {
    if (pageState !== "ready" || timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const next = prev - 1000;
        if (next <= 0) {
          setPageState("expired-window");
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [pageState, timeRemaining]);

  /* ── File handling ── */
  const handleFile = useCallback((f: File) => {
    setFile(f);
    // Auto-detect evidence type from MIME
    if (f.type.startsWith("image/")) {
      setEvidenceType("photo");
    }
    const url = URL.createObjectURL(f);
    setPreview(url);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const clearFile = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!file || !qr) return;
    setSubmitError(null);
    setPageState("submitting");

    try {
      await trackVerify(qrId, {
        campaignId: qr.campaignId,
        creatorId: qr.creatorId,
        merchantId: qr.merchantId,
        evidenceType,
      });
      setPageState("success");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setPageState("ready");
    }
  };

  /* ── Render guards ── */

  if (pageState === "loading") {
    return (
      <div style={styles.centered}>
        <p style={styles.loadingText}>Loading…</p>
      </div>
    );
  }

  if (pageState === "not-found") {
    return (
      <div style={styles.centered}>
        <div style={styles.stateCard}>
          <p style={{ ...styles.eyebrow, color: "var(--primary)" }}>
            INVALID CODE
          </p>
          <h1 style={styles.stateTitle}>QR code not found</h1>
          <p style={styles.stateBody}>
            Please scan the QR code at the merchant location to get started.
          </p>
        </div>
      </div>
    );
  }

  if (pageState === "no-scan") {
    return (
      <div style={styles.centered}>
        <div style={styles.stateCard}>
          <p style={{ ...styles.eyebrow, color: "var(--tertiary)" }}>
            SCAN FIRST
          </p>
          <h1 style={styles.stateTitle}>Scan the QR code first</h1>
          <p style={styles.stateBody}>
            You need to scan the campaign QR code before verifying your visit.
          </p>
          <button
            style={styles.secondaryButton}
            onClick={() => router.push(`/scan/${qrId}`)}
          >
            GO TO CAMPAIGN PAGE
          </button>
        </div>
      </div>
    );
  }

  if (pageState === "qr-expired" || pageState === "expired-window") {
    return (
      <div style={styles.centered}>
        <div style={styles.stateCard}>
          <p style={{ ...styles.eyebrow, color: "var(--primary)" }}>
            {pageState === "qr-expired" ? "CAMPAIGN ENDED" : "WINDOW CLOSED"}
          </p>
          <h1 style={styles.stateTitle}>
            {pageState === "qr-expired"
              ? "Campaign has ended"
              : "Verification window expired"}
          </h1>
          <p style={styles.stateBody}>
            {pageState === "qr-expired"
              ? `This campaign is no longer active. Check ${qr?.businessName} for current offers.`
              : "The 24-hour verification window has passed. Visit the merchant again to start a new session."}
          </p>
          {pageState === "expired-window" && (
            <button
              style={styles.secondaryButton}
              onClick={() => router.push(`/scan/${qrId}`)}
            >
              START AGAIN
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ── Success state ── */
  if (pageState === "success") {
    return (
      <div style={styles.page}>
        <header style={styles.topBar}>
          <span style={styles.topBarLogo}>PUSH</span>
          <span style={styles.topBarTag}>Visit Confirmed</span>
        </header>

        <div style={styles.successWrap}>
          <div style={styles.successIcon}>✓</div>
          <h1 style={styles.successTitle}>Visit confirmed!</h1>
          <p style={styles.successBody}>
            Your visit to <strong>{qr?.businessName}</strong> has been recorded.
            {qr?.creatorName && (
              <> {qr.creatorName} gets credit for bringing you in.</>
            )}
          </p>

          <div style={styles.successCard}>
            <p style={styles.successCardLabel}>WHAT HAPPENS NEXT</p>
            <ul style={styles.successList}>
              <li style={styles.successListItem}>
                Your proof is under review (usually instant)
              </li>
              <li style={styles.successListItem}>
                Creator earnings are updated within 24h
              </li>
              <li style={styles.successListItem}>
                Come back — your 30-day attribution window is active
              </li>
            </ul>
          </div>

          <Link href={`/scan/${qrId}`} style={styles.secondaryButton}>
            BACK TO CAMPAIGN
          </Link>
        </div>
      </div>
    );
  }

  /* ── Ready / submitting state ── */
  const { h, m, s } = msToHMS(timeRemaining);
  const scanDate = scanTs
    ? new Date(scanTs).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div style={styles.page}>
      <header style={styles.topBar}>
        <button
          style={styles.backButton}
          onClick={() => router.push(`/scan/${qrId}`)}
        >
          ← Back
        </button>
        <span style={styles.topBarLogo}>PUSH</span>
        <span style={styles.topBarTag}>Verify Visit</span>
      </header>

      <div style={styles.content}>
        {/* Campaign reference */}
        {qr && (
          <div style={styles.campaignRef}>
            <p style={styles.campaignRefLabel}>CAMPAIGN</p>
            <p style={styles.campaignRefTitle}>{qr.campaignTitle}</p>
            <p style={styles.campaignRefBiz}>{qr.businessName}</p>
          </div>
        )}

        {/* Countdown */}
        <div style={styles.countdownCard}>
          <p style={styles.eyebrow}>VERIFICATION WINDOW</p>
          <div style={styles.countdownRow}>
            <div style={styles.countdownUnit}>
              <span style={styles.countdownNum}>{pad(h)}</span>
              <span style={styles.countdownLabel}>HR</span>
            </div>
            <span style={styles.countdownSep}>:</span>
            <div style={styles.countdownUnit}>
              <span style={styles.countdownNum}>{pad(m)}</span>
              <span style={styles.countdownLabel}>MIN</span>
            </div>
            <span style={styles.countdownSep}>:</span>
            <div style={styles.countdownUnit}>
              <span style={styles.countdownNum}>{pad(s)}</span>
              <span style={styles.countdownLabel}>SEC</span>
            </div>
          </div>
          {scanDate && (
            <p style={styles.countdownNote}>
              Scanned at {scanDate} — expires in 24h
            </p>
          )}
        </div>

        {/* Evidence type selector */}
        <div style={styles.section}>
          <p style={styles.sectionLabel}>PROOF TYPE</p>
          <div style={styles.typeRow}>
            {(["photo", "receipt", "screenshot"] as const).map((t) => (
              <button
                key={t}
                style={{
                  ...styles.typeChip,
                  ...(evidenceType === t ? styles.typeChipActive : {}),
                }}
                onClick={() => setEvidenceType(t)}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Drop zone / preview */}
        <div style={styles.section}>
          <p style={styles.sectionLabel}>UPLOAD EVIDENCE</p>

          {!preview ? (
            <div
              style={{
                ...styles.dropZone,
                ...(dragOver ? styles.dropZoneActive : {}),
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && fileInputRef.current?.click()
              }
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={onFileChange}
              />
              <p style={styles.dropZoneIcon}>↑</p>
              <p style={styles.dropZoneText}>
                Tap to upload or drag your{" "}
                {evidenceType === "photo"
                  ? "photo"
                  : evidenceType === "receipt"
                    ? "receipt"
                    : "screenshot"}
              </p>
              <p style={styles.dropZoneHint}>JPG, PNG, HEIC — max 10MB</p>
            </div>
          ) : (
            <div style={styles.previewWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Evidence preview"
                style={styles.previewImg}
              />
              <div style={styles.previewBar}>
                <p style={styles.previewName}>{file?.name}</p>
                <button style={styles.previewRemove} onClick={clearFile}>
                  REMOVE
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div style={styles.instructions}>
          <p style={styles.instructionsLabel}>WHAT TO UPLOAD</p>
          <ul style={styles.instructionsList}>
            <li style={styles.instructionsItem}>
              A photo of your visit (food, drink, product, or location)
            </li>
            <li style={styles.instructionsItem}>
              A receipt or confirmation from {qr?.businessName}
            </li>
            <li style={styles.instructionsItem}>
              A screenshot of your Instagram story (if already posted)
            </li>
          </ul>
        </div>

        {/* Error */}
        {submitError && (
          <div style={styles.errorBanner}>
            <p style={styles.errorText}>{submitError}</p>
          </div>
        )}

        {/* Submit */}
        <button
          style={{
            ...styles.submitButton,
            ...(!file || pageState === "submitting"
              ? styles.submitButtonDisabled
              : {}),
          }}
          disabled={!file || pageState === "submitting"}
          onClick={handleSubmit}
          onMouseEnter={(e) => {
            if (!file || pageState === "submitting") return;
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "var(--shadow-3)";
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translate(-2px, -2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "var(--shadow-2)";
            (e.currentTarget as HTMLButtonElement).style.transform = "none";
          }}
        >
          {pageState === "submitting" ? "SUBMITTING…" : "SUBMIT PROOF →"}
        </button>

        <p style={styles.finePrint}>
          Submitting proof confirms your visit. False submissions may result in
          account restrictions.
        </p>
      </div>
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────── */

const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--surface)",
    fontFamily: "var(--font-body)",
    color: "var(--dark)",
  } as React.CSSProperties,

  centered: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--surface)",
    padding: "24px",
  } as React.CSSProperties,

  loadingText: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-small)",
    color: "var(--text-muted)",
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  } as React.CSSProperties,

  stateCard: {
    background: "var(--surface-elevated)",
    border: "1px solid var(--line)",
    padding: "40px 32px",
    maxWidth: "480px",
    width: "100%",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  } as React.CSSProperties,

  stateTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-h3)",
    fontWeight: 700,
    color: "var(--dark)",
    letterSpacing: "-0.03em",
  } as React.CSSProperties,

  stateBody: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-small)",
    color: "var(--graphite)",
    lineHeight: 1.6,
  } as React.CSSProperties,

  /* Top bar */
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    borderBottom: "1px solid var(--line)",
    background: "var(--surface-elevated)",
  } as React.CSSProperties,

  topBarLogo: {
    fontFamily: "var(--font-display)",
    fontSize: "20px",
    fontWeight: 900,
    color: "var(--dark)",
    letterSpacing: "-0.04em",
  } as React.CSSProperties,

  topBarTag: {
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: "var(--text-muted)",
    textTransform: "uppercase" as const,
  } as React.CSSProperties,

  backButton: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-small)",
    color: "var(--graphite)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0",
  } as React.CSSProperties,

  /* Content */
  content: {
    maxWidth: "520px",
    margin: "0 auto",
    padding: "32px 24px 48px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
  } as React.CSSProperties,

  /* Campaign ref */
  campaignRef: {
    paddingBottom: "20px",
    borderBottom: "1px solid var(--line)",
  } as React.CSSProperties,

  campaignRefLabel: {
    fontFamily: "var(--font-body)",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--text-muted)",
    marginBottom: "4px",
  } as React.CSSProperties,

  campaignRefTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-h4)",
    fontWeight: 700,
    color: "var(--dark)",
    letterSpacing: "-0.02em",
    marginBottom: "2px",
  } as React.CSSProperties,

  campaignRefBiz: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-small)",
    color: "var(--graphite)",
  } as React.CSSProperties,

  /* Countdown */
  countdownCard: {
    background: "var(--dark)",
    padding: "24px",
    textAlign: "center" as const,
  } as React.CSSProperties,

  countdownRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    margin: "12px 0 8px",
  } as React.CSSProperties,

  countdownUnit: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "2px",
  } as React.CSSProperties,

  countdownNum: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(32px, 8vw, 52px)",
    fontWeight: 800,
    color: "#ffffff",
    letterSpacing: "-0.04em",
    lineHeight: 1,
  } as React.CSSProperties,

  countdownLabel: {
    fontFamily: "var(--font-body)",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "rgba(255,255,255,0.45)",
  } as React.CSSProperties,

  countdownSep: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(28px, 7vw, 44px)",
    fontWeight: 800,
    color: "rgba(255,255,255,0.35)",
    lineHeight: 1,
    paddingBottom: "16px",
  } as React.CSSProperties,

  countdownNote: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-caption)",
    color: "rgba(255,255,255,0.45)",
  } as React.CSSProperties,

  /* Eyebrow shared */
  eyebrow: {
    fontFamily: "var(--font-body)",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "rgba(255,255,255,0.55)",
    textTransform: "uppercase" as const,
  } as React.CSSProperties,

  /* Section */
  section: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  } as React.CSSProperties,

  sectionLabel: {
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--text-muted)",
  } as React.CSSProperties,

  /* Type chips */
  typeRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap" as const,
  } as React.CSSProperties,

  typeChip: {
    padding: "8px 16px",
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    border: "1px solid var(--line)",
    background: "var(--surface-elevated)",
    color: "var(--graphite)",
    cursor: "pointer",
    borderRadius: "var(--r-pill)",
    transition: "all 150ms ease",
  } as React.CSSProperties,

  typeChipActive: {
    background: "var(--dark)",
    borderColor: "var(--dark)",
    color: "#ffffff",
  } as React.CSSProperties,

  /* Drop zone */
  dropZone: {
    border: "2px dashed var(--line)",
    borderRadius: "var(--r-xl)",
    padding: "48px 24px",
    textAlign: "center" as const,
    cursor: "pointer",
    background: "var(--surface-elevated)",
    transition: "border-color 150ms ease, background 150ms ease",
  } as React.CSSProperties,

  dropZoneActive: {
    borderColor: "var(--dark)",
    background: "var(--surface-muted)",
  } as React.CSSProperties,

  dropZoneIcon: {
    fontFamily: "var(--font-display)",
    fontSize: "32px",
    fontWeight: 800,
    color: "var(--dark)",
    marginBottom: "8px",
  } as React.CSSProperties,

  dropZoneText: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-small)",
    fontWeight: 600,
    color: "var(--dark)",
    marginBottom: "4px",
  } as React.CSSProperties,

  dropZoneHint: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-caption)",
    color: "var(--text-muted)",
  } as React.CSSProperties,

  /* Preview */
  previewWrap: {
    border: "1px solid var(--line)",
    borderRadius: "var(--r-xl)",
    background: "var(--surface-elevated)",
    overflow: "hidden",
  } as React.CSSProperties,

  previewImg: {
    width: "100%",
    maxHeight: "320px",
    objectFit: "cover" as const,
    display: "block",
  } as React.CSSProperties,

  previewBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 16px",
    borderTop: "1px solid var(--line)",
  } as React.CSSProperties,

  previewName: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-caption)",
    color: "var(--graphite)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
    flex: 1,
    marginRight: "12px",
  } as React.CSSProperties,

  previewRemove: {
    fontFamily: "var(--font-body)",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: "var(--primary)",
    background: "none",
    border: "none",
    cursor: "pointer",
    flexShrink: 0,
  } as React.CSSProperties,

  /* Instructions */
  instructions: {
    padding: "16px 20px",
    background: "var(--surface-muted)",
    border: "1px solid var(--line)",
  } as React.CSSProperties,

  instructionsLabel: {
    fontFamily: "var(--font-body)",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--text-muted)",
    marginBottom: "8px",
  } as React.CSSProperties,

  instructionsList: {
    listStyle: "none",
    padding: "0",
    margin: "0",
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  } as React.CSSProperties,

  instructionsItem: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-caption)",
    color: "var(--graphite)",
    lineHeight: 1.5,
    paddingLeft: "12px",
    position: "relative" as const,
  } as React.CSSProperties,

  /* Error */
  errorBanner: {
    padding: "12px 16px",
    background: "rgba(193, 18, 31, 0.06)",
    border: "1px solid rgba(193, 18, 31, 0.25)",
  } as React.CSSProperties,

  errorText: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-small)",
    color: "var(--primary)",
  } as React.CSSProperties,

  /* Submit */
  submitButton: {
    width: "100%",
    padding: "18px 24px",
    background: "var(--primary)",
    color: "#ffffff",
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-small)",
    fontWeight: 700,
    letterSpacing: "0.06em",
    border: "none",
    borderRadius: "var(--r-lg)",
    cursor: "pointer",
    boxShadow: "var(--shadow-2)",
    transition: "box-shadow 150ms ease, transform 150ms ease",
  } as React.CSSProperties,

  submitButtonDisabled: {
    background: "var(--graphite)",
    boxShadow: "none",
    cursor: "not-allowed",
    opacity: 0.5,
  } as React.CSSProperties,

  finePrint: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-caption)",
    color: "var(--text-muted)",
    textAlign: "center" as const,
    lineHeight: 1.5,
  } as React.CSSProperties,

  /* Secondary button (shared) */
  secondaryButton: {
    display: "inline-block",
    padding: "12px 24px",
    background: "transparent",
    color: "var(--dark)",
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    border: "1px solid var(--dark)",
    borderRadius: "var(--r-lg)",
    cursor: "pointer",
    textDecoration: "none",
    marginTop: "4px",
  } as React.CSSProperties,

  /* Success */
  successWrap: {
    maxWidth: "480px",
    margin: "0 auto",
    padding: "48px 24px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "16px",
    textAlign: "center" as const,
  } as React.CSSProperties,

  successIcon: {
    width: "64px",
    height: "64px",
    background: "var(--dark)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-display)",
    fontSize: "28px",
    fontWeight: 800,
    flexShrink: 0,
    borderRadius: "var(--r-full)", // icon circle — Design.md
  } as React.CSSProperties,

  successTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-h2)",
    fontWeight: 700,
    color: "var(--dark)",
    letterSpacing: "-0.03em",
  } as React.CSSProperties,

  successBody: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-small)",
    color: "var(--graphite)",
    lineHeight: 1.6,
    maxWidth: "360px",
  } as React.CSSProperties,

  successCard: {
    width: "100%",
    background: "var(--surface-elevated)",
    border: "1px solid var(--line)",
    borderRadius: "var(--r-xl)",
    padding: "20px 24px",
    textAlign: "left" as const,
  } as React.CSSProperties,

  successCardLabel: {
    fontFamily: "var(--font-body)",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--text-muted)",
    marginBottom: "10px",
  } as React.CSSProperties,

  successList: {
    listStyle: "none",
    padding: "0",
    margin: "0",
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  } as React.CSSProperties,

  successListItem: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-small)",
    color: "var(--graphite)",
    lineHeight: 1.5,
    paddingLeft: "16px",
    position: "relative" as const,
    // Bullet via CSS — can't use ::before in inline styles;
    // use a unicode dash instead
  } as React.CSSProperties,
} as const;
