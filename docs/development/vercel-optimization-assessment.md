<!-- docs/development/vercel-optimization-assessment.md -->

# Vercel Optimization Assessment

**Date:** 2026-04-18
**Goal:** Reduce Vercel function invocations, cut Supabase round-trips, and speed up response times without breaking personalization or give-first gating.

## What's good

- Cron is minimal: one `*/15` job (`/api/cron/process-sequences`), low invocation cost.
- Redirects + rewrites live in `vercel.json` — handled at the edge, no function cost.
- `nodejs22.x` runtime is current.
- Auth-protected (`/admin`, `/account`) and personalized routes correctly use `Cache-Control: private, no-store`.

## Top cost / performance issues

### 1. Zero prerendering on blog content (biggest cost driver)

Every blog page — `pop-culture/[slug]`, `enneagram-corner/[slug]`, `personality-analysis/[slug]`, `community/[slug]` — sets `Cache-Control: private, no-store` and runs a serverless function on every request, including bot and crawler traffic. With AI crawlers, sitemap, and SEO traffic, this is 100% function invocations where ~90% could be CDN-cached HTML.

The personalization is "has this fingerprint commented yet?" — a gate that flips once per user. Options:

- **ISR**: `s-maxage=300, stale-while-revalidate=86400` for anonymous traffic, then hydrate the gate client-side via `/api/has-commented?slug=`.
- **Prerender**: `export const prerender = true;` for these routes and move the gate to a client-side fetch on mount.

Either approach likely cuts function invocations by 50–80%.

### 2. `hooks.server.ts` runs `safeGetSession` on every request

**Update after review:** `safeGetSession` already short-circuits — `getSession()` is a local cookie read (no network), and `getUser()` (the network call) only runs when a session exists. So anonymous users don't pay the auth roundtrip.

Remaining opportunity: skip the hook entirely for paths that don't need user context (static assets handled by SvelteKit adapter already, but e.g. `/api/track/*`, `/proxytown/*`, some asset routes could bypass). Lower priority than originally estimated.

### 3. `+layout.server.ts` always queries Supabase

Two queries per request: `admin_settings` lookup and (for logged-in users) `profiles` + an RPC. The `admin_settings` demo flag should be cached in module memory with a short TTL (60s), not refetched per request.

### 4. Content-access guard hits Supabase RPC on every protected page request

`record_content_access_event` runs synchronously in the request path via `recordSharedContentAccessEvent`. For human traffic this is wasted DB load.

Options:

- Sample (e.g., 1-in-N for humans, always for bots).
- Queue via `event.platform.context.waitUntil(...)` so it doesn't block the response.

### 5. `pnpm i --no-frozen-lockfile` in `vercel.json`

Slower builds and non-deterministic. Switch to frozen lockfile unless there's a specific reason.

### 6. No `split`, `memory`, `maxDuration`, or `regions` in adapter config

- Set `regions: ['iad1']` (or wherever Supabase lives) to cut latency.
- Lower-traffic API routes can use `memory: 512` (default 1024) to halve compute cost.
- Set `maxDuration` explicitly per route — defaults to 60s on Pro; hung requests cost full timeout.

### 7. `enhanced-img` + `sharp` in serverless

`sharp` cold-start is ~200–400ms. If we're not also using Vercel's native image optimization (`/image`), we're paying twice. Verify thumbnail generation isn't happening on request.

## Quick wins — ranked by ROI

| #   | Fix                                                   | Risk | Impact                   |
| --- | ----------------------------------------------------- | ---- | ------------------------ |
| 1   | Prerender or ISR blog routes                          | Med  | 50–80% fewer invocations |
| 2   | Skip `getUser()` in hooks when no auth cookie         | Low  | Cuts 1 RT per anon req   |
| 3   | Cache `admin_settings` in module scope (60s TTL)      | Low  | Cuts 1 DB query per req  |
| 4   | Set `regions` in adapter to match Supabase            | Low  | Cuts latency             |
| 5   | Switch to frozen lockfile in `vercel.json`            | Low  | Faster + safer builds    |
| 6   | Move content-access logging to `waitUntil` or sample  | Low  | Cuts 1 DB query per req  |
| 7   | Set explicit `maxDuration` and `memory` on API routes | Low  | Caps cost on hung reqs   |

## Execution plan

Start with the low-risk wins that trim every request, then tackle the higher-impact prerender/ISR work with a proof-of-concept on one route before rolling out.

### Phase 1 — Low-risk, every-request savings

- [x] Cache `admin_settings` demo flag in module scope with 60s TTL (`src/utils/api.ts`); layout uses helper, admin toggle invalidates cache.
- [x] Switch `vercel.json` install to frozen lockfile.
- [x] Set `regions: ['iad1']` in `svelte.config.js` adapter options (Supabase project in `us-east-1`).
- [ ] (Stretch) Skip `safeGetSession` for non-user routes like `/api/track/*`, `/proxytown/*`.

### Phase 2 — Content-access guard

- [x] `recordSharedContentAccessEvent` for `anonymous_human` traffic now fires via `event.platform.context.waitUntil` (no longer blocks response). AI crawler traffic still awaits so quotas stay accurate.

### Phase 3 — ISR / prerender proof-of-concept

- [ ] Pick one blog route (`pop-culture/[slug]` recommended) and convert to ISR.
- [ ] Move the give-first gate to a client-side fetch against a new `/api/has-commented` endpoint.
- [ ] Verify crawler traffic + logged-in users behave correctly.

### Phase 4 — Roll out ISR to remaining routes

- [ ] `enneagram-corner/[slug]`
- [ ] `community/[slug]`
- [ ] `personality-analysis/[slug]` (careful: DB-driven content, needs revalidation after `/admin/content-board` edits)

### Phase 5 — Per-route tuning

- [ ] Audit API routes for `memory: 512` candidates.
- [ ] Set `maxDuration` explicitly on any route calling ES / external APIs.
- [ ] Confirm `enhanced-img` usage vs Vercel Image Optimization.
