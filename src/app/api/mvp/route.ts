import { NextResponse } from "next/server";
import { convex } from "@/lib/convex";
import { api } from "@convex/_generated/api";


export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Persist the lead in the database
    const leadId = await convex.mutation(api.leads.createLead, {
      name: data.name,
      email: data.email,
      concept: data.concept,
      industry: data.industry,
      description: data.description,
      features: JSON.stringify(data.features),
      timeline: data.timeline,
      stack: data.stack,
    });

    console.log("Blueprint Lead Persisted:", leadId);

    // Generate a simple Blueprint summary
    const blueprint = {
      title: `Blueprint: ${data.concept}`,
      generatedAt: new Date().toISOString(),
      client: data.name,
      contact: data.email,
      roadmap: [
        { phase: "Infrastructure", tasks: ["Setup Next.js", "Convex DB", "Auth Configuration"] },
        { phase: "Core Features", tasks: data.features.map((f: string) => `Implement ${f} module`) },
        { phase: "Deployment", tasks: ["Cloud Run Setup", "CI/CD Pipeline"] }
      ],
      timeline: data.timeline,
    };

    return NextResponse.json({ 
      success: true, 
      message: "Blueprint forged successfully",
      blueprint 
    });
  } catch (error) {
    console.error("Blueprint Forging Failed:", error);
    return NextResponse.json({ success: false, error: "Failed to forge blueprint" }, { status: 500 });
  }
}
