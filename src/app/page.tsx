import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import ContactCta from "@/components/sections/ContactCta";

import { constructMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Premium AI Engineering & Full-Stack Development",
  description: "High-performance web solutions and high-conversion UI design for modern businesses. Specializing in Next.js, AI Agents, and Scalable Digital Platforms.",
  canonical: "/"
});

import { fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";

export default async function HomePage() {
  const featuredProjects = await fetchQuery(api.portfolio.getFeatured);

  return (
    <>
      <Hero />
      <About />
      <Services />
      <FeaturedProjects initialData={featuredProjects as any} />
      <ContactCta />
    </>
  );
}
