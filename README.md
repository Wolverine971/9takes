<!-- README.md -->

# 9takes

> See the emotions behind every take. One situation, 9 ways to see it.

9takes is a personality-based Q&A and content platform built around the Enneagram. Readers ask anonymous questions, swap perspectives with a "give-first" comment system, and dig into celebrity and pop-culture personality analyses.

- **Live site**: [9takes.com](https://9takes.com)
- **Stack**: SvelteKit 2 + Svelte 5, Supabase (Postgres), Elasticsearch, TailwindCSS + SCSS, deployed on Vercel
- **Content**: MDsvex blogs + DB-backed personality analyses

## Why the name

9takes comes from the 9 personality types within the Enneagram — 9 worldviews, 9 ways to read the same moment.

## Repo layout (high level)

```
src/routes/        # SvelteKit pages, API routes, admin panel
src/lib/           # Components, server utils, email, analytics
src/blog/          # MDsvex content (community, enneagram, guides, pop-culture, …)
scripts/           # Generators, indexers, migration helpers
supabase/          # SQL migrations
docs/              # Brand, SEO, growth, planning, research
```

See [CLAUDE.md](./CLAUDE.md) for a thorough map of routes, admin sections, API endpoints, `src/lib/server/` modules, env vars, and conventions.

## Prerequisites

- Node `>=22`
- pnpm `>=8`
- Supabase project + service role key
- Elasticsearch instance (for questions search)
- A populated `.env.local` — see the Environment Variables section of [CLAUDE.md](./CLAUDE.md#environment-variables)

## Quick start

```bash
pnpm install
pnpm gen:all     # Optional: regenerate types, sitemap, search index, etc.
pnpm dev         # http://localhost:5173
```

## Common commands

```bash
pnpm dev                # Dev server
pnpm build              # Production build
pnpm build:vercel       # Build as Vercel runs it (with pre-generators)
pnpm check              # svelte-kit sync + svelte-check
pnpm lint               # Prettier check + ESLint
pnpm format             # Prettier write
pnpm test               # Playwright E2E
pnpm test:unit          # Vitest unit tests (*.spec.ts)
pnpm index:blogs        # Index MDsvex blogs into Supabase FTS
pnpm gen:sitemap        # Regenerate sitemap
```

## Blog sections

| Route                   | Source                                           |
| ----------------------- | ------------------------------------------------ |
| `/community`            | `src/blog/community/` (MDsvex)                   |
| `/enneagram-corner`     | `src/blog/enneagram/` (MDsvex)                   |
| `/how-to-guides`        | `src/blog/guides/` (MDsvex)                      |
| `/pop-culture`          | `src/blog/pop-culture/` (MDsvex)                 |
| `/personality-analysis` | `blogs_famous_people` Supabase table (DB-driven) |

`/personality-analysis` is managed through the admin UI at `/admin/content-board` and versioned in `blogs_famous_people_history`.

Corpus-wide numbers (type distribution, over-representation by domain, quality + freshness) live at [`/corpus-stats`](https://9takes.com/corpus-stats) and are regenerated on every deploy from `scripts/generate-corpus-stats.js`. The machine-readable copy is `src/lib/data/corpus-stats.json`; the human-readable Markdown mirror is `docs/data/corpus-stats.md`.

## Testing

- **Unit**: Vitest. Specs live next to the code they test (`src/lib/server/*.spec.ts`, `src/routes/**/*.spec.ts`). Run `pnpm test:unit`.
- **E2E**: Playwright. Run `pnpm test`.

## Deployment

The repo deploys on Vercel via `@sveltejs/adapter-vercel`. `pnpm build:vercel` runs the personality-image-map and sitemap generators before building, so they stay in sync in production.

Cron endpoints (`src/routes/api/cron/*`) are triggered on schedule and require a `CRON_SECRET` bearer. The `/api/update-questions` webhook requires `PRIVATE_WEBHOOK_AUTH`.

## Contributing notes

- Prefer Supabase RPC functions for complex queries — see examples in `src/lib/server/`.
- New Svelte components should use Svelte 5 runes (`$state`, `$props`, `$effect`, `$derived`). Legacy components still use `export let` / `$:` — migrate when you touch them.
- Unit-testable logic belongs in `src/lib/server/*.ts` so it can run without a browser.
- Brand voice: "Tactically Direct, Socially Savvy, Respectfully Provocative." See `docs/brand/` before writing copy.

## License

Proprietary — all rights reserved.
