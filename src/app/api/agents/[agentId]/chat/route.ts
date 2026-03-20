import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";
import { NextResponse } from "next/server";
import { AgentConfig } from "@/components/ui/AIConcierge";
import { convex } from "@/lib/convex";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";


export async function POST(
  req: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { messages } = await req.json();
    const { agentId } = await params;

    const agent = await convex.query(api.agents.getById, {
      id: agentId as Id<"agents">
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const knowledge = await convex.query(api.agentKnowledge.listByAgent, {
      agentId: agentId as Id<"agents">
    });

    const config = (agent.config ? JSON.parse(agent.config) : {}) as AgentConfig;
    const personality = agent.personality || config?.personality || "A helpful AI assistant.";
    
    // Combine knowledge from both config and documents
    const docKnowledge = knowledge.map((doc: { fileName: string; content: string }) => `--- DOCUMENT: ${doc.fileName} ---\n${doc.content}`).join("\n\n");
    const configKnowledge = config?.knowledgeBase?.join("\n") || "";
    const allKnowledge = [configKnowledge, docKnowledge].filter(Boolean).join("\n\n");
    
    const name = agent.name;

    const systemPrompt = `You are ${name}. 
Personality: ${personality}
Additional Knowledge / Context:
${allKnowledge}

Respond in the tone defined by your personality. Keep responses concise and useful.`;

    const result = await streamText({
      model: google("gemini-2.0-flash-001"),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("[AGENT_CHAT]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
