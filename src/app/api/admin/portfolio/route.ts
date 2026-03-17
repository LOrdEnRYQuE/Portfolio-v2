import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = await convex.query(api.portfolio.listAll);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to fetch portfolio projects from Convex:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { 
      slug, 
      title, 
      summary, 
      description, 
      status, 
      stack, 
      cover, 
      featured, 
      liveUrl, 
      githubUrl,
      challenge,
      solution,
      brief
    } = body;

    if (!slug || !title || !summary || !description || !cover) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const projectId = await convex.mutation(api.portfolio.create, {
      slug,
      title,
      summary,
      description,
      status: status || "Live",
      stack: Array.isArray(stack) ? JSON.stringify(stack) : stack || "[]",
      cover,
      featured: !!featured,
      liveUrl: liveUrl || undefined,
      githubUrl: githubUrl || undefined,
      challenge: challenge || undefined,
      solution: solution || undefined,
      brief: brief || undefined,
    });

    return NextResponse.json({ id: projectId, ...body });
  } catch (error) {
    console.error("Failed to create portfolio project in Convex:", error);
    return NextResponse.json({ error: "Failed to create portfolio project" }, { status: 500 });
  }
}
