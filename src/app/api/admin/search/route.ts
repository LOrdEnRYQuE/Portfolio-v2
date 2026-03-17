import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const [agents, projects, assets, leads] = await Promise.all([
      convex.query(api.agents.listAll),
      convex.query(api.internalProjects.listAll),
      convex.query(api.assets.listAll),
      convex.query(api.leads.listAll),
    ]);

    const q = query.toLowerCase();

    const filteredAgents = agents
      .filter((a: { name: string; description?: string }) =>
        a.name.toLowerCase().includes(q) || (a.description || "").toLowerCase().includes(q)
      )
      .slice(0, 5);

    const filteredProjects = projects
      .filter((p: { title: string; description?: string }) =>
        p.title.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q)
      )
      .slice(0, 5);

    const filteredAssets = assets
      .filter((a: { title: string }) => a.title.toLowerCase().includes(q))
      .slice(0, 5);

    const filteredLeads = leads
      .filter((l: { name: string; email: string; industry: string }) =>
        l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.industry.toLowerCase().includes(q)
      )
      .slice(0, 5);

    const results = [
      ...filteredAgents.map((a: { _id: string; name: string; description?: string }) => ({
        id: `agent-${a._id}`,
        title: a.name,
        subtitle: a.description || "Active Agent",
        type: "Agent",
        href: `/admin/agents/${a._id}/edit`,
        category: "Command",
      })),
      ...filteredProjects.map((p: { _id: string; title: string }) => ({
        id: `project-${p._id}`,
        title: p.title,
        subtitle: "Project Command",
        type: "Project",
        href: `/admin/projects/${p._id}`,
        category: "Content",
      })),
      ...filteredAssets.map((as: { _id: string; title: string; type: string }) => ({
        id: `asset-${as._id}`,
        title: as.title,
        subtitle: `${as.type} Asset`,
        type: "Asset",
        href: `/admin/media`,
        category: "Content",
      })),
      ...filteredLeads.map((l: { _id: string; name: string; industry: string }) => ({
        id: `lead-${l._id}`,
        title: l.name,
        subtitle: l.industry || "Individual Lead",
        type: "Lead",
        href: `/admin/leads`,
        category: "Oversight",
      })),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
