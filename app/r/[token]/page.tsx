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
        background: "#111110",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "56px 24px 48px",
        maxWidth: 440,
        margin: "0 auto",
        gap: 40,
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      {/* TOP — merchant identity */}
      <div style={{ width: "100%", textAlign: "center" }}>
        {/* eyebrow */}
        <p
          style={{
            fontFamily: "'Helvetica Neue',Arial,sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            margin: "0 0 10px",
          }}
        >
          {campaign.merchantType}
        </p>
        {/* name */}
        <h1
          style={{
            fontFamily: "'Helvetica Neue',Arial,sans-serif",
            fontSize: 32,
            fontWeight: 800,
            color: "#fff",
            margin: "0 0 12px",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          {campaign.merchantName}
        </h1>
        {/* offer pill */}
        <span
          style={{
            display: "inline-block",
            padding: "5px 16px",
            borderRadius: 999,
            background: `${campaign.accent}22`,
            border: `1px solid ${campaign.accent}55`,
            fontFamily: "'Helvetica Neue',Arial,sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: campaign.accent,
            letterSpacing: "0.01em",
          }}
        >
          {campaign.offer}
        </span>
      </div>

      {/* MIDDLE — code section */}
      <div style={{ width: "100%" }}>
        <p
          style={{
            textAlign: "center",
            fontFamily: "'Helvetica Neue',Arial,sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.25)",
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

      {/* BOTTOM — instruction */}
      <div style={{ width: "100%", textAlign: "center" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: 16,
            padding: "20px 24px",
            marginBottom: 16,
          }}
        >
          <p
            style={{
              fontFamily: "'Helvetica Neue',Arial,sans-serif",
              fontSize: 15,
              color: "rgba(255,255,255,0.75)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Show this screen to the cashier to redeem your offer
          </p>
        </div>
        <p
          style={{
            fontFamily: "'Helvetica Neue',Arial,sans-serif",
            fontSize: 11,
            color: "rgba(255,255,255,0.2)",
            margin: 0,
            letterSpacing: "0.05em",
          }}
        >
          via {campaign.creatorHandle} · Powered by Push
        </p>
      </div>
    </main>
  );
}
