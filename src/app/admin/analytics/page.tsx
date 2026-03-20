"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, BarChart, CheckCircle2, AlertCircle, ArrowUpRight, Search, Zap, Code, Shield, FileText } from "lucide-react";
import { analyzeContent } from "@/lib/geo-analyzer";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

type Tab = "ga4" | "geo";

export default function AnalyticsSystemPage() {
  const [activeTab, setActiveTab] = useState<Tab>("geo");

  // Fetch all CMS content deterministically
  const allContent = useQuery(api.analytics.getAllIndexableContent);

  // Run the algorithm over the entire site autonomously
  const siteAnalysis = useMemo(() => {
    if (!allContent) return null;

    let totalSeoScore = 0;
    let totalGeoScore = 0;
    const itemResults: any[] = [];

    // Counters for common missing markers site-wide
    let missingFaqs = 0;
    let missingQuotes = 0;
    let missingStats = 0;

    allContent.forEach((item) => {
      const result = analyzeContent(
        item.content || "",
        item._analyzerTitle || "",
        item._analyzerMeta || "",
        item._analyzerKeyword || ""
      );

      totalSeoScore += result.seo.score;
      totalGeoScore += result.geo.score;

      // Check specific GEO flags
      if (!result.geo.checks.find(c => c.id === "faqs")?.passed) missingFaqs++;
      if (!result.geo.checks.find(c => c.id === "quotes")?.passed) missingQuotes++;
      if (!result.geo.checks.find(c => c.id === "statistics")?.passed) missingStats++;

      itemResults.push({
        _id: item._id,
        title: item.title,
        type: item._type,
        seoScore: result.seo.score,
        geoScore: result.geo.score,
        checks: result
      });
    });

    return {
      avgSeoScore: Math.round(totalSeoScore / (allContent.length || 1)),
      avgGeoScore: Math.round(totalGeoScore / (allContent.length || 1)),
      totalItems: allContent.length,
      insights: {
        missingFaqs,
        missingQuotes,
        missingStats
      },
      itemResults
    };
  }, [allContent]);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12">
      <header className="space-y-4">
        <h1 className="text-3xl font-black text-white tracking-tight uppercase italic drop-shadow-lg">
          Control Center <span className="text-accent-blue">Intelligence</span>
        </h1>
        <p className="text-sm text-white/50 font-medium max-w-2xl">
          Automatic site-wide SEO + GEO content validation and platform telemetry.
        </p>
      </header>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("geo")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === "geo" ? "bg-accent-blue text-black" : "text-white/40 hover:text-white"
          }`}
        >
          <Search size={14} /> Site-Wide Content Health
        </button>
        <button
          onClick={() => setActiveTab("ga4")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === "ga4" ? "bg-accent-blue text-black" : "text-white/40 hover:text-white"
          }`}
        >
          <LineChart size={14} /> Google Analytics (GA4)
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "geo" && (
          <motion.div
            key="geo"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Loading State or Results */}
            {allContent === undefined ? (
               <div className="h-[300px] flex flex-col items-center justify-center p-12 bg-white/5 border border-white/10 rounded-3xl text-center space-y-4">
                  <div className="w-8 h-8 rounded-full border-4 border-accent-blue border-r-transparent animate-spin" />
                  <p className="text-sm font-bold text-white/50 animate-pulse">Running site-wide algorithms...</p>
               </div>
            ) : siteAnalysis ? (
              <>
                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="p-6 bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/10 rounded-full blur-3xl group-hover:bg-accent-purple/20 transition-all" />
                      <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 relative z-10">Avg SEO Score</h4>
                      <p className="text-5xl font-black text-white relative z-10">{siteAnalysis.avgSeoScore}</p>
                   </div>
                   <div className="p-6 bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/10 rounded-full blur-3xl group-hover:bg-accent-blue/20 transition-all" />
                      <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2 relative z-10">Avg GEO Score</h4>
                      <p className="text-5xl font-black text-white relative z-10">{siteAnalysis.avgGeoScore}</p>
                   </div>
                   <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col justify-center space-y-4">
                       <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest">Global Insights</h4>
                       <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                             <span className="text-white/50">Missing FAQs:</span>
                             <span className={siteAnalysis.insights.missingFaqs > 0 ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>{siteAnalysis.insights.missingFaqs} pages</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                             <span className="text-white/50">Missing Quotes:</span>
                             <span className={siteAnalysis.insights.missingQuotes > 0 ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>{siteAnalysis.insights.missingQuotes} pages</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                             <span className="text-white/50">Missing Stats:</span>
                             <span className={siteAnalysis.insights.missingStats > 0 ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>{siteAnalysis.insights.missingStats} pages</span>
                          </div>
                       </div>
                   </div>
                </div>

                {/* Individual Pages List */}
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-6">
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">Indexed Pages ({siteAnalysis.totalItems})</h4>
                  
                  <div className="space-y-4">
                    {siteAnalysis.itemResults.map((item, idx) => (
                      <div key={idx} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-white/10 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-black uppercase tracking-widest text-white/70">{item.type}</span>
                            <h5 className="font-bold text-white text-sm truncate max-w-[250px] md:max-w-md">{item.title}</h5>
                          </div>
                          {/* Render specific warnings for this item if any */}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.checks.geo.checks.filter((c: any) => !c.passed).slice(0, 2).map((c: any, i: number) => (
                               <span key={i} className="text-[10px] text-rose-400/80 bg-rose-400/10 px-2 py-1 rounded flex items-center gap-1">
                                 <AlertCircle size={10} /> {c.label}
                               </span>
                            ))}
                            {item.checks.seo.checks.filter((c: any) => !c.passed).slice(0, 1).map((c: any, i: number) => (
                               <span key={i} className="text-[10px] text-amber-400/80 bg-amber-400/10 px-2 py-1 rounded flex items-center gap-1">
                                 <AlertCircle size={10} /> {c.label}
                               </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-6 shrink-0 text-right">
                          <div>
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">SEO</p>
                            <p className={`text-xl font-black ${item.seoScore > 70 ? 'text-emerald-400' : item.seoScore > 40 ? 'text-amber-400' : 'text-rose-400'}`}>{item.seoScore}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">GEO</p>
                            <p className={`text-xl font-black ${item.geoScore > 70 ? 'text-emerald-400' : item.geoScore > 40 ? 'text-amber-400' : 'text-rose-400'}`}>{item.geoScore}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </motion.div>
        )}

        {/* GA4 TAB WIRING */}
        {activeTab === "ga4" && (
          <motion.div
            key="ga4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
             <GA4Dashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Separate component for fetching real GA amounts
import { useEffect } from "react";
function GA4Dashboard() {
  const [gaData, setGaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/analytics")
      .then(r => r.json())
      .then(res => {
        if (res.error) setError(res.error);
        if (res.success) setGaData(res.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
       <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
         <div className="w-8 h-8 rounded-full border-4 border-accent-blue border-r-transparent animate-spin" />
         <p className="text-white/50 text-sm font-bold animate-pulse">Establishing secure link to Google Analytics...</p>
       </div>
    );
  }

  if (error || !gaData) {
    return (
       <div className="p-8 bg-white/5 border border-white/10 rounded-3xl h-[400px] flex flex-col items-center justify-center space-y-6 text-center">
         <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
           <BarChart className="w-8 h-8 text-white/20" />
         </div>
         <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Google Analytics Connection Failed</h3>
            <p className="text-sm text-white/50 max-w-lg mx-auto leading-relaxed">
              API Error: {error || "Unknown Error"}. Please ensure your credentials are exact and the server is restarted.
            </p>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4 group">
            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest">Active Users (30d)</h4>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-black text-white">{gaData.users}</span>
            </div>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4 group">
            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest">Sessions (30d)</h4>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-black text-white">{gaData.sessions}</span>
            </div>
          </div>
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4 group">
            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest">Avg Engagement Rate</h4>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-black text-white">{(gaData.engagement * 100).toFixed(1)}%</span>
            </div>
          </div>
       </div>

       {/* Detailed Chart Placeholder */}
       <div className="p-8 bg-white/5 border border-white/10 rounded-3xl h-[300px] flex flex-col items-center justify-center space-y-2 relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-t from-accent-blue/5 to-transparent blur-3xl" />
           <LineChart className="w-16 h-16 text-white/10 mb-4" />
           <h3 className="text-white font-bold relative z-10">Live Telemetry Active</h3>
           <p className="text-xs text-white/40 max-w-md text-center relative z-10">Data successfully streaming from Google Analytics Data API v1beta via zero-dependency RS256 token exchange.</p>
       </div>
    </div>
  );
}
