"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Link from "next/link";
import { FileText } from "lucide-react";

export default function ClientContractsPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const user = useQuery(api.users.getUserByEmail, userEmail ? { email: userEmail } : "skip");
  const contracts = useQuery(
    api.contracts.listByClient,
    user ? { clientId: user._id } : "skip"
  );

  const columns = [
    {
      key: "title" as const,
      label: "Contract",
      render: (row: { _id: string; title: string }) => (
        <Link href={`/client/contracts/${row._id}`} className="text-accent-blue hover:underline font-medium flex items-center gap-2">
          <FileText size={14} />
          {row.title}
        </Link>
      ),
    },
    { key: "language" as const, label: "Language" },
    {
      key: "status" as const,
      label: "Status",
      render: (row: { status: string }) => <StatusBadge status={row.status} />,
    },
    {
      key: "sentAt" as const,
      label: "Received",
      render: (row: { sentAt?: string }) => (
        <span className="text-white/40 text-xs">
          {row.sentAt ? new Date(row.sentAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">My Contracts</h1>
        <p className="text-sm text-white/40 mt-1">Review and sign your agreements</p>
      </div>

      <DataTable
        data={contracts || []}
        columns={columns}
        searchKey="title"
        emptyMessage="No contracts yet."
      />
    </div>
  );
}
