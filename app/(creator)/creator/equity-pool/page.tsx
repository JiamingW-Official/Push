// Creator Equity Pool — Push v5.1
// Two-Segment Creator Economics · Vertical AI for Local Commerce
// T5 Closer + T6 Partner signup with RSA / profit-share election
// Auth-gated (middleware protects /creator/*) · noindex

import type { Metadata } from "next";
import EquityPoolClient from "./equity-pool-client";
import "./equity-pool.css";

export const metadata: Metadata = {
  title: "Creator Equity Pool — T5 Closer / T6 Partner | Push",
  description:
    "Push Creator Equity Pool signup. T5 Closer + T6 Partner equity allocations under Two-Segment Creator Economics. RSA or profit-share election; Delaware corp terms; 83(b) filing flow.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function EquityPoolPage() {
  return <EquityPoolClient />;
}
