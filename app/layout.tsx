import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@fontsource/raleway/300.css";
import "@fontsource/raleway/400.css";
import "@fontsource/raleway/500.css";
import "@fontsource/raleway/700.css";
import "@fontsource/raleway/900.css";
import "./globals.css";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CookieConsent } from "@/components/CookieConsent";
import { VoiceTour } from "@/components/VoiceTour";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Preloader } from "@/components/Preloader";
import { SITE } from "@/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nathan Tutors | The right tutor. Real results.",
    template: "%s | Nathan Tutors",
  },
  description: SITE.description,
  keywords: [
    "online tutor Kenya",
    "Kenyan tutors",
    "KCSE revision",
    "KCPE prep",
    "one-on-one tutoring",
    "private tutor Nairobi",
    "university tutor Kenya",
  ],
  authors: [{ name: "Nathan Tutors" }],
  openGraph: {
    title: "Nathan Tutors | The right tutor. Real results.",
    description: SITE.description,
    url: siteUrl,
    siteName: "Nathan Tutors",
    locale: "en_KE",
    type: "website",
    images: [{ url: "/images/hero-online-tutoring.jpg", width: 1200, height: 799, alt: "Student in an online tutoring session" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nathan Tutors | The right tutor. Real results.",
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0779e4",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-KE">
      <head>
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/fonts/icomoon/style.css" />
        <link rel="stylesheet" href="/fonts/brand/style.css" />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/nathan-tutors.css" />
      </head>
      <body className="nt-body">
        <a href="#main" className="nt-skip-link">
          Skip to main content
        </a>
        <Preloader />
        <SmoothScroll />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <CookieConsent />
        <VoiceTour />
        <WhatsAppButton />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
