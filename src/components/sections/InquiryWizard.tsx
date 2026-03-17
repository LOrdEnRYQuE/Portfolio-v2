"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Rocket, 
  Cpu, 
  Layers, 
  Clock, 
  Briefcase,
  Sparkles,
  Zap,
  Globe,
  Database,
  ShieldCheck,
  HeartPulse,
  ShoppingCart,
  Layout,
  Building2,
  GraduationCap,
  PlayCircle,
  Construction,
  Info,
  Coins,
  Shield,
  Truck,
  Scale as ScaleIcon,
  Sprout,
  Coffee,
  GanttChart,
  Lock,
  RefreshCw,
  Users2,
  BarChart3,
  TrendingUp,
  Palette,
  Lightbulb,
  Phone,
  MessageSquare,
  Mail,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardData {
  name: string;
  email: string;
  concept: string;
  industry: string;
  projectTypes: string[];
  description: string;
  features: string[];
  objective: string;
  audience: string;
  infrastructure: string;
  timeline: string;
  budget: string;
  phone: string;
  preferredMethod: "email" | "whatsapp" | "phone";
  agreedToTerms: boolean;
  agreedToCommunication: boolean;
  customBudget?: string;
}

const INITIAL_DATA: WizardData = {
  name: "",
  email: "",
  concept: "",
  industry: "saas",
  projectTypes: ["mvp"],
  description: "",
  features: [],
  objective: "validate",
  audience: "b2c",
  infrastructure: "serverless",
  timeline: "Standard (1-3 months)",
  budget: "€5k - €15k",
  phone: "",
  preferredMethod: "email",
  agreedToTerms: false,
  agreedToCommunication: false,
  customBudget: "",
};

const FEATURE_OPTIONS = [
  { id: "ai", label: "AI Integration", icon: <Cpu size={16} />, desc: "LLMs, Agents, RAG" },
  { id: "mobile", label: "Mobile App", icon: <Zap size={16} />, desc: "iOS & Android" },
  { id: "saas", label: "SaaS Platform", icon: <Layers size={16} />, desc: "Dashboards, Auth" },
  { id: "web", label: "High-End Web", icon: <Globe size={16} />, desc: "Performance, SEO" },
  { id: "infra", label: "Cloud Infra", icon: <Database size={16} />, desc: "AWS, Vercel, Ops" },
  { id: "analytics", idKey: "analytics", icon: <BarChart3 size={16} /> },
  { id: "crm", idKey: "crm", icon: <Users2 size={16} /> },
  { id: "security", idKey: "security", icon: <Lock size={16} /> },
  { id: "realtime", idKey: "realtime", icon: <RefreshCw size={16} /> },
  { id: "automation", label: "Workflows", icon: <Sparkles size={16} />, desc: "Efficiency, Logic" },
];

const PROJECT_TYPES = [
  { id: "mvp", icon: <Rocket size={18} /> },
  { id: "scale", icon: <TrendingUp size={18} /> },
  { id: "redesign", icon: <Palette size={18} /> },
  { id: "consulting", icon: <Lightbulb size={18} /> },
  { id: "fullstack", icon: <Layers size={18} /> },
];
 
const OBJECTIVE_OPTIONS = [
  { id: "disrupt", icon: <Rocket size={18} /> },
  { id: "validate", icon: <CheckCircle2 size={18} /> },
  { id: "automate", icon: <Zap size={18} /> },
  { id: "modernize", icon: <RefreshCw size={18} /> },
];
 
const AUDIENCE_OPTIONS = [
  { id: "b2b", icon: <Building2 size={18} /> },
  { id: "b2c", icon: <Users2 size={18} /> },
  { id: "dev", icon: <Cpu size={18} /> },
];
 
const INFRA_OPTIONS = [
  { id: "serverless", icon: <Globe size={18} /> },
  { id: "cloud", icon: <Database size={18} /> },
  { id: "onprem", icon: <Shield size={18} /> },
];

const INDUSTRY_OPTIONS = [
  { id: "fintech", icon: <ShieldCheck size={18} /> },
  { id: "healthtech", icon: <HeartPulse size={18} /> },
  { id: "ecommerce", icon: <ShoppingCart size={18} /> },
  { id: "saas", icon: <Layout size={18} /> },
  { id: "realestate", icon: <Building2 size={18} /> },
  { id: "edtech", icon: <GraduationCap size={18} /> },
  { id: "entertainment", icon: <PlayCircle size={18} /> },
  { id: "web3", icon: <Coins size={18} /> },
  { id: "agritech", icon: <Sprout size={18} /> },
  { id: "hospitality", icon: <Coffee size={18} /> },
  { id: "energy", icon: <Zap size={18} /> },
  { id: "govtech", icon: <GanttChart size={18} /> },
  { id: "cybersecurity", icon: <Shield size={18} /> },
  { id: "logistics", icon: <Truck size={18} /> },
  { id: "legaltech", icon: <ScaleIcon size={18} /> },
  { id: "ai", icon: <Cpu size={18} /> },
  { id: "other", icon: <Construction size={18} /> },
];

const TIMELINE_OPTIONS = [
  "Rushed (< 1 month)", "Standard (1-3 months)", "Strategic (3-6 months)", "TBD"
];

const BUDGET_OPTIONS = [
  "< €5k", "€5k - €15k", "€15k - €30k", "€30k - €75k", "€75k - €150k", "Enterprise (€250k+)", "Custom"
];
 
const CONTACT_METHODS = [
  { id: "email", icon: <Mail size={18} /> },
  { id: "whatsapp", icon: <MessageSquare size={18} /> },
  { id: "phone", icon: <Phone size={18} /> },
] as const;

const STEPS = ["mission", "vision", "stack", "logic", "plan"];

const LEGAL_TERMS = {
  en: {
    title: "Client Duties & Financial Obligations",
    sections: [
      {
        title: "1. Payment Terms & Hosting Fees",
        items: [
          "Service Fees: The Client agrees to pay all fees for services rendered by Contact Page Wizards as outlined in the signed Proposal or Invoice.",
          "Recurring Hosting: If hosting services are provided, payments are due on a Monthly/Annual basis. The Client acknowledges that hosting is a third-party cost managed by the Wizards; failure to remit payment by the due date will result in automatic site suspension within 7 days of the missed deadline.",
          "Late Fees: Invoices unpaid after 15 days will incur a late fee of 5% or the maximum rate permitted by law."
        ]
      },
      {
        title: "2. Client Cooperation & Data Provision",
        items: [
          "Providing all necessary branding assets (logos, images, copy) within 7 business days of a request.",
          "Granting administrative access to necessary third-party platforms required for site deployment.",
          "Reviewing and approving 'Milestone' deliverables within 3 business days. Delays in feedback will result in an equivalent delay in the final launch date."
        ]
      },
      {
        title: "3. Third-Party Licenses",
        items: [
          "The Client is responsible for the cost and maintenance of any third-party software, plugins, or stock imagery licenses specifically requested for their project, unless otherwise stated in writing."
        ]
      },
      {
        title: "4. Consequences of Non-Performance",
        items: [
          "Contact Page Wizards reserves the right to pause all work if the Client fails to meet the duties outlined above. We are not liable for any loss of revenue, SEO ranking, or data caused by site suspension due to the Client's failure to pay hosting or renewal fees."
        ]
      }
    ]
  },
  de: {
    title: "Pflichten des Kunden & Finanzielle Verpflichtungen",
    sections: [
      {
        title: "1. Zahlungsbedingungen & Hosting-Gebühren",
        items: [
          "Servicegebühren: Der Kunde erklärt sich bereit, alle Gebühren für Dienstleistungen von Contact Page Wizards zu zahlen, wie im unterzeichneten Angebot oder der Rechnung aufgeführt.",
          "Wiederkehrendes Hosting: Wenn Hosting-Dienste bereitgestellt werden, sind Zahlungen monatlich/jährlich fällig. Die Nichtzahlung bis zum Fälligkeitsdatum führt innerhalb von 7 Tagen zur automatischen Aussetzung der Website.",
          "Verspätungsgebühren: Unbezahlte Rechnungen nach 15 Tagen ziehen eine Verspätungsgebühr von 5% nach sich."
        ]
      },
      {
        title: "2. Mitwirkung des Kunden & Datenbereitstellung",
        items: [
          "Bereitstellung aller erforderlichen Markenwerte (Logos, Bilder, Texte) innerhalb von 7 Werktagen.",
          "Gewährung des administrativen Zugriffs auf erforderliche Plattformen von Drittanbietern.",
          "Überprüfung und Genehmigung von Meilensteinen innerhalb von 3 Werktagen. Verzögerungen beim Feedback verschieben den finalen Starttermin."
        ]
      },
      {
        title: "3. Lizenzen von Drittanbietern",
        items: [
          "Der Kunde ist verantwortlich für die Kosten und Wartung von Drittanbieter-Software, Plugins oder Bildlizenzen, es sei denn, es ist schriftlich anders vereinbart."
        ]
      },
      {
        title: "4. Folgen der Nichterfüllung",
        items: [
          "Contact Page Wizards behält sich das Recht vor, alle Arbeiten zu pausieren, wenn der Kunde die oben genannten Pflichten nicht erfüllt."
        ]
      }
    ]
  }
};

const QUICK_START = {
  en: {
    title: "🧙‍♂️ Welcome to the Magic: Your Project Quick-Start",
    desc: "We're excited to build something great together! To keep the magic moving and ensure your site launches on time, here is a quick checklist of your 'Wizard Duties':",
    sections: [
      {
        title: "1. The 'Ingredients' (Assets & Copy)",
        items: [
          "Logo & Branding: High-resolution files (PNG, SVG, or AI).",
          "The Story: Your 'About Us' text and service descriptions.",
          "Imagery: Photos of your team, products, or workspace.",
          "Access: Login details for your domain registrar."
        ]
      },
      {
        title: "2. The 'Timeline' (Feedback)",
        items: [
          "Review Cycles: When we send a draft, try to give us the 'thumbs up' or requested changes within 3 business days."
        ]
      },
      {
        title: "3. The 'Fuel' (Payments & Hosting)",
        items: [
          "Milestones: Keep an eye out for project invoices to avoid any 'work pauses.'",
          "Hosting: Your site's 'home' on the internet requires a recurring payment. We'll set this up to be automatic!"
        ]
      },
      {
        title: "4. Communication",
        items: [
          "Stay in Touch: We'll reach out via your preferred method. If your contact info changes, just let us know!"
        ]
      }
    ]
  },
  de: {
    title: "🧙‍♂️ Willkommen in der Magie: Ihr Projekt-Schnellstart",
    desc: "Wir freuen uns darauf, gemeinsam Großartiges zu erschaffen! Um die Magie am Laufen zu halten, hier eine kurze Checkliste Ihrer Pflichten:",
    sections: [
      {
        title: "1. Die 'Zutaten' (Assets & Texte)",
        items: [
          "Logo & Branding: Hochauflösende Dateien (PNG, SVG oder AI).",
          "Die Geschichte: Ihr 'Über uns'-Text und Leistungsbeschreibungen.",
          "Bildmaterial: Fotos Ihres Teams, Ihrer Produkte oder Räumlichkeiten.",
          "Zugang: Login-Daten für Ihren Domain-Registrar."
        ]
      },
      {
        title: "2. Die 'Zeitachse' (Feedback)",
        items: [
          "Überprüfungszyklen: Versuchen Sie uns innerhalb von 3 Werktagen Feedback zu Entwürfen zu geben."
        ]
      },
      {
        title: "3. Der 'Treibstoff' (Zahlungen & Hosting)",
        items: [
          "Meilensteine: Achten Sie auf Projekt-Rechnungen, um Arbeitsunterbrechungen zu vermeiden.",
          "Hosting: Das 'Zuhause' Ihrer Website im Internet erfordert eine wiederkehrende Zahlung. Wir richten dies automatisch ein!"
        ]
      },
      {
        title: "4. Kommunikation",
        items: [
          "Bleiben Sie in Kontakt: Wir melden uns über Ihre bevorzugte Methode. Wenn sich Ihre Kontaktdaten ändern, lassen Sie es uns einfach wissen!"
        ]
      }
    ]
  }
};

export default function InquiryWizard() {
  const { t, locale } = useI18n();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for back

  // Load draft from local storage
  useEffect(() => {
    const saved = localStorage.getItem("lead_draft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData({ ...INITIAL_DATA, ...parsed });
      } catch (e) {
        console.error("Failed to load lead draft", e);
      }
    }
  }, []);

  // Save draft to local storage
  useEffect(() => {
    localStorage.setItem("lead_draft", JSON.stringify(data));
  }, [data]);

  const updateData = (fields: Partial<WizardData>) => {
    setData(prev => ({ ...prev, ...fields }));
  };

  const nextStep = () => {
    setDirection(1);
    setStep(prev => Math.min(prev + 1, STEPS.length));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Create a robust "Full Stacked Plan" summary
    const formattedPlan = `
Project Mission Plan (${locale.toUpperCase()}):
--------------------
Client: ${data.name}
Contact Info:
- Email: ${data.email}
- Phone: ${data.phone || "Not provided"}
- Preferred Channel: ${t(`contact.wizard.method.${data.preferredMethod}`)}
Concept: ${data.concept}
Industry: ${t(`contact.wizard.industry.${data.industry}.label`)}
Project Types: ${data.projectTypes.map(pt => t(`contact.wizard.project_type.${pt}.label`)).join(", ")}
Objective: ${t(`contact.wizard.objective.${data.objective}.label`)}
Audience: ${t(`contact.wizard.audience.${data.audience}.label`)}
Infrastructure: ${t(`contact.wizard.infra.${data.infrastructure}.label`)}
Description: ${data.description}
Technical Stack: ${data.features.map(f => {
  const opt = FEATURE_OPTIONS.find(o => o.id === f);
  return opt?.idKey ? t(`contact.wizard.feature.${opt.idKey}.label`) : opt?.label;
}).join(", ") || "Standard Framework"}
Timeline: ${data.timeline}
Budget: ${data.budget === "Custom" && data.customBudget ? data.customBudget : data.budget}
Agreed to Terms: Yes
    `.trim();

    // Trigger download if needed (utility for the success screen)
    const quickStartObj = QUICK_START[locale as 'en' | 'de'] || QUICK_START.en;
    const qsString = `
PROJECT PLAN & QUICK START: ${data.name}

--- Client Duties & Quick Start ---
${quickStartObj.sections.map(s => s.title + '\n' + s.items.map(i => '- ' + i).join('\n')).join('\n\n')}

Communication Preference: ${data.preferredMethod.toUpperCase()}

--- Technical & Strategic Proposal ---
${formattedPlan}
    `.trim();

    localStorage.setItem("last_generated_plan", qsString);
    localStorage.setItem("last_project_name", data.name || "Project");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          features: JSON.stringify(data.features),
          description: formattedPlan, // Sending the full plan as description
          stack: data.features.join(", "),
        }),
      });

      if (!response.ok) throw new Error("Submission failed");
      
      localStorage.removeItem("lead_draft");
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  if (isSuccess) {
    return (
      <m.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-12 flex flex-col items-center justify-center text-left space-y-6 w-full max-w-3xl mx-auto"
      >
        <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-4 mx-auto shadow-accent-glow animate-pulse">
          <CheckCircle2 className="text-accent" size={40} />
        </div>
        
        <h3 className="text-3xl font-black text-foreground text-center">
          {(QUICK_START[locale as 'en' | 'de'] || QUICK_START.en).title}
        </h3>
        <p className="text-text-secondary w-full text-center text-lg max-w-2xl mx-auto mb-6">
          {(QUICK_START[locale as 'en' | 'de'] || QUICK_START.en).desc}
        </p>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 w-full space-y-8">
          {(QUICK_START[locale as 'en' | 'de'] || QUICK_START.en).sections.map((sec, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="text-accent font-black text-sm tracking-widest uppercase">{sec.title}</h4>
              <ul className="space-y-3">
                {sec.items.map((item, idxi) => (
                  <li key={idxi} className="flex items-start gap-4 text-sm text-text-secondary">
                    <div className="mt-0.5 shrink-0">
                      <div className="w-5 h-5 rounded border border-accent/30 bg-accent/5 flex items-center justify-center">
                        <CheckCircle2 size={12} className="text-accent" />
                      </div>
                    </div>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 w-full">
          <Button 
            onClick={() => {
              const plan = localStorage.getItem("last_generated_plan");
              const name = localStorage.getItem("last_project_name") || "Project";
              if (plan) {
                const blob = new Blob([plan], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${name.replace(/\s+/g, "_")}_Project_Brief.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }
            }}
            className="rounded-2xl px-10 py-6 bg-accent text-background shadow-accent/20 border-accent font-bold"
          >
            <Download size={20} className="mr-3" />
            {t("contact.wizard.success.download")}
          </Button>

          <Button 
            variant="outline" 
            onClick={() => {
              setIsSuccess(false);
              setStep(1);
              setData(INITIAL_DATA);
            }}
            className="rounded-2xl px-10 py-6 font-bold"
          >
            {t("contact.wizard.success.button")}
          </Button>
        </div>
      </m.div>
    );
  }

  return (
    <div className="w-full">
      {/* Progress Indicators */}
      <div className="flex justify-between items-center mb-12 gap-2">
        {STEPS.map((stepKey, i) => (
          <div key={i} className="flex-1 flex flex-col gap-2">
            <div 
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                step > i ? "bg-accent shadow-accent-glow" : "bg-white/5"
              )} 
            />
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest text-center",
              step === i + 1 ? "text-accent" : "text-white/20"
            )}>
              {t(`contact.wizard.steps.${stepKey}`)}
            </span>
          </div>
        ))}
      </div>

      <div className="relative min-h-[500px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <m.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full space-y-8"
          >
            {/* STEP 1: CONTACT DETAILS */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2 text-glow">
                    <Rocket className="text-accent" size={24} />
                    {t("contact.wizard.step1.title")}
                  </h3>
                  <p className="text-text-secondary text-sm">{t("contact.wizard.step1.desc")}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t("contact.wizard.form.name")}</label>
                    <input 
                      type="text" 
                      value={data.name}
                      onChange={(e) => updateData({ name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-foreground focus:outline-none focus:border-accent transition-all placeholder:text-white/10"
                      placeholder="e.g. Elon Musk"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t("contact.wizard.form.email")}</label>
                    <input 
                      type="email" 
                      value={data.email}
                      onChange={(e) => updateData({ email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-foreground focus:outline-none focus:border-accent transition-all placeholder:text-white/10"
                      placeholder="hello@lordenryque.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t("contact.wizard.form.phone")}</label>
                    <input 
                      type="tel" 
                      value={data.phone}
                      onChange={(e) => updateData({ phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-foreground focus:outline-none focus:border-accent transition-all placeholder:text-white/10"
                      placeholder="+49 123 456789"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t("contact.wizard.form.preferred")}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {CONTACT_METHODS.map(method => (
                        <button
                          key={method.id}
                          onClick={() => updateData({ preferredMethod: method.id })}
                          className={cn(
                            "flex items-center justify-center p-4 rounded-xl border transition-all duration-300",
                            data.preferredMethod === method.id 
                              ? "border-accent bg-accent text-background" 
                              : "border-white/10 bg-white/5 text-accent hover:border-white/30"
                          )}
                        >
                          {method.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t("contact.wizard.form.concept")}</label>
                  <input 
                    type="text" 
                    value={data.concept}
                    onChange={(e) => updateData({ concept: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-foreground focus:outline-none focus:border-accent transition-all placeholder:text-white/10"
                    placeholder="e.g. Neural Link for Mobile Devices"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t("contact.wizard.objective.label")}</label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {OBJECTIVE_OPTIONS.map(opt => {
                      const active = data.objective === opt.id;
                      return (
                        <m.button
                          key={opt.id}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateData({ objective: opt.id })}
                          className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-300 group relative overflow-hidden",
                            active 
                              ? "border-accent bg-accent text-background shadow-xl shadow-accent/20" 
                              : "border-white/10 bg-white/3 backdrop-blur-sm hover:border-white/30 hover:bg-white/8"
                          )}
                        >
                          <div className={cn(
                            "p-2 rounded-lg mb-2 transition-all",
                            active ? "bg-background/20 text-background" : "bg-white/5 text-accent"
                          )}>
                            {opt.icon}
                          </div>
                          <span className="font-bold text-[10px] uppercase tracking-tight text-center leading-tight min-h-[24px] flex items-center justify-center">
                            {t(`contact.wizard.objective.${opt.id}.label`)}
                          </span>
                        </m.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: VISION & INDUSTRY */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2 text-glow">
                    <Sparkles className="text-accent" size={24} />
                    {t("contact.wizard.step2.title")}
                  </h3>
                  <p className="text-text-secondary text-sm">{t("contact.wizard.step2.desc")}</p>
                </div>
                
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t("contact.wizard.form.industry")}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {INDUSTRY_OPTIONS.map(opt => {
                      const label = t(`contact.wizard.industry.${opt.id}.label`);
                      const active = data.industry === opt.id;
                      return (
                        <m.button
                          key={opt.id}
                          whileHover={{ y: -2, transition: { duration: 0.2 } }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateData({ industry: opt.id })}
                          className={cn(
                            "flex flex-col items-center justify-center p-6 rounded-2xl border text-center transition-all duration-300 group relative overflow-hidden h-full min-h-[160px]",
                            active 
                              ? "border-accent bg-accent text-background shadow-xl shadow-accent/20" 
                              : "border-white/10 bg-white/3 backdrop-blur-sm hover:border-white/30 hover:bg-white/8 shadow-lg"
                          )}
                        >
                          <div className={cn(
                            "p-3 rounded-xl mb-4 transition-all duration-300",
                            active 
                              ? "bg-background/20 text-background scale-110" 
                              : "bg-white/5 text-accent group-hover:bg-accent/10 group-hover:scale-110"
                          )}>
                            {opt.icon}
                          </div>
                          <div className="space-y-1">
                            <span className={cn(
                              "font-bold text-sm block tracking-tight uppercase",
                              active ? "text-background" : "text-foreground"
                            )}>
                              {label}
                            </span>
                            <span className={cn(
                              "text-[10px] leading-tight block px-2 line-clamp-2",
                              active ? "text-background/80" : "text-text-muted group-hover:text-text-secondary"
                            )}>
                              {t(`contact.wizard.industry.${opt.id}.desc`)}
                            </span>
                          </div>
                          {active && (
                            <m.div 
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="absolute top-3 right-3"
                            >
                              <div className="bg-background/20 rounded-full p-1 border border-background/30">
                                <CheckCircle2 size={12} className="text-background" />
                              </div>
                            </m.div>
                          )}
                          
                          {/* Inner glow effect for buttons */}
                          {!active && (
                            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </m.button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t("contact.wizard.project_type.label")}</label>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    {PROJECT_TYPES.map(opt => {
                      const active = data.projectTypes.includes(opt.id);
                      return (
                        <m.button
                          key={opt.id}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (active) {
                              updateData({ projectTypes: data.projectTypes.filter(id => id !== opt.id) });
                            } else {
                              updateData({ projectTypes: [...data.projectTypes, opt.id] });
                            }
                          }}
                          className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-300 group relative overflow-hidden",
                            active 
                              ? "border-accent bg-accent text-background shadow-xl shadow-accent/20" 
                              : "border-white/10 bg-white/3 backdrop-blur-sm hover:border-white/30 hover:bg-white/8"
                          )}
                        >
                          <div className={cn(
                            "p-2 rounded-lg mb-2 transition-all",
                            active ? "bg-background/20 text-background" : "bg-white/5 text-accent"
                          )}>
                            {opt.icon}
                          </div>
                          <span className="font-bold text-[10px] uppercase tracking-tight">
                            {t(`contact.wizard.project_type.${opt.id}.label`)}
                          </span>
                        </m.button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t("contact.wizard.audience.label")}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {AUDIENCE_OPTIONS.map(opt => {
                      const active = data.audience === opt.id;
                      return (
                        <m.button
                          key={opt.id}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateData({ audience: opt.id })}
                          className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-300 group relative overflow-hidden",
                            active 
                              ? "border-accent bg-accent text-background shadow-xl shadow-accent/20" 
                              : "border-white/10 bg-white/3 backdrop-blur-sm hover:border-white/30 hover:bg-white/8"
                          )}
                        >
                          <div className={cn(
                            "p-2 rounded-lg mb-2 transition-all",
                            active ? "bg-background/20 text-background" : "bg-white/5 text-accent"
                          )}>
                            {opt.icon}
                          </div>
                          <span className="font-bold text-[10px] uppercase tracking-tight">
                            {t(`contact.wizard.audience.${opt.id}.label`)}
                          </span>
                        </m.button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t("contact.wizard.form.description")}</label>
                  <textarea 
                    rows={3}
                    value={data.description}
                    onChange={(e) => updateData({ description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-foreground focus:outline-none focus:border-accent transition-all placeholder:text-white/10 resize-none"
                    placeholder="Describe the core problem and solution..."
                  />
                </div>
              </div>
            )}

            {/* STEP 3: STACK */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2 text-glow">
                    <Cpu className="text-accent" size={24} />
                    {t("contact.wizard.step3.title")}
                  </h3>
                  <p className="text-text-secondary text-sm">{t("contact.wizard.step3.desc")}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {FEATURE_OPTIONS.map(opt => {
                    const active = data.features.includes(opt.id);
                    return (
                      <m.button
                        key={opt.id}
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (active) {
                            updateData({ features: data.features.filter(f => f !== opt.id) });
                          } else {
                            updateData({ features: [...data.features, opt.id] });
                          }
                        }}
                        className={cn(
                          "flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all duration-300 group relative overflow-hidden h-full min-h-[140px]",
                          active
                            ? "border-accent bg-accent text-background shadow-xl shadow-accent/20"
                            : "border-white/10 bg-white/3 backdrop-blur-sm hover:border-white/30 hover:bg-white/8 shadow-lg"
                        )}
                      >
                        <div className={cn(
                          "p-2.5 rounded-xl mb-3 transition-all duration-300",
                          active 
                            ? "bg-background/20 text-background scale-110" 
                            : "bg-white/5 text-accent group-hover:bg-accent/10 group-hover:scale-110"
                        )}>
                          {opt.icon}
                        </div>
                        <div className="space-y-1">
                          <span className={cn(
                            "font-bold text-xs block tracking-tight uppercase",
                            active ? "text-background" : "text-foreground"
                          )}>
                            {opt.idKey ? t(`contact.wizard.feature.${opt.idKey}.label`) : opt.label}
                          </span>
                          <span className={cn(
                            "text-[9px] leading-tight block px-1 line-clamp-1",
                            active ? "text-background/80" : "text-text-muted group-hover:text-text-secondary"
                          )}>
                            {opt.idKey ? t(`contact.wizard.feature.${opt.idKey}.desc`) : opt.desc}
                          </span>
                        </div>
                        {active && (
                          <m.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute top-2.5 right-2.5"
                          >
                            <div className="bg-background/20 rounded-full p-0.5 border border-background/30">
                              <CheckCircle2 size={10} className="text-background" />
                            </div>
                          </m.div>
                        )}
                        {!active && (
                          <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </m.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: LOGISTICS */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2 text-glow">
                    <Clock className="text-accent" size={24} />
                    {t("contact.wizard.step4.title")}
                  </h3>
                  <p className="text-text-secondary text-sm">{t("contact.wizard.step4.desc")}</p>
                </div>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
                      <Briefcase size={14} className="text-accent" />
                      {t("contact.wizard.form.timeline")}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {TIMELINE_OPTIONS.map(opt => (
                        <m.button
                          key={opt}
                          whileHover={{ y: -2, transition: { duration: 0.2 } }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateData({ timeline: opt })}
                          className={cn(
                            "px-4 py-4 rounded-xl border text-xs font-bold transition-all duration-300 relative overflow-hidden text-center",
                            data.timeline === opt 
                              ? "border-accent bg-accent text-background shadow-lg shadow-accent/20" 
                              : "border-white/10 bg-white/3 text-foreground hover:border-white/30 hover:bg-white/8"
                          )}
                        >
                          <span className="relative z-10">{opt}</span>
                          {data.timeline === opt && (
                            <m.div 
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-20"
                            >
                              <CheckCircle2 size={14} />
                            </m.div>
                          )}
                        </m.button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
                      <Zap size={14} className="text-accent" />
                      {t("contact.wizard.form.budget")}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {BUDGET_OPTIONS.map(opt => (
                        <m.button
                          key={opt}
                          whileHover={{ y: -2, transition: { duration: 0.2 } }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateData({ budget: opt })}
                          className={cn(
                            "px-4 py-4 rounded-xl border text-xs font-bold transition-all duration-300 relative overflow-hidden text-center",
                            data.budget === opt 
                              ? "border-accent bg-accent text-background shadow-lg shadow-accent/20" 
                              : "border-white/10 bg-white/3 text-foreground hover:border-white/30 hover:bg-white/8"
                          )}
                        >
                          <span className="relative z-10">{opt}</span>
                          {data.budget === opt && (
                            <m.div 
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-20"
                            >
                              <CheckCircle2 size={14} />
                            </m.div>
                          )}
                        </m.button>
                      ))}
                    </div>
                    <AnimatePresence>
                      {data.budget === "Custom" && (
                        <m.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-2 overflow-hidden"
                        >
                          <input 
                            type="text" 
                            value={data.customBudget || ""}
                            onChange={(e) => updateData({ customBudget: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-foreground focus:outline-none focus:border-accent transition-all placeholder:text-white/10"
                            placeholder="e.g. Needs a smaller scoped $2k project..."
                          />
                        </m.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
                      <Layout size={14} className="text-accent" />
                      {t("contact.wizard.infra.label")}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {INFRA_OPTIONS.map(opt => (
                        <m.button
                          key={opt.id}
                          whileHover={{ y: -2, transition: { duration: 0.2 } }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateData({ infrastructure: opt.id })}
                          className={cn(
                            "p-4 rounded-xl border text-[10px] font-bold transition-all duration-300 relative overflow-hidden text-center flex flex-col items-center gap-2",
                            data.infrastructure === opt.id 
                              ? "border-accent bg-accent text-background shadow-lg shadow-accent/20" 
                              : "border-white/10 bg-white/3 text-foreground hover:border-white/30 hover:bg-white/8"
                          )}
                        >
                          <div className={cn(
                            "p-2 rounded-lg transition-all",
                            data.infrastructure === opt.id ? "bg-background/20 text-background" : "bg-white/5 text-accent"
                          )}>
                            {opt.icon}
                          </div>
                          <span>{t(`contact.wizard.infra.${opt.id}.label`)}</span>
                        </m.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: MISSION REVIEW */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2 text-glow">
                    <Layout className="text-accent" size={24} />
                    {t("contact.wizard.step5.title")}
                  </h3>
                  <p className="text-text-secondary text-sm">{t("contact.wizard.step5.desc")}</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-xs font-black uppercase text-accent tracking-tighter">{t("contact.wizard.review.summary")}</span>
                    <Info size={14} className="text-white/20" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">{t("contact.wizard.review.client")}</span>
                      <p className="text-foreground font-medium">{data.name}</p>
                      <p className="text-text-secondary text-xs">{data.email}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">{t("contact.wizard.review.industry")}</span>
                      <p className="text-foreground font-medium">{t(`contact.wizard.industry.${data.industry}.label`)}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">{t("contact.wizard.project_type.label")}</span>
                      <p className="text-foreground font-medium">{data.projectTypes.map(pt => t(`contact.wizard.project_type.${pt}.label`)).join(", ")}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-1">
                      <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">{t("contact.wizard.objective.label")}</span>
                      <p className="text-foreground font-medium">{t(`contact.wizard.objective.${data.objective}.label`)}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">{t("contact.wizard.audience.label")}</span>
                      <p className="text-foreground font-medium">{t(`contact.wizard.audience.${data.audience}.label`)}</p>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">{t("contact.wizard.infra.label")}</span>
                    <p className="text-foreground font-medium">{t(`contact.wizard.infra.${data.infrastructure}.label`)}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">{t("contact.wizard.review.concept")}</span>
                    <p className="text-foreground font-medium line-clamp-1">{data.concept}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">{t("contact.wizard.review.features")}</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {data.features.length > 0 ? (
                        data.features.map(f => {
                          const opt = FEATURE_OPTIONS.find(o => o.id === f);
                          const label = opt?.idKey ? t(`contact.wizard.feature.${opt.idKey}.label`) : opt?.label;
                          return (
                            <span key={f} className="text-[10px] px-2 py-0.5 bg-accent/10 border border-accent/20 text-accent rounded-full font-bold">
                              {label}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-xs text-text-secondary italic">Standard Implementation</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="grid grid-cols-2 gap-4 bg-white/5 rounded-2xl p-4">
                      <div className="space-y-1">
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">{t("contact.wizard.review.logistics")}</span>
                        <p className="text-foreground text-sm flex items-center gap-2">
                          <Clock size={12} className="text-accent" />
                          {data.timeline}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">{t("contact.wizard.form.budget")}</span>
                        <p className="text-foreground text-sm flex items-center gap-2">
                          <Zap size={12} className="text-accent" />
                          {data.budget}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and conditions scrollable area */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-6 h-64 overflow-y-auto mt-10 custom-scrollbar space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 sticky top-0 bg-black/80 backdrop-blur-md z-10 -mt-6 pt-6 mb-4">
                    <h4 className="text-sm font-black uppercase text-foreground flex items-center gap-2">
                       <ScaleIcon size={16} className="text-accent" />
                      {(LEGAL_TERMS[locale as 'en' | 'de'] || LEGAL_TERMS.en).title}
                    </h4>
                  </div>
                  
                  <div className="space-y-6">
                    {(LEGAL_TERMS[locale as 'en' | 'de'] || LEGAL_TERMS.en).sections.map((sec, idx) => (
                      <div key={idx} className="space-y-3">
                        <h5 className="text-sm font-bold text-accent">{sec.title}</h5>
                        <ul className="space-y-3">
                          {sec.items.map((item, idxi) => (
                            <li key={idxi} className="flex items-start gap-3 pl-2 text-sm text-text-secondary leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent/50 mt-2 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Consents */}
                <div className="space-y-4 mt-6 bg-white/5 border border-white/5 rounded-2xl p-6">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                      <input 
                        type="checkbox" 
                        checked={data.agreedToTerms} 
                        onChange={(e) => updateData({ agreedToTerms: e.target.checked })}
                        className="peer sr-only"
                      />
                      <div className="w-6 h-6 border-2 border-white/20 rounded-md bg-white/5 peer-checked:bg-accent peer-checked:border-accent transition-all flex items-center justify-center shadow-inner">
                        <CheckCircle2 size={16} className="opacity-0 peer-checked:opacity-100 text-background transition-opacity" />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-text-secondary group-hover:text-foreground transition-colors leading-relaxed">
                      {locale === 'de' ? 'Ich stimme den Pflichten des Kunden & Finanziellen Verpflichtungen zu.' : 'I agree to the Client Duties & Financial Obligations.'}
                    </span>
                  </label>

                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                      <input 
                        type="checkbox" 
                        checked={data.agreedToCommunication} 
                        onChange={(e) => updateData({ agreedToCommunication: e.target.checked })}
                        className="peer sr-only"
                      />
                      <div className="w-6 h-6 border-2 border-white/20 rounded-md bg-white/5 peer-checked:bg-accent peer-checked:border-accent transition-all flex items-center justify-center shadow-inner">
                        <CheckCircle2 size={16} className="opacity-0 peer-checked:opacity-100 text-background transition-opacity" />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-text-secondary group-hover:text-foreground transition-colors leading-relaxed">
                      {locale === 'de' 
                        ? `Ich stimme zu, für Projekt-Updates via ${t(`contact.wizard.method.${data.preferredMethod}`)} kontaktiert zu werden.` 
                        : `I agree to be contacted via ${t(`contact.wizard.method.${data.preferredMethod}`)} for project updates.`}
                    </span>
                  </label>
                </div>
              </div>
            )}
          </m.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/5">
        <Button 
          variant="ghost" 
          onClick={prevStep}
          disabled={step === 1 || isSubmitting}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-bold transition-all",
            step === 1 ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>

        {step < STEPS.length ? (
          <Button 
            onClick={nextStep}
            disabled={step === 1 && (!data.name || !data.email)}
            className="rounded-xl px-8 py-2 font-bold group shadow-blue-glow"
          >
            {t("contact.wizard.nav.continue")}
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !data.agreedToTerms || !data.agreedToCommunication}
            className="rounded-xl px-12 py-3 font-black uppercase tracking-widest shadow-accent-glow"
          >
            {isSubmitting ? t("contact.wizard.nav.syncing") : t("contact.wizard.nav.launch")}
            <Rocket size={18} className="ml-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
