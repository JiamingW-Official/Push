"use client";

/* ============================================================
   /scan/[qrId] — consumer-facing QR landing page
   v3 · 2026-05-10 — 3-screen flow:
     1. Welcome coupon ticket (with tear animation)
     2. ACTIVATED! — 6-digit code + 2:30 countdown
     3. Enjoy! — success + share
   ============================================================ */

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, ShoppingCart, MapPin } from "lucide-react";
import "./scan.css";
import {
  getQRCode,
  isQRExpired,
  heroSlotsRemaining,
  type MockQRCode,
} from "@/lib/attribution/mock-qr-codes";
import { trackScan, hasScannedThisSession } from "@/lib/attribution/track";
import {
  getConsentTier,
  setConsentTier,
  type ConsentTier,
} from "@/lib/attribution/consent";

/* ── Helpers ─────────────────────────────────────────────────── */

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function generateCode(qrId: string): string {
  const epoch = Math.floor(Date.now() / 150_000); // rotates every 2.5 min
  const seed = qrId + String(epoch);
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return ((Math.abs(h) % 900000) + 100000).toString();
}

function fmtEnjoyTime(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

/* ── SVG barcode (deterministic from campaignId) ─────────────── */
function Barcode({ id, color = "#1a1916" }: { id: string; color?: string }) {
  let x = 0;
  const bars: { x: number; w: number; h: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const w = 1 + (id.charCodeAt(i % id.length) % 3);
    const h = 26 + (id.charCodeAt((i * 3) % id.length) % 18);
    bars.push({ x, w, h });
    x += w + 1.5;
  }
  return (
    <svg
      width={Math.ceil(x)}
      height={48}
      viewBox={`0 0 ${Math.ceil(x)} 48`}
      aria-hidden
      style={{ display: "block" }}
    >
      {bars.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={48 - b.h}
          width={b.w}
          height={b.h}
          fill={color}
          rx={0.3}
        />
      ))}
    </svg>
  );
}

/* ── 3-screen phase type ─────────────────────────────────────── */
type ScanPhase = "welcome" | "tearing" | "activated" | "enjoy";
type QRStatus = "loading" | "found" | "not-found" | "expired";

/* ══════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════ */

export default function ScanLandingPage() {
  const params = useParams();
  const qrId = params.qrId as string;

  /* QR data */
  const [qr, setQr] = useState<MockQRCode | null>(null);
  const [qrStatus, setQrStatus] = useState<QRStatus>("loading");
  const [scanRecorded, setScanRecorded] = useState(false);
  const trackFired = useRef(false);

  /* 3-screen state */
  const [phase, setPhase] = useState<ScanPhase>("welcome");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(150); // 2:30
  const [enjoyTs, setEnjoyTs] = useState("");

  /* Consent (kept for attribution compliance) */
  const [consentTier, setConsentTierState] = useState<ConsentTier>(2);

  useEffect(() => {
    setConsentTierState(getConsentTier(qrId));
  }, [qrId]);

  /* QR lookup ── client-side mock first, then API fallback */
  useEffect(() => {
    function applyCode(qrCode: MockQRCode) {
      if (isQRExpired(qrCode)) {
        setQrStatus("expired");
        setQr(qrCode);
        return;
      }
      setQr(qrCode);
      setQrStatus("found");
      if (!trackFired.current && !hasScannedThisSession(qrId)) {
        trackFired.current = true;
        trackScan(qrId, {
          campaignId: qrCode.campaignId,
          creatorId: qrCode.creatorId,
          merchantId: qrCode.merchantId,
        })
          .then(() => setScanRecorded(true))
          .catch(() => setScanRecorded(true));
      } else {
        setScanRecorded(true);
      }
    }

    const localCode = getQRCode(qrId);
    if (localCode) {
      applyCode(localCode);
      return;
    }
    fetch(`/api/scan-context?qrId=${encodeURIComponent(qrId)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(({ qr: serverQr }: { qr: MockQRCode }) => applyCode(serverQr))
      .catch(() => setQrStatus("not-found"));
  }, [qrId]);

  /* Countdown while ACTIVATED */
  useEffect(() => {
    if (phase !== "activated") return;
    if (countdown <= 0) {
      setEnjoyTs(fmtEnjoyTime());
      setPhase("enjoy");
      return;
    }
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [phase, countdown]);

  /* Claim → tear animation → ACTIVATED */
  function handleClaim() {
    const c = generateCode(qrId);
    setCode(c);
    setConsentTier(qrId, consentTier); // persist consent
    setPhase("tearing");
    setTimeout(() => setPhase("activated"), 720);
  }

  function handleDone() {
    setEnjoyTs(fmtEnjoyTime());
    setPhase("enjoy");
  }

  /* ── LOADING ── */
  if (qrStatus === "loading") {
    return (
      <div className="sc-center sc-center--cream">
        <p className="sc-logo-text">PUSH</p>
        <div className="sc-spinner" role="status" aria-label="Loading" />
      </div>
    );
  }

  /* ── ERROR: not found ── */
  if (qrStatus === "not-found") {
    return (
      <div className="sc-center sc-center--cream">
        <div className="sc-err-card">
          <p className="sc-err-eye">INVALID CODE</p>
          <h1 className="sc-err-title">QR code not found</h1>
          <p className="sc-err-body">Ask your creator for the correct link.</p>
          <Link href="/" className="sc-err-link">
            ← Back to Push
          </Link>
        </div>
      </div>
    );
  }

  /* ── ERROR: expired ── */
  if (qrStatus === "expired" && qr) {
    return (
      <div className="sc-center sc-center--cream">
        <div className="sc-err-card">
          <p className="sc-err-eye">CAMPAIGN ENDED</p>
          <h1 className="sc-err-title">{qr.campaignTitle}</h1>
          <p className="sc-err-body">This campaign has ended.</p>
          <Link href="/" className="sc-err-link">
            ← Back to Push
          </Link>
        </div>
      </div>
    );
  }

  if (!qr) return null;

  const heroLeft = heroSlotsRemaining(qr);
  const heroExhausted = heroLeft === 0;
  const offerText = heroExhausted ? qr.offerTier2 : qr.offerTier1;
  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;

  /* ════════════════════════════════════════════════════════════
     SCREEN 3 — Enjoy!
     ════════════════════════════════════════════════════════════ */
  if (phase === "enjoy") {
    return (
      <div className="sc-page sc-page--white">
        {/* Top bar */}
        <div className="sc-top-bar">
          <span className="sc-top-wordmark">PUSH</span>
        </div>

        <div className="sc-enjoy-wrap">
          {/* Card fan */}
          <div className="sc-fan" aria-hidden>
            <div className="sc-fan__card sc-fan__card--a" />
            <div className="sc-fan__card sc-fan__card--b" />
            <div className="sc-fan__card sc-fan__card--c" />
          </div>

          <Link href="/" className="sc-discover-link">
            &rsaquo; Discover more nearby
          </Link>

          <h1 className="sc-enjoy-title">Enjoy!</h1>
          <p className="sc-enjoy-meta">
            {qr.businessName} · {enjoyTs}
          </p>

          <button
            className="sc-share-btn"
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({ title: qr.campaignTitle, url: window.location.href })
                  .catch(() => {});
              }
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden
            >
              <path
                d="M10 2v11M10 2L7 5M10 2l3 3"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 9H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-1"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
            Share
          </button>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════
     SCREEN 2 — ACTIVATED!
     ════════════════════════════════════════════════════════════ */
  if (phase === "activated") {
    return (
      <div className="sc-page sc-page--dark sc-activated-in">
        {/* Top bar */}
        <div className="sc-top-bar">
          <span className="sc-top-wordmark">PUSH</span>
        </div>

        <div className="sc-activated-wrap">
          <h1 className="sc-activated-title">ACTIVATED!</h1>
          <p className="sc-activated-sub">{offerText.toUpperCase()}</p>

          {/* Big code box */}
          <div
            className="sc-code-box"
            aria-label={`Redemption code ${code}`}
            role="text"
          >
            {code}
          </div>

          {/* Countdown */}
          <div className="sc-cdown">
            <div className="sc-cdown__time">
              {pad2(mins)}&nbsp;:&nbsp;{pad2(secs)}
            </div>
            <div className="sc-cdown__label">Remaining</div>
          </div>

          <p className="sc-activated-creator">via @{qr.creatorHandle}</p>
          <p className="sc-activated-biz">{qr.businessName}</p>

          <button className="sc-done-btn" onClick={handleDone}>
            Done →
          </button>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════
     SCREEN 1 — Welcome coupon ticket
     (phase === "welcome" | "tearing")
     ════════════════════════════════════════════════════════════ */
  return (
    <div className="sc-page sc-page--cream">
      {/* FTC disclosure */}
      <div className="sc-ftc" role="note">
        <span className="sc-ftc__tag">#ad</span>
        <span className="sc-ftc__text">
          Paid partnership with {qr.businessName} · FTC §255
        </span>
      </div>

      <div className="sc-coupon-wrap">
        <div className="sc-coupon">
          {/* ── LEFT: Main offer body ──────────────────── */}
          <div className="sc-coupon__main">
            {/* Decorative shopping icons */}
            <ShoppingBag
              className="sc-deco sc-deco--bag"
              size={52}
              strokeWidth={1.4}
              aria-hidden
            />
            <ShoppingCart
              className="sc-deco sc-deco--cart"
              size={44}
              strokeWidth={1.25}
              aria-hidden
            />

            {/* Creator credit row */}
            <div className="sc-coupon__creator">
              <div className="sc-coupon__creator-av" aria-hidden>
                {qr.creatorName.charAt(0).toUpperCase()}
              </div>
              <div className="sc-coupon__creator-info">
                <p className="sc-coupon__creator-handle">@{qr.creatorHandle}</p>
                <p className="sc-coupon__creator-ref">
                  Referred by {qr.creatorName}
                </p>
              </div>
            </div>

            {/* Offer text */}
            <div className="sc-coupon__offer">
              <p className="sc-coupon__offer-eye">SPECIAL OFFER</p>
              <h1 className="sc-coupon__offer-title">{offerText}</h1>
            </div>

            {/* Location */}
            <div className="sc-coupon__loc">
              <MapPin
                size={15}
                strokeWidth={2}
                aria-hidden
                className="sc-coupon__loc-pin"
              />
              <span className="sc-coupon__loc-biz">{qr.businessName}</span>
              {qr.businessAddress && (
                <span className="sc-coupon__loc-addr">
                  &nbsp;{qr.businessAddress}
                </span>
              )}
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(qr.businessName + " " + qr.businessAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="sc-coupon__loc-map"
              >
                &rsaquo; View on Map
              </a>
            </div>
          </div>

          {/* ── PERFORATION ───────────────────────────── */}
          <div className="sc-coupon__perf" aria-hidden />

          {/* ── RIGHT: Stub ───────────────────────────── */}
          <button
            type="button"
            className={`sc-coupon__stub${phase === "tearing" ? " is-tearing" : ""}`}
            onClick={handleClaim}
            aria-label="Reveal your offer"
          >
            {/* PUSH mini logo */}
            <div className="sc-coupon__stub-brand">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2 10V2h3a2.5 2.5 0 010 5H2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              PUSH
            </div>

            {/* Vertical badge text */}
            <div className="sc-coupon__stub-badge">
              {heroExhausted ? "STANDARD" : "HERO OFFER"}
            </div>

            {/* Spot count */}
            <div className="sc-coupon__stub-spots">
              {heroExhausted
                ? "Standard offer"
                : `${heroLeft} of ${qr.heroSlotsTotal} spot${qr.heroSlotsTotal !== 1 ? "s" : ""} left`}
            </div>

            {/* Barcode */}
            <div className="sc-coupon__barcode">
              <Barcode id={qr.campaignId} color="rgba(255,255,255,0.65)" />
            </div>

            {/* Tap hint */}
            <span className="sc-coupon__tap-hint">Tap to reveal</span>
          </button>
        </div>
      </div>

      {/* Scan recorded indicator */}
      {scanRecorded && (
        <p className="sc-scan-note" role="status">
          ✓ Visit logged via @{qr.creatorHandle}
        </p>
      )}
    </div>
  );
}
