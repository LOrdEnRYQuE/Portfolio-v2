"use client";

import { motion } from "framer-motion";
import { services } from "@/content/services";
import { Card, CardContent } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useI18n } from "@/lib/i18n";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface ServicesProps {
  title?: string;
  subtitle?: string;
}

export default function Services({ title, subtitle }: ServicesProps) {
  const { t } = useI18n();

  const getLocalizedServices = () => {
    return services.map(service => {
      let key = "";
      if (service.id === "ai-engineering") key = "ai";
      else if (service.id === "full-stack") key = "fullstack";
      else if (service.id === "ui-ux") key = "design";
      else if (service.id === "agentic-workflows") key = "agents";

      return {
        ...service,
        title: t(`services.${key}.title`),
        description: t(`services.${key}.desc`)
      };
    });
  };

  return (
    <section className="py-32 px-6 md:px-10 max-w-7xl mx-auto border-t border-border">
      <SectionHeading 
        title={title || t("services.title")} 
        subtitle={subtitle || t("services.subtitle")} 
        align="center" 
      />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-20"
      >
        {getLocalizedServices().map((service) => {
          const Icon = service.icon;
          return (
            <motion.div variants={item} key={service.id}>
              <Card className="h-full group relative overflow-hidden">
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-accent/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <CardContent className="space-y-6 flex flex-col h-full relative z-10 p-8">
                  <div className="h-14 w-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-linear-to-br group-hover:from-[#94A3B8] group-hover:via-[#3B82F6] group-hover:to-[#8B5CF6] group-hover:text-background group-hover:scale-110 transition-all duration-500 shadow-none group-hover:shadow-blue-glow-sm">
                    {Icon && <Icon size={28} strokeWidth={1.5} />}
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors duration-500">
                    {service.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed grow">
                    {service.description}
                  </p>
                  
                  {/* Bottom Accent Line */}
                  <div className="w-8 h-px bg-accent/20 group-hover:w-full transition-all duration-700" />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
