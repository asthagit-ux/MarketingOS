import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { copyOutputSchema } from "@/lib/validation/api";
import type { CopyOutput } from "@/types";

const MODEL = "gemini-2.0-flash";
const INVOKE_TIMEOUT_MS = 55_000;
const MAX_RETRIES = 3;

const REPAIR_PREFIX = `The following text should be ONE JSON object with keys: hook, body, cta, rationale, and optionally variants (array of objects with label, hook, body, cta).
Return ONLY valid JSON. No markdown code fences. No commentary before or after.

Faulty output:
---
`;

function getModel(temperature: number) {
  return new ChatGoogleGenerativeAI({
    model: MODEL,
    apiKey: process.env.GEMINI_API_KEY!,
    temperature,
    maxOutputTokens: 8192,
  });
}

async function invokeOnce(
  systemPrompt: string,
  userPrompt: string,
  temperature: number
): Promise<string> {
  const model = getModel(temperature);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), INVOKE_TIMEOUT_MS);

  try {
    const response = await model.invoke(
      [new SystemMessage(systemPrompt), new HumanMessage(userPrompt)],
      { signal: controller.signal }
    );
    const raw = response.content as string;
    return raw.replace(/```json|```/gi, "").trim();
  } finally {
    clearTimeout(timer);
  }
}

async function invokeWithRetries(
  systemPrompt: string,
  userPrompt: string,
  temperature: number
): Promise<string> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await invokeOnce(systemPrompt, userPrompt, temperature);
    } catch (e) {
      lastErr = e;
      const msg = e instanceof Error ? e.message : String(e);
      const retryable =
        msg.includes("429") ||
        msg.includes("503") ||
        msg.includes("UNAVAILABLE") ||
        msg.includes("ECONNRESET") ||
        msg === "GEMINI_TIMEOUT" ||
        (e instanceof Error && e.name === "AbortError");
      if (!retryable || attempt === MAX_RETRIES - 1) throw e;
      await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("INVALID_JSON");
  }
}

function validateCopy(data: unknown): CopyOutput {
  const r = copyOutputSchema.safeParse(data);
  if (!r.success) throw new Error("SCHEMA_FAIL");
  return r.data;
}

export async function generateValidatedCopy(
  systemPrompt: string,
  userPrompt: string
): Promise<CopyOutput> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const raw = await invokeWithRetries(systemPrompt, userPrompt, 0.45);
  try {
    return validateCopy(parseJson(raw));
  } catch {
    const repairUser = `${REPAIR_PREFIX}${raw.slice(0, 12000)}\n---`;
    const repaired = await invokeWithRetries(systemPrompt, repairUser, 0.05);
    return validateCopy(parseJson(repaired));
  }
}
