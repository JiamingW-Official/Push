import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileStickyBar from "@/components/layout/MobileStickyBar";
import "./_styles/mkt.css";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mkt-shell">
      <Header />
      {children}
      <Footer />
      <MobileStickyBar />
    </div>
  );
}
