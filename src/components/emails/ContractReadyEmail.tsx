import React from "react";
import { EmailShell } from "./EmailShell";
import { siteConfig } from "@/content/site";

interface ContractReadyEmailProps {
  clientName: string;
  projectTitle: string;
  contractUrl: string;
}

export const ContractReadyEmail: React.FC<ContractReadyEmailProps> = (props) => {
  const { clientName, projectTitle, contractUrl } = props;

  return (
    <EmailShell previewText={`The contract for ${projectTitle} is ready for your signature.`}>
      <h2 style={{ fontSize: "20px", margin: "0 0 24px", color: "#fff" }}>
        Legal Protocol: Contract Ready
      </h2>

      <p style={{ color: "#ccc", fontSize: "16px", lineHeight: "1.6", margin: "0 0 20px" }}>
        Hello <strong>{clientName}</strong>,
      </p>

      <p style={{ color: "#ccc", fontSize: "16px", lineHeight: "1.6", margin: "0 0 24px" }}>
        The service agreement and project scope for <strong>{projectTitle}</strong> have been finalized and are ready for digital execution.
      </p>

      <div style={{ backgroundColor: "#1a1a1a", padding: "20px", borderRadius: "8px", borderLeft: "4px solid #fff", marginBottom: "32px" }}>
        <p style={{ color: "#fff", fontSize: "14px", margin: "0" }}>
          <strong>Action Required: Signature</strong>
        </p>
        <p style={{ color: "#888", fontSize: "14px", margin: "8px 0 0" }}>
          Please review the terms, deliverables, and timeline. Once signed, our engineering team will begin the primary deployment phase.
        </p>
      </div>

      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <a
          href={contractUrl}
          style={{
            backgroundColor: "#fff",
            color: "#000",
            padding: "14px 40px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "14px",
            display: "inline-block",
          }}
        >
          Review & Sign Contract
        </a>
      </div>

      <p style={{ color: "#ccc", fontSize: "14px", lineHeight: "1.6", margin: "0" }}>
        If you have any technical questions regarding the specified tech stack or deliverables, please reply to this transmission directly.
      </p>

      <p style={{ color: "#666", fontSize: "14px", margin: "40px 0 0", fontStyle: "italic" }}>
        Ready for deployment,<br />
        {siteConfig.name}<br />
        {siteConfig.brand}
      </p>
    </EmailShell>
  );
};
