import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log("🚀 Starting demo data seeding...")

  // 1. Ensure test user exists with ADMIN role and password
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: { 
      role: 'ADMIN',
      password: hashedPassword 
    },
    create: {
      email: 'test@example.com',
      name: 'LOrdEnRYQuE Admin',
      role: 'ADMIN',
      password: hashedPassword
    }
  })
  console.log(`✅ User verified: ${user.email} (${user.id})`)

  // 2. Create Multiple Agents
  const agentConfigs = [
    {
      name: 'LOrdEnRYQuE Luxury Concierge',
      description: 'Sophisticated VIP assistant for high-end clients.',
      personality: 'Refined, articulate, and proactive. Expert in design and AI.',
      status: 'ACTIVE'
    },
    {
      name: 'System Intelligence specialized',
      description: 'Technical support agent for the infrastructure.',
      personality: 'Precise, helpful, and technically proficient.',
      status: 'ACTIVE'
    },
    {
      name: 'Creative Strategist',
      description: 'Idea generation and brand strategy agent.',
      personality: 'Visionary, energetic, and highly creative.',
      status: 'DRAFT'
    }
  ]

  const agents = []
  for (const config of agentConfigs) {
    const agent = await prisma.agent.create({
      data: {
        ...config,
        userId: user.id,
        config: JSON.stringify({
          branding: { primaryColor: '#D4AF37', icon: 'bot', theme: 'dark' },
          knowledgeBase: ["System documentation v1.0", "Brand guidelines"]
        })
      }
    })
    agents.push(agent)
    console.log(`🤖 Agent created: ${agent.name}`)
  }

  // 3. Create Demo Conversations and Messages
  for (const agent of agents) {
    if (agent.status === 'ACTIVE') {
      const conv = await prisma.agentConversation.create({
        data: {
          agentId: agent.id,
          visitorId: 'visitor_' + Math.random().toString(36).substr(2, 9),
        }
      })
      
      await prisma.agentMessage.createMany({
        data: [
          { conversationId: conv.id, role: 'user', content: 'Hello, can you help me understand your design philosophy?' },
          { conversationId: conv.id, role: 'assistant', content: 'Certainly! Our design philosophy centers around high-premium aesthetics, liquid-smooth animations, and a focus on "Visual Excellence" that wows the user at first glance.' },
          { conversationId: conv.id, role: 'user', content: 'That sounds impressive. How do you implement AI?' },
          { conversationId: conv.id, role: 'assistant', content: 'We integrate cutting-edge models like Gemini 1.5 Pro to power our "LOrdEnRYQuE Forge" generator, allowing for natural language orchestration of entire components.' }
        ]
      })
      console.log(`💬 Conversation seeded for ${agent.name}`)
    }
  }

  // 4. Create Demo Projects and Stages (Client Portal)
  const project = await prisma.project.create({
    data: {
      title: 'Global Branding Ecosystem',
      description: 'Full-scale rebrand and AI integration for LOrdEnRYQuE.',
      status: 'ACTIVE',
      health: 'STABLE',
      efficiency: 98,
      userId: user.id,
      stages: {
        create: [
          { title: 'Discovery & Audit', status: 'COMPLETED', order: 1 },
          { title: 'Intelligence Framework Setup', status: 'IN_PROGRESS', order: 2 },
          { title: 'UI/UX Sculpting', status: 'UPCOMING', order: 3 },
          { title: 'Final Deployment', status: 'UPCOMING', order: 4 }
        ]
      },
      documents: {
        create: [
          { title: 'Brand Guidelines 2026', type: 'PDF', url: '/docs/brand_v2.pdf', size: '2.4 MB' },
          { title: 'Project Roadmap', type: 'DOCX', url: '/docs/roadmap.docx', size: '1.1 MB' }
        ]
      }
    }
  })
  console.log(`📁 Project seeded: ${project.title}`)

  console.log("✨ Seeding complete! The database is now ready for exploration.")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
