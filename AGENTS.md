# Repository Guidelines

## Project Structure & Module Organization
- `app/` — Next.js App Router (routes, `layout.tsx`, `page.tsx`).
- `components/` — Reusable UI components (`PascalCase.tsx`). Aliases: `@/components`.
- `lib/` — Shared utilities (client/server). Alias: `@/lib`.
- `hooks/` — React hooks (`useThing.ts`). Alias: `@/hooks`.
- `utils/` — Lightweight helpers.
- `prisma/` — `schema.prisma` and database artifacts.
- `public/` — Static assets.
- `.env` — Local secrets (not committed).

Example import: `import { cn } from '@/lib/utils'`.

## Build, Test, and Development Commands
- `pnpm dev` — Start local dev server (Turbopack) at http://localhost:3000.
- `pnpm build` — Production build.
- `pnpm start` — Run the built app.
- `pnpm lint` — Lint with ESLint (Next + TypeScript config).
- Prisma: `pnpm exec prisma migrate dev` to apply schema changes; `pnpm exec prisma generate` (also runs on postinstall).

## Coding Style & Naming Conventions
- Language: TypeScript (strict mode). Avoid `any` (rule warns).
- Indentation: 2 spaces; keep lines concise; prefer named exports.
- Components: `PascalCase` files in `components/`. Hooks: `useThing.ts` in `hooks/`.
- Variables/functions: `camelCase`. Constants: `SCREAMING_SNAKE_CASE` when global.
- Imports: use `@/*` paths per `tsconfig.json`.
- Ensure `pnpm lint` passes; use `eslint --fix` where safe.

## Testing Guidelines
- No test runner is configured yet. If adding tests:
  - Unit: Vitest + Testing Library; files `*.test.ts(x)` near sources.
  - E2E: Playwright; place under `e2e/`.
  - Keep tests fast, isolated, and avoid external network calls; stub Prisma/Supabase.

## Commit & Pull Request Guidelines
- Commits: Short, imperative summaries (e.g., "add source preview as hovering card"). Group related changes.
- PRs must include: purpose, screenshots for UI, steps to verify, and notes on schema/env changes.
- Before opening a PR: run `pnpm lint` and `pnpm build`; update docs if structure or schema changes.

## Security & Configuration
- Do not commit secrets. Required env vars for Prisma/Postgres: `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`.
- After editing `prisma/schema.prisma`, run a migration and regenerate the client.

## Agent Tips (for coding assistants)
- Keep diffs minimal and scoped; respect existing directory boundaries and aliases.
- Prefer incremental changes with clear rationale; update this file when conventions evolve.

