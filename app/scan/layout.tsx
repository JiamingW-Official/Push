import type { ReactNode } from "react";
import { DemoBanner } from "@/components/layout/DemoBanner";

/**
 * Consumer-audience layout. Mounts the DemoBanner so a user who entered
 * via `/demo` → Consumer sees the banner here and on the /scan/[qrId]/verify
 * child. When no demo cookie is set the banner is a no-op render, so this
 * layout is free to add for real consumers too.
 */
export default function ScanLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DemoBanner />
      {children}
    </>
  );
}
