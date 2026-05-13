<!-- docs/development/select-star-audit-2026-05-12.md -->

# Select Star Query Audit - 2026-05-12

## Scope

Audited active query code in `src`, operational scripts in `scripts`, and SQL migrations in `supabase/migrations` for:

- Supabase `.select('*')`
- Supabase relation expansions that include `*`, such as `question_categories(*)`
- Empty Supabase `.select()` calls, which return all columns after inserts/updates
- Raw SQL `SELECT *`

Excluded non-query selector APIs such as D3 DOM selection.

## Initial Findings

- Active app code: about 130 Supabase `*` or empty `.select()` call sites.
- Operational scripts: 5 Supabase `*` call sites.
- Migrations: 28 raw SQL `SELECT *` references, mostly CTE/union return-shape SQL or comments.
- Highest-risk tables: `comments`, `questions`, `blogs_famous_people`, `email_sends`, `email_drafts`, `scheduled_emails`, consulting tables with long notes/content fields.

## Priority Backlog

### P0 - Public Payload / Privacy Risk

- [x] Replace public `comments.*` queries with explicit safe fields.
  - `src/routes/questions/[slug]/+page.server.ts`
  - `src/routes/comments/+server.ts`
  - Rationale: current payloads can expose `ip`, `fingerprint`, and indexing fields.
- [x] Replace question-page count queries that fetch row payloads with `head: true`.
  - `src/routes/questions/[slug]/+page.server.ts`
  - `src/routes/admin/comments/+page.server.ts`

### P1 - Heavy Public / Build-Time Fetches

- [x] Replace list/sitemap `blogs_famous_people.*` with metadata-only fields.
  - `src/lib/getPosts.ts`
  - `scripts/generate-sitemap.js`
- [x] Review personality page detail fetch.
  - `src/routes/personality-analysis/[slug]/+page.server.ts`
  - Rationale: detail page needs `content`, but likely not every JSON/array/search field.
  - Result: detail keeps content/SEO/schema fields and drops search vector / JSON-LD snippet / content quality fields.

### P1 - Admin Hot Paths

- [x] Replace admin reindex `questions.*` and `blogs_famous_people.*` with indexer-specific fields.
  - `src/routes/admin/+page.server.ts`
- [x] Replace content board list fetches with exact metadata fields.
  - `src/routes/admin/content-board/+page.server.ts`
- [x] Replace content analytics full blog fetch with analytic-specific fields.
  - `src/routes/api/admin/content/analytics/+server.ts`
- [x] Replace users/signups admin list `*` fetches with exact fields.
  - `src/routes/users/+page.server.ts`
  - `src/routes/admin/users/+page.server.ts`
  - `src/routes/email/+page.server.ts`
  - `src/routes/account/unsubscribe/+page.server.ts`

### P1 - Email Dashboard Payloads

- [x] Replace email list endpoints with metadata-only fields.
  - `src/routes/admin/email-dashboard/+page.server.ts`
  - `src/routes/api/admin/email-dashboard/drafts/+server.ts`
  - `src/routes/api/admin/email-dashboard/sent/+server.ts`
  - `src/routes/api/admin/email-dashboard/schedule/+server.ts`
- [x] Keep detail endpoints explicit, even when they need HTML bodies.
  - `src/routes/api/admin/email-dashboard/sent/[id]/+server.ts`
  - `src/routes/api/admin/email-dashboard/drafts/[id]/+server.ts`
  - Result: draft HTML is fetched on edit, not in draft list payloads. Scheduled list payloads omit `html_content`. Sent list payloads omit email body fields.

### P2 - Insert/Update Returning All Columns

- [ ] Replace empty `.select()` after insert/update with exact return fields.
  - `src/routes/questions/create/+page.server.ts`
  - `src/routes/admin/+page.server.ts` partially done for admin settings toggle
  - `src/routes/admin/marketing/+page.server.ts`
  - `src/routes/admin/content-board/+page.server.ts` done
  - `src/routes/admin/links/[slug]/+page.server.ts`
  - `src/routes/admin/consulting/**/*.server.ts`
  - `src/routes/api/admin/**/*.ts` partially done for email dashboard drafts/schedule

### P2 - Nested Relation Expansions

- [ ] Replace relation `(*)` expansions on admin and consulting pages with exact relation fields.
  - `src/routes/admin/questions/+page.server.ts`
  - `src/routes/admin/questions/hierarchy/+page.server.ts`
  - `src/routes/admin/links/+page.server.ts`
  - `src/routes/admin/links/[slug]/+page.server.ts`
  - `src/routes/admin/consulting/**/*.server.ts`

### P3 - Operational Scripts

- [ ] Replace script full-table blog fetches where possible.
  - `scripts/fixjsonld.js`
  - `scripts/link-blogs.js`
  - `scripts/link-blogs-undo.js`
  - `scripts/generate-sitemap.js` done

### P3 - Migrations / Docs

- [ ] Leave migration `SELECT *` alone unless changing the migration for other reasons.
  - Most are historical migrations or intentional CTE shape forwarding.
  - Future migrations should prefer explicit column lists.

## Current Scan Snapshot

- Remaining focused direct scan matches in active `src`/`scripts`: 47 exact `select('*')` / empty `.select()` query hits after this pass, plus one non-query comment hit.
- Remaining app hotspots are mostly P2/P3: admin relation expansions, consulting pages, marketing admin writes, content editor detail endpoints, and operational scripts.
- Migration `SELECT *`/`COUNT(*)` hits were intentionally left untouched.

## Consumer Verification

- Question page consumers were checked against the narrowed `questions`, comments, links, tags, likes, subscriptions, flag reasons, and AI comment payloads. `+page.svelte`, `QuestionContent`, `Comments`, `Comment`, and `Links` only use fields still selected.
- Email dashboard consumers were checked against the list/detail split. Draft list rows no longer include `html_content`; the editor fetches `/api/admin/email-dashboard/drafts/[id]` before editing. Sent list rows omit email bodies; the sent detail endpoint still returns body fields for preview.
- Content board consumers were checked against the metadata list payloads. Cards and filters use selected fields; full content editing still uses the explicit detail endpoint path.
- Personality analysis consumers were checked for index, type, detail, comments, related posts, and RSS. Blog comment creation now returns only public fields, and DB-backed people posts now set `rssDate` and `rssUpdateDate` for `rss.xml`.
- Account/users/unsubscribe/email consumers were checked against narrowed profile/signup fields and still have the fields used by the pages and actions.

## Progress Log

- 2026-05-12: Created audit tracker from repo scan.
- 2026-05-12: Fixed P0 public comment payload queries and count-only comment queries. Also tightened adjacent question-page helper selects for tags, links, flag reasons, AI comments, likes, subscriptions, and demo comment insert returns.
- 2026-05-12: Fixed P1 `blogs_famous_people` overfetch in RSS/sitemap, personality detail, admin reindex, content board, and content analytics paths.
- 2026-05-12: Fixed public personality-page blog comment payload to omit `ip` and `fingerprint`.
- 2026-05-12: Fixed P1 users/signups and email dashboard list payloads. Draft HTML now loads from the draft detail endpoint only when editing; sent email HTML stays on the explicit detail endpoint.
- 2026-05-12: Started P2 returning-select cleanup in admin settings, content board stage updates, and email dashboard draft/schedule writes.
- 2026-05-12: Verified with `pnpm run check`: 0 errors, 140 pre-existing Svelte warnings remain.
- 2026-05-12: Double-checked frontend/API consumers for narrowed payloads. Fixed personality-analysis blog comment create returns to omit `ip` and `fingerprint`, fixed RSS dates for DB-backed people posts, and re-ran `pnpm run check`: 0 errors, 140 pre-existing Svelte warnings remain.
