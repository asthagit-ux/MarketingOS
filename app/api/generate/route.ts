import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { generateRequestSchema } from "@/lib/validation/api";
import { generateValidatedCopy } from "@/lib/langchain/client";
import { getSystemPrompt, buildGenerationUserPrompt } from "@/lib/prompts/marketing";

export async function POST(req: NextRequest) {
  const requestId = randomUUID();
  const started = Date.now();
  let personaId: string | undefined;
  let outputFormat: string | undefined;

  try {
    const json = await req.json();
    const parsed = generateRequestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION",
            message: "Invalid request body",
            details: parsed.error.flatten(),
            requestId,
          },
        },
        { status: 400 }
      );
    }

    const { personaId: pid, brief, refinement, variantOf } = parsed.data;
    personaId = pid;
    outputFormat = brief.outputFormat;
    const includeVariants = pid === "growth-manager";
    const variantNote = variantOf
      ? `Prior draft — produce a clearly different angle:\n${JSON.stringify(variantOf).slice(0, 6000)}`
      : undefined;

    const system = getSystemPrompt(pid);
    const user = buildGenerationUserPrompt(brief, refinement, {
      includeVariants,
      variantNote,
    });

    const data = await generateValidatedCopy(system, user);

    console.log(
      JSON.stringify({
        level: "info",
        route: "/api/generate",
        requestId,
        durationMs: Date.now() - started,
        personaId: pid,
        format: brief.outputFormat,
        status: 200,
      })
    );

    return NextResponse.json({ data, requestId });
  } catch (err) {
    console.error(
      JSON.stringify({
        level: "error",
        route: "/api/generate",
        requestId,
        durationMs: Date.now() - started,
        personaId,
        format: outputFormat,
        message: err instanceof Error ? err.message : String(err),
      })
    );
    return NextResponse.json(
      {
        error: {
          code: "GENERATION_FAILED",
          message:
            err instanceof Error ? err.message : "Generation failed. Try again.",
          requestId,
        },
      },
      { status: 500 }
    );
  }
}
