import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { convex } from "@/lib/convex";
import { api } from "@convex/_generated/api";


// Default section configs per core page slug
const CORE_PAGE_DEFAULTS: Record<string, { title: string; description: string; sections: object[] }> = {
  home: {
    title: "Home",
    description: "Main landing page",
    sections: [
      {
        id: "hero",
        type: "Hero",
        label: "Hero Section",
        fields: {
          badge: "New Generation AI Engineer",
          title: "AI-Driven Web Experiences",
          subtitle: "& Conversion-Focused Development",
          description: "Professional developer creating custom websites, mobile apps, and business software for modern businesses.",
          primaryCta: "Start a Project",
          secondaryCta: "View Projects",
        },
      },
      {
        id: "services",
        type: "Services",
        label: "Services Section",
        fields: {
          title: "What I Build",
          subtitle: "Full-stack solutions, powered by AI",
        },
      },
      {
        id: "projects",
        type: "FeaturedProjects",
        label: "Featured Projects",
        fields: {
          title: "Recent Work",
          subtitle: "Some of the projects I've shipped",
        },
      },
      {
        id: "cta",
        type: "ContactCta",
        label: "Contact CTA",
        fields: {
          title: "Ready to build something?",
          subtitle: "Let's talk about your project and bring your vision to life.",
          buttonText: "Start a Conversation",
        },
      },
    ],
  },
  about: {
    title: "About",
    description: "Biography and professional background",
    sections: [
      {
        id: "profile",
        type: "About",
        label: "Profile & Bio",
        fields: {
          name: "Attila Lazar",
          role: "AI Engineer · Full-Stack Developer · Product Builder",
          bio: "Professional developer creating custom websites, mobile apps, and business software for small businesses.",
          location: "Germany, Bayern – Landshut",
          availability: "Available for freelance projects, MVP builds, AI integrations.",
          resumeUrl: "/docs/Attila_Lazar_Resume_Portfolio.pdf",
        },
      },
      {
        id: "timeline",
        type: "ExperienceTimeline",
        label: "Experience Timeline",
        fields: {
          headline: "Engineering Progression",
          subheadline: "From IT foundations to AI-native platforms",
        },
      },
      {
        id: "principles",
        type: "Principles",
        label: "Core Principles",
        fields: {
          headline: "Engineered for Excellence",
          subtitle: "Beyond just code — digital assets that define the competitive edge.",
          items: [
            { title: "Conversion Focused", desc: "Every pixel optimized to turn visitors into loyal customers." },
            { title: "Data Integrity", desc: "Robust architecture ensuring secure, compliant, always-available data." },
            { title: "Scaling Ready", desc: "Built with the future in mind — grows as fast as your business." },
            { title: "Human Centric", desc: "Complex technology translated into simple, intuitive experiences." },
          ],
        },
      },
    ],
  },
  contact: {
    title: "Contact",
    description: "Contact form and communication details",
    sections: [
      {
        id: "hero",
        type: "ContactHero",
        label: "Page Header",
        fields: {
          badge: "Open for Projects",
          title: "Let's Build Something",
          subtitle: "Tell me about your project and I'll get back within 24 hours.",
        },
      },
      {
        id: "details",
        type: "ContactDetails",
        label: "Contact Details",
        fields: {
          email: "hello@lordenryque.com",
          phone: "+491722620671",
          location: "Germany, Bayern – Landshut, Nahensteing 188E",
          whatsapp: "+491722620671",
          responseTime: "Within 24 hours",
        },
      },
    ],
  },
  services: {
    title: "Services",
    description: "Service offerings and pricing",
    sections: [
      {
        id: "hero",
        type: "ServicesHero",
        label: "Page Header",
        fields: {
          badge: "What I Offer",
          title: "Services & Solutions",
          subtitle: "Full-range digital engineering for modern businesses.",
        },
      },
    ],
  },
  faq: {
    title: "FAQ",
    description: "Frequently asked questions",
    sections: [
      {
        id: "hero",
        type: "FaqHero",
        label: "Page Header",
        fields: {
          title: "Frequently Asked Questions",
          subtitle: "Everything you need to know before we start working together.",
        },
      },
    ],
  },
};

// GET /api/admin/pages/core?slug=home
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  const defaults = CORE_PAGE_DEFAULTS[slug];
  if (!defaults) {
    return NextResponse.json({ error: "Unknown core page" }, { status: 404 });
  }

  try {
    let page = await convex.query(api.pages.getBySlug, { slug });

    if (!page) {
      const pageId = await convex.mutation(api.pages.create, {
        slug,
        title: defaults.title,
        description: defaults.description,
        content: JSON.stringify(defaults.sections),
        published: true,
        inNavbar: ["home", "about", "contact", "services"].includes(slug),
        order: Object.keys(CORE_PAGE_DEFAULTS).indexOf(slug),
      });
      page = await convex.query(api.pages.getBySlug, { slug });
    }

    // Return page with parsed sections
    let sections = defaults.sections;
    if (page?.content) {
      try {
        const parsed = JSON.parse(page.content);
        if (Array.isArray(parsed)) sections = parsed;
      } catch {
        // Use defaults
      }
    }

    return NextResponse.json({ ...page, sections });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch core page" }, { status: 500 });
  }
}

// PUT /api/admin/pages/core  { slug, sections }
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { slug, sections, title, description } = body;

    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

    const pageId = await convex.mutation(api.pages.upsertBySlug, {
      slug,
      title: title || slug,
      description: description || "",
      content: JSON.stringify(sections),
      published: true,
      inNavbar: false,
      order: 0,
    });

    return NextResponse.json({ success: true, pageId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save core page" }, { status: 500 });
  }
}
