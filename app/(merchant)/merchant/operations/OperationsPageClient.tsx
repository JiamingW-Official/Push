"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import QRCodesClient from "../qr-codes/QRCodesClient";
import { RedeemClient } from "../redeem/RedeemClient";
import { DisputesClient } from "../disputes/DisputesClient";
import "./operations.css";

type OpsTab = "posters" | "redeem" | "disputes";

type QRCodeRecord = Awaited<
  ReturnType<
    (typeof import("@/lib/data/api-client"))["api"]["merchant"]["qrCodes"]["list"]
  >
>[number];

function OperationsInner({ initialQRs }: { initialQRs: QRCodeRecord[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<OpsTab>(
    rawTab === "redeem"
      ? "redeem"
      : rawTab === "disputes"
        ? "disputes"
        : "posters",
  );

  function handleTabChange(tab: OpsTab) {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "posters") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const qs = params.toString();
    router.replace(`/merchant/operations${qs ? `?${qs}` : ""}`, {
      scroll: false,
    });
  }

  const posterCount = initialQRs.length;

  return (
    <div className="ops-hub">
      {/* Hero */}
      <header className="ops-hero">
        <div className="ops-hero__left">
          <p className="ops-hero__eyebrow">Operations · In-Store</p>
          <h1 className="ops-hero__title">Operations</h1>
          <p className="ops-hero__sub">
            Print QR posters, redeem customer tickets, and manage campaign
            disputes — all in one place.
          </p>
        </div>
      </header>

      {/* Tab nav */}
      <div className="ops-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === "posters"}
          className={`ops-tab${activeTab === "posters" ? " ops-tab--active" : ""}`}
          onClick={() => handleTabChange("posters")}
        >
          QR Posters
          {posterCount > 0 && (
            <span className="ops-tab__badge">{posterCount}</span>
          )}
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "redeem"}
          className={`ops-tab${activeTab === "redeem" ? " ops-tab--active" : ""}`}
          onClick={() => handleTabChange("redeem")}
        >
          Redeem
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "disputes"}
          className={`ops-tab${activeTab === "disputes" ? " ops-tab--active" : ""}`}
          onClick={() => handleTabChange("disputes")}
        >
          Disputes
        </button>
      </div>

      {/* Tab content */}
      <div className="ops-tab-content" key={activeTab}>
        {activeTab === "posters" ? (
          <QRCodesClient initialQRs={initialQRs} />
        ) : activeTab === "redeem" ? (
          <RedeemClient />
        ) : (
          <DisputesClient />
        )}
      </div>
    </div>
  );
}

export default function OperationsPageClient({
  initialQRs,
}: {
  initialQRs: QRCodeRecord[];
}) {
  return (
    <Suspense fallback={null}>
      <OperationsInner initialQRs={initialQRs} />
    </Suspense>
  );
}
