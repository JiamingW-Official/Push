import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How We Verify | Push",
  description:
    "Three signals. One truth. Push uses QR scan, GPS dwell, and timestamp fingerprinting to verify every foot traffic visit before a dollar moves.",
};

/* ── Data ──────────────────────────────────────────────────── */

const VERIFY_ROWS = [
  {
    num: "01",
    title: "QR Scan.",
    body: "Unique QR per campaign, tied to a single merchant location and a single creator post. The code cannot be reused across campaigns or redeemed from a screenshot.",
  },
  {
    num: "02",
    title: "GPS Dwell.",
    body: "Phone must be at the merchant's registered coordinates for 30 continuous seconds. Lat/lng is compared against the venue radius — outside that radius, the scan goes to review.",
  },
  {
    num: "03",
    title: "Timestamp.",
    body: "Unix timestamp plus a session fingerprint recorded at the moment of scan. Velocity logic: if the same device appears at two locations it cannot physically reach in elapsed time, the second scan is held.",
  },
];

const STAT_CARDS = [
  { value: "0", label: "Fraudulent visits paid" },
  { value: "<1%", label: "False-positive rate" },
  { value: "Real-time", label: "Fraud monitoring" },
];

const COMPLIANCE_ROWS = [
  {
    label: "FTC 16 CFR § 255",
    title: "Material connection disclosure",
    body: "Visible on every scan page, every creator post, and in the campaign brief creator must accept before QR is activated.",
  },
  {
    label: "CCPA · Cal. Civ. Code § 1798.100",
    title: "Right-to-know + right-to-delete",
    body: "California residents: we fulfill data access or deletion inside the 45-day statutory window. File at privacy@push.nyc.",
  },
  {
    label: "GDPR · Reg. (EU) 2016/679",
    title: "Article 15 + 17 on request",
    body: "EU residents honored on request — subject access inside 30 days, erasure includes warm and cold backups.",
  },
];

/* ── Page ──────────────────────────────────────────────────── */

export default function TrustPage() {
  return (
    <main style={{ background: "var(--surface)", minHeight: "100vh" }}>
      {/* ═══ 01 — HERO (dark ink, bottom-left anchored) ═══ */}
      <section
        style={{
          background: "var(--ink)",
          color: "var(--snow)",
          padding: "96px clamp(24px,6vw,96px)",
          position: "relative",
        }}
        aria-labelledby="trust-hero-heading"
      >
        <div style={{ maxWidth: 1140, margin: "0 auto", width: "100%" }}>
          {/* eyebrow row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap" as const,
              gap: 16,
              marginBottom: 64,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: "rgba(255,255,255,0.45)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                padding: "6px 16px",
              }}
            >
              (HOW WE VERIFY)
            </span>
            {/* KPI right badge */}
            <div style={{ textAlign: "right" as const }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(40px,5vw,72px)",
                  fontWeight: 700,
                  color: "var(--snow)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.02em",
                }}
              >
                99.2%
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  color: "rgba(255,255,255,0.45)",
                  marginTop: 8,
                }}
              >
                VERIFIED RATE
              </div>
            </div>
          </div>

          {/* Darky Display H1 — bottom-left anchored */}
          <h1
            id="trust-hero-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(56px,8vw,128px)",
              fontWeight: 900,
              lineHeight: 0.9,
              color: "var(--snow)",
              margin: "0 0 48px",
              letterSpacing: "-0.035em",
            }}
          >
            Three signals.
            <br />
            One truth.
          </h1>

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 18,
              color: "rgba(255,255,255,0.5)",
              maxWidth: 560,
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            A customer scans your QR. We log the scan, the location, and the
            time. We don&apos;t log who they are. Stripe Connect holds the money
            — we never do.
          </p>
        </div>
      </section>

      {/* ═══ SIG DIVIDER ═══ */}
      <div className="sig-divider" aria-hidden="true">
        Scan · Verify · Pay ·
      </div>

      {/* ═══ 02 — HOW VERIFICATION WORKS (candy-panel butter) ═══ */}
      <section
        style={{
          background: "var(--panel-butter)",
          padding: "96px clamp(24px,6vw,96px)",
          borderBottom: "1px solid var(--hairline)",
        }}
        aria-labelledby="trust-verify-heading"
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "var(--ink-4)",
              display: "block",
              marginBottom: 16,
            }}
          >
            (HOW IT WORKS)
          </span>
          <h2
            id="trust-verify-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 40,
              fontWeight: 800,
              color: "var(--ink)",
              lineHeight: 1.05,
              margin: "0 0 64px",
              letterSpacing: "-0.02em",
            }}
          >
            How verification works.
          </h2>

          {/* 3 numbered editorial rows — 80px | 1fr | 2fr */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderTop: "1px solid var(--hairline)",
            }}
          >
            {VERIFY_ROWS.map((row) => (
              <div
                key={row.num}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr 2fr",
                  gap: "0 32px",
                  padding: "40px 0",
                  borderBottom: "1px solid var(--hairline)",
                  alignItems: "start",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 64,
                    fontWeight: 900,
                    color: "var(--hairline)",
                    lineHeight: 1.0,
                  }}
                >
                  {row.num}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 28,
                    fontWeight: 700,
                    color: "var(--ink)",
                    margin: "8px 0 0",
                    lineHeight: 1.15,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {row.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 18,
                    color: "var(--ink-3)",
                    lineHeight: 1.55,
                    margin: "8px 0 0",
                  }}
                >
                  {row.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 03 — ANTI-FRAUD STATS (panel-sky) ═══ */}
      <section
        style={{
          background: "var(--panel-sky)",
          padding: "96px clamp(24px,6vw,96px)",
          borderBottom: "1px solid var(--hairline)",
        }}
        aria-labelledby="trust-fraud-heading"
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "var(--ink-4)",
              display: "block",
              marginBottom: 16,
            }}
          >
            (ANTI-FRAUD)
          </span>
          <h2
            id="trust-fraud-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 40,
              fontWeight: 800,
              color: "var(--ink)",
              lineHeight: 1.05,
              margin: "0 0 64px",
              letterSpacing: "-0.02em",
            }}
          >
            The numbers say it.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 24,
            }}
          >
            {STAT_CARDS.map((card) => (
              <div
                key={card.label}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--hairline)",
                  borderRadius: 10,
                  padding: "40px 32px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(40px,5vw,72px)",
                    fontWeight: 700,
                    color: "var(--ink)",
                    lineHeight: 1.0,
                    letterSpacing: "-0.02em",
                    marginBottom: 16,
                  }}
                >
                  {card.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: "var(--ink-4)",
                  }}
                >
                  {card.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 04 — FTC COMPLIANCE (dark ink) ═══ */}
      <section
        style={{
          background: "var(--ink)",
          color: "var(--snow)",
          padding: "96px clamp(24px,6vw,96px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
        aria-labelledby="trust-ftc-heading"
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(48px,6vw,96px)",
              alignItems: "start",
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  color: "rgba(255,255,255,0.35)",
                  display: "block",
                  marginBottom: 16,
                }}
              >
                (COMPLIANCE)
              </span>
              <h2
                id="trust-ftc-heading"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 40,
                  fontWeight: 800,
                  color: "var(--snow)",
                  lineHeight: 1.05,
                  margin: "0 0 24px",
                  letterSpacing: "-0.02em",
                }}
              >
                FTC §255 compliant.
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 18,
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.55,
                  marginBottom: 24,
                }}
              >
                Every paid post pushed through Push must carry a clear
                material-connection disclosure. We audit our creator roster
                monthly. Anyone who doesn&apos;t comply is removed — no
                exceptions, no grace window after the second strike.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 18,
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.55,
                }}
              >
                The scan page itself shows a disclosure banner — visible to
                every customer who follows a creator&apos;s QR code. Push pays
                for the verified visit, not for the post. The relationship is
                always disclosed.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {COMPLIANCE_ROWS.map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10,
                    padding: "24px 32px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase" as const,
                      color: "var(--brand-red)",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    {item.label}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 28,
                      fontWeight: 700,
                      color: "var(--snow)",
                      margin: "0 0 8px",
                      lineHeight: 1.15,
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 16,
                      color: "rgba(255,255,255,0.4)",
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 05 — TICKET CTA ═══ */}
      <section
        style={{
          background: "var(--surface-2)",
          padding: "96px clamp(24px,6vw,96px)",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div
            style={{
              background: "var(--ga-orange)",
              borderRadius: 10,
              padding: "64px 96px",
              position: "relative",
              overflow: "hidden",
              textAlign: "center" as const,
            }}
          >
            {/* grommets */}
            {[
              { top: "50%", left: 24, transform: "translateY(-50%)" },
              { top: "50%", right: 24, transform: "translateY(-50%)" },
            ].map((pos, i) => (
              <div
                key={i}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "var(--ink)",
                  ...pos,
                }}
              />
            ))}
            {/* perforation top */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                left: 48,
                right: 48,
                height: 0,
                borderTop: "2px dashed rgba(0,0,0,0.15)",
              }}
            />
            {/* perforation bottom */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: 0,
                left: 48,
                right: 48,
                height: 0,
                borderBottom: "2px dashed rgba(0,0,0,0.15)",
              }}
            />

            <h2
              style={{
                fontFamily: "var(--font-hero)",
                fontStyle: "italic",
                fontSize: "clamp(40px,5vw,56px)",
                color: "var(--snow)",
                margin: "0 0 32px",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              See the verification flow live.
            </h2>
            <Link href="/how-it-works" className="btn-ink click-shift">
              Watch how it works
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
