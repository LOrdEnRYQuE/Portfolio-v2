"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { 
  Plus, X, Save, Search, Globe, Layout, 
  Settings, Image as ImageIcon, MessageSquareQuote,
  Layers, Code, ChevronRight, AlertCircle, CheckCircle2,
  Link as LinkIcon, Briefcase, Laptop
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "content" | "seo" | "advanced";

export default function AdminServicesPage() {
  const services = useQuery(api.services.listAll) || [];
  const projects = useQuery(api.portfolio.listAll) || [];
  const upsertService = useMutation(api.services.upsert);
  const removeService = useMutation(api.services.remove);
  
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<Id<"services"> | null>(null);

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
    schemaType: "Service",
    faqItems: "[]",
    relatedProjects: [] as Id<"portfolioProjects">[],
  };

  const [form, setForm] = useState(initialForm);

  const handleEdit = (service: any) => {
    setEditingId(service._id);
    setForm({
      title: service.title || "",
      slug: service.slug || "",
      h1: service.h1 || "",
      intro: service.intro || "",
      content: service.content || "",
      coverImage: service.coverImage || "",
      imageAlt: service.imageAlt || "",
      published: service.published ?? false,
      seoTitle: service.seoTitle || "",
      metaDescription: service.metaDescription || "",
      canonicalUrl: service.canonicalUrl || "",
      ogImage: service.ogImage || "",
      isIndexed: service.isIndexed ?? true,
      schemaType: service.schemaType || "Service",
      faqItems: service.faqItems || "[]",
      relatedProjects: service.relatedProjects || [],
    });
    setShowForm(true);
    setActiveTab("content");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      await upsertService({
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

  const toggleProject = (projectId: Id<"portfolioProjects">) => {
    setForm(prev => {
      const exists = prev.relatedProjects.includes(projectId);
      if (exists) {
        return { ...prev, relatedProjects: prev.relatedProjects.filter(id => id !== projectId) };
      } else {
        return { ...prev, relatedProjects: [...prev.relatedProjects, projectId] };
      }
    });
  };

  const columns = [
    { 
      key: "title", 
      label: "Service Entity", 
      render: (item: any) => (
        <div className="flex flex-col">
          <span className="font-black text-white uppercase tracking-tight italic">{item.title}</span>
          <span className="text-[10px] text-white/20 font-mono tracking-tighter">/services/{item.slug}</span>
        </div>
      ) 
    },
    { 
      key: "seo", 
      label: "SEO Health", 
      render: (item: any) => {
        const hasTitle = !!item.seoTitle;
        const hasDesc = !!item.metaDescription;
        const score = (hasTitle ? 1 : 0) + (hasDesc ? 1 : 0);
        return (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${score === 2 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : score === 1 ? "bg-amber-500" : "bg-red-500"}`} />
            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black italic">
              {score === 2 ? "OPTIMIZED" : score === 1 ? "PARTIAL" : "CRITICAL"}
            </span>
          </div>
        );
      }
    },
    { 
      key: "indexing", 
      label: "Crawl Data", 
      render: (item: any) => (
        <div className="flex items-center gap-3">
           <StatusBadge status={item.isIndexed === false ? "No-Index" : "Indexed"} />
           {item.faqItems && item.faqItems !== "[]" && <MessageSquareQuote size={12} className="text-accent-blue opacity-50" />}
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
          <button onClick={() => handleEdit(item)} className="text-[10px] font-black text-accent-blue hover:text-white uppercase tracking-widest transition-colors">Config</button>
          <button 
            onClick={() => { if (confirm("Erase service footprint?")) removeService({ id: item._id }); }}
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
        <div className="absolute inset-0 bg-linear-to-br from-accent-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative z-10 flex items-center gap-8">
           <div className="w-20 h-20 rounded-4xl bg-accent-blue/5 border border-accent-blue/20 flex items-center justify-center text-accent-blue shadow-2xl shadow-accent-blue/10 group-hover:scale-110 transition-transform duration-500">
             <Laptop size={40} />
           </div>
           <div>
             <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none italic">Service <span className="text-accent-blue">Control</span></h1>
             <p className="text-[10px] text-white/30 mt-3 font-bold uppercase tracking-[0.3em] flex items-center gap-2 italic">
               <Globe size={12} className="text-accent-blue" /> High-impact organic landing page management
             </p>
           </div>
        </div>
        {!showForm && (
          <button onClick={() => { setEditingId(null); setForm(initialForm); setShowForm(true); }}
            className="relative z-10 flex items-center gap-2 px-10 py-4 rounded-2xl bg-white text-black text-sm font-black hover:bg-accent-blue hover:text-white transition-all shadow-2xl shadow-white/5 active:scale-95">
            <Plus size={20} /> DEPLOY SERVICE
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
                    <Layout size={14} /> CONTENT ARCHITECTURE
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
                    className="flex items-center gap-2 px-10 py-3.5 rounded-2xl bg-white text-black text-xs font-black hover:bg-emerald-500 hover:text-white transition-all shadow-xl shadow-white/5 disabled:opacity-50"
                  >
                    <Save size={18} /> {saving ? "PRESERVING..." : editingId ? "COMMIT CHANGES" : "DEPLOY ENTITY"}
                  </button>
                </div>
              </div>

              <div className="p-10 space-y-12 max-h-[75vh] overflow-y-auto custom-scrollbar">
                {activeTab === "content" && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-1 italic">Administrative Identity</label>
                        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Internal Label" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm text-white outline-none focus:border-accent-blue/50 transition-all font-black" required />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-1 italic">Public Permalink</label>
                        <div className="relative group">
                          <span className="absolute left-8 top-1/2 -translate-y-1/2 text-white/20 text-xs italic font-mono group-focus-within:text-accent-blue transition-colors">/services/</span>
                          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="slug-proxy" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-28 pr-8 text-sm text-accent-blue font-mono outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] ml-1 italic">Semantic H1 Wrapper</label>
                      <input value={form.h1} onChange={(e) => setForm({ ...form, h1: e.target.value })} placeholder="Main on-page headline for crawlers..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-lg font-black text-white outline-none focus:border-accent-blue/50 italic tracking-tight" />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1 italic">Abstract Teaser</label>
                      <textarea value={form.intro} onChange={(e) => setForm({ ...form, intro: e.target.value })} placeholder="The elevator pitch for this service..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm text-white/60 outline-none focus:border-accent-blue/50 transition-all resize-none leading-relaxed" />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-accent-blue uppercase ml-1 italic flex items-center gap-2 tracking-widest"><Code size={12} /> Technical Narrative (Markdown)</label>
                      <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Draft the high-value content here..." rows={15} className="w-full bg-black/40 border border-white/10 rounded-[3rem] py-8 px-10 text-sm text-white/50 font-mono outline-none focus:border-accent-blue/30 transition-all resize-y leading-relaxed" required />
                    </div>

                    <div className="space-y-6 p-10 rounded-[3rem] bg-white/2 border border-white/5 border-dashed">
                       <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2"><Briefcase size={12} className="text-accent-blue" /> INTERNAL ECOSYSTEM (CROSS-LINKING)</h4>
                       <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {projects.map((p) => (
                            <button 
                              key={p._id} 
                              type="button"
                              onClick={() => toggleProject(p._id)}
                              className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-1 ${form.relatedProjects.includes(p._id) ? "bg-accent-blue/10 border-accent-blue/40 text-white" : "bg-white/2 border-white/10 text-white/20 hover:border-white/20"}`}
                            >
                              <span className="text-[10px] font-black uppercase tracking-tight truncate">{p.title}</span>
                              <div className="flex items-center justify-between">
                                 <span className="text-[8px] font-mono opacity-40 italic">/projects/{p.slug}</span>
                                 {form.relatedProjects.includes(p._id) && <CheckCircle2 size={10} className="text-accent-blue" />}
                              </div>
                            </button>
                          ))}
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === "seo" && (
                   <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-400 max-w-2xl mx-auto py-6">
                      <div className="bg-blue-500/5 border border-blue-500/10 p-10 rounded-4xl space-y-4 text-center">
                         <div className="w-16 h-16 bg-accent-blue/20 rounded-3xl flex items-center justify-center text-accent-blue mx-auto mb-2 shadow-xl shadow-accent-blue/5">
                            <Globe size={32} />
                         </div>
                         <h4 className="text-sm font-black text-white uppercase tracking-[0.3em]">SERP MAXIMIZATION</h4>
                         <p className="text-xs text-white/40 leading-relaxed italic">Strategic metadata injection for organic keyword dominance.</p>
                      </div>

                      <div className="space-y-8">
                        <div className="space-y-3">
                          <div className="flex justify-between items-end px-1">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Title Tag Override</label>
                            <span className={`text-[10px] font-mono ${form.seoTitle.length > 60 || form.seoTitle.length < 30 ? "text-amber-500" : "text-emerald-500"}`}>{form.seoTitle.length} / 60</span>
                          </div>
                          <input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} placeholder="Optimized Search Title" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm text-white font-bold outline-none border-l-4 border-l-accent-blue transition-all" />
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-end px-1">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Meta Snippet (SERP Desc)</label>
                            <span className={`text-[10px] font-mono ${form.metaDescription.length > 160 || form.metaDescription.length < 120 ? "text-amber-500" : "text-emerald-500"}`}>{form.metaDescription.length} / 160</span>
                          </div>
                          <textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} placeholder="Compelling snippet for search engine users..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm text-white/70 outline-none focus:border-accent-blue/40 transition-all leading-relaxed" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 rounded-4xl bg-white/2 border border-white/5">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] italic">Cover Asset URL</label>
                            <input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-6 text-[10px] text-white/40 font-mono outline-none" />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-accent-purple uppercase tracking-[0.2em] italic">OpenGraph Overload</label>
                            <input value={form.ogImage} onChange={(e) => setForm({ ...form, ogImage: e.target.value })} placeholder="OG Image Override" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-6 text-[10px] text-accent-purple/40 font-mono outline-none" />
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
                                 <span className="text-sm font-bold text-white group-hover:text-accent-blue transition-colors">Crawl Visibility (Index)</span>
                                 <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest font-mono">Allow search engines to map this page</p>
                               </div>
                               <input type="checkbox" checked={form.isIndexed} onChange={(e) => setForm({ ...form, isIndexed: e.target.checked })} className="w-6 h-6 rounded-lg accent-accent-blue shadow-2xl shadow-accent-blue/30 transition-transform active:scale-90" />
                            </label>

                            <label className="flex items-center justify-between p-8 rounded-4xl bg-white/3 border border-white/5 cursor-pointer hover:bg-white/5 transition-all group">
                               <div className="space-y-1">
                                 <span className="text-sm font-bold text-white group-hover:text-emerald-500 transition-colors tracking-tight">Public Availability</span>
                                 <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest font-mono">Toggle global visibility status</p>
                               </div>
                               <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-6 h-6 rounded-lg accent-emerald-500 shadow-2xl shadow-emerald-500/30 transition-transform active:scale-90" />
                            </label>
                         </div>
                      </div>

                      <div className="space-y-8">
                         <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-1">Semantic Architect (Schema)</h4>
                         <div className="space-y-6">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-white/20 uppercase tracking-widest font-mono italic">Entity Identification</label>
                               <select value={form.schemaType} onChange={(e) => setForm({ ...form, schemaType: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-8 text-sm text-white/60 outline-none hover:border-accent-blue/30 transition-colors">
                                  <option value="Service">Service (Generic)</option>
                                  <option value="ProfessionalService">Professional Agency Service</option>
                                  <option value="TechArticle">Solution Breakdown</option>
                               </select>
                            </div>
                             <div className="space-y-2">
                                  <label className="text-[10px] font-black text-accent-purple uppercase tracking-widest flex items-center justify-between">
                                     <span>FAQ Structured Data (JSON)</span>
                                     <MessageSquareQuote size={14} />
                                  </label>
                                  <textarea value={form.faqItems} onChange={(e) => setForm({ ...form, faqItems: e.target.value })} placeholder='[ { "q": "Why us?", "a": "Because we scale." } ]' rows={6} className="w-full bg-black/40 border border-white/10 rounded-4xl py-6 px-8 text-xs text-accent-purple font-mono outline-none focus:border-accent-purple/30 transition-all leading-relaxed" />
                                  <p className="text-[9px] text-white/20 italic tracking-widest uppercase font-black">Valid JSON required for rich snippet induction.</p>
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
            <div className="absolute -inset-1 bg-linear-to-r from-accent-blue/10 to-accent-purple/10 rounded-5xl blur-2xl opacity-0 group-hover/table:opacity-100 transition-opacity duration-1000" />
            <div className="relative overflow-hidden rounded-4xl border border-white/5 bg-[#080B10]/80 backdrop-blur-3xl shadow-2xl">
              <DataTable 
                columns={columns} 
                data={services as any} 
                searchKey="title" 
                emptyMessage="Service registry is vacant. Deploy high-value entities." 
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
