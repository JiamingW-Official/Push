"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  return document.cookie.includes("push-demo-role=creator");
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

export default function CreatorDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [activeTab, setActiveTab] = useState<DisputeStatus | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const demo = checkDemoMode();
    setIsDemo(demo);

    // Base disputes from mock data
    const base = getDisputesForRole("creator");

    // Merge any locally-created disputes
    const local = JSON.parse(
      localStorage.getItem("push-disputes") ?? "[]",
    ) as Dispute[];
    const localCreator = local.filter((d) => d.filedByRole === "creator");

    setDisputes([...localCreator, ...base]);
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
    <div className="cw-page">
      <header className="cw-header">
        <div className="cw-header__left">
          <p className="cw-eyebrow">DISPUTES</p>
          <h1 className="cw-title">Disputes</h1>
        </div>
        <div className="cw-header__right">
          <button
            type="button"
            className="cw-pill cw-pill--urgent"
            onClick={() => setModalOpen(true)}
          >
            + Open Dispute
          </button>
        </div>
      </header>

      <div>
        {/* ── Stats row ────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {[
            {
              value: stats.open,
              label: "Open",
              accent: stats.open > 0 ? "var(--brand-red)" : "var(--ink)",
            },
            { value: stats.resolved, label: "Resolved", accent: "var(--ink)" },
            {
              value: stats.avgDays > 0 ? `${stats.avgDays}d` : "—",
              label: "Avg to Resolve",
              accent: "var(--ink)",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--hairline)",
                borderRadius: 10,
                padding: 24,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 40,
                  fontWeight: 700,
                  color: stat.accent,
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "var(--ink-4)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Tab bar ──────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 24,
            borderBottom: "1px solid var(--hairline)",
            paddingBottom: 0,
          }}
          role="tablist"
        >
          {ALL_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  color: isActive ? "var(--ink)" : "var(--ink-4)",
                  background: "none",
                  border: "none",
                  borderBottom: isActive
                    ? "2px solid var(--brand-red)"
                    : "2px solid transparent",
                  padding: "8px 16px",
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  fontWeight: isActive ? 600 : 400,
                  transition: "color 0.15s",
                  marginBottom: -1,
                }}
              >
                {TAB_LABELS[tab]}
              </button>
            );
          })}
        </div>

        {/* ── Dispute list ─────────────────────────────────── */}
        <DisputeList disputes={filtered} basePath="/creator/disputes" />
      </div>

      {/* Modal */}
      <NewDisputeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        filedByRole="creator"
        filedBy="Alex Rivera"
        onCreated={handleCreated}
      />
    </div>
  );
}
