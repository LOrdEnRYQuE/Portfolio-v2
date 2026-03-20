"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Bell, Check, X, Info, AlertTriangle, CheckCircle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

export default function NotificationBell() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  
  // We need the internal user ID for the query
  const user = useQuery(api.users.getUserByEmail, { email: session?.user?.email || "" });
  const unreadCount = useQuery(api.notifications.getUnreadCount, { userId: user?._id as any }) || 0;
  const notifications = useQuery(api.notifications.listAll, { userId: user?._id as any }) || [];
  
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  const getIcon = (type: string) => {
    switch (type) {
      case "CRITICAL": return <AlertTriangle size={16} className="text-red-400" />;
      case "WARNING": return <Zap size={16} className="text-amber-400" />;
      case "SUCCESS": return <CheckCircle size={16} className="text-emerald-400" />;
      default: return <Info size={16} className="text-blue-400" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all relative group"
      >
        <Bell size={18} className="text-white/60 group-hover:text-white transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent-blue rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-80 bg-[#0A0D11] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/2">
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Platform Alerts</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={() => markAllAsRead({ userId: user?._id as any })}
                    className="text-[9px] font-bold text-accent-blue hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-10 text-center space-y-3">
                    <Bell size={24} className="mx-auto text-white/10" />
                    <p className="text-xs text-white/30 font-medium italic">Everything is synchronized</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n._id}
                      className={`p-5 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors group relative ${n.status === "UNREAD" ? "bg-white/1" : "opacity-60"}`}
                    >
                      <div className="flex gap-4">
                        <div className="shrink-0 p-2 rounded-lg bg-white/5 border border-white/10 h-fit">
                          {getIcon(n.type)}
                        </div>
                        <div className="space-y-1 pr-4">
                          <p className="text-[11px] font-black text-white uppercase tracking-tight">{n.title}</p>
                          <p className="text-xs text-white/40 leading-relaxed">{n.message}</p>
                        </div>
                      </div>
                      {n.status === "UNREAD" && (
                        <button 
                          onClick={() => markAsRead({ id: n._id })}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/5 hover:bg-accent-blue text-white/40 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Check size={12} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-white/5 bg-white/1 text-center">
                <button className="text-[9px] font-bold text-white/20 uppercase tracking-widest hover:text-white/40 transition-colors">
                  System Diagnostics →
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
