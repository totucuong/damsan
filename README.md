This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
