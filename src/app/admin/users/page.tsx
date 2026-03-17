"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Search, 
  UserPlus, 
  MoreVertical, 
  Shield,
  Activity,
  User as UserIcon,
  ChevronRight,
  X,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/Button";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

export default function UserFleet() {
  const users = useQuery(api.users.listUsers);
  const createUser = useMutation(api.users.createUser);
  const updateUser = useMutation(api.users.updateUser);
  const removeUser = useMutation(api.users.remove);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CLIENT"
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      // Note: In a real app, you'd hash this on the server or use a more secure method
      // For this migration, we're mimicking the previous behavior
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userFormData),
      });

      if (res.ok) {
        setIsAddUserOpen(false);
        setUserFormData({ name: "", email: "", password: "", role: "CLIENT" });
      } else {
        const data = await res.json();
        setFormError(data.error || "Failed to create node");
      }
    } catch {
      setFormError("Network error: synchronization failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRole = async (id: Id<"users">, newRole: string) => {
    try {
      await updateUser({ id, role: newRole });
      if (selectedUser?._id === id) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
    } catch (e) {
      console.error("Failed to update role", e);
    }
  };

  const handleDeleteUser = async (id: Id<"users">) => {
    if (!confirm("Confirm complete node deauthorization? This cannot be reversed.")) return;

    try {
      await removeUser({ id });
      setSelectedUser(null);
    } catch (e) {
      console.error("Failed to delete user", e);
      alert("Deauthorization failed");
    }
  };

  const filteredUsers = (users || []).filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 sm:p-12 lg:p-16 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-[0.2em]">
            <ShieldCheck size={10} /> Authorized Access Control Active
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">
            User <span className="text-accent underline underline-offset-8">Fleet</span>
          </h1>
          <p className="text-white/40 text-sm max-w-xl leading-relaxed italic border-l-2 border-white/5 pl-4 ml-1">
            Overseeing global authorization levels, user synchronization, and personnel data security.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Locate Personnel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-xs font-bold focus:outline-hidden focus:border-accent/40 focus:bg-white/7 transition-all w-full md:w-64"
            />
          </div>
          <button 
            onClick={() => setIsAddUserOpen(true)}
            className="px-6 py-4 bg-accent text-white rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-accent-glow-sm transition-all"
          >
            <UserPlus size={16} /> Add Node
          </button>
        </div>
      </div>

      <div className="glass-card rounded-[40px] border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 text-center">Identity</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Name / Designation</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Authorization Role</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Commencement</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {!users ? (
                <tr>
                   <td colSpan={5} className="py-20 text-center text-white/20 font-black uppercase tracking-widest text-[10px] animate-pulse">
                      Scanning Personnel Substrate...
                   </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                   <td colSpan={5} className="py-20 text-center text-white/20 font-black uppercase tracking-widest text-[10px]">
                      No personnel nodes detected
                   </td>
                </tr>
              ) : filteredUsers.map((u) => (
                <tr key={u._id} className="group hover:bg-white/1 transition-all cursor-pointer" onClick={() => setSelectedUser(u)}>
                  <td className="px-10 py-6">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover:border-accent/30 group-hover:text-accent transition-all mx-auto">
                      <UserIcon size={18} />
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="space-y-1">
                      <p className="text-sm font-black uppercase tracking-tight group-hover:text-accent transition-colors">{u.name || 'Unknown Identification'}</p>
                      <p className="text-[10px] font-bold text-white/30 lowercase tracking-tighter">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                      u.role === 'ADMIN' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-white/5 border-white/10 text-white/40'
                    }`}>
                      <Shield size={10} /> {u.role}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{format(new Date(u._creationTime), "MMM dd, yyyy")}</p>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="p-2 text-white/10 hover:text-white transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedUser && (
           <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedUser(null)}
           >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card w-full max-w-2xl rounded-[48px] border-white/10 p-12 space-y-10 relative"
                onClick={(e) => e.stopPropagation()}
              >
                 <div className="absolute top-12 right-12 opacity-5">
                    <Activity size={120} />
                 </div>

                 <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-[32px] bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                       <UserIcon size={40} />
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none">{selectedUser.name || 'U_NODE_UNTITLED'}</h2>
                       <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.3em] italic">{selectedUser.email}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-2">
                       <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Authorization Rank</p>
                       <div className="flex items-center gap-3">
                          <p className="text-xl font-black text-accent">{selectedUser.role}</p>
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                       </div>
                    </div>
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-2">
                       <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Operational Since</p>
                       <p className="text-xl font-black">{format(new Date(selectedUser._creationTime), "yyyy.MM.dd")}</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-2">Active Protocols</p>
                    <div className="space-y-3">
                       {['Neural Synchronization (Enabled)', 'Admin Command Access (Level 4)', 'Regional Data Sovereignty (Verified)'].map((p, i) => (
                         <div key={i} className="flex items-center justify-between px-6 py-4 bg-white/2 border border-white/5 rounded-2xl group hover:border-accent/20 transition-all">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">{p}</span>
                            <ChevronRight size={14} className="text-white/10 group-hover:text-accent transition-colors" />
                         </div>
                       ))}
                    </div>
                 </div>

                  <div className="pt-6 flex gap-4">
                    <button 
                      onClick={() => handleUpdateRole(selectedUser._id, selectedUser.role === "ADMIN" ? "CLIENT" : "ADMIN")}
                      className="flex-1 bg-white/5 border border-white/10 text-white/60 font-black uppercase tracking-[0.2em] py-5 rounded-2xl text-[11px] hover:bg-white/10 hover:text-white transition-all"
                    >
                       Modify Rank to {selectedUser.role === "ADMIN" ? "CLIENT" : "ADMIN"}
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(selectedUser._id)}
                      className="flex-1 bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase tracking-[0.2em] py-5 rounded-2xl text-[11px] hover:bg-red-500/20 transition-all focus:outline-none"
                    >
                       Deauthorize Node
                    </button>
                 </div>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddUserOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-lg rounded-[48px] border-white/10 p-12 space-y-8 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Forge <span className="text-accent">Node</span></h2>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Initialization sequence for new personnel</p>
                </div>
                <button onClick={() => setIsAddUserOpen(false)} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                  <X size={20} className="text-white/40" />
                </button>
              </div>

              {formError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3">
                   <Shield size={14} /> {formError}
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">Designation</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Name..."
                      value={userFormData.name}
                      onChange={(e) => setUserFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-xs font-bold focus:border-accent/40 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">Access Level</label>
                    <select 
                      value={userFormData.role}
                      onChange={(e) => setUserFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-xs font-bold focus:border-accent/40 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="CLIENT" className="bg-[#080B10]">CLIENT</option>
                      <option value="ADMIN" className="bg-[#080B10]">ADMIN</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">Synapse Identifier (Email)</label>
                  <input 
                    required
                    type="email" 
                    placeholder="Email address..."
                    value={userFormData.email}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-xs font-bold focus:border-accent/40 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">Access Token (Password)</label>
                  <input 
                    required
                    type="password" 
                    placeholder="Secure password..."
                    value={userFormData.password}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-xs font-bold focus:border-accent/40 outline-none transition-all"
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-8 rounded-3xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <>Initialize Node <UserPlus size={18} /></>}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
