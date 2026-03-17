"use client";

import { useSession, signOut } from "next-auth/react";
import { useI18n } from "@/lib/i18n";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  LucideIcon,
  ChevronLeft,
  User,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const navItems = [
    { href: "/client", label: t("portal.nav.overview") || "Overview", icon: LayoutDashboard },
    { href: "/client/documents", label: t("portal.nav.docs") || "Documents", icon: FileText },
    { href: "/client/support", label: t("portal.nav.support") || "Support", icon: MessageSquare },
    { href: "/client/settings", label: t("portal.nav.settings") || "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#080B10] text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black/30 backdrop-blur-2xl hidden lg:flex flex-col p-6 fixed h-screen z-40">
        {/* Brand */}
        <Link href="/client" className="flex items-center gap-3 mb-8 px-2 group">
          <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:shadow-accent-glow-sm transition-all">
            <LayoutDashboard size={18} />
          </div>
          <div>
            <p className="text-xs font-black tracking-tight uppercase italic leading-tight">
              Client <span className="text-accent">Portal</span>
            </p>
            <p className="text-[9px] text-white/20 font-bold tracking-widest uppercase">LOrdEnRYQuE</p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                  isActive ? "text-accent" : "text-white/40 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="client-active"
                    className="absolute inset-0 bg-accent/8 border border-accent/15 rounded-xl"
                  />
                )}
                <item.icon
                  size={17}
                  className={`relative z-10 transition-colors ${isActive ? "text-accent" : "group-hover:text-white/70"}`}
                />
                <span className="relative z-10 text-[11px] font-bold uppercase tracking-wider">
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute right-3 w-1.5 h-1.5 rounded-full bg-accent"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
              {session?.user?.image ? (
                <Image src={session.user.image} alt="" width={32} height={32} className="object-cover" />
              ) : (
                <User size={14} className="text-white/40" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-white truncate">{session?.user?.name ?? "Client"}</p>
              <p className="text-[9px] text-white/30 truncate">{session?.user?.email}</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Link href="/" className="flex items-center gap-2 text-[10px] font-bold text-white/30 hover:text-white transition-colors px-2 py-1.5 rounded-lg">
              <ChevronLeft size={12} /> Back to Site
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-[10px] font-bold text-red-500/40 hover:text-red-500 transition-colors px-2 py-1.5 rounded-lg w-full text-left"
            >
              <LogOut size={12} /> {t("portal.sign_out") || "Sign Out"}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64 pt-8 pb-16 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

// Kept for backwards compatibility if anything imports it
export function SidebarItem({
  icon: Icon,
  label,
  active = false,
  href,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  href: string;
}) {
  return (
    <Link href={href}>
      <div
        className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
          active ? "bg-accent/10 text-accent font-bold" : "text-white/40 hover:text-white hover:bg-white/5"
        }`}
      >
        <Icon size={18} />
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />}
      </div>
    </Link>
  );
}
