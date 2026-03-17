import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ agentId: string; documentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { agentId, documentId } = await params;

    // Verify agent ownership
    const agent = await convex.query(api.agents.getByUserAndId, {
      id: agentId as Id<"agents">,
      userId: session.user.id as Id<"users">
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    await convex.mutation(api.agentKnowledge.remove, {
      id: documentId as Id<"agentKnowledge">,
      agentId: agentId as Id<"agents">
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[KNOWLEDGE_DELETE]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
