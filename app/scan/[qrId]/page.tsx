"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
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
import ConsentPicker from "@/components/customer/ConsentPicker";

// Leaflet map loaded client-side only
const MapView = dynamic(() => import("@/components/layout/MapView"), {
  ssr: false,
  loading: () => (
    <div
      style={{ width: "100%", height: "100%", background: "var(--surface)" }}
    />
  ),
});

/* ── Helpers ───────────────────────────────────────────────── */

function formatExpiry(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getCategoryIcon(category: string): string {
  const map: Record<string, string> = {
    Coffee: "☕",
    Food: "🍽",
    Beauty: "✨",
    Retail: "🛍",
    Fitness: "💪",
    Lifestyle: "🌿",
  };
  return map[category] ?? "📍";
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
  const [consentTier, setConsentTierState] = useState<ConsentTier>(2);
  const trackFired = useRef(false);

  useEffect(() => {
    setConsentTierState(getConsentTier(qrId));
  }, [qrId]);

  const handleConsentChange = (tier: ConsentTier) => {
    setConsentTierState(tier);
    setConsentTier(qrId, tier);
  };

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

    // Fire scan tracking once per session to avoid duplicate events on re-renders
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
      <div style={styles.centered}>
        <p style={styles.loadingText}>Verifying QR code…</p>
      </div>
    );
  }

  /* ── Not found ── */
  if (status === "not-found") {
    return (
      <div style={styles.centered}>
        <div style={styles.errorCard}>
          <p style={styles.errorEyebrow}>INVALID CODE</p>
          <h1 style={styles.errorTitle}>QR code not found</h1>
          <p style={styles.errorBody}>
            This QR code doesn&apos;t match any active campaign. Please ask your
            creator for the correct link.
          </p>
        </div>
      </div>
    );
  }

  /* ── Expired ── */
  if (status === "expired" && qr) {
    return (
      <div style={styles.centered}>
        <div style={styles.errorCard}>
          <p style={styles.errorEyebrow}>CAMPAIGN ENDED</p>
          <h1 style={styles.errorTitle}>{qr.campaignTitle}</h1>
          <p style={styles.errorBody}>
            This campaign ended on {formatExpiry(qr.expiresAt)}. Check{" "}
            <strong>{qr.businessName}</strong> for current offers.
          </p>
        </div>
      </div>
    );
  }

  if (!qr) return null;

  const heroLeft = heroSlotsRemaining(qr);
  const heroExhausted = heroLeft === 0;

  return (
    <div style={styles.page}>
      {/* ── Top bar ── */}
      <header style={styles.topBar}>
        <span style={styles.topBarLogo}>PUSH</span>
        <span style={styles.topBarTag}>Community Attribution</span>
      </header>

      {/* ── Activated banner ── */}
      {scanRecorded && (
        <div style={styles.activatedBanner}>
          <span style={styles.activatedDot} />
          <span style={styles.activatedText}>
            Activated — referred by <strong>@{qr.creatorHandle}</strong>
          </span>
        </div>
      )}

      {/* ── Hero section ── */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <p style={styles.heroEyebrow}>
            {getCategoryIcon(qr.category)}&nbsp;{qr.category.toUpperCase()}
          </p>
          <h1 style={styles.heroTitle}>{qr.campaignTitle}</h1>
          <p style={styles.heroSub}>{qr.businessName}</p>
          <p style={styles.heroAddress}>{qr.businessAddress}</p>
        </div>
      </section>

      {/* ── Offer cards ── */}
      <section style={styles.offerSection}>
        <div style={styles.offerGrid}>
          {/* Tier 1 Hero Offer */}
          <div
            style={{
              ...styles.offerCard,
              ...(heroExhausted
                ? styles.offerCardDimmed
                : styles.offerCardHero),
            }}
          >
            <p style={styles.offerEyebrow}>
              {heroExhausted
                ? "HERO OFFER — CLAIMED"
                : `HERO OFFER — ${heroLeft} LEFT`}
            </p>
            <p style={styles.offerText}>{qr.offerTier1}</p>
            {heroExhausted && (
              <p style={styles.offerNote}>
                All hero slots have been claimed. See standard offer below.
              </p>
            )}
          </div>

          {/* Tier 2 Sustained Offer */}
          <div style={{ ...styles.offerCard, ...styles.offerCardSustained }}>
            <p style={styles.offerEyebrow}>STANDARD OFFER — ALWAYS AVAILABLE</p>
            <p style={styles.offerText}>{qr.offerTier2}</p>
          </div>
        </div>
      </section>

      {/* ── Campaign description ── */}
      <section style={styles.descSection}>
        <p style={styles.descLabel}>ABOUT THIS CAMPAIGN</p>
        <p style={styles.descText}>{qr.description}</p>
      </section>

      {/* ── Creator credit ── */}
      <section style={styles.creatorSection}>
        <div style={styles.creatorCard}>
          <div style={styles.creatorAvatar}>
            {qr.creatorName.charAt(0).toUpperCase()}
          </div>
          <div style={styles.creatorInfo}>
            <p style={styles.creatorLabel}>BROUGHT TO YOU BY</p>
            <p style={styles.creatorName}>{qr.creatorName}</p>
            <p style={styles.creatorHandle}>@{qr.creatorHandle}</p>
          </div>
        </div>
      </section>

      {/* ── Map preview ── */}
      <section style={styles.mapSection}>
        <p style={styles.mapLabel}>FIND THEM</p>
        <div style={styles.mapWrap}>
          <MapView
            campaigns={[
              {
                id: qr.campaignId,
                title: qr.campaignTitle,
                business_name: qr.businessName,
                payout: qr.payout,
                spots_remaining: heroLeft,
                category: qr.category,
                lat: qr.lat,
                lng: qr.lng,
              },
            ]}
            center={[qr.lat, qr.lng]}
          />
        </div>
        <p style={styles.mapAddress}>{qr.businessAddress}</p>
      </section>

      {/* ── Consent picker ── */}
      <section style={styles.consentSection}>
        <ConsentPicker
          initialTier={consentTier}
          onChange={handleConsentChange}
          onDeclineAll={() => handleConsentChange(1)}
          onContinue={(tier) => {
            handleConsentChange(tier);
            router.push(`/scan/${qrId}/verify`);
          }}
        />
      </section>

      {/* ── CTA: verify visit ── */}
      <section style={styles.ctaSection}>
        <p style={styles.ctaLabel}>VISITED?</p>
        <h2 style={styles.ctaTitle}>Claim your offer</h2>
        <p style={styles.ctaBody}>
          Show this page to the team at {qr.businessName} to receive your offer.
          Then upload your proof below to confirm your visit — valid for 24
          hours.
        </p>
        <button
          style={styles.ctaButton}
          onClick={() => router.push(`/scan/${qrId}/verify`)}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "6px 6px 0 var(--dark)";
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translate(-2px, -2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "3px 3px 0 var(--accent)";
            (e.currentTarget as HTMLButtonElement).style.transform = "none";
          }}
        >
          CONFIRM MY VISIT →
        </button>
        <p style={styles.ctaFine}>
          Offer valid until {formatExpiry(qr.expiresAt)}
        </p>
      </section>

      {/* ── Footer ── */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Powered by{" "}
          <Link href="/" style={styles.footerLink}>
            Push
          </Link>{" "}
          — community attribution platform
        </p>
      </footer>
    </div>
  );
}

/* ── Styles ────────────────────────────────────────────────── */
// All inline to keep scan pages self-contained and fast-loading
// border-radius: 0 everywhere per Design.md

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

  errorCard: {
    background: "var(--surface-elevated)",
    border: "1px solid var(--line)",
    padding: "40px 32px",
    maxWidth: "480px",
    width: "100%",
  } as React.CSSProperties,

  errorEyebrow: {
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--primary)",
    marginBottom: "12px",
  } as React.CSSProperties,

  errorTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-h3)",
    fontWeight: 700,
    color: "var(--dark)",
    marginBottom: "12px",
  } as React.CSSProperties,

  errorBody: {
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

  /* Activated banner */
  activatedBanner: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    background: "rgba(193, 18, 31, 0.06)",
    borderBottom: "1px solid rgba(193, 18, 31, 0.2)",
  } as React.CSSProperties,

  activatedDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "var(--primary)",
    flexShrink: 0,
  } as React.CSSProperties,

  activatedText: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-small)",
    color: "var(--dark)",
  } as React.CSSProperties,

  /* Hero */
  hero: {
    background: "var(--dark)",
    padding: "48px 24px 40px",
  } as React.CSSProperties,

  heroInner: {
    maxWidth: "640px",
    margin: "0 auto",
  } as React.CSSProperties,

  heroEyebrow: {
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--champagne)",
    marginBottom: "12px",
  } as React.CSSProperties,

  heroTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(28px, 6vw, 48px)",
    fontWeight: 800,
    color: "#ffffff",
    letterSpacing: "-0.04em",
    lineHeight: 1.05,
    marginBottom: "12px",
  } as React.CSSProperties,

  heroSub: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-body)",
    fontWeight: 600,
    color: "var(--tertiary)",
    marginBottom: "4px",
  } as React.CSSProperties,

  heroAddress: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-small)",
    color: "rgba(255,255,255,0.55)",
  } as React.CSSProperties,

  /* Offer section */
  offerSection: {
    padding: "32px 24px",
    maxWidth: "640px",
    margin: "0 auto",
    width: "100%",
  } as React.CSSProperties,

  offerGrid: {
    display: "grid",
    gap: "12px",
  } as React.CSSProperties,

  offerCard: {
    padding: "20px 24px",
    border: "1px solid",
  } as React.CSSProperties,

  offerCardHero: {
    background: "var(--primary)",
    borderColor: "var(--primary)",
    color: "#ffffff",
  } as React.CSSProperties,

  offerCardDimmed: {
    background: "var(--surface-elevated)",
    borderColor: "var(--line)",
    opacity: 0.6,
  } as React.CSSProperties,

  offerCardSustained: {
    background: "var(--surface-elevated)",
    borderColor: "var(--line)",
  } as React.CSSProperties,

  offerEyebrow: {
    fontFamily: "var(--font-body)",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    marginBottom: "6px",
    opacity: 0.75,
  } as React.CSSProperties,

  offerText: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-body)",
    fontWeight: 600,
    lineHeight: 1.4,
  } as React.CSSProperties,

  offerNote: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-caption)",
    marginTop: "6px",
    opacity: 0.7,
  } as React.CSSProperties,

  /* Description */
  descSection: {
    padding: "0 24px 32px",
    maxWidth: "640px",
    margin: "0 auto",
    width: "100%",
  } as React.CSSProperties,

  descLabel: {
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--text-muted)",
    marginBottom: "8px",
  } as React.CSSProperties,

  descText: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-small)",
    color: "var(--graphite)",
    lineHeight: 1.7,
  } as React.CSSProperties,

  /* Creator credit */
  creatorSection: {
    padding: "0 24px 32px",
    maxWidth: "640px",
    margin: "0 auto",
    width: "100%",
  } as React.CSSProperties,

  creatorCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px 20px",
    background: "var(--surface-elevated)",
    border: "1px solid var(--line)",
  } as React.CSSProperties,

  creatorAvatar: {
    width: "48px",
    height: "48px",
    background: "var(--dark)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-display)",
    fontSize: "20px",
    fontWeight: 800,
    flexShrink: 0,
    // Map pins are 50% per Design.md, but this is an avatar — using square per rules
    borderRadius: "0",
  } as React.CSSProperties,

  creatorInfo: {
    flex: 1,
    minWidth: 0,
  } as React.CSSProperties,

  creatorLabel: {
    fontFamily: "var(--font-body)",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--text-muted)",
    marginBottom: "2px",
  } as React.CSSProperties,

  creatorName: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-small)",
    fontWeight: 600,
    color: "var(--dark)",
  } as React.CSSProperties,

  creatorHandle: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-caption)",
    color: "var(--tertiary)",
  } as React.CSSProperties,

  /* Map */
  mapSection: {
    padding: "0 24px 32px",
    maxWidth: "640px",
    margin: "0 auto",
    width: "100%",
  } as React.CSSProperties,

  mapLabel: {
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--text-muted)",
    marginBottom: "8px",
  } as React.CSSProperties,

  mapWrap: {
    height: "220px",
    border: "1px solid var(--line)",
    overflow: "hidden",
  } as React.CSSProperties,

  mapAddress: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-caption)",
    color: "var(--graphite)",
    marginTop: "6px",
  } as React.CSSProperties,

  /* Consent picker wrap — keeps ConsentPicker's own layout width */
  consentSection: {
    padding: "0 24px 32px",
    maxWidth: "720px",
    margin: "0 auto",
    width: "100%",
  } as React.CSSProperties,

  /* CTA */
  ctaSection: {
    padding: "32px 24px 40px",
    maxWidth: "640px",
    margin: "0 auto",
    width: "100%",
    borderTop: "1px solid var(--line)",
    textAlign: "center" as const,
  } as React.CSSProperties,

  ctaLabel: {
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--text-muted)",
    marginBottom: "8px",
  } as React.CSSProperties,

  ctaTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-h3)",
    fontWeight: 700,
    color: "var(--dark)",
    letterSpacing: "-0.03em",
    marginBottom: "12px",
  } as React.CSSProperties,

  ctaBody: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-small)",
    color: "var(--graphite)",
    lineHeight: 1.6,
    marginBottom: "24px",
  } as React.CSSProperties,

  ctaButton: {
    display: "inline-block",
    padding: "16px 32px",
    background: "var(--primary)",
    color: "#ffffff",
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-small)",
    fontWeight: 700,
    letterSpacing: "0.06em",
    border: "none",
    borderRadius: "0",
    cursor: "pointer",
    boxShadow: "3px 3px 0 var(--accent)",
    transition: "box-shadow 150ms ease, transform 150ms ease",
    marginBottom: "12px",
  } as React.CSSProperties,

  ctaFine: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-caption)",
    color: "var(--text-muted)",
  } as React.CSSProperties,

  /* Footer */
  footer: {
    padding: "24px",
    borderTop: "1px solid var(--line)",
    textAlign: "center" as const,
    background: "var(--surface-elevated)",
  } as React.CSSProperties,

  footerText: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-caption)",
    color: "var(--text-muted)",
  } as React.CSSProperties,

  footerLink: {
    color: "var(--dark)",
    fontWeight: 600,
    textDecoration: "none",
  } as React.CSSProperties,
} as const;
