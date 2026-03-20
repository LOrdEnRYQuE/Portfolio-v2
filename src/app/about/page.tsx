import React from "react";
import Navbar from "@/components/layout/Navbar";
import AboutView from "@/components/sections/AboutView";
import { constructMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "About",
  description: "Learn about LOrdEnRYQuE, a full-stack developer and AI engineer dedicated to building high-performance, conversion-focused digital products.",
  canonical: "/about"
});

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <AboutView />
    </>
  );
}
