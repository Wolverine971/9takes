<!-- docs/taskers/T-32-twitter-x-toxicity-refresh.md -->

# Tasker: Audit and Refresh Why Twitter/X Is So Toxic

**For:** Current research, social-platform analysis, and SEO editorial agent  
**Owner:** DJ  
**Created:** 2026-08-13  
**Status:** Completed 2026-08-13  
**Related:** `docs/seo/2026-08-13-indexation-recovery-audit.md`, `docs/seo/data/2026-08-13-indexation-recovery-inventory.csv`, `src/blog/pop-culture/twitter-x-personality-types-toxic.md`

## 0. What and why

The Twitter/X toxicity article is the highest-priority content candidate in the submitted exclusion audit. In the clean 98-day window it earned 1 click from 551 impressions at 0.18 percent CTR and average position 8.0. Its top disclosed query was `why is twitter x so toxic reasons`. Google has shown that the page can rank, but the page recently lost visibility and was historically labeled noindex before its current live state became 200, self-canonical, and `index, follow`.

The article needs a current, source-backed explanation of why conflict spreads on X. Its Enneagram angle can remain distinctive, but the page must not claim that particular types dominate the platform without evidence. Platform mechanics, social psychology, observed user behavior, and Enneagram interpretation must remain separate.

## 1. Required reading

1. `CLAUDE.md`
2. `docs/taskers/README.md`
3. `docs/seo/2026-08-13-indexation-recovery-audit.md`
4. The exact inventory row for `/pop-culture/twitter-x-personality-types-toxic`
5. `docs/content-analysis/2026-07-18_pop-culture-section-audit.md`
6. The complete current source article, FAQs, QuickAnswer, structured data, and internal links
7. Current GSC page-query, country, and device rows

Run `git status --short` first. Do not rename the Twitter/X slug. Never modify `lastmod`.

## 2. Mandatory current research

Browse current sources before editing. Use:

- X's current public documentation, transparency material, recommendation-system disclosures, and policy pages where relevant;
- peer-reviewed research on outrage, engagement incentives, social reinforcement, moral-emotional language, polarization, harassment, and algorithmic amplification;
- primary datasets or papers rather than summaries of them; and
- reputable reporting for platform changes that cannot be established through official documentation.

Record the research date. Separate findings established for the former Twitter platform from claims verified under the current X product. Do not infer how the current algorithm works from an old Twitter study without labeling the limitation.

## 3. Claim audit

Audit every factual, numerical, causal, and type-based claim. Pay particular attention to:

- statements that Types 1, 6, or 8 dominate X;
- claims that the platform is designed to make users angry;
- claims about recommendation ranking, verification, monetization, replies, quote-posting, or moderation;
- assertions about which emotions travel farther;
- political or ideological generalizations;
- mental-health language; and
- any percentage or engagement result.

Classify each as current fact, peer-reviewed finding with scope limits, 9takes editorial interpretation, or remove. The Enneagram is not a validated platform-demographics dataset.

## 4. Update contract

Answer the searcher's question directly near the top. Build the article around a small number of defensible mechanisms, such as incentive design, context collapse, identity threat, public status competition, social proof, and low-friction escalation. Use Enneagram patterns to show why the same mechanism can hook different motives, not to claim that one type causes toxicity.

The article should:

- distinguish platform-level incentives from individual choices;
- show how multiple types can enter the same conflict for different reasons;
- include counterevidence and limits;
- give the reader a practical way to interrupt their own loop;
- avoid partisan examples unless they are necessary and handled symmetrically; and
- remain useful if specific personalities or daily controversies fade.

Preserve the slug, canonical, publication state, and `lastmod`. Change metadata only when current GSC query evidence and the revised page promise support it.

## 5. Deliverable

Implement the refresh and create `docs/content-analysis/2026-08-13-twitter-x-toxicity-refresh.md` containing:

1. current research sources and their scope;
2. claim-by-claim removals and corrections;
3. platform mechanics versus Enneagram interpretation;
4. query intent and search-facing changes;
5. internal-link decisions;
6. before and after quality signals; and
7. an indexation and 28-day measurement plan.

## Verification checklist

- [x] No type is claimed to dominate X without direct evidence.
- [x] Platform claims are current or date-limited.
- [x] Primary research supports the causal mechanisms that remain.
- [x] Observation and Enneagram interpretation are visibly separate.
- [x] The top query is answered directly.
- [x] FAQ, QuickAnswer, body, and structured data agree.
- [x] Slug, canonical, publication state, and `lastmod` remain unchanged.
- [x] No em dashes or internal review comments remain.
- [x] Relevant formatting, content lint, `pnpm check`, and production compilation pass.

## Risks and gotchas

This topic can turn into partisan commentary or generic digital-wellness advice. Neither serves the query. Do not confuse the public availability of recommendation-system code with proof of current production behavior. Do not make current claims from pre-acquisition Twitter research without an explicit date and limitation.

## Definition of done

The article gives a current, evidence-backed answer to why X becomes toxic, uses the Enneagram only as a transparent interpretive layer, removes unsupported type demographics and platform claims, preserves the proven URL, and passes all checks.

## What was actually done

- Audited every factual, numerical, causal, platform, mental-health, and type-based claim in the source article.
- Queried the page's current Search Console query, country, and device rows read-only for the same 98-day baseline window used by the indexation audit.
- Rebuilt the article around six source-backed mechanisms, with current X documentation separated from dated former-Twitter and post-acquisition research.
- Removed unsupported type-demographic claims, stale source-code weights, intent claims, clinical language, and deterministic political or community generalizations.
- Retained the Enneagram as an explicitly labeled 9takes interpretation of possible motives, not a user census or diagnosis.
- Aligned the title, description, QuickAnswer, body, five visible FAQs, and FAQPage JSON-LD with the disclosed search query.
- Preserved the URL, canonical, publication state, and `lastmod` exactly.
- Created the required implementation report at `docs/content-analysis/2026-08-13-twitter-x-toxicity-refresh.md`.
- Made no production, database, sitemap, indexing, or other external write.

## Verification results

| Check                                                                  | Result                                                      |
| ---------------------------------------------------------------------- | ----------------------------------------------------------- |
| Relevant Prettier check                                                | Passed                                                      |
| FAQPage JSON-LD parse and exact visible FAQ comparison                 | Passed: five questions and five answers match               |
| Protected frontmatter comparison against `HEAD`                        | Passed: `loc`, `published`, and `lastmod` are unchanged     |
| Em-dash and internal-review-marker scan                                | Passed: no matches in the article, report, or tasker        |
| Internal destination check                                             | Passed: all 11 linked 9takes destinations have source files |
| `pnpm check`, with the existing site environment loaded                | Passed: 0 errors and 132 existing warnings                  |
| Production Vite compilation, with the existing site environment loaded | Passed in 27 minutes 29 seconds                             |

The full `pnpm build` command exits after successful production compilation because the repository's protected portrait-library budget is already over by two files and 364.61 KiB. This task did not touch portrait assets. All other reported build budgets pass, so the unrelated post-build budget result does not invalidate this page's compilation check.
