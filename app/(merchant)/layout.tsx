import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { MerchantShell } from "@/components/merchant/shell";

export const metadata: Metadata = {
  title: {
    template: "%s | Push Merchant",
    default: "Push Merchant",
  },
};

export default function MerchantLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DemoBanner />
      <MerchantShell>{children}</MerchantShell>
    </>
  );
}
