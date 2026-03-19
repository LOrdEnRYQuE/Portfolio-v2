"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Save, Plus } from "lucide-react";

export default function AdminSettingsPage() {
  const configs = useQuery(api.siteConfig.listAll) || [];
  const upsertConfig = useMutation(api.siteConfig.upsert);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const handleSave = async (key: string, value: string) => {
    setSaving(key);
    try {
      await upsertConfig({ key, value });
      setEditValues((prev) => { const next = { ...prev }; delete next[key]; return next; });
    } finally {
      setSaving(null);
    }
  };

  const handleAddNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;
    setSaving("__new__");
    try {
      await upsertConfig({ key: newKey.trim(), value: newValue });
      setNewKey("");
      setNewValue("");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Site Settings</h1>
        <p className="text-sm text-white/40 mt-1">Global configuration key-value store</p>
      </div>

      <div className="space-y-3">
        {configs.map((config) => {
          const currentValue = editValues[config.key] ?? config.value;
          const isChanged = editValues[config.key] !== undefined && editValues[config.key] !== config.value;

          return (
            <div key={config._id} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/2">
              <div className="w-48 shrink-0">
                <span className="text-xs font-bold text-white/50 font-mono">{config.key}</span>
              </div>
              <input
                value={currentValue}
                onChange={(e) => setEditValues({ ...editValues, [config.key]: e.target.value })}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white outline-none focus:border-white/20"
              />
              {isChanged && (
                <button
                  onClick={() => handleSave(config.key, editValues[config.key])}
                  disabled={saving === config.key}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-blue text-white text-xs font-medium hover:bg-accent-purple transition-colors disabled:opacity-50"
                >
                  <Save size={12} /> {saving === config.key ? "..." : "Save"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleAddNew} className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-white/10 bg-white/1">
        <input
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="new.key"
          className="w-48 shrink-0 bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white font-mono outline-none"
          required
        />
        <input
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Value"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white outline-none"
        />
        <button
          type="submit"
          disabled={saving === "__new__"}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/15 transition-colors disabled:opacity-50"
        >
          <Plus size={12} /> Add
        </button>
      </form>
    </div>
  );
}
