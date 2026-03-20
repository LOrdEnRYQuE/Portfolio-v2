import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { convex } from "@/lib/convex";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";


export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const project = await convex.query(api.portfolio.getById, {
      id: id as Id<"portfolioProjects">
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Failed to fetch portfolio project from Convex:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio project" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

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

    await convex.mutation(api.portfolio.update, {
      id: id as Id<"portfolioProjects">,
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

    return NextResponse.json({ id, ...body });
  } catch (error) {
    console.error("Failed to update portfolio project in Convex:", error);
    return NextResponse.json({ error: "Failed to update portfolio project" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await convex.mutation(api.portfolio.remove, {
      id: id as Id<"portfolioProjects">
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete portfolio project in Convex:", error);
    return NextResponse.json({ error: "Failed to delete portfolio project" }, { status: 500 });
  }
}
