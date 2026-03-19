"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { ArrowLeft, Receipt } from "lucide-react";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { useRouter, useSearchParams } from "next/navigation";
import InvoiceWizard, { WizardData } from "@/components/admin/InvoiceWizard";

export default function NewInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const leadId = searchParams.get("leadId") as Id<"leads"> | null;
  const userIdFromUrl = searchParams.get("userId") as Id<"users"> | null;

  const users = useQuery(api.users.listUsers);
  const lead = useQuery(api.leads.getById, leadId ? { id: leadId } : "skip");
  const createInvoice = useMutation(api.invoices.create);
  
  const clients = users?.filter(u => u.role === "CLIENT") || [];
  const [saving, setSaving] = useState(false);

  // Pre-fill logic
  const initialData = lead ? {
    userId: userIdFromUrl || "",
    projectName: lead.concept || "",
    client: {
      name: lead.name || "",
      contact: lead.email || "",
    },
    features: {
      core: (() => {
        try {
          return JSON.parse(lead.features || "[]");
        } catch { return []; }
      })(),
      services: [],
      qa: [],
      postLaunch: [],
    }
  } : undefined;

  const handleSave = async (data: WizardData & { financials: { total: string; subtotal: string } }) => {
    if (!data.userId || !data.financials.total || !data.metadata.dueDate) return;

    setSaving(true);
    try {
      const invoiceId = await createInvoice({
        userId: data.userId,
        amount: parseFloat(data.financials.total),
        description: `Project: ${data.projectName}`,
        dueDate: data.metadata.dueDate,
        number: data.metadata.number,
        currency: data.financials.currency || "EUR",
        status: "SENT",
        projectName: data.projectName,
        details: JSON.stringify(data),
      });

      // Trigger Email Notification
      const selectedUser = users?.find(u => u._id === data.userId);
      if (selectedUser?.email) {
        await fetch("/api/emails/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "invoice",
            data: {
              clientName: selectedUser.name || data.client.name,
              clientEmail: selectedUser.email,
              invoiceNumber: data.metadata.number,
              projectTitle: data.projectName,
              amount: `${data.financials.total} ${data.financials.currency || "EUR"}`,
              dueDate: data.metadata.dueDate,
              invoiceId,
            }
          })
        });
      }

      router.push("/admin/invoices");
    } catch (error) {
      console.error("Failed to create invoice:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.push("/admin/invoices")} 
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Invoices
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Receipt size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Developer Invoice Wizard</h1>
          <p className="text-white/40">Generate professional, itemized billing for technical projects</p>
        </div>
      </div>

      <InvoiceWizard 
        key={lead?._id || "new"}
        clients={clients} 
        onSave={handleSave} 
        saving={saving}
        initialData={initialData}
      />
    </div>
  );
}
