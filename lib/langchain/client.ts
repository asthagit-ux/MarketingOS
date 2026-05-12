import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { CopyOutput } from "@/types";

let _model: ChatGoogleGenerativeAI | null = null;

function getModel() {
  if (!_model) {
    _model = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
      apiKey: process.env.GEMINI_API_KEY!,
      temperature: 0.7,
      maxOutputTokens: 1500,
    });
  }
  return _model;
}

export async function generateCopy(
  systemPrompt: string,
  userPrompt: string
): Promise<CopyOutput> {
  const model = getModel();

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(userPrompt),
  ]);

  const raw = response.content as string;

  // Strip any accidental markdown fences
  const clean = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(clean) as CopyOutput;
  } catch {
    throw new Error(`Failed to parse model output: ${clean.slice(0, 200)}`);
  }
}

export async function refineCopy(
  systemPrompt: string,
  refinePrompt: string
): Promise<CopyOutput> {
  return generateCopy(systemPrompt, refinePrompt);
}
