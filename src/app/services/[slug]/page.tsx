import { fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { constructMetadata } from "@/lib/seo";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const services = await fetchQuery(api.services.listPublished);
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await fetchQuery(api.services.getBySlug, { slug });

  if (!service || !service.published) return {};

  return constructMetadata({
    title: service.seoTitle || `${service.title} | LOrdEnRYQuE Services`,
    description: service.metaDescription || service.intro,
    image: service.ogImage || service.coverImage || "/og-image.png",
    canonical: service.canonicalUrl || `/services/${slug}`,
    noIndex: service.isIndexed === false
  });
}

interface ServiceSlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServiceSlugPage({ params }: ServiceSlugPageProps) {
  const { slug } = await params;

  const service = await fetchQuery(api.services.getBySlug, { slug });

  if (!service || !service.published) {
    notFound();
  }

  const faqItems = JSON.parse(service.faqItems || "[]") as { question: string, answer: string }[];

  return (
    <article className="relative min-h-screen pb-24">
      {/* Page Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[50%] h-[50%] bg-accent-blue/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] right-[5%] w-[40%] h-[40%] bg-accent-purple/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20">
        {/* Back Link */}
        <Link 
          href="/services" 
          className="inline-flex items-center gap-2 text-sm font-bold text-foreground/50 hover:text-accent-blue transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Services
        </Link>

        {/* Content Header */}
        <header className="space-y-6 mb-16 max-w-3xl">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="text-xs font-black tracking-[0.3em] uppercase text-accent-silver">
              Service Specialization
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1] uppercase">
            {service.h1 || service.title}
          </h1>

          {service.intro && (
            <p className="text-xl md:text-2xl text-foreground/70 font-light leading-relaxed border-l-2 border-accent-blue pl-6 italic">
              {service.intro}
            </p>
          )}
        </header>

        {/* Multi-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Markdown Content */}
          <div className="lg:col-span-2 prose prose-invert prose-slate max-w-none">
            <div className="p-8 md:p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
              <ReactMarkdown
                components={{
                  h2: ({ ...props }) => <h2 className="text-3xl font-bold mt-12 mb-6 text-foreground uppercase tracking-tight" {...props} />,
                  h3: ({ ...props }) => <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground uppercase tracking-tight" {...props} />,
                  p: ({ ...props }) => <p className="text-lg text-foreground/80 leading-relaxed mb-6 font-light" {...props} />,
                  ul: ({ ...props }) => <ul className="list-disc list-inside space-y-3 mb-8 text-foreground/80" {...props} />,
                  ol: ({ ...props }) => <ol className="list-decimal list-inside space-y-3 mb-8 text-foreground/80" {...props} />,
                  li: ({ ...props }) => <li className="text-lg font-light" {...props} />,
                }}
              >
                {service.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Sidebar / Sticky Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="sticky top-32 p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
              <h3 className="text-xl font-bold text-foreground mb-4 uppercase tracking-tighter">
                Ready to transform your business?
              </h3>
              <p className="text-sm text-foreground/60 mb-8 leading-relaxed">
                Take the first step toward a high-performance digital presence. Contact me to discuss your specific requirements.
              </p>
              
              <Link 
                href="/contact"
                className="block w-full text-center px-8 py-4 rounded-xl border border-white/10 bg-accent-blue hover:bg-accent-blue/90 text-black font-bold transition-all"
              >
                Start a Conversation
              </Link>
            </div>

            {faqItems && faqItems.length > 0 && (
              <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
                <h4 className="text-lg font-bold text-foreground mb-6 uppercase tracking-tight">Frequently Asked Questions</h4>
                <div className="space-y-6">
                  {faqItems.map((faq, i) => (
                    <div key={i} className="space-y-2">
                       <p className="font-bold text-foreground/90 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-accent-blue mt-1 shrink-0" />
                          {faq.question}
                       </p>
                       <p className="text-sm text-foreground/60 pl-6">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {service.schemaType && (
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": service.schemaType,
              "name": service.title,
              "description": service.metaDescription || service.intro,
              "provider": {
                "@type": "Person",
                "name": "Attila Lazar",
                "url": "https://lordenryque.com"
              }
            })
          }}
        />
      )}
    </article>
  );
}
