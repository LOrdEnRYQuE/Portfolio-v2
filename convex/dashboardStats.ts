import { query } from "./_generated/server";

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const leads = await ctx.db.query("leads").collect();
    const projects = await ctx.db.query("projects").collect();
    const tickets = await ctx.db.query("tickets").collect();
    const posts = await ctx.db.query("posts").collect();
    const invoices = await ctx.db.query("invoices").collect();

    const openTickets = tickets.filter((t) => t.status === "OPEN").length;
    const newLeads = leads.filter((l) => l.status === "NEW").length;
    const activeProjects = projects.filter((p) => p.status === "ACTIVE").length;
    const publishedPosts = posts.filter((p) => p.published).length;
    const totalRevenue = invoices
      .filter((i) => i.status === "PAID")
      .reduce((sum, i) => sum + i.amount, 0);

    return {
      totalUsers: users.length,
      totalLeads: leads.length,
      newLeads,
      totalProjects: projects.length,
      activeProjects,
      openTickets,
      totalTickets: tickets.length,
      totalPosts: posts.length,
      publishedPosts,
      totalRevenue,
      totalInvoices: invoices.length,
      recentLeads: leads.slice(0, 5),
      recentPosts: posts.slice(0, 5),
      recentInvoices: invoices.slice(0, 5),
    };
  },
});
