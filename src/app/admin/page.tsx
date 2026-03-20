"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import SystemHealth from "@/components/dashboard/SystemHealth";
import ActivityMonitor from "@/components/dashboard/ActivityMonitor";
import LeadDetailPanel from "@/components/dashboard/LeadDetailPanel";
import NotificationBell from "@/components/dashboard/NotificationBell";
import { 
  Users, MessageSquare, FolderKanban, DollarSign, 
  Receipt, Activity, Zap, Globe, Search, 
  ArrowRightLeft, ImageIcon, Heart
} from "lucide-react";

export default function AdminDashboard() {
  const stats = useQuery(api.dashboardStats.getStats);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  if (!stats) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-black text-white uppercase tracking-tight italic">Initializing Command <span className="text-accent-blue">Center</span></h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-48 rounded-4xl bg-white/2 animate-pulse border border-white/5" />
          ))}
        </div>
      </div>
    );
  }

  const leadColumns = [
    { 
      key: "name", 
      label: "Origin",
      render: (item: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-white uppercase text-xs tracking-tight">{item.name}</span>
          <span className="text-[10px] text-white/20 font-mono italic">{item.email}</span>
        </div>
      )
    },
    { 
      key: "score", 
      label: "Intensity", 
      render: (item: any) => {
        const score = Number(item.score || 0);
        const color = score > 70 ? "text-emerald-400" : score > 40 ? "text-amber-400" : "text-white/20";
        return (
          <div className="flex items-center gap-2">
            <div className={`w-1 h-3 rounded-full ${score > 70 ? "bg-emerald-500" : score > 40 ? "bg-amber-500" : "bg-white/10"}`} />
            <span className={`font-mono font-black ${color}`}>{score}%</span>
          </div>
        );
      }
    },
    { key: "status", label: "State", render: (item: any) => <StatusBadge status={String(item.status)} /> },
  ];

  const invoiceColumns = [
    { 
      key: "number", 
      label: "Transaction ID",
      render: (item: any) => <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{item.number}</span>
    },
    { key: "projectName", label: "Entity" },
    { 
      key: "amount", 
      label: "Volume", 
      render: (item: any) => (
        <span className="font-mono font-black text-white italic">
          €{Number(item.amount || 0).toLocaleString()}
        </span>
      )
    },
    { key: "status", label: "Status", render: (item: any) => <StatusBadge status={String(item.status)} /> },
  ];

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div>
          <h1 className="text-4xl font-black text-white  uppercase leading-none italic">Command <span className="text-accent-blue">Center</span></h1>
          <p className="text-[10px] text-white/30 font-black mt-4 flex items-center gap-3 uppercase tracking-[0.3em] italic">
            <Activity size={14} className="text-accent-blue animate-pulse" />
            Infrastructure Intelligence & Organic Growth Engine
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white/2 p-2.5 rounded-4xl border border-white/5 backdrop-blur-3xl">
            <div className="px-6 py-2.5 rounded-2xl bg-white/2 border border-white/5">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] leading-none mb-1.5 italic">Real-time Pulse</p>
              <p className="text-xs font-black text-white tabular-nums tracking-tighter uppercase italic">Operational</p>
            </div>
            <button className="p-4 rounded-2xl bg-accent-blue text-white hover:bg-white hover:text-black shadow-2xl shadow-accent-blue/20 transition-all duration-500 active:scale-95">
              <Zap size={20} />
            </button>
          </div>
          <NotificationBell />
        </div>
      </div>

      {/* Primary Metrics: Core Business */}
      <section className="space-y-6">
        <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2 italic">Commercial Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="blue" trend="+12.5% M/M" />
          <StatCard label="Total Revenue" value={`€${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} color="green" trend="Live Sync" />
          <StatCard label="Invoices" value={stats.totalInvoices} icon={Receipt} color="purple" trend="Processing" />
          <StatCard label="Active Reach" value={stats.activeProjects} icon={FolderKanban} color="cyan" trend={`${stats.totalProjects} deployed`} />
        </div>
      </section>

      {/* SEO Intelligence: Organic Visibility */}
      <section className="space-y-6">
        <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-2 italic">Organic Growth Engine (SEO)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Indexed Depth" value={stats.seo?.indexedCount || 0} icon={Search} color="blue" trend={`${stats.seo?.totalEntities} Total Pages`} />
          <StatCard label="Visibility Health" value={`${stats.seo?.healthScore || 0}%`} icon={Globe} color="cyan" trend={`${stats.seo?.noIndexCount} No-Index`} />
          <StatCard label="Redirects" value={stats.seo?.redirectsActive || 0} icon={ArrowRightLeft} color="purple" trend="Active Routing" />
          <StatCard label="Media Alt Cov." value={`${stats.seo?.altTextCoverage || 0}%`} icon={ImageIcon} color="amber" trend="Search Discover" />
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        {/* Left Column: Health & Recent Activity */}
        <div className="xl:col-span-4 space-y-10">
          <SystemHealth />
          <ActivityMonitor />
          
          <div className="p-10 rounded-4xl bg-linear-to-br from-accent-blue/10 to-transparent border border-white/5 space-y-4 relative overflow-hidden group">
             <Heart size={40} className="absolute -right-4 -bottom-4 text-accent-blue/5 group-hover:scale-150 transition-transform duration-1000" />
             <h4 className="text-[10px] font-black text-white/40 uppercase italic tracking-[0.3em]">SEO INSIGHT</h4>
             <p className="text-sm text-white/60 leading-relaxed italic">
               "Your <span className="text-white font-bold">Media Library</span> currently has <span className="text-accent-blue font-bold tracking-tight">{stats.seo?.altTextCoverage}%</span> alt-text coverage. Improving this will boost image search ranking."
             </p>
          </div>
        </div>

        {/* Right Column: Key Data Tables */}
        <div className="xl:col-span-8 space-y-10">
          <div className="p-1 border border-white/5 bg-[#06080C] rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
            <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-amber-500/5 to-transparent pointer-events-none" />
            <div className="p-8 space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase  italic">
                  <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                  CRM Inbox (Incoming Leads)
                </h2>
                <button className="px-6 py-2 rounded-xl bg-white/2 border border-white/10 text-[9px] font-black text-white/30 hover:text-white uppercase tracking-[0.2em] transition-all">Export CRM</button>
              </div>
              <DataTable 
                columns={leadColumns} 
                data={stats.recentLeads as unknown as Record<string, unknown>[]} 
                onRowClick={(lead) => { setSelectedLead(lead); setIsPanelOpen(true); }}
                emptyMessage="Lead sensors clear. No recent entries." 
              />
            </div>
          </div>

          <div className="p-1 border border-white/5 bg-[#06080C] rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
             <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-blue-500/5 to-transparent pointer-events-none" />
             <div className="p-8 space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase  italic">
                  <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                  Ledger Flow (Invoices)
                </h2>
                <button className="px-6 py-2 rounded-xl bg-white/2 border border-white/10 text-[9px] font-black text-white/30 hover:text-white uppercase tracking-[0.2em] transition-all italic">Audit Log</button>
              </div>
              <DataTable columns={invoiceColumns} data={stats.recentInvoices as unknown as Record<string, unknown>[]} emptyMessage="Financial flow registers empty." />
            </div>
          </div>
        </div>
      </div>

      <LeadDetailPanel 
        lead={selectedLead} 
        isOpen={isPanelOpen} 
        onClose={() => { setIsPanelOpen(false); setSelectedLead(null); }} 
      />
    </div>
  );
}
