import React from "react";
import { EmailShell } from "./EmailShell";

interface AdminNewLeadEmailProps {
  leadName: string;
  leadEmail: string;
  concept: string;
  industry: string;
  description: string;
  features: string[];
  timeline: string;
  budget: string;
}

export const AdminNewLeadEmail: React.FC<AdminNewLeadEmailProps> = (props) => {
  const { leadName, leadEmail, concept, industry, description, features, timeline, budget } = props;

  const rowStyle: React.CSSProperties = {
    marginBottom: "16px",
    paddingBottom: "16px",
    borderBottom: "1px solid #1a1a1a",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "12px",
    textTransform: "uppercase",
    color: "#666",
    letterSpacing: "1px",
    marginBottom: "4px",
    display: "block",
  };

  const valueStyle: React.CSSProperties = {
    fontSize: "16px",
    color: "#fff",
    margin: "0",
  };

  const badgeStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "4px 10px",
    backgroundColor: "#1a1a1a",
    borderRadius: "20px",
    fontSize: "12px",
    color: "#888",
    marginRight: "6px",
    marginBottom: "6px",
  };

  return (
    <EmailShell previewText={`New project inquiry from ${leadName}: ${concept}`}>
      <h2 style={{ fontSize: "20px", margin: "0 0 24px", color: "#fff" }}>
        Target Identified: New Lead Incoming
      </h2>

      <div style={rowStyle}>
        <span style={labelStyle}>Identity</span>
        <p style={valueStyle}>
          <strong>{leadName}</strong> ({leadEmail})
        </p>
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>Objective</span>
        <p style={valueStyle}>{concept}</p>
        <p style={{ color: "#888", fontSize: "14px", margin: "4px 0 0" }}>{industry}</p>
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>Operational Details</span>
        <p style={{ color: "#ccc", fontSize: "15px", lineHeight: "1.5", margin: "0" }}>
          {description}
        </p>
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>Requested Systems</span>
        <div style={{ marginTop: "8px" }}>
          {features.length > 0 ? (
            features.map((f, i) => (
              <span key={i} style={badgeStyle}>
                {f}
              </span>
            ))
          ) : (
            <span style={{ color: "#666" }}>Standard Implementation</span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <span style={labelStyle}>Timeline</span>
          <p style={valueStyle}>{timeline}</p>
        </div>
        <div style={{ flex: 1 }}>
          <span style={labelStyle}>Budget Range</span>
          <p style={{ ...valueStyle, color: "#4ade80" }}>{budget}</p>
        </div>
      </div>

      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <a
          href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/admin/leads`}
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
          Open Admin Panel
        </a>
      </div>
    </EmailShell>
  );
};
