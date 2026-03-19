import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { InvoiceEmail } from "@/components/emails/InvoiceEmail";
import { ContractReadyEmail } from "@/components/emails/ContractReadyEmail";
import { WelcomeClientEmail } from "@/components/emails/WelcomeClientEmail";
import { siteConfig } from "@/content/site";

export async function POST(req: Request) {
  try {
    const { type, data } = await req.json();

    if (type === "invoice") {
      const { clientName, clientEmail, invoiceNumber, projectTitle, amount, dueDate, invoiceId } = data;
      
      const invoiceUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/portal/invoices/${invoiceId}`;

      await sendEmail({
        to: clientEmail,
        subject: `Invoice ${invoiceNumber} from ${siteConfig.brand}`,
        react: (InvoiceEmail({
          clientName,
          invoiceNumber,
          projectTitle,
          amount,
          dueDate,
          invoiceUrl,
        }) as React.ReactElement),
        text: `Hello ${clientName}, your invoice ${invoiceNumber} for ${amount} is ready. View it here: ${invoiceUrl}`,
      });

      return NextResponse.json({ success: true });
    }

    if (type === "contract") {
      const { clientName, clientEmail, projectTitle, contractId } = data;
      
      const contractUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/portal/contracts/${contractId}`;

      await sendEmail({
        to: clientEmail,
        subject: `Contract Ready: ${projectTitle}`,
        react: (ContractReadyEmail({
          clientName,
          projectTitle,
          contractUrl,
        }) as React.ReactElement),
        text: `Hello ${clientName}, the contract for ${projectTitle} is ready for review. View it here: ${contractUrl}`,
      });

      return NextResponse.json({ success: true });
    }

    if (type === "welcome") {
      const { clientName, clientEmail } = data;
      
      await sendEmail({
        to: clientEmail,
        subject: `Welcome to ${siteConfig.brand} - Your Profile is Active`,
        react: (WelcomeClientEmail({
          clientName,
        }) as React.ReactElement),
        text: `Hello ${clientName}, welcome to ${siteConfig.brand}! Your client portal is now active. Access it here: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/portal`,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid email type" }, { status: 400 });
  } catch (error) {
    console.error("Email API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
