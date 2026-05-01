import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import BackToTop from "@/components/layout/BackToTop";
import { CommandKProvider } from "@/components/search/CommandKProvider";
import { BRAND } from "@/lib/constants/brand";

export const metadata: Metadata = {
  title: {
    template: `%s | ${BRAND.name}`,
    default:
      "Push — Pay Per Verified Visit | Creator Marketing for NYC Businesses",
  },
  description:
    "Push connects NYC businesses with local creators. You only pay when a creator drives a verified visit — tracked by QR code. No followers minimum. No upfront fees.",
  keywords:
    "creator marketing, local marketing NYC, foot traffic, QR attribution, pay per visit, influencer marketing NYC",
  metadataBase: new URL(`https://${BRAND.domain}`),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: `${BRAND.name} Blog RSS Feed` },
        {
          url: "/rss/merchants",
          title: `${BRAND.name} Merchants Directory RSS`,
        },
      ],
      "application/atom+xml": [
        {
          url: "/changelog/feed.xml",
          title: `${BRAND.name} Changelog Atom Feed`,
        },
      ],
    },
  },
  openGraph: {
    title:
      "Push — Pay Per Verified Visit | Creator Marketing for NYC Businesses",
    description:
      "Push connects NYC businesses with local creators. You only pay when a creator drives a verified visit — tracked by QR code.",
    siteName: BRAND.name,
    locale: "en_US",
    type: "website",
    url: `https://${BRAND.domain}`,
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
    creator: BRAND.twitter,
    site: BRAND.twitter,
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="var(--ink)" />
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
