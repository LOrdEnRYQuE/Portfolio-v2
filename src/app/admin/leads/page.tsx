"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Layers,
  Clock,
  Archive,
  ArrowRight,
  X,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/Button";

export default function LeadHub() {
  const leads = useQuery(api.leads.listAll) || [];
  const updateStatusManual = useMutation(api.leads.update);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactNote, setContactNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedLead = leads.find(l => l._id === selectedId) || null;

  const handleInitializeContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    setIsSubmitting(true);

    try {
      await updateStatusManual({
        id: selectedLead._id as Id<"leads">,
        status: "CONTACTED"
      });
      setIsContactModalOpen(false);
      setContactNote("");
    } catch (e) {
      console.error("Contact initialization failed", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateStatusManual({
        id: id as Id<"leads">,
        status: newStatus
      });
    } catch (e) {
      console.error("Failed to update lead status", e);
    }
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW": return "text-accent bg-accent/10 border-accent/20";
      case "CONTACTED": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "ARCHIVED": return "text-white/20 bg-white/5 border-white/10";
      default: return "text-white/40 bg-white/5 border-white/10";
    }
  };

  return (
    <div className="min-h-screen p-8 sm:p-12 lg:p-16 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[8px] font-black uppercase tracking-[0.2em]">
            <Zap size={10} /> Oversight Protocol Active
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">
            Lead <span className="text-accent underline underline-offset-8">Hub</span>
          </h1>
          <p className="text-white/40 text-sm max-w-xl leading-relaxed italic border-l-2 border-white/5 pl-4 ml-1">
            Analyzing inbound Blueprint Forge requests and client synchronization requirements.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Filter Synapses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-xs font-bold focus:outline-hidden focus:border-accent/40 focus:bg-white/7 transition-all w-full md:w-64"
            />
          </div>
          <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-accent hover:border-accent/20 transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {!leads.length && !searchTerm ? (
            <div className="p-12 text-center text-white/20 font-black tracking-widest uppercase animate-pulse">
              Scanning Neural Flux...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-[32px] border-white/5">
              <Archive className="mx-auto text-white/10 mb-4" size={48} />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">No Lead Patterns Detected</p>
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <motion.div
                key={lead._id}
                layoutId={lead._id}
                onClick={() => setSelectedId(lead._id)}
                className={`glass-card p-6 rounded-[24px] border-white/5 cursor-pointer group hover:bg-white/2 hover:border-accent/30 transition-all flex items-center gap-6 ${selectedLead?._id === lead._id ? 'border-accent/40 bg-accent/5' : ''}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${getStatusColor(lead.status)}`}>
                  <Layers size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-black text-sm uppercase truncate group-hover:text-accent transition-colors">{lead.concept}</h3>
                    <span className="text-[8px] font-black tracking-tighter text-white/20">
                      {formatDistanceToNow(new Date(lead._creationTime))} ago
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter truncate">{lead.name}</p>
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <p className="text-[10px] font-bold text-accent uppercase tracking-tighter">{lead.industry}</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-white/10 group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </motion.div>
            ))
          )}
        </div>

        <AnimatePresence mode="wait">
          {selectedLead ? (
            <motion.div
              key={selectedLead._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card rounded-[40px] border-white/10 p-10 space-y-8 sticky top-32"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] ${getStatusColor(selectedLead.status)}`}>
                    {selectedLead.status}
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none">{selectedLead.concept}</h2>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleStatusUpdate(selectedLead._id, "CONTACTED")}
                    className={`p-3 border rounded-2xl transition-all ${selectedLead.status === "CONTACTED" ? 'bg-emerald-400/20 border-emerald-400 text-emerald-400' : 'bg-white/5 border-white/5 text-white/40 hover:text-white'}`}
                    title="Mark as Contacted"
                  >
                    <Mail size={18} />
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(selectedLead._id, "ARCHIVED")}
                    className={`p-3 border rounded-2xl transition-all ${selectedLead.status === "ARCHIVED" ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/5 text-white/40 hover:text-white'}`}
                    title="Archive Lead"
                  >
                    <Archive size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">Involved Client</p>
                  <p className="text-xs font-bold truncate">{selectedLead.name}</p>
                  <p className="text-[10px] text-white/40 font-medium truncate">{selectedLead.email}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">Target Niche</p>
                  <p className="text-xs font-bold text-accent uppercase italic truncate">{selectedLead.industry}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/20">
                  <Clock size={14} className="text-accent" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Implementation Window: <span className="text-white">{selectedLead.timeline || "N/A"}</span></p>
                </div>
                <div className="flex items-center gap-3 text-white/20">
                  <Layers size={14} className="text-accent" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Tech Stack: <span className="text-white">{selectedLead.stack || "N/A"}</span></p>
                </div>
              </div>

              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-2">Concept Description</p>
                   &ldquo;{selectedLead.description || "No detailed transmission received."}&rdquo;
              </div>

              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-2">Requested Modules</p>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      try {
                        const features = typeof selectedLead.features === 'string' ? JSON.parse(selectedLead.features) : selectedLead.features;
                        return Array.isArray(features) ? features.map((f: string, i: number) => (
                          <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white/40 group hover:border-accent/40 transition-colors">
                            {f}
                          </span>
                        )) : null;
                      } catch {
                        return <span className="text-[10px] text-white/20 uppercase">No parsable modules</span>;
                      }
                    })()}
                  </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex gap-4">
                 <button 
                  onClick={() => setIsContactModalOpen(true)}
                  disabled={selectedLead.status === "CONTACTED"}
                  className={`flex-1 font-black uppercase tracking-[0.2em] py-4 rounded-2xl text-[11px] italic flex items-center justify-center gap-3 transition-all ${
                    selectedLead.status === "CONTACTED" 
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-default" 
                    : "bg-accent text-white hover:shadow-accent-glow"
                  }`}
                 >
                    {selectedLead.status === "CONTACTED" ? (
                      <>Sync Established <CheckCircle2 size={16} /></>
                    ) : (
                      <>Initialize Contact <ArrowRight size={16} /></>
                    )}
                 </button>
                 <button className="w-14 h-14 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-all">
                    <MoreHorizontal size={20} />
                 </button>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-12">
               <div className="space-y-4 opacity-[0.15]">
                  <Layers size={80} className="mx-auto" />
                  <p className="text-xs font-black uppercase tracking-[0.4em]">Select Synapse for Deep Analysis</p>
               </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-lg rounded-[48px] border-white/10 p-12 space-y-8 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Neural <span className="text-accent">Briefing</span></h2>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Protocol initialization for {selectedLead?.name}</p>
                </div>
                <button onClick={() => setIsContactModalOpen(false)} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                  <X size={20} className="text-white/40" />
                </button>
              </div>

              <div className="space-y-4">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black uppercase tracking-widest text-accent mb-1">Target Synapse</p>
                    <p className="text-xs font-bold">{selectedLead?.concept}</p>
                    <p className="text-[10px] text-white/40 font-medium">{selectedLead?.email}</p>
                 </div>
              </div>

              <form onSubmit={handleInitializeContact} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">Transmission Dispatch Note</label>
                  <textarea 
                    value={contactNote}
                    onChange={(e) => setContactNote(e.target.value)}
                    placeholder="Log details of the neural handshake..."
                    className="w-full h-32 bg-white/5 border border-white/5 rounded-3xl py-6 px-8 text-xs font-bold focus:border-accent/40 outline-none transition-all resize-none placeholder:text-white/10"
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-8 rounded-3xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <>Execute Initialization <Zap size={18} /></>}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
