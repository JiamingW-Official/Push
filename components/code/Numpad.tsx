"use client";
import { useState, useCallback } from "react";

interface NumpadProps {
  onVerify: (code: string) => void;
  loading?: boolean;
}

export function Numpad({ onVerify, loading = false }: NumpadProps) {
  const [input, setInput] = useState("");

  const press = useCallback((val: string) => {
    setInput((prev) => {
      if (val === "DEL") return prev.slice(0, -1);
      if (prev.length >= 6) return prev;
      return prev + val;
    });
  }, []);

  const handleVerify = () => {
    if (input.length === 6) {
      onVerify(input);
      setInput("");
    }
  };

  const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "DEL"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        alignItems: "center",
      }}
    >
      {/* Input display */}
      <div style={{ display: "flex", gap: 8 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 48,
              height: 60,
              borderRadius: 10,
              border: `2px solid ${input[i] ? "rgba(191,161,112,0.7)" : "rgba(0,0,0,0.15)"}`,
              background: input[i] ? "#fff" : "var(--surface-2, #f5f3ee)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-darky, sans-serif)",
              fontSize: 28,
              fontWeight: 800,
              color: "var(--ink, #1a1916)",
            }}
          >
            {input[i] ?? ""}
          </div>
        ))}
      </div>

      {/* Numpad grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 72px)",
          gap: 12,
        }}
      >
        {KEYS.map((k, i) => (
          <button
            key={i}
            type="button"
            onClick={() => k && press(k)}
            disabled={!k}
            style={{
              height: 64,
              borderRadius: 12,
              border: "none",
              background:
                k === "DEL"
                  ? "rgba(193,18,31,0.08)"
                  : k === ""
                    ? "transparent"
                    : "var(--surface, #f8f4e8)",
              color: k === "DEL" ? "#c1121f" : "var(--ink, #1a1916)",
              fontFamily: "var(--font-darky, sans-serif)",
              fontSize: k === "DEL" ? 14 : 24,
              fontWeight: 700,
              cursor: k ? "pointer" : "default",
              transition: "transform 120ms ease, background 120ms ease",
              boxShadow: k ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
            }}
          >
            {k === "DEL" ? "⌫" : k}
          </button>
        ))}
      </div>

      {/* Verify button */}
      <button
        type="button"
        onClick={handleVerify}
        disabled={input.length < 6 || loading}
        style={{
          width: "100%",
          maxWidth: 240,
          padding: "14px 0",
          borderRadius: 8,
          border: "none",
          background:
            input.length === 6
              ? "var(--brand-red, #c1121f)"
              : "var(--surface-3, #ece9e0)",
          color: input.length === 6 ? "#fff" : "var(--ink-4, #9a9792)",
          fontFamily: "var(--font-darky, sans-serif)",
          fontSize: 15,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          cursor: input.length === 6 ? "pointer" : "default",
          transition: "all 160ms ease",
        }}
      >
        {loading ? "Verifying…" : "Verify"}
      </button>
    </div>
  );
}
