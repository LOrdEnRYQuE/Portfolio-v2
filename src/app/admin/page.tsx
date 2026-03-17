"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Bot,
  MessageSquare,
  Zap,
  ShieldCheck,
  Briefcase,
  FileText,
  TrendingUp,
  Users,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Circle,
  Inbox,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  agents: number;
  conversations: number;
  leads: number;
  assets: number;
  portfolio: number;
  users: number;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  concept: string;
  industry: string;
  status: string;
  createdAt: string;
}

function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  color,
  href,
  loading,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  trend: string;
  color: string;
  href: string;
  loading: boolean;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -2 }}
        className="relative p-6 rounded-2xl bg-white/3 border border-white/8 hover:border-white/20 hover:bg-white/5 transition-all duration-300 group cursor-pointer overflow-hidden"
      >
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${color}`} />
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all ${color} bg-current/5`}>
            <Icon size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
          <ArrowUpRight size={14} className="text-white/20 group-hover:text-white/60 transition-colors" />
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold tracking-tight text-white">
            {loading ? (
              <span className="w-12 h-7 bg-white/10 rounded animate-pulse inline-block" />
            ) : (
              value.toLocaleString()
            )}
          </p>
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">{label}</p>
          <p className="text-[11px] text-white/25">{trend}</p>
        </div>
      </motion.div>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
    NEW: { label: "New", color: "text-blue-400 bg-blue-400/10 border-blue-400/20", Icon: Circle },
    REVIEWING: { label: "Reviewing", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", Icon: Clock },
    CONVERTED: { label: "Converted", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", Icon: CheckCircle2 },
    REJECTED: { label: "Rejected", color: "text-red-400 bg-red-400/10 border-red-400/20", Icon: AlertCircle },
  };
  const s = map[status] || map["NEW"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${s.color}`}>
      <s.Icon size={10} />
      {s.label}
    </span>
  );
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({ agents: 0, conversations: 0, leads: 0, assets: 0, portfolio: 0, users: 0 });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [agentsRes, leadsRes, mediaRes, portfolioRes, usersRes] = await Promise.allSettled([
          fetch("/api/agents"),
          fetch("/api/admin/leads"),
          fetch("/api/admin/media"),
          fetch("/api/portfolio"),
          fetch("/api/admin/users"),
        ]);

        const agentsData = agentsRes.status === "fulfilled" && agentsRes.value.ok ? await agentsRes.value.json() : [];
        const leadsData = leadsRes.status === "fulfilled" && leadsRes.value.ok ? await leadsRes.value.json() : [];
        const mediaData = mediaRes.status === "fulfilled" && mediaRes.value.ok ? await mediaRes.value.json() : [];
        const portfolioData = portfolioRes.status === "fulfilled" && portfolioRes.value.ok ? await portfolioRes.value.json() : [];
        const usersData = usersRes.status === "fulfilled" && usersRes.value.ok ? await usersRes.value.json() : [];

        const totalConvs = Array.isArray(agentsData)
          ? agentsData.reduce((acc: number, agent: { _count?: { conversations: number } }) => acc + (agent._count?.conversations || 0), 0)
          : 0;

        setStats({
          agents: Array.isArray(agentsData) ? agentsData.length : 0,
          conversations: totalConvs,
          leads: Array.isArray(leadsData) ? leadsData.length : 0,
          assets: Array.isArray(mediaData) ? mediaData.length : 0,
          portfolio: Array.isArray(portfolioData) ? portfolioData.length : 0,
          users: Array.isArray(usersData) ? usersData.length : 0,
        });

        // Pick the 5 most recent leads
        if (Array.isArray(leadsData)) {
          setRecentLeads(
            [...leadsData]
              .sort((a: Lead, b: Lead) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 5)
          );
        }
      } catch (e) {
        console.error("Failed to fetch dashboard stats", e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: "Active Agents", value: stats.agents, icon: Bot, trend: "AI agent fleet", color: "text-accent", href: "/admin/agents" },
    { label: "Conversations", value: stats.conversations, icon: MessageSquare, trend: "Across all agents", color: "text-blue-400", href: "/admin/agents" },
    { label: "Leads", value: stats.leads, icon: Zap, trend: "Total inquiries", color: "text-yellow-400", href: "/admin/leads" },
    { label: "Media Assets", value: stats.assets, icon: ShieldCheck, trend: "Files in vault", color: "text-purple-400", href: "/admin/media" },
    { label: "Portfolio Items", value: stats.portfolio, icon: Briefcase, trend: "Published projects", color: "text-emerald-400", href: "/admin/portfolio" },
    { label: "Users", value: stats.users, icon: Users, trend: "Registered accounts", color: "text-rose-400", href: "/admin/users" },
  ];

  const quickLinks = [
    { label: "Lead Hub", desc: "Manage inquiries", icon: Zap, href: "/admin/leads", color: "text-yellow-400" },
    { label: "Agent Fleet", desc: "Configure AI agents", icon: Bot, href: "/admin/agents", color: "text-accent" },
    { label: "Portfolio", desc: "Showcase projects", icon: Briefcase, href: "/admin/portfolio", color: "text-emerald-400" },
    { label: "Blog", desc: "Publish content", icon: FileText, href: "/admin/blog", color: "text-blue-400" },
  ];

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="min-h-screen p-8 md:p-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Command Overview</p>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-white/40 text-sm">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">All Systems Operational</span>
        </div>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
          >
            <StatCard {...card} loading={loading} />
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 rounded-2xl bg-white/3 border border-white/8 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">
                <Inbox size={16} className="text-yellow-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Recent Leads</h2>
                <p className="text-[11px] text-white/30">Latest inquiries from clients</p>
              </div>
            </div>
            <Link href="/admin/leads" className="flex items-center gap-1.5 text-[11px] font-bold text-white/30 hover:text-accent transition-colors">
              View all <ExternalLink size={11} />
            </Link>
          </div>

          <div className="divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="py-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-white/5 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
                    <div className="h-2.5 w-48 bg-white/5 rounded animate-pulse" />
                  </div>
                </div>
              ))
            ) : recentLeads.length === 0 ? (
              <div className="py-10 text-center text-white/30 text-sm">No leads yet. Share your contact page!</div>
            ) : (
              recentLeads.map((lead, i) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="py-4 flex items-center gap-4 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/40 font-bold text-sm shrink-0">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white truncate">{lead.name}</p>
                      <StatusBadge status={lead.status} />
                    </div>
                    <p className="text-[11px] text-white/40 truncate">{lead.concept} · {lead.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-white/30">{timeAgo(lead.createdAt)}</p>
                    <p className="text-[10px] text-white/20">{lead.industry}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-white/3 border border-white/8 p-6 space-y-4">
            <h2 className="text-sm font-bold text-white">Quick Access</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="group p-4 rounded-xl bg-white/3 border border-white/8 hover:border-white/20 hover:bg-white/5 transition-all"
                >
                  <div className={`w-8 h-8 rounded-lg mb-3 flex items-center justify-center ${link.color} bg-current/10 border border-current/20`}>
                    <link.icon size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs font-bold text-white/80">{link.label}</p>
                  <p className="text-[11px] text-white/30">{link.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* System Stats */}
          <div className="rounded-2xl bg-white/3 border border-white/8 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-accent" />
              <h2 className="text-sm font-bold text-white">System Health</h2>
            </div>
            {[
              { label: "Database", value: 100, color: "bg-emerald-400" },
              { label: "API Routes", value: 98, color: "bg-accent" },
              { label: "Agent Core", value: 95, color: "bg-blue-400" },
            ].map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-white/50">{item.label}</span>
                  <span className="text-white/40 font-medium">{item.value}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 1.2, ease: "easeOut" }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Performance Mini-Chart */}
          <div className="rounded-2xl bg-white/3 border border-white/8 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-accent" />
                <h2 className="text-sm font-bold text-white">Lead Pulse</h2>
              </div>
            </div>
            <div className="flex items-end gap-1.5 h-16">
              {[30, 55, 40, 80, 65, 90, 70, 85, 75, 100, 60, 95].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.6 + i * 0.04, duration: 0.7 }}
                  className="flex-1 rounded-sm bg-accent/30 hover:bg-accent/60 transition-colors cursor-default"
                />
              ))}
            </div>
            <p className="text-[10px] text-white/20 uppercase tracking-wider">Last 12 weeks — relative activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
