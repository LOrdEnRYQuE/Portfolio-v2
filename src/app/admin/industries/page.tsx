"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { 
  Plus, X, Save, Building2, Globe, Layout, 
  Settings, Image as ImageIcon, MessageSquareQuote,
  Layers, Code, ChevronRight, AlertCircle, CheckCircle2,
  Link as LinkIcon, Laptop
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "content" | "seo" | "advanced";

export default function AdminIndustriesPage() {
  const industries = useQuery(api.industries.listAll) || [];
  const services = useQuery(api.services.listAll) || [];
  const upsertIndustry = useMutation(api.industries.upsert);
  const removeIndustry = useMutation(api.industries.remove);
  
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<Id<"industries"> | null>(null);

  const initialForm = {
    title: "",
    slug: "",
    h1: "",
    intro: "",
    content: "",
    coverImage: "",
    imageAlt: "",
    published: false,
    seoTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    ogImage: "",
    isIndexed: true,
    schemaType: "Industry",
    faqItems: "[]",
    relatedServices: [] as Id<"services">[],
  };

  const [form, setForm] = useState(initialForm);

  const handleEdit = (industry: any) => {
    setEditingId(industry._id);
    setForm({
      title: industry.title || "",
      slug: industry.slug || "",
      h1: industry.h1 || "",
      intro: industry.intro || "",
      content: industry.content || "",
      coverImage: industry.coverImage || "",
      imageAlt: industry.imageAlt || "",
      published: industry.published ?? false,
      seoTitle: industry.seoTitle || "",
      metaDescription: industry.metaDescription || "",
      canonicalUrl: industry.canonicalUrl || "",
      ogImage: industry.ogImage || "",
      isIndexed: industry.isIndexed ?? true,
      schemaType: industry.schemaType || "Industry",
      faqItems: industry.faqItems || "[]",
      relatedServices: industry.relatedServices || [],
    });
    setShowForm(true);
    setActiveTab("content");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      await upsertIndustry({
        ...form,
        id: editingId || undefined,
        slug,
      });
      setShowForm(false);
      setEditingId(null);
      setForm(initialForm);
    } finally {
      setSaving(false);
    }
  };

  const toggleService = (serviceId: Id<"services">) => {
    setForm(prev => {
      const exists = prev.relatedServices.includes(serviceId);
      if (exists) {
        return { ...prev, relatedServices: prev.relatedServices.filter(id => id !== serviceId) };
      } else {
        return { ...prev, relatedServices: [...prev.relatedServices, serviceId] };
      }
    });
  };

  const columns = [
    { 
      key: "title", 
      label: "Industry Hub", 
      render: (item: any) => (
        <div className="flex flex-col">
          <span className="font-black text-white uppercase tracking-tight italic">{item.title}</span>
          <span className="text-[10px] text-white/20 font-mono tracking-tighter">/industries/{item.slug}</span>
        </div>
      ) 
    },
    { 
      key: "seo", 
      label: "SEO Presence", 
      render: (item: any) => {
        const hasTitle = !!item.seoTitle;
        const hasDesc = !!item.metaDescription;
        const score = (hasTitle ? 1 : 0) + (hasDesc ? 1 : 0);
        return (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${score === 2 ? "bg-accent-purple shadow-[0_0_8px_rgba(168,85,247,0.5)]" : score === 1 ? "bg-amber-500" : "bg-red-500"}`} />
            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black italic">
              {score === 2 ? "RANK READY" : score === 1 ? "PARTIAL" : "CRITICAL"}
            </span>
          </div>
        );
      }
    },
    { 
      key: "services", 
      label: "Service Mapping", 
      render: (item: any) => (
        <div className="flex items-center gap-1.5 overflow-x-hidden max-w-[150px]">
           {(item.relatedServices || []).length > 0 ? (
             <span className="text-[10px] font-black text-accent-purple bg-accent-purple/10 px-2 py-0.5 rounded-full">
               {(item.relatedServices || []).length} LINKS
             </span>
           ) : (
             <span className="text-[10px] font-bold text-white/10 uppercase italic">Orphaned</span>
           )}
        </div>
      ) 
    },
    { 
      key: "published", 
      label: "Lifecycle", 
      render: (item: any) => <StatusBadge status={item.published ? "Published" : "Draft"} /> 
    },
    {
      key: "actions", 
      label: "",
      render: (item: any) => (
        <div className="flex items-center gap-4 justify-end opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button onClick={() => handleEdit(item)} className="text-[10px] font-black text-accent-purple hover:text-white uppercase tracking-widest transition-colors">Adjust</button>
          <button 
            onClick={() => { if (confirm("Erase industry hub?")) removeIndustry({ id: item._id }); }}
            className="text-[10px] font-black text-red-400/50 hover:text-red-400 uppercase tracking-widest transition-colors"
          >
            Purge
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between bg-white/2 p-10 rounded-4xl border border-white/5 backdrop-blur-3xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-linear-to-br from-accent-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative z-10 flex items-center gap-8">
           <div className="w-20 h-20 rounded-4xl bg-accent-purple/5 border border-accent-purple/20 flex items-center justify-center text-accent-purple shadow-2xl shadow-accent-purple/10 group-hover:scale-110 transition-transform duration-500">
             <Building2 size={40} />
           </div>
           <div>
             <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none italic">Industry <span className="text-accent-purple">Hubs</span></h1>
             <p className="text-[10px] text-white/30 mt-3 font-bold uppercase tracking-[0.3em] flex items-center gap-2 italic">
               <Globe size={12} className="text-accent-purple" /> Vertical-specific optimization engines
             </p>
           </div>
        </div>
        {!showForm && (
          <button onClick={() => { setEditingId(null); setForm(initialForm); setShowForm(true); }}
            className="relative z-10 flex items-center gap-2 px-10 py-4 rounded-2xl bg-white text-black text-sm font-black hover:bg-accent-purple hover:text-white transition-all shadow-2xl shadow-white/5 active:scale-95">
            <Plus size={20} /> CREATE HUB
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-1 border border-white/5 bg-[#0D121B] rounded-4xl shadow-2xl overflow-hidden"
          >
            <form onSubmit={handleSubmit}>
              <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/1">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setActiveTab("content")} 
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === "content" ? "bg-white/10 text-white" : "text-white/30 hover:text-white"}`}>
                    <Layout size={14} /> HUB ARCHITECTURE
                  </button>
                  <button type="button" onClick={() => setActiveTab("seo")} 
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === "seo" ? "bg-white/10 text-white" : "text-white/30 hover:text-white"}`}>
                    <Globe size={14} /> CRAWLER MAPPING
                  </button>
                  <button type="button" onClick={() => setActiveTab("advanced")} 
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === "advanced" ? "bg-white/10 text-white" : "text-white/30 hover:text-white"}`}>
                    <Settings size={14} /> PARAMETERS
                  </button>
                </div>
                <div className="flex items-center gap-4">
                   <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 text-[10px] font-black text-white/20 hover:text-white uppercase tracking-widest transition-colors">
                     Discard
                   </button>
                   <button 
                    type="submit" 
                    disabled={saving}
                    className="flex items-center gap-2 px-10 py-3.5 rounded-2xl bg-white text-black text-xs font-black hover:bg-accent-purple hover:text-white transition-all shadow-xl shadow-white/5 disabled:opacity-50"
                  >
                    <Save size={18} /> {saving ? "PRESERVING..." : editingId ? "COMMIT CHANGES" : "CREATE HUB"}
                  </button>
                </div>
              </div>

              <div className="p-10 space-y-12 max-h-[75vh] overflow-y-auto custom-scrollbar">
                {activeTab === "content" && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-1 italic">Administrative Identity</label>
                        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Internal Label" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm text-white outline-none focus:border-accent-purple/50 transition-all font-black" required />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-1 italic">Public Permalink</label>
                        <div className="relative group">
                          <span className="absolute left-8 top-1/2 -translate-y-1/2 text-white/20 text-xs italic font-mono group-focus-within:text-accent-purple transition-colors">/industries/</span>
                          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="slug-proxy" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-32 pr-8 text-sm text-accent-purple font-mono font-bold outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-1 italic">Semantic H1 Wrapper</label>
                      <input value={form.h1} onChange={(e) => setForm({ ...form, h1: e.target.value })} placeholder="Vertical-specific headline for bots..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-lg font-black text-white outline-none focus:border-accent-purple/50 italic tracking-tight" />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-1 italic">Abstract Teaser</label>
                      <textarea value={form.intro} onChange={(e) => setForm({ ...form, intro: e.target.value })} placeholder="The elevator pitch for this industry node..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm text-white/60 outline-none focus:border-accent-purple/50 transition-all resize-none leading-relaxed" />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-accent-purple uppercase tracking-[0.4em] ml-1 italic flex items-center gap-2"><Code size={12} /> Narrative Synthesis (Markdown)</label>
                      <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Industry-specific insights and value propositions..." rows={15} className="w-full bg-black/40 border border-white/10 rounded-[3rem] py-8 px-10 text-sm text-white/50 font-mono outline-none focus:border-accent-purple/30 transition-all resize-y leading-relaxed" required />
                    </div>

                    <div className="space-y-6 p-10 rounded-[3rem] bg-white/2 border border-white/5 border-dashed">
                       <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2"><Laptop size={12} className="text-accent-purple" /> VERTICAL SOLUTIONS (CROSS-LINKING)</h4>
                       <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {services.map((s) => (
                            <button 
                              key={s._id} 
                              type="button"
                              onClick={() => toggleService(s._id)}
                              className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-1 ${form.relatedServices.includes(s._id) ? "bg-accent-purple/10 border-accent-purple/40 text-white" : "bg-white/2 border-white/10 text-white/20 hover:border-white/20"}`}
                            >
                              <span className="text-[10px] font-black uppercase truncate tracking-widest">{s.title}</span>
                              <div className="flex items-center justify-between">
                                 <span className="text-[8px] font-mono opacity-40 italic">/services/{s.slug}</span>
                                 {form.relatedServices.includes(s._id) && <CheckCircle2 size={10} className="text-accent-purple" />}
                              </div>
                            </button>
                          ))}
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === "seo" && (
                   <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-400 max-w-2xl mx-auto py-6">
                      <div className="bg-purple-500/5 border border-purple-500/10 p-10 rounded-4xl space-y-4 text-center">
                         <div className="w-16 h-16 bg-accent-purple/20 rounded-3xl flex items-center justify-center text-accent-purple mx-auto mb-2 shadow-xl shadow-accent-purple/5">
                            <Globe size={32} />
                         </div>
                         <h4 className="text-sm font-black text-white uppercase tracking-[0.3em]">BOT DISCOVERY OPTIMIZATION</h4>
                         <p className="text-xs text-white/40 leading-relaxed italic">High-intent keyword alignment for industry-specific search traffic.</p>
                      </div>

                      <div className="space-y-8">
                        <div className="space-y-3">
                          <div className="flex justify-between items-end px-1">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">SERP Meta Title Override</label>
                            <span className={`text-[10px] font-mono ${form.seoTitle.length > 60 || form.seoTitle.length < 30 ? "text-amber-500" : "text-emerald-500"}`}>{form.seoTitle.length} / 60</span>
                          </div>
                          <input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} placeholder="Optimized Industry Title" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm text-white font-bold outline-none border-l-4 border-l-accent-purple transition-all" />
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-end px-1">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">SERP Meta Snippet</label>
                            <span className={`text-[10px] font-mono ${form.metaDescription.length > 160 || form.metaDescription.length < 120 ? "text-amber-500" : "text-emerald-500"}`}>{form.metaDescription.length} / 160</span>
                          </div>
                          <textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} placeholder="Compelling preview snippet..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm text-white/70 outline-none focus:border-accent-purple/40 transition-all leading-relaxed" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 rounded-4xl bg-white/2 border border-white/5">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] italic">Hero Asset URL</label>
                            <input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-6 text-[10px] text-white/40 font-mono outline-none" />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-accent-blue uppercase tracking-[0.2em] italic">Alt Tag / OG Label</label>
                            <input value={form.imageAlt} onChange={(e) => setForm({ ...form, imageAlt: e.target.value })} placeholder="Descriptive Alt Text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-6 text-[10px] text-accent-blue/40 font-mono outline-none font-black" />
                         </div>
                      </div>
                   </div>
                )}

                {activeTab === "advanced" && (
                  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-8">
                         <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">Lifecycle Parameters</h4>
                         <div className="space-y-4">
                            <label className="flex items-center justify-between p-8 rounded-4xl bg-white/3 border border-white/5 cursor-pointer hover:bg-white/5 transition-all group">
                               <div className="space-y-1">
                                 <span className="text-sm font-bold text-white group-hover:text-accent-purple transition-colors">Crawl Availability (Index)</span>
                                 <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest font-mono">Permission for search bot mapping</p>
                               </div>
                               <input type="checkbox" checked={form.isIndexed} onChange={(e) => setForm({ ...form, isIndexed: e.target.checked })} className="w-6 h-6 rounded-lg accent-accent-purple shadow-2xl shadow-accent-purple/30 transition-transform active:scale-90" />
                            </label>

                            <label className="flex items-center justify-between p-8 rounded-4xl bg-white/3 border border-white/5 cursor-pointer hover:bg-white/5 transition-all group">
                               <div className="space-y-1">
                                 <span className="text-sm font-bold text-white group-hover:text-emerald-500 transition-colors tracking-tight">Public Presence</span>
                                 <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest font-mono">Global visibility toggle</p>
                               </div>
                               <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-6 h-6 rounded-lg accent-emerald-500 shadow-2xl shadow-emerald-500/30 transition-transform active:scale-90" />
                            </label>
                         </div>
                      </div>

                      <div className="space-y-8">
                         <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">Semantic Sculpting</h4>
                         <div className="space-y-6">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-white/20 uppercase tracking-widest font-mono italic">Entity Identification</label>
                               <select value={form.schemaType} onChange={(e) => setForm({ ...form, schemaType: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-8 text-sm text-white/60 outline-none hover:border-accent-purple/30 transition-colors font-black uppercase italic tracking-widest">
                                  <option value="Industry">Industry Hub</option>
                                  <option value="CollectionPage">Solution Gallery</option>
                                  <option value="Organization">Business Vertical</option>
                               </select>
                            </div>
                            <div className="space-y-3 pt-6 border-t border-white/5">
                               <label className="text-[10px] font-black text-accent-blue uppercase tracking-[0.3em] flex items-center justify-between">
                                  <span>Vertical FAQ Schema (JSON)</span>
                                  <MessageSquareQuote size={14} />
                               </label>
                               <textarea value={form.faqItems} onChange={(e) => setForm({ ...form, faqItems: e.target.value })} placeholder='[ { "q": "..", "a": ".." } ]' rows={6} className="w-full bg-black/40 border border-white/10 rounded-4xl py-6 px-8 text-xs text-accent-blue font-mono font-bold outline-none focus:border-accent-blue/30 transition-all leading-relaxed" />
                               <p className="text-[9px] text-white/20 italic tracking-widest uppercase font-black">Crucial for ranking in 'People Also Ask' search grids.</p>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </motion.div>
        ) : (
          <div className="relative group/table">
            <div className="absolute -inset-1 bg-linear-to-r from-accent-purple/10 to-accent-blue/10 rounded-5xl blur-2xl opacity-0 group-hover/table:opacity-100 transition-opacity duration-1000" />
            <div className="relative overflow-hidden rounded-4xl border border-white/5 bg-[#080B10]/80 backdrop-blur-3xl shadow-2xl">
              <DataTable 
                columns={columns} 
                data={industries as any} 
                searchKey="title" 
                emptyMessage="Industry hubs not yet established. Map your verticals." 
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
