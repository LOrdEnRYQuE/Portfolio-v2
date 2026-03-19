import { Resend } from "resend";
import { siteConfig } from "@/content/site";
import React from "react";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  text?: string; // Fallback plain text
}

/**
 * Core email service for the portfolio platform.
 * Supports simulation mode if no API key is present.
 */
export async function sendEmail({ to, subject, react, text }: SendEmailOptions) {
  const isSimulation = !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_dummy_key";

  if (isSimulation) {
    console.log("------------------------------------------");
    console.log("📧 [EMAIL SIMULATION] 📧");
    console.log(`To: ${Array.isArray(to) ? to.join(", ") : to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: (React Component Provided)`);
    if (text) console.log(`Fallback Text: ${text}`);
    console.log("------------------------------------------");
    
    return { 
      success: true, 
      id: "simulation-id",
      message: "Simulation mode: Email logged to console." 
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${siteConfig.brand} <onboarding@resend.dev>`, // Default Resend domain until verified
      to: Array.isArray(to) ? to : [to],
      subject,
      react,
      text: text || "This email requires HTML support to view correctly.",
    });

    if (error) {
      console.error("Resend delivery error:", error);
      return { success: false, error };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error("Critical error in sendEmail:", error);
    return { success: false, error };
  }
}

/**
 * Predefined email targets
 */
export const emailTargets = {
  admin: process.env.ADMIN_EMAIL || siteConfig.email,
};
