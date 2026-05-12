import { PersonaConfig } from "@/types";

export const PERSONAS: PersonaConfig[] = [
  {
    id: "solo_founder",
    label: "Solo Founder",
    description: "Fast, punchy copy with a direct CTA. Minimal setup, max output speed.",
    icon: "🚀",
    defaultTone: 2,
  },
  {
    id: "growth_manager",
    label: "Growth Manager",
    description: "Structured briefs, audience segmentation, and multi-variant output.",
    icon: "📈",
    defaultTone: 3,
  },
  {
    id: "agency_strategist",
    label: "Agency Strategist",
    description: "Client-ready formatting, brand-voice consistency, and rationale docs.",
    icon: "🎯",
    defaultTone: 4,
  },
];

export const TONE_LABELS: Record<number, string> = {
  1: "Very Casual",
  2: "Casual",
  3: "Balanced",
  4: "Professional",
  5: "Formal",
};

export const OUTPUT_FORMATS = [
  { value: "ad_copy", label: "Ad Copy" },
  { value: "email", label: "Email" },
  { value: "linkedin_post", label: "LinkedIn Post" },
  { value: "campaign_brief", label: "Campaign Brief" },
  { value: "landing_page_hero", label: "Landing Page Hero" },
] as const;
