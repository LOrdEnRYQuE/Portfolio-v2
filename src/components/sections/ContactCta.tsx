"use client";

import { m } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { ArrowRight } from "lucide-react";

interface ContactCtaProps {
  title?: string;
  subtitle?: string;
}

export default function ContactCta({ title, subtitle }: ContactCtaProps) {
  const { t } = useI18n();

  return (
    <section className="py-32 px-6 md:px-10 max-w-5xl mx-auto text-center">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="relative rounded-[3rem] p-16 md:p-24 overflow-hidden border border-white/5"
        aria-label="Contact call to action container"
      >
        {/* Layered Background */}
        <div className="absolute inset-0 bg-surface" />
        <m.div 
          animate={{ 
            opacity: [0.05, 0.15, 0.05],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-accent-radial opacity-50" 
        />
        <m.div 
          animate={{ 
            opacity: [0.03, 0.1, 0.03],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-1/2 h-1/2 bg-accent-radial opacity-30" 
        />
        
        {/* Content */}
        <div className="relative z-10 space-y-10">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
            {title || t("contact_cta.title")}
          </h2>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {subtitle || t("contact_cta.subtitle")}
          </p>
          <div className="pt-6">
            <Button size="lg" href="/contact" className="rounded-2xl px-10 py-8 text-lg font-bold shadow-blue-glow group">
              {t("contact_cta.button")}
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Decorative Corner Elements */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-slate-400/10 rounded-tl-3xl pointer-events-none" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-slate-400/10 rounded-br-3xl pointer-events-none" />
      </m.div>
    </section>
  );
}
