"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { CONTRACT_TEMPLATES, fillTemplate } from "@/lib/contractTemplates";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const TEMPLATE_VARIABLES = [
  { key: "DEVELOPER_NAME", label: "Developer Name", placeholder: "LOrdEnRYQuE" },
  { key: "DEVELOPER_ADDRESS", label: "Developer Address", placeholder: "Your address" },
  { key: "CLIENT_NAME", label: "Client Name", placeholder: "Client full name" },
  { key: "CLIENT_EMAIL", label: "Client Email", placeholder: "client@example.com" },
  { key: "CLIENT_ADDRESS", label: "Client Address", placeholder: "Client address" },
  { key: "PROJECT_NAME", label: "Project Name", placeholder: "e.g. E-Commerce Platform" },
  { key: "START_DATE", label: "Start Date", placeholder: "DD.MM.YYYY" },
  { key: "END_DATE", label: "End Date", placeholder: "DD.MM.YYYY" },
  { key: "TOTAL_AMOUNT", label: "Total Amount", placeholder: "€5,000" },
  { key: "PAYMENT_SCHEDULE", label: "Payment Schedule", placeholder: "e.g. 50% upfront, 50% on delivery" },
  { key: "DATE", label: "Contract Date", placeholder: new Date().toLocaleDateString("de-DE") },
];

export default function NewContractPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const leadId = searchParams.get("leadId") as Id<"leads"> | null;
  const userIdFromUrl = searchParams.get("userId") as Id<"users"> | null;

  const createContract = useMutation(api.contracts.create);
  const users = useQuery(api.users.listUsers);
  const lead = useQuery(api.leads.getById, leadId ? { id: leadId } : "skip");

  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [language, setLanguage] = useState<"EN" | "DE">("EN");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [clientId, setClientId] = useState("");
  const [variables, setVariables] = useState<Record<string, string>>(
    Object.fromEntries(TEMPLATE_VARIABLES.map((v) => [v.key, ""]))
  );
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  // Auto-fill effect when lead data arrives
  useEffect(() => {
    if (lead) {
      setClientId(userIdFromUrl || "");
      
      // Auto-select first template if none selected
      if (!selectedTemplate && CONTRACT_TEMPLATES.length > 0) {
        handleTemplateSelect(CONTRACT_TEMPLATES[0].id);
      }

      setVariables(prev => ({
        ...prev,
        CLIENT_NAME: lead.name || "",
        CLIENT_EMAIL: lead.email || "",
        PROJECT_NAME: lead.concept || "",
        DATE: new Date().toLocaleDateString("de-DE"),
      }));
    }
  }, [lead, userIdFromUrl, selectedTemplate]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const tmpl = CONTRACT_TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      setTitle(tmpl.title);
      setLanguage(tmpl.language);
      setContent(tmpl.content);
    }
  };

  const handleVariableChange = (key: string, value: string) => {
    const newVars = { ...variables, [key]: value };
    setVariables(newVars);
    // Re-fill template
    const tmpl = CONTRACT_TEMPLATES.find((t) => t.id === selectedTemplate);
    if (tmpl) {
      setContent(fillTemplate(tmpl.content, newVars));
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      const selectedUser = users?.find((u) => u._id === clientId);
      const contractId = await createContract({
        title,
        language,
        content,
        ...(clientId ? { clientId: clientId as Id<"users"> } : {}),
        clientName: selectedUser?.name || variables.CLIENT_NAME || undefined,
        clientEmail: selectedUser?.email || undefined,
      });

      // Trigger Email Notification
      if (selectedUser?.email || variables.CLIENT_EMAIL) {
        await fetch("/api/emails/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "contract",
            data: {
              clientName: selectedUser?.name || variables.CLIENT_NAME,
              clientEmail: selectedUser?.email || variables.CLIENT_EMAIL,
              projectTitle: variables.PROJECT_NAME || title,
              contractId,
            }
          })
        });
      }

      router.push("/admin/contracts");
    } finally {
      setSaving(false);
    }
  };

  const previewContent = content || "Select a template or write your contract...";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/contracts" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
          <ArrowLeft size={18} className="text-white/40" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">New Contract</h1>
          <p className="text-sm text-white/40 mt-1">Create from template or start blank</p>
        </div>
      </div>

      {/* Template selector + language */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Template</label>
          <select
            value={selectedTemplate}
            onChange={(e) => handleTemplateSelect(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/4 border border-white/10 text-white text-sm focus:outline-none focus:border-accent-blue/50"
          >
            <option value="">Blank Contract</option>
            {CONTRACT_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Language</label>
          <div className="flex gap-2">
            {(["EN", "DE"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                  language === lang
                    ? "bg-accent-blue text-white"
                    : "bg-white/4 border border-white/10 text-white/40 hover:text-white"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Assign Client</label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/4 border border-white/10 text-white text-sm focus:outline-none focus:border-accent-blue/50"
          >
            <option value="">No client assigned</option>
            {users?.map((u) => (
              <option key={u._id} value={u._id}>{u.name || u.email}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Contract Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Software Development Agreement"
          className="w-full p-3 rounded-xl bg-white/4 border border-white/10 text-white text-sm focus:outline-none focus:border-accent-blue/50"
        />
      </div>

      {/* Variables */}
      {selectedTemplate && (
        <div className="p-5 rounded-2xl border border-white/5 bg-white/2">
          <h3 className="text-sm font-bold text-white mb-4">Fill Template Variables</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TEMPLATE_VARIABLES.map((v) => (
              <div key={v.key}>
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1 block">{v.label}</label>
                <input
                  value={variables[v.key]}
                  onChange={(e) => handleVariableChange(v.key, e.target.value)}
                  placeholder={v.placeholder}
                  className="w-full p-2.5 rounded-lg bg-white/4 border border-white/10 text-white text-xs focus:outline-none focus:border-accent-blue/50"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editor / Preview toggle */}
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Contract Body</label>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
        >
          {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
          {showPreview ? "Edit" : "Preview"}
        </button>
      </div>

      {showPreview ? (
        <div className="p-8 rounded-2xl border border-white/5 bg-white/2 prose prose-invert prose-sm max-w-none min-h-[400px]">
          <div
            dangerouslySetInnerHTML={{
              __html: previewContent
                .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold text-white mb-4">$1</h1>')
                .replace(/^## (.*$)/gm, '<h2 class="text-lg font-bold text-white mt-6 mb-3">$1</h2>')
                .replace(/^### (.*$)/gm, '<h3 class="text-base font-bold text-white mt-4 mb-2">$1</h3>')
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                .replace(/^- (.*$)/gm, '<li class="text-white/60 ml-4">$1</li>')
                .replace(/^---$/gm, '<hr class="border-white/10 my-4"/>')
                .replace(/\n\n/g, '<br/><br/>')
                .replace(/\n/g, '<br/>'),
            }}
          />
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          className="w-full p-4 rounded-2xl bg-white/4 border border-white/10 text-white text-sm font-mono leading-relaxed focus:outline-none focus:border-accent-blue/50 resize-y min-h-[400px]"
          placeholder="Write your contract in markdown format..."
        />
      )}

      {/* Save */}
      <div className="flex justify-end gap-3">
        <Link
          href="/admin/contracts"
          className="px-5 py-2.5 rounded-xl border border-white/10 text-white/40 text-sm hover:text-white transition-colors"
        >
          Cancel
        </Link>
        <button
          onClick={handleSave}
          disabled={saving || !title.trim() || !content.trim()}
          className="px-6 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-medium hover:bg-accent-blue/80 transition-colors disabled:opacity-40"
        >
          {saving ? "Saving..." : "Create Contract"}
        </button>
      </div>
    </div>
  );
}
