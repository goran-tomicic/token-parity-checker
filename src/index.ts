import { readFile, writeFile } from "node:fs/promises";
import { normalizeTokens } from "./normalize.js";
import { diffTokens } from "./diff.js";
import { renderMarkdownReport } from "./report.js";
import type { Token } from "./types.js";

async function loadTokenFile(path: string): Promise<Token[]> {
  const raw = await readFile(path, "utf-8");
  return JSON.parse(raw) as Token[];
}

async function main() {
  const [figmaPath, codePath] = process.argv.slice(2);
  if (!figmaPath || !codePath) {
    console.error("Usage: npm run check -- <figma-tokens.json> <code-tokens.json>");
    process.exit(1);
  }

  const figmaTokens = normalizeTokens(await loadTokenFile(figmaPath));
  const codeTokens = normalizeTokens(await loadTokenFile(codePath));

  const entries = await diffTokens(figmaTokens, codeTokens);
  const report = renderMarkdownReport(entries);

  await writeFile("report.md", report, "utf-8");
  console.log(report);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
