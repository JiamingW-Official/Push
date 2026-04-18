import type { ReactNode } from "react";

// Admin layout — no public header/footer, isolated shell
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
