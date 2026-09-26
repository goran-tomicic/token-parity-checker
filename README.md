# token-parity-checker

Small agentic tool that diffs design tokens between a Figma (or static JSON) export and code, and reports drift using Claude for the reasoning step.

## Setup
1. `npm install`
2. `cp .env.example .env` and fill in your Anthropic API key
3. `npm run check -- data/figma-tokens.json data/code-tokens.json`
