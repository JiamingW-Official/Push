import {
  getAttributionSummary,
  type AttributionSummary,
} from "@/lib/data/api-client";
import AnalyticsPageClient from "./AnalyticsPageClient";

const WINDOW_DAYS = 30;

function isoOffsetDays(from: Date, days: number): string {
  const next = new Date(from);
  next.setDate(from.getDate() - days);
  return next.toISOString();
}

async function getPeriods(): Promise<{
  current: AttributionSummary;
  previous: AttributionSummary;
}> {
  const now = new Date();
  const currentTo = now.toISOString();
  const currentFrom = isoOffsetDays(now, WINDOW_DAYS);
  const previousFrom = isoOffsetDays(now, WINDOW_DAYS * 2);

  const [current, previous] = await Promise.all([
    getAttributionSummary({ from: currentFrom, to: currentTo }),
    getAttributionSummary({ from: previousFrom, to: currentFrom }),
  ]);

  return { current, previous };
}

export default async function MerchantAnalyticsPage() {
  const { current, previous } = await getPeriods();

  return (
    <AnalyticsPageClient
      summary={current}
      previous={previous}
      windowDays={WINDOW_DAYS}
    />
  );
}
