import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  try {
    const { messages, agentId, config, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response("Messages array is required", { status: 400 });
    }

    let systemPrompt = "You are a professional AI Concierge for a premium portfolio. Your tone is sophisticated, helpful, and 'Dark Luxury'.";
    
    if (context?.url) {
      systemPrompt += `\nThe user is currently viewing the page entitled "${context.title || 'Untitled'}" at ${context.url}. Use this information to providing relevant assistance.`;
    }
    
    if (agentId) {
      const agent = await convex.query(api.agents.getById, {
        id: agentId as Id<"agents">
      });
      if (agent) {
        systemPrompt = `You are ${agent.name}. ${agent.personality || ''}. 
        Configuration: ${agent.config || ''}`;
      }
    } else if (config) {
      systemPrompt = `You are ${config.name}. ${config.personality || ''}. 
      Your purpose is: ${config.description || ''}`;
    }

    const result = streamText({
      model: google("gemini-2.0-flash-001"),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("[CHAT_API]", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
