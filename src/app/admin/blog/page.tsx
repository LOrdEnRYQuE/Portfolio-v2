"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Link from "next/link";
import { Plus, FileText, Search, ExternalLink } from "lucide-react";

export default function AdminBlogPage() {
  const posts = useQuery(api.posts.listAll) || [];
  const updatePost = useMutation(api.posts.update);
  const removePost = useMutation(api.posts.remove);

  const handleTogglePublished = async (id: Id<"posts">, published: boolean) => {
    await updatePost({ id, published: !published });
  };

  const columns = [
    { 
      key: "title", 
      label: "Article", 
      render: (item: any) => (
        <div className="flex flex-col">
          <Link href={`/admin/blog/${item._id}/edit`} className="font-bold text-white hover:text-accent-blue transition-colors tracking-tight">
            {item.title}
          </Link>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-white/20 font-mono tracking-tighter">/blog/{item.slug}</span>
            {item.isIndexed && <span className="text-[8px] px-1 border border-emerald-500/30 text-emerald-500/60 rounded font-black tracking-widest bg-emerald-500/5">INDEXED</span>}
          </div>
        </div>
      ) 
    },
    { 
      key: "published", 
      label: "Visibility", 
      render: (item: any) => (
        <button onClick={() => handleTogglePublished(item._id, item.published)} className="hover:opacity-80 transition-opacity">
          <StatusBadge status={item.published ? "Published" : "Draft"} />
        </button>
      ) 
    },
    {
      key: "actions", 
      label: "",
      render: (item: any) => (
        <div className="flex items-center gap-4 justify-end opacity-0 group-hover/row:opacity-100 transition-opacity">
          <Link href={`/admin/blog/${item._id}/edit`} className="text-[10px] font-black text-accent-blue hover:text-white uppercase tracking-widest transition-colors">
            Edit
          </Link>
          <button 
            onClick={() => { if (confirm("Remove article from database?")) removePost({ id: item._id }); }}
            className="text-[10px] font-black text-red-400/50 hover:text-red-400 uppercase tracking-widest transition-colors"
          >
            Trash
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between bg-white/2 p-8 rounded-3xl border border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple shadow-lg shadow-accent-purple/10">
            <FileText size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Editorial <span className="text-accent-purple font-bold">Engine</span></h1>
            <p className="text-sm text-white/40 mt-1 font-medium italic">Craft high-ranking technical content and manage your blog's search footprint.</p>
          </div>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent-purple text-white text-sm font-bold hover:bg-white hover:text-black transition-all shadow-lg shadow-accent-purple/20"
        >
          <Plus size={18} /> NEW ARTICLE
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-4xl border border-white/5 bg-[#080B10]/80 backdrop-blur-2xl">
        <DataTable
          columns={columns}
          data={posts as any}
          searchKey="title"
          emptyMessage="Chronicles are empty. Start writing the story."
        />
      </div>
    </div>
  );
}
