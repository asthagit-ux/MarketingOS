import { Persona } from "@/types";

export const PERSONAS: Persona[] = [
  {
    id: "solo-founder",
    name: "Solo Founder",
    tagline: "Move fast. Sound like a brand.",
    description:
      "You're wearing every hat. MarketingOS gives you instant, punchy copy that sounds like you hired an agency — without the invoice.",
    icon: "⚡",
    inputHints: [
      "What does your product do in one sentence?",
      "Who's your #1 target customer?",
      "What's the main pain point you solve?",
    ],
    outputFormats: ["ad-copy", "social-posts", "email-sequence", "landing-page"],
    toneDefault: "balanced",
  },
  {
    id: "growth-manager",
    name: "Growth Manager",
    tagline: "Test more. Ship faster. Win bigger.",
    description:
      "You need variants, not just copy. Generate 5 ad angles in 30 seconds, A/B test hypotheses, and brief your team with structured campaign docs.",
    icon: "📈",
    inputHints: [
      "What's the campaign objective?",
      "What channel are you optimizing for?",
      "What's the conversion event?",
    ],
    outputFormats: ["ad-copy", "campaign-brief", "social-posts", "landing-page"],
    toneDefault: "professional",
  },
  {
    id: "agency-strategist",
    name: "Agency Strategist",
    tagline: "Client-ready decks. Zero blank pages.",
    description:
      "Impress clients with structured, insight-backed copy. AIDA framework, JTBD-driven messaging, and audience rationale baked into every output.",
    icon: "🎯",
    inputHints: [
      "Who is the client and what's their category?",
      "What's the strategic goal this quarter?",
      "Who are the 2-3 audience segments?",
    ],
    outputFormats: ["campaign-brief", "email-sequence", "landing-page", "ad-copy"],
    toneDefault: "authoritative",
  },
];

export const OUTPUT_FORMAT_LABELS: Record<string, string> = {
  "ad-copy": "Ad Copy",
  "email-sequence": "Email Sequence",
  "social-posts": "Social Posts",
  "landing-page": "Landing Page",
  "campaign-brief": "Campaign Brief",
};

export const AUDIENCE_LABELS: Record<string, string> = {
  "b2b-smb": "B2B · SMB",
  "b2b-enterprise": "B2B · Enterprise",
  "b2c-general": "B2C · General",
  "b2c-premium": "B2C · Premium",
  technical: "Technical Audience",
  "non-technical": "Non-Technical",
};

export const TONE_LABELS: Record<string, string> = {
  casual: "Casual",
  balanced: "Balanced",
  professional: "Professional",
  authoritative: "Authoritative",
};