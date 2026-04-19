"use client";

import type { Creator, Payout } from "@/lib/creator/types";
import "./EarningsSummary.css";

interface EarningsSummaryProps {
  payouts: Payout[];
  creator: Creator | null;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EarningsSummary({
  payouts,
  creator,
}: EarningsSummaryProps) {
  const totalEarned = creator?.earnings_total ?? 0;
  const pending = creator?.earnings_pending ?? 0;
  const completed = creator?.campaigns_completed ?? 0;

  return (
    <div className="es-root">
      {/* Stat cards */}
      <div className="es-stats">
        <div className="es-card">
          <span className="es-card__label">Total Earned</span>
          <span className="es-card__value">${totalEarned}</span>
        </div>
        <div className="es-card">
          <span className="es-card__label">Pending</span>
          <span className="es-card__value">${pending}</span>
        </div>
        <div className="es-card">
          <span className="es-card__label">Campaigns Done</span>
          <span className="es-card__value">{completed}</span>
        </div>
      </div>

      {/* Payout history */}
      <div className="es-history">
        <h3 className="es-history__heading">Payout History</h3>

        {payouts.length === 0 ? (
          <div className="es-empty">
            <p className="es-empty__text">
              No payouts yet. Complete your first campaign to earn.
            </p>
          </div>
        ) : (
          <table className="es-table" aria-label="Payout history">
            <thead>
              <tr>
                <th className="es-th">Campaign</th>
                <th className="es-th">Merchant</th>
                <th className="es-th es-th--right">Amount</th>
                <th className="es-th es-th--right">Status</th>
                <th className="es-th es-th--right">Date</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p.id} className="es-tr">
                  <td className="es-td es-td--campaign">{p.campaign_title}</td>
                  <td className="es-td">{p.merchant_name}</td>
                  <td className="es-td es-td--right es-td--amount">
                    ${p.amount}
                  </td>
                  <td className="es-td es-td--right">
                    <span className={`es-pill es-pill--${p.status}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="es-td es-td--right es-td--date">
                    {formatDate(p.paid_at ?? p.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
