<!-- docs/taskers/T-41-growth-audit-loose-ends.md -->

# Tasker: Growth Audit Loose Ends (2026-09-30 audit, 10-02/10-03 fix round)

**For:** the agent assigned to close out the follow-ups from the 2026-09-30 "why isn't 9takes growing" audit and the fix round that shipped on 2026-10-02 and 2026-10-03.
**Owner:** DJ
**Created:** 2026-10-03
**Status:** In progress (2026-10-03). B, D, E, F, H, I, J, K, L and M step 0 shipped in `d0984dab1` and verified live. A (10-10) and C (10-17) are date-gated; O waits on A. G drafts and M/N proposals are with DJ. Items are independent unless noted. Section 4 is DJ-only: do not do those.
**Related:** commits `6f34ad64b` (fix set), `3dfa99ef8` (live-take homepage + mid-article celebrity question), `e4fe1d896` (T-38 Trump retype + host-desk replies); `docs/growth/growth-log.md` (entries `### 2026-09-28` and later); `docs/seo/personality-isr.md`; `docs/design/hyperplexed/HOMEPAGE_AUDIT_2026-09-26.md`; `supabase/migrations/20261002120000_admin_engagement_trends_weekly_v2.sql`.

---

## 0. What and why

The 2026-09-30 audit (five research agents: Search Console, live-site technical SEO, database funnel, marketing execution, external market) found:

- **Search is not the problem.** Google clicks hit a 16-month high in September 2026 (1,443, up 26% year over year). The real dip ran from Sep 2025 to May 2026 (lowercase-URL migration plus Google's Aug 2025 spam update) and has fully recovered. All 50 inspected top URLs were indexed with correct canonicals.
- **The leak is after the click.** About 2,600 engaged humans a month. 1.3% reach a question page, 0.6% post a take, and real email signups were about zero for 30 straight months. Signups never dropped; they were always this low.
- **Comments did drop after 2026-09-20.** Two causes: the 2026-09-10 homepage redesign made the homepage answer practice-only (it had brought in about two-thirds of contributors), and the celebrity-page answer box went blank on all 450 pages after the 2026-08-14 question flagging (its linked questions were among the 358 DJ hid on purpose).
- **Retention is about zero.** Since July, 1 of 45 contributors returned on a later day, and that was the one DJ replied to. Replies are the only thing that has ever retained anyone.
- **The admin dashboard misled.** About 85% of its "visitors" were bots, comments included DJ's own replies, and a 30-day window made "always zero" look like "just dropped".

Most of that is now fixed and live (section 2). This tasker is what is left.

## 1. Required reading

1. `CLAUDE.md` (repo root): commands, Svelte 5 runes, server patterns.
2. `docs/taskers/README.md`: hard rules (never touch `lastmod`; no em-dashes; `enneagram-and-mental-illness` is frozen; no `git stash` or wide operations, because DJ and other agents edit this repo in parallel).
3. This file's section 5 (gotchas). Several of them cost real outages.
4. For metrics work: `supabase/migrations/20261002120000_admin_engagement_trends_weekly_v2.sql` (the honest definitions of human visitor, human comment, real signup, booking).

## 2. Already done (do not redo)

| Shipped                                                                                                                                           | Where                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Deploy-skew noindex fix: carry-over manifest v2 tracks `lastSeen`, caps 3,000 files / 150 MB; `+error.svelte` emits noindex only on 4xx           | `scripts/carry-over-immutable-assets.mjs`, `src/routes/+error.svelte`                                         |
| Personality ISR: a query error returns 503 (not a cached 404); `BYPASS_TOKEN` set in Vercel production                                            | `src/routes/personality-analysis/[slug]/+page.server.ts`                                                      |
| `/personality-analysis/:slug/` 308-redirects to the slashless URL                                                                                 | `vercel.json`                                                                                                 |
| Blog posts compile with injected CSS: Enneagram Corner posts went from 48 to 30 render-blocking stylesheets, identical rendering on all 152 posts | `svelte.config.js`, `src/hooks.server.ts`, `src/lib/server/injectedStyleOrder.ts`                             |
| Host digest restored (it was killed at Vercel's 15 s default; drafting now Claude Haiku 4.5, then GPT-4.1-mini; catch-up lookback; run log)       | `src/routes/api/cron/host-digest/+server.ts`, `src/lib/server/hostDigest.ts`; runs in `app_error_events`      |
| reCAPTCHA race fixed on forgot-password, login and register (the widget never rendered on a first load)                                           | `src/lib/utils/recaptchaClient.ts`, `src/routes/forgotPassword/`                                              |
| Honest admin dashboard: `admin_engagement_trends_weekly_v2(p_weeks)` RPC, **applied to production** and recorded in `schema_migrations`           | `src/routes/admin/+page.*`, `src/lib/components/charts/GrowthTrends.svelte`                                   |
| `gate_shown` no longer recorded for crawlers; `contribution` events now carry `path`                                                              | `src/lib/server/giveFirstFunnel.ts`                                                                           |
| Live-take homepage: a homepage answer posts a real take to q203 and offers the reply opt-in                                                       | `src/routes/api/homepage/answer/`, `src/lib/server/homepageLiveTake.ts`, `src/lib/server/questionComments.ts` |
| Celebrity pages: a proven live question renders mid-article (about 40% in) on all 450 pages; impressions via `/api/nine/impression`               | `src/lib/utils/articleChorusSlot.ts`, `src/lib/server/provenChorusQuestions.ts`, `NineChorus.svelte`          |
| Verified 2026-10-02: commenting works in production (a test take posted and was removed with its notifications and funnel event)                  | n/a                                                                                                           |

## 3. Work items

### P0: this week

#### A. Spam-update and noindex readout (run on or after 2026-10-10)

**Status (2026-10-03):** Not started. Date-gated: run on or after 2026-10-10.

- **Why:** Google's September 2026 spam update rolls out 2026-09-24 to about 2026-10-08, and early reports say it targets templated, AI-assisted programmatic pages. The 450 celebrity pages share one template. Also, the deploy-skew fix needs confirmation in Google's own data.
- **Do:** copy the auth from `scripts/fetch-gsc-data.mjs` (do not edit it) into a scratch script. Pull daily clicks and impressions for `/personality-analysis/*` with `dataState: 'all'`. Compare 2026-09-24 to 2026-10-08 against the two weeks before. Then use the URL Inspection API on the top 25 pages by clicks and list any whose coverage says "Excluded by 'noindex' tag" with a last crawl after 2026-09-28.
- **Done when:** a dated entry in `docs/growth/growth-log.md` (append only) gives the before/after numbers and a verdict. **Flag DJ if celebrity-page impressions fell more than 20%.** Search Console had a logging bug from May 2025 to Apr 2026, so compare clicks, not impressions, across that range.

#### B. Stop the top post's story link from downloading a file

**Status (2026-10-03):** Done, verified live after `d0984dab1`: `content-type: text/html`, and the AMP story opens in Chrome (22 pages, runtime loaded). Note: the promo link inside the frozen top post is commented out, so the post does not currently link to the story; nothing changed there. Dropped `prerender` from `src/routes/stories/enneagram-and-mental-illness/+server.ts` (the `s-maxage=86400` header keeps it CDN-cached). Run the `curl -sI` check after deploy.

- **Why:** `/stories/enneagram-and-mental-illness` is served as `content-type: application/octet-stream`, so Chrome downloads it. `src/routes/stories/enneagram-and-mental-illness/+server.ts` sets `prerender = true`, which emits an extensionless static file; Vercel then ignores the handler's `Content-Type` header. The highest-traffic post on the site links to it through `src/lib/amp-stories/EnneagramMentalIllnessPromo.svelte`.
- **Do:** fix the route (drop `prerender`, or emit a file with an `.html` extension and redirect). **Do not edit `src/blog/enneagram/enneagram-and-mental-illness.md`**; it is frozen.
- **Verify:** after deploy, `curl -sI https://9takes.com/stories/enneagram-and-mental-illness | grep -i content-type` returns `text/html`, and the AMP story opens in a browser.

#### C. Two-week readout of the 2026-10-03 surfaces (run on or after 2026-10-17)

**Status (2026-10-03):** Not started. Date-gated: run on or after 2026-10-17.

- **Why:** the live-take homepage and the mid-article celebrity question are the two bets that should bring contributions back.
- **Do:** read-only SQL via `./scripts/db-query.sh`. For each week since 2026-10-03: `give_first_funnel_events` `gate_shown` and `contribution` by `path` (`/` versus `/personality-analysis/%`), distinct fingerprints, and contributions per gate. Join to `comments` for real takes (exclude removed and admin). Also report host-digest runs (`select created_at, level, message from app_error_events where source='host_digest' order by id desc`) and how many takes got a DJ reply within 24 hours.
- **Bars:** homepage at least 2 contributors a week; celebrity pages at least 3 a week, judged over 4 weeks.
- **Gotcha:** gate counts break on 2026-10-02 because crawlers stopped counting. Do not compare raw gate counts across that date.
- **Done when:** a dated entry in `docs/growth/growth-log.md` with the table and a verdict.

#### D. Point the weekly growth audit at the honest numbers

**Status (2026-10-03):** Done in tree. `growth-analyst.md` and `weekly-growth-audit.md` headline `admin_engagement_trends_weekly_v2(26)` with inlined definitions and series breaks; `run-weekly-growth-audit.sh` warns (non-fatal) when the day's entry does not cite the RPC. Correction: `contribution.path` was already set before 10-02 for the old homepage and blog embeds; only question-page contributions were NULL.

- **Why:** the Monday growth audit and marketing brief still compute from raw counters, which is how a flat line read as a drop.
- **Where:** `.claude/commands/weekly-growth-audit.md`, `.claude/agents/growth-analyst.md`, `scripts/run-weekly-growth-audit.sh`.
- **Do:** make `select * from admin_engagement_trends_weekly_v2(26)` the headline source. Document the series breaks: personality-page `content_access_events` stop on 2026-09-21 (ISR); `gate_shown` excludes crawlers from 2026-10-02; `contribution.path` exists from 2026-10-02. Keep each command self-sufficient (inline the definitions; agents do not reliably follow links).

### P1: soon

#### E. Mobile admin "Pulse" tiles still show raw numbers

**Status (2026-10-03):** Done in tree. Tiles show the last full week from the already-loaded v2 data (engaged visitors, contributors + returning, human comments, real signups, registrations, week-over-week change). Same fallback rule as `GrowthTrends.svelte`, but the fallback tiles are labelled "Raw rows / bots included". New `src/lib/admin/honestPulse.ts` + spec.

`src/routes/admin/MobileCommandCenter.svelte` shows bot-inclusive counts above the honest section on phones. Feed it the same weekly v2 data `GrowthTrends.svelte` uses, with the same fallback when the RPC is missing.

#### F. Reply opt-in events from the homepage are labelled `question_page`

**Status (2026-10-03):** Done in tree. `ReplyOptInSurface` gains `'homepage'`; `HomeLandingV2.svelte` passes it; spec added.

Add `'homepage'` to `ReplyOptInSurface` in `src/lib/analytics/replyOptInEvents.ts` (+ spec) and pass it from the homepage's `ReplyOptInTray`.

#### G. Draft the nine takes for q118 and q203 (DJ approves before seeding)

**Status (2026-10-03):** Drafts with DJ: `docs/taskers/T-41-assets/G-nine-takes/` (both pass `seed-strategic-question.mjs --dry-run`; nothing seeded). README has the seed and revalidate commands.

- **Why:** every celebrity page currently asks q567, because `/api/nine/mirror` only accepts answers on questions with nine stored takes, and q567 is the only one in the proven pool that has them. `provenChorusQuestions.ts` rotates q118 (`what-were-you-like-as-a-kid-in-3-words`) and q203 (`whats-criteria-considering-someone-friend`) in automatically once they're seeded.
- **Do:** read `scripts/seed-strategic-question.mjs` and the existing q567 row in `nine_takes`, then draft seed files for q118 and q203 that follow the same voice rules. **Do not run the seed.** Hand DJ the drafts.
- **After DJ approves:** run the seed, then confirm the rotation: ISR pages refresh within 24 hours, or immediately via `BYPASS_TOKEN=... pnpm revalidate:personality -- <slug>` (the script reads the token from the shell, not `.env`).

#### H. Dead `?/getRelatedPosts` call on celebrity pages

**Status (2026-10-03):** Done in tree. Only caller was the personality page, and its server load already runs the same `buildRelatedPosts` query, so the client refetch could only 404. Removed the fetch, loading/error states and the `getRelatedPosts` action. Verified live: Zendaya renders 6 related cards, 0 `getRelatedPosts` requests, and client-side navigation to Jacob Elordi updates title, portrait and related list.

ISR pages drop `?/action` form actions, so the `?/getRelatedPosts` request in `src/lib/components/molecules/RelatedPosts.svelte` 404s on `/personality-analysis/*`. Related posts already come from the server load, so remove the call, or move it to an `/api` endpoint if another page still needs it (grep the callers). Verify no 404 in the browser network panel on `/personality-analysis/zendaya`.

#### I. Turn on IndexNow

**Status (2026-10-03):** Key file added (`static/<key>.txt`), `INDEXNOW_KEY` in local `.env`, dry run lists 5 URLs. Key file live (200). First real submission 2026-10-03: HTTP 202 (received, key validation pending); state in `docs/data/indexnow/last-submitted.json`. Vercel env var not set (DJ's call; the submitter runs locally/OpenClaw, so it is optional).

The submitter exists (`scripts/submit-indexnow.mjs`, `docs/seo/indexnow.md`), but production has no key file (404) and no `INDEXNOW_KEY` env var, so nothing is pinging. Generate a key, add the static key file, then **ask DJ before setting the Vercel env var**. Verify with one submission.

#### J. Restore a passing `pnpm lint` and `pnpm check`

**Status (2026-10-03):** Mostly done in tree.

- `pnpm check`: the 4 `scripts/` errors are fixed (JSDoc types in `linkOnlyChange.js`, `personBlogParser.js`). One error remains in `src/routes/admin/+page.server.ts`, which belongs to another session's in-flight admin query-cache work, not this tasker.
- Prettier: the bump was **not** the cause (3.9.6 and 3.9.8 give byte-identical output; the plugin version did not change). The 1,534 files were mostly agent worktrees under `.claude/worktrees/`, hidden from git by `.git/info/exclude`, which Prettier and ESLint do not read. Added to `.prettierignore` and the ESLint ignores, along with machine-written pipeline output under `docs/content-analysis/`. Formatted the 22 remaining clean files. `prettier --check .` now flags only `docs/growth/host-desk/2026-10-03-type6-critic-replies.md` (in-flight edit by its owner).
- ESLint: **0 errors** (was 165 with worktrees, 53 without). Fixed 51 mechanical errors in 22 files (`{ cause }` on re-throws, dead initializers, `tailwind.config.ts` `require()` to imports: compiled Tailwind CSS verified byte-identical). Five `$:` assignments are read on the next reactive run, so they keep an inline disable rather than a behavior change. `docs/archives/**` ignored. `Map.svelte`'s "never assigned" `container` was dead code (map-action supplies the node), removed.
- `pnpm check` after all of the above: 1 error, the admin file above; 0 from this tasker's changes.
- Still failing, owner DJ/content: `crosslinks:check` fails on `/community/be-gentle-when-youre-right` (0 links in, 0 out; committed in `3dfa99ef8`). Run `/crosslink-queue` or `pnpm gen:crosslinks -- --target /community/be-gentle-when-youre-right`.

- **Why:** `pnpm lint` stops at its first step because Prettier flags 1,534 files. The likely cause is the 2026-09-22 dependency bump (`48f80036a`: prettier ^3.9.8, prettier-plugin-svelte ^4.1.1). ESLint reports 165 errors repo-wide, and `pnpm check` has 4 errors in `scripts/lib/linkOnlyChange.js` and `scripts/personBlogParser.js`.
- **Do:** confirm the cause first (run Prettier at the pre-bump versions on the same files). A one-time format of 1,500 files is a wide operation: **get DJ's go and a quiet working tree before doing it**, or pin the plugin instead. Fix the 4 type errors outright.
- **Done when:** `pnpm lint` and `pnpm check` exit 0, or the remaining failures are written up with an owner.

#### K. `check:server-runtime` breaks inside nested worktrees

**Status (2026-10-03):** Done in tree. Root cause was not `.vercel/output` (already cwd-relative) but the server dir inside each function: the adapter roots functions at the common ancestor of traced files, which is the main checkout when a nested worktree resolves its node_modules, so `.svelte-kit/` sits under `.claude/worktrees/<id>/` in the bundle. The script now follows each function's `.vc-config.json` handler. Verified: old script ENOENTs in a nested worktree build, new one passes there and in the main tree.

`scripts/check-server-runtime.mjs` assumes the repo-root layout, so it fails with ENOENT when a build runs from `.claude/worktrees/<id>/` (Vercel nests the function files under that path). Make it resolve `.vercel/output` relative to the current working directory. This matters because this check is the only one that catches Vercel-only 500s (see section 5).

### P2: when there's room

#### L. Inline the CSS of components embedded in blog posts

**Status (2026-10-03):** Done in tree, full-corpus verified. New `src/lib/blogEmbedCss.js` lists the embedded components (callouts/, stress/, blackpill/, StrategicQuestion, VoiceRecorder, FamousTypes, MarqueeHorizontal, DateTip, rubix, three diagram components); `svelte.config.js` compiles them with `css: 'injected'`; `blogEmbedCss.spec.ts` fails if a post embeds a styled component that is not covered. Linked sheets: Enneagram Corner 30 to 15, mental health 15 to 11, community 19 to 13, how-to 17 to 13, pop culture 18 to 13, personality 17 to 15, questions and /book-session one fewer each. Verification: all 153 published posts at 412 and 1280 px, JS off 306/306 identical; JS on 250/306 identical, the other 56 differ only on PopCard's auto margin (0 vs 93 px), which also flips baseline-vs-baseline on the same pages and lands the element in the same place; 30 extra pages (personality, type, questions, /book-session, indexes) 60/60 identical in both modes. Client-side navigation: the candidate now matches the fresh-load render (the baseline added 16 to 19 px under QuickAnswer's question after navigating from a how-to guide). Scripts used: re-pointed copies of `T-41-assets/visual-diff/`.

Callout, QuickAnswer, StrategicQuestion and similar still link about 15 stylesheets (about 43 KB) on every Enneagram post. The same `css: 'injected'` treatment would take posts from 30 to about 15 sheets. QuickAnswer also renders on personality pages and VoiceRecorder on questions and `/book-session`, so those pages need the same check.

**Required verification:** a computed-style diff of every published post at mobile and desktop widths, old build against new. A 3–4 post spot-check missed a regression on about 15 posts last time. Reference scripts are in `docs/taskers/T-41-assets/visual-diff/` (paths are hard-coded to a deleted worktree; ports 4181 = baseline preview, 4182 = candidate).

#### M. Plan (do not implement) critical CSS for the root layout

**Status (2026-10-03):** Plan with DJ: `docs/taskers/T-41-assets/M-critical-css-plan.md` (probe: `lcp-probe.cjs`). Biggest LCP lever was not CSS: the hero `PopCard` on all five MDsvex post routes was lazy-loaded. Step 0 (pass `priority`) is live: the hero renders `loading="eager" fetchpriority="high"` on Enneagram Corner and how-to posts (verified in production). The probe predicted 5.2 s to 2.4 s LCP on the top post; re-run `lcp-probe.cjs` to confirm. Steps 1 to 5 await DJ.

The 144 KB root stylesheet plus the 33 KB `blog.css` block rendering on every page. That's the main remaining LCP cost: lab LCP is about 5.2 s on the top Enneagram post and 5.1 s on personality pages. Write a plan with expected gains for DJ.

#### N. SEO proposals (propose, do not execute)

**Status (2026-10-03):** Proposals with DJ: `docs/taskers/T-41-assets/N-seo-proposals.md`. N1: restore only `enneagram-communication-tips`. N2: `/enneagram-test` has no test on it; lean fix (CTA copy + comparison post) vs ambitious (a real test).

1. Commit `20ecb0a57` (2026-08-02) 301'd `enneagram-communication-tips` (position 10.8) and `communication-styles` (16.4) into `relationship-communication-guide`, which ranks at 40.9. Google has not transferred the rankings. Recommend: restore, strengthen the target, or leave it.
2. `/enneagram-test` gets 0–4 impressions a month, while "best free enneagram test" style queries (300–460 impressions a week) only find 9takes on page 2 through comparison posts. Recommend a fix.

#### O. Deploy-skew residual (only if item A finds noindex exclusions)

**Status (2026-10-03):** Waiting on item A.

HTML from the 2026-09-25 to 2026-09-28 deploys still renders the old error page with noindex, because those assets were dropped before the fix and the old HTML carries the old error component. This risk is aging out. If item A shows real exclusions, backfill the missing `/_app/immutable/*` files from the old deployment URLs into the next build's carry-over.

## 4. DJ-only (the agent must not do these)

- **Address supplied and configured (2026-10-05):** DJ supplied `PO Box 662, Glen Burnie, MD 21061-0662` and authorized updating it everywhere. `EMAIL_FOOTER_ADDRESS` is set and verified in Vercel Production, Preview, and Development and both local env files. See the latest [marketing log](../marketing/marketing-log.md) entry for deployment status. Stopped enrollments, confirmation resends, and deliverability checks remain separate work.
- Approve the q118 and q203 nine-take drafts from item G.
- Decide on the 7 likely-bot signups (ids 197–203) still subscribed.
- Send the beta invites to the 2 real waitlist signups. No invite appears in dj@9takes.com Sent as of 2026-10-03; the Beta Kit markup comes first.
- Send the Shaan Puri follow-up. He replied to DJ's cold email in 22 minutes in May; a follow-up was drafted on 07-15 and never sent.
- Clear the host-digest drafts every day. The metric is the share of takes answered within 24 hours.

## Verification checklist

```bash
pnpm test                       # 220+ files, all pass
pnpm check                      # 0 errors once item J lands (4 known errors in scripts/ before that)
pnpm build                      # must include "Every runtime require() in the traced Vercel functions resolves."
curl -sI https://9takes.com/personality-analysis/zendaya/ | grep -iE "^HTTP|location"   # 308 to slashless
curl -s https://9takes.com/_app/carryover-manifest.json | head -c 40                     # {"version":2
./scripts/db-query.sh "select * from admin_engagement_trends_weekly_v2(8)"
./scripts/db-query.sh "select created_at, level, message from app_error_events where source='host_digest' order by id desc limit 5"
```

## 5. Risks and gotchas

- **Vercel function timeout:** fluid compute is off and the project default is 15 seconds. Any route that calls an LLM needs `export const config = { maxDuration: 300 }`. That is what silently killed the host digest from 2026-09-09.
- **Local preview cannot catch Vercel-only 500s.** Only `pnpm build`'s `check:server-runtime` can, because it copies each traced function into isolation. Trust it over `vite preview`.
- **ISR pages drop `?/action` form actions** (they 404). Client calls from personality pages need `/api/*` endpoints.
- **Never bulk-unflag questions.** The 358 AI-seeded questions DJ hid on 2026-08-14 are hidden on purpose.
- **Never run `supabase db push`.** It applies every pending migration, including ones DJ has not approved. Apply one migration at a time, in a transaction, and record it in `supabase_migrations.schema_migrations`.
- **Posting a test take** fires `notify_on_comment`, which notifies everyone who answered that question. If you must test, use an admin-authored question, set `removed = true` right away (the cleanup trigger deletes the notifications), then delete the row and its `give_first_funnel_events` contribution.
- **Do not restore the neurodivergence guide's old meta title** ("ADHD, Autism, and Your Enneagram: Why Generic Advice Fails"). The 2026-08-13 safety rebuild removed it as unsafe, even though clicks halved afterwards.
- **reCAPTCHA:** `api.js` fires its load event before `grecaptcha.render` exists. Always go through `ensureRecaptchaLoaded()`.
- **Parallel work:** other agents and DJ edit this repo at the same time. No `git stash`, no wide resets, and don't sweep unrelated working-tree changes into your commits.

## Definition of done

Items A–D have dated growth-log entries or merged changes. E, F, H, I, J and K are merged with tests (I's env var waits for DJ). G's drafts are with DJ. L–O have either a merged change with the full-corpus verification, or a written proposal DJ can approve. Nothing in section 4 was done by the agent. Mark each item's status inline in this file as you go.
