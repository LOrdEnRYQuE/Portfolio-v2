"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { siteConfig } from "@/content/site";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const [settings, setSettings] = useState({
    brand: siteConfig.brand,
    email: siteConfig.email,
    socials: siteConfig.socials,
    name: siteConfig.name
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings({
            brand: data.brand || siteConfig.brand,
            email: data.email || siteConfig.email,
            socials: {
              github: data.github || siteConfig.socials.github,
              linkedin: data.linkedin || siteConfig.socials.linkedin,
              twitter: data.twitter || siteConfig.socials.twitter
            },
            name: siteConfig.name
          });
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
      }
    };
    fetchSettings();
  }, []);

  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-32">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-4 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-[0.18em] text-foreground">
              {settings.brand}
            </h3>
            <p className="text-sm leading-7 text-text-secondary max-w-xs">
              {t("footer.tagline")} — {settings.name}
            </p>
            <p className="text-xs text-text-muted max-w-xs">
              {t("hero.role")}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium uppercase tracking-[0.2em] text-text-tertiary">
              {t("footer.nav_title")}
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { href: "/", label: t("nav.home") },
                { href: "/projects", label: t("nav.projects") },
                { href: "/blog", label: t("nav.blog") },
                { href: "/client", label: t("nav.client_area") },
                { href: "/#about", label: t("nav.about") },
                { href: "/contact", label: t("nav.contact") },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium uppercase tracking-[0.2em] text-text-tertiary">
              {t("footer.legal_title")}
            </h4>
            <div className="flex flex-col gap-3">
              {[
                { href: "/legal/impressum", label: t("footer.nav.impressum") },
                { href: "/legal/privacy", label: t("footer.nav.privacy") },
                { href: "/legal/terms", label: t("footer.nav.terms") },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium uppercase tracking-[0.2em] text-text-tertiary">
              {t("footer.connect_title")}
            </h4>
            <div className="flex gap-4">
              {settings.socials.github && (
                <a
                  href={settings.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary hover:text-foreground hover:border-border-strong transition-all duration-200"
                  aria-label="GitHub"
                >
                  <Github size={18} />
                </a>
              )}
              {settings.socials.linkedin && (
                <a
                  href={settings.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary hover:text-foreground hover:border-border-strong transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
              )}
              {settings.socials.twitter && (
                <a
                  href={settings.socials.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary hover:text-foreground hover:border-border-strong transition-all duration-200"
                  aria-label="Twitter"
                >
                  <Twitter size={18} />
                </a>
              )}
              <a
                href={`mailto:${settings.email}`}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary hover:text-foreground hover:border-border-strong transition-all duration-200"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
            <p className="text-sm text-text-secondary">{settings.email}</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © {currentYear} {settings.brand}. {t("footer.rights")}
          </p>
          <p className="text-xs text-text-muted">
             {t("footer.built_by")} {settings.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
