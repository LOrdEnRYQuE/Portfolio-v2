"use client";


import { m } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden bg-background">
      {/* Background elements to match the theme */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        <m.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-accent-blue/10 rounded-full blur-[100px]"
        />
        <m.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent-purple/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative z-10 space-y-8">
        <m.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[12rem] font-black leading-none tracking-tighter text-white/5 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Page Lost in Orbit
            </h2>
          </div>
        </m.div>

        <m.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-text-secondary text-lg max-w-md mx-auto"
        >
          The resource you are looking for has been moved or doesn&apos;t exist on the LOrdEnRYQuE core system.
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Button href="/" variant="primary" size="lg" className="rounded-2xl px-10">
            <Home size={18} className="mr-2" />
            Back to Home
          </Button>
          <Button 
            onClick={() => window.history.back()} 
            variant="ghost" 
            size="lg" 
            className="rounded-2xl px-8 text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </Button>
        </m.div>
      </div>
    </div>
  );
}
