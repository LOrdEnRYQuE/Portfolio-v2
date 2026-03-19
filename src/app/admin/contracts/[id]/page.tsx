"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import Image from "next/image";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, Copy, FileDown, Edit3, Save, Check, ExternalLink } from "lucide-react";
import { downloadContractPDF } from "@/lib/pdf";

export default function AdminContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const printMode = searchParams.get("print") === "1";

  const contract = useQuery(api.contracts.getById, { id: id as Id<"contracts"> });
  const updateContract = useMutation(api.contracts.update);
  const sendContract = useMutation(api.contracts.send);

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contract) {
      setEditTitle(contract.title);
      setEditContent(contract.content);
    }
  }, [contract]);

  // Auto-trigger print in print mode
  useEffect(() => {
    if (printMode && contract) {
      setTimeout(() => window.print(), 500);
    }
  }, [printMode, contract]);

  if (!contract) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateContract({
        id: id as Id<"contracts">,
        title: editTitle,
        content: editContent,
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    const token = await sendContract({ id: id as Id<"contracts"> });
    const url = `${window.location.origin}/sign/${token}`;
    await navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 4000);
  };

  const handleCopyLink = async () => {
    if (contract.accessToken) {
      const url = `${window.location.origin}/sign/${contract.accessToken}`;
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    }
  };

  const renderContent = (text: string) => {
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-lg font-bold mt-6 mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-base font-bold mt-4 mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/^---$/gm, '<hr class="border-gray-300 my-4"/>')
      .replace(/\n\n/g, "<br/><br/>")
      .replace(/\n/g, "<br/>");
  };

  // Print-mode layout (clean, no dashboard shell)
  if (printMode) {
    return (
      <div className="bg-white text-black p-12 max-w-4xl mx-auto print-contract" ref={printRef}>
        <style>{`
          @media print {
            body { background: white !important; }
            .print-contract { padding: 0 !important; }
            nav, aside, .no-print { display: none !important; }
          }
        `}</style>
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: renderContent(contract.content) }}
        />
        {contract.signatureData && (
          <div className="mt-12 pt-8 border-t-2 border-black">
            <p className="text-sm font-bold mb-2">Client Signature:</p>
            <div className="relative h-20 w-fit">
              <Image 
                src={contract.signatureData} 
                alt="Client signature" 
                width={160} 
                height={80} 
                className="h-full w-auto object-contain"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Signed on: {contract.signedAt ? new Date(contract.signedAt).toLocaleString() : "—"}
            </p>
            <p className="text-xs text-gray-500">
              Signed by: {contract.clientName || "—"}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/contracts" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft size={18} className="text-white/40" />
          </Link>
          <div>
            {editing ? (
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-2xl font-bold text-white bg-transparent border-b border-white/20 focus:outline-none focus:border-accent-blue"
              />
            ) : (
              <h1 className="text-2xl font-bold text-white tracking-tight">{contract.title}</h1>
            )}
            <div className="flex items-center gap-3 mt-1">
              <StatusBadge status={contract.status} />
              <span className="text-xs text-white/30">{contract.language}</span>
              {contract.clientName && (
                <span className="text-xs text-white/30">• {contract.clientName}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {contract.status === "DRAFT" && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 text-white/60 text-sm hover:text-white transition-colors"
            >
              <Edit3 size={14} /> Edit
            </button>
          )}
          {editing && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-colors"
            >
              <Save size={14} /> {saving ? "Saving..." : "Save"}
            </button>
          )}
          {contract.status === "DRAFT" && !editing && (
            <button
              onClick={handleSend}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-blue text-white text-sm font-medium hover:bg-accent-blue/80 transition-colors"
            >
              <Send size={14} /> Send to Client
            </button>
          )}
          {contract.accessToken && (
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 text-white/60 text-sm hover:text-white transition-colors"
            >
              {linkCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {linkCopied ? "Copied!" : "Copy Link"}
            </button>
          )}
          <button
            onClick={() => downloadContractPDF(contract)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 text-white/80 text-sm font-medium hover:bg-white/10 transition-colors border border-white/10"
          >
            <FileDown size={14} /> Download PDF
          </button>
          <button
            onClick={() => window.open(`/admin/contracts/${id}?print=1`, "_blank")}
            title="Clean Print View"
            className="p-2 rounded-xl border border-white/10 text-white/40 hover:text-white transition-colors"
          >
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      {/* Info bar */}
      {contract.sentAt && (
        <div className="flex gap-6 p-4 rounded-xl bg-white/2 border border-white/5 text-xs text-white/30">
          <span>Sent: {new Date(contract.sentAt).toLocaleDateString()}</span>
          {contract.signedAt && (
            <span className="text-emerald-400">Signed: {new Date(contract.signedAt).toLocaleDateString()}</span>
          )}
          {contract.accessToken && (
            <span className="font-mono">Token: {contract.accessToken.slice(0, 12)}…</span>
          )}
        </div>
      )}

      {/* Contract body */}
      {editing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          rows={30}
          className="w-full p-6 rounded-2xl bg-white/4 border border-white/10 text-white text-sm font-mono leading-relaxed focus:outline-none focus:border-accent-blue/50 resize-y"
        />
      ) : (
        <div className="p-8 rounded-2xl border border-white/5 bg-white/2">
          <div
            className="prose prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderContent(contract.content) }}
          />
        </div>
      )}

      {/* Signature display */}
      {contract.signatureData && (
        <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <h3 className="text-sm font-bold text-emerald-400 mb-3">Client Signature</h3>
          <div className="bg-white rounded-xl p-4 inline-block relative w-fit">
            <Image 
              src={contract.signatureData} 
              alt="Signature" 
              width={128} 
              height={64} 
              className="h-16 w-auto object-contain"
            />
          </div>
          <p className="text-xs text-white/30 mt-2">
            Signed by {contract.clientName || "—"} on{" "}
            {contract.signedAt ? new Date(contract.signedAt).toLocaleString() : "—"}
          </p>
        </div>
      )}
    </div>
  );
}
