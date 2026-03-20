export interface SiteConfig {
  brand: string;
  name: string;
  role: string;
  headline: string;
  bio: string;
  domain: string;
  email: string;
  location: string;
  availability: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  cta: {
    primary: string;
    secondary: string;
  };
}

export const siteConfig: SiteConfig = {
  brand: "LOrdEnRYQuE",
  name: "Attila Lazar",
  role: "AI Engineer • Full-Stack Developer • Product Builder",
  headline: "AI-Driven Web Experiences & Conversion-Focused Development for Modern Businesses",
  bio: "Professional developer creating custom websites, mobile apps, and business software for small businesses. Real estate websites, restaurant apps, e-commerce stores, and industry-specific solutions that help your business grow.",
  domain: process.env.NEXT_PUBLIC_APP_URL || "https://lordenryque.com",
  email: "hello@lordenryque.com",
  location: "Germany",
  availability: "Available for freelance projects, MVP builds, AI integrations, and custom business platforms.",
  socials: {
    github: "https://github.com/lordenryque",
    linkedin: "https://linkedin.com/in/attilalazar",
    twitter: "https://twitter.com/lordenryque",
  },
  cta: {
    primary: "Start a Project",
    secondary: "View Projects",
  },
};
