"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Link from "next/link";

export default function ClientInvoicesPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const user = useQuery(api.users.getUserByEmail, userEmail ? { email: userEmail } : "skip");
  const invoices = useQuery(api.invoices.listByUser, user ? { userId: user._id } : "skip");

  const columns = [
    { key: "number", label: "Invoice #", render: (item: Record<string, unknown>) => (
      <span className="font-mono font-bold text-white">{String(item.number)}</span>
    )},
    { key: "description", label: "Description", render: (item: Record<string, unknown>) => (
      <span className="text-white/60">{String(item.description || "—")}</span>
    )},
    { key: "amount", label: "Amount", render: (item: Record<string, unknown>) => (
      <span className="font-bold text-white">€{Number(item.amount).toLocaleString()}</span>
    )},
    { key: "dueDate", label: "Due Date", render: (item: Record<string, unknown>) => (
      <span className="text-white/50 text-xs">{String(item.dueDate)}</span>
    )},
    { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={String(item.status)} /> },
    { key: "actions", label: "", render: (item: Record<string, unknown>) => (
      <Link 
        href={`/client/invoices/${item._id}`}
        className="text-xs font-medium text-accent-blue hover:text-accent-purple transition-colors"
      >
        View / Print
      </Link>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Invoices</h1>
        <p className="text-sm text-white/40 mt-1">Your billing history</p>
      </div>

      <DataTable
        columns={columns}
        data={(invoices || []) as unknown as Record<string, unknown>[]}
        emptyMessage="No invoices yet"
      />
    </div>
  );
}
