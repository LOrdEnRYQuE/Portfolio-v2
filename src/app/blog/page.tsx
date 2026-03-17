import { prisma } from "@/lib/db";
import BlogListing from "@/components/blog/BlogListing";

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="relative min-h-screen">
      {/* LOrdEnRYQuE Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-accent-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[30%] right-[5%] w-[30%] h-[30%] bg-accent-purple/5 rounded-full blur-[100px]" />
      </div>

      {/* Header Section */}
      <header className="relative z-10 pt-20 pb-12 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="text-xs font-black tracking-[0.3em] uppercase text-accent-silver">
              Archive & Reasoning
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground uppercase">
            LOrdEnRYQuE Insights
          </h1>
          <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto font-light">
            Engineering, AI, and the mechanics of high-impact product execution.
          </p>
        </div>
      </header>

      {/* Posts Section */}
      <BlogListing posts={posts} />
    </div>
  );
}
