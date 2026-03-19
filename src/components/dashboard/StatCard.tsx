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
      className={`relative overflow-hidden rounded-2xl border border-white/5 bg-linear-to-br ${colorMap[color]} p-6`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</p>
          <p className="text-3xl font-black text-white tracking-tight">{value}</p>
          {trend && (
            <p className="text-[11px] font-medium text-white/50">{trend}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg[color]}`}>
          <Icon size={22} />
        </div>
      </div>
    </m.div>
  );
}
