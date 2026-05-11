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
import { EmptyState } from "@/components/merchant/shared";
import "@/components/disputes/disputes.css";

interface DisputesFilteredEmptyProps {
  activeTab: DisputeStatus | "all";
  onResetFilter: () => void;
  onOpenDispute: () => void;
}

function DisputesFilteredEmpty({
  activeTab,
  onResetFilter,
  onOpenDispute,
}: DisputesFilteredEmptyProps) {
  if (activeTab === "open") {
    return (
      <EmptyState
        artKind="disputes"
        title="No open disputes"
        description="Nothing is currently in dispute on your end. Open ones land here the moment a creator or your team flags an issue."
        ctaLabel="Show all disputes"
        ctaOnClick={onResetFilter}
      />
    );
  }
  if (activeTab === "under_review") {
    return (
      <EmptyState
        artKind="filter"
        artVariant="muted"
        title="Nothing under review"
        description="No disputes are awaiting Push ops review. We respond within 48 hours of escalation."
        ctaLabel="Show all disputes"
        ctaOnClick={onResetFilter}
      />
    );
  }
  if (activeTab === "awaiting_response") {
    return (
      <EmptyState
        artKind="filter"
        artVariant="muted"
        title="No replies needed"
        description="No disputes are waiting on a response from your team. Anything that needs your input lands here with a deadline."
        ctaLabel="Show all disputes"
        ctaOnClick={onResetFilter}
      />
    );
  }
  if (activeTab === "resolved") {
    return (
      <EmptyState
        artKind="filter"
        artVariant="muted"
        title="No resolved disputes yet"
        description="Wrapped disputes archive here with the final outcome and any agreed adjustments. Empty means none have closed yet."
        ctaLabel="Show all disputes"
        ctaOnClick={onResetFilter}
      />
    );
  }
  if (activeTab === "closed") {
    return (
      <EmptyState
        artKind="filter"
        artVariant="muted"
        title="No closed disputes"
        description="Disputes closed without action — typically withdrawn — file here for your records."
        ctaLabel="Show all disputes"
        ctaOnClick={onResetFilter}
      />
    );
  }
  return (
    <EmptyState
      artKind="filter"
      artVariant="muted"
      title="Nothing in this view"
      description="No disputes match the current filter. Reset to see your full case history, or open a new one if something needs attention."
      ctaLabel="Open a dispute"
      ctaOnClick={onOpenDispute}
    />
  );
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

export function DisputesClient() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [activeTab, setActiveTab] = useState<DisputeStatus | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const base = getDisputesForRole("merchant");
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
    <div className="disp-inner">
      {/* Stat band */}
      <div className="disp-stat-band" aria-label="Dispute overview">
        <div className="disp-stat-band__cell">
          <span
            className={`disp-stat-band__num${stats.open > 0 ? " disp-stat-band__num--red" : ""}`}
          >
            {stats.open}
          </span>
          <span className="disp-stat-band__label">Open</span>
        </div>
        <div className="disp-stat-band__rule" aria-hidden="true" />
        <div className="disp-stat-band__cell">
          <span className="disp-stat-band__num">{stats.resolved}</span>
          <span className="disp-stat-band__label">Resolved</span>
        </div>
        <div className="disp-stat-band__rule" aria-hidden="true" />
        <div className="disp-stat-band__cell">
          <span className="disp-stat-band__num">
            {stats.avgDays > 0 ? `${stats.avgDays}d` : "—"}
          </span>
          <span className="disp-stat-band__label">Avg to resolve</span>
        </div>
        <div className="disp-stat-band__cta-slot">
          <button
            className="btn btn-secondary"
            onClick={() => setModalOpen(true)}
            type="button"
          >
            + Open Dispute
          </button>
        </div>
      </div>

      {/* Status tab bar */}
      <div className="disp-tabs" role="tablist">
        {ALL_TABS.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            className={`disp-tab${activeTab === tab ? " disp-tab--active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="disp-list-area">
        {filtered.length === 0 && disputes.length > 0 ? (
          <DisputesFilteredEmpty
            activeTab={activeTab}
            onResetFilter={() => setActiveTab("all")}
            onOpenDispute={() => setModalOpen(true)}
          />
        ) : (
          <DisputeList disputes={filtered} basePath="/merchant/operations" />
        )}
      </div>

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
