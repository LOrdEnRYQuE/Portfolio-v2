import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { constructMetadata } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = constructMetadata();

import { I18nProvider } from "@/lib/i18n";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import JSONLD from "@/components/layout/JSONLD";
import CookieConsent from "@/components/layout/CookieConsent";
import dynamic from "next/dynamic";
import { LazyMotion, domAnimation } from "framer-motion";

import { ConvexClientProvider } from "@/components/ConvexClientProvider";

const AIConcierge = dynamic(() => import("@/components/ui/AIConcierge"));

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
        suppressHydrationWarning
      >
        <LazyMotion features={domAnimation}>
          <I18nProvider>
            <NextAuthProvider>
              <ConvexClientProvider>
                <JSONLD />
              <Navbar />
              <main className="pt-24">{children}</main>
              <AIConcierge />
                <Footer />
                <CookieConsent />
              </ConvexClientProvider>
            </NextAuthProvider>
          </I18nProvider>
        </LazyMotion>
      </body>
    </html>
  );
}
