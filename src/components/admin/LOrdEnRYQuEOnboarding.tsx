"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  Search, 
  ArrowRight, 
  X,
  Cpu,
  Activity,
  CheckCircle2,
  LucideIcon
} from "lucide-react";

interface Step {
  title: string;
  description: string;
  icon: LucideIcon;
  detail: string;
}

const STEPS: Step[] = [
  {
    title: "LOrdEnRYQuE Command Overview",
    description: "Welcome to the Level 4 Oversight center. This is your primary node for managing the L'ORDRE AI ecosystem.",
    icon: Activity,
    detail: "Monitor real-time data flux and agent performance at a glance."
  },
  {
    title: "Intelligence Search Engine",
    description: "Access a global command palette via ⌘K to instantly query agents, projects, leads, and assets.",
    icon: Search,
    detail: "A direct link to every data synapse in the system."
  },
  {
    title: "Agent Fleet Management",
    description: "Deploy and specialize AI nodes to handle creative, logical, and administrative tasks concurrently.",
    icon: Bot,
    detail: "Customize personalities and roles for optimized brand delivery."
  },
  {
    title: "System Calibration",
    description: "Adjust site-wide parameters, visual branding, and core thresholds in the Global Settings.",
    icon: Cpu,
    detail: "Synchronize your vision with the underlying platform architecture."
  }
];

export function LOrdEnRYQuEOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    async function checkOnboarding() {
      try {
        const res = await fetch("/api/admin/settings");
        const config = await res.json();
        if (config.onboarding_completed !== "true") {
          setIsOpen(true);
        }
      } catch (e) {
        console.error("Failed to check onboarding status", e);
      }
    }
    checkOnboarding();
  }, []);

  const handleComplete = async () => {
    try {
      await fetch("/api/admin/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });
      setIsOpen(false);
    } catch (e) {
      console.error("Failed to mark onboarding as completed", e);
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl glass-card rounded-[3rem] border-white/5 p-12 overflow-hidden bg-black/40 shadow-accent-glow-xl"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-linear-to-b from-accent/5 to-transparent pointer-events-none" />
          
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors p-2"
          >
            <X size={20} />
          </button>

          <div className="relative z-10 space-y-12">
            {!isCompleted ? (
              <>
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[8px] font-black uppercase tracking-[0.2em]">
                    Step {currentStep + 1} of {STEPS.length}
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-4xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shadow-accent-glow-subtle">
                      {React.createElement(STEPS[currentStep].icon, { size: 40 })}
                    </div>
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none">{STEPS[currentStep].title}</h2>
                      <p className="text-accent/60 text-[10px] font-black uppercase tracking-widest mt-2">{STEPS[currentStep].detail}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 min-h-[100px]">
                   <p className="text-white/60 text-lg leading-relaxed antialiased italic border-l-2 border-accent/30 pl-8 font-medium">
                      &quot;{STEPS[currentStep].description}&quot;
                   </p>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-white/5">
                  <div className="flex gap-2">
                    {STEPS.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-accent' : 'w-2 bg-white/10'}`} 
                      />
                    ))}
                  </div>
                  <button 
                    onClick={nextStep}
                    className="flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-accent-glow-lg transition-all group"
                  >
                    Proceed <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-12 text-center space-y-10"
              >
                <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 size={48} className="animate-pulse" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-5xl font-black tracking-tighter uppercase italic">System Calibrated</h2>
                  <p className="text-white/40 text-sm max-w-sm mx-auto uppercase tracking-widest leading-loose">
                    The Level 4 intelligence link is now stable. You have complete oversight of the L&apos;ORDRE platform.
                  </p>
                </div>
                <button 
                  onClick={handleComplete}
                  className="px-12 py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-white-glow"
                >
                  Enter Command Center
                </button>
              </motion.div>
            )}
          </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
}
