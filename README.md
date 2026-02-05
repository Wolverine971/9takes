<!-- README.md -->

# 9takes

> Anonymous questions and answers with a touch of personality
>
> Find out what people think, feel and do
>
> this is a rewrite of 9takes

## Why the name 9takes

9takes comes from the 9 personality types within the Enneagram. Therefore there are 9 personalities/ worldviews/ takes on life.

## Reasons for rewrite

- Need Authentication --> Svelte Auth
- Want to use SQL db --> Supabase
- Need SSR and Static rendering strategies

## Bug Review Findings (2026-02-05)

Scope: questions page, Enneagram corner, personality analysis pages, and auth flows. Static review only.

Findings (ordered by severity):

- High: Questions category URLs use slug strings, but the server expects numeric IDs. Direct links or refresh with `?category=slug` will send `NaN` to the RPC and can 500. `src/routes/questions/+page.svelte:151-155`, `src/routes/questions/+page.server.ts:65-77`.
- High: Personality analysis `[slug]` page assigns to `post`, `comments`, and `userHasAnswered` without declaring them, which should fail type-checking/build in Svelte/TS. `src/routes/personality-analysis/[slug]/+page.svelte:36-48`.
- High: Reset password server module has an invalid import under `verbatimModuleSyntax` (`Actions` should be type-only; `type` is not a named export). This should break compilation. `src/routes/resetPassword/+page.server.ts:2`.
- Medium: Questions search typeahead requires auth, but the UI attempts to query for logged-out users, which yields 401s and surfaces as "search unavailable." `src/lib/components/questions/SearchQuestion.svelte:70-129`, `src/routes/api/questions/typeahead/+server.ts:6-84`.
- Medium: Personality analysis `[slug]` caches `userHasAnswered` and comments for 5 minutes without invalidation on new comments. A user who just commented can still be blocked on refresh, and new comments may not appear until cache expiry. `src/routes/personality-analysis/[slug]/+page.server.ts:9-110`.
- Low/Medium: Login layout’s `onAuthStateChange` uses the wrong callback signature and calls `session.user.set`, which is not a store. The password recovery "redirect" return is also ignored, so this logic is effectively dead. `src/routes/login/+layout.svelte:7-25`.
- Low: Personality analysis `[slug]` reinitializes `IntersectionObserver` on navigation without disconnecting the previous one, which can leak observers across in-app navigation. `src/routes/personality-analysis/[slug]/+page.svelte:120-218`.
