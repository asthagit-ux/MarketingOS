import { describe, expect, it } from "vitest";
import {
  briefFormSchema,
  copyOutputSchema,
  generateRequestSchema,
  refineRequestSchema,
} from "./api";

describe("briefFormSchema", () => {
  it("accepts a valid brief", () => {
    const r = briefFormSchema.safeParse({
      product: "ACME CRM",
      goal: "Book demos",
      audience: "b2b-smb",
      outputFormat: "ad-copy",
      additionalContext: "Avoid hype",
    });
    expect(r.success).toBe(true);
  });

  it("rejects empty product", () => {
    const r = briefFormSchema.safeParse({
      product: "   ",
      goal: "x",
      audience: "b2b-smb",
      outputFormat: "ad-copy",
    });
    expect(r.success).toBe(false);
  });
});

describe("copyOutputSchema", () => {
  it("accepts minimal valid copy", () => {
    const r = copyOutputSchema.safeParse({
      hook: "Hi",
      body: "Body",
      cta: "Go",
      rationale: "Because",
    });
    expect(r.success).toBe(true);
  });

  it("accepts optional variants", () => {
    const r = copyOutputSchema.safeParse({
      hook: "H",
      body: "B",
      cta: "C",
      rationale: "R",
      variants: [{ label: "A", hook: "h", body: "b", cta: "c" }],
    });
    expect(r.success).toBe(true);
  });
});

describe("generateRequestSchema", () => {
  it("accepts valid generate body", () => {
    const r = generateRequestSchema.safeParse({
      personaId: "solo-founder",
      brief: {
        product: "P",
        goal: "G",
        audience: "technical",
        outputFormat: "landing-page",
      },
      refinement: { tone: "balanced", audience: "technical", length: "short" },
    });
    expect(r.success).toBe(true);
  });
});

describe("refineRequestSchema", () => {
  it("accepts valid refine body", () => {
    const r = refineRequestSchema.safeParse({
      personaId: "agency-strategist",
      output: {
        hook: "h",
        body: "b",
        cta: "c",
        rationale: "r",
      },
      refinement: {
        tone: "authoritative",
        audience: "b2c-premium",
        length: "long",
      },
      customInstruction: "Tighter",
    });
    expect(r.success).toBe(true);
  });
});
