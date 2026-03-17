"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Command as CommandIcon, 
  Activity, 
  Bot, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Terminal,
  FolderKanban,
  Image as ImageIcon,
  Loader2,
  ArrowRight,
  Briefcase,
  FileText
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  href: string;
  category: string;
  icon?: React.ElementType;
}

export function CommandBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const staticCommands = [
    { title: "Dashboard", href: "/admin", icon: Activity, category: "Command" },
    { title: "Agent Fleet", href: "/admin/agents", icon: Bot, category: "Command" },
    { title: "LOrdEnRYQuE Forge", href: "/admin/agents/generate", icon: Cpu, category: "Command" },
    { title: "Project Command", href: "/admin/projects", icon: FolderKanban, category: "Content" },
    { title: "Portfolio Hub", href: "/admin/portfolio", icon: Briefcase, category: "Content" },
    { title: "LOrdEnRYQuE Blog", href: "/admin/blog", icon: FileText, category: "Content" },
    { title: "Media Vault", href: "/admin/media", icon: ImageIcon, category: "Content" },
    { title: "Lead Hub", href: "/admin/leads", icon: Zap, category: "Oversight" },
    { title: "User Fleet", href: "/admin/users", icon: ShieldCheck, category: "Oversight" },
    { title: "Global Settings", href: "/admin/settings", icon: Terminal, category: "System" },
  ];

  const fetchResults = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults(debouncedQuery);
  }, [debouncedQuery, fetchResults]);

  const navigate = (href: string) => {
    router.push(href);
    setIsOpen(false);
    setQuery("");
  };

  const categories = ["Command", "Content", "Oversight", "System"];
  
  const displayResults = [
    ...staticCommands.filter(cmd => 
      cmd.title.toLowerCase().includes(query.toLowerCase())
    ).map(cmd => ({
      ...cmd,
      id: `static-${cmd.href}`,
      subtitle: "Navigation",
      type: "System"
    })),
    ...results
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-100"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-accent-glow-xl z-101 overflow-hidden"
          >
            {/* Command Bar Scanner Effect */}
            <div className="absolute top-0 left-0 w-full h-px bg-accent/30 animate-scan pointer-events-none" />
            
            <div className="p-8 border-b border-white/5 flex items-center gap-6 relative overflow-hidden group">
              <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-1000" />
              
              {isLoading ? (
                <Loader2 className="animate-spin text-accent" size={24} />
              ) : (
                <Search className="text-white/20 group-focus-within:text-accent transition-colors" size={24} />
              )}
              
              <input
                autoFocus
                placeholder="Initialize intelligence search (⌘K)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-lg w-full font-medium placeholder:text-white/10 focus:ring-0"
              />
              
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:border-accent/20 transition-all">
                <CommandIcon size={12} /> K
              </div>
            </div>

            <div className="max-h-[500px] overflow-y-auto p-6 custom-scrollbar space-y-8">
              {displayResults.length > 0 ? (
                categories.map(category => {
                  const catResults = displayResults.filter(r => r.category === category);
                  if (catResults.length === 0) return null;
                  
                  return (
                    <div key={category} className="space-y-4">
                      <div className="flex items-center gap-4 px-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/15">{category}</p>
                        <div className="h-px flex-1 bg-white/5" />
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2">
                        {catResults.map((result: SearchResult) => (
                          <button
                            key={result.id}
                            onClick={() => navigate(result.href)}
                            className="flex items-center gap-5 px-5 py-4 rounded-3xl hover:bg-white/2 active:bg-white/4 group transition-all text-left relative overflow-hidden border border-transparent hover:border-white/5"
                          >
                             <div className="absolute inset-y-0 left-0 w-1 bg-accent scale-y-0 group-hover:scale-y-75 transition-transform origin-center rounded-full" />
                             
                             <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 group-hover:text-accent group-hover:border-accent/20 group-hover:shadow-accent-glow-subtle transition-all">
                                {result.icon ? <result.icon size={22} /> : <div className="text-[10px] font-black">{result.type?.[0]}</div>}
                             </div>
                             
                             <div className="flex-1 min-w-0">
                               <div className="flex items-center gap-2">
                                 <span className="text-[13px] font-black uppercase tracking-wide text-white/80 group-hover:text-white transition-colors">{result.title}</span>
                                 <span className="text-[8px] font-bold uppercase tracking-widest text-accent/40 bg-accent/5 px-2 py-0.5 rounded-full">{result.type || 'System'}</span>
                               </div>
                               <p className="text-[10px] text-white/30 group-hover:text-white/50 truncate font-medium uppercase tracking-tighter mt-0.5">{result.subtitle}</p>
                             </div>
                             
                             <ArrowRight className="text-white/10 group-hover:text-accent group-hover:translate-x-1 transition-all" size={16} />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-20 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mx-auto text-white/10">
                    <Search size={32} />
                  </div>
                  <div>
                    <p className="text-white/20 text-[11px] font-black uppercase tracking-[0.3em]">Intelligence link idle</p>
                    <p className="text-white/10 text-[9px] uppercase tracking-widest mt-2">No nodes found matching &quot;{query}&quot;</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 bg-white/2 border-t border-white/5 flex items-center justify-between px-8">
               <div className="flex items-center gap-8">
                 <div className="flex items-center gap-3 text-[10px] font-bold text-white/15 uppercase tracking-[0.2em]">
                   <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-white/40">↑↓</span> Navigate
                 </div>
                 <div className="flex items-center gap-3 text-[10px] font-bold text-white/15 uppercase tracking-[0.2em]">
                   <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-white/40">Enter</span> Select
                 </div>
               </div>
               
               <div className="flex items-center gap-4 text-[10px] font-bold text-white/15 uppercase tracking-[0.2em]">
                 <Activity size={12} className="text-accent animate-pulse" />
                 System Flux: Active
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
