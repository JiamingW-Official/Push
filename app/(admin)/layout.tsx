import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Push Admin",
  description: "Push internal admin panel",
  robots: { index: false, follow: false },
};

// Admin group layout — no external nav/footer chrome
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
