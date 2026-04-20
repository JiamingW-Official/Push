"use client";

import { useEffect, useState } from "react";
import { formatTimeAgo } from "@/lib/utils/formatTime";

/**
 * Display-only component that shows `最后更新：X 秒前` and re-renders itself
 * every 10 s to keep the relative time advancing between 30 s data fetches.
 *
 * Isolated so its tick interval does NOT reconcile the KPI cards, creator
 * table, or reports table — they only re-render when `lastUpdated` changes.
 */
export default function LiveTimestamp({ lastUpdated }: { lastUpdated: Date }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 10_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="admin-timestamp">
      最后更新：{formatTimeAgo(lastUpdated)}
    </span>
  );
}
