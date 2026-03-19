"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { 
  Inbox, 
  Send, 
  FileText, 
  ShieldAlert, 
  Trash2, 
  Search, 
  MoreVertical, 
  Reply, 
  Forward, 
  Inbox,
  Send,
  FileText,
  ShieldAlert
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import EmailComposer from "./EmailComposer";
import { Doc, Id } from "@convex/_generated/dataModel";

const FOLDERS = [
  { id: "INBOX", label: "Inbox", icon: Inbox },
  { id: "SENT", label: "Sent", icon: Send },
  { id: "DRAFTS", label: "Drafts", icon: FileText },
  { id: "SPAM", label: "Spam", icon: ShieldAlert },
  { id: "TRASH", label: "Trash", icon: Trash2 },
];

export default function EmailInbox() {
  const [activeFolder, setActiveFolder] = useState("INBOX");
  const [selectedEmailId, setSelectedEmailId] = useState<Id<"emails"> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<{ to: string; subject: string; body: string } | undefined>(undefined);

  const emails = useQuery(api.emails.listByFolder, { folder: activeFolder }) || [];
  const unreadCounts = useQuery(api.emails.getCounts) || {};
  
  const updateStatus = useMutation(api.emails.updateStatus);
  const moveFolder = useMutation(api.emails.moveFolder);
  const removeEmail = useMutation(api.emails.remove);

  const selectedEmail = emails.find(e => e._id === selectedEmailId);

  const handleSelectEmail = (email: Doc<"emails">) => {
    setSelectedEmailId(email._id);
    if (email.status === "UNREAD") {
      updateStatus({ id: email._id, status: "READ" });
    }
  };

  const handleReply = () => {
    if (selectedEmail) {
      setReplyTo({
        to: selectedEmail.from,
        subject: selectedEmail.subject,
        body: `\n\n--- Original Message ---\nFrom: ${selectedEmail.from}\nSent: ${selectedEmail.sentAt}\n\n${selectedEmail.body}`
      });
      setIsComposerOpen(true);
    }
  };

  const handleCompose = () => {
    setReplyTo(undefined);
    setIsComposerOpen(true);
  };

  const handleMove = (folder: string) => {
    if (selectedEmailId) {
      moveFolder({ id: selectedEmailId, folder });
      setSelectedEmailId(null);
    }
  };

  const filteredEmails = emails.filter((e: Doc<"emails">) => 
    e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.from.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-120px)] bg-neutral-950/50 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-xl">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/5 flex flex-col">
        <div className="p-6">
          <button 
            className="w-full py-3 px-4 rounded-xl bg-accent-blue text-white text-sm font-semibold hover:bg-accent-blue/80 transition-all shadow-lg shadow-accent-blue/20"
            onClick={handleCompose}
          >
            Compose
          </button>
        </div>
        
        <nav className="flex-1 px-3 space-y-1">
          {FOLDERS.map((folder) => {
            const Icon = folder.icon;
            const count = unreadCounts[folder.id] || 0;
            const isActive = activeFolder === folder.id;
            
            return (
              <button
                key={folder.id}
                onClick={() => {
                  setActiveFolder(folder.id);
                  setSelectedEmailId(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-white/40 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? "text-accent-blue" : ""} />
                  <span className="text-sm font-medium">{folder.label}</span>
                </div>
                {count > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-accent-blue/20 text-accent-blue text-[10px] font-bold">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* List */}
      <div className="w-96 border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
            <input 
              type="text"
              placeholder="Search mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white/20 space-y-2">
              <Inbox size={32} />
              <p className="text-xs">No emails in {activeFolder.toLowerCase()}</p>
            </div>
          ) : (
            filteredEmails.map((email) => (
              <button
                key={email._id}
                onClick={() => handleSelectEmail(email)}
                className={`w-full p-4 text-left border-b border-white/2 transition-all hover:bg-white/2 ${
                  selectedEmailId === email._id ? "bg-white/5" : ""
                } ${email.status === "UNREAD" ? "border-l-2 border-l-accent-blue" : ""}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs truncate ${email.status === "UNREAD" ? "text-white font-bold" : "text-white/60 font-medium"}`}>
                    {email.from}
                  </span>
                  <span className="text-[10px] text-white/30 whitespace-nowrap">
                    {format(new Date(email.sentAt), "MMM d")}
                  </span>
                </div>
                <h4 className={`text-xs truncate mb-1 ${email.status === "UNREAD" ? "text-white/90 font-semibold" : "text-white/40"}`}>
                  {email.subject}
                </h4>
                <p className="text-[11px] text-white/20 line-clamp-2 leading-relaxed">
                  {email.body.replace(/<[^>]*>/g, '')}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col bg-neutral-950/20">
        <AnimatePresence mode="wait">
          {selectedEmail ? (
            <motion.div 
              key={selectedEmail._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Toolbar */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-1">
                  <button onClick={() => handleMove("TRASH")} className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Delete">
                    <Trash2 size={16} />
                  </button>
                  <button onClick={() => handleMove("SPAM")} className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Spam">
                    <ShieldAlert size={16} />
                  </button>
                  <div className="w-px h-4 bg-white/5 mx-2" />
                  <button onClick={handleReply} className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Reply">
                    <Reply size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/20">
                    {selectedEmail.folder}
                  </span>
                  <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Message Header */}
              <div className="p-8 border-b border-white/5">
                <h2 className="text-xl font-bold text-white mb-6 leading-tight">{selectedEmail.subject}</h2>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue font-bold text-sm">
                      {selectedEmail.from.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{selectedEmail.from}</span>
                        <span className="text-[10px] text-white/20 font-medium">&lt;{selectedEmail.from}&gt;</span>
                      </div>
                      <p className="text-[11px] text-white/40">to {selectedEmail.to}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/40 mb-1">{format(new Date(selectedEmail.sentAt), "MMMM d, yyyy")}</p>
                    <p className="text-[10px] text-white/20">{format(new Date(selectedEmail.sentAt), "h:mm aa")}</p>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-white/1">
                <div 
                  className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                />
              </div>

              {/* Quick Action Footer */}
              <div className="p-6 bg-black/20 border-t border-white/5">
                <div className="flex gap-3">
                  <button 
                    onClick={handleReply}
                    className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:bg-white/5 hover:text-white flex items-center justify-center gap-2 transition-all"
                  >
                    <Reply size={14} /> Reply
                  </button>
                  <button className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:bg-white/5 hover:text-white flex items-center justify-center gap-2 transition-all">
                    <Forward size={14} /> Forward
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-white/10 space-y-4">
              <div className="p-6 rounded-full bg-white/2 border border-white/5">
                <Inbox size={48} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Select an email to read</p>
                <p className="text-[11px] opacity-50 mt-1">Nothing selected yet</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <EmailComposer 
        isOpen={isComposerOpen} 
        onClose={() => setIsComposerOpen(false)} 
        replyTo={replyTo}
      />
    </div>
  );
}
