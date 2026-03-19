"use client";

import { motion } from "framer-motion";
import { projects } from "@/content/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useState, useEffect } from "react";

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

export default function ProjectsPage() {
  const { t } = useI18n();
  const [dynamicProjects, setDynamicProjects] = useState<PortfolioProject[]>([]);

  useEffect(() => {
    fetch("/api/portfolio")
      .then(res => res.json())
      .then(data => {
        setDynamicProjects(data);
      })
      .catch(err => {
        console.error("Failed to fetch projects:", err);
      });
  }, []);

  // Use dynamic projects if available, otherwise fallback to static
  // In a real migration, we match slugs to avoid duplicates
  const displayProjects: PortfolioProject[] = dynamicProjects.length > 0 
    ? dynamicProjects 
    : projects.map(p => ({ ...p, _id: p.slug } as PortfolioProject));

  return (
    <div className="pt-40 pb-24 px-6 md:px-10 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button href="/" variant="ghost" className="mb-12 pl-0 group text-text-secondary hover:text-foreground">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          {t("projects.back_to_home")}
        </Button>
        <SectionHeading title={t("projects.page_title")} subtitle={t("projects.subtitle")} />
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mt-16">
        {displayProjects.map((project: PortfolioProject, idx: number) => {
          const stack = Array.isArray(project.stack) 
            ? project.stack 
            : JSON.parse((project.stack as string) || "[]");
            
          // Try to get translation, otherwise use the title field directly
          const projectTitle = t(`projects.${project.slug}.title`);
          const displayTitle = projectTitle.includes('projects.') ? project.title : projectTitle;
          
          const projectSummary = t(`projects.${project.slug}.summary`);
          const displaySummary = projectSummary.includes('projects.') ? project.summary : projectSummary;

          return (
            <motion.div
              key={project._id || project.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex h-full"
            >
              <Card className="flex flex-col h-full grow overflow-hidden group">
                <div className="relative h-64 overflow-hidden bg-surface-hover/30 group/img">
                  <div className="absolute inset-0 bg-muted-radial opacity-20 group-hover/img:opacity-40 transition-opacity duration-1000" />
                  <div className="absolute inset-0 bg-linear-to-br from-background via-accent/5 to-accent/10 flex items-center justify-center p-12">
                    <motion.div 
                      animate={{ 
                        boxShadow: ["0 0 20px rgba(201,162,39,0.05)", "0 0 40px rgba(201,162,39,0.15)", "0 0 20px rgba(201,162,39,0.05)"],
                        borderColor: ["rgba(201,162,39,0.1)", "rgba(201,162,39,0.3)", "rgba(201,162,39,0.1)"]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full h-full border rounded-2xl flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm bg-white/2"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent_50%)]" />
                      <span className="text-accent/40 text-[10px] tracking-[0.4em] uppercase font-black text-center group-hover:text-accent group-hover:scale-110 transition-all duration-700 font-mono">
                        {(project.title || '').split(' ').map((word: string) => word[0]).join('')} • {project.slug.toUpperCase()}
                      </span>
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-px bg-accent/20 group-hover:w-20 transition-all duration-700" />
                    </motion.div>
                  </div>
                  <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>

                <div className="p-8 flex flex-col grow">
                  <div className="grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors pr-2">
                        {displayTitle}
                      </h3>
                      <Badge variant="default" className="shrink-0">{t(`projects.status.${project.status.toLowerCase().replace(/\s/g, '_')}`)}</Badge>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed mb-6">
                      {displaySummary}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                      {stack.map((tech: string) => (
                        <Badge key={tech} variant="accent">{tech}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-6 border-t border-border mt-auto">
                    <Button 
                      href={`/projects/${project.slug}`} 
                      variant="primary" 
                      className="grow justify-center"
                    >
                      {t("projects.view_case_study")}
                    </Button>
                    
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 border border-border rounded-lg text-text-secondary hover:text-foreground hover:border-border-strong transition-colors"
                          aria-label={t("projects.github_aria")}
                        >
                          <Github size={20} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 border border-border rounded-lg text-text-secondary hover:text-foreground hover:border-border-strong transition-colors"
                          aria-label={t("projects.live_aria")}
                        >
                          <ExternalLink size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
