import type {
  PersonaId,
  BriefFormData,
  RefinementSettings,
  CopyOutput,
  Draft,
  Persona,
} from "@/types";

function readApiError(json: unknown): string {
  if (
    json &&
    typeof json === "object" &&
    "error" in json &&
    json.error &&
    typeof json.error === "object" &&
    "message" in json.error &&
    typeof (json.error as { message: unknown }).message === "string"
  ) {
    const e = json.error as { message: string; requestId?: string };
    return e.requestId ? `${e.message} (ref: ${e.requestId})` : e.message;
  }
  return "Request failed";
}

export async function apiGenerate(params: {
  personaId: PersonaId;
  brief: BriefFormData;
  refinement: RefinementSettings;
  variantOf?: CopyOutput;
}): Promise<{ data: CopyOutput; requestId: string }> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      personaId: params.personaId,
      brief: params.brief,
      refinement: params.refinement,
      variantOf: params.variantOf,
    }),
  });
  const json = (await res.json()) as unknown;
  if (!res.ok) {
    throw new Error(readApiError(json));
  }
  if (
    json &&
    typeof json === "object" &&
    "data" in json &&
    json.data &&
    typeof json.data === "object"
  ) {
    const requestId =
      "requestId" in json && typeof json.requestId === "string"
        ? json.requestId
        : "";
    return { data: json.data as CopyOutput, requestId };
  }
  throw new Error("Unexpected response");
}

export async function apiRefine(params: {
  personaId: PersonaId;
  output: CopyOutput;
  refinement: RefinementSettings;
  customInstruction?: string;
}): Promise<{ data: CopyOutput; requestId: string }> {
  const res = await fetch("/api/refine", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      personaId: params.personaId,
      output: params.output,
      refinement: params.refinement,
      customInstruction: params.customInstruction,
    }),
  });
  const json = (await res.json()) as unknown;
  if (!res.ok) {
    throw new Error(readApiError(json));
  }
  if (
    json &&
    typeof json === "object" &&
    "data" in json &&
    json.data &&
    typeof json.data === "object"
  ) {
    const requestId =
      "requestId" in json && typeof json.requestId === "string"
        ? json.requestId
        : "";
    return { data: json.data as CopyOutput, requestId };
  }
  throw new Error("Unexpected response");
}

export function buildDraft(
  output: CopyOutput,
  persona: Persona,
  brief: BriefFormData,
  refinement: RefinementSettings
): Draft {
  return {
    id: crypto.randomUUID(),
    output,
    format: brief.outputFormat,
    persona: persona.id,
    brief,
    refinement,
    createdAt: new Date().toISOString(),
  };
}
