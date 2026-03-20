import { fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import { format } from "date-fns";
import { Calendar, Tag, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

import { constructMetadata } from "@/lib/seo";
import { Metadata } from "next";

export async function generateStaticParams() {
  const posts = await fetchQuery(api.posts.getPublishedPosts);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchQuery(api.posts.getPostBySlug, { slug });

  if (!post || !post.published) return {};

  return constructMetadata({
    title: `${post.title} | LOrdEnRYQuE Blog`,
    description: post.excerpt,
    image: post.image || "/og-image.png",
    canonical: `/blog/${slug}`
  });
}

interface BlogSlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogSlugPage({ params }: BlogSlugPageProps) {
  const { slug } = await params;

  const post = await fetchQuery(api.posts.getPostBySlug, { slug });

  if (!post || !post.published) {
    notFound();
  }

  const tags = JSON.parse(post.tags || "[]") as string[];

  return (
    <article className="relative min-h-screen pb-24">
      {/* Page Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[10%] w-[50%] h-[50%] bg-accent-blue/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] left-[5%] w-[40%] h-[40%] bg-accent-purple/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-20">
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm font-bold text-foreground/50 hover:text-accent-blue transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        {/* Content Header */}
        <header className="space-y-8 mb-16">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-foreground/40">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(post._creationTime), "MMMM d, yyyy")}</span>
              </div>
              <div className="h-4 w-px bg-white/10 hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                <div className="flex gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="text-accent-blue">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1] uppercase">
              {post.title}
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-foreground/70 font-light leading-relaxed border-l-2 border-accent-blue pl-6 italic">
            {post.excerpt}
          </p>
        </header>

        {/* Main Content */}
        <div className="prose prose-invert prose-slate max-w-none">
          <div className="p-8 md:p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
            <ReactMarkdown
              components={{
                h2: ({ ...props }) => <h2 className="text-3xl font-bold mt-12 mb-6 text-foreground uppercase tracking-tight" {...props} />,
                h3: ({ ...props }) => <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground uppercase tracking-tight" {...props} />,
                p: ({ ...props }) => <p className="text-lg text-foreground/80 leading-relaxed mb-6 font-light" {...props} />,
                ul: ({ ...props }) => <ul className="list-disc list-inside space-y-3 mb-8 text-foreground/80" {...props} />,
                ol: ({ ...props }) => <ol className="list-decimal list-inside space-y-3 mb-8 text-foreground/80" {...props} />,
                li: ({ ...props }) => <li className="text-lg font-light" {...props} />,
                code: ({ ...props }) => <code className="bg-white/10 px-1.5 py-0.5 rounded text-accent-blue font-mono text-sm" {...props} />,
                pre: ({ ...props }) => <pre className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl overflow-x-auto mb-8 font-mono text-sm" {...props} />,
                blockquote: ({ ...props }) => <blockquote className="border-l-4 border-accent-purple pl-6 py-2 italic text-foreground/90 bg-white/5 rounded-r-xl mb-8" {...props} />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer Actions */}
        <footer className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-foreground/40 uppercase tracking-widest">Share this article:</span>
            <div className="flex gap-4">
              <button className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-accent-blue hover:text-accent-blue transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <Link 
            href="/blog"
            className="px-8 py-3 rounded-2xl border border-white/10 bg-white/10 hover:bg-white/20 text-foreground font-bold transition-all backdrop-blur-sm"
          >
            Explore More Insights
          </Link>
        </footer>
      </div>
    </article>
  );
}
