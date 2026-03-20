"use client";

import React from "react";
import { motion } from "framer-motion";
import About from "@/components/sections/About";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import { siteConfig } from "@/content/site";
import { useI18n } from "@/lib/i18n";
import { Shield, Target, Rocket, Users, ChevronRight } from "lucide-react";

export default function AboutView() {
  const { t } = useI18n();
  const principles = [
    {
      icon: <Target className="text-accent" />,
      title: t("about.view.principles.p1.title"),
      desc: t("about.view.principles.p1.desc")
    },
    {
      icon: <Shield className="text-accent" />,
      title: t("about.view.principles.p2.title"),
      desc: t("about.view.principles.p2.desc")
    },
    {
      icon: <Rocket className="text-accent" />,
      title: t("about.view.principles.p3.title"),
      desc: t("about.view.principles.p3.desc")
    },
    {
      icon: <Users className="text-accent" />,
      title: t("about.view.principles.p4.title"),
      desc: t("about.view.principles.p4.desc")
    }
  ];

  return (
    <main className="min-h-screen pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-32">
        {/* Core Profile Section */}
        <div className="relative">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
          <About />
        </div>

        {/* Professional Timeline */}
        <ExperienceTimeline />

        {/* Robust Principles Section */}
        <section className="space-y-16 relative">
          <div className="space-y-4 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-glow">
              {t("about.view.principles.title").split(" ")[0]} <span className="text-accent">{t("about.view.principles.title").split(" ").slice(1).join(" ")}</span>
            </h2>
            <p className="text-text-secondary text-lg">
              {t("about.view.principles.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {principles.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-accent/40 transition-all group backdrop-blur-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  {p.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{p.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ/Values Intersection */}
        <section className="rounded-[40px] bg-linear-to-br from-white/5 to-transparent border border-white/10 p-10 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 blur-[100px] -z-10" />
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                {t("about.view.approach.title").split(" ").slice(0, 3).join(" ")} <br />
                <span className="text-accent-blue">{t("about.view.approach.title").split(" ").slice(3).join(" ")}</span>
              </h2>
              <ul className="space-y-4">
                {[
                  t("about.view.approach.i1"),
                  t("about.view.approach.i2"),
                  t("about.view.approach.i3"),
                  t("about.view.approach.i4")
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-text-secondary">
                    <ChevronRight size={16} className="text-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-text-secondary italic text-lg leading-relaxed border-l-2 border-accent/30 pl-8">
               &quot;{t("about.view.quote")}&quot;
               <footer className="mt-4 not-italic text-foreground font-bold">— {siteConfig.name}</footer>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
