---
artifact: perspective-review
schema_version: 1
subject: Frank-Lloyd-Wright
perspective: future
draft_sha256: cae935d9cbcc938f60b3749cf4ab6d36336b184095e5e0136690593fe6359aab
review_status: complete
trust: intact
value: high
delight: clear_hit
recommendation: revise
blockers: 0
concerns: 5
reviewed_at: 2026-08-26T19:05:54Z
path: docs/content-analysis/perspective-reviews/Frank-Lloyd-Wright/2026-08-26_135348/future.md
---

## Bottom-line verdict

Twelve months from now this article will still be accurate, still comprehensible, and still worth reading, and that is not luck. The subject died in 1959, and the draft treats that as the asset it is: no trend hook, no "why he matters now" section, no living-person status claims, and — per a scan of the entire reader-visible body — zero instances of "recently," "currently," "today," "now" as a time marker, or "upcoming." Every "still" in the piece sits inside past-tense narration. The one recent-news anchor is absolutely dated and deliberately quarantined as an appendix.

The durability surface is therefore small, and every finding below lives on it. Five concerns, no blockers. Four of the five are three-to-ten-word repairs or a one-line frontmatter addition; none of them threatens the thesis, the structure, or the voice.

The one pattern worth naming: the piece's single most perishable sentence is also its only sentence with no source a reader can reach. Given the draft's own ledgers show three careful revision passes, that inversion reads as an oversight rather than a choice, and it is the cheapest thing on this list to fix.

I recommend **revise** rather than **pass** only because the draft is still `published: false`. Revision is free right now and will not be later.

## What landed

**FUTURE-H1 — The recency anchor is dated _and_ reports the project rather than the outcome.**

> "Fallingwater's leaks have been so persistent that in March 2026 the Western Pennsylvania Conservancy completed a roughly $7 million renovation to address what _The Art Newspaper_ called 'endemic leaking problems.'"

Two separate durability virtues in one sentence. First, an absolute date — no "recently," no "just completed." Second, and better, it reports the _existence of a project_ and quotes a _characterization_; it never claims the leaks are now fixed. That distinction is load-bearing. The article's own thesis is that Wright's buildings leak, so an outcome claim ("the problem is solved") would have been a hostage to the next Fallingwater leak story. As written, this sentence is as true in 2037 as in 2026. **Must survive revision verbatim**, apart from the citation addition in FUTURE-C1.

**FUTURE-H2 — Delete the newest fact and nothing collapses.**

I ran the removal test the role requires. Cut the March 2026 sentence entirely and the paragraph still opens on "Wright's buildings leaked. They leaked badly," still lands on "Every Wright client has a version of the Wingspread dinner," and the section's actual argument — the 8-wing reframe arriving as dominion — is untouched. The thesis rests on 1909, 1914, 1923, 1935, 1957. All closed history. The 2026 material is an appendix used as an appendix, which is exactly the discipline this role exists to check for and rarely finds.

**FUTURE-H3 — Absolute dating is the default, not the exception.**

September 1909; August 15, 1914; September 1, 1923; October 1926; 1932; autumn 1935; 1936–1939; January 1938; 1939; September 1 and September 28, 1957; April 9, 1959; October 21, 1959. The closing paragraph pins both the death and the Guggenheim opening to exact dates and then states the interval between them. A reader in 2027, or 2035, reconstructs the chronology without knowing when the article was written — which is the actual test.

**FUTURE-H4 — The paywall limitation is disclosed instead of hidden.**

> "The essay is paywalled, so take it as corroboration of a label and nothing further. We have read only the title and the opening lines."

This ages better than any amount of confident sourcing. A future reader who clicks through and hits the paywall finds the article already told them; a future editor knows precisely what was and was not verified. Most corpora bury this and pay for it at the first refresh.

**FUTURE-H5 — Type claims are argued, not decreed.**

The counter-typing sections concede what the rival reading is correctly seeing ("What those readers are seeing is real... In Enneagram terms that is the Seven's growth line to Five") before answering it. An argued position does not expire when a consensus shifts; a decreed one does. This is why the typing content will still read as reasonable in a year even to someone who disagrees with it.

## What missed

Nothing in the durability lane misses outright. The gaps are the five concerns below, and all are of the "hardening" class rather than the "this does not work" class.

The closest thing to a genuine miss is **FUTURE-C1**: the draft cites _The Art Newspaper_ by name inside the prose but gives the reader no way to reach it, which is the one place the piece's sourcing posture and its actual sourcing come apart.

## What I expected

A durability review expects four things. Scoring them:

1. **Absolute dates on all time-relative language.** Present, thoroughly. (H3)
2. **News material quarantined so the thesis does not depend on it.** Present. (H2)
3. **An as-of anchor on any live third-party statistic.** Partially present — the building count is hedged ("tallies vary by who is counting") but not dated. (C3)
4. **Retrieval dates or archive fallbacks recorded for non-Wikipedia citations.** Absent from the draft. The evidence packet records `fetched 2026-08-26` per source, but that lives in the packet, not in the draft's own `RESEARCH SOURCES` ledger — so a future refresh working only from the draft cannot tell when any URL was last known good. (C4)

I also expected, and did not find, any of the failure modes this role usually catches: an ongoing controversy stated as resolved, a temporary status stated as permanent, or context that evaporates when a news cycle turns. There are none.

## What surprised me

**Welcome.** A subject dead since 1959 usually tempts a writer to bolt on a relevance section — a "what Wright teaches us in an age of X" beat that rots within two news cycles. This draft has none, and the closing instead reaches for 1959 imagery (the crowd on the spiral) rather than 2026. That is a deliberate-looking choice and it is the right one.

**Jarring.** The inversion in FUTURE-C1. The twelve `citations:` entries include six Wikipedia articles — the most durable, least contestable sources on the page — and omit the one source supporting the only claim a 2027 reader could plausibly doubt. The renovation sources exist; they are sitting in an HTML comment the reader never sees.

## Red flags

None. No blockers.

To be explicit about what I checked and cleared rather than leaving it implied:

- The March 2026 completion claim is **not** already misleading. Fallingwater announced the three-year "World Heritage Preserved" project complete at its March 14, 2026 tour-season opening, and Archinect, Dezeen, and the IHBC all report completion. The Art Newspaper's "scheduled for completion in April" reflects residual terrace masonry, painting, and window conservation, which the steward itself disclosed. The draft's framing is defensible. Two small imprecisions are folded into FUTURE-C2's sibling note below rather than escalated.
- No ongoing controversy is stated as resolved.
- No internal link target is broken: all five `/enneagram-corner/` slugs exist and are `published: true` as of 2026-08-26, and all four `suggestions:` slugs have drafts.

## Specific improvements

### FUTURE-C1 — The only perishable claim carries no reader-visible or schema-visible source (highest priority)

- **Location:** H2 "What Wright meant when he told a client to move his chair," opening paragraph — the March 2026 Fallingwater renovation sentence. Frontmatter `citations:` block.
- **Reader effect / trust problem:** `citations:` feeds two surfaces — `ArticleSources.svelte` (the reader-visible source list) and `personJsonLd.ts`, which maps it to `node.citation` in the Person schema. Its twelve entries contain no Art Newspaper, Smithsonian, Dezeen, or Archinect URL; the only Fallingwater entry is the historical "Designing Fallingwater" page. The renovation sources exist only inside the `RESEARCH SOURCES` HTML comment, which never reaches a reader. So the piece names _The Art Newspaper_ in prose as its authority and then gives no way to check it. In twelve months, when this is a two-year-old status claim on a preservation project, it is simultaneously the most doubtable sentence on the page and the least verifiable.
- **Evidence:** `citations:` enumerated from the snapshot (12 entries, verified by grep); consumption confirmed at `src/lib/components/blog/ArticleSources.svelte:3`, `src/lib/components/blog/PeopleBlogPageHead.svelte:95`, and `src/lib/utils/personJsonLd.ts:163-167`.
- **Minimum viable repair:** add `https://www.theartnewspaper.com/2026/03/16/fallingwater-endemic-leaking-problems-finally-come-to-an-end-frank-lloyd-wright` to `citations:`. One line. No body change.
- **Expected benefit:** the most perishable claim becomes among the best-sourced, and the Person JSON-LD gains the page's only 2026 citation.
- **Confidence:** high.
- **Acceptance test:** `citations:` contains an Art Newspaper or Fallingwater World-Heritage-Preserved URL, and it appears in the rendered `ArticleSources` list on the published page.

**Sibling note (same passage, lower priority, ~4 words):** the conservation work was led by Architectural Preservation Studio; the Western Pennsylvania Conservancy is the steward/owner. Naming WPC as the party that "completed" it is defensible for a commissioning owner but imprecise. Separately, the steward's own figure is **$7.5 million** while the trade press says $7 million — "roughly $7 million" covers both but rounds toward the lower. Both are optional polish, not durability risks.

### FUTURE-C2 — "You probably arrived holding 5w4" predicts a reader state this page's own success would falsify

- **Location:** H3 "Why Frank Lloyd Wright is not a Type 5," first sentence: _"If you have searched his type before, you probably arrived holding '5w4.'"_
- **Reader effect / trust problem:** this asserts what the reader saw before arriving. Two forces break it inside twelve months. First, the entity-gap packet identifies `frank lloyd wright enneagram type` as this page's one open lane — so if the page wins that lane, a growing share of readers arrive holding **7w8, from this page's own snippet**, and the article opens its counter-typing section by telling them something demonstrably untrue about themselves. The sentence is falsified by the page succeeding. Second, this query is increasingly mediated by AI answer surfaces, where what a searcher "arrives holding" is generated and shifts far faster than any blue-link ranking.
- **Evidence:** my own search confirms the 5w4 field is real and unusually _static_ — So Syncd, Sakinorva, MBTI Lounge, and a Typology Central thread, i.e. editorial pages rather than vote-churned Personality Database profiles (PDB returned no dedicated Wright profile). **The underlying 5w4 claim is therefore durable and should stay.** It is only the reader-state prediction that expires. The packet also flags that its SERP snapshot is "US-only, desktop, unpersonalized, one date."
- **Minimum viable repair:** state the claim instead of predicting the reader — e.g. "The most common answer online is '5w4,' and none of the sites that give it show their work." Net zero words; the rhetorical setup and the "none of them show their work" payoff both survive.
- **Expected benefit:** the section's competitive framing stops depending on a one-day SERP snapshot and stops being self-defeating on success.
- **Confidence:** high.
- **Acceptance test:** no sentence in the body asserts what the reader searched, saw, or believed before arriving; the 5w4 rival is characterised as a claim made by sources, not as a state of the reader. (FAQ #1's "Free typology aggregators mostly say 5w4" already passes this test and needs no change.)

### FUTURE-C3 — Live institutional statistic in undated present tense

- **Location:** final H2, the Philip Johnson rebuttal paragraph: _"The Frank Lloyd Wright Foundation counts 1,114 designs and 532 of them realized, though tallies vary by who is counting."_
- **Reader effect / trust problem:** "counts" is present tense on a figure the Foundation controls and can revise. The "tallies vary" hedge already does most of the protective work — this is hardening, not rescue.
- **Evidence:** volatility is genuinely low; 1,114/532 has been the Foundation's stable public figure for years. The exposure is the undated present tense, not the number.
- **Minimum viable repair:** "The Frank Lloyd Wright Foundation's count as of 2026 is 1,114 designs and 532 realized, though tallies vary by who is counting." Roughly +3 words.
- **Expected benefit:** the sentence stops silently claiming currency it cannot maintain, and a future refresh knows exactly which year to re-check.
- **Confidence:** medium-high.
- **Word budget:** body is at 4,488 against a 4,500 ceiling, so ~12 words of headroom — this fits, and FUTURE-C2's repair is net-zero. Per the corpus rule, cut before adding if anything else lands first.
- **Acceptance test:** every third-party statistic in the body is either dated or explicitly hedged as varying. This one would then be both.

### FUTURE-C4 — Two load-bearing citations sit on rot-prone URLs with no recorded fallback

- **Location:** `citations:` entries for `scjohnson.com/en/news-stories/blog/wingspread-prairie-style-house`, `enneagrammonthly.com/frank-lloyd-wright-1867-1959/`, and `invention.si.edu/invention-stories/lincoln-logs-inventor-john-lloyd-wright`.
- **Reader effect / trust problem:** the SC Johnson URL is a corporate marketing blog post and it is the **sole** support for the cold open — the entire Wingspread dinner scene, the article's first 200 words and its most-repeated anecdote. Corporate blog paths are pruned and migrated routinely. The Enneagram Monthly URL is a small independent paywalled publication, and the draft names it in reader-visible prose. Because `citations:` renders to readers _and_ to JSON-LD `node.citation`, rot produces visibly dead links on the one page whose competitive argument is "the aggregators don't show their work."
- **Evidence:** the evidence packet already records `invention.si.edu` returning **HTTP 403** and `britannica.com` returning 403 during research — i.e. citation-grade unreachability is not hypothetical here, it has already happened to one listed citation. Source-type risk assessed from publisher class (corporate blog, small independent paywalled title) rather than from a live link-check.
- **Minimum viable repair:** capture archive snapshots for those three URLs and record the archive URL or a `retrieved:` date against each entry in the draft's `RESEARCH SOURCES` ledger. No body change, no word cost.
- **Expected benefit:** a future refresh can repair a dead citation without re-running the whole research pass, and the cold open's evidentiary base stops being a single mutable corporate URL.
- **Confidence:** medium — rot is probabilistic, but the consequence is concentrated on the article's opening scene.
- **Note:** `web.archive.org` is not reachable via WebFetch from this environment, so this step is manual and cannot be verified by a later agent via fetch.
- **Acceptance test:** the `RESEARCH SOURCES` ledger records an archive URL or retrieval date for every non-Wikipedia citation; a link-check returns 200 or a recorded fallback for all 12 `citations:` entries.

### FUTURE-C5 — Publication-date signals will read stale on day one (DJ's call, not a repair)

- **Location:** frontmatter `date: '2026-05-13'`, `lastmod: '2026-05-13'`, `changefreq: 'monthly'`, `content_quality.graded_at: '2026-05-13'`, `published: false`.
- **Reader effect / trust problem:** the draft was substantially rebuilt on 2026-08-26 — its own second-pass and cohesion ledgers document the rewrite — and it carries a March 2026 news anchor. Published today it ships ~3.5 months stale; at my twelve-month horizon it reads fifteen months old while declaring `changefreq: monthly`. For a page whose whole pitch is "we did the work the aggregators didn't," a visibly stale date undercuts the pitch before the argument starts.
- **Repair:** none proposed. `lastmod` is user-managed by standing rule and I am not recommending an automated edit. This is flagged as a publish-time decision only.
- **Confidence:** high on the observation; not applicable to the fix.
- **Acceptance test:** at publish, the `date`/`lastmod` values are a conscious decision rather than 2026-05-13 inherited by default.

## Follow-on questions

**FUTURE-Q1 — Will the Fallingwater project be re-characterized before 2027?**
What would change: any post-completion leak or conservation reporting at Fallingwater. If that appears, shift the sentence from the project's completion to the phenomenon — "a three-year, $7m project addressed what _The Art Newspaper_ called 'endemic leaking problems'" — which drops the completion status entirely and cannot be embarrassed. Best sources: `fallingwater.org/projects/world-heritage-preservation/` and The Art Newspaper's Wright coverage.

**FUTURE-Q2 — Does the Foundation revise 1,114/532?**
What would change: a revised count turns FUTURE-C3's "as of 2026" anchor from decorative into load-bearing, and the hedge from sufficient into necessary. Best source: `franklloydwright.org`.

**FUTURE-Q3 — Does this page rank for `frank lloyd wright enneagram type`?**
What would change: if it ranks, FUTURE-C2's repair moves from prudent to necessary, because the "you arrived holding 5w4" line would then be addressing readers who arrived holding 7w8 from this page's own snippet. Best source: GSC data in `docs/data/gsc/`, three months after publish.

**FUTURE-Q4 — Does Vreeland's Enneagram Monthly essay come out from behind the paywall?**
What would change: reading it would upgrade the subtype corroboration from label-only to a real independent argument, which is the cheapest available credibility gain against an unevidenced aggregator field. Best source: `enneagrammonthly.com`, or a library/archive copy of the July 2024 issue.

**FUTURE-Q5 — flagged for the fact-checking lane, not a durability finding.**
The draft dates the Research Tower "built between 1944 and 1951"; the packet's S-04 says 1947–50. A static historical date is equally right or wrong in 2027, so this is explicitly _not_ a durability issue and I am not scoring it — but the "kept writing checks for fifteen years" line depends on the span, so it is worth a cross-check by whoever owns factual accuracy. Best source: SC Johnson company history / Wikipedia "Johnson Wax Headquarters."

## Preserve list

These exist because of durability and must survive revision:

1. **The March 2026 sentence's construction** — absolutely dated, and reporting the project plus a quoted characterization rather than an outcome. Change the citation, not the sentence. (H1)
2. **"The essay is paywalled, so take it as corroboration of a label and nothing further. We have read only the title and the opening lines."** — the disclosure that makes a fragile source safe to carry for years. (H4)
3. **"though tallies vary by who is counting"** — the hedge that keeps the building count from expiring. Add a date to it; do not remove it. (C3)
4. **Every absolute date**, and in particular the Wallace filming dates and the April 9 / October 21, 1959 pair that closes the piece. (H3)
5. **The absence of a "why he matters now" section.** This is a durability feature. A future refresh should not add one.

## Research log

Protocol: packet first, then role-specific research. Two external searches, both aimed at pre-stated questions.

| #   | Question stated before searching                                                                                                                                                        | Source consulted                                                                                                                                                                                                                                                                             | Decision it affected                                                                                                                                                                                                                                                                                                                                                                                                         |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0   | Baseline: what does the packet already settle?                                                                                                                                          | `evidence-packet.md` — CLM-29 (renovation, "verified with a timing wrinkle"), CLM-31 (aggregator claim, "first half verified, second half interpretation"), S-00 (SERP snapshot is US-only/desktop/one-date), S-10, S-39, Research limitations (403s on britannica.com and invention.si.edu) | Reused rather than re-researched. Supplied the 403 evidence for C4 and the SERP-fragility evidence for C2.                                                                                                                                                                                                                                                                                                                   |
| 1   | Did the three-year Fallingwater "World Heritage Preserved" project actually complete, and in March or April 2026? Has any later reporting revised the "finally come to an end" framing? | WebSearch → Fallingwater.org, Western Pennsylvania Conservancy, Archinect, Dezeen (2026-04-01), IHBC, illustrarch                                                                                                                                                                            | **Cleared the claim as not-misleading, so no blocker.** Completion announced at the March 14, 2026 season opening; residual terrace masonry, painting and window conservation ran into spring, which reconciles Art Newspaper's "scheduled for completion in April." Also surfaced the $7.5M steward figure vs $7M trade figure, and Architectural Preservation Studio as the party that led the work → the C1 sibling note. |
| 2   | Is the 5w4 aggregator consensus volatile enough to date the counter-typing frame within twelve months?                                                                                  | WebSearch → So Syncd, Sakinorva, MBTI Lounge, Typology Central; Personality Database returned no dedicated Wright profile                                                                                                                                                                    | **Downgraded my initial hypothesis.** The 5w4 field is static editorial pages, not vote-churned profiles, so the claim itself is durable and should stay. Narrowed C2 from "the whole frame is fragile" to the single reader-state sentence.                                                                                                                                                                                 |
| 3   | Do the internal link targets and suggestion slugs survive, and does `citations:` reach the reader?                                                                                      | Repo: five `/enneagram-corner/` targets all exist and are `published: true`; four `suggestions:` drafts exist; `ArticleSources.svelte:3`, `PeopleBlogPageHead.svelte:95`, `personJsonLd.ts:163-167`                                                                                          | Cleared internal links (no finding). Established that `citations:` is reader- and schema-visible, which is what makes C1 and C4 matter rather than being bookkeeping.                                                                                                                                                                                                                                                        |
| 4   | Does the reader-visible body contain relative-time language?                                                                                                                            | Regex scan of the body for recently/currently/now/today/upcoming/still/ongoing/as-of and similar                                                                                                                                                                                             | Zero unanchored hits; every "still" is in past-tense narration. Became H3.                                                                                                                                                                                                                                                                                                                                                   |

Community discussion was not used to establish any fact.

## Limits of this review

**Snapshot integrity — read this first.** The on-disk `draft-reviewed.md` hashes to `362a406e1c50734e99b6a1e265a09916e6a65458a4ce07ff5b6b7d8cce67a32f`, which matches **neither** `context.json`'s `draft_sha256` nor the supplied SHA (`cae935d9…`). I did not proceed on assumption. I diffed the snapshot against the live draft: the differences are 56 lines, all cosmetic — YAML single-vs-double quotes, `*emphasis*` rewritten as `_emphasis_`, and the `path:` frontmatter line relabelled to the snapshot's own path. Normalizing those three classes makes the two files **byte-identical**. The drift is a Prettier plus label-paths pass that ran over the snapshot after it was frozen (git shows the file staged and then modified); no prose changed. The reader-visible content I audited is the content at `cae935d9…`, which is why I recorded that SHA in the frontmatter — synthesis should match on the contract value. **The freeze mechanism itself is leaky and should be fixed** (exclude `docs/content-analysis/perspective-reviews/**` from format and label-paths tooling), or a future juror will face the same ambiguity with a real edit hiding inside it.

**Prior-pass commentary.** The snapshot embeds `FRESH EYES REVIEW`, `SECOND PASS NOTES`, and `COHESION PASS` HTML comments containing a prior grade and prior evaluator judgments. I read them as part of reading the file and did not anchor on them: none of my five concerns appears in those notes, and I reached FUTURE-C1 independently. I did not read any sibling perspective review.

**Scope.** I assessed temporal durability only. Typing correctness, fairness to the subject, prose quality, factual accuracy of static historical claims, and first-read comprehension are other jurors' lanes, and where I brushed against them (FUTURE-Q5) I flagged it as out of scope rather than scoring it.

**Research depth.** Two external searches plus the packet, per protocol. `web.archive.org` is not reachable via WebFetch from this environment, so FUTURE-C4's rot risk is assessed from publisher class rather than a live link-check, and the archive remedy could not be validated here. The Art Newspaper piece was read via search summary in the packet, not a full fetch; my completion finding rests on Fallingwater's own announcement plus Dezeen, Archinect, and IHBC converging.

**The core limit.** "One year later" is modeled, not observed. I can identify which claims are structurally exposed to time; I cannot know which events will actually occur. My confidence is highest on claim classes (undated present-tense statistics, reader-state predictions, single-URL dependencies) and lowest on specific predictions about what Fallingwater, the Foundation, or the aggregator sites will do.
