"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowRight, Github, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface FeaturedProjectsProps {
  title?: string;
  subtitle?: string;
}

export default function FeaturedProjects({ title, subtitle }: FeaturedProjectsProps) {
  const { t } = useI18n();
  const convexProjects = useQuery(api.portfolio.getFeatured);
  const featured = convexProjects?.slice(0, 3) || [];

  return (
    <section id="projects" className="py-24 px-6 md:px-10 max-w-7xl mx-auto border-t border-border">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
      >
        <SectionHeading 
          title={title || t("projects.section_title")} 
          subtitle={subtitle || t("projects.subtitle")} 
          className="mb-0"
        />
        <Button href="/projects" variant="ghost" className="group text-text-secondary hover:text-foreground">
          {t("projects.view_all_button")}
          <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8 content-stretch">
        {featured.map((project, idx) => {
          return (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex h-full"
            >
              <Card className="flex flex-col h-full grow overflow-hidden group">
                <div className="relative h-48 md:h-60 overflow-hidden bg-surface-hover/30 group/img">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-muted),transparent_70%)] opacity-20 group-hover/img:opacity-40 transition-opacity duration-1000" />
                  <div className="absolute inset-0 bg-linear-to-br from-background via-accent/5 to-accent/10 flex items-center justify-center p-8">
                    <div className="w-full h-full border border-white/10 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm bg-white/2 group-hover:border-accent/30 transition-colors duration-500">
                      <div className="absolute inset-0 bg-accent-radial opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                      <span className="text-accent/40 text-[10px] tracking-[0.4em] uppercase font-black text-center group-hover:text-accent group-hover:scale-110 transition-all duration-700 font-mono">
                        {project.title.split(' ').map(word => word[0]).join('')} • {project.slug.toUpperCase()}
                      </span>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-px bg-accent/20 group-hover:w-16 transition-all duration-700" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>

                <div className="p-6 md:p-8 flex flex-col h-full grow">
                  <div className="grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                        {t(`projects.${project.slug}.title`)}
                      </h3>
                      <Badge variant="default">{t(`projects.status.${project.status.toLowerCase().replace(/\s/g, '_')}`)}</Badge>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed mb-6">
                      {t(`projects.${project.slug}.summary`)}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                      {(typeof project.stack === 'string' ? JSON.parse(project.stack) : project.stack).slice(0, 4).map((tech: string) => (
                        <Badge key={tech} variant="accent">{tech}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t border-border mt-auto">
                    <Button 
                      href={`/projects/${project.slug}`} 
                      variant="outline" 
                      className="w-full justify-center group/btn"
                    >
                      {t("projects.view_case_study")}
                      <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                    
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-text-muted hover:text-foreground transition-colors"
                        aria-label="GitHub Repository"
                      >
                        <Github size={20} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-text-muted hover:text-foreground transition-colors"
                        aria-label="Live Project"
                      >
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-12 flex justify-center md:hidden">
        <Button href="/projects" variant="outline" className="w-full">
          {t("projects.view_all")}
        </Button>
      </div>
    </section>
  );
}
