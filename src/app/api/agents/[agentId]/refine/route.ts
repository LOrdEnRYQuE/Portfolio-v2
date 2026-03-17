import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(
  req: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { agentId } = await params;
    const { personality } = await req.json();

    if (!personality) {
      return NextResponse.json({ error: "Personality is required" }, { status: 400 });
    }

    // Verify ownership
    const agent = await convex.query(api.agents.getByUserAndId, {
      id: agentId as Id<"agents">,
      userId: session.user.id as Id<"users">
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Refine and professionalize the following AI Agent personality. 
      Make it more detailed, structured, and premium-sounding, while keeping the original intent.
      Return ONLY the refined personality text without any additional commentary.
      
      Original Personality:
      "${personality}"`,
    });

    return NextResponse.json({ refined: text.trim() });
  } catch (error) {
    console.error("[REFINE_PERSONALITY]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
