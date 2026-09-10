<!-- docs/audits/question-purge-2026-09-10/audit.md -->

# Question purge audit — September 10, 2026

> Follow-up completed: #86, #132, #166, and #172 were removed from the live site. #144 was explicitly kept; the 356-question backlog was deferred. The original audit snapshot below is preserved. See [execution results](removal-results.md).

**Read-only audit. Nothing was deleted, flagged, unflagged, recounted, or deployed.** Live data was read from 9takes’ configured Supabase project, `nhjjzcsnmyotyhykbajc`, with SQL transactions enforced read-only. The connected MCP account did not list 9takes, so the repository’s configured connection was used. No credentials are included in these artifacts.

The immediate recommendation is **four removals, plus one duplicate after confirming the ProtonMail account**. Two more older founder-only threads are reasonable editorial retirement choices, but contain useful answers. A bulk purge of the already-hidden generated backlog is a separate decision: it would shrink database inventory, not the public question list.

## What exists

| Inventory                                                 | Count |
| --------------------------------------------------------- | ----: |
| All production questions                                  |   421 |
| Currently browsable questions, confirmed by live page RPC |    48 |
| Flagged, not removed                                      |   365 |
| Already removed                                           |     8 |
| Unanswered generated questions among the flagged set      |   356 |
| Other flagged questions                                   |     9 |
| Actual live top-level answers on the 48 visible questions |   263 |
| Live replies on those questions                           |    13 |
| Stored answer total returned by the question index        |   269 |
| Visible questions with incorrect stored answer counts     |     8 |

All 48 visible questions have at least one live answer. Six visible threads contain only answers from the two confirmed Gmail accounts; #144 becomes a seventh if the ProtonMail match is confirmed. Five of the six confirmed threads are older than 180 days; #568 is newer. Including the ProtonMail match gives six old visible founder-only threads.

Anonymous contributions are treated as other/unknown participants. They are not attributed to DJ. The 356 generated questions have no comment records at all, including removed comments, and are distinct from the 9 AI sample takes attached to many ordinary questions. AI sample takes in `comments_ai` are not counted as human answers.

## Account matching

| Email                   | Status                                                    | Authored questions | Comment records, including replies/removals |
| ----------------------- | --------------------------------------------------------- | -----------------: | ------------------------------------------: |
| djwayne3@gmail.com      | Explicitly identified by user                             |                  3 |                                          15 |
| djwayne35@gmail.com     | Explicitly identified by user; configured host identity   |                 55 |                                          93 |
| mrwayner@protonmail.com | Likely requested ProtonMail account; confirmation pending |                  0 |                                           5 |
| dj@build-os.com         | Additional DJ Wayne profile; confirmation pending         |                  0 |                                           1 |

The account question was sent during the audit. No unconfirmed match is used to authorize a removal. #158 is additionally authored by another account, even if both its answerers prove to be DJ.

## Ready to recommend for removal

“Ready” means the content and participation audit supports removal; it does not mean an execution has happened. These four threads have no live non-DJ answers or replies, no likes, no subscriptions, no active feature references, and no pinned/starter placement. #132 has an already-removed anonymous gibberish answer, which should remain in an export if the row is permanently deleted.

| ID  | Question                                                                                                                                                                    | State   | Live answers | Last live answer/reply | Judgment                                                                                                                            |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | -----------: | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 86  | [What are you thinking about?](https://9takes.com/questions/what-are-you-thinking)                                                                                          | visible |            1 | 2023-09-23             | Duplicate of #85, which has 20 live answers; this thread has one short DJ seed from 2023.                                           |
| 132 | [What is the longest you have stayed awake working on a project you were passionate about?](https://9takes.com/questions/longest-stayed-awake-working-project-passionate-9) | visible |            1 | 2023-12-02             | Low-depth duration prompt; only live answer is DJ’s two-day anecdote from 2023. One anonymous gibberish answer was already removed. |
| 166 | [What's the biggest lesson you've learned this year 2024?](https://9takes.com/questions/whats-biggest-lesson-youve-learned-year-2024)                                       | flagged |            1 | 2024-06-14             | Expired 2024 prompt; only live answer is a bare X link. Already flagged.                                                            |
| 172 | [What is your main fear with Trump getting elected?](https://9takes.com/questions/main-fear-trump-getting-elected)                                                          | flagged |            1 | 2024-09-06             | Old election-specific prompt; only live answer is DJ’s election fear from September 2024. Already flagged.                          |

The stronger duplicate for #86 is [#85: What are you thinking about these days?](https://9takes.com/questions/what-are-you-thinking-about-these-days), with 20 live top-level answers. The wording is broad, but its existing participation makes it worth preserving.

## Conditional duplicate

| ID  | Question                                                                                                                                          | State   | Live answers | Last live answer/reply | Judgment                                                                                                                                                                     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | -----------: | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 144 | [What is something you would change about yourself if you could?](https://9takes.com/questions/what-is-something-you-would-change-about-yourself) | visible |            2 | 2023-12-04             | Near-duplicate of #163, which has five live answers. Two short remaining answers are Gmail + the unconfirmed ProtonMail account; a separate removed anonymous answer exists. |

For #144, preserve [#163: If you could change something about yourself, what would you change?](https://9takes.com/questions/change-something-yourself-change), which has five live answers and contributions outside the matched accounts. If retiring #144, a redirect to #163 is reasonable; it should not imply its answers were moved.

## Editorial choices, not automatic “zero value” deletions

| ID  | Question                                                                                                                                   | State   | Live answers | Last live answer/reply | Judgment                                                                                                                                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------- | -----------: | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 154 | [What is valuable to you when searching for community?](https://9takes.com/questions/valueable-when-searching-community)                   | visible |            1 | 2024-05-05             | Broad community-values prompt with a substantive DJ answer. Reasonable retirement candidate for a smaller catalog, but “zero value” is too strong. |
| 165 | [What's the best advice you've ever received about business?](https://9takes.com/questions/whats-best-advice-youve-ever-received-business) | visible |            2 | 2024-06-14             | Generic business-advice prompt with a substantive founder lesson plus a bare X link. Save the useful lesson if retiring the thread.                |

These two are optional additions if the goal is a tighter question catalog. #154 contains a clear preference for communities that act on ideas. #165 contains a useful lesson about validating demand before building. Their lack of outside answers supports retiring them from browsing, but does not establish that the writing has no value.

## Keep or hold

| ID  | Question                                                                                                                               | State   | Live answers | Last live answer/reply | Judgment                                                                                                                                                      |
| --- | -------------------------------------------------------------------------------------------------------------------------------------- | ------- | -----------: | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 173 | [What do single people not understand about married people?](https://9takes.com/questions/single-people-not-understand-married-people) | visible |            1 | 2024-09-09             | Keep: accessible relationship-perspective question with a substantial personal answer worth preserving.                                                       |
| 568 | [What do you provide so that you never have to ask?](https://9takes.com/questions/what-do-you-provide-so-that-you-never-have-to-ask)   | visible |            1 | 2026-07-25             | Hold: created July 25, 2026, only 47 days before the audit; tied to the one-take format document. Consider clearer wording/distribution before deletion.      |
| 158 | [Why do people line up so early to board planes?](https://9takes.com/questions/why-people-line-so-early-board-planes)                  | flagged |            2 | 2026-06-20             | Hold: already flagged, question authored by another account, and its other answer belongs to the unconfirmed BuildOS account. Last live answer June 20, 2026. |

Also preserve questions with outside or anonymous participation even when the title is weak. Examples are #107 (“How do you do?”), #155 (“Where do you get off?”), and #205 (the toddler/garden prompt). They can be reviewed for hiding or moderation separately; they do not meet the founder-only removal criterion.

## Expected impact

| Scenario                                | Public questions remaining | Public categories with live questions |
| --------------------------------------- | -------------------------: | ------------------------------------: |
| Current                                 |                         48 |                                    58 |
| Four recommended IDs: 86, 132, 166, 172 |                         46 |                                    58 |
| Add conditional duplicate #144          |                         45 |                                    57 |
| Also retire #154 and #165               |                         43 |                                    57 |

#166 and #172 are already hidden, so deleting them makes no further difference to browsing. With #144 included, “Self care and Self love” loses its only live question and should disappear from the category tree. For the five-question scenario, the affected subtree counts are:

| Category                              | Before | After |
| ------------------------------------- | -----: | ----: |
| Personal Growth                       |     35 |    32 |
| Personal Interests and Lifestyle      |     39 |    36 |
| Personal Life and Wellness            |     43 |    40 |
| Relationships                         |     33 |    32 |
| Self Relationship                     |     14 |    13 |
| Self awareness and Self understanding |      5 |     4 |
| Self care and Self love               |      1 |     0 |

Counts include descendants and deduplicate question IDs. A question can appear under multiple unrelated branches; category counts must not be summed to derive the site total.

## Category and counter findings

1. **Category totals are calculated, not stored on the category rows.** The current route code builds counts from `question_category_tags` and active question IDs; the admin RPC computes a recursive rollup. Setting `removed = true` excludes a question on the next load, and the tree helper prunes empty branches. There is no separate category-count field to reset.
2. **Admin and public category views disagree.** The category index route and admin rollup filter removed questions but not flagged ones. Public RLS does exclude both, so a normal visitor gets 58 categories. An admin session can include flagged questions and get 62; 17 category counts differ. Four branches have no unflagged questions: Legal Procedures and Practices, Law and Justice, Global Economy, and Economy and Work. Explicitly apply the same public-eligibility rule to every public category query, including admin sessions viewing the public site. Counts here are computed from live data and the checked-out route code; no deployment was performed.
3. **The index mixes old and current category identifiers.** `question_tags.tag_id` refers to the legacy `question_tag` table, but the live `get_questions_page_data` function joins it to `question_categories.id`. For #86, legacy ID 25 means Personal Growth in `question_tag` but Ethics in the current taxonomy; its correct current mapping is ID 57. The ID sets differ on 36 of the 48 visible questions. Use `question_category_tags → question_categories` consistently for current category names, filters, and counts; do not copy old IDs into the new taxonomy.
4. **There are 20 orphan current category mappings** for missing question IDs 181–188. These IDs are absent from both production and demo questions. Proper joins already exclude them from counts, but permanent deletion needs explicit cleanup because `question_category_tags.question_id` has no question foreign key.
5. **Two live triggers maintain question answer counts.** The newer `update_question_comment_count` handles non-removed top-level comments. The older `updateQuestionCommentCount` recounts all top-level records, including removed answers, and uses `NEW` even on DELETE. Both execute on inserts/deletes. Consolidate this behavior before recounting, otherwise totals can drift again. This also makes stored `last_comment_date` unreliable for staleness; this audit uses actual comment timestamps.

| Question ID | Stored answers | Actual live answers |
| ----------- | -------------: | ------------------: |
| 104         |              2 |                   3 |
| 107         |              3 |                   2 |
| 118         |             39 |                  36 |
| 120         |              4 |                   3 |
| 132         |              2 |                   1 |
| 153         |              3 |                   4 |
| 164         |              4 |                   3 |
| 567         |             32 |                  31 |

These are live database findings, not just old migration-file suspicions.

## Removal execution requirements

The existing admin removal action uses `removed = true`. That is the simplest reversible way to remove the chosen questions from browsing while preserving their history. A permanent SQL DELETE requires more than deleting the question row:

- Export the selected questions, all descendant comments, category mappings, AI sample takes, keywords, links, and relevant dependencies. Recheck for new non-DJ comments immediately before acting, inside the mutation transaction. Keep #144 conditional until its account is confirmed.
- For hard deletion, explicitly handle both category tables, polymorphic comment trees, likes and notifications, AI comments, keywords, links/link drops, subscriptions, and feature references. Some foreign keys cascade, others restrict; current category mappings, AI comments, and several historical references have no question foreign key. Preserve analytics history deliberately. For this shortlist, there are no subscriptions, likes, starter pins, feature runs, or linked celebrity-blog CTAs. #166 has one link record; optional #165 has one link and one link-drop record. Most candidates have keywords and nine AI sample takes.
- Unify category mapping/visibility behavior, consolidate answer-count triggers, then recompute `comment_count` and `last_comment_date` from live top-level answers for surviving questions. Validate before/after totals against direct queries.
- Refresh affected category introductions where they reference removed questions. The empty Self care and Self love category currently has no intro; other affected intros have mixed completed/stale status and need a content check, not blanket regeneration.
- Regenerate the static sitemap after content changes; it currently contains visible candidate URLs. Use exact duplicate redirects only where appropriate (#86 → #85 and #144 → #163); verify all remaining category links resolve and empty categories drop out.

The prior 356-question generated backlog remains flagged, with 292 marked needs_review and 64 needs_redesign. It can be audited as a separate bulk-retirement batch. This audit does not claim individual editorial review or dependency approval for all 356 and does not put them in the first deletion batch.

## What the smaller front page should build on

Five starters are already configured: #118, #119, #203, #137, and #567. The live RPC returns them separately, followed by a paginated archive ordered newest first. The five strongest visible threads by actual answer count (#118, #567, #119, #85, #137) contain **127 of the 263 live answers, about 48%**. That supports your idea of concentrating attention on a small set of strong discussions. A future homepage/browse change should use outside participation and editorial interest, with the archive secondary, rather than raw total inventory or unreliable stored counts. No UI change is included in this audit.

The first-batch candidates have only 2–5 recorded gate_shown events each in the available funnel table, and no other event types there. This is sparse, partial telemetry, not a lifetime traffic or SEO valuation. Current Search Console/backlink data was not fetched. “Low-value removal candidate” is an editorial judgment supported by the text, duplication, age, and lack of live outside participation—not proof of zero traffic.

## Files and reproducibility

- [Full inventory](inventory.md): all 421 questions, status, actual answers/replies, current categories, and audit decision.
- [Machine-readable inventory](inventory.json): explicit recommended/conditional IDs, method, account assumptions, and per-question metrics. No emails or identities of unrelated contributors, IPs, fingerprints, or answer bodies are exported.
- [Read-only database checks](verification.sql): summary and shortlist recheck queries. Run through a trusted database connection; the file begins a read-only transaction and rolls back.

Source code: [category index](/Users/djwayne/9takes/src/routes/questions/categories/+page.server.ts), [category detail](/Users/djwayne/9takes/src/routes/questions/categories/[slug]/+page.server.ts), [tree rollup](/Users/djwayne/9takes/src/lib/server/questionCategoryTree.ts), [question removal action](/Users/djwayne/9takes/src/routes/questions/+page.server.ts:326), [sitemap generation](/Users/djwayne/9takes/scripts/generate-sitemap.js:889). The live RPC/trigger/constraint definitions were also read directly from PostgreSQL.
