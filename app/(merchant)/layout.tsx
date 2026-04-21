import type { ReactNode } from "react";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { MerchantSideNav } from "@/components/merchant/MerchantSideNav";

export default function MerchantLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DemoBanner />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <MerchantSideNav />
        <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
      </div>
    </>
  );
}
