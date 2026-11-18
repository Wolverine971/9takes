<!-- docs/development/testing-priorities.md -->

# Test cleanup and priorities

The next testing investment should cover the boundaries between the browser, SvelteKit, and the database. Most existing unit tests protect useful behavior. More tests of campaign wording or source-code spelling would add little confidence.

## Cleanup on November 17 2026

The initial inventory contained 291 Vitest files with 2,120 test cases, three Playwright specs, and three SQL test scripts. The audit scanned the Vitest suite for missing assertions, conditional exits, source scans, and shallow assertions, then reviewed candidates alongside related behavior tests.

Removed or replaced:

- The email compose SSR test asserted a fragment of Svelte's generated JavaScript. The existing compose interaction test now checks the rendered personalization placeholder.
- The admin dialog inventory banned particular markup and CSS names. It did not exercise opening, closing, focus, or scroll locking. Those behaviors remain covered by `Modal.spec.ts`, compose/editor integration tests, and the styleguide browser test.
- Five personality ISR source scans checked spelling such as `locals.session` and `if (!userHasAnswered)`. The loader suite already checks the exported cache configuration and unpublished responses. It now executes a load with forbidden visitor-state getters, checks the returned payload, and tests an admin visiting a draft. New discussion GET tests exercise locked, unlocked, unidentified, and failed-lookup requests, including private cache headers.
- Editorial assertions locked beta-card word counts and pronouns, sidebar wording, a newsletter P.S., email subjects, a retired error-page phrase, and cluster-tag mentions in writing documentation. Routing, personalization, campaign eligibility, CTA destinations, validation, and accessibility checks remain.
- The beta headline test could return before asserting if campaign copy stopped using `{name}`. Explicit fixtures now test repeated placeholders, whitespace trimming, and absent-name fallbacks independently of campaign edits. Storage stubs are also restored after each test.
- The preview test claimed scripts had not executed by checking a dataset field in jsdom. That assertion provided no evidence of browser sandbox enforcement. Assertions on the iframe sandbox, CSP, and referrer policy remain; actual execution isolation needs a browser test.

The baseline also exposed an unintended live-site crawl when `audit-malformed-links.spec.mjs` imported its helper. The script now runs its CLI only when invoked directly, with a regression test proving imports make no fetch calls.

## Coverage worth keeping

Small tests are useful when they protect a real failure mode. Keep UUID and URL validation, HTML/JSON-LD escaping, identity binding, suppression checks, failure handling, date boundaries, deterministic ranking, and accessible keyboard behavior.

Keep the remaining security and deployment source guards until stronger coverage exists. For example, the answer-summary privilege guard, raw-HTML restrictions, analytics SQL inlining guard, and Vercel background-work guard target documented risks. Their limits should not be mistaken for proof that the database or deployment behaves correctly.

Useful existing suites include:

- [Homepage answer endpoint](../../src/routes/api/homepage/answer/answer.server.spec.ts): duplicate submissions, identity, rate limits, closed gates, and write/read failures.
- [Question mutations](../../src/routes/questions/questionMutations.page.server.spec.ts): claimed identities, anonymous replies, consent, and invalid input.
- [Email sequences](../../src/lib/server/emailSequences.spec.ts) and [reply delivery](../../src/lib/server/replyNotificationDelivery.spec.ts): suppression, retries, ambiguous sends, and advancement failures.
- [Modal](../../src/lib/components/atoms/Modal.spec.ts) and [account interactions](../../src/routes/account/account.page.spec.ts): focus, stacked dialogs, persistence, and failed saves.

## Next tests in priority order

| Priority | Workflow                          | What the test must prove                                                                                                                                                                                                                                | Missing boundary                                                                                                                    |
| -------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1        | Give-first answer and reveal      | A fresh visitor cannot retrieve takes; a successful answer persists and unlocks them after reload; a second browser stays locked; simultaneous duplicate submissions persist only the allowed number of answers; failed submission preserves the draft. | Browser plus real local database. Existing endpoint/component tests mock persistence and gate results.                              |
| 1        | Email delivery and unsubscribe    | Concurrent workers cannot claim the same enrollment; retries and duplicate webhooks do not advance it twice; suppression or unsubscribe before delivery prevents a send; ambiguous provider outcomes do not cause duplicate mail.                       | Real claim/advancement SQL and HTTP routes with a fake mail provider. Current unit tests validate orchestration around mocked RPCs. |
| 1        | Authentication and authorization  | Login and logout update the browser session; an ordinary user cannot call admin endpoints; forged authorship is rejected; expired sessions and cross-origin mutations cannot bypass protection.                                                         | Requests through SvelteKit hooks, cookies, and local auth, beyond calling route handlers directly.                                  |
| 2        | Public page rendering and caching | A built page renders and hydrates; drafts stay unavailable; cached personality payloads contain no visitor data; personalized discussion responses stay private; database outages cannot become cached missing pages.                                   | Production build smoke tests with stable seeded content. The current Playwright server uses Vite dev.                               |
| 2        | Untrusted email previews          | Hostile preview scripts cannot modify the parent document or make prohibited requests, while safe preview content remains visible.                                                                                                                      | A real browser enforces iframe sandbox/CSP; jsdom attribute checks cannot demonstrate this.                                         |

Start with the give-first workflow and the email claim/suppression transaction tests. They cover the core interaction and a costly failure mode: duplicate or unwanted sends.

## Make important tests part of CI

[CI](../../.github/workflows/ci.yml) currently runs `pnpm check`, `pnpm test`, cross-link checks, security checks, and a production build. It does not run `pnpm test:smoke` or `supabase/tests/*.sql`.

Before adding those jobs, provide a disposable local database with explicit ordinary-user/admin fixtures and stable question/personality records. The existing SQL scripts require those profiles; the mobile smoke suite discovers content from listings. Keep real email providers disabled. Then run the SQL access scripts and a small browser suite in CI, and add the critical workflows above. This makes failures reproducible without production credentials or live content.

## Rules for new tests

1. Name the regression: what wrong outcome would a user or operator notice?
2. Execute the relevant function, request, or interaction and assert its result or durable effect.
3. Mock external services at their boundary. Do not mock away the gate, transaction, or rendering behavior the test claims to verify.
4. Use explicit fixtures. Avoid conditional returns, empty generated case lists, or expectations calculated with the same function under test.
5. Let ordinary wording and internal refactors change freely. Assert literal text when the literal itself is a contract, such as an email template token, URL, protocol value, or accessibility name needed for the interaction.
6. Keep tests offline and isolated by default. An imported helper must not start a CLI crawl, send email, or mutate repository data.

## Validation after cleanup

- `node node_modules/vitest/vitest.mjs run --maxWorkers=4`: **289 files and 2,118 tests passed**. The existing loopback-server test required execution outside the filesystem/network sandbox.
- ESLint and Prettier passed for the changed code; the diff has no whitespace errors.
- The link-audit CLI still runs when invoked directly, verified with a stubbed empty sitemap and no network requests.
- `pnpm check` reports **50 errors in four unchanged script modules**: `blogQuoteCheck.mjs`, `blogReadability.mjs`, `peopleControversies.mjs`, and `blogPipelineChecks.mjs`, all under `scripts/lib`. It reports no errors in the changed files.
