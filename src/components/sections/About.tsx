"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { siteConfig } from "@/content/site";
import { useI18n } from "@/lib/i18n";

import { Download } from "lucide-react";

export default function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="py-32 px-6 md:px-10 max-w-7xl mx-auto scroll-mt-24 border-t border-border">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <p className="text-accent-blue text-xs font-black tracking-[0.3em] uppercase">{t("about.title")}</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
              {t("about.meet")}{" "}
              <span className="text-accent-blue">{siteConfig.name.split(" ")[0]}</span>
            </h2>
          </div>
          <div className="space-y-5 text-text-secondary leading-relaxed max-w-prose text-lg">
            <p>{t("about.description")}</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
              <p className="text-sm font-medium text-accent-blue/60 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
                {t("about.based_in")} {t("common.location")}
              </p>
              
              <a 
                href="/documents/Attila_Lazar_Resume.pdf" 
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-sm font-bold hover:bg-accent-blue/20 transition-colors w-fit shadow-md"
              >
                <Download size={16} />
                {t("hero.cta.resume")}
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative aspect-square md:aspect-4/5 rounded-3xl overflow-hidden group"
          aria-label="Profile image presentation card"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-4 bg-accent-blue/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
          
          <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10">
            <Image 
              src="/images/profile/Profile.jpg"
              alt={`Profile image of ${siteConfig.name}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none" />
            
            {/* Hover Accent Border */}
            <div className="absolute inset-px border border-accent-blue/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
