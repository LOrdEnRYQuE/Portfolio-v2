"use client";

import { useState, useEffect, use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Layout, Search, Layers, ExternalLink, Globe, Eye } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "content" | "seo" | "advanced";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const post = useQuery(api.posts.getById, { id: id as Id<"posts"> });
  const updatePost = useMutation(api.posts.update);
  
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    tags: "",
    published: false,
    seoTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    ogImage: "",
    isIndexed: true,
    schemaType: "BlogPosting",
    faqItems: "[]",
  });

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title || "",
        slug: post.slug || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        image: post.image || "",
        tags: (() => { try { return JSON.parse(post.tags || "[]").join(", "); } catch { return post.tags || ""; } })(),
        published: post.published ?? false,
        seoTitle: post.seoTitle || "",
        metaDescription: post.metaDescription || "",
        canonicalUrl: post.canonicalUrl || "",
        ogImage: post.ogImage || "",
        isIndexed: post.isIndexed ?? true,
        schemaType: post.schemaType || "BlogPosting",
        faqItems: post.faqItems || "[]",
      });
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePost({
        id: id as Id<"posts">,
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || undefined,
        content: form.content,
        image: form.image || undefined,
        tags: JSON.stringify(form.tags.split(",").map((t) => t.trim()).filter(Boolean)),
        published: form.published,
        seoTitle: form.seoTitle,
        metaDescription: form.metaDescription,
        canonicalUrl: form.canonicalUrl,
        ogImage: form.ogImage,
        isIndexed: form.isIndexed,
        schemaType: form.schemaType,
        faqItems: form.faqItems,
      });
      router.push("/admin/blog");
    } catch (err) {
      console.error("Failed to update post:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!post) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog" className="p-3 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white  tracking-tighter uppercase italic">Edit <span className="text-accent-purple">Article</span></h1>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mt-0.5">ID: {id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-white text-black text-sm font-black hover:bg-accent-purple hover:text-white transition-all shadow-xl shadow-white/5 disabled:opacity-50"
          >
            <Save size={18} /> {saving ? "PRESERVING..." : "COMMIT CHANGES"}
          </button>
        </div>
      </div>

      <div className="p-1 border border-white/5 bg-[#0D121B] rounded-4xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/1">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setActiveTab("content")} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === "content" ? "bg-white/10 text-white" : "text-white/40 hover:text-white tracking-widest"}`}>
              <Layout size={14} /> CORE CONTENT
            </button>
            <button type="button" onClick={() => setActiveTab("seo")} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === "seo" ? "bg-white/10 text-white" : "text-white/40 hover:text-white tracking-widest"}`}>
              <Search size={14} /> SEARCH SEO
            </button>
            <button type="button" onClick={() => setActiveTab("advanced")} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === "advanced" ? "bg-white/10 text-white" : "text-white/40 hover:text-white tracking-widest"}`}>
              <Layers size={14} /> ADVANCED
            </button>
          </div>
          
          <div className="flex items-center gap-6 pr-4">
             <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${form.published ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-white/10"}`} />
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{form.published ? "LIVE" : "UNPUBLISHED"}</span>
             </div>
             {form.isIndexed && (
                <div className="flex items-center gap-2">
                  <Globe size={12} className="text-accent-blue" />
                  <span className="text-[10px] font-black text-accent-blue uppercase tracking-widest">INDEXED</span>
                </div>
             )}
          </div>
        </div>

        <div className="p-10 space-y-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {activeTab === "content" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Editorial Title</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white font-bold outline-none focus:border-accent-purple/50" required />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Permalink Slug</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 font-mono text-xs">/blog/</span>
                    <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-16 pr-6 text-sm text-accent-purple font-mono outline-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Teaser Excerpt</label>
                <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white/70 outline-none focus:border-accent-purple/50" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                   <label className="text-[10px] font-black text-accent-purple uppercase tracking-[0.3em] flex items-center gap-2"><Eye size={12} /> Narrative Body (Markdown)</label>
                   <span className="text-[10px] font-mono text-white/20 ">Auto-saving locally...</span>
                </div>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={20} className="w-full bg-black/40 border border-white/10 rounded-3xl py-6 px-8 text-sm text-white/60 font-mono outline-none focus:border-accent-purple/50 resize-y leading-relaxed" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Cover Asset URL</label>
                  <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs text-white/40 font-mono outline-none" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Taxonomy (Tags)</label>
                  <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="ai, javascript, tutorial..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs text-accent-purple font-mono outline-none" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "seo" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-2xl mx-auto py-10">
              <div className="bg-purple-500/5 border border-purple-500/10 p-8 rounded-4xl space-y-3 mb-10 text-center">
                 <div className="w-12 h-12 bg-accent-purple/20 rounded-2xl flex items-center justify-center text-accent-purple mx-auto mb-4">
                    <Search size={24} />
                 </div>
                 <h4 className="text-sm font-black text-white uppercase tracking-widest">SERP OPTIMIZATION</h4>
                 <p className="text-xs text-white/40 leading-relaxed italic">Strategic metadata control for maximum organic click-through rates.</p>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Google Title</label>
                    <span className={`text-[10px] font-mono ${form.seoTitle.length > 60 ? "text-red-400" : "text-white/20"}`}>{form.seoTitle.length} / 60</span>
                  </div>
                  <input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} placeholder="Optimized title for search results" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white font-bold outline-none border-l-4 border-l-accent-purple" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Meta Snippet</label>
                    <span className={`text-[10px] font-mono ${form.metaDescription.length > 155 ? "text-red-400" : "text-white/20"}`}>{form.metaDescription.length} / 155</span>
                  </div>
                  <textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} placeholder="Compelling description for the search result snippet..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white/70 outline-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/20 uppercase ml-1 italic font-mono">Canonical URL</label>
                      <input value={form.canonicalUrl} onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-[10px] text-white/40 font-mono outline-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/20 uppercase ml-1 italic font-mono">OG Image override</label>
                      <input value={form.ogImage} onChange={(e) => setForm({ ...form, ogImage: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 text-[10px] text-white/40 font-mono outline-none" />
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "advanced" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                     <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Visibility & Indexing</h4>
                     <div className="space-y-3">
                        <label className="flex items-center justify-between p-7 rounded-3xl bg-white/3 border border-white/5 cursor-pointer hover:bg-white/5 transition-all group">
                           <div className="space-y-1">
                             <span className="text-sm font-bold text-white group-hover:text-accent-purple transition-colors tracking-tight">Public Release (Published)</span>
                             <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest font-mono">Make article visible on frontend</p>
                           </div>
                           <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-6 h-6 rounded-lg accent-accent-purple" />
                        </label>

                        <label className="flex items-center justify-between p-7 rounded-3xl bg-white/3 border border-white/5 cursor-pointer hover:bg-white/5 transition-all group">
                           <div className="space-y-1">
                             <span className="text-sm font-bold text-white group-hover:text-accent-blue transition-colors tracking-tight">Crawl Command (Indexed)</span>
                             <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest font-mono">Instruct bots to index this page</p>
                           </div>
                           <input type="checkbox" checked={form.isIndexed} onChange={(e) => setForm({ ...form, isIndexed: e.target.checked })} className="w-6 h-6 rounded-lg accent-accent-blue" />
                        </label>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Structured Entity</h4>
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-white/20 uppercase  ml-1 italic font-mono ">Schema Type</label>
                           <select value={form.schemaType} onChange={(e) => setForm({ ...form, schemaType: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white/50 outline-none hover:border-white/20 transition-colors">
                             <option value="BlogPosting">Standard Blog Post</option>
                             <option value="TechArticle">Technical Case Study</option>
                             <option value="Article">General Article</option>
                             <option value="NewsArticle">News Feed</option>
                           </select>
                        </div>
                        <div className="bg-white/2 border border-white/5 p-6 rounded-3xl space-y-2 italic">
                            <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">Author Mapping</p>
                            <p className="text-xs text-white/20">Inherited from site-wide profile configuration.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
