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
  Download,
  Target,
  Box
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
  timeline: "fast" | "standard" | "slow" | "tbd";
  budget: "low" | "medium" | "high" | "custom";
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
  timeline: "standard",
  budget: "low",
  phone: "",
  preferredMethod: "email",
  agreedToTerms: false,
  agreedToCommunication: false,
  customBudget: "",
};

const FEATURE_OPTIONS = [
  { id: "ai", icon: <Cpu size={16} /> },
  { id: "mobile", icon: <Zap size={16} /> },
  { id: "saas", icon: <Layers size={16} /> },
  { id: "web", icon: <Globe size={16} /> },
  { id: "infra", icon: <Database size={16} /> },
  { id: "analytics", icon: <BarChart3 size={16} /> },
  { id: "crm", icon: <Users2 size={16} /> },
  { id: "security", icon: <Lock size={16} /> },
  { id: "realtime", icon: <RefreshCw size={16} /> },
  { id: "automation", icon: <Sparkles size={16} /> },
];

const OBJECTIVE_OPTIONS = [
  { id: "disrupt", icon: <Rocket size={18} /> },
  { id: "validate", icon: <CheckCircle2 size={18} /> },
  { id: "automate", icon: <Zap size={18} /> },
  { id: "modernize", icon: <RefreshCw size={18} /> },
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
  { id: "fast" }, { id: "standard" }, { id: "slow" }, { id: "tbd" }
] as const;

const BUDGET_OPTIONS = [
  { id: "low" }, { id: "medium" }, { id: "high" }, { id: "custom" }
] as const;

const CONTACT_METHODS = [
  { id: "email", icon: <Mail size={18} /> },
  { id: "whatsapp", icon: <MessageSquare size={18} /> },
  { id: "phone", icon: <Phone size={18} /> },
] as const;

const STEPS = ["basics", "goals", "specs", "launch"];

// Moved to i18n

export default function InquiryWizard() {
  const { t, locale } = useI18n();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [direction, setDirection] = useState(1);

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

  const calculateCanGoNext = () => {
    switch (step) {
      case 1: return data.name && data.email && data.concept;
      case 2: return data.objective && data.industry;
      case 3: return data.timeline && data.budget;
      case 4: return data.agreedToTerms && data.agreedToCommunication;
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
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
Objective: ${t(`contact.wizard.objective.${data.objective}.label`)}
Description: ${data.description}
Technical Stack: ${data.features.map(f => t(`contact.wizard.feature.${f}.label`)).join(", ") || "Standard Framework"}
Timeline: ${t(`contact.wizard.timeline.${data.timeline}`)}
Budget: ${data.budget === "custom" && data.customBudget ? data.customBudget : t(`contact.wizard.budget.${data.budget}`)}
Agreed to Terms: Yes
    `.trim();

    // Build quick start and project brief using translations
    const quickStartTitle = t("contact.wizard.quickstart.title");
    const quickStartDesc = t("contact.wizard.quickstart.desc");
    
    let quickStartDetails = "";
    [1, 2, 3, 4].forEach(num => {
      quickStartDetails += `\n${t(`contact.wizard.quickstart.s${num}.title`)}\n`;
      [1, 2, 3, 4].forEach(itemNum => {
        const key = `contact.wizard.quickstart.s${num}.item${itemNum}`;
        const content = t(key);
        if (content !== key) {
          quickStartDetails += `- ${content}\n`;
        }
      });
    });

    const qsString = `
PROJECT BRIEF: ${data.name}
Generated on: ${new Date().toLocaleDateString(locale)}

--- ${quickStartTitle} ---
${quickStartDesc}
${quickStartDetails}

--- Communication Preference ---
${data.preferredMethod.toUpperCase()}

--- Project Details ---
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
          description: formattedPlan,
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
    center: { zIndex: 1, x: 0, opacity: 1 },
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
        <h3 className="text-3xl font-black text-foreground text-center">{t("contact.wizard.quickstart.title")}</h3>
        <p className="text-text-secondary w-full text-center text-lg max-w-2xl mx-auto mb-6">{t("contact.wizard.quickstart.desc")}</p>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 w-full space-y-8">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="space-y-4">
              <h4 className="text-accent font-black text-sm tracking-widest uppercase">{t(`contact.wizard.quickstart.s${num}.title`)}</h4>
              <ul className="space-y-3">
                {[1, 2, 3, 4].map((itemNum) => {
                  const key = `contact.wizard.quickstart.s${num}.item${itemNum}`;
                  const content = t(key);
                  if (content === key) return null; // Simple way to skip non-existent items
                  return (
                    <li key={itemNum} className="flex items-start gap-4 text-sm text-text-secondary">
                      <div className="mt-0.5 shrink-0">
                        <div className="w-5 h-5 rounded border border-accent/30 bg-accent/5 flex items-center justify-center">
                          <CheckCircle2 size={12} className="text-accent" />
                        </div>
                      </div>
                      <span className="leading-relaxed">{content}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 w-full">
          <Button 
            onClick={() => {
              const plan = localStorage.getItem("last_generated_plan");
              if (plan) {
                const blob = new Blob([plan], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${(localStorage.getItem("last_project_name") || "Project").replace(/\s+/g, "_")}_Project_Brief.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }
            }}
            className="rounded-2xl px-10 py-6 bg-accent text-background border-accent font-bold"
          >
            <Download size={20} className="mr-3" />
            {t("contact.wizard.success.download")}
          </Button>
          <Button variant="outline" onClick={() => { setIsSuccess(false); setStep(1); setData(INITIAL_DATA); }} className="rounded-2xl px-10 py-6 font-bold">
            {t("contact.wizard.success.button")}
          </Button>
        </div>
      </m.div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-12 gap-2">
        {STEPS.map((s, i) => (
          <div key={i} className="flex-1 flex flex-col gap-2">
            <div className={cn("h-1.5 rounded-full transition-all duration-500", step > i ? "bg-accent shadow-accent-glow" : "bg-white/5")} />
            <span className={cn("text-[10px] font-black uppercase tracking-widest text-center", step === i + 1 ? "text-accent" : "text-white/20")}>
              {t(`contact.wizard.steps.${s}`)}
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
                    <input type="text" value={data.name} onChange={(e) => updateData({ name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-foreground focus:outline-none focus:border-accent transition-all" placeholder={t("contact.wizard.form.name.placeholder")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t("contact.wizard.form.email")}</label>
                    <input type="email" value={data.email} onChange={(e) => updateData({ email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-foreground focus:outline-none focus:border-accent transition-all" placeholder={t("contact.wizard.form.email.placeholder")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t("contact.wizard.form.concept")}</label>
                  <input type="text" value={data.concept} onChange={(e) => updateData({ concept: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-foreground focus:outline-none focus:border-accent transition-all" placeholder={t("contact.wizard.form.concept.placeholder")} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2 text-glow">
                    <Target className="text-accent" size={24} />
                    {t("contact.wizard.step2.title")}
                  </h3>
                  <p className="text-text-secondary text-sm">{t("contact.wizard.step2.desc")}</p>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t("contact.wizard.objective.label")}</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {OBJECTIVE_OPTIONS.map(opt => (
                      <button key={opt.id} onClick={() => updateData({ objective: opt.id })} className={cn("flex items-center gap-4 p-4 rounded-2xl border text-left transition-all", data.objective === opt.id ? "border-accent bg-accent text-background" : "border-white/10 bg-white/5 text-foreground hover:border-white/30")}>
                        <div className={cn("p-2 rounded-lg", data.objective === opt.id ? "bg-background/20 text-background" : "bg-white/5 text-accent")}>{opt.icon}</div>
                        <div>
                          <p className="font-bold text-xs uppercase tracking-tight">{t(`contact.wizard.objective.${opt.id}.label`)}</p>
                          <p className={cn("text-[10px] leading-tight", data.objective === opt.id ? "text-background/80" : "text-text-muted")}>{t(`contact.wizard.objective.${opt.id}.desc`)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t("contact.wizard.form.industry")}</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    {INDUSTRY_OPTIONS.map(opt => (
                      <button key={opt.id} onClick={() => updateData({ industry: opt.id })} className={cn("flex flex-col items-center p-3 rounded-xl border text-[10px] transition-all", data.industry === opt.id ? "border-accent bg-accent text-background" : "border-white/10 bg-white/5 text-text-muted hover:border-white/30")}>
                        <div className="mb-2">{opt.icon}</div>
                        <span className="truncate w-full text-center">{t(`contact.wizard.industry.${opt.id}.label`)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2 text-glow">
                    <Box className="text-accent" size={24} />
                    {t("contact.wizard.step3.title")}
                  </h3>
                  <p className="text-text-secondary text-sm">{t("contact.wizard.step3.desc")}</p>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t("contact.wizard.review.features")}</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {FEATURE_OPTIONS.map(opt => {
                      const active = data.features.includes(opt.id);
                      return (
                        <button key={opt.id} onClick={() => updateData({ features: active ? data.features.filter(f => f !== opt.id) : [...data.features, opt.id] })} className={cn("flex items-center gap-3 p-4 rounded-xl border text-left transition-all", active ? "border-accent bg-accent text-background" : "border-white/10 bg-white/5 text-foreground hover:border-white/30")}>
                          <div className={cn("p-1.5 rounded-lg", active ? "bg-background/20 text-background" : "bg-white/5 text-accent")}>{opt.icon}</div>
                          <div className="flex flex-col">
                            <span className="font-bold text-[10px] uppercase tracking-tight line-clamp-1">{t(`contact.wizard.feature.${opt.id}.label`)}</span>
                            <span className={cn("text-[8px] line-clamp-1", active ? "text-background/70" : "text-text-muted")}>{t(`contact.wizard.feature.${opt.id}.desc`)}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t("contact.wizard.form.timeline")}</label>
                    <div className="grid grid-cols-1 gap-2">
                      {TIMELINE_OPTIONS.map(opt => (
                        <button key={opt.id} onClick={() => updateData({ timeline: opt.id })} className={cn("p-3 rounded-xl border text-xs font-bold transition-all", data.timeline === opt.id ? "border-accent bg-accent text-background" : "border-white/10 bg-white/5 hover:border-white/30")}>
                          {t(`contact.wizard.timeline.${opt.id}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted">{t("contact.wizard.form.budget")}</label>
                    <div className="grid grid-cols-1 gap-2">
                    {BUDGET_OPTIONS.map(opt => (
                        <button key={opt.id} onClick={() => updateData({ budget: opt.id })} className={cn("p-3 rounded-xl border text-xs font-bold transition-all", data.budget === opt.id ? "border-accent bg-accent text-background" : "border-white/10 bg-white/5 hover:border-white/30")}>
                          {t(`contact.wizard.budget.${opt.id}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2 text-glow">
                    <Layout className="text-accent" size={24} />
                    {t("contact.wizard.step4.title")}
                  </h3>
                  <p className="text-text-secondary text-sm">{t("contact.wizard.step4.desc")}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">{t("contact.wizard.review.client")}</span>
                        <p className="text-foreground font-medium">{data.name}</p>
                        <p className="text-text-secondary text-xs">{data.email}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">{t("contact.wizard.review.concept")}</span>
                        <p className="text-foreground font-medium">{data.concept}</p>
                        <p className="text-text-secondary text-xs italic">{t(`contact.wizard.industry.${data.industry}.label`)} &bull; {t(`contact.wizard.objective.${data.objective}.label`)}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">{t("contact.wizard.review.features")}</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {data.features.map(f => (
                            <span key={f} className="text-[9px] px-2 py-0.5 bg-accent/10 border border-accent/20 text-accent rounded-full font-bold">
                              {t(`contact.wizard.feature.${f}.label`)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">{t("contact.wizard.form.timeline")}</span>
                          <p className="text-foreground text-xs font-bold">{t(`contact.wizard.timeline.${data.timeline}`)}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">{t("contact.wizard.form.budget")}</span>
                          <p className="text-foreground text-xs font-bold">{t(`contact.wizard.budget.${data.budget}`)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 bg-white/5 border border-white/5 rounded-2xl p-6">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <input type="checkbox" checked={data.agreedToTerms} onChange={(e) => updateData({ agreedToTerms: e.target.checked })} className="sr-only peer" />
                    <div className="w-6 h-6 border-2 border-white/20 rounded bg-white/5 peer-checked:bg-accent peer-checked:border-accent transition-all flex items-center justify-center shrink-0">
                      <CheckCircle2 size={16} className="text-background opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-sm text-text-secondary group-hover:text-foreground transition-colors">{t("contact.wizard.form.agree_terms")}</span>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <input type="checkbox" checked={data.agreedToCommunication} onChange={(e) => updateData({ agreedToCommunication: e.target.checked })} className="sr-only peer" />
                    <div className="w-6 h-6 border-2 border-white/20 rounded bg-white/5 peer-checked:bg-accent peer-checked:border-accent transition-all flex items-center justify-center shrink-0">
                      <CheckCircle2 size={16} className="text-background opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-sm text-text-secondary group-hover:text-foreground transition-colors">{t("contact.wizard.form.agree_comm")}</span>
                  </label>
                </div>
              </div>
            )}
          </m.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/5">
        <Button variant="ghost" onClick={prevStep} disabled={step === 1 || isSubmitting} className={cn("rounded-xl px-4 py-2 font-bold", step === 1 && "opacity-0 invisible")}>
          <ArrowLeft size={16} className="mr-2" /> {t("contact.wizard.nav.back")}
        </Button>
        {step < STEPS.length ? (
          <Button onClick={nextStep} disabled={!calculateCanGoNext()} className="rounded-xl px-8 py-2 font-bold shadow-blue-glow">
            {t("contact.wizard.nav.continue")} <ArrowRight size={16} className="ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting || !calculateCanGoNext()} className="rounded-xl px-12 py-3 font-black uppercase tracking-widest shadow-accent-glow">
            {isSubmitting ? t("contact.wizard.nav.syncing") : t("contact.wizard.nav.launch")}
            <Rocket size={18} className="ml-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
