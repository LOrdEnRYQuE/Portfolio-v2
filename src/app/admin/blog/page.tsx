"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";

interface AdminPostData {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  published: boolean;
  tags: string; // JSON string
  _creationTime: number;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<AdminPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">
            Neural <span className="text-accent underline decoration-4 underline-offset-8">Blog</span>
          </h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-[0.3em] mt-2">
            Authority & Insight Management
          </p>
        </div>

        <Link 
          href="/admin/blog/new"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent text-white font-bold uppercase text-xs tracking-widest hover:bg-accent/80 transition-all shadow-lg shadow-accent/20"
        >
          <Plus size={16} /> Write New Entry
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search insights..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-0 focus:border-accent/40 focus:bg-white/10 transition-all"
          />
        </div>
        <button className="px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
            ))
          ) : filteredPosts.map((post, idx) => {
            const tags = JSON.parse(post.tags) as string[];
            return (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative h-full flex flex-col bg-white/5 border border-white/5 rounded-3xl overflow-hidden hover:border-accent/30 hover:bg-white/10 transition-all duration-500"
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  {post.published ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                      <CheckCircle2 size={10} /> Live
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                      <Clock size={10} /> Draft
                    </div>
                  )}
                </div>

                <div className="p-8 flex flex-col h-full">
                  <div className="flex items-center gap-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {format(new Date(post._creationTime), "MMM d, yyyy")}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-sm text-white/40 line-clamp-3 mb-6 grow">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-white/40 uppercase font-bold tracking-wider">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2">
                       <Link 
                        href={`/admin/blog/${post._id}/edit`}
                        className="p-2 rounded-xl bg-white/5 hover:bg-accent/20 hover:text-accent transition-all"
                       >
                         <Edit3 size={16} />
                       </Link>
                       <Link 
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-500 transition-all"
                       >
                         <Eye size={16} />
                       </Link>
                    </div>

                    <button className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-500 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {!loading && filteredPosts.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="inline-flex p-6 rounded-full bg-white/5 border border-white/5 text-white/20 mb-4">
            <Search size={48} />
          </div>
          <h3 className="text-xl font-bold uppercase tracking-widest">No matching insights</h3>
          <p className="text-white/40 text-sm italic">Initialize theoretical framework by writing your first post.</p>
        </div>
      )}
    </div>
  );
}
