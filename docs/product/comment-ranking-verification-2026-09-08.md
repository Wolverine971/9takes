<!-- docs/product/comment-ranking-verification-2026-09-08.md -->
# Comment ranking deployment verification — 2026-09-08

Production is functioning in phase 2 (view collection). Ranked is deliberately off. There is one small application fix to redeploy: send an explicit null fingerprint when a reader has no visitor cookie.

## Live checks

- The 9takes database (`nhjjzcsnmyotyhykbajc`) contains migration `20260907175553_comment_ranking.sql`. The earliest retained view batch is 2026-09-07 20:00:52 UTC.
- The public question page loads successfully. Unauthenticated requests to its comment API return an empty list; community take text is absent from the locked HTML response.
- In DJ's existing signed-in browser, question 567 renders three own takes separately and ten community takes initially. Oldest sorting gives the expected chronological sequence, scroll paging extends it to twenty community takes, and refresh retains Oldest.
- Only cards actually read gain views. The three initially read community cards increased from zero to one; all own cards and unseen cards stayed at zero. After further reading and refresh, nine community takes had one view each and own takes remained at zero. Refresh did not duplicate those views.
- The live curation panel loads all 28 answers with views, rounds, quality and ranked positions. It explicitly reports collection mode. Boosted answers lead its ranked preview and below-floor answers appear last.
- The host desk loads with the expected host identity. It has no pending or historical drafts, so live rank-at-post capture has not yet been exercised.
- The view endpoint rejects empty batches (400), missing viewer identity (401) and cross-origin requests (403). The comment API rejects incomplete cursors (400).

These checks read existing production content; they did not publish comments or host replies, change likes or boosts, or reset counters. Reset auditing, posting and overflow beyond 100 takes remain covered by the prior isolated database and application tests rather than new production writes.

## Fix found during verification

An anonymous request without `9tfingerprint` reproduced a logged PostgREST error: `can_see_comments_3(questionid, userid)` was not found. The RPC requires three named arguments; JSON serialization drops an undefined fingerprint. The request still returned an empty list, preserving the gate. A signed-in reader missing that cookie could also be incorrectly treated as locked.

Both the question page loader and `/comments` now pass `userfingerprint: cookie ?? null`. Four new regression cases cover signed-in and anonymous readers without the cookie. All 29 focused tests passed. Type checking completed with zero errors and 146 existing warnings; targeted lint completed with zero errors and 14 existing unused-directive warnings. A live anonymous RPC with explicit null returned false without an error. The application fix is local and requires deployment; no additional migration is needed.

## Rollout follow-up

1. Deploy the missing-cookie fix while retaining collection mode.
2. Review the five starters around September 14, after at least one week of plausible reading data. Extend collection if traffic is still sparse. At verification, only five views existed before testing; the other nine were this check, so the observation gate is not yet satisfied.
3. Save weekly per-take snapshots using the [measurement instructions](../growth/question-commenting/sql/comment-ranking-README.md). A dated baseline is already saved there, with the test impressions identified.
4. Once the collection gate passes, set production `PRIVATE_COMMENT_RANKING_ENABLED=true` and redeploy. Record the actual activation timestamp for the answer-length comparison, then observe exposure spread and first-screen floor rate for two weeks before tuning.

The checks establish deployment health for the tested flows, not ranking effectiveness at this traffic level. The one-week and two-week observation gates still apply.
