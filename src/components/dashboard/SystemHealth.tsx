"use client";

import { motion as m } from "framer-motion";
import { Activity, Cpu, Database, Globe, Server } from "lucide-react";

export default function SystemHealth() {
  const statusItems = [
    { label: "Core Engine", status: "Operational", icon: Cpu, color: "text-emerald-400" },
    { label: "Database", status: "Stable", icon: Database, color: "text-blue-400" },
    { label: "Edge Workers", status: "Active", icon: Globe, color: "text-purple-400" },
    { label: "Convex Cloud", status: "Connected", icon: Server, color: "text-cyan-400" },
  ];

  return (
    <div className="p-6 rounded-3xl border border-white/5 bg-[#06080C] space-y-6 overflow-hidden relative group h-full">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_70%)]" />
      
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Activity size={16} className="text-accent-blue animate-pulse" />
            System Resilience
          </h3>
          <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">Real-time Node Health</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">99.9% Uptime</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 relative z-10">
        {statusItems.map((item, i) => (
          <m.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition-all group/item flex flex-col items-center text-center"
          >
            <item.icon size={18} className={`${item.color} mb-3 group-hover/item:scale-110 transition-transform`} />
            <p className="text-[9px] font-black text-white/25 uppercase tracking-widest mb-1">{item.label}</p>
            <p className="text-[11px] font-bold text-white tracking-tight">{item.status}</p>
          </m.div>
        ))}
      </div>

      <div className="pt-6 border-t border-white/5 relative z-10">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Global Compute Load</span>
          </div>
          <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">12.4%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-px">
          <m.div 
            initial={{ width: 0 }}
            animate={{ width: "12.4%" }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            className="h-full bg-linear-to-r from-blue-500 via-accent-blue to-purple-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]"
          />
        </div>
      </div>
    </div>
  );
}
