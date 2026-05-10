interface CodeDigitsProps {
  code: string;
  accent?: string;
}

export function CodeDigits({ code, accent = "#fff" }: CodeDigitsProps) {
  const digits = code.padStart(6, "0").split("");
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {digits.map((d, i) => (
        <span
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 56,
            borderRadius: 10,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            fontFamily: "var(--font-darky, sans-serif)",
            fontSize: 32,
            fontWeight: 800,
            color: accent,
            letterSpacing: "-0.02em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {d}
        </span>
      ))}
    </div>
  );
}
