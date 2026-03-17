"use client";

import { useState, useEffect, type ElementType } from "react";
import { 
  Settings, 
  Save, 
  Terminal, 
  Globe, 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  User, 
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

interface Settings {
  site_brand: string;
  site_name: string;
  site_role: string;
  site_bio: string;
  site_email: string;
  site_github: string;
  site_linkedin: string;
  site_twitter: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    site_brand: "",
    site_name: "",
    site_role: "",
    site_bio: "",
    site_email: "",
    site_github: "",
    site_linkedin: "",
    site_twitter: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data) {
        setSettings({
          site_brand: data.site_brand || "",
          site_name: data.site_name || "",
          site_role: data.site_role || "",
          site_bio: data.site_bio || "",
          site_email: data.site_email || "",
          site_github: data.site_github || "",
          site_linkedin: data.site_linkedin || "",
          site_twitter: data.site_twitter || "",
        });
      }
    } catch {
      setStatus({ type: "error", message: "Failed to load settings." });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setStatus({ type: "success", message: "Settings saved successfully!" });
        setTimeout(() => setStatus(null), 3000);
      } else {
        throw new Error();
      }
    } catch {
      setStatus({ type: "error", message: "Failed to save settings." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  interface InputFieldProps {
    label: string;
    icon: ElementType; // Lucide icons are ElementTypes
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
    type?: string;
    isTextArea?: boolean;
  }

  const InputField = ({ label, icon: Icon, value, onChange, placeholder, type = "text", isTextArea = false }: InputFieldProps) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
        <Icon size={12} className="text-accent" />
        {label}
      </label>
      {isTextArea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/10 focus:outline-none focus:border-accent/30 focus:bg-white/8 transition-all resize-none text-sm"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 h-12 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/30 focus:bg-white/8 transition-all"
        />
      )}
    </div>
  );

  return (
    <div className="p-8 lg:p-12 space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-accent">
            <Terminal size={20} className="animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">System Controls</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight bg-linear-to-br from-white via-white to-white/40 bg-clip-text text-transparent">
            Global Settings
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
            Manage your global identity, contact info, and digital connectivity across the entire portfolio.
          </p>
        </div>
        
        <Button 
          variant="primary" 
          className="h-14 px-8 rounded-2xl group min-w-[160px]"
          onClick={saveSettings}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Save className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
          )}
          {saving ? "Saving..." : "Save Config"}
        </Button>
      </div>

      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            className={`p-4 rounded-2xl border flex items-center gap-3 mb-6 ${
              status.type === "success" 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <p className="text-sm font-medium">{status.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Brand Identity */}
        <section className="glass-card p-8 rounded-3xl space-y-6 border border-white/5 bg-white/2">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="text-accent" size={18} />
            <h2 className="text-sm font-black uppercase tracking-[0.2em]">Brand Identity</h2>
          </div>
          <InputField 
            label="Brand Name" 
            icon={Globe}
            value={settings.site_brand} 
            onChange={(val: string) => setSettings({ ...settings, site_brand: val })} 
            placeholder="e.g. LOrdEnRYQuE"
          />
          <InputField 
            label="Owner Name" 
            icon={User}
            value={settings.site_name} 
            onChange={(val: string) => setSettings({ ...settings, site_name: val })} 
            placeholder="e.g. Attila Lazar"
          />
          <InputField 
            label="Professional Role" 
            icon={Briefcase}
            value={settings.site_role} 
            onChange={(val: string) => setSettings({ ...settings, site_role: val })} 
            placeholder="e.g. AI Engineer • Full-Stack Developer"
          />
          <InputField 
            label="Tagline / Bio" 
            icon={FileText}
            isTextArea
            value={settings.site_bio} 
            onChange={(val: string) => setSettings({ ...settings, site_bio: val })} 
            placeholder="Short description for SEO and Footer"
          />
        </section>

        {/* Connectivity */}
        <div className="space-y-8">
          <section className="glass-card p-8 rounded-3xl space-y-6 border border-white/5 bg-white/2">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="text-accent" size={18} />
              <h2 className="text-sm font-black uppercase tracking-[0.2em]">Contact & Reach</h2>
            </div>
            <InputField 
              label="Contact Email" 
              icon={Mail}
              type="email"
              value={settings.site_email} 
              onChange={(val: string) => setSettings({ ...settings, site_email: val })} 
              placeholder="e.g. hello@lordenryque.com"
            />
          </section>

          <section className="glass-card p-8 rounded-3xl space-y-6 border border-white/5 bg-white/2">
            <div className="flex items-center gap-3 mb-2">
              <Share2 className="text-accent" size={18} />
              <h2 className="text-sm font-black uppercase tracking-[0.2em]">Digital Fleet (Socials)</h2>
            </div>
            <InputField 
              label="GitHub URL" 
              icon={Github}
              value={settings.site_github} 
              onChange={(val: string) => setSettings({ ...settings, site_github: val })} 
              placeholder="https://github.com/..."
            />
            <InputField 
              label="LinkedIn URL" 
              icon={Linkedin}
              value={settings.site_linkedin} 
              onChange={(val: string) => setSettings({ ...settings, site_linkedin: val })} 
              placeholder="https://linkedin.com/in/..."
            />
            <InputField 
              label="Twitter URL" 
              icon={Twitter}
              value={settings.site_twitter} 
              onChange={(val: string) => setSettings({ ...settings, site_twitter: val })} 
              placeholder="https://twitter.com/..."
            />
          </section>
        </div>
      </div>
    </div>
  );
}

import { Share2, Zap, FileText } from "lucide-react";
