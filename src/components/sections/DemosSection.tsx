"use client";
import { ArrowRight, Play, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { demoBranches } from "@/content/demoBranches";

export default function DemosSection() {
  const { t } = useI18n();
  
  const getLocalizedNiche = (slug: string) => {
    const nicheMap: Record<string, string> = {
      'restaurantflow': 'restaurant',
      'beautybook': 'beauty',
      'servicehub': 'service',
      'propview': 'propview',
      'insightflow': 'insight'
    };
    return t(`demos.niche.${nicheMap[slug] || 'service'}`);
  };

  return (
    <section className="py-24 px-6 md:px-10 max-w-7xl mx-auto relative overflow-hidden">
      {/* Decorative Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -z-10" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <SectionHeading 
          title={t("demos.title")} 
          subtitle={t("demos.subtitle")} 
          className="mb-0 text-left" 
        />
        <div className="flex flex-col gap-2 max-w-md">
          <p className="text-text-secondary text-sm leading-relaxed">
            {t("demos.description")}
          </p>
          <Link 
            href="/demo-branches" 
            className="text-accent text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all group"
          >
            {t("demos.explore")}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {demoBranches.map((demo, idx) => (
          <motion.div
            key={demo.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: idx * 0.1 }}
          >
            <Card className="group relative h-full flex flex-col overflow-hidden glass-card border-white/5 hover:border-accent-blue/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-blue-glow">
              {/* Preview Image container */}
              <div className="relative aspect-video overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${demo.cover})` }}
                />
                <div className="absolute inset-0 bg-background/60 group-hover:bg-background/20 transition-colors duration-500" />
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge variant="accent" className="bg-background/80 backdrop-blur-md border-white/10 shadow-lg px-3 py-1">
                    {demo.status === "Live Demo" ? t("demos.status.live") : t("demos.status.prototype")}
                  </Badge>
                </div>

                {/* Hover Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                   <div className="w-16 h-16 rounded-full bg-accent-blue flex items-center justify-center text-white shadow-blue-glow-sm scale-90 group-hover:scale-100 transition-transform duration-500">
                      <Play size={24} fill="currentColor" />
                   </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col grow">
                <div className="grow">
                   <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3">{getLocalizedNiche(demo.slug)}</p>
                   <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">
                     {demo.title.replace("LOrdEnRYQuE ", "")}
                   </h3>
                   <p className="text-text-secondary text-sm leading-relaxed mb-8 line-clamp-3">
                     {t(`demos.${demo.slug}.summary`)}
                   </p>
                </div>

                <div className="mt-auto space-y-4">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {demo.features.slice(0, 3).map(f => (
                      <span key={f} className="text-[10px] py-1 px-2 rounded-md bg-white/5 border border-white/5 text-gray-400 capitalize whitespace-nowrap">
                        {f}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button 
                      href={`/demo-branches/${demo.slug}/prototype`} 
                      variant="primary" 
                      className="grow group/btn rounded-xl py-6"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {t(`demos.${demo.slug}.cta`)}
                        <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {/* MVP Blueprint Forge Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: demoBranches.length * 0.1 }}
        >
          <Link href="/mvp" className="block h-full group/forge">
            <Card className="h-full flex flex-col items-center justify-center p-8 text-center bg-background/40 backdrop-blur-xl border-dashed border-white/10 hover:border-accent-purple/50 transition-all duration-500 group cursor-pointer relative overflow-hidden">
              {/* Prismatic Border Glow */}
              <div className="absolute inset-0 opacity-0 group-hover/forge:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-linear-to-r from-accent-blue/10 via-accent-emerald/10 to-accent-purple/10 animate-gradient-xy" />
              </div>

              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover/forge:scale-110 transition-transform duration-500 relative">
                  <div className="absolute inset-0 bg-accent-purple/20 blur-xl opacity-0 group-hover/forge:opacity-100 transition-opacity" />
                  <Sparkles size={40} className="text-accent-purple animate-pulse" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 group-hover/forge:text-transparent group-hover/forge:bg-clip-text group-hover/forge:bg-linear-to-r group-hover/forge:from-accent-blue group-hover/forge:to-accent-purple transition-all duration-300">
                  {t("demos.custom_title")}
                </h3>
                
                <p className="text-sm text-gray-400 mb-8 max-w-[240px] leading-relaxed">
                  {t("demos.custom_desc")}
                </p>

                <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm group-hover/forge:bg-accent-purple group-hover/forge:border-accent-purple group-hover/forge:text-white transition-all duration-300">
                  <span>{t("demos.custom_cta")}</span>
                  <ArrowRight size={16} className="group-hover/forge:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
