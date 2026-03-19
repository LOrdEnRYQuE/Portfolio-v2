import ClientGuard from "@/components/dashboard/ClientGuard";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientGuard>
      <DashboardShell variant="client">
        {children}
      </DashboardShell>
    </ClientGuard>
  );
}
