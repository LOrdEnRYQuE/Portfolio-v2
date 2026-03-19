"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { ArrowLeft, CheckCircle2, Trash2, Printer, Clock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function AdminInvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as Id<"invoices">;

  const invoice = useQuery(api.invoices.getById, { id: invoiceId });
  const updateInvoice = useMutation(api.invoices.update);
  const removeInvoice = useMutation(api.invoices.remove);

  const handleMarkPaid = async () => {
    await updateInvoice({ id: invoiceId, status: "PAID" });
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      await removeInvoice({ id: invoiceId });
      router.push("/admin/invoices");
    }
  };

  if (!invoice) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div className="h-6 w-24 bg-white/5 rounded animate-pulse" />
        <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.push("/admin/invoices")} 
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Invoices
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title="Print Invoice"
          >
            <Printer size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            title="Delete Invoice"
          >
            <Trash2 size={18} />
          </button>
          {invoice.status !== "PAID" && (
            <button
              onClick={handleMarkPaid}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 size={16} /> Mark as Paid
            </button>
          )}
        </div>
      </div>

      <div className="bg-white/2 border border-white/5 rounded-3xl p-8 md:p-12 space-y-12 print:bg-white print:text-black print:border-none print:p-0">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6 print:hidden">
              <span className="text-2xl font-black text-white tracking-tighter">ARiS</span>
              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest">Studio</span>
            </div>
            <h1 className="text-4xl font-bold text-white print:text-black">Invoice</h1>
            <p className="text-white/40 print:text-black/60 font-mono mt-1">{invoice.number}</p>
          </div>
          
          <div className="text-right flex flex-col items-end">
            <StatusBadge status={invoice.status} />
            <div className="mt-4 space-y-1 text-sm text-white/40 print:text-black/60">
              <p>Issued: {new Date(invoice._creationTime).toLocaleDateString()}</p>
              <p className="font-bold text-white print:text-black">Due: {invoice.dueDate}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/5 print:border-black/10">
          <div>
            <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest mb-4 print:text-black/40">From</p>
            <div className="space-y-1 text-sm text-white/80 print:text-black">
              <p className="font-bold text-white print:text-black">ARiS Studio</p>
              <p>contact@aris.studio</p>
              <p>Berlin, Germany</p>
            </div>
          </div>
          <div className="md:text-right">
            <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest mb-4 print:text-black/40">Bill To</p>
            <div className="space-y-1 text-sm text-white/80 print:text-black">
              <p className="font-bold text-white print:text-black">{invoice.user?.name || "Client"}</p>
              <p className="text-xs text-white/40">{invoice.user?.email}</p>
            </div>
          </div>
        </div>

        <div className="pt-12">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 print:border-black/10">
                <th className="pb-4 text-[10px] text-white/20 uppercase font-bold tracking-widest print:text-black/40">Description</th>
                <th className="pb-4 text-right text-[10px] text-white/20 uppercase font-bold tracking-widest print:text-black/40">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/2 print:divide-black/5">
              <tr>
                <td className="py-6">
                  <p className="text-white font-medium print:text-black">{invoice.description || "Services Rendered"}</p>
                </td>
                <td className="py-6 text-right">
                  <p className="text-white font-bold print:text-black">€{invoice.amount.toLocaleString()}</p>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-white/5 print:border-black/20">
                <td className="pt-8 text-right pr-8">
                  <p className="text-white/40 uppercase text-[10px] font-bold tracking-widest print:text-black/60">Total Amount</p>
                </td>
                <td className="pt-8 text-right">
                  <p className="text-3xl font-bold text-white print:text-black">€{invoice.amount.toLocaleString()}</p>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="pt-12 border-t border-white/5 print:border-black/10">
          <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest mb-4 print:text-black/40">Payment Status</p>
          <div className="p-4 rounded-xl bg-white/2 border border-white/5 print:bg-gray-50 print:border-black/10">
            {invoice.status === "PAID" ? (
              <p className="text-sm text-emerald-400 font-medium flex items-center gap-2">
                <CheckCircle2 size={16} /> This invoice was paid on {new Date().toLocaleDateString()}
              </p>
            ) : (
              <p className="text-sm text-amber-400 font-medium flex items-center gap-2">
                <Clock size={16} /> Awaiting payment via bank transfer or stripe
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
