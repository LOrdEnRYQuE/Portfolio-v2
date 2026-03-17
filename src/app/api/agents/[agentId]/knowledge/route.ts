import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { PDFParse } from "pdf-parse";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

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

    // Verify ownership
    const agent = await convex.query(api.agents.getByUserAndId, {
      id: agentId as Id<"agents">,
      userId: session.user.id as Id<"users">
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const knowledge = await convex.query(api.agentKnowledge.listByAgent, {
      agentId: agentId as Id<"agents">
    });

    return NextResponse.json(knowledge);
  } catch (error) {
    console.error("[KNOWLEDGE_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

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

    // Verify ownership
    const agent = await convex.query(api.agents.getByUserAndId, {
      id: agentId as Id<"agents">,
      userId: session.user.id as Id<"users">
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedContent = "";

    if (file.name.endsWith(".pdf")) {
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      extractedContent = result.text;
    } else {
      extractedContent = buffer.toString("utf-8");
    }

    const doc = await convex.mutation(api.agentKnowledge.create, {
      agentId: agentId as Id<"agents">,
      fileName: file.name,
      type: file.name.endsWith(".pdf") ? "pdf" : "text",
      content: extractedContent
    });

    return NextResponse.json(doc);
  } catch (error) {
    console.error("[KNOWLEDGE_POST]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
