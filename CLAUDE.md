<!-- CLAUDE.md -->

# CLAUDE.md

Guidance for Claude Code when working with this repository.

## Project Overview

9takes is a personality-based Q&A platform built on the Enneagram system. Users submit anonymous questions/answers with personality context using a "give-first" commenting system (must contribute before viewing others' responses).

**Core Concept**: "See the emotions behind every take" - One situation, 9 ways to see it.

### Platform Pillars

1. **Q&A Platform** (`/questions`) - Anonymous personality-based discussions with give-first mechanic
2. **Coaching/Consultation** (`/book-session`) - Waitlist signup for 1-on-1 Enneagram coaching sessions
3. **Blog Content** - SEO-driven content across multiple domains (see Blog Categories below)
4. **Admin Tools** (`/admin`) - Content management, analytics, email campaigns, user management
5. **Email Sequences** - Welcome + drip sequences, cron-driven (`src/lib/email/`, `src/routes/api/cron/`)

## Commands

```bash
pnpm dev               # Start dev server (port 5173)
pnpm build             # Production build
pnpm build:vercel      # Vercel build (generates personality image map + sitemap first)
pnpm check             # svelte-kit sync + svelte-check type-check
pnpm check:watch       # Type-check in watch mode
pnpm lint              # Prettier check + ESLint
pnpm format            # Auto-format with Prettier
pnpm test              # Playwright E2E tests
pnpm test:unit         # Vitest unit tests (*.spec.ts alongside sources)
pnpm clean             # Remove .svelte-kit build output
```

## Tech Stack

- **Framework**: SvelteKit 2.x + Svelte 5 (runes: `$state`, `$props`, `$effect`, `$derived`)
- **Language**: TypeScript (strict) + Zod validation
- **Database**: Supabase (PostgreSQL) via `@supabase/ssr` + `@supabase/supabase-js`
- **Styling**: TailwindCSS 3 + SCSS, Flowbite-Svelte components
- **Content**: MDsvex for Markdown blogs (with rehype-slug, remark-abbr, remark-github)
- **Search**: Elasticsearch (questions), Supabase FTS (blogs)
- **Email**: Gmail API (service account), custom sequence engine in `src/lib/email/`
- **Payments**: Stripe (`src/routes/stripe/`)
- **Analytics**: In-house page analytics + web-vitals, optional Vercel Analytics
- **Images**: `sharp`, `@sveltejs/enhanced-img`, `html-to-image`, `html2canvas`, `jspdf`
- **Deploy**: Vercel (`@sveltejs/adapter-vercel`)
- **Runtime**: Node >=22, pnpm >=8

## Project Structure

```
src/
├── routes/
│   ├── questions/             # Q&A platform core ([slug] detail, create, categories)
│   ├── community/             # Community blog posts (MDsvex)
│   ├── enneagram-corner/      # Enneagram educational content (MDsvex)
│   ├── personality-analysis/  # Celebrity analyses (DB-driven, see below)
│   ├── pop-culture/           # Pop culture blog section (MDsvex)
│   ├── how-to-guides/         # Practical guides (MDsvex)
│   ├── enneagram-test/        # Enneagram typing quiz
│   ├── stories/               # Long-form stories (e.g., enneagram-and-mental-illness)
│   ├── book-session/          # Coaching waitlist signup
│   ├── account/               # User profile, unsubscribe
│   ├── intake/[token]/        # Token-gated consulting intake forms
│   ├── followme/              # Follow-me landing/redirect
│   ├── admin/                 # Admin panel (see table below)
│   ├── api/                   # Server endpoints (see API section)
│   ├── login/ register/       # Auth flows
│   ├── forgotPassword/ resetPassword/
│   ├── stripe/                # Stripe checkout-session + webhook
│   └── rss.xml/               # RSS feed
├── lib/
│   ├── components/
│   │   ├── atoms/             # Basic UI (Button, Modal, PopCard, etc.)
│   │   ├── molecules/         # Composite (Header, Footer, Comments, CategoryTree)
│   │   ├── blog/              # Blog-specific (callouts, layout, TOC, RelatedPosts)
│   │   ├── questions/         # Comment + search system
│   │   ├── admin/             # Admin UI widgets
│   │   ├── email/             # Email composition UI
│   │   ├── marketing/         # Marketing widgets
│   │   └── map/ charts/ icons/ notifications/
│   ├── server/                # Server-only utils (see below)
│   ├── email/                 # Email templates, sender, sequences, suppression
│   ├── analytics/             # Page analytics, attribution, visitor identity
│   ├── types/                 # TypeScript types
│   ├── validation/            # Zod schemas
│   ├── utils/                 # Shared utilities
│   ├── instagram/ posters/    # Social asset generation
│   └── socialCards/           # OG/social card rendering
├── blog/                      # Markdown content files
│   ├── community/            # Community posts
│   ├── enneagram/            # Enneagram educational content
│   ├── generational/         # Generational personality content
│   ├── guides/               # How-to guides
│   ├── historical/           # Historical figures content
│   ├── life-situations/      # Life situation perspectives
│   ├── life-style/           # Lifestyle content
│   ├── overview/             # Enneagram overview content
│   ├── people/               # Famous people (drafts only; published live in DB)
│   ├── pop-culture/          # Pop culture analysis
│   ├── situational/          # Situational content
│   └── topical/              # Topical content
├── scss/                      # Global SCSS styles
├── hooks.server.ts            # Supabase SSR client + session wiring
└── app.scss / app.html        # Global styles + document shell
```

### Key `src/lib/server/` modules

- `elasticSearch.ts` - ES client + query helpers (questions search)
- `questionSearch.ts` - Typeahead + full search for questions
- `blogSearch.ts` / `blogSearchUtils.ts` / `universalSearch.ts` - Blog + universal search
- `blogContentProcessor.ts` - Blog parsing/indexing
- `personalitySimilarity.ts` / `personalityCategoryData.ts` - Related-person ranking
- `questionCategoryTree.ts` / `questionCategoryIntro.ts` - Question category navigation
- `adminAuth.ts` / `authProtection.ts` / `contentAccessGuard.ts` - Access control
- `adminAnalytics.ts` / `cohortAnalytics.ts` / `retentionAnalytics.ts` - Analytics aggregations
- `emailSequences.ts` / `emailAdminSequences.ts` - Drip sequence logic
- `welcomeSequenceGuards.ts` / `welcomeSequenceReturns.ts` - Welcome flow guards
- `cronAuth.ts` - Cron endpoint auth (`CRON_SECRET`)
- `supabaseAdmin.ts` - Service-role Supabase client (server-only)

## Blog Categories & Loading

The header nav exposes these content sections:

| Route                   | Label                | Content Source                            |
| ----------------------- | -------------------- | ----------------------------------------- |
| `/community`            | The Takes of 9takes  | MDsvex files from `src/blog/community/`   |
| `/enneagram-corner`     | Enneagram Corner     | MDsvex files from `src/blog/enneagram/`   |
| `/how-to-guides`        | How-to Guides        | MDsvex files from `src/blog/guides/`      |
| `/pop-culture`          | Pop Culture          | MDsvex files from `src/blog/pop-culture/` |
| `/personality-analysis` | Personality Analysis | **Supabase `blogs_famous_people` table**  |

**Important**: `/personality-analysis` is the **outlier** - it loads content from the database, not MDsvex files. This enables:

- Dynamic content management via admin UI (`/admin/content-board`)
- Version history tracking (`blogs_famous_people_history`)
- Database-driven metadata and publishing workflow

All other blog routes use `import.meta.glob` to load markdown files at build time.

## Admin Panel (`/admin/*`)

| Route                                      | Purpose                                                 |
| ------------------------------------------ | ------------------------------------------------------- |
| `/admin`                                   | Dashboard - stats, charts, demo mode toggle, ES reindex |
| `/admin/analytics`                         | Site analytics and metrics                              |
| `/admin/asset-generators`                  | Hub for poster / question-print / zine generators       |
| `/admin/asset-generators/poster-generator` | Social media image generation                           |
| `/admin/asset-generators/question-print`   | Printable question cards                                |
| `/admin/asset-generators/zine-creator`     | Zine asset generator                                    |
| `/admin/blog-diff`                         | Blog content diff viewer                                |
| `/admin/categories`                        | Question category CRUD + hierarchy                      |
| `/admin/comments`                          | Comment moderation                                      |
| `/admin/consulting`                        | Coaching clients, sessions, resources                   |
| `/admin/content-board`                     | Famous people blog management (create, edit, publish)   |
| `/admin/drafts`                            | Blog draft management                                   |
| `/admin/email-dashboard`                   | Email campaign management (draft, schedule, send)       |
| `/admin/links`                             | Link management (+ map-powered `[slug]`)                |
| `/admin/marketing`                         | Marketing tools and templates                           |
| `/admin/messages`                          | Message management                                      |
| `/admin/poster-generator`                  | Legacy poster generator (prefer asset-generators)       |
| `/admin/questions`                         | Question moderation and hierarchy                       |
| `/admin/search`                            | Search index management                                 |
| `/admin/users`                             | User management                                         |
| `/admin/welcome-sequence`                  | Welcome email sequence editor                           |
| `/admin/zine-creator`                      | Zine creator (standalone)                               |

Admin access is enforced by `src/lib/server/adminAuth.ts` and layout `+layout.server.ts` guards.

## API Routes (`src/routes/api/*`)

| Path                              | Purpose                                      |
| --------------------------------- | -------------------------------------------- |
| `api/adder/`                      | Internal content/row adders                  |
| `api/admin/`                      | Admin-only endpoints                         |
| `api/analytics/`                  | Page analytics ingest + retrieval            |
| `api/blog/`                       | Blog read/write helpers                      |
| `api/blog-versions/`              | Famous-people version history                |
| `api/cron/process-sequences/`     | Cron: advance email drip sequences           |
| `api/cron/send-scheduled-emails/` | Cron: send scheduled campaign emails         |
| `api/questions/typeahead/`        | Authenticated question typeahead (ES-backed) |
| `api/questions/upload-image/`     | Question image upload                        |
| `api/search/`                     | Universal search endpoint                    |
| `api/track/`                      | Event tracking (analytics pings, etc.)       |
| `api/update-questions/`           | Webhook-auth'd question bulk update          |

Cron endpoints verify `CRON_SECRET`. The webhook endpoint verifies `PRIVATE_WEBHOOK_AUTH`.

## Key Database Tables

- `questions` / `comments` - Q&A system with nested comments
- `question_categories` / `question_category_tags` - Category tree + tag joins
- `profiles` - User profiles with Enneagram type (1-9)
- `blogs_content` - Published blogs with `search_vector` for FTS
- `blogs_famous_people` - Celebrity analyses with full metadata
- `blogs_famous_people_history` - Audit trail for celebrity blog changes
- `blog_comments` - Comments on blog posts
- `coaching_waitlist` - Consultation signup leads
- `admin_settings` - Feature flags and config (e.g., demo mode)
- `comment_likes` / `subscriptions` - Engagement features
- Email: sequence + suppression tables backing `src/lib/email/`

Migrations live in `supabase/migrations/`. Regenerate `database.types.ts` after schema changes.

## Svelte 5 Patterns (IMPORTANT)

This project uses **Svelte 5 runes**. New/edited components should use:

```svelte
<script lang="ts">
	// Props (NOT export let)
	let { data }: { data: PageData } = $props();

	// Reactive state (NOT let x = value)
	let count = $state(0);
	let items = $state<Item[]>([]);

	// Derived values (NOT $: derived)
	let total = $derived(items.length);

	// Effects (NOT $: reactive side effects)
	$effect(() => {
		console.log('count changed:', count);
	});
</script>
```

**Migration status**: Newer components (search, questions, admin) use runes. Many legacy components (Header, Footer, blog internals) still use `export let` and `$:` — migrate when touching them.

## API Route Patterns

```typescript
// src/routes/api/[resource]/+server.ts
import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, url }) => {
	const supabase = locals.supabase;

	// Use RPC functions for optimized queries
	const { data, error: err } = await supabase.rpc('get_data', { param: value });

	if (err) return json({ error: err.message }, { status: 500 });
	return json(data);
};
```

## Page Server Load Pattern

```typescript
// +page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { supabase } = event.locals;
	const session = event.locals.session;

	// Use RPC functions when combining multiple queries
	const { data } = await supabase.rpc('get_page_data', {
		/* ... */
	});

	return { data, user: session?.user ?? null };
};
```

Auth is exposed via `event.locals.session` and `event.locals.supabase` (wired in `src/hooks.server.ts`).

## Blog Content System

Blogs are MDsvex files with YAML frontmatter:

```markdown
---
title: 'Blog Title'
description: 'SEO description'
author: 'Author Name'
date: '2024-01-15'
published: true
enneagram: 5
type: ['person', 'situational']
---

Content here. Can import Svelte components:

<script>
  import QuickAnswer from '$lib/components/blog/callouts/QuickAnswer.svelte';
</script>

<QuickAnswer question="Why...?">Answer content</QuickAnswer>
```

**Blog indexing**: Run `pnpm index:blogs` (or `pnpm gen:search-index`) to sync blogs into Supabase for FTS. Use `pnpm index:blogs:dry` to preview and `pnpm index:blogs:force` to rebuild.

## Brand Guidelines

Brand docs are in `docs/brand/`:

| File                               | Purpose                                            |
| ---------------------------------- | -------------------------------------------------- |
| `README.md`                        | Quick brand reference (taglines, voice attributes) |
| `BRAND-KIT.md`                     | Brand kit (colors, logos, typography)              |
| `brand-positioning.md`             | Market positioning                                 |
| `brand-style-guide-v2.md`          | Complete voice, tone, and style guide              |
| `dj-communication-guide.md`        | Personal communication preferences for AI          |
| `9takes-style-guide-for-assets.md` | Asset-generation style reference                   |

**Key Voice Attributes**:

- **Tactically Direct** - No fluff, actionable info
- **Socially Savvy** - Connect insight to real-world wins
- **Respectfully Provocative** - Challenge comfort zones
- **Pattern-Recognition Focused** - Show emotional logic
- **Results-Driven** - Focus on outcomes

**Writing Rhythm**: Hook → Insight → Action step

**Key Verbs**: Decode, navigate, map, read, unlock, resolve

## Environment Variables

Public (browser-exposed, `$env/static/public`):

```bash
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_PUBLISHABLE_KEY=
PUBLIC_RECAPTCHA_SITE_KEY=
PUBLIC_MAPBOX_TOKEN=
PUBLIC_GOOGLE=                         # GA measurement ID
PUBLIC_ENABLE_DEV_INHOUSE_ANALYTICS=   # "true" to enable analytics in dev
```

Private (server-only, `$env/static/private`):

```bash
SUPABASE_SERVICE_KEY=                  # Supabase service role
PRIVATE_ELASTICSEARCH_NODE=
PRIVATE_ELASTIC_ADMIN=                 # ES API key
PRIVATE_OPENROUTER_API_KEY=            # LLM access via OpenRouter
PRIVATE_SIGNUP_KEY=                    # Signature/crypto key
PRIVATE_ADMIN_EMAIL=                   # Admin notification address
PRIVATE_gmail_private_key=             # Gmail API service account key
PRIVATE_GOOGLE_MAPS_API_KEY=
PRIVATE_WEBHOOK_AUTH=                  # Shared secret for update-questions webhook
CRON_SECRET=                           # Bearer for cron endpoints
RECAPTCHA_SECRET_KEY=
# Stripe keys consumed in src/routes/stripe/_stripe.ts
```

## Utility Scripts

Run via `pnpm <alias>` where available:

| Command                                         | Purpose                                    |
| ----------------------------------------------- | ------------------------------------------ |
| `pnpm gen:types`                                | Generate TS types from blog frontmatter    |
| `pnpm gen:famous-types`                         | Generate famous-people type data           |
| `pnpm gen:personality-image-map`                | Build personality → image slug map         |
| `pnpm gen:sitemap`                              | Generate XML sitemap                       |
| `pnpm gen:crosslinks`                           | Build internal cross-link report           |
| `pnpm gen:search-index`                         | Index blogs into Supabase (guarded by env) |
| `pnpm gen:all`                                  | Format + all generators + blog index       |
| `pnpm gen:instagram-plan`                       | Build Instagram posting plan               |
| `pnpm index:blogs` / `:dry` / `:force`          | Direct blog indexer (bypasses env guard)   |
| `pnpm push:people`                              | Parse + push famous-people blog drafts     |
| `pnpm supabase:normalize-personality-slugs`     | Normalize personality slugs in DB          |
| `pnpm seo:normalize-internal-personality-links` | Rewrite internal personality links         |
| `pnpm label-paths`                              | Annotate files with path comments          |

## Common Tasks

- **Add blog post**: Create `.md` in `src/blog/[category]/`, run `pnpm index:blogs`
- **Add celebrity analysis**: Use admin `/admin/content-board` (saves to `blogs_famous_people`)
- **Add API endpoint**: Create `+server.ts` in `src/routes/api/[path]/`
- **Add page**: Create `+page.svelte` and optionally `+page.server.ts`
- **Database changes**: Add migration in `supabase/migrations/`, regenerate types, update affected RPCs
- **Add cron job**: Drop a `+server.ts` under `src/routes/api/cron/`, guard with `CRON_SECRET`, register in `vercel.json`

## Testing

- **Unit tests** live alongside sources as `*.spec.ts` (see `src/lib/server/*.spec.ts`). Run with `pnpm test:unit`.
- **E2E tests** use Playwright (`pnpm test`). Page-level specs sit next to routes (e.g., `src/routes/questions/*.page.server.spec.ts`).
- Prefer server-side logic in `src/lib/server/*.ts` so it can be unit-tested without a browser.

## Important Notes

- Always use Supabase RPC functions for complex queries (reduces round trips)
- Blog search uses `search_all_blogs` RPC with Supabase FTS fallback
- Question search uses Elasticsearch; the typeahead endpoint requires an authenticated session
- Rate limiting: 5 comments per 60 seconds per fingerprint
- Auth: `event.locals.session` + `event.locals.supabase`; admin guarded by `adminAuth`
- Demo mode: Toggle via admin dashboard; read from `admin_settings`
- Personality analysis slug pages return `Cache-Control: private, no-store` because responses are personalized
- Cron endpoints **must** validate `CRON_SECRET` before doing work
