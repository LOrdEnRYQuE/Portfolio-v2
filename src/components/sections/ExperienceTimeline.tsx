"use client";

import { motion } from "framer-motion";
import { Terminal, Palette, Bot, Code2, Database, BrainCircuit, MonitorSmartphone, Cpu, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";


export default function ExperienceTimeline() {
  const { t } = useI18n();

  const experiences = [
    {
      period: t("timeline.exp1.period"),
      title: t("timeline.exp1.title"),
      description: t("timeline.exp1.desc"),
      groups: [
        { label: t("timeline.exp1.groups.label1"), items: ["PHP", "MySQL", "HTML / CSS", "JavaScript"] },
        { label: t("timeline.exp1.groups.label2"), items: ["PHP-Fusion", "WordPress", "Joomla"] },
      ],
      activities: [
        t("timeline.exp1.activities.a1"),
        t("timeline.exp1.activities.a2"),
        t("timeline.exp1.activities.a3"),
        t("timeline.exp1.activities.a4"),
      ],
      icon: <Terminal className="text-accent" size={24} />,
      color: "border-accent text-accent",
      bg: "bg-accent/10",
      summary: t("timeline.exp1.summary"),
    },
    {
      period: t("timeline.exp2.period"),
      title: t("timeline.exp2.title"),
      description: t("timeline.exp2.desc"),
      groups: [
        { label: t("timeline.exp2.groups.label1"), items: ["Adobe Photoshop", "Illustrator", "Affinity Designer", "UI / UX Layout Design"] },
      ],
      activities: [
        t("timeline.exp2.activities.a1"),
        t("timeline.exp2.activities.a2"),
        t("timeline.exp2.activities.a3"),
        t("timeline.exp2.activities.a4"),
        t("timeline.exp2.activities.a5"),
      ],
      icon: <Palette className="text-purple-400" size={24} />,
      color: "border-purple-400 text-purple-400",
      bg: "bg-purple-400/10",
      summary: t("timeline.exp2.summary"),
    },
    {
      period: t("timeline.exp3.period"),
      title: t("timeline.exp3.title"),
      description: t("timeline.exp3.desc"),
      groups: [
        { label: t("timeline.exp3.groups.label1"), items: ["TypeScript", "Node.js", "React", "Next.js"] },
        { label: t("timeline.exp3.groups.label2"), items: ["OpenAI APIs", "AI Agents", "Automation Workflows", "Prompt Engineering"] },
      ],
      activities: [
        t("timeline.exp3.activities.a1"),
        t("timeline.exp3.activities.a2"),
        t("timeline.exp3.activities.a3"),
        t("timeline.exp3.activities.a4"),
      ],
      icon: <Bot className="text-emerald-400" size={24} />,
      color: "border-emerald-400 text-emerald-400",
      bg: "bg-emerald-400/10",
      summary: t("timeline.exp3.summary"),
    }
  ];

  const coreSkills = [
    { title: t("timeline.skill.web.title"), skills: t("timeline.skill.web.list"), icon: <Code2 className="text-accent" size={20} /> },
    { title: t("timeline.skill.frontend.title"), skills: t("timeline.skill.frontend.list"), icon: <MonitorSmartphone className="text-blue-400" size={20} /> },
    { title: t("timeline.skill.backend.title"), skills: t("timeline.skill.backend.list"), icon: <Database className="text-purple-400" size={20} /> },
    { title: t("timeline.skill.ai.title"), skills: t("timeline.skill.ai.list"), icon: <BrainCircuit className="text-emerald-400" size={20} /> },
    { title: t("timeline.skill.design.title"), skills: t("timeline.skill.design.list"), icon: <Palette className="text-orange-400" size={20} /> }
  ];

  return (
    <section className="py-24 max-w-5xl mx-auto px-6 relative">
      {/* Visual background elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="text-center space-y-6 mb-20">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground" dangerouslySetInnerHTML={{ 
          __html: t("timeline.title").replace("Evolution", `<span class="text-accent">Evolution</span>`) 
        }} />
        <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
          {t("timeline.subtitle")}
        </p>
      </div>

      <div className="relative">
        {/* The Timeline Line */}
        <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-px bg-white/10 md:-translate-x-1/2" />

        <div className="space-y-24">
          {experiences.map((exp, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-0">
                {/* Mobile/Desktop Timeline Dot */}
                <div className={`absolute left-6 md:left-1/2 w-12 h-12 rounded-2xl border-2 ${exp.color} ${exp.bg} md:-translate-x-1/2 -translate-y-2 md:translate-y-0 flex items-center justify-center shadow-lg shadow-black/50 z-10 backdrop-blur-md`}>
                  {exp.icon}
                </div>

                {/* Content Block */}
                <motion.div 
                  initial={{ opacity: 0, y: 30, x: isEven ? -20 : 20 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className={`w-full md:w-[calc(50%-3rem)] pl-20 md:pl-0 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto md:text-left'}`}
                >
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${exp.bg} border border-white/5 text-xs font-bold uppercase tracking-widest mb-6`}>
                    <span className={`w-1.5 h-1.5 rounded-full bg-current ${exp.color.replace('border-', 'text-')}`} />
                    <span className={exp.color.replace('border-', 'text-')}>{exp.period}</span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                    {exp.title}
                  </h3>
                  
                  <p className="text-text-secondary leading-relaxed mb-6">
                    {exp.description}
                  </p>

                  <div className={`flex flex-col gap-6 mb-6 ${isEven ? 'md:items-end' : 'md:items-start'}`}>
                    {/* Groups (Tech & Tools) */}
                    <div className="flex flex-wrap gap-4">
                      {exp.groups.map((group, gIdx) => (
                        <div key={gIdx} className={`space-y-2 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                          <h4 className="text-xs font-bold tracking-widest uppercase text-text-muted">{group.label}</h4>
                          <div className={`flex flex-wrap gap-2 ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                            {group.items.map((item, iIdx) => (
                              <span key={iIdx} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-text-secondary whitespace-nowrap">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Activities List */}
                    <div className="w-full bg-black/20 rounded-2xl p-5 border border-white/5">
                      <h4 className="text-xs font-bold tracking-widest uppercase text-text-muted mb-4">{t("timeline.label.activities")}</h4>
                      <ul className={`space-y-3 ${isEven ? 'md:text-right' : 'text-left'}`}>
                        {exp.activities.map((act, aIdx) => (
                          <li key={aIdx} className={`flex items-start gap-3 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                            <ChevronRight className="text-accent shrink-0 mt-0.5" size={14} />
                            <span className="text-sm text-text-secondary">{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className={`p-5 rounded-2xl border-l-2 ${exp.color} bg-white/5 text-sm italic text-text-secondary leading-relaxed`}>
                    &ldquo;{exp.summary}&rdquo;
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Core Skills & Philosophy Section */}
      <div className="mt-32 pt-20 border-t border-white/10 grid lg:grid-cols-12 gap-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-5 space-y-8"
        >
          <div className="space-y-4">
            <h3 className="text-3xl font-bold text-foreground">
              {t("timeline.philosophy.title").split(" ")[0]} <span className="text-accent">{t("timeline.philosophy.title").split(" ")[1]}</span>
            </h3>
            <div className="w-12 h-1 bg-accent/50 rounded-full" />
          </div>
          <p className="text-text-secondary leading-relaxed text-lg">
            &ldquo;{t("timeline.philosophy.quote")}&rdquo;
          </p>
          <p className="text-text-secondary leading-relaxed text-lg">
            {t("timeline.philosophy.desc")}
          </p>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <Cpu className="text-accent" size={18} /> {t("timeline.philosophy.triangle.title")}
            </h4>
            <p className="text-sm text-text-muted leading-relaxed">
              {t("timeline.philosophy.triangle.desc")}
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-7"
        >
          <h3 className="text-2xl font-bold text-foreground mb-8">{t("timeline.skills.title")}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {coreSkills.map((skill, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {skill.icon}
                </div>
                <h4 className="font-bold text-foreground mb-2">{skill.title}</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  {skill.skills}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
