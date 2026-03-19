"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Plus, X, Save } from "lucide-react";

export default function AdminPagesPage() {
  const pages = useQuery(api.pages.listAll) || [];
  const createPage = useMutation(api.pages.create);
  const removePage = useMutation(api.pages.remove);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", slug: "", description: "", content: "",
    published: false, inNavbar: false, order: 0,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createPage({
        ...form,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        description: form.description || undefined,
      });
      setShowForm(false);
      setForm({ title: "", slug: "", description: "", content: "", published: false, inNavbar: false, order: 0 });
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: "title", label: "Title", render: (item: Record<string, unknown>) => <span className="font-medium text-white">{String(item.title)}</span> },
    { key: "slug", label: "Slug", render: (item: Record<string, unknown>) => <span className="text-white/40 font-mono text-xs">/{String(item.slug)}</span> },
    { key: "published", label: "Published", render: (item: Record<string, unknown>) => <StatusBadge status={item.published ? "Published" : "Draft"} /> },
    { key: "inNavbar", label: "In Nav", render: (item: Record<string, unknown>) => <StatusBadge status={item.inNavbar ? "Yes" : "No"} /> },
    { key: "order", label: "Order" },
    {
      key: "actions", label: "",
      render: (item: Record<string, unknown>) => (
        <button onClick={() => { if (confirm("Delete this page?")) removePage({ id: item._id as Id<"pages"> }); }}
          className="text-[10px] font-bold text-red-400/50 hover:text-red-400 uppercase tracking-widest transition-colors">Delete</button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Pages / CMS</h1>
          <p className="text-sm text-white/40 mt-1">{pages.length} pages</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-medium hover:bg-accent-purple transition-colors">
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> New Page</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Page Title" className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none" required />
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="slug" className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white/50 font-mono outline-none" />
          </div>
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description (optional)" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none" />
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Page content (Markdown)" rows={10} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white font-mono outline-none resize-y" required />
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 accent-accent-blue" />
              <span className="text-sm text-white/60">Published</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.inNavbar} onChange={(e) => setForm({ ...form, inNavbar: e.target.checked })} className="w-4 h-4 accent-accent-blue" />
              <span className="text-sm text-white/60">Show in Navbar</span>
            </label>
            <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-20 bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white outline-none" placeholder="Order" />
            <button type="submit" disabled={saving} className="ml-auto flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-blue text-white text-sm font-medium hover:bg-accent-purple transition-colors disabled:opacity-50">
              <Save size={16} /> {saving ? "Creating..." : "Create Page"}
            </button>
          </div>
        </form>
      )}

      <DataTable columns={columns} data={pages as unknown as Record<string, unknown>[]} searchKey="title" emptyMessage="No dynamic pages yet" />
    </div>
  );
}
