"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Link from "next/link";
import { Plus, Copy, Trash2, FileDown, Send } from "lucide-react";
import { useState } from "react";

export default function AdminContractsPage() {
  const contracts = useQuery(api.contracts.listAll);
  const sendContract = useMutation(api.contracts.send);
  const removeContract = useMutation(api.contracts.remove);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSend = async (id: Id<"contracts">) => {
    const token = await sendContract({ id });
    const url = `${window.location.origin}/sign/${token}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleCopyLink = async (token: string) => {
    const url = `${window.location.origin}/sign/${token}`;
    await navigator.clipboard.writeText(url);
  };

  const handleDownload = (id: string) => {
    window.open(`/admin/contracts/${id}?print=1`, "_blank");
  };

  const columns = [
    {
      key: "title" as const,
      label: "Title",
      render: (row: { _id: string; title: string }) => (
        <Link href={`/admin/contracts/${row._id}`} className="text-accent-blue hover:underline font-medium">
          {row.title}
        </Link>
      ),
    },
    {
      key: "clientName" as const,
      label: "Client",
      render: (row: { clientName?: string; clientEmail?: string }) => (
        <span className="text-white/60">{row.clientName || row.clientEmail || "—"}</span>
      ),
    },
    { key: "language" as const, label: "Lang" },
    {
      key: "status" as const,
      label: "Status",
      render: (row: { status: string }) => <StatusBadge status={row.status} />,
    },
    {
      key: "_id" as const,
      label: "Actions",
      render: (row: { _id: Id<"contracts">; status: string; accessToken?: string }) => (
        <div className="flex items-center gap-2">
          {row.status === "DRAFT" && (
            <button
              onClick={() => handleSend(row._id)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-emerald-400 transition-colors"
              title="Send & copy link"
            >
              <Send size={14} />
            </button>
          )}
          {row.accessToken && (
            <button
              onClick={() => handleCopyLink(row.accessToken!)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-blue-400 transition-colors"
              title="Copy signing link"
            >
              <Copy size={14} />
            </button>
          )}
          <button
            onClick={() => handleDownload(row._id)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 transition-colors"
            title="Download PDF"
          >
            <FileDown size={14} />
          </button>
          <button
            onClick={() => removeContract({ id: row._id })}
            className="p-1.5 rounded-lg hover:bg-white/5 text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
          {copiedId === row._id && (
            <span className="text-[10px] text-emerald-400 animate-pulse">Link copied!</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Contracts</h1>
          <p className="text-sm text-white/40 mt-1">Legal agreements & digital signatures</p>
        </div>
        <Link
          href="/admin/contracts/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-medium hover:bg-accent-blue/80 transition-colors"
        >
          <Plus size={16} /> New Contract
        </Link>
      </div>

      <DataTable
        data={contracts || []}
        columns={columns}
        searchKey="title"
        emptyMessage="No contracts yet. Create your first one."
      />
    </div>
  );
}
