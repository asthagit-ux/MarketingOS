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

export interface Draft {
  id: string;
  content: string;
  format: OutputFormat;
  persona: PersonaId;
  brief: BriefFormData;
  refinement: RefinementSettings;
  createdAt: Date;
  variants?: string[];
}

export interface ExportOptions {
  format: "markdown" | "plain-text" | "html" | "json";
  includeMetadata: boolean;
}