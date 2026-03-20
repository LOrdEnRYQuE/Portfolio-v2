"use client";

import { m } from "framer-motion";
import { siteConfig } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  Rocket, 
  TrendingUp, 
  Sparkles, 
  Zap, 
  Crown, 
  ChevronRight,
  ShieldCheck,
  MousePointer2
} from "lucide-react";

const STARTUP_PLANS_KEYS = [
  {
    prefix: "launchpad",
    icon: Rocket,
    color: "accent-blue",
    delay: 0.1
  },
  {
    prefix: "scaleup",
    icon: TrendingUp,
    color: "accent-purple",
    delay: 0.2
  },
  {
    prefix: "premium",
    icon: Crown,
    color: "accent-silver",
    delay: 0.3
  }
];

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative min-h-screen pt-24 pb-20 px-6 overflow-hidden flex items-center">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_70%)]" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-background to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Part 1: The Vision & Description (Left Column) */}
          <div className="space-y-10 lg:sticky lg:top-32">
            <m.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-accent-blue" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/80">
                {siteConfig.brand} • {t("hero.badge")}
              </span>
            </m.div>

            <div className="space-y-6">
              <m.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.95] text-foreground uppercase"
              >
                {t("hero.title.line1")} <br />
                <span className="bg-linear-to-r from-accent-silver via-accent-blue to-accent-purple bg-clip-text text-transparent italic drop-shadow-sm">
                  {t("hero.title.line2")}
                </span>
              </m.h1>

              <m.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-foreground/70 font-light leading-relaxed max-w-xl"
              >
                {t("hero.subtitle")}
              </m.p>
            </div>

            <m.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <MagneticButton strength={30}>
                <Button href="/contact" size="lg" className="rounded-2xl px-10 py-7 text-lg font-bold bg-white text-black hover:bg-slate-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  {t("hero.cta.growth")}
                </Button>
              </MagneticButton>
              <Button href="/projects" variant="ghost" size="lg" className="rounded-2xl px-8 border border-white/10 hover:bg-white/5">
                {t("hero.cta.case_studies")}
              </Button>
            </m.div>

            {/* Badges of Trust in Column 1 */}
            <m.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-12 border-t border-white/5"
            >
              {[
                { icon: ShieldCheck, textKey: "hero.trust.secure_scale" },
                { icon: MousePointer2, textKey: "hero.trust.conversion_first" },
                { icon: Crown, textKey: "hero.trust.premium_architecture" }
              ].map((badge) => (
                <div key={badge.textKey} className="flex items-center gap-2.5 opacity-40 hover:opacity-80 transition-opacity">
                  <badge.icon className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{t(badge.textKey)}</span>
                </div>
              ))}
            </m.div>
          </div>

          {/* Part 2: Startup Promotion Cards (Right Column) */}
          <div className="space-y-8">
            <div className="mb-6">
              <m.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-sm font-bold tracking-widest uppercase text-accent-blue mb-2"
              >
                {t("hero.startup.packages.title")}
              </m.p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{t("hero.startup.packages.subtitle")}</h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {STARTUP_PLANS_KEYS.map((plan, i) => {
                const title = t(`hero.startup.plans.${plan.prefix}.title`);
                const subtitle = t(`hero.startup.plans.${plan.prefix}.subtitle`);
                const description = t(`hero.startup.plans.${plan.prefix}.desc`);
                const features = [
                  t(`hero.startup.plans.${plan.prefix}.f1`),
                  t(`hero.startup.plans.${plan.prefix}.f2`),
                  t(`hero.startup.plans.${plan.prefix}.f3`)
                ];
                
                return (
                  <m.div
                    key={plan.prefix}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: plan.delay }}
                  >
                    <Card className="relative group border-white/5 hover:border-white/20 transition-all duration-500 overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                        <plan.icon className="w-16 h-16" />
                      </div>
                      
                      <CardContent className="p-8 flex flex-col md:flex-row gap-8 items-start">
                        <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 text-${plan.color} shrink-0`}>
                          <plan.icon className="w-8 h-8" />
                        </div>

                        <div className="flex-1 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-accent-blue transition-colors uppercase tracking-tight">
                                {title}
                              </h3>
                              <p className="text-xs text-foreground/50 font-medium">{subtitle}</p>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-accent-blue bg-accent-blue/10 px-3 py-1.5 rounded-full border border-accent-blue/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                              {i === 0 ? t("hero.startup.off.25") : i === 1 ? t("hero.startup.off.50") : t("hero.startup.off.special")}
                            </span>
                          </div>

                          <p className="text-foreground/70 text-sm leading-relaxed max-w-md">
                            {description}
                          </p>

                          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-white/5">
                            {features.map(feature => (
                              <div key={feature} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter text-foreground/60">
                                <Zap className="w-3 h-3 text-accent-blue" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button href="/contact" variant="ghost" className="shrink-0 w-full md:w-auto h-auto py-4 px-6 border-white/10 hover:bg-white hover:text-black transition-all">
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </CardContent>
                    </Card>
                  </m.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
