"use client";
import { useI18n } from "@/lib/i18n";
import BlogCard from "./BlogCard";
import { Id } from "@convex/_generated/dataModel";

interface BlogPostData {
  _id: Id<"posts"> | string;
  _creationTime: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  published: boolean;
  tags: string;
  image?: string;
}

interface BlogListingProps {
  posts: BlogPostData[];
}

export default function BlogListing({ posts }: BlogListingProps) {
  const { t } = useI18n();

  return (
    <section className="relative z-10 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <BlogCard key={post._id} post={post} index={index} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-foreground/50 text-xl font-light italic">
                {t("blog.no_posts")}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
