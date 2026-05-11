import Link from "next/link";
import { DEMO_CAMPAIGNS } from "@/lib/code/demo-data";
import QRCode from "qrcode";

async function getQrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 200,
    margin: 2,
    color: { dark: "#1a1916", light: "#ffffff" },
  });
}

export const dynamic = "force-dynamic";

// Stable public URL for QR codes. Must be an absolute https:// URL so
// iPhone Camera app recognises it as a tappable link.
// ?? only guards null/undefined — if an env var is set to "" it would
// slip through, so we also check for falsy with ||.
const DEMO_PUBLIC_URL = "https://push-six-flax.vercel.app";

export default async function DemoCampaignsPage() {
  const baseUrl =
    (process.env.DEMO_BASE_URL?.trim() || null) ??
    (process.env.NEXT_PUBLIC_RENDER_URL?.trim() || null) ??
    DEMO_PUBLIC_URL;

  const campaigns = await Promise.all(
    DEMO_CAMPAIGNS.map(async (c) => ({
      ...c,
      qrUrl: await getQrDataUrl(`${baseUrl}/r/${c.token}`),
      referralUrl: `${baseUrl}/r/${c.token}`,
    })),
  );

  return (
    <main
      style={{
        minHeight: "100svh",
        background: "var(--surface, #f8f4e8)",
        padding: "48px 32px",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p
            style={{
              fontFamily: "var(--font-display, sans-serif)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--ink-4, #9a9792)",
              marginBottom: 6,
            }}
          >
            Push · Demo Mode
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display, sans-serif)",
              fontSize: 36,
              fontWeight: 800,
              color: "var(--ink, #1a1916)",
              margin: "0 0 8px",
            }}
          >
            Active Campaigns
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body, 'Open Sans')",
              fontSize: 15,
              color: "var(--ink-3, #61605c)",
              margin: 0,
            }}
          >
            Scan QR with phone → show code → verify at{" "}
            <Link
              href="/demo/terminal"
              style={{ color: "var(--brand-red, #c1121f)", fontWeight: 600 }}
            >
              /demo/terminal
            </Link>
          </p>
        </div>

        {/* Campaign cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {campaigns.map((c) => (
            <div
              key={c.id}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 28,
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                alignItems: "center",
              }}
            >
              {/* QR code */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.qrUrl}
                alt={`QR for ${c.merchantName}`}
                width={160}
                height={160}
                style={{ borderRadius: 8 }}
              />

              {/* Info */}
              <div style={{ textAlign: "center", width: "100%" }}>
                <div
                  style={{
                    display: "inline-block",
                    padding: "2px 10px",
                    borderRadius: 999,
                    background: `${c.accent}18`,
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display, sans-serif)",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: c.accent,
                    }}
                  >
                    {c.merchantType}
                  </span>
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-display, sans-serif)",
                    fontSize: 18,
                    fontWeight: 800,
                    color: "var(--ink, #1a1916)",
                    margin: "0 0 4px",
                  }}
                >
                  {c.merchantName}
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-body, 'Open Sans')",
                    fontSize: 13,
                    color: "var(--ink-3, #61605c)",
                    margin: "0 0 12px",
                  }}
                >
                  {c.offer}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "var(--surface, #f8f4e8)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                >
                  <span
                    style={{
                      color: "var(--ink-4, #9a9792)",
                      fontFamily: "var(--font-display, sans-serif)",
                      fontWeight: 600,
                    }}
                  >
                    Creator
                  </span>
                  <span
                    style={{
                      color: "var(--ink, #1a1916)",
                      fontFamily: "var(--font-display, sans-serif)",
                      fontWeight: 700,
                    }}
                  >
                    {c.creatorHandle}
                  </span>
                </div>
              </div>

              {/* Link — large enough to read at a glance */}
              <a
                href={c.referralUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-body, 'Open Sans', sans-serif)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--brand-red, #c1121f)",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                  letterSpacing: "0.01em",
                  wordBreak: "break-all",
                }}
              >
                {c.referralUrl}
              </a>
            </div>
          ))}
        </div>

        {/* Terminal link */}
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <Link
            href="/demo/terminal"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 32px",
              background: "var(--ink, #1a1916)",
              color: "#fff",
              borderRadius: 8,
              fontFamily: "var(--font-display, sans-serif)",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Open Staff Terminal →
          </Link>
        </div>
      </div>
    </main>
  );
}
