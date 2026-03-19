"use client";

import { motion } from "framer-motion";
import { Mail, MessageSquare, MapPin, Sparkles, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import InquiryWizard from "@/components/sections/InquiryWizard";
import { siteConfig } from "@/content/site";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />

      {/* Decorative Gradient Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 blur-[130px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none opacity-30" />

      <section className="pt-40 pb-20 px-4 md:px-10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column: Visual & Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-5 space-y-12"
            >
              <div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black uppercase tracking-[0.2em] mb-8 shadow-accent-glow/5"
                >
                  <Sparkles size={14} className="animate-pulse" />
                  Direct Connection
                </motion.div>
                
                <h1 className="text-6xl xl:text-7xl font-black text-foreground mb-8 leading-[1.05] tracking-tight">
                  Ready to <br />
                  <span className="text-accent underline decoration-accent/20 underline-offset-8">Accelerate?</span>
                </h1>
                
                <p className="text-text-secondary text-xl leading-relaxed max-w-lg">
                  I specialize in hyper-scalable architectures and high-conversion UI. Tell me about your mission, and let&apos;s build something that survives the future.
                </p>
              </div>

              {/* Contact Nodes */}
              <div className="grid gap-4">
                {[
                  { 
                    icon: Mail, 
                    label: "Email Protocol", 
                    value: siteConfig.email, 
                    href: `mailto:${siteConfig.email}`,
                    color: "text-accent"
                  },
                  { 
                    icon: MessageSquare, 
                    label: "WhatsApp", 
                    value: "+491722620671", 
                    href: "https://wa.me/491722620671",
                    color: "text-green-500"
                  },
                  { 
                    icon: MapPin, 
                    label: "Location", 
                    value: "Germany Bayern Landshut Nahensteing 188E", 
                    href: "#",
                    color: "text-emerald-400"
                  },
                ].map((item, i) => (
                  <motion.a
                    key={i}
                    href={item.href}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (0.1 * i), duration: 0.5 }}
                    className="group relative flex items-center gap-5 p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-accent/30 hover:bg-white/5 transition-all duration-300"
                  >
                    <div className={cn(
                      "w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg",
                      item.color
                    )}>
                      <item.icon size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-1 opacity-60">{item.label}</p>
                      <p className="text-foreground font-bold text-lg tracking-tight">{item.value}</p>
                    </div>
                    <div className="absolute top-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
                      <ArrowRight size={14} className="text-accent" />
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Wizard Container */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="lg:col-span-7"
            >
              <div className="relative group">
                {/* Visual Accent */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 blur-[60px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="relative z-10 bg-[#0A0A0B] border border-white/10 rounded-[48px] shadow-2xl p-8 md:p-14 overflow-hidden">
                  {/* Subtle Grid Pattern */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                       style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
                  
                  <InquiryWizard />
                </div>

                {/* Performance Assurance */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-8 flex items-center justify-center gap-12 opacity-30 brightness-150"
                >
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em]">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    Secure Link
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em]">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Edge Delivery
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Helper for conditional classes
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
