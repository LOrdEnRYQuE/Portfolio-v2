"use client";

import { m, useMotionValue, useMotionTemplate } from "framer-motion";
import { useEffect } from "react";
import { siteConfig } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useI18n } from "@/lib/i18n";

interface HeroProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  description?: string;
}

export default function Hero({ badge, title, subtitle, description }: HeroProps) {
  const { t } = useI18n();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const gradient1 = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, 
    rgba(148, 163, 184, 0.12), 
    rgba(59, 130, 246, 0.08), 
    rgba(16, 185, 129, 0.06), 
    rgba(139, 92, 246, 0.04),
    transparent 70%)`;

  const gradient2 = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, 
    rgba(59, 130, 246, 0.10), 
    rgba(16, 185, 129, 0.08), 
    rgba(139, 92, 246, 0.06), 
    transparent 60%)`;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Interactive Mouse-Following Gradient Splash */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Mouse-following gradient splash */}
        <m.div
          style={{ background: gradient1 }}
          className="absolute inset-0"
        />
        
        {/* Secondary colorful splash */}
        <m.div
          style={{ background: gradient2 }}
          className="absolute inset-0 transition-opacity"
        />
        
        {/* Primary gradient orb */}
        <m.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 120, 0],
            y: [0, -80, 0],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[15%] -left-[15%] w-[50%] h-[50%] bg-linear-to-br from-accent-silver/20 via-accent-blue/12 to-accent-purple/6 rounded-full blur-[120px]"
        />
        
        {/* Secondary gradient orb */}
        <m.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [-80, 80, -80],
            y: [60, -60, 60],
            rotate: [180, -90, 180],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -bottom-[10%] -right-[10%] w-[45%] h-[45%] bg-linear-to-tl from-accent-blue/18 via-accent-green/10 to-accent-silver/5 rounded-full blur-[100px]"
        />
        
        {/* Floating gradient blob */}
        <m.div
          animate={{
            scale: [1, 1.4, 1],
            x: [50, -30, 50],
            y: [-40, 40, -40],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
          className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-linear-to-r from-accent-purple/12 via-accent-blue/8 to-transparent rounded-full blur-[80px]"
        />
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-muted-radial opacity-10" />
      </div>
      
      <m.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 max-w-6xl mx-auto space-y-12 pb-20"
      >
        {/* Brand and role */}
        <div className="space-y-8">
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center space-y-4"
          >
            <m.div
              animate={{
                background: [
                  "linear-gradient(90deg, var(--accent-silver), var(--accent-blue))",
                  "linear-gradient(90deg, var(--accent-blue), var(--accent-green))",
                  "linear-gradient(90deg, var(--accent-green), var(--accent-purple))",
                  "linear-gradient(90deg, var(--accent-purple), var(--accent-silver))",
                ],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
              className="px-6 py-3 rounded-full border border-white/10 backdrop-blur-sm bg-white/5"
            >
              <p className="text-white/90 tracking-[0.4em] uppercase text-xs font-black">
                {badge || siteConfig.brand}
              </p>
            </m.div>
            
            <m.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1.5 }}
              className="text-foreground/80 tracking-wider text-sm md:text-base font-medium"
            >
              {t("hero.role")}
            </m.p>
          </m.div>
          
          {/* Main headline with staggered word animation */}
          <m.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-[0.9] drop-shadow-2xl uppercase"
          >
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-2">
              {(title || t("hero.title")).split(' ').map((word: string, i: number) => (
                <m.span
                  key={i}
                  initial={{ opacity: 0, y: 50, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    delay: 0.7 + i * 0.15,
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                  className="inline-block bg-linear-to-b from-white to-white/70 bg-clip-text text-transparent"
                  style={{
                    textShadow: `0 0 30px rgba(${i % 2 === 0 ? "var(--accent-silver-rgb)" : "var(--accent-blue-rgb)"}, 0.3)`,
                  }}
                >
                  {word}
                </m.span>
              ))}
            </div>
          </m.h1>
          
          {/* Subtitle / Description */}
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="max-w-3xl mx-auto text-lg md:text-xl text-foreground/70 leading-relaxed font-light"
          >
            {subtitle || description || t("hero.subtitle")}
          </m.p>
        </div>

        {/* CTA buttons with enhanced animations */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
        >
          <m.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <MagneticButton strength={50}>
              <Button 
                href="/contact" 
                size="lg" 
                className="group relative rounded-2xl px-12 py-6 text-lg font-bold bg-linear-to-r from-white via-slate-100 to-slate-200 text-slate-900 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
                style={{
                  boxShadow: "0 25px 50px -20px rgba(59, 130, 246, 0.4)"
                }}
              >
                <span className="relative z-10">{t("hero.cta.primary")}</span>
                {/* Animated border gradient */}
                <div className="absolute inset-0 rounded-2xl p-[2px] bg-linear-to-r from-accent-blue via-accent-purple to-accent-green opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-white via-slate-50 to-slate-100" />
                </div>
                {/* Glow effect */}
                <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-accent-blue/20 via-accent-purple/20 to-accent-green/20 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300" />
              </Button>
            </MagneticButton>
          </m.div>
          
          <m.div
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button 
              href="/projects" 
              variant="ghost" 
              size="lg" 
              className="group relative rounded-2xl px-8 py-6 text-slate-300 hover:text-white bg-transparent backdrop-blur-sm transition-all duration-300 font-medium hover:shadow-2xl hover:bg-white/5"
            >
              <span className="relative z-10">{t("hero.cta.secondary")}</span>
              <div className="absolute inset-0 rounded-2xl border-2 border-white/10 group-hover:border-accent-silver/50 transition-all duration-300" />
              <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-accent-silver/10 via-accent-blue/10 to-accent-purple/10 opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
            </Button>
          </m.div>

          <m.div
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button 
              href="/resume.pdf" 
              target="_blank"
              variant="ghost" 
              size="lg" 
              className="group relative rounded-2xl px-8 py-6 text-slate-400 hover:text-white bg-white/5 border border-white/5 transition-all duration-300 font-medium hover:bg-white/10"
            >
              <span className="relative z-10">{t("hero.cta.resume")}</span>
              <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-accent-blue/5 via-accent-purple/5 to-transparent opacity-0 group-hover:opacity-100 blur-md transition-all duration-300" />
            </Button>
          </m.div>
        </m.div>
        
        {/* Scroll indicator */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <m.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center"
          >
            <m.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1 h-3 bg-foreground/50 rounded-full mt-2"
            />
          </m.div>
        </m.div>
      </m.div>
    </section>
  );
}

