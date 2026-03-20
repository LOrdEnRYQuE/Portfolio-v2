import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { convex } from "@/lib/convex";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { z } from "zod";


const agentSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  personality: z.string().optional(),
  config: z.record(z.string(), z.any()).optional().default({}),
  status: z.enum(["ACTIVE", "INACTIVE", "DRAFT"]).default("ACTIVE"),
});

const DEFAULT_CONFIG = {
  branding: {
    primaryColor: "#3b82f6",
    icon: "Bot",
    theme: "dark"
  }
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const agents = await convex.query(api.agents.listWithStats, {
      userId: session.user.id as Id<"users">
    });

    const formattedAgents = agents.map(agent => {
      let parsedConfig = DEFAULT_CONFIG;
      try {
        if (agent.config) {
          const dbConfig = JSON.parse(agent.config);
          parsedConfig = {
            ...DEFAULT_CONFIG,
            ...dbConfig,
            branding: {
              ...DEFAULT_CONFIG.branding,
              ...(dbConfig.branding || {})
            }
          };
        }
      } catch (e) {
        console.error("Failed to parse agent config", e);
      }
      return {
        ...agent,
        config: parsedConfig
      };
    });

    return NextResponse.json(formattedAgents);
  } catch (error) {
    console.error("[AGENTS_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = agentSchema.parse(body);

    const agentId = await convex.mutation(api.agents.create, {
      name: validatedData.name,
      description: validatedData.description,
      personality: validatedData.personality,
      config: JSON.stringify(validatedData.config || DEFAULT_CONFIG),
      status: validatedData.status,
      userId: session.user.id as Id<"users">
    });

    const agent = await convex.query(api.agents.getById, { id: agentId });

    return NextResponse.json(agent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[AGENTS_POST]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
