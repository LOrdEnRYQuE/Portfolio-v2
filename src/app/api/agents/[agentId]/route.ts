import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { z } from "zod";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const agentSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  personality: z.string().optional(),
  config: z.record(z.string(), z.any()).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "DRAFT"]).optional(),
});

const DEFAULT_CONFIG = {
  branding: {
    primaryColor: "#3b82f6",
    icon: "Bot",
    theme: "dark"
  }
};

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

    const agent = await convex.query(api.agents.getByUserAndId, {
      id: agentId as Id<"agents">,
      userId: session.user.id as Id<"users">
    });

    if (!agent) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    // Parse config string into object
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

    return NextResponse.json({
      ...agent,
      config: parsedConfig
    });
  } catch (error) {
    console.error("[AGENT_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { agentId } = await params;
    
    // Authorization check
    const existingAgent = await convex.query(api.agents.getByUserAndId, {
      id: agentId as Id<"agents">,
      userId: session.user.id as Id<"users">
    });

    if (!existingAgent) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = agentSchema.parse(body);

    // If config is provided as object, stringify it for DB
    const updateArgs: any = { 
      id: agentId as Id<"agents">,
      ...validatedData 
    };
    if (validatedData.config) {
      updateArgs.config = JSON.stringify(validatedData.config);
    }

    await convex.mutation(api.agents.update, updateArgs);

    const updatedAgent = await convex.query(api.agents.getById, { id: agentId as Id<"agents"> });

    return NextResponse.json(updatedAgent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[AGENT_PATCH]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { agentId } = await params;

    // Authorization check
    const existingAgent = await convex.query(api.agents.getByUserAndId, {
      id: agentId as Id<"agents">,
      userId: session.user.id as Id<"users">
    });

    if (!existingAgent) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    await convex.mutation(api.agents.remove, {
      id: agentId as Id<"agents">
    });

    return NextResponse.json({ message: "Agent deleted" });
  } catch (error) {
    console.error("[AGENT_DELETE]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
