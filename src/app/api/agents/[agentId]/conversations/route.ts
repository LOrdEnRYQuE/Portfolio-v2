import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { convex } from "@/lib/convex";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { agentId } = await params;

    // Verify agent ownership
    const agent = await convex.query(api.agents.getByUserAndId, {
      id: agentId as Id<"agents">,
      userId: session.user.id as Id<"users">
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const conversations = await convex.query(api.conversations.listByAgent, {
      agentId: agentId as Id<"agents">
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("[AGENT_CONVERSATIONS_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
