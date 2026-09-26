import { test } from "node:test";
import assert from "node:assert/strict";
import { buildDiffPrompt, parseDiffResponse } from "./diff.js";

test("buildDiffPrompt embeds both token sets as JSON", () => {
  const prompt = buildDiffPrompt({ "color.primary": "#000" }, { "color.primary": "#fff" });

  assert.match(prompt, /"color.primary": "#000"/);
  assert.match(prompt, /"color.primary": "#fff"/);
  assert.match(prompt, /JSON array/);
});

test("parseDiffResponse extracts a JSON array from surrounding prose", () => {
  const text = `Here is the diff:\n\n[{"name":"color.primary","figmaValue":"#000","codeValue":"#fff","status":"drift"}]\n\nDone.`;

  const entries = parseDiffResponse(text);

  assert.equal(entries.length, 1);
  assert.equal(entries[0].name, "color.primary");
  assert.equal(entries[0].status, "drift");
});

test("parseDiffResponse throws when no JSON array is present", () => {
  assert.throws(() => parseDiffResponse("no json here"));
});
