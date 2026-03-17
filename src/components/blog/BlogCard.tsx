"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Id } from "@convex/_generated/dataModel";

interface BlogCardProps {
  post: {
    _id: Id<"posts"> | string;
    title: string;
    slug: string;
    excerpt?: string;
    _creationTime: number;
    tags: string;
    image?: string;
  };
  index: number;
}

export default function BlogCard({ post, index }: BlogCardProps) {
  const { t } = useI18n();
  const tags = post.tags ? (JSON.parse(post.tags) as string[]) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className="group relative h-full"
    >
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:bg-white/10 hover:shadow-blue-glow">
          {/* Glass Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-accent-blue/5 via-transparent to-accent-purple/5 opacity-30" />
          
          {/* Content */}
          <div className="relative flex flex-col h-full p-8">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-foreground/50 mb-6">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{format(new Date(post._creationTime), "MMM d, yyyy")}</span>
              </div>
              {tags.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{tags[0]}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-white group-hover:to-accent-blue group-hover:bg-clip-text transition-all duration-300">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-foreground/60 leading-relaxed mb-8 grow">
              {post.excerpt || "Dive into the latest insights on AI execution and product engineering."}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
              <span className="text-sm font-bold text-accent-blue group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-2">
                {t("blog.read_more")}
                <ArrowRight className="w-4 h-4" />
              </span>
              
              {/* Pulse Indicator */}
              <div className="relative flex h-2 w-2">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue/40 opacity-75"></div>
                <div className="relative inline-flex rounded-full h-2 w-2 bg-accent-blue"></div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
