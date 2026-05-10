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
        minHeight: "100svh",
        background: "var(--ink, #1a1916)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "48px 24px 40px",
        maxWidth: 420,
        margin: "0 auto",
      }}
    >
      {/* Top: merchant info */}
      <div style={{ width: "100%", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-darky, sans-serif)",
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
            fontFamily: "var(--font-darky, sans-serif)",
            fontSize: 26,
            fontWeight: 800,
            color: "#fff",
            margin: "0 0 4px",
            letterSpacing: "-0.02em",
          }}
        >
          {campaign.merchantName}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body, 'Open Sans', sans-serif)",
            fontSize: 14,
            color: campaign.accent,
            margin: 0,
            fontWeight: 600,
          }}
        >
          {campaign.offer}
        </p>
      </div>

      {/* Middle: live code */}
      <div style={{ width: "100%" }}>
        <p
          style={{
            textAlign: "center",
            fontFamily: "var(--font-darky, sans-serif)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            marginBottom: 20,
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

      {/* Bottom: instruction + creator attribution */}
      <div style={{ width: "100%", textAlign: "center" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body, 'Open Sans', sans-serif)",
              fontSize: 14,
              color: "rgba(255,255,255,0.75)",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Show this code to the cashier to unlock your offer
          </p>
        </div>
        <p
          style={{
            fontFamily: "var(--font-darky, sans-serif)",
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
