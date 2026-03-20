"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Portfolio Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-8 p-4 rounded-full bg-red-500/10 text-red-400">
        <AlertCircle size={48} />
      </div>
      <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 uppercase">
        Systems Malfunction
      </h2>
      <p className="text-text-secondary max-w-md mx-auto mb-10 text-lg">
        We encountered a neural synchronization issue while loading projects. 
        It might be a temporary signal loss.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => reset()} size="lg" className="gap-2">
          <RefreshCw size={18} /> Re-sync Stream
        </Button>
        <Button href="/" variant="outline" size="lg">
          Return to Core
        </Button>
      </div>
    </div>
  );
}
