import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeTokens } from "./normalize.js";

test("normalizeTokens flattens tokens into a name -> value map", () => {
  const result = normalizeTokens([
    { name: "color.primary", value: "#3B82F6", category: "color" },
    { name: "spacing.sm", value: "8px" },
  ]);

  assert.deepEqual(result, {
    "color.primary": "#3B82F6",
    "spacing.sm": "8px",
  });
});

test("normalizeTokens returns an empty object for no tokens", () => {
  assert.deepEqual(normalizeTokens([]), {});
});

test("normalizeTokens lets later duplicate names win", () => {
  const result = normalizeTokens([
    { name: "color.primary", value: "#000000" },
    { name: "color.primary", value: "#FFFFFF" },
  ]);

  assert.equal(result["color.primary"], "#FFFFFF");
});
