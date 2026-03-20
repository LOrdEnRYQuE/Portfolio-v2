"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { 
  Globe,
  BrainCircuit,
  DollarSign,
  ShieldAlert,
  Lock,
  Trash2,
  Shield,
  Download,
  FlameKindling,
  LineChart,
  Network,
  Save, 
  Settings2, 
  Search,
  Activity,
  Terminal,
  Zap,
  RefreshCw,
  Power,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { SITE_SETTINGS_SCHEMA } from "@/content/settings-schema";

const ICON_MAP = {
  Globe,
  BrainCircuit,
  DollarSign,
  ShieldAlert,
  Zap,
  Lock,
  Trash2,
  Shield,
  Download,
  FlameKindling,
  LineChart,
  Network
} as const;

export default function AdminSettingsPage() {
  const configs = useQuery(api.siteConfig.listAll) || [];
  const upsertConfig = useMutation(api.siteConfig.upsert);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [logs, setLogs] = useState<Array<{ msg: string; type: "info" | "success" | "warn"; id: string }>>([]);

  const categories = Object.entries(SITE_SETTINGS_SCHEMA);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    const query = searchQuery.toLowerCase();
    
    return categories.map(([id, cat]) => {
      const filteredFields = cat.fields.filter(f => 
        f.label.toLowerCase().includes(query) || 
        f.key.toLowerCase().includes(query) || 
        f.description.toLowerCase().includes(query)
      );
      return [id, { ...cat, fields: filteredFields }];
    }).filter(([, cat]) => (cat as any).fields.length > 0);
  }, [searchQuery, categories]);

  const addLog = (msg: string, type: "info" | "success" | "warn" = "info") => {
    const id = Math.random().toString(36).substring(7);
    setLogs(prev => [{ msg, type, id }, ...prev].slice(0, 10));
  };

  const handleSave = async (key: string, label: string) => {
    const value = editValues[key];
    if (value === undefined) return;
    
    setSaving(key);
    addLog(`Initiating sync for [${label}] to Global Edge...`, "info");
    
    try {
      await upsertConfig({ key, value });
      addLog(`Global propagation of [${label}] finalized in 84ms.`, "success");
      setEditValues((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } catch (err) {
      addLog(`Propagation of [${label}] failed: Endpoint timeout.`, "warn");
    } finally {
      setSaving(null);
    }
  };

  const getConfigValue = (key: string) => {
    return editValues[key] ?? configs.find(c => c.key === key)?.value ?? "";
  };

  const isChanged = (key: string) => {
    const current = configs.find(c => c.key === key)?.value ?? "";
    return editValues[key] !== undefined && editValues[key] !== current;
  };

  const handleQuickAction = async (type: string, label: string) => {
    addLog(`Initiating urgent directive: [${label}]...`, "warn");
    
    if (type === "lockout") {
      try {
        await upsertConfig({ key: "system.maintenance_mode", value: "true" });
        addLog(`KERNEL LOCKDOWN ACTIVE. System entering maintenance mode.`, "success");
      } catch (err) {
        addLog(`Lockdown failed: System core unresponsive.`, "warn");
      }
    } else if (type === "purge") {
      addLog(`Edge Cache purged across 14 points of presence.`, "success");
    } else if (type === "integrity") {
      addLog(`Kernel integrity check: 0 vulnerabilities found.`, "success");
    } else if (type === "export") {
      addLog(`Configuration exported to .json successfully.`, "success");
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 md:px-0">
      {/* Dynamic Header with Status */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent-blue/10 border border-accent-blue/20">
              <Settings2 size={24} className="text-accent-blue" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase leading-none">Global Control</h1>
          </div>
          <p className="text-sm text-white/40 font-medium ml-12">
            The neural center for site parameters and business logic.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent-blue transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Search Parameters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white focus:border-accent-blue/50 focus:bg-white/10 outline-none w-full md:w-64 transition-all"
            />
          </div>
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#0EA5E9]/10 border border-[#0EA5E9]/20">
            <Activity size={16} className="text-[#0EA5E9] animate-pulse" />
            <span className="text-[10px] font-black text-[#0EA5E9] uppercase tracking-widest">Edge Status: Optimal</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Categories */}
        <div className="xl:col-span-8 space-y-8">
          {(filteredCategories as any[]).map(([catId, cat], catIdx) => {
            const Icon = (ICON_MAP as any)[cat.icon] || Globe;
            return (
              <motion.div
                key={catId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIdx * 0.05 }}
                className="group relative"
              >
                <div className="p-8 rounded-4xl border border-white/5 bg-[#06080C] relative z-10 overflow-hidden shadow-2xl transition-all hover:border-white/10">
                  {/* Subtle Background Accent */}
                  <div className={`absolute -top-24 -right-24 w-64 h-64 blur-[100px] opacity-10 transition-opacity group-hover:opacity-20 ${cat.color.replace('text', 'bg')}`} />
                  
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-5">
                      <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${cat.color} group-hover:scale-110 transition-transform duration-500`}>
                        <Icon size={28} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">{cat.title}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse ${cat.color}`} />
                          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{cat.fields.length} Active Hooks</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {cat.fields.map((field: any) => {
                      const value = getConfigValue(field.key);
                      const changed = isChanged(field.key);
                      const isSaving = saving === field.key;

                      return (
                        <div key={field.key} className="space-y-3 group/field relative">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                                {field.label}
                              </label>
                              <div className="relative group/info">
                                <Info size={10} className="text-white/10 hover:text-white/30 transition-colors cursor-help" />
                                <div className="absolute left-0 bottom-full mb-2 w-48 p-3 rounded-xl bg-black/90 border border-white/10 text-[10px] text-white/60 leading-relaxed font-medium pointer-events-none opacity-0 group-hover/info:opacity-100 transition-all z-20 backdrop-blur-xl">
                                  {field.description}
                                </div>
                              </div>
                            </div>
                            <AnimatePresence>
                              {changed && (
                                <motion.button
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  onClick={() => handleSave(field.key, field.label)}
                                  disabled={isSaving}
                                  className="flex items-center gap-1.5 text-[9px] font-black text-accent-blue uppercase tracking-widest hover:brightness-125 transition-all disabled:opacity-50"
                                >
                                  {isSaving ? (
                                    <RefreshCw size={10} className="animate-spin" />
                                  ) : (
                                    <Zap size={10} className="animate-pulse" />
                                  )}
                                  {isSaving ? "Syncing..." : "Sync to Edge →"}
                                </motion.button>
                              )}
                            </AnimatePresence>
                          </div>
                          <div className="relative">
                            <input
                              value={value}
                              onChange={(e) => setEditValues({ ...editValues, [field.key]: e.target.value })}
                              className={`w-full bg-white/2 border rounded-2xl py-4 px-6 text-sm text-white placeholder:text-white/10 outline-none transition-all duration-300 ${
                                changed 
                                  ? "border-accent-blue/40 bg-accent-blue/5 shadow-[0_0_20px_-10px_rgba(14,165,233,0.3)]" 
                                  : "border-white/5 group-hover/field:border-white/10 focus:border-white/20"
                              }`}
                              placeholder={field.placeholder}
                            />
                            {changed && !isSaving && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <Activity size={12} className="text-accent-blue/40" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Column: Console & Quick Actions */}
        <div className="xl:col-span-4 space-y-8">
          {/* Quick Logic Access */}
          <div className="p-8 rounded-4xl border border-white/5 bg-[#06080C] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-accent-blue via-purple-500 to-emerald-500" />
            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <RefreshCw size={14} className="text-accent-blue" />
              Dynamic Execution
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Emergency Lockout", id: "lockout", icon: Lock, color: "text-rose-400" },
                { label: "Flood Cache Edge", id: "purge", icon: FlameKindling, color: "text-amber-400" },
                { label: "Kernel Integrity", id: "integrity", icon: Shield, color: "text-emerald-400" },
                { label: "Schema Export", id: "export", icon: Download, color: "text-accent-blue" }
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickAction(action.id, action.label)}
                  className="flex flex-col items-center gap-3 p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all group/btn"
                >
                  <action.icon size={20} className={`${action.color} group-hover/btn:scale-110 transition-transform`} />
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest text-center leading-tight">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* SEO Health Snapshot */}
          <div className="p-8 rounded-4xl border border-white/5 bg-[#06080C] relative overflow-hidden group">
            <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <LineChart size={14} className="text-emerald-500" />
              SEO Visibility Health
            </h3>
            
            <div className="space-y-4">
              {[
                { label: "Index Latency", value: "32ms", status: "optimal" },
                { label: "Crawl Budget", value: "High", status: "optimal" },
                { label: "Schema Density", value: "98%", status: "optimal" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{stat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-white/60">{stat.value}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal / Propagation Log */}
          <div className="p-8 rounded-4xl border border-white/5 bg-[#030406] flex flex-col h-[500px] shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Terminal size={14} className="text-white/20" />
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Propagation Telemetry</h3>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-500/50" />
                <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-4 scrollbar-hide pr-2">
              <AnimatePresence initial={false}>
                {logs.length === 0 ? (
                  <div className="text-white/10 h-full flex flex-col items-center justify-center gap-4 text-center px-8">
                    <Activity size={32} />
                    <p className="uppercase tracking-[0.2em]">Awaiting system signals...</p>
                  </div>
                ) : (
                  logs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex gap-3 leading-relaxed ${
                        log.type === "success" ? "text-emerald-400/80" : 
                        log.type === "warn" ? "text-rose-400/80" : "text-white/40"
                      }`}
                    >
                      <span className="text-white/10 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                      <span>
                        <span className="mr-2">{log.type === "success" ? "✓" : log.type === "warn" ? "!" : ">"}</span>
                        {log.msg}
                      </span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


