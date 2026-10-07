<!-- docs/taskers/T-43-crawlable-gated-answers.md -->

# Tasker: Let Google Index Question Answers Without Showing Them to Visitors

**For:** the agent who makes `/questions/[slug]` answers indexable by Google while human visitors still can't see any answer until they post their own.
**Owner:** DJ
**Created:** 2026-10-06
**Status:** BUILT 2026-10-07 (uncommitted) on DJ's revised decision: Google sees an AI **summary** of how people answered, never the verbatim takes. Ship order: apply migration, deploy, backfill. See "What was actually done". Fork 1 is moot (no one's words are exposed); fork 2 stays settled (zero-answer wall for humans).
**Related:** `docs/seo/2026-10-06-keyword-and-outreach-map.md` (Decision 1); `docs/question-page-seo-recommendations-2026-04-07.md`; `src/lib/server/personalityIsrContract.spec.ts` (contract-test pattern); `src/lib/server/contentAccessGuard.ts`.

---

## 0. What and why

Question pages send Googlebot about 1,300 characters: the question and nothing else. The give-first gate hides answers from crawlers too, so all question pages together got 144 impressions in the 90 days to 2026-10-02 (vs 348k for personality analyses).

DJ suggested putting the answers in JSON-LD only. **Don't.** Google's structured-data policy forbids marking up content readers can't see, and JSON-LD text also ignores `data-nosnippet`, so answers could show up in search snippets and AI Overviews, which is the exact bias DJ wants to avoid. The compliant route is Google's content-gating (paywall) pattern: serve the answers **only to IP-verified Googlebot**, mark the page with paywall structured data, and wrap the block in `data-nosnippet`. Humans' responses never contain the answers.

Expect a modest payoff: 47 live questions and 276 takes (median 42 characters) as of 2026-10-06. This makes the Q&A indexable and future-proof as the answer corpus grows; it is not a traffic step change by itself.

The research below was done read-only on 2026-10-06. Re-check line numbers before editing; other agents edit this repo in parallel.

## 1. Research summary (2026-10-06)

| Option                                                                                                   | Compliant?                                                                                                  | Meets "humans never see answers first"?                                                                                         | Verdict                                     |
| -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| (a) Answer text only in JSON-LD                                                                          | **No.** Marks up content that isn't visible, and Google has no documented use for it as indexable body text | No. It sits in page source for everyone, and structured data **ignores snippet controls**, so answers could show up in the SERP | Reject                                      |
| (b) Answers in everyone's HTML, hidden until answered, plus paywall markup                               | **Yes** (this is Google's documented paywall pattern)                                                       | **No.** Answers are in the DOM, page source and hydration JSON. Google itself calls this "isn't a reliable way to limit access" | Reject                                      |
| (c) Hidden-answers block served **only to verified Googlebot**, plus paywall markup and `data-nosnippet` | **Yes, with conditions:** the spam policy's content-gating exception plus flexible sampling                 | **Yes.** The server never sends answers to a human browser                                                                      | **Recommend**                               |
| (d) `data-nosnippet`                                                                                     | Yes. Google's paywall doc recommends it for exactly this case                                               | It keeps HTML answer text out of snippets and AI Overviews / AI Mode. It does **not** cover structured data                     | Use it, and keep answer text out of JSON-LD |

A side finding that is not in scope but matters:

1. **The AI "Sample perspectives" preview is dead in prod.** `getAIComments` reads `comments_ai` with the anon client. Since the 2026-09-03 RLS migration that table is admin-only, so prod always serves `aiComments:[]` (I checked the live HTML). The post-answer "Compare with nine AI perspectives" disclosure is dead for the same reason.

---

## Part 1: Google policy (exact URLs and quotes)

All quotes come from the live pages, fetched 2026-10-06.

### 1.1 Paywalled content structured data

URL: https://developers.google.com/search/docs/appearance/structured-data/paywalled-content

- Purpose: _"This structured data helps Google differentiate paywalled content from the practice of cloaking, which violates spam policies."_
- Scope includes registration-style gates: _"If you offer any subscription-based access to your website content, or if users must register for access to any content you want to be indexed, follow these steps."_ … _"Make sure to follow these steps for all versions of your page (including AMP and non-AMP)."_
- Rules: _"Don't nest content sections."_ and _"Only use `.class` selectors for the `cssSelector` property."_
- **Server-side gating is the anticipated implementation:** _"If you don't want the content to be accessible to the browser at the time of serving, choose a paywall implementation that doesn't supply the paywalled content to the browser."_
- Googlebot access: _"If you want Google to crawl and index your content, including the paywalled sections, make sure Googlebot, and `Googlebot-News` if applicable, can access your page."_ The word "Googlebot" in that sentence links to the Googlebot verification doc.
- Snippet control: _"To exclude certain sections of your content from appearing in search result snippets, use the `data-nosnippet` HTML attribute."_
- AI features: _"AI Overviews and AI Mode offer a preview of a topic or query based on a variety of sources, including web sources. As such, they are subject to Search's preview controls."_
- Supported types: `CreativeWork`, `Article`, `NewsArticle`, `Blog`, `Comment`, `Course`, `HowTo`, `Message`, `Review`, `WebPage`. `DiscussionForumPosting` is an `Article` subtype; `WebPage` is listed explicitly.
- Shape: `"isAccessibleForFree": false, "hasPart": {"@type": "WebPageElement", "isAccessibleForFree": false, "cssSelector": ".paywall"}`

### 1.2 General structured data policies ("don't mark up invisible content")

URL: https://developers.google.com/search/docs/appearance/structured-data/sd-policies

- _"Don't mark up content that is not visible to readers of the page. For example, if the JSON-LD markup describes a performer, the HTML body must describe that same performer."_
- _"Your structured data must be a true representation of the page content."_
- One listed reason rich results don't show: _"The content referred to by the structured data is hidden from the user."_
- Completeness: _"if you include multiple reviews, make sure that you include all of the reviews that are visible to people on the page."_

### 1.3 Cloaking, the content-gating exception, and hidden text

URL: https://developers.google.com/search/docs/essentials/spam-policies#cloaking

- _"Cloaking refers to the practice of presenting different content to users and search engines with the intent to manipulate search rankings and mislead users."_
- Example of cloaking: _"Inserting text or keywords into a page only when the user agent that is requesting the page is a search engine, not a human visitor."_
- **The exception that makes (c) legal:** _"If you operate a paywall or a content-gating mechanism, we don't consider this to be cloaking if Google can see the full content of what's behind the paywall just like any person who has access to the gated material and if you follow our Flexible Sampling general guidance."_
- Hidden text (same page): _"Hidden text or link abuse is the practice of placing content on a page in a way solely to manipulate search engines and not to be easily viewable by human visitors."_ Listed examples include _"Using CSS to position text off-screen"_ and _"Setting the font size or opacity to 0"_. Accordions, tabs and tooltips are allowed.

Flexible sampling: https://developers.google.com/search/docs/appearance/flexible-sampling

- _"Enclose paywalled content with structured data in order to help Google differentiate paywalled content from the practice of cloaking, where the content served to Googlebot is different from the content served to users."_
- Registration counts as a paywall: _"('Paywall,' in this context, applies equally to barriers that require either subscription or merely registration for content access.)"_
- Lead-in is recommended rather than required: showing the first few sentences before the wall is described with _"We think this is a good practice."_
- **Ranking warning:** _"even minor changes to the current sampling levels could degrade user experience and, as user access is restricted, unintentionally impact article ranking in Google Search."_

JS paywalls: https://developers.google.com/search/docs/crawling-indexing/javascript/fix-search-javascript#paywall

- _"Some JavaScript paywall solutions include the full content in the server response, then use JavaScript to hide it until subscription status is confirmed. This isn't a reliable way to limit access to the content. Make sure your paywall only provides the full content once the subscription status is confirmed."_ This is why option (b) fails DJ's requirement.

Dynamic rendering (a related bot-specific-response doc): https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering

- _"Using dynamic rendering to serve completely different content to users and crawlers can be considered cloaking."_ The Googlebot block must therefore be the same takes an unlocked person sees. It can be a subset, but never more and never different.

Secondary source: John Mueller via SEJ, 2020-12-11 (https://www.searchenginejournal.com/paywall-markup/390939/): _"Googlebot, of course, needs to be able to see the full content so that we can understand what it is that we should be showing your site for."_

### 1.4 Verifying Googlebot

The old URL https://developers.google.com/search/docs/crawling-indexing/verifying-googlebot now 301s to https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests

- Manual method: _"Run a reverse DNS lookup on the accessing IP address from your logs, using the `host` command."_ → _"Verify that the domain name is either `googlebot.com`, `google.com`, or `googleusercontent.com`."_ → then run a forward lookup and check it matches the original IP.
- Automatic method: _"Alternatively, you can identify Googlebot by IP address by matching the crawler's IP address to the lists of Google crawlers' and fetchers' IP ranges."_ The list is `https://developers.google.com/static/crawling/ipranges/common-crawlers.json`. I fetched it OK: 317 prefixes, creationTime 2026-10-06.
- Common crawlers, Googlebot included, resolve to `crawl-***.googlebot.com` / `geo-crawl-***.geo.googlebot.com`. Google-InspectionTool (URL Inspection and Rich Results Test) is a common crawler, so DJ can test the change in GSC.
- Vercel BotID's `checkBotId().isVerifiedBot` is built for client-challenged fetch/POST routes, not crawler document GETs (https://vercel.com/docs/botid/verified-bots). Don't rely on it here.

### 1.5 `data-nosnippet`

URL: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#data-nosnippet-attr

- _"You can designate textual parts of an HTML page not to be used as a snippet. This can be done on an HTML-element level with the `data-nosnippet` HTML attribute on `span`, `div`, and `section` elements."_ The HTML must be valid with closed tags, because an unclosed `div` swallows everything after it.
- _"To avoid uncertainty from rendering, do not add or remove the `data-nosnippet` attribute of existing nodes through JavaScript."_ It must be in the SSR HTML.
- **Structured data is exempt:** _"Robots `meta` tag limitations don't affect the use of that structured data, with the exception of `article.description` and the `description` values…"_ and _"Also note that structured data remains usable for search results when declared within a `data-nosnippet` element."_ `max-snippet` also _"does not interrupt"_ uses where _"the publisher supplies content in the form of in-page structured data"_.
- Page-level `nosnippet` _"will also prevent the content from being used as a direct input for AI Overviews and AI Mode."_ The paywall doc applies the same preview controls to AI Overviews and AI Mode (1.1).
- On indexing: Google frames `data-nosnippet` purely as a snippet/preview control. `noindex` is the only index exclusion. Google doesn't state explicitly that `data-nosnippet` text is ranked. The working assumption, consistent with the paywall doc recommending it, is that the text is indexed but never quoted.

### 1.6 QAPage vs DiscussionForumPosting

QAPage: https://developers.google.com/search/docs/appearance/structured-data/qapage

- _"Users must be able to submit answers to the question."_ 9takes fits on this point.
- _"Make sure each `Question` includes the entire text of the question and make sure each `Answer` includes the entire text of the answer."_
- _"To be eligible for the rich result, a question must have at least one answer"_
- _"The content from the answers may appear in the basic result if the rich result is not shown."_ **That is the bias leak DJ wants to avoid.**
- AI content: `digitalSourceType: TrainedAlgorithmicMediaDigitalSource`. _"If this property is not specified, Google will assume the content is human-generated."_

DiscussionForumPosting: https://developers.google.com/search/docs/appearance/structured-data/discussion-forum

- _"Does your forum follow a question and answer pattern? Use Q&A markup instead."_ Also: _"If the structure of the forum website is primarily questions with answers, we recommend that you use Q&A markup instead."_
- _"Only use `DiscussionForumPosting` markup to describe a user-generated post on a website."_
- _"make sure each `Comment` includes the entire text of the response if it's found on that page."_ `comment` is recommended, not required.

**Verdict:** QAPage would be the textbook fit if answers were public. While they're gated it's the wrong tool: it requires the full answer text in JSON-LD, it marks up content hidden from users (so it's ineligible), and answer text can surface in results. Keep the existing `DiscussionForumPosting` + `WebPage` graph with `commentCount` and **no `comment` nodes**, and add only the paywall flags.

### 1.7 Answers to (a)–(d)

- **(a) JSON-LD-only answer text: not compliant, and not useful.** It violates "Don't mark up content that is not visible to readers of the page". Google lists hidden content as a reason for rich-result ineligibility, which also risks a structured-data manual action. Nothing in Google's docs says JSON-LD text is indexed as page body text for ranking. It is also the one channel `data-nosnippet` can't suppress, so it maximises the snippet/AI-preview bias risk. And it ships to every visitor's page source.
- **(b) Answers in everyone's HTML, hidden until answered, plus paywall markup: compliant (it's Google's own example), but it fails the product requirement.** The takes would be in page source, the DOM and the SvelteKit hydration JSON for every visitor. Google: "isn't a reliable way to limit access". It also reverses the invariant guarded by `curatedReveal.page.server.spec.ts:244-268` and the code comment at `QuestionContent.svelte:251-253` ("Real community takes never reach the DOM before the user answers").
- **(c) Answers block served only to verified Googlebot, plus paywall markup: compliant, under the spam policy's explicit "paywall or a content-gating mechanism" exception.** Conditions:
  1. Googlebot sees what an unlocked person sees ("just like any person who has access"). A subset is fine; more or different is not.
  2. Paywall markup is present.
  3. Flexible-sampling guidance is respected. The question text, context and take count act as the lead-in. The gate is free, anonymous, one step and needs no account, which is lighter than the "registration" case Google explicitly covers.
  4. Verification is done by IP or reverse DNS, not by user agent alone. A spoofed `Googlebot` UA must get nothing.

  Google states the trade-off itself: restricted access can "impact article ranking". Treat the upside as indexing plus long-tail relevance, not guaranteed top rankings.

- **(d) `data-nosnippet`: yes, for HTML text.** Google's paywall doc prescribes it for this case, and preview controls also govern AI Overviews and AI Mode. Limits: it must sit on `section`, `div` or `span`, be present in the SSR HTML (not added by JS), and use valid HTML. It does **not** apply to structured data, which is the hard reason answer text must never go into JSON-LD. The meta description must also never contain take text. Today it doesn't: `buildSeoDescription` uses question, context, categories and count (`+page.svelte:444-463`).

---

## Part 2: Code findings (read-only)

### 2.1 Page load and gate (`src/routes/questions/[slug]/+page.server.ts`)

- `load` is at `:129-256`. The question is fetched with `getQuestion()` (`src/lib/server/questionComments.ts:194-209`), which filters `.not('removed','is',true).not('flagged','is',true)` at `:202-203`. **Flagged questions 404 before any take is read** (`+page.server.ts:138-141`), so DJ's 358 flagged questions stay hidden automatically.
- The gate is enforced server-side: `checkUserAnswered()` calls RPC `can_see_comments_3(userfingerprint, questionid, userid)` (`questionComments.ts:216-228`). It is called at `+page.server.ts:146-155` with cookie `9tfingerprint` and the session user. A signed reply-notification return also unlocks (`:155`).
- **Unanswered branch** (`:157-200`):
  - Records `gate_shown` (`:160-169`, only when a cookie is present and not in demo mode).
  - Fetches `getCommentCount` (`:818-826`), `getAIComments` (`:1016-1026`) and curation/next-starter.
  - Returns `comments: []` with `userHasAnswered:false` (`:179-199`). No takes are fetched at all.
- **Answered branch** (`:202-255`): `getQuestionTakes()` (`src/lib/server/questionTakes.ts:12-35`) calls the service-role RPC `get_question_take_data`. That RPC is defined in `supabase/migrations/20260907175553_comment_ranking.sql:14-51` and is EXECUTE for `service_role` only. It returns up to 100 non-removed top-level takes and includes **`author_id`, `profiles.external_id`, `profiles.enneagram`, and `comment_like[].user_id`**. Never pass those to a crawler payload. The branch also loads removed comments, links, flag reasons and reply focus.
- Unlocked users see a "Type N" label that links to `/users/{external_id}`, or "Anonymous" (`src/lib/components/molecules/Comment.svelte:540-555`). The crawler block should show the label **without** the profile link.
- Live data, via read-only `scripts/db-query.sh` on 2026-10-06:
  - 47 live questions (unflagged and unremoved), 365 flagged.
  - 276 live top-level takes on all 47: 154 anonymous, 122 with a type label.
  - Median take is 42 chars (mean 117). 47 takes are under 20 chars; 10 contain URLs; 0 contain emails.
  - The top page (`what-were-you-like-as-a-kid-in-3-words`) has 43 takes and about 3.4k chars. Most pages have under 2k chars of takes.

### 2.2 Existing JSON-LD (`src/routes/questions/[slug]/+page.svelte`)

- `:613-704` builds an `@graph` of `DiscussionForumPosting` (`#post`, `commentCount`, author "Anonymous 9takes member", no `comment`), `WebPage` (`#webpage`, `mainEntity` → `#post`) and `BreadcrumbList`. `SEOHead` emits it at `:827-836`.
- The comment block at `:620-631` states the give-first guardrail ("never put answer markup around gated comments"), which comes from `docs/question-page-seo-recommendations-2026-04-07.md:107-127`. The paywall flags don't violate it because they add no answer markup, but the comment should be updated.
- Robots meta is `index, follow, max-image-preview:large, max-snippet:-1, …` (`src/lib/components/SEOHead.svelte:72-73`).
- Visible gate copy: `"COMMENTS HIDDEN UNTIL YOU ANSWER"` (`+page.svelte:922-929`); the locked shell is at `QuestionContent.svelte:238-318`.

### 2.3 AI per-type takes

- `comments_ai` is read in **both** branches with the anon client (`+page.server.ts:1016-1026`). Before answering, up to 3 render as **blurred**, `aria-hidden` "Sample perspectives" cards (`QuestionContent.svelte:105-106, 240-269`). After answering they render in a "Compare with nine AI perspectives" disclosure (`:353-367`).
- **This is broken in prod.** `comments_ai` has RLS on, and its only policy is `audit_admin_management` for authenticated admins (`20260903230508_security_rls_storage_rpc.sql:56-58`). Anon gets `[]` silently. The live HTML shows `aiComments:[]` even though all 47 live questions have AI rows (423 rows total).
- `nine_takes` (chorus) is **not** used on question pages. It's only used in personality-analysis and `src/lib/server/nineTakes*.ts`.
- If someone fixes the AI read later, the blurred AI text would land in every human's HTML and in Googlebot's. Either wrap it in the same `data-nosnippet` / paywall class, or decide to show it unblurred as a lead-in (see fork 2).

### 2.4 Caching

- `/questions/[slug]` has **no ISR** and exports no `config` (grep confirmed). The only ISR route is `src/routes/personality-analysis/[slug]/+page.server.ts:79-87`.
- **Live headers**, checked with curl on 2026-10-06 for both a Googlebot UA and a Chrome UA: `cache-control: public, max-age=0, must-revalidate`, `x-vercel-cache: MISS`, about 38.7 KB, about 1.0k visible text chars, `comments:[]`. Pages are rendered per request and not stored by the CDN, so a per-request Googlebot variant can't poison a cache today.
- `hooks.server.ts`:
  - The UA hard-block and Cache-Control/Vary logic apply only to `getProtectedContentPath()` routes (`:85-121`, `:200-227`).
  - `contentAccessGuard.ts:188-238` does not include `/questions`, so training crawlers are handled on `/questions` by robots.txt only.
  - Signed-in responses get `private, no-store` (`:240-247`).
- `contentAccessGuard.ts:263-280` documents the trap: _"The ISR cache is keyed by pathname alone: `Vary` is not part of the key."_ If anyone ever ISR's `/questions/[slug]`, a Googlebot-variant render would be replayed to humans, or a locked render to Googlebot. Guard against this with a contract test.
- Googlebot detection today is **UA regex only** (`SEARCH_PREVIEW_BOTS`, `contentAccessGuard.ts:128-148`). No reverse DNS or IP verification exists anywhere. The only `node:dns` use is `safeExternalFetch.ts`.
- Client IP comes from `event.getClientAddress()` (`hooks.server.ts:332-338`), which is Vercel-provided.

### 2.5 Funnel and telemetry that must not break

- `src/lib/server/giveFirstFunnel.ts`:
  - `gate_shown` requires a fingerprint (`:87-89`) and drops crawler UAs, including `google-inspectiontool` and `/bot/i` (`:36-81`, `:94-96`).
  - `contribution` is always recorded (`+page.server.ts:350-360`). The canonical funnel query joins on fingerprint.
- The view tracker (`increment_comment_views`) only arms when `flags.userHasAnswered` is true (`QuestionContent.svelte:78-98`). Keep Googlebot at `userHasAnswered:false` so its JS render never bumps view counts.
- Client impression tracking (`observeQualifiedQuestionImpression`, `+page.svelte:100-125`) is unchanged by this plan.

### 2.6 Existing tests that guard the gate

- `src/routes/questions/curatedReveal.page.server.spec.ts`:
  - `:171-188` checks the gate holds without a cookie.
  - `:244-268` asserts "never sends boosted human takes before the visitor answers": `comments` is `[]`, there's **no `get_question_take_data` call**, and there's no `ownComments`.
- `src/routes/questions/replyFocus.page.server.spec.ts:206` checks the reply thread never resolves for an unanswered viewer.
- `src/lib/server/giveFirstFunnel.spec.ts` (crawler filtering and event recording), `src/lib/server/questionComments.spec.ts`, `src/lib/server/contentAccessGuard.spec.ts`.
- Pattern to copy for a cache contract test: `src/lib/server/personalityIsrContract.spec.ts`.
- JSON-LD escaping: `src/lib/utils/jsonLd.spec.ts`.

---

## Part 3: Recommendation (lean version)

**Serve a server-rendered "gated takes" section only to IP-verified Googlebot. Wrap it in `data-nosnippet`, flag it with paywall structured data, keep all answer text out of JSON-LD, and mark crawler responses `private, no-store`.**

### Files to touch

1. **New `src/lib/server/verifiedGooglebot.ts`:** `isVerifiedGooglebot({ userAgent, ip }): boolean`.
   - The UA must match `/Googlebot|Google-InspectionTool/i` and must not match `GoogleOther`.
   - The IP must fall inside Google's `common-crawlers.json` prefixes. Do a pure-TS CIDR match for IPv4 and IPv6.
   - Load the ranges from a committed snapshot at `src/lib/server/generated/google-common-crawlers.json`.
   - **Fail closed:** any parse error, missing IP or no match returns false.
   - Optional fallback for a UA-claimed Googlebot that misses the snapshot: reverse+forward DNS with `node:dns/promises`, a 300 ms timeout, and a per-IP in-memory memo. I'd skip it in v1, since a stale snapshot only means a missed crawl, never a leak.
2. **New `scripts/fetch-google-crawler-ranges.mjs`.** Add it to `build:vercel` in a tolerant mode: keep the committed snapshot on network failure. This refreshes ranges on every deploy.
3. **New `src/lib/server/indexableTakes.ts`:** `getIndexableTakes(questionId)`.
   - Reuse `getQuestionTakes(questionId, { limit: 40 })` with **no** viewer and **no** fingerprint, so `is_own` is false.
   - Drop `ranking_low_effort` takes and takes under 20 chars or with no letters.
   - Order: pinned first (curation already loaded), then likes, then newest.
   - Cap at **20 takes × 800 chars** each.
   - Project to exactly `{ id, text, typeLabel }`. `typeLabel` is `"Type N"` when `profiles.enneagram` is 1–9, else `"Anonymous"`.
   - Redact emails and phone patterns. Turn URLs into plain text with no `<a>`.
   - Return `null` when fewer than **3** usable takes remain (thin-content threshold).
   - **Never** return `author_id`, `external_id`, like rows or fingerprints. SvelteKit serializes everything a load returns into the HTML.
4. **`src/routes/questions/[slug]/+page.server.ts`:**
   - In `load`, compute `const verifiedCrawler = !isDemoTime && isVerifiedGooglebot({ userAgent: event.request.headers.get('user-agent'), ip: <getClientAddress, try/catch> })`.
   - In the **unanswered** branch only:
     - Add `verifiedCrawler ? getIndexableTakes(question.id) : null` to the existing `Promise.all`.
     - When `verifiedCrawler`, call `event.setHeaders({ 'cache-control': 'private, no-store' })`.
     - Return `indexableTakes`.
   - Keep `comments: []`, `flags.userHasAnswered: false`, and the `gate_shown` path unchanged. It already skips crawlers by UA and by missing cookie.
   - Human requests never call `get_question_take_data`, so the existing spec stays true for humans.
5. **`src/routes/questions/[slug]/+page.svelte`:**
   - Render the section only when `data.indexableTakes?.length`. Put it below `.open-case-floor`, not nested inside another gated section.
   - Render it **visibly**, with no CSS hiding. Humans never receive it, so visible rendering avoids any hidden-text ambiguity in Google's rendered view.
     ```svelte
     <section class="gated-takes" data-nosnippet aria-labelledby="gated-takes-title">
     	<h2 id="gated-takes-title">What people answered</h2>
     	<ol>
     		{#each data.indexableTakes as take (take.id)}
     			<li>
     				<span class="gated-takes__type">{take.typeLabel}</span>
     				<p>{take.text}</p>
     			</li>
     		{/each}
     	</ol>
     </section>
     ```
   - Put `GATED_TAKES_CLASS = 'gated-takes'` in a shared constant so markup and JSON-LD can't drift.
   - Add the paywall flags to the JSON-LD when `comment_count >= 3`. Emit them on **every** response, human and crawler, because Google says to mark "all versions of your page". The human version doesn't contain the section, which is exactly the "doesn't supply the paywalled content to the browser" case. Never add `comment`/`Answer` nodes or any take text:
     ```json
     {
     	"@context": "https://schema.org",
     	"@graph": [
     		{
     			"@type": "DiscussionForumPosting",
     			"@id": "https://9takes.com/questions/<slug>#post",
     			"headline": "…",
     			"text": "<question + user context only>",
     			"commentCount": 43,
     			"isAccessibleForFree": false,
     			"hasPart": {
     				"@type": "WebPageElement",
     				"isAccessibleForFree": false,
     				"cssSelector": ".gated-takes"
     			}
     		},
     		{
     			"@type": "WebPage",
     			"@id": "https://9takes.com/questions/<slug>#webpage",
     			"mainEntity": { "@id": "…#post" },
     			"isAccessibleForFree": false,
     			"hasPart": {
     				"@type": "WebPageElement",
     				"isAccessibleForFree": false,
     				"cssSelector": ".gated-takes"
     			}
     		},
     		{ "@id": "…#breadcrumb", "@type": "BreadcrumbList", "…": "…" }
     	]
     }
     ```
   - Ideally extract the graph builder to a pure `buildQuestionStructuredData()` in `$lib/utils/` so it can be unit-tested.
   - Update the guardrail comment at `:620-631`.
6. **Docs:** a short note in `docs/seo/` (alongside `personality-isr.md`) recording the invariant: no ISR or shared cache on `/questions/[slug]`, and no answer text in JSON-LD.

### Tests to add

- `verifiedGooglebot.spec.ts`:
  - Googlebot UA + Google IPv4 → true. Same with IPv6 → true.
  - **Googlebot UA + non-Google IP → false** (the spoof case).
  - Chrome UA + Google IP → false.
  - GoogleOther + Google IP → false.
  - Google-InspectionTool + Google IP → true.
  - Missing or garbage IP → false. Malformed snapshot → false.
- `indexableTakes.spec.ts`:
  - Output keys are exactly `{id,text,typeLabel}`; no `author_id`, `external_id`, `user_id` or `is_own` anywhere in the JSON.
  - Low-effort takes and takes under 20 chars are dropped. The 20-take and 800-char caps hold.
  - Emails and phones are redacted. Fewer than 3 usable takes → `null`.
  - Type label is 1–9 or "Anonymous".
- `crawlerTakes.page.server.spec.ts`, in the style of `curatedReveal`:
  1. Unanswered human, including one with a spoofed Googlebot UA: `comments:[]`, no `indexableTakes`, **no `get_question_take_data` call**.
  2. Verified Googlebot: `indexableTakes` present, `userHasAnswered:false`, `comments:[]`, `setHeaders` called with `private, no-store`, `recordGiveFirstEvent` not called.
  3. Flagged or removed question: 404, and the takes RPC is never called.
  4. Demo mode: no crawler takes.
- `questionRouteCacheContract.spec.ts`, a static scan like `personalityIsrContract.spec.ts`:
  - `[slug]/+page.server.ts` exports no `config`/`isr` and never sets `s-maxage`/`public` on the crawler path.
  - The structured-data builder never references `indexableTakes`, `comments` or `comment`.
- `buildQuestionStructuredData` unit test:
  - Paywall flags appear only when count ≥ 3.
  - `cssSelector === '.' + GATED_TAKES_CLASS`.
  - No take text appears in the serialized JSON-LD.
- Keep green: `curatedReveal` `:171-188` and `:244-268`, `replyFocus` `:206`, `giveFirstFunnel.spec.ts`.

### Post-deploy verification (about 15 minutes, DJ or an agent)

1. GSC URL Inspection → Test live URL on `what-were-you-like-as-a-kid-in-3-words` → View tested page. The HTML should contain `.gated-takes` with `data-nosnippet`. Request indexing.
2. Run the Rich Results Test on the same URL. JSON-LD should parse, and there should be no answer text in the structured data.
3. `curl -A "Googlebot/2.1"` from a laptop. The response must **not** contain `gated-takes` (proves the spoof protection), and its headers must not be `public, s-maxage`.
4. After 2–4 weeks: GSC Performance filtered to `/questions/`, against the 144-impressions-in-90-days baseline. Also search an exact take phrase in quotes and confirm the page ranks while the snippet doesn't show the take.

### Risks

- **Policy fit.** The gate is "write an answer", which is a novel gate. It fits "content-gating mechanism", but Google's examples are paid or registration walls. Mitigations: Googlebot gets a subset of exactly what unlocked users see, the markup is present, and the question and context are a visible lead-in. Worst case is lost rich-result eligibility or weak ranking, not a site-wide penalty, as long as the content matches.
- **Ranking upside is bounded.** Only 47 live pages, a median take of 42 chars, and most pages under 2k chars. Google warns that walls can "impact article ranking". Expect long-tail gains, not a step change.
- **Anonymity expectations.** Takes were written under "Other answers stay blurred / Anonymous · no account required". Several questions are confessional ("biggest fear", "afraid to tell your partner", "tell parents…"). Indexing makes the wording findable by exact-phrase search, though not quoted in snippets and not linked to a profile, because the crawler block drops the `/users/` link. This is fork 1 below.
- **Page source exposure.** Nothing changes for humans: the server never sends takes to non-verified requests.
- **Caching.** Safe today because responses are per request and not CDN-cached (verified). The danger is a future ISR or `s-maxage` on this route, which the contract test blocks. `Vary: User-Agent` would not help, since IP verification can't live in a cache key and ISR ignores `Vary`.
- **Snapshot staleness.** A stale IP list means some Googlebot fetches miss the block. That fails safe, and rebuilds refresh the list.
- **Other engines.** Bing and others get the human page. Adding verified Bingbot later is the same pattern.
- **SvelteKit detail.** `setHeaders` throws if the same header is set twice in one request. No other load on this route sets `cache-control` today; keep it that way.

### Effort

About **0.5–1 day** of agent time:

- Verifier, range script and specs: about 2.5 h.
- Load branch and projection: about 1.5 h.
- Svelte section and JSON-LD refactor: about 1 h.
- Page-server and contract specs: about 1.5 h.
- Deploy plus GSC check: about 15 min of DJ time.

### Ambitious version (pitch)

Make each question page a real search landing page rather than only feeding Googlebot. Ship this Googlebot-gated block, and add a **visible, non-biasing lead-in for humans** that is also indexable:

- A per-type participation strip ("43 takes · most from 4s and 9s").
- The nine AI sample perspectives, which needs the `comments_ai` RLS read fixed first.
- Answer-intent title and meta rewrites.

That satisfies flexible sampling's lead-in advice and gives searchers a reason to stay and answer. Cost is about +1–2 days.

---

## Forks for DJ (user-facing only)

1. **Existing takes: index retroactively, or only going forward?**
   - Default: index existing takes on all 47 live questions, and add one line under the answer box: "Stays anonymous. Search engines may index it, but never show it in previews."
   - Veto option: only index takes posted after the notice ships. That means near-zero content at launch.
2. **Lead-in for search visitors. SETTLED by DJ (2026-10-06): keep the zero-answer wall.** Humans see the question, context and take count only. No visible AI or human takes before answering. (The dead AI "Sample perspectives" read is a separate bug; if someone fixes it, it must not show readable takes before the visitor answers.)
3. _(Optional)_ **Sensitive questions.** Default is to include all live questions. You could exclude a hand-picked set, such as the fear and partner/parents confessions, from the crawler block.

---

## What was actually done

### DJ's decision (2026-10-07), replacing Part 3's "serve the verbatim takes to Googlebot"

Google sees a **general summation of how people answered** each question, never anyone's exact words. Humans still see **zero answers** before posting their own. Humans see the same summary **after** they answer ("The gist so far"), which makes the Googlebot-visible block the genuinely gated content. That keeps it inside Google's paywall / content-gating guidance (Part 1.3) instead of cloaking. Because no one's words are exposed, fork 1 (index existing takes or only new ones) is moot.

### What was built (2026-10-07, not yet committed or deployed)

| Piece                                                                                                                                                                                                                                                                                                                                                     | File                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Table `question_answer_summaries` (question_id PK → questions ON DELETE CASCADE; `summary` NULL until a draft passes the guards; `source_comment_count`; `model`; `generated_at`; `failed_comment_count`/`failed_at`). RLS on, no policies, anon/authenticated revoked. **Not applied to prod.**                                                          | `supabase/migrations/20261007120000_question_answer_summaries.sql`, hand-added to `database.types.ts`                |
| Summary pipeline: human-take loader, prompt, guards, OpenRouter caller, refresh run. Transport-agnostic so the script shares it.                                                                                                                                                                                                                          | `src/lib/server/questionAnswerSummary.ts`                                                                            |
| Googlebot verification: UA (`Googlebot` / `Google-InspectionTool`) **and** reverse DNS → `*.googlebot.com` / `*.google.com` → forward-confirm. Per-IP memo (6 h verified, 1 h miss, 5 min DNS error), 1.5 s timeout, fails closed.                                                                                                                        | `src/lib/server/verifiedGooglebot.ts`                                                                                |
| Loader: locked branch sends the gist only to verified Googlebot, plus `Cache-Control: private, no-store`. Humans get only `answerSummaryAvailable` (existence, never text). The answered branch gets the gist. Demo mode skips all of it. The dead `getComments(removed=true)` read was dropped from the reveal batch.                                    | `src/routes/questions/[slug]/+page.server.ts`                                                                        |
| Block: `<section class="answer-gist" data-nosnippet>`, visible (no CSS hiding), "AI summary of N takes. Paraphrased, never quoted." Renders under "Your take" in the revealed thread (`gist` slot in RankedComments), and in the locked shell only when the server sent it (= verified Googlebot). The blurred AI sample cards also got `data-nosnippet`. | `src/lib/components/questions/AnswerGist.svelte`, `answerGist.ts`, `QuestionContent.svelte`, `RankedComments.svelte` |
| JSON-LD: `isAccessibleForFree: false` + `hasPart` WebPageElement `cssSelector: ".answer-gist"` on both the DiscussionForumPosting and WebPage nodes whenever a gist exists, on every version of the page. Gist text never in JSON-LD. Guardrail comment rewritten.                                                                                        | `src/routes/questions/[slug]/+page.svelte`                                                                           |
| Hourly cron (`20 * * * *`), `CRON_SECRET`, at most 10 questions per run, 120 s budget, `maxDuration` 300.                                                                                                                                                                                                                                                 | `src/routes/api/cron/question-summaries/+server.ts`, `vercel.json`                                                   |
| Backfill script `pnpm gen:question-summaries` (`--dry`, `--id=1,2`, `--limit=N`, `--force`). Dry runs print to stdout only and tolerate the missing table.                                                                                                                                                                                                | `scripts/gen-question-summaries.ts`, `package.json`                                                                  |

**What counts as a human take:** a top-level take (`parent_type = 'question'`) in the real `comments` table on a live question, not removed, with non-empty text, and no uncleared `flagged_comments` report. Replies, demo tables and `comments_ai` don't count. Host (admin) takes do count, since they show in the revealed thread, but **all admin accounts count as one person**. DJ has two Type 8 admin accounts, which would otherwise pass the two-people bar for naming a type on their own.

**Guards (code, not just prompt):**

- Rejects any 6+ word run shared with a take (case and punctuation normalized). Runs that also appear in the question text are exempt.
- Rejects proper nouns copied from a take (mid-sentence capitalized words, common words allowlisted).
- Rejects quotes, links, emails, handles, lists, a banned-word list (AI tells, etiology, prompt plumbing like "reference take"), and lengths outside 50–230 words.
- On threads of 3+ takes, rejects "singling out" phrasings ("the outlier", "one person", "only one answer…", "another wants…").
- Up to 3 attempts, each retry fed the specific reason.
- A failure is recorded at that take count and **not retried until the count changes**, so a stubborn thread can't bill every hour.
- If a take was removed and regeneration fails, the old summary is deleted so it can't keep paraphrasing removed content.
- Logged reasons never contain user text.

**Prompt:** 9takes voice per `9takes-editorial-standards`.

- Lead with the sharpest pattern.
- No etiology.
- Name a type's cluster only when 2+ different people of that type answered.
- The nine `comments_ai` takes are context for missing or present lenses only, never counted as answers.
- Thin threads (1–2 takes) get one abstract clause plus the lenses still missing.

**Model:** `anthropic/claude-sonnet-5.5` → fallback `anthropic/claude-haiku-4.5`, `reasoning: { effort: 'low' }`. Sonnet 5.5 rejects `reasoning: { enabled: false }`, the hostDigest setting.

**Tests:** `verifiedGooglebot.spec.ts`, `questionAnswerSummary.spec.ts`, `questions/answerGist.page.server.spec.ts` (loader contract), `questions/answerGistContract.spec.ts` (static: no ISR/s-maxage, no gist in JSON-LD, class + `data-nosnippet`, RLS), `api/cron/question-summaries/question-summaries.server.spec.ts`. `pnpm vitest run src/routes/questions src/lib/server src/lib/components/questions src/routes/api/cron/question-summaries`: 95 files / 734 tests pass. `pnpm check`: 0 errors.

**Dry runs (2026-10-07, read-only, stdout only):**

- 13 questions summarized, 1–43 takes each, after three prompt iterations.
- The iterations fixed: a type example the model kept copying, meta-language ("reference takes"), and retelling single answers.
- Guards fired as intended: one verbatim copy, two singling-out drafts. All passed by attempt 2.
- Cost: about $0.008–0.012 per question. Total dry-run spend about $0.30.

### Ship order

1. Apply `20261007120000_question_answer_summaries.sql` to prod. Until then, the loader reads fail closed to "no gist" and the cron's real run refuses to start (it errors, it doesn't regenerate blindly).
2. Deploy. Check `vercel ls 9takes --prod` (no build-budget trip expected: no new static assets).
3. `pnpm gen:question-summaries`: the real backfill, about 47 questions, **about $0.45–0.60** (ceiling about $1.50 if every question needed all 3 attempts). Then the hourly cron keeps it current. At today's take volume that's well under $2 a month.

### Verify after deploy

1. **Spoof check:** `curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" https://9takes.com/questions/what-were-you-like-as-a-kid-in-3-words | grep -c 'class="answer-gist'` → `0`. A laptop IP fails reverse DNS, so it gets the human page. `curl -sI` with the same UA should **not** show `private, no-store` (that header is only for verified Googlebot).
2. **Paywall markup on the human page:** the same curl → `grep -o '"cssSelector":"[^"]*"'` → `".answer-gist"`, and no summary text anywhere in the page source or `__data`.
3. **GSC URL Inspection** → Test live URL on the same page → View tested page → HTML: find `<section class="answer-gist…" data-nosnippet` with the summary inside. This works because Google-InspectionTool resolves to `*.googlebot.com`. Then Request indexing. Repeat for 2–3 more questions.
4. **Rich Results Test:** JSON-LD parses, with `isAccessibleForFree: false` and `hasPart` present, and no summary text in the structured data.
5. **Human flow:** answer a question in a private window. "The gist so far" appears under "Your take".
6. **Readout in 2–4 weeks:** GSC Performance filtered to `/questions/` against the 144-impressions-in-90-days baseline.

### Open / for DJ

- **Veto points:**
  - Host takes count toward summaries (as one person).
  - Summaries are labelled "AI summary of N takes. Paraphrased, never quoted."
  - The block sits under your own take, above the sort bar.
- **Accepted edge case:** if one take is removed and another added in the same hour, the count doesn't change, so the summary isn't regenerated until the next take.
- Not done: Bingbot (same pattern later), committing, deploying, applying the migration, the backfill.
