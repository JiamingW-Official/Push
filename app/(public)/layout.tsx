import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import MobileStickyBar from "@/components/layout/MobileStickyBar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <Header />
      {children}
      <Footer />
      <MobileStickyBar />
    </SmoothScroll>
  );
}
