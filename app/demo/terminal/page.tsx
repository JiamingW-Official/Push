"use client";
import { useState } from "react";

type VerifyResult = {
  success: boolean;
  merchantName?: string;
  offer?: string;
  creatorHandle?: string;
  reward?: string;
  error?: string;
};

// Digit slot display — 6 boxes
function DigitSlots({ digits }: { digits: string[] }) {
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 44,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: digits[i]
              ? "2px solid rgba(255,255,255,0.7)"
              : "2px solid rgba(255,255,255,0.2)",
            fontFamily: "'Helvetica Neue',Arial,sans-serif",
            fontSize: 28,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {digits[i] ?? ""}
        </div>
      ))}
    </div>
  );
}

// Numpad keys
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

export default function TerminalPage() {
  const [digits, setDigits] = useState<string[]>([]);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function verify(code: string) {
    setLoading(true);
    let data: VerifyResult | null = null;
    try {
      const res = await fetch("/api/code/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      data = (await res.json()) as VerifyResult;
      setResult(data);
      setDigits([]);
    } catch {
      data = { success: false, error: "Network error" };
      setResult(data);
      setDigits([]);
    } finally {
      setLoading(false);
      // Use captured local var to avoid stale closure
      const autoClear = data?.success ? 5000 : 2500;
      setTimeout(() => setResult(null), autoClear);
    }
  }

  function pressKey(k: string) {
    if (loading || result) return;
    if (k === "⌫") {
      setDigits((d) => d.slice(0, -1));
      return;
    }
    if (k === "") return; // empty key (center of bottom row)
    setDigits((d) => {
      const next = [...d, k].slice(0, 6);
      if (next.length === 6) verify(next.join("")); // auto-submit
      return next;
    });
  }

  return (
    <main
      style={{
        background: "#111110",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        gap: 32,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontFamily: "'Helvetica Neue',Arial,sans-serif",
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#bfa170",
            margin: "0 0 4px",
          }}
        >
          PUSH
        </p>
        <p
          style={{
            fontFamily: "'Helvetica Neue',Arial,sans-serif",
            fontSize: 12,
            fontWeight: 500,
            color: "rgba(255,255,255,0.35)",
            margin: 0,
            letterSpacing: "0.06em",
          }}
        >
          Staff Verification Terminal
        </p>
      </div>

      {/* Digit display */}
      <DigitSlots digits={digits} />

      {/* Numpad */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 10,
          width: "100%",
          maxWidth: 280,
        }}
      >
        {KEYS.map((k, i) => (
          <button
            key={i}
            onClick={() => pressKey(k)}
            disabled={loading || !!result || k === ""}
            style={{
              height: 60,
              borderRadius: 12,
              background: k === "" ? "transparent" : "rgba(255,255,255,0.07)",
              border: "none",
              cursor: k === "" ? "default" : "pointer",
              fontFamily: "'Helvetica Neue',Arial,sans-serif",
              fontSize: k === "⌫" ? 20 : 24,
              fontWeight: 600,
              color: "#fff",
              opacity: k === "" ? 0 : 1,
              transition: "background 0.1s",
            }}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Verify button */}
      <button
        onClick={() => digits.length === 6 && verify(digits.join(""))}
        disabled={digits.length < 6 || loading || !!result}
        style={{
          width: "100%",
          maxWidth: 280,
          height: 56,
          borderRadius: 12,
          background:
            digits.length === 6 ? "#c1121f" : "rgba(255,255,255,0.05)",
          border: "none",
          cursor: digits.length === 6 ? "pointer" : "default",
          fontFamily: "'Helvetica Neue',Arial,sans-serif",
          fontSize: 16,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          transition: "background 0.2s",
        }}
      >
        {loading ? "Checking…" : "Verify →"}
      </button>

      {/* Result overlay */}
      {result && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: result.success
              ? "rgba(8,26,13,0.97)"
              : "rgba(26,8,8,0.97)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: "40px 24px",
          }}
        >
          <div style={{ fontSize: 72, lineHeight: 1, color: "#fff" }}>
            {result.success ? "✓" : "✗"}
          </div>
          <p
            style={{
              fontFamily: "'Helvetica Neue',Arial,sans-serif",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              color: result.success ? "#bfa170" : "#c1121f",
              margin: 0,
            }}
          >
            {result.success ? "Verified" : "Invalid Code"}
          </p>
          {result.success && (
            <>
              <p
                style={{
                  fontFamily: "'Helvetica Neue',Arial,sans-serif",
                  fontSize: 16,
                  color: "rgba(255,255,255,0.8)",
                  margin: 0,
                  textAlign: "center",
                }}
              >
                {result.offer}
              </p>
              <p
                style={{
                  fontFamily: "'Helvetica Neue',Arial,sans-serif",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.4)",
                  margin: 0,
                }}
              >
                {result.merchantName} · via {result.creatorHandle}
              </p>
              {result.reward && (
                <div
                  style={{
                    marginTop: 8,
                    padding: "8px 24px",
                    borderRadius: 999,
                    background: "rgba(191,161,112,0.15)",
                    border: "1px solid rgba(191,161,112,0.3)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Helvetica Neue',Arial,sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#bfa170",
                    }}
                  >
                    Creator earns {result.reward}
                  </span>
                </div>
              )}
            </>
          )}
          {!result.success && (
            <p
              style={{
                fontFamily: "'Helvetica Neue',Arial,sans-serif",
                fontSize: 14,
                color: "rgba(255,255,255,0.4)",
                margin: 0,
              }}
            >
              {result.error ?? "Code expired or already used"}
            </p>
          )}
        </div>
      )}
    </main>
  );
}
