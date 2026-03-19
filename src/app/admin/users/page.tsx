"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";

export default function AdminUsersPage() {
  const users = useQuery(api.users.listUsers) || [];
  const updateUser = useMutation(api.users.updateUser);
  const removeUser = useMutation(api.users.remove);

  const handleRoleChange = async (id: Id<"users">, role: string) => {
    await updateUser({ id, role });
  };

  const handleDelete = async (id: Id<"users">) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await removeUser({ id });
    }
  };

  const columns = [
    { key: "name", label: "Name", render: (item: Record<string, unknown>) => (
      <span className="font-medium text-white">{String(item.name || "—")}</span>
    )},
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (item: Record<string, unknown>) => (
        <select
          value={String(item.role)}
          onChange={(e) => handleRoleChange(item._id as Id<"users">, e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none cursor-pointer"
        >
          <option value="USER">USER</option>
          <option value="CLIENT">CLIENT</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (item: Record<string, unknown>) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleDelete(item._id as Id<"users">); }}
          className="text-[10px] font-bold text-red-400/50 hover:text-red-400 uppercase tracking-widest transition-colors"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
        <p className="text-sm text-white/40 mt-1">{users.length} registered users</p>
      </div>

      <div className="flex gap-3 mb-2">
        {["ALL", "ADMIN", "CLIENT", "USER"].map((r) => {
          const count = r === "ALL" ? users.length : users.filter((u) => u.role === r).length;
          return (
            <span key={r} className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <StatusBadge status={r === "ALL" ? `All (${count})` : r} /> {r !== "ALL" && `(${count})`}
            </span>
          );
        })}
      </div>

      <DataTable
        columns={columns}
        data={users as unknown as Record<string, unknown>[]}
        searchKey="email"
        emptyMessage="No users found"
      />
    </div>
  );
}
