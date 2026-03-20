"use client";

const STATUS_STYLES: Record<string, string> = {
  // Common
  YES: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  NO: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  TRUE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  FALSE: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  
  // Tickets & Projects
  OPEN: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  IN_PROGRESS: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  ACTIVE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  RESOLVED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  COMPLETED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  UPCOMING: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  PAUSED: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  
  // Leads
  NEW: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  CONTACTED: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  QUALIFIED: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  CONVERTED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  LOST: "bg-red-500/15 text-red-400 border-red-500/20",
  
  // Financial & CMS
  DRAFT: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  SENT: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  PAID: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  OVERDUE: "bg-red-500/15 text-red-400 border-red-500/20",
  PUBLISHED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  
  // SEO
  INDEXED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  "NO-INDEX": "bg-amber-500/15 text-amber-400 border-amber-500/20",
  
  // System Health
  STABLE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  WARNING: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  CRITICAL: "bg-red-500/15 text-red-400 border-red-500/20",
  
  // Roles
  ADMIN: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  CLIENT: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  USER: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  
  // Priority
  LOW: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  MEDIUM: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  HIGH: "bg-red-500/15 text-red-400 border-red-500/20",
};

export default function StatusBadge({ status }: { status: string }) {
  const key = String(status).toUpperCase();
  const style = STATUS_STYLES[key] || STATUS_STYLES[String(status)] || "bg-white/10 text-white/60 border-white/10";

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${style}`}>
      {status}
    </span>
  );
}
