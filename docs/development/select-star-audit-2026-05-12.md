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

- [ ] Replace public `comments.*` queries with explicit safe fields.
  - `src/routes/questions/[slug]/+page.server.ts`
  - `src/routes/comments/+server.ts`
  - Rationale: current payloads can expose `ip`, `fingerprint`, and indexing fields.
- [ ] Replace question-page count queries that fetch row payloads with `head: true`.
  - `src/routes/questions/[slug]/+page.server.ts`
  - `src/routes/admin/comments/+page.server.ts`

### P1 - Heavy Public / Build-Time Fetches

- [ ] Replace list/sitemap `blogs_famous_people.*` with metadata-only fields.
  - `src/lib/getPosts.ts`
  - `scripts/generate-sitemap.js`
- [ ] Review personality page detail fetch.
  - `src/routes/personality-analysis/[slug]/+page.server.ts`
  - Rationale: detail page needs `content`, but likely not every JSON/array/search field.

### P1 - Admin Hot Paths

- [ ] Replace admin reindex `questions.*` and `blogs_famous_people.*` with indexer-specific fields.
  - `src/routes/admin/+page.server.ts`
- [ ] Replace content board list fetches with exact metadata fields.
  - `src/routes/admin/content-board/+page.server.ts`
- [ ] Replace content analytics full blog fetch with analytic-specific fields.
  - `src/routes/api/admin/content/analytics/+server.ts`
- [ ] Replace users/signups admin list `*` fetches with exact fields.
  - `src/routes/users/+page.server.ts`
  - `src/routes/admin/users/+page.server.ts`
  - `src/routes/email/+page.server.ts`
  - `src/routes/account/unsubscribe/+page.server.ts`

### P1 - Email Dashboard Payloads

- [ ] Replace email list endpoints with metadata-only fields.
  - `src/routes/admin/email-dashboard/+page.server.ts`
  - `src/routes/api/admin/email-dashboard/drafts/+server.ts`
  - `src/routes/api/admin/email-dashboard/sent/+server.ts`
  - `src/routes/api/admin/email-dashboard/schedule/+server.ts`
- [ ] Keep detail endpoints explicit, even when they need HTML bodies.
  - `src/routes/api/admin/email-dashboard/sent/[id]/+server.ts`
  - `src/routes/api/admin/email-dashboard/drafts/[id]/+server.ts`

### P2 - Insert/Update Returning All Columns

- [ ] Replace empty `.select()` after insert/update with exact return fields.
  - `src/routes/questions/create/+page.server.ts`
  - `src/routes/admin/+page.server.ts`
  - `src/routes/admin/marketing/+page.server.ts`
  - `src/routes/admin/content-board/+page.server.ts`
  - `src/routes/admin/links/[slug]/+page.server.ts`
  - `src/routes/admin/consulting/**/*.server.ts`
  - `src/routes/api/admin/**/*.ts`

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
  - `scripts/generate-sitemap.js`

### P3 - Migrations / Docs

- [ ] Leave migration `SELECT *` alone unless changing the migration for other reasons.
  - Most are historical migrations or intentional CTE shape forwarding.
  - Future migrations should prefer explicit column lists.

## Progress Log

- 2026-05-12: Created audit tracker from repo scan. No query fixes applied yet.
