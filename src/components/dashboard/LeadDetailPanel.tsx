"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { X, UserPlus, Save, Mail, Briefcase, Zap, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StatusBadge from "./StatusBadge";

interface LeadDetailPanelProps {
  lead: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadDetailPanel({ lead, isOpen, onClose }: LeadDetailPanelProps) {
  const updateLead = useMutation(api.leads.update);
  const convertToClient = useMutation(api.leads.convertToClient);
  const sendEmail = useMutation(api.emails.create);
  const [notes, setNotes] = useState(lead?.notes || "");
  const [score, setScore] = useState(lead?.score || 0);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSentReply, setHasSentReply] = useState(false);

  if (!lead) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateLead({ id: lead._id, notes, score: Number(score) });
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickReply = async () => {
    try {
      await sendEmail({
        from: "hello@lordenryque.com",
        to: lead.email,
        subject: `Re: Project Inquiry - ${lead.name}`,
        body: `Hi ${lead.name},\n\nThanks for reaching out! I've reviewed your project idea for "${lead.concept}" and it looks very promising. Let's schedule a quick call to discuss the next steps.\n\nBest,\nEnryque`,
        folder: "SENT",
        status: "READ",
        tags: ["CRM", "QUICK-REPLY"],
      });
      setHasSentReply(true);
      setTimeout(() => setHasSentReply(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConvert = async () => {
    if (confirm("Convert this lead to a Client? This will create a platform account for them.")) {
      await convertToClient({ id: lead._id });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-hidden"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-lg bg-[#080B10] border-l border-white/10 z-50 shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/2">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">{lead.name}</h2>
                <p className="text-sm text-white/40 font-mono mt-1">{lead.email}</p>
              </div>
              <button onClick={onClose} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-10">
              {/* Quick Actions */}
              <div className="flex gap-4">
                <button 
                  onClick={handleConvert}
                  disabled={lead.status === "CONVERTED"}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent-blue text-white font-bold text-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                >
                  <UserPlus size={18} /> Convert to Client
                </button>
                <button 
                  onClick={handleQuickReply}
                  disabled={hasSentReply}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border transition-all font-bold text-sm ${
                    hasSentReply 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                    : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                  }`}
                >
                  <Mail size={18} /> {hasSentReply ? "Message Sent" : "Quick Reply"}
                </button>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/2 border border-white/5 space-y-1">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Industry</p>
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Briefcase size={14} className="text-accent-blue" />
                    {lead.industry}
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-white/2 border border-white/5 space-y-1">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Status</p>
                  <StatusBadge status={lead.status} />
                </div>
                <div className="p-5 rounded-2xl bg-white/2 border border-white/5 space-y-1 col-span-2">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Business Idea</p>
                  <p className="text-white font-semibold leading-relaxed">{lead.concept}</p>
                </div>
              </div>

              {/* CRM Scoring & Notes */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Zap size={16} className="text-yellow-400" /> CRM Intelligence
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Lead Score</span>
                    <input 
                      type="number" 
                      value={score} 
                      onChange={(e) => setScore(e.target.value)}
                      className="w-16 bg-white/5 border border-white/10 rounded-lg py-1 px-2 text-center text-xs font-bold text-white focus:border-accent-blue outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Internal History & Notes</p>
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="text-[10px] font-bold text-accent-blue hover:text-white uppercase transition-colors flex items-center gap-1"
                    >
                      <Save size={12} /> {isSaving ? "Saving..." : "Save Notes"}
                    </button>
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Document interactions, follow-ups, or project specific constraints..."
                    className="w-full h-40 bg-white/2 border border-white/5 rounded-2xl p-5 text-sm text-white/80 placeholder:text-white/10 focus:border-accent-blue/50 outline-none transition-all resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Advanced Timeline */}
              <div className="space-y-4 pt-4">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">System Perspective</p>
                <div className="p-5 rounded-2xl bg-amber-400/3 border border-amber-400/10 flex items-start gap-4">
                  <Star size={20} className="text-amber-400 shrink-0" />
                  <p className="text-xs text-amber-500/80 leading-relaxed italic">
                    This lead shows high correlation with our Startup Accelerator plan. Recommended tech stack: Next.js + Convex.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
