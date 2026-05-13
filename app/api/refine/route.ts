import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { refineRequestSchema } from "@/lib/validation/api";
import { generateValidatedCopy } from "@/lib/langchain/client";
import { getSystemPrompt, buildRefinePrompt } from "@/lib/prompts/marketing";

export async function POST(req: NextRequest) {
  const requestId = randomUUID();
  const started = Date.now();
  let personaId: string | undefined;

  try {
    const json = await req.json();
    const parsed = refineRequestSchema.safeParse(json);
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

    const { personaId: pid, output, refinement, customInstruction } = parsed.data;
    personaId = pid;
    const system = getSystemPrompt(pid);
    const user = buildRefinePrompt(
      JSON.stringify(output, null, 2),
      refinement,
      customInstruction ?? ""
    );

    const data = await generateValidatedCopy(system, user);

    console.log(
      JSON.stringify({
        level: "info",
        route: "/api/refine",
        requestId,
        durationMs: Date.now() - started,
        personaId: pid,
        status: 200,
      })
    );

    return NextResponse.json({ data, requestId });
  } catch (err) {
    console.error(
      JSON.stringify({
        level: "error",
        route: "/api/refine",
        requestId,
        durationMs: Date.now() - started,
        personaId,
        message: err instanceof Error ? err.message : String(err),
      })
    );
    return NextResponse.json(
      {
        error: {
          code: "REFINE_FAILED",
          message:
            err instanceof Error ? err.message : "Refinement failed. Try again.",
          requestId,
        },
      },
      { status: 500 }
    );
  }
}
