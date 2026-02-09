# Garry Clear Prompt -- Project Documentation Index

> Start here to navigate the full documentation.

---

## Documentation Map

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design, layer architecture, data flow diagrams, state management strategy, directory structure |
| [COMPONENTS.md](./COMPONENTS.md) | Full component catalog -- every component with props, description, and usage patterns |
| [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) | Visual language, colors, typography, spacing, component patterns, responsive behavior, animation, accessibility, icons |
| [ENGINE-API.md](./ENGINE-API.md) | Engine module API reference -- every function with params, return types, and behavior |
| [TESTING.md](./TESTING.md) | Testing guide -- tools, coverage requirements, mock factories, how to write tests |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution workflow -- setup, branch naming, commits, PR checklist, code review |

---

## Quick Links

- **README**: [`../README.md`](../README.md) -- Overview, features, quick start, architecture diagrams, scenarios, contributing
- **Types**: `src/types/prompt.types.ts` -- All shared TypeScript type definitions
- **Constants**: `src/common/constants/index.ts` -- App name, storage keys, limits, score bands
- **Messages**: `src/common/messages/` -- Centralized toast and log message strings (info, error, warn, debug)
- **Interfaces**: `src/common/interfaces/index.ts` -- `ApiResult<T>`, `StorageResult<T>`
- **File Names**: `src/common/fileNames.ts` -- Export base names and extensions
- **Env Config**: `.env.example` -- Environment variable documentation
- **Cursor Rules**: `.cursor/rules/` -- 10 AI rules for code standards

---

## Overview

A standalone web app that helps anyone write prompts that produce more accurate results using fewer words and fewer tokens.

**Two modes**:
- **Basic Mode**: Natural language, no jargon, gentle refiners
- **Advanced Mode**: Full control -- model advisor, token estimation, prompt lint/rating, MCP suggestions, NLP analysis, calibration, versioning, test cases, and export

**Tech stack**: React 19, TypeScript 5.9, Vite 7, Tailwind CSS v4, shadcn/ui, Redux Toolkit, Jest

**Node.js**: v24.13.0 recommended

**No backend. No auth. No database. Local-first. Offline-capable.**
