"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { 
  ArrowRightLeft, Plus, X, Save, Search, 
  Trash2, AlertCircle, RefreshCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminRedirectsPage() {
  const redirects = useQuery(api.redirects.listAll) || [];
  const upsertRedirect = useMutation(api.redirects.upsert);
  const removeRedirect = useMutation(api.redirects.remove);
  
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<Id<"redirects"> | null>(null);

  const initialForm = {
    source: "",
    destination: "",
    permanent: true,
  };

  const [form, setForm] = useState(initialForm);

  const handleEdit = (redir: any) => {
    setEditingId(redir._id);
    setForm({
      source: redir.source || "",
      destination: redir.destination || "",
      permanent: redir.permanent ?? true,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await upsertRedirect({
        ...form,
        id: editingId || undefined,
      });
      setShowForm(false);
      setEditingId(null);
      setForm(initialForm);
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { 
      key: "source", 
      label: "Origin Path", 
      render: (item: any) => <span className="text-sm font-mono text-white/60">{item.source}</span> 
    },
    { 
      key: "arrow", 
      label: "", 
      render: () => <ChevronRight size={14} className="text-white/20" /> 
    },
    { 
      key: "destination", 
      label: "Target Path", 
      render: (item: any) => <span className="text-sm font-mono text-accent-blue">{item.destination}</span> 
    },
    { 
      key: "type", 
      label: "HTTP Code", 
      render: (item: any) => (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.permanent ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>
          {item.permanent ? "301 Permanent" : "302 Temporary"}
        </span>
      ) 
    },
    {
      key: "actions", 
      label: "",
      render: (item: any) => (
        <div className="flex items-center gap-3 justify-end opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button onClick={() => handleEdit(item)} className="text-[10px] font-black text-white/40 hover:text-white uppercase transition-colors">Edit</button>
          <button onClick={() => { if (confirm("Delete this redirect? This might break old links!")) removeRedirect({ id: item._id }); }}
            className="text-[10px] font-black text-red-400/50 hover:text-red-400 uppercase transition-colors">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-end justify-between bg-white/2 p-8 rounded-3xl border border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue">
            <ArrowRightLeft size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Link <span className="text-accent-blue">Redirects</span></h1>
            <p className="text-sm text-white/40 mt-1 font-medium italic">Manage 301/302 redirects to preserve SEO juice & prevent 404s.</p>
          </div>
        </div>
        {!showForm && (
          <button onClick={() => { setEditingId(null); setForm(initialForm); setShowForm(true); }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent-blue text-white text-sm font-bold hover:bg-white hover:text-black transition-all">
            <Plus size={18} /> NEW REDIRECT
          </button>
        )}
      </div>

       <AnimatePresence mode="wait">
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-8 border border-white/5 bg-white/2 rounded-3xl space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">SOURCE PATH (ORIGIN)</label>
                  <input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="/old-service-page" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white font-mono outline-none focus:border-accent-blue/50 transition-colors" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">DESTINATION PATH (TARGET)</label>
                  <input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="/services/new-service-hub" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white font-mono outline-none focus:border-accent-blue/50 transition-colors" required />
                </div>
              </div>

              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-10 h-6 rounded-full p-1 transition-colors ${form.permanent ? "bg-green-500" : "bg-white/10"}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${form.permanent ? "translate-x-4" : "translate-x-0"}`} />
                      </div>
                      <input type="checkbox" checked={form.permanent} onChange={(e) => setForm({ ...form, permanent: e.target.checked })} className="hidden" />
                      <div className="space-y-0.5">
                        <span className="text-sm font-bold text-white">Permanent Redirect (301)</span>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Recommended for moved content</p>
                      </div>
                    </label>
                 </div>
                 <div className="flex items-center gap-3">
                   <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl text-xs font-black text-white/40 hover:text-white transition-colors">CANCEL</button>
                   <button 
                    type="submit" 
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-black text-sm font-black hover:bg-accent-blue hover:text-white transition-all disabled:opacity-50"
                  >
                    <RefreshCcw size={16} className={saving ? "animate-spin" : ""} /> {saving ? "PRESERVATIVE SYNC..." : "DEPLOY REDIRECT"}
                  </button>
                 </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-8 border border-white/5 bg-black/40 rounded-4xl">
        <DataTable columns={columns} data={redirects as any} searchKey="source" emptyMessage="No active redirects yet." />
      </div>
    </div>
  );
}

function ChevronRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
