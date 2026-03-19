"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Link from "next/link";
import { Plus, Receipt, DollarSign, Clock, CheckCircle2 } from "lucide-react";

export default function AdminInvoicesPage() {
  const invoices = useQuery(api.invoices.listAll);

  const columns = [
    {
      key: "number",
      label: "Invoice #",
      render: (item: Record<string, unknown>) => (
        <span className="font-mono font-bold text-white">{String(item.number)}</span>
      ),
    },
    {
      key: "user",
      label: "Client",
      render: (item: Record<string, unknown>) => {
        const user = item.user as { name?: string; email?: string } | undefined;
        return (
          <div className="flex flex-col">
            <span className="text-sm text-white/70">{user?.name || "Unknown"}</span>
            <span className="text-[10px] text-white/30 font-mono">{user?.email}</span>
          </div>
        );
      },
    },
    {
      key: "amount",
      label: "Amount",
      render: (item: Record<string, unknown>) => (
        <span className="font-bold text-white">
          {String(item.currency)} {Number(item.amount).toLocaleString()}
        </span>
      ),
    },
    {
      key: "dueDate",
      label: "Due Date",
      render: (item: Record<string, unknown>) => (
        <span className="text-xs text-white/50">{String(item.dueDate)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item: Record<string, unknown>) => <StatusBadge status={String(item.status)} />,
    },
    {
      key: "actions",
      label: "",
      render: (item: Record<string, unknown>) => (
        <Link
          href={`/admin/invoices/${String(item._id)}`}
          className="text-xs font-medium text-accent-blue hover:text-accent-purple transition-colors"
        >
          View / Edit
        </Link>
      ),
    },
  ];

  if (invoices === undefined) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-white/5 rounded animate-pulse" />
        <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const totalRevenue = invoices
    .filter(i => i.status === "PAID")
    .reduce((sum, i) => sum + i.amount, 0);
  const pendingRevenue = invoices
    .filter(i => i.status === "SENT")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Billing & Invoices</h1>
          <p className="text-sm text-white/40 mt-1">Manage client billing and payments</p>
        </div>
        <Link
          href="/admin/invoices/new"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-medium hover:bg-accent-purple transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} /> New Invoice
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl border border-white/5 bg-white/2">
          <div className="flex items-center gap-3 text-emerald-400 mb-2">
            <DollarSign size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Total Paid</span>
          </div>
          <p className="text-3xl font-bold text-white">€{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="p-6 rounded-2xl border border-white/5 bg-emerald-500/5">
          <div className="flex items-center gap-3 text-blue-400 mb-2">
            <Clock size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
          </div>
          <p className="text-3xl font-bold text-white">€{pendingRevenue.toLocaleString()}</p>
        </div>
        <div className="p-6 rounded-2xl border border-white/5 bg-white/2">
          <div className="flex items-center gap-3 text-white/40 mb-2">
            <CheckCircle2 size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Total Count</span>
          </div>
          <p className="text-3xl font-bold text-white">{invoices.length}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white/60">
          <Receipt size={18} />
          <h2 className="text-lg font-bold text-white">All Invoices</h2>
        </div>
        <DataTable
          columns={columns}
          data={invoices || []}
          emptyMessage="No invoices found"
        />
      </div>
    </div>
  );
}
