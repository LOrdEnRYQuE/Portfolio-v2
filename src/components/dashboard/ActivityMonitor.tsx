"use client";

import { useState, useEffect } from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import { Terminal, Bot, Sparkles, AlertTriangle, ShieldCheck } from "lucide-react";

const LOG_TEMPLATES = [
  { text: "Predictive lead scoring initialized...", icon: Sparkles, color: "text-blue-400" },
  { text: "User session synchronized with AI cluster", icon: ShieldCheck, color: "text-emerald-400" },
  { text: "Processing translation vectors (DE/EN)...", icon: Bot, color: "text-purple-400" },
  { text: "Optimizer: Pruning cold path data refs", icon: Terminal, color: "text-amber-400" },
  { text: "Security node: All systems secured.", icon: ShieldCheck, color: "text-emerald-400" },
  { text: "Anomalous login attempt prevented.", icon: AlertTriangle, color: "text-red-400" },
  { text: "Convex mutation: updateStats completed.", icon: Terminal, color: "text-cyan-400" },
];

export default function ActivityMonitor() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    // Initial logs
    const initial = Array.from({ length: 5 }).map((_, i) => ({
      id: Math.random(),
      ...LOG_TEMPLATES[i % LOG_TEMPLATES.length],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }));
    setLogs(initial);

    const interval = setInterval(() => {
      setLogs((prev) => {
        const next = [
          {
            id: Math.random(),
            ...LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          },
          ...prev.slice(0, 10),
        ];
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 rounded-3xl border border-white/5 bg-[#06080C] h-full flex flex-col min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <Terminal size={16} className="text-accent-blue" />
          AI Activity Feed
        </h3>
        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest animate-pulse">Live Stream</span>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#06080C] z-10 pointer-events-none" />
        <div className="space-y-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {logs.map((log) => (
              <m.div
                key={log.id}
                layout
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-start gap-4 p-3 rounded-xl border border-white/5 bg-white/1 hover:bg-white/3 transition-colors"
                transition={{ duration: 0.3 }}
              >
                <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${log.color}`}>
                  <log.icon size={14} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-[11px] font-bold text-white tracking-tight leading-relaxed">{log.text}</p>
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest font-mono">{log.time}</p>
                </div>
              </m.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
