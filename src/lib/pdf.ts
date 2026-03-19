import { jsPDF } from "jspdf";

export interface ContractData {
  title: string;
  content: string;
  status?: string;
  language?: string;
  signatureData?: string;
  clientName?: string;
  signedAt?: number;
}

/**
 * Downloads a professional PDF of a contract.
 * @param contract The contract data from Convex
 */
export async function downloadContractPDF(contract: ContractData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set Metadata
  doc.setProperties({
    title: contract.title,
    subject: "Legal Contract",
    author: "LOrdEnRYQuE Portfolio",
  });

  // Design tokens
  const margin = 20;
  const pageWidth = 210;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = 25;

  // Header - Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  const title = (contract.title || "CONTRACT").toUpperCase();
  doc.text(title, margin, cursorY);
  cursorY += 15;

  // Meta Info (Status, Date, Language)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Status: ${contract.status || "DRAFT"}`, margin, cursorY);
  doc.text(`Language: ${contract.language || "EN"}`, margin + 60, cursorY);
  doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin - 50, cursorY);
  cursorY += 8;

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 15;

  // Content rendering
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  const lines = (contract.content || "").split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Page breaking check
    if (cursorY > 270) {
      doc.addPage();
      cursorY = 20;
    }

    if (line.startsWith("# ")) {
      // H1
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(line.replace("# ", ""), margin, cursorY);
      cursorY += 12;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
    } else if (line.startsWith("## ")) {
      // H2
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(line.replace("## ", ""), margin, cursorY);
      cursorY += 10;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
    } else if (line.startsWith("### ")) {
      // H3
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(line.replace("### ", ""), margin, cursorY);
      cursorY += 8;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
    } else if (line === "---") {
      // Divider
      doc.setDrawColor(230, 230, 230);
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 10;
    } else if (line === "") {
      // Empty line / paragraph break
      cursorY += 4;
    } else if (line.startsWith("- ")) {
      // List item
      const itemText = line.replace("- ", "• ");
      const wrappedItem = doc.splitTextToSize(itemText, contentWidth - 5);
      doc.text(wrappedItem, margin + 5, cursorY);
      cursorY += wrappedItem.length * 5 + 2;
    } else {
      // Normal paragraph
      // Simplified bold handling (stripping for now for clean PDF)
      const cleanLine = line.replace(/\*\*/g, ""); 
      const wrappedText = doc.splitTextToSize(cleanLine, contentWidth);
      doc.text(wrappedText, margin, cursorY);
      cursorY += wrappedText.length * 5 + 3;
    }
  }

  // Signature Section
  if (contract.signatureData) {
    if (cursorY > 230) {
      doc.addPage();
      cursorY = 20;
    }
    
    cursorY += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("CLIENT SIGNATURE:", margin, cursorY);
    cursorY += 5;
    
    try {
      // signatureData is likely a base64 string
      doc.addImage(contract.signatureData, "PNG", margin, cursorY, 60, 30);
      cursorY += 35;
    } catch (e) {
      console.error("PDF Signature Error:", e);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(150, 0, 0);
      doc.text("[Image Signature Placeholder]", margin, cursorY);
      doc.setTextColor(0, 0, 0);
      cursorY += 10;
    }
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Signed by: ${contract.clientName || "Authorized Representative"}`, margin, cursorY);
    cursorY += 5;
    if (contract.signedAt) {
      doc.text(`Signed on: ${new Date(contract.signedAt).toLocaleString()}`, margin, cursorY);
    }
  }

  // Page Numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, 287, { align: "center" });
    doc.text("LOrdEnRYQuE Portfolio — Legal Documents", margin, 287);
  }

  // Final Download
  const filename = `${contract.title.replace(/\s+/g, "_") || "Contract"}.pdf`;
  doc.save(filename);
}
