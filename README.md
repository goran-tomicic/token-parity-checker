# token-parity-checker

A small agentic CLI that compares design tokens (colors, spacing, typography) between a Figma/design export and your codebase, and reports where they've drifted apart. The comparison step uses Claude to reason about the diff — not just naive string matching — so it can tell "same value, different format" apart from a real mismatch, and call out which drifts actually matter.

## Requirements

- Node.js 18+
- An Anthropic API key ([platform.claude.com/settings/keys](https://platform.claude.com/settings/keys))

## Setup

```bash
npm install
cp .env.example .env
```

Open `.env` and paste your API key after `ANTHROPIC_API_KEY=`.

## Usage

```bash
npm run check -- <figma-tokens.json> <code-tokens.json>
```

For example, using the sample data included in this repo:

```bash
npm run check -- data/figma-tokens.json data/code-tokens.json
```

This prints a markdown report to the terminal and also writes it to `report.md` in the project root.

## Input format

Both files are a JSON array of tokens:

```json
[
  { "name": "color.primary", "value": "#3B82F6", "category": "color" },
  { "name": "spacing.sm", "value": "8px", "category": "spacing" }
]
```

- `name` — a dot-separated token identifier; must match between the two files for the tool to pair them up
- `value` — the token's value as a string
- `category` — optional, for your own reference

Export your Figma variables (or design tool tokens) to this shape for the first file, and your code's token source (CSS variables, `tokens.ts`, Tailwind config, etc.) converted to this shape for the second.

## Reading the output

The report is a table with one row per token name found in either file:

| Status | Meaning |
|---|---|
| `match` | Same name, equivalent value on both sides |
| `drift` | Same name, but the value differs — includes a one-line note on severity (e.g. cosmetic vs. layout-breaking) |
| `missing-in-code` | Present in the design file but not found in code |
| `missing-in-figma` | Present in code but not found in the design file |

## Notes

- This is a v1 demo tool: single static token export in, single report out — no live Figma sync, no auto-fix, no persistence between runs.
- Each run makes one API call to Claude (`claude-sonnet-5` by default, configurable via `CLAUDE_MODEL` in `.env`).
