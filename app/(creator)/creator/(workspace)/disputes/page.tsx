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
import "./disputes.css";

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
          <p className="cw-eyebrow">(MY&middot;DISPUTES)</p>
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
        <div className="cdp-stats">
          {[
            {
              value: stats.open,
              label: "Open",
              mod:
                stats.open > 0
                  ? "cdp-stat__value--open"
                  : "cdp-stat__value--neutral",
            },
            {
              value: stats.resolved,
              label: "Resolved",
              mod: "cdp-stat__value--neutral",
            },
            {
              value: stats.avgDays > 0 ? `${stats.avgDays}d` : "—",
              label: "Avg to Resolve",
              mod: "cdp-stat__value--neutral",
            },
          ].map((stat) => (
            <div key={stat.label} className="cdp-stat-card">
              <div className={`cdp-stat__value ${stat.mod}`}>{stat.value}</div>
              <div className="cdp-stat__label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Tab bar ──────────────────────────────────────── */}
        <div className="cdp-tabs" role="tablist">
          {ALL_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`cdp-tab${isActive ? " cdp-tab--active" : ""}`}
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
