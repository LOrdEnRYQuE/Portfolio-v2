"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Eye,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LayoutTemplate,
  Globe,
  RefreshCw,
  Lock,
} from "lucide-react";

interface SectionField {
  [key: string]: string | number | boolean | SectionFieldItem[];
}

interface SectionFieldItem {
  title: string;
  desc?: string;
  [key: string]: string | undefined;
}

interface PageSection {
  id: string;
  type: string;
  label: string;
  fields: SectionField;
}

// Map of field keys → human-readable labels
const FIELD_LABELS: Record<string, string> = {
  badge: "Badge Text",
  title: "Title",
  subtitle: "Subtitle",
  description: "Description",
  headline: "Headline",
  subheadline: "Sub-Headline",
  bio: "Biography",
  name: "Full Name",
  role: "Role / Title",
  email: "Email Address",
  phone: "Phone Number",
  whatsapp: "WhatsApp Number",
  location: "Location",
  availability: "Availability Status",
  resumeUrl: "Résumé URL",
  primaryCta: "Primary Button",
  secondaryCta: "Secondary Button",
  buttonText: "Button Text",
  responseTime: "Response Time",
};

function FieldLabel({ fieldKey }: { fieldKey: string }) {
  const label = FIELD_LABELS[fieldKey] || fieldKey.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
  return (
    <label className="text-[11px] font-black uppercase tracking-widest text-white/30">{label}</label>
  );
}

function StringField({
  value,
  onChange,
  multiline,
}: {
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const base =
    "w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 focus:bg-white/8 transition-all text-sm";
  return multiline ? (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className={`${base} p-3 resize-none leading-relaxed`}
    />
  ) : (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${base} px-3 py-2.5`}
    />
  );
}

function ItemsField({
  items,
  onChange,
}: {
  items: SectionFieldItem[];
  onChange: (items: SectionFieldItem[]) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/8 space-y-2">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Item {i + 1}</p>
          {Object.entries(item).map(([k, v]) => (
            <div key={k} className="space-y-1">
              <FieldLabel fieldKey={k} />
              <StringField
                value={String(v ?? "")}
                onChange={(val) => {
                  const updated = [...items];
                  updated[i] = { ...updated[i], [k]: val };
                  onChange(updated);
                }}
                multiline={k === "desc" || k === "description"}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SectionPanel({
  section,
  onChange,
  defaultOpen,
}: {
  section: PageSection;
  onChange: (s: PageSection) => void;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const updateField = (key: string, value: string | SectionFieldItem[]) => {
    onChange({ ...section, fields: { ...section.fields, [key]: value } });
  };

  const MULTILINE_FIELDS = new Set(["bio", "description", "subtitle", "availability"]);

  return (
    <div className={`rounded-2xl border transition-all ${open ? "border-accent/25 bg-white/4" : "border-white/8 bg-white/2"}`}>
      {/* Header */}
      <button
        className="w-full flex items-center justify-between p-4 text-left group"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${open ? "bg-accent" : "bg-white/20"}`} />
          <div>
            <p className={`text-sm font-bold transition-colors ${open ? "text-white" : "text-white/60 group-hover:text-white"}`}>
              {section.label}
            </p>
            <p className="text-[11px] text-white/30 font-mono">{section.type}</p>
          </div>
        </div>
        {open ? (
          <ChevronDown size={16} className="text-white/30" />
        ) : (
          <ChevronRight size={16} className="text-white/20 group-hover:text-white/40 transition-colors" />
        )}
      </button>

      {/* Fields */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 pt-1 space-y-4 border-t border-white/8">
              {Object.entries(section.fields).map(([key, value]) => {
                if (key === "items" && Array.isArray(value)) {
                  return (
                    <div key={key} className="space-y-2">
                      <FieldLabel fieldKey={key} />
                      <ItemsField
                        items={value as SectionFieldItem[]}
                        onChange={(v) => updateField(key, v)}
                      />
                    </div>
                  );
                }
                return (
                  <div key={key} className="space-y-1.5">
                    <FieldLabel fieldKey={key} />
                    <StringField
                      value={String(value ?? "")}
                      onChange={(v) => updateField(key, v)}
                      multiline={MULTILINE_FIELDS.has(key)}
                    />
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SLUG_META: Record<string, { label: string; url: string; color: string }> = {
  home: { label: "Home Page", url: "/", color: "text-accent" },
  about: { label: "About Page", url: "/about", color: "text-blue-400" },
  contact: { label: "Contact Page", url: "/contact", color: "text-purple-400" },
  services: { label: "Services Page", url: "/services", color: "text-emerald-400" },
  faq: { label: "FAQ Page", url: "/faq", color: "text-cyan-400" },
};

export default function CorePageEditor() {
  const params = useParams();
  const slug = params.slug as string;
  const meta = SLUG_META[slug];

  const [sections, setSections] = useState<PageSection[]>([]);
  const [pageTitle, setPageTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`/api/admin/pages/core?slug=${slug}`);
        if (!res.ok) throw new Error("Could not load page");
        const data = await res.json();
        setSections(data.sections || []);
        setPageTitle(data.title || "");
      } catch {
        setError("Failed to load page content.");
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchPage();
  }, [slug]);

  const updateSection = useCallback((updated: PageSection) => {
    setSections((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setIsDirty(true);
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/pages/core", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, sections, title: pageTitle }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSuccess(true);
      setIsDirty(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }, [slug, sections, pageTitle]);

  // Cmd+S shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSave]);

  if (!meta) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <Lock size={32} className="text-white/20" />
        <p className="text-white/40">Unknown page: <code className="text-white/60">{slug}</code></p>
        <Link href="/admin/pages" className="text-accent text-sm hover:underline">← Back to Pages</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/pages">
            <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all">
              <ArrowLeft size={16} />
            </button>
          </Link>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-1.5">
              <LayoutTemplate size={10} /> Core Page Editor
            </p>
            <h1 className={`text-lg font-bold ${meta.color}`}>{meta.label}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="text-[11px] text-amber-400/70 flex items-center gap-1.5">
              <RefreshCw size={11} className="animate-spin" /> Unsaved changes
            </span>
          )}
          <Link href={meta.url} target="_blank">
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/8 text-white/50 hover:text-white hover:border-white/20 text-xs font-semibold transition-all">
              <Eye size={13} /> Preview
            </button>
          </Link>
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="relative flex items-center gap-2 px-5 py-2 bg-accent text-background rounded-xl text-sm font-bold hover:bg-accent/90 disabled:opacity-50 transition-all min-w-[120px] justify-center shadow-lg shadow-accent/20"
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.span key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <CheckCircle2 size={14} /> Saved!
                </motion.span>
              ) : saving ? (
                <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Saving…
                </motion.span>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <Save size={14} /> Save Changes
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            <AlertCircle size={15} />
            {error}
            <button onClick={() => setError(null)} className="ml-auto text-red-400/40 hover:text-red-400 text-xs">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tip */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-white/25">
          Press <kbd className="px-1.5 py-0.5 bg-white/8 border border-white/10 rounded font-mono text-white/40">⌘S</kbd> to save · Changes go live as soon as they are saved and the page reloads
        </p>
        <div className="flex items-center gap-1.5 text-[11px] text-white/30">
          <Globe size={11} />
          lordenryque.com{meta.url}
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={28} className="animate-spin text-accent/40" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Left: Section panels (Elementor-style) */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-2">
              Page Sections — click a section to expand and edit its content
            </p>
            {sections.map((section, i) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <SectionPanel
                  section={section}
                  onChange={updateSection}
                  defaultOpen={i === 0}
                />
              </motion.div>
            ))}
          </div>

          {/* Right: Page info */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white/3 border border-white/8 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-white/5 pb-3">Page Info</h3>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-white/30">Display Title</label>
                <input
                  type="text"
                  value={pageTitle}
                  onChange={(e) => { setPageTitle(e.target.value); setIsDirty(true); }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-accent/40 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-white/30">URL</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/3 border border-white/8">
                  <Globe size={12} className="text-white/30" />
                  <code className="text-white/50 text-xs font-mono">{meta.url}</code>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-widest text-white/30">Sections</label>
                <p className="text-2xl font-bold text-white">{sections.length}</p>
              </div>
            </div>

            {/* Section index */}
            <div className="p-5 rounded-2xl bg-white/3 border border-white/8 space-y-3">
              <h3 className="text-sm font-bold text-white border-b border-white/5 pb-3">Section Index</h3>
              {sections.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3 text-sm">
                  <span className="text-[11px] font-black text-white/25 w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/60 font-medium text-xs truncate">{s.label}</p>
                    <p className="text-white/25 font-mono text-[10px]">{s.type}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Important note */}
            <div className="p-4 rounded-2xl bg-amber-400/5 border border-amber-400/15 space-y-1">
              <p className="text-[11px] font-bold text-amber-400/70 uppercase tracking-wider">Important</p>
              <p className="text-[11px] text-white/35 leading-relaxed">
                This page&apos;s React components must read from the database for changes to appear live. If a section change doesn&apos;t appear, the component may still be hardcoded.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
