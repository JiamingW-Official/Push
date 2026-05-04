/** Stat card with BigNumber inside, hover lift, Pearl Stone bright background. */
"use client";

import { BigNumber } from "./BigNumber";

interface StatCardProps {
  title: string;
  value: number | string;
  change?: number | string;
  changeDirection?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
}

export function StatCard({
  title,
  value,
  change,
  changeDirection,
  icon,
}: StatCardProps) {
  return (
    <div
      style={{
        background: "var(--surface-3)",
        border: "1px solid var(--line)",
        borderRadius: 0,
        padding: "var(--space-4)",
        position: "relative",
        transition:
          "transform 360ms cubic-bezier(0.32, 0.72, 0, 1), box-shadow 360ms cubic-bezier(0.32, 0.72, 0, 1)",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-2px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 16px rgba(10,10,10,0.10)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {icon && (
        <div
          style={{
            marginBottom: "var(--space-2)",
            color: "var(--graphite)",
            display: "flex",
            alignItems: "center",
          }}
        >
          {icon}
        </div>
      )}

      <BigNumber
        value={value}
        label={title}
        delta={change}
        deltaDirection={changeDirection}
      />
    </div>
  );
}
