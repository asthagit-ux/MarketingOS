import { BriefFormData, Persona, RefinementSettings, Draft, OutputFormat } from "@/types";
import { OUTPUT_FORMAT_LABELS, TONE_LABELS, AUDIENCE_LABELS } from "@/lib/personas";

function buildSystemPrompt(persona: Persona): string {
  const personaInstructions: Record<string, string> = {
    "solo-founder":
      "You are writing for a solo founder who needs punchy, direct marketing copy. Be concise, energetic, and human. Avoid jargon. Sound like a smart founder talking to their customer, not a corporate marketer.",
    "growth-manager":
      "You are writing for a growth manager who needs structured, testable marketing content. Include multiple angles or variants where possible. Think in terms of conversion, channel fit, and A/B hypotheses. Be data-informed in framing.",
    "agency-strategist":
      "You are writing for an agency strategist creating client-ready materials. Use AIDA or JTBD frameworks where applicable. Include audience rationale. Be structured, strategic, and professional. The output should feel like it comes from a senior creative strategist.",
  };

  return `You are MarketingOS, an AI copilot for growth teams.
${personaInstructions[persona.id]}

Always:
- Deliver immediately usable marketing copy, not meta-commentary
- Structure output clearly with headers when appropriate
- Include an "Audience Rationale" section at the end explaining why this approach works for the target segment
- Never output placeholder text like [INSERT NAME] — make reasonable assumptions`;
}

function buildUserPrompt(
  brief: BriefFormData,
  refinement: RefinementSettings
): string {
  return `Generate ${OUTPUT_FORMAT_LABELS[brief.outputFormat]} for the following:

**Product/Service**: ${brief.product}
**Goal**: ${brief.goal}
**Target Audience**: ${AUDIENCE_LABELS[brief.audience]}
**Tone**: ${TONE_LABELS[refinement.tone]}
**Length**: ${refinement.length}
${brief.additionalContext ? `**Additional Context**: ${brief.additionalContext}` : ""}

Deliver the complete ${OUTPUT_FORMAT_LABELS[brief.outputFormat]} now. Use markdown formatting.`;
}

export async function generateDraft(
  persona: Persona,
  brief: BriefFormData,
  refinement: RefinementSettings
): Promise<string> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemPrompt: buildSystemPrompt(persona),
      userPrompt: buildUserPrompt(brief, refinement),
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Generation failed");
  }

  const data = await response.json();
  return data.content;
}

export async function regenerateVariant(
  original: string,
  persona: Persona,
  brief: BriefFormData,
  refinement: RefinementSettings
): Promise<string> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemPrompt: buildSystemPrompt(persona),
      userPrompt: `${buildUserPrompt(brief, refinement)}

Here is the previous draft — generate a meaningfully different variant with a fresh angle:

---
${original}
---`,
    }),
  });

  if (!response.ok) throw new Error("Variant generation failed");
  const data = await response.json();
  return data.content;
}

export function createDraftObject(
  content: string,
  persona: Persona,
  brief: BriefFormData,
  refinement: RefinementSettings
): Draft {
  return {
    id: crypto.randomUUID(),
    content,
    format: brief.outputFormat as OutputFormat,
    persona: persona.id,
    brief,
    refinement,
    createdAt: new Date(),
  };
}