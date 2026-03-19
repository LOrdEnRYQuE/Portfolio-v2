import { jsPDF } from "jspdf";

export interface WizardData {
  projectName: string;
  projectId?: string;
  client: {
    name: string;
    company: string;
    address: string;
    contact: string;
  };
  metadata: {
    number: string;
    issueDate: string;
    dueDate: string;
  };
  stack: {
    frontend: string;
    backend: string;
    database: string;
    infrastructure: string;
    licenses: string[];
  };
  deliverables: {
    pages: string[];
    responsive: boolean;
    cms: string;
    adminPanel: boolean;
  };
  features: {
    core: string[];
    services: string[];
    qa: string[];
    postLaunch: string[];
  };
  financials: {
    billingModel: "fixed" | "hourly";
    hourlyRate?: number;
    hoursWorked?: number;
    subtotal: number;
    discount?: number;
    deposit?: number;
    taxRate: number;
    total: number;
    paymentInstructions: string;
  };
}

export interface InvoiceData {
  number: string;
  projectName?: string;
  amount: number;
  currency: string;
  dueDate: string;
  description?: string;
  details?: string; // JSON string of WizardData
  user?: { name?: string; email?: string } | null;
}

/**
 * Generates and downloads a professional Developer Invoice PDF.
 */
export async function downloadDeveloperInvoicePDF(invoice: InvoiceData) {
  const data: WizardData = invoice.details ? JSON.parse(invoice.details) : null;
  
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Design Tokens
  const margin = 20;
  const pageWidth = 210;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = 25;

  const primaryColor = [30, 41, 59]; // slate-800
  const accentColor = [59, 130, 246]; // blue-500
  const lightGrey = [241, 245, 249]; // slate-100

  // 1. Header (Logo/Brand & Invoice Title)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("INVOICE", margin, cursorY);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`#${invoice.number}`, margin, cursorY + 7);
  
  // Brand right-aligned
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text("LOrdEnRYQuE", pageWidth - margin, cursorY, { align: "right" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Full-Stack Developer • AI Engineer", pageWidth - margin, cursorY + 5, { align: "right" });
  
  cursorY += 25;

  // 2. Client & Project Info
  if (data) {
    // Left: Billing To
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("BILL TO:", margin, cursorY);
    doc.setFont("helvetica", "normal");
    cursorY += 5;
    doc.text(data.client.name, margin, cursorY);
    cursorY += 5;
    if (data.client.company) {
      doc.text(data.client.company, margin, cursorY);
      cursorY += 5;
    }
    const splitAddress = doc.splitTextToSize(data.client.address, 70);
    doc.text(splitAddress, margin, cursorY);
    cursorY += splitAddress.length * 5;

    // Right: Project Details
    let projectY = cursorY - (splitAddress.length * 5 + 10);
    doc.setFont("helvetica", "bold");
    doc.text("PROJECT:", pageWidth / 2, projectY);
    doc.setFont("helvetica", "normal");
    doc.text(data.projectName || invoice.projectName || "Web Development", pageWidth / 2, projectY + 5);
    doc.setFont("helvetica", "bold");
    doc.text("DUE DATE:", pageWidth / 2, projectY + 15);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.dueDate, pageWidth / 2, projectY + 20);
  } else {
    // Fallback for simple invoices
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", margin, cursorY);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.user?.name || "Valued Client", margin, cursorY + 5);
    doc.text(invoice.user?.email || "", margin, cursorY + 10);
    
    doc.setFont("helvetica", "bold");
    doc.text("DUE DATE:", pageWidth / 2, cursorY);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.dueDate, pageWidth / 2, cursorY + 5);
    cursorY += 20;
  }

  cursorY = Math.max(cursorY, 80);

  // 3. Technical Specifications Section (If detail data exists)
  if (data) {
    doc.setFillColor(lightGrey[0], lightGrey[1], lightGrey[2]);
    doc.rect(margin, cursorY, contentWidth, 40, "F");
    
    let techY = cursorY + 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("TECHNICAL STACK", margin + 5, techY);
    doc.text("INFRASTRUCTURE", pageWidth / 2, techY);
    
    techY += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(70, 70, 70);
    doc.text(`Frontend: ${data.stack.frontend}`, margin + 5, techY);
    doc.text(`Hosting: ${data.stack.infrastructure}`, pageWidth / 2, techY);
    
    techY += 5;
    doc.text(`Backend: ${data.stack.backend}`, margin + 5, techY);
    if (data.deliverables.cms) doc.text(`CMS: ${data.deliverables.cms}`, pageWidth / 2, techY);
    
    techY += 5;
    doc.text(`Database: ${data.stack.database}`, margin + 5, techY);
    if (data.deliverables.responsive) doc.text("Optimized for Mobile/Tablet", pageWidth / 2, techY);

    cursorY += 50;
  }

  // 4. Line Items / Deliverables
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("DESCRIPTION", margin, cursorY);
  doc.text("AMOUNT", pageWidth - margin, cursorY, { align: "right" });
  
  cursorY += 3;
  doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 7;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  if (data) {
    // Detailed items from deliverables and features
    const sections = [
      { label: "Core Build", items: data.deliverables.pages },
      { label: "Features", items: data.features.core },
      { label: "Services", items: [...data.features.services, ...data.features.qa] }
    ];

    sections.forEach(sec => {
      if (sec.items.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(sec.label.toUpperCase(), margin, cursorY);
        cursorY += 5;
        doc.setFont("helvetica", "normal");
        sec.items.forEach(item => {
          doc.text(`• ${item}`, margin + 2, cursorY);
          cursorY += 5;
        });
        cursorY += 2;
      }
    });

    // Pricing Row
    cursorY += 5;
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 8;
    doc.setFont("helvetica", "bold");
    doc.text(invoice.projectName || "Standard Development Package", margin, cursorY);
    doc.text(`${invoice.amount.toLocaleString()} ${invoice.currency}`, pageWidth - margin, cursorY, { align: "right" });
  } else {
    // Simple line item
    doc.text(invoice.description || "Professional Services", margin, cursorY);
    doc.text(`${invoice.amount.toLocaleString()} ${invoice.currency}`, pageWidth - margin, cursorY, { align: "right" });
  }

  cursorY += 20;

  // 5. Summary & Totals
  if (cursorY > 230) {
    doc.addPage();
    cursorY = 20;
  }

  const summaryX = pageWidth - margin - 60;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  if (data) {
    doc.text("Subtotal:", summaryX, cursorY);
    doc.text(`${data.financials.subtotal.toLocaleString()} ${invoice.currency}`, pageWidth - margin, cursorY, { align: "right" });
    cursorY += 7;

    if (data.financials.discount) {
      doc.setTextColor(200, 0, 0);
      doc.text("Discount:", summaryX, cursorY);
      doc.text(`-${data.financials.discount.toLocaleString()} ${invoice.currency}`, pageWidth - margin, cursorY, { align: "right" });
      doc.setTextColor(0, 0, 0);
      cursorY += 7;
    }

    if (data.financials.deposit) {
      doc.text("Deposit Paid:", summaryX, cursorY);
      doc.text(`-${data.financials.deposit.toLocaleString()} ${invoice.currency}`, pageWidth - margin, cursorY, { align: "right" });
      cursorY += 7;
    }

    doc.text(`Tax (${data.financials.taxRate}%):`, summaryX, cursorY);
    const taxAmt = (invoice.amount * data.financials.taxRate) / 100;
    doc.text(`${taxAmt.toLocaleString()} ${invoice.currency}`, pageWidth - margin, cursorY, { align: "right" });
    cursorY += 10;
  }

  // Final Total
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.rect(summaryX - 5, cursorY - 5, 65, 12, "F");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL DUE:", summaryX, cursorY + 3);
  doc.text(`${invoice.amount.toLocaleString()} ${invoice.currency}`, pageWidth - margin, cursorY + 3, { align: "right" });

  cursorY += 25;

  // 6. Payment Instructions
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(10);
  doc.text("PAYMENT INSTRUCTIONS:", margin, cursorY);
  cursorY += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  const instructions = data?.financials.paymentInstructions || "Please settle via bank transfer to the details provided in our service agreement.";
  const splitInstructions = doc.splitTextToSize(instructions, 120);
  doc.text(splitInstructions, margin, cursorY);

  // Footer / Page Numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, 287, { align: "center" });
    doc.text("Generated by LOrdEnRYQuE Portfolio Invoice Wizard", margin, 287);
  }

  const filename = `Invoice_${invoice.number}.pdf`;
  doc.save(filename);
}
