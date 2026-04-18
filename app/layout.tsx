import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/layout/CustomCursor";
import SmoothScroll from "@/components/layout/SmoothScroll";
import BackToTop from "@/components/layout/BackToTop";
import { CommandKProvider } from "@/components/search/CommandKProvider";

export const metadata: Metadata = {
  title: {
    template: "%s | Push",
    default:
      "Push — Vertical AI for Local Commerce | Customer Acquisition Engine for Local Coffee+",
  },
  description:
    "Vertical AI for Local Commerce. A Customer Acquisition Engine for local Coffee+ operators — ConversionOracle™ (Claude Vision + OCR + geo) verifies every customer in <8s. $0 Pilot for first 10 Williamsburg Coffee+ merchants, then $500/mo min + $15–85 per verified customer. SLR north-star: 25.",
  keywords:
    "Vertical AI for Local Commerce, Customer Acquisition Engine, ConversionOracle, Software Leverage Ratio, SLR, local commerce AI, Williamsburg Coffee+, AI foot traffic verification, outcome-based pricing, Claude Vision receipt OCR",
  metadataBase: new URL("https://push-six-flax.vercel.app"),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "Push Blog RSS Feed" },
        { url: "/rss/merchants", title: "Push Merchants Directory RSS" },
      ],
      "application/atom+xml": [
        { url: "/changelog/feed.xml", title: "Push Changelog Atom Feed" },
      ],
    },
  },
  openGraph: {
    title:
      "Push — Vertical AI for Local Commerce | Customer Acquisition Engine for Local Coffee+",
    description:
      "Tell us how many customers you need. ConversionOracle™ verifies every visit in <8s via Claude Vision + OCR + geo. $0 Pilot for first 10 Williamsburg Coffee+ merchants. SLR north-star: 25.",
    siteName: "Push",
    locale: "en_US",
    type: "website",
    url: "https://push-six-flax.vercel.app",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Push — Vertical AI for Local Commerce",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Push — Vertical AI for Local Commerce | Customer Acquisition Engine for Local Coffee+",
    description:
      "Customer Acquisition Engine for local Coffee+. ConversionOracle™ verifies every customer in <8s. Pay only for delivered customers.",
    creator: "@pushnyc",
    site: "@pushnyc",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "format-detection": "telephone=no",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg" }],
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
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <CustomCursor />
        <CommandKProvider>
          <SmoothScroll>
            {children}
            <BackToTop />
          </SmoothScroll>
        </CommandKProvider>
      </body>
    </html>
  );
}
