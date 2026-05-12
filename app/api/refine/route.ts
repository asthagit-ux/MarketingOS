import { NextRequest, NextResponse } from "next/server";
import { RefineRequest } from "@/types";
import { getSystemPrompt, buildRefinePrompt } from "@/lib/prompts/templates";
import { refineCopy } from "@/lib/langchain/client";

export async function POST(req: NextRequest) {
  try {
    const body: RefineRequest = await req.json();
    const { original, brief, tone, lengthPreference, customInstruction } = body;

    if (!original || !brief?.persona) {
      return NextResponse.json(
        { error: "Missing original copy or persona" },
        { status: 400 }
      );
    }

    const systemPrompt = getSystemPrompt(brief.persona);
    const refinePrompt = buildRefinePrompt(
      JSON.stringify(original, null, 2),
      customInstruction ?? "",
      tone,
      lengthPreference
    );

    const output = await refineCopy(systemPrompt, refinePrompt);

    return NextResponse.json({ data: output });
  } catch (err) {
    console.error("[/api/refine]", err);
    return NextResponse.json(
      { error: "Refinement failed." },
      { status: 500 }
    );
  }
}
