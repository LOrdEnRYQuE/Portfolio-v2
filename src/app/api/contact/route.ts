import { NextResponse } from "next/server";
import { convex } from "@/lib/convex";
import { api } from "@convex/_generated/api";


// Import email system
import { sendEmail, emailTargets } from "@/lib/email";
import { AdminNewLeadEmail } from "@/components/emails/AdminNewLeadEmail";
import { ClientConfirmationEmail } from "@/components/emails/ClientConfirmationEmail";

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

    const parsedFeatures = features ? JSON.parse(features) : [];

    // 2. Send Notifications via the new Email System
    // Notification for Admin
    await sendEmail({
      to: emailTargets.admin,
      subject: `[LEAD] ${concept || "New Sync"} - ${name}`,
      react: (AdminNewLeadEmail({
        leadName: name,
        leadEmail: email,
        concept: concept || "Standard Inquiry",
        industry: industry || "Startup",
        description: description || "No additional data provided.",
        features: parsedFeatures,
        timeline: timeline || "TBD",
        budget: budget || "TBD",
      }) as React.ReactElement),
      text: `New lead from ${name}: ${concept}. Contact: ${email}`,
    });

    // Confirmation for Client
    await sendEmail({
      to: email,
      subject: `Mission Received: ${concept || "Your Inquiry"}`,
      react: (ClientConfirmationEmail({
        clientName: name,
        concept: concept || "your project",
      }) as React.ReactElement),
      text: `Hello ${name}, we've received your inquiry for ${concept}. We'll get back to you soon!`,
    });

    // 3. [Unified Inbox] Log inquiry as an internal email in Convex
    try {
      await convex.mutation(api.emails.create, {
        from: email,
        to: emailTargets.admin,
        subject: `[INQUIRY] ${concept || "New Project"}`,
        body: `
          <h3>New Lead Inquiry from ${name}</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Concept:</strong> ${concept || 'Standard'}</p>
          <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
          <p><strong>Timeline:</strong> ${timeline || 'Not specified'}</p>
          <hr/>
          <p>${description || 'No description provided'}</p>
          <p><strong>Tech/Features:</strong> ${parsedFeatures.join(', ')}</p>
        `,
        folder: "INBOX",
        metadata: JSON.stringify({ name, project: concept, type: "lead" }),
      });
    } catch (emailLogError) {
      console.error("Failed to log internal email index:", emailLogError);
    }

    return NextResponse.json({ success: true, message: "Lead recorded and notifications dispatched.", leadId }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Contact API Route Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
