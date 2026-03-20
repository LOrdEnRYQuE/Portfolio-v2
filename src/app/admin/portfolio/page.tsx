"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import DataTable from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { 
  Plus, X, Save, Search, Layout, 
  Settings, Layers, Briefcase, Github, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "content" | "seo" | "advanced";

export default function AdminPortfolioPage() {
  const projects = useQuery(api.portfolio.listAll) || [];
  const createProject = useMutation(api.portfolio.create);
  const updateProject = useMutation(api.portfolio.update);
  const removeProject = useMutation(api.portfolio.remove);
  
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<Id<"portfolioProjects"> | null>(null);

  const initialForm = {
    title: "",
    slug: "",
    summary: "",
    description: "",
    cover: "/images/projects/default.jpg",
    imageAlt: "",
    status: "ACTIVE",
    featured: false,
    liveUrl: "",
    githubUrl: "",
    stack: "",
    seoTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    ogImage: "",
    isIndexed: true,
    schemaType: "SoftwareApplication",
    faqItems: "[]",
  };

  const [form, setForm] = useState(initialForm);

  const handleEdit = (project: any) => {
    setEditingId(project._id);
    let stackStr = "";
    try {
      if (project.stack && project.stack.startsWith("[")) {
        const parsedStack = JSON.parse(project.stack);
        stackStr = Array.isArray(parsedStack) ? parsedStack.join(", ") : project.stack;
      } else {
        stackStr = project.stack || "";
      }
    } catch {
      stackStr = project.stack || "";
    }

    setForm({
      title: project.title || "",
      slug: project.slug || "",
      summary: project.summary || "",
      description: project.description || "",
      cover: project.cover || "/images/projects/default.jpg",
      imageAlt: project.imageAlt || "",
      status: project.status || "ACTIVE",
      featured: project.featured ?? false,
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      stack: stackStr,
      seoTitle: project.seoTitle || "",
      metaDescription: project.metaDescription || "",
      canonicalUrl: project.canonicalUrl || "",
      ogImage: project.ogImage || "",
      isIndexed: project.isIndexed ?? true,
      schemaType: project.schemaType || "SoftwareApplication",
      faqItems: project.faqItems || "[]",
    });
    setShowForm(true);
    setActiveTab("content");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const stack = JSON.stringify(form.stack.split(",").map((s) => s.trim()).filter(Boolean));
      
      const payload = {
        title: form.title,
        slug,
        summary: form.summary,
        description: form.description,
        cover: form.cover,
        imageAlt: form.imageAlt,
        status: form.status,
        featured: form.featured,
        liveUrl: form.liveUrl || undefined,
        githubUrl: form.githubUrl || undefined,
        stack,
        seoTitle: form.seoTitle,
        metaDescription: form.metaDescription,
        canonicalUrl: form.canonicalUrl,
        ogImage: form.ogImage,
        isIndexed: form.isIndexed,
        schemaType: form.schemaType,
        faqItems: form.faqItems,
      };

      if (editingId) {
        await updateProject({ id: editingId, ...payload });
      } else {
        await createProject(payload);
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
      label: "Project", 
      render: (item: any) => (
        <div className="flex flex-col">
          <span className="font-medium text-white">{item.title}</span>
          <span className="text-[10px] text-white/30 font-mono ">/projects/{item.slug}</span>
        </div>
      ) 
    },
    { 
      key: "featured", 
      label: "Featured", 
      render: (item: any) => <StatusBadge status={item.featured ? "Yes" : "No"} /> 
    },
    { 
      key: "status", 
      label: "Status", 
      render: (item: any) => <StatusBadge status={item.status} /> 
    },
    {
      key: "actions", 
      label: "",
      render: (item: any) => (
        <div className="flex items-center gap-3 justify-end opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button onClick={() => handleEdit(item)} className="text-[10px] font-bold text-accent-blue hover:text-white uppercase tracking-widest transition-colors">Edit</button>
          <button 
            onClick={() => { if (confirm("Remove project?")) removeProject({ id: item._id }); }}
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
          <div className="w-16 h-16 rounded-3xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue shadow-lg shadow-accent-blue/10">
            <Briefcase size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white  uppercase">Portfolio <span className="text-accent-blue font-bold">Showcase</span></h1>
            <p className="text-sm text-white/40 mt-1 font-medium italic">Manage high-impact case studies with deep SEO controls and tech stack mapping.</p>
          </div>
        </div>
        {!showForm && (
          <button onClick={() => { setEditingId(null); setForm(initialForm); setShowForm(true); }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent-blue text-white text-sm font-bold hover:bg-white hover:text-black transition-all shadow-lg shadow-accent-blue/20">
            <Plus size={18} /> ADD PROJECT
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-1 border border-white/5 bg-[#0D121B] rounded-4xl overflow-hidden shadow-2xl"
          >
            <form onSubmit={handleSubmit}>
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/1">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setActiveTab("content")} 
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === "content" ? "bg-white/10 text-white" : "text-white/40 hover:text-white tracking-widest"}`}>
                    <Layout size={14} /> PROJECT DATA
                  </button>
                  <button type="button" onClick={() => setActiveTab("seo")} 
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === "seo" ? "bg-white/10 text-white" : "text-white/40 hover:text-white tracking-widest"}`}>
                    <Search size={14} /> SEARCH SEO
                  </button>
                  <button type="button" onClick={() => setActiveTab("advanced")} 
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === "advanced" ? "bg-white/10 text-white" : "text-white/40 hover:text-white tracking-widest"}`}>
                    <Layers size={14} /> CONFIG
                  </button>
                </div>
                <div className="flex items-center gap-3">
                   <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 text-xs font-bold text-white/30 hover:text-white transition-colors">
                     DISCARD
                   </button>
                   <button 
                    type="submit" 
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-white text-black text-sm font-black hover:bg-accent-blue hover:text-white transition-all shadow-xl shadow-white/5"
                  >
                    <Save size={16} /> {saving ? "PRESERVING..." : editingId ? "COMMIT CHANGES" : "DEPLOY PROJECT"}
                  </button>
                </div>
              </div>

              <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {activeTab === "content" && (
                   <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Legacy / Public Title</label>
                          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project Name" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white font-bold outline-none focus:border-accent-blue/50" required />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Tech Architecture (Stack)</label>
                          <input value={form.stack} onChange={(e) => setForm({ ...form, stack: e.target.value })} placeholder="Next.js, Tailwind, Convex..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-accent-blue font-mono outline-none focus:border-accent-blue/50" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Elevator Pitch (Summary)</label>
                        <input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="One sentence describing the core impact..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white/80 outline-none focus:border-accent-blue/50" required />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-accent-blue uppercase tracking-[0.3em] ml-1">Technical Deepdive (Markdown)</label>
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Detailed breakdown of challenges, solutions, and outcomes..." rows={12} className="w-full bg-black/40 border border-white/10 rounded-3xl py-6 px-8 text-sm text-white/60 font-mono outline-none focus:border-accent-blue/50 resize-y leading-relaxed" required />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-accent-blue uppercase tracking-[0.3em] ml-1 italic flex items-center gap-2"><ExternalLink size={12} /> Live Link</label>
                            <input value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://app.demo.com" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs text-white/40 font-mono outline-none" />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1 italic flex items-center gap-2"><Github size={12} /> Repository</label>
                            <input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs text-white/40 font-mono outline-none" />
                         </div>
                      </div>
                   </div>
                )}

                {activeTab === "seo" && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400 max-w-2xl mx-auto py-4">
                    <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-3xl space-y-2">
                       <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">SEO MAXIMIZATION</h4>
                       <p className="text-xs text-white/40 leading-relaxed italic">Portfolio projects are your strongest trust signals. Optimize these meta tags to capture "Developer for [Industry]" intent.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">SERP TITLE</label>
                          <span className={`text-[10px] font-mono ${form.seoTitle.length > 60 ? "text-red-400" : "text-white/20"}`}>{form.seoTitle.length} / 60</span>
                        </div>
                        <input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} placeholder="Search Optimized Title" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-accent-blue/50 transition-all font-bold" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">META SNIPPET</label>
                          <span className={`text-[10px] font-mono ${form.metaDescription.length > 155 ? "text-red-400" : "text-white/20"}`}>{form.metaDescription.length} / 155</span>
                        </div>
                        <textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} placeholder="Compelling search results summary..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white/70 outline-none focus:border-accent-blue/50" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "advanced" && (
                   <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-400">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                         <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest">Publicity & Deployment</h4>
                            <div className="space-y-3">
                               <label className="flex items-center justify-between p-6 rounded-3xl bg-white/3 border border-white/5 cursor-pointer hover:bg-white/5 transition-all">
                                  <div className="space-y-0.5">
                                    <span className="text-sm font-bold text-white tracking-tight">Active Lifecycle</span>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Global Status</p>
                                  </div>
                                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="bg-black/50 border border-white/10 text-xs text-white rounded-lg px-3 py-1.5 outline-none">
                                     <option value="ACTIVE">ACTIVE</option>
                                     <option value="PAUSED">PAUSED</option>
                                     <option value="COMPLETED">ARCHIVED</option>
                                  </select>
                               </label>

                               <label className="flex items-center justify-between p-6 rounded-3xl bg-white/3 border border-white/5 cursor-pointer hover:bg-white/5 transition-all group">
                                  <div className="space-y-0.5">
                                    <span className="text-sm font-bold text-white group-hover:text-accent-blue transition-colors">Showcase Highlight (Featured)</span>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest font-mono">Adds to hero/featured list</p>
                                  </div>
                                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-5 h-5 accent-accent-blue" />
                               </label>

                               <label className="flex items-center justify-between p-6 rounded-3xl bg-white/3 border border-white/5 cursor-pointer hover:bg-white/5 transition-all group">
                                  <div className="space-y-0.5">
                                    <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">Search Discovery (Index)</span>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest font-mono">Allow crawler discovery</p>
                                  </div>
                                  <input type="checkbox" checked={form.isIndexed} onChange={(e) => setForm({ ...form, isIndexed: e.target.checked })} className="w-5 h-5 accent-amber-500" />
                               </label>
                            </div>
                         </div>

                         <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest">Metadata Mapping</h4>
                            <div className="space-y-4">
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1 italic font-mono ">Schema.org Entity</label>
                                  <select value={form.schemaType} onChange={(e) => setForm({ ...form, schemaType: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white/50 outline-none">
                                    <option value="SoftwareApplication">Software / SaaS</option>
                                    <option value="CreativeWork">Design / Branding</option>
                                    <option value="MobileApplication">Mobile App</option>
                                  </select>
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1 italic font-mono ">Primary Asset Alt Text</label>
                                  <input value={form.imageAlt} onChange={(e) => setForm({ ...form, imageAlt: e.target.value })} placeholder="Descriptive image text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white/40 outline-none" />
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
          <div className="relative overflow-hidden rounded-4xl border border-white/5 bg-[#080B10]/80 backdrop-blur-2xl">
             <DataTable columns={columns} data={projects as any} searchKey="title" emptyMessage="Zero projects in showcase. Begin the legacy." />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
