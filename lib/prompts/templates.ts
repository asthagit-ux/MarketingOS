import { BriefInput, ToneLevel, PersonaType } from "@/types";
import { TONE_LABELS } from "@/lib/utils/constants";

// System role per persona
export function getSystemPrompt(persona: PersonaType): string {
  const roles: Record<PersonaType, string> = {
    solo_founder: `You are a conversion copywriter for early-stage startups. 
You write punchy, direct copy that gets to the point fast. 
No corporate speak. No fluff. Every word earns its place.
Always output valid JSON matching the schema provided.`,

    growth_manager: `You are a growth marketing specialist who writes structured, 
data-informed copy for scaling teams. You produce multiple variants for A/B testing 
and always tie copy to audience segments and funnel stages.
Always output valid JSON matching the schema provided.`,

    agency_strategist: `You are a senior strategist at a top marketing agency. 
You write client-ready copy backed by strategic rationale. 
Your output includes not just the copy but why it works — 
the framework, the insight, the audience psychology behind every choice.
Always output valid JSON matching the schema provided.`,
  };
  return roles[persona];
}

// Main generation prompt
export function buildGenerationPrompt(brief: BriefInput, tone: ToneLevel): string {
  const toneLabel = TONE_LABELS[tone];

  const baseContext = `
BRAND: ${brief.brandName}
BRAND VOICE: ${brief.brandVoice}
PRODUCT/SERVICE: ${brief.product}
TARGET AUDIENCE: ${brief.targetAudience}
GOAL: ${brief.goal}
TONE: ${toneLabel}
OUTPUT FORMAT: ${brief.outputFormat ?? "ad_copy"}
${brief.campaignType ? `CAMPAIGN TYPE: ${brief.campaignType}` : ""}
${brief.clientName ? `CLIENT: ${brief.clientName}` : ""}
`.trim();

  const outputSchema =
    brief.persona === "growth_manager"
      ? `{
  "hook": "attention-grabbing opening line",
  "body": "main copy body",
  "cta": "call to action",
  "rationale": "brief strategic reasoning",
  "variants": [
    { "label": "Version A — [angle]", "hook": "...", "body": "...", "cta": "..." },
    { "label": "Version B — [angle]", "hook": "...", "body": "...", "cta": "..." }
  ]
}`
      : `{
  "hook": "attention-grabbing opening line",
  "body": "main copy body",
  "cta": "call to action",
  "rationale": "strategic reasoning — why this works for the audience"
}`;

  return `
Generate marketing copy for the following brief. Apply the AIDA framework 
(Attention, Interest, Desire, Action) and Jobs-to-Be-Done principles.

BRIEF:
${baseContext}

Respond ONLY with a valid JSON object matching this exact schema — no markdown, no preamble:
${outputSchema}
`.trim();
}

// Refinement prompt
export function buildRefinePrompt(
  originalJson: string,
  instruction: string,
  tone: ToneLevel,
  lengthPreference: string
): string {
  return `
You are refining existing marketing copy. Here is the current version:

${originalJson}

REFINEMENT INSTRUCTIONS:
- Tone adjustment: ${TONE_LABELS[tone]}
- Length: make it ${lengthPreference}
- Additional instruction: ${instruction || "none"}

Apply the changes and return the updated copy as a valid JSON object 
with the same schema as the input. No markdown, no preamble.
`.trim();
}
