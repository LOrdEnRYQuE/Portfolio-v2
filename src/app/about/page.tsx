"use client";

import { motion } from "framer-motion";
import About from "@/components/sections/About";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import { siteConfig } from "@/content/site";
import { Shield, Target, Rocket, Users, ChevronRight } from "lucide-react";

export default function AboutPage() {
  const principles = [
    {
      icon: <Target className="text-accent" />,
      title: "Conversion Focused",
      desc: "Every pixel and line of code is optimized to turn visitors into loyal customers."
    },
    {
      icon: <Shield className="text-accent" />,
      title: "Data Integrity",
      desc: "Robust architecture ensuring your business data is secure, compliant, and always available."
    },
    {
      icon: <Rocket className="text-accent" />,
      title: "Scaling Ready",
      desc: "Built with the future in mind. Our solutions grow as fast as your business does."
    },
    {
      icon: <Users className="text-accent" />,
      title: "Human Centric",
      desc: "Complex technology translated into simple, intuitive experiences for your users."
    }
  ];

  return (
    <main className="min-h-screen pt-32 pb-20">
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
              Engineered for <span className="text-accent">Excellence</span>
            </h2>
            <p className="text-text-secondary text-lg">
              Beyond just code, we build digital assets that define the competitive edge of modern businesses.
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
                Our approach to <br />
                <span className="text-accent-blue">Modern Development</span>
              </h2>
              <ul className="space-y-4">
                {[
                  "Component-Driven Architecture",
                  "AI-Optimized Workflows",
                  "Performance-First Mentality",
                  "Iterative & Agile Delivery"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-text-secondary">
                    <ChevronRight size={16} className="text-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-text-secondary italic text-lg leading-relaxed border-l-2 border-accent/30 pl-8">
               &quot;Software is not just a tool; it is the physical medium of your business logic. We ensure that medium is unbreakable, efficient, and beautiful.&quot;
               <footer className="mt-4 not-italic text-foreground font-bold">— {siteConfig.name}</footer>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
