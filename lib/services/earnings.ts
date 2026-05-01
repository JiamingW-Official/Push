// Earnings service — schema + mock data for creator calendar P0-4
// Real data comes from push_transactions + payments tables (v5.3 schema)

export interface EarningsBreakdown {
  /** Verified, settlement-complete payouts */
  confirmed: number;
  /** Posted & attributed but not yet settled */
  pending: number;
  /** Attribution window expiring, at risk of decay */
  atRisk: number;
  /** Rolling forecast vs confirmed — positive = ahead of track */
  forecastDelta: number;
  /** Monthly payout target (sum of all contracted payouts) */
  monthTarget: number;
  /** Running confirmed total per calendar day (index = day-1, 31 slots) */
  dailyRunningTotal: number[];
}

/** Aggregate earnings for a given YYYY-MM from push_transactions + payments.
 *  Until real DB aggregation is wired, returns deterministic mock data
 *  keyed to the May 2026 campaign set in mock-events.ts. */
export function getMockEarningsBreakdown(yearMonth: string): EarningsBreakdown {
  // May 2026: Flamingo $75, Glossier $120, KITH $199 — total $394
  const _ = yearMonth; // reserved for future DB query
  return {
    confirmed: 179,
    pending: 150,
    atRisk: 65,
    forecastDelta: 0,
    monthTarget: 394,
    // 31-slot array: cumulative confirmed per day (days 1–31)
    dailyRunningTotal: [
      0,
      0,
      0,
      0,
      0,
      0,
      0, // May 1–7:  nothing confirmed yet
      75,
      75,
      75,
      75,
      75,
      75,
      75, // May 8–14: Flamingo Estate settled
      179,
      179,
      179,
      179,
      179,
      179,
      179, // May 15–21: KITH partial
      179,
      179,
      179,
      179,
      179,
      179,
      179, // May 22–28
      179,
      179,
      179, // May 29–31
    ],
  };
}
