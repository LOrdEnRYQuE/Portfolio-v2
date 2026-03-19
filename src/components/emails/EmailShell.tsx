import React from "react";
import { siteConfig } from "@/content/site";

interface EmailShellProps {
  children: React.ReactNode;
  previewText?: string;
}

export const EmailShell: React.FC<EmailShellProps> = ({ children, previewText }) => {
  const containerStyle: React.CSSProperties = {
    backgroundColor: "#050505",
    color: "#ffffff",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    padding: "40px 20px",
    margin: "0",
    width: "100%",
  };

  const mainStyle: React.CSSProperties = {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#0a0a0a",
    borderRadius: "12px",
    border: "1px solid #1a1a1a",
    overflow: "hidden",
  };

  const headerStyle: React.CSSProperties = {
    padding: "32px",
    background: "linear-gradient(to bottom right, #0a0a0a, #111)",
    borderBottom: "1px solid #1a1a1a",
    textAlign: "center",
  };

  const contentStyle: React.CSSProperties = {
    padding: "32px",
  };

  const footerStyle: React.CSSProperties = {
    padding: "24px 32px",
    backgroundColor: "#050505",
    borderTop: "1px solid #1a1a1a",
    textAlign: "center",
    fontSize: "12px",
    color: "#666",
  };

  const brandStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: "-0.5px",
    margin: "0",
  };

  return (
    <div style={containerStyle}>
      {previewText && (
        <div style={{ display: "none", maxHeight: "0", overflow: "hidden" }}>
          {previewText}
        </div>
      )}
      <div style={mainStyle}>
        <div style={headerStyle}>
          <h1 style={brandStyle}>{siteConfig.brand}</h1>
          <p style={{ color: "#888", fontSize: "14px", margin: "8px 0 0" }}>
            Mission Control Center
          </p>
        </div>
        <div style={contentStyle}>{children}</div>
        <div style={footerStyle}>
          <p style={{ margin: "0" }}>
            © {new Date().getFullYear()} {siteConfig.brand}. All units active.
          </p>
          <p style={{ margin: "4px 0 0" }}>
            {siteConfig.location} • {siteConfig.domain.replace("https://", "")}
          </p>
        </div>
      </div>
    </div>
  );
};
