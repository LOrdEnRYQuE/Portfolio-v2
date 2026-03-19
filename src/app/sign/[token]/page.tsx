"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import SignaturePad from "@/components/dashboard/SignaturePad";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { CheckCircle, FileDown, Shield } from "lucide-react";
import Image from "next/image";

export default function PublicSignPage() {
  const { token } = useParams<{ token: string }>();
  const contract = useQuery(api.contracts.getByToken, { token });
  const markViewed = useMutation(api.contracts.markViewed);
  const signContract = useMutation(api.contracts.sign);

  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    if (contract && contract.status === "SENT") {
      markViewed({ id: contract._id });
    }
    if (contract?.clientName) {
      setClientName(contract.clientName);
    }
  }, [contract, markViewed]);

  if (contract === undefined) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (contract === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <Shield size={48} className="text-white/10 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Contract Not Found</h1>
          <p className="text-sm text-white/40">This signing link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  const handleSign = async () => {
    if (!signatureData || !agreed) return;
    setSigning(true);
    try {
      await signContract({
        id: contract._id,
        signatureData,
        clientName: clientName || undefined,
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
    <div className="min-h-screen bg-[#0a0a0f] px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">{contract.title}</h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <StatusBadge status={contract.status} />
            <span className="text-xs text-white/30">{contract.language}</span>
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
        {!isSigned && (
          <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 space-y-5">
            <h3 className="text-lg font-bold text-white">Sign This Contract</h3>

            <div>
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">
                Your Full Name
              </label>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter your full legal name"
                className="w-full p-3 rounded-xl bg-white/4 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
              />
            </div>

            <SignaturePad onSignature={setSignatureData} />

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 accent-blue-500"
              />
              <span className="text-sm text-white/60">
                I, <strong className="text-white">{clientName || "___"}</strong>, have read and agree
                to all terms and conditions outlined in this contract. I confirm that I am authorized
                to enter into this agreement and that this digital signature constitutes my legal
                binding signature.
              </span>
            </label>

            <button
              onClick={handleSign}
              disabled={!signatureData || !agreed || !clientName.trim() || signing}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-500/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCircle size={16} />
              {signing ? "Processing..." : "Sign & Accept Contract"}
            </button>
          </div>
        )}

        {/* Signed confirmation */}
        {isSigned && (
          <div className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center">
            <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-emerald-400 mb-2">Contract Successfully Signed</h3>
            <p className="text-sm text-white/40 mb-6">
              Thank you for signing. Both parties will receive a copy of the signed agreement.
            </p>
            {contract.signatureData && (
              <div className="bg-white rounded-xl p-4 inline-block mb-4 relative w-fit mx-auto">
                <Image 
                  src={contract.signatureData} 
                  alt="Your signature" 
                  width={128} 
                  height={64} 
                  className="h-16 w-auto object-contain"
                />
              </div>
            )}
            <div>
              <button
                onClick={() => window.open(`/admin/contracts/${contract._id}?print=1`, "_blank")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:text-white transition-colors mx-auto"
              >
                <FileDown size={14} /> Download Signed Contract (PDF)
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-white/20 pt-4">
          <p>This is a legally binding digital contract. Your signature and IP address are recorded.</p>
        </div>
      </div>
    </div>
  );
}
