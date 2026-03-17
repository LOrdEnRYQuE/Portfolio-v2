"use client";

import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  status: string;
  stack: string[] | string;
  cover: string;
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
  challenge?: string;
  solution?: string;
  brief?: string;
  updatedAt?: string;
}

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { t } = useI18n();
  const { slug } = React.use(params);
  const [dynamicProject, setDynamicProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/portfolio`)
      .then(res => res.json())
      .then(data => {
        const found = (data as PortfolioProject[]).find(p => p.slug === slug);
        if (found) setDynamicProject(found);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch project:", err);
        setLoading(false);
      });
  }, [slug]);

  const staticProject = projects.find((p) => p.slug === slug);
  const project = dynamicProject || (staticProject as PortfolioProject);

  if (!project && !loading) return notFound();
  if (loading && !staticProject) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <article className="py-24 px-6 md:px-10 max-w-4xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button href="/projects" variant="ghost" className="mb-12 pl-0 group text-text-secondary hover:text-foreground">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          {t("projects.back_to_projects")}
        </Button>
      </motion.div>

      <div className="space-y-6 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            {t(`projects.${project.slug}.title`).includes('projects.') ? project.title : t(`projects.${project.slug}.title`)}
          </h1>
          <Badge variant="default" className="w-fit text-sm px-4 py-1">
            {t(`projects.status.${(project.status as string).toLowerCase().replace(/\s/g, '_')}`)}
          </Badge>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl text-text-secondary leading-relaxed max-w-2xl"
        >
          {t(`projects.${project.slug}.summary`).includes('projects.') ? project.summary : t(`projects.${project.slug}.summary`)}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center gap-6 pt-6 border-t border-border mt-8"
        >
          <div className="flex gap-3 ml-auto">
            {project.githubUrl && (
              <Button href={project.githubUrl} variant="outline" size="sm">
                <Github size={16} className="mr-2" /> {t("projects.source")}
              </Button>
            )}
            {project.liveUrl && (
              <Button href={project.liveUrl} variant="primary" size="sm">
                <ExternalLink size={16} className="mr-2" /> {t("projects.live")}
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative aspect-video rounded-2xl overflow-hidden glass-card mb-16"
      >
        <div className="absolute inset-0 bg-surface-hover/20" />
        <div className="absolute inset-0 bg-muted-radial opacity-30" />
        <div className="absolute inset-0 bg-linear-to-br from-background via-accent/5 to-accent/10 flex items-center justify-center p-12 md:p-24">
          <motion.div 
            animate={{ 
              boxShadow: ["0 0 40px rgba(201,162,39,0.05)", "0 0 80px rgba(201,162,39,0.15)", "0 0 40px rgba(201,162,39,0.05)"],
              borderColor: ["rgba(201,162,39,0.1)", "rgba(201,162,39,0.3)", "rgba(201,162,39,0.1)"]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full border rounded-3xl flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm bg-white/2"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.03),transparent_60%)]" />
            <span className="text-accent/40 text-sm tracking-[0.8em] uppercase font-black text-center font-mono">
              {(project.title || '').split(' ').map((word: string) => word[0]).join('')} • CORE // {project.slug.toUpperCase()}
            </span>
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-px bg-accent/20" />
          </motion.div>
        </div>
      </motion.div>

      <div className="space-y-20">
        {project.brief && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <SectionHeading title={t("projects.tech_brief")} className="mb-8" />
            <p className="text-gray-400 leading-relaxed text-lg italic border-l-2 border-accent/20 pl-8 py-2">
              {t(`projects.${project.slug}.brief`).includes('projects.') ? project.brief : t(`projects.${project.slug}.brief`)}
            </p>
          </motion.section>
        )}

        {project.challenge && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <SectionHeading title={t("projects.challenge")} className="mb-8" />
            <p className="text-gray-400 leading-relaxed text-lg">
              {t(`projects.${project.slug}.challenge`).includes('projects.') ? project.challenge : t(`projects.${project.slug}.challenge`)}
            </p>
          </motion.section>
        )}

        {project.solution && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <SectionHeading title={t("projects.solution")} className="mb-8" />
            <p className="text-gray-400 leading-relaxed text-lg">
              {t(`projects.${project.slug}.solution`).includes('projects.') ? project.solution : t(`projects.${project.slug}.solution`)}
            </p>
          </motion.section>
        )}

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <SectionHeading title={t("projects.tech_stack")} className="mb-8" />
          <div className="flex flex-wrap gap-3">
            {(Array.isArray(project.stack) ? project.stack : JSON.parse(project.stack || "[]")).map((tech: string) => (
              <Badge key={tech} variant="accent" className="px-4 py-1.5 text-sm">
                {tech}
              </Badge>
            ))}
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 text-text-secondary leading-relaxed text-lg border-t border-white/5 pt-12"
        >
           <SectionHeading title={t("projects.overview")} className="mb-8" />
           <p>{t(`projects.${project.slug}.description`).includes('projects.') ? project.description : t(`projects.${project.slug}.description`)}</p>
        </motion.section>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-24 pt-12 border-t border-border flex justify-between items-center text-sm font-medium"
      >
        <span className="text-text-muted">{t("projects.thanks")}</span>
        <Button href="/contact" variant="ghost">
          {t("projects.start_convo")}
        </Button>
      </motion.div>
    </article>
  );
}
