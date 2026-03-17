"use client";

import { useEffect } from "react";
import { m } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { RefreshCcw, Home, AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden bg-background">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 space-y-8 max-w-2xl px-4">
        <m.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20 
          }}
          className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-12 border border-red-500/20 shadow-red-glow"
        >
          <AlertCircle size={48} className="text-red-500" />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            System Synchronization Failure
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed">
            The LOrdEnRYQuE core encountered an unexpected error while processing your request. 
            Don&apos;t worry, our automated recovery systems are on it.
          </p>
        </m.div>

        {error.digest && (
          <m.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs font-mono text-text-secondary/50 bg-white/5 py-2 px-4 rounded-lg inline-block"
          >
            Error ID: {error.digest}
          </m.p>
        )}

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
        >
          <Button onClick={() => reset()} variant="primary" size="lg" className="rounded-2xl px-10 shadow-blue-glow w-full sm:w-auto">
            <RefreshCcw size={18} className="mr-2" />
            Try Re-synchronizing
          </Button>
          <Button href="/" variant="ghost" size="lg" className="rounded-2xl px-8 text-text-secondary hover:text-foreground w-full sm:w-auto">
            <Home size={18} className="mr-2" />
            Return to Core
          </Button>
        </m.div>
      </div>
    </div>
  );
}
