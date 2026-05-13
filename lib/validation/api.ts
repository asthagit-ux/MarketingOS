import { z } from "zod";

const personaIdSchema = z.enum(["solo-founder", "growth-manager", "agency-strategist"]);

const outputFormatSchema = z.enum([
  "ad-copy",
  "email-sequence",
  "social-posts",
  "landing-page",
  "campaign-brief",
]);

const audienceSchema = z.enum([
  "b2b-smb",
  "b2b-enterprise",
  "b2c-general",
  "b2c-premium",
  "technical",
  "non-technical",
]);

const toneSchema = z.enum(["casual", "balanced", "professional", "authoritative"]);

const lengthSchema = z.enum(["short", "medium", "long"]);

export const briefFormSchema = z.object({
  product: z.string().trim().min(1).max(4000),
  goal: z.string().trim().min(1).max(2000),
  audience: audienceSchema,
  outputFormat: outputFormatSchema,
  additionalContext: z.string().max(8000).optional(),
});

export const refinementSchema = z.object({
  tone: toneSchema,
  audience: audienceSchema,
  length: lengthSchema,
});

const copyVariantSchema = z.object({
  label: z.string().max(200),
  hook: z.string().max(8000),
  body: z.string().max(16000),
  cta: z.string().max(4000),
});

export const copyOutputSchema = z.object({
  hook: z.string().max(8000),
  body: z.string().max(16000),
  cta: z.string().max(4000),
  rationale: z.string().max(8000),
  variants: z.array(copyVariantSchema).max(6).optional(),
});

export const generateRequestSchema = z.object({
  personaId: personaIdSchema,
  brief: briefFormSchema,
  refinement: refinementSchema,
  variantOf: copyOutputSchema.optional(),
});

export const refineRequestSchema = z.object({
  personaId: personaIdSchema,
  output: copyOutputSchema,
  refinement: refinementSchema,
  customInstruction: z.string().max(2000).optional(),
});

export type GenerateRequest = z.infer<typeof generateRequestSchema>;
export type RefineRequest = z.infer<typeof refineRequestSchema>;
export type ValidatedCopyOutput = z.infer<typeof copyOutputSchema>;
