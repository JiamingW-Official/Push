"use client";

import MetricsCard from "@/components/admin/MetricsCard";
import CreatorTable from "@/components/admin/CreatorTable";
import ReportsTable from "@/components/admin/ReportsTable";
import LiveTimestamp from "@/components/admin/LiveTimestamp";
import { useAdminMetrics } from "@/hooks/useAdminMetrics";
import "./dashboard.css";

export default function AdminDashboardPage() {
  const {
    metrics,
    creators,
    reports,
    isInitialLoading,
    isRefreshing,
    error,
    lastUpdated,
    refetch,
  } = useAdminMetrics();

  return (
    <div className="admin-shell">
      <header className="admin-titlebar">
        <div className="admin-titlebar__inner">
          <div>
            <h1 className="admin-title">Admin Dashboard</h1>
            <span className="admin-subtitle">Push · Live snapshot</span>
          </div>
          <div className="admin-titlebar__controls">
            {lastUpdated && <LiveTimestamp lastUpdated={lastUpdated} />}
            <button
              type="button"
              className="admin-refresh"
              onClick={() => {
                void refetch();
              }}
              disabled={isRefreshing || isInitialLoading}
              aria-busy={isRefreshing || isInitialLoading}
            >
              {isRefreshing || isInitialLoading ? "刷新中…" : "刷新"}
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        {error && (
          <div className="admin-alert" role="alert">
            <p className="admin-alert__text">
              部分数据未能加载，正在显示缓存数据。
            </p>
            <button
              type="button"
              className="admin-alert__retry"
              onClick={() => {
                void refetch();
              }}
              aria-label="重新加载数据"
            >
              重试
            </button>
          </div>
        )}

        <section className="admin-kpi-grid" aria-label="Key metrics">
          <MetricsCard
            label="Merchants"
            value={metrics?.merchants_count ?? "—"}
            color="#c1121f"
          />
          <MetricsCard
            label="Creators"
            value={metrics?.creators_count ?? "—"}
            color="#003049"
          />
          <MetricsCard
            label="Weekly Transactions"
            value={metrics?.weekly_transactions ?? "—"}
            color="#669bbc"
          />
          <MetricsCard
            label="Average ROI"
            value={metrics ? `${metrics.average_roi.toFixed(1)}%` : "—"}
            color="#780000"
          />
        </section>

        <section className="admin-section" aria-label="Creator funnel">
          <div className="admin-section__header">
            <h2 className="admin-section__title">Creator Funnel</h2>
            <span className="admin-section__meta">
              {creators.length} rows
              {isInitialLoading ? " · loading" : ""}
            </span>
          </div>
          <CreatorTable data={creators} />
        </section>

        <section className="admin-section" aria-label="Weekly merchant reports">
          <div className="admin-section__header">
            <h2 className="admin-section__title">Weekly Reports</h2>
            <span className="admin-section__meta">
              {reports.length} weeks
              {isInitialLoading ? " · loading" : ""}
            </span>
          </div>
          <ReportsTable data={reports} />
        </section>
      </main>
    </div>
  );
}
