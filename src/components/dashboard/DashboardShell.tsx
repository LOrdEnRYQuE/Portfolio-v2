"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import {
  LayoutDashboard, Users, MessageSquare, FileText, FolderKanban,
  Settings, LogOut, Menu, X, ChevronLeft, Ticket, Receipt,
  User, Briefcase, Mail, Laptop, Building2, ArrowRightLeft, type LucideIcon,
  ImageIcon, LineChart
} from "lucide-react";
import type { Session } from "next-auth";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const adminNav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics & GEO", icon: LineChart },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/leads", label: "Leads", icon: MessageSquare },
  { href: "/admin/emails", label: "Emails", icon: Mail },
  { href: "/admin/services", label: "Services", icon: Laptop },
  { href: "/admin/industries", label: "Industries", icon: Building2 },
  { href: "/admin/portfolio", label: "Portfolio", icon: FolderKanban },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/redirects", label: "Redirects", icon: ArrowRightLeft },
  { href: "/admin/contracts", label: "Contracts", icon: FileText },
  { href: "/admin/invoices", label: "Invoices", icon: Receipt },
  { href: "/admin/settings", label: "Settings", icon: Settings },

];

const clientNav: NavItem[] = [
  { href: "/client", label: "Dashboard", icon: LayoutDashboard },
  { href: "/client/project", label: "My Project", icon: Briefcase },
  { href: "/client/contracts", label: "Contracts", icon: FileText },
  { href: "/client/tickets", label: "Support", icon: Ticket },
  { href: "/client/invoices", label: "Invoices", icon: Receipt },
  { href: "/client/profile", label: "Profile", icon: User },
];

interface SidebarContentProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  title: string;
  navItems: NavItem[];
  session: Session | null;
  isActive: (href: string) => boolean;
  setMobileOpen: (val: boolean) => void;
}

const SidebarContent = ({
  collapsed,
  setCollapsed,
  title,
  navItems,
  session,
  isActive,
  setMobileOpen,
}: SidebarContentProps) => (
  <div className="flex flex-col h-full">
    <div className="p-6 border-b border-white/5">
      <div className="flex items-center justify-between">
        {!collapsed && (
          <h2 className="text-sm font-bold text-white tracking-tight">{title}</h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all"
        >
          <ChevronLeft size={16} className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>
    </div>

    <nav className="flex-1 p-4 space-y-1">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              active
                ? "bg-accent-blue/15 text-accent-blue"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <item.icon size={18} />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>

    <div className="p-4 border-t border-white/5">
      {!collapsed && session?.user && (
        <div className="mb-3 px-4">
          <p className="text-xs font-bold text-white/60 truncate">{session.user.name || session.user.email}</p>
          <p className="text-[10px] text-white/30 uppercase tracking-widest">
            {(session.user as { role?: string })?.role || "USER"}
          </p>
        </div>
      )}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
      >
        <LogOut size={18} />
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
  </div>
);

interface DashboardShellProps {
  children: React.ReactNode;
  variant: "admin" | "client";
}

export default function DashboardShell({ children, variant }: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = variant === "admin" ? adminNav : clientNav;
  const title = variant === "admin" ? "Control Panel" : "Client Portal";

  const isActive = (href: string) => {
    if (href === `/${variant}`) return pathname === href;
    return pathname?.startsWith(href) ?? false;
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[#080B10]">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:flex flex-col fixed left-0 top-0 h-screen border-r border-white/5 bg-[#0A0E14] z-40 transition-all duration-300 ${
            collapsed ? "w-20" : "w-64"
          }`}
        >
          <SidebarContent 
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            title={title}
            navItems={navItems}
            session={session}
            isActive={isActive}
            setMobileOpen={setMobileOpen}
          />
        </aside>

        {/* Mobile Top Bar */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0A0E14] border-b border-white/5 z-40 flex items-center justify-between px-6">
          <h2 className="text-sm font-bold text-white">{title}</h2>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-white/50 hover:text-white transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="md:hidden fixed left-0 top-0 h-screen w-72 bg-[#0A0E14] border-r border-white/5 z-50"
              >
                <SidebarContent 
                  collapsed={false}
                  setCollapsed={() => {}}
                  title={title}
                  navItems={navItems}
                  session={session ?? null}
                  isActive={isActive}
                  setMobileOpen={setMobileOpen}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main
          className={`transition-all duration-300 ${
            collapsed ? "md:ml-20" : "md:ml-64"
          } pt-20 md:pt-8 px-6 md:px-10 pb-12`}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </LazyMotion>
  );
}
