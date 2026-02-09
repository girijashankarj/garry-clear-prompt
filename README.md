# Garry Clear Prompt

A prompt quality and efficiency tool that helps anyone write prompts that produce more accurate results using fewer words and fewer tokens.

## What It Does

- **Rates your prompt** on clarity, constraints, structure, token efficiency, and risk (0-100 score)
- **Suggests improvements** with actionable feedback
- **Recommends model tier** (Fast / Balanced / Reasoning) based on task type, complexity, and risk
- **Estimates token usage** with input/output token ranges and format multipliers
- **Lints your prompt** with 15 rules covering quality, security, and efficiency
- **Suggests MCP tools** with permission levels and risk notes
- **Exports** to Markdown, Text, or JSON

## Two Modes

### Basic Mode (Default)
For anyone who can type. Natural language, no jargon, gentle refiners.

### Advanced Mode
Full control for developers: prompt + meta prompt editors, model advisor, token estimation, lint rules, MCP suggestions.

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS v4 + shadcn/ui
- react-hook-form + zod
- react-markdown + remark-gfm
- Local-first, offline-capable, no backend, no auth

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Core Philosophy

- Clarity before cleverness
- Structure before size
- Constraints before creativity

## License

MIT
