"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { ArrowLeft, Send, CheckCircle, Clock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminTicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as Id<"tickets">;

  const ticket = useQuery(api.tickets.getById, { id: ticketId });
  const addReply = useMutation(api.tickets.addReply);
  const updateStatus = useMutation(api.tickets.updateStatus);

  const [replyContent, setReplyContent] = useState("");
  const [saving, setSaving] = useState(false);

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    setSaving(true);
    try {
      await addReply({ ticketId, content: replyContent, role: "admin" });
      setReplyContent("");
      // If the ticket was OPEN, move it to IN_PROGRESS automatically when admin replies
      if (ticket?.status === "OPEN") {
        await updateStatus({ id: ticketId, status: "IN_PROGRESS" });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setSaving(true);
    try {
      await updateStatus({ id: ticketId, status: newStatus });
    } finally {
      setSaving(false);
    }
  };

  if (!ticket) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div className="h-6 w-24 bg-white/5 rounded animate-pulse" />
        <div className="h-40 bg-white/5 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.push("/admin/tickets")} 
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Tickets
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStatusChange("IN_PROGRESS")}
            disabled={saving || ticket.status === "IN_PROGRESS"}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              ticket.status === "IN_PROGRESS" 
                ? "bg-blue-500/20 text-blue-400" 
                : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Clock size={14} /> Mark In Progress
          </button>
          <button
            onClick={() => handleStatusChange("RESOLVED")}
            disabled={saving || ticket.status === "RESOLVED"}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              ticket.status === "RESOLVED" 
                ? "bg-emerald-500/20 text-emerald-400" 
                : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
            }`}
          >
            <CheckCircle size={14} /> Resolve Ticket
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white tracking-tight">{ticket.subject}</h1>
            <StatusBadge status={ticket.status} />
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl border border-white/5 bg-white/2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3">
                <StatusBadge status={ticket.priority} />
              </div>
              <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold mb-3">Initial Request</p>
              <p className="text-white/80 leading-relaxed">{ticket.message}</p>
            </div>
            {ticket.replies?.map((reply: { _id: string; role: string; content: string }) => (
              <div
                key={reply._id}
                className={`p-6 rounded-2xl border ${
                  reply.role === "admin"
                    ? "border-blue-500/20 bg-blue-500/5 ml-12"
                    : "border-white/5 bg-white/2 mr-12"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                    {reply.role === "admin" ? "Support Team" : ticket.user?.name || "Client"}
                  </p>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{reply.content}</p>
              </div>
            ))}
          </div>

          {ticket.status !== "RESOLVED" && (
            <div className="pt-4 border-t border-white/5">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-white/20 transition-all">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Type your reply to the client..."
                  rows={4}
                  className="w-full bg-transparent border-none outline-none py-3 px-4 text-sm text-white resize-none"
                />
                <div className="flex items-center justify-between p-2 border-t border-white/5">
                  <p className="text-[10px] text-white/20">Client will be notified via portal</p>
                  <button
                    onClick={handleReply}
                    disabled={!replyContent.trim() || saving}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-accent-blue text-white text-sm font-medium hover:bg-accent-purple transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
                  >
                    <span>Send Reply</span>
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-white/5 bg-white/1">
            <h3 className="text-sm font-bold text-white mb-4">Client Information</h3>
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Name</span>
                <span className="text-sm text-white/80">{ticket.user?.name || "N/A"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Email</span>
                <span className="text-sm text-white/80 font-mono">{ticket.user?.email || "N/A"}</span>
              </div>
              <div className="pt-4 border-t border-white/5">
                 <Link 
                  href={`/admin/users?email=${ticket.user?.email}`}
                  className="text-xs text-accent-blue hover:underline"
                >
                  View Client Profile
                </Link>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/5 bg-white/1">
            <h3 className="text-sm font-bold text-white mb-4">Ticket Details</h3>
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Priority</span>
                <div className="mt-1"><StatusBadge status={ticket.priority} /></div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Created</span>
                <span className="text-xs text-white/40">
                  {new Date(ticket._creationTime).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
