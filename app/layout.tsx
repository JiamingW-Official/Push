import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/layout/CustomCursor";
import SmoothScroll from "@/components/layout/SmoothScroll";
import BackToTop from "@/components/layout/BackToTop";

export const metadata: Metadata = {
  title: "Push — Turn Creators into Results",
  description:
    "NYC's local creator marketplace. Creators post. Customers show up. You only pay when it works — verified by QR attribution.",
  openGraph: {
    title: "Push — Turn Creators into Results",
    description:
      "NYC's local creator marketplace connecting businesses with creators who drive verified foot traffic.",
    siteName: "Push",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Push — Turn Creators into Results",
    description:
      "NYC's local creator marketplace. Creators post. Customers show up.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CustomCursor />
        <SmoothScroll>
          {children}
          <BackToTop />
        </SmoothScroll>
      </body>
    </html>
  );
}
