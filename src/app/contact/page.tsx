import React from "react";
import Navbar from "@/components/layout/Navbar";
import ContactView from "@/components/sections/ContactView";
import { constructMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Contact",
  description: "Ready to grow your business? Reach out to start building your custom website, mobile app, or AI-integrated product today.",
  canonical: "/contact"
});

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <ContactView />
    </>
  );
}
