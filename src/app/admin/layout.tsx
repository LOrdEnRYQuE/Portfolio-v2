"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Cpu, 
  ChevronLeft,
  Bot,
  Loader2,
  Activity,
  ShieldCheck,
  Terminal,
  Zap,
  ImageIcon,
  LogOut,
  User as UserIcon,
  FileText,
  FolderKanban,
  Briefcase,
  Scale,
  Layout,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

import { CommandBar } from "@/components/admin/CommandBar";
import { LOrdEnRYQuEOnboarding } from "@/components/admin/LOrdEnRYQuEOnboarding";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/login?callbackUrl=" + pathname);
  }

  const navSections = [
    {
      title: "Command",
      items: [
        { href: "/admin", label: "Overview", icon: Activity },
        { href: "/admin/agents", label: "Agent Fleet", icon: Bot },
        { href: "/admin/agents/generate", label: "LOrdEnRYQuE Forge", icon: Cpu },
      ]
    },
    {
      title: "Content",
      items: [
        { href: "/admin/projects", label: "Project Command", icon: FolderKanban },
        { href: "/admin/portfolio", label: "Portfolio Hub", icon: Briefcase },
        { href: "/admin/blog", label: "LOrdEnRYQuE Blog", icon: FileText },
        { href: "/admin/media", label: "Media Vault", icon: ImageIcon },
      ]
    },
    {
      title: "Oversight",
      items: [
        { href: "/admin/leads", label: "Lead Hub", icon: Zap },
        { href: "/admin/users", label: "User Fleet", icon: ShieldCheck },
        { href: "/admin/pages", label: "Pages", icon: Layout },
        { href: "/admin/legal", label: "Legal Policy", icon: Scale },
      ]
    },
    {
      title: "System",
      items: [
        { href: "/admin/settings", label: "Settings", icon: Terminal },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex selection:bg-accent/30 selection:text-white">
      {/* Sidebar background glow */}
      <div className="fixed inset-y-0 left-0 w-72 bg-accent/5 blur-[120px] pointer-events-none z-0" />
      
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-2xl hidden lg:flex flex-col p-8 fixed h-screen z-40 transition-all duration-500">
        <div className="space-y-10 flex-1 relative z-10 custom-scrollbar overflow-y-auto pr-2">
          <Link href="/admin" className="flex items-center gap-3 px-2 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:shadow-accent-glow-sm transition-all">
              <Terminal size={20} />
            </div>
            <div>
              <p className="text-sm font-black tracking-tighter uppercase italic leading-tight">Control<span className="text-accent underline decoration-2 underline-offset-4">Panel</span></p>
              <p className="text-[8px] text-white/20 font-black tracking-[0.4em] uppercase">LOrdEnRYQuE Command v3.0</p>
            </div>
          </Link>

          <div className="space-y-8">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-3">
                <p className="px-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">{section.title}</p>
                <nav className="space-y-1.5">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group relative overflow-hidden ${
                          isActive 
                            ? "text-accent shadow-accent-glow-sm" 
                            : "text-white/40 hover:text-white"
                        }`}
                      >
                        {isActive && (
                          <motion.div 
                            layoutId="active-sidebar"
                            className="absolute inset-0 bg-accent/5 border border-accent/20 rounded-2xl" 
                          />
                        )}
                        <item.icon size={18} className={isActive ? "text-accent" : "group-hover:text-accent transition-colors"} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10">{item.label}</span>
                        
                        {isActive && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute right-4 w-1.5 h-1.5 rounded-full bg-accent animate-pulse"
                          />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* Sidebar Status Info */}
          <div className="px-4 space-y-4 pt-4 border-t border-white/5 shrink-0">
             <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-white/20">
                <span>System Health</span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck size={10} />
                  Optimal
                </span>
             </div>
             <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-white/20">
                <span>Core Load</span>
                <span className="text-accent">12.4%</span>
             </div>
             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "12.4%" }}
                  className="h-full bg-accent"
                />
             </div>
          </div>
        </div>

        <div className="space-y-6 pt-8 border-t border-white/5 relative z-10">
          <div className="flex items-center gap-3 px-2">
             <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden group hover:border-white/20 transition-all">
                {session?.user?.image ? (
                  <Image src={session.user.image} alt="" width={40} height={40} className="object-cover" />
                ) : (
                   <div className="text-white/40"><UserIcon size={18} /></div>
                )}
             </div>
             <Link href="/admin/profile" className="flex-1 min-w-0 group/profile">
               <p className="text-[11px] font-black uppercase truncate tracking-tight group-hover/profile:text-accent transition-colors">{session?.user?.name || 'Admin'}</p>
               <p className="text-[8px] text-white/30 truncate uppercase tracking-tighter">Level 4 Oversight</p>
             </Link>
          </div>
          
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 text-[9px] font-black text-white/20 hover:text-white transition-colors uppercase tracking-[0.2em] px-2 py-2">
              <ChevronLeft size={12} /> Exit Command Center
            </Link>
            <button 
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 text-[9px] font-black text-red-500/40 hover:text-red-500 transition-colors uppercase tracking-[0.2em] px-2 py-2 w-full text-left"
            >
              <LogOut size={12} /> Terminal Shutdown (Logout)
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-72 relative z-10">
        <div className="absolute inset-0 bg-linear-to-b from-accent/2 to-transparent pointer-events-none" />
        <CommandBar />
        <LOrdEnRYQuEOnboarding />
        {children}
      </main>
    </div>
  );
}
