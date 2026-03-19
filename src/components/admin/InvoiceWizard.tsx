"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Code, Layout, Settings, 
  ChevronRight, ChevronLeft, Save, Euro, 
  CheckCircle2, Package, Globe, ShieldCheck,
  Search, Terminal, Database, Cpu, Layers
} from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";

export interface WizardData {
  userId: Id<"users"> | "";
  projectName: string;
  metadata: {
    number: string;
    issueDate: string;
    dueDate: string;
  };
  client: {
    name: string;
    company: string;
    address: string;
    contact: string;
  };
  stack: {
    frontend: string;
    backend: string;
    database: string;
    infrastructure: string;
    licenses: string[];
  };
  deliverables: {
    pages: string[];
    responsive: boolean;
    cms: string;
    adminPanel: boolean;
  };
  features: {
    core: string[];
    services: string[];
    qa: string[];
    postLaunch: string[];
  };
  financials: {
    billingModel: "fixed" | "hourly";
    hourlyRate: string;
    hoursWorked: string;
    baseSubtotal: string;
    discount: string;
    deposit: string;
    taxRate: string;
    currency: string;
    paymentInstructions: string;
  };
}

const STEPS = [
  { id: 1, title: "Project & Client", icon: User },
  { id: 2, title: "Tech Stack", icon: Code },
  { id: 3, title: "Deliverables", icon: Layout },
  { id: 4, title: "Features & QA", icon: Settings },
  { id: 5, title: "Financials", icon: Euro }
];

interface InvoiceWizardProps {
  clients: Array<{ _id: Id<"users">; name?: string; email?: string }>;
  onSave: (data: WizardData & { financials: { total: string; subtotal: string } }) => Promise<void>;
  saving: boolean;
  initialData?: Partial<WizardData>;
}

export default function InvoiceWizard({ clients, onSave, saving, initialData }: InvoiceWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 9000) + 1000;
    
    const baseData = {
      userId: "",
      projectName: "",
      metadata: {
        number: `INV-${year}${month}-${random}`,
        issueDate: date.toISOString().split('T')[0],
        dueDate: "",
      },
      client: {
        name: "",
        company: "",
        address: "",
        contact: "",
      },
      stack: {
        frontend: "React / Next.js",
        backend: "Node.js (Express/Hono)",
        database: "PostgreSQL",
        infrastructure: "Vercel / AWS",
        licenses: [],
      },
      deliverables: {
        pages: ["Landing Page", "User Dashboard"],
        responsive: true,
        cms: "Headless (Contentful/Sanity)",
        adminPanel: true,
      },
      features: {
        core: ["Auth Integration", "API Development"],
        services: ["SEO Optimization", "Performance Audit"],
        qa: ["Unit Testing", "E2E Testing"],
        postLaunch: ["Documentation", "Handover Session"],
      },
      financials: {
        billingModel: "fixed",
        hourlyRate: "80",
        hoursWorked: "40",
        baseSubtotal: "0",
        discount: "0",
        deposit: "0",
        taxRate: "19",
        currency: "EUR",
        paymentInstructions: "Bank Transfer (IBAN/SWIFT) as per the framework agreement.",
      }
    };

    if (initialData) {
      return {
        ...baseData,
        ...initialData,
        metadata: { ...baseData.metadata, ...initialData.metadata },
        client: { ...baseData.client, ...initialData.client },
        stack: { ...baseData.stack, ...initialData.stack },
        deliverables: { ...baseData.deliverables, ...initialData.deliverables },
        features: { ...baseData.features, ...initialData.features },
        financials: { ...baseData.financials, ...initialData.financials },
      } as WizardData;
    }
    return baseData as WizardData;
  });

  // Removed useEffect sync to avoid cascading renders. 
  // Parent component should use key={initialData?._id} to trigger remount if data loads late.

  // Derived financial values
  const financialResults = useMemo(() => {
    let subtotal = 0;
    if (data.financials.billingModel === "hourly") {
      subtotal = parseFloat(data.financials.hourlyRate) * parseFloat(data.financials.hoursWorked);
    } else {
      subtotal = parseFloat(data.financials.baseSubtotal);
    }
    
    const discount = parseFloat(data.financials.discount) || 0;
    const deposit = parseFloat(data.financials.deposit) || 0;
    const taxRate = parseFloat(data.financials.taxRate) || 0;
    
    const taxable = subtotal - discount;
    const tax = taxable * (taxRate / 100);
    const total = taxable + tax - deposit;
    
    return {
      subtotal: subtotal.toFixed(2),
      total: (total < 0 ? 0 : total).toFixed(2),
      subtotalNum: subtotal,
      totalNum: total < 0 ? 0 : total
    };
  }, [data.financials]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const updateNested = <
    K extends "metadata" | "client" | "stack" | "deliverables" | "features" | "financials", 
    F extends keyof WizardData[K]
  >(
    category: K, 
    field: F, 
    value: WizardData[K][F]
  ) => {
    setData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  type StringArrayKeys<T> = {
    [K in keyof T]: T[K] extends string[] ? K : never
  }[keyof T];

  const addItem = <C extends "deliverables" | "features" | "stack">(
    category: C, 
    field: StringArrayKeys<WizardData[C]>, 
    item: string
  ) => {
    if (!item) return;
    setData(prev => {
      const cat = prev[category];
      const current = (cat[field as keyof typeof cat] as unknown as string[]) || [];
      if (current.includes(item)) return prev;
      return {
        ...prev,
        [category]: {
          ...cat,
          [field]: [...current, item]
        }
      };
    });
  };

  const removeItem = <C extends "deliverables" | "features" | "stack">(
    category: C, 
    field: StringArrayKeys<WizardData[C]>, 
    item: string
  ) => {
    setData(prev => {
      const cat = prev[category];
      const current = (cat[field as keyof typeof cat] as unknown as string[]) || [];
      return {
        ...prev,
        [category]: {
          ...cat,
          [field]: current.filter(i => i !== item)
        }
      };
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="mb-12">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 z-0" />
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                    isActive 
                      ? "bg-accent-blue border-accent-blue text-white shadow-lg shadow-blue-500/20 scale-110" 
                      : isCompleted
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "bg-black border-white/10 text-white/40"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={24} /> : <Icon size={20} />}
                </div>
                <span className={`text-[10px] uppercase font-bold tracking-widest ${isActive ? "text-white" : "text-white/40"}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[500px] mb-8 relative">
        <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl shadow-black/50">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                       <User size={18} className="text-blue-400" /> Client Identification
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Select Client</label>
                        <select
                          required
                          value={data.userId}
                          onChange={(e) => {
                            const user = clients.find(c => c._id === e.target.value);
                            setData(prev => ({ 
                              ...prev, 
                              userId: e.target.value as Id<"users">,
                              client: { ...prev.client, name: user?.name || "", contact: user?.email || "" }
                            }));
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-white/20 transition-all"
                        >
                          <option value="">Choose a client...</option>
                          {clients.map(client => (
                            <option key={client._id} value={client._id}>
                              {client.name} ({client.email})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Company Name</label>
                        <input
                          type="text"
                          value={data.client.company}
                          onChange={(e) => updateNested("client", "company", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-white/20 transition-all"
                          placeholder="e.g. Acme Studio"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Billing Address</label>
                        <textarea
                          value={data.client.address}
                          onChange={(e) => updateNested("client", "address", e.target.value)}
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-white/20 transition-all resize-none"
                          placeholder="Enter full address..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                       <Package size={18} className="text-blue-400" /> Project & Invoice
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Project Name</label>
                        <input
                          type="text"
                          value={data.projectName}
                          onChange={(e) => setData({ ...data, projectName: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-white/20 transition-all"
                          placeholder="e.g. Portfolio Website V2"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Invoice Number</label>
                        <input
                          type="text"
                          value={data.metadata.number}
                          onChange={(e) => updateNested("metadata", "number", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white font-mono focus:border-white/20 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Due Date</label>
                        <input
                          type="date"
                          value={data.metadata.dueDate}
                          onChange={(e) => updateNested("metadata", "dueDate", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-white/20 transition-all scheme-dark"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl shadow-black/50">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                       <Terminal size={18} className="text-blue-400" /> Development Stack
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest flex items-center gap-2">
                          <Layers size={10} /> Frontend Framework
                        </label>
                        <input
                          type="text"
                          value={data.stack.frontend}
                          onChange={(e) => updateNested("stack", "frontend", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-white/20 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest flex items-center gap-2">
                          <Cpu size={10} /> Backend / Logic
                        </label>
                        <input
                          type="text"
                          value={data.stack.backend}
                          onChange={(e) => updateNested("stack", "backend", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-white/20 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest flex items-center gap-2">
                          <Database size={10} /> Database System
                        </label>
                        <input
                          type="text"
                          value={data.stack.database}
                          onChange={(e) => updateNested("stack", "database", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-white/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                       <Globe size={18} className="text-blue-400" /> Infrastructure
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Hosting Provider</label>
                        <input
                          type="text"
                          value={data.stack.infrastructure}
                          onChange={(e) => updateNested("stack", "infrastructure", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-white/20 transition-all"
                          placeholder="AWS, Vercel, Netlify..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Third-Party Licenses</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addItem("stack", "licenses", e.currentTarget.value);
                                e.currentTarget.value = "";
                              }
                            }}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-white/20"
                            placeholder="Add paid API/Plugin..."
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {data.stack.licenses.map(lic => (
                            <span key={lic} className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 text-white/60 flex items-center gap-1">
                              {lic} <button type="button" onClick={() => removeItem("stack", "licenses", lic)} className="hover:text-red-400">×</button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl shadow-black/50">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                       <Layout size={18} className="text-blue-400" /> Page Itemization
                    </h3>
                    <div className="space-y-4">
                      <div className="flex gap-2 text-[10px] text-white/20 font-bold uppercase tracking-widest px-1">Add Deliverable</div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addItem("deliverables", "pages", e.currentTarget.value);
                              e.currentTarget.value = "";
                            }
                          }}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-white/20"
                          placeholder="e.g. Admin Dashboard"
                        />
                      </div>
                      <div className="space-y-2">
                        {(data.deliverables.pages || []).map(page => (
                          <div key={page} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/80">
                            {page}
                            <button 
                              type="button" 
                              onClick={() => removeItem("deliverables", "pages", page)} 
                              className="text-white/20 hover:text-red-400 Transition-all px-2"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                       <Settings size={18} className="text-blue-400" /> Features & Config
                    </h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-white">Responsive Design</p>
                          <p className="text-[10px] text-white/40">Mobile/Tablet optimization</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => updateNested("deliverables", "responsive", !data.deliverables.responsive)}
                          className={`w-12 h-6 rounded-full transition-all relative ${data.deliverables.responsive ? 'bg-blue-500' : 'bg-white/10'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${data.deliverables.responsive ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">CMS Implementation</label>
                        <select
                          value={data.deliverables.cms}
                          onChange={(e) => updateNested("deliverables", "cms", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white"
                        >
                          <option value="None">No CMS</option>
                          <option value="Headless (Contentful/Sanity)">Headless (Sanity/Contentful)</option>
                          <option value="Prisma / Custom Postgres">Custom DB Admin</option>
                          <option value="Convex / Firebase">BaaS Admin</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-white">Full Admin Tools</p>
                          <p className="text-[10px] text-white/40">Includes control panel & analytics</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => updateNested("deliverables", "adminPanel", !data.deliverables.adminPanel)}
                          className={`w-12 h-6 rounded-full transition-all relative ${data.deliverables.adminPanel ? 'bg-blue-500' : 'bg-white/10'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${data.deliverables.adminPanel ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl shadow-black/50">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                       <ShieldCheck size={18} className="text-emerald-400" /> Core Integrations
                    </h3>
                    <div className="space-y-4">
                      {["Stripe / Payment Gateway", "NextAuth / OAuth", "OpenAI / AI Integration", "AWS S3 / Storage", "Twilio / SMS", "SendGrid / Email"].map(feat => (
                        <button 
                          key={feat}
                          type="button"
                          onClick={() => {
                            if (data.features.core.includes(feat)) removeItem("features", "core", feat);
                            else addItem("features", "core", feat);
                          }}
                          className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                            data.features.core.includes(feat) 
                              ? "bg-blue-500/10 border-blue-500/40 text-blue-300" 
                              : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                          }`}
                        >
                          {feat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                       <Search size={18} className="text-blue-400" /> Professional Services
                    </h3>
                    <div className="space-y-4">
                      {["SEO Technical Audit", "Performance Optimization", "Security Auditing", "Automated E2E Testing", "System Architecture Docs", "Database Schema Modeling"].map(svc => (
                        <button 
                          key={svc}
                          type="button"
                          onClick={() => {
                            if (data.features.services.includes(svc)) removeItem("features", "services", svc);
                            else addItem("features", "services", svc);
                          }}
                          className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                            data.features.services.includes(svc) 
                              ? "bg-purple-500/10 border-purple-500/40 text-purple-300" 
                              : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                          }`}
                        >
                          {svc}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl shadow-black/50 hover:border-blue-500/20 transition-colors">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                       <Euro size={18} className="text-emerald-400" /> Billing Model
                    </h3>
                    <div className="space-y-4">
                      <div className="flex p-1 rounded-xl bg-black border border-white/10">
                        <button 
                          type="button"
                          onClick={() => updateNested("financials", "billingModel", "fixed")}
                          className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${data.financials.billingModel === 'fixed' ? 'bg-white/10 text-white' : 'text-white/30'}`}
                        >
                          FIXED FEE
                        </button>
                        <button 
                          type="button"
                          onClick={() => updateNested("financials", "billingModel", "hourly")}
                          className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${data.financials.billingModel === 'hourly' ? 'bg-white/10 text-white' : 'text-white/30'}`}
                        >
                          HOURLY RATE
                        </button>
                      </div>

                      {data.financials.billingModel === 'hourly' ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Rate (EUR)</label>
                            <input
                              type="number"
                              value={data.financials.hourlyRate}
                              onChange={(e) => updateNested("financials", "hourlyRate", e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Hours</label>
                            <input
                              type="number"
                              value={data.financials.hoursWorked}
                              onChange={(e) => updateNested("financials", "hoursWorked", e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Fixed Amount (EUR)</label>
                          <input
                            type="number"
                            value={data.financials.baseSubtotal}
                            onChange={(e) => updateNested("financials", "baseSubtotal", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Discount</label>
                          <input
                            type="number"
                            value={data.financials.discount}
                            onChange={(e) => updateNested("financials", "discount", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Deposit Already Paid</label>
                          <input
                            type="number"
                            value={data.financials.deposit}
                            onChange={(e) => updateNested("financials", "deposit", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                       <CheckCircle2 size={18} className="text-blue-400" /> Final Summary
                    </h3>
                    <div className="p-6 rounded-2xl bg-black border border-blue-500/20 space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">Subtotal</span>
                        <span className="text-white font-mono">{parseFloat(financialResults.subtotal).toLocaleString()} EUR</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">Tax ({data.financials.taxRate}%)</span>
                        <span className="text-white font-mono">{( (parseFloat(financialResults.subtotal) - (parseFloat(data.financials.discount) || 0)) * (parseFloat(data.financials.taxRate)/100) ).toLocaleString()} EUR</span>
                      </div>
                      <div className="h-px bg-white/10" />
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-blue-400">Total Due</span>
                        <span className="text-white font-mono">{parseFloat(financialResults.total).toLocaleString()} EUR</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Payment Instructions</label>
                      <textarea
                        value={data.financials.paymentInstructions}
                        onChange={(e) => updateNested("financials", "paymentInstructions", e.target.value)}
                        rows={2}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center bg-black/50 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-2xl">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white text-sm font-bold hover:bg-white/5 disabled:opacity-30 transition-all"
        >
          <ChevronLeft size={18} /> Back
        </button>

        {currentStep < 5 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-10 py-3 rounded-xl bg-white text-black text-sm font-bold hover:bg-blue-500 hover:text-white transition-all group"
          >
            Continue <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              const finalData = {
                ...data,
                financials: {
                  ...data.financials,
                  subtotal: financialResults.subtotal,
                  total: financialResults.total,
                }
              };
              onSave(finalData as unknown as WizardData & { financials: { total: string; subtotal: string } });
            }}
            disabled={saving || !data.userId}
            className="flex items-center gap-2 px-12 py-3 rounded-xl bg-accent-blue text-white text-sm font-bold hover:bg-accent-purple transition-all disabled:opacity-50 shadow-xl shadow-blue-500/20 active:scale-95 border border-white/10"
          >
            {saving ? "Generating..." : "Finalize & Send Invoice"}
            <Save size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
