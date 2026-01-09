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

## Commands

```bash
pnpm dev          # Start dev server (port 5173)
pnpm build        # Production build
pnpm check        # TypeScript/Svelte type-check
pnpm lint         # Lint (Prettier + ESLint)
pnpm format       # Auto-format code
pnpm test         # Playwright E2E tests
pnpm test:unit    # Vitest unit tests
```

## Tech Stack

- **Framework**: SvelteKit 2.x + Svelte 5 (with runes)
- **Database**: Supabase (PostgreSQL)
- **Styling**: TailwindCSS + SCSS
- **Content**: MDsvex for Markdown blogs
- **Search**: Elasticsearch (questions), Supabase FTS (blogs)
- **UI**: Flowbite-Svelte
- **Deploy**: Vercel

## Project Structure

```
src/
├── routes/
│   ├── questions/             # Q&A platform core
│   ├── community/             # Community blog posts
│   ├── enneagram-corner/      # Enneagram educational content
│   ├── personality-analysis/  # Celebrity analyses (DB-driven)
│   ├── how-to-guides/         # Practical guides
│   ├── book-session/          # Coaching waitlist signup
│   ├── admin/                 # Admin panel
│   └── api/                   # Server endpoints
├── lib/
│   ├── components/
│   │   ├── atoms/             # Basic UI (Button, Modal, etc.)
│   │   ├── molecules/         # Complex components (Header, etc.)
│   │   ├── blog/              # Blog-specific (callouts, layout)
│   │   └── questions/         # Comment system components
│   ├── server/                # Server-only utils (ES, blog processor)
│   ├── types/                 # TypeScript types
│   ├── validation/            # Zod schemas
│   └── utils/                 # Shared utilities
├── blog/                      # Markdown content files
│   ├── enneagram/            # Enneagram educational content
│   ├── community/            # Community posts
│   ├── guides/               # How-to guides
│   └── people/               # Famous people (drafts only)
└── scss/                      # Global SCSS styles
```

## Blog Categories & Loading

The site has 4 main blog sections (visible in header nav):

| Route                   | Label                | Content Source                           |
| ----------------------- | -------------------- | ---------------------------------------- |
| `/community`            | The Takes of 9takes  | MDsvex files from `src/blog/community/`  |
| `/enneagram-corner`     | Enneagram Corner     | MDsvex files from `src/blog/enneagram/`  |
| `/how-to-guides`        | How-to Guides        | MDsvex files from `src/blog/guides/`     |
| `/personality-analysis` | Personality Analysis | **Supabase `blogs_famous_people` table** |

**Important**: `/personality-analysis` is the **outlier** - it loads content from the database, not MDsvex files. This enables:

- Dynamic content management via admin UI
- Version history tracking (`blogs_famous_people_history`)
- Database-driven metadata and publishing workflow

All other blog routes use `import.meta.glob` to load markdown files at build time.

## Admin Panel (`/admin/*`)

| Route                     | Purpose                                                 |
| ------------------------- | ------------------------------------------------------- |
| `/admin`                  | Dashboard - stats, charts, demo mode toggle, ES reindex |
| `/admin/content-board`    | Famous people blog management (create, edit, publish)   |
| `/admin/email-dashboard`  | Email campaign management (draft, schedule, send)       |
| `/admin/marketing`        | Marketing tools and templates                           |
| `/admin/consulting`       | Coaching management (clients, sessions, resources)      |
| `/admin/questions`        | Question moderation and hierarchy                       |
| `/admin/comments`         | Comment moderation                                      |
| `/admin/users`            | User management                                         |
| `/admin/drafts`           | Blog draft management                                   |
| `/admin/search`           | Search index management                                 |
| `/admin/poster-generator` | Social media image generation                           |

## Key Database Tables

- `questions` / `comments` - Q&A system with nested comments
- `profiles` - User profiles with Enneagram type (1-9)
- `blogs_content` - Published blogs with search_vector for FTS
- `blogs_famous_people` - Celebrity analyses with full metadata
- `blogs_famous_people_history` - Audit trail for celebrity blog changes
- `coaching_waitlist` - Consultation signup leads
- `admin_settings` - Feature flags and config
- `comment_likes` / `subscriptions` - Engagement features

## Svelte 5 Patterns (IMPORTANT)

This project uses **Svelte 5 runes**. Use these patterns:

```svelte
<script lang="ts">
	// Props (NOT export let)
	let { data }: { data: PageData } = $props();

	// Reactive state (NOT let x = value)
	let count = $state(0);
	let items = $state<Item[]>([]);

	// Derived/effects (NOT $: reactive)
	$effect(() => {
		console.log('count changed:', count);
	});
</script>
```

**Note**: Some legacy components still use `export let` and `$:` - migrate when touching them.

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
  const { supabase, safeGetSession } = event.locals;
  const { session, user } = await safeGetSession();

  // Use RPC functions when combining multiple queries
  const { data } = await supabase.rpc('get_page_data', { ... });

  return { data, user };
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

**Blog indexing**: Run `node scripts/index-blogs-to-supabase.js` to sync blogs to database for search.

## Brand Guidelines

Brand docs are in `docs/brand/`:

| File                        | Purpose                                            |
| --------------------------- | -------------------------------------------------- |
| `README.md`                 | Quick brand reference (taglines, voice attributes) |
| `brand-style-guide-v2.md`   | Complete voice, tone, and style guide              |
| `dj-communication-guide.md` | Personal communication preferences for AI          |

**Key Voice Attributes**:

- **Tactically Direct** - No fluff, actionable info
- **Socially Savvy** - Connect insight to real-world wins
- **Respectfully Provocative** - Challenge comfort zones
- **Pattern-Recognition Focused** - Show emotional logic
- **Results-Driven** - Focus on outcomes

**Writing Rhythm**: Hook → Insight → Action step

**Key Verbs**: Decode, navigate, map, read, unlock, resolve

## Environment Variables

```bash
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_KEY=
ELASTIC_NODE=
ELASTIC_API_KEY=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
```

## Utility Scripts

```bash
node scripts/generate-types.js           # Generate TS types from blog frontmatter
node scripts/generate-famous-types.js    # Generate famous people type data
node scripts/generate-sitemap.js         # Generate XML sitemap
node scripts/index-blogs-to-supabase.js  # Index blogs for search
```

## Common Tasks

- **Add blog post**: Create `.md` file in `src/blog/[category]/`, run index script
- **Add celebrity analysis**: Use admin content-board UI (saves to `blogs_famous_people`)
- **Add API endpoint**: Create `+server.ts` in `src/routes/api/[path]/`
- **Add page**: Create `+page.svelte` and optionally `+page.server.ts`
- **Database changes**: Update RPC functions in Supabase, regenerate types

## Important Notes

- Always use Supabase RPC functions for complex queries (reduces round trips)
- Blog search uses `search_all_blogs` RPC with Supabase FTS fallback
- Question search uses Elasticsearch
- Rate limiting: 5 comments per 60 seconds per fingerprint
- Auth: Access session via `event.locals.safeGetSession()`
- Demo mode: Toggle via admin dashboard for multi-tenant testing
