"use client";

import "./disputes.css";
import { useState, useEffect } from "react";
import type { Dispute, DisputeStatus } from "@/lib/disputes/types";
import { DISPUTE_STATUS_LABELS } from "@/lib/disputes/types";
import {
  getDisputesForRole,
  getDisputeStats,
} from "@/lib/disputes/mock-disputes";
import { DisputeList } from "@/components/disputes/DisputeList";
import { NewDisputeModal } from "@/components/disputes/NewDisputeModal";
import "@/components/disputes/disputes.css";

/* ── Demo mode ───────────────────────────────────────────── */
function checkDemoMode(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("push-demo-role=merchant");
}

const ALL_TABS: (DisputeStatus | "all")[] = [
  "all",
  "open",
  "under_review",
  "awaiting_response",
  "resolved",
  "closed",
];

const TAB_LABELS: Record<DisputeStatus | "all", string> = {
  all: "All",
  ...DISPUTE_STATUS_LABELS,
};

export default function MerchantDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [activeTab, setActiveTab] = useState<DisputeStatus | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const demo = checkDemoMode();
    setIsDemo(demo);

    const base = getDisputesForRole("merchant");

    // Merge locally-created disputes
    const local = JSON.parse(
      localStorage.getItem("push-disputes") ?? "[]",
    ) as Dispute[];
    const localMerchant = local.filter((d) => d.filedByRole === "merchant");

    setDisputes([...localMerchant, ...base]);
  }, []);

  const filtered =
    activeTab === "all"
      ? disputes
      : disputes.filter((d) => d.status === activeTab);

  const stats = getDisputeStats(disputes);

  function handleCreated(dispute: Dispute) {
    setDisputes((prev) => [dispute, ...prev]);
  }

  return (
    <div
      style={{
        minHeight: "100svh",
        background: "var(--surface)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Page header */}
      <div
        style={{
          padding: "40px 32px 32px",
          borderBottom: "1px solid var(--hairline)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Merchant Portal
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px,4vw,40px)",
                fontWeight: 700,
                color: "var(--ink)",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Campaign Disputes
            </h1>
            <button
              className="btn-ghost click-shift"
              onClick={() => setModalOpen(true)}
              type="button"
              style={{
                padding: "10px 20px",
                fontSize: 13,
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: 8,
                border: "1px solid var(--hairline)",
                background: "transparent",
                color: "var(--ink)",
                transition: "transform 180ms",
              }}
            >
              + Open Dispute
            </button>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: 24,
              marginTop: 24,
              flexWrap: "wrap",
            }}
          >
            {[
              { value: stats.open, label: "Open", highlight: true },
              { value: stats.resolved, label: "Resolved", highlight: false },
              {
                value: stats.avgDays > 0 ? `${stats.avgDays}d` : "—",
                label: "Avg to resolve",
                highlight: false,
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--hairline)",
                  borderRadius: 10,
                  padding: "16px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  minWidth: 120,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 28,
                    fontWeight: 700,
                    color:
                      s.highlight && Number(s.value) > 0
                        ? "var(--brand-red)"
                        : "var(--ink)",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div className="eyebrow" style={{ fontSize: 10 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs + list */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px 80px" }}>
        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "20px 0",
            borderBottom: "1px solid var(--hairline)",
            overflowX: "auto",
          }}
          role="tablist"
        >
          {ALL_TABS.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 16px",
                fontSize: 12,
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: 20,
                border: "1px solid transparent",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
                background: activeTab === tab ? "var(--ink)" : "transparent",
                color: activeTab === tab ? "var(--snow)" : "var(--ink-4)",
                borderColor:
                  activeTab === tab ? "var(--ink)" : "var(--hairline)",
              }}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ marginTop: 24 }}>
          <DisputeList disputes={filtered} basePath="/merchant/disputes" />
        </div>
      </div>

      {/* Modal */}
      <NewDisputeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        filedByRole="merchant"
        filedBy="Flamingo Estate NYC"
        onCreated={handleCreated}
      />
    </div>
  );
}
