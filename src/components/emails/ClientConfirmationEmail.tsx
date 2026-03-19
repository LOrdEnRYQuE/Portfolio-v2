import React from "react";
import { EmailShell } from "./EmailShell";
import { siteConfig } from "@/content/site";

interface ClientConfirmationEmailProps {
  clientName: string;
  concept: string;
}

export const ClientConfirmationEmail: React.FC<ClientConfirmationEmailProps> = ({ clientName, concept }) => {
  return (
    <EmailShell previewText={`Mission Received: We've captured your inquiry for ${concept}`}>
      <h2 style={{ fontSize: "20px", margin: "0 0 24px", color: "#fff" }}>
        Acknowledge: Mission Received
      </h2>

      <p style={{ color: "#ccc", fontSize: "16px", lineHeight: "1.6", margin: "0 0 20px" }}>
        Hello <strong>{clientName}</strong>,
      </p>

      <p style={{ color: "#ccc", fontSize: "16px", lineHeight: "1.6", margin: "0 0 20px" }}>
        We have successfully received your inquiry for <strong>&quot;{concept}&quot;</strong>. 
        Our systems are currently analyzing your requirements at {siteConfig.brand} HQ.
      </p>

      <div style={{ backgroundColor: "#1a1a1a", padding: "20px", borderRadius: "8px", border: "1px solid #333", marginBottom: "24px" }}>
        <p style={{ color: "#fff", fontSize: "14px", margin: "0" }}>
          <strong>Next Phase: Review & Response</strong>
        </p>
        <p style={{ color: "#888", fontSize: "14px", margin: "8px 0 0" }}>
          I personally review every briefing. Expect a response within 24-48 cycles (hours) to discuss the deployment strategy and next steps.
        </p>
      </div>

      <p style={{ color: "#ccc", fontSize: "16px", lineHeight: "1.6", margin: "0 0 32px" }}>
        In the meantime, feel free to review our latest deployments on the portfolio.
      </p>

      <div style={{ textAlign: "center" }}>
        <a
          href={siteConfig.domain}
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
          View Latest Projects
        </a>
      </div>

      <p style={{ color: "#666", fontSize: "14px", margin: "40px 0 0", fontStyle: "italic" }}>
        Stay sharp,<br />
        {siteConfig.name}<br />
        {siteConfig.brand}
      </p>
    </EmailShell>
  );
};
