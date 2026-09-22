<!-- docs/seo/personality-isr.md -->
# Personality pages on ISR

**Shipped:** 2026-09-20. **Why:** the 2026-09-14 Ahrefs crawl flagged 60 slow pages and 30 "slow server response for AI crawlers", nearly all `/personality-analysis/[slug]`. Those pages were rendered from scratch on every single request (`private, no-store`, `x-vercel-cache: MISS`), so every crawler and every reader paid for a cold serverless render plus 2 database round trips. Ahrefs measured 2–9s.

Now one copy per path is stored in Vercel's ISR cache, shared by every visitor and every region, and refreshed when you publish.

## What moved where

| Piece                  | Before                  | After                                                                  |
| ---------------------- | ----------------------- | ---------------------------------------------------------------------- |
| Page HTML              | rendered per request    | ISR cache, 24h expiration + refresh on publish                         |
| Signed-in header       | server-rendered         | `/api/auth-shell` in the browser (same as the other four sections)     |
| Answer gate + comments | in the page load        | `GET /api/personality-analysis/[slug]/discussion`, `private, no-store` |
| Admin draft preview    | public URL for admins   | `/admin/content-board/personality-analysis/[slug]`                     |
| Training-crawler block | 403 inside the function | robots.txt (+ optional Firewall rule below)                            |

The give-first gate did **not** move to the browser. The discussion endpoint still decides server-side and returns no comments until the visitor has answered.

## The rule that keeps this safe

**The ISR cache is keyed by pathname alone.** `Vary` is not part of the key, so one stored response is replayed to everyone. Anything that varies per visitor — session, cookie, user agent — must stay out of these responses.

That is why the user-agent hard block no longer runs on these paths (`getHardBlockedReason` in `src/lib/server/contentAccessGuard.ts`): the first blocked crawler would have stored a 403 and served it to real readers. Every other protected route still hard-blocks, and stays safe because its shared cache carries `Vary: User-Agent`.

`src/lib/server/personalityIsrContract.spec.ts` fails the build if the page load starts reading a session, a cookie or the user agent again, or returns `user`/`flags`/`comments`.

## Setup DJ still needs to do

### 1. `BYPASS_TOKEN` (required for refresh-on-publish)

Without it, pages still cache and still refresh every 24h; they just won't update the moment you publish.

1. Generate one: `node -e "console.log(crypto.randomBytes(24).toString('hex'))"` (32+ chars).
2. Vercel → Project Settings → Environment Variables → `BYPASS_TOKEN`, all environments.
3. Redeploy. It is read at **build time** by the `isr` config in `src/routes/personality-analysis/[slug]/+page.server.ts`, so a new value needs a fresh deploy.
4. Locally: `vercel env pull .env.development.local`.

### 2. Vercel Firewall rule (optional, restores the hard block)

robots.txt already disallows GPTBot, ClaudeBot, anthropic-ai, CCBot, Google-Extended, Applebot-Extended, meta-externalagent and Reflectionbot site-wide, and those crawlers honor it. The removed 403 only ever caught a crawler that declares itself _and_ ignores robots.txt.

To enforce it in front of the cache: Vercel → Firewall → Custom Rule, match `Request Header: user-agent` contains any of those names, path starts with `/personality-analysis/`, action Deny. Use a **custom rule**, not the managed "AI Bots" ruleset, which would also block OAI-SearchBot and PerplexityBot — crawlers 9takes deliberately allows.

## Refreshing a page

- **Admin edits** (`/admin/content-board`) refresh themselves: the PUT in `src/routes/api/admin/content/[id]/+server.ts` calls `revalidatePersonalityPage` after a successful save, including on unpublish.
- **Everything else** (`pnpm push:people`, SQL, backfills):
  ```bash
  pnpm revalidate:personality -- pedro-pascal zendaya
  pnpm revalidate:personality -- --all          # every published page, from the sitemap
  pnpm revalidate:personality -- --all --dry-run
  ```
  Never fails hard: a missed refresh just means the page serves its previous copy until the 24h expiration.

## Verifying it works

```bash
# Second request should report HIT, and no Set-Cookie at all.
curl -sI https://9takes.com/personality-analysis/pedro-pascal | grep -iE 'x-vercel-cache|cache-control|set-cookie'
curl -s -o /dev/null -w '%{time_starttransfer}\n' https://9takes.com/personality-analysis/pedro-pascal

# Same page, different agents, must be byte-identical (no per-visitor content).
diff <(curl -s -A 'Mozilla/5.0' URL) <(curl -s -A 'Googlebot/2.1' URL)

# A logged-in reader must never get a cached page containing their data.
curl -sI --cookie "$AUTH_COOKIE" URL | grep -i cache-control   # expect private, no-store
```

Watch after deploy: Ahrefs "Slow pages" and "Slow server response for AI crawlers" on the next crawl, and Vercel Observability → Functions for invocation count on this route (it should drop sharply).

## Rollback

Delete the `config` export in `src/routes/personality-analysis/[slug]/+page.server.ts` and re-add `/personality-analysis/` to the exclusion in `getPublicEditorialCachePath`. That returns these pages to per-request rendering; the discussion endpoint keeps working either way.

## Known trade-offs

- Logged-in readers see a logged-out header for ~100–300ms before it swaps. Already true on pop-culture, community, how-to-guides and enneagram-corner.
- Comments arrive when the discussion section nears the viewport; the spinner there already existed.
- Per-request `content_access_events` telemetry and the `9tanon` cookie stop firing on these pages. Nothing enforces limits from them today, but the anonymous-reader counts in that table will drop, so don't read that as lost traffic.
