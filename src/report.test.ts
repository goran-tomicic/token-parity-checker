import { test } from "node:test";
import assert from "node:assert/strict";
import { renderMarkdownReport } from "./report.js";

test("renderMarkdownReport writes a table row per entry", () => {
  const md = renderMarkdownReport([
    { name: "color.primary", figmaValue: "#000", codeValue: "#fff", status: "drift", severity: "color drift, cosmetic" },
    { name: "color.danger", figmaValue: "#EF4444", codeValue: null, status: "missing-in-code" },
  ]);

  assert.match(md, /# Token Parity Report/);
  assert.match(md, /\| color\.primary \| #000 \| #fff \| drift \| color drift, cosmetic \|/);
  assert.match(md, /\| color\.danger \| #EF4444 \| — \| missing-in-code \|  \|/);
});
