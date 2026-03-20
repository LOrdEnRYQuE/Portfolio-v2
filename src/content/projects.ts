export type Project = {
  slug: string;
  title: string;
  status: "Live" | "MVP" | "In Progress" | "Concept";
  summary: string;
  description: string;
  challenge?: string;
  solution?: string;
  brief?: string;
  stack: string[];
  cover: string;
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "ai-native-ide-platform",
    title: "AI-Powered Development Platform",
    status: "MVP",
    summary:
      "A desktop-first development environment putting AI at the core of the coding experience to build software faster.",
    brief: "The current state of AI-assisted development is dominated by simple chat interfaces within existing IDEs. This project reimagines the developer experience by integrating AI into the heart of the editor, allowing it to reason about the entire workspace and provide real engineering leverage.",
    challenge: "Traditional editors are built for text manipulation. The challenge was building a high-performance desktop application that can manage large-scale code context, real-time AI assistance, and a seamless interface for development.",
    solution: "We built an Electron-based environment from the ground up, featuring a specialized context-management engine. This allows the IDE to act as a senior-level partner that can plan, implement, and verify entire features based on high-level product goals.",
    description:
      "This project explores a premium AI-first development experience that combines assisted coding, structured workflows, and product-oriented tooling. The goal is to move beyond basic chat-inside-an-editor patterns and create a more capable environment for building real applications with better architecture.",
    stack: ["Electron", "React", "TypeScript", "Node.js", "AI Workflows", "Modern Tech"],
    cover: "/images/projects/ai-native-ide-platform.jpg",
    featured: true,
  },
  {
    slug: "autonomous-developer-agents",
    title: "AI Engineering Workflows",
    status: "In Progress",
    summary:
      "A system of specialized AI tools designed to support the planning, building, and reviewing of software projects.",
    brief: "Building complex software often involves coordination overhead that slows down progress. This project aims to delegate engineering tasks to specialized AI tools that can operate within defined boundaries to speed up development.",
    challenge: "The primary challenge is ensuring reliability and preventing errors. We needed to implement rigorous validation steps and a structured planning-first approach for every automated task.",
    solution: "We developed a multi-stage workflow where a specialized tool creates a task breakdown, another writes the code, and a third verifies it against the original plan and quality standards.",
    description:
      "This project focuses on coordinating specialized AI tools for software development workflows, including planning, implementation, validation, and iteration. It is designed around the idea that AI should provide real engineering leverage.",
    stack: ["TypeScript", "Next.js", "AI Integration", "Automation", "Workflows"],
    cover: "/images/projects/autonomous-developer-agents.jpg",
    featured: true,
  },
  {
    slug: "lordenryque-portfolio",
    title: "LOrdEnRYQuE Portfolio",
    status: "Live",
    summary:
      "A premium personal developer portfolio built to present services, projects, and product direction with clarity and strong visual identity.",
    brief: "A developer's portfolio is more than a list of projects; it's a product in itself. The design needed to reflect a commitment to high-fidelity aesthetics and clear communication of value.",
    challenge: "The challenge was creating a design that felt premium and futuristic (Refined Ethereal Glass) while maintaining excellent performance and high discoverability (GEO).",
    solution: "We implemented a custom design system with Glassmorphism, liquid motion effects, and specialized GEO metadata, ensuring the site performs as well as it looks.",
    description:
      "This portfolio serves as the digital home of the LOrdEnRYQuE brand. It is built to showcase selected work, communicate technical and product capabilities, and provide a clean conversion path for clients, collaborators, and business inquiries.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GEO"],
    cover: "/images/projects/lordenryque-portfolio.jpg",
    featured: true,
    liveUrl: "https://lordenryque.com",
  },
];
