import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("leads").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

function calculateLeadScore(args: any) {
  let score = 0;
  // Basics (up to 30 points)
  if (args.concept && args.concept !== "Standard Inquiry") score += 10;
  if (args.industry && ["fintech", "saas", "healthtech"].includes(args.industry.toLowerCase())) score += 10;
  if (args.description && args.description.length > 50) score += 10;
  
  // Complexity & Value (up to 40 points)
  const features = JSON.parse(args.features || "[]");
  score += Math.min(features.length * 5, 20); // 5 points per feature, max 20
  if (args.timeline && args.timeline.toLowerCase().includes("urgent")) score += 10;
  if (args.stack && args.stack.length > 0) score += 10;

  // Consistency (up to 30 points)
  if (args.name && args.email) score += 15;
  if (args.name?.split(" ").length > 1) score += 5; // Real name
  if (args.email?.includes("@") && !args.email?.includes("test")) score += 10;

  return Math.min(score, 100);
}

export const createLead = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    concept: v.optional(v.string()),
    industry: v.optional(v.string()),
    description: v.optional(v.string()),
    features: v.optional(v.string()),
    timeline: v.optional(v.string()),
    stack: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const score = calculateLeadScore(args);
    const leadId = await ctx.db.insert("leads", {
      name: args.name,
      email: args.email,
      concept: args.concept || "Standard Inquiry",
      industry: args.industry || "Startup",
      description: args.description,
      features: args.features || "[]",
      timeline: args.timeline,
      stack: args.stack,
      status: "NEW",
      score,
    });

    // 1. Find Admin user for notification
    const admin = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "ADMIN"))
      .first();

    if (admin) {
      const type = score >= 70 ? "CRITICAL" : score >= 40 ? "WARNING" : "INFO";
      await ctx.db.insert("notifications", {
        userId: admin._id,
        title: score >= 70 ? "🔥 High-Value Lead Detected" : "New Lead Arrived",
        message: `${args.name} from ${args.industry} just submitted a ${score}% match.`,
        type,
        status: "UNREAD",
        link: `/admin`,
      });
    }

    return leadId;
  },
});

export const update = mutation({
  args: {
    id: v.id("leads"),
    status: v.optional(v.string()),
    concept: v.optional(v.string()),
    industry: v.optional(v.string()),
    description: v.optional(v.string()),
    features: v.optional(v.string()),
    timeline: v.optional(v.string()),
    stack: v.optional(v.string()),
    score: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const convertToClient = mutation({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.id);
    if (!lead) throw new Error("Lead not found");

    // 1. Check if user already exists
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", lead.email))
      .unique();

    // 2. Create user if doesn't exist
    if (!user) {
      const userId = await ctx.db.insert("users", {
        name: lead.name,
        email: lead.email,
        role: "CLIENT",
      });
      user = await ctx.db.get(userId);
    } else if (user.role !== "ADMIN" && user.role !== "CLIENT") {
      // Upgrade role if necessary
      await ctx.db.patch(user._id, { role: "CLIENT" });
    }

    // 3. Mark lead as converted
    await ctx.db.patch(args.id, { status: "CONVERTED" });

    // 4. Financial Automation: Create Draft Invoice from Site Settings
    const score = lead.score || 0;
    
    // Fetch dynamic finance config or use defaults
    const baseRateConfig = await ctx.db
      .query("siteConfig")
      .withIndex("by_key", (q) => q.eq("key", "finance.base_rate"))
      .first();
    const bonusConfig = await ctx.db
      .query("siteConfig")
      .withIndex("by_key", (q) => q.eq("key", "finance.bonus_multiplier"))
      .first();

    const baseAmount = baseRateConfig ? Number(baseRateConfig.value) : 1450;
    const bonusMultiplier = bonusConfig ? Number(bonusConfig.value) : 1.5;
    
    const complexityBonus = score > 70 ? (baseAmount * (bonusMultiplier - 1)) : 0;
    const totalEstimate = baseAmount + complexityBonus;
    
    const invoiceId = await ctx.db.insert("invoices", {
      userId: user!._id,
      number: `INV-${Date.now().toString().slice(-6)}`,
      projectName: lead.concept,
      amount: totalEstimate,
      currency: "EUR",
      status: "DRAFT",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      description: `Automated onboarding estimate for: ${lead.concept}. (Dynamic Calculation Flow)`,
    });

    // 5. Notify Admin about the conversion & invoice
    const admin = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "ADMIN"))
      .first();

    if (admin) {
      await ctx.db.insert("notifications", {
        userId: admin._id,
        title: "✨ Conversion Successful",
        message: `${lead.name} has been upgraded to a Client. Draft Invoice ${totalEstimate}€ generated.`,
        type: "SUCCESS",
        status: "UNREAD",
        link: `/admin`,
      });
    }

    return user!._id;
  },
});
export const remove = mutation({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
