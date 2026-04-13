import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/layout/CustomCursor";
import SmoothScroll from "@/components/layout/SmoothScroll";
import BackToTop from "@/components/layout/BackToTop";

export const metadata: Metadata = {
  title: "Push — Pay Per Verified Visit | Creator Marketing for NYC Businesses",
  description:
    "Push connects NYC businesses with local creators. You only pay when a creator drives a verified visit — tracked by QR code. No followers minimum. No upfront fees.",
  keywords:
    "creator marketing, local marketing NYC, foot traffic, QR attribution, pay per visit, influencer marketing NYC",
  metadataBase: new URL("https://pushnyc.co"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Push — Pay Per Verified Visit | Creator Marketing for NYC Businesses",
    description:
      "Push connects NYC businesses with local creators. You only pay when a creator drives a verified visit — tracked by QR code.",
    siteName: "Push",
    locale: "en_US",
    type: "website",
    url: "https://pushnyc.co",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Push — Pay Per Verified Visit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Push — Pay Per Verified Visit | Creator Marketing for NYC Businesses",
    description:
      "Push connects NYC businesses with local creators. You only pay when a creator drives a verified visit.",
    creator: "@pushnyc",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#003049" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link
          rel="preload"
          href="/fonts/Darky-Black.ttf"
          as="font"
          type="font/truetype"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Darky-ExtraLight.ttf"
          as="font"
          type="font/truetype"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/CSGenioMono-Regular.ttf"
          as="font"
          type="font/truetype"
          crossOrigin="anonymous"
        />
      </head>
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
