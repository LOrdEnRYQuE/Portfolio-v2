"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { X, Send, Paperclip, Image as ImageIcon, Smile, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EmailComposerProps {
  isOpen: boolean;
  onClose: () => void;
  replyTo?: {
    to: string;
    subject: string;
    body: string;
  };
}

export default function EmailComposer({ isOpen, onClose, replyTo }: EmailComposerProps) {
  const [to, setTo] = useState(replyTo?.to || "");
  const [subject, setSubject] = useState(replyTo ? `Re: ${replyTo.subject}` : "");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  const createEmail = useMutation(api.emails.create);

  const handleSend = async () => {
    if (!to || !subject || !body) return;
    
    setIsSending(true);
    try {
      await createEmail({
        from: "admin@sync.dev", // Default admin sender
        to,
        subject,
        body: body.replace(/\n/g, '<br/>'),
        folder: "SENT",
        status: "READ",
      });
      onClose();
      setTo("");
      setSubject("");
      setBody("");
    } catch (error) {
      console.error("Failed to send email:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 right-10 w-[500px] bg-neutral-900 border border-white/10 rounded-t-2xl shadow-2xl z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-black/40 p-4 flex items-center justify-between border-b border-white/5">
            <h3 className="text-sm font-semibold text-white">New Message</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Fields */}
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <span className="text-xs font-medium text-white/20 w-8">To</span>
              <input 
                type="text" 
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
                className="flex-1 bg-transparent border-none text-sm text-white focus:ring-0 placeholder:text-white/10"
              />
            </div>
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <span className="text-xs font-medium text-white/20 w-8">Sub</span>
              <input 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="flex-1 bg-transparent border-none text-sm text-white focus:ring-0 placeholder:text-white/10"
              />
            </div>

            <textarea 
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type your message here..."
              className="w-full h-64 bg-transparent border-none text-sm text-white focus:ring-0 placeholder:text-white/10 resize-none custom-scrollbar"
            />
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-black/20 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                <Paperclip size={18} />
              </button>
              <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                <ImageIcon size={18} />
              </button>
              <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                <Smile size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={onClose}
                className="text-xs font-medium text-white/40 hover:text-white transition-all"
              >
                Discard
              </button>
              <button 
                disabled={isSending}
                onClick={handleSend}
                className="flex items-center gap-2 bg-accent-blue text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-accent-blue/80 disabled:opacity-50 transition-all shadow-lg shadow-accent-blue/10"
              >
                {isSending ? "Sending..." : "Send"}
                {!isSending && <Send size={14} />}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
