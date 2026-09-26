import type { DriftEntry } from "./types.js";

export function renderMarkdownReport(entries: DriftEntry[]): string {
  const lines = [
    "# Token Parity Report",
    "",
    "| Token | Figma Value | Code Value | Status | Notes |",
    "|---|---|---|---|---|",
  ];

  for (const entry of entries) {
    lines.push(
      `| ${entry.name} | ${entry.figmaValue ?? "—"} | ${entry.codeValue ?? "—"} | ${entry.status} | ${entry.severity ?? ""} |`
    );
  }

  return lines.join("\n") + "\n";
}
