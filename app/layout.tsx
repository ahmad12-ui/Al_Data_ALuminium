import type { Metadata } from "next";
import { playfair, manrope } from "@/lib/fonts";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { ChromeGate } from "@/components/layout/ChromeGate";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ALDATA | Aluminum & Interior Decorators",
    template: "%s | ALDATA",
  },
  description:
    "ALDATA Aluminum & Interior Decorators — premium interior design, aluminium and steel work, kitchen cabinets, and renovation across Sadiqabad and Dahrki.",
  keywords: [
    "ALDATA",
    "interior design",
    "aluminium work",
    "steel work",
    "kitchen cabinets",
    "renovation",
    "Sadiqabad",
    "Dahrki",
  ],
  openGraph: {
    title: "ALDATA | Aluminum & Interior Decorators",
    description: "We Don't Just Design, We Create Experiences.",
    url: siteUrl,
    siteName: "ALDATA",
    images: ["/logo/aldata-logo.png"],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ALDATA | Aluminum & Interior Decorators",
    description: "We Don't Just Design, We Create Experiences.",
    images: ["/logo/aldata-logo.png"],
  },
  icons: { icon: "/logo/aldata-logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${manrope.variable}`}>
      <head>
        {/*
          All project/hero/service images are served from Cloudinary. The LCP
          element on most pages is a Cloudinary-hosted image, so opening the
          connection (DNS + TLS) early — before the browser even parses the
          <img>/<Image> tag — shaves real time off the LCP image request.
        */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="font-body antialiased">
        <ToastProvider>
          <LoadingScreen />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <ChromeGate>
            <Footer />
          </ChromeGate>
          <WhatsAppButton />
        </ToastProvider>
      </body>
    </html>
  );
}
