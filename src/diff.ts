import Anthropic from "@anthropic-ai/sdk";
import type { DriftEntry, TokenSet } from "./types.js";

const MODEL = process.env.CLAUDE_MODEL ?? "claude-sonnet-5";

/**
 * Sends both normalized token sets to Claude for the diff-reasoning step.
 * Kept separate from normalize.ts so the mechanical normalization stays
 * testable without hitting the API, per CLAUDE.md.
 */
export async function diffTokens(
  figmaTokens: TokenSet,
  codeTokens: TokenSet
): Promise<DriftEntry[]> {
  const client = new Anthropic();

  const prompt = buildDiffPrompt(figmaTokens, codeTokens);

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  return parseDiffResponse(text);
}

export function buildDiffPrompt(figmaTokens: TokenSet, codeTokens: TokenSet): string {
  return `You are comparing two design token sets for drift.

Figma tokens (name -> value):
${JSON.stringify(figmaTokens, null, 2)}

Code tokens (name -> value):
${JSON.stringify(codeTokens, null, 2)}

For each token name present in either set, classify it as one of:
- "match": same name, equivalent value
- "drift": same name, different value
- "missing-in-code": present in Figma only
- "missing-in-figma": present in code only

Treat equivalent value formats as matches (e.g. "#FF0000" vs "#ff0000", "8px" vs "0.5rem" at a 16px base).
For each "drift" entry, add a one-line severity note (e.g. "color drift, cosmetic" or "spacing drift, layout risk").

Respond with ONLY a JSON array of objects: { "name", "figmaValue", "codeValue", "status", "severity" }.`;
}

export function parseDiffResponse(text: string): DriftEntry[] {
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error(`Could not find JSON array in diff response: ${text}`);
  }
  return JSON.parse(jsonMatch[0]) as DriftEntry[];
}
