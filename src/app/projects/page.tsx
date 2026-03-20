import { fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import ProjectsList from "@/components/sections/ProjectsList";

interface PortfolioProject {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  status: string;
  stack: string[] | string;
  cover: string;
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
  _creationTime?: number;
}

export default async function ProjectsPage() {
  const dynamicProjects = await fetchQuery(api.portfolio.listAll);
  const projects = (dynamicProjects as any) || [];

  return <ProjectsList projects={projects} />;
}
