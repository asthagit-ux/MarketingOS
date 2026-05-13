export type PersonaId = "solo-founder" | "growth-manager" | "agency-strategist";

export interface Persona {
  id: PersonaId;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  inputHints: string[];
  outputFormats: OutputFormat[];
  toneDefault: ToneValue;
}

export type OutputFormat =
  | "ad-copy"
  | "email-sequence"
  | "social-posts"
  | "landing-page"
  | "campaign-brief";

export type ToneValue = "casual" | "balanced" | "professional" | "authoritative";

export type AudienceSegment =
  | "b2b-smb"
  | "b2b-enterprise"
  | "b2c-general"
  | "b2c-premium"
  | "technical"
  | "non-technical";

export interface BriefFormData {
  product: string;
  goal: string;
  audience: AudienceSegment;
  outputFormat: OutputFormat;
  additionalContext?: string;
}

export interface RefinementSettings {
  tone: ToneValue;
  audience: AudienceSegment;
  length: "short" | "medium" | "long";
}

/** Structured model output (validated with Zod on the server). */
export interface CopyVariant {
  label: string;
  hook: string;
  body: string;
  cta: string;
}

export interface CopyOutput {
  hook: string;
  body: string;
  cta: string;
  rationale: string;
  variants?: CopyVariant[];
}

export interface Draft {
  id: string;
  output: CopyOutput;
  format: OutputFormat;
  persona: PersonaId;
  brief: BriefFormData;
  refinement: RefinementSettings;
  createdAt: string;
}

export interface ExportOptions {
  format: "markdown" | "plain-text" | "html" | "json";
  includeMetadata: boolean;
}

export interface GenerateRequestBody {
  personaId: PersonaId;
  brief: BriefFormData;
  refinement: RefinementSettings;
  /** When set, model should produce a new angle vs this prior output */
  variantOf?: CopyOutput;
}

export interface RefineRequestBody {
  personaId: PersonaId;
  output: CopyOutput;
  refinement: RefinementSettings;
  customInstruction?: string;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    requestId?: string;
  };
}
