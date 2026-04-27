"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Dispute } from "@/lib/disputes/types";
import { getDisputeById } from "@/lib/disputes/mock-disputes";
import { DisputeDetail } from "@/components/disputes/DisputeDetail";
import "@/components/disputes/disputes.css";

function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=creator");
}

export default function CreatorDisputeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkDemoMode();

    // Check localStorage first (optimistic creates)
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
          background: "var(--surface)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--ink-4)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Loading
        </span>
      </div>
    );
  }

  if (!dispute) {
    return (
      <div
        style={{
          background: "var(--surface)",
          minHeight: "100vh",
          paddingBottom: 96,
        }}
      >
        {/* Back nav */}
        <div
          style={{
            borderBottom: "1px solid var(--hairline)",
            padding: "16px 64px",
          }}
        >
          <Link
            href="/creator/disputes"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              color: "var(--ink-4)",
              textDecoration: "none",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            &larr; Disputes
          </Link>
        </div>

        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            padding: "96px 64px",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--ink-4)",
              display: "block",
              marginBottom: 16,
            }}
          >
            NOT FOUND
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 40,
              fontWeight: 700,
              color: "var(--ink)",
              margin: "0 0 24px",
              lineHeight: 1.1,
            }}
          >
            Dispute not found
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 18,
              color: "var(--ink-3)",
              lineHeight: 1.55,
              margin: "0 0 32px",
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            This dispute may have been removed or the link is incorrect.
          </p>
          <Link
            href="/creator/disputes"
            className="btn-primary click-shift"
            style={{ textDecoration: "none", display: "inline-block" }}
          >
            View all disputes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--surface)",
        minHeight: "100vh",
        paddingBottom: 96,
      }}
    >
      {/* Back nav */}
      <div
        style={{
          borderBottom: "1px solid var(--hairline)",
          padding: "16px 64px",
        }}
      >
        <Link
          href="/creator/disputes"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            color: "var(--ink-4)",
            textDecoration: "none",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          &larr; Disputes
        </Link>
      </div>

      <DisputeDetail
        dispute={dispute}
        viewerRole="creator"
        viewerName="Alex Rivera"
        basePath="/creator/disputes"
      />
    </div>
  );
}
