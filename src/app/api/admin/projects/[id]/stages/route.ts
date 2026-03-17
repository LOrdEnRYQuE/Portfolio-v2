import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// POST /api/admin/projects/[id]/stages
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id: projectId } = await params;

  try {
    const body = await req.json();
    const { title, description, status, order } = body;

    const stageId = await convex.mutation(api.internalProjects.createStage, {
      projectId: projectId as Id<"projects">,
      title,
      description,
      status,
      order,
    });

    // In a real app we might want to fetch the created stage but for now we just return the ID
    return NextResponse.json({ id: stageId, ...body });
  } catch (error) {
    console.error("[STAGES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
