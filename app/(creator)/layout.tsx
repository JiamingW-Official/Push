import type { ReactNode } from "react";
import { DemoBanner } from "@/components/layout/DemoBanner";

export default function CreatorLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DemoBanner />
      {children}
    </>
  );
}
