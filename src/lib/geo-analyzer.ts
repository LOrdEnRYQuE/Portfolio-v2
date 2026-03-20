export interface AnalyzerResult {
  score: number;
  checks: {
    id: string;
    label: string;
    passed: boolean;
    message: string;
    type: "seo" | "geo";
  }[];
}

export function analyzeContent(
  text: string, 
  title: string = "", 
  metaDesc: string = "",
  keyword: string = ""
): { seo: AnalyzerResult; geo: AnalyzerResult; combinedScore: number } {
  
  const seoChecks = [];
  const geoChecks = [];
  
  // ---------------------------------------------------------
  // 1. Traditional SEO Checks
  // ---------------------------------------------------------
  
  // Title Length
  const titleLen = title.length;
  seoChecks.push({
    id: "seo-title-length",
    label: "Title Length (50-60 chars)",
    passed: titleLen >= 40 && titleLen <= 65,
    message: titleLen === 0 
      ? "Missing Title" 
      : titleLen < 40 
        ? `Title is too short (${titleLen} chars).` 
        : titleLen > 65 
          ? `Title is too long (${titleLen} chars).` 
          : `Optimal length (${titleLen} chars).`,
    type: "seo"
  });

  // Meta Description Length
  const metaLen = metaDesc.length;
  seoChecks.push({
    id: "seo-meta-length",
    label: "Meta Description Length (150-160 chars)",
    passed: metaLen >= 120 && metaLen <= 160,
    message: metaLen === 0 
      ? "Missing Meta Description" 
      : metaLen < 120 
        ? `Meta description is too short (${metaLen} chars).` 
        : metaLen > 160 
          ? `Meta description is too long (${metaLen} chars).` 
          : `Optimal length (${metaLen} chars).`,
    type: "seo"
  });

  // Primary Keyword Presence
  const sanitizedText = text.toLowerCase();
  if (keyword) {
    const kw = keyword.toLowerCase();
    const kwCount = (sanitizedText.match(new RegExp(kw, "g")) || []).length;
    seoChecks.push({
      id: "seo-keyword-density",
      label: `Keyword Presence ("${keyword}")`,
      passed: kwCount > 0,
      message: kwCount > 0 
        ? `Keyword found ${kwCount} time(s) in content.` 
        : "Keyword missing from main content.",
      type: "seo"
    });
  } else {
    seoChecks.push({
      id: "seo-keyword-density",
      label: `Keyword Presence`,
      passed: false,
      message: "No focus keyword provided for analysis.",
      type: "seo"
    });
  }

  // Word Count
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  seoChecks.push({
    id: "seo-word-count",
    label: "Comprehensive Word Count (>300 words)",
    passed: wordCount >= 300,
    message: wordCount >= 300 
      ? `Good length (${wordCount} words).` 
      : `Thin content (${wordCount} words). Expand for better indexing.`,
    type: "seo"
  });

  // ---------------------------------------------------------
  // 2. GEO (Generative Engine Optimization) Checks
  // For AI Search Engines like ChatGPT, Perplexity, Claude
  // ---------------------------------------------------------

  // 1. Original Statistics & Data
  // Checks for numbers followed by %, $, multipliers, or large numerals
  const statRegex = /\b\d+(?:\.\d+)?(?:%|x|k|m|b)\b|\$\d+/gi;
  const statsFound = (text.match(statRegex) || []).length;
  geoChecks.push({
    id: "geo-statistics",
    label: "Original Data & Statistics",
    passed: statsFound >= 2,
    message: statsFound >= 2 
      ? `Found ${statsFound} concrete statistical markers. Great for citations.` 
      : "Lack of concrete data. AI engines prefer citing measurable statistics.",
    type: "geo"
  });

  // 2. Expert Quotes / Authority
  // Looks for quotes using " ", “ ”, or blockquotes
  const quoteRegex = /"[^"]{20,}"|“[^”]{20,}”|<blockquote>/g;
  const quotesFound = (text.match(quoteRegex) || []).length;
  geoChecks.push({
    id: "geo-quotes",
    label: "Expert Quotes & Citations",
    passed: quotesFound >= 1,
    message: quotesFound >= 1 
      ? "Contains quotes/citations, boosting RAG authority signals." 
      : "No expert quotes detected. AI prioritizes cited expertise.",
    type: "geo"
  });

  // 3. Question-based / FAQ formatting
  // Looks for question marks near the end of short lines (e.g. headings)
  const questionRegex = /^.{10,80}\?$/gm;
  const questionsFound = (text.match(questionRegex) || []).length;
  // Fallback to "FAQ" or "Frequently Asked Questions" string match
  const hasFAQ = sanitizedText.includes("faq") || sanitizedText.includes("frequently asked questions");
  
  geoChecks.push({
    id: "geo-faq",
    label: "FAQ / Question-based Structure",
    passed: questionsFound >= 2 || hasFAQ,
    message: (questionsFound >= 2 || hasFAQ)
      ? "FAQ structure detected. Crucial for direct AI answer extraction."
      : "No explicit Q&A structure found. Consider adding an FAQ section.",
    type: "geo"
  });

  // 4. Structured Lists (Bullet Points or Numbered)
  const listRegex = /^(\s*[-*]\s+|\s*\d+\.\s+)/gm;
  const listItemsFound = (text.match(listRegex) || []).length;
  geoChecks.push({
    id: "geo-lists",
    label: "Structured Data Representation",
    passed: listItemsFound >= 3,
    message: listItemsFound >= 3 
      ? `Found ${listItemsFound} list items. Excellent for LLM summarization.` 
      : "Content is too dense. AI models extract structured lists much easier.",
    type: "geo"
  });

  // Calculate Scores
  const seoPassed = seoChecks.filter(c => c.passed).length;
  const seoScore = Math.round((seoPassed / seoChecks.length) * 100);

  const geoPassed = geoChecks.filter(c => c.passed).length;
  const geoScore = Math.round((geoPassed / geoChecks.length) * 100);

  const combinedScore = Math.round((seoScore + geoScore) / 2);

  return {
    seo: { score: seoScore, checks: seoChecks as any },
    geo: { score: geoScore, checks: geoChecks as any },
    combinedScore
  };
}
