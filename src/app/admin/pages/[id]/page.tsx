"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Eye,
  Globe,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Layers,
  FileText,
  Settings,
  Layout,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { VisualBlockEditor, PageBlock } from "@/components/admin/VisualBlockEditor";

type EditorMode = "text" | "visual";

interface PageData {
  title: string;
  slug: string;
  description: string;
  content: string;
  published: boolean;
  inNavbar: boolean;
  order: number;
}


export default function PageEditor() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [page, setPage] = useState<PageData>({
    title: "",
    slug: "",
    description: "",
    content: "",
    published: false,
    inNavbar: false,
    order: 0,
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode>("text");
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [wordCount, setWordCount] = useState(0);

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    const newPage = { ...page, title: value };
    if (isNew || !page.slug) {
      newPage.slug = value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }
    setPage(newPage);
  };

  // Count words in content
  useEffect(() => {
    const words = page.content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  }, [page.content]);

  // Parse content as blocks if it starts with "["
  useEffect(() => {
    if (page.content && page.content.startsWith("[")) {
      try {
        const parsed = JSON.parse(page.content);
        if (Array.isArray(parsed)) {
          setBlocks(parsed);
          setEditorMode("visual");
        }
      } catch {
        // Not JSON, stay in text mode
      }
    }
  }, [page.content]);

  // Fetch page if editing existing
  useEffect(() => {
    if (!isNew) {
      const fetchPage = async () => {
        try {
          const res = await fetch(`/api/admin/pages?id=${id}`);
          if (!res.ok) throw new Error("Not found");
          const data = await res.json();
          if (data) setPage(data);
        } catch {
          setError("Failed to load page data.");
        } finally {
          setLoading(false);
        }
      };
      fetchPage();
    }
  }, [id, isNew]);

  // Auto-save feedback reset
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  const handleSave = useCallback(async () => {
    if (!page.title.trim() || !page.slug.trim()) {
      setError("Title and slug are required.");
      return;
    }
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/pages", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isNew ? page : { ...page, id }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to save page");
      }

      setSuccess(true);
      if (isNew) {
        const data = await res.json();
        router.push(`/admin/pages/${data.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }, [page, id, isNew, router]);

  // Keyboard shortcut: Ctrl/Cmd + S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 size={32} className="animate-spin text-accent mx-auto" />
          <p className="text-white/30 text-sm">Loading page editor…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages">
            <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
              {isNew ? "New Page" : "Editing"}
            </p>
            <h1 className="text-xl font-bold text-white leading-tight">
              {isNew ? "Create Page" : (page.title || "Untitled")}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isNew && page.slug && (
            <Link href={`/${page.slug}`} target="_blank">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/8 text-white/50 hover:text-white hover:border-white/20 text-xs font-semibold transition-all">
                <Eye size={14} /> Preview
              </button>
            </Link>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="relative flex items-center gap-2 px-5 py-2.5 bg-accent text-background rounded-xl text-sm font-bold hover:bg-accent/90 disabled:opacity-60 transition-all shadow-lg shadow-accent/20 min-w-[130px] justify-center overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.span
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 size={15} /> Saved!
                </motion.span>
              ) : saving ? (
                <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <Loader2 size={15} className="animate-spin" /> Saving…
                </motion.span>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <Save size={15} /> {isNew ? "Create Page" : "Save Changes"}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            <AlertCircle size={16} className="shrink-0" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto text-red-400/50 hover:text-red-400 text-xs">
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard hint */}
      <p className="text-[11px] text-white/20 -mt-4">
        Tip: press <kbd className="px-1.5 py-0.5 bg-white/8 border border-white/10 rounded text-white/40 font-mono">⌘S</kbd> to save
      </p>

      {/* Main Editor Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Content Editor Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title + Description */}
          <div className="p-6 rounded-2xl bg-white/3 border border-white/8 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <FileText size={15} className="text-accent" />
              </div>
              <h2 className="text-sm font-bold text-white">Page Details</h2>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-white/30">Page Title *</label>
              <input
                type="text"
                value={page.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Services, About, New Offer…"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 focus:bg-white/8 transition-all text-lg font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-white/30">Meta Description</label>
              <textarea
                value={page.description || ""}
                onChange={(e) => setPage({ ...page, description: e.target.value })}
                placeholder="Brief description shown in search results…"
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 transition-all resize-none text-sm leading-relaxed"
              />
            </div>
          </div>

          {/* Content Editor */}
          <div className="p-6 rounded-2xl bg-white/3 border border-white/8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-400/10 border border-blue-400/20 flex items-center justify-center">
                  <Layout size={15} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Content</h2>
                  <p className="text-[10px] text-white/30">{wordCount} words</p>
                </div>
              </div>
              {/* Mode switcher */}
              <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/8">
                <button
                  onClick={() => setEditorMode("text")}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${editorMode === "text" ? "bg-accent text-background shadow-sm" : "text-white/40 hover:text-white"}`}
                >
                  Text
                </button>
                <button
                  onClick={() => setEditorMode("visual")}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${editorMode === "visual" ? "bg-accent text-background shadow-sm" : "text-white/40 hover:text-white"}`}
                >
                  Blocks
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {editorMode === "text" ? (
                <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <textarea
                    value={page.content}
                    onChange={(e) => setPage({ ...page, content: e.target.value })}
                    placeholder="Write your page content here…&#10;&#10;You can use Markdown-style formatting or plain HTML."
                    rows={20}
                    className="w-full bg-[#080808] border border-white/8 rounded-xl p-5 text-white/80 placeholder:text-white/15 focus:outline-none focus:border-accent/30 font-mono text-sm leading-relaxed resize-none transition-all"
                  />
                </motion.div>
              ) : (
                <motion.div key="visual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <VisualBlockEditor
                    blocks={blocks}
                    onChange={(newBlocks: PageBlock[]) => {
                      setBlocks(newBlocks);
                      setPage({ ...page, content: JSON.stringify(newBlocks) });
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-5">
          {/* URL + Order */}
          <div className="p-6 rounded-2xl bg-white/3 border border-white/8 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-white/5">
              <div className="w-8 h-8 rounded-lg bg-purple-400/10 border border-purple-400/20 flex items-center justify-center">
                <Settings size={15} className="text-purple-400" />
              </div>
              <h2 className="text-sm font-bold text-white">Settings</h2>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-white/30 flex items-center gap-1.5">
                <LinkIcon size={11} /> URL Slug *
              </label>
              <div className="flex items-center gap-0">
                <span className="px-3 py-3 rounded-l-xl bg-white/3 border border-r-0 border-white/10 text-white/30 text-sm">/</span>
                <input
                  type="text"
                  value={page.slug}
                  onChange={(e) => setPage({ ...page, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  className="flex-1 bg-white/5 border border-white/10 rounded-r-xl py-3 px-3 text-white focus:outline-none focus:border-accent/40 font-mono text-sm transition-all"
                />
              </div>
              {page.slug && (
                <p className="text-[11px] text-white/25">lordenryque.com/{page.slug}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-white/30 flex items-center gap-1.5">
                <Layers size={11} /> Sort Order
              </label>
              <input
                type="number"
                value={page.order}
                onChange={(e) => setPage({ ...page, order: parseInt(e.target.value) || 0 })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent/40 transition-all text-sm"
              />
            </div>
          </div>

          {/* Visibility Toggles */}
          <div className="p-6 rounded-2xl bg-white/3 border border-white/8 space-y-5">
            <h2 className="text-sm font-bold text-white pb-3 border-b border-white/5">Visibility</h2>

            <div
              className="flex items-center justify-between cursor-pointer group"
              onClick={() => setPage({ ...page, published: !page.published })}
            >
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-accent transition-colors">Published</p>
                <p className="text-[11px] text-white/30 mt-0.5">Visible to all visitors</p>
              </div>
              <div className={`w-11 h-6 rounded-full relative transition-colors ${page.published ? "bg-emerald-400" : "bg-white/10"}`}>
                <motion.div
                  animate={{ x: page.published ? 22 : 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                />
              </div>
            </div>

            <div
              className="flex items-center justify-between cursor-pointer group"
              onClick={() => setPage({ ...page, inNavbar: !page.inNavbar })}
            >
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-accent transition-colors">In Navbar</p>
                <p className="text-[11px] text-white/30 mt-0.5">Show in main navigation</p>
              </div>
              <div className={`w-11 h-6 rounded-full relative transition-colors ${page.inNavbar ? "bg-accent" : "bg-white/10"}`}>
                <motion.div
                  animate={{ x: page.inNavbar ? 22 : 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                />
              </div>
            </div>
          </div>

          {/* Live URL Preview */}
          {page.slug && (
            <div className="p-5 rounded-2xl border border-dashed border-white/10 flex flex-col items-center text-center gap-3 group hover:border-accent/20 transition-colors">
              <Globe size={22} className="text-white/20 group-hover:text-accent/50 transition-colors" />
              <div>
                <p className="text-[11px] text-white/30 leading-relaxed">This page publishes at</p>
                <p className="text-sm text-white/60 font-mono mt-1 break-all">lordenryque.com/{page.slug}</p>
              </div>
              {!isNew && (
                <Link href={`/${page.slug}`} target="_blank" className="flex items-center gap-1.5 text-[11px] text-accent/50 hover:text-accent transition-colors">
                  <Eye size={12} /> Open live page
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
