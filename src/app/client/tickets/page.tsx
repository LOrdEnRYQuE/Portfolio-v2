"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Plus, Send, ArrowLeft } from "lucide-react";

export default function ClientTicketsPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const user = useQuery(api.users.getUserByEmail, userEmail ? { email: userEmail } : "skip");
  const tickets = useQuery(api.tickets.listByUser, user ? { userId: user._id } : "skip");
  const createTicket = useMutation(api.tickets.create);
  const addReply = useMutation(api.tickets.addReply);

  const [showForm, setShowForm] = useState(false);
  const [viewTicketId, setViewTicketId] = useState<Id<"tickets"> | null>(null);
  const [form, setForm] = useState({ subject: "", message: "", priority: "MEDIUM" });
  const [replyContent, setReplyContent] = useState("");
  const [saving, setSaving] = useState(false);

  const ticketDetail = useQuery(api.tickets.getById, viewTicketId ? { id: viewTicketId } : "skip");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await createTicket({ ...form, userId: user._id });
      setShowForm(false);
      setForm({ subject: "", message: "", priority: "MEDIUM" });
    } finally {
      setSaving(false);
    }
  };

  const handleReply = async () => {
    if (!viewTicketId || !replyContent.trim()) return;
    setSaving(true);
    try {
      await addReply({ ticketId: viewTicketId, content: replyContent, role: "client" });
      setReplyContent("");
    } finally {
      setSaving(false);
    }
  };

  if (viewTicketId && ticketDetail) {
    return (
      <div className="space-y-6 max-w-2xl">
        <button onClick={() => setViewTicketId(null)} className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Tickets
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">{ticketDetail.subject}</h1>
          <StatusBadge status={ticketDetail.status} />
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-white/5 bg-white/2">
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Original Message</p>
            <p className="text-sm text-white/70">{ticketDetail.message}</p>
          </div>

          {ticketDetail.replies?.map((reply: { _id: string; content: string; role: string }) => (
            <div
              key={reply._id}
              className={`p-5 rounded-xl border ${
                reply.role === "admin"
                  ? "border-blue-500/20 bg-blue-500/5 ml-8"
                  : "border-white/5 bg-white/2 mr-8"
              }`}
            >
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">
                {reply.role === "admin" ? "Team Response" : "You"}
              </p>
              <p className="text-sm text-white/70">{reply.content}</p>
            </div>
          ))}
        </div>

        {ticketDetail.status !== "RESOLVED" && (
          <div className="flex gap-3">
            <input
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Type your reply..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-white/20"
              onKeyDown={(e) => { if (e.key === "Enter") handleReply(); }}
            />
            <button
              onClick={handleReply}
              disabled={!replyContent.trim() || saving}
              className="px-5 py-3 rounded-xl bg-accent-blue text-white text-sm font-medium hover:bg-accent-purple transition-colors disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Support Tickets</h1>
          <p className="text-sm text-white/40 mt-1">{tickets?.length || 0} tickets</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-medium hover:bg-accent-purple transition-colors"
        >
          <Plus size={16} /> New Ticket
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="p-6 rounded-2xl border border-white/5 bg-white/2 space-y-4">
          <input
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="Subject"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none"
            required
          />
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Describe your issue..."
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none resize-y"
            required
          />
          <div className="flex items-center justify-between">
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
            >
              <option value="LOW">Low Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="HIGH">High Priority</option>
            </select>
            <button type="submit" disabled={saving} className="px-6 py-3 rounded-xl bg-accent-blue text-white text-sm font-medium hover:bg-accent-purple transition-colors disabled:opacity-50">
              {saving ? "Submitting..." : "Submit Ticket"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {!tickets || tickets.length === 0 ? (
          <div className="p-12 rounded-2xl border border-white/5 bg-white/2 text-center">
            <p className="text-white/40">No tickets yet</p>
            <p className="text-xs text-white/20 mt-1">Create one if you need help</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <button
              key={ticket._id}
              onClick={() => setViewTicketId(ticket._id)}
              className="w-full text-left p-5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 transition-colors flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-sm font-medium text-white">{ticket.subject}</p>
                <p className="text-xs text-white/30 mt-1 line-clamp-1">{ticket.message}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={ticket.priority} />
                <StatusBadge status={ticket.status} />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
