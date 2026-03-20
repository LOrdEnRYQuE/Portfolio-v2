import React from "react";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import { projects as staticProjects } from "@/content/projects";
import { ProjectDetail } from "@/components/sections/ProjectDetail";
import { constructMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateStaticParams() {
  const projects = await fetchQuery(api.portfolio.listAll);
  
  // Combine with static ones just in case
  const dynamicSlugs = projects.map((p) => ({ slug: p.slug }));
  const staticSlugs = staticProjects.map((p) => ({ slug: p.slug }));
  
  // Dedup slugs
  const allSlugs = Array.from(new Set([...dynamicSlugs, ...staticSlugs].map(s => s.slug)))
    .map(slug => ({ slug }));

  return allSlugs;
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  
  // Try dynamic first
  let project = await fetchQuery(api.portfolio.getBySlug, { slug });
  
  // Fallback to static
  if (!project) {
    project = staticProjects.find((p) => p.slug === slug) as any;
  }

  if (!project) return {};

  return constructMetadata({
    title: `${project.title} | LOrdEnRYQuE`,
    description: project.summary,
    image: project.cover,
    canonical: `/projects/${slug}`
  });
}

export default async function ProjectDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  // Try dynamic first
  let project = await fetchQuery(api.portfolio.getBySlug, { slug });
  
  // Fallback to static
  if (!project) {
     project = staticProjects.find((p) => p.slug === slug) as any;
  }

  if (!project) {
    return notFound();
  }

  return <ProjectDetail project={project as any} />;
}
