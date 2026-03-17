import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// GET /api/admin/projects - Fetch all projects with stats
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const projects = await convex.query(api.internalProjects.listAll);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("[PROJECTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// POST /api/admin/projects - Create new project
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, status } = body;
    let { userId } = body;

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    // Default to current user if not provided
    if (!userId) {
      const dbUser = await convex.query(api.users.getUserByEmail, { 
        email: session.user?.email || "" 
      });
      userId = dbUser?._id;
    }

    if (!userId) {
      return new NextResponse("Could not determine user scope", { status: 400 });
    }

    const projectId = await convex.mutation(api.internalProjects.create, {
      title,
      description,
      status: status || "ACTIVE",
      userId: userId as Id<"users">,
    });

    const project = await convex.query(api.internalProjects.getById, { 
      id: projectId as Id<"projects"> 
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PROJECTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
