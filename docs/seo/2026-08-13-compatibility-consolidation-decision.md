<!-- docs/seo/2026-08-13-compatibility-consolidation-decision.md -->

# Compatibility Guide and Matrix Consolidation Decision

**Owner:** DJ

**Decision date:** 2026-08-13

**Scope:** Decision only. No article, redirect, sitemap, canonical, publication, analytics, or `lastmod` state was changed.

**Primary decision:** **Option C, retire the compatibility guide without content salvage, then permanently redirect it to the compatibility matrix after DJ approves the implementation package below.**

## 1. Executive decision

Retire `/enneagram-corner/enneagram-compatibility-guide` without moving any of its prose, tables, FAQs, schema, or image into `/enneagram-corner/enneagram-compatibility-matrix`.

The guide does not have a defensible separate search job. In the current 28-day window it recorded no impressions, while the matrix recorded 30 clicks from 2,857 impressions. Over the fresh 98-day export, the guide recorded 0 clicks from 218 impressions, compared with 107 clicks from 10,788 impressions for the matrix. The matrix also outranks the guide on the guide-named query. Keeping both pages would preserve a weak, currently excluded URL whose thesis and reader jobs are already present in the stronger page.

The previously proposed merge asset is unusable. The guide's cited source now reports a different self-reported sample of 2,250 people and does not contain the claimed 457-couple sample, the 20.7, 17.9, 17.5, or 17.3 percent frequencies, or the derived 73.4 percent and multiplier claims. The current source's sampling and outcome are also different, so its new table is not a drop-in replacement. See the [current source and methodology](https://enneagram-personality.com/en/types/compatibility).

The remaining guide material is either already covered by the matrix, ordinary Enneagram editorial doctrine, or stated with more certainty than the evidence allows. Copying it would add length and liability to the winning page without creating a new reader benefit. Retirement should therefore be a clean consolidation, not a content merge.

There is no fallback recommendation. The missing T-26 and T-27 final reports noted in the limitations do not affect this decision because the fresh repository data, live state, and source failure resolve the core question.

## 2. Current performance and index state

### Measurement windows

- Latest 28 days: 2026-07-15 through 2026-08-11, from the same current GSC refresh used by T-23 and summarized in T-31.
- Longer window: 2026-05-05 through 2026-08-11, 98 days, from `docs/data/gsc/2026-08-13-*.csv`.
- GSC indexing report: updated 2026-08-06.
- Live HTTP and HTML verification: 2026-08-13 at approximately 17:47 UTC.

| URL | Latest 28 days | Fresh 98 days | Current GSC/index state | Live technical state |
| --- | --- | --- | --- | --- |
| `/enneagram-corner/enneagram-compatibility-matrix` | 30 clicks, 2,857 impressions, 1.05% CTR, position 12.8 | 107 clicks, 10,788 impressions, 0.99% CTR, position 12.2 | Search-serving and not in the 198 submitted-exclusion inventory | HTTP 200, self-canonical, `index, follow`, submitted in sitemap, `published: true` |
| `/enneagram-corner/enneagram-compatibility-guide` | 0 clicks, 0 impressions; CTR and position not applicable | 0 clicks, 218 impressions, 0.00% CTR, position 10.4 | `Crawled - currently not indexed`; last recorded crawl 2026-05-15 | HTTP 200, self-canonical, `index, follow`, submitted in sitemap, `published: true` |

The guide's 98-day impressions are historical visibility inside a window that ends after its current exclusion classification. They are not evidence that the page is currently serving a separate query intent.

### T-26 deployment check

No T-26 article change is visible in this worktree or on the live pages at capture time. The matrix still uses the existing title, promises 81 combinations, and places the quick-reference table below the opening theory sections. The guide still exposes the withdrawn study claims. Both article sources have no local diff.

The required `docs/seo/2026-08-13-compatibility-content-brief.md`, bounded change log, and `docs/seo/2026-08-13-winners-and-declines-refresh.md` were not present in this isolated worktree. This report uses the fresh GSC exports, T-31's latest-28 summary, the completed T-23 and T-28 evidence, the live pages, and current source instead. Any later T-26 matrix-only improvement should remain independent of this retirement decision.

## 3. Query and content-overlap map

### Query ownership

| Query or intent | Matrix evidence, 98 days | Guide evidence, 98 days | Decision |
| --- | ---: | ---: | --- |
| `enneagram compatibility chart` | 28 clicks, 998 impressions, 2.81% CTR, position 7.1 | No disclosed row | Matrix owns the primary chart lookup intent. |
| `enneagram compatibility` | 1 click, 368 impressions, position 12.5 | No disclosed row | Matrix owns the broad term. |
| `enneagram relationship compatibility` | 0 clicks, 109 impressions, position 13.9 | No disclosed row | Same relationship job; no separate guide demand. |
| `enneagram compatibility guide` | 0 clicks, 65 impressions, position 7.5 | 0 clicks, 2 impressions, position 35.5 | The matrix already outranks the guide for the guide-named query. |
| `enneagram relationship compatibility evidence` | No base-page row disclosed; the matrix has related study queries | 0 clicks, 3 impressions, position 10.3 | Too little demand to justify a separate evidence page, especially when its evidence is invalid. |
| Pair-specific advice | The matrix contains all 45 unordered pairings and ranks on pairing queries | No pair-by-pair sections | Matrix owns this job. |
| General relationship health and growth | Covered by the matrix's success factors, challenging-pairing guidance, red flags, personal map, FAQs, and next steps | Repeated across most of the guide | Substantial thematic duplication. |

The guide's only disclosed query rows total five impressions. Most of its 218 page impressions are suppressed at page-query granularity, so the exact hidden query mix is unknowable. That uncertainty does not create a distinct intent. The disclosed rows and the page's own title, headings, and copy all overlap the matrix's compatibility, chart, relationship, evidence, and pairing jobs.

### Search-visible anchors and passages

The matrix has multiple section URLs appearing in GSC, all with zero clicks in the 98-day export:

| Matrix anchor | Impressions | Position |
| --- | ---: | ---: |
| `#the-complete-compatibility-matrix-all-81-combinations` | 456 | 7.4 |
| `#which-enneagram-types-are-most-compatible` | 335 | 7.9 |
| `#how-compatibility-actually-works` | 304 | 7.7 |
| `#what-makes-any-enneagram-pairing-work` | 271 | 8.3 |
| `#how-to-navigate-challenging-enneagram-pairings` | 250 | 8.2 |
| `#red-flags-vs-growth-edges-in-enneagram-relationships` | 222 | 8.4 |
| `#why-opposites-attract-and-same-types-clash` | 214 | 8.4 |
| `#quick-reference-compatibility-table` | 31 | 8.8 |

The guide has no anchor URL row in the fresh pages export. Its search-visible promise is the base page title, `Enneagram Compatibility: Why Charts Lie`, plus passages about health levels, childhood wounds, growth orientation, and the withdrawn 457-couple study. Those same non-statistical jobs already appear in the matrix. The study passage is not an asset to preserve.

### Structural overlap

| Measure | Matrix | Guide |
| --- | ---: | ---: |
| Raw file word count | 6,019 | 3,663 |
| Approximate reader-facing source words after frontmatter, comments, imports, style, and JSON-LD are removed | 4,902 | 2,804 |
| H2 headings | 11 | 9 |
| H3 headings | 24 | 33 |
| H4 headings | 45 | 1 |

All nine guide H2 jobs map to existing matrix jobs:

| Guide job | Existing matrix destination or equivalent |
| --- | --- |
| Chart critique and health caveat | `How Compatibility Actually Works`; `What Makes Any Enneagram Pairing Work?` |
| Claimed couple evidence | No safe destination; reject |
| Health, wounds, and growth success factors | `How Compatibility Actually Works`; `Universal Success Factors`; `Red Flags vs Growth Edges` |
| Natural, growth-edge, and intensity categories | Quick reference columns; opposite and same-type sections; `Which Types Are Most Compatible?` |
| What each type needs | Pair-by-pair sections and `enneagram-types-in-relationships` |
| Five-step practical framework | `Creating Your Personal Compatibility Map`; `What To Do Next` |
| Bottom line | `The Real Truth About Compatibility` |
| FAQs | Five of six questions are semantic duplicates of matrix FAQs or body copy; the remaining frequency FAQ is withdrawn |
| Related reading | Navigation only, not a unique reader job |

The guide looks different because it is organized as an anti-chart essay, but its actual reader job is still to answer whether type pairings matter and how to use the Enneagram in a relationship. The matrix already answers that while also satisfying the primary chart lookup.

## 4. Paragraph-level salvage ledger

Classification labels match T-31. `Do not salvage` means the material should not be copied into the matrix before retirement.

| Guide lines | Candidate asset | Classification | Evidence and overlap decision | Disposition |
| --- | --- | --- | --- | --- |
| 2-15 | Title, description, image, and frontmatter promise | Unsupported or misleading | The description makes the withdrawn 457-couple claim. The anti-chart positioning is already expressed in the matrix's caveats. The separate image is decorative and does not fill a matrix reader job. | Do not salvage. Keep the source file in-tree after unpublishing. |
| 36-48 | QuickAnswer and opening promise | Unsupported or misleading; duplicative | The sample, percentage, three-predictor claim, and categorical `always outperform` claim are unsupported. The matrix QuickAnswer already gives the safe version of the reader answer. | Do not salvage. |
| 50-63 | `The Compatibility Chart Problem` setup | Duplicative | The matrix already rejects binary compatibility and explains levels of compatibility. The guide's `They're lying to you` framing is needlessly adversarial to the destination page's chart. | Do not salvage. |
| 64-76 | Type 8 health-level table and examples | Ordinary Enneagram editorial doctrine already covered elsewhere; unsupported or misleading as a predictive table | Practitioner doctrine recognizes levels of health, but the row-level relationship outcomes and abuse language are uncited. The matrix already says health matters. A systematic review found mixed reliability and validity for the Enneagram and little evidence for secondary theory. | Do not salvage. |
| 78-90 | Static-snapshot and willingness-to-grow paragraphs | Duplicative; unsupported when categorical | The underlying caution is useful but already present in the matrix. `Two people...can make any pairing work` and `will destroy any pairing` are absolutes without evidence. | Do not salvage. |
| 92-123 | 457-couple section, percentage table, conclusions, and complementarity bullets | Unsupported or misleading | The cited live source is a different 2,250-person dataset. It does not support any number in this section. The source does not support the attributed researcher conclusion. Even the old four-row table could not establish outcomes across all pairings. | Reject in full. Keep the numbers only in this rejection record. |
| 125-165 | Health-level success-factor claims and assessment table | Duplicative; ordinary editorial doctrine | Accountability, curiosity, flexibility, and repair are useful general relationship practices, but no source establishes them as Enneagram-specific predictors or the `most important` variable. The matrix already has four universal success factors. | Do not salvage. |
| 167-184 | Nine-type childhood-wound table | Unsupported or misleading | It presents type-specific childhood experiences as causal facts. The Enneagram review does not validate a nine-type developmental wound table. General childhood adversity research cannot validate these type mappings. | Reject in full. |
| 185-211 | Wound collision, collusion, complementarity, and healing framework | Ordinary Enneagram editorial doctrine already covered elsewhere | This is a memorable editorial framework, but its wound premise is not evidence-safe and the matrix already maps recreation, antidote, shared wound, and growth-trigger patterns. | Do not salvage. |
| 213-233 | Growth-oriented versus non-growth-oriented lists | Duplicative; unsupported when categorical | The behaviors are ordinary relationship advice. `Ultimate compatibility filter` and `will outperform every time` overstate what is known. The matrix already covers growth commitment and pattern interruption. | Do not salvage. |
| 235-237 | Marquee navigation | Duplicative navigation | It links to related relationship pages but contains no article asset. | Do not salvage. Retiring the page removes these outbound links from the active graph. |
| 239-274 | Natural-flow, growth-edge, and intensity categories | Duplicative; incompatible with the matrix's current table in places | The matrix already labels natural, growth, and challenging pairings. The guide's examples are unsourced and can conflict with the matrix's own classifications. | Do not salvage. |
| 276-290 | Pairing growth questions and conclusion | Duplicative | The matrix gives pair-specific `what makes it work` guidance and a personal compatibility map. The categorical `any pairing becomes workable` claim is too strong. | Do not salvage. |
| 292-357 | Nine `needs`, `triggered by`, and `grows when` mini-sections | Ordinary Enneagram editorial doctrine already covered elsewhere | Useful as a compact type primer, but not unique to compatibility and substantially covered by the matrix's pair sections plus `enneagram-types-in-relationships`. | Do not salvage. |
| 359-405 | Five-step practical framework | Duplicative | `Know patterns`, `assess health`, `identify growth`, `create agreements`, and `get support` overlap the matrix's universal factors, personal map, and next steps. Therapy and coaching suggestions do not require preservation to satisfy the chart intent. | Do not salvage. |
| 407-425 | Bottom-line summary | Duplicative; unsupported when categorical | The safe caution is already in the matrix. `Any pairing can work` and related guarantees are not established by evidence. | Do not salvage. |
| 429-453 | Six visible FAQs | Duplicative except for one unsupported FAQ | Same-type, avoid-dating, relative importance, and prediction questions duplicate matrix FAQs. The most-common-pairing FAQ repeats withdrawn percentages. | Do not salvage. |
| 457-465 | Related-reading list | Duplicative navigation | Six unique outbound destinations provide no content asset. | Do not salvage. Update inbound links to the guide before retirement; no need to rewrite links inside the unpublished source. |
| 467-522 | FAQ structured data | Unsupported or duplicative | Two FAQ entities repeat the withdrawn sample and percentages. The other three schema answers duplicate matrix content. The visible guide has six FAQs while its schema has five, another reason not to copy the block. | Do not salvage. Do not transfer schema. |
| 524-526 | Empty style block | No reader value | No asset. | Do not salvage. |

### Evidence references used for the classification

- The current cited compatibility page describes 2,250 self-reported participants, a balanced relationship-duration sample, and a relative over-20-year index. It is not the guide's claimed study and should not be substituted without a new, separate methodology review: [enneagram-personality.com methodology](https://enneagram-personality.com/en/types/compatibility).
- A peer-reviewed systematic review of 104 independent Enneagram samples found mixed reliability and validity and little support for secondary elements such as wings and intertype movement: [Hook et al., 2021, Journal of Clinical Psychology](https://pubmed.ncbi.nlm.nih.gov/33332604/).
- A 2015 dissertation using 324 married couples found attachment security associated with satisfaction but no statistically significant differences among Enneagram personality types. It does not validate the guide's exact claims, but it reinforces the need to avoid pairing guarantees: [Carpenter, 2015](https://scholarworks.waldenu.edu/dissertations/1597/).
- The claim that health level matters is recognizable practitioner doctrine, not a demonstrated predictive percentage table. The Enneagram Institute itself frames combinations as neither blessed nor doomed and describes health level as context: [Enneagram Institute type combinations](https://www.enneagraminstitute.com/the-enneagram-type-combinations/).

## 5. Evidence failures and liabilities

1. **Withdrawn dataset:** The 457-couple sample and all four pairing frequencies are unsupported by the cited live source.
2. **Withdrawn derivations:** The 73.4 percent sum, 7.43x, 8.26x, 9x, or any other multiplier derived from those rows must not appear as usable evidence.
3. **Outcome substitution:** Pairing frequency would not establish relationship quality or success even if the old table were recovered. The guide repeatedly equates marriage occurrence with successful marriage.
4. **Unsupported attribution:** `The researchers concluded that complementarity drives attraction` is not supported by the current cited page.
5. **Unsupported predictor language:** The guide says health level, childhood-wound awareness, and growth commitment `actually predict success` without a valid study.
6. **Causal childhood claims:** The childhood-wound table presents type-specific developmental causes as fact. General evidence that childhood adversity can affect adult traits does not validate these nine mappings.
7. **Categorical promises:** `Always outperform`, `any pairing can work`, `will destroy any pairing`, and `type matching alone predicts nothing` exceed the evidence.
8. **Schema duplication of bad evidence:** The FAQ JSON-LD republishes the withdrawn sample and percentages in machine-readable form.
9. **Copied liability outside the guide:** `src/blog/enneagram/how-to-navigate-early-relationship-stages.md:812` repeats the 457-couple claim and says the study found three success predictors. This must be removed or rewritten in the approved retirement/link-cleanup implementation. It is not content to move into the matrix.
10. **Destination liabilities not owned by this decision:** The matrix itself uses unsourced research language, says it covers 81 combinations while the body contains 45 unordered pairings, and makes unsupported `most stable` and `highest growth` claims. These should be handled by the T-26 matrix brief, not by salvaging guide material into the page.

## 6. Keep versus merge versus retire

| Option | Test | Finding | Verdict |
| --- | --- | --- | --- |
| A. Keep both | Distinct query intent, separate reader job, enough unique value to avoid cannibalization | The matrix outranks the guide on `enneagram compatibility guide`; every guide H2 maps to an existing matrix job; the guide is currently excluded and has no latest-28 visibility. | Reject. |
| B. Merge evidence-safe material, then redirect | At least one supported, useful, unique paragraph or table that improves the matrix without weakening its current thesis | The unique-looking tables are unsupported or ordinary doctrine. The practical material duplicates the matrix. Copying it would increase risk and bloat on the winning page. | Reject. |
| C. Retire without content salvage | Unique material is unsupported, redundant, or lower quality; link and navigation impact is known | This exactly matches the evidence. The source file can remain in-tree for audit history while its public URL consolidates into the matrix. | **Recommend.** |

## 7. Complete link-impact ledger

### Links into the guide that must be rewritten before the redirect ships

The generated crosslink index reports two published MDsvex sources linking into the guide. The T-23 inventory reports three source-visible inlinks because the shared Svelte component is also counted.

| Source | Current anchor and context | Required approved change | Why |
| --- | --- | --- | --- |
| `src/blog/enneagram/enneagram-books-websites-podcasts.md:671` | `Compatibility Guide` in the Relationships resource row | Point to `/enneagram-corner/enneagram-compatibility-matrix`; rename to `Compatibility Matrix` or `Compatibility Chart` | Avoid a permanent internal hop and match the destination. |
| `src/blog/enneagram/how-to-navigate-early-relationship-stages.md:812-820` | A 457-couple evidence paragraph followed by `Explore pairings: The truth about Enneagram compatibility` | Remove or evidence-safely rewrite the 457-couple paragraph; point the CTA directly to the matrix; use an anchor such as `Explore all Enneagram pairings` | This is both an internal-link update and a live evidence repair. Redirecting alone would leave the unsupported claim live. |
| `src/lib/components/blog/EnneagramTypeBottom.svelte:185` | `Enneagram Compatibility Guide`, described as what Type 2 needs from every type | Point directly to the matrix; use `Enneagram Compatibility Matrix`; describe it as Type 2 pairing dynamics | The component creates a user-facing link and its current description overpromises the guide's content. |

### Guide outbound links that disappear from active navigation

The guide points to six unique destinations: the matrix, types in relationships, dating red flags, toxic traits, relationship communication, and self-sabotage. These destinations have other internal support. No outbound link needs to be copied because the matrix and surrounding relationship pages already crosslink among themselves.

### Current matrix inlinks and pre-existing redirect debt

| Cohort | Current state | Retirement impact |
| --- | --- | --- |
| Six published source files link directly to the matrix | Guide, team dynamics, Enneagram TLDR, types in relationships, types working in teams, and relationship communication. `types-in-relationships` contains two occurrences. | The guide's own link disappears when unpublished, leaving five published source files plus site listing/navigation. The three rewritten guide inlinks add direct support to the matrix. |
| Nine published type pages and `love-languages-and-enneagram-types.md` use `/blog/enneagram/enneagram-compatibility-matrix` | Live check: this legacy URL returns one 301 to `/enneagram-corner/enneagram-compatibility-matrix`, then 200. | Not caused by guide retirement. Rewrite directly during a future internal-link hygiene pass, not as a condition of this decision. |
| `src/blog/enneagram/drafts/positive-self-talk-outline.md` links to the matrix | Drafts are excluded from the route glob. | No user-facing impact. |
| `src/lib/components/molecules/blogIndex.ts` lists the matrix | Matrix remains the public destination. | Preserve unchanged. |

### External inbound links

- Guide: the T-23 inventory records 0 external incoming links from 0 linking sites. The T-28 baseline says no merge candidate had a reported GSC external link that would block its disposition.
- Matrix: no compatibility URL is named in T-28's exposed 18-target GSC or representative Ahrefs evidence. That means no material link was surfaced, not that the true count is guaranteed to be zero.
- Gate: recheck GSC Links and the available Ahrefs target report immediately before implementation. If a legitimate guide backlink appears, the same direct 301 remains the normal preservation action, but record the source and verify one-hop resolution after deploy.

## 8. Exact implementation plan after approval

The order preserves user paths and removes the copied evidence liability before the guide becomes a redirect.

1. **Record a fresh pre-change snapshot.** Capture both URLs in GSC pages, page-query, index coverage, GSC Links, available Ahrefs target evidence, and internal analytics. Record the exact window and deploy time.
2. **Repair the three guide inlinks.** Apply the link changes in the ledger above. In the early-relationship article, remove or rewrite the copied 457-couple paragraph without replacing it with the 2,250-person web dataset.
3. **Do not edit the matrix.** No guide prose, table, FAQ, schema, image, title, or metadata moves into the winner under this decision.
4. **Unpublish the guide without deleting it.** Set only `published: false` in `src/blog/enneagram/enneagram-compatibility-guide.md`. Keep the file as the audit record. Do not change `lastmod`.
5. **Add the direct permanent redirect.** In `src/routes/enneagram-corner/[slug]/+page.ts`, add:

   ```ts
   'enneagram-compatibility-guide': '/enneagram-corner/enneagram-compatibility-matrix'
   ```

   Use the existing `permanentRedirectMap`. Do not add a `vercel.json` rule. The current map returns 301 and appends `url.search`, so query strings remain intact.
6. **Regenerate derived state through its owners.** Run `pnpm gen:sitemap`, confirm the guide drops and the matrix remains, then run `pnpm index:blogs:dry`. Run the live blog-index sync only after the deployment is ready and the dry run shows the guide becoming unpublished. Do not hand-edit canonical markup or `static/sitemap.xml`.
7. **Run local verification.** Build or check the touched route and content, validate the matrix page, parse JSON-LD, inspect internal links, verify zero article `lastmod` changes, and run `git diff --check`.
8. **Deploy as one compatibility-retirement unit.** Link cleanup, evidence cleanup, unpublish, redirect, generated sitemap, and search-index state must not be split across deployments.
9. **Verify production.** Confirm the redirect is one hop, query strings survive, the target is 200 and self-canonical, the guide is absent from sitemap and site search, and no internal source still links to the guide.
10. **Submit and monitor.** In GSC URL Inspection, confirm the loser resolves to the winner, then request indexing for the changed winner only if DJ wants the manual prompt. Measure the combined two-URL cluster at two weeks, four weeks, and the clean 28-day comparison. Do not judge the redirect from a one-week dip.

## 9. Redirect, sitemap, canonical, and analytics checks

### Required production checks

```sh
curl -I https://9takes.com/enneagram-corner/enneagram-compatibility-guide
curl -I 'https://9takes.com/enneagram-corner/enneagram-compatibility-guide?utm_source=t31-check'
curl -I https://9takes.com/enneagram-corner/enneagram-compatibility-matrix
curl -sIL https://9takes.com/enneagram-corner/enneagram-compatibility-guide
rg -n 'enneagram-compatibility-guide' static/sitemap.xml src/blog src/lib src/routes
rg -n '457|20\.7%|17\.9%|17\.5%|17\.3%|73\.4%' src/blog/enneagram --glob '!**/*.bak'
```

Expected results after implementation:

- Guide returns HTTP 301 with `Location: /enneagram-corner/enneagram-compatibility-matrix`.
- The query-string request preserves `?utm_source=t31-check`.
- The redirect trace contains exactly two responses: one 301 and one 200.
- Matrix remains HTTP 200 with a self-referencing canonical and `index, follow`.
- Guide does not emit a canonical page because it no longer emits HTML; it redirects.
- Sitemap contains the matrix and not the guide.
- No live source or shared component links to the guide.
- The withdrawn numbers remain only in historical source, taskers, and explicit rejection records, not in a published article or copied schema. The unpublished guide file may retain them for audit history.
- On-site Enneagram listing and Supabase blog search do not show the guide.
- No article `lastmod` changes.

### Measurement

Track the cluster total, not just the winner:

- Matrix and guide clicks, impressions, CTR, and position.
- `enneagram compatibility chart`, `enneagram compatibility`, `enneagram compatibility guide`, and relationship-compatibility query groups.
- Matrix section URLs, especially the 456-impression `all-81-combinations` anchor and the 31-impression quick-reference anchor.
- Guide 301 hits, any 404s, and internal referral paths in available analytics or logs.
- Newly reported external links to either URL.

Annotate the deploy time. At two weeks, check technical transfer only. At four weeks and the clean 28-day window, compare the combined cluster with the baseline. Do not fabricate or promise a click lift.

## 10. Expected upside and downside

### Expected upside

- Removes a currently excluded, zero-click page that republishes unsupported evidence.
- Stops maintaining two pages for the same compatibility and relationship job.
- Sends the guide's remaining URL and internal-link signals to the established matrix in one hop.
- Replaces three live guide links with direct matrix links.
- Removes machine-readable FAQ claims based on the withdrawn dataset.
- Keeps the matrix protected from an unnecessary broad content graft while T-26 handles its own bounded improvements.

### Expected downside

- The guide's historical long-tail impressions may disappear before Google fully attributes the redirect.
- The anti-chart framing, compact type-needs list, separate image, and guide FAQ presentation leave the public site. None has demonstrated independent search or link value, and the source remains recoverable in-tree.
- A redirect can produce a short consolidation dip. The correct measure is the two-URL cluster after recrawl, not the winner alone in week one.
- Retirement does not fix the matrix's 81-versus-45 promise, weak section CTR, or unsupported research language. Those remain T-26 editorial work.

No click projection is offered. The strongest expected benefit is lower evidence risk and cleaner URL ownership, not a guaranteed traffic increase.

## 11. Exact DJ approval required

DJ must explicitly approve this package:

> Approve Option C: retire `/enneagram-corner/enneagram-compatibility-guide` without salvaging any guide content into the matrix; update its three internal inlinks to the matrix; remove or evidence-safely rewrite the copied 457-couple paragraph in `how-to-navigate-early-relationship-stages`; set the guide to `published: false` without changing `lastmod`; add a direct query-preserving 301 in the existing Enneagram `permanentRedirectMap`; regenerate sitemap and blog-index state; deploy and run the listed post-deploy checks. Leave the matrix article, title, metadata, canonical, and `lastmod` unchanged in this retirement implementation.

Without that approval, both pages remain published, self-canonical, indexable, and submitted, and no redirect is authorized.

## 12. Verification and limitations

Completed for this decision:

- Read T-05, T-07, T-26, T-23's audit and complete compatibility inventory row, T-28's backlink baseline, the T-27 tasker, and the full current matrix and guide including visible FAQs and JSON-LD.
- Checked the fresh 2026-08-13 GSC page and page-query exports.
- Read the current redirect implementation, sitemap entries, canonical/robots implementation, blog index, and every source-visible compatibility link.
- Verified both public URLs return 200 and self-canonical `index, follow` HTML.
- Verified the legacy `/blog/enneagram/enneagram-compatibility-matrix` link returns one 301 to the matrix.
- Reopened the guide's cited source and confirmed the sample and methodology mismatch.
- Rechecked the evidence boundary against the Enneagram systematic review, the 324-couple dissertation, and practitioner doctrine.
- Confirmed no current article, route, sitemap, canonical, publication state, redirect, or `lastmod` diff was made.

Limitations:

- Search Console suppresses low-volume page-query rows, so only five of the guide's 218 historical impressions are attributable to disclosed queries.
- The free backlink reports are incomplete snapshots. Inbound links must be rechecked immediately before implementation.
- The missing T-26 and T-27 final deliverables could contain additional matrix recommendations, but no later matrix change should make unsupported guide material salvageable.
- This is a decision record. It intentionally does not implement the approved sequence.
