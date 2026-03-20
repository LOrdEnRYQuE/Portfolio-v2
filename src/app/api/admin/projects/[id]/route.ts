import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { convex } from "@/lib/convex";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";


// GET /api/admin/projects/[id]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  try {
    const project = await convex.query(api.internalProjects.getById, { 
      id: id as Id<"projects"> 
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PROJECT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PATCH /api/admin/projects/[id]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    await convex.mutation(api.internalProjects.update, {
      id: id as Id<"projects">,
      ...body
    });

    const project = await convex.query(api.internalProjects.getById, { 
      id: id as Id<"projects"> 
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PROJECT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE /api/admin/projects/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  try {
    await convex.mutation(api.internalProjects.remove, { 
      id: id as Id<"projects"> 
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[PROJECT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
