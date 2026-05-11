"use client";
import { useState, useEffect, useCallback } from "react";
import { CountdownRing } from "@/components/code/CountdownRing";
import { CodeDigits } from "@/components/code/CodeDigits";
import type { DemoCampaign } from "@/lib/code/demo-data";
import type { RedemptionEntry } from "@/lib/code/redemption-store";

interface CodeDisplayProps {
  campaign: DemoCampaign;
  initialCode: string;
  initialSecondsLeft: number;
  initialRedeemed?: boolean;
}

// Full-screen success overlay shown after staff verifies the code
function SuccessOverlay({ campaign }: { campaign: DemoCampaign }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a1a0f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 32px",
        gap: 0,
        zIndex: 100,
      }}
    >
      {/* Checkmark */}
      <svg
        width={96}
        height={96}
        viewBox="0 0 96 96"
        fill="none"
        aria-hidden
        style={{ marginBottom: 32 }}
      >
        <circle cx={48} cy={48} r={44} fill="rgba(22,163,74,0.18)" />
        <polyline
          points="26,50 42,66 70,34"
          stroke="#4ade80"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Offer Unlocked headline */}
      <p
        style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontSize: 36,
          fontWeight: 800,
          color: "#ffffff",
          margin: "0 0 16px",
          letterSpacing: "-0.02em",
          textAlign: "center",
          lineHeight: 1.1,
        }}
      >
        Offer Unlocked!
      </p>

      {/* The offer */}
      <p
        style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontSize: 20,
          fontWeight: 700,
          color: campaign.accent,
          margin: "0 0 24px",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {campaign.offer}
      </p>

      {/* Subtext */}
      <p
        style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontSize: 17,
          fontWeight: 400,
          color: "rgba(255,255,255,0.6)",
          margin: "0 0 48px",
          textAlign: "center",
        }}
      >
        Enjoy your visit
      </p>

      {/* Attribution */}
      <p
        style={{
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          fontSize: 11,
          color: "rgba(255,255,255,0.25)",
          margin: 0,
          letterSpacing: "0.06em",
          textAlign: "center",
        }}
      >
        via {campaign.creatorHandle} · Powered by Push
      </p>
    </div>
  );
}

export function CodeDisplay({
  campaign,
  initialCode,
  initialSecondsLeft,
  initialRedeemed = false,
}: CodeDisplayProps) {
  const [code, setCode] = useState(initialCode);
  const [secondsLeft, setSecondsLeft] = useState(initialSecondsLeft);
  const [flash, setFlash] = useState(false);
  const [redeemed, setRedeemed] = useState(initialRedeemed);

  const fetchCode = useCallback(async () => {
    try {
      const res = await fetch(`/api/code/current/${campaign.token}`, {
        cache: "no-store",
      });
      const data = (await res.json()) as {
        code: string;
        secondsLeft: number;
        windowSize: number;
        redeemed: boolean;
        redemption: RedemptionEntry | null;
      };

      if (data.redeemed) {
        setRedeemed(true);
        return;
      }

      if (data.code !== code) {
        setFlash(true);
        setTimeout(() => setFlash(false), 600);
      }
      setCode(data.code);
      setSecondsLeft(data.secondsLeft);
    } catch (_) {
      // silently ignore network errors — user still sees last code
    }
  }, [campaign.token, code]);

  // Poll every 3 seconds for faster redemption feedback
  useEffect(() => {
    const t = setInterval(fetchCode, 3_000);
    return () => clearInterval(t);
  }, [fetchCode]);

  if (redeemed) {
    return <SuccessOverlay campaign={campaign} />;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 28,
        padding: "40px 24px",
        opacity: flash ? 0.3 : 1,
        transition: "opacity 0.25s ease",
      }}
    >
      {/* Large dramatic code digits */}
      <CodeDigits code={code} accent={campaign.accent} />

      {/* Countdown ring */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <CountdownRing
          secondsLeft={secondsLeft}
          windowSize={15}
          size={72}
          stroke={campaign.accent}
        />
        <span
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.35)",
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontWeight: 700,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
          }}
        >
          Refreshes automatically
        </span>
      </div>
    </div>
  );
}
