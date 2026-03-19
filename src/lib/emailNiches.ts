export interface EmailTemplate {
  id: string;
  niche: string;
  name: string;
  subject: string;
  body: string;
}

export const EMAIL_NICHES: EmailTemplate[] = [
  {
    id: "real-estate-viewing",
    niche: "Real Estate",
    name: "Viewing Confirmation",
    subject: "Confirmed: Property Viewing for {{PROPERTY_NAME}}",
    body: `
      <div style="font-family: sans-serif; max-width: 600px; color: #333;">
        <h2 style="color: #2563eb;">Viewing Confirmation</h2>
        <p>Hi {{CLIENT_NAME}},</p>
        <p>This email confirms your viewing for <strong>{{PROPERTY_NAME}}</strong>.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Date:</strong> {{DATE}}</p>
          <p style="margin: 5px 0 0;"><strong>Time:</strong> {{TIME}}</p>
        </div>
        <p>If you need to reschedule, please let us know at least 24 hours in advance.</p>
        <p>Best regards,<br>{{ADMIN_NAME}}</p>
      </div>
    `
  },
  {
    id: "ecommerce-promo",
    niche: "E-commerce",
    name: "Promotional Discount",
    subject: "Special Offer: 20% Off Your Next Purchase!",
    body: `
      <div style="font-family: sans-serif; max-width: 600px; text-align: center;">
        <h1 style="color: #db2777;">A Special Gift for You!</h1>
        <p style="font-size: 16px;">We noticed you've been eye-ing our summer collection. Here's a little something to help you decide.</p>
        <div style="background: #fdf2f8; border: 2px dashed #db2777; padding: 30px; margin: 30px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #db2777;">SUMMER20</span>
          <p style="margin-top: 10px; font-size: 14px;">Use this code at checkout for 20% off.</p>
        </div>
        <a href="{{STORE_URL}}" style="background: #db2777; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Shop Now</a>
      </div>
    `
  },
  {
    id: "saas-onboarding",
    niche: "SaaS",
    name: "Welcome & Onboarding",
    subject: "Welcome to {{PLATFORM_NAME}} - Let's get started!",
    body: `
      <div style="font-family: sans-serif; max-width: 600px; color: #444;">
        <h2 style="color: #6366f1;">Welcome aboard, {{CLIENT_NAME}}!</h2>
        <p>We're thrilled to have you with us. To help you get the most out of {{PLATFORM_NAME}}, we've prepared a quick setup guide.</p>
        <ol>
          <li><strong>Complete your profile</strong> - Tell us about your goals.</li>
          <li><strong>Connect your tools</strong> - Integrate with the apps you already use.</li>
          <li><strong>Invite your team</strong> - Collaboration is better together.</li>
        </ol>
        <div style="margin-top: 30px;">
          <a href="{{DASHBOARD_URL}}" style="background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Go to Dashboard</a>
        </div>
      </div>
    `
  },
  {
    id: "agency-proposal",
    niche: "Creative Agency",
    name: "Project Proposal",
    subject: "Project Proposal: {{PROJECT_NAME}}",
    body: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2 style="border-bottom: 2px solid #000; padding-bottom: 10px;">Project Proposal</h2>
        <p>Hi {{CLIENT_NAME}},</p>
        <p>It was great discussing <strong>{{PROJECT_NAME}}</strong> with you. Based on our conversation, we've drafted a proposal that outlines our vision and strategy.</p>
        <p>You can review and approve the proposal using the link below:</p>
        <div style="margin: 30px 0;">
          <a href="{{PROPOSAL_URL}}" style="background: #000; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold;">Review Proposal</a>
        </div>
        <p>We're excited about the possibility of working together!</p>
      </div>
    `
  },
  {
    id: "personal-brand-newsletter",
    niche: "Personal Branding",
    name: "Weekly Insights",
    subject: "Weekly Insights: {{TOPIC}}",
    body: `
      <div style="font-family: Georgia, serif; max-width: 550px; line-height: 1.6;">
        <h1 style="font-style: italic; color: #1a1a1a;">The Weekly Muse</h1>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p>Hi friends,</p>
        <p>This week I've been thinking a lot about {{TOPIC}}. In a world full of noise, how do we find the signal?</p>
        <blockquote style="border-left: 4px solid #ddd; padding-left: 20px; font-style: italic; color: #666;">
          "Your personal brand is what people say about you when you're not in the room."
        </blockquote>
        <p>I'd love to hear your thoughts on this. Just hit reply!</p>
        <p>Stay curious,<br>{{ADMIN_NAME}}</p>
      </div>
    `
  }
];
