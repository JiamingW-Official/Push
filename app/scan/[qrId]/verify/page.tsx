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
import "./verify.css";

/* ── Constants ─────────────────────────────────────────────── */

const VERIFY_WINDOW_MS = 24 * 60 * 60 * 1000; // 24h

// Stack step timings (ms) — total ~7s
const STEP_TIMINGS = [
  { key: "ocr", label: "OCR parsing · Claude Vision", duration: 2400 },
  { key: "geo", label: "Geo-fence check · within 200m", duration: 1800 },
  { key: "match", label: "Cross-match QR ↔ receipt merchant", duration: 1400 },
  { key: "disclosure", label: "DisclosureBot scrape", duration: 1400 },
] as const;

type StepKey = (typeof STEP_TIMINGS)[number]["key"];
type Verdict =
  | "auto_verified"
  | "manual_review"
  | "auto_rejected"
  | "human_approved"
  | "human_rejected";

/* ── Page state ────────────────────────────────────────────── */

type PageState =
  | "loading"
  | "no-scan"
  | "expired-window"
  | "qr-expired"
  | "not-found"
  | "ready"
  | "processing"
  | "verdict";

/* ── Component ─────────────────────────────────────────────── */

export default function VerifyPage() {
  const params = useParams();
  const router = useRouter();
  const qrId = params.qrId as string;

  const [qr, setQr] = useState<MockQRCode | null>(null);
  const [pageState, setPageState] = useState<PageState>("loading");

  // Receipt upload
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ConversionOracle stack animation state
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [completedSteps, setCompletedSteps] = useState<StepKey[]>([]);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [payout, setPayout] = useState<number>(0);

  // Appeal state
  const [appealText, setAppealText] = useState<string>("");
  const [appealSubmitted, setAppealSubmitted] = useState(false);

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
    const remaining = VERIFY_WINDOW_MS - (Date.now() - new Date(ts).getTime());
    if (remaining <= 0) {
      setQr(code);
      setPageState("expired-window");
      return;
    }
    setQr(code);
    setPageState("ready");
  }, [qrId]);

  /* ── File handling ── */
  const handleFile = useCallback((f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const clearFile = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── Kick off ConversionOracle stack ── */
  const runOracle = useCallback(() => {
    if (!file || !qr) return;
    setPageState("processing");
    setActiveStep(0);
    setCompletedSteps([]);

    let accumulated = 0;
    STEP_TIMINGS.forEach((step, idx) => {
      accumulated += step.duration;
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, step.key]);
        if (idx < STEP_TIMINGS.length - 1) {
          setActiveStep(idx + 1);
        }
      }, accumulated);
    });

    // After all steps complete, resolve verdict
    const total = STEP_TIMINGS.reduce((s, x) => s + x.duration, 0) + 400;
    setTimeout(() => {
      // Demo logic: random weighted verdict
      // 75% auto_verified / 15% manual_review / 10% auto_rejected
      const roll = Math.random();
      let v: Verdict;
      if (roll < 0.75) v = "auto_verified";
      else if (roll < 0.9) v = "manual_review";
      else v = "auto_rejected";

      setVerdict(v);
      setPayout(qr.payout > 0 ? qr.payout : 4);
      setPageState("verdict");

      // Fire attribution track (fire-and-forget — file-less demo)
      if (v === "auto_verified") {
        trackVerify(qrId, {
          campaignId: qr.campaignId,
          creatorId: qr.creatorId,
          merchantId: qr.merchantId,
          evidenceType: "receipt",
        }).catch(() => {});
      }
    }, total);
  }, [file, qr, qrId]);

  /* ── Reset to ready (retry/appeal resubmit) ── */
  const resetAndRetry = () => {
    clearFile();
    setActiveStep(-1);
    setCompletedSteps([]);
    setVerdict(null);
    setAppealText("");
    setAppealSubmitted(false);
    setPageState("ready");
  };

  /* ── Appeal submit ── */
  const submitAppeal = () => {
    if (appealText.trim().length < 10) return;
    setAppealSubmitted(true);
  };

  /* ── Error states ── */
  if (pageState === "loading") {
    return (
      <main className="vf-page vf-page--state">
        <div className="vf-state">
          <p className="vf-state__eyebrow">PUSH · CONVERSIONORACLE™</p>
          <p className="vf-state__body">Loading…</p>
        </div>
      </main>
    );
  }

  if (pageState === "not-found") {
    return (
      <main className="vf-page vf-page--state">
        <div className="vf-state">
          <p className="vf-state__eyebrow vf-state__eyebrow--alert">
            INVALID CODE
          </p>
          <h1 className="vf-state__headline">Code not found.</h1>
          <p className="vf-state__body">
            Scan the QR decal at the merchant counter to start your visit.
          </p>
        </div>
      </main>
    );
  }

  if (pageState === "no-scan" && qr) {
    return (
      <main className="vf-page vf-page--state">
        <div className="vf-state">
          <p className="vf-state__eyebrow">SCAN FIRST</p>
          <h1 className="vf-state__headline">Scan the QR first.</h1>
          <p className="vf-state__body">
            ConversionOracle™ needs a fresh scan to bind your visit to{" "}
            {qr.businessName}.
          </p>
          <button
            type="button"
            className="vf-btn vf-btn--ghost"
            onClick={() => router.push(`/scan/${qrId}`)}
          >
            Go to campaign page
          </button>
        </div>
      </main>
    );
  }

  if (pageState === "qr-expired" || pageState === "expired-window") {
    return (
      <main className="vf-page vf-page--state">
        <div className="vf-state">
          <p className="vf-state__eyebrow vf-state__eyebrow--alert">
            {pageState === "qr-expired" ? "CAMPAIGN ENDED" : "WINDOW CLOSED"}
          </p>
          <h1 className="vf-state__headline">
            {pageState === "qr-expired"
              ? "Campaign is no longer live."
              : "Verification window expired."}
          </h1>
          <p className="vf-state__body">
            {pageState === "qr-expired"
              ? `${qr?.businessName} wrapped this campaign. Stop by and ask about the next one.`
              : "The 24-hour verification window has closed. Re-scan at the counter to start a new session."}
          </p>
          <button
            type="button"
            className="vf-btn vf-btn--ghost"
            onClick={() => router.push(`/scan/${qrId}`)}
          >
            Start again
          </button>
        </div>
      </main>
    );
  }

  /* ── Ready / processing / verdict ── */
  return (
    <main className="vf-page">
      {/* Top bar */}
      <header className="vf-top">
        <button
          type="button"
          className="vf-top__back"
          onClick={() => router.push(`/scan/${qrId}`)}
          aria-label="Back to campaign"
        >
          ← Back
        </button>
        <span className="vf-top__logo">PUSH</span>
        <span className="vf-top__tag">ConversionOracle™</span>
      </header>

      {/* Context header */}
      {qr && pageState !== "verdict" && (
        <section className="vf-context">
          <p className="vf-section__label">VERIFYING VISIT AT</p>
          <p className="vf-context__name">{qr.businessName}</p>
          <p className="vf-context__meta">
            {qr.campaignTitle} · @{qr.creatorHandle}
          </p>
        </section>
      )}

      {/* READY — upload form */}
      {pageState === "ready" && (
        <>
          <section className="vf-intro">
            <h1 className="vf-intro__headline">
              Upload your receipt
              <br />
              to complete.
            </h1>
            <p className="vf-intro__sub">
              ConversionOracle™ runs a 3-layer check — Claude Vision OCR,
              geo-fence, and QR ↔ receipt cross-match. Median verdict under 8
              seconds.
            </p>
          </section>

          <section className="vf-upload">
            {!preview ? (
              <label className="vf-upload__zone" htmlFor="vf-receipt-input">
                <input
                  ref={fileInputRef}
                  id="vf-receipt-input"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={onFileChange}
                  className="vf-upload__input"
                />
                <div className="vf-upload__icon" aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12M12 4l-4 4M12 4l4 4"
                      stroke="#003049"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="vf-upload__primary">
                  Tap to capture your receipt
                </p>
                <p className="vf-upload__hint">
                  Camera opens by default · library fallback available
                </p>
              </label>
            ) : (
              <div className="vf-upload__preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Receipt preview" />
                <div className="vf-upload__bar">
                  <span className="vf-upload__file">{file?.name}</span>
                  <button
                    type="button"
                    className="vf-upload__remove"
                    onClick={clearFile}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              className="vf-btn vf-btn--primary"
              disabled={!file}
              onClick={runOracle}
            >
              Run ConversionOracle™ →
            </button>

            <p className="vf-upload__notes">
              Receipts are parsed by Claude Vision. We never sell your data.
              Walk-in ground truth fuels creator payouts and merchant
              attribution.
            </p>
          </section>
        </>
      )}

      {/* PROCESSING — stack animation */}
      {pageState === "processing" && (
        <section className="vf-oracle">
          <div className="vf-oracle__head">
            <p className="vf-section__label">CONVERSIONORACLE™ STACK</p>
            <p className="vf-oracle__title">Verifying walk-in ground truth</p>
            <p className="vf-oracle__sub">
              3-layer check · median under 8 seconds
            </p>
          </div>

          {preview && (
            <div className="vf-oracle__thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Receipt" />
              <div className="vf-oracle__scan" aria-hidden="true" />
            </div>
          )}

          <ol className="vf-steps" aria-live="polite">
            {STEP_TIMINGS.map((step, idx) => {
              const done = completedSteps.includes(step.key);
              const active = activeStep === idx && !done;
              return (
                <li
                  key={step.key}
                  className={[
                    "vf-steps__item",
                    active && "is-active",
                    done && "is-done",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className="vf-steps__num" aria-hidden="true">
                    {done ? (
                      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path
                          d="M1 4L4 7.5L10 1"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      idx + 1
                    )}
                  </span>
                  <span className="vf-steps__label">{step.label}</span>
                  <span className="vf-steps__spinner" aria-hidden="true" />
                </li>
              );
            })}
          </ol>

          <p className="vf-oracle__foot">
            Receipts parsed by Claude Vision OCR · geo anchored to merchant
            location
          </p>
        </section>
      )}

      {/* VERDICT */}
      {pageState === "verdict" && verdict && qr && (
        <section className="vf-verdict">
          {verdict === "auto_verified" && (
            <div className="vf-verdict__panel vf-verdict__panel--ok">
              <div className="vf-verdict__confetti" aria-hidden="true">
                {[...Array(14)].map((_, i) => (
                  <span
                    key={i}
                    className="vf-verdict__bit"
                    style={{
                      ["--i" as unknown as string]: i,
                    }}
                  />
                ))}
              </div>
              <div className="vf-verdict__mark vf-verdict__mark--ok">
                <svg width="44" height="36" viewBox="0 0 11 9" fill="none">
                  <path
                    d="M1 4L4 7.5L10 1"
                    stroke="#c9a96e"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="vf-verdict__tag">AUTO-VERIFIED</p>
              <h1 className="vf-verdict__headline">Verified.</h1>
              <p className="vf-verdict__sub">
                Walk-in ground truth logged · {qr.creatorName} earned{" "}
                <strong>${payout.toFixed(2)}</strong>
              </p>
              <div className="vf-verdict__stack">
                {STEP_TIMINGS.map((step) => (
                  <div key={step.key} className="vf-verdict__row">
                    <span className="vf-verdict__check">
                      <svg width="10" height="8" viewBox="0 0 11 9" fill="none">
                        <path
                          d="M1 4L4 7.5L10 1"
                          stroke="#003049"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {step.label}
                  </div>
                ))}
              </div>
              <Link href={`/scan/${qrId}`} className="vf-btn vf-btn--ghost">
                Back to campaign
              </Link>
            </div>
          )}

          {verdict === "manual_review" && (
            <div className="vf-verdict__panel vf-verdict__panel--review">
              <div className="vf-verdict__mark vf-verdict__mark--review">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="#669bbc"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 7v5l3 2"
                    stroke="#669bbc"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="vf-verdict__tag vf-verdict__tag--review">
                MANUAL REVIEW
              </p>
              <h1 className="vf-verdict__headline">Under review.</h1>
              <p className="vf-verdict__sub">
                One of the three layers came back borderline — a human reviewer
                will take a look. We&apos;ll notify you within 24 hours.
              </p>
              <div className="vf-verdict__stack">
                <div className="vf-verdict__row is-ok">
                  <span className="vf-verdict__check">✓</span> OCR parse matched
                </div>
                <div className="vf-verdict__row is-warn">
                  <span className="vf-verdict__check">?</span> Geo signal weak —
                  outside 200m radius
                </div>
                <div className="vf-verdict__row is-ok">
                  <span className="vf-verdict__check">✓</span> QR ↔ receipt
                  cross-match passed
                </div>
              </div>
              <Link href={`/scan/${qrId}`} className="vf-btn vf-btn--ghost">
                Back to campaign
              </Link>
            </div>
          )}

          {verdict === "auto_rejected" && (
            <div className="vf-verdict__panel vf-verdict__panel--reject">
              <div className="vf-verdict__mark vf-verdict__mark--reject">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="#c1121f"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M9 9l6 6M15 9l-6 6"
                    stroke="#c1121f"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="vf-verdict__tag vf-verdict__tag--reject">
                AUTO-REJECTED
              </p>
              <h1 className="vf-verdict__headline">Couldn&apos;t verify.</h1>
              <p className="vf-verdict__sub">
                The receipt didn&apos;t match our ground truth. Try again, or
                appeal if you believe this is wrong.
              </p>
              <div className="vf-verdict__stack">
                <div className="vf-verdict__row is-fail">
                  <span className="vf-verdict__check">×</span> OCR didn&apos;t
                  find a {qr.businessName} header
                </div>
                <div className="vf-verdict__row is-ok">
                  <span className="vf-verdict__check">✓</span> Geo signal ok
                </div>
                <div className="vf-verdict__row is-fail">
                  <span className="vf-verdict__check">×</span> Cross-match
                  failed · merchant mismatch
                </div>
              </div>

              {!appealSubmitted ? (
                <form
                  className="vf-appeal"
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitAppeal();
                  }}
                >
                  <label className="vf-appeal__label" htmlFor="vf-appeal-text">
                    APPEAL · EXPLAIN WHAT HAPPENED
                  </label>
                  <textarea
                    id="vf-appeal-text"
                    className="vf-appeal__text"
                    rows={4}
                    placeholder="I visited at 2:15pm and ordered a latte. The barista didn't print a header on my receipt…"
                    value={appealText}
                    onChange={(e) => setAppealText(e.target.value)}
                    required
                    minLength={10}
                  />
                  <div className="vf-appeal__row">
                    <button
                      type="button"
                      className="vf-btn vf-btn--ghost"
                      onClick={resetAndRetry}
                    >
                      Try again
                    </button>
                    <button
                      type="submit"
                      className="vf-btn vf-btn--primary"
                      disabled={appealText.trim().length < 10}
                    >
                      Submit appeal →
                    </button>
                  </div>
                </form>
              ) : (
                <div className="vf-appeal vf-appeal--submitted">
                  <p className="vf-appeal__tag">APPEAL RECEIVED</p>
                  <p className="vf-appeal__confirm">
                    A reviewer will respond within 24h. You&apos;ll get an email
                    when a decision is logged.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      <footer className="vf-foot">
        <p>
          Push · Vertical AI for Local Commerce · ConversionOracle™ walk-in
          verification
        </p>
      </footer>
    </main>
  );
}
