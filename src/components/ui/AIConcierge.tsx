"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, ArrowRight, Bot, Trash2, Maximize2, Minimize2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import * as LucideIcons from "lucide-react";
import ReactMarkdown from "react-markdown";

export interface AgentConfig {
  name: string;
  description?: string;
  personality?: string;
  greeting?: string;
  branding: {
    primaryColor: string;
    icon: string;
    theme: "dark" | "light" | "glass";
  };
  knowledgeBase?: string[];
  capabilities?: string[];
  presets?: { label: string; query: string }[];
}

const DynamicIcon = ({ name, size = 20, className = "" }: { name: string, size?: number, className?: string }) => {
  // @ts-expect-error - LucideIcons is a module object and we are indexing it with a string key
  const IconComponent = LucideIcons[name.charAt(0).toUpperCase() + name.slice(1)] || Bot;
  return <IconComponent size={size} className={className} />;
};

interface AIConciergeProps {
  config?: AgentConfig;
  previewMode?: boolean;
  embedMode?: boolean;
}

export default function AIConcierge({ config, previewMode = false, embedMode = false }: AIConciergeProps) {
  const [isOpen, setIsOpen] = useState(previewMode || embedMode);
  const [isMaximized, setIsMaximized] = useState(embedMode);
  const { t } = useI18n();

  // Default values if no config is provided
  const name = config?.name || t("concierge.name");
  const greeting = config?.greeting || t("concierge.greeting");
  const primaryColor = config?.branding?.primaryColor || "var(--accent)";
  const iconName = config?.branding?.icon || "Bot";
  
  const PRESETS = config?.presets || [
    { label: t("concierge.preset.tech.label"), query: t("concierge.preset.tech.query") },
    { label: t("concierge.preset.cost.label"), query: t("concierge.preset.cost.query") },
    { label: t("concierge.preset.saas.label"), query: t("concierge.preset.saas.query") },
  ];

  type Message = { role: 'assistant' | 'user', content: string };

  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  // Storage Key
  const storageKey = `aris_chat_${config?.name || 'default'}`;

  // Load messages from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved messages", e);
        setMessages([{ role: 'assistant', content: greeting }]);
      }
    } else {
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [storageKey, greeting]);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: greeting }]);
    localStorage.removeItem(storageKey);
  };

  const handleQuery = async (query: string) => {
    if (!query.trim() || previewMode) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newMessages,
          context: {
            url: typeof window !== "undefined" ? window.location.href : undefined,
            title: typeof window !== "undefined" ? document.title : undefined,
          },
          config: config ? {
            name: config.name,
            description: config.description,
            personality: config.personality
          } : undefined
        })
      });

      if (!response.ok) throw new Error("Connection lost");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) throw new Error("No reader");

      let assistantMessage = "";
      setMessages(prev => [...prev, { role: 'assistant', content: "" }]);
      setIsTyping(false); // Stop typing indicator once stream starts

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantMessage += chunk;
        
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last.role === 'assistant') {
            return [...prev.slice(0, -1), { role: 'assistant', content: assistantMessage }];
          }
          return prev;
        });
      }
    } catch (error) {
      console.error("Chat failure:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: t("concierge.fallback") }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={previewMode ? "relative" : ""}>
      {/* Floating Toggle */}
      {!previewMode && !embedMode && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-8 right-8 z-60 w-14 h-14 text-background rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group overflow-hidden"
        >
          <div 
            className="absolute inset-0 animate-gradient-xy group-hover:scale-110 transition-transform duration-500" 
            style={{ background: 'linear-gradient(135deg, #4F46E5, #3B82F6, #10B981)' }}
          />
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" className="relative z-10" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div key="open" className="relative z-10" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <DynamicIcon name={iconName} size={24} className="group-hover:animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-20 group-hover:opacity-40" />
        </button>
      )}

      {/* Chat Pane */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={previewMode ? { opacity: 1, scale: 1 } : { opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`
              ${previewMode ? "relative w-full h-[600px]" : embedMode ? "fixed inset-0 w-full h-full" : 
                isMaximized ? "fixed inset-8 w-auto h-auto" : "fixed bottom-24 right-8 w-[420px] max-w-[calc(100vw-64px)] h-[600px] max-h-[calc(100vh-120px)]"} 
              z-60 rounded-[32px] flex flex-col overflow-hidden shadow-2xl transition-all duration-500
              ${config?.branding?.theme === 'light' ? 'bg-white text-gray-900 border-gray-200' : 
                config?.branding?.theme === 'glass' ? 'bg-black/80 backdrop-blur-3xl border-white/10' : 
                'bg-slate-950 text-white border-white/5'} 
              border
            `}
          >
            {/* Header */}
            <div className={`relative p-6 border-b flex items-center justify-between overflow-hidden bg-white/5 border-white/5`}>
              <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/10 opacity-30" />
              
              <div className="flex items-center gap-4 relative z-10">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-background shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #4F46E5, #3B82F6, #8B5CF6)' }}
                >
                  <DynamicIcon name={iconName} size={26} />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-white">{name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">{t("concierge.status")}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 relative z-10">
                {!previewMode && !embedMode && (
                  <button 
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                    title={isMaximized ? "Restore" : "Maximize"}
                  >
                    {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                )}
                <button 
                  onClick={clearChat}
                  className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                  title="Clear Chat"
                >
                  <Trash2 size={16} />
                </button>
                {!previewMode && !embedMode && (
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all md:hidden"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                >
                  <div 
                    className={`max-w-[85%] p-5 rounded-3xl group relative ${
                      msg.role === 'assistant' 
                        ? 'bg-white/5 text-gray-200 rounded-tl-none border border-white/10 shadow-lg' 
                        : 'text-white rounded-tr-none font-medium shadow-xl'
                    }`}
                    style={msg.role === 'user' ? { background: `linear-gradient(135deg, ${primaryColor}, #3B82F6)` } : {}}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="markdown-prose text-sm leading-relaxed tracking-wide">
                        <ReactMarkdown>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-5 rounded-3xl rounded-tl-none border border-white/5 flex gap-1.5 shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Presets & Input Area */}
            <div className="p-8 pt-2 space-y-6 bg-linear-to-b from-transparent to-black/20">
              {messages.length < 4 && (
                <div className="flex flex-wrap gap-2.5">
                  {PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuery(preset.query)}
                      className="text-[11px] font-bold px-4 py-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all flex items-center gap-2.5 backdrop-blur-md shadow-sm"
                    >
                      {preset.label}
                      <ArrowRight size={14} className="opacity-50" />
                    </button>
                  ))}
                </div>
              )}

              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("concierge.placeholder")}
                  disabled={previewMode || isTyping}
                  className={`w-full border rounded-[24px] py-5 pl-8 pr-16 text-sm outline-none transition-all shadow-xl font-medium
                    ${config?.branding?.theme === 'light' 
                      ? 'bg-gray-50 border-gray-200 text-gray-900 focus:bg-white focus:border-blue-500' 
                      : 'bg-white/5 border-white/10 text-white focus:bg-white/10 focus:border-white/20'
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && input) {
                      handleQuery(input);
                    }
                  }}
                />
                <button 
                  onClick={() => handleQuery(input)}
                  disabled={!input || isTyping}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-white text-slate-950 rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-lg"
                >
                  {isTyping ? <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" /> : <Send size={18} />}
                </button>
              </div>
              
              <p className="text-[10px] text-center text-white/20 font-medium tracking-tight">
                ARiS Intelligence • Powered by Gemini 2.0 Flash
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx global>{`
        .markdown-prose p { margin-bottom: 0.75rem; }
        .markdown-prose p:last-child { margin-bottom: 0; }
        .markdown-prose ul, .markdown-prose ol { margin-left: 1.25rem; margin-bottom: 0.75rem; list-style-type: disc; }
        .markdown-prose li { margin-bottom: 0.25rem; }
        .markdown-prose strong { color: white; font-weight: 700; }
        .markdown-prose code { background: rgba(255,255,255,0.1); padding: 0.1rem 0.3rem; border-radius: 0.25rem; font-family: monospace; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
