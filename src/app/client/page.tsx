import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Briefcase, Ticket, Receipt, ArrowRight, Zap, Target, ShieldCheck, Sparkle } from "lucide-react";
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
        <div className="h-48 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <div key={i} className="h-32 rounded-3xl bg-white/5 animate-pulse border border-white/5" />)}
        </div>
      </div>
    );
  }

  const openTickets = tickets?.filter((t) => t.status !== "RESOLVED").length || 0;
  const totalInvoices = invoices?.length || 0;

  const invoiceColumns = [
    { key: "number", label: "Invoice ID" },
    { 
      key: "amount", 
      label: "Amount", 
      render: (item: Record<string, unknown>) => (
        <span className="font-mono font-bold text-white">
          €{Number(item.amount || 0).toLocaleString()}
        </span>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (item: Record<string, unknown>) => <StatusBadge status={String(item.status)} />,
    },
  ];

  return (
    <div className="space-y-10 pb-10 max-w-7xl mx-auto">
      {/* Premium Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden p-10 rounded-[2.5rem] border border-white/10 bg-[#0A0D11] shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/5 blur-[120px] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-[10px] font-black text-accent-blue uppercase tracking-widest">Client Portal</span>
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck size={10} /> Active Partnership
              </div>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase leading-tight">
              Welcome Back, <span className="text-accent-blue">{user.name?.split(" ")[0]}</span>
            </h1>
            <p className="text-white/40 font-medium max-w-lg leading-relaxed">
              Your platform development is reaching its next milestone. Track progress, manage billing, and connect with our engineers.
            </p>
          </div>
          <div className="p-2 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="px-6 py-4 rounded-2xl bg-white/2 border border-white/5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <Target className="text-accent-blue" size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest leading-none mb-1 text-right">Project Health</p>
                <p className="text-xl font-black text-emerald-400 tabular-nums">98%</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Build Progress"
          value={project?.status || "Analyzing"}
          icon={Briefcase}
          color="green"
          trend={project ? `${project.stages?.filter((s: any) => s.status === "COMPLETED").length || 0}/${project.stages?.length || 0} Finished` : "Initializing"}
        />
        <StatCard label="Priority Tickets" value={openTickets} icon={Ticket} color="amber" trend={`${tickets?.length || 0} Open Flow`} />
        <StatCard label="Financial Overview" value={totalInvoices} icon={Receipt} color="blue" trend="Invoices Issued" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left: Project Lifecycle */}
        <div className="xl:col-span-8 space-y-8">
          {project && (
            <div className="p-8 rounded-[2.5rem] border border-white/5 bg-[#06080C] space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
                    <Zap size={18} className="text-accent-blue" /> Production Lifecycle
                  </h2>
                  <p className="text-xs text-white/30 mt-1">Real-time stage tracking from our internal repository</p>
                </div>
                <Link href="/client/project" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.stages?.map((stage: any, i: number) => (
                  <motion.div 
                    key={stage._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-5 rounded-2xl border transition-all ${
                      stage.status === "IN_PROGRESS" 
                      ? "bg-accent-blue/5 border-accent-blue/20" 
                      : "bg-white/2 border-white/5"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2 rounded-lg ${
                        stage.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400" :
                        stage.status === "IN_PROGRESS" ? "bg-accent-blue/10 text-accent-blue animate-pulse" :
                        "bg-white/5 text-white/20"
                      }`}>
                        <Sparkle size={14} />
                      </div>
                      <StatusBadge status={stage.status} />
                    </div>
                    <span className={`text-sm font-bold block mb-1 ${stage.status === "COMPLETED" ? "text-white/40" : "text-white"}`}>
                      {stage.title}
                    </span>
                    <p className="text-[10px] text-white/30 font-medium leading-none uppercase tracking-widest">Stage {stage.order}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="p-8 rounded-[2.5rem] border border-white/5 bg-[#06080C] space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
                <Receipt size={18} className="text-accent-blue" /> Recent Transactions
              </h2>
              <Link href="/client/invoices" className="text-[10px] font-bold text-white/20 hover:text-white uppercase tracking-widest transition-colors">History →</Link>
            </div>
            <DataTable 
              columns={invoiceColumns} 
              data={(invoices || []).slice(0, 3) as unknown as Record<string, unknown>[]} 
              emptyMessage="No financial data available" 
            />
          </div>
        </div>

        {/* Right: Quick Actions & Support */}
        <div className="xl:col-span-4 space-y-6">
          <div className="p-8 rounded-4xl border border-white/5 bg-accent-blue/5 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/20 blur-3xl group-hover:blur-2xl transition-all" />
            <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">Need Direct Support?</h3>
            <p className="text-xs text-white/40 leading-relaxed mb-6 font-medium">
              Our engineering team is standing by to assist with any technical challenges or feature requests.
            </p>
            <Link 
              href="/client/tickets" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-blue text-white text-xs font-bold hover:scale-105 transition-all shadow-lg"
            >
              Open Incident Ticket <ArrowRight size={14} />
            </Link>
          </div>

          <div className="p-8 rounded-4xl border border-white/5 bg-white/2 space-y-4">
            <h3 className="text-[10px] font-black text-white/25 uppercase tracking-widest">Platform Resources</h3>
            <div className="space-y-3">
              {[
                { label: "Documentation", href: "#" },
                { label: "Asset Manager", href: "#" },
                { label: "Environment Logs", href: "#" }
              ].map((link, i) => (
                <Link 
                  key={i} 
                  href={link.href}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-sm text-white/60 hover:text-white transition-all"
                >
                  {link.label} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
