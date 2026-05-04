import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog — Push",
  description:
    "Every meaningful update to Push, in reverse chronological order. What we shipped and why.",
};

const ENTRIES = [
  {
    version: "v2.4",
    date: "Apr 2026",
    isLatest: true,
    tags: ["Feature", "Improvement"],
    headline: "Multi-location QR + Creator tier upgrade system",
    bullets: [
      "Merchants with multiple locations can now generate location-scoped QR codes from a single campaign — each scan attributed to the originating location.",
      "Creator tier upgrades are now automatic: creators who hit milestone thresholds in a rolling 60-day window are promoted without requiring manual review.",
      "New campaign dashboard widget shows per-location attribution breakdown in real time.",
    ],
  },
  {
    version: "v2.3",
    date: "Mar 2026",
    isLatest: false,
    tags: ["Improvement", "Fix"],
    headline: "Payout acceleration (48hr → 24hr) + Stripe Connect improvements",
    bullets: [
      "Verified-visit payouts now clear in 24 hours instead of 48 — the oracle validation window tightened after six weeks of fraud-free operation.",
      "Stripe Connect onboarding redesigned: creators complete identity verification in under 3 minutes on mobile.",
      "Payout history now exportable as CSV for tax preparation.",
    ],
  },
  {
    version: "v2.2",
    date: "Feb 2026",
    isLatest: false,
    tags: ["Feature"],
    headline: "Real-time scan dashboard + campaign analytics",
    bullets: [
      "Merchants now see a live scan feed in their dashboard: each QR scan appears within 2 seconds of the oracle validation completing.",
      "Campaign analytics panel added: verified visits, cost per visit, creator leaderboard, and budget burn rate in a single view.",
      "Push notification support for merchants when their campaign reaches 50% and 90% budget utilization.",
    ],
  },
  {
    version: "v2.1",
    date: "Jan 2026",
    isLatest: false,
    tags: ["Feature", "Improvement"],
    headline: "Creator leaderboard + neighborhood expansion",
    bullets: [
      "Public creator leaderboard launched — opt-in ranking by verified visits driven, updated daily.",
      "Neighborhood coverage expanded from Williamsburg to include DUMBO, Greenpoint, and Crown Heights.",
      "Creator profile pages now show verified visit history (opt-in) to build merchant trust before application review.",
    ],
  },
  {
    version: "v2.0",
    date: "Dec 2025",
    isLatest: false,
    tags: ["Feature"],
    headline: "Full product launch with attribution engine",
    bullets: [
      "Push ConversionOracle v1 shipped: every QR scan passes receipt-ID matching, device fingerprint check, and replay-attack detection before payout is triggered.",
      "Merchant dashboard launched with campaign creation, creator approval, and real-time attribution.",
      "Creator wallet and Stripe Connect payout infrastructure live — first Friday payouts processed Dec 12, 2025.",
    ],
  },
  {
    version: "v1.0",
    date: "Nov 2025",
    isLatest: false,
    tags: ["Feature"],
    headline: "Pilot launch in Williamsburg",
    bullets: [
      "Closed pilot with 5 venues and 10 creators across a 7-block radius in Williamsburg.",
      "QR attribution system tested end-to-end: scan → oracle → payout in under 3 seconds.",
      "First verified-visit payouts processed — proof that the unit economics clear at $14 per verified visit.",
    ],
  },
];

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  Feature: {
    bg: "var(--accent-blue-tint)",
    text: "var(--accent-blue)",
  },
  Fix: {
    bg: "var(--brand-red-tint)",
    text: "var(--brand-red)",
  },
  Improvement: {
    bg: "var(--surface-3)",
    text: "var(--ink-3)",
  },
};

export default function ChangelogPage() {
  return (
    <>
      {/* ══ 01 — HERO (dark ink, Darky display bottom-left) ══ */}
      <section
        style={{
          background: "var(--ink)",
          color: "var(--snow)",
          padding: "96px clamp(24px,6vw,64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto", position: "relative" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.45)",
              margin: "0 0 24px",
            }}
          >
            (PRODUCT UPDATES)
          </p>

          {/* Darky Display — bottom-left anchored */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(56px,8vw,128px)",
              fontWeight: 900,
              color: "var(--snow)",
              lineHeight: 0.9,
              margin: "0 0 48px",
              letterSpacing: "-0.035em",
            }}
          >
            What&apos;s new.
          </h1>

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 18,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.55,
              maxWidth: 560,
              margin: 0,
            }}
          >
            Every meaningful change to Push, in reverse chronological order.
            What we shipped, what we learned, and what it means for merchants
            and creators.
          </p>
        </div>
      </section>

      {/* ══ SIG DIVIDER ══ */}
      <div className="sig-divider">
        Shipped&nbsp;·&nbsp;Tested&nbsp;·&nbsp;Live&nbsp;·
      </div>

      {/* ══ 02 — TIMELINE (surface bg) ══ */}
      <section
        style={{
          background: "var(--surface)",
          padding: "96px clamp(24px,6vw,64px)",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {ENTRIES.map((entry, idx) => (
              <div
                key={entry.version}
                style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: "clamp(24px,4vw,56px)",
                  paddingTop: idx === 0 ? 0 : 80,
                  paddingBottom: 80,
                  borderBottom:
                    idx < ENTRIES.length - 1
                      ? "1px solid var(--hairline)"
                      : "none",
                }}
              >
                {/* Left: date + version badge + category tags */}
                <div style={{ paddingTop: 4 }}>
                  {/* Version badge — btn-pill var(--surface-3) for old, brand-red for latest */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 16,
                      flexWrap: "wrap" as const,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase" as const,
                        background: entry.isLatest
                          ? "var(--brand-red)"
                          : "var(--surface-3)",
                        color: entry.isLatest ? "var(--snow)" : "var(--ink-3)",
                        padding: "4px 12px",
                        borderRadius: 8,
                      }}
                    >
                      {entry.version}
                    </span>
                    {entry.isLatest && (
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase" as const,
                          background: "var(--brand-red)",
                          color: "var(--snow)",
                          padding: "2px 8px",
                          borderRadius: "50vh",
                        }}
                      >
                        New
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--ink-4)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase" as const,
                      margin: "0 0 16px",
                    }}
                  >
                    {entry.date}
                  </p>

                  {/* Category tag pills */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      alignItems: "flex-start",
                    }}
                  >
                    {entry.tags.map((tag) => {
                      const tc = TAG_COLORS[tag] ?? {
                        bg: "var(--surface-3)",
                        text: "var(--ink-3)",
                      };
                      return (
                        <span
                          key={tag}
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase" as const,
                            background: tc.bg,
                            color: tc.text,
                            padding: "4px 12px",
                            borderRadius: "50vh",
                          }}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Right: H3 headline + bullets */}
                <div>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 28,
                      fontWeight: 700,
                      color: "var(--ink)",
                      lineHeight: 1.15,
                      margin: "0 0 24px",
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {entry.headline}
                  </h2>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    {entry.bullets.map((b, bi) => (
                      <li
                        key={bi}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 18,
                          color: "var(--ink-3)",
                          lineHeight: 1.55,
                          paddingLeft: 24,
                          position: "relative",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: 0,
                            color: "var(--brand-red)",
                            fontWeight: 700,
                          }}
                        >
                          —
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SIG DIVIDER ══ */}
      <div className="sig-divider">
        Built&nbsp;·&nbsp;Shipped&nbsp;·&nbsp;Iterated&nbsp;·
      </div>

      {/* ══ 03 — STATS + CTA (surface-2) ══ */}
      <section
        style={{
          background: "var(--surface-2)",
          padding: "96px clamp(24px,6vw,64px)",
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(40px,6vw,80px)",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: "var(--ink-4)",
                margin: "0 0 24px",
              }}
            >
              (STAY CURRENT)
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 40,
                fontWeight: 800,
                color: "var(--ink)",
                lineHeight: 1.05,
                margin: "0 0 16px",
                letterSpacing: "-0.02em",
              }}
            >
              Want updates as they ship?
            </h2>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 18,
                color: "var(--ink-3)",
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              Push ships meaningful changes every 4–6 weeks. Subscribe to the
              changelog or follow{" "}
              <a
                href="https://twitter.com/pushnyc"
                style={{
                  color: "var(--brand-red)",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                @pushnyc
              </a>{" "}
              for live updates.
            </p>
          </div>

          {/* Stats tile — ink bg */}
          <div
            style={{
              background: "var(--ink)",
              borderRadius: 10,
              padding: "clamp(32px,4vw,48px)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: "rgba(255,255,255,0.4)",
                margin: "0 0 24px",
              }}
            >
              (RECENT STATS)
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
              }}
            >
              {[
                { num: "6", label: "releases in 6 months" },
                { num: "24hr", label: "payout window" },
                { num: "99.9%", label: "attribution uptime" },
                { num: "0", label: "fraudulent payouts" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(32px,4vw,48px)",
                      fontWeight: 900,
                      color: "var(--snow)",
                      lineHeight: 0.9,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {s.num}
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "rgba(255,255,255,0.35)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase" as const,
                      marginTop: 8,
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
