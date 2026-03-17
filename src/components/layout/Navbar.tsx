"use client";

import Link from "next/link";
import { useState, useEffect, memo } from "react";
import { usePathname } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, LogOut } from "lucide-react";
import { siteConfig } from "@/content/site";
import { useI18n } from "@/lib/i18n";
import { useSession, signOut } from "next-auth/react";

const BubbleEffect = memo(({ count = 12, isMobile = false }: { count?: number; isMobile?: boolean }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(count)].map((_, i) => (
      <m.div
        key={`bubble-${isMobile ? 'm' : 'd'}-${i}`}
        animate={{
          y: isMobile ? [-15, 90, -15] : [-30, 120, -30],
          x: [
            Math.sin(i * 0.8) * (isMobile ? 25 : 40),
            Math.cos(i * 0.6) * (isMobile ? 20 : 35),
            Math.sin(i * 1.2) * (isMobile ? 30 : 45),
            Math.cos(i * 0.9) * (isMobile ? 25 : 30),
          ],
          scale: [0.6, 1.3, 0.8, 1.1, 0.6],
          opacity: [0.15, 0.5, 0.25, 0.6, 0.15],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: (isMobile ? 8 : 10) + i * 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.4,
        }}
        className={`absolute rounded-full backdrop-blur-sm ${
          i % 4 === 0 ? 'w-3 h-3 bg-accent-silver/25' :
          i % 4 === 1 ? 'w-2 h-2 bg-accent-blue/20' :
          i % 4 === 2 ? 'w-1.5 h-1.5 bg-accent-green/15' :
          'w-2 h-2 bg-accent-purple/20'
        }`}
        style={{
          left: `${10 + (i * 7.5)}%`,
          top: `${-15 + (i % 4) * 12}%`,
        }}
      />
    ))}
    
    <m.div
      animate={{
        background: [
          "linear-gradient(45deg, rgba(148,163,184,0.12) 0%, transparent 30%, rgba(59,130,246,0.08) 60%, transparent 100%)",
          "linear-gradient(90deg, rgba(59,130,246,0.08) 0%, transparent 40%, rgba(16,185,129,0.12) 70%, transparent 100%)",
          "linear-gradient(135deg, rgba(16,185,129,0.10) 0%, transparent 35%, rgba(139,92,246,0.06) 65%, transparent 100%)",
          "linear-gradient(180deg, rgba(139,92,246,0.14) 0%, transparent 25%, rgba(148,163,184,0.09) 55%, transparent 100%)",
        ],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "linear",
      }}
      className="absolute inset-0"
    />
  </div>
));

BubbleEffect.displayName = "BubbleEffect";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale, setLocale, t } = useI18n();
  const [dynamicLinks, setDynamicLinks] = useState<{ href: string; label: string }[]>([]);
  const [brand, setBrand] = useState(siteConfig.brand);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch navigation
        const navRes = await fetch("/api/navigation");
        const navData = await navRes.json();
        if (Array.isArray(navData)) {
          setDynamicLinks(navData.map((p: { slug: string; title: string }) => ({ href: `/${p.slug}`, label: p.title })));
        }

        // Fetch settings
        const settingsRes = await fetch("/api/admin/settings");
        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          if (settings.brand) setBrand(settings.brand);
        }
      } catch (error) {
        console.error("Failed to fetch nav or settings", error);
      }
    };
    fetchData();
  }, []);

  const systemLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/projects", label: t("nav.projects") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/demo-branches", label: t("nav.demos") },
  ];

  const adminLinks = status === "authenticated" ? [
    ...(session?.user?.role === "ADMIN" ? [{ href: "/admin", label: "Control Panel" }] : []),
    { href: "/client", label: t("nav.client_area") },
  ] : [];

  const allLinks = [...systemLinks, ...dynamicLinks, ...adminLinks];

  return (
    <header className="fixed top-0 left-0 right-0 z-50" role="banner">
      <nav className="mx-auto max-w-7xl px-6 py-4 md:px-10" aria-label="Main navigation">
        <div className="glass-card rounded-2xl px-6 py-3 flex items-center justify-between relative overflow-hidden">
          <BubbleEffect />
          
          <div className="relative z-10 flex items-center justify-between w-full">
            <Link
              href="/"
              className="text-lg font-semibold tracking-[0.18em] text-foreground hover:text-slate-400 transition-colors duration-300"
              aria-label={`${brand} home`}
            >
              {brand}
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {allLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm transition-all duration-200 relative group/link ${
                      isActive 
                        ? "text-text-primary font-medium" 
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <m.div
                        layoutId="nav-active"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-blue rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 ml-2" aria-label="Select language">
                <button 
                  onClick={() => setLocale("en")}
                  className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${locale === 'en' ? 'text-slate-400' : 'text-gray-500 hover:text-white'}`}
                  aria-pressed={locale === 'en'}
                >
                  EN
                </button>
                <div className="w-px h-3 bg-white/10" aria-hidden="true" />
                <button 
                  onClick={() => setLocale("de")}
                  className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${locale === 'de' ? 'text-slate-400' : 'text-gray-500 hover:text-white'}`}
                  aria-pressed={locale === 'de'}
                >
                  DE
                </button>
              </div>

              <Link
                href="/contact"
                className="rounded-full bg-accent-blue px-5 py-2 text-sm font-medium text-white hover:bg-accent-purple transition-colors duration-200"
              >
                {t("nav.start_project")}
              </Link>
              {status === "authenticated" && (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 text-text-secondary hover:text-white transition-colors duration-200 ml-2"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <m.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-2 glass-card rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
            >
              <BubbleEffect count={8} isMobile />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between py-2 border-b border-white/5 mb-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Globe size={12} aria-hidden="true" /> Language
                  </span>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setLocale("en")} 
                      className={`text-xs font-bold ${locale === 'en' ? 'text-slate-400' : 'text-gray-500'}`}
                    >
                      EN
                    </button>
                    <button 
                      onClick={() => setLocale("de")} 
                      className={`text-xs font-bold ${locale === 'de' ? 'text-slate-400' : 'text-gray-500'}`}
                    >
                      DE
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {allLinks.map((link) => {
                    const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`text-sm transition-colors py-2 flex items-center justify-between ${
                          isActive ? "text-text-primary font-bold" : "text-text-secondary"
                        }`}
                      >
                        {link.label}
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" />}
                      </Link>
                    );
                  })}
                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full bg-slate-400 px-5 py-2.5 text-sm font-medium text-background text-center hover:bg-slate-500 transition-colors"
                  >
                    {t("nav.start_project")}
                  </Link>
                  {status === "authenticated" && (
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-text-secondary text-center hover:bg-white/5 transition-colors flex justify-center items-center gap-2"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  )}
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
