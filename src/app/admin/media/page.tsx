"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import Image from "next/image";
import { 
  Plus, X, Search, Image as ImageIcon, File, 
  Trash2, Copy, Check, Upload, Save, 
  FileIcon, ChevronRight, Grid, List as ListIcon, Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminMediaPage() {
  const assets = useQuery(api.assets.listAll) || [];
  const generateUploadUrl = useMutation(api.assets.generateUploadUrl);
  const createAsset = useMutation(api.assets.create);
  const updateAsset = useMutation(api.assets.update);
  const removeAsset = useMutation(api.assets.remove);

  const [search, setSearch] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredAssets = assets.filter((a) => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.altText?.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      const postUrl = await generateUploadUrl();
      setUploadProgress(30);

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) throw new Error("Upload failed");
      
      const { storageId } = await result.json();
      setUploadProgress(70);

      const sizeKB = Math.round(file.size / 1024);
      const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)}MB` : `${sizeKB}KB`;

      await createAsset({
        title: file.name,
        type: file.type.split("/")[0],
        ext: file.name.split(".").pop() || "",
        size: sizeStr,
        url: storageId, // Convex uses storageId for its native URLs
        storageId,
        altText: file.name.split(".")[0],
      });
      
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading file. Check console.");
      setIsUploading(false);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    // For Convex, we might need a public URL query. 
    // Usually it's `ctx.storage.getUrl(storageId)`
    // For now we'll copy the storage ID or the string they stored.
    navigator.clipboard.writeText(url);
    setCopyingId(id);
    setTimeout(() => setCopyingId(null), 2000);
  };

  const handleUpdateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;
    
    await updateAsset({
      id: selectedAsset._id,
      title: selectedAsset.title,
      altText: selectedAsset.altText,
    });
    setSelectedAsset(null);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex items-end justify-between bg-white/2 p-8 rounded-4xl border border-white/5 backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-linear-to-br from-accent-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-xl shadow-black/20 group-hover:scale-110 transition-transform duration-500">
            <ImageIcon size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white  uppercase leading-none">Media <span className="text-accent-blue italic">Control</span></h1>
            <p className="text-[10px] text-white/30 mt-2 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              Central asset management with SEO meta-data injection.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
           <div className="flex bg-black/40 rounded-xl p-1 border border-white/5">
              <button 
                onClick={() => setViewType("grid")}
                className={`p-2 rounded-lg transition-colors ${viewType === "grid" ? "bg-white/10 text-white" : "text-white/20 hover:text-white"}`}
              >
                <Grid size={16} />
              </button>
              <button 
                onClick={() => setViewType("list")}
                className={`p-2 rounded-lg transition-colors ${viewType === "list" ? "bg-white/10 text-white" : "text-white/20 hover:text-white"}`}
              >
                <ListIcon size={16} />
              </button>
           </div>
           <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-white text-black text-sm font-black hover:bg-accent-blue hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95 disabled:opacity-50"
           >
            {isUploading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                UPLOADING... {uploadProgress}%
              </div>
            ) : (
              <>
                <Upload size={18} /> INJECT ASSET
              </>
            )}
           </button>
           <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white/2 border border-white/5 p-2 rounded-4xl pl-6 transition-all focus-within:border-accent-blue/30 focus-within:bg-white/5">
        <Search size={18} className="text-white/20" />
        <input 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, alt-text, or type..."
          className="flex-1 bg-transparent border-none py-3 text-sm text-white font-medium outline-none placeholder:text-white/20"
        />
        <div className="flex items-center gap-2 px-4 border-l border-white/10">
           <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">{filteredAssets.length} Results</span>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {viewType === "grid" ? (
          <motion.div 
            layout
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredAssets.map((asset) => (
              <motion.div
                layout
                key={asset._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative h-64 rounded-4xl bg-white/2 border border-white/5 overflow-hidden hover:border-accent-blue/50 transition-all duration-500 shadow-xl"
              >
                {asset.type === "image" ? (
                  <div className="absolute inset-0 p-4">
                     <div className="relative w-full h-full rounded-2xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-700">
                        {/* 
                          Note: In a real production Convex app, you'd use a special query 
                          to get the public URL from the storage ID. 
                          Assuming for simplicity strings are stored for now 
                        */}
                        <img 
                          src={asset.url.startsWith("http") ? asset.url : `/api/storage/${asset.url}`} 
                          alt={asset.altText || asset.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.5] group-hover:grayscale-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/0D121B/white?text=Asset';
                          }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                     </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 h-full space-y-4">
                     <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-amber-400 group-hover:scale-110 transition-all">
                        <FileIcon size={32} />
                     </div>
                     <span className="text-[10px] font-mono text-white/20 uppercase font-black">{asset.ext}</span>
                  </div>
                )}

                <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleCopyUrl(asset.url, asset._id)}
                      className="flex-1 bg-white text-black text-[10px] font-black py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:bg-accent-blue hover:text-white transition-colors"
                    >
                      {copyingId === asset._id ? <Check size={12} /> : <Copy size={12} />}
                      {copyingId === asset._id ? "COPIED" : "URL"}
                    </button>
                    <button 
                      onClick={() => setSelectedAsset(asset)}
                      className="p-2.5 rounded-xl bg-black/60 text-white hover:bg-white/20 transition-colors border border-white/5"
                    >
                      <Maximize2 size={14} />
                    </button>
                    <button 
                      onClick={() => { if(confirm("Liquidate asset?")) removeAsset({ id: asset._id }); }}
                      className="p-2.5 rounded-xl bg-red-500/10 text-red-500/50 hover:bg-red-500 hover:text-white transition-colors border border-red-500/20"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="px-2 py-1 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[8px] font-black text-white/50 uppercase tracking-widest">{asset.size}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-4xl border border-white/5 bg-[#080B10]/80 overflow-hidden"
          >
            <table className="w-full text-left">
              <thead className="border-b border-white/5 bg-white/1">
                <tr>
                   <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Asset</th>
                   <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Alt Text</th>
                   <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Stats</th>
                   <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-right">Utility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAssets.map((asset) => (
                  <tr key={asset._id} className="group hover:bg-white/2 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden border border-white/10 flex items-center justify-center shrink-0">
                          {asset.type === "image" ? (
                            <img src={asset.url.startsWith("http") ? asset.url : `/api/storage/${asset.url}`} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <FileIcon size={20} className="text-white/20" />
                          )}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-bold text-white tracking-tight leading-none">{asset.title}</span>
                           <span className="text-[10px] text-white/20 font-mono mt-1">{asset.ext.toUpperCase()} Archive</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                       <span className={`text-xs ${asset.altText ? "text-white/60 font-medium italic" : "text-amber-500/40 font-black tracking-widest uppercase italic"}`}>
                         {asset.altText || "MISSING ALT DATA"}
                       </span>
                    </td>
                    <td className="px-8 py-4">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-mono text-white/40 ">{asset.size}</span>
                          <span className="text-[9px] text-white/10 uppercase font-black mt-0.5 tracking-widest">{asset.type}</span>
                       </div>
                    </td>
                    <td className="px-8 py-4">
                       <div className="flex items-center gap-4 justify-end">
                          <button 
                            onClick={() => handleCopyUrl(asset.url, asset._id)}
                            className="text-[10px] font-black text-white/20 hover:text-accent-blue tracking-widest uppercase transition-colors"
                          >
                             {copyingId === asset._id ? "COPIED" : "COPY URL"}
                          </button>
                          <button 
                            onClick={() => setSelectedAsset(asset)}
                            className="text-[10px] font-black text-white/20 hover:text-white tracking-widest uppercase transition-colors"
                          >
                             Edit
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-8 bg-black/95 backdrop-blur-2xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-[#0D121B] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl"
            >
               <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-8 bg-black/40 flex items-center justify-center min-h-[400px]">
                     {selectedAsset.type === "image" ? (
                        <img 
                          src={selectedAsset.url.startsWith("http") ? selectedAsset.url : `/api/storage/${selectedAsset.url}`} 
                          alt="" 
                          className="max-w-full max-h-full rounded-2xl shadow-2xl" 
                        />
                     ) : (
                        <div className="w-32 h-32 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/10">
                           <FileIcon size={64} />
                        </div>
                     )}
                  </div>
                  <div className="p-12 space-y-8 flex flex-col justify-center">
                     <div>
                        <h3 className="text-2xl font-black text-white  tracking-tighter uppercase italic leading-none">Asset <span className="text-accent-blue">Parameters</span></h3>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mt-3">Refining meta-data for index consistency.</p>
                     </div>

                     <form onSubmit={handleUpdateAsset} className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Asset Label</label>
                           <input 
                            value={selectedAsset.title} 
                            onChange={(e) => setSelectedAsset({ ...selectedAsset, title: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white font-bold outline-none focus:border-accent-blue/50"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-accent-blue uppercase tracking-widest ml-1 italic">SEO Alt Text (Crawl Data)</label>
                           <textarea 
                            value={selectedAsset.altText || ""} 
                            onChange={(e) => setSelectedAsset({ ...selectedAsset, altText: e.target.value })}
                            rows={3}
                            placeholder="Describe this image for search engines..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white/80 outline-none focus:border-accent-blue/50"
                           />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                           <button type="button" onClick={() => setSelectedAsset(null)} className="py-4 rounded-2xl border border-white/5 text-xs font-black text-white/30 hover:bg-white/5 transition-all">
                              DISCARD
                           </button>
                           <button type="submit" className="py-4 rounded-2xl bg-white text-black text-xs font-black hover:bg-accent-blue hover:text-white transition-all shadow-xl shadow-white/5">
                              SAVE PARAMETERS
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
               <button onClick={() => setSelectedAsset(null)} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
                  <X size={24} />
               </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
