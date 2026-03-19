import AdminGuard from "@/components/dashboard/AdminGuard";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <DashboardShell variant="admin">
        {children}
      </DashboardShell>
    </AdminGuard>
  );
}
