<!-- docs/audits/question-purge-2026-09-10/removal-results.md -->

# Approved question removals — September 10, 2026

Removed **#86, #132, #166, and #172** using the site's existing `removed = true` mechanism. This is reversible removal from the public site; the underlying questions and answers are retained. Question **#144 remains visible**, and the **356 generated questions remain flagged and unchanged**. Optional candidates #154 and #165 were not removed.

The transaction rechecked all descendant comments for outside participation, protected the current starter/fallback questions, and compared the selected rows with their backup before making changes. A rollback rehearsal passed before the live transaction committed.

## Verified live results

- Public question inventory and page RPC: **48 → 46**. Two of the four removed questions were already flagged.
- All four removed question URLs return **404**. #144 returns **200**.
- Public categories with live questions: **58**, unchanged.
- Personal Growth: **35 → 33**; Personal Interests and Lifestyle: **39 → 37**; Personal Life and Wellness: **43 → 41**.
- No affected category context samples contain removed or flagged questions. Nine affected category contexts were refreshed with current direct/subtree counts, samples, and child categories.
- Six category descriptions were updated to match surviving discussions: Life Events, Elections and Voting, Government Systems, Political Ideologies, Politics and Policy, and Political, Social, and Economic Affairs.
- Live HTTP checks confirmed the updated Personal Growth count and revised Elections and Voting and Life Events descriptions.

## Local sitemap update

The local static sitemap no longer lists the two newly hidden question URLs; the two already-flagged URLs were absent. Category modification dates were updated where those category URLs were already included. XML validation passed. **This static-file change is local and will publish with the next site deployment.** The question removals and category content updates are already live and were verified independently of that deployment.

## Records

- `removal-backup.json`: pre-change question and category records, saved before execution.
- `apply-approved-removals.sql`: the guarded transaction that was applied. It intentionally refuses to rerun against changed question state.
- `category-copy.json`: the six updated descriptions.
- `removal-verification.json`: public API and live HTTP verification results.

The earlier audit's separate category-ID mismatch, admin/public flagged-count discrepancy, orphan category tags, and duplicate answer-count triggers were not changed by this scoped removal. Question and category lists now exclude the four approved removals; answer-count accuracy on unrelated surviving questions remains a separate repair.
