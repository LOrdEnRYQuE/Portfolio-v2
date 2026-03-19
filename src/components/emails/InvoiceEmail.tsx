import React from "react";
import { EmailShell } from "./EmailShell";
import { siteConfig } from "@/content/site";

interface InvoiceEmailProps {
  clientName: string;
  invoiceNumber: string;
  projectTitle: string;
  amount: string;
  dueDate: string;
  invoiceUrl: string;
}

export const InvoiceEmail: React.FC<InvoiceEmailProps> = (props) => {
  const { clientName, invoiceNumber, projectTitle, amount, dueDate, invoiceUrl } = props;

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#1a1a1a",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #333",
    marginBottom: "32px",
    textAlign: "center",
  };

  const amountStyle: React.CSSProperties = {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#4ade80",
    margin: "8px 0",
  };

  return (
    <EmailShell previewText={`Invoice ${invoiceNumber} for ${projectTitle} is ready.`}>
      <h2 style={{ fontSize: "20px", margin: "0 0 24px", color: "#fff" }}>
        Financial Node: Invoice Issued
      </h2>

      <p style={{ color: "#ccc", fontSize: "16px", lineHeight: "1.6", margin: "0 0 20px" }}>
        Hello <strong>{clientName}</strong>,
      </p>

      <p style={{ color: "#ccc", fontSize: "16px", lineHeight: "1.6", margin: "0 0 32px" }}>
        The invoice for phase deployment of <strong>{projectTitle}</strong> has been generated and is ready for clearance.
      </p>

      <div style={cardStyle}>
        <span style={{ fontSize: "12px", textTransform: "uppercase", color: "#666", letterSpacing: "1px" }}>
          Amount Due
        </span>
        <div style={amountStyle}>{amount}</div>
        <div style={{ fontSize: "14px", color: "#888" }}>
          Invoice: {invoiceNumber} • Due: {dueDate}
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <a
          href={invoiceUrl}
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
          View & Pay Invoice
        </a>
      </div>

      <div style={{ backgroundColor: "#050505", padding: "16px", borderRadius: "8px", fontSize: "13px", color: "#666" }}>
        <p style={{ margin: "0" }}>
          <strong>Note:</strong> Access to the development environment or final source code may be restricted until invoice settlement is confirmed.
        </p>
      </div>

      <p style={{ color: "#666", fontSize: "14px", margin: "40px 0 0", fontStyle: "italic" }}>
        Best regards,<br />
        {siteConfig.name}<br />
        {siteConfig.brand}
      </p>
    </EmailShell>
  );
};
