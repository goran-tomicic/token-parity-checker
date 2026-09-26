import type { Token, TokenSet } from "./types.js";

/**
 * Normalizes a raw token source (Figma export or code token file) into a
 * flat name -> value map. Pure, deterministic, no LLM involved — this is
 * what makes the diff step testable in isolation from the agentic reasoning.
 */
export function normalizeTokens(tokens: Token[]): TokenSet {
  const normalized: TokenSet = {};
  for (const token of tokens) {
    normalized[token.name] = token.value;
  }
  return normalized;
}
