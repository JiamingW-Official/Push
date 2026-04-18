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
      "Push — AI-Powered Customer Acquisition Agency | $0 Pilot for Local Businesses",
  },
  description:
    "AI-powered customer acquisition agency. Tell us how many customers you need — Claude matches creators, verifies every visit via QR + Vision OCR + geo. Pay only for who walks through your door. $0 Pilot for first 10 merchants.",
  keywords:
    "AI customer acquisition, AI marketing agency, outcome-based pricing, local business marketing, AI creator matching, verified foot traffic, Williamsburg coffee",
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
      "Push — AI-Powered Customer Acquisition Agency | $0 Pilot for Local Businesses",
    description:
      "Tell us how many customers you need. Claude matches creators in 60s. Every customer AI-verified. Pay only for who walks through your door.",
    siteName: "Push",
    locale: "en_US",
    type: "website",
    url: "https://push-six-flax.vercel.app",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Push — AI-Powered Customer Acquisition Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Push — AI-Powered Customer Acquisition Agency | $0 Pilot for Local Businesses",
    description:
      "Tell us how many customers you need. Claude matches creators. AI verifies every visit. Pay only for delivered customers.",
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
