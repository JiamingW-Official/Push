import { api } from "@/lib/data/api-client";
import OperationsPageClient from "./OperationsPageClient";

export const metadata = { title: "Operations – Push Merchant" };

export default async function OperationsPage() {
  const initialQRs = await api.merchant.qrCodes.list({ status: "all" });
  return <OperationsPageClient initialQRs={initialQRs} />;
}
