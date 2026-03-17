"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Circle,
  TrendingUp,
  Download,
  FileText,
  MessageSquare,
  Zap,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface ProjectStage {
  id: string;
  title: string;
  description: string;
  status: string;
  order: number;
}

interface ProjectData {
  id: string;
  title: string;
  description: string;
  status: string;
  health: string;
  efficiency: number;
  stages: ProjectStage[];
}

function StageIcon({ status }: { status: string }) {
  if (status === "COMPLETED") return <CheckCircle2 size={18} className="text-emerald-400" />;
  if (status === "IN_PROGRESS") return <Clock size={18} className="text-accent animate-pulse" />;
  return <Circle size={18} className="text-white/20" />;
}

function StageCard({ stage, index }: { stage: ProjectStage; index: number }) {
  const isCompleted = stage.status === "COMPLETED";
  const isActive = stage.status === "IN_PROGRESS";
  const isUpcoming = stage.status === "UPCOMING";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08 }}
      className={`relative p-5 rounded-2xl border transition-all ${
        isActive
          ? "border-accent/30 bg-accent/5"
          : isCompleted
          ? "border-emerald-500/20 bg-emerald-500/5"
          : "border-white/8 bg-white/2 opacity-60"
      }`}
    >
      {isActive && (
        <div className="absolute -top-px left-6 right-6 h-px bg-linear-to-r from-transparent via-accent/60 to-transparent" />
      )}
      <div className="flex items-start gap-4">
        <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
          isActive ? "bg-accent/10 border border-accent/20" :
          isCompleted ? "bg-emerald-500/10 border border-emerald-500/20" :
          "bg-white/5 border border-white/8"
        }`}>
          <StageIcon status={stage.status} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[9px] font-black tracking-widest uppercase text-white/30 mb-1 block">Phase {stage.order}</span>
              <h3 className={`text-sm font-bold leading-tight ${isUpcoming ? "text-white/40" : "text-white"}`}>
                {stage.title}
              </h3>
            </div>
            {isActive && (
              <span className="shrink-0 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider">
                In Progress
              </span>
            )}
            {isCompleted && (
              <span className="shrink-0 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                Done
              </span>
            )}
          </div>
          <p className={`mt-1.5 text-xs leading-relaxed ${isUpcoming ? "text-white/25" : "text-white/50"}`}>
            {stage.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ClientPortal() {
  const { data: session } = useSession();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch("/api/client/project");
        if (res.ok) setProject(await res.json());
      } catch (err) {
        console.error("Failed to fetch project:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, []);

  const completedStages = project?.stages.filter((s) => s.status === "COMPLETED").length ?? 0;
  const totalStages = project?.stages.length ?? 0;
  const progressPct = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

  const quickActions = [
    { icon: FileText, label: "Documents", href: "/client/documents", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
    { icon: MessageSquare, label: "Support", href: "/client/support", color: "text-accent", bg: "bg-accent/10 border-accent/20" },
    { icon: Zap, label: "Settings", href: "/client/settings", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20" },
    { icon: Download, label: "Résumé", href: "/documents/Attila_Lazar_Resume.pdf", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", external: true },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden border border-white/10 bg-linear-to-br from-accent/10 via-transparent to-blue-600/5 p-8 md:p-10"
      >
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/15 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <p className="text-[10px] font-black tracking-[0.35em] uppercase text-accent/70">Client Portal</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Welcome back,{" "}
              <span className="text-accent">{session?.user?.name?.split(" ")[0] ?? "Client"}</span>
            </h1>
            <p className="text-white/50 text-sm max-w-md">
              Track your project milestones, download documents, and get direct support from your project dashboard.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 bg-black/20 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <p className="text-[10px] font-black tracking-widest uppercase text-white/30">Project Status</p>
              <p className="text-sm font-bold text-emerald-400">{project?.status ?? "Active"}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Overall Progress", value: loading ? "—" : `${progressPct}%`, icon: TrendingUp, color: "text-accent" },
          { label: "Phases Complete", value: loading ? "—" : `${completedStages} / ${totalStages}`, icon: CheckCircle2, color: "text-emerald-400" },
          { label: "Project Health", value: loading ? "—" : (project?.health ?? "Stable"), icon: AlertCircle, color: "text-yellow-400" },
          { label: "Efficiency", value: loading ? "—" : `${project?.efficiency ?? 100}%`, icon: Zap, color: "text-blue-400" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="p-5 rounded-2xl bg-white/3 border border-white/8 space-y-2"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-current/5 border border-current/10 ${item.color}`}>
              <item.icon size={16} />
            </div>
            <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Project Stages */}
        <div className="lg:col-span-2 rounded-2xl bg-white/3 border border-white/8 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">{loading ? "Loading..." : (project?.title ?? "Your Project")}</h2>
              <p className="text-[11px] text-white/30 mt-0.5">{project?.description}</p>
            </div>
            {!loading && (
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{progressPct}%</p>
                <p className="text-[10px] text-white/30 uppercase tracking-wider">Complete</p>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
              className="h-full bg-linear-to-r from-accent/80 to-accent rounded-full"
            />
          </div>

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
              ))
            ) : (
              project?.stages.map((stage, i) => <StageCard key={stage.id} stage={stage} index={i} />)
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="rounded-2xl bg-white/3 border border-white/8 p-6 space-y-4">
            <h2 className="text-sm font-bold text-white">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, i) => (
                <Link
                  key={i}
                  href={action.href}
                  target={action.external ? "_blank" : undefined}
                  download={action.external}
                  className={`group p-4 rounded-xl border bg-white/2 hover:bg-white/5 transition-all ${action.bg}`}
                >
                  <action.icon size={18} className={`${action.color} mb-2`} />
                  <p className={`text-xs font-bold ${action.color}`}>{action.label}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Support Prompt */}
          <div className="rounded-2xl bg-white/3 border border-white/8 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <MessageSquare size={16} className="text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Need Help?</h3>
                <p className="text-[11px] text-white/40 mt-0.5 leading-relaxed">
                  Have a question or update? Send us a message and we&apos;ll respond within 24 hours.
                </p>
              </div>
            </div>
            <Link
              href="/client/support"
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-bold hover:bg-accent/20 transition-colors"
            >
              Open Support Chat
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Next Milestone */}
          {project?.stages && (
            <div className="rounded-2xl bg-linear-to-br from-accent/8 to-transparent border border-accent/15 p-6 space-y-3">
              <p className="text-[10px] font-black tracking-widest uppercase text-accent/60">Up Next</p>
              {(() => {
                const next = project.stages.find((s) => s.status === "IN_PROGRESS" || s.status === "UPCOMING");
                if (!next) return <p className="text-white/40 text-sm">All phases complete! 🎉</p>;
                return (
                  <>
                    <h3 className="text-sm font-bold text-white">{next.title}</h3>
                    <p className="text-[11px] text-white/40 leading-relaxed">{next.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StageIcon status={next.status} />
                      <span className="text-[11px] text-white/50">
                        {next.status === "IN_PROGRESS" ? "Currently active" : "Starting soon"}
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
