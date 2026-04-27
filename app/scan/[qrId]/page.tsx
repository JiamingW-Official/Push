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
      style={{ width: "100%", height: "100%", background: "var(--surface-2)" }}
    />
  ),
});

/* ── Helpers ─────────────────────────────────────────────────── */

function formatExpiry(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    Coffee: "Coffee",
    Food: "Food",
    Beauty: "Beauty",
    Retail: "Retail",
    Fitness: "Fitness",
    Lifestyle: "Lifestyle",
  };
  return map[category] ?? category;
}

/* ── Component ───────────────────────────────────────────────── */

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
  const [isMinor, setIsMinor] = useState<boolean>(false);
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
      <div style={st.centered}>
        <p style={st.loadingText}>Verifying QR code…</p>
      </div>
    );
  }

  /* ── Not found ── */
  if (status === "not-found") {
    return (
      <div style={st.centered}>
        <div style={st.errorCard}>
          <p style={st.errorEyebrow}>(INVALID CODE)</p>
          <h1 style={st.errorTitle}>QR code not found.</h1>
          <p style={st.errorBody}>
            This code doesn&apos;t match any active campaign. Ask your creator
            for the correct link.
          </p>
          <Link href="/" style={st.errorLink}>
            ← Back to Push
          </Link>
        </div>
      </div>
    );
  }

  /* ── Expired ── */
  if (status === "expired" && qr) {
    return (
      <div style={st.centered}>
        <div style={st.errorCard}>
          <p style={st.errorEyebrow}>(CAMPAIGN ENDED)</p>
          <h1 style={st.errorTitle}>{qr.campaignTitle}</h1>
          <p style={st.errorBody}>
            This campaign ended on {formatExpiry(qr.expiresAt)}. Check{" "}
            <strong>{qr.businessName}</strong> for current offers.
          </p>
          <Link href="/" style={st.errorLink}>
            ← Back to Push
          </Link>
        </div>
      </div>
    );
  }

  if (!qr) return null;

  const heroLeft = heroSlotsRemaining(qr);
  const heroExhausted = heroLeft === 0;

  return (
    <div style={st.page}>
      {/* ── FTC §255 disclosure ── */}
      <div style={st.ftcBanner} role="note" aria-label="Ad disclosure">
        <span style={st.ftcTag}>#ad</span>
        <span style={st.ftcText}>
          Paid partnership with <strong>{qr.businessName}</strong>. Sponsored
          content — FTC §&nbsp;255 disclosure.
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════
          TICKET PANEL — physical ticket aesthetic
          GA Orange fill, ink text, 4 corner grommets,
          dashed perforation top + bottom, flat no-shadow
      ════════════════════════════════════════════════════ */}
      <div style={st.ticketWrap}>
        <div style={st.ticket}>
          {/* Grommet corner circles — Design.md Ticket Panel spec */}
          <span
            style={{ ...st.grommet, top: 24, left: 24 }}
            aria-hidden="true"
          />
          <span
            style={{ ...st.grommet, top: 24, right: 24 }}
            aria-hidden="true"
          />
          <span
            style={{ ...st.grommet, bottom: 24, left: 24 }}
            aria-hidden="true"
          />
          <span
            style={{ ...st.grommet, bottom: 24, right: 24 }}
            aria-hidden="true"
          />

          {/* Top bar — wordmark + status */}
          <div style={st.ticketTop}>
            <span style={st.pushWordmark}>PUSH</span>
            {scanRecorded ? (
              <span style={st.verifiedBadge}>
                <span aria-hidden="true">✓</span> Scan verified
              </span>
            ) : (
              <span style={st.activeBadge}>Active</span>
            )}
          </div>

          {/* Perforation line — top */}
          <div style={st.perf} aria-hidden="true" />

          {/* Main ticket body */}
          <div style={st.ticketBody}>
            <p style={st.ticketEyebrow}>
              {getCategoryLabel(qr.category).toUpperCase()}
              {scanRecorded && (
                <span style={st.referralNote}>
                  &nbsp;·&nbsp;Referred by @{qr.creatorHandle}
                </span>
              )}
            </p>

            <h1 style={st.merchantName}>{qr.businessName}</h1>
            <p style={st.campaignTitle}>{qr.campaignTitle}</p>
            <p style={st.address}>{qr.businessAddress}</p>

            <div style={st.validRow}>
              <span style={st.validLabel}>Valid until</span>
              <span style={st.validDate}>{formatExpiry(qr.expiresAt)}</span>
            </div>
          </div>

          {/* Perforation line — bottom */}
          <div style={st.perf} aria-hidden="true" />

          {/* Stub — offer summary + CTA */}
          <div style={st.ticketStub}>
            <div style={st.offerRow}>
              {heroExhausted ? (
                <div style={st.offerBlock}>
                  <p style={st.offerLabel}>STANDARD OFFER</p>
                  <p style={st.offerText}>{qr.offerTier2}</p>
                </div>
              ) : (
                <>
                  <div style={st.offerBlock}>
                    <p style={st.offerLabel}>HERO OFFER · {heroLeft} LEFT</p>
                    <p style={st.offerText}>{qr.offerTier1}</p>
                  </div>
                  <div
                    style={{
                      ...st.offerBlock,
                      borderLeft: "1px dashed rgba(10,10,10,0.2)",
                      paddingLeft: 16,
                    }}
                  >
                    <p style={st.offerLabel}>STANDARD OFFER</p>
                    <p style={st.offerText}>{qr.offerTier2}</p>
                  </div>
                </>
              )}
            </div>

            {/* Filled Ink CTA — Design.md Ticket Panel spec */}
            <button
              style={st.ctaButton}
              onClick={() => router.push(`/scan/${qrId}/verify`)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translate(2px, 2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "none";
              }}
            >
              {scanRecorded ? "CONFIRM MY VISIT →" : "TAP TO CHECK IN →"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Campaign details ───────────────────────────────── */}
      <section style={st.detailsSection}>
        <div style={st.sectionInner}>
          <p style={st.sectionEyebrow}>(ABOUT THIS CAMPAIGN)</p>
          <p style={st.detailsText}>{qr.description}</p>
        </div>
      </section>

      {/* ── Creator credit ─────────────────────────────────── */}
      <section style={st.creatorSection}>
        <div style={st.sectionInner}>
          <p style={st.sectionEyebrow}>(RECOMMENDED BY)</p>
          <div style={st.creatorCard}>
            <div style={st.creatorAvatar} aria-hidden="true">
              {qr.creatorName.charAt(0).toUpperCase()}
            </div>
            <div style={st.creatorInfo}>
              <p style={st.creatorName}>{qr.creatorName}</p>
              <p style={st.creatorHandle}>@{qr.creatorHandle}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Map ────────────────────────────────────────────── */}
      <section style={st.mapSection}>
        <div style={st.sectionInner}>
          <p style={st.sectionEyebrow}>(FIND THEM)</p>
          <div style={st.mapWrap}>
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
          <p style={st.mapAddress}>{qr.businessAddress}</p>
        </div>
      </section>

      {/* ── Age gate + Consent ────────────────────────────── */}
      <section style={st.consentSection}>
        <div style={st.sectionInner}>
          <label style={st.ageGate}>
            <input
              type="checkbox"
              checked={isMinor}
              onChange={(e) => {
                setIsMinor(e.target.checked);
                if (e.target.checked && consentTier > 1) {
                  handleConsentChange(1);
                }
              }}
              style={st.ageGateCheck}
            />
            <span style={st.ageGateText}>
              I am under 18 years old
              <small style={st.ageGateSmall}>
                Required by COPPA / CCPA — locks consent to Tier 1 (attribution
                only).
              </small>
            </span>
          </label>
          <ConsentPicker
            initialTier={consentTier}
            minor={isMinor}
            onChange={handleConsentChange}
            onDeclineAll={() => handleConsentChange(1)}
            onContinue={(tier) => {
              handleConsentChange(tier);
              router.push(`/scan/${qrId}/verify`);
            }}
          />
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer style={st.footer}>
        <p style={st.footerText}>
          Powered by{" "}
          <Link href="/" style={st.footerLink}>
            Push
          </Link>{" "}
          — community attribution platform
        </p>
      </footer>
    </div>
  );
}

/* ── Styles ──────────────────────────────────────────────────── */
// Inline styles keep the scan page self-contained and fast on mobile.
// All radii / spacing follow Design.md v11 token scale.

const ORANGE = "var(--ga-orange, #ff5e2b)";
const INK = "var(--ink, #0a0a0a)";
const INK3 = "var(--ink-3, #61605c)";
const INK4 = "var(--ink-4, #6a6a6a)";
const SNOW = "var(--snow, #fff)";
const SURFACE = "var(--surface, #f8f4e8)";
const SURFACE2 = "var(--surface-2, #f5f3ee)";
const MIST = "var(--mist, #d8d4c8)";
const GRAPHITE = "var(--graphite, #2c2a26)";

const st = {
  page: {
    minHeight: "100vh",
    background: SURFACE,
    fontFamily: "var(--font-body)",
    color: INK,
  } as React.CSSProperties,

  centered: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: SURFACE,
    padding: "24px",
  } as React.CSSProperties,

  loadingText: {
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: INK4,
  } as React.CSSProperties,

  errorCard: {
    background: SURFACE2,
    border: `1px solid ${MIST}`,
    borderRadius: "10px",
    padding: "40px 32px",
    maxWidth: "480px",
    width: "100%",
  } as React.CSSProperties,

  errorEyebrow: {
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "var(--brand-red, #c1121f)",
    marginBottom: "16px",
  } as React.CSSProperties,

  errorTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(28px, 5vw, 40px)",
    fontWeight: 900,
    color: INK,
    letterSpacing: "-0.03em",
    marginBottom: "12px",
  } as React.CSSProperties,

  errorBody: {
    fontFamily: "var(--font-body)",
    fontSize: "18px",
    lineHeight: 1.55,
    color: INK3,
    marginBottom: "24px",
  } as React.CSSProperties,

  errorLink: {
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
    color: INK,
    textDecoration: "none",
    borderBottom: `1px solid ${INK}`,
  } as React.CSSProperties,

  /* FTC disclosure — ink top bar */
  ftcBanner: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 24px",
    background: INK,
    color: SNOW,
  } as React.CSSProperties,

  ftcTag: {
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    padding: "2px 8px",
    background: "var(--brand-red, #c1121f)",
    color: SNOW,
    borderRadius: "4px",
    flexShrink: 0,
  } as React.CSSProperties,

  ftcText: {
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    lineHeight: 1.4,
    color: "rgba(255,255,255,0.7)",
  } as React.CSSProperties,

  /* Ticket wrapper — graphite bg centers card on wider screens */
  ticketWrap: {
    padding: "40px 24px",
    display: "flex",
    justifyContent: "center",
    background: GRAPHITE,
  } as React.CSSProperties,

  /* Physical ticket — GA Orange, flat no-shadow per Design.md */
  ticket: {
    position: "relative" as const,
    width: "100%",
    maxWidth: "480px",
    background: ORANGE,
    borderRadius: "10px",
    overflow: "hidden",
    /* flat — no box-shadow per Ticket Panel spec */
  } as React.CSSProperties,

  /* Grommet corner circles — 16px, 24px inset */
  grommet: {
    position: "absolute" as const,
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    background: GRAPHITE,
    border: `2px solid ${INK}`,
  } as React.CSSProperties,

  /* Top bar inside ticket */
  ticketTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 40px 16px",
  } as React.CSSProperties,

  pushWordmark: {
    fontFamily: "var(--font-display)",
    fontSize: "20px",
    fontWeight: 900,
    color: INK,
    letterSpacing: "-0.04em",
  } as React.CSSProperties,

  verifiedBadge: {
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: INK,
    background: "rgba(10,10,10,0.12)",
    padding: "4px 10px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  } as React.CSSProperties,

  activeBadge: {
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: INK,
    background: "rgba(10,10,10,0.12)",
    padding: "4px 10px",
    borderRadius: "4px",
  } as React.CSSProperties,

  /* Dashed perforation — 2px dashed per Design.md Ticket Panel spec */
  perf: {
    borderTop: "2px dashed rgba(10,10,10,0.25)",
    margin: "0 24px",
  } as React.CSSProperties,

  ticketBody: {
    padding: "24px 40px",
  } as React.CSSProperties,

  ticketEyebrow: {
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "rgba(10,10,10,0.6)",
    marginBottom: "16px",
  } as React.CSSProperties,

  referralNote: {
    opacity: 0.75,
  } as React.CSSProperties,

  /* Magvix Italic centered — centered allowed inside Ticket Panel */
  merchantName: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(40px, 8vw, 64px)",
    fontWeight: 900,
    color: INK,
    letterSpacing: "-0.04em",
    lineHeight: 0.95,
    margin: "0 0 8px",
  } as React.CSSProperties,

  campaignTitle: {
    fontFamily: "var(--font-body)",
    fontSize: "18px",
    fontWeight: 600,
    color: "rgba(10,10,10,0.75)",
    marginBottom: "4px",
    lineHeight: 1.4,
  } as React.CSSProperties,

  address: {
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    color: "rgba(10,10,10,0.55)",
    marginBottom: "24px",
  } as React.CSSProperties,

  validRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  } as React.CSSProperties,

  validLabel: {
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: "rgba(10,10,10,0.5)",
  } as React.CSSProperties,

  validDate: {
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    fontWeight: 700,
    color: INK,
  } as React.CSSProperties,

  /* Stub section at bottom of ticket */
  ticketStub: {
    padding: "24px 40px 32px",
  } as React.CSSProperties,

  offerRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap" as const,
  } as React.CSSProperties,

  offerBlock: {
    flex: 1,
    minWidth: "120px",
  } as React.CSSProperties,

  offerLabel: {
    fontFamily: "var(--font-body)",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "rgba(10,10,10,0.5)",
    marginBottom: "4px",
  } as React.CSSProperties,

  offerText: {
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    fontWeight: 600,
    color: INK,
    lineHeight: 1.4,
  } as React.CSSProperties,

  /* Filled Ink CTA — Design.md Ticket Panel spec */
  ctaButton: {
    display: "block",
    width: "100%",
    padding: "14px 28px",
    background: INK,
    color: SNOW,
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

  /* Below-fold sections */
  detailsSection: {
    padding: "48px 24px",
    borderBottom: `1px solid ${MIST}`,
  } as React.CSSProperties,

  sectionInner: {
    maxWidth: "480px",
    margin: "0 auto",
  } as React.CSSProperties,

  sectionEyebrow: {
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: INK4,
    marginBottom: "16px",
  } as React.CSSProperties,

  detailsText: {
    fontFamily: "var(--font-body)",
    fontSize: "18px",
    lineHeight: 1.65,
    color: INK3,
  } as React.CSSProperties,

  creatorSection: {
    padding: "48px 24px",
    background: SURFACE2,
    borderBottom: `1px solid ${MIST}`,
  } as React.CSSProperties,

  creatorCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  } as React.CSSProperties,

  creatorAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: INK,
    color: SNOW,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-display)",
    fontSize: "20px",
    fontWeight: 900,
    flexShrink: 0,
  } as React.CSSProperties,

  creatorInfo: {
    flex: 1,
    minWidth: 0,
  } as React.CSSProperties,

  creatorName: {
    fontFamily: "var(--font-body)",
    fontSize: "18px",
    fontWeight: 700,
    color: INK,
    marginBottom: "2px",
  } as React.CSSProperties,

  creatorHandle: {
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    color: INK4,
  } as React.CSSProperties,

  mapSection: {
    padding: "48px 24px",
    borderBottom: `1px solid ${MIST}`,
  } as React.CSSProperties,

  mapWrap: {
    height: "224px",
    border: `1px solid ${MIST}`,
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "8px",
  } as React.CSSProperties,

  mapAddress: {
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    color: INK4,
  } as React.CSSProperties,

  consentSection: {
    padding: "48px 24px",
    borderBottom: `1px solid ${MIST}`,
  } as React.CSSProperties,

  ageGate: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "16px",
    marginBottom: "16px",
    border: `1px solid ${MIST}`,
    borderRadius: "8px",
    background: SURFACE2,
    cursor: "pointer",
  } as React.CSSProperties,

  ageGateCheck: {
    marginTop: "2px",
    width: "16px",
    height: "16px",
    accentColor: "var(--brand-red, #c1121f)",
    flexShrink: 0,
  } as React.CSSProperties,

  ageGateText: {
    display: "flex",
    flexDirection: "column" as const,
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    fontWeight: 600,
    color: INK,
    lineHeight: 1.4,
  } as React.CSSProperties,

  ageGateSmall: {
    fontSize: "12px",
    fontWeight: 500,
    color: INK4,
    marginTop: "2px",
  } as React.CSSProperties,

  footer: {
    padding: "24px",
    textAlign: "center" as const,
    borderTop: `1px solid ${MIST}`,
  } as React.CSSProperties,

  footerText: {
    fontFamily: "var(--font-body)",
    fontSize: "12px",
    color: INK4,
  } as React.CSSProperties,

  footerLink: {
    color: INK,
    fontWeight: 700,
    textDecoration: "none",
  } as React.CSSProperties,
} as const;
