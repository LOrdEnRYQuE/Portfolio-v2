import React from "react";
import { EmailShell } from "./EmailShell";
import { siteConfig } from "@/content/site";

interface WelcomeClientEmailProps {
  clientName: string;
}

export const WelcomeClientEmail: React.FC<WelcomeClientEmailProps> = ({ clientName }) => {
  return (
    <EmailShell previewText={`Welcome to the units, ${clientName}. Your client portal is active.`}>
      <h2 style={{ fontSize: "20px", margin: "0 0 24px", color: "#fff" }}>
        Protocol Alpha: Client Access Granted
      </h2>

      <p style={{ color: "#ccc", fontSize: "16px", lineHeight: "1.6", margin: "0 0 20px" }}>
        Greetings <strong>{clientName}</strong>,
      </p>

      <p style={{ color: "#ccc", fontSize: "16px", lineHeight: "1.6", margin: "0 0 24px" }}>
        Your identity has been verified and your status has been upgraded to <strong>Client</strong>. 
        You now have full access to our project infrastructure and secure communication channels.
      </p>

      <div style={{ backgroundColor: "#1a1a1a", padding: "20px", borderRadius: "8px", border: "1px solid #333", marginBottom: "32px" }}>
        <p style={{ color: "#fff", fontSize: "14px", margin: "0" }}>
          <strong>Your Portal is Active</strong>
        </p>
        <p style={{ color: "#888", fontSize: "14px", margin: "8px 0 0" }}>
          You can now track project milestones, review deployments, sign agreements, and manage billing directly from your dashboard.
        </p>
      </div>

      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <a
          href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/portal`}
          style={{
            backgroundColor: "#fff",
            color: "#000",
            padding: "12px 32px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "14px",
            display: "inline-block",
          }}
        >
          Access Client Portal
        </a>
      </div>

      <p style={{ color: "#ccc", fontSize: "14px", lineHeight: "1.6", margin: "0" }}>
        Sign in with the email address used for your inquiry to view your first mission details.
      </p>

      <p style={{ color: "#666", fontSize: "14px", margin: "40px 0 0", fontStyle: "italic" }}>
        Ready for operation,<br />
        {siteConfig.name}<br />
        {siteConfig.brand}
      </p>
    </EmailShell>
  );
};
