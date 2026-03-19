"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import StatCard from "@/components/dashboard/StatCard";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Users, MessageSquare, FolderKanban, DollarSign, Receipt } from "lucide-react";

export default function AdminDashboard() {
  const stats = useQuery(api.dashboardStats.getStats);

  if (!stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const leadColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "concept", label: "Concept" },
    {
      key: "status",
      label: "Status",
      render: (item: Record<string, unknown>) => <StatusBadge status={String(item.status)} />,
    },
  ];

  const invoiceColumns = [
    { key: "number", label: "Invoice #" },
    { key: "amount", label: "Amount", render: (item: Record<string, unknown>) => `€${Number(item.amount).toLocaleString()}` },
    {
      key: "status",
      label: "Status",
      render: (item: Record<string, unknown>) => <StatusBadge status={String(item.status)} />,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-white/40 mt-1">Your platform at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="blue" />
        <StatCard label="Revenue" value={`€${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} color="cyan" trend="Paid" />
        <StatCard label="Invoices" value={stats.totalInvoices} icon={Receipt} color="purple" trend="Transactions" />
        <StatCard label="Active Projects" value={stats.activeProjects} icon={FolderKanban} color="green" trend={`${stats.totalProjects} total`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4 p-6 rounded-2xl border border-white/5 bg-white/2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare size={18} className="text-amber-400" /> Recent Leads
          </h2>
          <DataTable columns={leadColumns} data={stats.recentLeads as unknown as Record<string, unknown>[]} emptyMessage="No leads yet" />
        </div>
        <div className="space-y-4 p-6 rounded-2xl border border-white/5 bg-white/2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Receipt size={18} className="text-blue-400" /> Recent Invoices
          </h2>
          <DataTable columns={invoiceColumns} data={stats.recentInvoices as unknown as Record<string, unknown>[]} emptyMessage="No invoices yet" />
        </div>
      </div>
    </div>
  );
}
