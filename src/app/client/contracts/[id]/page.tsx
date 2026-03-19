"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import Image from "next/image";
import StatusBadge from "@/components/dashboard/StatusBadge";
import SignaturePad from "@/components/dashboard/SignaturePad";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, FileDown, CheckCircle, ExternalLink } from "lucide-react";
import { downloadContractPDF } from "@/lib/pdf";

export default function ClientContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const contract = useQuery(api.contracts.getById, { id: id as Id<"contracts"> });
  const markViewed = useMutation(api.contracts.markViewed);
  const signContract = useMutation(api.contracts.sign);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    if (contract && contract.status === "SENT") {
      markViewed({ id: id as Id<"contracts"> });
    }
  }, [contract, id, markViewed]);

  if (!contract) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSign = async () => {
    if (!signatureData || !agreed) return;
    setSigning(true);
    try {
      await signContract({
        id: id as Id<"contracts">,
        signatureData,
      });
      setSigned(true);
    } finally {
      setSigning(false);
    }
  };

  const isSigned = contract.status === "SIGNED" || signed;

  const renderContent = (text: string) => {
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold text-white mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-lg font-bold text-white mt-6 mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-base font-bold text-white mt-4 mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/^- (.*$)/gm, '<li class="text-white/60 ml-4">$1</li>')
      .replace(/^---$/gm, '<hr class="border-white/10 my-4"/>')
      .replace(/\n\n/g, "<br/><br/>")
      .replace(/\n/g, "<br/>");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/client/contracts" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft size={18} className="text-white/40" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{contract.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <StatusBadge status={contract.status} />
              <span className="text-xs text-white/30">{contract.language}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadContractPDF(contract)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-blue text-white text-sm font-medium hover:bg-accent-blue/80 transition-colors"
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

      {/* Contract body */}
      <div className="p-8 rounded-2xl border border-white/5 bg-white/2">
        <div
          className="prose prose-invert prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: renderContent(contract.content) }}
        />
      </div>

      {/* Signing section */}
      {!isSigned && (contract.status === "SENT" || contract.status === "VIEWED") && (
        <div className="p-6 rounded-2xl border border-accent-blue/20 bg-accent-blue/5 space-y-5">
          <h3 className="text-lg font-bold text-white">Sign This Contract</h3>

          <SignaturePad onSignature={setSignatureData} />

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 accent-accent-blue"
            />
            <span className="text-sm text-white/60">
              I have read and agree to the terms and conditions outlined in this contract.
              I confirm that I am authorized to sign this agreement on behalf of the client party.
            </span>
          </label>

          <button
            onClick={handleSign}
            disabled={!signatureData || !agreed || signing}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-500/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCircle size={16} />
            {signing ? "Signing..." : "Sign Contract"}
          </button>
        </div>
      )}

      {/* Signed confirmation */}
      {isSigned && (
        <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle size={20} className="text-emerald-400" />
            <h3 className="text-lg font-bold text-emerald-400">Contract Signed</h3>
          </div>
          {contract.signatureData && (
            <div className="bg-white rounded-xl p-4 inline-block mt-2 relative w-fit">
              <Image 
                src={contract.signatureData} 
                alt="Your signature" 
                width={128} 
                height={64} 
                className="h-16 w-auto object-contain"
              />
            </div>
          )}
          <p className="text-xs text-white/30 mt-3">
            Signed on: {contract.signedAt ? new Date(contract.signedAt).toLocaleString() : "Just now"}
          </p>
        </div>
      )}
    </div>
  );
}
