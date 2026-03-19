"use client";

import DashboardShell from "@/components/dashboard/DashboardShell";
import EmailInbox from "@/components/admin/EmailInbox";
import { Mail } from "lucide-react";

export default function AdminEmailsPage() {
  return (
    <DashboardShell>
      <div className="space-y-8 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-accent-blue/10 border border-accent-blue/20">
              <Mail className="text-accent-blue" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/40">
                Communications
              </h1>
              <p className="text-white/40 mt-1">Manage inquiries, leads, and internal notifications.</p>
            </div>
          </div>
        </div>

        <EmailInbox />
      </div>
    </DashboardShell>
  );
}
