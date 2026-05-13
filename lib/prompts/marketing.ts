import type { PersonaId, BriefFormData, RefinementSettings } from "@/types";
import { AUDIENCE_LABELS, OUTPUT_FORMAT_LABELS, TONE_LABELS } from "@/lib/utils/persona";

const personaSystem: Record<PersonaId, string> = {
  "solo-founder": `You are a conversion copywriter for early-stage startups.
Write punchy, direct copy. No corporate speak. No fluff.
Apply AIDA and Jobs-to-Be-Done thinking, but keep the voice human and founder-like.`,
  "growth-manager": `You are a growth marketing specialist.
Produce structured, testable copy tied to funnel stages and audience segments.
When variants are requested, include distinct angles for A/B hypotheses.`,
  "agency-strategist": `You are a senior agency strategist.
Deliver client-ready copy with clear strategic rationale (frameworks, audience psychology).
Use AIDA and JTBD explicitly where they strengthen the work.`,
};

export function getSystemPrompt(personaId: PersonaId): string {
  const base = `You are MarketingOS, an AI copilot for growth teams.
${personaSystem[personaId]}

Rules:
- Return ONLY a single JSON object — no markdown fences, no preamble, no trailing commentary.
- Never use placeholder tokens like [INSERT NAME]; make reasonable assumptions.
- All string fields must be non-empty prose suitable for the requested deliverable.`;
  return base;
}

function formatBlockInstructions(outputFormat: BriefFormData["outputFormat"]): string {
  const label = OUTPUT_FORMAT_LABELS[outputFormat];
  const blocks: Record<BriefFormData["outputFormat"], string> = {
    "ad-copy": `Deliverable: ${label}. Structure the "body" as 1–3 tight paragraphs or bullets suitable for paid/organic ads.`,
    "email-sequence": `Deliverable: ${label}. Structure the "body" as a short sequence (email 1, email 2, email 3) with clear subject-line energy in the hook.`,
    "social-posts": `Deliverable: ${label}. Structure the "body" as 2–4 distinct posts separated by blank lines, platform-agnostic but punchy.`,
    "landing-page": `Deliverable: ${label}. Structure the "body" as hero + supporting sections (value props, proof, FAQ teaser) in flowing copy.`,
    "campaign-brief": `Deliverable: ${label}. Structure the "body" with sections: Objective, Audience insight, Messaging pillars, Channel notes, KPI suggestions.`,
  };
  return blocks[outputFormat];
}

export function buildGenerationUserPrompt(
  brief: BriefFormData,
  refinement: RefinementSettings,
  options: { includeVariants: boolean; variantNote?: string }
): string {
  const audience = AUDIENCE_LABELS[brief.audience];
  const tone = TONE_LABELS[refinement.tone];
  const length =
    refinement.length === "short"
      ? "Keep total output concise (roughly 120–220 words across hook+body+cta)."
      : refinement.length === "medium"
        ? "Moderate length (roughly 220–400 words)."
        : "Allow fuller development (roughly 400–700 words) while staying scannable.";

  const variantSchema = `Optional "variants" array: 2 objects, each { "label", "hook", "body", "cta" } with meaningfully different angles.`;

  const schema = options.includeVariants
    ? `{
  "hook": "string",
  "body": "string",
  "cta": "string",
  "rationale": "string — why this works for the audience",
  ${variantSchema}
}`
    : `{
  "hook": "string",
  "body": "string",
  "cta": "string",
  "rationale": "string — why this works for the audience"
}`;

  const variantSection = options.variantNote
    ? `\n\nVARIANT REQUEST:\n${options.variantNote}\n\nProduce a meaningfully different approach from any prior draft.`
    : "";

  return `
Generate ${OUTPUT_FORMAT_LABELS[brief.outputFormat]}.

PRODUCT / SERVICE:
${brief.product}

GOAL:
${brief.goal}

TARGET AUDIENCE (segment):
${audience}

TONE:
${tone}

LENGTH:
${length}

${formatBlockInstructions(brief.outputFormat)}

${brief.additionalContext ? `ADDITIONAL CONTEXT:\n${brief.additionalContext}\n` : ""}
${variantSection}

Respond with ONLY valid JSON matching this schema (no markdown):
${schema}
`.trim();
}

export function buildRefinePrompt(
  currentJson: string,
  refinement: RefinementSettings,
  customInstruction: string
): string {
  const tone = TONE_LABELS[refinement.tone];
  const audience = AUDIENCE_LABELS[refinement.audience];
  const length =
    refinement.length === "short"
      ? "shorter and tighter"
      : refinement.length === "medium"
        ? "balanced length"
        : "longer with more supporting detail";

  return `
You are refining marketing copy. Current JSON:

${currentJson}

ADJUSTMENTS:
- Tone: ${tone}
- Audience emphasis: align copy to "${audience}"
- Length: make it ${length}
- Extra instruction: ${customInstruction.trim() || "none"}

Return ONLY updated JSON with the SAME keys and shape as the input (including "variants" if present). No markdown.
`.trim();
}
