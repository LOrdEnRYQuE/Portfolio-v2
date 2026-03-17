import { MetadataRoute } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import { siteConfig } from "@/content/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.domain;

  // Static routes
  const staticRoutes = [
    "",
    "/projects",
    "/blog",
    "/contact",
    "/client",
    "/demo-branches",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic Pages
  const pages = await fetchQuery(api.pages.listPublished);

  const pageRoutes = pages.map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: new Date(page._creationTime),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Blog Posts
  const posts = await fetchQuery(api.posts.getPublishedPosts);

  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post._creationTime),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Portfolio Projects
  const projects = await fetchQuery(api.portfolio.listAll);

  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project._creationTime),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...pageRoutes, ...postRoutes, ...projectRoutes];
}
