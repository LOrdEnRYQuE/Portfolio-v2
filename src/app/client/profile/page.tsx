"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Save, User } from "lucide-react";

export default function ClientProfilePage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const user = useQuery(api.users.getUserByEmail, userEmail ? { email: userEmail } : "skip");
  const updateUser = useMutation(api.users.updateUser);

  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await updateUser({ id: user._id, name: form.name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <div className="h-64 flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" /></div>;
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Profile Settings</h1>
        <p className="text-sm text-white/40 mt-1">Update your personal information</p>
      </div>

      <div className="flex items-center gap-4 p-6 rounded-2xl border border-white/5 bg-white/2">
        <div className="w-16 h-16 rounded-2xl bg-accent-blue/15 text-accent-blue flex items-center justify-center">
          <User size={28} />
        </div>
        <div>
          <p className="text-lg font-bold text-white">{user.name || "No name set"}</p>
          <p className="text-xs text-white/40">{user.email}</p>
          <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">{user.role}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-white/5 bg-white/2 space-y-5">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Full Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-white/20"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Email</label>
          <input
            value={form.email}
            disabled
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white/30 outline-none cursor-not-allowed"
          />
          <p className="text-[10px] text-white/20">Email cannot be changed</p>
        </div>

        <div className="flex items-center justify-between pt-2">
          {saved && <p className="text-xs text-emerald-400 font-medium">✓ Saved successfully</p>}
          <button
            type="submit"
            disabled={saving}
            className="ml-auto flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-blue text-white text-sm font-medium hover:bg-accent-purple transition-colors disabled:opacity-50"
          >
            <Save size={16} /> {saving ? "Saving..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
