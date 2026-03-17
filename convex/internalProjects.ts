import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").order("desc").collect();
    
    // Enrich with user and counts
    return Promise.all(
      projects.map(async (project) => {
        const user = await ctx.db.get(project.userId);
        const stages = await ctx.db
          .query("stages")
          .withIndex("by_project", (q) => q.eq("projectId", project._id))
          .collect();
        const documents = await ctx.db
          .query("documents")
          .withIndex("by_project", (q) => q.eq("projectId", project._id))
          .collect();
        
        return {
          ...project,
          user: user ? { id: user._id, name: user.name, email: user.email } : null,
          _count: {
            stages: stages.length,
            documents: documents.length,
          },
        };
      })
    );
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    userId: v.id("users"),
    health: v.optional(v.string()),
    efficiency: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const projectId = await ctx.db.insert("projects", {
      title: args.title,
      description: args.description,
      status: args.status,
      userId: args.userId,
      health: args.health || "STABLE",
      efficiency: args.efficiency || 100,
    });

    // Create default stages
    await ctx.db.insert("stages", { title: "Blueprint", order: 0, status: "COMPLETED", projectId });
    await ctx.db.insert("stages", { title: "Development", order: 1, status: "IN_PROGRESS", projectId });
    await ctx.db.insert("stages", { title: "Production", order: 2, status: "UPCOMING", projectId });

    return projectId;
  },
});

export const getById = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);
    if (!project) return null;

    const user = await ctx.db.get(project.userId);
    const stages = await ctx.db
      .query("stages")
      .withIndex("by_project", (q) => q.eq("projectId", project._id))
      .order("asc")
      .collect();
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_project", (q) => q.eq("projectId", project._id))
      .collect();

    return {
      ...project,
      user: user ? { id: user._id, name: user.name, email: user.email } : null,
      stages,
      documents,
    };
  },
});

export const getProjectByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const project = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!project) return null;

    const stages = await ctx.db
      .query("stages")
      .withIndex("by_project", (q) => q.eq("projectId", project._id))
      .order("asc")
      .collect();

    return { ...project, stages };
  },
});

export const getOrCreateProjectByUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    let project = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!project) {
      const projectId = await ctx.db.insert("projects", {
        title: "Premium Brand Platform",
        description: "End-to-end digital transformation and AI integration.",
        status: "ACTIVE",
        health: "STABLE",
        efficiency: 94,
        userId: args.userId,
      });

      await ctx.db.insert("stages", { title: "Discovery & Strategy", description: "Market research and technical roadmap.", status: "COMPLETED", order: 1, projectId });
      await ctx.db.insert("stages", { title: "Architecture Design", description: "Schema definition and cloud infrastructure.", status: "COMPLETED", order: 2, projectId });
      await ctx.db.insert("stages", { title: "Development Phase", description: "Core feature implementation and integration.", status: "IN_PROGRESS", order: 3, projectId });
      await ctx.db.insert("stages", { title: "Quality Assurance", description: "Security audit and performance testing.", status: "UPCOMING", order: 4, projectId });
      await ctx.db.insert("stages", { title: "Launch & Scale", description: "Deployment and global distribution.", status: "UPCOMING", order: 5, projectId });

      project = await ctx.db.get(projectId);
    }

    const stages = await ctx.db
      .query("stages")
      .withIndex("by_project", (q) => q.eq("projectId", project!._id))
      .order("asc")
      .collect();

    return { ...project, stages };
  },
});

export const update = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    health: v.optional(v.string()),
    efficiency: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    // Delete related stages and documents
    const stages = await ctx.db
      .query("stages")
      .withIndex("by_project", (q) => q.eq("projectId", args.id))
      .collect();
    for (const stage of stages) {
      await ctx.db.delete(stage._id);
    }

    const docs = await ctx.db
      .query("documents")
      .withIndex("by_project", (q) => q.eq("projectId", args.id))
      .collect();
    for (const doc of docs) {
      await ctx.db.delete(doc._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const createStage = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let order = args.order;
    if (order === undefined) {
      const lastStage = await ctx.db
        .query("stages")
        .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
        .order("desc")
        .first();
      order = lastStage ? lastStage.order + 1 : 0;
    }

    const stageId = await ctx.db.insert("stages", {
      projectId: args.projectId,
      title: args.title || "New Stage",
      description: args.description || "Description of the new stage",
      status: args.status || "UPCOMING",
      order,
    });
    return stageId;
  },
});

export const updateStage = mutation({
  args: {
    id: v.id("stages"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const removeStage = mutation({
  args: { id: v.id("stages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
