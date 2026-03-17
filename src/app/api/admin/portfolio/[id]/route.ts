import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

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

    const project = await prisma.portfolioProject.update({
      where: { id },
      data: {
        slug,
        title,
        summary,
        description,
        status,
        stack: Array.isArray(stack) ? JSON.stringify(stack) : stack,
        cover,
        featured,
        liveUrl,
        githubUrl,
        challenge,
        solution,
        brief
      }
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Failed to update portfolio project:", error);
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
    await prisma.portfolioProject.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete portfolio project:", error);
    return NextResponse.json({ error: "Failed to delete portfolio project" }, { status: 500 });
  }
}
