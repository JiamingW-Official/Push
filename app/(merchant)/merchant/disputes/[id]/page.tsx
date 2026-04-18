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
          padding: "64px 32px",
          fontFamily: "var(--font-body)",
          color: "var(--text-muted)",
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
          padding: "64px 32px",
          fontFamily: "var(--font-body)",
          color: "var(--dark)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "32px",
            fontWeight: 900,
            marginBottom: "16px",
          }}
        >
          Dispute not found
        </p>
        <a href="/merchant/disputes" style={{ color: "var(--tertiary)" }}>
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
