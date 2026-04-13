import type { ReactNode } from "react";
import { DemoBanner } from "@/components/creator/DemoBanner";

export default function CreatorLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <DemoBanner />
    </>
  );
}
