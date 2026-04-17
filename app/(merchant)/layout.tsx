import type { ReactNode } from "react";
import { DemoBanner } from "@/components/layout/DemoBanner";

export default function MerchantLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DemoBanner />
      {children}
    </>
  );
}
