"use client";

import { m } from "framer-motion";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: string;
}

export default function StatCard({ label, value, icon: Icon, trend, color = "blue" }: StatCardProps) {
  const colorMap: Record<string, string> = {
    blue: "from-blue-500/20 to-blue-600/5 text-blue-400",
    green: "from-emerald-500/20 to-emerald-600/5 text-emerald-400",
    purple: "from-purple-500/20 to-purple-600/5 text-purple-400",
    amber: "from-amber-500/20 to-amber-600/5 text-amber-400",
    red: "from-red-500/20 to-red-600/5 text-red-400",
    cyan: "from-cyan-500/20 to-cyan-600/5 text-cyan-400",
  };

  const iconBg: Record<string, string> = {
    blue: "bg-blue-500/15 text-blue-400",
    green: "bg-emerald-500/15 text-emerald-400",
    purple: "bg-purple-500/15 text-purple-400",
    amber: "bg-amber-500/15 text-amber-400",
    red: "bg-red-500/15 text-red-400",
    cyan: "bg-cyan-500/15 text-cyan-400",
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-3xl border border-white/5 bg-linear-to-br ${colorMap[color]} p-7 transition-all duration-500 hover:border-white/20 group hover:shadow-[0_0_50px_rgba(59,130,246,0.1)]`}
    >
      <div className="absolute inset-x-0 bottom-0 h-16 opacity-30 group-hover:opacity-50 transition-opacity">
        <svg viewBox="0 0 100 30" width="100%" height="100%" preserveAspectRatio="none">
          <m.path
            d="M0 25 Q10 20 20 23 T40 15 T60 25 T80 10 T100 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-white/20"
          />
        </svg>
      </div>

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</p>
          <p className="text-4xl font-black text-white tracking-tight leading-none">{value}</p>
          {trend && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 border border-white/10 text-[10px] font-bold text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {trend}
              </div>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 ${iconBg[color]} group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={26} />
        </div>
      </div>
    </m.div>
  );
}
