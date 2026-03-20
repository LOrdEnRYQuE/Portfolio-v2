import { query } from "./_generated/server";

export const getAllIndexableContent = query({
  args: {},
  handler: async (ctx) => {
    // Collect posts
    const rawPosts = await ctx.db.query("posts").filter(q => q.eq(q.field("published"), true)).collect();
    const posts = rawPosts.map(p => ({
      ...p,
      _type: "blog" as const,
      // Fallback mappings for analyzer
      _analyzerTitle: p.seoTitle || p.title,
      _analyzerMeta: p.metaDescription || p.excerpt || "",
      _analyzerKeyword: p.tags ? p.tags.split(",")[0]?.trim() || "" : "" 
    }));

    // Collect services
    const rawServices = await ctx.db.query("services").filter(q => q.eq(q.field("published"), true)).collect();
    const services = rawServices.map(s => ({
      ...s,
      _type: "service" as const,
      _analyzerTitle: s.seoTitle || s.title,
      _analyzerMeta: s.metaDescription || s.intro || "",
      // Services don't explicitly have a keyword field right now, but we can default to the title/slug
      _analyzerKeyword: s.title
    }));

    // Collect industries
    const rawIndustries = await ctx.db.query("industries").filter(q => q.eq(q.field("published"), true)).collect();
    const industries = rawIndustries.map(i => ({
      ...i,
      _type: "industry" as const,
      _analyzerTitle: i.seoTitle || i.title,
      _analyzerMeta: i.metaDescription || i.intro || "",
      _analyzerKeyword: i.title
    }));

    return [...posts, ...services, ...industries];
  },
});
