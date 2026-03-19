"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import StatusBadge from "@/components/dashboard/StatusBadge";

export default function ClientProjectPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const user = useQuery(api.users.getUserByEmail, userEmail ? { email: userEmail } : "skip");
  const project = useQuery(api.internalProjects.getProjectByUser, user ? { userId: user._id } : "skip");

  if (!project) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">My Project</h1>
        <div className="p-12 rounded-2xl border border-white/5 bg-white/2 text-center">
          <p className="text-white/40">No project assigned yet.</p>
          <p className="text-xs text-white/20 mt-2">Contact the team to get started.</p>
        </div>
      </div>
    );
  }

  const completedStages = project.stages?.filter((s: { status: string }) => s.status === "COMPLETED").length || 0;
  const totalStages = project.stages?.length || 0;
  const progress = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{project.title}</h1>
        <p className="text-sm text-white/40 mt-1">{project.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-white/5 bg-white/2">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Status</p>
          <StatusBadge status={project.status} />
        </div>
        <div className="p-5 rounded-2xl border border-white/5 bg-white/2">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Health</p>
          <StatusBadge status={project.health || "STABLE"} />
        </div>
        <div className="p-5 rounded-2xl border border-white/5 bg-white/2">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Progress</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-accent-blue transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-sm font-bold text-white">{progress}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Stage Timeline</h2>
        <div className="relative pl-8 space-y-6">
          <div className="absolute left-[14px] top-3 bottom-3 w-px bg-white/10" />
          {project.stages?.map((stage: { _id: string; title: string; description?: string; status: string; order: number }) => (
            <div key={stage._id} className="relative">
              <div className={`absolute left-[-22px] top-1.5 w-3 h-3 rounded-full border-2 ${
                stage.status === "COMPLETED" ? "bg-emerald-400 border-emerald-400" :
                stage.status === "IN_PROGRESS" ? "bg-blue-400 border-blue-400 animate-pulse" :
                "bg-transparent border-white/20"
              }`} />
              <div className={`p-5 rounded-xl border ${
                stage.status === "IN_PROGRESS" ? "border-blue-500/20 bg-blue-500/5" : "border-white/5 bg-white/2"
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`text-sm font-bold ${stage.status === "COMPLETED" ? "text-white/40" : "text-white"}`}>
                    {stage.title}
                  </h3>
                  <StatusBadge status={stage.status} />
                </div>
                {stage.description && (
                  <p className="text-xs text-white/30 mt-1">{stage.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
