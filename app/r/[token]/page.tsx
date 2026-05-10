// Fan-facing referral code page.
// Fully SSR'd: code + secondsLeft come from the server so the page is
// readable even before JS hydrates. CodeDisplay then takes over for
// live polling every 5 s.
// Mobile-safe: no CSS custom properties, no svh units, no space-between flex.

import { notFound } from "next/navigation";
import { getCampaignByToken } from "@/lib/code/demo-data";
import { generateCode, secondsUntilNextCode } from "@/lib/code/totp";
import { CodeDisplay } from "./CodeDisplay";

export const dynamic = "force-dynamic";

export default async function ReferralPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const campaign = getCampaignByToken(token);
  if (!campaign) notFound();

  const code = generateCode(campaign.token);
  const secondsLeft = secondsUntilNextCode();

  return (
    <main
      style={{
        // Explicit hex instead of CSS var — works before globals.css loads
        background: "#1a1916",
        // Use vh with enough padding so it looks full-screen but doesn't clip
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "56px 24px 48px",
        maxWidth: 440,
        margin: "0 auto",
        gap: 40,
      }}
    >
      {/* ── Merchant info ────────────────────────────────────────── */}
      <div style={{ width: "100%", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            margin: "0 0 8px",
          }}
        >
          {campaign.merchantType}
        </p>
        <h1
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontSize: 28,
            fontWeight: 800,
            color: "#ffffff",
            margin: "0 0 6px",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          {campaign.merchantName}
        </h1>
        <p
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontSize: 15,
            color: campaign.accent,
            margin: 0,
            fontWeight: 600,
          }}
        >
          {campaign.offer}
        </p>
      </div>

      {/* ── Live code ────────────────────────────────────────────── */}
      <div style={{ width: "100%" }}>
        <p
          style={{
            textAlign: "center",
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            marginBottom: 20,
            marginTop: 0,
          }}
        >
          Your referral code
        </p>
        <CodeDisplay
          campaign={campaign}
          initialCode={code}
          initialSecondsLeft={secondsLeft}
        />
      </div>

      {/* ── Instruction ──────────────────────────────────────────── */}
      <div style={{ width: "100%", textAlign: "center" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.07)",
            borderRadius: 12,
            padding: "18px 20px",
            marginBottom: 16,
          }}
        >
          <p
            style={{
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 15,
              color: "rgba(255,255,255,0.8)",
              margin: 0,
              lineHeight: 1.55,
            }}
          >
            Show this code to the cashier to unlock your offer
          </p>
        </div>
        <p
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontSize: 11,
            color: "rgba(255,255,255,0.25)",
            margin: 0,
            letterSpacing: "0.06em",
          }}
        >
          via {campaign.creatorHandle} · Powered by Push
        </p>
      </div>
    </main>
  );
}
