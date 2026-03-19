"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Briefcase, Ticket, Receipt, ArrowRight } from "lucide-react";
import Link from "next/link";
import DataTable from "@/components/dashboard/DataTable";

export default function ClientDashboard() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const user = useQuery(api.users.getUserByEmail, userEmail ? { email: userEmail } : "skip");
  const project = useQuery(api.internalProjects.getProjectByUser, user ? { userId: user._id } : "skip");
  const tickets = useQuery(api.tickets.listByUser, user ? { userId: user._id } : "skip");
  const invoices = useQuery(api.invoices.listByUser, user ? { userId: user._id } : "skip");

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="h-32 rounded-2xl bg-white/5 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      </div>
    );
  }

  const openTickets = tickets?.filter((t) => t.status !== "RESOLVED").length || 0;
  const totalInvoices = invoices?.length || 0;

  const invoiceColumns = [
    { key: "number", label: "Invoice #" },
    { key: "amount", label: "Amount", render: (item: Record<string, unknown>) => `€${Number(item.amount).toLocaleString()}` },
    {
      key: "status",
      label: "Status",
      render: (item: Record<string, unknown>) => <StatusBadge status={String(item.status)} />,
    },
    {
      key: "_id",
      label: "Action",
      render: () => (
        <Link href="/client/invoices" className="text-accent-blue hover:text-accent-purple transition-colors">
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="p-8 rounded-2xl border border-white/5 bg-linear-to-r from-blue-500/10 to-purple-500/10">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Welcome back, {user.name || "there"} 👋
        </h1>
        <p className="text-sm text-white/40 mt-1">Here&apos;s your project overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Project Status"
          value={project?.status || "—"}
          icon={Briefcase}
          color="green"
          trend={project ? `${project.stages?.filter((s: { status: string }) => s.status === "COMPLETED").length || 0}/${project.stages?.length || 0} stages done` : undefined}
        />
        <StatCard label="Open Tickets" value={openTickets} icon={Ticket} color="amber" trend={`${tickets?.length || 0} total`} />
        <StatCard label="Invoices" value={totalInvoices} icon={Receipt} color="blue" />
      </div>

      {project && (
        <div className="p-6 rounded-2xl border border-white/5 bg-white/2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Project Progress</h2>
            <Link href="/client/project" className="flex items-center gap-1.5 text-xs font-medium text-accent-blue hover:text-accent-purple transition-colors">
              View Details <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {project.stages?.map((stage: { _id: string; title: string; status: string; order: number }) => (
              <div key={stage._id} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full shrink-0 ${
                  stage.status === "COMPLETED" ? "bg-emerald-400" :
                  stage.status === "IN_PROGRESS" ? "bg-blue-400 animate-pulse" :
                  "bg-white/20"
                }`} />
                <span className={`text-sm ${stage.status === "COMPLETED" ? "text-white/40 line-through" : stage.status === "IN_PROGRESS" ? "text-white font-medium" : "text-white/30"}`}>
                  {stage.title}
                </span>
                <StatusBadge status={stage.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/client/tickets" className="p-6 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/4 transition-colors group">
          <h3 className="text-sm font-bold text-white mb-1">Need Help?</h3>
          <p className="text-xs text-white/40">Open a support ticket and we&apos;ll respond within 24h</p>
          <ArrowRight size={16} className="mt-3 text-white/20 group-hover:text-accent-blue transition-colors" />
        </Link>
        <Link href="/client/invoices" className="p-6 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/4 transition-colors group">
          <h3 className="text-sm font-bold text-white mb-1">Billing</h3>
          <p className="text-xs text-white/40">View your invoices and payment history</p>
          <ArrowRight size={16} className="mt-3 text-white/20 group-hover:text-accent-blue transition-colors" />
        </Link>
      </div>

      <div className="p-6 rounded-2xl border border-white/5 bg-white/2 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Receipt size={18} className="text-blue-400" /> Recent Invoices
        </h2>
        <DataTable 
          columns={invoiceColumns} 
          data={(invoices || []).slice(0, 3) as unknown as Record<string, unknown>[]} 
          emptyMessage="No invoices yet" 
        />
      </div>
    </div>
  );
}
