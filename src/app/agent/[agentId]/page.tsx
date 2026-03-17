import AIConcierge from "@/components/ui/AIConcierge";
import { notFound } from "next/navigation";
import { AgentConfig } from "@/components/ui/AIConcierge";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default async function StandaloneAgentPage({
  params,
  searchParams
}: {
  params: Promise<{ agentId: string }>;
  searchParams: Promise<{ embed?: string }>;
}) {
  const { agentId } = await params;
  const { embed } = await searchParams;
  const isEmbed = embed === "true";

  const agent = await convex.query(api.agents.getById, {
    id: agentId as Id<"agents">
  });

  if (!agent) {
    notFound();
  }

  const config = agent.config ? JSON.parse(agent.config) as AgentConfig : {} as AgentConfig;

  return (
    <div className={`fixed inset-0 bg-transparent flex items-end justify-end ${isEmbed ? 'p-0' : 'p-4'}`}>
      <AIConcierge config={config} embedMode={isEmbed} />
    </div>
  );
}
