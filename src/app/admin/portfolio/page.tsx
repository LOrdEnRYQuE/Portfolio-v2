"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Plus, X, Save } from "lucide-react";

export default function AdminPortfolioPage() {
  const projects = useQuery(api.portfolio.listAll) || [];
  const createProject = useMutation(api.portfolio.create);
  const removeProject = useMutation(api.portfolio.remove);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", slug: "", summary: "", description: "", status: "ACTIVE",
    stack: "", cover: "/images/projects/default.jpg", featured: false,
    liveUrl: "", githubUrl: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createProject({
        ...form,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        stack: JSON.stringify(form.stack.split(",").map((s) => s.trim()).filter(Boolean)),
        liveUrl: form.liveUrl || undefined,
        githubUrl: form.githubUrl || undefined,
      });
      setShowForm(false);
      setForm({ title: "", slug: "", summary: "", description: "", status: "ACTIVE", stack: "", cover: "/images/projects/default.jpg", featured: false, liveUrl: "", githubUrl: "" });
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: "title", label: "Title", render: (item: Record<string, unknown>) => (
      <span className="font-medium text-white">{String(item.title)}</span>
    )},
    { key: "slug", label: "Slug", render: (item: Record<string, unknown>) => (
      <span className="text-white/40 font-mono text-xs">/{String(item.slug)}</span>
    )},
    { key: "status", label: "Status", render: (item: Record<string, unknown>) => <StatusBadge status={String(item.status)} /> },
    { key: "featured", label: "Featured", render: (item: Record<string, unknown>) => <StatusBadge status={item.featured ? "Yes" : "No"} /> },
    {
      key: "actions", label: "",
      render: (item: Record<string, unknown>) => (
        <button onClick={() => { if (confirm("Delete?")) removeProject({ id: item._id as Id<"portfolioProjects"> }); }}
          className="text-[10px] font-bold text-red-400/50 hover:text-red-400 uppercase tracking-widest transition-colors">Delete</button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Portfolio Manager</h1>
          <p className="text-sm text-white/40 mt-1">{projects.length} projects</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-medium hover:bg-accent-purple transition-colors">
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> New Project</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project Title" className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none" required />
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="slug (auto-generated)" className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white/50 font-mono outline-none" />
          </div>
          <input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Short summary" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none" required />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Full description" rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none resize-y" required />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input value={form.stack} onChange={(e) => setForm({ ...form, stack: e.target.value })} placeholder="Stack (comma-separated)" className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none" />
            <input value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} placeholder="Live URL" className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none" />
            <input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="GitHub URL" className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none" />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-accent-blue" />
              <span className="text-sm text-white/60">Featured</span>
            </label>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-blue text-white text-sm font-medium hover:bg-accent-purple transition-colors disabled:opacity-50">
              <Save size={16} /> {saving ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      )}

      <DataTable columns={columns} data={projects as unknown as Record<string, unknown>[]} searchKey="title" emptyMessage="No portfolio projects yet" />
    </div>
  );
}
