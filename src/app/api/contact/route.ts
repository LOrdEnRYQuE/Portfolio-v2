import { NextResponse } from "next/server";
import { Resend } from "resend";
import { siteConfig } from "@/content/site";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_for_builds");

export async function POST(req: Request) {
  try {
    const { 
      name, 
      email, 
      concept, 
      industry, 
      description, 
      features, 
      timeline, 
      budget,
      stack 
    } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Missing required identity fields" }, { status: 400 });
    }

    // 1. Persist to Database (Lead) via Convex
    let leadId = null;
    try {
      leadId = await convex.mutation(api.leads.createLead, {
        name,
        email,
        concept: concept || "Standard Inquiry",
        industry: industry || "Startup",
        description: budget ? `${description}\n\n[Budget Range]: ${budget}` : description,
        features: features || "[]",
        timeline,
        stack: stack || budget,
      });
      console.log("Lead persisted successfully to Convex:", leadId);
    } catch (dbError) {
      console.error("Failed to persist lead to Convex:", dbError);
    }

    // 2. Attempt to send email using Resend
    if (!process.env.RESEND_API_KEY) {
      console.log("No RESEND_API_KEY found. Simulation mode enabled.");
      return NextResponse.json({ 
        success: true, 
        message: "Lead recorded (Simulation).",
        leadId 
      }, { status: 200 });
    }

    const emailContent = `
Mission Briefing: New Lead Captured

Identity: ${name} (${email})
Mission: ${concept || "Direct Sync"}
Industry: ${industry || "N/A"}

Objectives/Features:
${features ? JSON.parse(features).join(", ") : "Standard Build"}

Description:
${description || "No additional data provided."}

Logistics:
- Timeline: ${timeline || "TBD"}
- Budget: ${budget || "TBD"}
- Tech Stack: ${stack || "TBD"}
    `;

    const { data, error } = await resend.emails.send({
      from: `${siteConfig.name} Portfolio <onboarding@resend.dev>`,
      to: [process.env.CONTACT_EMAIL || "lordenryque.dev@gmail.com"],
      subject: `[LEAD] ${concept || "New Sync"} - ${name}`,
      text: emailContent,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ 
        success: true, 
        message: "Lead recorded, but email notification failed.",
        leadId,
        emailError: error 
      }, { status: 200 });
    }

    return NextResponse.json({ success: true, message: "Lead recorded and email sent.", leadId, data }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Contact API Route Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
