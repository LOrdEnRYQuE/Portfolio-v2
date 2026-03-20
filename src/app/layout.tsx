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

export const metadata: Metadata = {
  ...constructMetadata(),
  manifest: "/manifest.json",
};

import { I18nProvider } from "@/lib/i18n";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import JSONLD from "@/components/layout/JSONLD";
import CookieConsent from "@/components/layout/CookieConsent";
import FramerMotionProvider from "@/components/providers/FramerMotionProvider";

import { ConvexClientProvider } from "@/components/ConvexClientProvider";


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
        <FramerMotionProvider>
          <I18nProvider>
            <NextAuthProvider>
              <ConvexClientProvider>
                <JSONLD />
              <Navbar />
              <main>{children}</main>
                <Footer />
                <CookieConsent />
              </ConvexClientProvider>
            </NextAuthProvider>
          </I18nProvider>
        </FramerMotionProvider>
      </body>
    </html>
  );
}
