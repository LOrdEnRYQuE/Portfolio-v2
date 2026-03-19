"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import DataTable, { Column } from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Briefcase, Rocket, Cog, Clock, Trash2, UserPlus, Receipt, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"];

interface Lead {
  _id: Id<"leads">;
  _creationTime: number;
  name: string;
  email: string;
  concept: string;
  industry: string;
  status: string;
  description?: string;
  features?: string;
  timeline?: string;
  budget?: string;
  stack?: string;
}

export default function AdminLeadsPage() {
  const router = useRouter();
  const leads = useQuery(api.leads.listAll) || [];
  const updateLead = useMutation(api.leads.update);
  const removeLead = useMutation(api.leads.remove);
  const convertToClient = useMutation(api.leads.convertToClient);
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [converting, setConverting] = useState(false);

  const handleConvert = async (type: "invoice" | "contract") => {
    if (!selectedLead) return;
    setConverting(true);
    try {
      const userId = await convertToClient({ id: selectedLead._id });
      
      // Trigger Welcome Email
      await fetch("/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "welcome",
          data: {
            clientName: selectedLead.name,
            clientEmail: selectedLead.email,
          }
        })
      });

      const target = type === "invoice" ? "/admin/invoices/new" : "/admin/contracts/new";
      router.push(`${target}?leadId=${selectedLead._id}&userId=${userId}`);
    } catch (error) {
      console.error("Conversion failed:", error);
    } finally {
      setConverting(false);
    }
  };

  const handleStatusChange = async (id: Id<"leads">, status: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    await updateLead({ id, status });
  };

  const columns: Column<Lead>[] = [
    { key: "name", label: "Name", render: (item) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/40">
          {item.name.charAt(0)}
        </div>
        <span className="font-medium text-white">{item.name}</span>
      </div>
    )},
    { key: "email", label: "Email" },
    { key: "concept", label: "Concept", render: (item) => (
      <span className="text-white/60 italic">&quot;{item.concept}&quot;</span>
    )},
    { key: "industry", label: "Industry" },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <select
          value={item.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => handleStatusChange(item._id, e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none cursor-pointer focus:border-white/20 transition-all font-medium"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s} className="bg-neutral-900">{s}</option>
          ))}
        </select>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (item) => (
        <button
          onClick={(e) => { 
            e.stopPropagation();
            if (confirm("Delete this lead?")) removeLead({ id: item._id }); 
          }}
          className="p-2 text-red-400/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
        >
          <Trash2 size={14} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">CRM / Leads</h1>
          <p className="text-sm text-white/40 mt-1">{leads.length} total leads found</p>
        </div>
        <div className="flex gap-2">
          {STATUSES.map((s) => {
            const count = leads.filter((l) => l.status === s).length;
            return count > 0 ? (
              <StatusBadge key={s} status={`${s} (${count})`} />
            ) : null;
          })}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={leads as Lead[]}
        searchKey="name"
        onRowClick={(lead) => setSelectedLead(lead)}
        emptyMessage="No leads yet — share your contact page!"
      />

      <AnimatePresence>
        {selectedLead && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl bg-neutral-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
              >
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center text-xl font-bold text-white">
                      {selectedLead.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedLead.name}</h2>
                      <p className="text-sm text-white/40">{selectedLead.industry} • {selectedLead.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {/* The Concept */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                      <Briefcase size={12} />
                      The Concept
                    </div>
                    <div className="p-4 rounded-2xl bg-white/3 border border-white/5">
                      <p className="text-lg font-medium text-white/90">&quot;{selectedLead.concept}&quot;</p>
                      {selectedLead.description && (
                        <p className="mt-2 text-sm text-white/50 leading-relaxed uppercase tracking-wide">
                          {selectedLead.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Features & Tech */}
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                        <Cog size={12} />
                        Targeted Features
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          try {
                            const features = JSON.parse(selectedLead.features || "[]");
                            return features.map((f: string, i: number) => (
                              <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/60">
                                {f}
                              </span>
                            ));
                          } catch {
                            return <span className="text-white/20 italic text-xs">No specific features selected</span>;
                          }
                        })()}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                        <Clock size={12} />
                        Expected Launch
                      </div>
                      <div className="p-4 rounded-2xl bg-white/3 border border-white/5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                          <Rocket size={14} />
                        </div>
                        <span className="text-sm font-medium text-white/80">{selectedLead.timeline || "TBD"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex gap-3">
                      <a
                        href={`mailto:${selectedLead.email}`}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all"
                      >
                        <Mail size={16} />
                        Email
                      </a>
                      
                      {selectedLead.status !== "CONVERTED" ? (
                        <>
                          <button
                            onClick={() => handleConvert("invoice")}
                            disabled={converting}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500 text-white font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                          >
                            <Receipt size={16} />
                            {converting ? "Processing..." : "Convert & Invoice"}
                          </button>
                          <button
                            onClick={() => handleConvert("contract")}
                            disabled={converting}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                          >
                            <FileText size={16} />
                            Generate Contract
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-emerald-400 font-bold text-sm">
                          <UserPlus size={16} />
                          Converted to Client
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Status</span>
                       <select
                        value={String(selectedLead.status)}
                        onChange={(e) => handleStatusChange(selectedLead._id as Id<"leads">, e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none cursor-pointer hover:border-white/20 transition-all"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s} className="bg-neutral-900">{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

