import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { convex } from "@/lib/convex";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";


// PATCH /api/admin/projects/[id]/stages/[stageId]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string, stageId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { stageId } = await params;

  try {
    const body = await req.json();
    await convex.mutation(api.internalProjects.updateStage, {
      id: stageId as Id<"stages">,
      ...body
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[STAGE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE /api/admin/projects/[id]/stages/[stageId]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string, stageId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { stageId } = await params;

  try {
    await convex.mutation(api.internalProjects.removeStage, { 
      id: stageId as Id<"stages"> 
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[STAGE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
