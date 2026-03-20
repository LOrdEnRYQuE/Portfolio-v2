"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { TriangleAlert, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical System Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background">
      <div className="mb-8 p-6 rounded-full bg-accent-silver/10 text-accent-silver animate-pulse">
        <TriangleAlert size={60} strokeWidth={1} />
      </div>
      <h2 className="text-4xl md:text-7xl font-bold text-foreground mb-6 uppercase tracking-tighter">
        Neural Link Overload
      </h2>
      <p className="text-foreground/60 max-w-lg mx-auto mb-12 text-xl font-light leading-relaxed">
        The application encountered a critical exception. 
        Don't worry, your session data is safe. Try re-establishing the connection.
      </p>
      <div className="flex flex-col sm:flex-row gap-6">
        <Button onClick={() => reset()} size="lg" className="rounded-2xl px-12 py-8 text-xl font-black bg-white text-slate-900 shadow-2xl hover:scale-105 transition-transform">
          <RefreshCw size={24} className="mr-3" /> RESTORE SESSION
        </Button>
        <Button href="/" variant="outline" size="lg" className="rounded-2xl px-10 py-8 text-xl border-white/20 hover:bg-white/5 transition-all">
          EMERGENCY CORE EXIT
        </Button>
      </div>
      
      <div className="mt-20 text-xs font-mono text-white/20 uppercase tracking-[0.5em]">
        Status Code: 500 // SYSTEM_UNSTABLE
      </div>
    </div>
  );
}
