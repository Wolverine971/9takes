<!-- docs/design/hyperplexed/ADMIN_SURFACES_AUDIT_2026-07-09.md -->

# Admin Surfaces Audit — 2026-07-09

> Full code, query, responsiveness, accessibility, and operational audit of the 9takes admin area.
> This document is the implementation backlog and status log for the work that follows.

## Executive Summary

The admin area has a solid visual foundation and a passing test/type-check baseline, but it is not yet
"clean and done." The highest-risk gaps are independent authorization for server actions,
non-transactional multi-write workflows, and request-bound bulk operations. The largest long-term
maintenance risks are unbounded queries and several multi-thousand-line admin components.

The implementation order is:

1. P0 authorization, transactional integrity, job safety, and HTML-preview isolation.
2. P1 query accuracy, pagination, failure visibility, and analytics request correctness.
3. P2 responsive, accessibility, navigation, modal, and component-boundary cleanup.

## Scope Reviewed

- The shared `/admin` layout and dashboard.
- Analytics, users, questions, categories, comments, messages, search, content board, drafts,
  marketing, links, and asset generators.
- Consulting dashboards, clients, sessions, resources, and intake-related actions.
- Email dashboard, welcome sequence, reactivation sequence, bulk recipient, scheduling, and send APIs.
- Admin page loads, form actions, admin API handlers, Supabase queries/RPCs, and Elasticsearch reindexing.
- Existing V5, mobile, admin-style, and Hyperplexed audit documentation.

## Baseline Verification

Run on 2026-07-09 before implementation:

- `pnpm check`: 0 errors, 137 warnings in 43 files.
- `pnpm test`: 73 test files and 316 tests passed.
- Admin-only ESLint: passed.
- `pnpm lint:radius`: passed with 0 violations.
- Protected browser verification: blocked at the expected `/login` redirect because no authenticated
  local admin session was available. Desktop/mobile live screenshots remain owed.

## P0 — Stop-the-Line Fixes

### P0.1 Canonical authorization for every admin action — `new P?`

**Status:** Shipped in working tree on 2026-07-09.

Admin layout loads are not authorization middleware for direct form-action POSTs. Every admin action
must independently call the canonical `requireAdmin()` guard before it reads or mutates admin data.

Initial affected modules:

- `src/routes/admin/content-board/+page.server.ts`
- `src/routes/admin/marketing/+page.server.ts`
- `src/routes/admin/consulting/+page.server.ts`
- `src/routes/admin/consulting/clients/+page.server.ts`
- `src/routes/admin/consulting/clients/[id]/+page.server.ts`
- `src/routes/admin/consulting/sessions/[id]/+page.server.ts`
- `src/routes/admin/asset-generators/zine-creator/+page.server.ts`

**Definition of done:**

- [x] One reusable action wrapper delegates to `requireAdmin()`.
- [x] Every affected action module uses the wrapper.
- [x] Tests prove unauthenticated and non-admin requests cannot invoke the wrapped handler.
- [x] Admin requests still receive the original action result.

### P0.2 Real database transactions for multi-write workflows — `new P?`

**Status:** Not started.

Sequential Supabase calls can partially succeed and leave inconsistent state. Priority conversions:

- Comment remove/unflag plus parent-count updates.
- Consulting intake creation/status updates and session completion/notes.
- Consulting session numbering, which currently uses `count + 1` and is race-prone.
- Waitlist promotion, which currently performs check-then-insert by email.
- Content-board select-then-update/insert stage changes.
- Marketing campaign date shifts across multiple content rows.

**Definition of done:** Postgres RPCs or equivalent server-side transactions, database constraints for
uniqueness, affected-row checks, and rollback/failure tests.

### P0.3 Move bulk email and reindexing out of request handlers — `new P?`

**Status:** Not started.

- Bulk recipients are currently loaded into the browser and uploaded back to send/schedule endpoints.
- Email sends run synchronously with a delay per recipient.
- Scheduled email rows store full recipient objects.
- Reindexing deletes live Elasticsearch indexes before rebuilding and updates question ES IDs one row
  at a time inside the request.

**Definition of done:** audience snapshot/reference IDs, idempotency keys, queued batch workers,
progress/retry state, resumability, and Elasticsearch versioned-index alias swaps.

### P0.4 Isolate admin HTML previews — `P13 + new P?`

**Status:** Shipped for the three unsafe raw-HTML surfaces on 2026-07-09.

Email compose, sent-email detail, and blog-diff previews insert HTML directly into the same-origin
admin document. Move these previews to sandboxed iframes with restrictive capabilities. Sanitization
remains defense in depth, not the isolation boundary.

Implemented with `HtmlPreviewFrame.svelte`: an empty sandbox capability set, no-referrer policy, and a
srcdoc CSP that blocks scripts, forms, frames, objects, connections, and remote image requests. The
category-intro and consulting-resource previews retain direct rendering because their server renderers
explicitly sanitize their limited Markdown output.

## P1 — Query Correctness and Scale

### P1.1 Server-side pagination and aggregation — `new P?`

**Status:** Shipped in the working tree; migration deployment required.

- Users loads all profiles and all signups before client-side filtering/sorting.
- Questions loads only the newest 100 but labels that subset as total questions.
- Categories loads all categories, category mappings, and active question IDs to aggregate in memory.
- Consulting lists use broad `select('*')` queries without pagination.
- Welcome/reactivation flows load large enrollment/profile/session collections into memory.

Move filtering, sorting, exact counts, and aggregation into paginated RPCs with explicit column lists.

Implemented:

- Users and email signups now load 100-row pages with exact global totals. User search, filters, and
  sorting run globally through `get_admin_users_page()` with validated URL state and canonical
  out-of-range-page redirects.
- Questions now use explicit columns, exact counts, 100-row server pages, and honest page-local metrics.
- Consulting client and session lists now use 100-row server pages, exact filtered counts, explicit
  session columns, and the existing aggregate summary RPC for global client status counts.
- Category direct/subtree counts move to `get_admin_question_category_rollup()` with a compatibility
  fallback until the migration is deployed.
- Welcome and reactivation enrollment queues are bounded, while funnel/status metrics use database
  count queries instead of loading every enrollment.
- Welcome step analytics use count-only queries instead of transferring every historical send.
- Reactivation preview and enrollment now share `get_reactivation_candidate_summary()`, which performs
  normalized suppression checks, prior-enrollment exclusion, age bucketing, deduplication, skip counts,
  and bounded candidate selection in Postgres.

### P1.2 Correct misleading or broken operations — `P6 + new P?`

**Status:** Shipped in the working tree; migration deployment required.

- “Classify all untagged questions” currently classifies only the submitted question.
- Sequence step analytics associate sends by subject instead of sequence/enrollment/step identifiers.
- User/admin mutations target email instead of immutable profile ID.
- Admin demotion lacks self-lockout and last-admin protection.

Implemented:

- Removed the unused broken `classifyAllUntaggedQuestions` action rather than retaining a control path
  that performed a different operation.
- Added immutable `sequence_id`, `sequence_enrollment_id`, and `sequence_step_number` send identity.
  New sequence sends populate all three fields; the latest attributable historical send is backfilled
  without guessing by subject.
- The identity trigger also protects direct `sequence_id` rewrites, and a composite foreign key proves
  that the recorded sequence/step pair exists.
- Welcome analytics now aggregate by sequence and step identity. Historic sends that cannot be
  attributed safely are excluded instead of being matched by editable subject text.
- Admin-role updates target profile UUIDs and run through `set_admin_status_safely()`, which serializes
  role changes and prevents self-demotion and final-admin removal.

### P1.3 Make partial data and failures explicit — `P13 + new P?`

**Status:** Dashboard and email-dashboard slice shipped in the working tree.

Dashboard and email loads frequently log failed queries and return zero/empty values, making an outage
look like valid “no activity” data. Consolidate dashboard metrics into fewer RPCs and return explicit
freshness/degraded/error metadata.

Both dashboard loads now return `complete` or `degraded` freshness metadata. A token-based P13 status
panel names unavailable sources, warns that empty values may not mean zero, shows the check time, and
offers a retry. The welcome overview is isolated so its failure no longer takes down the whole email
dashboard.

### P1.4 Harden analytics request and date semantics — `P13 + new P?`

**Status:** Shipped in the working tree.

Only the analytics pages table rejects stale responses. Overview, top pages, trending, timing, release
growth, and release events can overwrite newer selections. Add abort/request tokens keyed by the active
filter context and define the analytics reporting timezone explicitly in the API/SQL contract.

Overview, timeseries, top pages, trending, timing, release lists, release growth/events, blog
diagnostics, and the composite pageview load now reject stale generations. Release detail writes also
verify the selected slug before updating state. Reporting calendar boundaries use shared UTC helpers,
and the filter UI names UTC explicitly.

### P1.5 Consolidate admin authorization and validation — `new P?`

**Status:** Canonical authorization and the tracked email request-schema slice shipped.

Admin API routes repeat profile-admin queries and error handling. Migrate them to `requireAdmin()`, apply
shared Zod schemas for IDs/enums/query lengths, and preserve SvelteKit `HttpError`, `redirect`, and `fail`
semantics instead of remapping expected failures to generic 500 responses.

Every `src/routes/api/admin/**/+server.ts` module now calls the canonical `requireAdmin()` boundary; an
adoption test scans the complete route tree to prevent regressions. Analytics and email endpoints no
longer perform their own profile-admin queries. Email endpoint catch blocks preserve expected
`HttpError` status codes, and the user detail/admin-role inputs now require UUIDs. Shared bounded Zod
schemas now validate email send, schedule, draft, generation, reactivation-enrollment, and scheduled
status inputs at runtime; malformed JSON and invalid enums/IDs return 400 responses.

## P2 — Responsive, Accessible, and Maintainable UI

### P2.1 Reorganize the shared admin navigation — `P2 + P6 + P9 + P13`

**Status:** In progress; the complete mobile route-navigation slice shipped on 2026-07-18.

The shell has 17 flat emoji-based destinations that wrap across multiple desktop rows. Group destinations
into meaningful sections, use one icon set with fixed containers, fix the active amber contrast treatment,
and give the mobile drawer focus trapping/return, Escape, inert/scroll-lock behavior, and clear labels.

The phone shell now opens a searchable full-screen command menu through the canonical `Modal` boundary.
Destinations are grouped into Overview, People, Content, Reach, and System; Lucide icons use fixed
containers; 16px search input and 44px controls avoid iOS zoom and undersized taps; filtering, Escape
dismissal, focus trapping/restoration, background inerting, and body scroll lock were verified at 390px.
The same shared route registry now drives a contextual workspace rail on every admin subpage, including
detail-route labels and an All tools launcher, so navigation remains compact without hiding the complete
admin surface. Consulting's nested navigation now uses the same icon and segmented-control language.
Desktop grouping remains deferred.

### P2.2 Finish mobile table fallbacks — `P12`

**Status:** In progress; categories and consulting clients shipped on 2026-07-18.

Categories remains a seven-column table with a 120px minimum per cell on phones. Use identity-first mobile
cards, following the stronger users/email dashboard pattern. Reserve horizontal scroll for true matrices.

Categories and consulting clients now swap desktop tables for identity-first cards with compact metric
strips, trust/status context, safe truncation, and reachable row actions. The shared mobile adaptation
layer also contains remaining true-table surfaces instead of allowing them to widen the viewport.

### P2.3 Fix mobile controls and table semantics — `P12 + P13`

**Status:** In progress; the mobile control-sizing slice shipped on 2026-07-18.

Users and comments reduce mobile form controls to 11–12px, risking iOS zoom and poor readability. Keep
mobile controls at least 16px. User sorting now uses keyboard-operable buttons with `aria-sort` inside
sortable headers rather than click handlers on `<th>` elements.

All admin-route text inputs, selects, and textareas now hold a 16px phone size and a 44px minimum target;
comments' dense copy and search treatment were corrected directly. Shared phone toolbars, filter rows,
tabs, modal sizing, sticky actions, card padding, and overflow containment now converge on one system.

### P2.4 Make content-board interactions device-independent — `P12 + P13`

**Status:** Not started.

Remove `window.innerWidth` layout branching, add a keyboard/touch “Move to stage” control alongside drag
and drop, and remove button-like table rows that contain nested interactive controls.

### P2.5 Standardize admin dialogs — `P13`

**Status:** Not started.

Move email compose and sent-email detail to the canonical modal primitive. Preserve Escape and scroll lock,
then add focus trapping/return, `dvh` and safe-area sizing, sticky actions, and dirty-close confirmation.

### P2.6 Split oversized admin components — `P4 + P6 + P13`

**Status:** Not started.

Current hotspots include analytics (~6.5k lines), consulting (~3k), email dashboard (~2.3k), content board
(~2k), retention analytics (~1.7k), and users (~1.6k). Split by tab/domain and extract shared admin table,
filter, async-state, and modal patterns with component tests.

### P2.7 Finish charts and dense filter states — `P7 + P13`

**Status:** Not started.

Add touch/pointer-accessible chart inspection, keyboard tab behavior, and visible scroll affordances. Collapse
secondary question filters behind a Filters control with selected chips while keeping search visible.

### P2.8 Purpose-built mobile dashboard — `P3 + P4 + P6 + P8 + P9 + P12 + P13`

**Status:** Shipped on 2026-07-18.

The dashboard previously sent the complete desktop hierarchy through one-column stacking on phones:
12 equal-weight cards, three full chart panels, several long feeds, and system actions at the bottom.
Mobile now renders a separate `MobileCommandCenter` composition while desktop retains the existing
dashboard. The phone information order is pulse metrics, seven quick-launch destinations plus an All
tools command, live traffic signals, 7-day conversion and traffic summaries, expandable recent activity,
then isolated system controls. Identity-first rows clamp or truncate user-supplied strings, every
route/action remains reachable, and the full desktop charts are deliberately replaced by a compact
seven-day bar summary.

## Positive Baseline To Preserve

- Users and email dashboard already have useful mobile card fallbacks.
- Analytics endpoints use strong Zod validation in several areas.
- The canonical `Button`, `Modal`, and semantic token system provide good primitives for convergence.
- The repository is currently type-clean and the complete test suite passes.
- Generated poster/zine asset colors are intentional artifact-level exceptions and should not be swept
  mechanically into application tokens.

## Implementation Log

### 2026-07-09 — Audit recorded; P0.1 started

- Created this durable backlog from the full admin audit.
- Selected canonical action authorization as the first P0 implementation slice.
- Live protected visual verification remains owed after an authenticated local admin session is available.

### 2026-07-09 — P0.1 and P0.4 shipped in the working tree

- Added `guardAdminActions()` on top of the canonical `requireAdmin()` helper.
- Protected all seven action modules that previously depended on layout/load authorization.
- Added behavior and adoption regression coverage: 11 authorization tests pass.
- Added a reusable sandboxed `HtmlPreviewFrame` and migrated email compose, sent email detail, and blog
  version previews away from same-origin `{@html}` rendering.
- Added iframe security coverage; the focused P0 suites pass 12/12.
- The complete suite passes: 76 test files and 334 tests. Targeted ESLint and `pnpm lint:radius` also pass.
- `pnpm check` passes with 0 errors; warnings dropped from 137 to 126 after removing obsolete raw-preview
  selectors.

### 2026-07-09 — P1 correctness and scale pass

- Applied P6 to replace misleading totals and broken operations with explicit page scope and immutable
  identifiers.
- Applied P13 to surface degraded dashboard data, freshness, retry actions, and UTC reporting semantics.
- Added server pagination for users, signups, and questions; a database category rollup; bounded sequence
  queues; and count-only sequence/funnel metrics.
- Added safe UUID-based admin-role mutation with concurrency-safe self/last-admin protections.
- Added stale-response rejection across every analytics panel and release selection.
- Migrated the complete admin API route tree to `requireAdmin()` and preserved expected email API
  `HttpError` responses.
- Added focused coverage for admin-role error mapping, sequence identity metrics, UTC date boundaries,
  degraded data metadata, canonical API guard adoption, and analytics behavior.
- Verification passes: `pnpm check` (0 errors, 126 existing warnings), all 80 test files / 379 tests,
  targeted ESLint, Prettier, and the radius ratchet.
- Supabase CLI database lint could not run because this checkout has no `supabase/config.toml`; migration
  deployment and project-environment validation remained for the follow-through pass below.

### 2026-07-09 — P1 follow-through and database double-check

- Exercised all five admin migrations against a temporary PostgreSQL cluster with representative auth,
  user, category, email-sequence, suppression, enrollment, and duplicate-profile fixtures.
- The harness caught two defects before handoff: sequence identity could be rewritten independently of
  its enrollment, and a missing JWT role could bypass a non-null-safe service-role comparison. Both are
  fixed and covered by successful unauthenticated, self-demotion, final-admin, identity, rollup, global
  user query, and reactivation eligibility assertions.
- Moved user search/filter/sort and filtered counts to `get_admin_users_page()`; the UI now keeps query
  state in the URL, preserves it across both pagers, exposes a persistent empty state, and uses P6/P13
  keyboard-accessible sort controls.
- Replaced both in-memory reactivation scans with the shared, bounded
  `get_reactivation_candidate_summary()` RPC so preview and enrollment cannot drift.
- Added shared runtime schemas for the remaining manual email dashboard payloads, including 1,000-row
  recipient/candidate bounds and explicit enum, UUID, date, content-length, and status validation.
- Verification passes: `pnpm check` (0 errors, 126 existing warnings), all 86 test files / 394 tests,
  targeted ESLint, Prettier, `git diff --check`, the radius ratchet, and the PostgreSQL migration harness.
- The five migrations still require deployment through the project Supabase environment. Authenticated
  desktop/mobile visual verification remains owed because this checkout has no local admin session.

### 2026-07-18 — Mobile command center and navigation

- Added a separate phone-only dashboard composition instead of continuing to stack the desktop surface.
- Applied P3/P4/P6/P8/P12 to put six daily pulse metrics, eight essential destinations, current traffic
  signals, compact conversion/traffic summaries, and expandable activity into a dense scan order.
- Applied P9/P13 to replace the flat emoji mobile drawer with a grouped, searchable Lucide command menu
  using the canonical focus/scroll/inert modal boundary.
- Preserved the desktop dashboard and all existing server data/action contracts.
- Live representative-data verification passed at 390x844 in dark and light mode: no horizontal
  overflow, 16px mobile search input, 44px menu target, command-menu filtering, Escape dismissal, and
  focus restoration. Authenticated verification against live admin data remains owed.

### 2026-07-18 — Mobile admin route system

- Centralized the admin information architecture into one typed route registry shared by the drawer,
  dashboard launcher, route labels, and new contextual workspace rail on every admin subpage.
- Added a route-family mobile adaptation layer for compact headers, two-column stat grids, scrollable
  segmented tabs, dense toolbars, 16px controls, consistent 10/16/full radii, safe table containment,
  and `dvh` modal behavior.
- Applied P12 identity-first mobile card fallbacks to Categories and Consulting Clients, including safe
  long-name/email handling, dense metric strips, status/trust context, and touch-sized actions.
- Reworked consulting section navigation with Lucide icons, rebuilt Asset Generators as a compact
  production bench, and corrected comments and drafts mobile readability/semantic color details.
- Representative real-component verification passed at 390x844 in light and dark mode for Categories,
  Consulting Clients, and Asset Generators: no horizontal overflow, two-column header actions, 16px
  visible inputs, compact category batch controls, desktop-table replacement, and safe long-string
  truncation. Authenticated verification against live admin data remains owed.
