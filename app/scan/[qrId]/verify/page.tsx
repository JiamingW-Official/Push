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

  /* ── Design.md v11 inline styles — product register ── */
  const S = {
    page: {
      minHeight: "100vh",
      background: "var(--surface)",
      fontFamily: "var(--font-body)",
      color: "var(--ink)",
    } as React.CSSProperties,

    centered: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--surface)",
      padding: "24px",
    } as React.CSSProperties,

    stateCard: {
      background: "var(--surface-2)",
      border: "1px solid var(--mist)",
      borderRadius: "10px",
      padding: "40px 32px",
      maxWidth: "480px",
      width: "100%",
      display: "flex",
      flexDirection: "column" as const,
      gap: "12px",
    } as React.CSSProperties,

    stateEyebrow: {
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase" as const,
      color: "var(--ink-4)",
      margin: 0,
    } as React.CSSProperties,

    stateTitle: {
      fontFamily: "var(--font-display)",
      fontSize: "clamp(24px,5vw,32px)",
      fontWeight: 700,
      color: "var(--ink)",
      letterSpacing: "-0.03em",
      margin: 0,
    } as React.CSSProperties,

    stateBody: {
      fontFamily: "var(--font-body)",
      fontSize: "18px",
      color: "var(--ink-3)",
      lineHeight: 1.55,
      margin: 0,
    } as React.CSSProperties,

    /* Top bar */
    topBar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 24px",
      borderBottom: "1px solid var(--mist)",
      background: "var(--surface-2)",
    } as React.CSSProperties,

    topBarLogo: {
      fontFamily: "var(--font-display)",
      fontSize: "20px",
      fontWeight: 900,
      color: "var(--ink)",
      letterSpacing: "-0.04em",
    } as React.CSSProperties,

    topBarTag: {
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "0.06em",
      color: "var(--ink-4)",
      textTransform: "uppercase" as const,
    } as React.CSSProperties,

    backButton: {
      fontFamily: "var(--font-body)",
      fontSize: "14px",
      color: "var(--ink-3)",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "0",
      transition: "color 150ms ease",
    } as React.CSSProperties,

    /* Content */
    content: {
      maxWidth: "520px",
      margin: "0 auto",
      padding: "40px 24px 80px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "24px",
    } as React.CSSProperties,

    /* Campaign ref */
    campaignRef: {
      paddingBottom: "24px",
      borderBottom: "1px solid var(--mist)",
    } as React.CSSProperties,

    campaignRefLabel: {
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "0.08em",
      color: "var(--ink-5)",
      textTransform: "uppercase" as const,
      marginBottom: "4px",
    } as React.CSSProperties,

    campaignRefTitle: {
      fontFamily: "var(--font-display)",
      fontSize: "clamp(20px,4vw,28px)",
      fontWeight: 700,
      color: "var(--ink)",
      letterSpacing: "-0.02em",
      marginBottom: "4px",
    } as React.CSSProperties,

    campaignRefBiz: {
      fontFamily: "var(--font-body)",
      fontSize: "18px",
      color: "var(--ink-3)",
    } as React.CSSProperties,

    /* Countdown — dark panel */
    countdownCard: {
      background: "var(--ink)",
      borderRadius: "10px",
      padding: "24px",
      textAlign: "center" as const,
    } as React.CSSProperties,

    countdownEyebrow: {
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "0.08em",
      color: "rgba(255,255,255,0.5)",
      textTransform: "uppercase" as const,
      margin: 0,
    } as React.CSSProperties,

    countdownRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      margin: "16px 0 8px",
    } as React.CSSProperties,

    countdownUnit: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      gap: "4px",
    } as React.CSSProperties,

    countdownNum: {
      fontFamily: "var(--font-display)",
      fontSize: "clamp(40px,9vw,64px)",
      fontWeight: 800,
      color: "var(--snow)",
      letterSpacing: "-0.04em",
      lineHeight: 1,
    } as React.CSSProperties,

    countdownLabel: {
      fontFamily: "var(--font-body)",
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.08em",
      color: "rgba(255,255,255,0.4)",
    } as React.CSSProperties,

    countdownSep: {
      fontFamily: "var(--font-display)",
      fontSize: "clamp(32px,7vw,48px)",
      fontWeight: 800,
      color: "rgba(255,255,255,0.25)",
      lineHeight: 1,
      paddingBottom: "16px",
    } as React.CSSProperties,

    countdownNote: {
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      color: "rgba(255,255,255,0.4)",
      margin: 0,
    } as React.CSSProperties,

    /* Section */
    section: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "8px",
    } as React.CSSProperties,

    sectionLabel: {
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "0.08em",
      color: "var(--ink-4)",
      textTransform: "uppercase" as const,
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
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "0.06em",
      border: "1px solid var(--mist)",
      background: "var(--surface-2)",
      color: "var(--ink-3)",
      cursor: "pointer",
      borderRadius: "40px",
      transition: "all 150ms ease",
    } as React.CSSProperties,

    typeChipActive: {
      background: "var(--ink)",
      borderColor: "var(--ink)",
      color: "var(--snow)",
    } as React.CSSProperties,

    /* Drop zone */
    dropZone: {
      border: "2px dashed var(--mist)",
      borderRadius: "10px",
      padding: "48px 24px",
      textAlign: "center" as const,
      cursor: "pointer",
      background: "var(--surface-2)",
      transition: "border-color 150ms ease, background 150ms ease",
    } as React.CSSProperties,

    dropZoneActive: {
      borderColor: "var(--brand-red)",
      background: "var(--surface-3)",
    } as React.CSSProperties,

    dropZoneIcon: {
      fontFamily: "var(--font-display)",
      fontSize: "32px",
      fontWeight: 800,
      color: "var(--ink)",
      marginBottom: "8px",
    } as React.CSSProperties,

    dropZoneText: {
      fontFamily: "var(--font-body)",
      fontSize: "18px",
      fontWeight: 600,
      color: "var(--ink)",
      marginBottom: "4px",
    } as React.CSSProperties,

    dropZoneHint: {
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      color: "var(--ink-4)",
    } as React.CSSProperties,

    /* Preview */
    previewWrap: {
      border: "1px solid var(--mist)",
      borderRadius: "10px",
      background: "var(--surface-2)",
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
      padding: "8px 16px",
      borderTop: "1px solid var(--mist)",
    } as React.CSSProperties,

    previewName: {
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      color: "var(--ink-3)",
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
      color: "var(--brand-red)",
      background: "none",
      border: "none",
      cursor: "pointer",
      flexShrink: 0,
      textTransform: "uppercase" as const,
    } as React.CSSProperties,

    /* Instructions */
    instructions: {
      padding: "16px 24px",
      background: "var(--surface-3)",
      border: "1px solid var(--mist)",
      borderRadius: "8px",
    } as React.CSSProperties,

    instructionsLabel: {
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "0.08em",
      color: "var(--ink-4)",
      textTransform: "uppercase" as const,
      marginBottom: "8px",
    } as React.CSSProperties,

    instructionsList: {
      listStyle: "none",
      padding: "0",
      margin: "0",
      display: "flex",
      flexDirection: "column" as const,
      gap: "8px",
    } as React.CSSProperties,

    instructionsItem: {
      fontFamily: "var(--font-body)",
      fontSize: "18px",
      color: "var(--ink-3)",
      lineHeight: 1.55,
      paddingLeft: "12px",
      position: "relative" as const,
    } as React.CSSProperties,

    /* Error */
    errorBanner: {
      padding: "12px 16px",
      background: "rgba(193, 18, 31, 0.05)",
      border: "1px solid rgba(193, 18, 31, 0.2)",
      borderLeft: "3px solid var(--brand-red)",
      borderRadius: "0 8px 8px 0",
    } as React.CSSProperties,

    errorText: {
      fontFamily: "var(--font-body)",
      fontSize: "14px",
      color: "var(--brand-red)",
      margin: 0,
    } as React.CSSProperties,

    /* Submit — v11 Filled Primary */
    submitButton: {
      width: "100%",
      padding: "14px 28px",
      background: "var(--brand-red)",
      color: "var(--snow)",
      fontFamily: "var(--font-body)",
      fontSize: "14px",
      fontWeight: 700,
      letterSpacing: "0.04em",
      textTransform: "uppercase" as const,
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "transform 150ms cubic-bezier(0.34,1.56,0.64,1)",
    } as React.CSSProperties,

    submitButtonDisabled: {
      background: "var(--ink-5)",
      cursor: "not-allowed",
      opacity: 0.5,
    } as React.CSSProperties,

    finePrint: {
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      color: "var(--ink-5)",
      textAlign: "center" as const,
      lineHeight: 1.55,
      margin: 0,
    } as React.CSSProperties,

    /* Ghost button */
    ghostButton: {
      display: "inline-block",
      padding: "12px 24px",
      background: "transparent",
      color: "var(--ink)",
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "0.04em",
      textTransform: "uppercase" as const,
      border: "1px solid var(--ink)",
      borderRadius: "8px",
      cursor: "pointer",
      textDecoration: "none",
      marginTop: "8px",
      transition: "transform 150ms cubic-bezier(0.34,1.56,0.64,1)",
    } as React.CSSProperties,

    /* Success */
    successWrap: {
      maxWidth: "480px",
      margin: "0 auto",
      padding: "64px 24px",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      gap: "16px",
      textAlign: "center" as const,
    } as React.CSSProperties,

    // Green checkmark circle for success
    successIcon: {
      width: "72px",
      height: "72px",
      background: "var(--n2w-blue, #0085ff)",
      color: "var(--snow)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-display)",
      fontSize: "32px",
      fontWeight: 800,
      flexShrink: 0,
      borderRadius: "50%",
    } as React.CSSProperties,

    successTitle: {
      fontFamily: "var(--font-display)",
      fontSize: "40px",
      fontWeight: 800,
      color: "var(--ink)",
      letterSpacing: "-0.03em",
      margin: 0,
      lineHeight: 1.05,
    } as React.CSSProperties,

    successBody: {
      fontFamily: "var(--font-body)",
      fontSize: "18px",
      color: "var(--ink-3)",
      lineHeight: 1.55,
      maxWidth: "360px",
      margin: 0,
    } as React.CSSProperties,

    successCard: {
      width: "100%",
      background: "var(--surface-2)",
      border: "1px solid var(--mist)",
      borderRadius: "10px",
      padding: "24px",
      textAlign: "left" as const,
    } as React.CSSProperties,

    successCardLabel: {
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "0.08em",
      color: "var(--ink-4)",
      textTransform: "uppercase" as const,
      marginBottom: "12px",
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
      fontSize: "18px",
      color: "var(--ink-3)",
      lineHeight: 1.55,
      paddingLeft: "16px",
      position: "relative" as const,
    } as React.CSSProperties,

    loadingText: {
      fontFamily: "var(--font-body)",
      fontSize: "12px",
      color: "var(--ink-4)",
      letterSpacing: "0.04em",
      textTransform: "uppercase" as const,
    } as React.CSSProperties,
  } as const;

  /* ── Render guards ── */

  if (pageState === "loading") {
    return (
      <div style={S.centered}>
        <p style={S.loadingText}>Loading…</p>
      </div>
    );
  }

  if (pageState === "not-found") {
    return (
      <div style={S.centered}>
        <div style={S.stateCard}>
          <p style={{ ...S.stateEyebrow, color: "var(--brand-red)" }}>
            INVALID CODE
          </p>
          <h1 style={S.stateTitle}>QR code not found</h1>
          <p style={S.stateBody}>
            Please scan the QR code at the merchant location to get started.
          </p>
        </div>
      </div>
    );
  }

  if (pageState === "no-scan") {
    return (
      <div style={S.centered}>
        <div style={S.stateCard}>
          <p style={{ ...S.stateEyebrow, color: "var(--n2w-blue, #0085ff)" }}>
            SCAN FIRST
          </p>
          <h1 style={S.stateTitle}>Scan the QR code first</h1>
          <p style={S.stateBody}>
            You need to scan the campaign QR code before verifying your visit.
          </p>
          <button
            style={S.ghostButton}
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
      <div style={S.centered}>
        <div style={S.stateCard}>
          <p style={{ ...S.stateEyebrow, color: "var(--brand-red)" }}>
            {pageState === "qr-expired" ? "CAMPAIGN ENDED" : "WINDOW CLOSED"}
          </p>
          <h1 style={S.stateTitle}>
            {pageState === "qr-expired"
              ? "Campaign has ended"
              : "Verification window expired"}
          </h1>
          <p style={S.stateBody}>
            {pageState === "qr-expired"
              ? `This campaign is no longer active. Check ${qr?.businessName} for current offers.`
              : "The 24-hour verification window has passed. Visit the merchant again to start a new session."}
          </p>
          {pageState === "expired-window" && (
            <button
              style={S.ghostButton}
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
      <div style={S.page}>
        <header style={S.topBar}>
          <span style={S.topBarLogo}>PUSH</span>
          <span style={S.topBarTag}>Visit Confirmed</span>
        </header>

        <div style={S.successWrap}>
          {/* N2W Blue checkmark circle — success = secondary CTA color */}
          <div style={S.successIcon} aria-hidden="true">
            ✓
          </div>
          <h1 style={S.successTitle}>Visit verified!</h1>
          <p style={S.successBody}>
            Your visit to <strong>{qr?.businessName}</strong> has been recorded.
            {qr?.creatorName && (
              <> {qr.creatorName} gets credit for bringing you in.</>
            )}
          </p>

          <div style={S.successCard}>
            <p style={S.successCardLabel}>WHAT HAPPENS NEXT</p>
            <ul style={S.successList}>
              <li style={S.successListItem}>
                — Your proof is under review (usually instant)
              </li>
              <li style={S.successListItem}>
                — Creator earnings are updated within 24h
              </li>
              <li style={S.successListItem}>
                — Come back — your 30-day attribution window is active
              </li>
            </ul>
          </div>

          <Link href={`/scan/${qrId}`} style={S.ghostButton}>
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
    <div style={S.page}>
      <header style={S.topBar}>
        <button
          style={S.backButton}
          onClick={() => router.push(`/scan/${qrId}`)}
        >
          ← Back
        </button>
        <span style={S.topBarLogo}>PUSH</span>
        <span style={S.topBarTag}>Verify Visit</span>
      </header>

      <div style={S.content}>
        {/* Campaign reference */}
        {qr && (
          <div style={S.campaignRef}>
            <p style={S.campaignRefLabel}>CAMPAIGN</p>
            <p style={S.campaignRefTitle}>{qr.campaignTitle}</p>
            <p style={S.campaignRefBiz}>{qr.businessName}</p>
          </div>
        )}

        {/* Countdown — dark panel */}
        <div style={S.countdownCard}>
          <p style={S.countdownEyebrow}>VERIFICATION WINDOW</p>
          <div style={S.countdownRow}>
            <div style={S.countdownUnit}>
              <span style={S.countdownNum}>{pad(h)}</span>
              <span style={S.countdownLabel}>HR</span>
            </div>
            <span style={S.countdownSep}>:</span>
            <div style={S.countdownUnit}>
              <span style={S.countdownNum}>{pad(m)}</span>
              <span style={S.countdownLabel}>MIN</span>
            </div>
            <span style={S.countdownSep}>:</span>
            <div style={S.countdownUnit}>
              <span style={S.countdownNum}>{pad(s)}</span>
              <span style={S.countdownLabel}>SEC</span>
            </div>
          </div>
          {scanDate && (
            <p style={S.countdownNote}>
              Scanned at {scanDate} — expires in 24h
            </p>
          )}
        </div>

        {/* Evidence type selector */}
        <div style={S.section}>
          <p style={S.sectionLabel}>PROOF TYPE</p>
          <div style={S.typeRow}>
            {(["photo", "receipt", "screenshot"] as const).map((t) => (
              <button
                key={t}
                style={{
                  ...S.typeChip,
                  ...(evidenceType === t ? S.typeChipActive : {}),
                }}
                onClick={() => setEvidenceType(t)}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Drop zone / preview */}
        <div style={S.section}>
          <p style={S.sectionLabel}>UPLOAD EVIDENCE</p>

          {!preview ? (
            <div
              style={{
                ...S.dropZone,
                ...(dragOver ? S.dropZoneActive : {}),
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
              <p style={S.dropZoneIcon}>↑</p>
              <p style={S.dropZoneText}>
                Tap to upload or drag your{" "}
                {evidenceType === "photo"
                  ? "photo"
                  : evidenceType === "receipt"
                    ? "receipt"
                    : "screenshot"}
              </p>
              <p style={S.dropZoneHint}>JPG, PNG, HEIC — max 10MB</p>
            </div>
          ) : (
            <div style={S.previewWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Evidence preview" style={S.previewImg} />
              <div style={S.previewBar}>
                <p style={S.previewName}>{file?.name}</p>
                <button style={S.previewRemove} onClick={clearFile}>
                  REMOVE
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div style={S.instructions}>
          <p style={S.instructionsLabel}>WHAT TO UPLOAD</p>
          <ul style={S.instructionsList}>
            <li style={S.instructionsItem}>
              — A photo of your visit (food, drink, product, or location)
            </li>
            <li style={S.instructionsItem}>
              — A receipt or confirmation from {qr?.businessName}
            </li>
            <li style={S.instructionsItem}>
              — A screenshot of your Instagram story (if already posted)
            </li>
          </ul>
        </div>

        {/* Error */}
        {submitError && (
          <div style={S.errorBanner}>
            <p style={S.errorText}>{submitError}</p>
          </div>
        )}

        {/* Submit */}
        <button
          style={{
            ...S.submitButton,
            ...(!file || pageState === "submitting"
              ? S.submitButtonDisabled
              : {}),
          }}
          disabled={!file || pageState === "submitting"}
          onClick={handleSubmit}
          onMouseEnter={(e) => {
            if (!file || pageState === "submitting") return;
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translate(2px, 2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "none";
          }}
        >
          {pageState === "submitting" ? "SUBMITTING…" : "SUBMIT PROOF →"}
        </button>

        <p style={S.finePrint}>
          Submitting proof confirms your visit. False submissions may result in
          account restrictions.
        </p>
      </div>
    </div>
  );
}
