"use client";

import { motion } from "framer-motion";
import { Terminal, Palette, Bot, Code2, Database, BrainCircuit, MonitorSmartphone, Cpu, ChevronRight } from "lucide-react";


export default function ExperienceTimeline() {
  const experiences = [
    {
      period: "2010 — 2017",
      title: "IT Foundations & Web Development",
      description: "Began building websites and learning web technologies through hands-on experimentation and independent projects. Worked extensively with early PHP-based CMS platforms and web systems.",
      groups: [
        { label: "Technologies", items: ["PHP", "MySQL", "HTML / CSS", "JavaScript"] },
        { label: "CMS Platforms", items: ["PHP-Fusion", "WordPress", "Joomla"] },
      ],
      activities: [
        "Building and maintaining websites",
        "Server setup and hosting environments",
        "CMS customization and plugin integrations",
        "Database configuration and management",
      ],
      icon: <Terminal className="text-accent" size={24} />,
      color: "border-accent text-accent",
      bg: "bg-accent/10",
      summary: "This phase built a strong understanding of web architecture, hosting infrastructure, and backend logic.",
    },
    {
      period: "2017 — 2023",
      title: "Graphic Design & Digital Product Design",
      description: "Expanded skills into visual design, branding, and digital media production to support web projects and digital products.",
      groups: [
        { label: "Tools Explored", items: ["Adobe Photoshop", "Illustrator", "Affinity Designer", "UI / UX Layout Design"] },
      ],
      activities: [
        "Website visual layouts",
        "Brand identity design",
        "Logo and marketing material creation",
        "Digital graphics for online platforms",
        "Social media and promotional visuals"
      ],
      icon: <Palette className="text-purple-400" size={24} />,
      color: "border-purple-400 text-purple-400",
      bg: "bg-purple-400/10",
      summary: "This design experience strengthened the ability to bridge design and development, enabling the creation of visually polished digital products.",
    },
    {
      period: "2023 — 2026",
      title: "AI Engineering & Modern Development",
      description: "Transitioned into modern development frameworks and artificial intelligence technologies, focusing on building intelligent software systems and AI-powered platforms.",
      groups: [
        { label: "Frameworks & Tech", items: ["TypeScript", "Node.js", "React", "Next.js"] },
        { label: "AI & Automation", items: ["OpenAI APIs", "AI Agents", "Automation Workflows", "Prompt Engineering"] },
      ],
      activities: [
        "AI-powered applications",
        "Developer platforms and tools",
        "SaaS web applications",
        "Automation systems for businesses",
      ],
      icon: <Bot className="text-emerald-400" size={24} />,
      color: "border-emerald-400 text-emerald-400",
      bg: "bg-emerald-400/10",
      summary: "This phase focuses on combining full-stack development with artificial intelligence to build next-generation digital products.",
    }
  ];

  const coreSkills = [
    { title: "Web Development", skills: "PHP, JavaScript, TypeScript, HTML, CSS", icon: <Code2 className="text-accent" size={20} /> },
    { title: "Frontend Development", skills: "React, Next.js, UI architecture, responsive design", icon: <MonitorSmartphone className="text-blue-400" size={20} /> },
    { title: "Backend Development", skills: "Node.js, REST APIs, PostgreSQL, server infrastructure", icon: <Database className="text-purple-400" size={20} /> },
    { title: "Artificial Intelligence", skills: "AI APIs, AI automation workflows, prompt engineering", icon: <BrainCircuit className="text-emerald-400" size={20} /> },
    { title: "Design & Visuals", skills: "Graphic design, UI/UX layout design, brand visuals", icon: <Palette className="text-orange-400" size={20} /> }
  ];

  return (
    <section className="py-24 max-w-5xl mx-auto px-6 relative">
      {/* Visual background elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="text-center space-y-6 mb-20">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Professional <span className="text-accent">Evolution</span>
        </h2>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
          From early IT infrastructure to modern AI engineering. A continuous journey of stacking complementary skills to build complete digital products.
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
                      <h4 className="text-xs font-bold tracking-widest uppercase text-text-muted mb-4">Key Activities</h4>
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
            <h3 className="text-3xl font-bold text-foreground">Engineering <span className="text-accent">Philosophy</span></h3>
            <div className="w-12 h-1 bg-accent/50 rounded-full" />
          </div>
          <p className="text-text-secondary leading-relaxed text-lg">
            &ldquo;Technology should serve a clear purpose: building reliable, scalable digital products that solve real problems.&rdquo;
          </p>
          <p className="text-text-secondary leading-relaxed text-lg">
            My work focuses on combining software engineering, design thinking, and artificial intelligence to create systems that are not only functional but also intuitive and efficient.
          </p>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <Cpu className="text-accent" size={18} /> The Power Triangle
            </h4>
            <p className="text-sm text-text-muted leading-relaxed">
              IT infrastructure → Web engineering → Design → AI systems. This unique stack enables the creation of complete digital products from concept to deployment.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-7"
        >
          <h3 className="text-2xl font-bold text-foreground mb-8">Core Skill Areas</h3>
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
