export const SITE_SETTINGS_SCHEMA = {
  branding: {
    title: "Global Identity",
    icon: "Globe",
    color: "text-blue-400",
    fields: [
      { key: "site.name", label: "Brand Name", description: "Primary name of the portfolio/brand", placeholder: "LordEnryque" },
      { key: "site.email", label: "Admin Email", description: "Primary contact email for system notifications", placeholder: "hello@lordenryque.com" },
      { key: "site.url", label: "Site URL", description: "The public domain of the portfolio", placeholder: "https://lordenryque.com" },
      { key: "site.role", label: "Professional Role", description: "Your title as shown on the hero section", placeholder: "Full-Stack Architect & AI Specialist" },
      { key: "site.owner_id", label: "Schema Owner ID", description: "Identifier for Schema.org Person/Organization", placeholder: "https://lordenryque.com/#person" },
    ]
  },
  ai: {
    title: "Intelligence Kernel",
    icon: "BrainCircuit",
    color: "text-purple-400",
    fields: [
      { key: "ai.model", label: "Model ID", description: "The LLM model used for chat and lead scoring", placeholder: "gpt-4-turbo" },
      { key: "ai.temperature", label: "Core Temperature", description: "Creativity level of the AI (0.0 to 1.0)", placeholder: "0.7" },
      { key: "ai.system_prompt", label: "Cognitive Directive", description: "The base personality and rules for the AI assistant", placeholder: "You are a professional assistant..." },
    ]
  },
  finance: {
    title: "Economic Infrastructure",
    icon: "DollarSign",
    color: "text-emerald-400",
    fields: [
      { key: "finance.base_rate", label: "Base Hourly Rate", description: "Standard hourly rate for project estimations", placeholder: "150" },
      { key: "finance.bonus_multiplier", label: "Complexity Multiplier", description: "Multiplier applied to urgent or high-complexity tasks", placeholder: "1.25" },
      { key: "finance.currency", label: "Base Currency", description: "ISO code for billing (e.g., EUR, USD)", placeholder: "EUR" },
      { key: "finance.tax_id", label: "Financial Tax ID", description: "Tax identification number for invoices", placeholder: "DE123456789" },
    ]
  },
  seo: {
    title: "Discovery Engine",
    icon: "Zap",
    color: "text-orange-400",
    fields: [
      { key: "seo.default_title", label: "Title Template", description: "The fallback title pattern for SEO", placeholder: "LordEnryque | Full-Stack Architect" },
      { key: "seo.default_description", label: "Global Description", description: "Primary SEO summary for the main entry point", placeholder: "Crafting premium digital experiences through AI and logic..." },
      { key: "seo.og_image_default", label: "OG Asset (Backup)", description: "Default image for social sharing previews", placeholder: "/assets/og-global.webp" },
      { key: "seo.analytics_id", label: "Analytics Stream ID", description: "Google Analytics 4 GA ID for metrics", placeholder: "G-XXXXXXXXXX" },
      { key: "seo.search_console_id", label: "GSC Verification", description: "Google Search Console site verification token", placeholder: "google-site-verification-xyz..." },
      { key: "seo.robots_default", label: "Robots Directive", description: "Global meta robots policy (e.g., index, follow)", placeholder: "index, follow" },
    ]
  },
  system: {
    title: "System Resilience",
    icon: "ShieldAlert",
    color: "text-rose-400",
    fields: [
      { key: "system.maintenance_mode", label: "Kernel Lock", description: "Toggle site-wide maintenance/lockdown mode", placeholder: "false" },
      { key: "system.telemetry_level", label: "Verbosity Mode", description: "Log detail level for system telemetry", placeholder: "INFO" },
      { key: "system.edge_region", label: "Edge Priority", description: "Preferred deployment region for performance caching", placeholder: "FR-PAR" },
    ]
  }
};
