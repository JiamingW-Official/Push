"use client";
import { useState } from "react";
import { Numpad } from "@/components/code/Numpad";
import { CheckCircle2, XCircle } from "lucide-react";

type VerifyResult = {
  success: boolean;
  merchantName?: string;
  offer?: string;
  creatorHandle?: string;
  error?: string;
};

export default function TerminalPage() {
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleVerify(code: string) {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/code/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setResult(data);
    } catch (_) {
      setResult({ success: false, error: "Network error" });
    } finally {
      setLoading(false);
      // Auto-clear success after 4s
      setTimeout(() => setResult(null), 4000);
    }
  }

  return (
    <main
      style={{
        minHeight: "100svh",
        background: "#fff",
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
            fontFamily: "var(--font-display, sans-serif)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--ink-4, #9a9792)",
            margin: "0 0 6px",
          }}
        >
          Push · Staff Terminal
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display, sans-serif)",
            fontSize: 22,
            fontWeight: 800,
            color: "var(--ink, #1a1916)",
            margin: 0,
          }}
        >
          Enter Customer Code
        </h1>
      </div>

      {/* Result */}
      {result && (
        <div
          style={{
            width: "100%",
            maxWidth: 300,
            padding: "20px 24px",
            borderRadius: 12,
            background: result.success
              ? "rgba(22, 163, 74, 0.08)"
              : "rgba(193,18,31,0.08)",
            border: `1px solid ${result.success ? "rgba(22,163,74,0.25)" : "rgba(193,18,31,0.2)"}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          {result.success ? (
            <CheckCircle2 size={32} color="#16a34a" strokeWidth={1.5} />
          ) : (
            <XCircle size={32} color="#c1121f" strokeWidth={1.5} />
          )}
          <p
            style={{
              fontFamily: "var(--font-display, sans-serif)",
              fontSize: 16,
              fontWeight: 800,
              color: result.success ? "#16a34a" : "#c1121f",
              margin: 0,
            }}
          >
            {result.success ? "Verified!" : "Invalid Code"}
          </p>
          {result.success && (
            <>
              <p
                style={{
                  fontFamily: "var(--font-body, 'Open Sans')",
                  fontSize: 13,
                  color: "var(--ink-3, #61605c)",
                  margin: 0,
                  textAlign: "center",
                }}
              >
                {result.offer}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display, sans-serif)",
                  fontSize: 11,
                  color: "rgba(0,0,0,0.35)",
                  margin: 0,
                  letterSpacing: "0.06em",
                }}
              >
                via {result.creatorHandle}
              </p>
            </>
          )}
          {!result.success && (
            <p
              style={{
                fontFamily: "var(--font-body, 'Open Sans')",
                fontSize: 13,
                color: "var(--ink-4, #9a9792)",
                margin: 0,
              }}
            >
              {result.error ?? "Code expired or not found"}
            </p>
          )}
        </div>
      )}

      {/* Numpad */}
      <Numpad onVerify={handleVerify} loading={loading} />
    </main>
  );
}
