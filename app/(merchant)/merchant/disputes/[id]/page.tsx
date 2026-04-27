"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dispute } from "@/lib/disputes/types";
import { getDisputeById } from "@/lib/disputes/mock-disputes";
import { DisputeDetail } from "@/components/disputes/DisputeDetail";
import "@/components/disputes/disputes.css";

function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=merchant");
}

export default function MerchantDisputeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkDemoMode();

    const local = JSON.parse(
      localStorage.getItem("push-disputes") ?? "[]",
    ) as Dispute[];
    const localMatch = local.find((d) => d.id === id);

    const found = localMatch ?? getDisputeById(id);
    setDispute(found ?? null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100svh",
          background: "var(--surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-body)",
          color: "var(--ink-4)",
          fontSize: 14,
        }}
      >
        Loading…
      </div>
    );
  }

  if (!dispute) {
    return (
      <div
        style={{
          minHeight: "100svh",
          background: "var(--surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
          fontFamily: "var(--font-body)",
          padding: "64px 32px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            fontWeight: 700,
            color: "var(--ink)",
            margin: 0,
          }}
        >
          Dispute not found
        </p>
        <a
          href="/merchant/disputes"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--accent-blue)",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          ← Back to disputes
        </a>
      </div>
    );
  }

  return (
    <DisputeDetail
      dispute={dispute}
      viewerRole="merchant"
      viewerName="Flamingo Estate NYC"
      basePath="/merchant/disputes"
    />
  );
}
