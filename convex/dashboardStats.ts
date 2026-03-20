import { query } from "./_generated/server";

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const leads = await ctx.db.query("leads").collect();
    const inv_projects = await ctx.db.query("projects").collect(); // Infrastructure projects
    const tickets = await ctx.db.query("tickets").collect();
    const posts = await ctx.db.query("posts").collect();
    const invoices = await ctx.db.query("invoices").collect();
    
    // SEO Content Entities
    const pages = await ctx.db.query("pages").collect();
    const services = await ctx.db.query("services").collect();
    const industries = await ctx.db.query("industries").collect();
    const portfolio = await ctx.db.query("portfolioProjects").collect();
    const redirects = await ctx.db.query("redirects").collect();
    const assets = await ctx.db.query("assets").collect();

    const openTickets = tickets.filter((t) => t.status === "OPEN").length;
    const newLeads = leads.filter((l) => l.status === "NEW").length;
    const activeProjects = inv_projects.filter((p) => p.status === "ACTIVE").length;
    const publishedPosts = posts.filter((p) => p.published).length;
    const totalRevenue = invoices
      .filter((i) => i.status === "PAID")
      .reduce((sum, i) => sum + i.amount, 0);

    // SEO Metrics Calculation
    const seoEntities = [...pages, ...services, ...industries, ...portfolio, ...posts];
    const totalEntities = seoEntities.length;
    const indexedEntities = seoEntities.filter(e => e.isIndexed !== false).length;
    const missingMeta = seoEntities.filter(e => !e.seoTitle || !e.metaDescription).length;
    
    const imageAssets = assets.filter(a => (a.type || "").startsWith("image"));
    const altTextCount = imageAssets.filter(a => !!a.altText).length;
    const altTextCoverage = imageAssets.length > 0 ? Math.round((altTextCount / imageAssets.length) * 100) : 100;

    return {
      totalUsers: users.length,
      totalLeads: leads.length,
      newLeads,
      totalProjects: inv_projects.length,
      activeProjects,
      openTickets,
      totalTickets: tickets.length,
      totalPosts: posts.length,
      publishedPosts,
      totalRevenue,
      totalInvoices: invoices.length,
      recentLeads: leads.slice(0, 5),
      recentInvoices: invoices.slice(0, 5),
      
      // SEO Control Center Metrics
      seo: {
        totalEntities,
        indexedCount: indexedEntities,
        noIndexCount: totalEntities - indexedEntities,
        healthScore: totalEntities > 0 ? Math.round(((totalEntities - missingMeta) / totalEntities) * 100) : 100,
        redirectsActive: redirects.length,
        altTextCoverage,
      }
    };
  },
});
