"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getQRCode,
  isQRExpired,
  heroSlotsRemaining,
  type MockQRCode,
} from "@/lib/attribution/mock-qr-codes";
import { trackScan, hasScannedThisSession } from "@/lib/attribution/track";
import "./scan.css";

/* ── Helpers ───────────────────────────────────────────────── */

function formatExpiry(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function todayHours(): string {
  // Mock hours — merchant data does not include daily hours in demo schema
  return "Open today · 7:00am – 6:00pm";
}

function directionsHref(qr: MockQRCode): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${qr.lat},${qr.lng}`;
}

/* ── Component ─────────────────────────────────────────────── */

export default function ScanLandingPage() {
  const params = useParams();
  const router = useRouter();
  const qrId = params.qrId as string;

  const [qr, setQr] = useState<MockQRCode | null>(null);
  const [status, setStatus] = useState<
    "loading" | "found" | "not-found" | "expired"
  >("loading");
  const [scanRecorded, setScanRecorded] = useState(false);
  const trackFired = useRef(false);

  useEffect(() => {
    const code = getQRCode(qrId);
    if (!code) {
      setStatus("not-found");
      return;
    }
    if (isQRExpired(code)) {
      setStatus("expired");
      setQr(code);
      return;
    }
    setQr(code);
    setStatus("found");

    if (!trackFired.current && !hasScannedThisSession(qrId)) {
      trackFired.current = true;
      trackScan(qrId, {
        campaignId: code.campaignId,
        creatorId: code.creatorId,
        merchantId: code.merchantId,
      }).then(() => setScanRecorded(true));
    } else {
      setScanRecorded(true);
    }
  }, [qrId]);

  /* ── Loading ── */
  if (status === "loading") {
    return (
      <main className="scan-page scan-page--state">
        <div className="scan-state">
          <p className="scan-state__eyebrow">PUSH · CONVERSIONORACLE™</p>
          <p className="scan-state__headline">Verifying QR code…</p>
        </div>
      </main>
    );
  }

  /* ── Invalid QR ── */
  if (status === "not-found") {
    return (
      <main className="scan-page scan-page--state">
        <div className="scan-state">
          <p className="scan-state__eyebrow scan-state__eyebrow--alert">
            INVALID CODE
          </p>
          <h1 className="scan-state__headline">This code didn&apos;t match.</h1>
          <p className="scan-state__body">
            The QR you scanned is stale or not registered with Push. Point your
            camera at the decal on the merchant counter and try once more.
          </p>
          <button
            type="button"
            className="scan-btn scan-btn--ghost"
            onClick={() => window.location.reload()}
          >
            Scan again
          </button>
        </div>
      </main>
    );
  }

  /* ── Expired ── */
  if (status === "expired" && qr) {
    return (
      <main className="scan-page scan-page--state">
        <div className="scan-state">
          <p className="scan-state__eyebrow scan-state__eyebrow--alert">
            CAMPAIGN ENDED
          </p>
          <h1 className="scan-state__headline">{qr.businessName} wrapped.</h1>
          <p className="scan-state__body">
            This campaign ended {formatExpiry(qr.expiresAt)}. The shop may still
            be running new offers — stop in and ask, or check back on Push.
          </p>
          <Link href="/" className="scan-btn scan-btn--ghost">
            What is Push?
          </Link>
        </div>
      </main>
    );
  }

  if (!qr) return null;

  const heroLeft = heroSlotsRemaining(qr);
  const heroExhausted = heroLeft === 0;

  /* ── Main success state ── */
  return (
    <main className="scan-page">
      {/* Top strip */}
      <header className="scan-top">
        <span className="scan-top__logo">PUSH</span>
        <span className="scan-top__tag">ConversionOracle™</span>
      </header>

      {/* QR registered banner */}
      <div
        className={`scan-registered ${scanRecorded ? "is-shown" : ""}`}
        role="status"
        aria-live="polite"
      >
        <span className="scan-registered__check" aria-hidden="true">
          <svg width="12" height="10" viewBox="0 0 11 9" fill="none">
            <path
              d="M1 4L4 7.5L10 1"
              stroke="#c9a96e"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="scan-registered__text">
          Scan registered · referred by <strong>@{qr.creatorHandle}</strong>
        </span>
      </div>

      {/* Hero */}
      <section className="scan-hero">
        <p className="scan-hero__eyebrow">PUSH · CONVERSIONORACLE™</p>
        <h1 className="scan-hero__headline">
          Welcome to
          <br />
          {qr.businessName}.
        </h1>
        <p className="scan-hero__sub">
          Your visit is the ground truth behind every creator payout. Push is
          the Customer Acquisition Engine for local Coffee+ — ConversionOracle™
          verifies walk-ins to close the attribution loop.
        </p>
      </section>

      {/* Active promo — Hero + Sustained */}
      <section className="scan-offers">
        <p className="scan-section__label">ACTIVE PROMO</p>

        <div
          className={`scan-offer scan-offer--hero ${heroExhausted ? "is-dimmed" : ""}`}
        >
          <div className="scan-offer__head">
            <span className="scan-offer__tag">HERO OFFER</span>
            <span className="scan-offer__count">
              {heroExhausted ? "CLAIMED" : `${heroLeft} LEFT`}
            </span>
          </div>
          <p className="scan-offer__text">{qr.offerTier1}</p>
          {!heroExhausted && (
            <p className="scan-offer__meta">
              First {qr.heroSlotsTotal} customers · ends{" "}
              {formatExpiry(qr.expiresAt)}
            </p>
          )}
        </div>

        <div className="scan-offer scan-offer--sustained">
          <div className="scan-offer__head">
            <span className="scan-offer__tag scan-offer__tag--muted">
              SUSTAINED OFFER
            </span>
            <span className="scan-offer__count scan-offer__count--muted">
              ALWAYS ON
            </span>
          </div>
          <p className="scan-offer__text">{qr.offerTier2}</p>
        </div>
      </section>

      {/* Primary CTA — Verify visit */}
      <section className="scan-cta">
        <button
          type="button"
          className="scan-btn scan-btn--primary"
          onClick={() => router.push(`/scan/${qrId}/verify`)}
        >
          Verify your visit →
        </button>
        <Link href="/" className="scan-btn scan-btn--ghost">
          What is Push?
        </Link>
      </section>

      {/* Shop details */}
      <section className="scan-shop">
        <p className="scan-section__label">THE SHOP</p>
        <div className="scan-shop__row">
          <span className="scan-shop__key">Hours</span>
          <span className="scan-shop__val">{todayHours()}</span>
        </div>
        <div className="scan-shop__row">
          <span className="scan-shop__key">Address</span>
          <span className="scan-shop__val">{qr.businessAddress}</span>
        </div>
        <div className="scan-shop__row">
          <span className="scan-shop__key">Category</span>
          <span className="scan-shop__val">{qr.category}</span>
        </div>
        <a
          className="scan-shop__directions"
          href={directionsHref(qr)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get directions →
        </a>
      </section>

      {/* Creator attribution */}
      <section className="scan-creator">
        <div className="scan-creator__avatar" aria-hidden="true">
          {qr.creatorName.charAt(0).toUpperCase()}
        </div>
        <div className="scan-creator__body">
          <p className="scan-creator__label">Brought to you by</p>
          <p className="scan-creator__name">{qr.creatorName}</p>
          <p className="scan-creator__handle">@{qr.creatorHandle}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="scan-foot">
        <p className="scan-foot__line">
          Vertical AI for Local Commerce · Customer Acquisition Engine
        </p>
        <Link href="/" className="scan-foot__link">
          push.how
        </Link>
      </footer>
    </main>
  );
}
