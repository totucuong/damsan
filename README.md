Damsan.life is agentic personal health secretary.


## Environment Setup

1) Copy the example env and fill values:

```bash
cp .env.example .env
```

Required vars: `OPENAI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`, `SUPABASE_BUCKET`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`.

2) Install dependencies (pnpm recommended):

```bash
pnpm install
```

3) Initialize database (Postgres):

```bash
pnpm exec prisma migrate dev
pnpm exec prisma generate
```

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Commands

```bash
pnpm dev        # Start local dev (Turbopack)
pnpm build      # Production build
pnpm start      # Run built app
pnpm lint       # ESLint (Next + TS config)
pnpm typecheck  # TypeScript type checking (no emit)
pnpm test       # Runs typecheck + lint

# Prisma helpers
pnpm exec prisma migrate dev   # Apply schema changes
pnpm exec prisma generate      # Regenerate Prisma client
```

## Contributing

Before opening a PR, read `AGENTS.md` for repository guidelines (structure, commands, style, and PR checklist).

