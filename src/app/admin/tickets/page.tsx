"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Link from "next/link";
import { Ticket, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminTicketsPage() {
  const tickets = useQuery(api.tickets.listAll);

  const columns = [
    {
      key: "subject",
      label: "Subject",
      render: (item: Record<string, unknown>) => (
        <div className="flex flex-col">
          <span className="font-medium text-white">{String(item.subject)}</span>
          <span className="text-xs text-white/40 line-clamp-1">{String(item.message)}</span>
        </div>
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
      key: "priority",
      label: "Priority",
      render: (item: Record<string, unknown>) => <StatusBadge status={String(item.priority)} />,
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
          href={`/admin/tickets/${String(item._id)}`}
          className="text-xs font-medium text-accent-blue hover:text-accent-purple transition-colors"
        >
          View & Reply
        </Link>
      ),
    },
  ];

  if (tickets === undefined) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-white/5 rounded animate-pulse" />
        <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const openCount = tickets.filter(t => t.status === "OPEN").length;
  const inProgressCount = tickets.filter(t => t.status === "IN_PROGRESS").length;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Support Management</h1>
          <p className="text-sm text-white/40 mt-1">Manage client inquiries and support requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl border border-white/5 bg-white/2">
          <div className="flex items-center gap-3 text-amber-400 mb-2">
            <Clock size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Open</span>
          </div>
          <p className="text-3xl font-bold text-white">{openCount}</p>
        </div>
        <div className="p-6 rounded-2xl border border-white/5 bg-white/2">
          <div className="flex items-center gap-3 text-blue-400 mb-2">
            <AlertCircle size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">In Progress</span>
          </div>
          <p className="text-3xl font-bold text-white">{inProgressCount}</p>
        </div>
        <div className="p-6 rounded-2xl border border-white/5 bg-white/2">
          <div className="flex items-center gap-3 text-emerald-400 mb-2">
            <CheckCircle2 size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Resolved</span>
          </div>
          <p className="text-3xl font-bold text-white">{tickets.length - openCount - inProgressCount}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white/60">
          <Ticket size={18} />
          <h2 className="text-lg font-bold text-white">All Tickets</h2>
        </div>
        <DataTable
          columns={columns}
          data={tickets as unknown as Record<string, unknown>[]}
          emptyMessage="No tickets found"
        />
      </div>
    </div>
  );
}
