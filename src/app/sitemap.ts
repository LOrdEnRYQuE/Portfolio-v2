import { MetadataRoute } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import { siteConfig } from "@/content/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.domain;

  // Static core routes
  const staticRoutes = [
    "",
    "/projects",
    "/blog",
    "/contact",
    "/services",
    "/industries",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  try {
    // 1. Dynamic Pages
    const allPages = await fetchQuery(api.pages.listAll);
    const pageRoutes = allPages
      .filter((page) => page.published && page.isIndexed !== false)
      .map((page) => ({
        url: `${baseUrl}/${page.slug}`,
        lastModified: new Date(page._creationTime),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));

    // 2. Blog Posts
    const posts = await fetchQuery(api.posts.getPublishedPosts);
    const postRoutes = posts
      .filter((post) => post.isIndexed !== false)
      .map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post._creationTime),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));

    // 3. Portfolio Projects
    const projects = await fetchQuery(api.portfolio.listAll);
    const projectRoutes = projects
      .filter((project) => project.published !== false && project.isIndexed !== false)
      .map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(project._creationTime),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));

    // 4. Specialized Services
    const services = await fetchQuery(api.services.listPublished);
    const serviceRoutes = services
      .filter((s) => s.isIndexed !== false)
      .map((s) => ({
        url: `${baseUrl}/services/${s.slug}`,
        lastModified: new Date(s._creationTime),
        changeFrequency: "weekly" as const,
        priority: 0.9, // High priority for service landing pages
      }));

    // 5. Industry Hubs
    const industries = await fetchQuery(api.industries.listPublished);
    const industryRoutes = industries
      .filter((i) => i.isIndexed !== false)
      .map((i) => ({
        url: `${baseUrl}/industries/${i.slug}`,
        lastModified: new Date(i._creationTime),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      }));

    return [
      ...staticRoutes, 
      ...pageRoutes, 
      ...projectRoutes, 
      ...postRoutes, 
      ...serviceRoutes, 
      ...industryRoutes
    ];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return staticRoutes;
  }
}
