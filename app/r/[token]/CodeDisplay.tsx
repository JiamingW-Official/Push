"use client";
import { useState, useEffect, useCallback } from "react";
import { CountdownRing } from "@/components/code/CountdownRing";
import { CodeDigits } from "@/components/code/CodeDigits";
import type { DemoCampaign } from "@/lib/code/demo-data";

interface CodeDisplayProps {
  campaign: DemoCampaign;
  initialCode: string;
  initialSecondsLeft: number;
}

export function CodeDisplay({
  campaign,
  initialCode,
  initialSecondsLeft,
}: CodeDisplayProps) {
  const [code, setCode] = useState(initialCode);
  const [secondsLeft, setSecondsLeft] = useState(initialSecondsLeft);
  const [flash, setFlash] = useState(false);

  const fetchCode = useCallback(async () => {
    try {
      const res = await fetch(`/api/code/current/${campaign.token}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.code !== code) {
        setFlash(true);
        setTimeout(() => setFlash(false), 600);
      }
      setCode(data.code);
      setSecondsLeft(data.secondsLeft);
    } catch (_) {}
  }, [campaign.token, code]);

  // Poll every 5 seconds
  useEffect(() => {
    const t = setInterval(fetchCode, 5_000);
    return () => clearInterval(t);
  }, [fetchCode]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        padding: "32px 24px",
        opacity: flash ? 0.4 : 1,
        transition: "opacity 0.3s ease",
      }}
    >
      {/* Code display */}
      <CodeDigits code={code} accent={campaign.accent} />

      {/* Countdown ring */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <CountdownRing
          secondsLeft={secondsLeft}
          windowSize={15}
          size={64}
          stroke={campaign.accent}
        />
        <span
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.4)",
            fontFamily: "var(--font-darky, sans-serif)",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Code refreshes automatically
        </span>
      </div>
    </div>
  );
}
