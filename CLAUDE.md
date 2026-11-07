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
pnpm build             # Production build + build-budget check
pnpm build:vercel      # Vercel build (runs image-map, corpus-stats, sitemap, llms generators first)
pnpm check             # svelte-kit sync + svelte-check type-check
pnpm check:watch       # Type-check in watch mode
pnpm lint              # Prettier + ESLint + custom lints (radius, retired color tokens, global component CSS, cross-link gate)
pnpm format            # Auto-format with Prettier
pnpm test              # Vitest unit tests, single run (*.spec.ts alongside sources)
pnpm test:unit         # Vitest in watch mode
pnpm test:smoke        # Playwright smoke tests
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
- **Runtime**: Node `^22.23.4 || ^24.22.1` (security floor for CVE-2026-111497; pnpm refuses older), pnpm 11.7.0. Vercel functions run `nodejs22.x`, Vercel builds run 24.x, CI uses `.nvmrc`

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
- `adminAnalytics.ts` / `retentionAnalytics.ts` - Analytics aggregations
- `apiRateLimit.ts` - Per-subject API rate limiting (backed by `api_rate_limit_events`)
- `nineTakes.ts` / `nineTakesGenerator.ts` / `nineTakesVoices.ts` - Per-type AI takes generation
- `giveFirstFunnel.ts` - Give-first funnel event recording
- `emailSequences.ts` / `emailAdminSequences.ts` - Drip sequence logic
- `welcomeSequenceGuards.ts` / `welcomeSequenceReturns.ts` - Welcome flow guards
- `reactivationCandidates.ts` / `reactivationRepermission.ts` - Reactivation sequence logic
- `replyNotificationDelivery.ts` / `replyNotificationReturn.ts` - Reply-notification emails
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
| `/admin/enneagram-campaign`                | Enneagram-type-targeted email campaign builder          |
| `/admin/links`                             | Link management (+ map-powered `[slug]`)                |
| `/admin/marketing`                         | Marketing tools and templates                           |
| `/admin/messages`                          | Message management                                      |
| `/admin/poster-generator`                  | Legacy poster generator (prefer asset-generators)       |
| `/admin/question-distribution`             | Question distribution review/tools                      |
| `/admin/questions`                         | Question moderation and hierarchy                       |
| `/admin/reactivation-sequence`             | Reactivation email sequence editor                      |
| `/admin/search`                            | Search index management                                 |
| `/admin/transactional-emails`              | Transactional template preview + ad-hoc admin sends     |
| `/admin/users`                             | User management                                         |
| `/admin/welcome-sequence`                  | Welcome email sequence editor                           |
| `/admin/zine-creator`                      | Zine creator (standalone)                               |

Admin access is enforced by `src/lib/server/adminAuth.ts` and layout `+layout.server.ts` guards.

## API Routes (`src/routes/api/*`)

| Path                                    | Purpose                                        |
| --------------------------------------- | ---------------------------------------------- |
| `api/adder/`                            | Internal content/row adders                    |
| `api/admin/`                            | Admin-only endpoints                           |
| `api/analytics/`                        | Page analytics ingest + retrieval              |
| `api/auth-shell/`                       | Client auth-shell state (user + admin flag)    |
| `api/blog/`                             | Blog read/write helpers                        |
| `api/blog-versions/`                    | Famous-people version history                  |
| `api/cron/process-reply-notifications/` | Cron: deliver reply-notification emails        |
| `api/cron/process-sequences/`           | Cron: advance email drip sequences             |
| `api/cron/send-scheduled-emails/`       | Cron: send scheduled campaign emails           |
| `api/cron/tag-chorus-questions/`        | Cron: async tagging for chorus questions       |
| `api/email/re-permission/`              | Reactivation re-permission yes/no links        |
| `api/nine/mirror/`                      | Chorus mirror endpoint (nine takes)            |
| `api/notifications/`                    | Notification read/unread state                 |
| `api/person-suggestions/`               | Public POST: famous-person suggestions         |
| `api/questions/typeahead/`              | Authenticated question typeahead (ES-backed)   |
| `api/questions/upload-image/`           | Question image upload                          |
| `api/reply-notifications/`              | Reply-notification return + unsubscribe links  |
| `api/search/`                           | Universal search endpoint                      |
| `api/signups/`                          | Public POST: waitlist/email signups            |
| `api/track/`                            | Event tracking (analytics pings, etc.)         |
| `api/transcribe/`                       | Audio transcription (OpenRouter, rate-limited) |
| `api/update-questions/`                 | Webhook-auth'd question bulk update            |

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

**Runes mode is forced** (`compilerOptions.runes` in `svelte.config.js`, migration finished 2026-11-01). Every component except mdsvex markdown and `node_modules` compiles in runes mode, so Svelte 4 syntax (`export let`, `$:`, `<slot>`, `on:click`, `createEventDispatcher`, `$app/stores`) fails the build. Before editing Svelte, load the official skills in `.claude/skills/` (`svelte-core-bestpractices`, `svelte-code-writer`; vendored from sveltejs/ai-tools, don't edit them) and run `npx @sveltejs/mcp svelte-autofixer <file> --svelte-version 5.57.1` on what you touched. House rules:

- `$derived` instead of an `$effect` that sets state. Deriveds are writable, which covers optimistic updates and local edits. Effects only sync with things outside Svelte (DOM APIs, timers, storage, analytics, fetch).
- Attachments (`{@attach}`, factories in `src/lib/attachments/`) instead of `use:` actions. `use:enhance` stays.
- Snippets + `children` instead of slots; callback props (`onselect`) instead of dispatched events.
- `$app/state` instead of `$app/stores`; `createContext` instead of string-keyed `setContext`/`getContext`; shared state in `.svelte.ts` classes (e.g. `authShell.svelte.ts`, `stores/theme.svelte.ts`) instead of stores.
- Every `{#each}` is keyed with a unique key (Svelte 5 throws on duplicate keys in production too); reactive collections use `SvelteMap`/`SvelteSet`/`SvelteDate`.
- Multi-code ignores need commas: `<!-- svelte-ignore a11y_x, a11y_y -->` (space-separated silently keeps only the first).
- Components used inside markdown posts (callouts, `MarqueeHorizontal`, `Carousel`, …) take plain props + `children` only, because markdown stays in legacy mode.
- ESLint enforces the recommended Svelte rules (`eslint.config.js` says which few stay off and why).

## Server Patterns

API routes (`+server.ts`) and page loads (`+page.server.ts`) share the same conventions:

- Auth comes from `event.locals.session` and `event.locals.supabase` (wired in `src/hooks.server.ts`).
- Use Supabase RPC functions when a query combines multiple tables/queries (reduces round trips).
- API handlers return `json(data)` / `json({ error }, { status })` from `@sveltejs/kit`.

```typescript
// +page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { supabase, session } = event.locals;
	const { data } = await supabase.rpc('get_page_data', {/* ... */});
	return { data, user: session?.user ?? null };
};
```

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

**Component gotcha:** MDsvex does not process markdown inside a one-paragraph component block (no blank lines between `<QuickAnswer>`/`<Callout>`/`<InsightBox>` and its closing tag): `**bold**` and `[links](/x)` render as literal characters. Use HTML there (`<strong>`, `<a href="/x">`). `pnpm crosslinks:check` fails on it.

**Blog indexing**: Run `pnpm index:blogs` (or `pnpm gen:search-index`) to sync blogs into Supabase for FTS. Use `pnpm index:blogs:dry` to preview and `pnpm index:blogs:force` to rebuild.

## Brand Guidelines

Brand docs are in `docs/brand/`:

| File                               | Purpose                                                                    |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `brand-assets.md`                  | **Generated brand kit (lines, look, files, social specs); `/admin/brand`** |
| `messaging-hierarchy.md`           | **Canonical frozen message hierarchy; read first**                         |
| `cold-light.md`                    | **Canonical visual identity (Cold Light, 2026-11-05)**                     |
| `README.md`                        | Quick brand reference (taglines, voice attributes)                         |
| `BRAND-KIT.md`                     | Brand kit (colors, logos, typography)                                      |
| `brand-positioning.md`             | Market positioning                                                         |
| `brand-style-guide-v2.md`          | Complete voice, tone, and style guide                                      |
| `dj-communication-guide.md`        | Personal communication preferences for AI                                  |
| `9takes-style-guide-for-assets.md` | Asset-generation style reference                                           |

**Key Voice Attributes**:

- **Tactically Direct** - No fluff, actionable info
- **Socially Savvy** - Connect insight to real-world wins
- **Respectfully Provocative** - Challenge comfort zones
- **Pattern-Recognition Focused** - Show emotional logic
- **Results-Driven** - Focus on outcomes

**Canonical message hierarchy (locked 2026-08-13; core formula added 2026-11-05):**

1. Movement belief: "The internet collapses nine perspectives into one winning take."
2. Brand promise: "See the emotions behind every take."
3. Product ritual: "Answer before the crowd."
4. Product explanation: "One question, nine perspectives."
5. Personal payoff: "Stop mistaking someone else's alarm for a defect."
6. Core formula: "Honesty + Curiosity = Clarity."

Do not invent or promote a new master concept unless DJ explicitly replaces or adds a level.
Treat existing names such as The Chorus, The Mirror Moment, One Take, and Cold Light (the visual world) as
supporting vocabulary or format/design labels.

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
PUBLIC_POSTHOG_KEY=                    # PostHog project token (phc_*)
PUBLIC_POSTHOG_HOST=                   # PostHog ingest host (default https://us.i.posthog.com)
PUBLIC_POSTHOG_ENABLE_IN_DEV=          # "true" to load PostHog in dev (default false)
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

| Command                                             | Purpose                                                                |
| --------------------------------------------------- | ---------------------------------------------------------------------- |
| `pnpm gen:types`                                    | Generate TS types from blog frontmatter                                |
| `pnpm gen:famous-types`                             | Generate famous-people type data                                       |
| `pnpm gen:personality-image-map`                    | Build personality → image slug map                                     |
| `pnpm gen:sitemap`                                  | Generate XML sitemap                                                   |
| `pnpm gen:llms`                                     | Generate llms.txt                                                      |
| `pnpm gen:corpus-stats`                             | Generate corpus stats                                                  |
| `pnpm gen:crosslinks`                               | Cross-link report + link queue for blogs + people (`docs/crosslinks/`) |
| `pnpm gen:crosslinks -- --target <url>`             | Sentences in live posts that mention a page but don't link it yet      |
| `pnpm crosslinks:check`                             | Publish gate: live posts need 3+ in / 3+ out links, no broken links    |
| `pnpm audit:links:jev`                              | Jev-judged link audit → `docs/crosslinks/jev-audit.md` (~$0.77/run)    |
| `pnpm gen:search-index`                             | Index blogs into Supabase (guarded by env)                             |
| `pnpm gen:all`                                      | Format + all generators + blog index                                   |
| `pnpm gen:chorus` / `:force`                        | Generate chorus content                                                |
| `pnpm gen:instagram-plan`                           | Build Instagram posting plan                                           |
| `pnpm marketing:queue`                              | Check marketing content queue                                          |
| `pnpm index:blogs` / `:dry` / `:force`              | Direct blog indexer (bypasses env guard)                               |
| `pnpm push:people`                                  | Atomically sync all local people drafts; insert missing unpublished    |
| `pnpm push:people -- <Person> --sync`               | Atomically sync one reviewed existing people draft                     |
| `pnpm push:people -- --insert-missing`              | Insert missing drafts without updating existing rows                   |
| `pnpm audit:cluster-tags`                           | Published people with no cluster (lane) tag for their field            |
| `pnpm audit:corner-subtopics`                       | Enneagram Corner lane counts per section; fails on untagged live posts |
| `pnpm tag:clusters -- tags.json [--write]`          | Add cluster tags to drafts (`{"Draft-Stem": "pop-star"}`)              |
| `pnpm push:cluster-tags [--write --backup=f]`       | Push draft cluster tags live (`type` is protected from `push:people`)  |
| `pnpm regen:takes`                                  | Regenerate per-type AI takes (comments_ai)                             |
| `pnpm portrait:check`                               | Preflight personality portrait assets                                  |
| `pnpm audit:people-seo` / `audit:people-corpus`     | People SEO / corpus audits                                             |
| `pnpm audit:blog-enrichment`                        | Blog enrichment status report                                          |
| `pnpm audit:superlatives`                           | Pages ranking for 'which type is most X' searches they never answer    |
| `pnpm audit:readability`                            | Paragraph shape + voice tics, worst first (`-- <file>` for one post)   |
| `pnpm audit:generic`                                | Sentences that could sit in any post, by section (`-- --serve` = page) |
| `pnpm gate:entities "Name" ...`                     | Wikipedia gate + autocomplete bio-intent probe for entity-gap scouting |
| `pnpm supabase:normalize-personality-slugs`         | Normalize personality slugs in DB                                      |
| `pnpm seo:normalize-internal-personality-links`     | Rewrite internal personality links                                     |
| `pnpm label-paths`                                  | Annotate files with path comments                                      |
| `node scripts/blog-image-variants.mjs <slug> <img>` | Build blog image variant set from a ChatGPT-generated image (free)     |
| `pnpm brand:card -- --list` / `--preset <id>`       | Render on-brand IG/X/OG cards (statement, question, person, slide)     |
| `pnpm gen:brand-og`                                 | Re-render every link-preview card into `static/brand/og/`              |
| `pnpm gen:brand-kit`                                | Regenerate `docs/brand/brand-assets.md` from `src/lib/brand/`          |

## Common Tasks

- **Add blog post**: Create `.md` in `src/blog/[category]/`, run `pnpm index:blogs`. Enneagram Corner posts also need `subtopics: [...]` (lane slugs from `src/lib/data/enneagramCornerTaxonomy.js`; a slug from another section cross-lists the post there) or `pnpm test` fails. Once `published: true`, give it 3+ outbound and 3+ inbound links (`pnpm gen:crosslinks -- --target <url>`) or `pnpm crosslinks:check` (lint + CI) fails. `/crosslink-queue` works the link queue weekly.
- **Brand assets, social cards, link previews**: the brand kit lives in `src/lib/brand/` (data) and renders at `/admin/brand` (DJ) and `docs/brand/brand-assets.md` (agents, via `pnpm gen:brand-kit`). Make IG/X/OG images with `pnpm brand:card` (same renderer as the site's og:images, `src/lib/server/brandCards/renderBrandCard.ts`); never with an image model. Page og:images use `ogImageUrl('<preset>')` from `src/lib/brand/brandCardPresets.ts`; change copy there, then `pnpm gen:brand-og`.
- **Add celebrity analysis**: Use admin `/admin/content-board` (saves to `blogs_famous_people`)
- **Any image (blog hero, carousel, social)**: agents NEVER generate images (DJ's rule, 2026-10-04; one OpenRouter run cost ~$7). That means no OpenRouter, no `gemini-imagegen` / Gemini API, no Canva AI generate, no other paid image API, and no driving ChatGPT in the browser. Write the finished prompt to the Cold Light statue spec (dry matte weathered grey Greek marble, blank carved eyes, one light from the upper left, black background, restrained expression, no text, no warm light; the indigo tint ramp is applied afterward with sharp, so prompts ask for neutral grey stone; see `docs/brand/cold-light.md`) and hand it to DJ; he runs it himself in a separate ChatGPT chat on his subscription. For a blog hero, once he saves the file, `node scripts/blog-image-variants.mjs <slug> <image>` builds the variant set and you set `pic: '<slug>'`. Subagent prompts must restate this rule.
- **Transcribe audio/video (podcasts, interviews)**: use `whisper-cli` with the local models in `~/.cache/hyperframes/whisper/models/` (`ggml-small.en.bin` is fast, `ggml-medium.en.bin` more accurate). Convert first, then transcribe: `ffmpeg -i in.mp3 -ar 16000 -ac 1 clip.wav && whisper-cli -m ~/.cache/hyperframes/whisper/models/ggml-small.en.bin -f clip.wav -otxt -of clip -np` (a 90-second clip takes about 3 seconds). Never search the whole disk or home folder for models or files (`find /`, `find ~`); a global hook blocks it because it sets off macOS permission prompts on the unattended runs.
- **Add API endpoint**: Create `+server.ts` in `src/routes/api/[path]/`
- **Add page**: Create `+page.svelte` and optionally `+page.server.ts`
- **Database changes**: Add migration in `supabase/migrations/`, regenerate types, update affected RPCs
- **Add cron job**: Drop a `+server.ts` under `src/routes/api/cron/`, guard with `CRON_SECRET`, register in `vercel.json`

## Testing

- **Unit tests** live alongside sources as `*.spec.ts` (see `src/lib/server/*.spec.ts`). Run with `pnpm test` (single run) or `pnpm test:unit` (watch). Page-level specs sit next to routes (e.g., `src/routes/questions/*.page.server.spec.ts`).
- **Smoke tests** use Playwright: `pnpm test:smoke`.
- Prefer server-side logic in `src/lib/server/*.ts` so it can be unit-tested without a browser.

## Important Notes

- Blog search uses `search_all_blogs` RPC with Supabase FTS fallback
- Question search uses Elasticsearch; the typeahead endpoint requires an authenticated session
- Rate limiting: 5 comments per 60 seconds per fingerprint
- Auth: `event.locals.session` + `event.locals.supabase`; admin guarded by `adminAuth`
- Demo mode: Toggle via admin dashboard; read from `admin_settings`
- Personality analysis slug pages return `Cache-Control: private, no-store` because responses are personalized
- Cron endpoints **must** validate `CRON_SECRET` before doing work
