"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Trash2,
  Layout,
  Plus,
  Search,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Edit3,
  Globe,
  Lock,
  Home,
  User,
  Mail,
  BookOpen,
  Briefcase,
  HelpCircle,
  Scale,
  Layers,
  FolderOpen,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface Page {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  published: boolean;
  inNavbar: boolean;
  order: number;
  content: string;
  updatedAt: string;
}

// Hardcoded site routes that always exist
const SITE_ROUTES = [
  {
    slug: "home",
    href: "/",
    label: "Home",
    description: "Main landing page with hero, services, and portfolio highlights.",
    icon: Home,
    editHref: "/admin/pages/core/home",
    color: "text-accent",
    bg: "bg-accent/10 border-accent/20",
    locked: false,
  },
  {
    slug: "about",
    href: "/about",
    label: "About",
    description: "Biography, timeline, and professional background.",
    icon: User,
    editHref: "/admin/pages/core/about",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
    locked: false,
  },
  {
    slug: "contact",
    href: "/contact",
    label: "Contact",
    description: "Contact wizard, inquiry form, and communication details.",
    icon: Mail,
    editHref: "/admin/pages/core/contact",
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
    locked: false,
  },
  {
    slug: "services",
    href: "/services",
    label: "Services",
    description: "Service offerings, pricing tiers, and packages.",
    icon: Layers,
    editHref: "/admin/pages/core/services",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
    locked: false,
  },
  {
    slug: "blog",
    href: "/blog",
    label: "Blog",
    description: "Articles, updates, and published posts.",
    icon: BookOpen,
    editHref: "/admin/blog",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20",
    locked: false,
    redirectTo: "/admin/blog",
  },
  {
    slug: "projects",
    href: "/projects",
    label: "Projects",
    description: "Case studies, client work, and active builds.",
    icon: FolderOpen,
    editHref: "/admin/projects",
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/20",
    locked: false,
    redirectTo: "/admin/projects",
  },
  {
    slug: "portfolio",
    href: "/portfolio",
    label: "Portfolio",
    description: "Showcase of featured projects and case studies.",
    icon: Briefcase,
    editHref: "/admin/portfolio",
    color: "text-rose-400",
    bg: "bg-rose-400/10 border-rose-400/20",
    locked: false,
    redirectTo: "/admin/portfolio",
  },
  {
    slug: "faq",
    href: "/faq",
    label: "FAQ",
    description: "Frequently asked questions for clients and visitors.",
    icon: HelpCircle,
    editHref: "/admin/pages?focus=faq",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10 border-cyan-400/20",
    locked: true,
  },
  {
    slug: "legal",
    href: "/legal",
    label: "Legal",
    description: "Privacy policy, terms of service, and legal documents.",
    icon: Scale,
    editHref: "/admin/legal",
    color: "text-white/40",
    bg: "bg-white/5 border-white/10",
    locked: false,
    redirectTo: "/admin/legal",
  },
];

export default function PageManager() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"site" | "dynamic">("site");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      setPages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch pages", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const toggleStatus = async (id: string, field: "published" | "inNavbar", value: boolean) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: !value } : p))
    );
    try {
      const res = await fetch("/api/admin/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, [field]: !value }),
      });
      if (!res.ok) fetchPages();
    } catch {
      fetchPages();
    }
  };

  const deletePage = async (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
    try {
      await fetch(`/api/admin/pages?id=${id}`, { method: "DELETE" });
    } catch {
      fetchPages();
    }
  };

  const filteredDynamic = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSite = SITE_ROUTES.filter(
    (r) =>
      r.label.toLowerCase().includes(search.toLowerCase()) ||
      r.slug.toLowerCase().includes(search.toLowerCase())
  );

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return "Today";
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-2">
            <Globe size={10} /> Content Management System
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white">Pages</h1>
          <p className="text-white/40 text-sm">
            Manage all your site pages — structure, content, visibility, and navigation.
          </p>
        </div>
        <Link href="/admin/pages/new">
          <button className="flex items-center gap-2 px-5 py-3 bg-accent text-background rounded-xl text-sm font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20">
            <Plus size={16} />
            New Dynamic Page
          </button>
        </Link>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/8 rounded-xl">
          {[
            { key: "site", label: "Site Pages", count: SITE_ROUTES.length },
            { key: "dynamic", label: "Dynamic Pages", count: pages.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as "site" | "dynamic")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab.key
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {tab.label}
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                  activeTab === tab.key ? "bg-accent text-background" : "bg-white/10 text-white/50"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/8 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/40 transition-all"
          />
        </div>
      </div>

      {/* Site Pages Tab */}
      <AnimatePresence mode="wait">
        {activeTab === "site" && (
          <motion.div
            key="site"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredSite.map((route, i) => (
                <motion.div
                  key={route.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="group relative p-5 rounded-2xl bg-white/3 border border-white/8 hover:border-white/20 hover:bg-white/5 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${route.bg}`}>
                      <route.icon size={18} className={route.color} />
                    </div>
                    {route.locked ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white/30 bg-white/5 border border-white/8 px-2 py-1 rounded-lg">
                        <Lock size={9} /> Core
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-lg">
                        <CheckCircle2 size={9} /> Live
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white mb-1">{route.label}</h3>
                  <p className="text-[11px] text-white/40 leading-relaxed mb-5">{route.description}</p>

                  <div className="flex items-center gap-2">
                    <Link
                      href={route.redirectTo || `/admin/pages/edit-${route.slug}`}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                        route.locked
                          ? "bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/20"
                          : "bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-background"
                      }`}
                    >
                      <Edit3 size={13} />
                      {route.redirectTo ? "Manage" : "Edit Content"}
                    </Link>
                    <Link
                      href={route.href}
                      target="_blank"
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/8 text-white/40 hover:text-white hover:border-white/20 transition-all"
                      title="View live"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Info callout */}
            <div className="mt-6 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/15 flex items-start gap-3">
              <AlertCircle size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-white/40 leading-relaxed">
                <span className="text-white/60 font-semibold">Core pages</span> are built into the site&apos;s Next.js routing and cannot be deleted. Use{" "}
                <span className="text-accent font-semibold">Dynamic Pages</span> to create fully custom, DB-driven pages that can be published or hidden at any time.
              </p>
            </div>
          </motion.div>
        )}

        {/* Dynamic Pages Tab */}
        {activeTab === "dynamic" && (
          <motion.div
            key="dynamic"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : filteredDynamic.length === 0 ? (
              <div className="py-20 text-center rounded-2xl bg-white/3 border border-white/8 space-y-4">
                <Layout size={32} className="text-white/15 mx-auto" />
                <div>
                  <p className="text-white/40 font-semibold">No dynamic pages yet</p>
                  <p className="text-white/25 text-sm mt-1">Create your first custom page using the button above.</p>
                </div>
                <Link href="/admin/pages/new">
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent/10 border border-accent/20 text-accent rounded-xl text-sm font-bold hover:bg-accent hover:text-background transition-all mt-2">
                    <Plus size={14} /> Create First Page
                  </button>
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
                <div className="divide-y divide-white/5">
                  {filteredDynamic.map((page, i) => (
                    <motion.div
                      key={page.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-4 p-5 group hover:bg-white/3 transition-colors"
                    >
                      {/* Status indicator */}
                      <div
                        className={`shrink-0 w-2 h-2 rounded-full ${page.published ? "bg-emerald-400 shadow-emerald-glow" : "bg-white/20"}`}
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-white text-sm">{page.title}</span>
                          {page.inNavbar && (
                            <span className="text-[9px] font-black text-accent bg-accent/10 border border-accent/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                              Navbar
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <code className="text-[11px] text-white/40 font-mono">/{page.slug}</code>
                          <span className="text-[11px] text-white/25">· {timeAgo(page.updatedAt)}</span>
                        </div>
                        {page.description && (
                          <p className="text-[11px] text-white/30 mt-0.5 truncate max-w-md">{page.description}</p>
                        )}
                      </div>

                      {/* Toggles */}
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => toggleStatus(page.id, "published", page.published)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
                            page.published
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                              : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                          }`}
                        >
                          {page.published ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                          {page.published ? "Live" : "Draft"}
                        </button>

                        <button
                          onClick={() => toggleStatus(page.id, "inNavbar", page.inNavbar)}
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                            page.inNavbar
                              ? "bg-accent/10 border-accent/20 text-accent"
                              : "bg-white/5 border-white/8 text-white/30 hover:text-white/60"
                          }`}
                          title={page.inNavbar ? "In navbar" : "Hidden from navbar"}
                        >
                          {page.inNavbar ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                        <Link href={`/${page.slug}`} target="_blank">
                          <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/50 hover:text-white transition-all" title="View">
                            <ExternalLink size={14} />
                          </button>
                        </Link>
                        <Link href={`/admin/pages/${page.id}`}>
                          <button className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-background flex items-center justify-center transition-all" title="Edit">
                            <Edit3 size={14} />
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(page.id)}
                          className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/30 hover:text-red-400 hover:border-red-400/20 hover:bg-red-400/10 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 max-w-sm w-full space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                <Trash2 size={22} className="text-red-400" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-bold text-white text-lg">Delete Page?</h3>
                <p className="text-white/40 text-sm">This action is permanent and cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-semibold hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deletePage(deleteConfirm)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500 hover:text-white transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
