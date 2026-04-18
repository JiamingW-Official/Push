"use client";

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
    <div className="disputes-page">
      {/* Editorial hero */}
      <div className="disputes-hero">
        <p className="disputes-hero__eyebrow">Creator Portal · Disputes</p>
        <h1 className="disputes-hero__title">Your Disputes</h1>
        <div className="disputes-hero__stats">
          <div className="disputes-stat">
            <span className="disputes-stat__number disputes-stat__number--open">
              {stats.open}
            </span>
            <span className="disputes-stat__label">Open</span>
          </div>
          <div className="disputes-stat">
            <span className="disputes-stat__number disputes-stat__number--resolved">
              {stats.resolved}
            </span>
            <span className="disputes-stat__label">Resolved</span>
          </div>
          <div className="disputes-stat">
            <span className="disputes-stat__number">
              {stats.avgDays > 0 ? `${stats.avgDays}d` : "—"}
            </span>
            <span className="disputes-stat__label">Avg to resolve</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="disputes-toolbar">
        <div className="disputes-tabs" role="tablist">
          {ALL_TABS.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className={`disputes-tab${activeTab === tab ? " disputes-tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
        <button
          className="disputes-file-btn"
          onClick={() => setModalOpen(true)}
          type="button"
        >
          + File a dispute
        </button>
      </div>

      {/* List */}
      <DisputeList disputes={filtered} basePath="/creator/disputes" />

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
