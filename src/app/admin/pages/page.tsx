"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { 
  Plus, X, Save, Globe, Layout, 
  Settings, Image as ImageIcon, MessageSquareQuote,
  Layers, Code, ChevronRight, AlertCircle, CheckCircle2,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "content" | "seo" | "advanced";

export default function AdminPagesPage() {
  const pages = useQuery(api.pages.listAll) || [];
  const createPage = useMutation(api.pages.create);
  const updatePage = useMutation(api.pages.update);
  const removePage = useMutation(api.pages.remove);
  
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<Id<"pages"> | null>(null);

  const initialForm = {
    title: "",
    slug: "",
    description: "",
    content: "",
    published: false,
    inNavbar: false,
    order: 0,
    seoTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    ogImage: "",
    isIndexed: true,
    schemaType: "WebPage",
    faqItems: "[]",
  };

  const [form, setForm] = useState(initialForm);

  const handleEdit = (page: any) => {
    setEditingId(page._id);
    setForm({
      title: page.title || "",
      slug: page.slug || "",
      description: page.description || "",
      content: page.content || "",
      published: page.published ?? false,
      inNavbar: page.inNavbar ?? false,
      order: page.order || 0,
      seoTitle: page.seoTitle || "",
      metaDescription: page.metaDescription || "",
      canonicalUrl: page.canonicalUrl || "",
      ogImage: page.ogImage || "",
      isIndexed: page.isIndexed ?? true,
      schemaType: page.schemaType || "WebPage",
      faqItems: page.faqItems || "[]",
    });
    setShowForm(true);
    setActiveTab("content");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const payload = { ...form, slug };
      
      if (editingId) {
        await updatePage({ id: editingId, ...payload });
      } else {
        await createPage(payload);
      }
      
      setShowForm(false);
      setEditingId(null);
      setForm(initialForm);
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { 
      key: "title", 
      label: "Page Name", 
      render: (item: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-white">{item.title}</span>
          <span className="text-[10px] text-white/30 font-mono ">/{item.slug}</span>
        </div>
      ) 
    },
    { 
      key: "inNavbar", 
      label: "Nav Visibility", 
      render: (item: any) => <StatusBadge status={item.inNavbar ? "Yes" : "No"} /> 
    },
    { 
      key: "published", 
      label: "Status", 
      render: (item: any) => <StatusBadge status={item.published ? "Published" : "Draft"} /> 
    },
    {
      key: "actions", 
      label: "",
      render: (item: any) => (
        <div className="flex items-center gap-3 justify-end opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button onClick={() => handleEdit(item)} className="text-[10px] font-bold text-accent-blue hover:text-white uppercase tracking-widest transition-colors">Edit</button>
          <button 
            onClick={() => { if (confirm("Remove this page?")) removePage({ id: item._id }); }}
            className="text-[10px] font-bold text-red-400/50 hover:text-red-400 uppercase tracking-widest transition-colors"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between bg-white/2 p-8 rounded-3xl border border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue">
            <FileText size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase ">Core <span className="text-accent-blue">Structure</span></h1>
            <p className="text-sm text-white/40 mt-1 font-medium italic">General utility pages like About, Contact, Terms, and custom landing hubs.</p>
          </div>
        </div>
        {!showForm && (
          <button onClick={() => { setEditingId(null); setForm(initialForm); setShowForm(true); }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent-blue text-white text-sm font-bold hover:bg-white hover:text-black transition-all shadow-lg shadow-accent-blue/20">
            <Plus size={18} /> NEW CORE PAGE
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-1 border border-white/5 bg-[#0D121B] rounded-4xl overflow-hidden shadow-2xl shadow-black/50"
          >
            <form onSubmit={handleSubmit}>
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/1">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setActiveTab("content")} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "content" ? "bg-white/10 text-white shadow-inner" : "text-white/40 hover:text-white"}`}>
                    <Layout size={14} /> CONTENT
                  </button>
                  <button type="button" onClick={() => setActiveTab("seo")} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "seo" ? "bg-white/10 text-white shadow-inner" : "text-white/40 hover:text-white"}`}>
                    <Globe size={14} /> SEO
                  </button>
                  <button type="button" onClick={() => setActiveTab("advanced")} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "advanced" ? "bg-white/10 text-white shadow-inner" : "text-white/40 hover:text-white"}`}>
                    <Settings size={14} /> CONFIG
                  </button>
                </div>
                <div className="flex items-center gap-3">
                   <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-xs font-bold text-white/40 hover:text-white transition-colors">
                     DISCARD
                   </button>
                   <button 
                    type="submit" 
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-black hover:bg-white hover:text-black transition-all disabled:opacity-50 shadow-lg shadow-accent-blue/10"
                  >
                    <Save size={16} /> {saving ? "PRESERVING..." : editingId ? "COMMIT" : "DEPLOY"}
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar bg-linear-to-b from-transparent to-black/20">
                {activeTab === "content" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-accent-blue uppercase tracking-[0.2em] ml-1">Page Identity</label>
                        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Page Title" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-accent-blue/40 transition-all font-bold" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Universal Slug</label>
                        <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="e.g. contact-specialist" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white/40 font-mono outline-none focus:border-accent-blue/40 transition-all italic" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Internal Description / Notes</label>
                      <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What is the purpose of this page?" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white/60 outline-none focus:border-accent-blue/40 transition-all" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-accent-blue uppercase tracking-[0.2em] ml-1">Page Markup (Markdown)</label>
                      <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="# Your structure begins here..." rows={15} className="w-full bg-[#05070A] border border-white/10 rounded-3xl py-6 px-8 text-sm text-white font-mono outline-none focus:border-accent-blue/40 transition-all resize-y leading-relaxed shadow-inner" required />
                    </div>
                  </div>
                )}

                {activeTab === "seo" && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-2xl mx-auto">
                    <div className="p-6 rounded-3xl bg-accent-blue/5 border border-accent-blue/10 flex gap-4">
                       <Globe size={20} className="text-accent-blue shrink-0" />
                       <p className="text-xs text-white/60 leading-relaxed font-medium">This metadata will override the global default settings defined in the site configuration.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-end px-1">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">SERP TITLE</label>
                          <span className={`text-[10px] font-mono ${form.seoTitle.length > 60 ? "text-red-400" : "text-white/20"}`}>{form.seoTitle.length} / 60</span>
                        </div>
                        <input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} placeholder="Override Title for Search" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-accent-blue/40 transition-all font-bold" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-end px-1">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">META DESCRIPTION</label>
                          <span className={`text-[10px] font-mono ${form.metaDescription.length > 160 ? "text-red-400" : "text-white/20"}`}>{form.metaDescription.length} / 160</span>
                        </div>
                        <textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} placeholder="Compelling search snippet..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white/70 outline-none focus:border-accent-blue/40 transition-all leading-relaxed" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Canonical</label>
                            <input value={form.canonicalUrl} onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-[10px] text-white/40 outline-none font-mono" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Social Image</label>
                            <input value={form.ogImage} onChange={(e) => setForm({ ...form, ogImage: e.target.value })} placeholder="/og/custom.png" className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-[10px] text-white/40 outline-none font-mono" />
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "advanced" && (
                   <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em]">Navigation & Visibility</h4>
                          <div className="space-y-3">
                             <label className="flex items-center justify-between p-5 rounded-3xl bg-white/3 border border-white/5 cursor-pointer hover:bg-white/5 transition-all group">
                               <div className="space-y-0.5">
                                 <span className="text-sm font-bold text-white group-hover:text-accent-blue transition-colors">Visible in Sidebar</span>
                                 <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold font-mono">Adds to navbar</p>
                               </div>
                               <input type="checkbox" checked={form.inNavbar} onChange={(e) => setForm({ ...form, inNavbar: e.target.checked })} className="w-5 h-5 accent-accent-blue" />
                             </label>

                             <label className="flex items-center justify-between p-5 rounded-3xl bg-white/3 border border-white/5 cursor-pointer hover:bg-white/5 transition-all group">
                               <div className="space-y-0.5">
                                 <span className="text-sm font-bold text-white group-hover:text-green-400 transition-colors">Production Sync</span>
                                 <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold font-mono">Published to production</p>
                               </div>
                               <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-5 h-5 accent-green-500" />
                             </label>

                             <label className="flex items-center justify-between p-5 rounded-3xl bg-white/3 border border-white/5 cursor-pointer hover:bg-white/5 transition-all group">
                               <div className="space-y-0.5">
                                 <span className="text-sm font-bold text-white group-hover:text-accent-purple transition-colors">Crawler Indexing</span>
                                 <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold font-mono">Allow Google bots</p>
                               </div>
                               <input type="checkbox" checked={form.isIndexed} onChange={(e) => setForm({ ...form, isIndexed: e.target.checked })} className="w-5 h-5 accent-accent-purple" />
                             </label>
                          </div>
                       </div>

                       <div className="space-y-6">
                           <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em]">Architecture</h4>
                           <div className="space-y-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Sort Priority</label>
                                 <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-full bg-white/2 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none font-bold" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">JSON-LD Schema</label>
                                 <select value={form.schemaType} onChange={(e) => setForm({ ...form, schemaType: e.target.value })} className="w-full bg-white/2 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white/50 outline-none">
                                    <option value="WebPage">WebPage</option>
                                    <option value="AboutPage">AboutPage</option>
                                    <option value="ContactPage">ContactPage</option>
                                    <option value="FAQPage">FAQPage</option>
                                 </select>
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
          <div className="relative overflow-hidden rounded-4xl border border-white/5 bg-[#080B10]/60 backdrop-blur-xl">
             <DataTable columns={columns} data={pages as any} searchKey="title" emptyMessage="No core pages defined yet." />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
